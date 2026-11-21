export type LovableDeploymentReceipt = {
  receiptId: string;
  version: string;
  observedAt: string;
  projectId: string;
  repository: string;
  branch: string;
  releaseRef: string;
  deployment: {
    id: string;
    idSource: string;
    publicUrl: string;
    httpStatus: number;
    entryAsset: string;
    salesAsset: string;
    releaseMarker: string;
    releaseMarkerPresent: boolean;
  };
  smoke: {
    desktop: "passed" | "failed";
    mobile: "passed" | "failed";
    runtimeErrors: number;
    finalPath: string;
  };
  boundaries: {
    approvedGate: "G0" | "G1" | "G2" | "G3";
    targetGate: "G0" | "G1" | "G2" | "G3";
    g1Approved: boolean;
    gateAdvanceClaimed: boolean;
    realDataEnabled: boolean;
    billing: "sandbox_only" | "live";
  };
};

export type LovableDeploymentReceiptPolicy = {
  policyId: string;
  projectId: string;
  repository: string;
  branch: string;
  releaseRef: string;
  publicUrl: string;
  deploymentIdSource: string;
  requiredFinalPath: string;
  approvedGate: LovableDeploymentReceipt["boundaries"]["approvedGate"];
  targetGate: LovableDeploymentReceipt["boundaries"]["targetGate"];
  prohibitG1Approval: boolean;
  prohibitGateAdvance: boolean;
  prohibitRealData: boolean;
  requireBillingSandboxOnly: boolean;
};

export type LovableDeploymentReceiptBlocker =
  | "receipt_schema_invalid"
  | "receipt_identity_missing"
  | "project_mismatch"
  | "repository_mismatch"
  | "branch_mismatch"
  | "release_ref_mismatch"
  | "deployment_id_invalid"
  | "deployment_id_source_mismatch"
  | "public_url_mismatch"
  | "http_not_ok"
  | "asset_ref_invalid"
  | "release_marker_missing"
  | "desktop_smoke_failed"
  | "mobile_smoke_failed"
  | "runtime_errors_detected"
  | "final_path_mismatch"
  | "approved_gate_mismatch"
  | "target_gate_mismatch"
  | "g1_approval_claimed"
  | "gate_advance_claimed"
  | "real_data_enabled"
  | "billing_not_sandbox_only";

export type LovableDeploymentReceiptSummary = {
  policyId: string;
  status: "blocked" | "deployment_verified";
  valid: boolean;
  canAttestPublishedBaseline: boolean;
  canAdvanceGate: false;
  canUseRealData: false;
  blockers: LovableDeploymentReceiptBlocker[];
  receipt: LovableDeploymentReceipt | null;
};

export function evaluateLovableDeploymentReceipt(
  input: unknown,
  policy: LovableDeploymentReceiptPolicy,
): LovableDeploymentReceiptSummary {
  if (!isReceiptShape(input)) return blocked(policy, ["receipt_schema_invalid"]);

  const receipt = input;
  const blockers: LovableDeploymentReceiptBlocker[] = [];

  if (!receipt.receiptId.trim() || !receipt.version.trim() || !isIsoDate(receipt.observedAt)) {
    blockers.push("receipt_identity_missing");
  }
  if (receipt.projectId !== policy.projectId) blockers.push("project_mismatch");
  if (receipt.repository !== policy.repository) blockers.push("repository_mismatch");
  if (receipt.branch !== policy.branch) blockers.push("branch_mismatch");
  if (receipt.releaseRef !== policy.releaseRef || !isSha(receipt.releaseRef)) blockers.push("release_ref_mismatch");
  if (!isUuid(receipt.deployment.id)) blockers.push("deployment_id_invalid");
  if (receipt.deployment.idSource !== policy.deploymentIdSource) blockers.push("deployment_id_source_mismatch");
  if (receipt.deployment.publicUrl !== policy.publicUrl) blockers.push("public_url_mismatch");
  if (receipt.deployment.httpStatus !== 200) blockers.push("http_not_ok");
  if (!isAssetRef(receipt.deployment.entryAsset) || !isAssetRef(receipt.deployment.salesAsset)) {
    blockers.push("asset_ref_invalid");
  }
  if (!receipt.deployment.releaseMarker.trim() || !receipt.deployment.releaseMarkerPresent) {
    blockers.push("release_marker_missing");
  }
  if (receipt.smoke.desktop !== "passed") blockers.push("desktop_smoke_failed");
  if (receipt.smoke.mobile !== "passed") blockers.push("mobile_smoke_failed");
  if (receipt.smoke.runtimeErrors !== 0) blockers.push("runtime_errors_detected");
  if (receipt.smoke.finalPath !== policy.requiredFinalPath) blockers.push("final_path_mismatch");
  if (receipt.boundaries.approvedGate !== policy.approvedGate) blockers.push("approved_gate_mismatch");
  if (receipt.boundaries.targetGate !== policy.targetGate) blockers.push("target_gate_mismatch");
  if (policy.prohibitG1Approval && receipt.boundaries.g1Approved) blockers.push("g1_approval_claimed");
  if (policy.prohibitGateAdvance && receipt.boundaries.gateAdvanceClaimed) blockers.push("gate_advance_claimed");
  if (policy.prohibitRealData && receipt.boundaries.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.requireBillingSandboxOnly && receipt.boundaries.billing !== "sandbox_only") {
    blockers.push("billing_not_sandbox_only");
  }

  const uniqueBlockers = Array.from(new Set(blockers));
  const valid = uniqueBlockers.length === 0;

  return {
    policyId: policy.policyId,
    status: valid ? "deployment_verified" : "blocked",
    valid,
    canAttestPublishedBaseline: valid,
    canAdvanceGate: false,
    canUseRealData: false,
    blockers: uniqueBlockers,
    receipt,
  };
}

