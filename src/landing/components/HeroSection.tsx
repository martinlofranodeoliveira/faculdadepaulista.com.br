import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type UIEventHandler,
} from 'react'
import { Search } from 'lucide-react'

import { getCoursePath } from '@/lib/courseRoutes'
import { readStoredUtmParams, syncUtmParamsFromUrl } from '@/lib/utm'
import { saveCourseLeadDraft } from '@/course/courseLeadDraft'

import { COURSE_PREFILL_EVENT, type CoursePrefillDetail } from '../coursePrefill'

const CRM_LEAD_ENDPOINT =
  import.meta.env.VITE_CRM_LEAD_ENDPOINT ??
  '/crm-api/administrativo/leads/adicionar'
const CRM_NOT_IDENTIFIED = 'Não identificado'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const NAME_REGEX = /^[\p{L}\s.'-]+$/u

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type CourseType = 'graduacao' | 'pos'
type FormStep = 1 | 2
type StepTransitionDirection = 'forward' | 'backward'
type StepTransition = {
  phase: 'out' | 'in'
  direction: StepTransitionDirection
}
type CourseOption = { value: string; label: string; courseId?: number }

type HeroSectionProps = {
  graduationOptions: CourseOption[]
  postOptions: CourseOption[]
}
type FieldName = 'courseType' | 'course' | 'fullName' | 'email' | 'phone'
type FieldErrors = Partial<Record<FieldName, string>>
type Touched = Record<FieldName, boolean>

const EMPTY_TOUCHED: Touched = {
  courseType: false,
  course: false,
  fullName: false,
  email: false,
  phone: false,
}

const COURSE_TYPE_OPTIONS: Array<{ value: CourseType; label: string }> = [
  { value: 'graduacao', label: 'Graduação' },
  { value: 'pos', label: 'Pós-graduação EAD' },
]

const STEP_FIELDS: Record<FormStep, FieldName[]> = {
  1: ['courseType', 'course'],
  2: ['fullName', 'email', 'phone'],
}

const STEP_TRANSITION_MS = 320
const STEP_TRANSITION_PHASE_MS = STEP_TRANSITION_MS / 2
const FIELD_ATTENTION_MS = 460

function normalizeComparableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

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
  if (!digits) return 'Informe seu telefone.'
  if (digits.length !== 10 && digits.length !== 11) {
    return 'Digite um telefone com DDD válido.'
  }
  return undefined
}

function validateCourseType(value: string): string | undefined {
  if (!value) return 'Selecione a modalidade.'
  return undefined
}

function validateCourse(value: string): string | undefined {
  if (!value) return 'Informe o curso para continuar'
  return undefined
}

function validateField(field: FieldName, value: string): string | undefined {
  if (field === 'courseType') return validateCourseType(value)
  if (field === 'fullName') return validateFullName(value)
  if (field === 'email') return validateEmail(value)
  if (field === 'phone') return validatePhone(value)
  return validateCourse(value)
}

