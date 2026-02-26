import './legal.css'

import { privacyContent, termsContent, type LegalContent } from './legalContent'

type LegalPageProps = {
  kind: 'privacy' | 'terms'
}

function resolveContent(kind: LegalPageProps['kind']): LegalContent {
  return kind === 'privacy' ? privacyContent : termsContent
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function LegalPage({ kind }: LegalPageProps) {
  const content = resolveContent(kind)
  const updatedAt = formatDate(new Date())

  return (
    <main className="legal-page">
      <header className="legal-header">
        <a className="legal-header__brand" href="/">
          <img src="/landing/logo-faculdade-paulista-v2.webp" alt="Faculdade Paulista" />
        </a>
        <a className="legal-header__back" href="/">
          Voltar para a página inicial
        </a>
      </header>

      <section className="legal-content">
        <h1>{content.pageTitle}</h1>
        <p className="legal-content__updated">
          {content.lastUpdatedLabel}: {updatedAt}
        </p>

        {content.sections.map((section) => (
          <article key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={`${section.title}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>
    </main>
  )
}
