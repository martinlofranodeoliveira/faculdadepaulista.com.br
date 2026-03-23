import { assets, graduationCarouselCourseConfigs } from '@/landing/data'
import { splitDifferentials, type CatalogCourse, type CourseType } from '@/lib/catalogApi'

export type CoursePresentation = {
  image: string
  imageAlt: string
  modalityLabel: string
  graduationHero: {
    mediaImage: string
    mediaAlt: string
    ratingLabel: string
    highlights: Array<{
      icon: string
      title: string
      text: string
    }>
  }
  graduationProfile: {
    title: string
    description: string
  }
  heroFacts: Array<{
    eyebrow: string
    text: string
  }>
  infoCards: Array<{
    title: string
    description: string
  }>
  curriculum: Array<{
    label: string
    title: string
    hours: string
    summary?: string
    disciplines?: string[]
    open?: boolean
  }>
  salary: {
    accentTitle: string
    darkTitle: string
    subtitle: string
    note: string
    items: Array<{
      label: string
      value: string
      caption: string
      height: number
    }>
  }
  labs: {
    title: string
    description: string
    badges: string[]
    bullets: string[]
    primaryImage: string
    secondaryImage: string
  }
  graduationCareer: {
    areaTitle: string
    areaDescription: string
    marketTitle: string
    marketIntro: string
    bullets: string[]
    marketClosing: string
  }
  differentials: {
    title: string
    items: Array<{
      icon: string
      title: string
      description: string
      wide?: boolean
    }>
  }
  pricing: {
    oldInstallmentText: string
    currentInstallmentText: string
    pixText: string
  }
  paymentPlanOptions: string[]
  workloadOptions: string[]
}

type Input = {
  course?: CatalogCourse
  courseType: CourseType
  title: string
  rawLabel?: string
  area?: string
}

