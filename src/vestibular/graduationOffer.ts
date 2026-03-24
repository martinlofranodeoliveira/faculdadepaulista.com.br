import type { CatalogCourse, CatalogPriceItem } from '@/lib/catalogApi'

export type GraduationOfferRow = {
  dueDate: string
  installment: string
  value: string
}

export type GraduationOfferData = {
  courseId: number
  currentInstallmentValue: string
  installmentsMax: number
  rows: GraduationOfferRow[]
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatCurrencyFromCents(value: number): string {
  return CURRENCY_FORMATTER.format(value / 100)
}

function parseCurrencyTextToCents(value: string | undefined): number {
  const normalized = value?.trim() ?? ''
  if (!normalized) return 0

  const match = normalized.match(/R\$\s*([\d.]+,\d{2})/i)
  if (!match) return 0

  const numeric = Number.parseFloat(match[1].replace(/\./g, '').replace(',', '.'))
  if (!Number.isFinite(numeric) || numeric <= 0) return 0

  return Math.round(numeric * 100)
}

function getSelectedPriceItem(course: CatalogCourse | null): CatalogPriceItem | null {
  if (!course?.priceItems.length) return null
  return course.priceItems[0] ?? null
}

function buildBaseDate(validFrom: string): Date | null {
  if (!validFrom) return null

  const parsed = new Date(`${validFrom}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatDueDate(baseDate: Date | null, offsetMonths: number): string {
  if (!baseDate) return 'Consulte a oferta'

  const nextDate = new Date(baseDate)
  nextDate.setMonth(nextDate.getMonth() + offsetMonths)

  return nextDate.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  })
}

function getInstallmentLabel(index: number): string {
  return `${index + 1}ª Mensalidade`
}

export function buildGraduationOfferData(course: CatalogCourse | null): GraduationOfferData | null {
  if (!course?.courseId) return null

  const selectedPriceItem = getSelectedPriceItem(course)
  const installmentValueCents =
    selectedPriceItem?.amountCents ||
    parseCurrencyTextToCents(course.currentInstallmentPriceMonthly) ||
    parseCurrencyTextToCents(course.currentInstallmentPrice)

  const installmentsMax = Math.max(1, Math.min(selectedPriceItem?.installmentsMax || 18, 24))
  const currentInstallmentValue = installmentValueCents
    ? formatCurrencyFromCents(installmentValueCents)
    : course.currentInstallmentPriceMonthly.replace(/\/.*/u, '').trim()
  const baseDate = buildBaseDate(selectedPriceItem?.validFrom ?? '')

  return {
    courseId: course.courseId,
    currentInstallmentValue,
    installmentsMax,
    rows: Array.from({ length: installmentsMax }, (_, index) => ({
      installment: getInstallmentLabel(index),
      value: currentInstallmentValue,
      dueDate: formatDueDate(baseDate, index),
    })),
  }
}
