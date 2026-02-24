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
  profSarah: '/landing/profSarah.jpg',
  profJames: '/landing/profJames.jpg',
  profMichael: '/landing/profMichael.jpg',
  profAnita: '/landing/profAnita.jpg',
  profElena: '/landing/profElena.jpg',
  profDavid: '/landing/profDavid.jpg',
  coursePsicologia: '/landing/coursePsicologia.png',
  courseEnfermagem: '/landing/courseEnfermagem.png',
  courseAdministracao: '/landing/courseAdministracao.png',
  courseDireito: '/landing/courseDireito.png',
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
      { value: 'graduacao-pedagogia', label: 'Pedagogia (SEMIPRESENCIAL)' },
      { value: 'graduacao-servico-social', label: 'Serviço Social (SEMIPRESENCIAL)' },
      { value: 'graduacao-gestao-publica', label: 'Gestão Pública EAD' },
      { value: 'graduacao-seguranca-publica', label: 'Segurança Pública EAD' },
    ],
  },
]

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
    name: 'Carla Mendes',
    role: 'Egressa de Enfermagem',
    text: 'Comecei sem experiência na área e terminei o curso empregada em um grande hospital.',
    avatar: assets.profSarah,
  },
  {
    name: 'Rafael Souza',
    role: 'Aluno de Administração',
    text: 'A flexibilidade das aulas me permitiu estudar e trabalhar ao mesmo tempo sem perder qualidade.',
    avatar: assets.profMichael,
  },
  {
    name: 'Beatriz Lima',
    role: 'Egressa de Psicologia',
    text: 'Professores presentes e trilha prática. Saí pronta para atuar com segurança na profissão.',
    avatar: assets.profElena,
  },
  {
    name: 'Lucas Ferreira',
    role: 'Aluno de Direito',
    text: 'O suporte acadêmico é realmente rápido. Sempre tive retorno quando precisei.',
    avatar: assets.profJames,
  },
  {
    name: 'Ana Costa',
    role: 'Pós-graduação EAD',
    text: 'Consegui evoluir na carreira em poucos meses aplicando o que aprendi nas aulas.',
    avatar: assets.profAnita,
  },
  {
    name: 'Marcos Nunes',
    role: 'Tecnólogo em Gestão',
    text: 'Estrutura excelente e conteúdo atualizado. A Paulista me ajudou a mudar de patamar profissional.',
    avatar: assets.profDavid,
  },
]

export const faqItems: FaqItem[] = [
  {
    question: 'Como funciona o vestibular online?',
    answer:
      'Você faz sua inscrição e recebe o link da prova online. O resultado é divulgado rapidamente.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'Aceitamos boleto, pix e cartão de crédito. Também temos parcelamentos e condições promocionais.',
  },
  {
    question: 'O diploma EAD tem a mesma validade?',
    answer:
      'Sim. O diploma de cursos EAD reconhecidos possui a mesma validade de cursos presenciais.',
  },
]

export const partners = ['MEC', 'Reclame Aqui', 'Google for Education']
