export type FormalAcceptanceRoleKey =
  | "product_sponsor"
  | "sst_owner"
  | "ergonomics_owner"
  | "methodology_owner"
  | "dpo_owner"
  | "legal_owner"
  | "security_owner"
  | "worker_representation"
  | "operations_owner";

export type FormalAcceptanceDiscipline =
  | "product"
  | "sst"
  | "ergonomics"
  | "methodology"
  | "privacy"
  | "legal"
  | "security"
  | "worker_representation"
  | "operations";

export type FormalDecisionStatus = "pending" | "approved" | "approved_with_conditions" | "rejected";

export type FormalConditionInput = {
  key: string;
  label: string;
  ownerRole: FormalAcceptanceRoleKey | null;
  dueDate: string | null;
  evidenceRef: string | null;
  evidenceSha256: string | null;
  detail: string;
};

export type FormalRoleInput = {
  key: FormalAcceptanceRoleKey;
  label: string;
  required: boolean;
  named: boolean;
  authorityRecorded: boolean;
  backupNamed: boolean;
  detail: string;
};

export type FormalDecisionInput = {
  discipline: FormalAcceptanceDiscipline;
  label: string;
  required: boolean;
  decision: FormalDecisionStatus;
  evidenceRef: string | null;
  evidenceSha256: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  conditions: FormalConditionInput[];
  detail: string;
};

export type FormalAcceptancePolicy = {
  policyId: string;
  targetGate: "G1";
  allowedScope: "synthetic_campaign_only";
  requireAllRolesNamed: boolean;
  requireAuthorityAndBackup: boolean;
  requireAllRequiredDecisions: boolean;
  allowConditionalApproval: boolean;
  requireBoundedConditions: boolean;
  requireEvidenceDigest: boolean;
  prohibitRealData: boolean;
};

export type FormalRole = FormalRoleInput & {
  ready: boolean;
  blockers: FormalAcceptanceBlocker[];
};

export type FormalDecision = FormalDecisionInput & {
  ready: boolean;
  blockers: FormalAcceptanceBlocker[];
  boundedConditions: number;
  unboundedConditions: number;
};

export type FormalAcceptanceBlocker =
  | "role_not_named"
  | "authority_missing"
  | "backup_missing"
  | "decision_pending"
  | "decision_rejected"
  | "decision_evidence_missing"
  | "decision_evidence_digest_missing_or_invalid"
  | "conditional_approval_not_allowed"
  | "condition_not_bounded"
  | "condition_evidence_digest_missing_or_invalid"
  | "real_data_scope_forbidden";

export type FormalAcceptanceSummary = {
  policyId: string;
  targetGate: "G1";
  allowedScope: "synthetic_campaign_only";
  status: "blocked" | "ready_for_synthetic_acceptance";
  canAcceptSyntheticG1: boolean;
  roles: FormalRole[];
  decisions: FormalDecision[];
  blockers: FormalAcceptanceBlocker[];
  requiredRoles: number;
  readyRoles: number;
  requiredDecisions: number;
  readyDecisions: number;
  totalConditions: number;
  unboundedConditions: number;
  roleReadinessPct: number;
  decisionReadinessPct: number;
  nextRole: FormalRole | null;
  nextDecision: FormalDecision | null;
};

export function evaluateFormalAcceptance(
  roles: FormalRoleInput[],
  decisions: FormalDecisionInput[],
  policy: FormalAcceptancePolicy,
): FormalAcceptanceSummary {
  const evaluatedRoles = roles.map((role) => evaluateRole(role, policy));
  const evaluatedDecisions = decisions.map((decision) => evaluateDecision(decision, policy));
  const requiredRoles = evaluatedRoles.filter((role) => role.required);
  const requiredDecisions = evaluatedDecisions.filter((decision) => decision.required);
  const blockers = unique([
    ...evaluatedRoles.flatMap((role) => role.blockers),
    ...evaluatedDecisions.flatMap((decision) => decision.blockers),
  ]);

  if (!policy.prohibitRealData) blockers.push("real_data_scope_forbidden");

  const canAcceptSyntheticG1 =
    requiredRoles.every((role) => role.ready) &&
    requiredDecisions.every((decision) => decision.ready) &&
    policy.prohibitRealData &&
    blockers.length === 0;

  const totalConditions = evaluatedDecisions.reduce(
    (total, decision) => total + decision.conditions.length,
    0,
  );
  const unboundedConditions = evaluatedDecisions.reduce(
    (total, decision) => total + decision.unboundedConditions,
    0,
  );

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    allowedScope: policy.allowedScope,
    status: canAcceptSyntheticG1 ? "ready_for_synthetic_acceptance" : "blocked",
    canAcceptSyntheticG1,
    roles: evaluatedRoles,
    decisions: evaluatedDecisions,
    blockers: unique(blockers),
    requiredRoles: requiredRoles.length,
    readyRoles: requiredRoles.filter((role) => role.ready).length,
    requiredDecisions: requiredDecisions.length,
    readyDecisions: requiredDecisions.filter((decision) => decision.ready).length,
    totalConditions,
    unboundedConditions,
    roleReadinessPct: pct(requiredRoles.filter((role) => role.ready).length, requiredRoles.length),
    decisionReadinessPct: pct(requiredDecisions.filter((decision) => decision.ready).length, requiredDecisions.length),
    nextRole: requiredRoles.find((role) => !role.ready) ?? null,
    nextDecision: requiredDecisions.find((decision) => !decision.ready) ?? null,
  };
}

