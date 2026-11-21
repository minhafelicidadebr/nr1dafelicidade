// File path retained for compatibility; the contract models a point-in-time published baseline, not continuous sync.
export type PublishedBaselineTarget = "github" | "lovable";

export type PublishedBaselineEvidence = {
  hasGitRepository: boolean;
  hasGitRemote: boolean;
  workingTreeAudited: boolean;
  localCiGreen: boolean;
  githubActionsGreen: boolean;
  databaseCiGreen: boolean;
  branchProtectionVerified: boolean;
  lovableProjectLinked: boolean;
  lovablePublishedBaselineVerified: boolean;
  dataRealEnabled: boolean;
  gateAdvanceRequested: boolean;
};

export type PublishedBaselinePolicy = {
  policyId: string;
  targets: PublishedBaselineTarget[];
  requireGitRepository: boolean;
  requireGitRemote: boolean;
  requireWorkingTreeAudit: boolean;
  requireLocalCi: boolean;
  requireGithubActions: boolean;
  requireDatabaseCi: boolean;
  requireBranchProtection: boolean;
  requireLovableProjectLink: boolean;
  requireLovablePublishedBaseline: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type PublishedBaselineBlocker =
  | "missing_git_repository"
  | "missing_git_remote"
  | "working_tree_not_audited"
  | "local_ci_not_green"
  | "github_actions_not_green"
  | "database_ci_not_green"
  | "branch_protection_not_verified"
  | "lovable_project_not_linked"
  | "lovable_published_baseline_not_verified"
  | "real_data_enabled"
  | "gate_advance_requested";

export type PublishedBaselineSummary = {
  policyId: string;
  targets: PublishedBaselineTarget[];
  status: "blocked" | "ready_for_baseline_review";
  canReviewPublishedBaseline: boolean;
  blockers: PublishedBaselineBlocker[];
  completed: number;
  total: number;
  readinessPct: number;
  nextStep: string;
};

const BLOCKER_LABELS: Record<PublishedBaselineBlocker, string> = {
  missing_git_repository: "Executar a publicacao a partir do clone oficial com diretorio .git.",
  missing_git_remote: "Configurar e auditar o remoto GitHub antes de publicar.",
  working_tree_not_audited: "Auditar o working tree para separar mudancas da fatia e alteracoes externas.",
  local_ci_not_green: "Rodar e registrar a bateria local antes do commit.",
  github_actions_not_green: "Comprovar GitHub Actions verde no repositorio oficial.",
  database_ci_not_green: "Comprovar job de banco/Supabase verde no GitHub.",
  branch_protection_not_verified: "Comprovar branch protection e revisao obrigatoria.",
  lovable_project_not_linked: "Comprovar que o projeto Lovable esta vinculado ao repositorio correto.",
  lovable_published_baseline_not_verified: "Comprovar o baseline publicado no Lovable com receipt e smoke vinculados.",
  real_data_enabled: "Manter dados reais bloqueados; publicacao nao pode habilitar runtime real.",
  gate_advance_requested: "Remover qualquer tentativa de avancar gate sem aceite formal.",
};

export function evaluatePublishedBaselineReadiness(
  evidence: PublishedBaselineEvidence,
  policy: PublishedBaselinePolicy,
): PublishedBaselineSummary {
  const blockers: PublishedBaselineBlocker[] = [];
  const checks: boolean[] = [];

  addRequiredCheck(checks, blockers, policy.requireGitRepository, evidence.hasGitRepository, "missing_git_repository");
  addRequiredCheck(checks, blockers, policy.requireGitRemote, evidence.hasGitRemote, "missing_git_remote");
  addRequiredCheck(checks, blockers, policy.requireWorkingTreeAudit, evidence.workingTreeAudited, "working_tree_not_audited");
  addRequiredCheck(checks, blockers, policy.requireLocalCi, evidence.localCiGreen, "local_ci_not_green");
  addRequiredCheck(checks, blockers, policy.requireGithubActions, evidence.githubActionsGreen, "github_actions_not_green");
  addRequiredCheck(checks, blockers, policy.requireDatabaseCi, evidence.databaseCiGreen, "database_ci_not_green");
  addRequiredCheck(checks, blockers, policy.requireBranchProtection, evidence.branchProtectionVerified, "branch_protection_not_verified");
  addRequiredCheck(checks, blockers, policy.requireLovableProjectLink, evidence.lovableProjectLinked, "lovable_project_not_linked");
  addRequiredCheck(checks, blockers, policy.requireLovablePublishedBaseline, evidence.lovablePublishedBaselineVerified, "lovable_published_baseline_not_verified");

  if (policy.prohibitRealData) {
    checks.push(!evidence.dataRealEnabled);
    if (evidence.dataRealEnabled) blockers.push("real_data_enabled");
  }

  if (policy.prohibitGateAdvance) {
    checks.push(!evidence.gateAdvanceRequested);
    if (evidence.gateAdvanceRequested) blockers.push("gate_advance_requested");
  }

  const uniqueBlockers = unique(blockers);
  const completed = checks.filter(Boolean).length;
  const canReviewPublishedBaseline = checks.length > 0 && uniqueBlockers.length === 0;

  return {
    policyId: policy.policyId,
    targets: policy.targets,
    status: canReviewPublishedBaseline ? "ready_for_baseline_review" : "blocked",
    canReviewPublishedBaseline,
    blockers: uniqueBlockers,
    completed,
    total: checks.length,
    readinessPct: pct(completed, checks.length),
    nextStep: uniqueBlockers.length > 0
      ? publishedBaselineBlockerLabel(uniqueBlockers[0])
      : "Baseline publicado pronto para revisão humana; isso não comprova o HEAD atual nem autoriza nova publicação.",
  };
}

export function publishedBaselineBlockerLabel(blocker: PublishedBaselineBlocker) {
  return BLOCKER_LABELS[blocker];
}

function addRequiredCheck(
  checks: boolean[],
  blockers: PublishedBaselineBlocker[],
  required: boolean,
  ok: boolean,
  blocker: PublishedBaselineBlocker,
) {
  if (!required) return;
  checks.push(ok);
  if (!ok) blockers.push(blocker);
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
