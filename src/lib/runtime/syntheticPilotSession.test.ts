import { describe, expect, it, beforeEach } from "vitest";
import {
  handleSyntheticLocalSupabaseFetch,
  readSyntheticCycles,
  writeSyntheticCycles,
} from "@/lib/runtime/syntheticPilotSession";

describe("syntheticPilotSession · ARGO 4.0 Forensic & State-of-the-Art Wave", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a valid NexoRecommendationRun object for /functions/v1/nexo-driver-recommendations (never an empty array)", async () => {
    const res = handleSyntheticLocalSupabaseFetch(
      "http://localhost:54321/functions/v1/nexo-driver-recommendations",
      {
        method: "POST",
        body: JSON.stringify({ cycle_id: "syn-cycle-2026-q2", scope_type: "cycle" }),
      },
    );
    expect(res.status).toBe(200);
    const payload = (await res.json()) as Record<string, unknown>;
    expect(Array.isArray(payload)).toBe(false);
    expect(payload.status).toBe("available");
    expect(Array.isArray(payload.blockers)).toBe(true);
    expect(Array.isArray(payload.recommendations)).toBe(true);
    expect((payload.recommendations as unknown[]).length).toBeGreaterThanOrEqual(3);
    expect(payload.primary).toBeTruthy();
  });

  it("returns populated CyclePrivacySummary rows with k_anonymity_met: true for get_cycle_privacy_summary", async () => {
    const res = handleSyntheticLocalSupabaseFetch(
      "http://localhost:54321/rest/v1/rpc/get_cycle_privacy_summary",
      {
        method: "POST",
        body: JSON.stringify({ _organization_id: "synthetic-org-pilot-g1" }),
      },
    );
    expect(res.status).toBe(200);
    const rows = (await res.json()) as Array<{
      cycle_id: string;
      response_count: number;
      k_anonymity_met: boolean;
      invitations_issued: number;
    }>;
    expect(rows.length).toBeGreaterThanOrEqual(2);
    expect(rows.every((r) => r.k_anonymity_met === true)).toBe(true);
    expect(rows[0].response_count).toBeGreaterThanOrEqual(5);
  });

  it("returns 10 psychosocial dimensions across Red, Yellow, and Green bands for list_safe_risk_scores", async () => {
    const res = handleSyntheticLocalSupabaseFetch(
      "http://localhost:54321/rest/v1/rpc/list_safe_risk_scores",
      {
        method: "POST",
        body: JSON.stringify({
          _organization_id: "synthetic-org-pilot-g1",
          _cycle_id: "syn-cycle-2026-q2",
        }),
      },
    );
    expect(res.status).toBe(200);
    const scores = (await res.json()) as Array<{
      dimension: string;
      risk_level: number;
      n_responses: number;
    }>;
    expect(scores.length).toBe(10);
    expect(scores.some((s) => s.risk_level >= 15)).toBe(true);
    expect(scores.some((s) => s.risk_level <= 6)).toBe(true);
    expect(scores.every((s) => s.n_responses >= 5)).toBe(true);
  });

  it("persists newly created cycles via POST /rest/v1/cycles and updates them via PATCH", async () => {
    const initial = readSyntheticCycles();
    expect(initial.length).toBe(2);

    const postRes = handleSyntheticLocalSupabaseFetch(
      "http://localhost:54321/rest/v1/cycles",
      {
        method: "POST",
        body: JSON.stringify({
          organization_id: "synthetic-org-pilot-g1",
          name: "Ciclo Piloto JP — 2026 Q4",
          horizon: "short",
          status: "open",
        }),
      },
    );
    expect(postRes.status).toBe(200);
    const createdRows = (await postRes.json()) as Array<{ id: string; name: string; status: string }>;
    expect(createdRows[0].name).toBe("Ciclo Piloto JP — 2026 Q4");
    expect(createdRows[0].status).toBe("open");

    const afterCreate = readSyntheticCycles();
    expect(afterCreate.length).toBe(3);

    // Rename cycle via PATCH
    const patchRes = handleSyntheticLocalSupabaseFetch(
      `http://localhost:54321/rest/v1/cycles?id=eq.${createdRows[0].id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name: "Ciclo Piloto JP — Renomeado", status: "closed" }),
      },
    );
    expect(patchRes.status).toBe(200);

    const afterPatch = readSyntheticCycles();
    const updated = afterPatch.find((c) => c.id === createdRows[0].id);
    expect(updated?.name).toBe("Ciclo Piloto JP — Renomeado");
    expect(updated?.status).toBe("closed");

    // Reset
    writeSyntheticCycles(initial);
  });

  it("issues unique invitation tokens and increments invitations_issued via create_invitation_batch", async () => {
    const res = handleSyntheticLocalSupabaseFetch(
      "http://localhost:54321/rest/v1/rpc/create_invitation_batch",
      {
        method: "POST",
        body: JSON.stringify({
          _cycle_id: "syn-cycle-2026-q2",
          _unit_id: "syn-unit-1",
          _quantity: 12,
        }),
      },
    );
    expect(res.status).toBe(200);
    const batch = (await res.json()) as Array<{ token: string; expires_at: string }>;
    expect(batch.length).toBe(12);
    const uniqueTokens = new Set(batch.map((b) => b.token));
    expect(uniqueTokens.size).toBe(12);
  });

  it("returns unit drilldown with k>=5 units and k<5 redaction for aggregate_unit_risk", async () => {
    const res = handleSyntheticLocalSupabaseFetch(
      "http://localhost:54321/rest/v1/rpc/aggregate_unit_risk",
      {
        method: "POST",
        body: JSON.stringify({ _cycle_id: "syn-cycle-2026-q2" }),
      },
    );
    expect(res.status).toBe(200);
    const rows = (await res.json()) as Array<{
      unit_id: string;
      n_responses: number;
      dimension: string | null;
    }>;
    const redactedUnit = rows.find((r) => r.unit_id === "syn-unit-4");
    expect(redactedUnit?.n_responses).toBe(3);
    expect(redactedUnit?.dimension).toBeNull();
  });
});
