import { useEffect, useState } from 'react'

import { clearJourneyProgress, saveJourneyProgress } from '@/course/journeyProgress'
import { finalizeJourney, updateJourneyStep3 } from '@/lib/journeyClient'

import { GraduationAdmissionSection } from './components/GraduationAdmissionSection'
import { GraduationEnrollmentOfferStep } from './components/GraduationEnrollmentOfferStep'
import { GraduationEssayWritingStep } from './components/GraduationEssayWritingStep'
import { GraduationEssayThemeStep, type EssayThemeId } from './components/GraduationEssayThemeStep'
import { GraduationSimplifiedStep } from './components/GraduationSimplifiedStep'
import { GraduationVestibularHero } from './components/GraduationVestibularHero'
import { VestibularHeader } from './components/VestibularHeader'
import {
  clearGraduationVestibularLead,
  readGraduationVestibularLead,
} from './graduationVestibularState'

import './vestibular.css'

export type AdmissionOptionId =
  | 'simplificada'
  | 'redacao'
  | 'transferencia'
  | 'segunda-graduacao'
  | 'enem'

type Identity = {
  firstName: string
  fullName: string
  email: string
  journeyId: number | null
  courseId: number | null
  courseLabel: string
  courseValue?: string
}

type VestibularStep =
  | 'selection'
  | 'simplified'
  | 'essay-theme'
  | 'essay-writing'
  | 'enrollment-offer'

const defaultIdentity: Identity = {
  firstName: 'Aluno',
  fullName: '',
  email: '',
  journeyId: null,
  courseId: null,
  courseLabel: '',
}

function getFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/)
  return firstName || 'Aluno'
}

function mapAdmissionOptionToEntryMethod(optionId: AdmissionOptionId): string {
  switch (optionId) {
    case 'segunda-graduacao':
      return 'segunda_graduacao'
    case 'transferencia':
      return 'transferencia'
    case 'enem':
      return 'enem'
    case 'redacao':
      return 'redacao'
    default:
      return 'simplificada'
  }
}

function mapEntryMethodToAdmissionOption(entryMethod?: string | null): AdmissionOptionId {
  switch (entryMethod) {
    case 'segunda_graduacao':
      return 'segunda-graduacao'
    case 'transferencia':
      return 'transferencia'
    case 'enem':
      return 'enem'
    case 'redacao':
      return 'redacao'
    default:
      return 'simplificada'
  }
}

function getEssayThemeLabel(themeId: EssayThemeId): string {
  return themeId === 'tema-b' ? 'Tema B' : 'Tema A'
}

export function GraduationVestibularPage() {
  const [identity, setIdentity] = useState<Identity>(defaultIdentity)
  const [step, setStep] = useState<VestibularStep>('selection')
  const [selectedOptionId, setSelectedOptionId] = useState<AdmissionOptionId>('simplificada')
  const [selectedEssayThemeId, setSelectedEssayThemeId] = useState<EssayThemeId>('tema-a')
  const [enemRegistration, setEnemRegistration] = useState('')
  const [resumePresentation, setResumePresentation] = useState('')
  const [resumeEssayTitle, setResumeEssayTitle] = useState('')
  const [resumeEssayText, setResumeEssayText] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedLead = readGraduationVestibularLead()
    if (!storedLead) return

    setIdentity({
      firstName: getFirstName(storedLead.fullName),
      fullName: storedLead.fullName,
      email: storedLead.email,
      journeyId: storedLead.journeyId ?? null,
      courseId: storedLead.courseId ?? null,
      courseLabel: storedLead.courseLabel ?? '',
      courseValue: storedLead.courseValue,
    })

    if (storedLead.enemRegistration) {
      setEnemRegistration(storedLead.enemRegistration)
    }

    if (storedLead.presentationLetter) {
      setResumePresentation(storedLead.presentationLetter)
    }

    if (storedLead.essayTitle) {
      setResumeEssayTitle(storedLead.essayTitle)
    }

    if (storedLead.essayText) {
      setResumeEssayText(storedLead.essayText)
    }

    const resumedOption = mapEntryMethodToAdmissionOption(storedLead.entryMethod)
    setSelectedOptionId(resumedOption)

    if (storedLead.essayThemeId === 'tema-b' || storedLead.essayThemeId === 'tema-a') {
      setSelectedEssayThemeId(storedLead.essayThemeId)
    }

    if ((storedLead.currentStep ?? 0) >= 3 && storedLead.entryMethod) {
      if (resumedOption === 'simplificada') {
        setStep('simplified')
        return
      }

      if (resumedOption === 'redacao') {
        setStep('essay-writing')
        return
      }

      setStep('enrollment-offer')
      return
    }

    if ((storedLead.currentStep ?? 0) >= 2) {
      setStep('selection')
    }
  }, [])

  function handleSelectOption(optionId: AdmissionOptionId) {
    setSubmitError('')
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

    setSubmitError('')
    setSelectedOptionId('enem')
    setStep('enrollment-offer')
  }

  async function finalizeGraduationFlow(step3Payload: Record<string, unknown>) {
    if (!identity.journeyId || !identity.courseId) {
      setSubmitError('Jornada não encontrada. Volte para a página do curso e reinicie a inscrição.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const step3Response = await updateJourneyStep3(identity.journeyId, step3Payload)
      saveJourneyProgress({
        journeyId: identity.journeyId,
        courseType: 'graduacao',
        courseId: identity.courseId,
        courseValue: identity.courseValue,
        courseLabel: identity.courseLabel,
        fullName: identity.fullName,
        email: identity.email,
        currentStep: step3Response.current_step ?? 3,
      })

      await finalizeJourney(identity.journeyId)
      clearJourneyProgress()
      clearGraduationVestibularLead()
      window.location.assign('/graduacao/inscricao-finalizada')
    } catch (error) {
      console.error('Erro ao finalizar jornada da graduação:', error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir sua inscrição agora. Tente novamente em instantes.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSimplifiedContinue(presentation: string) {
    await finalizeGraduationFlow({
      entry_method: 'simplificada',
      presentation_letter: presentation,
    })
  }

  async function handleEssayFinish(payload: { themeId: EssayThemeId; title: string; text: string }) {
    await finalizeGraduationFlow({
      entry_method: 'redacao',
      essay_theme_id: payload.themeId,
      essay_theme_label: getEssayThemeLabel(payload.themeId),
      essay_title: payload.title,
      essay_text: payload.text,
    })
  }

  async function handleEnrollmentFinish() {
    const payload: Record<string, unknown> = {
      entry_method: mapAdmissionOptionToEntryMethod(selectedOptionId),
    }

    if (selectedOptionId === 'enem') {
      payload.enem_registration = enemRegistration.trim()
    }

    await finalizeGraduationFlow(payload)
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
          <GraduationSimplifiedStep
            initialPresentation={resumePresentation}
            onBack={() => setStep('selection')}
            onContinue={handleSimplifiedContinue}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
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
          <GraduationEssayWritingStep
            initialTitle={resumeEssayTitle}
            initialEssay={resumeEssayText}
            selectedThemeId={selectedEssayThemeId}
            onBack={() => setStep('essay-theme')}
            onFinish={handleEssayFinish}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        ) : null}

        {step === 'enrollment-offer' ? (
          <GraduationEnrollmentOfferStep
            admissionOptionId={selectedOptionId}
            onBack={() => setStep('selection')}
            onFinish={handleEnrollmentFinish}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        ) : null}
      </div>
    </main>
  )
}

