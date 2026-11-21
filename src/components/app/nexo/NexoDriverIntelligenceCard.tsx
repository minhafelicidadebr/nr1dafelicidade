import { Link } from "@/lib/router/compat";
import { ArrowRight, BookOpen, FileText, Info, ListChecks, ShieldCheck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { drivers } from "@/data/driversData";
import { getDimensionLabel, getDriverLabel } from "@/lib/nr1/labels";
import type { NexoBlocker, NexoDriverRecommendation, NexoRecommendationRun } from "@/lib/nexo/driverRecommendation";

interface Props {
  run: NexoRecommendationRun | null;
  title?: string;
  compact?: boolean;
  loading?: boolean;
  error?: string | null;
}

const blockerMessage: Record<NexoBlocker, string> = {
  scope_not_authorized: "Escopo não autorizado para o usuário atual.",
  campaign_not_closed: "A campanha ainda não está encerrada.",
  below_k_anonymity: "O grupo está abaixo do limiar de anonimato.",
  legacy_instrument: "O instrumento está marcado como legado.",
  non_comparable_instrument: "O instrumento ou campanha não é comparável.",
  missing_instrument_version: "A campanha não possui versão/snapshot técnico exposto para recomendação.",
  non_server_side_score: "O cálculo não veio do motor server-side oficial.",
  score_not_validated: "Há dimensões sem score validado ou sem média agregada segura.",
  insufficient_dimension_coverage: "A cobertura da matriz ficou abaixo de 60%.",
  no_safe_aggregate_scores: "Ainda não há resultados agregados seguros para esta campanha.",
};

const priorityTone: Record<string, string> = {
  alta: "border-orange-600/35 dark:border-orange-500/40 bg-orange-500/15 text-orange-800 dark:text-orange-300",
  moderada: "border-amber-600/35 dark:border-yellow-500/40 bg-amber-500/15 text-amber-900 dark:text-yellow-300",
  observar: "border-primary/35 bg-primary/10 text-primary",
};

export default function NexoDriverIntelligenceCard({
  run,
  title = "Da Mensuração à Transformação",
  compact = false,
  loading = false,
  error = null,
}: Props) {
  const isValidRun = Boolean(
    run &&
      typeof run === "object" &&
      !Array.isArray(run) &&
      typeof run.status === "string",
  );

  if (loading || error || !isValidRun || !run) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Transforme sinais agregados em prioridades de ação, aprendizagem e acompanhamento.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <p className="text-sm font-medium text-foreground">
              {loading ? "Consultando o motor server-side NEXO..." : "NEXO indisponível neste momento."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {error
                ? "A recomendação não foi exibida porque a execução server-side segura não respondeu. Nenhuma recomendação foi calculada no navegador."
                : "A recomendação só aparece quando a execução server-side retorna agregados seguros e elegíveis."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const blockers = Array.isArray(run.blockers) ? run.blockers : [];
  const recommendations = Array.isArray(run.recommendations) ? run.recommendations : [];

  if (run.status !== "available" || !run.primary) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Transforme sinais agregados em prioridades de ação, aprendizagem e acompanhamento.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-sm font-medium text-foreground">
              Ainda não há evidência agregada suficiente para priorizar um driver com segurança.
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {blockers.map((blocker) => (
                <li key={blocker}>• {blockerMessage[blocker] ?? blocker}</li>
              ))}
            </ul>
          </div>
          <MethodDisclaimer run={run} />
        </CardContent>
      </Card>
    );
  }

  const primary = run.primary;
  const secondary = recommendations.filter((item) => item.driverKey !== primary.driverKey).slice(0, 3);

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card shadow-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              {title}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Transforme sinais agregados em prioridades de ação, aprendizagem e acompanhamento.
            </p>
          </div>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
            NEXO · matriz v0.1
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DriverPriorityPanel driver={primary} compact={compact} run={run} />

        {secondary.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Outros drivers a observar
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              {secondary.map((driver) => (
                <SecondaryDriverCard key={driver.driverKey} driver={driver} run={run} />
              ))}
            </div>
          </div>
        )}

        <TransformationJourney />
        <MethodDisclaimer run={run} />
      </CardContent>
    </Card>
  );
}

