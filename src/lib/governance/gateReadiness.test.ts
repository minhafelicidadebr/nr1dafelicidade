import { describe, expect, it } from "vitest";
import { g1ReadinessCriteria, type G1ReadinessKey } from "@/data/g1ReadinessCriteria";
import { evaluateGateReadiness, type GateEvidenceMap } from "./gateReadiness";

const allKeys = g1ReadinessCriteria.map((item) => item.key);

function evidenceWith(okKeys: G1ReadinessKey[]): GateEvidenceMap {
  return Object.fromEntries(
    allKeys.map((key) => [
      key,
      {
        ok: okKeys.includes(key),
        detail: okKeys.includes(key) ? "Evidenciado." : "Pendente.",
      },
    ]),
  ) as GateEvidenceMap;
}

describe("G1 gate readiness evaluator", () => {
  it("keeps the gate blocked when operational evidence is missing", () => {
    const result = evaluateGateReadiness(
      g1ReadinessCriteria,
      evidenceWith(["data_gate", "organization"]),
    );

    expect(result.canAdvanceGate).toBe(false);
    expect(result.status).toBe("operational_pending");
    expect(result.nextStep?.key).toBe("units");
    expect(result.operationalPct).toBeLessThan(100);
  });

  it("keeps No-Go when operational evidence is complete but formal approvals are missing", () => {
    const operationalKeys = g1ReadinessCriteria
      .filter((item) => item.category !== "formal")
      .map((item) => item.key);

    const result = evaluateGateReadiness(g1ReadinessCriteria, evidenceWith(operationalKeys));

    expect(result.canAdvanceGate).toBe(false);
    expect(result.status).toBe("formal_pending");
    expect(result.operationalPct).toBe(100);
    expect(result.formalOk).toBe(0);
    expect(result.nextStep?.category).toBe("formal");
  });

  it("allows formal acceptance only when every gate blocker is satisfied", () => {
    const result = evaluateGateReadiness(g1ReadinessCriteria, evidenceWith(allKeys));

    expect(result.canAdvanceGate).toBe(true);
    expect(result.status).toBe("ready_for_formal_acceptance");
    expect(result.gateBlockingOpen).toBe(0);
    expect(result.gatePct).toBe(100);
    expect(result.nextStep).toBeNull();
  });
});
