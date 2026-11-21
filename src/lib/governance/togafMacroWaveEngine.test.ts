import { describe, expect, it } from "vitest";
import {
  buildExecutableSuperPrompt,
  computeArc4SuperWaveTotUtility,
  computeNextWaveSaasTotUtility,
  computeTotBranchUtility,
  evaluateArc4SuperWavePlan,
  evaluateMacroWavePlan,
  evaluateNextWaveSaasPlan,
  evaluateSuperPromptRubric,
  evaluateTogafKnowledgeTree,
} from "@/lib/governance/togafMacroWaveEngine";
import {
  evaluateMteCopsoqSystemicAudit,
  evaluateMteProbabilityWithNrLock,
  evaluateMteReviewTriggers,
  evaluateMteRiskMatrixIso45002,
  evaluateMteSeverityGoldenRule,
} from "@/lib/governance/mteCopsoqAuditEngine";
import {
  evaluatePlaybook2TotAudit,
  retrievePlaybook2RagResponse,
  validateZeroHallucinationGuardrails,
} from "@/lib/governance/playbook2RagEngine";
import {
  COPSOQ_OFFICIAL_SHORT_SUBSCALES,
  COPSOQ_TERTILE_HIGH_CUTOFF,
  COPSOQ_TERTILE_LOW_CUTOFF,
  copsoqItems,
  computeOfficialShortSubscales,
  evaluateCopsoqTertileBand,
} from "@/data/copsoqData";
import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import {
  arc4ServiceSuperWaves,
  arc4SuperWaveSummary,
  arc4VisualBenchmarks,
  copsoqManualAuditFindingsCatalog,
  macroWavePlanSummary,
  macroWaveSlices,
  mte2026AuditRequirementsCatalog,
  nextWaveSaasPlanSummary,
  nextWaveSaasTracks,
  postDocChairs,
  superPromptRubricCriteria,
  superPromptRubricSummary,
  togafKnowledgeNodes,
  togafKnowledgeTreeSummary,
  togafMacroWavePolicy,
  viewportUxContracts,
} from "@/data/togafMacroWaveSuperPrompt";

