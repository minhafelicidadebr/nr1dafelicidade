import { useParams, Link, useSearchParams, useNavigate } from "@/lib/router/compat";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Info,
  ListChecks,
  FileText,
  Film,
  ShieldCheck,
  CheckCircle2,
  Compass,
  MessageSquare,
  Target,
  PlayCircle,
  Table2,
  BookOpen,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import {
  drivers,
  learningDynamics,
} from "@/data/driversData";
import { driverLearningContent } from "@/data/driverQuizData";
import { tedVideos } from "@/data/contentRegistry";
import LearningDynamicCard from "@/components/LearningDynamicCard";
import QuizEngine from "@/components/QuizEngine";
import Flashcards from "@/components/Flashcards";
import VideoLab from "@/components/VideoLab";
import AchievementBurst from "@/components/AchievementBurst";
import DriverChatbot from "@/components/DriverChatbot";
import { driverAvatars } from "@/lib/driverAvatars";
import PDFGenerator from "@/components/PDFGenerator";
import AIDynamic from "@/components/AIDynamic";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { scientificArticles } from "@/data/scientificArticles";
import {
  PLAYBOOK_2_CANONICAL_META,
  getPlaybook2InterventionsByDriver,
  interventionScopeLabelPt,
} from "@/lib/governance/playbook2RagEngine";
import { getArgo4DriverHeroSpec } from "@/data/argo4DriverHeroPrompts";
import { getDriverAcademyHostScript } from "@/data/driverAcademyHostScripts";
import DriverAcademyHollywoodHost from "@/components/driver/DriverAcademyHollywoodHost";

const FREE_DRIVERS = [
  "management",
  "trust",
  "stress",
  "job_security",
  "employee_voice",
  "autonomy",
  "workload_pressures",
];

const DRIVER_SLUG_ALIASES: Record<string, string> = {
  "workload-absorbers": "workload_pressures",
  "workload-pressures": "workload_pressures",
  "safety-stability": "job_security",
  "job-security": "job_security",
  "trust-psychological-safety": "trust",
  "worker-voice": "employee_voice",
  "employee-voice": "employee_voice",
  "respect-inclusion": "inclusion_belonging",
  "inclusion-belonging": "inclusion_belonging",
  "health-recovery": "energy",
  "clear-expectations": "management",
  "recognition-appreciation": "appreciation",
  "fairness-equity": "compensation",
  "physical-emotional-safety": "support",
  "purpose-meaning": "purpose",
  "belonging-community": "inclusion_belonging",
  "open-communication": "trust",
  "flexibility-autonomy": "flexibility",
};

const fallbackQuiz = [
  { question: "Qual postura esta demonstração incentiva ao explorar um driver?", options: ["Tomar uma decisão automática", "Examinar o contexto e revisar hipóteses com pessoas responsáveis", "Classificar pessoas individualmente", "Aplicar a mesma medida a qualquer organização"], correctIndex: 1, explanation: "A demonstração organiza perguntas e referências para estudo; ela não substitui análise técnica do contexto de trabalho." },
];
const fallbackFlashcards = [
  { front: "Como usar esta demonstração?", back: "Como espaço pedagógico para explorar temas, consultar referências externas e levar hipóteses para revisão técnica no contexto real." },
];

