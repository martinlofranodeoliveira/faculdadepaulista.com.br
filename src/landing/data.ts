export type NavItem = {
  label: string
  href: string
}

export type HeroFeature = {
  title: string
}

export type FormCourseGroup = {
  label: string
  options: Array<{
    value: string
    label: string
  }>
}

export type JourneyStep = {
  number: string
  title: string
  subtitle: string
}

export type CourseItem = {
  title: string
  mode: string
  description: string
  image: string
}

export type GraduationCarouselCourseConfig = {
  courseValue: string
  installmentPrice: string
  oldInstallmentPrice: string
  image: string
  imagePosition?: string
  modalityLabel?: string
  videoLabel?: string
}

export type GraduationCarouselCourse = GraduationCarouselCourseConfig & {
  title: string
}

export type TestimonialItem = {
  name: string
  role: string
  text: string
  avatar: string
}

export type FaqItem = {
  question: string
  answer: string
}

export const assets = {
  appStore: '/landing/appStore.png',
  googlePlay: '/landing/googlePlay.png',
  map: '/landing/map.png',
  reclameAquiOtimo: '/landing/reclame-aqui-otimo.webp',
  testimonialAnaClara: '/landing/ana-clara.webp',
  testimonialMarcosOliveira: '/landing/marcos-oliveira.webp',
  testimonialBrunoSilva: '/landing/bruno-silva.webp',
  testimonialJulianaLima: '/landing/juliana-lima.webp',
  testimonialCarlaSouza: '/landing/carla-souza.webp',
  testimonialRafaelCosta: '/landing/rafael-costa.webp',
  coursePsicologia: '/landing/coursePsicologia.png',
  courseEnfermagem: '/landing/courseEnfermagem.png',
  courseAdministracao: '/landing/courseAdministracao.png',
  courseDireito: '/landing/courseDireito.png',
  gradAdministracao: '/landing/Curso_Administracao_EAD.webp',
  gradAnaliseDesenvolvimentoSistemas:
    '/landing/Curso_Analise_e_Desenvolvimento_de_Sistemas_EAD.webp',
  gradCienciasContabeis: '/landing/Curso_Ciencias_Contabeis_EAD.webp',
  gradEnfermagemPresencial: '/landing/Curso_Enfermagem_Presencial.webp',
  gradGestaoComercial: '/landing/Curso_Gestao_Comercial_EAD.webp',
  gradGestaoTecnologiaInformacao:
    '/landing/Curso_Gestao_da_Tecnologia_da_Informacao_EAD.webp',
  gradGestaoRecursosHumanos: '/landing/Curso_Gestao_de_Recursos_Humanos_EAD.webp',
  gradGestaoFinanceira: '/landing/Curso_Gestao_Financeira_EAD.webp',
  gradGestaoPublica: '/landing/Curso_Gestao_Publica_EAD.webp',
  gradLogistica: '/landing/Curso_Logistica_EAD.webp',
  gradMarketingDigital: '/landing/Curso_Marketing_Digital_EAD.webp',
  gradMarketing: '/landing/Curso_Marketing_EAD.webp',
  gradNegociosImobiliarios: '/landing/Curso_Negocios_Imobiliarios_EAD.webp',
  gradPedagogiaSemipresencial: '/landing/Curso_Pedagogia_Semipresencial.webp',
  gradProcessosGerenciais: '/landing/Curso_Processos_Gerenciais_EAD.webp',
  gradPsicologiaPresencial: '/landing/Curso_Psicologia_Presencial.webp',
  gradSegurancaPublica: '/landing/Curso_Seguranca_Publica_EAD.webp',
  gradServicoSocialSemipresencial: '/landing/Curso_Servico_Social_Semipresencial.webp',
  locationPrivilegiada: '/landing/Estudantes-em-ambiente-moderno-de-universidade.png',
  posOne: '/landing/posOne.png',
  posTwo: '/landing/posTwo.png',
  posThree: '/landing/posThree.png',
}

export const navItems: NavItem[] = [
  { label: 'Graduação', href: '#graduacao' },
  { label: 'Pós-graduação', href: '#pos-graduacao' },
  { label: 'Vantagens', href: '#vantagens' },
  { label: 'Contato', href: '#contato' },
]

export const heroFeatures: HeroFeature[] = [
  { title: 'Ao lado do Metrô Belém' },
  { title: 'Nota Máxima no MEC' },
]

