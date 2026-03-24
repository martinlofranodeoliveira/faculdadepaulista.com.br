import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, ChevronDown, ChevronLeft, LoaderCircle } from 'lucide-react'

import {
  createJourneyStep1,
  finalizeJourney,
  getPendingJourneys,
  resumeJourney,
  updateJourneyStep2,
  type JourneyPendingItem,
  type JourneySnapshot,
} from '@/lib/journeyClient'
import { getCoursePath } from '@/lib/courseRoutes'
import { readStoredUtmParams, syncUtmParamsFromUrl } from '@/lib/utm'

import {
  clearCourseLeadDraft,
  matchesCourseLeadDraft,
  readCourseLeadDraft,
  saveCourseLeadDraft,
} from './courseLeadDraft'
import {
  clearJourneyProgress,
  matchesJourneyProgress,
  readJourneyProgress,
  saveJourneyProgress,
  type StoredJourneyProgress,
} from './journeyProgress'
import { storePostThankYouLead } from '@/thankyou/postThankYouState'
import { storeGraduationVestibularLead } from '@/vestibular/graduationVestibularState'

type CourseType = 'graduacao' | 'pos'
type Step = 1 | 2

type Props = {
  courseType: CourseType
  courseTitle: string
  courseLabel: string
  courseValue?: string
  courseId?: number
  leadSubmitted?: boolean
  paymentPlanGroups?: Array<{
    workload: string
    workloadVariantId: number | null
    pricingId: number | null
    totalAmountCents: number
    currentInstallmentText: string
    paymentPlanOptions: string[]
  }>
  paymentPlanOptions: string[]
  workloadOptions: string[]
  pricing: {
    oldInstallmentText: string
    currentInstallmentText: string
    pixText: string
  }
  showInternshipInfoLink?: boolean
}

type FieldErrors = {
  fullName?: string
  email?: string
  phone?: string
  cpf?: string
  agreement?: string
}

type ResumeMode = 'default' | 'lookup' | 'select'

type ResumeFieldErrors = {
  email?: string
  agreement?: string
  courseId?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

type ResumeCourseRoute = {
  courseId: number
  path: string
  title: string
  courseLabel: string
  courseValue?: string
}

type ResumeCourseOption = {
  journeyId: number
  journeyUuid?: string
  courseId: number
  courseLabel: string
  courseValue?: string
  displayTitle: string
  path: string
  currentStep: number
  canContinue: boolean
  status?: string | null
  fullName: string
  email: string
  phone: string
  workloadVariantId?: number
  cpf?: string
  pricingId?: number
  paymentPlanLabel?: string
  entryMethod?: string
  presentationLetter?: string
  essayThemeId?: string
  essayTitle?: string
  essayText?: string
  enemRegistration?: string
}

const CRM_LEAD_ENDPOINT =
  import.meta.env.VITE_CRM_LEAD_ENDPOINT ?? '/crm-api/administrativo/leads/adicionar'
const CRM_NOT_IDENTIFIED = 'Não identificado'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const NAME_REGEX = /^[\p{L}\s.'-]+$/u

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

function formatPhoneMask(value: string): string {
  const digits = normalizePhone(value)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

function formatCpfMask(value: string): string {
  const digits = normalizeCpf(value)
  if (!digits) return ''
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function normalizeName(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/^\s+/, '')
}

function validateFullName(value: string): string | undefined {
  const normalized = value.trim()
  if (!normalized) return 'Informe seu nome completo.'
  if (normalized.length < 5) return 'Digite nome e sobrenome.'
  if (!NAME_REGEX.test(normalized)) return 'Use apenas letras no nome.'
  if (normalized.split(' ').filter(Boolean).length < 2) return 'Digite nome e sobrenome.'
  return undefined
}

function validateEmail(value: string): string | undefined {
  const normalized = value.trim()
  if (!normalized) return 'Informe seu e-mail.'
  if (!EMAIL_REGEX.test(normalized)) return 'Digite um e-mail válido.'
  return undefined
}

function validatePhone(value: string): string | undefined {
  const digits = normalizePhone(value)
  if (!digits) return 'Informe seu WhatsApp.'
  if (digits.length !== 10 && digits.length !== 11) {
    return 'Digite um telefone com DDD válido.'
  }
  return undefined
}

function validateCpf(value: string): string | undefined {
  const digits = normalizeCpf(value)
  if (!digits) return 'Informe seu CPF.'
  if (digits.length !== 11) return 'Digite um CPF válido.'
  return undefined
}

function pickTrackingValue(
  source: Record<string, string>,
  aliases: string[],
  fallback = CRM_NOT_IDENTIFIED,
): string {
  for (const alias of aliases) {
    const normalizedAlias = alias.toLowerCase()
    const value = source[normalizedAlias]
    if (value && value.trim()) return value.trim()
  }
  return fallback
}

function normalizeBearerToken(token?: string): string | null {
  if (!token) return null

  let normalized = token.trim()
  if (!normalized) return null

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim()
  }

  if (!normalized) return null
  return normalized.startsWith('Bearer ') ? normalized : `Bearer ${normalized}`
}

function parseEnvInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeCurrentStep(value: number | string | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readRecordString(
  record: Record<string, unknown> | undefined,
  keys: string[],
): string | undefined {
  if (!record) return undefined

  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  return undefined
}

function readRecordNumber(
  record: Record<string, unknown> | undefined,
  keys: string[],
): number | undefined {
  if (!record) return undefined

  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseInt(value, 10)
      if (Number.isFinite(parsed)) return parsed
    }
  }

  return undefined
}

async function fetchResumeCourseRoutes(
  courseType: CourseType,
  courseIds: number[],
): Promise<Map<number, ResumeCourseRoute>> {
  const uniqueIds = [...new Set(courseIds.filter((value) => Number.isInteger(value) && value > 0))]
  if (!uniqueIds.length) return new Map()

  const response = await fetch('/api/course-routes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseType,
      courseIds: uniqueIds,
    }),
  })

  const payload = (await response.json().catch(() => null)) as
    | { data?: { items?: ResumeCourseRoute[] }; message?: string }
    | null

  if (!response.ok) {
    throw new Error(payload?.message || 'N\u00e3o foi poss\u00edvel localizar os cursos da inscri\u00e7\u00e3o.')
  }

  const items = Array.isArray(payload?.data?.items) ? payload.data.items : []
  return new Map(items.map((item) => [item.courseId, item]))
}

