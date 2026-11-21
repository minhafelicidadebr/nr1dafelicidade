import { describe, expect, it } from "vitest";
import {
  g1ReleaseReviewPlan,
  g1ReleaseReviewPlanContext,
  g1ReleaseReviewPlanPolicy,
} from "@/data/g1ReleaseReviewPlan";
import { evaluateReleaseReviewPlan } from "./releaseReviewPlan";

describe("evaluateReleaseReviewPlan", () => {
  it("keeps a structurally valid review sequence ready but not executed", () => {
    const result = evaluateReleaseReviewPlan(g1ReleaseReviewPlan, g1ReleaseReviewPlanContext, g1ReleaseReviewPlanPolicy);

    expect(result.status).toBe("plan_ready_execution_blocked");
    expect(result.planReady).toBe(true);
    expect(result.canRequestReviewAuthorization).toBe(true);
    expect(result.canStartReview).toBe(false);
    expect(result.orderedStages.map((stage) => stage.sequence)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(result.nextStage?.key).toBe("foundation_review");
    expect(result.canCreateCommit).toBe(false);
    expect(result.canMerge).toBe(false);
  });

  it("allows only the review to start after explicit authorization", () => {
    const result = evaluateReleaseReviewPlan(g1ReleaseReviewPlan, {
      ...g1ReleaseReviewPlanContext,
      reviewAuthorized: true,
      reviewStarted: true,
    }, g1ReleaseReviewPlanPolicy);

    expect(result.status).toBe("review_authorized");
    expect(result.canStartReview).toBe(true);
    expect(result.canCreateCommit).toBe(false);
    expect(result.canOpenPullRequest).toBe(false);
    expect(result.canDeploy).toBe(false);
    expect(result.canUseRealData).toBe(false);
  });

  it("rejects missing coverage, duplicates, invalid order and dependency cycles", () => {
    const stages = [...g1ReleaseReviewPlan.stages];
    const first = stages[0];
    const result = evaluateReleaseReviewPlan({
      ...g1ReleaseReviewPlan,
      stages: [
        { ...first, dependencies: ["release_review"] },
        { ...first, key: "foundation_review_copy", sequence: 1 },
        ...stages.slice(2),
      ],
    }, g1ReleaseReviewPlanContext, g1ReleaseReviewPlanPolicy);

    expect(result.planReady).toBe(false);
    expect(result.planBlockers).toEqual(expect.arrayContaining([
      "required_workstream_missing",
      "duplicate_workstream",
      "duplicate_sequence",
      "dependency_cycle",
      "dependency_order_invalid",
    ]));
  });

  it("blocks missing review evidence and prohibited execution claims", () => {
    const result = evaluateReleaseReviewPlan({
      ...g1ReleaseReviewPlan,
      stages: g1ReleaseReviewPlan.stages.map((stage, index) => index === 0 ? {
        ...stage,
        reviewerRoles: [],
        exitCriteria: [],
        validationCommands: [],
      } : stage),
    }, {
      ...g1ReleaseReviewPlanContext,
      reviewStarted: true,
      commitCreated: true,
      pullRequestOpened: true,
      mergePerformed: true,
      deployPerformed: true,
      gateAdvanceClaimed: true,
      realDataEnabled: true,
    }, g1ReleaseReviewPlanPolicy);

    expect(result.planBlockers).toEqual(expect.arrayContaining([
      "reviewer_role_missing",
      "exit_criteria_missing",
      "validation_command_missing",
    ]));
    expect(result.executionBlockers).toEqual(expect.arrayContaining([
      "review_started_without_authorization",
      "commit_created",
      "pull_request_opened",
      "merge_performed",
      "deploy_performed",
      "gate_advance_claimed",
      "real_data_enabled",
    ]));
  });
});