export const formCourseGroups: FormCourseGroup[] = [
  {
    label: 'Graduação',
    options: [
      {
        value: 'graduacao-analise-desenvolvimento-sistemas',
        label: 'Análise e Desenvolvimento de Sistemas EAD',
      },
      {
        value: 'graduacao-gestao-tecnologia-informacao',
        label: 'Gestão da Tecnologia da Informação EAD',
      },
      { value: 'graduacao-marketing-digital', label: 'Marketing Digital EAD' },
      { value: 'graduacao-administracao', label: 'Administração EAD' },
      { value: 'graduacao-enfermagem', label: 'Enfermagem Presencial' },
      { value: 'graduacao-psicologia', label: 'Psicologia Presencial' },
      { value: 'graduacao-ciencias-contabeis', label: 'Ciências Contábeis EAD' },
      { value: 'graduacao-processos-gerenciais', label: 'Processos Gerenciais EAD' },
      {
        value: 'graduacao-gestao-recursos-humanos',
        label: 'Gestão de Recursos Humanos EAD',
      },
      { value: 'graduacao-logistica', label: 'Logística EAD' },
      { value: 'graduacao-marketing', label: 'Marketing EAD' },
      { value: 'graduacao-gestao-comercial', label: 'Gestão Comercial EAD' },
      { value: 'graduacao-gestao-financeira', label: 'Gestão Financeira EAD' },
      { value: 'graduacao-negocios-imobiliarios', label: 'Negócios Imobiliários EAD' },
      { value: 'graduacao-pedagogia', label: 'Pedagogia (Semipresencial)' },
      { value: 'graduacao-servico-social', label: 'Serviço Social (Semipresencial)' },
      { value: 'graduacao-gestao-publica', label: 'Gestão Pública EAD' },
      { value: 'graduacao-seguranca-publica', label: 'Segurança Pública EAD' },
    ],
  },
]

const graduationCourseLabelLookup = new Map(
  formCourseGroups[0]?.options.map((option) => [option.value, option.label]) ?? [],
)

function inferGraduationModalityLabel(courseTitle: string): string {
  const normalized = courseTitle.toUpperCase()
  if (normalized.includes('SEMIPRESENCIAL')) return 'GRADUAÇÃO SEMIPRESENCIAL'
  if (normalized.includes('PRESENCIAL')) return 'GRADUAÇÃO PRESENCIAL'
  return 'GRADUAÇÃO EAD'
}

function getGraduationCarouselOrderPriority(title: string): number {
  const normalized = title.toUpperCase()
  if (normalized.includes('SEMIPRESENCIAL')) return 1
  if (normalized.includes('PRESENCIAL')) return 0
  return 2
}

export const graduationCarouselCourseConfigs: GraduationCarouselCourseConfig[] = [
  {
    courseValue: 'graduacao-analise-desenvolvimento-sistemas',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradAnaliseDesenvolvimentoSistemas,
  },
  {
    courseValue: 'graduacao-gestao-tecnologia-informacao',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradGestaoTecnologiaInformacao,
  },
  {
    courseValue: 'graduacao-marketing-digital',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradMarketingDigital,
  },
  {
    courseValue: 'graduacao-administracao',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradAdministracao,
  },
  {
    courseValue: 'graduacao-enfermagem',
    installmentPrice: 'R$ 449,00/MÊS',
    oldInstallmentPrice: 'R$ 1.890,00',
    image: assets.gradEnfermagemPresencial,
  },
  {
    courseValue: 'graduacao-psicologia',
    installmentPrice: 'R$ 549,00/MÊS',
    oldInstallmentPrice: 'R$ 1.890,00',
    image: assets.gradPsicologiaPresencial,
  },
  {
    courseValue: 'graduacao-ciencias-contabeis',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradCienciasContabeis,
  },
  {
    courseValue: 'graduacao-processos-gerenciais',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradProcessosGerenciais,
  },
  {
    courseValue: 'graduacao-gestao-recursos-humanos',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradGestaoRecursosHumanos,
  },
  {
    courseValue: 'graduacao-logistica',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradLogistica,
  },
  {
    courseValue: 'graduacao-marketing',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradMarketing,
  },
  {
    courseValue: 'graduacao-gestao-comercial',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradGestaoComercial,
  },
  {
    courseValue: 'graduacao-gestao-financeira',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradGestaoFinanceira,
  },
  {
    courseValue: 'graduacao-negocios-imobiliarios',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradNegociosImobiliarios,
  },
  {
    courseValue: 'graduacao-pedagogia',
    installmentPrice: 'R$ 249,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradPedagogiaSemipresencial,
  },
  {
    courseValue: 'graduacao-servico-social',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradServicoSocialSemipresencial,
  },
  {
    courseValue: 'graduacao-gestao-publica',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradGestaoPublica,
  },
  {
    courseValue: 'graduacao-seguranca-publica',
    installmentPrice: 'R$ 139,00/MÊS',
    oldInstallmentPrice: 'R$ 329,00',
    image: assets.gradSegurancaPublica,
  },
]

