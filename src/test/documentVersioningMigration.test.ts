import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");
const migration = readFileSync(
  resolve(root, "supabase/migrations/20260720120000_document_version_concurrency_g1.sql"),
  "utf8",
);
const edgeFunction = readFileSync(
  resolve(root, "supabase/functions/generate-document/index.ts"),
  "utf8",
);

describe("document versioning G1 contract", () => {
  it("fails safely instead of deleting historical duplicates", () => {
    expect(migration).toContain("document_version_duplicates_present");
    expect(migration).toContain("document_current_chain_ambiguous");
    expect(migration).toContain("CREATE UNIQUE INDEX IF NOT EXISTS documents_version_unique_idx");
    expect(migration).toContain("REVOKE INSERT, UPDATE, DELETE ON public.documents FROM authenticated");
    expect(migration).not.toMatch(/\b(?:DELETE|TRUNCATE)\s+(?:FROM\s+)?public\.documents/i);
  });

  it("allocates and supersedes versions atomically under server authorization", () => {
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.create_document_version");
    expect(migration).toContain("pg_advisory_xact_lock");
    expect(migration).toContain("FOR UPDATE");
    expect(migration).toContain("auth.uid()");
    expect(migration).toContain("public.is_org_manager(_uid, _org)");
    expect(migration).toContain("REVOKE ALL ON FUNCTION public.create_document_version");
    expect(migration).toContain("GRANT EXECUTE ON FUNCTION public.create_document_version");
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.review_document");
    expect(migration).toContain("IF _document.created_by = _uid THEN");
    expect(migration).toContain("document_author_cannot_review");
    expect(migration).toContain("REVOKE ALL ON FUNCTION public.review_document");
  });

  it("fails closed before persistence when a document source fails", () => {
    expect(edgeFunction).toContain("const dependencyErrors");
    expect(edgeFunction).toContain("document_data_unavailable");
    expect(edgeFunction).toContain('rpc("create_document_version"');
    expect(edgeFunction).not.toContain('.from("documents").insert');
    expect(edgeFunction).not.toContain("const nextVersion");
  });

  it("does not disclose a suppressed-row count", () => {
    expect(edgeFunction).toContain("const suppressed: number | null = null");
    expect(edgeFunction).toContain("a contagem não é divulgada");
    expect(edgeFunction).not.toContain("Dimensões suprimidas por k-anonimato: ${suppressed}");
  });
});
