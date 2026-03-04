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
)

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
      'O vestibular é realizado de forma digital, com foco em facilitar o seu acesso ao Ensino Superior. Além da prova online, você pode ingressar utilizando sua nota do ENEM, como Segunda Graduação (aproveitando disciplinas já cursadas) ou via transferência externa de outra Instituição.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'Buscamos facilitar o seu acesso ao Ensino Superior com opções flexíveis. Você pode realizar o pagamento das mensalidades via PIX, garantindo a baixa imediata no sistema, ou através de cartão de crédito, com a possibilidade de parcelamento. Nosso objetivo é que a questão financeira não seja um obstáculo para a sua Formação Profissional.',
  },
  {
    question: 'Quem pode se inscrever na Enfermagem?',
    answer:
      'Qualquer pessoa que tenha concluído o Ensino Médio. Este curso é ideal para quem possui vocação para o cuidado humano, responsabilidade ética e o desejo de liderar equipes de Saúde em ambientes de alta tecnologia.',
  },
  {
    question: 'Quem pode se inscrever na Psicologia?',
    answer:
      'Qualquer pessoa que tenha concluído o Ensino Médio. Este curso é ideal para quem possui vocação para o cuidado humano, responsabilidade ética e o desejo de liderar equipes de Saúde em ambientes de alta tecnologia.',
  },
  {
    question: 'Como funciona a transferência ou retorno?',
    answer:
      'Para quem vem de outra Instituição, o processo de transferência é focado no aproveitamento de créditos: basta apresentar seu Histórico e as Ementas das Disciplinas cursadas para que nossa Coordenação analise as equivalências. Já para ex-alunos que desejam retomar o sonho da Graduação, o processo é simplificado através de um requerimento de retorno junto à nossa secretaria Acadêmica (sujeito à disponibilidade de vaga na turma correspondente).',
  },
  {
    question: 'Como a Faculdade prepara os alunos para o mercado de trabalho?',
    answer:
      'A Faculdade Paulista oferece aos alunos uma formação acadêmica sólida, preparando-os para atuar em diversas áreas do mercado de trabalho. Com o nosso currículo atualizado e atendimento personalizado, você estará apto para enfrentar os desafios do mercado com confiança e competência.',
  },
  {
    question: 'Quais são as oportunidades de carreira para os alunos formados?',
    answer:
      'A Faculdade Paulista oferece aos alunos uma formação acadêmica sólida, preparando-os para atuar em diversas áreas do mercado de trabalho. Com o nosso currículo atualizado e atendimento personalizado, você estará apto para enfrentar os desafios do mercado com confiança e competência.',
  },
]

export const partners = ['MEC', 'Reclame Aqui', 'Google for Education']





