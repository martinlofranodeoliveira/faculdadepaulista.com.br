import { useEffect, useState } from 'react'

import { GraduationAdmissionSection } from './components/GraduationAdmissionSection'
import { GraduationEnrollmentOfferStep } from './components/GraduationEnrollmentOfferStep'
import { GraduationEssayWritingStep } from './components/GraduationEssayWritingStep'
import { GraduationEssayThemeStep, type EssayThemeId } from './components/GraduationEssayThemeStep'
import { GraduationSimplifiedStep } from './components/GraduationSimplifiedStep'
import { GraduationVestibularHero } from './components/GraduationVestibularHero'
import { VestibularHeader } from './components/VestibularHeader'
import { readGraduationVestibularLead } from './graduationVestibularState'

import './vestibular.css'

export type AdmissionOptionId =
  | 'simplificada'
  | 'redacao'
  | 'transferencia'
  | 'segunda-graduacao'
  | 'enem'

type Identity = {
  firstName: string
  email: string
}

type VestibularStep =
  | 'selection'
  | 'simplified'
  | 'essay-theme'
  | 'essay-writing'
  | 'enrollment-offer'

const defaultIdentity: Identity = {
  firstName: 'Aluno',
  email: '',
}

function getFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/)
  return firstName || 'Aluno'
}

export function GraduationVestibularPage() {
  const [identity, setIdentity] = useState<Identity>(defaultIdentity)
  const [step, setStep] = useState<VestibularStep>('selection')
  const [selectedOptionId, setSelectedOptionId] = useState<AdmissionOptionId>('simplificada')
  const [selectedEssayThemeId, setSelectedEssayThemeId] = useState<EssayThemeId>('tema-a')
  const [enemRegistration, setEnemRegistration] = useState('')

  useEffect(() => {
    const storedLead = readGraduationVestibularLead()
    if (!storedLead) return

    setIdentity({
      firstName: getFirstName(storedLead.fullName),
      email: storedLead.email,
    })
  }, [])

  function handleSelectOption(optionId: AdmissionOptionId) {
    setSelectedOptionId(optionId)

    if (optionId === 'simplificada') {
      setStep('simplified')
      return
    }

    if (optionId === 'redacao') {
      setStep('essay-theme')
      return
    }

    if (optionId === 'transferencia' || optionId === 'segunda-graduacao') {
      setStep('enrollment-offer')
    }
  }

  function handleContinueEnem() {
    if (!enemRegistration.trim()) {
      return
    }

    setSelectedOptionId('enem')
    setStep('enrollment-offer')
  }

  return (
    <main className="vestibular-page vestibular-page--graduation">
      <VestibularHeader firstName={identity.firstName} email={identity.email} />
      <div className="vestibular-page__body">
        {step === 'selection' ? (
          <>
            <GraduationVestibularHero />
            <GraduationAdmissionSection
              enemRegistration={enemRegistration}
              selectedOptionId={selectedOptionId}
              onContinueEnem={handleContinueEnem}
              onEnemRegistrationChange={setEnemRegistration}
              onSelectOption={(optionId) => handleSelectOption(optionId as AdmissionOptionId)}
            />
          </>
        ) : null}

        {step === 'simplified' ? (
          <GraduationSimplifiedStep onBack={() => setStep('selection')} />
        ) : null}

        {step === 'essay-theme' ? (
          <GraduationEssayThemeStep
            selectedThemeId={selectedEssayThemeId}
            onBack={() => setStep('selection')}
            onSelectTheme={setSelectedEssayThemeId}
            onContinue={() => setStep('essay-writing')}
          />
        ) : null}

        {step === 'essay-writing' ? (
          <GraduationEssayWritingStep onBack={() => setStep('essay-theme')} />
        ) : null}

        {step === 'enrollment-offer' ? (
          <GraduationEnrollmentOfferStep
            admissionOptionId={selectedOptionId}
            onBack={() => setStep('selection')}
          />
        ) : null}
      </div>
    </main>
  )
}
