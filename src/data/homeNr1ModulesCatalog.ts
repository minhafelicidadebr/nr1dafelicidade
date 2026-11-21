/**
 * Catálogo de Ciência de Aprendizagem & Design Instrucional Gráfico 5 Estrelas
 * para os 9 Módulos Operacionais NR-1 da Página Principal ("Onde estão as funcionalidades NR-1?").
 */

export type HomeNr1ModuleId =
  | "dashboard"
  | "company"
  | "units"
  | "cycles"
  | "risk"
  | "actions"
  | "controls"
  | "documents"
  | "estrategia";

export interface HomeNr1ModuleWorkflowStep {
  step: "01" | "02" | "03" | "04";
  stageLabel: string;
  title: string;
  detail: string;
}

export interface HomeNr1ModuleAuditRow {
  artifact: string;
  mteRequirement: string;
  generatedEvidence: string;
  executiveValue: string;
}

export interface HomeNr1ModuleLearningSpec {
  id: HomeNr1ModuleId;
  label: string;
  path: string;
  lenteBadge: string;
  headline: string;
  subtitle: string;
  mteNormativeBasis: string;
  oxfordPlaybookAnchor: string;
  learningSciencePrinciple: string;
  scaffoldingTriad: [
    { code: "01"; title: string; summary: string },
    { code: "02"; title: string; summary: string },
    { code: "03"; title: string; summary: string },
  ];
  workflowSteps: [
    HomeNr1ModuleWorkflowStep,
    HomeNr1ModuleWorkflowStep,
    HomeNr1ModuleWorkflowStep,
    HomeNr1ModuleWorkflowStep,
  ];
  auditTable: HomeNr1ModuleAuditRow[];
  strategiaQuestion: string;
  strategiaIntent: string;
}

