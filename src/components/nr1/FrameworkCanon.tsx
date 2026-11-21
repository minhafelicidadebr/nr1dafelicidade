import { motion } from "framer-motion";
import {
  ClipboardList, Search, BarChart3, Shield, FileCheck, RefreshCw,
  ShieldCheck, AlertTriangle, Scale, BookOpen, Sparkles, type LucideIcon,
} from "lucide-react";
import { nr1Framework, aihaBand } from "@/data/nr1Framework";

const ICONS: Record<string, LucideIcon> = {
  ClipboardList, Search, BarChart3, Shield, FileCheck, RefreshCw,
};

const STAGE_TONE: Record<string, { ring: string; chip: string; text: string }> = {
  blue:   { ring: "ring-[hsl(210_85%_60%/.35)]", chip: "bg-[hsl(210_85%_60%/.12)] text-[hsl(210_85%_75%)]", text: "text-[hsl(210_85%_75%)]" },
  amber:  { ring: "ring-[hsl(40_90%_55%/.35)]",  chip: "bg-[hsl(40_90%_55%/.12)]  text-[hsl(40_95%_70%)]",  text: "text-[hsl(40_95%_70%)]" },
  orange: { ring: "ring-[hsl(24_90%_55%/.35)]",  chip: "bg-[hsl(24_90%_55%/.12)]  text-[hsl(24_95%_70%)]",  text: "text-[hsl(24_95%_70%)]" },
  green:  { ring: "ring-[hsl(150_60%_45%/.35)]", chip: "bg-[hsl(150_60%_45%/.12)] text-[hsl(150_65%_70%)]", text: "text-[hsl(150_65%_70%)]" },
  purple: { ring: "ring-[hsl(270_70%_65%/.35)]", chip: "bg-[hsl(270_70%_65%/.12)] text-[hsl(270_75%_80%)]", text: "text-[hsl(270_75%_80%)]" },
  indigo: { ring: "ring-[hsl(245_75%_65%/.35)]", chip: "bg-[hsl(245_75%_65%/.12)] text-[hsl(245_80%_80%)]", text: "text-[hsl(245_80%_80%)]" },
};

const PRIORITY_TONE: Record<string, string> = {
  P0: "bg-destructive/15 text-destructive border-destructive/30",
  P1: "bg-[hsl(40_90%_55%/.15)] text-[hsl(40_95%_70%)] border-[hsl(40_90%_55%/.30)]",
  P2: "bg-white/5 text-surface-deep-muted border-white/15",
};

