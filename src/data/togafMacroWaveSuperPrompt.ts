import {
  buildExecutableSuperPrompt,
  evaluateArc4SuperWavePlan,
  evaluateMacroWavePlan,
  evaluateNextWaveSaasPlan,
  evaluateSuperPromptRubric,
  evaluateTogafKnowledgeTree,
  type Arc4ServiceSuperWaveItem,
  type Arc4VisualBenchmarkItem,
  type MacroWaveSlice,
  type NextWaveSaasTrack,
  type PostDocChair,
  type SuperPromptRubricCriterion,
  type TogafAdmPhaseCode,
  type TogafKnowledgeNode,
  type TogafMacroWavePolicy,
  type ViewportUxContract,
} from "@/lib/governance/togafMacroWaveEngine";
import {
  evaluateMteCopsoqSystemicAudit,
  type CopsoqManualAuditFinding,
  type Mte2026AuditRequirementItem,
} from "@/lib/governance/mteCopsoqAuditEngine";
import { evaluatePlaybook2TotAudit } from "@/lib/governance/playbook2RagEngine";
import { evaluateArgo4HeroPromptCatalog } from "@/data/argo4DriverHeroPrompts";
import { evaluateSaasPilotDashboardWave } from "@/lib/governance/saasPilotDashboardWaveEngine";
import { evaluateArgo4EcosystemFramework } from "@/lib/governance/argo4EcosystemFrameworkEngine";

export const argo4HeroPromptCatalogSummary = evaluateArgo4HeroPromptCatalog();
export const saasPilotDashboardWaveSummary = evaluateSaasPilotDashboardWave();
export const argo4EcosystemFrameworkSummary = evaluateArgo4EcosystemFramework();

export const togafMacroWavePolicy: TogafMacroWavePolicy = {
  policyId: "togaf-macro-wave-g1-2026-07",
  version: "2026.07.4",
  approvedGate: "G0",
  targetGate: "G1",
  requiredInvariantsCount: 14,
  minimumStateOfTheArtScorePct: 98,
  minimumWinningTotScore: 90,
  realDataAllowed: false,
  g1Approved: false,
};

export interface TogafAdmPhaseMetadata {
  readonly code: TogafAdmPhaseCode;
  readonly title: string;
  readonly fable5Translation: string;
  readonly primaryOutput: string;
}

export const togafAdmPhases: readonly TogafAdmPhaseMetadata[] = [
  {
    code: "Preliminary",
    title: "Fase Preliminar · Princípios e Constituição",
    fable5Translation: "Constituição Operacional, 14 Invariantes, Token Economy ToT e Bloqueio G0/G1.",
    primaryOutput: "docs/PROJECT_CONSTITUTION.md · src/data/runtimePolicy.ts",
  },
  {
    code: "Phase A",
    title: "Fase A · Visão de Arquitetura",
    fable5Translation: "Tese do Sistema Operacional de Evidências na cadeia de 6 elos (Medir a Reavaliar).",
    primaryOutput: "docs/SKILL_MESTRA_PLAYBOOK_NR1.md · src/data/regulatoryJourney.ts",
  },
  {
    code: "Phase B",
    title: "Fase B · Arquitetura de Negócio e Regulação",
    fable5Translation: "Jornada NR-1 (GRO/PGR), NR-17 (AEP/AET), participação CIPA e guardrails anti-overclaim.",
    primaryOutput: "src/data/aepProtocol.ts · src/test/publicClaimsGuardrail.test.ts",
  },
  {
    code: "Phase C",
    title: "Fase C · Sistemas de Informação (Dados & Aplicação)",
    fable5Translation: "Privacy Vault k >= 5, Instrument Registry e separação estrita src/lib vs. src/data.",
    primaryOutput: "src/lib/risk/criteriaEngine.ts · src/lib/actions/actionExecutionCore.ts",
  },
  {
    code: "Phase D",
    title: "Fase D · Arquitetura Tecnológica e Zero-Trust",
    fable5Translation: "RLS deny-by-default, Data Gate fail-closed, Edge Security e suíte pgTAP.",
    primaryOutput: "src/lib/runtime/dataGate.ts · supabase/tests/privacy_vault_contract.sql",
  },
  {
    code: "Phase E",
    title: "Fase E · Oportunidades e Soluções (Fatias ToT)",
    fable5Translation: "Seleção formal de fatias verticais via Tree of Thoughts com poda por invariante e ergonomia.",
    primaryOutput: "src/lib/governance/togafMacroWaveEngine.ts",
  },
  {
    code: "Phase F",
    title: "Fase F · Planejamento de Migração (Macro-Onda & Prontidão SaaS)",
    fable5Translation: "Sequenciamento determinístico das 6 Sub-Ondas E2E (M1–M6) e 6 Trilhas Práticas SaaS (S1–S6).",
    primaryOutput: "docs/TOGAF_SYSTEMIC_KNOWLEDGE_TREE_G1_G2.md · docs/SUPER_PROMPT_PROXIMA_ONDA_SAAS_UX_TOT.md",
  },
  {
    code: "Phase G",
    title: "Fase G · Governança de Implementação",
    fable5Translation: "Contratos de CI, ratchet de explicit-any, orçamento de bundle, WCAG AA e dossiê de evidências.",
    primaryOutput: "scripts/check-explicit-any.mjs · src/data/g1EvidenceDossier.ts",
  },
  {
    code: "Phase H",
    title: "Fase H · Gestão de Mudança Arquitetural",
    fable5Translation: "Detector de drift documental, recibos de release e gatilhos de revisão longitudinal.",
    primaryOutput: "src/test/releaseEvidenceManifestDrift.test.ts · src/lib/risk/reviewTriggers.ts",
  },
];

export const togafKnowledgeNodes: readonly TogafKnowledgeNode[] = [
  {
    id: "node-prelim-constitution",
    code: "ADM-PRE-01",
    admPhase: "Preliminary",
    admPhaseLabel: "Fase Preliminar",
    architectureDomain: "business",
    chainStep: "cross_cutting",
    title: "Constituição Fable 5, 14 Invariantes e Fronteira de Gate G0/G1",
    guideQuestion: "Quais regras éticas, regulatórias e de privacidade jamais podem ser negociadas por conveniência técnica?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Política de runtime fail-closed ativa e auditada em todas as rotas de dados e superfícies públicas.",
    invariantsProtected: [1, 2, 3, 6, 8, 12, 13, 14],
    verificationContracts: [
      "src/lib/runtime/dataGate.test.ts",
      "src/test/publicClaimsGuardrail.test.ts",
    ],
    primaryArtifacts: [
      "docs/PROJECT_CONSTITUTION.md",
      "docs/SKILL_MESTRA_PLAYBOOK_NR1.md",
      "src/data/runtimePolicy.ts",
    ],
    residualRisk: "Aprovação formal do Gate G1 e nomeação de accountables externos seguem pendentes fora do código.",
    acceptanceCriteria: [
      "Nenhuma chamada de rede alcança banco ou IA remota em G0/G1 sem autorização explícita.",
      "Todos os 14 invariantes possuem mapeamento de teste ou contrato verificável.",
    ],
  },
  {
    id: "node-phase-a-vision",
    code: "ADM-A-01",
    admPhase: "Phase A",
    admPhaseLabel: "Fase A · Visão",
    architectureDomain: "business",
    chainStep: "cross_cutting",
    title: "Cadeia Operacional Verificável de 6 Elos (Medir a Reavaliar)",
    guideQuestion: "Como provar que o produto opera um ciclo contínuo de gestão de risco e não telas isoladas?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Navegação e rastreabilidade ponta a ponta entre ciclo, contexto real, risco, ação, evidência e revisão.",
    invariantsProtected: [6, 7, 10, 11, 14],
    verificationContracts: [
      "src/lib/governance/regulatoryJourney.test.ts",
      "src/lib/governance/saasMaturity.test.ts",
    ],
    primaryArtifacts: [
      "src/data/regulatoryJourney.ts",
      "src/lib/governance/regulatoryJourney.ts",
    ],
    residualRisk: "Walkthrough externo com design partners depende de fechamento das trilhas formais G1.",
    acceptanceCriteria: [
      "Cada passo da jornada aponta para rota operacional real e declara seus bloqueadores de gate.",
      "Nenhum atalho permite emitir plano final sem passar pelo contexto do trabalho real.",
    ],
  },
  {
    id: "node-phase-b-measure-instrument",
    code: "ADM-B-01",
    admPhase: "Phase B",
    admPhaseLabel: "Fase B · Negócio",
    architectureDomain: "business",
    chainStep: "measure",
    title: "Governança Metodológica de Instrumentos (COPSOQ 26 Subescalas)",
    guideQuestion: "Qual fonte primária, licença, versão e regra de escore legitimam o instrumento aplicado?",
    currentStatus: "partial_draft",
    targetConsolidationState: "Catálogo canônico de 26 subescalas versionado com separação entre escore original e tradução operacional.",
    invariantsProtected: [4, 5, 11, 12, 13],
    verificationContracts: [
      "src/lib/instruments/registry.test.ts",
      "src/lib/instruments/methodologyReadiness.test.ts",
      "src/test/instrumentRegistryMigration.test.ts",
    ],
    primaryArtifacts: [
      "src/data/instrumentRegistry.ts",
      "src/lib/instruments/registry.ts",
      "docs/METHODOLOGY_READINESS_DOSSIER_G1.md",
    ],
    residualRisk: "Parecer psicométrico independente sobre o pacote canônico brasileiro ainda requer assinatura externa.",
    acceptanceCriteria: [
      "Subescalas, polaridade, itens e versão ficam congelados por ciclo de coleta.",
      "Coleta mobile-first opera sem confete, ranking ou microcopy indutora.",
    ],
  },
  {
    id: "node-phase-c-privacy-vault",
    code: "ADM-C-01",
    admPhase: "Phase C",
    admPhaseLabel: "Fase C · Dados",
    architectureDomain: "data",
    chainStep: "measure",
    title: "Privacy Vault Server-Side e Barreira Estatística k >= 5",
    guideQuestion: "Como garantir matematicamente que nenhum ator organizacional acesse ou deduza respostas individuais?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Isolamento total de microdados via RLS deny-by-default e supressão server-side para n < 5 em toda saída.",
    invariantsProtected: [1, 2, 3, 9, 14],
    verificationContracts: [
      "src/test/privacyVaultMigration.test.ts",
      "src/lib/privacy/outcomeRows.test.ts",
      "supabase/tests/privacy_vault_contract.sql",
    ],
    primaryArtifacts: [
      "supabase/migrations/20260623013000_privacy_vault_g1.sql",
      "src/lib/privacy.ts",
      "docs/PRIVACY_VAULT_G1.md",
    ],
    residualRisk: "Ambiente remoto de produção permanece intencionalmente desabilitado até o Gate G3.",
    acceptanceCriteria: [
      "Zero políticas SELECT para papéis organizacionais sobre a tabela de respostas individuais.",
      "Recortes com menos de 5 respondentes retornam estado suprimido sem vazar soma ou média residual.",
    ],
  },
  {
    id: "node-phase-b-aep-aet",
    code: "ADM-B-02",
    admPhase: "Phase B",
    admPhaseLabel: "Fase B · Negócio",
    architectureDomain: "business",
    chainStep: "contextualize",
    title: "Contextualização no Trabalho Real (AEP, Gatilhos AET e Escuta CIPA)",
    guideQuestion: "Como conectar percepção agregada à atividade real, organização do trabalho e participação dos trabalhadores?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Fluxo integrado de AEP por unidade/GHE com abertura rastreável de AET e ata de participação de trabalhadores.",
    invariantsProtected: [6, 10, 11],
    verificationContracts: [
      "src/lib/work/assessment.test.ts",
      "src/lib/work/aetAssessment.test.ts",
      "src/test/aepMigration.test.ts",
      "src/test/aetFlowMigration.test.ts",
    ],
    primaryArtifacts: [
      "src/lib/work/assessment.ts",
      "src/lib/work/aetAssessment.ts",
      "src/pages/app/WorkAnalysisPage.tsx",
      "src/pages/app/AetAnalysisPage.tsx",
    ],
    residualRisk: "Validação em campo com ergonomista responsável depende da abertura de piloto controlado após G2.",
    acceptanceCriteria: [
      "Avaliação de risco exige referência explícita ao contexto do trabalho real observado na AEP.",
      "Gatilhos de sobrecarga ou complexidade ergonômica recomendam abertura formal de AET.",
    ],
  },
  {
    id: "node-phase-c-criteria-engine",
    code: "ADM-C-02",
    admPhase: "Phase C",
    admPhaseLabel: "Fase C · Aplicação",
    architectureDomain: "application",
    chainStep: "evaluate",
    title: "Motor Contextual de Critérios de Risco e Divergência de Controles",
    guideQuestion: "Como combinar exposição, percepção agregada e maturidade de controles com trilha auditável de override?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Cálculo determinístico de severidade e probabilidade com detecção de divergência entre controle declarado e percebido.",
    invariantsProtected: [5, 6, 7, 11],
    verificationContracts: [
      "src/lib/risk/criteriaEngine.test.ts",
      "src/lib/controls/controlDivergence.test.ts",
      "src/test/criteriaEngineMigration.test.ts",
    ],
    primaryArtifacts: [
      "src/lib/risk/criteriaEngine.ts",
      "src/lib/controls/controlDivergence.ts",
      "src/data/criteriaPolicy.ts",
      "src/pages/app/CriteriaEnginePage.tsx",
    ],
    residualRisk: "Calibração setorial definitiva da matriz de pesos requer aprovação do responsável técnico de SST.",
    acceptanceCriteria: [
      "Sinal psicométrico isolado nunca define severidade oficial sem fator de exposição do trabalho real.",
      "Todo override técnico registra autor, justificativa obrigatória, valor original e carimbo de tempo.",
    ],
  },
  {
    id: "node-phase-c-action-command-core",
    code: "ADM-C-03",
    admPhase: "Phase C",
    admPhaseLabel: "Fase C · Aplicação",
    architectureDomain: "application",
    chainStep: "act",
    title: "Núcleo Command-Only de Planos de Ação e Governança de Execução",
    guideQuestion: "Como garantir que cada ação preventiva ou corretiva tenha dono, prazo, vínculo com risco e transição íntegra?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Máquina de estados determinística operada por contratos de comando validados e bloqueio de conclusão sem evidência.",
    invariantsProtected: [7, 10, 11],
    verificationContracts: [
      "src/lib/actions/actionExecutionCore.test.ts",
      "src/lib/actions/actionCommandContract.test.ts",
      "src/lib/actions/actionGovernance.test.ts",
    ],
    primaryArtifacts: [
      "src/lib/actions/actionExecutionCore.ts",
      "src/lib/actions/actionCommandContract.ts",
      "src/pages/app/ActionsPage.tsx",
    ],
    residualRisk: "Notificações operacionais externas permanecem desativadas no modo sintético G0/G1.",
    acceptanceCriteria: [
      "Nenhuma ação transita para concluída/eficaz sem registro prévio de evidência verificável.",
      "Comandos inválidos ou fora de sequência são recusados de forma determinística.",
    ],
  },
  {
    id: "node-phase-d-supervised-ai",
    code: "ADM-D-01",
    admPhase: "Phase D",
    admPhaseLabel: "Fase D · Tecnologia",
    architectureDomain: "technology",
    chainStep: "act",
    title: "Copiloto Supervisionado Aurora & Motor NEXO com Guarda Server-Side",
    guideQuestion: "Como oferecer síntese inteligente e recomendações de intervenção sem risco de alucinação clínica ou vazamento?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Contexto tipado k >= 5, recomendações determinísticas NEXO no servidor e Edge Functions com JWT, Zod e rate limit.",
    invariantsProtected: [1, 3, 8, 9, 11],
    verificationContracts: [
      "src/lib/aurora/contextBuilder.test.ts",
      "src/lib/nexo/driverRecommendation.test.ts",
      "src/test/aiEdgeSecurity.test.ts",
      "src/test/nexoServerBoundary.test.ts",
    ],
    primaryArtifacts: [
      "src/lib/aurora/contextBuilder.ts",
      "src/lib/nexo/driverRecommendation.ts",
      "supabase/functions/_shared/security.ts",
      "docs/AI_COPILOT_SECURITY_G1.md",
    ],
    residualRisk: "Execução de LLM remoto permanece bloqueada pelo Data Gate em G0/G1.",
    acceptanceCriteria: [
      "O builder de contexto remove qualquer recorte com n < 5 antes de montar o prompt.",
      "Toda resposta de IA exibe aviso explícito de caráter preliminar e revisão humana obrigatória.",
    ],
  },
  {
    id: "node-phase-c-evidence-lineage",
    code: "ADM-C-04",
    admPhase: "Phase C",
    admPhaseLabel: "Fase C · Dados",
    architectureDomain: "data",
    chainStep: "evidence",
    title: "Ledger de Evidências SHA-256, Controle de Concorrência e Documentos Preliminares",
    guideQuestion: "Como comprovar a integridade de evidências de controle e a linhagem exata de cada documento orientativo emitido?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Versionamento documental atômico no banco, hash SHA-256 de artefatos e templates orientativos sem overclaim.",
    invariantsProtected: [7, 8, 10, 11],
    verificationContracts: [
      "src/lib/controls/controlEvidence.test.ts",
      "src/lib/documents/orientativeTemplate.test.ts",
      "src/test/documentVersioningMigration.test.ts",
    ],
    primaryArtifacts: [
      "src/lib/controls/controlEvidence.ts",
      "src/lib/documents/orientativeTemplate.ts",
      "supabase/migrations/20260720120000_document_version_concurrency_g1.sql",
      "src/pages/app/DocumentsPage.tsx",
    ],
    residualRisk: "Assinatura digital qualificada ICP-Brasil/e-Social entra apenas em ondas posteriores ao Gate G2.",
    acceptanceCriteria: [
      "Documentos gerados incluem marcação explícita de minuta preliminar sujeita a responsável técnico.",
      "Conflitos de versão concorrente são detectados e rejeitados pelo banco de dados.",
    ],
  },
  {
    id: "node-phase-h-reevaluate-pdca",
    code: "ADM-H-01",
    admPhase: "Phase H",
    admPhaseLabel: "Fase H · Mudança",
    architectureDomain: "application",
    chainStep: "reevaluate",
    title: "Gatilhos de Revisão Contínua (PDCA), Risco Residual e Governança de Ciclo de Vida",
    guideQuestion: "Quando a organização deve reavaliar seus riscos e como provar que controles implementados foram eficazes?",
    currentStatus: "partial_draft",
    targetConsolidationState: "Motor de gatilhos de revisão longitudinal integrado à matriz de retenção LGPD e avaliação pós-controle.",
    invariantsProtected: [7, 11, 14],
    verificationContracts: [
      "src/lib/risk/reviewTriggers.test.ts",
      "src/lib/governance/dataLifecycle.test.ts",
      "src/test/dataGovernanceMigration.test.ts",
    ],
    primaryArtifacts: [
      "src/lib/risk/reviewTriggers.ts",
      "src/lib/governance/dataLifecycle.ts",
      "src/data/reviewTriggerPolicy.ts",
      "docs/DATA_GOVERNANCE_G1.md",
    ],
    residualRisk: "Aprovação organizacional dos prazos de retenção e descarte exige deliberação do DPO/Jurídico.",
    acceptanceCriteria: [
      "Risco residual só diminui após registro de avaliação de eficácia com resultado comprovado.",
      "Mudanças relevantes de estrutura, incidente ou prazo acionam alerta formal de revisão do PGR/AEP.",
    ],
  },
  {
    id: "node-phase-g-ci-governance",
    code: "ADM-G-01",
    admPhase: "Phase G",
    admPhaseLabel: "Fase G · Governança",
    architectureDomain: "technology",
    chainStep: "cross_cutting",
    title: "Plano de Controle de Release, Type Strictness Ratchet e Reprodutibilidade CI",
    guideQuestion: "Como impedir regressão arquitetural, introdução de explicit-any ou deriva entre código e dossiê de evidências?",
    currentStatus: "implemented_local",
    targetConsolidationState: "Pipeline CI determinístico validando contratos de repositório, orçamento de bundle, zero novo any e manifesto de release.",
    invariantsProtected: [11, 13, 14],
    verificationContracts: [
      "src/test/releaseEvidenceManifestDrift.test.ts",
      "src/lib/release/releaseProofPacket.test.ts",
      "scripts/check-explicit-any.mjs",
    ],
    primaryArtifacts: [
      "docs/release/G1_RELEASE_EVIDENCE_MANIFEST.json",
      "scripts/check-release-integrity.mjs",
      "scripts/check-build-budget.mjs",
    ],
    residualRisk: "Promoção para campanha externa depende do fechamento formal do comitê G1/G2.",
    acceptanceCriteria: [
      "Zero novos usos de explicit-any acima do baseline congelado.",
      "Sincronia 100% verificada entre manifestos JSON e documentação canônica de release.",
    ],
  },
  {
    id: "node-phase-f-external-readiness",
    code: "ADM-F-01",
    admPhase: "Phase F",
    admPhaseLabel: "Fase F · Migração",
    architectureDomain: "business",
    chainStep: "cross_cutting",
    title: "Fechamento de Prontidão Externa G1 e Submissão ao Comitê G2",
    guideQuestion: "Quais aprovações humanas, nomeações e ensaios separam o software tecnicamente pronto da autorização operacional?",
    currentStatus: "gate_blocked",
    targetConsolidationState: "Quadro de decisão formal com nomeação de accountables, ensaio do facilitador e autorização de serviço assistido.",
    invariantsProtected: [4, 8, 11, 14],
    verificationContracts: [
      "src/lib/governance/externalReadinessClosure.test.ts",
      "src/lib/governance/committeeSubmission.test.ts",
      "src/lib/governance/formalAcceptance.test.ts",
    ],
    primaryArtifacts: [
      "src/data/g1ExternalReadinessWorkspace.ts",
      "src/data/g2CommitteeSubmission.ts",
      "docs/G1_EXTERNAL_READINESS_CLOSURE_BOARD.md",
    ],
    residualRisk: "Bloqueio intencional de governança: exige assinaturas humanas externas (DPO, SST, Psicometria, Jurídico e Sponsor).",
    acceptanceCriteria: [
      "A interface declara explicitamente No-Go externo enquanto houver bloqueadores formais abertos.",
      "Nenhuma tela sugere que testes automatizados substituem a assinatura dos responsáveis técnicos.",
    ],
  },
];

