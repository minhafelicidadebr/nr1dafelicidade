// @ts-nocheck -- pre-existing type errors carried over from the original project
/**
 * Skill Engine: Sra. EstratégIA — Workspace Agêntico 4 Abas, Tags Semânticas,
 * Tabelas Determinísticas, Roteamento Ecossistêmico e Neuromarketing Ético B2B.
 */
import { dimensionToDriver } from "@/data/copsoqData";
import { getDimensionLabel, getDriverLabel, RISK_BAND_LABEL, riskBand } from "@/lib/nr1/labels";
import { topDriverForDimension } from "@/lib/nr1/topDriver";
import type { AuroraChatItem } from "./chatHistory";
import type { AuroraContext } from "./contextBuilder";

export type StrategiaWorkspaceTabId = "conversa" | "diagnostico" | "plano" | "contato";

export type StrategiaDomainTagId =
  | "all"
  | "nr1"
  | "diagnostico_executivo"
  | "governanca"
  | "copsoq"
  | "playbook_20"
  | "roi_conselho";

export interface StrategiaDomainTag {
  id: StrategiaDomainTagId;
  label: string;
  shortBadge: string;
  description: string;
  defaultIntent: string;
  sampleQuestion: string;
}

export interface StrategiaQuickTopicCard {
  id: string;
  title: string;
  subtitle: string;
  tagId: StrategiaDomainTagId;
  intent: string;
  question: string;
  neuromarketingHook: string;
}

export interface StrategiaDiagnosticCardTriad {
  number: "01" | "02" | "03";
  title: "Contexto" | "Prioridades" | "Encaminhamento";
  status: "ready" | "attention" | "building";
  headline: string;
  detail: string;
  ctaLabel: string;
  ctaTo: string;
}

export interface StrategiaDiagnosticTableRow {
  rank: number;
  dimensionKey: string;
  dimensionLabel: string;
  bandKey: "baixo" | "moderado" | "alto" | "critico";
  bandLabel: string;
  riskScore: number;
  formula: string;
  sampleN: number;
  driverKey: string | null;
  driverLabel: string;
  recommendedControlFocus: string;
  routeTo: string;
}

export interface StrategiaAuditPlanStage {
  stageNumber: number;
  code: string;
  title: string;
  description: string;
  normativeAnchor: string;
  status: "completed" | "current" | "upcoming";
  statusLabel: string;
  routeTo: string;
  routeLabel: string;
  intentToAsk: string;
}

export interface StrategiaInstitutionalLeadPayload {
  workEmail: string;
  organizationName: string;
  headcountBand: string;
  sector: string;
  challengeNote: string;
  lgpdConsent: boolean;
  recognizedSignals: string[];
  contextSummary: string;
  prioritiesSummary: string;
  recommendedServiceTier: string;
}

export interface StrategiaInnovationItem {
  number: number;
  title: string;
  pillar: "UX Agêntica" | "Ciência de Aprendizagem" | "Rigor Normativo MTE/Oxford" | "Neuromarketing Ético B2B";
  summary: string;
  ecosystemHook: string;
}

export const STRATEGIA_DOMAIN_TAGS: readonly StrategiaDomainTag[] = [
  {
    id: "all",
    label: "Visão Geral",
    shortBadge: "Todos",
    description: "Todas as lentes integradas do ecossistema NR-1.",
    defaultIntent: "overview.next",
    sampleQuestion: "Qual é o próximo passo mais importante da nossa jornada NR-1?",
  },
  {
    id: "nr1",
    label: "NR-1",
    shortBadge: "NR-1 Cap. 1.5",
    description: "Prontidão GRO/PGR, 3 documentos mínimos, CIPA e Manual MTE 2026.",
    defaultIntent: "overview.summary",
    sampleQuestion: "Qual é a nossa prontidão atual frente ao Cap. 1.5 da NR-1 e Guia MTE 2026?",
  },
  {
    id: "diagnostico_executivo",
    label: "Diagnóstico executivo",
    shortBadge: "Diagnóstico",
    description: "Leitura S×P (Matriz AIHA 5×5) das dimensões prioritárias com k>=5.",
    defaultIntent: "risk.explain_top3",
    sampleQuestion: "Explique os 3 maiores riscos psicossociais do ciclo atual e seu impacto executivo.",
  },
  {
    id: "governanca",
    label: "Governança",
    shortBadge: "Governança & LGPD",
    description: "Proteção de k-anonimato (k>=5), rastreabilidade SHA-256 e ponte PCMSO NR-7.",
    defaultIntent: "risk.suppressed",
    sampleQuestion: "Como garantimos governança, k-anonimato (k>=5) e segurança jurídica nos laudos?",
  },
  {
    id: "copsoq",
    label: "COPSOQ II",
    shortBadge: "COPSOQ II + AEP",
    description: "Instrumento psicométrico validado combinado à Análise Ergonômica Preliminar (NR-17).",
    defaultIntent: "cycle.readiness",
    sampleQuestion: "Como aplicar o COPSOQ II integrado à observação da atividade real (AEP/NR-17)?",
  },
  {
    id: "playbook_20",
    label: "Playbook 2.0",
    shortBadge: "Oxford DRIVER",
    description: "Intervenções organizacionais baseadas em evidências (Universidade de Oxford).",
    defaultIntent: "actions.suggest_first",
    sampleQuestion: "Quais intervenções do Work Wellbeing Playbook 2.0 (Oxford) atacam o nosso risco #1 na fonte?",
  },
  {
    id: "roi_conselho",
    label: "Conselho e ROI",
    shortBadge: "Conselho & ROI",
    description: "Narrativa para Diretoria/Conselho: mitigação de passivos, retenção e valor sustentável.",
    defaultIntent: "documents.which",
    sampleQuestion: "Como apresentar o retorno institucional, mitigação de passivos e plano NR-1 para o Conselho?",
  },
] as const;

