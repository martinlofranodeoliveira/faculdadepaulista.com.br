import type { CatalogCourse } from '@/lib/catalogApi'
import {
  getGraduationCoursePageSummaries,
  getPostCoursePageSummaries,
  type CoursePageSummaryEntry,
} from '@/lib/courseCatalog'
import { formatPostCourseHeading } from '@/lib/courseRoutes'

import { getCourseFaqItems } from './courseFaqData'
import { getCoursePagePresentation, type CoursePresentation } from './coursePageData'
import { buildCurriculumPdfUrl } from './curriculumPdf'

export type CourseType = 'graduacao' | 'pos'

export interface CoursePageProps {
  courseType: CourseType
  title: string
  description: string
  leadSubmitted?: boolean
  area?: string
  rawLabel?: string
  courseValue?: string
  courseId?: number
  currentPath?: string
  courseData?: CatalogCourse
}

export interface CurriculumVariant {
  id: string
  chipLabel: string
  option: string
  totalHours: number
  curriculum: Array<{ title: string; hours: string }>
  downloadHref: string
  downloadFilename: string
}

export interface CoursePageViewModel {
  categoryLabel: string
  categoryPath: string
  pageHeading: string
  breadcrumbCurrentLabel: string
  presentation: CoursePresentation
  courseFaqItems: ReturnType<typeof getCourseFaqItems>
  relatedCourses: Array<{
    path: string
    title: string
    description: string
    image: string
    courseType: CourseType
    oldInstallmentPrice: string
    currentInstallmentPriceMonthly: string
  }>
  whatsappHref: string
  curriculumTotalHours: number
  curriculumDownloadHref: string
  curriculumDownloadFilename: string
  curriculumVariants: CurriculumVariant[]
  activeCurriculumVariant: CurriculumVariant | null
}

export function parseHoursValue(value: string): number {
  const match = value.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 0
}

export function formatHoursLabel(value: string): string {
  const hours = parseHoursValue(value)
  return hours ? `${hours} horas` : value
}

function slugifyFilePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildBreadcrumbCurrentLabel(courseType: CourseType, title: string, rawLabel?: string) {
  if (courseType === 'pos') return formatPostCourseHeading(title)

  const normalized = (rawLabel ?? '').toLowerCase()

  if (normalized.includes('presencial')) return `Graduação Presencial em ${title}`
  if (normalized.includes('semipresencial')) return `Graduação Semipresencial em ${title}`
  return `Graduação EAD em ${title}`
}

function mapRelatedCourses(pool: CoursePageSummaryEntry[], currentPath: string | undefined) {
  return pool
    .filter((entry) => entry.path !== currentPath)
    .slice(0, 4)
    .map((entry) => ({
      path: entry.path,
      title: entry.title,
      description: '',
      image: entry.image,
      courseType: entry.courseType,
      oldInstallmentPrice: entry.oldInstallmentPrice,
      currentInstallmentPriceMonthly: entry.currentInstallmentPriceMonthly,
    }))
}

function mapPostCurriculumVariants(course: CatalogCourse, pageHeading: string): CurriculumVariant[] {
  return course.curriculumVariants.map((variant) => {
    const curriculum = variant.disciplines.map((discipline) => ({
      title: discipline.name,
      hours: `${discipline.hours}h`,
    }))
    const totalHours =
      variant.totalHours || curriculum.reduce((sum, item) => sum + parseHoursValue(item.hours), 0)
    const chipLabel = totalHours ? `${totalHours}H` : variant.name.toUpperCase()
    const option = totalHours ? `${totalHours} Horas` : variant.name
    const filename = `${slugifyFilePart(pageHeading)}-${slugifyFilePart(chipLabel)}-matriz-curricular.txt`

    return {
      id: String(variant.id || chipLabel.toLowerCase()),
      chipLabel,
      option,
      totalHours,
      curriculum,
      downloadHref:
        course.teachingPlanUrl || buildCurriculumPdfUrl('pos', course.slug, variant.id || chipLabel.toLowerCase()),
      downloadFilename: course.teachingPlanUrl
        ? course.teachingPlanUrl.split('/').pop() || filename
        : filename,
    }
  })
}

export async function getCoursePageViewModel({
  courseType,
  title,
  area,
  rawLabel,
  currentPath,
  courseData,
}: CoursePageProps): Promise<CoursePageViewModel> {
  const categoryLabel = courseType === 'pos' ? 'Pós-graduação' : 'Graduação'
  const categoryPath = courseType === 'pos' ? '/pos-graduacao' : '/graduacao'
  const pageHeading =
    courseType === 'pos' ? formatPostCourseHeading(title).toUpperCase() : `GRADUAÇÃO EM ${title}`
  const breadcrumbCurrentLabel = buildBreadcrumbCurrentLabel(courseType, title, rawLabel)
  const presentation = getCoursePagePresentation({
    course: courseData,
    courseType,
    title,
    rawLabel,
    area,
  })
  const courseFaqItems = getCourseFaqItems({ courseType })

  const relatedPool =
    courseType === 'pos' ? await getPostCoursePageSummaries() : await getGraduationCoursePageSummaries()

  const relatedCourses = mapRelatedCourses(relatedPool, currentPath)
  const whatsappHref = ''

  const curriculumVariants =
    courseType === 'pos' && courseData ? mapPostCurriculumVariants(courseData, pageHeading) : []

  const activeCurriculumVariant = curriculumVariants[0] ?? null
  const curriculumSource =
    activeCurriculumVariant?.curriculum ??
    presentation.curriculum.map((item) => ({ title: item.title, hours: item.hours }))
  const curriculumTotalHours =
    activeCurriculumVariant?.totalHours ??
    curriculumSource.reduce((total, item) => total + parseHoursValue(item.hours), 0)
  const curriculumDownloadHref =
    courseType === 'graduacao'
      ? courseData?.teachingPlanUrl || (courseData ? buildCurriculumPdfUrl('graduacao', courseData.slug) : '')
      : activeCurriculumVariant?.downloadHref ??
        courseData?.teachingPlanUrl ??
        (courseData ? buildCurriculumPdfUrl('pos', courseData.slug, activeCurriculumVariant?.id) : '')
  const curriculumDownloadFilename =
    courseType === 'graduacao'
      ? ((courseData?.teachingPlanUrl ? courseData.teachingPlanUrl.split('/').pop() || '' : '') ||
        `${slugifyFilePart(pageHeading)}-matriz-curricular.txt`)
      : activeCurriculumVariant?.downloadFilename ??
        ((courseData?.teachingPlanUrl ? courseData.teachingPlanUrl.split('/').pop() || '' : '') ||
          `${slugifyFilePart(pageHeading)}-matriz-curricular.txt`)

  return {
    categoryLabel,
    categoryPath,
    pageHeading,
    breadcrumbCurrentLabel,
    presentation,
    courseFaqItems,
    relatedCourses,
    whatsappHref,
    curriculumTotalHours,
    curriculumDownloadHref,
    curriculumDownloadFilename,
    curriculumVariants,
    activeCurriculumVariant,
  }
}
