/**
 * Aurora NR-1 — Contexto leve da rota atual.
 * Busca apenas dados agregados já visíveis (ciclo + risk_scores).
 * Respeita k-anonimato: nenhum recorte com n<K é exposto.
 */
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { fetchMyOrg } from "@/lib/api/nr1";
import { canDisplayAggregate, K_ANONYMITY_MIN } from "@/lib/privacy";
import {
  fetchCyclePrivacySummaries,
  fetchSafeRiskScores,
  type SafeRiskScore,
} from "@/lib/api/privacyVault";

export interface AuroraScore {
  dimension: string;
  risk_level: number;
  severity: number;
  probability: number;
  n_responses: number;
  mean_score: number | null;
  unfavorable_percentage: number | null;
}

export interface AuroraContext {
  pathname: string;
  org: { id: string; name: string } | null;
  cycle: {
    id: string;
    name: string;
    status: string;
    n_responses: number;
    has_sample: boolean;
    starts_at?: string | null;
    ends_at?: string | null;
  } | null;
  visibleScores: AuroraScore[];
  suppressedCount: number;
  totalDimensions: number;
  unitsCount: number;
  cyclesCount: number;
  // KPIs leves
  k_min: number;
}

export function projectAuroraScore(score: SafeRiskScore): AuroraScore {
  return {
    dimension: score.dimension,
    risk_level: score.risk_level,
    severity: score.severity,
    probability: score.probability,
    n_responses: score.n_responses,
    mean_score: score.mean_score,
    unfavorable_percentage: score.unfavorable_percentage,
  };
}

export function selectAuroraScores(scores: readonly SafeRiskScore[]) {
  const all = scores.map(projectAuroraScore);
  const visible = all.filter((score) => canDisplayAggregate(score.n_responses));
  return {
    all,
    visible,
    suppressedCount: all.length - visible.length,
  };
}

export async function buildAuroraContext(pathname: string): Promise<AuroraContext> {
  const base: AuroraContext = {
    pathname,
    org: null,
    cycle: null,
    visibleScores: [],
    suppressedCount: 0,
    totalDimensions: 0,
    unitsCount: 0,
    cyclesCount: 0,
    k_min: K_ANONYMITY_MIN,
  };

  const o = await fetchMyOrg();
  if (!o) return base;
  base.org = { id: o.id, name: o.name ?? "Organização" };

  const [{ data: cs }, summaries, { data: units }] = await Promise.all([
    supabase
      .from("cycles")
      .select("id, name, status, starts_at, ends_at")
      .eq("organization_id", o.id)
      .order("created_at", { ascending: false }),
    fetchCyclePrivacySummaries(o.id),
    supabase.from("units").select("id").eq("organization_id", o.id),
  ]);

  base.unitsCount = units?.length ?? 0;
  base.cyclesCount = cs?.length ?? 0;

  const summaryByCycle = new Map(summaries.map((summary) => [summary.cycle_id, summary]));

  const cyclesWithCounts = (cs ?? []).map((c) => ({
    ...c,
    n_responses: summaryByCycle.get(c.id)?.response_count ?? 0,
    has_sample: c.status === "closed" && Boolean(summaryByCycle.get(c.id)?.k_anonymity_met),
  }));
  const active = cyclesWithCounts.find((c) => c.has_sample) ?? cyclesWithCounts[0];

  if (active) {
    base.cycle = {
      id: active.id,
      name: active.name,
      status: active.status,
      n_responses: active.n_responses,
      has_sample: active.has_sample,
      starts_at: active.starts_at,
      ends_at: active.ends_at,
    };

    const scores = await fetchSafeRiskScores({ cycleId: active.id }).catch(() => []);

    const projected = selectAuroraScores(scores);
    base.totalDimensions = projected.all.length;
    base.visibleScores = projected.visible;
    base.suppressedCount = projected.suppressedCount;
  }

  return base;
}

export function createDefaultFallbackContext(pathname: string): AuroraContext {
  return {
    pathname,
    org: { id: "fallback-org-1", name: "Organização Demonstrativa S.A." },
    cycle: {
      id: "fallback-cycle-1",
      name: "Ciclo NR-1 / GRO 2026 (Demonstração Agêntica)",
      status: "closed",
      n_responses: 245,
      has_sample: true,
      starts_at: "2026-01-01",
      ends_at: "2026-02-28",
    },
    visibleScores: [
      { dimension: "cargas_trabalho", risk_level: 16, severity: 4, probability: 4, n_responses: 245, mean_score: 4.2, unfavorable_percentage: 68 },
      { dimension: "autonomia", risk_level: 12, severity: 3, probability: 4, n_responses: 245, mean_score: 3.8, unfavorable_percentage: 55 },
      { dimension: "suporte_lideranca", risk_level: 12, severity: 4, probability: 3, n_responses: 245, mean_score: 3.6, unfavorable_percentage: 52 },
      { dimension: "reconhecimento", risk_level: 9, severity: 3, probability: 3, n_responses: 245, mean_score: 3.2, unfavorable_percentage: 42 },
      { dimension: "equilibrio_vida", risk_level: 9, severity: 3, probability: 3, n_responses: 245, mean_score: 3.1, unfavorable_percentage: 40 },
    ],
    suppressedCount: 2,
    totalDimensions: 7,
    unitsCount: 4,
    cyclesCount: 2,
    k_min: 5,
  };
}
