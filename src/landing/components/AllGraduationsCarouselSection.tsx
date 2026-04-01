import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { getCoursePath } from '@/lib/courseRoutes'
import { openCourseLeadModal } from '../coursePrefill'
import type { LandingGraduationCourseCard } from '../landingModels'

type Props = {
  courses: LandingGraduationCourseCard[]
}

function BonusPostIcon() {
  return (
    <svg
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.211 1.53C3.309 1.53 2.578 2.262 2.578 3.164C2.578 4.066 3.309 4.797 4.211 4.797H6.667V3.961L5.997 3.291C5.359 2.653 4.711 1.53 4.211 1.53ZM9.123 1.53C8.623 1.53 7.974 2.653 7.337 3.291L6.667 3.961V4.797H9.123C10.025 4.797 10.756 4.066 10.756 3.164C10.756 2.262 10.025 1.53 9.123 1.53ZM2.578 5.614V7.248H6.258V5.614H2.578ZM7.076 5.614V7.248H10.756V5.614H7.076ZM2.578 8.065V12.155C2.578 12.606 2.944 12.972 3.395 12.972H5.849V8.065H2.578ZM6.667 8.065V12.972H9.94C10.391 12.972 10.756 12.606 10.756 12.155V8.065H6.667Z"
        fill="#FFE23D"
      />
    </svg>
  )
}

function getDisplayTitle(title: string): string {
  return title
    .replace(/\s*\((Semipresencial|Presencial|EAD)\)\s*$/i, '')
    .replace(/\s+(Semipresencial|Presencial|EAD)\s*$/i, '')
    .trim()
}

function getSemesterLabel(semesterCount: number) {
  if (!semesterCount) return ''
  return `${semesterCount} ${semesterCount === 1 ? 'semestre' : 'semestres'}`
}

