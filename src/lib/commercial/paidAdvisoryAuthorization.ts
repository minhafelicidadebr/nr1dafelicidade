export type PaidAdvisoryAuthorizationRoleKey =
  | "commercial_owner"
  | "legal_reviewer"
  | "delivery_owner"
  | "finance_owner";

export type PaidAdvisoryAuthorizationDiscipline = "commercial" | "legal" | "delivery" | "finance";
export type PaidAdvisoryAuthorizationDecisionStatus =
  | "pending"
  | "approved"
  | "approved_with_conditions"
  | "rejected";

export type PaidAdvisoryAuthorizationContext = {
  realDataEnabled: boolean;
  remoteDeliveryEnabled: boolean;
  paidPilotClaimed: boolean;
};

export type PaidAdvisoryAuthorizationPolicy = {
  policyId: string;
  targetGate: "G1";
  allowedScope: "synthetic_paid_advisory_only";
  requireAllChartersForReview: boolean;
  requireAllTemplatesForReview: boolean;
  requireNamedRolesForSale: boolean;
  requireAuthorityBackupCapacityAndEvidence: boolean;
  requireApprovedDecisionsForSale: boolean;
  allowConditionalApproval: boolean;
  requireBoundedConditions: boolean;
  prohibitRealData: boolean;
  prohibitRemoteDelivery: boolean;
  prohibitPaidPilotClaim: boolean;
};

export type PaidAdvisoryAuthorizationRoleInput = {
  key: PaidAdvisoryAuthorizationRoleKey;
  label: string;
  discipline: PaidAdvisoryAuthorizationDiscipline;
  required: boolean;
  charterReady: boolean;
  named: boolean;
  authorityRecorded: boolean;
  backupNamed: boolean;
  capacityConfirmed: boolean;
  evidenceRef: string | null;
  responsibilities: readonly string[];
  requiredEvidence: readonly string[];
  detail: string;
};

export type PaidAdvisoryAuthorizationTemplateSection = {
  key: string;
  label: string;
  complete: boolean;
  detail: string;
};

export type PaidAdvisoryAuthorizationCondition = {
  key: string;
  label: string;
  ownerRole: PaidAdvisoryAuthorizationRoleKey | null;
  dueDate: string | null;
  evidenceRef: string | null;
  detail: string;
};

export type PaidAdvisoryAuthorizationDecisionInput = {
  key: string;
  label: string;
  discipline: PaidAdvisoryAuthorizationDiscipline;
  required: boolean;
  templateSections: PaidAdvisoryAuthorizationTemplateSection[];
  decision: PaidAdvisoryAuthorizationDecisionStatus;
  evidenceRef: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  conditions: PaidAdvisoryAuthorizationCondition[];
  detail: string;
};

export type PaidAdvisoryAuthorizationBlocker =
  | "required_role_missing"
  | "required_decision_missing"
  | "duplicate_role_key"
  | "duplicate_decision_key"
  | "duplicate_template_section"
  | "role_charter_incomplete"
  | "role_not_named"
  | "role_authority_missing"
  | "role_backup_missing"
  | "role_capacity_missing"
  | "role_evidence_missing"
  | "decision_template_incomplete"
  | "decision_pending"
  | "decision_rejected"
  | "decision_evidence_missing"
  | "decision_attribution_missing"
  | "conditional_approval_not_allowed"
  | "condition_not_bounded"
  | "conditions_require_conditional_decision"
  | "real_data_enabled"
  | "remote_delivery_enabled"
  | "paid_pilot_claimed";

export type PaidAdvisoryAuthorizationRole = PaidAdvisoryAuthorizationRoleInput & {
  readyForReview: boolean;
  readyForSale: boolean;
  blockers: PaidAdvisoryAuthorizationBlocker[];
};

