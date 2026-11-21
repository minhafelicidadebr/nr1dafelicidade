import {
  CANONICAL_MTE_2026_ASSET_URL,
  CANONICAL_PLAYBOOK_2_ASSET_URL,
} from "./scientificArticles";

export type Nr1LearningScienceTopicId =
  | "overview_gro_pdca"
  | "overview_priority_fronts"
  | "cycles_preliminary_listening"
  | "work_analysis_aep_aet"
  | "risk_matrix_iso45002"
  | "actions_5w2h_efficacy"
  | "controls_hierarchy"
  | "documents_pgr_trio_cipa"
  | "criteria_engine_versioned"
  | "governance_audit_gates";

export interface InstructionalFlowStep {
  readonly stepNumber: "01" | "02" | "03";
  readonly phaseLabel: string;
  readonly title: string;
  readonly description: string;
  readonly mteClauseTag: string;
}

export interface PracticeComparisonRow {
  readonly dimension: string;
  readonly vulnerableConventionalPractice: string;
  readonly stateOfTheArtPlatformTechnique: string;
}

export interface Nr1LearningScienceTopic {
  readonly id: Nr1LearningScienceTopicId;
  readonly shortTriggerLabel: string;
  readonly featureTitle: string;
  readonly nr1Clauses: readonly string[];
  readonly mteManualChapterRef: string;
  readonly mteNormativeRequirementSummary: string;
  readonly learningScienceTheoryBadge: string;
  readonly learningScienceNarrative: string;
  readonly cognitiveMechanismExplained: string;
  readonly instructionalFlowSteps: readonly [
    InstructionalFlowStep,
    InstructionalFlowStep,
    InstructionalFlowStep,
  ];
  readonly comparisonTable: readonly PracticeComparisonRow[];
  readonly playbook2BridgeSummary: string;
  readonly ethicalGovernanceBoundary: string;
  readonly canonicalMteDocUrl: string;
  readonly canonicalPlaybookDocUrl: string;
  readonly libraryDeepLink: string;
}

export const NR1_LEARNING_SCIENCE_CATALOG: Readonly<
  Record<Nr1LearningScienceTopicId, Nr1LearningScienceTopic>
