import {
  formatGraduationCourseHeading,
  normalizeComparableText,
  stripGraduationModality,
} from '@/lib/courseRoutes'
import {
  getGraduationCatalogCourses,
  getPostCatalogCoursesByArea,
  getPostCatalogCourses,
  type CatalogCourse,
} from '@/lib/catalogApi'

import type {
  LandingCourseOption,
  LandingGraduationCourseCard,
  LandingPostArea,
  LandingPageData,
  LandingPostCourse,
  LandingPresentialCourse,
} from './landingModels'

const FIXED_PRESENTIAL_COURSES: Array<
  Pick<
    LandingPresentialCourse,
    | 'title'
    | 'mode'
    | 'image'
    | 'imageAlt'
    | 'imageWidth'
    | 'imageHeight'
    | 'cardClassName'
    | 'imageClassName'
    | 'startDate'
    | 'currentPrice'
    | 'originalPriceLabel'
  > & {
    fallbackId: string
    fallbackCourseValue: string
    fallbackCourseLabel: string
    fallbackSemesterCount?: number
  }
> = [
  {
    fallbackId: 'bacharelado-em-enfermagem',
    fallbackCourseValue: 'graduacao-bacharelado-em-enfermagem',
    fallbackCourseLabel: 'Enfermagem Presencial',
    title: 'Enfermagem',
    mode: 'Bacharelado Presencial',
    image: '/landing/presential-enfermagem-figma.webp',
    imageAlt: 'Imagem do curso de Enfermagem',
    imageWidth: 252,
    imageHeight: 423,
    imageClassName: 'is-wide',
    startDate: 'Início das aulas: 01/07/26',
    currentPrice: 'R$ 449,00/MÊS',
    originalPriceLabel: 'De R$ 1.890,00',
    fallbackSemesterCount: 10,
  },
  {
    fallbackId: 'bacharelado-em-psicologia',
    fallbackCourseValue: 'graduacao-bacharelado-em-psicologia',
    fallbackCourseLabel: 'Psicologia Presencial',
    title: 'Psicologia',
    mode: 'Bacharelado Presencial',
    image: '/landing/presential-psicologia-figma.webp',
    imageAlt: 'Imagem do curso de Psicologia',
    imageWidth: 252,
    imageHeight: 423,
    cardClassName: 'lp-presential-card--compact-image',
    imageClassName: 'is-compact',
    startDate: 'Início das aulas: 01/07/26',
    currentPrice: 'R$ 549,00/MÊS',
    originalPriceLabel: 'De R$ 1.890,00',
    fallbackSemesterCount: 10,
  },
]

function sortByLabel<T extends { label?: string; title?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = a.label ?? a.title ?? ''
    const right = b.label ?? b.title ?? ''
    return left.localeCompare(right, 'pt-BR')
  })
}

function buildCourseOption(course: CatalogCourse): LandingCourseOption {
  return {
    value: course.value,
    label: course.rawLabel,
    courseId: course.courseId,
  }
}

function resolveSemesterCount(
  course?: Pick<CatalogCourse, 'semesterCount' | 'durationMonths' | 'durationContinuousMonths'> | null,
  fallback = 0,
) {
  const semesterCount = Number(course?.semesterCount ?? 0)
  if (semesterCount > 0) return semesterCount

  const durationMonths = Number(course?.durationMonths ?? course?.durationContinuousMonths ?? 0)
  if (durationMonths > 0) {
    return Math.max(1, Math.round(durationMonths / 6))
  }

  return fallback
}

function buildGraduationCard(course: CatalogCourse): LandingGraduationCourseCard {
  return {
    courseValue: course.value,
    courseLabel: course.rawLabel,
    courseId: course.courseId,
    modality: course.modality,
    title: formatGraduationCourseHeading(course.rawLabel, course.value, course.path),
    image: course.image,
    modalityLabel: course.modalityBadge,
    semesterCount: resolveSemesterCount(course),
    installmentPrice: course.currentInstallmentPriceMonthly || course.currentInstallmentPrice,
    oldInstallmentPrice: course.oldInstallmentPrice,
    fixedInstallments: true,
  }
}

