import { canDisplayAggregate } from "@/lib/privacy";

export type OutcomeRow = {
  outcome: string;
  mean_score: number | null;
  n_responses: number;
  k_anonymity_met: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOutcomeRow(value: unknown): value is OutcomeRow {
  return isRecord(value)
    && typeof value.outcome === "string"
    && value.outcome.length > 0
    && (value.mean_score === null || isFiniteNumber(value.mean_score))
    && isFiniteNumber(value.n_responses)
    && Number.isInteger(value.n_responses)
    && canDisplayAggregate(value.n_responses)
    && value.k_anonymity_met === true;
}

export function normalizeOutcomeRows(value: unknown): OutcomeRow[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isOutcomeRow).map((row) => ({
    outcome: row.outcome,
    mean_score: row.mean_score,
    n_responses: row.n_responses,
    k_anonymity_met: row.k_anonymity_met,
  }));
}
