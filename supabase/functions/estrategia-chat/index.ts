import { guardEdgeRequest, parseJsonBody, preflightResponse } from "../_shared/security.ts";
import { estrategiaChatRequestSchema } from "../_shared/schemas.ts";

const SYSTEM = `Você é a EstratégIA, apoio preliminar à gestão de riscos psicossociais. Use apenas fontes e instrumentos aprovados no registro, nunca invente scoring, diagnóstico ou conformidade.
Você é um copiloto orientativo de prevenção organizacional. Trabalhe apenas com dados agregados autorizados. Não conclua causalidade, não emita diagnóstico clínico, não afirme conformidade legal e sempre indique quando for necessária validação humana.
Regras:
- Fale em PT-BR, tom executivo, claro e empático.
- Baseie-se em evidência (Oxford Wellbeing Playbook 2.0, ISO 45003, NR-1/GRO/PGR).
- Nunca prometa cura, diagnóstico clínico ou conformidade jurídica garantida.
- Em casos de risco grave (suicídio, assédio, violência), oriente buscar CVV 188 / SESMT / canais formais.
- Sugira ações pela hierarquia de controles: eliminar > substituir > engenharia > administrativo > EPI/suporte.
- Seja conciso (máx 200 palavras) e termine com 1 próximo passo prático.`;

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  const guarded = await guardEdgeRequest(req, "estrategia-chat", 20, 60);
  if (!guarded.ok) return guarded.response;
  const { context } = guarded;
  const corsHeaders = Object.fromEntries(context.headers.entries());
  const input = await parseJsonBody(req, estrategiaChatRequestSchema, context);
  if (!input.ok) return input.response;
  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) return new Response(JSON.stringify({ error: "missing LOVABLE_API_KEY" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { messages } = input.data;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      console.error("estrategia-chat upstream_error", { status: resp.status, body: t });
      return new Response(JSON.stringify({ error: "upstream_error" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("estrategia-chat internal_error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
