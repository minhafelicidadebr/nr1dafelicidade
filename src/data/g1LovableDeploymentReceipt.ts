import receiptJson from "../../docs/release/G1_LOVABLE_DEPLOYMENT_RECEIPT.json";
import {
  assertLovableDeploymentReceipt,
  evaluateLovableDeploymentReceipt,
  type LovableDeploymentReceiptPolicy,
} from "@/lib/release/lovableDeploymentReceipt";

export const g1LovableDeploymentReceiptPolicy: LovableDeploymentReceiptPolicy = Object.freeze({
  policyId: "g1-lovable-deployment-receipt-2026-07-20.1",
  projectId: "79e57053-adad-43fa-bb52-3e25ce21dbff",
  repository: "minhafelicidadebr/playbook-nr1-chagpt-sol",
  branch: "main",
  releaseRef: "4a21c1c7eb9f756a216553fd5237809e588f90d9",
  publicUrl: "https://playbook-nr1-chagpt-sol.lovable.app/",
  deploymentIdSource: "x-deployment-id",
  requiredFinalPath: "/planos#lead-form",
  approvedGate: "G0",
  targetGate: "G1",
  prohibitG1Approval: true,
  prohibitGateAdvance: true,
  prohibitRealData: true,
  requireBillingSandboxOnly: true,
});

export const g1LovableDeploymentReceiptSummary = evaluateLovableDeploymentReceipt(
  receiptJson,
  g1LovableDeploymentReceiptPolicy,
);

export const g1LovableDeploymentReceipt = assertLovableDeploymentReceipt(
  receiptJson,
  g1LovableDeploymentReceiptPolicy,
);
