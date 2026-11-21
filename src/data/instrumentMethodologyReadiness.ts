import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import type {
  InstrumentMethodologyCheckInput,
  InstrumentMethodologyContext,
  InstrumentMethodologyPolicy,
} from "@/lib/instruments/methodologyReadiness";
import { evaluateInstrumentMethodologyReadiness } from "@/lib/instruments/methodologyReadiness";

export const g1InstrumentMethodologyPolicy: InstrumentMethodologyPolicy = {
  policyId: "instrument-methodology-g1-2026-06-30",
  targetGate: "G1",
  instrumentKey: exploratoryInstrumentDraft.instrumentKey,
  version: exploratoryInstrumentDraft.version,
  requireAllGateBlockingApproved: true,
  requireRuntimeDisabledUntilApproved: true,
};

export const g1InstrumentMethodologyContext: InstrumentMethodologyContext = {
  runtimeReady: exploratoryInstrumentDraft.runtimeReady,
};

export const g1InstrumentMethodologyChecks: InstrumentMethodologyCheckInput[] = [
  {
    key: "primary_source",
    label: "Fonte primaria canonica",
    area: "source",
    status: "missing",
    gateBlocking: true,
    evidenceRef: null,
    detail: "Edicao, URL/referencia controlada, hash e material aprovado ainda nao foram fornecidos.",
  },
  {
    key: "license_permission",
    label: "Licenca e permissao de uso",
    area: "license",
    status: "missing",
    gateBlocking: true,
    evidenceRef: null,
    detail: "Licenca, atribuicao, permissao de reproducao e restricoes de uso seguem desconhecidas.",
  },
  {
    key: "locale_jurisdiction",
    label: "Idioma, populacao e jurisdicao",
    area: "translation",
    status: "draft",
    gateBlocking: true,
    evidenceRef: "src/data/instrumentRegistry.ts",
    detail: "Registro atual indica pt-PT e jurisdicao nao verificada; aplicabilidade Brasil nao foi aprovada.",
  },
  {
    key: "canonical_items",
    label: "Itens canonicos e polaridade",
    area: "content",
    status: "missing",
    gateBlocking: true,
    evidenceRef: null,
    detail: "Itens, ordem, escala de resposta, reversao e dados ausentes nao possuem definicao canonica aprovada.",
  },
  {
    key: "subscale_pack",
    label: "Pacote de subescalas aprovado",
    area: "content",
    status: "missing",
    gateBlocking: true,
    evidenceRef: null,
    detail: "As 26 subescalas exigidas para G1 nao foram fornecidas, versionadas ou revisadas.",
  },
  {
    key: "scoring_spec",
    label: "Especificacao de scoring",
    area: "scoring",
    status: "missing",
    gateBlocking: true,
    evidenceRef: null,
    detail: "Formula, tratamento de ausentes, escore original, transformacoes e limites de uso nao foram aprovados.",
  },
  {
    key: "server_scoring",
    label: "Scoring server-side versionado",
    area: "scoring",
    status: "missing",
    gateBlocking: true,
    evidenceRef: "docs/INSTRUMENT_REGISTRY_G1.md",
    detail: "Funcao de scoring no servidor permanece nao implementada para este instrumento.",
  },
  {
    key: "psychometric_fixtures",
    label: "Fixtures psicometricas independentes",
    area: "fixtures",
    status: "missing",
    gateBlocking: true,
    evidenceRef: null,
    detail: "Nenhuma fixture independente com resultado esperado foi aprovada.",
  },
  {
    key: "limitations",
    label: "Limitacoes e usos proibidos",
    area: "review",
    status: "draft",
    gateBlocking: true,
    evidenceRef: "docs/G1_APPROVAL_PACKET.md",
    detail: "Limites do questionario estao descritos no pacote G1, mas ainda sem aceite disciplinar formal.",
  },
  {
    key: "independent_method_review",
    label: "Revisao metodologica independente",
    area: "review",
    status: "missing",
    gateBlocking: true,
    evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
    detail: "Responsavel metodologico/psicometrico ainda nao foi nomeado e nenhuma decisao foi registrada.",
  },
  {
    key: "runtime_block",
    label: "Runtime permanece desabilitado",
    area: "runtime",
    status: "approved",
    gateBlocking: false,
    evidenceRef: "src/data/instrumentRegistry.ts",
    detail: "A versao recebida segue runtime_ready=false e nao pode abrir campanha.",
  },
];

export const g1InstrumentMethodologySummary = evaluateInstrumentMethodologyReadiness(
  g1InstrumentMethodologyChecks,
  g1InstrumentMethodologyContext,
  g1InstrumentMethodologyPolicy,
);
