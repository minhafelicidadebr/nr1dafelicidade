import type {
  ReleaseProofItemInput,
  ReleaseProofPacketInput,
} from "./releaseProofPacket";
import type { PublishedBaselineEvidence } from "./syncReadiness";

export type ReleaseEvidenceGate = "G0" | "G1" | "G2" | "G3";
export type ReleaseEvidenceCapabilityStatus =
  | "blocked"
  | "sandbox_only"
  | "unverified"
  | "verified";

export type ReleaseEvidenceCiJob = {
  key: string;
  status: "success" | "failure" | "cancelled" | "in_progress";
  observedCommitRef: string;
  evidenceRef: string;
};

export type ReleaseEvidenceManifest = {
  manifestId: string;
  version: string;
  observedAt: string;
  repository: {
    nameWithOwner: string;
    defaultBranch: string;
    publishedBaselineRef: string;
    sourceHeadRef: string;
  };
  integration: {
    pullRequestNumber: number;
    status: "merged";
    mergedAt: string;
    mergeCommitRef: string;
  };
  ci: {
    provider: "github_actions";
    runId: number;
    runUrl: string;
    observedCommitRef: string;
    jobs: readonly ReleaseEvidenceCiJob[];
  };
  gates: {
    approvedGate: ReleaseEvidenceGate;
    targetGate: ReleaseEvidenceGate;
    g1Approved: boolean;
    gateAdvanceClaimed: boolean;
    realDataEnabled: boolean;
  };
  capabilities: {
    externalPublication: ReleaseEvidenceCapabilityStatus;
    billing: ReleaseEvidenceCapabilityStatus;
    methodology: ReleaseEvidenceCapabilityStatus;
    formalAcceptance: ReleaseEvidenceCapabilityStatus;
    lovablePublishedBaseline: ReleaseEvidenceCapabilityStatus;
  };
  proofs: readonly ReleaseProofItemInput[];
};

export type ReleaseEvidenceManifestPolicy = {
  policyId: string;
  repository: string;
  defaultBranch: string;
  approvedGate: ReleaseEvidenceGate;
  targetGate: ReleaseEvidenceGate;
  requiredCiJobs: readonly string[];
  requiredProofKeys: readonly string[];
  requireMergedBaseline: boolean;
  prohibitG1Approval: boolean;
  prohibitGateAdvance: boolean;
  prohibitRealData: boolean;
  requireExternalPublicationBlocked: boolean;
  requireBillingSandboxOnly: boolean;
  requireMethodologyBlocked: boolean;
  requireFormalAcceptanceBlocked: boolean;
};

export type ReleaseEvidenceManifestBlocker =
  | "manifest_schema_invalid"
  | "manifest_identity_missing"
  | "repository_mismatch"
  | "default_branch_mismatch"
  | "baseline_ref_invalid"
  | "merge_not_verified"
  | "merge_commit_mismatch"
  | "ci_run_invalid"
  | "ci_job_missing"
  | "duplicate_ci_job"
  | "ci_job_not_successful"
  | "ci_commit_mismatch"
  | "approved_gate_mismatch"
  | "target_gate_mismatch"
  | "g1_approval_claimed"
  | "gate_advance_claimed"
  | "real_data_enabled"
  | "external_publication_not_blocked"
  | "billing_not_sandbox_only"
  | "methodology_not_blocked"
  | "formal_acceptance_not_blocked"
  | "required_proof_missing"
  | "duplicate_proof"
  | "proof_commit_mismatch";

export type ReleaseEvidenceManifestSummary = {
  policyId: string;
  status: "blocked" | "baseline_verified";
  valid: boolean;
  blockers: ReleaseEvidenceManifestBlocker[];
  manifest: ReleaseEvidenceManifest | null;
};

