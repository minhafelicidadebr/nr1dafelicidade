import { describe, expect, it } from "vitest";
import {
  evaluateExternalReadinessClosure,
  type ExternalReadinessClosureItemInput,
  type ExternalReadinessClosurePolicy,
} from "./externalReadinessClosure";

const policy: ExternalReadinessClosurePolicy = {
  policyId: "closure-test",
  targetGate: "G1",
  requiredWorkstreams: ["accountability", "release", "risk"],
  requireOwner: true,
  requireVerifiedEvidence: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
};

const readyItems: ExternalReadinessClosureItemInput[] = [
  item("accountability", 1),
  item("release", 2, ["accountability"]),
  item("risk", 3, ["release"]),
];

describe("evaluateExternalReadinessClosure", () => {
  it("allows only a formal review when every workstream is verified", () => {
    const result = evaluateExternalReadinessClosure(readyItems, safeContext(), policy);

    expect(result.status).toBe("ready_for_formal_review");
    expect(result.canRequestFormalReview).toBe(true);
    expect(result.canAdvanceGate).toBe(false);
    expect(result.canUseRealData).toBe(false);
    expect(result.ready).toBe(3);
  });

  it("fails closed when a claimed-ready workstream lacks owner or verified evidence", () => {
    const result = evaluateExternalReadinessClosure([
      { ...readyItems[0], ownerAssigned: false, evidenceRef: null, evidenceVerified: false },
      ...readyItems.slice(1),
    ], safeContext(), policy);

    expect(result.canRequestFormalReview).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining(["owner_missing", "evidence_missing", "evidence_unverified"]));
    expect(result.items[1].blockers).toContain("dependency_not_ready");
    expect(result.blocked).toBe(3);
  });

  it("rejects missing, duplicate and unknown dependency structures", () => {
    const result = evaluateExternalReadinessClosure([
      readyItems[0],
      readyItems[0],
      { ...readyItems[1], dependencies: ["unknown"] },
    ], safeContext(), policy);

    expect(result.canRequestFormalReview).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "required_workstream_missing",
      "duplicate_workstream",
      "dependency_missing",
    ]));
  });

  it("blocks real data and gate-advance claims even with complete evidence", () => {
    const result = evaluateExternalReadinessClosure(readyItems, {
      realDataEnabled: true,
      gateAdvanceClaimed: true,
    }, policy);

    expect(result.canRequestFormalReview).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining(["real_data_enabled", "gate_advance_claimed"]));
  });

  it("propagates transitive dependency failures and rejects cycles", () => {
    const transitive = evaluateExternalReadinessClosure([
      { ...readyItems[0], ownerAssigned: false },
      readyItems[1],
      readyItems[2],
    ], safeContext(), policy);
    const cyclic = evaluateExternalReadinessClosure([
      { ...readyItems[0], dependencies: ["risk"] },
      readyItems[1],
      readyItems[2],
    ], safeContext(), policy);

    expect(transitive.items.find((item) => item.key === "risk")?.blockers).toContain("dependency_not_ready");
    expect(cyclic.blockers).toContain("dependency_cycle");
    expect(cyclic.canRequestFormalReview).toBe(false);
  });
});

function item(key: string, priority: number, dependencies: readonly string[] = []): ExternalReadinessClosureItemInput {
  return {
    key,
    label: key,
    status: "ready",
    priority,
    ownerRole: "Papel accountable",
    ownerAssigned: true,
    evidenceRef: `docs/${key}.md`,
    evidenceVerified: true,
    dependencies,
    nextAction: "Solicitar revisão.",
    detail: "Trilha completa.",
  };
}

function safeContext() {
  return { realDataEnabled: false, gateAdvanceClaimed: false };
}
