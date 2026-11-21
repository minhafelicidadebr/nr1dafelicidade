import { useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowRight, Shield, Zap, CheckCircle2, AlertTriangle, Scale,
  BookOpen, Brain, Heart, Users, Trophy, Sparkles, Star,
  GraduationCap, BarChart3, Lock, ExternalLink, Building2,
  FileCheck, TrendingUp, Award, Target, Layers, Clock,
  Lightbulb, MessageCircle, ChevronRight, Activity, Eye,
  PieChart, Cpu, Puzzle, ArrowUpRight, Gauge, CalendarCheck
} from "lucide-react";
import ReadinessCalculator from "@/components/sales/ReadinessCalculator";
import LeadCaptureForm from "@/components/sales/LeadCaptureForm";
import SegmentSelector from "@/components/sales/SegmentSelector";
import FAQAccordion from "@/components/sales/FAQAccordion";
import BuyerTrustCenter from "@/components/sales/VendorDeliveryReadinessCard";
import BuyerCommitteeJourney from "@/components/sales/BuyerCommitteeJourney";
import ReadinessGovernanceSprintCard from "@/components/sales/ReadinessGovernanceSprintCard";
import {
  g1ReadinessGovernanceSprintDefinition,
} from "@/data/g1ReadinessGovernanceSprint";
import { g1CommercialAuthorizationPresentation } from "@/data/commercialAuthorization";

/* ─── Compliance Cards (versioned) ─── */
const regulations = [
  {
    id: "nr1", name: "NR-1", norma_id: "NR1_GRO_PSYCHOSOCIAL",
    status: "critical", urgency: "high",
    description: "Inclui expressamente fatores de riscos psicossociais no Gerenciamento de Riscos Ocupacionais (GRO). Empresas devem identificar, avaliar e tratar riscos ligados a estresse crônico, sobrecarga, assédio e violência no trabalho.",
    penalty: "Risco fiscal e medidas administrativas conforme enquadramento aplicável",
    vigencia: "Portaria MTE nº 1.419/2024 — fiscalização a partir de 26/05/2026, sujeita a revisão técnica/jurídica",
    fonte_oficial: "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadoras-vigentes/nr-1",
    observacao_juridica: "A obrigatoriedade de avaliação de riscos psicossociais integra o PGR. A plataforma auxilia na identificação e documentação, mas não substitui parecer técnico de SST.",
    impact: [
      "Mapeamento exploratório de fatores psicossociais com 12 drivers de referência",
      "Trilhas de intervenção em curadoria com evidências rastreáveis",
      "Evidências organizadas para documentação preliminar do GRO/PGR",
      "Treinamentos gamificados de conscientização para líderes"
    ],
    icon: AlertTriangle, color: "destructive"
  },
  {
    id: "lei14831", name: "Lei 14.831/2024", norma_id: "LEI_14831_MENTAL_HEALTH_CERT",
    status: "opportunity", urgency: "medium",
    description: "Institui o Certificado Empresa Promotora da Saúde Mental, reconhecendo organizações com políticas consistentes de promoção do bem-estar dos trabalhadores.",
    penalty: null,
    vigencia: "Lei nº 14.831, de 27 de março de 2024 — vigente",
    fonte_oficial: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14831.htm",
    observacao_juridica: "A certificação é voluntária e concedida por comissão certificadora. A plataforma documenta evidências de ações, mas não garante o selo automaticamente.",
    impact: [
      "Programa estruturado de 12 drivers como apoio a evidências",
      "Dashboard de progresso por colaborador e equipe",
      "Relatórios preliminares para revisão competente",
      "Cultura organizacional mensurável com métricas de bem-estar"
    ],
    icon: Award, color: "success"
  },
  {
    id: "nr28", name: "NR-28", norma_id: "NR28_FISCALIZACAO_PENALIDADES",
    status: "critical", urgency: "high",
    description: "Define como a fiscalização atua e quais penalidades podem ser aplicadas em caso de descumprimento das NRs, incluindo multas graduadas, embargos e interdições.",
    penalty: "Penalidades dependem de enquadramento, porte e revisão competente",
    vigencia: "NR-28 vigente — atualização contínua pela CTPP/MTE",
    fonte_oficial: "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadoras-vigentes/norma-regulamentadora-no-28-nr-28",
    observacao_juridica: "As faixas de penalidade são parametrizadas por infração e porte. Valores exatos dependem da classificação no enquadramento específico da NR descumprida.",
    impact: [
      "Evidências documentadas de ações preventivas",
      "Registros de treinamento com certificação digital",
      "Métricas de engajamento como prova de diligência",
      "Planos de ação com rastreabilidade completa"
    ],
    icon: Scale, color: "warning"
  },
  {
    id: "decreto47412", name: "Decreto 47.412/2025", norma_id: "DECRETO_47412_DF_MENTAL_HEALTH",
    status: "pioneer", urgency: "medium",
    description: "Primeira política estadual de saúde mental no trabalho para servidores públicos no Brasil (DF), com ações de psicoeducação, acolhimento e governança.",
    penalty: null,
    vigencia: "Decreto nº 47.412, de 04/07/2025 — DODF",
    fonte_oficial: "https://www.sinj.df.gov.br/sinj/Norma/df4ea7bbb48d4ea1acd54a6cba022fef/Decreto_47412_04_07_2025.html",
    observacao_juridica: "Legislação distrital aplicável a servidores do GDF. Pode servir de referência para outras unidades federativas e municípios.",
    impact: [
      "Psicoeducação estruturada baseada nos 12 drivers",
      "Acolhimento digital com chatbots especializados",
      "Governança com painéis de acompanhamento institucional",
      "Modelo replicável para outros estados e municípios"
    ],
    icon: Building2, color: "info"
  }
];

