import { describe, expect, it } from "vitest";
import {
  STRATEGIA_DOMAIN_TAGS,
  STRATEGIA_NINE_INNOVATIONS,
  STRATEGIA_QUICK_TOPIC_CARDS,
  buildConsultativeServiceRecommendation,
  buildStrategiaAuditPlanStages,
  buildStrategiaDiagnosticTable,
  buildStrategiaDiagnosticTriad,
  buildStrategiaExecutiveDossierMarkdown,
  extractRecognizedSignals,
  getRouteContextualIntelligence,
} from "./agenticWorkspaceSkill";
import {
  HOME_NR1_MODULES_CATALOG,
  buildHomeNr1ModuleInstructionalMarkdown,
  getHomeNr1ModuleById,
} from "@/data/homeNr1ModulesCatalog";
import { buildInstitutionalInstructionalPdf } from "@/lib/documents/institutionalPdfGenerator";
import type { AuroraContext } from "./contextBuilder";

const SAMPLE_CTX: AuroraContext = {
  pathname: "/app/risk",
  org: { id: "org-1", name: "Horizonte Logística S.A." },
  cycle: {
    id: "cycle-1",
    name: "Ciclo Piloto NR-1 2026",
    status: "closed",
    n_responses: 42,
    has_sample: true,
  },
  visibleScores: [
    {
      dimension: "quantitative_demands",
      risk_level: 20,
      severity: 5,
      probability: 4,
      n_responses: 42,
      mean_score: 78,
      unfavorable_percentage: 64,
    },
    {
      dimension: "emotional_demands",
      risk_level: 15,
      severity: 5,
      probability: 3,
      n_responses: 42,
      mean_score: 68,
      unfavorable_percentage: 51,
    },
  ],
  suppressedCount: 1,
  totalDimensions: 3,
  unitsCount: 4,
  cyclesCount: 2,
  k_min: 5,
};

