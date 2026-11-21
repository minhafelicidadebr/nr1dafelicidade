import { describe, expect, it } from "vitest";
import {
  g1PaidAdvisoryAuthorizationMeetingAgenda,
  g1PaidAdvisoryAuthorizationMeetingContext,
  g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
  g1PaidAdvisoryAuthorizationMeetingOutputs,
  g1PaidAdvisoryAuthorizationMeetingPolicy,
  g1PaidAdvisoryAuthorizationMeetingPreReads,
} from "@/data/g1PaidAdvisoryAuthorizationMeeting";
import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";
import {
  evaluatePaidAdvisoryAuthorizationMeeting,
  type PaidAdvisoryAuthorizationMeetingContext,
  type PaidAdvisoryAuthorizationMeetingExternalReadiness,
} from "./paidAdvisoryAuthorizationMeeting";

const readyExternal: PaidAdvisoryAuthorizationMeetingExternalReadiness = {
  nominatedRoleKeys: [...g1PaidAdvisoryAuthorizationMeetingPolicy.requiredRoleKeys],
  authorityEvidenceRoleKeys: [...g1PaidAdvisoryAuthorizationMeetingPolicy.requiredRoleKeys],
  preReadsDistributed: true,
  recorderMandateConfirmed: true,
  convocationReviewApproved: true,
};

function evaluate(
  externalReadiness: PaidAdvisoryAuthorizationMeetingExternalReadiness =
    g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
  context: PaidAdvisoryAuthorizationMeetingContext = g1PaidAdvisoryAuthorizationMeetingContext,
) {
  return evaluatePaidAdvisoryAuthorizationMeeting(
    g1PaidAdvisoryAuthorizationSummary,
    g1PaidAdvisoryAuthorizationMeetingAgenda,
    g1PaidAdvisoryAuthorizationMeetingPreReads,
    g1PaidAdvisoryAuthorizationMeetingOutputs,
    externalReadiness,
    context,
    g1PaidAdvisoryAuthorizationMeetingPolicy,
  );
}

describe("G1 paid advisory authorization meeting", () => {
  it("keeps the current packet ready only for external nomination", () => {
    const summary = evaluate();

    expect(summary.status).toBe("packet_ready_for_external_nomination");
    expect(summary.canUseInternalPacket).toBe(true);
    expect(summary.canRequestHumanConvocationReview).toBe(false);
    expect(summary.nominatedRoles).toBe(0);
    expect(summary.authorityEvidenceRoles).toBe(0);
    expect(summary.convocationBlockers).toEqual(expect.arrayContaining([
      "role_nomination_incomplete",
      "authority_evidence_incomplete",
      "prereads_not_distributed",
      "recorder_mandate_missing",
      "convocation_review_missing",
    ]));
  });

  it("reaches only human convocation review after every external prerequisite", () => {
    const summary = evaluate(readyExternal);

    expect(summary.status).toBe("ready_for_human_convocation_review");
    expect(summary.canRequestHumanConvocationReview).toBe(true);
    expect(summary.canScheduleMeeting).toBe(false);
    expect(summary.canSendInvitation).toBe(false);
    expect(summary.canRecordDecision).toBe(false);
    expect(summary.canAuthorizeSale).toBe(false);
  });

  it("does not reopen the meeting when authorization is already complete", () => {
    const summary = evaluatePaidAdvisoryAuthorizationMeeting(
      {
        ...g1PaidAdvisoryAuthorizationSummary,
        status: "authorized_for_sale",
        canAuthorizeSale: true,
      },
      g1PaidAdvisoryAuthorizationMeetingAgenda,
      g1PaidAdvisoryAuthorizationMeetingPreReads,
      g1PaidAdvisoryAuthorizationMeetingOutputs,
      g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
      g1PaidAdvisoryAuthorizationMeetingContext,
      g1PaidAdvisoryAuthorizationMeetingPolicy,
    );

    expect(summary.status).toBe("authorization_already_complete");
    expect(summary.convocationBlockers).toEqual([]);
    expect(summary.canRequestHumanConvocationReview).toBe(false);
  });

  it.each([
    ["synthetic scope", { syntheticScopeOnly: false }, "synthetic_scope_required"],
    ["personal data", { personalDataPresent: true }, "personal_data_forbidden"],
    ["persistence", { persistenceEnabled: true }, "persistence_forbidden"],
    ["remote scheduling", { remoteSchedulingEnabled: true }, "remote_scheduling_forbidden"],
    ["external invitation", { externalInvitationSent: true }, "external_invitation_forbidden"],
    ["meeting claim", { meetingClaimedAsHeld: true }, "meeting_claim_forbidden"],
    ["sale claim", { saleClaimedAsAuthorized: true }, "sale_authorization_claim_forbidden"],
  ])("fails closed for unsafe context: %s", (_label, override, blocker) => {
    const summary = evaluate(
      g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
      { ...g1PaidAdvisoryAuthorizationMeetingContext, ...override },
    );

    expect(summary.status).toBe("blocked");
    expect(summary.packetBlockers).toContain(blocker);
  });

  it("blocks malformed agenda, pre-read and output catalogs", () => {
    const summary = evaluatePaidAdvisoryAuthorizationMeeting(
      g1PaidAdvisoryAuthorizationSummary,
      [
        { ...g1PaidAdvisoryAuthorizationMeetingAgenda[0], complete: false },
        { ...g1PaidAdvisoryAuthorizationMeetingAgenda[0] },
      ],
      [{ ...g1PaidAdvisoryAuthorizationMeetingPreReads[0], versionRef: null }],
      [g1PaidAdvisoryAuthorizationMeetingOutputs[0]],
      g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
      g1PaidAdvisoryAuthorizationMeetingContext,
      g1PaidAdvisoryAuthorizationMeetingPolicy,
    );

    expect(summary.packetBlockers).toEqual(expect.arrayContaining([
      "agenda_invalid",
      "preread_invalid",
      "expected_output_invalid",
    ]));
  });

  it("blocks duplicate nominations and authority without a nominated role", () => {
    const summary = evaluate({
      ...g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
      nominatedRoleKeys: ["commercial_owner", "commercial_owner"],
      authorityEvidenceRoleKeys: ["legal_reviewer"],
    });

    expect(summary.packetBlockers).toEqual(expect.arrayContaining([
      "nomination_key_invalid",
      "authority_key_invalid",
    ]));
  });

  it("requires the authorization packet to be review-ready", () => {
    const summary = evaluatePaidAdvisoryAuthorizationMeeting(
      { ...g1PaidAdvisoryAuthorizationSummary, status: "blocked", canRequestFormalReview: false },
      g1PaidAdvisoryAuthorizationMeetingAgenda,
      g1PaidAdvisoryAuthorizationMeetingPreReads,
      g1PaidAdvisoryAuthorizationMeetingOutputs,
      readyExternal,
      g1PaidAdvisoryAuthorizationMeetingContext,
      g1PaidAdvisoryAuthorizationMeetingPolicy,
    );

    expect(summary.status).toBe("blocked");
    expect(summary.packetBlockers).toContain("authorization_review_packet_not_ready");
  });
});
