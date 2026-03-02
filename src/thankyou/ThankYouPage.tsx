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
        <img
          className="lp-thanks-page__logo"
          src="/landing/logo-faculdade-paulista-v2.webp"
          alt="Faculdade Paulista"
        />

        <section className="lp-thanks-card" aria-labelledby="lp-thanks-title">
          <h1 id="lp-thanks-title" className="lp-thanks-title">
            <span className="lp-thanks-title__shadow">Obrigado</span>
            <span className="lp-thanks-title__main">Obrigado</span>
          </h1>
          <p>Nossos consultores entrarão em contato em breve!</p>
        </section>

        <a className="lp-thanks-button" href="/">
          <ArrowForwardIcon />
          <span>Continuar Navegando</span>
        </a>
      </div>
    </main>
  )
}