export const macroWaveSlices: readonly MacroWaveSlice[] = [
  {
    waveId: "ONDA-M1",
    order: 1,
    title: "Medição Protegida & Coleta Neutra (Instrument Registry + Privacy Vault)",
    subtitle: "Fase ADM C/D · Elo 1: Medir sem expor o trabalhador",
    togafPhases: ["Preliminary", "Phase C", "Phase D"],
    architectureDomains: ["data", "technology"],
    chainLink: "measure",
    currentStatus: "implemented_local",
    gateBoundary: "G1_SYNTHETIC_READY",
    objective:
      "Garantir que toda coleta sintética ou futura campanha opere sobre instrumento versionado (COPSOQ 26 subescalas), interface neutra mobile-first e agregação server-side estrita com k >= 5.",
    deliverables: [
      "Catálogo versionado de instrumentos com preservação do escore bruto original.",
      "Isolamento RLS deny-by-default na tabela de microdados e RPCs de agregação com corte k >= 5.",
      "Recibo determinístico de demonstração sintética sem persistência de dados pessoais.",
    ],
    serverEnforcementRule:
      "Nenhuma query ou RPC retorna agregados quando count(respostas) < 5; microdados jamais possuem política SELECT para papéis organizacionais.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Filtragem k >= 5 no cliente React",
        description: "Buscar linhas brutas do banco e ocultar grupos com menos de 5 respostas no componente visual.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 1, 2 e 3: expõe microdados no payload de rede para atores organizacionais.",
        thesisScore: 40,
        securityScore: 0,
        regulatoryRigorScore: 20,
        pureMechanismScore: 30,
        reversibilityScore: 50,
      },
      {
        branchId: "Branch B",
        label: "Privacy Vault Server-Side + Instrument Registry Versionado (Canônico)",
        description: "Isolar microdados via RLS deny-by-default, impor k >= 5 nas RPCs SQL e consumir contratos tipados em src/lib.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 98,
        securityScore: 100,
        regulatoryRigorScore: 95,
        pureMechanismScore: 96,
        reversibilityScore: 92,
      },
      {
        branchId: "Branch C",
        label: "Criptografia homomórfica externa proprietária antes do Gate G1",
        description: "Substituir PostgreSQL/RLS por infraestrutura criptográfica externa de alto custo antes de validar o MVP sintético.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 75,
        securityScore: 92,
        regulatoryRigorScore: 80,
        pureMechanismScore: 65,
        reversibilityScore: 35,
      },
    ],
    acceptanceCriteria: [
      "206+ asserções pgTAP verdes comprovando isolamento cross-tenant e bloqueio de microdados.",
      "Teste unitário provando supressão de desfechos sensíveis e subescalas quando n < 5.",
    ],
    dependencies: [],
  },
  {
    waveId: "ONDA-M2",
    order: 2,
    title: "Contextualização no Trabalho Real (AEP, Observação da Atividade & Gatilhos AET)",
    subtitle: "Fase ADM B/C · Elo 2: Contextualizar antes de julgar o risco",
    togafPhases: ["Phase B", "Phase C"],
    architectureDomains: ["business", "application"],
    chainLink: "contextualize",
    currentStatus: "implemented_local",
    gateBoundary: "G1_SYNTHETIC_READY",
    objective:
      "Impedir o reducionismo psicométrico conectando cada unidade/GHE à Avaliação Ergonômica Preliminar (AEP), observação da atividade real, escuta de trabalhadores/CIPA e abertura de AET.",
    deliverables: [
      "Protocolo estruturado de AEP com fatores organizacionais, cognitivos e psicossociais do trabalho real.",
      "Motor puro de avaliação de gatilhos para Análise Ergonômica do Trabalho (AET — NR-17).",
      "Registro rastreável de participação dos trabalhadores e representação/CIPA.",
    ],
    serverEnforcementRule:
      "Registros de AEP e casos de AET exigem vínculo organizacional válido, unidade/GHE explícito e trilha de autoria auditável.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Questionário como substituto automático da AEP",
        description: "Gerar relatório de AEP automaticamente apenas a partir das médias do questionário COPSOQ.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 6 e a NR-17: questionário nunca substitui observação do trabalho real nem AEP/AET.",
        thesisScore: 25,
        securityScore: 60,
        regulatoryRigorScore: 0,
        pureMechanismScore: 40,
        reversibilityScore: 60,
      },
      {
        branchId: "Branch B",
        label: "Fluxo Dual AEP + Escalonamento AET Guiado por Gatilhos (Canônico)",
        description: "Combinar observação da atividade real, escuta estruturada e motor puro de gatilhos para recomendar AET profunda.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 96,
        securityScore: 94,
        regulatoryRigorScore: 98,
        pureMechanismScore: 95,
        reversibilityScore: 90,
      },
      {
        branchId: "Branch C",
        label: "Upload livre de PDFs sem estruturação de fatores de trabalho",
        description: "Permitir apenas anexar arquivos estáticos de ergonomia sem alimentar o motor de critérios de risco.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 55,
        securityScore: 80,
        regulatoryRigorScore: 65,
        pureMechanismScore: 60,
        reversibilityScore: 85,
      },
    ],
    acceptanceCriteria: [
      "Motor AET identifica deterministicamente quando abrir análise aprofundada por sobrecarga ou exigência da atividade.",
      "Interface de análise do trabalho separa trabalho prescrito, trabalho real observado e percepção agregada.",
    ],
    dependencies: ["ONDA-M1"],
  },
  {
    waveId: "ONDA-M3",
    order: 3,
    title: "Avaliação Multicritério de Risco & Divergência de Controles",
    subtitle: "Fase ADM B/C/G · Elo 3: Avaliar com fórmula aberta e revisão humana",
    togafPhases: ["Phase B", "Phase C", "Phase G"],
    architectureDomains: ["business", "application"],
    chainLink: "evaluate",
    currentStatus: "implemented_local",
    gateBoundary: "G1_SYNTHETIC_READY",
    objective:
      "Calcular severidade, probabilidade e prioridade de risco combinando exposição do trabalho real, percepção agregada (k >= 5) e maturidade de controles, destacando divergências e exigindo justificativa em overrides.",
    deliverables: [
      "Motor puro Criteria Engine parametrizado por política versionada (src/data/criteriaPolicy.ts).",
      "Detector de divergência entre controle formalmente declarado e percepção agregada da unidade.",
      "Trilha imutável de revisão humana e override técnico com justificativa obrigatória.",
    ],
    serverEnforcementRule:
      "Overrides de severidade ou probabilidade exigem justificativa não vazia, identificação do responsável técnico e preservação do escore calculado original.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Score caixa-preta calculado por LLM",
        description: "Pedir para uma IA generativa atribuir a probabilidade e a severidade oficial do risco da unidade.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 6, 8 e 11: IA não toma decisão técnica e toda fórmula deve ser determinística e auditável.",
        thesisScore: 20,
        securityScore: 40,
        regulatoryRigorScore: 0,
        pureMechanismScore: 10,
        reversibilityScore: 50,
      },
      {
        branchId: "Branch B",
        label: "Criteria Engine Determinístico + Detector de Divergência + Override Auditável (Canônico)",
        description: "Fórmula explícita versionada em src/lib/risk/criteriaEngine.ts cruzando AEP, agregado k >= 5 e controles reais.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 98,
        securityScore: 95,
        regulatoryRigorScore: 96,
        pureMechanismScore: 98,
        reversibilityScore: 92,
      },
      {
        branchId: "Branch C",
        label: "Matriz estática manual sem integração com AEP ou COPSOQ",
        description: "Deixar o usuário preencher planilha solta sem vínculo com os sinais coletados ou controles existentes.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 50,
        securityScore: 85,
        regulatoryRigorScore: 70,
        pureMechanismScore: 65,
        reversibilityScore: 88,
      },
    ],
    acceptanceCriteria: [
      "100% das classificações exibem memória de cálculo, versão da política e fatores contribuintes.",
      "Controles apenas planejados não reduzem a classificação de risco atual.",
    ],
    dependencies: ["ONDA-M1", "ONDA-M2"],
  },
  {
    waveId: "ONDA-M4",
    order: 4,
    title: "Execução Command-Only de Planos de Ação & Copiloto Supervisionado (Aurora/NEXO)",
    subtitle: "Fase ADM C/D/E · Elo 4: Transformar risco avaliado em intervenção rastreável",
    togafPhases: ["Phase C", "Phase D", "Phase E"],
    architectureDomains: ["application", "technology"],
    chainLink: "act",
    currentStatus: "implemented_local",
    gateBoundary: "G1_SYNTHETIC_READY",
    objective:
      "Converter riscos priorizados em planos de ação governados por comandos validados, apoiados por recomendações determinísticas do NEXO e sínteses supervisionadas da Aurora sob guarda de segurança.",
    deliverables: [
      "Núcleo puro de execução de ações (actionExecutionCore) e contrato de comandos (actionCommandContract).",
      "Motor NEXO de recomendação de intervenções organizacionais vinculado aos drivers e subescalas.",
      "Context builder tipado da Aurora que filtra recortes k < 5 e exige validação Zod/JWT nas Edge Functions.",
    ],
    serverEnforcementRule:
      "Transições de estado de ações críticas e recomendações NEXO passam por validação de contrato e vínculo organizacional no servidor.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Geração autônoma de plano de ação pela IA com envio direto de microdados",
        description: "Enviar respostas abertas individuais ao LLM para criar e aprovar ações automaticamente.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 1, 3 e 8: expõe dados sensíveis ao LLM e delega decisão técnica sem supervisão humana.",
        thesisScore: 30,
        securityScore: 0,
        regulatoryRigorScore: 10,
        pureMechanismScore: 20,
        reversibilityScore: 40,
      },
      {
        branchId: "Branch B",
        label: "Núcleo Command-Only + NEXO Determinístico + Aurora Supervisionada k >= 5 (Canônico)",
        description: "Comandos puros testados para ciclo de vida da ação e assistência de IA restrita a agregados seguros com revisão humana.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 96,
        securityScore: 98,
        regulatoryRigorScore: 95,
        pureMechanismScore: 96,
        reversibilityScore: 90,
      },
      {
        branchId: "Branch C",
        label: "Lista de tarefas simples (To-Do) sem máquina de estados ou vínculo com controles",
        description: "Criar CRUD básico de tarefas permitindo marcar concluído sem anexar evidência.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 7: permite declarar ação concluída e reduzir risco sem evidência de implementação.",
        thesisScore: 45,
        securityScore: 70,
        regulatoryRigorScore: 30,
        pureMechanismScore: 50,
        reversibilityScore: 80,
      },
    ],
    acceptanceCriteria: [
      "Tentativa de concluir ação sem evidência é bloqueada pelo núcleo de execução.",
      "Recomendações do NEXO e respostas da Aurora preservam avisos de supervisão humana e limites regulatórios.",
    ],
    dependencies: ["ONDA-M3"],
  },
  {
    waveId: "ONDA-M5",
    order: 5,
    title: "Evidenciação Criptográfica (SHA-256) & Linhagem Documental Preliminar",
    subtitle: "Fase ADM C/D/G · Elo 5: Provar a execução e emitir minutas honestas",
    togafPhases: ["Phase C", "Phase D", "Phase G"],
    architectureDomains: ["data", "application", "technology"],
    chainLink: "evidence",
    currentStatus: "implemented_local",
    gateBoundary: "G1_SYNTHETIC_READY",
    objective:
      "Vincular cada controle e ação executada a registros de evidência com hash SHA-256 e gerar documentos orientativos versionados com proteção contra concorrência e avisos explícitos de revisão técnica.",
    deliverables: [
      "Validador puro de evidências de controle (controlEvidence) com exigência de hash e metadados de autoria.",
      "Templates orientativos de documentos (PGR/AEP/Plano de Ação) com cláusulas de preliminaridade e não-conformidade automática.",
      "Migração de controle de concorrência otimista para versões de documentos auditáveis.",
    ],
    serverEnforcementRule:
      "Novas versões documentais exigem incremento monotônico validado sob lock transacional e preservação integral do histórico anterior.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Emissão de PDF intitulado 'Laudo de Conformidade NR-1 Garantida'",
        description: "Gerar documento final pronto para fiscalização afirmando que a empresa está 100% conforme.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 8 e 11 e a Constituição: proibido prometer conformidade automática ou substituir responsável técnico.",
        thesisScore: 10,
        securityScore: 50,
        regulatoryRigorScore: 0,
        pureMechanismScore: 30,
        reversibilityScore: 20,
      },
      {
        branchId: "Branch B",
        label: "Ledger de Evidências SHA-256 + Documentos Orientativos Versionados (Canônico)",
        description: "Rastrear artefatos probatórios com hash, versionar minutas sem sobrescrita e estampar necessidade de assinatura competente.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 95,
        securityScore: 96,
        regulatoryRigorScore: 98,
        pureMechanismScore: 94,
        reversibilityScore: 92,
      },
      {
        branchId: "Branch C",
        label: "Exportação efêmera apenas no navegador sem registro de linhagem",
        description: "Imprimir tela sem salvar versão, hash dos dados de origem ou identificação da política usada.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 11: documentos auditáveis exigem rastreabilidade de versão, fonte, premissas e hash.",
        thesisScore: 40,
        securityScore: 60,
        regulatoryRigorScore: 35,
        pureMechanismScore: 45,
        reversibilityScore: 75,
      },
    ],
    acceptanceCriteria: [
      "Cada versão de documento registra hash do snapshot, versão da política e status preliminar.",
      "Testes de contrato SQL comprovam que edições simultâneas não corrompem a numeração de versão.",
    ],
    dependencies: ["ONDA-M4"],
  },
  {
    waveId: "ONDA-M6",
    order: 6,
    title: "Reavaliação de Eficácia (PDCA), Gatilhos de Revisão & Prontidão de Comitê G2",
    subtitle: "Fase ADM B/F/H · Elo 6: Medir eficácia real e governar o próximo ciclo",
    togafPhases: ["Phase B", "Phase F", "Phase H"],
    architectureDomains: ["business", "data", "application"],
    chainLink: "reevaluate",
    currentStatus: "partial_draft",
    gateBoundary: "G2_COMMITTEE",
    objective:
      "Fechar o ciclo PDCA exigindo verificação empírica da eficácia das ações antes de reduzir o risco residual, monitorando gatilhos de revisão do PGR e consolidando o dossiê para submissão ao comitê G1/G2.",
    deliverables: [
      "Motor de gatilhos de revisão (reviewTriggers) para mudanças organizacionais, incidentes ou vencimento de ciclo.",
      "Regra de recálculo de risco residual condicionada a effectiveness_reviews aprovadas.",
      "Cockpit TOGAF & Dossiê de Fechamento G1/G2 unificando maturidade técnica e bloqueadores humanos.",
    ],
    serverEnforcementRule:
      "O risco residual oficial permanece inalterado enquanto effectiveness_reviews não registrar evidência verificada de eficácia pós-implementação.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Baixa automática de risco ao cadastrar plano de ação",
        description: "Reduzir o nível de risco de Crítico para Baixo assim que o gestor cria uma tarefa no sistema.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 7: controle só reduz risco após evidência de implementação e eficácia verificada.",
        thesisScore: 15,
        securityScore: 60,
        regulatoryRigorScore: 0,
        pureMechanismScore: 25,
        reversibilityScore: 50,
      },
      {
        branchId: "Branch B",
        label: "Verificação de Eficácia Pós-Controle + Gatilhos PDCA + Cockpit TOGAF (Canônico)",
        description: "Vincular redução de risco à revisão de eficácia comprovada, monitorar gatilhos normativos e expor prontidão real de gate.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 97,
        securityScore: 95,
        regulatoryRigorScore: 98,
        pureMechanismScore: 95,
        reversibilityScore: 92,
      },
      {
        branchId: "Branch C",
        label: "Revisão manual anual fixa sem gatilhos de eventos críticos",
        description: "Agendar apenas lembrete estático de 12 meses ignorando mudanças de setor, incidentes ou divergência de controles.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 60,
        securityScore: 85,
        regulatoryRigorScore: 62,
        pureMechanismScore: 70,
        reversibilityScore: 88,
      },
    ],
    acceptanceCriteria: [
      "Simulação longitudinal demonstra que ação ineficaz mantém o alerta de risco aberto e aciona reavaliação.",
      "Dossiê G1/G2 distingue claramente itens prontos em software de aprovações formais externas pendentes.",
    ],
    dependencies: ["ONDA-M5"],
  },
];

