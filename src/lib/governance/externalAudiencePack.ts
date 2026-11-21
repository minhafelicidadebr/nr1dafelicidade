export type ExternalAudienceSectionKey =
  | "opening"
  | "scope"
  | "boundaries"
  | "walkthrough"
  | "difficult_questions"
  | "stop_conditions"
  | "closing";

export type ExternalAudienceBoundaryKey =
  | "synthetic_only"
  | "no_diagnosis"
  | "no_compliance_guarantee"
  | "no_real_data"
  | "no_delivery"
  | "instrument_not_validated"
  | "does_not_replace_aep_aet";

export type ExternalAudiencePackSection = {
  key: ExternalAudienceSectionKey;
  label: string;
  status: "ready" | "draft" | "missing";
  lines: readonly string[];
};

export type ExternalAudienceBoundary = {
  key: ExternalAudienceBoundaryKey;
  label: string;
  declared: boolean;
};

export type ExternalAudienceQuestion = {
  key: string;
  question: string;
  safeAnswer: string;
  escalation: string;
};

export type ExternalAudienceStopCondition = {
  key: string;
  trigger: string;
  recovery: string;
};

export type ExternalAudiencePackInput = {
  packId: string;
  version: string;
  sections: readonly ExternalAudiencePackSection[];
  boundaries: readonly ExternalAudienceBoundary[];
  questions: readonly ExternalAudienceQuestion[];
  stopConditions: readonly ExternalAudienceStopCondition[];
};

export type ExternalAudiencePackPolicy = {
  policyId: string;
  requiredSections: readonly ExternalAudienceSectionKey[];
  requiredBoundaries: readonly ExternalAudienceBoundaryKey[];
  minimumQuestions: number;
  minimumStopConditions: number;
  requireFacilitator: boolean;
  requireAccountableOwner: boolean;
  requireLegalReview: boolean;
  requireSstReview: boolean;
  requireFormalDecision: boolean;
};

export type ExternalAudiencePackContext = {
  syntheticMode: boolean;
  freeTextCollectionEnabled: boolean;
  remoteTransportEnabled: boolean;
  facilitatorAssigned: boolean;
  accountableOwnerAssigned: boolean;
  legalReviewed: boolean;
  sstReviewed: boolean;
  formalDecision: "pending" | "approved" | "rejected";
  formalDecisionEvidenceRef: string | null;
};

export type ExternalAudiencePackBlocker =
  | "pack_identity_missing"
  | "required_section_missing"
  | "duplicate_section"
  | "required_boundary_missing"
  | "duplicate_boundary"
  | "question_set_incomplete"
  | "duplicate_question"
  | "stop_conditions_incomplete"
  | "duplicate_stop_condition"
  | "synthetic_mode_required"
  | "free_text_collection_forbidden"
  | "remote_transport_forbidden"
  | "facilitator_missing"
  | "accountable_owner_missing"
  | "legal_review_missing"
  | "sst_review_missing"
  | "formal_decision_pending"
  | "formal_decision_rejected"
  | "formal_decision_evidence_missing";

export type ExternalAudiencePackSummary = {
  policyId: string;
  packId: string;
  version: string;
  status: "incomplete" | "draft_ready_for_internal_rehearsal" | "approved_for_external_use" | "rejected";
  canRehearseInternally: boolean;
  canUseWithExternalAudience: boolean;
  canCollectAudienceData: false;
  blockers: ExternalAudiencePackBlocker[];
  readySections: number;
  requiredSections: number;
  declaredBoundaries: number;
  requiredBoundaries: number;
  questionCount: number;
  stopConditionCount: number;
  nextBlocker: ExternalAudiencePackBlocker | null;
};

