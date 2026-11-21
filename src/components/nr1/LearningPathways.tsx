import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Clock, Award, Coins, ChevronDown, ChevronUp,
  Target, Sparkles, CheckCircle2, ArrowRight, Filter,
} from "lucide-react";
import {
  nr1Pathways, pathwaysByPersona, totalPathwayMinutes, totalIFTReward,
  PERSONA_LABEL, DIFFICULTY_LABEL,
  type Persona, type Pathway,
} from "@/data/nr1Pathways";

const DIFFICULTY_COLOR = {
  beginner: "hsl(var(--success))",
  intermediate: "hsl(40 95% 55%)",
  advanced: "hsl(var(--destructive))",
} as const;

const RARITY_COLOR = {
  common: "hsl(210 20% 60%)",
  rare: "hsl(183 70% 55%)",
  epic: "hsl(280 75% 65%)",
  legendary: "hsl(40 95% 55%)",
} as const;

const PERSONA_OPTIONS: { id: Persona | "any"; label: string }[] = [
  { id: "any", label: "Todas" },
  { id: "leader", label: "Lideranças" },
  { id: "sst_hr_consultant", label: "SST/RH" },
  { id: "cipa", label: "CIPA" },
  { id: "employee", label: "Trabalhadores" },
  { id: "all", label: "Universal" },
];

