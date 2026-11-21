export type CanonicalPackageArtifactStatus =
  | "missing"
  | "submitted"
  | "verified"
  | "approved"
  | "rejected";

export type CanonicalPackageArtifactInput = {
  key: string;
  label: string;
  status: CanonicalPackageArtifactStatus;
  sha256: string | null;
  ownerRole: string | null;
  required: boolean;
  dependsOn: string[];
  evidenceRef: string | null;
};

export type CanonicalPackageManifestInput = {
  manifestId: string;
  instrumentKey: string;
  version: string;
  artifacts: CanonicalPackageArtifactInput[];
};

export type CanonicalPackageManifestPolicy = {
  policyId: string;
  targetGate: "G1";
  instrumentKey: string;
  requiredArtifactKeys: string[];
  requireSemverVersion: boolean;
  requireHashForRequiredArtifacts: boolean;
  requireOwnerForRequiredArtifacts: boolean;
  requireAllRequiredSubmittedForReview: boolean;
  requireAllRequiredApprovedToSeal: boolean;
  prohibitRuntimeReady: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type CanonicalPackageManifestContext = {
  runtimeReady: boolean;
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
};

export type CanonicalPackageManifestBlocker =
  | "manifest_id_missing"
  | "instrument_mismatch"
  | "invalid_semver"
  | "required_artifact_missing"
  | "duplicate_artifact_key"
  | "artifact_hash_missing"
  | "artifact_owner_missing"
  | "artifact_rejected"
  | "dependency_missing"
  | "self_dependency"
  | "required_artifact_not_approved"
  | "runtime_ready_before_manifest"
  | "real_data_enabled"
  | "gate_advance_claimed";

export type CanonicalPackageArtifact = CanonicalPackageArtifactInput & {
  submitted: boolean;
  approved: boolean;
  hashPresent: boolean;
  ownerAssigned: boolean;
  blockers: CanonicalPackageManifestBlocker[];
};

export type CanonicalPackageManifestSummary = {
  policyId: string;
  targetGate: "G1";
  manifestId: string;
  instrumentKey: string;
  version: string;
  status: "blocked" | "ready_for_manifest_review" | "sealed_for_methodology";
  canReviewManifest: boolean;
  canSealManifest: boolean;
  artifacts: CanonicalPackageArtifact[];
  blockers: CanonicalPackageManifestBlocker[];
  total: number;
  requiredTotal: number;
  requiredListed: number;
  requiredSubmitted: number;
  requiredApproved: number;
  missing: number;
  submitted: number;
  verified: number;
  approved: number;
  rejected: number;
  manifestReadinessPct: number;
  sealReadinessPct: number;
  nextStep: CanonicalPackageArtifact | null;
};

const SHA256 = /^[a-f0-9]{64}$/i;
const SEMVERISH = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export function evaluateCanonicalPackageManifest(
  manifest: CanonicalPackageManifestInput,
  context: CanonicalPackageManifestContext,
  policy: CanonicalPackageManifestPolicy,
): CanonicalPackageManifestSummary {
  const requiredKeys = new Set(policy.requiredArtifactKeys);
  const artifactKeys = manifest.artifacts.map((artifact) => artifact.key);
  const knownKeys = new Set(artifactKeys);
  const duplicateKeys = findDuplicateKeys(artifactKeys);
  const requiredMissingKeys = policy.requiredArtifactKeys.filter((key) => !knownKeys.has(key));

  const evaluated = manifest.artifacts.map((artifact) => {
    const blockers = evaluateArtifact(artifact, requiredKeys, knownKeys, duplicateKeys, policy);
    return {
      ...artifact,
      submitted: isSubmitted(artifact.status),
      approved: artifact.status === "approved",
      hashPresent: Boolean(artifact.sha256 && SHA256.test(artifact.sha256)),
      ownerAssigned: Boolean(artifact.ownerRole),
      blockers,
    };
  });

  const blockers: CanonicalPackageManifestBlocker[] = evaluated.flatMap((artifact) => artifact.blockers);

  if (!manifest.manifestId.trim()) blockers.push("manifest_id_missing");
  if (manifest.instrumentKey !== policy.instrumentKey) blockers.push("instrument_mismatch");
  if (policy.requireSemverVersion && !SEMVERISH.test(manifest.version)) blockers.push("invalid_semver");
  if (requiredMissingKeys.length > 0) blockers.push("required_artifact_missing");
  if (policy.prohibitRuntimeReady && context.runtimeReady) blockers.push("runtime_ready_before_manifest");
  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.push("gate_advance_claimed");

  const uniqueBlockers = unique(blockers);
  const reviewBlockers = new Set<CanonicalPackageManifestBlocker>([
    "manifest_id_missing",
    "instrument_mismatch",
    "invalid_semver",
    "required_artifact_missing",
    "duplicate_artifact_key",
    "artifact_hash_missing",
    "artifact_owner_missing",
    "artifact_rejected",
    "dependency_missing",
    "self_dependency",
    "runtime_ready_before_manifest",
    "real_data_enabled",
    "gate_advance_claimed",
  ]);
  const hasReviewBlocker = uniqueBlockers.some((blocker) => reviewBlockers.has(blocker));
  const requiredTotal = policy.requiredArtifactKeys.length;
  const requiredListed = countRequiredByKey(policy.requiredArtifactKeys, evaluated, () => true);
  const requiredSubmitted = countRequiredByKey(policy.requiredArtifactKeys, evaluated, (artifact) => artifact.submitted);
  const requiredApproved = countRequiredByKey(policy.requiredArtifactKeys, evaluated, (artifact) => artifact.approved);
  const canReviewManifest =
    requiredTotal > 0 &&
    (!policy.requireAllRequiredSubmittedForReview || requiredSubmitted === requiredTotal) &&
    !hasReviewBlocker;
  const canSealManifest =
    canReviewManifest &&
    (!policy.requireAllRequiredApprovedToSeal || requiredApproved === requiredTotal) &&
    !uniqueBlockers.includes("required_artifact_not_approved");

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    manifestId: manifest.manifestId,
    instrumentKey: policy.instrumentKey,
    version: manifest.version,
    status: canSealManifest
      ? "sealed_for_methodology"
      : canReviewManifest
        ? "ready_for_manifest_review"
        : "blocked",
    canReviewManifest,
    canSealManifest,
    artifacts: evaluated,
    blockers: uniqueBlockers,
    total: evaluated.length,
    requiredTotal,
    requiredListed,
    requiredSubmitted,
    requiredApproved,
    missing: evaluated.filter((artifact) => artifact.status === "missing").length,
    submitted: evaluated.filter((artifact) => artifact.status === "submitted").length,
    verified: evaluated.filter((artifact) => artifact.status === "verified").length,
    approved: evaluated.filter((artifact) => artifact.approved).length,
    rejected: evaluated.filter((artifact) => artifact.status === "rejected").length,
    manifestReadinessPct: pct(requiredSubmitted, requiredTotal),
    sealReadinessPct: pct(requiredApproved, requiredTotal),
    nextStep: evaluated.find((artifact) => artifact.blockers.some((blocker) => blocker !== "required_artifact_not_approved"))
      ?? evaluated.find((artifact) => artifact.required && !artifact.approved)
      ?? null,
  };
}

