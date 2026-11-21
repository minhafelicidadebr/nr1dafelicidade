import { describe, expect, it } from "vitest";
import {
  evaluateVendorDeliveryReadiness,
  vendorDeliveryCriterionLabel,
  type VendorDeliveryContext,
} from "./vendorDeliveryReadiness";

const policy = { policyId: "test-policy", targetGate: "G1" as const };
const completeContext: VendorDeliveryContext = {
  purposeDefined: true,
  vendorAndSubprocessorsDefined: true,
  dpaApproved: true,
  legalBasisValidated: true,
  privacyNoticeReady: true,
  rbacApproved: true,
  retentionAndDeletionDefined: true,
  deliveryReceiptDefined: true,
  incidentProcessDefined: true,
  operationalCapacityConfirmed: true,
};

describe("vendor delivery readiness", () => {
  it("keeps remote delivery disabled even when every criterion is complete", () => {
    const result = evaluateVendorDeliveryReadiness(completeContext, policy);

    expect(result.status).toBe("ready_for_vendor_review");
    expect(result.completionPercent).toBe(100);
    expect(result.canEnableRemoteDelivery).toBe(false);
    expect(result.blockers).toEqual([]);
  });

  it("fails closed and points to the first missing criterion", () => {
    const result = evaluateVendorDeliveryReadiness(
      { ...completeContext, dpaApproved: false, incidentProcessDefined: false },
      policy,
    );

    expect(result.status).toBe("blocked");
    expect(result.completionPercent).toBe(80);
    expect(result.nextCriterion).toBe("dpa_approved");
    expect(result.blockers).toEqual(["dpa_approved", "incident_process_defined"]);
  });

  it("provides stable user-facing labels", () => {
    expect(vendorDeliveryCriterionLabel("retention_and_deletion_defined")).toBe(
      "Retenção e descarte definidos",
    );
  });
});