export default function FrameworkCanon() {
  return (
    <div className="space-y-14">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-7"
      >
        <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          {nr1Framework.frameworkName} · v{nr1Framework.version}
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
          Jornada orientativa NR-1 — <span className="italic font-light text-surface-deep-fg/70">do contexto à evidência para revisão</span>
        </h2>
        <p className="mt-3 text-sm md:text-base text-surface-deep-muted max-w-3xl leading-relaxed">
          Modelo exploratório com referências externas versionadas. Não constitui laudo, interpretação oficial da NR-1
          ou substituto de avaliação técnica competente.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {nr1Framework.legalBasis.map((law) => (
            <span key={law} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-2xs text-surface-deep-muted">
              <BookOpen className="h-3 w-3 opacity-70" /> {law}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 7 PRINCIPLES */}
      <section>
        <SectionTitle eyebrow="Princípios" title="7 pilares para orientar a conversa sobre GRO/PGR psicossocial" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {nr1Framework.principles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xs font-mono text-primary bg-primary/10 border border-primary/25 rounded-md px-1.5 py-0.5">{p.id}</span>
                <span className="text-2xs text-surface-deep-subtle font-mono">{p.nr1Reference}</span>
              </div>
              <h4 className="font-display text-sm font-bold mb-1.5">{p.name}</h4>
              <p className="text-xs text-surface-deep-muted leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6-STAGE CYCLE */}
      <section>
        <SectionTitle eyebrow="Ciclo PDCA aplicado" title="6 etapas para organizar contexto, ação e evidência" />
        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nr1Framework.cycle.map((stage, i) => {
            const Icon = ICONS[stage.icon] ?? Sparkles;
            const tone = STAGE_TONE[stage.color] ?? STAGE_TONE.blue;
            return (
              <motion.li
                key={stage.id}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ${tone.ring}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] rounded-full px-2.5 py-1 ${tone.chip}`}>
                    Etapa {stage.order}
                  </span>
                  <Icon className={`h-5 w-5 ${tone.text}`} />
                </div>
                <h4 className="font-display text-base font-bold mb-1">{stage.name}</h4>
                <p className="text-xs text-surface-deep-muted leading-relaxed mb-3">{stage.description}</p>

                <details className="group">
                  <summary className="cursor-pointer text-2xs font-semibold text-surface-deep-fg/80 hover:text-surface-deep-fg select-none">
                    Atividades-chave · saídas
                  </summary>
                  <div className="mt-3 space-y-3 text-2xs">
                    <div>
                      <div className="font-bold text-surface-deep-fg/85 mb-1">Atividades</div>
                      <ul className="space-y-1 text-surface-deep-muted list-disc list-inside marker:text-primary/60">
                        {stage.keyActivities.map((a) => <li key={a}>{a}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold text-surface-deep-fg/85 mb-1">Saídas</div>
                      <ul className="space-y-1 text-surface-deep-muted list-disc list-inside marker:text-secondary/70">
                        {stage.outputs.map((a) => <li key={a}>{a}</li>)}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stage.nr1References.map((r) => (
                        <span key={r} className="text-[10px] font-mono text-surface-deep-subtle bg-white/[0.04] border border-white/10 rounded px-1.5 py-0.5">{r}</span>
                      ))}
                    </div>
                  </div>
                </details>
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* HIERARCHY OF CONTROLS */}
      <section>
        <SectionTitle eyebrow="Hierarquia de Controles" title="Eliminar antes de mitigar — antes de delegar ao indivíduo" />
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {nr1Framework.cycle[3].controlHierarchy?.map((c, i) => (
            <div key={c.level} className={`flex items-start gap-4 p-4 ${i > 0 ? "border-t border-white/5" : ""}`}>
              <div className="shrink-0 h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-display text-lg font-bold">
                {c.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-display text-sm font-bold">{c.name}</h5>
                  <span className={`text-[10px] font-mono border rounded px-1.5 py-0.5 ${PRIORITY_TONE[c.priority] ?? PRIORITY_TONE.P2}`}>{c.priority}</span>
                </div>
                <p className="text-xs text-surface-deep-muted mt-1 leading-relaxed">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13 MTE FACTORS */}
      <section>
        <SectionTitle
          eyebrow="Fatores psicossociais · referência externa"
          title="13 fatores de referência para discussão técnica"
          subtitle="Mapeamentos exploratórios entre dimensões e drivers. Não constituem instrumento validado, scoring ou diagnóstico."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nr1Framework.thirteenMteFactors.map((f) => {
            const critical = "criticalFlag" in f && f.criticalFlag === true;
            return (
            <div
              key={f.id}
              className={`rounded-xl border bg-white/[0.03] p-4 ${
                critical ? "border-destructive/30 bg-destructive/[0.04]" : "border-white/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xs font-mono text-surface-deep-muted">{f.id}</span>
                <span className={`text-[10px] font-mono border rounded px-1.5 py-0.5 ${PRIORITY_TONE[f.priority] ?? PRIORITY_TONE.P2}`}>{f.priority}</span>
                {critical && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive uppercase tracking-wider">
                    <AlertTriangle className="h-3 w-3" /> Crítico
                  </span>
                )}
              </div>
              <h5 className="text-sm font-semibold leading-snug">{f.name}</h5>
              <div className="mt-2 flex flex-wrap gap-1">
                {f.copsoqDimensions.map((d) => (
                  <span key={d} className="text-[10px] font-mono text-primary/85 bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5">
                    {d}
                  </span>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* AIHA 5x5 MATRIX */}
      <section>
        <SectionTitle
          eyebrow="Matriz AIHA 5×5"
          title="Probabilidade × Severidade — bandas de tolerabilidade"
          subtitle={nr1Framework.aihaMatrix.source}
        />
        <div
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 overflow-x-auto"
          role="region"
          aria-label="Tabela de requisitos e evidências da NR-1"
          tabIndex={0}
        >
          <table className="w-full border-collapse text-2xs min-w-[520px]">
            <thead>
              <tr>
                <th className="p-2 text-left text-surface-deep-subtle font-semibold">Prob. ↓ / Sev. →</th>
                {nr1Framework.aihaMatrix.severity.map((s) => (
                  <th key={s.level} className="p-2 text-center text-surface-deep-fg/90 font-semibold" title={s.description}>
                    {s.level}. {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nr1Framework.aihaMatrix.probability.map((p) => (
                <tr key={p.level} className="border-t border-white/5">
                  <td className="p-2 text-surface-deep-fg/90 font-semibold" title={p.description}>{p.level}. {p.name}</td>
                  {nr1Framework.aihaMatrix.severity.map((s) => {
                    const score = p.level * s.level;
                    const band = aihaBand(score);
                    const bg: Record<string, string> = {
                      green: "bg-[hsl(150_55%_40%/.35)]",
                      lime: "bg-[hsl(95_60%_45%/.35)]",
                      amber: "bg-[hsl(40_90%_55%/.35)]",
                      orange: "bg-[hsl(24_90%_55%/.40)]",
                      red: "bg-[hsl(0_75%_50%/.45)]",
                    };
                    return (
                      <td key={s.level} className={`p-2 text-center font-mono font-bold ${bg[band.color] ?? "bg-white/5"}`} title={`${band.level} · ${band.action}`}>
                        {score}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {nr1Framework.aihaMatrix.riskBands.map((b) => (
              <div key={b.level} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{
                    background:
                      b.color === "green"  ? "hsl(150 55% 45%)" :
                      b.color === "lime"   ? "hsl(95 60% 50%)"  :
                      b.color === "amber"  ? "hsl(40 90% 55%)"  :
                      b.color === "orange" ? "hsl(24 90% 55%)"  :
                                             "hsl(0 75% 55%)",
                  }} />
                  <span className="text-2xs font-bold uppercase tracking-wider">{b.level}</span>
                </div>
                <p className="text-[10px] text-surface-deep-muted leading-relaxed">{b.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE SIZE + DISCLAIMERS */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.05] p-5">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Scale className="h-4 w-4" />
            <h5 className="font-display text-sm font-bold uppercase tracking-wider">Regra de amostra mínima</h5>
          </div>
          <p className="text-3xl font-display font-bold mb-1">n ≥ {nr1Framework.minimumSampleSize.default}</p>
          <p className="text-xs text-surface-deep-muted leading-relaxed">{nr1Framework.minimumSampleSize.description}</p>
          <p className="text-[10px] text-surface-deep-subtle mt-2 italic">Fonte: {nr1Framework.minimumSampleSize.source}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-2 mb-3 text-secondary">
            <AlertTriangle className="h-4 w-4" />
            <h5 className="font-display text-sm font-bold uppercase tracking-wider">Disclaimers técnico-jurídicos</h5>
          </div>
          <ul className="space-y-2 text-2xs text-surface-deep-muted">
            {nr1Framework.disclaimers.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">▸</span>
                <span className="leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="text-2xs font-bold uppercase tracking-[0.2em] text-secondary mb-2">{eyebrow}</div>
      <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">{title}</h3>
      {subtitle && <p className="mt-1.5 text-sm text-surface-deep-muted max-w-2xl">{subtitle}</p>}
    </div>
  );
}
