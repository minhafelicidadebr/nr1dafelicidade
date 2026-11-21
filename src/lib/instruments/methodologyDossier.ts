import type { CanonicalInstrumentIntakeSummary } from "./canonicalIntake";
import type { CanonicalPackageManifestSummary } from "./canonicalPackageManifest";
import type { InstrumentMethodologySummary } from "./methodologyReadiness";

export type MethodologyDossierStage = {
  key: "canonical_intake" | "package_manifest" | "independent_review";
  label: string;
  status: "ready" | "blocked";
  evidence: string;
};

export type MethodologyDossier = {
  targetGate: "G1";
  instrumentKey: string;
  version: string;
  status: "blocked" | "ready_for_independent_review";
  canEnableInstrumentRuntime: false;
  stages: MethodologyDossierStage[];
  readyStages: number;
  nextStep: string;
};

export function evaluateMethodologyDossier(
  intake: CanonicalInstrumentIntakeSummary,
  manifest: CanonicalPackageManifestSummary,
  methodology: InstrumentMethodologySummary,
): MethodologyDossier {
  const stages: MethodologyDossierStage[] = [
    {
      key: "canonical_intake",
      label: "Intake canônico",
      status: intake.canOpenIntakeReview ? "ready" : "blocked",
      evidence: `${intake.reviewSubmitted}/${intake.reviewRequired} artefatos submetidos para revisão`,
    },
    {
      key: "package_manifest",
      label: "Manifesto e integridade",
      status: manifest.canReviewManifest ? "ready" : "blocked",
      evidence: `${manifest.requiredSubmitted}/${manifest.requiredTotal} artefatos obrigatórios com submissão verificável`,
    },
    {
      key: "independent_review",
      label: "Revisão metodológica independente",
      status: methodology.canSubmitForReview ? "ready" : "blocked",
      evidence: `${methodology.gateBlockingApproved}/${methodology.gateBlockingTotal} critérios metodológicos aprovados`,
    },
  ];
  const readyStages = stages.filter((stage) => stage.status === "ready").length;

  return {
    targetGate: "G1",
    instrumentKey: methodology.instrumentKey,
    version: methodology.version,
    status: readyStages === stages.length ? "ready_for_independent_review" : "blocked",
    canEnableInstrumentRuntime: false,
    stages,
    readyStages,
    nextStep: intake.nextStep
      ? `Anexar e atribuir o artefato “${intake.nextStep.label}”.`
      : manifest.nextStep
        ? `Completar o manifesto: ${manifest.nextStep.label}.`
        : methodology.nextStep
          ? `Concluir o critério metodológico: ${methodology.nextStep.label}.`
          : "Registrar revisão independente competente antes de qualquer decisão futura.",
  };
}
