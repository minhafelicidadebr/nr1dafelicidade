import { describe, expect, it } from "vitest";
import { recordSyntheticDemoFeedback, type SyntheticDemoFeedbackInput } from "./syntheticDemoFeedback";

const validInput: SyntheticDemoFeedbackInput = {
  receiptId: "SYN-DEMO-001",
  understanding: "clear",
  perceivedValue: "high",
  nextInterest: "governance",
  syntheticMode: true,
  freeTextEnabled: false,
  persisted: false,
  remoteTransportEnabled: false,
};

describe("synthetic demo feedback", () => {
  it("records only controlled feedback in memory", () => {
    const feedback = recordSyntheticDemoFeedback(validInput);

    expect(feedback.status).toBe("recorded_in_memory");
    expect(feedback.storageMode).toBe("memory_only");
    expect(feedback.canTransmit).toBe(false);
    expect(feedback).not.toHaveProperty("freeText");
  });

  it.each([
    ["free text", { freeTextEnabled: true }, "free_text_forbidden"],
    ["persistence", { persisted: true }, "feedback_persistence_forbidden"],
    ["remote transport", { remoteTransportEnabled: true }, "feedback_transport_forbidden"],
    ["real mode", { syntheticMode: false }, "synthetic_mode_required"],
  ])("fails closed for %s", (_label, override, expectedError) => {
    expect(() => recordSyntheticDemoFeedback({ ...validInput, ...override })).toThrow(expectedError);
  });
});
