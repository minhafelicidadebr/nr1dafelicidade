import { supabase } from "@/lib/runtime/appSupabaseClient";

export type CyclePrivacySummary = {
  cycle_id: string;
  response_count: number | null;
  response_count_band: "suppressed" | "threshold_met" | "closed_exact";
  k_anonymity_met: boolean;
  invitations_issued: number;
  privacy_policy_version: string;
  k_min: number;
};

export type SafeRiskScore = {
  id: string;
  cycle_id: string;
  organization_id: string;
  dimension: string;
  driver_slug: string | null;
  severity: number;
  probability: number;
  risk_level: number;
  n_responses: number;
  mean_score: number | null;
  unfavorable_percentage: number | null;
  criteria_version: string | null;
  computed_at: string;
  cycle_name: string;
  cycle_started_at: string | null;
};

export type SafeRiskHistoryRow = {
  computation_id: string;
  computed_at: string;
  dimension: string;
  risk_level: number;
  n_responses: number;
  criteria_version: string | null;
};

export type IssuedInvitation = {
  token: string;
  expires_at: string;
};

const SYNTHETIC_SAFE_RISK_SCORES: readonly SafeRiskScore[] = [
  {
    id: "syn-risk-1",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "workload_pressures",
    driver_slug: "workload_pressures",
    severity: 4,
    probability: 5,
    risk_level: 20,
    n_responses: 24,
    mean_score: 3.92,
    unfavorable_percentage: 62.5,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "Ciclo 2 · Piloto Sintético (n=24)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-2",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "job_security",
    driver_slug: "job_security",
    severity: 4,
    probability: 4,
    risk_level: 16,
    n_responses: 24,
    mean_score: 3.74,
    unfavorable_percentage: 54.0,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "Ciclo 2 · Piloto Sintético (n=24)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-3",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "management",
    driver_slug: "management",
    severity: 3,
    probability: 5,
    risk_level: 15,
    n_responses: 24,
    mean_score: 2.21,
    unfavorable_percentage: 45.8,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "Ciclo 2 · Piloto Sintético (n=24)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-4",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "trust",
    driver_slug: "trust",
    severity: 3,
    probability: 3,
    risk_level: 9,
    n_responses: 24,
    mean_score: 3.85,
    unfavorable_percentage: 16.5,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "Ciclo 2 · Piloto Sintético (n=24)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-5",
    cycle_id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "workload_pressures",
    driver_slug: "workload_pressures",
    severity: 4,
    probability: 4,
    risk_level: 16,
    n_responses: 21,
    mean_score: 3.71,
    unfavorable_percentage: 52.0,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-03-15T10:00:00Z",
    cycle_name: "Ciclo 1 · Baseline Sintético (n=21)",
    cycle_started_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "syn-risk-6",
    cycle_id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "trust",
    driver_slug: "trust",
    severity: 3,
    probability: 4,
    risk_level: 12,
    n_responses: 21,
    mean_score: 3.12,
    unfavorable_percentage: 33.0,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-03-15T10:00:00Z",
    cycle_name: "Ciclo 1 · Baseline Sintético (n=21)",
    cycle_started_at: "2026-03-01T00:00:00Z",
  },
];

const SYNTHETIC_CYCLE_PRIVACY_SUMMARIES: readonly CyclePrivacySummary[] = [
  {
    cycle_id: "syn-cycle-2026-q2",
    response_count: 24,
    response_count_band: "closed_exact",
    k_anonymity_met: true,
    invitations_issued: 30,
    privacy_policy_version: "k5-vault-g1-2026",
    k_min: 5,
  },
  {
    cycle_id: "syn-cycle-2026-q1",
    response_count: 21,
    response_count_band: "closed_exact",
    k_anonymity_met: true,
    invitations_issued: 25,
    privacy_policy_version: "k5-vault-g1-2026",
    k_min: 5,
  },
];

async function callRpc<T>(name: string, args: Record<string, unknown>): Promise<T[]> {
  try {
    const { data, error } = await supabase.rpc(name as never, args as never);
    if (error) throw error;
    return (data ?? []) as T[];
  } catch {
    if (name === "list_safe_risk_scores") {
      return [...SYNTHETIC_SAFE_RISK_SCORES] as unknown as T[];
    }
    if (name === "get_cycle_privacy_summary") {
      return [...SYNTHETIC_CYCLE_PRIVACY_SUMMARIES] as unknown as T[];
    }
    return [];
  }
}

export function fetchCyclePrivacySummaries(organizationId: string) {
  return callRpc<CyclePrivacySummary>("get_cycle_privacy_summary", { _organization_id: organizationId });
}

export function fetchSafeRiskScores(scope: { organizationId?: string; cycleId?: string }) {
  return callRpc<SafeRiskScore>("list_safe_risk_scores", {
    _organization_id: scope.organizationId ?? null,
    _cycle_id: scope.cycleId ?? null,
  });
}

export function fetchSafeRiskHistory(cycleId: string) {
  return callRpc<SafeRiskHistoryRow>("list_safe_risk_history", { _cycle_id: cycleId });
}

export function createInvitationBatch(cycleId: string, unitId: string | null, quantity: number) {
  return callRpc<IssuedInvitation>("create_invitation_batch", {
    _cycle_id: cycleId,
    _unit_id: unitId,
    _quantity: quantity,
  });
}

