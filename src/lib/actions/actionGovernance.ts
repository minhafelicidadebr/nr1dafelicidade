export type ActionStatusLike = "planned" | "in_progress" | "done" | "cancelled" | string;

export type ActionGovernanceInput = {
  title?: string | null;
  description?: string | null;
  status?: ActionStatusLike | null;
  due_date?: string | null;
  dimension?: string | null;
  cycle_id?: string | null;
  assignee_user_id?: string | null;
  assignee_name?: string | null;
};

export type ActionGovernanceSignal = "owner" | "deadline" | "risk_origin" | "evidence" | "kpi" | "technical_review";

export type ActionGovernanceBlocker =
  | "missing_owner"
  | "missing_due_date"
  | "missing_risk_origin"
  | "missing_expected_evidence"
  | "missing_kpi_or_reassessment"
  | "done_without_review_evidence";

export type ActionGovernanceEvaluation = {
  signals: Record<ActionGovernanceSignal, boolean>;
  blockers: ActionGovernanceBlocker[];
  completionBlockers: ActionGovernanceBlocker[];
  documentWarnings: ActionGovernanceBlocker[];
  readyForClosure: boolean;
  readyForDocument: boolean;
  label: "cancelled" | "draft" | "planned" | "evidence_defined" | "review_ready";
  nextStep: string;
};

const EVIDENCE_PATTERNS = [
  /\bevid[êe]ncia\b/i,
  /\bevidence\b/i,
  /\bregistro\b/i,
  /\bata\b/i,
  /\bpol[íi]tica\b/i,
  /\bprocedimento\b/i,
  /\btreinamento\b/i,
  /\brelat[óo]rio\b/i,
  /\bcomprovante\b/i,
  /\bentreg[áa]vel\b/i,
  /\bfonte\b/i,
];

const KPI_PATTERNS = [
  /\bkpi\b/i,
  /\bindicador(?:es)?\b/i,
  /\bmeta\b/i,
  /\bbaseline\b/i,
  /\blinha de base\b/i,
  /\breavalia[çc][ãa]o\b/i,
  /\breavaliar\b/i,
  /\bmonitoramento\b/i,
  /\bmensal\b/i,
  /\btrimestral\b/i,
  /\bciclo seguinte\b/i,
];

const REVIEW_PATTERNS = [
  /\brevis[ãa]o(?: t[ée]cnica)?\b/i,
  /\brespons[áa]vel t[ée]cnico\b/i,
  /\bsst\b/i,
  /\bsesmt\b/i,
  /\bcipa\b/i,
  /\bergonomia\b/i,
  /\bauditoria\b/i,
  /\bassinat/i,
  /\bvalidado\b/i,
];

const BLOCKER_LABELS: Record<ActionGovernanceBlocker, string> = {
  missing_owner: "Definir responsável pela ação.",
  missing_due_date: "Definir prazo de execução ou reavaliação.",
  missing_risk_origin: "Vincular a ação a um ciclo ou dimensão de origem.",
  missing_expected_evidence: "Descrever a evidência esperada antes do fechamento.",
  missing_kpi_or_reassessment: "Definir KPI, indicador ou critério de reavaliação.",
  done_without_review_evidence: "Registrar revisão técnica antes de concluir.",
};

export function evaluateActionGovernance(action: ActionGovernanceInput): ActionGovernanceEvaluation {
  const status = action.status ?? "planned";
  const text = `${action.title ?? ""}\n${action.description ?? ""}`;
  const hasOwner = Boolean(action.assignee_user_id || action.assignee_name?.trim());
  const hasDeadline = Boolean(action.due_date);
  const hasRiskOrigin = Boolean(action.cycle_id || action.dimension);
  const hasEvidence = hasAnyPattern(text, EVIDENCE_PATTERNS);
  const hasKpi = hasAnyPattern(text, KPI_PATTERNS);
  const hasTechnicalReview = hasAnyPattern(text, REVIEW_PATTERNS);

  const signals: Record<ActionGovernanceSignal, boolean> = {
    owner: hasOwner,
    deadline: hasDeadline,
    risk_origin: hasRiskOrigin,
    evidence: hasEvidence,
    kpi: hasKpi,
    technical_review: hasTechnicalReview,
  };

  if (status === "cancelled") {
    return {
      signals,
      blockers: [],
      completionBlockers: [],
      documentWarnings: [],
      readyForClosure: false,
      readyForDocument: true,
      label: "cancelled",
      nextStep: "Ação cancelada. Mantenha justificativa e histórico fora deste avaliador até existir workflow formal.",
    };
  }

  const blockers: ActionGovernanceBlocker[] = [];
  if (!hasOwner) blockers.push("missing_owner");
  if (!hasDeadline) blockers.push("missing_due_date");
  if (!hasRiskOrigin) blockers.push("missing_risk_origin");
  if (!hasEvidence) blockers.push("missing_expected_evidence");
  if (!hasKpi) blockers.push("missing_kpi_or_reassessment");
  if (status === "done" && !hasTechnicalReview) blockers.push("done_without_review_evidence");

  const completionBlockers = blockers.filter((blocker) =>
    ["missing_owner", "missing_due_date", "missing_expected_evidence", "missing_kpi_or_reassessment", "done_without_review_evidence"].includes(blocker),
  );
  const documentWarnings = blockers.filter((blocker) => blocker !== "missing_risk_origin");
  const readyForClosure = completionBlockers.length === 0 && hasTechnicalReview;
  const readyForDocument = documentWarnings.length === 0;

  return {
    signals,
    blockers,
    completionBlockers,
    documentWarnings,
    readyForClosure,
    readyForDocument,
    label: getLabel(status, signals, readyForClosure),
    nextStep: getNextStep(blockers, hasTechnicalReview),
  };
}

export function actionGovernanceBlockerLabel(blocker: ActionGovernanceBlocker) {
  return BLOCKER_LABELS[blocker];
}

function hasAnyPattern(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text));
}

function getLabel(
  status: ActionStatusLike,
  signals: Record<ActionGovernanceSignal, boolean>,
  readyForClosure: boolean,
): ActionGovernanceEvaluation["label"] {
  if (status === "cancelled") return "cancelled";
  if (readyForClosure) return "review_ready";
  if (signals.evidence && signals.kpi) return "evidence_defined";
  if (signals.owner && signals.deadline) return "planned";
  return "draft";
}

function getNextStep(blockers: ActionGovernanceBlocker[], hasTechnicalReview: boolean) {
  if (blockers.length > 0) return BLOCKER_LABELS[blockers[0]];
  if (!hasTechnicalReview) return "Registrar revisão técnica antes de concluir.";
  return "Pronta para fechamento operacional, ainda sujeita à revisão formal do documento.";
}
