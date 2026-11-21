import { describe, expect, it } from "vitest";
import { getDimensionInsight } from "./riskTranslationMatrix";

describe("risk translation matrix", () => {
  it("projects a catalogued dimension with typed MTE factors and drivers", () => {
    const insight = getDimensionInsight("demands_quant");

    expect(insight.catalogued).toBe(true);
    expect(insight.mteFactors).toContainEqual({
      code: "MTE-10",
      label: "Excesso de demandas (sobrecarga)",
      priority: "P0",
      critical: false,
    });
    expect(insight.drivers[0]).toEqual({ slug: "stress", weight: 1 });
    expect(insight.interventions.length).toBeGreaterThan(0);
  });

  it("fails closed for an uncatalogued dimension", () => {
    const insight = getDimensionInsight("unknown_dimension");

    expect(insight).toMatchObject({
      dimensionKey: "unknown_dimension",
      catalogued: false,
      mteFactors: [],
      drivers: [],
      interventions: [],
    });
    expect(insight.sourceRefs[0]).toContain("Fonte não cadastrada");
  });
});