export default function LearningPathways() {
  const [persona, setPersona] = useState<Persona | "any">("any");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => pathwaysByPersona(persona), [persona]);

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-3">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            <span className="text-2xs font-bold uppercase tracking-[0.18em] text-primary">
              Trilhas de Aprendizagem · v{nr1Pathways.version}
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
            Aprendizagem conectada ao{" "}
            <span style={{
              backgroundImage: "linear-gradient(110deg, hsl(40 90% 55%), hsl(36 100% 50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>trabalho real</span>
          </h2>
          <p className="mt-2 text-sm text-surface-deep-muted max-w-2xl leading-relaxed">
            Microlearning espaçado, active recall e ação imediata. Cada módulo gera artefato real
            para o seu GRO/PGR — não cursos de compliance genéricos.
          </p>
        </div>

        {/* Persona filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-surface-deep-muted" />
          {PERSONA_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPersona(opt.id)}
              className={`text-2xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                persona === opt.id
                  ? "border-primary bg-primary/20 text-primary shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-surface-deep-muted hover:border-white/25"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRINCIPLES STRIP */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid md:grid-cols-5 gap-3">
          {nr1Pathways.learningPrinciples.map((principle, i) => (
            <div key={i} className="flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
              <p className="text-2xs text-surface-deep-muted leading-relaxed">{principle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PATHWAY CARDS */}
      <div className="grid lg:grid-cols-2 gap-5">
        <AnimatePresence>
          {filtered.map((p, i) => (
            <PathwayCard
              key={p.id}
              pathway={p}
              index={i}
              isOpen={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* BADGES */}
      <BadgesShowcase />
    </section>
  );
}

function PathwayCard({
  pathway, index, isOpen, onToggle,
}: { pathway: Pathway; index: number; isOpen: boolean; onToggle: () => void }) {
  const totalMin = totalPathwayMinutes(pathway);
  const ift = totalIFTReward(pathway);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-6 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
              style={{
                color: DIFFICULTY_COLOR[pathway.difficulty],
                borderColor: `${DIFFICULTY_COLOR[pathway.difficulty]}40`,
                background: `${DIFFICULTY_COLOR[pathway.difficulty]}15`,
              }}>
              {DIFFICULTY_LABEL[pathway.difficulty]}
            </span>
            <span className="text-2xs font-medium px-2 py-0.5 rounded-md border border-white/15 bg-white/5 text-surface-deep-muted">
              {PERSONA_LABEL[pathway.persona]}
            </span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4 text-surface-deep-muted shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-surface-deep-muted shrink-0" />}
        </div>

        <h3 className="font-display text-lg font-bold leading-tight mb-1.5">{pathway.title}</h3>
        <p className="text-sm text-surface-deep-muted mb-4 leading-relaxed">{pathway.subtitle}</p>

        <div className="flex items-center gap-4 text-2xs text-surface-deep-muted flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" /> {pathway.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" /> {pathway.modules.length} módulos · {totalMin} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-secondary" /> +{ift} IFT
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-secondary" /> {pathway.badges.length} badge(s)
          </span>
        </div>

        {pathway.nr1Relevance && (
          <p className="mt-4 text-2xs text-primary/90 bg-primary/5 border border-primary/15 rounded-lg p-3 leading-relaxed">
            <strong>NR-1:</strong> {pathway.nr1Relevance}
          </p>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/5 pt-5 space-y-4">
              {/* MODULES */}
              <div>
                <h4 className="text-2xs font-bold uppercase tracking-wider text-surface-deep-muted mb-3">
                  Módulos
                </h4>
                <ol className="space-y-3">
                  {pathway.modules.map((m, idx) => {
                    const meta = nr1Pathways.moduleTypes[m.type];
                    return (
                      <li key={m.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-xl shrink-0" aria-hidden>{meta.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-2xs font-mono text-primary/80">M{idx + 1}</span>
                              <span className="text-2xs font-bold uppercase tracking-wider text-secondary">
                                {m.type.replace("_", " ")}
                              </span>
                              <span className="text-2xs text-surface-deep-muted inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {m.estimatedMinutes} min
                              </span>
                            </div>
                            <p className="text-sm font-semibold leading-snug mb-1.5">{m.title}</p>
                            <p className="text-2xs text-surface-deep-muted leading-relaxed mb-2.5">
                              {m.description}
                            </p>
                            {m.learningOutcomes && (
                              <ul className="space-y-1 mb-2.5">
                                {m.learningOutcomes.map((lo, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-2xs text-surface-deep-muted">
                                    <CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" />
                                    <span>{lo}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="text-2xs flex items-start gap-1.5 text-secondary bg-secondary/5 border border-secondary/15 rounded-md p-2">
                              <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
                              <span><strong>Ação:</strong> {m.action}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* META GRID */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="text-2xs font-bold uppercase tracking-wider text-surface-deep-muted mb-2">
                    Drivers conectados
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[pathway.driver, ...(pathway.additionalDrivers ?? [])].map((d) => (
                      <span key={d} className="text-2xs px-2 py-0.5 rounded-md bg-primary/10 border border-primary/25 text-primary">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="text-2xs font-bold uppercase tracking-wider text-surface-deep-muted mb-2">
                    Riscos NR-1
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pathway.linkedRisks.map((r) => (
                      <span key={r} className="text-2xs font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* EVIDENCE OUTPUT */}
              <div className="rounded-xl border border-success/20 bg-success/5 p-3 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <div className="text-2xs leading-relaxed">
                  <strong className="text-success">Evidência gerada:</strong>{" "}
                  <span className="text-surface-deep-muted">{pathway.evidenceOutput}</span>
                </div>
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap gap-2">
                {pathway.badges.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1.5 text-2xs px-2.5 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary">
                    <Award className="h-3 w-3" /> {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function BadgesShowcase() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 mb-1">
        <Award className="h-4 w-4 text-secondary" />
        <h3 className="font-display text-lg font-bold">Conquistas &amp; Economia IFT</h3>
      </div>
      <p className="text-2xs text-surface-deep-muted mb-5">
        Gamificação ética: cada badge representa progresso real registrado no PGR.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {nr1Pathways.gamification.badges.map((b) => (
          <div key={b.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl shrink-0" aria-hidden>{b.emoji}</div>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold leading-tight mb-1">{b.name}</p>
                <span className="text-2xs font-bold uppercase tracking-wider"
                  style={{ color: RARITY_COLOR[b.rarity] }}>
                  {b.rarity}
                </span>
                <p className="text-2xs text-surface-deep-muted mt-1.5 leading-relaxed">{b.criteria}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-white/5">
        <div className="text-2xs font-bold uppercase tracking-wider text-surface-deep-muted mb-3">
          Regras IFT — economia transparente
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {nr1Pathways.gamification.iftEarningRules.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-2xs rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <span className="text-surface-deep-muted truncate">{r.action}</span>
              <span className="inline-flex items-center gap-1 font-bold text-secondary shrink-0">
                <Coins className="h-3 w-3" /> +{r.reward}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
