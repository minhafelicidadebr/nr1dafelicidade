import { describe, expect, it } from "vitest";
import {
  g1PublicDemoReadinessContext,
  g1PublicDemoReadinessItems,
  g1PublicDemoReadinessPolicy,
} from "@/data/g1PublicDemoReadiness";
import {
  evaluatePublicDemoReadiness,
  type PublicDemoReadinessItemInput,
} from "./publicDemoReadiness";

describe("G1 public demo readiness", () => {
  it("allows private synthetic walkthrough while public demo approvals remain blocked", () => {
    const result = evaluatePublicDemoReadiness(
      g1PublicDemoReadinessItems,
      g1PublicDemoReadinessContext,
      g1PublicDemoReadinessPolicy,
    );

    expect(result.canRunPrivateSyntheticWalkthrough).toBe(true);
    expect(result.canRunPublicDemo).toBe(false);
    expect(result.status).toBe("private_walkthrough_ready");
    expect(result.privateReadinessPct).toBe(100);
    expect(result.publicReadinessPct).toBeLessThan(100);
    expect(result.nextStep?.key).toBe("lovable_preview_receipt");
    expect(result.blockers).toContain("public_demo_item_not_ready");
  });

  it("fails closed when public claims, local CI, real data or gate state are unsafe", () => {
    const result = evaluatePublicDemoReadiness(
      g1PublicDemoReadinessItems,
      {
        realDataEnabled: true,
        gateAdvanceClaimed: true,
        publicClaimsGuardrailGreen: false,
        localCiGreen: false,
      },
      g1PublicDemoReadinessPolicy,
    );

    expect(result.canRunPrivateSyntheticWalkthrough).toBe(false);
    expect(result.canRunPublicDemo).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "public_claims_guardrail_not_green",
        "local_ci_not_green",
        "real_data_enabled",
        "gate_advance_claimed",
      ]),
    );
  });

  it("allows public demo only when every public item is ready", () => {
    const readyItems: PublicDemoReadinessItemInput[] = g1PublicDemoReadinessItems.map((item) => ({
      ...item,
      status: "ready",
    }));

    const result = evaluatePublicDemoReadiness(
      readyItems,
      g1PublicDemoReadinessContext,
      g1PublicDemoReadinessPolicy,
    );

    expect(result.canRunPrivateSyntheticWalkthrough).toBe(true);
    expect(result.canRunPublicDemo).toBe(true);
    expect(result.status).toBe("public_demo_ready");
    expect(result.nextStep).toBeNull();
    expect(result.publicReadinessPct).toBe(100);
  });
});
