import type {
  DesignPartnerOfferContext,
  DesignPartnerOfferItemInput,
  DesignPartnerOfferPolicy,
} from "@/lib/commercial/designPartnerOffer";
import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";

const authorizedRoleKeys = new Set(
  g1PaidAdvisoryAuthorizationSummary.roles.filter((role) => role.readyForSale).map((role) => role.key),
);
const authorizedDecisionKeys = new Set(
  g1PaidAdvisoryAuthorizationSummary.decisions
    .filter((decision) => decision.readyForSale)
    .map((decision) => decision.key),
);
const paidTermsReady =
  authorizedRoleKeys.has("commercial_owner") &&
  authorizedRoleKeys.has("legal_reviewer") &&
  authorizedDecisionKeys.has("scope_price") &&
  authorizedDecisionKeys.has("terms_risk");
const deliveryOwnerReady =
  authorizedRoleKeys.has("delivery_owner") && authorizedDecisionKeys.has("delivery_capacity");
const billingOperationsReady =
  authorizedRoleKeys.has("finance_owner") && authorizedDecisionKeys.has("billing_support");

export const g1DesignPartnerOfferPolicy: DesignPartnerOfferPolicy = {
  policyId: "g1-design-partner-offer-2026-07-01",
  targetGate: "G1",
  allowOfferBrief: true,
  requirePublicClaimsGuardrail: true,
  requireLocalCi: true,
  requireFormalApprovalForPaidAdvisory: true,
  requireFormalApprovalForPaidPilot: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
  prohibitProductionSaasClaim: true,
};

export const g1DesignPartnerOfferContext: DesignPartnerOfferContext = {
  realDataEnabled: false,
  gateAdvanceClaimed: false,
  publicClaimsGuardrailGreen: true,
  localCiGreen: true,
  formalPaidAdvisoryApproval: g1PaidAdvisoryAuthorizationSummary.canAuthorizeSale,
  formalPaidPilotApproval: false,
  productionSaasClaimed: false,
};

