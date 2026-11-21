import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  ExternalLink,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  Compass,
  MessageSquare,
  PlayCircle,
  Target,
} from "lucide-react";
import {
  drivers,
  roadmapDrivers2026,
  PLAYBOOK_URL,
} from "@/data/driversData";
import DriverCard from "@/components/DriverCard";
import {
  PLAYBOOK_2_CANONICAL_META,
  PLAYBOOK_2_CYCLE_STAGES,
  PLAYBOOK_2_DRIVER_PILLARS,
  type Playbook2PillarCode,
} from "@/lib/governance/playbook2RagEngine";
import { getArgo4DriverHeroSpec } from "@/data/argo4DriverHeroPrompts";
import heroDriversMain from "@/assets/images/hero_drivers_catalog_main_1795028527244.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<"ALL" | Playbook2PillarCode>("ALL");
  const [activeCycleStage, setActiveCycleStage] = useState<string>("measure");
  const pillarBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = pillarBarRef.current;
    if (!container) return;
    const activeChip = container.querySelector<HTMLElement>(`[data-pillar-chip="${selectedPillar}"]`);
    if (activeChip && typeof activeChip.scrollIntoView === "function") {
      activeChip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedPillar]);

  const scrollToCatalogGrid = () => {
    if (typeof window === "undefined") return;
    setTimeout(() => {
      const gridEl = document.getElementById("drivers-catalog-grid");
      if (!gridEl) return;
      const rect = gridEl.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.58 || rect.top < 56) {
        gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 45);
  };

  const handleSelectPillar = (nextPillar: "ALL" | Playbook2PillarCode) => {
    setSelectedPillar(nextPillar);
    scrollToCatalogGrid();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return drivers.filter((d) => {
      if (selectedPillar !== "ALL" && d.pillarCode !== selectedPillar) {
        return false;
      }
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.namePt.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        (d.playbook2SpotlightPt?.toLowerCase().includes(q) ?? false) ||
        (d.pillarLabelPt?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [search, selectedPillar]);

  const currentStage =
    PLAYBOOK_2_CYCLE_STAGES.find((s) => s.code === activeCycleStage) ??
    PLAYBOOK_2_CYCLE_STAGES[0];

  return (
    <div className="pb-24 md:pb-12">
      {/* Header — Full-Bleed Integrated Hero Banner with Smooth Gradient Blend */}
      <section
        aria-label="Apresentação dos 16 Drivers do Bem-Estar no Trabalho"
        className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-center border-b border-border/60 bg-slate-950"
      >
        {/* Full-bleed background photograph completing the entire Hero band */}
        <img
          src={heroDriversMain}
          alt="Profissionais colaborando em um ambiente de trabalho acolhedor e iluminado"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
        {/* Smooth directional gradient: deep readable left side fading into the image on the right */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/82 to-slate-950/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40"
          aria-hidden="true"
        />

        <div className="container relative py-12 md:py-16 lg:py-20">
          <motion.div {...fadeUp} className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Trilhas de Aprendizagem e Bem-Estar no Trabalho
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] [text-wrap:balance]">
              Explore os 16 Drivers do Bem-Estar no Trabalho
            </h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Cada driver representa um aspecto essencial do dia a dia de trabalho — como liderança, confiança, equilíbrio de carga, autonomia e segurança. Escolha um tema abaixo para descobrir práticas recomendadas, conversar com o assistente de aprendizagem, assistir a vídeos e realizar atividades interativas. Use este espaço para levantar perguntas e conectar ações ao trabalho real — lembrando que a ferramenta não garante conformidade e não substitui o responsável técnico nem a validação jurídica e técnica.
            </p>

            {/* Quick Pedagogical Summary Strip inside Hero (Interactive Scroll-to-Grid Triggers) */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={scrollToCatalogGrid}
                className="rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 p-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Compass className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Práticas</span>
                </div>
                <p className="text-[11px] text-white/75 mt-1 leading-snug">
                  Ações concretas para o dia a dia das equipes.
                </p>
              </button>
              <button
                type="button"
                onClick={scrollToCatalogGrid}
                className="rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 p-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Assistente</span>
                </div>
                <p className="text-[11px] text-white/75 mt-1 leading-snug">
                  Tire dúvidas e adapte ideias à sua rotina.
                </p>
              </button>
              <button
                type="button"
                onClick={scrollToCatalogGrid}
                className="rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 p-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Target className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Quiz & Cards</span>
                </div>
                <p className="text-[11px] text-white/75 mt-1 leading-snug">
                  Fixe os conceitos de forma leve e rápida.
                </p>
              </button>
              <button
                type="button"
                onClick={scrollToCatalogGrid}
                className="rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 p-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Vídeos & Planos</span>
                </div>
                <p className="text-[11px] text-white/75 mt-1 leading-snug">
                  Palestras, simulações e roteiros em PDF.
                </p>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container py-8 md:py-10 space-y-8">
        {/* Section 1: Pedagogical Guide — Measure -> Understand -> Act */}
        <section
          aria-label="Como aplicar o aprendizado na prática"
          className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Passo a Passo Pedagógico · Medir → Compreender → Agir
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold mt-1">
                Como transformar o aprendizado em melhorias reais
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Entenda como conectamos o que as pessoas sentem no trabalho (satisfação, felicidade, estresse e propósito) às condições organizacionais que podem ser melhoradas em equipe.
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Etapas do ciclo de melhoria">
              {PLAYBOOK_2_CYCLE_STAGES.map((stage) => {
                const isSelected = stage.code === currentStage.code;
                return (
                  <button
                    key={stage.code}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveCycleStage(stage.code)}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/50 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {stage.titlePt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Details + 4 Dimensions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5">
            <div className="lg:col-span-7 rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-primary uppercase">
                  {currentStage.titlePt}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Aplicação prática no dia a dia
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {currentStage.summaryPt}
              </p>
              <ul className="space-y-1.5">
                {currentStage.keyActionsPt.map((action) => (
                  <li key={action} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Os 4 Indicadores de Bem-Estar das Pessoas
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PLAYBOOK_2_CANONICAL_META.fourCoreWellbeingDimensions.map((dim) => (
                  <div
                    key={dim.id}
                    className="rounded-xl border border-border bg-background p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-foreground">{dim.namePt}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {dim.rolePt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive 6-Pillar Filter + Search (Sticky Unicorn Dock on Mobile/Tablet) */}
        <section
          aria-label="Filtro por Áreas Temáticas e Busca"
          className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-xl border-y border-border/70 md:static md:mx-0 md:px-0 md:py-0 md:bg-transparent md:border-none space-y-3"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div
              ref={pillarBarRef}
              className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar"
              role="group"
              aria-label="Filtrar por Área Temática"
            >
              <button
                type="button"
                data-pillar-chip="ALL"
                onClick={() => handleSelectPillar("ALL")}
                className={`min-h-[40px] shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedPillar === "ALL"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                Todos os Temas ({drivers.length})
              </button>
              {PLAYBOOK_2_DRIVER_PILLARS.map((pillar) => {
                const active = selectedPillar === pillar.code;
                return (
                  <button
                    key={pillar.code}
                    type="button"
                    data-pillar-chip={pillar.code}
                    onClick={() =>
                      handleSelectPillar(active ? "ALL" : pillar.code)
                    }
                    className={`min-h-[40px] shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {pillar.namePt} ({pillar.activeDriverSlugs.length})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-80 shrink-0">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar tema, liderança, confiança, flexibilidade..."
                aria-label="Buscar driver"
                className="w-full min-h-[42px] rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              {search && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono tabular-nums text-muted-foreground">
                  {filtered.length}
                </span>
              )}
            </div>
          </div>

          {selectedPillar !== "ALL" && (
            <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-foreground">
                  {PLAYBOOK_2_DRIVER_PILLARS.find((p) => p.code === selectedPillar)?.namePt} · Exibindo {filtered.length} de {drivers.length} drivers
                </p>
                <p className="text-xs text-muted-foreground">
                  {PLAYBOOK_2_DRIVER_PILLARS.find((p) => p.code === selectedPillar)?.summaryPt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPillar("ALL")}
                className="text-xs font-semibold text-primary hover:underline self-start sm:self-center shrink-0 cursor-pointer"
              >
                Mostrar todos os 16 drivers
              </button>
            </div>
          )}
        </section>

        {/* Section 3: Active Drivers Grid (16 Drivers) */}
        <div
          id="drivers-catalog-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 scroll-mt-36"
        >
          {filtered.map((driver, i) => (
            <DriverCard key={driver.slug} driver={driver} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-14 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm">
              Nenhum driver encontrado para "{search}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedPillar("ALL");
              }}
              className="text-primary text-xs font-semibold mt-2 hover:underline"
            >
              Limpar filtros e busca
            </button>
          </div>
        )}

        {/* Section 4: Upcoming Themes in 2026 (Clean Pedagogical Cards) */}
        <section
          aria-label="Novos Temas Previstos para 2026"
          className="rounded-2xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Próximas Atualizações de Conteúdo
              </span>
              <h2 className="font-display text-base sm:text-lg font-bold mt-1">
                2 Novos Drivers em Elaboração para 2026
              </h2>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Temas em preparação pelo guia internacional
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmapDrivers2026.map((rm) => {
              const heroSpec = getArgo4DriverHeroSpec(rm.slug);
              return (
                <div
                  key={rm.slug}
                  className="rounded-xl border border-border bg-muted/20 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 border-b border-border/60">
                      <img
                        src={heroSpec.heroImageUrl}
                        alt={`Ilustração do tema ${rm.namePt}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                        width={640}
                        height={360}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
                        aria-hidden="true"
                      />
                      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2 text-[10px]">
                        <span className="text-white/95 bg-black/60 px-2.5 py-0.5 rounded-md border border-white/15">
                          {rm.pillarLabelPt}
                        </span>
                        <span className="font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/25 text-amber-200 border border-amber-400/35">
                          {rm.releaseWindowPt}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {rm.namePt}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {rm.descriptionPt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Canonical Attribution Footer */}
        <footer className="rounded-2xl border border-border bg-muted/30 p-4 sm:p-5 space-y-2">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Fonte de Referência e Uso Pedagógico ({PLAYBOOK_2_CANONICAL_META.licenseCode})
              </p>
              <p>
                <strong>Referência Principal:</strong> <em>{PLAYBOOK_2_CANONICAL_META.canonicalCitation}</em>
              </p>
              <p>
                {PLAYBOOK_2_CANONICAL_META.academicPartnerNote} {PLAYBOOK_2_CANONICAL_META.licenseSummaryPt} Este catálogo pedagógico não garante conformidade e não substitui o responsável técnico, a AEP/AET nem a validação jurídica e técnica.
              </p>
              <div className="pt-1">
                <a
                  href={PLAYBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  Consultar publicação externa: Work Wellbeing Playbook
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

