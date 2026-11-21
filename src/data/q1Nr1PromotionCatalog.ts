export type ActionNatureKind = "causal" | "atenuante" | "protecao";

export type ActionExecutionSheet = {
  id: string;
  dimensionKey: string;
  driverSlug: string;
  driverLabel: string;
  title: string;
  nature: ActionNatureKind;
  objective: string;
  steps: [string, string, string, string];
  typicalOwner: string;
  referenceHorizon: string;
  efficacyKpi: string;
  normativeBasis: string;
};

export type MtePsychosocialFactorSpec = {
  id: string;
  code: string;
  title: string;
  description: string;
  relatedDimensions: string[];
  driverSlug: string;
  driverLabel: string;
  causalActionHint: string;
  protectiveStrengthLabel: string;
};

export type WorkerPresentationSlide = {
  slideNumber: number;
  number: number;
  tag: string;
  title: string;
  subtitle: string;
  bullets: string[];
  footerNote: string;
  speakerNote: string;
};

export const ACTION_NATURE_META: Record<
  ActionNatureKind,
  {
    label: string;
    shortLabel: string;
    description: string;
    pillClass: string;
  }
> = {
  causal: {
    label: "Causal · Atua na Organização do Trabalho (Fonte)",
    shortLabel: "Causal (Fonte)",
    description:
      "Atua diretamente sobre a causa organizacional (processos, carga, jornada, clareza de papéis, liderança). Prioridade técnica na hierarquia de controles da NR-01.",
    pillClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  },
  atenuante: {
    label: "Atenuante · Suporte ao Indivíduo (Nível 5)",
    shortLabel: "Atenuante (Individual)",
    description:
      "Atua no acolhimento e mitigação de sintomas individuais. Complementar às medidas causais sobre a organização do trabalho.",
    pillClass: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  },
  protecao: {
    label: "Manter / Monitorar · Fator de Proteção (PDCA)",
    shortLabel: "Manter Proteção (PDCA)",
    description:
      "Preserva e documenta condições favoráveis já conquistadas pela organização, mantendo o ciclo de melhoria contínua (ISO 45003 / Lei 14.831/2024).",
    pillClass: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  },
};

