import { ChevronDown } from 'lucide-react'

import { faqItems } from '../data'

export function FaqSection() {
  return (
    <section className="lp-faq">
      <div className="lp-shell lp-faq__inner">
        <h2>Dúvidas Frequentes</h2>
        <p>
          Separamos as perguntas mais comuns para te ajudar a tomar a melhor decisão.
        </p>
        <div className="lp-faq__list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>
                <span>{item.question}</span>
                <ChevronDown size={14} />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
