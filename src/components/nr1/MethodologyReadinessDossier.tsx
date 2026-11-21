import { AlertTriangle, CheckCircle2, LockKeyhole } from "lucide-react";
import { g1CanonicalInstrumentIntakeSummary } from "@/data/g1CanonicalInstrumentIntake";
import { g1CanonicalPackageManifestSummary } from "@/data/g1CanonicalPackageManifest";
import { g1InstrumentMethodologySummary } from "@/data/instrumentMethodologyReadiness";
import { evaluateMethodologyDossier } from "@/lib/instruments/methodologyDossier";

export default function MethodologyReadinessDossier() {
  const dossier = evaluateMethodologyDossier(
    g1CanonicalInstrumentIntakeSummary,
    g1CanonicalPackageManifestSummary,
    g1InstrumentMethodologySummary,
  );

  return (
    <section aria-labelledby="methodology-dossier-title" className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-400/10 p-2 text-amber-300" aria-hidden="true">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.18em] text-amber-300">Dossiê metodológico G1</p>
          <h2 id="methodology-dossier-title" className="mt-1 font-display text-xl font-bold">
            Instrumento exploratório com runtime bloqueado
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-surface-deep-muted">
            Esta demonstração não valida COPSOQ-BR, não habilita campanha e não substitui fonte primária, licença,
            revisão psicométrica, SST, AEP/AET ou decisão técnica competente.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-surface-deep-muted">
        <span>Etapas prontas para revisão</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-bold text-surface-deep-fg">
          {dossier.readyStages}/{dossier.stages.length}
        </span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-label={`${dossier.readyStages} de ${dossier.stages.length} etapas metodológicas prontas`}
        aria-valuemin={0}
        aria-valuemax={dossier.stages.length}
        aria-valuenow={dossier.readyStages}
      >
        <div className="h-full rounded-full bg-amber-300" style={{ width: `${(dossier.readyStages / dossier.stages.length) * 100}%` }} />
      </div>

      <ul className="mt-5 grid gap-3 md:grid-cols-3" aria-label="Etapas da prontidão metodológica">
        {dossier.stages.map((stage) => (
          <li key={stage.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
            <div className="flex items-start gap-2">
              {stage.status === "ready" ? (
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" aria-hidden="true" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
              )}
              <span>
                <span className="block font-semibold text-surface-deep-fg">{stage.label}</span>
                <span className="mt-1 block leading-relaxed text-surface-deep-muted">{stage.evidence}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-white/10 pt-4 text-xs font-semibold leading-relaxed text-surface-deep-fg">
        Próximo passo: {dossier.nextStep} Runtime do instrumento habilitado: não.
      </p>
    </section>
  );
}
