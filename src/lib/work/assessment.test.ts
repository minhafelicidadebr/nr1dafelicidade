import { describe, expect, it } from "vitest";
import {
  canApproveWorkAssessment,
  canTransitionWorkAssessment,
  evaluateWorkAssessmentReadiness,
  type WorkAssessment,
} from "./assessment";

const completeAssessment = (): WorkAssessment => ({
  status: "technical_review",
  contextId: "context-1",
  authorId: "author",
  reviewerId: "reviewer",
  methodologyVersion: "aep-g2-draft-1",
  reviewRationale: "Revisão técnica registrada",
  contentSha256: "a".repeat(64),
  evidence: [
    { id: "obs", kind: "observation", method: "observação", sourceRef: "field/1", authorId: "author", occurredAt: "2026-06-23", summary: "Contexto agregado", noPersonalDataConfirmed: true },
    { id: "part", kind: "worker_participation", method: "oficina", sourceRef: "minutes/1", authorId: "author", occurredAt: "2026-06-23", summary: "Síntese coletiva", noPersonalDataConfirmed: true },
  ],
  findings: [{
    hazard: "Exigência organizacional",
    generatingSource: "Organização do processo",
    circumstances: "Situação observada",
    durationPattern: "Período descrito",
    frequencyPattern: "Frequência descrita",
    exposedGroup: "Grupo funcional",
    possibleHarm: "Agravo possível, sem diagnóstico",
    evidenceIds: ["obs", "part"],
  }],
});

describe("work assessment mechanism", () => {
  it("enforces the forward-only lifecycle", () => {
    expect(canTransitionWorkAssessment("draft", "collecting_evidence")).toBe(true);
    expect(canTransitionWorkAssessment("technical_review", "collecting_evidence")).toBe(false);
    expect(canTransitionWorkAssessment("approved", "superseded")).toBe(true);
    expect(canTransitionWorkAssessment("superseded", "approved")).toBe(false);
  });

  it("requires observation of actual work", () => {
    const assessment = completeAssessment();
    assessment.evidence = assessment.evidence.filter((item) => item.kind !== "observation");
    expect(evaluateWorkAssessmentReadiness(assessment)).toContain("work_observation_missing");
  });

  it("requires worker or CIPA participation as evidence", () => {
    const assessment = completeAssessment();
    assessment.evidence = assessment.evidence.filter((item) => item.kind === "observation");
    expect(evaluateWorkAssessmentReadiness(assessment)).toContain("worker_participation_missing");
  });

  it("rejects findings without contextual fields and evidence", () => {
    const assessment = completeAssessment();
    assessment.findings[0].circumstances = "";
    assessment.findings[0].evidenceIds = ["unknown"];
    expect(evaluateWorkAssessmentReadiness(assessment)).toEqual(
      expect.arrayContaining(["finding_1_incomplete", "finding_1_evidence_missing"]),
    );
  });

  it("requires an independent reviewer", () => {
    const assessment = completeAssessment();
    assessment.reviewerId = assessment.authorId;
    expect(evaluateWorkAssessmentReadiness(assessment)).toContain("independent_reviewer_missing");
  });

  it("rejects evidence when no-personal-data confirmation is absent", () => {
    const assessment = completeAssessment();
    assessment.evidence[0].noPersonalDataConfirmed = false;
    expect(evaluateWorkAssessmentReadiness(assessment)).toContain("personal_data_confirmation_missing");
  });

  it("approves only a complete assessment in technical review", () => {
    expect(canApproveWorkAssessment(completeAssessment())).toBe(true);
    const draft = completeAssessment();
    draft.status = "collecting_evidence";
    expect(canApproveWorkAssessment(draft)).toBe(false);
  });
});
