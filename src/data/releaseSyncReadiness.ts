import type { PublishedBaselineEvidence, PublishedBaselinePolicy } from "@/lib/release/syncReadiness";
import { g1ReleaseEvidenceManifest } from "@/data/g1ReleaseEvidenceManifest";
import { buildPublishedBaselineEvidenceFromManifest } from "@/lib/release/releaseEvidenceManifest";

export const publishedBaselinePolicy: PublishedBaselinePolicy = {
  policyId: "github-lovable-published-baseline-g1-2026-07-18",
  targets: ["github", "lovable"],
  requireGitRepository: true,
  requireGitRemote: true,
  requireWorkingTreeAudit: true,
  requireLocalCi: true,
  requireGithubActions: true,
  requireDatabaseCi: true,
  requireBranchProtection: true,
  requireLovableProjectLink: true,
  requireLovablePublishedBaseline: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
};

export const officialPublishedBaselineEvidence: PublishedBaselineEvidence =
  buildPublishedBaselineEvidenceFromManifest(g1ReleaseEvidenceManifest);
