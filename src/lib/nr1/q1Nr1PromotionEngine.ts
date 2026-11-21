import {
  ACTION_NATURE_META,
  MTE_13_PSYCHOSOCIAL_FACTORS,
  Q1_ACTION_EXECUTION_SHEETS,
  type ActionExecutionSheet,
  type ActionNatureKind,
  type MtePsychosocialFactorSpec,
} from "@/data/q1Nr1PromotionCatalog";
import { K_ANONYMITY_MIN, canDisplayAggregate } from "@/lib/privacy";

export type ScoreInputForQ1 = {
  dimension: string;
  risk_level: number;
  severity?: number | null;
  probability?: number | null;
  mean_score?: number | null;
  n_responses: number;
};

export type EvaluatedMteFactor = {
  spec: MtePsychosocialFactorSpec;
  factor: MtePsychosocialFactorSpec & { copsoqDimensions: string[] };
  status: "prioritario" | "atencao" | "protecao_ativa" | "sem_amostra";
  statusLabel: string;
  maxRiskLevel: number;
  highestRiskLevel: number | null;
  matchedDimensions: Array<{
    dimension: string;
    riskLevel: number;
    meanScore: number | null;
  }>;
};

export type ProtectiveFactorSummary = {
  dimension: string;
  riskLevel: number;
  meanScore: number | null;
  nResponses: number;
  driverSlug: string;
  driverLabel: string;
  recommendation: string;
};

export type UnitMobilizationRow = {
  unitId: string;
  unitName: string;
  sector: string;
  headcount: number;
  kMin: number;
  requiresGroupingWarning: boolean;
  mobilizationStatus: "elegivel_k5" | "agrupar_ghe" | "mobilizar_equipe";
  mobilizationLabel: string;
  guidance: string;
};

export function classifyActionNature(input: {
  level?: string | null;
  status?: string | null;
  title?: string | null;
  dimension?: string | null;
  riskLevel?: number | null;
}): {
  kind: ActionNatureKind;
  label: string;
  shortLabel: string;
  description: string;
  rationale: string;
  pillClass: string;
  badgeClass: string;
} {
  const titleLower = (input.title ?? "").toLowerCase();
  const levelLower = (input.level ?? "").toLowerCase();

  let kind: ActionNatureKind;

  if (
    titleLower.includes("manter") ||
    titleLower.includes("proteção") ||
    titleLower.includes("protecao") ||
    titleLower.includes("monitorar fator") ||
    (input.riskLevel != null && input.riskLevel > 0 && input.riskLevel <= 4 && levelLower !== "ppe")
  ) {
    kind = "protecao";
  } else if (
    levelLower === "ppe" ||
    titleLower.includes("acolhimento") ||
    titleLower.includes("pae") ||
    titleLower.includes("eap") ||
    titleLower.includes("apoio psicológico") ||
    titleLower.includes("apoio psicologico") ||
    titleLower.includes("mindfulness") ||
    titleLower.includes("ginástica")
  ) {
    kind = "atenuante";
  } else {
    kind = "causal";
  }

  const meta = ACTION_NATURE_META[kind];
  return {
    kind,
    ...meta,
    rationale: meta.description,
    badgeClass: meta.pillClass,
  };
}

const SHEET_DIMENSION_ALIASES: Record<string, string> = {
  workload: "quantitative_demands",
  workload_pressures: "quantitative_demands",
  demands_quant: "quantitative_demands",
  work_pace: "quantitative_demands",
  job_security: "predictability",
  job_insecurity: "predictability",
  insecurity: "predictability",
  support: "leadership_quality",
  social_support: "leadership_quality",
  management: "leadership_quality",
  offensive_behaviours: "offensive_behaviors",
  autonomy: "influence_at_work",
  influence: "influence_at_work",
  emotional_demands: "burnout",
  demands_emotional: "burnout",
};

export function resolveActionExecutionSheet(input: {
  dimension?: string | null;
  driverSlug?: string | null;
  level?: string | null;
  title?: string | null;
  riskLevel?: number | null;
}): ActionExecutionSheet {
  const normalizedDim = input.dimension
    ? (SHEET_DIMENSION_ALIASES[input.dimension] ?? input.dimension)
    : undefined;
  const byDim = normalizedDim
    ? Q1_ACTION_EXECUTION_SHEETS.find(
        (sheet) => sheet.dimensionKey === input.dimension || sheet.dimensionKey === normalizedDim,
      )
    : undefined;
  if (byDim) return byDim;

  const byDriver = input.driverSlug
    ? Q1_ACTION_EXECUTION_SHEETS.find((sheet) => sheet.driverSlug === input.driverSlug)
    : undefined;
  if (byDriver) return byDriver;

  const nature = classifyActionNature(input);
  if (nature.kind === "atenuante") {
    return Q1_ACTION_EXECUTION_SHEETS.find((s) => s.nature === "atenuante") ?? Q1_ACTION_EXECUTION_SHEETS[0];
  }
  if (nature.kind === "protecao") {
    return Q1_ACTION_EXECUTION_SHEETS.find((s) => s.nature === "protecao") ?? Q1_ACTION_EXECUTION_SHEETS[0];
  }
  return Q1_ACTION_EXECUTION_SHEETS[0];
}

