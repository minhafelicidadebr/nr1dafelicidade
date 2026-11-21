// Mercado Pago webhook — sandbox-only.
// The browser never calls this function. It validates a signed notification,
// looks up Mercado Pago's authoritative subscription state, then derives the
// organization's entitlement from that state.
import { createClient } from "npm:@supabase/supabase-js@2";

const MP_API = "https://api.mercadopago.com";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PREAPPROVAL_TOPICS = new Set(["preapproval", "subscription_preapproval"]);

function respond(status: number, body: unknown = { ok: status < 400 }): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function verifyMpSignature(params: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string | null;
  secret: string;
}): Promise<boolean> {
  const { signatureHeader, requestId, dataId, secret } = params;
  if (!signatureHeader || !requestId || !dataId || !secret) return false;
  const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
    const [key, ...value] = part.split("=");
    return [key.trim(), value.join("=").trim()];
  }));
  const timestamp = parts.ts;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;
  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > 600) return false;
  const manifest = `id:${dataId};request-id:${requestId};ts:${timestamp};`;
  return timingSafeEqual(await hmacSha256Hex(secret, manifest), signature);
}

function mapSubscriptionStatus(value: string): "pending" | "authorized" | "paused" | "cancelled" | "expired" | "rejected" {
  switch (value.toLowerCase()) {
    case "authorized": return "authorized";
    case "paused": return "paused";
    case "cancelled":
    case "canceled": return "cancelled";
    case "expired": return "expired";
    case "rejected": return "rejected";
    default: return "pending";
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return respond(405, { error: "method_not_allowed" });

  const accessToken = Deno.env.get("MP_ACCESS_TOKEN_TEST");
  const webhookSecret = Deno.env.get("MP_WEBHOOK_SECRET_TEST");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!accessToken || !webhookSecret || !supabaseUrl || !serviceKey) {
    return respond(503, { error: "configuration_unavailable" });
  }

  const rawBody = await req.text();
  if (rawBody.length > 32_768) return respond(413, { error: "payload_too_large" });
  const payloadSha256 = await sha256Hex(rawBody);
  let body: { type?: unknown; action?: unknown; data?: { id?: unknown } } = {};
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    // Validation below treats malformed JSON as an unsigned notification.
  }

  const dataId = body.data?.id === undefined ? null : String(body.data.id);
  const requestId = req.headers.get("x-request-id");
  const topic = typeof body.type === "string"
    ? body.type
    : typeof body.action === "string" ? body.action : "unknown";
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const eventId = requestId ?? `sha:${payloadSha256}`;
  const { data: event, error: eventError } = await admin
    .from("mp_events")
    .insert({
      mp_event_id: eventId,
      event_type: topic,
      resource_type: topic,
      resource_id: dataId,
      payload_sha256: payloadSha256,
      status: "received",
      signature_valid: false,
    })
    .select("id")
    .single();
  if (eventError) {
    if ((eventError as { code?: string }).code === "23505") return respond(200, { ok: true, duplicate: true });
    return respond(500, { error: "event_persist_failed" });
  }

  const signatureValid = await verifyMpSignature({
    signatureHeader: req.headers.get("x-signature"),
    requestId,
    dataId,
    secret: webhookSecret,
  });
  if (!signatureValid) {
    await admin.from("mp_events").update({
      status: "rejected_signature",
      http_status: 401,
      error_reason: "invalid_hmac",
      processed_at: new Date().toISOString(),
    }).eq("id", event.id);
    return respond(401, { error: "invalid_signature" });
  }

  // Billing-retry policy is not formally approved. Payment-invoice topics are
  // retained as verified evidence only; entitlement changes come exclusively
  // from the authoritative subscription topic in this sandbox slice.
  if (!dataId || !PREAPPROVAL_TOPICS.has(topic)) {
    await admin.from("mp_events").update({
      status: "ignored",
      signature_valid: true,
      http_status: 200,
      processed_at: new Date().toISOString(),
    }).eq("id", event.id);
    return respond(200, { ok: true, ignored: true });
  }

  const lookup = await fetch(`${MP_API}/preapproval/${dataId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!lookup.ok) {
    await admin.from("mp_events").update({
      status: "rejected_lookup",
      signature_valid: true,
      http_status: lookup.status,
      error_reason: `mp_lookup_${lookup.status}`,
      processed_at: new Date().toISOString(),
    }).eq("id", event.id);
    return respond(502, { error: "mp_lookup_failed" });
  }

  const preapproval = await lookup.json().catch(() => ({}));
  const externalReference = typeof preapproval?.external_reference === "string" ? preapproval.external_reference : null;
  const subscriptionId = typeof preapproval?.id === "string" ? preapproval.id : dataId;
  const query = admin.from("mp_subscriptions").select("id, organization_id, price_id, environment").limit(1);
  const { data: subscription } = externalReference && UUID.test(externalReference)
    ? await query.eq("external_reference", externalReference).maybeSingle()
    : await query.eq("mp_preapproval_id", subscriptionId).maybeSingle();
  if (!subscription) {
    await admin.from("mp_events").update({
      status: "ignored",
      signature_valid: true,
      http_status: 200,
      error_reason: "subscription_not_found",
      processed_at: new Date().toISOString(),
    }).eq("id", event.id);
    return respond(200, { ok: true, unknown_subscription: true });
  }
  if (subscription.environment !== "sandbox") return respond(400, { error: "non_sandbox_subscription" });

  const status = mapSubscriptionStatus(String(preapproval?.status ?? ""));
  const nextPaymentDate = typeof preapproval?.next_payment_date === "string" ? preapproval.next_payment_date : null;
  const { error: subscriptionError } = await admin.from("mp_subscriptions").update({
    status,
    mp_preapproval_id: subscriptionId,
    current_period_end: nextPaymentDate,
    last_verified_at: new Date().toISOString(),
  }).eq("id", subscription.id);
  if (subscriptionError) return respond(500, { error: "subscription_update_failed" });

  const { data: price, error: priceError } = await admin
    .from("mp_prices")
    .select("mp_products!inner(code)")
    .eq("id", subscription.price_id)
    .single();
  const planCode = price?.mp_products?.code;
  if (priceError || !planCode) return respond(500, { error: "price_lookup_failed" });

  const { error: entitlementError } = await admin.from("mp_entitlements").upsert({
    organization_id: subscription.organization_id,
    plan_code: planCode,
    active: status === "authorized",
    valid_until: status === "authorized" ? nextPaymentDate : null,
    source_subscription_id: subscription.id,
    environment: "sandbox",
  }, { onConflict: "organization_id" });
  if (entitlementError) return respond(500, { error: "entitlement_update_failed" });

  await admin.from("mp_events").update({
    status: "processed",
    signature_valid: true,
    subscription_id: subscription.id,
    http_status: 200,
    processed_at: new Date().toISOString(),
  }).eq("id", event.id);
  return respond(200, { ok: true });
});
