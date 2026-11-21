import { describe, expect, it } from "vitest";
import {
  g1ResidualRiskContext,
  g1ResidualRiskPolicy,
  g1ResidualRisks,
} from "@/data/g1ResidualRiskRegister";
import {
  evaluateResidualRiskRegister,
  type ResidualRiskInput,
} from "./residualRiskRegister";

describe("G1 residual risk register", () => {
  it("keeps G1 risk review blocked while critical and gate-blocking risks remain open", () => {
    const result = evaluateResidualRiskRegister(
      g1ResidualRisks,
      g1ResidualRiskContext,
      g1ResidualRiskPolicy,
    );

    expect(result.canRequestRiskReview).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.criticalOpen).toBeGreaterThan(0);
    expect(result.gateBlockingOpen).toBeGreaterThan(0);
    expect(result.nextStep?.key).toBe("instrument_source_license");
    expect(result.blockers).toEqual(
      expect.arrayContaining(["critical_risk_open", "gate_blocking_owner_missing"]),
    );
  });

  it("allows risk review only when every gate-blocking risk is controlled or mitigated", () => {
    const readyRisks: ResidualRiskInput[] = g1ResidualRisks.map((risk) => ({
      ...risk,
      status: "mitigated",
      ownerAssigned: true,
      evidenceRef: risk.evidenceRef ?? "docs/IMPLEMENTATION_STATUS.md",
      mitigation: risk.mitigation || "Mitigacao registrada.",
    }));

    const result = evaluateResidualRiskRegister(
      readyRisks,
      g1ResidualRiskContext,
      g1ResidualRiskPolicy,
    );

    expect(result.canRequestRiskReview).toBe(true);
    expect(result.status).toBe("ready_for_risk_review");
    expect(result.gateBlockingOpen).toBe(0);
    expect(result.readinessPct).toBe(100);
    expect(result.nextStep).toBeNull();
  });

  it("fails closed if real data is enabled or a gate advance is claimed", () => {
    const readyRisks: ResidualRiskInput[] = g1ResidualRisks.map((risk) => ({
      ...risk,
      status: "mitigated",
      ownerAssigned: true,
      evidenceRef: risk.evidenceRef ?? "docs/IMPLEMENTATION_STATUS.md",
      mitigation: risk.mitigation || "Mitigacao registrada.",
    }));

    const result = evaluateResidualRiskRegister(
      readyRisks,
      { realDataEnabled: true, gateAdvanceClaimed: true },
      g1ResidualRiskPolicy,
    );

    expect(result.canRequestRiskReview).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining(["real_data_enabled", "gate_advance_claimed"]),
    );
  });
});
