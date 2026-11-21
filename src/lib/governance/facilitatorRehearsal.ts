export type FacilitatorRehearsalAcknowledgementKey =
  | "synthetic_only"
  | "no_external_audience"
  | "no_recording"
  | "no_approval_claim";

export type FacilitatorRehearsalAction = "safe_answer" | "stop_and_escalate";

export type FacilitatorRehearsalScenario = {
  key: string;
  label: string;
  prompt: string;
  competency: "claims" | "methodology" | "privacy" | "care" | "runtime";
  expectedAction: FacilitatorRehearsalAction;
  coaching: string;
};

export type FacilitatorRehearsalPolicy = {
  policyId: string;
  requiredAcknowledgements: readonly FacilitatorRehearsalAcknowledgementKey[];
  minimumScenarioCount: number;
  requireAudiencePackReadyForRehearsal: boolean;
  prohibitRealData: boolean;
  prohibitPersistence: boolean;
  prohibitRemoteTransport: boolean;
  prohibitExternalAudience: boolean;
  prohibitRecording: boolean;
};

export type FacilitatorRehearsalContext = {
  audiencePackReadyForRehearsal: boolean;
  syntheticMode: boolean;
  realDataEnabled: boolean;
  persistenceEnabled: boolean;
  remoteTransportEnabled: boolean;
  externalAudiencePresent: boolean;
  recordingEnabled: boolean;
  acknowledgements: Record<FacilitatorRehearsalAcknowledgementKey, boolean>;
};

export type FacilitatorRehearsalBlocker =
  | "audience_pack_not_ready"
  | "synthetic_mode_required"
  | "real_data_forbidden"
  | "persistence_forbidden"
  | "remote_transport_forbidden"
  | "external_audience_forbidden"
  | "recording_forbidden"
  | "scenario_catalog_incomplete"
  | `acknowledgement_required:${FacilitatorRehearsalAcknowledgementKey}`;

export type FacilitatorRehearsalScenarioResult = FacilitatorRehearsalScenario & {
  selectedAction: FacilitatorRehearsalAction | null;
  passed: boolean;
};

export type FacilitatorRehearsalSummary = {
  policyId: string;
  status: "blocked" | "ready_for_internal_rehearsal" | "in_progress" | "complete";
  canStartInternalRehearsal: boolean;
  canIssueLocalReceipt: boolean;
  canCountAsExternalApproval: false;
  canUseWithExternalAudience: false;
  blockers: FacilitatorRehearsalBlocker[];
  scenarios: FacilitatorRehearsalScenarioResult[];
  passed: number;
  attempted: number;
  total: number;
  completionPct: number;
  nextScenario: FacilitatorRehearsalScenarioResult | null;
};

export function evaluateFacilitatorRehearsal(
  scenarios: readonly FacilitatorRehearsalScenario[],
  selectedActions: Partial<Record<string, FacilitatorRehearsalAction>>,
  context: FacilitatorRehearsalContext,
  policy: FacilitatorRehearsalPolicy,
): FacilitatorRehearsalSummary {
  const blockers: FacilitatorRehearsalBlocker[] = [];
  const scenarioKeys = scenarios.map((scenario) => scenario.key);
  const scenarioCatalogValid = scenarios.every((scenario) =>
    scenario.key.trim() && scenario.label.trim() && scenario.prompt.trim() && scenario.coaching.trim(),
  ) && new Set(scenarioKeys).size === scenarioKeys.length;

  if (policy.requireAudiencePackReadyForRehearsal && !context.audiencePackReadyForRehearsal) {
    blockers.push("audience_pack_not_ready");
  }
  if (!context.syntheticMode) blockers.push("synthetic_mode_required");
  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_forbidden");
  if (policy.prohibitPersistence && context.persistenceEnabled) blockers.push("persistence_forbidden");
  if (policy.prohibitRemoteTransport && context.remoteTransportEnabled) blockers.push("remote_transport_forbidden");
  if (policy.prohibitExternalAudience && context.externalAudiencePresent) blockers.push("external_audience_forbidden");
  if (policy.prohibitRecording && context.recordingEnabled) blockers.push("recording_forbidden");
  if (scenarios.length < policy.minimumScenarioCount || !scenarioCatalogValid) {
    blockers.push("scenario_catalog_incomplete");
  }

  for (const key of policy.requiredAcknowledgements) {
    if (!context.acknowledgements[key]) blockers.push(`acknowledgement_required:${key}`);
  }

  const canStartInternalRehearsal = blockers.length === 0;
  const results = scenarios.map((scenario) => {
    const selectedAction = selectedActions[scenario.key] ?? null;
    return {
      ...scenario,
      selectedAction,
      passed: canStartInternalRehearsal && selectedAction === scenario.expectedAction,
    };
  });
  const passed = results.filter((result) => result.passed).length;
  const attempted = results.filter((result) => result.selectedAction !== null).length;
  const canIssueLocalReceipt = canStartInternalRehearsal && results.length > 0 && passed === results.length;

  return {
    policyId: policy.policyId,
    status: !canStartInternalRehearsal
      ? "blocked"
      : canIssueLocalReceipt
        ? "complete"
        : attempted > 0
          ? "in_progress"
          : "ready_for_internal_rehearsal",
    canStartInternalRehearsal,
    canIssueLocalReceipt,
    canCountAsExternalApproval: false,
    canUseWithExternalAudience: false,
    blockers: unique(blockers),
    scenarios: results,
    passed,
    attempted,
    total: results.length,
    completionPct: pct(passed, results.length),
    nextScenario: results.find((result) => !result.passed) ?? null,
  };
}

export type FacilitatorRehearsalReceiptInput = {
  receiptId: string;
  generatedAt: string;
  audiencePackId: string;
  audiencePackVersion: string;
  summary: FacilitatorRehearsalSummary;
  persisted: boolean;
  remoteTransportEnabled: boolean;
};

export type FacilitatorRehearsalReceipt = {
  receiptId: string;
  generatedAt: string;
  audiencePackId: string;
  audiencePackVersion: string;
  policyId: string;
  status: "internal_rehearsal_complete";
  passedScenarioCount: number;
  storageMode: "memory_only";
  canSupportExternalApproval: false;
  canNameFacilitator: false;
};

export function buildFacilitatorRehearsalReceipt(
  input: FacilitatorRehearsalReceiptInput,
): FacilitatorRehearsalReceipt {
  if (!input.receiptId.trim()) throw new Error("receipt_id_required");
  if (!input.generatedAt.trim()) throw new Error("generated_at_required");
  if (!input.audiencePackId.trim() || !input.audiencePackVersion.trim()) throw new Error("audience_pack_identity_required");
  if (!input.summary.canIssueLocalReceipt || input.summary.status !== "complete") throw new Error("rehearsal_incomplete");
  if (input.persisted) throw new Error("receipt_must_remain_memory_only");
  if (input.remoteTransportEnabled) throw new Error("remote_transport_forbidden");

  return {
    receiptId: input.receiptId.trim(),
    generatedAt: input.generatedAt,
    audiencePackId: input.audiencePackId,
    audiencePackVersion: input.audiencePackVersion,
    policyId: input.summary.policyId,
    status: "internal_rehearsal_complete",
    passedScenarioCount: input.summary.passed,
    storageMode: "memory_only",
    canSupportExternalApproval: false,
    canNameFacilitator: false,
  };
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
