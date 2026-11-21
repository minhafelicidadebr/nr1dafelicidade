import type {
  CommitteeSubmissionCriterion,
  CommitteeSubmissionEvidenceMap,
  CommitteeSubmissionPolicy,
} from "@/lib/governance/committeeSubmission";

export const g2CommitteeSubmissionPolicy: CommitteeSubmissionPolicy = {
  policyId: "g2-committee-submission-g1-2026-06-30",
  targetGate: "G2",
  requireAllGateBlocking: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
};

export const g2CommitteeSubmissionCriteria: CommitteeSubmissionCriterion[] = [
  {
    key: "actions_18_23_local_evidence",
    label: "Acoes 18-23 com evidencia local",
    category: "technical",
    gateBlocking: true,
    evidenceRef: "docs/IMPLEMENTATION_STATUS.md",
  },
  {
    key: "g1_formal_approval",
    label: "G1 formalmente aprovado",
    category: "gate",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
  },
  {
    key: "accountables_named",
    label: "Responsaveis obrigatorios nomeados",
    category: "accountability",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
  },
  {
    key: "instrument_sources_approved",
    label: "Fontes, licenca e instrumento aprovados",
    category: "methodology",
    gateBlocking: true,
    evidenceRef: "docs/INSTRUMENT_REGISTRY_G1.md",
  },
  {
    key: "psychometric_fixtures_approved",
    label: "Fixtures psicometricas independentes aprovadas",
    category: "methodology",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
  },
  {
    key: "independent_reviews_complete",
    label: "Revisoes independentes completas",
    category: "accountability",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
  },
  {
    key: "github_lovable_official_green",
    label: "GitHub/Lovable oficiais comprovados",
    category: "technical",
    gateBlocking: true,
    evidenceRef: "docs/GITHUB_LOVABLE_SYNC_HANDOFF.md",
  },
  {
    key: "worker_cipa_validation",
    label: "Validacao de trabalhadores/CIPA",
    category: "operation",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
  },
  {
    key: "legal_privacy_decisions",
    label: "Decisoes LGPD/juridico aprovadas",
    category: "accountability",
    gateBlocking: true,
    evidenceRef: "docs/DATA_GOVERNANCE_G1.md",
  },
  {
    key: "incident_dr_exercise",
    label: "Incidente e recuperacao exercitados",
    category: "operation",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
  },
  {
    key: "committee_agenda_packet",
    label: "Pauta e pacote de comite preparados",
    category: "gate",
    gateBlocking: true,
    evidenceRef: "docs/G2_COMMITTEE_SUBMISSION_READINESS.md",
  },
  {
    key: "real_data_no_go",
    label: "Dados reais continuam No-Go",
    category: "gate",
    gateBlocking: true,
    evidenceRef: "docs/PROJECT_CONSTITUTION.md",
  },
  {
    key: "no_gate_advance_claimed",
    label: "Nenhum avanco de gate declarado",
    category: "gate",
    gateBlocking: true,
    evidenceRef: "docs/PROJECT_CONSTITUTION.md",
  },
];

export const localG2CommitteeSubmissionEvidence: CommitteeSubmissionEvidenceMap = {
  actions_18_23_local_evidence: {
    ok: true,
    detail: "AEP, AET, Criteria Engine, controles, fontes, acoes e jornada sintetica possuem evidencias locais; validacoes formais seguem pendentes.",
  },
  g1_formal_approval: {
    ok: false,
    detail: "G1 segue em No-Go no pacote de aceite.",
  },
  accountables_named: {
    ok: false,
    detail: "Responsaveis obrigatorios ainda constam como pendentes.",
  },
  instrument_sources_approved: {
    ok: false,
    detail: "Fonte canonica, licenca, hash, subescalas, scoring, fixtures e aprovacao metodologica continuam pendentes.",
  },
  psychometric_fixtures_approved: {
    ok: false,
    detail: "Fixtures independentes de referencia ainda nao foram fornecidas.",
  },
  independent_reviews_complete: {
    ok: false,
    detail: "Revisoes SST, ergonomia, metodologia, DPO/juridico e seguranca ainda nao foram registradas.",
  },
  github_lovable_official_green: {
    ok: false,
    detail: "Baseline publicado com CI oficial e receipt Lovable pontual; branch protection ainda não comprovada, e o atestado não representa o HEAD atual.",
  },
  worker_cipa_validation: {
    ok: false,
    detail: "Validacao efetiva de trabalhadores/CIPA ainda nao registrada.",
  },
  legal_privacy_decisions: {
    ok: false,
    detail: "Decisoes legais de finalidade, base legal, retencao, descarte e incidente ainda pendentes.",
  },
  incident_dr_exercise: {
    ok: false,
    detail: "Runbook, incidente e disaster recovery ainda nao exercitados formalmente.",
  },
  committee_agenda_packet: {
    ok: false,
    detail: "Esta fatia cria a prontidao, mas a pauta/ata do comite ainda nao foi emitida por responsavel formal.",
  },
  real_data_no_go: {
    ok: true,
    detail: "Dados reais, trabalhadores reais e campanhas reais permanecem proibidos.",
  },
  no_gate_advance_claimed: {
    ok: true,
    detail: "Nenhum gate foi avancado por esta evidencia local.",
  },
};