export function evaluateMte13Factors(scores: ScoreInputForQ1[]): EvaluatedMteFactor[] {
  const eligible = scores.filter((s) => canDisplayAggregate(s.n_responses));
  const byDimension = new Map(eligible.map((s) => [s.dimension, s]));

  return MTE_13_PSYCHOSOCIAL_FACTORS.map((spec) => {
    const factor = {
      ...spec,
      copsoqDimensions: spec.relatedDimensions.slice(0, 3),
    };
    const matched = spec.relatedDimensions
      .map((dim) => byDimension.get(dim))
      .filter((item): item is ScoreInputForQ1 => Boolean(item))
      .map((item) => ({
        dimension: item.dimension,
        riskLevel: item.risk_level,
        meanScore: item.mean_score ?? null,
      }));

    if (matched.length === 0) {
      return {
        spec,
        factor,
        status: "sem_amostra",
        statusLabel: "Monitoramento padrão (sem sinal crítico na amostra k>=5)",
        maxRiskLevel: 0,
        highestRiskLevel: null,
        matchedDimensions: [],
      };
    }

    const maxRisk = Math.max(...matched.map((m) => m.riskLevel));
    if (maxRisk >= 15) {
      return {
        spec,
        factor,
        status: "prioritario",
        statusLabel: "Fator Prioritário · Exige Ação Causal no PGR",
        maxRiskLevel: maxRisk,
        highestRiskLevel: maxRisk,
        matchedDimensions: matched,
      };
    }
    if (maxRisk >= 9) {
      return {
        spec,
        factor,
        status: "atencao",
        statusLabel: "Sinal de Atenção · Prevenção e Monitoramento",
        maxRiskLevel: maxRisk,
        highestRiskLevel: maxRisk,
        matchedDimensions: matched,
      };
    }
    return {
      spec,
      factor,
      status: "protecao_ativa",
      statusLabel: "Fator de Proteção Ativo · Manter e Documentar (PDCA)",
      maxRiskLevel: maxRisk,
      highestRiskLevel: maxRisk,
      matchedDimensions: matched,
    };
  });
}

export function extractProtectiveFactors(scores: ScoreInputForQ1[]): ProtectiveFactorSummary[] {
  const eligible = scores
    .filter((s) => canDisplayAggregate(s.n_responses) && s.risk_level <= 8)
    .sort((a, b) => a.risk_level - b.risk_level);

  return eligible.map((score) => {
    const factor = MTE_13_PSYCHOSOCIAL_FACTORS.find((f) =>
      f.relatedDimensions.includes(score.dimension),
    );
    return {
      dimension: score.dimension,
      riskLevel: score.risk_level,
      meanScore: score.mean_score ?? null,
      nResponses: score.n_responses,
      driverSlug: factor?.driverSlug ?? "trust-psychological-safety",
      driverLabel: factor?.driverLabel ?? "Confiança e Segurança Psicológica",
      recommendation:
        factor?.protectiveStrengthLabel ??
        "Fator de proteção organizacional: manter práticas atuais e monitorar no próximo ciclo (PDCA).",
    };
  });
}

export function buildUnitMobilizationSummary(
  units: Array<{ id: string; name: string; sector?: string | null; headcount?: number | null }>,
  kMin = K_ANONYMITY_MIN,
): UnitMobilizationRow[] {
  return units
    .map((unit) => {
      const headcount = Math.max(0, Number(unit.headcount ?? 0));
      const requiresGroupingWarning = headcount > 0 && headcount < kMin;

      if (requiresGroupingWarning) {
        return {
          unitId: unit.id,
          unitName: unit.name,
          sector: unit.sector ?? "Geral",
          headcount,
          kMin,
          requiresGroupingWarning: true,
          mobilizationStatus: "agrupar_ghe" as const,
          mobilizationLabel: `Quadro < ${kMin} · Agrupar em GHE maior`,
          guidance: `Esta unidade possui ${headcount} colaborador(es). Para preservar o anonimato coletivo (k >= ${kMin}), agrupe-a em um GHE maior antes da leitura setorial.`,
        };
      }

      if (headcount === 0) {
        return {
          unitId: unit.id,
          unitName: unit.name,
          sector: unit.sector ?? "Geral",
          headcount: 0,
          kMin,
          requiresGroupingWarning: false,
          mobilizationStatus: "mobilizar_equipe" as const,
          mobilizationLabel: "Informar efetivo (quadro) da unidade",
          guidance: "Preencha o quadro (headcount) em Unidades & GHE para planejar a representatividade da coleta.",
        };
      }

      return {
        unitId: unit.id,
        unitName: unit.name,
        sector: unit.sector ?? "Geral",
        headcount,
        kMin,
        requiresGroupingWarning: false,
        mobilizationStatus: "elegivel_k5" as const,
        mobilizationLabel: `Elegível para leitura própria (Quadro: ${headcount} · meta k >= ${kMin})`,
        guidance: `Divulgue o Cartaz QR Code no mural/canal da unidade para atingir pelo menos ${Math.max(kMin, Math.ceil(headcount * 0.6))} participações (referência de 60% de representatividade).`,
      };
    })
    .sort((a, b) => {
      const order = { agrupar_ghe: 0, mobilizar_equipe: 1, elegivel_k5: 2 };
      return order[a.mobilizationStatus] - order[b.mobilizationStatus];
    });
}

export function exportUnitMobilizationCsv(rows: UnitMobilizationRow[], orgName: string): string {
  const header = [
    "Organizacao",
    "Unidade_GHE",
    "Setor",
    "Quadro_Declarado",
    "Limiar_Anonimato_k",
    "Status_Mobilizacao",
    "Orientacao_Operacional",
  ].join(";");

  const lines = rows.map((row) =>
    [
      sanitizeCsvCell(orgName),
      sanitizeCsvCell(row.unitName),
      sanitizeCsvCell(row.sector),
      String(row.headcount),
      String(row.kMin),
      sanitizeCsvCell(row.mobilizationLabel),
      sanitizeCsvCell(row.guidance),
    ].join(";"),
  );

  return [header, ...lines].join("\n");
}

function sanitizeCsvCell(value: string): string {
  return String(value ?? "").replace(/[;\r\n]+/g, " ").trim();
}
