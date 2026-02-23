import { assets } from '../data'

export function AppShowcaseSection() {
  return (
    <section className="lp-app">
      <div className="lp-shell lp-app__grid">
        <article>
          <p className="lp-app__eyebrow">BAIXE NOSSO APLICATIVO</p>
          <h2>
            ESTUDE DE ONDE ESTIVER
            <br />
            COM NOSSO APP
          </h2>
          <p>
            Acesso total à biblioteca virtual, fale com professores, acompanhe suas
            notas e assista aulas ao vivo ou gravadas. A Faculdade Paulista na palma
            da sua mão.
          </p>
          <div className="lp-app__stores">
            <img src={assets.appStore} alt="Disponível na App Store" />
            <img src={assets.googlePlay} alt="Disponível no Google Play" />
          </div>
        </article>

        <div className="lp-phone">
          <div className="lp-phone__notch" />
          <div className="lp-phone__screen">
            <div className="lp-phone__header">PAULISTA APP</div>
            <div className="lp-phone__card lp-phone__card--active">
              <small>Próxima Aula</small>
              <strong>Anatomia Humana</strong>
              <span>19:00 - Sala 32</span>
            </div>
            <div className="lp-phone__card" />
            <div className="lp-phone__card" />
            <div className="lp-phone__card" />
            <div className="lp-phone__card lp-phone__card--small" />
            <div className="lp-phone__footer" />
          </div>
        </div>
      </div>
    </section>
  )
}
