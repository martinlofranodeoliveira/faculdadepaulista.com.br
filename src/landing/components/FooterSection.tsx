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
                  Av. Álvaro Ramos, 1200
                  <br />
                  Belém - São Paulo, SP
                </span>
              </li>
              <li className="is-phone">
                <img src="/landing/footer/icon-phone.svg" alt="" aria-hidden="true" />
                <a href="tel:+551140028922">(11) 4002-8922</a>
              </li>
              <li className="is-mail">
                <img src="/landing/footer/icon-mail.svg" alt="" aria-hidden="true" />
                <a href="mailto:contato@paulista.edu.br">contato@paulista.edu.br</a>
              </li>
            </ul>
          </article>

          <article className="lp-footer__location">
            <h3>Localização</h3>
            <div className="lp-footer__map">
              <img src="/landing/footer/map.png" alt="Mapa da localização da Faculdade Paulista" />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.+Álvaro+Ramos,+1200,+Belém,+São+Paulo+-+SP"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/landing/footer/icon-map-button.svg" alt="" aria-hidden="true" />
                Ver no Maps
              </a>
            </div>
          </article>
        </div>

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
