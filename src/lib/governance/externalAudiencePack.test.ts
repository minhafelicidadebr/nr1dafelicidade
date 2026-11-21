import { describe, expect, it } from "vitest";
import {
  g1ExternalAudiencePack,
  g1ExternalAudiencePackContext,
  g1ExternalAudiencePackPolicy,
} from "@/data/g1ExternalAudiencePack";
import { evaluateExternalAudiencePack } from "./externalAudiencePack";

describe("external audience pack", () => {
  it("allows internal rehearsal of the complete draft while external use remains blocked", () => {
    const result = evaluateExternalAudiencePack(
      g1ExternalAudiencePack,
      g1ExternalAudiencePackContext,
      g1ExternalAudiencePackPolicy,
    );

    expect(result.status).toBe("draft_ready_for_internal_rehearsal");
    expect(result.canRehearseInternally).toBe(true);
    expect(result.canUseWithExternalAudience).toBe(false);
    expect(result.canCollectAudienceData).toBe(false);
    expect(result.readySections).toBe(7);
    expect(result.declaredBoundaries).toBe(7);
    expect(result.nextBlocker).toBe("facilitator_missing");
  });

  it("fails the draft when a required section or boundary is missing", () => {
    const result = evaluateExternalAudiencePack({
      ...g1ExternalAudiencePack,
      sections: g1ExternalAudiencePack.sections.filter((section) => section.key !== "opening"),
      boundaries: g1ExternalAudiencePack.boundaries.map((boundary) =>
        boundary.key === "no_diagnosis" ? { ...boundary, declared: false } : boundary,
      ),
    }, g1ExternalAudiencePackContext, g1ExternalAudiencePackPolicy);

    expect(result.status).toBe("incomplete");
    expect(result.canRehearseInternally).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "required_section_missing",
      "required_boundary_missing",
    ]));
  });

  it("fails closed if real collection capabilities are introduced", () => {
    const result = evaluateExternalAudiencePack(g1ExternalAudiencePack, {
      ...g1ExternalAudiencePackContext,
      syntheticMode: false,
      freeTextCollectionEnabled: true,
      remoteTransportEnabled: true,
    }, g1ExternalAudiencePackPolicy);

    expect(result.canRehearseInternally).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "synthetic_mode_required",
      "free_text_collection_forbidden",
      "remote_transport_forbidden",
    ]));
  });

  it("rejects duplicated or structurally empty content instead of inflating minimums", () => {
    const firstQuestion = g1ExternalAudiencePack.questions[0];
    const firstStop = g1ExternalAudiencePack.stopConditions[0];
    const result = evaluateExternalAudiencePack({
      ...g1ExternalAudiencePack,
      sections: g1ExternalAudiencePack.sections.map((section) =>
        section.key === "opening" ? { ...section, lines: ["   "] } : section,
      ),
      questions: Array.from({ length: 6 }, () => firstQuestion),
      stopConditions: Array.from({ length: 6 }, () => firstStop),
    }, g1ExternalAudiencePackContext, g1ExternalAudiencePackPolicy);

    expect(result.canRehearseInternally).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "required_section_missing",
      "duplicate_question",
      "duplicate_stop_condition",
    ]));
  });

  it("releases external use only with roles, reviews, approval and receipt", () => {
    const missingReceipt = evaluateExternalAudiencePack(g1ExternalAudiencePack, {
      ...g1ExternalAudiencePackContext,
      facilitatorAssigned: true,
      accountableOwnerAssigned: true,
      legalReviewed: true,
      sstReviewed: true,
      formalDecision: "approved",
    }, g1ExternalAudiencePackPolicy);
    const approved = evaluateExternalAudiencePack(g1ExternalAudiencePack, {
      ...g1ExternalAudiencePackContext,
      facilitatorAssigned: true,
      accountableOwnerAssigned: true,
      legalReviewed: true,
      sstReviewed: true,
      formalDecision: "approved",
      formalDecisionEvidenceRef: "docs/external-audience-approval.md",
    }, g1ExternalAudiencePackPolicy);

    expect(missingReceipt.canUseWithExternalAudience).toBe(false);
    expect(missingReceipt.blockers).toContain("formal_decision_evidence_missing");
    expect(approved.status).toBe("approved_for_external_use");
    expect(approved.canUseWithExternalAudience).toBe(true);
    expect(approved.canCollectAudienceData).toBe(false);
  });

  it("exposes rejection as a terminal decision state", () => {
    const result = evaluateExternalAudiencePack(g1ExternalAudiencePack, {
      ...g1ExternalAudiencePackContext,
      formalDecision: "rejected",
    }, g1ExternalAudiencePackPolicy);

    expect(result.status).toBe("rejected");
    expect(result.canRehearseInternally).toBe(false);
    expect(result.canUseWithExternalAudience).toBe(false);
    expect(result.blockers).toContain("formal_decision_rejected");
  });
});
