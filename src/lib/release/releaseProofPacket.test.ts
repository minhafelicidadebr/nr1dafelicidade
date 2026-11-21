import { describe, expect, it } from "vitest";
import {
  g1ReleaseProofPacket,
  g1ReleaseProofPacketContext,
  g1ReleaseProofPacketPolicy,
} from "@/data/g1ReleaseProofPacket";
import { evaluateReleaseProofPacket } from "./releaseProofPacket";

describe("evaluateReleaseProofPacket", () => {
  it("recognizes the observed GitHub evidence while preserving external blockers", () => {
    const result = evaluateReleaseProofPacket(g1ReleaseProofPacket, g1ReleaseProofPacketContext, g1ReleaseProofPacketPolicy);

    expect(result.status).toBe("blocked");
    expect(result.verified).toBe(10);
    expect(result.historicalOnly).toBe(0);
    expect(result.localOnly).toBe(0);
    expect(result.attestedBaselineRef).toBe("4a21c1c7eb9f756a216553fd5237809e588f90d9");
    expect(result.nextProof?.key).toBe("branch_protection");
    expect(result.canRequestReleaseReview).toBe(false);
    expect(result.canPublish).toBe(false);
    expect(result.canDeploy).toBe(false);
    expect(result.canClaimCurrentSync).toBe(false);
  });

  it("allows only release review when every proof matches one candidate commit", () => {
    const candidate = "candidate-sha";
    const result = evaluateReleaseProofPacket({
      ...g1ReleaseProofPacket,
      attestedBaselineRef: candidate,
      proofs: g1ReleaseProofPacket.proofs.map((proof) => ({
        ...proof,
        status: "verified" as const,
        evidenceRef: proof.evidenceRef ?? `receipt:${proof.key}`,
        observedCommitRef: proof.requiresAttestedBaselineRef ? candidate : proof.observedCommitRef,
      })),
    }, g1ReleaseProofPacketContext, g1ReleaseProofPacketPolicy);

    expect(result.canRequestReleaseReview).toBe(true);
    expect(result.canPublish).toBe(false);
    expect(result.canMerge).toBe(false);
    expect(result.canClaimCurrentSync).toBe(false);
    expect(result.canAdvanceGate).toBe(false);
  });

  it("rejects missing, duplicate and mismatched proof", () => {
    const candidate = "candidate-sha";
    const proofs = g1ReleaseProofPacket.proofs.slice(1);
    const result = evaluateReleaseProofPacket({
      ...g1ReleaseProofPacket,
      attestedBaselineRef: candidate,
      proofs: [proofs[0], proofs[0], ...proofs.slice(1)].map((proof) => ({
        ...proof,
        status: "verified" as const,
        evidenceRef: proof.evidenceRef ?? "receipt",
        observedCommitRef: proof.requiresAttestedBaselineRef ? "different-sha" : proof.observedCommitRef,
      })),
    }, g1ReleaseProofPacketContext, g1ReleaseProofPacketPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "required_proof_missing",
      "duplicate_proof",
      "proof_commit_mismatch",
    ]));
  });

  it("blocks publish, merge, deploy, gate and real-data claims", () => {
    const result = evaluateReleaseProofPacket(g1ReleaseProofPacket, {
      publishPerformed: true,
      mergePerformed: true,
      deployPerformed: true,
      gateAdvanceClaimed: true,
      realDataEnabled: true,
    }, g1ReleaseProofPacketPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "publish_performed",
      "merge_performed",
      "deploy_performed",
      "gate_advance_claimed",
      "real_data_enabled",
    ]));
  });
});
