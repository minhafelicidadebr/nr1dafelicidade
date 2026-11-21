/**
 * NR-1 / COPSOQ II × Work Wellbeing Playbook 2.0 — Crosswalk Registry
 * Versioned canonical mapping between psychosocial risk factors,
 * MTE-2025 factors, COPSOQ II dimensions and Oxford Playbook drivers.
 *
 * Used by:
 *  - NR1CopsoqPage (UI explainer + driver prioritisation)
 *  - driver-dynamic Edge Function as static reference text / intervention selection
 * This is not governed RAG and does not replace Source Registry approval.
 *
 * NEVER mutate at runtime. Treat as `as const`.
 */

export type Priority = "P0" | "P1" | "P2";
export type EvidenceLevel = "critical" | "strong" | "moderate_strong" | "moderate" | "emerging";

export interface CrosswalkItem {
  id: string;
  riskFactor: string;
  mteFactors: string[];
  copsoqDimensions: string[];
  playbookDrivers: string[];
  driverWeights: Record<string, number>;
  nr1Implication: string;
  aihaDefaultSeverity: 1 | 2 | 3 | 4 | 5;
  interventionLogic: string;
  evidenceLevel: EvidenceLevel;
  evidenceSource: string;
  priority: Priority;
  criticalFlag?: boolean;
  interventionIds: string[];
  playbookPageRef: string;
}

export interface MeasurePhase {
  phase: "Measure" | "Understand" | "Act";
  instruments?: string[];
  metrics?: string[];
  activities?: string[];
  principle: string;
}