export function evaluateExternalAudiencePack(
  pack: ExternalAudiencePackInput,
  context: ExternalAudiencePackContext,
  policy: ExternalAudiencePackPolicy,
): ExternalAudiencePackSummary {
  const blockers: ExternalAudiencePackBlocker[] = [];
  const sectionKeys = pack.sections.map((section) => section.key);
  const boundaryKeys = pack.boundaries.map((boundary) => boundary.key);
  const questionKeys = pack.questions.map((question) => question.key);
  const stopConditionKeys = pack.stopConditions.map((condition) => condition.key);
  const requiredSections = policy.requiredSections.map((key) => pack.sections.find((section) => section.key === key));
  const requiredBoundaries = policy.requiredBoundaries.map((key) => pack.boundaries.find((boundary) => boundary.key === key));
  const readySections = requiredSections.filter((section) =>
    section?.status === "ready" && section.label.trim() && section.lines.some((line) => line.trim()),
  ).length;
  const declaredBoundaries = requiredBoundaries.filter((boundary) => boundary?.declared && boundary.label.trim()).length;
  const validQuestions = pack.questions.filter((question) =>
    question.key.trim() && question.question.trim() && question.safeAnswer.trim() && question.escalation.trim(),
  );
  const validStops = pack.stopConditions.filter((condition) =>
    condition.key.trim() && condition.trigger.trim() && condition.recovery.trim(),
  );

  if (!pack.packId.trim() || !pack.version.trim()) blockers.push("pack_identity_missing");
  if (readySections !== policy.requiredSections.length) blockers.push("required_section_missing");
  if (hasDuplicates(sectionKeys)) blockers.push("duplicate_section");
  if (declaredBoundaries !== policy.requiredBoundaries.length) blockers.push("required_boundary_missing");
  if (hasDuplicates(boundaryKeys)) blockers.push("duplicate_boundary");
  if (validQuestions.length < policy.minimumQuestions || validQuestions.length !== pack.questions.length) {
    blockers.push("question_set_incomplete");
  }
  if (hasDuplicates(questionKeys)) blockers.push("duplicate_question");
  if (validStops.length < policy.minimumStopConditions || validStops.length !== pack.stopConditions.length) {
    blockers.push("stop_conditions_incomplete");
  }
  if (hasDuplicates(stopConditionKeys)) blockers.push("duplicate_stop_condition");
  if (!context.syntheticMode) blockers.push("synthetic_mode_required");
  if (context.freeTextCollectionEnabled) blockers.push("free_text_collection_forbidden");
  if (context.remoteTransportEnabled) blockers.push("remote_transport_forbidden");
  if (policy.requireFacilitator && !context.facilitatorAssigned) blockers.push("facilitator_missing");
  if (policy.requireAccountableOwner && !context.accountableOwnerAssigned) blockers.push("accountable_owner_missing");
  if (policy.requireLegalReview && !context.legalReviewed) blockers.push("legal_review_missing");
  if (policy.requireSstReview && !context.sstReviewed) blockers.push("sst_review_missing");
  if (policy.requireFormalDecision) {
    if (context.formalDecision === "pending") blockers.push("formal_decision_pending");
    if (context.formalDecision === "rejected") blockers.push("formal_decision_rejected");
    if (context.formalDecision === "approved" && !context.formalDecisionEvidenceRef?.trim()) {
      blockers.push("formal_decision_evidence_missing");
    }
  }

  const contentBlockers: ExternalAudiencePackBlocker[] = [
    "pack_identity_missing",
    "required_section_missing",
    "duplicate_section",
    "required_boundary_missing",
    "duplicate_boundary",
    "question_set_incomplete",
    "duplicate_question",
    "stop_conditions_incomplete",
    "duplicate_stop_condition",
    "synthetic_mode_required",
    "free_text_collection_forbidden",
    "remote_transport_forbidden",
  ];
  const canRehearseInternally =
    context.formalDecision !== "rejected" &&
    !blockers.some((blocker) => contentBlockers.includes(blocker));
  const canUseWithExternalAudience = canRehearseInternally && blockers.length === 0;

  const uniqueBlockers = unique(blockers);

  return {
    policyId: policy.policyId,
    packId: pack.packId,
    version: pack.version,
    status: context.formalDecision === "rejected"
      ? "rejected"
      : canUseWithExternalAudience
        ? "approved_for_external_use"
        : canRehearseInternally
          ? "draft_ready_for_internal_rehearsal"
          : "incomplete",
    canRehearseInternally,
    canUseWithExternalAudience,
    canCollectAudienceData: false,
    blockers: uniqueBlockers,
    readySections,
    requiredSections: policy.requiredSections.length,
    declaredBoundaries,
    requiredBoundaries: policy.requiredBoundaries.length,
    questionCount: validQuestions.length,
    stopConditionCount: validStops.length,
    nextBlocker: uniqueBlockers[0] ?? null,
  };
}

export function externalAudiencePackBlockerLabel(blocker: ExternalAudiencePackBlocker) {
  const labels: Record<ExternalAudiencePackBlocker, string> = {
    pack_identity_missing: "Versionar e identificar o pacote antes do ensaio.",
    required_section_missing: "Completar todas as seções obrigatórias do roteiro.",
    duplicate_section: "Remover seções duplicadas do roteiro.",
    required_boundary_missing: "Declarar todos os limites obrigatórios da demonstração.",
    duplicate_boundary: "Remover limites duplicados da demonstração.",
    question_set_incomplete: "Completar respostas seguras para as perguntas críticas.",
    duplicate_question: "Manter uma identidade única para cada pergunta crítica.",
    stop_conditions_incomplete: "Completar gatilhos de interrupção e recuperação.",
    duplicate_stop_condition: "Manter uma identidade única para cada condição de interrupção.",
    synthetic_mode_required: "Manter a sessão exclusivamente sintética.",
    free_text_collection_forbidden: "Remover coleta livre de conteúdo da audiência.",
    remote_transport_forbidden: "Manter envio e persistência remotos desabilitados.",
    facilitator_missing: "Nomear facilitador antes de qualquer sessão externa.",
    accountable_owner_missing: "Nomear accountable com autoridade de suspensão.",
    legal_review_missing: "Obter revisão Jurídica/regulatória do roteiro e claims.",
    sst_review_missing: "Obter revisão SST/Ergonomia dos limites técnicos.",
    formal_decision_pending: "Registrar decisão formal sobre o uso externo do pacote.",
    formal_decision_rejected: "Resolver a rejeição antes de novo pedido de revisão.",
    formal_decision_evidence_missing: "Vincular ata ou parecer à aprovação formal.",
  };
  return labels[blocker];
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function hasDuplicates(values: readonly string[]) {
  return new Set(values).size !== values.length;
}
