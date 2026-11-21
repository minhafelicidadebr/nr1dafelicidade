export type CommercialAuthorizationOwnerInput = {
  named: boolean;
  authorityRecorded: boolean;
  evidenceRef: string | null;
};

export type CommercialAuthorizationPriceInput = {
  amount: number | null;
  currency: string | null;
  approved: boolean;
};

export type CommercialAuthorizationTermsInput = {
  approved: boolean;
  reference: string | null;
};

export type CommercialAuthorizationCapacityInput = {
  confirmed: boolean;
  evidenceRef: string | null;
};

export type CommercialAuthorizationInput = {
  policyId: string;
  targetGate: "G1";
  scopeAvailable: boolean;
  upstreamPaidAdvisoryAuthorized: boolean;
  price: CommercialAuthorizationPriceInput;
  commercialOwner: CommercialAuthorizationOwnerInput;
  deliveryOwner: CommercialAuthorizationOwnerInput;
  terms: CommercialAuthorizationTermsInput;
  capacity: CommercialAuthorizationCapacityInput;
  claimsGuardrailGreen: boolean;
  realDataEnabled: boolean;
  remoteDeliveryEnabled: boolean;
  paidPilotClaimed: boolean;
};

export type CommercialAuthorizationBlocker =
  | "scope_unavailable"
  | "upstream_paid_advisory_not_authorized"
  | "price_amount_missing"
  | "price_currency_missing"
  | "price_not_approved"
  | "commercial_owner_not_named"
  | "commercial_owner_authority_missing"
  | "commercial_owner_evidence_missing"
  | "delivery_owner_not_named"
  | "delivery_owner_authority_missing"
  | "delivery_owner_evidence_missing"
  | "terms_not_approved"
  | "terms_reference_missing"
  | "delivery_capacity_missing"
  | "delivery_capacity_evidence_missing"
  | "claims_guardrail_not_green"
  | "real_data_enabled"
  | "remote_delivery_enabled"
  | "paid_pilot_claimed";

export type CommercialAuthorizationStatus = "scope_unavailable" | "sale_blocked" | "sale_authorized";

export type CommercialAuthorizationSummary = {
  policyId: string;
  targetGate: "G1";
  status: CommercialAuthorizationStatus;
  scopeAvailable: boolean;
  saleBlocked: boolean;
  saleAuthorized: boolean;
  paidCtaEnabled: boolean;
  blockers: CommercialAuthorizationBlocker[];
  nextStep: string;
};

export function evaluateCommercialAuthorization(
  input: CommercialAuthorizationInput,
): CommercialAuthorizationSummary {
  const blockers: CommercialAuthorizationBlocker[] = [];

  if (!input.scopeAvailable) blockers.push("scope_unavailable");
  if (!input.upstreamPaidAdvisoryAuthorized) blockers.push("upstream_paid_advisory_not_authorized");
  if (input.price.amount === null || input.price.amount <= 0) blockers.push("price_amount_missing");
  if (!input.price.currency?.trim()) blockers.push("price_currency_missing");
  if (!input.price.approved) blockers.push("price_not_approved");
  addOwnerBlockers(blockers, input.commercialOwner, "commercial");
  addOwnerBlockers(blockers, input.deliveryOwner, "delivery");
  if (!input.terms.approved) blockers.push("terms_not_approved");
  if (!input.terms.reference?.trim()) blockers.push("terms_reference_missing");
  if (!input.capacity.confirmed) blockers.push("delivery_capacity_missing");
  if (!input.capacity.evidenceRef?.trim()) blockers.push("delivery_capacity_evidence_missing");
  if (!input.claimsGuardrailGreen) blockers.push("claims_guardrail_not_green");
  if (input.realDataEnabled) blockers.push("real_data_enabled");
  if (input.remoteDeliveryEnabled) blockers.push("remote_delivery_enabled");
  if (input.paidPilotClaimed) blockers.push("paid_pilot_claimed");

  const saleAuthorized = input.scopeAvailable && blockers.length === 0;
  const saleBlocked = input.scopeAvailable && !saleAuthorized;

  return {
    policyId: input.policyId,
    targetGate: input.targetGate,
    status: saleAuthorized ? "sale_authorized" : input.scopeAvailable ? "sale_blocked" : "scope_unavailable",
    scopeAvailable: input.scopeAvailable,
    saleBlocked,
    saleAuthorized,
    paidCtaEnabled: saleAuthorized,
    blockers,
    nextStep: saleAuthorized
      ? "Manter a venda assistida dentro do escopo aprovado e dos gates aplicáveis."
      : input.scopeAvailable
        ? "Completar preço, owners, termos, capacidade e aceite formal antes de qualquer CTA paga."
        : "Concluir os controles do escopo antes de submetê-lo à autorização comercial.",
  };
}

export function commercialAuthorizationStatusLabel(status: CommercialAuthorizationStatus) {
  const labels: Record<CommercialAuthorizationStatus, string> = {
    scope_unavailable: "Escopo bloqueado neste gate",
    sale_blocked: "Escopo disponível; venda ainda não autorizada",
    sale_authorized: "Venda autorizada para o serviço assistido",
  };

  return labels[status];
}

export function commercialAuthorizationBlockerLabel(blocker: CommercialAuthorizationBlocker) {
  const labels: Record<CommercialAuthorizationBlocker, string> = {
    scope_unavailable: "Escopo ainda não disponível para apresentação.",
    upstream_paid_advisory_not_authorized: "Autorização upstream do serviço pago ainda não foi registrada.",
    price_amount_missing: "Definir um preço positivo.",
    price_currency_missing: "Definir a moeda do preço.",
    price_not_approved: "Registrar aprovação do preço.",
    commercial_owner_not_named: "Nomear o owner comercial.",
    commercial_owner_authority_missing: "Registrar a autoridade do owner comercial.",
    commercial_owner_evidence_missing: "Vincular evidência do owner comercial.",
    delivery_owner_not_named: "Nomear o owner da entrega.",
    delivery_owner_authority_missing: "Registrar a autoridade do owner da entrega.",
    delivery_owner_evidence_missing: "Vincular evidência do owner da entrega.",
    terms_not_approved: "Registrar aprovação dos termos.",
    terms_reference_missing: "Vincular a referência versionada dos termos.",
    delivery_capacity_missing: "Confirmar a capacidade da entrega.",
    delivery_capacity_evidence_missing: "Vincular evidência da capacidade da entrega.",
    claims_guardrail_not_green: "Manter o guardrail de claims público verde.",
    real_data_enabled: "Manter dados reais de trabalhadores bloqueados.",
    remote_delivery_enabled: "Manter a entrega remota bloqueada nesta onda.",
    paid_pilot_claimed: "Remover qualquer claim de piloto pago.",
  };

  return labels[blocker];
}

function addOwnerBlockers(
  blockers: CommercialAuthorizationBlocker[],
  owner: CommercialAuthorizationOwnerInput,
  role: "commercial" | "delivery",
) {
  const prefix = role === "commercial" ? "commercial_owner" : "delivery_owner";
  if (!owner.named) blockers.push(`${prefix}_not_named` as CommercialAuthorizationBlocker);
  if (!owner.authorityRecorded) blockers.push(`${prefix}_authority_missing` as CommercialAuthorizationBlocker);
  if (!owner.evidenceRef?.trim()) blockers.push(`${prefix}_evidence_missing` as CommercialAuthorizationBlocker);
}
