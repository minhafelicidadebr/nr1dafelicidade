import { describe, expect, it } from "vitest";
import {
  ACTION_STATES,
  advanceAction,
  allowedActionTransitions,
  createActionExecutionSnapshot,
  type ActionExecutionSnapshot,
} from "./actionExecutionCore";

const completeAction = (overrides: Partial<ActionExecutionSnapshot> = {}) =>
  createActionExecutionSnapshot({
    id: "action-1",
    origin: { kind: "aep_finding", id: "finding-1" },
    interventionType: "improve",
    priority: "medium",
    ownerId: "owner-1",
    dueDate: "2026-09-30",
    monitoringMethod: "inspection and worker/CIPA consultation",
    expectedOutcome: "greater predictability of work schedules",
    evidenceCount: 0,
    measurementCount: 0,
    ...overrides,
  });

describe("action execution core", () => {
  it("exposes a monotonic lifecycle without a direct done state", () => {
    expect(ACTION_STATES).not.toContain("done");
    expect(allowedActionTransitions("draft")).toEqual(["planned"]);
    expect(allowedActionTransitions("under_review")).toEqual(["verified", "corrective_required"]);
    expect(allowedActionTransitions("verified")).toEqual([]);
  });

  it("requires the planning contract before a draft can be planned", () => {
    const action = completeAction({
      origin: null,
      ownerId: null,
      dueDate: null,
      monitoringMethod: null,
      expectedOutcome: null,
      interventionType: null,
    });

    const result = advanceAction(action, {
      target: "planned",
      actorId: "planner-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
    });

    expect(result).toEqual({
      ok: false,
      blockers: [
        "missing_origin",
        "missing_intervention_type",
        "missing_owner",
        "missing_due_date",
        "missing_monitoring_method",
        "missing_expected_outcome",
      ],
    });
  });

  it("advances a complete action and emits a versioned event", () => {
    const result = advanceAction(completeAction(), {
      target: "planned",
      actorId: "planner-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.action.state).toBe("planned");
    expect(result.action.version).toBe(2);
    expect(result.event).toMatchObject({
      actionId: "action-1",
      from: "draft",
      to: "planned",
      actorId: "planner-1",
      version: 2,
    });
  });

  it("rejects a stale version without mutating the action", () => {
    const action = completeAction({ version: 4 });
    const result = advanceAction(action, {
      target: "planned",
      actorId: "planner-1",
      expectedVersion: 3,
      occurredAt: "2026-08-07T10:00:00.000Z",
    });

    expect(result).toEqual({ ok: false, blockers: ["stale_version"] });
    expect(action).toMatchObject({ state: "draft", version: 4 });
  });

  it("requires evidence and measurement before technical review", () => {
    const action = completeAction({ state: "in_progress" });
    const result = advanceAction(action, {
      target: "under_review",
      actorId: "owner-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
    });

    expect(result).toEqual({
      ok: false,
      blockers: ["missing_evidence", "missing_measurement"],
    });
  });

  it("requires a distinct reviewer for high-priority effective closure", () => {
    const action = completeAction({
      state: "under_review",
      priority: "high",
      evidenceCount: 1,
      measurementCount: 1,
    });
    const result = advanceAction(action, {
      target: "verified",
      actorId: "owner-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
      review: {
        reviewerId: "owner-1",
        outcome: "effective",
        rationale: "A medida foi verificada no escopo definido.",
      },
    });

    expect(result).toEqual({ ok: false, blockers: ["reviewer_is_owner"] });
  });

  it("allows effective verification only with a complete independent review", () => {
    const action = completeAction({
      state: "under_review",
      priority: "high",
      evidenceCount: 1,
      measurementCount: 1,
    });
    const result = advanceAction(action, {
      target: "verified",
      actorId: "reviewer-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
      review: {
        reviewerId: "reviewer-1",
        outcome: "effective",
        rationale: "A evidência e a medição atendem ao resultado esperado.",
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.action.state).toBe("verified");
    expect(result.event.reviewOutcome).toBe("effective");
  });

  it("routes partial effectiveness to corrective_required", () => {
    const action = completeAction({
      state: "under_review",
      evidenceCount: 1,
      measurementCount: 1,
    });
    const result = advanceAction(action, {
      target: "corrective_required",
      actorId: "reviewer-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
      review: {
        reviewerId: "reviewer-1",
        outcome: "partially_effective",
        rationale: "A medida melhorou o processo, mas ainda exige ajuste.",
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.action.state).toBe("corrective_required");
  });

  it("requires a reason when cancelling and never reopens the old action", () => {
    const action = completeAction({ state: "planned" });
    const missingReason = advanceAction(action, {
      target: "cancelled",
      actorId: "manager-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
    });
    expect(missingReason).toEqual({ ok: false, blockers: ["missing_cancel_reason"] });

    const cancelled = advanceAction(action, {
      target: "cancelled",
      actorId: "manager-1",
      expectedVersion: 1,
      occurredAt: "2026-08-07T10:00:00.000Z",
      reason: "Substituída por uma ação de escopo mais amplo.",
    });
    expect(cancelled.ok).toBe(true);
    if (!cancelled.ok) return;

    const reopen = advanceAction(cancelled.action, {
      target: "planned",
      actorId: "manager-1",
      expectedVersion: 2,
      occurredAt: "2026-08-07T10:00:00.000Z",
    });
    expect(reopen).toEqual({ ok: false, blockers: ["invalid_transition"] });
  });
});
