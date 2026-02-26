export type LegalSection = {
  title: string
  paragraphs: string[]
}

export type LegalContent = {
  pageTitle: string
  lastUpdatedLabel: string
  sections: LegalSection[]
}

export const privacyContent: LegalContent = {
  pageTitle: 'Política de Privacidade',
  lastUpdatedLabel: 'Última atualização',
  sections: [
    {
      title: '1. Introdução',
      paragraphs: [
        'Esta Política de Privacidade descreve como a Faculdade Paulista coleta, utiliza, armazena e protege os dados pessoais tratados em seus canais digitais.',
        'Ao utilizar este site, você declara que leu e está ciente das práticas descritas neste documento.',
      ],
    },
    {
      title: '2. Dados que coletamos',
      paragraphs: [
        'Podemos coletar dados informados por você, como nome, e-mail, telefone, curso de interesse e outras informações enviadas em formulários de contato ou inscrição.',
        'Também podemos coletar dados de navegação, como endereço IP, dispositivo, páginas acessadas, data e hora de acesso, além de parâmetros de campanha (ex.: UTM, gclid, fbclid, msclkid).',
      ],
    },
    {
      title: '3. Finalidades do tratamento',
      paragraphs: [
        'Os dados são utilizados para atendimento de solicitações, processo de inscrição, envio de comunicações institucionais e comerciais, análise de desempenho de campanhas e melhoria da experiência do usuário.',
        'Quando necessário, os dados poderão ser usados para cumprimento de obrigações legais e regulatórias.',
      ],
    },
    {
      title: '4. Compartilhamento de dados',
      paragraphs: [
        'Os dados podem ser compartilhados com fornecedores e parceiros que apoiam a operação da Faculdade Paulista, incluindo plataformas de CRM, marketing, tecnologia e atendimento, sempre observando medidas de segurança e confidencialidade.',
        'Não comercializamos dados pessoais.',
      ],
    },
    {
      title: '5. Cookies e tecnologias semelhantes',
      paragraphs: [
        'Utilizamos cookies e identificadores para funcionamento do site, análise de navegação e mensuração de campanhas.',
        'Você pode gerenciar cookies pelo seu navegador, ciente de que algumas funcionalidades podem ser impactadas.',
      ],
    },
    {
      title: '6. Segurança e retenção',
      paragraphs: [
        'Adotamos medidas técnicas e administrativas razoáveis para proteger os dados pessoais contra acessos não autorizados, perda, alteração ou divulgação indevida.',
        'Os dados são mantidos pelo período necessário para as finalidades informadas ou para cumprimento de obrigações legais.',
      ],
    },
    {
      title: '7. Direitos do titular',
      paragraphs: [
        'Nos termos da legislação aplicável, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade e informações sobre compartilhamento.',
        'Solicitações podem ser enviadas pelos canais oficiais de atendimento da instituição.',
      ],
    },
    {
      title: '8. Contato',
      paragraphs: [
        'Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento de dados pessoais, entre em contato pelo e-mail: contato@paulista.edu.br.',
      ],
    },
    {
      title: '9. Atualizações desta política',
      paragraphs: [
        'Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos a leitura recorrente desta página.',
      ],
    },
  ],
}

export const termsContent: LegalContent = {
  pageTitle: 'Termos de Uso',
  lastUpdatedLabel: 'Última atualização',
  sections: [
    {
      title: '1. Aceitação dos termos',
      paragraphs: [
        'Ao acessar e utilizar este site, você concorda com estes Termos de Uso e com a legislação aplicável.',
        'Caso não concorde com qualquer condição, recomendamos não utilizar os serviços disponibilizados.',
      ],
    },
    {
      title: '2. Uso permitido',
      paragraphs: [
        'O site deve ser utilizado apenas para finalidades lícitas e legítimas, sem violação de direitos de terceiros ou da legislação vigente.',
        'É vedado utilizar o site para tentativa de invasão, fraude, coleta indevida de dados ou qualquer atividade que comprometa sua integridade.',
      ],
    },
    {
      title: '3. Informações e cadastro',
      paragraphs: [
        'Ao preencher formulários, você se compromete a fornecer informações verdadeiras, completas e atualizadas.',
        'A Faculdade Paulista poderá entrar em contato para atendimento, inscrição e comunicações relacionadas aos cursos e serviços.',
      ],
    },
    {
      title: '4. Propriedade intelectual',
      paragraphs: [
        'Conteúdos, marcas, logotipos, textos, imagens e demais materiais deste site são protegidos por direitos de propriedade intelectual.',
        'É proibida a reprodução, distribuição ou uso não autorizado de qualquer conteúdo sem consentimento prévio.',
      ],
    },
    {
      title: '5. Limitação de responsabilidade',
      paragraphs: [
        'A Faculdade Paulista envida esforços para manter informações corretas e atualizadas, mas não garante ausência total de erros, interrupções ou indisponibilidade temporária.',
        'A instituição não se responsabiliza por danos decorrentes do uso inadequado do site ou de indisponibilidades ocasionais de serviços de terceiros.',
      ],
    },
    {
      title: '6. Links de terceiros',
      paragraphs: [
        'O site pode conter links para páginas externas. A Faculdade Paulista não controla e não se responsabiliza por conteúdos, políticas e práticas de sites de terceiros.',
      ],
    },
    {
      title: '7. Alterações dos termos',
      paragraphs: [
        'Estes Termos de Uso podem ser alterados a qualquer momento, sem aviso prévio. A versão vigente será sempre publicada nesta página.',
      ],
    },
    {
      title: '8. Legislação e foro',
      paragraphs: [
        'Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.',
        'Fica eleito o foro da comarca de São Paulo/SP, com renúncia de qualquer outro, por mais privilegiado que seja.',
      ],
    },
    {
      title: '9. Contato',
      paragraphs: [
        'Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: contato@paulista.edu.br.',
      ],
    },
  ],
}
