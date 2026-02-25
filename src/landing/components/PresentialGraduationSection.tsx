import { ArrowRight } from 'lucide-react'

import { assets } from '../data'

type PresentialCourseHighlight = {
  title: string
  mode: string
  image: string
  imageAlt: string
  imageClassName?: string
  imagePosition?: string
  benefits: string[]
  currentPrice: string
  originalPrice: string
  tag: string
}

const presentialCourses: PresentialCourseHighlight[] = [
  {
    title: 'Enfermagem',
    mode: 'Bacharelado Presencial',
    image: assets.courseEnfermagem,
    imageAlt: 'Aluna de enfermagem em ambiente hospitalar',
    imageClassName: 'is-wide',
    imagePosition: '47% center',
    benefits: ['Estágio no 1 semestre', 'Ganhe Grátis EAD', 'Laboratório Moderno'],
    currentPrice: 'R$ 799,90 /Mês',
    originalPrice: 'R$ 1.099,90',
    tag: 'Fixas até o Final do Curso',
  },
  {
    title: 'Psicologia',
    mode: 'Bacharelado Presencial',
    image: assets.coursePsicologia,
    imageAlt: 'Alunos em atividade de psicologia',
    imageClassName: 'is-compact',
    imagePosition: '20% center',
    benefits: ['Estágio no 1 semestre', 'Ganhe Grátis EAD', 'Laboratório Moderno'],
    currentPrice: 'R$ 799,90 /Mês',
    originalPrice: 'R$ 1.099,90',
    tag: 'Fixas até o Final do Curso',
  },
]

function PresentialModeIcon() {
  return (
    <svg
      width="18"
      height="15"
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 0.75L16.5 4.5V5.55L9 9.3L1.5 5.55V4.5L9 0.75ZM4.125 6.75V9.45C4.125 11.025 6.3 12.3 9 12.3C11.7 12.3 13.875 11.025 13.875 9.45V6.75L9 9.225L4.125 6.75ZM2.25 10.5C2.865 10.5 3.375 10.995 3.375 11.625C3.375 12.24 2.865 12.75 2.25 12.75C1.62 12.75 1.125 12.24 1.125 11.625C1.125 10.995 1.62 10.5 2.25 10.5Z"
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

export function PresentialGraduationSection() {
  return (
    <section className="lp-presential">
      <div className="lp-shell">
        <h2>GRADUAÇÃO PRESENCIAL</h2>

        <div className="lp-presential__grid">
          {presentialCourses.map((course) => (
            <article key={course.title} className="lp-presential-card">
              <div className={`lp-presential-card__image ${course.imageClassName ?? ''}`}>
                <img
                  src={course.image}
                  alt={course.imageAlt}
                  style={course.imagePosition ? { objectPosition: course.imagePosition } : undefined}
                />
              </div>

              <div className="lp-presential-card__content">
                <div className="lp-presential-card__head">
                  <span className="lp-presential-card__mode">
                    <PresentialModeIcon />
                    {course.mode}
                  </span>
                  <h3>{course.title}</h3>
                </div>

                <ul className="lp-presential-card__benefits">
                  {course.benefits.map((benefit) => (
                    <li key={`${course.title}-${benefit}`}>
                      <BenefitCheckIcon />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="lp-presential-card__price">
                  <strong>{course.currentPrice}</strong>
                  <span>{course.originalPrice}</span>
                </div>

                <span className="lp-presential-card__tag">{course.tag}</span>

                <a href="#inscricao" className="lp-presential-card__cta">
                  SAIBA MAIS
                  <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