export const HOME_NR1_MODULES_CATALOG: readonly HomeNr1ModuleLearningSpec[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/app",
    lenteBadge: "Visão Sistêmica · 4 Lentes PDCA",
    headline: "Cockpit Executivo de Governança Psicossocial & Prontidão NR-1",
    subtitle:
      "Consolida em uma única superfície de baixa carga cognitiva o status do ciclo, a trava de k-anonimato (k≥5), os riscos prioritários S×P e a prontidão documental do PGR.",
    mteNormativeBasis: "NR-1 Subitem 1.5.3.1 (GRO / PDCA) · Manual Oficial MTE 2026 Cap. 2 e Cap. 4",
    oxfordPlaybookAnchor: "Ciclo Medir → Compreender → Agir (University of Oxford, 2025)",
    learningSciencePrinciple:
      "Teoria da Carga Cognitiva (Sweller) & Dupla Codificação (Paivio): agrupa KPIs complexos em blocos semafóricos progressivos.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "É a torre de controle do gestor SST/RH e da Alta Liderança. Mostra instantaneamente onde a organização está na jornada entre o cadastro estrutural e a emissão do laudo PGR.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Materializa o gerenciamento contínuo (PDCA) exigido no item 1.5.3 da NR-1, impedindo que a avaliação psicossocial seja um evento isolado sem plano de ação ou acompanhamento.",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Elimina a paralisia analítica por meio de um Stepper de Jornada (JourneyStepper) e cartões de próxima decisão que guiam o usuário passo a passo.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "TELEMETRIA",
        title: "Leitura do Ciclo Ativo",
        detail: "Sincroniza unidades, adesão de respostas e status k≥5.",
      },
      {
        step: "02",
        stageLabel: "SÍNTESE S×P",
        title: "Destaque de Prioridades",
        detail: "Exibe dimensões críticas/altas e o Driver Oxford líder.",
      },
      {
        step: "03",
        stageLabel: "GOVERNANÇA",
        title: "Status de Ações e Controles",
        detail: "Monitora prazos, evidências e divergências de eficácia.",
      },
      {
        step: "04",
        stageLabel: "DECISÃO",
        title: "Roteamento Direto",
        detail: "Conduz com 1 clique ao módulo que exige ação imediata.",
      },
    ],
    auditTable: [
      {
        artifact: "Stepper de Jornada GRO/PGR",
        mteRequirement: "NR-1 item 1.5.3.1 (Planejar, Desenvolver, Controlar, Agir)",
        generatedEvidence: "Trilha temporal de completude por etapa",
        executiveValue: "Visibilidade imediata de gargalos operacionais",
      },
      {
        artifact: "Painel de KPIs com Trava k≥5",
        mteRequirement: "Manual MTE 2026 Cap. 6 e LGPD (Proteção contra exposição individual)",
        generatedEvidence: "Selo de amostra elegível vs. recortes suprimidos",
        executiveValue: "Segurança jurídica e confiança dos trabalhadores",
      },
      {
        artifact: "Radar de Prontidão Documental",
        mteRequirement: "NR-1 item 1.5.7.1 (Documentação mínima do PGR)",
        generatedEvidence: "Checklist automático de pré-requisitos para o DRPS",
        executiveValue: "Previsibilidade para auditorias e reuniões de Conselho",
      },
    ],
    strategiaQuestion: "Por onde devo começar no Dashboard NR-1 e o que cada indicador representa?",
    strategiaIntent: "overview.dashboard",
  },
  {
    id: "company",
    label: "Empresa",
    path: "/app/company",
    lenteBadge: "Lente 1 · Fundação Estrutural",
    headline: "Caracterização Institucional, Setores e Governança de Acesso ao GRO",
    subtitle:
      "Estabelece a identidade jurídica e organizacional que ancora o Inventário de Riscos do PGR, os setores produtivos e o controle de acesso de gestores e especialistas SST/RH.",
    mteNormativeBasis: "NR-1 Subitem 1.5.3.1.1 (Estabelecimento / Organização) · Guia MTE 2026 Cap. 3 e Cap. 5",
    oxfordPlaybookAnchor: "Governança Organizacional & Alinhamento Estratégico de Liderança",
    learningSciencePrinciple:
      "Ancoragem Contextual (Ausubel): conecta a estrutura real da empresa antes de introduzir métricas psicométricas abstratas.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "Módulo onde a organização registra sua razão social, setor econômico, porte, estrutura de departamentos e códigos seguros de convite para a equipe técnica.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Garante que o PGR reflita fielmente o estabelecimento e seus processos operacionais (Cap. 5 do Manual MTE 2026 — Levantamento Preliminar e Caracterização).",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Organiza a árvore corporativa de forma visual para que RH e SESMT falem a mesma língua ao classificar ambientes e processos de trabalho.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "CADASTRO",
        title: "Identidade & Porte",
        detail: "Define razão social, CNAE/setor e faixa de colaboradores.",
      },
      {
        step: "02",
        stageLabel: "SETORIZAÇÃO",
        title: "Árvore de Setores",
        detail: "Mapeia áreas macro para agregação segura de dados.",
      },
      {
        step: "03",
        stageLabel: "RBAC / ACESSO",
        title: "Convite para Gestores",
        detail: "Gera código controlado para SST, RH e lideranças.",
      },
      {
        step: "04",
        stageLabel: "VÍNCULO PGR",
        title: "Metadados de Laudo",
        detail: "Alimenta automaticamente a capa dos PDFs auditáveis.",
      },
    ],
    auditTable: [
      {
        artifact: "Ficha Institucional da Organização",
        mteRequirement: "NR-1 item 1.5.7.3.2 (Identificação do estabelecimento no PGR)",
        generatedEvidence: "Metadados canônicos na capa do DRPS e Plano de Ação",
        executiveValue: "Padronização multi-unidades e conformidade cadastral",
      },
      {
        artifact: "Mapa de Setores Funcionais",
        mteRequirement: "Guia MTE 2026 Cap. 5 (Compreensão do contexto produtivo)",
        generatedEvidence: "Taxonomia organizacional vinculada às unidades",
        executiveValue: "Comparabilidade entre áreas sem perda de rastreio",
      },
      {
        artifact: "Controle de Acesso por Código",
        mteRequirement: "LGPD Art. 46 (Medidas técnicas e administrativas de segurança)",
        generatedEvidence: "Segregação entre área de gestão (/app) e coleta anônima",
        executiveValue: "Governança estrita de quem visualiza relatórios",
      },
    ],
    strategiaQuestion: "Por que o cadastro da empresa e dos setores é fundamental para o GRO/PGR?",
    strategiaIntent: "company.gro",
  },
  {
    id: "units",
    label: "Unidades",
    path: "/app/units",
    lenteBadge: "Lente 1 · Recorte GES / GHE",
    headline: "Modelagem de Unidades Operacionais e Grupos de Exposição Similar (GES/GHE)",
    subtitle:
      "Define os recortes de análise (filiais, turnos, equipes ou processos) calibrados para garantir homogeneidade de exposição ocupacional e amostra mínima de k-anonimato (k≥5).",
    mteNormativeBasis: "NR-1 Subitem 1.5.4.3.1 (Grupo de Exposição Similar — GES) · Guia MTE 2026 Cap. 7 e Cap. 8",
    oxfordPlaybookAnchor: "Segmentação Contextual para Intervenções Direcionadas",
    learningSciencePrinciple:
      "Chunking Estrutural (Miller): divide a complexidade organizacional em grupos homogêneos compreensíveis e acionáveis.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "Permite criar e dimensionar as unidades ou Grupos de Exposição Similar (GES) que receberão os convites do ciclo de avaliação psicossocial e ergonômica.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Atende diretamente ao conceito de GES do Manual MTE 2026 (Cap. 7.3): agrupar trabalhadores submetidos às mesmas exigências de atividade, ritmo, turno e gestão.",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Sinaliza visualmente quando uma unidade tem efetivo muito pequeno (< 5 pessoas), ensinando o gestor a agrupar recortes antes da coleta para preservar o sigilo.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "RECORTE GES",
        title: "Definição da Unidade",
        detail: "Cria filial, diretoria, turno ou célula operacional.",
      },
      {
        step: "02",
        stageLabel: "HEADCOUNT",
        title: "Dimensionamento Amostral",
        detail: "Registra o efetivo previsto para cálculo de meta k≥5.",
      },
      {
        step: "03",
        stageLabel: "CALIBRAGEM",
        title: "Prevenção de Supressão",
        detail: "Alerta sobre grupos com menos de 5 trabalhadores.",
      },
      {
        step: "04",
        stageLabel: "DRILLDOWN",
        title: "Comparação por Unidade",
        detail: "Habilita leitura desagregada segura na Matriz de Riscos.",
      },
    ],
    auditTable: [
      {
        artifact: "Inventário de Unidades & GES/GHE",
        mteRequirement: "NR-1 item 1.5.4.3.1 (Avaliação por grupo de trabalhadores com exposição similar)",
        generatedEvidence: "Registro estruturado de unidades, setores e headcount",
        executiveValue: "Precisão cirúrgica para saber onde intervir",
      },
      {
        artifact: "Validador Preventivo de Amostra (k≥5)",
        mteRequirement: "Guia MTE 2026 Cap. 6 e LGPD (Anonimato na escuta dos trabalhadores)",
        generatedEvidence: "Bloqueio automático de drilldown em unidades com n < 5",
        executiveValue: "Elimina risco de retaliação ou identificação individual",
      },
      {
        artifact: "Mapa de Mobilização por Unidade",
        mteRequirement: "NR-1 item 1.5.3.3 (Participação efetiva dos trabalhadores)",
        generatedEvidence: "Planilha CSV/PDF de planejamento de coleta sem dados pessoais",
        executiveValue: "Alta taxa de adesão com governança de privacidade",
      },
    ],
    strategiaQuestion: "Como organizar unidades e GES/GHE preservando o k-anonimato (k≥5)?",
    strategiaIntent: "units.organize",
  },
  {
    id: "cycles",
    label: "Ciclos",
    path: "/app/cycles",
    lenteBadge: "Lente 1 · Mensurar (COPSOQ II + CIPA)",
    headline: "Gestão de Ciclos de Escuta Científica, Tokens Anônimos e Engajamento k≥5",
    subtitle:
      "Opera campanhas periódicas com o instrumento validado COPSOQ II, geração de tokens criptográficos de uso único, QR Codes por unidade e monitoramento em tempo real da meta k≥5.",
    mteNormativeBasis: "NR-1 Subitens 1.5.3.3 e 1.5.4.4.6 · Guia Oficial MTE 2026 Cap. 6, Cap. 8.2 e Cap. 11",
    oxfordPlaybookAnchor: "Pilar 1: Medir com Instrumentos Validados e Periodicidade Consistente",
    learningSciencePrinciple:
      "Feedback Formativo em Tempo Real (Hattie): exibe o progresso da coleta sem expor respostas antes do fechamento seguro.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "É o motor de campanha onde o gestor abre o ciclo (ex.: Semestral/Anual), seleciona a versão do COPSOQ II, emite convites anônimos (links/QR) e acompanha a adesão.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Garante a escuta estruturada dos trabalhadores como 'especialistas do saber-fazer' (Cap. 6 MTE 2026) e controla a revisão periódica bienal/trienal (item 1.5.4.4.6).",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Oferece kits prontos de comunicação em PDF (convite ético aos trabalhadores, alinhamento com CIPA e lideranças) que aumentam a segurança psicológica para responder.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "ABERTURA",
        title: "Configuração do Ciclo",
        detail: "Define horizonte, janela temporal e versão COPSOQ II.",
      },
      {
        step: "02",
        stageLabel: "TOKENS & QR",
        title: "Convites de Uso Único",
        detail: "Gera links anônimos sem rastrear e-mail ou CPF.",
      },
      {
        step: "03",
        stageLabel: "ADESÃO k≥5",
        title: "Monitoramento de Meta",
        detail: "Acompanha quantas respostas faltam por unidade.",
      },
      {
        step: "04",
        stageLabel: "FECHAMENTO",
        title: "Trava e Cômputo S×P",
        detail: "Encerra a coleta e libera os agregados elegíveis.",
      },
    ],
    auditTable: [
      {
        artifact: "Gerador de Tokens Anônimos & QR Code",
        mteRequirement: "Guia MTE 2026 Cap. 6 (Escuta protegida e livre de coação)",
        generatedEvidence: "1 token = 1 resposta válida = 0 vínculo com identidade pessoal",
        executiveValue: "Sinceridade máxima nas respostas e zero passivo LGPD",
      },
      {
        artifact: "Painel de Adesão e Meta k-Anonimato",
        mteRequirement: "NR-1 item 1.5.4.4 (Representatividade na avaliação de riscos)",
        generatedEvidence: "Relatório auditável de taxa de resposta por unidade/GES",
        executiveValue: "Garante validade estatística antes de gerar o PGR",
      },
      {
        artifact: "Comunicados Orientativos do Ciclo (.pdf)",
        mteRequirement: "NR-1 item 1.5.3.3 'c' (Comunicação aos trabalhadores sobre riscos)",
        generatedEvidence: "PDFs institucionais de mobilização e devolutiva coletiva",
        executiveValue: "Engajamento da CIPA e das lideranças desde o dia 1",
      },
    ],
    strategiaQuestion: "Como funcionam os tokens únicos e quantas respostas faltam para atingir k≥5?",
    strategiaIntent: "cycles.k5_gap",
  },
  {
    id: "risk",
    label: "Riscos",
    path: "/app/risk",
    lenteBadge: "Lente 1 → 3 · Matriz AIHA 5×5 (S×P)",
    headline: "Matriz Determinística de Riscos Psicossociais (S×P), NEXO & Drilldown por Unidade",
    subtitle:
      "Cruza a Severidade intrínseca da dimensão com a Probabilidade observada (% desfavorável + exposição da atividade real AEP) na matriz AIHA 5×5, conectando cada risco aos Drivers de Oxford.",
    mteNormativeBasis: "NR-1 Subitens 1.5.4.4.2 a 1.5.4.4.5 · Guia Oficial MTE 2026 Cap. 8.2, Cap. 9 e Cap. 11",
    oxfordPlaybookAnchor: "Pilar 2: Compreender Causas Organizacionais e Mapear para os 16 Drivers DRIVER",
    learningSciencePrinciple:
      "Representação Múltipla & Sinalização Visual (Mayer): traduz escores psicométricos em matriz 5×5, faixas de risco e recomendações acionáveis.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "É o núcleo analítico onde os dados coletados (com k≥5) são computados na equação R = Severidade × Probabilidade (1 a 25), ranqueando as dimensões do COPSOQ II.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Cumpre o Cap. 9 e o Cap. 11 do Manual MTE 2026: gradação de severidade e probabilidade com critérios claros, vedando diagnósticos clínicos e focando nos fatores do trabalho.",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "A Ponte Consultiva NEXO explica em linguagem executiva o que cada dimensão significa no trabalho real, quais fatores MTE estão envolvidos e qual Driver de Oxford acionar.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "CÔMPUTO",
        title: "Equação R = S × P",
        detail: "Combina severidade normativa com probabilidade coletiva.",
      },
      {
        step: "02",
        stageLabel: "MATRIZ 5×5",
        title: "Gradação AIHA",
        detail: "Classifica em Baixo, Moderado, Alto ou Crítico (R≥20).",
      },
      {
        step: "03",
        stageLabel: "PONTE NEXO",
        title: "Tradução MTE × Oxford",
        detail: "Vincula o risco ao fator NR-1 e ao Driver do Playbook 2.0.",
      },
      {
        step: "04",
        stageLabel: "CONVERSÃO",
        title: "1-Clique para Ação",
        detail: "Gera item pré-preenchido no Plano de Ação do PGR.",
      },
    ],
    auditTable: [
      {
        artifact: "Matriz Visual AIHA 5×5 (Severidade × Probabilidade)",
        mteRequirement: "NR-1 item 1.5.4.4.2 (Combinação de severidade e probabilidade de ocorrência)",
        generatedEvidence: "Posicionamento auditável de cada dimensão com n≥5",
        executiveValue: "Priorização racional de onde alocar recursos primeiro",
      },
      {
        artifact: "Ponte Consultiva NEXO (COPSOQ II → NR-1 → Oxford)",
        mteRequirement: "Guia MTE 2026 Cap. 11 (Conexão entre perigo psicossocial e organização do trabalho)",
        generatedEvidence: "Dossiê técnico relacionando dimensão, fator MTE e intervenção na fonte",
        executiveValue: "Traduz dados científicos em decisões práticas de gestão",
      },
      {
        artifact: "Drilldown por Unidade com Proteção k≥5",
        mteRequirement: "NR-1 item 1.5.4.3.1 (Avaliação por GES) + LGPD",
        generatedEvidence: "Comparativo entre unidades elegíveis e registro de supressão segura",
        executiveValue: "Identifica focos críticos localizados sem expor pessoas",
      },
    ],
    strategiaQuestion: "Quais são os 3 riscos mais prioritários deste ciclo e como interpretar S×P?",
    strategiaIntent: "risk.explain_top3",
  },
  {
    id: "actions",
    label: "Ações",
    path: "/app/actions",
    lenteBadge: "Lente 3 · Transformar (5W2H & Aferição)",
    headline: "Plano de Ação Preventivo do PGR com Responsáveis, Prazos, KPIs e Aferição de Eficácia",
    subtitle:
      "Converte cada risco priorizado em medidas de prevenção rastreáveis, estruturadas com cronograma, responsável, evidência objetiva e critérios de aferição exigidos pelo MTE.",
    mteNormativeBasis: "NR-1 Subitens 1.5.5.2 e 1.5.5.3.2 · Guia Oficial MTE 2026 Cap. 12 (Plano de Ação)",
    oxfordPlaybookAnchor: "Pilar 3: Agir com Intervenções Organizacionais Baseadas em Evidências",
    learningSciencePrinciple:
      "Intenção de Implementação (Gollwitzer) & Prática Deliberada (Ericsson): transforma metas vagas em compromissos verificáveis com critério de sucesso.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "Módulo onde riscos altos/críticos viram planos de ação concretos com responsável nomeado, prazo, indicador de sucesso (KPI), registro de evidência e data de revisão.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Atende integralmente ao Cap. 12 do Manual MTE 2026 (item 1.5.5.2): toda medida de prevenção deve possuir cronograma, formas de acompanhamento e aferição de resultados.",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Um motor de governança avalia automaticamente se cada ação está 'Pronta para Documento' (com evidência, KPI e revisão), educando o gestor a não deixar ações órfãs no PGR.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "ORIGEM",
        title: "Vínculo com o Risco",
        detail: "Nasce diretamente da dimensão crítica/alta ou Driver Oxford.",
      },
      {
        step: "02",
        stageLabel: "ESTRUTURA",
        title: "Responsável & Prazo",
        detail: "Define dono da ação, cronograma e escopo coletivo.",
      },
      {
        step: "03",
        stageLabel: "AFERIÇÃO",
        title: "KPI & Evidência Objetiva",
        detail: "Registra ata, mudança de rotina ou métrica de acompanhamento.",
      },
      {
        step: "04",
        stageLabel: "LAUDO PGR",
        title: "Consolidação no PDF",
        detail: "Integra o 2º Documento Obrigatório do PGR (Plano de Ação).",
      },
    ],
    auditTable: [
      {
        artifact: "Registro Estruturado de Ação Preventiva",
        mteRequirement: "NR-1 item 1.5.5.2.1 (Cronograma, formas de acompanhamento e aferição)",
        generatedEvidence: "Card auditável com status, responsável, prazo e KPI",
        executiveValue: "Accountability clara perante a Diretoria e fiscalização",
      },
      {
        artifact: "Validador de Governança da Ação",
        mteRequirement: "Guia MTE 2026 Cap. 12.2 (Acompanhamento da implementação e eficácia)",
        generatedEvidence: "Score de prontidão documental das ações ativas",
        executiveValue: "Impede que o PGR seja emitido com ações genéricas ou vazias",
      },
      {
        artifact: "Catálogo de Intervenções Sugeridas na Fonte",
        mteRequirement: "NR-1 item 1.5.5.1.1 (Prioridade para medidas coletivas e organizacionais)",
        generatedEvidence: "Ações pré-calibradas pelos 16 Drivers do Playbook 2.0",
        executiveValue: "Economiza dezenas de horas técnicas de SST e RH",
      },
    ],
    strategiaQuestion: "Como criar uma ação a partir de um risco e que evidência de aferição devo anexar?",
    strategiaIntent: "actions.create_from_risk",
  },
  {
    id: "controls",
    label: "Controles",
    path: "/app/controls",
    lenteBadge: "Lente 3 · Hierarquia NR-1 & ISO 45003",
    headline: "Catálogo e Governança da Hierarquia de Controles (Eliminação → Redesenho → Administrativo)",
    subtitle:
      "Gerencia as barreiras preventivas permanentes da organização, classificadas rigorosamente pela hierarquia de controles da NR-1 / ISO 45003 e auditadas contra o risco remanescente.",
    mteNormativeBasis: "NR-1 Subitens 1.5.5.1.1 e 1.5.5.3.2 · Guia Oficial MTE 2026 Cap. 10 e Cap. 11.6",
    oxfordPlaybookAnchor: "Intervenções Estruturais no Desenho do Trabalho (Primary/Organizational Redesign)",
    learningSciencePrinciple:
      "Detecção de Conflito Cognitivo / Divergência: alerta quando um controle é declarado 'ativo', mas o risco coletivo permanece alto no ciclo fechado.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "Enquanto o Plano de Ação gerencia projetos com início e fim, o módulo Controles mantém o inventário vivo das medidas de prevenção já implantadas na rotina da empresa.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Aplica a hierarquia estrita do Cap. 10 do Manual MTE 2026: prioriza eliminação do perigo e controles de engenharia/organização do trabalho na fonte antes de medidas individuais.",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "O motor de Divergência de Eficácia cruza controles declarados com os escores reais de risco, ensinando a equipe técnica quando um controle precisa ser corrigido ou substituído.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "CATÁLOGO",
        title: "Seleção na Hierarquia",
        detail: "Prioriza controles primários e de redesenho do trabalho.",
      },
      {
        step: "02",
        stageLabel: "EVIDÊNCIA",
        title: "Lastro de Implantação",
        detail: "Documenta como o controle opera na prática diária.",
      },
      {
        step: "03",
        stageLabel: "AUDITORIA",
        title: "Cruzamento com Risco",
        detail: "Detecta divergência se o risco continuar alto (R≥15).",
      },
      {
        step: "04",
        stageLabel: "REVISÃO GRO",
        title: "Ajuste Contínuo",
        detail: "Alimenta a revisão de risco residual no documento PGR.",
      },
    ],
    auditTable: [
      {
        artifact: "Classificador de Hierarquia de Controles",
        mteRequirement: "NR-1 item 1.5.5.1.1 (Ordem de prioridade das medidas de prevenção)",
        generatedEvidence: "Distinção formal entre controle na fonte, administrativo e suporte",
        executiveValue: "Demonstra ao auditor fiscal que a empresa não terceiriza a culpa ao indivíduo",
      },
      {
        artifact: "Detector de Divergência (Controle × Risco Remanescente)",
        mteRequirement: "NR-1 item 1.5.5.3.2 (Correção de medidas quando verificada ineficácia)",
        generatedEvidence: "Alerta consultivo automático no painel de Documentos PGR",
        executiveValue: "Governança proativa de melhoria contínua (ISO 45003)",
      },
      {
        artifact: "Avaliador de Força de Evidência Científica",
        mteRequirement: "Work Wellbeing Playbook 2.0 (Oxford) & Guia MTE 2026 Cap. 11",
        generatedEvidence: "Selo de robustez científica associado a cada medida cadastrada",
        executiveValue: "Investimento focado em controles que realmente funcionam",
      },
    ],
    strategiaQuestion: "O que são controles organizacionais na fonte e como avaliar sua eficácia?",
    strategiaIntent: "controls.organizational",
  },
  {
    id: "documents",
    label: "Documentos",
    path: "/app/documents",
    lenteBadge: "Lente 4 · Evoluir & Relatar (.pdf 5 Estrelas)",
    headline: "Centro de Documentos Auditáveis em PDF: Trio Mínimo do PGR, 4 Momentos CIPA & Ponte PCMSO",
    subtitle:
      "Emite todos os entregáveis formais em formato PDF (.pdf) com Design Instrucional Gráfico 5 Estrelas, identidade visual dupla (Instituto + Empresa), versionamento imutável e hash SHA-256.",
    mteNormativeBasis:
      "NR-1 Subitens 1.5.7.1, 1.5.4.4.2.2, 1.5.3.3 'a' e 1.5.5.1.1 'c' · Guia MTE 2026 Cap. 4, 6, 12.3 e 13",
    oxfordPlaybookAnchor: "Relatoria Transparente, Governança Executiva e Ciclo de Reavaliação",
    learningSciencePrinciple:
      "Design Instrucional Gráfico 5 Estrelas: capas com cards 2×2, mapa de leitura PDCA, tabelas vetoriais zebradas e callouts normativos que facilitam auditoria e leitura pelo Conselho.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "É a estação final de materialização documental onde dados, riscos, controles e atas da CIPA se transformam em PDFs institucionais prontos para assinatura técnica SST/SESMT.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Cobre os 3 Documentos Mínimos Obrigatórios do PGR (Inventário/DRPS, Plano de Ação e Critérios do GRO — item 1.5.4.4.2.2), os 4 momentos da CIPA (Cap. 6) e a Ponte PGR ↔ PCMSO (NR-7).",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Inclui o Modo Apresentação Executiva em 6 Slides (NR-1 item 1.5.3.3.c) para projetar a devolutiva coletiva em reuniões de CIPA e lideranças com roteiro do facilitador em PDF.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "PRONTIDÃO",
        title: "Checklist de 8 Itens",
        detail: "Verifica ciclo k≥5, riscos, ações, controles e CIPA.",
      },
      {
        step: "02",
        stageLabel: "CO-BRANDING",
        title: "Identidade Instituto + Empresa",
        detail: "Aplica logo e cor de acento na capa executiva do PDF.",
      },
      {
        step: "03",
        stageLabel: "EMISSÃO PDF",
        title: "Trio PGR & Ponte PCMSO",
        detail: "Baixa PDFs vetoriais 5 estrelas com tabelas e hash SHA-256.",
      },
      {
        step: "04",
        stageLabel: "ASSINATURA",
        title: "Revisão Técnica SST/SESMT",
        detail: "Registra carimbo temporal auditável e parecer técnico.",
      },
    ],
    auditTable: [
      {
        artifact: "Trio Documental do PGR (.pdf): DRPS + Plano + 3º Doc Critérios GRO",
        mteRequirement: "Manual MTE 2026 Cap. 4 e Cap. 13 (NR-1 itens 1.5.7.1 e 1.5.4.4.2.2)",
        generatedEvidence: "PDFs versionados com hash criptográfico SHA-256 e matriz AIHA 5×5",
        executiveValue: "Conformidade documental completa com o padrão oficial MTE 2026",
      },
      {
        artifact: "Ponte Técnica PGR ↔ PCMSO NR-7 (.pdf)",
        mteRequirement: "NR-1 item 1.5.5.1.1 'c' e Manual MTE 2026 Cap. 12.3 (p. 81)",
        generatedEvidence: "Insumo formal em PDF para o médico coordenador do PCMSO",
        executiveValue: "Integração perfeita entre Engenharia de Segurança/Ergonomia e Medicina do Trabalho",
      },
      {
        artifact: "Protocolo dos 4 Momentos da CIPA + Slides de Devolutiva (.pdf)",
        mteRequirement: "NR-1 item 1.5.3.3 e Manual MTE 2026 Cap. 6 (Figura 7, p. 23)",
        generatedEvidence: "Auditoria de participação e apresentação de 6 slides exportável em PDF",
        executiveValue: "Comprovação irrefutável de consulta aos trabalhadores e à CIPA",
      },
    ],
    strategiaQuestion: "Quais são os 3 documentos mínimos obrigatórios do PGR e como baixá-los em PDF?",
    strategiaIntent: "documents.which",
  },
  {
    id: "estrategia",
    label: "EstratégIA",
    path: "/app/estrategia",
    lenteBadge: "Inteligência Transversal · ARGO 4.0",
    headline: "Sra. EstratégIA — Workspace Agêntico 4 Abas com Telemetria Verificada & Neuromarketing Ético",
    subtitle:
      "Consultora digital determinística conectada em tempo real ao ciclo (k≥5), equipada com 4 abas (Conversa, Diagnóstico, Plano, Contato), tabelas S×P e exportação de Dossiê Executivo em PDF.",
    mteNormativeBasis: "Aterramento Determinístico nos 19 Capítulos do Manual MTE 2026 + NR-1 + NR-17 + NR-7",
    oxfordPlaybookAnchor: "Recomendação Automatizada dos 16 Drivers do Work Wellbeing Playbook 2.0 (Oxford)",
    learningSciencePrinciple:
      "Tutoria Inteligente Contextual (VanLehn) & Redução de Atrito Decisório (Lei de Hick): identifica a página do usuário e já prepara a pergunta-chave e os CTAs.",
    scaffoldingTriad: [
      {
        code: "01",
        title: "Andaimagem Conceitual (O Que É)",
        summary:
          "É a estação de inteligência consultiva do ecossistema, disponível tanto como janela flutuante em todas as páginas quanto como workspace completo em /app/estrategia.",
      },
      {
        code: "02",
        title: "Promoção da NR-1 & Guia MTE 2026",
        summary:
          "Opera sob blindagem constitucional Zero-Alucinação: jamais inventa escores ou diagnósticos clínicos, citando exclusivamente dados agregados (k≥5) e fontes normativas aprovadas.",
      },
      {
        code: "03",
        title: "Ciência de Aprendizagem Aplicada",
        summary:
          "Organiza automaticamente o raciocínio em 4 abas (Conversa, Diagnóstico Orientado, Rota Recomendada e Solicitação Institucional), convertendo dúvidas técnicas em ação auditável.",
      },
    ],
    workflowSteps: [
      {
        step: "01",
        stageLabel: "CONTEXTO",
        title: "Detecção da Página Atual",
        detail: "Prepara pergunta proativa, tags e CTAs da rota em foco.",
      },
      {
        step: "02",
        stageLabel: "DIAGNÓSTICO",
        title: "Tríade 01-02-03 & Tabela S×P",
        detail: "Sintetiza Contexto, Prioridades e Encaminhamento com k≥5.",
      },
      {
        step: "03",
        stageLabel: "ROTA PDCA",
        title: "Da Dúvida à Ação Auditável",
        detail: "Guia pelas 4 etapas operacionais com deep-links diretos.",
      },
      {
        step: "04",
        stageLabel: "CONVERSÃO",
        title: "Dossiê PDF & Contato Instituto",
        detail: "Exporta parecer em PDF 5 estrelas e registra pedido institucional.",
      },
    ],
    auditTable: [
      {
        artifact: "Workspace Agêntico de 4 Abas (Conversa · Diagnóstico · Plano · Contato)",
        mteRequirement: "Apoio à tomada de decisão fundamentada no GRO (NR-1 item 1.5.4.4.2.2)",
        generatedEvidence: "Tríade diagnóstica viva + Matriz Tabular S×P in-chat e in-tab",
        executiveValue: "Respostas executivas em segundos com rigor de pós-doutorado",
      },
      {
        artifact: "Motor de Inteligência Contextual por Página (Proactive Route Icebreaker)",
        mteRequirement: "Capacitação e orientação contínua de gestores e SST (Guia MTE 2026 Cap. 6)",
        generatedEvidence: "Perguntas-chave, tags e CTAs sincronizados com a tela do usuário",
        executiveValue: "Zero curva de aprendizado para novos gestores, RH e SESMT",
      },
      {
        artifact: "Exportador de Dossiê Executivo (.pdf) & Solicitação Institucional",
        mteRequirement: "Rastreabilidade documental e governança LGPD",
        generatedEvidence: "PDF 5 estrelas com histórico técnico + protocolo institucional IFT-NR1",
        executiveValue: "Ponte direta entre o diagnóstico digital e a consultoria do Instituto",
      },
    ],
    strategiaQuestion: "Quais dados do ciclo sustentam as recomendações da Sra. EstratégIA?",
    strategiaIntent: "strategy.basis",
  },
] as const;

