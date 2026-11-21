import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";
import {
  evaluatePaidAdvisoryAuthorizationMeeting,
  type PaidAdvisoryAuthorizationMeetingAgendaItem,
  type PaidAdvisoryAuthorizationMeetingContext,
  type PaidAdvisoryAuthorizationMeetingExternalReadiness,
  type PaidAdvisoryAuthorizationMeetingOutput,
  type PaidAdvisoryAuthorizationMeetingPolicy,
  type PaidAdvisoryAuthorizationMeetingPreRead,
} from "@/lib/commercial/paidAdvisoryAuthorizationMeeting";

export const g1PaidAdvisoryAuthorizationMeetingPolicy: PaidAdvisoryAuthorizationMeetingPolicy = {
  policyId: "g1-paid-advisory-authorization-meeting-2026-07-15",
  requiredRoleKeys: ["commercial_owner", "legal_reviewer", "delivery_owner", "finance_owner"],
  requiredDecisionKeys: ["scope_price", "terms_risk", "delivery_capacity", "billing_support"],
  minimumAgendaItems: 7,
  minimumPreReads: 5,
  requireReviewPacketReady: true,
  requireAllRolesNominatedForConvocationReview: true,
  requireAuthorityEvidenceForConvocationReview: true,
  requirePreReadDistributionForConvocationReview: true,
  requireRecorderMandateForConvocationReview: true,
  requireIndependentConvocationReview: true,
  prohibitPersonalData: true,
  prohibitPersistence: true,
  prohibitRemoteScheduling: true,
  prohibitExternalInvitation: true,
  prohibitMeetingClaim: true,
  prohibitSaleAuthorizationClaim: true,
};

export const g1PaidAdvisoryAuthorizationMeetingAgenda: readonly PaidAdvisoryAuthorizationMeetingAgendaItem[] = [
  {
    key: "scope_and_boundaries",
    label: "Escopo, objetivo e limites não negociáveis",
    objective: "Confirmar que a decisão cobre somente serviço assistido e sintético, sem piloto, SaaS ou dados reais.",
    required: true,
    complete: true,
    ownerRoles: ["commercial_owner", "legal_reviewer"],
    decisionKey: null,
    requiredEvidence: ["versão da oferta", "registro dos limites apresentados"],
  },
  {
    key: "quorum_and_authority",
    label: "Quórum, alçadas, substitutos e conflitos",
    objective: "Verificar mandato, capacidade decisória, continuidade e impedimentos antes de deliberar.",
    required: true,
    complete: true,
    ownerRoles: ["commercial_owner", "legal_reviewer", "delivery_owner", "finance_owner"],
    decisionKey: null,
    requiredEvidence: ["mandatos verificáveis", "substitutos e conflitos registrados externamente"],
  },
  {
    key: "scope_price_decision",
    label: "Decisão de escopo, preço e pagamento",
    objective: "Deliberar preço, moeda, tributos, pagamento e alçadas sem alterar as fronteiras do serviço.",
    required: true,
    complete: true,
    ownerRoles: ["commercial_owner", "finance_owner"],
    decisionKey: "scope_price",
    requiredEvidence: ["decisão comercial datada", "tabela aprovada sem dados de cliente"],
  },
  {
    key: "terms_risk_decision",
    label: "Decisão de termos, responsabilidade e aceite",
    objective: "Deliberar aceite, cancelamento, responsabilidade, confidencialidade e limites de claims.",
    required: true,
    complete: true,
    ownerRoles: ["legal_reviewer"],
    decisionKey: "terms_risk",
    requiredEvidence: ["parecer jurídico versionado", "termos e ressalvas delimitados"],
  },
  {
    key: "delivery_capacity_decision",
    label: "Decisão de capacidade e entrega",
    objective: "Confirmar agenda, capacidade, dependências, substituição, qualidade e parada segura.",
    required: true,
    complete: true,
    ownerRoles: ["delivery_owner"],
    decisionKey: "delivery_capacity",
    requiredEvidence: ["capacidade confirmada", "runbook e substituição aprovados"],
  },
  {
    key: "billing_support_decision",
    label: "Decisão de faturamento e suporte",
    objective: "Definir emissão, cobrança, conciliação, reembolso e passagem para suporte.",
    required: true,
    complete: true,
    ownerRoles: ["finance_owner", "commercial_owner"],
    decisionKey: "billing_support",
    requiredEvidence: ["procedimento financeiro aprovado", "gatilhos de cobrança e suporte"],
  },
  {
    key: "resolutions_and_evidence",
    label: "Resoluções, ressalvas, ata e próximos passos",
    objective: "Classificar cada decisão, delimitar ressalvas e definir a cadeia externa de evidências.",
    required: true,
    complete: true,
    ownerRoles: ["legal_reviewer", "commercial_owner"],
    decisionKey: null,
    requiredEvidence: ["ata ou parecer por decisão", "owners, prazos e evidências para ressalvas"],
  },
];

