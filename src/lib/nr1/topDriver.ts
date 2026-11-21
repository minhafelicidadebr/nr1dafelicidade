export type DriverWeights = Readonly<Record<string, number>>;
export type DimensionDriverMap = Readonly<Record<string, DriverWeights>>;

export type RiskDriverInput = {
  dimension: string;
  risk_level: number;
};

const DIMENSION_DRIVER_ALIASES: Record<string, string> = {
  workload: "demands_quant",
  workload_pressures: "demands_quant",
  quantitative_demands: "demands_quant",
  emotional_demands: "demands_emotional",
  autonomy: "influence",
  influence_at_work: "influence",
  job_security: "insecurity",
  job_insecurity: "insecurity",
  work_life_balance: "work_pace",
  work_family_conflict: "work_pace",
  support: "social_support",
  social_support_supervisors: "leadership_quality",
  social_support_colleagues: "social_support",
  management: "leadership_quality",
  justice_trust: "leadership_quality",
  trust: "leadership_quality",
  meaning_of_work: "meaning",
  social_community_at_work: "community",
};

function resolveWeights(driverMap: DimensionDriverMap, dimension: string): DriverWeights | undefined {
  return driverMap[dimension] ?? driverMap[DIMENSION_DRIVER_ALIASES[dimension] ?? ""];
}

export function topDriverForDimension(
  driverMap: DimensionDriverMap,
  dimension: string,
): string | null {
  const weights = resolveWeights(driverMap, dimension);
  if (!weights) return null;

  return Object.entries(weights)
    .sort(([, left], [, right]) => right - left)[0]?.[0] ?? null;
}

export function topDriverGlobal(
  driverMap: DimensionDriverMap,
  visible: readonly RiskDriverInput[],
): { slug: string | null; score: number } {
  const accumulated: Record<string, number> = {};

  for (const risk of visible) {
    const weights = resolveWeights(driverMap, risk.dimension);
    if (!weights) continue;

    for (const [driver, weight] of Object.entries(weights)) {
      accumulated[driver] = (accumulated[driver] ?? 0) + weight * risk.risk_level;
    }
  }

  const top = Object.entries(accumulated)
    .sort(([, left], [, right]) => right - left)[0];
  return { slug: top?.[0] ?? null, score: top?.[1] ?? 0 };
}
