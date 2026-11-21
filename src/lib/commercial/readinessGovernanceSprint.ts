import type { DesignPartnerOfferSummary } from "./designPartnerOffer";

export type ReadinessGovernanceSprintScopeKey =
  | "executive_workshop"
  | "sites_roles_mapping"
  | "document_categories"
  | "readiness_matrix"
  | "procurement_risks"
  | "preliminary_privacy_threat_model"
  | "implementation_gates"
  | "executive_closeout";

export type ReadinessGovernanceSprintExclusionKey =
  | "worker_research"
  | "nr1_diagnosis"
  | "psychometric_scoring"
  | "real_inventory_or_risk_classification"
  | "pgr_or_technical_report"
  | "personal_data_processing";

export type ReadinessGovernanceSprintItem<TKey extends string> = {
  key: TKey;
  label: string;
};

export type ReadinessGovernanceSprintDefinition = {
  policyId: string;
  targetGate: "G1";
  title: string;
  description: string;
  deliverable: string;
  deliverableBoundary: string;
  scope: ReadonlyArray<ReadinessGovernanceSprintItem<ReadinessGovernanceSprintScopeKey>>;
  exclusions: ReadonlyArray<ReadinessGovernanceSprintItem<ReadinessGovernanceSprintExclusionKey>>;
  operatingBoundary: string;
};

export type ReadinessGovernanceSprintOfferState = Pick<
  DesignPartnerOfferSummary,
  "canPublishOfferBrief" | "canRequestPaidAdvisoryReview" | "canSellPaidAdvisory"
>;

export type ReadinessGovernanceSprintDefinitionIssue =
  | "missing_core_definition"
  | "missing_scope_control"
  | "missing_exclusion_control";

export type ReadinessGovernanceSprintBlocker =
  | "definition_incomplete"
  | "offer_brief_not_publishable"
  | "paid_advisory_review_not_ready"
  | "formal_paid_advisory_authorization_pending";

export type ReadinessGovernanceSprintStatus =
  | "blocked"
  | "scope_available"
  | "formal_review_required"
  | "formally_authorized";

export type ReadinessGovernanceSprintSummary = {
  policyId: string;
  targetGate: "G1";
  status: ReadinessGovernanceSprintStatus;
  definitionIssues: ReadinessGovernanceSprintDefinitionIssue[];
  blockers: ReadinessGovernanceSprintBlocker[];
  canPublishScope: boolean;
  canPrepareFormalReview: boolean;
  canPresentAsAuthorizedPaidOffer: boolean;
  nextStep: string;
};

const requiredScopeKeys: ReadonlyArray<ReadinessGovernanceSprintScopeKey> = [
  "executive_workshop",
  "sites_roles_mapping",
  "document_categories",
  "readiness_matrix",
  "procurement_risks",
  "preliminary_privacy_threat_model",
  "implementation_gates",
  "executive_closeout",
];

const requiredExclusionKeys: ReadonlyArray<ReadinessGovernanceSprintExclusionKey> = [
  "worker_research",
  "nr1_diagnosis",
  "psychometric_scoring",
  "real_inventory_or_risk_classification",
  "pgr_or_technical_report",
  "personal_data_processing",
];

function hasEveryKey<TKey extends string>(
  items: ReadonlyArray<ReadinessGovernanceSprintItem<TKey>>,
  requiredKeys: ReadonlyArray<TKey>,
) {
  const keys = new Set(items.map((item) => item.key));
  return requiredKeys.every((key) => keys.has(key));
}

export function evaluateReadinessGovernanceSprint(
  definition: ReadinessGovernanceSprintDefinition,
  offer: ReadinessGovernanceSprintOfferState,
): ReadinessGovernanceSprintSummary {
  const definitionIssues: ReadinessGovernanceSprintDefinitionIssue[] = [];

  if (!definition.policyId || !definition.title || !definition.description || !definition.deliverable || !definition.deliverableBoundary || !definition.operatingBoundary) {
    definitionIssues.push("missing_core_definition");
  }
  if (!hasEveryKey(definition.scope, requiredScopeKeys)) {
    definitionIssues.push("missing_scope_control");
  }
  if (!hasEveryKey(definition.exclusions, requiredExclusionKeys)) {
    definitionIssues.push("missing_exclusion_control");
  }

  const definitionComplete = definitionIssues.length === 0;
  const canPublishScope = definitionComplete && offer.canPublishOfferBrief;
  const canPrepareFormalReview = canPublishScope && offer.canRequestPaidAdvisoryReview;
  const canPresentAsAuthorizedPaidOffer = canPrepareFormalReview && offer.canSellPaidAdvisory;
  const blockers: ReadinessGovernanceSprintBlocker[] = [];

  if (!definitionComplete) blockers.push("definition_incomplete");
  if (!offer.canPublishOfferBrief) blockers.push("offer_brief_not_publishable");
  if (canPublishScope && !offer.canRequestPaidAdvisoryReview) blockers.push("paid_advisory_review_not_ready");
  if (canPrepareFormalReview && !offer.canSellPaidAdvisory) {
    blockers.push("formal_paid_advisory_authorization_pending");
  }

  const status = canPresentAsAuthorizedPaidOffer
    ? "formally_authorized"
    : canPrepareFormalReview
      ? "formal_review_required"
      : canPublishScope
        ? "scope_available"
        : "blocked";

  return {
    policyId: `readiness-governance-sprint-${definition.policyId}`,
    targetGate: definition.targetGate,
    status,
    definitionIssues,
    blockers,
    canPublishScope,
    canPrepareFormalReview,
    canPresentAsAuthorizedPaidOffer,
    nextStep: canPresentAsAuthorizedPaidOffer
      ? "Manter a entrega assistida dentro do escopo aprovado e dos gates aplicáveis."
      : canPrepareFormalReview
        ? "Submeter preço, termos, responsáveis, capacidade, faturamento e aceite à deliberação formal."
        : canPublishScope
          ? "Concluir os critérios do serviço assistido antes de solicitar a revisão formal."
          : "Corrigir os controles do escopo e do brief antes de apresentá-lo externamente.",
  };
}

export function readinessGovernanceSprintStatusLabel(status: ReadinessGovernanceSprintStatus) {
  const labels: Record<ReadinessGovernanceSprintStatus, string> = {
    blocked: "Escopo bloqueado neste gate",
    scope_available: "Escopo disponível para demonstração",
    formal_review_required: "Pronto para revisão formal; venda ainda não autorizada",
    formally_authorized: "Autorização formal registrada para o serviço assistido",
  };

  return labels[status];
}
