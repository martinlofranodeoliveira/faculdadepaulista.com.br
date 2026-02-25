export type CoursePrefillDetail = {
  courseType: 'graduacao' | 'pos'
  courseValue?: string
  courseLabel: string
}

export const COURSE_PREFILL_EVENT = 'lp:course-prefill'

export function emitCoursePrefill(detail: CoursePrefillDetail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<CoursePrefillDetail>(COURSE_PREFILL_EVENT, { detail }))
}

export function prefillCourseAndGoToForm(detail: CoursePrefillDetail, formId = 'inscricao') {
  emitCoursePrefill(detail)

  if (typeof document === 'undefined') return

  const formElement = document.getElementById(formId)
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
