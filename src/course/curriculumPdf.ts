import type { CourseType } from '@/lib/catalogApi'

type CurriculumEntry = {
  label: string
  title: string
  hours: string
  summary?: string
  disciplines?: string[]
}

function slugifyFilePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizePdfText(value: string): string {
  return value
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function escapePdfText(value: string): string {
  return normalizePdfText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function wrapPdfLine(value: string, maxChars = 92): string[] {
  const normalized = normalizePdfText(value)
  if (!normalized) return ['']

  const words = normalized.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxChars) {
      current = next
      continue
    }

    if (current) lines.push(current)
    current = word
  }

  if (current) lines.push(current)
  return lines
}

function chunkPages(lines: string[], linesPerPage = 42): string[][] {
  const pages: string[][] = []
  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage))
  }
  return pages.length ? pages : [[]]
}

function buildCurriculumLines(entries: CurriculumEntry[]): string[] {
  const lines: string[] = []

  entries.forEach((entry) => {
    lines.push(`${entry.label} - ${entry.title}`)
    lines.push(`Carga horária: ${entry.hours}`)

    if (entry.summary) {
      lines.push(...wrapPdfLine(entry.summary))
    }

    if (entry.disciplines?.length) {
      lines.push('Disciplinas:')
      entry.disciplines.forEach((discipline) => {
        lines.push(...wrapPdfLine(`- ${discipline}`))
      })
    }

    lines.push('')
  })

  return lines
}

export function buildCurriculumPdfFilename(pageHeading: string): string {
  return `${slugifyFilePart(pageHeading)}-matriz-curricular.pdf`
}

export function buildCurriculumPdfUrl(courseType: CourseType, slug: string): string {
  const search = new URLSearchParams({
    type: courseType,
    slug,
  })

  return `/api/curriculum-pdf?${search.toString()}`
}

export function createCurriculumPdfBuffer(pageHeading: string, entries: CurriculumEntry[]): Buffer {
  const contentLines = buildCurriculumLines(entries)
  const pages = chunkPages(contentLines)

  const objects: string[] = []
  const addObject = (value: string) => {
    objects.push(value)
    return objects.length
  }

  const catalogId = addObject('')
  const pagesId = addObject('')
  const regularFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  const boldFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

  const pageObjectIds: number[] = []

  pages.forEach((pageLines, pageIndex) => {
    const totalPages = pages.length
    const commands: string[] = ['BT']
    let y = 792

    commands.push('/F2 18 Tf')
    commands.push(`1 0 0 1 48 ${y} Tm (${escapePdfText(pageHeading)}) Tj`)
    y -= 28

    commands.push('/F2 12 Tf')
    commands.push(`1 0 0 1 48 ${y} Tm (${escapePdfText('GRADE CURRICULAR')}) Tj`)
    y -= 22

    commands.push('/F1 11 Tf')

    pageLines.forEach((line) => {
      commands.push(`1 0 0 1 48 ${y} Tm (${escapePdfText(line)}) Tj`)
      y -= line ? 16 : 10
    })

    commands.push('/F1 10 Tf')
    commands.push(`1 0 0 1 48 28 Tm (${escapePdfText(`Página ${pageIndex + 1} de ${totalPages}`)}) Tj`)
    commands.push('ET')

    const content = commands.join('\n')
    const contentLength = Buffer.byteLength(content, 'latin1')
    const contentId = addObject(`<< /Length ${contentLength} >>\nstream\n${content}\nendstream`)
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    )
    pageObjectIds.push(pageId)
  })

  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`
  objects[pagesId - 1] = `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>`

  let pdf = '%PDF-1.4\n%âãÏÓ\n'
  const offsets: number[] = [0]

  objects.forEach((object, index) => {
    offsets[index + 1] = Buffer.byteLength(pdf, 'latin1')
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })

  const xrefStart = Buffer.byteLength(pdf, 'latin1')

  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'

  for (let index = 1; index <= objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  return Buffer.from(pdf, 'latin1')
}
