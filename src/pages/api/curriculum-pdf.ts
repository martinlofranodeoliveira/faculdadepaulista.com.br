import { getCoursePagePresentation } from '@/course/coursePageData'
import {
  buildCurriculumPdfFilename,
  createCurriculumPdfBuffer,
} from '@/course/curriculumPdf'
import { getGraduationCoursePageBySlug, getPostCoursePageBySlug } from '@/lib/courseCatalog'
import type { CourseType } from '@/lib/catalogApi'
import { formatPostCourseHeading } from '@/lib/courseRoutes'

export const prerender = false

function isCourseType(value: string | null): value is CourseType {
  return value === 'graduacao' || value === 'pos'
}

export async function GET({ url }: { url: URL }) {
  const typeParam = url.searchParams.get('type')
  const slug = url.searchParams.get('slug')?.trim() ?? ''
  const variantParam = url.searchParams.get('variant')?.trim() ?? ''
  const variantId = Number.parseInt(variantParam, 10)

  if (!isCourseType(typeParam) || !slug) {
    return new Response('Parâmetros inválidos.', { status: 400 })
  }

  const course =
    typeParam === 'graduacao'
      ? await getGraduationCoursePageBySlug(slug)
      : await getPostCoursePageBySlug(slug)

  if (!course) {
    return new Response('Curso não encontrado.', { status: 404 })
  }

  const pageHeading =
    typeParam === 'graduacao'
      ? `GRADUAÇÃO EM ${course.title}`
      : formatPostCourseHeading(course.title)

  const selectedVariant =
    typeParam === 'pos' && Number.isFinite(variantId)
      ? course.curriculumVariants.find((variant) => variant.id === variantId) ?? null
      : typeParam === 'pos'
        ? course.curriculumVariants[0] ?? null
        : null

  const curriculumEntries =
    selectedVariant?.disciplines.length
      ? [
          {
            label: selectedVariant.totalHours ? `${selectedVariant.totalHours}H` : 'Disciplinas',
            title: selectedVariant.name || `Matriz curricular de ${course.title}`,
            hours: `${selectedVariant.totalHours || selectedVariant.disciplines.reduce((sum, discipline) => sum + discipline.hours, 0)}h`,
            disciplines: selectedVariant.disciplines.map((discipline) => discipline.name),
          },
        ]
      : getCoursePagePresentation({
          course: course,
          courseType: typeParam,
          title: course.title,
          rawLabel: course.rawLabel,
          area: course.primaryAreaLabel,
        }).curriculum

  const pdf = createCurriculumPdfBuffer(pageHeading, curriculumEntries)
  const filename = buildCurriculumPdfFilename(pageHeading)

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}

