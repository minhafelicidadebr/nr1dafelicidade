import type {
  PaidAdvisoryAuthorizationRoleKey,
  PaidAdvisoryAuthorizationSummary,
} from "./paidAdvisoryAuthorization";

export type PaidAdvisoryAuthorizationMeetingAgendaItem = {
  key: string;
  label: string;
  objective: string;
  required: boolean;
  complete: boolean;
  ownerRoles: readonly PaidAdvisoryAuthorizationRoleKey[];
  decisionKey: string | null;
  requiredEvidence: readonly string[];
};

export type PaidAdvisoryAuthorizationMeetingPreRead = {
  key: string;
  label: string;
  required: boolean;
  available: boolean;
  versionRef: string | null;
};

export type PaidAdvisoryAuthorizationMeetingOutput = {
  key: string;
  label: string;
  decisionKey: string;
  required: boolean;
  evidenceRequirements: readonly string[];
};

export type PaidAdvisoryAuthorizationMeetingExternalReadiness = {
  nominatedRoleKeys: readonly PaidAdvisoryAuthorizationRoleKey[];
  authorityEvidenceRoleKeys: readonly PaidAdvisoryAuthorizationRoleKey[];
  preReadsDistributed: boolean;
  recorderMandateConfirmed: boolean;
  convocationReviewApproved: boolean;
};

export type PaidAdvisoryAuthorizationMeetingContext = {
  syntheticScopeOnly: boolean;
  personalDataPresent: boolean;
  persistenceEnabled: boolean;
  remoteSchedulingEnabled: boolean;
  externalInvitationSent: boolean;
  meetingClaimedAsHeld: boolean;
  saleClaimedAsAuthorized: boolean;
};

export type PaidAdvisoryAuthorizationMeetingPolicy = {
  policyId: string;
  requiredRoleKeys: readonly PaidAdvisoryAuthorizationRoleKey[];
  requiredDecisionKeys: readonly string[];
  minimumAgendaItems: number;
  minimumPreReads: number;
  requireReviewPacketReady: boolean;
  requireAllRolesNominatedForConvocationReview: boolean;
  requireAuthorityEvidenceForConvocationReview: boolean;
  requirePreReadDistributionForConvocationReview: boolean;
  requireRecorderMandateForConvocationReview: boolean;
  requireIndependentConvocationReview: boolean;
  prohibitPersonalData: boolean;
  prohibitPersistence: boolean;
  prohibitRemoteScheduling: boolean;
  prohibitExternalInvitation: boolean;
  prohibitMeetingClaim: boolean;
  prohibitSaleAuthorizationClaim: boolean;
};

export type PaidAdvisoryAuthorizationMeetingBlocker =
  | "authorization_review_packet_not_ready"
  | "required_role_missing"
  | "required_decision_missing"
  | "agenda_invalid"
  | "preread_invalid"
  | "expected_output_invalid"
  | "nomination_key_invalid"
  | "authority_key_invalid"
  | "synthetic_scope_required"
  | "personal_data_forbidden"
  | "persistence_forbidden"
  | "remote_scheduling_forbidden"
  | "external_invitation_forbidden"
  | "meeting_claim_forbidden"
  | "sale_authorization_claim_forbidden"
  | "role_nomination_incomplete"
  | "authority_evidence_incomplete"
  | "prereads_not_distributed"
  | "recorder_mandate_missing"
  | "convocation_review_missing";

export type PaidAdvisoryAuthorizationMeetingSummary = {
  policyId: string;
  status:
    | "blocked"
    | "packet_ready_for_external_nomination"
    | "ready_for_human_convocation_review"
    | "authorization_already_complete";
  canUseInternalPacket: boolean;
  canRequestHumanConvocationReview: boolean;
  canScheduleMeeting: false;
  canSendInvitation: false;
  canRecordDecision: false;
  canAuthorizeSale: false;
  packetBlockers: PaidAdvisoryAuthorizationMeetingBlocker[];
  convocationBlockers: PaidAdvisoryAuthorizationMeetingBlocker[];
  requiredRoles: number;
  nominatedRoles: number;
  authorityEvidenceRoles: number;
  requiredAgendaItems: number;
  readyAgendaItems: number;
  requiredPreReads: number;
  readyPreReads: number;
  requiredOutputs: number;
  readyOutputTemplates: number;
};

