import { ArrowRight } from 'lucide-react'

import { testimonials } from '../data'

export function TestimonialsSection() {
  return (
    <section className="lp-stories" id="depoimentos">
      <div className="lp-shell">
        <header className="lp-stories__head">
          <p>QUEM VIVE A PAULISTA RECOMENDA</p>
          <h2>
            DEPOIMENTOS DE QUEM
            <br />
            JÁ TRANSFORMOU <span>A CARREIRA</span>
          </h2>
          <small>
            Resultados reais de alunos e ex-alunos que conquistaram novas oportunidades
            com o apoio da nossa metodologia.
          </small>
        </header>

        <div className="lp-stories__grid">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={`lp-story-card ${index % 3 === 1 ? 'lp-story-card--offset' : ''}`}
            >
              <div className="lp-story-card__stars">★★★★★</div>
              <p>{item.text}</p>
              <div className="lp-story-card__person">
                <img src={item.avatar} alt={item.name} />
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
