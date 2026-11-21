export type LeadIntakePurpose =
  | "design_partner_discovery"
  | "newsletter"
  | "paid_pilot"
  | "worker_campaign";

export type LeadIntakeTransport = "local_queue" | "remote_crm" | "disabled";

export type LeadIntakeFieldSensitivity =
  | "contact"
  | "business"
  | "optional_contact"
  | "consent"
  | "worker"
  | "sensitive"
  | "free_text";

export type LeadIntakeFieldInput = {
  key: string;
  label: string;
  sensitivity: LeadIntakeFieldSensitivity;
  required: boolean;
  collected: boolean;
};

export type LeadIntakePolicy = {
  policyId: string;
  targetGate: "G1";
  allowedPurposes: LeadIntakePurpose[];
  allowedTransports: LeadIntakeTransport[];
  maxRetentionDays: number;
  requireLgpdConsent: boolean;
  requireDpaForRemoteCrm: boolean;
  prohibitWorkerData: boolean;
  prohibitSensitiveData: boolean;
  prohibitFreeText: boolean;
  prohibitPaidPilotIntent: boolean;
  prohibitCampaignIntent: boolean;
};

export type LeadIntakeContext = {
  purpose: LeadIntakePurpose;
  transport: LeadIntakeTransport;
  retentionDays: number;
  lgpdConsentCaptured: boolean;
  dpaApproved: boolean;
  realWorkerDataCollected: boolean;
  sensitiveDataCollected: boolean;
  freeTextEnabled: boolean;
  paidPilotIntent: boolean;
  campaignIntent: boolean;
};

export type LeadIntakeBlocker =
  | "purpose_not_allowed"
  | "transport_not_allowed"
  | "retention_invalid"
  | "retention_too_long"
  | "lgpd_consent_missing"
  | "remote_crm_without_dpa"
  | "worker_data_collected"
  | "sensitive_data_collected"
  | "free_text_enabled"
  | "paid_pilot_intent"
  | "campaign_intent"
  | "required_field_missing"
  | "worker_field_present"
  | "sensitive_field_present"
  | "free_text_field_present";

export type LeadIntakeField = LeadIntakeFieldInput & {
  ready: boolean;
  blockers: LeadIntakeBlocker[];
};

export type LeadIntakeSummary = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "controlled_contact_ready" | "remote_crm_ready";
  canCollectControlledContact: boolean;
  canUseRemoteCrm: boolean;
  fields: LeadIntakeField[];
  blockers: LeadIntakeBlocker[];
  totalFields: number;
  readyFields: number;
  blockedFields: number;
  retentionDays: number;
  maxRetentionDays: number;
  nextStep: LeadIntakeField | null;
};

export type ControlledLeadPayload = {
  form_profile_id: string;
  route_id: string;
  contact_name: string;
  work_email: string;
  company_name: string;
  role: string;
  employee_count_band: string;
  primary_goal: string;
  consent_lgpd: boolean;
};

export type ControlledLeadRecord = {
  schemaVersion: 1;
  policyId: string;
  storageMode: "local_queue";
  status: "local_draft_not_delivered" | "pending_manual_review";
  receiptId?: string | null;
  createdAt: string;
  expiresAt: string;
  form_profile_id: string;
  route_id: string;
  contact_name: string;
  work_email: string;
  company_name: string;
  role: string | null;
  employee_count_band: string;
  primary_goal: string | null;
  whatsapp: string | null;
  consent_lgpd: true;
  consent_email_opt_in: boolean;
  consent_whatsapp_opt_in: boolean;
  utm_source: string | null;
  utm_campaign: string | null;
};

export type ControlledLeadDraftRecord = ControlledLeadRecord & {
  status: "local_draft_not_delivered";
  receiptId: string;
};

