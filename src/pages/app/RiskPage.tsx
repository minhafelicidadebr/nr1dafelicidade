// @ts-nocheck -- pre-existing type errors carried over from the original project
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import type { Database } from "@/lib/runtime/databaseTypes";
import { fetchMyOrg } from "@/lib/api/nr1";
import { dimensionToDriver } from "@/data/copsoqData";
import { toast } from "sonner";
import { Plus, EyeOff, ShieldAlert, ArrowRight, ListChecks, Info, Calendar, Activity, BookOpen, CheckCircle2 } from "lucide-react";
import { canDisplayAggregate, K_ANONYMITY_MIN, PRIVACY_REDACTED_LABEL } from "@/lib/privacy";
import PrivacyGuardBadge from "@/components/app/PrivacyGuardBadge";
import InsufficientSampleCard from "@/components/app/InsufficientSampleCard";
import OutcomesCard from "@/components/app/OutcomesCard";
import { UnitDrilldownCard } from "@/components/app/UnitDrilldownCard";
import RiskHistoryCard from "@/components/app/RiskHistoryCard";
import { EmptyState } from "@/components/app/EmptyState";
import DriverInsightCard from "@/components/app/risk/DriverInsightCard";
import AIHAMatrix from "@/components/app/risk/AIHAMatrix";
import RiskSummaryCards from "@/components/app/risk/RiskSummaryCards";
import NexoDriverIntelligenceCard from "@/components/app/nexo/NexoDriverIntelligenceCard";
import { getDimensionLabel, getDriverLabel, SEVERITY_LABEL, PROBABILITY_LABEL, riskBand, RISK_BAND_LABEL } from "@/lib/nr1/labels";
import AskStrategIAButton from "@/components/app/AskStrategIAButton";
import { fetchCyclePrivacySummaries, fetchSafeRiskScores, type SafeRiskScore } from "@/lib/api/privacyVault";
import { fetchNexoDriverRecommendations } from "@/lib/api/nexo";
import type { NexoRecommendationRun } from "@/lib/nexo/driverRecommendation";
import { topDriverForDimension } from "@/lib/nr1/topDriver";
import { evaluateMte13Factors, extractProtectiveFactors } from "@/lib/nr1/q1Nr1PromotionEngine";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

function bandPillColor(band: ReturnType<typeof riskBand>) {
  switch (band) {
    case "critico": return "bg-red-500/15 text-red-800 dark:text-red-300 border-red-600/35 dark:border-red-500/40";
    case "alto": return "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-600/35 dark:border-orange-500/40";
    case "moderado": return "bg-amber-500/15 text-amber-900 dark:text-yellow-300 border-amber-600/35 dark:border-yellow-500/35";
    case "baixo": return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-600/35 dark:border-emerald-500/35";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

function formatDate(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "—"; }
}

const CYCLE_STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  active: "Ativo",
  open: "Aberto (Em coleta)",
  closed: "Encerrado",
  archived: "Arquivado",
};

type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];
type CycleQueryRow = Pick<Database["public"]["Tables"]["cycles"]["Row"], "id" | "name" | "status" | "starts_at" | "ends_at">;
type CycleRow = CycleQueryRow & {
  n_responses: number; k_anonymity_met: boolean; k_min: number;
  starts_at?: string | null; ends_at?: string | null;
};

