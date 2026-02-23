import { ShieldCheck, Smartphone } from 'lucide-react'

export function WhyChooseSection() {
  return (
    <section className="lp-why" id="vantagens">
      <div className="lp-shell">
        <header className="lp-why__head">
          <h2>POR QUE ESCOLHER A PAULISTA?</h2>
          <p>Diferenciais pensados para alavancar sua carreira desde o primeiro dia de aula.</p>
        </header>

        <div className="lp-why__top">
          <article className="lp-why-card lp-why-card--light">
            <div className="lp-why-card__top">
              <span className="lp-why-card__icon">
                <svg
                  width="28"
                  height="40"
                  viewBox="0 0 28 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M14 40C10.4667 40 7.58333 39.4417 5.35 38.325C3.11667 37.2083 2 35.7667 2 34C2 33.2 2.24167 32.4583 2.725 31.775C3.20833 31.0917 3.88333 30.5 4.75 30L7.9 32.95C7.6 33.0833 7.275 33.2333 6.925 33.4C6.575 33.5667 6.3 33.7667 6.1 34C6.53333 34.5333 7.53333 35 9.1 35.4C10.6667 35.8 12.3 36 14 36C15.7 36 17.3417 35.8 18.925 35.4C20.5083 35 21.5167 34.5333 21.95 34C21.7167 33.7333 21.4167 33.5167 21.05 33.35C20.6833 33.1833 20.3333 33.0333 20 32.9L23.1 29.9C24.0333 30.4333 24.75 31.0417 25.25 31.725C25.75 32.4083 26 33.1667 26 34C26 35.7667 24.8833 37.2083 22.65 38.325C20.4167 39.4417 17.5333 40 14 40ZM14.05 29C17.35 26.5667 19.8333 24.125 21.5 21.675C23.1667 19.225 24 16.7667 24 14.3C24 10.9 22.9167 8.33333 20.75 6.6C18.5833 4.86667 16.3333 4 14 4C11.6667 4 9.41667 4.86667 7.25 6.6C5.08333 8.33333 4 10.9 4 14.3C4 16.5333 4.81667 18.8583 6.45 21.275C8.08333 23.6917 10.6167 26.2667 14.05 29ZM14 34C9.3 30.5333 5.79167 27.1667 3.475 23.9C1.15833 20.6333 0 17.4333 0 14.3C0 11.9333 0.425 9.85833 1.275 8.075C2.125 6.29167 3.21667 4.8 4.55 3.6C5.88333 2.4 7.38333 1.5 9.05 0.9C10.7167 0.3 12.3667 0 14 0C15.6333 0 17.2833 0.3 18.95 0.9C20.6167 1.5 22.1167 2.4 23.45 3.6C24.7833 4.8 25.875 6.29167 26.725 8.075C27.575 9.85833 28 11.9333 28 14.3C28 17.4333 26.8417 20.6333 24.525 23.9C22.2083 27.1667 18.7 30.5333 14 34ZM14 18C15.1 18 16.0417 17.6083 16.825 16.825C17.6083 16.0417 18 15.1 18 14C18 12.9 17.6083 11.9583 16.825 11.175C16.0417 10.3917 15.1 10 14 10C12.9 10 11.9583 10.3917 11.175 11.175C10.3917 11.9583 10 12.9 10 14C10 15.1 10.3917 16.0417 11.175 16.825C11.9583 17.6083 12.9 18 14 18Z"
                    fill="#FF0000"
                  />
                </svg>
              </span>
              <div className="lp-why-card__meta">
                <span className="lp-why-card__chip">METRÔ BELÉM</span>
                <strong>350m</strong>
              </div>
            </div>

            <h3>01. MENSALIDADES FIXAS</h3>
            <p>
              Posicionamento logístico otimizado no Hub Belém. Acesso multimodal que
              reduz o tempo de deslocamento em até 40% para a zona leste.
            </p>
          </article>

          <article className="lp-why-card lp-why-card--dark">
            <div className="lp-why-card__line" />
            <span className="lp-why-card__phone">
              <Smartphone size={52} strokeWidth={1.4} />
            </span>
            <h3>02. ACESSE ONDE E QUANDO QUISER</h3>
            <p>
              Infraestrutura de alta densidade equipada com estações de processamento
              avançado e ambientes de simulação realística para aprendizado de alto impacto.
            </p>
          </article>
        </div>

        <article className="lp-why-highlight">
          <div className="lp-why-highlight__score">
            <ShieldCheck size={44} />
            <strong>92%</strong>
            <span>RATING DE MERCADO</span>
          </div>

          <div className="lp-why-highlight__content">
            <div className="lp-why-highlight__chip-wrap">
              <p className="lp-why-highlight__chip">{'RECLAME AQUI \u00D3TIMO'}</p>
            </div>
            <h3>03. SUPORTE ESPECIALIZADO</h3>
            <p>
              Corpo docente composto por 100% de mestres e doutores com atuação ativa em
              cargos de liderança nas maiores empresas do setor. Foco em networking e
              transposição de teoria para realidade corporativa.
            </p>
            <div className="lp-why-highlight__tags">
              <span>PHD RESEARCH</span>
              <span>MARKET SENIORITY</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
