import { GraduationCap, MapPin } from 'lucide-react'

import { assets, partners } from '../data'

export function FutureSection() {
  return (
    <section className="lp-future">
      <div className="lp-shell">
        <header className="lp-future__head">
          <h2>
            A ESCOLHA CERTA PARA
            <br />
            <span>O SEU FUTURO</span>
          </h2>
          <p>
            Descubra por que milhares de alunos confiam na nossa metodologia para
            alcançar seus objetivos profissionais.
          </p>
        </header>

        <div className="lp-future__grid">
          <article className="lp-future__location">
            <img
              src={assets.locationPrivilegiada}
              alt="Estudantes em ambiente moderno de universidade"
            />
            <div className="lp-future__location-content">
              <span className="lp-future__tag">
                <MapPin size={12} />
              </span>
              <h3>CAMPUS BELÉM</h3>
              <p>
                Estrutura completa e fácil acesso para quem busca formação presencial de
                alta qualidade em São Paulo.
              </p>
            </div>
          </article>

          <article className="lp-future__reclame">
            <div>
              <h3>{'RECLAME AQUI \u00D3TIMO'}</h3>
              <p>
                Processos acadêmicos simplificados, suporte dedicado e acompanhamento em
                todas as fases da sua jornada.
              </p>
            </div>
            <img src={assets.map} alt="Mapa com pin de localização" />
          </article>

          <article className="lp-future__prof-card">
            <div className="lp-future__prof-icon">
              <GraduationCap size={16} />
            </div>
            <h3>Professores Qualificados</h3>
            <p>Corpo docente formado por mestres e doutores com atuação no mercado.</p>
            <div className="lp-future__avatars">
              <img src={assets.profSarah} alt="Professor 1" />
              <img src={assets.profMichael} alt="Professor 2" />
              <img src={assets.profJames} alt="Professor 3" />
              <span>+50 docentes</span>
            </div>
          </article>

          <article className="lp-future__red-card">
            <svg
              className="lp-future__red-icon lp-future__red-icon--clock"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M14.9766 0C6.67969 0 0 6.67969 0 14.9766C0 23.2734 6.67969 29.9531 14.9766 29.9531C23.2734 29.9531 29.9531 23.2734 29.9531 14.9766C29.9531 6.67969 23.2734 0 14.9766 0ZM14.9766 27C8.36719 27 2.95312 21.5859 2.95312 14.9766C2.95312 8.36719 8.36719 2.95312 14.9766 2.95312C21.5859 2.95312 27 8.36719 27 14.9766C27 21.5859 21.5859 27 14.9766 27ZM14.625 7.45312H14.5547C13.9219 7.45312 13.5 7.94531 13.5 8.57812V15.6094C13.5 16.1719 13.7812 16.6641 14.2031 16.9453L20.4609 20.6719C20.9531 20.9531 21.5859 20.8125 21.9375 20.3203C22.2188 19.7578 22.0781 19.125 21.5156 18.8438L15.75 15.3984V8.57812C15.75 7.94531 15.2578 7.45312 14.625 7.45312Z"
                fill="white"
              />
            </svg>
            <strong>+10 M</strong>
            <span>HORAS DE AULA</span>
          </article>

          <article className="lp-future__red-card">
            <svg
              className="lp-future__red-icon lp-future__red-icon--medal"
              viewBox="0 0 34 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g opacity="0.9">
                <path
                  d="M33.0469 15.75L29.3906 11.5312L29.8828 6.04688L24.4688 4.78125L21.6562 0L16.5234 2.17969L11.3906 0L8.57812 4.78125L3.16406 5.97656L3.65625 11.5312L0 15.75L3.65625 19.9688L3.16406 25.4531L8.57812 26.7188L11.3906 31.5L16.5234 29.3203L21.6562 31.5L24.4688 26.7188L29.8828 25.4531L29.3906 19.9688L33.0469 15.75ZM12.5859 21.7969L9 18.1406C8.4375 17.5781 8.4375 16.6641 9 16.0312L9.14062 15.9609C9.70312 15.3281 10.6875 15.3281 11.25 15.9609L13.6406 18.3516L21.375 10.6172C22.0078 10.0547 22.9219 10.0547 23.5547 10.6172L23.625 10.7578C24.1875 11.3203 24.1875 12.3047 23.625 12.8672L14.7656 21.7969C14.1328 22.3594 13.2188 22.3594 12.5859 21.7969Z"
                  fill="white"
                />
              </g>
            </svg>
            <strong>MEC NOTA 5</strong>
            <span>CURSOS RECONHECIDOS</span>
          </article>
        </div>

        <footer className="lp-future__partners">
          {partners.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </footer>
      </div>
    </section>
  )
}
