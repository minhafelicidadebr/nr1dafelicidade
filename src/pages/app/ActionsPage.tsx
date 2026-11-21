// @ts-nocheck -- pre-existing type errors carried over from the original project
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import type { Database } from "@/lib/runtime/databaseTypes";
import { fetchMyOrg } from "@/lib/api/nr1";
import { toast } from "sonner";
import { Sparkles, Plus, ListChecks, ArrowRight, AlertTriangle, CheckCircle2, Clock, ShieldCheck, BookOpen, Download } from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { JourneyStepper } from "@/components/app/JourneyStepper";
import { getDimensionLabel, getDriverLabel } from "@/lib/nr1/labels";
import {
  ACTION_STATUS_LABEL, actionStatusVariant, isOverdue,
  CONTROL_LEVEL_LABEL,
  PRIORITY_LABEL, PRIORITY_PILL, priorityFromRiskLevel, type ActionStatus, type ControlLevel,
  DISCLAIMER_PRELIMINAR,
} from "@/lib/nr1/statusLabels";
import AskStrategIAButton from "@/components/app/AskStrategIAButton";
import { fetchSafeRiskScores } from "@/lib/api/privacyVault";
import {
  actionGovernanceBlockerLabel,
  evaluateActionGovernance,
  type ActionGovernanceEvaluation,
  type ActionGovernanceSignal,
} from "@/lib/actions/actionGovernance";
import { evaluateControlEvidence } from "@/lib/controls/controlEvidence";
import {
  classifyActionNature,
  resolveActionExecutionSheet,
} from "@/lib/nr1/q1Nr1PromotionEngine";
import { evaluateMteControlFollowUpFiveQuestions } from "@/lib/governance/mteCopsoqAuditEngine";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

const levels: ControlLevel[] = ["elimination", "substitution", "engineering", "administrative", "ppe"];
const statuses: ActionStatus[] = ["planned", "in_progress", "done", "cancelled"];

type RiskRow = { dimension: string; risk_level: number; n_responses: number; k_anonymity_met: boolean };

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type Cycle = Database["public"]["Tables"]["cycles"]["Row"];
type ActionItem = Database["public"]["Tables"]["action_items"]["Row"];
type ActionItemInsert = Database["public"]["Tables"]["action_items"]["Insert"];
type ActionItemUpdate = Database["public"]["Tables"]["action_items"]["Update"];
type ControlCatalogItem = Pick<
  Database["public"]["Tables"]["control_catalog"]["Row"],
  "id" | "code" | "level" | "evidence_strength"
>;
type OrgControl = Database["public"]["Tables"]["org_controls"]["Row"];
type ControlSuggestion = Database["public"]["Functions"]["suggest_controls_for_cycle"]["Returns"][number];
type Member = Database["public"]["Functions"]["list_org_members"]["Returns"][number];

