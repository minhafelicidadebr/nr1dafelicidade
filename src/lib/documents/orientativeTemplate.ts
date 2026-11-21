export type OrientativeTemplateId =
  | "consent"
  | "communique"
  | "pgr_text"
  | "controls_implanted"
  | "worker_presentation"
  | "management_manifesto"
  | "harassment_policy"
  | "disconnection_policy";

export type OrientativeDocumentTemplate = {
  id: OrientativeTemplateId;
  title: string;
  version: string;
  fileStem: string;
  sections: string[];
};

export type OrientativeControlSummary = {
  title: string;
  status?: string | null;
  readyForReview?: boolean;
};

export type OrientativeDocumentContext = {
  orgName?: string | null;
  cycleName?: string | null;
  generatedAt?: string | Date | null;
  kMin?: number | null;
  responseCount?: number | null;
  kAnonymityMet?: boolean | null;
  riskCount?: number | null;
  activeActions?: number | null;
  readyActions?: number | null;
  activeControls?: number | null;
  readyControls?: number | null;
  controls?: OrientativeControlSummary[];
};

export type OrientativeSafetyResult = {
  ok: boolean;
  blockers: string[];
};

export type BuiltOrientativeDocument = {
  markdown: string;
  filename: string;
  safety: OrientativeSafetyResult;
};

const REQUIRED_LIMITS = [
  "Modelo orientativo preliminar.",
  "Nao constitui laudo, parecer juridico, aprovacao de gate ou autorizacao de uso com dados reais.",
  "Requer revisao do responsavel tecnico, privacidade/LGPD e governanca antes de uso formal.",
];

const FORBIDDEN_PATTERNS: Array<{ key: string; pattern: RegExp }> = [
  { key: "absolute_anonymity", pattern: /\b(100%\s+anonim\w*|totalmente\s+anonim\w*|anonimato\s+garantido)\b/i },
  { key: "automatic_compliance", pattern: /\b(garante?\s+conformidade|conformidade\s+automatica|atende\s+integralmente)\b/i },
  { key: "diagnosis", pattern: /\b(diagnostico\s+individual|diagnostica\s+trabalhadores|suspeita\s+de\s+tmc)\b/i },
  { key: "causality", pattern: /\b(causa\s+comprovada|nexo\s+causal\s+automatico|resultado\s+garantido)\b/i },
  { key: "risk_reduction", pattern: /\b(reduz\s+automaticamente\s+o\s+risco|risco\s+residual\s+calculado\s+automaticamente)\b/i },
];

export function buildOrientativeDocument(
  template: OrientativeDocumentTemplate,
  context: OrientativeDocumentContext = {},
): BuiltOrientativeDocument {
  const values = buildPlaceholderValues(context);
  const body = template.sections.map((section) => replacePlaceholders(section, values)).join("\n\n");
  const markdown = [
    `# ${template.title}`,
    "",
    REQUIRED_LIMITS.map((line) => `> ${line}`).join("\n"),
    "",
    `- Versao do template: ${template.version}`,
    `- Organizacao: ${values.orgName}`,
    `- Ciclo: ${values.cycleName}`,
    `- Data de geracao: ${values.generatedDate}`,
    `- Politica de amostra: saidas coletivas dependem de k minimo ${values.kMin}`,
    "",
    body,
    "",
    "## Revisao obrigatoria antes de uso formal",
    "",
    "- Responsavel tecnico SST/SESMT ou profissional competente: [PREENCHER]",
    "- Revisao de privacidade/LGPD: [PREENCHER]",
    "- Revisao juridico-regulatoria quando aplicavel: [PREENCHER]",
    "- Decisao de uso: [rascunho / aprovado com ressalvas / rejeitado]",
  ].join("\n");

  return {
    markdown,
    filename: buildOrientativeFilename(template.fileStem, context.generatedAt),
    safety: evaluateOrientativeDocumentSafety(markdown),
  };
}

export function evaluateOrientativeDocumentSafety(markdown: string): OrientativeSafetyResult {
  const blockers = FORBIDDEN_PATTERNS
    .filter(({ pattern }) => pattern.test(markdown))
    .map(({ key }) => key);

  for (const required of REQUIRED_LIMITS) {
    if (!markdown.includes(required)) blockers.push(`missing_limit:${required}`);
  }

  return { ok: blockers.length === 0, blockers };
}

function buildPlaceholderValues(context: OrientativeDocumentContext): Record<string, string> {
  const kMin = String(context.kMin ?? 5);
  const activeControls = context.activeControls ?? 0;
  const readyControls = context.readyControls ?? 0;
  const activeActions = context.activeActions ?? 0;
  const readyActions = context.readyActions ?? 0;

  return {
    orgName: safeText(context.orgName, "[PREENCHER ORGANIZACAO]"),
    cycleName: safeText(context.cycleName, "[PREENCHER CICLO]"),
    generatedDate: formatDate(context.generatedAt),
    kMin,
    responseStatus: responseStatus(context.responseCount, context.kAnonymityMet, Number(kMin)),
    riskCount: String(context.riskCount ?? 0),
    activeActions: String(activeActions),
    readyActions: String(readyActions),
    activeControls: String(activeControls),
    readyControls: String(readyControls),
    controlsTable: controlsTable(context.controls ?? []),
  };
}

function replacePlaceholders(text: string, values: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? `[${key}]`);
}

function responseStatus(responseCount: number | null | undefined, kMet: boolean | null | undefined, kMin: number) {
  if (responseCount == null) return "nao informado";
  if (!kMet && responseCount < kMin) return `abaixo de k minimo ${kMin}; contagem protegida`;
  return `${responseCount} resposta(s) agregada(s)`;
}

function controlsTable(controls: OrientativeControlSummary[]) {
  if (controls.length === 0) {
    return "Nenhum controle declarado foi informado neste rascunho.";
  }

  const rows = controls.map((control) => {
    const readiness = control.readyForReview ? "pronto para revisao" : "pendente de evidencia/revisao";
    return `| ${escapeCell(control.title)} | ${escapeCell(control.status ?? "nao informado")} | ${readiness} |`;
  });

  return [
    "| Controle declarado | Status operacional | Uso permitido neste rascunho |",
    "|---|---|---|",
    ...rows,
  ].join("\n");
}

function escapeCell(value: string) {
  return safeText(value, "nao informado").replace(/\|/g, "/");
}

function safeText(value: string | null | undefined, fallback: string) {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function formatDate(value?: string | Date | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toLocaleDateString("pt-BR");
  return date.toLocaleDateString("pt-BR");
}

function buildOrientativeFilename(fileStem: string, generatedAt?: string | Date | null) {
  const date = generatedAt ? new Date(generatedAt) : new Date();
  const iso = Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  return `${fileStem}_${iso.slice(0, 10)}.md`;
}
