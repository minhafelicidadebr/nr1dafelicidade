import { describe, expect, it } from "vitest";
import manifestJson from "../../../docs/release/G1_RELEASE_EVIDENCE_MANIFEST.json";
import {
  g1ReleaseEvidenceManifest,
  g1ReleaseEvidenceManifestPolicy,
} from "@/data/g1ReleaseEvidenceManifest";
import {
  buildReleaseProofPacketFromManifest,
  buildPublishedBaselineEvidenceFromManifest,
  evaluateReleaseEvidenceManifest,
} from "./releaseEvidenceManifest";

describe("release evidence manifest", () => {
  it("verifies one post-merge baseline without advancing G1", () => {
    const result = evaluateReleaseEvidenceManifest(manifestJson, g1ReleaseEvidenceManifestPolicy);

    expect(result.status).toBe("baseline_verified");
    expect(result.blockers).toEqual([]);
    expect(result.manifest?.repository.publishedBaselineRef).toBe("4a21c1c7eb9f756a216553fd5237809e588f90d9");
    expect(result.manifest?.gates).toMatchObject({
      approvedGate: "G0",
      targetGate: "G1",
      g1Approved: false,
      realDataEnabled: false,
    });
    expect(result.manifest?.capabilities.billing).toBe("sandbox_only");
    expect(result.manifest?.capabilities.externalPublication).toBe("blocked");
  });

  it("fails closed when CI jobs do not share the baseline commit", () => {
    const unsafe = structuredClone(manifestJson);
    unsafe.ci.jobs[0].observedCommitRef = "a".repeat(40);

    const result = evaluateReleaseEvidenceManifest(unsafe, g1ReleaseEvidenceManifestPolicy);

    expect(result.valid).toBe(false);
    expect(result.blockers).toContain("ci_commit_mismatch");
  });

  it("fails closed when CI jobs are duplicated", () => {
    const unsafe = structuredClone(manifestJson);
    unsafe.ci.jobs.push(structuredClone(unsafe.ci.jobs[0]));

    const result = evaluateReleaseEvidenceManifest(unsafe, g1ReleaseEvidenceManifestPolicy);

    expect(result.valid).toBe(false);
    expect(result.blockers).toContain("duplicate_ci_job");
  });

  it("fails closed when a verified proof points to another release", () => {
    const unsafe = structuredClone(manifestJson);
    const proof = unsafe.proofs.find((candidate) => candidate.requiresAttestedBaselineRef);
    if (!proof) throw new Error("Fixture must include a release-bound proof");
    proof.status = "verified";
    proof.observedCommitRef = "a".repeat(40);

    const result = evaluateReleaseEvidenceManifest(unsafe, g1ReleaseEvidenceManifestPolicy);

    expect(result.valid).toBe(false);
    expect(result.blockers).toContain("proof_commit_mismatch");
  });

  it("fails closed on gate, data, publication and billing escalation", () => {
    const unsafe = structuredClone(manifestJson);
    unsafe.gates.approvedGate = "G1";
    unsafe.gates.g1Approved = true;
    unsafe.gates.gateAdvanceClaimed = true;
    unsafe.gates.realDataEnabled = true;
    unsafe.capabilities.externalPublication = "verified";
    unsafe.capabilities.billing = "verified";

    const result = evaluateReleaseEvidenceManifest(unsafe, g1ReleaseEvidenceManifestPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "approved_gate_mismatch",
      "g1_approval_claimed",
      "gate_advance_claimed",
      "real_data_enabled",
      "external_publication_not_blocked",
      "billing_not_sandbox_only",
    ]));
  });

  it("derives release and published-baseline contracts from the same artifact", () => {
    const packet = buildReleaseProofPacketFromManifest(g1ReleaseEvidenceManifest);
    const publishedBaseline = buildPublishedBaselineEvidenceFromManifest(g1ReleaseEvidenceManifest);

    expect(packet.attestedBaselineRef).toBe(g1ReleaseEvidenceManifest.repository.publishedBaselineRef);
    expect(packet.sourceHeadRef).toBe(g1ReleaseEvidenceManifest.repository.sourceHeadRef);
    expect(publishedBaseline.githubActionsGreen).toBe(true);
    expect(publishedBaseline.databaseCiGreen).toBe(true);
    expect(publishedBaseline.lovableProjectLinked).toBe(true);
    expect(publishedBaseline.lovablePublishedBaselineVerified).toBe(true);
    expect(publishedBaseline.dataRealEnabled).toBe(false);
    expect(publishedBaseline.gateAdvanceRequested).toBe(false);
  });

  it("rejects malformed input before downstream evaluators can read it", () => {
    const result = evaluateReleaseEvidenceManifest({ manifestId: "partial" }, g1ReleaseEvidenceManifestPolicy);

    expect(result.valid).toBe(false);
    expect(result.blockers).toEqual(["manifest_schema_invalid"]);
    expect(result.manifest).toBeNull();
  });
});