export default function RiskPage() {
  const [org, setOrg] = useState<OrganizationRow | null>(null);
  const [cycles, setCycles] = useState<CycleRow[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [scores, setScores] = useState<SafeRiskScore[]>([]);
  const [loadingCycles, setLoadingCycles] = useState(true);
  const [loadingNexo, setLoadingNexo] = useState(false);
  const [nexoError, setNexoError] = useState<string | null>(null);
  const [nexoRun, setNexoRun] = useState<NexoRecommendationRun | null>(null);

  async function load() {
    setLoadingCycles(true);
    const o = await fetchMyOrg(); setOrg(o);
    if (!o) { setLoadingCycles(false); return; }
    const { data: cs } = await supabase
      .from("cycles")
      .select("id, name, status, starts_at, ends_at")
      .eq("organization_id", o.id)
      .order("created_at", { ascending: false });
    const summaries = await fetchCyclePrivacySummaries(o.id);
    const byCycle = new Map(summaries.map((summary) => [summary.cycle_id, summary]));
    const rows: CycleRow[] = (cs ?? []).map((c: CycleQueryRow) => {
      const summary = byCycle.get(c.id);
      return {
        ...c,
        n_responses: summary?.response_count ?? 0,
        k_anonymity_met: summary?.k_anonymity_met ?? false,
        k_min: summary?.k_min ?? K_ANONYMITY_MIN,
      };
    });
    setCycles(rows);
    const firstWithResp = rows.find((c) => c.n_responses > 0);
    setSelected((firstWithResp ?? rows[0])?.id ?? "");
    setLoadingCycles(false);
  }
  async function loadScores(cycleId: string) {
    if (!cycleId) return;
    const data = await fetchSafeRiskScores({ cycleId });
    setScores(data);
  }
  useEffect(() => { load(); }, []);
  useEffect(() => { if (selected) loadScores(selected); else setScores([]); }, [selected]);
  useEffect(() => {
    if (!selected) {
      setNexoRun(null);
      setNexoError(null);
      setLoadingNexo(false);
      return;
    }

    let cancelled = false;
    setLoadingNexo(true);
    setNexoError(null);
    fetchNexoDriverRecommendations({ cycleId: selected })
      .then((run) => {
        if (!cancelled) setNexoRun(run);
      })
      .catch((error) => {
        if (!cancelled) {
          setNexoRun(null);
          setNexoError(error instanceof Error ? error.message : "NEXO indisponível.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingNexo(false);
      });

    return () => { cancelled = true; };
  }, [selected]);

  const selectedCycle = useMemo(() => cycles.find((c) => c.id === selected), [cycles, selected]);
  const cycleN = selectedCycle?.n_responses ?? 0;
  const hasSample = selectedCycle?.status === "closed" && Boolean(selectedCycle?.k_anonymity_met);

  async function createAction(score: SafeRiskScore) {
    if (!org) return;
    if (!canDisplayAggregate(score.n_responses)) {
      toast.error(`Recorte com n<${K_ANONYMITY_MIN} — ação não pode ser criada a partir de amostra insuficiente.`);
      return;
    }
    const driver = topDriverForDimension(dimensionToDriver, score.dimension);
    const { error } = await supabase.from("action_items").insert({
      organization_id: org.id, cycle_id: selected,
      dimension: score.dimension, driver_slug: driver,
      title: `Mitigar ${getDimensionLabel(score.dimension, "pt-BR")}`,
      description: `Risco ${score.risk_level} (S${score.severity}×P${score.probability}). Recomendação preliminar baseada em catálogo: driver "${getDriverLabel(driver ?? "", "pt-BR")}" — requer revisão do responsável técnico.`,
      level: "administrative",
    });
    if (error) toast.error(error.message); else toast.success("Ação criada em /app/actions");
  }

  const visible = scores.filter((s) => canDisplayAggregate(s.n_responses));
  const suppressed = scores.length - visible.length;
  const totalN = scores.reduce((acc, s) => acc + (s.n_responses ?? 0), 0);
  const topRisks = visible.slice(0, 3);
  const protectiveFactors = useMemo(() => extractProtectiveFactors(scores), [scores]);
  const mte13Factors = useMemo(() => evaluateMte13Factors(scores), [scores]);

  if (!loadingCycles && cycles.length === 0) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Nenhum ciclo encontrado"
        description="Aprove uma versão no Instrument Registry antes de coletar sinais e avaliar riscos."
        primary={{ label: "Ir para Ciclos", to: "/app/cycles" }}
      />
    );
  }

  const cyclesWithResp = cycles.filter((c) => c.n_responses > 0);
  const noCycleWithResponses = !loadingCycles && cyclesWithResp.length === 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-6">
        {/* ============== HEADER EXECUTIVO ============== */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary/80">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Cockpit de Riscos Psicossociais · NR-1 / método versionado
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <CardTitle className="text-xl">Risco contextual — Severidade × Probabilidade</CardTitle>
                  <Nr1LearningScienceInfoModal
                    topicId="risk_matrix_iso45002"
                    customLabel="Matriz S×P, Regra de Ouro e Trava Legal MTE 2026"
                  />
                </div>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Resultado técnico versionado que combina trabalho real, exposição e eficácia comprovada dos controles.
                  Sinais coletivos preservam k-anonimato e não determinam risco isoladamente.
                </p>
              </div>
              {selectedCycle && <PrivacyGuardBadge n={cycleN} />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-end flex-wrap">
              <div className="flex-1 min-w-[260px]">
                <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Ciclo de avaliação</label>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm mt-1"
                  value={selected} onChange={(e) => setSelected(e.target.value)}>
                  {cycles.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.n_responses} resp.{c.n_responses >= K_ANONYMITY_MIN ? " ✓ k≥5" : " · k<5"}
                    </option>
                  ))}
                </select>
              </div>
              <Button asChild><Link to="/app/criteria">Abrir critérios versionados</Link></Button>
            </div>

            {selectedCycle && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="rounded-md border border-border p-3 bg-background/40">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Ciclo</div>
                  <div className="font-medium truncate mt-0.5">{selectedCycle.name}</div>
                  <Badge variant="outline" className="mt-1.5 text-[10px]">
                    {CYCLE_STATUS_LABEL[selectedCycle.status] ?? selectedCycle.status}
                  </Badge>
                </div>
                <div className="rounded-md border border-border p-3 bg-background/40">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Respostas
                  </div>
                  <div className="font-medium text-lg mt-0.5">{cycleN}</div>
                  <div className="text-[10px] text-muted-foreground">k-anonimato mín.: {K_ANONYMITY_MIN}</div>
                </div>
                <div className="rounded-md border border-border p-3 bg-background/40">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Período
                  </div>
                  <div className="font-medium text-xs mt-0.5">
                    {formatDate(selectedCycle.starts_at)} → {formatDate(selectedCycle.ends_at)}
                  </div>
                </div>
                <div className="rounded-md border border-border p-3 bg-background/40">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Privacidade</div>
                  <div className={`font-medium text-xs mt-0.5 ${hasSample ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
                    {hasSample ? "Liberado para análise" : "Amostra insuficiente"}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {scores.length === 0 ? (hasSample ? "Aguardando avaliação contextual" : "Aguardando respostas") : `${visible.length} visíveis · ${suppressed} ocultas`}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground border-t border-border/50 pt-3">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>
                <strong>Como interpretar:</strong> severidade exige consequência crível, contexto, fonte e justificativa.
                Probabilidade considera exigências, duração, frequência, intensidade, abrangência e controles comprovadamente eficazes.
                Resultados permanecem preliminares até revisão do responsável técnico.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ============== ALERTAS DE AMOSTRA ============== */}
        {noCycleWithResponses && (
          <InsufficientSampleCard n={0} context="Nenhum ciclo possui respostas registradas ainda" />
        )}
        {selectedCycle && !hasSample && (
          <InsufficientSampleCard n={cycleN} context={`Ciclo "${selectedCycle.name}" — amostra insuficiente para análise por k-anonimato`} />
        )}

        {selected && (
          <NexoDriverIntelligenceCard run={nexoRun} loading={loadingNexo} error={nexoError} />
        )}

        {/* ============== CARDS DE SÍNTESE ============== */}
        {hasSample && scores.length > 0 && (
          <>
            <RiskSummaryCards visible={visible} total={scores.length} suppressed={suppressed} />
            <div className="flex flex-wrap gap-2">
              <AskStrategIAButton question="Como priorizar estes 3 riscos?" intent="risk.top3" label="Perguntar como priorizar estes riscos" />
              <AskStrategIAButton question="O que significa k-anonimato?" intent="risk.k_anonymity" label="Perguntar sobre k-anonimato" />
            </div>
          </>
        )}

        {/* ============== MATRIZ AIHA 5×5 VISUAL ============== */}
        {hasSample && visible.length > 0 && (
          <>
            <AIHAMatrix scores={visible} />
            <AskStrategIAButton question="Como interpretar severidade × probabilidade?" intent="risk.severity_x_probability" label="Perguntar como interpretar S × P" />
          </>
        )}

        {scores.length > 0 && suppressed > 0 && (
          <InsufficientSampleCard
            n={totalN}
            context={`${suppressed} de ${scores.length} dimensões ocultadas por k<${K_ANONYMITY_MIN}`}
          />
        )}

        {/* ============== RESULTADOS POR DIMENSÃO (CARDS) ============== */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Resultados por dimensão</span>
              {scores.length > 0 && <PrivacyGuardBadge n={totalN} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <EmptyState
                icon={ShieldAlert}
                title={cycles.length === 0 ? "Sem ciclos para calcular" : "Nenhum score calculado ainda"}
                description={cycles.length === 0
                  ? "Aprove instrumento, trabalho real e critérios técnicos antes de qualquer cálculo de risco."
                  : "Após k-anonimato, vincule sinais coletivos a achados AEP/AET e aplique critérios aprovados."}
                hints={[
                  "Probabilidade exige exposição real e eficácia dos controles.",
                  "Severidade exige justificativa contextual e revisão técnica.",
                  "Recortes com n<5 ficam ocultos para preservar anonimato.",
                ]}
                primary={cycles.length === 0
                  ? { label: "Criar 1º ciclo", to: "/app/cycles" }
                  : { label: "Gerenciar convites", to: "/app/cycles" }}
                secondary={{ label: "Ver catálogo de controles", to: "/app/controls" }}
              />
            ) : (
              <div className="grid gap-2">
                {scores.map((s) => {
                  const ok = canDisplayAggregate(s.n_responses);
                  const band = riskBand(s.risk_level);
                  const drv = ok ? topDriverForDimension(dimensionToDriver, s.dimension) : null;
                  return (
                    <div
                      key={s.id}
                      className={`rounded-lg border border-border bg-card/40 px-3 py-2.5 flex items-center gap-3 flex-wrap ${ok ? "" : "opacity-60"}`}
                    >
                      <div className="min-w-[200px] flex-1">
                        <div className="font-medium text-sm">{getDimensionLabel(s.dimension, "pt-BR")}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {ok && drv ? getDriverLabel(drv, "pt-BR") : ok ? "—" : PRIVACY_REDACTED_LABEL}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="text-[10px] uppercase">Média</div>
                              <div className="font-mono text-foreground/80 text-xs">
                                {ok && s.mean_score != null ? Number(s.mean_score).toFixed(1) : PRIVACY_REDACTED_LABEL}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">Pontuação média 0–100 da dimensão</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="text-[10px] uppercase">% Desf.</div>
                              <div className="font-mono text-foreground/80 text-xs">
                                {ok && s.unfavorable_percentage != null ? `${Number(s.unfavorable_percentage).toFixed(0)}%` : PRIVACY_REDACTED_LABEL}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">% de respostas desfavoráveis (score ≥ 60/100)</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="text-[10px] uppercase">Sev</div>
                              <div className="font-mono text-foreground/80 text-xs">
                                {ok ? `S${s.severity}` : PRIVACY_REDACTED_LABEL}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">{ok ? SEVERITY_LABEL[s.severity] : "—"}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="cursor-help">
                              <div className="text-[10px] uppercase">Prob</div>
                              <div className="font-mono text-foreground/80 text-xs">
                                {ok ? `P${s.probability}` : PRIVACY_REDACTED_LABEL}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">{ok ? PROBABILITY_LABEL[s.probability] : "—"}</TooltipContent>
                        </Tooltip>
                        <div>
                          <div className="text-[10px] uppercase">n</div>
                          <div className="font-mono text-foreground/80 text-xs">{s.n_responses}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ok ? (
                          <Badge variant="outline" className={bandPillColor(band)}>
                            {RISK_BAND_LABEL[band]} · R{s.risk_level}
                          </Badge>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                            <EyeOff className="h-3 w-3" /> oculto (n&lt;{K_ANONYMITY_MIN})
                          </span>
                        )}
                        <Button size="sm" variant={ok ? "default" : "ghost"} disabled={!ok} onClick={() => createAction(s)}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Criar ação
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ============== DIMENSÃO → DRIVER (INSIGHTS) ============== */}
        {hasSample && visible.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Da dimensão ao driver — análise instrucional</CardTitle>
              <p className="text-xs text-muted-foreground max-w-3xl">
                Cada dimensão visível é traduzida em fator psicossocial MTE, direcionadores do Playbook
                Oxford Work Wellbeing 2.0 e intervenções cadastradas no catálogo institucional.
                <strong> Recomendações preliminares</strong> — requerem revisão do responsável técnico (SST/PGR).
                Quando uma fonte não estiver cadastrada, será exibido <em>"Fonte não cadastrada — revisar catálogo institucional"</em>.
              </p>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-2 gap-4">
              {visible.slice(0, 6).map((s) => (
                <DriverInsightCard
                  key={s.id}
                  dimensionKey={s.dimension}
                  riskLevel={s.risk_level}
                  severity={s.severity}
                  probability={s.probability}
                  nResponses={s.n_responses}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* ============== FATORES DE PROTEÇÃO & PONTOS FORTES (MANTER NO PDCA) ============== */}
        {hasSample && visible.length > 0 && (
          <Card className="border-emerald-600/30 dark:border-emerald-500/25 bg-emerald-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Fatores de Proteção & Pontos Fortes da Organização (Manter no PDCA)
                  </CardTitle>
                  <p className="text-xs text-muted-foreground max-w-3xl mt-1">
                    Dimensões situadas na faixa favorável (risco baixo com k≥5) atuam como amortecedores organizacionais contra o desgaste psicossocial (ISO 45003 e Lei 14.831/2024). Devem ser preservadas no ciclo contínuo do PGR.
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-600/35 dark:border-emerald-500/40">
                  {protectiveFactors.length} fator(es) de proteção ativo(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {protectiveFactors.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhuma dimensão com k≥5 encontra-se na faixa de risco baixo (R≤4) neste ciclo. Priorize os controles na fonte para construir fatores de proteção organizacionais.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {protectiveFactors.map((pf) => {
                    const drv = topDriverForDimension(dimensionToDriver, pf.dimension);
                    return (
                      <div key={pf.dimension} className="rounded-lg border border-emerald-600/25 dark:border-emerald-500/25 bg-card/80 dark:bg-background/60 p-3 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm">{getDimensionLabel(pf.dimension, "pt-BR")}</span>
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-600/35 dark:border-emerald-500/40">
                            Proteção · R{pf.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          n={pf.nResponses} respostas{pf.meanScore != null ? ` · média ${Number(pf.meanScore).toFixed(1)}` : ""}
                        </p>
                        {drv && (
                          <div className="pt-1 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-emerald-800 dark:text-emerald-300/90 font-medium">
                              Driver: {getDriverLabel(drv, "pt-BR")}
                            </span>
                            <Button asChild size="sm" variant="ghost" className="h-6 px-2 text-[11px]">
                              <Link to={`/drivers/${drv}`}>Manter prática</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ============== MAPEAMENTO PARA OS 13 FATORES PSICOSSOCIAIS (GUIA MTE) ============== */}
        {hasSample && visible.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Mapeamento para os 13 Fatores Psicossociais Relacionados ao Trabalho (Guia MTE / NR-01)
                  </CardTitle>
                  <p className="text-xs text-muted-foreground max-w-3xl mt-1">
                    Síntese executiva que conecta as dimensões avaliadas no ciclo aos 13 fatores psicossociais de referência para inspeção do trabalho e inventário do PGR, com indicação de ação causal na fonte e driver de bem-estar correspondente.
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">13 Fatores MTE · k≥5</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-2.5">
              {mte13Factors.map((item) => {
                const pill =
                  item.status === "priority"
                    ? "bg-red-500/15 text-red-800 dark:text-red-300 border-red-600/35 dark:border-red-500/40"
                    : item.status === "attention"
                      ? "bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-600/35 dark:border-amber-500/40"
                      : item.status === "protective"
                        ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-600/35 dark:border-emerald-500/40"
                        : "bg-muted text-muted-foreground border-border";
                return (
                  <div key={item.factor.code} className="rounded-lg border border-border bg-card/40 p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground">{item.factor.code}</span>
                        <p className="text-sm font-medium leading-tight">{item.factor.title}</p>
                      </div>
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${pill}`}>
                        {item.statusLabel}
                        {item.highestRiskLevel != null ? ` · R${item.highestRiskLevel}` : ""}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.factor.description}</p>
                    <p className="text-[11px] text-foreground/90">
                      <strong>Ação causal recomendada na fonte:</strong> {item.factor.causalActionHint}
                    </p>
                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap text-[11px] text-muted-foreground">
                      <span>
                        Dimensões: {item.factor.copsoqDimensions.map((d) => getDimensionLabel(d, "pt-BR")).join(", ")}
                      </span>
                      <Button asChild size="sm" variant="outline" className="h-6 px-2 text-[11px]">
                        <Link to={`/drivers/${item.factor.driverSlug}`}>
                          Driver: {getDriverLabel(item.factor.driverSlug, "pt-BR")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* ============== SINAIS CLÍNICOS & DESFECHOS ============== */}
        {selected && hasSample && <OutcomesCard cycleId={selected} />}

        {/* ============== EVOLUÇÃO HISTÓRICA (snapshots) ============== */}
        {selected && <RiskHistoryCard cycleId={selected} />}

        {/* ============== DRILLDOWN POR UNIDADE ============== */}
        {org && hasSample && <UnitDrilldownCard orgId={org.id} />}

        {/* ============== PRÓXIMO PASSO ============== */}
        {hasSample && visible.length > 0 && (
          <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="h-4 w-4 text-primary" /> Próximo passo — Plano de ação
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Priorize as {Math.min(3, topRisks.length)} dimensões com maior risco. A priorização considera
                o snapshot contextual aprovado e a hierarquia de controles; prioridade exige revisão técnica.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {topRisks.length > 0 && (
                <ul className="space-y-1.5">
                  {topRisks.map((s, i) => {
                    const band = riskBand(s.risk_level);
                    const drv = topDriverForDimension(dimensionToDriver, s.dimension);
                    return (
                      <li key={s.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{getDimensionLabel(s.dimension, "pt-BR")}</div>
                            <div className="text-[11px] text-muted-foreground">
                              S{s.severity}×P{s.probability} · n={s.n_responses}
                              {drv ? ` · driver: ${getDriverLabel(drv, "pt-BR")}` : ""}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className={bandPillColor(band)}>
                          {RISK_BAND_LABEL[band]} · R{s.risk_level}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="flex gap-2 flex-wrap pt-1">
                <Button asChild size="sm">
                  <Link to="/app/actions">Criar plano de ação <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/app/controls">Ver controles sugeridos</Link>
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground border-t border-border/50 pt-2">
                Recomendações preliminares baseadas em catálogo institucional — requerem revisão do responsável técnico.
                Não substituem laudo clínico nem garantem conformidade legal automática.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
