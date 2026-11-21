import { supabase } from "@/lib/runtime/appSupabaseClient";

export type AepAssessmentSummary = {
  assessment_id: string;
  cycle_id: string | null;
  cycle_name: string | null;
  context_label: string;
  context_kind: string;
  title: string;
  scope: string;
  version: number;
  status: "draft" | "collecting_evidence" | "technical_review" | "approved" | "superseded";
  methodology_version: string;
  author_id: string;
  reviewer_id: string | null;
  content_sha256: string | null;
  evidence_count: number;
  finding_count: number;
  aet_trigger_count: number;
  blockers: string[];
};

export type AepEvidenceSummary = {
  evidence_id: string;
  evidence_kind: string;
  method: string;
  source_ref: string;
  summary: string;
  occurred_at: string;
  participant_count: number | null;
};

async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(name as never, args as never);
  if (error) throw error;
  return data as T;
}

export const listAepAssessments = (organizationId: string) =>
  rpc<AepAssessmentSummary[]>("list_aep_assessments", { _organization_id: organizationId });

export const listAepEvidence = (assessmentId: string) =>
  rpc<AepEvidenceSummary[]>("list_aep_evidence", { _assessment_id: assessmentId });

export const createAepAssessment = (input: {
  organizationId: string; cycleId: string; unitId: string | null; contextKind: string;
  contextLabel: string; title: string; scope: string; methodologyVersion: string; limitations: string[];
}) => rpc<string>("create_aep_assessment", {
  _organization_id: input.organizationId, _cycle_id: input.cycleId, _unit_id: input.unitId,
  _context_kind: input.contextKind, _context_label: input.contextLabel, _title: input.title,
  _scope: input.scope, _methodology_version: input.methodologyVersion, _limitations: input.limitations,
});

export const addAepEvidence = (input: {
  assessmentId: string; evidenceKind: string; method: string; sourceRef: string;
  summary: string; occurredAt: string; participantCount: number | null; noPersonalDataConfirmed: boolean;
}) => rpc<string>("add_aep_evidence", {
  _assessment_id: input.assessmentId, _evidence_kind: input.evidenceKind, _method: input.method,
  _source_ref: input.sourceRef, _summary: input.summary, _occurred_at: input.occurredAt,
  _participant_count: input.participantCount, _no_personal_data_confirmed: input.noPersonalDataConfirmed,
});

export const addAepFinding = (input: {
  assessmentId: string; hazard: string; generatingSource: string; circumstances: string;
  durationPattern: string; frequencyPattern: string; exposedGroup: string; possibleHarm: string;
  evidenceIds: string[]; technicalNotes?: string;
}) => rpc<string>("add_aep_finding", {
  _assessment_id: input.assessmentId, _hazard: input.hazard, _generating_source: input.generatingSource,
  _circumstances: input.circumstances, _duration_pattern: input.durationPattern,
  _frequency_pattern: input.frequencyPattern, _exposed_group: input.exposedGroup,
  _possible_harm: input.possibleHarm, _evidence_ids: input.evidenceIds,
  _technical_notes: input.technicalNotes ?? null,
});

export const registerAetTrigger = (input: {
  assessmentId: string; triggerType: string; rationale: string; sourceRef: string;
  responsibleId: string; dueDate: string;
}) => rpc<string>("register_aet_trigger", {
  _assessment_id: input.assessmentId, _finding_id: null, _trigger_type: input.triggerType,
  _rationale: input.rationale, _source_ref: input.sourceRef,
  _responsible_id: input.responsibleId, _due_date: input.dueDate,
});

export const advanceAepAssessment = (assessmentId: string, targetStatus: string, rationale: string) =>
  rpc<void>("advance_aep_assessment", { _assessment_id: assessmentId, _target_status: targetStatus, _rationale: rationale });
