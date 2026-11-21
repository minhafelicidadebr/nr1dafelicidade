// Renderiza o documento num separador novo com CSS premium print-ready
// (Navy/Gold, Sora/DM Sans, footer Impact HUB, marca-d'água NR-1).
// O utilizador faz "Imprimir → Salvar como PDF" para obter o ficheiro final.
import { sanitizeBranding, DEFAULT_ACCENT, type DocumentBranding } from "@/lib/documents/brandingConfig";

export type DocumentPrintMetadata = {
  version?: number;
  kAnonymity?: number;
  orgName?: string;
  sector?: string;
  sizeBand?: string;
  cycleName?: string;
  horizon?: string;
  generatedAt?: string;
  criteriaVersion?: string;
};

export type DocumentPrintPayload = {
  markdown: string;
  meta: DocumentPrintMetadata;
};

export type DocumentPrintView = {
  title: string;
  kind: string;
  content: unknown;
  created_at: string;
  version?: number;
  sha256?: string | null;
  assinado_em?: string | null;
  revisao_por?: string | null;
  signature_note?: string | null;
};

type UnknownRecord = Record<string, unknown>;

function isUnknownRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function positiveInteger(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : undefined;
}

function normalizeDocumentPrintMetadata(value: unknown): DocumentPrintMetadata {
  const record = isUnknownRecord(value) ? value : {};
  const metadata: DocumentPrintMetadata = {};
  const version = positiveInteger(record.version);
  const kAnonymity = positiveInteger(record.k_anonymity);

  if (version !== undefined) metadata.version = version;
  if (kAnonymity !== undefined) metadata.kAnonymity = kAnonymity;

  const stringFields = [
    ["org_name", "orgName"],
    ["sector", "sector"],
    ["size_band", "sizeBand"],
    ["cycle_name", "cycleName"],
    ["horizon", "horizon"],
    ["generated_at", "generatedAt"],
    ["criteria_version", "criteriaVersion"],
  ] as const;

  for (const [sourceKey, targetKey] of stringFields) {
    const field = optionalString(record[sourceKey]);
    if (field !== undefined) metadata[targetKey] = field;
  }

  return metadata;
}

