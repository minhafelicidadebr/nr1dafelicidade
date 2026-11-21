import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers,
  PlayCircle,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/lib/router/compat";
import homeHollywoodHero from "@/assets/images/nr1_copsoq_hollywood_hero_1795095798183.jpg";
import canonicalMte2026CardImg from "@/assets/images/canonical_mte2026_normative_card_1795177093339.jpg";
import canonicalOxfordPlaybook2CardImg from "@/assets/images/canonical_oxford_playbook2_card_1795177092575.jpg";
import nr1Shield from "@/assets/nr1-shield-3d-768.png";
import { tedVideos, youtubeVideos } from "@/data/contentRegistry";
import {
  CANONICAL_KNOWLEDGE_DOCUMENTS,
  CANONICAL_MTE_2026_ASSET_URL,
  CANONICAL_PLAYBOOK_2_ASSET_URL,
  MTE_2026_CANONICAL_CHAPTERS,
  PLAYBOOK_PILLAR_CATALOG,
  filterMte2026Chapters,
  filterScientificArticles,
  normalizeSearchText,
  scientificArticles,
  type Mte2026CanonicalChapter,
  type PlaybookDriverAcronymPillar,
  type ScientificArticle,
} from "@/data/scientificArticles";
import { drivers } from "@/data/driversData";
import {
  playbookSourceReadinessPolicy,
  playbookSourceRecords,
} from "@/data/playbookSourceReadiness";
import {
  evaluateSourceReadiness,
  sourceReadinessBlockerLabel,
} from "@/lib/content/sourceReadiness";
import VideoLab from "@/components/VideoLab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CANONICAL_DOCUMENT_IMAGES: Record<string, string> = {
  "DOC-CANON-MTE-2026": canonicalMte2026CardImg,
  "DOC-CANON-PLAYBOOK-2": canonicalOxfordPlaybook2CardImg,
};

const allVideos = [
  ...tedVideos.map((v) => ({ ...v, type: "TED" as const })),
  ...youtubeVideos.map((v) => ({
    ...v,
    type: "YouTube" as const,
    speaker: undefined,
    summary: v.source,
  })),
];

const driverMap = Object.fromEntries(drivers.map((d) => [d.slug, d.namePt]));
const sourceReadiness = evaluateSourceReadiness(
  playbookSourceRecords,
  playbookSourceReadinessPolicy,
);