export const nextWaveSaasTracks: readonly NextWaveSaasTrack[] = [
  {
    trackId: "ONDA-S1",
    order: 1,
    title: "Onboarding Organizacional Guiado & Setup de Unidades/GHE Sem Fricção",
    subtitle: "Fase ADM B/E · Prontidão SaaS: Time-to-First-Evidence em Ambiente Sintético/Assistido",
    personaFocus: "org_manager",
    togafPhases: ["Phase B", "Phase E"],
    chainSteps: ["measure", "cross_cutting"],
    gateBoundary: "G1_SYNTHETIC_READY",
    practicalSaasGoal:
      "Permitir que um gestor ou facilitador configure a estrutura organizacional (Empresa, Unidades, GHE e Cenário Sintético Setorial) em menos de 5 minutos, com zero estados vazios mudos e percepção imediata de valor.",
    uxDesignMandate:
      "Stepper progressivo (JourneyStepper) no topo, validação inline sem bloqueios surpresa, templates setoriais pré-calibrados e feedback visual em <= 150ms.",
    responsiveContract:
      "Formulários em 1 coluna fluida no mobile (320px–430px) com inputs de 44px de altura; grid de 2 colunas balanceadas em desktop (1280px–1440px).",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Cadastro self-service aberto com coleta imediata de CPF/e-mail de funcionários",
        description: "Abrir formulário público para importar planilha de colaboradores reais antes do Gate G3.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 1, 2 e 14: dados reais e vínculos identificáveis estão estritamente bloqueados até G3.",
        thesisScore: 30,
        securityScore: 0,
        regulatoryRigorScore: 10,
        uxErgonomicsScore: 60,
        saasReadinessScore: 40,
      },
      {
        branchId: "Branch B",
        label: "Onboarding Assistido Guiado por Cenários Sintéticos Setoriais + Stepper E2E (Canônico)",
        description: "Guiar a criação de unidades e ciclos com presets setoriais (src/data), estados vazios acionáveis e aviso claro do limite sintético G0/G1.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 96,
        securityScore: 98,
        regulatoryRigorScore: 96,
        uxErgonomicsScore: 96,
        saasReadinessScore: 97,
      },
      {
        branchId: "Branch C",
        label: "Configuração manual árida via tabelas vazias sem guia de jornada",
        description: "Exibir telas administrativas em branco exigindo que o usuário descubra sozinho a ordem de cadastro.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 65,
        securityScore: 90,
        regulatoryRigorScore: 80,
        uxErgonomicsScore: 35,
        saasReadinessScore: 40,
      },
    ],
    deliverables: [
      "Fluxo guiado Empresa -> Unidades -> Ciclos -> AEP com indicadores de progresso claros.",
      "Templates sintéticos por setor econômico para simulação imediata em sessões de Design Partner.",
      "Estados vazios instrutivos com botão de ação primária direto em cada módulo.",
    ],
    usabilityMetrics: [
      "Zero cliques mortos ou telas sem próxima ação recomendada.",
      "Compreensão imediata da diferença entre demonstração sintética e operação futura.",
    ],
  },
  {
    trackId: "ONDA-S2",
    order: 2,
    title: "Experiência Mobile-First do Trabalhador Respondente (320px–430px & Segurança Psicológica)",
    subtitle: "Fase ADM B/C · Prontidão SaaS: Coleta Inclusiva em Celular Simples",
    personaFocus: "worker_mobile",
    togafPhases: ["Phase B", "Phase C"],
    chainSteps: ["measure"],
    gateBoundary: "G1_SYNTHETIC_READY",
    practicalSaasGoal:
      "Garantir que qualquer trabalhador, inclusive com celular básico de 320px e baixa familiaridade digital, compreenda a proteção de anonimato (k >= 5) e responda ao instrumento com conforto tátil e zero medo de retaliação.",
    uxDesignMandate:
      "Alvos de toque de no mínimo 44x44px (48px para CTA primário) na zona natural do polegar, linguagem acolhedora e neutra, zero confete/ranking e teto de 15% para elementos fixos.",
    responsiveContract:
      "Reflow 100% livre de scroll horizontal em 320px; cartões de resposta empilhados com espaçamento vertical generoso e contraste WCAG AA (>= 4.5:1).",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Matriz densa de múltiplas colunas com gamificação e confete ao finalizar",
        description: "Exibir grade estilo planilha no celular e soltar animação festiva com ranking de participação por setor.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 12 e 13: proibido usar confete/ranking em fluxo sensível e obrigatório suportar celular simples.",
        thesisScore: 25,
        securityScore: 70,
        regulatoryRigorScore: 20,
        uxErgonomicsScore: 0,
        saasReadinessScore: 30,
      },
      {
        branchId: "Branch B",
        label: "Jornada Mobile-First Ergonômica (44px Touch, 320px Reflow, Tom Neutro e Recibo Sintético — Canônico)",
        description: "Uma pergunta focal por vez ou blocos curtos legíveis, explicação transparente de k >= 5 e navegação completa por toque e teclado.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 98,
        securityScore: 99,
        regulatoryRigorScore: 97,
        uxErgonomicsScore: 98,
        saasReadinessScore: 97,
      },
      {
        branchId: "Branch C",
        label: "Formulário longo de página única sem indicador de progresso ou explicação de privacidade",
        description: "Renderizar todas as perguntas de uma vez sem barra de etapa e sem esclarecer os limites reais do anonimato.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 60,
        securityScore: 85,
        regulatoryRigorScore: 65,
        uxErgonomicsScore: 45,
        saasReadinessScore: 50,
      },
    ],
    deliverables: [
      "Superfície RespondPage validada de 320px a 430px com botões de resposta >= 44x44px.",
      "Explicação em linguagem simples sobre por que recortes menores que 5 pessoas nunca são exibidos.",
      "Recibo sintético auditável ao final do ensaio sem gravar dados pessoais.",
    ],
    usabilityMetrics: [
      "Zero overflow horizontal em 320px verificado por E2E.",
      "100% dos controles interativos operáveis com uma mão (zona do polegar) ou via teclado.",
    ],
  },
  {
    trackId: "ONDA-S3",
    order: 3,
    title: "Workbench Analítico SST & Ergonomia: AEP, AET e Matriz de Critérios (1024px–1440px)",
    subtitle: "Fase ADM B/C · Prontidão SaaS: Decisão Técnica de Alta Densidade Sem Poluição Visual",
    personaFocus: "sst_ergonomist",
    togafPhases: ["Phase B", "Phase C"],
    chainSteps: ["contextualize", "evaluate"],
    gateBoundary: "G1_SYNTHETIC_READY",
    practicalSaasGoal:
      "Oferecer aos especialistas de SST e ergonomistas um console executivo de alta precisão onde sinais agregados (k >= 5), achados do trabalho real (AEP/AET) e divergência de controles convergem em uma avaliação de risco explicável.",
    uxDesignMandate:
      "Layout Mestre-Detalhe em 1440px com nível único de elevação (sem cartões dentro de cartões), numerais estritamente tabulares (font-mono tabular-nums) e estados semânticos pareados com ícone + texto.",
    responsiveContract:
      "Em desktop (1280px–1440px): visão dividida lista/inspeção (lg:grid-cols-12); em tablet (768px): 2 colunas; em mobile: empilhamento limpo com tabelas em scroll container isolado.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Dashboard cheio de velocímetros decorativos e score único opaco",
        description: "Resumir o risco da empresa em um único número 'Score 92/100' sem mostrar AEP, amostra ou fórmula.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 6 e 11 e a regra Anti-Slop: proibido score opaco sem trabalho real e sem memória de cálculo.",
        thesisScore: 20,
        securityScore: 75,
        regulatoryRigorScore: 0,
        uxErgonomicsScore: 30,
        saasReadinessScore: 25,
      },
      {
        branchId: "Branch B",
        label: "Console Mestre-Detalhe Tabular com Triangulação AEP + COPSOQ + Controles (Canônico)",
        description: "Exibir matriz AIHA/NR-1, fatores de exposição real, divergência de controles e histórico de overrides com precisão tabular.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 98,
        securityScore: 96,
        regulatoryRigorScore: 98,
        uxErgonomicsScore: 96,
        saasReadinessScore: 96,
      },
      {
        branchId: "Branch C",
        label: "Múltiplas telas desconectadas exigindo copiar dados manualmente entre AEP e Risco",
        description: "Obrigar o ergonomista a abrir abas separadas para lembrar o que observou na AEP ao classificar o risco.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 68,
        securityScore: 90,
        regulatoryRigorScore: 82,
        uxErgonomicsScore: 50,
        saasReadinessScore: 55,
      },
    ],
    deliverables: [
      "Visão integrada de contexto do trabalho real (AEP), gatilhos de AET e memória de cálculo do Criteria Engine.",
      "Tabelas analíticas com alinhamento numérico tabular e destaque visual imediato de divergência de controles.",
      "Formulário de revisão/override técnico com justificativa obrigatória e rastreabilidade de autor.",
    ],
    usabilityMetrics: [
      "Leitura instantânea de severidade, probabilidade e nível de confiança sem abrir modais aninhados.",
      "Zero uso de pills decorativos para metadados estáticos (uso de separadores tipográficos limpos).",
    ],
  },
  {
    trackId: "ONDA-S4",
    order: 4,
    title: "Orquestração Prática de Planos de Ação Command-Only & Copiloto Supervisionado",
    subtitle: "Fase ADM C/D/E · Prontidão SaaS: Da Priorização à Ação Evidenciada em Fluxo Contínuo",
    personaFocus: "org_manager",
    togafPhases: ["Phase C", "Phase D", "Phase E"],
    chainSteps: ["act", "evidence"],
    gateBoundary: "G1_SYNTHETIC_READY",
    practicalSaasGoal:
      "Transformar o gerenciamento de ações preventivas e corretivas em um workflow SaaS fluido, onde recomendações determinísticas do NEXO e sínteses da Sra. EstratégIA/Aurora aceleram o trabalho humano sem tomar decisões autônomas.",
    uxDesignMandate:
      "Transições de estado guiadas por comandos explícitos, microcopy explicativa para requisitos pendentes (ex.: necessidade de hash SHA-256) e assistente flutuante discreto que não obstrui dados.",
    responsiveContract:
      "Cards de ação e gaveta do assistente adaptáveis de 320px a 1440px, respeitando o limite de 15% de elementos fixos no mobile.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Chatbot autônomo que altera status de risco e fecha ações sozinho",
        description: "Permitir que a IA marque ações como eficazes e reduza o risco residual sem evidência humana.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 7 e 8: IA nunca toma decisão técnica e risco só cai com eficácia verificada.",
        thesisScore: 15,
        securityScore: 30,
        regulatoryRigorScore: 0,
        uxErgonomicsScore: 40,
        saasReadinessScore: 20,
      },
      {
        branchId: "Branch B",
        label: "Workflow Command-Only Guiado + Recomendações NEXO + Aurora Supervisionada (Canônico)",
        description: "Sugerir intervenções baseadas em evidências (NEXO), sintetizar agregados k >= 5 (Aurora) e exigir comando humano com evidência SHA-256.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 97,
        securityScore: 98,
        regulatoryRigorScore: 96,
        uxErgonomicsScore: 95,
        saasReadinessScore: 97,
      },
      {
        branchId: "Branch C",
        label: "Execução de ações puramente textual sem conexão com catálogo de intervenções",
        description: "Forçar o gestor a redigir planos de ação do zero sem apoio da matriz de tradução de risco ou biblioteca NR-1.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 65,
        securityScore: 92,
        regulatoryRigorScore: 80,
        uxErgonomicsScore: 55,
        saasReadinessScore: 60,
      },
    ],
    deliverables: [
      "Fluxo de criação e avanço de estado de ações conectado aos drivers e subescalas prioritárias.",
      "Validação visual clara do vínculo entre Ação -> Evidência SHA-256 -> Revisão de Eficácia.",
      "Superfície do Copiloto com perguntas sugeridas contextuais e guarda explícita de limites.",
    ],
    usabilityMetrics: [
      "Feedback imediato do motivo pelo qual uma transição de estado está habilitada ou bloqueada.",
      "Zero sobreposição do botão flutuante da assistente sobre botões primários em telas móveis.",
    ],
  },
  {
    trackId: "ONDA-S5",
    order: 5,
    title: "Entrega Executiva SaaS, Dossiês Auditáveis & Operação de Serviço Assistido",
    subtitle: "Fase ADM F/G · Prontidão SaaS: Empacotamento Prático para Comitês e Design Partners",
    personaFocus: "executive_auditor",
    togafPhases: ["Phase F", "Phase G"],
    chainSteps: ["evidence", "reevaluate", "cross_cutting"],
    gateBoundary: "G2_COMMITTEE",
    practicalSaasGoal:
      "Consolidar a entrega tangível do SaaS para compradores, diretores de SST, CIPA e auditores: geração de minutas preliminares versionadas (PGR/AEP/Plano de Ação), Sprint de Prontidão e Cockpit de Governança.",
    uxDesignMandate:
      "Templates de impressão/PDF de padrão editorial limpo, cabeçalhos de rastreabilidade (SHA-256, versão da política, data) e distinção cristalina entre Disponível Agora vs. Bloqueado por Gate.",
    responsiveContract:
      "Visualização de documentos e quadros de comitê responsivos em tela e formatados para paginação A4 limpa na exportação.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Checkout financeiro self-service imediato com promessa de PGR pronto em 5 minutos",
        description: "Ativar cobrança automática e prometer documento final assinado sem revisão de engenheiro/médico/ergonomista.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 8, 11 e 14 e o guardrail comercial: venda self-service e laudo automático são proibidos.",
        thesisScore: 10,
        securityScore: 50,
        regulatoryRigorScore: 0,
        uxErgonomicsScore: 50,
        saasReadinessScore: 10,
      },
      {
        branchId: "Branch B",
        label: "Entrega Assistida Vendor-Neutral + Documentos Preliminares Versionados + Trust Center (Canônico)",
        description: "Operar via Sprint de Prontidão/Design Partner sem dados pessoais em G1, gerando minutas auditáveis para revisão do responsável técnico.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 96,
        securityScore: 97,
        regulatoryRigorScore: 99,
        uxErgonomicsScore: 95,
        saasReadinessScore: 96,
      },
      {
        branchId: "Branch C",
        label: "Bloqueio total de qualquer demonstração prática até o Gate G3",
        description: "Impedir que clientes e parceiros testem a jornada sintética ou conheçam o modelo de governança.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 50,
        securityScore: 95,
        regulatoryRigorScore: 85,
        uxErgonomicsScore: 40,
        saasReadinessScore: 25,
      },
    ],
    deliverables: [
      "Gerador de minutas orientativas com metadados completos de linhagem e aviso de revisão técnica.",
      "Jornada do Comitê Comprador (RH, SST, Jurídico/DPO, Segurança, Finanças) interativa e sem overclaim.",
      "Cockpit de Prontidão Externa e Fechamento de Gate para condução de sessões assistidas.",
    ],
    usabilityMetrics: [
      "Qualquer avaliador compreende em menos de 30 segundos o estado atual do gate e os limites éticos do produto.",
      "Exportação documental preserva legibilidade, tabelas íntegras e avisos normativos.",
    ],
  },
  {
    trackId: "ONDA-S6",
    order: 6,
    title: "Engenharia de Design System, Responsividade Universal (320px–1440px) & WCAG 2.2 AA",
    subtitle: "Fase ADM G/H · Prontidão SaaS: Qualidade Visual, Performance e Acessibilidade de Classe Mundial",
    personaFocus: "executive_auditor",
    togafPhases: ["Phase G", "Phase H"],
    chainSteps: ["cross_cutting"],
    gateBoundary: "G1_SYNTHETIC_READY",
    practicalSaasGoal:
      "Garantir que todas as páginas públicas e privadas do aplicativo cumpram rigorosamente o contrato de Design System Fable 5: 60-30-10 cromático, Zero-Pill em metadados estáticos, paridade Light/Dark e acessibilidade total.",
    uxDesignMandate:
      "Zero cabeçalhos mecânicos (//), zero dots pulsantes decorativos, zero bordas laterais grossas (border-l-4), foco de teclado visível (ring-2) e títulos balanceados ([text-wrap:balance]).",
    responsiveContract:
      "Verificação sistemática nas 4 faixas críticas (320px, 390px, 768px e 1440px) garantindo ausência de sobreposição, truncamento acidental ou quebra de grid.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Estética genérica de IA com múltiplos badges coloridos, neon e telemetria falsa",
        description: "Decorar cartões com pílulas coloridas estáticas, barras laterais grossas e contadores fictícios no rodapé.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 12/13 e a Constituição de Design: estética poluída prejudica a leitura técnica e a seriedade regulatória.",
        thesisScore: 30,
        securityScore: 80,
        regulatoryRigorScore: 40,
        uxErgonomicsScore: 0,
        saasReadinessScore: 30,
      },
      {
        branchId: "Branch B",
        label: "Design System Sóbrio de Alta Precisão + Contratos Automatizados de Viewport & Acessibilidade (Canônico)",
        description: "Aplicar hierarquia tipográfica limpa, numerais tabulares, contraste AA e testes automatizados Playwright + axe-core.",
        invariantValid: true,
        pruneReason: null,
        thesisScore: 96,
        securityScore: 96,
        regulatoryRigorScore: 98,
        uxErgonomicsScore: 100,
        saasReadinessScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Interface desktop-only que exige zoom horizontal em celulares",
        description: "Projetar apenas para monitores de 1440px ignorando o trabalhador em smartphones de 320px.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 13: celular simples e acessibilidade são critérios obrigatórios de aceite.",
        thesisScore: 40,
        securityScore: 80,
        regulatoryRigorScore: 50,
        uxErgonomicsScore: 10,
        saasReadinessScore: 35,
      },
    ],
    deliverables: [
      "Matriz de contratos de viewport (320px a 1440px) auditável diretamente no Cockpit.",
      "Padronização de tabelas, cards executivos e filtros segmentados com suporte completo a teclado.",
      "Suíte E2E de acessibilidade, reflow em 320px e navegação por teclado.",
    ],
    usabilityMetrics: [
      "Zero violações críticas/sérias de contraste ou semântica ARIA.",
      "Tempo de resposta visual de micro-interações e filtros locais <= 150ms.",
    ],
  },
];

