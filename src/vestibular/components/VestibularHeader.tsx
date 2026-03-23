import { CircleUserRound } from 'lucide-react'

type Props = {
  firstName: string
  email: string
}

export function VestibularHeader({ firstName, email }: Props) {
  return (
    <header className="vestibular-header">
      <a className="vestibular-header__brand" href="/">
        <img
          src="/landing/logo-faculdade-paulista-v2.webp"
          alt="Faculdade Paulista"
          width="144"
          height="46"
          decoding="async"
        />
      </a>

      <div className="vestibular-header__identity" aria-label="Dados do aluno">
        <div className="vestibular-header__identity-text">
          <strong>{firstName}</strong>
          {email ? <span>{email}</span> : null}
        </div>
        <CircleUserRound aria-hidden="true" />
      </div>
    </header>
  )
}
