export const REQUIRED_DATA_CLASSES = [
  "identity",
  "invitation_secret",
  "response_microdata",
  "safe_aggregate",
  "audit_event",
  "operational_evidence",
  "security_incident",
] as const;

export type DataClass = (typeof REQUIRED_DATA_CLASSES)[number];
export type GovernanceStatus = "draft" | "review" | "approved" | "retired";
export type AccessMode = "service_only" | "organization_aggregate" | "authorized_operator";
export type DisposalMethod = "hard_delete" | "crypto_erase" | "irreversible_anonymization";
export type EmergencyAccessMode = "prohibited" | "service_only_dual_control";
export type ApprovalDiscipline = "dpo" | "legal" | "security" | "sst";
export type DisposalStatus = "requested" | "approved" | "executing" | "completed" | "failed" | "cancelled";
export type EmergencyAccessStatus = "requested" | "approved" | "denied" | "expired" | "revoked";
export type IncidentStatus = "detected" | "contained" | "investigating" | "resolved" | "closed";

export type DataLifecycleRule = {
  dataClass: DataClass;
  purpose: string;
  ownerRole: string;
  retentionDays: number | null;
  retentionBasisRef: string | null;
  accessMode: AccessMode;
  disposalMethod: DisposalMethod | null;
  emergencyAccessMode: EmergencyAccessMode;
  legalHoldAllowed: boolean;
  exportAllowed: boolean;
};

export type DataGovernancePolicy = {
  version: string;
  status: GovernanceStatus;
  organizationId: string | null;
  legalBasisRef: string | null;
  privacyNoticeRef: string | null;
  incidentRunbookRef: string | null;
  matrixSha256: string | null;
  approvals: ApprovalDiscipline[];
  rules: DataLifecycleRule[];
};

const SHA256 = /^[a-f0-9]{64}$/i;
const REQUIRED_APPROVALS: ApprovalDiscipline[] = ["dpo", "legal", "security", "sst"];

export function evaluateDataGovernance(policy: DataGovernancePolicy): string[] {
  const blockers = new Set<string>();
  const classes = new Set(policy.rules.map((rule) => rule.dataClass));

  if (policy.status !== "approved") blockers.add("policy_not_approved");
  if (!policy.organizationId) blockers.add("organization_scope_missing");
  if (!policy.legalBasisRef?.trim()) blockers.add("legal_basis_missing");
  if (!policy.privacyNoticeRef?.trim()) blockers.add("privacy_notice_missing");
  if (!policy.incidentRunbookRef?.trim()) blockers.add("incident_runbook_missing");
  if (!policy.matrixSha256 || !SHA256.test(policy.matrixSha256)) blockers.add("matrix_hash_missing_or_invalid");

  for (const discipline of REQUIRED_APPROVALS) {
    if (!policy.approvals.includes(discipline)) blockers.add(`approval_${discipline}_missing`);
  }

  for (const required of REQUIRED_DATA_CLASSES) {
    if (!classes.has(required)) blockers.add(`rule_${required}_missing`);
  }

  for (const rule of policy.rules) {
    if (!rule.purpose.trim() || !rule.ownerRole.trim()) blockers.add(`rule_${rule.dataClass}_ownership_incomplete`);
    if (!Number.isInteger(rule.retentionDays) || (rule.retentionDays ?? 0) <= 0) {
      blockers.add(`rule_${rule.dataClass}_retention_undecided`);
    }
    if (!rule.retentionBasisRef?.trim()) blockers.add(`rule_${rule.dataClass}_retention_basis_missing`);
    if (!rule.disposalMethod) blockers.add(`rule_${rule.dataClass}_disposal_missing`);
  }

  const microdata = policy.rules.find((rule) => rule.dataClass === "response_microdata");
  if (microdata && microdata.accessMode !== "service_only") blockers.add("microdata_must_be_service_only");
  if (microdata?.exportAllowed) blockers.add("microdata_export_must_be_prohibited");
  if (microdata && microdata.emergencyAccessMode !== "service_only_dual_control") {
    blockers.add("microdata_emergency_access_requires_dual_control");
  }

  return [...blockers];
}

export function canProcessRealData(policy: DataGovernancePolicy): boolean {
  return evaluateDataGovernance(policy).length === 0;
}

export function canApproveDualControl(requesterId: string, approverId: string | null): boolean {
  return Boolean(approverId && requesterId !== approverId);
}

const DISPOSAL_TRANSITIONS: Record<DisposalStatus, DisposalStatus[]> = {
  requested: ["requested", "approved", "cancelled"],
  approved: ["approved", "executing", "cancelled"],
  executing: ["executing", "completed", "failed"],
  completed: ["completed"],
  failed: ["failed"],
  cancelled: ["cancelled"],
};

const EMERGENCY_TRANSITIONS: Record<EmergencyAccessStatus, EmergencyAccessStatus[]> = {
  requested: ["requested", "approved", "denied"],
  approved: ["approved", "expired", "revoked"],
  denied: ["denied"],
  expired: ["expired"],
  revoked: ["revoked"],
};

const INCIDENT_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  detected: ["detected", "contained", "investigating"],
  contained: ["contained", "investigating", "resolved"],
  investigating: ["investigating", "contained", "resolved"],
  resolved: ["resolved", "closed"],
  closed: ["closed"],
};

export const canTransitionDisposal = (from: DisposalStatus, to: DisposalStatus) => DISPOSAL_TRANSITIONS[from].includes(to);
export const canTransitionEmergencyAccess = (from: EmergencyAccessStatus, to: EmergencyAccessStatus) => EMERGENCY_TRANSITIONS[from].includes(to);
export const canTransitionIncident = (from: IncidentStatus, to: IncidentStatus) => INCIDENT_TRANSITIONS[from].includes(to);
