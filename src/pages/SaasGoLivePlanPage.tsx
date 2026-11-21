import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router/compat";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCopy,
  Download,
  Presentation,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  DEVELOPMENT_SUPER_PROMPT,
  GOLIVE_CHAPTERS,
  PLAN_DOCUMENT_META,
} from "@/data/saasGoLivePlan";
import {
  saasMaturityContext,
  saasMaturityItems,
  saasMaturityPolicy,
} from "@/data/saasMaturityAssessment";
import { evaluateSaasMaturity } from "@/lib/governance/saasMaturity";
import {
  ChapterBenchmarks,
  ChapterCheckoutFirst,
  ChapterHeader,
  ChapterKeysAndNr1Chain,
  ChapterMaturityAudit,
  ChapterPlansAndRbac,
  ChapterRoadmapAndSuperPrompt,
} from "@/components/plan/SaasGoLiveChapters";

type ViewMode = "reading" | "presentation";

export default function SaasGoLivePlanPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("reading");
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);
  const [lastExportedFile, setLastExportedFile] = useState<string | null>(null);

  const maturitySummary = useMemo(
    () =>
      evaluateSaasMaturity(
        saasMaturityItems,
        saasMaturityContext,
        saasMaturityPolicy,
      ),
    [],
  );

  const handleCopySuperPrompt = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(DEVELOPMENT_SUPER_PROMPT);
      }
      setCopiedPrompt(true);
      toast.success("Super Prompt copiado para a área de transferência.");
      window.setTimeout(() => setCopiedPrompt(false), 2600);
    } catch {
      toast.error("Não foi possível copiar automaticamente. Selecione o texto no Capítulo 06.");
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (exportingPdf) return;
    setExportingPdf(true);
    try {
      const { downloadSaasGoLivePlanPdf } = await import(
        "@/lib/documents/saasGoLivePlanPdf"
      );
      const filename = downloadSaasGoLivePlanPdf(maturitySummary);
      setLastExportedFile(filename);
      toast.success(`Dossiê executivo exportado: ${filename}`);
    } catch {
      toast.error("Não foi possível gerar o PDF neste momento.");
    } finally {
      setExportingPdf(false);
    }
  }, [exportingPdf, maturitySummary]);

  // Keyboard navigation in Presentation (Slides) mode
  useEffect(() => {
    if (viewMode !== "presentation") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowRight") {
        setActiveChapterIdx((prev) => Math.min(GOLIVE_CHAPTERS.length - 1, prev + 1));
      } else if (event.key === "ArrowLeft") {
        setActiveChapterIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode]);

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    if (viewMode === "reading") {
      const chapter = GOLIVE_CHAPTERS[idx];
      const target = document.getElementById(`chapter-${chapter.id}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderChapterBody = (chapterId: string) => {
    switch (chapterId) {
      case "maturidade":
        return <ChapterMaturityAudit summary={maturitySummary} />;
      case "benchmark":
        return <ChapterBenchmarks />;
      case "checkout-first":
        return <ChapterCheckoutFirst />;
      case "planos-rbac":
        return <ChapterPlansAndRbac />;
      case "chaves-nr1":
        return <ChapterKeysAndNr1Chain />;
      case "roadmap-prompt":
        return (
          <ChapterRoadmapAndSuperPrompt
            onCopyPrompt={handleCopySuperPrompt}
            copied={copiedPrompt}
            onExportPdf={handleExportPdf}
            exportingPdf={exportingPdf}
          />
        );
      default:
        return null;
    }
  };

  const currentChapter = GOLIVE_CHAPTERS[activeChapterIdx] ?? GOLIVE_CHAPTERS[0];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-16">
      {/* Executive Header Band — Compact in Presentation Mode to maximize slide viewport */}
      <section className="border-b border-border/80 bg-card/60">
        <div className={`container ${viewMode === "presentation" ? "py-4 space-y-3" : "py-8 sm:py-10 space-y-6"}`}>
          {/* Breadcrumb + Live Gate Context */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/app/governance"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Governança
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-foreground font-medium">
                Plano Executivo Go-Live SaaS
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{PLAN_DOCUMENT_META.version}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Gate {maturitySummary.currentGate}
              </span>
              <span aria-hidden="true">·</span>
              <span>Score Global {maturitySummary.scorePct}%</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 dark:text-amber-400">
                Dados reais bloqueados até G3
              </span>
            </div>
          </div>

          {/* Title & Primary Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            {viewMode === "presentation" ? (
              <div className="space-y-0.5 min-w-0">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {PLAN_DOCUMENT_META.title}
                </h1>
                {lastExportedFile && (
                  <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                    PDF pronto: {lastExportedFile}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 max-w-3xl">
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                  Dossiê de Alinhamento para Diretoria, SST, RH, Jurídico &amp; Engenharia
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
                  {PLAN_DOCUMENT_META.title}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {PLAN_DOCUMENT_META.subtitle}
                </p>
              </div>
            )}

            {/* Action Cluster */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div
                className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5"
                role="group"
                aria-label="Modo de visualização do plano"
              >
                <button
                  type="button"
                  onClick={() => setViewMode("reading")}
                  aria-pressed={viewMode === "reading"}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === "reading"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Leitura Completa
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("presentation")}
                  aria-pressed={viewMode === "presentation"}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === "presentation"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Presentation className="h-3.5 w-3.5" />
                  Modo Apresentação
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopySuperPrompt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Prompt copiado
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
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                {exportingPdf ? "Gerando PDF A4…" : "Exportar PDF Completo (A4)"}
              </button>
            </div>
          </div>

          {/* Governance Honesty Strip + PDF Feedback (Reading Mode) */}
          {viewMode === "reading" && (
            <div className="rounded-xl border border-border/80 bg-background/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start sm:items-center gap-2.5 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
                <span>{PLAN_DOCUMENT_META.governanceNotice}</span>
              </div>
              {lastExportedFile && (
                <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 shrink-0">
                  PDF pronto: {lastExportedFile}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Chapter Navigation Bar */}
      <div className="sticky top-14 z-30 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="container py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
          <nav
            className="flex items-center gap-1.5 min-w-max"
            aria-label="Capítulos do Plano Executivo Go-Live"
          >
            {GOLIVE_CHAPTERS.map((chapter, idx) => {
              const isActive = idx === activeChapterIdx;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  aria-current={isActive ? "step" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-primary/12 text-foreground font-semibold border border-primary/35"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent"
                  }`}
                >
                  <span className="font-mono text-[11px] text-primary">{chapter.number}</span>
                  <span>{chapter.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          {viewMode === "presentation" && (
            <div className="hidden sm:flex items-center gap-2 shrink-0 text-xs font-mono text-muted-foreground">
              <span>
                Slide {activeChapterIdx + 1} / {GOLIVE_CHAPTERS.length}
              </span>
              <span aria-hidden="true">·</span>
              <span>Teclas ← →</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container pt-8 sm:pt-10">
        {viewMode === "presentation" ? (
          <div className="space-y-8">
            <article className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8 shadow-sm">
              <ChapterHeader
                number={currentChapter.number}
                title={currentChapter.title}
                subtitle={currentChapter.subtitle}
                audience={currentChapter.audience}
              />
              {renderChapterBody(currentChapter.id)}
            </article>

            {/* Presentation Slide Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <button
                type="button"
                onClick={() => setActiveChapterIdx((prev) => Math.max(0, prev - 1))}
                disabled={activeChapterIdx === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Capítulo anterior
              </button>

              <p className="font-mono text-xs text-muted-foreground">
                Slide {activeChapterIdx + 1} de {GOLIVE_CHAPTERS.length} · {currentChapter.shortTitle}
              </p>

              <button
                type="button"
                onClick={() =>
                  setActiveChapterIdx((prev) =>
                    Math.min(GOLIVE_CHAPTERS.length - 1, prev + 1),
                  )
                }
                disabled={activeChapterIdx === GOLIVE_CHAPTERS.length - 1}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Próximo capítulo
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {GOLIVE_CHAPTERS.map((chapter, idx) => (
              <section
                key={chapter.id}
                id={`chapter-${chapter.id}`}
                onMouseEnter={() => setActiveChapterIdx(idx)}
                className="scroll-mt-32"
              >
                <ChapterHeader
                  number={chapter.number}
                  title={chapter.title}
                  subtitle={chapter.subtitle}
                  audience={chapter.audience}
                />
                {renderChapterBody(chapter.id)}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
