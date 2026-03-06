import './thankyou.css'

function ArrowForwardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThankYouPage() {
  return (
    <main className="lp-thanks-page">
      <div className="lp-thanks-page__inner">
        <section className="lp-thanks-card" aria-labelledby="lp-thanks-title">
          <img
            className="lp-thanks-card__logo"
            src="/landing/logo-faculdade-paulista-v2.webp"
            alt="Faculdade Paulista"
          />

          <div className="lp-thanks-card__content">
            <h1 id="lp-thanks-title" className="lp-thanks-title">
              Obrigado
            </h1>
            <p>Nossos Consultores entrarão em contato em breve!</p>
          </div>
        </section>

        <a className="lp-thanks-button" href="/">
          <ArrowForwardIcon />
          <span>Continuar Navegando</span>
        </a>
      </div>
    </main>
  )
}