describe("togafMacroWaveEngine & mteCopsoqAuditEngine", () => {
  it("evaluates the TOGAF knowledge tree covering all 4 domains and all 14 invariants while keeping real data blocked", () => {
    const summary = evaluateTogafKnowledgeTree(
      togafKnowledgeNodes,
      togafMacroWavePolicy,
    );

    expect(summary.totalNodes).toBe(12);
    expect(summary.coveredInvariants).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
    expect(summary.allInvariantsCovered).toBe(true);
    expect(summary.domainStats).toHaveLength(4);
    expect(summary.domainStats.every((d) => d.total > 0)).toBe(true);
    expect(summary.realDataAllowed).toBe(false);
    expect(summary.g1Approved).toBe(false);
    expect(summary.blockers).toContain("real_data_blocked_until_g3");
  });

  it("prunes ToT branches that violate invariants (utility = 0) and selects the canonical Fable 5 branch across all 6 operational links", () => {
    const prunedUtility = computeTotBranchUtility({
      branchId: "Branch A",
      label: "Client-side k>=5 filter",
      description: "Violates microdata isolation",
      invariantValid: false,
      pruneReason: "Violates Invariant 1 and 3",
      thesisScore: 100,
      securityScore: 100,
      regulatoryRigorScore: 100,
      pureMechanismScore: 100,
      reversibilityScore: 100,
    });
    expect(prunedUtility).toBe(0);

    const waveSummary = evaluateMacroWavePlan(
      macroWaveSlices,
      togafMacroWavePolicy,
    );

    expect(waveSummary.totalSlices).toBe(6);
    expect(waveSummary.allChainLinksCovered).toBe(true);
    expect(waveSummary.realDataAllowed).toBe(false);
    expect(waveSummary.averageWinningUtility).toBeGreaterThanOrEqual(
      togafMacroWavePolicy.minimumWinningTotScore,
    );

    for (const slice of waveSummary.slices) {
      expect(slice.winningBranch.branchId).toBe("Branch B");
      expect(slice.winningBranch.invariantValid).toBe(true);
      expect(slice.prunedBranchesCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("evaluates the Next-Wave Practical SaaS & UX ToT plan (S1-S6) and enforces 320px-1440px viewport ergonomics", () => {
    const prunedSaasBranch = computeNextWaveSaasTotUtility({
      branchId: "Branch A",
      label: "Desktop-only layout withconfetti",
      description: "Breaks 320px reflow and uses gamification",
      invariantValid: false,
      pruneReason: "Violates Invariants 12 and 13",
      thesisScore: 100,
      securityScore: 100,
      regulatoryRigorScore: 100,
      uxErgonomicsScore: 100,
      saasReadinessScore: 100,
    });
    expect(prunedSaasBranch).toBe(0);

    const nextWave = evaluateNextWaveSaasPlan(
      nextWaveSaasTracks,
      viewportUxContracts,
      togafMacroWavePolicy,
    );

    expect(nextWave.totalTracks).toBe(6);
    expect(nextWave.totalViewportContracts).toBe(4);
    expect(nextWave.allMobileTouchCompliant).toBe(true);
    expect(nextWave.allStickyCapsCompliant).toBe(true);
    expect(nextWave.averageWinningUtility).toBeGreaterThanOrEqual(95);
    expect(nextWave.realDataAllowed).toBe(false);
    expect(nextWave.g1Approved).toBe(false);

    for (const track of nextWave.tracks) {
      expect(track.winningBranch.branchId).toBe("Branch B");
      expect(track.prunedBranchesCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("evaluates the ARC 4.0 Super-Wave (SUPERONDA-A1 to A6) and Web Design Benchmark (BENCH-01 to 05) with reduced-motion protection", () => {
    const prunedArc4Branch = computeArc4SuperWaveTotUtility({
      branchId: "Branch A",
      label: "Cosmetic blur over n < 5 microdata",
      description: "Violates server-side k >= 5",
      invariantValid: false,
      pruneReason: "Violates Invariants 1 and 3",
      serviceConsolidationScore: 100,
      securityScore: 100,
      regulatoryRigorScore: 100,
      webDesignBenchmarkScore: 100,
      uxValueAddedScore: 100,
    });
    expect(prunedArc4Branch).toBe(0);

    const arc4 = evaluateArc4SuperWavePlan(
      arc4ServiceSuperWaves,
      arc4VisualBenchmarks,
      togafMacroWavePolicy,
    );

    expect(arc4.totalSuperWaves).toBe(6);
    expect(arc4.totalBenchmarks).toBe(5);
    expect(arc4.averageWinningUtility).toBeGreaterThanOrEqual(97);
    expect(arc4.averageCognitiveLoadReductionPct).toBeGreaterThanOrEqual(30);
    expect(arc4.maxInteractionLatencyMs).toBeLessThanOrEqual(150);
    expect(arc4.allReducedMotionProtected).toBe(true);
    expect(arc4.realDataAllowed).toBe(false);
    expect(arc4.g1Approved).toBe(false);

    for (const wave of arc4.superWaves) {
      expect(wave.winningBranch.branchId).toBe("Branch B");
      expect(wave.prunedBranchesCount).toBeGreaterThanOrEqual(1);
    }
  });

  it("validates the 10-criteria multi-AI rubric and 10 post-doctoral chairs with exact 100% weight sum", () => {
    const rubric = evaluateSuperPromptRubric(
      superPromptRubricCriteria,
      postDocChairs,
      togafMacroWavePolicy,
    );

    expect(rubric.totalChairs).toBe(10);
    expect(rubric.totalCriteria).toBe(10);
    expect(rubric.totalWeightPct).toBe(100);
    expect(rubric.weightSumValid).toBe(true);
    expect(rubric.overallScorePct).toBe(100);
    expect(rubric.meetsStateOfTheArtThreshold).toBe(true);
    expect(rubric.realDataAllowed).toBe(false);
    expect(rubric.g1Approved).toBe(false);
  });

  it("validates the official COPSOQ II Portugal 2013 Short Version (41 items, 26 subscales, 8 main dimensions) and exact tertile cutoffs (2.33 and 3.66)", () => {
    expect(copsoqItems).toHaveLength(41);
    expect(COPSOQ_OFFICIAL_SHORT_SUBSCALES).toHaveLength(26);
    expect(exploratoryInstrumentDraft.itemCount).toBe(41);
    expect(exploratoryInstrumentDraft.subscaleCount).toBe(26);
    expect(COPSOQ_TERTILE_LOW_CUTOFF).toBe(2.33);
    expect(COPSOQ_TERTILE_HIGH_CUTOFF).toBe(3.66);

    // Polaridade protetora (ex.: Possibilidades de desenvolvimento): > 3,66 = verde; 2,33..3,66 = amarelo; < 2,33 = vermelho
    expect(evaluateCopsoqTertileBand(4.0, "protective")).toBe("verde");
    expect(evaluateCopsoqTertileBand(3.0, "protective")).toBe("amarelo");
    expect(evaluateCopsoqTertileBand(2.0, "protective")).toBe("vermelho");

    // Polaridade de exposição de risco (ex.: Insegurança laboral): < 2,33 = verde; 2,33..3,66 = amarelo; > 3,66 = vermelho
    expect(evaluateCopsoqTertileBand(2.0, "risk_exposure")).toBe("verde");
    expect(evaluateCopsoqTertileBand(3.0, "risk_exposure")).toBe("amarelo");
    expect(evaluateCopsoqTertileBand(4.0, "risk_exposure")).toBe("vermelho");

    const subscaleResults = computeOfficialShortSubscales({
      I1: 5,
      I2: 4, // média 4.50 em Exigências quantitativas -> vermelho
      I8: 5,
      I9: 4, // média 4.50 em Possibilidades de desenvolvimento -> verde
      I28: 4, // média 4.00 em Insegurança laboral -> vermelho
      I29: 5, // Saúde geral Excelente (5) -> verde
    });

    expect(subscaleResults).toHaveLength(26);
    const quant = subscaleResults.find((s) => s.subscaleId === "exigencias_quantitativas");
    const dev = subscaleResults.find((s) => s.subscaleId === "possibilidades_desenvolvimento");
    const insec = subscaleResults.find((s) => s.subscaleId === "inseguranca_laboral");
    const health = subscaleResults.find((s) => s.subscaleId === "saude_geral");

    expect(quant?.meanScore).toBe(4.5);
    expect(quant?.tertileBand).toBe("vermelho");
    expect(quant?.requiresPreventiveAction).toBe(true);

    expect(dev?.meanScore).toBe(4.5);
    expect(dev?.tertileBand).toBe("verde");
    expect(dev?.requiresPreventiveAction).toBe(false);

    expect(insec?.meanScore).toBe(4);
    expect(insec?.tertileBand).toBe("vermelho");

    expect(health?.meanScore).toBe(5);
    expect(health?.tertileBand).toBe("verde");
  });

  it("enforces the MTE 2026 Official Guide rules (1.5.4.4.4.1 Severity Golden Rule, 1.5.4.4.5.1 NR Probability Lock, PPE-only warning, and 1.5.4.4.6 a-f immediate review triggers)", () => {
    expect(evaluateMteSeverityGoldenRule([1, 3, 5, 2])).toBe(5);

    const nrLock = evaluateMteProbabilityWithNrLock({
      specificNrRequirementViolated: true,
      exposureDurationLevel: 2,
      activityDemandIntensityLevel: 2,
      highestImplementedControl: "collective_engineering",
      controlMaintainedAndVerified: true,
    });
    expect(nrLock.probability).toBe(5);
    expect(nrLock.nrLegalLockApplied).toBe(true);

    const ppeOnly = evaluateMteRiskMatrixIso45002({
      consequenceMagnitudes: [2, 4],
      specificNrRequirementViolated: false,
      exposureDurationLevel: 4,
      activityDemandIntensityLevel: 4,
      highestImplementedControl: "ppe_only",
      controlMaintainedAndVerified: true,
    });
    expect(ppeOnly.severity).toBe(4);
    expect(ppeOnly.probability).toBe(4);
    expect(ppeOnly.ppeOnlyWarning).toBe(true);
    expect(ppeOnly.riskLevel).toBe("MUITO_ALTO");

    const cipaReview = evaluateMteReviewTriggers({
      hasValidSgsstIso45001Certification: true,
      activeTriggers: ["f_worker_or_cipa_justified_request"],
    });
    expect(cipaReview.periodicReviewYears).toBe(3);
    expect(cipaReview.immediateReviewRequired).toBe(true);
    expect(cipaReview.workerCipaTriggered).toBe(true);

    const systemicAudit = evaluateMteCopsoqSystemicAudit(
      mte2026AuditRequirementsCatalog,
      copsoqManualAuditFindingsCatalog,
    );
    expect(systemicAudit.summary.mteTotalRequirements).toBe(12);
    expect(systemicAudit.summary.mteCompliancePct).toBe(100);
    expect(systemicAudit.summary.copsoqAllItemsMappedTo26Subscales).toBe(true);
    expect(systemicAudit.summary.copsoqZeroHallucinationCompliant).toBe(true);
    expect(systemicAudit.summary.realDataAllowed).toBe(false);
  });

  it("compiles deterministic executable super prompts including mte_copsoq_forensic_audit, zero_hallucination_tech_improvements, arc4_superwave_design_services and next_wave_saas_ux modes", () => {
    const auditPrompt = buildExecutableSuperPrompt({
      mode: "mte_copsoq_forensic_audit",
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

    expect(auditPrompt).toContain("[Modo: MASTER]");
    expect(auditPrompt).toContain("41 questões distribuídas em 26 subescalas e 8 dimensões principais");
    expect(auditPrompt).toContain("2,33");
    expect(auditPrompt).toContain("3,66");
    expect(auditPrompt).toContain("REQ-MTE-05 (Cap. 11.3 — Regra de Ouro da Severidade");
    expect(auditPrompt).toContain("REQ-MTE-06 (Cap. 11.4 — Trava Legal de Probabilidade NR");

    const zeroHallucinationPrompt = buildExecutableSuperPrompt({
      mode: "zero_hallucination_tech_improvements",
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

    expect(zeroHallucinationPrompt).toContain("SUPER PROMPT DE MELHORIAS TÉCNICAS EFETIVAS (ZERO ALUCINAÇÃO DE IA)");
    expect(zeroHallucinationPrompt).toContain("evaluateMteSeverityGoldenRule");
    expect(zeroHallucinationPrompt).toContain("evaluateMteProbabilityWithNrLock");

    const arc4Prompt = buildExecutableSuperPrompt({
      mode: "arc4_superwave_design_services",
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

    expect(arc4Prompt).toContain("U_ARC4(b) = V(b) * (0.25 * S_serv");
    expect(arc4Prompt).toContain("BENCH-01 · Linear Precision Surfaces");
    expect(arc4Prompt).toContain("SUPERONDA-A1");
    expect(arc4Prompt).toContain("Dados reais proibidos (No-Go até G3)");

    const argo4PlaybookPrompt = buildExecutableSuperPrompt({
      mode: "argo4_playbook2_tot_rag",
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

    expect(argo4PlaybookPrompt).toContain(
      "AUDITORIA SISTÊMICA VIA TREE OF THOUGHTS (ToT) — WORK WELLBEING PLAYBOOK 2.0",
    );
    expect(argo4PlaybookPrompt).toContain("CC BY-NC-ND 4.0");
    expect(argo4PlaybookPrompt).toContain("job_security");
    expect(argo4PlaybookPrompt).toContain("employee_voice");
    expect(argo4PlaybookPrompt).toContain("workload_pressures");
  });

  it("evaluates the Playbook 2.0 ToT audit (6 DRIVER pillars, 16 active drivers, 2 roadmap drivers) and runs the deterministic Zero-Hallucination Citation-Grounded RAG engine", () => {
    const audit = evaluatePlaybook2TotAudit();
    expect(audit.totalPillars).toBe(6);
    expect(audit.totalActiveDrivers).toBe(16);
    expect(audit.totalRoadmapDrivers).toBe(2);
    expect(audit.evaluatedNodes).toHaveLength(4);
    expect(audit.averageWinningTotUtility).toBeGreaterThanOrEqual(98);
    expect(audit.zeroHallucinationEnforced).toBe(true);
    expect(audit.licenseCode).toBe("CC BY-NC-ND 4.0");

    const jobSecRag = retrievePlaybook2RagResponse({
      driverSlug: "job_security",
      query: "reestruturação mercados internos sobrevivente",
    });
    expect(jobSecRag.matchedPillar?.code).toBe("D");
    expect(jobSecRag.matchedCitations.length).toBeGreaterThan(0);
    expect(jobSecRag.zeroHallucinationVerified).toBe(true);
    expect(jobSecRag.groundedMarkdownResponse).toContain("CC BY-NC-ND 4.0");

    const checkValid = validateZeroHallucinationGuardrails(
      jobSecRag.groundedMarkdownResponse,
    );
    expect(checkValid.valid).toBe(true);

    const checkInvalid = validateZeroHallucinationGuardrails(
      "Este sistema garante conformidade total e é validado por Oxford.",
    );
    expect(checkInvalid.valid).toBe(false);
    expect(checkInvalid.violations.length).toBeGreaterThanOrEqual(2);
  });

  it("evaluates the 18-driver ARGO 4.0 Hollywood 8K Hero Prompt Catalog (16 active + 2 roadmap 2026) and verifies U_HERO ToT harmony scores", async () => {
    const {
      evaluateArgo4HeroPromptCatalog,
      getArgo4DriverHeroSpec,
      computeHeroTotHarmonyScore,
    } = await import("@/data/argo4DriverHeroPrompts");

    const catalog = evaluateArgo4HeroPromptCatalog();
    expect(catalog.totalSpecs).toBe(18);
    expect(catalog.activeDriversCount).toBe(16);
    expect(catalog.roadmap2026Count).toBe(2);
    expect(catalog.allInvariantsValid).toBe(true);
    expect(catalog.averageHarmonyUtilityScore).toBeGreaterThanOrEqual(98);

    const mgmtSpec = getArgo4DriverHeroSpec("management");
    expect(mgmtSpec.specId).toBe("ARGO4-HERO-01");
    expect(mgmtSpec.cameraOpticsSpec.aspectRatio).toBe("16:9");
    expect(mgmtSpec.utilityScore).toBeGreaterThanOrEqual(98);

    const leadershipSpec = getArgo4DriverHeroSpec("leadership");
    expect(leadershipSpec.isRoadmap2026).toBe(true);
    expect(leadershipSpec.specId).toBe("ARGO4-HERO-17");

    // Invariant veto check (V_inv = 0 => U_HERO = 0)
    const prunedScore = computeHeroTotHarmonyScore({
      ...mgmtSpec,
      totHarmonyScores: {
        ...mgmtSpec.totHarmonyScores,
        invariantValid: false,
      },
    });
    expect(prunedScore).toBe(0);
  });

  it("evaluates the ARGO 4.0 SaaS Service Pilot & Dashboard Consolidation Wave (7 sub-waves PILOT-W1..W7, 8 post-doctoral committee chairs, and Super Prompt compilation)", async () => {
    const {
      evaluateSaasPilotDashboardWave,
      computeSaasPilotTotUtility,
      buildSaasPilotDashboardSuperPrompt,
    } = await import("@/lib/governance/saasPilotDashboardWaveEngine");

    const summary = evaluateSaasPilotDashboardWave();
    expect(summary.totalSubWaves).toBe(7);
    expect(summary.averageWinningUtility).toBeGreaterThanOrEqual(98);
    expect(summary.committeeOverallScorePct).toBeGreaterThanOrEqual(98);
    expect(summary.totalWeightPct).toBe(100);
    expect(summary.checklistItems).toHaveLength(7);
    expect(summary.realDataAllowed).toBe(false);
    expect(summary.g1Approved).toBe(false);

    // Every sub-wave must prune at least one invariant-violating branch (V_inv = 0)
    for (const wave of summary.subWaves) {
      expect(wave.prunedBranchesCount).toBeGreaterThanOrEqual(1);
      expect(wave.winningBranch.branchId).toBe("Branch B");
      expect(wave.winningBranch.utilityScore).toBeGreaterThanOrEqual(98);
    }

    expect(
      computeSaasPilotTotUtility({
        branchId: "Branch A",
        label: "Violates k >= 5",
        description: "Exposes n < 5",
        invariantValid: false,
        pruneReason: "Violates k >= 5",
        e2eDashboardScore: 95,
        uxUsabilityScore: 95,
        mteCopsoqRigorScore: 95,
        responsibilitySecurityScore: 95,
        zeroHallucinationAiScore: 95,
      }),
    ).toBe(0);

    const standalonePrompt = buildSaasPilotDashboardSuperPrompt(summary);
    expect(standalonePrompt).toContain("[Modo: MASTER]");
    expect(standalonePrompt).toContain("PILOT-W1");
    expect(standalonePrompt).toContain("PILOT-W7");
    expect(standalonePrompt).toContain("U_PILOT(b) = V_inv(b)");

    const compiledFromEngine = buildExecutableSuperPrompt({
      mode: "argo4_saas_pilot_dashboard_wave",
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
    expect(compiledFromEngine).toContain(
      "ONDA DE CONSOLIDAÇÃO INTEGRAL DO DASHBOARD & PILOTO REAL DE PRESTAÇÃO DE SERVIÇO SaaS B2B",
    );
  });

  it("evaluates the ARGO 4.0 Ecosystem & State-of-the-Art Technical Framework (8 layers ECO-L1..L8, U_ECO utility equation, and Super Prompt compilation)", async () => {
    const {
      evaluateArgo4EcosystemFramework,
      computeEcosystemTotUtility,
      buildArgo4EcosystemFrameworkSuperPrompt,
    } = await import("@/lib/governance/argo4EcosystemFrameworkEngine");

    const ecoSummary = evaluateArgo4EcosystemFramework();
    expect(ecoSummary.totalLayers).toBe(8);
    expect(ecoSummary.averageWinningUtility).toBeGreaterThanOrEqual(98.5);
    expect(ecoSummary.allLayersVerified).toBe(true);
    expect(ecoSummary.realDataAllowed).toBe(false);
    expect(ecoSummary.g1Approved).toBe(false);

    for (const layer of ecoSummary.layers) {
      expect(layer.prunedBranchesCount).toBeGreaterThanOrEqual(1);
      expect(layer.winningBranch.branchId).toBe("Branch B");
      expect(layer.winningBranch.utilityScore).toBeGreaterThanOrEqual(98);
    }

    expect(
      computeEcosystemTotUtility({
        branchId: "Branch A",
        label: "Pruned invariant",
        description: "Violates invariant",
        invariantValid: false,
        pruneReason: "Pruned",
        archPurityScore: 99,
        runtimeResilienceScore: 99,
        regulatoryPsychometricScore: 99,
        uxDesignSotaScore: 99,
        ciVerifiabilityScore: 99,
      }),
    ).toBe(0);

    const standaloneEcoPrompt = buildArgo4EcosystemFrameworkSuperPrompt(ecoSummary);
    expect(standaloneEcoPrompt).toContain("[Modo: MASTER]");
    expect(standaloneEcoPrompt).toContain("ECO-L1");
    expect(standaloneEcoPrompt).toContain("ECO-L8");
    expect(standaloneEcoPrompt).toContain("U_ECO(b) = V_inv(b)");

    const compiledEcoPrompt = buildExecutableSuperPrompt({
      mode: "argo4_ecosystem_framework_sota",
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
    expect(compiledEcoPrompt).toContain(
      "ECOSSISTEMA INTEGRAL & FRAMEWORK DETERMINÍSTICO PLAYBOOK NR-1",
    );
  });
});





