import { describe, expect, it } from "vitest";
import {
  g1PaidAdvisoryAuthorizationContext,
  g1PaidAdvisoryAuthorizationDecisions,
  g1PaidAdvisoryAuthorizationPolicy,
  g1PaidAdvisoryAuthorizationRoles,
} from "@/data/g1PaidAdvisoryAuthorization";
import {
  evaluatePaidAdvisoryAuthorization,
  type PaidAdvisoryAuthorizationDecisionInput,
  type PaidAdvisoryAuthorizationRoleInput,
} from "./paidAdvisoryAuthorization";

function readyRoles(): PaidAdvisoryAuthorizationRoleInput[] {
  return g1PaidAdvisoryAuthorizationRoles.map((role) => ({
    ...role,
    named: true,
    authorityRecorded: true,
    backupNamed: true,
    capacityConfirmed: true,
    evidenceRef: "docs/PAID_ADVISORY_AUTHORIZATION_G1.md",
  }));
}

function approvedDecisions(): PaidAdvisoryAuthorizationDecisionInput[] {
  return g1PaidAdvisoryAuthorizationDecisions.map((decision) => ({
    ...decision,
    decision: "approved",
    evidenceRef: "docs/PAID_ADVISORY_AUTHORIZATION_G1.md",
    decidedBy: "accountable",
    decidedAt: "2026-07-14",
  }));
}

describe("G1 paid advisory authorization", () => {
  it("prepares a complete review packet without authorizing sale", () => {
    const result = evaluatePaidAdvisoryAuthorization(
      g1PaidAdvisoryAuthorizationRoles,
      g1PaidAdvisoryAuthorizationDecisions,
      g1PaidAdvisoryAuthorizationContext,
      g1PaidAdvisoryAuthorizationPolicy,
    );

    expect(result.status).toBe("review_packet_ready");
    expect(result.canRequestFormalReview).toBe(true);
    expect(result.canAuthorizeSale).toBe(false);
    expect(result.templateReadinessPct).toBe(100);
    expect(result.authorizationReadinessPct).toBe(0);
    expect(result.saleReadyRoles).toBe(0);
    expect(result.saleReadyDecisions).toBe(0);
    expect(result.nextSaleRole?.key).toBe("commercial_owner");
    expect(result.saleBlockers).toEqual(expect.arrayContaining(["role_not_named", "decision_pending"]));
  });

  it("authorizes only after every role, decision and evidence is complete", () => {
    const result = evaluatePaidAdvisoryAuthorization(
      readyRoles(),
      approvedDecisions(),
      g1PaidAdvisoryAuthorizationContext,
      g1PaidAdvisoryAuthorizationPolicy,
    );

    expect(result.status).toBe("authorized_for_sale");
    expect(result.canRequestFormalReview).toBe(true);
    expect(result.canAuthorizeSale).toBe(true);
    expect(result.authorizationReadinessPct).toBe(100);
    expect(result.saleBlockers).toEqual([]);
  });

  it("fails closed when a template section is incomplete or duplicated", () => {
    const incomplete = g1PaidAdvisoryAuthorizationDecisions.map((decision, index) =>
      index === 0
        ? {
            ...decision,
            templateSections: [
              { ...decision.templateSections[0], complete: false },
              decision.templateSections[0],
            ],
          }
        : decision,
    );
    const result = evaluatePaidAdvisoryAuthorization(
      g1PaidAdvisoryAuthorizationRoles,
      incomplete,
      g1PaidAdvisoryAuthorizationContext,
      g1PaidAdvisoryAuthorizationPolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.canRequestFormalReview).toBe(false);
    expect(result.reviewBlockers).toEqual(
      expect.arrayContaining(["decision_template_incomplete", "duplicate_template_section"]),
    );
  });

  it("blocks unsafe scope even with complete approvals", () => {
    const result = evaluatePaidAdvisoryAuthorization(
      readyRoles(),
      approvedDecisions(),
      { realDataEnabled: true, remoteDeliveryEnabled: true, paidPilotClaimed: true },
      g1PaidAdvisoryAuthorizationPolicy,
    );

    expect(result.canRequestFormalReview).toBe(false);
    expect(result.canAuthorizeSale).toBe(false);
    expect(result.saleBlockers).toEqual(
      expect.arrayContaining(["real_data_enabled", "remote_delivery_enabled", "paid_pilot_claimed"]),
    );
  });

  it("requires every conditional approval to have owner, date and evidence", () => {
    const decisions = approvedDecisions();
    decisions[0] = {
      ...decisions[0],
      decision: "approved_with_conditions",
      conditions: [{
        key: "price_review",
        label: "Revisar preço",
        ownerRole: null,
        dueDate: null,
        evidenceRef: null,
        detail: "Ressalva ainda sem limites verificáveis.",
      }],
    };
    const result = evaluatePaidAdvisoryAuthorization(
      readyRoles(),
      decisions,
      g1PaidAdvisoryAuthorizationContext,
      g1PaidAdvisoryAuthorizationPolicy,
    );

    expect(result.canAuthorizeSale).toBe(false);
    expect(result.saleBlockers).toContain("condition_not_bounded");
  });
});
