import './landing.css'

import { AppShowcaseSection } from './components/AppShowcaseSection'
import { CourseSection } from './components/CourseSection'
import { FaqSection } from './components/FaqSection'
import { FooterSection } from './components/FooterSection'
import { FutureSection } from './components/FutureSection'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { JourneySection } from './components/JourneySection'
import { MobileCta } from './components/MobileCta'
import { TestimonialsSection } from './components/TestimonialsSection'
import { WhyChooseSection } from './components/WhyChooseSection'
import { graduationCourses, postCourses } from './data'

export function LandingPage() {
  return (
    <main className="lp-page">
      <Header />
      <HeroSection />
      <CourseSection
        id="graduacao"
        title="Graduação"
        description="Explore nossos cursos e encontre o caminho ideal para sua carreira."
        items={graduationCourses}
      />
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
