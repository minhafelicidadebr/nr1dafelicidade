import { describe, expect, it } from "vitest";
import {
  g1CanonicalPackageManifest,
  g1CanonicalPackageManifestContext,
  g1CanonicalPackageManifestPolicy,
} from "@/data/g1CanonicalPackageManifest";
import {
  evaluateCanonicalPackageManifest,
  type CanonicalPackageArtifactInput,
  type CanonicalPackageManifestInput,
} from "./canonicalPackageManifest";

const checksum = "b".repeat(64);

describe("canonical package manifest", () => {
  it("keeps the current package blocked while canonical artifacts are missing", () => {
    const result = evaluateCanonicalPackageManifest(
      g1CanonicalPackageManifest,
      g1CanonicalPackageManifestContext,
      g1CanonicalPackageManifestPolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.canReviewManifest).toBe(false);
    expect(result.canSealManifest).toBe(false);
    expect(result.nextStep?.key).toBe("primary_source_manual");
    expect(result.requiredTotal).toBe(9);
    expect(result.requiredSubmitted).toBe(1);
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "required_artifact_missing",
        "artifact_hash_missing",
        "artifact_owner_missing",
        "required_artifact_not_approved",
      ]),
    );
  });

  it("opens manifest review when every required artifact is submitted with hash and owner", () => {
    const result = evaluateCanonicalPackageManifest(
      withArtifacts(submittedArtifacts()),
      g1CanonicalPackageManifestContext,
      g1CanonicalPackageManifestPolicy,
    );

    expect(result.status).toBe("ready_for_manifest_review");
    expect(result.canReviewManifest).toBe(true);
    expect(result.canSealManifest).toBe(false);
    expect(result.requiredSubmitted).toBe(9);
    expect(result.manifestReadinessPct).toBe(100);
    expect(result.blockers).toEqual(["required_artifact_not_approved"]);
  });

  it("seals the manifest only after every required artifact is approved", () => {
    const result = evaluateCanonicalPackageManifest(
      withArtifacts(approvedArtifacts()),
      g1CanonicalPackageManifestContext,
      g1CanonicalPackageManifestPolicy,
    );

    expect(result.status).toBe("sealed_for_methodology");
    expect(result.canReviewManifest).toBe(true);
    expect(result.canSealManifest).toBe(true);
    expect(result.requiredApproved).toBe(9);
    expect(result.sealReadinessPct).toBe(100);
    expect(result.nextStep).toBeNull();
    expect(result.blockers).toEqual([]);
  });

  it("fails closed on duplicate keys and invalid dependencies", () => {
    const artifacts = approvedArtifacts();
    const result = evaluateCanonicalPackageManifest(
      withArtifacts([
        ...artifacts,
        {
          ...artifacts[0],
          label: "Duplicate source manual",
          dependsOn: ["primary_source_manual", "missing_dependency"],
        },
      ]),
      g1CanonicalPackageManifestContext,
      g1CanonicalPackageManifestPolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.canReviewManifest).toBe(false);
    expect(result.canSealManifest).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining(["duplicate_artifact_key", "self_dependency", "dependency_missing"]),
    );
  });

  it("fails closed when runtime, real data or gate state are unsafe", () => {
    const result = evaluateCanonicalPackageManifest(
      withArtifacts(approvedArtifacts()),
      {
        runtimeReady: true,
        realDataEnabled: true,
        gateAdvanceClaimed: true,
      },
      g1CanonicalPackageManifestPolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.canReviewManifest).toBe(false);
    expect(result.canSealManifest).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining(["runtime_ready_before_manifest", "real_data_enabled", "gate_advance_claimed"]),
    );
  });
});

function submittedArtifacts(): CanonicalPackageArtifactInput[] {
  return g1CanonicalPackageManifest.artifacts.map((artifact) => ({
    ...artifact,
    status: "submitted",
    sha256: checksum,
    ownerRole: "methodology_owner",
  }));
}

function approvedArtifacts(): CanonicalPackageArtifactInput[] {
  return submittedArtifacts().map((artifact) => ({
    ...artifact,
    status: "approved",
  }));
}

function withArtifacts(artifacts: CanonicalPackageArtifactInput[]): CanonicalPackageManifestInput {
  return {
    ...g1CanonicalPackageManifest,
    artifacts,
  };
}
