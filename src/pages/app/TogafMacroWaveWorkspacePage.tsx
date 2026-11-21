import { useMemo, useState } from "react";
import { Link } from "@/lib/router/compat";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Compass,
  Copy,
  Download,
  FileCode2,
  GitBranch,
  Layers,
  MonitorSmartphone,
  Rocket,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";
import {
  buildExecutableSuperPrompt,
  gateBoundaryLabel,
  nodeStatusLabel,
  operationalChainStepLabel,
  saasPersonaLabel,
  superPromptModeLabel,
  togafDomainLabel,
  type Arc4BenchmarkReferenceId,
  type GateBoundaryCode,
  type OperationalChainStep,
  type SuperPromptCompilationMode,
  type TogafArchitectureDomain,
  type TogafNodeImplementationStatus,
  type ViewportProfileId,
} from "@/lib/governance/togafMacroWaveEngine";
import {
  arc4SuperWaveSummary,
  argo4HeroPromptCatalogSummary,
  copsoqManualAuditFindingsCatalog,
  macroWavePlanSummary,
  mte2026AuditRequirementsCatalog,
  mteCopsoqSystemicAuditEvaluation,
  nextWaveSaasPlanSummary,
  playbook2TotAuditSummary,
  postDocChairs,
  superPromptRubricSummary,
  togafAdmPhases,
  togafKnowledgeNodes,
  togafKnowledgeTreeSummary,
  togafMacroWavePolicy,
} from "@/data/togafMacroWaveSuperPrompt";
import {
  evaluateMteReviewTriggers,
  evaluateMteRiskMatrixIso45002,
  type MteControlHierarchyLevel,
  type MteImmediateReviewTriggerCode,
} from "@/lib/governance/mteCopsoqAuditEngine";
import {
  PLAYBOOK_2_INTERVENTION_RAG_CORPUS,
  retrievePlaybook2RagResponse,
} from "@/lib/governance/playbook2RagEngine";

const DOMAIN_FILTER_OPTIONS: readonly {
  readonly value: "all" | TogafArchitectureDomain;
  readonly label: string;
}[] = [
  { value: "all", label: "Todos os Domínios (4)" },
  { value: "business", label: "Negócio & SST" },
  { value: "data", label: "Dados & Privacidade" },
  { value: "application", label: "Aplicação & Motores" },
  { value: "technology", label: "Tecnologia & RLS" },
];

const CHAIN_FILTER_OPTIONS: readonly {
  readonly value: "all" | OperationalChainStep;
  readonly label: string;
}[] = [
  { value: "all", label: "Toda a Cadeia" },
  { value: "measure", label: "1. Medir" },
  { value: "contextualize", label: "2. Contextualizar" },
  { value: "evaluate", label: "3. Avaliar" },
  { value: "act", label: "4. Agir" },
  { value: "evidence", label: "5. Evidenciar" },
  { value: "reevaluate", label: "6. Reavaliar" },
  { value: "cross_cutting", label: "Transversal" },
];

const GATE_FILTER_OPTIONS: readonly {
  readonly value: "all" | GateBoundaryCode;
  readonly label: string;
}[] = [
  { value: "all", label: "Todas as Fronteiras" },
  { value: "G1_SYNTHETIC_READY", label: "Gate G1 · Prontidão Sintética" },
  { value: "G2_COMMITTEE", label: "Gate G2 · Submissão ao Comitê" },
];

const PROMPT_MODES: readonly SuperPromptCompilationMode[] = [
  "argo4_ecosystem_framework_sota",
  "argo4_saas_pilot_dashboard_wave",
  "argo4_playbook2_tot_rag",
  "mte_copsoq_forensic_audit",
  "zero_hallucination_tech_improvements",
  "arc4_superwave_design_services",
  "next_wave_saas_ux",
  "full_audit",
  "master_vertical_slice",
  "adversarial_multi_ai",
  "invariants_rls_guard",
];

const INVARIANT_SHORT_LABELS: Readonly<Record<number, string>> = {
  1: "Inv 1 · Respostas individuais inacessíveis à organização",
  2: "Inv 2 · Identidade, convite e resposta desacoplados",
  3: "Inv 3 · Barreira k >= 5 no servidor e em toda saída",
  4: "Inv 4 · Instrumento, subescalas, scoring e fontes versionados",
  5: "Inv 5 · Escore original preservado e separado de traduções",
  6: "Inv 6 · Sinal psicométrico não define risco sem trabalho real",
  7: "Inv 7 · Controle só reduz risco após eficácia comprovada",
  8: "Inv 8 · IA não diagnostica, classifica indivíduos ou assina laudos",
  9: "Inv 9 · Acolhimento e denúncia separados da pesquisa anônima",
  10: "Inv 10 · Participação de trabalhadores e CIPA rastreável",
  11: "Inv 11 · Fórmula, fonte, versão, autoria, override e hash auditáveis",
  12: "Inv 12 · Fluxos sensíveis sem confete, ranking ou coerção",
  13: "Inv 13 · Celular simples, acessibilidade e linguagem clara",
  14: "Inv 14 · Dados reais bloqueados até G3 e aprovações formais",
};

