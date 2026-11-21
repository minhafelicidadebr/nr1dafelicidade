import type { RetentionPolicy } from "@/lib/governance/localRetention";

export const auroraConversationRetentionPolicy = {
  policyId: "aurora-local-history-g1-2026-06-29",
  schemaVersion: 1,
  ttlDays: 7,
  maxItems: 20,
} satisfies RetentionPolicy;

export const AURORA_RETENTION_NOTICE =
  "Historico local neste dispositivo: ate 7 dias ou 20 interacoes, com limpeza manual a qualquer momento.";
