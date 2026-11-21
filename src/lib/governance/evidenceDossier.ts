export type EvidenceDossierCategory =
  | "runtime"
  | "database"
  | "methodology"
  | "work_context"
  | "intervention"
  | "release"
  | "formal";

export type EvidenceTechnicalStatus = "ready" | "draft" | "blocked";
export type EvidenceFormalStatus = "not_required" | "pending" | "approved";

export type EvidenceDossierItemInput = {
  key: string;
  label: string;
  category: EvidenceDossierCategory;
  evidenceRef: string;
  technicalStatus: EvidenceTechnicalStatus;
  formalStatus: EvidenceFormalStatus;
  gateBlocking: boolean;
  detail: string;
};

export type EvidenceDossierPolicy = {
  policyId: string;
  targetGate: "G1";
  requireNoBlockedItems: boolean;
  requireFormalApprovalForGateBlocking: boolean;
  prohibitRealData: boolean;
};

export type EvidenceDossierItem = EvidenceDossierItemInput & {
  locallyReady: boolean;
  formallyReady: boolean;
  gateReady: boolean;
};

export type EvidenceDossierSummary = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "ready_for_formal_review";
  canRequestFormalReview: boolean;
  items: EvidenceDossierItem[];
  total: number;
  locallyReady: number;
  formallyReady: number;
  gateReady: number;
  blocked: number;
  formalPending: number;
  readinessPct: number;
  gateReadinessPct: number;
  nextStep: EvidenceDossierItem | null;
  categoryTotals: Record<EvidenceDossierCategory, { total: number; gateReady: number }>;
};

export function evaluateEvidenceDossier(
  items: EvidenceDossierItemInput[],
  policy: EvidenceDossierPolicy,
): EvidenceDossierSummary {
  const evaluated = items.map((item) => {
    const locallyReady = item.technicalStatus === "ready";
    const formallyReady = item.formalStatus === "not_required" || item.formalStatus === "approved";
    const gateReady = locallyReady && formallyReady;
    return {
      ...item,
      locallyReady,
      formallyReady,
      gateReady,
    };
  });

  const gateBlockingItems = evaluated.filter((item) => item.gateBlocking);
  const blocked = evaluated.filter((item) => item.technicalStatus === "blocked").length;
  const formalPending = evaluated.filter((item) => item.formalStatus === "pending").length;
  const hasBlockedViolation = policy.requireNoBlockedItems && blocked > 0;
  const hasFormalViolation =
    policy.requireFormalApprovalForGateBlocking && gateBlockingItems.some((item) => !item.gateReady);
  const canRequestFormalReview = evaluated.length > 0 && !hasBlockedViolation && !hasFormalViolation;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canRequestFormalReview ? "ready_for_formal_review" : "blocked",
    canRequestFormalReview,
    items: evaluated,
    total: evaluated.length,
    locallyReady: evaluated.filter((item) => item.locallyReady).length,
    formallyReady: evaluated.filter((item) => item.formallyReady).length,
    gateReady: evaluated.filter((item) => item.gateReady).length,
    blocked,
    formalPending,
    readinessPct: pct(evaluated.filter((item) => item.locallyReady).length, evaluated.length),
    gateReadinessPct: pct(evaluated.filter((item) => item.gateReady).length, evaluated.length),
    nextStep: evaluated.find((item) => item.gateBlocking && !item.gateReady) ?? null,
    categoryTotals: {
      runtime: categoryTotal(evaluated, "runtime"),
      database: categoryTotal(evaluated, "database"),
      methodology: categoryTotal(evaluated, "methodology"),
      work_context: categoryTotal(evaluated, "work_context"),
      intervention: categoryTotal(evaluated, "intervention"),
      release: categoryTotal(evaluated, "release"),
      formal: categoryTotal(evaluated, "formal"),
    },
  };
}

function categoryTotal(items: EvidenceDossierItem[], category: EvidenceDossierCategory) {
  const filtered = items.filter((item) => item.category === category);
  return {
    total: filtered.length,
    gateReady: filtered.filter((item) => item.gateReady).length,
  };
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
