export function PostGraduationBannerSection() {
  return (
    <section className="lp-pos-banner" aria-label="Banner de Pós-graduação">
      <div className="lp-pos-banner__inner">
        <picture>
          <source media="(max-width: 720px)" srcSet="/landing/pos-graduacao-banner-mobile.webp" />
          <img
            src="/landing/pos-graduacao-banner.webp"
            alt="Pós-graduação EAD"
            width="1240"
            height="234"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  )
}
