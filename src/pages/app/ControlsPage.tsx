import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import type { Database } from "@/lib/runtime/databaseTypes";
import { fetchMyOrg } from "@/lib/api/nr1";
import { toast } from "sonner";
import { Wrench, ArrowRight, ShieldCheck, Info, Save, AlertTriangle } from "lucide-react";
import { JourneyStepper } from "@/components/app/JourneyStepper";
import { getDimensionLabel } from "@/lib/nr1/labels";
import {
  ACTION_STATUS_LABEL,
  CONTROL_LEVEL_LABEL, CONTROL_LEVEL_RANK, CONTROL_LEVEL_PSY_NOTE,
  DISCLAIMER_PRELIMINAR, actionStatusVariant, type ActionStatus, type ControlLevel,
} from "@/lib/nr1/statusLabels";
import AskStrategIAButton from "@/components/app/AskStrategIAButton";
import {
  controlEvidenceBlockerLabel,
  evaluateControlEvidence,
  type ControlEvidenceEvaluation,
  type ControlEvidenceSignal,
} from "@/lib/controls/controlEvidence";
import {
  evaluateControlDivergence,
  highRiskThresholdFromBands,
  type ControlDivergence,
  type DivergenceControl,
} from "@/lib/controls/controlDivergence";
import { repositoryCriteriaDraft } from "@/data/criteriaPolicy";
import { fetchSafeRiskScores } from "@/lib/api/privacyVault";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

const HIGH_RISK_THRESHOLD = highRiskThresholdFromBands(repositoryCriteriaDraft.riskBands);
type ControlCatalog = Database["public"]["Tables"]["control_catalog"]["Row"];
type OrgControl = Database["public"]["Tables"]["org_controls"]["Row"];
type Organization = Database["public"]["Tables"]["organizations"]["Row"];

