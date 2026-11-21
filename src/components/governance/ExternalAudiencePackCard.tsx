import { AlertTriangle, BookOpenCheck, CheckCircle2, CircleStop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  externalAudiencePackBlockerLabel,
  type ExternalAudiencePackInput,
  type ExternalAudiencePackSummary,
} from "@/lib/governance/externalAudiencePack";

export default function ExternalAudiencePackCard({
  pack,
  summary,
}: {
  pack: ExternalAudiencePackInput;
  summary: ExternalAudiencePackSummary;
}) {
  const approved = summary.canUseWithExternalAudience;
  const rehearsalReady = summary.canRehearseInternally && !approved;
  const tone = approved
    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
    : rehearsalReady
      ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
      : "border-destructive/40 bg-destructive/15 text-destructive";

  return (
    <Card className="border-amber-400/25 bg-amber-400/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Pacote de audiência externa
          </span>
          <Badge variant="outline" className={`text-[10px] ${tone}`}>
            {approved ? "Aprovado para uso sintético" : rehearsalReady ? "Draft ensaiável · externo bloqueado" : "Draft incompleto"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Roteiro versionado para ensaio interno: abertura, limites, sequência, perguntas difíceis, interrupção e fechamento. Não coleta audiência, não agenda sessão e não substitui revisão Jurídica/SST.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <Metric label="Seções" value={`${summary.readySections}/${summary.requiredSections}`} />
          <Metric label="Limites" value={`${summary.declaredBoundaries}/${summary.requiredBoundaries}`} />
          <Metric label="Perguntas" value={summary.questionCount} />
          <Metric label="Stops" value={summary.stopConditionCount} />
          <Metric label="Uso externo" value={approved ? "Permitido" : "Bloqueado"} accent={approved ? "text-emerald-300" : "text-destructive"} />
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {pack.boundaries.map((boundary) => (
            <div key={boundary.key} className="flex items-start gap-2 rounded-md border border-border bg-card/60 p-2.5 text-xs">
              {boundary.declared ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
              )}
              <span>{boundary.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <PackDetails title="Roteiro em sete blocos">
            <ol className="space-y-3">
              {pack.sections.map((section) => (
                <li key={section.key}>
                  <p className="font-medium text-foreground">{section.label}</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {section.lines.map((line) => <li key={line}>— {line}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </PackDetails>

          <PackDetails title="Perguntas difíceis e respostas seguras">
            <dl className="space-y-4">
              {pack.questions.map((item) => (
                <div key={item.key}>
                  <dt className="font-medium text-foreground">{item.question}</dt>
                  <dd className="mt-1 text-muted-foreground">{item.safeAnswer}</dd>
                  <dd className="mt-1 text-[11px] text-amber-300">Escalonamento: {item.escalation}</dd>
                </div>
              ))}
            </dl>
          </PackDetails>

          <PackDetails title="Condições de interrupção e recuperação">
            <ul className="space-y-3">
              {pack.stopConditions.map((condition) => (
                <li key={condition.key} className="flex items-start gap-2">
                  <CircleStop className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                  <span><strong className="text-foreground">Interromper:</strong> {condition.trigger}<br /><strong className="text-foreground">Recuperar:</strong> {condition.recovery}</span>
                </li>
              ))}
            </ul>
          </PackDetails>
        </div>

        <div role="status" className={`rounded-md border p-3 text-xs ${approved ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-400/30 bg-background/60"}`}>
          <p className="font-medium text-foreground">
            {approved ? "Pacote autorizado somente para sessão externa sintética" : "Próximo bloqueio formal"}
          </p>
          <p className="mt-1 text-muted-foreground">
            {approved
              ? "A autorização não permite dados reais, coleta livre, persistência ou entrega formal."
              : externalAudiencePackBlockerLabel(summary.nextBlocker ?? "formal_decision_pending")}
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Pacote: {summary.packId} · versão {summary.version} · política {summary.policyId}.
        </p>
      </CardContent>
    </Card>
  );
}

function PackDetails({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-md border border-border bg-card/50">
      <summary className="min-h-11 cursor-pointer px-4 py-3 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {title}
      </summary>
      <div className="border-t border-border px-4 py-3 text-xs leading-relaxed">{children}</div>
    </details>
  );
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
