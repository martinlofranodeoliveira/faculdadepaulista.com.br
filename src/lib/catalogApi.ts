import { graduationCarouselCourseConfigs } from '@/landing/data'

import { getCourseDisplayTitle, getCoursePath, normalizeComparableText, toSlug } from './courseRoutes'

export type CourseType = 'graduacao' | 'pos'
export type CourseModality = 'ead' | 'semipresencial' | 'presencial'

export type CatalogPriceItem = {
  id: number
  amountCents: number
  installmentsMax: number
  workloadVariantId: number | null
  workloadName: string
  totalHours: number
  modality: string
  validFrom: string
}

export type CatalogCurriculumDiscipline = {
  id: number
  name: string
  hours: number
  sequence: number
}

export type CatalogCurriculumVariant = {
  id: number
  name: string
  totalHours: number
  disciplines: CatalogCurriculumDiscipline[]
}

export type CatalogCourse = {
  institutionId: number
  institutionName: string
  institutionSlug: string
  courseType: CourseType
  courseId: number
  code: string
  slug: string
  value: string
  path: string
  title: string
  rawLabel: string
  description: string
  seoDescription: string
  areaLabels: string[]
  primaryAreaLabel: string
  areaSlug: string
  modality: CourseModality
  modalityLabel: string
  modalityBadge: string
  offeringModalityText: string
  image: string
  galleryImages: string[]
  posPriceCents: number
  currentInstallmentPrice: string
  currentInstallmentPriceMonthly: string
  oldInstallmentPrice: string
  pixText: string
  fixedInstallments: boolean
  teachingPlanUrl: string
  priceItems: CatalogPriceItem[]
  workloadOptions: string[]
  curriculumVariants: CatalogCurriculumVariant[]
  targetAudience: string
  competenciesBenefits: string
  competitiveDifferentials: string
  durationMonths: number
  durationContinuousMonths: number
  semesterCount: number
  durationText: string
  mecOrdinance: string
  mecOrdinanceDocumentUrl: string
  recognition: string
  recognitionDocumentUrl: string
  mecScore: number | null
  tccRequired: boolean | null
  titulation: string
  laborMarket: string
}

export type CatalogCourseSummary = Pick<
  CatalogCourse,
  | 'institutionId'
  | 'institutionName'
  | 'institutionSlug'
  | 'courseType'
  | 'courseId'
  | 'slug'
  | 'value'
  | 'path'
  | 'title'
  | 'rawLabel'
  | 'image'
  | 'currentInstallmentPrice'
  | 'currentInstallmentPriceMonthly'
  | 'oldInstallmentPrice'
  | 'modality'
  | 'modalityBadge'
  | 'areaSlug'
  | 'primaryAreaLabel'
  | 'fixedInstallments'
>

type ApiEnvelope<T> = {
  data: T
  meta?: Record<string, unknown>
  errors?: Array<{
    code?: string
    message?: string
    details?: unknown
  }>
  trace_id?: string
}

type ApiCourseListItem = {
  id: number
  code?: string | null
  name?: string | null
  level?: string | null
  description?: string | null
  offering_modality?: string | null
  titulation?: string | null
  labor_market?: string | null
  target_audience?: string | null
  competencies_benefits?: string | null
  competitive_differentials?: string | null
  teaching_plan_path?: string | null
  teaching_plan_mime?: string | null
  main_image_url?: string | null
  modalities?: string | null
  area_names?: string[] | null
  seo?: ApiSeoBundle | null
  duration_months?: number | null
  duration_continuous_months?: number | null
  semester_count?: number | null
  min_amount_cents?: number | string | null
  max_amount_cents?: number | string | null
  pos_price_cents?: number | string | null
  duration?: string | null
  mec_ordinance?: string | null
  mec_ordinance_document_path?: string | null
  mec_ordinance_document_mime?: string | null
  mec_ordinance_document_size_bytes?: number | null
  mec_ordinance_document_updated_at?: string | null
  recognition?: string | null
  recognition_document_path?: string | null
  recognition_document_mime?: string | null
  recognition_document_size_bytes?: number | null
  recognition_document_updated_at?: string | null
  mec_score?: number | string | null
  mec_rating?: number | string | null
  mec_note?: number | string | null
  mec_grade?: number | string | null
  mec_concept?: number | string | null
  nota_mec?: number | string | null
  conceito_mec?: number | string | null
  concept_mec?: number | string | null
  course_concept?: number | string | null
  concept?: number | string | null
  tcc_required?: boolean | null
  requires_tcc?: boolean | null
  has_tcc?: boolean | null
  has_course_completion_work?: boolean | null
  featured_pricing_options?: ApiPricingItem[] | null
  course_disciplines?: ApiCourseDiscipline[] | null
}

type ApiCourseDetail = {
  id: number
  code?: string | null
  name?: string | null
  level?: string | null
  description?: string | null
  target_audience?: string | null
  competencies_benefits?: string | null
  competitive_differentials?: string | null
  labor_market?: string | null
  titulation?: string | null
  offering_modality?: string | null
  duration_months?: number | null
  duration_continuous_months?: number | null
  semester_count?: number | null
  pos_price_cents?: number | string | null
  duration?: string | null
  mec_ordinance?: string | null
  mec_ordinance_document_path?: string | null
  mec_ordinance_document_mime?: string | null
  mec_ordinance_document_size_bytes?: number | null
  mec_ordinance_document_updated_at?: string | null
  recognition?: string | null
  recognition_document_path?: string | null
  recognition_document_mime?: string | null
  recognition_document_size_bytes?: number | null
  recognition_document_updated_at?: string | null
  mec_score?: number | string | null
  mec_rating?: number | string | null
  mec_note?: number | string | null
  mec_grade?: number | string | null
  mec_concept?: number | string | null
  nota_mec?: number | string | null
  conceito_mec?: number | string | null
  concept_mec?: number | string | null
  course_concept?: number | string | null
  concept?: number | string | null
  tcc_required?: boolean | null
  requires_tcc?: boolean | null
  has_tcc?: boolean | null
  has_course_completion_work?: boolean | null
  area_names?: string[] | null
  teaching_plan_path?: string | null
  teaching_plan_mime?: string | null
  main_image_url?: string | null
  seo?: ApiSeoBundle | null
  course_disciplines?: ApiCourseDiscipline[] | null
  featured_pricing_options?: ApiPricingItem[] | null
}

type ApiCourseDiscipline = {
  id?: number | string | null
  code?: string | null
  name?: string | null
  description?: string | null
  sort_order?: number | string | null
  sequence_no?: number | string | null
  discipline_hours?: number | string | null
  is_mandatory?: boolean | null
}

