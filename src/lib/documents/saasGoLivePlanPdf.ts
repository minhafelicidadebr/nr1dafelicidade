import { jsPDF } from "jspdf";
import {
  CHECKOUT_FIRST_FLOW_STEPS,
  CONFIRMED_DECISIONS,
  DEVELOPMENT_SUPER_PROMPT,
  GOLIVE_WAVES_ROADMAP,
  MTE_NR1_OPERATIONAL_CHAIN,
  PLAN_ARCHITECTURE_TIERS,
  PLAN_DOCUMENT_META,
  PRODUCTION_KEYS_CHECKLIST,
  RBAC_PERMISSION_MATRIX,
  SAAS_BENCHMARKS,
  SUBSCRIPTION_LIFECYCLE_STATES,
  TOT_BRANCHES,
} from "@/data/saasGoLivePlan";
import type {
  SaasMaturityStage,
  SaasMaturitySummary,
} from "@/lib/governance/saasMaturity";

const DEEP_TEAL = [7, 28, 31] as const;
const NAVY = [15, 29, 48] as const;
const TEAL = [32, 146, 158] as const;
const GOLD = [193, 146, 44] as const;
const EMERALD = [16, 128, 88] as const;
const AMBER = [180, 108, 18] as const;
const ROSE = [178, 48, 62] as const;
const INK = [24, 32, 46] as const;
const MUTED = [86, 98, 118] as const;
const LIGHT_BG = [245, 247, 250] as const;
const CALLOUT_BG = [251, 248, 238] as const;
const BORDER = [220, 226, 235] as const;
const WHITE = [255, 255, 255] as const;

const STAGE_LABELS: Record<SaasMaturityStage, string> = {
  foundation: "1. Fundação Governada",
  synthetic_mvp: "2. MVP Sintético (G1)",
  controlled_pilot: "3. Piloto Controlado (G2)",
  real_saas: "4. SaaS Real / Produção (G3)",
  scale: "5. Escala Comercial (G4)",
};

const STAGE_ORDER: SaasMaturityStage[] = [
  "foundation",
  "synthetic_mvp",
  "controlled_pilot",
  "real_saas",
  "scale",
];

function sanitizePdfText(value: string): string {
  return value
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/→/g, "->")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/×/g, "x")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .trim();
}

