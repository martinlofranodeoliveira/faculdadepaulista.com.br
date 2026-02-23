import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  GraduationCap,
  Mail,
  Phone,
  User,
} from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { readStoredUtmParams, syncUtmParamsFromUrl } from '@/lib/utm'

import { formCourseGroups, heroFeatures } from '../data'

const CRM_LEAD_ENDPOINT =
  import.meta.env.VITE_CRM_LEAD_ENDPOINT ??
  (import.meta.env.DEV
    ? '/crm-api/administrativo/leads/adicionar'
    : 'https://crmfasul.com.br/api/administrativo/leads/adicionar')
const CRM_NOT_IDENTIFIED = 'Não identificado'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const NAME_REGEX = /^[\p{L}\s.'-]+$/u

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type FieldName = 'fullName' | 'email' | 'phone' | 'course'
type FieldErrors = Partial<Record<FieldName, string>>
type Touched = Record<FieldName, boolean>

const EMPTY_TOUCHED: Touched = {
  fullName: false,
  email: false,
  phone: false,
  course: false,
}

function MetroTrainIcon() {
  return (
    <svg
      viewBox="475 111 170 170"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroMetroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4B4B" />
          <stop offset="100%" stopColor="#CC1D1D" />
        </linearGradient>
      </defs>

      <g id="metro-icon">
        <path
          d="M 510 240 L 510 150 Q 510 120 560 120 Q 610 120 610 150 L 610 240 Z"
          fill="url(#heroMetroGrad)"
        />
        <path d="M 510 240 L 610 240 L 605 255 L 515 255 Z" fill="#2C3E50" />
        <path
          d="M 520 185 L 520 145 Q 520 130 560 130 Q 600 130 600 145 L 600 185 Z"
          fill="#1A252F"
        />
        <path
          d="M 520 145 Q 520 130 560 130 L 545 185 L 520 185 Z"
          fill="#FFFFFF"
          opacity="0.15"
        />

        <rect x="522" y="215" width="25" height="10" rx="5" fill="#FFFFFF" />
        <rect x="573" y="215" width="25" height="10" rx="5" fill="#FFFFFF" />
        <rect x="524" y="217" width="21" height="6" rx="3" fill="#FFF2CC" />
        <rect x="575" y="217" width="21" height="6" rx="3" fill="#FFF2CC" />

        <circle cx="560" cy="202" r="12" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
        <text
          x="560"
          y="207"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="14"
          fill="#FFFFFF"
          textAnchor="middle"
          opacity="0.9"
        >
          M
        </text>

        <path
          d="M 500 260 L 620 260"
          stroke="#94A3B8"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M 525 260 L 515 272 M 550 260 L 540 272 M 575 260 L 565 272 M 600 260 L 590 272"
          stroke="#94A3B8"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

function HeroMecIcon() {
  return (
    <svg
      viewBox="0 0 170 170"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroMecGoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="heroMecGoldInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="heroMecGoldCore" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="40%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>

        <linearGradient id="heroMecRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>

        <filter id="heroMecShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.15"
          />
        </filter>

        <path
          id="heroMecStar"
          d="M0 -5 L 1.5 -1.5 L 5.5 -1.5 L 2.3 1.1 L 3.5 5 L 0 2.8 L -3.5 5 L -2.3 1.1 L -5.5 -1.5 L -1.5 -1.5 Z"
        />
      </defs>

      <g filter="url(#heroMecShadow)">
        <path d="M 65 90 L 25 160 L 50 148 L 75 165 L 85 90 Z" fill="url(#heroMecRibbonGrad)" />
        <path d="M 65 90 L 50 148 L 75 165 L 85 90 Z" fill="#064E3B" opacity="0.3" />

        <path d="M 105 90 L 145 160 L 120 148 L 95 165 L 85 90 Z" fill="url(#heroMecRibbonGrad)" />
        <path d="M 105 90 L 120 148 L 95 165 L 85 90 Z" fill="#064E3B" opacity="0.3" />

        <circle cx="85" cy="75" r="55" fill="url(#heroMecGoldOuter)" />
        <circle cx="85" cy="75" r="49" fill="url(#heroMecGoldInner)" />
        <circle cx="85" cy="75" r="43" fill="url(#heroMecGoldCore)" />
        <circle
          cx="85"
          cy="75"
          r="46"
          fill="none"
          stroke="#16A34A"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.8"
        />

        <text
          x="85"
          y="52"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="16"
          fill="#1E3A8A"
          textAnchor="middle"
          letterSpacing="1"
        >
          MEC
        </text>
        <text
          x="85"
          y="94"
          fontFamily="system-ui, sans-serif"
          fontWeight="900"
          fontSize="52"
          fill="#1E3A8A"
          textAnchor="middle"
        >
          5
        </text>

        <g fill="#1E3A8A">
          <g transform="translate(56, 103) rotate(-20)">
            <use href="#heroMecStar" />
          </g>
          <g transform="translate(70, 108) rotate(-10)">
            <use href="#heroMecStar" />
          </g>
          <g transform="translate(85, 110)">
            <use href="#heroMecStar" />
          </g>
          <g transform="translate(100, 108) rotate(10)">
            <use href="#heroMecStar" />
          </g>
          <g transform="translate(114, 103) rotate(20)">
            <use href="#heroMecStar" />
          </g>
        </g>

        <path
          d="M 42 75 A 43 43 0 0 1 128 75 A 50 50 0 0 0 42 75 Z"
          fill="#FFFFFF"
          opacity="0.25"
        />
      </g>
    </svg>
  )
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

function validateCourse(value: string): string | undefined {
  if (!value) return 'Selecione um curso.'
  return undefined
}

function validateField(field: FieldName, value: string): string | undefined {
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

export function HeroSection() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [course, setCourse] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Touched>(EMPTY_TOUCHED)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    syncUtmParamsFromUrl(window.location.search)
  }, [])

  const courseLookup = useMemo(() => {
    const map = new Map<string, string>()
    formCourseGroups.forEach((group) => {
      group.options.forEach((item) => {
        map.set(item.value, item.label)
      })
    })
    return map
  }, [])

  const applyFieldValidation = (field: FieldName, value: string) => {
    const error = validateField(field, value)
    setFieldErrors((previous) => ({ ...previous, [field]: error }))
  }

  const markTouched = (field: FieldName) => {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  const validateAllFields = (): FieldErrors => {
    return {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone),
      course: validateCourse(course),
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateAllFields()
    setFieldErrors(errors)
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      course: true,
    })

    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) {
      setSubmitStatus('error')
      setSubmitMessage('Corrija os campos destacados para continuar.')
      return
    }

    setSubmitStatus('submitting')
    setSubmitMessage('Enviando seus dados...')

    try {
      const trackedFromUrl = syncUtmParamsFromUrl(window.location.search)
      const storedTrackingParams = readStoredUtmParams()
      const trackingParams = { ...storedTrackingParams, ...trackedFromUrl }
      const phoneDigits = normalizePhone(phone)
      const courseLabel = courseLookup.get(course) ?? course
      const isPostGraduation = isPostGraduationCourse(course)

      const payload = {
        aluno: '',
        nome: fullName.trim(),
        email: email.trim(),
        telefone: phoneDigits,
        empresa: import.meta.env.VITE_CRM_EMPRESA ?? 'Faculdade Paulista',
        matricula: '',
        idCurso: course,
        curso: courseLabel,
        etapa: isPostGraduation
          ? import.meta.env.VITE_CRM_ETAPA_POS ?? 'INSCRITO_POS'
          : import.meta.env.VITE_CRM_ETAPA_GRAD ?? 'INSCRITO_GRAD',
        cpf: '',
        valor: '',
        funil: isPostGraduation
          ? import.meta.env.VITE_CRM_FUNIL_POS ?? 'POSGRADUACAO'
          : import.meta.env.VITE_CRM_FUNIL_GRAD ?? 'GRADUACAO',
        status: import.meta.env.VITE_CRM_STATUS_LEAD ?? 'LEAD',
        observacao: isPostGraduation ? 'inscrição Pós-Graduação' : 'Inscrição Vestibular',
        campanha: pickTrackingValue(trackingParams, ['campanha', 'utm_campaign']),
        midia: pickTrackingValue(trackingParams, ['midia', 'utm_medium']),
        fonte: pickTrackingValue(
          trackingParams,
          ['id_fonte_crm', 'fonte', 'utm_source'],
          import.meta.env.VITE_CRM_FONTE_ID ?? CRM_NOT_IDENTIFIED,
        ),
        fonteTexto: import.meta.env.VITE_CRM_FONTE_TEXTO ?? 'Faculdade Paulista',
        origem: pickTrackingValue(
          trackingParams,
          ['origem'],
          import.meta.env.VITE_CRM_ORIGEM ?? '0',
        ),
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
        polo: import.meta.env.VITE_CRM_POLO ?? '',
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
      setSubmitMessage('Cadastro enviado com sucesso. Em breve entraremos em contato.')
      setFullName('')
      setEmail('')
      setPhone('')
      setCourse('')
      setFieldErrors({})
      setTouched(EMPTY_TOUCHED)
    } catch (error) {
      console.error('Erro ao enviar lead para o CRM:', error)
      setSubmitStatus('error')
      setSubmitMessage('Não foi possível enviar agora. Tente novamente em instantes.')
    }
  }

  const fullNameInvalid = Boolean(touched.fullName && fieldErrors.fullName)
  const emailInvalid = Boolean(touched.email && fieldErrors.email)
  const phoneInvalid = Boolean(touched.phone && fieldErrors.phone)
  const courseInvalid = Boolean(touched.course && fieldErrors.course)

  return (
    <section className="lp-hero" id="inicio">
      <div className="lp-shell lp-hero__grid">
        <article className="lp-hero__content">
          <p className="lp-pill">
            <span className="lp-pill__dot" />
            MATRICULAS ABERTAS 2026
          </p>

          <h1>
            FACA SUA MATRICULA E
            <span> GANHE +3 POS-GRADUACOES</span>
            <br />
            INCLUIDAS NA SUA JORNADA
          </h1>

          <p className="lp-hero__description">
            Os melhores cursos de Graduacao e Pos-graduacao com Nota Maxima no MEC (5)
            pra voce estudar onde e quando quiser com Suporte e Tutores Especialistas
            para guiar seu aprendizado.
          </p>

          <div className="lp-hero__features">
            {heroFeatures.map((item, index) => (
              <div key={item.title} className="lp-hero__feature">
                <span className="lp-hero__feature-icon">
                  {index === 0 ? <MetroTrainIcon /> : <HeroMecIcon />}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="lp-hero-form" id="inscricao">
          <div className="lp-hero-form__line" />
          <h2>FACA SEU CADASTRO PARA GARANTIR A CONDICAO ESPECIAL</h2>
          <p>
            Preencha seus dados abaixo e aguarde uma de nossas Consultoras Especialistas
            entrar em contato.
          </p>

          <form className="lp-hero-form__fields" onSubmit={handleSubmit} noValidate>
            <div className="lp-field-wrap">
              <label className={`lp-field ${fullNameInvalid ? 'is-invalid' : ''}`}>
                <span className="lp-field__icon" aria-hidden="true">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Nome Completo"
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

            <div className="lp-field-wrap">
              <label className={`lp-field ${emailInvalid ? 'is-invalid' : ''}`}>
                <span className="lp-field__icon" aria-hidden="true">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
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

            <div className="lp-field-wrap">
              <label className={`lp-field ${phoneInvalid ? 'is-invalid' : ''}`}>
                <span className="lp-field__icon" aria-hidden="true">
                  <Phone size={14} />
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="(11) 99999-9999"
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

            <div className="lp-field-wrap">
              <div className={`lp-field lp-field--select ${courseInvalid ? 'is-invalid' : ''}`}>
                <span className="lp-field__icon" aria-hidden="true">
                  <GraduationCap size={14} />
                </span>
                <div className="lp-select-wrapper">
                  <Select
                    value={course}
                    onValueChange={(value) => {
                      setCourse(value)
                      if (touched.course) {
                        applyFieldValidation('course', value)
                      }
                    }}
                  >
                    <SelectTrigger
                      className="lp-select-trigger"
                      aria-label="Selecione seu curso"
                      aria-invalid={courseInvalid}
                      aria-describedby={courseInvalid ? 'hero-course-error' : undefined}
                      onBlur={() => {
                        markTouched('course')
                        applyFieldValidation('course', course)
                      }}
                    >
                      <SelectValue placeholder="Selecione seu curso" />
                    </SelectTrigger>
                    <SelectContent className="lp-select-content" position="popper" sideOffset={6}>
                      {formCourseGroups.map((group) => (
                        <SelectGroup key={group.label}>
                          <SelectLabel>{group.label}</SelectLabel>
                          {group.options.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {courseInvalid ? (
                <span className="lp-field__error" id="hero-course-error">
                  {fieldErrors.course}
                </span>
              ) : null}
            </div>

            <button
              type="submit"
              className="lp-main-button lp-hero-form__submit"
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'submitting' ? 'ENVIANDO...' : 'INSCREVA-SE AGORA'}
              <ArrowRight size={14} />
            </button>
          </form>

          {submitMessage ? (
            <small
              className={`lp-hero-form__status ${submitStatus === 'error' ? 'is-error' : ''}`}
            >
              {submitMessage}
            </small>
          ) : null}

          <small>Ao se inscrever, voce concorda com nossa Politica de Privacidade.</small>
        </article>
      </div>
    </section>
  )
}

