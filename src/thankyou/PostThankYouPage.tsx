import { Check, CircleUserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

import { readPostThankYouLead } from './postThankYouState'

import './postThankYou.css'

type Identity = {
  firstName: string
  email: string
}

const defaultIdentity: Identity = {
  firstName: 'Aluno',
  email: '',
}

function getFirstName(fullName: string) {
  const [firstName] = fullName.trim().split(/\s+/)
  return firstName || 'Aluno'
}

export function PostThankYouPage() {
  const [identity, setIdentity] = useState<Identity>(defaultIdentity)

  useEffect(() => {
    const storedLead = readPostThankYouLead()
    if (!storedLead) return

    setIdentity({
      firstName: getFirstName(storedLead.fullName),
      email: storedLead.email,
    })
  }, [])

  return (
    <main className="post-thanks">
      <header className="post-thanks__header">
        <a className="post-thanks__brand" href="/">
          <img
            src="/landing/logo-faculdade-paulista-v2.webp"
            alt="Faculdade Paulista"
            width="144"
            height="46"
            decoding="async"
          />
        </a>

        <div className="post-thanks__identity" aria-label="Dados do aluno">
          <div className="post-thanks__identity-text">
            <strong>{identity.firstName}</strong>
            {identity.email ? <span>{identity.email}</span> : null}
          </div>
          <CircleUserRound aria-hidden="true" />
        </div>
      </header>

      <div className="post-thanks__body">
        <section className="post-thanks__content" aria-labelledby="post-thanks-title">
          <div className="post-thanks__content-inner">
            <div className="post-thanks__badge" aria-hidden="true">
              <div className="post-thanks__badge-core">
                <Check size={56} strokeWidth={3.25} />
              </div>
            </div>

            <h1 id="post-thanks-title" className="post-thanks__title">
              <span>Inscrição</span>
              <strong>Finalizada</strong>
            </h1>

            <section className="post-thanks__steps" aria-labelledby="post-thanks-steps-title">
              <h2 id="post-thanks-steps-title">Próximos passos</h2>

              <ol className="post-thanks__step-list">
                <li className="post-thanks__step-item">
                  <span className="post-thanks__step-index" aria-hidden="true">
                    1
                  </span>
                  <p>Vamos analisar seus dados e te retornar em até 24h</p>
                </li>

                <li className="post-thanks__step-item">
                  <span className="post-thanks__step-index" aria-hidden="true">
                    2
                  </span>
                  <p>Após a aprovação, vamos finalizar sua matrícula no curso.</p>
                </li>
              </ol>
            </section>
          </div>
        </section>

        <div className="post-thanks__media" aria-hidden="true" />
      </div>
    </main>
  )
}
