import { describe, expect, it } from "vitest";
import receiptJson from "../../../docs/release/G1_LOVABLE_DEPLOYMENT_RECEIPT.json";
import { g1LovableDeploymentReceiptPolicy } from "@/data/g1LovableDeploymentReceipt";
import { evaluateLovableDeploymentReceipt } from "./lovableDeploymentReceipt";

describe("Lovable deployment receipt", () => {
  it("verifies the public synthetic deployment without advancing G1", () => {
    const result = evaluateLovableDeploymentReceipt(receiptJson, g1LovableDeploymentReceiptPolicy);

    expect(result.status).toBe("deployment_verified");
    expect(result.blockers).toEqual([]);
    expect(result.canAttestPublishedBaseline).toBe(true);
    expect(result.canAdvanceGate).toBe(false);
    expect(result.canUseRealData).toBe(false);
  });

  it("fails closed when project, repository, branch or release diverge", () => {
    const unsafe = structuredClone(receiptJson);
    unsafe.projectId = "another-project";
    unsafe.repository = "another/repository";
    unsafe.branch = "feature";
    unsafe.releaseRef = "a".repeat(40);

    const result = evaluateLovableDeploymentReceipt(unsafe, g1LovableDeploymentReceiptPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "project_mismatch",
      "repository_mismatch",
      "branch_mismatch",
      "release_ref_mismatch",
    ]));
  });

  it("rejects an unhealthy or unidentifiable deployment", () => {
    const unsafe = structuredClone(receiptJson);
    unsafe.deployment.id = "not-a-deployment-id";
    unsafe.deployment.idSource = "unverified-ui-copy";
    unsafe.deployment.httpStatus = 503;
    unsafe.deployment.releaseMarkerPresent = false;
    unsafe.smoke.desktop = "failed";
    unsafe.smoke.mobile = "failed";
    unsafe.smoke.runtimeErrors = 2;

    const result = evaluateLovableDeploymentReceipt(unsafe, g1LovableDeploymentReceiptPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "deployment_id_invalid",
      "deployment_id_source_mismatch",
      "http_not_ok",
      "release_marker_missing",
      "desktop_smoke_failed",
      "mobile_smoke_failed",
      "runtime_errors_detected",
    ]));
  });

  it("rejects gate or real-data escalation", () => {
    const unsafe = structuredClone(receiptJson);
    unsafe.boundaries.approvedGate = "G1";
    unsafe.boundaries.targetGate = "G2";
    unsafe.boundaries.g1Approved = true;
    unsafe.boundaries.gateAdvanceClaimed = true;
    unsafe.boundaries.realDataEnabled = true;
    unsafe.boundaries.billing = "live";

    const result = evaluateLovableDeploymentReceipt(unsafe, g1LovableDeploymentReceiptPolicy);

    expect(result.blockers).toEqual(expect.arrayContaining([
      "approved_gate_mismatch",
      "target_gate_mismatch",
      "g1_approval_claimed",
      "gate_advance_claimed",
      "real_data_enabled",
      "billing_not_sandbox_only",
    ]));
  });
});
