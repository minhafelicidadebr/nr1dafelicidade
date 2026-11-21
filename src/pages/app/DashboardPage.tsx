import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { fetchMyOrg } from "@/lib/api/nr1";
import { Link, useNavigate } from "@/lib/router/compat";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { DimensionHeatmap } from "@/components/app/DimensionHeatmap";
import { TrendCard } from "@/components/app/TrendCard";
import { SmartAlertsCard } from "@/components/app/SmartAlertsCard";
import { getPendingProvisionForCurrentUser, provisionPendingIfAny } from "@/lib/signup";
import { toast } from "sonner";
import { fetchCyclePrivacySummaries, fetchSafeRiskScores } from "@/lib/api/privacyVault";
import NexoDriverIntelligenceCard from "@/components/app/nexo/NexoDriverIntelligenceCard";
import { fetchNexoDriverRecommendations } from "@/lib/api/nexo";
import type { NexoRecommendationRun } from "@/lib/nexo/driverRecommendation";
import {
  buildSyntheticPilotDashboardDataset,
  SYNTHETIC_NEXO_RECOMMENDATION_RUN,
} from "@/lib/runtime/syntheticPilotSession";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

const customerPriorityFronts = [
  {
    dimension: "Pressões de Carga de Trabalho e Ritmo",
    level: "Prioridade Alta",
    tone: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    unit: "Operações & Atendimento",
    actionSummary: "Redesenhar janelas de pico, pausas de recuperação cognitiva e redistribuição de demandas críticas.",
    driverTitle: "Pressões de Carga de Trabalho",
    driverHref: "/drivers/workload_pressures",
    actionHref: "/app/actions",
  },
  {
    dimension: "Gestão de Mudanças & Previsibilidade",
    level: "Prioridade Alta",
    tone: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    unit: "Operações & Atendimento",
    actionSummary: "Implantar rituais quinzenais de alinhamento prévio de mudanças operacionais e escuta ativa por GHE.",
    driverTitle: "Segurança e Estabilidade no Trabalho",
    driverHref: "/drivers/job_security",
    actionHref: "/app/actions",
  },
  {
    dimension: "Suporte da Liderança & Segurança Psicológica",
    level: "Monitoramento Ativo",
    tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    unit: "Tecnologia & Produto",
    actionSummary: "Capacitar lideranças intermediárias em check-ins estruturados de suporte e prevenção de sobrecarga.",
    driverTitle: "Confiança e Segurança Psicológica",
    driverHref: "/drivers/trust",
    actionHref: "/app/actions",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [org, setOrg] = useState<any>(null);
  const [stats, setStats] = useState({ cycles: 0, responses: 0, actions: 0, riskHigh: 0 });
  const [loading, setLoading] = useState(true);
  const [pendingProvisionAvailable, setPendingProvisionAvailable] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [docsCount, setDocsCount] = useState<number>(0);
  const [nexoRun, setNexoRun] = useState<NexoRecommendationRun | null>(null);
  const [nexoError, setNexoError] = useState<string | null>(null);
  const autoAttemptedRef = useRef(false);

  const [showOnboardingPreview, setShowOnboardingPreview] = useState(false);

  const loadDashboard = useCallback(async () => {
    const o = await fetchMyOrg();
    setOrg(o);

    if (!o) {
      try {
        const pending = await getPendingProvisionForCurrentUser();
        setPendingProvisionAvailable(Boolean(pending));
      } catch {
        setPendingProvisionAvailable(false);
      }
      setStats({ cycles: 0, responses: 0, actions: 0, riskHigh: 0 });
      setDocsCount(0);
      setNexoRun(null);
      setNexoError(null);
      return;
    }

    setPendingProvisionAvailable(false);

    if (o.is_synthetic_pilot) {
      const syn = buildSyntheticPilotDashboardDataset(o);
      setStats({
        cycles: syn.cyclesCount,
        responses: syn.responsesCount,
        actions: syn.actionsCount,
        riskHigh: syn.highRisksCount,
      });
      setDocsCount(syn.docsCount);
      setNexoRun(SYNTHETIC_NEXO_RECOMMENDATION_RUN as unknown as NexoRecommendationRun);
      setNexoError(null);
      return;
    }

    const [c, actions, risks, summaries, docs] = await Promise.all([
      supabase.from("cycles").select("id", { count: "exact", head: true }).eq("organization_id", o.id),
      supabase.from("action_items").select("*").eq("organization_id", o.id),
      fetchSafeRiskScores({ organizationId: o.id }),
      fetchCyclePrivacySummaries(o.id),
      supabase.from("documents").select("id,assinado_em").eq("organization_id", o.id),
    ]);
    const actionRows = actions.data ?? [];
    const docRows = docs.data ?? [];
    const latestCycleId = risks[0]?.cycle_id ?? null;
    let nextNexoRun: NexoRecommendationRun | null = null;
    let nextNexoError: string | null = null;
    if (latestCycleId) {
      try {
        nextNexoRun = await fetchNexoDriverRecommendations({ cycleId: latestCycleId });
      } catch (error) {
        nextNexoError = error instanceof Error ? error.message : "NEXO indisponível.";
      }
    }

    setStats({
      cycles: c.count ?? 0,
      responses: summaries.reduce((total, item) => total + (item.response_count ?? 0), 0),
      actions: actionRows.length,
      riskHigh: risks.filter((x) => x.risk_level >= 15).length,
    });
    setDocsCount(docRows.length);
    setNexoRun(nextNexoRun);
    setNexoError(nextNexoError);
  }, []);

  const tryProvision = useCallback(async (automatic = false) => {
    setProvisioning(true);
    const result = await provisionPendingIfAny();

    if (result.created) {
      toast.success("Cadastro da organização concluído com sucesso.");
      await loadDashboard();
      navigate("/app/company?welcome=1");
      return;
    }

    if (!automatic && result.pendingFound) {
      toast.error(result.error ?? "Não foi possível concluir o cadastro da empresa agora.");
    }

    await loadDashboard();
    setProvisioning(false);
  }, [loadDashboard, navigate]);

  useEffect(() => {
    (async () => {
      await loadDashboard();
      if (!autoAttemptedRef.current) {
        autoAttemptedRef.current = true;
        try {
          const pending = await getPendingProvisionForCurrentUser();
          const currentOrg = await fetchMyOrg();
          if (!currentOrg && pending) {
            await tryProvision(true);
          }
        } catch {
          // Ignore remote auth errors in synthetic mode
        }
      }
      setLoading(false);
    })();
  }, [loadDashboard, tryProvision]);

  if (loading) return <p className="text-muted-foreground">Carregando…</p>;

  if (!org || showOnboardingPreview) {
    const steps = [
      { n: 1, t: "Criar organização", d: "Defina razão social, CNPJ, setores e porte.", to: "/app/company", active: true },
      { n: 2, t: "Cadastrar unidades", d: "Recortes (filial, função, turno) com headcount.", to: "/app/units" },
      { n: 3, t: "Criar 1º ciclo", d: "Selecione o instrumento de escuta coletiva.", to: "/app/cycles" },
      { n: 4, t: "Gerar convites anônimos", d: "Links com k-anonimato ≥ 5 preservado.", to: "/app/cycles" },
      { n: 5, t: "Avaliar trabalho real e riscos", d: "AEP/AET e matriz de riscos psicossociais.", to: "/app/risk" },
      { n: 6, t: "Definir controles e plano de ação", d: "Medidas preventivas e responsáveis por unidade.", to: "/app/actions" },
      { n: 7, t: "Emitir documentos PGR", d: "Inventário NR-1, Plano de Ação e Resumo Executivo.", to: "/app/documents" },
    ];
    return (
      <div className="space-y-6">
        {org && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs">
            <span className="text-muted-foreground">
              Exibindo a <strong className="text-foreground">Visão de Roteiro de Implantação (Onboarding)</strong>.
            </span>
            <Button size="sm" onClick={() => setShowOnboardingPreview(false)}>
              Voltar ao Painel da Empresa
            </Button>
          </div>
        )}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-primary" /> Bem-vindo à Plataforma NR-1 · Bem-Estar no Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground max-w-2xl">
              Configure sua organização para conduzir a jornada de <strong className="text-foreground">Adequação NR-1 e Promoção do Bem-Estar</strong>:
              empresa → unidades e GHE → ciclos de escuta anônima → análise do trabalho real (AEP/AET) → matriz de riscos → plano de ação → documentos do PGR.
            </p>
            {pendingProvisionAvailable && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Encontramos sua conta, mas sua empresa ainda não foi provisionada. Clique para concluir o cadastro da organização.
                  </p>
                  <Button onClick={() => void tryProvision()} disabled={provisioning}>
                    {provisioning ? "Concluindo..." : "Concluir cadastro da empresa"}
                  </Button>
                </CardContent>
              </Card>
            )}
            <Button asChild size="lg" className="bg-gradient-hero shadow-glow">
              <Link to="/app/company">Configurar organização <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Roteiro de implantação NR-1 na sua empresa</CardTitle></CardHeader>
          <CardContent>
            <ol className="grid md:grid-cols-2 gap-3">
              {steps.map((s) => (
                <li key={s.n}>
                  <Link to={s.to}
                    className={`flex gap-3 rounded-xl border p-4 transition-colors ${
                      s.active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${
                      s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>{s.n}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{s.t}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.d}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Jornada integrada NR-1 / GRO</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Organização</strong> → Unidades & GHE → Escuta Coletiva Anônima →
                Análise do Trabalho Real (AEP/AET) → Matriz de Riscos → Plano de Ação → Documentos para o PGR.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Conexão com Práticas de Bem-Estar</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cada fator psicossocial identificado se conecta às <strong className="text-foreground">16 Trilhas de Bem-Estar (Drivers)</strong> com intervenções práticas para lideranças, equipes e RH.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasData = stats.cycles > 0 || stats.actions > 0 || stats.riskHigh > 0;

  const serviceStages = [
    {
      code: "ETAPA 1",
      label: "1. Empresa & Unidades",
      detail: "Setores e GHE",
      href: "/app/units",
      ready: Boolean(org?.name),
    },
    {
      code: "ETAPA 2",
      label: "2. Ciclos de Escuta",
      detail: `${stats.cycles} ciclo(s) · ${stats.responses} resp.`,
      href: "/app/cycles",
      ready: stats.cycles > 0,
    },
    {
      code: "ETAPA 3",
      label: "3. Trabalho Real (AEP/AET)",
      detail: "Contexto e Ergonomia",
      href: "/app/work-analysis",
      ready: stats.cycles > 0,
    },
    {
      code: "ETAPA 4",
      label: "4. Matriz de Riscos",
      detail: `${stats.riskHigh} fator(es) prioritário(s)`,
      href: "/app/risk",
      ready: stats.riskHigh > 0 || stats.cycles > 0,
    },
    {
      code: "ETAPA 5",
      label: "5. Controles & Ações",
      detail: `${stats.actions} ação(ões) no plano`,
      href: "/app/actions",
      ready: stats.actions > 0,
    },
    {
      code: "ETAPA 6",
      label: "6. Documentos PGR",
      detail: `${docsCount} documento(s) emitido(s)`,
      href: "/app/documents",
      ready: docsCount > 0,
    },
    {
      code: "ETAPA 7",
      label: "7. Trilhas de Bem-Estar",
      detail: "16 Drivers & Práticas",
      href: "/drivers",
      ready: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Painel da Organização · Adequação NR-1 & Promoção do Bem-Estar</span>
            <span aria-hidden="true">·</span>
            <span>GRO / PGR Psicossocial</span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">{org.name}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowOnboardingPreview(true)}
            className="min-h-10 text-xs"
          >
            Roteiro de Implantação (7 Passos)
          </Button>
          <Link
            to="/app/documents"
            className="arc-surface-precision arc-tactile-card inline-flex min-h-10 items-center gap-2 rounded-md px-3.5 py-2 text-xs font-medium text-foreground whitespace-nowrap shrink-0"
          >
            <span>Emitir Documentos PGR</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {!hasData && (
        <Card className="arc-surface-precision arc-hairline-top border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" /> Inicie o diagnóstico da sua organização
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Sua empresa está configurada. Para popular este painel, cadastre suas unidades/setores, abra um ciclo de escuta
              anônima e avalie os fatores de risco psicossocial.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild><Link to="/app/units">Cadastrar unidades</Link></Button>
              <Button asChild variant="outline"><Link to="/app/cycles">Criar ciclo de escuta</Link></Button>
              <Button asChild variant="outline"><Link to="/app/risk">Ver matriz de riscos</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { k: "Ciclos de escuta", v: stats.cycles, href: "/app/cycles" },
          { k: "Participações anônimas", v: stats.responses, href: "/app/cycles" },
          { k: "Fatores prioritários", v: stats.riskHigh, href: "/app/risk" },
          { k: "Plano de ação NR-1", v: stats.actions, href: "/app/actions" },
          { k: "Documentos PGR", v: docsCount, href: "/app/documents" },
        ].map((s) => (
          <Link key={s.k} to={s.href} className="block">
            <Card className="arc-surface-precision arc-tactile-card h-full">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.k}</p>
                <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">{s.v}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Jornada Operacional da Empresa: Adequação NR-1 & Bem-Estar */}
      <Card className="arc-surface-precision arc-hairline-top border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">
                Jornada de Adequação NR-1 e Promoção do Bem-Estar na Organização
              </CardTitle>
              <Nr1LearningScienceInfoModal
                topicId="overview_gro_pdca"
                customLabel="Como este pipeline promove a NR-1 (MTE 2026)"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Anonimato coletivo protegido (mínimo de 5 respostas por grupo)
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
            {serviceStages.map((stage) => (
              <Link
                key={stage.code}
                to={stage.href}
                className="arc-surface-precision arc-tactile-card flex flex-col justify-between rounded-lg p-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
                    <span className="font-mono font-semibold tabular-nums text-primary">
                      {stage.code}
                    </span>
                    {stage.ready ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-1 font-semibold text-foreground">{stage.label}</p>
                </div>
                <p className="mt-2 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {stage.detail}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frentes Prioritárias de Promoção do Bem-Estar e Ações NR-1 */}
      {hasData && (
        <Card className="arc-surface-precision border-primary/25 bg-card">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">
                    Frentes Prioritárias de Ação e Promoção do Bem-Estar
                  </CardTitle>
                  <Nr1LearningScienceInfoModal
                    topicId="overview_priority_fronts"
                    customLabel="Por que traduzir riscos em Drivers?"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Conecte os fatores identificados na avaliação da empresa às práticas recomendadas de bem-estar e ao Plano de Ação do PGR.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                  <Link to="/app/work-analysis">
                    <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
                    Análise do Trabalho (AEP)
                  </Link>
                </Button>
                <Button asChild size="sm" className="h-8 text-xs">
                  <Link to="/app/actions">
                    <ListChecks className="h-3.5 w-3.5 mr-1" />
                    Gerenciar Plano de Ação
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {customerPriorityFronts.map((front) => (
                <div
                  key={front.dimension}
                  className="flex flex-col justify-between rounded-xl border border-border bg-background/50 p-4 space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {front.unit}
                      </span>
                      <Badge variant="outline" className={`text-[10px] ${front.tone}`}>
                        {front.level}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {front.dimension}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {front.actionSummary}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex flex-col gap-1.5">
                    <Link
                      to={front.driverHref}
                      className="inline-flex items-center justify-between text-xs font-medium text-primary hover:underline"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Trilha: {front.driverTitle}
                      </span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      to={front.actionHref}
                      className="inline-flex items-center justify-between text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span>Ver ação vinculada no PGR</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasData && (
        <div className="grid md:grid-cols-2 gap-4">
          <DimensionHeatmap orgId={org.id} />
          <TrendCard orgId={org.id} />
        </div>
      )}
      {(nexoRun || nexoError) && <NexoDriverIntelligenceCard run={nexoRun} compact error={nexoError} />}
      {hasData && <SmartAlertsCard orgId={org.id} />}
    </div>
  );
}