export function evaluatePaidAdvisoryAuthorizationMeeting(
  authorization: PaidAdvisoryAuthorizationSummary,
  agenda: readonly PaidAdvisoryAuthorizationMeetingAgendaItem[],
  preReads: readonly PaidAdvisoryAuthorizationMeetingPreRead[],
  outputs: readonly PaidAdvisoryAuthorizationMeetingOutput[],
  externalReadiness: PaidAdvisoryAuthorizationMeetingExternalReadiness,
  context: PaidAdvisoryAuthorizationMeetingContext,
  policy: PaidAdvisoryAuthorizationMeetingPolicy,
): PaidAdvisoryAuthorizationMeetingSummary {
  const packetBlockers: PaidAdvisoryAuthorizationMeetingBlocker[] = [];
  const authorizationRoleKeys = authorization.roles.map((role) => role.key);
  const authorizationDecisionKeys = authorization.decisions.map((decision) => decision.key);
  const requiredAgenda = agenda.filter((item) => item.required);
  const requiredPreReads = preReads.filter((item) => item.required);
  const requiredOutputs = outputs.filter((output) => output.required);
  const roleKeySet = new Set<PaidAdvisoryAuthorizationRoleKey>(policy.requiredRoleKeys);
  const decisionKeySet = new Set(policy.requiredDecisionKeys);

  if (policy.requireReviewPacketReady && !authorization.canRequestFormalReview) {
    packetBlockers.push("authorization_review_packet_not_ready");
  }
  if (
    hasDuplicates(policy.requiredRoleKeys) ||
    !policy.requiredRoleKeys.every((key) => authorizationRoleKeys.includes(key))
  ) {
    packetBlockers.push("required_role_missing");
  }
  if (
    hasDuplicates(policy.requiredDecisionKeys) ||
    !policy.requiredDecisionKeys.every((key) => authorizationDecisionKeys.includes(key))
  ) {
    packetBlockers.push("required_decision_missing");
  }
  if (!isAgendaValid(agenda, requiredAgenda, roleKeySet, decisionKeySet, policy.minimumAgendaItems)) {
    packetBlockers.push("agenda_invalid");
  }
  if (!isPreReadCatalogValid(preReads, requiredPreReads, policy.minimumPreReads)) {
    packetBlockers.push("preread_invalid");
  }
  if (!isOutputCatalogValid(outputs, requiredOutputs, decisionKeySet)) {
    packetBlockers.push("expected_output_invalid");
  }
  if (
    hasDuplicates(externalReadiness.nominatedRoleKeys) ||
    !externalReadiness.nominatedRoleKeys.every((key) => roleKeySet.has(key))
  ) {
    packetBlockers.push("nomination_key_invalid");
  }
  if (
    hasDuplicates(externalReadiness.authorityEvidenceRoleKeys) ||
    !externalReadiness.authorityEvidenceRoleKeys.every((key) =>
      roleKeySet.has(key) && externalReadiness.nominatedRoleKeys.includes(key),
    )
  ) {
    packetBlockers.push("authority_key_invalid");
  }
  if (!context.syntheticScopeOnly) packetBlockers.push("synthetic_scope_required");
  if (policy.prohibitPersonalData && context.personalDataPresent) {
    packetBlockers.push("personal_data_forbidden");
  }
  if (policy.prohibitPersistence && context.persistenceEnabled) packetBlockers.push("persistence_forbidden");
  if (policy.prohibitRemoteScheduling && context.remoteSchedulingEnabled) {
    packetBlockers.push("remote_scheduling_forbidden");
  }
  if (policy.prohibitExternalInvitation && context.externalInvitationSent) {
    packetBlockers.push("external_invitation_forbidden");
  }
  if (policy.prohibitMeetingClaim && context.meetingClaimedAsHeld) {
    packetBlockers.push("meeting_claim_forbidden");
  }
  if (policy.prohibitSaleAuthorizationClaim && context.saleClaimedAsAuthorized) {
    packetBlockers.push("sale_authorization_claim_forbidden");
  }

  const canUseInternalPacket = packetBlockers.length === 0;
  const convocationBlockers: PaidAdvisoryAuthorizationMeetingBlocker[] = [];
  const nominatedRoleSet = new Set(externalReadiness.nominatedRoleKeys);
  const authorityRoleSet = new Set(externalReadiness.authorityEvidenceRoleKeys);

  if (!authorization.canAuthorizeSale && canUseInternalPacket) {
    if (
      policy.requireAllRolesNominatedForConvocationReview &&
      !policy.requiredRoleKeys.every((key) => nominatedRoleSet.has(key))
    ) {
      convocationBlockers.push("role_nomination_incomplete");
    }
    if (
      policy.requireAuthorityEvidenceForConvocationReview &&
      !policy.requiredRoleKeys.every((key) => authorityRoleSet.has(key))
    ) {
      convocationBlockers.push("authority_evidence_incomplete");
    }
    if (policy.requirePreReadDistributionForConvocationReview && !externalReadiness.preReadsDistributed) {
      convocationBlockers.push("prereads_not_distributed");
    }
    if (policy.requireRecorderMandateForConvocationReview && !externalReadiness.recorderMandateConfirmed) {
      convocationBlockers.push("recorder_mandate_missing");
    }
    if (policy.requireIndependentConvocationReview && !externalReadiness.convocationReviewApproved) {
      convocationBlockers.push("convocation_review_missing");
    }
  }

  const canRequestHumanConvocationReview =
    canUseInternalPacket && !authorization.canAuthorizeSale && convocationBlockers.length === 0;
  const status = !canUseInternalPacket
    ? "blocked"
    : authorization.canAuthorizeSale
      ? "authorization_already_complete"
      : canRequestHumanConvocationReview
        ? "ready_for_human_convocation_review"
        : "packet_ready_for_external_nomination";

  return {
    policyId: policy.policyId,
    status,
    canUseInternalPacket,
    canRequestHumanConvocationReview,
    canScheduleMeeting: false,
    canSendInvitation: false,
    canRecordDecision: false,
    canAuthorizeSale: false,
    packetBlockers: unique(packetBlockers),
    convocationBlockers: unique(convocationBlockers),
    requiredRoles: policy.requiredRoleKeys.length,
    nominatedRoles: policy.requiredRoleKeys.filter((key) => nominatedRoleSet.has(key)).length,
    authorityEvidenceRoles: policy.requiredRoleKeys.filter((key) => authorityRoleSet.has(key)).length,
    requiredAgendaItems: requiredAgenda.length,
    readyAgendaItems: requiredAgenda.filter((item) => item.complete).length,
    requiredPreReads: requiredPreReads.length,
    readyPreReads: requiredPreReads.filter((item) => item.available && item.versionRef?.trim()).length,
    requiredOutputs: requiredOutputs.length,
    readyOutputTemplates: requiredOutputs.filter((output) =>
      output.evidenceRequirements.length > 0 && output.evidenceRequirements.every((item) => item.trim()),
    ).length,
  };
}

