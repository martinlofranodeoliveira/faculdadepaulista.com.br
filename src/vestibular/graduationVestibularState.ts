export type GraduationVestibularLead = {
  fullName: string
  email: string
}

const GRADUATION_VESTIBULAR_STORAGE_KEY = 'graduation-vestibular-lead'

export function storeGraduationVestibularLead(lead: GraduationVestibularLead) {
  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(
    GRADUATION_VESTIBULAR_STORAGE_KEY,
    JSON.stringify({
      fullName: lead.fullName.trim(),
      email: lead.email.trim(),
    }),
  )
}

export function readGraduationVestibularLead(): GraduationVestibularLead | null {
  if (typeof window === 'undefined') return null

  const rawValue = window.sessionStorage.getItem(GRADUATION_VESTIBULAR_STORAGE_KEY)
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(rawValue) as Partial<GraduationVestibularLead>
    if (!parsed.fullName || typeof parsed.fullName !== 'string') return null

    return {
      fullName: parsed.fullName,
      email: typeof parsed.email === 'string' ? parsed.email : '',
    }
  } catch {
    return null
  }
}
