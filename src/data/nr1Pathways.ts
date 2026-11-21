/**
 * NR-1 Learning Pathways Registry (v2026.1)
 * Trilhas de aprendizagem integradas a riscos psicossociais NR-1,
 * drivers do Playbook 2.0 e personas organizacionais.
 */

export type Persona = "leader" | "employee" | "sst_hr_consultant" | "cipa" | "all";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ModuleType =
  | "microlearning"
  | "case_study"
  | "simulation"
  | "action_lab"
  | "reflection"
  | "tutorial"
  | "roleplay";

export interface PathwayModule {
  id: string;
  title: string;
  type: ModuleType;
  estimatedMinutes: number;
  description: string;
  learningOutcomes?: readonly string[];
  format?: string;
  action: string;
}

export interface Pathway {
  id: string;
  title: string;
  subtitle: string;
  persona: Persona;
  targetRoles: readonly string[];
  duration: string;
  difficulty: Difficulty;
  driver: string;
  additionalDrivers?: readonly string[];
  linkedRisks: readonly string[];
  copsoqDimensions: readonly string[];
  nr1Relevance?: string;
  modules: readonly PathwayModule[];
  badges: readonly string[];
  evidenceOutput: string;
  prerequisitePathways: readonly string[];
  nextPathways: readonly string[];
}

export interface PathwayBadge {
  id: string;
  name: string;
  criteria: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  emoji: string;
}

export interface IFTRule {
  action: string;
  reward: number;
}