type ApiSeoBundle = {
  generic?: ApiSeoFields | null
  institution?: ApiInstitutionSeoFields | null
  effective?: ApiSeoFields | null
}

type ApiSeoFields = {
  course_name?: string | null
  slug?: string | null
  description?: string | null
  canonical_url?: string | null
  og_image_url?: string | null
}

type ApiInstitutionSeoFields = {
  seo_course_name?: string | null
  seo_slug?: string | null
  seo_description?: string | null
  seo_canonical_url?: string | null
  seo_og_image_url?: string | null
}

type ApiCourseImage = {
  original_path?: string | null
  thumb_path?: string | null
}

type ApiCourseMedia = {
  teaching_plan?: {
    teaching_plan_path?: string | null
    teaching_plan_mime?: string | null
    teaching_plan_size_bytes?: number | null
    teaching_plan_updated_at?: string | null
  } | null
  image?: ApiCourseImage | null
  gallery_items?: Array<{ image_path?: string | null }> | null
  main_image_url?: string | null
  gallery_urls?: string[] | null
}

type ApiPricingItem = {
  id: number
  amount_cents?: number | null
  installments_max?: number | null
  workload_variant_id?: number | null
  workload_name?: string | null
  total_hours?: number | null
  modality?: string | null
  valid_from?: string | null
}

type ApiCurriculumVariant = {
  workload_variant_id?: number | null
  workload_variant_name?: string | null
  variant_total_hours?: number | null
  disciplines?: ApiCurriculumDiscipline[] | null
}

type ApiCurriculumDiscipline = {
  discipline_id?: number | null
  discipline_name?: string | null
  discipline_hours?: number | null
  sequence_no?: number | null
}

type InstitutionConfig = {
  id: number
  name: string
  slug: string
  apiKey: string
}

function readServerEnv(name: keyof ImportMetaEnv | string): string | undefined {
  const viteEnv = (import.meta.env as Record<string, string | boolean | undefined> | undefined) ?? undefined
  const viteValue = viteEnv?.[name]
  if (typeof viteValue === 'string' && viteValue.trim()) return viteValue

  const processValue = process.env[name]
  if (typeof processValue === 'string' && processValue.trim()) return processValue

  return undefined
}

const DEFAULT_CACHE_TTL_MS = parseCacheTtl(
  readServerEnv('COURSES_API_CACHE_TTL_MS') ?? readServerEnv('VITE_POST_COURSES_CACHE_TTL_MS'),
)
const DEFAULT_LIMIT = 100
const API_BASE_URL = normalizeBaseUrl(readServerEnv('COURSES_API_BASE_URL'))

const cache = new Map<string, { createdAt: number; promise: Promise<unknown> }>()

function parseCacheTtl(value: string | undefined): number {
  if (!value) return 300000
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 300000
}

function normalizeBaseUrl(value: string | undefined): string {
  const normalized = value?.trim() ?? ''
  if (!normalized) return ''
  return normalized.endsWith('/') ? normalized : `${normalized}/`
}

function baseHasPublicPrefix(): boolean {
  if (!API_BASE_URL) return false

  try {
    const pathname = new URL(API_BASE_URL).pathname.replace(/\/+$/, '')
    return /\/api\/v1\/public$/i.test(pathname)
  } catch {
    return /\/api\/v1\/public\/?$/i.test(API_BASE_URL)
  }
}

function getInstitutionConfigs(): InstitutionConfig[] {
  const paulistaKey = readServerEnv('COURSES_API_KEY')?.trim()

  if (!paulistaKey) return []

  return [
    {
      id: parseInstitutionId(readServerEnv('COURSES_API_INSTITUTION_ID'), 6),
      name: 'PAULISTA',
      slug: 'paulista',
      apiKey: paulistaKey,
    },
  ]
}