export function paidAdvisoryAuthorizationMeetingBlockerLabel(
  blocker: PaidAdvisoryAuthorizationMeetingBlocker,
) {
  const labels: Record<PaidAdvisoryAuthorizationMeetingBlocker, string> = {
    authorization_review_packet_not_ready: "Concluir cartas e templates antes de preparar a reunião.",
    required_role_missing: "Reconciliar os quatro papéis obrigatórios com o pacote de autorização.",
    required_decision_missing: "Reconciliar as quatro decisões obrigatórias com o pacote de autorização.",
    agenda_invalid: "Corrigir a pauta, os owners e as evidências exigidas.",
    preread_invalid: "Completar e versionar todas as pré-leituras obrigatórias.",
    expected_output_invalid: "Completar os quatro templates de saída e suas evidências.",
    nomination_key_invalid: "Remover indicação duplicada ou papel fora do escopo.",
    authority_key_invalid: "Vincular evidência de autoridade somente a papel indicado e válido.",
    synthetic_scope_required: "Restaurar o escopo exclusivamente sintético.",
    personal_data_forbidden: "Remover nomes, contatos e qualquer dado pessoal desta preparação.",
    persistence_forbidden: "Desabilitar persistência; o pacote é somente leitura.",
    remote_scheduling_forbidden: "Desabilitar integração remota de agenda.",
    external_invitation_forbidden: "Não enviar convite a partir deste fluxo interno.",
    meeting_claim_forbidden: "Não tratar preparação como reunião realizada.",
    sale_authorization_claim_forbidden: "Não tratar preparação como autorização de venda.",
    role_nomination_incomplete: "Nomear externamente os quatro responsáveis e seus substitutos.",
    authority_evidence_incomplete: "Comprovar externamente alçada, mandato e capacidade dos quatro papéis.",
    prereads_not_distributed: "Distribuir as pré-leituras pelo canal corporativo aprovado.",
    recorder_mandate_missing: "Definir externamente responsável pela ata e cadeia de evidências.",
    convocation_review_missing: "Obter revisão humana independente antes da convocação.",
  };
  return labels[blocker];
}

