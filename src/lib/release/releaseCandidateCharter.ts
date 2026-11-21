export type ReleaseCandidateRisk = "low" | "medium" | "high";
export type ReleaseCandidateWorkstreamStatus = "review_ready" | "needs_split" | "blocked";

export interface ReleaseCandidateInventory {
  totalFiles: number;
  trackedModified: number;
  untrackedFiles: number;
  docs: number;
  source: number;
  e2e: number;
  other: number;
  sensitive: number;
  unclassified: number;
}

export interface ReleaseCandidateWorkstream {
  key: string;
  label: string;
  outcome: string;
  status: ReleaseCandidateWorkstreamStatus;
  risk: ReleaseCandidateRisk;
  artifactRefs: readonly string[];
  hasTests: boolean;
  hasDocumentation: boolean;
  containsSensitiveScope: boolean;
  reviewNote: string;
}

export interface ReleaseCandidateCharterInput {
  charterId: string;
  version: string;
  observedAt: string;
  branchRef: string;
  currentReleaseRef: string | null;
  repository: {
    currentCheckout: string;
    priorHandoff: string | null;
    officialRepositoryConfirmed: boolean;
  };
  inventory: ReleaseCandidateInventory;
  workstreams: readonly ReleaseCandidateWorkstream[];
}

export interface ReleaseCandidateCharterPolicy {
  policyId: string;
  requiredWorkstreamKeys: readonly string[];
  requireTests: boolean;
  requireDocumentation: boolean;
  prohibitSensitiveScope: boolean;
  prohibitMerge: boolean;
  prohibitDeploy: boolean;
  prohibitGateAdvance: boolean;
  prohibitRealData: boolean;
}

export interface ReleaseCandidateCharterContext {
  commitAuthorized: boolean;
  pushAuthorized: boolean;
  pullRequestAuthorized: boolean;
  mergePerformed: boolean;
  deployPerformed: boolean;
  gateAdvanceClaimed: boolean;
  realDataEnabled: boolean;
}

export type ReleaseCandidateScopeBlocker =
  | "charter_identity_missing"
  | "inventory_mismatch"
  | "required_workstream_missing"
  | "duplicate_workstream"
  | "workstream_not_review_ready"
  | "workstream_tests_missing"
  | "workstream_documentation_missing"
  | "sensitive_scope_detected"
  | "unclassified_changes";

export type ReleaseCandidatePromotionBlocker =
  | "official_repository_unconfirmed"
  | "commit_authorization_missing"
  | "candidate_ref_missing"
  | "push_authorization_missing"
  | "pull_request_authorization_missing"
  | "merge_performed"
  | "deploy_performed"
  | "gate_advance_claimed"
  | "real_data_enabled";

export interface ReleaseCandidateCharterSummary {
  policyId: string;
  charterId: string;
  version: string;
  observedAt: string;
  branchRef: string;
  currentReleaseRef: string | null;
  status: "scope_ready_promotion_blocked" | "scope_blocked" | "candidate_authorized";
  canRequestScopeReview: boolean;
  canCreateCandidateCommit: boolean;
  canPushCandidate: boolean;
  canOpenPullRequest: boolean;
  canMerge: false;
  canDeploy: false;
  canAdvanceGate: false;
  canUseRealData: false;
  repository: ReleaseCandidateCharterInput["repository"];
  inventory: ReleaseCandidateInventory;
  workstreams: readonly ReleaseCandidateWorkstream[];
  readyWorkstreams: number;
  scopeBlockers: readonly ReleaseCandidateScopeBlocker[];
  promotionBlockers: readonly ReleaseCandidatePromotionBlocker[];
  nextPromotionBlocker: ReleaseCandidatePromotionBlocker | null;
}

