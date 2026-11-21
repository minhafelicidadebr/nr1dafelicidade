import { describe, expect, it } from "vitest";
import {
    evaluateControlDivergence,
    highRiskThresholdFromBands,
    type DivergenceControl,
} from "@/lib/controls/controlDivergence";
import type { ControlEvidenceEvaluation } from "@/lib/controls/controlEvidence";

function evidence(canInform: boolean): ControlEvidenceEvaluation {
    return {
        signals: {
            catalog_evidence: canInform,
            implementation_evidence: canInform,
            maintenance: canInform,
            effectiveness_indicator: canInform,
            technical_review: canInform,
        },
        blockers: [],
        completionBlockers: [],
        readyForTechnicalReview: canInform,
        canInformResidualRiskReview: canInform,
        label: canInform ? "review_ready" : "evidence_pending",
        nextStep: "",
        disclaimer: "",
    };
}

function control(dimensionKey: string | null, canInform: boolean): DivergenceControl {
    return { catalogId: `cat-${dimensionKey}`, dimensionKey, title: `Controle ${dimensionKey}`, evidence: evidence(canInform) };
}

const OPTS = { highRiskThreshold: 10 };

describe("evaluateControlDivergence", () => {
    it("sinaliza review_efficacy quando controle comprovado e risco permanece alto", () => {
        const result = evaluateControlDivergence(
            [control("demands_quant", true)],
            [{ dimension: "demands_quant", riskLevel: 16 }],
            OPTS,
        );
        expect(result).toHaveLength(1);
        expect(result[0].severity).toBe("review_efficacy");
        expect(result[0].riskLevel).toBe(16);
    });

    it("sinaliza unproven_control quando risco alto mas sem evidência suficiente", () => {
        const result = evaluateControlDivergence(
            [control("demands_quant", false)],
            [{ dimension: "demands_quant", riskLevel: 20 }],
            OPTS,
        );
        expect(result).toHaveLength(1);
        expect(result[0].severity).toBe("unproven_control");
    });

    it("não gera divergência quando o risco está abaixo do limiar", () => {
        const result = evaluateControlDivergence(
            [control("support", true)],
            [{ dimension: "support", riskLevel: 6 }],
            OPTS,
        );
        expect(result).toHaveLength(0);
    });

    it("ignora controle sem dimensão vinculada (evita falso positivo)", () => {
        const result = evaluateControlDivergence(
            [control(null, true)],
            [{ dimension: "demands_quant", riskLevel: 20 }],
            OPTS,
        );
        expect(result).toHaveLength(0);
    });

    it("não gera divergência para dimensão sem controle declarado", () => {
        const result = evaluateControlDivergence(
            [control("support", true)],
            [{ dimension: "demands_quant", riskLevel: 20 }],
            OPTS,
        );
        expect(result).toHaveLength(0);
    });

    it("ordena por risco decrescente e usa o maior risco da dimensão", () => {
        const result = evaluateControlDivergence(
            [control("a", true), control("b", true)],
            [
                { dimension: "a", riskLevel: 12 },
                { dimension: "b", riskLevel: 25 },
                { dimension: "b", riskLevel: 10 },
            ],
            OPTS,
        );
        expect(result.map((d) => d.dimension)).toEqual(["b", "a"]);
        expect(result[0].riskLevel).toBe(25);
    });

    it("deriva o limiar de risco alto das bandas do Criteria Engine", () => {
        const bands = [
            { max: 4, key: "low" },
            { max: 9, key: "moderate" },
            { max: 16, key: "high" },
            { max: 25, key: "critical" },
        ];
        expect(highRiskThresholdFromBands(bands)).toBe(10);
    });

    it("cai para 10 quando não há banda 'high'", () => {
        expect(highRiskThresholdFromBands([{ max: 25, key: "critical" }])).toBe(10);
    });
});