export type BuildControlledLeadRecordOptions = {
  policyId: string;
  retentionDays: number;
  receiptId: string;
  allowedEmployeeCountBands: readonly string[];
  allowedPrimaryGoals: readonly string[];
  now?: Date;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function evaluateLeadIntakeGovernance(
  fields: LeadIntakeFieldInput[],
  context: LeadIntakeContext,
  policy: LeadIntakePolicy,
): LeadIntakeSummary {
  const contextBlockers: LeadIntakeBlocker[] = [];

  if (!policy.allowedPurposes.includes(context.purpose)) contextBlockers.push("purpose_not_allowed");
  if (!policy.allowedTransports.includes(context.transport)) contextBlockers.push("transport_not_allowed");
  if (!Number.isInteger(context.retentionDays) || context.retentionDays <= 0) {
    contextBlockers.push("retention_invalid");
  } else if (context.retentionDays > policy.maxRetentionDays) {
    contextBlockers.push("retention_too_long");
  }
  if (policy.requireLgpdConsent && !context.lgpdConsentCaptured) contextBlockers.push("lgpd_consent_missing");
  if (policy.requireDpaForRemoteCrm && context.transport === "remote_crm" && !context.dpaApproved) {
    contextBlockers.push("remote_crm_without_dpa");
  }
  if (policy.prohibitWorkerData && context.realWorkerDataCollected) contextBlockers.push("worker_data_collected");
  if (policy.prohibitSensitiveData && context.sensitiveDataCollected) {
    contextBlockers.push("sensitive_data_collected");
  }
  if (policy.prohibitFreeText && context.freeTextEnabled) contextBlockers.push("free_text_enabled");
  if (policy.prohibitPaidPilotIntent && context.paidPilotIntent) contextBlockers.push("paid_pilot_intent");
  if (policy.prohibitCampaignIntent && context.campaignIntent) contextBlockers.push("campaign_intent");

  const evaluatedFields = fields.map((field) => {
    const blockers: LeadIntakeBlocker[] = [];

    if (field.required && !field.collected) blockers.push("required_field_missing");
    if (policy.prohibitWorkerData && field.sensitivity === "worker") blockers.push("worker_field_present");
    if (policy.prohibitSensitiveData && field.sensitivity === "sensitive") {
      blockers.push("sensitive_field_present");
    }
    if (policy.prohibitFreeText && field.sensitivity === "free_text") blockers.push("free_text_field_present");

    return {
      ...field,
      blockers: unique(blockers),
      ready: blockers.length === 0,
    };
  });

  const blockers = unique([
    ...contextBlockers,
    ...evaluatedFields.flatMap((field) => field.blockers),
  ]);
  const contextReady = contextBlockers.length === 0;
  const fieldsReady = evaluatedFields.every((field) => field.ready);
  const canUseRemoteCrm =
    contextReady &&
    fieldsReady &&
    context.transport === "remote_crm" &&
    (!policy.requireDpaForRemoteCrm || context.dpaApproved);
  const canCollectControlledContact =
    contextReady &&
    fieldsReady &&
    context.transport === "local_queue";

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canUseRemoteCrm
      ? "remote_crm_ready"
      : canCollectControlledContact
        ? "controlled_contact_ready"
        : "blocked",
    canCollectControlledContact,
    canUseRemoteCrm,
    fields: evaluatedFields,
    blockers,
    totalFields: evaluatedFields.length,
    readyFields: evaluatedFields.filter((field) => field.ready).length,
    blockedFields: evaluatedFields.filter((field) => !field.ready).length,
    retentionDays: context.retentionDays,
    maxRetentionDays: policy.maxRetentionDays,
    nextStep: evaluatedFields.find((field) => !field.ready) ?? null,
  };
}

export function leadIntakeBlockerLabel(blocker: LeadIntakeBlocker) {
  const labels: Record<LeadIntakeBlocker, string> = {
    purpose_not_allowed: "Usar somente descoberta Design Partner ou newsletter sem campanha real.",
    transport_not_allowed: "Usar apenas fila local em G1; CRM remoto continua bloqueado.",
    retention_invalid: "Definir retencao positiva e versionada para contato B2B em G1.",
    retention_too_long: "Reduzir retencao ao limite aprovado para contato B2B em G1.",
    lgpd_consent_missing: "Capturar consentimento LGPD explicito antes de registrar contato.",
    remote_crm_without_dpa: "Aprovar DPA, operador, acesso e retencao antes de CRM remoto.",
    worker_data_collected: "Remover qualquer dado real de trabalhador.",
    sensitive_data_collected: "Remover dado sensivel, clinico ou psicossocial individual.",
    free_text_enabled: "Remover campos livres que possam capturar conteudo sensivel.",
    paid_pilot_intent: "Tratar piloto pago como bloqueado ate aprovacao formal.",
    campaign_intent: "Tratar campanha real como bloqueada ate gate e aprovacoes formais.",
    required_field_missing: "Manter campos minimos de contato e empresa.",
    worker_field_present: "Remover campo de trabalhador do intake comercial.",
    sensitive_field_present: "Remover campo sensivel do intake comercial.",
    free_text_field_present: "Remover campo livre do intake comercial.",
  };
  return labels[blocker];
}

