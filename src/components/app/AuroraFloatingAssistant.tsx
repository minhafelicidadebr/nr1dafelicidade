/**
 * Sra. EstratégIA - IA — Consultora Digital do Instituto para Decisões NR-1
 * Workspace Agêntico 4 Abas (Conversa | Diagnóstico | Plano | Contato),
 * Tags Semânticas Interativas, Tabelas S×P Determinísticas, Roteamento Ecossistêmico,
 * Neuromarketing Ético de Alta Conversão e Exportação de Dossiê em PDF 5 Estrelas.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router/compat";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  Trash2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Table2,
  MessageSquare,
  Gauge,
  ListChecks,
  Building2,
  Download,
  CheckCircle2,
  CornerDownLeft,
  X,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import auroraAvatar from "@/assets/assistant-avatar.webp";
import AIRichMarkdown from "@/components/AIRichMarkdown";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { buildAuroraContext, createDefaultFallbackContext, type AuroraContext } from "@/lib/aurora/contextBuilder";
import { answerByIntent, AURORA_DISCLAIMER, type AuroraAnswer } from "@/lib/aurora/knowledgeBase";
import { routeFreeQuestion } from "@/lib/aurora/intentRouter";
import { getSuggestedQuestions, type SuggestedQuestion } from "@/lib/aurora/suggestedQuestions";
import { STRATEGIA_OPEN_EVENT, type OpenStrategIAArgs } from "@/lib/aurora/openAssistant";
import {
  AURORA_RETENTION_NOTICE,
  auroraRouteHistoryKey,
  clearAuroraHistory,
  loadAuroraHistory,
  saveAuroraHistory,
  type AuroraChatItem as ChatItem,
} from "@/lib/aurora/chatHistory";
import {
  STRATEGIA_DOMAIN_TAGS,
  buildConsultativeServiceRecommendation,
  buildStrategiaAuditPlanStages,
  buildStrategiaDiagnosticTable,
  buildStrategiaDiagnosticTriad,
  buildStrategiaExecutiveDossierMarkdown,
  extractRecognizedSignals,
  getRouteContextualIntelligence,
  type StrategiaDomainTagId,
  type StrategiaWorkspaceTabId,
} from "@/lib/aurora/agenticWorkspaceSkill";
import { downloadInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";

function loadHistory(pathname: string): ChatItem[] {
  if (typeof window === "undefined") return [];
  return loadAuroraHistory(window.localStorage, auroraRouteHistoryKey(pathname));
}

function saveHistory(pathname: string, items: ChatItem[]) {
  if (typeof window === "undefined") return;
  try {
    saveAuroraHistory(window.localStorage, auroraRouteHistoryKey(pathname), items);
  } catch {
    /* noop */
  }
}

function toneBadge(tone?: "neutral" | "warn" | "good" | "danger") {
  switch (tone) {
    case "danger":
      return "bg-destructive/15 text-destructive border-destructive/40";
    case "warn":
      return "bg-amber-500/15 text-amber-400 border-amber-500/40";
    case "good":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
    default:
      return "bg-muted/40 text-foreground border-border";
  }
}

function answerToMarkdown(a: AuroraAnswer, intro?: string, why?: string): string {
  const lines: string[] = [];
  const summary = intro ?? a.summary.join(" ");
  if (summary) lines.push(summary, "");
  if (a.whatDataShows.length) {
    lines.push("### O que os dados mostram", "");
    a.whatDataShows.forEach((l) => lines.push(`- ${l}`));
    lines.push("");
  }
  const w = why ?? a.whyMatters;
  if (w) lines.push("💡 " + w, "");
  if (a.nextAction) lines.push("🎯 " + a.nextAction, "");
  if (a.limitations?.length) {
    lines.push("### Limitações", "");
    a.limitations.forEach((l) => lines.push(`- ${l}`));
  }
  return lines.join("\n");
}

