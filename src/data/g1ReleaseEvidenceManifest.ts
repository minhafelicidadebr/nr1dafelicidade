import manifestJson from "../../docs/release/G1_RELEASE_EVIDENCE_MANIFEST.json";
import {
  assertReleaseEvidenceManifest,
  evaluateReleaseEvidenceManifest,
  type ReleaseEvidenceManifestPolicy,
} from "@/lib/release/releaseEvidenceManifest";

export const g1ReleaseEvidenceManifestPolicy: ReleaseEvidenceManifestPolicy = Object.freeze({
  policyId: "g1-release-evidence-2026-07-20.4",
  repository: "minhafelicidadebr/playbook-nr1-chagpt-sol",
  defaultBranch: "main",
  approvedGate: "G0",
  targetGate: "G1",
  requiredCiJobs: ["verify", "database-security", "browser-quality"],
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
  ],
  requireMergedBaseline: true,
  prohibitG1Approval: true,
  prohibitGateAdvance: true,
  prohibitRealData: true,
  requireExternalPublicationBlocked: true,
  requireBillingSandboxOnly: true,
  requireMethodologyBlocked: true,
  requireFormalAcceptanceBlocked: true,
});

export const g1ReleaseEvidenceManifestSummary = evaluateReleaseEvidenceManifest(
  manifestJson,
  g1ReleaseEvidenceManifestPolicy,
);

export const g1ReleaseEvidenceManifest = assertReleaseEvidenceManifest(
  manifestJson,
  g1ReleaseEvidenceManifestPolicy,
);
