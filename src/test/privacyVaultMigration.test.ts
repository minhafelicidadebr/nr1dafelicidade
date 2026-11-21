import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const migration = readFileSync(
  resolve(root, "supabase/migrations/20260623013000_privacy_vault_g1.sql"),
  "utf8",
);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

describe("Privacy Vault migration contract", () => {
  it.each(["responses", "risk_scores", "risk_scores_history", "invitations"])(
    "revokes direct organizational access to %s",
    (table) => {
      expect(migration).toContain(`REVOKE ALL ON public.${table} FROM PUBLIC, anon, authenticated;`);
    },
  );

  it("removes deterministic invitation correlation from responses", () => {
    expect(migration).toContain("ALTER TABLE public.responses DROP COLUMN IF EXISTS invitation_hash;");
    const currentSubmit = migration.slice(migration.indexOf("CREATE OR REPLACE FUNCTION public.submit_response"));
    expect(currentSubmit).not.toContain("digest(_token");
    expect(currentSubmit).not.toContain("invitation_hash");
  });

  it("defines server-side suppression and safe read contracts", () => {
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.get_cycle_privacy_summary");
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.list_safe_risk_scores");
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.list_safe_risk_history");
    expect(migration).toMatch(/HAVING COUNT\(\*\) >= _k/g);
    expect(migration).toContain("AND c.status = 'closed'");
  });

  it("qualifies columns that collide with RPC output names", () => {
    expect(migration).toContain("SELECT p.version, p.k_min INTO _version, _k");
    expect(migration).toContain("SELECT scoped_cycle.organization_id INTO _org");
    expect(migration).not.toContain("SELECT version, k_min INTO _version, _k");
    expect(migration).not.toContain("SELECT organization_id INTO _org FROM public.cycles");
  });

  it("prevents authorization probing and campaign differencing", () => {
    expect(migration).toContain("_user_id = auth.uid()");
    expect(migration).toContain("closed_cycle_is_immutable");
    expect(migration).toContain("cycles_privacy_lifecycle");
    expect(migration).toContain("new_cycle_must_start_as_draft");
  });

  it("contains no direct sensitive-table query in frontend or Edge Functions", () => {
    const files = [resolve(root, "src"), resolve(root, "supabase/functions")]
      .flatMap(sourceFiles)
      .filter((file) => !file.endsWith("types.ts") && !file.includes("privacyVaultMigration.test.ts"));
    const forbidden = /\.from\(["'](?:responses|risk_scores|risk_scores_history|invitations)["']/;
    const violations = files.filter((file) => forbidden.test(readFileSync(file, "utf8")));
    expect(violations).toEqual([]);
  });

  it("generates documents through the safe score RPC", () => {
    const edgeFunction = readFileSync(resolve(root, "supabase/functions/generate-document/index.ts"), "utf8");
    expect(edgeFunction).toContain('rpc("list_safe_risk_scores"');
    expect(edgeFunction).not.toContain('.from("risk_scores")');
  });
});
