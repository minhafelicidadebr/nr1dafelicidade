export type SyntheticDemoReceiptInput = {
  receiptId: string;
  generatedAt: string;
  runtimePolicyVersion: string;
  instrumentKey: string;
  instrumentVersion: string;
  scenarioId: string;
  scenarioLabel: string;
  completedItemCount: number;
  expectedItemCount: number;
  computedDimensionCount: number;
  prioritizedDriverCount: number;
  syntheticMode: boolean;
  instrumentRuntimeReady: boolean;
  remoteTransportEnabled: boolean;
  persisted: boolean;
};

export type SyntheticDemoReceipt = {
  receiptId: string;
  generatedAt: string;
  status: "synthetic_demo_complete";
  runtimePolicyVersion: string;
  instrumentRef: string;
  scenarioId: string;
  scenarioLabel: string;
  completedItemCount: number;
  computedDimensionCount: number;
  prioritizedDriverCount: number;
  storageMode: "memory_only";
  deliveryStatus: "not_delivered";
  canSupportRealUse: false;
  limitations: string[];
};

export function buildSyntheticDemoReceipt(input: SyntheticDemoReceiptInput): SyntheticDemoReceipt {
  if (!input.syntheticMode) throw new Error("synthetic_mode_required");
  if (input.instrumentRuntimeReady) throw new Error("instrument_runtime_must_be_blocked");
  if (input.remoteTransportEnabled) throw new Error("remote_transport_forbidden");
  if (input.persisted) throw new Error("receipt_must_remain_memory_only");
  if (
    !Number.isInteger(input.expectedItemCount) ||
    input.expectedItemCount <= 0 ||
    input.completedItemCount !== input.expectedItemCount
  ) {
    throw new Error("synthetic_demo_incomplete");
  }
  if (!Number.isInteger(input.computedDimensionCount) || input.computedDimensionCount <= 0) {
    throw new Error("computed_dimensions_required");
  }
  if (!Number.isInteger(input.prioritizedDriverCount) || input.prioritizedDriverCount <= 0) {
    throw new Error("prioritized_drivers_required");
  }

  const generatedAt = new Date(input.generatedAt);
  if (!input.receiptId.trim()) throw new Error("receipt_id_required");
  if (!input.scenarioId.trim() || !input.scenarioLabel.trim()) throw new Error("scenario_identity_required");
  if (Number.isNaN(generatedAt.getTime())) throw new Error("generated_at_invalid");

  return {
    receiptId: input.receiptId.trim(),
    generatedAt: generatedAt.toISOString(),
    status: "synthetic_demo_complete",
    runtimePolicyVersion: input.runtimePolicyVersion,
    instrumentRef: `${input.instrumentKey}@${input.instrumentVersion}`,
    scenarioId: input.scenarioId.trim(),
    scenarioLabel: input.scenarioLabel.trim(),
    completedItemCount: input.completedItemCount,
    computedDimensionCount: input.computedDimensionCount,
    prioritizedDriverCount: input.prioritizedDriverCount,
    storageMode: "memory_only",
    deliveryStatus: "not_delivered",
    canSupportRealUse: false,
    limitations: [
      "Demonstração educativa e exclusivamente sintética.",
      "Não registra respostas nem envia o resultado à equipe.",
      "Não valida instrumento, diagnóstico, GRO/PGR ou conformidade.",
      "Não substitui AEP, AET, participação dos trabalhadores ou revisão técnica.",
    ],
  };
}
