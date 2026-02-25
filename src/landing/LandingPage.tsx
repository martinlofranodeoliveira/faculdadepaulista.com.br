import './landing.css'

import { AppShowcaseSection } from './components/AppShowcaseSection'
import { CourseSection } from './components/CourseSection'
import { FaqSection } from './components/FaqSection'
import { FooterSection } from './components/FooterSection'
import { FutureSection } from './components/FutureSection'
import { GraduationCarouselSection } from './components/GraduationCarouselSection'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { JourneySection } from './components/JourneySection'
import { MobileCta } from './components/MobileCta'
import { PresentialGraduationSection } from './components/PresentialGraduationSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { WhyChooseSection } from './components/WhyChooseSection'
import { postCourses } from './data'

export function LandingPage() {
  return (
    <main className="lp-page">
      <Header />
      <HeroSection />
      <PresentialGraduationSection />
      <GraduationCarouselSection />
      <WhyChooseSection />
      <JourneySection />
      <AppShowcaseSection />
      <FutureSection />
      <TestimonialsSection />
      <CourseSection
        id="pos-graduacao"
        title="Pós-graduação EAD"
        description="Explore nossos cursos e encontre o caminho ideal para sua carreira."
        dark
        items={postCourses}
      />
      <FaqSection />
      <FooterSection />
      <MobileCta />
    </main>
  )
}
