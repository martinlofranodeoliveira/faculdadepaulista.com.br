export function Header() {
  return (
    <header className="lp-header">
      <div className="lp-shell lp-header__inner">
        <a className="lp-brand lp-brand--header" href="#inicio" aria-label="Faculdade Paulista">
          <img
            className="lp-brand__logo"
            src="/landing/logo-faculdade-paulista.webp"
            alt="Faculdade Paulista"
          />
        </a>

        <a className="lp-header__cta" href="#inscricao">
          Quero me matricular
        </a>
      </div>
    </header>
  )
}
