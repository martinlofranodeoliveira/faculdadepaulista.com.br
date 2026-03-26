import { useEffect, useMemo, useState, type ChangeEvent } from 'react'

import { normalizeComparableText } from '@/lib/courseRoutes'

import type { PostCategoryCourse } from '../postCategoryData'

type Props = {
  courses: PostCategoryCourse[]
}

type FilterOptionItem = {
  value: string
  label: string
}

const PAGE_SIZE_DESKTOP = 4
const PAGE_SIZE_MOBILE = 20
const modalityPriority: Record<string, number> = {
  all: 0,
  ead: 1,
  semipresencial: 2,
  presencial: 3,
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.875 18.75a7.875 7.875 0 1 1 0-15.75 7.875 7.875 0 0 1 0 15.75Zm9.375 1.5-5.363-5.363"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none">
      <path
        d="M12 13h16M16 20h8M19 27h2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function SchoolIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 29 29" fill="none">
      <path
        d="m14.228 4.4 10.018 5.01-10.018 5.008L4.21 9.41 14.228 4.4Zm7.511 7.428v4.007c0 .623-.332 1.19-.87 1.488-1.454.807-3.927 1.818-6.64 1.818-2.712 0-5.185-1.01-6.639-1.818a1.698 1.698 0 0 1-.871-1.488v-4.007l7.509 3.754 7.511-3.754Zm3.34-.835v7.512h-1.67v-7.512h1.67Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PaginationIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d={direction === 'prev' ? 'm12.5 4.5-5 5 5 5' : 'm7.5 4.5 5 5-5 5'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

type FilterOptionProps = {
  checked: boolean
  label: string
  onClick: () => void
}

function FilterOption({ checked, label, onClick }: FilterOptionProps) {
  return (
    <button
      className="category-page__filter-option"
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onClick}
    >
      <span
        className={`category-page__filter-box${checked ? ' is-checked' : ''}`}
        aria-hidden="true"
      >
        {checked ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m5.5 12.5 4.2 4.2 8.8-8.8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.1"
            />
          </svg>
        ) : null}
      </span>
      <span>{label}</span>
    </button>
  )
}

