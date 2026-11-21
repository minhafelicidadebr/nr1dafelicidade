import type { DesignPartnerOfferSummary } from "./designPartnerOffer";
import type { LeadIntakeSummary } from "./leadIntakeGovernance";
import type { VendorDeliveryReadiness } from "./vendorDeliveryReadiness";

export type CommercialCapability = {
  key: "synthetic_discovery" | "local_draft" | "paid_advisory" | "remote_delivery" | "paid_pilot";
  label: string;
  status: "available" | "review_ready" | "blocked";
  evidence: string;
};

export type CommercialReadinessSummary = {
  policyId: string;
  targetGate: "G1";
  status: "controlled_discovery_ready" | "blocked";
  capabilities: CommercialCapability[];
  availableCount: number;
  reviewReadyCount: number;
  blockedCount: number;
  nextStep: string;
};

export function evaluateCommercialReadiness(
  offer: DesignPartnerOfferSummary,
  intake: LeadIntakeSummary,
  vendor: VendorDeliveryReadiness,
): CommercialReadinessSummary {
  const capabilities: CommercialCapability[] = [
    {
      key: "synthetic_discovery",
      label: "Descoberta e demonstração sintética",
      status: offer.canPublishOfferBrief ? "available" : "blocked",
      evidence: offer.canPublishOfferBrief ? "Brief Design Partner controlado" : "Itens do brief ainda pendentes",
    },
    {
      key: "local_draft",
      label: "Rascunho de contato local",
      status: intake.canCollectControlledContact ? "available" : "blocked",
      evidence: intake.canCollectControlledContact ? "Consentimento, retenção e fila local" : "Intake local bloqueado",
    },
    {
      key: "paid_advisory",
      label: "Serviço pago assistido e sintético",
      status: offer.canSellPaidAdvisory
        ? "available"
        : offer.canRequestPaidAdvisoryReview
          ? "review_ready"
          : "blocked",
      evidence: offer.canSellPaidAdvisory
        ? "Escopo, operação e aprovação comercial concluídos"
        : offer.canRequestPaidAdvisoryReview
          ? `${offer.paidAdvisoryReady}/${offer.paidAdvisoryRequired} critérios aprovados; termos, owner e operação manual em revisão`
          : "Pré-requisitos do serviço pago ainda bloqueados",
    },
    {
      key: "remote_delivery",
      label: "Entrega a CRM ou calendário",
      status: "blocked",
      evidence: vendor.blockers.length > 0
        ? `${vendor.blockers.length} critérios vendor-neutral pendentes`
        : "Transporte remoto desabilitado no G1",
    },
    {
      key: "paid_pilot",
      label: "Piloto pago com dados reais",
      status: "blocked",
      evidence: offer.canAcceptPaidPilot
        ? "Aprovação formal ainda necessária no G1"
        : "Oferta, metodologia e operação ainda não aprovadas",
    },
  ];

  const availableCount = capabilities.filter((capability) => capability.status === "available").length;
  const reviewReadyCount = capabilities.filter((capability) => capability.status === "review_ready").length;
  const blockedCount = capabilities.filter((capability) => capability.status === "blocked").length;
  const nextAdvisoryItem = offer.nextStep?.requiredForPaidAdvisory ? offer.nextStep : null;

  return {
    policyId: `commercial-readiness-${offer.policyId}-${intake.policyId}-${vendor.policyId}`,
    targetGate: "G1",
    status: availableCount >= 2 ? "controlled_discovery_ready" : "blocked",
    capabilities,
    availableCount,
    reviewReadyCount,
    blockedCount,
    nextStep: offer.canRequestPaidAdvisoryReview && !offer.canSellPaidAdvisory
      ? "Submeter escopo, termos, owner e operação manual à revisão Comercial/Jurídica."
      : nextAdvisoryItem
        ? `Resolver ${nextAdvisoryItem.label.toLocaleLowerCase("pt-BR")} antes da revisão Comercial/Jurídica.`
        : vendor.nextCriterion
          ? "Concluir a revisão vendor-neutral antes de selecionar qualquer fornecedor."
          : "Registrar aprovação formal antes de qualquer habilitação futura.",
  };
}