function isAgendaValid(
  agenda: readonly PaidAdvisoryAuthorizationMeetingAgendaItem[],
  requiredAgenda: readonly PaidAdvisoryAuthorizationMeetingAgendaItem[],
  roleKeySet: ReadonlySet<PaidAdvisoryAuthorizationRoleKey>,
  decisionKeySet: ReadonlySet<string>,
  minimumAgendaItems: number,
) {
  return requiredAgenda.length >= minimumAgendaItems &&
    !hasDuplicates(agenda.map((item) => item.key)) &&
    agenda.every((item) =>
      item.key.trim() &&
      item.label.trim() &&
      item.objective.trim() &&
      item.complete &&
      item.ownerRoles.length > 0 &&
      item.ownerRoles.every((key) => roleKeySet.has(key)) &&
      (!item.decisionKey || decisionKeySet.has(item.decisionKey)) &&
      item.requiredEvidence.length > 0 &&
      item.requiredEvidence.every((evidence) => evidence.trim()),
    );
}

function isPreReadCatalogValid(
  preReads: readonly PaidAdvisoryAuthorizationMeetingPreRead[],
  requiredPreReads: readonly PaidAdvisoryAuthorizationMeetingPreRead[],
  minimumPreReads: number,
) {
  return requiredPreReads.length >= minimumPreReads &&
    !hasDuplicates(preReads.map((item) => item.key)) &&
    preReads.every((item) =>
      item.key.trim() && item.label.trim() && item.available && Boolean(item.versionRef?.trim()),
    );
}

function isOutputCatalogValid(
  outputs: readonly PaidAdvisoryAuthorizationMeetingOutput[],
  requiredOutputs: readonly PaidAdvisoryAuthorizationMeetingOutput[],
  decisionKeySet: ReadonlySet<string>,
) {
  return requiredOutputs.length === decisionKeySet.size &&
    !hasDuplicates(outputs.map((item) => item.key)) &&
    !hasDuplicates(requiredOutputs.map((item) => item.decisionKey)) &&
    requiredOutputs.every((item) =>
      item.key.trim() &&
      item.label.trim() &&
      decisionKeySet.has(item.decisionKey) &&
      item.evidenceRequirements.length > 0 &&
      item.evidenceRequirements.every((evidence) => evidence.trim()),
    ) &&
    Array.from(decisionKeySet).every((key) =>
      requiredOutputs.some((output) => output.decisionKey === key),
    );
}

function hasDuplicates<T>(values: readonly T[]) {
  return new Set(values).size !== values.length;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}