export const STRATEGIA_QUICK_TOPIC_CARDS: readonly StrategiaQuickTopicCard[] = [
  {
    id: "prontidao_nr1",
    title: "Prontidão NR-1",
    subtitle: "Auditar ciclo PDCA, 3 documentos do PGR e requisitos MTE 2026.",
    tagId: "nr1",
    intent: "overview.summary",
    question: "Avalie nossa prontidão NR-1 Cap. 1.5 e indique o que falta para um PGR auditável.",
    neuromarketingHook: "Reduz incerteza regulatória com diagnóstico objetivo em 5 segundos.",
  },
  {
    id: "copsoq_ii",
    title: "COPSOQ II & AEP",
    subtitle: "Escuta científica (k>=5) cruzada com o trabalho real (NR-17).",
    tagId: "copsoq",
    intent: "risk.explain_top3",
    question: "Quais são os 3 principais riscos mapeados via COPSOQ II e como conectá-los à AEP (NR-17)?",
    neuromarketingHook: "Ancora autoridade científica (Oxford + MTE) e proteção de dados.",
  },
  {
    id: "conselho_roi",
    title: "Conselho e ROI",
    subtitle: "Governança executiva, redução de passivos e dossiê para liderança.",
    tagId: "roi_conselho",
    intent: "documents.which",
    question: "Quais documentos e indicadores devo levar ao Conselho para demonstrar governança NR-1 e ROI?",
    neuromarketingHook: "Conecta saúde psicossocial à proteção de reputação, retenção e EBITDA.",
  },
  {
    id: "proximo_passo",
    title: "Próximo passo",
    subtitle: "Ação imediata na fonte, controles e plano auditável.",
    tagId: "playbook_20",
    intent: "overview.next",
    question: "Qual é o próximo passo prioritário para sair do diagnóstico e formalizar ação auditável?",
    neuromarketingHook: "Converte intenção em micro-compromisso acionável (Efeito Zeigarnik).",
  },
] as const;

export const STRATEGIA_NINE_INNOVATIONS: readonly StrategiaInnovationItem[] = [
  {
    number: 1,
    title: "Workspace Agêntico Multimodal de 4 Abas (Conversa · Diagnóstico · Plano · Contato)",
    pillar: "UX Agêntica",
    summary:
      "Substitui o chat linear passivo por uma estação de decisão executiva em 4 abas sincronizadas em tempo real com a telemetria do ciclo ativo.",
    ecosystemHook: "Sincronizado com AuroraContext, histórico local e rotas /app/*.",
  },
  {
    number: 2,
    title: "Motor de Extração de Sinais & Tríade Diagnóstica Automática (01 Contexto · 02 Prioridades · 03 Encaminhamento)",
    pillar: "Ciência de Aprendizagem",
    summary:
      "Organiza automaticamente os dados do ciclo (ou o relato livre do gestor) em 3 blocos cognitivos de baixa carga intrínseca (Sweller) e dupla codificação (Paivio).",
    ecosystemHook: "Populado dinamicamente por buildStrategiaDiagnosticTriad(ctx, history).",
  },
  {
    number: 3,
    title: "Tabelas Determinísticas S×P + Drivers de Oxford In-Chat e In-Tab",
    pillar: "Rigor Normativo MTE/Oxford",
    summary:
      "Renderiza matrizes tabulares auditáveis (Severidade × Probabilidade, Nível de Risco AIHA 5×5, Amostra n>=5, Driver Oxford e Rota de Controle) dentro da conversa e da aba Diagnóstico.",
    ecosystemHook: "Conectado a visibleScores, dimensionToDriver e /drivers/:slug.",
  },
  {
    number: 4,
    title: "Tags Semânticas Interativas com Filtragem de Intenção e Prompting Guiado",
    pillar: "UX Agêntica",
    summary:
      "Chips interativos no cabeçalho e no corpo (NR-1, Diagnóstico executivo, Governança, COPSOQ II, Playbook 2.0, Conselho & ROI) que filtram sugestões e disparam auditorias temáticas.",
    ecosystemHook: "Mapeamento determinístico tag -> intent -> rota.",
  },
  {
    number: 5,
    title: "Rota Recomendada 'Da Dúvida à Ação Auditável' com Telemetria de Progresso Vivo",
    pillar: "Ciência de Aprendizagem",
    summary:
      "A aba Plano exibe as 4 etapas do ciclo GRO/PGR com status real calculado do banco/sessão (Concluída, Em foco, Próxima) e deep-links diretos.",
    ecosystemHook: "Liga /app/cycles -> /app/work-analysis -> /app/risk -> /app/actions -> /app/documents.",
  },
  {
    number: 6,
    title: "Gatilhos de Neuromarketing Ético B2B & Enquadramento de Valor Executivo",
    pillar: "Neuromarketing Ético B2B",
    summary:
      "Aplica aversão a perda regulatória ética (evitar autuação MTE e adoecimento coletivo), prova social científica (Oxford/MTE 2026) e micro-compromissos de baixo atrito.",
    ecosystemHook: "Recomenda automaticamente a modalidade ideal de parceria com o Instituto.",
  },
  {
    number: 7,
    title: "Solicitação Institucional Pré-Preenchida por Contexto Reconhecido",
    pillar: "Neuromarketing Ético B2B",
    summary:
      "A aba Contato captura automaticamente organização, amostra, sinais reconhecidos e prioridades debatidas na conversa, eliminando formulários frios.",
    ecosystemHook: "Gera protocolo auditável e persiste o pedido institucional com consentimento LGPD.",
  },
  {
    number: 8,
    title: "Exportação Instantânea de Dossiê Diagnóstico da Sra. EstratégIA em PDF 5 Estrelas",
    pillar: "Rigor Normativo MTE/Oxford",
    summary:
      "Permite baixar diretamente da janela da Sra. EstratégIA um PDF institucional com capa, cards executivos, tabela S×P, plano de ação e identidade visual do Instituto + Empresa.",
    ecosystemHook: "Integrado ao motor downloadInstitutionalInstructionalPdf.",
  },
  {
    number: 9,
    title: "Blindagem Constitucional Zero-Alucinação & Trava k-Anonimato (k>=5) Visível",
    pillar: "Rigor Normativo MTE/Oxford",
    summary:
      "Toda resposta exibe o selo de verificação determinística, diferencia tom natural de tom técnico e bloqueia qualquer inferência clínica ou exposição de grupos com n < 5.",
    ecosystemHook: "Auditado por check:type-strictness e testes unitários determinísticos.",
  },
] as const;

