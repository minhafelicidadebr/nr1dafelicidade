import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Flame,
  Gauge,
  GitBranch,
  LogOut,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatedNumber } from "@/components/home/AnimatedNumber";

const easeOut = [0.16, 1, 0.3, 1] as const;

type MobilePoleTab = "cost" | "benefits";

interface CostCardItem {
  readonly id: string;
  readonly numericValue: number;
  readonly format: (n: number) => string;
  readonly unit?: string;
  readonly secondaryMetric?: string;
  readonly title: string;
  readonly detail: string;
  readonly source: string;
  readonly linkedBenefitIds: readonly string[];
}

interface BenefitCardItem {
  readonly id: string;
  readonly numericValue: number;
  readonly format: (n: number) => string;
  readonly label: string;
  readonly contextNote: string;
  readonly tone: "emerald" | "sky" | "rose" | "amber" | "teal";
  readonly icon: typeof Gauge;
}

const COST_ITEMS: readonly CostCardItem[] = [
  {
    id: "cost-5tri",
    numericValue: 5,
    format: (n) => `US$ ${Math.max(1, Math.round(n))} tri`,
    unit: "/ano",
    title: "Impacto econômico global das condições de saúde mental",
    detail:
      "Impacto agregado estimado em produtividade, absenteísmo e presenteísmo — não apenas gasto médico direto.",
    source: "OMS · Materiais Sodexo (2024)",
    linkedBenefitIds: ["ben-prod", "ben-abs", "ben-oms41"],
  },
  {
    id: "cost-1tri",
    numericValue: 1,
    format: (n) => `US$ ${n < 0.95 ? n.toFixed(1).replace(".", ",") : "1"} tri`,
    unit: "/ano",
    secondaryMetric: "12 bi dias perdidos/ano",
    title: "Perda de produtividade e afastamentos por depressão e ansiedade",
    detail:
      "76% dos trabalhadores relatam sintomas de desgaste emocional e apenas 23% se sentem engajados no trabalho.",
    source: "OMS / OIT (2022) · Gallup (2023) · Mind Share Partners",
    linkedBenefitIds: ["ben-burnout", "ben-turnover", "ben-adapt"],
  },
  {
    id: "cost-16tri",
    numericValue: 16,
    format: (n) => `US$ ${Math.max(1, Math.round(n))} tri`,
    unit: " até 2030",
    title: "Projeção de custo global acumulado sem intervenção estruturada",
    detail:
      "Estimativa internacional de economia da saúde mental acumulada (varia conforme metodologia anual vs. cumulativa).",
    source: "Estimativas Internacionais de Economia da Saúde Mental",
    linkedBenefitIds: ["ben-innov", "ben-prod", "ben-oms41"],
  },
  {
    id: "cost-nr1",
    numericValue: 2026,
    format: (n) => `26/05/${Math.max(2024, Math.round(n))}`,
    secondaryMetric: "GRO / PGR Obrigatório",
    title: "Vigência da NR-1 integrando fatores psicossociais ao PGR",
    detail:
      "Exposição direta à fiscalização da NR-28, majoração do FAP/RAT sobre a folha e passivos trabalhistas sem gestão auditável.",
    source: "MTE · Portarias nº 1.419/2024 e nº 765/2025",
    linkedBenefitIds: ["ben-accidents", "ben-abs", "ben-burnout"],
  },
];

