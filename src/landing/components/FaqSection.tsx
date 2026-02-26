import { faqItems } from '../data'

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
              <p className="lp-faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
