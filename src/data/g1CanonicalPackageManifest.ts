import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import type {
  CanonicalPackageArtifactInput,
  CanonicalPackageManifestContext,
  CanonicalPackageManifestInput,
  CanonicalPackageManifestPolicy,
} from "@/lib/instruments/canonicalPackageManifest";
import { evaluateCanonicalPackageManifest } from "@/lib/instruments/canonicalPackageManifest";

export const g1CanonicalPackageManifestPolicy: CanonicalPackageManifestPolicy = {
  policyId: "canonical-package-manifest-g1-2026-06-30",
  targetGate: "G1",
  instrumentKey: exploratoryInstrumentDraft.instrumentKey,
  requiredArtifactKeys: [
    "primary_source_manual",
    "license_grant",
    "item_bank",
    "response_scale",
    "subscale_map_26",
    "scoring_spec",
    "psychometric_fixtures",
    "usage_limitations",
    "review_packet",
  ],
  requireSemverVersion: true,
  requireHashForRequiredArtifacts: true,
  requireOwnerForRequiredArtifacts: true,
  requireAllRequiredSubmittedForReview: true,
  requireAllRequiredApprovedToSeal: true,
  prohibitRuntimeReady: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
};

export const g1CanonicalPackageManifestContext: CanonicalPackageManifestContext = {
  runtimeReady: exploratoryInstrumentDraft.runtimeReady,
  realDataEnabled: false,
  gateAdvanceClaimed: false,
};

export const g1CanonicalPackageArtifacts: CanonicalPackageArtifactInput[] = [
  {
    key: "primary_source_manual",
    label: "Manual/fonte primaria canonica",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: [],
    evidenceRef: null,
  },
  {
    key: "license_grant",
    label: "Licenca e permissao de uso",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: ["primary_source_manual"],
    evidenceRef: null,
  },
  {
    key: "item_bank",
    label: "Banco canonico de itens",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: ["primary_source_manual", "license_grant"],
    evidenceRef: null,
  },
  {
    key: "response_scale",
    label: "Escala de resposta e ausentes",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: ["item_bank"],
    evidenceRef: null,
  },
  {
    key: "subscale_map_26",
    label: "Mapa de 26 subescalas",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: ["item_bank"],
    evidenceRef: null,
  },
  {
    key: "scoring_spec",
    label: "Especificacao de scoring original",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: ["item_bank", "response_scale", "subscale_map_26"],
    evidenceRef: null,
  },
  {
    key: "psychometric_fixtures",
    label: "Fixtures psicometricas independentes",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: ["scoring_spec"],
    evidenceRef: null,
  },
  {
    key: "usage_limitations",
    label: "Limitacoes e usos proibidos",
    status: "submitted",
    sha256: null,
    ownerRole: "product_governance",
    required: true,
    dependsOn: ["primary_source_manual", "license_grant"],
    evidenceRef: "docs/INSTRUMENT_METHODOLOGY_READINESS_G1.md",
  },
  {
    key: "review_packet",
    label: "Pacote para revisao independente",
    status: "missing",
    sha256: null,
    ownerRole: null,
    required: true,
    dependsOn: [
      "primary_source_manual",
      "license_grant",
      "item_bank",
      "response_scale",
      "subscale_map_26",
      "scoring_spec",
      "psychometric_fixtures",
      "usage_limitations",
    ],
    evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
  },
];

export const g1CanonicalPackageManifest: CanonicalPackageManifestInput = {
  manifestId: "g1-canonical-instrument-package",
  instrumentKey: exploratoryInstrumentDraft.instrumentKey,
  version: exploratoryInstrumentDraft.version,
  artifacts: g1CanonicalPackageArtifacts,
};

export const g1CanonicalPackageManifestSummary = evaluateCanonicalPackageManifest(
  g1CanonicalPackageManifest,
  g1CanonicalPackageManifestContext,
  g1CanonicalPackageManifestPolicy,
);
