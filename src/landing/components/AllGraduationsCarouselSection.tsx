import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { prefillCourseAndGoToForm } from '../coursePrefill'
import { graduationCarouselCourses } from '../data'

function normalizeComparableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function inferGraduationMode(courseTitle: string): string {
  const normalized = normalizeComparableText(courseTitle)
  if (normalized.includes('semipresencial')) return 'GRADUAÇÃO SEMIPRESENCIAL'
  if (normalized.includes('presencial')) return 'GRADUAÇÃO PRESENCIAL'
  return 'GRADUAÇÃO EAD'
}

export function AllGraduationsCarouselSection() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  })

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    const card = track.querySelector<HTMLElement>('.lp-all-grad-card')
    const cardWidth = card?.getBoundingClientRect().width ?? 306
    const gap = 18

    track.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth',
    })
  }

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType === 'mouse') return
    if (event.button !== 0) return

    const track = trackRef.current
    if (!track) return

    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
    }

    track.classList.add('is-dragging')
    track.setPointerCapture(event.pointerId)
  }

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const track = trackRef.current
    const dragState = dragStateRef.current

    if (!track || !dragState.isDragging || dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startX
    if (!dragState.moved && Math.abs(deltaX) > 4) {
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

    dragStateRef.current = {
      isDragging: false,
      pointerId: -1,
      startX: 0,
      startScrollLeft: track.scrollLeft,
      moved: dragState.moved,
    }
  }

  const handlePointerCancel: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const track = trackRef.current
    if (!track) return

    track.classList.remove('is-dragging')
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current.isDragging = false
    dragStateRef.current.pointerId = -1
  }

  const handleClickCapture: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest('.lp-all-grad-card__cta')
    ) {
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
    <section className="lp-all-grad" id="graduacao">
      <div className="lp-shell">
        <header className="lp-all-grad__head">
          <div>
            <h2>TODAS AS GRADUAÇÕES</h2>
            <p>Explore nossos cursos e encontre o caminho ideal para sua carreira.</p>
          </div>
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
            {graduationCarouselCourses.map((course) => (
              <article key={course.courseValue} className="lp-all-grad-card">
                <div className="lp-all-grad-card__image-wrap">
                  <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    style={course.imagePosition ? { objectPosition: course.imagePosition } : undefined}
                  />
                </div>

                <span className="lp-all-grad-card__mode">{inferGraduationMode(course.title)}</span>

                <h3>{course.title}</h3>

                <div className="lp-all-grad-card__prices">
                  <p className="lp-all-grad-card__price-old">
                    <span>De:</span> {course.oldInstallmentPrice}
                  </p>
                  <p className="lp-all-grad-card__price-current">
                    <span>Por:</span> {course.installmentPrice}
                  </p>
                  <span className="lp-all-grad-card__fixed">FIXOS</span>
                </div>

                <a
                  href="#inscricao"
                  className="lp-all-grad-card__cta"
                  onClick={(event) => {
                    event.preventDefault()
                    prefillCourseAndGoToForm({
                      courseType: 'graduacao',
                      courseValue: course.courseValue,
                      courseLabel: course.title,
                    })
                  }}
                >
                  INSCREVA-SE
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
