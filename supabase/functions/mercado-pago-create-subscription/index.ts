// Mercado Pago subscriptions — sandbox-only G1 contract.
// This function creates a pending checkout. It never grants product access;
// only a verified Mercado Pago webhook can update an entitlement.
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.25.76";

const MP_API = "https://api.mercadopago.com";
const DEFAULT_BACK_URL = "https://playbook-nr1-chagpt-sol.lovable.app/planos";
const ALLOWED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "https://id-preview--79e57053-adad-43fa-bb52-3e25ce21dbff.lovable.app",
  "https://playbook-nr1-chagpt-sol.lovable.app",
]);

const bodySchema = z.object({
  price_id: z.string().uuid(),
  organization_id: z.string().uuid(),
}).strict();

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : "",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);

  // A future live integration must use a distinct function, secret and formal
  // gate approval. This function intentionally has no production-token path.
  const accessToken = Deno.env.get("MP_ACCESS_TOKEN_TEST");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!accessToken || !supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: "configuration_unavailable" }, 503, origin);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return json({ error: "authentication_required" }, 401, origin);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return json({ error: "authentication_required" }, 401, origin);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return json({ error: "invalid_request" }, 400, origin);

  const { organization_id: organizationId, price_id: priceId } = parsed.data;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: isManager, error: managerError } = await admin.rpc("is_org_manager", {
    _user_id: userData.user.id,
    _org_id: organizationId,
  });
  if (managerError || isManager !== true) return json({ error: "forbidden" }, 403, origin);

  const { data: price, error: priceError } = await admin
    .from("mp_prices")
    .select("id, unit_amount, currency, interval, interval_count, environment, active, mp_preapproval_plan_id, mp_products!inner(code, name, active)")
    .eq("id", priceId)
    .single();
  if (priceError || !price || !price.active || price.environment !== "sandbox" || !price.mp_products?.active) {
    return json({ error: "price_unavailable" }, 404, origin);
  }
  // Associated subscription plans require a separately reviewed checkout flow
  // (including card-token handling). Never silently ignore a configured plan.
  if (price.mp_preapproval_plan_id) return json({ error: "associated_plan_not_supported" }, 409, origin);

  // Reserve first: the partial unique index prevents two browser requests from
  // calling Mercado Pago concurrently for the same organization.
  const externalReference = crypto.randomUUID();
  const { data: reservation, error: reservationError } = await admin
    .from("mp_subscriptions")
    .insert({
      organization_id: organizationId,
      price_id: priceId,
      external_reference: externalReference,
      status: "pending",
      environment: "sandbox",
      created_by: userData.user.id,
    })
    .select("id, external_reference")
    .single();
  if (reservationError || !reservation) {
    if ((reservationError as { code?: string } | null)?.code === "23505") {
      const { data: existing } = await admin
        .from("mp_subscriptions")
        .select("id, status, init_point")
        .eq("organization_id", organizationId)
        .in("status", ["pending", "authorized", "paused"])
        .maybeSingle();
      return json({ error: "subscription_already_exists", subscription_id: existing?.id }, 409, origin);
    }
    return json({ error: "reservation_failed" }, 500, origin);
  }

  const frequency = price.interval === "year" ? 12 * price.interval_count : price.interval_count;
  const mpResponse = await fetch(`${MP_API}/preapproval`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": reservation.external_reference,
    },
    body: JSON.stringify({
      reason: `Playbook NR-1 · ${price.mp_products.name}`,
      external_reference: reservation.external_reference,
      back_url: DEFAULT_BACK_URL,
      auto_recurring: {
        frequency,
        frequency_type: "months",
        transaction_amount: Number(price.unit_amount),
        currency_id: price.currency,
      },
      // No payer email, CPF, card or card token crosses this boundary.
      status: "pending",
    }),
  });
  const mpBody = await mpResponse.json().catch(() => ({}));
  if (!mpResponse.ok) {
    await admin.from("mp_subscriptions").update({ status: "rejected" }).eq("id", reservation.id);
    return json({ error: "mp_upstream_error" }, 502, origin);
  }

  const mpPreapprovalId = typeof mpBody?.id === "string" ? mpBody.id : null;
  const initPoint = typeof (mpBody?.sandbox_init_point ?? mpBody?.init_point) === "string"
    ? (mpBody.sandbox_init_point ?? mpBody.init_point)
    : null;
  if (!mpPreapprovalId || !initPoint) {
    await admin.from("mp_subscriptions").update({ status: "rejected" }).eq("id", reservation.id);
    return json({ error: "mp_invalid_response" }, 502, origin);
  }

  const { data: subscription, error: updateError } = await admin
    .from("mp_subscriptions")
    .update({ mp_preapproval_id: mpPreapprovalId, init_point: initPoint })
    .eq("id", reservation.id)
    .select("id, init_point, status")
    .single();
  if (updateError || !subscription) return json({ error: "persistence_failed" }, 500, origin);

  return json({ subscription_id: subscription.id, init_point: subscription.init_point, status: subscription.status }, 201, origin);
});
