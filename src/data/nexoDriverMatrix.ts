import type { NexoDriverMatrixConfig, NexoDriverDimensionMapping } from "../lib/nexo/driverRecommendation.ts";

const activeFrom = "2026-07-01";
const associationType = "operational_alignment" as const;
const direction = "risk_increases_driver_priority" as const;
const reviewedBy = "Fable 5 synthetic protocol";
const reviewedAt = "2026-07-01T00:00:00.000Z";
const evidenceClass = "operational_alignment_initial";

function mapping(
  driverKey: string,
  dimensionKey: string,
  weight: number,
  rationale: string,
  coverageRole: NexoDriverDimensionMapping["coverageRole"] = "primary",
): NexoDriverDimensionMapping {
  return {
    driverKey,
    dimensionKey,
    weight,
    associationType,
    direction,
    rationale,
    evidenceClass,
    coverageRole,
    activeFrom,
    activeTo: null,
    reviewedBy,
    reviewedAt,
  };
}

export const nexoDriverMatrix: NexoDriverMatrixConfig = {
  version: "nexo-operational-alignment-v0.1.0-2026-07-01",
  algorithmVersion: "nexo-priority-v0.1.0",
  minCoverage: 0.6,
  criticalRiskLevel: 20,
  mappings: [
    mapping("management", "leadership_quality", 1, "Qualidade da liderança orienta práticas de gestão e suporte ao trabalho."),
    mapping("management", "predictability", 0.85, "Previsibilidade depende de rotinas de gestão, comunicação e planejamento."),
    mapping("management", "role_clarity", 0.85, "Clareza de papel é condição operacional de gestão."),
    mapping("management", "social_support", 0.6, "Apoio da chefia e recursos cotidianos conectam gestão à experiência do trabalhador.", "supporting"),
    mapping("management", "recognition", 0.45, "Reconhecimento e justiça indicam qualidade percebida da gestão.", "supporting"),

    mapping("trust", "leadership_quality", 0.8, "Confiança vertical depende de práticas consistentes de liderança."),
    mapping("trust", "recognition", 0.75, "Justiça, respeito e reconhecimento sustentam confiança organizacional."),
    mapping("trust", "predictability", 0.7, "Previsibilidade reduz ruído e fortalece confiança."),
    mapping("trust", "community", 0.55, "Comunidade social informa confiança horizontal.", "supporting"),

    mapping("stress", "demands_quant", 1, "Exigências quantitativas elevam prioridade de ações sobre carga e ritmo."),
    mapping("stress", "work_pace", 0.9, "Ritmo de trabalho é sinal operacional central para estresse e carga."),
    mapping("stress", "demands_emotional", 0.85, "Exigências emocionais aumentam necessidade de suporte e desenho do trabalho."),
    mapping("stress", "predictability", 0.45, "Baixa previsibilidade amplifica carga percebida.", "supporting"),
    mapping("stress", "insecurity", 0.4, "Insegurança laboral pode intensificar estresse organizacional.", "contextual"),

    mapping("support", "social_support", 1, "Apoio social é dimensão primária para suporte e recursos."),
    mapping("support", "community", 0.8, "Comunidade social indica disponibilidade de suporte entre pares."),
    mapping("support", "influence", 0.55, "Influência no trabalho favorece acesso a recursos e suporte prático.", "supporting"),
    mapping("support", "role_clarity", 0.5, "Clareza de papel reduz dependência de suporte informal.", "supporting"),

    mapping("energy", "demands_quant", 0.8, "Carga quantitativa elevada pode afetar recuperação."),
    mapping("energy", "work_pace", 0.75, "Ritmo intenso pressiona energia e recuperação."),
    mapping("energy", "demands_emotional", 0.7, "Demanda emocional consome energia psicossocial."),
    mapping("energy", "predictability", 0.4, "Previsibilidade ajuda a planejar recuperação.", "contextual"),

    mapping("inclusion_belonging", "community", 1, "Comunidade no trabalho é sinal primário de pertencimento."),
    mapping("inclusion_belonging", "social_support", 0.7, "Apoio de pares e liderança sustenta inclusão."),
    mapping("inclusion_belonging", "recognition", 0.65, "Justiça e reconhecimento informam valorização e pertencimento."),

    mapping("compensation", "recognition", 1, "Reconhecimento e justiça conectam recompensas ao senso de equidade."),
    mapping("compensation", "insecurity", 0.8, "Insegurança laboral aumenta prioridade de governança de segurança e recompensas."),
    mapping("compensation", "leadership_quality", 0.45, "Práticas de gestão comunicam justiça e regras de recompensa.", "supporting"),

    mapping("flexibility", "influence", 1, "Influência no trabalho é dimensão primária de autonomia e flexibilidade."),
    mapping("flexibility", "predictability", 0.75, "Previsibilidade permite planejar tempo e conciliar demandas."),
    mapping("flexibility", "demands_quant", 0.55, "Carga alta pode limitar flexibilidade real.", "supporting"),
    mapping("flexibility", "work_pace", 0.5, "Ritmo intenso reduz margem de controle sobre o trabalho.", "supporting"),

    mapping("learning", "meaning", 0.75, "Trabalho significativo e aprendizagem se reforçam na experiência de desenvolvimento."),
    mapping("learning", "role_clarity", 0.7, "Clareza de papel cria base para aprendizagem aplicada."),
    mapping("learning", "leadership_quality", 0.65, "Liderança cria oportunidades e segurança para aprender."),
    mapping("learning", "influence", 0.55, "Influência favorece experimentação e aprendizado no trabalho.", "supporting"),
    mapping("learning", "predictability", 0.45, "Previsibilidade sustenta planejamento de aprendizagem.", "contextual"),

    mapping("purpose", "meaning", 1, "Sentido do trabalho é dimensão primária para propósito."),
    mapping("purpose", "community", 0.55, "Comunidade ajuda a conectar trabalho a contribuição coletiva.", "supporting"),
    mapping("purpose", "recognition", 0.45, "Reconhecimento reforça contribuição percebida.", "contextual"),

    mapping("appreciation", "recognition", 1, "Reconhecimento é dimensão primária para apreciação."),
    mapping("appreciation", "leadership_quality", 0.65, "Lideranças sustentam rituais e práticas de reconhecimento."),
    mapping("appreciation", "meaning", 0.45, "Sentido do trabalho reforça valorização percebida.", "supporting"),

    mapping("achievement", "role_clarity", 0.9, "Clareza de papel permite metas, feedback e realização."),
    mapping("achievement", "predictability", 0.75, "Previsibilidade reduz ruído para execução eficaz."),
    mapping("achievement", "influence", 0.65, "Influência no trabalho aumenta capacidade de realizar."),
    mapping("achievement", "leadership_quality", 0.6, "Liderança orienta priorização e acompanhamento."),
    mapping("achievement", "demands_quant", 0.45, "Carga excessiva afeta eficácia coletiva.", "contextual"),
    mapping("achievement", "work_pace", 0.4, "Ritmo intenso pode degradar entrega sustentável.", "contextual"),
  ],
};
