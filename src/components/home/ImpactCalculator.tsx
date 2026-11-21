import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Calculator,
  Check,
  Copy,
  Info,
  RotateCcw,
  Scale,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatedNumber } from "@/components/home/AnimatedNumber";
import {
  getNr28Grade4BracketByHeadcount,
  NR28_UFIR_UNIT_BRL,
} from "@/data/homeConversionData";

/* Cenário ilustrativo: as fórmulas são visíveis e dependem apenas das premissas escolhidas. */

const fmtBRL = (n: number) =>
  Math.round(n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

const fmtBRLCents = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type SegmentId = "turnover" | "absenteeism" | "presenteeism" | "productivity";

type Field = {
  key: keyof Inputs;
  label: string;
  suffix?: string;
  prefix?: string;
  min: number;
  max: number;
  step: number;
};

interface Inputs {
  employees: number;
  salary: number;
  turnover: number;
  absenteeism: number;
  presenteeism: number;
  costPerExit: number;
  productivityLoss: number;
}

interface PresetProfile {
  id: "pme" | "media" | "enterprise";
  label: string;
  caption: string;
  values: Inputs;
}

const DEFAULTS: Inputs = {
  employees: 500,
  salary: 5000,
  turnover: 15,
  absenteeism: 4,
  presenteeism: 8,
  costPerExit: 15000,
  productivityLoss: 5,
};

const PRESETS: readonly PresetProfile[] = [
  {
    id: "pme",
    label: "PME · 80",
    caption: "80 colaboradores",
    values: {
      employees: 80,
      salary: 4200,
      turnover: 18,
      absenteeism: 4,
      presenteeism: 8,
      costPerExit: 12000,
      productivityLoss: 5,
    },
  },
  {
    id: "media",
    label: "Média · 500",
    caption: "500 colaboradores",
    values: DEFAULTS,
  },
  {
    id: "enterprise",
    label: "Enterprise · 2.000",
    caption: "2.000 colaboradores",
    values: {
      employees: 2000,
      salary: 6500,
      turnover: 14,
      absenteeism: 5,
      presenteeism: 9,
      costPerExit: 22000,
      productivityLoss: 6,
    },
  },
] as const;

const MITIGATION_OPTIONS = [10, 20, 30] as const;

const FIELDS: Field[] = [
  { key: "employees", label: "Colaboradores", min: 10, max: 10000, step: 10 },
  { key: "salary", label: "Salário médio mensal", prefix: "R$ ", min: 1500, max: 50000, step: 500 },
  { key: "turnover", label: "Turnover anual", suffix: "%", min: 0, max: 60, step: 1 },
  { key: "absenteeism", label: "Taxa de absenteísmo", suffix: "%", min: 0, max: 30, step: 1 },
  { key: "presenteeism", label: "Fator de presenteísmo", suffix: "%", min: 0, max: 30, step: 1 },
  { key: "costPerExit", label: "Custo por desligamento", prefix: "R$ ", min: 1000, max: 100000, step: 1000 },
  { key: "productivityLoss", label: "Perda de produtividade", suffix: "%", min: 0, max: 30, step: 1 },
];

export default function ImpactCalculator() {
  const [v, setV] = useState<Inputs>(DEFAULTS);
  const [mitigationPct, setMitigationPct] = useState<(typeof MITIGATION_OPTIONS)[number]>(20);
  const [activeSegment, setActiveSegment] = useState<SegmentId | null>(null);
  const [copied, setCopied] = useState(false);

  const activePresetId = useMemo(() => {
    const match = PRESETS.find((preset) =>
      (Object.keys(preset.values) as Array<keyof Inputs>).every((k) => preset.values[k] === v[k]),
    );
    return match?.id ?? null;
  }, [v]);

  const calc = useMemo(() => {
    const annualPayroll = v.employees * v.salary * 12;
    const turnoverCost = v.employees * (v.turnover / 100) * v.costPerExit;
    const absenteeismCost = annualPayroll * (v.absenteeism / 100);
    const presenteeismCost = annualPayroll * (v.presenteeism / 100);
    const productivityCost = annualPayroll * (v.productivityLoss / 100);
    const total = turnoverCost + absenteeismCost + presenteeismCost + productivityCost;
    const payrollShare = annualPayroll > 0 ? (total / annualPayroll) * 100 : 0;
    const mitigationAnnual = total * (mitigationPct / 100);

    return {
      annualPayroll,
      turnoverCost,
      absenteeismCost,
      presenteeismCost,
      productivityCost,
      total,
      perEmployee: v.employees > 0 ? total / v.employees : 0,
      perMonth: total / 12,
      payrollShare,
      mitigationAnnual,
      mitigationMonthly: mitigationAnnual / 12,
    };
  }, [v, mitigationPct]);

  const nr28Bracket = useMemo(
    () => getNr28Grade4BracketByHeadcount(v.employees),
    [v.employees],
  );

  const lines = useMemo(() => {
    const safeTotal = calc.total > 0 ? calc.total : 1;
    return [
      {
        id: "turnover" as const,
        label: "Custo de Turnover",
        shortLabel: "Turnover",
        value: calc.turnoverCost,
        share: (calc.turnoverCost / safeTotal) * 100,
        formula: "colaboradores × taxa_turnover × custo_desligamento",
        barColor: "bg-red-600 dark:bg-red-500",
        dotColor: "bg-red-600 dark:bg-red-400",
      },
      {
        id: "absenteeism" as const,
        label: "Custo de Absenteísmo",
        shortLabel: "Absenteísmo",
        value: calc.absenteeismCost,
        share: (calc.absenteeismCost / safeTotal) * 100,
        formula: "massa_salarial_anual × taxa_absenteísmo",
        barColor: "bg-amber-500 dark:bg-amber-400",
        dotColor: "bg-amber-500 dark:bg-amber-400",
      },
      {
        id: "presenteeism" as const,
        label: "Custo de Presenteísmo",
        shortLabel: "Presenteísmo",
        value: calc.presenteeismCost,
        share: (calc.presenteeismCost / safeTotal) * 100,
        formula: "massa_salarial_anual × fator_presenteísmo",
        barColor: "bg-sky-600 dark:bg-sky-400",
        dotColor: "bg-sky-600 dark:bg-sky-400",
      },
      {
        id: "productivity" as const,
        label: "Perda de Produtividade",
        shortLabel: "Produtividade",
        value: calc.productivityCost,
        share: (calc.productivityCost / safeTotal) * 100,
        formula: "massa_salarial_anual × %_perda",
        barColor: "bg-teal-600 dark:bg-teal-400",
        dotColor: "bg-teal-600 dark:bg-teal-400",
      },
    ];
  }, [calc]);

  const handleCopySummary = async () => {
    const summaryText = [
      "RESUMO EXECUTIVO — SIMULADOR DE CUSTOS ORGANIZACIONAIS (CENÁRIO ILUSTRATIVO)",
      "────────────────────────────────────────────────────────────────",
      `Premissas: ${v.employees.toLocaleString("pt-BR")} colaboradores | Salário médio: ${fmtBRL(v.salary)}/mês | Massa salarial anual: ${fmtBRL(calc.annualPayroll)}`,
      `Taxas: Turnover ${v.turnover}% (custo/desligamento ${fmtBRL(v.costPerExit)}) | Absenteísmo ${v.absenteeism}% | Presenteísmo ${v.presenteeism}% | Perda de produtividade ${v.productivityLoss}%`,
      "",
      `Custo anual ilustrativo total: ${fmtBRL(calc.total)} (${calc.payrollShare.toFixed(1)}% da massa salarial)`,
      `Equivalente mensal: ${fmtBRL(calc.perMonth)}/mês | Por colaborador: ${fmtBRL(calc.perEmployee)}/ano`,
      "",
      "Composição por componente:",
      ...lines.map((l) => `- ${l.label}: ${fmtBRL(l.value)} (${l.share.toFixed(1)}%)`),
      "",
      `Sensibilidade aritmética (hipótese de ${mitigationPct}%): ${fmtBRL(calc.mitigationAnnual)}/ano (${fmtBRL(calc.mitigationMonthly)}/mês)`,
      `Referência normativa NR-28 (Tipo S · Grau 4 · ${nr28Bracket.label}): ${nr28Bracket.minUfir.toLocaleString("pt-BR")} a ${nr28Bracket.maxUfir.toLocaleString("pt-BR")} UFIR (${fmtBRLCents(nr28Bracket.minBrl)} a ${fmtBRLCents(nr28Bracket.maxBrl)} por auto de infração, UFIR ${NR28_UFIR_UNIT_BRL})`,
      "",
      "Nota metodológica: Cenário puramente ilustrativo com fórmulas abertas para revisão interna. Não é previsão financeira, ROI, auditoria nem garantia de conformidade.",
    ].join("\n");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = summaryText;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Resumo executivo copiado para a área de transferência.");
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      toast.error("Não foi possível copiar automaticamente. Tente novamente.");
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-elevated dark:border-white/10">
      {/* Filete óptico superior */}
      <div
        className="h-1 w-full bg-gradient-to-r from-primary via-amber-500 to-destructive/80"
        aria-hidden="true"
      />

      {/* Cabeçalho + Presets Rápidos de Porte */}
      <div className="px-6 md:px-10 pt-7 pb-6 border-b border-border bg-gradient-to-br from-primary/[0.04] via-card to-card dark:border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-center shrink-0 dark:bg-amber-400/10 dark:border-amber-400/25">
              <Calculator className="h-5 w-5 text-amber-700 dark:text-amber-300" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
                Simulador de custos organizacionais
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                Explore como premissas escolhidas alteram um cenário ilustrativo de custos.
                As fórmulas ficam visíveis para revisão; não é previsão financeira, ROI ou auditoria.
              </p>
            </div>
          </div>

          {/* Controles de Preset de Porte */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-muted/50 p-1 dark:border-white/10 dark:bg-white/[0.04]">
            {PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setV(preset.values)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? "bg-card text-foreground shadow-sm border border-border dark:bg-primary dark:text-primary-foreground dark:border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setV(DEFAULTS)}
              aria-label="Restaurar premissas padrão"
              title="Restaurar premissas padrão"
              className="inline-flex items-center justify-center rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Coluna Esquerda: Premissas Ilustrativas (Sliders Modernos) */}
        <div className="lg:col-span-5 p-6 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-border bg-muted/20 dark:border-white/10 dark:bg-white/[0.015]">
          <div className="flex items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Premissas ilustrativas</span>
            </p>
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
              Folha anual: {fmtBRL(calc.annualPayroll)}
            </span>
          </div>

          <div className="space-y-4">
            {FIELDS.map((f) => {
              const pct = ((v[f.key] - f.min) / (f.max - f.min)) * 100;
              return (
                <div key={f.key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor={`impact-${f.key}`} className="text-xs font-semibold text-foreground/90">
                      {f.label}
                    </label>
                    <span className="text-xs font-mono font-bold text-foreground tabular-nums">
                      {f.prefix || ""}
                      {v[f.key].toLocaleString("pt-BR")}
                      {f.suffix || ""}
                    </span>
                  </div>
                  <input
                    id={`impact-${f.key}`}
                    type="range"
                    min={f.min}
                    max={f.max}
                    step={f.step}
                    value={v[f.key]}
                    onChange={(e) => setV({ ...v, [f.key]: Number(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary dark:accent-amber-400"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--muted)) ${pct}%, hsl(var(--muted)) 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Comparação Lateral Dinâmica com Exposição Normativa da NR-28 */}
          <div className="mt-6 rounded-2xl border border-amber-200/90 bg-amber-50/65 p-4 space-y-2.5 dark:border-amber-400/25 dark:bg-amber-500/[0.08]">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Scale className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Faixa NR-28 para este porte</span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-amber-800 dark:text-amber-200 tabular-nums">
                {nr28Bracket.label}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
              <span className="font-mono text-base font-extrabold text-amber-900 dark:text-amber-300 tabular-nums">
                <AnimatedNumber value={nr28Bracket.minBrl} format={fmtBRLCents} updateDuration={320} /> a{" "}
                <AnimatedNumber value={nr28Bracket.maxBrl} format={fmtBRLCents} updateDuration={320} />
              </span>
              <span className="text-[11px] font-mono text-amber-900/80 dark:text-amber-200/80 tabular-nums">
                {nr28Bracket.minUfir.toLocaleString("pt-BR")}–{nr28Bracket.maxUfir.toLocaleString("pt-BR")} UFIR
              </span>
            </div>
            <p className="text-[11px] text-amber-950/85 dark:text-slate-200/85 leading-relaxed">
              Referência por auto de infração (Tipo S · Grau 4, UFIR {NR28_UFIR_UNIT_BRL}). A autuação é apenas a
              ponta visível: o custo organizacional recorrente e o efeito cascata (FAP/RAT e passivos) ampliam o
              impacto total.
            </p>
            <a
              href="#benchmark-nr28"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline dark:text-amber-300"
            >
              <span>Ver quadro completo NR-1 × NR-28</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Coluna Direita: Painel Executivo de Resultados + Gráfico + Sensibilidade */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
          {/* Bloco Principal de Custo Anual com Contagem Fluida */}
          <div className="rounded-2xl border border-red-200/90 bg-red-50/55 p-5 md:p-6 dark:border-red-400/25 dark:bg-red-500/[0.08]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Custo anual ilustrativo sob estas premissas</span>
              </p>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-accent transition-colors whitespace-nowrap shrink-0 dark:border-white/15 dark:bg-slate-900/80"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <span>Resumo copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span>Copiar resumo executivo</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
              <p className="font-display text-3xl sm:text-4xl md:text-[2.6rem] font-extrabold tracking-tight text-red-700 dark:text-red-400 leading-none">
                <AnimatedNumber value={calc.total} format={fmtBRL} initialDuration={1000} updateDuration={320} />
              </p>
              <span className="text-xs font-mono font-semibold text-red-800/85 dark:text-red-300/90 tabular-nums">
                {calc.payrollShare.toFixed(1)}% da massa salarial anual
              </span>
            </div>

            <div className="mt-4 pt-3.5 border-t border-red-200/70 dark:border-red-400/20 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-muted-foreground">
              <span>
                <strong className="text-foreground">
                  <AnimatedNumber value={calc.perMonth} format={fmtBRL} updateDuration={320} />
                </strong>
                /mês
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-foreground">
                  <AnimatedNumber value={calc.perEmployee} format={fmtBRL} updateDuration={320} />
                </strong>
                /colaborador ao ano
              </span>
            </div>
          </div>

          {/* Gráfico Visual Interativo de Composição do Custo */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-foreground">Composição proporcional do cenário</p>
              <span className="text-[11px] text-muted-foreground">
                Passe o cursor ou selecione um componente para inspecionar
              </span>
            </div>

            {/* Barra Empilhada Interativa */}
            <div
              className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted p-0.5 gap-0.5 dark:bg-white/10"
              role="img"
              aria-label="Distribuição proporcional dos quatro componentes de custo organizacional"
            >
              {lines.map((segment) => {
                const isDimmed = activeSegment !== null && activeSegment !== segment.id;
                return (
                  <button
                    key={segment.id}
                    type="button"
                    onMouseEnter={() => setActiveSegment(segment.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                    onFocus={() => setActiveSegment(segment.id)}
                    onBlur={() => setActiveSegment(null)}
                    aria-label={`${segment.label}: ${segment.share.toFixed(1)}%`}
                    className={`h-full rounded-full transition-all duration-300 ${segment.barColor} ${
                      isDimmed ? "opacity-35" : "opacity-100"
                    }`}
                    style={{ width: `${Math.max(segment.share, segment.value > 0 ? 3 : 0)}%` }}
                  />
                );
              })}
            </div>

            {/* Legenda Limpa + 4 Cartões de Fórmula Sincronizados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {lines.map((l) => {
                const isHighlighted = activeSegment === l.id;
                return (
                  <div
                    key={l.id}
                    onMouseEnter={() => setActiveSegment(l.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                    className={`rounded-xl border p-3.5 transition-all duration-200 ${
                      isHighlighted
                        ? "border-primary/50 bg-accent/40 shadow-sm -translate-y-0.5 dark:border-primary/60 dark:bg-primary/10"
                        : "border-border bg-background hover:border-border/90 dark:border-white/10 dark:bg-slate-950/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/90">
                        <span className={`h-2 w-2 rounded-sm shrink-0 ${l.dotColor}`} aria-hidden="true" />
                        <span>{l.label}</span>
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-muted-foreground tabular-nums">
                        {l.share.toFixed(1)}%
                      </span>
                    </div>
                    <p className="mt-1.5 font-mono text-base font-bold text-foreground tabular-nums">
                      <AnimatedNumber value={l.value} format={fmtBRL} updateDuration={320} />
                    </p>
                    <p className="mt-1 text-[10px] font-mono text-muted-foreground/85 leading-snug">{l.formula}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulação de Sensibilidade Aritmética (Hipóteses de 10%, 20% e 30%) */}
          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/55 p-4 md:p-5 dark:border-emerald-400/25 dark:bg-emerald-500/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Sensibilidade aritmética por faixa de mitigação
                </p>
                <p className="text-[11px] text-emerald-950/80 dark:text-slate-300 mt-0.5">
                  Hipótese puramente ilustrativa aplicada sobre o custo anual calculado:
                </p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-card p-1 self-start sm:self-center dark:border-emerald-400/25 dark:bg-slate-950/70">
                {MITIGATION_OPTIONS.map((pct) => {
                  const active = mitigationPct === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setMitigationPct(pct)}
                      className={`rounded-lg px-3 py-1 text-xs font-mono font-bold transition-colors tabular-nums whitespace-nowrap ${
                        active
                          ? "bg-emerald-700 text-white dark:bg-emerald-500 dark:text-slate-950"
                          : "text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-white/[0.06]"
                      }`}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-emerald-200/80 dark:border-emerald-400/20 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-[11px] text-emerald-950/80 dark:text-slate-300">
                  Variação ilustrativa sob hipótese de {mitigationPct}%
                </span>
                <p className="font-display text-2xl md:text-3xl font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight mt-0.5">
                  <AnimatedNumber value={calc.mitigationAnnual} format={fmtBRL} updateDuration={320} />
                  <span className="text-xs font-mono font-medium text-emerald-900/75 dark:text-emerald-200/80 ml-1.5">
                    /ano
                  </span>
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-900/85 dark:text-emerald-200 tabular-nums">
                ≈ <AnimatedNumber value={calc.mitigationMonthly} format={fmtBRL} updateDuration={320} />/mês
              </span>
            </div>
          </div>

          {/* Aviso Metodológico Obrigatório */}
          <div className="flex items-start gap-2.5 text-[11px] text-muted-foreground bg-muted/40 border border-border rounded-xl p-3.5 leading-relaxed dark:border-white/10 dark:bg-white/[0.03]">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">Próximo passo responsável</p>
              <p className="mt-0.5">
                Use este cenário para revisar premissas, contextualizar o trabalho real e decidir o que investigar. Ele
                não prevê retorno financeiro, economia garantida, eficácia de intervenção ou conformidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
