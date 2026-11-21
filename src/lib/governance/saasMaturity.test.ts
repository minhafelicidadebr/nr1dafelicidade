import { describe, expect, it } from "vitest";
import {
  saasMaturityContext,
  saasMaturityItems,
  saasMaturityPolicy,
} from "@/data/saasMaturityAssessment";
import {
  evaluateSaasMaturity,
  type SaasMaturityItemInput,
} from "./saasMaturity";

describe("SaaS maturity assessment", () => {
  it("keeps the current product at foundation while G1 formal and methodology blockers remain open", () => {
    const result = evaluateSaasMaturity(saasMaturityItems, saasMaturityContext, saasMaturityPolicy);

    expect(result.canDemoSynthetic).toBe(true);
    expect(result.currentGate).toBe("G0");
    expect(result.canRunSyntheticMvp).toBe(false);
    expect(result.canRunRealSaas).toBe(false);
    expect(result.currentStage).toBe("foundation");
    expect(result.nextStage).toBe("synthetic_mvp");
    expect(result.nextStep?.key).toBe("formal_acceptance");
    expect(result.items.find((item) => item.key === "official_github_ci")?.status).toBe("ready");
    expect(result.items.find((item) => item.key === "browser_e2e")?.status).toBe("ready");
    expect(result.items.find((item) => item.key === "lovable_sync")?.status).toBe("blocked");
    expect(result.blockers).toEqual(
      expect.arrayContaining(["stage_gate_blocked", "unicorn_grade_not_reached"]),
    );
  });

  it("promotes to synthetic MVP only when foundation and synthetic gate blockers are ready", () => {
    const items: SaasMaturityItemInput[] = saasMaturityItems.map((item) => ({
      ...item,
      status: ["foundation", "synthetic_mvp"].includes(item.stage) ? "ready" : item.status,
    }));

    const result = evaluateSaasMaturity(items, saasMaturityContext, saasMaturityPolicy);

    expect(result.canRunSyntheticMvp).toBe(true);
    expect(result.canRunRealSaas).toBe(false);
    expect(result.currentStage).toBe("synthetic_mvp");
    expect(result.status).toBe("synthetic_mvp_ready");
  });

  it("fails closed if real data is enabled before G3", () => {
    const result = evaluateSaasMaturity(
      saasMaturityItems,
      { realDataEnabled: true },
      saasMaturityPolicy,
    );

    expect(result.canDemoSynthetic).toBe(false);
    expect(result.canRunSyntheticMvp).toBe(false);
    expect(result.canRunRealSaas).toBe(false);
    expect(result.blockers).toContain("real_data_enabled_before_g3");
  });

  it("requires real SaaS gates and unicorn-grade score before scale readiness", () => {
    const readyItems: SaasMaturityItemInput[] = saasMaturityItems.map((item) => ({
      ...item,
      status: "ready",
    }));

    const result = evaluateSaasMaturity(readyItems, saasMaturityContext, saasMaturityPolicy);

    expect(result.canRunSyntheticMvp).toBe(true);
    expect(result.canRunRealSaas).toBe(true);
    expect(result.unicornGradeReady).toBe(true);
    expect(result.currentStage).toBe("scale");
    expect(result.scorePct).toBe(100);
  });
});