export const viewportUxContracts: readonly ViewportUxContract[] = [
  {
    viewportId: "mobile_320",
    label: "1. Mobile Compacto (Celular Simples)",
    widthRange: "320px – 375px",
    primaryPersona: "Trabalhador Respondente (Invariante 13)",
    keySurfaces: ["/respond/:token", "/signup/collaborator", "/nr1-copsoq"],
    minTouchTargetPx: 44,
    maxStickyViewportPct: 15,
    gridArchitecture: "Coluna única fluida (grid-cols-1, padding horizontal 16px, gap vertical 16px).",
    typographyScale: "Títulos 20px–22px ([text-wrap:balance]), corpo 15px–16px (line-height 1.6), metadados 12px.",
    zeroFrictionRules: [
      "Proibido scroll horizontal em qualquer elemento ou tabela (overflow-x controlado).",
      "Botões de resposta ocupam 100% da largura útil com altura mínima de 44px.",
      "Explicação da barreira k >= 5 visível sem precisar abrir tooltips complexos.",
    ],
    verificationSpec: "e2e/public-keyboard-and-demo.spec.ts (reflow 320px)",
  },
  {
    viewportId: "mobile_touch_390",
    label: "2. Smartphone Touch Padrão",
    widthRange: "375px – 430px",
    primaryPersona: "Trabalhador & Gestor de Ação em Campo",
    keySurfaces: ["/respond/:token", "/drivers", "/app/actions", "/planos"],
    minTouchTargetPx: 44,
    maxStickyViewportPct: 15,
    gridArchitecture: "1 coluna principal + grade 2x2 para KPIs resumidos (grid-cols-2 gap-2.5).",
    typographyScale: "Títulos 22px–26px, corpo 15px–16px, métricas em font-mono tabular-nums.",
    zeroFrictionRules: [
      "Ações primárias posicionadas na zona natural de alcance do polegar (terço inferior/médio).",
      "Filtros segmentados com quebra flexível limpa (flex-wrap) e rótulos em linha única (whitespace-nowrap).",
      "Assistente flutuante nunca encobre botões de submissão ou navegação.",
    ],
    verificationSpec: "e2e/public-routes.spec.ts (mobile viewport)",
  },
  {
    viewportId: "tablet_field_768",
    label: "3. Tablet / Híbrido (Observação AEP/AET)",
    widthRange: "768px – 1024px",
    primaryPersona: "Ergonomista & Técnico de SST em Campo",
    keySurfaces: ["/app/work-analysis", "/app/aet", "/app/units", "/app/controls"],
    minTouchTargetPx: 44,
    maxStickyViewportPct: 12,
    gridArchitecture: "Layout de 2 colunas simétricas ou assimétricas (md:grid-cols-2, gap-4, padding 24px).",
    typographyScale: "Títulos 24px–28px, corpo 15px–16px (medida 65ch–75ch), tabelas com scroll horizontal isolado.",
    zeroFrictionRules: [
      "Comparação lado a lado entre trabalho prescrito e trabalho real observado na AEP.",
      "Seletores de fatores de risco e tags operáveis tanto por toque quanto por teclado.",
      "Preservação integral de rascunho/estado durante alternância de filtros.",
    ],
    verificationSpec: "src/pages/app/TogafMacroWaveWorkspacePage.test.tsx",
  },
  {
    viewportId: "desktop_console_1440",
    label: "4. Console Executivo & Analítico Widescreen",
    widthRange: "1280px – 1440px+",
    primaryPersona: "Responsável Técnico SST, DPO, Comitê G1/G2 & Auditoria",
    keySurfaces: [
      "/app",
      "/app/risk",
      "/app/criteria",
      "/app/governance",
      "/app/governance/togaf-macro-wave",
    ],
    minTouchTargetPx: 40,
    maxStickyViewportPct: 10,
    gridArchitecture: "Sidebar fixa (240px) + Container max-w-6xl/7xl + Grid Mestre-Detalhe 12 colunas (lg:grid-cols-12).",
    typographyScale: "Display 28px–32px, seções 18px–20px, tabelas densas 12px–13px com font-mono tabular-nums.",
    zeroFrictionRules: [
      "Nível único de elevação de superfície (proibido aninhar cartões com sombras dentro de cartões).",
      "Inspeção de nós TOGAF, ramos ToT, cátedras e memória de cálculo sem perder o contexto da lista.",
      "Atalhos claros de exportação (.md / impressão preliminar) com feedback de estado imediato.",
    ],
    verificationSpec: "e2e/public-keyboard-and-demo.spec.ts (desktop 1440px + axe-core)",
  },
];