export default function DriverWorldPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const normalizedSlug = slug ? (DRIVER_SLUG_ALIASES[slug] ?? slug.replace(/-/g, "_")) : "";
  const driver = drivers.find((d) => d.slug === slug || d.slug === normalizedSlug);
  const [activeDynamic, setActiveDynamic] = useState("PB2-RAG");
  const [selectedPracticeId, setSelectedPracticeId] = useState<string>("ALL");
  const [mobileToolsGridOpen, setMobileToolsGridOpen] = useState(false);
  const [stageHighlightPulse, setStageHighlightPulse] = useState(false);
  const [burst, setBurst] = useState<{ message: string; ift: number } | null>(null);
  const mobileDockRef = useRef<HTMLDivElement | null>(null);
  const { user, isPremium } = useAuth();
  const { saveCompletion } = useProgress();

  // Auto-centraliza a pílula ativa na barra horizontal mobile/tablet sempre que activeDynamic mudar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dock = mobileDockRef.current;
    if (!dock) return;
    const activeChip = dock.querySelector<HTMLElement>(`[data-dynamic-dock-chip="${activeDynamic}"]`);
    if (activeChip && typeof activeChip.scrollIntoView === "function") {
      activeChip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeDynamic]);

  const selectDynamicAndFocus = (dynamicId: string, options?: { scrollToStage?: boolean }) => {
    setActiveDynamic(dynamicId);
    setMobileToolsGridOpen(false);
    setStageHighlightPulse(true);
    setTimeout(() => setStageHighlightPulse(false), 850);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        const stageEl =
          document.getElementById("driver-active-stage-panel") ??
          document.getElementById("driver-learning-workspace");
        if (!stageEl) return;
        const rect = stageEl.getBoundingClientRect();
        const isOutOfComfortableViewport = rect.top < 56 || rect.top > window.innerHeight * 0.48;
        if (options?.scrollToStage || isOutOfComfortableViewport) {
          stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 45);
    }
  };

  const selectPracticeAndFocus = (practiceId: string) => {
    setSelectedPracticeId(practiceId);
    if (practiceId !== "ALL" && typeof window !== "undefined") {
      setTimeout(() => {
        const detailEl = document.getElementById("driver-active-practice-detail");
        if (detailEl) {
          detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 45);
    }
  };

  const handleBackNavigation = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/drivers");
    }
  };

  if (!driver) {
    return (
      <div className="container py-20 text-center space-y-4">
        <p className="text-muted-foreground">Driver não encontrado.</p>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleBackNavigation}
            className="text-primary text-sm inline-flex items-center gap-1 hover:underline"
          >
            ← Voltar para página anterior
          </button>
          <Link to="/drivers" className="text-muted-foreground text-sm hover:text-foreground">
            Ver todos os Drivers
          </Link>
        </div>
      </div>
    );
  }

  const resolvedSlug = driver.slug;
  const isFreeDriver = FREE_DRIVERS.includes(resolvedSlug);
  const Icon = driver.icon;
  const relatedVideos = tedVideos.filter((v) => v.drivers.some((d) => d.driver === resolvedSlug));
  const driverContent = driverLearningContent[resolvedSlug];
  const quizQuestions = driverContent?.quiz || fallbackQuiz;
  const flashcards = driverContent?.flashcards || fallbackFlashcards;
  const driverArticles = scientificArticles.filter((a) => a.driver === resolvedSlug);
  const playbook2Interventions = getPlaybook2InterventionsByDriver(resolvedSlug);
  const heroSpec = getArgo4DriverHeroSpec(resolvedSlug);
  const academyHostScript = getDriverAcademyHostScript(resolvedSlug);
  const openedFromNexo = searchParams.get("source") === "nexo";
  const cycleId = searchParams.get("cycle_id") ?? "";
  const scopeId = searchParams.get("scope_id") ?? cycleId;

  const showBurst = (message: string, ift: number) => {
    setBurst({ message: message, ift });
    if (user && resolvedSlug) {
      saveCompletion(resolvedSlug, activeDynamic, undefined, ift);
    }
  };

  const premiumDynamics = ["X1-SCENARIO", "X2-BUILDER", "X3-DEBATE", "D5-PDF-PLAN", "D6-PDF-POEM", "D7-MINDMAP", "D8-ROLEPLAY", "D9-MICRO"];
  const isLocked = (dynamicId: string) => !isFreeDriver && !isPremium && premiumDynamics.includes(dynamicId);

  const allDynamics = [
    { id: "CHAT", name: "Assistente de Aprendizagem", description: "Converse e tire dúvidas práticas sobre este tema", icon: "🤖", avatarImg: driverAvatars[resolvedSlug] },
    ...learningDynamics,
  ];

  return (
    <div className="pb-24 md:pb-10">
      {/* Header — Full-Bleed Integrated Hero Band with Smooth Gradient & Pedagogical Summary */}
      <section
        aria-label={`Apresentação do tema ${driver.namePt}`}
        className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-center bg-slate-950 border-b border-border/60"
      >
        {/* Full-bleed background image attached across the entire Hero band */}
        <img
          src={heroSpec.heroImageUrl}
          alt={`Cena representativa sobre ${driver.namePt}: ${heroSpec.visualHeadlineCaptionPt}`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
        {/* Smooth directional gradient: deep readable left side blending into the photograph on the right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/82 to-slate-950/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-slate-950/40"
          aria-hidden="true"
        />

        <div className="container relative py-10 md:py-14 lg:py-16 space-y-7">
          {/* Top navigation links */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleBackNavigation}
              className="inline-flex items-center gap-1.5 text-xs text-white/85 hover:text-white transition-colors group font-body cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Voltar para página anterior
            </button>
            <span className="text-white/30 text-xs">·</span>
            <Link
              to="/drivers"
              className="inline-flex items-center gap-1.5 text-xs text-white/75 hover:text-white transition-colors font-body"
            >
              Todos os 16 Drivers
            </Link>
            <span className="text-white/30 text-xs">·</span>
            <Link
              to="/app/risk"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 transition-colors font-body"
            >
              Cockpit de Riscos NR-1
            </Link>
          </div>

          {/* Main Pedagogical Introduction */}
          <div className="max-w-2xl space-y-4">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl ${driver.bgClass} ${driver.colorClass} border ${driver.borderClass} shadow-xl backdrop-blur-sm`}
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </motion.div>
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-primary">
                    Guia Pedagógico do Driver
                  </span>
                  {!isFreeDriver && !isPremium && (
                    <span className="text-2xs font-bold bg-secondary/20 text-secondary px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                      Em revisão
                    </span>
                  )}
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.45 }}
                  className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.08] [text-wrap:balance]"
                >
                  {driver.namePt}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.45 }}
                  className="text-sm sm:text-base text-white/90 font-body leading-relaxed"
                >
                  {driver.tagline}
                </motion.p>
              </div>
            </div>

            {/* Friendly Pedagogical Summary of the Driver */}
            <div className="rounded-2xl border border-white/15 bg-black/45 backdrop-blur-md p-4 sm:p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Sobre este tema e como ele apoia o dia a dia
              </p>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                {driver.playbook2SpotlightPt
                  ? `${driver.playbook2SpotlightPt} `
                  : ""}
                {playbook2Interventions[0]?.mechanismSummaryPt ??
                  heroSpec.visualHeadlineCaptionPt}
              </p>
            </div>
          </div>

          {/* 4-Card Summary of What Learning Features are on the Page (Zero Dead-Scroll Triggers) */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-white/80">
              Toque em qualquer recurso abaixo para abrir imediatamente no palco interativo:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => selectDynamicAndFocus("PB2-RAG", { scrollToStage: true })}
                className={`text-left rounded-xl border backdrop-blur-md px-4 py-3 transition-all cursor-pointer ${
                  activeDynamic === "PB2-RAG"
                    ? "border-primary bg-primary/20 shadow-md"
                    : "border-white/15 bg-black/50 hover:bg-black/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-white">
                  <span className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-primary shrink-0" />
                    <span>1. Práticas Recomendadas</span>
                  </span>
                  <span className="text-[10px] font-semibold text-teal-300">Abrir ↓</span>
                </div>
                <p className="text-[11px] text-white/75 mt-1 leading-snug">
                  Veja ações concretas, exemplos de aplicação e cuidados importantes sobre {driver.namePt.toLowerCase()}.
                </p>
              </button>

              <button
                type="button"
                onClick={() => selectDynamicAndFocus("CHAT", { scrollToStage: true })}
                className={`text-left rounded-xl border backdrop-blur-md px-4 py-3 transition-all cursor-pointer ${
                  activeDynamic === "CHAT"
                    ? "border-primary bg-primary/20 shadow-md"
                    : "border-white/15 bg-black/50 hover:bg-black/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-white">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                    <span>2. Assistente de Aprendizagem</span>
                  </span>
                  <span className="text-[10px] font-semibold text-teal-300">Abrir ↓</span>
                </div>
                <p className="text-[11px] text-white/75 mt-1 leading-snug">
                  Converse para tirar dúvidas e descobrir como adaptar as boas práticas à realidade da sua equipe.
                </p>
              </button>

              <div
                className={`text-left rounded-xl border backdrop-blur-md px-4 py-3 transition-all flex flex-col justify-between ${
                  activeDynamic === "D1-QUIZ" || activeDynamic === "D2-FLASH"
                    ? "border-primary bg-primary/20 shadow-md"
                    : "border-white/15 bg-black/50 hover:bg-black/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-white">
                    <span className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary shrink-0" />
                      <span>3. Quiz & Flashcards</span>
                    </span>
                    <span className="text-[10px] font-semibold text-amber-300">1 Toque</span>
                  </div>
                  <p className="text-[11px] text-white/75 mt-1 leading-snug">
                    Teste seus conhecimentos ou vire os cartões de memorização rápida sem rolar a página.
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => selectDynamicAndFocus("D1-QUIZ", { scrollToStage: true })}
                    data-testid="hero-quick-open-quiz"
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      activeDynamic === "D1-QUIZ"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    🎯 Abrir Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDynamicAndFocus("D2-FLASH", { scrollToStage: true })}
                    data-testid="hero-quick-open-flashcards"
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      activeDynamic === "D2-FLASH"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    🃏 Flashcards
                  </button>
                </div>
              </div>

              <div
                className={`text-left rounded-xl border backdrop-blur-md px-4 py-3 transition-all flex flex-col justify-between ${
                  activeDynamic === "D3-VIDEOLAB" || activeDynamic === "X1-SCENARIO"
                    ? "border-primary bg-primary/20 shadow-md"
                    : "border-white/15 bg-black/50 hover:bg-black/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-white">
                    <span className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                      <span>4. Vídeos & Simulações</span>
                    </span>
                    <span className="text-[10px] font-semibold text-teal-300">1 Toque</span>
                  </div>
                  <p className="text-[11px] text-white/75 mt-1 leading-snug">
                    Assista a palestras selecionadas, faça simulações de decisão e gere roteiros em PDF.
                  </p>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => selectDynamicAndFocus("D3-VIDEOLAB", { scrollToStage: true })}
                    data-testid="hero-quick-open-videolab"
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      activeDynamic === "D3-VIDEOLAB"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    🎬 VideoLab
                  </button>
                  <button
                    type="button"
                    onClick={() => selectDynamicAndFocus("D5-PDF-PLAN", { scrollToStage: true })}
                    data-testid="hero-quick-open-pdfplan"
                    className={`flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      activeDynamic === "D5-PDF-PLAN"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    📋 Roteiro PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {openedFromNexo && (
          <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Camada NEXO · Educar</p>
                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                    Os resultados mostram percepções agregadas sobre condições de trabalho. A leitura deve considerar o contexto da organização.
                    Esta página explica o driver sem carregar dados sensíveis na URL; o cockpit autorizado mantém as dimensões e evidências agregadas.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/app/actions?driver_key=${encodeURIComponent(driver.slug)}&cycle_id=${encodeURIComponent(cycleId)}&scope_id=${encodeURIComponent(scopeId)}&source=nexo`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent"
                >
                  <ListChecks className="h-3.5 w-3.5" /> Transformar
                </Link>
                <Link
                  to={`/app/documents?driver_key=${encodeURIComponent(driver.slug)}&cycle_id=${encodeURIComponent(cycleId)}&scope_id=${encodeURIComponent(scopeId)}&source=nexo`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent"
                >
                  <FileText className="h-3.5 w-3.5" /> Relatar
                </Link>
              </div>
            </div>
          </div>
        )}

        {academyHostScript && (
          <DriverAcademyHollywoodHost
            script={academyHostScript}
            activeDynamic={activeDynamic}
            onSelectDynamic={(dynamicId) => selectDynamicAndFocus(dynamicId, { scrollToStage: true })}
          />
        )}

        <div id="driver-learning-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-20">
          {/* 1 · MOBILE & TABLET (< 1024px) STICKY HORIZONTAL LEARNING DOCK — Zero Dead-Scroll */}
          <div
            className="lg:hidden sticky top-14 z-30 -mx-4 px-4 py-2.5 bg-background/95 backdrop-blur-xl border-y border-border/80 shadow-sm"
            data-testid="driver-mobile-sticky-dock"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary text-[11px] font-bold">
                  {allDynamics.findIndex((d) => d.id === activeDynamic) + 1}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary truncate">
                  {allDynamics.find((d) => d.id === activeDynamic)?.name ?? "Ferramenta Ativa"}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  ({allDynamics.findIndex((d) => d.id === activeDynamic) + 1}/{allDynamics.length})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileToolsGridOpen((prev) => !prev)}
                data-testid="driver-mobile-tools-grid-toggle"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary/40 transition-colors shrink-0"
              >
                <LayoutGrid className="h-3 w-3 text-primary" />
                <span>{mobileToolsGridOpen ? "Fechar grade" : `Ver todas (${allDynamics.length})`}</span>
                {mobileToolsGridOpen ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Barra Horizontal Deslizante de Acesso Instantâneo (Estilo Duolingo / MasterClass / Linear) */}
            <div
              ref={mobileDockRef}
              className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
              role="tablist"
              aria-label="Selecionar ferramenta de aprendizagem"
            >
              {allDynamics.map((d, idx) => {
                const isSelected = activeDynamic === d.id;
                const locked = isLocked(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    data-dynamic-dock-chip={d.id}
                    data-testid={`driver-mobile-dock-chip-${d.id}`}
                    onClick={() => selectDynamicAndFocus(d.id, { scrollToStage: false })}
                    className={`min-h-[40px] shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm font-bold"
                        : "border-border/80 bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm leading-none" aria-hidden="true">
                      {d.icon}
                    </span>
                    <span className="whitespace-nowrap">
                      {idx + 1}. {d.name}
                    </span>
                    {locked && <Lock className="h-3 w-3 opacity-60 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Gaveta Compacta em Grade 2 Colunas (Fecha automaticamente ao escolher qualquer ferramenta) */}
            {mobileToolsGridOpen && (
              <div
                className="mt-2.5 max-h-[55vh] overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                data-testid="driver-mobile-tools-grid-drawer"
              >
                {allDynamics.map((d, idx) => {
                  const isSelected = activeDynamic === d.id;
                  const locked = isLocked(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => selectDynamicAndFocus(d.id, { scrollToStage: true })}
                      className={`text-left rounded-xl border px-3 py-2.5 transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border/70 bg-background/60 text-foreground hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{d.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">
                            {idx + 1}. {d.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {d.description}
                          </div>
                        </div>
                      </div>
                      {locked ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : isSelected ? (
                        <span className="text-[10px] font-bold text-primary shrink-0">Ativo</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2 · DESKTOP SIDEBAR (>= 1024px) */}
          <div className="hidden lg:block lg:col-span-4 space-y-2">
            <h3 className="font-display text-2xs font-bold mb-3 text-muted-foreground uppercase tracking-widest">
              Ferramentas de Aprendizagem ({allDynamics.length})
            </h3>
            {allDynamics.map((d, i) => (
              <LearningDynamicCard
                key={d.id}
                {...d}
                index={i}
                active={activeDynamic === d.id}
                onClick={() => selectDynamicAndFocus(d.id, { scrollToStage: false })}
              />
            ))}
          </div>

          {/* 3 · PALCO ATIVO DE APRENDIZAGEM (Sticky no Desktop + Zero Dead-Scroll no Mobile/Tablet) */}
          <div
            id="driver-active-stage-panel"
            className="lg:col-span-8 lg:sticky lg:top-20 lg:self-start scroll-mt-32"
          >
            {/* Quick-Switch Bar no topo do Palco para alternância rápida de 1 clique (Flashcards, Quiz, Chat, Práticas, Vídeos) */}
            <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-border/80 bg-card/80 px-3.5 py-2 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs font-bold text-foreground truncate">
                  Palco Ativo: {allDynamics.find((d) => d.id === activeDynamic)?.name}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 shrink-0">
                {[
                  { id: "PB2-RAG", label: "📖 Práticas" },
                  { id: "CHAT", label: "🤖 Assistente" },
                  { id: "D1-QUIZ", label: "🎯 Quiz" },
                  { id: "D2-FLASH", label: "🃏 Flashcards" },
                  { id: "D3-VIDEOLAB", label: "🎬 Vídeos" },
                ].map((quick) => (
                  <button
                    key={quick.id}
                    type="button"
                    onClick={() => selectDynamicAndFocus(quick.id, { scrollToStage: false })}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                      activeDynamic === quick.id
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              key={activeDynamic}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-2xl border bg-card p-5 sm:p-6 shadow-card transition-all duration-500 ${
                stageHighlightPulse
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border"
              }`}
            >
              {/* Locked overlay */}
              {isLocked(activeDynamic) && (
                <div className="text-center py-12 space-y-4">
                  <Lock className="h-12 w-12 mx-auto text-muted-foreground/30" />
                  <h3 className="font-display text-lg font-bold">Dinâmica em revisão de disponibilidade</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Esta dinâmica integra a demonstração sintética. Sua disponibilidade ampla depende de gate, revisão técnica e decisão de produto; não há assinatura ou contratação habilitada nesta etapa.
                  </p>
                  <Link to="/planos" className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:shadow-lg transition-all">
                    <Sparkles className="h-4 w-4" /> Conhecer caminhos de prontidão
                  </Link>
                </div>
              )}

              {!isLocked(activeDynamic) && (
                <>
                  {activeDynamic === "PB2-RAG" && (
                    <div className="space-y-7">
                      {/* Header Executivo (Zero-Pill Metadata Discipline) */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-border/70">
                        <div className="max-w-2xl">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-primary">
                              Guia Prático de Aprendizagem
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Work Wellbeing Playbook 2.0</span>
                          </div>
                          <h3 className="font-display text-lg sm:text-xl font-bold mt-1.5 text-foreground [text-wrap:balance]">
                            Práticas Recomendadas — {driver.namePt}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                            Conheça ações práticas e estudos de referência do <em>Work Wellbeing Playbook 2.0</em> organizados em matriz executiva para apoiar melhorias reais no ambiente de trabalho. Catálogo em revisão · sem conclusão técnica.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveDynamic("CHAT")}
                          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Conversar com o Assistente
                        </button>
                      </div>

                      {/* 1. Matriz Executiva Comparativa (Tipografia Tabular Limpa sem Pílulas Estáticas) */}
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Table2 className="h-4 w-4 text-primary" />
                            <h4 className="font-display text-sm font-bold text-foreground">
                              Matriz Comparativa de Intervenções — {driver.namePt}
                            </h4>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono tabular-nums">
                            {playbook2Interventions.length} eixos catalogados · Clique em uma linha para focar
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-border bg-background/50">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground">
                                <th className="py-2.5 px-3.5">Eixo / Prática Recomendada</th>
                                <th className="py-2.5 px-3.5">Escopo Organizacional</th>
                                <th className="py-2.5 px-3.5 hidden md:table-cell">Estudos Primários</th>
                                <th className="py-2.5 px-3.5 hidden sm:table-cell">Subescalas COPSOQ II</th>
                                <th className="py-2.5 px-3.5 text-right">Leitura</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {playbook2Interventions.map((rec, idx) => {
                                const isFocused =
                                  selectedPracticeId === "ALL" ||
                                  selectedPracticeId === rec.interventionId;
                                return (
                                  <tr
                                    key={rec.interventionId}
                                    onClick={() =>
                                      selectPracticeAndFocus(
                                        selectedPracticeId === rec.interventionId
                                          ? "ALL"
                                          : rec.interventionId,
                                      )
                                    }
                                    className={`cursor-pointer transition-colors ${
                                      selectedPracticeId === rec.interventionId
                                        ? "bg-primary/10"
                                        : isFocused
                                          ? "hover:bg-muted/30"
                                          : "opacity-60 hover:opacity-100"
                                    }`}
                                  >
                                    <td className="py-2.5 px-3.5 font-semibold text-foreground">
                                      <span className="font-mono tabular-nums text-muted-foreground mr-2">
                                        0{idx + 1}.
                                      </span>
                                      <span>{rec.titlePt}</span>
                                    </td>
                                    <td className="py-2.5 px-3.5 text-muted-foreground">
                                      {interventionScopeLabelPt(rec.scope)}
                                    </td>
                                    <td className="py-2.5 px-3.5 hidden md:table-cell text-muted-foreground text-[11px]">
                                      {rec.primaryCitations
                                        .map((c) => `${c.authors} (${c.year})`)
                                        .join(" · ")}
                                    </td>
                                    <td className="py-2.5 px-3.5 hidden sm:table-cell font-mono tabular-nums text-[11px] text-muted-foreground">
                                      {rec.copsoqShortSubscaleCodes.join(", ")}
                                    </td>
                                    <td className="py-2.5 px-3.5 text-right font-medium text-primary">
                                      {selectedPracticeId === rec.interventionId
                                        ? "Em foco ↓"
                                        : "Focar ↓"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 2. Segmented Control para Filtro Rápido por Eixo */}
                      <div className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-muted/50 p-1.5">
                        <button
                          type="button"
                          onClick={() => selectPracticeAndFocus("ALL")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            selectedPracticeId === "ALL"
                              ? "bg-card text-foreground shadow-xs font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Visão Completa ({playbook2Interventions.length})
                        </button>
                        {playbook2Interventions.map((rec, idx) => (
                          <button
                            key={rec.interventionId}
                            type="button"
                            onClick={() => selectPracticeAndFocus(rec.interventionId)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              selectedPracticeId === rec.interventionId
                                ? "bg-card text-foreground shadow-xs font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="font-mono tabular-nums mr-1">0{idx + 1}.</span>
                            {rec.titlePt}
                          </button>
                        ))}
                      </div>

                      {/* 3. Seções Editoriais de cada Prática Recomendada (Single-Elevation Depth com Divisórias Hairline) */}
                      <div id="driver-active-practice-detail" className="divide-y divide-border/70 scroll-mt-32">
                        {selectedPracticeId !== "ALL" && (
                          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs">
                            <span className="font-semibold text-primary">
                              Eixo em foco selecionado · Exibindo detalhamento prático e estudos primários
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedPracticeId("ALL")}
                              className="font-bold text-primary hover:underline shrink-0"
                            >
                              Mostrar todos ({playbook2Interventions.length})
                            </button>
                          </div>
                        )}
                        {playbook2Interventions
                          .filter(
                            (rec) =>
                              selectedPracticeId === "ALL" ||
                              selectedPracticeId === rec.interventionId,
                          )
                          .map((rec, idx) => (
                            <article
                              key={rec.interventionId}
                              className="py-6 first:pt-2 last:pb-2 space-y-5"
                            >
                              {/* Cabeçalho Editorial Limpo */}
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono tabular-nums font-bold text-primary">
                                    Eixo 0{idx + 1}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{interventionScopeLabelPt(rec.scope)}</span>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono tabular-nums">
                                    COPSOQ II: {rec.copsoqShortSubscaleCodes.join(", ")}
                                  </span>
                                </div>
                                <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                                  {rec.titlePt}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[72ch]">
                                  {rec.mechanismSummaryPt}
                                </p>
                              </div>

                              {/* Grid 2 Colunas: Ações Práticas (Esquerda) + Conceito e Guardrail (Direita) */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
                                <div className="lg:col-span-7 space-y-2.5">
                                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                    <Target className="h-3.5 w-3.5 text-primary" />
                                    Como colocar em prática no dia a dia
                                  </p>
                                  <ul className="space-y-2">
                                    {rec.actionablePracticesPt.map((prac) => (
                                      <li
                                        key={prac}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed"
                                      >
                                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <span>{prac}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="lg:col-span-5 space-y-3">
                                  {rec.spotlightConceptPt && (
                                    <div className="rounded-xl border border-border bg-muted/20 p-3.5 text-xs text-foreground leading-relaxed space-y-1">
                                      <div className="font-semibold text-primary">
                                        Conceito-Chave Playbook 2.0
                                      </div>
                                      <p className="text-muted-foreground">{rec.spotlightConceptPt}</p>
                                    </div>
                                  )}

                                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3.5 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                                    <div className="font-semibold flex items-center gap-1.5">
                                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                      Ponto de atenção importante
                                    </div>
                                    <p className="leading-relaxed opacity-90">{rec.keyGuardrailPt}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Tabela Estruturada de Estudos de Referência */}
                              <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                                  Estudos de referência sobre este tema ({rec.primaryCitations.length})
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-border bg-background/50">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground">
                                        <th className="py-2 px-3">Autor (Ano)</th>
                                        <th className="py-2 px-3">Desenho</th>
                                        <th className="py-2 px-3 hidden sm:table-cell">Título & Periódico</th>
                                        <th className="py-2 px-3">Síntese do Achado</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                      {rec.primaryCitations.map((cit) => (
                                        <tr key={cit.citationId} className="align-top hover:bg-muted/20">
                                          <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap font-mono tabular-nums">
                                            {cit.authors} ({cit.year})
                                          </td>
                                          <td className="py-2.5 px-3 whitespace-nowrap text-muted-foreground">
                                            {cit.studyDesign}
                                          </td>
                                          <td className="py-2.5 px-3 hidden sm:table-cell">
                                            <p className="font-medium text-foreground">{cit.title}</p>
                                            <p className="text-[11px] italic text-muted-foreground mt-0.5">
                                              {cit.journalOrPublisher}
                                            </p>
                                          </td>
                                          <td className="py-2.5 px-3 text-xs text-muted-foreground leading-relaxed">
                                            {cit.findingSummaryPt}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </article>
                          ))}
                      </div>

                      <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                        Referência: {PLAYBOOK_2_CANONICAL_META.canonicalCitation} ({PLAYBOOK_2_CANONICAL_META.licenseCode}). Este conteúdo apoia o aprendizado e a reflexão sobre o ambiente de trabalho; não garante conformidade e não substitui o responsável técnico nem a validação jurídica e técnica.
                      </p>
                    </div>
                  )}
                  {activeDynamic === "CHAT" && (
                    <DriverChatbot driverSlug={driver.slug} driverName={driver.namePt} />
                  )}
                  {activeDynamic === "D1-QUIZ" && (
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1">Quiz Adaptativo</h3>
                      <p className="text-2xs text-muted-foreground mb-6">Teste seus conhecimentos sobre {driver.namePt}</p>
                      <QuizEngine questions={quizQuestions} driverName={driver.namePt} onComplete={(score) => showBurst(`Quiz completo! ${score}/${quizQuestions.length} acertos`, 8)} />
                    </div>
                  )}
                  {activeDynamic === "D2-FLASH" && (
                    <div>
                      <h3 className="font-display text-lg font-bold mb-1">Flashcards</h3>
                      <p className="text-2xs text-muted-foreground mb-6">Repetição espaçada para {driver.namePt}</p>
                      <Flashcards cards={flashcards} driverName={driver.namePt} />
                    </div>
                  )}
                  {activeDynamic === "D3-VIDEOLAB" && (
                    <div>
                      <div className="flex items-start gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Film className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold leading-tight">VideoLab — complementos de estudo</h3>
                          <p className="text-2xs text-muted-foreground mt-1 leading-relaxed">
                            Vídeos externos organizados para exploração pedagógica do tema <strong>{driver.namePt}</strong>.
                            A relação temática é uma pista de navegação, não uma validação científica, recomendação técnica ou evidência de eficácia.
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2 py-1">
                            <ShieldAlert className="h-3 w-3" />
                            Referências externas em revisão
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {relatedVideos.length > 0 ? (
                          relatedVideos.map((v) => (
                            <VideoLab
                              key={v.id}
                              title={v.titlePt}
                              url={v.url}
                              embedUrl={v.embedUrl}
                              speaker={v.speaker}
                              summary={v.summary}
                              source="TED"
                              sourceMeta={`TED.com · ${v.id}`}
                              driverIntersection={`Esta palestra dialoga com ${driver.namePt} ao iluminar mecanismos psicológicos e organizacionais que sustentam ${driver.tagline.toLowerCase()}`}
                            />
                          ))
                        ) : (
                          <VideoLab
                            title="Work Wellbeing Playbook — Introdução"
                            embedUrl="https://www.youtube.com/embed/EUjWvb0A2rU"
                            url="https://www.youtube.com/watch?v=EUjWvb0A2rU"
                            source="YouTube"
                            sourceMeta="YouTube · referência externa"
                            summary="Referência externa para exploração pedagógica."
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 italic mt-5 leading-relaxed">
                        ▶ A reprodução ocorre no player hospedado pelo provedor. Caso o vídeo não carregue em uma rede corporativa,
                        use o botão <strong>Assistir no TED.com</strong>{" "}para abrir a referência externa em nova aba.
                      </p>
                    </div>
                  )}
                  {activeDynamic === "D4-EVIDENCE" && (
                    <div>
                      <div className="flex items-start gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold leading-tight">Explorador de referências — catálogo em revisão</h3>
                          <p className="text-2xs text-muted-foreground mt-1 leading-relaxed">
                            {driverArticles.length} referência{driverArticles.length !== 1 ? "s" : ""} catalogada{driverArticles.length !== 1 ? "s" : ""} para exploração pedagógica do tema{" "}
                            <strong>{driver.namePt}</strong>. Metadados e relação com o driver aguardam revisão técnica e metodológica.
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2 py-1">
                            <ShieldAlert className="h-3 w-3" />
                            Catálogo em revisão · sem conclusão técnica
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {driverArticles.length > 0 ? (
                          driverArticles.map((art) => (
                            <article key={art.id} className="rounded-2xl border border-border bg-card p-4 hover:shadow-elevated transition-shadow">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg font-bold uppercase ${
                                  art.status === "open" ? "bg-success/10 text-success" :
                                  art.status === "paywall" ? "bg-secondary/15 text-secondary" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {art.status === "open" ? "Acesso informado: aberto" : art.status === "paywall" ? "Acesso informado: restrito" : "Acesso não confirmado"}
                                </span>
                                {art.tier && (
                                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                                    Classificação do catálogo: {art.tier}
                                  </span>
                                )}
                                <span className="text-[10px] text-muted-foreground">{art.year}</span>
                              </div>
                              <h4 className="text-sm font-bold leading-snug">{art.title}</h4>
                              <p className="text-[11px] text-muted-foreground mt-1">
                                {art.authors} · <em>{art.journal}</em>
                              </p>
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                O resumo do catálogo não é exibido enquanto a revisão técnica e metodológica estiver pendente.
                              </p>
                              <a
                                href={art.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:underline"
                              >
                                Abrir referência externa
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              <p className="text-[10px] font-mono text-muted-foreground/70 break-all mt-2 border-t border-border pt-2">
                                🔗 {art.url}
                              </p>
                            </article>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                            <p className="text-xs text-muted-foreground">
                              Nenhuma referência catalogada neste driver ainda.{" "}
                              <Link to="/library" className="text-primary underline">Explorar Biblioteca completa →</Link>
                            </p>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground/70 italic">
                          ⚠️ A presença de DOI, URL ou classificação no catálogo não atesta autoria, método, qualidade, aplicabilidade, eficácia ou conformidade.
                          Consulte a fonte original e a revisão técnica antes de utilizar qualquer referência em decisão.
                        </p>
                      </div>
                    </div>
                  )}
                  {activeDynamic === "D5-PDF-PLAN" && (
                    <PDFGenerator driverName={driver.namePt} driverSlug={driver.slug} pdfType="technical" onComplete={(ift) => showBurst("PDF técnico gerado! 📋", ift)} />
                  )}
                  {activeDynamic === "D6-PDF-POEM" && (
                    <PDFGenerator driverName={driver.namePt} driverSlug={driver.slug} pdfType="poetic" onComplete={(ift) => showBurst("Poesia pedagógica gerada! 🎭", ift)} />
                  )}
                  {activeDynamic === "X1-SCENARIO" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="scenario" title="Simulador de Decisões" icon="🎮" startPrompt={`Crie o primeiro cenário de simulação para o driver ${driver.namePt}. Contexto: uma organização brasileira de médio porte.`} iftReward={12} onComplete={(ift) => showBurst("Simulação completa! 🎮", ift)} />
                  )}
                  {activeDynamic === "X2-BUILDER" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="builder" title="Estúdio de Co-design" icon="🏗️" startPrompt={`Inicie o processo guiado de co-design para o driver ${driver.namePt}. Comece perguntando sobre o contexto organizacional do usuário.`} iftReward={15} onComplete={(ift) => showBurst("Plano de intervenção criado! 🏗️", ift)} />
                  )}
                  {activeDynamic === "X3-DEBATE" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="debate" title="Arena de Debate Socrático" icon="⚔️" startPrompt={`Apresente uma tese provocativa para debate socrático sobre o driver ${driver.namePt}. A tese deve desafiar uma crença comum sobre este tema.`} iftReward={12} onComplete={(ift) => showBurst("Debate mapeado! ⚔️", ift)} />
                  )}
                  {activeDynamic === "D7-MINDMAP" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="mindmap" title="Mapa Mental Interativo" icon="🧭" startPrompt={`Inicie o mapa mental do driver ${driver.namePt}. Apresente o nó central e proponha 4 a 6 ramos primários para o usuário escolher qual expandir primeiro.`} iftReward={12} onComplete={(ift) => showBurst("Mapa mental cartografado! 🧭", ift)} />
                  )}
                  {activeDynamic === "D8-ROLEPLAY" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="roleplay" title="Roleplay Multi-Persona" icon="🎭" startPrompt={`Apresente um dilema realista do driver ${driver.namePt} numa organização brasileira de médio porte e faça as três personas (CEO Marina, RH André, Colaboradora Júlia) reagirem em blocos separados. Encerre perguntando como o usuário mediaria.`} iftReward={14} onComplete={(ift) => showBurst("Cena mediada! 🎭", ift)} />
                  )}
                  {activeDynamic === "D9-MICRO" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="microlearning" title="Microlearning Espaçado" icon="⚡" startPrompt={`Pergunte primeiro qual o nível do usuário (Iniciante / Aplicado / Avançado) no driver ${driver.namePt} e, ao receber a resposta, entregue a Pílula #1 (60 segundos) seguindo o formato definido.`} iftReward={8} onComplete={(ift) => showBurst("Pílula consolidada! ⚡", ift)} />
                  )}
                  {activeDynamic === "D10-TWIN" && (
                    <AIDynamic driverName={driver.namePt} driverSlug={driver.slug} dynamicType="digitaltwin" title="Gêmeo Digital Organizacional" icon="🧬" startPrompt={`Inicie a Fase 1 (Calibração do Gêmeo) do driver ${driver.namePt}. Apresente brevemente o que é um gêmeo digital organizacional (2 linhas) e peça as 5 variáveis de calibração em formato de lista numerada para o usuário responder de uma vez.`} iftReward={20} onComplete={(ift) => showBurst("Gêmeo digital calibrado! 🧬", ift)} />
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AchievementBurst message={burst?.message || ""} iftAmount={burst?.ift} show={!!burst} onClose={() => setBurst(null)} />
    </div>
  );
}