/**
 * Reconhece sinais semânticos presentes na conversa e na telemetria do ciclo.
 */
export function extractRecognizedSignals(
  ctx: AuroraContext | null,
  history: readonly AuroraChatItem[],
  activeTag: StrategiaDomainTagId = "all",
): string[] {
  const signals = new Set<string>(["NR-1 Cap. 1.5", "Diagnóstico executivo", "Governança"]);

  if (ctx?.cycle) {
    signals.add(ctx.cycle.has_sample ? `Amostra k>=${ctx.k_min} (${ctx.cycle.n_responses} resp.)` : `Coleta em curso (k<${ctx.k_min})`);
  }
  if (ctx?.visibleScores && ctx.visibleScores.length > 0) {
    const top = ctx.visibleScores[0];
    signals.add(`Prioridade #1: ${getDimensionLabel(top.dimension, "pt-BR")} (R${top.risk_level})`);
  }
  if (activeTag !== "all") {
    const tagObj = STRATEGIA_DOMAIN_TAGS.find((t) => t.id === activeTag);
    if (tagObj) signals.add(tagObj.shortBadge);
  }

  const combinedText = history.map((h) => `${h.question} ${h.answer.summary.join(" ")}`).join(" ").toLowerCase();
  if (combinedText.includes("copsoq") || combinedText.includes("instrumento")) signals.add("COPSOQ II");
  if (combinedText.includes("cipa") || combinedText.includes("trabalhador")) signals.add("Consulta CIPA (Cap. 6 MTE)");
  if (combinedText.includes("pcmso") || combinedText.includes("nr-7")) signals.add("Ponte PGR <-> PCMSO (NR-7)");
  if (combinedText.includes("aep") || combinedText.includes("ergon") || combinedText.includes("nr-17")) {
    signals.add("Integração AEP/AET (NR-17)");
  }
  if (combinedText.includes("playbook") || combinedText.includes("driver") || combinedText.includes("oxford")) {
    signals.add("Oxford Playbook 2.0");
  }
  if (combinedText.includes("conselho") || combinedText.includes("roi") || combinedText.includes("diretoria")) {
    signals.add("Governança & ROI para Conselho");
  }

  return Array.from(signals);
}

/**
 * Constrói os 3 cards numerados da aba Diagnóstico ("01 Contexto", "02 Prioridades", "03 Encaminhamento")
 * combinando dados reais do ciclo (AuroraContext) e histórico da conversa.
 */
export function buildStrategiaDiagnosticTriad(
  ctx: AuroraContext | null,
  history: readonly AuroraChatItem[],
): StrategiaDiagnosticCardTriad[] {
  const hasCycle = Boolean(ctx?.cycle);
  const hasSample = Boolean(ctx?.cycle?.has_sample && (ctx?.visibleScores?.length ?? 0) > 0);
  const lastTurn = history.length > 0 ? history[history.length - 1] : null;

  // Card 01: Contexto
  const card01: StrategiaDiagnosticCardTriad = hasCycle
    ? {
        number: "01",
        title: "Contexto",
        status: hasSample ? "ready" : "attention",
        headline: `${ctx!.org?.name ?? "Organização"} · ${ctx!.cycle!.name}`,
        detail: hasSample
          ? `Amostra coletiva validada com ${ctx!.cycle!.n_responses} respostas (k>=${ctx!.k_min}), ${ctx!.visibleScores.length} dimensões elegíveis e ${ctx!.suppressedCount} protegidas por sigilo.`
          : `Ciclo identificado com ${ctx!.cycle!.n_responses} respostas. Atingir n>=${ctx!.k_min} desbloqueia o desdobramento estatístico completo.`,
        ctaLabel: "Inspecionar Ciclo",
        ctaTo: "/app/cycles",
      }
    : {
        number: "01",
        title: "Contexto",
        status: lastTurn ? "attention" : "building",
        headline: lastTurn ? "Relato inicial capturado na conversa" : "Aguardando relato ou seleção de ciclo",
        detail: lastTurn
          ? `Foco recente: "${lastTurn.question.slice(0, 80)}". Conecte um ciclo com k>=5 para vincular telemetria quantitativa.`
          : "Inicie uma pergunta na aba Conversa ou ative um ciclo de avaliação para leitura automática.",
        ctaLabel: "Configurar Ciclo",
        ctaTo: "/app/cycles",
      };

  // Card 02: Prioridades
  const topScores = ctx?.visibleScores?.slice(0, 3) ?? [];
  const card02: StrategiaDiagnosticCardTriad =
    topScores.length > 0
      ? {
          number: "02",
          title: "Prioridades",
          status: "ready",
          headline: topScores
            .map((s, idx) => `${idx + 1}º ${getDimensionLabel(s.dimension, "pt-BR")} (R${s.risk_level})`)
            .join(" · "),
          detail: `Dimensão líder com Severidade S${topScores[0].severity} × Probabilidade P${topScores[0].probability} (n=${topScores[0].n_responses}). Exige controle organizacional na fonte (NR-1 item 1.5.5.1.1).`,
          ctaLabel: "Abrir Matriz de Riscos",
          ctaTo: "/app/risk",
        }
      : {
          number: "02",
          title: "Prioridades",
          status: lastTurn ? "attention" : "building",
          headline: lastTurn ? "Priorização qualitativa preliminar" : "Ainda não analisado",
          detail: lastTurn
            ? lastTurn.answer.whyMatters
            : "Assim que o ciclo atingir k>=5 ou você selecionar um tópico na conversa, as prioridades críticas aparecerão aqui.",
          ctaLabel: "Ver Inventário de Riscos",
          ctaTo: "/app/risk",
        };

  // Card 03: Encaminhamento
  const topDim = topScores[0]?.dimension;
  const topDriver = topDim ? topDriverForDimension(dimensionToDriver, topDim) : null;
  const card03: StrategiaDiagnosticCardTriad =
    topScores.length > 0
      ? {
          number: "03",
          title: "Encaminhamento",
          status: "ready",
          headline: topDriver
            ? `Intervir via Driver "${getDriverLabel(topDriver, "pt-BR")}" + Plano de Ação PGR`
            : "Converter risco prioritário em Plano de Ação com responsável e aferição",
          detail:
            lastTurn?.answer.nextAction ??
            "Vincular medida de prevenção coletiva no Plano de Ação, registrar evidência de controle e emitir o trio documental do PGR em PDF.",
          ctaLabel: "Ir para Plano de Ação",
          ctaTo: "/app/actions",
        }
      : {
          number: "03",
          title: "Encaminhamento",
          status: lastTurn ? "attention" : "building",
          headline: lastTurn ? "Rota consultiva recomendada" : "Em construção",
          detail:
            lastTurn?.answer.nextAction ??
            "Estruturar prontidão documental do GRO, mobilizar coleta anônima (k>=5) ou agendar diagnóstico assistido com o Instituto.",
          ctaLabel: "Ver Documentos PGR",
          ctaTo: "/app/documents",
        };

  return [card01, card02, card03];
}