export const Q1_ACTION_EXECUTION_SHEETS: ActionExecutionSheet[] = [
  {
    id: "sheet-workload",
    dimensionKey: "quantitative_demands",
    driverSlug: "workload-absorbers",
    driverLabel: "Absorvedores de Carga de Trabalho",
    title: "Redesenho de Janelas de Pico, Pausas e Absorvedores de Carga",
    nature: "causal",
    objective:
      "Reduzir a sobrecarga quantitativa e o ritmo excessivo por meio de nivelamento de demandas, pausas de recuperação cognitiva e priorização explícita de entregas.",
    steps: [
      "1. Mapear na AEP os turnos e atividades com acúmulo de filas ou horas extras recorrentes.",
      "2. Implantar janela diária de desaceleração e pausa programada de recuperação (10–15 min) nos setores críticos.",
      "3. Definir protocolo de despriorização com a liderança ('o que sai quando entra uma urgência').",
      "4. Aferir redução de picos e percepção coletiva no ciclo seguinte (k >= 5).",
    ],
    typicalOwner: "Gestão de Operações + RH / SST",
    referenceHorizon: "30 a 60 dias",
    efficacyKpi: "% de cumprimento de pausas programadas e redução de horas extras/picos por GHE.",
    normativeBasis: "NR-01 (item 1.5.4.3 — Engenharia Organizacional) · NR-17 (item 17.4 — Organização do Trabalho) · ISO 45003",
  },
  {
    id: "sheet-change-stability",
    dimensionKey: "predictability",
    driverSlug: "safety-stability",
    driverLabel: "Segurança e Estabilidade",
    title: "Protocolo de Previsibilidade e Comunicação Prévia de Mudanças",
    nature: "causal",
    objective:
      "Aumentar a previsibilidade operacional e reduzir a ansiedade coletiva em transições de metas, escalas, processos ou estrutura.",
    steps: [
      "1. Instituir aviso prévio estruturado para mudanças de escala, processo ou sistema com antecedência mínima definida.",
      "2. Realizar ritual quinzenal de alinhamento e escuta de dúvidas por unidade/GHE antes da virada operacional.",
      "3. Publicar FAQ interno claro com impactos práticos na rotina de cada função.",
      "4. Registrar ata de participação dos trabalhadores como evidência no GRO/PGR.",
    ],
    typicalOwner: "Lideranças de Unidade + Comunicação Interna / RH",
    referenceHorizon: "30 dias",
    efficacyKpi: "% de mudanças operacionais comunicadas com ritual prévio de alinhamento documentado.",
    normativeBasis: "NR-01 (itens 1.5.3.3 e 1.5.5.2.1) · Guia MTE (Gestão de Mudanças) · ISO 45003",
  },
  {
    id: "sheet-leadership-support",
    dimensionKey: "leadership_quality",
    driverSlug: "trust-psychological-safety",
    driverLabel: "Confiança e Segurança Psicológica",
    title: "Rotina de Check-in Estruturado da Liderança e Clareza de Papéis",
    nature: "causal",
    objective:
      "Fortalecer a capacidade de gestão da liderança imediata no planejamento do trabalho, remoção de gargalos e suporte técnico à equipe.",
    steps: [
      "1. Capacitar líderes imediatos em condução de check-ins quinzenais focados em obstáculos de trabalho (e não microgerenciamento).",
      "2. Padronizar matriz de responsabilidades e fronteiras de papel nas equipes com conflito de prioridade.",
      "3. Criar canal rápido de escalonamento de bloqueios operacionais entre supervisão e gerência.",
      "4. Avaliar evolução das dimensões de suporte e clareza no reteste coletivo.",
    ],
    typicalOwner: "Desenvolvimento Organizacional (RH) + Gestores de Área",
    referenceHorizon: "45 a 90 dias",
    efficacyKpi: "% de lideranças com rotina quinzenal de suporte registrada e evolução da percepção coletiva.",
    normativeBasis: "NR-01 (item 1.5.4.3 — Medida Administrativa Estrutural) · ISO 45003",
  },
  {
    id: "sheet-respect-harassment",
    dimensionKey: "offensive_behaviors",
    driverSlug: "respect-inclusion",
    driverLabel: "Respeito e Inclusão",
    title: "Política de Respeito, Prevenção ao Assédio e Canal Seguro Independente",
    nature: "causal",
    objective:
      "Prevenir condutas ofensivas, violência ou assédio no ambiente de trabalho e garantir canal seguro e independente da pesquisa coletiva.",
    steps: [
      "1. Formalizar e divulgar a Política de Prevenção ao Assédio e Conduta com apoio da CIPA.",
      "2. Garantir canal de acolhimento e ouvidoria sigiloso, independente da pesquisa anônima e com proteção contra retaliação.",
      "3. Realizar capacitação obrigatória de lideranças e equipes sobre distinção entre conflito de trabalho e assédio.",
      "4. Auditar periodicamente o tempo de resposta e a governança do comitê de ética/CIPA.",
    ],
    typicalOwner: "Alta Administração + RH / Compliance + CIPA",
    referenceHorizon: "Imediato (15 a 30 dias)",
    efficacyKpi: "100% da liderança capacitada e canal independente auditado com protocolo ativo.",
    normativeBasis: "Lei nº 14.457/2022 · NR-01 · NR-05 (CIPA) · Convenção 190 OIT",
  },
  {
    id: "sheet-autonomy-voice",
    dimensionKey: "influence_at_work",
    driverSlug: "worker-voice",
    driverLabel: "Voz do Trabalhador e Autonomia",
    title: "Círculos de Melhoria do Trabalho Real (Escuta Ativa por GHE)",
    nature: "protecao",
    objective:
      "Manter e ampliar a autonomia operacional e a participação direta dos trabalhadores no desenho das próprias rotinas.",
    steps: [
      "1. Realizar roda mensal de 30 minutos por GHE para revisar atritos práticos do processo de trabalho.",
      "2. Permitir que a própria equipe proponha ajustes de sequência, ferramentas ou passagem de turno.",
      "3. Registrar as melhorias adotadas em ata simplificada vinculada à AEP da unidade.",
      "4. Dar retorno transparente à equipe sobre o que foi implantado e o que entrou em cronograma.",
    ],
    typicalOwner: "Coordenação de Área + Representação / CIPA",
    referenceHorizon: "Contínuo (PDCA trimestral)",
    efficacyKpi: "Número de melhorias operacionais originadas pelas equipes e implantadas por trimestre.",
    normativeBasis: "NR-01 (item 1.5.3.3 — Participação dos Trabalhadores) · NR-17 · Lei nº 14.831/2024",
  },
  {
    id: "sheet-individual-support",
    dimensionKey: "burnout",
    driverSlug: "health-recovery",
    driverLabel: "Saúde e Recuperação",
    title: "Programa de Acolhimento Psicológico (PAE/EAP) e Integração PCMSO",
    nature: "atenuante",
    objective:
      "Oferecer suporte clínico e acolhimento confidencial aos trabalhadores enquanto as medidas causais sobre a carga de trabalho são implantadas.",
    steps: [
      "1. Disponibilizar e divulgar canal de acolhimento psicológico (PAE/EAP ou rede credenciada) com sigilo estrito.",
      "2. Comunicar os achados coletivos agregados ao Médico do Trabalho responsável pelo PCMSO (NR-07).",
      "3. Orientar lideranças sobre sinais de esgotamento e encaminhamento humanizado sem exposição pessoal.",
      "4. Monitorar indicadores agregados de saúde ocupacional junto ao SESMT.",
    ],
    typicalOwner: "SESMT / Medicina do Trabalho + Benefícios (RH)",
    referenceHorizon: "30 dias",
    efficacyKpi: "Disponibilidade ativa do canal de acolhimento e registro de integração PGR ↔ PCMSO.",
    normativeBasis: "NR-01 · NR-07 (Integração PGR e PCMSO) · Hierarquia Nível 5 (Complementar à medida causal)",
  },
];

