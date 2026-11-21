import { Link } from "@/lib/router/compat";
import { AlertTriangle, ArrowRight, CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  externalSessionDecisionBlockerLabel,
  type ExternalSessionDecisionSummary,
} from "@/lib/governance/externalSessionDecision";

export default function ExternalSessionDecisionCard({
  summary,
  workspacePath,
}: {
  summary: ExternalSessionDecisionSummary;
  workspacePath?: string;
}) {
  const approved = summary.canRunExternalSyntheticSession;
  const reviewReady = summary.canRequestFormalReview && !approved;
  const statusTone = approved
    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
    : reviewReady
      ? "border-primary/40 bg-primary/15 text-primary"
      : "border-destructive/40 bg-destructive/15 text-destructive";

  return (
    <Card className="border-destructive/25 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-destructive" aria-hidden="true" />
            Decision room · sessão externa G1
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {approved ? "Sessão sintética aprovada" : reviewReady ? "Pronto para revisão formal" : "No-Go externo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Consolida runtime, ensaio, narrativa, release, accountables e risco residual. Não assina o gate, não agenda audiência e nunca libera dados reais.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <Metric label="Evidências" value={`${summary.ready}/${summary.total}`} />
          <Metric label="Prontidão" value={`${summary.readinessPct}%`} />
          <Metric label="Decisão" value={decisionLabel(summary)} accent={approved ? "text-emerald-300" : "text-destructive"} />
          <Metric label="Dados reais" value="Proibidos" accent="text-destructive" />
        </div>

        <ol aria-label="Dimensões da decisão externa" className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {summary.items.map((item) => (
            <li key={item.key} className="rounded-md border border-border bg-card/60 p-3 text-xs">
              <div className="flex items-start gap-2">
                {item.ready ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                ) : item.status === "partial" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.detail}</p>
                  <p className="mt-2 break-all font-mono text-[9px] text-muted-foreground">{item.evidenceRef}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {!approved && (
          <div role="status" className="rounded-md border border-destructive/30 bg-background/60 p-3 text-xs">
            <p className="font-medium text-foreground">
              Próxima decisão: {summary.nextStep?.label ?? "decisão formal documentada"}
            </p>
            <p className="mt-1 text-muted-foreground">
              {summary.nextStep?.detail ?? externalSessionDecisionBlockerLabel(summary.blockers[0] ?? "formal_decision_pending")}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">Política: {summary.policyId} · escopo máximo: sessão externa sintética.</p>
          <div className="flex flex-wrap gap-2">
            {workspacePath && (
              <Link
                to={workspacePath}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Abrir workspace de prontidão <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            <Link
              to="/nr1-copsoq"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Abrir sessão local permitida <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function decisionLabel(summary: ExternalSessionDecisionSummary) {
  if (summary.status === "approved_for_external_synthetic_session") return "Aprovada";
  if (summary.status === "ready_for_formal_review") return "Em revisão";
  if (summary.status === "rejected") return "Rejeitada";
  return "No-Go";
}
