import { describe, expect, it } from "vitest";
import {
  g2CommitteeSubmissionCriteria,
  g2CommitteeSubmissionPolicy,
  localG2CommitteeSubmissionEvidence,
} from "@/data/g2CommitteeSubmission";
import { evaluateCommitteeSubmissionReadiness, type CommitteeSubmissionEvidenceMap } from "./committeeSubmission";

describe("G2 committee submission readiness", () => {
  it("keeps Action 24 blocked in the local snapshot", () => {
    const result = evaluateCommitteeSubmissionReadiness(
      g2CommitteeSubmissionCriteria,
      localG2CommitteeSubmissionEvidence,
      g2CommitteeSubmissionPolicy,
    );

    expect(result.canSubmit).toBe(false);
    expect(result.status).toBe("blocked");
    expect(result.nextStep?.key).toBe("g1_formal_approval");
    expect(result.blockingOpen).toBeGreaterThan(0);
    expect(result.items.find((item) => item.key === "real_data_no_go")?.ok).toBe(true);
    expect(result.items.find((item) => item.key === "no_gate_advance_claimed")?.ok).toBe(true);
  });

  it("allows committee submission only when every blocking criterion is evidenced", () => {
    const evidence = Object.fromEntries(
      g2CommitteeSubmissionCriteria.map((criterion) => [
        criterion.key,
        { ok: true, detail: "Evidenciado." },
      ]),
    ) as CommitteeSubmissionEvidenceMap;

    const result = evaluateCommitteeSubmissionReadiness(
      g2CommitteeSubmissionCriteria,
      evidence,
      g2CommitteeSubmissionPolicy,
    );

    expect(result.canSubmit).toBe(true);
    expect(result.status).toBe("ready_for_committee");
    expect(result.blockingOpen).toBe(0);
    expect(result.readinessPct).toBe(100);
    expect(result.nextStep).toBeNull();
  });

  it("fails closed if real data is no longer No-Go or a gate advance is claimed", () => {
    const evidence = Object.fromEntries(
      g2CommitteeSubmissionCriteria.map((criterion) => [
        criterion.key,
        { ok: true, detail: "Evidenciado." },
      ]),
    ) as CommitteeSubmissionEvidenceMap;
    evidence.real_data_no_go = { ok: false, detail: "Dados reais habilitados indevidamente." };
    evidence.no_gate_advance_claimed = { ok: false, detail: "Gate avancado sem aceite." };

    const result = evaluateCommitteeSubmissionReadiness(
      g2CommitteeSubmissionCriteria,
      evidence,
      g2CommitteeSubmissionPolicy,
    );

    expect(result.canSubmit).toBe(false);
    expect(result.blockingOpen).toBe(2);
    expect(result.nextStep?.key).toBe("real_data_no_go");
  });
});
