type PartnerMarqueeRowProps = {
  decorative?: boolean
}

const partnerLogos = [
  { src: '/landing/future/faculdadepaulista.webp', alt: 'Faculdade Paulista' },
  { src: '/landing/future/fasuleducacional.webp', alt: 'FASUL Faculdade EAD' },
  { src: '/landing/future/faculdadedeenfermagem.webp', alt: 'Faculdade de Enfermagem' },
  { src: '/landing/future/unicesp.webp', alt: 'UNICESP' },
  { src: '/landing/future/faculdadedepsicologia.webp', alt: 'Faculdade de Psicologia' },
  { src: '/landing/future/cursosgratisonline.webp', alt: 'Cursos Grátis Online' },
]

function PartnerMarqueeRow({ decorative = false }: PartnerMarqueeRowProps) {
  return (
    <div className="lp-future__partners-row" aria-hidden={decorative}>
      {partnerLogos.map((logo) => (
        <span key={`${logo.src}-${decorative ? 'copy' : 'base'}`} className="lp-future-logo">
          <img src={logo.src} alt={decorative ? '' : logo.alt} loading="lazy" />
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
            Descubra por que milhares de alunos confiam na nossa metodologia para
            alcançar seus objetivos profissionais.
          </p>
        </header>

        <div className="lp-future__grid">
          <article className="lp-future__location">
            <img src="/landing/future/metro-belem-card.webp" alt="Estrutura moderna do campus" />
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
              <h3>METRO BELÉM</h3>
              <p>
                Laboratórios de última geração, bibliotecas completas e espaços de
                convivência projetados para maximizar seu aprendizado e networking.
              </p>
            </div>
          </article>

          <article className="lp-future__mec">
            <div className="lp-future__mec-content">
              <h3>NOTA MÁXIMA NO MEC</h3>
              <p>
                Estamos no coração da cidade, com fácil acesso por transporte público e
                perto dos principais centros empresariais, facilitando sua rotina de estudos
                e trabalho.
              </p>
            </div>
            <img
              src="/landing/future/selo-nota-maxima-mec.png"
              alt="Selo Nota Máxima no MEC"
              className="lp-future__mec-badge"
              loading="lazy"
            />
          </article>

          <article className="lp-future__reclame">
            <img
              src="/landing/future/reclame-face.png"
              alt=""
              aria-hidden="true"
              className="lp-future__reclame-face"
            />
            <img
              src="/landing/future/reclame-aqui-logo.png"
              alt="Reclame AQUI"
              className="lp-future__reclame-logo"
            />
            <p>Corpo docente formado por mestres e doutores atuantes no mercado.</p>
          </article>

          <article className="lp-future__history">
            <img
              src="/landing/future/history-star-top.png"
              alt=""
              aria-hidden="true"
              className="lp-future__history-star lp-future__history-star--top"
            />
            <img
              src="/landing/future/history-star-bottom.png"
              alt=""
              aria-hidden="true"
              className="lp-future__history-star lp-future__history-star--bottom"
            />
            <div className="lp-future__history-mark" aria-hidden="true">
              <img src="/landing/future/history-laurel-mask.png" alt="" />
              <strong>27</strong>
            </div>
            <strong className="lp-future__history-title">27 ANOS DE HISTÓRIA</strong>
          </article>
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
