import type { ReactNode } from 'react'

import type { LandingPresentialCourse } from '../landingModels'
import { openCourseLeadModal } from '../coursePrefill'

type Props = {
  courses: LandingPresentialCourse[]
}

const PRESENTIAL_ORDINANCES = [
  {
    title: 'PORTARIA ENFERMAGEM',
    description: 'Portaria nº 172, de 25/02/2021, publicado no D.O.U em 26/02/2021.',
  },
  {
    title: 'PORTARIA PSICOLOGIA',
    description: 'Portaria nº 172, de 25/02/2021, publicado no D.O.U em 26/02/2021.',
  },
] as const

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

export function PresentialGraduationSection({ courses }: Props) {
  return (
    <section className="lp-presential" id="graduacao">
      <div className="lp-shell">
        <div className="lp-presential__head">
          <h2>GRADUAÇÃO PRESENCIAL</h2>
        </div>
      </div>

      <div className="lp-presential__ordinances-band">
        <div className="lp-shell">
          <div className="lp-presential__ordinances" aria-label="Portarias dos cursos presenciais">
            <div className="lp-presential__ordinances-brand">
              <img
                src="/landing/faculdade-unicesp-portaria.webp"
                alt="Faculdade Unicesp"
                width="243"
                height="77"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="lp-presential__ordinances-divider" aria-hidden="true" />

            <div className="lp-presential__ordinances-list">
              {PRESENTIAL_ORDINANCES.map((ordinance) => (
                <div key={ordinance.title} className="lp-presential__ordinance">
                  <span className="lp-presential__ordinance-tag">{ordinance.title}</span>
                  <p>{ordinance.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lp-shell">
        <div className="lp-presential__grid">
          {courses.map((course) => (
            <article key={course.id} className={`lp-presential-card ${course.cardClassName ?? ''}`}>
              <div className={`lp-presential-card__image ${course.imageClassName ?? ''}`}>
                <img
                  src={course.image}
                  alt={course.imageAlt}
                  width={course.imageWidth ?? 252}
                  height={course.imageHeight ?? 423}
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
                  <BenefitItem>
                    Estágio no <strong>1º semestre</strong>
                  </BenefitItem>
                  <BenefitItem>
                    <strong>Ganhe +1</strong> graduação EAD
                  </BenefitItem>
                </ul>

                <div className="lp-presential-card__footer">
                  <div className="lp-presential-card__price">
                    {course.originalPriceLabel ? (
                      <span className="lp-presential-card__price-from">{course.originalPriceLabel}</span>
                    ) : null}
                    <strong className="lp-presential-card__price-current">{course.currentPrice}</strong>
                  </div>

                  <a
                    href="#inscricao"
                    className="lp-presential-card__cta"
                    onClick={(event) => {
                      event.preventDefault()
                      openCourseLeadModal({
                        courseType: 'graduacao',
                        courseModality: 'presencial',
                        courseValue: course.courseValue,
                        courseLabel: course.courseLabel,
                        courseId: course.courseId,
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