export function formalAcceptanceBlockerLabel(blocker: FormalAcceptanceBlocker) {
  const labels: Record<FormalAcceptanceBlocker, string> = {
    role_not_named: "Nomear o responsavel obrigatorio.",
    authority_missing: "Registrar autoridade, registro profissional ou mandato.",
    backup_missing: "Nomear substituto para continuidade e auditoria.",
    decision_pending: "Registrar decisao formal da disciplina.",
    decision_rejected: "Resolver rejeicao antes de qualquer aceite de gate.",
    decision_evidence_missing: "Vincular evidencia, ata ou parecer verificavel.",
    decision_evidence_digest_missing_or_invalid: "Vincular SHA-256 valido da evidencia, ata ou parecer.",
    conditional_approval_not_allowed: "Remover aprovacao com ressalvas ou alterar politica formal.",
    condition_not_bounded: "Dar responsavel, prazo e evidencia para cada ressalva.",
    condition_evidence_digest_missing_or_invalid: "Vincular SHA-256 valido para a evidencia de cada ressalva.",
    real_data_scope_forbidden: "Manter escopo sintetico; dados reais seguem proibidos.",
  };
  return labels[blocker];
}

function evaluateRole(role: FormalRoleInput, policy: FormalAcceptancePolicy): FormalRole {
  const blockers: FormalAcceptanceBlocker[] = [];

  if (role.required && policy.requireAllRolesNamed && !role.named) blockers.push("role_not_named");
  if (role.required && policy.requireAuthorityAndBackup && !role.authorityRecorded) blockers.push("authority_missing");
  if (role.required && policy.requireAuthorityAndBackup && !role.backupNamed) blockers.push("backup_missing");

  return {
    ...role,
    ready: blockers.length === 0,
    blockers,
  };
}

function evaluateDecision(
  decision: FormalDecisionInput,
  policy: FormalAcceptancePolicy,
): FormalDecision {
  const blockers: FormalAcceptanceBlocker[] = [];
  const boundedConditions = decision.conditions.filter((condition) => isConditionBounded(condition, policy)).length;
  const unboundedConditions = decision.conditions.length - boundedConditions;

  if (decision.required && policy.requireAllRequiredDecisions) {
    if (decision.decision === "pending") blockers.push("decision_pending");
    if (decision.decision === "rejected") blockers.push("decision_rejected");
    if (decision.decision !== "pending" && !decision.evidenceRef) blockers.push("decision_evidence_missing");
    if (
      decision.decision !== "pending" &&
      policy.requireEvidenceDigest &&
      !isEvidenceDigestValid(decision.evidenceSha256)
    ) {
      blockers.push("decision_evidence_digest_missing_or_invalid");
    }
    if (decision.decision === "approved_with_conditions" && !policy.allowConditionalApproval) {
      blockers.push("conditional_approval_not_allowed");
    }
    if (
      decision.decision === "approved_with_conditions" &&
      policy.requireBoundedConditions &&
      unboundedConditions > 0
    ) {
      blockers.push("condition_not_bounded");
    }
    if (
      decision.decision === "approved_with_conditions" &&
      policy.requireEvidenceDigest &&
      decision.conditions.some((condition) => !isEvidenceDigestValid(condition.evidenceSha256))
    ) {
      blockers.push("condition_evidence_digest_missing_or_invalid");
    }
  }

  return {
    ...decision,
    ready: blockers.length === 0,
    blockers,
    boundedConditions,
    unboundedConditions,
  };
}

function isConditionBounded(condition: FormalConditionInput, policy: FormalAcceptancePolicy) {
  return Boolean(
    condition.ownerRole
    && condition.dueDate
    && condition.evidenceRef
    && (!policy.requireEvidenceDigest || isEvidenceDigestValid(condition.evidenceSha256)),
  );
}

function isEvidenceDigestValid(value: string | null) {
  return Boolean(value && /^[a-f0-9]{64}$/i.test(value));
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
