import { describe, expect, it } from "vitest";
import {
  g1InstrumentMethodologyChecks,
  g1InstrumentMethodologyContext,
  g1InstrumentMethodologyPolicy,
} from "@/data/instrumentMethodologyReadiness";
import {
  evaluateInstrumentMethodologyReadiness,
  type InstrumentMethodologyCheckInput,
} from "./methodologyReadiness";

describe("instrument methodology readiness", () => {
  it("keeps the current instrument blocked while sources, license, scoring and fixtures are missing", () => {
    const result = evaluateInstrumentMethodologyReadiness(
      g1InstrumentMethodologyChecks,
      g1InstrumentMethodologyContext,
      g1InstrumentMethodologyPolicy,
    );

    expect(result.canApproveForRuntime).toBe(false);
    expect(result.canSubmitForReview).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.nextStep?.key).toBe("primary_source");
    expect(result.blockers).toEqual(expect.arrayContaining(["methodology_missing", "methodology_in_draft"]));
  });

  it("allows review only when gate-blocking checks are no longer missing or draft", () => {
    const checks: InstrumentMethodologyCheckInput[] = g1InstrumentMethodologyChecks.map((check) => ({
      ...check,
      status: check.gateBlocking ? "review" : check.status,
    }));

    const result = evaluateInstrumentMethodologyReadiness(
      checks,
      g1InstrumentMethodologyContext,
      g1InstrumentMethodologyPolicy,
    );

    expect(result.canSubmitForReview).toBe(true);
    expect(result.canApproveForRuntime).toBe(false);
    expect(result.status).toBe("ready_for_review");
    expect(result.blockers).toContain("methodology_under_review");
  });

  it("allows runtime approval only after every gate-blocking check is approved", () => {
    const checks: InstrumentMethodologyCheckInput[] = g1InstrumentMethodologyChecks.map((check) => ({
      ...check,
      status: "approved",
    }));

    const result = evaluateInstrumentMethodologyReadiness(
      checks,
      g1InstrumentMethodologyContext,
      g1InstrumentMethodologyPolicy,
    );

    expect(result.canSubmitForReview).toBe(true);
    expect(result.canApproveForRuntime).toBe(true);
    expect(result.status).toBe("ready_for_runtime_approval");
    expect(result.gateReadinessPct).toBe(100);
  });

  it("fails closed if runtime is enabled before methodology approval", () => {
    const result = evaluateInstrumentMethodologyReadiness(
      g1InstrumentMethodologyChecks,
      { runtimeReady: true },
      g1InstrumentMethodologyPolicy,
    );

    expect(result.canApproveForRuntime).toBe(false);
    expect(result.blockers).toContain("runtime_enabled_before_approval");
  });
});