function isPostGraduationCourse(courseValue: string): boolean {
  return courseValue.toLowerCase().startsWith('pos-')
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

function FormChevronDownIcon() {
  return (
    <svg width="9" height="5" viewBox="0 0 9 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0.75L4.5 4.25L8 0.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function FormBackIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.75 1L2.25 4.5L5.75 8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function HeroSection({ graduationOptions, postOptions }: HeroSectionProps) {
  const [step, setStep] = useState<FormStep>(1)
  const [courseType, setCourseType] = useState<CourseType | ''>('')
  const [isCourseTypeOpen, setIsCourseTypeOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState('')
  const [courseSearch, setCourseSearch] = useState('')
  const [isCourseSearchOpen, setIsCourseSearchOpen] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Touched>(EMPTY_TOUCHED)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [stepTransition, setStepTransition] = useState<StepTransition | null>(null)
  const [attentionField, setAttentionField] = useState<FieldName | null>(null)
  const courseTypeMenuRef = useRef<HTMLDivElement | null>(null)
  const stepTransitionTimerRef = useRef<number | null>(null)
  const fieldAttentionFrameRef = useRef<number | null>(null)
  const fieldAttentionTimerRef = useRef<number | null>(null)

  useEffect(() => {
    syncUtmParamsFromUrl(window.location.search)
  }, [])

  useEffect(() => {
    return () => {
      if (stepTransitionTimerRef.current) {
        window.clearTimeout(stepTransitionTimerRef.current)
      }
      if (fieldAttentionFrameRef.current) {
        window.cancelAnimationFrame(fieldAttentionFrameRef.current)
      }
      if (fieldAttentionTimerRef.current) {
        window.clearTimeout(fieldAttentionTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isCourseTypeOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (courseTypeMenuRef.current?.contains(event.target as Node)) return
      setIsCourseTypeOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsCourseTypeOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isCourseTypeOpen])

  const allCourseOptions = useMemo<CourseOption[]>(() => {
    return graduationOptions
  }, [graduationOptions])

  const courseOptionsLookup = useMemo(() => {
    const map = new Map<string, CourseOption>()
    allCourseOptions.forEach((item) => {
      map.set(item.value, item)
    })
    postOptions.forEach((item) => {
      map.set(item.value, item)
    })
    return map
  }, [allCourseOptions, postOptions])

  const courseLookup = useMemo(() => {
    const map = new Map<string, string>()
    courseOptionsLookup.forEach((item, key) => {
      map.set(key, item.label)
    })
    return map
  }, [courseOptionsLookup])

  const courseOptionsByType = useMemo<Record<CourseType, CourseOption[]>>(() => {
    return {
      graduacao: allCourseOptions,
      pos: postOptions,
    }
  }, [allCourseOptions, postOptions])

  const availableCourses = useMemo(() => {
    if (!courseType) return []
    return courseOptionsByType[courseType]
  }, [courseType, courseOptionsByType])

  const filteredCourses = useMemo(() => {
    const normalized = normalizeComparableText(courseSearch)
    return availableCourses.filter((item) => {
      return normalizeComparableText(item.label).includes(normalized)
    })
  }, [availableCourses, courseSearch])

  const COURSE_SCROLL_PAGE_SIZE = 24
  const [visibleCourseCount, setVisibleCourseCount] = useState(COURSE_SCROLL_PAGE_SIZE)

  useEffect(() => {
    setVisibleCourseCount(COURSE_SCROLL_PAGE_SIZE)
  }, [courseType, courseSearch])

  const visibleCourses = useMemo(() => {
    return filteredCourses.slice(0, visibleCourseCount)
  }, [filteredCourses, visibleCourseCount])

  const canLoadMoreVisibleCourses = visibleCourses.length < filteredCourses.length

  const handleCourseSearchMenuScroll: UIEventHandler<HTMLDivElement> = (event) => {
    if (!canLoadMoreVisibleCourses) return

    const target = event.currentTarget
    const remaining = target.scrollHeight - (target.scrollTop + target.clientHeight)
    if (remaining > 24) return

    setVisibleCourseCount((current) =>
      Math.min(current + COURSE_SCROLL_PAGE_SIZE, filteredCourses.length),
    )
  }

  const handleCoursePrefill = useCallback(
    (detail: CoursePrefillDetail) => {
      const normalizedLabel = detail.courseLabel.trim()
      const normalizedLabelComparable = normalizeComparableText(normalizedLabel)
      const preferredOptions =
        detail.courseType === 'graduacao' ? allCourseOptions : postOptions

      const resolvedOption = preferredOptions.find((option) => {
        return normalizeComparableText(option.label) === normalizedLabelComparable
      })

      const nextCourseValue = detail.courseValue?.trim() || resolvedOption?.value || ''
      const nextCourseLabel = resolvedOption?.label || normalizedLabel

      if (stepTransitionTimerRef.current) {
        window.clearTimeout(stepTransitionTimerRef.current)
        stepTransitionTimerRef.current = null
      }

      setStepTransition(null)
      setCourseType(detail.courseType)
      setCourse(nextCourseValue)
      setCourseSearch(nextCourseLabel)
      setIsCourseTypeOpen(false)
      setStep(1)
      setIsCourseSearchOpen(false)
      setSubmitStatus('idle')
      setSubmitMessage('')

      setFieldErrors((previous) => ({
        ...previous,
        courseType: undefined,
        course: undefined,
      }))

      setTouched((previous) => ({
        ...previous,
        courseType: false,
        course: false,
      }))

    },
    [allCourseOptions, postOptions],
  )

  useEffect(() => {
    const listener: EventListener = (event) => {
      const customEvent = event as CustomEvent<CoursePrefillDetail>
      if (!customEvent.detail) return
      handleCoursePrefill(customEvent.detail)
    }

    window.addEventListener(COURSE_PREFILL_EVENT, listener)
    return () => {
      window.removeEventListener(COURSE_PREFILL_EVENT, listener)
    }
  }, [handleCoursePrefill])

  const applyFieldValidation = (field: FieldName, value: string) => {
    const error = validateField(field, value)
    setFieldErrors((previous) => ({ ...previous, [field]: error }))
  }

  const triggerFieldAttention = useCallback((field: FieldName) => {
    if (fieldAttentionFrameRef.current) {
      window.cancelAnimationFrame(fieldAttentionFrameRef.current)
    }

    if (fieldAttentionTimerRef.current) {
      window.clearTimeout(fieldAttentionTimerRef.current)
    }

    setAttentionField(null)

    fieldAttentionFrameRef.current = window.requestAnimationFrame(() => {
      setAttentionField(field)
      fieldAttentionFrameRef.current = null

      fieldAttentionTimerRef.current = window.setTimeout(() => {
        setAttentionField((current) => (current === field ? null : current))
        fieldAttentionTimerRef.current = null
      }, FIELD_ATTENTION_MS)
    })
  }, [])

  const handleCourseTypeChange = (nextType: CourseType | '') => {
    setCourseType(nextType)
    setCourse('')
    setCourseSearch('')
    setIsCourseSearchOpen(false)
    setIsCourseTypeOpen(false)

    if (touched.courseType) {
      applyFieldValidation('courseType', nextType)
    }

    if (touched.course) {
      applyFieldValidation('course', '')
    }
  }

  const markTouched = (field: FieldName) => {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  const getFieldValue = (field: FieldName): string => {
    if (field === 'courseType') return courseType
    if (field === 'course') return course
    if (field === 'fullName') return fullName
    if (field === 'email') return email
    return phone
  }

  const validateFields = (fields: FieldName[]): FieldName | null => {
    const nextErrors: FieldErrors = {}
    let firstInvalidField: FieldName | null = null

    fields.forEach((field) => {
      const error = validateField(field, getFieldValue(field))
      nextErrors[field] = error
      if (!firstInvalidField && error) {
        firstInvalidField = field
      }
    })

    setFieldErrors((previous) => ({ ...previous, ...nextErrors }))
    setTouched((previous) => {
      const merged = { ...previous }
      fields.forEach((field) => {
        merged[field] = true
      })
      return merged
    })

    return firstInvalidField
  }

  const runStepTransition = (nextStep: FormStep, direction: StepTransitionDirection) => {
    if (nextStep === step) return

    if (stepTransitionTimerRef.current) {
      window.clearTimeout(stepTransitionTimerRef.current)
    }

    setStepTransition({ direction, phase: 'out' })

    stepTransitionTimerRef.current = window.setTimeout(() => {
      setStep(nextStep)
      setStepTransition({ direction, phase: 'in' })

      stepTransitionTimerRef.current = window.setTimeout(() => {
        setStepTransition(null)
        stepTransitionTimerRef.current = null
      }, STEP_TRANSITION_PHASE_MS)
    }, STEP_TRANSITION_PHASE_MS)
  }

  const handleStepAdvance = (from: FormStep) => {
    const firstInvalidField = validateFields(STEP_FIELDS[from])
    if (firstInvalidField) {
      triggerFieldAttention(firstInvalidField)
      setSubmitStatus('idle')
      setSubmitMessage('')
      return
    }

    if (from === 1) {
      setIsCourseSearchOpen(false)
    }

    runStepTransition((Math.min(from + 1, 2) as FormStep), 'forward')
    setSubmitStatus('idle')
    setSubmitMessage('')
  }

  const handleStepBack = () => {
    runStepTransition((Math.max(step - 1, 1) as FormStep), 'backward')
    setSubmitStatus('idle')
    setSubmitMessage('')
  }

  const validateAllFields = (): FieldErrors => {
    return {
      courseType: validateCourseType(courseType),
      course: validateCourse(course),
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone),
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (step === 1) {
      handleStepAdvance(1)
      return
    }

    const errors = validateAllFields()
    setFieldErrors(errors)
    setTouched({
      courseType: true,
      course: true,
      fullName: true,
      email: true,
      phone: true,
    })

    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) {
      const firstInvalidField =
        [...STEP_FIELDS[1], ...STEP_FIELDS[2]].find((field) => Boolean(errors[field])) ?? null

      if (firstInvalidField) {
        triggerFieldAttention(firstInvalidField)
      }

      setSubmitStatus('idle')
      setSubmitMessage('')
      return
    }

    setSubmitStatus('submitting')
    setSubmitMessage('Enviando seus dados...')

    try {
      const trackedFromUrl = syncUtmParamsFromUrl(window.location.search)
      const storedTrackingParams = readStoredUtmParams()
      const trackingParams = { ...storedTrackingParams, ...trackedFromUrl }
      const phoneDigits = normalizePhone(phone)
      const selectedCourseOption = courseOptionsLookup.get(course)
      const courseLabel = (courseLookup.get(course) ?? courseSearch.trim()) || course
      const isPostGraduation = courseType === 'pos' || isPostGraduationCourse(course)
      const empresaId = parseEnvInteger(import.meta.env.VITE_CRM_EMPRESA, 9)
      const etapaGrad = parseEnvInteger(import.meta.env.VITE_CRM_ETAPA_GRAD, 78)
      const etapaPos = parseEnvInteger(import.meta.env.VITE_CRM_ETAPA_POS, 78)
      const funilGrad = parseEnvInteger(import.meta.env.VITE_CRM_FUNIL_GRAD, 6)
      const funilPos = parseEnvInteger(import.meta.env.VITE_CRM_FUNIL_POS, 6)
      const statusLead = parseEnvInteger(import.meta.env.VITE_CRM_STATUS_LEAD, 1)
      const poloId = parseEnvInteger(import.meta.env.VITE_CRM_POLO, 4658)
      const gradCourseId = selectedCourseOption?.courseId ?? 0
      const postCourseId = selectedCourseOption?.courseId ?? 0

      const payload = {
        aluno: 0,
        nome: fullName.trim(),
        email: email.trim(),
        telefone: phoneDigits,
        empresa: empresaId,
        matricula: '',
        idCurso: isPostGraduation ? postCourseId : gradCourseId,
        curso: courseLabel,
        etapa: isPostGraduation ? etapaPos : etapaGrad,
        cpf: '',
        valor: '',
        funil: isPostGraduation ? funilPos : funilGrad,
        status: statusLead,
        observacao: isPostGraduation
          ? 'PÓS-GRADUAÇÃO: Lead Landing Page Faculdade Paulista'
          : 'GRADUAÇÃO: Lead Landing Page Faculdade Paulista',
        campanha: pickTrackingValue(trackingParams, ['campanha', 'utm_campaign']),
        midia: pickTrackingValue(trackingParams, ['midia', 'utm_medium']),
        fonte: isPostGraduation
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

      setSubmitStatus('success')
      setSubmitMessage('Cadastro enviado com sucesso.')
      saveCourseLeadDraft({
        courseType: isPostGraduation ? 'pos' : 'graduacao',
        courseValue: course,
        courseLabel,
        courseId: selectedCourseOption?.courseId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone,
      })
      const redirectPath = getCoursePath(
        {
          courseType: isPostGraduation ? 'pos' : 'graduacao',
          courseValue: course,
          courseLabel,
        },
        { leadSubmitted: true },
      )

      window.setTimeout(() => {
        window.location.assign(redirectPath)
      }, 220)
    } catch (error) {
      console.error('Erro ao enviar lead para o CRM:', error)
      setSubmitStatus('error')
      setSubmitMessage('Não foi possível enviar agora. Tente novamente em instantes.')
    }
  }

  const courseTypeInvalid = Boolean(touched.courseType && fieldErrors.courseType)
  const fullNameInvalid = Boolean(touched.fullName && fieldErrors.fullName)
  const emailInvalid = Boolean(touched.email && fieldErrors.email)
  const phoneInvalid = Boolean(touched.phone && fieldErrors.phone)
  const courseInvalid = Boolean(touched.course && fieldErrors.course)
  const isCourseSearchDisabled = !courseType
  const isStepAnimating = Boolean(stepTransition)
  const stepTransitionClass = stepTransition
    ? `is-${stepTransition.direction}-${stepTransition.phase}`
    : ''
  const formLeadTitle = step === 1 ? 'Encontre seu curso' : 'Informe os dados'
  const selectedCourseTypeLabel =
    COURSE_TYPE_OPTIONS.find((item) => item.value === courseType)?.label ?? 'Modalidade'

  const handleCourseSearchBlockedInteraction = () => {
    if (courseType) return false

    setTouched((previous) => ({ ...previous, courseType: true }))
    setFieldErrors((previous) => ({
      ...previous,
      courseType: validateCourseType(''),
    }))
    setIsCourseSearchOpen(false)
    setSubmitStatus('idle')
    setSubmitMessage('')
    triggerFieldAttention('courseType')

    return true
  }

  return (
    <section className="lp-hero" id="inicio">
      <div className="lp-hero__visual">
        <picture className="lp-hero__banner">
          <source
            media="(max-width: 720px)"
            srcSet="/landing/bg-hero-estudante-faculdade-paulista-mobile.webp"
          />
          <img
            src="/landing/bg-hero-estudante-faculdade-paulista.webp"
            alt=""
            aria-hidden="true"
            width="1905"
            height="620"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>

      <div className="lp-shell lp-hero__form-shell">
        <article className="lp-hero-form" id="inscricao">
          <div className="lp-hero-form__lead">
            <h2>{formLeadTitle}</h2>
          </div>

          <form className="lp-hero-form__fields" onSubmit={handleSubmit} noValidate>
            <div
              className={`lp-hero-form__step-frame ${stepTransitionClass}`}
              aria-live="polite"
            >
            {step === 1 ? (
              <div className="lp-hero-form__row lp-hero-form__row--wizard lp-hero-form__row--step-1">
                <div
                  className={`lp-field-wrap lp-hero-form__field-cell--modality ${
                    attentionField === 'courseType' ? 'is-attention' : ''
                  }`}
                >
                <div
                  className={`lp-field lp-field--select ${courseTypeInvalid ? 'is-invalid' : ''}`}
                  ref={courseTypeMenuRef}
                  onBlur={(event) => {
                    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
                    setIsCourseTypeOpen(false)
                    markTouched('courseType')
                    applyFieldValidation('courseType', courseType)
                  }}
                >
                  <div className="lp-select-wrapper lp-select-wrapper--course-type">
                    <button
                      type="button"
                      className={`lp-native-select-trigger ${!courseType ? 'is-placeholder' : ''}`}
                      aria-label="Selecione o tipo de curso"
                      aria-haspopup="listbox"
                      aria-expanded={isCourseTypeOpen}
                      aria-invalid={courseTypeInvalid}
                      aria-describedby={courseTypeInvalid ? 'hero-course-type-error' : undefined}
                      onClick={() => setIsCourseTypeOpen((current) => !current)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setIsCourseTypeOpen(true)
                        }
                      }}
                    >
                      <span className="lp-native-select-trigger__text">
                        {selectedCourseTypeLabel}
                      </span>
                      <span className="lp-native-select-trigger__icon" aria-hidden="true">
                        <FormChevronDownIcon />
                      </span>
                    </button>

                    {isCourseTypeOpen ? (
                      <div className="lp-native-select-content" role="listbox" aria-label="Modalidade">
                        {COURSE_TYPE_OPTIONS.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            role="option"
                            aria-selected={courseType === item.value}
                            className={`lp-native-select-option ${
                              courseType === item.value ? 'is-selected' : ''
                            }`}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              handleCourseTypeChange(item.value)
                              markTouched('courseType')
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                {courseTypeInvalid ? (
                  <span className="lp-field__error" id="hero-course-type-error">
                    {fieldErrors.courseType}
                  </span>
                ) : null}
              </div>

              <div
                className={`lp-field-wrap lp-course-search-wrap ${
                  attentionField === 'course' ? 'is-attention' : ''
                }`}
              >
                <label
                  className={`lp-field ${courseInvalid ? 'is-invalid' : ''} ${
                    isCourseSearchDisabled ? 'is-disabled' : ''
                  }`}
                  onPointerDown={(event) => {
                    if (!handleCourseSearchBlockedInteraction()) return
                    event.preventDefault()
                  }}
                >
                  <span className="lp-field__icon" aria-hidden="true">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    placeholder="Busque o curso"
                    value={courseSearch}
                    disabled={isCourseSearchDisabled}
                    autoComplete="off"
                    aria-invalid={courseInvalid}
                    aria-describedby={courseInvalid ? 'hero-course-error' : undefined}
                    onFocus={() => {
                      if (courseType) {
                        setIsCourseSearchOpen(true)
                      }
                    }}
                    onBlur={() => {
                      markTouched('course')
                      window.setTimeout(() => {
                        setIsCourseSearchOpen(false)

                        const normalizedSearch = normalizeComparableText(courseSearch)
                        if (!course && normalizedSearch) {
                          const exactMatch = availableCourses.find(
                            (item) => normalizeComparableText(item.label) === normalizedSearch,
                          )
                          if (exactMatch) {
                            setCourse(exactMatch.value)
                            setCourseSearch(exactMatch.label)
                            applyFieldValidation('course', exactMatch.value)
                            return
                          }
                        }

                        applyFieldValidation('course', course)
                      }, 110)
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      setCourseSearch(value)
                      setIsCourseSearchOpen(Boolean(courseType))

                      const normalizedValue = normalizeComparableText(value)
                      const selectedCourseLabel = course ? (courseLookup.get(course) ?? '') : ''

                      if (!normalizedValue) {
                        if (course) {
                          setCourse('')
                        }
                        if (touched.course) {
                          applyFieldValidation('course', '')
                        }
                        return
                      }

                      if (
                        course &&
                        selectedCourseLabel &&
                        normalizeComparableText(selectedCourseLabel) !== normalizedValue
                      ) {
                        setCourse('')
                        if (touched.course) {
                          applyFieldValidation('course', '')
                        }
                      }
                    }}
                  />
                </label>

                {isCourseSearchOpen && courseType ? (
                  <div
                    className="lp-course-search__menu"
                    role="listbox"
                    aria-label="Cursos disponíveis"
                    onScroll={handleCourseSearchMenuScroll}
                  >
                    {visibleCourses.length > 0 ? (
                      visibleCourses.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          className={`lp-course-search__item ${
                            course === item.value ? 'is-active' : ''
                          }`}
                          onMouseDown={(event) => {
                            event.preventDefault()
                          }}
                          onClick={() => {
                            setCourse(item.value)
                            setCourseSearch(item.label)
                            setIsCourseSearchOpen(false)
                            markTouched('course')
                            applyFieldValidation('course', item.value)
                          }}
                        >
                          {item.label}
                        </button>
                      ))
                    ) : (
                      <span className="lp-course-search__empty">Nenhum curso encontrado.</span>
                    )}

                    {canLoadMoreVisibleCourses ? (
                      <span className="lp-course-search__empty lp-course-search__more">
                        Role para carregar mais cursos...
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {courseInvalid ? (
                  <span className="lp-field__error" id="hero-course-error">
                    {fieldErrors.course}
                  </span>
                ) : null}
              </div>
              <button
                type="submit"
                className="lp-main-button lp-hero-form__submit"
                disabled={isStepAnimating}
              >
                CONTINUAR
              </button>
            </div>
            ) : null}

            {step === 2 ? (
              <div className="lp-hero-form__row lp-hero-form__row--wizard lp-hero-form__row--step-2">
                <button
                  type="button"
                  className="lp-hero-form__back"
                  onClick={handleStepBack}
                  disabled={isStepAnimating}
                >
                  <FormBackIcon />
                  Voltar
                </button>

                <div
                  className={`lp-field-wrap lp-hero-form__field-wrap--name ${
                    attentionField === 'fullName' ? 'is-attention' : ''
                  }`}
                >
                  <label className={`lp-field lp-field--plain ${fullNameInvalid ? 'is-invalid' : ''}`}>
                    <input
                      type="text"
                      placeholder="Digite seu nome"
                      value={fullName}
                      autoComplete="name"
                      maxLength={120}
                      aria-invalid={fullNameInvalid}
                      aria-describedby={fullNameInvalid ? 'hero-full-name-error' : undefined}
                      onBlur={() => {
                        markTouched('fullName')
                        applyFieldValidation('fullName', fullName)
                      }}
                      onChange={(event) => {
                        const value = normalizeName(event.target.value)
                        setFullName(value)
                        if (touched.fullName) {
                          applyFieldValidation('fullName', value)
                        }
                      }}
                    />
                  </label>
                  {fullNameInvalid ? (
                    <span className="lp-field__error" id="hero-full-name-error">
                      {fieldErrors.fullName}
                    </span>
                  ) : null}
                </div>

                <div
                  className={`lp-field-wrap lp-hero-form__field-wrap--email ${
                    attentionField === 'email' ? 'is-attention' : ''
                  }`}
                >
                <label className={`lp-field lp-field--plain ${emailInvalid ? 'is-invalid' : ''}`}>
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    autoComplete="email"
                    maxLength={120}
                    aria-invalid={emailInvalid}
                    aria-describedby={emailInvalid ? 'hero-email-error' : undefined}
                    onBlur={() => {
                      markTouched('email')
                      applyFieldValidation('email', email)
                    }}
                    onChange={(event) => {
                      const value = event.target.value
                      setEmail(value)
                      if (touched.email) {
                        applyFieldValidation('email', value)
                      }
                    }}
                  />
                </label>
                {emailInvalid ? (
                  <span className="lp-field__error" id="hero-email-error">
                    {fieldErrors.email}
                  </span>
                ) : null}
              </div>

              <div
                className={`lp-field-wrap lp-hero-form__field-wrap--phone ${
                  attentionField === 'phone' ? 'is-attention' : ''
                }`}
              >
                <label className={`lp-field lp-field--plain ${phoneInvalid ? 'is-invalid' : ''}`}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Telefone"
                    value={phone}
                    autoComplete="tel-national"
                    maxLength={15}
                    aria-invalid={phoneInvalid}
                    aria-describedby={phoneInvalid ? 'hero-phone-error' : undefined}
                    onBlur={() => {
                      markTouched('phone')
                      applyFieldValidation('phone', phone)
                    }}
                    onChange={(event) => {
                      const masked = formatPhoneMask(event.target.value)
                      setPhone(masked)
                      if (touched.phone) {
                        applyFieldValidation('phone', masked)
                      }
                    }}
                  />
                </label>
                {phoneInvalid ? (
                  <span className="lp-field__error" id="hero-phone-error">
                    {fieldErrors.phone}
                  </span>
                ) : null}
              </div>

              <button
                type="submit"
                className="lp-main-button lp-hero-form__submit"
                disabled={submitStatus === 'submitting' || isStepAnimating}
              >
                {submitStatus === 'submitting' ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </div>
            ) : null}
            </div>
          </form>

          {submitMessage ? (
            <small
              className={`lp-hero-form__status ${submitStatus === 'error' ? 'is-error' : ''}`}
            >
              {submitMessage}
            </small>
          ) : null}
        </article>
      </div>
    </section>
  )
}




