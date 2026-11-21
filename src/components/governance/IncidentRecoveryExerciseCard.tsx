import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  g1IncidentRecoveryExerciseContext,
  g1IncidentRecoveryExercisePolicy,
  g1IncidentRecoveryExerciseScenario,
} from "@/data/g1IncidentRecoveryExercise";
import {
  evaluateIncidentRecoveryExercise,
  incidentRecoveryExerciseBlockerLabel,
  type IncidentRecoveryPhaseRecord,
} from "@/lib/governance/incidentRecoveryExercise";

export default function IncidentRecoveryExerciseCard() {
  const [records, setRecords] = useState<IncidentRecoveryPhaseRecord[]>([]);
  const summary = useMemo(
    () => evaluateIncidentRecoveryExercise(
      g1IncidentRecoveryExerciseScenario,
      records,
      g1IncidentRecoveryExerciseContext,
      g1IncidentRecoveryExercisePolicy,
    ),
    [records],
  );

  const registerNextPhase = () => {
    if (!summary.nextStep || !summary.canStartLocalRehearsal) return;
    setRecords((current) => [
      ...current,
      { phase: summary.nextStep!.phase, completedAt: new Date().toISOString() },
    ]);
  };

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Ensaio sintético de incidente e recuperação
          </span>
          <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-300">
            {summary.canIssueLocalReceipt ? "Ensaio local concluído" : "Formalização bloqueada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Exercita uma violação sintética de k-anonimato em memória. Não coleta texto livre, não persiste, não transmite e não substitui runbook aprovado, tabletop formal ou DR produtivo.
        </p>

        <div className="grid gap-2 text-xs md:grid-cols-3">
          <Metric label="Fases" value={`${summary.completed}/${summary.total}`} />
          <Metric label="Dados" value="Somente sintéticos" />
          <Metric label="Valor formal" value="Não concedido" />
        </div>

        <div className="rounded-md border border-border bg-card/60 p-3 text-xs">
          <p className="font-medium text-foreground">{g1IncidentRecoveryExerciseScenario.title}</p>
          <p className="mt-1 text-muted-foreground">{g1IncidentRecoveryExerciseScenario.syntheticTrigger}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Alvo de recuperação: {g1IncidentRecoveryExerciseScenario.recoveryTarget}
          </p>
        </div>

        <ol aria-label="Fases do ensaio de incidente" className="grid gap-2 md:grid-cols-5">
          {g1IncidentRecoveryExerciseScenario.steps.map((step, index) => {
            const complete = index < summary.completed;
            const current = summary.nextStep?.phase === step.phase;
            return (
              <li key={step.phase} className={`rounded-md border p-3 text-xs ${current ? "border-primary/50 bg-primary/5" : "border-border bg-card/50"}`}>
                <div className="flex items-start gap-2">
                  {complete ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] text-muted-foreground" aria-hidden="true">{index + 1}</span>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{step.label}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{step.objective}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div aria-live="polite" className="rounded-md border border-amber-500/30 bg-background/60 p-3 text-xs">
          {summary.blockers.length > 0 ? (
            <p className="flex items-start gap-2 text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {incidentRecoveryExerciseBlockerLabel(summary.blockers[0])}
            </p>
          ) : summary.canIssueLocalReceipt ? (
            <div className="space-y-1">
              <p className="font-medium text-emerald-300">Recibo efêmero emitido nesta sessão.</p>
              <p className="text-muted-foreground">O ensaio local terminou, mas aprovação do runbook, ata, responsáveis e evidência persistente continuam pendentes.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-medium text-foreground">Próxima fase: {summary.nextStep?.label}</p>
              <p className="text-muted-foreground">{summary.nextStep?.expectedEvidence}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">Política: {summary.policyId} · G1 continua não aprovado.</p>
          {summary.canIssueLocalReceipt ? (
            <button
              type="button"
              onClick={() => setRecords([])}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar ensaio local
            </button>
          ) : (
            <button
              type="button"
              onClick={registerNextPhase}
              disabled={!summary.canStartLocalRehearsal || !summary.nextStep}
              className="min-h-11 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Registrar fase: {summary.nextStep?.label ?? "indisponível"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
