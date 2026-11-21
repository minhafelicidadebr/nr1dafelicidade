import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "@/lib/router/compat";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileCheck2,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { copsoqQuestions, DIM_LABELS, LIKERT, computeScores, prioritizeDrivers } from "@/data/copsoqData";
import { drivers } from "@/data/driversData";
import nr1Shield from "@/assets/nr1-shield-3d-768.png";
import nr1HollywoodHero from "@/assets/images/nr1_copsoq_hollywood_hero_1795095798183.jpg";
import FrameworkCanon from "@/components/nr1/FrameworkCanon";
import CrosswalkMatrix from "@/components/nr1/CrosswalkMatrix";
import InterventionsLibrary from "@/components/nr1/InterventionsLibrary";
import LearningPathways from "@/components/nr1/LearningPathways";
import MethodologyReadinessDossier from "@/components/nr1/MethodologyReadinessDossier";
import SyntheticDemoReceiptCard from "@/components/nr1/SyntheticDemoReceiptCard";
import SyntheticDemoFeedbackCard from "@/components/nr1/SyntheticDemoFeedbackCard";
import SyntheticScenarioSelector from "@/components/nr1/SyntheticScenarioSelector";
import DesignPartnerSessionPreflight from "@/components/nr1/DesignPartnerSessionPreflight";
import FacilitatorHandoffCard from "@/components/nr1/FacilitatorHandoffCard";
import { useAuth } from "@/hooks/useAuth";
import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import { runtimeDataPolicy } from "@/data/runtimePolicy";
import { buildSyntheticDemoReceipt } from "@/lib/instruments/syntheticDemoReceipt";
import { syntheticDemoScenarios, syntheticScenarioQuestions } from "@/data/syntheticDemoScenarios";
import { buildSyntheticScenarioAnswers } from "@/lib/instruments/syntheticScenarios";
import type { SessionAcknowledgementKey } from "@/lib/governance/designPartnerSession";

const driverMap = Object.fromEntries(drivers.map((driver) => [driver.slug, driver]));

const NR1_OFFICIAL_URL =
  "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/ctpp-nrs/norma-regulamentadora-no-1-nr-1";

const RISK_COLOR = {
  verde: "hsl(var(--success))",
  amarelo: "hsl(40 95% 55%)",
  vermelho: "hsl(var(--destructive))",
} as const;

const EMPTY_SESSION_ACKNOWLEDGEMENTS: Record<SessionAcknowledgementKey, boolean> = {
  synthetic_only: false,
  no_technical_decision: false,
  memory_only: false,
};

const ALL_CONFIRMED_ACKNOWLEDGEMENTS: Record<SessionAcknowledgementKey, boolean> = {
  synthetic_only: true,
  no_technical_decision: true,
  memory_only: true,
};

const FORM_WIZARD_BLOCKS = [
  {
    id: "bloco-1",
    shortLabel: "1. Exigências & Autonomia",
    title: "Bloco 1 · Exigências Laborais & Influência (Itens I1 a I7)",
    subtitle: "Carga quantitativa, ritmo de trabalho, exigências cognitivas/emocionais e grau de autonomia na função.",
    startIndex: 0,
    endIndex: 7,
  },
  {
    id: "bloco-2",
    shortLabel: "2. Desenvolvimento & Clareza",
    title: "Bloco 2 · Desenvolvimento, Previsibilidade & Papel (Itens I8 a I14)",
    subtitle: "Iniciativa, aprendizagem, comunicação prévia de mudanças, transparência de responsabilidades e reconhecimento.",
    startIndex: 7,
    endIndex: 14,
  },
  {
    id: "bloco-3",
    shortLabel: "3. Liderança & Apoio Social",
    title: "Bloco 3 · Qualidade da Liderança, Clima & Confiança (Itens I15 a I21)",
    subtitle: "Suporte do superior imediato, comunidade entre colegas, planejamento da chefia e confiança vertical.",
    startIndex: 14,
    endIndex: 21,
  },
  {
    id: "bloco-4",
    shortLabel: "4. Equidade, Sentido & Segurança",
    title: "Bloco 4 · Justiça, Significado do Trabalho & Estabilidade (Itens I22 a I28)",
    subtitle: "Distribuição equitativa, autoeficácia, propósito/importância do trabalho, satisfação global e insegurança.",
    startIndex: 21,
    endIndex: 28,
  },
] as const;

