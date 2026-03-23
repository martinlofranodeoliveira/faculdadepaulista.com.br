import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import type { AdmissionOptionId } from '../GraduationVestibularPage'

type Props = {
  admissionOptionId: AdmissionOptionId
  onBack: () => void
}

type InstallmentRow = {
  dueDate: string
  installment: string
  value: string
}

const MOCK_ROWS: InstallmentRow[] = [
  { installment: '1ª Mensalidade', value: 'R$ 139,00', dueDate: '15/04/2026' },
  { installment: '2ª Mensalidade', value: 'R$ 139,00', dueDate: '15/05/2026' },
  { installment: '3ª Mensalidade', value: 'R$ 139,00', dueDate: '15/06/2026' },
  { installment: '4ª Mensalidade', value: 'R$ 139,00', dueDate: '15/07/2026' },
  { installment: '5ª Mensalidade', value: 'R$ 139,00', dueDate: '15/08/2026' },
  { installment: '6ª Mensalidade', value: 'R$ 139,00', dueDate: '15/09/2026' },
  { installment: '7ª Mensalidade', value: 'R$ 139,00', dueDate: '15/10/2026' },
]

function getOptionTitle(admissionOptionId: AdmissionOptionId) {
  switch (admissionOptionId) {
    case 'segunda-graduacao':
      return '2° Graduação'
    case 'transferencia':
      return 'Transferência'
    case 'enem':
      return 'ENEM'
    default:
      return '2° Graduação'
  }
}

export function GraduationEnrollmentOfferStep({ admissionOptionId, onBack }: Props) {
  const [hasAcceptedContract, setHasAcceptedContract] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const optionTitle = useMemo(() => getOptionTitle(admissionOptionId), [admissionOptionId])

  function handleFinish() {
    if (!hasAcceptedContract) {
      return
    }

    window.location.assign('/graduacao/inscricao-finalizada')
  }

  return (
    <section className="vestibular-offer" aria-labelledby="vestibular-offer-title">
      <div className="vestibular-offer__shell">
        <button type="button" className="vestibular-offer__back" onClick={onBack}>
          <ArrowLeft size={18} strokeWidth={2.1} aria-hidden="true" />
          <span>Voltar</span>
        </button>

        <h2 id="vestibular-offer-title" className="vestibular-offer__title">
          <span>Vestibular:</span>
          <strong>{optionTitle}</strong>
        </h2>

        <div className="vestibular-offer__card">
          <p className="vestibular-offer__headline">
            Aproveite esta oportunidade!<br />
            Para começar a estudar, basta concluir sua matrícula agora!!!
          </p>

          <div className="vestibular-offer__table-box">
            <table className="vestibular-offer__table">
              <tbody>
                {MOCK_ROWS.map((row) => (
                  <tr key={row.installment}>
                    <td>{row.installment}</td>
                    <td>{row.value}</td>
                    <td>{row.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="vestibular-offer__contract">
            <input
              type="checkbox"
              checked={hasAcceptedContract}
              onChange={(event) => setHasAcceptedContract(event.target.checked)}
            />
            <span>
              Aceito o{' '}
              <button
                type="button"
                className="vestibular-offer__contract-link"
                onClick={() => setIsContractModalOpen(true)}
              >
                contrato de prestação de serviços educacionais
              </button>{' '}
              deste site
            </span>
          </label>
        </div>

        <div className="vestibular-offer__footer">
          <button
            type="button"
            className="vestibular-offer__finish"
            onClick={handleFinish}
            disabled={!hasAcceptedContract}
          >
            FINALIZAR
          </button>
        </div>
      </div>

      {isContractModalOpen ? (
        <div
          className="vestibular-offer__modal-backdrop"
          role="presentation"
          onClick={() => setIsContractModalOpen(false)}
        >
          <div
            className="vestibular-offer__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vestibular-contract-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vestibular-offer__modal-header">
              <h3 id="vestibular-contract-title">Contrato de prestação de serviços educacionais</h3>
              <button
                type="button"
                className="vestibular-offer__modal-close"
                aria-label="Fechar contrato"
                onClick={() => setIsContractModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="vestibular-offer__modal-body">
              <p>
                Este é um conteúdo mockado do contrato. O texto definitivo será carregado
                dinamicamente conforme a instituição responsável pelo curso.
              </p>
              <p>
                Nesta etapa, o modal já está pronto para exibir título, descrição e conteúdo
                completo assim que a API estiver disponível.
              </p>
            </div>

            <div className="vestibular-offer__modal-footer">
              <button
                type="button"
                className="vestibular-offer__modal-confirm"
                onClick={() => setIsContractModalOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