/**
 * Constrói a Tabela Determinística de Riscos S×P e Drivers do Playbook 2.0
 * para exibição na aba Diagnóstico e dentro das respostas da Sra. EstratégIA.
 */
export function buildStrategiaDiagnosticTable(ctx: AuroraContext | null): StrategiaDiagnosticTableRow[] {
  if (!ctx?.visibleScores || ctx.visibleScores.length === 0) return [];
  return ctx.visibleScores.slice(0, 6).map((s, idx) => {
    const band = riskBand(s.risk_level);
    const drv = topDriverForDimension(dimensionToDriver, s.dimension);
    return {
      rank: idx + 1,
      dimensionKey: s.dimension,
      dimensionLabel: getDimensionLabel(s.dimension, "pt-BR"),
      bandKey: band,
      bandLabel: RISK_BAND_LABEL[band],
      riskScore: s.risk_level,
      formula: `S${s.severity}×P${s.probability}`,
      sampleN: s.n_responses,
      driverKey: drv,
      driverLabel: drv ? getDriverLabel(drv, "pt-BR") : "Redesenho Organizacional",
      recommendedControlFocus:
        band === "critico" || band === "alto"
          ? "Controle na Fonte (Eliminação / Substituição / Redesenho)"
          : "Controle Administrativo & Monitoramento Preventivo",
      routeTo: drv ? `/drivers/${drv}` : "/app/actions",
    };
  });
}

/**
 * Constrói as 4 etapas da aba Plano ("ROTA RECOMENDADA — Da dúvida à ação auditável")
 * refletindo o estado vivo do ciclo no ecossistema.
 */
export function buildStrategiaAuditPlanStages(ctx: AuroraContext | null): StrategiaAuditPlanStage[] {
  const hasOrgAndUnits = Boolean(ctx?.org && (ctx?.unitsCount ?? 0) > 0);
  const hasSampleCycle = Boolean(ctx?.cycle?.has_sample);
  const hasComputedRisks = Boolean((ctx?.visibleScores?.length ?? 0) > 0);

  return [
    {
      stageNumber: 1,
      code: "ETAPA 1",
      title: "Entender a prontidão e o trabalho real",
      description:
        "Mapear unidades/GES, levantar perigos preliminares e cruzar com a Análise Ergonômica Preliminar (AEP — NR-17).",
      normativeAnchor: "NR-1 subitens 1.5.4.2 e 1.5.3.2.1 · Guia MTE 2026 Cap. 5 e Cap. 8",
      status: hasOrgAndUnits ? "completed" : "current",
      statusLabel: hasOrgAndUnits ? `${ctx!.unitsCount} unidade(s) mapeada(s)` : "Iniciar mapeamento",
      routeTo: "/app/work-analysis",
      routeLabel: "Abrir Análise da Atividade (AEP)",
      intentToAsk: "overview.summary",
    },
    {
      stageNumber: 2,
      code: "ETAPA 2",
      title: "Priorizar o ciclo com proteção k-anonimato (k>=5)",
      description:
        "Definir escopo, garantir participação dos trabalhadores (Cap. 6 MTE) e aplicar instrumento validado (COPSOQ II).",
      normativeAnchor: "NR-1 subitem 1.5.3.3 · Guia MTE 2026 Cap. 6 e Cap. 11",
      status: hasSampleCycle ? "completed" : hasOrgAndUnits ? "current" : "upcoming",
      statusLabel: hasSampleCycle
        ? `Ciclo ativo (${ctx!.cycle!.n_responses} respostas · k>=${ctx!.k_min})`
        : "Mobilizar coleta k>=5",
      routeTo: "/app/cycles",
      routeLabel: "Gerenciar Ciclos & Coleta",
      intentToAsk: "cycle.readiness",
    },
    {
      stageNumber: 3,
      code: "ETAPA 3",
      title: "Co-construir Controles na Fonte & Drivers Oxford",
      description:
        "Priorizar matriz AIHA 5×5 (S×P), acionar os 16 Drivers do Playbook 2.0 e definir responsáveis, prazos e aferição.",
      normativeAnchor: "NR-1 subitens 1.5.4.4 e 1.5.5.2 · Oxford Work Wellbeing Playbook 2.0",
      status: hasComputedRisks ? "current" : "upcoming",
      statusLabel: hasComputedRisks
        ? `${ctx!.visibleScores.length} dimensões prontas para ação`
        : "Aguardando cômputo S×P",
      routeTo: "/app/actions",
      routeLabel: "Abrir Plano de Ação & Controles",
      intentToAsk: "actions.suggest_first",
    },
    {
      stageNumber: 4,
      code: "ETAPA 4",
      title: "Formalizar evidências e Trio Documental PGR em PDF",
      description:
        "Emitir Inventário de Riscos, Plano de Ação, 3º Documento de Critérios do GRO e Ponte PGR <-> PCMSO (NR-7) em PDF auditável.",
      normativeAnchor: "NR-1 subitens 1.5.7.1, 1.5.4.4.2.2 e 1.5.5.1.1 'c' · Guia MTE 2026 Cap. 12.3 e 13",
      status: "upcoming",
      statusLabel: "Exportação PDF 5 Estrelas disponível",
      routeTo: "/app/documents",
      routeLabel: "Emitir Documentos PGR (.pdf)",
      intentToAsk: "documents.which",
    },
  ];
}

