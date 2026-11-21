import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/router/compat";
import AccountableNominationPackCard from "@/components/governance/AccountableNominationPackCard";
import ExternalAudiencePackCard from "@/components/governance/ExternalAudiencePackCard";
import ExternalReadinessClosureBoard from "@/components/governance/ExternalReadinessClosureBoard";
import ExternalSessionDecisionCard from "@/components/governance/ExternalSessionDecisionCard";
import FacilitatorRehearsalCard from "@/components/governance/FacilitatorRehearsalCard";
import PaidAdvisoryAuthorizationCard from "@/components/governance/PaidAdvisoryAuthorizationCard";
import PaidAdvisoryLaunchRehearsalCard from "@/components/governance/PaidAdvisoryLaunchRehearsalCard";
import ReleaseCandidateCharterCard from "@/components/governance/ReleaseCandidateCharterCard";
import ReleaseProofPacketCard from "@/components/governance/ReleaseProofPacketCard";
import { Badge } from "@/components/ui/badge";
import { g1AccountableNominationPackSummary } from "@/data/g1AccountableNominationPack";
import { g1CommercialAuthorizationSummary } from "@/data/commercialAuthorization";
import { g1ExternalAudiencePack } from "@/data/g1ExternalAudiencePack";
import { g1ExternalReadinessWorkspace } from "@/data/g1ExternalReadinessWorkspace";
import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";
import { g1ReleaseCandidateCharterSummary } from "@/data/g1ReleaseCandidateCharter";
import { g1ReleaseProofPacketSummary } from "@/data/g1ReleaseProofPacket";
import { g1ReleaseEvidenceManifest } from "@/data/g1ReleaseEvidenceManifest";
import { g1ReleaseReviewPlanSummary } from "@/data/g1ReleaseReviewPlan";

export default function ExternalReadinessWorkspacePage() {
  const {
    externalAudiencePack,
    externalReadinessClosure,
    externalSessionDecision,
  } = g1ExternalReadinessWorkspace;
  const approved = externalSessionDecision.canRunExternalSyntheticSession;
  const reviewReady = externalSessionDecision.canRequestFormalReview && !approved;

  return (
    <div className="space-y-6">
      <Link
        to="/app/governance"
        className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para Governança
      </Link>

      <header className="space-y-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Gate G1 · ambiente sintético</p>
              <h1 className="text-2xl font-semibold text-foreground">Workspace de prontidão externa</h1>
            </div>
          </div>
          <Badge variant={approved ? "default" : reviewReady ? "secondary" : "destructive"}>
            {approved ? "Sessão sintética aprovada" : reviewReady ? "Pronto para revisão formal" : "No-Go externo"}
          </Badge>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Ambiente interno para conferir o critical path, ensaiar a narrativa e treinar condutas seguras. Este workspace não agenda audiência, não registra aprovação e não libera dados reais.
        </p>
      </header>

      <ExternalSessionDecisionCard summary={externalSessionDecision} />
      <ExternalReadinessClosureBoard summary={externalReadinessClosure} />
      <PaidAdvisoryAuthorizationCard
        summary={g1PaidAdvisoryAuthorizationSummary}
        commercialAuthorization={g1CommercialAuthorizationSummary}
      />
      <PaidAdvisoryLaunchRehearsalCard
        authorization={g1PaidAdvisoryAuthorizationSummary}
        commercialAuthorization={g1CommercialAuthorizationSummary}
      />
      <AccountableNominationPackCard summary={g1AccountableNominationPackSummary} />
      <ReleaseCandidateCharterCard
        summary={g1ReleaseCandidateCharterSummary}
        reviewPlan={g1ReleaseReviewPlanSummary}
      />
      <ReleaseProofPacketCard summary={g1ReleaseProofPacketSummary} evidence={g1ReleaseEvidenceManifest} />
      <ExternalAudiencePackCard pack={g1ExternalAudiencePack} summary={externalAudiencePack} />
      <FacilitatorRehearsalCard audiencePack={externalAudiencePack} />
    </div>
  );
}
