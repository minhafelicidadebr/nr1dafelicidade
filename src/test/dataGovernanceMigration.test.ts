import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { repositoryDataGovernanceDraft } from "@/data/dataLifecyclePolicy";
import { canProcessRealData, evaluateDataGovernance } from "@/lib/governance/dataLifecycle";

const migration = readFileSync(
  resolve("supabase/migrations/20260623033000_data_governance_g1.sql"),
  "utf8",
);

describe("data governance migration contract", () => {
  it("keeps the repository policy fail closed", () => {
    expect(canProcessRealData(repositoryDataGovernanceDraft)).toBe(false);
    expect(evaluateDataGovernance(repositoryDataGovernanceDraft)).toEqual(
      expect.arrayContaining(["policy_not_approved", "legal_basis_missing", "rule_identity_retention_undecided"]),
    );
  });

  it.each([
    "data_governance_policies",
    "data_governance_rules",
    "data_governance_approvals",
    "security_incidents",
    "legal_holds",
    "data_disposal_requests",
    "emergency_access_requests",
  ])("keeps %s service-only", (table) => {
    expect(migration).toMatch(new RegExp(`REVOKE ALL[\\s\\S]*${table}[\\s\\S]*FROM PUBLIC, anon, authenticated`));
  });

  it("requires a complete hashed matrix and four disciplines", () => {
    expect(migration).toContain("governance_required_approvals_missing");
    expect(migration).toContain("governance_retention_matrix_incomplete");
    expect(migration).toContain("governance_matrix_hash_mismatch");
  });

  it("freezes rules and approvals with the approved policy", () => {
    expect(migration).toContain("approved_governance_policy_children_are_immutable");
    expect(migration).toContain("data_governance_rules_policy_lock");
    expect(migration).toContain("data_governance_approvals_policy_lock");
  });

  it("preserves microdata and export invariants", () => {
    expect(migration).toContain("governance_microdata_invariant_violated");
    expect(migration).toContain("access_mode <> 'service_only' OR export_allowed");
  });

  it("gates campaigns and sensitive outputs in the database", () => {
    expect(migration).toContain("data_governance_policy_not_approved");
    expect(migration).toContain("zz_cycles_governance_gate");
    expect(migration).toContain("zz_invitations_governance_gate");
    expect(migration).toContain("zz_risk_scores_governance_gate");
  });

  it("requires dual control, expiry and legal-hold checks", () => {
    expect(migration).toContain("disposal_requires_independent_approval");
    expect(migration).toContain("active_legal_hold_blocks_disposal");
    expect(migration).toContain("emergency_access_requires_independent_approval");
    expect(migration).toContain("interval '4 hours'");
    expect(migration).toContain("invalid_disposal_transition");
    expect(migration).toContain("invalid_emergency_access_transition");
    expect(migration).toContain("invalid_incident_transition");
  });

  it("does not expose any microdata or purge RPC", () => {
    expect(migration).not.toMatch(/CREATE OR REPLACE FUNCTION public\.(get|list|export)_.*response/i);
    expect(migration).not.toMatch(/CREATE OR REPLACE FUNCTION public\.(purge|delete|dispose)_/i);
  });

  it("exposes only a safe governance status to the interface", () => {
    const page = readFileSync(resolve("src/pages/app/GovernancePage.tsx"), "utf8");
    expect(page).toContain("Dados reais bloqueados");
    expect(page).toContain("não concede acesso organizacional a respostas individuais");
  });
});