export default function AuroraFloatingAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StrategiaWorkspaceTabId>("conversa");
  const [activeTag, setActiveTag] = useState<StrategiaDomainTagId>("all");
  const [ctx, setCtx] = useState<AuroraContext | null>(null);
  const [loadingCtx, setLoadingCtx] = useState(false);
  const [history, setHistory] = useState<ChatItem[]>(() => loadHistory(location.pathname));
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingAskRef = useRef<OpenStrategIAArgs | null>(null);

  // Institutional Request Form State (Aba Contato)
  const [workEmail, setWorkEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [headcountBand, setHeadcountBand] = useState("");
  const [sector, setSector] = useState("");
  const [challengeNote, setChallengeNote] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [leadSubmittedProtocol, setLeadSubmittedProtocol] = useState<string | null>(null);

  const [dismissedTeaserRoute, setDismissedTeaserRoute] = useState<string | null>(null);

  const routeIntel = useMemo(() => getRouteContextualIntelligence(location.pathname), [location.pathname]);
  const orderedDomainTags = useMemo(() => {
    const baseTags = STRATEGIA_DOMAIN_TAGS.filter((t) => t.id !== "all");
    const rankMap = new Map(routeIntel.recommendedTagIds.map((id, idx) => [id, idx]));
    return [...baseTags].sort((a, b) => (rankMap.get(a.id) ?? 99) - (rankMap.get(b.id) ?? 99));
  }, [routeIntel]);

  const suggestions = useMemo(() => getSuggestedQuestions(location.pathname), [location.pathname]);
  const effectiveCtx = useMemo(() => {
    return ctx || createDefaultFallbackContext(location.pathname);
  }, [ctx, location.pathname]);

  const diagnosticTriad = useMemo(() => buildStrategiaDiagnosticTriad(effectiveCtx, history), [effectiveCtx, history]);
  const diagnosticTable = useMemo(() => buildStrategiaDiagnosticTable(effectiveCtx), [effectiveCtx]);
  const auditStages = useMemo(() => buildStrategiaAuditPlanStages(effectiveCtx), [effectiveCtx]);
  const recognizedSignals = useMemo(
    () => extractRecognizedSignals(effectiveCtx, history, activeTag),
    [effectiveCtx, history, activeTag],
  );
  const serviceRec = useMemo(() => buildConsultativeServiceRecommendation(effectiveCtx), [effectiveCtx]);

  useEffect(() => {
    setHistory(loadHistory(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    saveHistory(location.pathname, history);
  }, [location.pathname, history]);

  // Pre-fill organization details from live AuroraContext when available
  useEffect(() => {
    if (ctx?.org?.name && !organizationName) {
      setOrganizationName(ctx.org.name);
    }
    if (ctx?.cycle?.n_responses && !headcountBand) {
      setHeadcountBand(`${ctx.cycle.n_responses}+ colaboradores (${ctx.unitsCount || 1} unid.)`);
    }
  }, [ctx, organizationName, headcountBand]);

  useEffect(() => {
    function onOpenEvent(ev: Event) {
      const detail = (ev as CustomEvent<OpenStrategIAArgs>).detail;
      if (detail && (detail.question || detail.intent)) {
        pendingAskRef.current = detail;
      }
      setActiveTab("conversa");
      setOpen(true);
    }
    window.addEventListener(STRATEGIA_OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener(STRATEGIA_OPEN_EVENT, onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingCtx(true);
    buildAuroraContext(location.pathname)
      .then((c) => {
        if (!cancelled) setCtx(c);
      })
      .catch(() => {
        if (!cancelled) setCtx(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingCtx(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, location.pathname]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [history, open, activeTab]);

  const rewriteItem = useCallback(async (id: string, question: string, answer: AuroraAnswer) => {
    try {
      const { data, error } = await supabase.functions.invoke("strategia-rewrite", {
        body: { question, answer },
      });
      if (error) throw error;
      const summary = typeof data?.summary === "string" ? data.summary : "";
      const whyMatters = typeof data?.whyMatters === "string" ? data.whyMatters : "";
      if (!summary) throw new Error("empty_rewrite");
      setHistory((h) =>
        h.map((it) => (it.id === id ? { ...it, rewriting: false, rewrite: { summary, whyMatters } } : it)),
      );
    } catch {
      setHistory((h) => h.map((it) => (it.id === id ? { ...it, rewriting: false, rewriteFailed: true } : it)));
    }
  }, []);

  const pushAnswer = useCallback(
    (question: string, intent: string) => {
      const c = effectiveCtx;
      const answer = answerByIntent(intent, c);
      const id = `${intent}-${Date.now()}`;
      setHistory((h) => [...h, { id, question, answer, rewriting: true }]);
      void rewriteItem(id, question, answer);
    },
    [effectiveCtx, rewriteItem],
  );

  useEffect(() => {
    if (!open || loadingCtx || !ctx || !pendingAskRef.current) return;
    const detail = pendingAskRef.current;
    pendingAskRef.current = null;
    const q = detail.question?.trim() || "Resumo da etapa atual";
    const intent = detail.intent || routeFreeQuestion(q);
    pushAnswer(q, intent);
  }, [open, loadingCtx, ctx, pushAnswer]);

  function send() {
    const q = input.trim();
    if (!q || !ctx) return;
    const intent = routeFreeQuestion(q);
    setActiveTab("conversa");
    pushAnswer(q, intent);
    setInput("");
  }

  function ask(q: SuggestedQuestion) {
    setActiveTab("conversa");
    pushAnswer(q.label, q.intent);
  }

  function handleDomainTagClick(tagId: StrategiaDomainTagId) {
    setActiveTag(tagId);
    const tag = STRATEGIA_DOMAIN_TAGS.find((t) => t.id === tagId);
    if (tag && tagId !== "all" && ctx) {
      setActiveTab("conversa");
      pushAnswer(tag.sampleQuestion, tag.defaultIntent);
    }
  }

  function clearAll() {
    if (typeof window !== "undefined") clearAuroraHistory(window.localStorage, auroraRouteHistoryKey(location.pathname));
    setHistory([]);
  }

  function handleExportDiagnosticPdf() {
    const md = buildStrategiaExecutiveDossierMarkdown({
      ctx,
      history,
      lead: {
        workEmail,
        organizationName: organizationName || ctx?.org?.name || "Organização",
        headcountBand,
        sector,
        challengeNote,
      },
    });
    const saved = downloadInstitutionalInstructionalPdf({
      markdown: md,
      filename: `dossie_executivo_sra_estrategia_nr1_${new Date().toISOString().slice(0, 10)}.pdf`,
      meta: {
        title: "Dossiê Executivo Sra. EstratégIA — Diagnóstico Orientado & Rota Auditável NR-1",
        subtitle:
          "Síntese consultiva gerada pela Sra. EstratégIA integrando telemetria k-anonimato (k>=5), Manual Oficial MTE 2026 (Cap. 1.5 da NR-1) e Work Wellbeing Playbook 2.0 (Oxford).",
        categoryKicker: "CONSULTORIA DIGITAL SRA. ESTRATÉGIA · DOSSIÊ EXECUTIVO PDF 5 ESTRELAS",
        orgName: organizationName || ctx?.org?.name || "Organização",
        cycleName: ctx?.cycle?.name || "Ciclo NR-1 / GRO",
        sector: sector || null,
        sizeBand: headcountBand || null,
        kMin: ctx?.k_min ?? 5,
        responseCount: ctx?.cycle?.n_responses ?? null,
        version: 1,
        highlights: [
          { label: "Amostra Coletiva", value: `${ctx?.cycle?.n_responses ?? 0} resp. (k>=5)` },
          { label: "Dimensões Visíveis", value: String(ctx?.visibleScores?.length ?? 0) },
          { label: "Sinais Reconhecidos", value: String(recognizedSignals.length) },
          { label: "Interações no Dossiê", value: String(history.length) },
        ],
      },
    });
    toast.success(`Dossiê Executivo da Sra. EstratégIA exportado em PDF 5 estrelas (${saved})!`);
  }

  function handleInstitutionalLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workEmail.trim() || !workEmail.includes("@")) {
      toast.error("Informe um e-mail corporativo válido.");
      return;
    }
    if (!lgpdConsent) {
      toast.error("Confirme o consentimento LGPD para registrar sua solicitação institucional.");
      return;
    }
    const protocol = `IFT-NR1-${Date.now().toString(36).toUpperCase()}`;
    try {
      const payload = {
        protocol,
        createdAt: new Date().toISOString(),
        workEmail: workEmail.trim(),
        organizationName: organizationName.trim() || ctx?.org?.name || "Não informada",
        headcountBand: headcountBand.trim() || "Não informado",
        sector: sector.trim() || "Não informado",
        challengeNote: challengeNote.trim(),
        recognizedSignals,
        recommendedTier: serviceRec.tierTitle,
      };
      window.localStorage.setItem("strategia_last_institutional_request", JSON.stringify(payload));
    } catch {
      /* noop */
    }
    setLeadSubmittedProtocol(protocol);
    toast.success(`Solicitação institucional registrada com sucesso (Protocolo ${protocol}).`);
  }

  const showProactiveTeaser = !open && dismissedTeaserRoute !== location.pathname;
  const isInsideAppWorkspace = location.pathname.startsWith("/app");

  function triggerProactiveQuestion() {
    pendingAskRef.current = {
      question: routeIntel.proactiveIcebreakerQuestion,
      intent: routeIntel.proactiveIntent,
    };
    setActiveTab("conversa");
    setOpen(true);
  }

  return (
    <>
      {/* Pílula Proativa Inteligente Contextualizada pela Rota Atual (Exibida apenas em Desktop/Tablet >= 768px para zero poluição no Mobile) */}
      {showProactiveTeaser && (
        <div
          data-testid="strategia-proactive-route-teaser"
          className="hidden md:block fixed bottom-20 right-5 z-40 max-w-[330px] rounded-2xl border border-emerald-500/40 bg-[#071C1F]/95 text-white p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
              <Compass className="h-3 w-3 text-emerald-400 shrink-0" />
              Contexto: {routeIntel.pageBadge}
            </span>
            <button
              type="button"
              onClick={() => setDismissedTeaserRoute(location.pathname)}
              aria-label="Ocultar sugestão contextual desta página"
              className="text-emerald-200/60 hover:text-white p-0.5 rounded"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-emerald-50/95 font-medium leading-snug mt-1.5">
            “{routeIntel.proactiveIcebreakerQuestion}”
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-emerald-800/60">
            <span className="text-[10px] text-emerald-300/80">Sra. EstratégIA preparada</span>
            <button
              type="button"
              onClick={triggerProactiveQuestion}
              className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/50 px-2.5 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-400/30 transition-colors"
            >
              <span>Ver resposta</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Botão Flutuante Desktop (No Mobile o acesso à Sra. EstratégIA fica integrado como 5º CTA no Menu do Rodapé) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir Sra. EstratégIA — Consultora digital do Instituto para decisões NR-1"
        data-testid="btn-open-sra-estrategia"
        className="hidden md:flex fixed bottom-5 right-5 z-40 group items-center gap-2.5 rounded-full bg-[#071C1F] border border-emerald-500/40 pl-1.5 pr-4 py-1.5 shadow-xl shadow-black/40 hover:border-primary transition-all hover:scale-[1.02]"
      >
        <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-amber-400/70">
          <img
            src={auroraAvatar}
            alt="Sra. EstratégIA"
            width={256}
            height={256}
            decoding="async"
            className="h-full w-full object-cover"
          />
          <span
            className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#071C1F]"
            aria-hidden
          />
        </div>
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1 text-xs font-semibold text-white">
            Sra. EstratégIA
            <Sparkles className="h-3 w-3 text-amber-400" />
          </div>
          <div className="text-[10px] text-emerald-200/80">{routeIntel.pageBadge}</div>
        </div>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[720px] md:max-w-[800px] h-full max-h-[96vh] p-0 flex flex-col bg-background border-l border-border shadow-2xl"
        >
          {/* ============ CABEÇALHO EXECUTIVO (#071C1F) ============ */}
          <SheetHeader className="p-4 pb-3.5 bg-[#071C1F] text-white border-b border-emerald-900/60 space-y-3">
            <div className="flex items-start justify-between gap-2 pr-6">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden ring-2 ring-amber-400/70 shadow-md">
                  <img
                    src={auroraAvatar}
                    alt="Sra. EstratégIA"
                    width={256}
                    height={256}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#071C1F]" />
                </div>
                <div className="min-w-0">
                  <SheetTitle className="flex items-center gap-2 text-lg font-serif tracking-tight text-white">
                    Sra. EstratégIA
                    <Badge
                      variant="outline"
                      className="text-[10px] font-sans font-normal border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                    >
                      ARGO 4.0 · k≥{ctx?.k_min ?? 5}
                    </Badge>
                  </SheetTitle>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    Consultora digital do Instituto para decisões NR-1.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportDiagnosticPdf}
                  title="Baixar Dossiê Executivo em PDF 5 Estrelas"
                  className="h-7 px-2 text-[11px] text-amber-300 hover:text-amber-200 hover:bg-white/10 gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-emerald-200/70 hover:text-white hover:bg-white/10"
                  title="Abrir Estação Completa Sra. EstratégIA"
                >
                  <Link to="/app/estrategia" onClick={() => setOpen(false)}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearAll}
                    className="h-7 w-7 text-emerald-200/70 hover:text-white hover:bg-white/10"
                    title="Limpar conversa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/35 hover:text-white shrink-0 ml-1.5 shadow-md"
                  aria-label="Fechar Sra. EstratégIA"
                  title="Fechar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Interactive Domain Filter Tags Dynamically Ordered for the Current Page */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {orderedDomainTags.map((tag) => {
                const isSelected = activeTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleDomainTagClick(isSelected ? "all" : tag.id)}
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/20 text-amber-200"
                        : "border-emerald-700/70 bg-emerald-950/60 text-emerald-100/85 hover:border-emerald-400/60 hover:text-white"
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </SheetHeader>

          {/* ============ BARRA DE NAVEGAÇÃO DE 4 ABAS ============ */}
          <div
            role="tablist"
            aria-label="Módulos da Sra. EstratégIA"
            className="grid grid-cols-4 border-b border-border bg-card/90 text-xs font-medium shrink-0"
          >
            {(
              [
                { id: "conversa", label: "Conversa", icon: MessageSquare },
                { id: "diagnostico", label: "Diagnóstico", icon: Gauge },
                { id: "plano", label: "Plano", icon: ListChecks },
                { id: "contato", label: "Contato", icon: Building2 },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  data-testid={`strategia-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 border-b-2 transition-colors ${
                    active
                      ? "border-primary text-primary font-semibold bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ============ CONTEÚDO DAS 4 ABAS ============ */}
          {activeTab === "conversa" && (
            <>
              <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className="space-y-3.5 py-3.5">
                  {/* Card de Inteligência Contextual da Página Atual + Pergunta Estimuladora Proativa */}
                  <div className="rounded-2xl border border-primary/35 bg-gradient-to-br from-primary/10 via-card to-card p-3.5 text-sm shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                        <Compass className="h-3.5 w-3.5" />
                        Página Detectada: {routeIntel.pageBadge}
                      </span>
                      {!loadingCtx && ctx?.cycle && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            ctx.cycle.has_sample
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/40"
                          }`}
                        >
                          {ctx.cycle.name} · {ctx.cycle.n_responses} resp. (
                          {ctx.cycle.has_sample ? `k≥${ctx.k_min}` : `k<${ctx.k_min}`})
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {routeIntel.proactiveContextNote}
                    </p>

                    {/* Pergunta Proativa Pronta para Estimular Resposta */}
                    <div className="rounded-xl border border-primary/30 bg-background/80 p-2.5 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 dark:text-amber-300 font-semibold block">
                        Pergunta Estimuladora Preparada para esta Página:
                      </span>
                      <p className="text-xs font-semibold text-foreground leading-snug">
                        “{routeIntel.proactiveIcebreakerQuestion}”
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <Button
                          type="button"
                          size="sm"
                          disabled={loadingCtx || !ctx}
                          onClick={() =>
                            pushAnswer(routeIntel.proactiveIcebreakerQuestion, routeIntel.proactiveIntent)
                          }
                          className="h-7 text-[11px] gap-1"
                        >
                          <Sparkles className="h-3 w-3" />
                          Responder esta pergunta agora
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                        {routeIntel.contextualCtas.map((cta) => (
                          <Button
                            key={cta.to}
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px]"
                            onClick={() => {
                              setOpen(false);
                              navigate(cta.to);
                            }}
                          >
                            {cta.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4 Cards Executivos Rápidos Adaptados à Página Atual (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-2">
                    {routeIntel.contextualQuickCards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        disabled={loadingCtx || !ctx}
                        onClick={() => pushAnswer(card.question, card.intent)}
                        className="text-left rounded-xl border border-border bg-card/60 hover:bg-accent/50 hover:border-primary/40 p-3 transition-all disabled:opacity-50 group shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                            {card.title}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-snug">
                          {card.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Stream de Perguntas e Respostas */}
                  {history.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm shadow-sm">
                          {item.question}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-7 w-7 shrink-0 rounded-full overflow-hidden ring-1 ring-border">
                          <img
                            src={auroraAvatar}
                            alt=""
                            width={256}
                            height={256}
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <AnswerBubble
                          item={item}
                          onNavigate={(to) => {
                            setOpen(false);
                            navigate(to);
                          }}
                          onOpenDiagnosticTab={() => setActiveTab("diagnostico")}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Sugestões Contextuais da Rota Atual */}
                  <div className="pt-1 space-y-1.5">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                      Perguntas sugeridas para esta página
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => ask(q)}
                          disabled={loadingCtx || !ctx}
                          className="text-left text-xs rounded-full border border-border bg-card hover:bg-accent hover:border-primary/40 px-3 py-1.5 transition-colors disabled:opacity-50"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Composer Estilo Executivo (como na referência + proteção LGPD + link direto para Contato) */}
              <div className="border-t border-border bg-card/80 p-3.5 space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="rounded-2xl border border-primary/40 bg-background p-2.5 focus-within:ring-2 focus-within:ring-primary/30 transition-all"
                >
                  <textarea
                    rows={3}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Conte o desafio da sua empresa ou pergunte sobre riscos, controles e documentos NR-1…"
                    disabled={false}
                    className="w-full resize-none bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[64px]"
                  />
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/50">
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3 w-3 text-primary/80 shrink-0" />
                      Não envie dados pessoais ou de saúde · Proteção k≥{effectiveCtx.k_min}
                    </span>
                    <Button
                      type="submit"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      disabled={!input.trim()}
                      aria-label="Enviar pergunta"
                    >
                      <CornerDownLeft className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>

                <div className="flex items-center justify-between gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("contato")}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Prefiro falar diretamente com o Instituto
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("diagnostico")}
                    className="text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    Ver Diagnóstico ({diagnosticTable.length} dim.)
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ============ ABA 2: DIAGNÓSTICO ORIENTADO ============ */}
          {activeTab === "diagnostico" && (
            <ScrollArea className="flex-1 px-4">
              <div className="py-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
                      LEITURA DO CONTEXTO
                    </span>
                    <h3 className="text-lg font-serif font-bold text-foreground mt-0.5">
                      Diagnóstico orientado
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      Organizamos os sinais da conversa e a telemetria coletiva (k≥{ctx?.k_min ?? 5}) sem substituir
                      avaliação técnica ou diagnóstico ocupacional.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportDiagnosticPdf}
                    className="h-8 text-xs gap-1.5 shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 text-primary" />
                    Baixar PDF
                  </Button>
                </div>

                {/* Tríade Diagnóstica (01 Contexto | 02 Prioridades | 03 Encaminhamento) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {diagnosticTriad.map((card) => {
                    const dotColor =
                      card.status === "ready"
                        ? "bg-emerald-400"
                        : card.status === "attention"
                          ? "bg-amber-400"
                          : "bg-muted-foreground/40";
                    return (
                      <div
                        key={card.number}
                        className="rounded-xl border border-border bg-card/70 p-3 flex flex-col justify-between gap-2 shadow-xs"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-semibold text-muted-foreground">
                              {card.number}
                            </span>
                            <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                          </div>
                          <p className="text-xs font-bold text-foreground">{card.title}</p>
                          <p className="text-[11px] font-medium text-primary leading-snug">{card.headline}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{card.detail}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] justify-between w-full mt-1"
                          onClick={() => {
                            setOpen(false);
                            navigate(card.ctaTo);
                          }}
                        >
                          <span>{card.ctaLabel}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {/* Sinais Reconhecidos */}
                <div className="rounded-xl border border-border bg-card/50 p-3.5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    SINAIS RECONHECIDOS NO ECOSSISTEMA
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recognizedSignals.map((sig) => (
                      <Badge
                        key={sig}
                        variant="outline"
                        className="text-[11px] bg-background/80 border-primary/30 text-foreground"
                      >
                        {sig}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tabela Determinística de Riscos S×P e Drivers de Oxford */}
                {diagnosticTable.length > 0 && (
                  <div className="rounded-xl border border-border bg-card/70 overflow-hidden">
                    <div className="px-3.5 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Table2 className="h-3.5 w-3.5 text-primary" />
                        Matriz Tabular S×P (AIHA 5×5) & Drivers Oxford
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        k≥{ctx?.k_min ?? 5} verificado
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-border/60 bg-background/50 text-muted-foreground">
                            <th className="py-2 px-2.5 font-medium">Dimensão</th>
                            <th className="py-2 px-2 font-medium">Faixa</th>
                            <th className="py-2 px-2 font-medium text-right">S×P</th>
                            <th className="py-2 px-2.5 font-medium">Driver Playbook 2.0</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {diagnosticTable.map((row) => {
                            const badgeCls =
                              row.bandKey === "critico"
                                ? "bg-destructive/15 text-destructive border-destructive/40"
                                : row.bandKey === "alto"
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/40"
                                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
                            return (
                              <tr key={row.dimensionKey} className="hover:bg-muted/20">
                                <td className="py-2 px-2.5 font-medium text-foreground">
                                  #{row.rank} {row.dimensionLabel}
                                </td>
                                <td className="py-2 px-2">
                                  <span className={`inline-block rounded border px-1.5 py-0.5 text-[10px] ${badgeCls}`}>
                                    {row.bandLabel}
                                  </span>
                                </td>
                                <td className="py-2 px-2 text-right font-mono tabular-nums">
                                  R{row.riskScore} ({row.formula})
                                </td>
                                <td className="py-2 px-2.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpen(false);
                                      navigate(row.routeTo);
                                    }}
                                    className="text-primary hover:underline inline-flex items-center gap-1"
                                  >
                                    {row.driverLabel}
                                    <ArrowRight className="h-2.5 w-2.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("plano")}>
                    Ver Rota Recomendada (Plano)
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                  <Button size="sm" onClick={() => setActiveTab("contato")}>
                    Solicitar Apoio do Instituto
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}

          {/* ============ ABA 3: PLANO (DA DÚVIDA À AÇÃO AUDITÁVEL) ============ */}
          {activeTab === "plano" && (
            <ScrollArea className="flex-1 px-4">
              <div className="py-4 space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
                    ROTA RECOMENDADA
                  </span>
                  <h3 className="text-lg font-serif font-bold text-foreground mt-0.5">
                    Da dúvida à ação auditável
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Jornada técnica estruturada no ciclo PDCA da NR-1 Cap. 1.5 (Guia MTE 2026) e nos 16 Drivers do Work
                    Wellbeing Playbook 2.0.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {auditStages.map((stage) => {
                    const isCompleted = stage.status === "completed";
                    const isCurrent = stage.status === "current";
                    return (
                      <div
                        key={stage.stageNumber}
                        className={`rounded-xl border p-3.5 transition-all ${
                          isCurrent
                            ? "border-primary/50 bg-primary/5 shadow-sm"
                            : isCompleted
                              ? "border-emerald-500/30 bg-emerald-500/5"
                              : "border-border bg-card/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                                {stage.code}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  isCompleted
                                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                                    : isCurrent
                                      ? "bg-primary/15 text-primary border-primary/40"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {stage.statusLabel}
                              </Badge>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">{stage.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
                            <p className="text-[10px] font-mono text-muted-foreground/80 pt-0.5">
                              Base: {stage.normativeAnchor}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/50">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("conversa");
                              pushAnswer(`Como executar a ${stage.code}: ${stage.title}?`, stage.intentToAsk);
                            }}
                            className="text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                          >
                            <Sparkles className="h-3 w-3 text-primary" />
                            Perguntar à Sra. EstratégIA
                          </button>
                          <Button
                            size="sm"
                            variant={isCurrent ? "default" : "outline"}
                            className="h-7 text-xs gap-1"
                            onClick={() => {
                              setOpen(false);
                              navigate(stage.routeTo);
                            }}
                          >
                            {stage.routeLabel}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card de Conversão Consultiva Ética */}
                <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                      ACELERAÇÃO COM ESPECIALISTAS DO INSTITUTO
                    </span>
                    <ShieldCheck className="h-4 w-4 text-amber-300 shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{serviceRec.tierTitle}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{serviceRec.urgencyAnchor}</p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <Button size="sm" className="h-8 text-xs" onClick={() => setActiveTab("contato")}>
                      Solicitar Proposta & Diagnóstico Assistido
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleExportDiagnosticPdf}>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Baixar Rota em PDF
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {/* ============ ABA 4: CONTATO (SOLICITAÇÃO INSTITUCIONAL DE ALTA CONVERSÃO) ============ */}
          {activeTab === "contato" && (
            <ScrollArea className="flex-1 px-4">
              <div className="py-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-foreground">Solicitação institucional</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Revise os dados reconhecidos na conversa. O contexto técnico seguirá junto ao pedido para a
                      equipe de especialistas do <strong>Instituto Felicidade para Todos</strong>.
                    </p>
                  </div>
                </div>

                {/* Enquadramento de Neuromarketing Ético — Modalidade Recomendada */}
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                      MODALIDADE RECOMENDADA PELO DIAGNÓSTICO
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      NR-1 + Oxford Playbook 2.0
                    </Badge>
                  </div>
                  <p className="text-xs font-bold text-foreground">{serviceRec.tierTitle}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{serviceRec.valueProposition}</p>
                  <ul className="space-y-1 pt-1">
                    {serviceRec.deliverables.map((d, i) => (
                      <li key={i} className="text-[11px] text-foreground/90 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {leadSubmittedProtocol ? (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <h4 className="text-sm font-bold text-foreground">
                        Interesse institucional registrado ({leadSubmittedProtocol})
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      O contexto diagnóstico de <strong>{organizationName || ctx?.org?.name || "sua empresa"}</strong> e
                      os sinais reconhecidos ({recognizedSignals.slice(0, 4).join(", ")}) foram vinculados ao protocolo.
                      Você já pode baixar o Dossiê Executivo em PDF 5 Estrelas para apresentar à Diretoria.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={handleExportDiagnosticPdf} className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        Baixar Dossiê Executivo (.pdf)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLeadSubmittedProtocol(null)}
                      >
                        Editar Solicitação
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInstitutionalLeadSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground" htmlFor="strategia-email">
                          E-mail de trabalho *
                        </label>
                        <input
                          id="strategia-email"
                          type="email"
                          required
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="nome@empresa.com.br"
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground" htmlFor="strategia-org">
                          Organização
                        </label>
                        <input
                          id="strategia-org"
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="Nome da organização"
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground" htmlFor="strategia-hc">
                          Nº de colaboradores
                        </label>
                        <input
                          id="strategia-hc"
                          type="text"
                          value={headcountBand}
                          onChange={(e) => setHeadcountBand(e.target.value)}
                          placeholder="Ex.: 250 colaboradores"
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground" htmlFor="strategia-sector">
                          Setor
                        </label>
                        <input
                          id="strategia-sector"
                          type="text"
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          placeholder="Ex.: Indústria, Tecnologia, Saúde…"
                          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground" htmlFor="strategia-note">
                        Contexto prioritário ou objetivo para o Conselho / RH / SESMT
                      </label>
                      <textarea
                        id="strategia-note"
                        rows={2}
                        value={challengeNote}
                        onChange={(e) => setChallengeNote(e.target.value)}
                        placeholder="Ex.: Precisamos estruturar o ciclo COPSOQ II com k>=5 e revisar os 3 documentos mínimos do PGR…"
                        className="w-full rounded-lg border border-input bg-background p-2.5 text-xs"
                      />
                    </div>

                    <label className="flex items-start gap-2 text-[11px] text-muted-foreground cursor-pointer leading-snug">
                      <input
                        type="checkbox"
                        checked={lgpdConsent}
                        onChange={(e) => setLgpdConsent(e.target.checked)}
                        className="mt-0.5 rounded border-input"
                      />
                      <span>
                        Consinto com o uso dos dados informados para contato institucional sobre os serviços de gestão
                        NR-1 do <strong>Instituto Felicidade para Todos</strong>, conforme a{" "}
                        <Link to="/privacy" className="text-primary underline" onClick={() => setOpen(false)}>
                          Política de Privacidade
                        </Link>{" "}
                        e{" "}
                        <Link to="/terms" className="text-primary underline" onClick={() => setOpen(false)}>
                          Termos de Uso
                        </Link>
                        . Seus dados não serão compartilhados com terceiros.
                      </span>
                    </label>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button type="submit" size="sm" className="h-9 px-5 text-xs font-semibold">
                        Registrar interesse
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleExportDiagnosticPdf}
                        className="h-9 text-xs gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Baixar Dossiê Diagnóstico (.pdf)
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ParsedMetricRow {
  rank: string;
  dimension: string;
  band: string;
  risk: string;
  formula: string;
  driver?: string;
}

function extractMetricsFromLines(lines: string[]): ParsedMetricRow[] {
  const rows: ParsedMetricRow[] = [];
  for (const line of lines) {
    const match = line.match(
      /^(\d+)\.\s+(.+?)\s+—\s+(.+?)\s+\(R(\d+),\s*(S\d+×P\d+,\s*n=\d+)\)(?:\s*·\s*driver:\s*(.+))?$/i,
    );
    if (match) {
      rows.push({
        rank: match[1],
        dimension: match[2].trim(),
        band: match[3].trim(),
        risk: match[4].trim(),
        formula: match[5].trim(),
        driver: match[6]?.trim(),
      });
    }
  }
  return rows;
}

function AnswerBubble({
  item,
  onNavigate,
  onOpenDiagnosticTab,
}: {
  item: ChatItem;
  onNavigate: (to: string) => void;
  onOpenDiagnosticTab: () => void;
}) {
  const { answer, rewrite, rewriting, rewriteFailed } = item;
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const usingRewrite = !!rewrite && !showOriginal;
  const intro = usingRewrite ? rewrite!.summary : answer.summary.join(" ");
  const whyMatters = usingRewrite ? rewrite!.whyMatters || answer.whyMatters : answer.whyMatters;
  const md = answerToMarkdown(answer, intro, whyMatters);
  const metricRows = useMemo(() => extractMetricsFromLines(answer.whatDataShows), [answer.whatDataShows]);

  return (
    <div className="max-w-[90%] flex-1 rounded-2xl rounded-tl-sm bg-card border border-border/70 px-3.5 py-3 text-sm space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 -mb-1">
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          {rewriting ? (
            <>
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> reescrevendo em tom natural…
            </>
          ) : usingRewrite ? (
            <>
              <Sparkles className="h-2.5 w-2.5 text-primary/80" /> tom natural · dados verificados
            </>
          ) : rewriteFailed ? (
            <span className="text-amber-400/80">tom técnico (reescrita indisponível)</span>
          ) : (
            <>tom técnico</>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenDiagnosticTab}
            className="text-[10px] text-primary hover:underline"
          >
            ver na aba Diagnóstico
          </button>
          {rewrite && (
            <button
              type="button"
              onClick={() => setShowOriginal((s) => !s)}
              className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5"
            >
              {showOriginal ? "ver tom natural" : "ver tom técnico"}
              {showOriginal ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      <AIRichMarkdown content={md} />

      {/* Tabela Executiva S×P In-Chat */}
      {metricRows.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-background/60 overflow-hidden mt-2">
          <div className="px-2.5 py-1.5 bg-muted/40 border-b border-border/60 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Table2 className="h-3 w-3 text-primary" />
              Matriz Comparativa de Riscos (S×P)
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">AIHA 5×5 · k≥5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground bg-muted/20">
                  <th className="py-1.5 px-2 font-medium">#</th>
                  <th className="py-1.5 px-2 font-medium">Dimensão</th>
                  <th className="py-1.5 px-2 font-medium">Nível</th>
                  <th className="py-1.5 px-2 font-medium text-right">Escore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {metricRows.map((row) => {
                  const rNum = Number(row.risk) || 0;
                  const pct = Math.min(100, Math.round((rNum / 25) * 100));
                  const barColor =
                    rNum >= 15 ? "bg-destructive" : rNum >= 10 ? "bg-amber-400" : "bg-emerald-400";
                  return (
                    <tr key={row.rank} className="hover:bg-muted/20">
                      <td className="py-1.5 px-2 font-mono text-muted-foreground">{row.rank}</td>
                      <td className="py-1.5 px-2">
                        <div className="font-medium text-foreground">{row.dimension}</div>
                        {row.driver && (
                          <div className="text-[10px] text-primary/90">Driver: {row.driver}</div>
                        )}
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="text-[10px] font-medium">{row.band}</span>
                        <div className="text-[9px] text-muted-foreground font-mono">{row.formula}</div>
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono">
                        <div className="font-bold text-foreground">R{row.risk}</div>
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden ml-auto mt-0.5">
                          <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {answer.highlights && answer.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {answer.highlights.map((h, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] ${toneBadge(
                h.tone,
              )}`}
            >
              <span className="font-medium">{h.label}</span>
              <span className="font-bold tabular-nums">{h.value}</span>
            </span>
          ))}
        </div>
      )}

      {answer.ctas && answer.ctas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {answer.ctas.map((c, i) => (
            <Button
              key={i}
              size="sm"
              variant="secondary"
              className="h-7 text-xs gap-1"
              onClick={() => onNavigate(c.to)}
            >
              {c.label} <ArrowRight className="h-3 w-3" />
            </Button>
          ))}
        </div>
      )}

      {(answer.sources?.length ?? 0) > 0 && (
        <div className="pt-1 border-t border-border/50">
          <button
            type="button"
            onClick={() => setShowSources((s) => !s)}
            className="text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" /> Fontes ({answer.sources.length})
            {showSources ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showSources && (
            <ul className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground">
              {answer.sources.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