function DriverPriorityPanel({
  driver,
  compact,
  run,
}: {
  driver: NexoDriverRecommendation;
  compact: boolean;
  run: NexoRecommendationRun;
}) {
  const meta = drivers.find((item) => item.slug === driver.driverKey);
  const Icon = meta?.icon ?? ShieldCheck;
  const hrefContext = `cycle_id=${encodeURIComponent(run.cycleId ?? "")}&scope_id=${encodeURIComponent(run.scopeId ?? run.cycleId ?? "")}&source=nexo`;

  return (
    <div className="rounded-2xl border border-primary/25 bg-background/70 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${meta?.borderClass ?? "border-primary/30"} ${meta?.bgClass ?? "bg-primary/10"} ${meta?.colorClass ?? "text-primary"}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Driver Prioritário Agora</p>
            <h3 className="mt-1 font-display text-xl font-bold">{getDriverLabel(driver.driverKey, "pt-BR", true)}</h3>
            <p className="text-sm text-muted-foreground">{meta?.tagline ?? "Rota de aprendizagem e ação organizacional."}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs lg:min-w-[280px]">
          <MiniMetric label="Prioridade" value={priorityLabel(driver.priorityBand)} tone={priorityTone[driver.priorityBand]} />
          <MiniMetric label="Confiança" value={driver.confidence === "boa" ? "Boa" : "Limitada"} />
          <MiniMetric label="Cobertura" value={`${Math.round(driver.coverage)}%`} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Por que agora</p>
          <ul className="space-y-2">
            {driver.reasons.map((reason) => (
              <li key={reason.dimensionKey} className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{getDimensionLabel(reason.dimensionKey, "pt-BR")}</span>
                  <span className="font-mono text-muted-foreground">{Math.round(reason.needScore)}/100</span>
                </div>
                <p className="mt-1 text-muted-foreground">
                  Sinal agregado contribuiu para a prioridade deste driver. Interprete junto do contexto de trabalho real.
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Próxima etapa sugerida</p>
            <p className="mt-1 text-sm text-foreground">
              Fortalecer práticas, controles e aprendizagem relacionados a {getDriverLabel(driver.driverKey, "pt-BR").toLowerCase()}.
            </p>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Tendência histórica e lacuna de controle não foram inferidas automaticamente; exigem campanhas comparáveis e evidências de eficácia.
            </p>
          </div>
          {!compact && (
            <div className="flex flex-col gap-2">
              <Button asChild size="sm">
                <Link to={`/drivers/${driver.driverKey}?${hrefContext}`}>
                  <BookOpen className="h-3.5 w-3.5" /> Educar sobre este driver
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={`/app/actions?driver_key=${encodeURIComponent(driver.driverKey)}&${hrefContext}`}>
                  <ListChecks className="h-3.5 w-3.5" /> Criar plano de transformação
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to={`/app/documents?driver_key=${encodeURIComponent(driver.driverKey)}&${hrefContext}`}>
                  <FileText className="h-3.5 w-3.5" /> Preparar narrativa para relatório
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SecondaryDriverCard({ driver, run }: { driver: NexoDriverRecommendation; run: NexoRecommendationRun }) {
  const meta = drivers.find((item) => item.slug === driver.driverKey);
  const Icon = meta?.icon ?? ShieldCheck;
  const hrefContext = `cycle_id=${encodeURIComponent(run.cycleId ?? "")}&scope_id=${encodeURIComponent(run.scopeId ?? run.cycleId ?? "")}&source=nexo`;

  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <div className="flex items-start gap-2">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta?.bgClass ?? "bg-primary/10"} ${meta?.colorClass ?? "text-primary"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{getDriverLabel(driver.driverKey, "pt-BR")}</p>
          <p className="text-[11px] text-muted-foreground">{meta?.tagline ?? "Rota de ação organizacional."}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="outline" className={`text-[10px] ${priorityTone[driver.priorityBand]}`}>
          {priorityLabel(driver.priorityBand)}
        </Badge>
        <Badge variant="outline" className="text-[10px]">Cobertura {Math.round(driver.coverage)}%</Badge>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Principais dimensões: {driver.reasons.map((reason) => getDimensionLabel(reason.dimensionKey, "pt-BR")).join(", ")}.
      </p>
      <Link to={`/drivers/${driver.driverKey}?${hrefContext}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        Explorar rota de ação <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function TransformationJourney() {
  const steps = [
    { label: "Mensurar", status: "concluída" },
    { label: "Compreender", status: "concluída" },
    { label: "Priorizar", status: "em andamento" },
    { label: "Transformar", status: "aguardando responsável" },
    { label: "Comprovar", status: "bloqueada por evidência" },
    { label: "Reavaliar", status: "pronta após ciclo" },
  ];

  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Jornada de Transformação
      </p>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => (
          <div key={step.label} className="rounded-lg border border-border bg-card/50 p-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {index + 1}
              </span>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{step.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodDisclaimer({ run }: { run: NexoRecommendationRun }) {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-[11px] text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
      <p>
        {run.disclaimer} Matriz: <span className="font-mono">{run.matrixVersion}</span>. Algoritmo:{" "}
        <span className="font-mono">{run.algorithmVersion}</span>. Rascunhos e ações permanecem preliminares até revisão competente.
      </p>
    </div>
  );
}

function MiniMetric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-card/70 px-2 py-2 ${tone ?? ""}`}>
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}

function priorityLabel(priority: string) {
  if (priority === "alta") return "Alta";
  if (priority === "moderada") return "Moderada";
  return "Observar";
}
