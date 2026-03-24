import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, LoaderCircle } from 'lucide-react'

import type { EssayThemeId } from './GraduationEssayThemeStep'

type Props = {
  onBack: () => void
  onFinish: (payload: { themeId: EssayThemeId; title: string; text: string }) => Promise<void> | void
  selectedThemeId: EssayThemeId
  isSubmitting?: boolean
  submitError?: string
  initialTitle?: string
  initialEssay?: string
}

const MIN_ESSAY_TITLE_LENGTH = 5
const MAX_ESSAY_TITLE_LENGTH = 120
const MIN_ESSAY_BODY_LENGTH = 300
const MAX_ESSAY_BODY_LENGTH = 5000
const MIN_ESSAY_LINES = 15


function measureVisualEssayLines(textarea: HTMLTextAreaElement, value: string) {
  const styles = window.getComputedStyle(textarea)
  const lineHeight = Number.parseFloat(styles.lineHeight)

  if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
    return Math.max(1, value.split(/\r?\n/).length)
  }

  const mirror = document.createElement('div')
  mirror.style.position = 'absolute'
  mirror.style.visibility = 'hidden'
  mirror.style.pointerEvents = 'none'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.wordBreak = 'break-word'
  mirror.style.overflowWrap = 'break-word'
  mirror.style.boxSizing = styles.boxSizing
  mirror.style.width = `${textarea.clientWidth}px`
  mirror.style.padding = styles.padding
  mirror.style.border = styles.border
  mirror.style.fontFamily = styles.fontFamily
  mirror.style.fontSize = styles.fontSize
  mirror.style.fontWeight = styles.fontWeight
  mirror.style.fontStyle = styles.fontStyle
  mirror.style.letterSpacing = styles.letterSpacing
  mirror.style.lineHeight = styles.lineHeight
  mirror.style.textTransform = styles.textTransform
  mirror.textContent = value.length > 0 ? value : ' '

  document.body.appendChild(mirror)
  const height = mirror.getBoundingClientRect().height
  mirror.remove()

  return Math.max(1, Math.round(height / lineHeight))
}


export function GraduationEssayWritingStep({
  onBack,
  onFinish,
  selectedThemeId,
  isSubmitting = false,
  submitError,
  initialTitle = '',
  initialEssay = '',
}: Props) {
  const [essayTitle, setEssayTitle] = useState(initialTitle)
  const [essay, setEssay] = useState(initialEssay)
  const [essayLineCount, setEssayLineCount] = useState(1)
  const [hasTriedFinish, setHasTriedFinish] = useState(false)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const essayRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setEssayTitle(initialTitle)
  }, [initialTitle])

  useEffect(() => {
    setEssay(initialEssay)
  }, [initialEssay])

  const syncEssayLineCount = useCallback(() => {
    const textarea = essayRef.current
    if (!textarea) return
    setEssayLineCount(measureVisualEssayLines(textarea, essay))
  }, [essay])

  useLayoutEffect(() => {
    syncEssayLineCount()
  }, [syncEssayLineCount])

  useEffect(() => {
    const handleResize = () => {
      syncEssayLineCount()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [syncEssayLineCount])

  const titleCharacterCount = useMemo(() => essayTitle.trim().length, [essayTitle])
  const essayCharacterCount = useMemo(() => essay.trim().length, [essay])

  const isTitleValid =
    titleCharacterCount >= MIN_ESSAY_TITLE_LENGTH &&
    titleCharacterCount <= MAX_ESSAY_TITLE_LENGTH

  const isEssayValid =
    essayCharacterCount >= MIN_ESSAY_BODY_LENGTH &&
    essayCharacterCount <= MAX_ESSAY_BODY_LENGTH &&
    essayLineCount >= MIN_ESSAY_LINES

  const showTitleError = hasTriedFinish && !isTitleValid
  const showEssayError = hasTriedFinish && !isEssayValid

  async function handleFinish() {
    if (!isTitleValid) {
      setHasTriedFinish(true)
      titleRef.current?.focus()
      return
    }

    if (!isEssayValid) {
      setHasTriedFinish(true)
      essayRef.current?.focus()
      return
    }

    await onFinish({
      themeId: selectedThemeId,
      title: essayTitle.trim(),
      text: essay.trim(),
    })
  }

  return (
    <section className="vestibular-step vestibular-step--essay-writing" aria-labelledby="vestibular-step-title">
      <div className="vestibular-step__shell">
        <button type="button" className="vestibular-step__back" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={18} strokeWidth={2.1} aria-hidden="true" />
          <span>Voltar</span>
        </button>

        <h2 id="vestibular-step-title" className="vestibular-step__title vestibular-step__title--single">
          <span>Redação</span>
        </h2>

        <label className="vestibular-step__field vestibular-step__field--compact">
          <span className="sr-only">Digite o título da redação</span>
          <input
            ref={titleRef}
            type="text"
            placeholder="Digite o título da redação"
            value={essayTitle}
            maxLength={MAX_ESSAY_TITLE_LENGTH}
            aria-invalid={showTitleError}
            onChange={(event) => {
              setEssayTitle(event.target.value)
              if (hasTriedFinish) {
                setHasTriedFinish(false)
              }
            }}
          />
        </label>

        {showTitleError ? (
          <p className="vestibular-step__validation-error">
            Informe um título entre {MIN_ESSAY_TITLE_LENGTH} e {MAX_ESSAY_TITLE_LENGTH} caracteres.
          </p>
        ) : null}

        <label className="vestibular-step__field vestibular-step__field--compact">
          <span className="sr-only">Digite sua redação</span>
          <textarea
            ref={essayRef}
            placeholder="Digite sua redação"
            value={essay}
            maxLength={MAX_ESSAY_BODY_LENGTH}
            aria-invalid={showEssayError}
            onChange={(event) => {
              setEssay(event.target.value)
              if (hasTriedFinish) {
                setHasTriedFinish(false)
              }
            }}
          />
        </label>

        {showEssayError ? (
          <p className="vestibular-step__validation-error">
            A redação deve ter pelo menos {MIN_ESSAY_LINES} linhas e entre {MIN_ESSAY_BODY_LENGTH} e{' '}
            {MAX_ESSAY_BODY_LENGTH} caracteres.
          </p>
        ) : null}

        {submitError ? <p className="vestibular-step__validation-error">{submitError}</p> : null}

        <div className="vestibular-step__actions">
          <p>{`Quantidade de caracteres: ${essayCharacterCount} / ${MAX_ESSAY_BODY_LENGTH} · Linhas: ${essayLineCount} / ${MIN_ESSAY_LINES}`}</p>
          <button type="button" className="vestibular-step__continue" onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle size={18} className="is-spinning" /> : null}
            FINALIZAR
          </button>
        </div>
      </div>
    </section>
  )
}
