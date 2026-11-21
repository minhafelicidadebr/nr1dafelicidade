/**
 * Divergência de eficácia de controle — mecanismo puro (Bloco Controles Implantados)
 *
 * Regra única: confronta um controle DECLARADO para uma dimensão com o risco
 * REMANESCENTE (percebido) dessa dimensão em ciclo fechado. NÃO recalcula o
 * escore — o escore reflete a percepção dos trabalhadores (invariante). A saída
 * é consultiva e apenas sinaliza revisão humana de eficácia (NR-1 1.5.4.4.6 "c").
 *
 * Sem I/O. Recebe agregados que JÁ passaram por k-anonimato/ciclo fechado
 * (list_safe_risk_scores) e controles já avaliados por controlEvidence.ts.
 */
import type { ControlEvidenceEvaluation } from "@/lib/controls/controlEvidence";

export type DivergenceRiskScore = {
    dimension: string;
    riskLevel: number;
};

export type DivergenceControl = {
    catalogId: string;
    dimensionKey: string | null;
    title: string;
    evidence: ControlEvidenceEvaluation;
};

export type DivergenceSeverity = "review_efficacy" | "unproven_control";

export type ControlDivergence = {
    dimension: string;
    riskLevel: number;
    controlTitle: string;
    severity: DivergenceSeverity;
    reason: string;
};

export type DivergenceOptions = {
    /** Nível de risco (severidade×probabilidade, 1–25) a partir do qual a dimensão
     *  é considerada alta. Deriva de criteriaPolicy; nunca hardcode na UI. */
    highRiskThreshold: number;
};

const REASON: Record<DivergenceSeverity, string> = {
    review_efficacy:
        "Controle comprovado, mas a dimensão segue em risco alto — revisar eficácia, adesão e cobertura antes de considerar tolerável.",
    unproven_control:
        "Controle declarado sem evidência suficiente de eficácia; não sustenta redução de risco. Registrar implementação, manutenção, indicador e revisão técnica.",
};

/**
 * Deriva o limiar de risco alto a partir das bandas versionadas do Criteria Engine.
 * Usa o topo da banda "moderate" + 1; se ausente, cai para 10 (topo moderado da matriz 5×5).
 */
export function highRiskThresholdFromBands(
    bands: ReadonlyArray<{ max: number; key: string }>,
): number {
    const sorted = [...bands].sort((a, b) => a.max - b.max);
    const highIndex = sorted.findIndex((band) => band.key === "high");
    if (highIndex > 0) return sorted[highIndex - 1].max + 1;
    return 10;
}

export function evaluateControlDivergence(
    controls: DivergenceControl[],
    scores: DivergenceRiskScore[],
    options: DivergenceOptions,
): ControlDivergence[] {
    const highByDimension = new Map<string, number>();
    for (const score of scores) {
        if (score.riskLevel >= options.highRiskThreshold) {
            const current = highByDimension.get(score.dimension);
            if (current === undefined || score.riskLevel > current) {
                highByDimension.set(score.dimension, score.riskLevel);
            }
        }
    }

    const divergences: ControlDivergence[] = [];
    for (const control of controls) {
        if (!control.dimensionKey) continue;
        const riskLevel = highByDimension.get(control.dimensionKey);
        if (riskLevel === undefined) continue;

        const severity: DivergenceSeverity = control.evidence.canInformResidualRiskReview
            ? "review_efficacy"
            : "unproven_control";

        divergences.push({
            dimension: control.dimensionKey,
            riskLevel,
            controlTitle: control.title,
            severity,
            reason: REASON[severity],
        });
    }

    return divergences.sort((a, b) => b.riskLevel - a.riskLevel);
}