export function AllGraduationsCarouselSection({ courses }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    moved: false,
    axis: null as 'x' | 'y' | null,
  })

  const getTrackMetrics = (track: HTMLDivElement) => {
    const card = track.querySelector<HTMLElement>('.lp-all-grad-card')
    if (!card) return null

    const styles = window.getComputedStyle(track)
    const gap =
      Number.parseFloat(styles.columnGap || styles.gap || '0') ||
      Number.parseFloat(styles.rowGap || '0') ||
      0
    const cardWidth = card.getBoundingClientRect().width
    const step = cardWidth + gap
    if (step <= 0) return null

    const maxIndex = Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step))
    return { step, maxIndex }
  }

  const clampIndex = (value: number, maxIndex: number) => Math.min(Math.max(0, value), maxIndex)

  const snapToNearestCard = (track: HTMLDivElement, behavior: ScrollBehavior = 'smooth') => {
    const metrics = getTrackMetrics(track)
    if (!metrics) return

    const nearestIndex = clampIndex(Math.round(track.scrollLeft / metrics.step), metrics.maxIndex)
    track.scrollTo({
      left: nearestIndex * metrics.step,
      behavior,
    })
  }

  const resetDragState = (scrollLeft: number, moved = false) => {
    dragStateRef.current = {
      isDragging: false,
      pointerId: -1,
      startX: 0,
      startY: 0,
      startScrollLeft: scrollLeft,
      moved,
      axis: null,
    }
  }

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    const metrics = getTrackMetrics(track)
    if (!metrics) return

    const currentIndex = clampIndex(Math.round(track.scrollLeft / metrics.step), metrics.maxIndex)
    const targetIndex = clampIndex(currentIndex + direction, metrics.maxIndex)

    track.scrollTo({
      left: targetIndex * metrics.step,
      behavior: 'smooth',
    })
  }

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = () => {}

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const track = trackRef.current
    const dragState = dragStateRef.current

    if (!track || !dragState.isDragging || dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    if (dragState.axis === null) {
      if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) return

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        resetDragState(track.scrollLeft, false)
        return
      }

      dragState.axis = 'x'
      track.classList.add('is-dragging')
      track.setPointerCapture(event.pointerId)
    }

    if (dragState.axis !== 'x') return

    event.preventDefault()

    if (!dragState.moved && Math.abs(deltaX) > 2) {
      dragState.moved = true
    }

    track.scrollLeft = dragState.startScrollLeft - deltaX
  }

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const track = trackRef.current
    const dragState = dragStateRef.current

    if (!track || !dragState.isDragging || dragState.pointerId !== event.pointerId) return

    track.classList.remove('is-dragging')
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }

    if (dragState.axis === 'x' && dragState.moved) {
      const metrics = getTrackMetrics(track)
      if (!metrics) {
        snapToNearestCard(track, 'smooth')
      } else {
        const deltaX = event.clientX - dragState.startX
        const swipeThreshold = Math.max(20, Math.min(56, metrics.step * 0.12))
        const startIndex = clampIndex(
          Math.round(dragState.startScrollLeft / metrics.step),
          metrics.maxIndex,
        )

        const targetIndex =
          Math.abs(deltaX) >= swipeThreshold
            ? clampIndex(startIndex + (deltaX < 0 ? 1 : -1), metrics.maxIndex)
            : clampIndex(Math.round(track.scrollLeft / metrics.step), metrics.maxIndex)

        track.scrollTo({
          left: targetIndex * metrics.step,
          behavior: 'smooth',
        })
      }
    }

    resetDragState(track.scrollLeft, dragState.axis === 'x' && dragState.moved)
  }

  const handlePointerCancel: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const track = trackRef.current
    if (!track) return

    track.classList.remove('is-dragging')
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }

    snapToNearestCard(track, 'auto')
    resetDragState(track.scrollLeft, false)
  }

  const handleClickCapture: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target instanceof Element && event.target.closest('.lp-all-grad-card__cta')) {
      dragStateRef.current.moved = false
      return
    }

    if (dragStateRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragStateRef.current.moved = false
    }
  }

  return (
    <section className="lp-all-grad" id="graduacao-online" aria-labelledby="graduacoes-online-title">
      <div className="lp-shell">
        <header className="lp-all-grad__head">
          <h2 id="graduacoes-online-title">GRADUAÇÕES SEMIPRESENCIAIS / EAD</h2>
          <p>Explore nosso Catálogo de Cursos e encontre a formação ideal para o seu sucesso.</p>
        </header>

        <div className="lp-all-grad__slider">
          <button
            type="button"
            className="lp-all-grad__control"
            aria-label="Cursos anteriores"
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft size={22} />
          </button>

          <div
            className="lp-all-grad__track"
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onClickCapture={handleClickCapture}
          >
            {courses.map((course) => (
              <article key={course.courseValue} className="lp-all-grad-card">
                <div className="lp-all-grad-card__image-wrap">
                  <img
                    src={course.image}
                    alt={course.title}
                    width="280"
                    height="132"
                    loading="lazy"
                    decoding="async"
                    style={course.imagePosition ? { objectPosition: course.imagePosition } : undefined}
                  />
                  <div className="lp-all-grad-card__promo" aria-hidden="true">
                    <BonusPostIcon />
                    <span>GANHE +3 PÓS!</span>
                  </div>
                </div>

                <h3>{getDisplayTitle(course.title)}</h3>

                <div className="lp-all-grad-card__badges">
                  <div className="lp-all-grad-card__badge-row">
                    <span className="lp-all-grad-card__mode">{course.modalityLabel}</span>
                  </div>
                  <div className="lp-all-grad-card__badge-row">
                    <span className="lp-all-grad-card__mec">RECONHECIDO MEC</span>
                    {course.semesterCount > 0 ? (
                      <span className="lp-all-grad-card__semester">
                        {getSemesterLabel(course.semesterCount)}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="lp-all-grad-card__prices">
                  {course.oldInstallmentPrice ? (
                    <p className="lp-all-grad-card__price-old">
                      <span>De:</span> {course.oldInstallmentPrice}
                    </p>
                  ) : null}
                  <div className="lp-all-grad-card__price-current-row">
                    <p className="lp-all-grad-card__price-current">
                      <span>Por:</span> {course.installmentPrice}
                    </p>
                    {course.fixedInstallments ? (
                      <span className="lp-all-grad-card__fixed">FIXOS</span>
                    ) : null}
                  </div>
                </div>

                <a
                  href={getCoursePath({
                    courseType: 'graduacao',
                    courseValue: course.courseValue,
                    courseLabel: course.courseLabel,
                  })}
                  className="lp-all-grad-card__cta"
                  onClick={(event) => {
                    event.preventDefault()
                    openCourseLeadModal({
                      courseType: 'graduacao',
                      courseModality: course.modality,
                      courseValue: course.courseValue,
                      courseLabel: course.courseLabel,
                      courseId: course.courseId,
                    })
                  }}
                >
                  SAIBA MAIS
                </a>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="lp-all-grad__control"
            aria-label="Próximos cursos"
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}
