import { describe, expect, it } from "vitest";
import { g1DesignPartnerSessionPolicy } from "@/data/g1DesignPartnerSession";
import {
  evaluateDesignPartnerHandoff,
  evaluateDesignPartnerSession,
  type DesignPartnerHandoffContext,
  type DesignPartnerSessionContext,
} from "./designPartnerSession";

const readyContext: DesignPartnerSessionContext = {
  dataMode: "synthetic",
  instrumentRuntimeReady: false,
  remoteTransportEnabled: false,
  scenarioCount: 3,
  runbookAvailable: true,
  acknowledgements: {
    synthetic_only: true,
    no_technical_decision: true,
    memory_only: true,
  },
};

const completeHandoff: DesignPartnerHandoffContext = {
  receiptId: "SYN-DEMO-001",
  syntheticMode: true,
  persisted: false,
  remoteTransportEnabled: false,
  confirmations: {
    limits_explained: true,
    receipt_viewed: true,
    feedback_tested: true,
    discard_explained: true,
  },
};

describe("design partner session governance", () => {
  it("releases only a local guided session after complete preflight", () => {
    const result = evaluateDesignPartnerSession(readyContext, g1DesignPartnerSessionPolicy);

    expect(result.status).toBe("ready_for_local_guided_session");
    expect(result.canRunLocalGuidedSession).toBe(true);
    expect(result.canRunExternalUnattendedSession).toBe(false);
    expect(result.blockers).toEqual([]);
  });

  it.each([
    ["real data", { dataMode: "real" }, "synthetic_mode_required"],
    ["instrument runtime", { instrumentRuntimeReady: true }, "instrument_runtime_must_remain_blocked"],
    ["remote transport", { remoteTransportEnabled: true }, "remote_transport_forbidden"],
    ["missing scenario", { scenarioCount: 0 }, "synthetic_scenario_required"],
    ["missing runbook", { runbookAvailable: false }, "runbook_required"],
  ])("fails closed for %s", (_label, override, blocker) => {
    const result = evaluateDesignPartnerSession(
      { ...readyContext, ...override } as DesignPartnerSessionContext,
      g1DesignPartnerSessionPolicy,
    );

    expect(result.canRunLocalGuidedSession).toBe(false);
    expect(result.blockers).toContain(blocker);
  });

  it("requires every explicit acknowledgement", () => {
    const result = evaluateDesignPartnerSession({
      ...readyContext,
      acknowledgements: { ...readyContext.acknowledgements, memory_only: false },
    }, g1DesignPartnerSessionPolicy);

    expect(result.blockers).toContain("acknowledgement_required:memory_only");
    expect(result.canRunLocalGuidedSession).toBe(false);
  });

  it("closes locally only after every handoff confirmation", () => {
    const result = evaluateDesignPartnerHandoff(completeHandoff, g1DesignPartnerSessionPolicy);

    expect(result.status).toBe("ready_to_close_locally");
    expect(result.canCloseLocally).toBe(true);
    expect(result.canShareExternally).toBe(false);
  });

  it("fails handoff closed for remote, persisted or incomplete state", () => {
    const result = evaluateDesignPartnerHandoff({
      ...completeHandoff,
      persisted: true,
      remoteTransportEnabled: true,
      confirmations: { ...completeHandoff.confirmations, receipt_viewed: false },
    }, g1DesignPartnerSessionPolicy);

    expect(result.canCloseLocally).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "persistence_forbidden",
      "remote_transport_forbidden",
      "confirmation_required:receipt_viewed",
    ]));
  });
});
