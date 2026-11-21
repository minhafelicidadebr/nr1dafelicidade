export type ExternalSessionDecisionDimension =
  | "runtime"
  | "guided_session"
  | "narrative"
  | "release"
  | "accountability"
  | "residual_risk";

export type ExternalSessionEvidenceStatus = "ready" | "partial" | "blocked";

export type ExternalSessionEvidenceInput = {
  key: string;
  label: string;
  dimension: ExternalSessionDecisionDimension;
  status: ExternalSessionEvidenceStatus;
  evidenceRef: string;
  detail: string;
};

export type ExternalSessionDecisionPolicy = {
  policyId: string;
  targetGate: "G1";
  allowedScope: "external_synthetic_session_only";
  requiredDimensions: readonly ExternalSessionDecisionDimension[];
  requireFormalApproval: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type ExternalSessionDecisionContext = {
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
  formalDecision: "pending" | "approved" | "rejected";
  formalDecisionEvidenceRef: string | null;
};

export type ExternalSessionDecisionBlocker =
  | "required_evidence_not_ready"
  | "required_dimension_missing"
  | "real_data_enabled"
  | "gate_advance_claimed"
  | "formal_decision_pending"
  | "formal_decision_rejected"
  | "formal_decision_evidence_missing";

export type ExternalSessionEvidence = ExternalSessionEvidenceInput & {
  ready: boolean;
};

export type ExternalSessionDecisionSummary = {
  policyId: string;
  targetGate: "G1";
  allowedScope: "external_synthetic_session_only";
  status: "no_go" | "ready_for_formal_review" | "approved_for_external_synthetic_session" | "rejected";
  canRequestFormalReview: boolean;
  canRunExternalSyntheticSession: boolean;
  canUseRealData: false;
  items: ExternalSessionEvidence[];
  blockers: ExternalSessionDecisionBlocker[];
  ready: number;
  total: number;
  readinessPct: number;
  nextStep: ExternalSessionEvidence | null;
};

export function evaluateExternalSessionDecision(
  evidence: ExternalSessionEvidenceInput[],
  context: ExternalSessionDecisionContext,
  policy: ExternalSessionDecisionPolicy,
): ExternalSessionDecisionSummary {
  const items = evidence.map((item) => ({ ...item, ready: item.status === "ready" }));
  const blockers: ExternalSessionDecisionBlocker[] = [];
  const presentDimensions = new Set(items.map((item) => item.dimension));
  const missingDimension = policy.requiredDimensions.some((dimension) => !presentDimensions.has(dimension));
  const requiredItems = items.filter((item) => policy.requiredDimensions.includes(item.dimension));

  if (missingDimension) blockers.push("required_dimension_missing");
  if (requiredItems.some((item) => !item.ready)) blockers.push("required_evidence_not_ready");
  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.push("gate_advance_claimed");

  if (policy.requireFormalApproval) {
    if (context.formalDecision === "pending") blockers.push("formal_decision_pending");
    if (context.formalDecision === "rejected") blockers.push("formal_decision_rejected");
    if (context.formalDecision === "approved" && !context.formalDecisionEvidenceRef?.trim()) {
      blockers.push("formal_decision_evidence_missing");
    }
  }

  const evidenceReady =
    items.length > 0 &&
    !missingDimension &&
    requiredItems.length >= policy.requiredDimensions.length &&
    requiredItems.every((item) => item.ready);
  const safeContext =
    (!policy.prohibitRealData || !context.realDataEnabled) &&
    (!policy.prohibitGateAdvance || !context.gateAdvanceClaimed);
  const canRequestFormalReview = evidenceReady && safeContext && context.formalDecision !== "rejected";
  const formalApprovalReady =
    !policy.requireFormalApproval ||
    (context.formalDecision === "approved" && Boolean(context.formalDecisionEvidenceRef?.trim()));
  const canRunExternalSyntheticSession = canRequestFormalReview && formalApprovalReady;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    allowedScope: policy.allowedScope,
    status: context.formalDecision === "rejected"
      ? "rejected"
      : canRunExternalSyntheticSession
        ? "approved_for_external_synthetic_session"
        : canRequestFormalReview
          ? "ready_for_formal_review"
          : "no_go",
    canRequestFormalReview,
    canRunExternalSyntheticSession,
    canUseRealData: false,
    items,
    blockers: unique(blockers),
    ready: items.filter((item) => item.ready).length,
    total: items.length,
    readinessPct: pct(items.filter((item) => item.ready).length, items.length),
    nextStep: requiredItems.find((item) => !item.ready) ?? null,
  };
}

export function externalSessionDecisionBlockerLabel(blocker: ExternalSessionDecisionBlocker) {
  const labels: Record<ExternalSessionDecisionBlocker, string> = {
    required_evidence_not_ready: "Concluir todas as evidências obrigatórias antes da revisão formal.",
    required_dimension_missing: "Registrar todas as dimensões obrigatórias no pacote de decisão.",
    real_data_enabled: "Desabilitar dados reais; este pacote permite apenas sessão sintética.",
    gate_advance_claimed: "Remover qualquer alegação de avanço de gate sem aceite formal.",
    formal_decision_pending: "Obter decisão formal e evidência verificável dos responsáveis competentes.",
    formal_decision_rejected: "Resolver a rejeição formal antes de preparar nova submissão.",
    formal_decision_evidence_missing: "Vincular ata ou parecer à decisão formal aprovada.",
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
