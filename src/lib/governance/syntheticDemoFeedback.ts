export type SyntheticDemoFeedbackInput = {
  receiptId: string;
  understanding: "clear" | "partial" | "unclear";
  perceivedValue: "high" | "medium" | "low";
  nextInterest: "methodology" | "governance" | "synthetic_journey" | "none";
  syntheticMode: boolean;
  freeTextEnabled: boolean;
  persisted: boolean;
  remoteTransportEnabled: boolean;
};

export type SyntheticDemoFeedback = {
  receiptId: string;
  status: "recorded_in_memory";
  understanding: SyntheticDemoFeedbackInput["understanding"];
  perceivedValue: SyntheticDemoFeedbackInput["perceivedValue"];
  nextInterest: SyntheticDemoFeedbackInput["nextInterest"];
  storageMode: "memory_only";
  canTransmit: false;
};

export function recordSyntheticDemoFeedback(input: SyntheticDemoFeedbackInput): SyntheticDemoFeedback {
  if (!input.receiptId.trim()) throw new Error("receipt_id_required");
  if (!input.syntheticMode) throw new Error("synthetic_mode_required");
  if (input.freeTextEnabled) throw new Error("free_text_forbidden");
  if (input.persisted) throw new Error("feedback_persistence_forbidden");
  if (input.remoteTransportEnabled) throw new Error("feedback_transport_forbidden");

  return {
    receiptId: input.receiptId.trim(),
    status: "recorded_in_memory",
    understanding: input.understanding,
    perceivedValue: input.perceivedValue,
    nextInterest: input.nextInterest,
    storageMode: "memory_only",
    canTransmit: false,
  };
}