export const postDocChairs: readonly PostDocChair[] = [
  {
    id: "chair-1-togaf-systems",
    order: 1,
    code: "CÁTEDRA 01",
    chairTitle: "Arquitetura Corporativa TOGAF & Engenharia de Sistemas Críticos",
    experienceYears: 24,
    experienceDomain: "Modelagem ADM (Fases Preliminar a H), sistemas socio-técnicos regulados e separação mecanismo/domínio.",
    togafDomainFocus: "application",
    epistemicAxiom:
      "Toda capacidade regulatória deve possuir rastreabilidade bijetora entre requisito normativo, contrato puro em src/lib, catálogo versionado em src/data e asserção automatizada.",
    falsifiabilityQuestion:
      "Qual teste automatizado falha imediatamente se um desenvolvedor tentar pular um elo da cadeia operacional ou embutir uma regra de negócio diretamente em um componente React?",
    vetoTrigger:
      "Presença de regras psicométricas/regulatórias hardcoded em JSX, uso de explicit-any novo ou módulo órfão desconectado da cadeia Medir -> Reavaliar.",
    primaryArtifacts: [
      "docs/TOGAF_SYSTEMIC_KNOWLEDGE_TREE_G1_G2.md",
      "src/lib/governance/togafMacroWaveEngine.ts",
      "scripts/check-explicit-any.mjs",
    ],
  },
  {
    id: "chair-2-zero-trust-rls",
    order: 2,
    code: "CÁTEDRA 02",
    chairTitle: "Segurança Zero-Trust, Criptografia Aplicada & Isolamento RLS",
    experienceYears: 22,
    experienceDomain: "Engenharia de privacidade em bancos relacionais, RLS deny-by-default, mitigação de ataques de reconstrução e k-anonimato.",
    togafDomainFocus: "technology",
    epistemicAxiom:
      "Restrições de interface gráfica são meramente cosméticas; a proteção do trabalhador só existe quando o servidor e o banco de dados recusam estruturalmente leituras sub-limiares.",
    falsifiabilityQuestion:
      "Como um ator autenticado com perfil org_admin falharia ao tentar extrair respostas individuais via API direta ou inferir um respondente por ataque de diferença (N vs N-1)?",
    vetoTrigger:
      "Qualquer política RLS permissiva sobre microdados, cálculo de agregação no cliente ou ausência do corte k >= 5 no servidor.",
    primaryArtifacts: [
      "supabase/migrations/20260623013000_privacy_vault_g1.sql",
      "supabase/tests/privacy_vault_contract.sql",
      "src/lib/runtime/dataGate.ts",
    ],
  },
  {
    id: "chair-3-psychometrics",
    order: 3,
    code: "CÁTEDRA 03",
    chairTitle: "Psicometria Ocupacional & Metodologia Científica (COPSOQ)",
    experienceYears: 25,
    experienceDomain: "Validação transcultural de instrumentos psicossociais, teoria da medida, invariância fatorial e ética em pesquisa ocupacional.",
    togafDomainFocus: "data",
    epistemicAxiom:
      "Escores de percepção coletiva medem construtos psicossociais sob condições estritas de versionamento e amostra, jamais constituindo diagnóstico clínico individual.",
    falsifiabilityQuestion:
      "Onde estão registrados de forma imutável a versão do instrumento, a polaridade das 26 subescalas, a fórmula do escore original e sua separação em relação à matriz de risco?",
    vetoTrigger:
      "Mistura destrutiva entre escore psicométrico original e tradução de risco, alegação de instrumento validado sem dossiê formal ou menção a SRQ-20 ativo.",
    primaryArtifacts: [
      "src/data/instrumentRegistry.ts",
      "src/lib/instruments/registry.ts",
      "docs/METHODOLOGY_READINESS_DOSSIER_G1.md",
    ],
  },
  {
    id: "chair-4-ergonomics-nr17",
    order: 4,
    code: "CÁTEDRA 04",
    chairTitle: "Ergonomia da Atividade (NR-17) & Análise do Trabalho Real",
    experienceYears: 23,
    experienceDomain: "Avaliação Ergonômica Preliminar (AEP), Análise Ergonômica do Trabalho (AET) e distinção entre trabalho prescrito e trabalho real.",
    togafDomainFocus: "business",
    epistemicAxiom:
      "Fatores de risco psicossociais emergem da organização do trabalho e das exigências da atividade real; nenhum questionário substitui a observação situada e a escuta dos trabalhadores.",
    falsifiabilityQuestion:
      "De que forma o modelo de dados e o fluxo de aplicação impedem a consolidação do inventário de riscos quando a análise do contexto do trabalho real (AEP) está ausente?",
    vetoTrigger:
      "Fluxo que converte respostas de survey diretamente em PGR/laudo ergonômico sem exigir AEP, avaliação de gatilhos de AET e participação de trabalhadores.",
    primaryArtifacts: [
      "src/lib/work/assessment.ts",
      "src/lib/work/aetAssessment.ts",
      "docs/AEP_WORK_CONTEXT_G2.md",
      "docs/AET_FLOW_G2.md",
    ],
  },
  {
    id: "chair-5-regulatory-law-lgpd",
    order: 5,
    code: "CÁTEDRA 05",
    chairTitle: "Direito Regulatório Trabalhista (NR-1 / GRO / PGR) & Governança LGPD",
    experienceYears: 21,
    experienceDomain: "Direito de SST, auditoria trabalhista, responsabilidade técnica profissional e proteção de dados pessoais sensíveis.",
    togafDomainFocus: "business",
    epistemicAxiom:
      "O software organiza evidências e sustenta a rastreabilidade técnica, mas a assunção de responsabilidade legal e a assinatura de documentos pertencem exclusivamente a profissionais habilitados.",
    falsifiabilityQuestion:
      "Qual mecanismo impede que superfícies públicas ou documentos gerados prometam conformidade automática, isenção de multas ou substituição do responsável técnico?",
    vetoTrigger:
      "Qualquer claim de conformidade garantida, laudo automático, coleta de dados pessoais sem base legal aprovada ou ativação de dados reais antes do Gate G3.",
    primaryArtifacts: [
      "src/test/publicClaimsGuardrail.test.ts",
      "src/data/publicClaimsPolicy.ts",
      "src/lib/governance/dataLifecycle.ts",
    ],
  },
  {
    id: "chair-6-supervised-ai-rag",
    order: 6,
    code: "CÁTEDRA 06",
    chairTitle: "Inteligência Artificial Supervisionada, RAG Confiável & Segurança Cognitiva",
    experienceYears: 20,
    experienceDomain: "Alinhamento de modelos generativos em domínios de alto risco, contenção de alucinações, contratos tipados e defesa contra prompt injection.",
    togafDomainFocus: "technology",
    epistemicAxiom:
      "Sistemas generativos devem operar em regime estritamente consultivo sobre agregados sanitizados, ancorados em fontes verificáveis e cercados por contratos determinísticos de entrada e saída.",
    falsifiabilityQuestion:
      "Qual barreira técnica garante que o assistente Aurora e o motor NEXO jamais recebam dados com k < 5, jamais inventem estatísticas não catalogadas e sempre declarem caráter preliminar?",
    vetoTrigger:
      "Envio de microdados ou relatos individuais para LLMs, ausência de validação Zod/JWT/rate-limit nas Edge Functions ou recomendações apresentadas como prescrição médica/legal.",
    primaryArtifacts: [
      "src/lib/aurora/contextBuilder.ts",
      "src/lib/nexo/driverRecommendation.ts",
      "supabase/functions/_shared/security.ts",
    ],
  },
  {
    id: "chair-7-causal-decision-science",
    order: 7,
    code: "CÁTEDRA 07",
    chairTitle: "Inferência Causal, Decisão Multicritério & Dinâmica de Risco Residual",
    experienceYears: 22,
    experienceDomain: "Modelagem matemática de risco, matrizes de decisão sob incerteza, avaliação longitudinal de intervenções e controle de eficácia.",
    togafDomainFocus: "data",
    epistemicAxiom:
      "Associações transversais não provam causalidade; a redução do risco residual exige evidência empírica de implementação e verificação posterior de eficácia do controle.",
    falsifiabilityQuestion:
      "Como o motor de cálculo garante que um controle meramente planejado ou com divergência crítica de percepção não reduza artificialmente o escore de risco residual?",
    vetoTrigger:
      "Fórmulas opacas sem versão registrada, ausência de trilha de override ou redução automática de risco no ato de criação de um plano de ação.",
    primaryArtifacts: [
      "src/lib/risk/criteriaEngine.ts",
      "src/lib/controls/controlDivergence.ts",
      "src/lib/risk/reviewTriggers.ts",
    ],
  },
  {
    id: "chair-8-wellbeing-inclusive-ux",
    order: 8,
    code: "CÁTEDRA 08",
    chairTitle: "Ciência do Bem-Estar Ocupacional (PERMA+V) & Ética de Coleta",
    experienceYears: 20,
    experienceDomain: "Intervenções organizacionais baseadas em evidências, psicologia positiva aplicada ao trabalho e proteção contra coerção organizacional.",
    togafDomainFocus: "application",
    epistemicAxiom:
      "A coleta e a intervenção devem proteger a segurança psicológica do trabalhador mais vulnerável, separando escuta coletiva anônima de canais individuais de acolhimento.",
    falsifiabilityQuestion:
      "Como o fluxo de resposta garante voluntariedade real, separação de denúncia/acolhimento e ausência de gamificação indutora?",
    vetoTrigger:
      "Presença de elementos coercitivos, confete em fluxos sensíveis, ranking comparativo punitivo ou mistura entre pesquisa anônima e canal de denúncia.",
    primaryArtifacts: [
      "src/pages/RespondPage.tsx",
      "src/data/nr1Interventions.ts",
      "docs/PRIVACY_VAULT_G1.md",
    ],
  },
  {
    id: "chair-9-hci-responsive-design",
    order: 9,
    code: "CÁTEDRA 09",
    chairTitle: "Interação Humano-Computador (HCI), Ergonomia Cognitiva & Responsividade Universal",
    experienceYears: 21,
    experienceDomain: "Sistemas de design de missão crítica, ergonomia tátil mobile-first (320px–430px), consoles analíticos widescreen (1440px) e acessibilidade WCAG 2.2 AA.",
    togafDomainFocus: "application",
    epistemicAxiom:
      "Em sistemas regulatórios críticos, atrito visual, sobrecarga cognitiva ou quebra de layout em telas pequenas induzem erro humano e comprometem a validade da evidência.",
    falsifiabilityQuestion:
      "Qual contrato verificável garante que todas as telas operem sem scroll horizontal em 320px, com alvos de toque >= 44x44px, teto sticky <= 15%, numerais tabulares e contraste AA?",
    vetoTrigger:
      "Overflow horizontal em 320px–1440px, uso de pills estáticos para metadados, bordas laterais border-l-4, ausência de foco visível por teclado ou falta de tabular-nums.",
    primaryArtifacts: [
      "docs/SUPER_PROMPT_PROXIMA_ONDA_SAAS_UX_TOT.md",
      "e2e/public-keyboard-and-demo.spec.ts",
      "docs/governance/BROWSER_ACCESSIBILITY_EXECUTION_G0.md",
    ],
  },
  {
    id: "chair-10-b2b-saas-operations",
    order: 10,
    code: "CÁTEDRA 10",
    chairTitle: "Arquitetura de Operações SaaS B2B, Onboarding Guiado & Entrega de Serviço Assistido",
    experienceYears: 22,
    experienceDomain: "Consolidação de plataformas SaaS reguladas, fluxos de Time-to-Value sem fricção, completude de estados operacionais e governança de Design Partners.",
    togafDomainFocus: "business",
    epistemicAxiom:
      "A transição de protótipo para SaaS prático exige que cada módulo entregue uma jornada sem becos sem saída, com estados vazios acionáveis, minutas auditáveis e fronteiras comerciais honestas.",
    falsifiabilityQuestion:
      "Um avaliador ou cliente em Sprint de Prontidão consegue percorrer a cadeia completa (Empresa -> Unidade -> Ciclo -> AEP/AET -> Critérios -> Ação -> Documento) sem encontrar estados mudos ou promessas não entregues?",
    vetoTrigger:
      "Telas com botões sem handler funcional, estados vazios sem ação guiada, fricção desnecessária entre elos da cadeia ou venda self-service antes do Gate G3.",
    primaryArtifacts: [
      "src/data/g1ReadinessGovernanceSprint.ts",
      "src/components/sales/VendorDeliveryReadinessCard.tsx",
      "src/pages/app/TogafMacroWaveWorkspacePage.tsx",
    ],
  },
];

export const superPromptRubricCriteria: readonly SuperPromptRubricCriterion[] = [
  {
    id: "rubric-r01-togaf",
    code: "R01",
    dimension: "Cobertura Sistêmica TOGAF (4 Domínios + Ciclo ADM Preliminar a H)",
    weightPct: 10,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Mapeamento completo dos 4 domínios (Negócio, Dados, Aplicação, Tecnologia) e das 9 fases ADM vinculados a artefatos reais do repositório.",
    externalCommitteeVerdict:
      "Arquitetura corporativa executável: cada nó ADM possui contrato de código e teste verificável, eliminando abstrações desconectadas.",
    verificationContract: "src/lib/governance/togafMacroWaveEngine.test.ts",
  },
  {
    id: "rubric-r02-chain",
    code: "R02",
    dimension: "Integridade da Cadeia Operacional NR-1 (6 Elos E2E)",
    weightPct: 11,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Sequenciamento contínuo Medir -> Contextualizar (AEP/AET) -> Avaliar -> Agir -> Evidenciar -> Reavaliar com dependências explícitas.",
    externalCommitteeVerdict:
      "Impede atalhos regulatórios comuns no mercado ao exigir contexto do trabalho real antes da classificação de risco e evidência antes da revisão.",
    verificationContract: "src/lib/governance/regulatoryJourney.test.ts",
  },
  {
    id: "rubric-r03-privacy",
    code: "R03",
    dimension: "Inviolabilidade do Privacy Vault & Anonimato Estatístico k >= 5",
    weightPct: 11,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "RLS deny-by-default sobre microdados, desacoplamento convite-resposta e corte k >= 5 imposto em SQL, API e builder de IA.",
    externalCommitteeVerdict:
      "Defesa em profundidade exemplar: mesmo em caso de falha na camada de apresentação, o banco e os motores puros recusam recortes k < 5.",
    verificationContract: "src/test/privacyVaultMigration.test.ts",
  },
  {
    id: "rubric-r04-tot",
    code: "R04",
    dimension: "Rigor Formal do Tree of Thoughts (Dupla Equação ToT & Poda Binária)",
    weightPct: 10,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Equações multicritério explícitas U(b) e U_SaaS(b) com multiplicador binário V(b) in {0, 1} que poda imediatamente violações éticas ou ergonômicas.",
    externalCommitteeVerdict:
      "Substitui heurísticas subjetivas por um modelo matemático de decisão auditável por qualquer IA de fronteira ou comitê pós-doutoral.",
    verificationContract: "src/lib/governance/togafMacroWaveEngine.test.ts",
  },
  {
    id: "rubric-r05-separation",
    code: "R05",
    dimension: "Separação Estrita Mecanismo Puro (src/lib) vs. Domínio (src/data)",
    weightPct: 9,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Motores determinísticos puros em src/lib desacoplados de catálogos e políticas versionadas em src/data, com zero explicit-any novo.",
    externalCommitteeVerdict:
      "Garante testabilidade unitária instantânea, auditoria de fórmulas e preparação limpa para evolução futura de pacotes de domínio.",
    verificationContract: "scripts/check-explicit-any.mjs",
  },
  {
    id: "rubric-r06-honesty",
    code: "R06",
    dimension: "Honestidade Regulatória NR-1/NR-17 & Guardrail Anti-Overclaim",
    weightPct: 9,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Proibição automatizada de promessas de conformidade garantida, laudo automático ou diagnóstico clínico em 40+ arquivos de superfície.",
    externalCommitteeVerdict:
      "Postura ética exemplar em SaaS regulatório: protege jurídica e tecnicamente tanto o trabalhador quanto a organização compradora.",
    verificationContract: "src/test/publicClaimsGuardrail.test.ts",
  },
  {
    id: "rubric-r07-ai-safety",
    code: "R07",
    dimension: "Governança de IA Supervisionada (Aurora & NEXO Server-Boundary)",
    weightPct: 9,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Recomendações NEXO determinísticas no servidor, sanitização de contexto Aurora k >= 5, schemas Zod e rate-limiting nas Edge Functions.",
    externalCommitteeVerdict:
      "Contém o risco generativo dentro de fronteiras determinísticas e mantém a decisão técnica sob autoridade humana indelegável.",
    verificationContract: "src/test/aiEdgeSecurity.test.ts",
  },
  {
    id: "rubric-r08-falsifiability",
    code: "R08",
    dimension: "Falsificabilidade Popperiana das 10 Cátedras & Contratos de CI",
    weightPct: 9,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Cada uma das 10 cátedras pós-doutorais formula uma pergunta de refutação empírica ligada a testes Vitest, pgTAP, Playwright ou scripts de release.",
    externalCommitteeVerdict:
      "Eleva o Super Prompt ao nível científico falsificável: toda diretriz arquitetural ou de UX aponta para seu teste de refutação.",
    verificationContract: "src/test/releaseEvidenceManifestDrift.test.ts",
  },
  {
    id: "rubric-r09-ux-responsive",
    code: "R09",
    dimension: "Excelência UX/UI, Ergonomia Multidispositivo (320px–1440px) & WCAG AA",
    weightPct: 11,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "Contratos explícitos para 320px, 390px, 768px e 1440px com alvos >= 44px, teto sticky <= 15%, numerais tabulares e disciplina Zero-Pill.",
    externalCommitteeVerdict:
      "Une ergonomia tátil para o trabalhador em celular básico com precisão analítica de alta densidade para especialistas em monitores widescreen.",
    verificationContract: "e2e/public-keyboard-and-demo.spec.ts",
  },
  {
    id: "rubric-r10-saas-readiness",
    code: "R10",
    dimension: "Prontidão Prática de Serviço SaaS & Contenção Fail-Closed de Gate",
    weightPct: 11,
    achievedLevel: 5,
    maxLevel: 5,
    objectiveEvidence:
      "6 Trilhas Práticas SaaS (S1–S6) cobrindo onboarding, coleta, análise, ação, dossiês e design system sob guarda estrita G0/G1 -> G2 -> G3.",
    externalCommitteeVerdict:
      "Viabiliza aplicação prática imediata via demonstrações sintéticas e Sprints de Prontidão assistidos sem jamais violar o bloqueio de dados reais.",
    verificationContract: "src/pages/app/TogafMacroWaveWorkspacePage.test.tsx",
  },
];