function buildResumeOption(
  snapshot: JourneySnapshot | JourneyPendingItem,
  courseType: CourseType,
  fallbackCourseId: number | undefined,
  fallbackCourseName: string | undefined,
  fallbackEmail: string,
): ResumeCourseOption | null {
  const step1 = isRecord(snapshot.step_1) ? snapshot.step_1 : undefined
  const step2 = isRecord(snapshot.step_2) ? snapshot.step_2 : undefined
  const step3 = isRecord(snapshot.step_3) ? snapshot.step_3 : undefined

  const courseId =
    readRecordNumber(step1, ['course_id']) ??
    (typeof (snapshot as JourneyPendingItem).course_id === 'number'
      ? (snapshot as JourneyPendingItem).course_id
      : undefined) ??
    fallbackCourseId

  if (!courseId || courseId <= 0) return null

  const rawCourseName =
    (isRecord((snapshot as JourneyPendingItem).course)
      ? readRecordString((snapshot as JourneyPendingItem).course as Record<string, unknown>, ['name'])
      : undefined) ||
    fallbackCourseName ||
    `Curso ${courseId}`

  return {
    journeyId: snapshot.journey_id,
    journeyUuid: snapshot.journey_uuid,
    courseId,
    courseLabel: rawCourseName,
    displayTitle: rawCourseName,
    path: getCoursePath({ courseType, courseLabel: rawCourseName }),
    currentStep: normalizeCurrentStep(snapshot.current_step),
    canContinue: snapshot.can_continue !== false,
    status: snapshot.status ?? null,
    fullName: readRecordString(step1, ['full_name', 'nome']) || '',
    email: readRecordString(step1, ['email']) || fallbackEmail,
    phone: readRecordString(step1, ['phone', 'whatsapp']) || '',
    workloadVariantId:
      readRecordNumber(step2, ['workload_variant_id']) ??
      readRecordNumber(step1, ['workload_variant_id']),
    cpf: readRecordString(step2, ['cpf']),
    pricingId: readRecordNumber(step2, ['pricing_id']),
    paymentPlanLabel: readRecordString(step2, ['payment_plan_label']),
    entryMethod: readRecordString(step3, ['entry_method']),
    presentationLetter: readRecordString(step3, ['presentation_letter']),
    essayThemeId: readRecordString(step3, ['essay_theme_id']),
    essayTitle: readRecordString(step3, ['essay_title']),
    essayText: readRecordString(step3, ['essay_text']),
    enemRegistration: readRecordString(step3, ['enem_registration', 'enem_code']),
  }
}

