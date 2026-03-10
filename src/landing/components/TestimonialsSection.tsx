import { ArrowRight } from 'lucide-react'

import { testimonials } from '../data'

export function TestimonialsSection() {
  return (
    <section className="lp-stories" id="depoimentos">
      <div className="lp-shell">
        <header className="lp-stories__head">
          <h2>
            JUNTE-SE A VÁRIOS ALUNOS QUE
            <br />
            TRANSFORMARAM <span>SUAS CARREIRAS</span>
          </h2>
          <small>
            Confira a experiência real de alunos que transformaram sua trajetória com nossas
            graduações e especializações.
          </small>
        </header>

        <div className="lp-stories__grid">
          {testimonials.map((item) => (
            <article key={item.name} className="lp-story-card">
              <span className="lp-visually-hidden">5 de 5 estrelas</span>
              <div className="lp-story-card__stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <img
                    key={`${item.name}-star-${index}`}
                    src="/landing/stories/star-red.svg"
                    alt=""
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p>{item.text}</p>
              <div className="lp-story-card__person">
                <img
                  src={item.avatar}
                  alt={item.name}
                  width="64"
                  height="64"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="lp-stories__cta-wrap">
          <a href="#inscricao" className="lp-main-button lp-main-button--compact">
            Quero me matricular
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
