export type OrdinalLevel = 1 | 2 | 3 | 4 | 5;
export type EvidenceConfidence = "insufficient" | "low" | "moderate" | "high";

// Hierarquia de prevencao (NR-1, subitem 1.5.5.1.2): evitar/eliminar >
// substituir > protecao coletiva (engenharia) > administrativa > EPI.
// EPI e ultima medida; controles administrativos/EPI tem reducao limitada.
export type PreventionTier =
  | "elimination"
  | "substitution"
  | "engineering_collective"
  | "administrative"
  | "ppe";

export type ControlEvidence = {
  implemented: boolean;
  maintained: boolean;
  effectiveness: OrdinalLevel | null;
  confidence: EvidenceConfidence;
  evidenceRef: string | null;
  hierarchyTier?: PreventionTier; // ausente = sem limite de hierarquia (retrocompat)
};

export type CriteriaConfig = {
  version: string;
  status: "draft" | "review" | "approved" | "retired";
  severityAggregation: "maximum";
  probabilityAggregation: "rounded_mean";
  minimumControlConfidence: EvidenceConfidence;
  effectivenessReductionSteps: Record<OrdinalLevel, number>;
  riskBands: Array<{ max: number; key: string }>;
  // Novos (opcionais, com defaults): probabilidade forcada quando requisito de NR
  // nao e atendido, e teto de reducao por camada de hierarquia de prevencao.
  regulatoryNonComplianceProbability?: OrdinalLevel;
  hierarchyReductionCap?: Record<PreventionTier, number>;
};

export type RegulatoryComplianceInput = {
  mandatoryRequirementUnmet: boolean;
  requirementRef: string | null;
};

export type ContextualRiskInput = {
  riskType?: string; // rotulo para integracao (ex.: "psicossocial", "fisico")
  severity: {
    credibleConsequence: OrdinalLevel;
    reversibility: OrdinalLevel;
    incapacityPotential: OrdinalLevel;
    vulnerabilityAggravation: OrdinalLevel;
    additionalConsequences?: OrdinalLevel[]; // consequencias possiveis extras (pior caso)
    justification: string;
    sourceRef: string;
  };
  exposure: {
    intensity: OrdinalLevel;
    duration: OrdinalLevel;
    frequency: OrdinalLevel;
    breadth: OrdinalLevel;
    collectiveSignal?: OrdinalLevel;
    historyIndicator?: OrdinalLevel;
    justification: string;
    sourceRef: string;
  };
  controls: ControlEvidence[];
  regulatory?: RegulatoryComplianceInput;
};

export type ContextualRiskOutput = {
  riskType: string | null;
  severity: OrdinalLevel;
  grossProbability: OrdinalLevel;
  grossRisk: number;
  residualProbability: OrdinalLevel;
  residualRisk: number;
  riskBand: string;
  controlReductionApplied: number;
  regulatoryOverrideApplied: boolean;
  formulaVersion: string;
};

const confidenceRank: Record<EvidenceConfidence, number> = { insufficient: 0, low: 1, moderate: 2, high: 3 };
const clamp = (value: number) => Math.min(5, Math.max(1, value)) as OrdinalLevel;
const roundedMean = (values: OrdinalLevel[]) =>
  clamp(Math.round(values.reduce((a, b) => a + b, 0) / values.length));

export function evaluateContextualRisk(input: ContextualRiskInput, config: CriteriaConfig): ContextualRiskOutput {
  if (config.status !== "approved") throw new Error("criteria_version_not_approved");
  if (!input.severity.justification.trim() || !input.severity.sourceRef.trim()) throw new Error("severity_context_missing");
  if (!input.exposure.justification.trim() || !input.exposure.sourceRef.trim()) throw new Error("exposure_context_missing");

  // Severidade pelo pior cenario (NR-1 1.5.4.4.4.1): maxima entre dimensoes e
  // entre todas as consequencias possiveis declaradas.
  const severity = Math.max(
    input.severity.credibleConsequence,
    input.severity.reversibility,
    input.severity.incapacityPotential,
    input.severity.vulnerabilityAggravation,
    ...(input.severity.additionalConsequences ?? []),
  ) as OrdinalLevel;

  const exposureValues: OrdinalLevel[] = [
    input.exposure.intensity,
    input.exposure.duration,
    input.exposure.frequency,
    input.exposure.breadth,
  ];
  if (input.exposure.collectiveSignal) exposureValues.push(input.exposure.collectiveSignal);
  if (input.exposure.historyIndicator) exposureValues.push(input.exposure.historyIndicator);
  const exposureProbability = roundedMean(exposureValues);

  // Requisito de NR nao atendido (1.5.4.4.5.1): probabilidade na gradacao maxima
  // do PGR; controles NAO reduzem enquanto o requisito obrigatorio nao for cumprido.
  const regulatoryOverrideApplied = Boolean(input.regulatory?.mandatoryRequirementUnmet);
  const grossProbability: OrdinalLevel = regulatoryOverrideApplied
    ? (config.regulatoryNonComplianceProbability ?? 5)
    : exposureProbability;

  const reduction = regulatoryOverrideApplied ? 0 : controlReduction(input.controls, config);
  const residualProbability = clamp(grossProbability - reduction);
  const residualRisk = severity * residualProbability;
  const band = config.riskBands.find((item) => residualRisk <= item.max)?.key ?? "unclassified";

  return {
    riskType: input.riskType ?? null,
    severity,
    grossProbability,
    grossRisk: severity * grossProbability,
    residualProbability,
    residualRisk,
    riskBand: band,
    controlReductionApplied: reduction,
    regulatoryOverrideApplied,
    formulaVersion: config.version,
  };
}

function controlReduction(controls: ControlEvidence[], config: CriteriaConfig): number {
  const eligible = controls.filter(
    (control) =>
      control.implemented &&
      control.maintained &&
      control.effectiveness !== null &&
      Boolean(control.evidenceRef?.trim()) &&
      confidenceRank[control.confidence] >= confidenceRank[config.minimumControlConfidence],
  );
  if (eligible.length === 0) return 0;
  return Math.max(
    ...eligible.map((control) => {
      const step = config.effectivenessReductionSteps[control.effectiveness!] ?? 0;
      // Teto por hierarquia de prevencao: EPI/administrativa reduzem menos.
      const cap =
        control.hierarchyTier && config.hierarchyReductionCap
          ? config.hierarchyReductionCap[control.hierarchyTier]
          : Number.POSITIVE_INFINITY;
      return Math.min(step, cap);
    }),
  );
}

export function validateCriteriaConfig(config: CriteriaConfig): string[] {
  const blockers: string[] = [];
  if (config.status !== "approved") blockers.push("criteria_not_approved");
  if (!config.version.trim()) blockers.push("criteria_version_missing");
  if (
    config.riskBands.length === 0 ||
    config.riskBands.some((item, index) => item.max < 1 || (index > 0 && item.max <= config.riskBands[index - 1].max))
  ) {
    blockers.push("risk_bands_invalid");
  }
  if (config.riskBands.at(-1)?.max !== 25) blockers.push("risk_bands_do_not_cover_matrix");
  if (
    config.regulatoryNonComplianceProbability !== undefined &&
    (config.regulatoryNonComplianceProbability < 1 || config.regulatoryNonComplianceProbability > 5)
  ) {
    blockers.push("regulatory_probability_invalid");
  }
  if (
    config.hierarchyReductionCap &&
    Object.values(config.hierarchyReductionCap).some((value) => value < 0)
  ) {
    blockers.push("hierarchy_cap_invalid");
  }
  return blockers;
}
