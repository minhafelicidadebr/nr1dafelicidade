import {
  buildSaasPilotDashboardSuperPrompt,
  evaluateSaasPilotDashboardWave,
} from "@/lib/governance/saasPilotDashboardWaveEngine";
import {
  buildArgo4EcosystemFrameworkSuperPrompt,
  evaluateArgo4EcosystemFramework,
} from "@/lib/governance/argo4EcosystemFrameworkEngine";

export type TogafAdmPhaseCode =
  | "Preliminary"
  | "Phase A"
  | "Phase B"
  | "Phase C"
  | "Phase D"
  | "Phase E"
  | "Phase F"
  | "Phase G"
  | "Phase H";

export type TogafArchitectureDomain =
  | "business"
  | "data"
  | "application"
  | "technology";

export type OperationalChainStep =
  | "measure"
  | "contextualize"
  | "evaluate"
  | "act"
  | "evidence"
  | "reevaluate"
  | "cross_cutting";

export type TogafNodeImplementationStatus =
  | "implemented_local"
  | "partial_draft"
  | "gate_blocked";

export type GateBoundaryCode =
  | "G0_SYNTHETIC"
  | "G1_SYNTHETIC_READY"
  | "G2_COMMITTEE"
  | "G3_SERVICE_BLOCKED";

export type SuperPromptCompilationMode =
  | "argo4_ecosystem_framework_sota"
  | "argo4_saas_pilot_dashboard_wave"
  | "argo4_playbook2_tot_rag"
  | "mte_copsoq_forensic_audit"
  | "zero_hallucination_tech_improvements"
  | "arc4_superwave_design_services"
  | "next_wave_saas_ux"
  | "full_audit"
  | "master_vertical_slice"
  | "adversarial_multi_ai"
  | "invariants_rls_guard";

export type Arc4BenchmarkReferenceId =
  | "linear_precision"
  | "stripe_tactile"
  | "vercel_telemetry"
  | "raycast_glass"
  | "apple_hig_reflow";

export type SaasPersonaFocus =
  | "worker_mobile"
  | "sst_ergonomist"
  | "org_manager"
  | "executive_auditor";

export type ViewportProfileId =
  | "mobile_320"
  | "mobile_touch_390"
  | "tablet_field_768"
  | "desktop_console_1440";

export interface TogafKnowledgeNode {
  readonly id: string;
  readonly code: string;
  readonly admPhase: TogafAdmPhaseCode;
  readonly admPhaseLabel: string;
  readonly architectureDomain: TogafArchitectureDomain;
  readonly chainStep: OperationalChainStep;
  readonly title: string;
  readonly guideQuestion: string;
  readonly currentStatus: TogafNodeImplementationStatus;
  readonly targetConsolidationState: string;
  readonly invariantsProtected: readonly number[];
  readonly verificationContracts: readonly string[];
  readonly primaryArtifacts: readonly string[];
  readonly residualRisk: string;
  readonly acceptanceCriteria: readonly string[];
}

export interface TotBranchScore {
  readonly branchId: "Branch A" | "Branch B" | "Branch C";
  readonly label: string;
  readonly description: string;
  readonly invariantValid: boolean;
  readonly pruneReason: string | null;
  readonly thesisScore: number;
  readonly securityScore: number;
  readonly regulatoryRigorScore: number;
  readonly pureMechanismScore: number;
  readonly reversibilityScore: number;
}

export interface EvaluatedTotBranch extends TotBranchScore {
  readonly utilityScore: number;
  readonly isWinner: boolean;
}

export interface MacroWaveSlice {
  readonly waveId: string;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly togafPhases: readonly TogafAdmPhaseCode[];
  readonly architectureDomains: readonly TogafArchitectureDomain[];
  readonly chainLink: Exclude<OperationalChainStep, "cross_cutting">;
  readonly currentStatus: TogafNodeImplementationStatus;
  readonly gateBoundary: GateBoundaryCode;
  readonly objective: string;
  readonly deliverables: readonly string[];
  readonly serverEnforcementRule: string;
  readonly totBranches: readonly TotBranchScore[];
  readonly acceptanceCriteria: readonly string[];
  readonly dependencies: readonly string[];
}

export interface NextWaveSaasTotBranch {
  readonly branchId: "Branch A" | "Branch B" | "Branch C";
  readonly label: string;
  readonly description: string;
  readonly invariantValid: boolean;
  readonly pruneReason: string | null;
  readonly thesisScore: number;
  readonly securityScore: number;
  readonly regulatoryRigorScore: number;
  readonly uxErgonomicsScore: number;
  readonly saasReadinessScore: number;
}

export interface EvaluatedNextWaveSaasTotBranch extends NextWaveSaasTotBranch {
  readonly utilityScore: number;
  readonly isWinner: boolean;
}

export interface NextWaveSaasTrack {
  readonly trackId: string;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly personaFocus: SaasPersonaFocus;
  readonly togafPhases: readonly TogafAdmPhaseCode[];
  readonly chainSteps: readonly OperationalChainStep[];
  readonly gateBoundary: GateBoundaryCode;
  readonly practicalSaasGoal: string;
  readonly uxDesignMandate: string;
  readonly responsiveContract: string;
  readonly totBranches: readonly NextWaveSaasTotBranch[];
  readonly deliverables: readonly string[];
  readonly usabilityMetrics: readonly string[];
}

export interface EvaluatedNextWaveSaasTrack extends NextWaveSaasTrack {
  readonly evaluatedBranches: readonly EvaluatedNextWaveSaasTotBranch[];
  readonly winningBranch: EvaluatedNextWaveSaasTotBranch;
  readonly prunedBranchesCount: number;
}

export interface ViewportUxContract {
  readonly viewportId: ViewportProfileId;
  readonly label: string;
  readonly widthRange: string;
  readonly primaryPersona: string;
  readonly keySurfaces: readonly string[];
  readonly minTouchTargetPx: number;
  readonly maxStickyViewportPct: number;
  readonly gridArchitecture: string;
  readonly typographyScale: string;
  readonly zeroFrictionRules: readonly string[];
  readonly verificationSpec: string;
}

