export type AccountableNominationRoleInput = {
  key: string;
  label: string;
  purpose: string;
  minimumAuthority: readonly string[];
  responsibilities: readonly string[];
  requiredEvidence: readonly string[];
  nomineeName: string | null;
  backupName: string | null;
  authorityEvidenceRef: string | null;
};

export type AccountableNominationAgendaItem = {
  key: string;
  label: string;
  objective: string;
  requiredRoleKeys: readonly string[];
};

export type AccountableNominationPackInput = {
  packId: string;
  version: string;
  targetGate: "G1";
  scope: "internal_preparation_template_only";
  roles: readonly AccountableNominationRoleInput[];
  agenda: readonly AccountableNominationAgendaItem[];
  boundaries: readonly string[];
};

export type AccountableNominationPackPolicy = {
  policyId: string;
  requiredRoleKeys: readonly string[];
  requiredAgendaKeys: readonly string[];
  minimumAuthorityItems: number;
  minimumResponsibilities: number;
  minimumEvidenceItems: number;
  minimumBoundaries: number;
  requireBlankIdentityFields: boolean;
  prohibitPersistence: boolean;
  prohibitRemoteTransport: boolean;
  prohibitFormalReviewClaim: boolean;
  prohibitGateAdvance: boolean;
  prohibitRealData: boolean;
};

export type AccountableNominationPackContext = {
  persistenceEnabled: boolean;
  remoteTransportEnabled: boolean;
  formalReviewConvened: boolean;
  gateAdvanceClaimed: boolean;
  realDataEnabled: boolean;
};

export type AccountableNominationPackBlocker =
  | "pack_identity_missing"
  | "required_role_missing"
  | "duplicate_role"
  | "role_charter_incomplete"
  | "identity_field_present"
  | "required_agenda_item_missing"
  | "duplicate_agenda_item"
  | "agenda_item_incomplete"
  | "agenda_role_unknown"
  | "boundaries_incomplete"
  | "persistence_enabled"
  | "remote_transport_enabled"
  | "formal_review_claimed"
  | "gate_advance_claimed"
  | "real_data_enabled";

export type AccountableNominationRole = AccountableNominationRoleInput & {
  charterReady: boolean;
  identityFieldsBlank: boolean;
};

export type AccountableNominationPackSummary = {
  policyId: string;
  packId: string;
  version: string;
  targetGate: "G1";
  status: "incomplete" | "blank_template_ready";
  canPrepareInternalConvocationTemplate: boolean;
  canIssueConvocation: false;
  canNominateAccountable: false;
  canConveneFormalReview: false;
  canApproveGate: false;
  canUseRealData: false;
  roles: AccountableNominationRole[];
  agenda: readonly AccountableNominationAgendaItem[];
  boundaries: readonly string[];
  blockers: AccountableNominationPackBlocker[];
  readyRoleCharters: number;
  requiredRoleCharters: number;
  readyAgendaItems: number;
  requiredAgendaItems: number;
  identityFieldsPopulated: number;
  nextBlocker: AccountableNominationPackBlocker | null;
};

