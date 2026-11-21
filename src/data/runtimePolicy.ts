export type DataMode = "synthetic" | "real";

/**
 * Versioned product policy for the current execution gate.
 *
 * Changing maximumAllowedDataMode to `real` is forbidden before G3 and must be
 * backed by the approvals and evidence listed in the Master Plan.
 */
export const runtimeDataPolicy = Object.freeze({
  version: "g0-2026-06-23",
  gate: "G0",
  maximumAllowedDataMode: "synthetic" as DataMode,
  realDataApprovalReference: null as string | null,
  reason:
    "No-Go para dados reais até aprovação dos gates de privacidade, ciência, SST e jurídico.",
});
