import { useMemo, useState } from 'react'
import { ArrowLeft, LoaderCircle } from 'lucide-react'

import type { AdmissionOptionId } from '../GraduationVestibularPage'
import type { GraduationOfferRow } from '../graduationOffer'

type Props = {
  admissionOptionId: AdmissionOptionId
  offerRows: GraduationOfferRow[]
  isOfferLoading?: boolean
  offerError?: string
  onBack: () => void
  onFinish: () => Promise<void> | void
  isSubmitting?: boolean
  submitError?: string
}

function getOptionTitle(admissionOptionId: AdmissionOptionId) {
  switch (admissionOptionId) {
    case 'segunda-graduacao':
      return '2? Gradua??o'
    case 'transferencia':
      return 'Transfer?ncia'
    case 'enem':
      return 'ENEM'
    default:
      return '2? Gradua??o'
  }
}

export function GraduationEnrollmentOfferStep({
  admissionOptionId,
  offerRows,
  isOfferLoading = false,
  offerError,
  onBack,
  onFinish,
  isSubmitting = false,
  submitError,
}: Props) {
  const [hasAcceptedContract, setHasAcceptedContract] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const optionTitle = useMemo(() => getOptionTitle(admissionOptionId), [admissionOptionId])

  async function handleFinish() {
    if (!hasAcceptedContract) {
      return
    }

    await onFinish()
  }

  return (
    <section className="vestibular-offer" aria-labelledby="vestibular-offer-title">
      <div className="vestibular-offer__shell">
        <button type="button" className="vestibular-offer__back" onClick={onBack} disabled={isSubmitting}>
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
            Para come?ar a estudar, basta concluir sua matr?cula agora!!!
          </p>

          <div className="vestibular-offer__table-box">
            {isOfferLoading ? (
              <div className="vestibular-offer__loading">
                <LoaderCircle size={20} className="is-spinning" />
                <span>Carregando mensalidades...</span>
              </div>
            ) : offerError ? (
              <p className="vestibular-step__validation-error vestibular-offer__table-error">{offerError}</p>
            ) : (
              <table className="vestibular-offer__table">
                <tbody>
                  {offerRows.map((row) => (
                    <tr key={`${row.installment}-${row.dueDate}`}>
                      <td>{row.installment}</td>
                      <td>{row.value}</td>
                      <td>{row.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
                contrato de presta??o de servi?os educacionais
              </button>{' '}
              deste site
            </span>
          </label>

          {submitError ? <p className="vestibular-step__validation-error">{submitError}</p> : null}
        </div>

        <div className="vestibular-offer__footer">
          <button
            type="button"
            className="vestibular-offer__finish"
            onClick={handleFinish}
            disabled={!hasAcceptedContract || isSubmitting || isOfferLoading || Boolean(offerError)}
          >
            {isSubmitting ? <LoaderCircle size={18} className="is-spinning" /> : null}
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
              <h3 id="vestibular-contract-title">Contrato de presta??o de servi?os educacionais</h3>
              <button
                type="button"
                className="vestibular-offer__modal-close"
                aria-label="Fechar contrato"
                onClick={() => setIsContractModalOpen(false)}
              >
                ?
              </button>
            </div>

            <div className="vestibular-offer__modal-body">
              <p>
                Este ? um conte?do mockado do contrato. O texto definitivo ser? carregado
                dinamicamente conforme a institui??o respons?vel pelo curso.
              </p>
              <p>
                Nesta etapa, o modal j? est? pronto para exibir t?tulo, descri??o e conte?do
                completo assim que a API estiver dispon?vel.
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