export const nr1Crosswalk = {
  version: "2026.1",
  updatedAt: "2026-06-01",
  method:
    "Crosswalk entre fatores psicossociais NR-1/COPSOQ II e drivers do Work Wellbeing Playbook 2.0 (Oxford / Wellbeing Research Centre)",
  sources: [
    "Work Wellbeing Playbook 2.0 — Oxford Wellbeing Research Centre (2024)",
    "COPSOQ II — Kristensen, Burr, Borg et al. — NRCWE 2005",
    "Adaptação brasileira — Silva-Junior & Fischer, USP 2023",
    "Guia MTE/SIT — Fatores Psicossociais — Abril/2025",
    "ISO 45003:2021 — Gestão de riscos psicossociais",
    "Job Demands-Resources Model — Bakker & Demerouti 2017",
  ],
  items: [
    {
      id: "CW-01",
      riskFactor: "Sobrecarga e ritmo de trabalho",
      mteFactors: ["MTE-10"],
      copsoqDimensions: ["demands_quant", "work_pace"],
      playbookDrivers: ["stress", "energy", "flexibility", "management", "achievement"],
      driverWeights: { stress: 1.0, energy: 0.8, flexibility: 0.5, management: 0.4, achievement: 0.3 },
      nr1Implication:
        "Exigência de análise da organização do trabalho — fontes de sobrecarga, picos de demanda, dimensionamento de equipe e processos mal desenhados. Atenção especial a grupos com jornadas extras recorrentes.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "Priorizar redesign do trabalho e revisão de carga antes de treinamentos individuais de gestão do tempo. Metas irrealistas e falta de dimensionamento são causas-raiz estruturais.",
      evidenceLevel: "strong",
      evidenceSource: "Bakker & Demerouti (2017); Eurofound (2021); ISO 45003:2021",
      priority: "P0",
      interventionIds: ["workload_redesign_001", "meeting_audit_001", "right_to_disconnect_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Stress & Energy",
    },
    {
      id: "CW-02",
      riskFactor: "Baixo controle e autonomia",
      mteFactors: ["MTE-06"],
      copsoqDimensions: ["influence"],
      playbookDrivers: ["flexibility", "autonomy", "employee_voice", "management", "achievement"],
      driverWeights: { flexibility: 0.9, autonomy: 1.0, employee_voice: 0.7, management: 0.5, achievement: 0.4 },
      nr1Implication:
        "Avaliar organização do trabalho quanto à autonomia sobre tarefas, decisões, métodos e ritmo. Grupos em trabalho altamente prescritivo merecem atenção especial.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "Job redesign com ampliação de escopo e participação. Criar mecanismos de co-decisão sobre metas e métodos. Evitar microgestão e hipercontrole.",
      evidenceLevel: "strong",
      evidenceSource: "Karasek & Theorell (1990); Parker et al. (2019); ISO 45003:2021",
      priority: "P0",
      interventionIds: ["job_redesign_001", "participatory_goal_setting_001", "employee_voice_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Autonomy & Flexibility",
    },
    {
      id: "CW-03",
      riskFactor: "Baixo apoio social e gerencial",
      mteFactors: ["MTE-05"],
      copsoqDimensions: ["social_support", "leadership_quality", "community"],
      playbookDrivers: ["support", "management", "trust", "inclusion_belonging"],
      driverWeights: { support: 1.0, management: 0.9, trust: 0.7, inclusion_belonging: 0.5 },
      nr1Implication:
        "Avaliar suporte de pares e lideranças, qualidade gerencial, comunicação e relações interpessoais. Baixo apoio amplifica todos os outros riscos psicossociais.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "Treinar líderes para suporte ativo (não apenas cobrança). Criar rituais de 1:1, peer support, canais de escuta estruturados e feedback contínuo.",
      evidenceLevel: "strong",
      evidenceSource: "Hammer et al. (2011); Eurofound (2021); Playbook 2.0",
      priority: "P0",
      interventionIds: ["manager_training_001", "peer_support_001", "listening_channel_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Support & Management",
    },
    {
      id: "CW-04",
      riskFactor: "Assédio, violência e comportamentos ofensivos",
      mteFactors: ["MTE-01", "MTE-08"],
      copsoqDimensions: ["offensive_behaviours", "conflicts"],
      playbookDrivers: ["trust", "inclusion_belonging", "employee_voice", "support"],
      driverWeights: { trust: 1.0, inclusion_belonging: 0.9, employee_voice: 0.8, support: 0.6 },
      nr1Implication:
        "Exige resposta imediata. Canal seguro de relato, investigação independente, proteção da vítima e evidências robustas de medidas. Qualquer escore acima de 30 já justifica investigação qualitativa aprofundada.",
      aihaDefaultSeverity: 5,
      interventionLogic:
        "Canal confidencial funcional, política antiassédio formalizada e comunicada, CIPA ativa, treinamento de compliance e protocolo de proteção da vítima com fluxo claro.",
      evidenceLevel: "critical",
      evidenceSource: "ILO (2019) — Violência e Assédio; NR-01 responsabilidade civil; CID-11",
      priority: "P0",
      criticalFlag: true,
      interventionIds: ["anti_harassment_policy_001", "safe_channel_001", "cipa_strengthening_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Trust & Inclusion",
    },
    {
      id: "CW-05",
      riskFactor: "Insegurança laboral e precarização",
      mteFactors: ["MTE-02"],
      copsoqDimensions: ["insecurity", "predictability"],
      playbookDrivers: ["compensation", "trust", "employee_voice", "management"],
      driverWeights: { compensation: 0.8, trust: 0.7, employee_voice: 0.6, management: 0.5 },
      nr1Implication:
        "Avaliar insegurança percebida sobre emprego e salário. Especialmente crítico em períodos de reestruturação, fusões, terceirizações e demissões em massa.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "Comunicação transparente e antecipada sobre mudanças organizacionais. Gestão participativa da mudança. Rotas claras de mobilidade interna. Acordos coletivos que protejam contra precarização.",
      evidenceLevel: "moderate_strong",
      evidenceSource: "Sverke et al. (2002); Eurofound (2021)",
      priority: "P1",
      interventionIds: ["change_communication_001", "job_security_policy_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Compensation & Trust",
    },
    {
      id: "CW-06",
      riskFactor: "Baixo reconhecimento, justiça e recompensas",
      mteFactors: ["MTE-04", "MTE-07"],
      copsoqDimensions: ["recognition", "justice_respect"],
      playbookDrivers: ["appreciation", "compensation", "trust", "achievement"],
      driverWeights: { appreciation: 1.0, compensation: 0.7, trust: 0.5, achievement: 0.4 },
      nr1Implication:
        "Avaliar percepção de reconhecimento, justiça distributiva e procedimental, e equidade de recompensas. Injustiça percebida correlaciona com burnout e turnover.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "Criar critérios transparentes de reconhecimento. Revisar estrutura salarial com equidade. Implementar rituais SAGE (Specific, Authentic, Genuine, Earned) de reconhecimento.",
      evidenceLevel: "moderate_strong",
      evidenceSource: "Stansfeld & Candy (2006); Playbook 2.0 — Appreciation Driver",
      priority: "P1",
      interventionIds: ["recognition_program_001", "salary_equity_audit_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Appreciation & Compensation",
    },
    {
      id: "CW-07",
      riskFactor: "Baixo sentido, propósito e significado do trabalho",
      mteFactors: ["MTE-09"],
      copsoqDimensions: ["meaning"],
      playbookDrivers: ["purpose", "achievement", "learning", "inclusion_belonging"],
      driverWeights: { purpose: 1.0, achievement: 0.6, learning: 0.4, inclusion_belonging: 0.3 },
      nr1Implication:
        "Conectar organização do trabalho com clareza de missão e contribuição percebida. Especialmente relevante para trabalhadores em funções altamente repetitivas ou distantes do impacto final.",
      aihaDefaultSeverity: 2,
      interventionLogic:
        "Prosocial task framing (conectar tarefas ao impacto social). Strengths-based approach. Job crafting participativo. Comunicação de missão e valores com conexão real ao cotidiano.",
      evidenceLevel: "moderate",
      evidenceSource: "Grant (2008); Wrzesniewski et al. (2010); Playbook 2.0 — Purpose Driver",
      priority: "P2",
      interventionIds: ["purpose_framing_001", "job_crafting_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Purpose & Achievement",
    },
    {
      id: "CW-08",
      riskFactor: "Baixa previsibilidade e clareza de papel",
      mteFactors: ["MTE-02", "MTE-03", "MTE-12"],
      copsoqDimensions: ["predictability", "role_clarity"],
      playbookDrivers: ["management", "trust", "achievement"],
      driverWeights: { management: 1.0, trust: 0.7, achievement: 0.5 },
      nr1Implication:
        "Avaliar clareza de responsabilidades, prioridades, metas e comunicação de mudanças. Ambiguidade de papel é fator de risco independente para burnout.",
      aihaDefaultSeverity: 2,
      interventionLogic:
        "Clarificar descrições de cargo e responsabilidades. Criar rituais regulares de alinhamento de expectativas. Comunicação antecipada de mudanças organizacionais.",
      evidenceLevel: "strong",
      evidenceSource: "Kahn et al. (1964); ISO 45003:2021",
      priority: "P1",
      interventionIds: ["role_clarity_001", "expectation_alignment_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Management",
    },
    {
      id: "CW-09",
      riskFactor: "Isolamento social e falta de pertencimento",
      mteFactors: ["MTE-11", "MTE-13"],
      copsoqDimensions: ["community", "social_support"],
      playbookDrivers: ["inclusion_belonging", "support", "trust"],
      driverWeights: { inclusion_belonging: 1.0, support: 0.6, trust: 0.5 },
      nr1Implication:
        "Especialmente crítico para trabalhadores remotos, terceirizados, temporários e minorias. Isolamento amplifica todos os outros fatores de risco.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "Criar rituais de integração presencial e virtual. Garantir inclusão de grupos marginalizados nas decisões. Buddy systems para novos colaboradores e trabalhadores remotos.",
      evidenceLevel: "moderate_strong",
      evidenceSource: "Holt-Lunstad et al. (2015); Playbook 2.0 — Inclusion Driver",
      priority: "P1",
      interventionIds: ["inclusion_rituals_001", "remote_connection_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Inclusion & Belonging",
    },
    {
      id: "CW-10",
      riskFactor: "Burnout e esgotamento coletivo",
      mteFactors: ["MTE-10"],
      copsoqDimensions: ["burnout", "stress_at_work"],
      playbookDrivers: ["energy", "stress", "support", "flexibility"],
      driverWeights: { energy: 1.0, stress: 0.9, support: 0.6, flexibility: 0.4 },
      nr1Implication:
        "A CID-11 descreve burnout como fenômeno ocupacional, não como condição médica. Este registro exploratório não determina nexo, responsabilidade ou prioridade de ação.",
      aihaDefaultSeverity: 4,
      interventionLogic:
        "Revisão de carga horária e metas. EAP (Programa de Apoio ao Empregado). Direito à desconexão. Recuperação ativa como infraestrutura — não como fraqueza individual.",
      evidenceLevel: "strong",
      evidenceSource: "OMS CID-11: burnout como fenômeno ocupacional; Maslach & Leiter (2016); Playbook 2.0 — Energy Driver",
      priority: "P0",
      criticalFlag: true,
      interventionIds: ["workload_redesign_001", "eap_program_001", "recovery_infrastructure_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Energy & Recovery",
    },
    {
      id: "CW-11",
      riskFactor: "Baixa aprendizagem e desenvolvimento",
      mteFactors: [],
      copsoqDimensions: ["possibilities_development"],
      playbookDrivers: ["learning", "achievement", "purpose"],
      driverWeights: { learning: 1.0, achievement: 0.5, purpose: 0.4 },
      nr1Implication:
        "Fator de risco para desengajamento e turnover. Interconecta com sentido e reconhecimento. Especialmente relevante para trabalhadores jovens e em transições de carreira.",
      aihaDefaultSeverity: 2,
      interventionLogic:
        "Criar trilhas de aprendizagem conectadas ao trabalho real. PDI (Plano de Desenvolvimento Individual) com foco em aplicação. Mentoria e aprendizagem peer-to-peer.",
      evidenceLevel: "moderate",
      evidenceSource: "Playbook 2.0 — Learning Driver; Dweck (2006) — Growth Mindset",
      priority: "P2",
      interventionIds: ["learning_pathways_001", "mentoring_program_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Learning",
    },
    {
      id: "CW-12",
      riskFactor: "Exigências emocionais intensas",
      mteFactors: ["MTE-01"],
      copsoqDimensions: ["demands_emotional"],
      playbookDrivers: ["support", "energy", "stress"],
      driverWeights: { support: 0.9, energy: 0.7, stress: 0.8 },
      nr1Implication:
        "Típico em saúde, educação, atendimento ao público, assistência social e call center. A NR-01 exige gestão ativa desse risco mesmo quando inerente à atividade.",
      aihaDefaultSeverity: 3,
      interventionLogic:
        "EAP, grupos de supervisão clínica/apoio, rotação entre áreas de alta e baixa carga emocional, treinamento de inteligência emocional contextualizado ao setor.",
      evidenceLevel: "strong",
      evidenceSource: "Hochschild (1983) — Emotional Labour; COPSOQ II Manual 2013",
      priority: "P0",
      interventionIds: ["emotional_support_001", "supervision_groups_001"],
      playbookPageRef: "Playbook 2.0 — Capítulo Support",
    },
  ] satisfies CrosswalkItem[],
  measureFramework: {
    description: "Framework Measure → Understand → Act do Work Wellbeing Playbook 2.0",
    phases: [
      {
        phase: "Measure",
        instruments: ["Instrumento ocupacional versionado e aprovado no Instrument Registry"],
        metrics: [
          "job_satisfaction",
          "happiness_at_work",
          "stress_score",
          "sense_of_purpose",
          "driver_scores",
          "psychosocial_risk_scores",
          "approved_collective_outcomes",
        ],
        principle:
          "Separar exposição, desfecho e avaliação clínica; nenhum questionário isolado estabelece causa ou substitui trabalho real.",
      },
      {
        phase: "Understand",
        activities: [
          "Análise de scores por dimensão e setor",
          "Triangulação de sinais coletivos aprovados com evidências do trabalho real",
          "Mapeamento dos 13 fatores MTE",
          "Identificação de causas-raiz",
          "Priorização por AIHA 5×5",
          "Cruzamento com drivers do Playbook",
        ],
        principle:
          "Nunca tratar sintomas sem identificar causas organizacionais. Dados são ponto de partida, não diagnóstico.",
      },
      {
        phase: "Act",
        activities: [
          "Selecionar intervenções baseadas em evidência",
          "Criar plano de ação NR-1",
          "Atribuir responsável, prazo, KPI e evidência",
          "Acompanhar implementação",
          "Avaliar impacto",
          "Reavaliar em ciclo contínuo",
        ],
        principle:
          "Priorizar intervenções organizacionais (eliminação, redesign) antes de suporte individual. Avaliar eficácia com dados, não apenas intenção.",
      },
    ] satisfies MeasurePhase[],
  },
} as const;

export type Nr1Crosswalk = typeof nr1Crosswalk;

/** Find crosswalk items that contain a given Playbook driver slug. */
export function crosswalkByDriver(driverSlug: string): CrosswalkItem[] {
  return nr1Crosswalk.items.filter((i) =>
    (i.playbookDrivers as readonly string[]).includes(driverSlug),
  );
}

/** Find crosswalk items linked to a given MTE factor id (e.g. "MTE-10"). */
export function crosswalkByMteFactor(mteId: string): CrosswalkItem[] {
  return nr1Crosswalk.items.filter((i) => (i.mteFactors as readonly string[]).includes(mteId));
}

const EVIDENCE_COLOR: Record<EvidenceLevel, string> = {
  critical: "hsl(var(--destructive))",
  strong: "hsl(150 60% 45%)",
  moderate_strong: "hsl(180 55% 45%)",
  moderate: "hsl(40 90% 55%)",
  emerging: "hsl(210 30% 60%)",
};

export const evidenceColor = (lvl: EvidenceLevel) => EVIDENCE_COLOR[lvl];

const PRIORITY_LABEL: Record<Priority, string> = {
  P0: "Crítico — Ação imediata",
  P1: "Alto — Plano em 90 dias",
  P2: "Médio — Plano em 6 meses",
};

export const priorityLabel = (p: Priority) => PRIORITY_LABEL[p];