export interface NextWaveSaasPlanSummary {
  readonly policyId: string;
  readonly totalTracks: number;
  readonly averageWinningUtility: number;
  readonly totalViewportContracts: number;
  readonly allMobileTouchCompliant: boolean;
  readonly allStickyCapsCompliant: boolean;
  readonly tracks: readonly EvaluatedNextWaveSaasTrack[];
  readonly viewportContracts: readonly ViewportUxContract[];
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

export interface Arc4VisualBenchmarkItem {
  readonly benchmarkId: Arc4BenchmarkReferenceId;
  readonly code: string;
  readonly referenceName: string;
  readonly patternTitle: string;
  readonly visualEffectSpec: string;
  readonly uxValueAdded: string;
  readonly targetSurfaces: readonly string[];
  readonly cssUtilityContract: string;
  readonly accessibilityGuardrail: string;
  readonly cognitiveLoadReductionPct: number;
  readonly interactionLatencyMs: number;
  readonly antiPatternForbidden: string;
}

export interface Arc4SuperWaveTotBranch {
  readonly branchId: "Branch A" | "Branch B" | "Branch C";
  readonly label: string;
  readonly description: string;
  readonly invariantValid: boolean;
  readonly pruneReason: string | null;
  readonly serviceConsolidationScore: number;
  readonly securityScore: number;
  readonly regulatoryRigorScore: number;
  readonly webDesignBenchmarkScore: number;
  readonly uxValueAddedScore: number;
}

export interface EvaluatedArc4SuperWaveTotBranch extends Arc4SuperWaveTotBranch {
  readonly utilityScore: number;
  readonly isWinner: boolean;
}

export interface Arc4ServiceSuperWaveItem {
  readonly superWaveId: string;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly benchmarkRef: Arc4BenchmarkReferenceId;
  readonly togafPhases: readonly TogafAdmPhaseCode[];
  readonly chainSteps: readonly OperationalChainStep[];
  readonly gateBoundary: GateBoundaryCode;
  readonly serviceConsolidationGoal: string;
  readonly visualEffectValueProposition: string;
  readonly targetRoutes: readonly string[];
  readonly totBranches: readonly Arc4SuperWaveTotBranch[];
  readonly implementationDeliverables: readonly string[];
  readonly verificationCriteria: readonly string[];
}

export interface EvaluatedArc4ServiceSuperWaveItem extends Arc4ServiceSuperWaveItem {
  readonly evaluatedBranches: readonly EvaluatedArc4SuperWaveTotBranch[];
  readonly winningBranch: EvaluatedArc4SuperWaveTotBranch;
  readonly prunedBranchesCount: number;
}

export interface Arc4SuperWaveSummary {
  readonly policyId: string;
  readonly totalSuperWaves: number;
  readonly totalBenchmarks: number;
  readonly averageWinningUtility: number;
  readonly averageCognitiveLoadReductionPct: number;
  readonly maxInteractionLatencyMs: number;
  readonly allReducedMotionProtected: boolean;
  readonly superWaves: readonly EvaluatedArc4ServiceSuperWaveItem[];
  readonly benchmarks: readonly Arc4VisualBenchmarkItem[];
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

export interface PostDocChair {
  readonly id: string;
  readonly order: number;
  readonly code: string;
  readonly chairTitle: string;
  readonly experienceYears: number;
  readonly experienceDomain: string;
  readonly togafDomainFocus: TogafArchitectureDomain;
  readonly epistemicAxiom: string;
  readonly falsifiabilityQuestion: string;
  readonly vetoTrigger: string;
  readonly primaryArtifacts: readonly string[];
}

export interface SuperPromptRubricCriterion {
  readonly id: string;
  readonly code: string;
  readonly dimension: string;
  readonly weightPct: number;
  readonly achievedLevel: 0 | 1 | 2 | 3 | 4 | 5;
  readonly maxLevel: 5;
  readonly objectiveEvidence: string;
  readonly externalCommitteeVerdict: string;
  readonly verificationContract: string;
}

export interface TogafMacroWavePolicy {
  readonly policyId: string;
  readonly version: string;
  readonly approvedGate: "G0";
  readonly targetGate: "G1";
  readonly requiredInvariantsCount: number;
  readonly minimumStateOfTheArtScorePct: number;
  readonly minimumWinningTotScore: number;
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

export interface DomainCoverageStat {
  readonly domain: TogafArchitectureDomain;
  readonly total: number;
  readonly implementedLocal: number;
  readonly partialDraft: number;
  readonly gateBlocked: number;
  readonly readinessPct: number;
}

export interface ChainStepCoverageStat {
  readonly chainStep: OperationalChainStep;
  readonly total: number;
  readonly implementedLocal: number;
  readonly partialDraft: number;
  readonly gateBlocked: number;
  readonly readinessPct: number;
}

export interface TogafKnowledgeTreeSummary {
  readonly policyId: string;
  readonly totalNodes: number;
  readonly implementedLocalCount: number;
  readonly partialDraftCount: number;
  readonly gateBlockedCount: number;
  readonly syntheticReadinessPct: number;
  readonly coveredInvariants: readonly number[];
  readonly allInvariantsCovered: boolean;
  readonly domainStats: readonly DomainCoverageStat[];
  readonly chainStats: readonly ChainStepCoverageStat[];
  readonly realDataAllowed: false;
  readonly g1Approved: false;
  readonly blockers: readonly string[];
}

export interface EvaluatedMacroWaveSlice extends MacroWaveSlice {
  readonly evaluatedBranches: readonly EvaluatedTotBranch[];
  readonly winningBranch: EvaluatedTotBranch;
  readonly prunedBranchesCount: number;
}

export interface MacroWavePlanSummary {
  readonly policyId: string;
  readonly totalSlices: number;
  readonly implementedLocalSlices: number;
  readonly partialDraftSlices: number;
  readonly gateBlockedSlices: number;
  readonly averageWinningUtility: number;
  readonly allChainLinksCovered: boolean;
  readonly slices: readonly EvaluatedMacroWaveSlice[];
  readonly nextPrioritySlice: EvaluatedMacroWaveSlice | null;
  readonly realDataAllowed: false;
}

export interface EvaluatedRubricCriterion extends SuperPromptRubricCriterion {
  readonly weightedPoints: number;
  readonly maxWeightedPoints: number;
}

export interface SuperPromptRubricSummary {
  readonly policyId: string;
  readonly totalChairs: number;
  readonly totalCriteria: number;
  readonly totalWeightPct: number;
  readonly weightSumValid: boolean;
  readonly overallScorePct: number;
  readonly meetsStateOfTheArtThreshold: boolean;
  readonly criteria: readonly EvaluatedRubricCriterion[];
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

const ARCHITECTURE_DOMAINS: readonly TogafArchitectureDomain[] = [
  "business",
  "data",
  "application",
  "technology",
];

const CHAIN_STEPS: readonly OperationalChainStep[] = [
  "measure",
  "contextualize",
  "evaluate",
  "act",
  "evidence",
  "reevaluate",
  "cross_cutting",
];

const REQUIRED_OPERATIONAL_LINKS: readonly Exclude<OperationalChainStep, "cross_cutting">[] = [
  "measure",
  "contextualize",
  "evaluate",
  "act",
  "evidence",
  "reevaluate",
];

export function computeTotBranchUtility(branch: TotBranchScore): number {
  if (!branch.invariantValid) {
    return 0;
  }

  const weighted =
    0.30 * branch.thesisScore +
    0.25 * branch.securityScore +
    0.20 * branch.regulatoryRigorScore +
    0.15 * branch.pureMechanismScore +
    0.10 * branch.reversibilityScore;

  return Math.round(weighted * 10) / 10;
}

export function computeNextWaveSaasTotUtility(branch: NextWaveSaasTotBranch): number {
  if (!branch.invariantValid) {
    return 0;
  }

  const weighted =
    0.25 * branch.thesisScore +
    0.25 * branch.securityScore +
    0.20 * branch.regulatoryRigorScore +
    0.15 * branch.uxErgonomicsScore +
    0.15 * branch.saasReadinessScore;

  return Math.round(weighted * 10) / 10;
}

export function computeArc4SuperWaveTotUtility(branch: Arc4SuperWaveTotBranch): number {
  if (!branch.invariantValid) {
    return 0;
  }

  const weighted =
    0.25 * branch.serviceConsolidationScore +
    0.25 * branch.securityScore +
    0.20 * branch.regulatoryRigorScore +
    0.15 * branch.webDesignBenchmarkScore +
    0.15 * branch.uxValueAddedScore;

  return Math.round(weighted * 10) / 10;
}

export function evaluateTogafKnowledgeTree(
  nodes: readonly TogafKnowledgeNode[],
  policy: TogafMacroWavePolicy,
): TogafKnowledgeTreeSummary {
  const totalNodes = nodes.length;
  const implementedLocalCount = nodes.filter(
    (node) => node.currentStatus === "implemented_local",
  ).length;
  const partialDraftCount = nodes.filter(
    (node) => node.currentStatus === "partial_draft",
  ).length;
  const gateBlockedCount = nodes.filter(
    (node) => node.currentStatus === "gate_blocked",
  ).length;

  const weightedReadiness = nodes.reduce((sum, node) => {
    if (node.currentStatus === "implemented_local") return sum + 1;
    if (node.currentStatus === "partial_draft") return sum + 0.5;
    return sum;
  }, 0);

  const syntheticReadinessPct =
    totalNodes === 0 ? 0 : Math.round((weightedReadiness / totalNodes) * 100);

  const invariantSet = new Set<number>();
  for (const node of nodes) {
    for (const inv of node.invariantsProtected) {
      invariantSet.add(inv);
    }
  }
  const coveredInvariants = [...invariantSet].sort((a, b) => a - b);
  const allInvariantsCovered =
    coveredInvariants.length >= policy.requiredInvariantsCount;

  const domainStats: DomainCoverageStat[] = ARCHITECTURE_DOMAINS.map((domain) => {
    const domainNodes = nodes.filter((node) => node.architectureDomain === domain);
    const total = domainNodes.length;
    const implementedLocal = domainNodes.filter(
      (node) => node.currentStatus === "implemented_local",
    ).length;
    const partialDraft = domainNodes.filter(
      (node) => node.currentStatus === "partial_draft",
    ).length;
    const gateBlocked = domainNodes.filter(
      (node) => node.currentStatus === "gate_blocked",
    ).length;
    const score = domainNodes.reduce((acc, node) => {
      if (node.currentStatus === "implemented_local") return acc + 1;
      if (node.currentStatus === "partial_draft") return acc + 0.5;
      return acc;
    }, 0);

    return {
      domain,
      total,
      implementedLocal,
      partialDraft,
      gateBlocked,
      readinessPct: total === 0 ? 0 : Math.round((score / total) * 100),
    };
  });

  const chainStats: ChainStepCoverageStat[] = CHAIN_STEPS.map((chainStep) => {
    const stepNodes = nodes.filter((node) => node.chainStep === chainStep);
    const total = stepNodes.length;
    const implementedLocal = stepNodes.filter(
      (node) => node.currentStatus === "implemented_local",
    ).length;
    const partialDraft = stepNodes.filter(
      (node) => node.currentStatus === "partial_draft",
    ).length;
    const gateBlocked = stepNodes.filter(
      (node) => node.currentStatus === "gate_blocked",
    ).length;
    const score = stepNodes.reduce((acc, node) => {
      if (node.currentStatus === "implemented_local") return acc + 1;
      if (node.currentStatus === "partial_draft") return acc + 0.5;
      return acc;
    }, 0);

    return {
      chainStep,
      total,
      implementedLocal,
      partialDraft,
      gateBlocked,
      readinessPct: total === 0 ? 0 : Math.round((score / total) * 100),
    };
  });

  const blockers: string[] = [];
  if (!allInvariantsCovered) {
    blockers.push("invariants_coverage_incomplete");
  }
  if (partialDraftCount > 0) {
    blockers.push("partial_consolidation_nodes_pending");
  }
  if (gateBlockedCount > 0) {
    blockers.push("formal_gate_approvals_pending");
  }
  blockers.push("real_data_blocked_until_g3");

  return {
    policyId: policy.policyId,
    totalNodes,
    implementedLocalCount,
    partialDraftCount,
    gateBlockedCount,
    syntheticReadinessPct,
    coveredInvariants,
    allInvariantsCovered,
    domainStats,
    chainStats,
    realDataAllowed: false,
    g1Approved: false,
    blockers,
  };
}

export function evaluateMacroWavePlan(
  slices: readonly MacroWaveSlice[],
  policy: TogafMacroWavePolicy,
): MacroWavePlanSummary {
  const orderedSlices = [...slices].sort((a, b) => a.order - b.order);

  const evaluatedSlices: EvaluatedMacroWaveSlice[] = orderedSlices.map((slice) => {
    const scoredBranches = slice.totBranches.map((branch) => ({
      ...branch,
      utilityScore: computeTotBranchUtility(branch),
      isWinner: false,
    }));

    const maxScore = Math.max(...scoredBranches.map((b) => b.utilityScore), 0);
    const evaluatedBranches: EvaluatedTotBranch[] = scoredBranches.map((branch) => ({
      ...branch,
      isWinner: branch.invariantValid && branch.utilityScore === maxScore && maxScore > 0,
    }));

    const winningBranch =
      evaluatedBranches.find((b) => b.isWinner) ?? evaluatedBranches[0];
    const prunedBranchesCount = evaluatedBranches.filter(
      (b) => !b.invariantValid,
    ).length;

    return {
      ...slice,
      evaluatedBranches,
      winningBranch,
      prunedBranchesCount,
    };
  });

  const totalSlices = evaluatedSlices.length;
  const implementedLocalSlices = evaluatedSlices.filter(
    (s) => s.currentStatus === "implemented_local",
  ).length;
  const partialDraftSlices = evaluatedSlices.filter(
    (s) => s.currentStatus === "partial_draft",
  ).length;
  const gateBlockedSlices = evaluatedSlices.filter(
    (s) => s.currentStatus === "gate_blocked",
  ).length;

  const totalWinningUtility = evaluatedSlices.reduce(
    (acc, slice) => acc + slice.winningBranch.utilityScore,
    0,
  );
  const averageWinningUtility =
    totalSlices === 0
      ? 0
      : Math.round((totalWinningUtility / totalSlices) * 10) / 10;

  const coveredLinks = new Set(evaluatedSlices.map((s) => s.chainLink));
  const allChainLinksCovered = REQUIRED_OPERATIONAL_LINKS.every((link) =>
    coveredLinks.has(link),
  );

  const nextPrioritySlice =
    evaluatedSlices.find((s) => s.currentStatus !== "implemented_local") ??
    evaluatedSlices[0] ??
    null;

  return {
    policyId: policy.policyId,
    totalSlices,
    implementedLocalSlices,
    partialDraftSlices,
    gateBlockedSlices,
    averageWinningUtility,
    allChainLinksCovered,
    slices: evaluatedSlices,
    nextPrioritySlice,
    realDataAllowed: false,
  };
}

export function evaluateNextWaveSaasPlan(
  tracks: readonly NextWaveSaasTrack[],
  viewportContracts: readonly ViewportUxContract[],
  policy: TogafMacroWavePolicy,
): NextWaveSaasPlanSummary {
  const orderedTracks = [...tracks].sort((a, b) => a.order - b.order);

  const evaluatedTracks: EvaluatedNextWaveSaasTrack[] = orderedTracks.map((track) => {
    const scoredBranches = track.totBranches.map((branch) => ({
      ...branch,
      utilityScore: computeNextWaveSaasTotUtility(branch),
      isWinner: false,
    }));

    const maxScore = Math.max(...scoredBranches.map((b) => b.utilityScore), 0);
    const evaluatedBranches: EvaluatedNextWaveSaasTotBranch[] = scoredBranches.map(
      (branch) => ({
        ...branch,
        isWinner:
          branch.invariantValid &&
          branch.utilityScore === maxScore &&
          maxScore > 0,
      }),
    );

    const winningBranch =
      evaluatedBranches.find((b) => b.isWinner) ?? evaluatedBranches[0];
    const prunedBranchesCount = evaluatedBranches.filter(
      (b) => !b.invariantValid,
    ).length;

    return {
      ...track,
      evaluatedBranches,
      winningBranch,
      prunedBranchesCount,
    };
  });

  const totalTracks = evaluatedTracks.length;
  const totalWinningUtility = evaluatedTracks.reduce(
    (sum, track) => sum + track.winningBranch.utilityScore,
    0,
  );
  const averageWinningUtility =
    totalTracks === 0
      ? 0
      : Math.round((totalWinningUtility / totalTracks) * 10) / 10;

  const mobileContracts = viewportContracts.filter(
    (c) => c.viewportId === "mobile_320" || c.viewportId === "mobile_touch_390",
  );
  const allMobileTouchCompliant =
    mobileContracts.length >= 2 &&
    mobileContracts.every((c) => c.minTouchTargetPx >= 44);
  const allStickyCapsCompliant = viewportContracts.every(
    (c) => c.maxStickyViewportPct <= 15,
  );

  return {
    policyId: policy.policyId,
    totalTracks,
    averageWinningUtility,
    totalViewportContracts: viewportContracts.length,
    allMobileTouchCompliant,
    allStickyCapsCompliant,
    tracks: evaluatedTracks,
    viewportContracts,
    realDataAllowed: false,
    g1Approved: false,
  };
}

export function evaluateArc4SuperWavePlan(
  superWaves: readonly Arc4ServiceSuperWaveItem[],
  benchmarks: readonly Arc4VisualBenchmarkItem[],
  policy: TogafMacroWavePolicy,
): Arc4SuperWaveSummary {
  const orderedWaves = [...superWaves].sort((a, b) => a.order - b.order);

  const evaluatedWaves: EvaluatedArc4ServiceSuperWaveItem[] = orderedWaves.map(
    (wave) => {
      const scoredBranches = wave.totBranches.map((branch) => ({
        ...branch,
        utilityScore: computeArc4SuperWaveTotUtility(branch),
        isWinner: false,
      }));

      const maxScore = Math.max(...scoredBranches.map((b) => b.utilityScore), 0);
      const evaluatedBranches: EvaluatedArc4SuperWaveTotBranch[] =
        scoredBranches.map((branch) => ({
          ...branch,
          isWinner:
            branch.invariantValid &&
            branch.utilityScore === maxScore &&
            maxScore > 0,
        }));

      const winningBranch =
        evaluatedBranches.find((b) => b.isWinner) ?? evaluatedBranches[0];
      const prunedBranchesCount = evaluatedBranches.filter(
        (b) => !b.invariantValid,
      ).length;

      return {
        ...wave,
        evaluatedBranches,
        winningBranch,
        prunedBranchesCount,
      };
    },
  );

  const totalSuperWaves = evaluatedWaves.length;
  const totalUtility = evaluatedWaves.reduce(
    (sum, item) => sum + item.winningBranch.utilityScore,
    0,
  );
  const averageWinningUtility =
    totalSuperWaves === 0
      ? 0
      : Math.round((totalUtility / totalSuperWaves) * 10) / 10;

  const totalCognitiveReduction = benchmarks.reduce(
    (sum, item) => sum + item.cognitiveLoadReductionPct,
    0,
  );
  const averageCognitiveLoadReductionPct =
    benchmarks.length === 0
      ? 0
      : Math.round(totalCognitiveReduction / benchmarks.length);

  const maxInteractionLatencyMs =
    benchmarks.length === 0
      ? 0
      : Math.max(...benchmarks.map((item) => item.interactionLatencyMs));

  const allReducedMotionProtected = benchmarks.every(
    (item) =>
      item.accessibilityGuardrail.toLowerCase().includes("reduced-motion") ||
      item.accessibilityGuardrail.toLowerCase().includes("wcag"),
  );

  return {
    policyId: policy.policyId,
    totalSuperWaves,
    totalBenchmarks: benchmarks.length,
    averageWinningUtility,
    averageCognitiveLoadReductionPct,
    maxInteractionLatencyMs,
    allReducedMotionProtected,
    superWaves: evaluatedWaves,
    benchmarks,
    realDataAllowed: false,
    g1Approved: false,
  };
}

export function evaluateSuperPromptRubric(
  criteria: readonly SuperPromptRubricCriterion[],
  chairs: readonly PostDocChair[],
  policy: TogafMacroWavePolicy,
): SuperPromptRubricSummary {
  const totalWeightPct = criteria.reduce((sum, item) => sum + item.weightPct, 0);
  const weightSumValid = totalWeightPct === 100;

  const evaluatedCriteria: EvaluatedRubricCriterion[] = criteria.map((item) => {
    const weightedPoints =
      Math.round(((item.achievedLevel / item.maxLevel) * item.weightPct) * 100) /
      100;
    return {
      ...item,
      weightedPoints,
      maxWeightedPoints: item.weightPct,
    };
  });

  const rawScore = evaluatedCriteria.reduce(
    (sum, item) => sum + item.weightedPoints,
    0,
  );
  const overallScorePct = Math.round(rawScore * 10) / 10;

  const allChairsValid =
    chairs.length >= 8 &&
    chairs.every(
      (chair) =>
        chair.experienceYears >= 20 &&
        chair.falsifiabilityQuestion.trim().length > 10 &&
        chair.vetoTrigger.trim().length > 10,
    );

  const meetsStateOfTheArtThreshold =
    weightSumValid &&
    allChairsValid &&
    overallScorePct >= policy.minimumStateOfTheArtScorePct;

  return {
    policyId: policy.policyId,
    totalChairs: chairs.length,
    totalCriteria: criteria.length,
    totalWeightPct,
    weightSumValid,
    overallScorePct,
    meetsStateOfTheArtThreshold,
    criteria: evaluatedCriteria,
    realDataAllowed: false,
    g1Approved: false,
  };
}

export function togafDomainLabel(domain: TogafArchitectureDomain): string {
  if (domain === "business") return "Negócio & Regulação SST";
  if (domain === "data") return "Dados, Privacidade & Linhagem";
  if (domain === "application") return "Aplicação & Motores Puros";
  return "Tecnologia, RLS & Zero-Trust";
}

export function operationalChainStepLabel(step: OperationalChainStep): string {
  if (step === "measure") return "1. Medir";
  if (step === "contextualize") return "2. Contextualizar (AEP/AET)";
  if (step === "evaluate") return "3. Avaliar (Critérios)";
  if (step === "act") return "4. Agir (Command-Only)";
  if (step === "evidence") return "5. Evidenciar (SHA-256)";
  if (step === "reevaluate") return "6. Reavaliar (PDCA)";
  return "Transversal (Governança & Gate)";
}

export function nodeStatusLabel(status: TogafNodeImplementationStatus): string {
  if (status === "implemented_local") return "Implementado (Sintético/Local)";
  if (status === "partial_draft") return "Consolidação Parcial";
  return "Bloqueado por Gate Formal";
}

export function gateBoundaryLabel(boundary: GateBoundaryCode): string {
  if (boundary === "G0_SYNTHETIC") return "Gate G0 · Sintético Local";
  if (boundary === "G1_SYNTHETIC_READY") return "Gate G1 · Prontidão Sintética";
  if (boundary === "G2_COMMITTEE") return "Gate G2 · Submissão ao Comitê";
  return "Gate G3 · Bloqueado (Sem Dados Reais)";
}

export function saasPersonaLabel(persona: SaasPersonaFocus): string {
  if (persona === "worker_mobile") return "Trabalhador Respondente (Mobile 320px–430px)";
  if (persona === "sst_ergonomist") return "Especialista SST / Ergonomista (AEP/AET)";
  if (persona === "org_manager") return "Gestor de Unidade & Plano de Ação";
  return "Diretoria Compradora, DPO & Comitê Auditor";
}

export function superPromptModeLabel(mode: SuperPromptCompilationMode): string {
  if (mode === "argo4_ecosystem_framework_sota") {
    return "ARGO 4.0 · Ecossistema Integral & Framework Técnico Estado da Arte (8 Camadas ToT ECO-L1..L8 · Kernel Dual-Mode + MTE 2026 + COPSOQ II + Playbook 2.0)";
  }
  if (mode === "argo4_saas_pilot_dashboard_wave") {
    return "ARGO 4.0 · Onda ToT de Consolidação Integral do Dashboard & Piloto de Prestação de Serviço SaaS (7 Sub-Ondas · 8 Bancas Pós-Doc)";
  }
  if (mode === "argo4_playbook2_tot_rag") {
    return "ARGO 4.0 · Auditoria ToT Work Wellbeing Playbook 2.0 + RAG Zero-Alucinação (CC BY-NC-ND 4.0) + UX/EX 120%";
  }
  if (mode === "mte_copsoq_forensic_audit") {
    return "Auditoria Sistêmica · Guia Oficial MTE 2026 (GRO/NR-1) + Manual COPSOQ II (41 Questões / 26 Subescalas)";
  }
  if (mode === "zero_hallucination_tech_improvements") {
    return "Melhorias Técnicas Efetivas (Zero Alucinação de IA) · Conformidade MTE 2026 & Tercis COPSOQ II (2,33 / 3,66)";
  }
  if (mode === "arc4_superwave_design_services") {
    return "Superonda ARC 4.0 · Serviços SaaS, Web Design Benchmark & Efeitos Visuais de Valor";
  }
  if (mode === "next_wave_saas_ux") {
    return "Próxima Onda · Execução Prática SaaS & Excelência UX/UI (320px–1440px)";
  }
  if (mode === "full_audit") {
    return "Completo · Arquitetura TOGAF + 10 Cátedras + Macro-Onda";
  }
  if (mode === "master_vertical_slice") {
    return "Execução MASTER · Fatia Vertical Fable 5";
  }
  if (mode === "adversarial_multi_ai") {
    return "Auditoria Adversarial · Banca Multi-IA & Popperiana";
  }
  return "Guarda Crítica · Invariantes k >= 5, RLS & Anti-Overclaim";
}

export function buildExecutableSuperPrompt(params: {
  readonly mode: SuperPromptCompilationMode;
  readonly policy: TogafMacroWavePolicy;
  readonly treeSummary: TogafKnowledgeTreeSummary;
  readonly waveSummary: MacroWavePlanSummary;
  readonly rubricSummary: SuperPromptRubricSummary;
  readonly chairs: readonly PostDocChair[];
  readonly nodes: readonly TogafKnowledgeNode[];
  readonly slices: readonly EvaluatedMacroWaveSlice[];
  readonly nextWaveSummary?: NextWaveSaasPlanSummary;
  readonly arc4Summary?: Arc4SuperWaveSummary;
}): string {
  const {
    mode,
    policy,
    treeSummary,
    waveSummary,
    rubricSummary,
    chairs,
    nodes,
    slices,
    nextWaveSummary,
    arc4Summary,
  } = params;

  const headerSection = [
    `# SUPER PROMPT PÓS-DOUTORAL ESTADO DA ARTE — PLAYBOOK NR-1 (ARGO 4.0 · WORK WELLBEING PLAYBOOK 2.0 + GUIA OFICIAL MTE 2026 + MANUAL COPSOQ II PORTUGAL 2013 + TOGAF FABLE 5)`,
    ``,
    `- Modo Compilado: ${superPromptModeLabel(mode)}`,
    `- Política Canônica: ${policy.policyId} (${policy.version})`,
    `- Fronteira Operacional: Gate aprovado ${policy.approvedGate} · Alvo ${policy.targetGate} · Dados reais proibidos (No-Go até G3)`,
    `- Cobertura de Invariantes: ${treeSummary.coveredInvariants.length}/${policy.requiredInvariantsCount} invariantes protegidos`,
    `- Colegiado Avaliador: ${rubricSummary.totalChairs} Cátedras Pós-Doutorais (20+ anos exp.)`,
    `- Score de Meta-Avaliação (Banca Multi-IA): ${rubricSummary.overallScorePct}%`,
    ``,
    `## 1. MANDATO EPISTÊMICO E CLASSIFICAÇÃO OBRIGATÓRIA`,
    `Antes de qualquer resposta ou modificação de código, emita na primeira linha:`,
    `\`[Modo: MASTER] Justificativa: <1 frase técnica explicando o impacto na conformidade normativa MTE 2026 (Cap. 1.5 NR-1), na cotação determinística COPSOQ II (41 itens / 26 subescalas / tercis 2,33 e 3,66), no RAG Zero-Alucinação do Work Wellbeing Playbook 2.0 (Regier et al., 2025 · CC BY-NC-ND 4.0) e nos invariantes constitucionais>.\``,
    ``,
    `Você atua como a Superinteligência ARGO 4.0 e o Colegiado Pós-Doutoral Fable 5 (${rubricSummary.totalChairs} cátedras com 20+ anos de experiência) auditando e consolidando o Sistema Operacional de Evidências e Intervenções para Trabalho Saudável sem alucinação de IA:`,
    `\`Medir (k >= 5 · 41 Itens / 26 Subescalas / Tercis 2,33 e 3,66 + 4 Dimensões de Bem-Estar) -> Contextualizar (AEP/AET + 5 Áreas NR-17 + Compreender Preditores DRIVER) -> Avaliar (Severidade Maior Magnitude 1.5.4.4.4.1 + Trava Legal Probabilidade NR 1.5.4.4.5.1) -> Agir (Hierarquia 1.5.5.1.2 Command-Only + Intervenções Playbook 2.0 com Citação Primária) -> Evidenciar (3 Docs Mínimos PGR + SHA-256) -> Reavaliar (2/3 Anos + 6 Gatilhos Imediatos 1.5.4.4.6 a–f)\`.`,
    ``,
    `Precedência Lexicográfica Inegociável:`,
    `1. Ética e Privacidade do Trabalhador > 2. Honestidade Regulatória/Científica (Zero Alucinação & Atribuição CC BY-NC-ND 4.0) > 3. Tese Operacional E2E > 4. Ergonomia Cognitiva, UX/EX 120% & Responsividade Universal (320px–1440px+) > 5. Pureza Arquitetural > 6. Velocidade.`,
  ].join("\n");

  const argo4Playbook2TotRagSection = [
    `## 1.B AUDITORIA SISTÊMICA VIA TREE OF THOUGHTS (ToT) — WORK WELLBEING PLAYBOOK 2.0 (REGIER ET AL., 2025 · CC BY-NC-ND 4.0)`,
    `### 1.B.1 Fonte Primária Auditada e Governança de Licenciamento`,
    `- **Citação Canônica**: *Regier, C., Cunningham, S., Fleming, W., Kirienko, A., Kaats, M., & De Neve, J. (2025). Work Wellbeing Playbook: A Systematic Review of Evidence-Based Interventions to Improve Employee Wellbeing. World Wellbeing Movement.* (Desenvolvido em parceria acadêmica com o Wellbeing Research Centre da University of Oxford; licenciado sob **CC BY-NC-ND 4.0**).`,
    `- **Trava Constitucional de Licenciamento**: Uso estritamente referencial e pedagógico com atribuição explícita aos autores, proibindo uso como selo comercial de validação institucional (\`publicClaimsGuardrail.test.ts\`) e proibindo extrapolação de conteúdo para seções em elaboração.`,
    ``,
    `### 1.B.2 Ciclo Metodológico de 3 Fases (\`Measure -> Understand -> Act\`) e 4 Dimensões Nucleares`,
    `1. **Measure (Medir)**: Avaliar as **4 dimensões centrais de bem-estar subjetivo** (*Job Satisfaction, Happiness, Stress, Sense of Purpose*) em conjunto com os **drivers organizacionais e relacionais**, sob proteção \`k >= 5\`.`,
    `2. **Understand (Compreender)**: Identificar quais drivers predizem com maior força os desfechos dentro do contexto específico da organização, cruzando tercis Amarelo/Vermelho (\`2,33\` / \`3,66\`) do COPSOQ II com a Avaliação Ergonômica Preliminar (AEP — NR-17).`,
    `3. **Act & Evaluate (Agir e Avaliar)**: Selecionar intervenções organizacionais empiricamente fundamentadas e embutir o plano de avaliação longitudinal de eficácia desde o desenho.`,
    ``,
    `### 1.B.3 Taxonomia Integral dos 6 Pilares do Acrônimo \`DRIVER\` (16 Drivers Ativos + 2 Previstos para 2026)`,
    `- **D — Development and Security**: \`achievement\` (*Metas específicas e cooperativas, co-design de avaliação*), \`learning\` (*Aprendizagem integrada ao trabalho diário e análise de necessidades*) e o novo driver completo **\`job_security\` (*Segurança no Trabalho*)** — incluindo o Spotlight *Actual vs. Perceived Job Security* (*De Witte, 1999; Sverke et al., 2002*) e 9 frentes de intervenção (*mercados internos de trabalho [Bidwell, 2011], integração de terceirizados/temporários, gestão cuidadosa de mudanças [Oreg et al., 2011], transparência financeira, rotação planejada de tarefas, planos de retorno ao trabalho [Cancelliere et al., 2016], bem-estar financeiro [EFWPs] apenas como complemento a salários justos, prevenção de demissões com reinvestimento de ganhos de IA [Cascio, 2010] e cuidado humanizado em reestruturações inevitáveis / síndrome do sobrevivente [Kivimäki et al., 2000; Van Dierendonck & Jacobs, 2012]*, apoiados por 60 referências).`,
    `- **R — Relationships**: \`appreciation\` (*Protocolo SAGE: Specific, Appropriate, Genuine, Equitably distributed + Quociente de Decência — DQ*), \`inclusion_belonging\` (*Tríade Diversity, Inclusion e Belonging + mitigação de vieses e mentoria/sponsorship*), \`support\` (*Liderança pró-social [Alan et al., 2023], suporte entre pares e comportamentos familiares suportivos — FSSB [Kelly et al., 2014]*), \`trust\` (*Segurança Psicológica [Edmondson, 1999; Castro et al., 2022], comunicação multicanal e RSC participativa*), \`management\` (*Capacitação de gestores em SST/saúde mental, redução do estresse gerencial e Inteligência Emocional — EI [Hodzic et al., 2018]*) + **\`leadership\` (*Previsto no Playbook 2.0: Março/2026*)**.`,
    `- **I — Independence and Flexibility**: \`flexibility\` (*Opções WFH/híbrido 2–3 dias [Choudhury et al., 2024] com ergonomia doméstica, colaboração presencial intencional e política de desconexão digital*), **\`employee_voice\` (*Voz do Trabalhador*)** (*Comitês de Saúde e Bem-Estar — HaWCs, democracia no trabalho [Battilana et al., 2022] e escuta CIPA*) e **\`autonomy\` (*Autonomia*)** (*Redesenho participativo [Kobayashi et al., 2008] e liderança suportiva à autonomia [Hardré & Reeve, 2009]*).`,
    `- **V — Variety and Fulfilment**: \`energy\` (*Infraestrutura de recuperação, job crafting [Gordon et al., 2018] e prioridade às condições reais de trabalho sobre ações individuais isoladas [Fleming, 2024]*) e \`purpose\` (*Conexão com beneficiários [Allan et al., 2018] e tradução da missão em marcos concretos [Carton, 2018]*).`,
    `- **E — Earnings and Benefits**: \`compensation\` (*Salário digno / living wage [Burmaster et al., 2015], transparência remuneratória [Obloj & Zenger, 2022] e justiça processual*).`,
    `- **R — Risk, Health, and Safety**: \`stress\` (*Prevenção multinível de estresse e burnout [Awa et al., 2010; Fox et al., 2022]*), **\`workload_pressures\` (*Pressões de Carga de Trabalho*)** (*Dimensionamento realista, reuniões curtas e intencionais [Bennett et al., 2021] e reorganização da jornada [Schor et al., 2024]*) + **\`operational_design\` (*Previsto no Playbook 2.0: Abril/2026*)**.`,
    ``,
    `### 1.B.4 Arquitetura da Skill e Motor RAG Determinístico Zero-Alucinação (\`src/lib/governance/playbook2RagEngine.ts\`)`,
    `1. **Indexação Estrita por Citação Primária**: Toda consulta via \`retrievePlaybook2RagResponse\` retorna exclusivamente intervenções catalogadas com autor, ano, periódico, número da referência no Playbook 2.0 e desenho do estudo (\`RCT\`, \`Meta-analysis\`, \`Systematic Review\`, \`Longitudinal\`).`,
    `2. **Crosswalk Triplo Determinístico**: Cada intervenção do Playbook 2.0 vincula-se explicitamente às subescalas da Versão Curta do COPSOQ II (\`SUB-01..SUB-26\`) e aos requisitos mandatórios do Guia Oficial MTE 2026 (\`MTE-REQ-01..10\`).`,
    `3. **Validador Anti-Alucinação (\`validateZeroHallucinationGuardrails\`)**: Bloqueia qualquer saída que contenha percentuais causais não auditados, promessas de conformidade garantida ou uso de instituições acadêmicas como chancela comercial.`,
    `4. **Elevação 120% em UX, EX e Responsividade Universal (\`320px–1440px+\`)**: Filtros táteis pelos 6 pilares \`DRIVER\`, painel interativo \`Measure -> Understand -> Act\`, dinâmica \`PB2-RAG\` em \`DriverWorldPage.tsx\` e assistente \`DriverChatbot.tsx\` com modo estrito de citação primária.`,
    ``,
    `### 1.B.5 Direção de Fotografia Hiper-Realista 8K de Estúdio de Hollywood & Harmonia Visual ToT (\`U_HERO\`)`,
    `1. **Catálogo Canônico de 18 Drivers (\`src/data/argo4DriverHeroPrompts.ts\`)**: Cobre integralmente os **16 drivers ativos** (\`ARGO4-HERO-01..16\`) e os **2 drivers previstos no Roadmap 2026** (\`ARGO4-HERO-17: Leadership\` e \`ARGO4-HERO-18: Operational Design\`), com fotografias reais em proporção \`16:9\` e iluminação cinematográfica de 3 pontos (*Key Light, Fill Light, Rim Light*).`,
    `2. **Equação ToT de Harmonia Visual & UX/EX (\`U_HERO\`)**:`,
    `   \`U_HERO(d) = V_inv(d) * (0.30 * S_correlacao + 0.25 * S_luz_8k + 0.20 * S_harmonia_titulo + 0.15 * S_ux_ex + 0.10 * S_contraste_wcag)\``,
    `3. **Arquitetura Hero Split-Screen Estado da Arte (\`DriverWorldPage.tsx\`)**: Grid assimétrico \`7:5\` (\`lg:grid-cols-12\`), disciplina \`Zero-Pill\`, título balanceado (\`[text-wrap:balance]\`), vitrine fotográfica 8K com scrim graduado WCAG AAA, barra de telemetria tabular de 4 colunas, ficha técnica expansível de iluminação/prompt e modal Lightbox 8K.`,
  ].join("\n");

  const mteCopsoqForensicAuditSection = [
    `## 2. AUDITORIA SISTÊMICA DOS DOIS DOCUMENTOS OFICIAIS ANEXOS (GUIA MTE 2026 + MANUAL COPSOQ II PORTUGAL 2013)`,
    `### 2.1 Auditoria do Instrumento de Pesquisa — Manual COPSOQ II Versão Portuguesa (Silva et al., 2013 — Versão Curta)`,
    `- **Estrutura Canônica Verificada**: A Versão Curta oficial (Tabela 1, p. 12–13; Anexo, p. 27–29) possui exatamente **41 questões distribuídas em 26 subescalas e 8 dimensões principais** (*1. Exigências laborais [4 subescalas]; 2. Organização do trabalho e conteúdo [4 subescalas]; 3. Relações sociais e liderança [6 subescalas]; 4. Interface trabalho-indivíduo [3 subescalas]; 5. Valores no local de trabalho [2 subescalas]; 6. Personalidade/Auto-eficácia [1 subescala]; 7. Saúde e bem-estar [4 subescalas]; 8. Comportamentos ofensivos [2 subescalas]*).`,
    `- **Modelo Tricolor de Cotação por Tercis (p. 11–12)**: Cada subescala é calculada pela **média aritmética simples (1,00 a 5,00)** dos seus itens, dividida em tercis pelos pontos de corte exatos **\`2,33\`** e **\`3,66\`** (\`Verde\` = favorável para a saúde; \`Amarelo\` = situação intermédia; \`Vermelho\` = risco para a saúde), respeitando a polaridade específica do fator (\`protective\` vs. \`risk_exposure\`).`,
    `- **Regras Éticas e Operacionais do Manual (p. 8–10)**: (a) Proibida a inclusão de questões avulsas dentro das subescalas padronizadas; (b) Envolvimento tripartite interno (SST, direção e representação dos trabalhadores/CIPA); (c) Princípio *"avaliar para prevenir"* (qualquer subescala em Amarelo ou Vermelho exige plano de intervenção organizacional); (d) Resposta individual, voluntária e confidencial protegida por \`k >= 5\`.`,
    ``,
    `### 2.2 Auditoria Normativa e Funcional — Guia Oficial MTE 2026 Comentado (Cap. 1.5 NR-1 — GRO/PGR, Portarias MTE 1.419/2024 e 765/2025)`,
    `- **REQ-MTE-01 (Cap. 5.2 e 5.3 — Integração NR-1 + NR-17)**: Cobertura obrigatória das **5 áreas das condições de trabalho da NR-17** (*1. Organização do trabalho; 2. Levantamento/transporte/descarga de materiais; 3. Mobiliário dos postos; 4. Máquinas/equipamentos/ferramentas manuais; 5. Conforto acústico/térmico/iluminação*) + **fatores de riscos psicossociais relacionados ao trabalho**, articulando **AEP** (avaliação preliminar obrigatória) e **AET** (análise aprofundada nos gatilhos do item \`17.3.2\` da NR-17).`,
    `- **REQ-MTE-02 (Cap. 6 e 12.1 — Participação em 4 Momentos e Comunicação de Mão Dupla)**: Consulta e percepção dos trabalhadores na (1) identificação de perigos, (2) avaliação de riscos, (3) adoção de medidas de prevenção e (4) acompanhamento, com comunicação obrigatória dos riscos consolidados no inventário e das medidas, procedimentos e limitações do plano de ação (\`1.5.3.3\`, \`1.5.5.1.3\`).`,
    `- **REQ-MTE-03 (Cap. 9 — Levantamento Preliminar de Perigos e Riscos \`1.5.4.2.1\`)**: Prioridade para evitar/eliminar o perigo antes da exposição ou **agir imediatamente sobre riscos ocupacionais evidentes** sem aguardar avaliação quantitativa ou detalhada.`,
    `- **REQ-MTE-04 (Cap. 10 — Identificação de Perigos com 3 Elementos Obrigatórios \`1.5.4.3.1\` e \`1.5.4.3.2\`)**: Todo registro no inventário exige: **(a) descrição do perigo e possíveis lesões ou agravos; (b) identificação das fontes e/ou circunstâncias; (c) indicação do grupo de trabalhadores expostos (GES/GHE/GHR)**, cobrindo atividades rotineiras, não rotineiras e perigos externos previsíveis.`,
    `- **REQ-MTE-05 (Cap. 11.3 — Regra de Ouro da Severidade \`1.5.4.4.4.1\`)**: Selecionar sempre a consequência de **maior magnitude** (pior cenário possível).`,
    `- **REQ-MTE-06 (Cap. 11.4 — Trava Legal de Probabilidade NR \`1.5.4.4.5.1\` e Probabilidade Ergonômica/Psicossocial \`1.5.4.4.5.3\`)**: O descumprimento de requisito específico previsto em NR eleva automaticamente a probabilidade para a **mais alta gradação prevista no PGR (nível 5)**. Para fatores ergonômicos/psicossociais, a probabilidade combina **(1) duração da exposição**, **(2) intensidade das exigências da atividade** e **(3) eficácia das medidas implementadas** segundo a hierarquia legal (\`1.5.5.1.2\`: Evitar -> Eliminar/Substituir -> Proteção Coletiva -> Medidas Administrativas/Organização do Trabalho -> EPI, vedado EPI isolado como única medida).`,
    `- **REQ-MTE-07 (Cap. 11.5 e 11.6 — Matriz ISO 45002 e Critério de Risco Tolerável \`1.5.4.4.2.2\`)**: Combinação Severidade × Probabilidade gerando níveis \`BAIXO\`, \`MÉDIO\`, \`ALTO\` e \`MUITO ALTO\` (Quadros 4 e 5), com documentação formal dos critérios utilizados no GRO/PGR.`,
    `- **REQ-MTE-08 (Cap. 11.7 — Revisão Periódica 2/3 Anos + 6 Gatilhos Imediatos \`1.5.4.4.6 a–f\`)**: Revisão periódica a cada **2 anos** (ou **3 anos** com certificação SGSST ISO 45001) e revisão imediata obrigatória nas 6 alíneas: \`(a)\` após implementação de medidas para avaliar risco residual; \`(b)\` inovações/modificações/gestão de mudança (incluindo terceirizadas); \`(c)\` inadequação/insuficiência/ineficácia de medidas; \`(d)\` acidentes ou doenças relacionadas ao trabalho; \`(e)\` mudança em requisitos legais; \`(f)\` **solicitação justificada de trabalhadores ou da CIPA**.`,
    `- **REQ-MTE-09 (Cap. 12.2 — 4 Formas de Acompanhamento e Indicadores Proativos + Reativos \`1.5.5.3.2 a–d\`)**: \`(a)\` verificação da execução e continuidade das ações (5 perguntas-chave do MTE); \`(b)\` inspeções de locais e equipamentos; \`(c)\` monitoramento ambiental/exposições; \`(d)\` participação dos trabalhadores e CIPA.`,
    `- **REQ-MTE-10 (Cap. 4 e 13 — Três Documentos Mínimos do PGR)**: (1) **Inventário de Riscos Ocupacionais** (\`1.5.7.1\`/\`1.5.7.3\`); (2) **Plano de Ação** (\`1.5.5.2\`); e (3) **Documento de Critérios Utilizados no GRO/PGR** (\`1.5.4.4.2.2\`).`,
  ].join("\n");

  const zeroHallucinationImprovementsSection = [
    `## 3. SUPER PROMPT DE MELHORIAS TÉCNICAS EFETIVAS (ZERO ALUCINAÇÃO DE IA)`,
    `### 3.1 Regras Estritas Anti-Alucinação para Motores e Copilotos Supervisionados`,
    `1. **Proibição Absoluta de Cálculo Psicossocial ou Regulatório por LLM**: Nenhuma chamada de IA pode calcular médias do COPSOQ II, definir tercis (\`2,33\` / \`3,66\`), estimar severidade/probabilidade da matriz ISO 45002 ou declarar risco tolerável. Todo cálculo ocorre exclusivamente em funções puras determinísticas (\`src/data/copsoqData.ts\`, \`src/lib/governance/mteCopsoqAuditEngine.ts\`, \`src/lib/risk/criteriaEngine.ts\`).`,
    `2. **Fidelidade Estrita às 26 Subescalas da Versão Curta (41 Questões)**: Preservar o mapeamento exato de \`I1..I41\` nas 26 subescalas e 8 dimensões principais da Tabela 1 (p. 12–13) do Manual COPSOQ II Portugal 2013, usando média aritmética \`1,00..5,00\` e tercis \`2,33\` e \`3,66\` por polaridade (\`protective\` vs. \`risk_exposure\`).`,
    `3. **Imposição Determinística das Travas Normativas do Guia Oficial MTE 2026**:`,
    `   - Aplicar \`evaluateMteSeverityGoldenRule\` para garantir seleção da consequência de maior magnitude (\`1.5.4.4.4.1\`);`,
    `   - Aplicar \`evaluateMteProbabilityWithNrLock\` para forçar probabilidade \`5 (Muito Provável)\` quando houver requisito específico de NR descumprido (\`1.5.4.4.5.1\`) e emitir alerta de não-conformidade quando EPI (\`ppe_only\`) for informado como única medida (\`1.5.5.1.2\`);`,
    `   - Aplicar \`evaluateMteReviewTriggers\` para disparar revisão imediata do inventário em qualquer uma das 6 hipóteses legais (\`1.5.4.4.6 a–f\`), incluindo solicitação justificada de trabalhador ou CIPA;`,
    `   - Exigir validação humana com hash \`SHA-256\` antes de qualquer transição de risco residual (alínea \`a\` do item \`1.5.4.4.6\`).`,
    `4. **Rastreabilidade de Fonte Primária Obrigatória**: Cada card, relatório orientativo ou recomendação exibe a cláusula exata da NR-1 / NR-17 e a página/seção correspondente do Guia Oficial MTE 2026 ou do Manual COPSOQ II 2013.`,
  ].join("\n");

  const chairsSection = [
    `## 4. COLEGIADO DAS ${chairs.length} CÁTEDRAS PÓS-DOUTORAIS (FALSIFICABILIDADE POPPERIANA)`,
    ...chairs.map(
      (chair) =>
        `- **${chair.code} · ${chair.chairTitle} (${chair.experienceYears} anos · ${togafDomainLabel(chair.togafDomainFocus)})**\n` +
        `  - Axioma: ${chair.epistemicAxiom}\n` +
        `  - Pergunta de Refutação: *${chair.falsifiabilityQuestion}*\n` +
        `  - Gatilho de Veto (V = 0): ${chair.vetoTrigger}`,
    ),
  ].join("\n");

  const totEquationSection = [
    `## 5. ALGORITMO FORMAL TREE OF THOUGHTS (ToT) COM PODA POR INVARIANTE E ERGONOMIA`,
    `Para cada decisão de arquitetura, serviço SaaS ou efeito visual de UX, avalie 3 ramos ortogonais (B = {Branch A, Branch B, Branch C}):`,
    `- Equação Estrutural: \`U(b) = V(b) * (0.30 * S_tese + 0.25 * S_seg + 0.20 * S_rigor + 0.15 * S_puro + 0.10 * S_rev)\``,
    `- Equação Próxima Onda SaaS & UX: \`U_SaaS(b) = V(b) * (0.25 * S_tese + 0.25 * S_seg + 0.20 * S_rigor + 0.15 * S_ux + 0.15 * S_saas)\``,
    `- Equação Superonda ARC 4.0 (Serviços + Web Design Benchmark): \`U_ARC4(b) = V(b) * (0.25 * S_serv + 0.25 * S_seg + 0.20 * S_rigor + 0.15 * S_design + 0.15 * S_ux_val)\``,
    `Onde V(b) = 0 (poda imediata) se o ramo:`,
    `- expuser microdados individuais ou permitir recorte com k < 5;`,
    `- adulterar as 26 subescalas da Versão Curta (41 questões) ou substituir os tercis oficiais 2,33 e 3,66 por cortes arbitrários;`,
    `- ignorar a Regra de Ouro da Severidade (1.5.4.4.4.1), a Trava Legal de Probabilidade por NR descumprida (1.5.4.4.5.1) ou os 6 gatilhos de revisão imediata (1.5.4.4.6 a–f);`,
    `- substituir AEP/AET ou revisão humana por score de questionário ou saída de IA;`,
    `- reduzir risco residual sem evidência verificada de eficácia pós-implementação;`,
    `- introduzir efeitos visuais sem valor funcional (border-l-4, pílulas em metadados estáticos, animações perpétuas sem prefers-reduced-motion);`,
    `- quebrar reflow em 320px, criar alvos de toque < 44x44px em fluxos móveis, exceder 15% de altura fixa em mobile ou violar WCAG AA;`,
    `- acoplar regra regulatória/psicométrica diretamente em componente React fora de src/lib + src/data;`,
    `- habilitar dados reais, cobrança produtiva aberta ou avanço de gate antes de G3.`,
  ].join("\n");

  const arc4SuperWaveSection = arc4Summary
    ? [
        `## 6. BENCHMARK DE WEB DESIGN & EFEITOS VISUAIS ORIENTADOS A VALOR (${arc4Summary.totalBenchmarks} PADRÕES GLOBAIS · REDUÇÃO MÉDIA DE CARGA COGNITIVA ${arc4Summary.averageCognitiveLoadReductionPct}%)`,
        ...arc4Summary.benchmarks.map(
          (bench) =>
            `- **${bench.code} · ${bench.referenceName} — ${bench.patternTitle}**\n` +
            `  - Especificação Visual & Efeito: ${bench.visualEffectSpec}\n` +
            `  - Valor Real Agregado ao Usuário (UX): ${bench.uxValueAdded}\n` +
            `  - Contrato CSS/Tokens: \`${bench.cssUtilityContract}\` | Latência Máx: \`${bench.interactionLatencyMs}ms\` | Redução Cognitiva: \`-${bench.cognitiveLoadReductionPct}%\`\n` +
            `  - Guardrail de Acessibilidade: ${bench.accessibilityGuardrail}\n` +
            `  - Anti-Padrão Proibido (V = 0): ${bench.antiPatternForbidden}`,
        ),
        ``,
        `## 7. SUPERONDA ARC 4.0 DE CONSOLIDAÇÃO DE SERVIÇOS SaaS (${arc4Summary.totalSuperWaves} FRENTES · UTILIDADE MÉDIA U_ARC4 = ${arc4Summary.averageWinningUtility}/100)`,
        ...arc4Summary.superWaves.map(
          (wave) =>
            `### ${wave.superWaveId} · ${wave.title} (${gateBoundaryLabel(wave.gateBoundary)})` +
            `\n- Subtítulo: ${wave.subtitle} | Fases ADM: ${wave.togafPhases.join(", ")}` +
            `\n- Meta de Consolidação de Serviço: ${wave.serviceConsolidationGoal}` +
            `\n- Proposta de Valor Visual (Benchmark): ${wave.visualEffectValueProposition}` +
            `\n- Rotas Alvo: ${wave.targetRoutes.join(", ")}` +
            `\n- Ramo Vencedor ToT: ${wave.winningBranch.branchId} (${wave.winningBranch.label}) -> Score U_ARC4 = ${wave.winningBranch.utilityScore}/100` +
            `\n- Entregáveis: ${wave.implementationDeliverables.join(" | ")}` +
            `\n- Critérios de Verificação: ${wave.verificationCriteria.join(" | ")}`,
        ),
      ].join("\n\n")
    : "";

  const nextWaveSaasSection = nextWaveSummary
    ? [
        `## 8. ÁRVORE ToT DA PRÓXIMA ONDA: CONSOLIDAÇÃO PRÁTICA SaaS (${nextWaveSummary.totalTracks} TRILHAS · UTILIDADE MÉDIA ${nextWaveSummary.averageWinningUtility}/100)`,
        ...nextWaveSummary.tracks.map(
          (track) =>
            `### ${track.trackId} · ${track.title} (${gateBoundaryLabel(track.gateBoundary)})` +
            `\n- Persona Primária: ${saasPersonaLabel(track.personaFocus)} | Fases ADM: ${track.togafPhases.join(", ")}` +
            `\n- Meta Prática SaaS: ${track.practicalSaasGoal}` +
            `\n- Mandato de Design & UX: ${track.uxDesignMandate}` +
            `\n- Contrato de Responsividade: ${track.responsiveContract}` +
            `\n- Ramo Vencedor ToT: ${track.winningBranch.branchId} (${track.winningBranch.label}) -> Score U_SaaS = ${track.winningBranch.utilityScore}/100` +
            `\n- Entregáveis: ${track.deliverables.join(" | ")}` +
            `\n- Métricas de Usabilidade: ${track.usabilityMetrics.join(" | ")}`,
        ),
        ``,
        `## 9. CONTRATOS MATEMÁTICOS DE UX, USABILIDADE E RESPONSIVIDADE UNIVERSAL (320px A 1440px+)`,
        ...nextWaveSummary.viewportContracts.map(
          (vp) =>
            `- **${vp.label} (${vp.widthRange}) — Persona: ${vp.primaryPersona}**\n` +
            `  - Alvo de Toque/Clique Mínimo: \`${vp.minTouchTargetPx}x${vp.minTouchTargetPx}px\` | Teto Sticky: \`<= ${vp.maxStickyViewportPct}%\` do viewport\n` +
            `  - Arquitetura de Grid: ${vp.gridArchitecture}\n` +
            `  - Escala Tipográfica: ${vp.typographyScale}\n` +
            `  - Regras Zero-Fricção: ${vp.zeroFrictionRules.join("; ")}\n` +
            `  - Verificação: \`${vp.verificationSpec}\``,
        ),
      ].join("\n\n")
    : "";

  const togafTreeSection = [
    `## 10. ÁRVORE DE CONHECIMENTO TOGAF (${treeSummary.totalNodes} NÓS · PRONTIDÃO SINTÉTICA ${treeSummary.syntheticReadinessPct}%)`,
    ...nodes.map(
      (node) =>
        `- **[${node.code}] ${node.admPhase} · ${togafDomainLabel(node.architectureDomain)} · ${operationalChainStepLabel(node.chainStep)}**\n` +
        `  - Nó: ${node.title} (${nodeStatusLabel(node.currentStatus)})\n` +
        `  - Pergunta-Guia: ${node.guideQuestion}\n` +
        `  - Estado Alvo: ${node.targetConsolidationState}\n` +
        `  - Contratos: ${node.verificationContracts.join(", ")}`,
    ),
  ].join("\n");

  const macroWaveSection = [
    `## 11. MACRO-ONDA DE CONSOLIDAÇÃO FUNCIONAL (${waveSummary.totalSlices} SUB-ONDAS E2E · UTILIDADE ToT MÉDIA ${waveSummary.averageWinningUtility})`,
    ...slices.map(
      (slice) =>
        `### ${slice.waveId} · ${slice.title} (${gateBoundaryLabel(slice.gateBoundary)})` +
        `\n- Elo: ${operationalChainStepLabel(slice.chainLink)} | Fases ADM: ${slice.togafPhases.join(", ")}` +
        `\n- Objetivo: ${slice.objective}` +
        `\n- Guarda Server-Side: ${slice.serverEnforcementRule}` +
        `\n- Ramo Vencedor ToT: ${slice.winningBranch.branchId} (${slice.winningBranch.label}) -> Score U = ${slice.winningBranch.utilityScore}/100 (${slice.prunedBranchesCount} ramo(s) podado(s) por invariante)` +
        `\n- Critérios de Aceite: ${slice.acceptanceCriteria.join(" | ")}`,
    ),
  ].join("\n\n");

  const rubricSection = [
    `## 12. RUBRICA DE META-AVALIAÇÃO MULTI-IA (${rubricSummary.totalCriteria} DIMENSÕES · SOMA DE PESOS = ${rubricSummary.totalWeightPct}%)`,
    ...rubricSummary.criteria.map(
      (criterion) =>
        `- **${criterion.code} · ${criterion.dimension}** (Peso ${criterion.weightPct}% · Nível ${criterion.achievedLevel}/${criterion.maxLevel} -> ${criterion.weightedPoints} pts)\n` +
        `  - Evidência: ${criterion.objectiveEvidence}\n` +
        `  - Contrato: \`${criterion.verificationContract}\``,
    ),
  ].join("\n");

  const executionProtocolSection = [
    `## 13. PROTOCOLO DE EXECUÇÃO E DESENVOLVIMENTO DE FATIAS VERTICAIS (PADRÃO OURO ARC 4.0 & FABLE 5)`,
    `1. **Mecanismo Puro (\`src/lib/\`)**: Funções determinísticas sem side-effects e zero \`explicit-any\`.`,
    `2. **Testes Unitários (\`*.test.ts\`)**: Cobrir caminhos felizes, poda de invariantes (V = 0), limites k >= 5, tercis COPSOQ II (\`2,33\` e \`3,66\`) e travas legais MTE 2026.`,
    `3. **Configuração Versionada (\`src/data/\`)**: Políticas, matrizes, 26 subescalas COPSOQ II, requisitos MTE 2026 e benchmarks visuais separados da UI.`,
    `4. **Guarda Server-Side / Runtime**: Preservar RLS deny-by-default, RPCs Command-Only e \`dataGate.ts\` fail-closed.`,
    `5. **Excelência de Web Design, Efeitos Visuais de Valor & UX (\`src/pages/\`, \`src/components/\`, \`src/index.css\`)**:`,
    `   - Superfícies de precisão Linear/Stripe (\`.arc-surface-precision\`, \`.arc-hairline-top\`) com nível único de elevação;`,
    `   - Microinterações táteis (\`.arc-tactile-card\`, \`180ms cubic-bezier(0.16, 1, 0.3, 1)\`) respeitando \`@media (prefers-reduced-motion: reduce)\`;`,
    `   - Telemetria analítica Vercel (\`font-mono tabular-nums\`, \`.arc-telemetry-bar\`) em todos os KPIs, scores, contagens k >= 5 e hashes SHA-256;`,
    `   - Responsividade fluida de 320px a 1440px+ sem overflow horizontal, com alvos >= 44x44px e teto de 15% para barras fixas;`,
    `   - Disciplina Zero-Pill para metadados estáticos (usar separadores \`·\`) e botões segmentados reais para filtros.`,
    `6. **Verificação Integral CI**: \`npm run check:type-strictness\`, \`npx vitest run\`, \`eslint .\` e \`vite build\` 100% verdes.`,
  ].join("\n");

  const ecosystemFrameworkSummary = evaluateArgo4EcosystemFramework();
  const argo4EcosystemFrameworkSection = buildArgo4EcosystemFrameworkSuperPrompt(
    ecosystemFrameworkSummary,
  );
  const saasPilotWaveSummary = evaluateSaasPilotDashboardWave();
  const argo4SaasPilotDashboardSection = buildSaasPilotDashboardSuperPrompt(saasPilotWaveSummary);

  if (mode === "argo4_ecosystem_framework_sota") {
    return [
      argo4EcosystemFrameworkSection,
      argo4SaasPilotDashboardSection,
      argo4Playbook2TotRagSection,
      mteCopsoqForensicAuditSection,
      zeroHallucinationImprovementsSection,
      chairsSection,
      totEquationSection,
      rubricSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "argo4_saas_pilot_dashboard_wave") {
    return [
      argo4SaasPilotDashboardSection,
      argo4Playbook2TotRagSection,
      mteCopsoqForensicAuditSection,
      zeroHallucinationImprovementsSection,
      chairsSection,
      totEquationSection,
      rubricSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "argo4_playbook2_tot_rag") {
    return [
      headerSection,
      argo4Playbook2TotRagSection,
      mteCopsoqForensicAuditSection,
      zeroHallucinationImprovementsSection,
      chairsSection,
      totEquationSection,
      rubricSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "mte_copsoq_forensic_audit") {
    return [
      headerSection,
      mteCopsoqForensicAuditSection,
      chairsSection,
      totEquationSection,
      rubricSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "zero_hallucination_tech_improvements") {
    return [
      headerSection,
      mteCopsoqForensicAuditSection,
      zeroHallucinationImprovementsSection,
      totEquationSection,
      arc4SuperWaveSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "arc4_superwave_design_services") {
    return [
      headerSection,
      chairsSection,
      totEquationSection,
      arc4SuperWaveSection,
      nextWaveSaasSection,
      rubricSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "next_wave_saas_ux") {
    return [
      headerSection,
      chairsSection,
      totEquationSection,
      nextWaveSaasSection,
      rubricSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "master_vertical_slice") {
    return [
      headerSection,
      totEquationSection,
      arc4SuperWaveSection,
      nextWaveSaasSection,
      macroWaveSection,
      executionProtocolSection,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "adversarial_multi_ai") {
    return [
      headerSection,
      chairsSection,
      totEquationSection,
      arc4SuperWaveSection,
      rubricSection,
      `## PROTOCOLO DE AUDITORIA ADVERSARIAL PARA OUTRAS IAs E BANCAS PÓS-DOUTORAIS\nInspecione o repositório procurando refutar cada uma das ${chairs.length} cátedras acima. Qualquer violação de k >= 5, quebra de responsividade em 320px–1440px, efeito visual anti-padrão, overclaim regulatório ou regra hardcoded em JSX invalida o aceite.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (mode === "invariants_rls_guard") {
    const securityChairs = chairs.filter(
      (c) =>
        c.togafDomainFocus === "data" ||
        c.togafDomainFocus === "technology" ||
        c.togafDomainFocus === "business",
    );
    return [
      headerSection,
      `## 2. CÁTEDRAS DE GUARDA CRÍTICA (PRIVACIDADE, RLS & REGULAÇÃO)`,
      ...securityChairs.map(
        (chair) =>
          `- **${chair.code} · ${chair.chairTitle}**: ${chair.falsifiabilityQuestion} (Veto: ${chair.vetoTrigger})`,
      ),
      totEquationSection,
      rubricSection,
    ].join("\n\n");
  }

  return [
    headerSection,
    argo4Playbook2TotRagSection,
    mteCopsoqForensicAuditSection,
    zeroHallucinationImprovementsSection,
    chairsSection,
    totEquationSection,
    arc4SuperWaveSection,
    nextWaveSaasSection,
    togafTreeSection,
    macroWaveSection,
    rubricSection,
    executionProtocolSection,
  ]
    .filter(Boolean)
    .join("\n\n");
}