function parseInstitutionId(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function readCache<T>(key: string, force = false): Promise<T> | null {
  if (force) return null
  const entry = cache.get(key)
  if (!entry) return null
  if (DEFAULT_CACHE_TTL_MS === 0) return null
  if (Date.now() - entry.createdAt > DEFAULT_CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.promise as Promise<T>
}

function writeCache<T>(key: string, promise: Promise<T>) {
  cache.set(key, {
    createdAt: Date.now(),
    promise,
  })
}

async function withCache<T>(key: string, loader: () => Promise<T>, force = false): Promise<T> {
  const cached = readCache<T>(key, force)
  if (cached) return cached

  const promise = loader().catch((error) => {
    cache.delete(key)
    throw error
  })

  writeCache(key, promise)
  return promise
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function normalizeMultilineText(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function normalizeRichText(value: string | null | undefined): string {
  if (!value) return ''

  const normalized = decodeHtmlEntities(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/div>\s*<div[^>]*>/gi, '\n\n')
    .replace(/<\/li>\s*<li[^>]*>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/?(p|div|ul|ol)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')

  return normalizeMultilineText(normalized)
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.set(key, String(value))
  })
  return search
}

async function apiFetch<T>(
  path: string,
  institution: InstitutionConfig,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<ApiEnvelope<T>> {
  if (!API_BASE_URL) {
    throw new Error('COURSES_API_BASE_URL não configurada.')
  }

  const normalizedPath = path.replace(/^\/+/, '')
  const relativePath = baseHasPublicPrefix()
    ? normalizedPath.replace(/^api\/v1\/public\/?/i, '')
    : normalizedPath.startsWith('api/v1/public/')
      ? normalizedPath
      : `api/v1/public/${normalizedPath}`

  const url = new URL(relativePath, API_BASE_URL)
  const search = buildQuery(params)
  const queryString = search.toString()
  if (queryString) {
    url.search = queryString
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': institution.apiKey,
      'X-Institution-Id': String(institution.id),
    },
  })

  let json: ApiEnvelope<T> | null = null
  try {
    json = (await response.json()) as ApiEnvelope<T>
  } catch {
    json = null
  }

  if (!response.ok) {
    const message = json?.errors?.[0]?.message ?? `Courses API request failed with status ${response.status}`
    throw new Error(message)
  }

  if (!json) {
    throw new Error('Courses API returned an empty body.')
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? 'Courses API returned an error.')
  }

  return json
}

async function optionalApiFetch<T>(
  path: string,
  institution: InstitutionConfig,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<ApiEnvelope<T> | null> {
  try {
    return await apiFetch<T>(path, institution, params)
  } catch {
    return null
  }
}

async function fetchAllPages<T>(
  path: string,
  institution: InstitutionConfig,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T[]> {
  const items: T[] = []
  let page = 1
  let total = Number.POSITIVE_INFINITY

  while (items.length < total) {
    const envelope = await apiFetch<T[]>(path, institution, {
      ...params,
      page,
      limit: DEFAULT_LIMIT,
    })

    const pageItems = Array.isArray(envelope.data) ? envelope.data : []
    items.push(...pageItems)

    const metaTotal = Number(envelope.meta?.total ?? Number.NaN)
    if (Number.isFinite(metaTotal)) {
      total = metaTotal
    } else if (pageItems.length < DEFAULT_LIMIT) {
      total = items.length
    }

    if (!pageItems.length || pageItems.length < DEFAULT_LIMIT) break
    page += 1
  }

  return items
}

function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100)
}

function normalizeAmountCents(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 0
}

function getMonthlyAmountFromCourseTotal(amountCents: number): number {
  if (!amountCents) return 0
  return Math.round(amountCents / 18)
}

function formatFixed18InstallmentLabel(amountCents: number): string {
  const monthlyAmountCents = getMonthlyAmountFromCourseTotal(amountCents)
  if (!monthlyAmountCents) return ''
  return `18X DE ${formatCurrency(monthlyAmountCents)}`.toUpperCase()
}

function formatFixed18MonthlyLabel(amountCents: number, includeInstallments = false): string {
  const monthlyAmountCents = getMonthlyAmountFromCourseTotal(amountCents)
  if (!monthlyAmountCents) return ''
  const priceLabel = `${formatCurrency(monthlyAmountCents).toUpperCase()}/MÊS`
  return includeInstallments ? `18X ${priceLabel}` : priceLabel
}

function normalizePricingItems(items: ApiPricingItem[] | null | undefined): CatalogPriceItem[] {
  return (items ?? [])
    .map((item) => ({
      id: item.id,
      amountCents: Number(item.amount_cents ?? 0),
      installmentsMax: Number(item.installments_max ?? 0),
      workloadVariantId:
        item.workload_variant_id === null || item.workload_variant_id === undefined
          ? null
          : Number(item.workload_variant_id),
      workloadName: normalizeText(item.workload_name),
      totalHours: Number(item.total_hours ?? 0),
      modality: normalizeText(item.modality),
      validFrom: normalizeText(item.valid_from),
    }))
    .filter((item) => item.amountCents > 0)
    .sort((a, b) => {
      if (a.amountCents !== b.amountCents) return a.amountCents - b.amountCents
      if (a.totalHours !== b.totalHours) return a.totalHours - b.totalHours
      return a.installmentsMax - b.installmentsMax
    })
}

function buildApiCourseListItemFromDetail(
  detail: ApiCourseDetail,
  pricingItems: ApiPricingItem[],
): ApiCourseListItem {
  return {
    id: detail.id,
    code: detail.code,
    name: detail.name,
    level: detail.level,
    description: detail.description,
    offering_modality: detail.offering_modality,
    titulation: detail.titulation,
    labor_market: detail.labor_market,
    target_audience: detail.target_audience,
    competencies_benefits: detail.competencies_benefits,
    competitive_differentials: detail.competitive_differentials,
    teaching_plan_path: detail.teaching_plan_path,
    teaching_plan_mime: detail.teaching_plan_mime,
    main_image_url: detail.main_image_url,
    area_names: detail.area_names,
    seo: detail.seo,
    duration_months: detail.duration_months,
    duration_continuous_months: detail.duration_continuous_months,
    semester_count: detail.semester_count,
    duration: detail.duration,
    mec_ordinance: detail.mec_ordinance,
    mec_ordinance_document_path: detail.mec_ordinance_document_path,
    mec_ordinance_document_mime: detail.mec_ordinance_document_mime,
    mec_ordinance_document_size_bytes: detail.mec_ordinance_document_size_bytes,
    mec_ordinance_document_updated_at: detail.mec_ordinance_document_updated_at,
    recognition: detail.recognition,
    recognition_document_path: detail.recognition_document_path,
    recognition_document_mime: detail.recognition_document_mime,
    recognition_document_size_bytes: detail.recognition_document_size_bytes,
    recognition_document_updated_at: detail.recognition_document_updated_at,
    mec_score: detail.mec_score,
    mec_rating: detail.mec_rating,
    mec_note: detail.mec_note,
    mec_grade: detail.mec_grade,
    mec_concept: detail.mec_concept,
    nota_mec: detail.nota_mec,
    conceito_mec: detail.conceito_mec,
    concept_mec: detail.concept_mec,
    course_concept: detail.course_concept,
    concept: detail.concept,
    tcc_required: detail.tcc_required,
    requires_tcc: detail.requires_tcc,
    has_tcc: detail.has_tcc,
    has_course_completion_work: detail.has_course_completion_work,
    pos_price_cents: detail.pos_price_cents,
    featured_pricing_options:
      pricingItems.length > 0 ? pricingItems : (detail.featured_pricing_options ?? null),
    course_disciplines: detail.course_disciplines,
  }
}

function resolveTccRequired(
  course: Pick<
    ApiCourseListItem,
    'tcc_required' | 'requires_tcc' | 'has_tcc' | 'has_course_completion_work'
  >,
  detail?: Pick<
    ApiCourseDetail,
    'tcc_required' | 'requires_tcc' | 'has_tcc' | 'has_course_completion_work'
  > | null,
): boolean | null {
  const candidates = [
    detail?.tcc_required,
    detail?.requires_tcc,
    detail?.has_tcc,
    detail?.has_course_completion_work,
    course.tcc_required,
    course.requires_tcc,
    course.has_tcc,
    course.has_course_completion_work,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'boolean') return candidate
  }

  return null
}

function parseMecScoreValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const rounded = Math.round(value)
    return rounded >= 1 && rounded <= 5 ? rounded : null
  }

  if (typeof value === 'string') {
    const match = value.match(/\d+(?:[.,]\d+)?/)
    if (!match) return null

    const parsed = Number.parseFloat(match[0].replace(',', '.'))
    if (!Number.isFinite(parsed)) return null

    const rounded = Math.round(parsed)
    return rounded >= 1 && rounded <= 5 ? rounded : null
  }

  return null
}

