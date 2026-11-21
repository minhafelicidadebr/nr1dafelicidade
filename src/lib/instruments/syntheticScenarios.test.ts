import { describe, expect, it } from "vitest";
import { syntheticDemoScenarios, syntheticScenarioQuestions } from "@/data/syntheticDemoScenarios";
import { buildSyntheticScenarioAnswers } from "./syntheticScenarios";

describe("synthetic demo scenarios", () => {
  it("builds complete deterministic answers for every configured scenario", () => {
    syntheticDemoScenarios.forEach((scenario) => {
      const first = buildSyntheticScenarioAnswers(syntheticScenarioQuestions, scenario);
      const second = buildSyntheticScenarioAnswers(syntheticScenarioQuestions, scenario);

      expect(first.answers).toEqual(second.answers);
      expect(first.itemCount).toBe(syntheticScenarioQuestions.length);
      expect(Object.values(first.answers).every((value) => value >= 1 && value <= 5)).toBe(true);
      expect(first.syntheticOnly).toBe(true);
    });
  });

  it("fails closed when a scenario does not define one of the question groups", () => {
    expect(() => buildSyntheticScenarioAnswers(
      [{ key: "q1", group: "missing", favorableWhenHigh: false }],
      { id: "invalid", label: "Invalid", description: "", targetLoadByGroup: {} },
    )).toThrow("scenario_group_missing:missing");
  });
});
