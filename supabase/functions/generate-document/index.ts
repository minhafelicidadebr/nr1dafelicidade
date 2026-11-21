import { guardEdgeRequest, parseJsonBody, preflightResponse } from "../_shared/security.ts";
import { generateDocumentRequestSchema } from "../_shared/schemas.ts";

const K = 5;

const DIM_LABEL: Record<string, string> = {
  demands_quant: "Exigências quantitativas",
  demands_emotional: "Exigências emocionais",
  work_pace: "Ritmo de trabalho",
  influence: "Influência no trabalho",
  meaning: "Sentido do trabalho",
  predictability: "Previsibilidade",
  recognition: "Reconhecimento",
  role_clarity: "Clareza de papel",
  leadership_quality: "Qualidade da liderança",
  social_support: "Apoio social",
  community: "Comunidade no trabalho",
  insecurity: "Insegurança laboral",
};

const OUTCOME_LABEL: Record<string, string> = {
  health_general: "Saúde geral percebida",
  work_family_conflict: "Conflito trabalho-família",
  sleep_problems: "Problemas de sono",
  burnout: "Burnout (exaustão)",
  stress: "Stress (irritação/ansiedade/tristeza)",
  offensive_behaviors: "Comportamentos ofensivos",
};

const LEVEL_LABEL: Record<string, string> = {
  elimination: "Eliminação",
  substitution: "Substituição",
  engineering: "Engenharia",
  administrative: "Administrativo",
  ppe: "EPI/Suporte",
};

