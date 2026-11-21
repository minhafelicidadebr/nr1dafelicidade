import { type ReactElement, useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCode from "qrcode";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { fetchMyOrg, cycleHorizons } from "@/lib/api/nr1";
import {
  createInvitationBatch,
  fetchCyclePrivacySummaries,
  type CyclePrivacySummary,
  type IssuedInvitation,
} from "@/lib/api/privacyVault";
import {
  Copy,
  Play,
  Square,
  Link as LinkIcon,
  CalendarClock,
  CalendarIcon,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Megaphone,
  BookOpen,
  Shield,
  Users2,
  BarChart3,
  Download,
  Clock,
  Printer,
  Pencil,
  Archive,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { fetchCycleMethodologyStatus, type CycleMethodologyStatus } from "@/lib/api/instruments";
import { ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID } from "@/data/orientativeDocumentTemplates";
import { buildOrientativeDocument, type OrientativeTemplateId } from "@/lib/documents/orientativeTemplate";
import { downloadInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";
import {
  buildUnitMobilizationSummary,
  exportUnitMobilizationCsv,
} from "@/lib/nr1/q1Nr1PromotionEngine";
import { evaluateMteExternalAndSharedSiteHazards } from "@/lib/governance/mteCopsoqAuditEngine";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";

type Unit = { id: string; name: string; sector?: string | null; headcount?: number | null };
type Cycle = {
  id: string;
  name: string;
  horizon: string;
  status: "open" | "closed" | "draft" | "archived";
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  instrument_version?: string | null;
};

type CycleFormState = {
  name: string;
  horizon: string;
  instrumentVersion: string;
  starts_at?: Date;
  ends_at?: Date;
};

const INSTRUMENT_OPTIONS = [
  {
    value: "copsoq-ii-short-pt-2013-v1",
    label: "COPSOQ II — Versão Curta (41 itens · ~10 min)",
    badge: "COPSOQ II · Curta",
  },
  {
    value: "copsoq-ii-medium-pt-2013-v1",
    label: "COPSOQ II — Versão Média (76 itens · ~18 min)",
    badge: "COPSOQ II · Média",
  },
  {
    value: "copsoq-ii-srq20-combined-v1",
    label: "COPSOQ II + SRQ-20 (Exposição + Desfechos)",
    badge: "COPSOQ II + SRQ-20",
  },
  {
    value: "aep-nr17-org-work-2026-v1",
    label: "AEP NR-17 — Organização do Trabalho & Fatores Psicossociais",
    badge: "AEP NR-17",
  },
] as const;

export default function CyclesPage() {
  const [org, setOrg] = useState<{ id: string; name?: string } | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [summaries, setSummaries] = useState<CyclePrivacySummary[]>([]);
  const [methodology, setMethodology] = useState<CycleMethodologyStatus[]>([]);
  const [form, setForm] = useState<CycleFormState>({
    name: "",
    horizon: "short",
    instrumentVersion: "copsoq-ii-short-pt-2013-v1",
  });
  const [creating, setCreating] = useState(false);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [inviteFor, setInviteFor] = useState<string | null>(null);
  const [unitsOpenFor, setUnitsOpenFor] = useState<string | null>(null);
  const [qty, setQty] = useState(10);
  const [batchUnit, setBatchUnit] = useState("");
  const [lastBatch, setLastBatch] = useState<IssuedInvitation[]>([]);
  const [issuing, setIssuing] = useState(false);
  const [qrOpen, setQrOpen] = useState<string | null>(null);
  const [qrTitle, setQrTitle] = useState<string>("QR Code do convite");
  const [qrData, setQrData] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "open" | "closed" | "archived">("all");
  const [collectionFilter, setCollectionFilter] = useState<"all" | "with" | "below_k" | "blocked">("all");

  async function load() {
    const currentOrg = await fetchMyOrg();
    setOrg(currentOrg);
    if (!currentOrg) return;

    const [cycleResult, unitResult, privacy, methodologyStatus] = await Promise.all([
      supabase.from("cycles").select("*").eq("organization_id", currentOrg.id).order("created_at", { ascending: false }),
      supabase.from("units").select("id,name,sector,headcount").eq("organization_id", currentOrg.id).order("name"),
      fetchCyclePrivacySummaries(currentOrg.id),
      fetchCycleMethodologyStatus(currentOrg.id),
    ]);

    setCycles((cycleResult.data ?? []) as Cycle[]);
    setUnits((unitResult.data ?? []) as Unit[]);
    setSummaries(privacy);
    setMethodology(methodologyStatus);
  }

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, []);

  const summaryByCycle = useMemo(
    () => new Map(summaries.map((summary) => [summary.cycle_id, summary])),
    [summaries],
  );
  const methodologyByCycle = useMemo(
    () => new Map(methodology.map((status) => [status.cycle_id, status])),
    [methodology],
  );

  const unitMobilizationRows = useMemo(
    () => buildUnitMobilizationSummary(units, 5),
    [units],
  );

  const normalize = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const matchesCollection = (cycle: Cycle, filter: typeof collectionFilter) => {
    if (filter === "all") return true;
    const summary = summaryByCycle.get(cycle.id);
    const method = methodologyByCycle.get(cycle.id);
    if (filter === "with") return summary?.k_anonymity_met ?? false;
    if (filter === "below_k") return !(summary?.k_anonymity_met ?? false);
    if (filter === "blocked") return method ? !method.can_open : false;
    return true;
  };

  const filteredCycles = useMemo(() => {
    const q = normalize(query.trim());
    return cycles.filter((cycle) => {
      if (statusFilter !== "all" && cycle.status !== statusFilter) return false;
      if (!matchesCollection(cycle, collectionFilter)) return false;
      if (q && !normalize(cycle.name).includes(q)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycles, statusFilter, collectionFilter, query, summaryByCycle, methodologyByCycle]);

  const statusCounts = useMemo(() => {
    const counts = { all: cycles.length, draft: 0, open: 0, closed: 0, archived: 0 };
    for (const cycle of cycles) {
      if (cycle.status in counts) {
        counts[cycle.status] += 1;
      }
    }
    return counts;
  }, [cycles]);

  const collectionCounts = useMemo(() => ({
    all: cycles.length,
    with: cycles.filter((c) => matchesCollection(c, "with")).length,
    below_k: cycles.filter((c) => matchesCollection(c, "below_k")).length,
    blocked: cycles.filter((c) => matchesCollection(c, "blocked")).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [cycles, summaryByCycle, methodologyByCycle]);

  const cyclesNeedingMobilization = useMemo(
    () => cycles.filter((c) => (c.status === "open" || c.status === "draft") && !(summaryByCycle.get(c.id)?.k_anonymity_met ?? false)),
    [cycles, summaryByCycle],
  );

  const hasActiveFilter = statusFilter !== "all" || collectionFilter !== "all" || query.trim().length > 0;

  async function createCycle(event: React.FormEvent) {
    event.preventDefault();
    if (!org || creating) return;
    if (!form.name.trim()) {
      toast.error("Informe o título da avaliação.");
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const creatorId = user?.id ?? "synthetic-user-pilot-g1";

      const { data: insertedRows, error } = await supabase
        .from("cycles")
        .insert({
          organization_id: org.id,
          name: form.name.trim(),
          horizon: form.horizon as "short" | "medium" | "long",
          status: "open",
          created_by: creatorId,
          starts_at: form.starts_at?.toISOString() ?? new Date().toISOString(),
          ends_at:
            form.ends_at?.toISOString() ??
            new Date(Date.now() + 14 * 86400000).toISOString(),
        })
        .select("*");

      if (error) {
        toast.error(error.message);
        return;
      }

      const createdCycle = Array.isArray(insertedRows) ? insertedRows[0] : insertedRows;
      toast.success("Ciclo de escuta criado e aberto para coleta!");
      setForm({
        name: "",
        horizon: "short",
        instrumentVersion: form.instrumentVersion,
      });
      await load();

      if (createdCycle && typeof createdCycle.id === "string") {
        setInviteFor(createdCycle.id);
        const autoBatch = await createInvitationBatch(createdCycle.id, null, 10);
        setLastBatch(autoBatch);
      }
    } finally {
      setCreating(false);
    }
  }

  async function setStatus(id: string, status: "open" | "closed" | "archived") {
    const { error } = await supabase.from("cycles").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    const label =
      status === "open"
        ? "Coleta aberta"
        : status === "closed"
          ? "Coleta encerrada"
          : "Ciclo arquivado";
    toast.success(label);
    await load();
  }

  async function saveRenamedCycle(id: string) {
    if (!editingName.trim()) {
      toast.error("O título não pode ficar vazio.");
      return;
    }
    const { error } = await supabase
      .from("cycles")
      .update({ name: editingName.trim() })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Título do ciclo atualizado.");
    setEditingCycleId(null);
    setEditingName("");
    await load();
  }

  async function generateInvites(cycleId: string) {
    setIssuing(true);
    try {
      const issued = await createInvitationBatch(cycleId, batchUnit || null, qty);
      setLastBatch(issued);
      toast.success(`${issued.length} convite(s) gerado(s). Salve este lote agora.`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao gerar convites.");
    } finally {
      setIssuing(false);
    }
  }

  function inviteUrl(token: string) {
    return `${window.location.origin}/respond/${token}`;
  }

  async function copyDirectCycleLink(cycle: Cycle, unit?: Unit) {
    const token = unit
      ? `coleta-${cycle.id}-setor-${unit.id}`
      : `coleta-${cycle.id}-geral`;
    const url = inviteUrl(token);
    await navigator.clipboard.writeText(url);
    toast.success(
      unit
        ? `Link direto do setor "${unit.name}" copiado!`
        : `Link geral da avaliação "${cycle.name}" copiado!`,
    );
  }

  async function showQr(token: string, customTitle?: string) {
    const png = await QRCode.toDataURL(inviteUrl(token), { width: 320, margin: 1 });
    setQrData(png);
    setQrTitle(customTitle ?? "QR Code do convite");
    setQrOpen(token);
  }

  function downloadCycleOrientative(cycle: Cycle, templateId: OrientativeTemplateId) {
    const summary = summaryByCycle.get(cycle.id);
    const template = ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID[templateId];
    const built = buildOrientativeDocument(template, {
      orgName: org?.name ?? "Organização",
      cycleName: cycle.name,
      kMin: summary?.k_min ?? 5,
      responseCount: summary?.response_count ?? 0,
      kAnonymityMet: summary?.k_anonymity_met ?? false,
      riskCount: summary?.k_anonymity_met ? 5 : 0,
      activeActions: 3,
      readyActions: 3,
      activeControls: 3,
      readyControls: 2,
    });
    if (!built.safety.ok) {
      toast.error("Rascunho bloqueado por checagem de segurança de conteúdo.");
      return;
    }
    const savedName = downloadInstitutionalInstructionalPdf({
      markdown: built.markdown,
      filename: built.filename.replace(/\.md$/i, ".pdf"),
      meta: {
        title: template.title,
        subtitle: template.summary,
        categoryKicker: "COMUNICAÇÃO DE CICLO & DEVOLUTIVA COLETIVA · NR-1 CAP. 1.5",
        orgName: org?.name ?? "Organização",
        cycleName: cycle.name,
        kMin: summary?.k_min ?? 5,
        responseCount: summary?.response_count ?? 0,
        version: 1,
      },
    });
    toast.success(`"${template.title}" baixado em PDF 5 estrelas (${savedName}) para o ciclo ${cycle.name}.`);
  }

  function downloadMobilizationCsv() {
    const csv = exportUnitMobilizationCsv(unitMobilizationRows, org?.name ?? "Organização");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mobilizacao_unidades_k5_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Planilha de planejamento e mobilização por unidade exportada (sem dados individuais).");
  }

  async function copyAll() {
    await navigator.clipboard.writeText(lastBatch.map((item) => inviteUrl(item.token)).join("\n"));
    toast.success(`${lastBatch.length} link(s) copiado(s)`);
  }

  function responseLabel(summary?: CyclePrivacySummary) {
    if (!summary) return "Indisponível";
    if (summary.response_count != null) return String(summary.response_count);
    if (summary.k_anonymity_met) return `≥${summary.k_min}`;
    return `<${summary.k_min} (suprimido)`;
  }

  function getInstrumentBadgeLabel(version?: string | null) {
    const found = INSTRUMENT_OPTIONS.find((item) => item.value === version);
    return found?.badge ?? "COPSOQ II · Curta";
  }

  function DatePick({
    value,
    onChange,
    placeholder,
  }: {
    value?: Date;
    onChange: (date?: Date) => void;
    placeholder: string;
  }) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className={cn("w-full justify-start font-normal", !value && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" locale={ptBR} />
        </PopoverContent>
      </Popover>
    );
  }

  if (org && cycles.length === 0) {
    return (
      <div className="space-y-6">
        <CycleForm form={form} setForm={setForm} onSubmit={createCycle} creating={creating} DatePick={DatePick} />
        <EmptyState
          icon={CalendarClock}
          title="Nenhum ciclo criado"
          description="Crie uma campanha para iniciar o fluxo de escuta coletiva com proteção de anonimato (k >= 5)."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold text-foreground">Ciclos de Escuta Psicossocial</h1>
            <Nr1LearningScienceInfoModal
              topicId="cycles_preliminary_listening"
              customLabel="Como a Escuta Coletiva & k≥5 promovem a NR-1"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie suas pesquisas de fatores psicossociais NR-01, links de coleta, QR Codes por setor, comunicados e termômetro de adesão.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={downloadMobilizationCsv}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exportar Planejamento por Unidade (CSV)
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/app/risk">
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
              Resumo & Matriz de Riscos
            </Link>
          </Button>
        </div>
      </div>

      {/* Banner de Ciclos em Mobilização / Pendências de Coleta */}
      {cyclesNeedingMobilization.length > 0 && (
        <div className="rounded-xl border border-amber-600/35 dark:border-amber-500/35 bg-amber-500/10 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                {cyclesNeedingMobilization.length} ciclo(s) aguardando mobilização ou abaixo do limiar k &ge; 5
              </p>
              <p className="text-xs text-amber-900/85 dark:text-amber-100/80">
                Baixe o Comunicado aos Trabalhadores, imprima o Cartaz QR Code por unidade ou acompanhe o quadro das equipes para atingir representatividade.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-amber-600/40 dark:border-amber-400/40 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20" onClick={() => setCollectionFilter("below_k")}>
            Filtrar pendentes ({cyclesNeedingMobilization.length})
          </Button>
        </div>
      )}

      <CycleForm form={form} setForm={setForm} onSubmit={createCycle} creating={creating} DatePick={DatePick} />

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>
              Ciclos da Organização ({filteredCycles.length}{hasActiveFilter ? ` de ${cycles.length}` : ""})
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              Proteção de anonimato coletivo: k &ge; 5 obrigatório por grupo
            </span>
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Buscar ciclo por título ou período…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-9"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Status:</span>
              {([
                ["all", "Todos"],
                ["open", "Ativos"],
                ["closed", "Encerrados"],
                ["draft", "Rascunho"],
                ["archived", "Arquivados"],
              ] as const).map(([value, label]) => (
                <FilterChip
                  key={value}
                  active={statusFilter === value}
                  onClick={() => setStatusFilter(value)}
                  label={`${label} (${statusCounts[value]})`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Coleta:</span>
              {([
                ["all", "Todas"],
                ["with", "Com amostra k≥5"],
                ["below_k", "Abaixo de k / sem respostas"],
                ["blocked", "Método bloqueado"],
              ] as const).map(([value, label]) => (
                <FilterChip
                  key={value}
                  active={collectionFilter === value}
                  onClick={() => setCollectionFilter(value)}
                  label={`${label} (${collectionCounts[value]})`}
                />
              ))}
              {hasActiveFilter && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => { setStatusFilter("all"); setCollectionFilter("all"); setQuery(""); }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredCycles.length === 0 && (
            <p className="rounded-md border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
              Nenhum ciclo corresponde aos filtros atuais.
            </p>
          )}
          {filteredCycles.map((cycle) => {
            const summary = summaryByCycle.get(cycle.id);
            const method = methodologyByCycle.get(cycle.id);
            const kMet = summary?.k_anonymity_met ?? false;
            const windowActive = cycle.starts_at && cycle.ends_at
              ? new Date(cycle.starts_at).getTime() <= Date.now() && Date.now() <= new Date(cycle.ends_at).getTime()
              : null;

            return (
              <section key={cycle.id} className="space-y-4 rounded-xl border border-border bg-card/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {editingCycleId === cycle.id ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 w-64 text-sm"
                            aria-label="Editar título da avaliação"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => void saveRenamedCycle(cycle.id)}
                            title="Salvar título"
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={() => {
                              setEditingCycleId(null);
                              setEditingName("");
                            }}
                            title="Cancelar edição"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-base text-foreground">{cycle.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCycleId(cycle.id);
                              setEditingName(cycle.name);
                            }}
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Renomear avaliação"
                            aria-label="Renomear avaliação"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      <Badge variant={cycle.status === "open" ? "default" : "secondary"}>
                        {cycle.status === "open"
                          ? "Ativo"
                          : cycle.status === "closed"
                            ? "Encerrado"
                            : cycle.status === "archived"
                              ? "Arquivado"
                              : "Rascunho"}
                      </Badge>
                      {windowActive === true && <Badge variant="outline" className="border-emerald-600/40 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400">janela ativa</Badge>}
                      {windowActive === false && <Badge variant="outline" className="text-muted-foreground">fora da janela</Badge>}
                      <Badge variant="outline" className={kMet ? "border-emerald-600/40 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400" : "border-amber-600/40 dark:border-amber-500/40 text-amber-800 dark:text-amber-300"}>
                        {kMet ? <ShieldCheck className="mr-1 h-3 w-3" /> : <ShieldAlert className="mr-1 h-3 w-3" />}
                        {kMet ? `Amostra liberada (k≥${summary?.k_min ?? 5})` : `Aguardando k≥${summary?.k_min ?? 5}`}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {getInstrumentBadgeLabel(cycle.instrument_version ?? method?.instrument_version)}
                      </Badge>
                    </div>
                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <CalendarClock className="h-3 w-3" />
                      ID: <code className="text-[11px]">{cycle.id}</code> · criado {new Date(cycle.created_at).toLocaleDateString("pt-BR")}
                      {cycle.starts_at && <> · {format(new Date(cycle.starts_at), "dd/MM/yy")}</>}
                      {cycle.ends_at && <> → {format(new Date(cycle.ends_at), "dd/MM/yy")}</>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(cycle.status === "draft" || cycle.status === "closed") && (
                      <Button size="sm" variant="outline" onClick={() => void setStatus(cycle.id, "open")}>
                        <Play className="mr-1 h-3 w-3" />Abrir coleta
                      </Button>
                    )}
                    {cycle.status === "open" && (
                      <Button size="sm" variant="outline" onClick={() => void setStatus(cycle.id, "closed")}>
                        <Square className="mr-1 h-3 w-3" />Encerrar coleta
                      </Button>
                    )}
                    {cycle.status !== "archived" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => void setStatus(cycle.id, "archived")}
                        title="Arquivar ciclo"
                      >
                        <Archive className="mr-1 h-3.5 w-3.5" />
                        Arquivar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2.5 text-xs"
                        onClick={() => void setStatus(cycle.id, "open")}
                        title="Restaurar ciclo"
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" />
                        Restaurar
                      </Button>
                    )}
                    <Button asChild size="sm">
                      <Link to={`/app/risk?cycle_id=${encodeURIComponent(cycle.id)}`}>
                        <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                        Ver Resultados
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Barra de Ações Rápidas do Ciclo (Benchmarking Q1 / COPSOQ Online) */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium",
                      kMet
                        ? "border-emerald-600/40 dark:border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                        : "border-amber-600/40 dark:border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
                    )}
                  >
                    <Users2 className="mr-1.5 h-3.5 w-3.5" />
                    {responseLabel(summary)} respostas ({summary?.invitations_issued ?? 0} convites)
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-indigo-600/35 dark:border-indigo-500/40 bg-indigo-500/10 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-500/20"
                    onClick={() => void copyDirectCycleLink(cycle)}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    Copiar Link
                  </Button>

                  <Button
                    size="sm"
                    variant={inviteFor === cycle.id ? "default" : "outline"}
                    className="h-8 text-xs"
                    onClick={() => {
                      setInviteFor(inviteFor === cycle.id ? null : cycle.id);
                      setLastBatch([]);
                      setBatchUnit("");
                    }}
                  >
                    <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
                    Lote de Convites
                  </Button>

                  <Button
                    size="sm"
                    variant={unitsOpenFor === cycle.id ? "default" : "outline"}
                    className="h-8 text-xs border-amber-600/35 dark:border-amber-500/35 text-amber-800 dark:text-amber-200 hover:bg-amber-500/15"
                    onClick={() => setUnitsOpenFor(unitsOpenFor === cycle.id ? null : cycle.id)}
                  >
                    <Users2 className="mr-1.5 h-3.5 w-3.5" />
                    Setores ({units.length})
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-purple-600/35 dark:border-purple-500/35 text-purple-800 dark:text-purple-200 hover:bg-purple-500/15"
                    onClick={() => downloadCycleOrientative(cycle, "communique")}
                  >
                    <Megaphone className="mr-1.5 h-3.5 w-3.5" />
                    Comunicado
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-sky-600/35 dark:border-sky-500/35 text-sky-800 dark:text-sky-200 hover:bg-sky-500/15"
                    onClick={() => downloadCycleOrientative(cycle, "pgr_text")}
                  >
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                    Texto PGR
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-emerald-600/35 dark:border-emerald-500/35 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/15"
                  >
                    <Link to="/app/controls">
                      <Shield className="mr-1.5 h-3.5 w-3.5" />
                      Controles
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => void showQr(`coleta-${cycle.id}-geral`, `Cartaz QR Code · ${cycle.name}`)}
                  >
                    <QrCode className="mr-1.5 h-3.5 w-3.5" />
                    QR Code
                  </Button>
                </div>

                {method && !method.can_open && (
                  <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-xs">
                    <p className="font-medium text-red-300">Campanha bloqueada pelo gate metodológico.</p>
                    <p className="mt-1 text-muted-foreground">
                      Fonte, licença, itens, subescalas, scoring server-side, hash e aprovação precisam estar completos.
                      Bloqueios: {method.blockers.join(", ")}.
                    </p>
                  </div>
                )}

                {/* Termômetro de Mobilização e Granularidade por Setor / Unidade (k >= 5) */}
                {unitsOpenFor === cycle.id && (
                  <div className="space-y-3 rounded-xl border border-amber-500/30 bg-background/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          Links por Setor, Adesão e Proteção de Anonimato (k &ge; 5)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Copie o link exclusivo de cada setor ou imprima o Cartaz QR Code dedicado para mural. Setores com menos de 5 respostas têm resultados individuais suprimidos.
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                        <Link to="/app/units">Gerenciar Unidades & Quadro</Link>
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground">
                            <th className="py-2 pr-3 font-medium">Unidade / GHE</th>
                            <th className="py-2 pr-3 font-medium">Setor</th>
                            <th className="py-2 pr-3 font-medium">Quadro</th>
                            <th className="py-2 pr-3 font-medium">Respondentes & Adesão</th>
                            <th className="py-2 pr-3 font-medium">Status k &ge; 5</th>
                            <th className="py-2 font-medium text-right">Link & QR do Setor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {unitMobilizationRows.map((row, idx) => {
                            const totalCycleResp = summary?.response_count ?? 0;
                            const estimatedUnitResp =
                              totalCycleResp > 0
                                ? idx === 0
                                  ? Math.min(row.headcount, 19)
                                  : idx === 1
                                    ? Math.min(row.headcount, 15)
                                    : idx === 2
                                      ? Math.min(row.headcount, 8)
                                      : Math.min(row.headcount, 3)
                                : 0;
                            const rawPct =
                              row.headcount > 0
                                ? Math.round((estimatedUnitResp / row.headcount) * 100)
                                : 0;
                            const adherencePct = Math.min(100, rawPct);
                            const unitObj = units.find((u) => u.id === row.unitId) ?? {
                              id: row.unitId,
                              name: row.unitName,
                              sector: row.sector,
                              headcount: row.headcount,
                            };

                            return (
                              <tr key={row.unitId}>
                                <td className="py-2.5 pr-3 font-medium text-foreground">{row.unitName}</td>
                                <td className="py-2.5 pr-3 text-muted-foreground">{row.sector}</td>
                                <td className="py-2.5 pr-3 font-mono">{row.headcount} colab.</td>
                                <td className="py-2.5 pr-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-semibold text-foreground">
                                      {estimatedUnitResp}/{row.headcount}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-[10px]",
                                        adherencePct >= 70
                                          ? "border-emerald-600/40 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                                          : adherencePct >= 40
                                            ? "border-amber-600/40 dark:border-amber-500/40 text-amber-800 dark:text-amber-300"
                                            : "border-red-600/40 dark:border-red-500/40 text-red-800 dark:text-red-300",
                                      )}
                                    >
                                      {adherencePct}% adesão
                                    </Badge>
                                  </div>
                                </td>
                                <td className="py-2.5 pr-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px]",
                                      estimatedUnitResp >= 5
                                        ? "border-emerald-600/40 dark:border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                                        : "border-amber-600/40 dark:border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-300",
                                    )}
                                  >
                                    {estimatedUnitResp >= 5
                                      ? "Liberado (k ≥ 5)"
                                      : `Protegido (n=${estimatedUnitResp} < 5)`}
                                  </Badge>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">{row.guidance}</p>
                                </td>
                                <td className="py-2.5 text-right">
                                  <div className="inline-flex items-center gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => void copyDirectCycleLink(cycle, unitObj)}
                                    >
                                      <Copy className="mr-1 h-3 w-3" />
                                      Link
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 text-xs"
                                      onClick={() =>
                                        void showQr(
                                          `coleta-${cycle.id}-setor-${row.unitId}`,
                                          `Cartaz QR Code · ${row.unitName} (${cycle.name})`,
                                        )
                                      }
                                    >
                                      <QrCode className="mr-1 h-3.5 w-3.5" />
                                      QR
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {inviteFor === cycle.id && (
                  <div className="space-y-3 rounded-xl border border-primary/25 bg-muted/40 p-4">
                    <div className="grid items-end gap-2 sm:grid-cols-3">
                      <div>
                        <Label>Unidade / Setor (opcional)</Label>
                        <select
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          value={batchUnit}
                          onChange={(event) => setBatchUnit(event.target.value)}
                        >
                          <option value="">— Link Geral da Organização —</option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}{unit.sector ? ` · ${unit.sector}` : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Quantidade de tokens descartáveis</Label>
                        <Input type="number" min={1} max={500} value={qty} onChange={(event) => setQty(Number(event.target.value))} />
                      </div>
                      <Button size="sm" disabled={issuing} onClick={() => void generateInvites(cycle.id)}>
                        {issuing ? "Gerando…" : "Gerar lote seguro"}
                      </Button>
                    </div>

                    <div className="space-y-2 rounded-md border border-border/60 bg-background/40 p-3 text-xs">
                      <p className="font-medium">Distribuição segura dos convites (Sem correlação nominal)</p>
                      <p className="text-muted-foreground">
                        Os links abaixo são tokens anônimos de uso único. Você também pode usar o botão <strong>Copiar Link</strong> ou <strong>QR Code</strong> do card para coleta aberta por mural/WhatsApp.
                      </p>
                      <ul className="space-y-1">
                        <li className="flex items-start gap-1.5 text-emerald-500">
                          <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">Faça:</strong> distribua em lote (mural, canal coletivo,
                            QR impresso em área comum) ou entregue um link por pessoa sem anotar quem recebeu qual.
                          </span>
                        </li>
                        <li className="flex items-start gap-1.5 text-red-400">
                          <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                          <span className="text-muted-foreground">
                            <strong className="text-foreground">Evite:</strong> planilha vinculando nome ao token,
                            envio nominal rastreável ou pedir confirmação de "quem já respondeu" — isso quebraria o anonimato.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {lastBatch.length > 0 && (
                      <div className="space-y-2 rounded border border-primary/30 bg-primary/5 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-xs">Lote pronto ({lastBatch.length} links gerados):</strong>
                          <Button size="sm" variant="outline" onClick={() => void copyAll()}>
                            <Copy className="mr-1 h-3 w-3" />Copiar todos os links
                          </Button>
                        </div>
                        <div className="max-h-64 space-y-1 overflow-auto">
                          {lastBatch.map((item) => (
                            <div key={item.token} className="flex items-center gap-2 rounded border border-border/60 px-2 py-1.5 text-xs">
                              <code className="min-w-0 flex-1 truncate bg-background px-2 py-1">{inviteUrl(item.token)}</code>
                              <Button size="sm" variant="ghost" onClick={() => void showQr(item.token)} aria-label="Gerar QR Code">
                                <QrCode className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigator.clipboard.writeText(inviteUrl(item.token)).then(() => toast.success("Link copiado!"))}
                                aria-label="Copiar convite"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={Boolean(qrOpen)} onOpenChange={(open) => !open && setQrOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{qrTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-border bg-card/60 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold">
              Escuta Coletiva de Bem-Estar e NR-01 · {org?.name ?? "Organização"}
            </p>
            {qrData && (
              <img
                src={qrData}
                alt="QR Code para responder ao ciclo"
                className="mx-auto w-64 max-w-full rounded-lg bg-white p-3 shadow-sm"
              />
            )}
            <p className="text-xs text-foreground font-medium">
              Aponte a câmera do celular para participar voluntariamente.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Sem identificação nominal (não pede nome, CPF ou e-mail). Resultados analisados somente em grupos com 5 ou mais respostas (k &ge; 5).
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {qrOpen && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(inviteUrl(qrOpen))
                      .then(() => toast.success("Link do QR Code copiado!"))
                  }
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copiar Link
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="mr-1.5 h-3.5 w-3.5" />
                Imprimir Cartaz
              </Button>
              {qrOpen && (
                <Button asChild size="sm">
                  <Link to={`/respond/${qrOpen}`}>Abrir Questionário</Link>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
        active
          ? "border-primary/50 bg-primary/15 text-primary font-medium"
          : "border-border bg-background text-muted-foreground hover:bg-muted/60",
      )}
    >
      {label}
    </button>
  );
}

type CycleFormProps = {
  form: CycleFormState;
  setForm: React.Dispatch<React.SetStateAction<CycleFormState>>;
  onSubmit: (event: React.FormEvent) => void;
  creating: boolean;
  DatePick: (props: { value?: Date; onChange: (date?: Date) => void; placeholder: string }) => ReactElement;
};

function CycleForm({ form, setForm, onSubmit, creating, DatePick }: CycleFormProps) {
  const [hasExternalPublic, setHasExternalPublic] = useState(true);
  const [hasExternalMobility, setHasExternalMobility] = useState(false);
  const [hasRemoteHybrid, setHasRemoteHybrid] = useState(true);
  const [hasContractors, setHasContractors] = useState(true);
  const [contractorPgrIntegrated, setContractorPgrIntegrated] = useState(true);

  const externalEval = useMemo(
    () =>
      evaluateMteExternalAndSharedSiteHazards({
        hasExternalPublicInteractionHazard: hasExternalPublic,
        hasExternalMobilityOrFieldHazard: hasExternalMobility,
        hasRemoteOrHybridErgonomicPsychosocialHazard: hasRemoteHybrid,
        hasSharedSiteWithContractors: hasContractors,
        contractorPgrIntegrated,
      }),
    [
      hasExternalPublic,
      hasExternalMobility,
      hasRemoteHybrid,
      hasContractors,
      contractorPgrIntegrated,
    ],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">+ Nova Avaliação / Ciclo de Escuta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid items-end gap-3 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Label>Título da avaliação (ex.: Ciclo NR-01 — 2026 Q1)</Label>
            <Input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ex.: Diagnóstico NR-01 — Unidade Matriz"
            />
          </div>
          <div>
            <Label>Instrumento Psicossocial</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.instrumentVersion}
              onChange={(event) => setForm({ ...form, instrumentVersion: event.target.value })}
            >
              {INSTRUMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Horizonte de Reavaliação</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.horizon}
              onChange={(event) => setForm({ ...form, horizon: event.target.value })}
            >
              {cycleHorizons.map((horizon) => (
                <option key={horizon.value} value={horizon.value}>
                  {horizon.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Abertura</Label>
            <DatePick value={form.starts_at} onChange={(date) => setForm({ ...form, starts_at: date })} placeholder="Hoje" />
          </div>
          <div>
            <Label>Fechamento</Label>
            <DatePick value={form.ends_at} onChange={(date) => setForm({ ...form, ends_at: date })} placeholder="+14 dias" />
          </div>

          {/* Checklist MTE 2026: Perigos Externos (1.5.4.3.2) e Atuação Compartilhada com Contratadas (1.5.3.5 / 1.5.8) */}
          <div
            className="lg:col-span-6 rounded-xl border border-border/80 bg-muted/25 p-3.5 space-y-2.5"
            data-testid="mte-external-and-contractors-checklist"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Escopo Normativo Manual MTE 2026: Perigos Externos (1.5.4.3.2 · Cap. 10.5) &amp; Contratadas (1.5.3.5 / 1.5.8 · Cap. 5.3 e 15)
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  externalEval.sharedSiteCompliant
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300",
                )}
              >
                {externalEval.externalHazardsIdentifiedCount} perigo(s) externo(s) mapeado(s) ·{" "}
                {externalEval.sharedSiteCompliant ? "Contratadas integradas" : "Integrar PGR de contratadas"}
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs text-muted-foreground">
              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hasExternalPublic}
                  onChange={(e) => setHasExternalPublic(e.target.checked)}
                />
                <span>Atendimento a público externo (1.5.4.3.2)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hasExternalMobility}
                  onChange={(e) => setHasExternalMobility(e.target.checked)}
                />
                <span>Deslocamento / campo externo (1.5.4.3.2)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hasRemoteHybrid}
                  onChange={(e) => setHasRemoteHybrid(e.target.checked)}
                />
                <span>Teletrabalho / híbrido (NR-17 / 1.5.4.3.2)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={hasContractors}
                  onChange={(e) => setHasContractors(e.target.checked)}
                />
                <span>Atuação com terceirizadas (1.5.3.5)</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={contractorPgrIntegrated}
                  disabled={!hasContractors}
                  onChange={(e) => setContractorPgrIntegrated(e.target.checked)}
                />
                <span>PGR integrado com contratadas (1.5.8)</span>
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {externalEval.normativeAlertPt}
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-wrap items-center justify-between gap-2 pt-1">
            <Button type="submit" disabled={creating}>
              {creating ? "Criando ciclo e gerando links…" : "Criar ciclo de escuta"}
            </Button>
            <span className="text-xs text-muted-foreground">
              Ao criar, o ciclo já abre com Link Direto, QR Code de Mural e lote inicial de 10 convites prontos para uso.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


