export type WorkAssessmentStatus =
  | "draft"
  | "collecting_evidence"
  | "technical_review"
  | "approved"
  | "superseded";

export type WorkEvidenceKind =
  | "observation"
  | "interview"
  | "workshop"
  | "document"
  | "worker_participation"
  | "cipa_participation";

export type WorkEvidence = {
  id: string;
  kind: WorkEvidenceKind;
  method: string;
  sourceRef: string;
  authorId: string;
  occurredAt: string;
  summary: string;
  noPersonalDataConfirmed: boolean;
};

export type WorkFinding = {
  hazard: string;
  generatingSource: string;
  circumstances: string;
  durationPattern: string;
  frequencyPattern: string;
  exposedGroup: string;
  possibleHarm: string;
  evidenceIds: string[];
};

export type WorkAssessment = {
  status: WorkAssessmentStatus;
  contextId: string | null;
  authorId: string;
  reviewerId: string | null;
  methodologyVersion: string;
  reviewRationale: string | null;
  contentSha256: string | null;
  evidence: WorkEvidence[];
  findings: WorkFinding[];
};

const TRANSITIONS: Record<WorkAssessmentStatus, WorkAssessmentStatus[]> = {
  draft: ["draft", "collecting_evidence"],
  collecting_evidence: ["collecting_evidence", "technical_review"],
  technical_review: ["technical_review", "approved"],
  approved: ["approved", "superseded"],
  superseded: ["superseded"],
};

export function canTransitionWorkAssessment(from: WorkAssessmentStatus, to: WorkAssessmentStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function evaluateWorkAssessmentReadiness(assessment: WorkAssessment): string[] {
  const blockers = new Set<string>();
  const evidenceIds = new Set(assessment.evidence.map((item) => item.id));

  if (!assessment.contextId) blockers.add("work_context_missing");
  if (!assessment.methodologyVersion.trim()) blockers.add("methodology_version_missing");
  if (!assessment.evidence.some((item) => item.kind === "observation")) blockers.add("work_observation_missing");
  if (!assessment.evidence.some((item) => ["worker_participation", "cipa_participation"].includes(item.kind))) {
    blockers.add("worker_participation_missing");
  }
  if (assessment.evidence.some((item) => !item.noPersonalDataConfirmed)) blockers.add("personal_data_confirmation_missing");
  if (assessment.evidence.some((item) => !item.method.trim() || !item.sourceRef.trim() || !item.summary.trim())) {
    blockers.add("evidence_traceability_incomplete");
  }
  if (assessment.findings.length === 0) blockers.add("contextual_finding_missing");

  assessment.findings.forEach((finding, index) => {
    const required = [
      finding.hazard,
      finding.generatingSource,
      finding.circumstances,
      finding.durationPattern,
      finding.frequencyPattern,
      finding.exposedGroup,
      finding.possibleHarm,
    ];
    if (required.some((value) => !value.trim())) blockers.add(`finding_${index + 1}_incomplete`);
    if (finding.evidenceIds.length === 0 || finding.evidenceIds.some((id) => !evidenceIds.has(id))) {
      blockers.add(`finding_${index + 1}_evidence_missing`);
    }
  });

  if (!assessment.reviewerId || assessment.reviewerId === assessment.authorId) blockers.add("independent_reviewer_missing");
  if (!assessment.reviewRationale?.trim()) blockers.add("review_rationale_missing");
  if (!assessment.contentSha256 || !/^[a-f0-9]{64}$/i.test(assessment.contentSha256)) blockers.add("content_hash_missing_or_invalid");

  return [...blockers];
}

export const canApproveWorkAssessment = (assessment: WorkAssessment) =>
  assessment.status === "technical_review" && evaluateWorkAssessmentReadiness(assessment).length === 0;