export const MTE_13_PSYCHOSOCIAL_FACTORS: MtePsychosocialFactorSpec[] = [
  {
    id: "mte-01",
    code: "MTE-01",
    title: "Excesso de demandas (Sobrecarga de trabalho)",
    description: "Volume de tarefas, pressão temporal, ritmo intenso e janelas insuficientes de recuperação.",
    relatedDimensions: ["quantitative_demands", "work_pace", "emotional_demands", "burnout"],
    driverSlug: "workload-absorbers",
    driverLabel: "Absorvedores de Carga de Trabalho",
    causalActionHint: "Nivelar janelas de pico, dimensionar efetivo por turno e instituir pausas de recuperação.",
    protectiveStrengthLabel: "Equilíbrio sustentável entre demanda e capacidade operacional",
  },
  {
    id: "mte-02",
    code: "MTE-02",
    title: "Má gestão de mudanças organizacionais",
    description: "Reestruturações, trocas de sistemas ou metas sem comunicação prévia, treinamento ou previsibilidade.",
    relatedDimensions: ["predictability", "job_insecurity"],
    driverSlug: "safety-stability",
    driverLabel: "Segurança e Estabilidade",
    causalActionHint: "Implantar rituais de comunicação prévia e alinhamento operacional por unidade/GHE.",
    protectiveStrengthLabel: "Alta previsibilidade e transparência em transições operacionais",
  },
  {
    id: "mte-03",
    code: "MTE-03",
    title: "Falta de suporte / apoio no trabalho",
    description: "Baixa disponibilidade de apoio prático e técnico da chefia imediata ou entre pares.",
    relatedDimensions: ["social_support_supervisors", "social_support_colleagues", "leadership_quality"],
    driverSlug: "trust-psychological-safety",
    driverLabel: "Confiança e Segurança Psicológica",
    causalActionHint: "Estruturar check-ins quinzenais de suporte da liderança e rituais de cooperação entre pares.",
    protectiveStrengthLabel: "Rede sólida de suporte da liderança e cooperação entre colegas",
  },
  {
    id: "mte-04",
    code: "MTE-04",
    title: "Baixo controle / Falta de autonomia",
    description: "Rigidez excessiva sobre método, ritmo, ordem das tarefas e ausência de voz do trabalhador.",
    relatedDimensions: ["influence_at_work", "possibilities_for_development"],
    driverSlug: "worker-voice",
    driverLabel: "Voz do Trabalhador e Autonomia",
    causalActionHint: "Ampliar margens de decisão na rotina e criar círculos de melhoria do trabalho real.",
    protectiveStrengthLabel: "Autonomia prática e participação ativa nas decisões da rotina",
  },
  {
    id: "mte-05",
    code: "MTE-05",
    title: "Baixa clareza de papel / função",
    description: "Ambiguidade sobre responsabilidades, metas contraditórias ou ordens conflitantes.",
    relatedDimensions: ["role_clarity", "role_conflicts"],
    driverSlug: "clear-expectations",
    driverLabel: "Expectativas Claras",
    causalActionHint: "Revisar escopo de função, critérios de priorização e alinhamento entre gestores.",
    protectiveStrengthLabel: "Papéis bem delimitados e expectativas claras de entrega",
  },
  {
    id: "mte-06",
    code: "MTE-06",
    title: "Baixas recompensas e reconhecimento",
    description: "Desequilíbrio entre o esforço dedicado e a valorização profissional, feedback ou perspectivas.",
    relatedDimensions: ["recognition", "job_satisfaction"],
    driverSlug: "recognition-appreciation",
    driverLabel: "Reconhecimento e Valorização",
    causalActionHint: "Formalizar práticas de feedback construtivo, reconhecimento de entregas e desenvolvimento.",
    protectiveStrengthLabel: "Cultura ativa de reconhecimento e valorização do esforço",
  },
  {
    id: "mte-07",
    code: "MTE-07",
    title: "Baixa justiça organizacional",
    description: "Percepção de parcialidade na distribuição de tarefas, avaliações ou resolução de conflitos.",
    relatedDimensions: ["justice_and_respect", "vertical_trust"],
    driverSlug: "fairness-equity",
    driverLabel: "Justiça e Equidade",
    causalActionHint: "Tornar critérios de distribuição de carga, avaliação e promoção transparentes e auditáveis.",
    protectiveStrengthLabel: "Percepção elevada de justiça, imparcialidade e confiança institucional",
  },
  {
    id: "mte-08",
    code: "MTE-08",
    title: "Assédio de qualquer natureza",
    description: "Exposição a humilhações, perseguição, condutas abusivas ou atenção sexual indesejada.",
    relatedDimensions: ["offensive_behaviors"],
    driverSlug: "respect-inclusion",
    driverLabel: "Respeito e Inclusão",
    causalActionHint: "Ativar protocolo de tolerância zero, canal independente de ouvidoria e capacitação (Lei 14.457/22).",
    protectiveStrengthLabel: "Ambiente psicologicamente seguro, respeitoso e protegido contra abusos",
  },
  {
    id: "mte-09",
    code: "MTE-09",
    title: "Eventos violentos ou traumáticos",
    description: "Exposição a ameaças, agressões verbais/físicas ou situações críticas no atendimento e operação.",
    relatedDimensions: ["offensive_behaviors", "emotional_demands"],
    driverSlug: "physical-emotional-safety",
    driverLabel: "Segurança Física e Emocional",
    causalActionHint: "Implantar barreiras de proteção no atendimento, protocolo de contingência e acolhimento imediato.",
    protectiveStrengthLabel: "Protocolos eficazes de proteção e prevenção a incidentes críticos",
  },
  {
    id: "mte-10",
    code: "MTE-10",
    title: "Baixa demanda (Subcarga e monotonia)",
    description: "Subutilização de competências, repetitividade extrema ou ausência de significado nas tarefas.",
    relatedDimensions: ["meaning_of_work", "possibilities_for_development"],
    driverSlug: "purpose-meaning",
    driverLabel: "Propósito e Significado",
    causalActionHint: "Enriquecer tarefas, promover rotação saudável de atividades e conectar entregas ao propósito.",
    protectiveStrengthLabel: "Trabalho com alto significado e estímulo ao desenvolvimento profissional",
  },
  {
    id: "mte-11",
    code: "MTE-11",
    title: "Maus relacionamentos no local de trabalho",
    description: "Clima de hostilidade, isolamento entre áreas ou competição predatória entre equipes.",
    relatedDimensions: ["social_community_at_work", "horizontal_trust"],
    driverSlug: "belonging-community",
    driverLabel: "Pertencimento e Comunidade",
    causalActionHint: "Revisar metas que gerem competição predatória e fortalecer rituais colaborativos interáreas.",
    protectiveStrengthLabel: "Senso de comunidade, camaradagem e confiança entre colegas",
  },
  {
    id: "mte-12",
    code: "MTE-12",
    title: "Trabalho em condições de difícil comunicação",
    description: "Ruído informacional, falta de canais para tirar dúvidas operacionais ou barreiras hierárquicas.",
    relatedDimensions: ["predictability", "role_clarity", "social_support_supervisors"],
    driverSlug: "open-communication",
    driverLabel: "Comunicação Aberta",
    causalActionHint: "Simplificar canais operacionais e garantir espaço de perguntas sem julgamento em cada turno.",
    protectiveStrengthLabel: "Comunicação fluida, acessível e bidirecional entre equipes e gestão",
  },
  {
    id: "mte-13",
    code: "MTE-13",
    title: "Trabalho remoto, híbrido ou isolado",
    description: "Dificuldade de desconexão digital, hiperconectividade fora do expediente ou isolamento social.",
    relatedDimensions: ["work_family_conflict", "social_community_at_work"],
    driverSlug: "flexibility-autonomy",
    driverLabel: "Flexibilidade e Desconexão",
    causalActionHint: "Instituir Política de Desconexão Digital, janelas sem reuniões e integração de equipes remotas.",
    protectiveStrengthLabel: "Equilíbrio saudável entre trabalho e vida pessoal com respeito à desconexão",
  },
];

