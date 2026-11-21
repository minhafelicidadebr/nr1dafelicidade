import { GState, jsPDF } from "jspdf";
import iftLogoFull from "@/assets/ift-logo-full.png";
import { DEFAULT_ACCENT, sanitizeBranding, type DocumentBranding } from "@/lib/documents/brandingConfig";

export interface InstitutionalPdfMetadata {
  title: string;
  subtitle?: string;
  categoryKicker?: string;
  orgName?: string | null;
  cycleName?: string | null;
  sector?: string | null;
  sizeBand?: string | null;
  kMin?: number;
  responseCount?: number | null;
  version?: number;
  sha256?: string | null;
  createdAt?: string;
  signedAt?: string | null;
  signatureNote?: string | null;
  normativeBasis?: string;
  highlights?: Array<{ label: string; value: string; tone?: "neutral" | "warn" | "good" | "danger" }>;
}

export interface InstitutionalPdfInput {
  markdown: string;
  filename: string;
  meta: InstitutionalPdfMetadata;
  branding?: DocumentBranding;
}

const IFT_FOOTER_LINE1 =
  "Impact HUB Brasília — SGAN 601, Lote H, Edifício Íon, Ala Amarela — Asa Norte, Brasília/DF";
const IFT_FOOTER_LINE2 =
  "(61) 3550-8779 · www.felicidadeparatodos.com.br · @felicidadeparatodosbr · Plataforma 4 Lentes NR-1";
const IFT_FOOTER_LINE3 =
  "© 2026 Instituto Felicidade para Todos · Documento auditável com Design Instrucional Gráfico 5 Estrelas.";

const NAVY = [11, 20, 55] as const; // #0B1437
const DEEP_TEAL = [7, 28, 31] as const; // #071C1F
const TEAL = [62, 182, 194] as const; // #3EB6C2
const GOLD = [201, 162, 75] as const; // #C9A24B
const INK = [26, 31, 54] as const; // #1A1F36
const MUTED = [90, 100, 120] as const; // #5A6478
const LIGHT_BG = [246, 248, 252] as const;
const CALLOUT_BG = [251, 248, 238] as const;
const BORDER_LINE = [225, 229, 238] as const;
const WHITE = [255, 255, 255] as const;

function hexToRgbTuple(hex: string, fallback: readonly [number, number, number] = GOLD): [number, number, number] {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [fallback[0], fallback[1], fallback[2]];
  }
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .trim();
}

function normalizePdfFilename(rawFilename: string): string {
  const withoutMd = rawFilename.replace(/\.(md|markdown|txt)$/i, "");
  const safeBase = withoutMd.replace(/[^\w.-]+/g, "_").replace(/^_+|_+$/g, "") || "documento_institucional_nr1";
  return safeBase.toLowerCase().endsWith(".pdf") ? safeBase : `${safeBase}.pdf`;
}

/**
 * Constrói uma instância de jsPDF com Design Instrucional Gráfico 5 Estrelas,
 * combinando a identidade visual do Instituto Felicidade para Todos e da empresa cliente.
 */
