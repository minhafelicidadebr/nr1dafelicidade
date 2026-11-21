import { describe, expect, it } from "vitest";
import {
  g1CanonicalInstrumentArtifacts,
  g1CanonicalInstrumentIntakeContext,
  g1CanonicalInstrumentIntakePolicy,
} from "@/data/g1CanonicalInstrumentIntake";
import {
  evaluateCanonicalInstrumentIntake,
  type CanonicalInstrumentArtifactInput,
} from "./canonicalIntake";

const checksum = "a".repeat(64);

describe("canonical instrument intake", () => {
  it("keeps the current instrument intake blocked while canonical artifacts are missing", () => {
    const result = evaluateCanonicalInstrumentIntake(
      g1CanonicalInstrumentArtifacts,
      g1CanonicalInstrumentIntakeContext,
      g1CanonicalInstrumentIntakePolicy,
    );

    expect(result.canOpenIntakeReview).toBe(false);
    expect(result.canPromoteToMethodologyGate).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.nextStep?.key).toBe("primary_source_manual");
    expect(result.blockers).toEqual(
      expect.arrayContaining(["artifact_missing", "artifact_owner_missing", "methodology_artifact_not_approved"]),
    );
  });

  it("opens intake review when required artifacts are submitted with owner and checksum", () => {
    const artifacts: CanonicalInstrumentArtifactInput[] = g1CanonicalInstrumentArtifacts.map((artifact) => ({
      ...artifact,
      status: artifact.requiredForReview ? "submitted" : artifact.status,
      checksumSha256: artifact.requiredForReview ? checksum : artifact.checksumSha256,
      ownerAssigned: artifact.requiredForReview ? true : artifact.ownerAssigned,
    }));

    const result = evaluateCanonicalInstrumentIntake(
      artifacts,
      g1CanonicalInstrumentIntakeContext,
      g1CanonicalInstrumentIntakePolicy,
    );

    expect(result.canOpenIntakeReview).toBe(true);
    expect(result.canPromoteToMethodologyGate).toBe(false);
    expect(result.status).toBe("ready_for_intake_review");
    expect(result.blockers).toContain("methodology_artifact_not_approved");
  });

  it("promotes to methodology gate only after every methodology artifact is approved", () => {
    const artifacts: CanonicalInstrumentArtifactInput[] = g1CanonicalInstrumentArtifacts.map((artifact) => ({
      ...artifact,
      status: "approved",
      checksumSha256: checksum,
      ownerAssigned: true,
    }));

    const result = evaluateCanonicalInstrumentIntake(
      artifacts,
      g1CanonicalInstrumentIntakeContext,
      g1CanonicalInstrumentIntakePolicy,
    );

    expect(result.canOpenIntakeReview).toBe(true);
    expect(result.canPromoteToMethodologyGate).toBe(true);
    expect(result.status).toBe("ready_for_methodology_gate");
    expect(result.methodologyReadinessPct).toBe(100);
    expect(result.nextStep).toBeNull();
  });

  it("fails closed if runtime, real data or gate state are unsafe", () => {
    const artifacts: CanonicalInstrumentArtifactInput[] = g1CanonicalInstrumentArtifacts.map((artifact) => ({
      ...artifact,
      status: "approved",
      checksumSha256: checksum,
      ownerAssigned: true,
    }));

    const result = evaluateCanonicalInstrumentIntake(
      artifacts,
      {
        runtimeReady: true,
        realDataEnabled: true,
        gateAdvanceClaimed: true,
      },
      g1CanonicalInstrumentIntakePolicy,
    );

    expect(result.canOpenIntakeReview).toBe(false);
    expect(result.canPromoteToMethodologyGate).toBe(false);
    expect(result.blockers).toEqual(
      expect.arrayContaining(["runtime_ready_before_intake", "real_data_enabled", "gate_advance_claimed"]),
    );
  });
});
