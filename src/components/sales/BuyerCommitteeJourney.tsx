import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  g1BuyerCommitteeJourney,
  type BuyerCommitteeRoleId,
} from "@/data/g1BuyerCommitteeJourney";

const roleIcons = {
  executive: Building2,
  people: Users,
  sst: ShieldCheck,
  privacy_legal: Scale,
} satisfies Record<BuyerCommitteeRoleId, typeof Building2>;

export default function BuyerCommitteeJourney() {
  const journey = g1BuyerCommitteeJourney;
  const [activeRoleId, setActiveRoleId] = useState<BuyerCommitteeRoleId>(journey.roles[0].id);
  const activeRole = journey.roles.find((role) => role.id === activeRoleId) ?? journey.roles[0];
  const ActiveIcon = roleIcons[activeRole.id];

  return (
    <article
      className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8"
      data-policy-id={journey.policyId}
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-secondary">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> Comitê comprador
          </div>
          <h2 id="buyer-committee-title" className="mt-5 font-display text-2xl font-bold md:text-3xl">
            {journey.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{journey.description}</p>

          <div
            className="mt-6 grid grid-cols-2 gap-2"
            role="group"
            aria-label="Escolha a perspectiva do comitê comprador"
          >
            {journey.roles.map((role) => {
              const Icon = roleIcons[role.id];
              const isActive = activeRole.id === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveRoleId(role.id)}
                  className={`min-h-12 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" /> {role.label}
                  </span>
                  <span className="mt-1 block text-[10px] leading-relaxed">{role.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-5 rounded-2xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
            {journey.notice}
          </p>
        </div>

        <section
          key={activeRole.id}
          aria-labelledby="active-buyer-role-question"
          aria-live="polite"
          className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-5 md:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-2.5 text-primary" aria-hidden="true">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                Perspectiva: {activeRole.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{activeRole.responsibility}</p>
            </div>
          </div>

          <h3 id="active-buyer-role-question" className="mt-5 font-display text-xl font-bold">
            {activeRole.question}
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Decisão a preparar</p>
              <p className="mt-2 text-xs leading-relaxed text-foreground">{activeRole.decision}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contribuição esperada</p>
              <p className="mt-2 text-xs leading-relaxed text-foreground">{activeRole.contribution}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card/80 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Evidências para a conversa
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-3">
              {activeRole.evidence.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">Limite desta perspectiva</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{activeRole.boundary}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-relaxed text-muted-foreground">
              Base versionada: <span className="font-semibold text-foreground">{activeRole.sourceLabel}</span>
            </p>
            <a
              href="#pricing"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-glow transition-shadow hover:shadow-lg"
            >
              Levar para a escolha <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
