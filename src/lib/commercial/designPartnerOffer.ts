export type DesignPartnerOfferCategory =
  | "positioning"
  | "scope"
  | "privacy"
  | "governance"
  | "commercial"
  | "release"
  | "operations";

export type DesignPartnerOfferStatus = "ready" | "partial" | "blocked";

export type DesignPartnerOfferItemInput = {
  key: string;
  label: string;
  category: DesignPartnerOfferCategory;
  status: DesignPartnerOfferStatus;
  requiredForOfferBrief: boolean;
  requiredForPaidAdvisory: boolean;
  requiredForPaidPilot: boolean;
  evidenceRef: string;
  detail: string;
};

export type DesignPartnerOfferPolicy = {
  policyId: string;
  targetGate: "G1";
  allowOfferBrief: boolean;
  requirePublicClaimsGuardrail: boolean;
  requireLocalCi: boolean;
  requireFormalApprovalForPaidAdvisory: boolean;
  requireFormalApprovalForPaidPilot: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
  prohibitProductionSaasClaim: boolean;
};

export type DesignPartnerOfferContext = {
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
  publicClaimsGuardrailGreen: boolean;
  localCiGreen: boolean;
  formalPaidAdvisoryApproval: boolean;
  formalPaidPilotApproval: boolean;
  productionSaasClaimed: boolean;
};

export type DesignPartnerOfferBlocker =
  | "offer_brief_item_not_ready"
  | "paid_advisory_item_blocked"
  | "paid_advisory_item_needs_review"
  | "paid_advisory_needs_formal_approval"
  | "paid_pilot_item_not_ready"
  | "public_claims_guardrail_not_green"
  | "local_ci_not_green"
  | "paid_pilot_needs_formal_approval"
  | "real_data_enabled"
  | "gate_advance_claimed"
  | "production_saas_claimed";

export type DesignPartnerOfferItem = DesignPartnerOfferItemInput & {
  ready: boolean;
};

export type DesignPartnerOfferSummary = {
  policyId: string;
  targetGate: "G1";
  status:
    | "blocked"
    | "offer_brief_ready"
    | "paid_advisory_review_ready"
    | "paid_advisory_ready"
    | "paid_pilot_ready";
  canPublishOfferBrief: boolean;
  canRequestPaidAdvisoryReview: boolean;
  canSellPaidAdvisory: boolean;
  canAcceptPaidPilot: boolean;
  items: DesignPartnerOfferItem[];
  blockers: DesignPartnerOfferBlocker[];
  total: number;
  ready: number;
  partial: number;
  blocked: number;
  offerBriefReady: number;
  offerBriefRequired: number;
  paidAdvisoryReady: number;
  paidAdvisoryPartial: number;
  paidAdvisoryRequired: number;
  paidPilotReady: number;
  paidPilotRequired: number;
  offerBriefPct: number;
  paidAdvisoryPct: number;
  paidPilotPct: number;
  nextStep: DesignPartnerOfferItem | null;
};

