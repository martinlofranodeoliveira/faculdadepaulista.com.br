import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import { readStoredUtmParams, syncUtmParamsFromUrl } from '@/lib/utm'

import type { CoursePrefillDetail } from '../coursePrefill'

const CRM_LEAD_ENDPOINT =
  import.meta.env.VITE_CRM_LEAD_ENDPOINT ??
  '/crm-api/administrativo/leads/adicionar'
const CRM_NOT_IDENTIFIED = 'Não identificado'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const NAME_REGEX = /^[\p{L}\s.'-]+$/u

const GRADUATION_CRM_COURSE_IDS: Record<string, number> = {
  'graduacao-administracao': 1,
  'graduacao-analise-desenvolvimento-sistemas': 6,
  'graduacao-gestao-recursos-humanos': 5,
  'graduacao-gestao-tecnologia-informacao': 4,
  'graduacao-pedagogia': 2,
  'graduacao-negocios-imobiliarios': 3,
  'graduacao-logistica': 7,
  'graduacao-processos-gerenciais': 8,
  'graduacao-marketing': 9,
  'graduacao-ciencias-contabeis': 11,
  'graduacao-gestao-comercial': 12,
  'graduacao-seguranca-publica': 15,
  'graduacao-gestao-publica': 14,
  'graduacao-servico-social': 16,
  'graduacao-gestao-financeira': 13,
  'graduacao-psicologia': 0,
  'graduacao-enfermagem': 0,
}

type FieldErrors = {
  fullName?: string
  email?: string
  phone?: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

type CourseLeadModalProps = {
  selection: CoursePrefillDetail | null
  onClose: () => void
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

function getGraduationCourseId(courseValue: string | undefined): number {
  if (!courseValue) return 0
  return GRADUATION_CRM_COURSE_IDS[courseValue] ?? 0
}

export function CourseLeadModal({ selection, onClose }: CourseLeadModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const closeTimer = useRef<number | null>(null)

  const isOpen = Boolean(selection)

  useEffect(() => {
    if (!isOpen) return

    setFullName('')
    setEmail('')
    setPhone('')
    setErrors({})
    setSubmitStatus('idle')
    setSubmitMessage('')
  }, [isOpen, selection?.courseLabel, selection?.courseType, selection?.courseValue])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current)
      }
    }
  }, [])

  const courseLabel = selection?.courseLabel ?? ''

  const firstErrorMessage = useMemo(() => {
    return errors.fullName ?? errors.email ?? errors.phone ?? ''
  }, [errors])

  if (!isOpen || !selection) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FieldErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone),
    }
    setErrors(nextErrors)

    if (nextErrors.fullName || nextErrors.email || nextErrors.phone) {
      setSubmitStatus('error')
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
      const isPostGraduation = selection.courseType === 'pos'
      const empresaId = parseEnvInteger(import.meta.env.VITE_CRM_EMPRESA, 9)
      const etapaGrad = parseEnvInteger(import.meta.env.VITE_CRM_ETAPA_GRAD, 50)
      const funilGrad = parseEnvInteger(import.meta.env.VITE_CRM_FUNIL_GRAD, 5)
      const funilPos = parseEnvInteger(import.meta.env.VITE_CRM_FUNIL_POS, 5)
      const statusLead = parseEnvInteger(import.meta.env.VITE_CRM_STATUS_LEAD, 1)
      const poloId = parseEnvInteger(import.meta.env.VITE_CRM_POLO, 4658)
      const gradCourseId = getGraduationCourseId(selection.courseValue)
      const postCourseId = selection.courseId ?? 0

      const payload = {
        aluno: 0,
        nome: fullName.trim(),
        email: email.trim(),
        telefone: phoneDigits,
        empresa: empresaId,
        matricula: '',
        idCurso: isPostGraduation ? postCourseId : gradCourseId,
        curso: courseLabel,
        etapa: isPostGraduation ? 50 : etapaGrad,
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

      closeTimer.current = window.setTimeout(() => {
        onClose()
      }, 900)
    } catch (error) {
      console.error('Erro ao enviar lead para o CRM:', error)
      setSubmitStatus('error')
      setSubmitMessage('Não foi possível enviar agora. Tente novamente em instantes.')
    }
  }

  return (
    <div
      className="lp-course-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lp-course-modal-title"
      onMouseDown={onClose}
    >
      <article className="lp-course-modal__panel" onMouseDown={(event) => event.stopPropagation()}>
        <header className="lp-course-modal__header">
          <img src="/landing/bgmodal.webp" alt="" aria-hidden="true" />
        </header>

        <div className="lp-course-modal__body">
          <div className="lp-course-modal__head">
            <h3 id="lp-course-modal-title">Curso: {courseLabel}</h3>
            <p>Preencha o formulário para receber mais informações</p>
          </div>

          <form className="lp-course-modal__form" onSubmit={handleSubmit} noValidate>
            <label className={`lp-course-modal__field ${errors.fullName ? 'is-invalid' : ''}`}>
              <input
                type="text"
                placeholder="Nome"
                autoComplete="name"
                maxLength={120}
                value={fullName}
                onChange={(event) => setFullName(normalizeName(event.target.value))}
              />
            </label>

            <label className={`lp-course-modal__field ${errors.email ? 'is-invalid' : ''}`}>
              <input
                type="email"
                placeholder="Seu melhor email"
                autoComplete="email"
                maxLength={120}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className={`lp-course-modal__field ${errors.phone ? 'is-invalid' : ''}`}>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Telefone"
                autoComplete="tel-national"
                maxLength={15}
                value={phone}
                onChange={(event) => setPhone(formatPhoneMask(event.target.value))}
              />
            </label>

            <div className="lp-course-modal__actions">
              <button type="submit" disabled={submitStatus === 'submitting'}>
                {submitStatus === 'submitting' ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </div>
          </form>

          {submitStatus === 'error' && firstErrorMessage ? (
            <small className="lp-course-modal__status is-error">{firstErrorMessage}</small>
          ) : null}
          {submitMessage && (submitStatus !== 'error' || !firstErrorMessage) ? (
            <small className={`lp-course-modal__status ${submitStatus === 'error' ? 'is-error' : ''}`}>
              {submitMessage}
            </small>
          ) : null}
        </div>
      </article>
    </div>
  )
}

