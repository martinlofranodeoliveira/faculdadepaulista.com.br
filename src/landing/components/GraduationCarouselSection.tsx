import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { openCourseLeadModal } from '../coursePrefill'
import { fetchPostCoursesRaw } from '../postCourses'

const ALL_AREAS = '__all_areas__'
const COURSES_PER_PAGE = 5

type PostCourse = {
  value: string
  label: string
  url?: string
  courseId?: number
  area: string
  oldInstallmentPrice: string
  currentInstallmentPrice: string
}

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
type SortOrder = 'asc' | 'desc'

function normalizeComparableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function toSlug(value: string): string {
  return normalizeComparableText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeApiValue(line: string): string {
  const separatorIndex = line.indexOf(':')
  if (separatorIndex < 0) return ''
  return line.slice(separatorIndex + 1).trim()
}

function formatApiInstallmentPrice(value: string): string {
  if (!value) return value

  return value
    .replace(/\s+/g, ' ')
    .replace(/(\d+)\s*x\s*/i, '$1X ')
    .replace(/R\$\s*/i, 'R$ ')
    .trim()
    .toUpperCase()
}

function fallbackOldInstallmentPrice(): string {
  return '18X R$ 132,00'
}

function fallbackCurrentInstallmentPrice(): string {
  return '18X R$ 66,00'
}

function extractIntegerFromBlock(block: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = block.match(pattern)?.[1]?.trim()
    if (!match) continue

    const parsed = Number.parseInt(match, 10)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function parsePostGraduationCourses(raw: string): PostCourse[] {
  const blocks = raw.split(/\r?\n---\r?\n/g)
  const unique = new Map<string, PostCourse>()

  blocks.forEach((block) => {
    const lines = block
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter(Boolean)

    let disponibilidade = ''
    let nivel = ''
    let nomeCurso = ''
    let nomeArea = ''
    let urlCurso = ''
    let precoDe = ''
    let precoPor = ''

    lines.forEach((line) => {
      const normalizedLine = normalizeComparableText(line)

      if (normalizedLine.startsWith('disponibilidade:')) {
        disponibilidade = normalizeApiValue(line)
        return
      }

      if (normalizedLine.startsWith('nivel:') || normalizedLine.startsWith('nivel :')) {
        nivel = normalizeApiValue(line)
        return
      }

      if (normalizedLine.startsWith('nome do curso:')) {
        nomeCurso = normalizeApiValue(line)
        return
      }

      if (normalizedLine.startsWith('nome area:')) {
        nomeArea = normalizeApiValue(line)
        return
      }

      if (normalizedLine.startsWith('url curso:')) {
        urlCurso = normalizeApiValue(line)
        return
      }

      if (normalizedLine.startsWith('de:')) {
        precoDe = normalizeApiValue(line)
        return
      }

      if (normalizedLine.startsWith('por:')) {
        precoPor = normalizeApiValue(line)
      }
    })

    if (!disponibilidade || !nivel || !nomeCurso || !urlCurso) return

    const disponibilidadeNormalizada = normalizeComparableText(disponibilidade)
    const nivelNormalizado = normalizeComparableText(nivel)

    if (!disponibilidadeNormalizada.includes('disponivel')) return
    if (!nivelNormalizado.includes('pos-graduacao') && !nivelNormalizado.includes('pos graduacao')) {
      return
    }

    const courseName = nomeCurso.replace(/\s+/g, ' ').trim()

    let slug = ''
    try {
      const parsedUrl = new URL(urlCurso)
      const segments = parsedUrl.pathname.split('/').filter(Boolean)
      slug = segments[segments.length - 1] ?? ''
    } catch {
      slug = ''
    }

    if (!slug) slug = toSlug(courseName)
    if (!slug) return

    const value = `pos-${slug}`
    const area = (nomeArea || 'GERAL').replace(/\s+/g, ' ').trim().toUpperCase()
    const courseId = extractIntegerFromBlock(block, [
      /ID\s*(?:do\s*)?Curso:\s*(\d+)/i,
      /id\s*curso:\s*(\d+)/i,
      /idcurso:\s*(\d+)/i,
      /curso\s*id:\s*(\d+)/i,
    ])

    if (!unique.has(value)) {
      unique.set(value, {
        value,
        label: courseName,
        url: urlCurso,
        courseId,
        area,
        oldInstallmentPrice: formatApiInstallmentPrice(precoDe) || fallbackOldInstallmentPrice(),
        currentInstallmentPrice:
          formatApiInstallmentPrice(precoPor) || fallbackCurrentInstallmentPrice(),
      })
    }
  })

  return [...unique.values()].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))
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
      <path
        d="M3.33301 5H16.6663"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.83301 10H14.1663"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.33301 15H11.6663"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GraduationCarouselSection() {
  const [courses, setCourses] = useState<PostCourse[]>([])
  const [status, setStatus] = useState<LoadStatus>('idle')
  const [shouldLoadCourses, setShouldLoadCourses] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    'Não foi possível carregar os cursos de pós-graduação.',
  )
  const [activeArea, setActiveArea] = useState(ALL_AREAS)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const sectionRef = useRef<HTMLElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const loadPostCourses = useCallback(async (force = false) => {
    setStatus('loading')
    setErrorMessage('Não foi possível carregar os cursos de pós-graduação.')

    try {
      const rawText = await fetchPostCoursesRaw(force)
      const parsedCourses = parsePostGraduationCourses(rawText)

      if (!parsedCourses.length) {
        throw new Error('No post-graduation courses were parsed from the API response')
      }

      setCourses(parsedCourses)
      setStatus('success')
    } catch (error) {
      console.error('Erro ao carregar cursos de pós-graduação:', error)
      setStatus('error')
      setErrorMessage('Não foi possível carregar os cursos agora. Tente novamente em instantes.')
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadCourses(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setShouldLoadCourses(true)
        observer.disconnect()
      },
      { rootMargin: '320px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoadCourses || status !== 'idle') return
    void loadPostCourses()
  }, [loadPostCourses, shouldLoadCourses, status])

  const areaOptions = useMemo(() => {
    const uniqueAreas = [...new Set(courses.map((course) => course.area))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))

    return [ALL_AREAS, ...uniqueAreas]
  }, [courses])

  const filteredCourses = useMemo(() => {
    const areaFiltered =
      activeArea === ALL_AREAS
        ? courses
        : courses.filter((course) => course.area === activeArea)

    const sorted = [...areaFiltered].sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))
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

  const shownCoursesCount = paginatedCourses.length
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
    <section className="lp-grad-carousel" id="pos-graduacao" ref={sectionRef}>
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

        {status === 'loading' ? (
          <div className="lp-grad-carousel__state">Carregando cursos de pós-graduação...</div>
        ) : null}

        {status === 'error' ? (
          <div className="lp-grad-carousel__state lp-grad-carousel__state--error">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="lp-grad-carousel__retry"
              onClick={() => void loadPostCourses(true)}
            >
              Tentar novamente
            </button>
          </div>
        ) : null}

        {status === 'success' ? (
          <>
            {paginatedCourses.length ? (
              <div className="lp-grad-carousel__sections">
                <section className="lp-grad-carousel__area-section">
                  <div className="lp-grad-carousel__scope-row">
                    <p className="lp-grad-carousel__scope">{scopeLabel}</p>

                    <button
                      type="button"
                      className="lp-grad-carousel__sort"
                      aria-label={
                        sortOrder === 'asc'
                          ? 'Ordenar cursos de Z a A'
                          : 'Ordenar cursos de A a Z'
                      }
                      onClick={() =>
                        setSortOrder((previous) => (previous === 'asc' ? 'desc' : 'asc'))
                      }
                    >
                      <SortFilterIcon />
                      <span>{sortOrder === 'asc' ? 'AZ' : 'ZA'}</span>
                    </button>
                  </div>

                  <div className="lp-grad-carousel__list" ref={listRef}>
                    {paginatedCourses.map((course) => (
                      <article key={course.value} className="lp-grad-carousel__item">
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

                          <h3>{course.label}</h3>

                          <div className="lp-grad-carousel__price">
                            <strong>{course.currentInstallmentPrice}/MÊS</strong>
                            <span>{course.oldInstallmentPrice}</span>
                          </div>
                        </div>

                        <a
                          href="#inscricao"
                          className="lp-grad-carousel__cta"
                          onClick={(event) => {
                            event.preventDefault()
                            openCourseLeadModal({
                              courseType: 'pos',
                              courseValue: course.value,
                              courseLabel: course.label,
                              courseId: course.courseId,
                            })
                          }}
                        >
                          INSCREVA-SE
                        </a>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="lp-grad-carousel__state">Nenhum curso encontrado para esta área.</div>
            )}

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
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M14.5 5L8 11.5L14.5 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div className="lp-grad-carousel__pages">
                      {visiblePageNumbers.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          className={`lp-grad-carousel__page-number ${
                            safeCurrentPage === pageNumber ? 'is-active' : ''
                          }`}
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
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M9.5 5L16 11.5L9.5 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="lp-grad-carousel__pagination-count">
                    {shownCoursesCount} de {totalCoursesCount} cursos
                  </p>
                </div>

              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  )
}
