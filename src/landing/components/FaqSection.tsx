import { Fragment } from 'react'

import { faqItems } from '../data'

function renderAnswerWithHighlights(answer: string) {
  const lines = answer.split('\n')

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\*\*.*?\*\*)/g)

    return (
      <Fragment key={`faq-line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          const isBoldToken = part.startsWith('**') && part.endsWith('**') && part.length > 4

          if (isBoldToken) {
            return <strong key={`faq-bold-${lineIndex}-${partIndex}`}>{part.slice(2, -2)}</strong>
          }

          return <Fragment key={`faq-text-${lineIndex}-${partIndex}`}>{part}</Fragment>
        })}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </Fragment>
    )
  })
}

export function FaqSection() {
  return (
    <section className="lp-faq">
      <div className="lp-shell lp-faq__inner">
        <h2>Dúvidas Frequentes</h2>
        <div className="lp-faq__list">
          {faqItems.map((item) => (
            <details key={item.question} className="lp-faq__item">
              <summary className="lp-faq__summary">
                <span className="lp-faq__question">{item.question}</span>
                <img
                  src="/landing/faq-chevron.svg"
                  alt=""
                  aria-hidden="true"
                  className="lp-faq__chevron"
                />
              </summary>
              <p className="lp-faq__answer">{renderAnswerWithHighlights(item.answer)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
