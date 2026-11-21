import {
  commercialAuthorizationStatusLabel,
  evaluateCommercialAuthorization,
  type CommercialAuthorizationInput,
} from "@/lib/commercial/commercialAuthorization";
import {
  g1PaidAdvisoryAuthorizationContext,
  g1PaidAdvisoryAuthorizationSummary,
  g1PaidAdvisoryAuthorizationRoles,
} from "./g1PaidAdvisoryAuthorization";
import { g1DesignPartnerOfferContext } from "./g1DesignPartnerOffer";
import {
  g1ReadinessGovernanceSprintDefinition,
  g1ReadinessGovernanceSprintSummary,
} from "./g1ReadinessGovernanceSprint";

const role = (key: "commercial_owner" | "delivery_owner") =>
  g1PaidAdvisoryAuthorizationRoles.find((item) => item.key === key);
const decision = (key: "terms_risk" | "delivery_capacity") =>
  g1PaidAdvisoryAuthorizationSummary.decisions.find((item) => item.key === key);

const commercialOwner = role("commercial_owner");
const deliveryOwner = role("delivery_owner");
const termsDecision = decision("terms_risk");
const capacityDecision = decision("delivery_capacity");

// Working assignment confirmed by the requester; formal authority and evidence remain separate gates.
const workingCommercialAssignment = {
  commercialOwnerNamed: true,
  deliveryOwnerNamed: true,
  priceCurrency: "BRL" as const,
};

export const g1CommercialAuthorizationInput: CommercialAuthorizationInput = {
  policyId: "g1-commercial-authorization-2026-07-26",
  targetGate: "G1",
  scopeAvailable: g1ReadinessGovernanceSprintSummary.canPublishScope,
  upstreamPaidAdvisoryAuthorized: g1PaidAdvisoryAuthorizationSummary.canAuthorizeSale,
  price: {
    amount: null,
    currency: workingCommercialAssignment.priceCurrency,
    approved: false,
  },
  commercialOwner: {
    named: workingCommercialAssignment.commercialOwnerNamed,
    authorityRecorded: commercialOwner?.authorityRecorded ?? false,
    evidenceRef: commercialOwner?.evidenceRef ?? null,
  },
  deliveryOwner: {
    named: workingCommercialAssignment.deliveryOwnerNamed,
    authorityRecorded: deliveryOwner?.authorityRecorded ?? false,
    evidenceRef: deliveryOwner?.evidenceRef ?? null,
  },
  terms: {
    approved: termsDecision?.readyForSale ?? false,
    reference: termsDecision?.evidenceRef ?? null,
  },
  capacity: {
    confirmed: Boolean(deliveryOwner?.capacityConfirmed && capacityDecision?.readyForSale),
    evidenceRef: deliveryOwner?.evidenceRef ?? capacityDecision?.evidenceRef ?? null,
  },
  claimsGuardrailGreen: g1DesignPartnerOfferContext.publicClaimsGuardrailGreen,
  realDataEnabled: g1PaidAdvisoryAuthorizationContext.realDataEnabled,
  remoteDeliveryEnabled: g1PaidAdvisoryAuthorizationContext.remoteDeliveryEnabled,
  paidPilotClaimed: g1PaidAdvisoryAuthorizationContext.paidPilotClaimed,
};

export const g1CommercialAuthorizationSummary = evaluateCommercialAuthorization(
  g1CommercialAuthorizationInput,
);

export const g1CommercialAuthorizationPresentation = {
  policyId: g1CommercialAuthorizationSummary.policyId,
  serviceId: "readiness_governance_sprint",
  serviceTitle: g1ReadinessGovernanceSprintDefinition.title,
  status: g1CommercialAuthorizationSummary.status,
  availabilityLabel: commercialAuthorizationStatusLabel(g1CommercialAuthorizationSummary.status),
  priceLabel: g1CommercialAuthorizationInput.price.approved &&
    g1CommercialAuthorizationInput.price.amount !== null &&
    g1CommercialAuthorizationInput.price.amount > 0
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: g1CommercialAuthorizationInput.price.currency ?? "BRL",
      }).format(g1CommercialAuthorizationInput.price.amount)
    : "Em revisão",
  localDraftNavigationLabel: "Preparar escopo",
  localDraftCtaLabel: "Salvar escopo local",
  paidCtaEnabled: g1CommercialAuthorizationSummary.paidCtaEnabled,
  paidCtaLabel: g1CommercialAuthorizationSummary.paidCtaEnabled ? "Solicitar proposta" : null,
  paidCtaStateLabel: g1CommercialAuthorizationSummary.paidCtaEnabled
    ? "CTA paga habilitada pela autorização canônica."
    : "CTA paga permanece desabilitada até autorização completa.",
} as const;
