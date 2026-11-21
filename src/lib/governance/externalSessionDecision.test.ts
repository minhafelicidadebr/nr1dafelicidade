import { describe, expect, it } from "vitest";
import {
  buildG1ExternalSessionEvidence,
  g1ExternalSessionDecisionContext,
  g1ExternalSessionDecisionPolicy,
} from "@/data/g1ExternalSessionDecision";
import { g1DemoRehearsalContext, g1DemoRehearsalItems, g1DemoRehearsalPolicy } from "@/data/g1DemoRehearsal";
import { g1FormalAcceptancePolicy, g1FormalDecisions, g1FormalRoles } from "@/data/g1FormalAcceptance";
import { g1PublicDemoReadinessContext, g1PublicDemoReadinessItems, g1PublicDemoReadinessPolicy } from "@/data/g1PublicDemoReadiness";
import { g1ResidualRiskContext, g1ResidualRiskPolicy, g1ResidualRisks } from "@/data/g1ResidualRiskRegister";
import {
  officialPublishedBaselineEvidence,
  publishedBaselinePolicy,
} from "@/data/releaseSyncReadiness";
import { evaluateDemoRehearsal } from "./demoRehearsal";
import { evaluateFormalAcceptance } from "./formalAcceptance";
import { evaluatePublicDemoReadiness } from "./publicDemoReadiness";
import { evaluateResidualRiskRegister } from "./residualRiskRegister";
import { evaluatePublishedBaselineReadiness } from "@/lib/release/syncReadiness";
import {
  evaluateExternalSessionDecision,
  type ExternalSessionEvidenceInput,
} from "./externalSessionDecision";

const readyEvidence: ExternalSessionEvidenceInput[] = g1ExternalSessionDecisionPolicy.requiredDimensions.map((dimension) => ({
  key: dimension,
  label: dimension,
  dimension,
  status: "ready",
  evidenceRef: `docs/${dimension}.md`,
  detail: "Evidência verificada.",
}));

describe("external synthetic session decision", () => {
  it("composes the current specialist summaries without masking external blockers", () => {
    const evidence = buildG1ExternalSessionEvidence({
      demoRehearsal: evaluateDemoRehearsal(g1DemoRehearsalItems, g1DemoRehearsalContext, g1DemoRehearsalPolicy),
      publicDemo: evaluatePublicDemoReadiness(g1PublicDemoReadinessItems, g1PublicDemoReadinessContext, g1PublicDemoReadinessPolicy),
      publishedBaseline: evaluatePublishedBaselineReadiness(
        officialPublishedBaselineEvidence,
        publishedBaselinePolicy,
      ),
      formalAcceptance: evaluateFormalAcceptance(g1FormalRoles, g1FormalDecisions, g1FormalAcceptancePolicy),
      residualRisk: evaluateResidualRiskRegister(g1ResidualRisks, g1ResidualRiskContext, g1ResidualRiskPolicy),
    });
    const result = evaluateExternalSessionDecision(evidence, g1ExternalSessionDecisionContext, g1ExternalSessionDecisionPolicy);

    expect(result.status).toBe("no_go");
    expect(result.ready).toBe(2);
    expect(result.total).toBe(6);
    expect(result.nextStep?.dimension).toBe("narrative");
    expect(result.canRunExternalSyntheticSession).toBe(false);
  });

  it("keeps the current packet in No-Go when required evidence is blocked", () => {
    const evidence = readyEvidence.map((item) => item.dimension === "release" ? { ...item, status: "blocked" as const } : item);
    const result = evaluateExternalSessionDecision(evidence, g1ExternalSessionDecisionContext, g1ExternalSessionDecisionPolicy);

    expect(result.status).toBe("no_go");
    expect(result.canRequestFormalReview).toBe(false);
    expect(result.canRunExternalSyntheticSession).toBe(false);
    expect(result.canUseRealData).toBe(false);
    expect(result.nextStep?.dimension).toBe("release");
  });

  it("allows formal review but not the session when evidence is ready and decision is pending", () => {
    const result = evaluateExternalSessionDecision(readyEvidence, g1ExternalSessionDecisionContext, g1ExternalSessionDecisionPolicy);

    expect(result.status).toBe("ready_for_formal_review");
    expect(result.canRequestFormalReview).toBe(true);
    expect(result.canRunExternalSyntheticSession).toBe(false);
    expect(result.blockers).toContain("formal_decision_pending");
  });

  it("requires a decision receipt before releasing the external synthetic session", () => {
    const withoutReceipt = evaluateExternalSessionDecision(readyEvidence, {
      ...g1ExternalSessionDecisionContext,
      formalDecision: "approved",
    }, g1ExternalSessionDecisionPolicy);
    const approved = evaluateExternalSessionDecision(readyEvidence, {
      ...g1ExternalSessionDecisionContext,
      formalDecision: "approved",
      formalDecisionEvidenceRef: "docs/meeting-minutes.md",
    }, g1ExternalSessionDecisionPolicy);

    expect(withoutReceipt.canRunExternalSyntheticSession).toBe(false);
    expect(withoutReceipt.blockers).toContain("formal_decision_evidence_missing");
    expect(approved.status).toBe("approved_for_external_synthetic_session");
    expect(approved.canRunExternalSyntheticSession).toBe(true);
    expect(approved.canUseRealData).toBe(false);
  });

  it("fails closed for missing dimensions, real data, gate claims or rejection", () => {
    const result = evaluateExternalSessionDecision(readyEvidence.slice(1), {
      ...g1ExternalSessionDecisionContext,
      realDataEnabled: true,
      gateAdvanceClaimed: true,
      formalDecision: "rejected",
    }, g1ExternalSessionDecisionPolicy);

    expect(result.status).toBe("rejected");
    expect(result.canRequestFormalReview).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "required_dimension_missing",
      "real_data_enabled",
      "gate_advance_claimed",
      "formal_decision_rejected",
    ]));
  });
});