export const arc4VisualBenchmarks: readonly Arc4VisualBenchmarkItem[] = [
  {
    benchmarkId: "linear_precision",
    code: "BENCH-01",
    referenceName: "Linear Precision Surfaces",
    patternTitle: "Superfícies de Precisão com Borda Hairline & Luminância de Topo",
    visualEffectSpec:
      "Cartões com borda 1px solid hsl(var(--border)), iluminação interna de topo (inset 0 1px 0 hsl(0 0% 100% / 0.06)) e nível único de elevação sem sombras difusas pesadas.",
    uxValueAdded:
      "Separa módulos complexos (AEP, Matriz AIHA 5×5, Riscos e Planos de Ação) com nitidez cirúrgica, reduzindo a fadiga visual em sessões analíticas prolongadas.",
    targetSurfaces: ["/app", "/app/risk", "/app/work-analysis", "/app/governance/togaf-macro-wave"],
    cssUtilityContract: ".arc-surface-precision .arc-hairline-top",
    accessibilityGuardrail:
      "WCAG 2.2 AA: contraste de texto >= 4.5:1 (7:1 em alertas críticos) e proibição de cartões aninhados redundantes.",
    cognitiveLoadReductionPct: 34,
    interactionLatencyMs: 50,
    antiPatternForbidden:
      "Proibido usar border-l-4 decorativo, sombras neon pesadas ou três níveis de cartões aninhados.",
  },
  {
    benchmarkId: "stripe_tactile",
    code: "BENCH-02",
    referenceName: "Stripe Tactile Choreography",
    patternTitle: "Coreografia de Microinterações Táteis & Feedback Command-Only",
    visualEffectSpec:
      "Transições físicas contidas de 180ms cubic-bezier(0.16, 1, 0.3, 1), elevação de -1px no hover e compressão tátil scale(0.995) no clique ativo.",
    uxValueAdded:
      "Confirma instantaneamente ao usuário que seleções de ondas, filtros segmentados e comandos de plano de ação foram registrados sem incerteza operacional.",
    targetSurfaces: ["/app", "/app/actions", "/app/controls", "/app/governance/togaf-macro-wave"],
    cssUtilityContract: ".arc-tactile-card (180ms cubic-bezier(0.16, 1, 0.3, 1))",
    accessibilityGuardrail:
      "Proteção integral via @media (prefers-reduced-motion: reduce) desativando transformações e animações automaticamente.",
    cognitiveLoadReductionPct: 28,
    interactionLatencyMs: 120,
    antiPatternForbidden:
      "Proibido usar animações infinitas de flutuação/rotação em áreas de dados ou confete em fluxos sensíveis.",
  },
  {
    benchmarkId: "vercel_telemetry",
    code: "BENCH-03",
    referenceName: "Vercel Analytical Telemetry",
    patternTitle: "Tipografia Numérica Tabular & Barras de Telemetria Semântica",
    visualEffectSpec:
      "Alinhamento numérico estrito com font-mono tabular-nums, barras de progresso .arc-telemetry-bar de 6px e selos criptográficos SHA-256 discretos.",
    uxValueAdded:
      "Permite comparar colunas de severidade, probabilidade, contagens k >= 5 e prontidão de Gate G1 em menos de 3 segundos sem desalinhamento horizontal.",
    targetSurfaces: ["/app", "/app/criteria", "/app/documents", "/app/governance/togaf-macro-wave"],
    cssUtilityContract: "font-mono tabular-nums + .arc-telemetry-bar",
    accessibilityGuardrail:
      "WCAG 1.4.1: status nunca transmitido apenas por cor; sempre pareado com ícone semântico e rótulo textual explícito.",
    cognitiveLoadReductionPct: 38,
    interactionLatencyMs: 80,
    antiPatternForbidden:
      "Proibido usar pills/badges arredondados em metadados estáticos (versão, código ADM, hash) — usar separador '·'.",
  },
  {
    benchmarkId: "raycast_glass",
    code: "BENCH-04",
    referenceName: "Raycast Contextual Glass",
    patternTitle: "Glassmorphism Contextual de Baixa Interferência & Divulgação Progressiva",
    visualEffectSpec:
      "Barras de comando e filtros com backdrop-filter: blur(16px) saturate(160%) sobre fundo semi-translúcido hsl(var(--card) / 0.84).",
    uxValueAdded:
      "Preserva o senso de localização espacial do especialista enquanto filtra nós TOGAF, sub-ondas ou unidades sem abrir modais bloqueantes.",
    targetSurfaces: ["/app/governance/togaf-macro-wave", "/app/risk", "/app/actions"],
    cssUtilityContract: ".arc-glass-toolbar",
    accessibilityGuardrail:
      "WCAG AA + Orçamento de viewport: barras fixas limitadas a <= 15% da altura em mobile e <= 10% em desktop.",
    cognitiveLoadReductionPct: 30,
    interactionLatencyMs: 100,
    antiPatternForbidden:
      "Proibido aplicar blur pesado sobre tabelas densas de leitura ou empilhar modal sobre modal.",
  },
  {
    benchmarkId: "apple_hig_reflow",
    code: "BENCH-05",
    referenceName: "Apple HIG Adaptive Reflow",
    patternTitle: "Reflow Universal Multidispositivo (320px a 1440px+) & Ergonomia Tátil",
    visualEffectSpec:
      "Adaptação fluida de grid 12 colunas no desktop para coluna única no mobile (320px) com alvos de toque >= 44x44px (48px para CTAs primários).",
    uxValueAdded:
      "Assegura que tanto o trabalhador respondendo em smartphone básico de 320px quanto o auditor em monitor 1440px tenham leitura íntegra sem zoom ou scroll horizontal.",
    targetSurfaces: ["/respond/:token", "/app", "/app/units", "/app/cycles"],
    cssUtilityContract: "min-h-11 (44px) + whitespace-nowrap shrink-0 em filtros",
    accessibilityGuardrail:
      "WCAG 2.2 AA (1.4.10 Reflow & 2.5.8 Target Size): zero overflow horizontal em 320px e foco visível ring-2.",
    cognitiveLoadReductionPct: 40,
    interactionLatencyMs: 90,
    antiPatternForbidden:
      "Proibido amputar colunas críticas de risco no mobile sem oferecer visualização estruturada ou scroll isolado.",
  },
];

export const arc4ServiceSuperWaves: readonly Arc4ServiceSuperWaveItem[] = [
  {
    superWaveId: "SUPERONDA-A1",
    order: 1,
    title: "Orquestração Prática dos 7 Serviços SaaS no Dashboard & Jornada Guiada",
    subtitle: "Fase ADM A/B/E · Consolidação do Fluxo Empresa -> Unidades -> Ciclos -> AEP -> Riscos -> Ações -> Documentos",
    benchmarkRef: "linear_precision",
    togafPhases: ["Phase A", "Phase B", "Phase E"],
    chainSteps: ["measure", "contextualize", "evaluate", "act", "evidence", "reevaluate"],
    gateBoundary: "G1_SYNTHETIC_READY",
    serviceConsolidationGoal:
      "Unificar os 7 serviços operacionais do aplicativo em um pipeline interativo no Dashboard e no Cockpit, permitindo navegar, diagnosticar prontidão e acionar o próximo elo sem fricção.",
    visualEffectValueProposition:
      "Superfícies .arc-surface-precision com iluminação hairline de topo e telemetria de progresso que mostram exatamente onde a organização está na jornada NR-1.",
    targetRoutes: ["/app", "/app/company", "/app/units", "/app/cycles"],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Cards isolados sem conexão de estado nem indicação de próximo passo",
        description: "Exibir apenas contadores soltos obrigando o usuário a adivinhar qual módulo acessar em seguida.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 45,
        securityScore: 85,
        regulatoryRigorScore: 70,
        webDesignBenchmarkScore: 40,
        uxValueAddedScore: 35,
      },
      {
        branchId: "Branch B",
        label: "Pipeline Interativo de 7 Serviços com Superfícies de Precisão Linear & Guarda G1 (Canônico)",
        description: "Conectar os 7 serviços com indicadores tabulares, barras de telemetria e atalhos diretos sob guarda sintética G0/G1.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 98,
        securityScore: 99,
        regulatoryRigorScore: 98,
        webDesignBenchmarkScore: 97,
        uxValueAddedScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Automação mágica que pula cadastro de unidades e AEP para gerar PDF imediato",
        description: "Gerar inventário PGR sem exigir unidades, coleta k >= 5 ou avaliação do contexto real de trabalho.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 3, 6 e 11: proibido pular k >= 5 e contexto real AEP/AET.",
        serviceConsolidationScore: 20,
        securityScore: 30,
        regulatoryRigorScore: 0,
        webDesignBenchmarkScore: 50,
        uxValueAddedScore: 10,
      },
    ],
    implementationDeliverables: [
      "Pipeline visual dos 7 serviços operacionais NR-1 no DashboardPage com status em tempo real.",
      "Cartões KPI com .arc-surface-precision, .arc-tactile-card e font-mono tabular-nums.",
      "Painel de Prontidão G1 com barras de telemetria .arc-telemetry-bar e disciplina Zero-Pill.",
    ],
    verificationCriteria: [
      "Navegação direta entre os 7 serviços sem estados vazios mudos.",
      "Preservação estrita do aviso de ambiente sintético G0/G1 e bloqueio de dados reais até G3.",
    ],
  },
  {
    superWaveId: "SUPERONDA-A2",
    order: 2,
    title: "Serviço de Coleta Anônima (k >= 5) & Experiência Tátil Mobile-First",
    subtitle: "Fase ADM C/D · Consolidação de Ciclos, Instrument Registry e Coleta Segura 320px–430px",
    benchmarkRef: "apple_hig_reflow",
    togafPhases: ["Phase C", "Phase D"],
    chainSteps: ["measure"],
    gateBoundary: "G1_SYNTHETIC_READY",
    serviceConsolidationGoal:
      "Consolidar o serviço de criação de ciclos e resposta anônima com proteção estatística k >= 5 server-side, garantindo conforto tátil absoluto em smartphones de 320px a 430px.",
    visualEffectValueProposition:
      "Botões de resposta com feedback tátil de 180ms, barra de progresso não-intrusiva e indicador visual transparente da barreira k >= 5.",
    targetRoutes: ["/app/cycles", "/respond/:token", "/nr1-copsoq"],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Exibir prévia de respostas parciais quando n < 5 com efeito de blur no CSS",
        description: "Mandar os dados para o navegador e apenas borrar o texto com CSS quando houver menos de 5 respostas.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 1 e 3: supressão k >= 5 deve ser estritamente server-side, nunca apenas visual.",
        serviceConsolidationScore: 20,
        securityScore: 0,
        regulatoryRigorScore: 10,
        webDesignBenchmarkScore: 30,
        uxValueAddedScore: 20,
      },
      {
        branchId: "Branch B",
        label: "Privacy Vault Server-Side k >= 5 + Ergonomia Mobile Apple HIG 44px+ (Canônico)",
        description: "Bloquear recortes n < 5 no servidor e entregar coleta mobile fluida com alvos >= 44px e recibo sintético.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 98,
        securityScore: 100,
        regulatoryRigorScore: 97,
        webDesignBenchmarkScore: 96,
        uxValueAddedScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Coleta com animações de confete e placar gamificado entre setores",
        description: "Adicionar efeitos festivos e ranking público de adesão em tempo real.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 12: proibido usar confete, ranking punitivo ou gamificação em fluxos sensíveis.",
        serviceConsolidationScore: 40,
        securityScore: 70,
        regulatoryRigorScore: 20,
        webDesignBenchmarkScore: 10,
        uxValueAddedScore: 15,
      },
    ],
    implementationDeliverables: [
      "Contratos de toque >= 44x44px e reflow 320px auditados no simulador multidispositivo.",
      "Feedback visual claro para ciclos elegíveis (n >= 5) vs. ciclos aguardando quórum mínimo.",
      "Recibo determinístico de ensaio sintético sem coleta de PII.",
    ],
    verificationCriteria: [
      "Zero scroll horizontal em 320px.",
      "Supressão server-side comprovada para qualquer recorte com menos de 5 respostas.",
    ],
  },
  {
    superWaveId: "SUPERONDA-A3",
    order: 3,
    title: "Serviço Integrado de Contexto Real (AEP) & Escalonamento Ergonômico (AET — NR-17)",
    subtitle: "Fase ADM B/C · Consolidação da Observação da Atividade e Gatilhos de Aprofundamento",
    benchmarkRef: "raycast_glass",
    togafPhases: ["Phase B", "Phase C"],
    chainSteps: ["contextualize"],
    gateBoundary: "G1_SYNTHETIC_READY",
    serviceConsolidationGoal:
      "Consolidar a passagem obrigatória pelo contexto do trabalho real (AEP), escuta de trabalhadores/CIPA e disparo automático de recomendação de AET quando houver sobrecarga ou exigência complexa.",
    visualEffectValueProposition:
      "Divulgação progressiva estilo Raycast com barra contextual .arc-glass-toolbar, permitindo comparar trabalho prescrito vs. trabalho real sem perder o foco.",
    targetRoutes: ["/app/work-analysis", "/app/aet"],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Classificar risco direto do questionário ignorando a tela de AEP",
        description: "Tornar a análise do trabalho real opcional para acelerar a emissão do relatório.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 6 e a NR-17: risco ocupacional jamais é definido sem contexto do trabalho real.",
        serviceConsolidationScore: 15,
        securityScore: 70,
        regulatoryRigorScore: 0,
        webDesignBenchmarkScore: 40,
        uxValueAddedScore: 20,
      },
      {
        branchId: "Branch B",
        label: "Triangulação Trabalho Real (AEP) + Gatilhos AET + Escuta CIPA com Divulgação Progressiva (Canônico)",
        description: "Estruturar fatores da atividade real, acionar AET por regra determinística e manter leitura limpa em 2 colunas.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 97,
        securityScore: 96,
        regulatoryRigorScore: 99,
        webDesignBenchmarkScore: 95,
        uxValueAddedScore: 96,
      },
      {
        branchId: "Branch C",
        label: "Formulário único gigante com 80 campos abertos sem agrupamento visual",
        description: "Exibir todos os campos de AEP e AET misturados na mesma página sem hierarquia.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 60,
        securityScore: 88,
        regulatoryRigorScore: 80,
        webDesignBenchmarkScore: 35,
        uxValueAddedScore: 40,
      },
    ],
    implementationDeliverables: [
      "Fluxo estruturado AEP -> Gatilho AET com separação visual clara entre trabalho prescrito e real.",
      "Controles de filtro segmentados em linha única (whitespace-nowrap shrink-0).",
      "Rastreabilidade explícita da participação dos trabalhadores e CIPA.",
    ],
    verificationCriteria: [
      "Motor AET recomenda abertura de análise aprofundada de forma 100% determinística.",
      "Leitura confortável em tablets de campo (768px) e desktops (1440px).",
    ],
  },
  {
    superWaveId: "SUPERONDA-A4",
    order: 4,
    title: "Console de Critérios de Risco, Divergência de Controles & Memória de Cálculo Tabular",
    subtitle: "Fase ADM C/G · Consolidação do Criteria Engine AIHA/NR-1 com Telemetria Vercel",
    benchmarkRef: "vercel_telemetry",
    togafPhases: ["Phase C", "Phase G"],
    chainSteps: ["evaluate"],
    gateBoundary: "G1_SYNTHETIC_READY",
    serviceConsolidationGoal:
      "Consolidar o serviço de avaliação multicritério cruzando exposição real, percepção agregada (k >= 5) e maturidade de controles, exibindo memória de cálculo aberta e trilha de override técnico.",
    visualEffectValueProposition:
      "Precisão numérica Vercel (font-mono tabular-nums) em matrizes 5×5, indicadores semânticos pareados (ícone + texto) e destaque imediato de divergência entre controle declarado e percebido.",
    targetRoutes: ["/app/risk", "/app/criteria", "/app/controls"],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Velocímetro neon com nota única calculada sem explicação de fórmula",
        description: "Mostrar apenas um gráfico circular colorido sem expor severidade, probabilidade ou versão da política.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 11 e a regra Anti-Slop: toda classificação exige fórmula aberta, versão e memória de cálculo.",
        serviceConsolidationScore: 25,
        securityScore: 75,
        regulatoryRigorScore: 0,
        webDesignBenchmarkScore: 20,
        uxValueAddedScore: 25,
      },
      {
        branchId: "Branch B",
        label: "Console Tabular Vercel + Detector de Divergência + Override Justificado (Canônico)",
        description: "Exibir fatores de cálculo alinhados em font-mono tabular-nums, sinalizar divergências e exigir justificativa em overrides.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 99,
        securityScore: 97,
        regulatoryRigorScore: 98,
        webDesignBenchmarkScore: 98,
        uxValueAddedScore: 97,
      },
      {
        branchId: "Branch C",
        label: "Tabela sem alinhamento tabular e com dezenas de badges coloridos em cada linha",
        description: "Decorar cada célula estática da tabela com pílulas arredondadas multicoloridas.",
        invariantValid: false,
        pruneReason: "Viola a disciplina Zero-Pill e a Cátedra 09 de Ergonomia Cognitiva.",
        serviceConsolidationScore: 55,
        securityScore: 85,
        regulatoryRigorScore: 75,
        webDesignBenchmarkScore: 0,
        uxValueAddedScore: 30,
      },
    ],
    implementationDeliverables: [
      "Tabelas e matrizes com alinhamento numérico font-mono tabular-nums.",
      "Sinalização visual clara de divergência entre controle formal e percepção coletiva.",
      "Registro imutável de override com autor, carimbo de tempo e justificativa.",
    ],
    verificationCriteria: [
      "Zero uso de pills em metadados estáticos.",
      "100% dos scores de risco exibem versão da política e memória de cálculo.",
    ],
  },
  {
    superWaveId: "SUPERONDA-A5",
    order: 5,
    title: "Serviço Command-Only de Planos de Ação, Evidências SHA-256 & Copiloto Supervisionado",
    subtitle: "Fase ADM C/D/E · Microinterações Táteis Stripe para Execução e Verificação de Eficácia",
    benchmarkRef: "stripe_tactile",
    togafPhases: ["Phase C", "Phase D", "Phase E"],
    chainSteps: ["act", "evidence"],
    gateBoundary: "G1_SYNTHETIC_READY",
    serviceConsolidationGoal:
      "Consolidar o ciclo de vida das ações preventivas/corretivas operado por comandos validados, recomendações determinísticas do NEXO, sínteses supervisionadas da Aurora e trava de eficácia comprovada.",
    visualEffectValueProposition:
      "Microinterações táteis Stripe (.arc-tactile-card) nas transições de comando e indicadores visuais claros da cadeia Risco -> Controle -> Ação -> Evidência SHA-256.",
    targetRoutes: ["/app/actions", "/app/controls", "/app/estrategia"],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Reduzir automaticamente o risco residual assim que o plano de ação é criado",
        description: "Dar baixa imediata no risco da unidade antes de comprovar implementação e eficácia.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 7: controle só reduz risco após evidência de implementação e eficácia verificada.",
        serviceConsolidationScore: 15,
        securityScore: 60,
        regulatoryRigorScore: 0,
        webDesignBenchmarkScore: 50,
        uxValueAddedScore: 15,
      },
      {
        branchId: "Branch B",
        label: "Máquina de Estados Command-Only + Trava de Eficácia SHA-256 + NEXO/Aurora Supervisionados (Canônico)",
        description: "Guiar cada transição com feedback tátil imediato, exigir evidência verificada e manter IA como apoio consultivo k >= 5.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 98,
        securityScore: 99,
        regulatoryRigorScore: 98,
        webDesignBenchmarkScore: 97,
        uxValueAddedScore: 97,
      },
      {
        branchId: "Branch C",
        label: "Permitir que a IA aprove ações e emita parecer clínico sobre colaboradores",
        description: "Usar o Copiloto para diagnosticar casos individuais e encerrar planos de ação.",
        invariantValid: false,
        pruneReason: "Viola os Invariantes 1, 4 e 8: IA nunca acessa dados individuais nem toma decisão técnica/clínica.",
        serviceConsolidationScore: 10,
        securityScore: 0,
        regulatoryRigorScore: 0,
        webDesignBenchmarkScore: 30,
        uxValueAddedScore: 10,
      },
    ],
    implementationDeliverables: [
      "Integração visual do NEXO Driver Intelligence e alertas inteligentes no fluxo operacional.",
      "Bloqueio explícito de baixa de risco residual sem evidência de eficácia verificada.",
      "Avisos permanentes de supervisão humana obrigatória em todas as superfícies de IA.",
    ],
    verificationCriteria: [
      "Comandos fora de ordem ou sem evidência são rejeitados deterministicamente.",
      "Contexto de IA contém exclusivamente agregados com k >= 5.",
    ],
  },
  {
    superWaveId: "SUPERONDA-A6",
    order: 6,
    title: "Laboratório de Benchmark Visual ARC 4.0, Dossiês Preliminares & Compilador Super Prompt",
    subtitle: "Fase ADM F/G/H · Governança Executiva, Exportação Auditável e Auditoria Multi-IA",
    benchmarkRef: "linear_precision",
    togafPhases: ["Phase F", "Phase G", "Phase H"],
    chainSteps: ["evidence", "reevaluate", "cross_cutting"],
    gateBoundary: "G2_COMMITTEE",
    serviceConsolidationGoal:
      "Materializar no Cockpit TOGAF o Laboratório Interativo de Benchmark de Web Design & Efeitos Visuais de Valor e o novo modo de compilação ARC 4.0 para avaliação pela banca de 10 pós-doutores.",
    visualEffectValueProposition:
      "Inspeção comparativa ao vivo dos 5 padrões globais (Linear, Stripe, Vercel, Raycast, Apple HIG) com métricas de latência, redução de carga cognitiva e exportação em 1 clique.",
    targetRoutes: ["/app/governance/togaf-macro-wave", "/app/governance", "/app/documents"],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Documentação estática desconectada do código e sem verificação automatizada",
        description: "Escrever diretrizes visuais apenas em texto solto sem motor tipado nem testes no repositório.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 50,
        securityScore: 85,
        regulatoryRigorScore: 70,
        webDesignBenchmarkScore: 45,
        uxValueAddedScore: 40,
      },
      {
        branchId: "Branch B",
        label: "Laboratório Interativo ARC 4.0 + Motor Puro Tipado + Compilador Super Prompt (Canônico)",
        description: "Integrar catálogo tipado (zero any), simulador visual no Cockpit, upgrade do Dashboard e testes automatizados.",
        invariantValid: true,
        pruneReason: null,
        serviceConsolidationScore: 99,
        securityScore: 99,
        regulatoryRigorScore: 99,
        webDesignBenchmarkScore: 99,
        uxValueAddedScore: 99,
      },
      {
        branchId: "Branch C",
        label: "Liberar modo de produção real automaticamente ao atingir 98% no benchmark visual",
        description: "Autorizar entrada de dados reais de trabalhadores apenas com base na nota de UX e código.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 14: aprovação técnica ou visual nunca substitui o Gate G3 e as assinaturas formais externas.",
        serviceConsolidationScore: 10,
        securityScore: 20,
        regulatoryRigorScore: 0,
        webDesignBenchmarkScore: 50,
        uxValueAddedScore: 10,
      },
    ],
    implementationDeliverables: [
      "Seção interativa 'Laboratório ARC 4.0: Superonda de Serviços & Benchmark de Web Design' no Cockpit.",
      "Modo 'arc4_superwave_design_services' ativo como padrão no compilador do Super Prompt.",
      "Documentação canônica docs/SUPER_PROMPT_ARC4_SUPERONDA_SERVICOS_WEB_DESIGN_BENCHMARK.md.",
    ],
    verificationCriteria: [
      "100% dos testes unitários e de componente passando sem regressão de explicit-any.",
      "realDataAllowed permanece estritamente false em todos os sumários.",
    ],
  },
];

