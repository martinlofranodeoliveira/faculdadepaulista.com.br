import { useEffect, useMemo, useRef, useState } from 'react'

import { getCoursePath } from '@/lib/courseRoutes'
import { openCourseLeadModal } from '../coursePrefill'
import type { LandingPostArea, LandingPostCourse } from '../landingModels'

const ALL_AREAS = '__all_areas__'
const COURSES_PER_PAGE = 5

type Props = {
  courses: LandingPostCourse[]
  areas: LandingPostArea[]
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14.1667 14.1666L18.3334 18.3333M16.1111 9.16663C16.1111 13.0026 13.0027 16.1111 9.16675 16.1111C5.33077 16.1111 2.22231 13.0026 2.22231 9.16663C2.22231 5.33065 5.33077 2.22218 9.16675 2.22218C13.0027 2.22218 16.1111 5.33065 16.1111 9.16663Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BonusPostIcon() {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.93506 2.20703C4.62082 2.20703 3.55518 3.27269 3.55518 4.58691C3.55518 5.90114 4.62082 6.9668 5.93506 6.9668H9.51123V5.74805L8.53662 4.77344C7.60863 3.84544 6.66698 2.20703 5.93506 2.20703ZM13.0874 2.20703C12.3555 2.20703 11.4138 3.84544 10.4858 4.77344L9.51123 5.74805V6.9668H13.0874C14.4016 6.9668 15.4673 5.90114 15.4673 4.58691C15.4673 3.27269 14.4016 2.20703 13.0874 2.20703ZM3.55518 8.15723V10.5371H8.9165V8.15723H3.55518ZM10.106 8.15723V10.5371H15.4673V8.15723H10.106ZM3.55518 11.7275V17.6836C3.55518 18.3407 4.08799 18.8735 4.74512 18.8735H8.32129V11.7275H3.55518ZM9.51123 11.7275V18.8735H14.2773C14.9344 18.8735 15.4673 18.3407 15.4673 17.6836V11.7275H9.51123Z"
        fill="#FFE23D"
      />
    </svg>
  )
}

export function GraduationCarouselSection({ courses, areas }: Props) {
  const [activeArea, setActiveArea] = useState(ALL_AREAS)
  const [currentPage, setCurrentPage] = useState(1)
  const listRef = useRef<HTMLDivElement | null>(null)

  const areaOptions = useMemo(() => {
    return [ALL_AREAS, ...areas.map((area) => area.label)]
  }, [areas])

  const filteredCourses = useMemo(() => {
    const areaFiltered =
      activeArea === ALL_AREAS
        ? courses
        : areas.find((area) => area.label === activeArea)?.courses ?? []

    return [...areaFiltered].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
  }, [activeArea, areas, courses])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeArea, courses])

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / COURSES_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedCourses = useMemo(() => {
    const start = (safeCurrentPage - 1) * COURSES_PER_PAGE
    return filteredCourses.slice(start, start + COURSES_PER_PAGE)
  }, [filteredCourses, safeCurrentPage])

  const totalCoursesCount = filteredCourses.length
  const scopeLabel =
    activeArea === ALL_AREAS ? 'PÓS EM TODAS AS ÁREAS' : `PÓS NA ÁREA DE ${activeArea}`

  const visiblePageNumbers = useMemo(() => {
    const maxVisiblePages = 3
    let startPage = Math.max(1, safeCurrentPage - 1)
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)
  }, [safeCurrentPage, totalPages])

  const canGoToPreviousPage = safeCurrentPage > 1
  const canGoToNextPage = safeCurrentPage < totalPages

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeArea, safeCurrentPage])

  const buildCurrentPriceLabel = (price: string) => {
    return /\/m[eê]s/i.test(price) ? price : `${price}/MÊS`
  }

  return (
    <section className="lp-grad-carousel" id="pos-graduacao">
      <div className="lp-shell">
        <header className="lp-grad-carousel__head">
          <h2>2.000 PÓS-GRADUAÇÕES EAD</h2>
        </header>

        <div className="lp-grad-carousel__filters-row">
          <a href="/pos-graduacao" className="lp-grad-carousel__search-link">
            <SearchIcon />
            <span>PROCURAR</span>
          </a>

          <div className="lp-grad-carousel__filters" role="tablist" aria-label="Filtrar cursos por área">
            {areaOptions.map((area, index) => (
              <button
                key={area}
                type="button"
                role="tab"
                aria-selected={activeArea === area}
                className={`lp-grad-carousel__filter ${activeArea === area ? 'is-active' : ''}`}
                onClick={() => setActiveArea(area)}
              >
                {index === 0 ? 'TODAS' : area}
              </button>
            ))}
          </div>
        </div>

        <div className="lp-grad-carousel__divider" aria-hidden="true" />

        {paginatedCourses.length ? (
          <>
            <div className="lp-grad-carousel__sections">
              <section className="lp-grad-carousel__area-section">
                <div className="lp-grad-carousel__scope-row">
                  <p className="lp-grad-carousel__scope">{scopeLabel}</p>
                </div>

                <div className="lp-grad-carousel__list" ref={listRef}>
                  {paginatedCourses.map((course) => (
                    <article key={course.courseValue} className="lp-grad-carousel__item">
                      <div className="lp-grad-carousel__image-wrap">
                        <img
                          src={course.image}
                          alt={course.title}
                          width="217"
                          height="137"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="lp-grad-carousel__content">
                        <span className="lp-grad-carousel__promo">
                          <BonusPostIcon />
                          GANHE +3 PÓS PARA VOCÊ OU UM AMIGO!
                        </span>

                        <h3>{course.title}</h3>

                        <div className="lp-grad-carousel__price">
                          <strong>{buildCurrentPriceLabel(course.currentInstallmentPrice)}</strong>
                          {course.oldInstallmentPrice ? <span>{course.oldInstallmentPrice}</span> : null}
                        </div>
                      </div>

                      <a
                        href={getCoursePath({
                          courseType: 'pos',
                          courseValue: course.courseValue,
                          courseLabel: course.courseLabel,
                        })}
                        className="lp-grad-carousel__cta"
                        onClick={(event) => {
                          event.preventDefault()
                          openCourseLeadModal({
                            courseType: 'pos',
                            courseModality: course.courseModality,
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
              </section>
            </div>

            {totalCoursesCount > 0 ? (
              <div className="lp-grad-carousel__footer">
                <div className="lp-grad-carousel__footer-divider" aria-hidden="true" />

                <div className="lp-grad-carousel__pagination" aria-label="Paginação dos cursos">
                  <div className="lp-grad-carousel__pagination-controls">
                    <button
                      type="button"
                      className="lp-grad-carousel__page-nav lp-grad-carousel__page-nav--prev"
                      aria-label="Página anterior"
                      disabled={!canGoToPreviousPage}
                      onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M14.5 5L8 11.5L14.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <div className="lp-grad-carousel__pages">
                      {visiblePageNumbers.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          className={`lp-grad-carousel__page-number ${safeCurrentPage === pageNumber ? 'is-active' : ''}`}
                          aria-label={`Ir para página ${pageNumber}`}
                          aria-current={safeCurrentPage === pageNumber ? 'page' : undefined}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="lp-grad-carousel__page-nav lp-grad-carousel__page-nav--next"
                      aria-label="Próxima página"
                      disabled={!canGoToNextPage}
                      onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M9.5 5L16 11.5L9.5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="lp-grad-carousel__state">Nenhum curso encontrado para esta área.</div>
        )}
      </div>
    </section>
  )
}
