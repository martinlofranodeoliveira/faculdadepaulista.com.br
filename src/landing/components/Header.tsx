export function Header() {
  return (
    <header className="lp-header">
      <div className="lp-shell lp-header__inner">
        <div className="lp-header__brands" aria-label="Marcas da Faculdade Paulista">
          <a className="lp-brand lp-brand--header" href="#inicio" aria-label="Faculdade Paulista">
            <img
              className="lp-brand__logo lp-brand__logo--header"
              src="/landing/logo-faculdade-paulista-v2.webp"
              alt="Faculdade Paulista"
            />
          </a>

          <span className="lp-header__divider" aria-hidden="true" />

          <img
            className="lp-header__partner-logo lp-header__partner-logo--unicesp"
            src="/landing/unicesp-logo.webp"
            alt="UNICESP"
          />

          <span className="lp-header__divider" aria-hidden="true" />

          <img
            className="lp-header__partner-logo lp-header__partner-logo--fasul"
            src="/landing/fasul-logo.webp"
            alt="FASUL"
          />
        </div>

        <a className="lp-header__cta" href="#inscricao">
          Quero me matricular
        </a>
      </div>
    </header>
  )
}