export const graduationCarouselCourses: GraduationCarouselCourse[] = graduationCarouselCourseConfigs.flatMap(
  (courseConfig) => {
    const title = graduationCourseLabelLookup.get(courseConfig.courseValue)
    if (!title) return []

    return [
      {
        ...courseConfig,
        title,
        modalityLabel: courseConfig.modalityLabel ?? inferGraduationModalityLabel(title),
        videoLabel: courseConfig.videoLabel ?? 'COM VIDEOAULAS',
      },
    ]
  },
).sort((a, b) => {
  const priorityDiff =
    getGraduationCarouselOrderPriority(a.title) - getGraduationCarouselOrderPriority(b.title)

  if (priorityDiff !== 0) return priorityDiff

  return a.title.localeCompare(b.title, 'pt-BR')
})

export const journeySteps: JourneyStep[] = [
  { number: '1', title: 'Escolha seu curso', subtitle: 'Defina sua carreira' },
  { number: '2', title: 'Inscrição online', subtitle: 'Rápido e fácil' },
  { number: '3', title: 'Avaliação/ENEM', subtitle: 'Agende ou use sua nota' },
  { number: '4', title: 'Comece a estudar', subtitle: 'Bem-vindo ao futuro' },
]

export const graduationCourses: CourseItem[] = [
  {
    title: 'Psicologia',
    mode: 'Presencial',
    description:
      'Compreenda a mente humana e o comportamento através de uma formação prática.',
    image: assets.coursePsicologia,
  },
  {
    title: 'Administração',
    mode: 'EAD',
    description:
      'Desenvolva habilidades de liderança e gestão estratégica com flexibilidade total.',
    image: assets.courseAdministracao,
  },
  {
    title: 'Enfermagem',
    mode: 'Semipresencial',
    description:
      'Formação completa em cuidados de saúde, aliando teoria online e prática intensiva.',
    image: assets.courseEnfermagem,
  },
]

export const postCourses: CourseItem[] = [
  {
    title: 'Psicologia',
    mode: 'EAD',
    description:
      'Compreenda a mente humana e o comportamento através de uma abordagem atual.',
    image: assets.posOne,
  },
  {
    title: 'Administração',
    mode: 'EAD',
    description:
      'Desenvolva habilidades de liderança e gestão estratégica com flexibilidade total.',
    image: assets.posTwo,
  },
  {
    title: 'Enfermagem',
    mode: 'EAD',
    description:
      'Formação completa em cuidados de saúde, aliando teoria online e prática intensiva.',
    image: assets.posThree,
  },
]

export const testimonials: TestimonialItem[] = [
  {
    name: 'Ana Clara',
    role: 'Graduação',
    text: 'O que eu mais gostei na Faculdade foi o suporte. Os tutores respondem rápido e não te deixam no vácuo quando surge aquela dúvida antes da prova. Nota 10!',
    avatar: assets.testimonialAnaClara,
  },
  {
    name: 'Marcos Oliveira',
    role: 'Graduação',
    text: 'Fiz minha graduação na Faculdade Paulista e logo que terminei já consegui uma oportunidade melhor na área. O mercado respeita muito o diploma deles, abriu portas pra mim!',
    avatar: assets.testimonialMarcosOliveira,
  },
  {
    name: 'Bruno Silva',
    role: 'Pós-graduação',
    text: 'O portal de estudos é muito fácil de usar, bem direto ao ponto. Consigo estudar pelo celular no intervalo do trabalho sem complicação nenhuma. Recomendo!',
    avatar: assets.testimonialBrunoSilva,
  },
  {
    name: 'Juliana Lima',
    role: 'Graduação',
    text: 'Pra quem tem a vida corrida igual a minha, a Faculdade Paulista é perfeita. Estudo no meu tempo, faço meus horários e o preço cabe no bolso. Melhor custo-benefício que achei.',
    avatar: assets.testimonialJulianaLima,
  },
  {
    name: 'Carla Souza',
    role: 'Pós-graduação',
    text: 'As aulas são ótimas e o material é bem atualizado. Estou aplicando muita coisa que aprendi no curso direto no meu dia a dia profissional. Vale muito a pena.',
    avatar: assets.testimonialCarlaSouza,
  },
  {
    name: 'Rafael Costa',
    role: 'Pós-graduação',
    text: 'O que eu curti foi a agilidade. Sem burocracia pra matricular e o certificado saiu super rápido depois que concluí. Instituição muito séria e organizada.',
    avatar: assets.testimonialRafaelCosta,
  },
]

