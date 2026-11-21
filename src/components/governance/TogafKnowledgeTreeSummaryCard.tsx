import { Link } from "@/lib/router/compat";
import { ArrowRight, Compass, Layers, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  togafDomainLabel,
  type Arc4SuperWaveSummary,
  type MacroWavePlanSummary,
  type NextWaveSaasPlanSummary,
  type SuperPromptRubricSummary,
  type TogafKnowledgeTreeSummary,
} from "@/lib/governance/togafMacroWaveEngine";
import {
  arc4SuperWaveSummary as defaultArc4Summary,
  nextWaveSaasPlanSummary as defaultNextWaveSummary,
} from "@/data/togafMacroWaveSuperPrompt";

export interface TogafKnowledgeTreeSummaryCardProps {
  readonly treeSummary: TogafKnowledgeTreeSummary;
  readonly waveSummary: MacroWavePlanSummary;
  readonly rubricSummary: SuperPromptRubricSummary;
  readonly nextWaveSummary?: NextWaveSaasPlanSummary;
  readonly arc4Summary?: Arc4SuperWaveSummary;
  readonly workspacePath?: string;
}

export default function TogafKnowledgeTreeSummaryCard({
  treeSummary,
  waveSummary,
  rubricSummary,
  nextWaveSummary = defaultNextWaveSummary,
  arc4Summary = defaultArc4Summary,
  workspacePath = "/app/governance/togaf-macro-wave",
}: TogafKnowledgeTreeSummaryCardProps) {
  return (
    <Card className="arc-surface-precision arc-hairline-top border-border bg-card">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Arquitetura Corporativa TOGAF ADM</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{treeSummary.policyId}</span>
            <span aria-hidden="true">·</span>
            <span>Superonda ARC 4.0 ({arc4Summary.totalSuperWaves} Serviços · {arc4Summary.totalBenchmarks} Benchmarks)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Dados reais proibidos até G3</span>
          </div>
        </div>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground [text-wrap:balance]">
          <Compass className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          Árvore de Conhecimento TOGAF, Superonda ARC 4.0 &amp; Super Prompt Pós-Doutoral (SaaS + UX)
        </CardTitle>
        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Mapeamento sistêmico dos 4 domínios TOGAF (Negócio, Dados, Aplicação e Tecnologia), consolidando a cadeia{" "}
          <span className="font-medium text-foreground">
            Medir → Contextualizar (AEP/AET) → Avaliar → Agir → Evidenciar → Reavaliar
          </span>
          , as {nextWaveSummary.totalTracks} trilhas SaaS e a Superonda ARC 4.0 (U_ARC4 = {arc4Summary.averageWinningUtility}/100) sob auditoria das{" "}
          <span className="font-mono font-medium tabular-nums text-foreground">
            {rubricSummary.totalChairs} cátedras pós-doutorais
          </span>
          .
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <SummaryMetric
            label="Nós TOGAF ADM"
            value={`${treeSummary.implementedLocalCount}/${treeSummary.totalNodes}`}
            subtext={`Prontidão sintética ${treeSummary.syntheticReadinessPct}%`}
          />
          <SummaryMetric
            label="Invariantes Fable 5"
            value={`${treeSummary.coveredInvariants.length}/14`}
            subtext="Cobertura verificada"
          />
          <SummaryMetric
            label="Sub-Ondas E2E"
            value={`${waveSummary.totalSlices} elos`}
            subtext={`Utilidade ToT ${waveSummary.averageWinningUtility}`}
          />
          <SummaryMetric
            label="Trilhas Práticas SaaS"
            value={`${nextWaveSummary.totalTracks} trilhas`}
            subtext={`U_SaaS ${nextWaveSummary.averageWinningUtility} · U_ARC4 ${arc4Summary.averageWinningUtility}`}
          />
          <SummaryMetric
            label="Banca Pós-Doutoral"
            value={`${rubricSummary.totalChairs} cátedras`}
            subtext={`${rubricSummary.totalCriteria} critérios (pesos ${rubricSummary.totalWeightPct}%)`}
          />
          <SummaryMetric
            label="Score Meta-Rubrica"
            value={`${rubricSummary.overallScorePct}%`}
            subtext="Auditável por outras IAs"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {treeSummary.domainStats.map((stat) => (
            <div
              key={stat.domain}
              className="rounded-md border border-border bg-background/50 p-3 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  {togafDomainLabel(stat.domain)}
                </span>
                <span className="font-mono font-semibold tabular-nums text-primary">
                  {stat.readinessPct}%
                </span>
              </div>
              <div className="arc-telemetry-bar mt-2" aria-hidden="true">
                <div
                  className="arc-telemetry-fill"
                  style={{ width: `${stat.readinessPct}%` }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {stat.implementedLocal} prontos · {stat.partialDraft} parciais · {stat.gateBlocked} blq. gate
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Próxima consolidação prioritária:{" "}
              <strong className="font-medium text-foreground">
                {waveSummary.nextPrioritySlice?.waveId} — {waveSummary.nextPrioritySlice?.title}
              </strong>
            </span>
          </div>

          <Link
            to={workspacePath}
            className="arc-tactile-card inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
          >
            Abrir Cockpit TOGAF, SaaS &amp; Super Prompt
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryMetric({
  label,
  value,
  subtext,
}: {
  readonly label: string;
  readonly value: string;
  readonly subtext: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-base font-semibold tabular-nums text-foreground">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
        {subtext}
      </p>
    </div>
  );
}

