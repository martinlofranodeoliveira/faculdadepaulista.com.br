import { useId } from 'react'
import { ArrowRight } from 'lucide-react'

import { graduationCarouselCourses } from '../data'

function GraduationLabelIcon() {
  const maskId = useId()

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <mask
        id={maskId}
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="-1"
        y="0"
        width="29"
        height="29"
      >
        <rect x="-0.948242" width="28.4555" height="28.4555" fill="#D9D9D9" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M23.9503 20.1559V11.975L13.2794 17.7847L0.237305 10.6708L13.2794 3.55688L26.3215 10.6708V20.1559H23.9503ZM13.2794 24.8985L4.97989 20.3931V14.4648L13.2794 18.9703L21.579 14.4648V20.3931L13.2794 24.8985Z"
          fill="black"
        />
      </g>
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
        fill="black"
      />
    </svg>
  )
}

export function GraduationCarouselSection() {
  return (
    <section className="lp-grad-carousel" id="graduacao">
      <div className="lp-shell">
        <header className="lp-grad-carousel__head">
          <h2>GRADUAÇÕES</h2>
          <p>Explore nossos cursos e encontre o caminho ideal para sua carreira.</p>
        </header>

        <div className="lp-grad-carousel__list">
          {graduationCarouselCourses.map((course) => (
            <article key={course.courseValue} className="lp-grad-carousel__item">
              <div className="lp-grad-carousel__image-wrap">
                <img
                  src={course.image}
                  alt={course.title}
                  style={course.imagePosition ? { objectPosition: course.imagePosition } : undefined}
                />
              </div>

              <div className="lp-grad-carousel__content">
                <div className="lp-grad-carousel__meta">
                  <span>
                    <GraduationLabelIcon />
                    {course.modalityLabel}
                  </span>
                  <span>
                    <VideoLabelIcon />
                    {course.videoLabel}
                  </span>
                </div>

                <h3>{course.title}</h3>

                <div className="lp-grad-carousel__price">
                  <strong>{course.installmentPrice}</strong>
                  <span>{course.oldInstallmentPrice}</span>
                </div>
              </div>

              <a href="#inscricao" className="lp-grad-carousel__cta">
                ME INSCREVER
                <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