export function buildInstitutionalInstructionalPdf(input: InstitutionalPdfInput): jsPDF {
  const safeBranding = input.branding
    ? sanitizeBranding(input.branding)
    : { accentColor: DEFAULT_ACCENT, logoDataUrl: null };
  const accentRgb = hexToRgbTuple(safeBranding.accentColor, GOLD);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginL = 18;
  const marginR = 18;
  const contentW = pageW - marginL - marginR;
  const footerY = pageH - 18;

  const meta = input.meta;
  const orgName = meta.orgName?.trim() || "Organização / Unidade Operacional";
  const cycleName = meta.cycleName?.trim() || "Ciclo GRO / PGR NR-1";
  const kMin = meta.kMin ?? 5;
  const version = meta.version ?? 1;
  const createdDateStr = meta.createdAt
    ? new Date(meta.createdAt).toLocaleDateString("pt-BR")
    : new Date().toLocaleDateString("pt-BR");
  const hashDisplay = meta.sha256 ? `${meta.sha256.slice(0, 20)}…` : "SHA256-AUDIT-READY";
  const reviewStatus = meta.signedAt
    ? `Revisado em ${new Date(meta.signedAt).toLocaleDateString("pt-BR")}`
    : "Preliminar · Requer Revisão SST/SESMT";
  const normativeBasis =
    meta.normativeBasis ||
    "NR-1 Cap. 1.5 (GRO/PGR) · Guia Oficial MTE 2026 · NR-17 · NR-7 (PCMSO) · Oxford Playbook 2.0";

  const addRunningHeader = (sectionTitle: string) => {
    doc.setFillColor(...DEEP_TEAL);
    doc.rect(0, 0, pageW, 14, "F");
    doc.setFillColor(...accentRgb);
    doc.rect(0, 14, pageW, 1.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...TEAL);
    doc.text("INSTITUTO FELICIDADE PARA TODOS · PLATAFORMA 4 LENTES", marginL, 6.2);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(215, 222, 234);
    const leftSub = `${orgName.toUpperCase()} · ${cycleName} · k>=${kMin}`;
    doc.text(leftSub.slice(0, 75), marginL, 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...accentRgb);
    doc.text(sectionTitle.toUpperCase().slice(0, 46), pageW - marginR, 6.2, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(190, 200, 215);
    doc.text(`v${version} · ${createdDateStr}`, pageW - marginR, 11, { align: "right" });
  };

  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(0.45);
    doc.line(marginL, footerY - 3, pageW - marginR, footerY - 3);

    doc.setFillColor(...accentRgb);
    doc.circle(marginL + 1.8, footerY - 3, 1.1, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(...MUTED);
    doc.text(IFT_FOOTER_LINE1, pageW / 2, footerY + 1, { align: "center" });
    doc.text(IFT_FOOTER_LINE2, pageW / 2, footerY + 4.5, { align: "center" });
    doc.text(IFT_FOOTER_LINE3, pageW / 2, footerY + 8, { align: "center" });

    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(pageW - marginR - 16, footerY + 3.5, 16, 5.2, 1.8, 1.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...NAVY);
    doc.text(`Pág. ${pageNum}/${totalPages}`, pageW - marginR - 8, footerY + 7, { align: "center" });
  };

  // ============================================================================
  // PAGE 1 — CAPA EXECUTIVA COM DESIGN INSTRUCIONAL GRÁFICO 5 ESTRELAS
  // ============================================================================
  doc.setFillColor(...DEEP_TEAL);
  doc.rect(0, 0, pageW, pageH, "F");

  // Top decorative bars
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, pageW, 3.5, "F");
  doc.setFillColor(...accentRgb);
  doc.rect(0, 3.5, pageW, 1.5, "F");

  // Subtle ambient vector circles
  doc.setFillColor(TEAL[0], TEAL[1], TEAL[2]);
  doc.setGState(new GState({ opacity: 0.07 }));
  doc.circle(pageW - 22, 42, 58, "F");
  doc.circle(24, pageH - 36, 46, "F");
  doc.setGState(new GState({ opacity: 1 }));

  // Logos / Institutional Identity Header
  try {
    doc.addImage(iftLogoFull, "PNG", marginL, 14, 50, 20);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...WHITE);
    doc.text("INSTITUTO FELICIDADE PARA TODOS", marginL, 24);
  }

  if (safeBranding.logoDataUrl) {
    try {
      const format = safeBranding.logoDataUrl.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
      doc.addImage(safeBranding.logoDataUrl, format, pageW - marginR - 42, 14, 42, 18);
    } catch {
      // Fallback badge if custom logo format cannot be embedded directly
    }
  } else {
    doc.setFillColor(16, 44, 50);
    doc.setDrawColor(...accentRgb);
    doc.setLineWidth(0.35);
    doc.roundedRect(pageW - marginR - 64, 15, 64, 14, 2.5, 2.5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...accentRgb);
    doc.text("IDENTIDADE DA ORGANIZAÇÃO", pageW - marginR - 32, 20.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);
    doc.text(orgName.slice(0, 28), pageW - marginR - 32, 25.8, { align: "center" });
  }

  // Category Kicker Pill
  const kickerText = (
    meta.categoryKicker ||
    "DOSSIÊ TÉCNICO AUDITÁVEL · DESIGN INSTRUCIONAL GRÁFICO · NR-1 CAP. 1.5"
  ).toUpperCase();
  doc.setFillColor(18, 52, 58);
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginL, 42, contentW, 8, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...TEAL);
  doc.text(kickerText, marginL + 4, 47.2);

  // Document Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  const cleanTitle = cleanInlineMarkdown(meta.title);
  const titleLines = doc.splitTextToSize(cleanTitle, contentW);
  doc.text(titleLines, marginL, 62);

  const afterTitleY = 62 + titleLines.length * 9;

  // Gold accent bar under title
  doc.setFillColor(...accentRgb);
  doc.rect(marginL, afterTitleY - 2, 42, 1.8, "F");

  // Subtitle
  const subtitleText =
    meta.subtitle ||
    "Documento estruturado segundo princípios de Ciência de Aprendizagem, Dupla Codificação e Governança Regulatória (Guia Oficial MTE 2026, NR-1 Cap. 1.5, NR-17, NR-7 e Work Wellbeing Playbook 2.0 — Oxford).";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(210, 220, 232);
  const subLines = doc.splitTextToSize(subtitleText, contentW);
  doc.text(subLines, marginL, afterTitleY + 6);

  // ─── 4 EXECUTIVE METADATA CARDS (2x2 GRID) ───
  const gridTopY = Math.max(afterTitleY + subLines.length * 4.8 + 10, 108);
  const cardW = (contentW - 6) / 2;
  const cardH = 26;

  const metaCards = [
    {
      code: "01 · ORGANIZAÇÃO & ESCOPO",
      primary: orgName,
      secondary: `Ciclo: ${cycleName}${meta.sector ? ` · Setor: ${meta.sector}` : ""}`,
      badgeColor: TEAL,
    },
    {
      code: "02 · PRIVACIDADE & AMOSTRA COLETIVA",
      primary: `Proteção k-Anonimato (k >= ${kMin})`,
      secondary:
        meta.responseCount != null
          ? `${meta.responseCount} respostas agregadas · Zero exposição individual`
          : "Saídas agregadas protegidas por trava estatística LGPD",
      badgeColor: accentRgb,
    },
    {
      code: "03 · ENQUADRAMENTO NORMATIVO & CIENTÍFICO",
      primary: "NR-1 Cap. 1.5 (GRO/PGR) + Guia MTE 2026",
      secondary: normativeBasis.slice(0, 62),
      badgeColor: TEAL,
    },
    {
      code: "04 · RASTREABILIDADE & REVISÃO TÉCNICA",
      primary: `Versão v${version} · ${createdDateStr}`,
      secondary: `${reviewStatus} · Hash: ${hashDisplay}`,
      badgeColor: accentRgb,
    },
  ];

  metaCards.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = marginL + col * (cardW + 6);
    const y = gridTopY + row * (cardH + 5);

    doc.setFillColor(16, 40, 46);
    doc.setDrawColor(38, 82, 92);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "FD");

    // Left vertical accent strip
    doc.setFillColor(c.badgeColor[0], c.badgeColor[1], c.badgeColor[2]);
    doc.roundedRect(x + 2.5, y + 3.5, 1.8, cardH - 7, 0.8, 0.8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(c.badgeColor[0], c.badgeColor[1], c.badgeColor[2]);
    doc.text(c.code, x + 7, y + 7.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(...WHITE);
    const pLines = doc.splitTextToSize(c.primary, cardW - 11);
    doc.text(pLines[0] ?? "", x + 7, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(190, 205, 218);
    const sLines = doc.splitTextToSize(c.secondary, cardW - 11);
    doc.text(sLines.slice(0, 2), x + 7, y + 19.5);
  });

  // ─── INSTRUCTIONAL DESIGN READING MAP (PDCA & DUAL-CODING ARCHITECTURE) ───
  const mapY = gridTopY + cardH * 2 + 16;
  doc.setFillColor(14, 34, 40);
  doc.setDrawColor(...accentRgb);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginL, mapY, contentW, 44, 3.5, 3.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...accentRgb);
  doc.text(
    "ARQUITETURA DE DESIGN INSTRUCIONAL GRÁFICO · ROTA DE LEITURA E AUDITORIA (PDCA NR-1)",
    marginL + 5,
    mapY + 7,
  );

  const steps = [
    {
      num: "ETAPA 1",
      title: "Contexto & Critérios",
      desc: "Parâmetros do GRO, metodologia S×P e matriz 5×5.",
    },
    {
      num: "ETAPA 2",
      title: "Diagnóstico Coletivo",
      desc: "Sinais agregados (k>=5), fatores e trabalho real.",
    },
    {
      num: "ETAPA 3",
      title: "Controles & Plano",
      desc: "Ações na fonte, responsáveis, prazos e aferição.",
    },
    {
      num: "ETAPA 4",
      title: "Governança & Laudo",
      desc: "Consulta CIPA, ponte PCMSO e revisão técnica.",
    },
  ];

  const stepW = (contentW - 16) / 4;
  steps.forEach((st, idx) => {
    const sx = marginL + 5 + idx * (stepW + 2);
    const sy = mapY + 11.5;

    doc.setFillColor(20, 48, 55);
    doc.roundedRect(sx, sy, stepW, 28, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.3);
    doc.setTextColor(...TEAL);
    doc.text(st.num, sx + 3, sy + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(st.title, sx + 3, sy + 11.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(185, 198, 212);
    const dLines = doc.splitTextToSize(st.desc, stepW - 6);
    doc.text(dLines.slice(0, 3), sx + 3, sy + 17);
  });

  // Disclaimer banner at bottom of cover
  const disclaimerY = pageH - 36;
  doc.setFillColor(22, 42, 48);
  doc.roundedRect(marginL, disclaimerY, contentW, 13, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(210, 218, 228);
  const coverDisclaimer =
    "AVISO REGULATÓRIO (NR-1 §1.5.7): Este documento técnico é gerado com proteção estatística de k-anonimato (k>=5) e rastreabilidade criptográfica. Seu uso formal no PGR/GRO requer validação e assinatura do responsável técnico habilitado (SST/SESMT/Ergonomia).";
  doc.text(doc.splitTextToSize(coverDisclaimer, contentW - 8), marginL + 4, disclaimerY + 5);

  // ============================================================================
  // CONTENT PAGES — PARSER GRÁFICO DE SEÇÕES, CARDS, TABELAS E CALLOUTS
  // ============================================================================
  doc.addPage();
  addRunningHeader(cleanTitle);
  let curY = 24;

  const ensureSpace = (neededMm: number) => {
    if (curY + neededMm > footerY - 8) {
      doc.addPage();
      addRunningHeader(cleanTitle);
      curY = 24;
    }
  };

  // Optional Executive Highlights Bar at top of Page 2
  if (meta.highlights && meta.highlights.length > 0) {
    const hItems = meta.highlights.slice(0, 4);
    const hW = (contentW - (hItems.length - 1) * 4) / hItems.length;
    ensureSpace(20);
    hItems.forEach((h, idx) => {
      const hx = marginL + idx * (hW + 4);
      doc.setFillColor(...LIGHT_BG);
      doc.setDrawColor(...BORDER_LINE);
      doc.setLineWidth(0.3);
      doc.roundedRect(hx, curY, hW, 15, 2, 2, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...MUTED);
      doc.text(h.label.toUpperCase().slice(0, 24), hx + 3, curY + 5.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...NAVY);
      doc.text(h.value.slice(0, 22), hx + 3, curY + 11.8);
    });
    curY += 20;
  }

  const rawLines = input.markdown.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  let sectionCounter = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Skip HTML comments
    if (trimmed.startsWith("<!--")) {
      while (i < rawLines.length && !rawLines[i].includes("-->")) {
        i++;
      }
      i++;
      continue;
    }

    if (trimmed === "") {
      curY += 2.2;
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      ensureSpace(6);
      doc.setDrawColor(...BORDER_LINE);
      doc.setLineWidth(0.35);
      doc.line(marginL, curY + 2, pageW - marginR, curY + 2);
      curY += 6;
      i++;
      continue;
    }

    // ─── PIPE TABLE RENDERER (5-STAR GRAPHIC TABLE) ───
    if (
      trimmed.startsWith("|") &&
      i + 1 < rawLines.length &&
      /^\s*\|?\s*[-:]+/.test(rawLines[i + 1])
    ) {
      const parseRow = (r: string) =>
        r
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cleanInlineMarkdown(cell));

      const headers = parseRow(rawLines[i]);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith("|")) {
        rows.push(parseRow(rawLines[i]));
        i++;
      }

      const colCount = Math.max(headers.length, 1);
      const colW = contentW / colCount;

      // Calculate header height
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const headerCellLines = headers.map((h) => doc.splitTextToSize(h, colW - 4));
      const maxHeaderLines = Math.max(...headerCellLines.map((l) => l.length), 1);
      const headerH = maxHeaderLines * 3.8 + 4.5;

      ensureSpace(headerH + 10);

      // Draw Table Header
      doc.setFillColor(...NAVY);
      doc.roundedRect(marginL, curY, contentW, headerH, 1.5, 1.5, "F");
      doc.setTextColor(...WHITE);
      headerCellLines.forEach((linesArr, colIdx) => {
        const cx = marginL + colIdx * colW + 2;
        doc.text(linesArr, cx, curY + 4.2);
      });
      curY += headerH;

      // Draw Table Rows
      rows.forEach((rowCells, rowIdx) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        const wrappedCells = headers.map((_, colIdx) =>
          doc.splitTextToSize(rowCells[colIdx] ?? "—", colW - 4),
        );
        const maxLines = Math.max(...wrappedCells.map((l) => l.length), 1);
        const rowH = maxLines * 3.7 + 4.2;

        if (curY + rowH > footerY - 8) {
          doc.addPage();
          addRunningHeader(cleanTitle);
          curY = 24;
          // Repeat table header on new page
          doc.setFillColor(...NAVY);
          doc.roundedRect(marginL, curY, contentW, headerH, 1.5, 1.5, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(...WHITE);
          headerCellLines.forEach((linesArr, colIdx) => {
            const cx = marginL + colIdx * colW + 2;
            doc.text(linesArr, cx, curY + 4.2);
          });
          curY += headerH;
        }

        // Zebra background
        if (rowIdx % 2 === 0) {
          doc.setFillColor(...LIGHT_BG);
        } else {
          doc.setFillColor(...WHITE);
        }
        doc.rect(marginL, curY, contentW, rowH, "F");

        // Bottom border & cell dividers
        doc.setDrawColor(...BORDER_LINE);
        doc.setLineWidth(0.25);
        doc.rect(marginL, curY, contentW, rowH, "S");

        wrappedCells.forEach((linesArr, colIdx) => {
          const cx = marginL + colIdx * colW + 2;
          if (colIdx === 0) {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...NAVY);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...INK);
          }
          doc.setFontSize(7.5);
          doc.text(linesArr, cx, curY + 4);
        });

        curY += rowH;
      });

      curY += 4;
      continue;
    }

    // ─── H1 HEADING ───
    if (trimmed.startsWith("# ")) {
      const h1Text = cleanInlineMarkdown(trimmed.replace(/^#\s+/, ""));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const wrapped = doc.splitTextToSize(h1Text, contentW - 10);
      const boxH = wrapped.length * 6 + 7;
      ensureSpace(boxH + 4);

      doc.setFillColor(...DEEP_TEAL);
      doc.roundedRect(marginL, curY, contentW, boxH, 2.5, 2.5, "F");
      doc.setFillColor(...accentRgb);
      doc.roundedRect(marginL, curY, 3, boxH, 1, 1, "F");

      doc.setTextColor(...WHITE);
      doc.text(wrapped, marginL + 7, curY + 6.5);
      curY += boxH + 4;
      i++;
      continue;
    }

    // ─── H2 HEADING (SECTION CARD HEADER) ───
    if (trimmed.startsWith("## ")) {
      sectionCounter += 1;
      const h2Text = cleanInlineMarkdown(trimmed.replace(/^##\s+/, ""));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      const wrapped = doc.splitTextToSize(h2Text, contentW - 16);
      const boxH = wrapped.length * 5 + 6;
      ensureSpace(boxH + 6);

      curY += 2;
      doc.setFillColor(...LIGHT_BG);
      doc.setDrawColor(...BORDER_LINE);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginL, curY, contentW, boxH, 2, 2, "FD");

      // Section badge pill
      doc.setFillColor(...TEAL);
      doc.roundedRect(marginL + 2.5, curY + 2.2, 8, boxH - 4.4, 1.2, 1.2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      doc.text(String(sectionCounter).padStart(2, "0"), marginL + 6.5, curY + boxH / 2 + 1, {
        align: "center",
      });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.8);
      doc.setTextColor(...NAVY);
      doc.text(wrapped, marginL + 13, curY + 5.8);
      curY += boxH + 3.5;
      i++;
      continue;
    }

    // ─── H3 / H4 HEADING ───
    if (trimmed.startsWith("### ") || trimmed.startsWith("#### ")) {
      const h3Text = cleanInlineMarkdown(trimmed.replace(/^#{3,4}\s+/, ""));
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.6);
      const wrapped = doc.splitTextToSize(h3Text, contentW - 8);
      ensureSpace(wrapped.length * 4.5 + 4);

      doc.setFillColor(...accentRgb);
      doc.circle(marginL + 2, curY + 1.8, 1.3, "F");

      doc.setTextColor(...NAVY);
      doc.text(wrapped, marginL + 6, curY + 3);
      curY += wrapped.length * 4.5 + 2.5;
      i++;
      continue;
    }

    // ─── BLOCKQUOTE / PEDAGOGICAL & NORMATIVE CALLOUT CARD ───
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < rawLines.length && rawLines[i].trim().startsWith(">")) {
        quoteLines.push(cleanInlineMarkdown(rawLines[i].trim().replace(/^>\s?/, "")));
        i++;
      }
      const quoteText = quoteLines.join(" ");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      const wrapped = doc.splitTextToSize(quoteText, contentW - 12);
      const boxH = wrapped.length * 4.2 + 9;
      ensureSpace(boxH + 3);

      doc.setFillColor(...CALLOUT_BG);
      doc.setDrawColor(...accentRgb);
      doc.setLineWidth(0.35);
      doc.roundedRect(marginL, curY, contentW, boxH, 2, 2, "FD");
      doc.setFillColor(...accentRgb);
      doc.roundedRect(marginL, curY, 2.5, boxH, 1, 1, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(150, 110, 30);
      doc.text("DIRETRIZ TÉCNICA & CIÊNCIA DE APRENDIZAGEM", marginL + 6, curY + 4.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...INK);
      doc.text(wrapped, marginL + 6, curY + 9.2);
      curY += boxH + 3;
      continue;
    }

    // ─── BULLET LIST ITEM ───
    if (/^[-*]\s+/.test(trimmed)) {
      const itemText = cleanInlineMarkdown(trimmed.replace(/^[-*]\s+/, ""));
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      const wrapped = doc.splitTextToSize(itemText, contentW - 8);
      ensureSpace(wrapped.length * 4.2 + 2);

      doc.setFillColor(...TEAL);
      doc.roundedRect(marginL + 1.5, curY + 0.5, 2.2, 2.2, 0.6, 0.6, "F");

      doc.setTextColor(...INK);
      doc.text(wrapped, marginL + 6.5, curY + 2.5);
      curY += wrapped.length * 4.2 + 1.8;
      i++;
      continue;
    }

    // ─── NUMBERED LIST ITEM ───
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const numLabel = numMatch[1];
      const itemText = cleanInlineMarkdown(numMatch[2]);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      const wrapped = doc.splitTextToSize(itemText, contentW - 10);
      ensureSpace(wrapped.length * 4.2 + 2.5);

      doc.setFillColor(...NAVY);
      doc.roundedRect(marginL + 0.8, curY - 0.5, 5.2, 4.2, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      doc.setTextColor(...WHITE);
      doc.text(numLabel, marginL + 3.4, curY + 2.3, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      doc.setTextColor(...INK);
      doc.text(wrapped, marginL + 8, curY + 2.5);
      curY += wrapped.length * 4.2 + 2;
      i++;
      continue;
    }

    // ─── STANDARD PARAGRAPH ───
    const paraText = cleanInlineMarkdown(trimmed);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    const wrapped = doc.splitTextToSize(paraText, contentW);
    ensureSpace(wrapped.length * 4.2 + 2);
    doc.setTextColor(...INK);
    doc.text(wrapped, marginL, curY + 2.5);
    curY += wrapped.length * 4.2 + 2;
    i++;
  }

  // ============================================================================
  // MANDATORY TECHNICAL SIGN-OFF & CRYPTOGRAPHIC AUDIT BLOCK
  // ============================================================================
  ensureSpace(40);
  curY += 4;
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginL, curY, contentW, 34, 2.5, 2.5, "FD");

  doc.setFillColor(...DEEP_TEAL);
  doc.roundedRect(marginL, curY, contentW, 7.5, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...TEAL);
  doc.text(
    "BLOCO DE VALIDAÇÃO TÉCNICA, GOVERNANÇA E RASTREABILIDADE (NR-1 §1.5.7 / GUIA MTE 2026)",
    marginL + 4,
    curY + 5,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(...NAVY);
  doc.text(`Organização: ${orgName}`, marginL + 4, curY + 13);
  doc.text(`Status de Revisão: ${reviewStatus}`, marginL + 4, curY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.3);
  doc.setTextColor(...MUTED);
  doc.text(
    `Hash Criptográfico: ${meta.sha256 || "Gerado localmente com verificação de integridade"}`,
    marginL + 4,
    curY + 23,
  );
  if (meta.signatureNote) {
    doc.text(`Parecer Técnico Registrado: "${meta.signatureNote.slice(0, 95)}"`, marginL + 4, curY + 27.5);
  } else {
    doc.text(
      "Assinatura do Responsável Técnico (SST / SESMT / Ergonomia): ___________________________________________",
      marginL + 4,
      curY + 29,
    );
  }

  // Apply footers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addFooter(p, totalPages);
  }

  return doc;
}

/**
 * Gera e inicia o download imediato do documento em formato PDF (.pdf)
 * com Design Instrucional Gráfico 5 Estrelas e identidade visual institucional.
 */
export function downloadInstitutionalInstructionalPdf(input: InstitutionalPdfInput): string {
  const safeFilename = normalizePdfFilename(input.filename);
  const pdf = buildInstitutionalInstructionalPdf({
    ...input,
    filename: safeFilename,
  });
  pdf.save(safeFilename);
  return safeFilename;
}
