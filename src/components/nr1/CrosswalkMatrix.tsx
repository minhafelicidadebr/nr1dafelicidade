import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network, ChevronDown, AlertOctagon, Sparkles, Layers,
  BookMarked, ArrowUpRight, Filter,
} from "lucide-react";
import {
  nr1Crosswalk, evidenceColor, priorityLabel,
  type CrosswalkItem, type Priority,
} from "@/data/nr1Crosswalk";

const PRIORITY_FILTERS: { id: "ALL" | Priority; label: string }[] = [
  { id: "ALL", label: "Todos" },
  { id: "P0", label: "P0 · Crítico" },
  { id: "P1", label: "P1 · Alto" },
  { id: "P2", label: "P2 · Médio" },
];

const PRIORITY_TINT: Record<Priority, string> = {
  P0: "border-destructive/40 bg-destructive/10 text-destructive",
  P1: "border-[hsl(40_90%_55%/0.4)] bg-[hsl(40_90%_55%/0.1)] text-[hsl(40_95%_70%)]",
  P2: "border-primary/30 bg-primary/10 text-primary",
};

export default function CrosswalkMatrix() {
  const [filter, setFilter] = useState<"ALL" | Priority>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      filter === "ALL"
        ? nr1Crosswalk.items
        : nr1Crosswalk.items.filter((i) => i.priority === filter),
    [filter],
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 mb-3">
            <Network className="h-3.5 w-3.5 text-secondary" />
            <span className="text-2xs font-bold uppercase tracking-[0.18em] text-secondary">
              Mapa exploratório · fatores do trabalho × referências
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
            Do contexto à ação:{" "}
            <span style={{
              backgroundImage: "linear-gradient(110deg, hsl(183 70% 55%), hsl(40 90% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>matriz de relações para revisão</span>
          </h2>
          <p className="mt-2 text-sm text-surface-deep-muted max-w-2xl leading-relaxed">
            Relações exploratórias entre fatores de trabalho, dimensões de referência e drivers de aprendizagem.
            Pesos, bandas e possibilidades de ação exigem revisão técnica; referências externas não validam o produto.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-surface-deep-muted mr-1" />
          {PRIORITY_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-2xs font-bold uppercase tracking-wider rounded-lg border px-3 py-1.5 transition-all ${
                filter === f.id
                  ? "border-primary bg-primary/15 text-primary shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-surface-deep-muted hover:border-white/25"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* MEASURE → UNDERSTAND → ACT */}
      <div className="grid md:grid-cols-3 gap-3">
        {nr1Crosswalk.measureFramework.phases.map((p, i) => (
          <motion.div
            key={p.phase}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider">{p.phase}</h3>
            </div>
            <p className="text-xs text-surface-deep-muted leading-relaxed italic mb-3">
              "{p.principle}"
            </p>
            <ul className="space-y-1 text-2xs text-surface-deep-muted">
              {(p.instruments ?? p.activities ?? []).slice(0, 4).map((x) => (
                <li key={x} className="flex items-start gap-1.5">
                  <span className="text-primary/60 mt-0.5">▸</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ITEMS */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <CrosswalkRow
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            delay={i * 0.03}
          />
        ))}
      </div>

      {/* SOURCES */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookMarked className="h-3.5 w-3.5 text-primary" />
          <h4 className="font-display text-xs font-bold uppercase tracking-wider">
            Fontes científicas e regulatórias
          </h4>
        </div>
        <ul className="grid sm:grid-cols-2 gap-1.5 text-2xs text-surface-deep-muted">
          {nr1Crosswalk.sources.map((s) => (
            <li key={s} className="flex items-start gap-1.5">
              <span className="text-secondary/70 mt-0.5">◆</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-surface-deep-muted/70">
          Versão {nr1Crosswalk.version} · atualizada em {nr1Crosswalk.updatedAt}
        </p>
      </div>
    </div>
  );
}

/* ───────────── ROW ───────────── */
function CrosswalkRow({
  item, open, onToggle, delay,
}: {
  item: CrosswalkItem;
  open: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const driversSorted = Object.entries(item.driverWeights).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`rounded-2xl border bg-white/[0.03] overflow-hidden transition-all ${
        open ? "border-primary/40 shadow-glow" : "border-white/10 hover:border-white/20"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        {/* PRIORITY CHIP */}
        <div className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 ${PRIORITY_TINT[item.priority]}`}>
          {item.criticalFlag && <AlertOctagon className="h-3 w-3" />}
          <span className="text-2xs font-bold">{item.priority}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-mono text-surface-deep-muted">{item.id}</span>
            {item.criticalFlag && (
              <span className="text-2xs font-bold text-destructive uppercase tracking-wider">
                · Risco crítico
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-bold leading-tight mb-1.5">
            {item.riskFactor}
          </h3>
          <p className="text-xs text-surface-deep-muted leading-relaxed line-clamp-2">
            {item.nr1Implication}
          </p>

          {/* META ROW */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {item.mteFactors.map((m) => (
              <span key={m} className="text-[10px] font-mono rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 text-surface-deep-muted">
                {m}
              </span>
            ))}
            <span className="text-[10px] text-surface-deep-muted/60">·</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5"
              style={{
                color: evidenceColor(item.evidenceLevel),
                background: `${evidenceColor(item.evidenceLevel)}1a`,
                border: `1px solid ${evidenceColor(item.evidenceLevel)}40`,
              }}
            >
              Referência declarada · {item.evidenceLevel.replace("_", " ")}
            </span>
            <span className="text-[10px] text-surface-deep-muted/60">·</span>
            <span className="text-[10px] text-surface-deep-muted">
              Faixa exploratória S{item.aihaDefaultSeverity}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-surface-deep-muted shrink-0 mt-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10"
          >
            <div className="p-5 grid md:grid-cols-2 gap-5">
              {/* COPSOQ DIMENSIONS */}
              <Block icon={Layers} title="Dimensões COPSOQ II">
                <div className="flex flex-wrap gap-1.5">
                  {item.copsoqDimensions.map((d) => (
                    <span key={d} className="text-2xs font-mono rounded-md border border-primary/25 bg-primary/10 text-primary px-2 py-1">
                      {d}
                    </span>
                  ))}
                </div>
              </Block>

              {/* DRIVERS w/ weights */}
              <Block icon={Sparkles} title="Drivers Playbook (peso)">
                <ul className="space-y-1.5">
                  {driversSorted.map(([driver, w]) => (
                    <li key={driver} className="flex items-center gap-2">
                      <span className="text-2xs capitalize w-32 truncate">{driver.replace("_", " ")}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${w * 100}%`,
                            background: "linear-gradient(90deg, hsl(183 70% 50%), hsl(40 90% 55%))",
                          }}
                        />
                      </div>
                      <span className="text-2xs font-mono text-surface-deep-muted w-8 text-right">
                        {w.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Block>

              {/* LOGIC */}
              <Block icon={Sparkles} title="Lógica de intervenção" full>
                <p className="text-xs leading-relaxed text-surface-deep-muted">
                  {item.interventionLogic}
                </p>
              </Block>

              {/* INTERVENTIONS */}
              <Block icon={ArrowUpRight} title="Possibilidades para revisão" full>
                <div className="flex flex-wrap gap-1.5">
                  {item.interventionIds.map((id) => (
                    <span key={id} className="text-2xs font-mono rounded-md border border-secondary/30 bg-secondary/10 text-secondary px-2 py-1">
                      {id}
                    </span>
                  ))}
                </div>
              </Block>

              {/* META */}
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-surface-deep-muted/70 mb-0.5">
                    Prioridade
                  </div>
                  <div className="text-xs font-bold">{priorityLabel(item.priority)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-surface-deep-muted/70 mb-0.5">
                    Evidência
                  </div>
                  <div className="text-xs text-surface-deep-muted">{item.evidenceSource}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] uppercase tracking-wider text-surface-deep-muted/70 mb-0.5">
                    Referência Playbook
                  </div>
                  <div className="text-xs text-surface-deep-muted italic">{item.playbookPageRef}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Block({
  icon: Icon, title, children, full,
}: {
  icon: typeof Layers;
  title: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="h-3 w-3 text-primary" />
        <h4 className="text-2xs font-bold uppercase tracking-wider text-surface-deep-fg">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}
