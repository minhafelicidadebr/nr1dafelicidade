import { describe, expect, it } from "vitest";
import { normalizeOutcomeRows } from "./outcomeRows";

describe("outcome RPC boundary", () => {
  it("keeps only approved aggregate fields", () => {
    expect(normalizeOutcomeRows([{
      outcome: "burnout",
      mean_score: 52.4,
      n_responses: 6,
      k_anonymity_met: true,
      worker_email: "should-not-cross-boundary@example.test",
    }])).toEqual([{
      outcome: "burnout",
      mean_score: 52.4,
      n_responses: 6,
      k_anonymity_met: true,
    }]);
  });

  it("fails closed for suppressed or malformed rows", () => {
    expect(normalizeOutcomeRows([
      { outcome: "sleep_problems", mean_score: 40, n_responses: 4, k_anonymity_met: true },
      { outcome: "stress", mean_score: 40, n_responses: 5, k_anonymity_met: false },
      { outcome: "burnout", mean_score: "40", n_responses: 5, k_anonymity_met: true },
    ])).toEqual([]);
  });
});
