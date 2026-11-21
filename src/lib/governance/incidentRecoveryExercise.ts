export const INCIDENT_RECOVERY_PHASES = [
  "detect",
  "contain",
  "investigate",
  "recover",
  "close",
] as const;

export type IncidentRecoveryPhase = (typeof INCIDENT_RECOVERY_PHASES)[number];

export type IncidentRecoveryExercisePolicy = {
  policyId: string;
  requiredPhases: IncidentRecoveryPhase[];
  prohibitRealData: true;
  prohibitPersistence: true;
  prohibitRemoteTransport: true;
};

export type IncidentRecoveryExerciseStep = {
  phase: IncidentRecoveryPhase;
  label: string;
  objective: string;
  expectedEvidence: string;
};

export type IncidentRecoveryExerciseScenario = {
  scenarioId: string;
  version: string;
  title: string;
  syntheticTrigger: string;
  recoveryTarget: string;
  steps: IncidentRecoveryExerciseStep[];
};

export type IncidentRecoveryExerciseContext = {
  syntheticMode: boolean;
  realDataEnabled: boolean;
  persistenceEnabled: boolean;
  remoteTransportEnabled: boolean;
  approvedRunbookAvailable: boolean;
};

export type IncidentRecoveryPhaseRecord = {
  phase: IncidentRecoveryPhase;
  completedAt: string;
};

export type IncidentRecoveryExerciseBlocker =
  | "synthetic_mode_required"
  | "real_data_forbidden"
  | "persistence_forbidden"
  | "remote_transport_forbidden"
  | "scenario_identity_missing"
  | "phase_contract_invalid"
  | "phase_record_invalid"
  | "phase_order_invalid";

export type IncidentRecoveryExerciseSummary = {
  policyId: string;
  scenarioId: string;
  status: "blocked" | "ready_for_local_rehearsal" | "in_progress" | "local_rehearsal_complete";
  completed: number;
  total: number;
  nextStep: IncidentRecoveryExerciseStep | null;
  blockers: IncidentRecoveryExerciseBlocker[];
  formalBlockers: string[];
  canStartLocalRehearsal: boolean;
  canIssueLocalReceipt: boolean;
  canCountAsFormalExercise: false;
  canApproveRunbook: false;
  canEnableRealData: false;
};

export function evaluateIncidentRecoveryExercise(
  scenario: IncidentRecoveryExerciseScenario,
  records: IncidentRecoveryPhaseRecord[],
  context: IncidentRecoveryExerciseContext,
  policy: IncidentRecoveryExercisePolicy,
): IncidentRecoveryExerciseSummary {
  const blockers = new Set<IncidentRecoveryExerciseBlocker>();

  if (!context.syntheticMode) blockers.add("synthetic_mode_required");
  if (context.realDataEnabled) blockers.add("real_data_forbidden");
  if (context.persistenceEnabled) blockers.add("persistence_forbidden");
  if (context.remoteTransportEnabled) blockers.add("remote_transport_forbidden");
  if (!scenario.scenarioId.trim() || !scenario.version.trim() || !scenario.title.trim()) {
    blockers.add("scenario_identity_missing");
  }

  const required = policy.requiredPhases;
  const requiredSet = new Set(required);
  const stepPhases = scenario.steps.map((step) => step.phase);
  const uniqueStepPhases = new Set(stepPhases);
  const completeStepContent = scenario.steps.every(
    (step) => step.label.trim() && step.objective.trim() && step.expectedEvidence.trim(),
  );

  if (
    required.length === 0
    || new Set(required).size !== required.length
    || stepPhases.length !== required.length
    || uniqueStepPhases.size !== required.length
    || stepPhases.some((phase, index) => phase !== required[index])
    || !completeStepContent
  ) {
    blockers.add("phase_contract_invalid");
  }

  const seen = new Set<IncidentRecoveryPhase>();
  let previousTime = Number.NEGATIVE_INFINITY;
  records.forEach((record, index) => {
    const timestamp = Date.parse(record.completedAt);
    if (!requiredSet.has(record.phase) || seen.has(record.phase) || !Number.isFinite(timestamp)) {
      blockers.add("phase_record_invalid");
    }
    if (record.phase !== required[index] || timestamp < previousTime) {
      blockers.add("phase_order_invalid");
    }
    seen.add(record.phase);
    previousTime = timestamp;
  });

  const structuralBlockers = [...blockers];
  const canStartLocalRehearsal = structuralBlockers.length === 0;
  const completed = Math.min(records.length, required.length);
  const canIssueLocalReceipt = canStartLocalRehearsal && completed === required.length;
  const nextPhase = canStartLocalRehearsal ? required[completed] : undefined;
  const formalBlockers = [
    ...(!context.approvedRunbookAvailable ? ["approved_runbook_required"] : []),
    "accountable_and_independent_review_required",
    "persistent_audit_evidence_required",
  ];

  return {
    policyId: policy.policyId,
    scenarioId: scenario.scenarioId,
    status: structuralBlockers.length > 0
      ? "blocked"
      : canIssueLocalReceipt
        ? "local_rehearsal_complete"
        : completed > 0
          ? "in_progress"
          : "ready_for_local_rehearsal",
    completed,
    total: required.length,
    nextStep: nextPhase ? scenario.steps.find((step) => step.phase === nextPhase) ?? null : null,
    blockers: structuralBlockers,
    formalBlockers,
    canStartLocalRehearsal,
    canIssueLocalReceipt,
    canCountAsFormalExercise: false,
    canApproveRunbook: false,
    canEnableRealData: false,
  };
}

export function incidentRecoveryExerciseBlockerLabel(blocker: IncidentRecoveryExerciseBlocker) {
  const labels: Record<IncidentRecoveryExerciseBlocker, string> = {
    synthetic_mode_required: "O ensaio exige modo exclusivamente sintético.",
    real_data_forbidden: "Dados reais são proibidos neste ensaio.",
    persistence_forbidden: "O ensaio deve permanecer somente em memória.",
    remote_transport_forbidden: "Transporte remoto é proibido nesta etapa.",
    scenario_identity_missing: "O cenário precisa de identidade e versão verificáveis.",
    phase_contract_invalid: "As cinco fases obrigatórias estão ausentes, duplicadas ou fora de ordem.",
    phase_record_invalid: "O registro local contém fase duplicada, desconhecida ou data inválida.",
    phase_order_invalid: "As fases precisam ser registradas em ordem monotônica.",
  };
  return labels[blocker];
}
