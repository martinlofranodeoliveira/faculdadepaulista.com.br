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
              width="145"
              height="46"
              loading="lazy"
              decoding="async"
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
                  width="24"
                  height="24"
                />
              </a>
              <a href="#" aria-label="Instagram">
                <img
                  src="/landing/footer/social-instagram.svg"
                  alt=""
                  aria-hidden="true"
                  className="lp-footer__social-icon lp-footer__social-icon--instagram"
                  width="26"
                  height="27"
                />
              </a>
            </div>
          </article>

          <article className="lp-footer__contact">
            <h3>Contato</h3>
            <ul>
              <li className="is-map">
                <img src="/landing/footer/icon-map.svg" alt="" aria-hidden="true" width="14" height="20" />
                <span>
                  Rua Dr. Diogo de Faria, 66 - Vila Mariana,
                  <br />
                  São Paulo - SP, CEP: 04037-000
                </span>
              </li>
              <li className="is-phone">
                <img
                  src="/landing/footer/icon-phone.svg"
                  alt=""
                  aria-hidden="true"
                  width="16"
                  height="16"
                />
                <a href="tel:+553598060604">(35) 9806-0604</a>
              </li>
              <li className="is-mail">
                <img src="/landing/footer/icon-mail.svg" alt="" aria-hidden="true" width="16" height="12" />
                <a href="mailto:contato@faculdadepaulista.com.br">
                  contato@faculdadepaulista.com.br
                </a>
              </li>
            </ul>
          </article>

          <article className="lp-footer__location">
            <h3>Localização</h3>
            <div className="lp-footer__map">
              <img
                src="/landing/footer/map.webp"
                alt="Mapa da localização da Faculdade Paulista"
                width="365"
                height="160"
                loading="lazy"
                decoding="async"
              />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Dr.+Diogo+de+Faria,+66+-+Vila+Mariana,+S%C3%A3o+Paulo+-+SP,+04037-000"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/landing/footer/icon-map-button.svg"
                  alt=""
                  aria-hidden="true"
                  width="11"
                  height="11"
                />
                Ver no Maps
              </a>
            </div>
          </article>
        </div>

        <section className="lp-footer__group" aria-label="Instituições do Grupo FASUL Educacional">
          <picture className="lp-footer__group-banner">
            <source
              media="(max-width: 720px)"
              srcSet="/landing/rodape-grupo-fasul-educacional-logos-mobile.webp"
            />
            <img
              src="/landing/rodape-grupo-fasul-educacional-logos.webp"
              alt="Banner do Grupo FASUL Educacional com as marcas Fasul Educacional, UNICESP, Faculdade de Enfermagem e Faculdade de Psicologia."
              width="1192"
              height="88"
              loading="lazy"
              decoding="async"
            />
          </picture>
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
