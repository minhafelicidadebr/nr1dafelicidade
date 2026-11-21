import { describe, expect, it } from "vitest";
import {
  g1FacilitatorRehearsalPolicy,
  g1FacilitatorRehearsalScenarios,
} from "@/data/g1FacilitatorRehearsal";
import {
  buildFacilitatorRehearsalReceipt,
  evaluateFacilitatorRehearsal,
  type FacilitatorRehearsalContext,
} from "./facilitatorRehearsal";

const readyContext: FacilitatorRehearsalContext = {
  audiencePackReadyForRehearsal: true,
  syntheticMode: true,
  realDataEnabled: false,
  persistenceEnabled: false,
  remoteTransportEnabled: false,
  externalAudiencePresent: false,
  recordingEnabled: false,
  acknowledgements: {
    synthetic_only: true,
    no_external_audience: true,
    no_recording: true,
    no_approval_claim: true,
  },
};

const correctActions = Object.fromEntries(
  g1FacilitatorRehearsalScenarios.map((scenario) => [scenario.key, scenario.expectedAction]),
);

describe("facilitator rehearsal", () => {
  it("starts only after safe preflight and completes with every expected action", () => {
    const ready = evaluateFacilitatorRehearsal(
      g1FacilitatorRehearsalScenarios,
      {},
      readyContext,
      g1FacilitatorRehearsalPolicy,
    );
    const complete = evaluateFacilitatorRehearsal(
      g1FacilitatorRehearsalScenarios,
      correctActions,
      readyContext,
      g1FacilitatorRehearsalPolicy,
    );

    expect(ready.status).toBe("ready_for_internal_rehearsal");
    expect(complete.status).toBe("complete");
    expect(complete.passed).toBe(6);
    expect(complete.canIssueLocalReceipt).toBe(true);
    expect(complete.canCountAsExternalApproval).toBe(false);
    expect(complete.canUseWithExternalAudience).toBe(false);
  });

  it("keeps an incorrect action in progress and points to the scenario", () => {
    const actions = { ...correctActions, real_worker_data: "safe_answer" as const };
    const result = evaluateFacilitatorRehearsal(
      g1FacilitatorRehearsalScenarios,
      actions,
      readyContext,
      g1FacilitatorRehearsalPolicy,
    );

    expect(result.status).toBe("in_progress");
    expect(result.passed).toBe(5);
    expect(result.nextScenario?.key).toBe("real_worker_data");
    expect(result.canIssueLocalReceipt).toBe(false);
  });

  it("fails closed for unsafe runtime, external audience or missing acknowledgements", () => {
    const result = evaluateFacilitatorRehearsal(g1FacilitatorRehearsalScenarios, {}, {
      ...readyContext,
      realDataEnabled: true,
      persistenceEnabled: true,
      remoteTransportEnabled: true,
      externalAudiencePresent: true,
      recordingEnabled: true,
      acknowledgements: { ...readyContext.acknowledgements, no_recording: false },
    }, g1FacilitatorRehearsalPolicy);

    expect(result.status).toBe("blocked");
    expect(result.blockers).toEqual(expect.arrayContaining([
      "real_data_forbidden",
      "persistence_forbidden",
      "remote_transport_forbidden",
      "external_audience_forbidden",
      "recording_forbidden",
      "acknowledgement_required:no_recording",
    ]));
  });

  it("blocks rehearsal if the audience package or scenario catalog is incomplete", () => {
    const result = evaluateFacilitatorRehearsal(
      g1FacilitatorRehearsalScenarios.slice(0, 2),
      {},
      { ...readyContext, audiencePackReadyForRehearsal: false },
      g1FacilitatorRehearsalPolicy,
    );

    expect(result.canStartInternalRehearsal).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "audience_pack_not_ready",
      "scenario_catalog_incomplete",
    ]));
  });

  it("rejects duplicated or structurally empty scenarios", () => {
    const firstScenario = g1FacilitatorRehearsalScenarios[0];
    const duplicated = Array.from({ length: 6 }, () => firstScenario);
    const emptyPrompt = g1FacilitatorRehearsalScenarios.map((scenario, index) =>
      index === 0 ? { ...scenario, prompt: "   " } : scenario,
    );

    for (const scenarios of [duplicated, emptyPrompt]) {
      const result = evaluateFacilitatorRehearsal(
        scenarios,
        correctActions,
        readyContext,
        g1FacilitatorRehearsalPolicy,
      );

      expect(result.canStartInternalRehearsal).toBe(false);
      expect(result.canIssueLocalReceipt).toBe(false);
      expect(result.blockers).toContain("scenario_catalog_incomplete");
    }
  });

  it("creates a memory-only receipt that cannot support external approval", () => {
    const summary = evaluateFacilitatorRehearsal(
      g1FacilitatorRehearsalScenarios,
      correctActions,
      readyContext,
      g1FacilitatorRehearsalPolicy,
    );
    const receipt = buildFacilitatorRehearsalReceipt({
      receiptId: "FAC-REHEARSAL-001",
      generatedAt: "2026-07-14T23:00:00.000Z",
      audiencePackId: "external-audience-g1-synthetic",
      audiencePackVersion: "2026-07-14.1-draft",
      summary,
      persisted: false,
      remoteTransportEnabled: false,
    });

    expect(receipt.status).toBe("internal_rehearsal_complete");
    expect(receipt.storageMode).toBe("memory_only");
    expect(receipt.canSupportExternalApproval).toBe(false);
    expect(receipt.canNameFacilitator).toBe(false);
  });

  it.each([
    ["incomplete", {}, false, false, "rehearsal_incomplete"],
    ["persisted", correctActions, true, false, "receipt_must_remain_memory_only"],
    ["remote", correctActions, false, true, "remote_transport_forbidden"],
  ])("rejects an unsafe receipt: %s", (_label, actions, persisted, remoteTransportEnabled, error) => {
    const summary = evaluateFacilitatorRehearsal(
      g1FacilitatorRehearsalScenarios,
      actions,
      readyContext,
      g1FacilitatorRehearsalPolicy,
    );

    expect(() => buildFacilitatorRehearsalReceipt({
      receiptId: "FAC-REHEARSAL-001",
      generatedAt: "2026-07-14T23:00:00.000Z",
      audiencePackId: "external-audience-g1-synthetic",
      audiencePackVersion: "2026-07-14.1-draft",
      summary,
      persisted,
      remoteTransportEnabled,
    })).toThrow(error);
  });
});
