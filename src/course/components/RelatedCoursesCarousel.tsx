import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type RelatedCourse = {
  path: string
  title: string
  description: string
  image: string
  courseType: 'graduacao' | 'pos'
  oldInstallmentPrice: string
  currentInstallmentPriceMonthly: string
  modalityBadge: string
}

type Props = {
  courses: RelatedCourse[]
  variant: 'graduation' | 'post'
}

type TrackMetrics = {
  step: number
  maxIndex: number
  maxScrollLeft: number
}

const POST_HOURS_LABEL = '360 a 720 horas'

function clampIndex(value: number, maxIndex: number) {
  return Math.min(Math.max(0, value), maxIndex)
}

function formatPriceLabel(value: string) {
  return value.replace(/\s*\/\s*M[ÊE]S/iu, ' mensais').replace(/\s+/gu, ' ').trim()
}

function getMaxVisibleDots(width: number) {
  if (width <= 720) return 4
  if (width <= 1024) return 6
  return 8
}

export default function RelatedCoursesCarousel({ courses, variant }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const [canGoPrev, setCanGoPrev] = useState(false)
  const [canGoNext, setCanGoNext] = useState(false)
  const [maxVisibleDots, setMaxVisibleDots] = useState(8)

  const pageCount = maxIndex + 1

  const visibleDotIndices = useMemo(() => {
    if (pageCount <= maxVisibleDots) {
      return Array.from({ length: pageCount }, (_, index) => index)
    }

    const halfWindow = Math.floor(maxVisibleDots / 2)
    let start = Math.max(0, currentIndex - halfWindow)
    let end = start + maxVisibleDots

    if (end > pageCount) {
      end = pageCount
      start = Math.max(0, end - maxVisibleDots)
    }

    return Array.from({ length: end - start }, (_, index) => start + index)
  }, [currentIndex, maxVisibleDots, pageCount])

  useEffect(() => {
    const syncVisibleDots = () => setMaxVisibleDots(getMaxVisibleDots(window.innerWidth))

    syncVisibleDots()
    window.addEventListener('resize', syncVisibleDots)

    return () => window.removeEventListener('resize', syncVisibleDots)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const getMetrics = (): TrackMetrics | null => {
      const cardSelector =
        variant === 'graduation'
          ? '.course-page__grad-related-card'
          : '.course-page__related-card--post'
      const card = track.querySelector<HTMLElement>(cardSelector)
      if (!card) return null

      const styles = window.getComputedStyle(track)
      const gap =
        Number.parseFloat(styles.columnGap || styles.gap || '0') ||
        Number.parseFloat(styles.rowGap || '0') ||
        0
      const cardWidth = card.getBoundingClientRect().width
      const step = cardWidth + gap
      if (step <= 0) return null

      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth)
      const maxIndex = Math.max(0, Math.round(maxScrollLeft / step))

      return { step, maxIndex, maxScrollLeft }
    }

    const sync = () => {
      const metrics = getMetrics()
      if (!metrics) {
        setCurrentIndex(0)
        setMaxIndex(0)
        setCanGoPrev(false)
        setCanGoNext(false)
        return
      }

      setMaxIndex(metrics.maxIndex)
      setCurrentIndex(clampIndex(Math.round(track.scrollLeft / metrics.step), metrics.maxIndex))
      setCanGoPrev(track.scrollLeft > 2)
      setCanGoNext(track.scrollLeft < metrics.maxScrollLeft - 2)
    }

    sync()
    track.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)

    return () => {
      track.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [courses.length, variant])

  const scrollToIndex = (targetIndex: number) => {
    const track = trackRef.current
    if (!track) return

    const cardSelector =
      variant === 'graduation'
        ? '.course-page__grad-related-card'
        : '.course-page__related-card--post'
    const card = track.querySelector<HTMLElement>(cardSelector)
    if (!card) return

    const styles = window.getComputedStyle(track)
    const gap =
      Number.parseFloat(styles.columnGap || styles.gap || '0') ||
      Number.parseFloat(styles.rowGap || '0') ||
      0
    const step = card.getBoundingClientRect().width + gap
    if (step <= 0) return

    const nextIndex = clampIndex(targetIndex, maxIndex)
    track.scrollTo({
      left: nextIndex * step,
      behavior: 'smooth',
    })
  }

  if (!courses.length) return null

  const footer = (
    <div className="course-page__related-carousel-footer">
      <div className="course-page__related-carousel-dots" aria-label="Paginação dos cursos relacionados">
        {visibleDotIndices.map((index) => (
          <button
            key={`${variant}-dot-${index}`}
            type="button"
            className={`course-page__related-carousel-dot${currentIndex === index ? ' is-active' : ''}`}
            aria-label={`Ir para a posição ${index + 1}`}
            aria-current={currentIndex === index ? 'true' : undefined}
            onClick={() => scrollToIndex(index)}
          />
        ))}
      </div>

      <div className="course-page__related-carousel-controls">
        <button
          type="button"
          className={`course-page__related-carousel-control${!canGoPrev ? ' is-disabled' : ''}`}
          aria-label="Cursos anteriores"
          disabled={!canGoPrev}
          onClick={() => scrollToIndex(currentIndex - 1)}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          className={`course-page__related-carousel-control course-page__related-carousel-control--next${!canGoNext ? ' is-disabled' : ''}`}
          aria-label="Próximos cursos"
          disabled={!canGoNext}
          onClick={() => scrollToIndex(currentIndex + 1)}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )

  if (variant === 'graduation') {
    return (
      <section className="course-page__grad-related" aria-labelledby="course-related-title">
        <div className="course-page__shell">
          <p className="course-page__grad-related-eyebrow">Não encontrou o que procurava?</p>

          <h2 id="course-related-title" className="course-page__grad-related-title">
            <span>Cursos</span>
            <span>Relacionados</span>
          </h2>

          <div className="course-page__grad-related-carousel">
            <div className="course-page__grad-related-grid" ref={trackRef}>
              {courses.map((course) => (
                <article className="course-page__grad-related-card" key={course.path}>
                  <a
                    href={course.path}
                    className="course-page__grad-related-media-link"
                    aria-label={`Abrir página do curso ${course.title}`}
                  >
                    <img
                      src={course.image}
                      alt={`Imagem do curso ${course.title}`}
                      width="282"
                      height="132"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>

                  <div className="course-page__grad-related-body">
                    <div className="course-page__grad-related-tags">
                      <span className="course-page__grad-related-tag course-page__grad-related-tag--solid">
                        Reconhecido MEC
                      </span>
                      <span className="course-page__grad-related-tag course-page__grad-related-tag--solid">
                        {course.modalityBadge}
                      </span>
                    </div>

                    <h3>{course.title}</h3>

                    <div className="course-page__grad-related-price">
                      {course.oldInstallmentPrice ? (
                        <span className="course-page__grad-related-price-old">
                          De: {formatPriceLabel(course.oldInstallmentPrice)}
                        </span>
                      ) : null}
                      <strong>Por: {formatPriceLabel(course.currentInstallmentPriceMonthly)}</strong>
                    </div>
                  </div>

                  <a href={course.path} className="course-page__grad-related-cta">
                    Inscreva-se
                  </a>
                </article>
              ))}
            </div>

            {footer}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="course-page__related course-page__related--post" aria-labelledby="course-related-title">
      <div className="course-page__shell">
        <p className="course-page__related-eyebrow">Não encontrou o que procurava?</p>
        <h2 id="course-related-title">
          <span>Cursos</span>
          <span>Relacionados</span>
        </h2>

        <div className="course-page__related-carousel">
          <div className="course-page__related-grid course-page__related-grid--post" ref={trackRef}>
            {courses.map((course) => (
              <article className="course-page__related-card course-page__related-card--post" key={course.path}>
                <a
                  href={course.path}
                  className="course-page__related-media-link"
                  aria-label={`Abrir página do curso ${course.title}`}
                >
                  <img
                    src={course.image}
                    alt={`Imagem do curso ${course.title}`}
                    width="282"
                    height="132"
                    loading="lazy"
                    decoding="async"
                  />
                </a>

                <div className="course-page__related-body course-page__related-body--post">
                  <div className="course-page__related-tags">
                    <span className="course-page__related-tag course-page__related-tag--outlined">
                      <strong>Reconhecido</strong> MEC
                    </span>
                    <span className="course-page__related-tag course-page__related-tag--plain">
                      {POST_HOURS_LABEL}
                    </span>
                  </div>

                  <h3>{course.title}</h3>

                  <div className="course-page__related-price">
                    <span>A partir de</span>
                    <strong>
                      {formatPriceLabel(course.currentInstallmentPriceMonthly).replace(/^Por:\s*/iu, '')}
                    </strong>
                  </div>
                </div>

                <a href={course.path} className="course-page__related-cta">
                  Inscreva-se
                </a>
              </article>
            ))}
          </div>

          {footer}
        </div>
      </div>
    </section>
  )
}
