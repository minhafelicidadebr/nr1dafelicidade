import {
  COPSOQ_OFFICIAL_SHORT_SUBSCALES,
  COPSOQ_TERTILE_HIGH_CUTOFF,
  COPSOQ_TERTILE_LOW_CUTOFF,
  copsoqItems,
  computeOfficialShortSubscales,
  type CopsoqOfficialSubscaleResult,
} from "@/data/copsoqData";

export type Mte2026RequirementStatus =
  | "implemented_compliant"
  | "remediated_in_wave"
  | "gate_blocked_g3";

export type MteControlHierarchyLevel =
  | "avoid"
  | "eliminate_substitute"
  | "collective_engineering"
  | "administrative_work_org"
  | "ppe_only"
  | "none";

export type MteImmediateReviewTriggerCode =
  | "a_post_measure_residual"
  | "b_change_management_innovation"
  | "c_control_inadequacy_inefficacy"
  | "d_work_accident_or_disease"
  | "e_legal_requirement_change"
  | "f_worker_or_cipa_justified_request";

export type MteRiskLevelCode = "BAIXO" | "MEDIO" | "ALTO" | "MUITO_ALTO";

export interface Mte2026AuditRequirementItem {
  readonly id: string;
  readonly nr1Clause: string;
  readonly mteGuideSection: string;
  readonly title: string;
  readonly mandatoryActionSummary: string;
  readonly appFunctionalSurface: string;
  readonly verificationModule: string;
  readonly status: Mte2026RequirementStatus;
  readonly zeroHallucinationRule: string;
  readonly evidenceArtifacts: readonly string[];
}

export interface CopsoqManualAuditFinding {
  readonly id: string;
  readonly manualSectionRef: string;
  readonly dimensionOrRule: string;
  readonly officialSpecification: string;
  readonly previousAppState: string;
  readonly remediatedAppState: string;
  readonly verificationContract: string;
  readonly compliant: boolean;
}

export interface MteRiskEvaluationInput {
  readonly consequenceMagnitudes: readonly (1 | 2 | 3 | 4 | 5)[];
  readonly specificNrRequirementViolated: boolean;
  readonly exposureDurationLevel: 1 | 2 | 3 | 4 | 5;
  readonly activityDemandIntensityLevel: 1 | 2 | 3 | 4 | 5;
  readonly highestImplementedControl: MteControlHierarchyLevel;
  readonly controlMaintainedAndVerified: boolean;
}

export interface MteRiskEvaluationOutput {
  readonly severity: 1 | 2 | 3 | 4 | 5;
  readonly probability: 1 | 2 | 3 | 4 | 5;
  readonly rawScore: number;
  readonly riskLevel: MteRiskLevelCode;
  readonly priorityLabel: string;
  readonly maxDeadlineLabel: string;
  readonly mandatoryDecisionRule: string;
  readonly nrLegalLockApplied: boolean;
  readonly ppeOnlyWarning: boolean;
}

export interface MteReviewScheduleEvaluation {
  readonly periodicReviewYears: 2 | 3;
  readonly immediateReviewRequired: boolean;
  readonly activeImmediateTriggers: readonly MteImmediateReviewTriggerCode[];
  readonly legalBasisClause: string;
  readonly workerCipaTriggered: boolean;
}

