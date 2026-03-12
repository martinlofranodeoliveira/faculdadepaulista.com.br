import { useEffect, useRef, useState } from 'react'

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

const marqueeInstitutionLogos = [
  {
    className: 'lp-header__group-modal-logo--paulista',
    src: '/landing/logo-faculdade-paulista-v2.webp',
    alt: 'Faculdade Paulista',
    width: 107,
    height: 32,
  },
  {
    className: 'lp-header__group-modal-logo--unicesp',
    src: '/landing/logo-faculdade-unicesp.webp',
    alt: 'Faculdade UNICESP',
    width: 79,
    height: 15,
  },
  {
    className: 'lp-header__group-modal-logo--enfermagem',
    src: '/landing/logo-faculdade-de-enfermagem.webp',
    alt: 'Faculdade de Enfermagem',
    width: 122,
    height: 25,
  },
  {
    className: 'lp-header__group-modal-logo--psicologia',
    src: '/landing/logo-faculdade-de-psicologia.webp',
    alt: 'Faculdade de Psicologia',
    width: 109,
    height: 26,
  },
  {
    className: 'lp-header__group-modal-logo--fasul-ead',
    src: '/landing/fasul-logo.webp',
    alt: 'FASUL Educacional EAD',
    width: 105,
    height: 25,
  },
] as const

const marqueeSequenceLogos = [...marqueeInstitutionLogos, ...marqueeInstitutionLogos]

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

function HeaderCloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null)
  const marqueeSequenceRef = useRef<HTMLDivElement | null>(null)

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
    if (!isMobileMenuOpen && !isGroupModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isGroupModalOpen) {
          setIsGroupModalOpen(false)
          return
        }

        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isGroupModalOpen, isMobileMenuOpen])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (isGroupModalOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isGroupModalOpen])

  useEffect(() => {
    if (!isGroupModalOpen) {
      if (marqueeTrackRef.current) {
        marqueeTrackRef.current.style.transform = 'translate3d(0, 0, 0)'
      }

      return
    }

    const track = marqueeTrackRef.current
    const sequence = marqueeSequenceRef.current

    if (!track || !sequence) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.style.transform = 'translate3d(0, 0, 0)'
      return
    }

    let animationFrameId = 0
    let lastTime = performance.now()
    let offset = 0

    const computedTrackStyle = window.getComputedStyle(track)
    const trackGap = Number.parseFloat(computedTrackStyle.columnGap || computedTrackStyle.gap || '0') || 0
    const sequenceWidth = sequence.getBoundingClientRect().width + trackGap
    const speed = 42

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime
      offset = (offset + speed * delta) % sequenceWidth
      track.style.transform = `translate3d(${-offset}px, 0, 0)`
      animationFrameId = window.requestAnimationFrame(animate)
    }

    animationFrameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      track.style.transform = 'translate3d(0, 0, 0)'
    }
  }, [isGroupModalOpen])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const openGroupModal = () => {
    setIsMobileMenuOpen(false)
    setIsGroupModalOpen(true)
  }

  const closeGroupModal = () => {
    setIsGroupModalOpen(false)
  }

  return (
    <>
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

              <div className="lp-header__partners" aria-label="Instituições em destaque">
                <div className="lp-header__partner-entry">
                  <img
                    className="lp-header__partner-logo lp-header__partner-logo--unicesp"
                    src="/landing/logo-faculdade-unicesp.webp"
                    alt="Faculdade UNICESP"
                    width="126"
                    height="44"
                  />
                </div>

                <button
                  className="lp-header__group-trigger"
                  type="button"
                  aria-haspopup="dialog"
                  aria-controls="lp-header-group-modal"
                  onClick={openGroupModal}
                >
                  <img
                    className="lp-header__partner-logo lp-header__partner-logo--fasul-group"
                    src="/landing/logo-grupo-fasul-educacional.webp"
                    alt="Grupo FASUL Educacional"
                    width="206"
                    height="44"
                  />
                </button>
              </div>
            </div>

            <a className="lp-header__cta" href="#inscricao">
              Quero me matricular
            </a>
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

            <div className="lp-header__mobile-shortcuts" aria-label="Instituições em destaque">
              <div className="lp-header__mobile-shortcut-card">
                <img
                  className="lp-header__mobile-shortcut-logo lp-header__mobile-shortcut-logo--unicesp"
                  src="/landing/logo-faculdade-unicesp.webp"
                  alt="Faculdade UNICESP"
                  width="126"
                  height="44"
                />
              </div>

              <button
                className="lp-header__mobile-group-trigger"
                type="button"
                aria-haspopup="dialog"
                aria-controls="lp-header-group-modal"
                onClick={openGroupModal}
              >
                <img
                  className="lp-header__mobile-shortcut-logo lp-header__mobile-shortcut-logo--fasul-group"
                  src="/landing/logo-grupo-fasul-educacional.webp"
                  alt="Grupo FASUL Educacional"
                  width="206"
                  height="44"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isGroupModalOpen ? (
        <div className="lp-header__group-modal-overlay" onClick={closeGroupModal}>
          <div
            className="lp-header__group-modal"
            id="lp-header-group-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-header-group-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="lp-header__group-modal-topbar">
              <button
                className="lp-header__group-modal-close"
                type="button"
                onClick={closeGroupModal}
              >
                <HeaderCloseIcon />
                <span>Fechar</span>
              </button>
            </div>

            <div className="lp-header__group-modal-body">
              <h2 className="lp-visually-hidden" id="lp-header-group-modal-title">
                Instituições do Grupo FASUL Educacional
              </h2>

              <div className="lp-header__group-modal-summary">
                <img
                  className="lp-header__group-modal-summary-logo"
                  src="/landing/logo-grupo-fasul-educacional.webp"
                  alt="Grupo FASUL Educacional"
                  width="206"
                  height="44"
                />

                <span className="lp-header__group-modal-summary-divider" aria-hidden="true" />

                <p className="lp-header__group-modal-summary-text">
                  Somos 20 Instituições Educacionais e mais de 400 Polos em todo o Brasil!
                </p>
              </div>

              <div
                className="lp-header__group-modal-marquee"
                aria-label="Logos das instituições do Grupo FASUL Educacional"
              >
                <div className="lp-header__group-modal-track" ref={marqueeTrackRef}>
                  {[0, 1].map((sequenceIndex) => {
                    const isClone = sequenceIndex > 0

                    return (
                      <div
                        key={sequenceIndex}
                        className="lp-header__group-modal-sequence"
                        aria-hidden={isClone}
                        ref={sequenceIndex === 0 ? marqueeSequenceRef : undefined}
                      >
                        {marqueeSequenceLogos.map((logo, logoIndex) => {
                          const isRepeatedWithinSequence = logoIndex >= marqueeInstitutionLogos.length
                          const shouldHideLogo = isClone || isRepeatedWithinSequence

                          return (
                            <div
                              key={`${sequenceIndex}-${logo.src}-${logoIndex}`}
                              className="lp-header__group-modal-logo-wrap"
                              aria-hidden={shouldHideLogo}
                            >
                              <img
                                className={`lp-header__group-modal-logo ${logo.className}`}
                                src={logo.src}
                              alt={shouldHideLogo ? '' : logo.alt}
                              width={logo.width}
                              height={logo.height}
                            />
                          </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