export const g1DesignPartnerOfferItems: DesignPartnerOfferItemInput[] = [
  {
    key: "category_positioning",
    label: "Categoria e promessa limitada",
    category: "positioning",
    status: "ready",
    requiredForOfferBrief: true,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/PROJECT_CONSTITUTION.md",
    detail: "Oferta posicionada como Sistema Operacional de Evidencias e Intervencoes, sem conformidade automatica.",
  },
  {
    key: "design_partner_icp",
    label: "ICP Design Partner",
    category: "scope",
    status: "ready",
    requiredForOfferBrief: true,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/SAAS_MATURITY_ASSESSMENT.md",
    detail: "Foco em empresas de 250 a 2.000 colaboradores com RH, SST e lideranca patrocinadora.",
  },
  {
    key: "synthetic_only_boundary",
    label: "Limite sintetico explicito",
    category: "privacy",
    status: "ready",
    requiredForOfferBrief: true,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/G0_EXECUTION_RECORD.md",
    detail: "Brief permite descoberta e simulacao sintetica; dados reais de trabalhadores seguem No-Go.",
  },
  {
    key: "offer_deliverables",
    label: "Entregaveis controlados",
    category: "scope",
    status: "ready",
    requiredForOfferBrief: true,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/REGULATORY_E2E_JOURNEY_G1.md",
    detail: "Escopo cobre prontidao, governanca, jornada sintetica, evidencias e roadmap, nao operacao produtiva.",
  },
  {
    key: "public_claims_guardrail",
    label: "Guardrail de claims publicos",
    category: "governance",
    status: "ready",
    requiredForOfferBrief: true,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/PUBLIC_CLAIMS_GUARDRAIL_G1.md",
    detail: "Copy publica deve evitar SaaS real pronto, validacao indevida, causalidade e conformidade garantida.",
  },
  {
    key: "local_ci",
    label: "CI local verde",
    category: "release",
    status: "ready",
    requiredForOfferBrief: true,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/IMPLEMENTATION_STATUS.md",
    detail: "Audit, lint, typecheck, testes, build e budget locais passaram no ultimo registro.",
  },
  {
    key: "lead_intake_governance",
    label: "Intake comercial e LGPD",
    category: "commercial",
    status: "ready",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/LEAD_INTAKE_GOVERNANCE_G1.md",
    detail: "Formulario cria somente rascunho local nao entregue, com consentimento, expiracao individual, exclusao e bloqueio de dados de trabalhadores.",
  },
  {
    key: "remote_crm_dpa",
    label: "CRM remoto, DPA e retencao",
    category: "commercial",
    status: "blocked",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: false,
    requiredForPaidPilot: true,
    evidenceRef: "docs/LEAD_INTAKE_GOVERNANCE_G1.md",
    detail: "CRM remoto, operador, DPA, acessos e retencao juridicamente aprovados seguem bloqueados para piloto pago.",
  },
  {
    key: "formal_accountables",
    label: "Accountables e autoridade",
    category: "governance",
    status: "blocked",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: false,
    requiredForPaidPilot: true,
    evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
    detail: "Responsaveis, autoridade, substitutos e decisoes disciplinares continuam pendentes.",
  },
  {
    key: "methodology_package",
    label: "Pacote metodologico do instrumento",
    category: "governance",
    status: "blocked",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: false,
    requiredForPaidPilot: true,
    evidenceRef: "docs/CANONICAL_PACKAGE_MANIFEST_G1.md",
    detail: "Fonte, licenca, itens, scoring, fixtures, manifesto e revisao independente ainda nao foram aprovados.",
  },
  {
    key: "paid_terms",
    label: "Termos do serviço pago",
    category: "commercial",
    status: paidTermsReady ? "ready" : "partial",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/PAID_ADVISORY_AUTHORIZATION_G1.md",
    detail: "Templates estao completos; preco, tributos, pagamento, cancelamento, responsabilidade, aceite e decisoes Comercial/Juridica seguem pendentes.",
  },
  {
    key: "advisory_delivery_owner",
    label: "Owner da entrega assistida",
    category: "governance",
    status: deliveryOwnerReady ? "ready" : "partial",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/PAID_ADVISORY_AUTHORIZATION_G1.md",
    detail: "Papel, substituto, autoridade de aceite e capacidade operacional precisam de nomeacao formal.",
  },
  {
    key: "manual_billing_operations",
    label: "Faturamento e operacao manual",
    category: "commercial",
    status: billingOperationsReady ? "ready" : "partial",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: true,
    requiredForPaidPilot: true,
    evidenceRef: "docs/PAID_ADVISORY_AUTHORIZATION_G1.md",
    detail: "Emissao, cobranca, conciliacao, reembolso e passagem para suporte precisam de procedimento aprovado.",
  },
  {
    key: "production_operations",
    label: "Operacao produtiva",
    category: "operations",
    status: "blocked",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: false,
    requiredForPaidPilot: true,
    evidenceRef: "docs/G2_COMMITTEE_SUBMISSION_READINESS.md",
    detail: "SLO/SLA, suporte, observabilidade, incidente, billing e integracoes enterprise permanecem roadmap futuro.",
  },
  {
    key: "lovable_release_receipt",
    label: "Release GitHub/Lovable comprovado",
    category: "release",
    status: "partial",
    requiredForOfferBrief: false,
    requiredForPaidAdvisory: false,
    requiredForPaidPilot: true,
    evidenceRef: "docs/GITHUB_LOVABLE_SYNC_HANDOFF.md",
    detail: "GitHub recebe commits, mas preview Lovable e pipeline oficial ainda exigem comprovante.",
  },
];

import { evaluateDesignPartnerOffer } from "@/lib/commercial/designPartnerOffer";

export const g1DesignPartnerOfferSummary = evaluateDesignPartnerOffer(
  g1DesignPartnerOfferItems,
  g1DesignPartnerOfferContext,
  g1DesignPartnerOfferPolicy,
);
