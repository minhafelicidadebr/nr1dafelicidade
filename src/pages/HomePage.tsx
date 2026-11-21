import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Shield,
  BarChart3,
  GraduationCap,
  Zap,
  BookOpen,
  ExternalLink,
  AlertTriangle,
  Quote,
  TrendingUp,
  Play,
  ShieldCheck,
  Globe,
  FileText,
  Award,
  Microscope,
  FileCheck2,
  Info,
  CheckCircle2,
  Gauge,
  CalendarCheck,
  Scale,
} from "lucide-react";
import { Link } from "@/lib/router/compat";
import homeHollywoodHero from "@/assets/images/home_hollywood_hero_band_1795099194907.jpg";
import nr1Shield from "@/assets/nr1-shield-3d-768.png";
import heroSphereLight from "@/assets/hero-sphere-light.jpg";
import motorsHuman from "@/assets/motors-human-cinematic.jpg";
import dynamicsHuman from "@/assets/dynamics-human-cinematic.jpg";
import innovationHuman from "@/assets/innovation-human-cinematic.jpg";
import { drivers, PLAYBOOK_URL, learningDynamics } from "@/data/driversData";
import { publicClaimsPolicy } from "@/data/publicClaimsPolicy";
import {
  HOME_90_DAY_BRIDGE,
  HOME_REGULATORY_PULSE_SUMMARY,
  HOME_WITHOUT_VS_WITH,
} from "@/data/homeConversionData";
import DriverCard from "@/components/DriverCard";
import { useAuth } from "@/hooks/useAuth";
import ImpactCalculator from "@/components/home/ImpactCalculator";
import Nr28BenchmarkPanel from "@/components/home/Nr28BenchmarkPanel";
import SilentCostToFlourishingMatrix from "@/components/home/SilentCostToFlourishingMatrix";
import { HOME_NR1_MODULES_CATALOG, type HomeNr1ModuleId } from "@/data/homeNr1ModulesCatalog";
import { HomeNr1ModuleLearningModal } from "@/components/home/HomeNr1ModuleLearningModal";
import SegmentSelector from "@/components/sales/SegmentSelector";
import ReadinessCalculator from "@/components/sales/ReadinessCalculator";