function buildFixedPresentialCourses(graduationCourses: CatalogCourse[]): LandingPresentialCourse[] {
  return FIXED_PRESENTIAL_COURSES.map((fixedCourse) => {
    const dynamicCourse = graduationCourses.find((course) => {
      if (course.modality !== 'presencial') return false

      return (
        normalizeComparableText(stripGraduationModality(course.title)) ===
        normalizeComparableText(fixedCourse.title)
      )
    })

    return {
      id: dynamicCourse?.slug || fixedCourse.fallbackId,
      courseValue: dynamicCourse?.value || fixedCourse.fallbackCourseValue,
      courseLabel: dynamicCourse?.rawLabel || fixedCourse.fallbackCourseLabel,
      courseId: dynamicCourse?.courseId ?? 0,
      courseModality: 'presencial',
      title: formatGraduationCourseHeading(
        dynamicCourse?.rawLabel || fixedCourse.title,
        dynamicCourse?.value || fixedCourse.fallbackCourseValue,
        dynamicCourse?.path || `/graduacao/${fixedCourse.fallbackId}`,
      ),
      mode: fixedCourse.mode,
      image: fixedCourse.image,
      imageAlt: fixedCourse.imageAlt,
      imageWidth: fixedCourse.imageWidth,
      imageHeight: fixedCourse.imageHeight,
      cardClassName: fixedCourse.cardClassName,
      imageClassName: fixedCourse.imageClassName,
      startDate: fixedCourse.startDate,
      currentPrice: fixedCourse.currentPrice,
      originalPriceLabel: fixedCourse.originalPriceLabel,
      semesterCount: resolveSemesterCount(dynamicCourse, fixedCourse.fallbackSemesterCount ?? 0),
      fixedInstallments: true,
    }
  })
}

function buildPostCourse(course: CatalogCourse): LandingPostCourse {
  return {
    courseValue: course.value,
    courseLabel: course.rawLabel,
    courseId: course.courseId,
    courseModality: course.modality,
    title: course.title,
    area: course.primaryAreaLabel,
    image: course.image,
    currentInstallmentPrice: course.currentInstallmentPrice,
    oldInstallmentPrice: course.oldInstallmentPrice,
  }
}

function buildPostAreas(courses: CatalogCourse[]): Array<{ areaId: number; label: string }> {
  const areaMap = new Map<number, string>()

  for (const course of courses) {
    course.areaIds.forEach((areaId, index) => {
      const label = course.areaLabels[index] ?? ''
      if (!areaId || !label || areaMap.has(areaId)) return
      areaMap.set(areaId, label)
    })
  }

  return [...areaMap.entries()]
    .map(([areaId, label]) => ({ areaId, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))
}

export async function getLandingPageData(force = false): Promise<LandingPageData> {
  const [graduationCourses, postCourses] = await Promise.all([
    getGraduationCatalogCourses(force),
    getPostCatalogCourses(force),
  ])

  const graduationOptions = sortByLabel(graduationCourses.map(buildCourseOption))
  const onlineGraduationCourses = graduationCourses
    .filter((course) => course.modality !== 'presencial')
    .map(buildGraduationCard)
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))

  const presentialCourses = buildFixedPresentialCourses(graduationCourses)

  const postOptions = sortByLabel(postCourses.map(buildCourseOption))
  const landingPostCourses = sortByLabel(postCourses.map(buildPostCourse))
  const postAreaDefinitions = buildPostAreas(postCourses)
  const postAreas: LandingPostArea[] = await Promise.all(
    postAreaDefinitions.map(async ({ areaId, label }) => {
      const areaCourses = await getPostCatalogCoursesByArea(areaId, force)

      return {
        areaId,
        label,
        courses: sortByLabel(areaCourses.map(buildPostCourse)),
      }
    }),
  )

  return {
    graduationOptions,
    postOptions,
    onlineGraduationCourses,
    presentialCourses,
    postCourses: landingPostCourses,
    postAreas,
  }
}
