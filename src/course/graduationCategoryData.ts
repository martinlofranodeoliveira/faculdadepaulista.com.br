import { getGraduationCatalogCourseSummaries } from '@/lib/catalogApi'
import { formatGraduationCourseHeading } from '@/lib/courseRoutes'

export type GraduationCategoryCourse = {
  path: string
  title: string
  courseLabel: string
  courseValue: string
  courseId: number
  institutionId: number
  image: string
  oldInstallmentPrice: string
  installmentPrice: string
  modality: string
  modalityBadge: string
  area: string
  areaLabel: string
  fixedInstallments: boolean
}

function toMonthlyPriceLabel(value: string) {
  return value.trim()
}

export async function getGraduationCategoryCourses(force = false): Promise<GraduationCategoryCourse[]> {
  const entries = await getGraduationCatalogCourseSummaries(force)

  return entries.map((course) => ({
    path: course.path,
    title: formatGraduationCourseHeading(course.rawLabel, course.value, course.path),
    courseLabel: course.rawLabel,
    courseValue: course.value,
    courseId: course.courseId,
    institutionId: course.institutionId,
    image: course.image,
    oldInstallmentPrice: toMonthlyPriceLabel(course.oldInstallmentPrice),
    installmentPrice: toMonthlyPriceLabel(course.currentInstallmentPriceMonthly),
    modality: course.modality,
    modalityBadge: course.modalityBadge,
    area: course.areaSlug,
    areaLabel: course.primaryAreaLabel,
    fixedInstallments: course.fixedInstallments,
  }))
}