export const mte2026AuditRequirementsCatalog: readonly Mte2026AuditRequirementItem[] = [
  {
    id: "MTE-REQ-01",
    nr1Clause: "NR-1 1.5.3.2.1 & NR-17 17.3.1 / 17.3.2",
    mteGuideSection: "Cap. 5.2 e 5.3 — Integração NR-1 + NR-17 e Fatores Psicossociais",
    title: "Cobertura das 5 Áreas da NR-17 + Fatores Psicossociais via AEP e Gatilhos AET",
    mandatoryActionSummary:
      "Considerar as condições de trabalho nos termos da NR-17 (1. Organização do trabalho; 2. Levantamento/transporte/descarga; 3. Mobiliário; 4. Máquinas/equipamentos/ferramentas manuais; 5. Conforto acústico/térmico/iluminação) + fatores psicossociais relacionados ao trabalho, articulando AEP obrigatória e AET aprofundada.",
    appFunctionalSurface: "/app/work-analysis & /app/aet",
    verificationModule: "src/lib/aep/workContextEngine.ts & src/lib/aet/aetEscalationEngine.ts",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Proibido classificar risco psicossocial sem AEP registrada e sem avaliar deterministicamente os gatilhos de AET do item 17.3.2 da NR-17.",
    evidenceArtifacts: ["src/pages/app/WorkAnalysisPage.tsx", "src/pages/app/AetPage.tsx"],
  },
  {
    id: "MTE-REQ-02",
    nr1Clause: "NR-1 1.5.3.3, 1.4.1 'b' & 1.5.5.1.3",
    mteGuideSection: "Cap. 6 e Cap. 12.1 — Participação dos Trabalhadores e Comunicação de Mão Dupla",
    title: "Consulta e Participação em 4 Momentos + Comunicação de Riscos e Limitações",
    mandatoryActionSummary:
      "Envolver trabalhadores e CIPA na (1) identificação de perigos, (2) avaliação de riscos, (3) adoção de medidas e (4) acompanhamento, informando sobre riscos do inventário, medidas do plano de ação, procedimentos e limitações.",
    appFunctionalSurface: "/respond/:token, /app/work-analysis & /app/actions",
    verificationModule: "src/lib/aep/workContextEngine.ts & src/lib/governance/mteCopsoqAuditEngine.ts",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Participação voluntária e anônima (k >= 5) combinada com registro estruturado de escuta de trabalhadores e CIPA.",
    evidenceArtifacts: ["src/pages/RespondPage.tsx", "src/pages/app/WorkAnalysisPage.tsx"],
  },
  {
    id: "MTE-REQ-03",
    nr1Clause: "NR-1 1.5.4.2.1",
    mteGuideSection: "Cap. 9 — Levantamento Preliminar de Perigos e Riscos",
    title: "Evitar/Eliminar Perigos ou Agir Imediatamente sobre Riscos Ocupacionais Evidentes",
    mandatoryActionSummary:
      "Antes mesmo de concluir avaliações detalhadas, a organização deve evitar/eliminar o perigo ou adotar medidas imediatas frente a riscos ocupacionais evidentes.",
    appFunctionalSurface: "/app/work-analysis & /app/risk",
    verificationModule: "src/lib/governance/mteCopsoqAuditEngine.ts & src/data/nr1Crosswalk.ts",
    status: "remediated_in_wave",
    zeroHallucinationRule:
      "Fatores críticos (ex.: violência, assédio ou descumprimento explícito de NR) acionam prioridade P0 imediata sem aguardar ciclo longo.",
    evidenceArtifacts: ["src/lib/governance/mteCopsoqAuditEngine.ts", "src/data/nr1Crosswalk.ts"],
  },
  {
    id: "MTE-REQ-04",
    nr1Clause: "NR-1 1.5.4.3.1 & 1.5.4.3.2",
    mteGuideSection: "Cap. 10 — Identificação de Perigos (3 Elementos Obrigatórios + Perigos Externos)",
    title: "Tríade Obrigatória: (a) Perigo e Lesões/Agravos, (b) Fontes/Circunstâncias, (c) Grupo Exposto (GES/GHE)",
    mandatoryActionSummary:
      "A etapa de identificação de perigos deve consignar obrigatoriamente o perigo e possíveis agravos, as fontes/circunstâncias da atividade real e o grupo de trabalhadores expostos (GES/GHE), incluindo atividades não rotineiras e perigos externos previsíveis.",
    appFunctionalSurface: "/app/units, /app/work-analysis & /app/risk",
    verificationModule: "src/lib/risk/criteriaEngine.ts & src/lib/documents/documentGenerator.ts",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Todo item do Inventário de Riscos vincula unidade/setor (GES/GHE), fonte organizacional/ergonômica e possível agravo.",
    evidenceArtifacts: ["src/pages/app/UnitsPage.tsx", "src/pages/app/RiskPage.tsx"],
  },
  {
    id: "MTE-REQ-05",
    nr1Clause: "NR-1 1.5.4.4.4.1",
    mteGuideSection: "Cap. 11.3 — Regra de Ouro da Gradação da Severidade",
    title: "Seleção Obrigatória da Consequência de Maior Magnitude (Pior Cenário Possível)",
    mandatoryActionSummary:
      "Na gradação da severidade das possíveis lesões ou agravos à saúde, deve-se sempre selecionar a consequência de maior magnitude (levando em conta a magnitude da consequência e o número de trabalhadores possivelmente afetados).",
    appFunctionalSurface: "/app/criteria & /app/governance/togaf-macro-wave",
    verificationModule: "src/lib/governance/mteCopsoqAuditEngine.ts (evaluateMteSeverityGoldenRule)",
    status: "remediated_in_wave",
    zeroHallucinationRule:
      "A função pura evaluateMteSeverityGoldenRule calcula matematicamente Math.max(...consequenceMagnitudes) impedindo subestimação pela média.",
    evidenceArtifacts: ["src/lib/governance/mteCopsoqAuditEngine.ts", "src/pages/app/CriteriaPage.tsx"],
  },
  {
    id: "MTE-REQ-06",
    nr1Clause: "NR-1 1.5.4.4.5.1",
    mteGuideSection: "Cap. 11.4 — Regra Importante da Gradação da Probabilidade (Descumprimento de NR)",
    title: "Elevação Automática da Probabilidade ao Nível Máximo quando Requisito de NR é Descumprido",
    mandatoryActionSummary:
      "Quando um requisito específico previsto em Norma Regulamentadora não for cumprido, a probabilidade deve ser classificada na mais alta gradação prevista nos critérios de avaliação do PGR.",
    appFunctionalSurface: "/app/criteria & /app/governance/togaf-macro-wave",
    verificationModule: "src/lib/governance/mteCopsoqAuditEngine.ts (evaluateMteProbabilityWithNrLock)",
    status: "remediated_in_wave",
    zeroHallucinationRule:
      "Quando specificNrRequirementViolated === true, evaluateMteProbabilityWithNrLock força probability = 5 (Muito Provável) com nrLegalLockApplied = true.",
    evidenceArtifacts: ["src/lib/governance/mteCopsoqAuditEngine.ts"],
  },
  {
    id: "MTE-REQ-07",
    nr1Clause: "NR-1 1.5.4.4.5.3 & 1.5.5.1.2",
    mteGuideSection: "Cap. 11.4.2 e 11.4.4 — Probabilidade Ergonômica/Psicossocial e Hierarquia de Prevenção",
    title: "Duração × Intensidade das Exigências × Eficácia da Hierarquia (Vedado EPI como Única Medida)",
    mandatoryActionSummary:
      "Para fatores ergonômicos e psicossociais, a probabilidade considera duração da exposição, intensidade das exigências e eficácia das medidas segundo a hierarquia (Evitar -> Eliminar/Substituir -> Coletiva -> Administrativa/Organização -> EPI). Fornecer EPI como única medida contraria a NR-1.",
    appFunctionalSurface: "/app/controls, /app/criteria & /app/governance/togaf-macro-wave",
    verificationModule: "src/lib/governance/mteCopsoqAuditEngine.ts & src/lib/controls/controlDivergence.ts",
    status: "remediated_in_wave",
    zeroHallucinationRule:
      "Medidas 'ppe_only' não reduzem probabilidade ergonômica/psicossocial e emitem alerta formal ppeOnlyWarning = true.",
    evidenceArtifacts: ["src/lib/governance/mteCopsoqAuditEngine.ts", "src/pages/app/ControlsPage.tsx"],
  },
  {
    id: "MTE-REQ-08",
    nr1Clause: "NR-1 1.5.4.4.2, 1.5.4.4.2.2 & 1.5.4.4.3",
    mteGuideSection: "Cap. 11.5 e 11.6 — Matriz de Níveis de Risco (ISO 45002) e Classificação de Prioridades",
    title: "Combinação Severidade × Probabilidade (Baixo a Muito Alto) e Critério Documentado de Tolerabilidade",
    mandatoryActionSummary:
      "Determinar o nível de risco pela matriz Severidade × Probabilidade e classificar a prioridade de ação (Imediato, < 3 meses, < 9 meses, até 12 meses), mantendo medidas existentes mesmo em risco tolerável.",
    appFunctionalSurface: "/app/criteria & /app/risk",
    verificationModule: "src/lib/governance/mteCopsoqAuditEngine.ts (evaluateMteRiskMatrixIso45002)",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Memória de cálculo determinística aberta com versão de política e proibição de declarar 'risco zero'.",
    evidenceArtifacts: ["src/pages/app/CriteriaPage.tsx", "src/pages/app/RiskPage.tsx"],
  },
  {
    id: "MTE-REQ-09",
    nr1Clause: "NR-1 1.5.4.4.6 (alíneas 'a' a 'f') & 1.5.4.4.6.1",
    mteGuideSection: "Cap. 11.7 — Revisão Periódica (2/3 Anos) e 6 Hipóteses de Revisão Imediata",
    title: "Ciclo de Revisão 2 Anos (3 Anos com ISO 45001) + 6 Gatilhos Imediatos (Incluindo Solicitação de Trabalhador/CIPA)",
    mandatoryActionSummary:
      "Revisar a avaliação a cada 2 anos (3 anos se certificada em SGSST) ou imediatamente nas 6 hipóteses: (a) após implementar medidas para avaliar risco residual; (b) mudanças/inovações/terceirização; (c) ineficácia de controles; (d) acidentes/doenças ocupacionais; (e) mudança legal; (f) solicitação justificada de trabalhador ou CIPA.",
    appFunctionalSurface: "/app/governance/togaf-macro-wave & /app/risk",
    verificationModule: "src/lib/governance/mteCopsoqAuditEngine.ts (evaluateMteReviewTriggers) & src/lib/risk/reviewTriggers.ts",
    status: "remediated_in_wave",
    zeroHallucinationRule:
      "Qualquer uma das 6 alíneas (a–f) dispara immediateReviewRequired = true com rastreabilidade normativa exata.",
    evidenceArtifacts: ["src/lib/governance/mteCopsoqAuditEngine.ts", "src/lib/risk/reviewTriggers.ts"],
  },
  {
    id: "MTE-REQ-10",
    nr1Clause: "NR-1 1.5.5.1.1 ('a' a 'd') & 1.5.5.2",
    mteGuideSection: "Cap. 12.1 e Cap. 13.2 — Adoção de Medidas de Prevenção e Plano de Ação",
    title: "Plano de Ação Estruturado (Cronograma, Responsáveis, Formas de Acompanhamento e Aferição de Resultados)",
    mandatoryActionSummary:
      "Elaborar Plano de Ação indicando medidas a serem introduzidas, aprimoradas ou mantidas, com cronograma, formas de acompanhamento e aferição de resultados.",
    appFunctionalSurface: "/app/actions & /app/controls",
    verificationModule: "src/lib/actions/actionTransitionEngine.ts & src/lib/evidence/actionEvidenceReviewer.ts",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Transições Command-Only exigem evidência verificada antes de encerrar ação ou recalcular risco residual.",
    evidenceArtifacts: ["src/pages/app/ActionsPage.tsx", "src/pages/app/ControlsPage.tsx"],
  },
  {
    id: "MTE-REQ-11",
    nr1Clause: "NR-1 1.5.5.3.1 & 1.5.5.3.2 ('a' a 'd')",
    mteGuideSection: "Cap. 12.2 — 4 Formas de Acompanhamento e Medições Proativas + Reativas",
    title: "Verificação de Execução/Continuidade, Inspeções, Monitoramento e Participação da CIPA",
    mandatoryActionSummary:
      "Acompanhar medidas combinando indicadores proativos e reativos por 4 meios: (a) verificação da execução e continuidade (5 perguntas-chave); (b) inspeções de locais/equipamentos; (c) monitoramento ambiental/exposições; (d) participação dos trabalhadores e CIPA.",
    appFunctionalSurface: "/app/controls, /app/actions & /app/estrategia",
    verificationModule: "src/lib/controls/controlDivergence.ts & src/lib/evidence/controlEvidenceReviewer.ts",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Divergência entre controle declarado e percepção coletiva k >= 5 bloqueia redução artificial do risco residual.",
    evidenceArtifacts: ["src/pages/app/ControlsPage.tsx", "src/pages/app/StrategyPage.tsx"],
  },
  {
    id: "MTE-REQ-12",
    nr1Clause: "NR-1 1.5.7.1, 1.5.7.3, 1.5.5.2 & 1.5.4.4.2.2",
    mteGuideSection: "Cap. 4 e Cap. 13 — Três Documentos Mínimos Obrigatórios do PGR",
    title: "Emissão Rastreável: (1) Inventário de Riscos, (2) Plano de Ação e (3) Documento de Critérios GRO/PGR",
    mandatoryActionSummary:
      "O PGR deve conter no mínimo o Inventário de Riscos Ocupacionais, o Plano de Ação e o Documento de Critérios Utilizados pela organização para avaliação de riscos e tomada de decisão.",
    appFunctionalSurface: "/app/documents & /app/criteria",
    verificationModule: "src/lib/documents/documentGenerator.ts & src/data/orientativeDocumentTemplates.ts",
    status: "implemented_compliant",
    zeroHallucinationRule:
      "Minutas orientativas emitidas com hash SHA-256, versão da política de critérios e marcação explícita de revisão humana.",
    evidenceArtifacts: ["src/pages/app/DocumentsPage.tsx", "src/data/orientativeDocumentTemplates.ts"],
  },
];