export const nr1Pathways = {
  version: "2026.1",
  updatedAt: "2026-06-01",
  description:
    "Trilhas de aprendizagem integradas aos riscos psicossociais NR-1, drivers do Playbook e personas organizacionais.",
  learningPrinciples: [
    "Aprendizagem conectada ao trabalho real — não cursos de compliance genéricos",
    "Microlearning espaçado respeitando a curva de Ebbinghaus",
    "Active recall e interação — não passividade",
    "Transferência imediata — cada módulo gera uma ação concreta",
    "Gamificação ética — reconhecimento de progresso real, não métricas vazias",
  ],
  moduleTypes: {
    microlearning: { icon: "⚡", description: "Pílula de conhecimento — leitura + infográfico + quiz curto (60–120s por tópico)" },
    case_study: { icon: "📊", description: "Caso real com análise estruturada e reflexão guiada" },
    simulation: { icon: "🎮", description: "Simulação interativa de situação real com escolhas e consequências" },
    action_lab: { icon: "🔬", description: "Laboratório de ação — aplica conhecimento gerando artefato real" },
    reflection: { icon: "🪞", description: "Reflexão estruturada com perguntas provocadoras e registro" },
    tutorial: { icon: "📖", description: "Guia passo a passo com demonstração prática" },
    roleplay: { icon: "🎭", description: "Roleplay multi-persona em dilema organizacional real" },
  } as Record<ModuleType, { icon: string; description: string }>,
  pathways: [
    {
      id: "nr1_basics_for_leaders",
      title: "NR-1 para Lideranças: do Risco Psicossocial à Ação Preventiva",
      subtitle: "Transforme dados COPSOQ em liderança preventiva real",
      persona: "leader",
      targetRoles: ["unit_manager", "leader", "sst_manager"],
      duration: "45–60 minutos",
      difficulty: "intermediate",
      driver: "management",
      linkedRisks: ["CW-03", "CW-08"],
      copsoqDimensions: ["leadership_quality", "social_support", "role_clarity"],
      nr1Relevance:
        "Desenvolve competências de liderança preventiva — requisito implícito no GRO/PGR para controle administrativo eficaz.",
      modules: [
        {
          id: "m1",
          title: "O que mudou na NR-1 e por que importa para você",
          type: "microlearning",
          estimatedMinutes: 8,
          description:
            "Panorama da atualização da NR-1 (2025/2026), o que é GRO/PGR, o que é psicossocial e qual é a responsabilidade da liderança.",
          learningOutcomes: [
            "Entender o que a NR-1 exige de líderes",
            "Saber o que é risco psicossocial",
            "Reconhecer sua responsabilidade no PGR",
          ],
          format: "texto + infográfico + quiz rápido",
          action: "Refletir: qual risco psicossocial você percebe no seu setor hoje?",
        },
        {
          id: "m2",
          title: "Fatores psicossociais no trabalho real — os 13 do MTE",
          type: "case_study",
          estimatedMinutes: 12,
          description:
            "Os 13 fatores psicossociais reconhecidos pelo MTE, com exemplos reais do cotidiano organizacional e como aparecem nos dados COPSOQ.",
          learningOutcomes: [
            "Identificar os 13 fatores MTE no seu contexto",
            "Conectar dado COPSOQ a causa real",
            "Diferenciar sintoma de causa-raiz",
          ],
          format: "casos + mapa de fatores + reflexão estruturada",
          action: "Mapear 2 fatores que você suspeita existirem no seu setor",
        },
        {
          id: "m3",
          title: "Como ler o relatório sem culpabilizar pessoas",
          type: "simulation",
          estimatedMinutes: 15,
          description:
            "Interpretação de dados COPSOQ com foco em causas organizacionais. Como apresentar resultados sem criar defensividade ou estigma.",
          learningOutcomes: [
            "Ler semáforo e radar COPSOQ",
            "Interpretar sem personalizar o problema",
            "Conduzir devolutiva respeitosa e produtiva",
          ],
          format: "simulação de devolutiva + roleplay + checklist",
          action: "Planejar a devolutiva para sua equipe usando o guia do módulo",
        },
        {
          id: "m4",
          title: "Do risco ao plano: 1 ação que você pode fazer esta semana",
          type: "action_lab",
          estimatedMinutes: 20,
          description:
            "Traduzir um dado crítico do seu setor em um item de ação concreto com responsável, prazo e KPI. Vincular ao plano NR-1.",
          learningOutcomes: [
            "Criar um item de ação NR-1 defensável",
            "Definir indicador de acompanhamento",
            "Registrar evidência do compromisso",
          ],
          format: "template de ação + AI copiloto + registro no plano",
          action: "Criar e registrar 1 item de ação no plano NR-1 da sua unidade",
        },
      ],
      badges: ["Liderança Preventiva NR-1", "Gestor Psicossocial Básico"],
      evidenceOutput:
        "Certificado de conclusão + compromisso de ação registrado + 1 item no plano NR-1",
      prerequisitePathways: [],
      nextPathways: ["nr1_advanced_for_sst", "intervention_design_leaders"],
    },
    {
      id: "nr1_for_workers",
      title: "Seus Direitos no Trabalho: NR-1 e Saúde Psicossocial",
      subtitle: "Entenda o que a lei garante e como participar",
      persona: "employee",
      targetRoles: ["employee_anonymous", "leader", "cipa_member"],
      duration: "20–30 minutos",
      difficulty: "beginner",
      driver: "employee_voice",
      linkedRisks: ["CW-02", "CW-04", "CW-09"],
      copsoqDimensions: ["influence", "community", "social_support"],
      nr1Relevance:
        "Suporta evidências de participação dos trabalhadores (NR-01 1.5.7.4 — pilar obrigatório de fiscalização).",
      modules: [
        {
          id: "m1",
          title: "O que são riscos psicossociais e por que você importa",
          type: "microlearning",
          estimatedMinutes: 8,
          description:
            "Linguagem acessível sobre o que são fatores psicossociais, como afetam a saúde e quais são seus direitos legais.",
          learningOutcomes: [
            "Entender o conceito de risco psicossocial",
            "Reconhecer direitos NR-1",
            "Saber que a pesquisa é anônima e segura",
          ],
          format: "texto simples + exemplos do cotidiano + FAQ",
          action: "Responder a pesquisa COPSOQ com confiança",
        },
        {
          id: "m2",
          title: "Como a sua voz muda o trabalho",
          type: "reflection",
          estimatedMinutes: 12,
          description:
            "Exemplos reais de como participação de trabalhadores levou a mudanças reais. Canais de participação disponíveis e como usá-los.",
          learningOutcomes: [
            "Conhecer os canais de participação",
            "Sentir-se parte do processo de mudança",
            "Saber como relatar situações de risco",
          ],
          format: "histórias reais + canais disponíveis + quiz de reflexão",
          action: "Identificar 1 melhoria que tornaria seu trabalho mais saudável",
        },
      ],
      badges: ["Participante Ativo NR-1", "Voz do Trabalhador"],
      evidenceOutput:
        "Registro de conclusão + prova de acesso à trilha (evidência de participação para PGR)",
      prerequisitePathways: [],
      nextPathways: ["wellbeing_foundations"],
    },
    {
      id: "nr1_advanced_for_sst",
      title: "NR-1 Avançado: Operação Completa do GRO/PGR Psicossocial",
      subtitle: "Da campanha ao relatório auditável — guia completo para profissionais SST/RH",
      persona: "sst_hr_consultant",
      targetRoles: ["sst_manager", "hr_manager", "consultant", "org_owner"],
      duration: "90–120 minutos",
      difficulty: "advanced",
      driver: "management",
      linkedRisks: ["CW-01", "CW-02", "CW-03", "CW-04", "CW-05", "CW-06", "CW-07", "CW-08", "CW-09", "CW-10"],
      copsoqDimensions: ["all"],
      nr1Relevance:
        "Forma o profissional técnico para operar o GRO/PGR psicossocial completo — desde a campanha até o relatório auditável.",
      modules: [
        {
          id: "m1",
          title: "Ciclo completo NR-1: Planejar → Identificar → Avaliar → Controlar → Evidenciar → Reavaliar",
          type: "microlearning",
          estimatedMinutes: 15,
          description:
            "Visão sistêmica do ciclo NR-1 com todas as etapas, responsabilidades, documentos obrigatórios e armadilhas frequentes.",
          format: "infográfico interativo + checklist + quiz de verificação",
          action: "Completar checklist de prontidão NR-1 da sua organização",
        },
        {
          id: "m2",
          title: "Configurar uma campanha com instrumento aprovado",
          type: "tutorial",
          estimatedMinutes: 20,
          description:
            "Passo a passo para validar versão, definir recortes seguros, emitir convites sem correlação e comunicar limites de privacidade.",
          format: "tutorial interativo + simulação da plataforma",
          action: "Criar e configurar uma campanha para sua organização",
        },
        {
          id: "m3",
          title: "Interpretar sinais coletivos aprovados — do número à decisão",
          type: "case_study",
          estimatedMinutes: 25,
          description:
            "Interpretação de escore original, transformações declaradas, incerteza e evidências do trabalho real. Como conduzir devolutiva técnica sem diagnóstico.",
          format: "casos reais + análise guiada + roleplay de devolutiva",
          action: "Analisar relatório piloto e identificar Top 5 riscos com justificativa",
        },
        {
          id: "m4",
          title: "Plano de ação NR-1: de dado a evidência",
          type: "action_lab",
          estimatedMinutes: 30,
          description:
            "Criar plano de ação completo com hierarquia de controles, responsáveis, prazos, KPIs, evidências e comunicação de devolutiva.",
          format: "template estruturado + AI copiloto + registro real",
          action: "Criar ou revisar o plano de ação NR-1 da sua organização",
        },
        {
          id: "m5",
          title: "Gerar relatório auditável e apresentar à fiscalização",
          type: "simulation",
          estimatedMinutes: 20,
          description:
            "Como gerar, revisar e apresentar o relatório auditável ao fiscal do MTE. O que o auditor espera ver e como demonstrar conformidade.",
          format: "simulação de auditoria + checklist fiscal + perguntas frequentes MTE 2026",
          action: "Gerar relatório piloto e revisar com checklist de auditoria",
        },
      ],
      badges: ["Especialista NR-1 Psicossocial", "Operador GRO/PGR Avançado", "Auditor Ready"],
      evidenceOutput: "Certificado técnico + plano de ação completo registrado + relatório gerado",
      prerequisitePathways: ["nr1_basics_for_leaders"],
      nextPathways: ["strategia_ai_copilot_training", "playbook_drivers_deep_dive"],
    },
    {
      id: "stress_energy_driver",
      title: "Estresse e Energia: Intervir nas Causas, Não nos Sintomas",
      subtitle: "Playbook 2.0 — Driver Stress & Energy — guia de implementação",
      persona: "sst_hr_consultant",
      targetRoles: ["sst_manager", "hr_manager", "consultant", "leader"],
      duration: "50–70 minutos",
      difficulty: "intermediate",
      driver: "stress",
      additionalDrivers: ["energy"],
      linkedRisks: ["CW-01", "CW-10"],
      copsoqDimensions: ["demands_quant", "work_pace", "burnout"],
      modules: [
        {
          id: "m1",
          title: "Estresse organizacional vs. estresse individual — a diferença que muda tudo",
          type: "microlearning",
          estimatedMinutes: 10,
          description:
            "Por que treinar resiliência individual sem mudar o trabalho não funciona. O modelo JD-R e as causas estruturais do estresse.",
          action: "Identificar 1 causa estrutural de estresse no seu contexto",
        },
        {
          id: "m2",
          title: "Redesenho de carga, fluxo e reuniões — intervenções que funcionam",
          type: "simulation",
          estimatedMinutes: 20,
          description:
            "Aplicar redesenho de carga de trabalho com participação da equipe. Auditoria de reuniões. Política de prioridades explícitas.",
          action: "Conduzir auditoria de reuniões com sua equipe",
        },
        {
          id: "m3",
          title: "Energia como infraestrutura — recuperação ativa no trabalho",
          type: "action_lab",
          estimatedMinutes: 15,
          description:
            "Criar condições para recuperação genuína — pausas reais, direito à desconexão, espaços de recuperação.",
          action: "Criar política de recuperação para sua equipe",
        },
        {
          id: "m4",
          title: "Medir o que importa — KPIs de estresse e energia",
          type: "tutorial",
          estimatedMinutes: 12,
          description:
            "Usar scores COPSOQ demands_quant, work_pace e burnout como KPIs reais do plano de ação.",
          action: "Definir KPI de estresse para monitorar no próximo ciclo",
        },
      ],
      badges: ["Especialista em Redução de Carga", "Arquiteto de Energia Organizacional"],
      evidenceOutput: "Certificado + plano de redução de carga registrado + KPI definido",
      prerequisitePathways: [],
      nextPathways: ["management_support_driver"],
    },
    {
      id: "management_support_driver",
      title: "Gestão que Sustenta Pessoas: Suporte, Autonomia e Confiança",
      subtitle: "Playbook 2.0 — Drivers Management & Support",
      persona: "leader",
      targetRoles: ["leader", "unit_manager", "hr_manager"],
      duration: "55–75 minutos",
      difficulty: "intermediate",
      driver: "management",
      additionalDrivers: ["support", "trust"],
      linkedRisks: ["CW-03", "CW-02"],
      copsoqDimensions: ["leadership_quality", "social_support", "influence"],
      modules: [
        {
          id: "m1",
          title: "O que é gestão preventiva — do controle ao suporte",
          type: "microlearning",
          estimatedMinutes: 10,
          description:
            "A diferença entre gestão orientada a controle (que amplifica risco) e gestão orientada a suporte (que previne risco). Dados do Playbook.",
          action: "Auto-avaliação: qual estilo predomina no seu setor hoje?",
        },
        {
          id: "m2",
          title: "1:1 estruturado — rituais de suporte que funcionam",
          type: "simulation",
          estimatedMinutes: 20,
          description:
            "Como fazer uma conversa individual eficaz de 30 minutos mensais. Template, perguntas de abertura e como não transformar em cobrança.",
          action: "Agendar e conduzir 1:1 com todos da sua equipe neste mês",
        },
        {
          id: "m3",
          title: "Autonomia progressiva — expandir controle sem perder alinhamento",
          type: "case_study",
          estimatedMinutes: 20,
          description:
            "Como aumentar autonomia da equipe de forma estruturada — não abandonar, mas empoderar com clareza.",
          action: "Mapear 2 decisões que você pode delegar esta semana",
        },
        {
          id: "m4",
          title: "Construir confiança em clima de incerteza",
          type: "action_lab",
          estimatedMinutes: 15,
          description:
            "Comportamentos específicos que constroem ou destroem confiança. Como comunicar más notícias com integridade.",
          action: "Criar acordo de confiança com sua equipe",
        },
      ],
      badges: ["Líder Psicossocial", "Especialista em Suporte Organizacional"],
      evidenceOutput: "Certificado + ritmo de 1:1 estabelecido + registro de delegação",
      prerequisitePathways: ["nr1_basics_for_leaders"],
      nextPathways: ["inclusion_belonging_driver", "recognition_appreciation_driver"],
    },
    {
      id: "wellbeing_foundations",
      title: "Fundamentos do Bem-Estar Científico no Trabalho",
      subtitle: "O que a ciência diz sobre trabalho e saúde — para todos",
      persona: "all",
      targetRoles: ["all"],
      duration: "30–40 minutos",
      difficulty: "beginner",
      driver: "purpose",
      additionalDrivers: ["energy", "learning"],
      linkedRisks: ["CW-07", "CW-11"],
      copsoqDimensions: ["meaning", "possibilities_development"],
      modules: [
        {
          id: "m1",
          title: "O que é bem-estar no trabalho — além de pizza na sexta",
          type: "microlearning",
          estimatedMinutes: 10,
          description:
            "A diferença entre bem-estar superficial e bem-estar científico. Os 5 drivers que mais impactam saúde e performance segundo Oxford.",
          action: "Identificar seu driver prioritário pessoal",
        },
        {
          id: "m2",
          title: "Propósito, energia e aprendizagem — como ativar os 3",
          type: "reflection",
          estimatedMinutes: 15,
          description:
            "Exercícios práticos baseados em evidência para conectar com propósito, renovar energia e engajar com aprendizagem.",
          action: "Completar exercício de conexão com propósito",
        },
        {
          id: "m3",
          title: "O que posso mudar? Agência individual vs. responsabilidade organizacional",
          type: "action_lab",
          estimatedMinutes: 10,
          description:
            "Círculo de influência aplicado ao bem-estar. O que cada pessoa pode mudar e o que precisa de mudança sistêmica.",
          action: "Criar 1 microdecisão de bem-estar pessoal para esta semana",
        },
      ],
      badges: ["Bem-Estar Consciente", "Fundação Playbook"],
      evidenceOutput: "Registro de conclusão + microdecisão documentada",
      prerequisitePathways: [],
      nextPathways: ["stress_energy_driver", "nr1_for_workers"],
    },
    {
      id: "cipa_nr1_integration",
      title: "CIPA e NR-1 Psicossocial: Papéis, Poderes e Práticas",
      subtitle: "Como a CIPA se torna agente ativo do GRO/PGR psicossocial",
      persona: "cipa",
      targetRoles: ["cipa_member"],
      duration: "40–55 minutos",
      difficulty: "intermediate",
      driver: "employee_voice",
      additionalDrivers: ["trust", "inclusion_belonging"],
      linkedRisks: ["CW-04", "CW-09"],
      copsoqDimensions: ["offensive_behaviours", "community", "influence"],
      nr1Relevance:
        "A CIPA tem papel central nas evidências de participação dos trabalhadores (NR-01 1.5.7.4).",
      modules: [
        {
          id: "m1",
          title: "CIPA e NR-1 — como o mapa mudou",
          type: "microlearning",
          estimatedMinutes: 12,
          description:
            "Como a atualização NR-1 2025/2026 expande o papel da CIPA para incluir riscos psicossociais. Novas responsabilidades e oportunidades.",
          action: "Revisar ata da última reunião CIPA — quais riscos psicossociais foram discutidos?",
        },
        {
          id: "m2",
          title: "Reconhecer e relatar assédio, violência e comportamentos ofensivos",
          type: "case_study",
          estimatedMinutes: 20,
          description:
            "Casos reais, limites de atuação, fluxo de relato e como proteger a vítima sem quebrar a confidencialidade.",
          action: "Verificar se o canal de relato da organização está funcionando e é acessível",
        },
        {
          id: "m3",
          title: "CIPA como motor de evidências de participação NR-1",
          type: "tutorial",
          estimatedMinutes: 15,
          description:
            "Como transformar reuniões CIPA em evidências documentadas para o PGR. Templates de ata, lista de presença e deliberações.",
          action: "Criar template de ata CIPA adaptado ao GRO/PGR",
        },
      ],
      badges: ["CIPA NR-1 Integrada", "Agente Psicossocial"],
      evidenceOutput: "Certificado + template de ata criado + evidências de participação geradas",
      prerequisitePathways: [],
      nextPathways: ["nr1_advanced_for_sst"],
    },
  ] satisfies readonly Pathway[],
  gamification: {
    badges: [
      { id: "BDG-NR1-BASIC", name: "Liderança Preventiva NR-1", criteria: "Completar trilha nr1_basics_for_leaders", rarity: "common", emoji: "🛡️" },
      { id: "BDG-NR1-ADVANCED", name: "Especialista NR-1 Psicossocial", criteria: "Completar trilha nr1_advanced_for_sst", rarity: "rare", emoji: "🏆" },
      { id: "BDG-STRESS", name: "Arquiteto de Energia Organizacional", criteria: "Completar stress_energy_driver + registrar 1 intervenção", rarity: "rare", emoji: "⚡" },
      { id: "BDG-VOICE", name: "Voz do Trabalhador", criteria: "Completar nr1_for_workers + responder pesquisa", rarity: "common", emoji: "📢" },
      { id: "BDG-CIPA", name: "CIPA NR-1 Integrada", criteria: "Completar cipa_nr1_integration + gerar evidência", rarity: "rare", emoji: "🤝" },
      { id: "BDG-FOUNDATIONS", name: "Bem-Estar Consciente", criteria: "Completar wellbeing_foundations", rarity: "common", emoji: "🌱" },
      { id: "BDG-AUDIT-READY", name: "Auditor Ready", criteria: "Completar todas as trilhas SST + gerar relatório", rarity: "epic", emoji: "📋" },
    ] satisfies readonly PathwayBadge[],
    iftEarningRules: [
      { action: "Completar módulo microlearning", reward: 5 },
      { action: "Completar módulo case_study", reward: 8 },
      { action: "Completar módulo simulation", reward: 12 },
      { action: "Completar módulo action_lab", reward: 15 },
      { action: "Registrar ação no plano NR-1", reward: 20 },
      { action: "Concluir trilha completa", reward: 50 },
      { action: "Gerar relatório auditável", reward: 30 },
      { action: "Conquistar badge", reward: 25 },
    ] satisfies readonly IFTRule[],
  },
} as const;

export const PERSONA_LABEL: Record<Persona, string> = {
  leader: "Lideranças",
  employee: "Trabalhadores",
  sst_hr_consultant: "SST / RH / Consultores",
  cipa: "CIPA",
  all: "Todos",
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export function pathwaysByPersona(persona: Persona | "any"): readonly Pathway[] {
  if (persona === "any") return nr1Pathways.pathways;
  return nr1Pathways.pathways.filter((p) => p.persona === persona || p.persona === "all");
}

export function totalPathwayMinutes(p: Pathway): number {
  return p.modules.reduce((acc, m) => acc + m.estimatedMinutes, 0);
}

export function totalIFTReward(p: Pathway): number {
  const rules = nr1Pathways.gamification.iftEarningRules;
  const perModule = (t: ModuleType) =>
    rules.find((r) => r.action.toLowerCase().includes(t))?.reward ?? 5;
  const moduleSum = p.modules.reduce((acc, m) => acc + perModule(m.type), 0);
  const completeBonus = rules.find((r) => r.action === "Concluir trilha completa")?.reward ?? 0;
  return moduleSum + completeBonus;
}
