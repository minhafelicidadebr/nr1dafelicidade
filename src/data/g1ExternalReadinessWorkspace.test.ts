import { describe, expect, it } from "vitest";
import { g1ExternalReadinessWorkspace } from "./g1ExternalReadinessWorkspace";

describe("g1ExternalReadinessWorkspace", () => {
  it("composes one fail-closed snapshot for governance and rehearsal", () => {
    const { externalAudiencePack, externalReadinessClosure, externalSessionDecision } = g1ExternalReadinessWorkspace;

    expect(externalSessionDecision.status).toBe("no_go");
    expect(externalSessionDecision.ready).toBe(2);
    expect(externalSessionDecision.total).toBe(6);
    expect(externalSessionDecision.canRunExternalSyntheticSession).toBe(false);
    expect(externalSessionDecision.canUseRealData).toBe(false);
    expect(externalAudiencePack.canRehearseInternally).toBe(true);
    expect(externalAudiencePack.canUseWithExternalAudience).toBe(false);
    expect(externalAudiencePack.canCollectAudienceData).toBe(false);
    expect(externalReadinessClosure.ready).toBe(0);
    expect(externalReadinessClosure.inProgress).toBe(3);
    expect(externalReadinessClosure.blocked).toBe(1);
    expect(externalReadinessClosure.nextItem?.key).toBe("accountability");
    expect(externalReadinessClosure.canRequestFormalReview).toBe(false);
    expect(externalReadinessClosure.canAdvanceGate).toBe(false);
  });
});