export function normalizeDocumentPrintPayload(value: unknown): DocumentPrintPayload {
  const record = isUnknownRecord(value) ? value : {};
  return {
    markdown: optionalString(record.markdown) ?? "",
    meta: normalizeDocumentPrintMetadata(record.meta),
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}

function safeDocumentHref(value: string): string {
  const href = value.trim();
  return /^(?:https?:\/\/|mailto:|\/|#)/i.test(href) ? href : "#";
}

// Minimal Markdown→HTML renderer (cobre o subset emitido pelo edge function:
// headings, bold/em/code, links, listas, tabelas pipe, blockquote, hr).
export function renderDocumentMarkdown(src: string): string {
  const inline = (s: string) =>
    escapeHtml(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => `<a href="${safeDocumentHref(href)}">${label}</a>`);

  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (/^\s*$/.test(ln)) { i++; continue; }
    if (/^---+\s*$/.test(ln)) { out.push("<hr/>"); i++; continue; }
    const h = ln.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (/^>\s?/.test(ln)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }
    if (/^\s*\|/.test(ln) && i + 1 < lines.length && /^\s*\|?\s*[-:]+/.test(lines[i + 1])) {
      const split = (r: string) => r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
      const head = split(lines[i]); i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /\|/.test(lines[i]) && !/^\s*$/.test(lines[i])) { rows.push(split(lines[i])); i++; }
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")
        }</tbody></table>`,
      );
      continue;
    }
    if (/^\s*[-*]\s+/.test(ln)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      out.push(`<ul>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ul>`);
      continue;
    }
    if (/^\s*\d+\.\s+/.test(ln)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      out.push(`<ol>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</ol>`);
      continue;
    }
    // parágrafo
    const para: string[] = [ln];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#|>|\s*[-*]\s|\s*\d+\.\s|\s*\|)/.test(lines[i]) && !/^---+\s*$/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

function buildCss(accent: string) {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
  :root {
    --navy: #0B1437; --navy-2: #111E4F; --gold: ${accent}; --gold-2: ${accent};
    --ink: #1A1F36; --muted: #5A6478; --line: #E5E7EE; --bg: #F6F4EE;
  }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { margin:0; padding:0; background:#fff; color:var(--ink); font-family:'DM Sans',system-ui,sans-serif; font-size:11pt; line-height:1.55; }
  .page { max-width: 820px; margin: 0 auto; padding: 0 0 60px; background:#fff; }
  .content { padding: 36px 48px 0; }
  h1,h2,h3,h4 { font-family:'Sora',sans-serif; color:var(--navy); margin:1.4em 0 .55em; line-height:1.2; letter-spacing:-.01em; page-break-after: avoid; }
  h1 { font-size: 26pt; font-weight: 700; }
  h2 { font-size: 16pt; font-weight: 600; border-bottom:1px solid var(--line); padding-bottom:.35em; }
  h3 { font-size: 13pt; font-weight: 600; color:var(--navy-2); }
  p, li { color:var(--ink); }
  p, li, blockquote, table { page-break-inside: avoid; }
  strong { color:var(--navy); }
  em { color:var(--muted); }
  hr { border:0; border-top:1px solid var(--line); margin: 1.6em 0; }
  blockquote { border-left:3px solid var(--gold); margin:1em 0; padding:.4em 1em; background:#FBF8EE; color:var(--ink); font-size:10.5pt; }
  code { background:#F1F2F6; padding:1px 5px; border-radius:4px; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.9em; }
  table { width:100%; border-collapse: collapse; margin:.8em 0 1.4em; font-size:10pt; }
  th, td { border-bottom:1px solid var(--line); padding:8px 10px; text-align:left; vertical-align:top; }
  th { background:var(--navy) !important; color:#fff !important; font-family:'Sora',sans-serif; font-weight:600; font-size:9pt; letter-spacing:.02em; text-transform:uppercase; }
  td strong { color:var(--navy); }

  /* Cover — página inteira, cor sólida (gradiente como reforço) */
  .cover {
    background-color: #0B1437 !important;
    background-image: linear-gradient(135deg, #111E4F 0%, #0B1437 60%, #06102B 100%) !important;
    color:#fff !important; padding: 70px 56px 56px; position:relative; overflow:hidden;
    border-bottom: 6px solid var(--gold);
    page-break-after: always;
    break-after: page;
    min-height: 90vh;
    display: flex; flex-direction: column; justify-content: center;
  }
  .cover * { color: inherit; }
  .cover .kicker { font-family:'Sora',sans-serif; font-size:10pt; letter-spacing:.32em; text-transform:uppercase; color:#E7CA7E !important; }
  .cover h1 { color:#fff !important; font-size: 30pt; margin:.5em 0 .3em; max-width: 22ch; }
  .cover .sub { font-size: 12pt; color:#D7DBEA !important; max-width:62ch; }
  .cover .meta { display:flex; flex-wrap:wrap; gap: 18px 32px; margin-top: 28px; font-size:10pt; color:#C9CFE3 !important; position:relative; z-index:1;}
  .cover .meta div span { display:block; font-size:9pt; color:#E7CA7E !important; letter-spacing:.18em; text-transform:uppercase; margin-bottom:3px; font-family:'Sora',sans-serif; }

  /* Footer (Impact HUB) */
  .footer {
    margin: 48px 48px 0; padding-top: 18px; border-top: 1px solid var(--line);
    display:flex; justify-content:space-between; align-items:center;
    font-size: 8.5pt; color:var(--muted); font-family:'Sora',sans-serif; letter-spacing:.05em;
  }
  .footer .seal { color:var(--navy); font-weight:600; }
  .footer .seal b { color:var(--gold); }

  @page { size: A4; margin: 14mm; }
  @page :first { margin: 0; }
  @media print {
    body { background:#fff; }
    .page { box-shadow:none; padding: 0; max-width:none; }
    .toolbar { display:none !important; }
    .no-print { display:none !important; }
    .cover { margin: 0; min-height: 100vh; height: 100vh; }
  }
  .toolbar { position: sticky; top:0; z-index:10; background: var(--navy); color:#fff; padding:10px 18px; display:flex; justify-content:space-between; align-items:center; font-family:'Sora',sans-serif; font-size:10pt;}
  .toolbar button { background:var(--gold); color:var(--navy); border:0; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer; font-family:'Sora',sans-serif; letter-spacing:.04em;}
  .toolbar button:hover { background: var(--gold-2); }
  .cover .brand-logo { max-height: 56px; max-width: 220px; margin-bottom: 22px; object-fit: contain; }
`;
}

function formatBrazilianDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toLocaleDateString("pt-BR");
}

