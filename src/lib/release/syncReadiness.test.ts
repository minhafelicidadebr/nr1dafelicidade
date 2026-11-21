import { describe, expect, it } from "vitest";
import {
  officialPublishedBaselineEvidence,
  publishedBaselinePolicy,
} from "@/data/releaseSyncReadiness";
import { evaluatePublishedBaselineReadiness } from "./syncReadiness";

describe("published baseline readiness", () => {
  it("recognizes official GitHub and Lovable evidence while branch protection remains blocked", () => {
    const result = evaluatePublishedBaselineReadiness(
      officialPublishedBaselineEvidence,
      publishedBaselinePolicy,
    );

    expect(result.canReviewPublishedBaseline).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.blockers).not.toContain("missing_git_repository");
    expect(result.blockers).not.toContain("missing_git_remote");
    expect(result.blockers).not.toContain("github_actions_not_green");
    expect(result.blockers).not.toContain("database_ci_not_green");
    expect(result.blockers).toContain("branch_protection_not_verified");
    expect(result.blockers).not.toContain("lovable_project_not_linked");
    expect(result.blockers).not.toContain("lovable_published_baseline_not_verified");
    expect(result.blockers).not.toContain("real_data_enabled");
    expect(result.blockers).not.toContain("gate_advance_requested");
  });

  it("allows baseline review only when repository, CI, branch protection and Lovable evidence are complete", () => {
    const readyEvidence = {
      hasGitRepository: true,
      hasGitRemote: true,
      workingTreeAudited: true,
      localCiGreen: true,
      githubActionsGreen: true,
      databaseCiGreen: true,
      branchProtectionVerified: true,
      lovableProjectLinked: true,
      lovablePublishedBaselineVerified: true,
      dataRealEnabled: false,
      gateAdvanceRequested: false,
    };

    const result = evaluatePublishedBaselineReadiness(readyEvidence, publishedBaselinePolicy);

    expect(result.canReviewPublishedBaseline).toBe(true);
    expect(result.status).toBe("ready_for_baseline_review");
    expect(result.blockers).toEqual([]);
    expect(result.readinessPct).toBe(100);
  });

  it("fails closed if publication would enable real data or advance gate", () => {
    const unsafeEvidence = {
      hasGitRepository: true,
      hasGitRemote: true,
      workingTreeAudited: true,
      localCiGreen: true,
      githubActionsGreen: true,
      databaseCiGreen: true,
      branchProtectionVerified: true,
      lovableProjectLinked: true,
      lovablePublishedBaselineVerified: true,
      dataRealEnabled: true,
      gateAdvanceRequested: true,
    };

    const result = evaluatePublishedBaselineReadiness(unsafeEvidence, publishedBaselinePolicy);

    expect(result.canReviewPublishedBaseline).toBe(false);
    expect(result.blockers).toEqual(["real_data_enabled", "gate_advance_requested"]);
  });
});
