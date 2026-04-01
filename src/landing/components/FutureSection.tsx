type PartnerMarqueeRowProps = {
  decorative?: boolean
}

const partnerLogos = [
  { src: '/landing/future/faculdadepaulista.webp', alt: 'Faculdade Paulista', width: 276, height: 72 },
  { src: '/landing/future/fasuleducacional.webp', alt: 'FASUL Faculdade EAD', width: 282, height: 104 },
  { src: '/landing/future/faculdadedeenfermagem.webp', alt: 'Faculdade de Enfermagem', width: 380, height: 108 },
  { src: '/landing/future/unicesp.webp', alt: 'UNICESP', width: 320, height: 59 },
  { src: '/landing/future/faculdadedepsicologia.webp', alt: 'Faculdade de Psicologia', width: 392, height: 93 },
  { src: '/landing/future/cursosgratisonline.webp', alt: 'Cursos Grátis Online', width: 190, height: 86 },
]

function PartnerMarqueeRow({ decorative = false }: PartnerMarqueeRowProps) {
  return (
    <div className="lp-future__partners-row" aria-hidden={decorative}>
      {partnerLogos.map((logo) => (
        <span key={`${logo.src}-${decorative ? 'copy' : 'base'}`} className="lp-future-logo">
          <img
            src={logo.src}
            alt={decorative ? '' : logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            decoding="async"
          />
        </span>
      ))}
    </div>
  )
}

export function FutureSection() {
  return (
    <section className="lp-future">
      <div className="lp-shell">
        <header className="lp-future__head">
          <h2>
            A ESCOLHA CERTA PARA <span>SEU FUTURO</span>
          </h2>
          <p>
            Escolha entre cursos presenciais, semipresenciais ou EAD e acelere sua carreira com
            ensino focado na prática e especializações inclusas.
          </p>
        </header>

        <div className="lp-future__grid">
          <article className="lp-future__location">
            <img
              src="/landing/future/metro-belem-card.webp"
              alt="Estrutura moderna do campus"
              width="466"
              height="548"
              loading="lazy"
              decoding="async"
            />
            <div className="lp-future__location-content">
              <span className="lp-future__location-pin" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 10C20 14.993 15.399 20.193 13.539 21.799C12.668 22.535 11.332 22.535 10.461 21.799C8.601 20.193 4 14.993 4 10C4 5.582 7.582 2 12 2C16.418 2 20 5.582 20 10Z"
                    fill="white"
                  />
                  <circle cx="12" cy="10" r="3" fill="#C50002" />
                </svg>
              </span>
              <h3>METRÔ SANTA CRUZ</h3>
              <p>
                Estude ao lado do Metrô Santa Cruz, com fácil acesso para todas as regiões de São
                Paulo.
              </p>
            </div>
          </article>

          <article className="lp-future__mec">
            <div className="lp-future__mec-content">
              <h3>NOTA MÁXIMA NO MEC</h3>
              <p>
                Laboratórios de última geração, bibliotecas completas e espaços de convivência
                projetados para maximizar seu aprendizado e networking.
              </p>
            </div>
            <img
              src="/landing/future/selo-nota-maxima-mec.webp"
              alt="Selo Nota Máxima no MEC"
              className="lp-future__mec-badge"
              width="168"
              height="160"
              loading="lazy"
              decoding="async"
            />
          </article>

          <a
            className="lp-future__reclame"
            href="https://www.reclameaqui.com.br/empresa/fasulmg-faculdade-sulmineira/"
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir perfil da FASUL no Reclame AQUI"
          >
            <img
              src="/landing/future/reclame-face-figma.webp"
              alt=""
              aria-hidden="true"
              className="lp-future__reclame-face lp-future__reclame-face--left"
              width="102"
              height="102"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/landing/future/reclame-face-figma.webp"
              alt=""
              aria-hidden="true"
              className="lp-future__reclame-face lp-future__reclame-face--top-left"
              width="68"
              height="68"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/landing/future/reclame-face-figma.webp"
              alt=""
              aria-hidden="true"
              className="lp-future__reclame-face lp-future__reclame-face--top-right"
              width="68"
              height="68"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/landing/future/reclame-face-figma.webp"
              alt=""
              aria-hidden="true"
              className="lp-future__reclame-face lp-future__reclame-face--right"
              width="102"
              height="102"
              loading="lazy"
              decoding="async"
            />

            <div className="lp-future__reclame-head">
              <img
                src="/landing/future/reclame-aqui-logo-figma.webp"
                alt="Reclame AQUI"
                className="lp-future__reclame-logo"
                width="313"
                height="149"
                loading="lazy"
                decoding="async"
              />
              <div className="lp-future__reclame-score">
                <span className="lp-future__reclame-score-label">ÓTIMO</span>
                <strong>8.3</strong>
                <span>/10</span>
              </div>
            </div>

            <div className="lp-future__reclame-ranking">
              <span className="lp-future__reclame-badge">28º</span>
              <div className="lp-future__reclame-ranking-copy">
                <strong>ENTRE AS 2.500 MELHORES</strong>
                <span>UNIVERSIDADES E FACULDADES</span>
              </div>
            </div>

            <span className="lp-future__reclame-cta">
              CLIQUE AQUI
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.33301 8H12.6663M12.6663 8L8.66634 4M12.6663 8L8.66634 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </div>

        <footer className="lp-future__partners">
          <div className="lp-future__partners-mask">
            <div className="lp-future__partners-track">
              <PartnerMarqueeRow />
              <PartnerMarqueeRow decorative />
            </div>
          </div>
          <p>Instituições parceiras e credenciadoras que validam nossa excelência.</p>
        </footer>
      </div>
    </section>
  )
}
