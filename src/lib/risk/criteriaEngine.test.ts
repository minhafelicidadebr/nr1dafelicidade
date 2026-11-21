import { describe, expect, it } from "vitest"; import { evaluateContextualRisk, validateCriteriaConfig, type CriteriaConfig, type ContextualRiskInput } from "./criteriaEngine";
const config: CriteriaConfig = { version: "test-approved", status: "approved", severityAggregation: "maximum", probabilityAggregation: "rounded_mean", minimumControlConfidence: "moderate", effectivenessReductionSteps: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 }, riskBands: [{ max: 4, key: "low" }, { max: 9, key: "moderate" }, { max: 16, key: "high" }, { max: 25, key: "critical" }] };
const input = (): ContextualRiskInput => ({ severity: { credibleConsequence: 3, reversibility: 2, incapacityPotential: 4, vulnerabilityAggravation: 2, justification: "Contexto técnico", sourceRef: "aep/finding/1" }, exposure: { intensity: 4, duration: 3, frequency: 4, breadth: 3, justification: "Exposição observada", sourceRef: "aep/evidence/1" }, controls: [] });
describe("contextual criteria engine", () => {
    it("refuses unapproved criteria", () => { expect(() => evaluateContextualRisk(input(), { ...config, status: "draft" })).toThrow("criteria_version_not_approved"); });
    it("requires severity and exposure rationale", () => { const value = input(); value.severity.justification = ""; expect(() => evaluateContextualRisk(value, config)).toThrow("severity_context_missing"); });
    it("uses contextual severity rather than a catalog constant", () => { const out = evaluateContextualRisk(input(), config); expect(out.severity).toBe(4); expect(out.grossProbability).toBe(4); expect(out.grossRisk).toBe(16); });
    it("does not reduce risk for a merely declared control", () => { const value = input(); value.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "insufficient", evidenceRef: "claim" }]; expect(evaluateContextualRisk(value, config).residualRisk).toBe(16); });
    it("reduces only probability when control efficacy has sufficient evidence", () => { const value = input(); value.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "high", evidenceRef: "evidence/1" }]; const out = evaluateContextualRisk(value, config); expect(out.severity).toBe(4); expect(out.residualProbability).toBe(2); expect(out.residualRisk).toBe(8); });
    it("keeps probability at the lower bound", () => { const value = input(); value.exposure = { ...value.exposure, intensity: 1, duration: 1, frequency: 1, breadth: 1 }; value.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "high", evidenceRef: "evidence/1" }]; expect(evaluateContextualRisk(value, config).residualProbability).toBe(1); });
    it("validates monotonic bands covering the whole matrix", () => { expect(validateCriteriaConfig(config)).toEqual([]); expect(validateCriteriaConfig({ ...config, riskBands: [{ max: 9, key: "x" }] })).toContain("risk_bands_do_not_cover_matrix"); });
});

// Regras NR-1 acrescentadas (lacunas do mapa de rastreabilidade)
describe("criteria engine - regras NR-1", () => {
    const nr1Config: CriteriaConfig = { ...config, regulatoryNonComplianceProbability: 5, hierarchyReductionCap: { elimination: 2, substitution: 2, engineering_collective: 2, administrative: 1, ppe: 1 } };

    it("severidade pelo pior cenario inclui consequencias adicionais (1.5.4.4.4.1)", () => {
        const value = input();
        value.severity.additionalConsequences = [5];
        const out = evaluateContextualRisk(value, nr1Config);
        expect(out.severity).toBe(5);
    });

    it("requisito de NR nao atendido forca probabilidade maxima e bloqueia reducao (1.5.4.4.5.1)", () => {
        const value = input();
        value.exposure = { ...value.exposure, intensity: 1, duration: 1, frequency: 1, breadth: 1 };
        value.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "high", evidenceRef: "evidence/1" }];
        value.regulatory = { mandatoryRequirementUnmet: true, requirementRef: "NR-17 item 17.6.6" };
        const out = evaluateContextualRisk(value, nr1Config);
        expect(out.grossProbability).toBe(5);
        expect(out.regulatoryOverrideApplied).toBe(true);
        expect(out.controlReductionApplied).toBe(0);
        expect(out.residualProbability).toBe(5);
    });

    it("EPI reduz no maximo 1 nivel; protecao coletiva pode reduzir mais (1.5.5.1.2)", () => {
        const ppe = input();
        ppe.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "high", evidenceRef: "ev/ppe", hierarchyTier: "ppe" }];
        expect(evaluateContextualRisk(ppe, nr1Config).controlReductionApplied).toBe(1);

        const collective = input();
        collective.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "high", evidenceRef: "ev/eng", hierarchyTier: "engineering_collective" }];
        expect(evaluateContextualRisk(collective, nr1Config).controlReductionApplied).toBe(2);
    });

    it("mantem retrocompatibilidade: controle sem hierarquia nao sofre teto", () => {
        const value = input();
        value.controls = [{ implemented: true, maintained: true, effectiveness: 5, confidence: "high", evidenceRef: "ev/legacy" }];
        expect(evaluateContextualRisk(value, nr1Config).controlReductionApplied).toBe(2);
    });

    it("propaga o tipo de risco para integracao na matriz unica", () => {
        const value = input();
        value.riskType = "psicossocial";
        expect(evaluateContextualRisk(value, nr1Config).riskType).toBe("psicossocial");
    });

    it("valida parametros novos da config", () => {
        expect(validateCriteriaConfig({ ...nr1Config, regulatoryNonComplianceProbability: 7 as never })).toContain("regulatory_probability_invalid");
        expect(validateCriteriaConfig({ ...nr1Config, hierarchyReductionCap: { ...nr1Config.hierarchyReductionCap!, ppe: -1 } })).toContain("hierarchy_cap_invalid");
    });
});