export const g1PaidAdvisoryAuthorizationMeetingPreReads: readonly PaidAdvisoryAuthorizationMeetingPreRead[] = [
  { key: "offer", label: "Oferta Design Partner G1", required: true, available: true, versionRef: "DESIGN_PARTNER_OFFER_G1.md@2026-07-14" },
  { key: "authorization", label: "Pacote de autorização comercial", required: true, available: true, versionRef: "PAID_ADVISORY_AUTHORIZATION_G1.md@2026-07-14" },
  { key: "launch_rehearsal", label: "Ensaio de lançamento da proposta", required: true, available: true, versionRef: "PAID_ADVISORY_LAUNCH_REHEARSAL_G1.md@2026-07-14" },
  { key: "constitution", label: "Constituição e gate vigente", required: true, available: true, versionRef: "PROJECT_CONSTITUTION.md@gate-current" },
  { key: "approval_packet", label: "Pacote de decisão e aceite G1", required: true, available: true, versionRef: "G1_APPROVAL_PACKET.md@working-tree" },
];

export const g1PaidAdvisoryAuthorizationMeetingOutputs: readonly PaidAdvisoryAuthorizationMeetingOutput[] = [
  { key: "scope_price_record", label: "Registro de escopo, preço e pagamento", decisionKey: "scope_price", required: true, evidenceRequirements: ["decisão", "responsável", "data", "evidência"] },
  { key: "terms_risk_record", label: "Parecer de termos, risco e aceite", decisionKey: "terms_risk", required: true, evidenceRequirements: ["decisão", "responsável", "data", "evidência"] },
  { key: "delivery_capacity_record", label: "Aceite de capacidade e entrega", decisionKey: "delivery_capacity", required: true, evidenceRequirements: ["decisão", "responsável", "data", "evidência"] },
  { key: "billing_support_record", label: "Aceite financeiro e de suporte", decisionKey: "billing_support", required: true, evidenceRequirements: ["decisão", "responsável", "data", "evidência"] },
];

export const g1PaidAdvisoryAuthorizationMeetingExternalReadiness: PaidAdvisoryAuthorizationMeetingExternalReadiness = {
  nominatedRoleKeys: [],
  authorityEvidenceRoleKeys: [],
  preReadsDistributed: false,
  recorderMandateConfirmed: false,
  convocationReviewApproved: false,
};

export const g1PaidAdvisoryAuthorizationMeetingContext: PaidAdvisoryAuthorizationMeetingContext = {
  syntheticScopeOnly: true,
  personalDataPresent: false,
  persistenceEnabled: false,
  remoteSchedulingEnabled: false,
  externalInvitationSent: false,
  meetingClaimedAsHeld: false,
  saleClaimedAsAuthorized: false,
};

export const g1PaidAdvisoryAuthorizationMeetingSummary = evaluatePaidAdvisoryAuthorizationMeeting(
  g1PaidAdvisoryAuthorizationSummary,
  g1PaidAdvisoryAuthorizationMeetingAgenda,
  g1PaidAdvisoryAuthorizationMeetingPreReads,
  g1PaidAdvisoryAuthorizationMeetingOutputs,
  g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
  g1PaidAdvisoryAuthorizationMeetingContext,
  g1PaidAdvisoryAuthorizationMeetingPolicy,
);
