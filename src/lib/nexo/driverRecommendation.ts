export const NEXO_RECOMMENDATION_DISCLAIMER =
  "Esta recomendação é orientativa e foi gerada a partir de resultados agregados, da matriz de alinhamento do Playbook e de regras configuradas. Ela não estabelece causalidade individual, não substitui avaliação técnica e deve ser contextualizada pela organização e pelo responsável técnico.";

export type NexoAssociationType =
  | "operational_alignment"
  | "evidence_informed_association"
  | "empirically_validated_correlation";

export type NexoDirection =
  | "risk_increases_driver_priority"
  | "protective_factor_reduces_driver_priority";

export type NexoPriorityBand = "alta" | "moderada" | "observar";
export type NexoConfidence = "boa" | "limitada";

export type NexoBlocker =
  | "scope_not_authorized"
  | "campaign_not_closed"
  | "below_k_anonymity"
  | "legacy_instrument"
  | "non_comparable_instrument"
  | "missing_instrument_version"
  | "non_server_side_score"
  | "score_not_validated"
  | "insufficient_dimension_coverage"
  | "no_safe_aggregate_scores";

export interface NexoDriverDimensionMapping {
  driverKey: string;
  dimensionKey: string;
  weight: number;
  associationType: NexoAssociationType;
  direction: NexoDirection;
  rationale: string;
  evidenceClass: string;
  coverageRole: "primary" | "supporting" | "contextual";
  activeFrom: string;
  activeTo?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
}

export interface NexoDriverMatrixConfig {
  version: string;
  algorithmVersion: string;
  minCoverage: number;
  criticalRiskLevel: number;
  mappings: NexoDriverDimensionMapping[];
}

export interface NexoRiskDimensionInput {
  dimensionKey: string;
  needScore: number | null;
  riskLevel: number | null;
  nResponses: number;
  kAnonymityMet: boolean;
  scoreValidated: boolean;
}

export interface NexoRecommendationContext {
  cycleId: string | null;
  scopeType: "cycle" | "unit" | "organization";
  scopeId: string | null;
  campaignStatus: string | null;
  instrumentVersionId: string | null;
  instrumentLegacy: boolean;
  instrumentComparable: boolean;
  scoreEngine: "server" | "frontend" | "unknown";
  scopeAuthorized: boolean;
  kMin: number;
}

export interface NexoDimensionContribution {
  dimensionKey: string;
  needScore: number;
  riskLevel: number | null;
  weight: number;
  weightedContribution: number;
}

export interface NexoDriverRecommendation {
  driverKey: string;
  priorityScore: number;
  weightedNeed: number;
  criticality: number;
  coverage: number;
  availableWeight: number;
  totalWeight: number;
  priorityBand: NexoPriorityBand;
  confidence: NexoConfidence;
  reasons: NexoDimensionContribution[];
  unavailableSignals: {
    trend: true;
    controlGap: true;
  };
}

export interface NexoRecommendationRun {
  status: "available" | "blocked";
  blockers: NexoBlocker[];
  matrixVersion: string;
  algorithmVersion: string;
  cycleId: string | null;
  scopeType: NexoRecommendationContext["scopeType"];
  scopeId: string | null;
  generatedAt: string;
  disclaimer: string;
  recommendations: NexoDriverRecommendation[];
  primary: NexoDriverRecommendation | null;
}

export interface SafeRiskScoreLike {
  dimension: string;
  mean_score: number | string | null;
  risk_level: number | null;
  n_responses: number;
  k_anonymity_met?: boolean | null;
  criteria_version?: string | null;
}

export function safeRiskScoresToNexoInputs(scores: SafeRiskScoreLike[]): NexoRiskDimensionInput[] {
  return scores.map((score) => ({
    dimensionKey: score.dimension,
    needScore: score.mean_score == null ? null : Number(score.mean_score),
    riskLevel: score.risk_level == null ? null : Number(score.risk_level),
    nResponses: Number(score.n_responses ?? 0),
    kAnonymityMet: score.k_anonymity_met !== false,
    scoreValidated: Boolean(score.criteria_version),
  }));
}

export function evaluateNexoDriverRecommendations(
  matrix: NexoDriverMatrixConfig,
  dimensions: NexoRiskDimensionInput[],
  context: NexoRecommendationContext,
  now = new Date(),
): NexoRecommendationRun {
  const blockers = eligibilityBlockers(dimensions, context);
  const usableDimensions = new Map(
    dimensions
      .filter((dimension) => dimension.kAnonymityMet)
      .filter((dimension) => dimension.scoreValidated)
      .filter((dimension) => typeof dimension.needScore === "number")
      .map((dimension) => [dimension.dimensionKey, dimension]),
  );

  const recommendations = blockers.length > 0
    ? []
    : computeRecommendations(matrix, usableDimensions);

  const finalBlockers = [...blockers];
  if (blockers.length === 0 && recommendations.length === 0) {
    finalBlockers.push("insufficient_dimension_coverage");
  }

  return {
    status: finalBlockers.length > 0 ? "blocked" : "available",
    blockers: finalBlockers,
    matrixVersion: matrix.version,
    algorithmVersion: matrix.algorithmVersion,
    cycleId: context.cycleId,
    scopeType: context.scopeType,
    scopeId: context.scopeId,
    generatedAt: now.toISOString(),
    disclaimer: NEXO_RECOMMENDATION_DISCLAIMER,
    recommendations,
    primary: recommendations[0] ?? null,
  };
}

