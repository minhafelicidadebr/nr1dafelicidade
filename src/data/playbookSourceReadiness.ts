import { PLAYBOOK_URL } from "@/data/driversData";
import { scientificArticles } from "@/data/scientificArticles";
import type { SourceReadinessPolicy, SourceRecordInput } from "@/lib/content/sourceReadiness";

export const playbookSourceReadinessPolicy: SourceReadinessPolicy = {
  policyId: "playbook-source-g1-2026-06-29",
  requireCanonicalPlaybook: true,
  requireUrl: true,
  requireVersion: true,
  requireHash: true,
  requireApprovedLicense: true,
  requireApprovedReview: true,
  requireClaimsReviewed: true,
};

export const playbookSourceRecords: SourceRecordInput[] = [
  {
    id: "WWP-2.0-CANONICAL",
    title: "Work Wellbeing Playbook 2.0 - fonte canonica",
    kind: "canonical_playbook",
    url: PLAYBOOK_URL,
    version: "2024-11-draft-ref",
    sha256: null,
    licenseStatus: "unknown",
    reviewStatus: "draft",
    claimsReviewed: false,
  },
  {
    id: "SCIENTIFIC-ARTICLES-CATALOG",
    title: "Catalogo de artigos cientificos por driver",
    kind: "evidence_catalog",
    url: null,
    version: "repo-snapshot-2026-06-29",
    sha256: null,
    licenseStatus: "unknown",
    reviewStatus: "needs_review",
    claimsReviewed: false,
    recordCount: scientificArticles.length,
  },
  {
    id: "NR1-PLAYBOOK-CROSSWALK",
    title: "Crosswalk NR-1/COPSOQ/Playbook",
    kind: "crosswalk",
    url: null,
    version: "2026.1-draft",
    sha256: null,
    licenseStatus: "not_applicable",
    reviewStatus: "needs_review",
    claimsReviewed: false,
  },
  {
    id: "NR1-INTERVENTIONS-LIBRARY",
    title: "Biblioteca de intervencoes NR-1/Playbook",
    kind: "intervention_library",
    url: null,
    version: "repo-snapshot-2026-06-29",
    sha256: null,
    licenseStatus: "unknown",
    reviewStatus: "needs_review",
    claimsReviewed: false,
  },
  {
    id: "AURORA-PLAYBOOK-CLAIMS",
    title: "Afirmacoes Aurora/EstrategIA baseadas em Playbook",
    kind: "assistant_claims",
    url: null,
    version: "repo-snapshot-2026-06-29",
    sha256: null,
    licenseStatus: "not_applicable",
    reviewStatus: "needs_review",
    claimsReviewed: false,
  },
];
