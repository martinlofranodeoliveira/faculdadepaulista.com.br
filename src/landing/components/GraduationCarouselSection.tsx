import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUpDown } from 'lucide-react'

import { emitCoursePrefill } from '../coursePrefill'

const POS_COURSES_ENDPOINT =
  import.meta.env.VITE_POS_COURSES_ENDPOINT ??
  '/fasul-courses-api/rotinas/cursos-ia-format-texto-2025-unicesp.php'

const ALL_AREAS = '__all_areas__'

type PostCourse = {
  value: string
  label: string
  url?: string
  area: string
  oldInstallmentPrice: string
  currentInstallmentPrice: string
}

type LoadStatus = 'loading' | 'success' | 'error'

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

    if (!unique.has(value)) {
      unique.set(value, {
        value,
        label: courseName,
        url: urlCurso,
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

export function GraduationCarouselSection() {
  const [courses, setCourses] = useState<PostCourse[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState(
    'Não foi possível carregar os cursos de pós-graduação.',
  )
  const [activeArea, setActiveArea] = useState(ALL_AREAS)
  const [sortAsc, setSortAsc] = useState(true)

  const loadPostCourses = useCallback(async () => {
    setStatus('loading')
    setErrorMessage('Não foi possível carregar os cursos de pós-graduação.')

    try {
      const response = await fetch(POS_COURSES_ENDPOINT, {
        method: 'GET',
        headers: {
          Accept: 'text/plain, */*',
        },
      })

      if (!response.ok) {
        throw new Error(`Post courses request failed with status ${response.status}`)
      }

      const rawText = await response.text()
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
    void loadPostCourses()
  }, [loadPostCourses])

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

    return [...areaFiltered].sort((a, b) =>
      sortAsc
        ? a.label.localeCompare(b.label, 'pt-BR')
        : b.label.localeCompare(a.label, 'pt-BR'),
    )
  }, [activeArea, courses, sortAsc])

  const areaLabel = activeArea === ALL_AREAS ? 'TODAS AS ÁREAS' : activeArea

  return (
    <section className="lp-grad-carousel" id="pos-graduacao">
      <div className="lp-shell">
        <header className="lp-grad-carousel__head">
          <h2>PÓS-GRADUAÇÕES</h2>
          <p>Explore nossos cursos e encontre o caminho ideal para sua carreira.</p>
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

        <div className="lp-grad-carousel__toolbar">
          <p className="lp-grad-carousel__scope">PÓS NA ÁREA DE {areaLabel}</p>
          <button
            type="button"
            className="lp-grad-carousel__sort"
            aria-label={sortAsc ? 'Ordenar de Z a A' : 'Ordenar de A a Z'}
            onClick={() => setSortAsc((previous) => !previous)}
          >
            <ArrowUpDown size={16} />
            {sortAsc ? 'AZ' : 'ZA'}
          </button>
        </div>

        {status === 'loading' ? (
          <div className="lp-grad-carousel__state">Carregando cursos de pós-graduação...</div>
        ) : null}

        {status === 'error' ? (
          <div className="lp-grad-carousel__state lp-grad-carousel__state--error">
            <span>{errorMessage}</span>
            <button type="button" className="lp-grad-carousel__retry" onClick={() => void loadPostCourses()}>
              Tentar novamente
            </button>
          </div>
        ) : null}

        {status === 'success' ? (
          <div className="lp-grad-carousel__list">
            {filteredCourses.length ? (
              filteredCourses.map((course) => (
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
                    onClick={() =>
                      emitCoursePrefill({
                        courseType: 'pos',
                        courseValue: course.value,
                        courseLabel: course.label,
                      })
                    }
                  >
                    INSCREVA-SE
                  </a>
                </article>
              ))
            ) : (
              <div className="lp-grad-carousel__state">Nenhum curso encontrado para esta área.</div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
