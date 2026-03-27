import { assets, graduationCarouselCourseConfigs } from '@/landing/data'
import { splitDifferentials, type CatalogCourse, type CourseType } from '@/lib/catalogApi'

export type CoursePresentation = {
  image: string
  imageAlt: string
  modality: 'ead' | 'semipresencial' | 'presencial'
  modalityLabel: string
  graduationHero: {
    mediaImage: string
    mediaAlt: string
    ratingLabel: string
    ratingStars: number | null
    highlights: Array<{
      icon: string
      title: string
      text: string
    }>
  }
  graduationPortarias: Array<{
    label: string
    description: string
    href?: string
  }>
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
  paymentPlanGroups: Array<{
    workload: string
    workloadVariantId: number | null
    pricingId: number | null
    totalAmountCents: number
    currentInstallmentText: string
    paymentPlanOptions: string[]
  }>
  paymentPlanOptions: string[]
  workloadOptions: string[]
  showInternshipInfoLink: boolean
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

function formatCurrencyAmount(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCurrencyFromCents(value: number): string {
  return formatCurrencyAmount(value / 100)
}

function calculatePixAmountCents(totalAmountCents: number): number {
  if (!totalAmountCents) return 0
  return Math.floor((totalAmountCents * 0.9) / 100) * 100
}

function buildPaymentPlanOptionsFromTotal(totalAmountCents: number): string[] {
  if (!totalAmountCents) return []

  return [1, 4, 6, 12, 18].map((installments) => {
    if (installments === 1) {
      const pixAmountCents = calculatePixAmountCents(totalAmountCents)
      return `1X ${formatCurrencyFromCents(totalAmountCents)} (${formatCurrencyFromCents(pixAmountCents)} à vista no PIX)`
    }

    return `${installments}X ${formatCurrencyAmount(totalAmountCents / 100 / installments)}`
  })
}

function buildPostPaymentPlanGroups(course: CatalogCourse | undefined) {
  if (!course?.priceItems.length) return []

  const grouped = new Map<
    string,
    {
      workload: string
      workloadVariantId: number | null
      pricingId: number | null
      totalAmountCents: number
      totalHours: number
    }
  >()

  for (const item of course.priceItems) {
    const workload =
      item.totalHours > 0
        ? `${item.totalHours} Horas`
        : item.workloadName || `Carga ${grouped.size + 1}`

    const current = grouped.get(workload)
    const totalAmountCents = course.posPriceCents || item.amountCents

    if (!current || totalAmountCents < current.totalAmountCents) {
      grouped.set(workload, {
        workload,
        workloadVariantId: item.workloadVariantId,
        pricingId: item.id,
        totalAmountCents,
        totalHours: item.totalHours,
      })
    }
  }

  return [...grouped.values()]
    .sort((a, b) => {
      if (a.totalHours && b.totalHours && a.totalHours !== b.totalHours) {
        return a.totalHours - b.totalHours
      }

      return a.workload.localeCompare(b.workload, 'pt-BR')
    })
    .map((entry) => ({
      workload: entry.workload,
      workloadVariantId: entry.workloadVariantId,
      pricingId: entry.pricingId,
      totalAmountCents: entry.totalAmountCents,
      currentInstallmentText: `18X ${formatCurrencyAmount(entry.totalAmountCents / 100 / 18).toUpperCase()}/MÊS`,
      paymentPlanOptions: buildPaymentPlanOptionsFromTotal(entry.totalAmountCents),
    }))
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
      title: 'Público-Alvo',
      description: course?.targetAudience || fallback,
    },
    {
      title: 'Qualificações',
      description: course?.competenciesBenefits || fallback,
    },
    {
      title: 'Mercado de Trabalho',
      description: course?.laborMarket || course?.competitiveDifferentials || fallback,
    },
  ]
}

function buildPostHeroFacts(course: CatalogCourse | undefined, workloadOptions: string[]) {
  const workloadNumbers = workloadOptions
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
        : 'Carga horária conforme oferta'

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
      text:
        course?.modality === 'presencial'
          ? 'Aulas presenciais'
          : course?.modality === 'semipresencial'
            ? 'Aulas EAD + prática presencial'
            : 'Aulas EAD',
    },
    {
      eyebrow: durationText,
      text: 'Conforme a carga horária selecionada.',
    },
  ]
}

function buildGraduationHighlights(course: CatalogCourse | undefined) {
  const semesterCount = course?.semesterCount
    ? course.semesterCount
    : course?.durationContinuousMonths
      ? Math.ceil(course.durationContinuousMonths / 6)
      : course?.durationMonths
        ? Math.ceil(course.durationMonths / 6)
        : 0
  const durationText = semesterCount
    ? `${semesterCount} ${semesterCount === 1 ? 'semestre' : 'semestres'}`
    : course?.durationText || 'Consulte a matriz curricular'

  const modalityTitle =
    course?.modality === 'semipresencial'
      ? 'Modalidade Híbrida'
      : course?.modality === 'presencial'
        ? 'Modalidade Presencial'
        : 'Modalidade EAD'

  const modalityText =
    course?.offeringModalityText ||
    (course?.modality === 'semipresencial'
      ? 'Aulas EAD + prática presencial'
      : course?.modality === 'presencial'
        ? 'Aulas presenciais'
        : 'Aulas EAD')

  const tccTitle =
    course?.tccRequired === true ? 'Com TCC' : course?.tccRequired === false ? 'Sem TCC' : 'TCC'
  const tccText =
    course?.tccRequired === true
      ? 'Conclua seu curso com Trabalho de Conclusão'
      : course?.tccRequired === false
        ? 'Conclua seu curso sem TCC'
        : 'Consulte a matriz curricular'

  return [
    {
      icon: '/course/graduation/figma-icons/alarm_on.svg',
      title: 'Duração',
      text: durationText,
    },
    {
      icon: '/course/graduation/figma-icons/ink_pen.svg',
      title: modalityTitle,
      text: modalityText,
    },
    {
      icon: '/course/graduation/figma-icons/hourglass_top.svg',
      title: tccTitle,
      text: tccText,
    },
  ]
}

