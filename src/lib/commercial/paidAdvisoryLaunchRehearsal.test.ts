import { describe, expect, it } from "vitest";
import { g1CommercialAuthorizationSummary } from "@/data/commercialAuthorization";
import {
  g1PaidAdvisoryLaunchAcknowledgements,
  g1PaidAdvisoryLaunchContext,
  g1PaidAdvisoryLaunchPolicy,
  g1PaidAdvisoryLaunchScenarios,
  g1PaidAdvisoryProposalTemplate,
} from "@/data/g1PaidAdvisoryLaunchRehearsal";
import {
  buildPaidAdvisoryLaunchReceipt,
  evaluatePaidAdvisoryLaunchRehearsal,
  type PaidAdvisoryLaunchContext,
} from "./paidAdvisoryLaunchRehearsal";

const acknowledged = Object.fromEntries(
  g1PaidAdvisoryLaunchAcknowledgements.map((item) => [item.key, true]),
) as PaidAdvisoryLaunchContext["acknowledgements"];
const correctActions = Object.fromEntries(
  g1PaidAdvisoryLaunchScenarios.map((scenario) => [scenario.key, scenario.expectedAction]),
);

function context(override: Partial<PaidAdvisoryLaunchContext> = {}): PaidAdvisoryLaunchContext {
  return { ...g1PaidAdvisoryLaunchContext, acknowledgements: acknowledged, ...override };
}

describe("G1 paid advisory launch rehearsal", () => {
  it("completes an internal rehearsal with a No-Go while authorization is pending", () => {
    expect(g1PaidAdvisoryLaunchContext.authorizationForSale).toBe(g1CommercialAuthorizationSummary.saleAuthorized);

    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      g1PaidAdvisoryProposalTemplate,
      g1PaidAdvisoryLaunchScenarios,
      correctActions,
      context(),
      g1PaidAdvisoryLaunchPolicy,
    );

    expect(summary.status).toBe("complete_no_go");
    expect(summary.canIssueLocalReceipt).toBe(true);
    expect(summary.canReleaseForManualHandoff).toBe(false);
    expect(summary.canSendProposal).toBe(false);
    expect(summary.launchBlockers).toEqual(expect.arrayContaining([
      "sale_authorization_missing",
      "commercial_fields_not_approved",
      "recipient_not_approved",
    ]));
  });

  it("reaches only human release review after all launch inputs are approved", () => {
    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      g1PaidAdvisoryProposalTemplate,
      g1PaidAdvisoryLaunchScenarios,
      correctActions,
      context({
        authorizationForSale: true,
        commercialFieldsApproved: true,
        recipientApproved: true,
      }),
      g1PaidAdvisoryLaunchPolicy,
    );

    expect(summary.status).toBe("complete_ready_for_human_release_review");
    expect(summary.canReleaseForManualHandoff).toBe(true);
    expect(summary.canSendProposal).toBe(false);
    expect(summary.canStartDelivery).toBe(false);
    expect(summary.launchBlockers).toEqual([]);
  });

  it("keeps an incorrect response in progress", () => {
    const actions = { ...correctActions, real_worker_data: "bounded_answer" as const };
    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      g1PaidAdvisoryProposalTemplate,
      g1PaidAdvisoryLaunchScenarios,
      actions,
      context(),
      g1PaidAdvisoryLaunchPolicy,
    );

    expect(summary.status).toBe("in_progress");
    expect(summary.nextScenario?.key).toBe("real_worker_data");
    expect(summary.canIssueLocalReceipt).toBe(false);
  });

  it("fails closed for unsafe context and missing acknowledgements", () => {
    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      g1PaidAdvisoryProposalTemplate,
      g1PaidAdvisoryLaunchScenarios,
      {},
      context({
        syntheticMode: false,
        realCustomerDataPresent: true,
        persistenceEnabled: true,
        remoteTransportEnabled: true,
        externalRecipientPresent: true,
        acknowledgements: { ...acknowledged, no_send_signature_or_charge: false },
      }),
      g1PaidAdvisoryLaunchPolicy,
    );

    expect(summary.status).toBe("blocked");
    expect(summary.preflightBlockers).toEqual(expect.arrayContaining([
      "synthetic_mode_required",
      "real_customer_data_forbidden",
      "persistence_forbidden",
      "remote_transport_forbidden",
      "external_recipient_forbidden",
      "acknowledgement_required:no_send_signature_or_charge",
    ]));
  });

  it("rejects incomplete proposal templates and scenario catalogs", () => {
    const template = {
      ...g1PaidAdvisoryProposalTemplate,
      sections: [{ ...g1PaidAdvisoryProposalTemplate.sections[0], complete: false }],
      placeholderKeys: ["price"],
    };
    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      template,
      g1PaidAdvisoryLaunchScenarios.slice(0, 1),
      {},
      context(),
      g1PaidAdvisoryLaunchPolicy,
    );

    expect(summary.canStartInternalRehearsal).toBe(false);
    expect(summary.preflightBlockers).toEqual(expect.arrayContaining([
      "proposal_template_invalid",
      "required_placeholder_missing",
      "scenario_catalog_incomplete",
    ]));
  });

  it("builds a memory-only No-Go receipt without issuing a proposal", () => {
    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      g1PaidAdvisoryProposalTemplate,
      g1PaidAdvisoryLaunchScenarios,
      correctActions,
      context(),
      g1PaidAdvisoryLaunchPolicy,
    );
    const receipt = buildPaidAdvisoryLaunchReceipt({
      receiptId: "COMMERCIAL-REHEARSAL-001",
      generatedAt: "2026-07-14T23:00:00.000Z",
      summary,
      persisted: false,
      remoteTransportEnabled: false,
      proposalIssued: false,
    });

    expect(receipt.decision).toBe("no_go");
    expect(receipt.storageMode).toBe("memory_only");
    expect(receipt.proposalStatus).toBe("not_issued");
    expect(receipt.canAuthorizeSale).toBe(false);
    expect(receipt.canSendProposal).toBe(false);
  });

  it.each([
    ["incomplete", {}, false, false, false, "rehearsal_incomplete"],
    ["persisted", correctActions, true, false, false, "receipt_must_remain_memory_only"],
    ["remote", correctActions, false, true, false, "remote_transport_forbidden"],
    ["issued", correctActions, false, false, true, "proposal_issue_forbidden"],
  ])("rejects an unsafe receipt: %s", (_label, actions, persisted, remote, issued, error) => {
    const summary = evaluatePaidAdvisoryLaunchRehearsal(
      g1PaidAdvisoryProposalTemplate,
      g1PaidAdvisoryLaunchScenarios,
      actions,
      context(),
      g1PaidAdvisoryLaunchPolicy,
    );

    expect(() => buildPaidAdvisoryLaunchReceipt({
      receiptId: "COMMERCIAL-REHEARSAL-001",
      generatedAt: "2026-07-14T23:00:00.000Z",
      summary,
      persisted,
      remoteTransportEnabled: remote,
      proposalIssued: issued,
    })).toThrow(error);
  });
});
