import { guardEdgeRequest, jsonResponse, parseJsonBody, preflightResponse } from "../_shared/security.ts";
import { nexoDriverRecommendationsRequestSchema } from "../_shared/schemas.ts";

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;

  const guarded = await guardEdgeRequest(req, "nexo-driver-recommendations", 20, 60);
  if (!guarded.ok) return guarded.response;

  const { context } = guarded;
  const input = await parseJsonBody(req, nexoDriverRecommendationsRequestSchema, context);
  if (!input.ok) return input.response;

  const { supabase, traceId } = context;
  const { cycle_id, scope_type, scope_id } = input.data;
  const normalizedScopeId = scope_id ?? cycle_id;

  if (scope_type !== "cycle" || normalizedScopeId !== cycle_id) {
    return jsonResponse(req, traceId, {
      error: "unsupported_scope",
      trace_id: traceId,
    }, 400);
  }

  const { data, error } = await supabase.rpc("generate_driver_recommendations", {
    _cycle_id: cycle_id,
    _scope_type: scope_type,
    _scope_id: normalizedScopeId,
  });

  if (error) {
    return jsonResponse(req, traceId, {
      error: "nexo_recommendation_unavailable",
      trace_id: traceId,
    }, 503);
  }

  return jsonResponse(req, traceId, data);
});