const GUIDED_JOURNEY_STEPS = [
  {
    stepNumber: "01",
    id: "simulador-nr1-workspace",
    title: "Simulador 28 Itens",
    subtitle: "COPSOQ II → Drivers Playbook",
  },
  {
    stepNumber: "02",
    id: "jornada-dossie-prontidao",
    title: "Dossiê & Método",
    subtitle: "Governança e fronteiras técnicas",
  },
  {
    stepNumber: "03",
    id: "jornada-canone-nr1",
    title: "Cânone NR-1 & GRO",
    subtitle: "Ciclo PDCA e PGR psicossocial",
  },
  {
    stepNumber: "04",
    id: "jornada-matriz-crosswalk",
    title: "Matriz Crosswalk",
    subtitle: "Fatores NR-1 × COPSOQ × 12 Drivers",
  },
  {
    stepNumber: "05",
    id: "jornada-biblioteca-intervencoes",
    title: "Intervenções NEXO",
    subtitle: "Controles preventivos e planos",
  },
  {
    stepNumber: "06",
    id: "jornada-trilhas-aprendizagem",
    title: "Trilhas & Capacitação",
    subtitle: "Jornada formativa por público",
  },
] as const;

export default function NR1CopsoqPage() {
  const reduceMotion = useReducedMotion();
  const { user } = useAuth();
  const [step, setStep] = useState<"intro" | "form" | "result">("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionAcknowledgements, setSessionAcknowledgements] = useState({ ...EMPTY_SESSION_ACKNOWLEDGEMENTS });
  const [scenario, setScenario] = useState({ id: "manual-synthetic", label: "Preenchimento sintético manual" });
  const [activeJourneyStepId, setActiveJourneyStepId] = useState<string>(GUIDED_JOURNEY_STEPS[0].id);
  const journeyNavRef = useRef<HTMLDivElement | null>(null);

  const progress = (Object.keys(answers).length / copsoqQuestions.length) * 100;
  const allAnswered = Object.keys(answers).length === copsoqQuestions.length;
  const scores = useMemo(() => computeScores(answers), [answers]);
  const priorities = useMemo(() => prioritizeDrivers(scores), [scores]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = journeyNavRef.current;
    if (!container) return;
    const activeChip = container.querySelector<HTMLElement>(`[data-journey-step="${activeJourneyStepId}"]`);
    if (activeChip && typeof activeChip.scrollIntoView === "function") {
      activeChip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeJourneyStepId]);

  const scrollToSection = (elementId: string) => {
    setActiveJourneyStepId(elementId);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  const unlockAndStartDemo = () => {
    setSessionAcknowledgements({ ...ALL_CONFIRMED_ACKNOWLEDGEMENTS });
    setSessionReady(true);
    setStep("form");
    setTimeout(() => scrollToSection("simulador-nr1-workspace"), 60);
  };

  const reset = () => {
    setAnswers({});
    setSessionReady(false);
    setSessionAcknowledgements({ ...EMPTY_SESSION_ACKNOWLEDGEMENTS });
    setScenario({ id: "manual-synthetic", label: "Preenchimento sintético manual" });
    setStep("intro");
  };

  const applyScenario = (scenarioId: string) => {
    const definition = syntheticDemoScenarios.find((item) => item.id === scenarioId);
    if (!definition) return;
    if (!sessionReady) {
      setSessionAcknowledgements({ ...ALL_CONFIRMED_ACKNOWLEDGEMENTS });
      setSessionReady(true);
    }
    const result = buildSyntheticScenarioAnswers(syntheticScenarioQuestions, definition);
    setAnswers(result.answers);
    setScenario({ id: result.scenarioId, label: result.scenarioLabel });
    setStep("form");
    setTimeout(() => scrollToSection("simulador-nr1-workspace"), 60);
  };

  const clearScenarioAnswers = () => {
    setAnswers({});
    setScenario({ id: "manual-synthetic", label: "Preenchimento sintético manual" });
  };

  return (
    <div className="min-h-screen bg-surface-deep pb-24 text-surface-deep-fg">
      <div className="border-b border-white/10 bg-primary/10">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-2.5 text-2xs">
          <p className="text-surface-deep-muted">
            <strong className="text-surface-deep-fg">Demo educativa e sintética.</strong> A aplicação institucional real
            exige governança, amostra protegida, k-anonimato, revisão técnica e aprovações formais.
          </p>
          <div className="flex gap-2">
            <Link
              to={user ? "/app" : "/auth?intent=nr1"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 font-bold text-secondary-foreground transition-all hover:shadow-gold"
            >
              <ShieldCheck className="h-3 w-3" /> Ir para Plataforma NR-1
            </Link>
            <Link
              to={user ? "/app/cycles" : "/auth?intent=cycle"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 font-semibold text-surface-deep-fg transition-all hover:bg-white/5"
            >
              Criar ciclo institucional
            </Link>
          </div>
        </div>
      </div>

      {/* HERO BAND — Hollywood Studio Lighting Photograph attached to the band (consistent with Driver subpages) */}
      <section className="relative overflow-hidden border-b border-white/10 min-h-[520px] flex items-center">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <img
            src={nr1HollywoodHero}
            alt=""
            className="h-full w-full object-cover object-center opacity-85"
          />
          {/* Directional multi-stop studio scrims protecting left-side typography and CTAs */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/88 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/40" />
          <div
            className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full opacity-25 blur-[130px]"
            style={{ background: "radial-gradient(circle, hsl(183 70% 45%) 0%, transparent 70%)" }}
          />
        </div>

        <div className="container relative z-10 grid items-end gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={reduceMotion ? false : { y: 20 }}
            animate={{ y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/35 bg-teal-500/15 px-3.5 py-1 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
              <span className="text-2xs font-bold uppercase tracking-[0.18em] text-teal-200">
                NR-1 · Riscos Psicossociais · MTE 2026
              </span>
            </div>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.06] text-white md:text-5xl">
              Do contexto regulatório ao{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(110deg, hsl(40 95% 62%), hsl(36 100% 52%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                plano de intervenção
              </span>
              <br />
              em 6 minutos.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 md:text-lg">
              Responda a uma <strong className="text-white">demonstração sintética</strong> inspirada em
              dimensões COPSOQ II e veja como sinais coletivos podem ser traduzidos em prioridades de drivers do
              Playbook. Esta página não coleta dados reais, não valida instrumento e não substitui AEP, AET,
              participação dos trabalhadores ou avaliação técnica.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (sessionReady) {
                    setStep("form");
                    setTimeout(() => scrollToSection("simulador-nr1-workspace"), 60);
                  } else {
                    unlockAndStartDemo();
                  }
                }}
                aria-describedby="session-preflight-guidance"
                className="group inline-flex items-center gap-2 rounded-2xl bg-secondary px-7 py-3.5 text-sm font-bold text-secondary-foreground shadow-lg transition-all hover:shadow-gold hover:scale-[1.01]"
              >
                {sessionReady ? "Iniciar demo técnica (Sessão liberada)" : "Confirmar termos sintéticos e iniciar demo técnica"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href={NR1_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-slate-900/75 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-900/95 hover:border-white/40"
              >
                <BookOpen className="h-4 w-4 text-teal-300" /> NR-1 oficial (Portal MTE) <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>
            </div>

            {/* Interactive Preflight Status Pill in Hero — transparent explanation of the 3 synthetic boundaries */}
            <div className="mt-4 rounded-2xl border border-white/15 bg-slate-900/80 p-3.5 backdrop-blur-md max-w-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${sessionReady ? "text-emerald-400" : "text-amber-300"}`} />
                  <span>
                    {sessionReady
                      ? "Preflight confirmado: 3 fronteiras de uso sintético ativas."
                      : "Ao iniciar, você confirma as 3 fronteiras de demonstração controlada:"}
                  </span>
                </div>
                {!sessionReady && (
                  <button
                    type="button"
                    onClick={() => scrollToSection("design-partner-preflight")}
                    className="text-2xs font-bold text-teal-300 underline underline-offset-2 hover:text-teal-200"
                  >
                    Ver termos detalhados ↓
                  </button>
                )}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1.5 text-2xs text-slate-300 sm:grid-cols-3">
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                  1. Somente dados fictícios
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                  2. Sem diagnóstico ou laudo
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
                  3. Memória local (nada salvo)
                </span>
              </div>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-2.5 text-xs text-slate-200/90 sm:grid-cols-2">
              {[
                `${copsoqQuestions.length} itens dimensionais exploratórios (I1–I28)`,
                "Matriz de tradução científico-operacional",
                "Sem dados reais, sem campanha produtiva",
                "Saída: priorização preliminar dos drivers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <FileCheck2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right column: Studio Context Card + NR-1 Shield badge that harmonizes with the Hollywood Hero backdrop */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.15 }}
            className="hidden lg:flex flex-col items-end justify-end"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-slate-950/75 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3.5">
                <img
                  src={nr1Shield}
                  alt="Escudo NR-1"
                  className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_10px_25px_rgba(20,184,166,0.35)]"
                />
                <div>
                  <span className="inline-block rounded-md bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300 border border-teal-400/30">
                    Arquitetura Metodológica
                  </span>
                  <h2 className="mt-1 font-display text-base font-bold text-white">
                    COPSOQ II × NR-1 × Playbook 2.0
                  </h2>
                  <p className="mt-0.5 text-2xs text-slate-300">
                    Mesa técnica de tradução de fatores psicossociais em planos preventivos auditáveis.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <div className="font-display text-base font-bold text-amber-400">28</div>
                  <div className="text-[10px] text-slate-300">Itens I1–I28</div>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <div className="font-display text-base font-bold text-teal-300">12</div>
                  <div className="text-[10px] text-slate-300">Dimensões</div>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <div className="font-display text-base font-bold text-white">12</div>
                  <div className="text-[10px] text-slate-300">Drivers NEXO</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PERSISTENT GUIDED NR-1 ORIENTATION JOURNEY MAP — Single-row mobile dock + 6-column desktop grid */}
      <nav
        aria-label="Mapa da Jornada Orientativa Guiada de NR-1"
        className="sticky top-14 z-30 border-b border-white/10 bg-surface-deep/95 backdrop-blur-xl"
      >
        <div className="container py-2.5 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-surface-deep-fg">
              <Compass className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">Jornada Guiada NR-1 (6 Etapas):</span>
            </div>
            <span className="hidden sm:inline text-2xs text-surface-deep-muted">
              Toque em qualquer etapa para focar imediatamente
            </span>
          </div>
          <div
            ref={journeyNavRef}
            className="flex items-stretch gap-2 overflow-x-auto pb-1 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0"
          >
            {GUIDED_JOURNEY_STEPS.map((item) => {
              const isSelected = activeJourneyStepId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-journey-step={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group shrink-0 min-w-[165px] lg:min-w-0 flex flex-col items-start rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/15 shadow-sm"
                      : "border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-primary/10"
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-primary">ETAPA {item.stepNumber}</span>
                    <ArrowRight className="h-3 w-3 text-surface-deep-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <span className="mt-0.5 font-display text-xs font-bold text-surface-deep-fg truncate max-w-full">
                    {item.title}
                  </span>
                  <span className="line-clamp-1 text-[10px] text-surface-deep-muted">{item.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <section className="container py-10 space-y-14">
        {/* STAGE 1: Interactive Simulator Workspace (Preflight + Intro / 4-Block Form / Results) */}
        <div id="simulador-nr1-workspace" className="scroll-mt-36 space-y-10">
          {step === "intro" && (
            <div className="space-y-10">
              <DesignPartnerSessionPreflight
                acknowledgements={sessionAcknowledgements}
                onAcknowledgementsChange={setSessionAcknowledgements}
                onReadyChange={setSessionReady}
              />

              {sessionReady && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-400/35 bg-emerald-500/10 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-display text-base font-bold text-surface-deep-fg">
                        Sessão sintética liberada! Pronto para iniciar o simulador de 28 itens.
                      </p>
                      <p className="text-xs text-surface-deep-muted">
                        Você pode preencher os 4 blocos compactos (7 itens por bloco) ou aplicar um cenário sintético pronto abaixo.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground shadow-md transition hover:shadow-gold"
                  >
                    Abrir Simulador de 28 Perguntas <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <IntroPanel
                onStart={() => {
                  if (sessionReady) {
                    setStep("form");
                  } else {
                    unlockAndStartDemo();
                  }
                }}
                reduceMotion={Boolean(reduceMotion)}
                sessionReady={sessionReady}
              />
              <SyntheticScenarioSelector onApply={applyScenario} disabled={false} />
            </div>
          )}

          {step === "form" && (
            <FormPanel
              answers={answers}
              setAnswers={setAnswers}
              progress={progress}
              allAnswered={allAnswered}
              onSubmit={() => {
                setStep("result");
                setTimeout(() => scrollToSection("simulador-nr1-workspace"), 60);
              }}
              onBack={() => setStep("intro")}
              scenarioLabel={scenario.label}
              onClear={clearScenarioAnswers}
              onApplyScenario={applyScenario}
              onJumpToGuidedJourney={() => scrollToSection("jornada-dossie-prontidao")}
            />
          )}

          {step === "result" && (
            <ResultPanel scores={scores} priorities={priorities} scenario={scenario} onReset={reset} />
          )}
        </div>

        {/* STAGES 2 TO 6: Guided NR-1 Orientation Journey — ALWAYS VISIBLE below the simulator */}
        <div className="space-y-16 border-t border-white/10 pt-14">
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-r from-primary/10 via-white/[0.03] to-secondary/10 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-2xs font-bold uppercase tracking-wider text-primary">
                  <Compass className="h-3.5 w-3.5" /> Jornada Orientativa de Adequação NR-1
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                  Trilha Guiada de Referência Regulatória, Metodológica e Operacional
                </h2>
                <p className="mt-1 max-w-3xl text-sm text-surface-deep-muted">
                  Explore abaixo os 5 pilares estruturantes que sustentam a leitura demonstrativa: Dossiê de Prontidão
                  Metodológica, Cânone NR-1 & Ciclo GRO/PGR, Matriz Crosswalk (COPSOQ II × 12 Drivers), Biblioteca de
                  Intervenções e Trilhas de Aprendizagem.
                </p>
              </div>
              {step !== "form" && (
                <button
                  type="button"
                  onClick={() => {
                    if (sessionReady) {
                      setStep("form");
                      scrollToSection("simulador-nr1-workspace");
                    } else {
                      unlockAndStartDemo();
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground transition hover:opacity-95"
                >
                  Ir para o Simulador (28 Itens) <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <div id="jornada-dossie-prontidao" className="scroll-mt-36">
            <MethodologyReadinessDossier />
          </div>
          <div id="jornada-canone-nr1" className="scroll-mt-36">
            <FrameworkCanon />
          </div>
          <div id="jornada-matriz-crosswalk" className="scroll-mt-36">
            <CrosswalkMatrix />
          </div>
          <div id="jornada-biblioteca-intervencoes" className="scroll-mt-36">
            <InterventionsLibrary />
          </div>
          <div id="jornada-trilhas-aprendizagem" className="scroll-mt-36">
            <LearningPathways />
          </div>
        </div>
      </section>
    </div>
  );
}

function IntroPanel({
  onStart,
  reduceMotion,
  sessionReady,
}: {
  onStart: () => void;
  reduceMotion: boolean;
  sessionReady: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[
        {
          icon: ShieldCheck,
          title: "1. Conformidade NR-1",
          body: "Organiza a jornada de GRO/PGR psicossocial e evidências de decisão, sem substituir análise técnica, AEP/AET ou consulta aos trabalhadores.",
        },
        {
          icon: Target,
          title: "2. Avaliação estruturada",
          body: "Usa itens e dimensões psicossociais como lente demonstrativa para leitura agregada de demandas, autonomia, liderança, reconhecimento e apoio.",
        },
        {
          icon: Sparkles,
          title: "3. Plano de ação",
          body: "A matriz dimensão × driver traduz sinais em hipóteses de intervenção, controles, trilhas e métricas para revisão técnica posterior.",
        },
      ].map((block, index) => (
        <motion.div
          key={block.title}
          initial={reduceMotion ? false : { y: 15 }}
          animate={{ y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: index * 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
            <block.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="mb-2 font-display text-base font-bold">{block.title}</h3>
          <p className="text-sm leading-relaxed text-surface-deep-muted">{block.body}</p>
        </motion.div>
      ))}
      <div className="pt-4 text-center md:col-span-3">
        <button
          type="button"
          onClick={onStart}
          aria-describedby="session-preflight-guidance"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:shadow-glow"
        >
          {sessionReady
            ? "Começar questionário demonstrativo (4 blocos rápidos)"
            : "Confirmar preflight sintético e começar questionário demonstrativo"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FormPanel({
  answers,
  setAnswers,
  progress,
  allAnswered,
  onSubmit,
  onBack,
  scenarioLabel,
  onClear,
  onApplyScenario,
  onJumpToGuidedJourney,
}: {
  answers: Record<string, number>;
  setAnswers: (answers: Record<string, number>) => void;
  progress: number;
  allAnswered: boolean;
  onSubmit: () => void;
  onBack: () => void;
  scenarioLabel: string;
  onClear: () => void;
  onApplyScenario: (scenarioId: string) => void;
  onJumpToGuidedJourney: () => void;
}) {
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"wizard" | "all">("wizard");

  const currentBlock = FORM_WIZARD_BLOCKS[activeBlockIndex];
  const visibleQuestions =
    viewMode === "wizard"
      ? copsoqQuestions.slice(currentBlock.startIndex, currentBlock.endIndex)
      : copsoqQuestions;

  const getBlockAnsweredCount = (blockIndex: number) => {
    const b = FORM_WIZARD_BLOCKS[blockIndex];
    return copsoqQuestions
      .slice(b.startIndex, b.endIndex)
      .filter((q) => answers[q.id] !== undefined).length;
  };

  const handleSelectOption = (questionId: string, value: number) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    // If in wizard mode and this click completes the current 7-question block, stays smooth and highlights "Próximo Bloco"
    if (viewMode === "wizard") {
      const b = FORM_WIZARD_BLOCKS[activeBlockIndex];
      const blockQuestions = copsoqQuestions.slice(b.startIndex, b.endIndex);
      const blockComplete = blockQuestions.every((q) => updated[q.id] !== undefined);
      if (blockComplete && activeBlockIndex < FORM_WIZARD_BLOCKS.length - 1) {
        // Auto-advance after short visual feedback
        setTimeout(() => {
          setActiveBlockIndex((prev) => Math.min(prev + 1, FORM_WIZARD_BLOCKS.length - 1));
        }, 220);
      }
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Methodological Anchor Banner — Explains why there are 28 questions and how they map to COPSOQ II & NR-1 */}
      <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-primary">
              <Layers className="h-3.5 w-3.5" /> Âncora Metodológica das 28 Perguntas · COPSOQ II × NR-1 × Playbook 2.0
            </div>
            <h2 className="font-display text-lg font-bold text-surface-deep-fg">
              Por que este simulador possui 28 perguntas divididas em 4 blocos?
            </h2>
            <p className="text-xs leading-relaxed text-surface-deep-muted">
              Estas <strong className="text-surface-deep-fg">28 perguntas (Itens I1 a I28)</strong> correspondem ao núcleo de{" "}
              <strong className="text-surface-deep-fg">12 dimensões de fatores psicossociais do trabalho</strong> estruturadas a
              partir da Versão Curta de referência do <strong className="text-surface-deep-fg">Manual COPSOQ II (Silva et al., 2013)</strong>{" "}
              — cobrindo <em>Exigências Laborais, Organização e Conteúdo, Relações Sociais/Liderança, Valores no Local de Trabalho
              e Interface Trabalho-Indivíduo</em>. A matriz exploratória traduz a pontuação por tercis (2,33 e 3,66) em prioridades
              preliminares nos <strong className="text-surface-deep-fg">12 Drivers do Work Wellbeing Playbook 2.0</strong> para apoiar o
              planejamento preventivo da NR-1.
            </p>
          </div>
          <button
            type="button"
            onClick={onJumpToGuidedJourney}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/35 bg-primary/15 px-3.5 py-2 text-xs font-bold text-primary transition hover:bg-primary/25"
          >
            <Compass className="h-3.5 w-3.5" /> Ver Jornada Orientativa NR-1 abaixo ↓
          </button>
        </div>
      </div>

      {/* Synthetic Guardrail + Quick Scenario Fill Bar */}
      <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-surface-deep-muted">
          <strong className="text-surface-deep-fg">Use apenas cenário simulado.</strong> As respostas ficam só no estado
          local desta página. Não use este formulário para trabalhadores reais, campanha institucional, diagnóstico formal
          ou relatório técnico.
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span>
              <strong className="text-surface-deep-fg">Modo atual:</strong> {scenarioLabel}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-white/15 px-2.5 py-1 text-2xs font-bold text-surface-deep-fg transition hover:bg-white/10"
            >
              Limpar respostas
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-2xs text-surface-deep-muted mr-1 inline-flex items-center gap-1">
              <Zap className="h-3 w-3 text-secondary" /> Autopreencher 28 itens:
            </span>
            {syntheticDemoScenarios.map((scen) => (
              <button
                key={scen.id}
                type="button"
                onClick={() => onApplyScenario(scen.id)}
                className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-2xs font-semibold text-primary transition hover:bg-primary/20"
              >
                {scen.label.replace("Cenário sintético — ", "")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress & 4-Block Stepper Header (Zero Long Scroll) */}
      <div className="rounded-2xl border border-white/10 bg-surface-deep/95 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-bold text-surface-deep-fg">
              Progresso: {Object.keys(answers).length} de {copsoqQuestions.length} respondidas ({Math.round(progress)}%)
            </span>
            {allAnswered && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-2xs font-bold text-emerald-300 border border-emerald-400/30">
                <CheckCircle2 className="h-3 w-3" /> 28 itens concluídos
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "wizard" ? "all" : "wizard")}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-2xs font-semibold text-surface-deep-fg transition hover:bg-white/10"
            >
              {viewMode === "wizard" ? "Ver todas as 28 em lista única" : "Voltar ao modo compacto (4 blocos)"}
            </button>
            {allAnswered && (
              <button
                type="button"
                onClick={onSubmit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground shadow-sm transition hover:shadow-gold"
              >
                Ver Resultado Agora <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {viewMode === "wizard" && (
          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {FORM_WIZARD_BLOCKS.map((block, idx) => {
              const answeredInBlock = getBlockAnsweredCount(idx);
              const totalInBlock = block.endIndex - block.startIndex;
              const isComplete = answeredInBlock === totalInBlock;
              const isActive = idx === activeBlockIndex;
              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => setActiveBlockIndex(idx)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? "border-primary bg-primary/15 shadow-glow"
                      : isComplete
                        ? "border-emerald-400/35 bg-emerald-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <div className="flex w-full items-center justify-between text-2xs font-bold">
                    <span className={isActive ? "text-primary" : isComplete ? "text-emerald-300" : "text-surface-deep-muted"}>
                      {block.shortLabel}
                    </span>
                    <span className="rounded-md bg-black/25 px-1.5 py-0.5 font-mono text-[10px]">
                      {answeredInBlock}/{totalInBlock}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Block Header */}
      {viewMode === "wizard" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <div>
            <h3 className="font-display text-sm font-bold text-surface-deep-fg">{currentBlock.title}</h3>
            <p className="text-2xs text-surface-deep-muted">{currentBlock.subtitle}</p>
          </div>
          <span className="text-2xs font-semibold text-primary">
            Dica: ao responder as 7 perguntas deste bloco, o formulário avança automaticamente para o próximo.
          </span>
        </div>
      )}

      {/* Compact Ergonomic Question Cards — fits on screen without endless scrolling */}
      <div className="grid gap-3">
        {visibleQuestions.map((question) => {
          const currentVal = answers[question.id];
          return (
            <div
              key={question.id}
              className={`rounded-2xl border p-4 transition-all ${
                currentVal !== undefined
                  ? "border-primary/35 bg-primary/[0.04]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-2.5 lg:max-w-[46%]">
                  <span className="mt-0.5 shrink-0 rounded-md border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-2xs font-bold text-primary">
                    {question.id}
                  </span>
                  <div>
                    <p id={`question-${question.id}`} className="text-sm font-medium leading-snug text-surface-deep-fg">
                      {question.text}
                    </p>
                    <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-surface-deep-muted">
                      Dimensão: {DIM_LABELS[question.scale]}
                    </span>
                  </div>
                </div>

                <div
                  className="grid grid-cols-5 gap-1.5 lg:w-[52%]"
                  role="group"
                  aria-labelledby={`question-${question.id}`}
                >
                  {LIKERT.map((option) => {
                    const selected = currentVal === option.v;
                    return (
                      <button
                        key={option.v}
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${question.text}: ${option.label} (${option.v})`}
                        onClick={() => handleSelectOption(question.id, option.v)}
                        className={`rounded-xl border px-1.5 py-2 text-[10px] transition-all sm:text-2xs ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground font-bold shadow-glow scale-[1.02]"
                            : "border-white/10 bg-white/[0.02] text-surface-deep-muted hover:border-white/30 hover:text-surface-deep-fg"
                        }`}
                      >
                        <div className="text-xs font-bold">{option.v}</div>
                        <div className="mt-0.5 leading-tight line-clamp-2">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation: Previous Block / Next Block / Generate Reading */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-xs font-semibold text-surface-deep-muted transition hover:bg-white/5 hover:text-surface-deep-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar à visão inicial
          </button>
          {viewMode === "wizard" && activeBlockIndex > 0 && (
            <button
              type="button"
              onClick={() => setActiveBlockIndex((prev) => Math.max(prev - 1, 0))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-surface-deep-fg transition hover:bg-white/10"
            >
              ← Bloco anterior
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {viewMode === "wizard" && activeBlockIndex < FORM_WIZARD_BLOCKS.length - 1 && (
            <button
              type="button"
              onClick={() => setActiveBlockIndex((prev) => Math.min(prev + 1, FORM_WIZARD_BLOCKS.length - 1))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary/20 border border-primary/40 px-4 py-2.5 text-xs font-bold text-primary transition hover:bg-primary/30"
            >
              Próximo bloco ({activeBlockIndex + 2}/4) <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={!allAnswered}
            className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-7 py-3 text-sm font-bold text-secondary-foreground transition-all hover:shadow-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Gerar leitura demonstrativa {allAnswered ? "" : `(faltam ${copsoqQuestions.length - Object.keys(answers).length})`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  scores,
  priorities,
  scenario,
  onReset,
}: {
  scores: ReturnType<typeof computeScores>;
  priorities: ReturnType<typeof prioritizeDrivers>;
  scenario: { id: string; label: string };
  onReset: () => void;
}) {
  const [receiptId] = useState(() => createSyntheticReceiptId());
  const [generatedAt] = useState(() => new Date().toISOString());
  const radarData = scores.map((score) => ({ dim: score.label.split(" ")[0], score: score.score }));
  const barData = [...scores].sort((a, b) => b.score - a.score);
  const top = priorities.slice(0, 5);
  const overallLoad = Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length);
  const overallRisk = overallLoad >= 60 ? "vermelho" : overallLoad >= 40 ? "amarelo" : "verde";
  const receipt = useMemo(
    () => buildSyntheticDemoReceipt({
      receiptId,
      generatedAt,
      runtimePolicyVersion: runtimeDataPolicy.version,
      instrumentKey: exploratoryInstrumentDraft.instrumentKey,
      instrumentVersion: exploratoryInstrumentDraft.version,
      scenarioId: scenario.id,
      scenarioLabel: scenario.label,
      completedItemCount: copsoqQuestions.length,
      expectedItemCount: copsoqQuestions.length,
      computedDimensionCount: scores.length,
      prioritizedDriverCount: top.length,
      syntheticMode: true,
      instrumentRuntimeReady: exploratoryInstrumentDraft.runtimeReady,
      remoteTransportEnabled: false,
      persisted: false,
    }),
    [generatedAt, receiptId, scenario.id, scenario.label, scores.length, top.length],
  );

  return (
    <div className="space-y-10">
      <div className="grid items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-7 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Leitura demonstrativa · Resultado sintético
          </div>
          <h2 className="mb-2 font-display text-2xl font-bold md:text-3xl">
            Índice demonstrativo de carga psicossocial:{" "}
            <span style={{ color: RISK_COLOR[overallRisk] }}>{overallLoad}/100</span>
          </h2>
          <p className="max-w-2xl text-sm text-surface-deep-muted">
            {overallRisk === "verde" &&
              "Sinais simulados em faixa baixa. Em uso formal, mantenha governança preventiva e validação técnica."}
            {overallRisk === "amarelo" &&
              "Sinais simulados sugerem atenção. Use a leitura apenas para entender como o Playbook prioriza drivers."}
            {overallRisk === "vermelho" &&
              "Sinais simulados em faixa alta. Em situação real, acione responsáveis técnicos e fluxos formais antes de qualquer conclusão."}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium transition hover:bg-white/10"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Refazer
        </button>
      </div>

      <SyntheticDemoReceiptCard receipt={receipt} />
      <SyntheticDemoFeedbackCard receiptId={receipt.receiptId} />
      <FacilitatorHandoffCard receiptId={receipt.receiptId} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-1 font-display text-sm font-bold">Perfil psicossocial demonstrativo</h3>
          <p className="mb-3 text-2xs text-surface-deep-muted">Carga 0-100 por dimensão · alto = maior atenção</p>
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="78%">
                <PolarGrid stroke="hsl(0 0% 100% / 0.1)" />
                <PolarAngleAxis dataKey="dim" tick={{ fill: "hsl(210 25% 80%)", fontSize: 10 }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "hsl(210 20% 55%)", fontSize: 9 }}
                  stroke="hsl(0 0% 100% / 0.1)"
                />
                <Radar dataKey="score" stroke="hsl(40 90% 55%)" fill="hsl(40 90% 55%)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-1 font-display text-sm font-bold">Dimensões por carga</h3>
          <p className="mb-3 text-2xs text-surface-deep-muted">Vermelho &gt;=60 · Amarelo &gt;=40 · Verde &lt;40</p>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="hsl(0 0% 100% / 0.06)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(210 20% 55%)", fontSize: 10 }} />
                <YAxis type="category" dataKey="label" width={140} tick={{ fill: "hsl(210 25% 80%)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222 48% 6%)",
                    border: "1px solid hsl(0 0% 100% / 0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {barData.map((data) => (
                    <Cell key={data.scale} fill={RISK_COLOR[data.risk]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-1 flex items-center gap-2">
          <Target className="h-4 w-4 text-secondary" />
          <h3 className="font-display text-lg font-bold">Drivers preliminares para simulação de plano NR-1</h3>
        </div>
        <p className="mb-5 text-xs text-surface-deep-muted">
          Matriz exploratória dimensão psicossocial × driver do Playbook 2.0. Em uso institucional, valide fonte,
          licença, scoring, critérios e revisão técnica antes de qualquer registro formal em GRO/PGR.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {top.map((priority, index) => {
            const driver = driverMap[priority.driver];
            if (!driver) return null;
            const Icon = driver.icon;
            return (
              <Link
                key={priority.driver}
                to={`/drivers/${driver.slug}`}
                className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-4 transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="absolute right-3 top-3 text-2xs font-bold text-secondary">#{index + 1}</div>
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${driver.bgClass} ${driver.colorClass} ${driver.borderClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-display text-sm font-bold leading-tight">{driver.namePt}</p>
                <p className="mb-3 mt-1 line-clamp-2 text-2xs text-surface-deep-muted">{driver.tagline}</p>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${priority.weight}%` }}
                  />
                </div>
                <p className="mt-1.5 text-2xs text-surface-deep-muted">Prioridade demonstrativa: {priority.weight}%</p>
                <div className="mt-3 inline-flex items-center gap-1 text-2xs font-bold text-primary transition-all group-hover:gap-2">
                  Abrir driver <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <div className="text-xs leading-relaxed text-surface-deep-muted">
          <strong className="text-surface-deep-fg">Limite metodológico:</strong> esta é uma demonstração educativa e
          sintética. O snapshot de itens, pesos e tradução para drivers não deve ser usado para dados reais,
          diagnóstico, documento técnico, promessa de conformidade ou tomada de decisão sem fonte, licença, scoring,
          governança e revisão competente aprovados.
        </div>
      </div>
    </div>
  );
}

function createSyntheticReceiptId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ? `SYN-${uuid}` : `SYN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