export function openDocumentPrintView(
  doc: DocumentPrintView,
  branding?: DocumentBranding,
) {
  const safeBranding = branding ? sanitizeBranding(branding) : { accentColor: DEFAULT_ACCENT, logoDataUrl: null };
  const payload = normalizeDocumentPrintPayload(doc.content);
  const meta = payload.meta;
  const html = renderDocumentMarkdown(payload.markdown);
  const logoHtml = safeBranding.logoDataUrl
    ? `<img class="brand-logo" src="${safeBranding.logoDataUrl}" alt="Logo da organização" />`
    : "";
  const version = doc.version ?? meta.version ?? 1;
  const generatedAt = formatBrazilianDate(meta.generatedAt) ?? formatBrazilianDate(doc.created_at) ?? "—";
  const hashShort = (doc.sha256 ?? "").slice(0, 16);
  const signed = doc.assinado_em
    ? `Revisado em ${new Date(doc.assinado_em).toLocaleString("pt-BR")}${doc.signature_note ? ` — ${escapeHtml(doc.signature_note)}` : ""}`
    : `Pendente de revisão técnica (SST/SESMT)`;

  const docHtml = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"/>
<title>${escapeHtml(doc.title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>${buildCss(safeBranding.accentColor)}</style>
</head><body>
<div class="toolbar no-print">
  <span>${escapeHtml(doc.title)} · v${version} · ${escapeHtml(doc.kind.toUpperCase())}</span>
  <button onclick="window.print()">Imprimir / Salvar PDF</button>
</div>
<div class="page">
  <div class="cover">
    ${logoHtml}
    <div class="kicker">Plataforma 4 Lentes · Lente Mensurar · NR-1 / ISO 45003</div>
    <h1>${escapeHtml(doc.title)}</h1>
    <div class="sub">Documento preliminar. Instrumento, fonte, licença e scoring devem constar do registro aprovado. Saídas coletivas estão sujeitas à política de privacidade vigente (k mínimo ${meta.kAnonymity ?? 5}).</div>
    <div class="meta">
      <div><span>Organização</span>${escapeHtml(meta.orgName ?? "—")}</div>
      <div><span>Setor · Porte</span>${escapeHtml(meta.sector ?? "—")} · ${escapeHtml(meta.sizeBand ?? "—")}</div>
      <div><span>Ciclo</span>${escapeHtml(meta.cycleName ?? "—")}</div>
      <div><span>Horizonte</span>${escapeHtml(meta.horizon ?? "—")}</div>
      <div><span>Gerado em</span>${generatedAt}</div>
      <div><span>Critérios AIHA</span>${escapeHtml(meta.criteriaVersion ?? "—")}</div>
      <div><span>Versão</span>v${version}</div>
      <div><span>Hash SHA-256</span><code style="background:rgba(255,255,255,.08);color:#E7CA7E;padding:2px 6px;border-radius:4px;font-size:8.5pt;">${escapeHtml(hashShort || "—")}…</code></div>
    </div>
  </div>
  <div class="content">
  ${html}
  <div class="footer">
    <div class="seal">IFT · <b>Impact HUB</b> · 4 Lentes</div>
    <div style="text-align:right;">
      <div>${signed}</div>
      <div style="font-family:ui-monospace,Menlo,monospace;font-size:7.5pt;margin-top:2px;">v${version} · sha256:${escapeHtml((doc.sha256 ?? "").slice(0, 24))}…</div>
    </div>
  </div>
  </div>
</div>
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(docHtml);
  w.document.close();
}
