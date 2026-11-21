export type VendorDeliveryCriterion =
  | "purpose_defined"
  | "vendor_and_subprocessors_defined"
  | "dpa_approved"
  | "legal_basis_validated"
  | "privacy_notice_ready"
  | "rbac_approved"
  | "retention_and_deletion_defined"
  | "delivery_receipt_defined"
  | "incident_process_defined"
  | "operational_capacity_confirmed";

export type VendorDeliveryContext = {
  purposeDefined: boolean;
  vendorAndSubprocessorsDefined: boolean;
  dpaApproved: boolean;
  legalBasisValidated: boolean;
  privacyNoticeReady: boolean;
  rbacApproved: boolean;
  retentionAndDeletionDefined: boolean;
  deliveryReceiptDefined: boolean;
  incidentProcessDefined: boolean;
  operationalCapacityConfirmed: boolean;
};

export type VendorDeliveryReadiness = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "ready_for_vendor_review";
  canEnableRemoteDelivery: false;
  completed: VendorDeliveryCriterion[];
  blockers: VendorDeliveryCriterion[];
  completionPercent: number;
  nextCriterion: VendorDeliveryCriterion | null;
};

const criteria: readonly [VendorDeliveryCriterion, keyof VendorDeliveryContext][] = [
  ["purpose_defined", "purposeDefined"],
  ["vendor_and_subprocessors_defined", "vendorAndSubprocessorsDefined"],
  ["dpa_approved", "dpaApproved"],
  ["legal_basis_validated", "legalBasisValidated"],
  ["privacy_notice_ready", "privacyNoticeReady"],
  ["rbac_approved", "rbacApproved"],
  ["retention_and_deletion_defined", "retentionAndDeletionDefined"],
  ["delivery_receipt_defined", "deliveryReceiptDefined"],
  ["incident_process_defined", "incidentProcessDefined"],
  ["operational_capacity_confirmed", "operationalCapacityConfirmed"],
];

export function evaluateVendorDeliveryReadiness(
  context: VendorDeliveryContext,
  policy: { policyId: string; targetGate: "G1" },
): VendorDeliveryReadiness {
  const completed = criteria.filter(([, key]) => context[key]).map(([criterion]) => criterion);
  const blockers = criteria.filter(([, key]) => !context[key]).map(([criterion]) => criterion);
  const allComplete = blockers.length === 0;

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: allComplete ? "ready_for_vendor_review" : "blocked",
    canEnableRemoteDelivery: false,
    completed,
    blockers,
    completionPercent: Math.round((completed.length / criteria.length) * 100),
    nextCriterion: blockers[0] ?? null,
  };
}

export function vendorDeliveryCriterionLabel(criterion: VendorDeliveryCriterion) {
  const labels: Record<VendorDeliveryCriterion, string> = {
    purpose_defined: "Finalidade e escopo definidos",
    vendor_and_subprocessors_defined: "Fornecedor e subprocessadores identificados",
    dpa_approved: "DPA aprovado",
    legal_basis_validated: "Base legal validada",
    privacy_notice_ready: "Aviso de privacidade pronto",
    rbac_approved: "RBAC e acessos aprovados",
    retention_and_deletion_defined: "Retenção e descarte definidos",
    delivery_receipt_defined: "Recibo de entrega definido",
    incident_process_defined: "Processo de incidente definido",
    operational_capacity_confirmed: "Capacidade operacional confirmada",
  };
  return labels[criterion];
}