function eligibilityBlockers(
  dimensions: NexoRiskDimensionInput[],
  context: NexoRecommendationContext,
): NexoBlocker[] {
  const blockers: NexoBlocker[] = [];

  if (!context.scopeAuthorized) blockers.push("scope_not_authorized");
  if (context.campaignStatus !== "closed") blockers.push("campaign_not_closed");
  if (!context.instrumentVersionId) blockers.push("missing_instrument_version");
  if (context.instrumentLegacy) blockers.push("legacy_instrument");
  if (!context.instrumentComparable) blockers.push("non_comparable_instrument");
  if (context.scoreEngine !== "server") blockers.push("non_server_side_score");
  if (dimensions.length === 0) blockers.push("no_safe_aggregate_scores");
  if (dimensions.some((dimension) => !dimension.kAnonymityMet || dimension.nResponses < context.kMin)) {
    blockers.push("below_k_anonymity");
  }
  if (dimensions.some((dimension) => !dimension.scoreValidated || dimension.needScore == null)) {
    blockers.push("score_not_validated");
  }

  return Array.from(new Set(blockers));
}

function computeRecommendations(
  matrix: NexoDriverMatrixConfig,
  dimensions: Map<string, NexoRiskDimensionInput>,
): NexoDriverRecommendation[] {
  const driverKeys = Array.from(new Set(matrix.mappings.map((mapping) => mapping.driverKey)));
  const recommendations = driverKeys.flatMap((driverKey) => {
    const mappings = activeMappingsForDriver(matrix, driverKey);
    const totalWeight = mappings.reduce((total, mapping) => total + mapping.weight, 0);
    if (totalWeight <= 0) return [];

    const available = mappings
      .map((mapping) => ({ mapping, dimension: dimensions.get(mapping.dimensionKey) }))
      .filter((item): item is { mapping: NexoDriverDimensionMapping; dimension: NexoRiskDimensionInput } =>
        Boolean(item.dimension),
      );
    const availableWeight = available.reduce((total, item) => total + item.mapping.weight, 0);
    const coverage = availableWeight / totalWeight;

    if (coverage < matrix.minCoverage || availableWeight <= 0) return [];

    const weightedNeed = available.reduce(
      (total, item) => total + item.mapping.weight * clampScore(item.dimension.needScore ?? 0),
      0,
    ) / availableWeight;
    const criticality = available.reduce(
      (total, item) => total + item.mapping.weight * (Number(item.dimension.riskLevel ?? 0) >= matrix.criticalRiskLevel ? 100 : 0),
      0,
    ) / availableWeight;

    const priorityScore = redistributePriority({
      weightedNeed,
      criticality,
      trendWorsening: null,
      controlGap: null,
    });

    const reasons = available
      .map(({ mapping, dimension }) => ({
        dimensionKey: mapping.dimensionKey,
        needScore: clampScore(dimension.needScore ?? 0),
        riskLevel: dimension.riskLevel,
        weight: mapping.weight,
        weightedContribution: mapping.weight * clampScore(dimension.needScore ?? 0),
      }))
      .sort((a, b) => b.weightedContribution - a.weightedContribution)
      .slice(0, 3);

    return [{
      driverKey,
      priorityScore: round1(priorityScore),
      weightedNeed: round1(weightedNeed),
      criticality: round1(criticality),
      coverage: round1(coverage * 100),
      availableWeight: round2(availableWeight),
      totalWeight: round2(totalWeight),
      priorityBand: priorityBand(priorityScore),
      confidence: (coverage >= 0.75 && available.length >= 2 ? "boa" : "limitada") as NexoConfidence,
      reasons,
      unavailableSignals: { trend: true, controlGap: true } as const,
    }];
  });

  return recommendations.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 4);
}

function activeMappingsForDriver(matrix: NexoDriverMatrixConfig, driverKey: string) {
  return matrix.mappings.filter((mapping) =>
    mapping.driverKey === driverKey &&
    mapping.weight > 0 &&
    mapping.activeTo == null,
  );
}

function redistributePriority(input: {
  weightedNeed: number;
  criticality: number;
  trendWorsening: number | null;
  controlGap: number | null;
}) {
  const factors = [
    { value: input.weightedNeed, weight: 0.55 },
    { value: input.criticality, weight: 0.20 },
    { value: input.trendWorsening, weight: 0.15 },
    { value: input.controlGap, weight: 0.10 },
  ].filter((factor): factor is { value: number; weight: number } => typeof factor.value === "number");

  const availableWeight = factors.reduce((total, factor) => total + factor.weight, 0);
  if (availableWeight <= 0) return 0;

  return factors.reduce((total, factor) => total + factor.value * (factor.weight / availableWeight), 0);
}

function priorityBand(score: number): NexoPriorityBand {
  if (score >= 70) return "alta";
  if (score >= 45) return "moderada";
  return "observar";
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
