import { saveCourseLeadDraft } from '@/course/courseLeadDraft'
import { getCoursePath } from '@/lib/courseRoutes'
import { storeGraduationThankYouLead } from '@/thankyou/graduationThankYouState'

export type CoursePrefillDetail = {
  courseType: 'graduacao' | 'pos'
  courseModality?: 'ead' | 'semipresencial' | 'presencial'
  courseValue?: string
  courseLabel: string
  courseId?: number
  redirectPath?: string
}

export type StoredLandingLeadSession = {
  fullName: string
  email: string
  phone: string
  createdAt: number
}

export const COURSE_PREFILL_EVENT = 'lp:course-prefill'
export const COURSE_MODAL_OPEN_EVENT = 'lp:course-modal-open'
const LANDING_LEAD_SESSION_KEY = 'fp:landing-modal-lead'
const LANDING_LEAD_SESSION_TTL_MS = 1000 * 60 * 60 * 6

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function saveLandingLeadSession(
  lead: Omit<StoredLandingLeadSession, 'createdAt'>,
): void {
  if (!isBrowser()) return

  window.sessionStorage.setItem(
    LANDING_LEAD_SESSION_KEY,
    JSON.stringify({
      ...lead,
      createdAt: Date.now(),
    } satisfies StoredLandingLeadSession),
  )
}

export function readLandingLeadSession(): StoredLandingLeadSession | null {
  if (!isBrowser()) return null

  const raw = window.sessionStorage.getItem(LANDING_LEAD_SESSION_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as StoredLandingLeadSession
    if (!parsed.createdAt || Date.now() - parsed.createdAt > LANDING_LEAD_SESSION_TTL_MS) {
      window.sessionStorage.removeItem(LANDING_LEAD_SESSION_KEY)
      return null
    }

    return parsed
  } catch {
    window.sessionStorage.removeItem(LANDING_LEAD_SESSION_KEY)
    return null
  }
}

export function emitCoursePrefill(detail: CoursePrefillDetail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<CoursePrefillDetail>(COURSE_PREFILL_EVENT, { detail }))
}

export function openCourseLeadModal(detail: CoursePrefillDetail) {
  if (typeof window === 'undefined') return

  const storedLead = readLandingLeadSession()
  if (storedLead) {
    saveCourseLeadDraft({
      courseType: detail.courseType,
      courseValue: detail.courseValue,
      courseLabel: detail.courseLabel,
      courseId: detail.courseId,
      fullName: storedLead.fullName,
      email: storedLead.email,
      phone: storedLead.phone,
    })

    const redirectPath =
      detail.redirectPath ??
      getCoursePath(
        {
          courseType: detail.courseType,
          courseValue: detail.courseValue,
          courseLabel: detail.courseLabel,
        },
        { leadSubmitted: true },
      )

    if (redirectPath === '/graduacao/inscricao-finalizada') {
      storeGraduationThankYouLead({
        fullName: storedLead.fullName,
        email: storedLead.email,
      })
    }

    window.location.assign(redirectPath)
    return
  }

  window.dispatchEvent(new CustomEvent<CoursePrefillDetail>(COURSE_MODAL_OPEN_EVENT, { detail }))
}

export function prefillCourseAndGoToForm(detail: CoursePrefillDetail, formId = 'inscricao') {
  emitCoursePrefill(detail)

  if (typeof document === 'undefined') return

  const formElement = document.getElementById(formId)
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
