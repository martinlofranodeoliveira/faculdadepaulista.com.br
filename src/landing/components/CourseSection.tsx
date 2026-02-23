import { useRef } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

import type { CourseItem } from '../data'

type CourseSectionProps = {
  id?: string
  title: string
  description: string
  dark?: boolean
  items: CourseItem[]
}

export function CourseSection({
  id,
  title,
  description,
  dark,
  items,
}: CourseSectionProps) {
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

    const card = track.querySelector<HTMLElement>('.lp-course-card')
    const cardWidth = card?.getBoundingClientRect().width ?? track.clientWidth
    const gap = 14
    track.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth',
    })
  }

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

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
    if (dragStateRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      dragStateRef.current.moved = false
    }
  }

  return (
    <section className={dark ? 'lp-courses lp-courses--dark' : 'lp-courses'} id={id}>
      <div className="lp-shell">
        <header className="lp-courses__head">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="lp-courses__controls">
            <button type="button" aria-label="Anterior" onClick={() => scrollByCard(-1)}>
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              aria-label="Próximo"
              className="is-active"
              onClick={() => scrollByCard(1)}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </header>

        <div
          className="lp-courses__grid"
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClickCapture={handleClickCapture}
        >
          {items.map((item) => (
            <article key={item.title} className="lp-course-card">
              <div className="lp-course-card__image-wrap">
                <img src={item.image} alt={item.title} />
                <span>{item.mode}</span>
              </div>
              <div className="lp-course-card__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href="#inscricao">
                  Saiba mais
                  <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
