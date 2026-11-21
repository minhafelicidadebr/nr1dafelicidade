import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library, ChevronDown, AlertOctagon, Filter, ShieldCheck, Clock,
  Wallet, ListChecks, Gauge, BookMarked, Sparkles, AlertTriangle,
} from "lucide-react";
import {
  nr1Interventions, costLabel, timeLabel, preventionLabel,
  interventionQuadrant,
  type Intervention,
} from "@/data/nr1Interventions";
import { evidenceColor } from "@/data/nr1Crosswalk";

type DriverFilter = "ALL" | string;

const QUADRANT_TINT: Record<string, string> = {
  green: "border-[hsl(150_55%_45%/0.4)] bg-[hsl(150_55%_45%/0.1)] text-[hsl(150_60%_70%)]",
  blue: "border-primary/40 bg-primary/10 text-primary",
  amber: "border-[hsl(40_90%_55%/0.4)] bg-[hsl(40_90%_55%/0.1)] text-[hsl(40_95%_70%)]",
  red: "border-destructive/40 bg-destructive/10 text-destructive",
};

export default function InterventionsLibrary() {
  const [driverFilter, setDriverFilter] = useState<DriverFilter>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const drivers = useMemo(() => {
    const set = new Set<string>();
    nr1Interventions.interventions.forEach((i) => set.add(i.driver));
    return Array.from(set).sort();
  }, []);

  const items = useMemo(() => {
    if (driverFilter === "ALL") return nr1Interventions.interventions;
    return nr1Interventions.interventions.filter(
      (i) => i.driver === driverFilter || i.additionalDrivers.includes(driverFilter),
    );
  }, [driverFilter]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 mb-3">
            <Library className="h-3.5 w-3.5 text-secondary" />
            <span className="text-2xs font-bold uppercase tracking-[0.18em] text-secondary">
              Biblioteca · Intervenções baseadas em evidência · v{nr1Interventions.version}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
            Do diagnóstico à{" "}
            <span style={{
              backgroundImage: "linear-gradient(110deg, hsl(150 60% 55%), hsl(40 90% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>intervenção certa</span>
          </h2>
          <p className="mt-2 text-sm text-surface-deep-muted max-w-2xl leading-relaxed">
            {nr1Interventions.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 max-w-full">
          <Filter className="h-3.5 w-3.5 text-surface-deep-muted mr-1" />
          <button
            onClick={() => setDriverFilter("ALL")}
            className={`text-2xs font-bold uppercase tracking-wider rounded-lg border px-3 py-1.5 transition-all ${
              driverFilter === "ALL"
                ? "border-primary bg-primary/15 text-primary shadow-glow"
                : "border-white/10 bg-white/[0.03] text-surface-deep-muted hover:border-white/25"
            }`}
          >
            Todos
          </button>
          {drivers.map((d) => (
            <button
              key={d}
              onClick={() => setDriverFilter(d)}
              className={`text-2xs font-bold uppercase tracking-wider rounded-lg border px-3 py-1.5 transition-all capitalize ${
                driverFilter === d
                  ? "border-primary bg-primary/15 text-primary shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-surface-deep-muted hover:border-white/25"
              }`}
            >
              {d.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* QUADRANT LEGEND */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {nr1Interventions.interventionMatrix.quadrants.map((q) => (
          <div
            key={q.id}
            className={`rounded-xl border px-3 py-2.5 ${QUADRANT_TINT[q.color]}`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <Gauge className="h-3 w-3" />
              <span className="text-2xs font-mono font-bold">{q.id} · {q.priority}</span>
            </div>
            <p className="text-[11px] leading-snug opacity-90">{q.name}</p>
          </div>
        ))}
      </div>

      {/* DISCLAIMER */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-2xs text-surface-deep-muted leading-relaxed">
          <strong className="text-amber-300">Validação humana obrigatória.</strong>{" "}
          {nr1Interventions.disclaimer}
        </p>
      </div>

      {/* ITEMS */}
      <div className="grid gap-3">
        {items.map((it, i) => (
          <InterventionCard
            key={it.id}
            item={it}
            open={openId === it.id}
            onToggle={() => setOpenId(openId === it.id ? null : it.id)}
            delay={i * 0.025}
          />
        ))}
      </div>

      {/* SOURCES */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookMarked className="h-3.5 w-3.5 text-primary" />
          <h4 className="font-display text-xs font-bold uppercase tracking-wider">
            Fontes científicas
          </h4>
        </div>
        <ul className="grid sm:grid-cols-2 gap-1.5 text-2xs text-surface-deep-muted">
          {nr1Interventions.sources.map((s) => (
            <li key={s} className="flex items-start gap-1.5">
              <span className="text-secondary/70 mt-0.5">◆</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-surface-deep-muted/70">
          Versão {nr1Interventions.version} · atualizada em {nr1Interventions.updatedAt}
        </p>
      </div>
    </div>
  );
}

/* ───────────── CARD ───────────── */
function InterventionCard({
  item, open, onToggle, delay,
}: {
  item: Intervention;
  open: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const quad = interventionQuadrant(item);

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
      <button onClick={onToggle} className="w-full text-left p-5 flex items-start gap-4">
        {/* QUADRANT */}
        <div className={`shrink-0 inline-flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5 ${QUADRANT_TINT[quad.color]}`}>
          {item.criticalFlag && <AlertOctagon className="h-3 w-3" />}
          <span className="text-2xs font-mono font-bold">{quad.id}</span>
          <span className="text-[9px] opacity-80">{quad.priority}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-2xs font-mono text-surface-deep-muted">{item.id}</span>
            <span className="text-[10px] uppercase tracking-wider text-primary/80 font-bold capitalize">
              · {item.driver.replace("_", " ")}
            </span>
            {item.criticalFlag && (
              <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">
                · Crítico
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-bold leading-tight mb-2">
            {item.title}
          </h3>
          <p className="text-xs text-surface-deep-muted leading-relaxed line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* META CHIPS */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip icon={ShieldCheck} label={item.controlHierarchy} tone="primary" />
            <Chip icon={Wallet} label={costLabel(item.estimatedCost)} tone="muted" />
            <Chip icon={Clock} label={timeLabel(item.estimatedTimeToImpact)} tone="muted" />
            <span
              className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5"
              style={{
                color: evidenceColor(item.evidenceLevel),
                background: `${evidenceColor(item.evidenceLevel)}1a`,
                border: `1px solid ${evidenceColor(item.evidenceLevel)}40`,
              }}
            >
              Evidência · {item.evidenceLevel.replace("_", " ")}
            </span>
            {item.requiresHumanApproval && (
              <Chip icon={AlertTriangle} label="Aprovação humana" tone="amber" />
            )}
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
            <div className="p-5 space-y-5">
              {/* WHEN / DO NOT */}
              {(item.whenToUse || item.doNotUse) && (
                <div className="grid md:grid-cols-2 gap-3">
                  {item.whenToUse && (
                    <Box tone="primary" title="Quando usar">
                      {item.whenToUse}
                    </Box>
                  )}
                  {item.doNotUse && (
                    <Box tone="destructive" title="Quando NÃO usar">
                      {item.doNotUse}
                    </Box>
                  )}
                </div>
              )}

              {/* STEPS + METRICS */}
              <div className="grid md:grid-cols-2 gap-5">
                <Section icon={ListChecks} title="Passos de implementação">
                  <ol className="space-y-1.5">
                    {item.implementationSteps.map((s, idx) => (
                      <li key={idx} className="text-xs text-surface-deep-muted leading-relaxed flex gap-2">
                        <span className="text-primary font-mono text-2xs mt-0.5 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </Section>

                <Section icon={Gauge} title="Métricas de eficácia">
                  <ul className="space-y-1">
                    {item.metrics.map((m) => (
                      <li key={m} className="text-xs text-surface-deep-muted leading-relaxed flex gap-2">
                        <span className="text-secondary mt-0.5 shrink-0">▸</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>

              {/* TAGS */}
              <div className="grid md:grid-cols-2 gap-5">
                <Section icon={Sparkles} title="Fatores MTE">
                  <div className="flex flex-wrap gap-1.5">
                    {item.mteFactors.length > 0 ? (
                      item.mteFactors.map((m) => (
                        <span key={m} className="text-[10px] font-mono rounded-md border border-white/15 bg-white/[0.04] px-2 py-1 text-surface-deep-muted">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-2xs text-surface-deep-muted/60">Sem mapeamento direto</span>
                    )}
                    {item.copsoqDimensions.map((d) => (
                      <span key={d} className="text-[10px] font-mono rounded-md border border-primary/25 bg-primary/10 text-primary px-2 py-1">
                        {d}
                      </span>
                    ))}
                  </div>
                </Section>

                <Section icon={Sparkles} title="Drivers ativados">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-mono rounded-md border border-secondary/30 bg-secondary/10 text-secondary px-2 py-1 capitalize">
                      {item.driver.replace("_", " ")} (primário)
                    </span>
                    {item.additionalDrivers.map((d) => (
                      <span key={d} className="text-[10px] font-mono rounded-md border border-white/15 bg-white/[0.04] px-2 py-1 text-surface-deep-muted capitalize">
                        {d.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>

              {/* META BOTTOM */}
              <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                <Meta label="Nível de prevenção" value={preventionLabel(item.level)} />
                <Meta label="Hierarquia de controle" value={`Nível ${item.controlLevel} · ${item.controlHierarchy}`} />
                <Meta label="Evidência científica" value={item.evidenceSource} />
                <Meta label="Referência Playbook" value={item.playbookRef} italic />
                {item.nr1Evidence && (
                  <div className="sm:col-span-2 rounded-lg border border-primary/25 bg-primary/5 p-2.5">
                    <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-0.5">
                      Evidência NR-1
                    </div>
                    <p className="text-xs text-surface-deep-muted leading-relaxed">{item.nr1Evidence}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ───────────── helpers ───────────── */
function Chip({ icon: Icon, label, tone }: { icon: typeof Clock; label: string; tone: "primary" | "muted" | "amber" }) {
  const tones = {
    primary: "border-primary/25 bg-primary/10 text-primary",
    muted: "border-white/10 bg-white/[0.04] text-surface-deep-muted",
    amber: "border-[hsl(40_90%_55%/0.4)] bg-[hsl(40_90%_55%/0.1)] text-[hsl(40_95%_70%)]",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium rounded-md border px-2 py-0.5 ${tones[tone]}`}>
      <Icon className="h-2.5 w-2.5" /> {label}
    </span>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Clock; title: string; children: React.ReactNode }) {
  return (
    <div>
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

function Box({ tone, title, children }: { tone: "primary" | "destructive"; title: string; children: React.ReactNode }) {
  const tones = {
    primary: "border-primary/30 bg-primary/5",
    destructive: "border-destructive/30 bg-destructive/5",
  } as const;
  const titleTone = {
    primary: "text-primary",
    destructive: "text-destructive",
  } as const;
  return (
    <div className={`rounded-xl border ${tones[tone]} p-3`}>
      <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${titleTone[tone]}`}>
        {title}
      </div>
      <p className="text-xs text-surface-deep-muted leading-relaxed">{children}</p>
    </div>
  );
}

function Meta({ label, value, italic }: { label: string; value: string; italic?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-surface-deep-muted/70 mb-0.5">
        {label}
      </div>
      <div className={`text-xs text-surface-deep-muted ${italic ? "italic" : ""}`}>{value}</div>
    </div>
  );
}