const designPartnerTracks = [
  {
    id: "executive_discovery",
    name: "Descoberta Executiva", price: "Sem custo", period: "45 min",
    description: "Para transformar urgência regulatória em mapa claro de decisão",
    availability: "Disponível para conversa",
    formProfile: "short_demo_form",
    routeId: "cta_executive_discovery",
    formHeadline: "Preparar descoberta executiva",
    formSubtitle: "Organize o contexto inicial e os limites de uma conversa futura, sem enviar dados à equipe.",
    formCtaLabel: "Salvar rascunho local",
    features: [
      "Leitura do contexto de RH, SST e liderança",
      "Mapa de dores, riscos e decisões pendentes",
      "Demonstração da jornada NR-1 e COPSOQ",
      "Recomendação de próximo passo seguro",
      "Sem coleta de dados de trabalhadores"
    ],
    cta: "Preparar descoberta", highlighted: false
  },
  {
    id: "readiness_governance_sprint",
    name: g1ReadinessGovernanceSprintDefinition.title, price: g1CommercialAuthorizationPresentation.priceLabel, period: "formal",
    description: g1ReadinessGovernanceSprintDefinition.description,
    availability: g1CommercialAuthorizationPresentation.availabilityLabel,
    formProfile: "roadmap_request_form",
    routeId: "cta_readiness_governance_scope",
    formHeadline: "Preparar escopo de prontidão e governança",
    formSubtitle: "Registre localmente a intenção de revisar escopo, limites e termos antes de qualquer proposta ou operação assistida.",
    formCtaLabel: g1CommercialAuthorizationPresentation.localDraftCtaLabel,
    features: [
      "Workshop executivo, matriz de prontidão e gates de implantação",
      "Mapa de papéis, categorias documentais e riscos de procurement",
      "Dossiê preliminar sujeito a revisão humana qualificada",
      "Sem trabalhadores, scoring, dados pessoais, PGR ou laudo",
      "Venda depende de preço, termos, owners, capacidade, faturamento e aceite formal"
    ],
    cta: g1CommercialAuthorizationPresentation.localDraftNavigationLabel, highlighted: true
  },
  {
    id: "enterprise_readiness",
    name: "Enterprise Readiness", price: "Roadmap", period: "customizado",
    description: "Para preparar governança, segurança e rollout sem prometer operação antes da hora",
    availability: "Roadmap futuro",
    formProfile: "roadmap_request_form",
    routeId: "cta_enterprise_readiness",
    formHeadline: "Preparar roadmap enterprise",
    formSubtitle: "Organize requisitos futuros de governança e rollout sem iniciar contratação ou operação produtiva.",
    formCtaLabel: "Salvar roadmap local",
    features: [
      "Mapa de requisitos futuros para identidade, pessoas, BI e automações",
      "Plano de governança, DPA, retenção e incidentes",
      "Modelo de comitê RH/SST/CIPA e revisores",
      "Critérios para transição de piloto para operação",
      "Níveis de serviço produtivos apenas após operação comprovada"
    ],
    cta: "Montar roadmap", highlighted: false
  }
] as const;

