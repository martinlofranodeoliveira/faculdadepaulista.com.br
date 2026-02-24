import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

import { assets } from '../data'

export function FooterSection() {
  return (
    <footer className="lp-footer" id="contato">
      <div className="lp-shell lp-footer__grid">
        <article>
          <div className="lp-brand lp-brand--small">
            <img
              className="lp-brand__logo lp-brand__logo--footer"
              src="/landing/logo-faculdade-paulista.webp"
              alt="Faculdade Paulista"
            />
          </div>
          <p>
            Excelência no ensino superior com foco em inovação, empregabilidade e
            desenvolvimento humano.
          </p>
          <div className="lp-footer__social">
            <a href="#inicio" aria-label="Facebook">
              <Facebook size={12} />
            </a>
            <a href="#inicio" aria-label="Instagram">
              <Instagram size={12} />
            </a>
          </div>
        </article>

        <article>
          <h3>Contato</h3>
          <p>
            <MapPin size={13} />
            Av. Álvaro Ramos, 1200
            <br />
            Belém - São Paulo, SP
          </p>
          <p>
            <Phone size={13} />
            (11) 4002-8922
          </p>
          <p>
            <Mail size={13} />
            contato@paulista.edu.br
          </p>
        </article>

        <article>
          <h3>Acesso Rápido</h3>
          <a href="#inicio">Portal do Aluno</a>
          <a href="#inicio">Calendário Acadêmico</a>
          <a href="#inicio">Biblioteca Virtual</a>
          <a href="#inicio">Trabalhe Conosco</a>
        </article>

        <article>
          <h3>Localização</h3>
          <div className="lp-footer__map">
            <img src={assets.map} alt="Mapa com localização da faculdade" />
            <a href="#inicio">
              <MapPin size={12} />
              Ver no Maps
            </a>
          </div>
        </article>
      </div>

      <div className="lp-shell lp-footer__bottom">
        <span>© 2026 Faculdade Paulista. Todos os direitos reservados.</span>
        <div>
          <a href="#inicio">Política de Privacidade</a>
          <a href="#inicio">Termos de Uso</a>
        </div>
      </div>
    </footer>
  )
}
