import { describe, expect, it } from "vitest";
import {
  evaluateIncidentRecoveryExercise,
  type IncidentRecoveryPhaseRecord,
} from "./incidentRecoveryExercise";
import {
  g1IncidentRecoveryExerciseContext,
  g1IncidentRecoveryExercisePolicy,
  g1IncidentRecoveryExerciseScenario,
} from "@/data/g1IncidentRecoveryExercise";

const completeRecords: IncidentRecoveryPhaseRecord[] = g1IncidentRecoveryExercisePolicy.requiredPhases.map(
  (phase, index) => ({ phase, completedAt: `2026-07-15T12:0${index}:00.000Z` }),
);

describe("incident recovery exercise", () => {
  it("allows a memory-only synthetic rehearsal without claiming formal readiness", () => {
    const result = evaluateIncidentRecoveryExercise(
      g1IncidentRecoveryExerciseScenario,
      completeRecords,
      g1IncidentRecoveryExerciseContext,
      g1IncidentRecoveryExercisePolicy,
    );

    expect(result.status).toBe("local_rehearsal_complete");
    expect(result.canIssueLocalReceipt).toBe(true);
    expect(result.canCountAsFormalExercise).toBe(false);
    expect(result.canApproveRunbook).toBe(false);
    expect(result.canEnableRealData).toBe(false);
    expect(result.formalBlockers).toContain("approved_runbook_required");
  });

  it("identifies the next required phase", () => {
    const result = evaluateIncidentRecoveryExercise(
      g1IncidentRecoveryExerciseScenario,
      completeRecords.slice(0, 2),
      g1IncidentRecoveryExerciseContext,
      g1IncidentRecoveryExercisePolicy,
    );

    expect(result.status).toBe("in_progress");
    expect(result.nextStep?.phase).toBe("investigate");
    expect(result.canIssueLocalReceipt).toBe(false);
  });

  it("fails closed when phases are recorded out of order", () => {
    const records = [completeRecords[1], completeRecords[0]];
    const result = evaluateIncidentRecoveryExercise(
      g1IncidentRecoveryExerciseScenario,
      records,
      g1IncidentRecoveryExerciseContext,
      g1IncidentRecoveryExercisePolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.blockers).toContain("phase_order_invalid");
  });

  it.each([
    ["dados reais", { realDataEnabled: true }, "real_data_forbidden"],
    ["persistência", { persistenceEnabled: true }, "persistence_forbidden"],
    ["transporte remoto", { remoteTransportEnabled: true }, "remote_transport_forbidden"],
    ["modo não sintético", { syntheticMode: false }, "synthetic_mode_required"],
  ])("blocks unsafe context: %s", (_, contextPatch, blocker) => {
    const result = evaluateIncidentRecoveryExercise(
      g1IncidentRecoveryExerciseScenario,
      [],
      { ...g1IncidentRecoveryExerciseContext, ...contextPatch },
      g1IncidentRecoveryExercisePolicy,
    );

    expect(result.canStartLocalRehearsal).toBe(false);
    expect(result.blockers).toContain(blocker);
  });

  it("rejects an incomplete scenario contract", () => {
    const result = evaluateIncidentRecoveryExercise(
      { ...g1IncidentRecoveryExerciseScenario, steps: g1IncidentRecoveryExerciseScenario.steps.slice(0, 4) },
      [],
      g1IncidentRecoveryExerciseContext,
      g1IncidentRecoveryExercisePolicy,
    );

    expect(result.blockers).toContain("phase_contract_invalid");
  });
});
