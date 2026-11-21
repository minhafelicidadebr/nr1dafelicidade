import { describe, expect, it } from "vitest";
import { nexoDriverMatrix } from "@/data/nexoDriverMatrix";
import {
  evaluateNexoDriverRecommendations,
  safeRiskScoresToNexoInputs,
  type NexoRecommendationContext,
} from "./driverRecommendation";

const baseContext: NexoRecommendationContext = {
  cycleId: "cycle-1",
  scopeType: "cycle",
  scopeId: "cycle-1",
  campaignStatus: "closed",
  instrumentVersionId: "criteria-aiha-v1",
  instrumentLegacy: false,
  instrumentComparable: true,
  scoreEngine: "server",
  scopeAuthorized: true,
  kMin: 5,
};

const safeScores = safeRiskScoresToNexoInputs([
  { dimension: "leadership_quality", mean_score: 90, risk_level: 20, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "predictability", mean_score: 88, risk_level: 20, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "role_clarity", mean_score: 86, risk_level: 20, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "social_support", mean_score: 78, risk_level: 16, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "recognition", mean_score: 35, risk_level: 8, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "influence", mean_score: 10, risk_level: 5, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "demands_quant", mean_score: 8, risk_level: 5, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
  { dimension: "work_pace", mean_score: 8, risk_level: 5, n_responses: 8, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
]);

describe("NEXO driver recommendation engine", () => {
  it("prioritizes drivers from k-safe server aggregates without reading individual responses", () => {
    const run = evaluateNexoDriverRecommendations(nexoDriverMatrix, safeScores, baseContext, new Date("2026-07-01T12:00:00Z"));

    expect(run.status).toBe("available");
    expect(run.primary?.driverKey).toBe("management");
    expect(run.primary?.coverage).toBeGreaterThanOrEqual(60);
    expect(run.primary?.priorityBand).toBe("alta");
    expect(run.primary?.reasons.map((reason) => reason.dimensionKey)).toContain("leadership_quality");
    expect(run.matrixVersion).toBe(nexoDriverMatrix.version);
    expect(run.algorithmVersion).toBe(nexoDriverMatrix.algorithmVersion);
    expect(run.disclaimer).toContain("não estabelece causalidade individual");
  });

  it("blocks recommendations below k-anonymity", () => {
    const dimensions = safeRiskScoresToNexoInputs([
      { dimension: "leadership_quality", mean_score: 82, risk_level: 20, n_responses: 4, k_anonymity_met: false, criteria_version: "criteria-aiha-v1" },
    ]);

    const run = evaluateNexoDriverRecommendations(nexoDriverMatrix, dimensions, baseContext);

    expect(run.status).toBe("blocked");
    expect(run.blockers).toContain("below_k_anonymity");
    expect(run.primary).toBeNull();
  });

  it("blocks frontend or unversioned score sources", () => {
    const dimensions = safeRiskScoresToNexoInputs([
      { dimension: "leadership_quality", mean_score: 82, risk_level: 20, n_responses: 8, k_anonymity_met: true, criteria_version: null },
    ]);

    const run = evaluateNexoDriverRecommendations(nexoDriverMatrix, dimensions, {
      ...baseContext,
      instrumentVersionId: null,
      scoreEngine: "frontend",
    });

    expect(run.status).toBe("blocked");
    expect(run.blockers).toContain("missing_instrument_version");
    expect(run.blockers).toContain("non_server_side_score");
    expect(run.blockers).toContain("score_not_validated");
  });

  it("does not invent output when coverage is insufficient", () => {
    const dimensions = safeRiskScoresToNexoInputs([
      { dimension: "leadership_quality", mean_score: 90, risk_level: 20, n_responses: 10, k_anonymity_met: true, criteria_version: "criteria-aiha-v1" },
    ]);

    const run = evaluateNexoDriverRecommendations(nexoDriverMatrix, dimensions, baseContext);

    expect(run.status).toBe("blocked");
    expect(run.blockers).toContain("insufficient_dimension_coverage");
    expect(run.recommendations).toEqual([]);
  });

  it("preserves historical run version when the matrix changes", () => {
    const run = evaluateNexoDriverRecommendations(nexoDriverMatrix, safeScores, baseContext);
    const changedMatrix = { ...nexoDriverMatrix, version: "nexo-operational-alignment-v0.2.0" };

    expect(run.matrixVersion).toBe("nexo-operational-alignment-v0.1.0-2026-07-01");
    expect(evaluateNexoDriverRecommendations(changedMatrix, safeScores, baseContext).matrixVersion)
      .toBe("nexo-operational-alignment-v0.2.0");
  });
});
