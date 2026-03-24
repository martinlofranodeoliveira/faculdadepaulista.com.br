import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, ChevronDown, ChevronLeft, LoaderCircle } from 'lucide-react'

import { readStoredUtmParams, syncUtmParamsFromUrl } from '@/lib/utm'

import {
  clearCourseLeadDraft,
  matchesCourseLeadDraft,
  readCourseLeadDraft,
} from './courseLeadDraft'
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

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

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
  const hasSecondStep = courseType === 'pos'
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
  const [resumeAvailable, setResumeAvailable] = useState(false)
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const cpfInputRef = useRef<HTMLInputElement | null>(null)

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

  useEffect(() => {
    const draft = readCourseLeadDraft()
    const matchesCurrentCourse =
      draft &&
      matchesCourseLeadDraft(draft, {
        courseType,
        courseValue,
        courseLabel,
      })

    setResumeAvailable(Boolean(matchesCurrentCourse))

    if (!matchesCurrentCourse) return

    setFullName(draft.fullName)
    setEmail(draft.email)
    setPhone(draft.phone)
    setAgreementAccepted(true)

    if (hasSecondStep) {
      setStep(2)
      window.setTimeout(() => {
        cpfInputRef.current?.focus()
      }, 80)
      return
    }

    if (leadSubmitted) {
      nameInputRef.current?.focus()
    }
  }, [courseLabel, courseType, courseValue, hasSecondStep, leadSubmitted])

  useEffect(() => {
    if (!hasSecondStep) return

    setPaymentPlan((current) =>
      visiblePaymentPlanOptions.includes(current) ? current : (visiblePaymentPlanOptions[0] ?? ''),
    )
  }, [hasSecondStep, visiblePaymentPlanOptions])

  const handleRestoreProgress = () => {
    const draft = readCourseLeadDraft()
    if (
      !draft ||
      !matchesCourseLeadDraft(draft, {
        courseType,
        courseValue,
        courseLabel,
      })
    ) {
      nameInputRef.current?.focus()
      return
    }

    setFullName(draft.fullName)
    setEmail(draft.email)
    setPhone(draft.phone)
    setAgreementAccepted(true)
    setResumeAvailable(true)

    if (hasSecondStep) {
      setStep(2)
      window.setTimeout(() => {
        cpfInputRef.current?.focus()
      }, 80)
    } else {
      nameInputRef.current?.focus()
    }
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

  const goToSecondStep = () => {
    const nextErrors = validateFirstStep()
    setErrors(nextErrors)

    if (nextErrors.fullName || nextErrors.email || nextErrors.phone || nextErrors.agreement) {
      return
    }

    setAdvanceLoading(true)

    window.setTimeout(() => {
      setAdvanceLoading(false)
      setStep(2)
      setPaymentPlan((current) => current || visiblePaymentPlanOptions[0] || '')
      setWorkload((current) => current || workloadOptions[0] || '')
      window.setTimeout(() => {
        cpfInputRef.current?.focus()
      }, 20)
    }, 220)
  }

  const handleBack = () => {
    setErrors({})
    setStep(1)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (hasSecondStep && step === 1) {
      goToSecondStep()
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
            ? `PÓS-GRADUAÇÃO: Página do curso Faculdade Paulista | Plano: ${paymentPlan || 'não informado'} | Carga horÃ¡ria: ${workload || 'não informada'} | Voucher: ${voucherCode.trim() || 'não informado'}`
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

      clearCourseLeadDraft()
      setResumeAvailable(false)

      if (courseType === 'pos') {
        storePostThankYouLead({
          fullName: fullName.trim(),
          email: email.trim(),
        })
        setSubmitStatus('success')
        setSubmitMessage('Inscrição enviada com sucesso. Redirecionando...')
        window.setTimeout(() => {
          window.location.assign('/pos-graduacao/inscricao-finalizada')
        }, 80)
        return
      }

      storeGraduationVestibularLead({
        fullName: fullName.trim(),
        email: email.trim(),
      })
      setSubmitStatus('success')
      setSubmitMessage('Inscrição enviada com sucesso. Redirecionando...')
      window.setTimeout(() => {
        window.location.assign('/graduacao/vestibular')
      }, 80)
    } catch (error) {
      console.error('Erro ao enviar lead da página de curso:', error)
      setSubmitStatus('error')
      setSubmitMessage('Não foi possível enviar agora. Tente novamente em instantes.')
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
        Já iniciou sua inscrição?{' '}
        <button type="button" onClick={handleRestoreProgress}>
          Clique aqui para continuar
        </button>
      </p>

      {resumeAvailable && hasSecondStep && step === 1 ? (
        <p className="course-lead-form__draft-note">
          Encontramos um progresso anterior para este curso e podemos retomar da etapa seguinte.
        </p>
      ) : null}

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
                    <span>Saiba mais sobre o Estágio e a Prática Obrigatória</span>
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
                Ao continuar você concorda com nossos{' '}
                <a href="/termos-de-uso" target="_blank" rel="noreferrer">
                  Termos de uso
                </a>{' '}
                e{' '}
                <a href="/politica-de-privacidade" target="_blank" rel="noreferrer">
                  Políticas de Privacidade
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

            {showInternshipInfoLink ? (
              <a
                className="course-lead-form__info-link"
                href="/politica-de-privacidade"
                target="_blank"
                rel="noreferrer"
              >
                <AlertCircle size={18} strokeWidth={2} />
                <span>Saiba mais sobre o Estágio e a Prática Obrigatória</span>
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


