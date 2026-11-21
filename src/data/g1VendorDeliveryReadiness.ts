import {
  evaluateVendorDeliveryReadiness,
  type VendorDeliveryContext,
} from "@/lib/commercial/vendorDeliveryReadiness";

export const g1VendorDeliveryPolicy = {
  policyId: "g1-vendor-delivery-readiness-2026-07-14",
  targetGate: "G1" as const,
};

export const g1VendorDeliveryContext: VendorDeliveryContext = {
  purposeDefined: false,
  vendorAndSubprocessorsDefined: false,
  dpaApproved: false,
  legalBasisValidated: false,
  privacyNoticeReady: false,
  rbacApproved: false,
  retentionAndDeletionDefined: false,
  deliveryReceiptDefined: false,
  incidentProcessDefined: false,
  operationalCapacityConfirmed: false,
};

export const g1VendorDeliveryReadiness = evaluateVendorDeliveryReadiness(
  g1VendorDeliveryContext,
  g1VendorDeliveryPolicy,
);