const BENEFIT_ITEMS: readonly BenefitCardItem[] = [
  {
    id: "ben-prod",
    numericValue: 21,
    format: (n) => `+${Math.round(n)}%`,
    label: "Produtividade",
    contextNote: "Equipes com alto engajamento e bem-estar",
    tone: "emerald",
    icon: Gauge,
  },
  {
    id: "ben-adapt",
    numericValue: 45,
    format: (n) => `+${Math.round(n)}%`,
    label: "Adaptabilidade à mudança",
    contextNote: "Resiliência coletiva em transições",
    tone: "sky",
    icon: GitBranch,
  },
  {
    id: "ben-innov",
    numericValue: 300,
    format: (n) => `+${Math.round(n)}%`,
    label: "Inovação",
    contextNote: "Segurança psicológica e autonomia criativa",
    tone: "rose",
    icon: Rocket,
  },
  {
    id: "ben-abs",
    numericValue: 37,
    format: (n) => `-${Math.round(n)}%`,
    label: "Absenteísmo",
    contextNote: "Menor incidência de faltas evitáveis",
    tone: "amber",
    icon: Users,
  },
  {
    id: "ben-accidents",
    numericValue: 48,
    format: (n) => `-${Math.round(n)}%`,
    label: "Acidentes de trabalho",
    contextNote: "Atenção plena e redução de sobrecarga",
    tone: "emerald",
    icon: ShieldCheck,
  },
  {
    id: "ben-turnover",
    numericValue: 59,
    format: (n) => `-${Math.round(n)}%`,
    label: "Probabilidade de deixar a empresa",
    contextNote: "Retenção de talentos e menor turnover",
    tone: "teal",
    icon: LogOut,
  },
  {
    id: "ben-burnout",
    numericValue: 4,
    format: (n) => `${Math.max(1, Math.round(n))}× menor`,
    label: "Probabilidade de burnout",
    contextNote: "Prevenção na fonte de esgotamento crônico",
    tone: "amber",
    icon: Flame,
  },
  {
    id: "ben-oms41",
    numericValue: 4,
    format: (n) => `${Math.max(1, Math.round(n))}:1`,
    label: "Retorno médio na literatura",
    contextNote: "OMS (2019) · referência externa, não garantia",
    tone: "teal",
    icon: TrendingUp,
  },
];

const BENEFIT_TONE_CLASSES: Record<
  BenefitCardItem["tone"],
  { card: string; activeRing: string; value: string; icon: string }
> = {
  emerald: {
    card: "border-emerald-200/85 bg-emerald-50/45 hover:border-emerald-400/80 dark:border-emerald-500/25 dark:bg-emerald-950/25 dark:hover:border-emerald-400/55",
    activeRing: "ring-2 ring-emerald-500/45 border-emerald-500/70 dark:border-emerald-400/75",
    value: "text-emerald-700 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  sky: {
    card: "border-sky-200/85 bg-sky-50/45 hover:border-sky-400/80 dark:border-sky-500/25 dark:bg-sky-950/25 dark:hover:border-sky-400/55",
    activeRing: "ring-2 ring-sky-500/45 border-sky-500/70 dark:border-sky-400/75",
    value: "text-sky-700 dark:text-sky-300",
    icon: "text-sky-600 dark:text-sky-400",
  },
  rose: {
    card: "border-rose-200/85 bg-rose-50/45 hover:border-rose-400/80 dark:border-rose-500/25 dark:bg-rose-950/25 dark:hover:border-rose-400/55",
    activeRing: "ring-2 ring-rose-500/45 border-rose-500/70 dark:border-rose-400/75",
    value: "text-rose-700 dark:text-rose-300",
    icon: "text-rose-600 dark:text-rose-400",
  },
  amber: {
    card: "border-amber-200/90 bg-amber-50/50 hover:border-amber-400/85 dark:border-amber-500/25 dark:bg-amber-950/25 dark:hover:border-amber-400/55",
    activeRing: "ring-2 ring-amber-500/45 border-amber-500/70 dark:border-amber-400/75",
    value: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
  },
  teal: {
    card: "border-teal-200/85 bg-teal-50/45 hover:border-teal-400/80 dark:border-teal-500/25 dark:bg-teal-950/25 dark:hover:border-teal-400/55",
    activeRing: "ring-2 ring-teal-500/45 border-teal-500/70 dark:border-teal-400/75",
    value: "text-teal-700 dark:text-teal-300",
    icon: "text-teal-600 dark:text-teal-400",
  },
};

