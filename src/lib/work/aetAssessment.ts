export type AetStatus = "draft" | "scoped" | "in_progress" | "technical_review" | "approved" | "closed" | "superseded";

export type AetEvidence = {
  id: string;
  kind: "observation" | "interview" | "workshop" | "document" | "worker_participation" | "cipa_participation";
  method: string;
  sourceRef: string;
  summary: string;
  noPersonalDataConfirmed: boolean;
};

export type AetFinding = {
  id: string;
  description: string;
  workDeterminants: string;
  variability: string;
  consequences: string;
  evidenceIds: string[];
};

export type AetRecommendation = {
  findingId: string;
  title: string;
  rationale: string;
  expectedOutcome: string;
  responsibleId: string;
  dueDate: string;
  actionItemId: string;
};

export type AetAssessment = {
  status: AetStatus;
  triggerId: string | null;
  scope: string;
  responsibleId: string | null;
  methodologyVersion: string;
  authorId: string;
  reviewerId: string | null;
  reviewRationale: string | null;
  contentSha256: string | null;
  evidence: AetEvidence[];
  findings: AetFinding[];
  recommendations: AetRecommendation[];
};

const transitions: Record<AetStatus, AetStatus[]> = {
  draft: ["draft", "scoped"],
  scoped: ["scoped", "in_progress"],
  in_progress: ["in_progress", "technical_review"],
  technical_review: ["technical_review", "approved"],
  approved: ["approved", "closed", "superseded"],
  closed: ["closed", "superseded"],
  superseded: ["superseded"],
};

export const canTransitionAet = (from: AetStatus, to: AetStatus) => transitions[from].includes(to);

export function evaluateAetReadiness(assessment: AetAssessment): string[] {
  const blockers = new Set<string>();
  const evidenceIds = new Set(assessment.evidence.map((item) => item.id));
  const findingIds = new Set(assessment.findings.map((item) => item.id));

  if (!assessment.triggerId) blockers.add("aet_trigger_missing");
  if (!assessment.scope.trim()) blockers.add("aet_scope_missing");
  if (!assessment.responsibleId) blockers.add("aet_responsible_missing");
  if (!assessment.methodologyVersion.trim()) blockers.add("aet_methodology_missing");
  if (!assessment.evidence.some((item) => item.kind === "observation")) blockers.add("aet_observation_missing");
  if (!assessment.evidence.some((item) => ["worker_participation", "cipa_participation"].includes(item.kind))) blockers.add("aet_participation_missing");
  if (assessment.evidence.some((item) => !item.noPersonalDataConfirmed)) blockers.add("aet_personal_data_confirmation_missing");
  if (assessment.evidence.some((item) => !item.method.trim() || !item.sourceRef.trim() || !item.summary.trim())) blockers.add("aet_evidence_traceability_incomplete");
  if (assessment.findings.length === 0) blockers.add("aet_finding_missing");

  for (const finding of assessment.findings) {
    if (![finding.description, finding.workDeterminants, finding.variability, finding.consequences].every((value) => value.trim())) {
      blockers.add(`aet_finding_${finding.id}_incomplete`);
    }
    if (finding.evidenceIds.length === 0 || finding.evidenceIds.some((id) => !evidenceIds.has(id))) {
      blockers.add(`aet_finding_${finding.id}_evidence_missing`);
    }
    if (!assessment.recommendations.some((recommendation) => recommendation.findingId === finding.id)) {
      blockers.add(`aet_finding_${finding.id}_recommendation_missing`);
    }
  }

  for (const recommendation of assessment.recommendations) {
    if (!findingIds.has(recommendation.findingId)) blockers.add("aet_recommendation_finding_invalid");
    if (![recommendation.title, recommendation.rationale, recommendation.expectedOutcome, recommendation.responsibleId, recommendation.dueDate, recommendation.actionItemId].every((value) => value.trim())) {
      blockers.add("aet_recommendation_incomplete");
    }
  }

  if (!assessment.reviewerId || assessment.reviewerId === assessment.authorId) blockers.add("aet_independent_reviewer_missing");
  if (!assessment.reviewRationale?.trim()) blockers.add("aet_review_rationale_missing");
  if (!assessment.contentSha256 || !/^[a-f0-9]{64}$/i.test(assessment.contentSha256)) blockers.add("aet_content_hash_missing_or_invalid");
  return [...blockers];
}

export const canApproveAet = (assessment: AetAssessment) =>
  assessment.status === "technical_review" && evaluateAetReadiness(assessment).length === 0;