function extractHref(value: string): string | undefined {
  const match = value.match(/(https?:\/\/\S+|\/uploads\/\S+)/iu)
  return match?.[1]
}

function buildGraduationPortarias(course: CatalogCourse | undefined) {
  const ordinanceText = (course?.mecOrdinance || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const recognitionText = (course?.recognition || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const portarias: CoursePresentation['graduationPortarias'] = []

  if (ordinanceText) {
    portarias.push({
      label: /^autoriza[cç][aã]o\b/iu.test(ordinanceText) ? 'Autorização' : 'Portaria do MEC',
      description: ordinanceText,
      href: course?.mecOrdinanceDocumentUrl || extractHref(ordinanceText),
    })
  }

  if (recognitionText || course?.recognitionDocumentUrl) {
    portarias.push({
      label: 'Reconhecimento',
      description: recognitionText || 'Documento de reconhecimento do curso.',
      href: course?.recognitionDocumentUrl || extractHref(recognitionText),
    })
  }

  if (portarias.length) {
    return portarias
  }

  const labeledMatches = [...ordinanceText.matchAll(/(Autorização|Reconhecimento)\s*:\s*/giu)]

  if (labeledMatches.length > 0) {
    return labeledMatches
      .map((match, index) => {
        const label = match[1]
        const start = match.index! + match[0].length
        const end = labeledMatches[index + 1]?.index ?? ordinanceText.length
        const description = ordinanceText.slice(start, end).trim().replace(/\s*[\|;]\s*$/u, '')

        return {
          label,
          description,
          href: extractHref(description),
        }
      })
      .filter((entry) => entry.description)
  }

  return [
    {
      label: 'Portaria do MEC',
      description: ordinanceText,
      href: extractHref(ordinanceText),
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
      label: `${index + 1}º semestre`,
      title: semesterCount > 1 ? `Disciplinas do ${index + 1}º semestre` : 'Disciplinas do curso',
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

function buildDifferentials() {
  const defaults = [
    {
      icon: '/course/differentials/ava.svg',
      title: 'Ambiente Virtual de Aprendizagem',
      description:
        'Ambiente Virtual de Aprendizagem (AVA) moderno e intuitivo, com acesso 24 horas por dia, via aplicativo ou web, garantindo flexibilidade para estudar no seu ritmo, de onde estiver.',
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
    items: defaults,
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

function buildGraduationRating(course: CatalogCourse | undefined) {
  const ratingStars = course?.mecScore ?? null

  return {
    ratingLabel: ratingStars ? `Conceito Nota ${ratingStars} no MEC` : 'Curso reconhecido pelo MEC',
    ratingStars,
  }
}

export function getCoursePagePresentation({ course, courseType, title, area }: Input): CoursePresentation {
  const isPost = courseType === 'pos'
  const modality = course?.modality || 'ead'
  const modalityLabel = course?.modalityLabel || 'EAD'
  const description = course?.description || buildGeneratedDescription(courseType, title)
  const graduationRating = buildGraduationRating(course)
  const paymentPlanGroups = isPost ? buildPostPaymentPlanGroups(course) : []
  const workloadOptions =
    paymentPlanGroups.length > 0
      ? paymentPlanGroups.map((group) => group.workload)
      : course?.workloadOptions.length
        ? course.workloadOptions
        : ['Carga horária conforme oferta']
  const currentPrice =
    paymentPlanGroups[0]?.currentInstallmentText ||
    course?.currentInstallmentPriceMonthly ||
    course?.currentInstallmentPrice ||
    ''

  return {
    image: course?.image || (isPost ? '/course/hero-post.webp' : getGraduationFallbackImage(course)),
    imageAlt: `Imagem de destaque do curso ${title}`,
    modality,
    modalityLabel,
    graduationHero: {
      mediaImage: course?.image || getGraduationFallbackImage(course),
      mediaAlt: `Imagem do curso de ${title}`,
      ratingLabel: graduationRating.ratingLabel,
      ratingStars: graduationRating.ratingStars,
      highlights: buildGraduationHighlights(course),
    },
    graduationPortarias: buildGraduationPortarias(course),
    graduationProfile: {
      title: 'Perfil do Profissional',
      description: course?.competenciesBenefits || description,
    },
    heroFacts: isPost
      ? buildPostHeroFacts(course, workloadOptions)
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
    differentials: buildDifferentials(),
    pricing: {
      oldInstallmentText: course?.oldInstallmentPrice || '',
      currentInstallmentText: currentPrice,
      pixText: course?.pixText || '',
    },
    paymentPlanGroups,
    paymentPlanOptions:
      paymentPlanGroups[0]?.paymentPlanOptions ??
      (isPost ? ['Consulte as condições vigentes'] : ['Mensalidade promocional']),
    workloadOptions,
    showInternshipInfoLink: isPost && course?.modality === 'presencial',
  }
}