export function assertLovableDeploymentReceipt(
  input: unknown,
  policy: LovableDeploymentReceiptPolicy,
): LovableDeploymentReceipt {
  const summary = evaluateLovableDeploymentReceipt(input, policy);
  if (!summary.valid || !summary.receipt) {
    throw new Error(`LOVABLE_DEPLOYMENT_RECEIPT_BLOCKED:${summary.blockers.join(",")}`);
  }
  return Object.freeze(summary.receipt);
}

function blocked(
  policy: LovableDeploymentReceiptPolicy,
  blockers: LovableDeploymentReceiptBlocker[],
): LovableDeploymentReceiptSummary {
  return {
    policyId: policy.policyId,
    status: "blocked",
    valid: false,
    canAttestPublishedBaseline: false,
    canAdvanceGate: false,
    canUseRealData: false,
    blockers,
    receipt: null,
  };
}

function isReceiptShape(input: unknown): input is LovableDeploymentReceipt {
  if (!isRecord(input)) return false;
  if (![input.receiptId, input.version, input.observedAt, input.projectId, input.repository, input.branch, input.releaseRef].every(isString)) {
    return false;
  }
  if (!isRecord(input.deployment) || !isRecord(input.smoke) || !isRecord(input.boundaries)) return false;
  return isString(input.deployment.id) &&
    isString(input.deployment.idSource) &&
    isString(input.deployment.publicUrl) &&
    typeof input.deployment.httpStatus === "number" &&
    isString(input.deployment.entryAsset) &&
    isString(input.deployment.salesAsset) &&
    isString(input.deployment.releaseMarker) &&
    typeof input.deployment.releaseMarkerPresent === "boolean" &&
    ["passed", "failed"].includes(String(input.smoke.desktop)) &&
    ["passed", "failed"].includes(String(input.smoke.mobile)) &&
    typeof input.smoke.runtimeErrors === "number" &&
    isString(input.smoke.finalPath) &&
    ["G0", "G1", "G2", "G3"].includes(String(input.boundaries.approvedGate)) &&
    ["G0", "G1", "G2", "G3"].includes(String(input.boundaries.targetGate)) &&
    typeof input.boundaries.g1Approved === "boolean" &&
    typeof input.boundaries.gateAdvanceClaimed === "boolean" &&
    typeof input.boundaries.realDataEnabled === "boolean" &&
    ["sandbox_only", "live"].includes(String(input.boundaries.billing));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isIsoDate(value: string) {
  return value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function isSha(value: string) {
  return /^[a-f0-9]{40}$/.test(value);
}

function isUuid(value: string) {
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
}

function isAssetRef(value: string) {
  return /^\/assets\/[A-Za-z0-9_-]+\.js$/.test(value);
}