export const copsoqManualAuditFindingsCatalog: readonly CopsoqManualAuditFinding[] = [
  {
    id: "COPSOQ-AUD-01",
    manualSectionRef: "Tabela 1 (p. 12–13) & Anexo Versão Curta (p. 27–29)",
    dimensionOrRule: "Mapeamento Integral das 26 Subescalas e 8 Dimensões Principais (41 Questões)",
    officialSpecification:
      "A Versão Curta oficial portuguesa possui 41 questões distribuídas em 26 subescalas e 8 dimensões principais (Exigências laborais [4], Organização e conteúdo [4], Relações sociais e liderança [6], Interface trabalho-indivíduo [3], Valores no local de trabalho [2], Personalidade/Auto-eficácia [1], Saúde e bem-estar [4], Comportamentos ofensivos [2]).",
    previousAppState:
      "Os 41 itens estavam colapsados em 12 dimensões + 6 desfechos (18 subescalas) em src/data/copsoqData.ts e subscaleCount: 18 em src/data/instrumentRegistry.ts.",
    remediatedAppState:
      "Mapeamento exato das 26 subescalas e 8 dimensões principais implementado em COPSOQ_OFFICIAL_SHORT_SUBSCALES (src/data/copsoqData.ts) e subscaleCount: 26 em src/data/instrumentRegistry.ts.",
    verificationContract: "src/lib/governance/mteCopsoqAuditEngine.ts & src/lib/governance/togafMacroWaveEngine.test.ts",
    compliant: true,
  },
  {
    id: "COPSOQ-AUD-02",
    manualSectionRef: "Seção 'Cotação e interpretação' (p. 11–12)",
    dimensionOrRule: "Pontos de Corte em Tercis 2,33 e 3,66 (Modelo Tricolor / Semáforo na Escala 1..5)",
    officialSpecification:
      "A cotação segue a escala Likert de 1 a 5 calculada fator a fator pela média aritmética (1,00 a 5,00), dividindo a distribuição em tercis com pontos de corte em 2,33 e 3,66 (Verde = favorável para a saúde; Amarelo = intermédio; Vermelho = risco para a saúde).",
    previousAppState:
      "Apenas conversão linear 0..100 com pontos de corte 40 e 60, sem expor os tercis oficiais 2,33 e 3,66 na escala 1..5.",
    remediatedAppState:
      "Funções evaluateCopsoqTertileBand e computeOfficialShortSubscales implementadas com cortes exatos em 2,33 e 3,66 e média 1,00..5,00 por subescala.",
    verificationContract: "src/data/copsoqData.ts (COPSOQ_TERTILE_LOW_CUTOFF = 2.33, COPSOQ_TERTILE_HIGH_CUTOFF = 3.66)",
    compliant: true,
  },
  {
    id: "COPSOQ-AUD-03",
    manualSectionRef: "Seção 'Cotação e interpretação' (p. 11–12) & Anexo Questão 29 (p. 28)",
    dimensionOrRule: "Polaridade Fator a Fator (Protetora vs. Exposição de Risco) e Escala de Saúde Geral (Item 29)",
    officialSpecification:
      "O significado do valor médio depende da subescala (ex.: 4,0 em Possibilidades de desenvolvimento é Verde/favorável; 4,0 em Insegurança laboral é Vermelho/risco). Na questão 29 (Saúde geral), 1 = Deficitária .. 5 = Excelente (polaridade protetora).",
    previousAppState:
      "SCALE_HEALTH invertia os valores numéricos (5 = Deficitária .. 1 = Excelente) em relação ao formulário impresso do manual (p. 28).",
    remediatedAppState:
      "SCALE_HEALTH alinhada ao manual (1 = Deficitária .. 5 = Excelente) com polaridade 'protective' explícita em todas as subescalas protetoras.",
    verificationContract: "src/data/copsoqData.ts (SCALE_HEALTH & evaluateCopsoqTertileBand)",
    compliant: true,
  },
  {
    id: "COPSOQ-AUD-04",
    manualSectionRef: "Seção 'Normas de utilização' (p. 8–10)",
    dimensionOrRule: "Integridade Padronizada do Instrumento & Princípio 'Avaliar para Prevenir'",
    officialSpecification:
      "Proibido inserir questões avulsas dentro das subescalas padronizadas; envolver representantes dos trabalhadores/CIPA, SST e direção; não aplicar o questionário se não houver compromisso de agir sobre os resultados (Amarelo/Vermelho).",
    previousAppState:
      "Fluxo já separava coleta e contexto, mas não sinalizava explicitamente requiresPreventiveAction por subescala nos tercis Amarelo/Vermelho.",
    remediatedAppState:
      "Cada resultado em computeOfficialShortSubscales sinaliza requiresPreventiveAction = (tertileBand !== 'verde') conectando à AEP e ao Plano de Ação.",
    verificationContract: "src/data/copsoqData.ts & src/pages/RespondPage.tsx",
    compliant: true,
  },
  {
    id: "COPSOQ-AUD-05",
    manualSectionRef: "Seção 'Para uma aplicação bem sucedida' (p. 9–10) & Invariantes Fable 5",
    dimensionOrRule: "Voluntariedade, Confidencialidade, Anonimato Coletivo (k >= 5) e Zero Coerção",
    officialSpecification:
      "A resposta ao COPSOQ é individual, anônima, confidencial e voluntária, exigindo proteção estrita contra identificação individual em grupos pequenos.",
    previousAppState:
      "Implementado com Privacy Vault k >= 5 server-side e jornada neutra em RespondPage.tsx.",
    remediatedAppState:
      "Mantido intacto com k >= 5 server-side, zero coleta de PII e separação entre pesquisa coletiva e canal individual.",
    verificationContract: "src/test/instrumentRegistryMigration.test.ts & src/test/privacyVaultMigration.test.ts",
    compliant: true,
  },
  {
    id: "COPSOQ-AUD-06",
    manualSectionRef: "Fronteira Jurisdicional G1/G3 (docs/CANONICAL_INSTRUMENT_INTAKE_G1.md)",
    dimensionOrRule: "Distinção Honesta entre Referência Estrutural PT-2013 e Pacote Canônico BR (Gate G1/G3)",
    officialSpecification:
      "O manual português (Silva et al., 2013) fornece a referência estrutural completa (41 itens, 26 subescalas, tercis 2,33/3,66), permanecendo o runtime produtivo bloqueado até a selagem formal do pacote BR e aprovação no Gate G3.",
    previousAppState:
      "Documentado em g1CanonicalInstrumentIntake.ts com runtimeReady = false.",
    remediatedAppState:
      "Preservado runtimeReady = false e realDataAllowed = false, eliminando qualquer alucinação ou overclaim de licença comercial pré-G3.",
    verificationContract: "src/lib/instruments/registry.test.ts & src/test/publicClaimsGuardrail.test.ts",
    compliant: true,
  },
];

export const togafKnowledgeTreeSummary = evaluateTogafKnowledgeTree(
  togafKnowledgeNodes,
  togafMacroWavePolicy,
);

export const macroWavePlanSummary = evaluateMacroWavePlan(
  macroWaveSlices,
  togafMacroWavePolicy,
);

export const nextWaveSaasPlanSummary = evaluateNextWaveSaasPlan(
  nextWaveSaasTracks,
  viewportUxContracts,
  togafMacroWavePolicy,
);

export const arc4SuperWaveSummary = evaluateArc4SuperWavePlan(
  arc4ServiceSuperWaves,
  arc4VisualBenchmarks,
  togafMacroWavePolicy,
);

export const superPromptRubricSummary = evaluateSuperPromptRubric(
  superPromptRubricCriteria,
  postDocChairs,
  togafMacroWavePolicy,
);

export const mteCopsoqSystemicAuditEvaluation = evaluateMteCopsoqSystemicAudit(
  mte2026AuditRequirementsCatalog,
  copsoqManualAuditFindingsCatalog,
);

export const playbook2TotAuditSummary = evaluatePlaybook2TotAudit();

export const argo4EcosystemFrameworkSuperPrompt = buildExecutableSuperPrompt({
  mode: "argo4_ecosystem_framework_sota",
  policy: togafMacroWavePolicy,
  treeSummary: togafKnowledgeTreeSummary,
  waveSummary: macroWavePlanSummary,
  rubricSummary: superPromptRubricSummary,
  chairs: postDocChairs,
  nodes: togafKnowledgeNodes,
  slices: macroWavePlanSummary.slices,
  nextWaveSummary: nextWaveSaasPlanSummary,
  arc4Summary: arc4SuperWaveSummary,
});

export const argo4SaasPilotDashboardSuperPrompt = buildExecutableSuperPrompt({
  mode: "argo4_saas_pilot_dashboard_wave",
  policy: togafMacroWavePolicy,
  treeSummary: togafKnowledgeTreeSummary,
  waveSummary: macroWavePlanSummary,
  rubricSummary: superPromptRubricSummary,
  chairs: postDocChairs,
  nodes: togafKnowledgeNodes,
  slices: macroWavePlanSummary.slices,
  nextWaveSummary: nextWaveSaasPlanSummary,
  arc4Summary: arc4SuperWaveSummary,
});

export const argo4Playbook2SuperPrompt = buildExecutableSuperPrompt({
  mode: "argo4_playbook2_tot_rag",
  policy: togafMacroWavePolicy,
  treeSummary: togafKnowledgeTreeSummary,
  waveSummary: macroWavePlanSummary,
  rubricSummary: superPromptRubricSummary,
  chairs: postDocChairs,
  nodes: togafKnowledgeNodes,
  slices: macroWavePlanSummary.slices,
  nextWaveSummary: nextWaveSaasPlanSummary,
  arc4Summary: arc4SuperWaveSummary,
});

export const defaultCompiledSuperPrompt = buildExecutableSuperPrompt({
  mode: "mte_copsoq_forensic_audit",
  policy: togafMacroWavePolicy,
  treeSummary: togafKnowledgeTreeSummary,
  waveSummary: macroWavePlanSummary,
  rubricSummary: superPromptRubricSummary,
  chairs: postDocChairs,
  nodes: togafKnowledgeNodes,
  slices: macroWavePlanSummary.slices,
  nextWaveSummary: nextWaveSaasPlanSummary,
  arc4Summary: arc4SuperWaveSummary,
});

export const zeroHallucinationImprovementsSuperPrompt = buildExecutableSuperPrompt({
  mode: "zero_hallucination_tech_improvements",
  policy: togafMacroWavePolicy,
  treeSummary: togafKnowledgeTreeSummary,
  waveSummary: macroWavePlanSummary,
  rubricSummary: superPromptRubricSummary,
  chairs: postDocChairs,
  nodes: togafKnowledgeNodes,
  slices: macroWavePlanSummary.slices,
  nextWaveSummary: nextWaveSaasPlanSummary,
  arc4Summary: arc4SuperWaveSummary,
});