function parseHoursValue(value: string): number {
  const match = value.match(/(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 0
}

function getGraduationFallbackImage(course?: CatalogCourse): string {
  const config = graduationCarouselCourseConfigs.find((entry) => entry.courseValue === course?.value)
  return config?.image ?? assets.gradAdministracao
}

function buildGeneratedDescription(courseType: CourseType, title: string): string {
  if (courseType === 'pos') {
    return `Conheça a Pós-graduação em ${title} da Faculdade Paulista e continue sua inscrição.`
  }

  return `Conheça a Graduação em ${title} da Faculdade Paulista e continue sua inscrição.`
}

function buildPostInfoCards(course: CatalogCourse | undefined, title: string) {
  const fallback = buildGeneratedDescription('pos', title)

  return [
    {
      title: 'Competências',
      description: course?.competenciesBenefits || fallback,
    },
    {
      title: 'Público-Alvo',
      description: course?.targetAudience || fallback,
    },
    {
      title: 'Mercado de Trabalho',
      description: course?.laborMarket || course?.competitiveDifferentials || fallback,
    },
  ]
}

function buildGraduationInfoCards(course: CatalogCourse | undefined, title: string) {
  const fallback = buildGeneratedDescription('graduacao', title)

  return [
    {
      title: 'Descrição do curso',
      description: course?.description || fallback,
    },
    {
      title: 'Público-alvo',
      description: course?.targetAudience || fallback,
    },
    {
      title: 'Competências desenvolvidas',
      description: course?.competenciesBenefits || fallback,
    },
  ]
}

function buildPostHeroFacts(course: CatalogCourse | undefined) {
  const workloadNumbers = (course?.workloadOptions ?? [])
    .map((item) => parseHoursValue(item))
    .filter((value) => value > 0)
    .sort((a, b) => a - b)
  const months = [course?.durationMonths ?? 0, course?.durationContinuousMonths ?? 0]
    .filter((value) => value > 0)
    .sort((a, b) => a - b)

  const workloadText =
    workloadNumbers.length > 1
      ? `${workloadNumbers[0]} a ${workloadNumbers[workloadNumbers.length - 1]} Horas`
      : workloadNumbers.length === 1
        ? `${workloadNumbers[0]} Horas`
        : 'Carga horária variável'

  const durationText =
    months.length > 1
      ? `De ${months[0]} a ${months[months.length - 1]} meses`
      : months.length === 1
        ? `${months[0]} meses`
        : 'Duração conforme matriz curricular'

  return [
    {
      eyebrow:
        course?.modality === 'semipresencial'
          ? 'Modalidade Híbrida'
          : `Modalidade ${course?.modalityLabel || 'EAD'}`,
      text:
        course?.modality === 'semipresencial'
          ? 'Aulas EAD + prática presencial'
          : `${course?.modalityLabel || 'EAD'} com acompanhamento institucional.`,
    },
    {
      eyebrow: workloadText,
      text: 'Carga horária dinâmica conforme a oferta vigente.',
    },
    {
      eyebrow: durationText,
      text: 'Conforme a carga horária selecionada.',
    },
  ]
}

function buildGraduationHighlights(course: CatalogCourse | undefined) {
  return [
    {
      icon: '/course/graduation/icon-calendar.svg',
      title: 'Titulação:',
      text: course?.titulation || 'Graduação',
    },
    {
      icon: '/course/graduation/icon-modality.svg',
      title: 'Modalidade:',
      text: course?.modalityLabel || 'EAD',
    },
  ]
}

function buildGraduationCurriculum(course: CatalogCourse | undefined) {
  if (!course?.curriculumVariants.length) {
    return []
  }

  const disciplines = course.curriculumVariants[0]?.disciplines ?? []
  if (!disciplines.length) {
    return []
  }

  const semesterCount = Math.max(1, course.semesterCount || Math.ceil(disciplines.length / 6))
  const chunkSize = Math.max(1, Math.ceil(disciplines.length / semesterCount))
  const groups: CoursePresentation['curriculum'] = []

  for (let index = 0; index < semesterCount; index += 1) {
    const chunk = disciplines.slice(index * chunkSize, (index + 1) * chunkSize)
    if (!chunk.length) continue

    const totalHours = chunk.reduce((sum, discipline) => sum + discipline.hours, 0)
    groups.push({
      label: `${index + 1}? semestre`,
      title: semesterCount > 1 ? `Disciplinas do ${index + 1}? semestre` : 'Disciplinas do curso',
      hours: `${totalHours}h`,
      open: index === 0,
      disciplines: chunk.map((discipline) => discipline.name),
    })
  }

  return groups
}


function buildPostCurriculum(course: CatalogCourse | undefined, title: string) {
  if (!course?.curriculumVariants.length) {
    return []
  }

  const disciplines = course.curriculumVariants[0]?.disciplines ?? []
  if (!disciplines.length) {
    return []
  }

  const totalHours =
    course.curriculumVariants[0]?.totalHours ||
    disciplines.reduce((sum, discipline) => sum + discipline.hours, 0)

  return [
    {
      label: 'Disciplinas',
      title: `Matriz curricular de ${title}`,
      hours: `${totalHours}h`,
      open: true,
      disciplines: disciplines.map((discipline) => discipline.name),
    },
  ]
}

function buildGraduationCareer(course: CatalogCourse | undefined, title: string) {
  const bulletSource = splitDifferentials(course?.laborMarket || course?.competitiveDifferentials || '')
  const bullets =
    bulletSource.length > 0
      ? bulletSource.slice(0, 5)
      : [
          `Atuação em instituições públicas e privadas ligadas à área de ${title.toLowerCase()};`,
          'Projetos de atendimento, acompanhamento e desenvolvimento de pessoas;',
          'Funções de apoio técnico, gestão, planejamento e supervisão;',
        ]

  return {
    areaTitle: 'Área de atuação',
    areaDescription:
      course?.description ||
      `O profissional formado em ${title} pode construir trajetória em instituições públicas e privadas, com base técnica e visão crítica.`,
    marketTitle: 'Mercado de trabalho',
    marketIntro:
      course?.laborMarket ||
      `O mercado para ${title} segue aquecido em diferentes frentes de atuação. Entre as possibilidades mais recorrentes, destacam-se:`,
    bullets,
    marketClosing:
      course?.competitiveDifferentials ||
      'Além da atuação técnica, a carreira permite crescimento progressivo com ampliação salarial e abertura para especializações.',
  }
}

function buildDifferentials(course: CatalogCourse | undefined) {
  const lines = splitDifferentials(course?.competitiveDifferentials || '')
  const defaults = [
    {
      icon: '/course/differentials/ava.svg',
      title: 'Ambiente Virtual de Aprendizagem',
      description: 'Acesso 24 horas por dia, via aplicativo ou web, garantindo flexibilidade para estudar no seu ritmo.',
    },
    {
      icon: '/course/differentials/biblioteca.svg',
      title: 'Biblioteca digital',
      description: 'Acervo digital com livros, artigos científicos e conteúdos de apoio ao longo do curso.',
    },
    {
      icon: '/course/differentials/docentes.svg',
      title: 'Corpo docente',
      description: 'Professores com experiência acadêmica e atuação relevante no mercado.',
    },
    {
      icon: '/course/differentials/formacao.svg',
      title: 'Formação',
      description: 'Formação orientada para a prática profissional e para o desenvolvimento de competências do mercado.',
      wide: true,
    },
    {
      icon: '/course/differentials/metodologia.svg',
      title: 'Metodologia de ensino',
      description: 'Integra teoria e prática, favorecendo o raciocínio crítico e a tomada de decisão profissional.',
      wide: true,
    },
  ]

  return {
    title: 'Principais diferenciais do curso',
    items: defaults.map((item, index) => ({
      ...item,
      description: lines[index] || item.description,
    })),
  }
}

function buildSalary(title: string, areaLabel: string, courseType: CourseType): CoursePresentation['salary'] {
  const salaryArea = (areaLabel || title).toUpperCase()

  if (courseType === 'pos') {
    return {
      accentTitle: 'Salário médio na área',
      darkTitle: `de ${salaryArea}`,
      subtitle:
        `A pós-graduação é um diferencial competitivo para atuação em ${areaLabel.toLowerCase() || title.toLowerCase()}, habilitando o profissional para assumir funções estratégicas.`,
      note:
        `*Fonte: Glassdoor. Informações de mercado sobre salários de profissionais da área de ${areaLabel.toLowerCase() || title.toLowerCase()}, obtidas por meio de pesquisa realizada em 2025.`,
      items: [
        {
          label: 'Sem Pós-graduação',
          value: 'R$ 4.000,00',
          caption: 'Profissional graduado',
          height: 97,
        },
        {
          label: 'Com Pós-graduação',
          value: '+ R$ 10.500,00',
          caption: 'Profissional especialista',
          height: 180,
        },
      ],
    }
  }

  return {
    accentTitle: 'Salário médio na área',
    darkTitle: `de ${salaryArea}`,
    subtitle: 'Veja quanto você pode receber ao se especializar nessa área.',
    note:
      '*Fonte: Glassdoor. Informações de mercado sobre salários de profissionais da área, obtidas por meio de pesquisa realizada em 2025.',
    items: [
      {
        label: 'Júnior',
        value: 'R$ 4.000,00',
        caption: 'Recém-formado',
        height: 96,
      },
      {
        label: 'Pleno',
        value: 'R$ 6.700,00',
        caption: '2 a 3 anos de experiência',
        height: 136,
      },
      {
        label: 'Sênior',
        value: 'R$ 10.700,00',
        caption: '4 a 5 anos de experiência',
        height: 178,
      },
    ],
  }
}

export function getCoursePagePresentation({ course, courseType, title, area }: Input): CoursePresentation {
  const isPost = courseType === 'pos'
  const modalityLabel = course?.modalityLabel || 'EAD'
  const description = course?.description || buildGeneratedDescription(courseType, title)
  const workloadOptions =
    course?.workloadOptions.length
      ? course.workloadOptions
      : isPost
        ? ['360 Horas', '400 Horas', '600 Horas']
        : ['Carga horária conforme matriz curricular']
  const currentPrice = course?.currentInstallmentPriceMonthly || course?.currentInstallmentPrice || ''

  return {
    image: course?.image || (isPost ? '/course/hero-post.webp' : getGraduationFallbackImage(course)),
    imageAlt: `Imagem de destaque do curso ${title}`,
    modalityLabel,
    graduationHero: {
      mediaImage: course?.image || getGraduationFallbackImage(course),
      mediaAlt: `Imagem do curso de ${title}`,
      ratingLabel: 'Curso reconhecido pelo MEC',
      highlights: buildGraduationHighlights(course),
    },
    graduationProfile: {
      title: 'Perfil do Profissional',
      description: course?.competenciesBenefits || description,
    },
    heroFacts: isPost
      ? buildPostHeroFacts(course)
      : [
          {
            eyebrow: 'Formato',
            text: `${modalityLabel} com experiência acadêmica estruturada.`,
          },
          {
            eyebrow: course?.semesterCount ? `${course.semesterCount} semestres` : 'Matriz acadêmica',
            text: 'Organização curricular conforme a oferta vigente.',
          },
          {
            eyebrow: course?.durationContinuousMonths ? `${course.durationContinuousMonths} meses` : 'Duração',
            text: 'Conforme edital e disponibilidade institucional.',
          },
        ],
    infoCards: isPost ? buildPostInfoCards(course, title) : buildGraduationInfoCards(course, title),
    curriculum: isPost ? buildPostCurriculum(course, title) : buildGraduationCurriculum(course),
    salary: buildSalary(title, area || course?.primaryAreaLabel || title, courseType),
    labs: {
      title: 'Laboratórios modernos',
      description:
        isPost
          ? `Ambientes, estrutura de apoio e recursos visuais que ajudam a traduzir teoria em aplicação dentro de ${title}.`
          : `Estrutura física e tecnológica para apoiar a formação em ${title} com vivências mais próximas da prática profissional.`,
      badges: isPost ? ['Prática guiada', 'Aulas online'] : ['Aulas práticas', 'Vivência presencial'],
      bullets: [
        'Espaços pensados para ampliar repertório técnico e tomada de decisão.',
        'Atividades com foco em aplicação, observação e construção de segurança profissional.',
        'Infraestrutura alinhada à proposta pedagógica e à realidade do mercado.',
      ],
      primaryImage: '/course/graduation-labs/lab-primary.webp',
      secondaryImage: '/course/graduation-labs/lab-secondary.webp',
    },
    graduationCareer: buildGraduationCareer(course, title),
    differentials: buildDifferentials(course),
    pricing: {
      oldInstallmentText: course?.oldInstallmentPrice || '',
      currentInstallmentText: currentPrice,
      pixText: course?.pixText || '',
    },
    paymentPlanOptions:
      course?.priceItems.length
        ? course.priceItems.map((item) =>
            `${item.installmentsMax}x de ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            }).format(item.amountCents / 100)}`,
          )
        : isPost
          ? ['Consulte as condições vigentes']
          : ['Mensalidade promocional'],
    workloadOptions,
  }
}
