import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCopy,
  CreditCard,
  Database,
  Download,
  FileText,
  KeyRound,
  Layers,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  CHECKOUT_FIRST_FLOW_STEPS,
  CONFIRMED_DECISIONS,
  DEVELOPMENT_SUPER_PROMPT,
  GOLIVE_WAVES_ROADMAP,
  MTE_NR1_OPERATIONAL_CHAIN,
  PLAN_ARCHITECTURE_TIERS,
  PRODUCTION_KEYS_CHECKLIST,
  RBAC_PERMISSION_COLUMNS,
  RBAC_PERMISSION_MATRIX,
  SAAS_BENCHMARKS,
  SUBSCRIPTION_LIFECYCLE_STATES,
  TOT_BRANCHES,
  type PermissionAccessLevel,
} from "@/data/saasGoLivePlan";
import type {
  SaasMaturityStage,
  SaasMaturitySummary,
} from "@/lib/governance/saasMaturity";

const STAGE_META: Array<{
  stage: SaasMaturityStage;
  code: string;
  label: string;
  gate: string;
}> = [
  { stage: "foundation", code: "01", label: "Fundação Governada", gate: "G0" },
  { stage: "synthetic_mvp", code: "02", label: "MVP Sintético", gate: "G1" },
  { stage: "controlled_pilot", code: "03", label: "Piloto Controlado", gate: "G2" },
  { stage: "real_saas", code: "04", label: "SaaS Real (Produção)", gate: "G3" },
  { stage: "scale", code: "05", label: "Escala Comercial", gate: "G4" },
];

function permissionCellTone(level: PermissionAccessLevel): string {
  switch (level) {
    case "full":
      return "text-emerald-800 dark:text-emerald-300 font-semibold";
    case "review":
      return "text-teal-800 dark:text-teal-300 font-semibold";
    case "read":
      return "text-foreground/85";
    case "limited":
      return "text-amber-800 dark:text-amber-300 font-medium";
    case "blocked":
      return "text-rose-700 dark:text-rose-300 font-bold bg-rose-500/10";
    case "none":
      return "text-muted-foreground/60";
  }
}

