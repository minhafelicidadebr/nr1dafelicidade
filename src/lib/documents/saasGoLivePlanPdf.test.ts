import { describe, expect, it } from "vitest";
import {
  CHECKOUT_FIRST_FLOW_STEPS,
  CONFIRMED_DECISIONS,
  DEVELOPMENT_SUPER_PROMPT,
  GOLIVE_CHAPTERS,
  GOLIVE_WAVES_ROADMAP,
  MTE_NR1_OPERATIONAL_CHAIN,
  PLAN_ARCHITECTURE_TIERS,
  PRODUCTION_KEYS_CHECKLIST,
  RBAC_PERMISSION_MATRIX,
  SAAS_BENCHMARKS,
  SUBSCRIPTION_LIFECYCLE_STATES,
  TOT_BRANCHES,
} from "@/data/saasGoLivePlan";
import {
  saasMaturityContext,
  saasMaturityItems,
  saasMaturityPolicy,
} from "@/data/saasMaturityAssessment";
import { evaluateSaasMaturity } from "@/lib/governance/saasMaturity";
import { buildSaasGoLivePlanPdf } from "@/lib/documents/saasGoLivePlanPdf";

describe("SaaS Go-Live executive plan invariants and PDF generator", () => {
  it("preserves complete structural coverage across all 6 chapters, ToT branches, flow steps and waves", () => {
    expect(GOLIVE_CHAPTERS).toHaveLength(6);
    expect(CONFIRMED_DECISIONS).toHaveLength(4);
    expect(TOT_BRANCHES).toHaveLength(3);
    expect(TOT_BRANCHES.filter((b) => b.verdict === "RECOMENDADO")).toHaveLength(1);
    expect(SAAS_BENCHMARKS.length).toBeGreaterThanOrEqual(5);
    expect(CHECKOUT_FIRST_FLOW_STEPS).toHaveLength(6);
    expect(PLAN_ARCHITECTURE_TIERS).toHaveLength(3);
    expect(RBAC_PERMISSION_MATRIX).toHaveLength(8);
    expect(PRODUCTION_KEYS_CHECKLIST.length).toBeGreaterThanOrEqual(6);
    expect(SUBSCRIPTION_LIFECYCLE_STATES).toHaveLength(4);
    expect(MTE_NR1_OPERATIONAL_CHAIN).toHaveLength(8);
    expect(GOLIVE_WAVES_ROADMAP).toHaveLength(5);
    expect(DEVELOPMENT_SUPER_PROMPT).toContain("consume_activation_token_and_create_org");
    expect(DEVELOPMENT_SUPER_PROMPT).toContain("k >= 5");
  });

  it("enforces immutable Privacy Vault block on individual worker responses for every organizational role", () => {
    const orgRoles = RBAC_PERMISSION_MATRIX.filter((row) => row.isOrganizationalActor);
    expect(orgRoles).toHaveLength(7);

    for (const role of orgRoles) {
      expect(role.permissions.individualResponses.level).toBe("blocked");
      expect(role.permissions.individualResponses.label).toContain("BLOQUEADO");
    }
  });

  it("keeps all server secrets isolated from VITE_ client exposure", () => {
    const serverSecrets = PRODUCTION_KEYS_CHECKLIST.filter((item) => item.tier === "server-secret");
    expect(serverSecrets.length).toBeGreaterThanOrEqual(5);
    for (const secret of serverSecrets) {
      expect(secret.variable.startsWith("VITE_")).toBe(false);
    }
  });

  it("builds a valid multi-page executive A4 PDF from the live maturity evaluator", () => {
    const liveSummary = evaluateSaasMaturity(
      saasMaturityItems,
      saasMaturityContext,
      saasMaturityPolicy,
    );

    const pdf = buildSaasGoLivePlanPdf(liveSummary, new Date("2026-07-16T12:00:00Z"));
    const pageCount = pdf.getNumberOfPages();
    const rawOutput = pdf.output("datauristring");

    expect(pageCount).toBeGreaterThanOrEqual(7);
    expect(rawOutput.startsWith("data:application/pdf")).toBe(true);
    expect(rawOutput.length).toBeGreaterThan(10_000);
  });
});
