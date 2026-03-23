export function GraduationVestibularHero() {
  return (
    <section className="vestibular-hero" aria-label="Vestibular Graduação 2026">
      <div className="vestibular-hero__shell">
        <picture className="vestibular-hero__banner">
          <source
            media="(max-width: 720px)"
            srcSet="/vestibular/vestibular-graduacao-mobile.webp"
          />
          <img
            src="/vestibular/vestibular-graduacao.webp"
            alt="Vestibular Graduação 2026 da Faculdade Paulista"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  )
}