export type PaidAdvisoryAuthorizationDecision = PaidAdvisoryAuthorizationDecisionInput & {
  readyForReview: boolean;
  readyForSale: boolean;
  blockers: PaidAdvisoryAuthorizationBlocker[];
  completedSections: number;
  boundedConditions: number;
  unboundedConditions: number;
};

export type PaidAdvisoryAuthorizationSummary = {
  policyId: string;
  targetGate: "G1";
  allowedScope: "synthetic_paid_advisory_only";
  status: "blocked" | "review_packet_ready" | "authorized_for_sale";
  canRequestFormalReview: boolean;
  canAuthorizeSale: boolean;
  roles: PaidAdvisoryAuthorizationRole[];
  decisions: PaidAdvisoryAuthorizationDecision[];
  reviewBlockers: PaidAdvisoryAuthorizationBlocker[];
  saleBlockers: PaidAdvisoryAuthorizationBlocker[];
  requiredRoles: number;
  reviewReadyRoles: number;
  saleReadyRoles: number;
  requiredDecisions: number;
  reviewReadyDecisions: number;
  saleReadyDecisions: number;
  templateReadinessPct: number;
  authorizationReadinessPct: number;
  nextReviewRole: PaidAdvisoryAuthorizationRole | null;
  nextReviewDecision: PaidAdvisoryAuthorizationDecision | null;
  nextSaleRole: PaidAdvisoryAuthorizationRole | null;
  nextSaleDecision: PaidAdvisoryAuthorizationDecision | null;
};

export function evaluatePaidAdvisoryAuthorization(
  roles: PaidAdvisoryAuthorizationRoleInput[],
  decisions: PaidAdvisoryAuthorizationDecisionInput[],
  context: PaidAdvisoryAuthorizationContext,
  policy: PaidAdvisoryAuthorizationPolicy,
): PaidAdvisoryAuthorizationSummary {
  const evaluatedRoles = roles.map((role) => evaluateRole(role, policy));
  const evaluatedDecisions = decisions.map((decision) => evaluateDecision(decision, policy));
  const requiredRoles = evaluatedRoles.filter((role) => role.required);
  const requiredDecisions = evaluatedDecisions.filter((decision) => decision.required);
  const structuralBlockers: PaidAdvisoryAuthorizationBlocker[] = [];
  const contextBlockers: PaidAdvisoryAuthorizationBlocker[] = [];

  if (requiredRoles.length === 0) structuralBlockers.push("required_role_missing");
  if (requiredDecisions.length === 0) structuralBlockers.push("required_decision_missing");
  if (hasDuplicates(roles.map((role) => role.key))) structuralBlockers.push("duplicate_role_key");
  if (hasDuplicates(decisions.map((decision) => decision.key))) structuralBlockers.push("duplicate_decision_key");
  if (policy.prohibitRealData && context.realDataEnabled) contextBlockers.push("real_data_enabled");
  if (policy.prohibitRemoteDelivery && context.remoteDeliveryEnabled) contextBlockers.push("remote_delivery_enabled");
  if (policy.prohibitPaidPilotClaim && context.paidPilotClaimed) contextBlockers.push("paid_pilot_claimed");

  const reviewBlockers = unique([
    ...structuralBlockers,
    ...contextBlockers,
    ...requiredRoles.flatMap((role) =>
      role.blockers.filter((blocker) => blocker === "role_charter_incomplete"),
    ),
    ...requiredDecisions.flatMap((decision) =>
      decision.blockers.filter((blocker) =>
        blocker === "duplicate_template_section" || blocker === "decision_template_incomplete",
      ),
    ),
  ]);
  const saleBlockers = unique([
    ...structuralBlockers,
    ...contextBlockers,
    ...requiredRoles.flatMap((role) => role.blockers),
    ...requiredDecisions.flatMap((decision) => decision.blockers),
  ]);
  const canRequestFormalReview =
    requiredRoles.length > 0 &&
    requiredDecisions.length > 0 &&
    requiredRoles.every((role) => role.readyForReview) &&
    requiredDecisions.every((decision) => decision.readyForReview) &&
    reviewBlockers.length === 0;
  const canAuthorizeSale =
    canRequestFormalReview &&
    requiredRoles.every((role) => role.readyForSale) &&
    requiredDecisions.every((decision) => decision.readyForSale) &&
    saleBlockers.length === 0;
  const reviewReadyCount =
    requiredRoles.filter((role) => role.readyForReview).length +
    requiredDecisions.filter((decision) => decision.readyForReview).length;
  const saleReadyCount =
    requiredRoles.filter((role) => role.readyForSale).length +
    requiredDecisions.filter((decision) => decision.readyForSale).length;
  const requiredCount = requiredRoles.length + requiredDecisions.length;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    allowedScope: policy.allowedScope,
    status: canAuthorizeSale ? "authorized_for_sale" : canRequestFormalReview ? "review_packet_ready" : "blocked",
    canRequestFormalReview,
    canAuthorizeSale,
    roles: evaluatedRoles,
    decisions: evaluatedDecisions,
    reviewBlockers,
    saleBlockers,
    requiredRoles: requiredRoles.length,
    reviewReadyRoles: requiredRoles.filter((role) => role.readyForReview).length,
    saleReadyRoles: requiredRoles.filter((role) => role.readyForSale).length,
    requiredDecisions: requiredDecisions.length,
    reviewReadyDecisions: requiredDecisions.filter((decision) => decision.readyForReview).length,
    saleReadyDecisions: requiredDecisions.filter((decision) => decision.readyForSale).length,
    templateReadinessPct: pct(reviewReadyCount, requiredCount),
    authorizationReadinessPct: pct(saleReadyCount, requiredCount),
    nextReviewRole: requiredRoles.find((role) => !role.readyForReview) ?? null,
    nextReviewDecision: requiredDecisions.find((decision) => !decision.readyForReview) ?? null,
    nextSaleRole: requiredRoles.find((role) => !role.readyForSale) ?? null,
    nextSaleDecision: requiredDecisions.find((decision) => !decision.readyForSale) ?? null,
  };
}

