import { ArrowRight } from 'lucide-react'

import { journeySteps } from '../data'

export function JourneySection() {
  return (
    <section className="lp-journey">
      <div className="lp-shell lp-journey__inner">
        <h2>COMECE SUA JORNADA AGORA</h2>
        <p>Siga o passo a passo para garantir sua vaga e transformar o seu futuro.</p>

        <div className="lp-journey__steps">
          {journeySteps.map((step, index) => (
            <article key={step.number}>
              <span className={index === 0 ? 'is-active' : ''}>{step.number}</span>
              <h3>{step.title}</h3>
              <small>{step.subtitle}</small>
            </article>
          ))}
        </div>

        <a href="#inscricao" className="lp-main-button lp-main-button--compact">
          Quero me matricular
          <ArrowRight size={15} />
        </a>
      </div>
    </section>
  )
}