function resolveMecScore(
  course: Pick<
    ApiCourseListItem,
    | 'mec_score'
    | 'mec_rating'
    | 'mec_note'
    | 'mec_grade'
    | 'mec_concept'
    | 'nota_mec'
    | 'conceito_mec'
    | 'concept_mec'
    | 'course_concept'
    | 'concept'
  >,
  detail?: Pick<
    ApiCourseDetail,
    | 'mec_score'
    | 'mec_rating'
    | 'mec_note'
    | 'mec_grade'
    | 'mec_concept'
    | 'nota_mec'
    | 'conceito_mec'
    | 'concept_mec'
    | 'course_concept'
    | 'concept'
  > | null,
): number | null {
  const candidates = [
    detail?.mec_score,
    detail?.mec_rating,
    detail?.mec_note,
    detail?.mec_grade,
    detail?.mec_concept,
    detail?.nota_mec,
    detail?.conceito_mec,
    detail?.concept_mec,
    detail?.course_concept,
    detail?.concept,
    course.mec_score,
    course.mec_rating,
    course.mec_note,
    course.mec_grade,
    course.mec_concept,
    course.nota_mec,
    course.conceito_mec,
    course.concept_mec,
    course.course_concept,
    course.concept,
  ]

  for (const candidate of candidates) {
    const score = parseMecScoreValue(candidate)
    if (score) return score
  }

  return null
}

function getCourseTotalPriceCents(
  courseType: CourseType,
  course: ApiCourseListItem,
  priceItems: CatalogPriceItem[],
): number {
  const postPrice = normalizeAmountCents(course.pos_price_cents)
  if (courseType === 'pos' && postPrice) {
    return postPrice
  }

  const firstPriceItem = priceItems[0]
  if (firstPriceItem?.amountCents) {
    return firstPriceItem.amountCents
  }

  const featuredPrices = normalizePricingItems(course.featured_pricing_options)
  if (featuredPrices[0]?.amountCents) {
    return featuredPrices[0].amountCents
  }

  const minAmount = normalizeAmountCents(course.min_amount_cents)
  if (minAmount) {
    return minAmount
  }

  if (courseType === 'pos') {
    return 448200
  }

  return 0
}

function getGraduationFallbackMonthlyAmount(title: string, modality: CourseModality): number {
  const normalizedTitle = normalizeComparableText(title)

  if (normalizedTitle.includes('enfermagem')) return 44900
  if (normalizedTitle.includes('psicologia')) return 54900
  if (normalizedTitle.includes('pedagogia')) return 24900
  if (modality === 'presencial') return 44900
  return 13900
}

function getFallbackCurrentPriceLabels(
  courseType: CourseType,
  title: string,
  modality: CourseModality,
): { installment: string; monthly: string } {
  if (courseType === 'pos') {
    return {
      installment: '18X DE R$ 249,00',
      monthly: '18X R$ 249,00/MÊS',
    }
  }

  const monthlyAmountCents = getGraduationFallbackMonthlyAmount(title, modality)
  return {
    installment: `18X DE ${formatCurrency(monthlyAmountCents)}`.toUpperCase(),
    monthly: `${formatCurrency(monthlyAmountCents).toUpperCase()}/MÊS`,
  }
}

function getFallbackOldInstallmentPrice(courseType: CourseType, modality: CourseModality): string {
  if (courseType === 'pos') return '18X R$ 329,00'
  if (modality === 'presencial') return 'R$ 1.890,00'
  return 'R$ 329,00'
}

function normalizeCurriculumVariants(
  variants: ApiCurriculumVariant[] | null | undefined,
): CatalogCurriculumVariant[] {
  return (variants ?? [])
    .map((variant) => ({
      id: Number(variant.workload_variant_id ?? 0),
      name: normalizeText(variant.workload_variant_name),
      totalHours: Number(variant.variant_total_hours ?? 0),
      disciplines: (variant.disciplines ?? [])
        .map((discipline) => ({
          id: Number(discipline.discipline_id ?? 0),
          name: normalizeText(discipline.discipline_name),
          hours: Number(discipline.discipline_hours ?? 0),
          sequence: Number(discipline.sequence_no ?? 0),
        }))
        .filter((discipline) => discipline.name)
        .sort((a, b) => a.sequence - b.sequence),
    }))
    .filter((variant) => variant.disciplines.length > 0)
    .sort((a, b) => {
      if (a.totalHours !== b.totalHours) return a.totalHours - b.totalHours
      return a.name.localeCompare(b.name, 'pt-BR')
    })
}

function selectDisciplinesForTotalHours(
  disciplines: CatalogCurriculumDiscipline[],
  targetHours: number,
): CatalogCurriculumDiscipline[] {
  if (!targetHours) return disciplines

  const selected: CatalogCurriculumDiscipline[] = []
  let accumulatedHours = 0

  for (const discipline of disciplines) {
    if (accumulatedHours >= targetHours) break
    selected.push(discipline)
    accumulatedHours += discipline.hours
  }

  return selected.length ? selected : disciplines
}

function normalizeCourseDisciplinesFallback(
  disciplines: ApiCourseDiscipline[] | null | undefined,
  priceItems: CatalogPriceItem[] = [],
): CatalogCurriculumVariant[] {
  const normalizedDisciplines: CatalogCurriculumDiscipline[] = (disciplines ?? [])
    .map((discipline) => ({
      id: Number(discipline.id ?? 0),
      name: normalizeText(discipline.name),
      hours: Number(discipline.discipline_hours ?? 0),
      sequence: Number(discipline.sequence_no ?? discipline.sort_order ?? 0),
    }))
    .filter((discipline) => discipline.name)
    .sort((a, b) => {
      if (a.sequence !== b.sequence) return a.sequence - b.sequence
      return a.name.localeCompare(b.name, 'pt-BR')
    })

  if (!normalizedDisciplines.length) return []

  const totalHours = normalizedDisciplines.reduce((sum, discipline) => sum + discipline.hours, 0)
  const workloadVariants = Array.from(
    new Map(
      priceItems
        .filter((item) => item.totalHours > 0)
        .map((item) => [
          item.workloadVariantId || item.totalHours,
          {
            id: item.workloadVariantId || item.totalHours,
            name: item.workloadName || `${item.totalHours} Horas`,
            totalHours: item.totalHours,
          },
        ]),
    ).values(),
  ).sort((a, b) => a.totalHours - b.totalHours)

  if (workloadVariants.length > 0) {
    return workloadVariants.map((variant) => ({
      id: variant.id,
      name: normalizeText(variant.name) || `${variant.totalHours} Horas`,
      totalHours: variant.totalHours,
      disciplines: selectDisciplinesForTotalHours(normalizedDisciplines, variant.totalHours),
    }))
  }

  return [
    {
      id: 1,
      name: totalHours ? `${totalHours} Horas` : 'Matriz curricular',
      totalHours,
      disciplines: normalizedDisciplines,
    },
  ]
}

