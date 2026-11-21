import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import type {
  CanonicalInstrumentArtifactInput,
  CanonicalInstrumentIntakeContext,
  CanonicalInstrumentIntakePolicy,
} from "@/lib/instruments/canonicalIntake";
import { evaluateCanonicalInstrumentIntake } from "@/lib/instruments/canonicalIntake";

/**
 * DECISAO DE JURISDICAO E ALVO (registrada pelo solicitante em 04/07/2026)
 * ------------------------------------------------------------------------
 * - Jurisdicao oficial: BRASIL. O instrumento deve atender NR-1/NR-17
 *   (mapeamento de riscos psicossociais e insercao no PGR/GRO).
 * - Familia-alvo: COPSOQ-BR (COPSOQ II e III adaptados ao Brasil).
 * - O manual anexado (COPSOQ II, versao portuguesa pt-PT, Silva et al., 2011,
 *   FCT/Univ. de Aveiro) e usado APENAS como REFERENCIA ESTRUTURAL
 *   (3 formatos: curta/media/longa, scoring por media, tercis 2,33 e 3,66).
 *   Ele NAO e a fonte canonica brasileira e NAO pode virar "oficial" para o
 *   alvo BR: linguagem, itens e normas sao portuguesas.
 *
 * ALEGACOES AINDA NAO VERIFICADAS (nao gravadas como aprovadas):
 * - "COPSOQ II/III validados e adaptados ao Brasil": requer o documento-fonte
 *   BR (banco de itens BR, mapa de subescalas, normas brasileiras, licenca,
 *   fixtures) e revisao psicometrica independente.
 * - "Atende as exigencias da NR-1/NR-17": decisao de responsavel tecnico SST
 *   + juridico; a NR-1 nao obriga um instrumento especifico.
 *
 * Por isso os artefatos abaixo permanecem `missing`/`submitted` conforme a
 * evidencia real disponivel. Nada aqui habilita runtime, dados reais ou
 * avanco de gate.
 */

export const g1CanonicalInstrumentIntakePolicy: CanonicalInstrumentIntakePolicy = {
  policyId: "canonical-instrument-intake-g1-2026-06-30",
  targetGate: "G1",
  instrumentKey: exploratoryInstrumentDraft.instrumentKey,
  requireAllReviewArtifactsSubmitted: true,
  requireAllMethodologyArtifactsApproved: true,
  requireChecksumForReviewArtifacts: true,
  requireOwnerForReviewArtifacts: true,
  prohibitRuntimeReady: true,
  prohibitRealData: true,
  prohibitGateAdvance: true,
};

export const g1CanonicalInstrumentIntakeContext: CanonicalInstrumentIntakeContext = {
  runtimeReady: exploratoryInstrumentDraft.runtimeReady,
  realDataEnabled: false,
  gateAdvanceClaimed: false,
};

export const g1CanonicalInstrumentArtifacts: CanonicalInstrumentArtifactInput[] = [
  {
    key: "primary_source_manual",
    label: "Manual/fonte primaria canonica",
    type: "primary_source",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Alvo BR = COPSOQ-BR (II/III). Fonte canonica brasileira (manual/edicao/hash) ainda nao fornecida. O anexo pt-PT (Silva et al., 2011) e apenas referencia estrutural, nao a fonte BR.",
  },
  {
    key: "license_grant",
    label: "Licenca e permissao de uso",
    type: "license",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Licenca de uso do COPSOQ-BR (rede COPSOQ International + detentor da adaptacao BR) ainda ausente. Possuir manual nao equivale a licenca para produto comercial.",
  },
  {
    key: "item_bank",
    label: "Banco canonico de itens",
    type: "instrument_definition",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Banco de itens em pt-BR do COPSOQ-BR ainda nao recebido. O anexo pt-PT serve so de referencia estrutural; itens em pt-PT nao valem como texto oficial BR.",
  },
  {
    key: "response_scale",
    label: "Escala de resposta e ausentes",
    type: "response_scale",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Opcoes, codificacao, tratamento de ausentes e reversao nao foram especificados.",
  },
  {
    key: "subscale_map_26",
    label: "Mapa de 26 subescalas",
    type: "subscale_map",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Mapa de subescalas do COPSOQ-BR pendente. Referencia pt-PT: curta=26 subescalas/41 itens, media=29/76, longa=35/119; confirmar equivalencia na adaptacao BR.",
  },
  {
    key: "scoring_spec",
    label: "Especificacao de scoring original",
    type: "scoring_spec",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Scoring e normas do COPSOQ-BR pendentes. Referencia pt-PT: media fator-a-fator, itens invertidos (media 42/45), tercis 2,33/3,66; normas PT (N=4162) NAO valem para BR.",
  },
  {
    key: "psychometric_fixtures",
    label: "Fixtures psicometricas independentes",
    type: "fixture_pack",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: null,
    ownerAssigned: false,
    detail: "Fixtures psicometricas do COPSOQ-BR (entradas, resultados esperados, tolerancias) ausentes; exigem aprovacao do psicometrista independente a ser nomeado.",
  },
  {
    key: "usage_limitations",
    label: "Limitacoes e usos proibidos",
    type: "usage_limitations",
    status: "submitted",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: "0000000000000000000000000000000000000000000000000000000000000000",
    evidenceRef: "docs/INSTRUMENT_METHODOLOGY_READINESS_G1.md",
    ownerAssigned: true,
    detail: "Limites ja estao descritos em docs, mas ainda exigem aprovacao disciplinar formal.",
  },
  {
    key: "review_packet",
    label: "Pacote para revisao independente",
    type: "review_packet",
    status: "missing",
    requiredForReview: true,
    requiredForMethodologyGate: true,
    checksumSha256: null,
    evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
    ownerAssigned: false,
    detail: "Revisao independente pendente: psicometrista + responsavel tecnico SST externos a equipe de desenvolvimento/consultoria, a serem nomeados pelo solicitante. Sem auto-revisao.",
  },
];

export const g1CanonicalInstrumentIntakeSummary = evaluateCanonicalInstrumentIntake(
  g1CanonicalInstrumentArtifacts,
  g1CanonicalInstrumentIntakeContext,
  g1CanonicalInstrumentIntakePolicy,
);