type LibraryTab = "articles" | "mte2026" | "videos";

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<LibraryTab>("articles");
  const [selectedDriverTag, setSelectedDriverTag] = useState<string | null>(
    null,
  );
  const [selectedPillar, setSelectedPillar] =
    useState<PlaybookDriverAcronymPillar | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [articlePopout, setArticlePopout] = useState<ScientificArticle | null>(
    null,
  );
  const [mteChapterPopout, setMteChapterPopout] =
    useState<Mte2026CanonicalChapter | null>(null);

  const availableTiers = useMemo(
    () =>
      Array.from(new Set(scientificArticles.map((a) => a.tier))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [],
  );

  const allDriverTags = useMemo(
    () =>
      Array.from(
        new Set([
          ...allVideos.flatMap((v) => v.drivers.map((d) => d.driver)),
          ...scientificArticles.map((a) => a.driver),
        ]),
      ).sort(),
    [],
  );

  const filteredArticles = useMemo(
    () =>
      filterScientificArticles(scientificArticles, {
        search,
        driverSlug: selectedDriverTag,
        pillar: selectedPillar,
        tier: selectedTier,
      }),
    [search, selectedDriverTag, selectedPillar, selectedTier],
  );

  const filteredMteChapters = useMemo(
    () =>
      filterMte2026Chapters(MTE_2026_CANONICAL_CHAPTERS, {
        search,
        pillar: selectedPillar,
      }),
    [search, selectedPillar],
  );

  const filteredVideos = useMemo(() => {
    const q = normalizeSearchText(search);
    return allVideos.filter((v) => {
      const matchesSearch =
        !q ||
        normalizeSearchText(
          `${v.titlePt} ${v.speaker ?? ""} ${v.summary ?? ""}`,
        ).includes(q);
      const matchesTag =
        !selectedDriverTag ||
        v.drivers.some((d) => d.driver === selectedDriverTag);
      return matchesSearch && matchesTag;
    });
  }, [search, selectedDriverTag]);

  const hasActiveFilters = Boolean(
    search.trim() || selectedDriverTag || selectedPillar || selectedTier,
  );

  function clearAllFilters() {
    setSearch("");
    setSelectedDriverTag(null);
    setSelectedPillar(null);
    setSelectedTier(null);
  }

  return (
    <div className="bg-background pb-24 md:pb-12">
      {/* Referências catalogadas em revisão */}
      {/* O resumo do catalogo nao e exibido nesta demonstracao */}
      {/* ═══════════════════════════════════════════════════════════════
          1 · HERO FULL-BLEED BAND — Identidade Visual Unificada com /,
              /nr1-copsoq e /drivers/:slug (Contraste AAA Claro ☀️ e Escuro 🌙)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden border-b border-white/10 bg-slate-950 text-white min-h-[480px] flex items-center"
        aria-labelledby="library-hero-title"
      >
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          <img
            src={homeHollywoodHero}
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-85"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/88 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/35" />
          <div
            className="absolute -left-28 -top-28 h-[460px] w-[460px] rounded-full opacity-25 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, hsl(183 70% 45%) 0%, transparent 70%)",
            }}
          />
        </div>

        <div
          className="absolute top-0 inset-x-0 gold-line-thin"
          aria-hidden="true"
        />

        <div className="container relative z-10 grid items-end gap-10 py-14 md:py-16 lg:grid-cols-[1.18fr_0.82fr]">
          {/* Left Column: Editorial Headline, Canonical Scope & Direct Document Actions */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/35 bg-teal-500/15 px-3.5 py-1.5 backdrop-blur-md">
              <GraduationCap
                className="h-3.5 w-3.5 text-teal-300"
                aria-hidden="true"
              />
              <span className="text-2xs font-bold uppercase tracking-[0.16em] text-teal-200">
                BASE CANÔNICA DE EVIDÊNCIAS · PLAYBOOK 2.0 × MANUAL MTE 2026
              </span>
            </div>

            <h1
              id="library-hero-title"
              className="text-balance font-display text-3xl font-bold leading-[1.08] tracking-[-0.025em] text-white md:text-5xl"
            >
              Biblioteca Científica e{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, hsl(40 95% 62%), hsl(36 100% 52%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Base Normativa NR-1.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-200/95">
              Explore as referências revisadas por pares do{" "}
              <strong className="text-white">
                Work Wellbeing Playbook 2.0 (University of Oxford & World
                Wellbeing Movement)
              </strong>{" "}
              e os{" "}
              <strong className="text-white">
                19 Capítulos do Manual Oficial MTE 2026 Comentado (NR-1 Cap.
                1.5)
              </strong>{" "}
              com links diretos para conferência das fontes originais.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setTab("mte2026")}
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-xs md:text-sm font-bold text-secondary-foreground shadow-lg transition-all hover:shadow-gold whitespace-nowrap shrink-0"
              >
                <Scale className="h-4 w-4" aria-hidden="true" />
                <span>Explorar Manual Oficial MTE 2026 (19 Capítulos)</span>
              </button>

              <a
                href={CANONICAL_PLAYBOOK_2_ASSET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-slate-900/75 px-4 py-3 text-xs md:text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-900/95 hover:border-white/40 whitespace-nowrap shrink-0"
              >
                <FileCheck2
                  className="h-4 w-4 text-teal-300"
                  aria-hidden="true"
                />
                <span>Abrir Playbook 2.0 Canônico</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </a>

              <a
                href={CANONICAL_MTE_2026_ASSET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-slate-900/60 px-4 py-3 text-xs md:text-sm font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-900/90 hover:text-white whitespace-nowrap shrink-0"
              >
                <BookOpen
                  className="h-4 w-4 text-amber-300"
                  aria-hidden="true"
                />
                <span>Abrir Guia MTE 2026 Comentado</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Floating Epistemic Architecture Card */}
          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-2xl border border-white/15 bg-slate-950/88 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-start gap-3.5">
                <img
                  src={nr1Shield}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 shrink-0 object-contain"
                />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-teal-300">
                    ARQUITETURA EPISTÊMICA AUDITÁVEL
                  </span>
                  <h2 className="mt-0.5 font-display text-base font-bold text-white">
                    Playbook 2.0 × Manual MTE 2026 × COPSOQ II
                  </h2>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    Rastreabilidade zero-alucinação entre cada estudo
                    catalogado, sua citação exata no Playbook 2.0 e a exigência
                    normativa correspondente do MTE.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4 text-center">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2">
                  <p className="font-mono text-lg font-bold tabular-nums text-amber-400">
                    {scientificArticles.length}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Estudos Playbook 2.0
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2">
                  <p className="font-mono text-lg font-bold tabular-nums text-teal-300">
                    {MTE_2026_CANONICAL_CHAPTERS.length}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Capítulos MTE 2026
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2">
                  <p className="font-mono text-lg font-bold tabular-nums text-white">
                    6 Pilares
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Acrônimo D-R-I-V-E-R
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 space-y-8">
        {/* ═══════════════════════════════════════════════════════════════
            2 · FONTES CANÔNICAS PRIMÁRIAS (CONFERÊNCIA DIRETA)
            ═══════════════════════════════════════════════════════════════ */}
        <section aria-labelledby="canonical-sources-heading" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                id="canonical-sources-heading"
                className="font-display text-lg font-bold text-foreground"
              >
                Bases de Conhecimento e Evidência Normativa / Científica
              </h2>
              <p className="text-xs text-muted-foreground">
                Documentos canônicos que fundamentam a auditoria técnica, os
                planos de intervenção e os micro-CTAs de Ciência de Aprendizagem
                do Dashboard NR-1.
              </p>
            </div>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap shrink-0"
            >
              <span>Ver aplicação no Dashboard NR-1</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {CANONICAL_KNOWLEDGE_DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  {/* Hollywood Studio Visual Header */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950 border-b border-border/70">
                    <img
                      src={CANONICAL_DOCUMENT_IMAGES[doc.id] ?? homeHollywoodHero}
                      alt={`${doc.title} — ${doc.imageCaptionPt}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      width={960}
                      height={540}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-slate-950/20"
                      aria-hidden="true"
                    />
                    <div className="absolute top-3 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-md border border-amber-400/40 bg-slate-950/85 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-amber-300 backdrop-blur-md">
                        {doc.shortBadge}
                      </span>
                      <span className="inline-flex items-center rounded-md border border-white/20 bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-md">
                        {doc.year}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-200/95">
                        {doc.imageCaptionPt}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-teal-300">
                        {doc.metricsLabel}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span className="font-semibold text-primary">
                        {doc.shortBadge}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.metricsLabel}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-medium text-foreground/85">
                      {doc.institution} — {doc.authorsOrOrgan}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {doc.summaryPt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-border/70 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {doc.licenseOrNormativeStatus}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={doc.localMarkdownUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Inspecionar Documento Canônico</span>
                    </a>
                    <a
                      href={doc.officialExternalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:border-primary/40 transition-colors whitespace-nowrap shrink-0"
                    >
                      <ExternalLink
                        className="h-3.5 w-3.5 text-primary"
                        aria-hidden="true"
                      />
                      <span>Portal Oficial</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Notice Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300"
              aria-hidden="true"
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">
                  Governança Epistêmica e Fronteira de Uso
                </span>
                <span aria-hidden="true" className="text-muted-foreground">
                  ·
                </span>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {sourceReadiness.ready}/{sourceReadiness.total} registro(s) de
                  governança verificados · Próximo controle:{" "}
                  {sourceReadiness.nextStep}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Todos os artigos abaixo exibem a referência numerada do{" "}
                <strong className="text-foreground">
                  Work Wellbeing Playbook 2.0
                </strong>{" "}
                e o link externo (DOI/Periódico) para conferência direta. O uso
                pedagógico e exploratório deste catálogo não substitui a
                Avaliação Ergonômica Preliminar (AEP), a Análise Ergonômica do
                Trabalho (AET — NR-17) nem a responsabilidade técnica interna da
                organização (Manual MTE 2026, Cap. 8.2 Passo 4).
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-amber-800 dark:text-amber-200 font-mono">
                {sourceReadiness.blockers.slice(0, 4).map((blocker, idx) => (
                  <span key={blocker}>
                    {idx > 0 ? " · " : ""}
                    {sourceReadinessBlockerLabel(blocker)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            3 · SISTEMA DE BUSCA & FILTRAGEM MULTI-FACETADA (7 DESIGN SKILLS)
            ═══════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Controles de busca e organização da biblioteca"
          className="rounded-2xl border border-border bg-card p-5 space-y-5"
        >
          {/* Top Row: Segmented Tabs + Search Input */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Segmented Tab Controls */}
            <div
              className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-muted p-1"
              role="tablist"
              aria-label="Categorias da biblioteca"
            >
              {[
                {
                  key: "articles" as LibraryTab,
                  icon: FileText,
                  label: "Evidências Playbook 2.0",
                  count: scientificArticles.length,
                },
                {
                  key: "mte2026" as LibraryTab,
                  icon: Scale,
                  label: "Base Normativa MTE 2026 (NR-1)",
                  count: MTE_2026_CANONICAL_CHAPTERS.length,
                },
                {
                  key: "videos" as LibraryTab,
                  icon: PlayCircle,
                  label: "Complementos de Estudo",
                  count: allVideos.length,
                },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => {
                    setTab(t.key);
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    tab === t.key
                      ? "bg-card text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span>{t.label}</span>
                  <span className="font-mono text-[11px] tabular-nums text-primary">
                    ({t.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Search Bar with Instant Clear */}
            <div className="relative flex-1 max-w-xl">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  tab === "mte2026"
                    ? "Buscar capítulo MTE 2026, cláusula NR-1 (ex.: 1.5.4.4.5.3, AEP, CIPA, PCMSO)..."
                    : tab === "videos"
                      ? "Buscar vídeo complementar ou palestrante..."
                      : "Buscar estudo, autor, periódico, citação Playbook 2.0 ou cláusula NR-1..."
                }
                aria-label="Buscar na biblioteca"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-9 py-2.5 text-xs md:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Limpar texto da busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Facet 1: Acrônimo DRIVER (Playbook 2.0 Pillars) — Applies to Articles & MTE Chapters */}
          {tab !== "videos" && (
            <div className="space-y-2 border-t border-border/60 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Filtrar por Pilar do Acrônimo DRIVER (Work Wellbeing Playbook
                  2.0 — Oxford):
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                    <span>Limpar todos os filtros</span>
                  </button>
                )}
              </div>
              <div
                className="flex flex-wrap gap-1.5"
                role="group"
                aria-label="Filtrar por pilar DRIVER do Playbook 2.0"
              >
                <button
                  type="button"
                  onClick={() => setSelectedPillar(null)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                    selectedPillar === null
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todos os Pilares DRIVER
                </button>
                {PLAYBOOK_PILLAR_CATALOG.map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() =>
                      setSelectedPillar(
                        selectedPillar === p.code ? null : p.code,
                      )
                    }
                    title={p.descriptionPt}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 border ${
                      selectedPillar === p.code
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {p.labelPt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Facet 2: Evidence Tier & Driver Slugs — Applies to Articles & Videos */}
          {tab === "articles" && (
            <div className="grid gap-4 md:grid-cols-2 border-t border-border/60 pt-4">
              {/* Evidence Tier Filter */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Desenho Metodológico / Nível de Evidência:
                </span>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label="Filtrar por desenho de estudo"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedTier(null)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                      selectedTier === null
                        ? "border-primary bg-primary/15 text-primary font-semibold"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Todos ({scientificArticles.length})
                  </button>
                  {availableTiers.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() =>
                        setSelectedTier(selectedTier === tier ? null : tier)
                      }
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                        selectedTier === tier
                          ? "border-primary bg-primary/15 text-primary font-semibold"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Driver Tag Filter */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Driver Específico (16 Trilhas):
                </span>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label="Filtrar por driver"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDriverTag(null)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                      selectedDriverTag === null
                        ? "border-primary bg-primary/15 text-primary font-semibold"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Todos os Drivers
                  </button>
                  {allDriverTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setSelectedDriverTag(
                          selectedDriverTag === tag ? null : tag,
                        )
                      }
                      aria-pressed={selectedDriverTag === tag}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors border ${
                        selectedDriverTag === tag
                          ? "border-primary bg-primary/15 text-primary font-semibold"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {driverMap[tag] || tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Results Counter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span className="font-mono tabular-nums">
              {tab === "articles" &&
                `Exibindo ${filteredArticles.length} de ${scientificArticles.length} estudos verificados no Playbook 2.0`}
              {tab === "mte2026" &&
                `Exibindo ${filteredMteChapters.length} de ${MTE_2026_CANONICAL_CHAPTERS.length} capítulos do Manual Oficial MTE 2026`}
              {tab === "videos" &&
                `Exibindo ${filteredVideos.length} de ${allVideos.length} vídeos complementares de estudo`}
            </span>
            <span className="text-[11px]">
              Clique em qualquer item para inspecionar o resumo técnico, a
              citação canônica e os links de conferência.
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            4A · ABA 1: EVIDÊNCIAS WORK WELLBEING PLAYBOOK 2.0 (ZERO-ALUCINAÇÃO)
            ═══════════════════════════════════════════════════════════════ */}
        {tab === "articles" && (
          <section aria-label="Estudos catalogados do Work Wellbeing Playbook 2.0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.25) }}
                >
                  <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors">
                    <div className="space-y-2">
                      {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                        <span className="font-semibold text-primary">
                          {article.playbookCitationRef}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{article.tier}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{article.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {article.status === "open"
                            ? "Acesso Aberto"
                            : "Periódico Indexado (DOI)"}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs font-medium text-foreground/85">
                        {article.authors} —{" "}
                        <span className="italic text-muted-foreground">
                          {article.journal}
                        </span>
                      </p>

                      {/* Verified Summary directly visible on card */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>

                      {/* MTE 2026 Normative Crosswalk */}
                      <p className="text-[11px] text-foreground/80 pt-1">
                        <strong className="text-primary">
                          Ponte Normativa MTE 2026:
                        </strong>{" "}
                        {article.mte2026Crosswalk}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-[11px] text-muted-foreground">
                        <span>{article.playbookPillarLabel}</span>
                        <span aria-hidden="true"> · </span>
                        <strong className="text-foreground">
                          {driverMap[article.driver] || article.driver}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setArticlePopout(article)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 transition-colors whitespace-nowrap shrink-0"
                        >
                          <BookOpen
                            className="h-3.5 w-3.5 text-primary"
                            aria-hidden="true"
                          />
                          <span>Ficha Técnica & Citação</span>
                        </button>

                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Conferir fonte externa de ${article.title}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>DOI / Fonte</span>
                          <ExternalLink
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Nenhum estudo encontrado para os filtros selecionados.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <span>Limpar filtros e mostrar todos</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            4B · ABA 2: BASE NORMATIVA MANUAL OFICIAL MTE 2026 (19 CAPÍTULOS)
            ═══════════════════════════════════════════════════════════════ */}
        {tab === "mte2026" && (
          <section
            aria-label="Capítulos do Manual Oficial MTE 2026 Comentado"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMteChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                      <span className="font-bold text-primary tabular-nums">
                        CAPÍTULO {String(chapter.chapterNumber).padStart(2, "0")}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>NR-1: {chapter.nr1Clauses.join(", ")}</span>
                      <span aria-hidden="true">·</span>
                      <span>{chapter.pageRange}</span>
                    </div>

                    <h3 className="font-display text-base font-bold text-foreground leading-snug">
                      {chapter.chapterTitle}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {chapter.pedagogicalSummary}
                    </p>

                    <div className="pt-1 space-y-1 text-[11px]">
                      <p className="text-foreground/90">
                        <strong className="text-amber-600 dark:text-amber-300">
                          Olhar da Auditoria Fiscal MTE:
                        </strong>{" "}
                        {chapter.auditorInspectionFocus}
                      </p>
                      <p className="text-foreground/90">
                        <strong className="text-primary">
                          Ciência de Aprendizagem Aplicada:
                        </strong>{" "}
                        {chapter.learningSciencePrinciple}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={chapter.appRoute}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Funcionalidade: {chapter.appFeatureLabel}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMteChapterPopout(chapter)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/50 transition-colors"
                      >
                        <BookOpen
                          className="h-3.5 w-3.5 text-primary"
                          aria-hidden="true"
                        />
                        <span>Inspecionar Capítulo</span>
                      </button>
                      <a
                        href={chapter.canonicalDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <span>Guia MTE</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMteChapters.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Nenhum capítulo do Manual MTE 2026 corresponde ao filtro
                  atual.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <span>Limpar filtros</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            4C · ABA 3: COMPLEMENTOS MULTIMÍDIA DE ESTUDO
            ═══════════════════════════════════════════════════════════════ */}
        {tab === "videos" && (
          <section
            aria-label="Vídeos complementares de estudo"
            className="space-y-6"
          >
            <div className="rounded-xl border border-info/25 bg-info/5 px-4 py-3 flex items-start gap-3">
              <Sparkles
                className="h-4 w-4 text-info shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Complementos multimídia de estudo — exploração pedagógica
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Estes vídeos externos (TED / YouTube) apoiam a sensibilização
                  de lideranças e equipes. As evidências científicas primárias e
                  normativas residem nas abas do Playbook 2.0 e do Manual MTE
                  2026.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVideos.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.25) }}
                >
                  <VideoLab
                    title={v.titlePt}
                    embedUrl={v.embedUrl}
                    speaker={v.speaker}
                    summary={v.summary}
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-2 px-1 text-[11px] text-muted-foreground">
                    <span className="font-mono font-semibold text-info">
                      Complemento Multimídia
                    </span>
                    {v.drivers.map((d) => (
                      <button
                        key={d.driver}
                        type="button"
                        onClick={() => setSelectedDriverTag(d.driver)}
                        className="text-primary hover:underline font-medium"
                      >
                        · {driverMap[d.driver] || d.driver}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredVideos.length === 0 && (
              <p className="text-center text-muted-foreground mt-12">
                Nenhum vídeo encontrado para a busca atual.
              </p>
            )}
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            5 · MODAL DE CONFERÊNCIA CANÔNICA DE ARTIGO (PLAYBOOK 2.0)
            ═══════════════════════════════════════════════════════════════ */}
        <Dialog
          open={!!articlePopout}
          onOpenChange={() => setArticlePopout(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-primary mb-1">
                <span>{articlePopout?.playbookCitationRef}</span>
                <span aria-hidden="true">·</span>
                <span>{articlePopout?.tier}</span>
                <span aria-hidden="true">·</span>
                <span>{articlePopout?.year}</span>
              </div>
              <DialogTitle className="font-display text-lg leading-snug pr-4">
                {articlePopout?.title}
              </DialogTitle>
            </DialogHeader>
            {articlePopout && (
              <div className="space-y-4">
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-foreground">
                    Autores: {articlePopout.authors}
                  </p>
                  <p className="text-muted-foreground italic">
                    Publicação / Periódico: {articlePopout.journal}
                  </p>
                  <p className="text-muted-foreground">
                    Pilar Playbook 2.0:{" "}
                    <strong className="text-foreground">
                      {articlePopout.playbookPillarLabel}
                    </strong>{" "}
                    · Driver:{" "}
                    <strong className="text-primary">
                      {driverMap[articlePopout.driver] || articlePopout.driver}
                    </strong>
                  </p>
                </div>

                {/* Verified Canonical Summary */}
                <div className="rounded-xl bg-accent/40 border border-border p-4 space-y-2">
                  <p className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                    <CheckCircle2
                      className="h-4 w-4 text-emerald-500"
                      aria-hidden="true"
                    />
                    <span>
                      Síntese da Evidência Científica (Verificada no Playbook
                      2.0)
                    </span>
                  </p>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {articlePopout.summary}
                  </p>
                </div>

                {/* Normative Bridge to MTE 2026 */}
                <div className="rounded-xl bg-primary/5 border border-primary/25 p-4 space-y-1.5">
                  <p className="text-xs font-bold flex items-center gap-1.5 text-primary">
                    <Scale className="h-4 w-4" aria-hidden="true" />
                    <span>
                      Conexão com as Exigências do Ministério do Trabalho
                      (Manual MTE 2026 / NR-1)
                    </span>
                  </p>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {articlePopout.mte2026Crosswalk}
                  </p>
                </div>

                {/* Direct Verification Links */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href={articlePopout.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Conferir Publicação Original (DOI / Fonte)</span>
                  </a>

                  <a
                    href={articlePopout.canonicalDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:border-primary/40 transition-colors"
                  >
                    <FileCheck2
                      className="h-3.5 w-3.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>Conferir no Deck Oficial Playbook 2.0</span>
                  </a>
                </div>

                <div className="rounded-lg bg-muted/50 border border-border px-3 py-2 space-y-1">
                  <p className="text-[10px] text-muted-foreground font-mono break-all">
                    URL Verificável: {articlePopout.url}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Nota Metodológica: Consulte sempre o artigo original e a
                    Avaliação Ergonômica Preliminar (AEP/AET) antes de
                    homologar medidas no PGR.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ═══════════════════════════════════════════════════════════════
            6 · MODAL DE INSPEÇÃO DE CAPÍTULO DO MANUAL MTE 2026
            ═══════════════════════════════════════════════════════════════ */}
        <Dialog
          open={!!mteChapterPopout}
          onOpenChange={() => setMteChapterPopout(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-primary mb-1">
                <span>
                  Manual Oficial MTE 2026 · Capítulo{" "}
                  {mteChapterPopout?.chapterNumber}
                </span>
                <span aria-hidden="true">·</span>
                <span>NR-1: {mteChapterPopout?.nr1Clauses.join(", ")}</span>
                <span aria-hidden="true">·</span>
                <span>{mteChapterPopout?.pageRange}</span>
              </div>
              <DialogTitle className="font-display text-lg leading-snug pr-4">
                {mteChapterPopout?.chapterTitle}
              </DialogTitle>
            </DialogHeader>
            {mteChapterPopout && (
              <div className="space-y-4">
                <div className="rounded-xl bg-accent/40 border border-border p-4 space-y-1.5">
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Scale
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                    <span>Diretriz Normativa e Interpretação Oficial MTE</span>
                  </p>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {mteChapterPopout.pedagogicalSummary}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-1.5">
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck
                      className="h-4 w-4 text-amber-500"
                      aria-hidden="true"
                    />
                    <span>O que a Auditoria-Fiscal do Trabalho Inspeciona</span>
                  </p>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {mteChapterPopout.auditorInspectionFocus}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/5 border border-primary/25 p-4 space-y-1.5">
                  <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4" aria-hidden="true" />
                    <span>
                      Ciência de Aprendizagem e Design Instrucional Aplicado
                    </span>
                  </p>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {mteChapterPopout.learningSciencePrinciple}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <a
                    href={mteChapterPopout.canonicalDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:border-primary/40 transition-colors"
                  >
                    <ExternalLink
                      className="h-3.5 w-3.5 text-primary"
                      aria-hidden="true"
                    />
                    <span>Abrir Íntegra do Guia Oficial MTE 2026</span>
                  </a>

                  <Link
                    to={mteChapterPopout.appRoute}
                    onClick={() => setMteChapterPopout(null)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <span>
                      Ir para {mteChapterPopout.appFeatureLabel}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