export function evaluateReleaseEvidenceManifest(
  input: unknown,
  policy: ReleaseEvidenceManifestPolicy,
): ReleaseEvidenceManifestSummary {
  if (!isManifestShape(input)) {
    return blocked(policy, ["manifest_schema_invalid"]);
  }

  const manifest = input;
  const blockers: ReleaseEvidenceManifestBlocker[] = [];
  const publishedBaselineRef = manifest.repository.publishedBaselineRef;

  if (!manifest.manifestId.trim() || !manifest.version.trim() || !manifest.observedAt.trim()) {
    blockers.push("manifest_identity_missing");
  }
  if (manifest.repository.nameWithOwner !== policy.repository) blockers.push("repository_mismatch");
  if (manifest.repository.defaultBranch !== policy.defaultBranch) blockers.push("default_branch_mismatch");
  if (!isSha(publishedBaselineRef) || !isSha(manifest.repository.sourceHeadRef)) blockers.push("baseline_ref_invalid");

  if (
    policy.requireMergedBaseline &&
    (manifest.integration.status !== "merged" ||
      !Number.isInteger(manifest.integration.pullRequestNumber) ||
      manifest.integration.pullRequestNumber <= 0 ||
      !manifest.integration.mergedAt.trim())
  ) {
    blockers.push("merge_not_verified");
  }
  if (manifest.integration.mergeCommitRef !== publishedBaselineRef) blockers.push("merge_commit_mismatch");

  if (!Number.isInteger(manifest.ci.runId) || manifest.ci.runId <= 0 || !manifest.ci.runUrl.trim()) {
    blockers.push("ci_run_invalid");
  }
  if (manifest.ci.observedCommitRef !== publishedBaselineRef) blockers.push("ci_commit_mismatch");

  const ciKeys = manifest.ci.jobs.map((job) => job.key);
  for (const requiredJob of policy.requiredCiJobs) {
    const job = manifest.ci.jobs.find((candidate) => candidate.key === requiredJob);
    if (!job) {
      blockers.push("ci_job_missing");
      continue;
    }
    if (job.status !== "success") blockers.push("ci_job_not_successful");
    if (job.observedCommitRef !== publishedBaselineRef) blockers.push("ci_commit_mismatch");
  }
  if (new Set(ciKeys).size !== ciKeys.length) blockers.push("duplicate_ci_job");

  if (manifest.gates.approvedGate !== policy.approvedGate) blockers.push("approved_gate_mismatch");
  if (manifest.gates.targetGate !== policy.targetGate) blockers.push("target_gate_mismatch");
  if (policy.prohibitG1Approval && manifest.gates.g1Approved) blockers.push("g1_approval_claimed");
  if (policy.prohibitGateAdvance && manifest.gates.gateAdvanceClaimed) blockers.push("gate_advance_claimed");
  if (policy.prohibitRealData && manifest.gates.realDataEnabled) blockers.push("real_data_enabled");

  if (policy.requireExternalPublicationBlocked && manifest.capabilities.externalPublication !== "blocked") {
    blockers.push("external_publication_not_blocked");
  }
  if (policy.requireBillingSandboxOnly && manifest.capabilities.billing !== "sandbox_only") {
    blockers.push("billing_not_sandbox_only");
  }
  if (policy.requireMethodologyBlocked && manifest.capabilities.methodology !== "blocked") {
    blockers.push("methodology_not_blocked");
  }
  if (policy.requireFormalAcceptanceBlocked && manifest.capabilities.formalAcceptance !== "blocked") {
    blockers.push("formal_acceptance_not_blocked");
  }

  const proofKeys = manifest.proofs.map((proof) => proof.key);
  if (policy.requiredProofKeys.some((key) => !proofKeys.includes(key))) blockers.push("required_proof_missing");
  if (new Set(proofKeys).size !== proofKeys.length) blockers.push("duplicate_proof");
  if (manifest.proofs.some((proof) =>
    proof.status === "verified" &&
    proof.requiresAttestedBaselineRef &&
    proof.observedCommitRef !== publishedBaselineRef)) {
    blockers.push("proof_commit_mismatch");
  }

  const uniqueBlockers = unique(blockers);
  return {
    policyId: policy.policyId,
    status: uniqueBlockers.length === 0 ? "baseline_verified" : "blocked",
    valid: uniqueBlockers.length === 0,
    blockers: uniqueBlockers,
    manifest,
  };
}

export function assertReleaseEvidenceManifest(
  input: unknown,
  policy: ReleaseEvidenceManifestPolicy,
): ReleaseEvidenceManifest {
  const summary = evaluateReleaseEvidenceManifest(input, policy);
  if (!summary.valid || !summary.manifest) {
    throw new Error(`RELEASE_EVIDENCE_MANIFEST_BLOCKED:${summary.blockers.join(",")}`);
  }
  return Object.freeze(summary.manifest);
}

export function buildReleaseProofPacketFromManifest(
  manifest: ReleaseEvidenceManifest,
): ReleaseProofPacketInput {
  return {
    packetId: `${manifest.manifestId}-packet`,
    version: manifest.version,
    observedAt: manifest.observedAt,
    attestedBaselineRef: manifest.repository.publishedBaselineRef,
    sourceHeadRef: manifest.repository.sourceHeadRef,
    proofs: manifest.proofs,
  };
}

