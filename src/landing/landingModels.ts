export type LandingCourseOption = {
  value: string
  label: string
  courseId: number
}

export type LandingGraduationCourseCard = {
  courseValue: string
  courseLabel: string
  courseId: number
  title: string
  image: string
  imagePosition?: string
  modalityLabel: string
  installmentPrice: string
  oldInstallmentPrice: string
  fixedInstallments: boolean
}

export type LandingPresentialCourse = {
  id: string
  courseValue: string
  courseLabel: string
  courseId: number
  title: string
  mode: string
  image: string
  imageAlt: string
  imageWidth?: number
  imageHeight?: number
  cardClassName?: string
  imageClassName?: string
  imagePosition?: string
  startDate: string
  currentPrice: string
  originalPriceLabel: string
}

export type LandingPostCourse = {
  courseValue: string
  courseLabel: string
  courseId: number
  title: string
  area: string
  currentInstallmentPrice: string
  oldInstallmentPrice: string
}

export type LandingPageData = {
  graduationOptions: LandingCourseOption[]
  postOptions: LandingCourseOption[]
  onlineGraduationCourses: LandingGraduationCourseCard[]
  presentialCourses: LandingPresentialCourse[]
  postCourses: LandingPostCourse[]
}
