import type { ReactNode } from 'react'

import { openCourseLeadModal } from '../coursePrefill'

type PresentialCourseHighlight = {
  id: string
  courseValue: string
  courseLabel: string
  title: string
  mode: string
  image: string
  imageAlt: string
  cardClassName?: string
  imageClassName?: string
  imagePosition?: string
  startDate: string
  benefits: ReactNode[]
  currentPrice: string
  originalPriceLabel: string
}

const presentialCourses: PresentialCourseHighlight[] = [
  {
    id: 'enfermagem',
    courseValue: 'graduacao-enfermagem',
    courseLabel: 'Enfermagem Presencial',
    title: 'Enfermagem',
    mode: 'Bacharelado Presencial',
    image: '/landing/presential-enfermagem-figma.webp',
    imageAlt: 'Estudante de enfermagem em ambiente de prática',
    imageClassName: 'is-wide',
    startDate: 'Início das aulas: 01/07/26',
    benefits: [
      <>
        Estágio no <strong>1º Semestre</strong>
      </>,
      <>
        <strong>Ganhe +1</strong> Graduação EAD
      </>,
    ],
    currentPrice: 'R$ 449,00 /Mês',
    originalPriceLabel: 'De R$ 1.890,00',
  },
  {
    id: 'psicologia',
    courseValue: 'graduacao-psicologia',
    courseLabel: 'Psicologia Presencial',
    title: 'Psicologia',
    mode: 'Bacharelado Presencial',
    image: '/landing/presential-psicologia-figma.webp',
    imageAlt: 'Estudante de psicologia em atividade acadêmica',
    cardClassName: 'lp-presential-card--compact-image',
    imageClassName: 'is-compact',
    startDate: 'Início das aulas: 01/07/26',
    benefits: [
      <>
        Estágio no <strong>1º Semestre</strong>
      </>,
      <>
        <strong>Ganhe +1</strong> Graduação EAD
      </>,
    ],
    currentPrice: 'R$ 549,00 /Mês',
    originalPriceLabel: 'De R$ 1.890,00',
  },
]

function PresentialModeIcon() {
  return (
    <svg
      width="19"
      height="15"
      viewBox="0 0 19 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.16667 15L3.33333 11.8333V6.83333L0 5L9.16667 0L18.3333 5V11.6667H16.6667V5.91667L15 6.83333V11.8333L9.16667 15ZM9.16667 8.08333L14.875 5L9.16667 1.91667L3.45833 5L9.16667 8.08333ZM9.16667 13.1042L13.3333 10.8542V7.70833L9.16667 10L5 7.70833V10.8542L9.16667 13.1042Z"
        fill="#C50002"
      />
    </svg>
  )
}

function PresentialLocationIcon() {
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
        d="M12 2C8.13 2 5 5.13 5 9C5 13.92 10.26 19.55 11.33 20.66C11.7 21.04 12.3 21.04 12.67 20.66C13.74 19.55 19 13.92 19 9C19 5.13 15.87 2 12 2ZM12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12Z"
        fill="#C50002"
      />
    </svg>
  )
}

function BenefitCheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#C50002" />
      <path
        d="M8.5 12.4L10.65 14.55L15.5 9.7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowForwardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
        fill="white"
      />
    </svg>
  )
}

function BenefitItem({ children }: { children: ReactNode }) {
  return (
    <li>
      <BenefitCheckIcon />
      <span>{children}</span>
    </li>
  )
}

export function PresentialGraduationSection() {
  return (
    <section className="lp-presential">
      <div className="lp-shell">
        <div className="lp-presential__head">
          <h2>GRADUAÇÃO PRESENCIAL</h2>
          <div className="lp-presential__location">
            <span className="lp-presential__location-icon">
              <PresentialLocationIcon />
            </span>
            <p>
              <strong>Local:</strong> Rua Dr. Diogo de Faria, 66 - Vila Mariana, São Paulo - SP,
              CEP: 04037-000
            </p>
          </div>
        </div>

        <div className="lp-presential__grid">
          {presentialCourses.map((course) => (
            <article
              key={course.id}
              className={`lp-presential-card ${course.cardClassName ?? ''}`}
            >
              <div className={`lp-presential-card__image ${course.imageClassName ?? ''}`}>
                <img
                  src={course.image}
                  alt={course.imageAlt}
                  width="222"
                  height="423"
                  loading="lazy"
                  decoding="async"
                  style={course.imagePosition ? { objectPosition: course.imagePosition } : undefined}
                />
              </div>

              <div className="lp-presential-card__content">
                <div className="lp-presential-card__overview">
                  <span className="lp-presential-card__mode">
                    <PresentialModeIcon />
                    {course.mode}
                  </span>
                  <h3>{course.title}</h3>
                  <span className="lp-presential-card__start">{course.startDate}</span>
                </div>

                <ul className="lp-presential-card__benefits">
                  {course.benefits.map((benefit, index) => (
                    <BenefitItem key={`${course.id}-${index}`}>{benefit}</BenefitItem>
                  ))}
                </ul>

                <div className="lp-presential-card__footer">
                  <div className="lp-presential-card__price">
                    <span className="lp-presential-card__price-from">{course.originalPriceLabel}</span>
                    <strong className="lp-presential-card__price-current">{course.currentPrice}</strong>
                  </div>

                  <a
                    href="#inscricao"
                    className="lp-presential-card__cta"
                    onClick={(event) => {
                      event.preventDefault()
                      openCourseLeadModal({
                        courseType: 'graduacao',
                        courseValue: course.courseValue,
                        courseLabel: course.courseLabel,
                      })
                    }}
                  >
                    SAIBA MAIS
                    <ArrowForwardIcon />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


