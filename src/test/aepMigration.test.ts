import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260623043000_aep_work_context_g2.sql"), "utf8");

describe("AEP and actual work migration contract", () => {
  it.each([
    "work_context_nodes", "aep_assessments", "aep_evidence", "aep_findings",
    "aep_finding_evidence", "aet_trigger_records", "aep_review_events",
  ])("keeps %s behind approved RPCs", (table) => {
    expect(migration).toMatch(new RegExp(`REVOKE ALL[\\s\\S]*${table}[\\s\\S]*FROM PUBLIC, anon, authenticated`));
  });

  it("implements the mandated forward-only states", () => {
    expect(migration).toContain("'draft', 'collecting_evidence', 'technical_review', 'approved', 'superseded'");
    expect(migration).toContain("invalid_aep_transition");
    expect(migration).toContain("superseded_aep_is_immutable");
  });

  it("requires observation, participation and complete contextual findings", () => {
    expect(migration).toContain("work_observation_missing");
    expect(migration).toContain("worker_participation_missing");
    expect(migration).toContain("contextual_finding_incomplete");
    expect(migration).toContain("finding_evidence_scope_invalid");
  });

  it("prohibits individual sensitive content in organizational evidence", () => {
    expect(migration).toContain("no_personal_data_confirmed boolean NOT NULL CHECK (no_personal_data_confirmed)");
    expect(migration).toContain("individual_sensitive_content_prohibited");
  });

  it("freezes reviewed content and hashes its canonical definition", () => {
    expect(migration).toContain("aep_review_content_is_immutable");
    expect(migration).toContain("aep_review_definition_is_immutable");
    expect(migration).toContain("aep_content_hash_mismatch");
    expect(migration).toContain("aep_review_events_append_only");
  });

  it("requires a reviewer different from the author", () => {
    expect(migration).toContain("aep_independent_reviewer_missing");
    expect(migration).toContain("reviewer_id <> author_id");
  });

  it("turns an AET signal into an assigned task", () => {
    expect(migration).toContain("aet_trigger_requires_task_context");
    expect(migration).toContain("Avaliar necessidade e escopo de AET");
    expect(migration).toContain("action_item_id uuid NOT NULL");
  });

  it("prevents risk output without approved contextual evidence", () => {
    expect(migration).toContain("risk_output_requires_approved_aep");
    expect(migration).toContain("aep_finding_id uuid REFERENCES public.aep_findings");
    expect(migration).toContain("zzzz_risk_scores_aep_gate");
  });

  it("keeps the interface preliminary and privacy-safe", () => {
    const page = readFileSync(resolve("src/pages/app/WorkAnalysisPage.tsx"), "utf8");
    expect(page).toContain("Não substitui AET ou avaliação profissional");
    expect(page).toContain("não incluí nomes, relatos identificáveis, diagnóstico ou conteúdo individual sensível");
  });
});
