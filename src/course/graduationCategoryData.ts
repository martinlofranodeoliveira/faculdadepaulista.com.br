import { getGraduationCoursePages } from '@/lib/courseCatalog'

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
  const entries = await getGraduationCoursePages(force)

  return entries.map((course) => ({
    path: course.path,
    title: course.title,
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
