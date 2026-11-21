import { useState } from "react";
import { Link } from "@/lib/router/compat";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getNr1LearningScienceTopic,
  type Nr1LearningScienceTopicId,
} from "@/data/nr1LearningScienceCatalog";

export interface Nr1LearningScienceInfoModalProps {
  readonly topicId: Nr1LearningScienceTopicId;
  readonly variant?: "badge" | "icon";
  readonly customLabel?: string;
  readonly className?: string;
}

export default function Nr1LearningScienceInfoModal({
  topicId,
  variant = "badge",
  customLabel,
  className = "",
}: Nr1LearningScienceInfoModalProps) {
  const [open, setOpen] = useState(false);
  const topic = getNr1LearningScienceTopic(topicId);

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-testid={`nr1-info-trigger-${topicId}`}
          aria-label={`Abrir guia de Ciência de Aprendizagem e Conformidade MTE 2026: ${topic.featureTitle}`}
          title={customLabel ?? topic.shortTriggerLabel}
          className={`group inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
        >
          <span className="font-serif text-xs font-bold italic leading-none">
            i
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-testid={`nr1-info-trigger-${topicId}`}
          aria-label={`Abrir guia de Ciência de Aprendizagem e Conformidade MTE 2026: ${topic.featureTitle}`}
          className={`group inline-flex min-h-8 items-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-2.5 py-1 text-left text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0 ${className}`}
        >
          <span
            aria-hidden="true"
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-[11px] font-bold italic leading-none transition-transform group-hover:scale-105"
          >
            i
          </span>
          <span className="text-[11px] font-semibold text-primary">
            {customLabel ?? "Como promove a NR-1 (MTE 2026)"}
          </span>
        </button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[88vh] overflow-y-auto p-0 border-border bg-card">
          {/* Top Instructional Header Band */}
          <div className="border-b border-border bg-slate-950 px-6 py-5 text-white">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs text-teal-300 font-mono">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/20 border border-teal-400/40 font-serif text-xs font-bold italic text-teal-200">
                  i
                </span>
                <span>NR-1 · {topic.nr1Clauses.join(" · ")}</span>
                <span aria-hidden="true">·</span>
                <span>{topic.mteManualChapterRef}</span>
              </div>
              <DialogTitle className="font-display text-lg md:text-xl font-bold leading-snug text-white">
                {topic.featureTitle}
              </DialogTitle>
              <p className="text-xs text-amber-300/95 font-medium flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Base de Ciência de Aprendizagem: {topic.learningScienceTheoryBadge}</span>
              </p>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {/* 1. Exigência Promovida do Manual Oficial MTE 2026 & Ciência de Aprendizagem */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Scale className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>1. Exigência Promovida do Ministério do Trabalho (NR-1 / MTE 2026)</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {topic.mteNormativeRequirementSummary}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Brain className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>2. Por Que Funciona sob a Ciência de Aprendizagem</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {topic.learningScienceNarrative}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border/60">
                  <strong className="text-foreground">Mecanismo Cognitivo e Técnico:</strong>{" "}
                  {topic.cognitiveMechanismExplained}
                </p>
              </div>
            </div>

            {/* 2. Design Instrucional Gráfico: Fluxo da Técnica de Implementação (3 Etapas) */}
            <div className="rounded-xl border border-border bg-background/40 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Workflow className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>3. Design Instrucional Gráfico — Arquitetura de Implementação em 3 Etapas</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Entrada Validada → Motor Determinístico → Artefato Auditável PGR
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {topic.instructionalFlowSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-lg border border-border bg-card p-3.5 flex flex-col justify-between space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-primary tabular-nums">
                          ETAPA {step.stepNumber}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {step.mteClauseTag}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {step.phaseLabel}
                      </p>
                      <h4 className="text-xs font-semibold text-foreground leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Tabela Comparativa de Maturidade Operacional */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <FileCheck2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>4. Matriz Comparativa de Maturidade: Prática Vulnerável vs. Técnica Aplicada</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-muted/50 text-[11px] text-muted-foreground">
                    <tr>
                      <th className="px-3.5 py-2.5 font-semibold">Dimensão Técnica</th>
                      <th className="px-3.5 py-2.5 font-semibold text-amber-700 dark:text-amber-300">
                        Prática Convencional Vulnerável (Risco de Desvio)
                      </th>
                      <th className="px-3.5 py-2.5 font-semibold text-emerald-700 dark:text-emerald-300">
                        Técnica Estado da Arte (MTE 2026 + Playbook 2.0)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {topic.comparisonTable.map((row) => (
                      <tr key={row.dimension}>
                        <td className="px-3.5 py-2.5 font-semibold text-foreground align-top whitespace-nowrap">
                          {row.dimension}
                        </td>
                        <td className="px-3.5 py-2.5 text-muted-foreground align-top leading-relaxed">
                          {row.vulnerableConventionalPractice}
                        </td>
                        <td className="px-3.5 py-2.5 text-foreground/95 align-top leading-relaxed">
                          <span className="inline-flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{row.stateOfTheArtPlatformTechnique}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Ponte Epistêmica com o Work Wellbeing Playbook 2.0 & Fronteira Ética */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/50 p-3.5 space-y-1">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Conexão com o Work Wellbeing Playbook 2.0 (Oxford / WWM)</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {topic.playbook2BridgeSummary}
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-1">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                  <span>Fronteira Ética e Responsabilidade Interna (Cap. 8.2 MTE)</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {topic.ethicalGovernanceBoundary}
                </p>
              </div>
            </div>

            {/* 5. Rodapé de Conferência Canônica Zero-Alucinação */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={topic.canonicalMteDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Conferir Manual Oficial MTE 2026</span>
                </a>
                <a
                  href={topic.canonicalPlaybookDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>Conferir Playbook 2.0 (Oxford)</span>
                </a>
              </div>

              <Link
                to={topic.libraryDeepLink}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Explorar Base Canônica em /library</span>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