/**
 * Recomenda o enquadramento consultivo de Neuromarketing Ético B2B para a aba Contato
 * com base na maturidade atual do ciclo.
 */
export function buildConsultativeServiceRecommendation(ctx: AuroraContext | null): {
  tierTitle: string;
  valueProposition: string;
  urgencyAnchor: string;
  deliverables: string[];
} {
  const highRisks = (ctx?.visibleScores ?? []).filter((s) => s.risk_level >= 15);
  if (highRisks.length > 0) {
    return {
      tierTitle: "Programa Executivo de Intervenção Assistida & Governança PGR/NR-1",
      valueProposition:
        "Mitigação estruturada nas dimensões críticas identificadas, com facilitação para lideranças, consulta formal à CIPA e blindagem documental GRO/PGR.",
      urgencyAnchor: `${highRisks.length} dimensão(ões) em faixa Alta/Crítica (R>=15) requerem ação organizacional na fonte e registro formal de eficácia (NR-1 item 1.5.5.3.2).`,
      deliverables: [
        "Revisão técnica por especialistas SST/Ergonomia/Psicologia Organizacional do Instituto",
        "Trilha executiva nos Drivers prioritários do Work Wellbeing Playbook 2.0 (Oxford)",
        "Dossiê Executivo para Diretoria/Conselho + Ponte Técnica PGR <-> PCMSO (NR-7)",
      ],
    };
  }

  return {
    tierTitle: "Diagnóstico Institucional Assistido — Prontidão NR-1 Cap. 1.5 & Cultura de Bem-Estar",
    valueProposition:
      "Estruturação completa do ciclo psicossocial com governança de k-anonimato (k>=5), engajamento seguro dos trabalhadores e matriz de critérios do GRO.",
    urgencyAnchor:
      "Garanta conformidade técnica com o Manual Oficial MTE 2026 antes de auditorias fiscais ou fechamento do ciclo anual do PGR.",
    deliverables: [
      "Setup assistido do Ciclo COPSOQ II + Integração AEP (NR-17)",
      "Parametrização do 3º Documento Obrigatório do PGR (Critérios do GRO — 1.5.4.4.2.2)",
      "Workshop executivo de sensibilização para Alta Liderança, RH, SESMT e CIPA",
    ],
  };
}

/**
 * Compila um Dossiê Executivo Markdown pronto para ser exportado em PDF 5 Estrelas
 * diretamente da janela da Sra. EstratégIA.
 */
export function buildStrategiaExecutiveDossierMarkdown(params: {
  ctx: AuroraContext | null;
  history: readonly AuroraChatItem[];
  lead?: Partial<StrategiaInstitutionalLeadPayload>;
}): string {
  const { ctx, history, lead } = params;
  const triad = buildStrategiaDiagnosticTriad(ctx, history);
  const tableRows = buildStrategiaDiagnosticTable(ctx);
  const stages = buildStrategiaAuditPlanStages(ctx);
  const signals = extractRecognizedSignals(ctx, history);
  const serviceRec = buildConsultativeServiceRecommendation(ctx);

  const lines: string[] = [
    `# Dossiê Executivo Sra. EstratégIA — Diagnóstico Orientado & Rota Auditável NR-1`,
    ``,
    `> Parecer consultivo preliminar gerado pela Sra. EstratégIA com base em telemetria agregada (k>=${ctx?.k_min ?? 5}), Guia Oficial MTE 2026 (Cap. 1.5 da NR-1) e Work Wellbeing Playbook 2.0 (University of Oxford).`,
    ``,
    `## 1. Leitura do Contexto & Sinais Reconhecidos`,
    ``,
    `- **Organização:** ${lead?.organizationName || ctx?.org?.name || "Organização em Avaliação"}`,
    `- **Ciclo / Escopo:** ${ctx?.cycle?.name || "Diagnóstico Preliminar NR-1"} (${ctx?.cycle?.n_responses ?? 0} respostas agregadas · k>=${ctx?.k_min ?? 5})`,
    `- **Setor / Porte Informado:** ${lead?.sector || "Multissetorial"} · ${lead?.headcountBand || `${ctx?.unitsCount ?? 1} unidade(s)`}`,
    `- **Sinais Reconhecidos no Ecossistema:** ${signals.join(" · ")}`,
    ``,
    `| Código | Pilar Diagnóstico | Síntese Executiva | Detalhamento Técnico |`,
    `| :--- | :--- | :--- | :--- |`,
    ...triad.map(
      (c) => `| ${c.number} | ${c.title} | ${c.headline} | ${c.detail} |`,
    ),
    ``,
  ];

  if (tableRows.length > 0) {
    lines.push(
      `## 2. Matriz Tabular de Riscos Psicossociais (AIHA 5x5) e Drivers Oxford`,
      ``,
      `| Rank | Dimensão COPSOQ II | Faixa | Escore (S×P) | Amostra (n) | Driver Playbook 2.0 (Oxford) | Foco de Controle (NR-1) |`,
      `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |`,
      ...tableRows.map(
        (r) =>
          `| #${r.rank} | ${r.dimensionLabel} | ${r.bandLabel} | R${r.riskScore} (${r.formula}) | n=${r.sampleN} | ${r.driverLabel} | ${r.recommendedControlFocus} |`,
      ),
      ``,
    );
  }

  lines.push(
    `## 3. Rota Recomendada — Da Dúvida à Ação Auditável (PDCA NR-1)`,
    ``,
    `| Etapa | Título Operacional | Status no Ecossistema | Base Normativa & Científica |`,
    `| :--- | :--- | :--- | :--- |`,
    ...stages.map(
      (st) =>
        `| ${st.code} | ${st.title} | ${st.statusLabel} | ${st.normativeAnchor} |`,
    ),
    ``,
    `## 4. Recomendação Consultiva Institucional (Instituto Felicidade para Todos)`,
    ``,
    `- **Modalidade Recomendada:** ${serviceRec.tierTitle}`,
    `- **Proposta de Valor:** ${serviceRec.valueProposition}`,
    `- **Ancoragem Regulatória:** ${serviceRec.urgencyAnchor}`,
    ``,
    `### Entregáveis Institucionais Sugeridos`,
    ...serviceRec.deliverables.map((d) => `- ${d}`),
    ``,
  );

  if (history.length > 0) {
    lines.push(`## 5. Registro Auditável das Interações com a Sra. EstratégIA`, ``);
    history.slice(-5).forEach((item, idx) => {
      lines.push(
        `### ${idx + 1}. Pergunta: ${item.question}`,
        `- **Síntese Técnica:** ${item.answer.summary.join(" ")}`,
        `- **Por que importa:** ${item.answer.whyMatters}`,
        `- **Próxima ação:** ${item.answer.nextAction}`,
        ``,
      );
    });
  }

  return lines.join("\n");
}

