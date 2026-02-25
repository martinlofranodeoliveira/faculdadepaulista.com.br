import './landing.css'

import { AllGraduationsCarouselSection } from './components/AllGraduationsCarouselSection'
import { AppShowcaseSection } from './components/AppShowcaseSection'
import { FaqSection } from './components/FaqSection'
import { FooterSection } from './components/FooterSection'
import { FutureSection } from './components/FutureSection'
import { GraduationCarouselSection } from './components/GraduationCarouselSection'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { JourneySection } from './components/JourneySection'
import { PostGraduationBannerSection } from './components/PostGraduationBannerSection'
import { PresentialGraduationSection } from './components/PresentialGraduationSection'
import { TestimonialsSection } from './components/TestimonialsSection'
import { WhyChooseSection } from './components/WhyChooseSection'

export function LandingPage() {
  return (
    <main className="lp-page">
      <Header />
      <HeroSection />
      <PresentialGraduationSection />
      <PostGraduationBannerSection />
      <GraduationCarouselSection />
      <AllGraduationsCarouselSection />
      <WhyChooseSection />
      <JourneySection />
      <AppShowcaseSection />
      <FutureSection />
      <TestimonialsSection />
      <FaqSection />
      <FooterSection />
    </main>
  )
}
