import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { guardEdgeRequest, parseJsonBody, preflightResponse } from "../_shared/security.ts";
import { generatePdfRequestSchema } from "../_shared/schemas.ts";

serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  const guarded = await guardEdgeRequest(req, "generate-pdf", 6, 60);
  if (!guarded.ok) return guarded.response;
  const { context: edgeContext } = guarded;
  const corsHeaders = Object.fromEntries(edgeContext.headers.entries());
  const input = await parseJsonBody(req, generatePdfRequestSchema, edgeContext);
  if (!input.ok) return input.response;

  try {
    const { driverName, driverSlug, pdfType, context } = input.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const IFT_FOOTER = `
---
**Instituto Felicidade para Todos**
Impact HUB Brasília - SGAN 601, Lote H Edifício Íon, Ala Amarela
Asa Norte Brasília/DF - Brasil | Tel: (61) 3550-8779
www.felicidadeparatodos.com.br | Instagram: @felicidadeparatodosbr
© 2025 - Instituto Felicidade para Todos. Todos os direitos reservados.
`;

    let systemPrompt = "";

    if (pdfType === "technical") {
      systemPrompt = `Você é um especialista em design instrucional e bem-estar organizacional do Instituto Felicidade para Todos (IFT).

Gere um documento técnico COMPLETO de Trilha de Implementação para o driver "${driverName}" do Work Wellbeing Playbook.

ESTRUTURA OBRIGATÓRIA (mínimo 3 páginas de conteúdo denso):

# 🎯 Trilha de Implementação: ${driverName}
## Driver do Work Wellbeing Playbook

### 1. Introdução e Justificativa
- Contexto do driver no sistema de 12 drivers
- Por que este driver é crítico para o bem-estar organizacional
- Base teórica e evidências científicas (cite DOIs e URLs reais)

### 2. Diagnóstico Rápido (Checklist)
- 5-7 perguntas diagnósticas para avaliar a maturidade do driver
- Escala: Iniciante / Em Desenvolvimento / Avançado

### 3. Plano de Ação de 90 Dias
- Semana 1-4: Quick wins e sensibilização
- Semana 5-8: Implementação estrutural
- Semana 9-12: Consolidação e medição

### 4. Plano de Sustentação (12 meses)
- Rituais mensais recomendados
- KPIs e métricas de acompanhamento
- Framework de governança

### 5. Evidências Científicas
- Mínimo 5 referências acadêmicas com URLs completas
- Cite meta-análises e revisões sistemáticas quando possível

### 6. Riscos e Trade-offs
- 3-5 riscos comuns na implementação
- Estratégias de mitigação para cada risco

### 7. Recursos Complementares
- Link para o Playbook: https://worldwellbeingmovement.org/wp-content/uploads/2024/11/Work-Wellbeing-Playbook.pdf
- Dinâmicas de aprendizagem recomendadas na plataforma WWP

${IFT_FOOTER}

REGRAS:
- Linguagem técnica mas acessível
- Foco em ações práticas e mensuráveis
- Sem alucinação: só cite evidências verificáveis
- Formato Markdown rico com emojis, boxes e destaque de evidências
- Responda em português brasileiro`;
    } else {
      systemPrompt = `Você é um poeta-educador do Instituto Felicidade para Todos (IFT).

Gere um documento de Poesia Pedagógica para o driver "${driverName}" do Work Wellbeing Playbook.

ESTRUTURA OBRIGATÓRIA (mínimo 2 páginas):

# 🎭 Poesia Pedagógica: ${driverName}
## Uma reflexão poética sobre bem-estar no trabalho

### O Poema
- Crie um poema original (mínimo 4 estrofes) que capture a essência deste driver
- Inspirado nos grandes poetas (Drummond, Cora Coralina, Fernando Pessoa, Rumi)
- Tom: profundo, evocativo, esperançoso

### Leitura Guiada
- Guie o leitor verso por verso, conectando cada metáfora ao conceito científico
- Use perguntas reflexivas entre seções

### Prática Cultural e Reflexiva
- 3 exercícios de reflexão conectados ao poema
- Conexão com o contexto organizacional
- Perguntas para diário de reflexão

### Conexão com a Ciência
- Cite como o poema se conecta às evidências do driver
- Link: https://worldwellbeingmovement.org/wp-content/uploads/2024/11/Work-Wellbeing-Playbook.pdf

${IFT_FOOTER}

REGRAS:
- Poema autoral, nunca copie poemas existentes
- Linguagem lírica mas acessível
- Conecte emoção com evidência
- Formato Markdown rico
- Responda em português brasileiro`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context || `Gere o conteúdo completo para o driver ${driverName}.` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-pdf error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
