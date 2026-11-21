export type ReleaseProofSource = "local" | "github" | "lovable";
export type ReleaseProofStatus = "verified" | "historical_only" | "local_only" | "unverified" | "blocked";

export type ReleaseProofItemInput = {
  key: string;
  label: string;
  source: ReleaseProofSource;
  status: ReleaseProofStatus;
  requiresAttestedBaselineRef: boolean;
  evidenceRef: string | null;
  observedCommitRef: string | null;
  detail: string;
  nextAction: string;
};

export type ReleaseProofPacketInput = {
  packetId: string;
  version: string;
  observedAt: string;
  attestedBaselineRef: string | null;
  sourceHeadRef: string;
  proofs: readonly ReleaseProofItemInput[];
};

export type ReleaseProofPacketPolicy = {
  policyId: string;
  requiredProofKeys: readonly string[];
  requireAttestedBaselineRef: boolean;
  requireEvidenceRef: boolean;
  prohibitPublish: boolean;
  prohibitMerge: boolean;
  prohibitDeploy: boolean;
  prohibitGateAdvance: boolean;
  prohibitRealData: boolean;
};

export type ReleaseProofPacketContext = {
  publishPerformed: boolean;
  mergePerformed: boolean;
  deployPerformed: boolean;
  gateAdvanceClaimed: boolean;
  realDataEnabled: boolean;
};

export type ReleaseProofPacketBlocker =
  | "packet_identity_missing"
  | "required_proof_missing"
  | "duplicate_proof"
  | "attested_baseline_ref_missing"
  | "proof_not_verified"
  | "evidence_ref_missing"
  | "proof_commit_mismatch"
  | "publish_performed"
  | "merge_performed"
  | "deploy_performed"
  | "gate_advance_claimed"
  | "real_data_enabled";

export type ReleaseProofItem = ReleaseProofItemInput & {
  ready: boolean;
  blockers: ReleaseProofPacketBlocker[];
};

export type ReleaseProofPacketSummary = {
  policyId: string;
  packetId: string;
  version: string;
  observedAt: string;
  status: "blocked" | "ready_for_release_review";
  canRequestReleaseReview: boolean;
  canPublish: false;
  canMerge: false;
  canDeploy: false;
  canClaimCurrentSync: false;
  canAdvanceGate: false;
  canUseRealData: false;
  attestedBaselineRef: string | null;
  sourceHeadRef: string;
  proofs: ReleaseProofItem[];
  blockers: ReleaseProofPacketBlocker[];
  verified: number;
  historicalOnly: number;
  localOnly: number;
  unverified: number;
  blocked: number;
  total: number;
  nextProof: ReleaseProofItem | null;
};

export function evaluateReleaseProofPacket(
  packet: ReleaseProofPacketInput,
  context: ReleaseProofPacketContext,
  policy: ReleaseProofPacketPolicy,
): ReleaseProofPacketSummary {
  const keys = packet.proofs.map((proof) => proof.key);
  const attestedBaselineRef = packet.attestedBaselineRef?.trim() || null;
  const proofs = packet.proofs.map((proof): ReleaseProofItem => {
    const blockers: ReleaseProofPacketBlocker[] = [];
    if (proof.status !== "verified") blockers.push("proof_not_verified");
    if (policy.requireEvidenceRef && !proof.evidenceRef?.trim()) blockers.push("evidence_ref_missing");
    if (
      proof.status === "verified" &&
      proof.requiresAttestedBaselineRef &&
      (!attestedBaselineRef || proof.observedCommitRef !== attestedBaselineRef)
    ) {
      blockers.push("proof_commit_mismatch");
    }
    return { ...proof, ready: blockers.length === 0, blockers };
  });
  const blockers = proofs.flatMap((proof) => proof.blockers);

  if (!packet.packetId.trim() || !packet.version.trim() || !packet.observedAt.trim()) blockers.push("packet_identity_missing");
  if (policy.requiredProofKeys.some((key) => !keys.includes(key))) blockers.push("required_proof_missing");
  if (new Set(keys).size !== keys.length) blockers.push("duplicate_proof");
  if (policy.requireAttestedBaselineRef && !attestedBaselineRef) blockers.push("attested_baseline_ref_missing");
  if (context.publishPerformed && policy.prohibitPublish) blockers.push("publish_performed");
  if (context.mergePerformed && policy.prohibitMerge) blockers.push("merge_performed");
  if (context.deployPerformed && policy.prohibitDeploy) blockers.push("deploy_performed");
  if (context.gateAdvanceClaimed && policy.prohibitGateAdvance) blockers.push("gate_advance_claimed");
  if (context.realDataEnabled && policy.prohibitRealData) blockers.push("real_data_enabled");

  const uniqueBlockers = unique(blockers);
  const requiredProofs = policy.requiredProofKeys.map((key) => proofs.find((proof) => proof.key === key));
  const canRequestReleaseReview =
    requiredProofs.length > 0 &&
    requiredProofs.every((proof) => proof?.ready) &&
    uniqueBlockers.length === 0;

  return {
    policyId: policy.policyId,
    packetId: packet.packetId,
    version: packet.version,
    observedAt: packet.observedAt,
    status: canRequestReleaseReview ? "ready_for_release_review" : "blocked",
    canRequestReleaseReview,
    canPublish: false,
    canMerge: false,
    canDeploy: false,
    canClaimCurrentSync: false,
    canAdvanceGate: false,
    canUseRealData: false,
    attestedBaselineRef,
    sourceHeadRef: packet.sourceHeadRef,
    proofs,
    blockers: uniqueBlockers,
    verified: proofs.filter((proof) => proof.status === "verified").length,
    historicalOnly: proofs.filter((proof) => proof.status === "historical_only").length,
    localOnly: proofs.filter((proof) => proof.status === "local_only").length,
    unverified: proofs.filter((proof) => proof.status === "unverified").length,
    blocked: proofs.filter((proof) => proof.status === "blocked").length,
    total: proofs.length,
    nextProof: proofs.find((proof) => !proof.ready) ?? null,
  };
}

export function releaseProofPacketBlockerLabel(blocker: ReleaseProofPacketBlocker) {
  const labels: Record<ReleaseProofPacketBlocker, string> = {
    packet_identity_missing: "Versionar e datar o pacote de comprovação.",
    required_proof_missing: "Restaurar todas as provas obrigatórias do release.",
    duplicate_proof: "Remover provas duplicadas do pacote.",
    attested_baseline_ref_missing: "Vincular o pacote ao baseline público observado.",
    proof_not_verified: "Obter uma prova verificável para o release candidato.",
    evidence_ref_missing: "Vincular recibo, run ou referência auditável.",
    proof_commit_mismatch: "Vincular a prova ao mesmo baseline público atestado.",
    publish_performed: "Remover alegação de publicação desta etapa somente leitura.",
    merge_performed: "Remover alegação de merge desta etapa somente leitura.",
    deploy_performed: "Remover alegação de deploy desta etapa somente leitura.",
    gate_advance_claimed: "Remover qualquer alegação de avanço de gate.",
    real_data_enabled: "Manter dados reais bloqueados.",
  };
  return labels[blocker];
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values));
}
