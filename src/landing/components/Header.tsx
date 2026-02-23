import { useEffect, useState } from 'react'
import { Box, Menu, X } from 'lucide-react'

import { navItems } from '../data'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 980) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  return (
    <header className="lp-header">
      <div className="lp-shell lp-header__inner">
        <a className="lp-brand" href="#inicio">
          <span className="lp-brand__icon">
            <Box size={13} strokeWidth={2.1} />
          </span>
          <span>Faculdade Paulista</span>
        </a>

        <nav className="lp-nav">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="lp-header__cta" href="#inscricao">
          Quero me matricular
        </a>

        <button
          className="lp-header__menu"
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls="lp-mobile-menu"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        id="lp-mobile-menu"
        className={`lp-shell lp-header__mobile ${isMenuOpen ? 'is-open' : ''}`}
      >
        <nav className="lp-header__mobile-nav">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="lp-header__cta-mobile"
          href="#inscricao"
          onClick={() => setIsMenuOpen(false)}
        >
          Quero me matricular
        </a>
      </div>
    </header>
  )
}
