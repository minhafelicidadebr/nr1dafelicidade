import { g1ExternalAudiencePackContext } from "@/data/g1ExternalAudiencePack";
import {
  externalAudiencePackBlockerLabel,
  type ExternalAudiencePackSummary,
} from "@/lib/governance/externalAudiencePack";
import type {
  ExternalReadinessClosureContext,
  ExternalReadinessClosureItemInput,
  ExternalReadinessClosurePolicy,
  ExternalReadinessClosureStatus,
} from "@/lib/governance/externalReadinessClosure";
import type { FormalAcceptanceSummary } from "@/lib/governance/formalAcceptance";
import type { ResidualRiskSummary } from "@/lib/governance/residualRiskRegister";
import type { PublishedBaselineSummary } from "@/lib/release/syncReadiness";

export const g1ExternalReadinessClosurePolicy: ExternalReadinessClosurePolicy = Object.freeze({
  policyId: "g1-external-readiness-closure-2026-07-14",
  targetGate: "G1",
  requiredWorkstreams: ["accountability", "official_release", "narrative_review", "residual_risk"] as const,
  requireOwner: true,
  requireVerifiedEvidence: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
});

export const g1ExternalReadinessClosureContext: ExternalReadinessClosureContext = Object.freeze({
  realDataEnabled: false,
  gateAdvanceClaimed: false,
});

export type G1ExternalReadinessClosureSources = {
  audiencePack: ExternalAudiencePackSummary;
  publishedBaseline: PublishedBaselineSummary;
  formalAcceptance: FormalAcceptanceSummary;
  residualRisk: ResidualRiskSummary;
};

export function buildG1ExternalReadinessClosureItems(
  sources: G1ExternalReadinessClosureSources,
): ExternalReadinessClosureItemInput[] {
  const releaseRisk = sources.residualRisk.risks.find((risk) => risk.key === "github_lovable_proof");
  const requiredRoles = sources.formalAcceptance.roles.filter((role) => role.required);
  const requiredDecisions = sources.formalAcceptance.decisions.filter((decision) => decision.required);
  const gateBlockingRisks = sources.residualRisk.risks.filter((risk) => risk.gateBlocking);

  return [
    {
      key: "accountability",
      label: "Accountables e autoridade de suspensão",
      status: progressStatus(
        sources.formalAcceptance.canAcceptSyntheticG1,
        sources.formalAcceptance.readyRoles + sources.formalAcceptance.readyDecisions,
      ),
      priority: 1,
      ownerRole: "Sponsor + responsáveis técnicos obrigatórios",
      ownerAssigned: requiredRoles.length > 0 && requiredRoles.every((role) => role.named),
      evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
      evidenceVerified: requiredDecisions.length > 0 && requiredDecisions.every((decision) => decision.ready),
      dependencies: [],
      nextAction: sources.formalAcceptance.nextRole
        ? `Nomear ${sources.formalAcceptance.nextRole.label}, registrar autoridade e substituto.`
        : sources.formalAcceptance.nextDecision
          ? `Registrar decisão verificável de ${sources.formalAcceptance.nextDecision.label}.`
          : "Conferir o ledger antes de solicitar revisão formal.",
      detail: `${sources.formalAcceptance.readyRoles}/${sources.formalAcceptance.requiredRoles} papéis e ${sources.formalAcceptance.readyDecisions}/${sources.formalAcceptance.requiredDecisions} decisões estão prontos.`,
    },
    {
      key: "official_release",
      label: "Baseline público atestado e revisão de release",
      status: progressStatus(
        sources.publishedBaseline.canReviewPublishedBaseline,
        sources.publishedBaseline.completed,
      ),
      priority: 2,
      ownerRole: "Segurança/arquitetura + responsável pelo release",
      ownerAssigned: releaseRisk?.ownerAssigned ?? false,
      evidenceRef: "docs/GITHUB_LOVABLE_SYNC_HANDOFF.md",
      evidenceVerified: sources.publishedBaseline.canReviewPublishedBaseline,
      dependencies: [],
      nextAction: sources.publishedBaseline.nextStep,
      detail: `${sources.publishedBaseline.completed}/${sources.publishedBaseline.total} controles do baseline publicado estão comprovados sem alegar sincronização do HEAD atual.`,
    },
    {
      key: "narrative_review",
      label: "Narrativa revisada para audiência sintética",
      status: sources.audiencePack.canUseWithExternalAudience
        ? "ready"
        : sources.audiencePack.canRehearseInternally
          ? "in_progress"
          : "blocked",
      priority: 3,
      ownerRole: "Facilitador + accountable + Jurídico/SST",
      ownerAssigned:
        g1ExternalAudiencePackContext.facilitatorAssigned &&
        g1ExternalAudiencePackContext.accountableOwnerAssigned,
      evidenceRef: "docs/G1_EXTERNAL_AUDIENCE_PACK.md",
      evidenceVerified: sources.audiencePack.canUseWithExternalAudience,
      dependencies: ["accountability"],
      nextAction: sources.audiencePack.nextBlocker
        ? externalAudiencePackBlockerLabel(sources.audiencePack.nextBlocker)
        : "Conferir versão e limites do pacote antes da revisão formal.",
      detail: `${sources.audiencePack.readySections}/${sources.audiencePack.requiredSections} seções e ${sources.audiencePack.declaredBoundaries}/${sources.audiencePack.requiredBoundaries} limites estão estruturados.`,
    },
    {
      key: "residual_risk",
      label: "Risco residual apto à revisão",
      status: progressStatus(sources.residualRisk.canRequestRiskReview, sources.residualRisk.ready),
      priority: 4,
      ownerRole: "Owners dos riscos + sponsor do gate",
      ownerAssigned: gateBlockingRisks.length > 0 && gateBlockingRisks.every((risk) => risk.ownerAssigned),
      evidenceRef: "docs/G1_RESIDUAL_RISK_REGISTER.md",
      evidenceVerified: sources.residualRisk.canRequestRiskReview,
      dependencies: ["accountability", "official_release"],
      nextAction: sources.residualRisk.nextStep?.nextAction ?? "Submeter o registro residual à revisão competente.",
      detail: `${sources.residualRisk.ready}/${sources.residualRisk.total} riscos estão controlados; ${sources.residualRisk.gateBlockingOpen} bloqueantes seguem abertos.`,
    },
  ];
}

function progressStatus(ready: boolean, completed: number): ExternalReadinessClosureStatus {
  if (ready) return "ready";
  return completed > 0 ? "in_progress" : "blocked";
}
