import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Eye, FileWarning, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { AEP_PROTOCOL_VERSION, aepProtocolLimitations, aetTriggerCatalog, workEvidenceKinds } from "@/data/aepProtocol";
import { fetchMyOrg } from "@/lib/api/nr1";
import {
  addAepEvidence, addAepFinding, advanceAepAssessment, createAepAssessment,
  listAepAssessments, listAepEvidence, registerAetTrigger,
  type AepAssessmentSummary, type AepEvidenceSummary,
} from "@/lib/api/workAssessment";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

type Option = { id: string; name: string };
type Member = { user_id: string; full_name: string; role: string };

const blockerLabels: Record<string, string> = {
  work_observation_missing: "Observação do trabalho real ausente",
  worker_participation_missing: "Participação de trabalhadores/CIPA ausente",
  contextual_finding_missing: "Nenhum achado contextual registrado",
  contextual_finding_incomplete: "Achado sem campos ou evidência completos",
  independent_reviewer_missing: "Revisor independente ainda não registrado",
  review_rationale_missing: "Justificativa de revisão ausente",
  content_hash_missing: "Hash será criado ao enviar para revisão",
};

export default function WorkAnalysisPage() {
  const [orgId, setOrgId] = useState("");
  const [cycles, setCycles] = useState<Option[]>([]);
  const [units, setUnits] = useState<Option[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assessments, setAssessments] = useState<AepAssessmentSummary[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [evidence, setEvidence] = useState<AepEvidenceSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [createForm, setCreateForm] = useState({ cycleId: "", unitId: "", contextKind: "activity", contextLabel: "", title: "", scope: "" });
  const [evidenceForm, setEvidenceForm] = useState({ kind: "observation", method: "", sourceRef: "", summary: "", occurredAt: new Date().toISOString().slice(0, 10), participantCount: "", confirmed: false });
  const [findingForm, setFindingForm] = useState({ hazard: "", generatingSource: "", circumstances: "", durationPattern: "", frequencyPattern: "", exposedGroup: "", possibleHarm: "", evidenceIds: [] as string[] });
  const [aetForm, setAetForm] = useState({ triggerType: "needs_deeper_analysis", rationale: "", sourceRef: "", responsibleId: "", dueDate: "" });

  const selected = useMemo(() => assessments.find((item) => item.assessment_id === selectedId) ?? null, [assessments, selectedId]);
  const editable = selected?.status === "draft" || selected?.status === "collecting_evidence";

  const load = useCallback(async () => {
    const org = await fetchMyOrg();
    if (!org) throw new Error("Crie a organização antes de iniciar uma AEP.");
    setOrgId(org.id);
    const [cycleResult, unitResult, memberResult, items] = await Promise.all([
      supabase.from("cycles").select("id,name").eq("organization_id", org.id).order("created_at", { ascending: false }),
      supabase.from("units").select("id,name").eq("organization_id", org.id).order("name"),
      supabase.rpc("list_org_members", { _org_id: org.id }),
      listAepAssessments(org.id),
    ]);
    setCycles((cycleResult.data ?? []) as Option[]);
    setUnits((unitResult.data ?? []) as Option[]);
    setMembers((memberResult.data ?? []) as Member[]);
    setAssessments(items ?? []);
    if (!selectedId && items?.[0]) setSelectedId(items[0].assessment_id);
  }, [selectedId]);

  useEffect(() => { load().catch((error) => toast.error(error.message)); }, [load]);
  useEffect(() => {
    if (!selectedId) { setEvidence([]); return; }
    listAepEvidence(selectedId).then(setEvidence).catch((error) => toast.error(error.message));
  }, [selectedId]);

  async function run(action: () => Promise<unknown>, success: string) {
    setBusy(true);
    try { await action(); toast.success(success); await load(); if (selectedId) setEvidence(await listAepEvidence(selectedId)); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Operação não concluída."); }
    finally { setBusy(false); }
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    await run(async () => {
      const id = await createAepAssessment({ organizationId: orgId, cycleId: createForm.cycleId, unitId: createForm.unitId || null,
        contextKind: createForm.contextKind, contextLabel: createForm.contextLabel, title: createForm.title,
        scope: createForm.scope, methodologyVersion: AEP_PROTOCOL_VERSION, limitations: aepProtocolLimitations });
      setSelectedId(id);
      setCreateForm({ cycleId: "", unitId: "", contextKind: "activity", contextLabel: "", title: "", scope: "" });
    }, "AEP criada como rascunho.");
  }

  async function addEvidence(event: React.FormEvent) {
    event.preventDefault(); if (!selected) return;
    await run(() => addAepEvidence({ assessmentId: selected.assessment_id, evidenceKind: evidenceForm.kind,
      method: evidenceForm.method, sourceRef: evidenceForm.sourceRef, summary: evidenceForm.summary,
      occurredAt: new Date(`${evidenceForm.occurredAt}T12:00:00`).toISOString(),
      participantCount: evidenceForm.participantCount ? Number(evidenceForm.participantCount) : null,
      noPersonalDataConfirmed: evidenceForm.confirmed }), "Evidência contextual registrada.");
  }

  async function addFinding(event: React.FormEvent) {
    event.preventDefault(); if (!selected) return;
    await run(() => addAepFinding({ assessmentId: selected.assessment_id, ...findingForm }), "Achado contextual vinculado às evidências.");
  }

  async function addAet(event: React.FormEvent) {
    event.preventDefault(); if (!selected) return;
    await run(() => registerAetTrigger({ assessmentId: selected.assessment_id, ...aetForm }), "Gatilho AET registrado com tarefa responsável.");
  }

  const nextStatus = selected?.status === "draft" ? "collecting_evidence"
    : selected?.status === "collecting_evidence" ? "technical_review"
      : selected?.status === "technical_review" ? "approved"
        : selected?.status === "approved" ? "superseded" : null;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold">AEP e trabalho real</h1>
          <Nr1LearningScienceInfoModal
            topicId="work_analysis_aep_aet"
            customLabel="Trabalho Real (AEP/AET) & Combate à Normalização do Desvio"
          />
        </div>
        <p className="text-sm text-muted-foreground">Evidência contextual preliminar: observar → participar → registrar achados → revisar. Não substitui AET ou avaliação profissional.</p>
      </header>

      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> Nova AEP</CardTitle></CardHeader>
        <CardContent><form onSubmit={create} className="grid gap-3 md:grid-cols-2">
          <div><Label>Ciclo *</Label><select required className="w-full h-10 rounded-md border bg-background px-3" value={createForm.cycleId} onChange={(e) => setCreateForm({ ...createForm, cycleId: e.target.value })}><option value="">Selecione</option>{cycles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div><Label>Unidade</Label><select className="w-full h-10 rounded-md border bg-background px-3" value={createForm.unitId} onChange={(e) => setCreateForm({ ...createForm, unitId: e.target.value })}><option value="">Sem unidade específica</option>{units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div><Label>Tipo de contexto</Label><select className="w-full h-10 rounded-md border bg-background px-3" value={createForm.contextKind} onChange={(e) => setCreateForm({ ...createForm, contextKind: e.target.value })}>{["establishment", "sector", "activity", "workstation", "exposure_group"].map((value) => <option key={value}>{value}</option>)}</select></div>
          <div><Label>Atividade, posto ou grupo *</Label><Input required value={createForm.contextLabel} onChange={(e) => setCreateForm({ ...createForm, contextLabel: e.target.value })} /></div>
          <div><Label>Título *</Label><Input required value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} /></div>
          <div><Label>Escopo *</Label><Input required value={createForm.scope} onChange={(e) => setCreateForm({ ...createForm, scope: e.target.value })} /></div>
          <Button disabled={busy || !orgId} className="md:col-span-2">Criar rascunho</Button>
        </form></CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        {assessments.map((item) => <button key={item.assessment_id} onClick={() => setSelectedId(item.assessment_id)} className={`text-left rounded-xl border p-4 ${selectedId === item.assessment_id ? "border-primary bg-primary/5" : "border-border"}`}>
          <div className="flex justify-between gap-2"><strong>{item.title}</strong><Badge variant={item.status === "approved" ? "default" : "secondary"}>{item.status}</Badge></div>
          <p className="text-xs text-muted-foreground mt-1">{item.context_label} · v{item.version}</p>
          <p className="text-xs mt-2">{item.evidence_count} evidência(s) · {item.finding_count} achado(s) · {item.aet_trigger_count} gatilho(s) AET</p>
        </button>)}
      </div>

      {selected && <>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4" /> {selected.title}</CardTitle></CardHeader><CardContent className="space-y-3">
          <p className="text-sm">{selected.scope}</p>
          {selected.blockers.length > 0 && <ul className="text-sm text-amber-700 space-y-1">{selected.blockers.map((item) => <li key={item}>• {blockerLabels[item] ?? item}</li>)}</ul>}
          {nextStatus && <Button disabled={busy} onClick={() => run(() => advanceAepAssessment(selected.assessment_id, nextStatus, `Transição justificada para ${nextStatus}`), `Estado alterado para ${nextStatus}.`)}>{nextStatus === "approved" ? "Aprovar como revisor independente" : `Avançar para ${nextStatus}`}</Button>}
          {selected.content_sha256 && <p className="text-xs font-mono break-all text-muted-foreground">SHA-256: {selected.content_sha256}</p>}
        </CardContent></Card>

        {editable && <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" /> Evidência contextual</CardTitle></CardHeader><CardContent><form onSubmit={addEvidence} className="space-y-3">
            <div><Label>Método *</Label><select className="w-full h-10 rounded-md border bg-background px-3" value={evidenceForm.kind} onChange={(e) => setEvidenceForm({ ...evidenceForm, kind: e.target.value })}>{workEvidenceKinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
            <div><Label>Como foi conduzido *</Label><Input required value={evidenceForm.method} onChange={(e) => setEvidenceForm({ ...evidenceForm, method: e.target.value })} /></div>
            <div><Label>Referência da fonte/ata *</Label><Input required value={evidenceForm.sourceRef} onChange={(e) => setEvidenceForm({ ...evidenceForm, sourceRef: e.target.value })} /></div>
            <div><Label>Data *</Label><Input type="date" required value={evidenceForm.occurredAt} onChange={(e) => setEvidenceForm({ ...evidenceForm, occurredAt: e.target.value })} /></div>
            <div><Label>Síntese organizacional *</Label><Textarea required value={evidenceForm.summary} onChange={(e) => setEvidenceForm({ ...evidenceForm, summary: e.target.value })} /></div>
            <label className="flex gap-2 text-sm"><Checkbox checked={evidenceForm.confirmed} onCheckedChange={(value) => setEvidenceForm({ ...evidenceForm, confirmed: value === true })} /> Confirmo que não incluí nomes, relatos identificáveis, diagnóstico ou conteúdo individual sensível.</label>
            <Button disabled={busy || !evidenceForm.confirmed}>Registrar evidência</Button>
          </form></CardContent></Card>

          <Card><CardHeader><CardTitle>Achado contextual</CardTitle></CardHeader><CardContent><form onSubmit={addFinding} className="space-y-3">
            {([['hazard','Perigo/fator'],['generatingSource','Fonte geradora'],['circumstances','Circunstâncias'],['durationPattern','Duração'],['frequencyPattern','Frequência'],['exposedGroup','Grupo exposto'],['possibleHarm','Agravo possível — sem diagnóstico']] as const).map(([key,label]) => <div key={key}><Label>{label} *</Label><Input required value={findingForm[key]} onChange={(e) => setFindingForm({ ...findingForm, [key]: e.target.value })} /></div>)}
            <div><Label>Evidências vinculadas *</Label>{evidence.map((item) => <label key={item.evidence_id} className="flex gap-2 text-sm py-1"><Checkbox checked={findingForm.evidenceIds.includes(item.evidence_id)} onCheckedChange={(checked) => setFindingForm({ ...findingForm, evidenceIds: checked ? [...findingForm.evidenceIds, item.evidence_id] : findingForm.evidenceIds.filter((id) => id !== item.evidence_id) })} /> {item.evidence_kind}: {item.summary}</label>)}</div>
            <Button disabled={busy || findingForm.evidenceIds.length === 0}>Registrar achado</Button>
          </form></CardContent></Card>
        </div>}

        <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileWarning className="h-4 w-4" /> Gatilho de aprofundamento AET</CardTitle></CardHeader><CardContent><form onSubmit={addAet} className="grid gap-3 md:grid-cols-2">
          <div><Label>Tipo</Label><select className="w-full h-10 rounded-md border bg-background px-3" value={aetForm.triggerType} onChange={(e) => setAetForm({ ...aetForm, triggerType: e.target.value })}>{aetTriggerCatalog.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></div>
          <div><Label>Responsável *</Label><select required className="w-full h-10 rounded-md border bg-background px-3" value={aetForm.responsibleId} onChange={(e) => setAetForm({ ...aetForm, responsibleId: e.target.value })}><option value="">Selecione</option>{members.map((item) => <option key={item.user_id} value={item.user_id}>{item.full_name} · {item.role}</option>)}</select></div>
          <div><Label>Referência da indicação *</Label><Input required value={aetForm.sourceRef} onChange={(e) => setAetForm({ ...aetForm, sourceRef: e.target.value })} /></div>
          <div><Label>Prazo *</Label><Input type="date" required value={aetForm.dueDate} onChange={(e) => setAetForm({ ...aetForm, dueDate: e.target.value })} /></div>
          <div className="md:col-span-2"><Label>Justificativa técnica *</Label><Textarea required value={aetForm.rationale} onChange={(e) => setAetForm({ ...aetForm, rationale: e.target.value })} /></div>
          <Button disabled={busy || !aetForm.responsibleId} className="md:col-span-2"><Users className="h-4 w-4 mr-1" /> Registrar gatilho e criar tarefa</Button>
        </form></CardContent></Card>
      </>}
    </div>
  );
}
