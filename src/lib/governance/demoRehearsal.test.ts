import { describe, expect, it } from "vitest";
import {
  g1DemoRehearsalContext,
  g1DemoRehearsalItems,
  g1DemoRehearsalPolicy,
} from "@/data/g1DemoRehearsal";
import {
  evaluateDemoRehearsal,
  type DemoRehearsalItemInput,
} from "./demoRehearsal";

describe("G1 synthetic demo rehearsal", () => {
  it("allows internal synthetic rehearsal while external demo evidence is incomplete", () => {
    const result = evaluateDemoRehearsal(
      g1DemoRehearsalItems,
      g1DemoRehearsalContext,
      g1DemoRehearsalPolicy,
    );

    expect(result.canRunInternalSyntheticDemo).toBe(true);
    expect(result.canRunExternalDemo).toBe(false);
    expect(result.status).toBe("internal_ready");
    expect(result.internalReadinessPct).toBe(100);
    expect(result.externalReadinessPct).toBeLessThan(100);
    expect(result.nextStep?.key).toBe("lovable_preview");
    expect(result.blockers).toContain("external_demo_item_not_ready");
  });

  it("blocks internal rehearsal if a required preflight item is not ready", () => {
    const items: DemoRehearsalItemInput[] = g1DemoRehearsalItems.map((item) =>
      item.key === "runtime_preflight" ? { ...item, status: "blocked" } : item,
    );

    const result = evaluateDemoRehearsal(items, g1DemoRehearsalContext, g1DemoRehearsalPolicy);

    expect(result.canRunInternalSyntheticDemo).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.nextStep?.key).toBe("runtime_preflight");
    expect(result.blockers).toContain("internal_demo_item_not_ready");
  });

  it("fails closed if real data or gate advance is claimed", () => {
    const result = evaluateDemoRehearsal(
      g1DemoRehearsalItems,
      { realDataEnabled: true, gateAdvanceClaimed: true },
      g1DemoRehearsalPolicy,
    );

    expect(result.canRunInternalSyntheticDemo).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining(["real_data_enabled", "gate_advance_claimed"]),
    );
  });

  it("allows external demo only when all external evidence is ready", () => {
    const items: DemoRehearsalItemInput[] = g1DemoRehearsalItems.map((item) => ({
      ...item,
      status: "ready",
    }));

    const result = evaluateDemoRehearsal(items, g1DemoRehearsalContext, g1DemoRehearsalPolicy);

    expect(result.canRunInternalSyntheticDemo).toBe(true);
    expect(result.canRunExternalDemo).toBe(true);
    expect(result.status).toBe("external_ready");
    expect(result.nextStep).toBeNull();
  });
});
