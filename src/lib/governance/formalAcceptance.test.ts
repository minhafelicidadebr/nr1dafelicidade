import { describe, expect, it } from "vitest";
import {
  g1FormalAcceptancePolicy,
  g1FormalDecisions,
  g1FormalRoles,
} from "@/data/g1FormalAcceptance";
import {
  evaluateFormalAcceptance,
  type FormalDecisionInput,
  type FormalRoleInput,
} from "./formalAcceptance";

function readyRoles(): FormalRoleInput[] {
  return g1FormalRoles.map((role) => ({
    ...role,
    named: true,
    authorityRecorded: true,
    backupNamed: true,
  }));
}

function approvedDecisions(): FormalDecisionInput[] {
  return g1FormalDecisions.map((decision) => ({
    ...decision,
    decision: "approved",
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
    evidenceSha256: "a".repeat(64),
    decidedBy: "accountable",
    decidedAt: "2026-06-30",
  }));
}

describe("G1 formal acceptance", () => {
  it("keeps formal acceptance blocked while accountables and decisions are pending", () => {
    const result = evaluateFormalAcceptance(g1FormalRoles, g1FormalDecisions, g1FormalAcceptancePolicy);

    expect(result.canAcceptSyntheticG1).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.readyRoles).toBe(0);
    expect(result.readyDecisions).toBe(0);
    expect(result.nextRole?.key).toBe("product_sponsor");
    expect(result.nextDecision?.discipline).toBe("product");
    expect(result.blockers).toEqual(
      expect.arrayContaining(["role_not_named", "authority_missing", "backup_missing", "decision_pending"]),
    );
  });

  it("allows synthetic G1 acceptance only with roles, authority, backups and decisions complete", () => {
    const result = evaluateFormalAcceptance(readyRoles(), approvedDecisions(), g1FormalAcceptancePolicy);

    expect(result.canAcceptSyntheticG1).toBe(true);
    expect(result.status).toBe("ready_for_synthetic_acceptance");
    expect(result.roleReadinessPct).toBe(100);
    expect(result.decisionReadinessPct).toBe(100);
    expect(result.nextRole).toBeNull();
    expect(result.nextDecision).toBeNull();
  });

  it("fails closed when any required discipline rejects the gate", () => {
    const decisions = approvedDecisions();
    decisions[0] = { ...decisions[0], decision: "rejected", detail: "Escopo rejeitado." };

    const result = evaluateFormalAcceptance(readyRoles(), decisions, g1FormalAcceptancePolicy);

    expect(result.canAcceptSyntheticG1).toBe(false);
    expect(result.blockers).toContain("decision_rejected");
    expect(result.nextDecision?.discipline).toBe("product");
  });

  it("requires owner, due date and evidence for every conditional approval", () => {
    const decisions = approvedDecisions();
    decisions[0] = {
      ...decisions[0],
      decision: "approved_with_conditions",
      conditions: [
        {
          key: "missing_minutes",
          label: "Ata pendente",
          ownerRole: null,
          dueDate: null,
          evidenceRef: null,
          evidenceSha256: null,
          detail: "Ressalva sem responsavel, prazo e evidencia.",
        },
      ],
    };

    const result = evaluateFormalAcceptance(readyRoles(), decisions, g1FormalAcceptancePolicy);

    expect(result.canAcceptSyntheticG1).toBe(false);
    expect(result.unboundedConditions).toBe(1);
    expect(result.blockers).toContain("condition_not_bounded");
  });

  it("requires a SHA-256 digest for decisions and conditional evidence", () => {
    const decisions = approvedDecisions();
    decisions[0] = { ...decisions[0], evidenceSha256: "not-a-digest" };
    decisions[1] = {
      ...decisions[1],
      decision: "approved_with_conditions",
      conditions: [{
        key: "signed-minutes",
        label: "Ata assinada pendente",
        ownerRole: "product_sponsor",
        dueDate: "2026-07-31",
        evidenceRef: "evidence:minutes",
        evidenceSha256: null,
        detail: "A evidencia deve ser vinculada sem armazenar seu conteudo no aplicativo.",
      }],
    };

    const result = evaluateFormalAcceptance(readyRoles(), decisions, g1FormalAcceptancePolicy);

    expect(result.canAcceptSyntheticG1).toBe(false);
    expect(result.blockers).toEqual(expect.arrayContaining([
      "decision_evidence_digest_missing_or_invalid",
      "condition_evidence_digest_missing_or_invalid",
      "condition_not_bounded",
    ]));
  });
});