export default function ControlsPage() {
  const [catalog, setCatalog] = useState<ControlCatalog[]>([]);
  const [adopted, setAdopted] = useState<Record<string, OrgControl>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [org, setOrg] = useState<Organization | null>(null);
  const [safeScores, setSafeScores] = useState<Array<{ dimension: string; risk_level: number }>>([]);

  async function load() {
    const o = await fetchMyOrg(); setOrg(o);
    const { data: cat } = await supabase.from("control_catalog").select("*");
    const sorted = (cat ?? []).slice().sort((a, b) =>
      (CONTROL_LEVEL_RANK[a.level as ControlLevel] ?? 99) - (CONTROL_LEVEL_RANK[b.level as ControlLevel] ?? 99),
    );
    setCatalog(sorted);
    if (o) {
      const { data: ad } = await supabase.from("org_controls").select("*").eq("organization_id", o.id);
      const map: Record<string, OrgControl> = {};
      const drafts: Record<string, string> = {};
      (ad ?? []).forEach((x) => map[x.catalog_id] = x);
      (ad ?? []).forEach((x) => drafts[x.catalog_id] = x.notes ?? "");
      setAdopted(map);
      setDraftNotes(drafts);
      // Riscos remanescentes: só ciclos fechados com k>=5 (a RPC já suprime < k).
      try {
        const scores = await fetchSafeRiskScores({ organizationId: o.id });
        setSafeScores(scores.map((s) => ({ dimension: s.dimension, risk_level: s.risk_level })));
      } catch {
        setSafeScores([]);
      }
    }
  }
  useEffect(() => { load(); }, []);

  const divergences = useMemo<ControlDivergence[]>(() => {
    if (!catalog.length || !safeScores.length) return [];
    const declared: DivergenceControl[] = Object.entries(adopted).map(([catId, control]) => {
      const catalogItem = catalog.find((item) => item.id === catId);
      return {
        catalogId: catId,
        dimensionKey: catalogItem?.dimension_key ?? null,
        title: catalogItem?.title ?? "Controle",
        evidence: evaluateControlEvidence({
          status: control.status,
          notes: draftNotes[catId] ?? control.notes,
          catalogEvidenceStrength: catalogItem?.evidence_strength,
          catalogLevel: catalogItem?.level,
        }),
      };
    });
    const scores = safeScores.map((s) => ({ dimension: s.dimension, riskLevel: s.risk_level }));
    return evaluateControlDivergence(declared, scores, { highRiskThreshold: HIGH_RISK_THRESHOLD });
  }, [catalog, adopted, draftNotes, safeScores]);

  async function adopt(catId: string) {
    if (!org) return;
    if (adopted[catId]) {
      await supabase.from("org_controls").delete().eq("id", adopted[catId].id);
    } else {
      const { error } = await supabase.from("org_controls").insert({ organization_id: org.id, catalog_id: catId });
      if (error) return toast.error(error.message);
    }
    load();
  }

  async function saveControlNotes(catId: string) {
    const control = adopted[catId];
    if (!control) return;
    const { error } = await supabase
      .from("org_controls")
      .update({ notes: draftNotes[catId] ?? "" })
      .eq("id", control.id);
    if (error) toast.error(error.message);
    else { toast.success("Evidência do controle registrada."); load(); }
  }

  async function setControlStatus(catId: string, status: ActionStatus) {
    const control = adopted[catId];
    if (!control) return;
    const catalogItem = catalog.find((item) => item.id === catId);
    const evaluation = evaluateControlEvidence({
      status,
      notes: draftNotes[catId] ?? control.notes,
      catalogEvidenceStrength: catalogItem?.evidence_strength,
      catalogLevel: catalogItem?.level,
    });
    if (status === "done" && evaluation.completionBlockers.length > 0) {
      toast.error(`Conclusão bloqueada: ${controlEvidenceBlockerLabel(evaluation.completionBlockers[0])}`);
      return;
    }
    const { error } = await supabase.from("org_controls").update({ status }).eq("id", control.id);
    if (error) toast.error(error.message); else load();
  }

  const metrics = useMemo(() => {
    const total = catalog.length;
    const adoptedN = Object.keys(adopted).length;
    const reviewReady = Object.entries(adopted).filter(([catId, control]) => {
      const catalogItem = catalog.find((item) => item.id === catId);
      return evaluateControlEvidence({
        status: control.status,
        notes: draftNotes[catId] ?? control.notes,
        catalogEvidenceStrength: catalogItem?.evidence_strength,
        catalogLevel: catalogItem?.level,
      }).canInformResidualRiskReview;
    }).length;
    const pct = total ? Math.round((adoptedN / total) * 100) : 0;
    return { total, adoptedN, reviewReady, pct };
  }, [catalog, adopted, draftNotes]);

  const levelOrder: ControlLevel[] = ["elimination", "substitution", "engineering", "administrative", "ppe"];

  return (
    <div className="space-y-6">
      <JourneyStepper />

      {/* Header instrucional */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="py-5 space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Wrench className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Controles Organizacionais</h2>
                <Badge variant="outline" className="text-[10px]">Hierarquia de prevenção</Badge>
                <Nr1LearningScienceInfoModal
                  topicId="controls_hierarchy"
                  customLabel="Hierarquia de Controles & Divergência (1.5.5.1.2)"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Defina medidas de prevenção, mitigação e acompanhamento para os riscos priorizados.
                Para risco psicossocial, priorize redesenho do trabalho, ajuste de carga, previsibilidade,
                liderança e suporte — não trate como EPI genérico.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="outline" size="sm"><Link to="/app/actions">Ver ações</Link></Button>
              <Button asChild size="sm"><Link to="/app/documents">Próximo: Documentos <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
              <AskStrategIAButton question="Quais controles priorizar agora?" intent="controls.organizational" label="Perguntar quais controles priorizar" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
            <Metric label="Controles no catálogo" value={metrics.total} />
            <Metric label="Adotados" value={metrics.adoptedN} accent="text-emerald-400" />
            <Metric label="Prontos p/ revisão" value={metrics.reviewReady} accent="text-sky-300" />
            <Metric label="Cobertura" value={`${metrics.pct}%`} />
          </div>
        </CardContent>
      </Card>

      {/* Divergência de eficácia: controle declarado × risco remanescente (consultivo, não altera escore) */}
      {divergences.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Divergências de eficácia ({divergences.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Controle declarado para uma dimensão que permanece em risco alto em ciclo fechado (k≥5).
              Sinal consultivo para revisão técnica — <strong>não altera o escore</strong>, que reflete a percepção dos trabalhadores.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {divergences.map((d) => (
              <div key={`${d.dimension}-${d.controlTitle}`} className="rounded-lg border border-amber-500/25 bg-background/40 p-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-300 border-amber-500/35">
                    {d.severity === "review_efficacy" ? "Revisar eficácia" : "Controle sem evidência"}
                  </Badge>
                  <span className="text-xs font-medium">{getDimensionLabel(d.dimension)}</span>
                  <span className="text-[11px] text-muted-foreground">risco {d.riskLevel} · controle: {d.controlTitle}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{d.reason}</p>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground italic pt-1">{DISCLAIMER_PRELIMINAR}</p>
          </CardContent>
        </Card>
      )}

      {catalog.length === 0 && (
        <Card className="border-dashed border-muted-foreground/30">
          <CardContent className="py-10 text-center space-y-3">
            <ShieldCheck className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Catálogo de controles vazio</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              O catálogo institucional ainda não foi cadastrado. Sem catálogo, não geramos sugestões para evitar overclaiming.
            </p>
          </CardContent>
        </Card>
      )}

      {levelOrder.map((lvl, idx) => {
        const items = catalog.filter((c) => c.level === lvl);
        if (!items.length) return null;
        const adoptedInLevel = items.filter((c) => adopted[c.id]).length;
        return (
          <Card key={lvl}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">{idx + 1}</span>
                {CONTROL_LEVEL_LABEL[lvl]}
                <Badge variant="outline" className="text-[10px]">{adoptedInLevel}/{items.length} adotados</Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <Info className="h-3 w-3 mt-0.5 shrink-0" />{CONTROL_LEVEL_PSY_NOTE[lvl]}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((c) => {
                const adoptedControl = adopted[c.id];
                const evidence = adoptedControl
                  ? evaluateControlEvidence({
                    status: adoptedControl.status,
                    notes: draftNotes[c.id] ?? adoptedControl.notes,
                    catalogEvidenceStrength: c.evidence_strength,
                    catalogLevel: c.level,
                  })
                  : null;
                return (
                  <div key={c.id} className="flex justify-between items-start gap-3 border border-border rounded-lg p-3 bg-card/40">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.title} <span className="text-xs text-muted-foreground">({c.code})</span></p>
                      {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                        <Badge variant="outline" className="text-[10px]">Evidência: {c.evidence_strength ?? "—"}</Badge>
                        {c.dimension_key && (
                          <Badge variant="outline" className="text-[10px]">Dimensão: {getDimensionLabel(c.dimension_key)}</Badge>
                        )}
                      </div>
                      {adoptedControl && evidence && (
                        <div className="mt-3 space-y-2 rounded-md border border-border/70 bg-background/50 p-2.5">
                          <ControlEvidencePanel evaluation={evidence} />
                          <Textarea
                            value={draftNotes[c.id] ?? ""}
                            placeholder="Registre evidência de implementação, manutenção/rotina, KPI ou indicador de eficácia e revisão técnica. Não use nomes de trabalhadores nem relatos identificáveis."
                            onChange={(event) => setDraftNotes((current) => ({ ...current, [c.id]: event.target.value }))}
                          />
                          <p className="text-[10px] text-muted-foreground">
                            Controle declarado não reduz risco automaticamente; esta anotação prepara revisão técnica futura.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Button size="sm" variant={adoptedControl ? "default" : "outline"} onClick={() => adopt(c.id)}>
                        {adoptedControl ? "Adotado" : "Adotar"}
                      </Button>
                      <AskStrategIAButton
                        question={`Perguntar sobre o controle "${c.title}"`}
                        intent="controls.organizational"
                        label="Perguntar"
                      />
                      {adoptedControl && (
                        <>
                          <Badge variant={actionStatusVariant(adoptedControl.status as ActionStatus)} className="text-[10px]">
                            {ACTION_STATUS_LABEL[adoptedControl.status as ActionStatus] ?? adoptedControl.status}
                          </Badge>
                          <select
                            className="text-xs h-8 rounded border border-input bg-background px-2 w-full min-w-[150px]"
                            value={adoptedControl.status}
                            onChange={(event) => setControlStatus(c.id, event.target.value as ActionStatus)}
                          >
                            {(Object.keys(ACTION_STATUS_LABEL) as ActionStatus[]).map((status) => (
                              <option key={status} value={status}>{ACTION_STATUS_LABEL[status]}</option>
                            ))}
                          </select>
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => saveControlNotes(c.id)}>
                            <Save className="h-3.5 w-3.5" />Salvar evidência
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <p className="text-[10px] text-muted-foreground italic">{DISCLAIMER_PRELIMINAR}</p>
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

function ControlEvidencePanel({ evaluation }: { evaluation: ControlEvidenceEvaluation }) {
  if (evaluation.label === "cancelled") {
    return <p className="text-[11px] text-muted-foreground">Controle cancelado. Mantenha justificativa no registro formal.</p>;
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        <span className="text-[11px] font-medium">Evidência do controle</span>
        <ControlSignalBadge label="Catálogo" signal="catalog_evidence" evaluation={evaluation} />
        <ControlSignalBadge label="Implementação" signal="implementation_evidence" evaluation={evaluation} />
        <ControlSignalBadge label="Manutenção" signal="maintenance" evaluation={evaluation} />
        <ControlSignalBadge label="Eficácia/KPI" signal="effectiveness_indicator" evaluation={evaluation} />
        <ControlSignalBadge label="Revisão" signal="technical_review" evaluation={evaluation} />
      </div>
      {evaluation.completionBlockers.length > 0 ? (
        <p className="text-[11px] text-amber-300">
          Para concluir: {evaluation.completionBlockers.map(controlEvidenceBlockerLabel).join(" ")}
        </p>
      ) : (
        <p className="text-[11px] text-emerald-300">
          Pronto para informar revisão técnica; não reduz risco automaticamente.
        </p>
      )}
    </div>
  );
}

function ControlSignalBadge({
  label,
  signal,
  evaluation,
}: {
  label: string;
  signal: ControlEvidenceSignal;
  evaluation: ControlEvidenceEvaluation;
}) {
  const ok = evaluation.signals[signal];
  return (
    <Badge
      variant="outline"
      className={`text-[10px] ${ok ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/35" : "bg-amber-500/10 text-amber-300 border-amber-500/35"}`}
    >
      {ok ? "OK" : "Pendente"} · {label}
    </Badge>
  );
}
