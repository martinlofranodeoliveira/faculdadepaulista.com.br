import { ContactChannelsSection } from './ContactChannelsSection'

export function FooterSection() {
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="lp-footer" id="contato">
        <div className="lp-shell lp-footer__inner">
          <div className="lp-footer__grid">
            <article className="lp-footer__brand">
              <div className="lp-footer__brand-lockup">
                <img
                  className="lp-footer__logo"
                  src="/landing/logo-white-faculdade-paulista.webp"
                  alt="Faculdade Paulista"
                  width="184"
                  height="59"
                  loading="lazy"
                  decoding="async"
                />
                <span className="lp-footer__brand-divider" aria-hidden="true" />
                <img
                  className="lp-footer__brand-partner"
                  src="/landing/footer/unicesp.webp"
                  alt="UNICESP"
                  width="174"
                  height="32"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p>
                A Faculdade Paulista é uma Instituição de Ensino Superior que atualmente pertence ao Grupo
                Fasul Educacional. Está credenciada pelas Portarias MEC n.º 73, de 14 de Janeiro de 2019,
                MEC n.º 499, de 8 de Julho de 2021 e MEC n.º 888, de 27 de Outubro de 2020.
              </p>
            </article>

            <article className="lp-footer__contact">
              <h3>Contato</h3>
              <ul>
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
                  <img
                    src="/landing/footer/icon-mail.svg"
                    alt=""
                    aria-hidden="true"
                    width="16"
                    height="12"
                  />
                  <a href="mailto:contato@faculdadepaulista.com.br">contato@faculdadepaulista.com.br</a>
                </li>
              </ul>

              <div className="lp-footer__reclame">
                <h3>Reclame Aqui</h3>
                <a
                  className="lp-footer__reclame-badges"
                  href="https://www.reclameaqui.com.br/empresa/fasulmg-faculdade-sulmineira/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir perfil da FASUL no Reclame Aqui"
                >
                  <img
                    src="/landing/footer/verificada-reclame-aqui.webp"
                    alt="Verificada por Reclame Aqui"
                    width="134"
                    height="48"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src="/landing/footer/otimo-reclame-aqui.webp"
                    alt="Ótimo no Reclame Aqui"
                    width="134"
                    height="48"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </div>
            </article>

            <article className="lp-footer__location">
              <h3>Localização</h3>
              <div className="lp-footer__location-address">
                <img src="/landing/footer/icon-map.svg" alt="" aria-hidden="true" width="14" height="20" />
                <p>Local: Rua Dr. Diogo de Faria, 66 - Vila Mariana, São Paulo - SP, CEP: 04037-000</p>
              </div>
              <div className="lp-footer__map">
                <img
                  src="/landing/footer/map.webp"
                  alt="Mapa da localização da Faculdade Paulista"
                  width="395"
                  height="109"
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
            <span>{`© ${currentYear} Faculdade Paulista. Todos os direitos reservados.`}</span>
            <img
              className="lp-footer__faith"
              src="/landing/footer/nos-acreditamos-em-deus.webp"
              alt="Nós acreditamos em Deus"
              width="181"
              height="16"
              loading="lazy"
              decoding="async"
            />
            <div>
              <a href="/politica-de-privacidade">Política de Privacidade</a>
              <a href="/termos-de-uso">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>

      <ContactChannelsSection />
    </>
  )
}
