import type { InstrumentVersion } from "@/lib/instruments/registry";

/**
 * Snapshot fiel da implementação recebida, não do instrumento canônico.
 * Não constitui validação científica, autorização de licença ou aprovação.
 */
export const exploratoryInstrumentDraft: InstrumentVersion = Object.freeze({
  instrumentKey: "exploratory_psychosocial_screening",
  version: "0.1.0-draft",
  status: "draft",
  locale: "pt-PT",
  jurisdiction: "unverified",
  sourceStatus: "unverified",
  primarySourceRef: null,
  licenseStatus: "unknown",
  licenseRef: null,
  itemCount: 41,
  subscaleCount: 26,
  contentSha256: null,
  scoringMode: "not_implemented",
  scoringFunctionName: null,
  runtimeReady: false,
  approvedBy: null,
  approvedAt: null,
});
