import { AlertTriangle, ExternalLink, Scale, ShieldAlert } from "lucide-react";
import { Link } from "@/lib/router/compat";
import {
  NR28_CASCADE_IMPACTS,
  NR28_FINE_BRACKETS,
  NR28_UFIR_UNIT_BRL,
  type Nr28FineBracket,
} from "@/data/homeConversionData";
import { AnimatedNumber } from "@/components/home/AnimatedNumber";

const fmtBrlCents = (val: number) =>
  val.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function AnimatedFineValue({ row }: { row: Nr28FineBracket }) {
  if (row.isSingleCeiling) {
    return (
      <div className="flex flex-col sm:items-end">
        <span
          className={`font-mono font-extrabold tracking-tight leading-none ${
            row.isCeiling
              ? "text-lg md:text-xl text-red-700 dark:text-amber-300"
              : "text-base md:text-lg text-amber-800 dark:text-amber-300"
          }`}
        >
          <AnimatedNumber value={row.maxBrl} format={fmtBrlCents} initialDuration={1050} />
        </span>
        <span className="mt-1 text-[11px] font-medium text-muted-foreground">
          {row.isCeiling ? "teto por auto de infração" : "teto por infração"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:items-end">
      <div className="font-mono text-base md:text-lg font-extrabold tracking-tight text-amber-800 dark:text-amber-300 leading-tight">
        <AnimatedNumber value={row.maxBrl} format={fmtBrlCents} initialDuration={1000} />
      </div>
      <span className="mt-0.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
        de <AnimatedNumber value={row.minBrl} format={fmtBrlCents} initialDuration={880} /> a{" "}
        {fmtBrlCents(row.maxBrl)}
      </span>
    </div>
  );
}

export default function Nr28BenchmarkPanel() {
  return (
    <div
      id="benchmark-nr28"
      className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-elevated dark:border-white/10 dark:bg-card/90"
    >
      {/* Filete óptico superior de rigor regulatório */}
      <div
        className="h-1 w-full bg-gradient-to-r from-amber-500 via-destructive/80 to-primary/70"
        aria-hidden="true"
      />

      <div className="p-6 md:p-8">
        {/* Cabeçalho Executivo do Benchmark */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-border dark:border-white/10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">
              <span>Benchmark Regulatório</span>
              <span className="text-border dark:text-white/25" aria-hidden="true">·</span>
              <span>NR-1 × NR-28 (Anexos I e II)</span>
              <span className="text-border dark:text-white/25" aria-hidden="true">·</span>
              <span className="tabular-nums">Base UFIR {NR28_UFIR_UNIT_BRL}</span>
            </div>
            <h3 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground tracking-[-0.02em] text-balance">
              Quanto custa ignorar a NR-1? Da autuação direta ao efeito cascata.
            </h3>
            <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
              A NR-1 não fixa valores isolados: as penalidades seguem a gradação oficial da{" "}
              <strong className="font-semibold text-foreground">NR-28</strong> (atualizada no Anexo II pela Portaria
              MTE nº 1.758/2026), combinando tipo de infração, grau (1 a 4) e porte da empresa — mas o impacto
              financeiro decisivo nasce do efeito cascata sobre a folha e o passivo trabalhista.
            </p>
          </div>

          <Link
            to="/planos#regulatorio"
            className="inline-flex items-center gap-2 self-start lg:self-end rounded-xl border border-amber-300/90 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 hover:border-amber-400 transition-colors whitespace-nowrap shrink-0 dark:border-amber-400/35 dark:bg-amber-400/10 dark:text-amber-200 dark:hover:bg-amber-400/20"
          >
            <span>Ver fontes oficiais no Pulso Regulatório</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Grade Assimétrica: Tabela NR-28 (Esquerda) + Efeito Cascata (Direita) */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Coluna 1: Tabela Oficial NR-28 (UFIR & Equivalente em R$) */}
          <div className="lg:col-span-7 min-w-0 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
                <span>01. Faixas Oficiais da NR-28 (por auto de infração)</span>
              </h4>
              <span className="text-xs font-mono font-medium text-muted-foreground tabular-nums">
                1 UFIR = {NR28_UFIR_UNIT_BRL}
              </span>
            </div>

            {/* Tabela Editorial Responsiva (Desktop >= 640px) */}
            <div className="hidden sm:block overflow-x-auto rounded-2xl border border-border bg-background shadow-sm dark:border-white/10 dark:bg-slate-950/70">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/70 text-muted-foreground dark:border-white/10 dark:bg-white/[0.04]">
                    <th className="py-3.5 px-4 font-semibold tracking-tight">Enquadramento & Porte</th>
                    <th className="py-3.5 px-3 font-semibold whitespace-nowrap tracking-tight">Base UFIR</th>
                    <th className="py-3.5 px-4 font-semibold text-right whitespace-nowrap tracking-tight">
                      Valor por Auto (R$)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80 dark:divide-white/[0.08]">
                  {NR28_FINE_BRACKETS.map((row) => (
                    <tr
                      key={row.id}
                      className={`group transition-colors ${
                        row.isCeiling
                          ? "bg-amber-50/60 hover:bg-amber-50/95 dark:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.13]"
                          : "hover:bg-muted/40 dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <p className="font-semibold text-foreground leading-snug">{row.category}</p>
                          {row.isCeiling && (
                            <span className="text-[11px] font-mono font-semibold text-red-700 dark:text-red-300">
                              · Teto máximo
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                          {row.degree}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{row.note}</p>
                      </td>
                      <td className="py-4 px-3 align-top font-mono text-[11px] font-medium text-foreground/90 tabular-nums whitespace-nowrap">
                        {row.ufirRange}
                        <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                          {row.normBasis}
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                        <AnimatedFineValue row={row} />
                        {/* Indicador sutil de severidade relativa ao teto de 6.304 UFIR */}
                        <div
                          className="mt-2 ml-auto h-1.5 w-28 overflow-hidden rounded-full bg-muted dark:bg-white/10"
                          aria-hidden="true"
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              row.isCeiling
                                ? "bg-red-600 dark:bg-red-400"
                                : "bg-amber-500 dark:bg-amber-400"
                            }`}
                            style={{ width: `${row.severityRatio}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cartões Empilhados (Mobile < 640px — zero corte horizontal) */}
            <div className="sm:hidden space-y-3">
              {NR28_FINE_BRACKETS.map((row) => (
                <div
                  key={row.id}
                  className={`rounded-2xl border p-4 space-y-2.5 shadow-sm transition-transform duration-200 ${
                    row.isCeiling
                      ? "border-amber-300/90 bg-amber-50/60 dark:border-amber-400/35 dark:bg-amber-500/[0.08]"
                      : "border-border bg-background dark:border-white/10 dark:bg-slate-950/70"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-foreground leading-snug">{row.category}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      {row.degree}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-border/80 dark:border-white/10 space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-[11px] font-mono font-medium text-muted-foreground tabular-nums">
                        {row.ufirRange}
                      </span>
                      <AnimatedFineValue row={row} />
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-muted dark:bg-white/10"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full rounded-full ${
                          row.isCeiling ? "bg-red-600 dark:bg-red-400" : "bg-amber-500 dark:bg-amber-400"
                        }`}
                        style={{ width: `${row.severityRatio}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">{row.note}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/90">{row.normBasis}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna 2: Efeito Cascata Financeiro & Jurídico */}
          <div className="lg:col-span-5 min-w-0 space-y-4">
            <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />
              <span>02. Efeito Cascata (Onde Mora o Maior Passivo)</span>
            </h4>

            <div className="space-y-3">
              {NR28_CASCADE_IMPACTS.map((impact) => (
                <article
                  key={impact.id}
                  className="group relative rounded-2xl border border-border bg-background p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300/90 hover:shadow-md dark:border-white/10 dark:bg-slate-950/70 dark:hover:border-red-400/40"
                >
                  <div className="flex items-baseline justify-between gap-2.5">
                    <h5 className="font-display text-xs md:text-[13px] font-bold text-foreground leading-snug">
                      <span className="mr-1.5 font-mono text-[11px] font-semibold text-red-700/80 dark:text-red-400/85 tabular-nums">
                        {impact.indexLabel}.
                      </span>
                      {impact.title}
                    </h5>
                    <span className="text-[11px] font-mono font-semibold text-red-700 dark:text-red-300 whitespace-nowrap shrink-0 tabular-nums">
                      {impact.metricTag}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{impact.description}</p>
                  <p className="mt-2.5 pt-2 border-t border-border/70 text-[10px] font-mono text-muted-foreground/90 dark:border-white/[0.08]">
                    {impact.legalBasis}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Nota Jurídica e Metodológica Transparente */}
        <div className="mt-7 rounded-2xl border border-amber-200/90 bg-amber-50/75 px-4 py-3.5 flex items-start gap-3 dark:border-amber-400/25 dark:bg-amber-500/[0.08]">
          <AlertTriangle
            className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-[11px] text-amber-950/90 dark:text-slate-200/90 leading-relaxed">
            <strong className="font-semibold text-amber-950 dark:text-white">
              Nota de governança e limites:
            </strong>{" "}
            Os valores acima refletem a conversão aritmética da tabela oficial da NR-28 (base UFIR{" "}
            {NR28_UFIR_UNIT_BRL}) e dependem do porte, grau e enquadramento fiscal específico definido pela
            inspeção do trabalho. A plataforma organiza evidências preventivas para o ciclo GRO/PGR, mas não
            garante conformidade automática e não substitui o responsável técnico ou a validação jurídica e
            técnica.
          </p>
        </div>
      </div>
    </div>
  );
}