export default function TogafMacroWaveWorkspacePage() {
  const [domainFilter, setDomainFilter] = useState<"all" | TogafArchitectureDomain>("all");
  const [chainFilter, setChainFilter] = useState<"all" | OperationalChainStep>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    togafKnowledgeNodes[0]?.id ?? "",
  );

  const [gateFilter, setGateFilter] = useState<"all" | GateBoundaryCode>("all");
  const [selectedWaveId, setSelectedWaveId] = useState<string>(
    macroWavePlanSummary.slices[0]?.waveId ?? "ONDA-M1",
  );

  const [selectedSaasTrackId, setSelectedSaasTrackId] = useState<string>(
    nextWaveSaasPlanSummary.tracks[0]?.trackId ?? "ONDA-S1",
  );
  const [selectedViewportId, setSelectedViewportId] = useState<ViewportProfileId>("mobile_320");

  const [selectedArc4WaveId, setSelectedArc4WaveId] = useState<string>(
    arc4SuperWaveSummary.superWaves[0]?.superWaveId ?? "SUPERONDA-A1",
  );
  const [selectedBenchmarkId, setSelectedBenchmarkId] =
    useState<Arc4BenchmarkReferenceId>("linear_precision");

  const [selectedChairId, setSelectedChairId] = useState<string>(
    postDocChairs[0]?.id ?? "chair-1-togaf-systems",
  );

  const [selectedMteReqId, setSelectedMteReqId] = useState<string>(
    mte2026AuditRequirementsCatalog[0]?.id ?? "MTE-REQ-01",
  );
  const [simNrViolated, setSimNrViolated] = useState<boolean>(false);
  const [simControlHierarchy, setSimControlHierarchy] =
    useState<MteControlHierarchyLevel>("collective_engineering");
  const [simCipaRequestTrigger, setSimCipaRequestTrigger] = useState<boolean>(false);

  const [selectedPb2TotNodeId, setSelectedPb2TotNodeId] = useState<string>(
    playbook2TotAuditSummary.evaluatedNodes[0]?.auditNodeId ?? "TOT-PB2-01",
  );
  const [ragLabDriverSlug, setRagLabDriverSlug] = useState<string>("job_security");
  const [ragLabQuery, setRagLabQuery] = useState<string>(
    "Como reduzir insegurança laboral em reestruturações com citação primária?",
  );
  const [selectedHeroPromptDriverSlug, setSelectedHeroPromptDriverSlug] =
    useState<string>("management");

  const [promptMode, setPromptMode] = useState<SuperPromptCompilationMode>(
    "argo4_playbook2_tot_rag",
  );
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const filteredNodes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return togafKnowledgeNodes.filter((node) => {
      if (domainFilter !== "all" && node.architectureDomain !== domainFilter) {
        return false;
      }
      if (chainFilter !== "all" && node.chainStep !== chainFilter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const haystack = [
        node.code,
        node.title,
        node.guideQuestion,
        node.targetConsolidationState,
        ...node.verificationContracts,
        ...node.primaryArtifacts,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [domainFilter, chainFilter, searchQuery]);

  const activeNode = useMemo(() => {
    return (
      filteredNodes.find((n) => n.id === selectedNodeId) ??
      filteredNodes[0] ??
      togafKnowledgeNodes[0]
    );
  }, [filteredNodes, selectedNodeId]);

  const filteredSlices = useMemo(() => {
    return macroWavePlanSummary.slices.filter((slice) => {
      if (gateFilter !== "all" && slice.gateBoundary !== gateFilter) {
        return false;
      }
      return true;
    });
  }, [gateFilter]);

  const activeSlice = useMemo(() => {
    return (
      filteredSlices.find((s) => s.waveId === selectedWaveId) ??
      filteredSlices[0] ??
      macroWavePlanSummary.slices[0]
    );
  }, [filteredSlices, selectedWaveId]);

  const activeSaasTrack = useMemo(() => {
    return (
      nextWaveSaasPlanSummary.tracks.find((t) => t.trackId === selectedSaasTrackId) ??
      nextWaveSaasPlanSummary.tracks[0]
    );
  }, [selectedSaasTrackId]);

  const activeViewport = useMemo(() => {
    return (
      nextWaveSaasPlanSummary.viewportContracts.find(
        (v) => v.viewportId === selectedViewportId,
      ) ?? nextWaveSaasPlanSummary.viewportContracts[0]
    );
  }, [selectedViewportId]);

  const activeArc4Wave = useMemo(() => {
    return (
      arc4SuperWaveSummary.superWaves.find(
        (w) => w.superWaveId === selectedArc4WaveId,
      ) ?? arc4SuperWaveSummary.superWaves[0]
    );
  }, [selectedArc4WaveId]);

  const activeBenchmark = useMemo(() => {
    return (
      arc4SuperWaveSummary.benchmarks.find(
        (b) => b.benchmarkId === selectedBenchmarkId,
      ) ?? arc4SuperWaveSummary.benchmarks[0]
    );
  }, [selectedBenchmarkId]);

  const activeChair = useMemo(() => {
    return (
      postDocChairs.find((c) => c.id === selectedChairId) ?? postDocChairs[0]
    );
  }, [selectedChairId]);

  const activeMteReq = useMemo(() => {
    return (
      mte2026AuditRequirementsCatalog.find((r) => r.id === selectedMteReqId) ??
      mte2026AuditRequirementsCatalog[0]
    );
  }, [selectedMteReqId]);

  const simulatedMteMatrix = useMemo(() => {
    return evaluateMteRiskMatrixIso45002({
      consequenceMagnitudes: [2, 4, 3],
      specificNrRequirementViolated: simNrViolated,
      exposureDurationLevel: 4,
      activityDemandIntensityLevel: 4,
      highestImplementedControl: simControlHierarchy,
      controlMaintainedAndVerified: simControlHierarchy !== "ppe_only",
    });
  }, [simNrViolated, simControlHierarchy]);

  const simulatedMteReview = useMemo(() => {
    const activeTriggers: MteImmediateReviewTriggerCode[] = simCipaRequestTrigger
      ? ["f_worker_or_cipa_justified_request"]
      : [];
    return evaluateMteReviewTriggers({
      hasValidSgsstIso45001Certification: false,
      activeTriggers,
    });
  }, [simCipaRequestTrigger]);

  const activePb2TotNode = useMemo(() => {
    return (
      playbook2TotAuditSummary.evaluatedNodes.find(
        (n) => n.auditNodeId === selectedPb2TotNodeId,
      ) ?? playbook2TotAuditSummary.evaluatedNodes[0]
    );
  }, [selectedPb2TotNodeId]);

  const ragLabResult = useMemo(() => {
    return retrievePlaybook2RagResponse({
      driverSlug: ragLabDriverSlug,
      query: ragLabQuery,
    });
  }, [ragLabDriverSlug, ragLabQuery]);

  const activeHeroPromptSpec = useMemo(() => {
    return (
      argo4HeroPromptCatalogSummary.evaluatedSpecs.find(
        (s) => s.driverSlug === selectedHeroPromptDriverSlug,
      ) ?? argo4HeroPromptCatalogSummary.evaluatedSpecs[0]
    );
  }, [selectedHeroPromptDriverSlug]);

  const compiledPrompt = useMemo(() => {
    return buildExecutableSuperPrompt({
      mode: promptMode,
      policy: togafMacroWavePolicy,
      treeSummary: togafKnowledgeTreeSummary,
      waveSummary: macroWavePlanSummary,
      rubricSummary: superPromptRubricSummary,
      chairs: postDocChairs,
      nodes: togafKnowledgeNodes,
      slices: macroWavePlanSummary.slices,
      nextWaveSummary: nextWaveSaasPlanSummary,
      arc4Summary: arc4SuperWaveSummary,
    });
  }, [promptMode]);

  const compiledLinesCount = useMemo(
    () => compiledPrompt.split("\n").length,
    [compiledPrompt],
  );

  async function handleCopySuperPrompt() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(compiledPrompt);
      }
      setCopyFeedback("Super Prompt copiado para a área de transferência.");
    } catch {
      setCopyFeedback("Super Prompt preparado para seleção manual.");
    }
  }

  function handleDownloadSuperPrompt() {
    if (typeof document === "undefined") return;
    const savedName = downloadInstitutionalInstructionalPdf({
      markdown: compiledPrompt,
      filename: `super-prompt-togaf-nr1-${promptMode}.pdf`,
      meta: {
        title: `Manifesto Arquitetural TOGAF & Super Prompt NR-1 (${promptMode.toUpperCase()})`,
        subtitle:
          "Governança Sistêmica TOGAF ADM + Árvore do Conhecimento (ToT) + ARGO 4.0 + Conformidade NR-1 Cap. 1.5 / Guia MTE 2026.",
        categoryKicker: "ARQUITETURA CORPORATIVA TOGAF · SUPER PROMPT EXECUTÁVEL · NR-1",
        orgName: "Instituto Felicidade para Todos",
        cycleName: `Modo ${promptMode.toUpperCase()}`,
        kMin: 5,
        version: 1,
      },
    });
    setCopyFeedback(`Arquivo ${savedName} exportado em PDF com Design Instrucional Gráfico.`);
  }

  function handleResetNodeFilters() {
    setDomainFilter("all");
    setChainFilter("all");
    setSearchQuery("");
    setSelectedNodeId(togafKnowledgeNodes[0]?.id ?? "");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/app/governance"
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para Governança
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Política {togafMacroWavePolicy.policyId}</span>
          <span aria-hidden="true">·</span>
          <span>Versão {togafMacroWavePolicy.version}</span>
          <span aria-hidden="true">·</span>
          <span>Gate Aprovado: {togafMacroWavePolicy.approvedGate}</span>
        </div>
      </div>

      {/* Cabeçalho Executivo do Workspace */}
      <header className="space-y-4 rounded-lg border border-border bg-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Arquitetura Corporativa TOGAF (Fases Preliminar a H)</span>
              <span aria-hidden="true">·</span>
              <span>Próxima Onda Prática SaaS &amp; UX (320px–1440px)</span>
              <span aria-hidden="true">·</span>
              <span>Colegiado de {superPromptRubricSummary.totalChairs} Pós-Doutores</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground md:text-3xl [text-wrap:balance]">
              Cockpit da Árvore de Conhecimento TOGAF, Macro-Onda &amp; Super Prompt Pós-Doutoral
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Consolidação arquitetural e prática do{" "}
              <strong className="font-medium text-foreground">
                Sistema Operacional de Evidências e Intervenções para Trabalho Saudável
              </strong>
              . Une os 4 domínios do TOGAF, a seleção formal por Tree of Thoughts (ToT), as 6 trilhas práticas de transição SaaS, os contratos de responsividade universal (320px a 1440px) e a rubrica de auditoria cruzada multi-IA.
            </p>
          </div>

          <div
            role="status"
            className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-300 shrink-0"
          >
            <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Ambiente Sintético G0/G1 · Dados Reais Proibidos (No-Go até G3)</span>
          </div>
        </div>

        {/* Faixa de Métricas Tabulares */}
        <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-6">
          <ExecutiveKpi
            label="Nós TOGAF ADM"
            value={`${togafKnowledgeTreeSummary.implementedLocalCount}/${togafKnowledgeTreeSummary.totalNodes}`}
            detail={`${togafKnowledgeTreeSummary.syntheticReadinessPct}% prontidão sintética`}
          />
          <ExecutiveKpi
            label="Invariantes Protegidos"
            value={`${togafKnowledgeTreeSummary.coveredInvariants.length}/14`}
            detail="100% mapeados em contratos"
          />
          <ExecutiveKpi
            label="Cadeia Operacional"
            value="6/6 elos"
            detail={`U_ToT = ${macroWavePlanSummary.averageWinningUtility}/100`}
          />
          <ExecutiveKpi
            label="Trilhas Práticas SaaS"
            value={`${nextWaveSaasPlanSummary.totalTracks} trilhas`}
            detail={`U_SaaS = ${nextWaveSaasPlanSummary.averageWinningUtility}/100`}
          />
          <ExecutiveKpi
            label="Banca Pós-Doutoral"
            value={`${superPromptRubricSummary.totalChairs} cátedras`}
            detail="20+ anos · Lentes Popperianas"
          />
          <ExecutiveKpi
            label="Score Meta-Rubrica"
            value={`${superPromptRubricSummary.overallScorePct}%`}
            detail="10 dimensões (soma 100%)"
          />
        </div>
      </header>

      {/* SEÇÃO ARGO 4.0: AUDITORIA ToT & LABORATÓRIO RAG ZERO-ALUCINAÇÃO — WORK WELLBEING PLAYBOOK 2.0 */}
      <section
        aria-labelledby="section-playbook2-tot-rag"
        className="space-y-4 rounded-lg border border-border bg-card p-5 md:p-6 arc-surface-precision arc-hairline-top"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-primary">
              ARGO 4.0 · Auditoria ToT &amp; Skill RAG Zero-Alucinação · Work Wellbeing Playbook 2.0 (Oxford &amp; WWM, 2025)
            </p>
            <h2
              id="section-playbook2-tot-rag"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Árvore de Conhecimento ToT &amp; Laboratório RAG Citação Estrita (6 Pilares DRIVER · 16 Drivers Ativos · CC BY-NC-ND 4.0)
            </h2>
            <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Auditoria sistêmica via Tree of Thoughts (<span className="font-mono">U_PB2 = {playbook2TotAuditSummary.averageWinningTotUtility}/100</span>) do documento anexo{" "}
              <strong className="font-medium text-foreground">
                Work Wellbeing Playbook 2.0 (Regier et al., 2025)
              </strong>
              , cobrindo os 6 pilares <span className="font-mono font-semibold text-primary">DRIVER</span>, os 4 novos drivers 2.0 (<em>Job Security, Employee Voice, Autonomy e Workload Pressures</em>), os 2 drivers em roadmap 2026 (<em>Leadership e Operational Design</em>) e o motor RAG determinístico sem alucinação de IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-muted-foreground">
            <span>Pilares DRIVER: {playbook2TotAuditSummary.totalPillars}/6</span>
            <span aria-hidden="true">·</span>
            <span>Drivers Ativos: {playbook2TotAuditSummary.totalActiveDrivers} (+{playbook2TotAuditSummary.totalRoadmapDrivers} Roadmap)</span>
            <span aria-hidden="true">·</span>
            <span>Citações Primárias: {playbook2TotAuditSummary.totalPrimaryCitations}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">U_PB2: {playbook2TotAuditSummary.averageWinningTotUtility}/100</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Coluna Esquerda: 4 Nós da Auditoria Tree of Thoughts (ToT) do Playbook 2.0 */}
          <div className="space-y-3 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">
                Nós da Árvore de Conhecimento ToT (Auditoria Sistêmica Playbook 2.0)
              </p>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                Equação: U_PB2(b) = V(b) × (0.30·F_doc + 0.25·G_rag + 0.20·C_norm + 0.15·E_ux + 0.10·R_resp)
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {playbook2TotAuditSummary.evaluatedNodes.map((node) => {
                const isSelected = activePb2TotNode?.auditNodeId === node.auditNodeId;
                return (
                  <button
                    key={node.auditNodeId}
                    type="button"
                    onClick={() => setSelectedPb2TotNodeId(node.auditNodeId)}
                    aria-pressed={isSelected}
                    className={`min-h-11 rounded-md border p-3 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary arc-tactile-card ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums">
                      <span className="font-semibold text-primary">{node.auditNodeId}</span>
                      <span className="text-emerald-400">
                        U = {node.winningBranch.utilityScore}/100
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-foreground line-clamp-2">
                      {node.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {activePb2TotNode && (
              <div className="space-y-2.5 rounded-md border border-border bg-background/80 p-3.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">
                    {activePb2TotNode.auditNodeId} · {activePb2TotNode.playbookSectionRef}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-emerald-400">
                    Vencedor: {activePb2TotNode.winningBranch.branchId} ({activePb2TotNode.winningBranch.utilityScore}/100)
                  </span>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Gap Identificado na Auditoria:</strong>{" "}
                  {activePb2TotNode.currentAppGapFound}
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Resolução Estado da Arte:</strong>{" "}
                  {activePb2TotNode.stateOfTheArtResolution}
                </p>
                <div className="space-y-1.5 pt-1">
                  {activePb2TotNode.evaluatedBranches.map((branch) => (
                    <div
                      key={branch.branchId}
                      className={`rounded border px-2.5 py-2 text-[11px] ${
                        branch.isWinner
                          ? "border-emerald-500/40 bg-emerald-500/10 text-foreground"
                          : !branch.invariantValid
                            ? "border-rose-500/30 bg-rose-500/5 text-muted-foreground"
                            : "border-border/60 bg-card text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono tabular-nums">
                        <span className="font-semibold">
                          {branch.branchId}: {branch.label}
                        </span>
                        <span>
                          {branch.invariantValid
                            ? `U_PB2 = ${branch.utilityScore}/100`
                            : "PODADO (V = 0)"}
                        </span>
                      </div>
                      {!branch.invariantValid && branch.pruneReason && (
                        <p className="mt-1 text-rose-300">Motivo da poda: {branch.pruneReason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita: Simulador Interativo do Motor RAG Zero-Alucinação */}
          <div className="space-y-3 lg:col-span-6">
            <div className="space-y-3 rounded-md border border-border bg-background/80 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  Laboratório Interativo · Skill &amp; Motor RAG Zero-Alucinação (Playbook 2.0)
                </span>
                <span className="font-mono text-[11px] tabular-nums text-emerald-400">
                  CC BY-NC-ND 4.0 · Citação Primária Obrigatória
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Selecionar Driver Playbook 2.0 (16 ativos)
                  </span>
                  <select
                    aria-label="Selecionar Driver Playbook 2.0 para o Laboratório RAG"
                    value={ragLabDriverSlug}
                    onChange={(e) => setRagLabDriverSlug(e.target.value)}
                    className="min-h-10 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {PLAYBOOK_2_INTERVENTION_RAG_CORPUS.map((entry) => (
                      <option key={entry.interventionId} value={entry.driverSlug}>
                        [{entry.pillarCode}] {entry.driverNamePt} — {entry.titlePt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Consulta Orientada ao Corpus
                  </span>
                  <input
                    type="text"
                    aria-label="Consulta orientada ao corpus Playbook 2.0"
                    value={ragLabQuery}
                    onChange={(e) => setRagLabQuery(e.target.value)}
                    placeholder="Ex.: intervenções de segurança no trabalho, voz, desconexão..."
                    className="min-h-10 w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </label>
              </div>

              <div className="space-y-2 rounded-md border border-border bg-card p-3">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tabular-nums text-muted-foreground">
                  <span className="text-primary font-semibold">
                    Pilar {ragLabResult.matchedPillar?.letter ?? "D"} ({ragLabResult.matchedPillar?.namePt ?? "DRIVER"}) · {ragLabResult.matchedInterventions[0]?.driverNamePt ?? ragLabDriverSlug}
                  </span>
                  <span className="text-emerald-400">
                    Guardrail Zero-Alucinação: {ragLabResult.zeroHallucinationVerified ? "VERIFICADO" : "REVISAR"}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-foreground">
                  {ragLabResult.matchedInterventions[0]?.mechanismSummaryPt}
                </p>

                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-foreground">
                    Citações Primárias Recuperadas ({ragLabResult.matchedCitations.length}):
                  </p>
                  <div className="max-h-36 space-y-1.5 overflow-y-auto pr-1">
                    {ragLabResult.matchedCitations.map((cit) => (
                      <div
                        key={cit.citationId}
                        className="rounded border border-border/70 bg-background/70 px-2.5 py-1.5 text-[11px]"
                      >
                        <div className="flex items-center justify-between gap-2 font-mono tabular-nums text-primary">
                          <span>
                            [Ref #{cit.playbookRefNumber}] {cit.authors} ({cit.year})
                          </span>
                          <span className="text-muted-foreground">{cit.studyDesign}</span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground">{cit.findingSummaryPt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-2 font-mono text-[11px] tabular-nums text-muted-foreground">
                  <span>
                    Crosswalk COPSOQ II: {ragLabResult.copsoqSubscalesLinked.join(", ")}
                  </span>
                  {" · "}
                  <span>
                    Cláusulas MTE 2026: {ragLabResult.mteRequirementsLinked.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-painel ARGO 4.0: Catálogo de Engenharia de Prompts Cinematográficos Hollywood 8K (18 Drivers · U_HERO) */}
        <div className="mt-4 space-y-3 rounded-md border border-border bg-background/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Catálogo ARGO 4.0 · Direção de Fotografia 8K de Estúdio de Hollywood &amp; Harmonia Visual ToT (18 Drivers: 16 Ativos + 2 Roadmap 2026)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Selecione qualquer driver para inspecionar a fotografia 8K 16:9 gerada, a iluminação de 3 pontos (Key / Fill / Rim), a correlação científica Playbook 2.0 e o Master Prompt de desenvolvimento.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold tabular-nums text-emerald-400">
              U_HERO Médio: {argo4HeroPromptCatalogSummary.averageHarmonyUtilityScore}/100 ({argo4HeroPromptCatalogSummary.totalSpecs} Drivers)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {argo4HeroPromptCatalogSummary.evaluatedSpecs.map((spec) => {
              const isSelected = selectedHeroPromptDriverSlug === spec.driverSlug;
              return (
                <button
                  key={spec.specId}
                  type="button"
                  onClick={() => setSelectedHeroPromptDriverSlug(spec.driverSlug)}
                  aria-pressed={isSelected}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {spec.order}. {spec.driverNamePt} ({spec.utilityScore})
                </button>
              );
            })}
          </div>

          {activeHeroPromptSpec && (
            <div className="grid gap-4 pt-2 lg:grid-cols-12">
              <div className="lg:col-span-5 overflow-hidden rounded-md border border-border bg-zinc-950">
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={activeHeroPromptSpec.heroImageUrl}
                    alt={`Estúdio 8K ${activeHeroPromptSpec.driverNamePt}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span className="rounded bg-black/65 px-2 py-0.5">
                      {activeHeroPromptSpec.specId} · {activeHeroPromptSpec.pillarLabelPt}
                    </span>
                    <span className="rounded bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-emerald-300 tabular-nums">
                      U_HERO {activeHeroPromptSpec.utilityScore}/100
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-[11px] text-white/95 font-medium">
                    {activeHeroPromptSpec.visualHeadlineCaptionPt}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">
                    {activeHeroPromptSpec.driverNamePt} ({activeHeroPromptSpec.driverNameEn}) · {activeHeroPromptSpec.cameraOpticsSpec.cameraBody} · {activeHeroPromptSpec.cameraOpticsSpec.lensFocalLength} ({activeHeroPromptSpec.cameraOpticsSpec.aperture})
                  </span>
                  <span className="font-mono text-[11px] text-primary">
                    {activeHeroPromptSpec.hollywoodLightingSetup.colorTemperatureKelvin}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Correlação Científica Playbook 2.0:</strong>{" "}
                  {activeHeroPromptSpec.thematicCorrelationPt}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Iluminação 3 Pontos:</strong> Key: {activeHeroPromptSpec.hollywoodLightingSetup.keyLight} | Fill: {activeHeroPromptSpec.hollywoodLightingSetup.fillLight} | Rim: {activeHeroPromptSpec.hollywoodLightingSetup.rimLight}
                </p>
                <div className="rounded border border-border bg-card p-2.5 font-mono text-[11px] text-muted-foreground select-all">
                  <span className="font-semibold text-primary block mb-1">
                    Master Prompt Cinematográfico 8K (EN):
                  </span>
                  {activeHeroPromptSpec.developmentPromptEn}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 00: LABORATÓRIO FORENSE DE AUDITORIA MTE 2026 (GRO/NR-1) & MANUAL COPSOQ II PORTUGAL 2013 */}
      <section
        aria-labelledby="section-mte-copsoq-audit"
        className="space-y-4 rounded-lg border border-border bg-card p-5 md:p-6 arc-surface-precision arc-hairline-top"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-primary">
              00. Auditoria Forense dos Documentos Anexos · Guia Oficial MTE 2026 (Cap. 1.5 NR-1) + Manual COPSOQ II Portugal 2013
            </p>
            <h2
              id="section-mte-copsoq-audit"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Painel de Conformidade Normativa MTE 2026 &amp; Motor COPSOQ II (41 Questões · 26 Subescalas · Tercis 2,33 e 3,66)
            </h2>
            <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Avaliação sistêmica sem alucinação de IA confrontando os motores do aplicativo com os{" "}
              <strong className="font-medium text-foreground">
                {mteCopsoqSystemicAuditEvaluation.summary.mteTotalRequirements} requisitos mandatórios do Guia Oficial MTE 2026 Comentado
              </strong>{" "}
              e com a estrutura oficial da{" "}
              <strong className="font-medium text-foreground">
                Versão Curta do Manual COPSOQ II Portugal 2013 ({mteCopsoqSystemicAuditEvaluation.summary.copsoqTotalItems} questões, {mteCopsoqSystemicAuditEvaluation.summary.copsoqTotalSubscales} subescalas e {mteCopsoqSystemicAuditEvaluation.summary.copsoqMainDimensionsCount} dimensões principais)
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tabular-nums text-muted-foreground">
            <span>
              Conformidade MTE 2026: {mteCopsoqSystemicAuditEvaluation.summary.mteCompliancePct}% ({mteCopsoqSystemicAuditEvaluation.summary.mteCompliantCount}/{mteCopsoqSystemicAuditEvaluation.summary.mteTotalRequirements})
            </span>
            <span aria-hidden="true">·</span>
            <span>
              COPSOQ II: {mteCopsoqSystemicAuditEvaluation.summary.copsoqTotalSubscales} subescalas / {mteCopsoqSystemicAuditEvaluation.summary.copsoqTotalItems} itens
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Tercis: {mteCopsoqSystemicAuditEvaluation.summary.copsoqTertileCutoffs[0]} / {mteCopsoqSystemicAuditEvaluation.summary.copsoqTertileCutoffs[1]}
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Coluna Esquerda: 12 Requisitos Normativos do Guia Oficial MTE 2026 */}
          <div className="space-y-3 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground">
                12 Requisitos Mandatórios do Guia Oficial MTE 2026 (Cap. 1.5 NR-1 — GRO/PGR)
              </p>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                Clique para inspecionar cláusula e regra anti-alucinação
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {mte2026AuditRequirementsCatalog.map((req) => {
                const isSelected = activeMteReq?.id === req.id;
                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => setSelectedMteReqId(req.id)}
                    aria-pressed={isSelected}
                    className={`min-h-11 rounded-md border p-3 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary arc-tactile-card ${
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px] tabular-nums">
                      <span className="font-semibold text-primary">{req.id}</span>
                      <span>{req.nr1Clause}</span>
                    </div>
                    <p className="mt-1 font-medium text-foreground line-clamp-2">
                      {req.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {activeMteReq && (
              <div className="space-y-2 rounded-md border border-border bg-background/80 p-3.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">
                    {activeMteReq.id} · {activeMteReq.mteGuideSection}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-emerald-400">
                    Verificado em {activeMteReq.verificationModule}
                  </span>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Ação Exigida pelo MTE:</strong>{" "}
                  {activeMteReq.mandatoryActionSummary}
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Trava Zero-Alucinação:</strong>{" "}
                  {activeMteReq.zeroHallucinationRule}
                </p>
                <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  Superfície: {activeMteReq.appFunctionalSurface} · Evidências: {activeMteReq.evidenceArtifacts.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Coluna Direita: Simulador Determinístico MTE 2026 & Auditoria das 26 Subescalas COPSOQ II */}
          <div className="space-y-3 lg:col-span-5">
            <div className="space-y-3 rounded-md border border-border bg-background/80 p-3.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  Simulador Determinístico MTE 2026 (Itens 1.5.4.4.4.1, 1.5.4.4.5.1 e 1.5.4.4.6)
                </span>
                <span className="font-mono text-[11px] tabular-nums text-primary">
                  ISO 45002 5×5
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSimNrViolated((v) => !v)}
                  aria-pressed={simNrViolated}
                  className={`min-h-11 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    simNrViolated
                      ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {simNrViolated
                    ? "Trava Legal NR (1.5.4.4.5.1): ATIVA (Prob = 5)"
                    : "Simular Descumprimento de NR (1.5.4.4.5.1)"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSimControlHierarchy((prev) =>
                      prev === "collective_engineering" ? "ppe_only" : "collective_engineering",
                    )
                  }
                  className="min-h-11 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap shrink-0"
                >
                  Controle: {simControlHierarchy === "ppe_only" ? "EPI Isolado (Vedado)" : "Proteção Coletiva"}
                </button>

                <button
                  type="button"
                  onClick={() => setSimCipaRequestTrigger((v) => !v)}
                  aria-pressed={simCipaRequestTrigger}
                  className={`min-h-11 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    simCipaRequestTrigger
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {simCipaRequestTrigger
                    ? "Gatilho 1.5.4.4.6 'f' (CIPA/Trabalhador): ATIVO"
                    : "Simular Solicitação CIPA (1.5.4.4.6 'f')"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-card p-2.5 font-mono text-xs tabular-nums">
                <div>
                  <span className="text-[11px] text-muted-foreground">Severidade (Maior)</span>
                  <p className="text-sm font-semibold text-foreground">
                    {simulatedMteMatrix.severity}/5
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Probabilidade</span>
                  <p className="text-sm font-semibold text-foreground">
                    {simulatedMteMatrix.probability}/5
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Nível ({simulatedMteMatrix.rawScore}/25)</span>
                  <p className="text-sm font-semibold text-primary">
                    {simulatedMteMatrix.riskLevel} ({simulatedMteMatrix.maxDeadlineLabel})
                  </p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Decisão Mandatória:</strong>{" "}
                {simulatedMteMatrix.mandatoryDecisionRule}{" "}
                {simulatedMteMatrix.ppeOnlyWarning && (
                  <span className="text-amber-300">
                    Alerta MTE 2026 (p. 65): EPI isolado não reduz probabilidade ergonômica/psicossocial.
                  </span>
                )}
              </p>

              <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                Revisão Avaliada: {simulatedMteReview.legalBasisClause} ·{" "}
                {simulatedMteReview.immediateReviewRequired
                  ? "Revisão Imediata Obrigatória"
                  : `Revisão Periódica em ${simulatedMteReview.periodicReviewYears} anos`}
              </p>
            </div>

            {/* Resumo das 26 Subescalas Oficiais do Manual COPSOQ II Portugal 2013 */}
            <div className="space-y-2 rounded-md border border-border bg-background/80 p-3.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-foreground">
                  Manual COPSOQ II Portugal 2013 · 26 Subescalas (41 Questões)
                </span>
                <span className="font-mono text-[11px] tabular-nums text-emerald-400">
                  {copsoqManualAuditFindingsCatalog.length}/{copsoqManualAuditFindingsCatalog.length} Achados Conformes
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Cotação por média aritmética (1,00 a 5,00) dividida em tercis exatos{" "}
                <span className="font-mono tabular-nums text-foreground">2,33</span> e{" "}
                <span className="font-mono tabular-nums text-foreground">3,66</span> (Verde / Amarelo / Vermelho) conforme polaridade protetora vs. exposição de risco.
              </p>
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1 font-mono text-[11px] tabular-nums">
                {mteCopsoqSystemicAuditEvaluation.sampleSubscaleResults.slice(0, 8).map((sub) => (
                  <div
                    key={sub.subscaleId}
                    className="flex items-center justify-between gap-2 rounded border border-border/60 bg-card px-2.5 py-1.5"
                  >
                    <span className="truncate font-sans text-foreground">
                      {sub.order}. {sub.label} ({sub.itemIds.join(", ")})
                    </span>
                    <span
                      className={
                        sub.tertileBand === "vermelho"
                          ? "text-rose-400"
                          : sub.tertileBand === "amarelo"
                            ? "text-amber-300"
                            : "text-emerald-400"
                      }
                    >
                      Média {sub.meanScore.toFixed(2)} · {sub.tertileBand.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: ÁRVORE DE CONHECIMENTO TOGAF (4 DOMÍNIOS + CICLO ADM) */}
      <section aria-labelledby="section-togaf-tree" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              01. Arquitetura Corporativa Executável · Fase Preliminar até Fase H
            </p>
            <h2
              id="section-togaf-tree"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Explorador da Árvore de Conhecimento TOGAF
            </h2>
          </div>
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            Exibindo {filteredNodes.length} de {togafKnowledgeNodes.length} nós arquiteturais
          </p>
        </div>

        {/* Resumo dos 4 Domínios TOGAF */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {togafKnowledgeTreeSummary.domainStats.map((stat) => (
            <div
              key={stat.domain}
              className="rounded-lg border border-border bg-card p-3.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground">
                  {togafDomainLabel(stat.domain)}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-primary">
                  {stat.readinessPct}%
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {stat.implementedLocal} implementados · {stat.partialDraft} parciais · {stat.gateBlocked} bloqueados por gate
              </p>
            </div>
          ))}
        </div>

        {/* Barra de Filtros da Árvore TOGAF */}
        <Card className="border-border bg-card">
          <CardContent className="space-y-4 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div
                role="group"
                aria-label="Filtrar por domínio TOGAF"
                className="flex flex-wrap items-center gap-1.5"
              >
                {DOMAIN_FILTER_OPTIONS.map((option) => {
                  const active = domainFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDomainFilter(option.value)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative min-w-[260px] flex-1 lg:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar nó ADM, contrato ou artefato…"
                  aria-label="Buscar nó ADM, contrato ou artefato"
                  className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div
              role="group"
              aria-label="Filtrar por elo da cadeia operacional NR-1"
              className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3"
            >
              {CHAIN_FILTER_OPTIONS.map((option) => {
                const active = chainFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setChainFilter(option.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Grid Mestre-Detalhe dos Nós TOGAF */}
        {filteredNodes.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm font-medium text-foreground">
                Nenhum nó TOGAF corresponde aos filtros selecionados.
              </p>
              <p className="text-xs text-muted-foreground">
                Limpe os filtros de domínio, elo da cadeia ou termo de busca para inspecionar a árvore completa.
              </p>
              <button
                type="button"
                onClick={handleResetNodeFilters}
                className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 whitespace-nowrap shrink-0"
              >
                Limpar filtros
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-12">
            {/* Lista de Nós */}
            <div className="space-y-2 lg:col-span-5">
              {filteredNodes.map((node) => {
                const isSelected = activeNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    aria-pressed={isSelected}
                    className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono font-medium tabular-nums text-primary">
                        {node.code} · {node.admPhaseLabel}
                      </span>
                      <span>{operationalChainStepLabel(node.chainStep)}</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {node.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span>{togafDomainLabel(node.architectureDomain)}</span>
                      <StatusIndicator status={node.currentStatus} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Painel de Inspeção Detalhada do Nó */}
            {activeNode && (
              <Card className="border-border bg-card lg:col-span-7">
                <CardHeader className="space-y-2 border-b border-border pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="font-mono font-semibold tabular-nums text-primary">
                      {activeNode.code} · {activeNode.admPhaseLabel}
                    </span>
                    <StatusIndicator status={activeNode.currentStatus} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground [text-wrap:balance]">
                    {activeNode.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Domínio: <strong className="text-foreground">{togafDomainLabel(activeNode.architectureDomain)}</strong>
                    {" · "}
                    Elo da Cadeia: <strong className="text-foreground">{operationalChainStepLabel(activeNode.chainStep)}</strong>
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      Pergunta-Guia Arquitetural
                    </p>
                    <p className="leading-relaxed text-muted-foreground">
                      {activeNode.guideQuestion}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      Estado Alvo de Consolidação (G1 → G2)
                    </p>
                    <p className="leading-relaxed text-muted-foreground">
                      {activeNode.targetConsolidationState}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-semibold text-foreground">
                      Invariantes Constitucionais Protegidos ({activeNode.invariantsProtected.length})
                    </p>
                    <ul className="grid gap-1.5 sm:grid-cols-2">
                      {activeNode.invariantsProtected.map((inv) => (
                        <li
                          key={inv}
                          className="rounded border border-border bg-background/50 px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-muted-foreground"
                        >
                          {INVARIANT_SHORT_LABELS[inv] ?? `Invariante #${inv}`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground">
                        Contratos de Verificação Automatizada
                      </p>
                      <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                        {activeNode.verificationContracts.map((contract) => (
                          <li key={contract} className="break-all">
                            • {contract}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground">
                        Artefatos Primários no Repositório
                      </p>
                      <ul className="space-y-1 font-mono text-[11px] text-muted-foreground">
                        {activeNode.primaryArtifacts.map((artifact) => (
                          <li key={artifact} className="break-all">
                            • {artifact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-semibold text-foreground">
                      Critérios de Aceite Determinísticos
                    </p>
                    <ul className="space-y-1 text-muted-foreground">
                      {activeNode.acceptanceCriteria.map((criterion) => (
                        <li key={criterion}>• {criterion}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                    <p className="font-semibold text-foreground">
                      Risco Residual &amp; Limite de Gate
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {activeNode.residualRisk}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Matriz Compacta do Ciclo ADM TOGAF */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              Matriz de Rastreabilidade do Ciclo ADM TOGAF (Fase Preliminar a Fase H)
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="py-2.5 pr-3 font-medium">Fase ADM</th>
                  <th className="py-2.5 pr-3 font-medium">Escopo TOGAF</th>
                  <th className="py-2.5 pr-3 font-medium">Tradução Executável Fable 5</th>
                  <th className="py-2.5 font-medium">Artefatos de Referência</th>
                </tr>
              </thead>
              <tbody>
                {togafAdmPhases.map((phase) => (
                  <tr key={phase.code} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-3 font-mono font-semibold tabular-nums text-primary whitespace-nowrap">
                      {phase.code}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-foreground">
                      {phase.title}
                    </td>
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      {phase.fable5Translation}
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-muted-foreground">
                      {phase.primaryOutput}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* SEÇÃO 2: ORQUESTRADOR DA MACRO-ONDA DE CONSOLIDAÇÃO (6 ÉPICOS E2E + ToT) */}
      <section aria-labelledby="section-macro-wave" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              02. Sequenciamento Determinístico G1 → G2 · Tree of Thoughts (ToT) com Poda Binária
            </p>
            <h2
              id="section-macro-wave"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Orquestrador da Macro-Onda de Consolidação Funcional (6 Elos NR-1)
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filtrar sub-ondas por fronteira de gate"
            className="flex flex-wrap items-center gap-1.5"
          >
            {GATE_FILTER_OPTIONS.map((option) => {
              const active = gateFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setGateFilter(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seletor das 6 Sub-Ondas */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
          {filteredSlices.map((slice) => {
            const isSelected = activeSlice?.waveId === slice.waveId;
            return (
              <button
                key={slice.waveId}
                type="button"
                onClick={() => setSelectedWaveId(slice.waveId)}
                aria-pressed={isSelected}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {slice.waveId}
                  </span>
                  <span className="font-mono tabular-nums">
                    U={slice.winningBranch.utilityScore}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground line-clamp-2">
                  {operationalChainStepLabel(slice.chainLink)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {slice.togafPhases.join(" · ")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detalhe da Sub-Onda Selecionada + Simulador Tree of Thoughts */}
        {activeSlice && (
          <Card className="border-border bg-card">
            <CardHeader className="space-y-2 border-b border-border pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {activeSlice.waveId}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSlice.subtitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{gateBoundaryLabel(activeSlice.gateBoundary)}</span>
                </div>
                <StatusIndicator status={activeSlice.currentStatus} />
              </div>

              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground [text-wrap:balance]">
                <Layers className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {activeSlice.title}
              </CardTitle>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {activeSlice.objective}
              </p>
            </CardHeader>

            <CardContent className="space-y-5 pt-4 text-xs">
              {/* Equação Formal ToT */}
              <div className="rounded-md border border-border bg-background/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-foreground">
                    Função de Utilidade Multicritério Tree of Thoughts (ToT)
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-primary">
                    Ramo Vencedor: {activeSlice.winningBranch.branchId} (U = {activeSlice.winningBranch.utilityScore}/100)
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
                  U(b) = V(b) × (0.30·S_tese + 0.25·S_seg + 0.20·S_rigor + 0.15·S_puro + 0.10·S_rev) — onde V(b) = 0 se violar qualquer um dos 14 invariantes.
                </p>
              </div>

              {/* Comparação dos 3 Ramos ToT */}
              <div className="grid gap-3 lg:grid-cols-3">
                {activeSlice.evaluatedBranches.map((branch) => (
                  <div
                    key={branch.branchId}
                    className={`rounded-lg border p-3.5 ${
                      branch.isWinner
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : !branch.invariantValid
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border bg-background/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-semibold tabular-nums text-foreground">
                        {branch.branchId}
                      </span>
                      {branch.isWinner ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Vencedor · U = {branch.utilityScore}
                        </span>
                      ) : !branch.invariantValid ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-destructive">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Podado (V = 0) · U = 0
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                          Alternativa · U = {branch.utilityScore}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 font-semibold text-foreground">
                      {branch.label}
                    </p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {branch.description}
                    </p>

                    <div className="mt-3 grid grid-cols-5 gap-1 border-t border-border/60 pt-2.5 text-center font-mono text-[10px] tabular-nums">
                      <div>
                        <p className="text-muted-foreground">Tese</p>
                        <p className="font-semibold text-foreground">{branch.thesisScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Seg.</p>
                        <p className="font-semibold text-foreground">{branch.securityScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">NR-1</p>
                        <p className="font-semibold text-foreground">{branch.regulatoryRigorScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Puro</p>
                        <p className="font-semibold text-foreground">{branch.pureMechanismScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rev.</p>
                        <p className="font-semibold text-foreground">{branch.reversibilityScore}</p>
                      </div>
                    </div>

                    {branch.pruneReason && (
                      <p className="mt-2.5 rounded border border-destructive/30 bg-background/60 p-2 text-[11px] text-destructive">
                        <strong>Motivo da Poda:</strong> {branch.pruneReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Entregáveis Técnicos Consolidados
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeSlice.deliverables.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Regra de Guarda Server-Side (Fail-Closed)
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {activeSlice.serverEnforcementRule}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Critérios de Aceite da Sub-Onda
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeSlice.acceptanceCriteria.map((criterion) => (
                      <li key={criterion}>• {criterion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* SEÇÃO 3: PRÓXIMA ONDA PRÁTICA SaaS (TRILHAS S1–S6) & MATRIZ DE RESPONSIVIDADE 320px–1440px */}
      <section aria-labelledby="section-next-wave-saas-ux" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              03. Árvore ToT da Próxima Onda · Aplicação Prática em Formato SaaS &amp; Excelência UX/UI Multidispositivo
            </p>
            <h2
              id="section-next-wave-saas-ux"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Simulador de Prontidão Prática SaaS (Trilhas S1–S6) &amp; Contratos 320px–1440px
            </h2>
          </div>

          <p className="font-mono text-xs tabular-nums text-primary">
            Utilidade Média U_SaaS = {nextWaveSaasPlanSummary.averageWinningUtility}/100 · Touch &gt;= 44px · Sticky &lt;= 15%
          </p>
        </div>

        {/* Seletor das 6 Trilhas Práticas SaaS (ONDA-S1 a ONDA-S6) */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
          {nextWaveSaasPlanSummary.tracks.map((track) => {
            const isSelected = activeSaasTrack?.trackId === track.trackId;
            return (
              <button
                key={track.trackId}
                type="button"
                onClick={() => setSelectedSaasTrackId(track.trackId)}
                aria-pressed={isSelected}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {track.trackId}
                  </span>
                  <span className="font-mono tabular-nums">
                    U={track.winningBranch.utilityScore}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground line-clamp-2">
                  {track.title}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {track.togafPhases.join(" · ")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detalhe da Trilha Prática SaaS Selecionada */}
        {activeSaasTrack && (
          <Card className="border-border bg-card">
            <CardHeader className="space-y-2 border-b border-border pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {activeSaasTrack.trackId}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSaasTrack.subtitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>Persona: {saasPersonaLabel(activeSaasTrack.personaFocus)}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {gateBoundaryLabel(activeSaasTrack.gateBoundary)}
                </span>
              </div>

              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground [text-wrap:balance]">
                <Rocket className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {activeSaasTrack.title}
              </CardTitle>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {activeSaasTrack.practicalSaasGoal}
              </p>
            </CardHeader>

            <CardContent className="space-y-5 pt-4 text-xs">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-border bg-background/50 p-3">
                  <p className="font-semibold text-foreground">
                    Mandato de Design, Usabilidade &amp; UX
                  </p>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {activeSaasTrack.uxDesignMandate}
                  </p>
                </div>

                <div className="rounded-md border border-border bg-background/50 p-3">
                  <p className="font-semibold text-foreground">
                    Contrato de Responsividade Multidispositivo
                  </p>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {activeSaasTrack.responsiveContract}
                  </p>
                </div>
              </div>

              {/* Comparação dos 3 Ramos ToT da Trilha SaaS */}
              <div className="grid gap-3 lg:grid-cols-3">
                {activeSaasTrack.evaluatedBranches.map((branch) => (
                  <div
                    key={branch.branchId}
                    className={`rounded-lg border p-3.5 ${
                      branch.isWinner
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : !branch.invariantValid
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border bg-background/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-semibold tabular-nums text-foreground">
                        {branch.branchId}
                      </span>
                      {branch.isWinner ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Vencedor · U_SaaS = {branch.utilityScore}
                        </span>
                      ) : !branch.invariantValid ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-destructive">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Podado (V = 0) · U = 0
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                          Alternativa · U_SaaS = {branch.utilityScore}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 font-semibold text-foreground">
                      {branch.label}
                    </p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {branch.description}
                    </p>

                    <div className="mt-3 grid grid-cols-5 gap-1 border-t border-border/60 pt-2.5 text-center font-mono text-[10px] tabular-nums">
                      <div>
                        <p className="text-muted-foreground">Tese</p>
                        <p className="font-semibold text-foreground">{branch.thesisScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Seg.</p>
                        <p className="font-semibold text-foreground">{branch.securityScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">NR-1</p>
                        <p className="font-semibold text-foreground">{branch.regulatoryRigorScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">UX</p>
                        <p className="font-semibold text-foreground">{branch.uxErgonomicsScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">SaaS</p>
                        <p className="font-semibold text-foreground">{branch.saasReadinessScore}</p>
                      </div>
                    </div>

                    {branch.pruneReason && (
                      <p className="mt-2.5 rounded border border-destructive/30 bg-background/60 p-2 text-[11px] text-destructive">
                        <strong>Motivo da Poda:</strong> {branch.pruneReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Entregáveis Práticos da Trilha SaaS
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeSaasTrack.deliverables.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Métricas de Usabilidade &amp; Experiência do Usuário
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeSaasTrack.usabilityMetrics.map((metric) => (
                      <li key={metric}>• {metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simulador de Contratos de Viewport e Ergonomia (320px a 1440px) */}
        <Card className="border-border bg-card">
          <CardHeader className="space-y-3 border-b border-border pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MonitorSmartphone className="h-4 w-4 text-primary" aria-hidden="true" />
                Contratos Matemáticos de Responsividade, Usabilidade &amp; WCAG AA (320px a 1440px+)
              </CardTitle>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                4 Perfis de Tela Verificados
              </span>
            </div>

            <div
              role="group"
              aria-label="Selecionar perfil de viewport para inspeção UX"
              className="flex flex-wrap items-center gap-1.5"
            >
              {nextWaveSaasPlanSummary.viewportContracts.map((vp) => {
                const active = activeViewport?.viewportId === vp.viewportId;
                return (
                  <button
                    key={vp.viewportId}
                    type="button"
                    onClick={() => setSelectedViewportId(vp.viewportId)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {vp.label} ({vp.widthRange})
                  </button>
                );
              })}
            </div>
          </CardHeader>

          {activeViewport && (
            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Faixa de Resolução</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-foreground">
                    {activeViewport.widthRange}
                  </p>
                </div>
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Alvo de Toque/Clique</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-emerald-400">
                    &gt;= {activeViewport.minTouchTargetPx}×{activeViewport.minTouchTargetPx}px
                  </p>
                </div>
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Teto de Barras Fixas</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-primary">
                    &lt;= {activeViewport.maxStickyViewportPct}% da altura
                  </p>
                </div>
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Persona Foco</p>
                  <p className="mt-1 font-medium text-foreground">
                    {activeViewport.primaryPersona}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    Arquitetura de Grid &amp; Espacialidade
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {activeViewport.gridArchitecture}
                  </p>
                  <p className="mt-2 font-semibold text-foreground">
                    Escala Tipográfica
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {activeViewport.typographyScale}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Regras de Ouro Zero-Fricção
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeViewport.zeroFrictionRules.map((rule) => (
                      <li key={rule}>• {rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Superfícies Críticas &amp; Contrato de Teste
                  </p>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Rotas: {activeViewport.keySurfaces.join(", ")}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-primary">
                    Verificação: {activeViewport.verificationSpec}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </section>

      {/* SEÇÃO 3.5: SUPERONDA ARC 4.0 — CONSOLIDAÇÃO DE SERVIÇOS & LABORATÓRIO DE BENCHMARK VISUAL */}
      <section aria-labelledby="section-arc4-superwave" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              03B. Superinteligência ARC 4.0 · Consolidação de Serviços SaaS &amp; Benchmark de Web Design (Linear / Stripe / Vercel / Raycast / Apple HIG)
            </p>
            <h2
              id="section-arc4-superwave"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Laboratório ARC 4.0: Superonda de Serviços (`SUPERONDA-A1` a `A6`) &amp; Efeitos Visuais de Valor
            </h2>
          </div>

          <p className="font-mono text-xs tabular-nums text-primary">
            Utilidade Média U_ARC4 = {arc4SuperWaveSummary.averageWinningUtility}/100 · Redução Cognitiva -{arc4SuperWaveSummary.averageCognitiveLoadReductionPct}% · Latência &lt;= {arc4SuperWaveSummary.maxInteractionLatencyMs}ms
          </p>
        </div>

        {/* Seletor das 6 Frentes da Superonda ARC 4.0 */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-6">
          {arc4SuperWaveSummary.superWaves.map((wave) => {
            const isSelected = activeArc4Wave?.superWaveId === wave.superWaveId;
            return (
              <button
                key={wave.superWaveId}
                type="button"
                onClick={() => setSelectedArc4WaveId(wave.superWaveId)}
                aria-pressed={isSelected}
                className={`arc-surface-precision arc-tactile-card rounded-lg p-3 text-left ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {wave.superWaveId}
                  </span>
                  <span className="font-mono tabular-nums">
                    U={wave.winningBranch.utilityScore}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground line-clamp-2">
                  {wave.title}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {wave.togafPhases.join(" · ")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detalhe da Frente Selecionada da Superonda ARC 4.0 */}
        {activeArc4Wave && (
          <Card className="arc-surface-precision arc-hairline-top border-border bg-card">
            <CardHeader className="space-y-2 border-b border-border pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {activeArc4Wave.superWaveId}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeArc4Wave.subtitle}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {gateBoundaryLabel(activeArc4Wave.gateBoundary)}
                </span>
              </div>

              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground [text-wrap:balance]">
                <Sparkles className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {activeArc4Wave.title}
              </CardTitle>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {activeArc4Wave.serviceConsolidationGoal}
              </p>
            </CardHeader>

            <CardContent className="space-y-5 pt-4 text-xs">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-border bg-background/50 p-3">
                  <p className="font-semibold text-foreground">
                    Proposta de Valor de Web Design &amp; Efeito Visual
                  </p>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {activeArc4Wave.visualEffectValueProposition}
                  </p>
                </div>

                <div className="rounded-md border border-border bg-background/50 p-3">
                  <p className="font-semibold text-foreground">
                    Rotas de Serviço Consolidadas &amp; Equação U_ARC4
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-primary">
                    Rotas: {activeArc4Wave.targetRoutes.join(" · ")}
                  </p>
                  <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
                    U_ARC4(b) = V(b) × (0.25·S_serv + 0.25·S_seg + 0.20·S_rigor + 0.15·S_design + 0.15·S_ux_val)
                  </p>
                </div>
              </div>

              {/* Comparação dos 3 Ramos ToT da Superonda ARC 4.0 */}
              <div className="grid gap-3 lg:grid-cols-3">
                {activeArc4Wave.evaluatedBranches.map((branch) => (
                  <div
                    key={branch.branchId}
                    className={`rounded-lg border p-3.5 ${
                      branch.isWinner
                        ? "border-emerald-500/40 bg-emerald-500/5"
                        : !branch.invariantValid
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border bg-background/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-semibold tabular-nums text-foreground">
                        {branch.branchId}
                      </span>
                      {branch.isWinner ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Vencedor · U_ARC4 = {branch.utilityScore}
                        </span>
                      ) : !branch.invariantValid ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold tabular-nums text-destructive">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Podado (V = 0) · U = 0
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                          Alternativa · U_ARC4 = {branch.utilityScore}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 font-semibold text-foreground">
                      {branch.label}
                    </p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {branch.description}
                    </p>

                    <div className="mt-3 grid grid-cols-5 gap-1 border-t border-border/60 pt-2.5 text-center font-mono text-[10px] tabular-nums">
                      <div>
                        <p className="text-muted-foreground">Serv.</p>
                        <p className="font-semibold text-foreground">{branch.serviceConsolidationScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Seg.</p>
                        <p className="font-semibold text-foreground">{branch.securityScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">NR-1</p>
                        <p className="font-semibold text-foreground">{branch.regulatoryRigorScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Design</p>
                        <p className="font-semibold text-foreground">{branch.webDesignBenchmarkScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">UX Val</p>
                        <p className="font-semibold text-foreground">{branch.uxValueAddedScore}</p>
                      </div>
                    </div>

                    {branch.pruneReason && (
                      <p className="mt-2.5 rounded border border-destructive/30 bg-background/60 p-2 text-[11px] text-destructive">
                        <strong>Motivo da Poda:</strong> {branch.pruneReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Entregáveis de Consolidação de Serviços &amp; UI
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeArc4Wave.implementationDeliverables.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-foreground">
                    Critérios de Verificação Técnica &amp; UX
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    {activeArc4Wave.verificationCriteria.map((criterion) => (
                      <li key={criterion}>• {criterion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Matriz Interativa dos 5 Benchmarks de Web Design & Efeitos Visuais */}
        <Card className="arc-surface-precision border-border bg-card">
          <CardHeader className="space-y-3 border-b border-border pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Benchmark Global de Web Design &amp; Efeitos Visuais Orientados a Valor (5 Padrões Auditáveis)
              </CardTitle>
              <span className="font-mono text-xs tabular-nums text-emerald-400">
                100% Protegido por prefers-reduced-motion
              </span>
            </div>

            <div
              role="group"
              aria-label="Selecionar referência de benchmark de web design"
              className="flex flex-wrap items-center gap-1.5"
            >
              {arc4SuperWaveSummary.benchmarks.map((bench) => {
                const active = activeBenchmark?.benchmarkId === bench.benchmarkId;
                return (
                  <button
                    key={bench.benchmarkId}
                    type="button"
                    onClick={() => setSelectedBenchmarkId(bench.benchmarkId)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {bench.code} · {bench.referenceName}
                  </button>
                );
              })}
            </div>
          </CardHeader>

          {activeBenchmark && (
            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Referência Global</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {activeBenchmark.referenceName}
                  </p>
                </div>
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Redução de Carga Cognitiva</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-emerald-400">
                    -{activeBenchmark.cognitiveLoadReductionPct}% esforço visual
                  </p>
                </div>
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Orçamento de Latência</p>
                  <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-primary">
                    &lt;= {activeBenchmark.interactionLatencyMs}ms
                  </p>
                </div>
                <div className="rounded border border-border bg-background/50 p-3">
                  <p className="text-muted-foreground">Contrato CSS / Tokens</p>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-foreground">
                    {activeBenchmark.cssUtilityContract}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    Padrão: {activeBenchmark.patternTitle}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {activeBenchmark.visualEffectSpec}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-foreground">
                    Valor Real Agregado à Experiência do Usuário
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    {activeBenchmark.uxValueAdded}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="rounded border border-emerald-500/30 bg-emerald-500/5 p-2.5">
                    <p className="font-semibold text-foreground">
                      Guardrail de Acessibilidade &amp; Performance
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {activeBenchmark.accessibilityGuardrail}
                    </p>
                  </div>
                  <div className="rounded border border-destructive/30 bg-destructive/5 p-2.5">
                    <p className="font-semibold text-foreground">
                      Anti-Padrão Proibido (V = 0)
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {activeBenchmark.antiPatternForbidden}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </section>

      {/* SEÇÃO 4: COLEGIADO DE 10 PÓS-DOUTORES & RUBRICA MULTI-IA */}
      <section aria-labelledby="section-postdoc-rubric" className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">
            04. Falsificabilidade Popperiana &amp; Meta-Avaliação Cruzada para Comitês e IAs
          </p>
          <h2
            id="section-postdoc-rubric"
            className="text-xl font-semibold text-foreground [text-wrap:balance]"
          >
            Colegiado das {postDocChairs.length} Cátedras Pós-Doutorais (20+ Anos) &amp; Rubrica Estado da Arte
          </h2>
        </div>

        {/* Seletor das 10 Cátedras */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {postDocChairs.map((chair) => {
            const isSelected = activeChair?.id === chair.id;
            return (
              <button
                key={chair.id}
                type="button"
                onClick={() => setSelectedChairId(chair.id)}
                aria-pressed={isSelected}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <span className="font-mono font-semibold tabular-nums text-primary">
                    {chair.code}
                  </span>
                  <span className="font-mono tabular-nums">
                    {chair.experienceYears} anos exp.
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground line-clamp-2">
                  {chair.chairTitle}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Foco: {togafDomainLabel(chair.togafDomainFocus)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Inspeção da Cátedra Selecionada */}
        {activeChair && (
          <Card className="border-border bg-card">
            <CardHeader className="space-y-1.5 border-b border-border pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-mono font-semibold tabular-nums text-primary">
                  {activeChair.code} · {activeChair.experienceYears} anos de experiência acumulada
                </span>
                <span>Domínio TOGAF: {togafDomainLabel(activeChair.togafDomainFocus)}</span>
              </div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                {activeChair.chairTitle}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Especialidade: {activeChair.experienceDomain}
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4 text-xs md:grid-cols-3">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Axioma Epistêmico Central
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  {activeChair.epistemicAxiom}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  Pergunta de Falsificabilidade (Karl Popper)
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  {activeChair.falsifiabilityQuestion}
                </p>
              </div>

              <div className="space-y-2">
                <div className="rounded border border-destructive/30 bg-destructive/5 p-2.5">
                  <p className="font-semibold text-foreground">
                    Gatilho de Veto Imediato (V = 0)
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {activeChair.vetoTrigger}
                  </p>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Artefatos auditados: {activeChair.primaryArtifacts.join(" · ")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Matriz da Rubrica de 10 Dimensões */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Scale className="h-4 w-4 text-primary" aria-hidden="true" />
                Rubrica de Meta-Avaliação Multi-IA (10 Dimensões · Score {superPromptRubricSummary.overallScorePct}%)
              </CardTitle>
              <span className="font-mono text-xs tabular-nums text-emerald-400">
                Soma de Pesos Verificada: {superPromptRubricSummary.totalWeightPct}%
              </span>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="py-2.5 pr-3 font-medium">Cód.</th>
                  <th className="py-2.5 pr-3 font-medium">Dimensão de Estado da Arte</th>
                  <th className="py-2.5 pr-3 text-right font-medium">Peso</th>
                  <th className="py-2.5 pr-3 text-right font-medium">Nível</th>
                  <th className="py-2.5 pr-3 text-right font-medium">Pontos</th>
                  <th className="py-2.5 pr-3 font-medium">Evidência Objetiva &amp; Parecer</th>
                  <th className="py-2.5 font-medium">Contrato Verificador</th>
                </tr>
              </thead>
              <tbody>
                {superPromptRubricSummary.criteria.map((item) => (
                  <tr key={item.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-3 font-mono font-semibold tabular-nums text-primary">
                      {item.code}
                    </td>
                    <td className="py-3 pr-3 font-medium text-foreground">
                      {item.dimension}
                    </td>
                    <td className="py-3 pr-3 text-right font-mono tabular-nums text-muted-foreground">
                      {item.weightPct}%
                    </td>
                    <td className="py-3 pr-3 text-right font-mono tabular-nums text-emerald-400">
                      {item.achievedLevel}/{item.maxLevel}
                    </td>
                    <td className="py-3 pr-3 text-right font-mono font-semibold tabular-nums text-foreground">
                      {item.weightedPoints}
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      <p className="text-foreground">{item.objectiveEvidence}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.externalCommitteeVerdict}
                      </p>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {item.verificationContract}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* SEÇÃO 5: COMPILADOR & EXPORTADOR DO SUPER PROMPT PÓS-DOUTORAL */}
      <section aria-labelledby="section-super-prompt-compiler" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              05. Engenharia de Prompt Determinística · Pronto para Execução ou Auditoria por Outras IAs
            </p>
            <h2
              id="section-super-prompt-compiler"
              className="text-xl font-semibold text-foreground [text-wrap:balance]"
            >
              Compilador Interativo do Super Prompt Pós-Doutoral
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleCopySuperPrompt()}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
            >
              {copyFeedback ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Copiar Super Prompt
            </button>

            <button
              type="button"
              onClick={handleDownloadSuperPrompt}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Baixar Manifesto (.pdf)
            </button>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="space-y-3 border-b border-border pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
                Selecionar Modo de Operação do Super Prompt
              </CardTitle>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {compiledLinesCount} linhas · {compiledPrompt.length} caracteres
              </span>
            </div>

            <div
              role="group"
              aria-label="Modo de compilação do Super Prompt"
              className="flex flex-wrap items-center gap-1.5"
            >
              {PROMPT_MODES.map((mode) => {
                const active = promptMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setPromptMode(mode);
                      setCopyFeedback(null);
                    }}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {superPromptModeLabel(mode)}
                  </button>
                );
              })}
            </div>

            {copyFeedback && (
              <p
                role="status"
                aria-live="polite"
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {copyFeedback}
              </p>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <pre
              aria-label="Conteúdo compilado do Super Prompt Pós-Doutoral"
              className="max-h-[540px] overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground"
            >
              {compiledPrompt}
            </pre>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileCode2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Documentação canônica sincronizada em{" "}
              <code className="font-mono text-foreground">
                docs/TOGAF_SYSTEMIC_KNOWLEDGE_TREE_G1_G2.md
              </code>{" "}
              e{" "}
              <code className="font-mono text-foreground">
                docs/SUPER_PROMPT_PROXIMA_ONDA_SAAS_UX_TOT.md
              </code>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Não aprova G1 automaticamente e mantém dados reais bloqueados.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ExecutiveKpi({
  label,
  value,
  detail,
}: {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function StatusIndicator({
  status,
}: {
  readonly status: TogafNodeImplementationStatus;
}) {
  if (status === "implemented_local") {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{nodeStatusLabel(status)}</span>
      </span>
    );
  }
  if (status === "partial_draft") {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-amber-300">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{nodeStatusLabel(status)}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-medium text-destructive">
      <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{nodeStatusLabel(status)}</span>
    </span>
  );
}
