import { getCoursePagePresentation } from '@/course/coursePageData'
import {
  buildCurriculumPdfFilename,
  createCurriculumPdfBuffer,
} from '@/course/curriculumPdf'
import { getGraduationCoursePages, getPostCoursePages } from '@/lib/courseCatalog'
import type { CourseType } from '@/lib/catalogApi'

export const prerender = false

function isCourseType(value: string | null): value is CourseType {
  return value === 'graduacao' || value === 'pos'
}

export async function GET({ url }: { url: URL }) {
  const typeParam = url.searchParams.get('type')
  const slug = url.searchParams.get('slug')?.trim() ?? ''

  if (!isCourseType(typeParam) || !slug) {
    return new Response('Parâmetros inválidos.', { status: 400 })
  }

  const courses = typeParam === 'graduacao' ? await getGraduationCoursePages() : await getPostCoursePages()
  const course = courses.find((entry) => entry.slug === slug)

  if (!course) {
    return new Response('Curso não encontrado.', { status: 404 })
  }

  const pageHeading =
    typeParam === 'graduacao'
      ? `GRADUAÇÃO EM ${course.title}`
      : `PÓS-GRADUAÇÃO EM ${course.title}`

  const presentation = getCoursePagePresentation({
    course: course,
    courseType: typeParam,
    title: course.title,
    rawLabel: course.rawLabel,
    area: course.primaryAreaLabel,
  })

  const pdf = createCurriculumPdfBuffer(pageHeading, presentation.curriculum)
  const filename = buildCurriculumPdfFilename(pageHeading)

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