export function evaluateAccountableNominationPack(
  pack: AccountableNominationPackInput,
  context: AccountableNominationPackContext,
  policy: AccountableNominationPackPolicy,
): AccountableNominationPackSummary {
  const blockers: AccountableNominationPackBlocker[] = [];
  const roleKeys = pack.roles.map((role) => role.key);
  const agendaKeys = pack.agenda.map((item) => item.key);
  const knownRoles = new Set(roleKeys);
  const requiredRoles = policy.requiredRoleKeys.map((key) => pack.roles.find((role) => role.key === key));
  const requiredAgenda = policy.requiredAgendaKeys.map((key) => pack.agenda.find((item) => item.key === key));
  const roles = pack.roles.map((role) => {
    const charterReady =
      Boolean(role.key.trim() && role.label.trim() && role.purpose.trim()) &&
      validLines(role.minimumAuthority) >= policy.minimumAuthorityItems &&
      validLines(role.responsibilities) >= policy.minimumResponsibilities &&
      validLines(role.requiredEvidence) >= policy.minimumEvidenceItems;
    const identityFieldsBlank = !role.nomineeName?.trim() && !role.backupName?.trim() && !role.authorityEvidenceRef?.trim();

    return { ...role, charterReady, identityFieldsBlank };
  });
  const identityFieldsPopulated = pack.roles.reduce(
    (total, role) => total + [role.nomineeName, role.backupName, role.authorityEvidenceRef].filter((value) => value?.trim()).length,
    0,
  );

  if (!pack.packId.trim() || !pack.version.trim()) blockers.push("pack_identity_missing");
  if (requiredRoles.some((role) => !role)) blockers.push("required_role_missing");
  if (hasDuplicates(roleKeys)) blockers.push("duplicate_role");
  if (roles.some((role) => !role.charterReady)) blockers.push("role_charter_incomplete");
  if (policy.requireBlankIdentityFields && identityFieldsPopulated > 0) blockers.push("identity_field_present");
  if (requiredAgenda.some((item) => !item)) blockers.push("required_agenda_item_missing");
  if (hasDuplicates(agendaKeys)) blockers.push("duplicate_agenda_item");
  if (pack.agenda.some((item) => !item.key.trim() || !item.label.trim() || !item.objective.trim() || item.requiredRoleKeys.length === 0)) {
    blockers.push("agenda_item_incomplete");
  }
  if (pack.agenda.some((item) => item.requiredRoleKeys.some((roleKey) => !knownRoles.has(roleKey)))) {
    blockers.push("agenda_role_unknown");
  }
  if (validLines(pack.boundaries) < policy.minimumBoundaries) blockers.push("boundaries_incomplete");
  if (context.persistenceEnabled && policy.prohibitPersistence) blockers.push("persistence_enabled");
  if (context.remoteTransportEnabled && policy.prohibitRemoteTransport) blockers.push("remote_transport_enabled");
  if (context.formalReviewConvened && policy.prohibitFormalReviewClaim) blockers.push("formal_review_claimed");
  if (context.gateAdvanceClaimed && policy.prohibitGateAdvance) blockers.push("gate_advance_claimed");
  if (context.realDataEnabled && policy.prohibitRealData) blockers.push("real_data_enabled");

  const uniqueBlockers = unique(blockers);
  const canPrepareInternalConvocationTemplate = uniqueBlockers.length === 0;

  return {
    policyId: policy.policyId,
    packId: pack.packId,
    version: pack.version,
    targetGate: pack.targetGate,
    status: canPrepareInternalConvocationTemplate ? "blank_template_ready" : "incomplete",
    canPrepareInternalConvocationTemplate,
    canIssueConvocation: false,
    canNominateAccountable: false,
    canConveneFormalReview: false,
    canApproveGate: false,
    canUseRealData: false,
    roles,
    agenda: pack.agenda,
    boundaries: pack.boundaries,
    blockers: uniqueBlockers,
    readyRoleCharters: roles.filter((role) => role.charterReady && role.identityFieldsBlank).length,
    requiredRoleCharters: policy.requiredRoleKeys.length,
    readyAgendaItems: requiredAgenda.filter((item) => item && item.objective.trim() && item.requiredRoleKeys.length > 0).length,
    requiredAgendaItems: policy.requiredAgendaKeys.length,
    identityFieldsPopulated,
    nextBlocker: uniqueBlockers[0] ?? null,
  };
}

export function accountableNominationPackBlockerLabel(blocker: AccountableNominationPackBlocker) {
  const labels: Record<AccountableNominationPackBlocker, string> = {
    pack_identity_missing: "Versionar e identificar o pacote de preparação.",
    required_role_missing: "Restaurar todos os papéis obrigatórios do gate.",
    duplicate_role: "Remover papéis duplicados antes de preparar a convocação.",
    role_charter_incomplete: "Completar propósito, autoridade, responsabilidades e evidências do papel.",
    identity_field_present: "Remover nomes e referências pessoais do template local.",
    required_agenda_item_missing: "Restaurar todos os blocos obrigatórios da agenda.",
    duplicate_agenda_item: "Remover blocos duplicados da agenda.",
    agenda_item_incomplete: "Completar objetivo e participantes obrigatórios da agenda.",
    agenda_role_unknown: "Corrigir papel desconhecido referenciado na agenda.",
    boundaries_incomplete: "Declarar todos os limites do template não nominativo.",
    persistence_enabled: "Manter o pacote sem persistência local ou remota.",
    remote_transport_enabled: "Manter envio e integração remota desabilitados.",
    formal_review_claimed: "Remover qualquer alegação de reunião formal convocada.",
    gate_advance_claimed: "Remover qualquer alegação de avanço de gate.",
    real_data_enabled: "Manter dados reais proibidos durante G1.",
  };
  return labels[blocker];
}

function validLines(lines: readonly string[]) {
  return lines.filter((line) => line.trim()).length;
}

function hasDuplicates(values: readonly string[]) {
  return new Set(values).size !== values.length;
}

function unique<T>(values: readonly T[]) {
  return Array.from(new Set(values));
}
