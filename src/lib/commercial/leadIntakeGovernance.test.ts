import { describe, expect, it } from "vitest";
import {
  g1LeadIntakeContext,
  g1LeadEmployeeBands,
  g1LeadIntakeFields,
  g1LeadIntakePolicy,
  g1LeadIntakeRetentionPolicy,
  g1LeadPrimaryGoals,
} from "@/data/g1LeadIntakeGovernance";
import {
  buildControlledLeadRecord,
  evaluateLeadIntakeGovernance,
  isActiveControlledLeadRecord,
  isControlledLeadRecord,
  type LeadIntakeFieldInput,
} from "./leadIntakeGovernance";

describe("G1 lead intake governance", () => {
  it("allows only controlled local B2B contact intake in G1", () => {
    const result = evaluateLeadIntakeGovernance(
      g1LeadIntakeFields,
      g1LeadIntakeContext,
      g1LeadIntakePolicy,
    );

    expect(result.status).toBe("controlled_contact_ready");
    expect(result.canCollectControlledContact).toBe(true);
    expect(result.canUseRemoteCrm).toBe(false);
    expect(result.blockers).toEqual([]);
    expect(result.readyFields).toBe(result.totalFields);
    expect(result.retentionDays).toBe(30);
  });

  it("blocks remote CRM without DPA even when the field set is safe", () => {
    const result = evaluateLeadIntakeGovernance(
      g1LeadIntakeFields,
      { ...g1LeadIntakeContext, transport: "remote_crm" },
      { ...g1LeadIntakePolicy, allowedTransports: ["local_queue", "remote_crm"] },
    );

    expect(result.status).toBe("blocked");
    expect(result.canCollectControlledContact).toBe(false);
    expect(result.canUseRemoteCrm).toBe(false);
    expect(result.blockers).toContain("remote_crm_without_dpa");
  });

  it("blocks worker, sensitive and free-text fields before any real campaign", () => {
    const fields: LeadIntakeFieldInput[] = [
      ...g1LeadIntakeFields,
      {
        key: "worker_story",
        label: "Relato livre de trabalhador",
        sensitivity: "free_text",
        required: false,
        collected: true,
      },
      {
        key: "worker_name",
        label: "Nome do trabalhador",
        sensitivity: "worker",
        required: false,
        collected: true,
      },
      {
        key: "health_signal",
        label: "Sinal de saude",
        sensitivity: "sensitive",
        required: false,
        collected: true,
      },
    ];

    const result = evaluateLeadIntakeGovernance(fields, g1LeadIntakeContext, g1LeadIntakePolicy);

    expect(result.status).toBe("blocked");
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "free_text_field_present",
        "worker_field_present",
        "sensitive_field_present",
      ]),
    );
    expect(result.blockedFields).toBe(3);
  });

  it("blocks paid pilot or worker campaign intent in the intake context", () => {
    const result = evaluateLeadIntakeGovernance(
      g1LeadIntakeFields,
      {
        ...g1LeadIntakeContext,
        paidPilotIntent: true,
        campaignIntent: true,
        realWorkerDataCollected: true,
        sensitiveDataCollected: true,
      },
      g1LeadIntakePolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.blockers).toEqual(
      expect.arrayContaining([
        "paid_pilot_intent",
        "campaign_intent",
        "worker_data_collected",
        "sensitive_data_collected",
      ]),
    );
  });

  it("blocks invalid retention windows", () => {
    const result = evaluateLeadIntakeGovernance(
      g1LeadIntakeFields,
      { ...g1LeadIntakeContext, retentionDays: 0 },
      g1LeadIntakePolicy,
    );

    expect(result.status).toBe("blocked");
    expect(result.blockers).toContain("retention_invalid");
  });

  it("builds a trimmed local queue record with explicit expiry", () => {
    const record = buildControlledLeadRecord(
      {
        form_profile_id: " short_demo_form ",
        route_id: " cta_demo ",
        contact_name: " Maria Silva ",
        work_email: " MARIA@EXAMPLE.COM ",
        company_name: " Empresa Exemplo ",
        role: " RH ",
        employee_count_band: "500_999",
        primary_goal: "design_partner",
        consent_lgpd: true,
      },
      {
        policyId: g1LeadIntakeRetentionPolicy.policyId,
        retentionDays: g1LeadIntakeRetentionPolicy.ttlDays,
        receiptId: "receipt-123",
        allowedEmployeeCountBands: g1LeadEmployeeBands.map((band) => band.value),
        allowedPrimaryGoals: g1LeadPrimaryGoals.map((goal) => goal.value),
        now: new Date("2026-07-01T12:00:00.000Z"),
      },
    );

    expect(record).toMatchObject({
      schemaVersion: 1,
      policyId: "g1-lead-intake-governance-2026-07-01",
      storageMode: "local_queue",
      status: "local_draft_not_delivered",
      receiptId: "receipt-123",
      createdAt: "2026-07-01T12:00:00.000Z",
      expiresAt: "2026-07-31T12:00:00.000Z",
      contact_name: "Maria Silva",
      work_email: "maria@example.com",
      whatsapp: null,
      consent_lgpd: true,
      consent_email_opt_in: false,
      consent_whatsapp_opt_in: false,
      utm_source: null,
      utm_campaign: null,
    });
    expect(isControlledLeadRecord(record)).toBe(true);
    expect(isActiveControlledLeadRecord(record, {
      policyId: g1LeadIntakeRetentionPolicy.policyId,
      now: new Date("2026-07-15T00:00:00.000Z"),
    })).toBe(true);
    expect(isActiveControlledLeadRecord(record, {
      policyId: g1LeadIntakeRetentionPolicy.policyId,
      now: new Date("2026-08-01T00:00:00.000Z"),
    })).toBe(false);
  });

  it("rejects invalid contact data and values outside the controlled catalog", () => {
    const payload = {
      form_profile_id: "short_demo_form",
      route_id: "cta_demo",
      contact_name: "Maria Silva",
      work_email: "email-invalido",
      company_name: "Empresa Exemplo",
      role: "RH",
      employee_count_band: "500_999",
      primary_goal: "design_partner",
      consent_lgpd: true,
    };
    const options = {
      policyId: g1LeadIntakeRetentionPolicy.policyId,
      retentionDays: g1LeadIntakeRetentionPolicy.ttlDays,
      receiptId: "receipt-456",
      allowedEmployeeCountBands: g1LeadEmployeeBands.map((band) => band.value),
      allowedPrimaryGoals: g1LeadPrimaryGoals.map((goal) => goal.value),
    };

    expect(() => buildControlledLeadRecord(payload, options)).toThrow("work_email_invalid");
    expect(() => buildControlledLeadRecord(
      { ...payload, work_email: "maria@example.com", employee_count_band: "unknown" },
      options,
    )).toThrow("employee_count_band_not_allowed");
    expect(() => buildControlledLeadRecord(
      { ...payload, work_email: "maria@example.com", primary_goal: "paid_pilot" },
      options,
    )).toThrow("primary_goal_not_allowed");
  });
});