const socialProof = [
  { metric: "6", label: "etapas da avaliação ao PGR", icon: Layers },
  { metric: "12", label: "drivers para traduzir risco em ação", icon: Brain },
  { metric: "90", label: "dias para sair de lacunas para evidências", icon: CalendarCheck },
  { metric: "1", label: "roadmap para RH, SST e liderança", icon: FileCheck },
];

const fadeUp = {
  initial: { y: 30 },
  whileInView: { y: 0 },
  viewport: { once: true },
};

const meetingSteps = [
  { step: 1, label: "Contexto e dores prioritárias", duration: "8 min", icon: MessageCircle },
  { step: 2, label: "Leitura de prontidão e riscos", duration: "7 min", icon: Gauge },
  { step: 3, label: "Modelo de avaliação e AlegrIA", duration: "8 min", icon: Cpu },
  { step: 4, label: "Demonstração da plataforma", duration: "12 min", icon: Eye },
  { step: 5, label: "Próximos passos: escopo ou roadmap", duration: "10 min", icon: CalendarCheck },
];

function ConversionBridge() {
  return (
    <section className="container py-10" aria-labelledby="planos-roadmap-title">
      <motion.div {...fadeUp} className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 md:p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Shield className="h-3.5 w-3.5" /> Da incerteza ao roadmap
            </div>
            <h2 id="planos-roadmap-title" className="font-display text-2xl font-bold md:text-3xl">
              Transforme exigência NR-1 em um plano de ação de 90 dias.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A primeira conversa organiza contexto, lacunas, stakeholders e próximos passos para RH, SST e liderança.
              Sem promessa de conformidade automática e sem coleta de dados reais antes das aprovações necessárias.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:shadow-lg">
                Escolher próximo passo <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/nr1-copsoq" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold transition-all hover:border-primary/30 hover:bg-accent">
                Ver metodologia NR-1 <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
              Dados reais, campanhas produtivas, integrações e documentos formais dependem de aprovações técnicas,
              jurídicas e de governança.
            </p>
          </div>

          <div className="grid gap-3 border-t border-border bg-muted/20 p-6 md:p-8 lg:border-l lg:border-t-0">
            {[
              {
                label: "Prontidão",
                text: "clareza sobre escopo, responsáveis, grupos e evidências já existentes.",
                icon: Gauge,
              },
              {
                label: "Demonstração",
                text: "visualização da jornada medir -> agir -> evidenciar com dados sintéticos.",
                icon: Eye,
              },
              {
                label: "Roadmap",
                text: "ações de 30/60/90 dias, critérios de aceite e revisão técnica.",
                icon: CalendarCheck,
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function SalesPage() {
  const [selectedTrackId, setSelectedTrackId] = useState<(typeof designPartnerTracks)[number]["id"]>(
    designPartnerTracks[0].id,
  );
  const selectedTrack = designPartnerTracks.find((track) => track.id === selectedTrackId) ?? designPartnerTracks[0];

  return (
    <MotionConfig reducedMotion="user">
      <div className="pb-20 md:pb-0">
      {/* ═══════ HERO — Split Layout ═══════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">NR-1 psicossocial — transforme obrigação em plano de ação</span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              Avalie, eduque e <span className="text-gradient-hero">transforme</span>{" "}
              bem-estar em <span className="text-gradient-gold">governança</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Uma jornada assistida para RH, SST e liderança saírem da incerteza: visualizar riscos psicossociais,
              traduzir sinais em drivers, organizar evidências e planejar ações sem prometer conformidade automática.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-lg hover:scale-[1.02] animate-pulse-ring">
                Escolher próximo passo <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#readiness"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-accent">
                <Gauge className="h-4 w-4" /> Avaliar prontidão
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Demo sintética e segura</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Playbook + evidências + governança</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Dados reais só após aprovações formais</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF BAR ═══════ */}
      <section className="border-y border-border bg-card">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {socialProof.map((s, i) => (
            <motion.div key={s.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="flex flex-col items-center gap-1.5">
              <s.icon className="h-5 w-5 text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">{s.metric}</span>
              <span className="text-xs text-foreground/80">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <ConversionBridge />

      {/* ═══════ SEGMENT SELECTOR ═══════ */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Para quem é a <span className="text-gradient-hero">plataforma</span>?
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
            Adaptamos narrativa, funcionalidades e oferta ao seu contexto organizacional.
          </p>
        </motion.div>
        <SegmentSelector />
      </section>

      {/* ═══════ PROBLEM / COST OF INACTION ═══════ */}
      <section className="bg-card border-y border-border py-16">
        <div className="container">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              A NR-1 mudou a conversa: saúde psicossocial precisa virar gestão.
            </h2>
            <p className="mt-3 text-muted-foreground text-sm max-w-xl mx-auto">
              A dúvida não é se sua organização deve olhar para riscos psicossociais. A dúvida é como fazer isso
              sem improviso, sem expor pessoas e sem criar relatórios frágeis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: "Risco difuso", label: "Sinais de estresse, sobrecarga e conflitos ficam espalhados em clima, afastamentos e relatos.", icon: AlertTriangle, color: "text-destructive" },
              { value: "Ação dispersa", label: "Treinamentos e campanhas perdem força quando não viram controles, donos e evidências.", icon: Zap, color: "text-warning" },
              { value: "Evidência frágil", label: "Sem trilha de decisão, fica difícil revisar, aprender e sustentar o PGR.", icon: TrendingUp, color: "text-success" },
            ].map((item, i) => (
              <motion.div key={item.value} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-background p-6 text-center hover:shadow-card-hover transition-all">
                <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color}`} />
                <div className="font-display text-xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-8 max-w-4xl mx-auto">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <h4 className="text-xs font-bold text-destructive mb-2">Fragilidades organizacionais que aumentam exposição:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Ausência de leitura estruturada de riscos psicossociais",
                  "Treinamentos de bem-estar desconectados da prática",
                  "Decisões de SST sem dados e evidências revisáveis",
                  "Documentação insuficiente para governança e auditoria",
                  "Fragmentação entre RH, SST, CIPA e liderança",
                  "Turnover e afastamentos sem leitura de causas-raiz"
                ].map((item, i) => (
                  <p key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/85">
                    <span className="text-destructive">•</span> {item}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ PULSO REGULATÓRIO™ (Compliance Cards Versioned) ═══════ */}
      <section className="py-16" id="regulatorio">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Exclusivo</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Pulso Regulatório™</h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
              Acompanhe obrigações, evidências e lacunas de prontidão. Cada norma é tratada como um registro versionado,
              com vigência, fonte oficial e observação jurídica — nunca como texto fixo genérico.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {regulations.map((reg, i) => (
              <motion.div key={reg.id} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-card-hover transition-all group">
                {/* Header */}
                <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${
                  reg.color === "destructive" ? "bg-destructive/5" :
                  reg.color === "success" ? "bg-success/5" :
                  reg.color === "warning" ? "bg-warning/5" : "bg-info/5"
                }`}>
                  <div className="flex items-center gap-3">
                    <reg.icon className={`h-5 w-5 ${
                      reg.color === "destructive" ? "text-destructive" :
                      reg.color === "success" ? "text-success" :
                      reg.color === "warning" ? "text-warning" : "text-info"
                    }`} />
                    <div>
                      <h3 className="font-display text-base font-bold">{reg.name}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        reg.status === "critical" ? "text-destructive" :
                        reg.status === "opportunity" ? "text-success" : "text-foreground"
                      }`}>
                        {reg.status === "critical" ? "⚠️ Atenção Necessária" :
                         reg.status === "opportunity" ? "🏆 Oportunidade Estratégica" :
                         "🚀 Pioneirismo"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">{reg.description}</p>

                  {reg.penalty && (
                    <div className="rounded-lg bg-destructive/5 border border-destructive/20 px-3 py-2">
                      <p className="text-[11px] font-semibold text-destructive">⚖️ {reg.penalty}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Como a plataforma apoia:
                    </p>
                    <ul className="space-y-1.5">
                      {reg.impact.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Versioned metadata */}
                  <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                    <p className="text-[9px] text-muted-foreground"><strong>Vigência:</strong> {reg.vigencia}</p>
                    <a href={reg.fonte_oficial} target="_blank" rel="noopener noreferrer"
                      className="text-[9px] text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-2.5 w-2.5" /> Fonte oficial
                    </a>
                    <p className="text-[10px] leading-relaxed text-foreground/80 italic">⚠️ {reg.observacao_juridica}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ METHODOLOGY — Measure → Understand → Act ═══════ */}
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Metodologia: <span className="text-gradient-hero">Medir → Compreender → Agir</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
              Referenciado ao Work Wellbeing Playbook, publicado pela World Wellbeing Movement com colaboração acadêmica do Wellbeing Research Centre. A referência não implica chancela deste produto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "Measure", title: "Medir", desc: "Mapeie os 12 drivers com survey versionado e sujeito a aprovação, identifique sinais psicossociais e crie uma baseline organizacional.", icon: PieChart, color: "text-primary" },
              { step: "Understand", title: "Compreender", desc: "Analise padrões, priorize intervenções por evidência e conecte dados a cada driver do Playbook.", icon: Brain, color: "text-secondary" },
              { step: "Act", title: "Agir", desc: "Ative trilhas gamificadas, capacite líderes, documente ações e gere relatórios de prontidão regulatória.", icon: Target, color: "text-success" },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }}
                className="relative rounded-2xl border border-border bg-card p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all">
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-hero text-primary-foreground w-7 h-7 flex items-center justify-center text-xs font-bold shadow-glow`}>
                  {i + 1}
                </div>
                <item.icon className={`h-10 w-10 mx-auto mt-4 mb-3 ${item.color}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.step}</span>
                <h3 className="font-display text-base font-bold mt-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Driver taxonomy grid */}
          <motion.div {...fadeUp} className="mt-10 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h4 className="font-display text-sm font-bold text-center mb-4">12 drivers descritos no Work Wellbeing Playbook</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[
                  { emoji: "👥", label: "Gestão" }, { emoji: "🛡️", label: "Confiança" },
                  { emoji: "⚡", label: "Estresse" }, { emoji: "🤝", label: "Suporte" },
                  { emoji: "🔋", label: "Energia" }, { emoji: "🫂", label: "Inclusão" },
                  { emoji: "💰", label: "Remuneração" }, { emoji: "🕐", label: "Flexibilidade" },
                  { emoji: "📖", label: "Aprendizagem" }, { emoji: "🧭", label: "Propósito" },
                  { emoji: "⭐", label: "Reconhecimento" }, { emoji: "🎯", label: "Realização" },
                ].map((d, i) => (
                  <div key={i} className="rounded-xl border border-border bg-background p-2.5 text-center hover:border-primary/30 transition-all">
                    <span className="text-xl">{d.emoji}</span>
                    <p className="text-[10px] font-semibold mt-1">{d.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-4 italic">
                ⚠️ Esta plataforma opera com finalidade educacional e organizacional. Não substitui avaliação clínica, perícia ou laudo médico.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ AlegrIA TEASER ═══════ */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-primary/20 bg-gradient-driver overflow-hidden text-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                  <Cpu className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[11px] font-bold text-primary">IA Contextual</span>
                </div>
                <h3 className="font-display text-xl font-bold">
                  Conheça a <span className="text-gradient-hero">AlegrIA</span>
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Uma jornada sintética para explorar 12 drivers de referência, consultar fontes em revisão e planejar ações.
                  12 personas especializadas — uma para cada dimensão do bem-estar.
                </p>
                <ul className="space-y-2">
                  {[
                    "Respostas sintéticas vinculadas a fontes em revisão",
                    "Guardrails contra overclaiming e informações clínicas",
                    "Recomendações contextuais por driver e perfil",
                    "Suporte à tomada de decisão sem substituir especialistas"
                  ].map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
                <a href="#lead-form" className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow hover:shadow-lg transition-all">
                  Experimentar AlegrIA <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="flex items-center justify-center p-8 bg-primary/5">
                <div className="rounded-2xl border border-border bg-card p-4 w-full max-w-xs shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-sm">🤖</div>
                    <div>
                      <p className="text-xs font-bold">AlegrIA — Líder Clara</p>
                      <p className="text-[9px] text-muted-foreground">Driver: Gestão & Liderança</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-background/80 p-3 text-[11px] text-foreground/85 leading-relaxed">
                    "Olá! Sou a Líder Clara 👩‍💼. O Work Wellbeing Playbook descreve práticas de liderança associadas a
                    melhores condições de bem-estar. Vamos explorar ações baseadas em evidências para sua liderança?"
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-2 text-center italic">Preview — conversa simulada</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════ SOLUTION ARCHITECTURE ═══════ */}
      <section className="bg-card border-y border-border py-16">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Tudo que sua organização precisa em <span className="text-gradient-gold">uma plataforma</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Brain, title: "12 experiências sintéticas", desc: "Cada driver possui uma demonstração de assistência, sem aconselhamento técnico ou runtime remoto aprovado" },
              { icon: Zap, title: "9 Dinâmicas por Driver", desc: "Quiz, Flashcards, VideoLab, Evidence Explorer, Simulador, Co-design, Arena de Debate e PDFs" },
              { icon: Trophy, title: "Gamificação Completa", desc: "Moeda IFT, badges, streaks, ranking e recompensas que sustentam engajamento pedagógico" },
              { icon: Shield, title: "Pulso Regulatório™", desc: "Acompanhe obrigações, evidências e lacunas de prontidão para NR-1, Lei 14.831, NR-28 e Decreto 47.412" },
              { icon: FileCheck, title: "PDFs Técnicos", desc: "Gere trilhas de implementação com 3+ páginas e poesia pedagógica com branding institucional" },
              { icon: BarChart3, title: "Dashboard de Progresso", desc: "Painéis individuais e corporativos com métricas de aprendizagem e engajamento" },
              { icon: Lock, title: "Fontes em revisão", desc: "Acervo local catalogado, ainda sujeito à validação de fonte, licença e claims" },
              { icon: Users, title: "Multi-equipe", desc: "Gestão de múltiplas equipes, departamentos e filiais com visão consolidada" },
              { icon: Heart, title: "Acessibilidade", desc: "Interface responsiva, acessível e inclusiva com suporte a dispositivos móveis" },
            ].map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 hover:border-primary/20 hover:shadow-card transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold">{f.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VALUE TRANSLATION / ROI ═══════ */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            De risco regulatório para <span className="text-gradient-gold">valor organizacional</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 space-y-3">
            <h4 className="font-display text-sm font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Sem a plataforma
            </h4>
            {[
              "Riscos psicossociais sem leitura estruturada",
              "Treinamentos genéricos com baixa transferência",
              "Ações isoladas sem rastreabilidade",
              "Dados fragmentados e decisões reativas",
              "Evidências frágeis para revisão técnica"
            ].map((item, i) => (
              <p key={i} className="text-xs text-foreground/80 flex items-start gap-2"><span className="text-destructive">✗</span> {item}</p>
            ))}
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="rounded-2xl border border-success/20 bg-success/5 p-6 space-y-3">
            <h4 className="font-display text-sm font-bold text-success flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Com a plataforma
            </h4>
            {[
              "Drivers organizacionais → hipóteses de intervenção",
              "Trilhas assistidas → transferência para o trabalho real",
              "IA supervisionada → apoio sem decisão automática",
              "Relatórios revisáveis → evidências para governança",
              "Lei 14.831 → apoio documental sem garantir certificação"
            ].map((item, i) => (
              <p key={i} className="text-xs text-foreground/80 flex items-start gap-2"><span className="text-success">✓</span> {item}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ READINESS CALCULATOR ═══════ */}
      <section className="bg-muted/30 border-y border-border py-16" id="readiness">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5 mb-4">
              <Gauge className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs font-bold text-secondary tracking-wider uppercase">Avaliação de prontidão</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Qual é o nível de prontidão da sua organização?
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
              Responda 4 perguntas rápidas e descubra onde sua empresa está na jornada de bem-estar no trabalho.
            </p>
          </motion.div>
          <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
            <ReadinessCalculator />
          </div>
        </div>
      </section>

      {/* ═══════ MEETING ROADMAP ═══════ */}
      <section className="container py-16">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Como será sua <span className="text-gradient-hero">reunião executiva</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
            45 minutos. Sem slides genéricos. Um roteiro desenhado para gerar clareza e próximos passos concretos.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            {meetingSteps.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative flex items-start gap-4 mb-6 last:mb-0">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-glow">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 rounded-xl border border-border bg-card p-4 hover:shadow-card transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-bold">{s.label}</h4>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{s.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-8 text-center">
            <p className="text-xs text-muted-foreground mb-3">
              Participantes sugeridos: RH, SST, Liderança executiva, Compliance (quando aplicável)
            </p>
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:shadow-lg transition-all">
              Escolher caminho para a conversa <CalendarCheck className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════ BUYER TRUST CENTER ═══════ */}
      <section
        id="trust-center"
        className="border-y border-border bg-muted/30 py-16"
        aria-labelledby="buyer-trust-center-title"
      >
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto max-w-6xl">
            <BuyerTrustCenter />
          </motion.div>
        </div>
      </section>

      {/* ═══════ BUYER COMMITTEE JOURNEY ═══════ */}
      <section
        id="buyer-committee"
        className="container py-16"
        aria-labelledby="buyer-committee-title"
      >
        <motion.div {...fadeUp} className="mx-auto max-w-6xl">
          <BuyerCommitteeJourney />
        </motion.div>
      </section>

      {/* ═══════ DESIGN PARTNER OFFER ═══════ */}
      <section className="container py-16" id="pricing">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Escolha o próximo passo. <span className="text-gradient-gold">Sem prometer antes da aprovação.</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
            Comece com descoberta, avance para a preparação de um sprint assistido e construa um roadmap enterprise
            quando governança, dados e revisão técnica estiverem prontos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {designPartnerTracks.map((plan, i) => (
            <motion.article key={plan.name} {...fadeUp} transition={{ delay: i * 0.1 }}
              aria-labelledby={`commercial-track-${plan.id}`}
              className={`relative rounded-2xl border overflow-hidden transition-all hover:shadow-card-hover ${
                selectedTrackId === plan.id
                  ? "border-primary shadow-glow bg-card ring-2 ring-primary/20"
                  : "border-border bg-card"
              }`}>
              {plan.highlighted && (
                <div className="bg-gradient-hero text-primary-foreground text-center py-1.5 text-xs font-bold tracking-wider uppercase">
                  Próxima etapa recomendada
                </div>
              )}
              <div className="p-6">
                <h3 id={`commercial-track-${plan.id}`} className="font-display text-lg font-bold">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                <p className="mt-3 inline-flex rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {plan.availability}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <a href="#lead-form"
                  aria-current={selectedTrackId === plan.id ? "step" : undefined}
                  onClick={() => setSelectedTrackId(plan.id)}
                  className={`mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    plan.highlighted
                      ? "bg-gradient-hero text-primary-foreground shadow-glow hover:shadow-lg hover:scale-[1.02]"
                      : "border border-border bg-background hover:bg-accent hover:border-primary/30"
                  }`}>
                  {plan.cta} <ArrowRight className="h-4 w-4" />
                </a>
                {selectedTrackId === plan.id && (
                  <p className="mt-2 text-center text-[10px] font-semibold text-primary">
                    Caminho selecionado para o rascunho local
                  </p>
                )}
                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
        <ReadinessGovernanceSprintCard />
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="bg-muted/30 border-y border-border py-16" id="faq">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold">Perguntas Frequentes</h2>
            <p className="text-muted-foreground mt-2 text-sm">Respostas para as objeções mais comuns de compradores institucionais.</p>
          </motion.div>
          <FAQAccordion />
        </div>
      </section>

      {/* ═══════ LEAD CAPTURE FORM ═══════ */}
      <section className="container py-16" id="lead-form" aria-labelledby="lead-form-title" tabIndex={-1}>
        <motion.div {...fadeUp} className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-card p-6 shadow-card-hover md:p-8">
          <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4" role="status" aria-live="polite">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Próximo passo escolhido</p>
            <h2 id="lead-form-title" className="mt-1 font-display text-xl font-bold">{selectedTrack.name}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{selectedTrack.description}</p>
            <ol className="mt-4 grid gap-2 text-[11px] sm:grid-cols-3" aria-label="Etapas da preparação comercial">
              {["Escolher caminho", "Salvar rascunho local", "Revisar com responsáveis"].map((step, index) => (
                <li key={step} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <LeadCaptureForm
            headline={selectedTrack.formHeadline}
            subtitle={selectedTrack.formSubtitle}
            ctaLabel={selectedTrack.formCtaLabel}
            formProfile={selectedTrack.formProfile}
            routeId={selectedTrack.routeId}
          />
        </motion.div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="border-t border-border bg-card py-16">
        <div className="container">
          <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Da exigência regulatória à ação prática. <br />
              <span className="text-gradient-hero">Comece hoje.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Use avaliação orientada por evidências, AlegrIA, relatórios e dashboards para priorizar riscos,
              desenvolver colaboradores e apoiar decisões de RH, SST e liderança.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-lg hover:scale-[1.02]">
                Comparar próximos passos <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/nr1-copsoq"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 text-sm font-semibold transition-all hover:border-primary/30 hover:bg-accent">
                Ver metodologia NR-1
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground">
              NR-1, Lei 14.831 e reporting executivo · Trilhas para colaboradores e líderes · Aplicação escalável
            </p>
          </motion.div>
        </div>
      </section>
      </div>
    </MotionConfig>
  );
}
