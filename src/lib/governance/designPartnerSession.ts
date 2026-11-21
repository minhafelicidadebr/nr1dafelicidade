export type SessionAcknowledgementKey =
  | "synthetic_only"
  | "no_technical_decision"
  | "memory_only";

export type SessionHandoffConfirmationKey =
  | "limits_explained"
  | "receipt_viewed"
  | "feedback_tested"
  | "discard_explained";

export type DesignPartnerSessionPolicy = {
  policyId: string;
  minimumScenarioCount: number;
  acknowledgementKeys: readonly SessionAcknowledgementKey[];
  handoffConfirmationKeys: readonly SessionHandoffConfirmationKey[];
};

export type DesignPartnerSessionContext = {
  dataMode: "synthetic" | "real";
  instrumentRuntimeReady: boolean;
  remoteTransportEnabled: boolean;
  scenarioCount: number;
  runbookAvailable: boolean;
  acknowledgements: Record<SessionAcknowledgementKey, boolean>;
};

export type DesignPartnerSessionBlocker =
  | "synthetic_mode_required"
  | "instrument_runtime_must_remain_blocked"
  | "remote_transport_forbidden"
  | "synthetic_scenario_required"
  | "runbook_required"
  | `acknowledgement_required:${SessionAcknowledgementKey}`;

export type DesignPartnerSessionEvaluation = {
  policyId: string;
  status: "blocked" | "ready_for_local_guided_session";
  blockers: DesignPartnerSessionBlocker[];
  canRunLocalGuidedSession: boolean;
  canRunExternalUnattendedSession: false;
};

export function evaluateDesignPartnerSession(
  context: DesignPartnerSessionContext,
  policy: DesignPartnerSessionPolicy,
): DesignPartnerSessionEvaluation {
  const blockers: DesignPartnerSessionBlocker[] = [];

  if (context.dataMode !== "synthetic") blockers.push("synthetic_mode_required");
  if (context.instrumentRuntimeReady) blockers.push("instrument_runtime_must_remain_blocked");
  if (context.remoteTransportEnabled) blockers.push("remote_transport_forbidden");
  if (context.scenarioCount < policy.minimumScenarioCount) blockers.push("synthetic_scenario_required");
  if (!context.runbookAvailable) blockers.push("runbook_required");

  for (const key of policy.acknowledgementKeys) {
    if (!context.acknowledgements[key]) blockers.push(`acknowledgement_required:${key}`);
  }

  const canRunLocalGuidedSession = blockers.length === 0;

  return {
    policyId: policy.policyId,
    status: canRunLocalGuidedSession ? "ready_for_local_guided_session" : "blocked",
    blockers,
    canRunLocalGuidedSession,
    canRunExternalUnattendedSession: false,
  };
}

export type DesignPartnerHandoffContext = {
  receiptId: string;
  syntheticMode: boolean;
  persisted: boolean;
  remoteTransportEnabled: boolean;
  confirmations: Record<SessionHandoffConfirmationKey, boolean>;
};

export type DesignPartnerHandoffBlocker =
  | "receipt_required"
  | "synthetic_mode_required"
  | "persistence_forbidden"
  | "remote_transport_forbidden"
  | `confirmation_required:${SessionHandoffConfirmationKey}`;

export type DesignPartnerHandoffEvaluation = {
  policyId: string;
  status: "incomplete" | "ready_to_close_locally";
  blockers: DesignPartnerHandoffBlocker[];
  canCloseLocally: boolean;
  canShareExternally: false;
};

export function evaluateDesignPartnerHandoff(
  context: DesignPartnerHandoffContext,
  policy: DesignPartnerSessionPolicy,
): DesignPartnerHandoffEvaluation {
  const blockers: DesignPartnerHandoffBlocker[] = [];

  if (!context.receiptId.trim()) blockers.push("receipt_required");
  if (!context.syntheticMode) blockers.push("synthetic_mode_required");
  if (context.persisted) blockers.push("persistence_forbidden");
  if (context.remoteTransportEnabled) blockers.push("remote_transport_forbidden");

  for (const key of policy.handoffConfirmationKeys) {
    if (!context.confirmations[key]) blockers.push(`confirmation_required:${key}`);
  }

  const canCloseLocally = blockers.length === 0;

  return {
    policyId: policy.policyId,
    status: canCloseLocally ? "ready_to_close_locally" : "incomplete",
    blockers,
    canCloseLocally,
    canShareExternally: false,
  };
}