/* ════════════════════════════════════════════════════════════════════
   HOME v4.0 — Funil Infoproduto B2B (Opção A)
   Dor & Exposição (NR-1/NR-28) -> Calculadora -> Virada (Sem vs. Com)
   -> Mecanismo Único (4 Lentes + 9 Módulos /app) -> Segmentação
   -> Inovação (12 Drivers + 12 Dinâmicas + IA) -> Blindagem Regulatória
   -> Mini-Avaliação de Prontidão -> Ponte Plano de 90 Dias & CTA Final
   ═══════════════════════════════════════════════════════════════════ */

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, ease: easeOut },
};

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const { user } = useAuth();
  const [activeModuleModalId, setActiveModuleModalId] = useState<HomeNr1ModuleId | null>(null);

  return (
    <div className="bg-background pb-20 md:pb-0">
      {/* ═══════════════════════════════════════════════════════════════
          1 · HERO DUAL — NR-1 (Urgência) + Ciência do Bem-Estar (Diferencial)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden border-b border-white/10 bg-slate-950 text-white min-h-[600px] flex items-center"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <img
            src={homeHollywoodHero}
            alt=""
            className="h-full w-full object-cover object-center opacity-90"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/45" />
          <div
            className="absolute -left-32 -top-32 h-[540px] w-[540px] rounded-full opacity-25 blur-[130px]"
            style={{ background: "radial-gradient(circle, hsl(183 70% 45%) 0%, transparent 70%)" }}
          />
        </div>

        <div className="absolute top-0 inset-x-0 gold-line-thin" aria-hidden="true" />

        <div className="container relative z-10 grid items-end gap-10 py-14 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={reduceMotion ? false : { y: 18 }}
            animate={{ y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.65, ease: easeOut }}
          >
            {/* Metadados limpos sem empilhamento de pílulas */}
            <div className="mb-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-teal-200/95">
              <span className="inline-flex items-center gap-1.5 font-semibold text-teal-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                NR-1 Vigente (GRO/PGR)
              </span>
              <span className="text-white/35" aria-hidden="true">·</span>
              <span>Ciência do Bem-Estar no Trabalho</span>
            </div>

            {/* H1 — Promessa Dupla Equilibrada */}
            <h1
              id="hero-title"
              className="text-balance font-display text-4xl font-bold leading-[1.06] tracking-[-0.025em] text-white md:text-5xl lg:text-[3.35rem]"
            >
              Atenda à NR-1 e cresça mais com{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(110deg, hsl(40 95% 62%), hsl(36 100% 52%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ciência do Bem-Estar no Trabalho.
              </span>
            </h1>

            {/* Lede Equilibrado */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200/95 md:text-lg">
              Transforme a obrigação de gerenciar riscos psicossociais no{" "}
              <strong className="text-white">GRO/PGR</strong> em cultura saudável, retenção e desempenho coletivo.
              Unimos os <strong className="text-white">12 Drivers do Work Wellbeing Playbook 2.0</strong>, 12
              dinâmicas pedagógicas e IA contextual numa cadeia auditável — sem substituir avaliação técnica.
            </p>

            {/* CTAs Hierarquizados (1 Primário Dominante + Secundários de Baixo Atrito) */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={user ? "/app" : "/auth?intent=nr1"}
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-secondary px-7 py-3.5 text-sm font-bold text-secondary-foreground shadow-lg transition-all hover:shadow-gold hover:scale-[1.01] whitespace-nowrap"
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Acessar Dashboard NR-1</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              <a
                href="#prontidao-home"
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-slate-900/75 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-slate-900/95 hover:border-white/40 whitespace-nowrap"
              >
                <Gauge className="h-4 w-4 text-teal-300" aria-hidden="true" />
                <span>Avaliar prontidão em 1 min</span>
              </a>

              <a
                href="#benchmark-nr28"
                className="group inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/60 px-5 py-3.5 text-xs font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-900/90 hover:text-white hover:border-white/35 whitespace-nowrap"
              >
                <Scale className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>Ver benchmark NR-28</span>
              </a>
            </div>

            {/* 4 Provas de Valor Rápidas */}
            <ul className="mt-7 grid grid-cols-1 gap-2.5 text-xs text-slate-200/90 sm:grid-cols-2 max-w-xl">
              {[
                "Gestão psicossocial NR-1 (GRO/PGR) integrada à AEP/AET",
                "12 Drivers da Ciência do Bem-Estar (Playbook 2.0)",
                "12 Dinâmicas pedagógicas + mentores de IA (k ≥ 5)",
                "Demonstração sintética · dados reais bloqueados",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <FileCheck2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Divulgação Transparente da Fonte Primária Externa */}
            <a
              href={publicClaimsPolicy.playbook.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-900/80 px-4 py-2.5 backdrop-blur-md transition-all hover:border-secondary/50 hover:bg-slate-900/95"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-secondary/40 bg-secondary/20">
                <Award className="h-4 w-4 text-secondary" aria-hidden="true" />
              </div>
              <div className="text-left">
                <span className="block font-display text-xs font-bold text-white">
                  {publicClaimsPolicy.playbook.title}
                </span>
                <span className="block text-[11px] text-slate-300">
                  {publicClaimsPolicy.playbook.eyebrow} · sem chancela institucional
                </span>
              </div>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-secondary"
                aria-hidden="true"
              />
            </a>
          </motion.div>

          {/* Cartão Lateral de Arquitetura */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.75, delay: 0.12 }}
            className="hidden lg:flex flex-col items-end justify-end"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-slate-950/85 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3.5">
                <img
                  src={nr1Shield}
                  alt="Escudo NR-1"
                  className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_10px_25px_rgba(20,184,166,0.35)]"
                />
                <div>
                  <span className="text-[11px] font-semibold text-teal-300">
                    Governança & Ciência do Bem-Estar
                  </span>
                  <h2 className="mt-0.5 font-display text-base font-bold text-white">
                    NR-1 × Playbook 2.0 × IA
                  </h2>
                  <p className="mt-1 text-2xs text-slate-300 leading-relaxed">
                    Cadeia verificável conectando fatores psicossociais, 12 drivers de felicidade no trabalho e planos
                    preventivos auditáveis.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                <div className="rounded-xl bg-white/5 p-2">
                  <div className="font-display text-base font-bold text-amber-400 tabular-nums">12</div>
                  <div className="text-[10px] text-slate-300">Drivers Playbook</div>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <div className="font-display text-base font-bold text-teal-300 tabular-nums">12</div>
                  <div className="text-[10px] text-slate-300">Dinâmicas IA</div>
                </div>
                <div className="rounded-xl bg-white/5 p-2">
                  <div className="font-display text-sm font-bold text-white leading-6 tabular-nums">k ≥ 5</div>
                  <div className="text-[10px] text-slate-300">Privacidade GRO</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <Link to="/nr1-copsoq" className="text-teal-300 hover:text-teal-200 inline-flex items-center gap-1 font-medium">
                  <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                  <span>Explorar Lente 1 — Mensurar</span>
                </Link>
                <Link to="/planos" className="text-slate-300 hover:text-white font-medium">
                  Ver Planos →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2 · ALERTA DE VIGÊNCIA NR-1 + FAIXA DE FRAMEWORKS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-background border-b border-destructive/25" aria-label="Alerta regulatório">
        <div className="container py-3.5">
          <a href="#pulso-regulatorio-home" className="flex items-center justify-center gap-3 group">
            <div
              className="h-7 w-7 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            </div>
            <p className="text-xs text-foreground/85 font-medium">
              <span className="font-bold text-destructive">{publicClaimsPolicy.nr1.headline}:</span>{" "}
              {publicClaimsPolicy.nr1.statement}{" "}
              <span className="text-primary font-bold group-hover:underline underline-offset-4">
                Ver NR-1, NR-28 e Lei 14.831 →
              </span>
            </p>
          </a>
        </div>
      </section>

      <section className="relative border-b border-border bg-background" aria-label="Frameworks reconhecidos">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-muted-foreground">
              Arquitetura ancorada em referências internacionais e normativas
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-muted-foreground">
              {["NR-1 Cap. 1.5 (GRO/PGR)", "NR-28 & NR-17 (AEP/AET)", "Work Wellbeing Playbook 2.0", "Privacy Vault (k ≥ 5)", "Revisão técnica"].map(
                (label, idx, arr) => (
                  <span key={label} className="inline-flex items-center gap-3">
                    <span className="hover:text-foreground transition-colors">{label}</span>
                    {idx < arr.length - 1 && (
                      <span className="text-border" aria-hidden="true">·</span>
                    )}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3 · PAINEL DA CRISE + QUADRO BENCHMARK NR-1 × NR-28 (DOR & RISCO)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-surface-deep text-surface-deep-fg py-20 md:py-28 overflow-hidden"
        aria-labelledby="crisis-title"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.10] blur-[140px]"
            style={{ background: "radial-gradient(circle, hsl(0 72% 51%) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(40 95% 55%) 0%, transparent 70%)" }}
          />
        </div>

        <div className="container relative">
          {/* Intersecção: O Custo Silencioso & Exposição NR-1 ⇄ Florescimento Organizacional */}
          <SilentCostToFlourishingMatrix />

          {/* Quadro Completo NR-1 × NR-28 (Faixas UFIR/R$ + Efeito Cascata) */}
          <Nr28BenchmarkPanel />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4 · CALCULADORA INTERATIVA — A DOR EM NÚMEROS PRÓPRIOS
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-surface-alt py-20 md:py-28 overflow-hidden border-y border-border"
        aria-labelledby="calc-title"
      >
        <div className="container relative max-w-6xl">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-secondary">02. Quantifique sua realidade</p>
            <h2
              id="calc-title"
              className="font-display text-3xl md:text-5xl font-bold mt-3 text-foreground tracking-[-0.025em] leading-[1.06] text-balance"
            >
              O custo da inação,{" "}
              <span className="italic font-light text-secondary">em números da sua organização.</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl font-light leading-relaxed">
              Ajuste os parâmetros ao seu quadro de colaboradores e explore um cenário ilustrativo do impacto de
              turnover, absenteísmo, presenteísmo e perda de produtividade.
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <ImpactCalculator />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5 · VIRADA — SEM VS. COM A PLATAFORMA + 4 PASSOS DE TRANSFORMAÇÃO
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-background py-20 md:py-28 overflow-hidden border-b border-border"
        aria-labelledby="benefits-title"
      >
        <div className="absolute inset-0 mesh-bg opacity-45" aria-hidden="true" />
        <div className="container relative">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-success">03. Da obrigação ao diferencial competitivo</p>
            <h2
              id="benefits-title"
              className="font-display text-3xl md:text-5xl font-bold mt-3 text-foreground tracking-[-0.025em] leading-[1.06] text-balance"
            >
              De risco regulatório para{" "}
              <span className="italic font-light text-success">cultura saudável e governança.</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl font-light leading-relaxed">
              Empresas que tratam a NR-1 apenas como checklist burocrático desperdiçam investimento. Quem integra
              governança psicossocial à Ciência do Bem-Estar constrói evidências e performance coletiva ao mesmo tempo.
            </p>
          </motion.div>

          {/* Comparativo Sem vs. Com a Plataforma (aproveitado de /planos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <motion.div
              {...fadeUp}
              className="rounded-2xl border border-destructive/25 bg-destructive/[0.04] p-6 md:p-7 space-y-3.5"
            >
              <h3 className="font-display text-base font-bold text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Sem a plataforma (gestão fragmentada)</span>
              </h3>
              <ul className="space-y-2.5">
                {HOME_WITHOUT_VS_WITH.without.map((item, i) => (
                  <li key={i} className="text-xs md:text-sm text-foreground/85 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-destructive font-bold shrink-0 mt-0.5" aria-hidden="true">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.08, duration: 0.65, ease: easeOut }}
              className="rounded-2xl border border-success/30 bg-success/[0.05] p-6 md:p-7 space-y-3.5"
            >
              <h3 className="font-display text-base font-bold text-success flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Com a plataforma (NR-1 + Ciência do Bem-Estar)</span>
              </h3>
              <ul className="space-y-2.5">
                {HOME_WITHOUT_VS_WITH.with.map((item, i) => (
                  <li key={i} className="text-xs md:text-sm text-foreground/85 flex items-start gap-2.5 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 4 Passos Verificáveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                eyebrow: "01. Contexto",
                title: "Quais condições de trabalho merecem atenção?",
                desc: "Comece pelas exigências, recursos, relações e participação das pessoas envolvidas no trabalho real.",
                limit: "Não é diagnóstico individual nem substitui AEP, AET ou avaliação técnica.",
              },
              {
                eyebrow: "02. Ação",
                title: "Que mudança pode ser testada com responsabilidade?",
                desc: "Priorize controles organizacionais e ações observáveis, com responsáveis, prazo e participação.",
                limit: "A plataforma não prescreve uma intervenção nem garante eficácia.",
              },
              {
                eyebrow: "03. Evidência",
                title: "Como a decisão será tornada revisável?",
                desc: "Registre premissas, fontes, responsáveis, implementação e limites da evidência disponível.",
                limit: "Um registro não equivale a laudo, certificação ou conformidade automática.",
              },
              {
                eyebrow: "04. Reavaliação",
                title: "O que precisa ser revisto antes da próxima decisão?",
                desc: "Use sinais coletivos e o contexto do trabalho para aprender, ajustar e manter a revisão humana.",
                limit: "Dados reais e operação produtiva continuam bloqueados neste gate.",
              },
            ].map((b, i) => (
              <motion.article
                key={b.eyebrow}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: easeOut }}
                className="rounded-2xl border border-border bg-card hover:border-success/40 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-bold text-success">{b.eyebrow}</span>
                    <ShieldCheck className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground leading-snug mb-2">{b.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">{b.desc}</p>
                </div>
                <p className="mt-4 pt-3 border-t border-border/70 text-[11px] text-muted-foreground leading-relaxed">
                  <strong className="text-foreground/85">Limitação:</strong> {b.limit}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6 · MECANISMO ÚNICO — 4 LENTES + 9 MÓDULOS INTERATIVOS /app
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-alt border-b border-border" aria-labelledby="nr1-platform-title">
        <div className="container py-20 md:py-24">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-primary">04. O Mecanismo Único · Plataforma 4 Lentes</p>
            <h2
              id="nr1-platform-title"
              className="font-display text-3xl md:text-4xl font-bold mt-3 tracking-[-0.02em] leading-tight text-balance"
            >
              Plataforma 4 Lentes para NR-1, riscos psicossociais e bem-estar no trabalho
            </h2>
            <p className="mt-4 text-base text-muted-foreground max-w-xl leading-relaxed">
              Mensure fatores psicossociais com proteção de privacidade, eduque lideranças e equipes nos 12 drivers,
              transforme riscos em planos de ação e evolua com evidências para o ciclo GRO/PGR.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={user ? "/app" : "/auth?intent=nr1"}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow transition-all whitespace-nowrap"
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Acessar Dashboard NR-1</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to={user ? "/app/cycles" : "/auth?intent=cycle"}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent transition-all whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Explorar ciclo sintético</span>
              </Link>
            </div>
          </motion.div>

          {/* 4 Lentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                num: "Lente 01",
                title: "Mensurar",
                desc: "Instrumentos versionados, convites protegidos, política de limiar k ≥ 5 e evidência rastreável.",
                icon: BarChart3,
              },
              {
                num: "Lente 02",
                title: "Educar",
                desc: "12 Drivers do Playbook 2.0, microlearning, IA pedagógica e trilhas conectadas ao risco real.",
                icon: GraduationCap,
              },
              {
                num: "Lente 03",
                title: "Transformar",
                desc: "Hierarquia de controles organizacionais, planos de ação, responsáveis, prazos e evidências.",
                icon: Zap,
              },
              {
                num: "Lente 04",
                title: "Evoluir / Relatar",
                desc: "Reavaliação contínua, documentos preliminares versionados e painel executivo auditável.",
                icon: TrendingUp,
              },
            ].map((l) => (
              <div
                key={l.title}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary">{l.num}</span>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <l.icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold">{l.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{l.desc}</p>
              </div>
            ))}
          </div>

          {/* Mapa Interativo dos 9 Módulos /app (abre modal educacional) */}
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h3 className="font-display text-xl font-bold">Onde estão as funcionalidades NR-1?</h3>
              <span className="text-xs font-semibold text-primary inline-flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Clique em qualquer módulo para inspecionar o guia completo
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Tudo dentro da área autenticada <code className="text-primary font-mono">/app</code> — inspecione a
              arquitetura normativa, tabelas de evidência e fluxo PDCA de cada módulo antes de entrar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {HOME_NR1_MODULES_CATALOG.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveModuleModalId(item.id)}
                  data-testid={`home-nr1-module-cta-${item.id}`}
                  className="group text-left rounded-xl border border-border bg-background px-3.5 py-3 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-primary/[0.04] transition-all flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="font-bold text-sm group-hover:text-primary transition-colors">{item.label}</span>
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Info className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground pt-1 border-t border-border/60">
                    <span className="truncate">{item.lenteBadge.split("·")[0]?.trim()}</span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-primary shrink-0">
                      Guia & Rota <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-5 text-2xs text-muted-foreground flex items-start gap-2">
              <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Colaborador?</strong> Você não precisa criar conta. Responda à
                pesquisa pelo link anônimo enviado pela sua empresa — o dashboard é reservado a SST/RH e gestores
                responsáveis pelo ciclo.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7 · SEGMENTAÇÃO "PARA QUEM É" (Aproveitado de /planos)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-background py-20 md:py-24 border-b border-border" aria-labelledby="segment-title">
        <div className="container max-w-5xl">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-semibold text-primary">05. Para quem é a plataforma</p>
            <h2
              id="segment-title"
              className="font-display text-3xl md:text-4xl font-bold mt-2 tracking-[-0.02em] text-balance"
            >
              Estrutura pensada para RH, SST e Diretoria — em cada porte organizacional
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Selecione o perfil da sua organização para visualizar as dores prioritárias e o plano de resultados
              esperados.
            </p>
          </motion.div>

          <SegmentSelector ctaHref="#plano-90-dias" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8 · INOVAÇÃO & DIFERENCIAIS (5 MOTORES · 12 DRIVERS · IA · 12 DINÂMICAS)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative bg-surface-deep text-surface-deep-fg py-20 md:py-28 overflow-hidden border-b border-hairline"
        aria-labelledby="arch-title"
      >
        <div className="container relative">
          <motion.div {...fadeUp} className="max-w-2xl mb-14">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              06. Arquitetura Viva · Diferenciais do Ecossistema
            </p>
            <h2
              id="arch-title"
              className="font-display text-3xl md:text-5xl font-bold mt-3 text-surface-deep-fg tracking-[-0.025em] leading-[1.06] text-balance"
            >
              Cinco motores.{" "}
              <span
                className="italic font-light"
                style={{
                  backgroundImage: "linear-gradient(110deg, hsl(183 65% 55%), hsl(40 95% 60%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Um sistema integrado.
              </span>
            </h2>
            <p className="text-surface-deep-muted mt-4 text-base md:text-lg max-w-xl font-light leading-relaxed">
              Da escuta protegida à governança documental, cada motor alimenta o seguinte em um ciclo contínuo,
              mensurável e auditável.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div
              {...fadeUp}
              className="lg:col-span-5 relative rounded-3xl border border-slate-800/40 bg-slate-950 text-white p-8 overflow-hidden min-h-[380px] flex flex-col justify-between shadow-xl"
            >
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <img
                  src={motorsHuman}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                  loading="lazy"
                  width={1536}
                  height={1024}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/25" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-mono font-semibold text-amber-300">Ciclo Integrado PDCA</span>
                <h3 className="font-display text-2xl font-bold text-white mt-2">
                  Ciência aplicada ao trabalho real
                </h3>
              </div>
              <p className="relative z-10 text-sm text-slate-200/90 leading-relaxed max-w-xs">
                Avaliação, análise, intervenção, aprendizagem e governança operam como um único organismo. Cada decisão
                alimenta a próxima.
              </p>
            </motion.div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: BarChart3,
                  step: "01",
                  label: "Mensurar",
                  desc: "Instrument Registry, Privacy Vault (k ≥ 5) e agregação coletiva protegida.",
                },
                {
                  icon: TrendingUp,
                  step: "02",
                  label: "Entender",
                  desc: "Dashboards executivos, scoring por dimensão e leitura de fatores psicossociais.",
                },
                {
                  icon: Zap,
                  step: "03",
                  label: "Transformar",
                  desc: "Backlog priorizado, hierarquia de controles, responsáveis, KPIs e evidências.",
                },
                {
                  icon: GraduationCap,
                  step: "04",
                  label: "Educar",
                  desc: "12 drivers de bem-estar em trilhas gamificadas com mentores de IA.",
                },
                {
                  icon: Shield,
                  step: "05",
                  label: "Governar",
                  desc: "Relatórios executivos, catálogo documental e prontidão para auditoria técnica.",
                  span: true,
                },
              ].map((layer, i) => (
                <motion.div
                  key={layer.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.55, ease: easeOut }}
                  className={`group relative rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all overflow-hidden dark:border-white/10 dark:bg-card/85 dark:hover:border-white/25 ${
                    layer.span ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0 h-10 w-10 rounded-xl border border-amber-200/90 bg-amber-50 flex items-center justify-center group-hover:border-amber-400 transition-all dark:border-amber-400/25 dark:bg-amber-400/10">
                      <layer.icon className="h-4 w-4 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-muted-foreground">{layer.step}.</span>
                        <h3 className="font-display text-sm font-bold text-foreground">{layer.label}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{layer.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12 DRIVERS — Work Wellbeing Playbook 2.0 */}
      <section
        className="relative bg-background text-foreground py-20 md:py-28 overflow-hidden"
        aria-labelledby="drivers-title"
      >
        <div className="absolute inset-0 mesh-bg opacity-55" aria-hidden="true" />
        <div className="container relative">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-primary">Work Wellbeing Playbook 2.0 · Ciência do Bem-Estar</p>
            <h2
              id="drivers-title"
              className="font-display text-3xl md:text-5xl font-bold mt-3 text-foreground tracking-[-0.025em] leading-[1.06] text-balance"
            >
              Doze drivers.{" "}
              <span className="italic font-light text-muted-foreground">Doze mundos de aprendizagem.</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-xl font-light leading-relaxed">
              Cada driver organiza uma experiência sintética de aprendizagem referenciada ao Work Wellbeing Playbook,
              traduzindo fatores psicossociais em ações concretas para líderes e equipes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {drivers.map((driver, i) => (
              <DriverCard key={driver.slug} driver={driver} index={i} />
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10 flex justify-center">
            <Link
              to="/drivers"
              className="group inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-7 py-3.5 text-sm font-bold transition-all hover:scale-[1.02] whitespace-nowrap"
            >
              <span>Explorar os 12 Drivers</span>
              <ArrowUpRight
                className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* INOVAÇÃO APLICADA (IA + Pessoas + Ciência) */}
      <section
        className="relative bg-surface-alt py-20 md:py-28 overflow-hidden border-y border-border"
        aria-labelledby="innovation-title"
      >
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold text-primary">Inovação Aplicada · Mentores & Sra. EstratégIA</p>
              <h2
                id="innovation-title"
                className="font-display text-3xl md:text-5xl font-bold mt-3 text-foreground tracking-[-0.025em] leading-[1.06] text-balance"
              >
                Conhecimento que{" "}
                <span
                  className="italic font-light"
                  style={{
                    backgroundImage: "linear-gradient(110deg, hsl(183 60% 38%), hsl(40 90% 48%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  conecta pessoas,
                </span>{" "}
                IA e ciência.
              </h2>
              <p className="text-muted-foreground mt-4 text-base md:text-lg font-light leading-relaxed max-w-lg">
                Uma arquitetura pedagógica une evidências, 12 mentores temáticos e a consultora digital Sra. EstratégIA
                — transformando teoria normativa em prática cotidiana sem substituir especialistas humanos.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Mentores de IA em demonstração sintética com guardrails rigorosos contra uso clínico",
                  "12 dinâmicas adaptativas que ativam retenção de memória e transferência ao trabalho real",
                  "Governança regulatória integrada diretamente à jornada de aprendizagem de lideranças",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-elevated"
            >
              <img
                src={innovationHuman}
                alt="Duas mãos de pessoas diversas se aproximando com partículas douradas de luz e nós de uma rede neural emergindo entre elas"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1536}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-deep/30 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 12 DINÂMICAS PEDAGÓGICAS */}
      <section
        className="relative bg-surface-deep text-surface-deep-fg py-20 md:py-28 overflow-hidden border-b border-hairline"
        aria-labelledby="dynamics-title"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src={dynamicsHuman}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            loading="lazy"
            width={1536}
            height={1152}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-deep via-surface-deep/85 to-surface-deep/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-deep/60 via-transparent to-surface-deep" />
        </div>

        <div className="container relative">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              Motor Pedagógico · Ciência da Aprendizagem
            </p>
            <h2
              id="dynamics-title"
              className="font-display text-3xl md:text-5xl font-bold mt-3 text-surface-deep-fg tracking-[-0.025em] leading-[1.06] text-balance"
            >
              Doze dinâmicas.{" "}
              <span className="italic font-light text-surface-deep-fg/65">Uma orquestra de aprendizagem.</span>
            </h2>
            <p className="text-surface-deep-muted mt-4 text-base md:text-lg max-w-xl font-light leading-relaxed">
              Da prática guiada ao debate estruturado — experiências diversificadas que superam palestras passivas e
              geram mudança real na gestão de equipes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {learningDynamics.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5, ease: easeOut }}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card/90 p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all backdrop-blur-md dark:border-white/10 dark:bg-slate-950/75 dark:hover:border-white/25"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform shrink-0" aria-hidden="true">
                  {d.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-bold text-foreground">{d.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9 · BLINDAGEM — PULSO REGULATÓRIO™ + BASE CIENTÍFICA + PREVIEW JD-R
          ═══════════════════════════════════════════════════════════════ */}
      <section
        id="pulso-regulatorio-home"
        className="bg-background py-20 md:py-28 border-b border-border"
        aria-labelledby="pulse-title"
      >
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-primary">07. Blindagem Normativa · Pulso Regulatório™</p>
              <h2
                id="pulse-title"
                className="font-display text-3xl md:text-4xl font-bold mt-2 tracking-[-0.02em] text-balance"
              >
                Obrigações legais e oportunidade reputacional no mesmo painel
              </h2>
              <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
                Cada norma é acompanhada como registro versionado com fonte oficial e observação jurídica — unindo
                mitigação de risco fiscal (NR-1 / NR-28) à valorização da marca empregadora (Lei nº 14.831/2024).
              </p>
            </div>
            <Link
              to="/planos#regulatorio"
              className="inline-flex items-center gap-2 self-start md:self-end rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold hover:border-primary/40 hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              <span>Abrir matriz normativa completa</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {HOME_REGULATORY_PULSE_SUMMARY.map((reg) => {
              const toneBorder =
                reg.tone === "destructive"
                  ? "border-destructive/30"
                  : reg.tone === "warning"
                    ? "border-warning/35"
                    : "border-success/35";
              const toneText =
                reg.tone === "destructive"
                  ? "text-destructive"
                  : reg.tone === "warning"
                    ? "text-warning"
                    : "text-success";
              return (
                <article
                  key={reg.id}
                  className={`rounded-2xl border bg-card p-6 flex flex-col justify-between gap-5 ${toneBorder}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
                      <span className={toneText}>{reg.tag}</span>
                      <a
                        href={reg.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 shrink-0"
                        aria-label={`Fonte oficial de ${reg.name}`}
                      >
                        <span>Fonte</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground">{reg.name}</h3>
                      <p className="text-xs font-semibold text-foreground/85 mt-0.5">{reg.headline}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{reg.description}</p>
                    <ul className="space-y-1.5 pt-2 border-t border-border/70">
                      {reg.platformSupport.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-foreground/85">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-[11px] text-muted-foreground bg-muted/40 rounded-xl p-3 leading-relaxed">
                    {reg.legalNote}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BASE CIENTÍFICA + PREVIEW JD-R / ISO 45003 */}
      <section
        className="relative bg-surface-deep text-surface-deep-fg py-20 md:py-28 overflow-hidden border-b border-hairline"
        aria-labelledby="science-title"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 w-[650px] h-[650px] rounded-full opacity-[0.09] blur-[150px]"
            style={{ background: "radial-gradient(circle, hsl(40 95% 55%) 0%, transparent 70%)" }}
          />
        </div>

        <div className="container relative space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="lg:col-span-5">
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Microscope className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Base Científica & Transparência</span>
              </p>
              <h2
                id="science-title"
                className="font-display text-3xl md:text-5xl font-bold mt-3 text-surface-deep-fg tracking-[-0.025em] leading-[1.06] text-balance"
              >
                Credibilidade{" "}
                <span
                  className="italic font-light"
                  style={{
                    backgroundImage: "linear-gradient(110deg, hsl(38 92% 44%) 0%, hsl(32 95% 42%) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  rastreável.
                </span>
              </h2>
              <p className="text-surface-deep-muted mt-4 text-sm md:text-base font-light leading-relaxed max-w-md">
                {publicClaimsPolicy.playbook.attribution}{" "}
                <strong className="text-surface-deep-fg/90">{publicClaimsPolicy.playbook.limitation}</strong>
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={publicClaimsPolicy.playbook.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-300/90 bg-amber-50 px-5 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all whitespace-nowrap dark:border-amber-400/35 dark:bg-amber-400/10 dark:text-amber-200 dark:hover:bg-amber-400/20"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{publicClaimsPolicy.playbook.sourceLabel}</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                <Link
                  to="/library"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground hover:border-primary/40 hover:bg-accent transition-all whitespace-nowrap dark:border-white/15 dark:bg-white/[0.05] dark:text-surface-deep-fg dark:hover:bg-white/[0.10]"
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Explorar referências</span>
                </Link>
              </div>
            </motion.div>

            {/* Preview da Matriz JD-R / ISO 45003 */}
            <motion.div {...fadeUp} className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-7 shadow-elevated dark:border-white/10 dark:bg-card/85">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border dark:border-white/10">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Da evidência protegida ao plano de bem-estar com contexto do trabalho real
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Questionário isolado não determina risco, não garante conformidade e não substitui o responsável técnico.
                    </p>
                  </div>
                  <span className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-mono font-bold text-primary whitespace-nowrap">
                    Matriz JD-R · ISO 45003
                  </span>
                </div>

                <div className="mt-5 space-y-3.5">
                  {[
                    { dim: "Reconhecimento", load: 78, risk: "vermelho", driver: "Appreciation" },
                    { dim: "Qualidade da Liderança", load: 66, risk: "vermelho", driver: "Management" },
                    { dim: "Ritmo de Trabalho", load: 58, risk: "amarelo", driver: "Stress" },
                    { dim: "Apoio Social", load: 45, risk: "amarelo", driver: "Support" },
                    { dim: "Sentido do Trabalho", load: 28, risk: "verde", driver: "Purpose" },
                  ].map((d) => {
                    const barClass =
                      d.risk === "vermelho"
                        ? "bg-red-600 dark:bg-red-500"
                        : d.risk === "amarelo"
                          ? "bg-amber-500 dark:bg-amber-400"
                          : "bg-emerald-600 dark:bg-emerald-500";
                    const numClass =
                      d.risk === "vermelho"
                        ? "text-red-700 dark:text-red-400"
                        : d.risk === "amarelo"
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-emerald-700 dark:text-emerald-400";
                    return (
                      <div key={d.dim} className="flex items-center gap-3 text-xs">
                        <span className="w-40 sm:w-44 font-medium text-foreground/85 truncate">{d.dim}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-muted dark:bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full ${barClass}`} style={{ width: `${d.load}%` }} />
                        </div>
                        <span className={`w-8 text-right font-mono font-bold tabular-nums ${numClass}`}>
                          {d.load}
                        </span>
                        <span className="hidden sm:inline w-24 text-[11px] font-medium text-muted-foreground">
                          → {d.driver}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-border dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    Preview de avaliação sintética · validação jurídica e técnica obrigatória
                  </span>
                  <Link
                    to="/nr1-copsoq"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-amber-300 hover:underline"
                  >
                    <span>Ver metodologia NR-1 & status</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10 · MINI-AVALIAÇÃO DE PRONTIDÃO EM 4 PERGUNTAS (de /planos)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        id="prontidao-home"
        className="bg-surface-alt py-20 md:py-24 border-b border-border scroll-mt-16"
        aria-labelledby="readiness-home-title"
      >
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary">
              <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
              <span>08. Avaliação rápida de prontidão · 4 perguntas</span>
            </p>
            <h2
              id="readiness-home-title"
              className="font-display text-3xl md:text-4xl font-bold mt-2 tracking-[-0.02em] text-balance"
            >
              Qual é o nível de prontidão da sua organização para a NR-1?
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Responda em menos de 1 minuto e visualize instantaneamente sua faixa de maturidade e o próximo passo
              recomendado — sem enviar dados pessoais.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-8 shadow-elevated">
            <ReadinessCalculator ctaHref="#plano-90-dias" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11 · FECHAMENTO — PONTE 90 DIAS + MANIFESTO + CTA FINAL
          ═══════════════════════════════════════════════════════════════ */}
      <section
        id="plano-90-dias"
        className="bg-background py-20 md:py-24 border-b border-border scroll-mt-16"
        aria-labelledby="roadmap-90-title"
      >
        <div className="container max-w-6xl">
          <motion.div {...fadeUp} className="overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-elevated">
            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="p-7 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-bold text-primary">
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    <span>Da incerteza ao plano de ação auditável</span>
                  </p>
                  <h2
                    id="roadmap-90-title"
                    className="font-display text-2xl md:text-4xl font-bold mt-3 tracking-[-0.02em] leading-tight text-balance"
                  >
                    Transforme a exigência da NR-1 em um plano estruturado de 90 dias.
                  </h2>
                  <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground">
                    Organize contexto, lacunas, papéis de RH, SST, CIPA e liderança em uma sequência segura — com
                    demonstração sintética imediata e sem coleta de dados reais antes das aprovações formais exigidas.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/planos#pricing"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] whitespace-nowrap"
                    >
                      <span>Ver trilhas e escolher próximo passo</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      to={user ? "/app" : "/auth?intent=nr1"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-accent whitespace-nowrap"
                    >
                      <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Explorar Dashboard sintético</span>
                    </Link>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Dados reais, campanhas produtivas e documentos formais dependem de aprovações técnicas, jurídicas e
                    de governança.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 border-t border-border bg-muted/25 p-7 md:p-10 lg:border-l lg:border-t-0">
                {HOME_90_DAY_BRIDGE.map((item) => (
                  <div key={item.step} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-primary">
                        {item.step}. {item.label}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{item.window}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative bg-surface-alt py-20 md:py-28 overflow-hidden border-b border-border">
        <div className="absolute inset-0 mesh-bg opacity-65" aria-hidden="true" />
        <motion.div {...fadeUp} className="container relative max-w-4xl text-center">
          <Quote className="h-7 w-7 text-secondary mx-auto mb-6" aria-hidden="true" />
          <p className="font-display text-2xl md:text-4xl font-light leading-[1.25] tracking-[-0.02em] text-foreground text-balance">
            “O bem-estar não é um benefício corporativo.{" "}
            <span className="italic font-medium">É infraestrutura</span> de inovação, retenção e desempenho coletivo.”
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground">
            <div className="h-px w-10 bg-border" />
            <span className="text-xs font-semibold">Manifesto Felicidade para Todos</span>
            <div className="h-px w-10 bg-border" />
          </div>
        </motion.div>
      </section>

      {/* CTA FINAL */}
      <section
        className="relative bg-background py-24 md:py-32 overflow-hidden"
        aria-labelledby="cta-title"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 opacity-25 dark:opacity-15">
            <img
              src={heroSphereLight}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              width={1920}
              height={1280}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/75 to-background" />
          <div className="absolute top-0 inset-x-0 gold-line-thin" />
        </div>

        <motion.div {...fadeUp} className="container relative max-w-3xl text-center">
          <p className="text-xs font-bold text-secondary mb-4">Demonstração sintética disponível</p>
          <h2
            id="cta-title"
            className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-[-0.03em] leading-[1.06] text-balance"
          >
            Comece a jornada para{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(110deg, hsl(40 90% 48%), hsl(36 100% 45%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              trabalho saudável e evidências NR-1
            </span>{" "}
            hoje.
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Acesso demonstrativo para explorar os 12 drivers, o cockpit NR-1 e a arquitetura de governança. Dados reais
            e operações formais continuam bloqueados até as aprovações necessárias.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={user ? "/app" : "/auth?intent=nr1"}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-secondary px-8 py-4 text-sm font-bold text-secondary-foreground transition-all hover:shadow-gold hover:scale-[1.02] whitespace-nowrap"
            >
              <span>{user ? "Continuar no Dashboard NR-1" : "Explorar demonstração"}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
            <Link
              to="/planos"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-card/80 backdrop-blur-md px-7 py-4 text-sm font-semibold text-foreground transition-all hover:border-primary/40 whitespace-nowrap"
            >
              <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Ver planos e trilhas B2B</span>
            </Link>
            <a
              href={PLAYBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-2xl border border-border bg-card/60 backdrop-blur-md px-6 py-4 text-sm font-medium text-foreground/80 transition-all hover:text-foreground whitespace-nowrap"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Referência externa</span>
              <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Pop-Out Modal de Ciência de Aprendizagem para os 9 Módulos NR-1 */}
      <HomeNr1ModuleLearningModal
        moduleId={activeModuleModalId}
        open={activeModuleModalId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveModuleModalId(null);
        }}
        onSelectModule={(nextId) => setActiveModuleModalId(nextId)}
        isAuthenticated={Boolean(user)}
      />
    </div>
  );
}