export default function SilentCostToFlourishingMatrix() {
  const [hoveredCostId, setHoveredCostId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<MobilePoleTab>("cost");

  const activeLinkedBenefits = hoveredCostId
    ? COST_ITEMS.find((c) => c.id === hoveredCostId)?.linkedBenefitIds ?? []
    : [];

  return (
    <div className="space-y-8">
      {/* Cabeçalho Editorial Centralizado — Síntese da Intersecção */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
          <span>01. Por que isso importa</span>
          <span className="text-border dark:text-white/25" aria-hidden="true">·</span>
          <span>Custo silencioso & Exposição NR-1</span>
        </p>

        <h2
          id="crisis-title"
          className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] leading-[1.08] text-surface-deep-fg text-balance"
        >
          De um custo silencioso a um{" "}
          <span className="text-amber-700 dark:text-amber-300">florescimento</span>{" "}
          <span className="text-emerald-700 dark:text-emerald-400">organizacional.</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-surface-deep-muted leading-relaxed max-w-2xl mx-auto">
          Quando o sofrimento não é medido, vira perda bilionária e passivo legal na{" "}
          <strong className="font-semibold text-surface-deep-fg">NR-1</strong>. A{" "}
          <strong className="font-semibold text-surface-deep-fg">Ciência do Bem-Estar no Trabalho</strong>{" "}
          transforma exposição psicossocial em saúde, retenção e desempenho coletivo — com base em evidências.
        </p>
      </motion.div>

      {/* Seletor Inteligente Mobile (< lg): evita parede vertical longa em telas pequenas */}
      <div className="lg:hidden">
        <div
          role="tablist"
          aria-label="Alternar entre o custo de não cuidar e os benefícios de promover o bem-estar"
          className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-card p-1 shadow-sm dark:border-white/10 dark:bg-card/85"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "cost"}
            onClick={() => setMobileTab("cost")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              mobileTab === "cost"
                ? "bg-red-600 text-white shadow-sm dark:bg-red-500/90"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Custo & NR-1 (4)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "benefits"}
            onClick={() => setMobileTab("benefits")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
              mobileTab === "benefits"
                ? "bg-emerald-700 text-white shadow-sm dark:bg-emerald-500 dark:text-slate-950"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Florescimento (8)</span>
          </button>
        </div>
      </div>

      {/* Matriz Bilateral de Transformação (Split-Screen no Desktop / Abas Fluidas no Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.18fr)] gap-6 lg:gap-5 items-stretch">
        {/* ═══ POLO ESQUERDO: O CUSTO DE NÃO CUIDAR & EXPOSIÇÃO NR-1 ═══ */}
        <div
          className={`flex flex-col justify-between space-y-4 ${
            mobileTab === "cost" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="inline-flex items-center gap-2 font-display text-sm font-bold text-red-700 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>O custo de não cuidar & exposição regulatória</span>
              </h3>
              <span className="hidden sm:inline text-[11px] font-mono text-muted-foreground">
                Passe o cursor para cruzar
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Perdas globais de produtividade, desgaste emocional e a obrigatoriedade do GRO/PGR no Brasil.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3">
            {COST_ITEMS.map((item, idx) => {
              const isHovered = hoveredCostId === item.id;
              const isNr1Card = item.id === "cost-nr1";
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: idx * 0.06, duration: 0.5, ease: easeOut }}
                  onMouseEnter={() => setHoveredCostId(item.id)}
                  onMouseLeave={() => setHoveredCostId(null)}
                  onFocus={() => setHoveredCostId(item.id)}
                  onBlur={() => setHoveredCostId(null)}
                  tabIndex={0}
                  className={`group rounded-2xl border p-4 sm:p-[18px] transition-all duration-200 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 ${
                    isNr1Card
                      ? "border-amber-300/90 bg-amber-50/55 hover:border-amber-400 dark:border-amber-500/30 dark:bg-amber-950/20 dark:hover:border-amber-400/60"
                      : "border-red-200/85 bg-red-50/40 hover:border-red-400/80 dark:border-red-500/25 dark:bg-red-950/20 dark:hover:border-red-400/55"
                  } ${
                    isHovered ? "-translate-y-0.5 shadow-md" : "shadow-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none ${
                          isNr1Card
                            ? "text-amber-800 dark:text-amber-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        <AnimatedNumber
                          value={item.numericValue}
                          format={item.format}
                          initialDuration={950 + idx * 80}
                        />
                      </span>
                      {item.unit && (
                        <span
                          className={`text-xs sm:text-sm font-semibold ${
                            isNr1Card
                              ? "text-amber-800/80 dark:text-amber-300/80"
                              : "text-red-700/80 dark:text-red-300/80"
                          }`}
                        >
                          {item.unit}
                        </span>
                      )}
                    </div>

                    {item.secondaryMetric && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold tabular-nums ${
                          isNr1Card
                            ? "text-amber-800 dark:text-amber-300"
                            : "text-red-700/90 dark:text-red-300/90"
                        }`}
                      >
                        {isNr1Card && <Shield className="h-3 w-3 shrink-0" aria-hidden="true" />}
                        <span>{item.secondaryMetric}</span>
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                  <p className="mt-2.5 pt-2 border-t border-border/70 dark:border-white/[0.08] text-[10px] font-mono text-muted-foreground/90">
                    {item.source}
                  </p>
                </motion.article>
              );
            })}
          </div>

          {/* CTA suave no Mobile para alternar diretamente para o polo de benefícios */}
          <div className="lg:hidden pt-1">
            <button
              type="button"
              onClick={() => setMobileTab("benefits")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/90 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors dark:border-emerald-500/35 dark:bg-emerald-950/35 dark:text-emerald-300"
            >
              <span>Transformar: ver os 8 ganhos do florescimento</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ═══ EIXO CENTRAL DE TRANSFORMAÇÃO (DESKTOP) ═══ */}
        <div
          className="hidden lg:flex flex-col items-center justify-center px-1.5 select-none"
          aria-hidden="true"
        >
          <div className="w-px flex-1 bg-gradient-to-b from-transparent via-border to-amber-500/40 dark:via-white/15" />
          <div
            className={`my-3 flex flex-col items-center gap-3 transition-transform duration-300 ${
              hoveredCostId ? "scale-105" : ""
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                hoveredCostId
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shadow-sm"
                  : "border-amber-400/50 bg-card text-amber-700 dark:border-amber-400/35 dark:bg-slate-900/90 dark:text-amber-300"
              }`}
            >
              <ArrowRight className="h-4 w-4" />
            </div>
            <span
              className={`[writing-mode:vertical-rl] text-[10px] font-mono font-bold tracking-[0.28em] transition-colors duration-300 ${
                hoveredCostId
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-amber-700/85 dark:text-amber-300/85"
              }`}
            >
              TRANSFORMAR
            </span>
          </div>
          <div className="w-px flex-1 bg-gradient-to-b from-emerald-500/40 via-border to-transparent dark:via-white/15" />
        </div>

        {/* ═══ POLO DIREITO: BENEFÍCIOS ORGANIZACIONAIS & ECONÔMICOS (GRID 2×4 EQUILIBRADO) ═══ */}
        <div
          className={`flex flex-col justify-between space-y-4 ${
            mobileTab === "benefits" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="space-y-1">
            <h3 className="inline-flex items-center gap-2 font-display text-sm font-bold text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Benefícios organizacionais e econômicos de promover o bem-estar</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compilação ilustrativa de indicadores citados na literatura de bem-estar organizacional (Gallup, Shawn
              Achor, Martin Seligman e OMS) — estudos distintos, não é medição única nem garantia de retorno.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3">
            {BENEFIT_ITEMS.map((item, idx) => {
              const styles = BENEFIT_TONE_CLASSES[item.tone];
              const isLinked = activeLinkedBenefits.includes(item.id);
              const isDimmed = hoveredCostId !== null && !isLinked;
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: idx * 0.045, duration: 0.5, ease: easeOut }}
                  className={`group flex flex-col justify-between rounded-2xl border p-4 sm:p-[18px] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    styles.card
                  } ${isLinked ? `${styles.activeRing} -translate-y-0.5 shadow-md` : ""} ${
                    isDimmed ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Icon className={`h-5 w-5 shrink-0 ${styles.icon}`} aria-hidden="true" />
                      {isLinked && (
                        <span className="text-[10px] font-mono font-semibold text-foreground/75">
                          Impacto direto
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-none ${styles.value}`}
                    >
                      <AnimatedNumber
                        value={item.numericValue}
                        format={item.format}
                        initialDuration={920 + idx * 60}
                      />
                    </p>
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-foreground leading-snug">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2.5 text-[11px] text-muted-foreground leading-snug">
                    {item.contextNote}
                  </p>
                </motion.article>
              );
            })}
          </div>

          {/* Botão de retorno no Mobile para revisitar o polo de custos */}
          <div className="lg:hidden pt-1">
            <button
              type="button"
              onClick={() => setMobileTab("cost")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs font-semibold text-foreground hover:bg-accent transition-colors dark:border-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Rever o custo de não cuidar e a vigência da NR-1</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
