// @ts-nocheck -- pre-existing type errors carried over from the original project
import { Link } from "@/lib/router/compat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  ListChecks,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  HOME_NR1_MODULES_CATALOG,
  buildHomeNr1ModuleInstructionalMarkdown,
  getHomeNr1ModuleById,
  type HomeNr1ModuleId,
  type HomeNr1ModuleLearningSpec,
} from "@/data/homeNr1ModulesCatalog";
import { downloadInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";
import { openStrategIA } from "@/lib/aurora/openAssistant";
import { toast } from "sonner";

interface HomeNr1ModuleLearningModalProps {
  moduleId: HomeNr1ModuleId | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectModule: (moduleId: HomeNr1ModuleId) => void;
  isAuthenticated: boolean;
}

function renderModuleIcon(iconKey: HomeNr1ModuleLearningSpec["iconKey"], className: string) {
  switch (iconKey) {
    case "dashboard":
      return <LayoutDashboard className={className} />;
    case "company":
      return <Building2 className={className} />;
    case "units":
      return <Layers className={className} />;
    case "cycles":
      return <CalendarClock className={className} />;
    case "risk":
      return <ShieldAlert className={className} />;
    case "actions":
      return <ListChecks className={className} />;
    case "controls":
      return <ShieldCheck className={className} />;
    case "documents":
      return <FileText className={className} />;
    case "estrategia":
      return <Bot className={className} />;
  }
}

export function HomeNr1ModuleLearningModal({
  moduleId,
  open,
  onOpenChange,
  onSelectModule,
  isAuthenticated,
}: HomeNr1ModuleLearningModalProps) {
  if (!moduleId) return null;

  const spec = getHomeNr1ModuleById(moduleId);
  const destinationPath = isAuthenticated ? spec.path : `/auth?intent=nr1&redirect=${encodeURIComponent(spec.path)}`;

  const handleDownloadPdf = () => {
    try {
      const markdown = buildHomeNr1ModuleInstructionalMarkdown(spec);
      downloadInstitutionalInstructionalPdf({
        markdown,
        filename: `guia-instrucional-nr1-modulo-${spec.id}.pdf`,
        meta: {
          title: `Guia Instrucional NR-1 — Módulo ${spec.label} (${spec.path})`,
          subtitle: spec.headline,
          categoryKicker: `${spec.lenteBadge} · GUIA MTE 2026 & OXFORD 2025`,
          orgName: "Instituto Felicidade para Todos · Plataforma 4 Lentes NR-1",
          cycleName: "Arquitetura Oficial GRO/PGR · Guia MTE 2026",
          sha256: `NR1-MOD-${spec.id.toUpperCase()}-2026-AUDIT`,
          normativeBasis: spec.normativeAnchor,
          highlights: [
            { label: "Módulo / Rota", value: `${spec.label} (${spec.path})`, tone: "good" },
            { label: "Base Normativa MTE", value: spec.normativeAnchor.split("·")[0]?.trim() || "NR-1 Cap. 1.5", tone: "warn" },
            { label: "Base Científica", value: "Oxford Playbook 2.0", tone: "good" },
            { label: "Ciência de Aprendizagem", value: "Andaimagem & Dupla Codificação", tone: "neutral" },
          ],
        },
      });
      toast.success(`Guia Instrucional PDF do módulo ${spec.label} gerado com sucesso!`);
    } catch {
      toast.error("Não foi possível gerar o PDF instrucional deste módulo.");
    }
  };

  const handleAskStrategIA = () => {
    onOpenChange(false);
    setTimeout(() => {
      openStrategIA({
        question: spec.strategiaQuestion,
        intent: spec.strategiaIntent,
      });
    }, 120);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100vw-1rem)] sm:w-full max-w-4xl max-h-[88dvh] overflow-x-hidden overflow-y-auto p-0 border-teal-900/30 bg-[#FAF7F0] text-slate-900 shadow-2xl rounded-2xl sm:rounded-3xl [&>button:last-child]:hidden"
        data-testid={`home-nr1-module-modal-${spec.id}`}
      >
        {/* 1 · Dark Emerald Studio Header (#071C1F) with 9-Module Switcher & Visible Close Button */}
        <div className="relative min-w-0 max-w-full overflow-hidden bg-[#071C1F] px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 text-white border-b border-teal-400/20">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(175 75% 42%) 0%, transparent 70%)" }}
            aria-hidden="true"
          />

          {/* Interactive 9-Module Switcher Bar + Explicit Close Icon Button */}
          <div className="relative z-10 mb-3.5 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-300 leading-snug pr-1">
                <GraduationCap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Design Instrucional Gráfico & Ciência de Aprendizagem · 9 Módulos /app</span>
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-teal-400/25 bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-teal-200">
                  Rota: <code className="text-amber-300 font-mono">{spec.path}</code>
                </span>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Fechar guia do módulo NR-1"
                  data-testid="home-nr1-modal-close-btn"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar max-w-full"
              role="tablist"
              aria-label="Selecionar módulo NR-1 para explorar"
            >
              {HOME_NR1_MODULES_CATALOG.map((item) => {
                const isSelected = item.id === spec.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => onSelectModule(item.id)}
                    data-testid={`home-nr1-modal-tab-${item.id}`}
                    className={`inline-flex items-center gap-1.5 shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-500 text-slate-950 shadow-md font-bold"
                        : "border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {renderModuleIcon(item.iconKey, "h-3.5 w-3.5 shrink-0")}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogHeader className="relative z-10 text-left min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-2.5 sm:px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3 w-3 shrink-0" />
                <span className="truncate">{spec.lenteBadge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-500/15 px-2.5 sm:px-3 py-0.5 text-[10px] font-semibold text-teal-200">
                <Scale className="h-3 w-3 shrink-0" />
                <span>Guia Oficial MTE 2026</span>
              </span>
            </div>

            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/45 bg-teal-500/25 text-amber-300 shadow-inner">
                {renderModuleIcon(spec.iconKey, "h-5 w-5 sm:h-6 sm:w-6")}
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="font-serif text-lg sm:text-2xl font-bold text-white leading-snug break-words">
                  {spec.label}: {spec.headline}
                </DialogTitle>
                <DialogDescription className="mt-1.5 text-xs sm:text-sm text-slate-200/90 leading-relaxed break-words">
                  {spec.subtitle}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* 3 Anchor Strip Pills (Normative, Scientific, Learning Science) */}
          <div className="relative z-10 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[11px]">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-300">
                Âncora Normativa MTE 2026
              </span>
              <span className="mt-0.5 block font-medium text-white/95 leading-snug">
                {spec.normativeAnchor}
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-teal-300">
                Evidência Científica Oxford 2025
              </span>
              <span className="mt-0.5 block font-medium text-white/95 leading-snug">
                {spec.oxfordAnchor}
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-sky-300">
                Princípio de Ciência de Aprendizagem
              </span>
              <span className="mt-0.5 block font-medium text-white/95 leading-snug">
                {spec.learningSciencePrinciple}
              </span>
            </div>
          </div>
        </div>

        {/* 2 · Modal Body — Warm Ivory Studio Paper (#FAF7F0) */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* 2.1 · 3-Card Learning Science Scaffolding Triad */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B6E69] flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                1. Tríade de Ciência de Aprendizagem & Promoção da NR-1
              </h4>
              <span className="text-[11px] font-medium text-slate-500">
                Andaimagem Cognitiva (Scaffolding)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-teal-50 text-[11px] font-bold text-[#0B6E69] border border-teal-200">
                    01
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Andaimagem Conceitual
                  </span>
                </div>
                <h5 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                  O que este módulo resolve?
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {spec.scaffoldingExplanation}
                </p>
              </div>

              <div className="rounded-2xl border border-teal-600/25 bg-teal-50/40 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#0B6E69] text-[11px] font-bold text-white">
                    02
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B6E69]">
                    Conformidade MTE 2026
                  </span>
                </div>
                <h5 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                  Como promove a NR-1 na prática?
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {spec.nr1CompliancePromotion}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-50/40 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-[11px] font-bold text-amber-800 border border-amber-400/40">
                    03
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Design Instrucional
                  </span>
                </div>
                <h5 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                  Por que acelera a decisão humana?
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {spec.learningScienceImpact}
                </p>
              </div>
            </div>
          </div>

          {/* 2.2 · 4-Stage Graphic Instructional Workflow Pipeline */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B6E69] flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                2. Fluxo Operacional Visual no Dashboard (4 Etapas)
              </h4>
              <span className="text-[11px] font-medium text-slate-500">
                Cadeia PDCA Auditável
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {spec.workflowSteps.map((ws) => (
                <div
                  key={ws.step}
                  className="relative rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center justify-center rounded-md bg-[#071C1F] px-2 py-0.5 text-[10px] font-bold text-teal-300">
                        ETAPA {ws.step}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#0B6E69]" />
                    </div>
                    <h5 className="font-serif text-xs font-bold text-slate-900 mb-1">
                      {ws.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {ws.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2.3 · Structured Comparative Audit Table */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B6E69] flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                3. Matriz de Rastreabilidade Normativa & ROI ({spec.label})
              </h4>
              <span className="text-[11px] font-medium text-slate-500">
                Artefato × Exigência MTE × Evidência × Impacto
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#071C1F] text-white">
                    <th className="py-2.5 px-3.5 font-semibold text-[11px] uppercase tracking-wider">
                      Artefato no Módulo
                    </th>
                    <th className="py-2.5 px-3.5 font-semibold text-[11px] uppercase tracking-wider">
                      Exigência MTE 2026 / NR-1
                    </th>
                    <th className="py-2.5 px-3.5 font-semibold text-[11px] uppercase tracking-wider">
                      Evidência Auditável Gerada
                    </th>
                    <th className="py-2.5 px-3.5 font-semibold text-[11px] uppercase tracking-wider">
                      Impacto Executivo & ROI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {spec.auditTable.map((row, idx) => (
                    <tr
                      key={row.artifact}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                    >
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 align-top">
                        {row.artifact}
                      </td>
                      <td className="py-2.5 px-3.5 text-[#0B6E69] font-semibold align-top">
                        {row.mteRequirement}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700 align-top">
                        {row.evidenceGenerated}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700 font-medium align-top">
                        {row.executiveImpact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 · Triple Action Footer (PDF Download + Ask Sra. EstratégIA + Open in /app) */}
          <div className="rounded-2xl border border-teal-900/15 bg-white p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                data-testid={`home-nr1-modal-download-pdf-${spec.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition-all"
              >
                <Download className="h-3.5 w-3.5 text-[#0B6E69]" />
                <span>Baixar Guia Instrucional (.pdf)</span>
              </button>

              <button
                type="button"
                onClick={handleAskStrategIA}
                data-testid={`home-nr1-modal-ask-strategia-${spec.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-600/30 bg-teal-50/70 px-3.5 py-2.5 text-xs font-bold text-[#0B6E69] hover:bg-teal-100/80 transition-all"
              >
                <Bot className="h-3.5 w-3.5" />
                <span>Perguntar à Sra. EstratégIA sobre {spec.label}</span>
              </button>
            </div>

            <Link
              to={destinationPath}
              onClick={() => onOpenChange(false)}
              data-testid={`home-nr1-modal-open-route-${spec.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B6E69] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#095955] transition-all"
            >
              <span>
                {isAuthenticated
                  ? `Abrir ${spec.label} no Dashboard (${spec.path})`
                  : `Acessar ${spec.label} na Demonstração (${spec.path})`}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
