const footerPartnerLogos = [
  {
    src: '/landing/logo-rodape-fasul.webp',
    alt: 'FASUL Educacional',
    modifier: 'fasul',
  },
  {
    src: '/landing/logo-rodape-unicesp.webp',
    alt: 'UNICESP',
    modifier: 'unicesp',
  },
  {
    src: '/landing/logo-rodape-enfermagem.webp',
    alt: 'Faculdade de Enfermagem',
    modifier: 'enfermagem',
  },
  {
    src: '/landing/logo-rodape-psicologia.webp',
    alt: 'Faculdade de Psicologia',
    modifier: 'psicologia',
  },
] as const

export function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="lp-footer" id="contato">
      <div className="lp-shell lp-footer__inner">
        <div className="lp-footer__grid">
          <article className="lp-footer__brand">
            <img
              className="lp-footer__logo"
              src="/landing/logo-white-faculdade-paulista.webp"
              alt="Faculdade Paulista"
              loading="lazy"
            />
            <p>
              Excelência no ensino superior com foco na inovação e na empregabilidade dos
              nossos alunos.
            </p>
            <div className="lp-footer__social">
              <a href="#" aria-label="Facebook">
                <img
                  src="/landing/footer/social-facebook.svg"
                  alt=""
                  aria-hidden="true"
                  className="lp-footer__social-icon lp-footer__social-icon--facebook"
                />
              </a>
              <a href="#" aria-label="Instagram">
                <img
                  src="/landing/footer/social-instagram.svg"
                  alt=""
                  aria-hidden="true"
                  className="lp-footer__social-icon lp-footer__social-icon--instagram"
                />
              </a>
            </div>
          </article>

          <article className="lp-footer__contact">
            <h3>Contato</h3>
            <ul>
              <li className="is-map">
                <img src="/landing/footer/icon-map.svg" alt="" aria-hidden="true" />
                <span>
                  Rua Dr. Diogo de Faria, 66 - Vila Mariana,
                  <br />
                  São Paulo - SP, CEP: 04037-000
                </span>
              </li>
              <li className="is-phone">
                <img src="/landing/footer/icon-phone.svg" alt="" aria-hidden="true" />
                <a href="tel:+553598060604">(35) 9806-0604</a>
              </li>
              <li className="is-mail">
                <img src="/landing/footer/icon-mail.svg" alt="" aria-hidden="true" />
                <a href="mailto:contato@faculdadepaulista.com.br">
                  contato@faculdadepaulista.com.br
                </a>
              </li>
            </ul>
          </article>

          <article className="lp-footer__location">
            <h3>Localização</h3>
            <div className="lp-footer__map">
              <img src="/landing/footer/map.png" alt="Mapa da localização da Faculdade Paulista" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Dr.+Diogo+de+Faria,+66+-+Vila+Mariana,+S%C3%A3o+Paulo+-+SP,+04037-000"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/landing/footer/icon-map-button.svg" alt="" aria-hidden="true" />
                Ver no Maps
              </a>
            </div>
          </article>
        </div>

        <section className="lp-footer__group" aria-label="Instituições do Grupo FASUL Educacional">
          <p className="lp-footer__group-title">Grupo FASUL Educacional</p>
          <div className="lp-footer__group-logos">
            {footerPartnerLogos.map((logo) => (
              <div
                key={logo.src}
                className={`lp-footer__group-card lp-footer__group-card--${logo.modifier}`}
              >
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        <div className="lp-footer__bottom">
          <span>{`\u00A9 ${currentYear} Faculdade Paulista. Todos os direitos reservados.`}</span>
          <div>
            <a href="/politica-de-privacidade">Política de Privacidade</a>
            <a href="/termos-de-uso">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
