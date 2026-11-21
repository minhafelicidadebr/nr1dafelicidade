import { describe, expect, it } from "vitest";
import { g1CanonicalInstrumentIntakeSummary } from "@/data/g1CanonicalInstrumentIntake";
import { g1CanonicalPackageManifestSummary } from "@/data/g1CanonicalPackageManifest";
import { g1InstrumentMethodologySummary } from "@/data/instrumentMethodologyReadiness";
import { evaluateMethodologyDossier } from "./methodologyDossier";

describe("methodology dossier", () => {
  it("keeps the exploratory instrument blocked and identifies the first canonical artifact", () => {
    const dossier = evaluateMethodologyDossier(
      g1CanonicalInstrumentIntakeSummary,
      g1CanonicalPackageManifestSummary,
      g1InstrumentMethodologySummary,
    );

    expect(dossier.status).toBe("blocked");
    expect(dossier.readyStages).toBe(0);
    expect(dossier.canEnableInstrumentRuntime).toBe(false);
    expect(dossier.nextStep).toContain("Manual/fonte primaria canonica");
  });
});
