import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { regulatoryJourneyPolicy, regulatoryJourneySteps } from "@/data/regulatoryJourney";
import { evaluateRegulatoryJourney } from "./regulatoryJourney";

describe("regulatory journey contract", () => {
  it("marks the reference journey as ready only for synthetic local demonstration", () => {
    const result = evaluateRegulatoryJourney(regulatoryJourneySteps, regulatoryJourneyPolicy);

    expect(result.status).toBe("synthetic_ready");
    expect(result.canRunSynthetic).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.missingRequiredRoutes).toEqual([]);
    expect(result.missingRequiredInvariants).toEqual([]);
    expect(result.readySteps).toBe(result.totalSteps);
    expect(result.nextStep).toContain("nao aprova G1");
  });

  it("blocks the contract when a required invariant loses coverage", () => {
    const weakenedSteps = regulatoryJourneySteps.map((step) =>
      step.key === "preliminary_documents"
        ? {
            ...step,
            requiredInvariants: step.requiredInvariants.filter((item) => item !== "documents_preliminary"),
          }
        : step,
    );

    const result = evaluateRegulatoryJourney(weakenedSteps, regulatoryJourneyPolicy);

    expect(result.canRunSynthetic).toBe(false);
    expect(result.blockers).toContain("missing_required_invariant");
    expect(result.missingRequiredInvariants).toContain("documents_preliminary");
  });

  it("blocks duplicate routes, non-synthetic steps and gate advance claims", () => {
    const unsafeSteps = regulatoryJourneySteps.map((step) => {
      if (step.key === "company_scope") return { ...step, syntheticOnly: false };
      if (step.key === "units_segments") return { ...step, route: "/app/company" };
      if (step.key === "governance_gate") return { ...step, gateEffect: "gate_candidate" as const };
      return step;
    });

    const result = evaluateRegulatoryJourney(unsafeSteps, regulatoryJourneyPolicy);

    expect(result.canRunSynthetic).toBe(false);
    expect(result.blockers).toContain("duplicate_route");
    expect(result.blockers).toContain("missing_required_route");
    expect(result.blockers).toContain("non_synthetic_step");
    expect(result.blockers).toContain("gate_advance_claimed");
  });

  it("keeps every journey route aligned with the router declaration", () => {
    const appSource = readFileSync(join(process.cwd(), "src", "App.tsx"), "utf8");
    const missingRoutes = regulatoryJourneySteps
      .map((step) => step.route.replace(/^\/app\/?/, ""))
      .filter((route) => !appSource.includes(`path="${route}"`));

    expect(missingRoutes).toEqual([]);
  });
});