export const faqItems: FaqItem[] = [
  {
    question: 'Como funciona o vestibular online?',
    answer:
      'Nosso processo seletivo é moderno e adaptado à sua rotina. A avaliação é realizada de forma digital, consistindo em uma **prova de redação online** com resultado ágil. Além disso, você pode ingressar imediatamente utilizando sua **nota do ENEM**, realizar uma **Segunda Graduação sem vestibular** ou solicitar sua **Transferência** para garantir uma formação de alto nível.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'Oferecemos total conveniência financeira para viabilizar seus estudos. Você pode optar pelo pagamento via **PIX, boleto bancário ou cartão de crédito**. Para maior tranquilidade, disponibilizamos o **crédito recorrente**, uma modalidade que debita a mensalidade mensalmente sem comprometer o limite total do seu cartão.',
  },
  {
    question: 'Quem pode se inscrever nos cursos de graduação?',
    answer:
      'Nossos Cursos de Graduação (Bacharelados, Licenciaturas e Tecnólogos) são destinados a todos que **concluíram o Ensino Médio**. Seja para quem busca a primeira formação ou para Profissionais que desejam uma transição de Carreira, a Faculdade Paulista oferece o suporte necessário para o desenvolvimento de competências de destaque.',
  },
  {
    question: 'Quem pode se inscrever nos cursos de pós-graduação?',
    answer:
      'A Pós-Graduação é voltada para Profissionais que já possuem **Diploma de Ensino Superior** e buscam Especialização técnica ou estratégica. Oferecemos um portfólio completo para quem deseja **assumir cargos de liderança**, atualizar conhecimentos, pontuar em Concursos e aumentar sua competitividade no Mercado de trabalho.',
  },
  {
    question: 'Como funciona a transferência ou retorno?',
    answer:
      'Se você deseja migrar de outra Instituição, basta submeter seu **Histórico e Ementas** para que nossa Coordenação avalie o aproveitamento das disciplinas já cursadas. Para ex-alunos que desejam reativar sua trajetória Acadêmica, a retomada é feita de forma simplificada por meio de um **requerimento de retorno** em nossa Secretaria.',
  },
  {
    question: 'Como funciona as modalidades de ensino na Faculdade Paulista?',
    answer: `Nossa estrutura é multimodal para atender a todos os perfis de Alunos:

- **Presencial**: Imersão total no Campus para Cursos que exigem prática intensiva e contato direto, como Enfermagem e Psicologia.
- **EAD**: Flexibilidade total para você estudar onde e quando quiser, com conteúdo de alta qualidade disponível 24h através do nosso App exclusivo e Plataforma.
- **Semipresencial**: O equilíbrio perfeito, unindo a autonomia do digital com encontros presenciais estratégicos para atividades práticas e networking.`,
  },
  {
    question: 'Como a Faculdade Paulista prepara os alunos para o mercado de trabalho?',
    answer: `Nossa metodologia é focada na experiência real, adaptada para cada modalidade de ensino:

- **Para os cursos presenciais de Enfermagem e Psicologia**: Oferecemos imersão prática em ambientes profissionais próprios. Os alunos de Enfermagem treinam em laboratórios de última geração com simuladores de alta fidelidade que replicam a rotina hospitalar. Já os alunos de Psicologia contam com o suporte da Clínica-Escola própria, realizando atendimentos supervisionados à comunidade para desenvolver competências clínicas, organizacionais e sociais.
- **Para os cursos EAD e Semipresenciais**: Utilizamos uma plataforma digital intuitiva que traz o Mercado para dentro da aula. Através de estudos de caso reais, curadoria de professores atuantes no setor e ferramentas que estimulam o empreendedorismo e a inovação, garantimos que o aluno desenvolva as competências mais exigidas pelas empresas modernas.
- **Carga Horária e Estágios**: Todos os nossos Cursos cumprem rigorosamente as Diretrizes Curriculares Nacionais, com cargas horárias robustas que incluem Estágios Curriculares obrigatórios para garantir que você saia da Faculdade pronto para atuar com segurança e liderança.`,
  },
]

export const partners = ['MEC', 'Reclame Aqui', 'Google for Education']


