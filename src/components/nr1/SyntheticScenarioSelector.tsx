import { ArrowRight, RotateCcw, ShieldCheck } from "lucide-react";
import { syntheticDemoScenarios } from "@/data/syntheticDemoScenarios";

export default function SyntheticScenarioSelector({
  onApply,
  disabled = false,
}: {
  onApply: (scenarioId: string) => void;
  disabled?: boolean;
}) {
  return (
    <section aria-labelledby="synthetic-scenarios-title" className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary">Cenários determinísticos</p>
          <h2 id="synthetic-scenarios-title" className="mt-1 font-display text-xl font-bold">Experimente sem preencher item por item</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-deep-muted">
            Os presets usam respostas inteiramente fictícias e reproduzíveis. Eles demonstram estados da interface;
            não representam pessoa, empresa, benchmark, instrumento validado ou conclusão técnica.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {syntheticDemoScenarios.map((scenario) => (
          <article key={scenario.id} className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="font-display text-sm font-bold">{scenario.label}</h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-surface-deep-muted">{scenario.description}</p>
            <button
              type="button"
              onClick={() => onApply(scenario.id)}
              disabled={disabled}
              aria-describedby={disabled ? "session-preflight-guidance" : undefined}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-45"
            >
              Aplicar cenário <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 text-2xs leading-relaxed text-surface-deep-muted">
        <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Depois de aplicar, você poderá revisar, alterar ou limpar todas as respostas antes de gerar a leitura.
      </p>
      {disabled && <p className="mt-2 text-2xs font-semibold text-amber-200">Cenários bloqueados até a conclusão do preflight.</p>}
    </section>
  );
}
