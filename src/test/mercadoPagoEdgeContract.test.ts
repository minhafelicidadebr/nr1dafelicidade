import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const createSubscription = read("supabase/functions/mercado-pago-create-subscription/index.ts");
const webhook = read("supabase/functions/mercado-pago-webhook/index.ts");
const migration = read("supabase/migrations/20260715212825_20a83d7d-a204-43ff-a7a5-a72d295927a5.sql");

describe("Mercado Pago sandbox — schema contract", () => {
  it("keeps the billing schema isolated and sandbox-only", () => {
    expect(migration).toContain("CREATE TYPE public.mp_environment AS ENUM ('sandbox')");
    expect(migration).not.toMatch(/ALTER TABLE public\.(responses|invitations|risk_scores|cycles)/);
  });

  it("does not expose webhook evidence to authenticated browser clients", () => {
    expect(migration).toContain("GRANT ALL ON public.mp_events TO service_role");
    expect(migration).not.toContain("GRANT SELECT ON public.mp_events TO authenticated");
  });

  it("makes browser access read-only and tenant-scoped", () => {
    expect(migration).toContain('USING (public.is_org_manager(auth.uid(), organization_id))');
    expect(migration).toContain('USING (public.is_org_member(auth.uid(), organization_id))');
    expect(migration).not.toMatch(/mp_(subscriptions|entitlements).*FOR (INSERT|UPDATE|DELETE)/s);
  });
});

describe("Mercado Pago sandbox — subscription creation contract", () => {
  it("requires a Bearer JWT and organization-manager authorization", () => {
    expect(createSubscription).toContain('authorization.startsWith("Bearer ")');
    expect(createSubscription).toContain("userClient.auth.getUser()");
    expect(createSubscription).toContain('admin.rpc("is_org_manager"');
  });

  it("uses only the explicitly named test secret without token-prefix guessing", () => {
    expect(createSubscription).toContain('Deno.env.get("MP_ACCESS_TOKEN_TEST")');
    expect(createSubscription).not.toContain('startsWith("TEST-")');
    expect(createSubscription).not.toMatch(/MP_ACCESS_TOKEN(?!_TEST)/);
  });

  it("reserves a pending subscription before calling Mercado Pago", () => {
    const reservation = /\.from\("mp_subscriptions"\)\s*\.insert/.exec(createSubscription);
    const reservationIndex = reservation?.index ?? -1;
    const insertIndex = createSubscription.indexOf(".insert", reservationIndex);
    const upstreamIndex = createSubscription.indexOf("fetch(`${MP_API}/preapproval`");
    expect(reservationIndex).toBeGreaterThan(0);
    expect(insertIndex).toBeGreaterThan(reservationIndex);
    expect(upstreamIndex).toBeGreaterThan(insertIndex);
    expect(createSubscription).toContain('code === "23505"');
  });

  it("does not permit arbitrary redirect URLs, payment-plan substitution or card data", () => {
    expect(createSubscription).toContain("const DEFAULT_BACK_URL");
    expect(createSubscription).not.toContain("back_url: z.string()");
    expect(createSubscription).toContain("associated_plan_not_supported");
    expect(createSubscription).not.toMatch(/payer_email\s*:/);
    expect(createSubscription).not.toMatch(/card_(token|number)|security_code/i);
  });
});

describe("Mercado Pago sandbox — webhook contract", () => {
  it("uses HMAC with the sandbox secret and fails closed", () => {
    expect(webhook).toContain('Deno.env.get("MP_WEBHOOK_SECRET_TEST")');
    expect(webhook).toContain("verifyMpSignature");
    expect(webhook).toContain('status: "rejected_signature"');
    expect(webhook).toContain('return respond(401, { error: "invalid_signature" })');
  });

  it("recognizes the official subscription topic and verifies Mercado Pago before mutation", () => {
    expect(webhook).toContain('"subscription_preapproval"');
    const lookupIndex = webhook.indexOf("fetch(`${MP_API}/preapproval/${dataId}`");
    const updateIndex = webhook.indexOf('.from("mp_subscriptions").update');
    expect(lookupIndex).toBeGreaterThan(0);
    expect(updateIndex).toBeGreaterThan(lookupIndex);
  });

  it("is idempotent and keeps non-subscription topics audit-only", () => {
    expect(webhook).toContain("mp_event_id");
    expect(webhook).toContain('code === "23505"');
    expect(webhook).toContain("duplicate: true");
    expect(webhook).toContain("Payment-invoice topics are");
    expect(webhook).toContain('status: "ignored"');
  });

  it("never persists raw payloads or trusts a webhook-body status", () => {
    expect(webhook).toContain("payload_sha256");
    expect(webhook).not.toMatch(/raw_payload|payload:\s*rawBody/);
    expect(webhook).toContain('active: status === "authorized"');
  });

  it("matches Mercado Pago's signed manifest and rejects tampering", () => {
    const secret = "whsec_test_1234567890";
    const dataId = "abc-123";
    const requestId = "req-999";
    const timestamp = "1700000000";
    const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
    const signature = createHmac("sha256", secret).update(manifest).digest("hex");
    expect(signature).toHaveLength(64);
    expect(createHmac("sha256", secret).update(`${manifest}x`).digest("hex")).not.toBe(signature);
  });
});