export function paidAdvisoryAuthorizationBlockerLabel(blocker: PaidAdvisoryAuthorizationBlocker) {
  const labels: Record<PaidAdvisoryAuthorizationBlocker, string> = {
    required_role_missing: "Definir ao menos um papel obrigatório.",
    required_decision_missing: "Definir ao menos uma decisão obrigatória.",
    duplicate_role_key: "Remover papéis duplicados do pacote.",
    duplicate_decision_key: "Remover decisões duplicadas do pacote.",
    duplicate_template_section: "Remover seções duplicadas do template.",
    role_charter_incomplete: "Completar a carta de papel antes da revisão.",
    role_not_named: "Nomear o responsável antes da autorização de venda.",
    role_authority_missing: "Registrar autoridade e alçada do responsável.",
    role_backup_missing: "Nomear substituto para continuidade da entrega.",
    role_capacity_missing: "Confirmar capacidade operacional antes da venda.",
    role_evidence_missing: "Vincular evidência verificável do papel e mandato.",
    decision_template_incomplete: "Completar todas as seções do template de decisão.",
    decision_pending: "Registrar decisão formal da disciplina.",
    decision_rejected: "Resolver a rejeição antes de autorizar a venda.",
    decision_evidence_missing: "Vincular parecer, ata ou aceite verificável.",
    decision_attribution_missing: "Registrar responsável e data da decisão.",
    conditional_approval_not_allowed: "Remover ressalvas ou alterar a política formalmente.",
    condition_not_bounded: "Dar owner, prazo e evidência para cada ressalva.",
    conditions_require_conditional_decision: "Classificar como aprovação com ressalvas quando houver condições.",
    real_data_enabled: "Remover dados reais; o serviço autorizado é exclusivamente sintético.",
    remote_delivery_enabled: "Manter CRM, calendário e transporte remoto desabilitados.",
    paid_pilot_claimed: "Remover claim de piloto; a autorização cobre somente serviço assistido.",
  };
  return labels[blocker];
}

