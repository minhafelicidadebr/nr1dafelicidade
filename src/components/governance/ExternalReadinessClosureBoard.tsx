import { AlertTriangle, CheckCircle2, CircleDashed, ListChecks, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  externalReadinessClosureBlockerLabel,
  type ExternalReadinessClosureItem,
  type ExternalReadinessClosureSummary,
} from "@/lib/governance/externalReadinessClosure";

export default function ExternalReadinessClosureBoard({
  summary,
}: {
  summary: ExternalReadinessClosureSummary;
}) {
  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" aria-hidden="true" />
            Quadro de fechamento externo
          </span>
          <Badge variant={summary.canRequestFormalReview ? "default" : "outline"}>
            {summary.canRequestFormalReview ? "Pronto para revisão formal" : `${summary.ready}/${summary.total} trilhas prontas`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Critical path somente leitura, derivado das evidências vigentes. Nenhuma trilha pode ser concluída manualmente, e revisão formal não significa aprovação do gate.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <Metric label="Prontas" value={`${summary.ready}/${summary.total}`} />
          <Metric label="Em curso" value={summary.inProgress} />
          <Metric label="Bloqueadas" value={summary.blocked} accent="text-destructive" />
          <Metric label="Revisão formal" value={summary.canRequestFormalReview ? "Permitida" : "Bloqueada"} />
          <Metric label="Dados reais" value="Proibidos" accent="text-destructive" />
        </div>

        {summary.nextItem && (
          <div role="status" className="rounded-md border border-primary/30 bg-background/70 p-4 text-sm">
            <p className="font-medium text-foreground">Próxima ação humana necessária</p>
            <p className="mt-1 text-muted-foreground">{summary.nextItem.nextAction}</p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Trilha prioritária: {summary.nextItem.label}. O sistema apenas orienta; nomeação, parecer e aceite permanecem externos e verificáveis.
            </p>
          </div>
        )}

        <ol aria-label="Critical path da prontidão externa" className="grid gap-3 lg:grid-cols-2">
          {summary.items.map((item, index) => (
            <li key={item.key} className="rounded-lg border border-border bg-card/70 p-4 text-xs">
              <div className="flex items-start gap-3">
                <StatusIcon item={item} />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Etapa {index + 1}</p>
                      <h3 className="mt-0.5 font-semibold text-foreground">{item.label}</h3>
                    </div>
                    <Badge variant="outline" className={statusTone(item)}>{statusLabel(item)}</Badge>
                  </div>

                  <p className="leading-relaxed text-muted-foreground">{item.detail}</p>

                  <dl className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Papel accountable</dt>
                      <dd className="mt-0.5 text-foreground">{item.ownerRole}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Dependências</dt>
                      <dd className="mt-0.5 text-foreground">{dependencyLabels(item, summary.items)}</dd>
                    </div>
                  </dl>

                  <div className="rounded-md border border-border bg-background/60 p-3">
                    <p className="font-medium text-foreground">Ação: {item.nextAction}</p>
                    <p className="mt-1 break-all font-mono text-[9px] text-muted-foreground">
                      Evidência: {item.evidenceRef ?? "não vinculada"}
                    </p>
                  </div>

                  {item.blockers.length > 0 && (
                    <ul className="space-y-1 text-[11px] text-muted-foreground">
                      {item.blockers.slice(0, 3).map((blocker) => (
                        <li key={blocker} className="flex items-start gap-1.5">
                          <LockKeyhole className="mt-0.5 h-3 w-3 shrink-0 text-destructive" aria-hidden="true" />
                          {externalReadinessClosureBlockerLabel(blocker)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-[10px] text-muted-foreground">
          Política: {summary.policyId} · saída máxima: solicitação de revisão formal · avanço de gate: proibido.
        </p>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ item }: { item: ExternalReadinessClosureItem }) {
  if (item.ready) return <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />;
  if (item.status === "in_progress") return <CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />;
  return <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />;
}

function statusLabel(item: ExternalReadinessClosureItem) {
  if (item.ready) return "Pronta";
  if (item.status === "in_progress") return "Em curso · não pronta";
  return "Bloqueada";
}

function statusTone(item: ExternalReadinessClosureItem) {
  if (item.ready) return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
  if (item.status === "in_progress") return "border-amber-500/40 bg-amber-500/15 text-amber-300";
  return "border-destructive/40 bg-destructive/15 text-destructive";
}

function dependencyLabels(
  item: ExternalReadinessClosureItem,
  items: readonly ExternalReadinessClosureItem[],
) {
  if (item.dependencies.length === 0) return "Sem dependência anterior";
  return item.dependencies
    .map((key) => items.find((candidate) => candidate.key === key)?.label ?? key)
    .join("; ");
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