export function buildSaasGoLivePlanPdf(
  summary: SaasMaturitySummary,
  generatedAt: Date = new Date(),
): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 16;
  const marginR = 16;
  const contentW = pageW - marginL - marginR;
  const footerY = pageH - 14;
  const dateLabel = generatedAt.toLocaleDateString("pt-BR");

  const addRunningHeader = (chapterTitle: string) => {
    doc.setFillColor(...DEEP_TEAL);
    doc.rect(0, 0, pageW, 13, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, 13, pageW, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...TEAL);
    doc.text("PLANO MESTRE GO-LIVE SAAS OFICIAL · NR-1 + BEM-ESTAR", marginL, 5.8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(210, 222, 232);
    doc.text(
      `Gate ${summary.currentGate} · Score Global ${summary.scorePct}% · Dados reais bloqueados até G3`,
      marginL,
      10.2,
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...GOLD);
    doc.text(sanitizePdfText(chapterTitle).toUpperCase().slice(0, 48), pageW - marginR, 5.8, {
      align: "right",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(190, 202, 215);
    doc.text(`${PLAN_DOCUMENT_META.version} · ${dateLabel}`, pageW - marginR, 10.2, {
      align: "right",
    });
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    if (pageNum === 1) return;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.35);
    doc.line(marginL, footerY - 3, pageW - marginR, footerY - 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.4);
    doc.setTextColor(...MUTED);
    doc.text(
      "Instituto Felicidade para Todos · Dossiê Executivo de Maturidade e Consolidação SaaS NR-1 (Uso Interno / Comitê)",
      marginL,
      footerY + 1.5,
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...NAVY);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageW - marginR, footerY + 1.5, {
      align: "right",
    });
  };

  let curY = 22;
  let currentHeaderTitle = "SUMÁRIO EXECUTIVO";

  const startNewPage = (headerTitle: string) => {
    doc.addPage();
    currentHeaderTitle = headerTitle;
    addRunningHeader(headerTitle);
    curY = 22;
  };

  const ensureSpace = (neededMm: number) => {
    if (curY + neededMm > footerY - 8) {
      startNewPage(currentHeaderTitle);
    }
  };

  const drawSectionHeader = (num: string, title: string, subtitle: string) => {
    ensureSpace(22);
    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginL, curY, contentW, 15, 2, 2, "FD");

    doc.setFillColor(...DEEP_TEAL);
    doc.roundedRect(marginL + 2.5, curY + 2.5, 11, 10, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...GOLD);
    doc.text(num, marginL + 8, curY + 8.8, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(sanitizePdfText(title), marginL + 16, curY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...MUTED);
    const subLines = doc.splitTextToSize(sanitizePdfText(subtitle), contentW - 19);
    doc.text(subLines[0] ?? "", marginL + 16, curY + 11.8);
    curY += 19;
  };

  const drawSubHeading = (label: string) => {
    ensureSpace(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.4);
    doc.setTextColor(...NAVY);
    doc.text(sanitizePdfText(label), marginL, curY + 3.5);
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.35);
    doc.line(marginL, curY + 5, marginL + 36, curY + 5);
    curY += 8.5;
  };

  const drawCallout = (kicker: string, body: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const wrapped = doc.splitTextToSize(sanitizePdfText(body), contentW - 10);
    const boxH = wrapped.length * 3.9 + 9.5;
    ensureSpace(boxH + 3);

    doc.setFillColor(...CALLOUT_BG);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.35);
    doc.roundedRect(marginL, curY, contentW, boxH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...AMBER);
    doc.text(sanitizePdfText(kicker).toUpperCase(), marginL + 4.5, curY + 4.8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(wrapped, marginL + 4.5, curY + 9.2);
    curY += boxH + 4;
  };

  const drawTable = (headers: string[], rows: string[][], colRatios?: number[]) => {
    const colCount = headers.length;
    const ratios =
      colRatios && colRatios.length === colCount
        ? colRatios
        : headers.map(() => 1 / colCount);
    const colWidths = ratios.map((r) => contentW * r);

    const drawHeaderRow = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.2);
      const wrappedHeaders = headers.map((h, idx) =>
        doc.splitTextToSize(sanitizePdfText(h), colWidths[idx] - 3.5),
      );
      const maxH = Math.max(...wrappedHeaders.map((w) => w.length), 1);
      const rowH = maxH * 3.5 + 4;
      ensureSpace(rowH + 10);

      doc.setFillColor(...NAVY);
      doc.rect(marginL, curY, contentW, rowH, "F");
      doc.setTextColor(...WHITE);
      let x = marginL;
      wrappedHeaders.forEach((lines, idx) => {
        doc.text(lines, x + 1.8, curY + 4);
        x += colWidths[idx];
      });
      curY += rowH;
    };

    drawHeaderRow();

    rows.forEach((row, rowIdx) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      const wrappedCells = row.map((cell, idx) =>
        doc.splitTextToSize(sanitizePdfText(cell), colWidths[idx] - 3.5),
      );
      const maxLines = Math.max(...wrappedCells.map((w) => w.length), 1);
      const rowH = maxLines * 3.5 + 3.8;

      if (curY + rowH > footerY - 8) {
        startNewPage(currentHeaderTitle);
        drawHeaderRow();
      }

      doc.setFillColor(...(rowIdx % 2 === 0 ? LIGHT_BG : WHITE));
      doc.rect(marginL, curY, contentW, rowH, "F");
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.2);
      doc.rect(marginL, curY, contentW, rowH, "S");

      let x = marginL;
      wrappedCells.forEach((lines, idx) => {
        if (idx === 0) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...NAVY);
        } else {
          doc.setFont("helvetica", "normal");
          const rawLower = (row[idx] ?? "").toLowerCase();
          if (rawLower.includes("bloqueado")) {
            doc.setTextColor(...ROSE);
            doc.setFont("helvetica", "bold");
          } else if (rawLower.includes("recomendado") || rawLower.includes("pronto")) {
            doc.setTextColor(...EMERALD);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setTextColor(...INK);
          }
        }
        doc.setFontSize(7.1);
        doc.text(lines, x + 1.8, curY + 3.8);
        x += colWidths[idx];
      });

      curY += rowH;
    });

    curY += 5;
  };

  // ============================================================================
  // PAGE 1 — EXECUTIVE COVER PAGE
  // ============================================================================
  doc.setFillColor(...DEEP_TEAL);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageW, 3.2, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 3.2, pageW, 1.3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(...TEAL);
  doc.text("INSTITUTO FELICIDADE PARA TODOS · COMITÊ EXECUTIVO & ENGENHARIA", marginL, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(190, 206, 218);
  doc.text(`${PLAN_DOCUMENT_META.version} · Emitido em ${dateLabel}`, marginL, 27.5);

  // Kicker box
  doc.setFillColor(16, 48, 54);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(marginL, 38, contentW, 8.5, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...GOLD);
  doc.text(
    "DOSSIÊ DE AUDITORIA ToT · BENCHMARK SAAS · CHECKOUT-FIRST MERCADO PAGO · RBAC · ROADMAP G0->G4",
    marginL + 4,
    43.5,
  );

  // Cover title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  const titleLines = doc.splitTextToSize(sanitizePdfText(PLAN_DOCUMENT_META.title), contentW);
  doc.text(titleLines, marginL, 61);
  const titleBottom = 61 + titleLines.length * 9.5;

  doc.setFillColor(...GOLD);
  doc.rect(marginL, titleBottom - 2, 42, 1.6, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.8);
  doc.setTextColor(214, 225, 236);
  const subLines = doc.splitTextToSize(sanitizePdfText(PLAN_DOCUMENT_META.subtitle), contentW);
  doc.text(subLines, marginL, titleBottom + 6);

  // Live Maturity KPI Strip on Cover (4 metrics)
  const kpiTopY = Math.max(titleBottom + subLines.length * 4.8 + 12, 108);
  const kpiW = (contentW - 9) / 4;
  const coverKpis = [
    { label: "SCORE GLOBAL", value: `${summary.scorePct}%`, note: "Avaliador vivo do repo" },
    { label: "FUNDAÇÃO", value: `${summary.stageTotals.foundation.pct}%`, note: "Privacy Vault & CI" },
    { label: "SAAS REAL (G3)", value: `${summary.stageTotals.real_saas.pct}%`, note: "No-Go dados reais" },
    { label: "GATE ATUAL", value: summary.currentGate, note: `${summary.blocked} bloqueios abertos` },
  ];

  coverKpis.forEach((kpi, idx) => {
    const x = marginL + idx * (kpiW + 3);
    doc.setFillColor(14, 38, 44);
    doc.setDrawColor(42, 86, 94);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiTopY, kpiW, 25, 2.5, 2.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.4);
    doc.setTextColor(...TEAL);
    doc.text(kpi.label, x + 3.5, kpiTopY + 6.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text(kpi.value, x + 3.5, kpiTopY + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.6);
    doc.setTextColor(180, 196, 210);
    doc.text(kpi.note, x + 3.5, kpiTopY + 21);
  });

  // Confirmed Architectural Decisions Box on Cover
  const decTopY = kpiTopY + 32;
  doc.setFillColor(13, 34, 40);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(marginL, decTopY, contentW, 82, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.6);
  doc.setTextColor(...GOLD);
  doc.text("DECISÕES ARQUITETURAIS CONFIRMADAS PARA O GO-LIVE SAAS", marginL + 5, decTopY + 7.5);

  CONFIRMED_DECISIONS.forEach((dec, idx) => {
    const dy = decTopY + 14 + idx * 16.5;
    doc.setFillColor(20, 48, 55);
    doc.roundedRect(marginL + 5, dy, contentW - 10, 14, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.4);
    doc.setTextColor(...TEAL);
    doc.text(`${dec.code} · ${dec.title.toUpperCase()}`, marginL + 8, dy + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.2);
    doc.setTextColor(...WHITE);
    doc.text(sanitizePdfText(dec.choice), marginL + 8, dy + 10.2);
  });

  // Cover governance notice
  const noticeY = pageH - 30;
  doc.setFillColor(18, 42, 48);
  doc.roundedRect(marginL, noticeY, contentW, 16, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(210, 220, 232);
  const noticeLines = doc.splitTextToSize(sanitizePdfText(PLAN_DOCUMENT_META.governanceNotice), contentW - 8);
  doc.text(noticeLines, marginL + 4, noticeY + 5.5);

  // ============================================================================
  // CHAPTER 01 — MATURITY AUDIT & TREE OF THOUGHT
  // ============================================================================
  startNewPage("01 · AUDITORIA DE MATURIDADE & ÁRVORE DE CONHECIMENTO");
  drawSectionHeader(
    "01",
    "Auditoria de Maturidade SaaS & Árvore de Conhecimento (ToT)",
    "Diagnóstico derivado diretamente dos indicadores verificáveis do repositório e comparação dos 3 caminhos estratégicos.",
  );

  const stageRows = STAGE_ORDER.map((stage) => {
    const totals = summary.stageTotals[stage];
    const itemsInStage = summary.items.filter((item) => item.stage === stage);
    const openBlockers = itemsInStage
      .filter((item) => !item.ready)
      .map((item) => item.label)
      .join("; ");
    return [
      STAGE_LABELS[stage],
      `${totals.pct}% (${totals.ready}/${totals.total})`,
      totals.pct === 100 ? "Pronto" : stage === "real_saas" ? "No-Go (G3)" : "Bloqueado",
      openBlockers || "Nenhum bloqueio técnico local aberto.",
    ];
  });

  drawTable(
    ["Estágio de Maturidade", "Score Real", "Situação", "Principais Bloqueios / Evidências Abertas"],
    stageRows,
    [0.24, 0.14, 0.14, 0.48],
  );

  drawSubHeading("Árvore de Conhecimento (ToT) — Comparativo dos 3 Ramos Estratégicos");
  const totRows = TOT_BRANCHES.map((branch) => [
    `${branch.code}: ${branch.title}`,
    branch.verdict,
    branch.riskLevel,
    `${branch.summary} (${branch.timeToValue})`,
  ]);
  drawTable(
    ["Ramo Estratégico", "Veredito", "Risco", "Análise Executiva e Tempo de Valor"],
    totRows,
    [0.26, 0.14, 0.11, 0.49],
  );

  drawCallout(
    "Conclusão da Auditoria Executiva",
    `A plataforma apresenta ${summary.stageTotals.foundation.pct}% de prontidão na Fundação Governada (Privacy Vault k>=5, RLS e 206 asserções pgTAP), mas permanece em Gate ${summary.currentGate} (${summary.blocked} bloqueios abertos). O caminho recomendado é o Ramo C (Go-Live escalonado por ondas G1 -> G4), preservando blindagem jurídica e velocidade comercial.`,
  );

  // ============================================================================
  // CHAPTER 02 — COMPETITIVE BENCHMARK 2025/2026
  // ============================================================================
  startNewPage("02 · BENCHMARK COMPETITIVO & DIFERENCIAL");
  drawSectionHeader(
    "02",
    "Benchmark de Plataformas SaaS (NR-1 Brasil & B2B Multi-Tenant)",
    "Posicionamento frente aos líderes de SST tradicional, Clima/RH, Saúde Mental B2B e plataformas COPSOQ.",
  );

  const benchRows = SAAS_BENCHMARKS.map((b) => [
    `${b.category} (${b.referencePlayers})`,
    b.marketStrength,
    b.marketGap,
    b.ourDifferentiation,
  ]);
  drawTable(
    ["Categoria / Referências", "Força no Mercado", "Lacuna Comum", "Nosso Diferencial Estrutural"],
    benchRows,
    [0.22, 0.24, 0.25, 0.29],
  );

  // ============================================================================
  // CHAPTER 03 — CHECKOUT-FIRST OPERATIONAL FLOW
  // ============================================================================
  startNewPage("03 · FLUXO OPERACIONAL CHECKOUT-FIRST");
  drawSectionHeader(
    "03",
    "Fluxo Pós-Contratação: Checkout → Token → Empresa → Convites",
    "Trava comercial ponta a ponta: nenhuma organização é criada antes da confirmação autoritativa no Mercado Pago.",
  );

  const flowRows = CHECKOUT_FIRST_FLOW_STEPS.map((s) => [
    `${s.code}: ${s.title}`,
    s.actor,
    `${s.serverAction} | Banco/RLS: ${s.databaseRlsEffect}`,
    s.securitySafeguard,
  ]);
  drawTable(
    ["Etapa", "Ator / Sistema", "Execução Server-Side & Efeito em Banco/RLS", "Salvaguarda de Segurança"],
    flowRows,
    [0.2, 0.15, 0.37, 0.28],
  );

  // ============================================================================
  // CHAPTER 04 — PLANS (ENTITLEMENTS) & RBAC PERMISSION MATRIX
  // ============================================================================
  startNewPage("04 · PLANOS (ENTITLEMENTS) & MATRIZ RBAC");
  drawSectionHeader(
    "04",
    "Arquitetura de Planos & Matriz de Permissões por Área (RBAC)",
    "Desacoplamento total entre limites contratuais (entitlements) e papéis corporativos, com bloqueio imutável de microdados.",
  );

  drawSubHeading("Proposta de Catálogo de Planos & Entitlements (Sujeita a Aprovação G3)");
  const planRows = PLAN_ARCHITECTURE_TIERS.map((p) => [
    `${p.name} (${p.targetProfile})`,
    p.maxAdminSeats,
    `${p.maxActiveEmployees} · ${p.maxUnits}`,
    `${p.cyclesPerYear} · ${p.aepAetModule}`,
    `${p.pgrDossierExport} · Retenção: ${p.auditRetention}`,
  ]);
  drawTable(
    ["Plano / Perfil", "Assentos", "Escala & Unidades", "Ciclos & Ergonomia", "Dossiê PGR & Retenção"],
    planRows,
    [0.2, 0.18, 0.2, 0.21, 0.21],
  );

  drawSubHeading("Matriz RBAC Corporativa (8 Perfis x 8 Áreas Funcionais)");
  const rbacRows = RBAC_PERMISSION_MATRIX.map((r) => [
    r.role,
    r.permissions.companyBilling.label,
    r.permissions.invitesRbac.label,
    r.permissions.campaignsUnits.label,
    r.permissions.aepAetCriteria.label,
    r.permissions.risksActions.label,
    r.permissions.pgrDocuments.label,
    r.permissions.individualResponses.label,
  ]);
  drawTable(
    ["Perfil", "Billing", "Convites", "Campanhas", "AEP/AET", "Riscos/Ações", "PGR PDF", "Individuais"],
    rbacRows,
    [0.18, 0.11, 0.11, 0.12, 0.12, 0.12, 0.12, 0.12],
  );

  // ============================================================================
  // CHAPTER 05 — PRODUCTION KEYS, GRACE PERIOD & MTE NR-1 CHAIN
  // ============================================================================
  startNewPage("05 · COFRE DE CHAVES & CADEIA MTE NR-1");
  drawSectionHeader(
    "05",
    "Cofre de Chaves (Supabase + Mercado Pago) & Ciclo Oficial MTE NR-1",
    "Segregação estrita entre segredos server-side e chaves públicas, gestão de inadimplência e aderência às 8 etapas da NR-1.",
  );

  drawSubHeading("Checklist de Chaves e Segredos por Ambiente");
  const keyRows = PRODUCTION_KEYS_CHECKLIST.map((k) => [
    k.variable,
    k.tier === "server-secret" ? "Somente Servidor" : "Cliente (RLS)",
    k.activationGate,
    `${k.purpose} Regra: ${k.rule}`,
  ]);
  drawTable(
    ["Variável / Segredo", "Escopo", "Gate", "Finalidade e Regra de Segurança"],
    keyRows,
    [0.27, 0.14, 0.12, 0.47],
  );

  drawSubHeading("Política de Inadimplência & Custódia Auditável (Grace Period)");
  const lifeRows = SUBSCRIPTION_LIFECYCLE_STATES.map((st) => [
    st.label,
    st.duration,
    st.accessRule,
    st.nr1Protection,
  ]);
  drawTable(
    ["Estado", "Janela", "Regra de Acesso", "Proteção Regulatória NR-1"],
    lifeRows,
    [0.18, 0.14, 0.34, 0.34],
  );

  drawSubHeading("Cadeia Operacional Completa Exigida pelo MTE na NR-1");
  const mteRows = MTE_NR1_OPERATIONAL_CHAIN.map((m) => [
    `${String(m.order).padStart(2, "0")}. ${m.stage}`,
    m.normativeRef,
    m.platformModule,
    `${m.roleOwner} · ${m.auditArtifact}`,
  ]);
  drawTable(
    ["Etapa NR-1", "Base Normativa", "Módulo na Plataforma", "Responsável & Artefato Auditável"],
    mteRows,
    [0.24, 0.16, 0.25, 0.35],
  );

  // ============================================================================
  // CHAPTER 06 — ROADMAP BY GATES & DEVELOPMENT SUPER PROMPT
  // ============================================================================
  startNewPage("06 · ROADMAP POR GATES & SUPER PROMPT");
  drawSectionHeader(
    "06",
    "Roadmap Oficial em 5 Ondas (G0 → G4) & Super Prompt de Desenvolvimento",
    "Critérios objetivos de avanço (Go/No-Go) e especificação técnica integral para avaliação do comitê multidisciplinar.",
  );

  const waveRows = GOLIVE_WAVES_ROADMAP.map((w) => [
    `${w.wave} (${w.gate})`,
    `${w.title} [${w.status}]`,
    w.owners,
    w.acceptanceCriteria,
  ]);
  drawTable(
    ["Onda / Gate", "Escopo & Status", "Responsáveis", "Critério Objetivo de Aceite (Go/No-Go)"],
    waveRows,
    [0.14, 0.28, 0.18, 0.4],
  );

  drawSubHeading("Apêndice Técnico — Super Prompt de Desenvolvimento (Íntegra para Comitê)");
  const promptLines = DEVELOPMENT_SUPER_PROMPT.replace(/\r\n/g, "\n").split("\n");
  promptLines.forEach((rawLine) => {
    const clean = sanitizePdfText(rawLine);
    if (!clean) {
      curY += 1.8;
      return;
    }
    const isHeading = clean.startsWith("#");
    doc.setFont("courier", isHeading ? "bold" : "normal");
    doc.setFontSize(isHeading ? 7.6 : 7.0);
    doc.setTextColor(...(isHeading ? NAVY : INK));

    const wrapped = doc.splitTextToSize(clean, contentW - 6);
    const blockH = wrapped.length * 3.35 + 1.2;
    ensureSpace(blockH + 2);

    if (isHeading) {
      doc.setFillColor(...LIGHT_BG);
      doc.rect(marginL, curY - 0.8, contentW, blockH + 1, "F");
    }
    doc.text(wrapped, marginL + 3, curY + 2.4);
    curY += blockH;
  });

  // Apply footers to all interior pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addFooter(p, totalPages);
  }

  return doc;
}

export function downloadSaasGoLivePlanPdf(summary: SaasMaturitySummary): string {
  const filename = `Plano_Executivo_GoLive_SaaS_NR1_${new Date().toISOString().slice(0, 10)}.pdf`;
  const pdf = buildSaasGoLivePlanPdf(summary);
  pdf.save(filename);
  return filename;
}
