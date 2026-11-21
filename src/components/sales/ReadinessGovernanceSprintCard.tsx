import { AlertTriangle, CheckCircle2, FileCheck, Shield } from "lucide-react";
import {
  g1ReadinessGovernanceSprintDefinition,
} from "@/data/g1ReadinessGovernanceSprint";
import {
  g1CommercialAuthorizationPresentation,
  g1CommercialAuthorizationSummary,
} from "@/data/commercialAuthorization";
import { commercialAuthorizationStatusLabel } from "@/lib/commercial/commercialAuthorization";

const statusClassName = {
  scope_unavailable: "border-destructive/30 bg-destructive/10 text-destructive",
  sale_blocked: "border-warning/30 bg-warning/10 text-warning",
  sale_authorized: "border-success/30 bg-success/10 text-success",
} as const;

export default function ReadinessGovernanceSprintCard() {
  const definition = g1ReadinessGovernanceSprintDefinition;

  return (
    <article
      className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-card"
      aria-labelledby="readiness-governance-sprint-title readiness-governance-sprint-context"
    >
      <span id="readiness-governance-sprint-context" className="sr-only">
        Detalhes e limites operacionais
      </span>
      <div className="border-b border-primary/15 bg-primary/5 p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              <Shield className="h-3.5 w-3.5" /> Receita-ponte controlada · {definition.targetGate}
            </p>
            <h3 id="readiness-governance-sprint-title" className="mt-2 font-display text-xl font-bold md:text-2xl">
              {definition.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {definition.description}
            </p>
          </div>
          <p
            className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[11px] font-bold ${statusClassName[g1CommercialAuthorizationSummary.status]}`}
            role="status"
          >
            {commercialAuthorizationStatusLabel(g1CommercialAuthorizationSummary.status)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <section aria-labelledby="readiness-governance-sprint-scope-title">
          <h4 id="readiness-governance-sprint-scope-title" className="flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="h-4 w-4 text-success" /> O que este sprint organiza
          </h4>
          <ul className="mt-4 space-y-3">
            {definition.scope.map((item) => (
              <li key={item.key} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                {item.label}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-muted/20 p-4" aria-labelledby="readiness-governance-sprint-deliverable-title">
            <h4 id="readiness-governance-sprint-deliverable-title" className="flex items-center gap-2 text-sm font-bold">
              <FileCheck className="h-4 w-4 text-primary" /> Entregável previsto quando autorizado
            </h4>
            <p className="mt-3 text-sm font-semibold">{definition.deliverable}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{definition.deliverableBoundary}</p>
          </section>

          <section aria-labelledby="readiness-governance-sprint-exclusions-title">
            <h4 id="readiness-governance-sprint-exclusions-title" className="flex items-center gap-2 text-sm font-bold">
              <AlertTriangle className="h-4 w-4 text-warning" /> Não inclui
            </h4>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {definition.exclusions.map((item) => (
                <li key={item.key} className="rounded-lg border border-border bg-background px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <footer className="border-t border-border bg-muted/20 px-6 py-4 md:px-8">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Próximo controle:</span> {g1CommercialAuthorizationSummary.nextStep}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{definition.operatingBoundary}</p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Preço de referência:</span> {g1CommercialAuthorizationPresentation.priceLabel}. {g1CommercialAuthorizationPresentation.paidCtaStateLabel}
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Estado comercial:</span> {commercialAuthorizationStatusLabel(g1CommercialAuthorizationSummary.status)}
        </p>
      </footer>
    </article>
  );
}
