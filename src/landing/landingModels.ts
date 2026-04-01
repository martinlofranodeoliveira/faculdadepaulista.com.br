export type LandingCourseOption = {
  value: string
  label: string
  courseId: number
}

export type LandingGraduationCourseCard = {
  courseValue: string
  courseLabel: string
  courseId: number
  modality: 'ead' | 'semipresencial' | 'presencial'
  title: string
  image: string
  imagePosition?: string
  modalityLabel: string
  semesterCount: number
  installmentPrice: string
  oldInstallmentPrice: string
  fixedInstallments: boolean
}

export type LandingPresentialCourse = {
  id: string
  courseValue: string
  courseLabel: string
  courseId: number
  courseModality?: 'ead' | 'semipresencial' | 'presencial'
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
  semesterCount: number
  fixedInstallments: boolean
}

export type LandingPostCourse = {
  courseValue: string
  courseLabel: string
  courseId: number
  courseModality?: 'ead' | 'semipresencial' | 'presencial'
  title: string
  area: string
  image: string
  currentInstallmentPrice: string
  oldInstallmentPrice: string
}

export type LandingPostArea = {
  areaId: number
  label: string
  courses: LandingPostCourse[]
}

export type LandingPageData = {
  graduationOptions: LandingCourseOption[]
  postOptions: LandingCourseOption[]
  onlineGraduationCourses: LandingGraduationCourseCard[]
  presentialCourses: LandingPresentialCourse[]
  postCourses: LandingPostCourse[]
  postAreas: LandingPostArea[]
}