export function evaluateReleaseCandidateCharter(
  charter: ReleaseCandidateCharterInput,
  context: ReleaseCandidateCharterContext,
  policy: ReleaseCandidateCharterPolicy,
): ReleaseCandidateCharterSummary {
  const scopeBlockers: ReleaseCandidateScopeBlocker[] = [];
  const promotionBlockers: ReleaseCandidatePromotionBlocker[] = [];
  const workstreamKeys = charter.workstreams.map((workstream) => workstream.key);
  const categorizedFiles = charter.inventory.docs + charter.inventory.source + charter.inventory.e2e + charter.inventory.other;

  if (!charter.charterId.trim() || !charter.version.trim() || !charter.observedAt.trim() || !charter.branchRef.trim()) {
    scopeBlockers.push("charter_identity_missing");
  }

  if (
    charter.inventory.totalFiles !== charter.inventory.trackedModified + charter.inventory.untrackedFiles ||
    charter.inventory.totalFiles !== categorizedFiles
  ) {
    scopeBlockers.push("inventory_mismatch");
  }

  for (const key of policy.requiredWorkstreamKeys) {
    const matches = workstreamKeys.filter((candidate) => candidate === key).length;
    if (matches === 0) scopeBlockers.push("required_workstream_missing");
    if (matches > 1) scopeBlockers.push("duplicate_workstream");
  }

  for (const workstream of charter.workstreams) {
    if (workstream.status !== "review_ready" || workstream.artifactRefs.length === 0) {
      scopeBlockers.push("workstream_not_review_ready");
    }
    if (policy.requireTests && !workstream.hasTests) scopeBlockers.push("workstream_tests_missing");
    if (policy.requireDocumentation && !workstream.hasDocumentation) {
      scopeBlockers.push("workstream_documentation_missing");
    }
    if (policy.prohibitSensitiveScope && workstream.containsSensitiveScope) {
      scopeBlockers.push("sensitive_scope_detected");
    }
  }

  if (policy.prohibitSensitiveScope && charter.inventory.sensitive > 0) {
    scopeBlockers.push("sensitive_scope_detected");
  }
  if (charter.inventory.unclassified > 0) scopeBlockers.push("unclassified_changes");

  if (!charter.repository.officialRepositoryConfirmed) promotionBlockers.push("official_repository_unconfirmed");
  if (!context.commitAuthorized) promotionBlockers.push("commit_authorization_missing");
  if (!charter.currentReleaseRef?.trim()) promotionBlockers.push("candidate_ref_missing");
  if (charter.currentReleaseRef?.trim() && !context.pushAuthorized) promotionBlockers.push("push_authorization_missing");
  if (charter.currentReleaseRef?.trim() && !context.pullRequestAuthorized) {
    promotionBlockers.push("pull_request_authorization_missing");
  }
  if (policy.prohibitMerge && context.mergePerformed) promotionBlockers.push("merge_performed");
  if (policy.prohibitDeploy && context.deployPerformed) promotionBlockers.push("deploy_performed");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) promotionBlockers.push("gate_advance_claimed");
  if (policy.prohibitRealData && context.realDataEnabled) promotionBlockers.push("real_data_enabled");

  const uniqueScopeBlockers = unique(scopeBlockers);
  const uniquePromotionBlockers = unique(promotionBlockers);
  const canRequestScopeReview = uniqueScopeBlockers.length === 0;
  const prohibitedActionClaimed = uniquePromotionBlockers.some((blocker) =>
    ["merge_performed", "deploy_performed", "gate_advance_claimed", "real_data_enabled"].includes(blocker),
  );
  const canCreateCandidateCommit =
    canRequestScopeReview &&
    charter.repository.officialRepositoryConfirmed &&
    context.commitAuthorized &&
    !prohibitedActionClaimed;
  const canPushCandidate =
    canCreateCandidateCommit && Boolean(charter.currentReleaseRef?.trim()) && context.pushAuthorized;
  const canOpenPullRequest = canPushCandidate && context.pullRequestAuthorized;
  const status = !canRequestScopeReview
    ? "scope_blocked"
    : canOpenPullRequest
      ? "candidate_authorized"
      : "scope_ready_promotion_blocked";

  return {
    policyId: policy.policyId,
    charterId: charter.charterId,
    version: charter.version,
    observedAt: charter.observedAt,
    branchRef: charter.branchRef,
    currentReleaseRef: charter.currentReleaseRef,
    status,
    canRequestScopeReview,
    canCreateCandidateCommit,
    canPushCandidate,
    canOpenPullRequest,
    canMerge: false,
    canDeploy: false,
    canAdvanceGate: false,
    canUseRealData: false,
    repository: charter.repository,
    inventory: charter.inventory,
    workstreams: charter.workstreams,
    readyWorkstreams: charter.workstreams.filter((workstream) => workstream.status === "review_ready").length,
    scopeBlockers: uniqueScopeBlockers,
    promotionBlockers: uniquePromotionBlockers,
    nextPromotionBlocker: uniquePromotionBlockers[0] ?? null,
  };
}

export function releaseCandidatePromotionBlockerLabel(blocker: ReleaseCandidatePromotionBlocker) {
  const labels: Record<ReleaseCandidatePromotionBlocker, string> = {
    official_repository_unconfirmed: "Reconciliar e confirmar o repositório oficial.",
    commit_authorization_missing: "Obter autorização explícita para criar o commit candidato.",
    candidate_ref_missing: "Criar e registrar o SHA único do candidato.",
    push_authorization_missing: "Obter autorização explícita antes do push.",
    pull_request_authorization_missing: "Obter autorização explícita antes de abrir o PR.",
    merge_performed: "Remover qualquer alegação de merge desta etapa.",
    deploy_performed: "Remover qualquer alegação de deploy desta etapa.",
    gate_advance_claimed: "Manter o gate G1 sem avanço.",
    real_data_enabled: "Manter dados reais bloqueados.",
  };
  return labels[blocker];
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values));
}
