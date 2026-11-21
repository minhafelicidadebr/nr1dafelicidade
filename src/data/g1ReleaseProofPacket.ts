import { g1ReleaseEvidenceManifest } from "@/data/g1ReleaseEvidenceManifest";
import {
  evaluateReleaseProofPacket,
  type ReleaseProofPacketContext,
  type ReleaseProofPacketPolicy,
} from "@/lib/release/releaseProofPacket";
import { buildReleaseProofPacketFromManifest } from "@/lib/release/releaseEvidenceManifest";

export const g1ReleaseProofPacketPolicy: ReleaseProofPacketPolicy = Object.freeze({
  policyId: "g1-release-proof-packet-2026-07-20.4",
  requiredProofKeys: [
    "git_repository",
    "git_remote",
    "working_tree_audit",
    "local_ci",
    "github_app_ci",
    "github_database_ci",
    "github_browser_ci",
    "baseline_merge",
    "branch_protection",
    "lovable_project_link",
    "lovable_published_baseline",
  ] as const,
  requireAttestedBaselineRef: true,
  requireEvidenceRef: true,
  prohibitPublish: true,
  prohibitMerge: true,
  prohibitDeploy: true,
  prohibitGateAdvance: true,
  prohibitRealData: true,
});

export const g1ReleaseProofPacketContext: ReleaseProofPacketContext = Object.freeze({
  publishPerformed: false,
  mergePerformed: false,
  deployPerformed: false,
  gateAdvanceClaimed: g1ReleaseEvidenceManifest.gates.gateAdvanceClaimed,
  realDataEnabled: g1ReleaseEvidenceManifest.gates.realDataEnabled,
});

export const g1ReleaseProofPacket = buildReleaseProofPacketFromManifest(
  g1ReleaseEvidenceManifest,
);

export const g1ReleaseProofPacketSummary = evaluateReleaseProofPacket(
  g1ReleaseProofPacket,
  g1ReleaseProofPacketContext,
  g1ReleaseProofPacketPolicy,
);