export interface MteCopsoqSystemicAuditSummary {
  readonly auditId: string;
  readonly mteTotalRequirements: number;
  readonly mteCompliantCount: number;
  readonly mteCompliancePct: number;
  readonly copsoqTotalItems: number;
  readonly copsoqTotalSubscales: number;
  readonly copsoqMainDimensionsCount: number;
  readonly copsoqTertileCutoffs: readonly [number, number];
  readonly copsoqAllItemsMappedTo26Subscales: boolean;
  readonly copsoqZeroHallucinationCompliant: boolean;
  readonly minimumPgrDocumentsCount: 3;
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

/**
 * Regra de Ouro da Severidade (Item 1.5.4.4.4.1 da NR-1 / Guia Oficial MTE 2026, Cap. 11.3):
 * Sempre selecionar a consequência de maior magnitude (pior cenário possível).
 */
export function evaluateMteSeverityGoldenRule(
  consequenceMagnitudes: readonly (1 | 2 | 3 | 4 | 5)[],
): 1 | 2 | 3 | 4 | 5 {
  if (consequenceMagnitudes.length === 0) {
    return 1;
  }
  return Math.max(...consequenceMagnitudes) as 1 | 2 | 3 | 4 | 5;
}

/**
 * Regra Legal da Probabilidade (Itens 1.5.4.4.5.1 e 1.5.4.4.5.3 da NR-1 / Guia Oficial MTE 2026, Cap. 11.4):
 * 1) Se requisito específico previsto em NR não for cumprido -> probabilidade vai automaticamente para a mais alta gradação (5).
 * 2) Para fatores ergonômicos e psicossociais -> considera duração da exposição + intensidade das exigências + eficácia das medidas (hierarquia 1.5.5.1.2).
 * 3) EPI isolado ("ppe_only") como única medida contraria o Guia MTE 2026 (p. 65) e não reduz probabilidade ergonômica/psicossocial.
 */
export function evaluateMteProbabilityWithNrLock(
  input: Omit<MteRiskEvaluationInput, "consequenceMagnitudes">,
): {
  readonly probability: 1 | 2 | 3 | 4 | 5;
  readonly nrLegalLockApplied: boolean;
  readonly ppeOnlyWarning: boolean;
} {
  if (input.specificNrRequirementViolated) {
    return {
      probability: 5,
      nrLegalLockApplied: true,
      ppeOnlyWarning: input.highestImplementedControl === "ppe_only",
    };
  }

  const baseDemandScore = Math.ceil(
    (input.exposureDurationLevel + input.activityDemandIntensityLevel) / 2,
  );

  let hierarchyReduction = 0;
  if (input.controlMaintainedAndVerified) {
    if (input.highestImplementedControl === "avoid") {
      hierarchyReduction = 3;
    } else if (input.highestImplementedControl === "eliminate_substitute") {
      hierarchyReduction = 2;
    } else if (input.highestImplementedControl === "collective_engineering") {
      hierarchyReduction = 2;
    } else if (input.highestImplementedControl === "administrative_work_org") {
      hierarchyReduction = 1;
    }
  }

  const rawProbability = Math.max(1, Math.min(5, baseDemandScore - hierarchyReduction)) as
    | 1
    | 2
    | 3
    | 4
    | 5;

  return {
    probability: rawProbability,
    nrLegalLockApplied: false,
    ppeOnlyWarning: input.highestImplementedControl === "ppe_only",
  };
}

/**
 * Matriz de Combinação Severidade × Probabilidade e Classificação de Riscos
 * (Figuras 31 e 32 — ISO 45002:2023 + Quadro 5 do Guia Oficial MTE 2026, p. 68-70).
 */
export function evaluateMteRiskMatrixIso45002(
  input: MteRiskEvaluationInput,
): MteRiskEvaluationOutput {
  const severity = evaluateMteSeverityGoldenRule(input.consequenceMagnitudes);
  const { probability, nrLegalLockApplied, ppeOnlyWarning } =
    evaluateMteProbabilityWithNrLock(input);

  const rawScore = severity * probability;

  let riskLevel: MteRiskLevelCode = "BAIXO";
  let priorityLabel = "BAIXA";
  let maxDeadlineLabel = "Até 12 meses";
  let mandatoryDecisionRule =
    "Manter monitoramento periódico para assegurar que os controles existentes sejam mantidos (risco tolerável não é risco zero).";

  if (rawScore >= 15 || (severity === 5 && probability >= 3)) {
    riskLevel = "MUITO_ALTO";
    priorityLabel = "ALTÍSSIMA";
    maxDeadlineLabel = "IMEDIATO";
    mandatoryDecisionRule =
      "O trabalho não deve ser iniciado ou continuado até que o risco seja reduzido por ações corretivas imediatas.";
  } else if (rawScore >= 8) {
    riskLevel = "ALTO";
    priorityLabel = "ALTA";
    maxDeadlineLabel = "Menor do que 3 meses";
    mandatoryDecisionRule =
      "Para trabalhos em andamento, devem ser tomadas ações urgentes de redução do risco priorizando proteção coletiva.";
  } else if (rawScore >= 4) {
    riskLevel = "MEDIO";
    priorityLabel = "MODERADA";
    maxDeadlineLabel = "Menor do que 9 meses";
    mandatoryDecisionRule =
      "Adotar medidas para reduzir o risco reavaliando controles existentes e aprofundando análise (AET quando aplicável).";
  }

  return {
    severity,
    probability,
    rawScore,
    riskLevel,
    priorityLabel,
    maxDeadlineLabel,
    mandatoryDecisionRule,
    nrLegalLockApplied,
    ppeOnlyWarning,
  };
}

/**
 * Avalia o ciclo de revisão periódica (2 ou 3 anos) e as 6 hipóteses de revisão imediata
 * (Item 1.5.4.4.6, alíneas "a" a "f", e 1.5.4.4.6.1 da NR-1 / Guia Oficial MTE 2026, Cap. 11.7).
 */
export function evaluateMteReviewTriggers(params: {
  readonly hasValidSgsstIso45001Certification: boolean;
  readonly activeTriggers: readonly MteImmediateReviewTriggerCode[];
}): MteReviewScheduleEvaluation {
  const periodicReviewYears = params.hasValidSgsstIso45001Certification ? 3 : 2;
  const immediateReviewRequired = params.activeTriggers.length > 0;
  const workerCipaTriggered = params.activeTriggers.includes(
    "f_worker_or_cipa_justified_request",
  );

  return {
    periodicReviewYears,
    immediateReviewRequired,
    activeImmediateTriggers: params.activeTriggers,
    legalBasisClause: immediateReviewRequired
      ? "NR-1 subitem 1.5.4.4.6 (alíneas a–f: revisão imediata obrigatória)"
      : params.hasValidSgsstIso45001Certification
        ? "NR-1 subitem 1.5.4.4.6.1 (revisão periódica em até 3 anos com certificação SGSST)"
        : "NR-1 subitem 1.5.4.4.6 (revisão periódica em até 2 anos)",
    workerCipaTriggered,
  };
}

/**
 * Executa a avaliação sistêmica combinada entre os 12 requisitos mandatórios do Guia Oficial MTE 2026
 * e a estrutura oficial da Versão Curta (41 questões / 26 subescalas / tercis 2,33 e 3,66) do Manual COPSOQ II Portugal 2013.
 */
export function evaluateMteCopsoqSystemicAudit(
  requirements: readonly Mte2026AuditRequirementItem[],
  copsoqFindings: readonly CopsoqManualAuditFinding[],
  sampleAnswers?: Readonly<Record<string, number>>,
): {
  readonly summary: MteCopsoqSystemicAuditSummary;
  readonly sampleSubscaleResults: readonly CopsoqOfficialSubscaleResult[];
} {
  const mteTotalRequirements = requirements.length;
  const mteCompliantCount = requirements.filter(
    (r) =>
      r.status === "implemented_compliant" || r.status === "remediated_in_wave",
  ).length;
  const mteCompliancePct =
    mteTotalRequirements === 0
      ? 0
      : Math.round((mteCompliantCount / mteTotalRequirements) * 100);

  const uniqueSubscalesInItems = new Set(
    copsoqItems.map((item) => item.officialSubscaleId),
  );
  const uniqueMainDimensions = new Set(
    COPSOQ_OFFICIAL_SHORT_SUBSCALES.map((s) => s.mainDimensionId),
  );

  const copsoqAllItemsMappedTo26Subscales =
    copsoqItems.length === 41 &&
    COPSOQ_OFFICIAL_SHORT_SUBSCALES.length === 26 &&
    uniqueSubscalesInItems.size === 26 &&
    uniqueMainDimensions.size === 8;

  const copsoqZeroHallucinationCompliant =
    copsoqAllItemsMappedTo26Subscales &&
    copsoqFindings.every((finding) => finding.compliant);

  const defaultSyntheticAnswers: Record<string, number> = {};
  for (const item of copsoqItems) {
    defaultSyntheticAnswers[item.id] = item.polarity === "protective" ? 4 : 2;
  }
  // Insere sinais sintéticos controlados em sobrecarga (I1, I2 = 4) e ritmo (I3 = 4) para demonstrar tercil vermelho (> 3,66)
  defaultSyntheticAnswers.I1 = 4;
  defaultSyntheticAnswers.I2 = 4;
  defaultSyntheticAnswers.I3 = 4;
  defaultSyntheticAnswers.I4 = 3;
  defaultSyntheticAnswers.I5 = 3;

  const sampleSubscaleResults = computeOfficialShortSubscales(
    sampleAnswers ?? defaultSyntheticAnswers,
  );

  return {
    summary: {
      auditId: "audit-mte2026-copsoq2013-v1",
      mteTotalRequirements,
      mteCompliantCount,
      mteCompliancePct,
      copsoqTotalItems: copsoqItems.length,
      copsoqTotalSubscales: COPSOQ_OFFICIAL_SHORT_SUBSCALES.length,
      copsoqMainDimensionsCount: uniqueMainDimensions.size,
      copsoqTertileCutoffs: [
        COPSOQ_TERTILE_LOW_CUTOFF,
        COPSOQ_TERTILE_HIGH_CUTOFF,
      ],
      copsoqAllItemsMappedTo26Subscales,
      copsoqZeroHallucinationCompliant,
      minimumPgrDocumentsCount: 3,
      realDataAllowed: false,
      g1Approved: false,
    },
    sampleSubscaleResults,
  };
}

/**
 * Cap. 6 do Manual Oficial MTE 2026 (Figura 7, p. 23, itens 1.5.3.3 e 1.5.5.1.3):
 * Os 4 Momentos Essenciais de Participação dos Trabalhadores ("especialistas do saber-fazer")
 * e Consulta à CIPA + Comunicação em Via de Mão Dupla.
 */
export type MteCipaParticipationMomentId =
  | "m1_hazard_identification"
  | "m2_risk_evaluation"
  | "m3_prevention_measures_adoption"
  | "m4_follow_up_and_cipa_feedback";

export interface MteCipaFourMomentsInput {
  readonly completedMoments: readonly MteCipaParticipationMomentId[];
  readonly basicGroNotionsProvidedToWorkers: boolean;
  readonly twoWayCommunicationChannelActive: boolean;
  readonly cipaFormallyConsulted: boolean;
  readonly cipaOrWorkerJustifiedReviewRequested: boolean;
  readonly cipaRequestJustificationNote?: string;
}

export interface MteCipaFourMomentsEvaluation {
  readonly allFourMomentsCompleted: boolean;
  readonly completionPct: number;
  readonly compliantWithCap6: boolean;
  readonly triggersImmediateReview15446f: boolean;
  readonly legalBasis: string;
  readonly missingSteps: readonly string[];
}

export function evaluateMteCipaFourMomentsProtocol(
  input: MteCipaFourMomentsInput,
): MteCipaFourMomentsEvaluation {
  const requiredMoments: readonly MteCipaParticipationMomentId[] = [
    "m1_hazard_identification",
    "m2_risk_evaluation",
    "m3_prevention_measures_adoption",
    "m4_follow_up_and_cipa_feedback",
  ];
  const uniqueCompleted = new Set(
    input.completedMoments.filter((m) => requiredMoments.includes(m)),
  );
  const allFourMomentsCompleted = uniqueCompleted.size === 4;
  const completionPct = Math.round((uniqueCompleted.size / 4) * 100);

  const missingSteps: string[] = [];
  if (!input.basicGroNotionsProvidedToWorkers) {
    missingSteps.push(
      "Fornecer noções básicas do GRO aos trabalhadores para qualificar a participação (Cap. 6.1, p. 22).",
    );
  }
  if (!allFourMomentsCompleted) {
    missingSteps.push(
      "Completar os 4 momentos essenciais de percepção e consulta aos trabalhadores (Figura 7, p. 23).",
    );
  }
  if (!input.cipaFormallyConsulted) {
    missingSteps.push(
      "Registrar consulta formal à CIPA (Comissão Interna de Prevenção de Acidentes e de Assédio — item 1.5.3.3 'a').",
    );
  }
  if (!input.twoWayCommunicationChannelActive) {
    missingSteps.push(
      "Garantir comunicação em via de mão dupla sobre riscos consolidados no inventário e medidas do plano de ação (itens 1.5.3.3 'b' e 1.5.5.1.3).",
    );
  }

  const triggersImmediateReview15446f =
    input.cipaOrWorkerJustifiedReviewRequested &&
    Boolean(input.cipaRequestJustificationNote?.trim());

  return {
    allFourMomentsCompleted,
    completionPct,
    compliantWithCap6: missingSteps.length === 0,
    triggersImmediateReview15446f,
    legalBasis:
      "NR-1 subitens 1.5.3.3 ('a' e 'b'), 1.5.5.1.3 e 1.5.4.4.6 'f' · Manual Oficial MTE 2026 Cap. 6 (p. 22–25)",
    missingSteps,
  };
}

/**
 * Cap. 12.2 do Manual Oficial MTE 2026 (p. 78, subitem 1.5.5.3.2 "a" a "d"):
 * As 5 Perguntas-Chave de Acompanhamento e Eficácia das Medidas de Prevenção.
 */
export interface MteControlFiveQuestionsInput {
  readonly q1Executed: boolean;
  readonly q2ExecutedOnTime: boolean;
  readonly q3ExecutedAsPlanned: boolean;
  readonly q4MaintainedOverTime: boolean;
  readonly q5ProducingExpectedEffect: boolean;
}

export interface MteControlFiveQuestionsEvaluation {
  readonly positiveAnswersCount: number;
  readonly efficacyScorePct: number;
  readonly triggersResidualRiskReview15446a: boolean;
  readonly triggersInadequacyReview15446c: boolean;
  readonly recommendationPt: string;
}

export function evaluateMteControlFollowUpFiveQuestions(
  input: MteControlFiveQuestionsInput,
): MteControlFiveQuestionsEvaluation {
  const answers = [
    input.q1Executed,
    input.q2ExecutedOnTime,
    input.q3ExecutedAsPlanned,
    input.q4MaintainedOverTime,
    input.q5ProducingExpectedEffect,
  ];
  const positiveAnswersCount = answers.filter(Boolean).length;
  const efficacyScorePct = Math.round((positiveAnswersCount / 5) * 100);

  // Alínea "a" do 1.5.4.4.6: após implementação da medida, avaliar risco residual
  const triggersResidualRiskReview15446a =
    input.q1Executed && input.q3ExecutedAsPlanned;

  // Alínea "c" do 1.5.4.4.6: quando constatada inadequação ou ineficácia da medida
  const triggersInadequacyReview15446c =
    input.q1Executed && (!input.q4MaintainedOverTime || !input.q5ProducingExpectedEffect);

  let recommendationPt =
    "Ação plenamente eficaz e mantida ao longo do tempo (5/5). Consolidar avaliação do risco residual no Inventário de Riscos (1.5.4.4.6 'a').";
  if (!input.q1Executed) {
    recommendationPt =
      "Ação ainda não executada. Priorizar implementação conforme cronograma do Plano de Ação (1.5.5.2).";
  } else if (triggersInadequacyReview15446c) {
    recommendationPt =
      "Alerta MTE Cap. 12.2 (p. 78): medida executada, mas sem manutenção ou sem efeito esperado. Acionar gatilho 1.5.4.4.6 'c' para corrigir ou complementar controle.";
  } else if (!input.q2ExecutedOnTime || !input.q3ExecutedAsPlanned) {
    recommendationPt =
      "Medida executada com desvio de prazo ou planejamento. Validar aderência operacional junto ao responsável e à CIPA.";
  }

  return {
    positiveAnswersCount,
    efficacyScorePct,
    triggersResidualRiskReview15446a,
    triggersInadequacyReview15446c,
    recommendationPt,
  };
}

/**
 * Cap. 5.3 (1.5.3.5), Cap. 10.5 (1.5.4.3.2, p. 48–50) e Cap. 15 (1.5.8) do Manual Oficial MTE 2026:
 * Avaliação de Perigos Externos Previsíveis e Atuação Simultânea / Compartilhada com Contratadas.
 */
export interface MteExternalAndSharedHazardsInput {
  readonly hasExternalPublicInteractionHazard: boolean;
  readonly hasExternalMobilityOrFieldHazard: boolean;
  readonly hasRemoteOrHybridErgonomicPsychosocialHazard: boolean;
  readonly hasSharedSiteWithContractors: boolean;
  readonly contractorPgrIntegrated: boolean;
}

export interface MteExternalAndSharedHazardsEvaluation {
  readonly externalHazardsIdentifiedCount: number;
  readonly requiresExternalRiskInclusionInInventory: boolean;
  readonly sharedSiteCompliant: boolean;
  readonly normativeAlertPt: string;
}

export function evaluateMteExternalAndSharedSiteHazards(
  input: MteExternalAndSharedHazardsInput,
): MteExternalAndSharedHazardsEvaluation {
  const externalFlags = [
    input.hasExternalPublicInteractionHazard,
    input.hasExternalMobilityOrFieldHazard,
    input.hasRemoteOrHybridErgonomicPsychosocialHazard,
  ];
  const externalHazardsIdentifiedCount = externalFlags.filter(Boolean).length;
  const requiresExternalRiskInclusionInInventory =
    externalHazardsIdentifiedCount > 0;

  const sharedSiteCompliant =
    !input.hasSharedSiteWithContractors || input.contractorPgrIntegrated;

  const alerts: string[] = [];
  if (requiresExternalRiskInclusionInInventory) {
    alerts.push(
      `Identificado(s) ${externalHazardsIdentifiedCount} fator(es) de perigo externo previsível (NR-1 item 1.5.4.3.2 · Cap. 10.5, p. 48): incluir no Inventário de Riscos e definir medidas de proteção ao alcance da organização.`,
    );
  }
  if (!sharedSiteCompliant) {
    alerts.push(
      "Atuação simultânea com contratadas detectada sem integração documental (NR-1 itens 1.5.3.5 e 1.5.8 · Cap. 5.3 e 15): alinhar mecanismos de cooperação e intercâmbio de PGR.",
    );
  }
  if (alerts.length === 0) {
    alerts.push(
      "Perigos externos (1.5.4.3.2) e atuação compartilhada com contratadas (1.5.3.5 / 1.5.8) devidamente verificados e alinhados ao GRO.",
    );
  }

  return {
    externalHazardsIdentifiedCount,
    requiresExternalRiskInclusionInInventory,
    sharedSiteCompliant,
    normativeAlertPt: alerts.join(" "),
  };
}

/**
 * Cap. 12.3 (p. 81–82, item 1.5.5.1.1 "c") e Cap. 13 (Quadro 1, p. 15) do Manual Oficial MTE 2026:
 * Gera a Ponte Estruturada PGR <-> PCMSO (NR-7) e o 3º Documento Mínimo Obrigatório do PGR
 * (Documento sobre Critérios Utilizados no GRO/PGR — item 1.5.4.4.2.2).
 */
export function buildMtePgrThirdMandatoryCriteriaDocumentMarkdown(params: {
  readonly orgName: string;
  readonly cycleName: string;
  readonly hasIso45001Certification: boolean;
  readonly kMin?: number;
}): string {
  const kMin = params.kMin ?? 5;
  const periodicYears = params.hasIso45001Certification ? 3 : 2;
  return [
    `# 3º DOCUMENTO MÍNIMO OBRIGATÓRIO DO PGR: CRITÉRIOS UTILIZADOS NO GRO/PGR`,
    `**Organização:** ${params.orgName} · **Ciclo de Referência:** ${params.cycleName}`,
    `**Base Legal:** NR-1 subitem 1.5.4.4.2.2 · Quadro 1 (p. 15) e Capítulo 13 (p. 95) do Manual Oficial MTE 2026 (Portarias MTE nº 1.419/2024 e nº 765/2025).`,
    ``,
    `## 1. Critérios de Gradação da Severidade (NR-1 subitem 1.5.4.4.4 e Regra de Ouro 1.5.4.4.4.1)`,
    `- Escala de 5 níveis (1 = Leve/Reversível a 5 = Crítica/Incapacitante ou Afastamento Prolongado).`,
    `- **Regra de Ouro (1.5.4.4.4.1 / Manual MTE p. 53):** Caso várias lesões ou agravos à saúde sejam possíveis para um mesmo perigo, seleciona-se obrigatoriamente a consequência de **maior magnitude** (pior cenário plausível).`,
    ``,
    `## 2. Critérios de Gradação da Probabilidade e Trava Legal (NR-1 subitens 1.5.4.4.5.1 e 1.5.4.4.5.3)`,
    `- Escala de 5 níveis (1 = Muito Improvável a 5 = Muito Provável / Esperada).`,
    `- **Trava Legal Obrigatória (1.5.4.4.5.1 / Manual MTE p. 54):** Quando um requisito específico obrigatório previsto em Norma Regulamentadora não for cumprido, a probabilidade é fixada automaticamente na **mais alta gradação prevista no PGR (Nível 5)**.`,
    `- **Fatores Ergonômicos e Psicossociais (1.5.4.4.5.3 / NR-17):** Combina duração da exposição + intensidade das exigências da atividade (rastreio coletivo COPSOQ II em tercis oficiais $\\le 2,33$ favorável, $2,33–3,66$ intermediário, $> 3,66$ crítico + Avaliação Ergonômica Preliminar AEP/AET) modulada pela eficácia comprovada das medidas na hierarquia legal (1.5.5.1.2).`,
    `- **Proteção de Privacidade Coletiva (LGPD & Ética SST):** Resultados consolidados por Grupo de Exposição Similar (GES/GHE) somente com amostra mínima $k \\ge ${kMin}$ respondentes.`,
    ``,
    `## 3. Matriz Comum de Classificação de Risco e Critérios de Tomada de Decisão (ISO 45002:2023 / Manual MTE p. 68–70)`,
    `| Escore ($S \\times P$) | Nível de Risco | Prioridade | Prazo Máximo | Critério de Tomada de Decisão e Tolerabilidade |`,
    `| :--- | :--- | :--- | :--- | :--- |`,
    `| **1 a 3** | **BAIXO (Tolerável)** | Baixa | Até 12 meses | Manter monitoramento periódico para assegurar que os controles existentes sejam mantidos (risco tolerável não é risco zero). |`,
    `| **4 a 7** | **MÉDIO (Moderado)** | Moderada | < 9 meses | Adotar medidas preventivas organizacionais e reavaliar controles existentes (acionar AET NR-17 item 17.3.2 quando aplicável). |`,
    `| **8 a 14** | **ALTO (Substancial)** | Alta | < 3 meses | Tomar ações urgentes de redução do risco priorizando eliminação na fonte, proteção coletiva e redesenho da organização do trabalho. |`,
    `| **15 a 25** (ou $S=5, P\\ge 3$) | **MUITO ALTO (Intolerável)** | Altíssima | **IMEDIATO** | O trabalho sob essa condição deve sofrer contenção imediata até redução do risco por medidas coletivas/administrativas. |`,
    ``,
    `## 4. Periodicidade de Revisão e Gatilhos Imediatos (NR-1 subitens 1.5.4.4.6 e 1.5.4.4.6.1)`,
    `- **Revisão Periódica Máxima:** A cada **${periodicYears} anos** (${params.hasIso45001Certification ? "com certificação SGSST ISO 45001 válida" : "regra geral bienal"}).`,
    `- **6 Gatilhos Obrigatórios de Revisão Imediata (1.5.4.4.6 alíneas 'a' a 'f'):** (a) pós-implementação de medida (avaliação do risco residual); (b) inovações e modificações; (c) inadequação ou ineficácia de medidas; (d) acidentes ou doenças relacionadas ao trabalho; (e) mudança nos requisitos legais; (f) solicitação justificada dos trabalhadores ou da CIPA.`,
    ``,
    `> *Nota de Governança (Manual MTE Cap. 8.2 Passo 4, p. 34): A responsabilidade final pelo GRO/PGR é interna da organização. Este documento de critérios deve ser validado e assinado pelo Responsável Técnico / SESMT designado.*`,
  ].join("\n");
}

export function buildMtePgrToPcmsoBridgeMarkdown(params: {
  readonly orgName: string;
  readonly cycleName: string;
  readonly responseCount: number;
  readonly kMin?: number;
  readonly highRiskDimensions: readonly {
    readonly dimensionLabel: string;
    readonly riskLevel: number;
  }[];
}): string {
  const kMin = params.kMin ?? 5;
  const kMet = params.responseCount >= kMin;
  const dimLines =
    kMet && params.highRiskDimensions.length > 0
      ? params.highRiskDimensions.map(
          (d, idx) =>
            `${idx + 1}. **${d.dimensionLabel}** — Nível de Risco Consolidado: **${d.riskLevel}** (requer vigilância epidemiológica coletiva no PCMSO/NR-7 e verificação de possíveis agravos ocupacionais conforme item 1.5.5.5).`,
        )
      : [
          "- Nenhuma dimensão crítica acima do limiar ou amostra ainda em consolidação ($n < k$). Manter vigilância clínica preventiva habitual da NR-7.",
        ];

  return [
    `# PONTE TÉCNICA PGR ↔ PCMSO (NR-1 subitem 1.5.5.1.1 "c" e NR-7)`,
    `**Organização:** ${params.orgName} · **Ciclo:** ${params.cycleName}`,
    `**Destinatário:** Médico(a) do Trabalho Responsável pelo PCMSO (NR-7) e Equipe SESMT`,
    `**Base Normativa:** Manual Oficial MTE 2026 Cap. 12.3 (p. 81–82) e Cap. 12.4 (p. 83–86).`,
    ``,
    `## 1. Finalidade Regulatória (Integração GRO/PGR e Controle Médico NR-7)`,
    `Conforme o Capítulo 12.3 do Manual Oficial MTE 2026, o Inventário de Riscos do PGR deve subsidiar o planejamento do **Programa de Controle Médico de Saúde Ocupacional (PCMSO — NR-7)**, enquanto os achados epidemiológicos do controle médico devem retroalimentar a revisão de riscos do GRO (gatilho obrigatório 1.5.4.4.6 "d"), preservando integralmente o sigilo médico individual e o k-anonimato ($k \\ge ${kMin}$).`,
    ``,
    `## 2. Fatores de Risco Psicossociais e Ergonômicos Priorizados no PGR (Amostra: $n = ${params.responseCount}$)`,
    ...dimLines,
    ``,
    `## 3. Recomendações de Articulação Bidirecional PGR ↔ PCMSO`,
    `1. **Vigilância Passiva e Ativa (NR-7):** Considerar as dimensões psicossociais e de organização do trabalho acima nos exames clínicos ocupacionais e na leitura epidemiológica coletiva de afastamentos, queixas e sintomas.`,
    `2. **Retroalimentação ao GRO (Gatilho 1.5.4.4.6 "d"):** Caso o PCMSO identifique nexo ou cluster coletivo de adoecimento relacionado ao trabalho em determinado GES/GHE, acionar imediatamente a revisão da avaliação de risco e do Plano de Ação do PGR.`,
    `3. **Vedação de Medicalização Individual Isolada:** O controle médico acompanha a saúde dos trabalhadores, mas não substitui as medidas coletivas e de organização do trabalho na fonte (NR-1 item 1.5.5.1.2).`,
  ].join("\n");
}

