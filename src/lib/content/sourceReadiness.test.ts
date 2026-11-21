import { describe, expect, it } from "vitest";
import {
  evaluateSourceReadiness,
  type SourceReadinessPolicy,
  type SourceRecordInput,
} from "./sourceReadiness";

const policy: SourceReadinessPolicy = {
  policyId: "test-policy",
  requireCanonicalPlaybook: true,
  requireUrl: true,
  requireVersion: true,
  requireHash: true,
  requireApprovedLicense: true,
  requireApprovedReview: true,
  requireClaimsReviewed: true,
};

describe("source readiness", () => {
  it("blocks sync when the canonical Playbook source is absent", () => {
    const result = evaluateSourceReadiness([], policy);

    expect(result.canSync).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.blockers).toContain("missing_canonical_playbook");
  });

  it("blocks a draft source with missing hash, license, review and claim approval", () => {
    const records: SourceRecordInput[] = [
      {
        id: "canonical",
        title: "Work Wellbeing Playbook",
        kind: "canonical_playbook",
        url: "https://example.test/playbook.pdf",
        version: "draft-ref",
        sha256: null,
        licenseStatus: "unknown",
        reviewStatus: "draft",
        claimsReviewed: false,
      },
    ];

    const result = evaluateSourceReadiness(records, policy);

    expect(result.ready).toBe(0);
    expect(result.blockers).toEqual([
      "missing_hash",
      "license_not_approved",
      "review_not_approved",
      "claims_not_reviewed",
    ]);
    expect(result.nextStep).toBe("Registrar hash SHA-256 do material aprovado.");
  });

  it("allows sync only when source, license, review, hash and claims are approved", () => {
    const records: SourceRecordInput[] = [
      {
        id: "canonical",
        title: "Work Wellbeing Playbook",
        kind: "canonical_playbook",
        url: "https://example.test/playbook.pdf",
        version: "2024-11",
        sha256: "0".repeat(64),
        licenseStatus: "approved",
        reviewStatus: "approved",
        claimsReviewed: true,
      },
    ];

    const result = evaluateSourceReadiness(records, policy);

    expect(result.canSync).toBe(true);
    expect(result.ready).toBe(1);
    expect(result.blockers).toEqual([]);
    expect(result.status).toBe("ready_for_sync");
  });
});
