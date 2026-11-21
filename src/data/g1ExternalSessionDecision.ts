import type { DemoRehearsalSummary } from "@/lib/governance/demoRehearsal";
import type {
  ExternalSessionDecisionContext,
  ExternalSessionDecisionPolicy,
  ExternalSessionEvidenceInput,
  ExternalSessionEvidenceStatus,
} from "@/lib/governance/externalSessionDecision";
import type { FormalAcceptanceSummary } from "@/lib/governance/formalAcceptance";
import type { PublicDemoReadinessSummary } from "@/lib/governance/publicDemoReadiness";
import type { ResidualRiskSummary } from "@/lib/governance/residualRiskRegister";
import type { PublishedBaselineSummary } from "@/lib/release/syncReadiness";

export const g1ExternalSessionDecisionPolicy: ExternalSessionDecisionPolicy = Object.freeze({
  policyId: "g1-external-session-decision-2026-07-14",
  targetGate: "G1",
  allowedScope: "external_synthetic_session_only",
  requiredDimensions: ["runtime", "guided_session", "narrative", "release", "accountability", "residual_risk"] as const,
  requireFormalApproval: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
});

export const g1ExternalSessionDecisionContext: ExternalSessionDecisionContext = Object.freeze({
  realDataEnabled: false,
  gateAdvanceClaimed: false,
  formalDecision: "pending",
  formalDecisionEvidenceRef: null,
});

export type G1ExternalSessionSources = {
  demoRehearsal: DemoRehearsalSummary;
  publicDemo: PublicDemoReadinessSummary;
  publishedBaseline: PublishedBaselineSummary;
  formalAcceptance: FormalAcceptanceSummary;
  residualRisk: ResidualRiskSummary;
};

export function buildG1ExternalSessionEvidence(sources: G1ExternalSessionSources): ExternalSessionEvidenceInput[] {
  const narrativeKeys = new Set(["public_claims_guardrail", "audience_limits", "external_script_approved"]);
  const narrativeItems = sources.publicDemo.items.filter((item) => narrativeKeys.has(item.key));

  return [
    {
      key: "safe_runtime",
      label: "Runtime e claims em modo seguro",
      dimension: "runtime",
      status: statusFrom(sources.publicDemo.canRunPrivateSyntheticWalkthrough),
      evidenceRef: "docs/G0_EXECUTION_RECORD.md",
      detail: "Walkthrough privado sintético está seguro; dados reais e avanço de gate permanecem bloqueados.",
    },
    {
      key: "guided_session",
      label: "Sessão guiada ensaiada",
      dimension: "guided_session",
      status: statusFrom(sources.demoRehearsal.canRunInternalSyntheticDemo),
      evidenceRef: "docs/DESIGN_PARTNER_SESSION_COCKPIT_G1.md",
      detail: "Preflight, cenários, comprovante, feedback, handoff e descarte estão cobertos localmente.",
    },
    {
      key: "external_narrative",
      label: "Narrativa e limites para audiência",
      dimension: "narrative",
      status: aggregateStatus(narrativeItems.map((item) => item.status)),
      evidenceRef: "docs/G1_EXTERNAL_AUDIENCE_PACK.md",
      detail: "Draft estruturado está ensaiável internamente, mas depende de facilitador, accountable, revisões Jurídica/SST e decisão formal.",
    },
    {
      key: "official_release",
      label: "Baseline público atestado",
      dimension: "release",
      status: statusFrom(sources.publishedBaseline.canReviewPublishedBaseline),
      evidenceRef: "docs/GITHUB_LOVABLE_SYNC_HANDOFF.md",
      detail: "Exige CI oficial, branch protection, vínculo do projeto e recibo pontual do baseline publicado; não declara o HEAD atual sincronizado.",
    },
    {
      key: "accountability",
      label: "Accountables e decisões formais",
      dimension: "accountability",
      status: statusFrom(sources.formalAcceptance.canAcceptSyntheticG1),
      evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
      detail: "Nomes, autoridade, substitutos, decisões e eventuais ressalvas precisam estar completos.",
    },
    {
      key: "residual_risk",
      label: "Risco residual apto à revisão",
      dimension: "residual_risk",
      status: statusFrom(sources.residualRisk.canRequestRiskReview),
      evidenceRef: "docs/G1_RESIDUAL_RISK_REGISTER.md",
      detail: "Riscos críticos e bloqueantes exigem owner, mitigação e evidência antes da decisão.",
    },
  ];
}

function statusFrom(ready: boolean): ExternalSessionEvidenceStatus {
  return ready ? "ready" : "blocked";
}

function aggregateStatus(statuses: Array<"ready" | "partial" | "blocked">): ExternalSessionEvidenceStatus {
  if (statuses.length === 0 || statuses.some((status) => status === "blocked")) return "blocked";
  if (statuses.some((status) => status === "partial")) return "partial";
  return "ready";
}
