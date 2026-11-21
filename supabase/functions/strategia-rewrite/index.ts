// Sra. EstratégIA — Rewriter V2
// Reescreve uma resposta determinística em tom natural, SEM inventar dados.
// Recebe: { question, answer: { summary[], whatDataShows[], whyMatters, nextAction, ... } }
// Retorna: { summary: string, whyMatters: string, model: string }

import { guardEdgeRequest, parseJsonBody, preflightResponse } from "../_shared/security.ts";
import { estrategiaRewriteRequestSchema } from "../_shared/schemas.ts";

const SYSTEM = `Você é a Sra. EstratégIA, assistente de apoio à gestão de riscos psicossociais e NR-1.
TAREFA: REESCREVER uma resposta técnica já validada em tom natural, executivo e empático em PT-BR.
REGRAS ABSOLUTAS:
- NUNCA invente fatos, números, dimensões, drivers, valores R, S, P, n, bandas ou rótulos.
- Use SOMENTE o conteúdo do JSON fornecido. Pode parafrasear; não pode adicionar dados.
- Não cite fontes que não estejam no JSON. Não prometa cura/diagnóstico/conformidade jurídica.
- Tom: claro, breve, decisório, sem jargão excessivo.
- Saída ESTRITAMENTE em JSON: {"summary": string, "whyMatters": string}.
- "summary": 2–4 frases curtas, fluidas, parafraseando os pontos do "summary" + sinalizando a próxima ação.
- "whyMatters": 1–2 frases conectando o achado à decisão de gestão.
- Não inclua tabelas, listas, markdown, emojis.`;

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  const guarded = await guardEdgeRequest(req, "strategia-rewrite", 20, 60);
  if (!guarded.ok) return guarded.response;
  const { context } = guarded;
  const corsHeaders = Object.fromEntries(context.headers.entries());
  const input = await parseJsonBody(req, estrategiaRewriteRequestSchema, context);
  if (!input.ok) return input.response;
  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "missing LOVABLE_API_KEY" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { question, answer } = input.data;

    const userPayload = {
      pergunta_do_usuario: question ?? "",
      resposta_estruturada: {
        summary: answer.summary ?? [],
        whatDataShows: answer.whatDataShows ?? [],
        whyMatters: answer.whyMatters ?? "",
        nextAction: answer.nextAction ?? "",
      },
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: JSON.stringify(userPayload) },
        ],
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limit" }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "credits_exhausted" }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error("strategia-rewrite upstream_error", { status: resp.status, body: t });
      return new Response(JSON.stringify({ error: "upstream_error" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    const whyMatters = typeof parsed.whyMatters === "string" ? parsed.whyMatters.trim() : "";

    if (!summary) {
      return new Response(JSON.stringify({ error: "empty_rewrite" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ summary, whyMatters, model: "google/gemini-2.5-flash" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("strategia-rewrite internal_error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
