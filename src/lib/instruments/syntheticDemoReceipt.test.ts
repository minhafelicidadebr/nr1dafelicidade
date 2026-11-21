import { describe, expect, it } from "vitest";
import { buildSyntheticDemoReceipt, type SyntheticDemoReceiptInput } from "./syntheticDemoReceipt";

const validInput: SyntheticDemoReceiptInput = {
  receiptId: "SYN-DEMO-001",
  generatedAt: "2026-07-14T20:00:00.000Z",
  runtimePolicyVersion: "g0-test",
  instrumentKey: "exploratory-demo",
  instrumentVersion: "0.1.0-draft",
  scenarioId: "manual-synthetic",
  scenarioLabel: "Preenchimento sintético manual",
  completedItemCount: 12,
  expectedItemCount: 12,
  computedDimensionCount: 6,
  prioritizedDriverCount: 5,
  syntheticMode: true,
  instrumentRuntimeReady: false,
  remoteTransportEnabled: false,
  persisted: false,
};

describe("synthetic demo receipt", () => {
  it("creates a memory-only receipt without raw answers or real-use eligibility", () => {
    const receipt = buildSyntheticDemoReceipt(validInput);

    expect(receipt.status).toBe("synthetic_demo_complete");
    expect(receipt.storageMode).toBe("memory_only");
    expect(receipt.deliveryStatus).toBe("not_delivered");
    expect(receipt.canSupportRealUse).toBe(false);
    expect(receipt).not.toHaveProperty("answers");
  });

  it.each([
    ["real mode", { syntheticMode: false }, "synthetic_mode_required"],
    ["runtime enabled", { instrumentRuntimeReady: true }, "instrument_runtime_must_be_blocked"],
    ["remote transport", { remoteTransportEnabled: true }, "remote_transport_forbidden"],
    ["persistence", { persisted: true }, "receipt_must_remain_memory_only"],
    ["incomplete demo", { completedItemCount: 11 }, "synthetic_demo_incomplete"],
  ])("fails closed for %s", (_label, override, expectedError) => {
    expect(() => buildSyntheticDemoReceipt({ ...validInput, ...override })).toThrow(expectedError);
  });
});
