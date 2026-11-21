import { createClient, type SupabaseClient, type User } from "npm:@supabase/supabase-js@2";
import type { ZodType } from "npm:zod@3.25.76";

const LOCAL_ORIGINS = ["http://localhost:8080", "http://127.0.0.1:8080"];
const MAX_BODY_BYTES = 65_536;

export interface EdgeContext {
  supabase: SupabaseClient;
  user: User;
  traceId: string;
  headers: Headers;
}

export type GuardResult =
  | { ok: true; context: EdgeContext }
  | { ok: false; response: Response };

const allowedOrigins = () => new Set(
  (Deno.env.get("AI_ALLOWED_ORIGINS") ?? LOCAL_ORIGINS.join(","))
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

const responseHeaders = (req: Request, traceId: string) => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Trace-Id": traceId,
    Vary: "Origin",
  });
  const origin = req.headers.get("Origin");
  if (origin && allowedOrigins().has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Max-Age", "600");
  }
  return headers;
};

export const jsonResponse = (
  req: Request,
  traceId: string,
  body: unknown,
  status = 200,
  extraHeaders?: HeadersInit,
) => {
  const headers = responseHeaders(req, traceId);
  if (extraHeaders) new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  return new Response(JSON.stringify(body), { status, headers });
};

export const preflightResponse = (req: Request): Response | null => {
  if (req.method !== "OPTIONS") return null;
  const traceId = crypto.randomUUID();
  const origin = req.headers.get("Origin");
  if (!origin || !allowedOrigins().has(origin)) {
    return jsonResponse(req, traceId, { error: "origin_not_allowed", trace_id: traceId }, 403);
  }
  return new Response(null, { status: 204, headers: responseHeaders(req, traceId) });
};

export async function guardEdgeRequest(
  req: Request,
  scope: string,
  limit = 20,
  windowSeconds = 60,
): Promise<GuardResult> {
  const traceId = crypto.randomUUID();
  const headers = responseHeaders(req, traceId);
  const fail = (error: string, status: number) => ({
    ok: false as const,
    response: new Response(JSON.stringify({ error, trace_id: traceId }), { status, headers }),
  });

  if (req.method !== "POST") return fail("method_not_allowed", 405);
  const origin = req.headers.get("Origin");
  if (origin && !allowedOrigins().has(origin)) return fail("origin_not_allowed", 403);

  const contentType = req.headers.get("Content-Type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) return fail("content_type_required", 415);
  const contentLength = Number(req.headers.get("Content-Length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return fail("payload_too_large", 413);

  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return fail("authentication_required", 401);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) return fail("security_configuration_unavailable", 503);

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return fail("authentication_required", 401);

  const { data: quota, error: quotaError } = await supabase
    .rpc("consume_ai_request_quota", {
      _scope: scope,
      _limit: limit,
      _window_seconds: windowSeconds,
    })
    .single();
  if (quotaError || !quota) return fail("rate_limit_unavailable", 503);
  if (!quota.allowed) {
    headers.set("Retry-After", String(Math.max(1, Math.ceil((new Date(quota.reset_at).getTime() - Date.now()) / 1000))));
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "rate_limit", trace_id: traceId }), {
        status: 429,
        headers,
      }),
    };
  }

  headers.set("X-RateLimit-Remaining", String(quota.remaining));
  return { ok: true, context: { supabase, user, traceId, headers } };
}

export async function parseJsonBody<T>(
  req: Request,
  schema: ZodType<T>,
  context: EdgeContext,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  let body: unknown;
  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
      return { ok: false, response: jsonResponse(req, context.traceId, { error: "payload_too_large", trace_id: context.traceId }, 413) };
    }
    body = JSON.parse(text);
  } catch {
    return { ok: false, response: jsonResponse(req, context.traceId, { error: "invalid_json", trace_id: context.traceId }, 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonResponse(req, context.traceId, {
        error: "invalid_request",
        trace_id: context.traceId,
        issues: parsed.error.issues.map(({ path, code }) => ({ path: path.join("."), code })),
      }, 400),
    };
  }
  return { ok: true, data: parsed.data };
}

