export type SourceKind =
  | "canonical_playbook"
  | "evidence_catalog"
  | "crosswalk"
  | "intervention_library"
  | "learning_content"
  | "assistant_claims";

export type SourceLicenseStatus = "approved" | "unknown" | "restricted" | "not_applicable";
export type SourceReviewStatus = "approved" | "draft" | "needs_review" | "rejected";

export type SourceRecordInput = {
  id: string;
  title: string;
  kind: SourceKind;
  url?: string | null;
  version?: string | null;
  sha256?: string | null;
  licenseStatus: SourceLicenseStatus;
  reviewStatus: SourceReviewStatus;
  claimsReviewed: boolean;
  recordCount?: number;
};

export type SourceReadinessBlocker =
  | "missing_canonical_playbook"
  | "missing_url"
  | "missing_version"
  | "missing_hash"
  | "license_not_approved"
  | "review_not_approved"
  | "claims_not_reviewed";

export type SourceReadinessItem = SourceRecordInput & {
  blockers: SourceReadinessBlocker[];
  ready: boolean;
};

export type SourceReadinessSummary = {
  policyId: string;
  items: SourceReadinessItem[];
  total: number;
  ready: number;
  blockers: SourceReadinessBlocker[];
  canSync: boolean;
  status: "blocked" | "ready_for_sync";
  nextStep: string;
};

export type SourceReadinessPolicy = {
  policyId: string;
  requireCanonicalPlaybook: boolean;
  requireUrl: boolean;
  requireVersion: boolean;
  requireHash: boolean;
  requireApprovedLicense: boolean;
  requireApprovedReview: boolean;
  requireClaimsReviewed: boolean;
};

const BLOCKER_LABELS: Record<SourceReadinessBlocker, string> = {
  missing_canonical_playbook: "Registrar a fonte canônica do Work Wellbeing Playbook 2.0.",
  missing_url: "Registrar URL ou referência controlada da fonte.",
  missing_version: "Registrar versão, edição ou data de vigência.",
  missing_hash: "Registrar hash SHA-256 do material aprovado.",
  license_not_approved: "Aprovar licença e permissão de uso/reprodução.",
  review_not_approved: "Registrar revisão técnica/metodológica aprovada.",
  claims_not_reviewed: "Revisar afirmações derivadas antes de sincronizar conteúdo.",
};

export function evaluateSourceReadiness(
  records: SourceRecordInput[],
  policy: SourceReadinessPolicy,
): SourceReadinessSummary {
  const items = records.map((record) => {
    const blockers = evaluateRecord(record, policy);
    return {
      ...record,
      blockers,
      ready: blockers.length === 0,
    };
  });
  const blockers = unique([
    ...(policy.requireCanonicalPlaybook && !records.some((record) => record.kind === "canonical_playbook")
      ? ["missing_canonical_playbook" as const]
      : []),
    ...items.flatMap((item) => item.blockers),
  ]);
  const ready = items.filter((item) => item.ready).length;
  const canSync = blockers.length === 0 && records.length > 0;

  return {
    policyId: policy.policyId,
    items,
    total: items.length,
    ready,
    blockers,
    canSync,
    status: canSync ? "ready_for_sync" : "blocked",
    nextStep: blockers.length > 0
      ? sourceReadinessBlockerLabel(blockers[0])
      : "Fontes prontas para sincronização controlada.",
  };
}

export function sourceReadinessBlockerLabel(blocker: SourceReadinessBlocker) {
  return BLOCKER_LABELS[blocker];
}

function evaluateRecord(record: SourceRecordInput, policy: SourceReadinessPolicy) {
  const blockers: SourceReadinessBlocker[] = [];
  if (policy.requireUrl && !record.url?.trim()) blockers.push("missing_url");
  if (policy.requireVersion && !record.version?.trim()) blockers.push("missing_version");
  if (policy.requireHash && !record.sha256?.trim()) blockers.push("missing_hash");
  if (policy.requireApprovedLicense && record.licenseStatus !== "approved" && record.licenseStatus !== "not_applicable") {
    blockers.push("license_not_approved");
  }
  if (policy.requireApprovedReview && record.reviewStatus !== "approved") blockers.push("review_not_approved");
  if (policy.requireClaimsReviewed && !record.claimsReviewed) blockers.push("claims_not_reviewed");
  return blockers;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}