describe("Sra. EstratégIA Agentic Workspace Skill & 5-Star PDF Engine", () => {
  it("exposes exactly 9 agentic innovations for Sra. EstratégIA", () => {
    expect(STRATEGIA_NINE_INNOVATIONS).toHaveLength(9);
    expect(STRATEGIA_NINE_INNOVATIONS.map((i) => i.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("provides domain tags and 4 quick executive topic cards", () => {
    expect(STRATEGIA_DOMAIN_TAGS.length).toBeGreaterThanOrEqual(6);
    expect(STRATEGIA_QUICK_TOPIC_CARDS).toHaveLength(4);
  });

  it("adapts route contextual intelligence (icebreaker question, tags, quick cards, CTAs) to the current page", () => {
    const homeIntel = getRouteContextualIntelligence("/");
    expect(homeIntel.pageTitle).toContain("Página Principal");
    expect(homeIntel.pageBadge).toContain("4 Lentes");
    expect(homeIntel.proactiveIcebreakerQuestion.length).toBeGreaterThan(20);
    expect(homeIntel.contextualQuickCards).toHaveLength(4);
    expect(homeIntel.contextualCtas.length).toBeGreaterThanOrEqual(2);

    const libraryIntel = getRouteContextualIntelligence("/library");
    expect(libraryIntel.pageTitle).toContain("Biblioteca");
    expect(libraryIntel.recommendedTagIds[0]).toBe("playbook_20");

    const riskIntel = getRouteContextualIntelligence("/app/risk");
    expect(riskIntel.pageTitle).toContain("Riscos");
    expect(riskIntel.proactiveIntent).toBe("risk.explain_top3");
  });

  it("provides complete Learning Science & Graphic Instructional Design specifications for all 9 NR-1 modules on HomePage", () => {
    expect(HOME_NR1_MODULES_CATALOG).toHaveLength(9);
    const ids = HOME_NR1_MODULES_CATALOG.map((m) => m.id);
    expect(ids).toEqual([
      "dashboard",
      "company",
      "units",
      "cycles",
      "risk",
      "actions",
      "controls",
      "documents",
      "estrategia",
    ]);

    for (const mod of HOME_NR1_MODULES_CATALOG) {
      const found = getHomeNr1ModuleById(mod.id);
      expect(found.workflowSteps).toHaveLength(4);
      expect(found.auditTable.length).toBeGreaterThanOrEqual(3);
      const md = buildHomeNr1ModuleInstructionalMarkdown(found);
      expect(md).toContain(found.headline);
      expect(md).toContain("| Artefato no Módulo |");
    }
  });

  it("builds the 3 diagnostic triad cards (01 Contexto, 02 Prioridades, 03 Encaminhamento) from live telemetry", () => {
    const triad = buildStrategiaDiagnosticTriad(SAMPLE_CTX, []);
    expect(triad).toHaveLength(3);
    expect(triad[0].number).toBe("01");
    expect(triad[0].status).toBe("ready");
    expect(triad[0].headline).toContain("Horizonte Logística S.A.");
    expect(triad[1].number).toBe("02");
    expect(triad[1].headline).toContain("R20");
    expect(triad[2].number).toBe("03");
    expect(triad[2].ctaTo).toBe("/app/actions");
  });

  it("builds a deterministic SxP diagnostic table linked to Oxford Playbook 2.0 drivers", () => {
    const rows = buildStrategiaDiagnosticTable(SAMPLE_CTX);
    expect(rows).toHaveLength(2);
    expect(rows[0].riskScore).toBe(20);
    expect(rows[0].formula).toBe("S5×P4");
    expect(rows[0].sampleN).toBe(42);
    expect(rows[0].routeTo).toMatch(/^\/drivers\/|^\/app\//);
  });

  it("builds the 4-stage audit plan ('Da dúvida à ação auditável') and consultative neuromarketing recommendation", () => {
    const stages = buildStrategiaAuditPlanStages(SAMPLE_CTX);
    expect(stages).toHaveLength(4);
    expect(stages[0].status).toBe("completed");
    expect(stages[1].status).toBe("completed");
    expect(stages[2].status).toBe("current");

    const rec = buildConsultativeServiceRecommendation(SAMPLE_CTX);
    expect(rec.tierTitle).toContain("Intervenção Assistida");
    expect(rec.deliverables.length).toBeGreaterThanOrEqual(3);
  });

  it("extracts recognized signals and compiles the executive dossier markdown and 5-star PDF", () => {
    const signals = extractRecognizedSignals(SAMPLE_CTX, [], "nr1");
    expect(signals).toContain("NR-1 Cap. 1.5");
    expect(signals.some((s) => s.includes("k>=5"))).toBe(true);

    const md = buildStrategiaExecutiveDossierMarkdown({
      ctx: SAMPLE_CTX,
      history: [],
      lead: {
        organizationName: "Horizonte Logística S.A.",
        sector: "Logística",
        headcountBand: "420 colaboradores",
      },
    });
    expect(md).toContain("Dossiê Executivo Sra. EstratégIA");
    expect(md).toContain("| Rank | Dimensão COPSOQ II |");

    const pdf = buildInstitutionalInstructionalPdf({
      markdown: md,
      filename: "dossie_teste.pdf",
      meta: {
        title: "Dossiê Executivo Sra. EstratégIA",
        orgName: "Horizonte Logística S.A.",
        cycleName: "Ciclo Piloto NR-1 2026",
        kMin: 5,
        responseCount: 42,
      },
    });
    expect(pdf.getNumberOfPages()).toBeGreaterThanOrEqual(2);
  });

  it("routes and answers HomePage funnel questions (NR-28, Cost Simulator, Wellbeing Science, Lei 14.831, 90-Day Roadmap) and maps NR-28 headcount brackets", async () => {
    const [{ routeFreeQuestion }, { answerByIntent }, { getSuggestedQuestions }, { getNr28Grade4BracketByHeadcount }] =
      await Promise.all([
        import("./intentRouter"),
        import("./knowledgeBase"),
        import("./suggestedQuestions"),
        import("@/data/homeConversionData"),
      ]);

    const homeSuggestions = getSuggestedQuestions("/");
    expect(homeSuggestions.length).toBeGreaterThanOrEqual(4);

    const cases: Array<[string, string]> = [
      ["Quais são as multas oficiais da NR-28 e o efeito cascata do FAP?", "home.nr28_benchmark"],
      ["Como funciona o simulador de custos e o resumo executivo?", "home.cost_simulator"],
      ["Como a ciência do bem-estar e os 12 drivers se conectam à NR-1?", "home.wellbeing_science"],
      ["Como a Lei 14.831 funciona no Pulso Regulatório?", "home.regulatory_pulse"],
      ["Como estruturar o plano de 90 dias a partir da prontidão?", "home.roadmap_90d"],
    ];

    for (const [question, expectedIntent] of cases) {
      const routed = routeFreeQuestion(question);
      expect(routed).toBe(expectedIntent);
      const answer = answerByIntent(routed, { ...SAMPLE_CTX, pathname: "/" });
      expect(answer.summary.length).toBeGreaterThan(0);
      expect(answer.whatDataShows.length).toBeGreaterThan(0);
      expect(answer.sources.length).toBeGreaterThan(0);
    }

    expect(getNr28Grade4BracketByHeadcount(8).minBrl).toBe(2396.35);
    expect(getNr28Grade4BracketByHeadcount(80).label).toBe("51 a 100 empregados");
    expect(getNr28Grade4BracketByHeadcount(500).label).toBe("251 a 500 empregados");
    expect(getNr28Grade4BracketByHeadcount(2000).maxBrl).toBe(6708.09);
  });
});
