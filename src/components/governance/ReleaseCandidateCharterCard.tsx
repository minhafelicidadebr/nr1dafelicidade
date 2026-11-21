import { CheckCircle2, FileCheck2, GitBranch, Layers3, LockKeyhole, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  releaseCandidatePromotionBlockerLabel,
  type ReleaseCandidateCharterSummary,
  type ReleaseCandidateRisk,
} from "@/lib/release/releaseCandidateCharter";
import type { ReleaseReviewPlanSummary } from "@/lib/release/releaseReviewPlan";

export default function ReleaseCandidateCharterCard({
  summary,
  reviewPlan,
}: {
  summary: ReleaseCandidateCharterSummary;
  reviewPlan: ReleaseReviewPlanSummary;
}) {
  return (
    <Card className="border-violet-400/25 bg-violet-400/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-violet-300" aria-hidden="true" />
            Carta do candidato de release
          </span>
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/15 text-amber-300">
            Escopo revisável · promoção bloqueada
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Inventário local que agrupa a onda em resultados revisáveis. Estar pronto para revisão de escopo não autoriza commit, push, PR, merge, deploy, mudança de gate ou dados reais.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <Metric label="Arquivos" value={summary.inventory.totalFiles} />
          <Metric label="Modificados" value={summary.inventory.trackedModified} />
          <Metric label="Novos" value={summary.inventory.untrackedFiles} />
          <Metric label="Frentes prontas" value={`${summary.readyWorkstreams}/${summary.workstreams.length}`} />
          <Metric label="Escopo sensível" value={summary.inventory.sensitive} accent="text-emerald-300" />
        </div>

        <div role="status" className="rounded-md border border-amber-500/30 bg-background/60 p-3 text-xs">
          <p className="font-medium text-foreground">Próxima decisão: reconciliar o repositório oficial</p>
          <p className="mt-1 text-muted-foreground">
            O checkout atual e o handoff anterior apontam para destinos diferentes. Nenhum deles é promovido silenciosamente a fonte oficial.
          </p>
        </div>

        <section aria-labelledby="release-charter-workstreams" className="space-y-2">
          <h3 id="release-charter-workstreams" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileCheck2 className="h-4 w-4 text-violet-300" aria-hidden="true" />
            Frentes incluídas
          </h3>
          <ul className="grid gap-2 lg:grid-cols-2">
            {summary.workstreams.map((workstream) => (
              <li key={workstream.key} className="rounded-md border border-border bg-card/60 p-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-medium text-foreground">{workstream.label}</p>
                      <Badge variant="outline" className={riskTone(workstream.risk)}>{riskLabel(workstream.risk)}</Badge>
                    </div>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{workstream.outcome}</p>
                    <p className="mt-2 text-muted-foreground">{workstream.reviewNote}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="release-review-sequence" className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="release-review-sequence" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <GitBranch className="h-4 w-4 text-violet-300" aria-hidden="true" />
              Plano de revisão · {reviewPlan.orderedStages.length} etapas
            </h3>
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/15 text-emerald-300">
              Estrutura válida
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Próxima etapa: {reviewPlan.nextStage?.label ?? "sequência concluída"}. Iniciar a revisão exige autorização; o plano não autoriza ações Git.
          </p>
          <ol className="grid gap-2 lg:grid-cols-2">
            {reviewPlan.orderedStages.map((stage) => (
              <li key={stage.key} className="rounded-md border border-border bg-card/60 p-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-400/15 font-semibold text-violet-200">
                    {stage.sequence}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{stage.label}</p>
                    <p className="mt-1 text-muted-foreground">Revisores: {stage.reviewerRoles.join(" · ")}</p>
                    <p className="mt-1 text-muted-foreground">Saída mínima: {stage.exitCriteria[0]}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-3 text-xs md:grid-cols-2">
          <div className="rounded-md border border-border bg-background/60 p-3">
            <p className="font-medium text-foreground">Checkout atual</p>
            <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">{summary.repository.currentCheckout}</p>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-3">
            <p className="font-medium text-foreground">Handoff anterior</p>
            <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">{summary.repository.priorHandoff ?? "não informado"}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-md border border-destructive/25 bg-background/60 p-3 text-xs text-muted-foreground">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <p className="font-medium text-foreground">Promoção fail-closed</p>
            <ul className="mt-1 space-y-1">
              {summary.promotionBlockers.map((blocker) => (
                <li key={blocker}>• {releaseCandidatePromotionBlockerLabel(blocker)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <p>Carta {summary.charterId} · {summary.observedAt} · política {summary.policyId}.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function riskLabel(risk: ReleaseCandidateRisk) {
  if (risk === "high") return "Risco alto";
  if (risk === "medium") return "Risco médio";
  return "Risco baixo";
}

function riskTone(risk: ReleaseCandidateRisk) {
  if (risk === "high") return "border-amber-500/40 bg-amber-500/15 text-amber-300";
  if (risk === "medium") return "border-sky-500/40 bg-sky-500/15 text-sky-300";
  return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
