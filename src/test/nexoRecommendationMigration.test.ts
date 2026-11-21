import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260701143000_nexo_driver_recommendations_g1.sql"),
  "utf8",
);

describe("NEXO recommendation persistence migration", () => {
  it.each([
    "playbook_drivers",
    "driver_dimension_mappings",
    "driver_recommendation_runs",
    "driver_recommendation_evidence",
    "driver_recommendation_actions",
    "driver_recommendation_feedback",
  ])("keeps %s service-only with RLS enabled", (table) => {
    expect(migration).toMatch(new RegExp(`REVOKE ALL[\\s\\S]*${table}[\\s\\S]*FROM PUBLIC, anon, authenticated`));
    expect(migration).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  });

  it("creates an official server-side recommendation RPC over safe aggregates", () => {
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.generate_driver_recommendations");
    expect(migration).toContain("FROM public.list_safe_risk_scores(NULL::uuid, _cycle_id)");
    expect(migration).toContain("FROM public.get_cycle_privacy_summary(_org)");
    expect(migration).not.toMatch(/FROM public\.responses\s/i);
    expect(migration).not.toMatch(/JOIN public\.responses\s/i);
  });

  it("persists matrix version, algorithm version, blockers and canonical hash", () => {
    expect(migration).toContain("nexo-operational-alignment-v0.1.0-2026-07-01");
    expect(migration).toContain("nexo-priority-v0.1.0");
    expect(migration).toContain("content_sha256");
    expect(migration).toContain("extensions.digest");
    expect(migration).toContain("driver_recommendation_runs");
    expect(migration).toContain("driver_recommendation_evidence");
  });

  it("blocks unsafe recommendation states explicitly", () => {
    expect(migration).toContain("campaign_not_closed");
    expect(migration).toContain("below_k_anonymity");
    expect(migration).toContain("no_safe_aggregate_scores");
    expect(migration).toContain("missing_instrument_version");
    expect(migration).toContain("score_not_validated");
    expect(migration).toContain("insufficient_dimension_coverage");
  });

  it("keeps audit records append-only and exposes only safe list/generate RPCs", () => {
    expect(migration).toContain("nexo_audit_records_append_only");
    expect(migration).toContain("driver_recommendation_runs_append_only");
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.list_driver_recommendation_runs");
    expect(migration).toContain("GRANT EXECUTE ON FUNCTION public.generate_driver_recommendations");
    expect(migration).toContain("GRANT EXECUTE ON FUNCTION public.list_driver_recommendation_runs");
  });
});
