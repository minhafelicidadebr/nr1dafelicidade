import { describe, expect, it } from "vitest";
import {
  REQUIRED_DATA_CLASSES,
  canApproveDualControl,
  canProcessRealData,
  canTransitionDisposal,
  canTransitionEmergencyAccess,
  canTransitionIncident,
  evaluateDataGovernance,
  type DataGovernancePolicy,
} from "./dataLifecycle";

function approvedPolicy(): DataGovernancePolicy {
  return {
    version: "1.0.0",
    status: "approved",
    organizationId: "org-1",
    legalBasisRef: "decision/legal-basis/1",
    privacyNoticeRef: "notice/1",
    incidentRunbookRef: "runbook/1",
    matrixSha256: "a".repeat(64),
    approvals: ["dpo", "legal", "security", "sst"],
    rules: REQUIRED_DATA_CLASSES.map((dataClass) => ({
      dataClass,
      purpose: "Finalidade documentada",
      ownerRole: "data-owner",
      retentionDays: 365,
      retentionBasisRef: "decision/retention/1",
      accessMode: dataClass === "response_microdata" ? "service_only" : "authorized_operator",
      disposalMethod: "hard_delete",
      emergencyAccessMode: dataClass === "response_microdata" ? "service_only_dual_control" : "prohibited",
      legalHoldAllowed: true,
      exportAllowed: false,
    })),
  };
}

describe("data lifecycle governance", () => {
  it("fails closed for the repository draft", () => {
    const policy = approvedPolicy();
    policy.status = "draft";
    policy.legalBasisRef = null;
    expect(canProcessRealData(policy)).toBe(false);
    expect(evaluateDataGovernance(policy)).toContain("policy_not_approved");
  });

  it("requires every governed data class", () => {
    const policy = approvedPolicy();
    policy.rules = policy.rules.filter((rule) => rule.dataClass !== "security_incident");
    expect(evaluateDataGovernance(policy)).toContain("rule_security_incident_missing");
  });

  it("does not accept an undecided retention period", () => {
    const policy = approvedPolicy();
    policy.rules[0].retentionDays = null;
    expect(evaluateDataGovernance(policy)).toContain("rule_identity_retention_undecided");
  });

  it("requires four independent disciplines", () => {
    const policy = approvedPolicy();
    policy.approvals = ["dpo", "security"];
    expect(evaluateDataGovernance(policy)).toEqual(expect.arrayContaining(["approval_legal_missing", "approval_sst_missing"]));
  });

  it("never exposes response microdata to the organization", () => {
    const policy = approvedPolicy();
    const microdata = policy.rules.find((rule) => rule.dataClass === "response_microdata")!;
    microdata.accessMode = "organization_aggregate";
    microdata.exportAllowed = true;
    expect(evaluateDataGovernance(policy)).toEqual(
      expect.arrayContaining(["microdata_must_be_service_only", "microdata_export_must_be_prohibited"]),
    );
  });

  it("requires dual control for exceptional service access", () => {
    expect(canApproveDualControl("requester", "requester")).toBe(false);
    expect(canApproveDualControl("requester", null)).toBe(false);
    expect(canApproveDualControl("requester", "approver")).toBe(true);
  });

  it("accepts only a complete, scoped and approved policy", () => {
    expect(canProcessRealData(approvedPolicy())).toBe(true);
  });

  it("keeps operational state machines monotonic", () => {
    expect(canTransitionDisposal("requested", "approved")).toBe(true);
    expect(canTransitionDisposal("completed", "executing")).toBe(false);
    expect(canTransitionEmergencyAccess("approved", "revoked")).toBe(true);
    expect(canTransitionEmergencyAccess("expired", "approved")).toBe(false);
    expect(canTransitionIncident("resolved", "closed")).toBe(true);
    expect(canTransitionIncident("closed", "investigating")).toBe(false);
  });
});