function evaluateRole(
  role: PaidAdvisoryAuthorizationRoleInput,
  policy: PaidAdvisoryAuthorizationPolicy,
): PaidAdvisoryAuthorizationRole {
  const blockers: PaidAdvisoryAuthorizationBlocker[] = [];
  if (role.required && policy.requireAllChartersForReview && !role.charterReady) blockers.push("role_charter_incomplete");
  if (role.required && policy.requireNamedRolesForSale && !role.named) blockers.push("role_not_named");
  if (role.required && policy.requireAuthorityBackupCapacityAndEvidence) {
    if (!role.authorityRecorded) blockers.push("role_authority_missing");
    if (!role.backupNamed) blockers.push("role_backup_missing");
    if (!role.capacityConfirmed) blockers.push("role_capacity_missing");
    if (!role.evidenceRef) blockers.push("role_evidence_missing");
  }
  return {
    ...role,
    readyForReview: !blockers.includes("role_charter_incomplete"),
    readyForSale: blockers.length === 0,
    blockers,
  };
}

function evaluateDecision(
  decision: PaidAdvisoryAuthorizationDecisionInput,
  policy: PaidAdvisoryAuthorizationPolicy,
): PaidAdvisoryAuthorizationDecision {
  const blockers: PaidAdvisoryAuthorizationBlocker[] = [];
  const completedSections = decision.templateSections.filter((section) => section.complete).length;
  const boundedConditions = decision.conditions.filter(isConditionBounded).length;
  const unboundedConditions = decision.conditions.length - boundedConditions;
  const duplicateSections = hasDuplicates(decision.templateSections.map((section) => section.key));

  if (duplicateSections) blockers.push("duplicate_template_section");
  if (
    decision.required &&
    policy.requireAllTemplatesForReview &&
    (decision.templateSections.length === 0 || completedSections !== decision.templateSections.length)
  ) {
    blockers.push("decision_template_incomplete");
  }
  if (decision.required && policy.requireApprovedDecisionsForSale) {
    if (decision.decision === "pending") blockers.push("decision_pending");
    if (decision.decision === "rejected") blockers.push("decision_rejected");
    if (decision.decision !== "pending" && !decision.evidenceRef) blockers.push("decision_evidence_missing");
    if (
      decision.decision !== "pending" &&
      (!decision.decidedBy?.trim() || !isIsoDate(decision.decidedAt))
    ) {
      blockers.push("decision_attribution_missing");
    }
    if (decision.decision === "approved_with_conditions" && !policy.allowConditionalApproval) {
      blockers.push("conditional_approval_not_allowed");
    }
    if (
      decision.decision === "approved_with_conditions" &&
      policy.requireBoundedConditions &&
      (decision.conditions.length === 0 || unboundedConditions > 0)
    ) {
      blockers.push("condition_not_bounded");
    }
    if (decision.decision === "approved" && decision.conditions.length > 0) {
      blockers.push("conditions_require_conditional_decision");
    }
  }

  const reviewBlockers = new Set<PaidAdvisoryAuthorizationBlocker>([
    "duplicate_template_section",
    "decision_template_incomplete",
  ]);
  return {
    ...decision,
    readyForReview: blockers.every((blocker) => !reviewBlockers.has(blocker)),
    readyForSale: blockers.length === 0,
    blockers,
    completedSections,
    boundedConditions,
    unboundedConditions,
  };
}

function isConditionBounded(condition: PaidAdvisoryAuthorizationCondition) {
  return Boolean(condition.ownerRole && isIsoDate(condition.dueDate) && condition.evidenceRef?.trim());
}

function isIsoDate(value: string | null) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function hasDuplicates(values: readonly string[]) {
  return new Set(values).size !== values.length;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
