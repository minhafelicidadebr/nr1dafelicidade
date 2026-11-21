export type ReleaseReviewStageStatus = "planned" | "in_review" | "changes_requested" | "accepted";

export interface ReleaseReviewStageInput {
  key: string;
  label: string;
  workstreamKey: string;
  sequence: number;
  dependencies: readonly string[];
  reviewerRoles: readonly string[];
  exitCriteria: readonly string[];
  validationCommands: readonly string[];
  status: ReleaseReviewStageStatus;
}

export interface ReleaseReviewPlanInput {
  planId: string;
  version: string;
  observedAt: string;
  stages: readonly ReleaseReviewStageInput[];
}

export interface ReleaseReviewPlanPolicy {
  policyId: string;
  requiredWorkstreamKeys: readonly string[];
  requireReviewerRoles: boolean;
  requireExitCriteria: boolean;
  requireValidationCommands: boolean;
  prohibitCommit: boolean;
  prohibitPullRequest: boolean;
  prohibitMerge: boolean;
  prohibitDeploy: boolean;
  prohibitGateAdvance: boolean;
  prohibitRealData: boolean;
}

export interface ReleaseReviewPlanContext {
  reviewAuthorized: boolean;
  reviewStarted: boolean;
  commitCreated: boolean;
  pullRequestOpened: boolean;
  mergePerformed: boolean;
  deployPerformed: boolean;
  gateAdvanceClaimed: boolean;
  realDataEnabled: boolean;
}

export type ReleaseReviewPlanBlocker =
  | "plan_identity_missing"
  | "required_workstream_missing"
  | "unknown_workstream"
  | "duplicate_stage"
  | "duplicate_workstream"
  | "duplicate_sequence"
  | "dependency_missing"
  | "dependency_cycle"
  | "dependency_order_invalid"
  | "reviewer_role_missing"
  | "exit_criteria_missing"
  | "validation_command_missing";

export type ReleaseReviewExecutionBlocker =
  | "review_authorization_missing"
  | "review_started_without_authorization"
  | "commit_created"
  | "pull_request_opened"
  | "merge_performed"
  | "deploy_performed"
  | "gate_advance_claimed"
  | "real_data_enabled";

export interface ReleaseReviewPlanSummary {
  policyId: string;
  planId: string;
  version: string;
  observedAt: string;
  status: "plan_blocked" | "plan_ready_execution_blocked" | "review_authorized";
  planReady: boolean;
  canRequestReviewAuthorization: boolean;
  canStartReview: boolean;
  canCreateCommit: false;
  canOpenPullRequest: false;
  canMerge: false;
  canDeploy: false;
  canAdvanceGate: false;
  canUseRealData: false;
  orderedStages: readonly ReleaseReviewStageInput[];
  nextStage: ReleaseReviewStageInput | null;
  planBlockers: readonly ReleaseReviewPlanBlocker[];
  executionBlockers: readonly ReleaseReviewExecutionBlocker[];
}

