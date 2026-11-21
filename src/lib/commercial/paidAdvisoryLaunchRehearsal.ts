export type PaidAdvisoryLaunchAcknowledgementKey =
  | "synthetic_company_only"
  | "no_unapproved_price_or_terms"
  | "no_send_signature_or_charge"
  | "receipt_is_not_sale_approval";

export type PaidAdvisoryLaunchAction = "bounded_answer" | "stop_and_escalate";

export type PaidAdvisoryLaunchScenario = {
  key: string;
  label: string;
  prompt: string;
  competency: "scope" | "commercial" | "legal" | "privacy" | "delivery" | "integration";
  expectedAction: PaidAdvisoryLaunchAction;
  coaching: string;
};

export type PaidAdvisoryProposalSection = {
  key: string;
  label: string;
  complete: boolean;
  detail: string;
};

export type PaidAdvisoryProposalTemplate = {
  templateId: string;
  version: string;
  status: "internal_draft";
  title: string;
  sections: readonly PaidAdvisoryProposalSection[];
  placeholderKeys: readonly string[];
};

export type PaidAdvisoryLaunchPolicy = {
  policyId: string;
  requiredAcknowledgements: readonly PaidAdvisoryLaunchAcknowledgementKey[];
  minimumScenarioCount: number;
  minimumTemplateSectionCount: number;
  requiredPlaceholderKeys: readonly string[];
  requireAuthorizationReviewReadyForRehearsal: boolean;
  requireSaleAuthorizationForRelease: boolean;
  requireCommercialFieldsApprovedForRelease: boolean;
  requireRecipientApprovedForRelease: boolean;
  prohibitRealCustomerData: boolean;
  prohibitPersistence: boolean;
  prohibitRemoteTransport: boolean;
  prohibitExternalRecipientDuringRehearsal: boolean;
};

export type PaidAdvisoryLaunchContext = {
  authorizationReviewReady: boolean;
  authorizationForSale: boolean;
  commercialFieldsApproved: boolean;
  recipientApproved: boolean;
  syntheticMode: boolean;
  realCustomerDataPresent: boolean;
  persistenceEnabled: boolean;
  remoteTransportEnabled: boolean;
  externalRecipientPresent: boolean;
  acknowledgements: Record<PaidAdvisoryLaunchAcknowledgementKey, boolean>;
};

export type PaidAdvisoryLaunchBlocker =
  | "authorization_review_packet_not_ready"
  | "proposal_template_invalid"
  | "required_placeholder_missing"
  | "scenario_catalog_incomplete"
  | "synthetic_mode_required"
  | "real_customer_data_forbidden"
  | "persistence_forbidden"
  | "remote_transport_forbidden"
  | "external_recipient_forbidden"
  | "sale_authorization_missing"
  | "commercial_fields_not_approved"
  | "recipient_not_approved"
  | "rehearsal_incomplete"
  | `acknowledgement_required:${PaidAdvisoryLaunchAcknowledgementKey}`;

export type PaidAdvisoryLaunchScenarioResult = PaidAdvisoryLaunchScenario & {
  selectedAction: PaidAdvisoryLaunchAction | null;
  passed: boolean;
};

export type PaidAdvisoryLaunchSummary = {
  policyId: string;
  templateId: string;
  templateVersion: string;
  status:
    | "blocked"
    | "ready_for_internal_rehearsal"
    | "in_progress"
    | "complete_no_go"
    | "complete_ready_for_human_release_review";
  launchDecision: "no_go" | "ready_for_human_release_review";
  canStartInternalRehearsal: boolean;
  canIssueLocalReceipt: boolean;
  canReleaseForManualHandoff: boolean;
  canSendProposal: false;
  canStartDelivery: false;
  preflightBlockers: PaidAdvisoryLaunchBlocker[];
  launchBlockers: PaidAdvisoryLaunchBlocker[];
  scenarios: PaidAdvisoryLaunchScenarioResult[];
  passed: number;
  attempted: number;
  total: number;
  completionPct: number;
  nextScenario: PaidAdvisoryLaunchScenarioResult | null;
};