export function CourseLeadForm({
  courseType,
  courseTitle,
  courseLabel,
  courseValue,
  courseId,
  leadSubmitted = false,
  paymentPlanGroups = [],
  paymentPlanOptions,
  workloadOptions,
  pricing,
  showInternshipInfoLink = false,
}: Props) {
  const hasSecondStep = courseType === 'pos' || courseType === 'graduacao'
  const [step, setStep] = useState<Step>(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState(paymentPlanOptions[0] ?? '')
  const [workload, setWorkload] = useState(workloadOptions[0] ?? '')
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherOpen, setVoucherOpen] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [advanceLoading, setAdvanceLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [crmSubmitted, setCrmSubmitted] = useState(leadSubmitted)
  const [resumeMode, setResumeMode] = useState<ResumeMode>('default')
  const [resumeEmail, setResumeEmail] = useState('')
  const [resumeAgreementAccepted, setResumeAgreementAccepted] = useState(false)
  const [resumeErrors, setResumeErrors] = useState<ResumeFieldErrors>({})
  const [resumeLoading, setResumeLoading] = useState(false)
  const [resumeMessage, setResumeMessage] = useState('')
  const [resumeOptions, setResumeOptions] = useState<ResumeCourseOption[]>([])
  const [selectedResumeJourneyId, setSelectedResumeJourneyId] = useState('')
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const cpfInputRef = useRef<HTMLInputElement | null>(null)
  const resumeEmailInputRef = useRef<HTMLInputElement | null>(null)

  const selectedPaymentPlanGroup = useMemo(() => {
    if (!paymentPlanGroups.length) return null

    return (
      paymentPlanGroups.find((group) => group.workload === workload) ?? paymentPlanGroups[0] ?? null
    )
  }, [paymentPlanGroups, workload])

  const visiblePaymentPlanOptions =
    selectedPaymentPlanGroup?.paymentPlanOptions.length
      ? selectedPaymentPlanGroup.paymentPlanOptions
      : paymentPlanOptions

  const visibleCurrentInstallmentText =
    selectedPaymentPlanGroup?.currentInstallmentText || pricing.currentInstallmentText

  const hydrateResumeIntoCurrentCourse = (progress: StoredJourneyProgress) => {
    if (progress.fullName) setFullName(progress.fullName)
    if (progress.email) setEmail(progress.email)
    if (progress.phone) setPhone(formatPhoneMask(progress.phone))
    if (progress.cpf) setCpf(formatCpfMask(progress.cpf))
    setAgreementAccepted(true)

    if (progress.workloadVariantId) {
      const matchedGroup = paymentPlanGroups.find(
        (group) => group.workloadVariantId === progress.workloadVariantId,
      )

      if (matchedGroup) {
        setWorkload(matchedGroup.workload)
        setPaymentPlan(
          progress.paymentPlanLabel && matchedGroup.paymentPlanOptions.includes(progress.paymentPlanLabel)
            ? progress.paymentPlanLabel
            : (matchedGroup.paymentPlanOptions[0] ?? ''),
        )
      }
    }

    if (hasSecondStep) {
      setStep(2)
      window.setTimeout(() => {
        cpfInputRef.current?.focus()
      }, 60)
    }
  }

  useEffect(() => {
    const draft = readCourseLeadDraft()
    const storedJourney = readJourneyProgress()
    const matchesCurrentDraft =
      draft &&
      matchesCourseLeadDraft(draft, {
        courseType,
        courseId,
        courseValue,
        courseLabel,
      })
        ? draft
        : null
    const matchesCurrentJourney =
      storedJourney &&
      matchesJourneyProgress(storedJourney, {
        courseType,
        courseId,
        courseValue,
        courseLabel,
      })
        ? storedJourney
        : null

    if (matchesCurrentDraft) {
      setFullName(matchesCurrentDraft.fullName)
      setEmail(matchesCurrentDraft.email)
      setPhone(matchesCurrentDraft.phone)
      setResumeEmail(matchesCurrentDraft.email)
    } else if (matchesCurrentJourney?.email) {
      setResumeEmail(matchesCurrentJourney.email)
    }

    if (!matchesCurrentJourney) return

    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('resume') !== '1') return

    if (courseType === 'graduacao' && normalizeCurrentStep(matchesCurrentJourney.currentStep) >= 2) {
      storeGraduationVestibularLead({
        fullName: matchesCurrentJourney.fullName || '',
        email: matchesCurrentJourney.email || '',
        cpf: matchesCurrentJourney.cpf,
        journeyId: matchesCurrentJourney.journeyId,
        courseId: matchesCurrentJourney.courseId,
        courseLabel: matchesCurrentJourney.courseLabel,
        courseValue: matchesCurrentJourney.courseValue,
        currentStep: normalizeCurrentStep(matchesCurrentJourney.currentStep),
        entryMethod: matchesCurrentJourney.entryMethod,
        presentationLetter: matchesCurrentJourney.presentationLetter,
        essayThemeId: matchesCurrentJourney.essayThemeId,
        essayTitle: matchesCurrentJourney.essayTitle,
        essayText: matchesCurrentJourney.essayText,
        enemRegistration: matchesCurrentJourney.enemRegistration,
      })
      window.setTimeout(() => {
        window.location.replace('/graduacao/vestibular')
      }, 20)
      return
    }

    hydrateResumeIntoCurrentCourse(matchesCurrentJourney)
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
  }, [courseId, courseLabel, courseType, courseValue, hasSecondStep, paymentPlanGroups])

  useEffect(() => {
    if (!hasSecondStep) return

    setPaymentPlan((current) =>
      visiblePaymentPlanOptions.includes(current) ? current : (visiblePaymentPlanOptions[0] ?? ''),
    )
  }, [hasSecondStep, visiblePaymentPlanOptions])

  const openResumeFlow = () => {
    const draft = readCourseLeadDraft()
    const storedJourney = readJourneyProgress()
    const matchesCurrentDraft =
      draft &&
      matchesCourseLeadDraft(draft, {
        courseType,
        courseId,
        courseValue,
        courseLabel,
      })
        ? draft
        : null
    const matchesCurrentJourney =
      storedJourney &&
      matchesJourneyProgress(storedJourney, {
        courseType,
        courseId,
        courseValue,
        courseLabel,
      })
        ? storedJourney
        : null

    setResumeMode('lookup')
    setResumeErrors({})
    setResumeMessage('')
    setResumeOptions([])
    setSelectedResumeJourneyId('')
    setResumeAgreementAccepted(false)
    setResumeEmail(matchesCurrentDraft?.email || matchesCurrentJourney?.email || email.trim())

    window.setTimeout(() => {
      resumeEmailInputRef.current?.focus()
    }, 20)
  }

  const closeResumeFlow = () => {
    setResumeMode('default')
    setResumeErrors({})
    setResumeMessage('')
    setResumeOptions([])
    setSelectedResumeJourneyId('')
    setResumeAgreementAccepted(false)
  }

  const validateFirstStep = (): FieldErrors => {
    return {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone),
      agreement: agreementAccepted ? undefined : 'Você precisa aceitar os termos para continuar.',
    }
  }

  const validateSecondStep = (): FieldErrors => {
    return {
      cpf: validateCpf(cpf),
    }
  }

  const submitLeadToCrm = async () => {
    if (crmSubmitted) return

    const trackedFromUrl = syncUtmParamsFromUrl(window.location.search)
    const storedTrackingParams = readStoredUtmParams()
    const trackingParams = { ...storedTrackingParams, ...trackedFromUrl }
    const empresaId = parseEnvInteger(import.meta.env.VITE_CRM_EMPRESA, 9)
    const etapaGrad = parseEnvInteger(import.meta.env.VITE_CRM_ETAPA_GRAD, 78)
    const etapaPos = parseEnvInteger(import.meta.env.VITE_CRM_ETAPA_POS, 78)
    const funilGrad = parseEnvInteger(import.meta.env.VITE_CRM_FUNIL_GRAD, 6)
    const funilPos = parseEnvInteger(import.meta.env.VITE_CRM_FUNIL_POS, 6)
    const statusLead = parseEnvInteger(import.meta.env.VITE_CRM_STATUS_LEAD, 1)
    const poloId = parseEnvInteger(import.meta.env.VITE_CRM_POLO, 4658)

    const payload = {
      aluno: 0,
      nome: fullName.trim(),
      email: email.trim(),
      telefone: normalizePhone(phone),
      empresa: empresaId,
      matricula: '',
      idCurso: courseId ?? 0,
      curso: courseLabel,
      etapa: courseType === 'pos' ? etapaPos : etapaGrad,
      cpf: hasSecondStep ? normalizeCpf(cpf) : '',
      valor: paymentPlan,
      funil: courseType === 'pos' ? funilPos : funilGrad,
      status: statusLead,
      observacao:
        courseType === 'pos'
          ? `PÓS-GRADUAÇÃO: Página do curso Faculdade Paulista | Plano: ${paymentPlan || 'não informado'} | Carga horária: ${workload || 'não informada'} | Voucher: ${voucherCode.trim() || 'não informado'}`
          : `GRADUAÇÃO: Página do curso Faculdade Paulista | Voucher: ${voucherCode.trim() || 'não informado'}`,
      campanha: pickTrackingValue(trackingParams, ['campanha', 'utm_campaign']),
      midia: pickTrackingValue(trackingParams, ['midia', 'utm_medium']),
      fonte:
        courseType === 'pos'
          ? '33'
          : pickTrackingValue(
              trackingParams,
              ['id_fonte_crm', 'fonte', 'utm_source'],
              import.meta.env.VITE_CRM_FONTE_ID ?? '33',
            ),
      fonteTexto:
        import.meta.env.VITE_CRM_FONTE_TEXTO ?? 'Landing Page Faculdade Paulista',
      origem: '1',
      criativo: pickTrackingValue(trackingParams, [
        'criativo',
        'conteudo_anuncio',
        'utm_content',
      ]),
      id_clique_google: pickTrackingValue(trackingParams, ['id_clique_google', 'gclid']),
      id_clique_facebbok: pickTrackingValue(trackingParams, [
        'id_clique_facebbok',
        'id_clique_facebook',
        'fbclid',
      ]),
      id_clique_microsoft: pickTrackingValue(trackingParams, [
        'id_clique_microsoft',
        'msclkid',
      ]),
      conjunto_de_Anuncios: pickTrackingValue(trackingParams, [
        'conjunto_de_anuncios',
        'adset_name',
        'adset',
        'utm_term',
      ]),
      polo: poloId,
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    const bearerToken = normalizeBearerToken(import.meta.env.VITE_CRM_BEARER_TOKEN)
    if (bearerToken) {
      headers.Authorization = bearerToken
    }

    if (import.meta.env.VITE_CRM_API_KEY) {
      headers['X-API-KEY'] = import.meta.env.VITE_CRM_API_KEY
    }

    const response = await fetch(CRM_LEAD_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`CRM request failed with status ${response.status}`)
    }

    setCrmSubmitted(true)
  }

  const ensureJourneyStep1 = async () => {
    if (!courseId) {
      throw new Error('Curso sem identificação para iniciar a inscrição.')
    }

    if (courseType === 'pos' && !selectedPaymentPlanGroup?.workloadVariantId) {
      throw new Error('Carga horária indisponível para iniciar a inscrição deste curso.')
    }

    const matchingJourney = readJourneyProgress()
    if (
      matchingJourney &&
      matchesJourneyProgress(matchingJourney, {
        courseType,
        courseId,
        courseValue,
        courseLabel,
      })
    ) {
      return matchingJourney.journeyId
    }

    const payload =
      courseType === 'pos'
        ? {
            course_id: courseId,
            nome: fullName.trim(),
            email: email.trim(),
            whatsapp: normalizePhone(phone),
            workload_variant_id: selectedPaymentPlanGroup?.workloadVariantId ?? undefined,
            voucher_code: voucherCode.trim() || undefined,
          }
        : {
            course_id: courseId,
            full_name: fullName.trim(),
            email: email.trim(),
            phone: normalizePhone(phone),
          }

    const response = await createJourneyStep1(payload)
    saveJourneyProgress({
      journeyId: response.journey_id,
      journeyUuid: response.journey_uuid,
      courseType,
      courseId,
      courseValue,
      courseLabel,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: normalizePhone(phone),
      workloadVariantId: selectedPaymentPlanGroup?.workloadVariantId ?? undefined,
      currentStep: response.current_step ?? 1,
    })

    return response.journey_id
  }

  const goToSecondStep = async () => {
    const nextErrors = validateFirstStep()
    setErrors(nextErrors)

    if (nextErrors.fullName || nextErrors.email || nextErrors.phone || nextErrors.agreement) {
      return
    }

    setAdvanceLoading(true)

    try {
      if (!leadSubmitted) {
        await submitLeadToCrm()
      }
      await ensureJourneyStep1()
      saveCourseLeadDraft({
        courseType,
        courseValue,
        courseLabel,
        courseId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
      })

      setAdvanceLoading(false)
      setStep(2)
      setPaymentPlan((current) => current || visiblePaymentPlanOptions[0] || '')
      setWorkload((current) => current || workloadOptions[0] || '')
      window.setTimeout(() => {
        cpfInputRef.current?.focus()
      }, 20)
    } catch (error) {
      console.error('Erro ao iniciar jornada da página de curso:', error)
      setAdvanceLoading(false)
      setSubmitStatus('error')
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível iniciar sua inscrição agora. Tente novamente em instantes.',
      )
    }
  }

  const handleBack = () => {
    setErrors({})
    setStep(1)
  }

  const buildStoredJourneyProgress = (
    option: ResumeCourseOption,
  ): Omit<StoredJourneyProgress, 'createdAt'> => ({
    journeyId: option.journeyId,
    journeyUuid: option.journeyUuid,
    courseType,
    courseId: option.courseId,
    courseLabel: option.courseLabel,
    courseValue: option.courseValue,
    fullName: option.fullName,
    email: option.email,
    phone: option.phone,
    workloadVariantId: option.workloadVariantId,
    cpf: option.cpf,
    pricingId: option.pricingId,
    paymentPlanLabel: option.paymentPlanLabel,
    entryMethod: option.entryMethod,
    presentationLetter: option.presentationLetter,
    essayThemeId: option.essayThemeId,
    essayTitle: option.essayTitle,
    essayText: option.essayText,
    enemRegistration: option.enemRegistration,
    currentStep: option.currentStep,
    status: option.status,
  })

  const continueWithResumeOption = async (option: ResumeCourseOption) => {
    const refreshedSnapshot = await resumeJourney({
      course_id: option.courseId,
      email: resumeEmail.trim(),
    })

    const refreshedOption = buildResumeOption(
      refreshedSnapshot,
      courseType,
      option.courseId,
      option.courseLabel,
      resumeEmail.trim(),
    )

    if (!refreshedOption) {
      throw new Error('N\u00e3o foi poss\u00edvel retomar esta inscri\u00e7\u00e3o agora.')
    }

    refreshedOption.displayTitle = option.displayTitle
    refreshedOption.path = option.path
    refreshedOption.courseLabel = option.courseLabel
    refreshedOption.courseValue = option.courseValue

    if (refreshedOption.fullName || refreshedOption.email || refreshedOption.phone) {
      saveCourseLeadDraft({
        courseType,
        courseValue: refreshedOption.courseValue,
        courseLabel: refreshedOption.courseLabel,
        courseId: refreshedOption.courseId,
        fullName: refreshedOption.fullName,
        email: refreshedOption.email,
        phone: formatPhoneMask(refreshedOption.phone),
      })
    }

    saveJourneyProgress(buildStoredJourneyProgress(refreshedOption))

    if (courseType === 'graduacao' && refreshedOption.currentStep >= 2) {
      storeGraduationVestibularLead({
        fullName: refreshedOption.fullName,
        email: refreshedOption.email,
        cpf: refreshedOption.cpf,
        journeyId: refreshedOption.journeyId,
        courseId: refreshedOption.courseId,
        courseLabel: refreshedOption.courseLabel,
        courseValue: refreshedOption.courseValue,
        currentStep: refreshedOption.currentStep,
        entryMethod: refreshedOption.entryMethod,
        presentationLetter: refreshedOption.presentationLetter,
        essayThemeId: refreshedOption.essayThemeId,
        essayTitle: refreshedOption.essayTitle,
        essayText: refreshedOption.essayText,
        enemRegistration: refreshedOption.enemRegistration,
      })
      window.location.assign('/graduacao/vestibular')
      return
    }

    const isCurrentCourse = refreshedOption.courseId === courseId
    if (!isCurrentCourse) {
      window.location.assign(`${refreshedOption.path}?resume=1`)
      return
    }

    hydrateResumeIntoCurrentCourse(buildStoredJourneyProgress(refreshedOption) as StoredJourneyProgress)
    setResumeMode('default')
    setResumeMessage('')
  }

  const handleResumeLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: ResumeFieldErrors = {
      email: validateEmail(resumeEmail),
      agreement: resumeAgreementAccepted ? undefined : 'Voc\u00ea precisa aceitar os termos para continuar.',
    }
    setResumeErrors(nextErrors)
    setResumeMessage('')

    if (nextErrors.email || nextErrors.agreement) {
      return
    }

    setResumeLoading(true)

    try {
      const normalizedEmail = resumeEmail.trim()
      const pendingResponse = await getPendingJourneys({ email: normalizedEmail })
      const filteredPendingItems = (pendingResponse.items ?? []).filter((item) => {
        if ((item.course_level ?? '') !== courseType) return false
        return item.can_continue !== false
      })

      const optionMap = new Map<number, ResumeCourseOption>()
      for (const item of filteredPendingItems) {
        const option = buildResumeOption(
          item,
          courseType,
          typeof item.course_id === 'number' ? item.course_id : undefined,
          isRecord(item.course) ? readRecordString(item.course as Record<string, unknown>, ['name']) : undefined,
          normalizedEmail,
        )
        if (option) optionMap.set(option.journeyId, option)
      }

      if (courseId) {
        try {
          const currentCourseResume = await resumeJourney({
            course_id: courseId,
            email: normalizedEmail,
          })
          if (currentCourseResume.can_continue !== false) {
            const currentOption = buildResumeOption(
              currentCourseResume,
              courseType,
              courseId,
              courseLabel,
              normalizedEmail,
            )
            if (currentOption) optionMap.set(currentOption.journeyId, currentOption)
          }
        } catch {
          // Ignore when the current course has no resumable journey for this e-mail.
        }
      }

      const options = [...optionMap.values()]
      if (!options.length) {
        setResumeMessage('N\u00e3o encontramos uma inscri\u00e7\u00e3o em andamento para este e-mail.')
        setResumeLoading(false)
        return
      }

      const routeMap = await fetchResumeCourseRoutes(
        courseType,
        options.map((option) => option.courseId),
      )

      const currentPath = window.location.pathname
      const mappedOptions = options.map((option) => {
        const route = routeMap.get(option.courseId)
        const isCurrentCourse = option.courseId === courseId
        return {
          ...option,
          displayTitle: route?.title || option.displayTitle,
          courseLabel: route?.courseLabel || (isCurrentCourse ? courseLabel : option.courseLabel),
          courseValue: route?.courseValue || (isCurrentCourse ? courseValue : option.courseValue),
          path:
            route?.path ||
            (isCurrentCourse
              ? currentPath
              : getCoursePath({
                  courseType,
                  courseLabel: option.courseLabel,
                  courseValue: option.courseValue,
                })),
        }
      })

      if (mappedOptions.length === 1) {
        await continueWithResumeOption(mappedOptions[0])
        return
      }

      setResumeOptions(mappedOptions)
      setSelectedResumeJourneyId(String(mappedOptions[0]?.journeyId ?? ''))
      setResumeMode('select')
      setResumeMessage('')
    } catch (error) {
      setResumeMessage(
        error instanceof Error
          ? error.message
          : 'N\u00e3o foi poss\u00edvel localizar sua inscri\u00e7\u00e3o agora. Tente novamente em instantes.',
      )
    } finally {
      setResumeLoading(false)
    }
  }

  const handleResumeSelection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const selectedOption = resumeOptions.find(
      (option) => String(option.journeyId) === selectedResumeJourneyId,
    )

    if (!selectedOption) {
      setResumeErrors({ courseId: 'Selecione um curso para continuar.' })
      return
    }

    setResumeErrors({})
    setResumeLoading(true)
    setResumeMessage('')

    try {
      await continueWithResumeOption(selectedOption)
    } catch (error) {
      setResumeMessage(
        error instanceof Error
          ? error.message
          : 'N\u00e3o foi poss\u00edvel retomar sua inscri\u00e7\u00e3o agora. Tente novamente em instantes.',
      )
    } finally {
      setResumeLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (hasSecondStep && step === 1) {
      await goToSecondStep()
      return
    }

    const nextErrors = {
      ...validateFirstStep(),
      ...(hasSecondStep ? validateSecondStep() : {}),
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setSubmitStatus('submitting')
    setSubmitMessage('Enviando seus dados...')

    try {
      if (!leadSubmitted) {
        await submitLeadToCrm()
      }

      const ensuredJourneyId = await ensureJourneyStep1()

      if (courseType === 'pos') {
        if (!selectedPaymentPlanGroup?.pricingId || !selectedPaymentPlanGroup.workloadVariantId) {
          throw new Error('Preço ou carga horária indisponíveis para concluir esta inscrição.')
        }

        const defaultPoleId = parseEnvInteger(import.meta.env.VITE_JOURNEY_DEFAULT_POLE_ID, 0)
        const step2Payload: Record<string, unknown> = {
          cpf: normalizeCpf(cpf),
          workload_variant_id: selectedPaymentPlanGroup.workloadVariantId,
          pricing_id: selectedPaymentPlanGroup.pricingId,
          payment_plan_label: paymentPlan || undefined,
          voucher_code: voucherCode.trim() || undefined,
        }

        if (defaultPoleId > 0) {
          step2Payload.pole_id = defaultPoleId
        }

        const step2Response = await updateJourneyStep2(ensuredJourneyId, step2Payload)
        saveJourneyProgress({
          journeyId: ensuredJourneyId,
          courseType,
          courseId: courseId ?? 0,
          courseValue,
          courseLabel,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: normalizePhone(phone),
          workloadVariantId: selectedPaymentPlanGroup?.workloadVariantId ?? undefined,
          cpf: normalizeCpf(cpf),
          pricingId: selectedPaymentPlanGroup.pricingId,
          paymentPlanLabel: paymentPlan || undefined,
          currentStep: step2Response.current_step ?? 2,
        })
        const finalizeResponse = await finalizeJourney(ensuredJourneyId, {
          voucher_code: voucherCode.trim() || undefined,
        })

        clearCourseLeadDraft()
        clearJourneyProgress()
        storePostThankYouLead({
          fullName: fullName.trim(),
          email: email.trim(),
        })
        setSubmitStatus('success')
        setSubmitMessage(finalizeResponse.message || 'Inscrição enviada com sucesso. Redirecionando...')
        window.setTimeout(() => {
          window.location.assign('/pos-graduacao/inscricao-finalizada')
        }, 80)
        return
      }

      const normalizedGraduationCpf = normalizeCpf(cpf)

      if (normalizedGraduationCpf) {
        try {
          const step2Response = await updateJourneyStep2(ensuredJourneyId, {
            cpf: normalizedGraduationCpf,
          })

          saveJourneyProgress({
            journeyId: ensuredJourneyId,
            courseType,
            courseId: courseId ?? 0,
            courseValue,
            courseLabel,
            fullName: fullName.trim(),
            email: email.trim(),
            phone: normalizePhone(phone),
            cpf: normalizedGraduationCpf,
            currentStep: step2Response.current_step ?? 2,
          })
        } catch (error) {
          // Graduation step 2 is still unstable in the admin backend.
          // Keep the user moving to the vestibular flow while preserving the CPF locally.
          console.warn('Não foi possível sincronizar o CPF da graduação nesta etapa:', error)
        }
      }

      clearCourseLeadDraft()

      storeGraduationVestibularLead({
        fullName: fullName.trim(),
        email: email.trim(),
        journeyId: ensuredJourneyId,
        courseId: courseId ?? 0,
        courseLabel,
        courseValue,
        cpf: normalizedGraduationCpf || undefined,
        currentStep: 2,
      })
      setSubmitStatus('success')
      setSubmitMessage('Inscrição enviada com sucesso. Redirecionando...')
      window.setTimeout(() => {
        window.location.assign('/graduacao/vestibular')
      }, 80)
    } catch (error) {
      console.error('Erro ao enviar lead da página de curso:', error)
      setSubmitStatus('error')
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar agora. Tente novamente em instantes.',
      )
    }
  }

  const primaryButtonLabel = hasSecondStep
    ? step === 1
      ? 'CONTINUAR'
      : 'INSCREVA-SE'
    : 'INSCREVA-SE'
  const primaryButtonBusy = advanceLoading || submitStatus === 'submitting'
  const title =
    courseType === 'graduacao'
      ? 'PREENCHA O FORMULÁRIO PARA SE INSCREVER'
      : 'PREENCHA O FORMULÁRIO E SAIBA MAIS'
  const showPriceCard = Boolean(visibleCurrentInstallmentText)
  const promoBannerSrc =
    courseType === 'pos' ? '/course/topo-form-pos-grad.webp' : '/course/topo-form-grad.webp'
  const promoBannerWidth = courseType === 'pos' ? 513 : 510
  const fullNamePlaceholder = courseType === 'graduacao' ? 'Nome completo' : 'Nome'
  const phonePlaceholder = courseType === 'graduacao' ? 'Telefone' : 'WhatsApp'

  if (resumeMode !== 'default') {
    const isLookupMode = resumeMode === 'lookup'

    return (
      <form
        className={`course-lead-form course-lead-form--${courseType}`}
        onSubmit={isLookupMode ? handleResumeLookup : handleResumeSelection}
        noValidate
      >
        <div className="course-lead-form__promo course-lead-form__promo--image" aria-hidden="true">
          <img src={promoBannerSrc} alt="" width={promoBannerWidth} height="83" decoding="async" />
        </div>

        <p className="course-lead-form__resume">
          {isLookupMode ? (
            <>
              {'Ainda n\u00e3o se inscreveu? '}
              <button type="button" onClick={closeResumeFlow}>
                Clique aqui e inscreva-se
              </button>
            </>
          ) : (
            'J\u00e1 iniciou sua inscri\u00e7\u00e3o? Clique aqui para continuar'
          )}
        </p>

        <div className="course-lead-form__header">
          <h2>{isLookupMode ? 'INFORME SEU E-MAIL PARA CONTINUAR' : 'SELECIONE O CURSO'}</h2>
        </div>

        <div className="course-lead-form__fields">
          {isLookupMode ? (
            <>
              <div className="course-lead-form__field-stack">
                <label className={`course-lead-form__field ${resumeErrors.email ? 'is-invalid' : ''}`}>
                  <input
                    ref={resumeEmailInputRef}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    maxLength={120}
                    value={resumeEmail}
                    onChange={(event) => setResumeEmail(event.target.value)}
                  />
                </label>
                {resumeErrors.email ? <p className="course-lead-form__error">{resumeErrors.email}</p> : null}
              </div>

              <label className={`course-lead-form__agreement ${resumeErrors.agreement ? 'is-invalid' : ''}`}>
                <input
                  type="checkbox"
                  checked={resumeAgreementAccepted}
                  onChange={(event) => setResumeAgreementAccepted(event.target.checked)}
                />
                <span>
                  {'Ao continuar voc\u00ea concorda com nossos '}
                  <a href="/termos-de-uso" target="_blank" rel="noreferrer">
                    Termos de uso
                  </a>{' '}
                  e{' '}
                  <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">
                    {'Pol\u00edticas de Privacidade'}
                  </a>
                </span>
              </label>
              {resumeErrors.agreement ? <p className="course-lead-form__error">{resumeErrors.agreement}</p> : null}
            </>
          ) : (
            <div className="course-lead-form__field-stack">
              <label
                className={`course-lead-form__field course-lead-form__field--select ${resumeErrors.courseId ? 'is-invalid' : ''}`}
              >
                <select
                  value={selectedResumeJourneyId}
                  onChange={(event) => setSelectedResumeJourneyId(event.target.value)}
                >
                  {resumeOptions.map((option) => (
                    <option key={option.journeyId} value={String(option.journeyId)}>
                      {option.displayTitle}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={2} />
              </label>
              {resumeErrors.courseId ? <p className="course-lead-form__error">{resumeErrors.courseId}</p> : null}
            </div>
          )}
        </div>

        <div className="course-lead-form__actions">
          <button type="submit" className="course-lead-form__submit" disabled={resumeLoading}>
            {resumeLoading ? (
              <LoaderCircle className="course-lead-form__spinner" size={26} strokeWidth={2.25} />
            ) : (
              <span>CONTINUAR</span>
            )}
          </button>
        </div>

        {resumeMessage ? <p className="course-lead-form__feedback is-error">{resumeMessage}</p> : null}
      </form>
    )
  }

  return (
    <form
      className={`course-lead-form course-lead-form--${courseType}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="course-lead-form__promo course-lead-form__promo--image" aria-hidden="true">
        <img src={promoBannerSrc} alt="" width={promoBannerWidth} height="83" decoding="async" />
      </div>

      <p className="course-lead-form__resume">
        {'J\u00e1 iniciou sua inscri\u00e7\u00e3o? '}
        <button type="button" onClick={openResumeFlow}>
          Clique aqui para continuar
        </button>
      </p>

            <div className="course-lead-form__header">
        <h2>{title}</h2>
      </div>

      <div className="course-lead-form__fields">
        {step === 1 ? (
          <>
            <div className="course-lead-form__field-stack">
              <label className={`course-lead-form__field ${errors.fullName ? 'is-invalid' : ''}`}>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder={fullNamePlaceholder}
                  autoComplete="name"
                  maxLength={120}
                  value={fullName}
                  onChange={(event) => setFullName(normalizeName(event.target.value))}
                />
              </label>
              {errors.fullName ? <p className="course-lead-form__error">{errors.fullName}</p> : null}
            </div>

            <div className="course-lead-form__field-row">
              <div className="course-lead-form__field-stack">
                <label className={`course-lead-form__field ${errors.email ? 'is-invalid' : ''}`}>
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    maxLength={120}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>
                {errors.email ? <p className="course-lead-form__error">{errors.email}</p> : null}
              </div>

              <div className="course-lead-form__field-stack">
                <label className={`course-lead-form__field ${errors.phone ? 'is-invalid' : ''}`}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder={phonePlaceholder}
                    autoComplete="tel-national"
                    maxLength={15}
                    value={phone}
                    onChange={(event) => setPhone(formatPhoneMask(event.target.value))}
                  />
                </label>
                {errors.phone ? <p className="course-lead-form__error">{errors.phone}</p> : null}
              </div>
            </div>

            {courseType === 'pos' ? (
              <>
                <label className="course-lead-form__field course-lead-form__field--select">
                  <select value={workload} onChange={(event) => setWorkload(event.target.value)}>
                    {workloadOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} strokeWidth={2} />
                </label>

                {showInternshipInfoLink ? (
                  <a
                    className="course-lead-form__info-link course-lead-form__info-link--step1"
                    href="/politica-de-privacidade"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AlertCircle size={18} strokeWidth={2} />
                    <span>{'Saiba mais sobre o Est\u00e1gio e a Pr\u00e1tica Obrigat\u00f3ria'}</span>
                  </a>
                ) : null}
              </>
            ) : null}

            <label className={`course-lead-form__agreement ${errors.agreement ? 'is-invalid' : ''}`}>
              <input
                type="checkbox"
                checked={agreementAccepted}
                onChange={(event) => setAgreementAccepted(event.target.checked)}
              />
              <span>
                {'Ao continuar voc\u00ea concorda com nossos '}
                <a href="/termos-de-uso" target="_blank" rel="noreferrer">
                  Termos de uso
                </a>{' '}
                e{' '}
                <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">
                  {'Pol\u00edticas de Privacidade'}
                </a>
              </span>
            </label>
            {errors.agreement ? <p className="course-lead-form__error">{errors.agreement}</p> : null}
          </>
        ) : (
          <>
            <div className="course-lead-form__field-stack">
              <label className={`course-lead-form__field ${errors.cpf ? 'is-invalid' : ''}`}>
                <input
                  ref={cpfInputRef}
                  type="text"
                  inputMode="numeric"
                  placeholder="CPF"
                  autoComplete="off"
                  maxLength={14}
                  value={cpf}
                  onChange={(event) => setCpf(formatCpfMask(event.target.value))}
                />
              </label>
              {errors.cpf ? <p className="course-lead-form__error">{errors.cpf}</p> : null}
            </div>

            {courseType === 'pos' ? (
              <label className="course-lead-form__field course-lead-form__field--select">
                <select value={paymentPlan} onChange={(event) => setPaymentPlan(event.target.value)}>
                  {visiblePaymentPlanOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={2} />
              </label>
            ) : null}

            {courseType === 'pos' && showInternshipInfoLink ? (
              <a
                className="course-lead-form__info-link"
                href="/politica-de-privacidade"
                target="_blank"
                rel="noreferrer"
              >
                <AlertCircle size={18} strokeWidth={2} />
                <span>{'Saiba mais sobre o Est\u00e1gio e a Pr\u00e1tica Obrigat\u00f3ria'}</span>
              </a>
            ) : null}
          </>
        )}
      </div>

      <div className={`course-lead-form__actions ${step === 2 ? 'is-advanced' : ''}`}>
        {step === 2 ? (
          <button type="button" className="course-lead-form__back" onClick={handleBack}>
            <ChevronLeft size={16} strokeWidth={2} />
            <span>Voltar</span>
          </button>
        ) : null}

        <button
          type="submit"
          className="course-lead-form__submit"
          disabled={primaryButtonBusy || submitStatus === 'success'}
        >
          {primaryButtonBusy ? (
            <LoaderCircle className="course-lead-form__spinner" size={26} strokeWidth={2.25} />
          ) : (
            <span>{submitStatus === 'success' ? 'INSCRIÇÃO ENVIADA' : primaryButtonLabel}</span>
          )}
        </button>
      </div>

      {showPriceCard ? (
        <div className="course-lead-form__price-card">
          <div className="course-lead-form__price-badges">
            <span className="course-lead-form__price-tag">Desconto Pontualidade</span>
            <span className="course-lead-form__price-offer">30% OFF</span>
          </div>

          <div className="course-lead-form__price-values">
            <p className="course-lead-form__price-old">{pricing.oldInstallmentText}</p>
            <p className="course-lead-form__price-current">
              Por: <strong>{visibleCurrentInstallmentText.toUpperCase()}</strong>
            </p>
          </div>

          <p className="course-lead-form__price-pix">{pricing.pixText}</p>
        </div>
      ) : null}

      <div className="course-lead-form__voucher-toggle">
        <button type="button" onClick={() => setVoucherOpen((current) => !current)}>
          <span>Código VOUCHER</span>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className={voucherOpen ? 'is-open' : ''}
          />
        </button>
      </div>

      {voucherOpen ? (
        <label className="course-lead-form__field course-lead-form__voucher-field">
          <input
            type="text"
            placeholder="Digite aqui o Voucher caso tenha"
            value={voucherCode}
            onChange={(event) => setVoucherCode(event.target.value)}
          />
          <button type="button" onClick={() => setVoucherCode('')}>
            Remover
          </button>
        </label>
      ) : null}

      {submitMessage ? (
        <p className={`course-lead-form__feedback is-${submitStatus}`}>{submitMessage}</p>
      ) : null}

      <input type="hidden" value={courseTitle} readOnly />
    </form>
  )
}


