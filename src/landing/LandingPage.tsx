import { useEffect, useState } from 'react'

import './landing.css'

import { AllGraduationsCarouselSection } from './components/AllGraduationsCarouselSection'
import { CourseLeadModal } from './components/CourseLeadModal'
import { FaqSection } from './components/FaqSection'
import { FooterSection } from './components/FooterSection'
import { FutureSection } from './components/FutureSection'
import { GraduationCarouselSection } from './components/GraduationCarouselSection'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { PostGraduationBannerSection } from './components/PostGraduationBannerSection'
import { PresentialGraduationSection } from './components/PresentialGraduationSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import {
  COURSE_MODAL_OPEN_EVENT,
  type CoursePrefillDetail,
} from './coursePrefill'

export function LandingPage() {
  const [selectedCourse, setSelectedCourse] = useState<CoursePrefillDetail | null>(null)

  useEffect(() => {
    const listener: EventListener = (event) => {
      const customEvent = event as CustomEvent<CoursePrefillDetail>
      if (!customEvent.detail) return
      setSelectedCourse(customEvent.detail)
    }

    window.addEventListener(COURSE_MODAL_OPEN_EVENT, listener)
    return () => {
      window.removeEventListener(COURSE_MODAL_OPEN_EVENT, listener)
    }
  }, [])

  return (
    <>
      <main className="lp-page">
        <Header />
        <HeroSection />
        <PresentialGraduationSection />
        <PostGraduationBannerSection />
        <GraduationCarouselSection />
        <AllGraduationsCarouselSection />
        <FutureSection />
        <TestimonialsSection />
        <FaqSection />
        <FooterSection />
      </main>

      <CourseLeadModal selection={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </>
  )
}
