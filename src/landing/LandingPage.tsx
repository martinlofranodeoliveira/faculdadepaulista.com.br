import './landing.css'

import { AllGraduationsCarouselSection } from './components/AllGraduationsCarouselSection'
import { FaqSection } from './components/FaqSection'
import { FooterSection } from './components/FooterSection'
import { FutureSection } from './components/FutureSection'
import { GraduationCarouselSection } from './components/GraduationCarouselSection'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { PostGraduationBannerSection } from './components/PostGraduationBannerSection'
import { PresentialGraduationSection } from './components/PresentialGraduationSection'
import { TestimonialsSection } from './components/TestimonialsSection'

export function LandingPage() {
  return (
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
  )
}