export const Q1_WORKER_PRESENTATION_SLIDES: WorkerPresentationSlide[] = [
  {
    slideNumber: 1,
    tag: "SLIDE 1 · PROPÓSITO & PRIVACIDADE",
    title: "O que foi o nosso Ciclo de Escuta e Bem-Estar no Trabalho?",
    subtitle: "Construindo juntos um ambiente mais saudável, seguro e produtivo (NR-01 / GRO).",
    bullets: [
      "Realizamos uma escuta coletiva voluntária para compreender como a organização do trabalho impacta o nosso dia a dia.",
      "Proteção rigorosa de privacidade: nenhuma resposta individual é identificada ou acessível à empresa.",
      "Regra de proteção coletiva (k >= 5): resultados só são analisados em grupos com pelo menos 5 participantes.",
      "O objetivo não é avaliar pessoas, mas sim melhorar processos, carga de trabalho, suporte e condições reais.",
    ],
    footerNote: "Comunicação aos Trabalhadores · Alinhado à NR-01 (item 1.5.3.3.c) e LGPD.",
  },
  {
    slideNumber: 2,
    tag: "SLIDE 2 · PARTICIPAÇÃO & ESCUTA DO TRABALHO REAL",
    title: "Nossa Participação Coletiva e Análise do Trabalho Real (AEP)",
    subtitle: "A combinação entre a voz das equipes e a observação prática das rotinas.",
    bullets: [
      "A escuta contou com participação representativa das unidades elegíveis (amostra protegida com k >= 5).",
      "Complementamos o questionário com a Avaliação Ergonômica Preliminar (AEP) para entender o contexto real de cada setor.",
      "Os achados foram revisados tecnicamente para separar causas organizacionais de sintomas cotidianos.",
    ],
    footerNote: "Metodologia integrada: Escuta Coletiva + Análise do Trabalho Real (NR-01 / NR-17).",
  },
  {
    slideNumber: 3,
    tag: "SLIDE 3 · NOSSOS PONTOS FORTES (FATORES DE PROTEÇÃO)",
    title: "O que já funciona bem e vamos preservar (Fatores de Proteção)",
    subtitle: "Reconhecer e manter os ativos que protegem o bem-estar das nossas equipes.",
    bullets: [
      "Cooperação e senso de comunidade entre colegas nas rotinas operacionais e técnicas.",
      "Significado do trabalho e orgulho pelas entregas construídas em equipe.",
      "Compromisso de manter e monitorar esses fatores positivos em nosso ciclo contínuo (PDCA).",
    ],
    footerNote: "Alinhado à ISO 45003 e Lei nº 14.831/2024 (Promoção da Saúde Mental e Fatores de Proteção).",
  },
  {
    slideNumber: 4,
    tag: "SLIDE 4 · FRENTES PRIORITÁRIAS DE MELHORIA",
    title: "Onde vamos concentrar nossas melhorias prioritárias",
    subtitle: "Foco nos fatores que mais exigem ajustes na organização do trabalho.",
    bullets: [
      "1. Gestão de Carga e Ritmo: organizar melhor janelas de pico, pausas de recuperação e priorização de demandas.",
      "2. Previsibilidade e Mudanças: comunicar alterações de processos e metas com antecedência e alinhamento prévio.",
      "3. Suporte e Clareza de Papéis: fortalecer check-ins quinzenais de apoio para remover bloqueios operacionais.",
    ],
    footerNote: "Priorização técnica focada nas causas organizacionais (Top Frentes do Ciclo).",
  },
  {
    slideNumber: 5,
    tag: "SLIDE 5 · PLANO DE AÇÃO & TRILHAS DE BEM-ESTAR",
    title: "O que a organização vai fazer na prática (Plano de Ação)",
    subtitle: "Medidas estruturais na fonte do trabalho conectadas às Trilhas de Bem-Estar.",
    bullets: [
      "Ações Causais (Na Fonte): redesenho de fluxos em horários de pico e protocolo de comunicação prévia de mudanças.",
      "Trilhas de Bem-Estar para Lideranças e Equipes: práticas recomendadas de Segurança Psicológica e Absorvedores de Carga.",
      "Cada ação possui responsável nomeado, cronograma definido e indicador de acompanhamento no PGR.",
    ],
    footerNote: "Hierarquia de Controles NR-01 (item 1.5.4.3 e 1.5.5.2.1) — Prioridade para ações causais.",
  },
  {
    slideNumber: 6,
    tag: "SLIDE 6 · PRÓXIMOS PASSOS & CANAIS PERMANENTES",
    title: "Acompanhamento Contínuo e Canais de Apoio",
    subtitle: "Um compromisso permanente, não um evento isolado.",
    bullets: [
      "Acompanhamento trimestral das ações junto às lideranças, SST e representação dos trabalhadores / CIPA.",
      "Canais permanentes de acolhimento, ouvidoria e suporte funcionam de forma independente e confidencial.",
      "Novo ciclo de reavaliação programado para medir a evolução real percebida pelas equipes.",
    ],
    footerNote: "Documento preliminar de devolutiva coletiva — sujeito à validação do responsável técnico.",
  },
];