export function getHomeNr1ModuleById(id: HomeNr1ModuleId): HomeNr1ModuleLearningSpec {
  return HOME_NR1_MODULES_CATALOG.find((m) => m.id === id) ?? HOME_NR1_MODULES_CATALOG[0];
}

export function buildHomeNr1ModuleInstructionalMarkdown(spec: HomeNr1ModuleLearningSpec): string {
  return [
    `# Guia de Ciência de Aprendizagem & Governança NR-1 — Módulo ${spec.label} (${spec.path})`,
    ``,
    `> **${spec.lenteBadge}** — ${spec.headline}. ${spec.subtitle}`,
    ``,
    `## 1. Enquadramento Normativo, Científico e Pedagógico`,
    ``,
    `- **Rota no Ecossistema:** \`${spec.path}\``,
    `- **Base Normativa (MTE 2026 / NR-1):** ${spec.mteNormativeBasis}`,
    `- **Ancoragem Científica (Oxford Playbook 2.0):** ${spec.oxfordPlaybookAnchor}`,
    `- **Princípio de Ciência de Aprendizagem:** ${spec.learningSciencePrinciple}`,
    ``,
    `## 2. Tríade de Andaimagem Cognitiva (Scaffolding)`,
    ``,
    `| Código | Dimensão Pedagógica | Síntese Aplicada ao Trabalho Real |`,
    `| :--- | :--- | :--- |`,
    ...spec.scaffoldingTriad.map((c) => `| ${c.code} | ${c.title} | ${c.summary} |`),
    ``,
    `## 3. Pipeline de Design Instrucional Gráfico (4 Etapas Operacionais)`,
    ``,
    `| Etapa | Fase | Título Operacional | Detalhamento Técnico |`,
    `| :--- | :--- | :--- | :--- |`,
    ...spec.workflowSteps.map((w) => `| ${w.step} | ${w.stageLabel} | ${w.title} | ${w.detail} |`),
    ``,
    `## 4. Matriz Auditável de Entregáveis, Conformidade MTE 2026 e Valor Executivo`,
    ``,
    `| Artefato no Módulo | Exigência MTE 2026 / NR-1 | Evidência Auditável Gerada | Impacto Executivo & ROI |`,
    `| :--- | :--- | :--- | :--- |`,
    ...spec.auditTable.map(
      (r) => `| ${r.artifact} | ${r.mteRequirement} | ${r.generatedEvidence} | ${r.executiveValue} |`,
    ),
    ``,
  ].join("\n");
}
