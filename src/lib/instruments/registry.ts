export type InstrumentStatus = "draft" | "review" | "approved" | "retired";
export type VerificationStatus = "unverified" | "verified";
export type LicenseStatus = "unknown" | "under_review" | "approved" | "restricted";
export type ScoringMode = "not_implemented" | "server";

export type InstrumentVersion = {
  instrumentKey: string;
  version: string;
  status: InstrumentStatus;
  locale: string;
  jurisdiction: string;
  sourceStatus: VerificationStatus;
  primarySourceRef: string | null;
  licenseStatus: LicenseStatus;
  licenseRef: string | null;
  itemCount: number;
  subscaleCount: number;
  contentSha256: string | null;
  scoringMode: ScoringMode;
  scoringFunctionName: string | null;
  runtimeReady: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
};

export type RegistryIssue = {
  code: string;
  field: keyof InstrumentVersion | "approval";
  message: string;
};

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const SHA256 = /^[a-f0-9]{64}$/i;

export function validateInstrumentVersion(version: InstrumentVersion): RegistryIssue[] {
  const issues: RegistryIssue[] = [];
  const add = (code: string, field: RegistryIssue["field"], message: string) =>
    issues.push({ code, field, message });

  if (!version.instrumentKey.trim()) add("instrument_key_required", "instrumentKey", "Identificador estável obrigatório.");
  if (!SEMVER.test(version.version)) add("invalid_semver", "version", "A versão deve seguir SemVer.");
  if (!version.locale.trim()) add("locale_required", "locale", "Idioma/localidade obrigatório.");
  if (!version.jurisdiction.trim()) add("jurisdiction_required", "jurisdiction", "Jurisdição obrigatória.");
  if (!Number.isInteger(version.itemCount) || version.itemCount < 1) add("invalid_item_count", "itemCount", "Item count deve ser inteiro positivo.");
  if (!Number.isInteger(version.subscaleCount) || version.subscaleCount < 1) add("invalid_subscale_count", "subscaleCount", "Subscale count deve ser inteiro positivo.");
  if (version.contentSha256 && !SHA256.test(version.contentSha256)) add("invalid_content_hash", "contentSha256", "Hash deve ser SHA-256 hexadecimal.");

  if (version.status === "approved") {
    if (version.sourceStatus !== "verified" || !version.primarySourceRef) {
      add("source_not_verified", "primarySourceRef", "Aprovação exige fonte primária verificada.");
    }
    if (version.licenseStatus !== "approved" || !version.licenseRef) {
      add("license_not_approved", "licenseRef", "Aprovação exige licença e atribuição verificadas.");
    }
    if (!version.contentSha256) add("content_hash_required", "contentSha256", "Aprovação exige hash do conteúdo.");
    if (version.scoringMode !== "server" || !version.scoringFunctionName) {
      add("server_scoring_required", "scoringMode", "Campanhas exigem scoring versionado no servidor.");
    }
    if (!version.runtimeReady) add("runtime_not_ready", "runtimeReady", "Versão aprovada deve passar validação de runtime.");
    if (!version.approvedBy || !version.approvedAt) add("approval_missing", "approval", "Aprovação exige autor e instante.");
  }

  return issues;
}

export function campaignEligibility(version: InstrumentVersion) {
  const issues = validateInstrumentVersion(version);
  if (version.status !== "approved") {
    issues.unshift({
      code: "instrument_not_approved",
      field: "status",
      message: `Versão em estado ${version.status}; somente versões aprovadas podem abrir campanha.`,
    });
  }
  if (version.status === "retired") {
    issues.unshift({
      code: "instrument_retired",
      field: "status",
      message: "Versão retirada permanece legível no histórico, mas não pode iniciar campanha.",
    });
  }
  return { allowed: issues.length === 0, issues };
}