export function canonicalPackageManifestBlockerLabel(blocker: CanonicalPackageManifestBlocker) {
  const labels: Record<CanonicalPackageManifestBlocker, string> = {
    manifest_id_missing: "Registrar identificador versionado do manifesto.",
    instrument_mismatch: "Corrigir o instrumento alvo do manifesto.",
    invalid_semver: "Usar versao semantica verificavel para o pacote.",
    required_artifact_missing: "Incluir todos os artefatos obrigatorios no manifesto.",
    duplicate_artifact_key: "Remover chaves duplicadas de artefato.",
    artifact_hash_missing: "Registrar SHA-256 valido para artefato obrigatorio.",
    artifact_owner_missing: "Atribuir owner responsavel por artefato obrigatorio.",
    artifact_rejected: "Substituir artefato rejeitado antes da revisao.",
    dependency_missing: "Corrigir dependencia que aponta para artefato inexistente.",
    self_dependency: "Remover dependencia circular direta do artefato.",
    required_artifact_not_approved: "Aprovar todos os artefatos obrigatorios antes de selar o pacote.",
    runtime_ready_before_manifest: "Manter runtime bloqueado ate manifesto canonico selado.",
    real_data_enabled: "Manter dados reais bloqueados durante G1.",
    gate_advance_claimed: "Remover qualquer alegacao de avanco de gate.",
  };
  return labels[blocker];
}

function evaluateArtifact(
  artifact: CanonicalPackageArtifactInput,
  requiredKeys: Set<string>,
  knownKeys: Set<string>,
  duplicateKeys: Set<string>,
  policy: CanonicalPackageManifestPolicy,
): CanonicalPackageManifestBlocker[] {
  const blockers: CanonicalPackageManifestBlocker[] = [];
  const isRequiredArtifact = artifact.required || requiredKeys.has(artifact.key);

  if (duplicateKeys.has(artifact.key)) blockers.push("duplicate_artifact_key");
  if (isRequiredArtifact && artifact.status === "missing") blockers.push("required_artifact_missing");
  if (artifact.status === "rejected") blockers.push("artifact_rejected");
  if (
    isRequiredArtifact &&
    policy.requireHashForRequiredArtifacts &&
    (!artifact.sha256 || !SHA256.test(artifact.sha256))
  ) {
    blockers.push("artifact_hash_missing");
  }
  if (isRequiredArtifact && policy.requireOwnerForRequiredArtifacts && !artifact.ownerRole) {
    blockers.push("artifact_owner_missing");
  }
  if (
    isRequiredArtifact &&
    policy.requireAllRequiredApprovedToSeal &&
    artifact.status !== "approved"
  ) {
    blockers.push("required_artifact_not_approved");
  }

  artifact.dependsOn.forEach((dependency) => {
    if (dependency === artifact.key) blockers.push("self_dependency");
    if (!knownKeys.has(dependency)) blockers.push("dependency_missing");
  });

  return unique(blockers);
}

function isSubmitted(status: CanonicalPackageArtifactStatus) {
  return status === "submitted" || status === "verified" || status === "approved";
}

function findDuplicateKeys(keys: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  keys.forEach((key) => {
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  });
  return duplicates;
}

function countRequiredByKey(
  requiredKeys: string[],
  artifacts: CanonicalPackageArtifact[],
  predicate: (artifact: CanonicalPackageArtifact) => boolean,
) {
  return requiredKeys.filter((key) => artifacts.some((artifact) => artifact.key === key && predicate(artifact))).length;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
