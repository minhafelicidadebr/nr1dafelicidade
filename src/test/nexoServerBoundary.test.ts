import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("NEXO server-side boundary", () => {
  it("calculates recommendations in the Edge Function from the safe aggregate RPC only", () => {
    const source = read("supabase/functions/nexo-driver-recommendations/index.ts");
    const fromCall = ".from";

    expect(source).toContain('rpc("generate_driver_recommendations"');
    expect(source).not.toContain("evaluateNexoDriverRecommendations");
    expect(source).not.toContain("list_safe_risk_scores");
    expect(source).not.toContain(`${fromCall}("responses")`);
    expect(source).not.toContain(`${fromCall}("risk_scores")`);
    expect(source).not.toContain(`${fromCall}('responses')`);
    expect(source).not.toContain(`${fromCall}('risk_scores')`);
  });

  it("keeps React pages as consumers, not recommendation engines", () => {
    const riskPage = read("src/pages/app/RiskPage.tsx");
    const dashboardPage = read("src/pages/app/DashboardPage.tsx");

    expect(riskPage).toContain("fetchNexoDriverRecommendations");
    expect(dashboardPage).toContain("fetchNexoDriverRecommendations");
    expect(riskPage).not.toContain("evaluateNexoDriverRecommendations(");
    expect(dashboardPage).not.toContain("evaluateNexoDriverRecommendations(");
    expect(riskPage).not.toContain("safeRiskScoresToNexoInputs(");
    expect(dashboardPage).not.toContain("safeRiskScoresToNexoInputs(");
  });
});
