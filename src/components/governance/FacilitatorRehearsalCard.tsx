import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { g1ExternalAudiencePack } from "@/data/g1ExternalAudiencePack";
import {
  g1FacilitatorRehearsalAcknowledgements,
  g1FacilitatorRehearsalPolicy,
  g1FacilitatorRehearsalScenarios,
} from "@/data/g1FacilitatorRehearsal";
import {
  buildFacilitatorRehearsalReceipt,
  evaluateFacilitatorRehearsal,
  type FacilitatorRehearsalAcknowledgementKey,
  type FacilitatorRehearsalAction,
} from "@/lib/governance/facilitatorRehearsal";
import type { ExternalAudiencePackSummary } from "@/lib/governance/externalAudiencePack";

const emptyAcknowledgements: Record<FacilitatorRehearsalAcknowledgementKey, boolean> = {
  synthetic_only: false,
  no_external_audience: false,
  no_recording: false,
  no_approval_claim: false,
};

export default function FacilitatorRehearsalCard({ audiencePack }: { audiencePack: ExternalAudiencePackSummary }) {
  const [acknowledgements, setAcknowledgements] = useState({ ...emptyAcknowledgements });
  const [actions, setActions] = useState<Partial<Record<string, FacilitatorRehearsalAction>>>({});
  const [receiptIdentity, setReceiptIdentity] = useState(() => createReceiptIdentity());
  const summary = useMemo(() => evaluateFacilitatorRehearsal(
    g1FacilitatorRehearsalScenarios,
    actions,
    {
      audiencePackReadyForRehearsal: audiencePack.canRehearseInternally,
      syntheticMode: true,
      realDataEnabled: false,
      persistenceEnabled: false,
      remoteTransportEnabled: false,
      externalAudiencePresent: false,
      recordingEnabled: false,
      acknowledgements,
    },
    g1FacilitatorRehearsalPolicy,
  ), [acknowledgements, actions, audiencePack.canRehearseInternally]);
  const receipt = useMemo(() => summary.canIssueLocalReceipt
    ? buildFacilitatorRehearsalReceipt({
      receiptId: receiptIdentity.id,
      generatedAt: receiptIdentity.generatedAt,
      audiencePackId: g1ExternalAudiencePack.packId,
      audiencePackVersion: g1ExternalAudiencePack.version,
      summary,
      persisted: false,
      remoteTransportEnabled: false,
    })
    : null, [receiptIdentity, summary]);
  const acknowledgementBlockerCount = summary.blockers.filter((blocker) =>
    blocker.startsWith("acknowledgement_required:"),
  ).length;

  const reset = () => {
    setAcknowledgements({ ...emptyAcknowledgements });
    setActions({});
    setReceiptIdentity(createReceiptIdentity());
  };

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Simulador de ensaio do facilitador
          </span>
          <Badge variant="outline" className={`text-[10px] ${receipt ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : summary.canStartInternalRehearsal ? "border-primary/40 bg-primary/15 text-primary" : "border-amber-500/40 bg-amber-500/15 text-amber-300"}`}>
            {receipt ? "Ensaio interno concluído" : summary.canStartInternalRehearsal ? `${summary.passed}/${summary.total} condutas alinhadas` : "Preflight obrigatório"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Treino local sem audiência, gravação ou dados reais. Escolha a conduta para cada situação. O resultado orienta preparação interna e nunca vale como nomeação, certificação ou aprovação externa.
        </p>

        <fieldset className="grid gap-2 md:grid-cols-2">
          <legend className="mb-2 text-xs font-medium text-foreground">Preflight do ensaio</legend>
          {g1FacilitatorRehearsalAcknowledgements.map((item) => (
            <label key={item.key} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border bg-card/60 p-3 text-xs focus-within:ring-2 focus-within:ring-primary">
              <input
                type="checkbox"
                checked={acknowledgements[item.key]}
                onChange={() => setAcknowledgements((current) => ({ ...current, [item.key]: !current[item.key] }))}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${summary.completionPct}%` }} />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {summary.scenarios.map((scenario, index) => {
            const attempted = scenario.selectedAction !== null;
            return (
              <fieldset key={scenario.key} disabled={!summary.canStartInternalRehearsal} className="rounded-md border border-border bg-card/60 p-4 disabled:opacity-55">
                <legend className="px-1 text-xs font-semibold text-foreground">{index + 1}. {scenario.label}</legend>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{scenario.prompt}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <ActionOption
                    scenarioLabel={scenario.label}
                    label="Responder com catálogo seguro"
                    value="safe_answer"
                    selected={scenario.selectedAction === "safe_answer"}
                    onSelect={(value) => setActions((current) => ({ ...current, [scenario.key]: value }))}
                  />
                  <ActionOption
                    scenarioLabel={scenario.label}
                    label="Interromper e escalar"
                    value="stop_and_escalate"
                    selected={scenario.selectedAction === "stop_and_escalate"}
                    onSelect={(value) => setActions((current) => ({ ...current, [scenario.key]: value }))}
                  />
                </div>
                {attempted && (
                  <div aria-live="polite" className={`mt-3 flex items-start gap-2 rounded-md border p-2.5 text-[11px] ${scenario.passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                    {scenario.passed
                      ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />}
                    <span><strong className="text-foreground">{scenario.passed ? "Conduta alinhada." : "Revise a conduta."}</strong> {scenario.coaching}</span>
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        {receipt ? (
          <section aria-live="polite" className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-foreground">Comprovante local do ensaio do facilitador</h3>
                <p className="mt-1 text-muted-foreground">
                  {receipt.passedScenarioCount} cenários concluídos · armazenamento: somente memória · aprovação externa: não · facilitador nomeado: não.
                </p>
                <p className="mt-2 break-all font-mono text-[9px] text-muted-foreground">{receipt.receiptId} · {receipt.audiencePackVersion}</p>
              </div>
            </div>
          </section>
        ) : (
          <div role="status" className="rounded-md border border-border bg-background/60 p-3 text-xs text-muted-foreground">
            {summary.canStartInternalRehearsal
              ? `Próximo cenário: ${summary.nextScenario?.label ?? "concluir o ensaio"}.`
              : acknowledgementBlockerCount > 0
                ? `Confirme ${acknowledgementBlockerCount} fronteira(s) para iniciar.`
                : "Ensaio bloqueado por configuração ou limite de segurança; revise o pacote antes de continuar."}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">Política: {summary.policyId}. Todo o estado desaparece ao recarregar.</p>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar ensaio
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionOption({
  scenarioLabel,
  label,
  value,
  selected,
  onSelect,
}: {
  scenarioLabel: string;
  label: string;
  value: FacilitatorRehearsalAction;
  selected: boolean;
  onSelect: (value: FacilitatorRehearsalAction) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-[11px] focus-within:ring-2 focus-within:ring-primary">
      <input
        type="radio"
        name={`rehearsal-${scenarioLabel}`}
        aria-label={`${scenarioLabel}: ${label}`}
        checked={selected}
        onChange={() => onSelect(value)}
        className="h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
      />
      <span>{label}</span>
    </label>
  );
}

function createReceiptIdentity() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return {
    id: uuid ? `FAC-${uuid}` : `FAC-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    generatedAt: new Date().toISOString(),
  };
}