export function ChapterHeader({
  number,
  title,
  subtitle,
  audience,
}: {
  number: string;
  title: string;
  subtitle: string;
  audience: string;
}) {
  return (
    <div className="border-b border-border/80 pb-5 mb-6 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono font-semibold text-primary">CAPÍTULO {number}</span>
        <span aria-hidden="true">·</span>
        <span>Público-alvo: {audience}</span>
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

// ============================================================================
// CHAPTER 01 — MATURITY AUDIT & TREE OF THOUGHT
// ============================================================================
export function ChapterMaturityAudit({ summary }: { summary: SaasMaturitySummary }) {
  return (
    <div className="space-y-8">
      {/* Live KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Score Global Verificado</p>
          <p className="font-mono tabular-nums text-3xl font-bold text-foreground">
            {summary.scorePct}%
          </p>
          <p className="text-xs text-muted-foreground">
            {summary.ready} prontos · {summary.partial} parciais · {summary.blocked} bloqueados
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Fundação Governada</p>
          <p className="font-mono tabular-nums text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            {summary.stageTotals.foundation.pct}%
          </p>
          <p className="text-xs text-muted-foreground">
            Privacy Vault k &gt;= 5 · 206 pgTAP
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">SaaS Real (Gate G3)</p>
          <p className="font-mono tabular-nums text-3xl font-bold text-amber-700 dark:text-amber-400">
            {summary.stageTotals.real_saas.pct}%
          </p>
          <p className="text-xs text-muted-foreground">
            No-Go para dados reais até G3
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Gate Operacional Atual</p>
          <p className="font-mono tabular-nums text-3xl font-bold text-primary">
            {summary.currentGate}
          </p>
          <p className="text-xs text-muted-foreground">
            Próximo salto: {summary.nextStep?.label ?? "Escala"}
          </p>
        </div>
      </div>

      {/* 5-Stage Breakdown Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/70 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Diagnóstico por Estágio de Maturidade (Avaliador Vivo do Repositório)
            </h3>
            <p className="text-xs text-muted-foreground">
              Política {summary.policyId} · Nenhum percentual é estimado manualmente; todos derivam das evidências reais do projeto.
            </p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {summary.total} critérios auditados
          </span>
        </div>

        <div className="divide-y divide-border/70">
          {STAGE_META.map((meta) => {
            const totals = summary.stageTotals[meta.stage];
            const itemsInStage = summary.items.filter((i) => i.stage === meta.stage);
            const openItems = itemsInStage.filter((i) => !i.ready);
            const barColor =
              totals.pct === 100
                ? "bg-emerald-600 dark:bg-emerald-500"
                : totals.pct >= 40
                  ? "bg-amber-600 dark:bg-amber-500"
                  : "bg-rose-600 dark:bg-rose-500";

            return (
              <div key={meta.stage} className="p-5 grid gap-4 md:grid-cols-12 items-center">
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>{meta.code}</span>
                    <span>·</span>
                    <span>Gate {meta.gate}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                  <p className="text-xs text-muted-foreground font-mono tabular-nums">
                    {totals.ready}/{totals.total} critérios prontos
                  </p>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-muted-foreground">Prontidão</span>
                    <span className="font-bold text-foreground">{totals.pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${Math.max(totals.pct, 4)}%` }}
                    />
                  </div>
                </div>

                <div className="md:col-span-5 text-xs text-muted-foreground leading-relaxed">
                  {openItems.length === 0 ? (
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      Todos os controles técnicos locais aprovados e verificados.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-foreground">Bloqueios abertos:</strong>{" "}
                      {openItems.map((i) => i.label).join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tree of Thought — 3 Strategic Branches */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Árvore de Conhecimento (Tree-of-Thought): 3 Caminhos Avaliados
          </h3>
          <p className="text-xs text-muted-foreground">
            Comparação estruturada entre velocidade artificial, engenharia fechada e Go-Live escalonado por gates.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {TOT_BRANCHES.map((branch) => {
            const isRecommended = branch.verdict === "RECOMENDADO";
            const isRejected = branch.verdict === "REJEITADO";
            const verdictClass = isRecommended
              ? "text-emerald-700 dark:text-emerald-400"
              : isRejected
                ? "text-rose-700 dark:text-rose-400"
                : "text-amber-700 dark:text-amber-400";

            return (
              <div
                key={branch.id}
                className={`rounded-xl border p-5 flex flex-col justify-between gap-4 ${
                  isRecommended
                    ? "border-emerald-600/50 dark:border-emerald-500/45 bg-emerald-500/[0.04]"
                    : "border-border bg-card"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-muted-foreground">{branch.code}</span>
                    <span className={`font-bold ${verdictClass}`}>{branch.verdict}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">{branch.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {branch.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed pt-2 border-t border-border/60">
                    {branch.summary}
                  </p>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {branch.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-border/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Risco regulatório</span>
                    <span className="font-mono font-semibold text-foreground">{branch.riskLevel}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Prazo de valor:</strong> {branch.timeToValue}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmed Decisions Strip */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">
            4 Decisões Arquiteturais Confirmadas para Este Plano
          </h3>
          <span className="text-xs text-muted-foreground">Base validada com a liderança</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {CONFIRMED_DECISIONS.map((dec) => (
            <div key={dec.id} className="border-t border-border/70 pt-3 space-y-1">
              <p className="text-xs font-mono text-primary font-semibold">
                {dec.code} · {dec.title}
              </p>
              <p className="text-sm font-semibold text-foreground">{dec.choice}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{dec.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHAPTER 02 — BENCHMARK COMPETITIVO
// ============================================================================
export function ChapterBenchmarks() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-4 font-semibold">Categoria & Referências</th>
                <th className="py-3.5 px-4 font-semibold">Força no Mercado</th>
                <th className="py-3.5 px-4 font-semibold">Lacuna Comum</th>
                <th className="py-3.5 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                  Nosso Diferencial Estrutural
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {SAAS_BENCHMARKS.map((item) => (
                <tr key={item.id} className="align-top hover:bg-muted/20 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.referencePlayers}</p>
                  </td>
                  <td className="py-4 px-4 text-xs sm:text-sm text-foreground/85 leading-relaxed">
                    {item.marketStrength}
                  </td>
                  <td className="py-4 px-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.marketGap}
                  </td>
                  <td className="py-4 px-4 text-xs sm:text-sm text-foreground font-medium leading-relaxed bg-emerald-500/[0.03]">
                    {item.ourDifferentiation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Moat Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">Privacy Vault no Banco</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enquanto soluções de clima aplicam anonimato apenas no frontend, nosso banco aplica{" "}
            <span className="font-mono text-foreground">k &gt;= 5</span>, anti-differencing e 206 asserções pgTAP no PostgreSQL.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Layers className="h-4 w-4 shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">Rigor MTE + 12 Drivers</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Integramos AEP/AET, Criteria Engine e evidências auditáveis do PGR com intervenções práticas de bem-estar organizacional.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard className="h-4 w-4 shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">Billing Server-Side</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Checkout-First com Mercado Pago (Cartão/Pix), HMAC-SHA256 e consulta autoritativa — sem liberação vulnerável via navegador.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHAPTER 03 — CHECKOUT-FIRST OPERATIONAL FLOW (INTERACTIVE STEPPER)
// ============================================================================
export function ChapterCheckoutFirst() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const current =
    CHECKOUT_FIRST_FLOW_STEPS.find((s) => s.step === activeStep) ?? CHECKOUT_FIRST_FLOW_STEPS[0];

  return (
    <div className="space-y-6">
      {/* Interactive 6-Step Selector */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5"
        role="tablist"
        aria-label="Etapas do fluxo Checkout-First"
      >
        {CHECKOUT_FIRST_FLOW_STEPS.map((item) => {
          const isSelected = item.step === activeStep;
          return (
            <button
              key={item.step}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveStep(item.step)}
              className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/[0.08] text-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[11px] font-bold text-primary block">
                {item.code}
              </span>
              <span className="text-xs font-semibold leading-snug mt-1 block">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Inspector */}
      <div
        className="rounded-xl border border-border bg-card overflow-hidden"
        role="tabpanel"
        aria-label={`Detalhes do ${current.code}`}
      >
        <div className="px-6 py-5 border-b border-border/70 flex flex-wrap items-center justify-between gap-3 bg-muted/25">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
              <span>{current.code} DE 06</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-sans font-medium">{current.actor}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">{current.title}</h3>
            <p className="text-sm text-muted-foreground max-w-3xl">{current.summary}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Passo anterior
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
              disabled={activeStep === 6}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Próximo passo
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5 border-t border-border/60 pt-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              1. Experiência no Frontend
            </p>
            <p className="text-sm text-foreground leading-relaxed">{current.frontendAction}</p>
          </div>

          <div className="space-y-1.5 border-t border-border/60 pt-3">
            <p className="text-xs font-mono uppercase tracking-wider text-primary">
              2. Edge Function / API Mercado Pago
            </p>
            <p className="text-sm text-foreground leading-relaxed">{current.serverAction}</p>
          </div>

          <div className="space-y-1.5 border-t border-border/60 pt-3">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              3. Efeito no PostgreSQL & RLS
            </p>
            <p className="text-sm text-foreground leading-relaxed">{current.databaseRlsEffect}</p>
          </div>

          <div className="space-y-1.5 border-t border-emerald-600/35 pt-3">
            <p className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              4. Salvaguarda Anti-Fraude & Segurança
            </p>
            <p className="text-sm text-foreground leading-relaxed">{current.securitySafeguard}</p>
          </div>
        </div>
      </div>

      {/* End-to-End Flow Sequence Summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Regra de Ouro da Trava Comercial
        </p>
        <p className="text-sm text-foreground leading-relaxed">
          Nenhuma empresa é gravada em <span className="font-mono text-xs">organizations</span> antes da
          confirmação autoritativa na API do Mercado Pago. O cadastro corporativo exige um{" "}
          <span className="font-mono text-xs">org_activation_token</span> criptográfico (uso único, validade
          de 72h), consumido atomicamente na mesma transação que cria o <strong className="font-semibold">Owner</strong> e
          anexa os limites do plano contratado.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// CHAPTER 04 — PLANS (ENTITLEMENTS) & RBAC MATRIX
// ============================================================================
export function ChapterPlansAndRbac() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("all");

  const visibleRoles =
    selectedRoleId === "all"
      ? RBAC_PERMISSION_MATRIX
      : RBAC_PERMISSION_MATRIX.filter((r) => r.id === selectedRoleId);

  return (
    <div className="space-y-8">
      {/* Plan Entitlements Tiers */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Arquitetura de Planos & Limites Contratuais (Entitlements)
            </h3>
            <p className="text-xs text-muted-foreground">
              Proposta arquitetural sujeita a aprovação formal do Gate G3. Os limites são aplicados no PostgreSQL e desacoplados dos papéis de equipe.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-700 dark:text-amber-400">
            Proposta pré-G3 · Sem cobrança ativa
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PLAN_ARCHITECTURE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-xl border p-5 flex flex-col justify-between gap-4 ${
                tier.id === "profissional"
                  ? "border-primary/50 bg-primary/[0.03]"
                  : "border-border bg-card"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                    Plano {tier.name}
                  </p>
                  <h4 className="text-lg font-bold text-foreground">{tier.targetProfile}</h4>
                  <p className="text-xs text-muted-foreground">{tier.billingModel}</p>
                </div>

                <dl className="divide-y divide-border/60 text-xs">
                  <div className="py-2 flex justify-between gap-3">
                    <dt className="text-muted-foreground">Assentos de gestão</dt>
                    <dd className="font-mono font-medium text-foreground text-right">{tier.maxAdminSeats}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-3">
                    <dt className="text-muted-foreground">Colaboradores</dt>
                    <dd className="font-mono font-medium text-foreground text-right">{tier.maxActiveEmployees}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-3">
                    <dt className="text-muted-foreground">Unidades / GHE</dt>
                    <dd className="font-mono font-medium text-foreground text-right">{tier.maxUnits}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-3">
                    <dt className="text-muted-foreground">Ciclos NR-1</dt>
                    <dd className="font-mono font-medium text-foreground text-right">{tier.cyclesPerYear}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-3">
                    <dt className="text-muted-foreground">Ergonomia</dt>
                    <dd className="font-medium text-foreground text-right">{tier.aepAetModule}</dd>
                  </div>
                  <div className="py-2 flex justify-between gap-3">
                    <dt className="text-muted-foreground">Retenção auditável</dt>
                    <dd className="font-mono font-medium text-foreground text-right">{tier.auditRetention}</dd>
                  </div>
                </dl>

                <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
                  {tier.highlights.map((hl) => (
                    <li key={hl} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Matrix with Interactive Role Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Matriz de Perfis Convidados & Permissões por Área (RBAC)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filtre por perfil para inspecionar o escopo exato de acesso. Todos os 7 papéis organizacionais possuem bloqueio imutável sobre respostas individuais.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="rbac-role-filter" className="text-xs text-muted-foreground whitespace-nowrap">
              Filtrar perfil:
            </label>
            <select
              id="rbac-role-filter"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">Todos os 8 perfis</option>
              {RBAC_PERMISSION_MATRIX.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-3.5 font-semibold">Perfil Convidado</th>
                  {RBAC_PERMISSION_COLUMNS.map((col) => (
                    <th key={col.key} className="py-3 px-3 font-semibold">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {visibleRoles.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-3.5">
                      <p className="font-semibold text-foreground">{row.role}</p>
                      <p className="text-[11px] text-muted-foreground">{row.scope}</p>
                    </td>
                    {RBAC_PERMISSION_COLUMNS.map((col) => {
                      const cell = row.permissions[col.key];
                      return (
                        <td
                          key={col.key}
                          className={`py-3.5 px-3 whitespace-nowrap ${permissionCellTone(cell.level)}`}
                        >
                          {cell.label}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] px-4 py-3 flex items-start gap-3 text-xs">
          <Lock className="h-4 w-4 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
          <p className="text-foreground/90 leading-relaxed">
            <strong className="font-semibold">Invariante LGPD / Privacy Vault:</strong> Mesmo com permissão máxima de faturamento e convites, o{" "}
            <strong className="font-semibold">Owner / Gestor Master</strong> nunca tem acesso a microdados individuais de trabalhadores. Consultas com menos de 5 respondentes são suprimidas no servidor PostgreSQL (<span className="font-mono">k &gt;= 5</span> + anti-differencing).
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHAPTER 05 — PRODUCTION KEYS, GRACE PERIOD & MTE NR-1 CHAIN
// ============================================================================
export function ChapterKeysAndNr1Chain() {
  return (
    <div className="space-y-8">
      {/* Production Keys Vault */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-primary" />
            Cofre de Chaves & Segregação de Ambientes (Supabase + Mercado Pago)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Chaves privadas permanecem exclusivamente em Supabase Edge Secrets. O frontend recebe apenas chaves públicas protegidas por RLS.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Variável / Segredo</th>
                  <th className="py-3 px-4 font-semibold">Camada</th>
                  <th className="py-3 px-4 font-semibold">Gate</th>
                  <th className="py-3 px-4 font-semibold">Finalidade & Regra de Segurança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {PRODUCTION_KEYS_CHECKLIST.map((item) => (
                  <tr key={item.variable} className="align-top">
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                      {item.variable}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-medium ${
                          item.tier === "server-secret"
                            ? "text-rose-700 dark:text-rose-400"
                            : "text-teal-700 dark:text-teal-400"
                        }`}
                      >
                        {item.tier === "server-secret" ? "Somente Servidor" : "Pública (RLS)"}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.layer}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                      {item.activationGate}
                    </td>
                    <td className="py-3.5 px-4 space-y-1 text-foreground/90 leading-relaxed">
                      <p>{item.purpose}</p>
                      <p className="text-[11px] text-muted-foreground">
                        <strong className="text-foreground">Regra:</strong> {item.rule}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Subscription Lifecycle & Grace Period */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Máquina de Estados de Assinatura & Custódia Auditável (Grace Period)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Projetada para SaaS regulatório: protege evidências de fiscalização durante inadimplência sem conceder uso gratuito.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBSCRIPTION_LIFECYCLE_STATES.map((st) => (
            <div key={st.state} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-primary">{st.state}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{st.duration}</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{st.label}</h4>
              <p className="text-xs text-foreground/85 leading-relaxed">{st.accessRule}</p>
              <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/60 leading-relaxed">
                {st.nr1Protection}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 8-Step MTE NR-1 Operational Chain */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Cadeia Operacional Completa Exigida pelo MTE na NR-1 (8 Etapas)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Como o cliente contratante executa cada obrigação regulatória dentro da plataforma com rastreabilidade de evidências.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {MTE_NR1_OPERATIONAL_CHAIN.map((step) => (
            <div key={step.order} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="font-bold text-primary">
                  ETAPA {String(step.order).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground">{step.normativeRef}</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{step.stage}</h4>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Módulo:</strong> {step.platformModule} ·{" "}
                <strong className="text-foreground">Responsável:</strong> {step.roleOwner}
              </p>
              <p className="text-xs text-foreground/85 leading-relaxed pt-1.5 border-t border-border/60">
                {step.auditArtifact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHAPTER 06 — ROADMAP BY GATES & DEVELOPMENT SUPER PROMPT
// ============================================================================
export function ChapterRoadmapAndSuperPrompt({
  onCopyPrompt,
  copied,
  onExportPdf,
  exportingPdf,
}: {
  onCopyPrompt: () => void;
  copied: boolean;
  onExportPdf: () => void;
  exportingPdf: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* 5 Waves Roadmap */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Cronograma de Consolidação em 5 Ondas (G0 → G4)
          </h3>
          <p className="text-xs text-muted-foreground">
            Nenhuma onda crítica avança sem cumprir integralmente o critério objetivo de aceite (Go/No-Go) da onda anterior.
          </p>
        </div>

        <div className="space-y-3">
          {GOLIVE_WAVES_ROADMAP.map((wave) => {
            const isCurrent = wave.wave === "Onda 1";
            return (
              <div
                key={wave.wave}
                className={`rounded-xl border p-5 space-y-3 ${
                  isCurrent
                    ? "border-emerald-600/45 bg-emerald-500/[0.04]"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {wave.wave.toUpperCase()} · {wave.gate}
                    </span>
                    <span aria-hidden="true" className="text-muted-foreground">·</span>
                    <span className="text-sm font-bold text-foreground">{wave.title}</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isCurrent
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {wave.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {wave.scope}
                </p>

                <div className="grid gap-4 md:grid-cols-12 pt-2 border-t border-border/60 text-xs">
                  <div className="md:col-span-7 space-y-1.5">
                    <p className="font-semibold text-foreground">Entregáveis principais:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {wave.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-5 space-y-1.5">
                    <p className="font-semibold text-foreground">
                      Responsáveis: <span className="font-normal text-muted-foreground">{wave.owners}</span>
                    </p>
                    <p className="font-semibold text-foreground">Critério Go/No-Go:</p>
                    <p className="text-muted-foreground leading-relaxed">{wave.acceptanceCriteria}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Development Super Prompt Block */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Super Prompt de Desenvolvimento (Para Avaliação do Comitê)
            </h3>
            <p className="text-xs text-muted-foreground">
              Especificação pronta para revisão multidisciplinar antes da execução das Ondas 2 a 5.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onCopyPrompt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  Super Prompt copiado
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-3.5 w-3.5" />
                  Copiar Super Prompt
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onExportPdf}
              disabled={exportingPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {exportingPdf ? "Gerando PDF A4…" : "Exportar PDF Completo"}
            </button>
          </div>
        </div>

        <div className="p-5">
          <pre className="max-h-[440px] overflow-auto rounded-lg border border-border/70 bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap">
            {DEVELOPMENT_SUPER_PROMPT}
          </pre>
        </div>

        <div className="px-5 py-3 border-t border-border/70 bg-amber-500/[0.05] flex items-start gap-2.5 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">Atenção do Comitê:</strong> Este Super Prompt só deve ser executado em
            produção após aprovação formal dos gates G1/G2/G3 pelos responsáveis de SST, Ergonomia, Psicometria, DPO/Jurídico e Segurança.
          </span>
        </div>
      </div>

      {/* Governance reminder */}
      <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p>
          A plataforma apoia a estruturação auditável do GRO/PGR, AEP/AET e planos de ação sob a NR-1, sem substituir a
          avaliação presencial ou a responsabilidade técnica do profissional legalmente habilitado.
        </p>
      </div>
    </div>
  );
}
