import type { CriteriaConfig } from "@/lib/risk/criteriaEngine";
export const repositoryCriteriaDraft: CriteriaConfig = {
    version: "criteria-g2-2026.07-draft",
    status: "draft",
    severityAggregation: "maximum",
    probabilityAggregation: "rounded_mean",
    minimumControlConfidence: "moderate",
    effectivenessReductionSteps: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 },
    riskBands: [{ max: 4, key: "low" }, { max: 9, key: "moderate" }, { max: 16, key: "high" }, { max: 25, key: "critical" }],
    // NR-1 1.5.4.4.5.1: requisito de NR nao atendido eleva a probabilidade a gradacao maxima.
    regulatoryNonComplianceProbability: 5,
    // NR-1 1.5.5.1.2: hierarquia de prevencao. EPI/administrativa reduzem no maximo 1 nivel;
    // eliminacao/substituicao/protecao coletiva podem reduzir ate o passo total de eficacia.
    hierarchyReductionCap: { elimination: 2, substitution: 2, engineering_collective: 2, administrative: 1, ppe: 1 },
};
export const criteriaDraftLimitations = [
    "Fórmula e bandas são proposta técnica em draft, sem aprovação regulatória ou metodológica.",
    "Sinal coletivo é opcional e só pode ser usado quando metodologicamente aplicável.",
    "Controle declarado não reduz risco sem evidência de implementação, manutenção e eficácia.",
    "Descumprimento de requisito obrigatório de NR força a probabilidade à gradação máxima até a correção.",
    "EPI e medidas administrativas têm redução limitada; prioriza-se eliminação e proteção coletiva.",
];
