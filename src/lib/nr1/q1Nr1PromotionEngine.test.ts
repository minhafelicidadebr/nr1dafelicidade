import { describe, expect, it } from "vitest";
import {
  buildUnitMobilizationSummary,
  classifyActionNature,
  evaluateMte13Factors,
  exportUnitMobilizationCsv,
  extractProtectiveFactors,
  resolveActionExecutionSheet,
} from "./q1Nr1PromotionEngine";

describe("q1Nr1PromotionEngine", () => {
  it("classifies actions into causal, atenuante, or protecao based on hierarchy and intent", () => {
    const causal = classifyActionNature({
      level: "engineering",
      title: "Redesenhar janelas de pico e pausas",
    });
    expect(causal.kind).toBe("causal");

    const atenuante = classifyActionNature({
      level: "ppe",
      title: "Programa de apoio psicológico PAE",
    });
    expect(atenuante.kind).toBe("atenuante");

    const protecao = classifyActionNature({
      level: "administrative",
      title: "Manter fator de proteção de autonomia",
    });
    expect(protecao.kind).toBe("protecao");
  });

  it("resolves practical 4-step execution sheets for dimensions and drivers", () => {
    const workloadSheet = resolveActionExecutionSheet({ dimension: "quantitative_demands" });
    expect(workloadSheet.driverSlug).toBe("workload-absorbers");
    expect(workloadSheet.steps).toHaveLength(4);

    const stabilitySheet = resolveActionExecutionSheet({ driverSlug: "safety-stability" });
    expect(stabilitySheet.dimensionKey).toBe("predictability");
    expect(stabilitySheet.steps).toHaveLength(4);
  });

  it("evaluates the 13 MTE psychosocial factors enforcing k >= 5 privacy", () => {
    const scores = [
      { dimension: "quantitative_demands", risk_level: 16, mean_score: 74, n_responses: 12 },
      { dimension: "predictability", risk_level: 12, mean_score: 58, n_responses: 12 },
      { dimension: "social_community_at_work", risk_level: 4, mean_score: 82, n_responses: 12 },
      // Below k=5 must be ignored and never trigger factor status
      { dimension: "offensive_behaviors", risk_level: 20, mean_score: 88, n_responses: 3 },
    ];

    const mte = evaluateMte13Factors(scores);
    expect(mte).toHaveLength(13);

    const overload = mte.find((item) => item.spec.code === "MTE-01");
    expect(overload?.status).toBe("prioritario");

    const change = mte.find((item) => item.spec.code === "MTE-02");
    expect(change?.status).toBe("atencao");

    const relations = mte.find((item) => item.spec.code === "MTE-11");
    expect(relations?.status).toBe("protecao_ativa");

    const harassment = mte.find((item) => item.spec.code === "MTE-08");
    expect(harassment?.status).toBe("sem_amostra");
  });

  it("extracts protective factors only from k >= 5 low-risk dimensions", () => {
    const protective = extractProtectiveFactors([
      { dimension: "social_community_at_work", risk_level: 4, mean_score: 84, n_responses: 10 },
      { dimension: "meaning_of_work", risk_level: 6, mean_score: 79, n_responses: 3 }, // suppressed (n < 5)
      { dimension: "quantitative_demands", risk_level: 16, mean_score: 75, n_responses: 10 },
    ]);

    expect(protective).toHaveLength(1);
    expect(protective[0].dimension).toBe("social_community_at_work");
  });

  it("flags units with headcount < 5 for GHE grouping before collection", () => {
    const summary = buildUnitMobilizationSummary([
      { id: "u1", name: "Operações", sector: "Atendimento", headcount: 28 },
      { id: "u2", name: "Diretoria", sector: "Executivo", headcount: 3 },
    ]);

    expect(summary[0].unitName).toBe("Diretoria");
    expect(summary[0].requiresGroupingWarning).toBe(true);
    expect(summary[0].mobilizationStatus).toBe("agrupar_ghe");

    expect(summary[1].unitName).toBe("Operações");
    expect(summary[1].mobilizationStatus).toBe("elegivel_k5");

    const csv = exportUnitMobilizationCsv(summary, "Empresa Demo");
    expect(csv).toContain("Organizacao;Unidade_GHE;Setor;Quadro_Declarado");
    expect(csv).toContain("Diretoria");
  });
});
