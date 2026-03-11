import { Fragment } from 'react'

const headerNavItems = [
  { label: 'Graduação Presencial', href: '#graduacao', hasChevron: true },
  { label: 'Graduação Semipresencial e EAD', href: '#graduacao-online', hasChevron: true },
  { label: 'Pós-graduação EAD', href: '#pos-graduacao', hasChevron: true },
  { label: 'Fale conosco', href: '#contato', hasChevron: false },
] as const

const headerPartnerLogos = [
  {
    className: 'lp-header__partner-logo--fasul-group',
    src: '/landing/logo-grupo-fasul-educacional.webp',
    alt: 'Grupo FASUL Educacional',
    width: 206,
    height: 44,
  },
  {
    className: 'lp-header__partner-logo--unicesp',
    src: '/landing/logo-faculdade-unicesp.webp',
    alt: 'Faculdade UNICESP',
    width: 126,
    height: 44,
  },
  {
    className: 'lp-header__partner-logo--enfermagem',
    src: '/landing/logo-faculdade-de-enfermagem.webp',
    alt: 'Faculdade de Enfermagem',
    width: 155,
    height: 44,
  },
  {
    className: 'lp-header__partner-logo--psicologia',
    src: '/landing/logo-faculdade-de-psicologia.webp',
    alt: 'Faculdade de Psicologia',
    width: 185,
    height: 44,
  },
]

export function Header() {
  return (
    <header className="lp-header">
      <div className="lp-shell lp-header__inner">
        <div className="lp-header__brands" aria-label="Marcas da Faculdade Paulista">
          <a className="lp-brand lp-brand--header" href="/" aria-label="Faculdade Paulista">
            <img
              className="lp-brand__logo lp-brand__logo--header"
              src="/landing/logo-faculdade-paulista-v2.webp"
              alt="Faculdade Paulista"
              width="144"
              height="46"
            />
          </a>

          <span className="lp-header__divider" aria-hidden="true" />
          <div className="lp-header__partners" aria-label="Instituicoes do grupo">
            {headerPartnerLogos.map((logo, index) => (
              <Fragment key={logo.src}>
                {index > 0 ? (
                  <span
                    className="lp-header__divider lp-header__divider--partner"
                    aria-hidden="true"
                  />
                ) : null}

                <div className="lp-header__partner-entry">
                  <img
                    className={`lp-header__partner-logo ${logo.className}`}
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        <a className="lp-header__cta" href="#inscricao">
          Quero me matricular
        </a>
      </div>

      <div className="lp-header__nav-bar" aria-label="Navegação principal">
        <div className="lp-shell">
          <nav className="lp-header__nav">
            {headerNavItems.map((item) => (
              <a key={item.label} className="lp-header__nav-link" href={item.href}>
                <span>{item.label}</span>
                {item.hasChevron ? (
                  <svg
                    className="lp-header__nav-chevron"
                    width="9"
                    height="5"
                    viewBox="0 0 9 5"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L4.5 4L8 1"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