export function evaluatePaidAdvisoryLaunchRehearsal(
  template: PaidAdvisoryProposalTemplate,
  scenarios: readonly PaidAdvisoryLaunchScenario[],
  selectedActions: Partial<Record<string, PaidAdvisoryLaunchAction>>,
  context: PaidAdvisoryLaunchContext,
  policy: PaidAdvisoryLaunchPolicy,
): PaidAdvisoryLaunchSummary {
  const preflightBlockers: PaidAdvisoryLaunchBlocker[] = [];
  const templateValid =
    Boolean(template.templateId.trim() && template.version.trim() && template.title.trim()) &&
    template.status === "internal_draft" &&
    template.sections.length >= policy.minimumTemplateSectionCount &&
    template.sections.every((section) =>
      section.key.trim() && section.label.trim() && section.detail.trim() && section.complete,
    ) &&
    !hasDuplicates(template.sections.map((section) => section.key));
  const placeholdersValid =
    !hasDuplicates(template.placeholderKeys) &&
    policy.requiredPlaceholderKeys.every((key) => template.placeholderKeys.includes(key));
  const scenarioCatalogValid =
    scenarios.length >= policy.minimumScenarioCount &&
    scenarios.every((scenario) =>
      scenario.key.trim() &&
      scenario.label.trim() &&
      scenario.prompt.trim() &&
      scenario.coaching.trim(),
    ) &&
    !hasDuplicates(scenarios.map((scenario) => scenario.key));

  if (policy.requireAuthorizationReviewReadyForRehearsal && !context.authorizationReviewReady) {
    preflightBlockers.push("authorization_review_packet_not_ready");
  }
  if (!templateValid) preflightBlockers.push("proposal_template_invalid");
  if (!placeholdersValid) preflightBlockers.push("required_placeholder_missing");
  if (!scenarioCatalogValid) preflightBlockers.push("scenario_catalog_incomplete");
  if (!context.syntheticMode) preflightBlockers.push("synthetic_mode_required");
  if (policy.prohibitRealCustomerData && context.realCustomerDataPresent) {
    preflightBlockers.push("real_customer_data_forbidden");
  }
  if (policy.prohibitPersistence && context.persistenceEnabled) preflightBlockers.push("persistence_forbidden");
  if (policy.prohibitRemoteTransport && context.remoteTransportEnabled) {
    preflightBlockers.push("remote_transport_forbidden");
  }
  if (policy.prohibitExternalRecipientDuringRehearsal && context.externalRecipientPresent) {
    preflightBlockers.push("external_recipient_forbidden");
  }
  for (const key of policy.requiredAcknowledgements) {
    if (!context.acknowledgements[key]) preflightBlockers.push(`acknowledgement_required:${key}`);
  }

  const canStartInternalRehearsal = preflightBlockers.length === 0;
  const scenarioResults = scenarios.map((scenario) => {
    const selectedAction = selectedActions[scenario.key] ?? null;
    return {
      ...scenario,
      selectedAction,
      passed: canStartInternalRehearsal && selectedAction === scenario.expectedAction,
    };
  });
  const passed = scenarioResults.filter((scenario) => scenario.passed).length;
  const attempted = scenarioResults.filter((scenario) => scenario.selectedAction !== null).length;
  const rehearsalComplete =
    canStartInternalRehearsal && scenarioResults.length > 0 && passed === scenarioResults.length;
  const launchBlockers: PaidAdvisoryLaunchBlocker[] = [];

  if (policy.requireSaleAuthorizationForRelease && !context.authorizationForSale) {
    launchBlockers.push("sale_authorization_missing");
  }
  if (policy.requireCommercialFieldsApprovedForRelease && !context.commercialFieldsApproved) {
    launchBlockers.push("commercial_fields_not_approved");
  }
  if (policy.requireRecipientApprovedForRelease && !context.recipientApproved) {
    launchBlockers.push("recipient_not_approved");
  }
  if (!rehearsalComplete) launchBlockers.push("rehearsal_incomplete");

  const canReleaseForManualHandoff = rehearsalComplete && launchBlockers.length === 0;
  const status = !canStartInternalRehearsal
    ? "blocked"
    : rehearsalComplete
      ? canReleaseForManualHandoff
        ? "complete_ready_for_human_release_review"
        : "complete_no_go"
      : attempted > 0
        ? "in_progress"
        : "ready_for_internal_rehearsal";

  return {
    policyId: policy.policyId,
    templateId: template.templateId,
    templateVersion: template.version,
    status,
    launchDecision: canReleaseForManualHandoff ? "ready_for_human_release_review" : "no_go",
    canStartInternalRehearsal,
    canIssueLocalReceipt: rehearsalComplete,
    canReleaseForManualHandoff,
    canSendProposal: false,
    canStartDelivery: false,
    preflightBlockers: unique(preflightBlockers),
    launchBlockers: unique(launchBlockers),
    scenarios: scenarioResults,
    passed,
    attempted,
    total: scenarioResults.length,
    completionPct: pct(passed, scenarioResults.length),
    nextScenario: scenarioResults.find((scenario) => !scenario.passed) ?? null,
  };
}