Deno.serve(async (req) => {
  const preflight = preflightResponse(req);
  if (preflight) return preflight;
  const guarded = await guardEdgeRequest(req, "generate-document", 10, 60);
  if (!guarded.ok) return guarded.response;
  const { context } = guarded;
  const corsHeaders = Object.fromEntries(context.headers.entries());
  const input = await parseJsonBody(req, generateDocumentRequestSchema, context);
  if (!input.ok) return input.response;
  try {
    const { supabase } = context;
    const { cycle_id, kind } = input.data;

    const [cycleRes, scoresRes, actionsRes, outcomesRes, suggestionsRes] = await Promise.all([
      supabase.from("cycles").select("*, organizations(name, sector, size_band)").eq("id", cycle_id).single(),
      supabase.rpc("list_safe_risk_scores", { _organization_id: null, _cycle_id: cycle_id }),
      supabase.from("action_items").select("*").eq("cycle_id", cycle_id).order("created_at", { ascending: true }),
      supabase.rpc("aggregate_cycle_outcomes", { _cycle_id: cycle_id }),
      supabase.rpc("suggest_controls_for_cycle", { _cycle_id: cycle_id, _top_n: 5 }),
    ]);

    const cycle: any = cycleRes.data;
    const cycleNotFound = cycleRes.error?.code === "PGRST116" && !cycleRes.data;
    if (cycleNotFound) {
      return new Response(JSON.stringify({ error: "cycle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dependencyErrors = [
      { name: "cycle", error: cycleRes.error },
      { name: "safe_scores", error: scoresRes.error },
      { name: "actions", error: actionsRes.error },
      { name: "outcomes", error: outcomesRes.error },
      { name: "suggestions", error: suggestionsRes.error },
    ].filter(({ error }) => error);
    if (dependencyErrors.length > 0) {
      console.error("generate-document dependency_error", dependencyErrors.map(({ name, error }) => ({
        name,
        code: error?.code ?? "unknown",
      })));
      return new Response(JSON.stringify({ error: "document_data_unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!cycle) return new Response(JSON.stringify({ error: "cycle not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (cycle.status !== "closed") return new Response(JSON.stringify({ error: "cycle must be closed before document generation" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const orgName = cycle.organizations?.name ?? "Organização";
    const sector = cycle.organizations?.sector ?? "—";
    const sizeBand = cycle.organizations?.size_band ?? "—";
    const today = new Date().toLocaleDateString("pt-BR");
    const visible = (scoresRes.data ?? []) as any[];
    const suppressed: number | null = null; // the safe RPC intentionally does not disclose suppressed-row counts
    const actions = (actionsRes.data ?? []) as any[];
    const outcomes = ((outcomesRes.data ?? []) as any[]).filter((o) => (o.n_responses ?? 0) >= K);
    const suggestions = (suggestionsRes.data ?? []) as any[];
    const totalN = visible.reduce((m, s) => Math.max(m, s.n_responses ?? 0), 0);
    const criteriaVersion = visible[0]?.criteria_version ?? "—";

    const dimLine = (s: any) =>
      `| ${DIM_LABEL[s.dimension] ?? s.dimension} | ${s.mean_score ?? "—"} | ${s.unfavorable_percentage != null ? `${Number(s.unfavorable_percentage).toFixed(0)}%` : "—"} | ${s.severity} | ${s.probability} | **${s.risk_level}** | ${s.n_responses} |`;

    let title = "";
    let markdown = "";

    if (kind === "drps") {
      title = `DRPS preliminar — ${cycle.name}`;
      const dimTable = visible.length === 0
        ? `_Nenhuma dimensão atingiu o limiar de k-anonimato (${K}). Aumente a adesão antes de divulgar resultados._`
        : `| Dimensão | Média (0–100) | % Desfav. | Sev | Prob | Risco | n |\n|---|---:|---:|---:|---:|---:|---:|\n${visible.map(dimLine).join("\n")}`;

      const outcomeTable = outcomes.length === 0
        ? `_Sem indicadores de desfecho com k ≥ ${K}._`
        : `| Indicador | Média (0–100) | n |\n|---|---:|---:|\n${outcomes.map((o: any) => `| ${OUTCOME_LABEL[o.outcome] ?? o.outcome} | ${Number(o.mean_score).toFixed(0)} | ${o.n_responses} |`).join("\n")}`;

      const suggestBlock = suggestions.length === 0
        ? `_Sem dimensões críticas elegíveis para sugestão automatizada._`
        : suggestions.map((s: any, i: number) =>
            `**${i + 1}. ${s.control_title}** _(${LEVEL_LABEL[s.control_level] ?? s.control_level} · evidência ${s.evidence_strength})_\n  · Dimensão: ${DIM_LABEL[s.dimension] ?? s.dimension} · Risco ${s.risk_level} · n=${s.n_responses}\n  · ${s.control_description}`,
          ).join("\n\n");

      markdown = [
        `# Documento de Riscos Psicossociais (preliminar)`,
        ``,
        `**Organização:** ${orgName}  `,
        `**Setor:** ${sector} · **Porte:** ${sizeBand}  `,
        `**Ciclo:** ${cycle.name} · **Horizonte:** ${cycle.horizon}  `,
        `**Gerado em:** ${today}  `,
        `**Amostra máxima por dimensão (n):** ${totalN}  `,
        `**Versão dos critérios AIHA:** \`${criteriaVersion}\``,
        ``,
        `---`,
        ``,
        `## 1. Metodologia`,
        ``,
        `Instrumento e scoring devem ser identificados pela versão aprovada no Instrument Registry. Este documento é preliminar e não pode ser gerado enquanto fonte, licença, fórmula, limitações e revisão técnica não estiverem comprovadas.`,
        ``,
        `**Matriz AIHA 5×5 (Severidade × Probabilidade):** probabilidade derivada do percentual de respostas desfavoráveis (≥60/100) — 1 (<20%), 2 (20–39%), 3 (40–59%), 4 (60–79%), 5 (≥80%); severidade baseada na magnitude potencial de agravo por dimensão (catálogo institucional, ajustável pelo responsável técnico). **Risco = Sev × Prob**.`,
        ``,
        `**Privacidade:** agregação com k-anonimato ≥ ${K}. Dimensões com menos de ${K} respostas são suprimidas deste documento.`,
        `A contagem de dimensões suprimidas não é divulgada pelo contrato de privacidade.`,
        ``,
        `## 2. Resultados por dimensão`,
        ``,
        dimTable,
        ``,
        `> Algumas dimensões podem estar suprimidas por amostra abaixo do k-anonimato; a contagem não é divulgada.`,
        ``,
        `## 3. Indicadores de desfecho (sinalização clínica)`,
        ``,
        outcomeTable,
        ``,
        `## 4. Controles recomendados (sugestão automatizada)`,
        ``,
        `Cruzamento das dimensões críticas do ciclo com o catálogo institucional de controles, ordenado pela hierarquia de prevenção (eliminação → substituição → engenharia → administrativo → EPI/suporte).`,
        ``,
        suggestBlock,
        ``,
        `## 5. Limitações`,
        ``,
        `Documento **preliminar**. Não substitui análise por SST/SESMT habilitado, não constitui diagnóstico clínico nem garantia de conformidade legal isolada. Recomenda-se revisão pela CIPA e integração ao PGR/GRO.`,
        ``,
        `## 6. Próximos passos`,
        ``,
        `1. Revisão técnica pelo SESMT.\n2. Validação participativa (CIPA / comissões internas).\n3. Adoção de controles priorizados na hierarquia de prevenção.\n4. Reavaliação após o horizonte definido (${cycle.horizon}).`,
      ].join("\n");
    } else if (kind === "action_plan") {
      title = `Plano de Ação — ${cycle.name}`;
      markdown = [
        `# Plano de Ação NR-1 / ISO 45003`,
        ``,
        `**Organização:** ${orgName} · **Ciclo:** ${cycle.name}  `,
        `**Gerado em:** ${today}`,
        ``,
        `> Ações derivadas apenas de recortes com k-anonimato ≥ ${K}.`,
        ``,
        `## Ações (${actions.length})`,
        ``,
        actions.length === 0 ? `_Nenhuma ação registrada._` : actions.map((a: any, i: number) =>
          `### ${i + 1}. ${a.title}\n- **Nível:** ${LEVEL_LABEL[a.level] ?? a.level}\n- **Dimensão:** ${DIM_LABEL[a.dimension] ?? a.dimension ?? "—"}\n- **Driver:** ${a.driver_slug ?? "—"}\n- **Status:** ${a.status}\n- **Prazo:** ${a.due_date ?? "—"}\n\n${a.description ?? ""}`,
        ).join("\n\n"),
        ``,
        `## Hierarquia de controles`,
        ``,
        `1. Eliminação → 2. Substituição → 3. Engenharia → 4. Administrativo → 5. EPI/Suporte`,
      ].join("\n");
    } else {
      title = `Resumo Executivo — ${cycle.name}`;
      const high = visible.filter((s: any) => s.risk_level >= 15);
      const offensive = outcomes.find((o: any) => o.outcome === "offensive_behaviors");
      markdown = [
        `# Resumo Executivo`,
        ``,
        `**${orgName}** — ${cycle.name} · ${today}`,
        ``,
        `## Panorama`,
        `- Dimensões avaliadas (k ≥ ${K}): **${visible.length}**`,
        `- Dimensões suprimidas por k-anonimato: não divulgadas pelo contrato de privacidade`,
        `- Riscos altos (≥ 15): **${high.length}**`,
        `- Ações planejadas: ${actions.length}`,
        offensive ? `- Sinal de comportamentos ofensivos: **${Number(offensive.mean_score).toFixed(0)}/100** (n=${offensive.n_responses})` : ``,
        ``,
        `## Top 5 riscos`,
        high.slice(0, 5).map((s: any) => `- **${DIM_LABEL[s.dimension] ?? s.dimension}** — risco ${s.risk_level} (n=${s.n_responses})`).join("\n") || "_Sem riscos altos no recorte visível._",
        ``,
        `## Sugestões prioritárias`,
        suggestions.slice(0, 3).map((s: any, i: number) => `${i + 1}. **${s.control_title}** — ${LEVEL_LABEL[s.control_level] ?? s.control_level} (${DIM_LABEL[s.dimension] ?? s.dimension})`).join("\n") || "_Sem sugestões automáticas neste ciclo._",
        ``,
        `## Recomendação`,
        `Priorizar intervenções nas dimensões de maior risco aplicando a hierarquia de controles. Aumentar adesão nas unidades com amostra insuficiente. Revisão obrigatória por SST/SESMT.`,
      ].join("\n");
    }

    const payload = {
      markdown,
      meta: {
        org_name: orgName, sector, size_band: sizeBand,
        cycle_name: cycle.name, horizon: cycle.horizon,
        generated_at: new Date().toISOString(),
        criteria_version: criteriaVersion,
        k_anonymity: K,
        total_n: totalN,
        version: null,
        supersedes: null,
      },
      data: { visible, suppressed, outcomes, suggestions, actions_count: actions.length },
    };

    // Versionamento, hash e sucessão são atômicos no RPC protegido por lock transacional.
    const { data: documentResponse, error: documentError } = await supabase.rpc("create_document_version", {
      _cycle_id: cycle_id,
      _kind: kind,
      _title: title,
      _content: payload,
    });
    const doc = Array.isArray(documentResponse) ? documentResponse[0] : documentResponse;
    if (documentError || !doc) {
      console.error("generate-document persistence_error", {
        code: documentError?.code ?? "empty_result",
      });
      return new Response(JSON.stringify({ error: "document_persistence_failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ document: doc }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-document internal_error", e);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
