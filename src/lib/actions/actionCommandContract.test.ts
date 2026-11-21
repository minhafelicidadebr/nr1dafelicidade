import { describe, expect, it } from "vitest";
import { createActionExecutionSnapshot, type ActionExecutionSnapshot } from "./actionExecutionCore";
import { normalizeOutcomeRows } from "@/lib/privacy/outcomeRows";
import {
  createActionCommandState,
  executeActionCommand,
  executeActionCommandInMemory,
  type ActionCommandActorContext,
  type PersistedActionRecord,
} from "./actionCommandContract";

const action = (overrides: Partial<ActionExecutionSnapshot> = {}): PersistedActionRecord => ({
  ...createActionExecutionSnapshot({
    id: "action-1",
    origin: { kind: "aep_finding", id: "finding-1" },
    interventionType: "improve",
    priority: "medium",
    ownerId: "owner-1",
    dueDate: "2026-09-30",
    monitoringMethod: "worker and CIPA consultation",
    expectedOutcome: "greater predictability of work schedules",
    evidenceCount: 0,
    measurementCount: 0,
    ...overrides,
  }),
  organizationId: "tenant-a",
});

const manager: ActionCommandActorContext = {
  userId: "manager-1",
  memberships: [{ organizationId: "tenant-a", role: "gestor" }],
};

const command = (overrides: Record<string, unknown> = {}) => ({
  commandId: "command-1",
  actionId: "action-1",
  target: "planned" as const,
  expectedVersion: 1,
  occurredAt: "2026-08-11T12:00:00.000Z",
  ...overrides,
});

describe("synthetic action command boundary", () => {
  it("derives tenant and actor from server context, ignoring forged client authority", () => {
    const state = createActionCommandState([action()]);
    const forgedRequest = {
      ...command(),
      organizationId: "tenant-b",
      actorId: "attacker",
      review: { outcome: "effective", rationale: "forged", reviewerId: "attacker" },
    } as never;

    const result = executeActionCommand(state, manager, forgedRequest);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.event.actorId).toBe("manager-1");
    expect(result.receipt.organizationId).toBe("tenant-a");
    expect(result.action.id).toBe("action-1");
  });

  it("blocks a collaborator even when the collaborator belongs to the action tenant", () => {
    const state = createActionCommandState([action()]);
    const collaborator: ActionCommandActorContext = {
      userId: "worker-1",
      memberships: [{ organizationId: "tenant-a", role: "colaborador" }],
    };

    const result = executeActionCommand(state, collaborator, command());

    expect(result).toMatchObject({ ok: false, blockers: ["role_not_authorized"] });
    expect(Object.keys(result)).toEqual(["ok", "blockers"]);
  });

  it("blocks cross-tenant access without exposing action state", () => {
    const state = createActionCommandState([action()]);
    const outsider: ActionCommandActorContext = {
      userId: "manager-b",
      memberships: [{ organizationId: "tenant-b", role: "gestor" }],
    };

    const result = executeActionCommand(state, outsider, command());

    expect(result).toMatchObject({ ok: false, blockers: ["forbidden"] });
    expect(state.actions["action-1"].version).toBe(1);
  });

  it("rejects stale commands and keeps the original state immutable", () => {
    const state = createActionCommandState([action({ version: 4 })]);

    const result = executeActionCommand(state, manager, command({ expectedVersion: 3 }));

    expect(result).toMatchObject({ ok: false, blockers: ["stale_version"] });
    expect(state.actions["action-1"].version).toBe(4);
  });

  it("replays the same command without applying the transition twice", () => {
    const state = createActionCommandState([action()]);
    const first = executeActionCommandInMemory(state, manager, command());
    expect(first.result.ok).toBe(true);
    if (!first.result.ok) return;

    const replay = executeActionCommandInMemory(first.nextState, manager, command());

    expect(replay.result).toMatchObject({ ok: true, replayed: true });
    expect(replay.nextState.actions["action-1"].version).toBe(2);
    expect(Object.keys(replay.nextState.receipts)).toHaveLength(1);
  });

  it("rejects command-id reuse by a different actor or action", () => {
    const state = createActionCommandState([action(), action({ id: "action-2" })]);
    const first = executeActionCommandInMemory(state, manager, command());
    expect(first.result.ok).toBe(true);
    if (!first.result.ok) return;

    const differentAction = executeActionCommand(
      first.nextState,
      manager,
      command({ actionId: "action-2" }),
    );
    const differentActor = executeActionCommand(
      first.nextState,
      { ...manager, userId: "manager-2" },
      command(),
    );

    expect(differentAction).toMatchObject({ ok: false, blockers: ["command_id_conflict"] });
    expect(differentActor).toMatchObject({ ok: false, blockers: ["command_id_conflict"] });
  });

  it("derives the reviewer from the authenticated actor", () => {
    const state = createActionCommandState([action({ priority: "high", state: "under_review", evidenceCount: 1, measurementCount: 1 })]);
    const ownerManager: ActionCommandActorContext = {
      userId: "owner-1",
      memberships: [{ organizationId: "tenant-a", role: "sst" }],
    };

    const result = executeActionCommand(state, ownerManager, {
      commandId: "review-command",
      actionId: "action-1",
      target: "verified",
      expectedVersion: 1,
      occurredAt: "2026-08-11T12:00:00.000Z",
      review: {
        outcome: "effective",
        rationale: "A evidência e a medição atendem ao resultado esperado.",
      },
    });

    expect(result).toMatchObject({ ok: false, blockers: ["domain_blocked"] });
  });

  it("accepts an authorized role when another membership in the same tenant is non-authorized", () => {
    const state = createActionCommandState([action()]);
    const actor: ActionCommandActorContext = {
      userId: "multi-role-1",
      memberships: [
        { organizationId: "tenant-a", role: "colaborador" },
        { organizationId: "tenant-a", role: "sst" },
      ],
    };

    expect(executeActionCommand(state, actor, command())).toMatchObject({ ok: true });
  });

  it("requires command identity and timestamp before reaching the domain core", () => {
    const state = createActionCommandState([action()]);
    const result = executeActionCommand(state, manager, {
      ...command(),
      commandId: " ",
      occurredAt: " ",
    });

    expect(result).toMatchObject({
      ok: false,
      blockers: ["missing_command_id", "missing_occurred_at"],
    });
  });

  it("keeps collective output separate and fails closed below k=5", () => {
    expect(normalizeOutcomeRows([
      {
        outcome: "work_pace",
        mean_score: 42,
        n_responses: 4,
        k_anonymity_met: true,
        worker_email: "never-crosses-boundary@example.test",
      },
      {
        outcome: "predictability",
        mean_score: 38,
        n_responses: 5,
        k_anonymity_met: true,
        worker_email: "never-crosses-boundary@example.test",
      },
    ])).toEqual([{
      outcome: "predictability",
      mean_score: 38,
      n_responses: 5,
      k_anonymity_met: true,
    }]);
  });
});