function resolvePrimaryModality(rawValues: string[]): CourseModality {
  const combined = rawValues.map((value) => normalizeText(value).toLowerCase()).join(' ')

  if (combined.includes('semi')) return 'semipresencial'
  if (combined.includes('presencial') && !combined.includes('ead')) return 'presencial'
  if (combined.includes('ead')) return 'ead'
  if (combined.includes('presencial')) return 'presencial'
  return 'ead'
}

function getModalityLabel(courseType: CourseType, modality: CourseModality): string {
  if (courseType === 'pos') {
    if (modality === 'semipresencial') return 'PÓS-GRADUAÇÃO SEMIPRESENCIAL'
    if (modality === 'presencial') return 'PÓS-GRADUAÇÃO PRESENCIAL'
    return 'PÓS-GRADUAÇÃO EAD'
  }

  if (modality === 'semipresencial') return 'GRADUAÇÃO SEMIPRESENCIAL'
  if (modality === 'presencial') return 'GRADUAÇÃO PRESENCIAL'
  return 'GRADUAÇÃO EAD'
}

function getPageModalityLabel(modality: CourseModality): string {
  if (modality === 'semipresencial') return 'Semipresencial'
  if (modality === 'presencial') return 'Presencial'
  return 'EAD'
}

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const normalized = normalizeText(value)
    if (normalized) return normalized
  }
  return ''
}

function buildPrimaryAreaLabel(areaLabels: string[]): string {
  return areaLabels[0] ?? 'Geral'
}

function buildAreaSlug(areaLabel: string): string {
  return toSlug(areaLabel || 'geral') || 'geral'
}

