import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration=readFileSync(resolve("supabase/migrations/20260623053000_aet_flow_g2.sql"),"utf8");
describe("full AET flow migration contract",()=>{
  it.each(["aet_assessments","aet_evidence","aet_findings","aet_finding_evidence","aet_recommendations","aet_review_events"])("keeps %s service-only",table=>{expect(migration).toMatch(new RegExp(`REVOKE ALL[\\s\\S]*${table}[\\s\\S]*FROM PUBLIC, anon, authenticated`));});
  it("starts only from an explicit AEP trigger",()=>{expect(migration).toContain("trigger_id uuid NOT NULL UNIQUE");expect(migration).toContain("aet_trigger_not_open");expect(migration).toContain("aet_trigger_scope_mismatch");});
  it("implements the full forward-only lifecycle",()=>{expect(migration).toContain("'draft','scoped','in_progress','technical_review','approved','closed','superseded'");expect(migration).toContain("invalid_aet_transition");expect(migration).toContain("superseded_aet_is_immutable");});
  it("requires observation, participation and recommendations",()=>{expect(migration).toContain("aet_observation_missing");expect(migration).toContain("aet_participation_missing");expect(migration).toContain("aet_finding_or_recommendation_incomplete");});
  it("creates an action for every recommendation",()=>{expect(migration).toContain("action_item_id uuid NOT NULL UNIQUE");expect(migration).toContain("INSERT INTO public.action_items");expect(migration).toContain("aet_recommendation_scope_invalid");});
  it("enforces tenant-scoped author, responsible and reviewer",()=>{expect(migration).toContain("aet_author_scope_invalid");expect(migration).toContain("aet_responsible_scope_invalid");expect(migration).toContain("aet_reviewer_scope_invalid");});
  it("freezes reviewed content with canonical hash and append-only history",()=>{expect(migration).toContain("aet_review_content_is_immutable");expect(migration).toContain("aet_content_hash_mismatch");expect(migration).toContain("aet_review_events_append_only");});
  it("requires closure evidence and completes the original trigger",()=>{expect(migration).toContain("aet_closure_evidence_missing");expect(migration).toContain("SET status='completed'");});
  it("allows risk linkage only to an approved AET finding",()=>{expect(migration).toContain("aet_finding_id uuid REFERENCES public.aet_findings");expect(migration).toContain("risk_output_aet_finding_not_approved");});
  it("keeps the UI preliminary and non-automatic",()=>{const page=readFileSync(resolve("src/pages/app/AetAnalysisPage.tsx"),"utf8");expect(page).toContain("Não é aberto por score, IA ou diagnóstico automático");expect(page).toContain("Aprovar como revisor independente");});
});
