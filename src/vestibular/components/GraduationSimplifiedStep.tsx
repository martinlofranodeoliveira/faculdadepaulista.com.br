import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, LoaderCircle } from 'lucide-react'

type Props = {
  onBack: () => void
  onContinue: (presentation: string) => Promise<void> | void
  isSubmitting?: boolean
  submitError?: string
  initialPresentation?: string
}

const MIN_PRESENTATION_LENGTH = 250
const MAX_PRESENTATION_LENGTH = 2500

export function GraduationSimplifiedStep({
  onBack,
  onContinue,
  isSubmitting = false,
  submitError,
  initialPresentation = '',
}: Props) {
  const [presentation, setPresentation] = useState(initialPresentation)
  const [hasTriedContinue, setHasTriedContinue] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setPresentation(initialPresentation)
  }, [initialPresentation])

  const characterCount = useMemo(() => presentation.trim().length, [presentation])
  const isValid =
    characterCount >= MIN_PRESENTATION_LENGTH && characterCount <= MAX_PRESENTATION_LENGTH
  const showValidationError = hasTriedContinue && !isValid

  async function handleContinue() {
    if (!isValid) {
      setHasTriedContinue(true)
      textareaRef.current?.focus()
      return
    }

    await onContinue(presentation.trim())
  }

  return (
    <section className="vestibular-step" aria-labelledby="vestibular-step-title">
      <div className="vestibular-step__shell">
        <button type="button" className="vestibular-step__back" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={18} strokeWidth={2.1} aria-hidden="true" />
          <span>Voltar</span>
        </button>

        <h2 id="vestibular-step-title" className="vestibular-step__title">
          <span>Conte-nos</span>
          <strong>um pouco sobre você</strong>
        </h2>

        <p className="vestibular-step__description">
          Como Vestibular, escreva aqui uma CARTA DE APRESENTAÇÃO explicando porque você
          deseja estudar na Faculdade FASUL EDUCACIONAL, quais são suas expectativas em
          relação ao curso escolhido e quais são seus planos profissionais para o futuro!
          Seu texto deve conter no mínimo 7 linhas. Nossa equipe avaliará sua carta
          juntamente com sua documentação.
        </p>

        <label className="vestibular-step__field">
          <span className="sr-only">Digite sua apresentação</span>
          <textarea
            ref={textareaRef}
            placeholder="Digite sua apresentação"
            value={presentation}
            maxLength={MAX_PRESENTATION_LENGTH}
            aria-invalid={showValidationError}
            onChange={(event) => {
              setPresentation(event.target.value)
              if (hasTriedContinue) {
                setHasTriedContinue(false)
              }
            }}
          />
        </label>

        {showValidationError ? (
          <p className="vestibular-step__validation-error">
            Escreva entre {MIN_PRESENTATION_LENGTH} e {MAX_PRESENTATION_LENGTH} caracteres para continuar.
          </p>
        ) : null}

        {submitError ? <p className="vestibular-step__validation-error">{submitError}</p> : null}

        <div className="vestibular-step__actions">
          <p>{`Quantidade de caracteres: ${characterCount} / ${MAX_PRESENTATION_LENGTH}`}</p>
          <button type="button" className="vestibular-step__continue" onClick={handleContinue} disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle size={18} className="is-spinning" /> : null}
            CONTINUAR
          </button>
        </div>
      </div>
    </section>
  )
}
