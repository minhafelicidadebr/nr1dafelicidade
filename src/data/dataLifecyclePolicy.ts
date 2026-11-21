import type { DataGovernancePolicy } from "@/lib/governance/dataLifecycle";
import { REQUIRED_DATA_CLASSES } from "@/lib/governance/dataLifecycle";

export const repositoryDataGovernanceDraft: DataGovernancePolicy = {
  version: "data-governance-g1-2026.06-draft",
  status: "draft",
  organizationId: null,
  legalBasisRef: null,
  privacyNoticeRef: null,
  incidentRunbookRef: null,
  matrixSha256: null,
  approvals: [],
  rules: REQUIRED_DATA_CLASSES.map((dataClass) => ({
    dataClass,
    purpose: "Requer decisão documentada do controlador e revisão DPO/Jurídico.",
    ownerRole: "pending_assignment",
    retentionDays: null,
    retentionBasisRef: null,
    accessMode: dataClass === "response_microdata" || dataClass === "invitation_secret"
      ? "service_only"
      : "authorized_operator",
    disposalMethod: null,
    emergencyAccessMode: dataClass === "response_microdata" ? "service_only_dual_control" : "prohibited",
    legalHoldAllowed: dataClass !== "invitation_secret",
    exportAllowed: false,
  })),
};
