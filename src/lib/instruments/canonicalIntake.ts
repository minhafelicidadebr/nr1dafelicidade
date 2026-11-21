export type CanonicalInstrumentArtifactType =
  | "primary_source"
  | "license"
  | "instrument_definition"
  | "response_scale"
  | "subscale_map"
  | "scoring_spec"
  | "fixture_pack"
  | "usage_limitations"
  | "review_packet";

export type CanonicalInstrumentArtifactStatus =
  | "missing"
  | "submitted"
  | "verified"
  | "approved"
  | "rejected";

export type CanonicalInstrumentArtifactInput = {
  key: string;
  label: string;
  type: CanonicalInstrumentArtifactType;
  status: CanonicalInstrumentArtifactStatus;
  requiredForReview: boolean;
  requiredForMethodologyGate: boolean;
  checksumSha256: string | null;
  evidenceRef: string | null;
  ownerAssigned: boolean;
  detail: string;
};

export type CanonicalInstrumentIntakePolicy = {
  policyId: string;
  targetGate: "G1";
  instrumentKey: string;
  requireAllReviewArtifactsSubmitted: boolean;
  requireAllMethodologyArtifactsApproved: boolean;
  requireChecksumForReviewArtifacts: boolean;
  requireOwnerForReviewArtifacts: boolean;
  prohibitRuntimeReady: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type CanonicalInstrumentIntakeContext = {
  runtimeReady: boolean;
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
};

export type CanonicalInstrumentIntakeBlocker =
  | "artifact_missing"
  | "artifact_rejected"
  | "artifact_checksum_missing"
  | "artifact_owner_missing"
  | "methodology_artifact_not_approved"
  | "runtime_ready_before_intake"
  | "real_data_enabled"
  | "gate_advance_claimed";

export type CanonicalInstrumentArtifact = CanonicalInstrumentArtifactInput & {
  submitted: boolean;
  approved: boolean;
  blockers: CanonicalInstrumentIntakeBlocker[];
};

export type CanonicalInstrumentIntakeSummary = {
  policyId: string;
  targetGate: "G1";
  instrumentKey: string;
  status: "blocked" | "ready_for_intake_review" | "ready_for_methodology_gate";
  canOpenIntakeReview: boolean;
  canPromoteToMethodologyGate: boolean;
  artifacts: CanonicalInstrumentArtifact[];
  blockers: CanonicalInstrumentIntakeBlocker[];
  total: number;
  submitted: number;
  verified: number;
  approved: number;
  missing: number;
  rejected: number;
  reviewRequired: number;
  reviewSubmitted: number;
  methodologyRequired: number;
  methodologyApproved: number;
  intakeReadinessPct: number;
  methodologyReadinessPct: number;
  nextStep: CanonicalInstrumentArtifact | null;
};

const SHA256 = /^[a-f0-9]{64}$/i;

export function evaluateCanonicalInstrumentIntake(
  artifacts: CanonicalInstrumentArtifactInput[],
  context: CanonicalInstrumentIntakeContext,
  policy: CanonicalInstrumentIntakePolicy,
): CanonicalInstrumentIntakeSummary {
  const evaluated = artifacts.map((artifact) => {
    const blockers = evaluateArtifact(artifact, policy);
    return {
      ...artifact,
      submitted: artifact.status === "submitted" || artifact.status === "verified" || artifact.status === "approved",
      approved: artifact.status === "approved",
      blockers,
    };
  });
  const blockers = evaluated.flatMap((artifact) => artifact.blockers);
  const reviewRequired = evaluated.filter((artifact) => artifact.requiredForReview);
  const methodologyRequired = evaluated.filter((artifact) => artifact.requiredForMethodologyGate);
  const reviewSubmitted = reviewRequired.filter((artifact) => artifact.submitted).length;
  const methodologyApproved = methodologyRequired.filter((artifact) => artifact.approved).length;

  if (policy.prohibitRuntimeReady && context.runtimeReady) blockers.push("runtime_ready_before_intake");
  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.push("gate_advance_claimed");

  const uniqueBlockers = unique(blockers);
  const reviewArtifactBlockers = new Set<CanonicalInstrumentIntakeBlocker>([
    "artifact_missing",
    "artifact_rejected",
    "artifact_checksum_missing",
    "artifact_owner_missing",
  ]);
  const hasReviewBlocker = uniqueBlockers.some((blocker) => reviewArtifactBlockers.has(blocker));
  const hasContextBlocker = uniqueBlockers.some((blocker) =>
    ["runtime_ready_before_intake", "real_data_enabled", "gate_advance_claimed"].includes(blocker),
  );
  const canOpenIntakeReview =
    reviewRequired.length > 0 &&
    (!policy.requireAllReviewArtifactsSubmitted || reviewSubmitted === reviewRequired.length) &&
    !hasReviewBlocker &&
    !hasContextBlocker;
  const canPromoteToMethodologyGate =
    canOpenIntakeReview &&
    methodologyRequired.length > 0 &&
    (!policy.requireAllMethodologyArtifactsApproved || methodologyApproved === methodologyRequired.length) &&
    !uniqueBlockers.includes("methodology_artifact_not_approved");

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    instrumentKey: policy.instrumentKey,
    status: canPromoteToMethodologyGate
      ? "ready_for_methodology_gate"
      : canOpenIntakeReview
        ? "ready_for_intake_review"
        : "blocked",
    canOpenIntakeReview,
    canPromoteToMethodologyGate,
    artifacts: evaluated,
    blockers: uniqueBlockers,
    total: evaluated.length,
    submitted: evaluated.filter((artifact) => artifact.submitted).length,
    verified: evaluated.filter((artifact) => artifact.status === "verified").length,
    approved: evaluated.filter((artifact) => artifact.approved).length,
    missing: evaluated.filter((artifact) => artifact.status === "missing").length,
    rejected: evaluated.filter((artifact) => artifact.status === "rejected").length,
    reviewRequired: reviewRequired.length,
    reviewSubmitted,
    methodologyRequired: methodologyRequired.length,
    methodologyApproved,
    intakeReadinessPct: pct(reviewSubmitted, reviewRequired.length),
    methodologyReadinessPct: pct(methodologyApproved, methodologyRequired.length),
    nextStep: reviewRequired.find((artifact) => artifact.blockers.length > 0)
      ?? methodologyRequired.find((artifact) => !artifact.approved)
      ?? null,
  };
}