export interface StrategiaRouteContextualIntelligence {
  routeKey: string;
  pageTitle: string;
  pageBadge: string;
  proactiveIcebreakerQuestion: string;
  proactiveIntent: string;
  proactiveContextNote: string;
  recommendedTagIds: StrategiaDomainTagId[];
  contextualQuickCards: StrategiaQuickTopicCard[];
  contextualCtas: Array<{ label: string; to: string }>;
}

const ROUTE_INTELLIGENCE_MAP: Record<string, StrategiaRouteContextualIntelligence> = {
  "/": {
    routeKey: "/",
    pageTitle: "Página Principal · Plataforma 4 Lentes NR-1",
    pageBadge: "Início · 4 Lentes",
    proactiveIcebreakerQuestion:
      "Quer entender as faixas oficiais da NR-28 (UFIR/R$), simular o custo organizacional ou estruturar seu plano de 90 dias com NR-1 e Ciência do Bem-Estar?",
    proactiveIntent: "home.nr28_benchmark",
    proactiveContextNote:
      "Detectei que você está na Página Principal. Já atualizei minha base com o quadro NR-1 × NR-28 (efeito cascata FAP/RAT/INSS), o Simulador de Custos (+presets e resumo executivo), a Ciência do Bem-Estar (12 Drivers), o Pulso Regulatório™ e o Plano de 90 Dias.",
    recommendedTagIds: ["nr1", "roi_conselho", "playbook_20", "diagnostico_executivo", "governanca", "copsoq"],
    contextualQuickCards: [
      {
        id: "home_nr28_cascata",
        title: "Multas NR-28 & Cascata",
        subtitle: "Faixas em UFIR/R$, acúmulo de autos, FAP 0,50–2,00 e ações do INSS.",
        tagId: "nr1",
        intent: "home.nr28_benchmark",
        question: "Quais são as multas oficiais da NR-28 (UFIR/R$) e como funciona o efeito cascata?",
        neuromarketingHook: "Clareza imediata sobre exposição fiscal e passivo trabalhista.",
      },
      {
        id: "home_simulador_custos",
        title: "Simulador & Fórmulas",
        subtitle: "Presets por porte, composição %, sensibilidade e comparação NR-28.",
        tagId: "roi_conselho",
        intent: "home.cost_simulator",
        question: "Como funciona o Simulador de Custos Organizacionais e como levar o resumo à Diretoria?",
        neuromarketingHook: "Traduz turnover, absenteísmo e presenteísmo em pauta executiva.",
      },
      {
        id: "home_ciencia_bem_estar",
        title: "Ciência do Bem-Estar",
        subtitle: "12 Drivers Playbook 2.0, 12 dinâmicas pedagógicas e Matriz JD-R.",
        tagId: "playbook_20",
        intent: "home.wellbeing_science",
        question: "Como a Ciência do Bem-Estar no Trabalho e os 12 Drivers se integram à NR-1?",
        neuromarketingHook: "Transforma obrigação regulatória em cultura saudável e retenção.",
      },
      {
        id: "home_plano_90d",
        title: "Prontidão & Plano 90 Dias",
        subtitle: "Avaliação em 4 perguntas, Lei 14.831/2024 e roteiro de implantação.",
        tagId: "diagnostico_executivo",
        intent: "home.roadmap_90d",
        question: "Como estruturar o plano de 90 dias a partir da avaliação de prontidão da NR-1?",
        neuromarketingHook: "Converte incerteza regulatória em cronograma executável.",
      },
    ],
    contextualCtas: [
      { label: "Acessar Dashboard NR-1 (/app)", to: "/app" },
      { label: "Ver Planos e Trilhas B2B", to: "/planos" },
      { label: "Explorar os 12 Drivers", to: "/drivers" },
    ],
  },
  "/library": {
    routeKey: "/library",
    pageTitle: "Biblioteca de Evidências · Manual MTE 2026 & Oxford Playbook 2.0",
    pageBadge: "Evidências · MTE & Oxford",
    proactiveIcebreakerQuestion:
      "Como o Manual Oficial MTE 2026 (19 capítulos) e o Work Wellbeing Playbook 2.0 (Oxford) se conectam no nosso PGR?",
    proactiveIntent: "library.mte_oxford",
    proactiveContextNote:
      "Detectei que você está na Biblioteca Científica e Normativa. Estou pronta para cruzar os 19 capítulos do MTE 2026 com os 16 Drivers de Oxford.",
    recommendedTagIds: ["playbook_20", "nr1", "governanca", "copsoq", "diagnostico_executivo", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Ver Matriz de Riscos (/app/risk)", to: "/app/risk" },
      { label: "Emitir Documentos PGR (.pdf)", to: "/app/documents" },
    ],
  },
  "/drivers": {
    routeKey: "/drivers",
    pageTitle: "Trilhas de Bem-Estar · 12/16 Drivers Work Wellbeing Playbook 2.0",
    pageBadge: "Drivers · Oxford Playbook",
    proactiveIcebreakerQuestion:
      "Como transformar um Driver do Playbook 2.0 de Oxford em medida de controle coletivo na fonte para o PGR?",
    proactiveIntent: "drivers.how_it_works",
    proactiveContextNote:
      "Você está explorando os Drivers de Oxford. Posso indicar qual Driver ataca o risco #1 do seu ciclo e como registrá-lo no Plano de Ação.",
    recommendedTagIds: ["playbook_20", "diagnostico_executivo", "nr1", "copsoq", "governanca", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Abrir Plano de Ação (/app/actions)", to: "/app/actions" },
      { label: "Ver Medidas de Controle (/app/controls)", to: "/app/controls" },
    ],
  },
  "/nr1-copsoq": {
    routeKey: "/nr1-copsoq",
    pageTitle: "Lente 1 · Mensurar com COPSOQ II + AEP (NR-17)",
    pageBadge: "Lente 1 · COPSOQ II",
    proactiveIcebreakerQuestion:
      "Como aplicar o COPSOQ II com proteção de k-anonimato (k≥5) integrado à Análise Ergonômica Preliminar (NR-17)?",
    proactiveIntent: "cycle.readiness",
    proactiveContextNote:
      "Você está na página metodológica NR-1 & COPSOQ II. Preparei a explicação da matriz AIHA 5×5 (S×P) e da trava estatística k≥5.",
    recommendedTagIds: ["copsoq", "nr1", "governanca", "diagnostico_executivo", "playbook_20", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Iniciar Ciclo (/app/cycles)", to: "/app/cycles" },
      { label: "Ver Trabalho Real AEP (/app/work-analysis)", to: "/app/work-analysis" },
    ],
  },
  "/planos": {
    routeKey: "/planos",
    pageTitle: "Planos Institucionais & Governança Consultiva NR-1",
    pageBadge: "Planos & ROI",
    proactiveIcebreakerQuestion:
      "Qual modalidade de assessoria e licença da plataforma é mais recomendada para o porte e maturidade da nossa empresa?",
    proactiveIntent: "plans.advisory",
    proactiveContextNote:
      "Você está avaliando Planos & Investimento. Posso estruturar a justificativa de ROI e conformidade MTE 2026 para sua Diretoria.",
    recommendedTagIds: ["roi_conselho", "nr1", "diagnostico_executivo", "governanca", "playbook_20", "copsoq"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Acessar Demonstração (/app)", to: "/app" },
      { label: "Baixar Documentos Exemplo (.pdf)", to: "/app/documents" },
    ],
  },
  "/app": {
    routeKey: "/app",
    pageTitle: "Dashboard Executivo NR-1 · Visão Geral do Ciclo",
    pageBadge: "Dashboard NR-1",
    proactiveIcebreakerQuestion:
      "Qual é o diagnóstico atual do nosso ciclo no Dashboard e qual é o próximo passo prioritário na jornada NR-1?",
    proactiveIntent: "overview.next",
    proactiveContextNote:
      "Você está no Dashboard Executivo (/app). Já carreguei a telemetria do ciclo ativo (k≥5) para orientar sua próxima decisão.",
    recommendedTagIds: ["diagnostico_executivo", "nr1", "governanca", "playbook_20", "copsoq", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Abrir Matriz de Riscos (/app/risk)", to: "/app/risk" },
      { label: "Ir para Plano de Ação (/app/actions)", to: "/app/actions" },
    ],
  },
  "/app/company": {
    routeKey: "/app/company",
    pageTitle: "Módulo Empresa · Estrutura Organizacional & Escopo GRO",
    pageBadge: "Módulo Empresa",
    proactiveIcebreakerQuestion:
      "Como estruturar o cadastro da empresa e dos setores para garantir rastreabilidade no Inventário de Riscos do PGR?",
    proactiveIntent: "company.gro",
    proactiveContextNote:
      "Você está no módulo Empresa (/app/company). Posso orientar como espelhar seu organograma e CNPJ para o GRO/PGR.",
    recommendedTagIds: ["governanca", "nr1", "diagnostico_executivo", "copsoq", "playbook_20", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Configurar Unidades & GES (/app/units)", to: "/app/units" },
      { label: "Planejar Ciclo (/app/cycles)", to: "/app/cycles" },
    ],
  },
  "/app/units": {
    routeKey: "/app/units",
    pageTitle: "Módulo Unidades & GES/GHE · Grupos de Exposição Similar",
    pageBadge: "Unidades & GES",
    proactiveIcebreakerQuestion:
      "Como dimensionar Unidades e Grupos de Exposição Similar (GES) para garantir amostra k≥5 sem quebrar o anonimato?",
    proactiveIntent: "units.organize",
    proactiveContextNote:
      "Você está em Unidades & GHE (/app/units). Posso ajudar a calibrar o recorte amostral para que nenhuma unidade fique suprimida por k<5.",
    recommendedTagIds: ["governanca", "copsoq", "nr1", "diagnostico_executivo", "playbook_20", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Abrir Ciclos de Escuta (/app/cycles)", to: "/app/cycles" },
      { label: "Mapeamento AEP (/app/work-analysis)", to: "/app/work-analysis" },
    ],
  },
  "/app/cycles": {
    routeKey: "/app/cycles",
    pageTitle: "Módulo Ciclos de Escuta · Coleta Anônima & Adesão k≥5",
    pageBadge: "Ciclos & Coleta k≥5",
    proactiveIcebreakerQuestion:
      "Quantas respostas faltam para atingir k≥5 neste ciclo e como distribuir tokens únicos com segurança?",
    proactiveIntent: "cycles.k5_gap",
    proactiveContextNote:
      "Você está em Ciclos de Escuta (/app/cycles). Estou monitorando a meta de k-anonimato (k≥5) e a mobilização por unidade.",
    recommendedTagIds: ["copsoq", "governanca", "nr1", "diagnostico_executivo", "playbook_20", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Analisar Matriz de Riscos (/app/risk)", to: "/app/risk" },
      { label: "Registrar Trabalho Real (/app/work-analysis)", to: "/app/work-analysis" },
    ],
  },
  "/app/risk": {
    routeKey: "/app/risk",
    pageTitle: "Matriz de Riscos Psicossociais · AIHA 5×5 (Severidade × Probabilidade)",
    pageBadge: "Matriz de Riscos S×P",
    proactiveIcebreakerQuestion:
      "Quais são os 3 riscos mais críticos (S×P) deste ciclo e quais Drivers de Oxford devemos acionar primeiro?",
    proactiveIntent: "risk.explain_top3",
    proactiveContextNote:
      "Você está na Matriz de Riscos (/app/risk). Já processei os escores S×P visíveis (k≥5) e preparei a tabela comparativa com os Drivers de Oxford.",
    recommendedTagIds: ["diagnostico_executivo", "playbook_20", "nr1", "copsoq", "governanca", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Converter em Plano de Ação (/app/actions)", to: "/app/actions" },
      { label: "Selecionar Controles na Fonte (/app/controls)", to: "/app/controls" },
    ],
  },
  "/app/actions": {
    routeKey: "/app/actions",
    pageTitle: "Plano de Ação Preventivo · NR-1 Subitem 1.5.5.2 (5W2H & Aferição)",
    pageBadge: "Plano de Ação PGR",
    proactiveIcebreakerQuestion:
      "Quais ações preventivas na fonte têm prioridade máxima e quais evidências/KPIs de aferição o MTE exige?",
    proactiveIntent: "actions.create_from_risk",
    proactiveContextNote:
      "Você está no Plano de Ação (/app/actions). Posso sugerir intervenções na fonte para o risco #1 e verificar critérios de aferição (Cap. 12 MTE).",
    recommendedTagIds: ["playbook_20", "nr1", "diagnostico_executivo", "governanca", "copsoq", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Vincular Controles (/app/controls)", to: "/app/controls" },
      { label: "Emitir Plano em PDF (/app/documents)", to: "/app/documents" },
    ],
  },
  "/app/controls": {
    routeKey: "/app/controls",
    pageTitle: "Catálogo e Governança de Controles · Hierarquia NR-1 & ISO 45003",
    pageBadge: "Medidas de Controle",
    proactiveIcebreakerQuestion:
      "Como priorizar controles organizacionais na fonte (Eliminação/Redesenho) e avaliar sua eficácia entre ciclos?",
    proactiveIntent: "controls.organizational",
    proactiveContextNote:
      "Você está em Medidas de Controle (/app/controls). Posso orientar a hierarquia de controles exigida pela NR-1 e pelo Guia MTE 2026.",
    recommendedTagIds: ["nr1", "playbook_20", "governanca", "diagnostico_executivo", "copsoq", "roi_conselho"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Ver Plano de Ação (/app/actions)", to: "/app/actions" },
      { label: "Gerar Dossiê PGR em PDF (/app/documents)", to: "/app/documents" },
    ],
  },
  "/app/documents": {
    routeKey: "/app/documents",
    pageTitle: "Centro de Documentos Auditáveis em PDF · Trio PGR, CIPA & PCMSO",
    pageBadge: "Documentos PGR (.pdf)",
    proactiveIcebreakerQuestion:
      "O que falta para atingirmos 100% de prontidão documental e emitirmos os 3 documentos mínimos do PGR em PDF?",
    proactiveIntent: "documents.which",
    proactiveContextNote:
      "Você está em Documentos Preliminares (/app/documents). Posso auditar os pré-requisitos do DRPS, do 3º Documento do PGR (1.5.4.4.2.2) e da Ponte PCMSO (.pdf).",
    recommendedTagIds: ["governanca", "nr1", "roi_conselho", "diagnostico_executivo", "copsoq", "playbook_20"],
    contextualQuickCards: [...STRATEGIA_QUICK_TOPIC_CARDS],
    contextualCtas: [
      { label: "Revisar Matriz de Riscos (/app/risk)", to: "/app/risk" },
      { label: "Conferir Plano de Ação (/app/actions)", to: "/app/actions" },
    ],
  },
};

/**
 * Identifica em tempo real a página atual do usuário e retorna a pergunta estimuladora,
 * o intent determinístico preparado, as tags priorizadas, os cards rápidos e os CTAs contextuais.
 */
export function getRouteContextualIntelligence(pathname: string): StrategiaRouteContextualIntelligence {
  if (ROUTE_INTELLIGENCE_MAP[pathname]) {
    return ROUTE_INTELLIGENCE_MAP[pathname];
  }
  const keys = Object.keys(ROUTE_INTELLIGENCE_MAP)
    .filter((k) => k !== "/")
    .sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (pathname === k || pathname.startsWith(`${k}/`)) {
      return ROUTE_INTELLIGENCE_MAP[k];
    }
  }
  return ROUTE_INTELLIGENCE_MAP["/"];
}

