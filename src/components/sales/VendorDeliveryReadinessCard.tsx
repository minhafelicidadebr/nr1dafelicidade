import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { g1DesignPartnerOfferSummary } from "@/data/g1DesignPartnerOffer";
import { g1LeadIntakeSummary } from "@/data/g1LeadIntakeGovernance";
import { g1VendorDeliveryReadiness } from "@/data/g1VendorDeliveryReadiness";
import { evaluateCommercialReadiness } from "@/lib/commercial/commercialReadiness";

const statusPresentation = {
  available: {
    label: "Disponível nesta demonstração",
    description: "Pode ser explorado agora, respeitando o ambiente local e sintético.",
    icon: CheckCircle2,
    iconClass: "text-success",
    surfaceClass: "border-success/30 bg-success/5",
  },
  review_ready: {
    label: "Em revisão responsável",
    description: "A base está preparada, mas venda e execução dependem de aceite formal.",
    icon: Clock3,
    iconClass: "text-foreground",
    surfaceClass: "border-warning/40 bg-warning/5",
  },
  blocked: {
    label: "Bloqueado neste gate",
    description: "Não é oferecido nem habilitado enquanto os critérios obrigatórios estiverem pendentes.",
    icon: AlertTriangle,
    iconClass: "text-destructive",
    surfaceClass: "border-destructive/25 bg-destructive/5",
  },
} as const;

export default function BuyerTrustCenter() {
  const commercial = evaluateCommercialReadiness(
    g1DesignPartnerOfferSummary,
    g1LeadIntakeSummary,
    g1VendorDeliveryReadiness,
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-card-hover">
      <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-border bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Centro de confiança do comprador
          </div>

          <h2 id="buyer-trust-center-title" className="mt-5 font-display text-2xl font-bold md:text-3xl">
            Antes de avançar, veja o que é real hoje.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cada capacidade abaixo deriva das políticas versionadas de oferta, intake e entrega. O estado não é
            alterado por marketing nem por uma escolha nesta página.
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-2" aria-label="Resumo da prontidão comercial">
            {([
              [commercial.availableCount, "disponíveis"],
              [commercial.reviewReadyCount, "em revisão"],
              [commercial.blockedCount, "bloqueadas"],
            ] as const).map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-border bg-background/80 p-3 text-center">
                <dt className="text-[10px] font-semibold text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-2xl border border-border bg-background/80 p-4">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-foreground">Limite operacional visível</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Sem dados de trabalhadores, CRM, calendário, cobrança ou operação produtiva. G1 continua sem
                  aprovação formal.
                </p>
              </div>
            </div>
          </div>

          <a
            href="#pricing"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            Comparar próximos passos seguros <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Estado verificável das capacidades
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {(Object.keys(statusPresentation) as Array<keyof typeof statusPresentation>).map((status) => {
              const presentation = statusPresentation[status];
              const Icon = presentation.icon;
              const capabilities = commercial.capabilities.filter((capability) => capability.status === status);

              return (
                <section
                  key={status}
                  aria-labelledby={`commercial-status-${status}`}
                  className={`rounded-2xl border p-4 ${presentation.surfaceClass}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${presentation.iconClass}`} aria-hidden="true" />
                    <div>
                      <h3 id={`commercial-status-${status}`} className="text-xs font-bold text-foreground">
                        {presentation.label}
                      </h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        {presentation.description}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3" aria-label={`Capacidades: ${presentation.label}`}>
                    {capabilities.map((capability) => (
                      <li key={capability.key} className="border-t border-border/70 pt-3 first:border-t-0 first:pt-0">
                        <p className="text-xs font-semibold text-foreground">{capability.label}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{capability.evidence}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Próxima decisão governada:</strong> {commercial.nextStep}
          </div>
        </div>
      </div>
    </article>
  );
}