export function canonicalInstrumentIntakeBlockerLabel(blocker: CanonicalInstrumentIntakeBlocker) {
  const labels: Record<CanonicalInstrumentIntakeBlocker, string> = {
    artifact_missing: "Anexar artefato canonico obrigatorio.",
    artifact_rejected: "Substituir artefato rejeitado por versao corrigida.",
    artifact_checksum_missing: "Registrar hash SHA-256 para garantir integridade.",
    artifact_owner_missing: "Nomear responsavel pelo artefato antes da revisao.",
    methodology_artifact_not_approved: "Aprovar todos os artefatos metodologicos antes de promover o gate.",
    runtime_ready_before_intake: "Manter runtime bloqueado ate intake canonico completo.",
    real_data_enabled: "Manter dados reais bloqueados durante G1.",
    gate_advance_claimed: "Remover qualquer alegacao de avanco de gate.",
  };
  return labels[blocker];
}

function evaluateArtifact(
  artifact: CanonicalInstrumentArtifactInput,
  policy: CanonicalInstrumentIntakePolicy,
): CanonicalInstrumentIntakeBlocker[] {
  const blockers: CanonicalInstrumentIntakeBlocker[] = [];

  if (artifact.requiredForReview && policy.requireAllReviewArtifactsSubmitted) {
    if (artifact.status === "missing") blockers.push("artifact_missing");
    if (artifact.status === "rejected") blockers.push("artifact_rejected");
    if (
      policy.requireChecksumForReviewArtifacts &&
      artifact.status !== "missing" &&
      artifact.status !== "rejected" &&
      (!artifact.checksumSha256 || !SHA256.test(artifact.checksumSha256))
    ) {
      blockers.push("artifact_checksum_missing");
    }
    if (policy.requireOwnerForReviewArtifacts && !artifact.ownerAssigned) {
      blockers.push("artifact_owner_missing");
    }
  }

  if (
    artifact.requiredForMethodologyGate &&
    policy.requireAllMethodologyArtifactsApproved &&
    artifact.status !== "approved"
  ) {
    blockers.push("methodology_artifact_not_approved");
  }

  return blockers;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