export const Q1_SURVEY_SUPPORT_NOTES: Record<string, string> = {
  "Exigências e Ritmo":
    "Nota de apoio: Pense na sua rotina das últimas 4 semanas — considere o volume de tarefas, os prazos e se o tempo disponível é suficiente sem precisar acelerar excessivamente.",
  "Autonomia e Desenvolvimento":
    "Nota de apoio: Refere-se ao quanto você consegue opinar ou organizar a ordem, o método e o ritmo das suas atividades diárias, além de aprender coisas novas.",
  "Liderança e Apoio":
    "Nota de apoio: Pense no suporte prático, orientação, clareza de prioridades e escuta que você recebe da sua liderança imediata e colegas no dia a dia.",
  "Relações, Justiça e Segurança":
    "Nota de apoio: Considere como as decisões, mudanças e conflitos são conduzidos na sua área e se o ambiente cotidiano é pautado pelo respeito mútuo.",
  "Saúde, Energia e Bem-Estar":
    "Nota de apoio: Pense em como você tem se sentido física e mentalmente ao final da jornada de trabalho nas últimas 4 semanas.",
};

export function getSurveySupportNote(section?: string | null): string {
  if (!section) {
    return "Nota de apoio: Pense na sua experiência real de trabalho nas últimas 4 semanas. Não há resposta certa ou errada; escolha a opção que melhor retrata a sua rotina.";
  }
  for (const [key, note] of Object.entries(Q1_SURVEY_SUPPORT_NOTES)) {
    if (section.toLowerCase().includes(key.toLowerCase().split(" ")[0])) {
      return note;
    }
  }
  return "Nota de apoio: Pense na sua experiência real de trabalho nas últimas 4 semanas. Não há resposta certa ou errada; escolha a opção que melhor retrata a sua rotina.";
}
