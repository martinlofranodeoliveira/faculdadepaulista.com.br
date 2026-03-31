import { useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'

import { normalizeComparableText } from '@/lib/courseRoutes'

import type { GraduationCategoryCourse } from '../graduationCategoryData'

type Props = {
  courses: GraduationCategoryCourse[]
}

type FilterOptionItem = {
  value: string
  label: string
}

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
      role="checkbox"
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

export function GraduationCategoryExplorer({ courses }: Props) {
  const [search, setSearch] = useState('')
  const [selectedModalities, setSelectedModalities] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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
      if (selectedModalities.length > 0 && !selectedModalities.includes(course.modality)) return false
      if (selectedAreas.length > 0 && !selectedAreas.includes(course.area)) return false
      if (!normalizedSearch) return true

      return normalizeComparableText(course.title).includes(normalizedSearch)
    })
  }, [courses, search, selectedAreas, selectedModalities])

  function toggleFilterValue(
    value: string,
    setState: Dispatch<SetStateAction<string[]>>,
  ) {
    setState((current) => {
      if (value === 'all') return []
      return current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    })
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  return (
    <>
      <section className="category-page__grad-heading">
        <h1>Todas as graduações</h1>

        <div className="category-page__search-row">
          <label className="category-page__search" aria-label="Buscar curso de graduação">
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
            aria-controls="graduation-category-filters"
            onClick={() => setMobileFiltersOpen((current) => !current)}
          >
            <FilterIcon />
          </button>
        </div>
      </section>

      <section className="category-page__grad-content">
        <aside
          id="graduation-category-filters"
          className={`category-page__filters${mobileFiltersOpen ? ' is-open' : ''}`}
          aria-label="Filtros de graduação"
        >
          <div className="category-page__filter-card">
            <h2>Tipo de Curso</h2>
            <div className="category-page__filter-group" aria-label="Tipo de Curso">
              {modalityOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  checked={
                    option.value === 'all'
                      ? selectedModalities.length === 0
                      : selectedModalities.includes(option.value)
                  }
                  label={option.label}
                  onClick={() => toggleFilterValue(option.value, setSelectedModalities)}
                />
              ))}
            </div>
          </div>

          <div className="category-page__filter-card">
            <h2>Área do Conhecimento</h2>
            <div
              className="category-page__filter-group"
              aria-label="Área do Conhecimento"
            >
              {areaOptions.map((option) => (
                <FilterOption
                  key={option.value}
                  checked={
                    option.value === 'all'
                      ? selectedAreas.length === 0
                      : selectedAreas.includes(option.value)
                  }
                  label={option.label}
                  onClick={() => toggleFilterValue(option.value, setSelectedAreas)}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="category-page__results">
          {filteredCourses.length > 0 ? (
            <div className="category-page__course-grid">
              {filteredCourses.map((course) => (
                <article className="category-page__course-card" key={course.path}>
                  <a className="category-page__course-image-link" href={course.path}>
                    <img
                      src={course.image}
                      alt={course.title}
                      width="290"
                      height="132"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>

                  <div className="category-page__course-body">
                    <h3>{course.title}</h3>

                    <div className="category-page__course-tags">
                      <span className="category-page__course-tag">Reconhecido MEC</span>
                      <span className="category-page__course-tag">{course.modalityBadge}</span>
                    </div>

                    <div className="category-page__course-pricing">
                      {course.oldInstallmentPrice ? (
                        <p className="category-page__course-old-price">De: {course.oldInstallmentPrice}</p>
                      ) : null}

                      <div className="category-page__course-current-row">
                        <p className="category-page__course-current-price">Por: {course.installmentPrice}</p>

                        {course.fixedInstallments ? (
                          <span className="category-page__course-fixed">Fixos</span>
                        ) : null}
                      </div>
                    </div>

                    <a className="category-page__course-cta" href={course.path}>
                      Inscreva-se
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="category-page__empty">
              <h2>Nenhum curso encontrado</h2>
              <p>Refine sua busca ou limpe os filtros para visualizar outras graduações.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default GraduationCategoryExplorer

