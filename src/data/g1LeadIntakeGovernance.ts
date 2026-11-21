import type { RetentionPolicy } from "@/lib/governance/localRetention";
import {
  evaluateLeadIntakeGovernance,
  type LeadIntakeContext,
  type LeadIntakeFieldInput,
  type LeadIntakePolicy,
} from "@/lib/commercial/leadIntakeGovernance";

export const g1LeadIntakeStorageKey = "g1_design_partner_leads_local_queue";

export const g1LeadEmployeeBands = [
  { value: "1_49", label: "1–49 colaboradores" },
  { value: "50_99", label: "50–99 colaboradores" },
  { value: "100_499", label: "100–499 colaboradores" },
  { value: "500_999", label: "500–999 colaboradores" },
  { value: "1000_plus", label: "1.000+ colaboradores" },
  { value: "public_sector", label: "Setor público" },
] as const;

export const g1LeadPrimaryGoals = [
  { value: "readiness", label: "Mapear prontidão e governança" },
  { value: "synthetic_demo", label: "Conhecer a demonstração sintética" },
  { value: "implementation_roadmap", label: "Planejar uma implantação futura" },
  { value: "design_partner", label: "Avaliar Design Partner sintético" },
] as const;

export const g1LeadIntakeRetentionPolicy: RetentionPolicy = {
  policyId: "g1-lead-intake-governance-2026-07-01",
  schemaVersion: 1,
  ttlDays: 30,
  maxItems: 20,
};

export const g1LeadIntakePolicy: LeadIntakePolicy = {
  policyId: g1LeadIntakeRetentionPolicy.policyId,
  targetGate: "G1",
  allowedPurposes: ["design_partner_discovery", "newsletter"],
  allowedTransports: ["local_queue"],
  maxRetentionDays: g1LeadIntakeRetentionPolicy.ttlDays,
  requireLgpdConsent: true,
  requireDpaForRemoteCrm: true,
  prohibitWorkerData: true,
  prohibitSensitiveData: true,
  prohibitFreeText: true,
  prohibitPaidPilotIntent: true,
  prohibitCampaignIntent: true,
};

export const g1LeadIntakeContext: LeadIntakeContext = {
  purpose: "design_partner_discovery",
  transport: "local_queue",
  retentionDays: g1LeadIntakeRetentionPolicy.ttlDays,
  lgpdConsentCaptured: true,
  dpaApproved: false,
  realWorkerDataCollected: false,
  sensitiveDataCollected: false,
  freeTextEnabled: false,
  paidPilotIntent: false,
  campaignIntent: false,
};

export const g1LeadIntakeFields: LeadIntakeFieldInput[] = [
  {
    key: "contact_name",
    label: "Nome do contato",
    sensitivity: "contact",
    required: true,
    collected: true,
  },
  {
    key: "work_email",
    label: "E-mail corporativo",
    sensitivity: "contact",
    required: true,
    collected: true,
  },
  {
    key: "company_name",
    label: "Empresa",
    sensitivity: "business",
    required: true,
    collected: true,
  },
  {
    key: "role",
    label: "Cargo",
    sensitivity: "business",
    required: false,
    collected: true,
  },
  {
    key: "employee_count_band",
    label: "Faixa de colaboradores",
    sensitivity: "business",
    required: true,
    collected: true,
  },
  {
    key: "primary_goal",
    label: "Objetivo comercial declarado",
    sensitivity: "business",
    required: false,
    collected: true,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    sensitivity: "optional_contact",
    required: false,
    collected: false,
  },
  {
    key: "consent_lgpd",
    label: "Consentimento LGPD",
    sensitivity: "consent",
    required: true,
    collected: true,
  },
  {
    key: "consent_email_opt_in",
    label: "Opt-in de e-mail",
    sensitivity: "consent",
    required: false,
    collected: false,
  },
  {
    key: "consent_whatsapp_opt_in",
    label: "Opt-in de WhatsApp",
    sensitivity: "consent",
    required: false,
    collected: false,
  },
];

export const g1LeadIntakeSummary = evaluateLeadIntakeGovernance(
  g1LeadIntakeFields,
  g1LeadIntakeContext,
  g1LeadIntakePolicy,
);