export function PostCategoryExplorer({ courses }: Props) {
  const [search, setSearch] = useState('')
  const [modality, setModality] = useState('all')
  const [area, setArea] = useState('all')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 720px)')

    const syncPageSize = () => {
      setPageSize(mediaQuery.matches ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP)
    }

    syncPageSize()

    mediaQuery.addEventListener('change', syncPageSize)
    return () => mediaQuery.removeEventListener('change', syncPageSize)
  }, [])

  const modalityOptions = useMemo<FilterOptionItem[]>(() => {
    const dynamicOptions = [...new Set(courses.map((course) => course.modality).filter(Boolean))]
      .sort((a, b) => (modalityPriority[a] ?? 99) - (modalityPriority[b] ?? 99))
      .map((value) => ({
        value,
        label:
          value === 'ead'
            ? 'EAD'
            : value === 'semipresencial'
              ? 'Semipresencial'
              : value === 'presencial'
                ? 'Presencial'
                : value,
      }))

    return [{ value: 'all', label: 'Tudo' }, ...dynamicOptions]
  }, [courses])

  const areaOptions = useMemo<FilterOptionItem[]>(() => {
    const dynamicOptions = [...new Set(courses.map((course) => course.areaLabel).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
      .map((label) => {
        const match = courses.find((course) => course.areaLabel === label)
        return {
          value: match?.area ?? label,
          label,
        }
      })

    return [{ value: 'all', label: 'Todas' }, ...dynamicOptions]
  }, [courses])

  const filteredCourses = useMemo(() => {
    const normalizedSearch = normalizeComparableText(search)

    return courses.filter((course) => {
      if (modality !== 'all' && course.modality !== modality) return false
      if (area !== 'all' && course.area !== area) return false
      if (!normalizedSearch) return true

      return normalizeComparableText(course.title).includes(normalizedSearch)
    })
  }, [area, courses, modality, search])

  useEffect(() => {
    setPage(1)
  }, [area, modality, pageSize, search])

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageStart = filteredCourses.length === 0 ? 0 : (safePage - 1) * pageSize
  const pageItems = filteredCourses.slice(pageStart, pageStart + pageSize)
  const rangeStart = filteredCourses.length === 0 ? 0 : pageStart + 1
  const rangeEnd = Math.min(pageStart + pageSize, filteredCourses.length)

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  function handlePreviousPage() {
    setPage((current) => Math.max(1, current - 1))
  }

  function handleNextPage() {
    setPage((current) => Math.min(totalPages, current + 1))
  }

  return (
    <>
      <section className="category-page__grad-heading category-page__grad-heading--post">
        <h1>Todas as pós-graduações</h1>

        <div className="category-page__search-row">
          <label className="category-page__search" aria-label="Buscar curso de pós-graduação">
            <SearchIcon />
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Busque aqui seu curso"
            />
          </label>

          <button
            className="category-page__mobile-filter-toggle"
            type="button"
            aria-label={mobileFiltersOpen ? 'Fechar filtros' : 'Abrir filtros'}
            aria-expanded={mobileFiltersOpen}
            aria-controls="post-category-filters"
            onClick={() => setMobileFiltersOpen((current) => !current)}
          >
            <FilterIcon />
          </button>
        </div>
      </section>

      <section className="category-page__post-content">
        <aside
          id="post-category-filters"
          className={`category-page__filters${mobileFiltersOpen ? ' is-open' : ''}`}
          aria-label="Filtros de pós-graduação"
        >
          <div className="category-page__filter-card">
            <h2>Tipo de Curso</h2>
            <div className="category-page__filter-group" role="radiogroup" aria-label="Tipo de Curso">
              {modalityOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  checked={modality === option.value}
                  label={option.label}
                  onClick={() => setModality(option.value)}
                />
              ))}
            </div>
          </div>

          <div className="category-page__filter-card">
            <h2>Área do Conhecimento</h2>
            <div
              className="category-page__filter-group"
              role="radiogroup"
              aria-label="Área do Conhecimento"
            >
              {areaOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  checked={area === option.value}
                  label={option.label}
                  onClick={() => setArea(option.value)}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="category-page__post-results">
          <div className="category-page__post-results-head">
            <span className="category-page__post-results-label">Paginação</span>

            <div className="category-page__post-pagination">
              <span>
                {rangeStart}-{rangeEnd} de {filteredCourses.length}
              </span>

              <div className="category-page__post-pagination-controls">
                <button
                  type="button"
                  className={safePage === 1 ? 'is-muted' : undefined}
                  onClick={handlePreviousPage}
                  disabled={safePage === 1}
                  aria-label="Página anterior"
                >
                  <PaginationIcon direction="prev" />
                </button>
                <button
                  type="button"
                  className={safePage === totalPages ? 'is-muted' : undefined}
                  onClick={handleNextPage}
                  disabled={safePage === totalPages}
                  aria-label="Próxima página"
                >
                  <PaginationIcon direction="next" />
                </button>
              </div>
            </div>
          </div>

          {pageItems.length > 0 ? (
            <div className="category-page__post-list">
              {pageItems.map((course) => (
                <article className="category-page__post-card" key={course.path}>
                  <a className="category-page__post-card-image" href={course.path}>
                    <img
                      src={course.image}
                      alt={course.title}
                      width="217"
                      height="137"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>

                  <div className="category-page__post-card-content">
                    <div className="category-page__post-card-badges">
                      <span className="category-page__post-card-badge category-page__post-card-badge--school">
                        <SchoolIcon />
                        <span>Reconhecido MEC</span>
                      </span>
                    </div>

                    <h2>{course.title}</h2>

                    <div className="category-page__post-card-pricing">
                      <strong>{course.currentInstallmentPrice}</strong>
                      {course.oldInstallmentPrice ? <span>{course.oldInstallmentPrice}</span> : null}
                    </div>
                  </div>

                  <a className="category-page__post-card-cta" href={course.path}>
                    Inscreva-se
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="category-page__empty">
              <h2>Nenhuma pós-graduação encontrada</h2>
              <p>Refine sua busca ou limpe os filtros para visualizar outros cursos.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default PostCategoryExplorer
