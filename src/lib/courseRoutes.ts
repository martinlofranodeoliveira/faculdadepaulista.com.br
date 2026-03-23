export type CourseRouteInput = {
  courseType: 'graduacao' | 'pos'
  courseValue?: string
  courseLabel: string
}

export function normalizeComparableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function toSlug(value: string): string {
  return normalizeComparableText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function stripGraduationModality(label: string): string {
  return label
    .replace(/\s*\((?:semipresencial|presencial|ead)\)\s*/gi, ' ')
    .replace(/\b(?:semipresencial|presencial|ead)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getCourseDisplayTitle(input: CourseRouteInput): string {
  return input.courseType === 'graduacao'
    ? stripGraduationModality(input.courseLabel)
    : input.courseLabel.trim()
}

export function getCourseSlug(input: CourseRouteInput): string {
  if (input.courseValue) {
    if (input.courseValue.startsWith('graduacao-')) {
      return input.courseValue.replace(/^graduacao-/, '')
    }

    if (input.courseValue.startsWith('pos-')) {
      return input.courseValue.replace(/^pos-/, '')
    }
  }

  return toSlug(getCourseDisplayTitle(input))
}

export function getCoursePath(
  input: CourseRouteInput,
  options?: {
    leadSubmitted?: boolean
  },
): string {
  const prefix = input.courseType === 'pos' ? '/pos-graduacao' : '/graduacao'
  const pathname = `${prefix}/${getCourseSlug(input)}`

  if (!options?.leadSubmitted) return pathname
  return `${pathname}?lead=1`
}
