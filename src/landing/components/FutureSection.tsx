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
                <svg
                  width="72"
                  height="65"
                  viewBox="0 0 72 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="12" y="2" width="48" height="40.5654" rx="12" fill="#FE0000" />
                  <g filter="url(#filter0_dd_11_1011)">
                    <rect
                      x="12"
                      y="2"
                      width="48"
                      height="41"
                      rx="2"
                      fill="white"
                      fillOpacity="0.01"
                      shapeRendering="crispEdges"
                    />
                  </g>
                  <path
                    d="M36 10C30.7266 10 25.9805 13.9844 25.9805 20.2539C25.9805 24.1797 29.0859 28.8672 35.1797 34.2578C35.6484 34.668 36.3516 34.668 36.8203 34.2578C42.9141 28.8672 46.0195 24.1797 46.0195 20.2539C46.0195 13.9844 41.2734 10 36 10ZM36 22.4805C34.6523 22.4805 33.4805 21.3672 33.4805 19.9609C33.4805 18.6133 34.6523 17.5 36 17.5C37.3477 17.5 38.5195 18.6133 38.5195 19.9609C38.5195 21.3672 37.3477 22.4805 36 22.4805Z"
                    fill="white"
                  />
                  <defs>
                    <filter
                      id="filter0_dd_11_1011"
                      x="0"
                      y="0"
                      width="72"
                      height="65"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feMorphology
                        radius="4"
                        operator="erode"
                        in="SourceAlpha"
                        result="effect1_dropShadow_11_1011"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="3" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_11_1011"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feMorphology
                        radius="3"
                        operator="erode"
                        in="SourceAlpha"
                        result="effect2_dropShadow_11_1011"
                      />
                      <feOffset dy="10" />
                      <feGaussianBlur stdDeviation="7.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_11_1011"
                        result="effect2_dropShadow_11_1011"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow_11_1011"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
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
            <img src={assets.reclameAquiOtimo} alt="Selo Reclame Aqui Otimo" />
          </article>

          <article className="lp-future__prof-card">
            <span className="lp-future__prof-bg-icon" aria-hidden="true">
              <svg
                width="144"
                height="126"
                viewBox="0 0 144 126"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.05">
                  <path
                    d="M31.5625 68.8125V83.8125C31.5625 87.8125 33.5625 91.3125 37.0625 93.3125L63.8125 107.812C66.8125 109.562 70.8125 109.562 73.8125 107.812L100.562 93.3125C104.062 91.3125 106.062 87.8125 106.062 83.8125V68.8125L73.8125 86.5625C70.8125 88.3125 66.8125 88.3125 63.8125 86.5625L31.5625 68.8125ZM63.8125 17.3125L18.8125 41.8125C15.0625 43.8125 15.0625 49.3125 18.8125 51.3125L63.8125 75.8125C66.8125 77.5625 70.8125 77.5625 73.8125 75.8125L116.812 52.3125V83.8125C116.812 86.8125 119.312 89.3125 122.062 89.3125C125.062 89.3125 127.562 86.8125 127.562 83.8125V49.8125C127.562 47.8125 126.312 46.0625 124.812 45.0625L73.8125 17.3125C70.8125 15.5625 66.8125 15.5625 63.8125 17.3125Z"
                    fill="black"
                  />
                </g>
              </svg>
            </span>
            <div className="lp-future__prof-icon">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect width="56" height="56" rx="24" fill="#EFF6FF" />
                <path
                  d="M26.6523 28.5479L28 27.5518L29.3477 28.5479C29.8164 28.8994 30.4609 28.4307 30.2852 27.8447L29.8164 26.1455L31.2812 24.9736C31.75 24.6221 31.5156 23.8604 30.8711 23.8604H29.1133L28.5859 22.1611C28.4102 21.6338 27.5898 21.6338 27.4141 22.1611L26.8867 23.8604H25.1289C24.4844 23.8604 24.25 24.6221 24.7188 24.9736L26.1836 26.1455L25.6562 27.8447C25.4805 28.4307 26.1836 28.8994 26.6523 28.5479ZM20.5 39.6221C20.5 40.501 21.3203 41.0869 22.1406 40.7939L28 38.8604L33.8594 40.7939C34.6797 41.0869 35.5 40.501 35.5 39.6221V31.7119C37.0234 29.9541 38.0195 27.6689 38.0195 25.0908C38.0195 19.583 33.5078 15.1299 28 15.1299C22.4922 15.1299 17.9805 19.583 17.9805 25.0908C17.9805 27.6689 18.9766 29.9541 20.5 31.7119V39.6221ZM28 17.5908C32.1602 17.5908 35.5 20.9893 35.5 25.0908C35.5 29.251 32.1602 32.5908 28 32.5908C23.8398 32.5908 20.5 29.251 20.5 25.0908C20.5 20.9893 23.8398 17.5908 28 17.5908Z"
                  fill="#2563EB"
                />
              </svg>
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