export function evaluateDesignPartnerOffer(
  items: DesignPartnerOfferItemInput[],
  context: DesignPartnerOfferContext,
  policy: DesignPartnerOfferPolicy,
): DesignPartnerOfferSummary {
  const evaluated = items.map((item) => ({
    ...item,
    ready: item.status === "ready",
  }));
  const offerBriefRequired = evaluated.filter((item) => item.requiredForOfferBrief);
  const paidAdvisoryRequired = evaluated.filter((item) => item.requiredForPaidAdvisory);
  const paidPilotRequired = evaluated.filter((item) => item.requiredForPaidPilot);
  const blockers: DesignPartnerOfferBlocker[] = [];

  if (offerBriefRequired.some((item) => !item.ready)) blockers.push("offer_brief_item_not_ready");
  if (paidAdvisoryRequired.some((item) => item.status === "blocked")) {
    blockers.push("paid_advisory_item_blocked");
  }
  if (paidAdvisoryRequired.some((item) => item.status === "partial")) {
    blockers.push("paid_advisory_item_needs_review");
  }
  if (policy.requireFormalApprovalForPaidAdvisory && !context.formalPaidAdvisoryApproval) {
    blockers.push("paid_advisory_needs_formal_approval");
  }
  if (paidPilotRequired.some((item) => !item.ready)) blockers.push("paid_pilot_item_not_ready");
  if (policy.requirePublicClaimsGuardrail && !context.publicClaimsGuardrailGreen) {
    blockers.push("public_claims_guardrail_not_green");
  }
  if (policy.requireLocalCi && !context.localCiGreen) blockers.push("local_ci_not_green");
  if (policy.requireFormalApprovalForPaidPilot && !context.formalPaidPilotApproval) {
    blockers.push("paid_pilot_needs_formal_approval");
  }
  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.push("gate_advance_claimed");
  if (policy.prohibitProductionSaasClaim && context.productionSaasClaimed) {
    blockers.push("production_saas_claimed");
  }

  const contextSafe =
    (!policy.requirePublicClaimsGuardrail || context.publicClaimsGuardrailGreen) &&
    (!policy.requireLocalCi || context.localCiGreen) &&
    (!policy.prohibitRealData || !context.realDataEnabled) &&
    (!policy.prohibitGateAdvance || !context.gateAdvanceClaimed) &&
    (!policy.prohibitProductionSaasClaim || !context.productionSaasClaimed);
  const canPublishOfferBrief =
    policy.allowOfferBrief &&
    contextSafe &&
    offerBriefRequired.length > 0 &&
    offerBriefRequired.every((item) => item.ready);
  const canRequestPaidAdvisoryReview =
    canPublishOfferBrief &&
    paidAdvisoryRequired.length > 0 &&
    paidAdvisoryRequired.every((item) => item.status !== "blocked");
  const canSellPaidAdvisory =
    canRequestPaidAdvisoryReview &&
    paidAdvisoryRequired.every((item) => item.ready) &&
    (!policy.requireFormalApprovalForPaidAdvisory || context.formalPaidAdvisoryApproval);
  const canAcceptPaidPilot =
    canSellPaidAdvisory &&
    paidPilotRequired.length > 0 &&
    paidPilotRequired.every((item) => item.ready) &&
    (!policy.requireFormalApprovalForPaidPilot || context.formalPaidPilotApproval);

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canAcceptPaidPilot
      ? "paid_pilot_ready"
      : canSellPaidAdvisory
        ? "paid_advisory_ready"
        : canRequestPaidAdvisoryReview
          ? "paid_advisory_review_ready"
          : canPublishOfferBrief
            ? "offer_brief_ready"
            : "blocked",
    canPublishOfferBrief,
    canRequestPaidAdvisoryReview,
    canSellPaidAdvisory,
    canAcceptPaidPilot,
    items: evaluated,
    blockers: unique(blockers),
    total: evaluated.length,
    ready: evaluated.filter((item) => item.ready).length,
    partial: evaluated.filter((item) => item.status === "partial").length,
    blocked: evaluated.filter((item) => item.status === "blocked").length,
    offerBriefReady: offerBriefRequired.filter((item) => item.ready).length,
    offerBriefRequired: offerBriefRequired.length,
    paidAdvisoryReady: paidAdvisoryRequired.filter((item) => item.ready).length,
    paidAdvisoryPartial: paidAdvisoryRequired.filter((item) => item.status === "partial").length,
    paidAdvisoryRequired: paidAdvisoryRequired.length,
    paidPilotReady: paidPilotRequired.filter((item) => item.ready).length,
    paidPilotRequired: paidPilotRequired.length,
    offerBriefPct: pct(offerBriefRequired.filter((item) => item.ready).length, offerBriefRequired.length),
    paidAdvisoryPct: pct(paidAdvisoryRequired.filter((item) => item.ready).length, paidAdvisoryRequired.length),
    paidPilotPct: pct(paidPilotRequired.filter((item) => item.ready).length, paidPilotRequired.length),
    nextStep: offerBriefRequired.find((item) => !item.ready)
      ?? paidAdvisoryRequired.find((item) => item.status === "blocked")
      ?? paidAdvisoryRequired.find((item) => item.status === "partial")
      ?? paidPilotRequired.find((item) => !item.ready)
      ?? null,
  };
}

export function designPartnerOfferBlockerLabel(blocker: DesignPartnerOfferBlocker) {
  const labels: Record<DesignPartnerOfferBlocker, string> = {
    offer_brief_item_not_ready: "Concluir itens minimos antes de publicar o brief da oferta.",
    paid_advisory_item_blocked: "Resolver bloqueios estruturais antes da revisão do serviço pago sintético.",
    paid_advisory_item_needs_review: "Revisar escopo, termos, owner e operação manual do serviço pago.",
    paid_advisory_needs_formal_approval: "Obter aceite Comercial/Jurídico antes de vender o serviço pago.",
    paid_pilot_item_not_ready: "Concluir evidencias e controles antes de aceitar piloto pago.",
    public_claims_guardrail_not_green: "Manter teste anti-overclaim publico verde.",
    local_ci_not_green: "Rodar CI local verde antes de expor a oferta.",
    paid_pilot_needs_formal_approval: "Exigir aprovacao formal antes de contrato pago ou dados reais.",
    real_data_enabled: "Manter dados reais e trabalhadores reais bloqueados.",
    gate_advance_claimed: "Remover qualquer alegacao de avanco de gate.",
    production_saas_claimed: "Nao declarar SaaS de producao antes dos gates e da operacao comprovada.",
  };
  return labels[blocker];
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
