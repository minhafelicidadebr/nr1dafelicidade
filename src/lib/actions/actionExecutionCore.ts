/**
 * Pure execution-core contract for the NR-1 MVP.
 *
 * This module deliberately has no Supabase, React, storage or domain catalog
 * dependency. Persistence and authorization must call this mechanism from a
 * server-side command boundary in a later slice.
 */

export const ACTION_STATES = [
  "draft",
  "planned",
  "approved",
  "in_progress",
  "under_review",
  "verified",
  "corrective_required",
  "cancelled",
] as const;

export type ActionState = (typeof ACTION_STATES)[number];
export type ActionInterventionType = "introduce" | "improve" | "maintain";
export type ActionPriority = "low" | "medium" | "high" | "critical";
export type EffectivenessOutcome = "effective" | "partially_effective" | "ineffective";

export type ActionOrigin = {
  kind: string;
  id: string;
  label?: string | null;
};

export type ActionExecutionSnapshot = {
  id: string;
  state: ActionState;
  version: number;
  origin: ActionOrigin | null;
  interventionType: ActionInterventionType | null;
  priority: ActionPriority;
  ownerId: string | null;
  dueDate: string | null;
  monitoringMethod: string | null;
  expectedOutcome: string | null;
  evidenceCount: number;
  measurementCount: number;
};

export type ActionReviewInput = {
  reviewerId: string;
  outcome: EffectivenessOutcome;
  rationale: string;
};

export type AdvanceActionInput = {
  target: ActionState;
  actorId: string;
  expectedVersion: number;
  occurredAt: string;
  reason?: string | null;
  review?: ActionReviewInput | null;
};

export type ActionTransitionBlocker =
  | "missing_action_id"
  | "missing_actor"
  | "stale_version"
  | "invalid_transition"
  | "missing_origin"
  | "missing_intervention_type"
  | "missing_owner"
  | "missing_due_date"
  | "missing_monitoring_method"
  | "missing_expected_outcome"
  | "missing_evidence"
  | "missing_measurement"
  | "missing_review"
  | "reviewer_is_owner"
  | "invalid_review_outcome"
  | "missing_cancel_reason";

export type ActionExecutionEvent = {
  actionId: string;
  from: ActionState;
  to: ActionState;
  actorId: string;
  version: number;
  occurredAt: string;
  reason: string | null;
  reviewOutcome: EffectivenessOutcome | null;
};

export type ActionTransitionFailure = {
  ok: false;
  blockers: ActionTransitionBlocker[];
};

export type ActionTransitionSuccess = {
  ok: true;
  action: ActionExecutionSnapshot;
  event: ActionExecutionEvent;
};

export type ActionTransitionResult = ActionTransitionFailure | ActionTransitionSuccess;

const ALLOWED_TRANSITIONS: Record<ActionState, readonly ActionState[]> = {
  draft: ["planned"],
  planned: ["approved", "cancelled"],
  approved: ["in_progress", "cancelled"],
  in_progress: ["under_review"],
  under_review: ["verified", "corrective_required"],
  verified: [],
  corrective_required: [],
  cancelled: [],
};

export function createActionExecutionSnapshot(
  input: Omit<ActionExecutionSnapshot, "state" | "version"> &
    Partial<Pick<ActionExecutionSnapshot, "state" | "version">>,
): ActionExecutionSnapshot {
  return {
    ...input,
    state: input.state ?? "draft",
    version: input.version ?? 1,
  };
}

export function allowedActionTransitions(state: ActionState): readonly ActionState[] {
  return ALLOWED_TRANSITIONS[state];
}

export function advanceAction(
  action: ActionExecutionSnapshot,
  input: AdvanceActionInput,
): ActionTransitionResult {
  const blockers = collectBlockers(action, input);
  if (blockers.length > 0) return { ok: false, blockers };

  const nextVersion = action.version + 1;
  const nextAction: ActionExecutionSnapshot = {
    ...action,
    state: input.target,
    version: nextVersion,
  };

  return {
    ok: true,
    action: nextAction,
    event: {
      actionId: action.id,
      from: action.state,
      to: input.target,
      actorId: input.actorId.trim(),
      version: nextVersion,
      occurredAt: input.occurredAt,
      reason: input.reason?.trim() || null,
      reviewOutcome: input.review?.outcome ?? null,
    },
  };
}

function collectBlockers(action: ActionExecutionSnapshot, input: AdvanceActionInput): ActionTransitionBlocker[] {
  const blockers: ActionTransitionBlocker[] = [];

  if (!action.id.trim()) blockers.push("missing_action_id");
  if (!input.actorId.trim()) blockers.push("missing_actor");
  if (input.expectedVersion !== action.version) blockers.push("stale_version");
  if (!ALLOWED_TRANSITIONS[action.state].includes(input.target)) blockers.push("invalid_transition");

  if (input.target === "planned" || input.target === "approved") {
    if (!action.origin?.id.trim()) blockers.push("missing_origin");
    if (!action.interventionType) blockers.push("missing_intervention_type");
    if (!action.ownerId?.trim()) blockers.push("missing_owner");
    if (!action.dueDate?.trim()) blockers.push("missing_due_date");
    if (!action.monitoringMethod?.trim()) blockers.push("missing_monitoring_method");
    if (!action.expectedOutcome?.trim()) blockers.push("missing_expected_outcome");
  }

  if (input.target === "under_review") {
    if (action.evidenceCount < 1) blockers.push("missing_evidence");
    if (action.measurementCount < 1) blockers.push("missing_measurement");
  }

  if (input.target === "verified" || input.target === "corrective_required") {
    const review = input.review;
    if (!review?.reviewerId.trim() || !review.rationale.trim()) blockers.push("missing_review");
    if (review && isHighPriority(action.priority) && review.reviewerId.trim() === action.ownerId?.trim()) {
      blockers.push("reviewer_is_owner");
    }
    if (input.target === "verified" && review?.outcome !== "effective") {
      blockers.push("invalid_review_outcome");
    }
    if (input.target === "corrective_required" && !isCorrectiveOutcome(review?.outcome)) {
      blockers.push("invalid_review_outcome");
    }
  }

  if (input.target === "cancelled" && !input.reason?.trim()) blockers.push("missing_cancel_reason");

  return blockers;
}

function isHighPriority(priority: ActionPriority) {
  return priority === "high" || priority === "critical";
}

function isCorrectiveOutcome(outcome: EffectivenessOutcome | undefined) {
  return outcome === "partially_effective" || outcome === "ineffective";
}
