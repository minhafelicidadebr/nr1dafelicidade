export type ExternalReadinessClosureStatus = "ready" | "in_progress" | "blocked";

export type ExternalReadinessClosureItemInput = {
  key: string;
  label: string;
  status: ExternalReadinessClosureStatus;
  priority: number;
  ownerRole: string;
  ownerAssigned: boolean;
  evidenceRef: string | null;
  evidenceVerified: boolean;
  dependencies: readonly string[];
  nextAction: string;
  detail: string;
};

export type ExternalReadinessClosurePolicy = {
  policyId: string;
  targetGate: "G1";
  requiredWorkstreams: readonly string[];
  requireOwner: boolean;
  requireVerifiedEvidence: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type ExternalReadinessClosureContext = {
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
};

export type ExternalReadinessClosureBlocker =
  | "required_workstream_missing"
  | "duplicate_workstream"
  | "workstream_not_ready"
  | "owner_missing"
  | "evidence_missing"
  | "evidence_unverified"
  | "dependency_missing"
  | "dependency_cycle"
  | "dependency_not_ready"
  | "real_data_enabled"
  | "gate_advance_claimed";

export type ExternalReadinessClosureItem = ExternalReadinessClosureItemInput & {
  ready: boolean;
  blockers: ExternalReadinessClosureBlocker[];
};

export type ExternalReadinessClosureSummary = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "ready_for_formal_review";
  canRequestFormalReview: boolean;
  canAdvanceGate: false;
  canUseRealData: false;
  items: ExternalReadinessClosureItem[];
  blockers: ExternalReadinessClosureBlocker[];
  ready: number;
  inProgress: number;
  blocked: number;
  total: number;
  readinessPct: number;
  nextItem: ExternalReadinessClosureItem | null;
  criticalPath: ExternalReadinessClosureItem[];
};

export function evaluateExternalReadinessClosure(
  inputs: readonly ExternalReadinessClosureItemInput[],
  context: ExternalReadinessClosureContext,
  policy: ExternalReadinessClosurePolicy,
): ExternalReadinessClosureSummary {
  const keys = inputs.map((item) => item.key);
  const duplicateKeys = new Set(keys.filter((key, index) => keys.indexOf(key) !== index));
  const knownKeys = new Set(keys);
  const baseItems = inputs.map((item) => {
    const blockers: ExternalReadinessClosureBlocker[] = [];

    if (item.status !== "ready") blockers.push("workstream_not_ready");
    if (policy.requireOwner && !item.ownerAssigned) blockers.push("owner_missing");
    if (policy.requireVerifiedEvidence && !item.evidenceRef?.trim()) blockers.push("evidence_missing");
    if (policy.requireVerifiedEvidence && !item.evidenceVerified) blockers.push("evidence_unverified");
    if (item.dependencies.some((dependency) => !knownKeys.has(dependency))) blockers.push("dependency_missing");

    return { ...item, blockers };
  });
  const baseByKey = new Map(baseItems.map((item) => [item.key, item]));
  const items = baseItems.map((item): ExternalReadinessClosureItem => {
    const dependencyBlocker = dependencyIssue(item, baseByKey, new Set([item.key]));
    const blockers = dependencyBlocker
      ? unique([...item.blockers, dependencyBlocker])
      : unique(item.blockers);

    return { ...item, blockers, ready: blockers.length === 0 };
  });
  const requiredItems = policy.requiredWorkstreams.map((key) => items.find((item) => item.key === key));
  const structuralBlockers: ExternalReadinessClosureBlocker[] = [];

  if (requiredItems.some((item) => !item)) structuralBlockers.push("required_workstream_missing");
  if (duplicateKeys.size > 0) structuralBlockers.push("duplicate_workstream");
  if (context.realDataEnabled && policy.prohibitRealData) structuralBlockers.push("real_data_enabled");
  if (context.gateAdvanceClaimed && policy.prohibitGateAdvance) structuralBlockers.push("gate_advance_claimed");

  const blockers = unique([
    ...structuralBlockers,
    ...items.flatMap((item) => item.blockers),
  ]);
  const criticalPath = items
    .filter((item) => policy.requiredWorkstreams.includes(item.key) && !item.ready)
    .sort((left, right) => left.priority - right.priority);
  const canRequestFormalReview =
    requiredItems.length > 0 &&
    requiredItems.every((item) => item?.ready) &&
    blockers.length === 0;
  const ready = items.filter((item) => item.ready).length;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canRequestFormalReview ? "ready_for_formal_review" : "blocked",
    canRequestFormalReview,
    canAdvanceGate: false,
    canUseRealData: false,
    items: [...items].sort((left, right) => left.priority - right.priority),
    blockers,
    ready,
    inProgress: items.filter((item) => !item.ready && item.status === "in_progress").length,
    blocked: items.filter((item) => !item.ready && item.status !== "in_progress").length,
    total: items.length,
    readinessPct: pct(ready, items.length),
    nextItem: criticalPath[0] ?? null,
    criticalPath,
  };
}

export function externalReadinessClosureBlockerLabel(blocker: ExternalReadinessClosureBlocker) {
  const labels: Record<ExternalReadinessClosureBlocker, string> = {
    required_workstream_missing: "Restaurar todas as trilhas obrigatórias do fechamento.",
    duplicate_workstream: "Remover trilhas duplicadas antes de consolidar a decisão.",
    workstream_not_ready: "Concluir a trilha com evidência verificável.",
    owner_missing: "Registrar o papel accountable antes de concluir a trilha.",
    evidence_missing: "Vincular uma referência de evidência auditável.",
    evidence_unverified: "Submeter a evidência à verificação competente.",
    dependency_missing: "Restaurar a dependência declarada no critical path.",
    dependency_cycle: "Remover o ciclo de dependências antes de consolidar a trilha.",
    dependency_not_ready: "Fechar as dependências anteriores desta trilha.",
    real_data_enabled: "Manter dados reais bloqueados durante G1.",
    gate_advance_claimed: "Remover qualquer alegação de avanço de gate.",
  };
  return labels[blocker];
}

function dependencyIssue(
  item: Pick<ExternalReadinessClosureItemInput, "key" | "dependencies"> & { blockers: ExternalReadinessClosureBlocker[] },
  itemsByKey: ReadonlyMap<string, Pick<ExternalReadinessClosureItemInput, "key" | "dependencies"> & { blockers: ExternalReadinessClosureBlocker[] }>,
  path: ReadonlySet<string>,
): ExternalReadinessClosureBlocker | null {
  for (const dependency of item.dependencies) {
    const dependencyItem = itemsByKey.get(dependency);
    if (!dependencyItem) return "dependency_missing";
    if (path.has(dependency)) return "dependency_cycle";
    if (dependencyItem.blockers.length > 0) return "dependency_not_ready";

    const nestedIssue = dependencyIssue(
      dependencyItem,
      itemsByKey,
      new Set([...path, dependency]),
    );
    if (nestedIssue === "dependency_cycle") return nestedIssue;
    if (nestedIssue) return "dependency_not_ready";
  }

  return null;
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
