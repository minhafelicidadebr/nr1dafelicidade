import test from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_KNOWLEDGE_DOCUMENTS,
  MTE_2026_CANONICAL_CHAPTERS,
  PLAYBOOK_PILLAR_CATALOG,
  filterMte2026Chapters,
  filterScientificArticles,
  normalizeSearchText,
  scientificArticles,
} from "./scientificArticles";
import {
  NR1_LEARNING_SCIENCE_CATALOG,
  getNr1LearningScienceTopic,
  type Nr1LearningScienceTopicId,
} from "./nr1LearningScienceCatalog";

test("Zero-Hallucination Playbook 2.0 catalog: every article has verified citation, pillar, tier, and external link", () => {
  assert.ok(scientificArticles.length >= 30, "Should catalog at least 30 verified Playbook 2.0 studies");
  const validPillars = new Set(PLAYBOOK_PILLAR_CATALOG.map((p) => p.code));

  for (const article of scientificArticles) {
    assert.ok(article.id.trim().length > 0);
    assert.ok(article.title.trim().length > 5);
    assert.ok(article.authors.trim().length > 2);
    assert.ok(article.year >= 1970 && article.year <= 2026);
    assert.ok(article.url.startsWith("https://"), `Invalid URL on ${article.id}: ${article.url}`);
    assert.ok(validPillars.has(article.playbookPillar), `Invalid pillar on ${article.id}`);
    assert.ok(
      article.playbookCitationRef.includes("Playbook 2.0"),
      `Missing Playbook 2.0 citation locator on ${article.id}`,
    );
    assert.ok(article.tier.trim().length > 0, `Missing evidence tier on ${article.id}`);
    assert.ok(article.mte2026Crosswalk.includes("NR-1") || article.mte2026Crosswalk.includes("NR-17"));
    assert.ok(article.canonicalDocUrl.endsWith(".md"));
  }
});

test("Canonical MTE 2026 Manual Knowledge Base: indexes all 19 chapters sequentially", () => {
  assert.equal(MTE_2026_CANONICAL_CHAPTERS.length, 19);
  MTE_2026_CANONICAL_CHAPTERS.forEach((chapter, index) => {
    assert.equal(chapter.chapterNumber, index + 1);
    assert.ok(chapter.nr1Clauses.length >= 1);
    assert.ok(chapter.pedagogicalSummary.length > 30);
    assert.ok(chapter.auditorInspectionFocus.length > 20);
    assert.ok(chapter.learningSciencePrinciple.length > 20);
    assert.ok(chapter.appRoute.startsWith("/"));
  });
  assert.equal(CANONICAL_KNOWLEDGE_DOCUMENTS.length, 2);
});

test("Multi-facet accent-insensitive search and filtering works for articles and MTE 2026 chapters", () => {
  assert.equal(normalizeSearchText("Avaliação Ergonômica Preliminar"), "avaliacao ergonomica preliminar");

  const metaAnalyses = filterScientificArticles(scientificArticles, {
    search: "",
    driverSlug: null,
    pillar: null,
    tier: "Meta-analysis",
  });
  assert.ok(metaAnalyses.length >= 4);
  assert.ok(metaAnalyses.every((a) => a.tier === "Meta-analysis"));

  const pillarD = filterScientificArticles(scientificArticles, {
    search: "Kleingeld",
    driverSlug: null,
    pillar: "D",
    tier: null,
  });
  assert.ok(pillarD.length >= 2);
  assert.ok(pillarD.every((a) => a.playbookPillar === "D"));

  const cipaChapters = filterMte2026Chapters(MTE_2026_CANONICAL_CHAPTERS, {
    search: "saber-fazer",
    pillar: null,
  });
  assert.equal(cipaChapters.length, 1);
  assert.equal(cipaChapters[0].chapterNumber, 6);
});

test("NR-1 Learning Science & Graphic Instructional Design catalog covers all 10 Dashboard topics", () => {
  const topicIds = Object.keys(NR1_LEARNING_SCIENCE_CATALOG) as Nr1LearningScienceTopicId[];
  assert.equal(topicIds.length, 10);

  for (const id of topicIds) {
    const topic = getNr1LearningScienceTopic(id);
    assert.equal(topic.id, id);
    assert.ok(topic.nr1Clauses.length >= 1);
    assert.equal(topic.instructionalFlowSteps.length, 3);
    assert.equal(topic.instructionalFlowSteps[0].stepNumber, "01");
    assert.equal(topic.instructionalFlowSteps[1].stepNumber, "02");
    assert.equal(topic.instructionalFlowSteps[2].stepNumber, "03");
    assert.ok(topic.comparisonTable.length >= 1);
    assert.ok(topic.canonicalMteDocUrl.endsWith(".md"));
    assert.ok(topic.canonicalPlaybookDocUrl.endsWith(".md"));
  }
});
