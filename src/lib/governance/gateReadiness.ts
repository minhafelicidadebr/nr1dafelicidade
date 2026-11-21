import type {
  G1ReadinessCategory,
  G1ReadinessCriterion,
  G1ReadinessKey,
} from "@/data/g1ReadinessCriteria";

export type GateEvidence = {
  ok: boolean;
  detail: string;
};

export type GateEvidenceMap = Partial<Record<G1ReadinessKey, GateEvidence>>;

export type GateReadinessItem = G1ReadinessCriterion & {
  ok: boolean;
  detail: string;
};

export type GateReadinessSummary = {
  items: GateReadinessItem[];
  total: number;
  ok: number;
  gateBlockingOpen: number;
  operationalTotal: number;
  operationalOk: number;
  formalTotal: number;
  formalOk: number;
  operationalPct: number;
  gatePct: number;
  canAdvanceGate: boolean;
  status: "no_go" | "operational_pending" | "formal_pending" | "ready_for_formal_acceptance";
  nextStep: GateReadinessItem | null;
  categoryTotals: Record<G1ReadinessCategory, { total: number; ok: number }>;
};

export function evaluateGateReadiness(
  criteria: G1ReadinessCriterion[],
  evidence: GateEvidenceMap,
): GateReadinessSummary {
  const items = criteria.map((criterion) => {
    const itemEvidence = evidence[criterion.key] ?? {
      ok: false,
      detail: "Evidencia nao informada.",
    };
    return { ...criterion, ...itemEvidence };
  });

  const total = items.length;
  const ok = items.filter((item) => item.ok).length;
  const gateBlockingOpen = items.filter((item) => item.gateBlocking && !item.ok).length;
  const operationalItems = items.filter((item) => item.category !== "formal");
  const formalItems = items.filter((item) => item.category === "formal");
  const operationalOk = operationalItems.filter((item) => item.ok).length;
  const formalOk = formalItems.filter((item) => item.ok).length;
  const canAdvanceGate = gateBlockingOpen === 0;
  const nextStep = items.find((item) => item.gateBlocking && !item.ok) ?? null;

  return {
    items,
    total,
    ok,
    gateBlockingOpen,
    operationalTotal: operationalItems.length,
    operationalOk,
    formalTotal: formalItems.length,
    formalOk,
    operationalPct: pct(operationalOk, operationalItems.length),
    gatePct: pct(ok, total),
    canAdvanceGate,
    status: getStatus(operationalOk, operationalItems.length, formalOk, formalItems.length, canAdvanceGate),
    nextStep,
    categoryTotals: {
      runtime: getCategoryTotal(items, "runtime"),
      operational: getCategoryTotal(items, "operational"),
      formal: getCategoryTotal(items, "formal"),
    },
  };
}

function getStatus(
  operationalOk: number,
  operationalTotal: number,
  formalOk: number,
  formalTotal: number,
  canAdvanceGate: boolean,
): GateReadinessSummary["status"] {
  if (canAdvanceGate) return "ready_for_formal_acceptance";
  if (operationalOk < operationalTotal) return "operational_pending";
  if (formalOk < formalTotal) return "formal_pending";
  return "no_go";
}

function getCategoryTotal(items: GateReadinessItem[], category: G1ReadinessCategory) {
  const filtered = items.filter((item) => item.category === category);
  return {
    total: filtered.length,
    ok: filtered.filter((item) => item.ok).length,
  };
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
