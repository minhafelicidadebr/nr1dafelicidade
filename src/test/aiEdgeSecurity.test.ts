import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");
const functionNames = [
  "driver-chat",
  "driver-dynamic",
  "estrategia-chat",
  "strategia-rewrite",
  "generate-document",
  "generate-pdf",
] as const;

const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("AI Edge Security G1 contract", () => {
  it.each(functionNames)("hardens %s before request processing", (name) => {
    const source = read(`supabase/functions/${name}/index.ts`);
    expect(source).toContain("preflightResponse(req)");
    expect(source).toContain("guardEdgeRequest(req");
    expect(source).toContain("parseJsonBody(req");
    expect(source).not.toContain('"Access-Control-Allow-Origin": "*"');
    expect(source).not.toMatch(/await\s+req\.json\s*\(/);
  });

  it("uses a fail-closed shared boundary", () => {
    const source = read("supabase/functions/_shared/security.ts");
    expect(source).toContain('authorization.startsWith("Bearer ")');
    expect(source).toContain("supabase.auth.getUser()");
    expect(source).toContain('rpc("consume_ai_request_quota"');
    expect(source).toContain('return fail("rate_limit_unavailable", 503)');
    expect(source).toContain('return fail("payload_too_large", 413)');
    expect(source).toContain('return fail("origin_not_allowed", 403)');
    expect(source).toContain('"Cache-Control": "no-store"');
    expect(source).not.toContain('"Access-Control-Allow-Origin", "*"');
  });

  it("keeps accepted input bounded and role-safe", () => {
    const source = read("supabase/functions/_shared/schemas.ts");
    expect(source).toContain('z.enum(["user", "assistant"])');
    expect(source).toContain(".max(4_000)");
    expect(source).toContain(".max(30)");
    expect(source).toContain(".strict()");
  });

  it("persists quota atomically behind least privilege", () => {
    const migration = read("supabase/migrations/20260623180000_ai_edge_security_g1.sql");
    expect(migration).toContain("pg_advisory_xact_lock");
    expect(migration).toContain("ON CONFLICT (user_id, scope, window_started_at)");
    expect(migration).toContain("REVOKE ALL ON public.ai_request_rate_limits FROM PUBLIC, anon, authenticated");
    expect(migration).toContain("SECURITY DEFINER");
    expect(migration).toContain("auth.uid()");
  });

  it("does not present static prompt text as governed RAG or approved evidence", () => {
    const source = read("supabase/functions/driver-dynamic/index.ts");
    expect(source).toContain("STATIC_EVIDENCE_GUIDE");
    expect(source).toContain("não substitui Source Registry");
    expect(source).not.toMatch(/RAG CANON|BASE DE CONHECIMENTO OFICIAL|100% ancorado|Validado contra Playbook 2\.0/);
    expect(source).not.toContain("evidência convergente no acervo do Playbook 2.0");
  });
});
