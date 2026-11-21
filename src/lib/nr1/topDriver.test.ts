import { describe, expect, it } from "vitest";
import { topDriverForDimension, topDriverGlobal, type DimensionDriverMap } from "./topDriver";

const driverMap: DimensionDriverMap = {
  demands_quant: { stress: 1, energy: 0.7, support: 0.2 },
  social_support: { support: 1, trust: 0.5 },
};

describe("top driver mechanism", () => {
  it("selects the highest configured driver for a dimension", () => {
    expect(topDriverForDimension(driverMap, "demands_quant")).toBe("stress");
    expect(topDriverForDimension(driverMap, "unknown")).toBeNull();
  });

  it("preserves weighted risk aggregation across visible dimensions", () => {
    expect(topDriverGlobal(driverMap, [
      { dimension: "demands_quant", risk_level: 10 },
      { dimension: "social_support", risk_level: 20 },
      { dimension: "unknown", risk_level: 100 },
    ])).toEqual({ slug: "support", score: 22 });
  });

  it("fails closed to an empty result without visible scores", () => {
    expect(topDriverGlobal(driverMap, [])).toEqual({ slug: null, score: 0 });
  });
});
