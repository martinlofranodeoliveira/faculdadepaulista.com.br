const phoneOptions = [
  {
    step: '1.',
    title: 'FAÇA SUA MATRÍCULA AGORA',
    descriptionPrefix: 'Tire suas dúvidas sobre Cursos de Graduação e Pós-graduação e',
    highlightText: 'Realize seu Sonho com a Fasul.',
    href: 'https://wa.me/5511947966982?text=Ol%C3%A1,%20estou%20no%20site%20da%20Faculdade%20Paulista%20e%20quero%20realizar%20meu%20sonho%20com%20voc%C3%AAs.',
    phone: '+55 (11) 9 4796-6982',
    highlight: true,
  },
  {
    step: '2.',
    title: 'CONVERSE CONOSCO',
    description:
      'Estamos prontos para tirar suas dúvidas e te dar o Suporte certo para qualquer necessidade sua.',
    phone: '+55 (35) 2038-0560',
    highlight: false,
  },
]

const whatsappOptions = [
  {
    step: '3.',
    title: 'ATENDIMENTO SECRETARIA',
    description: 'Pendências de Documentos, Histórico, Declarações e Requerimentos.',
    href: 'https://wa.me/5521991586516?text=Ol%C3%A1,%20estou%20no%20site%20da%20Faculdade%20Paulista%20e%20preciso%20de%20ajuda%20com%20matr%C3%ADcula%20e%20documentos.',
  },
  {
    step: '4.',
    title: 'TUTORIA (APOIO AO ALUNO)',
    description: 'Dúvidas sobre o Conteúdo das Aulas e Suporte para seu Sucesso Acadêmico.',
    href: 'https://wa.me/5511991401940?text=Ol%C3%A1,%20estou%20no%20site%20da%20Faculdade%20Paulista%20e%20preciso%20de%20suporte%20acad%C3%AAmico.',
  },
  {
    step: '5.',
    title: 'FINANCEIRO E ACORDO FÁCIL',
    description: 'Pague sem dor de cabeça! 2ª via de Boletos, Mensalidades, Negociação.',
    href: 'https://wa.me/5531984088941?text=Ol%C3%A1,%20estou%20no%20site%20da%20Faculdade%20Paulista%20e%20preciso%20falar%20sobre%20boletos%20e%20acordos.',
  },
]

export function ContactChannelsSection() {
  return (
    <section className="lp-contact-channels" aria-labelledby="lp-contact-channels-title">
      <div className="lp-shell lp-contact-channels__inner">
        <header className="lp-contact-channels__intro">
          <h2 id="lp-contact-channels-title">FALE CONOSCO</h2>
          <p>QUAL CANAL GOSTARIA DE FALAR?</p>
        </header>

        <article className="lp-contact-card lp-contact-card--phone">
          <img
            className="lp-contact-card__badge"
            src="/landing/footer/ligacao.svg"
            alt="Ligação"
            width="184"
            height="62"
            loading="lazy"
            decoding="async"
          />

          <div className="lp-contact-card__items">
            {phoneOptions.map((item) => (
              <section key={item.step} className="lp-contact-card__item lp-contact-card__item--phone">
                <div className="lp-contact-card__item-bar" aria-hidden="true" />
                <div className="lp-contact-card__item-content">
                  <h3>
                    {item.step} {item.title}
                  </h3>
                  {item.highlight ? (
                    <>
                      <div className="lp-contact-card__offer">
                      <div className="lp-contact-card__offer-copy">
                        <strong>GANHE 3 PÓS-GRADUAÇÕES</strong>
                        <span>+ 10 CURSOS DE IA</span>
                      </div>
                      <small>
                        <span>VAGAS</span>
                        <span>LIMITADAS</span>
                      </small>
                    </div>
                      <p className="is-highlighted">
                        {item.descriptionPrefix}{' '}
                        <a
                          className="lp-contact-card__highlight-link"
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.highlightText}
                        </a>
                      </p>
                    </>
                  ) : (
                    <p>{item.description}</p>
                  )}
                  <div className="lp-contact-card__phone">
                    <img
                      src="/landing/footer/icon-phone-green.svg"
                      alt=""
                      aria-hidden="true"
                      width="18"
                      height="18"
                    />
                    <strong>{item.phone}</strong>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </article>

        <article className="lp-contact-card lp-contact-card--whatsapp">
          <img
            className="lp-contact-card__badge"
            src="/landing/footer/whatsapp.svg"
            alt="WhatsApp"
            width="184"
            height="62"
            loading="lazy"
            decoding="async"
          />

          <div className="lp-contact-card__items">
            {whatsappOptions.map((item) => (
              <a
                key={item.step}
                className="lp-contact-card__item lp-contact-card__item--whatsapp lp-contact-card__item-link"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                <div className="lp-contact-card__item-bar" aria-hidden="true" />
                <div className="lp-contact-card__item-content">
                  <h3>
                    {item.step} {item.title}
                  </h3>
                  <p>{item.description}</p>
                </div>
                <img
                  className="lp-contact-card__step-icon"
                  src="/landing/footer/whatsapp-footer-steps.svg"
                  alt=""
                  aria-hidden="true"
                  width="61"
                  height="61"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
