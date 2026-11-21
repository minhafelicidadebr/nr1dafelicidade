import {
  advanceAction,
  type ActionExecutionEvent,
  type ActionExecutionSnapshot,
  type ActionReviewInput,
  type ActionState,
  type EffectivenessOutcome,
} from "./actionExecutionCore";

/**
 * Synthetic server-command boundary for action execution.
 *
 * The request intentionally has no organization, actor or reviewer identity.
 * A future RPC/service must resolve those values from auth and the persisted
 * action, then call this mechanism inside one transaction.
 */
export const ACTION_COMMAND_ROLES = ["admin", "sst", "gestor", "colaborador"] as const;
export type ActionCommandRole = (typeof ACTION_COMMAND_ROLES)[number];

export type ActionCommandMembership = {
  organizationId: string;
  role: ActionCommandRole;
};

export type ActionCommandActorContext = {
  userId: string;
  memberships: readonly ActionCommandMembership[];
};

export type PersistedActionRecord = ActionExecutionSnapshot & {
  organizationId: string;
};

export type ActionCommandRequest = {
  commandId: string;
  actionId: string;
  target: ActionState;
  expectedVersion: number;
  occurredAt: string;
  reason?: string | null;
  review?: Omit<ActionReviewInput, "reviewerId"> | null;
};

export type ActionCommandReceipt = {
  commandId: string;
  actionId: string;
  organizationId: string;
  actorId: string;
  action: ActionExecutionSnapshot;
  event: ActionExecutionEvent;
};

export type ActionCommandState = {
  actions: Readonly<Record<string, PersistedActionRecord>>;
  receipts: Readonly<Record<string, ActionCommandReceipt>>;
};

export type ActionCommandBlocker =
  | "missing_command_id"
  | "missing_action_id"
  | "missing_actor"
  | "missing_occurred_at"
  | "action_not_found"
  | "invalid_action_tenant"
  | "forbidden"
  | "role_not_authorized"
  | "command_id_conflict"
  | "stale_version"
  | "invalid_transition"
  | "domain_blocked";

export type ActionCommandFailure = {
  ok: false;
  blockers: ActionCommandBlocker[];
};

export type ActionCommandSuccess = {
  ok: true;
  action: ActionExecutionSnapshot;
  event: ActionExecutionEvent;
  receipt: ActionCommandReceipt;
  replayed: boolean;
};

export type ActionCommandResult = ActionCommandFailure | ActionCommandSuccess;

/** In-memory adapter result; `nextState` is never part of the command response. */
export type ActionCommandExecution = {
  result: ActionCommandResult;
  nextState: ActionCommandState;
};

const COMMAND_ROLES = new Set<ActionCommandRole>(["admin", "sst", "gestor"]);

export function createActionCommandState(actions: readonly PersistedActionRecord[] = []): ActionCommandState {
  return {
    actions: Object.fromEntries(actions.map((action) => [action.id, action])),
    receipts: {},
  };
}

export function executeActionCommand(
  state: ActionCommandState,
  actorContext: ActionCommandActorContext,
  request: ActionCommandRequest,
): ActionCommandResult {
  return executeActionCommandInMemory(state, actorContext, request).result;
}

/**
 * Deterministic adapter for local tests and a future transaction wrapper.
 * A real RPC must return only `result`, never `nextState`.
 */
export function executeActionCommandInMemory(
  state: ActionCommandState,
  actorContext: ActionCommandActorContext,
  request: ActionCommandRequest,
): ActionCommandExecution {
  const commandId = request.commandId.trim();
  const actionId = request.actionId.trim();
  const actorId = actorContext.userId.trim();

  const inputBlockers: ActionCommandBlocker[] = [];
  if (!commandId) inputBlockers.push("missing_command_id");
  if (!actionId) inputBlockers.push("missing_action_id");
  if (!actorId) inputBlockers.push("missing_actor");
  if (!request.occurredAt.trim()) inputBlockers.push("missing_occurred_at");
  if (inputBlockers.length > 0) return failure(state, inputBlockers);

  const action = state.actions[actionId];
  if (!action) return failure(state, ["action_not_found"]);
  if (!action.organizationId.trim()) return failure(state, ["invalid_action_tenant"]);

  const hasTenantMembership = actorContext.memberships.some(
    (candidate) => candidate.organizationId.trim() === action.organizationId.trim(),
  );
  if (!hasTenantMembership) return failure(state, ["forbidden"]);

  const hasAuthorizedMembership = actorContext.memberships.some(
    (candidate) =>
      candidate.organizationId.trim() === action.organizationId.trim()
      && COMMAND_ROLES.has(candidate.role),
  );
  if (!hasAuthorizedMembership) return failure(state, ["role_not_authorized"]);

  const previousReceipt = state.receipts[commandId];
  if (previousReceipt) {
    if (previousReceipt.actionId !== actionId || previousReceipt.actorId !== actorId) {
      return failure(state, ["command_id_conflict"]);
    }

    return {
      result: {
        ok: true,
        action: previousReceipt.action,
        event: previousReceipt.event,
        receipt: previousReceipt,
        replayed: true,
      },
      nextState: state,
    };
  }

  const review = request.review
    ? {
        ...request.review,
        reviewerId: actorId,
      }
    : null;

  const domainResult = advanceAction(action, {
    target: request.target,
    actorId,
    expectedVersion: request.expectedVersion,
    occurredAt: request.occurredAt.trim(),
    reason: request.reason,
    review,
  });

  if (domainResult.ok === false) {
    return failure(state, mapDomainBlockers(domainResult.blockers));
  }

  const receipt: ActionCommandReceipt = {
    commandId,
    actionId,
    organizationId: action.organizationId,
    actorId,
    action: domainResult.action,
    event: domainResult.event,
  };

  const nextState: ActionCommandState = {
    actions: {
      ...state.actions,
      [actionId]: {
        ...action,
        ...domainResult.action,
      },
    },
    receipts: {
      ...state.receipts,
      [commandId]: receipt,
    },
  };

  return {
    result: {
      ok: true,
      action: domainResult.action,
      event: domainResult.event,
      receipt,
      replayed: false,
    },
    nextState,
  };
}

function failure(state: ActionCommandState, blockers: ActionCommandBlocker[]): ActionCommandExecution {
  return { result: { ok: false, blockers }, nextState: state };
}

function mapDomainBlockers(blockers: string[]): ActionCommandBlocker[] {
  const commandBlockers = blockers.filter((blocker): blocker is ActionCommandBlocker =>
    blocker === "stale_version" || blocker === "invalid_transition",
  );

  return commandBlockers.length > 0 ? commandBlockers : ["domain_blocked"];
}

export function isActionCommandRole(role: ActionCommandRole): boolean {
  return COMMAND_ROLES.has(role);
}

export type ActionCommandReviewOutcome = EffectivenessOutcome;
