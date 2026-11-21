export type CommitteeSubmissionCategory =
  | "gate"
  | "accountability"
  | "methodology"
  | "technical"
  | "operation";

export type CommitteeSubmissionKey =
  | "actions_18_23_local_evidence"
  | "g1_formal_approval"
  | "accountables_named"
  | "instrument_sources_approved"
  | "psychometric_fixtures_approved"
  | "independent_reviews_complete"
  | "github_lovable_official_green"
  | "worker_cipa_validation"
  | "legal_privacy_decisions"
  | "incident_dr_exercise"
  | "committee_agenda_packet"
  | "real_data_no_go"
  | "no_gate_advance_claimed";

export type CommitteeSubmissionCriterion = {
  key: CommitteeSubmissionKey;
  label: string;
  category: CommitteeSubmissionCategory;
  gateBlocking: boolean;
  evidenceRef?: string;
};

export type CommitteeSubmissionEvidence = {
  ok: boolean;
  detail: string;
};

export type CommitteeSubmissionEvidenceMap = Partial<Record<CommitteeSubmissionKey, CommitteeSubmissionEvidence>>;

export type CommitteeSubmissionPolicy = {
  policyId: string;
  targetGate: "G2";
  requireAllGateBlocking: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type CommitteeSubmissionItem = CommitteeSubmissionCriterion & CommitteeSubmissionEvidence;

export type CommitteeSubmissionSummary = {
  policyId: string;
  targetGate: "G2";
  status: "blocked" | "ready_for_committee";
  canSubmit: boolean;
  items: CommitteeSubmissionItem[];
  total: number;
  ok: number;
  blockingOpen: number;
  readinessPct: number;
  categoryTotals: Record<CommitteeSubmissionCategory, { total: number; ok: number }>;
  nextStep: CommitteeSubmissionItem | null;
};

export function evaluateCommitteeSubmissionReadiness(
  criteria: CommitteeSubmissionCriterion[],
  evidence: CommitteeSubmissionEvidenceMap,
  policy: CommitteeSubmissionPolicy,
): CommitteeSubmissionSummary {
  const items = criteria.map((criterion) => ({
    ...criterion,
    ...(evidence[criterion.key] ?? {
      ok: false,
      detail: "Evidencia nao informada.",
    }),
  }));

  const policyFailures = new Set<CommitteeSubmissionKey>();
  if (policy.prohibitRealData && !evidence.real_data_no_go?.ok) policyFailures.add("real_data_no_go");
  if (policy.prohibitGateAdvance && !evidence.no_gate_advance_claimed?.ok) {
    policyFailures.add("no_gate_advance_claimed");
  }

  const blockingOpen = items.filter((item) =>
    (policy.requireAllGateBlocking && item.gateBlocking && !item.ok) || policyFailures.has(item.key),
  ).length;
  const ok = items.filter((item) => item.ok).length;
  const canSubmit = items.length > 0 && blockingOpen === 0;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canSubmit ? "ready_for_committee" : "blocked",
    canSubmit,
    items,
    total: items.length,
    ok,
    blockingOpen,
    readinessPct: pct(ok, items.length),
    categoryTotals: {
      gate: getCategoryTotal(items, "gate"),
      accountability: getCategoryTotal(items, "accountability"),
      methodology: getCategoryTotal(items, "methodology"),
      technical: getCategoryTotal(items, "technical"),
      operation: getCategoryTotal(items, "operation"),
    },
    nextStep: items.find((item) => item.gateBlocking && !item.ok) ?? null,
  };
}

function getCategoryTotal(items: CommitteeSubmissionItem[], category: CommitteeSubmissionCategory) {
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