function toAbsoluteMediaUrl(value: string | null | undefined): string {
  const normalized = normalizeText(value)
  if (!normalized) return ''
  if (/^https?:\/\//i.test(normalized)) return normalized
  if (!API_BASE_URL) return normalized

  try {
    return new URL(normalized, API_BASE_URL).toString()
  } catch {
    return normalized
  }
}

function resolveDocumentUrl(value: string | null | undefined): string {
  const normalized = normalizeText(value)
  if (!normalized) return ''
  if (/^https?:\/\//i.test(normalized)) return normalized
  if (!normalized.startsWith('/')) return ''
  if (!API_BASE_URL) return normalized

  try {
    return new URL(normalized, API_BASE_URL).toString()
  } catch {
    return ''
  }
}

function getStaticGraduationFallbackImage(courseValue: string): string {
  const config = graduationCarouselCourseConfigs.find((entry) => entry.courseValue === courseValue)
  return config?.image ?? '/landing/Curso_Administracao_EAD.webp'
}

function getCourseFallbackImage(courseType: CourseType, courseValue: string): string {
  if (courseType === 'graduacao') return getStaticGraduationFallbackImage(courseValue)
  return '/course/hero-post.webp'
}

function resolveCourseImage(
  courseType: CourseType,
  courseValue: string,
  media: ApiCourseMedia | null | undefined,
): { image: string; galleryImages: string[] } {
  const galleryUrls = (media?.gallery_urls ?? []).map((item) => toAbsoluteMediaUrl(item)).filter(Boolean)
  const mainImageUrl = firstNonEmpty(
    media?.main_image_url,
    media?.image?.original_path,
    media?.image?.thumb_path,
    galleryUrls[0],
  )

  const image = toAbsoluteMediaUrl(mainImageUrl) || getCourseFallbackImage(courseType, courseValue)
  return {
    image,
    galleryImages: galleryUrls,
  }
}

function parseBulletLines(value: string): string[] {
  return normalizeMultilineText(value)
    .split(/\n+/)
    .map((line) => line.replace(/^[-?\u2022\s]+/, '').trim())
    .filter(Boolean)
}

function buildGeneratedDescription(courseType: CourseType, title: string): string {
  if (courseType === 'pos') {
    return `Conheça a Pós-graduação em ${title} da Faculdade Paulista e continue sua inscrição.`
  }

  return `Conheça a Graduação em ${title} da Faculdade Paulista e continue sua inscrição.`
}

function pickSeoFields(seo: ApiSeoBundle | null | undefined) {
  const effective = seo?.effective
  const generic = seo?.generic
  const institution = seo?.institution

  return {
    courseName: firstNonEmpty(effective?.course_name, institution?.seo_course_name, generic?.course_name),
    slug: firstNonEmpty(effective?.slug, institution?.seo_slug, generic?.slug),
    description: firstNonEmpty(
      effective?.description,
      institution?.seo_description,
      generic?.description,
    ),
    ogImageUrl: firstNonEmpty(
      effective?.og_image_url,
      institution?.seo_og_image_url,
      generic?.og_image_url,
    ),
  }
}

async function mapWithConcurrency<T, U>(items: T[], limit: number, mapper: (item: T) => Promise<U>): Promise<U[]> {
  const results: U[] = new Array(items.length)
  let currentIndex = 0

  async function worker() {
    while (currentIndex < items.length) {
      const index = currentIndex
      currentIndex += 1
      results[index] = await mapper(items[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

async function getInstitutionCourseList(
  institution: InstitutionConfig,
  courseType: CourseType,
  force = false,
): Promise<ApiCourseListItem[]> {
  return withCache(`course-list:${institution.id}:${courseType}`, async () => {
    const shouldFetchUnfiltered = courseType === 'graduacao'
    const items = await fetchAllPages<ApiCourseListItem>('/api/v1/public/courses', institution, {
      level: shouldFetchUnfiltered ? undefined : courseType,
      show_disciplines: courseType === 'graduacao' ? 'S' : 'N',
      price: 'S',
    })

    if (!shouldFetchUnfiltered) {
      return items
    }

    return items.filter((course) => normalizeText(course.level).toLowerCase() === 'graduacao')
  }, force)
}

async function getCourseBundle(
  institution: InstitutionConfig,
  courseId: number,
  force = false,
): Promise<{
  detail: ApiCourseDetail
  media: ApiCourseMedia | null
  pricingItems: ApiPricingItem[]
  curriculumVariants: ApiCurriculumVariant[]
}> {
  return withCache(`course-bundle:${institution.id}:${courseId}`, async () => {
    const [detailEnvelope, mediaEnvelope, pricingEnvelope, curriculumEnvelope] = await Promise.all([
      apiFetch<ApiCourseDetail>(`/api/v1/public/courses/${courseId}`, institution, {
        show_disciplines: 'S',
        price: 'S',
      }),
      optionalApiFetch<ApiCourseMedia>(`/api/v1/public/courses/${courseId}/media`, institution),
      optionalApiFetch<{ items?: ApiPricingItem[] | null }>(
        `/api/v1/public/courses/${courseId}/pricing-by-workload`,
        institution,
      ),
      optionalApiFetch<{ variants?: ApiCurriculumVariant[] | null }>(
        `/api/v1/public/courses/${courseId}/curriculum`,
        institution,
      ),
    ])

    return {
      detail: detailEnvelope.data,
      media: mediaEnvelope?.data ?? null,
      pricingItems: pricingEnvelope?.data?.items ?? [],
      curriculumVariants: curriculumEnvelope?.data?.variants ?? [],
    }
  }, force)
}

function getInstitutionPreference(institutionSlug: string): number {
  if (institutionSlug === 'paulista') return 30
  if (institutionSlug === 'unicesp') return 20
  if (institutionSlug === 'fasul') return 10
  return 0
}

function getCatalogCourseScore(course: CatalogCourse): number {
  let score = 0
  if (course.image) score += 5
  if (course.currentInstallmentPrice) score += 4
  if (course.currentInstallmentPriceMonthly) score += 2
  if (course.description) score += 2
  if (course.teachingPlanUrl) score += 1
  if (course.workloadOptions.length) score += 2
  if (course.curriculumVariants.length) score += 3
  if (course.targetAudience) score += 1
  if (course.competenciesBenefits) score += 1
  if (course.competitiveDifferentials) score += 1
  score += getInstitutionPreference(course.institutionSlug)
  return score
}

function getCatalogCourseSummaryScore(course: CatalogCourseSummary): number {
  let score = 0
  if (course.image) score += 5
  if (course.currentInstallmentPrice) score += 4
  if (course.currentInstallmentPriceMonthly) score += 2
  score += getInstitutionPreference(course.institutionSlug)
  return score
}

function buildCatalogCourseSummary(
  institution: InstitutionConfig,
  course: ApiCourseListItem,
  courseType: CourseType,
  media: ApiCourseMedia | null = null,
): CatalogCourseSummary {
  const seo = pickSeoFields(course.seo)
  const rawLabel = normalizeText(course.name)
  const title = getCourseDisplayTitle({
    courseType,
    courseLabel: seo.courseName || rawLabel,
  })
  const slug = toSlug(seo.slug || title || rawLabel || `curso-${course.id}`)
  const value = `${courseType}-${slug}`
  const path = getCoursePath({
    courseType,
    courseValue: value,
    courseLabel: rawLabel,
  })
  const priceItems = normalizePricingItems(course.featured_pricing_options)
  const modality = resolvePrimaryModality([course.modalities ?? '', course.offering_modality ?? ''])
  const primaryAreaLabel = buildPrimaryAreaLabel(
    (course.area_names ?? []).map((item) => normalizeText(item)).filter(Boolean),
  )
  const totalPriceCents = getCourseTotalPriceCents(courseType, course, priceItems)
  const fallbackCurrentPrice = getFallbackCurrentPriceLabels(courseType, title, modality)
  const currentInstallmentPrice = totalPriceCents
    ? formatFixed18InstallmentLabel(totalPriceCents)
    : fallbackCurrentPrice.installment
  const currentInstallmentPriceMonthly = totalPriceCents
    ? formatFixed18MonthlyLabel(totalPriceCents, courseType === 'pos')
    : fallbackCurrentPrice.monthly
  const resolvedImage = resolveCourseImage(
    courseType,
    value,
    media
      ? {
          ...media,
          main_image_url: firstNonEmpty(media.main_image_url, course.main_image_url),
        }
      : {
          main_image_url: course.main_image_url,
        },
  ).image

  return {
    institutionId: institution.id,
    institutionName: institution.name,
    institutionSlug: institution.slug,
    courseType,
    courseId: Number(course.id ?? 0),
    slug,
    value,
    path,
    title,
    rawLabel,
    image: toAbsoluteMediaUrl(seo.ogImageUrl) || resolvedImage,
    currentInstallmentPrice,
    currentInstallmentPriceMonthly,
    oldInstallmentPrice: getFallbackOldInstallmentPrice(courseType, modality),
    modality,
    modalityBadge: getModalityLabel(courseType, modality),
    areaSlug: buildAreaSlug(primaryAreaLabel),
    primaryAreaLabel,
    fixedInstallments: false,
  }
}

async function getCourseMedia(
  institution: InstitutionConfig,
  courseId: number,
  force = false,
): Promise<ApiCourseMedia | null> {
  return withCache(`course-media:${institution.id}:${courseId}`, async () => {
    const envelope = await optionalApiFetch<ApiCourseMedia>(
      `/api/v1/public/courses/${courseId}/media`,
      institution,
    )

    return envelope?.data ?? null
  }, force)
}

function dedupeCatalogCourseSummaries(courses: CatalogCourseSummary[]): CatalogCourseSummary[] {
  const deduped = new Map<string, CatalogCourseSummary>()

  for (const course of courses) {
    const key =
      course.courseId > 0
        ? [course.courseType, `id:${course.courseId}`, course.modality].join('::')
        : [
            course.courseType,
            normalizeComparableText(course.title || course.rawLabel),
            course.modality,
          ].join('::')

    const current = deduped.get(key)
    if (!current) {
      deduped.set(key, course)
      continue
    }

    const currentScore = getCatalogCourseSummaryScore(current)
    const nextScore = getCatalogCourseSummaryScore(course)

    if (nextScore > currentScore) {
      deduped.set(key, course)
      continue
    }

    if (nextScore === currentScore && course.title.localeCompare(current.title, 'pt-BR') < 0) {
      deduped.set(key, course)
    }
  }

  return [...deduped.values()]
}

function dedupeCatalogCourses(courses: CatalogCourse[]): CatalogCourse[] {
  const deduped = new Map<string, CatalogCourse>()

  for (const course of courses) {
    const key =
      course.courseId > 0
        ? [course.courseType, `id:${course.courseId}`, course.modality].join('::')
        : [
            course.courseType,
            normalizeComparableText(course.title || course.rawLabel),
            course.modality,
          ].join('::')

    const current = deduped.get(key)
    if (!current) {
      deduped.set(key, course)
      continue
    }

    const currentScore = getCatalogCourseScore(current)
    const nextScore = getCatalogCourseScore(course)

    if (nextScore > currentScore) {
      deduped.set(key, course)
      continue
    }

    if (nextScore == currentScore && course.title.localeCompare(current.title, 'pt-BR') < 0) {
      deduped.set(key, course)
    }
  }

  return [...deduped.values()]
}

function mapCatalogCourse(
  institution: InstitutionConfig,
  course: ApiCourseListItem,
  bundle: {
    detail: ApiCourseDetail
    media: ApiCourseMedia | null
    pricingItems: ApiPricingItem[]
    curriculumVariants: ApiCurriculumVariant[]
  } | null,
  courseType: CourseType,
): CatalogCourse {
  const detail = bundle?.detail
  const seo = pickSeoFields(detail?.seo ?? course.seo)
  const rawLabel = firstNonEmpty(detail?.name, course.name)
  const title = getCourseDisplayTitle({
    courseType,
    courseLabel: seo.courseName || rawLabel,
  })
  const slug = toSlug(seo.slug || title || rawLabel || `curso-${course.id}`)
  const value = `${courseType}-${slug}`
  const path = getCoursePath({
    courseType,
    courseValue: value,
    courseLabel: rawLabel,
  })

  const priceItemsFromBundle = normalizePricingItems(bundle?.pricingItems)
  const priceItems =
    priceItemsFromBundle.length > 0
      ? priceItemsFromBundle
      : normalizePricingItems(course.featured_pricing_options)
  const normalizedCurriculumVariants = normalizeCurriculumVariants(bundle?.curriculumVariants)
  const fallbackCurriculumVariants = normalizeCourseDisciplinesFallback(
    course.course_disciplines ?? detail?.course_disciplines,
    priceItems,
  )
  const curriculumVariants =
    normalizedCurriculumVariants.length > 0 ? normalizedCurriculumVariants : fallbackCurriculumVariants
  const workloadNames = Array.from(
    new Set(
      [
        ...priceItems.map((item) => item.totalHours && `${item.totalHours} Horas`),
        ...curriculumVariants.map((variant) => variant.totalHours && `${variant.totalHours} Horas`),
      ].filter(Boolean) as string[],
    ),
  ).sort((a, b) => {
    const aNumber = Number.parseInt(a, 10)
    const bNumber = Number.parseInt(b, 10)
    return aNumber - bNumber
  })

  const rawModalityValues = [
    course.modalities ?? '',
    course.offering_modality ?? '',
    ...priceItems.map((item) => item.modality),
    detail?.offering_modality ?? '',
  ]
  const modality = resolvePrimaryModality(rawModalityValues)
  const { image, galleryImages } = resolveCourseImage(
    courseType,
    value,
    bundle?.media
      ? {
          ...bundle.media,
          main_image_url: firstNonEmpty(
            bundle.media.main_image_url,
            detail?.main_image_url,
            course.main_image_url,
          ),
        }
      : {
          main_image_url: firstNonEmpty(detail?.main_image_url, course.main_image_url),
        },
  )
  const areaLabels = (detail?.area_names ?? course.area_names ?? []).map((item) => normalizeText(item)).filter(Boolean)
  const primaryAreaLabel = buildPrimaryAreaLabel(areaLabels)
  const description =
    normalizeRichText(firstNonEmpty(detail?.description, course.description, seo.description)) ||
    buildGeneratedDescription(courseType, title)
  const seoDescription =
    normalizeRichText(firstNonEmpty(seo.description, detail?.description, course.description)) ||
    buildGeneratedDescription(courseType, title)
  const teachingPlanUrl =
    resolveDocumentUrl(bundle?.media?.teaching_plan?.teaching_plan_path) ||
    resolveDocumentUrl(detail?.teaching_plan_path) ||
    resolveDocumentUrl(course.teaching_plan_path)
  const totalPriceCents = getCourseTotalPriceCents(
    courseType,
    {
      ...course,
      pos_price_cents: detail?.pos_price_cents ?? course.pos_price_cents,
    },
    priceItems,
  )
  const fallbackCurrentPrice = getFallbackCurrentPriceLabels(courseType, title, modality)
  const currentInstallmentPrice = totalPriceCents
    ? formatFixed18InstallmentLabel(totalPriceCents)
    : fallbackCurrentPrice.installment
  const currentInstallmentPriceMonthly = totalPriceCents
    ? formatFixed18MonthlyLabel(totalPriceCents, courseType === 'pos')
    : fallbackCurrentPrice.monthly

  return {
    institutionId: institution.id,
    institutionName: institution.name,
    institutionSlug: institution.slug,
    courseType,
    courseId: Number(course.id ?? 0),
    code: firstNonEmpty(detail?.code, course.code),
    slug,
    value,
    path,
    title,
    rawLabel,
    description,
    seoDescription,
    areaLabels,
    primaryAreaLabel,
    areaSlug: buildAreaSlug(primaryAreaLabel),
    modality,
    modalityLabel: getPageModalityLabel(modality),
    modalityBadge: getModalityLabel(courseType, modality),
    offeringModalityText: normalizeText(detail?.offering_modality ?? course.offering_modality),
    image: toAbsoluteMediaUrl(seo.ogImageUrl) || image,
    galleryImages,
    posPriceCents: courseType === 'pos' ? totalPriceCents : 0,
    currentInstallmentPrice,
    currentInstallmentPriceMonthly,
    oldInstallmentPrice: getFallbackOldInstallmentPrice(courseType, modality),
    pixText: '',
    fixedInstallments: false,
    teachingPlanUrl,
    priceItems,
    workloadOptions: workloadNames,
    curriculumVariants,
    targetAudience: normalizeRichText(detail?.target_audience ?? course.target_audience),
    competenciesBenefits: normalizeRichText(
      detail?.competencies_benefits ?? course.competencies_benefits,
    ),
    competitiveDifferentials: normalizeRichText(
      detail?.competitive_differentials ?? course.competitive_differentials,
    ),
    durationMonths: Number(detail?.duration_months ?? course.duration_months ?? 0),
    durationContinuousMonths: Number(
      detail?.duration_continuous_months ?? course.duration_continuous_months ?? 0,
    ),
    semesterCount: Number(detail?.semester_count ?? course.semester_count ?? 0),
    durationText: normalizeText(detail?.duration ?? course.duration),
    mecOrdinance: normalizeRichText(detail?.mec_ordinance ?? course.mec_ordinance),
    mecOrdinanceDocumentUrl: resolveDocumentUrl(
      detail?.mec_ordinance_document_path ?? course.mec_ordinance_document_path,
    ),
    recognition: normalizeRichText(detail?.recognition ?? course.recognition),
    recognitionDocumentUrl: resolveDocumentUrl(
      detail?.recognition_document_path ?? course.recognition_document_path,
    ),
    mecScore: resolveMecScore(course, detail),
    tccRequired: resolveTccRequired(course, detail),
    titulation: normalizeText(detail?.titulation),
    laborMarket: normalizeRichText(detail?.labor_market ?? course.labor_market),
  } satisfies CatalogCourse
}

export async function getCatalogCourses(courseType: CourseType, force = false): Promise<CatalogCourse[]> {
  return withCache(`catalog-courses:${courseType}`, async () => {
    const institutions = getInstitutionConfigs()
    if (!institutions.length || !API_BASE_URL) return []

    const perInstitution = await Promise.all(
      institutions.map(async (institution) => {
        try {
          const courseList = await getInstitutionCourseList(institution, courseType, force)

          const bundles = await mapWithConcurrency(courseList, 6, async (course) => {
            const courseId = Number(course.id ?? 0)
            if (!courseId) return null

            try {
              const bundle = await getCourseBundle(institution, courseId)
              return { course, bundle }
            } catch (error) {
              console.error(`Erro ao carregar bundle do curso ${courseId} (${institution.name}):`, error)
              return { course, bundle: null }
            }
          })

          return bundles
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
            .map(({ course, bundle }) => ({
              institution,
              course,
              bundle,
            }))
        } catch (error) {
          console.error(
            `Erro ao carregar catálogo ${courseType} da instituição ${institution.name}:`,
            error,
          )
          return []
        }
      }),
    )

    const flatItems = perInstitution.flat()

    const mappedCourses = flatItems.map(({ institution, course, bundle }) =>
      mapCatalogCourse(institution, course, bundle, courseType),
    )

    return dedupeCatalogCourses(mappedCourses)
  }, force)
}

export async function getCatalogCourseSummaries(
  courseType: CourseType,
  force = false,
): Promise<CatalogCourseSummary[]> {
  return withCache(`catalog-course-summaries:${courseType}`, async () => {
    const institutions = getInstitutionConfigs()
    if (!institutions.length || !API_BASE_URL) return []

    const perInstitution = await Promise.all(
      institutions.map(async (institution) => {
        try {
          const shouldFetchUnfiltered = courseType === 'graduacao'
          const items = await fetchAllPages<ApiCourseListItem>('/api/v1/public/courses', institution, {
            level: shouldFetchUnfiltered ? undefined : courseType,
            show_disciplines: 'N',
            price: 'S',
          })

          const filteredItems = shouldFetchUnfiltered
            ? items.filter((course) => normalizeText(course.level).toLowerCase() === 'graduacao')
            : items

          return mapWithConcurrency(filteredItems, 8, async (course) => {
            const courseId = Number(course.id ?? 0)
            const hasListImage =
              Boolean(normalizeText(course.main_image_url)) ||
              Boolean(pickSeoFields(course.seo).ogImageUrl)
            const media =
              courseId > 0 && !hasListImage
                ? await getCourseMedia(institution, courseId, force)
                : null

            return buildCatalogCourseSummary(institution, course, courseType, media)
          })
        } catch (error) {
          console.error(
            `Erro ao carregar resumo do catálogo ${courseType} da instituição ${institution.name}:`,
            error,
          )
          return []
        }
      }),
    )

    return dedupeCatalogCourseSummaries(perInstitution.flat())
  }, force)
}

export async function getCatalogCourseBySlug(
  courseType: CourseType,
  slug: string,
  force = false,
): Promise<CatalogCourse | null> {
  return withCache(`catalog-course-by-slug:${courseType}:${slug}`, async () => {
    const normalizedSlug = normalizeText(slug)
    if (!normalizedSlug) return null

    for (const institution of getInstitutionConfigs()) {
      const courseList = await getInstitutionCourseList(institution, courseType, force)
      const course = courseList.find((entry) => {
        const summary = buildCatalogCourseSummary(institution, entry, courseType)
        return summary.slug === normalizedSlug
      })

      if (!course) {
        continue
      }

      let bundle: Awaited<ReturnType<typeof getCourseBundle>> | null = null
      try {
        bundle = await getCourseBundle(institution, Number(course.id ?? 0), force)
      } catch (error) {
        console.error(`Erro ao carregar bundle do curso ${course.id} (${institution.name}):`, error)
      }

      return mapCatalogCourse(institution, course, bundle, courseType)
    }

    return (await getCatalogCourses(courseType, force)).find((entry) => entry.slug === normalizedSlug) ?? null
  }, force)
}

export async function getCatalogCourseById(
  courseType: CourseType,
  courseId: number,
  force = false,
): Promise<CatalogCourse | null> {
  return withCache(`catalog-course-by-id:${courseType}:${courseId}`, async () => {
    if (!Number.isInteger(courseId) || courseId <= 0) return null

    for (const institution of getInstitutionConfigs()) {
      try {
        const bundle = await getCourseBundle(institution, courseId, force)
        const course = buildApiCourseListItemFromDetail(bundle.detail, bundle.pricingItems)

        if (normalizeText(course.level).toLowerCase() !== courseType) {
          continue
        }

        return mapCatalogCourse(institution, course, bundle, courseType)
      } catch (error) {
        console.error(`Erro ao carregar curso ${courseId} (${institution.name}):`, error)
      }
    }

    return (await getCatalogCourses(courseType, force)).find((entry) => entry.courseId === courseId) ?? null
  }, force)
}

export async function getGraduationCatalogCourses(force = false) {
  return getCatalogCourses('graduacao', force)
}

export async function getPostCatalogCourses(force = false) {
  return getCatalogCourses('pos', force)
}

export async function getGraduationCatalogCourseBySlug(slug: string, force = false) {
  return getCatalogCourseBySlug('graduacao', slug, force)
}

export async function getPostCatalogCourseBySlug(slug: string, force = false) {
  return getCatalogCourseBySlug('pos', slug, force)
}

export async function getGraduationCatalogCourseById(courseId: number, force = false) {
  return getCatalogCourseById('graduacao', courseId, force)
}

export async function getPostCatalogCourseById(courseId: number, force = false) {
  return getCatalogCourseById('pos', courseId, force)
}

export async function getGraduationCatalogCourseSummaries(force = false) {
  return getCatalogCourseSummaries('graduacao', force)
}

export async function getPostCatalogCourseSummaries(force = false) {
  return getCatalogCourseSummaries('pos', force)
}

export function splitDifferentials(text: string): string[] {
  const parsed = parseBulletLines(text)
  return parsed.length ? parsed : [normalizeText(text)].filter(Boolean)
}
