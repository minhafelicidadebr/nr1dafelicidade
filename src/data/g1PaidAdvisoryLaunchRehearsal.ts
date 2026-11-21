import { g1CommercialAuthorizationSummary } from "@/data/commercialAuthorization";
import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";
import type {
  PaidAdvisoryLaunchAcknowledgementKey,
  PaidAdvisoryLaunchContext,
  PaidAdvisoryLaunchPolicy,
  PaidAdvisoryLaunchScenario,
  PaidAdvisoryProposalTemplate,
} from "@/lib/commercial/paidAdvisoryLaunchRehearsal";

export const g1PaidAdvisoryLaunchPolicy: PaidAdvisoryLaunchPolicy = {
  policyId: "g1-paid-advisory-launch-rehearsal-2026-07-14",
  requiredAcknowledgements: [
    "synthetic_company_only",
    "no_unapproved_price_or_terms",
    "no_send_signature_or_charge",
    "receipt_is_not_sale_approval",
  ],
  minimumScenarioCount: 6,
  minimumTemplateSectionCount: 9,
  requiredPlaceholderKeys: [
    "buyer_legal_name",
    "proposal_date",
    "validity",
    "price",
    "currency",
    "taxes",
    "payment_terms",
    "commercial_owner",
    "legal_evidence",
    "delivery_owner",
    "finance_owner",
  ],
  requireAuthorizationReviewReadyForRehearsal: true,
  requireSaleAuthorizationForRelease: true,
  requireCommercialFieldsApprovedForRelease: true,
  requireRecipientApprovedForRelease: true,
  prohibitRealCustomerData: true,
  prohibitPersistence: true,
  prohibitRemoteTransport: true,
  prohibitExternalRecipientDuringRehearsal: true,
};

export const g1PaidAdvisoryLaunchAcknowledgements: readonly {
  key: PaidAdvisoryLaunchAcknowledgementKey;
  label: string;
}[] = [
  {
    key: "synthetic_company_only",
    label: "Usarei somente uma empresa e uma situação inteiramente fictícias",
  },
  {
    key: "no_unapproved_price_or_terms",
    label: "Não afirmarei preço, tributos ou termos ainda não aprovados",
  },
  {
    key: "no_send_signature_or_charge",
    label: "Não enviarei proposta, solicitarei assinatura ou iniciarei cobrança",
  },
  {
    key: "receipt_is_not_sale_approval",
    label: "O recibo do ensaio não autoriza venda, proposta ou entrega",
  },
];

export const g1PaidAdvisoryProposalTemplate: PaidAdvisoryProposalTemplate = {
  templateId: "paid-advisory-proposal-g1",
  version: "2026-07-14.1-internal-draft",
  status: "internal_draft",
  title: "Sprint de Prontidão NR-1 — proposta interna sintética",
  sections: [
    { key: "buyer_context", label: "Contexto do comprador", complete: true, detail: "Empresa e situação inteiramente fictícias durante o ensaio." },
    { key: "scope", label: "Escopo", complete: true, detail: "Diagnóstico de prontidão sem garantia regulatória, clínica ou jurídica." },
    { key: "deliverables", label: "Entregáveis", complete: true, detail: "Relatório executivo, mapa de lacunas e plano priorizado com limites explícitos." },
    { key: "boundaries", label: "Fronteiras", complete: true, detail: "Sem dados reais de trabalhadores, tratamento clínico, laudo ou automação de decisão." },
    { key: "timeline", label: "Cronograma", complete: true, detail: "Janela de execução condicionada à aprovação humana e à disponibilidade do cliente." },
    { key: "commercial_terms", label: "Condições comerciais", complete: true, detail: "Preço, moeda, tributos, validade e pagamento permanecem placeholders sem valor." },
    { key: "acceptance", label: "Aceite", complete: true, detail: "Critérios de aceite e evidências devem ser confirmados pelos responsáveis." },
    { key: "cancellation_liability", label: "Cancelamento e responsabilidade", complete: true, detail: "Termos dependem de revisão jurídica e não são afirmados no ensaio." },
    { key: "governance", label: "Governança", complete: true, detail: "Responsáveis comercial, jurídico, entrega e financeiro precisam autorizar o release." },
    { key: "signatures_release", label: "Assinatura e liberação", complete: true, detail: "Somente revisão e ação humanas; o produto não envia nem coleta assinatura." },
  ],
  placeholderKeys: [
    "buyer_legal_name",
    "proposal_date",
    "validity",
    "price",
    "currency",
    "taxes",
    "payment_terms",
    "commercial_owner",
    "legal_evidence",
    "delivery_owner",
    "finance_owner",
  ],
};

export const g1PaidAdvisoryLaunchScenarios: readonly PaidAdvisoryLaunchScenario[] = [
  {
    key: "real_worker_data",
    label: "Oferta de dados reais de trabalhadores",
    prompt: "O potencial cliente oferece planilhas com respostas identificáveis para acelerar o diagnóstico.",
    competency: "privacy",
    expectedAction: "stop_and_escalate",
    coaching: "Interrompa: o G1 não admite dados reais, ingestão ou exceção informal.",
  },
  {
    key: "unapproved_price",
    label: "Pressão por preço imediato",
    prompt: "O comprador exige preço final, impostos e condições de pagamento durante a conversa.",
    competency: "commercial",
    expectedAction: "stop_and_escalate",
    coaching: "Não improvise valores; encaminhe os placeholders aos responsáveis comercial e financeiro.",
  },
  {
    key: "signature_request",
    label: "Pedido de envio e assinatura",
    prompt: "O contato pede que a proposta seja enviada para assinatura ainda durante o ensaio.",
    competency: "legal",
    expectedAction: "stop_and_escalate",
    coaching: "O ensaio não envia, assina, cobra ou transforma o rascunho em documento externo.",
  },
  {
    key: "compliance_guarantee",
    label: "Pedido de garantia de conformidade",
    prompt: "O comprador pergunta se o serviço garante conformidade integral com a NR-1.",
    competency: "scope",
    expectedAction: "bounded_answer",
    coaching: "Responda com o limite: apoio à prontidão e evidências, sem garantia jurídica ou regulatória.",
  },
  {
    key: "crm_calendar",
    label: "Integração antecipada com CRM e agenda",
    prompt: "A equipe propõe cadastrar o lead real e agendar a entrega usando integrações externas.",
    competency: "integration",
    expectedAction: "stop_and_escalate",
    coaching: "Mantenha o fluxo local e sintético; integrações externas exigem autorização e controles próprios.",
  },
  {
    key: "paid_pilot_upgrade",
    label: "Conversão imediata em piloto pago",
    prompt: "O contato aceita a ideia e pede para iniciar amanhã com equipe e dados reais.",
    competency: "delivery",
    expectedAction: "stop_and_escalate",
    coaching: "O próximo passo é revisão humana formal, não início de venda, cobrança ou entrega real.",
  },
];

export const g1PaidAdvisoryLaunchContext: PaidAdvisoryLaunchContext = {
  authorizationReviewReady: g1PaidAdvisoryAuthorizationSummary.canRequestFormalReview,
  authorizationForSale: g1CommercialAuthorizationSummary.saleAuthorized,
  commercialFieldsApproved: false,
  recipientApproved: false,
  syntheticMode: true,
  realCustomerDataPresent: false,
  persistenceEnabled: false,
  remoteTransportEnabled: false,
  externalRecipientPresent: false,
  acknowledgements: {
    synthetic_company_only: false,
    no_unapproved_price_or_terms: false,
    no_send_signature_or_charge: false,
    receipt_is_not_sale_approval: false,
  },
};
