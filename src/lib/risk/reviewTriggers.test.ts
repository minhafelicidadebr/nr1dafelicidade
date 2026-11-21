import { describe, expect, it } from "vitest";
import {
    evaluateReviewTriggers,
    immediateReviewTriggerLabel,
    type ReviewTriggerContext,
} from "./reviewTriggers";
import { reviewTriggerPolicy } from "@/data/reviewTriggerPolicy";

function ctx(overrides: Partial<ReviewTriggerContext>): ReviewTriggerContext {
    return {
        lastReviewISO: "2024-01-01T00:00:00.000Z",
        nowISO: "2025-01-01T00:00:00.000Z",
        hasValidSGSSTCertification: false,
        immediateSituations: [],
        ...overrides,
    };
}

describe("evaluateReviewTriggers", () => {
    it("nao exige revisao dentro do prazo periodico de 2 anos", () => {
        const out = evaluateReviewTriggers(ctx({}), reviewTriggerPolicy);
        expect(out.reviewDue).toBe(false);
        expect(out.reason).toBe("not_due");
        expect(out.periodicMonthsApplied).toBe(24);
    });

    it("exige revisao periodica apos 2 anos sem certificacao", () => {
        const out = evaluateReviewTriggers(ctx({ nowISO: "2026-06-01T00:00:00.000Z" }), reviewTriggerPolicy);
        expect(out.reviewDue).toBe(true);
        expect(out.reason).toBe("periodic_overdue");
    });

    it("estende o prazo periodico para 3 anos com certificacao valida de SGSST", () => {
        const out = evaluateReviewTriggers(
            ctx({ nowISO: "2026-06-01T00:00:00.000Z", hasValidSGSSTCertification: true }),
            reviewTriggerPolicy,
        );
        expect(out.periodicMonthsApplied).toBe(36);
        expect(out.reason).toBe("not_due");
    });

    it("situacao imediata prevalece sobre o prazo periodico e sobre a certificacao", () => {
        const out = evaluateReviewTriggers(
            ctx({ hasValidSGSSTCertification: true, immediateSituations: ["accident_or_disease"] }),
            reviewTriggerPolicy,
        );
        expect(out.reviewDue).toBe(true);
        expect(out.reason).toBe("immediate");
        expect(out.requiresImmediateAction).toBe(true);
        expect(out.immediateTriggers).toContain("accident_or_disease");
    });

    it("cobre as seis situacoes imediatas com rotulo legivel", () => {
        const triggers: ReviewTriggerContext["immediateSituations"] = [
            "post_control_implementation",
            "process_change_new_risk",
            "control_inadequacy",
            "accident_or_disease",
            "legal_requirement_change",
            "worker_or_cipa_request",
        ];
        for (const trigger of triggers) {
            expect(immediateReviewTriggerLabel(trigger)).toMatch(/1\.5\.4\.4\.6/);
        }
    });

    it("falha fechado com datas invalidas", () => {
        const out = evaluateReviewTriggers(ctx({ nowISO: "data-invalida" }), reviewTriggerPolicy);
        expect(out.error).toBe("invalid_dates");
        expect(out.reviewDue).toBe(false);
    });
});