export function buildControlledLeadRecord(
  payload: ControlledLeadPayload,
  options: BuildControlledLeadRecordOptions,
): ControlledLeadDraftRecord {
  if (!payload.consent_lgpd) throw new Error("lgpd_consent_required");
  if (!Number.isInteger(options.retentionDays) || options.retentionDays <= 0) {
    throw new Error("retention_invalid");
  }

  const receiptId = cleanRequired(options.receiptId, "receipt_id", 80);
  const contactName = cleanRequired(payload.contact_name, "contact_name", 120);
  const workEmail = cleanRequired(payload.work_email, "work_email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) throw new Error("work_email_invalid");
  const companyName = cleanRequired(payload.company_name, "company_name", 160);
  const employeeCountBand = cleanAllowedRequired(
    payload.employee_count_band,
    "employee_count_band",
    options.allowedEmployeeCountBands,
  );
  const primaryGoal = cleanAllowedOptional(
    payload.primary_goal,
    "primary_goal",
    options.allowedPrimaryGoals,
  );
  const now = options.now ?? new Date();
  const expiresAt = new Date(now.getTime() + options.retentionDays * MS_PER_DAY);

  return {
    schemaVersion: 1,
    policyId: options.policyId,
    storageMode: "local_queue",
    status: "local_draft_not_delivered",
    receiptId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    form_profile_id: cleanRequired(payload.form_profile_id, "form_profile_id", 80),
    route_id: cleanRequired(payload.route_id, "route_id", 80),
    contact_name: contactName,
    work_email: workEmail,
    company_name: companyName,
    role: cleanOptional(payload.role, 120),
    employee_count_band: employeeCountBand,
    primary_goal: primaryGoal,
    whatsapp: null,
    consent_lgpd: true,
    consent_email_opt_in: false,
    consent_whatsapp_opt_in: false,
    utm_source: null,
    utm_campaign: null,
  };
}

export function isControlledLeadRecord(value: unknown): value is ControlledLeadRecord {
  if (!isRecord(value)) return false;
  const createdAt = parseDate(value.createdAt);
  const expiresAt = parseDate(value.expiresAt);
  const statusIsValid = value.status === "local_draft_not_delivered" || value.status === "pending_manual_review";
  const receiptIsValid = value.status === "pending_manual_review"
    ? value.receiptId === null || typeof value.receiptId === "string" || value.receiptId === undefined
    : typeof value.receiptId === "string" && value.receiptId.trim().length > 0;

  return value.schemaVersion === 1 &&
    typeof value.policyId === "string" &&
    value.storageMode === "local_queue" &&
    statusIsValid &&
    receiptIsValid &&
    createdAt !== null &&
    expiresAt !== null &&
    expiresAt > createdAt &&
    typeof value.form_profile_id === "string" &&
    typeof value.route_id === "string" &&
    typeof value.contact_name === "string" &&
    typeof value.work_email === "string" &&
    typeof value.company_name === "string" &&
    isOptionalString(value.role) &&
    typeof value.employee_count_band === "string" &&
    isOptionalString(value.primary_goal) &&
    isOptionalString(value.whatsapp) &&
    value.consent_lgpd === true &&
    typeof value.consent_email_opt_in === "boolean" &&
    typeof value.consent_whatsapp_opt_in === "boolean" &&
    isOptionalString(value.utm_source) &&
    isOptionalString(value.utm_campaign);
}

export function isActiveControlledLeadRecord(
  value: unknown,
  options: { policyId: string; now?: Date },
): value is ControlledLeadRecord {
  if (!isControlledLeadRecord(value) || value.policyId !== options.policyId) return false;
  return Date.parse(value.expiresAt) > (options.now ?? new Date()).getTime();
}

function cleanRequired(value: string, field: string, maxLength: number) {
  const cleaned = value.trim();
  if (!cleaned) throw new Error(`required_${field}_missing`);
  if (cleaned.length > maxLength) throw new Error(`${field}_too_long`);
  return cleaned;
}

function cleanOptional(value: string | null, maxLength: number) {
  const cleaned = value?.trim() ?? "";
  if (cleaned.length > maxLength) throw new Error("optional_value_too_long");
  return cleaned.length > 0 ? cleaned : null;
}

function cleanAllowedRequired(value: string, field: string, allowed: readonly string[]) {
  const cleaned = cleanRequired(value, field, 80);
  if (!allowed.includes(cleaned)) throw new Error(`${field}_not_allowed`);
  return cleaned;
}

function cleanAllowedOptional(value: string, field: string, allowed: readonly string[]) {
  const cleaned = cleanOptional(value, 80);
  if (cleaned !== null && !allowed.includes(cleaned)) throw new Error(`${field}_not_allowed`);
  return cleaned;
}

function parseDate(value: unknown) {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalString(value: unknown) {
  return value === null || typeof value === "string";
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}
