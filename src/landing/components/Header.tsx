import { Fragment, useEffect, useState } from 'react'

const headerNavItems = [
  { label: 'Graduação Presencial', href: '#graduacao', hasChevron: true },
  {
    label: 'Graduação Semipresencial e EAD',
    href: '#graduacao-online',
    hasChevron: true,
  },
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

function HeaderChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  )
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 721px)')
    const handleViewportChange = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false)
      }
    }

    handleViewportChange(mediaQuery)

    const listener = (event: MediaQueryListEvent) => {
      handleViewportChange(event)
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }

    mediaQuery.addListener(listener)
    return () => mediaQuery.removeListener(listener)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`lp-header ${isMobileMenuOpen ? 'is-menu-open' : ''}`}>
      <div className="lp-header__desktop">
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
            <div className="lp-header__partners" aria-label="Instituições do grupo">
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
                  {item.hasChevron ? <HeaderChevron className="lp-header__nav-chevron" /> : null}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="lp-shell lp-header__mobile-shell">
        <div className="lp-header__mobile-top">
          <a className="lp-header__mobile-brand" href="/" aria-label="Faculdade Paulista">
            <img
              className="lp-header__mobile-logo"
              src="/landing/logo-faculdade-paulista-v2.webp"
              alt="Faculdade Paulista"
              width="92"
              height="29"
            />
          </a>

          <a className="lp-header__mobile-cta" href="#inscricao" onClick={closeMobileMenu}>
            Quero me matricular
          </a>

          <button
            className="lp-header__menu-button"
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="lp-header-mobile-menu"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span className="lp-header__menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <div
          className={`lp-header__mobile-menu ${isMobileMenuOpen ? 'is-open' : ''}`}
          id="lp-header-mobile-menu"
          hidden={!isMobileMenuOpen}
        >
          <nav className="lp-header__mobile-nav" aria-label="Navegação mobile">
            {headerNavItems.map((item) => (
              <a
                key={item.label}
                className="lp-header__mobile-link"
                href={item.href}
                onClick={closeMobileMenu}
              >
                <span>{item.label}</span>
                {item.hasChevron ? (
                  <HeaderChevron className="lp-header__mobile-link-chevron" />
                ) : null}
              </a>
            ))}
          </nav>

          <div className="lp-header__mobile-partners" aria-label="Instituições do grupo">
            {headerPartnerLogos.map((logo) => (
              <div key={logo.src} className="lp-header__mobile-partner-card">
                <img
                  className={`lp-header__mobile-partner-logo ${logo.className}`}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
