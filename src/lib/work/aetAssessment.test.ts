import { describe, expect, it } from "vitest";
import { canApproveAet, canTransitionAet, evaluateAetReadiness, type AetAssessment } from "./aetAssessment";

const complete = (): AetAssessment => ({
  status: "technical_review", triggerId: "trigger", scope: "Atividade e variabilidades", responsibleId: "responsible",
  methodologyVersion: "aet-g2-draft", authorId: "author", reviewerId: "reviewer",
  reviewRationale: "Revisão independente", contentSha256: "a".repeat(64),
  evidence: [
    { id: "obs", kind: "observation", method: "observação", sourceRef: "field/1", summary: "Síntese", noPersonalDataConfirmed: true },
    { id: "part", kind: "worker_participation", method: "oficina", sourceRef: "minutes/1", summary: "Síntese coletiva", noPersonalDataConfirmed: true },
  ],
  findings: [{ id: "finding", description: "Achado", workDeterminants: "Determinantes", variability: "Variabilidade", consequences: "Consequências possíveis", evidenceIds: ["obs", "part"] }],
  recommendations: [{ findingId: "finding", title: "Recomendação", rationale: "Justificativa", expectedOutcome: "Resultado esperado", responsibleId: "responsible", dueDate: "2026-07-30", actionItemId: "action" }],
});

describe("AET assessment mechanism", () => {
  it("enforces the technical lifecycle", () => {
    expect(canTransitionAet("draft", "scoped")).toBe(true);
    expect(canTransitionAet("in_progress", "approved")).toBe(false);
    expect(canTransitionAet("approved", "closed")).toBe(true);
    expect(canTransitionAet("superseded", "approved")).toBe(false);
  });

  it("requires an explicit trigger and scoped responsible", () => {
    const item = complete(); item.triggerId = null; item.responsibleId = null;
    expect(evaluateAetReadiness(item)).toEqual(expect.arrayContaining(["aet_trigger_missing", "aet_responsible_missing"]));
  });

  it("requires observation and participation", () => {
    const item = complete(); item.evidence = [];
    expect(evaluateAetReadiness(item)).toEqual(expect.arrayContaining(["aet_observation_missing", "aet_participation_missing"]));
  });

  it("requires every finding to have evidence and recommendation", () => {
    const item = complete(); item.findings[0].evidenceIds = []; item.recommendations = [];
    expect(evaluateAetReadiness(item)).toEqual(expect.arrayContaining([
      "aet_finding_finding_evidence_missing", "aet_finding_finding_recommendation_missing",
    ]));
  });

  it("requires actionable recommendation fields", () => {
    const item = complete(); item.recommendations[0].actionItemId = "";
    expect(evaluateAetReadiness(item)).toContain("aet_recommendation_incomplete");
  });

  it("requires independent review and canonical hash", () => {
    const item = complete(); item.reviewerId = item.authorId; item.contentSha256 = null;
    expect(evaluateAetReadiness(item)).toEqual(expect.arrayContaining([
      "aet_independent_reviewer_missing", "aet_content_hash_missing_or_invalid",
    ]));
  });

  it("approves only a complete assessment in technical review", () => {
    expect(canApproveAet(complete())).toBe(true);
    const item = complete(); item.status = "in_progress";
    expect(canApproveAet(item)).toBe(false);
  });
});
