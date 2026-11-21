import { describe, expect, it } from "vitest";
import { g1EvidenceDossierItems, g1EvidenceDossierPolicy } from "@/data/g1EvidenceDossier";
import { evaluateEvidenceDossier, type EvidenceDossierItemInput } from "./evidenceDossier";

describe("G1 evidence dossier", () => {
  it("keeps G1 blocked while local evidence lacks formal approval and source readiness", () => {
    const result = evaluateEvidenceDossier(g1EvidenceDossierItems, g1EvidenceDossierPolicy);

    expect(result.canRequestFormalReview).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.nextStep?.key).toBe("privacy_vault");
    expect(result.blocked).toBeGreaterThan(0);
    expect(result.formalPending).toBeGreaterThan(0);
    expect(result.items.find((item) => item.key === "runtime_gate")?.gateReady).toBe(true);
  });

  it("allows formal review only when every gate-blocking item is technically and formally ready", () => {
    const readyItems: EvidenceDossierItemInput[] = g1EvidenceDossierItems.map((item) => ({
      ...item,
      technicalStatus: "ready",
      formalStatus: item.formalStatus === "not_required" ? "not_required" : "approved",
    }));

    const result = evaluateEvidenceDossier(readyItems, g1EvidenceDossierPolicy);

    expect(result.canRequestFormalReview).toBe(true);
    expect(result.status).toBe("ready_for_formal_review");
    expect(result.nextStep).toBeNull();
    expect(result.gateReadinessPct).toBe(100);
  });

  it("fails closed when any blocked item remains", () => {
    const items: EvidenceDossierItemInput[] = g1EvidenceDossierItems.map((item) => ({
      ...item,
      technicalStatus: "ready" as const,
      formalStatus: "approved" as const,
    }));
    items[0] = { ...items[0], technicalStatus: "blocked" };

    const result = evaluateEvidenceDossier(items, g1EvidenceDossierPolicy);

    expect(result.canRequestFormalReview).toBe(false);
    expect(result.blocked).toBe(1);
  });
});
