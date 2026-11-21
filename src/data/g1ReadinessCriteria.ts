export type G1ReadinessCategory = "runtime" | "operational" | "formal";

export type G1ReadinessKey =
  | "data_gate"
  | "organization"
  | "units"
  | "cycle_k"
  | "risk_scores"
  | "action_governance"
  | "control_evidence"
  | "documents"
  | "reviewed_documents"
  | "instrument_sources"
  | "independent_review"
  | "accountables"
  | "github_ci"
  | "formal_approval";

export type G1ReadinessCriterion = {
  key: G1ReadinessKey;
  label: string;
  category: G1ReadinessCategory;
  gateBlocking: boolean;
  cta?: { label: string; to: string };
};

export const g1ReadinessCriteria: G1ReadinessCriterion[] = [
  {
    key: "data_gate",
    label: "G0/G1 local sintetico ativo",
    category: "runtime",
    gateBlocking: true,
  },
  {
    key: "organization",
    label: "Organizacao cadastrada",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Empresa", to: "/app/company" },
  },
  {
    key: "units",
    label: "Unidades ou setores definidos",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Unidades", to: "/app/units" },
  },
  {
    key: "cycle_k",
    label: "Ciclo sintetico com n >= 5",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Ciclos", to: "/app/cycles" },
  },
  {
    key: "risk_scores",
    label: "Riscos agregados computados",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Riscos", to: "/app/risk" },
  },
  {
    key: "action_governance",
    label: "Acoes com evidencia, KPI e revisao",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Acoes", to: "/app/actions" },
  },
  {
    key: "control_evidence",
    label: "Controles com evidencia e revisao",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Controles", to: "/app/controls" },
  },
  {
    key: "documents",
    label: "Documentos preliminares gerados",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Documentos", to: "/app/documents" },
  },
  {
    key: "reviewed_documents",
    label: "Revisao tecnica registrada em documento",
    category: "operational",
    gateBlocking: true,
    cta: { label: "Documentos", to: "/app/documents" },
  },
  {
    key: "instrument_sources",
    label: "Fontes, licenca e instrumento aprovados",
    category: "formal",
    gateBlocking: true,
  },
  {
    key: "independent_review",
    label: "Revisao independente SST/metodologia/juridico",
    category: "formal",
    gateBlocking: true,
  },
  {
    key: "accountables",
    label: "Responsaveis organizacionais nomeados",
    category: "formal",
    gateBlocking: true,
  },
  {
    key: "github_ci",
    label: "CI oficial e historico Git auditados",
    category: "formal",
    gateBlocking: true,
  },
  {
    key: "formal_approval",
    label: "Aceite formal do gate",
    category: "formal",
    gateBlocking: true,
  },
];
