export interface CourseFaqItem {
  question: string
  answer: string
}

interface GetCourseFaqItemsParams {
  courseType: 'graduacao' | 'pos'
}

const graduationFaqItems: CourseFaqItem[] = [
  {
    question: 'Como funciona o vestibular online?',
    answer:
      'O vestibular online pode ser realizado de forma digital, com inscrição simplificada e análise conforme o processo seletivo vigente da instituição. Após a conclusão, a equipe entra em contato com as próximas orientações para matrícula.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'As condições de pagamento variam conforme a campanha comercial vigente. Em geral, a instituição oferece parcelamento, boleto e opções promocionais à vista, sempre informadas no momento da inscrição.',
  },
  {
    question: 'Quem pode se inscrever nos cursos de graduação?',
    answer:
      'Podem se inscrever candidatos que já concluíram o ensino médio e atendam aos critérios do processo seletivo. A documentação exigida é informada durante a etapa de matrícula.',
  },
  {
    question: 'Quem pode se inscrever nos cursos de pós-graduação?',
    answer:
      'Os cursos de pós-graduação são destinados a candidatos que já concluíram um curso superior reconhecido. A comprovação da graduação é solicitada na matrícula.',
  },
  {
    question: 'Como funciona a transferência ou retorno?',
    answer:
      'A instituição pode aceitar ingresso por transferência externa e também retorno aos estudos, conforme análise acadêmica e documentação apresentada. A equipe comercial orienta cada caso individualmente.',
  },
  {
    question: 'Como funciona as modalidades de ensino na Faculdade Paulista?',
    answer:
      'A Faculdade Paulista trabalha com ofertas presenciais, semipresenciais e EAD, conforme o curso. Cada modalidade segue sua própria organização acadêmica, carga prática e dinâmica de acompanhamento.',
  },
  {
    question: 'Como a Faculdade Paulista prepara os alunos para o mercado de trabalho?',
    answer:
      'A proposta acadêmica combina base teórica, atividades práticas, acompanhamento institucional e foco em competências exigidas pelo mercado, aproximando o aluno de situações reais da profissão ao longo do curso.',
  },
]

const postFaqItems: CourseFaqItem[] = [
  {
    question: 'Como funciona a modalidade de oferta do curso?',
    answer:
      'As aulas teóricas acontecem no ambiente virtual, com acesso à plataforma para estudar no seu ritmo. Quando houver atividades práticas obrigatórias, a instituição informa previamente o cronograma e o local de realização.',
  },
  {
    question: 'Qual a diferença na carga horária dos cursos?',
    answer:
      'A carga horária muda conforme a trilha escolhida. Isso impacta a profundidade do conteúdo e o tempo estimado de conclusão, mantendo a proposta acadêmica da especialização.',
  },
  {
    question: 'Como funciona o Estágio Supervisionado?',
    answer:
      'Quando previsto para atividades práticas específicas do curso, o estágio é orientado pela instituição e segue as exigências legais e do respectivo conselho profissional.',
  },
  {
    question: 'O Trabalho de Conclusão de Curso (TCC) é obrigatório na Pós-Graduação?',
    answer:
      'Em geral, os cursos de pós-graduação lato sensu não exigem TCC obrigatório, salvo quando houver previsão específica no projeto pedagógico do curso.',
  },
  {
    question: 'O Certificado da Pós-Graduação é válido em todo o país?',
    answer:
      'Sim. O certificado é emitido por instituição de ensino superior devidamente credenciada, com validade nacional, conforme a regulamentação educacional vigente.',
  },
]

export function getCourseFaqItems({
  courseType,
}: GetCourseFaqItemsParams): CourseFaqItem[] {
  return courseType === 'pos' ? postFaqItems : graduationFaqItems
}
