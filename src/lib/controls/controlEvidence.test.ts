import { describe, expect, it } from "vitest";
import {
  CONTROL_EVIDENCE_DISCLAIMER,
  controlEvidenceBlockerLabel,
  evaluateControlEvidence,
} from "./controlEvidence";

describe("control evidence evaluator", () => {
  it("does not treat a declared control as ready for residual risk review", () => {
    const result = evaluateControlEvidence({
      status: "planned",
      catalogEvidenceStrength: "moderada",
      notes: "",
    });

    expect(result.signals.catalog_evidence).toBe(true);
    expect(result.canInformResidualRiskReview).toBe(false);
    expect(result.completionBlockers).toEqual([
      "missing_implementation_evidence",
      "missing_maintenance_evidence",
      "missing_effectiveness_indicator",
      "missing_technical_review",
    ]);
    expect(result.disclaimer).toBe(CONTROL_EVIDENCE_DISCLAIMER);
  });

  it("accepts evidence, maintenance, effectiveness indicator and technical review as review-ready", () => {
    const result = evaluateControlEvidence({
      status: "in_progress",
      catalogEvidenceStrength: "forte",
      notes:
        "Evidência: procedimento implementado em ata com data. Manutenção: rotina mensal com responsável. KPI: baseline e indicador de eficácia. Revisão técnica SST/SESMT registrada em parecer.",
    });

    expect(result.signals).toMatchObject({
      catalog_evidence: true,
      implementation_evidence: true,
      maintenance: true,
      effectiveness_indicator: true,
      technical_review: true,
    });
    expect(result.readyForTechnicalReview).toBe(true);
    expect(result.canInformResidualRiskReview).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.label).toBe("review_ready");
  });

  it("blocks done status when effectiveness review evidence is incomplete", () => {
    const result = evaluateControlEvidence({
      status: "done",
      notes: "Evidência: treinamento realizado. Manutenção: rotina mensal.",
    });

    expect(result.completionBlockers).toContain("missing_effectiveness_indicator");
    expect(result.completionBlockers).toContain("missing_technical_review");
    expect(result.completionBlockers).toContain("done_without_effectiveness_review");
    expect(controlEvidenceBlockerLabel("done_without_effectiveness_review")).toContain("concluído");
  });

  it("does not require residual review readiness for cancelled controls", () => {
    const result = evaluateControlEvidence({
      status: "cancelled",
      notes: "",
    });

    expect(result.blockers).toEqual([]);
    expect(result.canInformResidualRiskReview).toBe(false);
    expect(result.label).toBe("cancelled");
  });
});