export type PaidAdvisoryLaunchReceiptInput = {
  receiptId: string;
  generatedAt: string;
  summary: PaidAdvisoryLaunchSummary;
  persisted: boolean;
  remoteTransportEnabled: boolean;
  proposalIssued: boolean;
};

export type PaidAdvisoryLaunchReceipt = {
  receiptId: string;
  generatedAt: string;
  policyId: string;
  templateRef: string;
  status: "internal_launch_rehearsal_complete";
  decision: "no_go" | "ready_for_human_release_review";
  passedScenarioCount: number;
  launchBlockers: PaidAdvisoryLaunchBlocker[];
  storageMode: "memory_only";
  proposalStatus: "not_issued";
  canAuthorizeSale: false;
  canSendProposal: false;
  canStartDelivery: false;
};

export function buildPaidAdvisoryLaunchReceipt(
  input: PaidAdvisoryLaunchReceiptInput,
): PaidAdvisoryLaunchReceipt {
  if (!input.receiptId.trim()) throw new Error("receipt_id_required");
  const generatedAt = new Date(input.generatedAt);
  if (Number.isNaN(generatedAt.getTime())) throw new Error("generated_at_invalid");
  if (!input.summary.canIssueLocalReceipt) throw new Error("rehearsal_incomplete");
  if (input.persisted) throw new Error("receipt_must_remain_memory_only");
  if (input.remoteTransportEnabled) throw new Error("remote_transport_forbidden");
  if (input.proposalIssued) throw new Error("proposal_issue_forbidden");

  return {
    receiptId: input.receiptId.trim(),
    generatedAt: generatedAt.toISOString(),
    policyId: input.summary.policyId,
    templateRef: `${input.summary.templateId}@${input.summary.templateVersion}`,
    status: "internal_launch_rehearsal_complete",
    decision: input.summary.launchDecision,
    passedScenarioCount: input.summary.passed,
    launchBlockers: [...input.summary.launchBlockers],
    storageMode: "memory_only",
    proposalStatus: "not_issued",
    canAuthorizeSale: false,
    canSendProposal: false,
    canStartDelivery: false,
  };
}

export function paidAdvisoryLaunchBlockerLabel(blocker: PaidAdvisoryLaunchBlocker) {
  if (blocker.startsWith("acknowledgement_required:")) {
    return "Confirmar todas as fronteiras do preflight comercial.";
  }

  switch (blocker) {
    case "authorization_review_packet_not_ready":
      return "Concluir o pacote interno de autorização antes do ensaio.";
    case "proposal_template_invalid":
      return "Corrigir a estrutura da proposta interna versionada.";
    case "required_placeholder_missing":
      return "Manter todos os campos comerciais pendentes como placeholders explícitos.";
    case "scenario_catalog_incomplete":
      return "Completar o catálogo mínimo de situações adversariais.";
    case "synthetic_mode_required":
      return "Ativar exclusivamente o modo sintético.";
    case "real_customer_data_forbidden":
      return "Remover qualquer dado de cliente ou trabalhador real.";
    case "persistence_forbidden":
      return "Desabilitar persistência durante o ensaio.";
    case "remote_transport_forbidden":
      return "Desabilitar transporte remoto durante o ensaio.";
    case "external_recipient_forbidden":
      return "Remover destinatários externos do ensaio.";
    case "sale_authorization_missing":
      return "Obter a autorização formal dos quatro papéis responsáveis.";
    case "commercial_fields_not_approved":
      return "Aprovar preço, tributos, validade e termos de pagamento.";
    case "recipient_not_approved":
      return "Validar formalmente o comprador e o destinatário da proposta.";
    case "rehearsal_incomplete":
      return "Concluir todas as decisões do ensaio comercial.";
  }
}

function hasDuplicates(values: readonly string[]) {
  return new Set(values).size !== values.length;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
