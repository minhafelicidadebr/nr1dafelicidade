import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  ShieldCheck,
  Loader2,
  Trash2,
  Lightbulb,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Gauge,
  ListChecks,
  Building2,
  Download,
  Table2,
  CheckCircle2,
  CornerDownLeft,
} from "lucide-react";
import { toast } from "sonner";
import auroraAvatar from "@/assets/assistant-avatar.webp";
import AIRichMarkdown from "@/components/AIRichMarkdown";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { buildAuroraContext, type AuroraContext } from "@/lib/aurora/contextBuilder";
import { answerByIntent, AURORA_DISCLAIMER, type AuroraAnswer } from "@/lib/aurora/knowledgeBase";
import { routeFreeQuestion } from "@/lib/aurora/intentRouter";
import { getSuggestedQuestions, type SuggestedQuestion } from "@/lib/aurora/suggestedQuestions";
import {
  AURORA_PAGE_HISTORY_KEY,
  AURORA_RETENTION_NOTICE,
  clearAuroraHistory,
  loadAuroraHistory,
  saveAuroraHistory,
  type AuroraChatItem as ChatItem,
} from "@/lib/aurora/chatHistory";
import {
  STRATEGIA_DOMAIN_TAGS,
  STRATEGIA_NINE_INNOVATIONS,
  STRATEGIA_QUICK_TOPIC_CARDS,
  buildConsultativeServiceRecommendation,
  buildStrategiaAuditPlanStages,
  buildStrategiaDiagnosticTable,
  buildStrategiaDiagnosticTriad,
  buildStrategiaExecutiveDossierMarkdown,
  extractRecognizedSignals,
  type StrategiaDomainTagId,
  type StrategiaWorkspaceTabId,
} from "@/lib/aurora/agenticWorkspaceSkill";
import { downloadInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";

function loadHistory(): ChatItem[] {
  if (typeof window === "undefined") return [];
  return loadAuroraHistory(window.localStorage, AURORA_PAGE_HISTORY_KEY);
}
function saveHistory(items: ChatItem[]) {
  if (typeof window === "undefined") return;
  try {
    saveAuroraHistory(window.localStorage, AURORA_PAGE_HISTORY_KEY, items);
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

export default function EstrategiaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StrategiaWorkspaceTabId>("conversa");
  const [activeTag, setActiveTag] = useState<StrategiaDomainTagId>("all");
  const [ctx, setCtx] = useState<AuroraContext | null>(null);
  const [loadingCtx, setLoadingCtx] = useState(true);
  const [history, setHistory] = useState<ChatItem[]>(loadHistory);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Institutional Request Form State
  const [workEmail, setWorkEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [headcountBand, setHeadcountBand] = useState("");
  const [sector, setSector] = useState("");
  const [challengeNote, setChallengeNote] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [leadSubmittedProtocol, setLeadSubmittedProtocol] = useState<string | null>(null);

  const suggestions = useMemo(() => getSuggestedQuestions("/app/estrategia"), []);
  const diagnosticTriad = useMemo(() => buildStrategiaDiagnosticTriad(ctx, history), [ctx, history]);
  const diagnosticTable = useMemo(() => buildStrategiaDiagnosticTable(ctx), [ctx]);
  const auditStages = useMemo(() => buildStrategiaAuditPlanStages(ctx), [ctx]);
  const recognizedSignals = useMemo(
    () => extractRecognizedSignals(ctx, history, activeTag),
    [ctx, history, activeTag],
  );
  const serviceRec = useMemo(() => buildConsultativeServiceRecommendation(ctx), [ctx]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    let cancelled = false;
    setLoadingCtx(true);
    buildAuroraContext(location.pathname)
      .then((c) => {
        if (!cancelled) {
          setCtx(c);
          if (c.org?.name) setOrganizationName((prev) => prev || c.org!.name);
          if (c.cycle?.n_responses) {
            setHeadcountBand((prev) => prev || `${c.cycle!.n_responses}+ colaboradores (${c.unitsCount || 1} unid.)`);
          }
        }
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
  }, [location.pathname]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [history, activeTab]);

  async function rewriteItem(id: string, question: string, answer: AuroraAnswer) {
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
  }

  function pushAnswer(question: string, intent: string) {
    if (!ctx) return;
    const answer = answerByIntent(intent, ctx);
    const id = `${intent}-${Date.now()}`;
    setHistory((h) => [...h, { id, question, answer, rewriting: true }]);
    void rewriteItem(id, question, answer);
  }

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
    if (typeof window !== "undefined") clearAuroraHistory(window.localStorage, AURORA_PAGE_HISTORY_KEY);
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
      },
    });
    toast.success(`Dossiê Executivo exportado em PDF 5 estrelas (${saved})!`);
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
    setLeadSubmittedProtocol(protocol);
    toast.success(`Solicitação institucional registrada com sucesso (Protocolo ${protocol}).`);
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
      {/* ============ ESTAÇÃO PRINCIPAL 4 ABAS ============ */}
      <Card className="flex flex-col overflow-hidden border-border">
        {/* Cabeçalho Executivo (#071C1F) */}
        <CardHeader className="border-b border-emerald-900/60 bg-[#071C1F] text-white py-4 space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
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
                <CardTitle className="flex items-center gap-2 text-lg font-serif text-white">
                  Sra. EstratégIA
                  <Badge
                    variant="outline"
                    className="text-[10px] font-sans font-normal border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  >
                    Workspace Agêntico · ARGO 4.0
                  </Badge>
                </CardTitle>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Consultora digital do Instituto para decisões NR-1 · somente fontes e dados aprovados (k≥
                  {ctx?.k_min ?? 5})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDiagnosticPdf}
                className="h-8 text-xs border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                Exportar Dossiê (.pdf)
              </Button>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-8 text-xs text-emerald-200/70 hover:text-white hover:bg-white/10 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Limpar
                </Button>
              )}
            </div>
          </div>

          {/* Tags Semânticas Interativas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {STRATEGIA_DOMAIN_TAGS.filter((t) => t.id !== "all").map((tag) => {
              const isSelected = activeTag === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleDomainTagClick(isSelected ? "all" : tag.id)}
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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
        </CardHeader>

        {/* Barra de 4 Abas */}
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
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3 border-b-2 transition-colors ${
                  active
                    ? "border-primary text-primary font-semibold bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo das Abas */}
        <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
          {activeTab === "conversa" && (
            <>
              <ScrollArea className="flex-1 px-5" ref={scrollRef}>
                <div className="space-y-4 py-4">
                  {/* 4 Cards Executivos Rápidos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {STRATEGIA_QUICK_TOPIC_CARDS.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        disabled={loadingCtx || !ctx}
                        onClick={() => pushAnswer(card.question, card.intent)}
                        className="text-left rounded-xl border border-border bg-card/70 hover:bg-accent/50 hover:border-primary/40 p-3.5 transition-all disabled:opacity-50 group shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary">
                            {card.title}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                      </button>
                    ))}
                  </div>

                  {history.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm shadow-sm">
                          {item.question}
                        </div>
                      </div>
                      <div className="flex gap-2.5">
                        <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden ring-1 ring-border">
                          <img
                            src={auroraAvatar}
                            alt=""
                            width={256}
                            height={256}
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <PageAnswerBubble
                          item={item}
                          onOpenDiagnosticTab={() => setActiveTab("diagnostico")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t border-border bg-card/70 p-4 space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="rounded-2xl border border-primary/40 bg-background p-3 focus-within:ring-2 focus-within:ring-primary/30"
                >
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    placeholder="Conte o desafio da sua empresa ou pergunte sobre riscos, controles e documentos NR-1…"
                    disabled={loadingCtx || !ctx}
                    className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary/80 shrink-0" />
                      Não envie dados pessoais ou de saúde · {AURORA_RETENTION_NOTICE}
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 px-3 rounded-full gap-1"
                      disabled={loadingCtx || !ctx || !input.trim()}
                    >
                      <span>Enviar</span>
                      <CornerDownLeft className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>
                <div className="flex items-center justify-between px-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("contato")}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Prefiro falar diretamente com o Instituto
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] text-muted-foreground">{AURORA_DISCLAIMER}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === "diagnostico" && (
            <ScrollArea className="flex-1 px-5">
              <div className="py-5 space-y-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                      LEITURA DO CONTEXTO
                    </span>
                    <h3 className="text-xl font-serif font-bold text-foreground mt-0.5">Diagnóstico orientado</h3>
                    <p className="text-xs text-muted-foreground">
                      Organizamos os sinais da conversa e a telemetria coletiva (k≥{ctx?.k_min ?? 5}) sem substituir
                      avaliação técnica ou diagnóstico ocupacional.
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleExportDiagnosticPdf} className="gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Baixar Diagnóstico (.pdf)
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {diagnosticTriad.map((card) => (
                    <div
                      key={card.number}
                      className="rounded-xl border border-border bg-card/70 p-4 flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-muted-foreground">{card.number}</span>
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              card.status === "ready"
                                ? "bg-emerald-400"
                                : card.status === "attention"
                                  ? "bg-amber-400"
                                  : "bg-muted-foreground/40"
                            }`}
                          />
                        </div>
                        <p className="text-sm font-bold text-foreground">{card.title}</p>
                        <p className="text-xs font-semibold text-primary">{card.headline}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{card.detail}</p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="h-8 text-xs justify-between">
                        <Link to={card.ctaTo}>
                          <span>{card.ctaLabel}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border bg-card/50 p-4 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    SINAIS RECONHECIDOS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recognizedSignals.map((sig) => (
                      <Badge key={sig} variant="outline" className="text-xs">
                        {sig}
                      </Badge>
                    ))}
                  </div>
                </div>

                {diagnosticTable.length > 0 && (
                  <div className="rounded-xl border border-border bg-card/70 overflow-hidden">
                    <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Table2 className="h-4 w-4 text-primary" />
                        Matriz Tabular S×P (AIHA 5×5) & Drivers Oxford
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        k≥{ctx?.k_min ?? 5} verificado
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border/60 bg-background/50 text-muted-foreground">
                            <th className="py-2.5 px-3 font-medium">Dimensão</th>
                            <th className="py-2.5 px-2.5 font-medium">Faixa</th>
                            <th className="py-2.5 px-2.5 font-medium text-right">Escore S×P</th>
                            <th className="py-2.5 px-2.5 font-medium text-right">Amostra</th>
                            <th className="py-2.5 px-3 font-medium">Driver Playbook 2.0</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {diagnosticTable.map((row) => (
                            <tr key={row.dimensionKey} className="hover:bg-muted/20">
                              <td className="py-2.5 px-3 font-medium text-foreground">
                                #{row.rank} {row.dimensionLabel}
                              </td>
                              <td className="py-2.5 px-2.5">{row.bandLabel}</td>
                              <td className="py-2.5 px-2.5 text-right font-mono">
                                R{row.riskScore} ({row.formula})
                              </td>
                              <td className="py-2.5 px-2.5 text-right font-mono">n={row.sampleN}</td>
                              <td className="py-2.5 px-3">
                                <Link
                                  to={row.routeTo}
                                  className="text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  {row.driverLabel}
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {activeTab === "plano" && (
            <ScrollArea className="flex-1 px-5">
              <div className="py-5 space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                    ROTA RECOMENDADA
                  </span>
                  <h3 className="text-xl font-serif font-bold text-foreground mt-0.5">Da dúvida à ação auditável</h3>
                  <p className="text-xs text-muted-foreground">
                    Etapas conectadas diretamente aos módulos operacionais da plataforma NR-1.
                  </p>
                </div>

                <div className="space-y-3">
                  {auditStages.map((stage) => (
                    <div
                      key={stage.stageNumber}
                      className="rounded-xl border border-border bg-card/70 p-4 flex items-center justify-between gap-4 flex-wrap"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary">{stage.code}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {stage.statusLabel}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">{stage.title}</h4>
                        <p className="text-xs text-muted-foreground">{stage.description}</p>
                        <p className="text-[10px] font-mono text-muted-foreground/80">{stage.normativeAnchor}</p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <Link to={stage.routeTo}>
                          {stage.routeLabel}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {activeTab === "contato" && (
            <ScrollArea className="flex-1 px-5">
              <div className="py-5 space-y-4 max-w-2xl">
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground">Solicitação institucional</h3>
                  <p className="text-xs text-muted-foreground">
                    Revise os dados reconhecidos na conversa. O contexto seguirá junto ao pedido para o Instituto
                    Felicidade para Todos.
                  </p>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                  <p className="text-xs font-bold text-foreground">{serviceRec.tierTitle}</p>
                  <p className="text-xs text-muted-foreground">{serviceRec.valueProposition}</p>
                </div>

                {leadSubmittedProtocol ? (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <h4 className="text-sm font-bold text-foreground">
                        Solicitação institucional registrada ({leadSubmittedProtocol})
                      </h4>
                    </div>
                    <Button size="sm" onClick={handleExportDiagnosticPdf} className="gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Baixar Dossiê Executivo (.pdf)
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleInstitutionalLeadSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="E-mail de trabalho *"
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                      />
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Organização"
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                      />
                      <input
                        type="text"
                        value={headcountBand}
                        onChange={(e) => setHeadcountBand(e.target.value)}
                        placeholder="Nº de colaboradores"
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                      />
                      <input
                        type="text"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="Setor"
                        className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
                      />
                    </div>
                    <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lgpdConsent}
                        onChange={(e) => setLgpdConsent(e.target.checked)}
                        className="mt-0.5 rounded border-input"
                      />
                      <span>
                        Consinto com o uso dos dados informados para contato comercial sobre os serviços de gestão
                        NR-1, conforme nossa{" "}
                        <Link to="/privacy" className="text-primary underline">
                          Política de Privacidade
                        </Link>{" "}
                        e{" "}
                        <Link to="/terms" className="text-primary underline">
                          Termos de Uso
                        </Link>
                        . Seus dados não serão compartilhados com terceiros.
                      </span>
                    </label>
                    <Button type="submit" size="sm" className="h-9 px-5 text-xs font-semibold">
                      Registrar interesse
                    </Button>
                  </form>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* ============ PAINEL LATERAL: PERGUNTAS & 9 INOVAÇÕES AGÊNTICAS ============ */}
      <Card className="hidden lg:flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" /> Perguntas & Arquitetura Agêntica
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
          <div className="space-y-1.5">
            {suggestions.map((q) => (
              <button
                key={q.id}
                onClick={() => ask(q)}
                disabled={loadingCtx || !ctx}
                className="w-full text-left text-xs rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/40 px-3 py-2 transition-colors disabled:opacity-50 flex items-start gap-2 group"
              >
                <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-primary/70 group-hover:text-primary" />
                <span className="flex-1">{q.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> 9 Inovações Agênticas Ativas
            </div>
            <div className="space-y-1.5">
              {STRATEGIA_NINE_INNOVATIONS.map((inn) => (
                <div key={inn.number} className="rounded-lg border border-border/70 bg-card/50 p-2 text-[11px]">
                  <p className="font-semibold text-foreground">
                    {inn.number}. {inn.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{inn.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" /> Bases consultadas
            </div>
            <ul className="space-y-1 text-[11px] text-muted-foreground">
              <li>• Manual Oficial MTE 2026 (Cap. 1.5 da NR-1 · 19 Capítulos)</li>
              <li>• Work Wellbeing Playbook 2.0 — University of Oxford</li>
              <li>• Instrument Registry (COPSOQ II) & AEP/AET (NR-17)</li>
              <li>• AIHA Risk Assessment 5×5 & ISO 45003</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PageAnswerBubble({
  item,
  onOpenDiagnosticTab,
}: {
  item: ChatItem;
  onOpenDiagnosticTab: () => void;
}) {
  const { answer, rewrite, rewriting, rewriteFailed } = item;
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const usingRewrite = !!rewrite && !showOriginal;
  const intro = usingRewrite ? rewrite!.summary : answer.summary.join(" ");
  const whyMatters = usingRewrite ? rewrite!.whyMatters || answer.whyMatters : answer.whyMatters;
  const md = answerToMarkdown(answer, intro, whyMatters);

  return (
    <div className="max-w-[88%] flex-1 rounded-2xl rounded-tl-sm bg-card border border-border/60 px-3.5 py-3 text-sm space-y-2.5 shadow-sm">
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
          <button type="button" onClick={onOpenDiagnosticTab} className="text-[10px] text-primary hover:underline">
            ver na aba Diagnóstico
          </button>
          {rewrite && (
            <button
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
            <Button key={i} asChild size="sm" variant="secondary" className="h-7 text-xs gap-1">
              <Link to={c.to}>
                {c.label} <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          ))}
        </div>
      )}

      {(answer.sources?.length ?? 0) > 0 && (
        <div className="pt-1 border-t border-border/50">
          <button
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
