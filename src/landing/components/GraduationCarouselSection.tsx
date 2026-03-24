import { useEffect, useMemo, useRef, useState } from 'react'

import { getCoursePath } from '@/lib/courseRoutes'
import type { LandingPostCourse } from '../landingModels'

const ALL_AREAS = '__all_areas__'
const COURSES_PER_PAGE = 5

type SortOrder = 'asc' | 'desc'
type Props = {
  courses: LandingPostCourse[]
}

function GraduationLabelIcon() {
  return (
    <svg
      width="27"
      height="22"
      viewBox="0 0 27 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M23.7129 16.5991V8.4181L13.0421 14.2278L0 7.11388L13.0421 0L26.0842 7.11388V16.5991H23.7129ZM13.0421 21.3417L4.74259 16.8362V10.908L13.0421 15.4134L21.3417 10.908V16.8362L13.0421 21.3417Z"
        fill="#C50002"
      />
    </svg>
  )
}

function VideoLabelIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11.5059 0C5.15463 0 0 5.15463 0 11.5059C0 17.8571 5.15463 23.0117 11.5059 23.0117C17.8571 23.0117 23.0117 17.8571 23.0117 11.5059C23.0117 5.15463 17.8571 0 11.5059 0ZM9.2047 16.6835V6.32823L16.1082 11.5059L9.2047 16.6835Z"
        fill="#C50002"
      />
    </svg>
  )
}

function SortFilterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M3.33301 5H16.6663" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.83301 10H14.1663" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.33301 15H11.6663" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function GraduationCarouselSection({ courses }: Props) {
  const [activeArea, setActiveArea] = useState(ALL_AREAS)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const listRef = useRef<HTMLDivElement | null>(null)

  const areaOptions = useMemo(() => {
    const uniqueAreas = [...new Set(courses.map((course) => course.area).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b, 'pt-BR'),
    )

    return [ALL_AREAS, ...uniqueAreas]
  }, [courses])

  const filteredCourses = useMemo(() => {
    const areaFiltered =
      activeArea === ALL_AREAS ? courses : courses.filter((course) => course.area === activeArea)

    const sorted = [...areaFiltered].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
    return sortOrder === 'asc' ? sorted : sorted.reverse()
  }, [activeArea, courses, sortOrder])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeArea, courses, sortOrder])

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
  }, [activeArea, safeCurrentPage, sortOrder])

  return (
    <section className="lp-grad-carousel" id="pos-graduacao">
      <div className="lp-shell">
        <header className="lp-grad-carousel__head">
          <h2>PÓS-GRADUAÇÕES EAD</h2>
        </header>

        <div className="lp-grad-carousel__filters" role="tablist" aria-label="Filtrar cursos por área">
          {areaOptions.map((area) => (
            <button
              key={area}
              type="button"
              role="tab"
              aria-selected={activeArea === area}
              className={`lp-grad-carousel__filter ${activeArea === area ? 'is-active' : ''}`}
              onClick={() => setActiveArea(area)}
            >
              {area === ALL_AREAS ? 'TODAS' : area}
            </button>
          ))}
        </div>

        <div className="lp-grad-carousel__divider" aria-hidden="true" />

        {paginatedCourses.length ? (
          <>
            <div className="lp-grad-carousel__sections">
              <section className="lp-grad-carousel__area-section">
                <div className="lp-grad-carousel__scope-row">
                  <p className="lp-grad-carousel__scope">{scopeLabel}</p>

                  <button
                    type="button"
                    className="lp-grad-carousel__sort"
                    aria-label={sortOrder === 'asc' ? 'Ordenar cursos de Z a A' : 'Ordenar cursos de A a Z'}
                    onClick={() => setSortOrder((previous) => (previous === 'asc' ? 'desc' : 'asc'))}
                  >
                    <SortFilterIcon />
                    <span>{sortOrder === 'asc' ? 'AZ' : 'ZA'}</span>
                  </button>
                </div>

                <div className="lp-grad-carousel__list" ref={listRef}>
                  {paginatedCourses.map((course) => (
                    <article key={course.courseValue} className="lp-grad-carousel__item">
                      <div className="lp-grad-carousel__content">
                        <div className="lp-grad-carousel__meta">
                          <span>
                            <GraduationLabelIcon />
                            PÓS-GRADUAÇÃO EAD
                          </span>
                          <span>
                            <VideoLabelIcon />
                            COM VIDEOAULAS
                          </span>
                        </div>

                        <h3>{course.title}</h3>

                        <div className="lp-grad-carousel__price">
                          <strong>{course.currentInstallmentPrice}</strong>
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

