export type InstrumentMethodologyArea =
  | "source"
  | "license"
  | "translation"
  | "content"
  | "scoring"
  | "fixtures"
  | "review"
  | "runtime";

export type InstrumentMethodologyStatus = "missing" | "draft" | "review" | "approved";

export type InstrumentMethodologyCheckInput = {
  key: string;
  label: string;
  area: InstrumentMethodologyArea;
  status: InstrumentMethodologyStatus;
  gateBlocking: boolean;
  evidenceRef: string | null;
  detail: string;
};

export type InstrumentMethodologyPolicy = {
  policyId: string;
  targetGate: "G1";
  instrumentKey: string;
  version: string;
  requireAllGateBlockingApproved: boolean;
  requireRuntimeDisabledUntilApproved: boolean;
};

export type InstrumentMethodologyContext = {
  runtimeReady: boolean;
};

export type InstrumentMethodologyBlocker =
  | "methodology_missing"
  | "methodology_in_draft"
  | "methodology_under_review"
  | "runtime_enabled_before_approval";

export type InstrumentMethodologyCheck = InstrumentMethodologyCheckInput & {
  approved: boolean;
  blockers: InstrumentMethodologyBlocker[];
};

export type InstrumentMethodologySummary = {
  policyId: string;
  targetGate: "G1";
  instrumentKey: string;
  version: string;
  status: "blocked" | "ready_for_review" | "ready_for_runtime_approval";
  canSubmitForReview: boolean;
  canApproveForRuntime: boolean;
  checks: InstrumentMethodologyCheck[];
  blockers: InstrumentMethodologyBlocker[];
  total: number;
  approved: number;
  gateBlockingTotal: number;
  gateBlockingApproved: number;
  missing: number;
  draft: number;
  review: number;
  readinessPct: number;
  gateReadinessPct: number;
  nextStep: InstrumentMethodologyCheck | null;
};

export function evaluateInstrumentMethodologyReadiness(
  checks: InstrumentMethodologyCheckInput[],
  context: InstrumentMethodologyContext,
  policy: InstrumentMethodologyPolicy,
): InstrumentMethodologySummary {
  const evaluated = checks.map((check) => {
    const blockers = evaluateCheck(check, policy);
    return {
      ...check,
      approved: check.status === "approved",
      blockers,
    };
  });
  const gateBlockingChecks = evaluated.filter((check) => check.gateBlocking);
  const gateBlockingApproved = gateBlockingChecks.filter((check) => check.approved).length;
  const allGateBlockingApproved =
    gateBlockingChecks.length > 0 && gateBlockingApproved === gateBlockingChecks.length;
  const hasMissingOrDraft = gateBlockingChecks.some(
    (check) => check.status === "missing" || check.status === "draft",
  );
  const blockers = unique(evaluated.flatMap((check) => check.blockers));

  if (policy.requireRuntimeDisabledUntilApproved && context.runtimeReady && !allGateBlockingApproved) {
    blockers.push("runtime_enabled_before_approval");
  }

  const canSubmitForReview = gateBlockingChecks.length > 0 && !hasMissingOrDraft;
  const canApproveForRuntime =
    policy.requireAllGateBlockingApproved &&
    allGateBlockingApproved &&
    !blockers.includes("runtime_enabled_before_approval");

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    instrumentKey: policy.instrumentKey,
    version: policy.version,
    status: canApproveForRuntime
      ? "ready_for_runtime_approval"
      : canSubmitForReview
        ? "ready_for_review"
        : "blocked",
    canSubmitForReview,
    canApproveForRuntime,
    checks: evaluated,
    blockers: unique(blockers),
    total: evaluated.length,
    approved: evaluated.filter((check) => check.approved).length,
    gateBlockingTotal: gateBlockingChecks.length,
    gateBlockingApproved,
    missing: evaluated.filter((check) => check.status === "missing").length,
    draft: evaluated.filter((check) => check.status === "draft").length,
    review: evaluated.filter((check) => check.status === "review").length,
    readinessPct: pct(evaluated.filter((check) => check.approved).length, evaluated.length),
    gateReadinessPct: pct(gateBlockingApproved, gateBlockingChecks.length),
    nextStep: gateBlockingChecks.find((check) => !check.approved) ?? null,
  };
}

export function instrumentMethodologyBlockerLabel(blocker: InstrumentMethodologyBlocker) {
  const labels: Record<InstrumentMethodologyBlocker, string> = {
    methodology_missing: "Fornecer evidencia metodologica verificavel.",
    methodology_in_draft: "Concluir o rascunho e submeter para revisao independente.",
    methodology_under_review: "Concluir revisao e registrar aprovacao competente.",
    runtime_enabled_before_approval: "Manter runtime desabilitado ate todos os criterios estarem aprovados.",
  };
  return labels[blocker];
}

function evaluateCheck(
  check: InstrumentMethodologyCheckInput,
  policy: InstrumentMethodologyPolicy,
): InstrumentMethodologyBlocker[] {
  if (!check.gateBlocking || !policy.requireAllGateBlockingApproved) return [];
  if (check.status === "missing") return ["methodology_missing"];
  if (check.status === "draft") return ["methodology_in_draft"];
  if (check.status === "review") return ["methodology_under_review"];
  return [];
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
