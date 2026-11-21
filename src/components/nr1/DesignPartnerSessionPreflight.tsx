import { useEffect, useMemo } from "react";
import { CheckCircle2, CircleAlert, Gauge, ShieldCheck } from "lucide-react";
import {
  g1DesignPartnerSessionPolicy,
  g1SessionAcknowledgements,
  g1SessionCapacityConstraints,
} from "@/data/g1DesignPartnerSession";
import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import { runtimeDataPolicy } from "@/data/runtimePolicy";
import { syntheticDemoScenarios } from "@/data/syntheticDemoScenarios";
import {
  evaluateDesignPartnerSession,
  type SessionAcknowledgementKey,
} from "@/lib/governance/designPartnerSession";

export default function DesignPartnerSessionPreflight({
  acknowledgements,
  onAcknowledgementsChange,
  onReadyChange,
}: {
  acknowledgements: Record<SessionAcknowledgementKey, boolean>;
  onAcknowledgementsChange: (acknowledgements: Record<SessionAcknowledgementKey, boolean>) => void;
  onReadyChange: (ready: boolean) => void;
}) {
  const evaluation = useMemo(() => evaluateDesignPartnerSession({
    dataMode: runtimeDataPolicy.maximumAllowedDataMode,
    instrumentRuntimeReady: exploratoryInstrumentDraft.runtimeReady,
    remoteTransportEnabled: false,
    scenarioCount: syntheticDemoScenarios.length,
    runbookAvailable: true,
    acknowledgements,
  }, g1DesignPartnerSessionPolicy), [acknowledgements]);

  useEffect(() => {
    onReadyChange(evaluation.canRunLocalGuidedSession);
  }, [evaluation.canRunLocalGuidedSession, onReadyChange]);

  const toggle = (key: SessionAcknowledgementKey) => {
    onAcknowledgementsChange({ ...acknowledgements, [key]: !acknowledgements[key] });
  };

  return (
    <section id="design-partner-preflight" aria-labelledby="design-partner-preflight-title" className="rounded-3xl border border-primary/25 bg-primary/[0.04] p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary">Preflight obrigatório · sessão Design Partner</p>
              <h2 id="design-partner-preflight-title" className="mt-1 font-display text-xl font-bold md:text-2xl">Liberação controlada da demonstração</h2>
              <p id="session-preflight-guidance" className="mt-2 text-sm leading-relaxed text-surface-deep-muted">
                Confirme as três fronteiras antes de iniciar. Esta liberação vale somente para uma sessão local, guiada e sintética.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
            <p className="text-xs font-medium text-surface-deep-fg">
              Para agilizar o ensaio guiado com dados fictícios, você pode confirmar os 3 termos abaixo em 1 clique:
            </p>
            <button
              type="button"
              onClick={() =>
                onAcknowledgementsChange({
                  synthetic_only: true,
                  no_technical_decision: true,
                  memory_only: true,
                })
              }
              disabled={evaluation.canRunLocalGuidedSession}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {evaluation.canRunLocalGuidedSession
                ? "3 fronteiras confirmadas"
                : "Confirmar os 3 termos e liberar demo"}
            </button>
          </div>

          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Confirmações obrigatórias do preflight</legend>
            {g1SessionAcknowledgements.map((item) => (
              <label key={item.key} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary">
                <input
                  type="checkbox"
                  checked={acknowledgements[item.key]}
                  onChange={() => toggle(item.key)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
                />
                <span>
                  <span className="block text-sm font-bold text-surface-deep-fg">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-surface-deep-muted">{item.detail}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <div role="status" aria-live="polite" className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${evaluation.canRunLocalGuidedSession ? "border-emerald-300/25 bg-emerald-300/[0.06]" : "border-amber-300/25 bg-amber-300/[0.05]"}`}>
            {evaluation.canRunLocalGuidedSession
              ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
              : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />}
            <div>
              <p className="text-sm font-bold">{evaluation.canRunLocalGuidedSession ? "Sessão local liberada" : "Demonstração bloqueada pelo preflight"}</p>
              <p className="mt-1 text-xs leading-relaxed text-surface-deep-muted">
                {evaluation.canRunLocalGuidedSession
                  ? "Os botões de início e os cenários sintéticos estão disponíveis nesta aba. Uso externo autônomo continua bloqueado."
                  : `Confirme ${evaluation.blockers.filter((blocker) => blocker.startsWith("acknowledgement_required:")).length} fronteira(s) restante(s).`}
              </p>
            </div>
          </div>
        </div>

        <aside aria-labelledby="session-capacity-title" className="rounded-2xl border border-white/10 bg-black/10 p-5">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-secondary" aria-hidden="true" />
            <h3 id="session-capacity-title" className="font-display text-base font-bold">Capacidade operacional desta versão</h3>
          </div>
          <ul className="mt-4 space-y-4">
            {g1SessionCapacityConstraints.map((constraint) => (
              <li key={constraint.key} className="border-l-2 border-white/15 pl-3">
                <p className="text-xs font-bold text-surface-deep-fg">{constraint.label}</p>
                <p className="mt-1 text-2xs leading-relaxed text-surface-deep-muted">{constraint.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-2xs text-surface-deep-muted">Política: {g1DesignPartnerSessionPolicy.policyId}</p>
        </aside>
      </div>
    </section>
  );
}
