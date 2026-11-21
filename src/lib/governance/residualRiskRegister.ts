export type ResidualRiskCategory =
  | "privacy"
  | "methodology"
  | "regulatory"
  | "release"
  | "operation"
  | "commercial"
  | "security";

export type ResidualRiskSeverity = "critical" | "high" | "medium" | "low";
export type ResidualRiskLikelihood = "high" | "medium" | "low";
export type ResidualRiskStatus = "mitigated" | "controlled" | "open" | "blocked";

export type ResidualRiskInput = {
  key: string;
  label: string;
  category: ResidualRiskCategory;
  severity: ResidualRiskSeverity;
  likelihood: ResidualRiskLikelihood;
  status: ResidualRiskStatus;
  gateBlocking: boolean;
  ownerAssigned: boolean;
  evidenceRef?: string;
  mitigation: string;
  nextAction: string;
};

export type ResidualRiskPolicy = {
  policyId: string;
  targetGate: "G1";
  requireNoCriticalOpen: boolean;
  requireOwnerForGateBlocking: boolean;
  requireEvidenceForGateBlocking: boolean;
  requireMitigationForHighRisk: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type ResidualRiskContext = {
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
};

export type ResidualRiskBlocker =
  | "critical_risk_open"
  | "gate_blocking_owner_missing"
  | "gate_blocking_evidence_missing"
  | "high_risk_mitigation_missing"
  | "real_data_enabled"
  | "gate_advance_claimed";

export type ResidualRisk = ResidualRiskInput & {
  ready: boolean;
  score: number;
};

export type ResidualRiskSummary = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "ready_for_risk_review";
  canRequestRiskReview: boolean;
  risks: ResidualRisk[];
  blockers: ResidualRiskBlocker[];
  total: number;
  ready: number;
  controlled: number;
  open: number;
  blocked: number;
  criticalOpen: number;
  highOpen: number;
  gateBlockingOpen: number;
  readinessPct: number;
  residualScore: number;
  nextStep: ResidualRisk | null;
};

const severityWeight: Record<ResidualRiskSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const likelihoodWeight: Record<ResidualRiskLikelihood, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function evaluateResidualRiskRegister(
  risks: ResidualRiskInput[],
  context: ResidualRiskContext,
  policy: ResidualRiskPolicy,
): ResidualRiskSummary {
  const evaluated = risks.map((risk) => ({
    ...risk,
    ready: risk.status === "mitigated" || risk.status === "controlled",
    score: severityWeight[risk.severity] * likelihoodWeight[risk.likelihood],
  }));
  const blockers: ResidualRiskBlocker[] = [];

  for (const risk of evaluated) {
    if (policy.requireNoCriticalOpen && risk.severity === "critical" && !risk.ready) {
      blockers.push("critical_risk_open");
    }
    if (policy.requireOwnerForGateBlocking && risk.gateBlocking && !risk.ownerAssigned) {
      blockers.push("gate_blocking_owner_missing");
    }
    if (policy.requireEvidenceForGateBlocking && risk.gateBlocking && !risk.evidenceRef) {
      blockers.push("gate_blocking_evidence_missing");
    }
    if (
      policy.requireMitigationForHighRisk &&
      ["critical", "high"].includes(risk.severity) &&
      risk.mitigation.trim().length === 0
    ) {
      blockers.push("high_risk_mitigation_missing");
    }
  }

  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.push("gate_advance_claimed");

  const uniqueBlockers = unique(blockers);
  const ready = evaluated.filter((risk) => risk.ready).length;
  const gateBlockingOpen = evaluated.filter((risk) => risk.gateBlocking && !risk.ready).length;
  const canRequestRiskReview = evaluated.length > 0 && gateBlockingOpen === 0 && uniqueBlockers.length === 0;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canRequestRiskReview ? "ready_for_risk_review" : "blocked",
    canRequestRiskReview,
    risks: evaluated,
    blockers: uniqueBlockers,
    total: evaluated.length,
    ready,
    controlled: evaluated.filter((risk) => risk.status === "controlled").length,
    open: evaluated.filter((risk) => risk.status === "open").length,
    blocked: evaluated.filter((risk) => risk.status === "blocked").length,
    criticalOpen: evaluated.filter((risk) => risk.severity === "critical" && !risk.ready).length,
    highOpen: evaluated.filter((risk) => risk.severity === "high" && !risk.ready).length,
    gateBlockingOpen,
    readinessPct: pct(ready, evaluated.length),
    residualScore: evaluated
      .filter((risk) => !risk.ready)
      .reduce((total, risk) => total + risk.score, 0),
    nextStep: evaluated
      .filter((risk) => risk.gateBlocking && !risk.ready)
      .sort((a, b) => b.score - a.score)[0] ?? null,
  };
}

export function residualRiskBlockerLabel(blocker: ResidualRiskBlocker) {
  const labels: Record<ResidualRiskBlocker, string> = {
    critical_risk_open: "Mitigar ou controlar riscos criticos antes de revisao G1.",
    gate_blocking_owner_missing: "Nomear dono responsavel para todo risco bloqueante.",
    gate_blocking_evidence_missing: "Vincular evidencia auditavel aos riscos bloqueantes.",
    high_risk_mitigation_missing: "Registrar mitigacao para riscos altos e criticos.",
    real_data_enabled: "Manter dados reais bloqueados durante G1.",
    gate_advance_claimed: "Remover qualquer alegacao de G1 aprovado.",
  };
  return labels[blocker];
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
