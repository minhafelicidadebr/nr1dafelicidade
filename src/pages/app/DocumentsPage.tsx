// @ts-nocheck -- pre-existing type errors carried over from the original project
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import type { Database } from "@/lib/runtime/databaseTypes";
import { fetchMyOrg } from "@/lib/api/nr1";
import { toast } from "sonner";
import { FileText, Download, Printer, FileSignature, CheckCircle2, Circle, AlertCircle, ArrowRight, ArrowLeft, BookOpen, ShieldCheck, History, Hash, Presentation } from "lucide-react";
import { normalizeDocumentPrintPayload, openDocumentPrintView } from "@/lib/documents/printView";
import { downloadInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";
import { EmptyState } from "@/components/app/EmptyState";
import { JourneyStepper } from "@/components/app/JourneyStepper";
import { DOCUMENT_KIND_LABEL, DISCLAIMER_PRELIMINAR } from "@/lib/nr1/statusLabels";
import { getDriverLabel } from "@/lib/nr1/labels";
import AskStrategIAButton from "@/components/app/AskStrategIAButton";
import { DOC_TEMPLATES, type DocTemplate } from "@/data/documentTemplates";
import { fetchCyclePrivacySummaries, fetchSafeRiskScores } from "@/lib/api/privacyVault";
import { evaluateActionGovernance } from "@/lib/actions/actionGovernance";
import { evaluateControlEvidence } from "@/lib/controls/controlEvidence";
import {
  evaluateControlDivergence,
  highRiskThresholdFromBands,
  type ControlDivergence,
  type DivergenceControl,
} from "@/lib/controls/controlDivergence";
import { repositoryCriteriaDraft } from "@/data/criteriaPolicy";
import { getDimensionLabel } from "@/lib/nr1/labels";
import {
  buildOrientativeDocument,
  type OrientativeDocumentContext,
  type OrientativeTemplateId,
} from "@/lib/documents/orientativeTemplate";
import { ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID } from "@/data/orientativeDocumentTemplates";
import {
  loadBranding,
  saveBranding,
  estimateDataUrlBytes,
  MAX_LOGO_BYTES,
  type DocumentBranding,
} from "@/lib/documents/brandingConfig";
import { Q1_WORKER_PRESENTATION_SLIDES } from "@/data/q1Nr1PromotionCatalog";
import {
  buildMtePgrThirdMandatoryCriteriaDocumentMarkdown,
  buildMtePgrToPcmsoBridgeMarkdown,
  evaluateMteCipaFourMomentsProtocol,
  type MteCipaParticipationMomentId,
} from "@/lib/governance/mteCopsoqAuditEngine";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

type ReadinessItem = {
  key: string;
  label: string;
  ok: boolean;
  detail?: string;
  cta?: { label: string; to: string };
};

const HIGH_RISK_THRESHOLD = highRiskThresholdFromBands(repositoryCriteriaDraft.riskBands);

type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type DocumentRecord = Database["public"]["Tables"]["documents"]["Row"];
type CycleSummary = Pick<Database["public"]["Tables"]["cycles"]["Row"], "id" | "name" | "status">;
type ActionItem = Database["public"]["Tables"]["action_items"]["Row"];
type OrgControl = Database["public"]["Tables"]["org_controls"]["Row"];
type ControlCatalogSummary = Pick<
  Database["public"]["Tables"]["control_catalog"]["Row"],
  "id" | "title" | "dimension_key" | "evidence_strength" | "level"
>;
export default function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [cycles, setCycles] = useState<CycleSummary[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [generating, setGenerating] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<ReadinessItem[]>([]);
  const [showHistory, setShowHistory] = useState<Record<string, boolean>>({});
  const [signing, setSigning] = useState<string | null>(null);
  const [divergences, setDivergences] = useState<ControlDivergence[]>([]);
  const [orientativeContext, setOrientativeContext] = useState<OrientativeDocumentContext>({});
  const [branding, setBranding] = useState<DocumentBranding>({ accentColor: "#C9A24B", logoDataUrl: null });
  const [showSlides, setShowSlides] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [completedCipaMoments, setCompletedCipaMoments] = useState<MteCipaParticipationMomentId[]>([
    "m1_hazard_identification",
    "m2_risk_evaluation",
    "m3_prevention_measures_adoption",
    "m4_follow_up_and_cipa_feedback",
  ]);
  const [hasIso45001Cert, setHasIso45001Cert] = useState(false);
  const [cipaJustifiedRequestOpen, setCipaJustifiedRequestOpen] = useState(false);
  const [cipaRequestNote, setCipaRequestNote] = useState("");

  const load = useCallback(async () => {
    const o = await fetchMyOrg(); setOrg(o);
    if (!o) return;
    setBranding(loadBranding(o.id));
    const [d, c] = await Promise.all([
      supabase.from("documents").select("*").eq("organization_id", o.id).order("created_at", { ascending: false }),
      supabase.from("cycles").select("id,name,status").eq("organization_id", o.id).order("created_at", { ascending: false }),
    ]);
    setDocs(d.data ?? []); setCycles(c.data ?? []);
    if (c.data?.[0]) setSelected((current) => current || c.data[0].id);
  }, []);
  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const queryCycleId = searchParams.get("cycle_id");
    if (queryCycleId && cycles.some((cycle) => cycle.id === queryCycleId)) {
      setSelected(queryCycleId);
    }
  }, [cycles, searchParams]);

  // Agrupa por (cycle_id, kind) → versão atual + histórico
  const docGroups = useMemo(() => {
    const map = new Map<string, DocumentRecord[]>();
    for (const d of docs) {
      const k = `${d.cycle_id ?? "none"}::${d.kind}`;
      const arr = map.get(k) ?? [];
      arr.push(d);
      map.set(k, arr);
    }
    return Array.from(map.entries()).map(([key, arr]) => {
      const sorted = arr.sort((a, b) => (b.version ?? 1) - (a.version ?? 1));
      return { key, current: sorted[0], history: sorted.slice(1) };
    }).sort((a, b) => new Date(b.current.created_at).getTime() - new Date(a.current.created_at).getTime());
  }, [docs]);

  useEffect(() => {
    if (!org) return;
    (async () => {
      const unitsP = supabase.from("units").select("id", { count: "exact", head: true }).eq("organization_id", org.id);
      const cycleP = fetchCyclePrivacySummaries(org.id);
      const riskP = selected ? fetchSafeRiskScores({ cycleId: selected }) : Promise.resolve([]);
      const actP = selected ? supabase.from("action_items").select("*").eq("cycle_id", selected) : null;
      const ctlP = supabase.from("org_controls").select("*").eq("organization_id", org.id);
      const catP = supabase.from("control_catalog").select("id,title,dimension_key,evidence_strength,level");
      // Divergência de eficácia considera todos os ciclos fechados da org (não só o selecionado).
      const orgRiskP = fetchSafeRiskScores({ organizationId: org.id });

      const [u, summaries, riskRows, a, ctl, cat, orgRisks] = await Promise.all([unitsP, cycleP, riskP, actP, ctlP, catP, orgRiskP]);
      const selectedSummary = summaries.find((summary) => summary.cycle_id === selected);
      const respN = selectedSummary?.response_count ?? 0;
      const hasKRisk = riskRows.length > 0;
      const actions = a?.data ?? [];
      const actionGovernance = actions.map(evaluateActionGovernance);
      const readyActions = actionGovernance.filter((item) => item.readyForDocument).length;
      const activeActions = actions.filter((item) => item.status !== "cancelled").length;
      const controls = ctl.data ?? [];
      const activeControls = controls.filter((item) => item.status !== "cancelled").length;
      const readyControls = controls
        .map((item) => evaluateControlEvidence(item))
        .filter((item) => item.canInformResidualRiskReview).length;

      const catalogById = new Map((cat.data ?? []).map((item) => [item.id, item]));
      const declaredControls: DivergenceControl[] = controls.map((control: OrgControl) => {
        const catalogItem = catalogById.get(control.catalog_id);
        return {
          catalogId: control.catalog_id,
          dimensionKey: catalogItem?.dimension_key ?? null,
          title: catalogItem?.title ?? "Controle",
          evidence: evaluateControlEvidence({
            status: control.status,
            notes: control.notes,
            catalogEvidenceStrength: catalogItem?.evidence_strength,
            catalogLevel: catalogItem?.level,
          }),
        };
      });
      const orgScores = orgRisks.map((s) => ({ dimension: s.dimension, riskLevel: s.risk_level }));
      setDivergences(evaluateControlDivergence(declaredControls, orgScores, { highRiskThreshold: HIGH_RISK_THRESHOLD }));

      const selectedCycle = cycles.find((cycle) => cycle.id === selected);
      setOrientativeContext({
        orgName: org?.name ?? null,
        cycleName: selectedCycle?.name ?? null,
        kMin: 5,
        responseCount: respN,
        kAnonymityMet: respN >= 5,
        riskCount: riskRows.length,
        activeActions,
        readyActions,
        activeControls,
        readyControls,
        controls: declaredControls.map((control) => ({
          title: control.title,
          status: controls.find((item) => item.catalog_id === control.catalogId)?.status ?? null,
          readyForReview: control.evidence.canInformResidualRiskReview,
        })),
      });

      setReadiness([
        { key: "org", label: "Empresa cadastrada", ok: !!org?.name, detail: org?.name, cta: { label: "Empresa", to: "/app/company" } },
        { key: "units", label: "Unidade/Setor definido", ok: (u.count ?? 0) > 0, detail: `${u.count ?? 0} unidade(s)`, cta: { label: "Unidades", to: "/app/units" } },
        { key: "cycle", label: "Ciclo com respostas (n≥5)", ok: respN >= 5, detail: `${respN} resposta(s)`, cta: { label: "Ciclos", to: "/app/cycles" } },
        { key: "risk", label: "Riscos computados com k-anonimato", ok: hasKRisk, detail: hasKRisk ? "Riscos elegíveis disponíveis" : "Computar/aguardar n≥5", cta: { label: "Riscos", to: "/app/risk" } },
        { key: "actions", label: "Ações criadas no plano", ok: activeActions > 0, detail: `${activeActions} ação(ões) ativa(s)`, cta: { label: "Ações", to: "/app/actions" } },
        { key: "action_governance", label: "Ações com evidência, KPI e revisão", ok: activeActions > 0 && readyActions === activeActions, detail: `${readyActions}/${activeActions} pronta(s) para documento`, cta: { label: "Ações", to: "/app/actions" } },
        { key: "controls", label: "Controles declarados", ok: activeControls > 0, detail: `${activeControls} controle(s) ativo(s)`, cta: { label: "Controles", to: "/app/controls" } },
        { key: "control_evidence", label: "Controles com evidência e revisão", ok: activeControls > 0 && readyControls === activeControls, detail: `${readyControls}/${activeControls} pronto(s) para revisão`, cta: { label: "Controles", to: "/app/controls" } },
      ]);
    })();
  }, [org, selected, cycles]);

  const blockingGen = useMemo(
    () => readiness.filter((r) => ["cycle", "risk"].includes(r.key) && !r.ok),
    [readiness],
  );
  const readyPct = useMemo(() => {
    if (!readiness.length) return 0;
    return Math.round((readiness.filter((r) => r.ok).length / readiness.length) * 100);
  }, [readiness]);

  async function generate(kind: "drps" | "action_plan" | "executive_summary") {
    if (!selected) return toast.error("Escolha um ciclo");
    if (blockingGen.length) return toast.error("Pré-requisitos mínimos não atendidos (ciclo n≥5 e riscos computados).");
    setGenerating(kind);
    const { error } = await supabase.functions.invoke("generate-document", { body: { cycle_id: selected, kind } });
    setGenerating(null);
    if (error) return toast.error(error.message);
    toast.success("Documento preliminar gerado — requer revisão técnica.");
    load();
  }

  function download(doc: DocumentRecord) {
    const content = normalizeDocumentPrintPayload(doc.content);
    const md = content.markdown;
    const savedName = downloadInstitutionalInstructionalPdf({
      markdown: md,
      filename: `${doc.title.replace(/[^\w.-]+/g, "_")}_v${doc.version ?? 1}.pdf`,
      branding,
      meta: {
        title: doc.title,
        categoryKicker: `DOCUMENTO PRELIMINAR NR-1 · ${(DOCUMENT_KIND_LABEL[doc.kind] ?? doc.kind).toUpperCase()}`,
        orgName: content.meta.orgName ?? orientativeContext.orgName ?? org?.name ?? "Organização",
        cycleName: content.meta.cycleName ?? orientativeContext.cycleName ?? "Ciclo NR-1 / GRO",
        sector: content.meta.sector ?? org?.sector ?? null,
        sizeBand: content.meta.sizeBand ?? org?.size_band ?? null,
        kMin: content.meta.kAnonymity ?? orientativeContext.kMin ?? 5,
        responseCount: orientativeContext.responseCount ?? null,
        version: doc.version ?? 1,
        sha256: doc.sha256,
        createdAt: doc.created_at,
        signedAt: doc.assinado_em,
        signatureNote: doc.signature_note,
        highlights: [
          { label: "Respostas (k>=5)", value: String(orientativeContext.responseCount ?? "—") },
          { label: "Riscos elegíveis", value: String(orientativeContext.riskCount ?? "—") },
          { label: "Ações ativas", value: String(orientativeContext.activeActions ?? "—") },
          { label: "Controles declarados", value: String(orientativeContext.activeControls ?? "—") },
        ],
      },
    });
    toast.success(`PDF institucional gerado com Design Instrucional Gráfico (${savedName}).`);
  }
  function preview(doc: DocumentRecord) {
    openDocumentPrintView(doc, branding);
  }

  function applyBranding(next: DocumentBranding) {
    setBranding(next);
    const result = saveBranding(org?.id, next);
    if (!result.ok) {
      toast.error("Marca não salva: verifique cor e logo (máx. 500 kB, PNG/JPG/SVG).");
      return;
    }
    if (result.warnings.includes("accent_muito_claro")) {
      toast.message("Cor de acento clara — textos claros sobre a capa podem ficar pouco legíveis.");
    } else {
      toast.success("Marca do laudo salva (local).");
    }
  }

  function onLogoFile(file: File | null) {
    if (!file) { applyBranding({ ...branding, logoDataUrl: null }); return; }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Logo excede 500 kB. Use uma imagem menor.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      if (estimateDataUrlBytes(dataUrl) > MAX_LOGO_BYTES) {
        toast.error("Logo excede 500 kB após codificação.");
        return;
      }
      applyBranding({ ...branding, logoDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  function downloadOrientative(templateId: OrientativeTemplateId) {
    const template = ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID[templateId];
    const built = buildOrientativeDocument(template, orientativeContext);
    if (!built.safety.ok) {
      toast.error("Rascunho bloqueado por checagem de segurança de conteúdo. Contate o suporte técnico.");
      return;
    }
    const savedName = downloadInstitutionalInstructionalPdf({
      markdown: built.markdown,
      filename: built.filename.replace(/\.md$/i, ".pdf"),
      branding,
      meta: {
        title: template.title,
        subtitle: template.summary,
        categoryKicker: "MODELO ORIENTATIVO & DESIGN INSTRUCIONAL GRÁFICO · NR-1 CAP. 1.5",
        orgName: orientativeContext.orgName ?? org?.name ?? "Organização",
        cycleName: orientativeContext.cycleName ?? "Ciclo NR-1 / GRO",
        sector: org?.sector ?? null,
        sizeBand: org?.size_band ?? null,
        kMin: orientativeContext.kMin ?? 5,
        responseCount: orientativeContext.responseCount ?? null,
        version: 1,
        highlights: [
          { label: "Amostra Coletiva", value: `${orientativeContext.responseCount ?? 0} resp. (k>=5)` },
          { label: "Riscos Computados", value: String(orientativeContext.riskCount ?? 0) },
          { label: "Ações no Plano", value: `${orientativeContext.readyActions ?? 0}/${orientativeContext.activeActions ?? 0}` },
          { label: "Controles Ativos", value: `${orientativeContext.readyControls ?? 0}/${orientativeContext.activeControls ?? 0}` },
        ],
      },
    });
    toast.success(`PDF orientativo baixado com Design Instrucional Gráfico (${savedName}) — requer revisão técnica.`);
  }

  async function signDocument(doc: DocumentRecord) {
    if (doc.assinado_em) return;
    const note = window.prompt(
      `Confirmar revisão técnica de "${doc.title}" (NR-1 §1.5.7).\nOpcional: parecer do responsável (SST/SESMT).`,
      "",
    );
    if (note === null) return;
    setSigning(doc.id);
    const { error } = await supabase
      .rpc("review_document", {
        _document_id: doc.id,
        _signature_note: note.trim() || null,
      });
    setSigning(null);
    if (error) toast.error("Não foi possível registrar a revisão técnica.");
    else { toast.success("Revisão técnica registrada com timestamp auditável."); load(); }
  }

  const cipaEvaluation = useMemo(
    () =>
      evaluateMteCipaFourMomentsProtocol({
        completedMoments: completedCipaMoments,
        basicGroNotionsProvidedToWorkers: true,
        twoWayCommunicationChannelActive: true,
        cipaFormallyConsulted: completedCipaMoments.includes("m4_follow_up_and_cipa_feedback"),
        cipaOrWorkerJustifiedReviewRequested: cipaJustifiedRequestOpen,
        cipaRequestJustificationNote: cipaRequestNote,
      }),
    [completedCipaMoments, cipaJustifiedRequestOpen, cipaRequestNote],
  );

  function toggleCipaMoment(momentId: MteCipaParticipationMomentId) {
    setCompletedCipaMoments((prev) =>
      prev.includes(momentId) ? prev.filter((m) => m !== momentId) : [...prev, momentId],
    );
  }

  function downloadMteThirdMandatoryPgrCriteriaDoc() {
    const md = buildMtePgrThirdMandatoryCriteriaDocumentMarkdown({
      orgName: orientativeContext.orgName ?? org?.name ?? "Organização",
      cycleName: orientativeContext.cycleName ?? "Ciclo NR-1 / GRO",
      hasIso45001Certification: hasIso45001Cert,
      kMin: orientativeContext.kMin ?? 5,
    });
    downloadInstitutionalInstructionalPdf({
      markdown: md,
      filename: `3o_documento_obrigatorio_pgr_criterios_gro_nr1_${new Date().toISOString().slice(0, 10)}.pdf`,
      branding,
      meta: {
        title: "3º Documento Mínimo Obrigatório do PGR — Critérios de Avaliação de Riscos e Tomada de Decisão no GRO",
        subtitle:
          "Fundamento normativo: NR-1 subitem 1.5.4.4.2.2 e Manual de Interpretação do Cap. 1.5 da NR-1 (MTE, 2026 — Cap. 4, Cap. 11 e Cap. 13).",
        categoryKicker: "3º DOCUMENTO MÍNIMO DO PGR · NR-1 SUBITEM 1.5.4.4.2.2 · GUIA MTE 2026",
        orgName: orientativeContext.orgName ?? org?.name ?? "Organização",
        cycleName: orientativeContext.cycleName ?? "Ciclo NR-1 / GRO",
        sector: org?.sector ?? null,
        sizeBand: org?.size_band ?? null,
        kMin: orientativeContext.kMin ?? 5,
        responseCount: orientativeContext.responseCount ?? null,
        version: 1,
        normativeBasis: "NR-1 item 1.5.4.4.2.2 · Guia MTE 2026 Cap. 4/11/13 · Matriz AIHA 5×5 (S×P) · ISO 45003",
        highlights: [
          { label: "3º Doc Mínimo PGR", value: "Item 1.5.4.4.2.2" },
          { label: "Matriz de Risco", value: "AIHA 5×5 (S×P)" },
          { label: "Trava Privacidade", value: `k >= ${orientativeContext.kMin ?? 5}` },
          { label: "Ciclo Revisão GRO", value: hasIso45001Cert ? "Até 3 anos (ISO)" : "Até 2 anos (NR-1)" },
        ],
      },
    });
    toast.success("3º Documento Mínimo Obrigatório do PGR (Critérios do GRO — item 1.5.4.4.2.2) exportado em PDF 5 estrelas!");
  }

  function downloadMtePgrToPcmsoBridgeDoc() {
    const md = buildMtePgrToPcmsoBridgeMarkdown({
      orgName: orientativeContext.orgName ?? org?.name ?? "Organização",
      cycleName: orientativeContext.cycleName ?? "Ciclo NR-1 / GRO",
      responseCount: orientativeContext.responseCount ?? 0,
      kMin: orientativeContext.kMin ?? 5,
      highRiskDimensions: divergences.map((d) => ({
        dimensionLabel: getDimensionLabel(d.dimension),
        riskLevel: d.riskLevel,
      })),
    });
    downloadInstitutionalInstructionalPdf({
      markdown: md,
      filename: `ponte_pgr_pcmso_nr7_${new Date().toISOString().slice(0, 10)}.pdf`,
      branding,
      meta: {
        title: "Ponte Técnica e Insumo Formal do PGR para Elaboração e Atualização do PCMSO (NR-7)",
        subtitle:
          "Fundamento normativo: NR-1 subitem 1.5.5.1.1 alínea 'c' e Manual Oficial MTE 2026 (Cap. 12.3, p. 81) — Vigilância da Saúde Coletiva.",
        categoryKicker: "PONTE TÉCNICA PGR <-> PCMSO (NR-7) · NR-1 ITEM 1.5.5.1.1 'C' · MTE 2026",
        orgName: orientativeContext.orgName ?? org?.name ?? "Organização",
        cycleName: orientativeContext.cycleName ?? "Ciclo NR-1 / GRO",
        sector: org?.sector ?? null,
        sizeBand: org?.size_band ?? null,
        kMin: orientativeContext.kMin ?? 5,
        responseCount: orientativeContext.responseCount ?? null,
        version: 1,
        normativeBasis: "NR-1 subitem 1.5.5.1.1 'c' · NR-7 (PCMSO) · Guia MTE 2026 Cap. 12.3 (p. 81)",
        highlights: [
          { label: "Base Normativa", value: "NR-1 1.5.5.1.1 'c'" },
          { label: "Programa Destino", value: "PCMSO (NR-7)" },
          { label: "Amostra Coletiva", value: `${orientativeContext.responseCount ?? 0} resp. (k>=5)` },
          { label: "Dimensões Prioritárias", value: String(divergences.length) },
        ],
      },
    });
    toast.success("Ponte Técnica PGR ↔ PCMSO (NR-7 / NR-1 item 1.5.5.1.1 'c') exportada em PDF 5 estrelas!");
  }

  return (
    <div className="space-y-6">
      <JourneyStepper />

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="py-5 space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <FileSignature className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Documentos preliminares NR-1</h2>
                <Badge variant="outline" className="text-[10px]">Requer validação do responsável técnico</Badge>
                <Nr1LearningScienceInfoModal
                  topicId="documents_pgr_trio_cipa"
                  customLabel="Os 3 Documentos Mínimos do PGR, CIPA e PCMSO"
                />
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Gere registros rastreáveis para apoiar GRO/PGR, revisão técnica e tomada de decisão.
                Documentos preliminares não substituem laudo final nem conformidade automática.
              </p>
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/app/risk">Voltar para Riscos</Link></Button>
          </div>
        </CardContent>
      </Card>

      {searchParams.get("source") === "nexo" && searchParams.get("driver_key") && (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="py-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">
                Rascunho técnico para revisão · {getDriverLabel(searchParams.get("driver_key") ?? "", "pt-BR")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use esta rota para preparar narrativa revisável: driver priorizado, base de evidência agregada, escopo analisado,
              dimensões relacionadas, ações aprovadas, responsáveis, método de acompanhamento, data de reavaliação e limites da interpretação.
              O texto final não deve afirmar conformidade automática.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Checklist de prontidão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Prontidão documental</span>
            <Badge variant="outline">{readyPct}% completo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {readiness.map((it) => (
            <div key={it.key} className="flex items-center justify-between gap-3 border border-border rounded-lg p-2.5 bg-card/40">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {it.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm">{it.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{it.detail ?? ""}</p>
                </div>
              </div>
              {!it.ok && it.cta && (
                <Button asChild size="sm" variant="ghost" className="h-7"><Link to={it.cta.to}>{it.cta.label}<ArrowRight className="h-3 w-3" /></Link></Button>
              )}
            </div>
          ))}
          {blockingGen.length > 0 && (
            <p className="text-xs text-amber-400 flex items-center gap-1.5 pt-1">
              <AlertCircle className="h-3.5 w-3.5" />Geração bloqueada até atender: ciclo com n≥5 e riscos computados.
            </p>
          )}
          <div className="pt-1">
            <AskStrategIAButton
              question="O que falta para gerar o documento?"
              intent="overview.next"
              label="Perguntar à Sra. EstratégIA o que falta"
            />
          </div>
        </CardContent>
      </Card>

      {/* Controles declarados × risco remanescente (consultivo, não altera escore) */}
      {divergences.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              Controles declarados × risco remanescente ({divergences.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Insumo para o documento: controle declarado para uma dimensão que permanece em risco alto
              em ciclo fechado (k≥5). Sinal consultivo para revisão técnica — não altera o escore.
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

      {/* Modo Apresentação Executiva de Devolutiva em Slides (NR-01 1.5.3.3.c) */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Presentation className="h-4 w-4 text-primary" />
                Apresentação Executiva de Devolutiva para Trabalhadores e Lideranças (Slides NR-01)
                <Badge variant="outline" className="text-[10px]">NR-01 item 1.5.3.3.c · Participação e Comunicação</Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground max-w-3xl">
                Projete os resultados coletivos (com proteção de k-anonimato k≥5), fatores de proteção e compromissos de ação na fonte diretamente em reuniões de CIPA, SESMT, lideranças e equipes, ou baixe o roteiro estruturado.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadOrientative("worker_presentation")}
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Baixar Roteiro (.pdf)
              </Button>
              <Button
                size="sm"
                onClick={() => setShowSlides((prev) => !prev)}
              >
                <Presentation className="h-3.5 w-3.5 mr-1" />
                {showSlides ? "Fechar Modo Apresentação" : "Abrir Apresentação (6 Slides)"}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showSlides && (
          <CardContent className="space-y-3">
            {(() => {
              const slide = Q1_WORKER_PRESENTATION_SLIDES[slideIndex] ?? Q1_WORKER_PRESENTATION_SLIDES[0];
              return (
                <div className="rounded-xl border border-primary/30 bg-background/90 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2 flex-wrap border-b border-border/60 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                        Slide {slide.number} de {Q1_WORKER_PRESENTATION_SLIDES.length} · {orientativeContext.orgName ?? "Organização"} · {orientativeContext.cycleName ?? "Ciclo NR-1"}
                      </span>
                      <h3 className="text-lg font-semibold mt-0.5">{slide.title}</h3>
                      <p className="text-xs text-muted-foreground">{slide.subtitle}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      Respostas agregadas: {orientativeContext.responseCount ?? 0} (k≥{orientativeContext.kMin ?? 5})
                    </Badge>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {slide.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg border border-border/70 bg-card/50 p-3 text-xs text-muted-foreground">
                    <strong className="text-foreground/90">Nota do facilitador (RH / SST / Liderança):</strong> {slide.speakerNote}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {Q1_WORKER_PRESENTATION_SLIDES.map((s, idx) => (
                        <button
                          key={s.number}
                          type="button"
                          onClick={() => setSlideIndex(idx)}
                          className={`h-7 px-2.5 rounded text-xs font-medium transition-colors ${
                            idx === slideIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s.number}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={slideIndex === 0}
                        onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                      >
                        <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Anterior
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={slideIndex === Q1_WORKER_PRESENTATION_SLIDES.length - 1}
                        onClick={() => setSlideIndex((i) => Math.min(Q1_WORKER_PRESENTATION_SLIDES.length - 1, i + 1))}
                      >
                        Próximo <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        )}
      </Card>

      {/* Consolidação MTE 2026: 3 Documentos Mínimos do PGR (Cap. 4/13) + 4 Momentos CIPA (Cap. 6) + Ponte PGR ↔ PCMSO/NR-7 (Cap. 12.3) */}
      <Card className="border-primary/30 bg-card/60" data-testid="mte-2026-consolidation-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Consolidação Regulatória Manual Oficial MTE 2026 (GRO / PGR / CIPA / PCMSO)
                <Badge variant="outline" className="text-[10px]">
                  3 Documentos Mínimos do PGR · Cap. 4, 6, 12.3 e 13
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground max-w-3xl">
                Audite os 4 momentos obrigatórios de participação dos trabalhadores e consulta à CIPA (Figura 7, p. 23),
                exporte o <strong>3º Documento Mínimo Obrigatório do PGR (Critérios do GRO — item 1.5.4.4.2.2)</strong> e a
                <strong> Ponte Técnica PGR ↔ PCMSO (NR-7 — item 1.5.5.1.1 &quot;c&quot;)</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={downloadMteThirdMandatoryPgrCriteriaDoc}
                data-testid="btn-download-pgr-3rd-criteria-doc"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                3º Doc PGR: Critérios do GRO (.pdf)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadMtePgrToPcmsoBridgeDoc}
                data-testid="btn-download-pgr-pcmso-bridge"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Ponte PGR ↔ PCMSO NR-7 (.pdf)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Protocolo dos 4 Momentos Essenciais de Participação e Consulta à CIPA (Cap. 6, Fig. 7, p. 23) */}
          <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Protocolo dos 4 Momentos Essenciais de Participação dos Trabalhadores e Consulta à CIPA (Cap. 6 · Figura 7, p. 23)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {cipaEvaluation.legalBasis}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  cipaEvaluation.compliantWithCap6
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/40"
                }`}
              >
                {cipaEvaluation.completionPct}% concluído ·{" "}
                {cipaEvaluation.compliantWithCap6 ? "Cap. 6 Atendido" : "Em registro"}
              </Badge>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {([
                [
                  "m1_hazard_identification",
                  "1º Momento · Identificação de Perigos",
                  "Escuta dos especialistas do saber-fazer (COPSOQ II + AEP NR-17).",
                ],
                [
                  "m2_risk_evaluation",
                  "2º Momento · Avaliação de Riscos",
                  "Contextualização das exigências reais da atividade por GES/GHE.",
                ],
                [
                  "m3_prevention_measures_adoption",
                  "3º Momento · Adoção de Medidas",
                  "Co-construção do Plano de Ação e Drivers do Playbook 2.0.",
                ],
                [
                  "m4_follow_up_and_cipa_feedback",
                  "4º Momento · Acompanhamento & CIPA",
                  "Consulta formal à CIPA (1.5.3.3 'a') e comunicação em mão dupla.",
                ],
              ] as const).map(([momentId, title, desc]) => {
                const active = completedCipaMoments.includes(momentId);
                return (
                  <button
                    key={momentId}
                    type="button"
                    onClick={() => toggleCipaMoment(momentId)}
                    className={`text-left rounded-lg border p-3 transition-colors ${
                      active
                        ? "border-emerald-500/40 bg-emerald-500/10"
                        : "border-border bg-card/40 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-xs font-semibold text-foreground">{title}</span>
                      {active ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Configuração de Periodicidade ISO 45001 (2 vs 3 anos) + Gatilho 1.5.4.4.6 "f" (Solicitação CIPA/Trabalhadores) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hasIso45001Cert}
                  onChange={(e) => setHasIso45001Cert(e.target.checked)}
                  className="rounded border-input"
                />
                <span>
                  Organização possui certificação SGSST / ISO 45001 válida (amplia prazo máximo de revisão periódica de 2 para 3 anos — item 1.5.4.4.6.1)
                </span>
              </label>

              <Button
                type="button"
                size="sm"
                variant={cipaJustifiedRequestOpen ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => setCipaJustifiedRequestOpen((prev) => !prev)}
              >
                {cipaJustifiedRequestOpen
                  ? "Ocultar Solicitação CIPA (1.5.4.4.6 'f')"
                  : "Registrar Solicitação de Revisão pela CIPA / Trabalhadores (1.5.4.4.6 'f')"}
              </Button>
            </div>

            {cipaJustifiedRequestOpen && (
              <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Gatilho Obrigatório de Revisão Imediata — NR-1 subitem 1.5.4.4.6 alínea &quot;f&quot; (Cap. 11.7, Figura 15, p. 72)
                </p>
                <input
                  type="text"
                  value={cipaRequestNote}
                  onChange={(e) => setCipaRequestNote(e.target.value)}
                  placeholder="Descreva a justificativa apresentada pela CIPA ou pelos trabalhadores (ex.: alteração de ritmo ou nova demanda no setor)…"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                />
                {cipaEvaluation.triggersImmediateReview15446f && (
                  <p className="text-[11px] text-amber-300 font-medium">
                    ✓ Gatilho 1.5.4.4.6 &quot;f&quot; ativado: a avaliação de risco do GES correspondente deve ser revista imediatamente sem aguardar o ciclo bienal/trienal.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Biblioteca de modelos orientativos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Biblioteca de modelos orientativos
            <Badge variant="outline" className="text-[10px]">Documentos preliminares e entregáveis de última milha</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          {DOC_TEMPLATES.map((t) => (
            <TemplateCard
              key={t.id}
              tpl={t}
              onGenerate={t.generateKind ? () => generate(t.generateKind!) : undefined}
              busy={!!t.generateKind && generating === t.generateKind}
              disabled={!!generating || (t.generateKind ? blockingGen.length > 0 : false)}
              onDownloadOrientative={downloadOrientative}
            />
          ))}
        </CardContent>
      </Card>

      {/* Geração */}
      <Card>
        <CardHeader><CardTitle className="text-base">Gerar documento preliminar</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={selected} onChange={(e) => setSelected(e.target.value)}>
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="grid md:grid-cols-3 gap-2">
            <DocCard
              title={DOCUMENT_KIND_LABEL.drps}
              description="Diagnóstico preliminar de riscos psicossociais (subsídio para PGR)."
              disabled={!!generating || blockingGen.length > 0}
              busy={generating === "drps"}
              onGenerate={() => generate("drps")}
            />
            <DocCard
              title={DOCUMENT_KIND_LABEL.action_plan}
              description="Consolida ações priorizadas, responsáveis, prazos e evidências."
              disabled={!!generating || blockingGen.length > 0}
              busy={generating === "action_plan"}
              onGenerate={() => generate("action_plan")}
            />
            <DocCard
              title={DOCUMENT_KIND_LABEL.executive_summary}
              description="Visão de liderança e comitê — riscos, ações, próximos passos."
              disabled={!!generating || blockingGen.length > 0}
              busy={generating === "executive_summary"}
              onGenerate={() => generate("executive_summary")}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">{DISCLAIMER_PRELIMINAR}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marca do laudo (white-label)</CardTitle>
          <p className="text-xs text-muted-foreground">
            Cor de acento e logo aplicam-se apenas à capa, cabeçalhos e rodapé do PDF.
            Zonas de risco, matriz e status mantêm cores fixas por padrão científico. Configuração local, por organização.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="brand-accent">Cor de acento</label>
            <div className="flex items-center gap-2">
              <input
                id="brand-accent"
                type="color"
                value={branding.accentColor}
                onChange={(e) => applyBranding({ ...branding, accentColor: e.target.value })}
                className="h-9 w-14 cursor-pointer rounded border border-input bg-background"
                aria-label="Cor de acento do laudo"
              />
              <code className="text-[11px] text-muted-foreground">{branding.accentColor}</code>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground" htmlFor="brand-logo">Logo (PNG/JPG/SVG, até 500 kB)</label>
            <input
              id="brand-logo"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => onLogoFile(e.target.files?.[0] ?? null)}
              className="block text-xs file:mr-2 file:rounded file:border file:border-input file:bg-background file:px-2 file:py-1 file:text-xs"
            />
          </div>
          {branding.logoDataUrl && (
            <div className="flex items-center gap-2">
              <img src={branding.logoDataUrl} alt="Prévia do logo" className="h-9 max-w-[120px] object-contain" />
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => applyBranding({ ...branding, logoDataUrl: null })}>
                Remover logo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Documentos gerados ({docGroups.length})</span>
            <Badge variant="outline" className="text-[10px] font-normal">Versionados · SHA-256 · Imutáveis (NR-1 §1.5.7)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {docGroups.map(({ key, current: d, history }) => {
            const isOpen = !!showHistory[key];
            return (
              <div key={key} className="border border-border rounded-lg bg-card/40">
                <div className="flex justify-between items-start gap-3 p-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate">{d.title}</p>
                        <Badge variant="outline" className="text-[10px]">v{d.version ?? 1}</Badge>
                        {d.assinado_em ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-300 border-emerald-500/40 gap-1">
                            <ShieldCheck className="h-3 w-3" />Revisado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-300 border-amber-500/40">
                            Pendente de revisão
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">{DOCUMENT_KIND_LABEL[d.kind] ?? d.kind}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(d.created_at).toLocaleString("pt-BR")}
                        {d.assinado_em && <> · revisado em {new Date(d.assinado_em).toLocaleString("pt-BR")}</>}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground/80 flex items-center gap-1 truncate">
                        <Hash className="h-2.5 w-2.5 shrink-0" />
                        {d.sha256 ? `${d.sha256.slice(0, 24)}…` : "hash indisponível"}
                      </p>
                      {d.signature_note && (
                        <p className="text-[11px] text-emerald-300/90 italic">"{d.signature_note}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => preview(d)}><Printer className="h-4 w-4" />PDF</Button>
                      <Button size="sm" variant="ghost" onClick={() => download(d)}><Download className="h-4 w-4" /></Button>
                    </div>
                    {!d.assinado_em && (
                      <Button size="sm" className="h-7 text-xs gap-1" onClick={() => signDocument(d)} disabled={signing === d.id}>
                        <ShieldCheck className="h-3 w-3" />
                        {signing === d.id ? "Registrando…" : "Registrar revisão técnica"}
                      </Button>
                    )}
                    {history.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowHistory((s) => ({ ...s, [key]: !s[key] }))}
                        className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 underline-offset-2 hover:underline"
                      >
                        <History className="h-3 w-3" />
                        {isOpen ? "ocultar" : "ver"} histórico ({history.length})
                      </button>
                    )}
                  </div>
                </div>
                {isOpen && history.length > 0 && (
                  <div className="border-t border-border/60 px-3 py-2 space-y-1.5 bg-background/40">
                    {history.map((h) => (
                      <div key={h.id} className="flex items-center justify-between text-[11px] text-muted-foreground gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge variant="outline" className="text-[9px]">v{h.version ?? 1}</Badge>
                          <span className="truncate">{new Date(h.created_at).toLocaleString("pt-BR")}</span>
                          <span className="font-mono text-[10px] truncate">{(h.sha256 ?? "").slice(0, 12)}…</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => preview(h)}><Printer className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => download(h)}><Download className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {docs.length === 0 && (
            <EmptyState
              icon={FileSignature}
              title="Nenhum documento gerado"
              description="Atenda à prontidão documental acima e gere DRPS preliminar, Plano de Ação ou Resumo Executivo. Todos são rastreáveis, versionados e exportáveis."
              hints={[
                "DRPS subsidia o PGR — revisão SST/SESMT obrigatória.",
                "Cada nova geração cria uma versão imutável com hash SHA-256.",
              ]}
              primary={{ label: "Ver ações", to: "/app/actions" }}
              secondary={{ label: "Computar riscos", to: "/app/risk" }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DocCard({ title, description, onGenerate, busy, disabled }:
  { title: string; description: string; onGenerate: () => void; busy: boolean; disabled: boolean }) {
  return (
    <div className="border border-border rounded-lg p-3 bg-card/40 flex flex-col gap-2">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground flex-1">{description}</p>
      <Button size="sm" onClick={onGenerate} disabled={disabled}>
        {busy ? "Gerando…" : "Gerar"}
      </Button>
    </div>
  );
}

function TemplateCard({ tpl, onGenerate, busy, disabled, onDownloadOrientative }:
  {
    tpl: DocTemplate;
    onGenerate?: () => void;
    busy: boolean;
    disabled: boolean;
    onDownloadOrientative?: (id: OrientativeTemplateId) => void;
  }) {
  const statusPill =
    tpl.status === "gerado" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" :
      tpl.status === "modelo" ? "bg-primary/15 text-primary border-primary/40" :
        "bg-amber-500/15 text-amber-300 border-amber-500/40";
  const statusLabel =
    tpl.status === "gerado" ? "Gerável" :
      tpl.status === "modelo" ? "Modelo orientativo" :
        "Pendente";
  return (
    <div className="border border-border rounded-lg p-3 bg-card/40 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-tight">{tpl.title}</p>
        <Badge variant="outline" className={`text-[10px] shrink-0 ${statusPill}`}>{statusLabel}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">{tpl.purpose}</p>
      <div className="text-[11px] text-muted-foreground space-y-0.5">
        <p><strong className="text-foreground/80">Quando usar:</strong> {tpl.whenToUse}</p>
        <p><strong className="text-foreground/80">Pré-requisitos:</strong> {tpl.prerequisites.join(" · ")}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {onGenerate && (
          <Button size="sm" className="h-7 text-xs" onClick={onGenerate} disabled={disabled}>
            {busy ? "Gerando…" : "Gerar documento"}
          </Button>
        )}
        {tpl.orientativeId && onDownloadOrientative && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => onDownloadOrientative(tpl.orientativeId!)}
          >
            <Download className="h-3.5 w-3.5" />Baixar rascunho (.pdf)
          </Button>
        )}
        <AskStrategIAButton
          question={tpl.askQuestion}
          intent={tpl.askIntent}
          label="Perguntar à Sra. EstratégIA"
        />
      </div>
    </div>
  );
}
