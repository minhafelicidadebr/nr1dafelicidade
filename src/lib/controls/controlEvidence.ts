export type ControlStatusLike = "planned" | "in_progress" | "done" | "cancelled" | string;

export type ControlEvidenceInput = {
  status?: ControlStatusLike | null;
  notes?: string | null;
  catalogEvidenceStrength?: string | null;
  catalogLevel?: string | null;
};

export type ControlEvidenceSignal =
  | "catalog_evidence"
  | "implementation_evidence"
  | "maintenance"
  | "effectiveness_indicator"
  | "technical_review";

export type ControlEvidenceBlocker =
  | "missing_implementation_evidence"
  | "missing_maintenance_evidence"
  | "missing_effectiveness_indicator"
  | "missing_technical_review"
  | "done_without_effectiveness_review";

export type ControlEvidenceEvaluation = {
  signals: Record<ControlEvidenceSignal, boolean>;
  blockers: ControlEvidenceBlocker[];
  completionBlockers: ControlEvidenceBlocker[];
  readyForTechnicalReview: boolean;
  canInformResidualRiskReview: boolean;
  label: "cancelled" | "declared" | "evidence_pending" | "evidence_ready" | "review_ready";
  nextStep: string;
  disclaimer: string;
};

const IMPLEMENTATION_PATTERNS = [
  /\bevid[êe]ncia\b/i,
  /\bregistro\b/i,
  /\bata\b/i,
  /\bcomprovante\b/i,
  /\bprocedimento\b/i,
  /\bpol[íi]tica\b/i,
  /\btreinamento\b/i,
  /\bimplantad[ao]\b/i,
  /\bimplementad[ao]\b/i,
  /\bdata\b/i,
];

const MAINTENANCE_PATTERNS = [
  /\bmanuten[çc][ãa]o\b/i,
  /\bmantid[ao]\b/i,
  /\brotina\b/i,
  /\bperiodicidade\b/i,
  /\bmensal\b/i,
  /\btrimestral\b/i,
  /\bmonitoramento\b/i,
  /\brespons[áa]vel\b/i,
];

const EFFECTIVENESS_PATTERNS = [
  /\befic[áa]cia\b/i,
  /\befetividade\b/i,
  /\bindicador(?:es)?\b/i,
  /\bkpi\b/i,
  /\bmeta\b/i,
  /\bbaseline\b/i,
  /\blinha de base\b/i,
  /\breavalia[çc][ãa]o\b/i,
  /\bresultado observado\b/i,
];

const REVIEW_PATTERNS = [
  /\brevis[ãa]o(?: t[ée]cnica)?\b/i,
  /\brespons[áa]vel t[ée]cnico\b/i,
  /\bsst\b/i,
  /\bsesmt\b/i,
  /\bcipa\b/i,
  /\bergonomia\b/i,
  /\bauditoria\b/i,
  /\bvalidado\b/i,
  /\bparecer\b/i,
];

const BLOCKER_LABELS: Record<ControlEvidenceBlocker, string> = {
  missing_implementation_evidence: "Registrar evidência de implementação.",
  missing_maintenance_evidence: "Registrar manutenção, rotina ou responsável pelo controle.",
  missing_effectiveness_indicator: "Registrar indicador, KPI, baseline ou reavaliação de eficácia.",
  missing_technical_review: "Registrar revisão técnica antes de usar o controle em análise residual.",
  done_without_effectiveness_review: "Não marcar como concluído sem evidência, eficácia e revisão técnica.",
};

export const CONTROL_EVIDENCE_DISCLAIMER =
  "Controle declarado não reduz risco automaticamente; apenas evidência e revisão técnica podem informar análise residual futura.";

export function evaluateControlEvidence(input: ControlEvidenceInput): ControlEvidenceEvaluation {
  const status = input.status ?? "planned";
  const notes = input.notes ?? "";
  const hasCatalogEvidence = Boolean(input.catalogEvidenceStrength?.trim());
  const hasImplementationEvidence = hasAnyPattern(notes, IMPLEMENTATION_PATTERNS);
  const hasMaintenance = hasAnyPattern(notes, MAINTENANCE_PATTERNS);
  const hasEffectivenessIndicator = hasAnyPattern(notes, EFFECTIVENESS_PATTERNS);
  const hasTechnicalReview = hasAnyPattern(notes, REVIEW_PATTERNS);

  const signals: Record<ControlEvidenceSignal, boolean> = {
    catalog_evidence: hasCatalogEvidence,
    implementation_evidence: hasImplementationEvidence,
    maintenance: hasMaintenance,
    effectiveness_indicator: hasEffectivenessIndicator,
    technical_review: hasTechnicalReview,
  };

  if (status === "cancelled") {
    return {
      signals,
      blockers: [],
      completionBlockers: [],
      readyForTechnicalReview: false,
      canInformResidualRiskReview: false,
      label: "cancelled",
      nextStep: "Controle cancelado. Mantenha justificativa e histórico no registro formal.",
      disclaimer: CONTROL_EVIDENCE_DISCLAIMER,
    };
  }

  const blockers: ControlEvidenceBlocker[] = [];
  if (!hasImplementationEvidence) blockers.push("missing_implementation_evidence");
  if (!hasMaintenance) blockers.push("missing_maintenance_evidence");
  if (!hasEffectivenessIndicator) blockers.push("missing_effectiveness_indicator");
  if (!hasTechnicalReview) blockers.push("missing_technical_review");
  if (status === "done" && blockers.length > 0) blockers.push("done_without_effectiveness_review");

  const completionBlockers = blockers.filter((blocker) =>
    [
      "missing_implementation_evidence",
      "missing_maintenance_evidence",
      "missing_effectiveness_indicator",
      "missing_technical_review",
      "done_without_effectiveness_review",
    ].includes(blocker),
  );
  const readyForTechnicalReview = hasImplementationEvidence && hasMaintenance && hasEffectivenessIndicator;
  const canInformResidualRiskReview = readyForTechnicalReview && hasTechnicalReview;

  return {
    signals,
    blockers,
    completionBlockers,
    readyForTechnicalReview,
    canInformResidualRiskReview,
    label: getLabel(status, readyForTechnicalReview, canInformResidualRiskReview),
    nextStep: blockers.length > 0 ? BLOCKER_LABELS[blockers[0]] : "Pode informar revisão técnica, sem reduzir risco automaticamente.",
    disclaimer: CONTROL_EVIDENCE_DISCLAIMER,
  };
}

export function controlEvidenceBlockerLabel(blocker: ControlEvidenceBlocker) {
  return BLOCKER_LABELS[blocker];
}

function hasAnyPattern(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function getLabel(
  status: ControlStatusLike,
  readyForTechnicalReview: boolean,
  canInformResidualRiskReview: boolean,
): ControlEvidenceEvaluation["label"] {
  if (status === "cancelled") return "cancelled";
  if (canInformResidualRiskReview) return "review_ready";
  if (readyForTechnicalReview) return "evidence_ready";
  if (status === "planned") return "declared";
  return "evidence_pending";
}
