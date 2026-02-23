import { MapPin, ShieldCheck, Smartphone } from 'lucide-react'

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
                <MapPin size={20} />
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
