import { describe, expect, it } from "vitest";
import { actionGovernanceBlockerLabel, evaluateActionGovernance } from "./actionGovernance";

describe("action governance evaluator", () => {
  it("flags missing owner, deadline, evidence and KPI before closure", () => {
    const result = evaluateActionGovernance({
      title: "Revisar processo de escala",
      status: "planned",
      dimension: "workload",
    });

    expect(result.readyForClosure).toBe(false);
    expect(result.completionBlockers).toEqual([
      "missing_owner",
      "missing_due_date",
      "missing_expected_evidence",
      "missing_kpi_or_reassessment",
    ]);
    expect(result.label).toBe("draft");
    expect(actionGovernanceBlockerLabel(result.completionBlockers[0])).toContain("responsável");
  });

  it("accepts a planned action with expected evidence, KPI and technical review signals", () => {
    const result = evaluateActionGovernance({
      title: "Ajustar governança de demandas",
      description:
        "Evidência esperada: ata e procedimento publicado. KPI: indicador mensal de fila e reavaliação no ciclo seguinte. Revisão técnica SST/SESMT antes do fechamento.",
      status: "in_progress",
      cycle_id: "cycle-1",
      dimension: "demands",
      due_date: "2026-07-15",
      assignee_name: "Responsável SST",
    });

    expect(result.signals).toMatchObject({
      owner: true,
      deadline: true,
      risk_origin: true,
      evidence: true,
      kpi: true,
      technical_review: true,
    });
    expect(result.readyForClosure).toBe(true);
    expect(result.readyForDocument).toBe(true);
    expect(result.blockers).toEqual([]);
    expect(result.label).toBe("review_ready");
  });

  it("blocks done status when the action has no technical review signal", () => {
    const result = evaluateActionGovernance({
      title: "Treinar lideranças",
      description: "Evidência esperada: registro de treinamento. KPI: indicador trimestral de adesão.",
      status: "done",
      cycle_id: "cycle-1",
      due_date: "2026-07-15",
      assignee_user_id: "user-1",
    });

    expect(result.completionBlockers).toContain("done_without_review_evidence");
    expect(result.readyForClosure).toBe(false);
    expect(result.nextStep).toBe("Registrar revisão técnica antes de concluir.");
  });

  it("does not require closure readiness for cancelled actions", () => {
    const result = evaluateActionGovernance({
      title: "Ação substituída por controle mais amplo",
      status: "cancelled",
    });

    expect(result.blockers).toEqual([]);
    expect(result.readyForDocument).toBe(true);
    expect(result.label).toBe("cancelled");
  });
});
