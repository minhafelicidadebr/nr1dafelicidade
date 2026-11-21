import { describe, expect, it } from "vitest";
import {
  g1ReleaseCandidateCharter,
  g1ReleaseCandidateCharterContext,
  g1ReleaseCandidateCharterPolicy,
} from "@/data/g1ReleaseCandidateCharter";
import { evaluateReleaseCandidateCharter } from "./releaseCandidateCharter";

describe("evaluateReleaseCandidateCharter", () => {
  it("separates a reviewable scope from blocked promotion actions", () => {
    const result = evaluateReleaseCandidateCharter(
      g1ReleaseCandidateCharter,
      g1ReleaseCandidateCharterContext,
      g1ReleaseCandidateCharterPolicy,
    );

    expect(result.status).toBe("scope_ready_promotion_blocked");
    expect(result.canRequestScopeReview).toBe(true);
    expect(result.readyWorkstreams).toBe(6);
    expect(result.inventory.sensitive).toBe(0);
    expect(result.canCreateCandidateCommit).toBe(false);
    expect(result.canPushCandidate).toBe(false);
    expect(result.canOpenPullRequest).toBe(false);
    expect(result.promotionBlockers).toEqual(expect.arrayContaining([
      "official_repository_unconfirmed",
      "commit_authorization_missing",
      "candidate_ref_missing",
    ]));
  });

  it("authorizes only candidate preparation when repository, SHA and permissions are explicit", () => {
    const result = evaluateReleaseCandidateCharter({
      ...g1ReleaseCandidateCharter,
      currentReleaseRef: "candidate-sha",
      repository: { ...g1ReleaseCandidateCharter.repository, officialRepositoryConfirmed: true },
    }, {
      ...g1ReleaseCandidateCharterContext,
      commitAuthorized: true,
      pushAuthorized: true,
      pullRequestAuthorized: true,
    }, g1ReleaseCandidateCharterPolicy);

    expect(result.status).toBe("candidate_authorized");
    expect(result.canCreateCandidateCommit).toBe(true);
    expect(result.canPushCandidate).toBe(true);
    expect(result.canOpenPullRequest).toBe(true);
    expect(result.canMerge).toBe(false);
    expect(result.canDeploy).toBe(false);
    expect(result.canAdvanceGate).toBe(false);
    expect(result.canUseRealData).toBe(false);
  });

  it("fails closed on inventory drift, duplicate scope and missing evidence layers", () => {
    const first = g1ReleaseCandidateCharter.workstreams[0];
    const result = evaluateReleaseCandidateCharter({
      ...g1ReleaseCandidateCharter,
      inventory: { ...g1ReleaseCandidateCharter.inventory, totalFiles: 999 },
      workstreams: [
        { ...first, hasTests: false, hasDocumentation: false, status: "needs_split" },
        first,
        ...g1ReleaseCandidateCharter.workstreams.slice(2),
      ],
    }, g1ReleaseCandidateCharterContext, g1ReleaseCandidateCharterPolicy);

    expect(result.canRequestScopeReview).toBe(false);
    expect(result.scopeBlockers).toEqual(expect.arrayContaining([
      "inventory_mismatch",
      "duplicate_workstream",
      "required_workstream_missing",
      "workstream_not_review_ready",
      "workstream_tests_missing",
      "workstream_documentation_missing",
    ]));
  });

  it("blocks sensitive, unclassified and prohibited promotion claims", () => {
    const result = evaluateReleaseCandidateCharter({
      ...g1ReleaseCandidateCharter,
      inventory: {
        ...g1ReleaseCandidateCharter.inventory,
        sensitive: 1,
        unclassified: 1,
      },
    }, {
      ...g1ReleaseCandidateCharterContext,
      mergePerformed: true,
      deployPerformed: true,
      gateAdvanceClaimed: true,
      realDataEnabled: true,
    }, g1ReleaseCandidateCharterPolicy);

    expect(result.scopeBlockers).toEqual(expect.arrayContaining([
      "sensitive_scope_detected",
      "unclassified_changes",
    ]));
    expect(result.promotionBlockers).toEqual(expect.arrayContaining([
      "merge_performed",
      "deploy_performed",
      "gate_advance_claimed",
      "real_data_enabled",
    ]));
  });
});