export function buildPublishedBaselineEvidenceFromManifest(
  manifest: ReleaseEvidenceManifest,
): PublishedBaselineEvidence {
  const proofReady = (key: string) => {
    const proof = manifest.proofs.find((candidate) => candidate.key === key);
    if (!proof || proof.status !== "verified") return false;
    return !proof.requiresAttestedBaselineRef || proof.observedCommitRef === manifest.repository.publishedBaselineRef;
  };

  return {
    hasGitRepository: proofReady("git_repository"),
    hasGitRemote: proofReady("git_remote"),
    workingTreeAudited: proofReady("working_tree_audit"),
    localCiGreen: proofReady("local_ci"),
    githubActionsGreen: proofReady("github_app_ci") && proofReady("github_browser_ci"),
    databaseCiGreen: proofReady("github_database_ci"),
    branchProtectionVerified: proofReady("branch_protection"),
    lovableProjectLinked: proofReady("lovable_project_link"),
    lovablePublishedBaselineVerified:
      manifest.capabilities.lovablePublishedBaseline === "verified" && proofReady("lovable_published_baseline"),
    dataRealEnabled: manifest.gates.realDataEnabled,
    gateAdvanceRequested: manifest.gates.gateAdvanceClaimed,
  };
}

function blocked(
  policy: ReleaseEvidenceManifestPolicy,
  blockers: ReleaseEvidenceManifestBlocker[],
): ReleaseEvidenceManifestSummary {
  return { policyId: policy.policyId, status: "blocked", valid: false, blockers, manifest: null };
}

function isManifestShape(input: unknown): input is ReleaseEvidenceManifest {
  if (!isRecord(input)) return false;
  if (!isString(input.manifestId) || !isString(input.version) || !isString(input.observedAt)) return false;
  if (!isRepository(input.repository) || !isIntegration(input.integration) || !isCi(input.ci)) return false;
  if (!isGates(input.gates) || !isCapabilities(input.capabilities) || !Array.isArray(input.proofs)) return false;
  return input.proofs.every(isProof);
}

function isRepository(value: unknown): value is ReleaseEvidenceManifest["repository"] {
  return isRecord(value) &&
    isString(value.nameWithOwner) &&
    isString(value.defaultBranch) &&
    isString(value.publishedBaselineRef) &&
    isString(value.sourceHeadRef);
}

function isIntegration(value: unknown): value is ReleaseEvidenceManifest["integration"] {
  return isRecord(value) &&
    typeof value.pullRequestNumber === "number" &&
    value.status === "merged" &&
    isString(value.mergedAt) &&
    isString(value.mergeCommitRef);
}

function isCi(value: unknown): value is ReleaseEvidenceManifest["ci"] {
  return isRecord(value) &&
    value.provider === "github_actions" &&
    typeof value.runId === "number" &&
    isString(value.runUrl) &&
    isString(value.observedCommitRef) &&
    Array.isArray(value.jobs) &&
    value.jobs.every((job) => isRecord(job) &&
      isString(job.key) &&
      ["success", "failure", "cancelled", "in_progress"].includes(String(job.status)) &&
      isString(job.observedCommitRef) &&
      isString(job.evidenceRef));
}

function isGates(value: unknown): value is ReleaseEvidenceManifest["gates"] {
  const gates = ["G0", "G1", "G2", "G3"];
  return isRecord(value) &&
    gates.includes(String(value.approvedGate)) &&
    gates.includes(String(value.targetGate)) &&
    typeof value.g1Approved === "boolean" &&
    typeof value.gateAdvanceClaimed === "boolean" &&
    typeof value.realDataEnabled === "boolean";
}

function isCapabilities(value: unknown): value is ReleaseEvidenceManifest["capabilities"] {
  const statuses = ["blocked", "sandbox_only", "unverified", "verified"];
  return isRecord(value) &&
    statuses.includes(String(value.externalPublication)) &&
    statuses.includes(String(value.billing)) &&
    statuses.includes(String(value.methodology)) &&
    statuses.includes(String(value.formalAcceptance)) &&
    statuses.includes(String(value.lovablePublishedBaseline));
}

function isProof(value: unknown): value is ReleaseProofItemInput {
  return isRecord(value) &&
    isString(value.key) &&
    isString(value.label) &&
    ["local", "github", "lovable"].includes(String(value.source)) &&
    ["verified", "historical_only", "local_only", "unverified", "blocked"].includes(String(value.status)) &&
    typeof value.requiresAttestedBaselineRef === "boolean" &&
    isNullableString(value.evidenceRef) &&
    isNullableString(value.observedCommitRef) &&
    isString(value.detail) &&
    isString(value.nextAction);
}

function isSha(value: string) {
  return /^[a-f0-9]{40}$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values));
}
