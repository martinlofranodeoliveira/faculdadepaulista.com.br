import type { ReactNode } from 'react'

import { emitCoursePrefill } from '../coursePrefill'

type PresentialCourseHighlight = {
  id: string
  courseValue: string
  courseLabel: string
  title: string
  mode: string
  image: string
  imageAlt: string
  imageClassName?: string
  imagePosition?: string
  startDate: string
  location: string
  benefits: [string, string, string, string]
  currentPrice: string
  originalPrice: string
}

const presentialCourses: PresentialCourseHighlight[] = [
  {
    id: 'enfermagem',
    courseValue: 'graduacao-enfermagem',
    courseLabel: 'Enfermagem Presencial',
    title: 'Enfermagem',
    mode: 'Bacharelado Presencial',
    image: '/landing/presential-enfermagem-figma.jpg',
    imageAlt: 'Estudante de enfermagem em ambiente de prática',
    imageClassName: 'is-wide',
    startDate: 'Início das aulas: 01/07/26',
    location: '200m do Metro Belém | SP',
    benefits: [
      'Estágio no 1 Semestre',
      'Ganhe Grátis Cursos EAD',
      'Laboratório Moderno',
      'Laboratório Moderno',
    ],
    currentPrice: 'R$ 799,90 /Mês',
    originalPrice: 'R$ 1.099,90',
  },
  {
    id: 'psicologia',
    courseValue: 'graduacao-psicologia',
    courseLabel: 'Psicologia Presencial',
    title: 'Psicologia',
    mode: 'Bacharelado Presencial',
    image: '/landing/presential-psicologia-figma.jpg',
    imageAlt: 'Estudante de psicologia em atividade acadêmica',
    imageClassName: 'is-compact',
    startDate: 'Início das aulas: 01/07/26',
    location: '200m do Metro Belém | SP',
    benefits: [
      'Estágio no 1 Semestre',
      'Ganhe Grátis Cursos EAD',
      'Laboratório Moderno',
      'Laboratório Moderno',
    ],
    currentPrice: 'R$ 799,90 /Mês',
    originalPrice: 'R$ 1.099,90',
  },
]

function PresentialModeIcon() {
  return (
    <svg
      width="18"
      height="15"
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
        <h2>GRADUAÇÃO PRESENCIAL</h2>

        <div className="lp-presential__grid">
          {presentialCourses.map((course) => (
            <article key={course.id} className="lp-presential-card">
              <div className={`lp-presential-card__image ${course.imageClassName ?? ''}`}>
                <img
                  src={course.image}
                  alt={course.imageAlt}
                  style={course.imagePosition ? { objectPosition: course.imagePosition } : undefined}
                />
              </div>

              <div className="lp-presential-card__content">
                <div className="lp-presential-card__head">
                  <span className="lp-presential-card__start">{course.startDate}</span>
                  <h3>{course.title}</h3>
                  <span className="lp-presential-card__mode">
                    <PresentialModeIcon />
                    {course.mode}
                  </span>
                </div>

                <p className="lp-presential-card__location">
                  <strong>Local:</strong> {course.location}
                </p>

                <ul className="lp-presential-card__benefits">
                  <BenefitItem>{course.benefits[0]}</BenefitItem>
                  <BenefitItem>{course.benefits[1]}</BenefitItem>
                  <BenefitItem>{course.benefits[2]}</BenefitItem>
                  <BenefitItem>{course.benefits[3]}</BenefitItem>
                </ul>

                <div className="lp-presential-card__price">
                  <strong>{course.currentPrice}</strong>
                  <span>de {course.originalPrice}</span>
                </div>

                <a
                  href="#inscricao"
                  className="lp-presential-card__cta"
                  onClick={() =>
                    emitCoursePrefill({
                      courseType: 'graduacao',
                      courseValue: course.courseValue,
                      courseLabel: course.courseLabel,
                    })
                  }
                >
                  SAIBA MAIS
                  <ArrowForwardIcon />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