export function evaluateReleaseReviewPlan(
  plan: ReleaseReviewPlanInput,
  context: ReleaseReviewPlanContext,
  policy: ReleaseReviewPlanPolicy,
): ReleaseReviewPlanSummary {
  const planBlockers: ReleaseReviewPlanBlocker[] = [];
  const executionBlockers: ReleaseReviewExecutionBlocker[] = [];
  const stageKeys = plan.stages.map((stage) => stage.key);
  const workstreamKeys = plan.stages.map((stage) => stage.workstreamKey);
  const sequences = plan.stages.map((stage) => stage.sequence);
  const stagesByKey = new Map(plan.stages.map((stage) => [stage.key, stage]));

  if (!plan.planId.trim() || !plan.version.trim() || !plan.observedAt.trim()) {
    planBlockers.push("plan_identity_missing");
  }

  for (const workstreamKey of policy.requiredWorkstreamKeys) {
    const matches = workstreamKeys.filter((candidate) => candidate === workstreamKey).length;
    if (matches === 0) planBlockers.push("required_workstream_missing");
    if (matches > 1) planBlockers.push("duplicate_workstream");
  }

  if (workstreamKeys.some((key) => !policy.requiredWorkstreamKeys.includes(key))) {
    planBlockers.push("unknown_workstream");
  }
  if (new Set(stageKeys).size !== stageKeys.length) planBlockers.push("duplicate_stage");
  if (new Set(sequences).size !== sequences.length) planBlockers.push("duplicate_sequence");

  for (const stage of plan.stages) {
    if (policy.requireReviewerRoles && !hasContent(stage.reviewerRoles)) planBlockers.push("reviewer_role_missing");
    if (policy.requireExitCriteria && !hasContent(stage.exitCriteria)) planBlockers.push("exit_criteria_missing");
    if (policy.requireValidationCommands && !hasContent(stage.validationCommands)) {
      planBlockers.push("validation_command_missing");
    }

    for (const dependency of stage.dependencies) {
      const dependencyStage = stagesByKey.get(dependency);
      if (!dependencyStage) {
        planBlockers.push("dependency_missing");
      } else if (dependencyStage.sequence >= stage.sequence) {
        planBlockers.push("dependency_order_invalid");
      }
    }
  }

  if (containsDependencyCycle(plan.stages)) planBlockers.push("dependency_cycle");

  if (!context.reviewAuthorized) executionBlockers.push("review_authorization_missing");
  if (context.reviewStarted && !context.reviewAuthorized) executionBlockers.push("review_started_without_authorization");
  if (policy.prohibitCommit && context.commitCreated) executionBlockers.push("commit_created");
  if (policy.prohibitPullRequest && context.pullRequestOpened) executionBlockers.push("pull_request_opened");
  if (policy.prohibitMerge && context.mergePerformed) executionBlockers.push("merge_performed");
  if (policy.prohibitDeploy && context.deployPerformed) executionBlockers.push("deploy_performed");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) executionBlockers.push("gate_advance_claimed");
  if (policy.prohibitRealData && context.realDataEnabled) executionBlockers.push("real_data_enabled");

  const uniquePlanBlockers = unique(planBlockers);
  const uniqueExecutionBlockers = unique(executionBlockers);
  const planReady = uniquePlanBlockers.length === 0;
  const prohibitedExecutionClaimed = uniqueExecutionBlockers.some((blocker) => blocker !== "review_authorization_missing");
  const canStartReview = planReady && context.reviewAuthorized && !prohibitedExecutionClaimed;
  const orderedStages = [...plan.stages].sort((left, right) => left.sequence - right.sequence);

  return {
    policyId: policy.policyId,
    planId: plan.planId,
    version: plan.version,
    observedAt: plan.observedAt,
    status: !planReady ? "plan_blocked" : canStartReview ? "review_authorized" : "plan_ready_execution_blocked",
    planReady,
    canRequestReviewAuthorization: planReady,
    canStartReview,
    canCreateCommit: false,
    canOpenPullRequest: false,
    canMerge: false,
    canDeploy: false,
    canAdvanceGate: false,
    canUseRealData: false,
    orderedStages,
    nextStage: orderedStages.find((stage) => stage.status !== "accepted") ?? null,
    planBlockers: uniquePlanBlockers,
    executionBlockers: uniqueExecutionBlockers,
  };
}

function containsDependencyCycle(stages: readonly ReleaseReviewStageInput[]) {
  const stagesByKey = new Map(stages.map((stage) => [stage.key, stage]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (stageKey: string): boolean => {
    if (visiting.has(stageKey)) return true;
    if (visited.has(stageKey)) return false;

    const stage = stagesByKey.get(stageKey);
    if (!stage) return false;

    visiting.add(stageKey);
    for (const dependency of stage.dependencies) {
      if (visit(dependency)) return true;
    }
    visiting.delete(stageKey);
    visited.add(stageKey);
    return false;
  };

  return stages.some((stage) => visit(stage.key));
}

function hasContent(values: readonly string[]) {
  return values.length > 0 && values.every((value) => value.trim().length > 0);
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values));
}
