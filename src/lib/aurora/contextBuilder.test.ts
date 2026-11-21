import { describe, expect, it } from "vitest";
import type { SafeRiskScore } from "@/lib/api/privacyVault";
import { projectAuroraScore, selectAuroraScores } from "./contextBuilder";

function score(overrides: Partial<SafeRiskScore> = {}): SafeRiskScore {
  return {
    id: "score-1",
    cycle_id: "cycle-1",
    organization_id: "org-1",
    dimension: "demands",
    driver_slug: "workload",
    severity: 4,
    probability: 3,
    risk_level: 12,
    n_responses: 5,
    mean_score: 62,
    unfavorable_percentage: 48,
    criteria_version: "synthetic-v1",
    computed_at: "2026-07-17T00:00:00.000Z",
    cycle_name: "Ciclo sintético",
    cycle_started_at: null,
    ...overrides,
  };
}

describe("Aurora typed context projection", () => {
  it("forwards only aggregate fields to the AI context", () => {
    expect(projectAuroraScore(score())).toEqual({
      dimension: "demands",
      risk_level: 12,
      severity: 4,
      probability: 3,
      n_responses: 5,
      mean_score: 62,
      unfavorable_percentage: 48,
    });
  });

  it("preserves the k-anonymity boundary while counting suppressed rows", () => {
    const result = selectAuroraScores([
      score({ id: "score-small", n_responses: 4 }),
      score({ id: "score-safe", n_responses: 5 }),
    ]);

    expect(result.all).toHaveLength(2);
    expect(result.visible).toHaveLength(1);
    expect(result.visible[0].dimension).toBe("demands");
    expect(result.suppressedCount).toBe(1);
  });
});
