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

function normalizeDownloadText(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function wrapText(value: string, maxChars = 92): string[] {
  const normalized = normalizeDownloadText(value)
  if (!normalized) return ['']

  const lines: string[] = []

  for (const paragraph of normalized.split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    if (!words.length) {
      lines.push('')
      continue
    }

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
  }

  return lines
}

function buildCurriculumLines(pageHeading: string, entries: CurriculumEntry[]): string[] {
  const lines: string[] = [pageHeading, 'GRADE CURRICULAR', '']

  entries.forEach((entry, index) => {
    lines.push(`${entry.label} - ${entry.title}`)
    lines.push(`Carga horária: ${entry.hours}`)

    if (entry.summary) {
      lines.push(...wrapText(entry.summary))
    }

    if (entry.disciplines?.length) {
      lines.push('Disciplinas:')
      entry.disciplines.forEach((discipline) => {
        lines.push(...wrapText(`- ${discipline}`))
      })
    }

    if (index < entries.length - 1) {
      lines.push('')
    }
  })

  return lines
}

export function buildCurriculumPdfFilename(pageHeading: string): string {
  return `${slugifyFilePart(pageHeading)}-matriz-curricular.txt`
}

export function buildCurriculumPdfUrl(courseType: CourseType, slug: string, variantId?: string | number): string {
  const search = new URLSearchParams({
    type: courseType,
    slug,
  })

  if (variantId !== undefined && variantId !== null && `${variantId}`.trim()) {
    search.set('variant', `${variantId}`)
  }

  return `/api/curriculum-pdf?${search.toString()}`
}

export function createCurriculumPdfBuffer(pageHeading: string, entries: CurriculumEntry[]): Buffer {
  const text = `${buildCurriculumLines(pageHeading, entries).join('\n')}\n`
  return Buffer.from(`\uFEFF${text}`, 'utf8')
}