> = {
  overview_gro_pdca: {
    id: "overview_gro_pdca",
    shortTriggerLabel: "Como este pipeline promove a NR-1 (MTE 2026)",
    featureTitle: "Pipeline Sistêmico GRO/PGR em 7 Etapas (Ciclo PDCA Ocupacional)",
    nr1Clauses: ["1.5.3.1", "1.5.3.2", "1.5.3.1.1"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulos 3 e 4 (pp. 12–16)",
    mteNormativeRequirementSummary:
      "O Ministério do Trabalho exige que o Gerenciamento de Riscos Ocupacionais (GRO) opere como um ciclo gerencial contínuo PDCA (Planejar, Fazer, Verificar, Agir), materializado nos documentos vivos do PGR e nunca como um laudo estático arquivado.",
    learningScienceTheoryBadge:
      "Teoria da Carga Cognitiva (Sweller) + Organizador Prévio (Ausubel)",
    learningScienceNarrative:
      "Na Ciência da Aprendizagem, sistemas regulatórios complexos falham quando o gestor sofre sobrecarga cognitiva extrínseca (tentar conectar planilhas soltas, formulários e normas sem ver o todo). Este pipeline aplica um Organizador Prévio Visual em 7 etapas sequenciais que reduz a carga cognitiva e guia a tomada de decisão na ordem exata exigida pela auditoria fiscal.",
    cognitiveMechanismExplained:
      "Ao visualizar o progresso encadeado (Unidades/GHE → Escuta Anônima k≥5 → Trabalho Real AEP/AET → Matriz S×P → Plano de Ação → Dossiê PGR → Trilhas Playbook 2.0), a liderança compreende que nenhuma etapa pode ser pulada sem quebrar a cadeia de causalidade preventiva.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "PLANEJAR & IDENTIFICAR (PLAN)",
        title: "Mapeamento de GHE, Escuta Coletiva e AEP",
        description:
          "Estrutura unidades, coleta percepção anônima (k≥5) e observa a atividade real para identificar perigos psicossociais e ergonômicos.",
        mteClauseTag: "NR-1 · 1.5.4.2 e 1.5.4.3",
      },
      {
        stepNumber: "02",
        phaseLabel: "AVALIAR & CONTROLAR (DO)",
        title: "Matriz S×P Determinística e Hierarquia de Controles",
        description:
          "Cruza severidade e probabilidade com travas legais e prioriza eliminação do risco na fonte e medidas coletivas no Plano de Ação.",
        mteClauseTag: "NR-1 · 1.5.4.4 e 1.5.5.1.2",
      },
      {
        stepNumber: "03",
        phaseLabel: "AFERIR & DOCUMENTAR (CHECK / ACT)",
        title: "5 Perguntas de Eficácia e Dossiê PGR Auditável",
        description:
          "Verifica se a medida produziu o efeito esperado, recalcula risco residual e emite os 3 documentos mínimos do PGR com hash SHA-256.",
        mteClauseTag: "NR-1 · 1.5.5.3.2 e 1.5.7.1",
      },
    ],
    comparisonTable: [
      {
        dimension: "Arquitetura do Processo",
        vulnerableConventionalPractice:
          "Pesquisa de clima anual isolada sem conexão com AEP, Inventário de Riscos ou PGR (vulnerável à fiscalização).",
        stateOfTheArtPlatformTechnique:
          "Pipeline PDCA integrado de 7 etapas conectando escuta coletiva, trabalho real (AEP/AET), matriz ISO 45002 e Plano de Ação.",
      },
      {
        dimension: "Proteção Cognitiva e Ética",
        vulnerableConventionalPractice:
          "Exibição de microdados em grupos pequenos (< 5 pessoas), gerando quebra de anonimato e medo de retaliação.",
        stateOfTheArtPlatformTechnique:
          "Trava matemática inviolável de k-anonimato (k ≥ 5) em todas as visualizações e relatórios.",
      },
    ],
    playbook2BridgeSummary:
      "Conecta diretamente o ciclo '1. Measure → 2. Understand → 3. Act' do Work Wellbeing Playbook 2.0 (Oxford / WWM) ao ciclo PDCA do Capítulo 3 do Manual Oficial MTE 2026.",
    ethicalGovernanceBoundary:
      "Manual MTE 2026 Cap. 8.2 (Passo 4, p. 34): A plataforma fornece o andaime metodológico e documental, mas a responsabilidade final pelas decisões e pela assinatura do PGR é interna e indelegável da organização.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  overview_priority_fronts: {
    id: "overview_priority_fronts",
    shortTriggerLabel: "Por que traduzir riscos em Drivers de Bem-Estar?",
    featureTitle: "Tradução de Fatores Críticos NR-1 em Trilhas de Intervenção (Playbook 2.0)",
    nr1Clauses: ["1.5.4.4.5.3", "1.5.5.1.1", "1.5.5.1.2"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulos 8.2 e 12 (pp. 30–35 e 74–80)",
    mteNormativeRequirementSummary:
      "Identificar um risco psicossocial no Inventário sem implementar medidas preventivas concretas na organização do trabalho configura descumprimento do item 1.5.5.1.1 da NR-1. Cada perigo priorizado exige intervenção proporcional na fonte.",
    learningScienceTheoryBadge:
      "Transferência de Aprendizagem Situada + Andaimagem (Scaffolding)",
    learningScienceNarrative:
      "Gestores frequentemente paralisam após o diagnóstico porque sabem 'onde dói' (ex.: sobrecarga ou baixa confiança), mas não sabem 'o que fazer na segunda-feira'. A ponte automática entre a dimensão crítica e os 16 Drivers do Playbook 2.0 (Oxford) atua como Andaimagem Instrucional: entrega intervenções testadas em ensaios clínicos (RCTs) e meta-análises prontas para adaptação ao trabalho real.",
    cognitiveMechanismExplained:
      "Reduz a distância cognitiva entre o indicador epidemiológico (tercil crítico COPSOQ II) e a ação gerencial concreta (ficha prática 5W2H no Plano de Ação do PGR).",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "SINAL COLETIVO PRIORIZADO",
        title: "Detecção de Dimensão em Prioridade Alta",
        description:
          "O motor identifica subescalas psicossociais em tercil crítico (> 3,66) cruzadas com achados do trabalho real no GHE.",
        mteClauseTag: "NR-1 · 1.5.4.4.5.3",
      },
      {
        stepNumber: "02",
        phaseLabel: "PONTE CIENTÍFICA OXFORD",
        title: "Acionamento do Driver Correspondente (D-R-I-V-E-R)",
        description:
          "Mapeia o fator de risco para as intervenções estruturais primárias do Work Wellbeing Playbook 2.0 (ex.: Fleming, 2024; Kelly et al., 2014).",
        mteClauseTag: "Playbook 2.0 · Ciclo Act",
      },
      {
        stepNumber: "03",
        phaseLabel: "MATERIALIZAÇÃO NO PGR",
        title: "Conversão em Medida Preventiva 5W2H",
        description:
          "Cria a ação vinculada ao PGR com responsável, prazo, indicador de aferição e trilha educativa para a liderança.",
        mteClauseTag: "NR-1 · 1.5.5.2",
      },
    ],
    comparisonTable: [
      {
        dimension: "Resposta ao Diagnóstico",
        vulnerableConventionalPractice:
          "Oferecer apenas palestras motivacionais ou apps de meditação sem alterar a carga ou o processo de trabalho (ineficaz segundo Fleming, Oxford 2024).",
        stateOfTheArtPlatformTechnique:
          "Intervenções primárias na organização do trabalho (redesenho de janelas de pico, previsibilidade e suporte gerencial FSSB).",
      },
      {
        dimension: "Rastreabilidade Científica",
        vulnerableConventionalPractice:
          "Sugestões genéricas geradas por IA livre sem fonte científica verificável.",
        stateOfTheArtPlatformTechnique:
          "Catálogo determinístico Zero-Alucinação ancorado em citações numeradas do Playbook 2.0 e capítulos do Manual MTE 2026.",
      },
    ],
    playbook2BridgeSummary:
      "Implementa a recomendação central de William Fleming (Oxford, 2024 — Playbook 2.0): priorizar mudanças estruturais e relacionais nas condições de trabalho sobre iniciativas isoladas focadas apenas no indivíduo.",
    ethicalGovernanceBoundary:
      "As recomendações do catálogo são insumos baseados em evidências científicas que devem ser contextualizados com a CIPA, os trabalhadores e o SESMT antes da homologação.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  cycles_preliminary_listening: {
    id: "cycles_preliminary_listening",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Escuta Coletiva e k≥5",
    featureTitle: "Ciclos de Escuta Psicossocial, Levantamento Preliminar e Trava de k-Anonimato (k ≥ 5)",
    nr1Clauses: ["1.5.3.3", "1.5.4.2", "1.5.4.3", "1.5.5.1.3"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulos 6 e 7 (pp. 22–29 · Figura 7)",
    mteNormativeRequirementSummary:
      "O Capítulo 6 do Manual MTE 2026 define que os trabalhadores são 'os especialistas do saber-fazer' e devem ser ouvidos nos 4 momentos essenciais do GRO (identificação de perigos, avaliação de riscos, adoção de medidas e acompanhamento), garantindo comunicação prévia clara e proteção contra exposição individual.",
    learningScienceTheoryBadge:
      "Segurança Psicológica (Edmondson) + Redução de Viés de Desejabilidade Social",
    learningScienceNarrative:
      "Sob a Ciência Cognitiva e Psicometria Ocupacional, um trabalhador só relata a verdade sobre sobrecarga, falhas de processo ou liderança desgastante quando confia matematicamente que não poderá ser identificado. A trava arquitetural de k-anonimato (k ≥ 5 respostas por recorte) aliada aos Comunicados e Cartazes QR Code cria Segurança Psicológica Institucional: elimina o viés de medo e produz dados epidemiológicos fidedignos.",
    cognitiveMechanismExplained:
      "Ao bloquear no banco de dados e na interface qualquer leitura de grupos com menos de 5 respondentes, o sistema transforma a garantia ética em uma propriedade matemática verificável pelos próprios trabalhadores e pela CIPA.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "QUALIFICAÇÃO & CONVITE (CAP. 6.1)",
        title: "Noções Básicas do GRO e Mobilização por GHE",
        description:
          "Emite comunicados e cartazes QR Code explicando a finalidade protetiva da escuta NR-1 antes da coleta (item 1.5.3.3).",
        mteClauseTag: "NR-1 · 1.5.3.3",
      },
      {
        stepNumber: "02",
        phaseLabel: "COLETA VALIDADA & TRAVA K≥5",
        title: "Instrumento Versionado (COPSOQ II / AEP) com Cofre de Privacidade",
        description:
          "Coleta percepções sem vínculo nominal. Recortes com n < 5 permanecem suprimidos até atingir representatividade segura.",
        mteClauseTag: "LGPD & Ética SST · k ≥ 5",
      },
      {
        stepNumber: "03",
        phaseLabel: "TRIAGEM PRELIMINAR (CAP. 7)",
        title: "Alimentação da AEP e Matriz de Riscos",
        description:
          "Consolida os sinais coletivos em tercis oficiais (2,33 e 3,66) para orientar a observação do trabalho real e ações imediatas.",
        mteClauseTag: "NR-1 · 1.5.4.2",
      },
    ],
    comparisonTable: [
      {
        dimension: "Qualidade da Participação",
        vulnerableConventionalPractice:
          "Enviar link de formulário sem explicar o objetivo do GRO ou permitir filtros que identifiquem equipes de 1 a 4 pessoas.",
        stateOfTheArtPlatformTechnique:
          "Kit completo de mobilização (Comunicado MTE + Cartaz QR Code por setor) + supressão automática de amostras com n < 5.",
      },
      {
        dimension: "Rigor Psicométrico",
        vulnerableConventionalPractice:
          "Perguntas improvisadas sem validação científica ou sem polaridade calibrada.",
        stateOfTheArtPlatformTechnique:
          "Instrumento versionado baseado nas 41 questões e 26 subescalas da Versão Curta Oficial do COPSOQ II + protocolo AEP NR-17.",
      },
    ],
    playbook2BridgeSummary:
      "Executa o Estágio 1 ('1. Measure') do Work Wellbeing Playbook 2.0 (Oxford) combinado à Segurança Psicológica de Amy Edmondson (Playbook 2.0 · Trust, Ref #2).",
    ethicalGovernanceBoundary:
      "A pesquisa psicométrica coletiva é um instrumento de rastreio epidemiológico de fatores organizacionais; ela não realiza diagnóstico clínico individual nem substitui a observação presencial do trabalho real (AEP/AET).",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  work_analysis_aep_aet: {
    id: "work_analysis_aep_aet",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Trabalho Real (AEP/AET) vs. Prescrito",
    featureTitle: "Avaliação Ergonômica Preliminar (AEP), Gatilhos de AET (NR-17) e Combate à Normalização do Desvio",
    nr1Clauses: ["1.5.4.3", "1.5.4.3.1", "1.5.4.3.2", "17.3.1 (NR-17)", "17.3.2 (NR-17)"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulos 8, 9 e 10 (pp. 30–50)",
    mteNormativeRequirementSummary:
      "O Manual MTE 2026 enfatiza que a identificação de perigos deve analisar a atividade em sua execução real (Trabalho Real vs. Trabalho Prescrito), combater a 'Normalização do Desvio' (Cap. 10.2, p. 43), integrar a Avaliação Ergonômica Preliminar (AEP — NR-17 item 17.3.1) e acionar a Análise Ergonômica do Trabalho (AET — item 17.3.2) quando houver necessidade de estudo aprofundado.",
    learningScienceTheoryBadge:
      "Ergonomia da Atividade (Wisner/Dejours) + Desnaturalização Cognitiva do Desvio",
    learningScienceNarrative:
      "Na neurociência organizacional, a exposição repetida a condições inadequadas (como metas inexequíveis, interrupções constantes ou falta de pausas) gera habituação neural: a equipe passa a achar 'normal' o que é um fator de risco grave — fenômeno que o MTE denomina Normalização do Desvio (Cap. 10.2). Este módulo exige triangular 3 elementos cognitivos: (1) Observação do trabalho real; (2) Escuta dos trabalhadores/CIPA; e (3) Registro estruturado de Perigo → Fonte Geradora → Circunstância → Agravo Possível.",
    cognitiveMechanismExplained:
      "Impede o erro clássico de confundir o efeito (estresse/ansiedade) com o perigo na fonte (organização do trabalho, cadência, falta de efetivo ou falha de suporte), além de exigir revisor independente e hash SHA-256.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "OBSERVAR & ESCUTAR O TRABALHO REAL",
        title: "Registro de Evidências Contextuais sem Dados Pessoais",
        description:
          "Documenta observações diretas da atividade, atas da CIPA e entrevistas coletivas confirmando ausência de dados clínicos individuais.",
        mteClauseTag: "NR-1 · 1.5.4.3.1 e NR-17 · 17.3.1",
      },
      {
        stepNumber: "02",
        phaseLabel: "ESTRUTURAR ACHADO CAUSAL (CAP. 9)",
        title: "Decomposição Perigo × Fonte × Circunstância × Grupo Exposto",
        description:
          "Vincula cada fator de risco psicossocial ou ergonômico à sua fonte geradora real no processo produtivo.",
        mteClauseTag: "Manual MTE 2026 · Cap. 9 e 10",
      },
      {
        stepNumber: "03",
        phaseLabel: "REVISÃO TÉCNICA & GATILHO DE AET",
        title: "Homologação com Hash SHA-256 ou Escalonamento para AET",
        description:
          "Aprova a AEP com revisor técnico ou dispara formalmente o gatilho de aprofundamento em AET (NR-17 item 17.3.2) com responsável e prazo.",
        mteClauseTag: "NR-17 · 17.3.2",
      },
    ],
    comparisonTable: [
      {
        dimension: "Análise da Atividade",
        vulnerableConventionalPractice:
          "Basear o PGR apenas na descrição formal do cargo (trabalho prescrito) ou apenas em questionário digital sem observar a rotina.",
        stateOfTheArtPlatformTechnique:
          "Triangulação obrigatória entre sinal coletivo (COPSOQ II), observação da atividade real e participação de trabalhadores/CIPA.",
      },
      {
        dimension: "Transição AEP → AET",
        vulnerableConventionalPractice:
          "Ignorar situações complexas ou recorrentes que exigem Análise Ergonômica do Trabalho aprofundada.",
        stateOfTheArtPlatformTechnique:
          "Rastreador estruturado de gatilhos de AET (NR-17 item 17.3.2) gerando tarefa auditável com responsável técnico e prazo.",
      },
    ],
    playbook2BridgeSummary:
      "Conecta-se ao Estágio 2 ('2. Understand') e aos drivers de Pressões de Carga de Trabalho (Workload Pressures) e Autonomia do Playbook 2.0.",
    ethicalGovernanceBoundary:
      "A AEP registrada no sistema apoia o levantamento preliminar e a avaliação ergonômica, mas não substitui a AET conduzida por profissional habilitado quando configuradas as hipóteses do item 17.3.2 da NR-17.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  risk_matrix_iso45002: {
    id: "risk_matrix_iso45002",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Matriz S×P, Regra de Ouro e Trava Legal",
    featureTitle: "Matriz Contextual 5×5 (Severidade × Probabilidade ISO 45002), Regra de Ouro e Trava Legal MTE 2026",
    nr1Clauses: ["1.5.4.4.2", "1.5.4.4.4.1", "1.5.4.4.5.1", "1.5.4.4.5.3"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulo 11 (pp. 51–73 · Figuras 31–32 e Quadro 5)",
    mteNormativeRequirementSummary:
      "O Capítulo 11 do Manual MTE 2026 estabelece que o risco ocupacional é a combinação de Severidade × Probabilidade, regida por 3 travas normativas: (1) Regra de Ouro da Severidade (1.5.4.4.4.1, p. 53): selecionar sempre o agravo de maior magnitude plausível; (2) Trava Legal da Probabilidade (1.5.4.4.5.1, p. 54): se requisito obrigatório de NR for descumprido, a probabilidade vai automaticamente ao nível máximo (5); e (3) Avaliação Psicossocial/Ergonômica (1.5.4.4.5.3): pondera duração, intensidade das exigências e eficácia comprovada dos controles coletivos.",
    learningScienceTheoryBadge:
      "Codificação Dupla (Paivio) + Calibração de Julgamento sob Risco",
    learningScienceNarrative:
      "Em processos decisórios humanos, gestores tendem ao 'viés de otimismo' (subestimar a probabilidade de adoecimento psíquico ou diluir um setor crítico na média geral da empresa). O Design Instrucional Gráfico da Matriz 5×5 aplica a Teoria da Codificação Dupla (visualização espacial + regras matemáticas determinísticas) para impedir a subestimação do risco e destacar fatores protetivos ao lado dos fatores críticos.",
    cognitiveMechanismExplained:
      "Separa visualmente o risco bruto (exigência da atividade) do risco residual (que só diminui quando existe controle coletivo/administrativo comprovadamente mantido e eficaz), bloqueando reduções artificiais baseadas apenas em EPI ou ações individuais.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "GRADAÇÃO DA SEVERIDADE (1.5.4.4.4.1)",
        title: "Aplicação da Regra de Ouro (Maior Magnitude Plausível)",
        description:
          "Avalia a gravidade potencial do agravo psicossocial/ergonômico sem diluir cenários severos por médias otimistas.",
        mteClauseTag: "Manual MTE 2026 · Cap. 11.3 (p. 53)",
      },
      {
        stepNumber: "02",
        phaseLabel: "GRADAÇÃO DA PROBABILIDADE (1.5.4.4.5.3)",
        title: "Exigências da Atividade × Eficácia dos Controles + Trava Legal",
        description:
          "Combina intensidade/duração da exposição (tercis COPSOQ II + AEP) com a eficácia dos controles. Descumprimento de NR trava P=5.",
        mteClauseTag: "Manual MTE 2026 · Cap. 11.4 (p. 54)",
      },
      {
        stepNumber: "03",
        phaseLabel: "DECISÃO & PRAZO ISO 45002 (QUADRO 5)",
        title: "Classificação Baixo / Médio / Alto / Muito Alto e Gatilho de Ação",
        description:
          "Define a prioridade e o prazo máximo de contenção (Imediato, < 3 meses, < 9 meses ou monitoramento) e cria ação em 1 clique.",
        mteClauseTag: "Manual MTE 2026 · Quadro 5 (p. 70)",
      },
    ],
    comparisonTable: [
      {
        dimension: "Cálculo da Probabilidade",
        vulnerableConventionalPractice:
          "Reduzir o nível de risco na planilha apenas porque a empresa 'planejou' uma ação futura ou entregou cartilhas individuais.",
        stateOfTheArtPlatformTechnique:
          "O risco residual só é recalculado após comprovação de implementação, manutenção e eficácia da medida coletiva (item 1.5.4.4.6 'a').",
      },
      {
        dimension: "Leitura dos 13 Fatores MTE",
        vulnerableConventionalPractice:
          "Olhar apenas uma nota global de clima sem desmembrar os fatores de organização do trabalho exigidos pelo MTE.",
        stateOfTheArtPlatformTechnique:
          "Mapeamento granular das dimensões psicossociais, fatores de proteção e recomendação determinística NEXO × Playbook 2.0.",
      },
    ],
    playbook2BridgeSummary:
      "Integra a matriz de severidade e probabilidade da ISO 45002:2023 (Manual MTE 2026, p. 68) ao motor de recomendação de intervenções dos 16 Drivers do Playbook 2.0.",
    ethicalGovernanceBoundary:
      "Os escores de risco calculados com amostra k ≥ 5 constituem avaliação técnica preliminar versionada e devem ser revisados e validados pelo responsável técnico do PGR.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  actions_5w2h_efficacy: {
    id: "actions_5w2h_efficacy",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Plano de Ação e 5 Perguntas de Eficácia",
    featureTitle: "Plano de Ação NR-1 (5W2H), Natureza Causal na Fonte e as 5 Perguntas de Aferição de Eficácia MTE 2026",
    nr1Clauses: ["1.5.5.2", "1.5.5.2.1", "1.5.5.2.2", "1.5.5.3.2", "1.5.4.4.6 'a' e 'c'"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulo 12.1 e 12.2 (pp. 74–80)",
    mteNormativeRequirementSummary:
      "O item 1.5.5.2 da NR-1 exige que toda medida de prevenção a ser implementada, aprimorada ou mantida conste em um Plano de Ação com cronograma, responsável e formas de acompanhamento e aferição de resultados. O Capítulo 12.2 (p. 78) define as 5 Perguntas-Chave que o auditor utiliza para verificar se o controle realmente funciona.",
    learningScienceTheoryBadge:
      "Aprendizagem de Circuito Duplo (Argyris) + Planejamento de Implementação (Gollwitzer)",
    learningScienceNarrative:
      "A psicologia da implementação demonstra que intenções vagas ('melhorar a comunicação') têm taxa de falha superior a 80%. Quando o gestor estrutura a ação com Ficha Prática de Execução (O quê, Como, Quem, Quando e Qual Evidência) e sabe que responderá às 5 Perguntas de Eficácia do MTE, ocorre a Aprendizagem de Circuito Duplo: a organização corrige a causa-raiz no processo de trabalho em vez de apenas cumprir tabela.",
    cognitiveMechanismExplained:
      "Classifica automaticamente cada ação em Causal (Fonte/Eliminação/Coletiva), Atenuante (Administrativa) ou Manutenção de Proteção (PDCA), bloqueando o encerramento de ações que não possuam responsável, evidência documental e critério de aferição.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "DESENHO CAUSAL 5W2H (1.5.5.2)",
        title: "Classificação na Fonte + Ficha Prática do Playbook 2.0",
        description:
          "Define a medida preventiva priorizando intervenção primária na organização do trabalho, com dono, prazo e artefato comprobatório.",
        mteClauseTag: "NR-1 · 1.5.5.1.2 e 1.5.5.2",
      },
      {
        stepNumber: "02",
        phaseLabel: "TRAVA DE GOVERNANÇA",
        title: "Validação de Evidência antes da Conclusão",
        description:
          "Impede que uma ação seja marcada como 'Concluída' sem registro de evidência verificável e responsável técnico associado.",
        mteClauseTag: "NR-1 · 1.5.5.2.2",
      },
      {
        stepNumber: "03",
        phaseLabel: "AS 5 PERGUNTAS MTE (CAP. 12.2, P. 78)",
        title: "Aferição de Resultados e Gatilho de Risco Residual",
        description:
          "Avalia: (1) Foi executada? (2) No prazo? (3) Como planejado? (4) Mantida no tempo? (5) Produziu o efeito esperado? Se falhar em 4 ou 5, aciona revisão 1.5.4.4.6 'c'.",
        mteClauseTag: "NR-1 · 1.5.5.3.2 e 1.5.4.4.6",
      },
    ],
    comparisonTable: [
      {
        dimension: "Critério de Conclusão",
        vulnerableConventionalPractice:
          "Dar baixa na ação apenas porque a data passou ou porque uma reunião aconteceu, sem aferir se o risco diminuiu.",
        stateOfTheArtPlatformTechnique:
          "Protocolo das 5 Perguntas do Cap. 12.2 do Manual MTE 2026 + trava de evidência documental obrigatória.",
      },
      {
        dimension: "Natureza da Medida",
        vulnerableConventionalPractice:
          "Lista de ações 100% focadas em mudar o comportamento do trabalhador sem tocar na gestão de demandas.",
        stateOfTheArtPlatformTechnique:
          "Selo explícito de Natureza NR-1: Causal (na Fonte) vs. Atenuante vs. Manutenção de Fator Protetivo.",
      },
    ],
    playbook2BridgeSummary:
      "Cada ação sugerida traz uma Ficha Prática de Implementação inspirada nos estudos controlados do Playbook 2.0 (ex.: higiene de reuniões de Bennett et al., 2021; metas cooperativas de Kleingeld et al., 2011).",
    ethicalGovernanceBoundary:
      "A sugestão automatizada de ações a partir do catálogo não substitui a deliberação interna da organização com suas lideranças, SESMT e CIPA.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  controls_hierarchy: {
    id: "controls_hierarchy",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Hierarquia de Controles e Divergência",
    featureTitle: "Hierarquia Legal de Controles (Eliminação → Coletivo → Administrativo → Individual) e Alerta de Divergência",
    nr1Clauses: ["1.5.5.1.2", "1.5.5.1.3", "1.5.5.3.1", "1.5.4.4.6 'c'"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulo 12.1 e 12.2 (pp. 74–79)",
    mteNormativeRequirementSummary:
      "O subitem 1.5.5.1.2 da NR-1 impõe uma ordem estrita de prioridade: (1º) Eliminar os fatores de risco na fonte; (2º) Minimizar e controlar com medidas de proteção coletiva; (3º) Adotar medidas administrativas ou de organização do trabalho; e (4º) Adotar medidas de proteção individual apenas quando as anteriores forem inviáveis, em implantação ou em caráter complementar.",
    learningScienceTheoryBadge:
      "Modelo Mental da Pirâmide Invertida (NIOSH) + Detecção de Dissonância Operacional",
    learningScienceNarrative:
      "Um dos maiores erros cognitivos em saúde mental no trabalho é tratar medidas de último nível (apoio individual paliativo) como se fossem medidas de primeiro nível (eliminação da sobrecarga ou do assédio na fonte). Ao organizar a tela na ordem exata da Pirâmide de Prevenção e cruzar os controles declarados com a percepção real dos trabalhadores no ciclo fechado, o sistema gera um Alerta de Divergência de Eficácia que corrige o ponto cego gerencial.",
    cognitiveMechanismExplained:
      "Se a empresa declara que 'já possui controle implementado' para uma dimensão, mas os trabalhadores continuam reportando risco alto (k ≥ 5), o sistema sinaliza divergência de eficácia sem alterar artificialmente o escore percebido.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "PRIORIZAÇÃO NA FONTE (1.5.5.1.2)",
        title: "Seleção Guiada pela Hierarquia Legal",
        description:
          "Apresenta primeiro controles de eliminação, substituição e engenharia/redesenho organizacional antes de medidas individuais.",
        mteClauseTag: "NR-1 · 1.5.5.1.2",
      },
      {
        stepNumber: "02",
        phaseLabel: "COMPROVAÇÃO DOCUMENTAL",
        title: "Registro de Evidência de Implementação e Manutenção",
        description:
          "Exige descrição verificável de como o controle opera na prática antes de considerá-lo pronto para revisão de risco residual.",
        mteClauseTag: "NR-1 · 1.5.5.3.1",
      },
      {
        stepNumber: "03",
        phaseLabel: "AUDITORIA DE DIVERGÊNCIA (1.5.4.4.6 'c')",
        title: "Cruzamento Controle Declarado × Risco Percebido",
        description:
          "Detecta automaticamente quando um controle declarado coexiste com risco alto persistente, recomendando revisão por ineficácia.",
        mteClauseTag: "NR-1 · 1.5.4.4.6 'c'",
      },
    ],
    comparisonTable: [
      {
        dimension: "Ordem de Prevenção",
        vulnerableConventionalPractice:
          "Tratar riscos psicossociais como 'EPI mental' (responsabilizar o trabalhador pela própria resiliência).",
        stateOfTheArtPlatformTechnique:
          "Hierarquia estrita priorizando redesenho da organização do trabalho, dimensionamento de carga e capacitação da liderança.",
      },
      {
        dimension: "Verificação de Eficácia",
        vulnerableConventionalPractice:
          "Assumir que uma política escrita no papel funciona sem confrontá-la com a percepção coletiva dos trabalhadores.",
        stateOfTheArtPlatformTechnique:
          "Motor de Divergência de Eficácia que alerta quando uma dimensão controlada no papel segue crítica na escuta coletiva.",
      },
    ],
    playbook2BridgeSummary:
      "Reflete a evidência empírica de LaMontagne et al. (2007) e Fleming (Oxford, 2024) citadas no Playbook 2.0: intervenções sistêmicas primárias superam consistentemente medidas terciárias isoladas.",
    ethicalGovernanceBoundary:
      "O alerta de divergência é um sinal consultivo para o SESMT e o responsável técnico; ele preserva a integridade do escore coletivo reportado pelos trabalhadores.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  documents_pgr_trio_cipa: {
    id: "documents_pgr_trio_cipa",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Os 3 Documentos do PGR, CIPA e PCMSO",
    featureTitle: "Dossiê Documental PGR (3 Documentos Mínimos MTE 2026), Ponte PCMSO (NR-7), 4 Momentos CIPA e Guarda de 20 Anos",
    nr1Clauses: [
      "1.5.4.4.2.2",
      "1.5.7.1",
      "1.5.7.3.2",
      "1.5.7.3.3.1",
      "1.5.3.3",
      "1.5.5.1.1 'c'",
      "1.5.8",
    ],
    mteManualChapterRef:
      "Manual Oficial MTE 2026 · Capítulos 4 (Quadro 1, p. 15), 6 (p. 23), 12.3 (p. 81), 13 (p. 95) e 15 (p. 104)",
    mteNormativeRequirementSummary:
      "O Quadro 1 do Capítulo 4 (p. 15) e o Capítulo 13 do Manual Oficial MTE 2026 determinam que o PGR é composto por no mínimo 3 documentos obrigatórios: (1) Inventário de Riscos; (2) Plano de Ação; e (3) Documento sobre os Critérios Utilizados no GRO/PGR (item 1.5.4.4.2.2). Além disso, exige retenção histórica por 20 anos (1.5.7.3.3.1), articulação com o PCMSO/NR-7 (1.5.5.1.1 'c'), protocolo dos 4 momentos da CIPA (Cap. 6) e cooperação com contratadas (1.5.8).",
    learningScienceTheoryBadge:
      "Artefatos Cognitivos Distribuídos (Hutchins) + Rastreabilidade Criptográfica",
    learningScienceNarrative:
      "Na Teoria da Cognição Distribuída, a memória institucional de uma empresa não reside na cabeça de um gestor (que pode mudar de cargo), mas em artefatos documentais estruturados, versionados e compreensíveis por todos os atores sociais (trabalhadores, CIPA, médico do trabalho do PCMSO, engenheiro de segurança e auditor fiscal). Este módulo transforma todo o ciclo técnico em documentos auditáveis com hash SHA-256 e slides pedagógicos para apresentação direta às equipes.",
    cognitiveMechanismExplained:
      "Bloqueia a emissão de documentos caso faltem pré-requisitos essenciais (como amostra k ≥ 5 ou riscos computados) e mantém histórico imutável de versões para cumprir a guarda legal de 20 anos.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "VERIFICAÇÃO DE PRONTIDÃO",
        title: "Checklist de Pré-Condições e Protocolo dos 4 Momentos CIPA",
        description:
          "Confirma unidades cadastradas, ciclo com k ≥ 5, avaliação de riscos, controles e registro de consulta à CIPA (Figura 7, p. 23).",
        mteClauseTag: "NR-1 · 1.5.3.3 e 1.5.7",
      },
      {
        stepNumber: "02",
        phaseLabel: "EMISSÃO DO TRIO PGR + PONTE PCMSO",
        title: "Inventário + Plano de Ação + 3º Documento de Critérios + NR-7",
        description:
          "Gera os 3 documentos mínimos obrigatórios do Quadro 1 (p. 15), a Ponte Técnica PGR ↔ PCMSO (Cap. 12.3) e os termos Multi-CNPJ (1.5.8).",
        mteClauseTag: "NR-1 · 1.5.4.4.2.2 e 1.5.5.1.1 'c'",
      },
      {
        stepNumber: "03",
        phaseLabel: "DEVOLUTIVA & GUARDA DE 20 ANOS",
        title: "Apresentação em Slides para Trabalhadores e Assinatura SHA-256",
        description:
          "Permite apresentar a devolutiva coletiva em 6 slides executivos (1.5.3.3 'b') e versionar o documento com hash SHA-256.",
        mteClauseTag: "NR-1 · 1.5.7.3.3.1 (20 anos)",
      },
    ],
    comparisonTable: [
      {
        dimension: "Completude do PGR",
        vulnerableConventionalPractice:
          "Emitir apenas Inventário e Plano de Ação, esquecendo o 3º Documento Mínimo Obrigatório (Critérios Utilizados — Quadro 1, p. 15 MTE 2026) e a ponte com o PCMSO.",
        stateOfTheArtPlatformTechnique:
          "Geração completa do Trio Obrigatório do PGR + Ponte Bidirecional PGR ↔ PCMSO (NR-7) + Cláusulas 1.5.5.5 e 1.5.8.",
      },
      {
        dimension: "Comunicação aos Trabalhadores",
        vulnerableConventionalPractice:
          "Guardar o PDF técnico de 80 páginas no RH sem comunicar os resultados e medidas às equipes.",
        stateOfTheArtPlatformTechnique:
          "Modo Apresentação Executiva integrado em 6 slides didáticos para reuniões de CIPA e equipes (NR-1 item 1.5.3.3).",
      },
    ],
    playbook2BridgeSummary:
      "Garante que a comunicação transparente dos resultados e ações — pilar de Confiança (Trust) e Voz do Colaborador (Employee Voice) do Playbook 2.0 — chegue efetivamente às equipes.",
    ethicalGovernanceBoundary:
      "Todos os documentos gerados são minutas técnicas rastreáveis que exigem validação, revisão e assinatura formal pelo Responsável Técnico designado pela organização.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  criteria_engine_versioned: {
    id: "criteria_engine_versioned",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: 3º Documento Mínimo (Critérios do GRO)",
    featureTitle: "Motor de Critérios Versionados de Avaliação de Risco e Tomada de Decisão (Item 1.5.4.4.2.2)",
    nr1Clauses: ["1.5.4.4.2", "1.5.4.4.2.2", "1.5.4.4.3"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulo 4 (Quadro 1, p. 15) e Capítulo 11 (pp. 51–70)",
    mteNormativeRequirementSummary:
      "O subitem 1.5.4.4.2.2 da NR-1 determina que os critérios utilizados pela organização para gradação de severidade, gradação de probabilidade, classificação de risco e tomada de decisão devem constar expressamente em documento formal vinculado ao PGR.",
    learningScienceTheoryBadge:
      "Metacognição Regulatória + Explicabilidade Algorítmica (XAI)",
    learningScienceNarrative:
      "Para que um método de avaliação seja defensável perante uma auditoria fiscal ou perícia técnica, ele não pode ser uma 'caixa-preta'. O Motor de Critérios aplica o princípio de Metacognição e Explicabilidade: explicita a versão exata da regra, o hash canônico da matriz, as limitações metodológicas e os pré-requisitos para cálculo de risco residual.",
    cognitiveMechanismExplained:
      "Bloqueia cálculos automáticos quando os critérios ou fontes técnicas não estão formalmente aprovados, evitando conclusões arbitrárias.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "DEFINIÇÃO DOS CRITÉRIOS (1.5.4.4.2)",
        title: "Parametrização de Escalas S×P e Limiares de Tolerabilidade",
        description:
          "Documenta escalas de 1 a 5, tercis psicométricos (2,33 / 3,66) e bandas de decisão baseadas na ISO 45002:2023.",
        mteClauseTag: "NR-1 · 1.5.4.4.2.2",
      },
      {
        stepNumber: "02",
        phaseLabel: "VERIFICAÇÃO DE INTEGRIDADE",
        title: "Validação de Hash Canônico e Pré-Condições AEP",
        description:
          "Garante que toda avaliação contextual aponte para uma versão imutável dos critérios aprovados.",
        mteClauseTag: "Manual MTE 2026 · Quadro 1 (p. 15)",
      },
      {
        stepNumber: "03",
        phaseLabel: "AUDITORIA & EXPORTAÇÃO",
        title: "Materialização no 3º Documento Mínimo do PGR",
        description:
          "Alimenta diretamente o documento formal de critérios exigido pela fiscalização do trabalho.",
        mteClauseTag: "NR-1 · 1.5.7.2",
      },
    ],
    comparisonTable: [
      {
        dimension: "Transparência Metodológica",
        vulnerableConventionalPractice:
          "Classificar riscos como 'Baixo' ou 'Alto' sem documentar qual fórmula, matriz ou critério de decisão foi utilizado.",
        stateOfTheArtPlatformTechnique:
          "Critérios versionados com hash criptográfico e exportação automática do 3º Documento Mínimo Obrigatório do PGR.",
      },
    ],
    playbook2BridgeSummary:
      "Alinha a mensuração rigorosa do Estágio 1 ('Measure') do Playbook 2.0 aos critérios objetivos exigidos pelo item 1.5.4.4.2.2 da NR-1.",
    ethicalGovernanceBoundary:
      "A definição e aprovação final dos critérios de risco cabem ao responsável técnico da organização conforme as características das atividades.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },

  governance_audit_gates: {
    id: "governance_audit_gates",
    shortTriggerLabel: "Ciência de Aprendizagem & NR-1: Governança por Gates, LGPD e Emergências",
    featureTitle: "Governança de Dados por Gates (G0–G3), Proteção LGPD e Prontidão para Incidentes e Emergências",
    nr1Clauses: ["1.5.3.2", "1.5.6", "1.5.7.3.3.1"],
    mteManualChapterRef: "Manual Oficial MTE 2026 · Capítulos 8.2, 13, 14 e 19 (pp. 34, 95–103 e 114)",
    mteNormativeRequirementSummary:
      "A promoção séria da NR-1 exige governança de proteção de dados sensíveis (LGPD), retenção documental segura por 20 anos (1.5.7.3.3.1), prontidão para resposta a incidentes e emergências (1.5.6) e validação técnica formal antes de qualquer operação com dados reais.",
    learningScienceTheoryBadge:
      "Engenharia de Resiliência (Hollnagel) + Aprendizagem por Simulação Segura",
    learningScienceNarrative:
      "A Engenharia de Resiliência ensina que sistemas críticos devem ser testados e validados em ambiente sintético controlado antes de operar com dados reais de trabalhadores. A arquitetura por Gates (G0 a G3) permite que gestores, auditores, DPO e SESMT exercitem toda a jornada NR-1 com dados sintéticos determinísticos, prevenindo vazamentos e erros metodológicos.",
    cognitiveMechanismExplained:
      "Impõe travas técnicas no servidor (fail-closed) que impedem o processamento de dados reais enquanto a política de retenção, o runbook de incidentes e os 4 signatários formais (DPO, Jurídico, Segurança e SST) não estiverem comprovados.",
    instructionalFlowSteps: [
      {
        stepNumber: "01",
        phaseLabel: "SEGREGAÇÃO POR CLASSES DE DADOS",
        title: "Isolamento entre Identidade, Microdados e Agregados (k ≥ 5)",
        description:
          "Garante que microdados individuais jamais sejam expostos nos painéis gerenciais ou relatórios do PGR.",
        mteClauseTag: "LGPD & NR-1 · Cap. 6",
      },
      {
        stepNumber: "02",
        phaseLabel: "SIMULAÇÃO DE INCIDENTES E EMERGÊNCIAS",
        title: "Exercício de Recuperação e Prontidão Operacional (1.5.6)",
        description:
          "Valida planos de resposta a incidentes de segurança e cenários de emergência ocupacional.",
        mteClauseTag: "NR-1 · 1.5.6",
      },
      {
        stepNumber: "03",
        phaseLabel: "HOMOLOGAÇÃO MULTIDISCIPLINAR (G0–G3)",
        title: "Evidenciação Formal antes da Liberação de Dados Reais",
        description:
          "Mantém o bloqueio protetivo de dados reais até a aprovação formal do comitê interno da organização.",
        mteClauseTag: "Manual MTE 2026 · Cap. 8.2 Passo 4",
      },
    ],
    comparisonTable: [
      {
        dimension: "Segurança e Privacidade",
        vulnerableConventionalPractice:
          "Coletar respostas reais de saúde mental em planilhas abertas sem política de retenção, sem DPO e sem trava de k-anonimato.",
        stateOfTheArtPlatformTechnique:
          "Governança fail-closed por gates com separação criptográfica de classes de dados e auditoria contínua.",
      },
    ],
    playbook2BridgeSummary:
      "Sustenta o pilar fundamental de Confiança Institucional (Trust) do Work Wellbeing Playbook 2.0 por meio de governança ética verificável.",
    ethicalGovernanceBoundary:
      "Dados reais permanecem bloqueados por padrão até o cumprimento integral do Gate G3 e das aprovações formais da organização.",
    canonicalMteDocUrl: CANONICAL_MTE_2026_ASSET_URL,
    canonicalPlaybookDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    libraryDeepLink: "/library",
  },
};

export function getNr1LearningScienceTopic(
  topicId: Nr1LearningScienceTopicId,
): Nr1LearningScienceTopic {
  return NR1_LEARNING_SCIENCE_CATALOG[topicId];
}
