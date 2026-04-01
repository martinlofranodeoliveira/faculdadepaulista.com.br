export type CourseRouteInput = {
  courseType: 'graduacao' | 'pos'
  courseValue?: string
  courseLabel: string
}

const GRADUATION_SLUG_OVERRIDES = new Map<string, string>([
  ['graduacao-enfermagem', 'bacharelado-em-enfermagem'],
  ['graduacao-psicologia', 'bacharelado-em-psicologia'],
  ['enfermagem', 'bacharelado-em-enfermagem'],
  ['psicologia', 'bacharelado-em-psicologia'],
  ['bacharelado em enfermagem', 'bacharelado-em-enfermagem'],
  ['bacharelado em psicologia', 'bacharelado-em-psicologia'],
])

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

export function stripPostGraduationPrefix(label: string): string {
  const trimmed = label.trim()
  const normalized = normalizeComparableText(trimmed)

  for (const prefix of ['pos-graduacao em ', 'especializacao em ']) {
    if (normalized.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim()
    }
  }

  return trimmed
}

export function isMbaCourseTitle(label: string): boolean {
  const normalized = normalizeComparableText(label)
  return normalized === 'mba' || normalized.startsWith('mba ')
}

export function formatPostCourseHeading(label: string): string {
  const title = stripPostGraduationPrefix(label)
  return isMbaCourseTitle(title) ? title : `P\u00f3s-gradua\u00e7\u00e3o em ${title}`
}

function inferGraduationTitulation(...candidates: Array<string | undefined>): string {
  const normalizedValue = candidates.map((item) => normalizeComparableText(item ?? '')).join(' ')

  if (normalizedValue.includes('bacharelado-em-')) return 'Bacharelado'
  if (normalizedValue.includes('licenciatura-em-')) return 'Licenciatura'
  if (normalizedValue.includes('tecnologo-em-') || normalizedValue.includes('tecnologo-')) {
    return 'Tecnólogo'
  }

  return ''
}

export function formatGraduationCourseHeading(
  label: string,
  courseValue?: string,
  routeHint?: string,
): string {
  const title = stripGraduationModality(label)
  const titleWithoutPrefix = title
    .replace(/^graduação em\s+/i, '')
    .replace(/^graduacao em\s+/i, '')
    .trim()
  const normalized = normalizeComparableText(titleWithoutPrefix || title)

  const titledMatches = [
    {
      prefix: 'bacharelado em ',
      suffix: 'Bacharelado',
    },
    {
      prefix: 'licenciatura em ',
      suffix: 'Licenciatura',
    },
    {
      prefix: 'tecnologo em ',
      suffix: 'Tecnólogo',
    },
    {
      prefix: 'tecnologo ',
      suffix: 'Tecnólogo',
    },
  ]

  for (const match of titledMatches) {
    if (normalized.startsWith(match.prefix)) {
      const courseName = titleWithoutPrefix.slice(match.prefix.length).trim()
      return `Graduação em ${courseName} (${match.suffix})`
    }
  }

  const inferredTitulation = inferGraduationTitulation(courseValue, routeHint)
  if (inferredTitulation) {
    return `Graduação em ${titleWithoutPrefix || title} (${inferredTitulation})`
  }

  return `Graduação em ${titleWithoutPrefix || title}`
}

export function getCourseDisplayTitle(input: CourseRouteInput): string {
  if (input.courseType === 'graduacao') {
    return stripGraduationModality(input.courseLabel)
  }

  return stripPostGraduationPrefix(input.courseLabel)
}

export function getCourseSlug(input: CourseRouteInput): string {
  if (input.courseType === 'graduacao') {
    const overrideCandidates = [input.courseValue, getCourseDisplayTitle(input), input.courseLabel]
      .filter(Boolean)
      .map((value) => normalizeComparableText(String(value)))

    for (const candidate of overrideCandidates) {
      const overriddenSlug = GRADUATION_SLUG_OVERRIDES.get(candidate)
      if (overriddenSlug) return overriddenSlug
    }
  }

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
