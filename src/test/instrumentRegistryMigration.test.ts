import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const migration = readFileSync(
  resolve(root, "supabase/migrations/20260623023000_instrument_registry_g1.sql"),
  "utf8",
);

describe("Instrument Registry persistence contract", () => {
  it.each([
    "instruments",
    "instrument_versions",
    "instrument_subscales",
    "instrument_items",
    "instrument_review_events",
  ])("creates service-only table %s", (table) => {
    expect(migration).toContain(`CREATE TABLE public.${table}`);
    expect(migration).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  });

  it("registers the received implementation only as an unverified draft", () => {
    expect(migration).toContain("'0.1.0-draft', 'draft', 'pt-PT', 'unverified'");
    expect(migration).toContain("'unverified', 'unknown'");
    expect(migration).not.toMatch(/'0\.1\.0-draft',\s*'approved'/);
  });

  it("requires source, license, server scoring, hash, counts and approval", () => {
    for (const invariant of [
      "instrument_source_not_verified",
      "instrument_license_not_approved",
      "instrument_server_scoring_missing",
      "instrument_content_hash_mismatch",
      "instrument_item_count_mismatch",
      "instrument_approval_missing",
    ]) {
      expect(migration).toContain(invariant);
    }
  });

  it("blocks campaign, invitation and risk output for a draft instrument", () => {
    expect(migration).toContain("instrument_version_not_approved_or_runtime_ready");
    expect(migration).toContain("invitation_requires_approved_instrument");
    expect(migration).toContain("risk_output_requires_approved_instrument");
  });

  it("disables legacy organizational scoring functions", () => {
    expect(migration).toContain("REVOKE EXECUTE ON FUNCTION public.compute_cycle_risk(uuid) FROM authenticated;");
    expect(migration).toContain("REVOKE EXECUTE ON FUNCTION public.aggregate_cycle_outcomes(uuid) FROM authenticated;");
  });

  it("keeps the worker journey neutral and avoids absolute anonymity claims", () => {
    const page = readFileSync(resolve(root, "src/pages/RespondPage.tsx"), "utf8");
    expect(page).not.toMatch(/Confetti|Parabéns|100% anônim|consentir com a LGPD/i);
    expect(page).toContain("A participação é voluntária");
    expect(page).toMatch(/não realiza\s+diagnóstico individual/);
  });
});