export default function ActionsPage() {
  const [searchParams] = useSearchParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleId, setCycleId] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ControlSuggestion[]>([]);
  const [loadingSug, setLoadingSug] = useState(false);
  const [items, setItems] = useState<ActionItem[]>([]);
  const [risks, setRisks] = useState<RiskRow[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [provenControlCodes, setProvenControlCodes] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ title: "", description: "", level: "administrative" as ControlLevel, due_date: "", dimension: "", driver_slug: "", assignee_user_id: "", assignee_name: "" });
  const [openSheetId, setOpenSheetId] = useState<string | null>(null);
  const nexoPrefillApplied = useRef(false);

  const load = useCallback(async () => {
    const o = await fetchMyOrg(); setOrg(o);
    if (!o) return;
    const [{ data: cs }, { data: ai }, { data: ms }, { data: cat }, { data: ctl }] = await Promise.all([
      supabase.from("cycles").select("*").eq("organization_id", o.id).order("created_at", { ascending: false }),
      supabase.from("action_items").select("*").eq("organization_id", o.id).order("created_at", { ascending: false }),
      supabase.rpc("list_org_members", { _org_id: o.id }),
      supabase.from("control_catalog").select("id,code,level,evidence_strength"),
      supabase.from("org_controls").select("*").eq("organization_id", o.id),
    ]);
    setCycles(cs ?? []); setItems(ai ?? []);
    setMembers(((ms ?? []) as Member[]).filter((m, i, a) => a.findIndex((x) => x.user_id === m.user_id) === i));
    // Códigos de controle já declarados E comprovados: suprimidos da sugestão (bruto → controle → residual).
    const catById = new Map((cat ?? []).map((c) => [c.id, c as ControlCatalogItem]));
    const proven = new Set<string>();
    (ctl ?? []).forEach((control: OrgControl) => {
      const catalogItem = catById.get(control.catalog_id);
      if (!catalogItem?.code) return;
      const evaluation = evaluateControlEvidence({
        status: control.status,
        notes: control.notes,
        catalogEvidenceStrength: catalogItem.evidence_strength,
        catalogLevel: catalogItem.level,
      });
      if (evaluation.canInformResidualRiskReview) proven.add(catalogItem.code);
    });
    setProvenControlCodes(proven);
    const firstId = cs?.[0]?.id ?? "";
    if (firstId) setCycleId((current) => current || firstId);
  }, []);
  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (nexoPrefillApplied.current) return;
    const driverKey = searchParams.get("driver_key");
    const queryCycleId = searchParams.get("cycle_id");
    if (!driverKey || searchParams.get("source") !== "nexo") return;

    if (queryCycleId && cycles.some((cycle) => cycle.id === queryCycleId)) {
      setCycleId(queryCycleId);
    }

    const driverLabel = getDriverLabel(driverKey, "pt-BR");
    setForm((current) => ({
      ...current,
      driver_slug: driverKey,
      title: current.title || `Plano de transformação — ${driverLabel}`,
      description: current.description || [
        `Contexto NEXO: driver priorizado ${driverLabel}.`,
        "",
        "Antes de criar a ação:",
        "- O que o dado agregado sugere?",
        "- O que ainda precisa ser investigado no trabalho real?",
        "- Quais evidências complementares são necessárias?",
        "- Quem precisa participar da decisão?",
        "- Como a eficácia será avaliada no próximo ciclo?",
        "",
        "Rascunho técnico para revisão. Não estabelece causalidade individual, não substitui avaliação técnica e não garante conformidade automática.",
      ].join("\n"),
    }));
    nexoPrefillApplied.current = true;
  }, [cycles, searchParams]);

  useEffect(() => {
    if (!cycleId) { setRisks([]); return; }
    (async () => {
      const data = await fetchSafeRiskScores({ cycleId });
      setRisks(data.map((row) => ({ ...row, k_anonymity_met: true })) as RiskRow[]);
    })();
  }, [cycleId]);

  const riskByDim = useMemo(() => {
    const map: Record<string, RiskRow> = {};
    risks.filter((r) => r.k_anonymity_met).forEach((r) => { map[r.dimension] = r; });
    return map;
  }, [risks]);

  const topRisks = useMemo(
    () => risks.filter((r) => r.k_anonymity_met).sort((a, b) => (b.risk_level ?? 0) - (a.risk_level ?? 0)).slice(0, 3),
    [risks],
  );

  const visibleSuggestions = useMemo(
    () => suggestions.filter((s) => !provenControlCodes.has(s.control_code)),
    [suggestions, provenControlCodes],
  );
  const contemplatedSuggestions = useMemo(
    () => suggestions.filter((s) => provenControlCodes.has(s.control_code)),
    [suggestions, provenControlCodes],
  );

  const metrics = useMemo(() => {
    const total = items.length;
    const done = items.filter((a) => a.status === "done").length;
    const overdueN = items.filter((a) => isOverdue(a.status as ActionStatus, a.due_date)).length;
    const reviewReady = items.filter((a) => evaluateActionGovernance(a).readyForClosure).length;
    const blockedForClosure = items.filter((a) => a.status !== "cancelled" && !evaluateActionGovernance(a).readyForClosure).length;
    const criticals = items.filter((a) => {
      const lvl = a.dimension ? riskByDim[a.dimension]?.risk_level : 0;
      return priorityFromRiskLevel(lvl) === "critica" || priorityFromRiskLevel(lvl) === "alta";
    }).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { total, done, overdueN, criticals, reviewReady, blockedForClosure, pct };
  }, [items, riskByDim]);

  async function suggest() {
    if (!cycleId) return;
    setLoadingSug(true);
    const { data, error } = await supabase.rpc("suggest_controls_for_cycle", { _cycle_id: cycleId, _top_n: 5 });
    setLoadingSug(false);
    if (error) return toast.error(error.message);
    setSuggestions(data ?? []);
    if (!data?.length) toast.message("Nenhuma dimensão crítica com n ≥ 5 para sugerir ações.");
  }

  async function adoptSuggestion(s: ControlSuggestion) {
    if (!org) return;
    const { error } = await supabase.from("action_items").insert({
      organization_id: org.id, cycle_id: cycleId,
      dimension: s.dimension, driver_slug: s.driver_slug,
      title: `[${s.control_code}] ${s.control_title}`,
      description: buildSuggestionDescription(s),
      level: s.control_level as ControlLevel,
    });
    if (error) toast.error(error.message); else { toast.success("Ação adicionada ao plano"); load(); }
  }

  async function adoptAll() {
    if (!org || !visibleSuggestions.length) return;
    const rows = visibleSuggestions.map((s) => ({
      organization_id: org.id, cycle_id: cycleId,
      dimension: s.dimension, driver_slug: s.driver_slug,
      title: `[${s.control_code}] ${s.control_title}`,
      description: buildSuggestionDescription(s),
      level: s.control_level as ControlLevel,
    }));
    const { error } = await supabase.from("action_items").insert(rows);
    if (error) toast.error(error.message); else { toast.success(`${rows.length} ações adicionadas`); setSuggestions([]); load(); }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!org) return;
    if (!form.assignee_name.trim()) { toast.error("Informe o responsável pela ação (NR-1/GRO)."); return; }
    const payload: ActionItemInsert = {
      organization_id: org.id, cycle_id: cycleId || null,
      title: form.title, description: form.description, level: form.level,
      due_date: form.due_date || null,
      dimension: form.dimension || null,
      driver_slug: form.driver_slug || null,
      assignee_user_id: form.assignee_user_id || null,
      assignee_name: form.assignee_name.trim(),
    };
    const { error } = await supabase.from("action_items").insert(payload);
    if (error) toast.error(error.message);
    else { setForm({ title: "", description: "", level: "administrative", due_date: "", dimension: "", driver_slug: "", assignee_user_id: "", assignee_name: "" }); load(); }
  }

  async function setAssignee(id: string, member: Member | null, fallbackName?: string) {
    const patch = member
      ? { assignee_user_id: member.user_id, assignee_name: member.full_name }
      : { assignee_user_id: null, assignee_name: (fallbackName ?? "").trim() };
    if (!patch.assignee_name) return;
    const { error } = await supabase.from("action_items").update(patch satisfies ActionItemUpdate).eq("id", id);
    if (error) toast.error(error.message); else load();
  }

  async function setStatus(action: ActionItem, status: ActionStatus) {
    const governance = evaluateActionGovernance({ ...action, status });
    if (status === "done" && governance.completionBlockers.length > 0) {
      toast.error(
        `Conclusão bloqueada: ${actionGovernanceBlockerLabel(governance.completionBlockers[0])}`,
      );
      return;
    }
    const { error } = await supabase.from("action_items").update({ status }).eq("id", action.id);
    if (error) toast.error(error.message); else load();
  }

  function exportActionsCsv() {
    if (items.length === 0) {
      toast.message("Nenhuma ação cadastrada para exportar.");
      return;
    }
    const header = [
      "titulo",
      "natureza_nr1",
      "hierarquia_controle",
      "dimensao_origem",
      "driver_bem_estar",
      "responsavel",
      "prazo",
      "status",
    ].join(";");
    const lines = items.map((a) => {
      const linkedRisk = a.dimension ? riskByDim[a.dimension] : null;
      const nature = classifyActionNature({
        level: a.level,
        riskLevel: linkedRisk?.risk_level ?? null,
      });
      return [
        `"${a.title.replace(/"/g, '""')}"`,
        `"${nature.shortLabel}"`,
        `"${CONTROL_LEVEL_LABEL[a.level as ControlLevel] ?? a.level}"`,
        `"${a.dimension ? getDimensionLabel(a.dimension) : "—"}"`,
        `"${a.driver_slug ? getDriverLabel(a.driver_slug, "pt-BR") : "—"}"`,
        `"${(a.assignee_name ?? "Não definido").replace(/"/g, '""')}"`,
        a.due_date ?? "Sem prazo",
        `"${ACTION_STATUS_LABEL[a.status as ActionStatus] ?? a.status}"`,
      ].join(";");
    });
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plano_de_acao_nr1_${(org?.name ?? "organizacao").replace(/[^\w.-]+/g, "_").toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Plano de Ação exportado em CSV (compatível com Excel).");
  }

  return (
    <div className="space-y-6">
      <JourneyStepper />

      {/* Header instrucional */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="py-5 space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <ListChecks className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Plano de Ação NR-1</h2>
                <Badge variant="outline" className="text-[10px]">Baseado em riscos com k≥5</Badge>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-300 border-emerald-500/35">
                  Causal (Fonte) vs. Atenuante vs. Manter Proteção (PDCA)
                </Badge>
                <Nr1LearningScienceInfoModal
                  topicId="actions_5w2h_efficacy"
                  customLabel="Plano de Ação & 5 Perguntas de Eficácia MTE 2026"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Transforme riscos psicossociais agregados em medidas organizacionais rastreáveis, com responsável, prazo, evidência e ficha prática de execução — alinhado a NR-1 / GRO / PGR.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={exportActionsCsv}>
                <Download className="h-3.5 w-3.5 mr-1" /> Exportar Plano (CSV)
              </Button>
              <Button asChild variant="outline" size="sm"><Link to="/app/risk">Ver riscos</Link></Button>
              <Button asChild size="sm"><Link to="/app/controls">Próximo: Controles <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            </div>
          </div>
          {/* Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 pt-2">
            <Metric label="Ações totais" value={metrics.total} />
            <Metric label="Críticas/Altas" value={metrics.criticals} accent="text-orange-400" />
            <Metric label="Atrasadas" value={metrics.overdueN} accent="text-red-400" />
            <Metric label="Concluídas" value={metrics.done} accent="text-emerald-400" />
            <Metric label="Prontas p/ revisão" value={metrics.reviewReady} accent="text-sky-300" />
            <Metric label="Bloqueios" value={metrics.blockedForClosure} accent="text-amber-300" />
            <Metric label="Conclusão" value={`${metrics.pct}%`} />
          </div>
        </CardContent>
      </Card>

      {/* Sugestões inteligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />Sugestão técnica a partir dos riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Cruza somente dimensões aprovadas e agregadas com o catálogo institucional de controles, na hierarquia de prevenção: eliminação → substituição → engenharia → administrativo → suporte individual.
          </p>
          <div className="flex gap-2 items-end flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <Label className="text-xs">Ciclo</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={cycleId} onChange={(e) => setCycleId(e.target.value)}>
                {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Button onClick={suggest} disabled={!cycleId || loadingSug}>
              <Sparkles className="h-4 w-4" />{loadingSug ? "Analisando…" : "Gerar sugestões"}
            </Button>
            {visibleSuggestions.length > 0 && <Button variant="secondary" onClick={adoptAll}>Adotar todas ({visibleSuggestions.length})</Button>}
          </div>
          {contemplatedSuggestions.length > 0 && (
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
              <p className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Já contemplado pelos controles declarados ({contemplatedSuggestions.length})
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Estes controles já foram declarados e comprovados pela organização, por isso não são sugeridos novamente.
                Se a dimensão seguir em risco alto, veja o alerta de eficácia em <Link to="/app/controls" className="underline">Controles</Link>.
              </p>
              <ul className="mt-2 space-y-1">
                {contemplatedSuggestions.map((s, i) => (
                  <li key={`${s.control_code}-${i}`} className="text-[11px] text-muted-foreground">
                    · {getDimensionLabel(s.dimension)} — {s.control_title} <span className="opacity-60">({s.control_code})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {visibleSuggestions.length > 0 && (
            <div className="space-y-2 mt-2">
              {visibleSuggestions.map((s, i) => {
                const priority = priorityFromRiskLevel(s.risk_level);
                const nature = classifyActionNature({ level: s.control_level, riskLevel: s.risk_level });
                const sheet = resolveActionExecutionSheet({
                  dimension: s.dimension,
                  driverSlug: s.driver_slug,
                  level: s.control_level,
                  riskLevel: s.risk_level,
                });
                const sugKey = `sug-${s.control_code}-${i}`;
                const sheetOpen = openSheetId === sugKey;
                return (
                  <div key={sugKey} className="border border-border rounded-lg p-3 bg-card/50 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={PRIORITY_PILL[priority]}>{PRIORITY_LABEL[priority]}</Badge>
                          <Badge variant="outline" className={`text-[10px] ${nature.badgeClass}`} title={nature.rationale}>
                            {nature.shortLabel}
                          </Badge>
                          <Badge variant="outline">{CONTROL_LEVEL_LABEL[s.control_level as ControlLevel] ?? s.control_level}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {getDimensionLabel(s.dimension)} · risco {s.risk_level} · n={s.n_responses}
                          </span>
                          <Badge variant="outline" className="text-[10px]">Evidência: {s.evidence_strength}</Badge>
                        </div>
                        <p className="font-medium text-sm mt-1">{s.control_title}</p>
                        <p className="text-xs text-muted-foreground">{s.control_description}</p>
                        <div className="pt-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs text-primary"
                            onClick={() => setOpenSheetId(sheetOpen ? null : sugKey)}
                          >
                            <BookOpen className="h-3.5 w-3.5 mr-1" />
                            {sheetOpen ? "Ocultar Ficha Prática de Implementação" : "Ver Ficha Prática de Implementação (Como Executar)"}
                          </Button>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => adoptSuggestion(s)}><Plus className="h-3 w-3" />Adotar</Button>
                    </div>
                    {sheetOpen && <ExecutionSheetPanel sheet={sheet} />}
                  </div>
                );
              })}
              <p className="text-[10px] text-muted-foreground italic pt-1">{DISCLAIMER_PRELIMINAR}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nova ação manual */}
      <Card>
        <CardHeader><CardTitle className="text-base">Nova ação manual</CardTitle></CardHeader>
        <CardContent>
          {form.driver_slug && (
            <div className="mb-3 rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Rascunho contextual NEXO · {getDriverLabel(form.driver_slug, "pt-BR")}</p>
              <p className="mt-1">
                O dado sugere uma rota de transformação, mas a ação deve ser contextualizada com trabalho real, participação dos envolvidos,
                evidências complementares e revisão do responsável técnico.
              </p>
            </div>
          )}
          <form onSubmit={add} className="grid md:grid-cols-2 gap-3">
            <div><Label>Título</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div>
              <Label>Hierarquia do controle</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as ControlLevel })}>
                {levels.map(l => <option key={l} value={l}>{CONTROL_LEVEL_LABEL[l]}</option>)}
              </select>
            </div>
            <div>
              <Label>Dimensão de origem (opcional)</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.dimension} onChange={(e) => setForm({ ...form, dimension: e.target.value })}>
                <option value="">— sem vínculo —</option>
                {Object.keys(riskByDim).map((d) => (
                  <option key={d} value={d}>{getDimensionLabel(d)}</option>
                ))}
              </select>
            </div>
            <div><Label>Prazo</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
            <div>
              <Label>Responsável <span className="text-red-400">*</span></Label>
              {members.length > 0 ? (
                <select
                  required
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={form.assignee_user_id}
                  onChange={(e) => {
                    const m = members.find((x) => x.user_id === e.target.value);
                    setForm({
                      ...form,
                      assignee_user_id: m?.user_id ?? "",
                      assignee_name: m?.full_name ?? "",
                    });
                  }}
                >
                  <option value="">— selecione um membro da organização —</option>
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.full_name} · {m.role}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  required
                  placeholder="Nome do responsável (NR-1/GRO)"
                  value={form.assignee_name}
                  onChange={(e) => setForm({ ...form, assignee_name: e.target.value, assignee_user_id: "" })}
                />
              )}
            </div>
            <div className="md:col-span-2">
              <Label>Descrição / Evidência esperada / KPI</Label>
              <Textarea
                value={form.description}
                placeholder="Inclua evidência esperada, KPI/indicador ou reavaliação e critério de revisão técnica antes de concluir."
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 flex justify-end"><Button type="submit"><Plus className="h-4 w-4" />Adicionar ao plano</Button></div>
          </form>
        </CardContent>
      </Card>

      {/* Plano de ação */}
      <Card>
        <CardHeader><CardTitle className="text-base">Plano de ação ({items.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {items.map((a) => {
            const linkedRisk = a.dimension ? riskByDim[a.dimension] : null;
            const priority = priorityFromRiskLevel(linkedRisk?.risk_level);
            const overdue = isOverdue(a.status as ActionStatus, a.due_date);
            const governance = evaluateActionGovernance(a);
            const nature = classifyActionNature({
              level: a.level,
              riskLevel: linkedRisk?.risk_level ?? null,
            });
            const sheet = resolveActionExecutionSheet({
              dimension: a.dimension,
              driverSlug: a.driver_slug,
              level: a.level,
              riskLevel: linkedRisk?.risk_level ?? null,
            });
            const sheetOpen = openSheetId === a.id;
            return (
              <div key={a.id} className="border border-border rounded-lg p-3 space-y-2 bg-card/40">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{a.title}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {a.dimension && (
                        <Badge variant="outline" className={PRIORITY_PILL[priority]}>{PRIORITY_LABEL[priority]}</Badge>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${nature.badgeClass}`} title={nature.rationale}>
                        {nature.shortLabel}
                      </Badge>
                      <Badge variant="outline">{CONTROL_LEVEL_LABEL[a.level as ControlLevel] ?? a.level}</Badge>
                      {a.dimension && (
                        <Badge variant="outline" className="text-[10px]">Origem: {getDimensionLabel(a.dimension)}{linkedRisk ? ` · n=${linkedRisk.n_responses}` : ""}</Badge>
                      )}
                      {a.driver_slug && (
                        <Badge variant="outline" className="text-[10px]">Driver: {getDriverLabel(a.driver_slug, "pt-BR")}</Badge>
                      )}
                      {overdue && <Badge variant="destructive" className="text-[10px] gap-1"><AlertTriangle className="h-3 w-3" />Atrasada</Badge>}
                    </div>
                    {a.description && <p className="text-xs text-muted-foreground whitespace-pre-wrap pt-1">{a.description}</p>}
                    <ActionGovernancePanel governance={governance} />
                    <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Prazo: {a.due_date ? new Date(a.due_date).toLocaleDateString("pt-BR") : "sem prazo"}</span>
                      <span className="flex items-center gap-1">
                        Responsável:{" "}
                        {a.assignee_name ? (
                          <span className="text-foreground/90 font-medium">
                            {a.assignee_name}
                            {a.assignee_user_id && <span className="text-emerald-400 ml-1" title="Vinculado a membro da organização">✓</span>}
                          </span>
                        ) : members.length > 0 ? (
                          <select
                            className="h-7 rounded border border-input bg-background px-2 text-[11px]"
                            defaultValue=""
                            onChange={(e) => {
                              const m = members.find((x) => x.user_id === e.target.value);
                              if (m) setAssignee(a.id, m);
                            }}
                          >
                            <option value="">definir responsável…</option>
                            {members.map((m) => (
                              <option key={m.user_id} value={m.user_id}>{m.full_name} · {m.role}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const name = window.prompt("Nome do responsável pela ação (NR-1/GRO):", "");
                              if (name && name.trim()) setAssignee(a.id, null, name);
                            }}
                            className="text-amber-300 hover:text-amber-200 underline-offset-2 hover:underline"
                          >
                            definir responsável
                          </button>
                        )}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-primary"
                        onClick={() => setOpenSheetId(sheetOpen ? null : a.id)}
                      >
                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                        {sheetOpen ? "Ocultar Ficha Prática" : "Ver Ficha Prática de Implementação (Como Executar)"}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end min-w-[150px]">
                    <Badge variant={actionStatusVariant(a.status as ActionStatus, a.due_date)}>
                      {ACTION_STATUS_LABEL[a.status as ActionStatus] ?? a.status}
                    </Badge>
                    <select className="text-xs h-8 rounded border border-input bg-background px-2 w-full"
                      value={a.status} onChange={(e) => setStatus(a, e.target.value as ActionStatus)}>
                      {statuses.map(s => <option key={s} value={s}>{ACTION_STATUS_LABEL[s]}</option>)}
                    </select>
                    {a.status !== "done" && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setStatus(a, "done")}>
                        <CheckCircle2 className="h-3 w-3" />Concluir
                      </Button>
                    )}
                    <AskStrategIAButton
                      question={`Como executar a ação "${a.title}"?`}
                      intent="actions.create_from_risk"
                      label="Perguntar à Sra. EstratégIA"
                    />
                  </div>
                </div>
                {sheetOpen && <ExecutionSheetPanel sheet={sheet} />}
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="space-y-3">
              {topRisks.length > 0 && (
                <div className="rounded-lg border border-dashed border-primary/30 p-3 bg-primary/5">
                  <p className="text-xs font-medium text-foreground mb-2">Top riscos disponíveis para virar ação:</p>
                  <ul className="space-y-1 text-xs">
                    {topRisks.map((r) => (
                      <li key={r.dimension} className="flex items-center justify-between gap-2">
                        <span><Badge variant="outline" className={PRIORITY_PILL[priorityFromRiskLevel(r.risk_level)]}>{PRIORITY_LABEL[priorityFromRiskLevel(r.risk_level)]}</Badge> {getDimensionLabel(r.dimension)} <span className="text-muted-foreground">· risco {r.risk_level} · n={r.n_responses}</span></span>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => setForm((f) => ({ ...f, dimension: r.dimension, title: `Plano para ${getDimensionLabel(r.dimension)}` }))}>
                          Usar no formulário
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <EmptyState
                icon={ListChecks}
                title="Plano de ação vazio"
                description="Gere sugestões a partir dos riscos do ciclo ou cadastre uma ação manual. As ações alimentam o DRPS e o Plano de Ação auditáveis (NR-1/GRO/PGR)."
                hints={[
                  "Priorize: eliminação → substituição → engenharia → administrativo → suporte individual.",
                  "Cada ação deve citar instrumento, versão, dimensão e evidência contextual para rastreabilidade.",
                ]}
                primary={{ label: "Computar riscos", to: "/app/risk" }}
                secondary={{ label: "Ver controles", to: "/app/controls" }}
              />
              <div className="flex justify-center">
                <AskStrategIAButton
                  question="Como criar a primeira ação?"
                  intent="actions.create_from_risk"
                  label="Perguntar como criar a primeira ação"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/50 px-3 py-2">
      <p className={`text-lg font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function buildSuggestionDescription(s: ControlSuggestion) {
  return [
    s.control_description,
    "",
    `Origem: dimensão ${getDimensionLabel(s.dimension)} (risco ${s.risk_level}, n=${s.n_responses}). Evidência catalogada: ${s.evidence_strength}.`,
    "Evidência esperada: registro de implementação, responsável, data e material/procedimento aplicável.",
    "KPI/reavaliação: indicador definido pelo responsável técnico e reavaliação no ciclo seguinte.",
    "Revisão técnica: SST/SESMT/CIPA antes de concluir a ação.",
  ].join("\n");
}

function ActionGovernancePanel({ governance }: { governance: ActionGovernanceEvaluation }) {
  if (governance.label === "cancelled") {
    return (
      <div className="rounded-md border border-border/70 bg-background/50 px-2.5 py-2 text-[11px] text-muted-foreground">
        Ação cancelada. Mantenha justificativa e histórico para auditoria no fluxo formal.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/70 bg-background/50 px-2.5 py-2 space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] font-medium">Governança da ação</span>
        <SignalBadge label="Responsável" signal="owner" governance={governance} />
        <SignalBadge label="Prazo" signal="deadline" governance={governance} />
        <SignalBadge label="Origem" signal="risk_origin" governance={governance} />
        <SignalBadge label="Evidência" signal="evidence" governance={governance} />
        <SignalBadge label="KPI/Reavaliação" signal="kpi" governance={governance} />
        <SignalBadge label="Revisão" signal="technical_review" governance={governance} />
      </div>
      {governance.completionBlockers.length > 0 ? (
        <p className="text-[11px] text-amber-300">
          Para concluir: {governance.completionBlockers.map(actionGovernanceBlockerLabel).join(" ")}
        </p>
      ) : (
        <p className="text-[11px] text-emerald-300">
          Pronta para fechamento operacional, ainda sujeita à revisão formal do documento.
        </p>
      )}
    </div>
  );
}

function SignalBadge({
  label,
  signal,
  governance,
}: {
  label: string;
  signal: ActionGovernanceSignal;
  governance: ActionGovernanceEvaluation;
}) {
  const ok = governance.signals[signal];
  return (
    <Badge
      variant="outline"
      className={`text-[10px] ${ok ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/35" : "bg-amber-500/10 text-amber-300 border-amber-500/35"}`}
    >
      {ok ? "OK" : "Pendente"} · {label}
    </Badge>
  );
}

function ExecutionSheetPanel({
  sheet,
}: {
  sheet: ReturnType<typeof resolveActionExecutionSheet>;
}) {
  const [fiveQ, setFiveQ] = useState({
    q1Executed: true,
    q2ExecutedOnTime: true,
    q3ExecutedAsPlanned: true,
    q4MaintainedOverTime: true,
    q5ProducingExpectedEffect: true,
  });

  const fiveQEval = useMemo(
    () => evaluateMteControlFollowUpFiveQuestions(fiveQ),
    [fiveQ],
  );

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 space-y-2.5 text-xs">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {sheet.title}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{sheet.objective}</p>
        </div>
        <Button asChild size="sm" variant="outline" className="h-7 text-xs">
          <Link to={`/drivers/${sheet.driverSlug}`}>
            Explorar Driver: {getDriverLabel(sheet.driverSlug, "pt-BR")}
          </Link>
        </Button>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-medium text-foreground/90">Passo a passo operacional (Como Executar):</p>
        <ol className="list-decimal pl-4 space-y-1 text-[11px] text-muted-foreground">
          {sheet.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 pt-1 text-[11px]">
        <div className="rounded border border-border/60 bg-background/50 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">Responsável típico</p>
          <p className="font-medium text-foreground/90 mt-0.5">{sheet.typicalOwner}</p>
        </div>
        <div className="rounded border border-border/60 bg-background/50 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">Indicador de eficácia (KPI)</p>
          <p className="font-medium text-foreground/90 mt-0.5">{sheet.efficacyIndicator}</p>
        </div>
        <div className="rounded border border-border/60 bg-background/50 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">Base normativa & científica</p>
          <p className="font-medium text-foreground/90 mt-0.5">{sheet.normativeBasis}</p>
        </div>
      </div>

      {/* As 5 Perguntas-Chave de Acompanhamento e Eficácia (Manual Oficial MTE 2026 Cap. 12.2, p. 78 · item 1.5.5.3.2) */}
      <div className="rounded border border-border/70 bg-background/60 p-2.5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-foreground">
            Verificação das 5 Perguntas-Chave de Eficácia (Manual MTE 2026 Cap. 12.2, p. 78 · NR-1 item 1.5.5.3.2)
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] ${
              fiveQEval.efficacyScorePct === 100
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                : "bg-amber-500/15 text-amber-300 border-amber-500/40"
            }`}
          >
            Eficácia: {fiveQEval.positiveAnswersCount}/5 ({fiveQEval.efficacyScorePct}%)
          </Badge>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-1.5 text-[11px] text-muted-foreground">
          {([
            ["q1Executed", "1. A ação foi executada?"],
            ["q2ExecutedOnTime", "2. Executada no prazo?"],
            ["q3ExecutedAsPlanned", "3. Conforme planejado?"],
            ["q4MaintainedOverTime", "4. Mantida no tempo?"],
            ["q5ProducingExpectedEffect", "5. Produz efeito esperado?"],
          ] as const).map(([key, label]) => (
            <label
              key={key}
              className="inline-flex items-center gap-1.5 cursor-pointer hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={fiveQ[key]}
                onChange={(e) =>
                  setFiveQ((prev) => ({ ...prev, [key]: e.target.checked }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {fiveQEval.recommendationPt}
        </p>
      </div>
    </div>
  );
}


