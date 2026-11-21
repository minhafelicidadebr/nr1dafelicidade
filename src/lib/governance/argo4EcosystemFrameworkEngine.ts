export type EcosystemLayerId =
  | "ECO-L1"
  | "ECO-L2"
  | "ECO-L3"
  | "ECO-L4"
  | "ECO-L5"
  | "ECO-L6"
  | "ECO-L7"
  | "ECO-L8";

export interface EcosystemTotBranch {
  readonly branchId: "Branch A" | "Branch B" | "Branch C";
  readonly label: string;
  readonly description: string;
  readonly invariantValid: boolean;
  readonly pruneReason: string | null;
  readonly archPurityScore: number;
  readonly runtimeResilienceScore: number;
  readonly regulatoryPsychometricScore: number;
  readonly uxDesignSotaScore: number;
  readonly ciVerifiabilityScore: number;
}

export interface EvaluatedEcosystemTotBranch extends EcosystemTotBranch {
  readonly utilityScore: number;
}

export interface EcosystemFrameworkLayer {
  readonly layerId: EcosystemLayerId;
  readonly order: number;
  readonly title: string;
  readonly domain: string;
  readonly architecturalProblemSolved: string;
  readonly stateOfTheArtPattern: string;
  readonly canonicalModules: readonly string[];
  readonly invariantContracts: readonly string[];
  readonly totBranches: readonly EcosystemTotBranch[];
}

export interface EvaluatedEcosystemFrameworkLayer extends EcosystemFrameworkLayer {
  readonly evaluatedBranches: readonly EvaluatedEcosystemTotBranch[];
  readonly winningBranch: EvaluatedEcosystemTotBranch;
  readonly prunedBranchesCount: number;
}

export interface EcosystemFrameworkSummary {
  readonly frameworkCode: string;
  readonly version: string;
  readonly totalLayers: number;
  readonly averageWinningUtility: number;
  readonly allLayersVerified: boolean;
  readonly layers: readonly EvaluatedEcosystemFrameworkLayer[];
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

function clamp100(value: number): number {
  if (Number.isNaN(value) || value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * Equação Formal Tree of Thoughts (ToT) — Ecossistema & Framework Técnico Estado da Arte (ARGO 4.0):
 * U_ECO(b) = V_inv(b) * (0.25 * S_arch_purity + 0.20 * S_runtime_resilience + 0.20 * S_regulatory_psychometric + 0.20 * S_ux_design_sota + 0.15 * S_ci_verifiability)
 */
export function computeEcosystemTotUtility(branch: EcosystemTotBranch): number {
  if (!branch.invariantValid) {
    return 0;
  }
  const weighted =
    0.25 * clamp100(branch.archPurityScore) +
    0.2 * clamp100(branch.runtimeResilienceScore) +
    0.2 * clamp100(branch.regulatoryPsychometricScore) +
    0.2 * clamp100(branch.uxDesignSotaScore) +
    0.15 * clamp100(branch.ciVerifiabilityScore);
  return Number(weighted.toFixed(2));
}

export const ARGO4_ECOSYSTEM_FRAMEWORK_LAYERS: readonly EcosystemFrameworkLayer[] = [
  {
    layerId: "ECO-L1",
    order: 1,
    title: "Kernel de Runtime Dual-Mode (Data Gate Fail-Closed + Motor Sintético Local Resiliente)",
    domain: "Infraestrutura de Runtime, Segurança de Rede & Resiliência Offline-First",
    architecturalProblemSolved:
      "Impede que o bloqueio constitucional de banco remoto no Gate G0/G1 quebre a navegação das 14 telas internas (/app/*) quando o daemon local 127.0.0.1:54321 não estiver rodando no navegador do avaliador.",
    stateOfTheArtPattern:
      "Interceptador determinístico em duas camadas: (1) Data Gate Fail-Closed que rejeita qualquer URL remota antes da chamada de rede; (2) Kernel Sintético Local in-memory/localStorage que responde a chamadas PostgREST/RPC locais quando o daemon local está offline.",
    canonicalModules: [
      "src/lib/runtime/dataGate.ts",
      "src/lib/runtime/syntheticPilotSession.ts",
      "src/lib/runtime/supabaseConfig.ts",
      "src/components/AuthGuard.tsx",
    ],
    invariantContracts: [
      "src/lib/runtime/dataGate.test.ts",
      "src/test/supabaseClientRuntimeConfig.test.ts",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Desativar o Data Gate e conectar direto a um banco remoto em nuvem antes do Gate G3",
        description: "Permitir tráfego de dados para servidor externo sem as aprovações formais de DPO, SST e Jurídico.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 14 e a Constituição Fable 5 (No-Go para dados reais e serviços remotos antes de G3).",
        archPurityScore: 20,
        runtimeResilienceScore: 60,
        regulatoryPsychometricScore: 10,
        uxDesignSotaScore: 50,
        ciVerifiabilityScore: 0,
      },
      {
        branchId: "Branch B",
        label: "Data Gate Fail-Closed para Nuvem + Kernel Sintético Local Determinístico para 127.0.0.1 (Canônico)",
        description: "Bloquear 100% de chamadas remotas e prover fallback sintético local tipado quando o daemon local não estiver ativo.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 99,
        runtimeResilienceScore: 100,
        regulatoryPsychometricScore: 98,
        uxDesignSotaScore: 99,
        ciVerifiabilityScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Falhar com erro genérico 'Failed to fetch' quando 127.0.0.1:54321 estiver offline",
        description: "Travar o acesso ao Dashboard no preview web sempre que o usuário não tiver Docker/Supabase CLI rodando localmente.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 75,
        runtimeResilienceScore: 30,
        regulatoryPsychometricScore: 85,
        uxDesignSotaScore: 35,
        ciVerifiabilityScore: 80,
      },
    ],
  },
  {
    layerId: "ECO-L2",
    order: 2,
    title: "Vault de Privacidade Estatística (k >= 5 Server-Side) & Motor Psicométrico COPSOQ II (41/26)",
    domain: "Privacidade Diferencial/Estatística, RLS Zero-Trust & Psicometria Aplicada",
    architecturalProblemSolved:
      "Garante matematicamente que nenhum gestor ou consultor acesse respostas individuais ou deduza identidades em grupos pequenos, mantendo fidelidade estrita à Versão Curta do COPSOQ II.",
    stateOfTheArtPattern:
      "Isolamento total de microdados via RLS deny-by-default, RPCs agregadoras com supressão para n < 5 e motor puro de cotação das 26 subescalas (41 itens) em tercis exatos (2,33 e 3,66) respeitando a polaridade de cada fator.",
    canonicalModules: [
      "src/lib/privacy.ts",
      "src/lib/api/privacyVault.ts",
      "src/data/copsoqData.ts",
      "src/lib/instruments/registry.ts",
    ],
    invariantContracts: [
      "src/lib/governance/togafMacroWaveEngine.test.ts",
      "supabase/tests/privacy_vault_contract.sql",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Cálculo de médias e ocultação de n < 5 apenas no front-end React",
        description: "Trafegar respostas individuais no payload JSON e filtrar somente na camada visual.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 1, 2 e 3 (microdados jamais podem sair do servidor para papéis organizacionais).",
        archPurityScore: 15,
        runtimeResilienceScore: 50,
        regulatoryPsychometricScore: 0,
        uxDesignSotaScore: 40,
        ciVerifiabilityScore: 10,
      },
      {
        branchId: "Branch B",
        label: "Privacy Vault Server-Side k >= 5 + Motor Puro 26 Subescalas COPSOQ II com Tercis 2,33/3,66 (Canônico)",
        description: "Supressão estrita no servidor/contrato RPC e cálculo aritmético determinístico auditado contra o Manual COPSOQ II Portugal 2013.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 100,
        runtimeResilienceScore: 98,
        regulatoryPsychometricScore: 100,
        uxDesignSotaScore: 98,
        ciVerifiabilityScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Pontos de corte arbitrários sem distinção de polaridade das subescalas",
        description: "Usar percentis genéricos sem respeitar os tercis 2,33 e 3,66 e as 8 dimensões oficiais.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 4 e 5 (adulteração da regra de escore oficial do instrumento).",
        archPurityScore: 40,
        runtimeResilienceScore: 70,
        regulatoryPsychometricScore: 15,
        uxDesignSotaScore: 60,
        ciVerifiabilityScore: 50,
      },
    ],
  },
  {
    layerId: "ECO-L3",
    order: 3,
    title: "Motor Normativo MTE 2026 (GRO/PGR Cap. 1.5 NR-1) & Ergonomia da Atividade Real (AEP/AET NR-17)",
    domain: "Engenharia de Segurança do Trabalho, Ergonomia & Regras de Negócio Determinísticas",
    architecturalProblemSolved:
      "Impede o reducionismo psicométrico (tratar questionário como diagnóstico de risco) e impõe no código todas as travas normativas do Guia Oficial MTE 2026.",
    stateOfTheArtPattern:
      "Articulação obrigatória entre percepção agregada (k >= 5) e observação das 5 áreas da NR-17 na AEP/AET, combinada à Matriz ISO 45002 5x5 com Regra de Ouro da Severidade (1.5.4.4.4.1), Trava Legal de Probabilidade NR (1.5.4.4.5.1) e 6 Gatilhos de Revisão Imediata (1.5.4.4.6 a–f).",
    canonicalModules: [
      "src/lib/governance/mteCopsoqAuditEngine.ts",
      "src/lib/risk/criteriaEngine.ts",
      "src/lib/work/assessment.ts",
      "src/lib/work/aetAssessment.ts",
    ],
    invariantContracts: [
      "src/lib/governance/togafMacroWaveEngine.test.ts",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Gerar inventário de riscos do PGR automaticamente apenas com scores do questionário",
        description: "Dispensar a Avaliação Ergonômica Preliminar (AEP) e a análise das condições reais de trabalho.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 6, a NR-1 e a NR-17 (questionário nunca substitui AEP/AET).",
        archPurityScore: 30,
        runtimeResilienceScore: 65,
        regulatoryPsychometricScore: 0,
        uxDesignSotaScore: 50,
        ciVerifiabilityScore: 20,
      },
      {
        branchId: "Branch B",
        label: "Fluxo Integrado AEP/AET (5 Áreas NR-17) + Criteria Engine ISO 45002 com Travas Legais MTE 2026 (Canônico)",
        description: "Funções puras determinísticas impondo Severidade de Maior Magnitude, Trava de Probabilidade Nível 5 por NR violada e alerta contra EPI isolado.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 99,
        runtimeResilienceScore: 98,
        regulatoryPsychometricScore: 100,
        uxDesignSotaScore: 97,
        ciVerifiabilityScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Formulários estáticos de texto livre sem validação de hierarquia de controles",
        description: "Permitir registrar EPI como única medida para risco psicossocial sem alerta de não-conformidade.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 60,
        runtimeResilienceScore: 80,
        regulatoryPsychometricScore: 55,
        uxDesignSotaScore: 60,
        ciVerifiabilityScore: 70,
      },
    ],
  },
  {
    layerId: "ECO-L4",
    order: 4,
    title: "Arquitetura de Aprendizagem Pedagógica & Assistência Baseada em Evidências Zero-Alucinação (Playbook 2.0)",
    domain: "Inteligência Artificial Supervisionada, Curadoria Científica CC BY-NC-ND 4.0 & Educação Corporativa",
    architecturalProblemSolved:
      "Elimina alucinações generativas, citações falsas e jargões técnicos ('RAG') para o usuário final, entregando intervenções organizacionais fundamentadas em fontes primárias auditadas.",
    stateOfTheArtPattern:
      "Corpus determinístico fechado do Work Wellbeing Playbook 2.0 (Regier et al., 2025 · CC BY-NC-ND 4.0) cobrindo os 6 pilares DRIVER (16 drivers ativos + 2 roadmap 2026), crosswalk triplo (Playbook 2.0 <-> COPSOQ II <-> MTE 2026) e interface 100% pedagógica ('Práticas Recomendadas' e 'Assistente de Aprendizagem').",
    canonicalModules: [
      "src/lib/governance/playbook2RagEngine.ts",
      "src/data/driversData.ts",
      "src/components/DriverChatbot.tsx",
      "src/lib/aurora/contextBuilder.ts",
    ],
    invariantContracts: [
      "src/lib/governance/togafMacroWaveEngine.test.ts",
      "src/test/publicClaimsGuardrail.test.ts",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Chatbot LLM aberto sem restrição de corpus e com promessas de ROI/conformidade",
        description: "Deixar o modelo inventar estatísticas causais ou usar universidades como selo comercial do produto.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 8 e 11 e a licença CC BY-NC-ND 4.0.",
        archPurityScore: 20,
        runtimeResilienceScore: 50,
        regulatoryPsychometricScore: 0,
        uxDesignSotaScore: 40,
        ciVerifiabilityScore: 0,
      },
      {
        branchId: "Branch B",
        label: "Motor Determinístico de Citação Primária + Validador Zero-Alucinação + Linguagem Pedagógica (Canônico)",
        description: "Respostas ancoradas em autor/ano/desenho do estudo, filtragem k >= 5 no Context Builder e termos pedagógicos claros na UI.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 99,
        runtimeResilienceScore: 99,
        regulatoryPsychometricScore: 100,
        uxDesignSotaScore: 99,
        ciVerifiabilityScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Exibir telemetria bruta de engenharia de IA (RAG/ToT/U_HERO) nas páginas pedagógicas de /drivers",
        description: "Misturar metadados internos de desenvolvimento com a trilha de aprendizagem de gestores e RH.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 75,
        runtimeResilienceScore: 90,
        regulatoryPsychometricScore: 85,
        uxDesignSotaScore: 62,
        ciVerifiabilityScore: 85,
      },
    ],
  },
  {
    layerId: "ECO-L5",
    order: 5,
    title: "Núcleo Command-Only de Planos de Ação, Controles & Ledger Documental Criptográfico (SHA-256)",
    domain: "Máquinas de Estado Determinísticas, Governança de Execução & Rastreabilidade Probatória",
    architecturalProblemSolved:
      "Impede que planos de ação sejam marcados como concluídos ou que o risco residual seja reduzido sem evidência real verificada, garantindo a integridade dos 3 Documentos Mínimos do PGR.",
    stateOfTheArtPattern:
      "Contratos de comando puros (actionExecutionCore / actionCommandContract), detector de divergência entre controle declarado e percebido, exigência de hash SHA-256 nas evidências e emissão versionada de minutas orientativas com controle de concorrência.",
    canonicalModules: [
      "src/lib/actions/actionExecutionCore.ts",
      "src/lib/actions/actionGovernance.ts",
      "src/lib/controls/controlEvidence.ts",
      "src/lib/documents/orientativeTemplate.ts",
    ],
    invariantContracts: [
      "src/lib/governance/togafMacroWaveEngine.test.ts",
      "src/test/publicClaimsGuardrail.test.ts",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Baixa automática de risco residual ao criar tarefa e emissão de 'Laudo de Conformidade Garantida'",
        description: "Reduzir o risco sem verificação pós-implementação e emitir certificado prometendo conformidade automática.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 7, 8 e 11 e o item 1.5.4.4.6(a) da NR-1.",
        archPurityScore: 15,
        runtimeResilienceScore: 60,
        regulatoryPsychometricScore: 0,
        uxDesignSotaScore: 45,
        ciVerifiabilityScore: 10,
      },
      {
        branchId: "Branch B",
        label: "Máquina Command-Only + Trava de Eficácia Pós-Controle + 3 Docs Mínimos PGR com Hash SHA-256 (Canônico)",
        description: "Bloquear conclusão sem evidência, preservar histórico monotônico de versões e estampar exigência de responsável técnico habilitado.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 99,
        runtimeResilienceScore: 98,
        regulatoryPsychometricScore: 100,
        uxDesignSotaScore: 97,
        ciVerifiabilityScore: 99,
      },
      {
        branchId: "Branch C",
        label: "Lista de tarefas CRUD simples sem vínculo com riscos ou controles",
        description: "Permitir edição livre de status no banco sem passar por contratos de validação.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 7 e 10 (perda de rastreabilidade na cadeia risco -> controle -> ação -> evidência).",
        archPurityScore: 40,
        runtimeResilienceScore: 75,
        regulatoryPsychometricScore: 25,
        uxDesignSotaScore: 55,
        ciVerifiabilityScore: 45,
      },
    ],
  },
  {
    layerId: "ECO-L6",
    order: 6,
    title: "Design System de Precisão, Fotografia Full-Bleed 8K & Responsividade Universal (320px–1440px+)",
    domain: "Arquitetura de Front-End, Design Visual, Ergonomia Cognitiva & Acessibilidade WCAG AA/AAA",
    architecturalProblemSolved:
      "Elimina poluição visual ('AI slop', cartões aninhados redundantes, pílulas falsas e quebras em celulares simples de 320px), elevando a experiência visual e tátil a padrão internacional de referência.",
    stateOfTheArtPattern:
      "Faixas Hero full-bleed com fotografia hiper-realista 8K integrada por degradê direcional suave, superfícies .arc-surface-precision de nível único, disciplina Zero-Pill, tipografia tabular (font-mono tabular-nums), alvos de toque >= 44x44px e suporte nativo a prefers-reduced-motion.",
    canonicalModules: [
      "src/index.css",
      "src/pages/DriversPage.tsx",
      "src/pages/DriverWorldPage.tsx",
      "src/pages/app/DashboardPage.tsx",
      "src/data/argo4DriverHeroPrompts.ts",
    ],
    invariantContracts: [
      "src/pages/app/TogafMacroWaveWorkspacePage.test.tsx",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Grids rígidos que quebram em 320px com gamificação e confete na coleta do trabalhador",
        description: "Ignorar celulares de tela pequena e introduzir rankings/animações festivas em pesquisa psicossocial.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 12 e 13 (proibido confete/coerção e obrigatório suportar celular simples de 320px).",
        archPurityScore: 30,
        runtimeResilienceScore: 60,
        regulatoryPsychometricScore: 20,
        uxDesignSotaScore: 0,
        ciVerifiabilityScore: 30,
      },
      {
        branchId: "Branch B",
        label: "Hero Full-Bleed com Degradê WCAG AAA + Superfícies Precision + Reflow Fluido 320px–1440px+ (Canônico)",
        description: "Combinar estética cinematográfica nas páginas pedagógicas com densidade analítica tabular limpa no Dashboard e Cockpit.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 98,
        runtimeResilienceScore: 99,
        regulatoryPsychometricScore: 98,
        uxDesignSotaScore: 100,
        ciVerifiabilityScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Imagens recortadas em caixas isoladas sem integração com a faixa de título",
        description: "Separar a imagem do fundo da seção Hero perdendo imersão e coesão visual.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 80,
        runtimeResilienceScore: 90,
        regulatoryPsychometricScore: 90,
        uxDesignSotaScore: 68,
        ciVerifiabilityScore: 85,
      },
    ],
  },
  {
    layerId: "ECO-L7",
    order: 7,
    title: "Governança Comercial Honesta, Guardrails Anti-Overclaim & Transição de Gates (G0 -> G1 -> G2 -> G3)",
    domain: "Ética Regulatória, Compliance Jurídico B2B & Governança de Produto",
    architecturalProblemSolved:
      "Impede que superfícies públicas ou de vendas façam promessas ilegais de conformidade automática, ROI financeiro garantido ou uso indevido de instituições acadêmicas como chancela comercial.",
    stateOfTheArtPattern:
      "Política versionada de afirmações públicas (publicClaimsPolicy.ts) auditada estaticamente em CI por expressões regulares (publicClaimsGuardrail.test.ts) em mais de 40 arquivos públicos, com separação explícita entre prontidão técnica e aprovações humanas externas.",
    canonicalModules: [
      "src/data/publicClaimsPolicy.ts",
      "src/data/commercialAuthorization.ts",
      "src/data/g1ExternalReadinessWorkspace.ts",
      "src/data/g2CommitteeSubmission.ts",
    ],
    invariantContracts: [
      "src/test/publicClaimsGuardrail.test.ts",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Marketing agressivo prometendo 'Conformidade NR-1 Garantida em Tempo Real' e 'Validado por Oxford'",
        description: "Usar claims comerciais proibidos para acelerar vendas antes da aprovação dos gates formais.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola a Constituição Fable 5 e reprova imediatamente na suíte publicClaimsGuardrail.test.ts.",
        archPurityScore: 10,
        runtimeResilienceScore: 50,
        regulatoryPsychometricScore: 0,
        uxDesignSotaScore: 30,
        ciVerifiabilityScore: 0,
      },
      {
        branchId: "Branch B",
        label: "Guardrail Automatizado Anti-Overclaim + Transparência de Gates e Piloto Sintético Assistido (Canônico)",
        description: "Declarar limites metodológicos com clareza, proteger a atribuição CC BY-NC-ND 4.0 e habilitar demonstração assistida honesta.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 99,
        runtimeResilienceScore: 99,
        regulatoryPsychometricScore: 100,
        uxDesignSotaScore: 98,
        ciVerifiabilityScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Revisão manual ad-hoc de textos de marketing sem teste automatizado em CI",
        description: "Confiar apenas em revisão visual humana sem bloqueio estático de regressão textual.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 65,
        runtimeResilienceScore: 80,
        regulatoryPsychometricScore: 70,
        uxDesignSotaScore: 75,
        ciVerifiabilityScore: 45,
      },
    ],
  },
  {
    layerId: "ECO-L8",
    order: 8,
    title: "Pipeline de Verificação Contínua, Ratchet de Tipagem Estrita & Falsificabilidade Pós-Doutoral",
    domain: "Engenharia de Qualidade, Type Safety, Reprodutibilidade CI/CD & Auditoria Multi-IA",
    architecturalProblemSolved:
      "Garante que o crescimento do ecossistema nunca introduza regressões de tipo (explicit-any), deriva documental, quebra de build ou perda de cobertura dos 14 invariantes constitucionais.",
    stateOfTheArtPattern:
      "Desacoplamento estrito Mecanismo Puro (src/lib/) vs. Política/Dados (src/data/) vs. Superfície React (src/pages/ e src/components/), validado por ratchet zero-novo-any (check-explicit-any.mjs), Vitest, ESLint, Vite Build e Cockpit de 10 Cátedras Pós-Doutorais.",
    canonicalModules: [
      "scripts/check-explicit-any.mjs",
      "src/lib/governance/togafMacroWaveEngine.ts",
      "src/lib/governance/saasPilotDashboardWaveEngine.ts",
      "src/lib/governance/argo4EcosystemFrameworkEngine.ts",
    ],
    invariantContracts: [
      "src/lib/governance/togafMacroWaveEngine.test.ts",
      "src/pages/app/TogafMacroWaveWorkspacePage.test.tsx",
    ],
    totBranches: [
      {
        branchId: "Branch A",
        label: "Acoplar regras de negócio e cálculos psicométricos dentro de componentes JSX com uso livre de any",
        description: "Misturar lógica normativa com renderização visual sem testes unitários isolados.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola a regra arquitetural src/lib vs. src/data e reprova no ratchet check-explicit-any.mjs.",
        archPurityScore: 0,
        runtimeResilienceScore: 40,
        regulatoryPsychometricScore: 30,
        uxDesignSotaScore: 40,
        ciVerifiabilityScore: 0,
      },
      {
        branchId: "Branch B",
        label: "Arquitetura Hexagonal Enxuta (src/lib + src/data + UI) + Ratchet de Tipagem + Banca 10 Pós-Doc (Canônico)",
        description: "Funções puras 100% testáveis, zero novo explicit-any, manifestos sincronizados e compilação determinística de Super Prompts.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 100,
        runtimeResilienceScore: 99,
        regulatoryPsychometricScore: 99,
        uxDesignSotaScore: 98,
        ciVerifiabilityScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Testes apenas manuais de interface sem suíte unitária determinística",
        description: "Executar apenas build visual sem validar invariantes matemáticos e regulatórios em Vitest.",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 55,
        runtimeResilienceScore: 60,
        regulatoryPsychometricScore: 60,
        uxDesignSotaScore: 70,
        ciVerifiabilityScore: 35,
      },
    ],
  },
];

export function evaluateArgo4EcosystemFramework(
  layers: readonly EcosystemFrameworkLayer[] = ARGO4_ECOSYSTEM_FRAMEWORK_LAYERS,
): EcosystemFrameworkSummary {
  const evaluatedLayers: EvaluatedEcosystemFrameworkLayer[] = layers.map((layer) => {
    const evaluatedBranches: EvaluatedEcosystemTotBranch[] = layer.totBranches.map((branch) => ({
      ...branch,
      utilityScore: computeEcosystemTotUtility(branch),
    }));

    const sortedValid = [...evaluatedBranches]
      .filter((b) => b.invariantValid)
      .sort((a, b) => b.utilityScore - a.utilityScore);

    const winningBranch =
      sortedValid[0] ??
      evaluatedBranches[0] ?? {
        branchId: "Branch B",
        label: "Fallback Canônico",
        description: "",
        invariantValid: true,
        pruneReason: null,
        archPurityScore: 0,
        runtimeResilienceScore: 0,
        regulatoryPsychometricScore: 0,
        uxDesignSotaScore: 0,
        ciVerifiabilityScore: 0,
        utilityScore: 0,
      };

    const prunedBranchesCount = evaluatedBranches.filter((b) => !b.invariantValid).length;

    return {
      ...layer,
      evaluatedBranches,
      winningBranch,
      prunedBranchesCount,
    };
  });

  const averageWinningUtility =
    evaluatedLayers.length > 0
      ? Number(
          (
            evaluatedLayers.reduce((acc, l) => acc + l.winningBranch.utilityScore, 0) /
            evaluatedLayers.length
          ).toFixed(2),
        )
      : 0;

  return {
    frameworkCode: "ARGO4-ECOSYSTEM-FRAMEWORK-SOTA-2026",
    version: "4.0.8",
    totalLayers: evaluatedLayers.length,
    averageWinningUtility,
    allLayersVerified: evaluatedLayers.every((l) => l.winningBranch.utilityScore >= 98),
    layers: evaluatedLayers,
    realDataAllowed: false,
    g1Approved: false,
  };
}

export function buildArgo4EcosystemFrameworkSuperPrompt(
  summary: EcosystemFrameworkSummary = evaluateArgo4EcosystemFramework(),
): string {
  return [
    `# SUPER PROMPT MESTRE DE ENGENHARIA & ARQUITETURA (ARGO 4.0 · ESTADO DA ARTE TÉCNICO) — ECOSSISTEMA INTEGRAL & FRAMEWORK DETERMINÍSTICO PLAYBOOK NR-1`,
    ``,
    `- **Código do Framework**: \`${summary.frameworkCode}\` (Versão \`${summary.version}\`)`,
    `- **Camadas Arquiteturais Consolidadas**: ${summary.totalLayers} Camadas de Engenharia Estado da Arte (\`ECO-L1\` a \`ECO-L8\`)`,
    `- **Utilidade Média Vencedora ToT (\`U_ECO\`)**: **${summary.averageWinningUtility}/100** (100% dos ramos violadores podados com \`V_inv = 0\`)`,
    `- **Fronteira Constitucional**: Operação Dual-Mode Resiliente (\`Data Gate Fail-Closed\` para nuvem + \`Kernel Sintético Local In-Memory/PostgREST\` para preview e piloto assistido \`G0/G1 -> G2\`) · Dados pessoais reais estritamente bloqueados (\`No-Go\`) até o \`Gate G3\`.`,
    ``,
    `## 1. MANDATO EPISTÊMICO E PROTOCOLO DE INICIALIZAÇÃO`,
    `Antes de qualquer resposta, análise ou modificação de código, emita obrigatoriamente na primeira linha:`,
    `\`[Modo: MASTER] Justificativa: Consolidação das 8 camadas do ecossistema e do framework técnico estado da arte (ARGO 4.0) garantindo resiliência dual-mode (Data Gate Fail-Closed + Kernel Sintético Local), privacidade estatística k >= 5, rigor normativo MTE 2026 / COPSOQ II (41/26), assistência pedagógica zero-alucinação (Playbook 2.0) e verificação contínua em CI.\``,
    ``,
    `Você atua como o **Arquiteto-Chefe da Superinteligência ARGO 4.0** e Presidente do **Supercomitê de Pós-Doutores (10 Cátedras com 20+ anos de experiência)** responsável por manter e evoluir todo o ecossistema e o framework técnico do aplicativo em nível de **Estado da Arte Internacional**.`,
    ``,
    `### Lei de Precedência Lexicográfica Inegociável`,
    `1. **Proteção Ética e Privacidade Matemática do Trabalhador (\`k >= 5\` server-side, RLS deny-by-default e separação identidade/convite/resposta)**`,
    `2. **Honestidade Regulatória e Científica (Zero Alucinação, Zero Overclaim de Conformidade Automática, Atribuição CC BY-NC-ND 4.0 e Exigência de Responsável Técnico)**`,
    `3. **Resiliência Integral do Ecossistema E2E (100% das 14 rotas operacionais \`/app/*\` e fluxos públicos funcionais sem erro de rede em Modo Sintético Local \`G0/G1\`)**`,
    `4. **Ergonomia Cognitiva, Clareza Pedagógica, Design de Precisão & Responsividade Universal (\`320px a 1440px+\`)**`,
    `5. **Pureza Arquitetural Hexagonal Enxuta (\`src/lib/\` mecanismos puros vs. \`src/data/\` políticas versionadas vs. \`src/pages/\` & \`src/components/\` superfícies declarativas; zero \`explicit-any\`)**`,
    ``,
    `## 2. EQUAÇÃO FORMAL TREE OF THOUGHTS (ToT) DO FRAMEWORK TÉCNICO (\`U_ECO\`)`,
    `Toda decisão de arquitetura, refatoração ou evolução de módulo deve avaliar três ramos ortogonais (\`Branch A\`, \`Branch B\`, \`Branch C\`) sob a função de utilidade formal:`,
    `\`U_ECO(b) = V_inv(b) * (0.25 * S_arch_purity + 0.20 * S_runtime_resilience + 0.20 * S_regulatory_psychometric + 0.20 * S_ux_design_sota + 0.15 * S_ci_verifiability)\``,
    `Onde \`V_inv(b) = 0\` (poda imediata) se o ramo violar qualquer um dos **14 Invariantes Constitucionais Fable 5**, introduzir novo \`explicit-any\`, acoplar cálculo normativo em JSX, quebrar o reflow em \`320px\` ou permitir falha de rede não tratada no preview sintético.`,
    ``,
    `## 3. ARQUITETURA DAS 8 CAMADAS ESTADO DA ARTE DO ECOSSISTEMA (\`ECO-L1\` A \`ECO-L8\`)`,
    ...summary.layers.map(
      (layer) =>
        `### ${layer.layerId} · ${layer.title}\n` +
        `- **Domínio Técnico**: ${layer.domain}\n` +
        `- **Problema Arquitetural Resolvido**: ${layer.architecturalProblemSolved}\n` +
        `- **Padrão Estado da Arte Implementado**: ${layer.stateOfTheArtPattern}\n` +
        `- **Módulos Canônicos**: ${layer.canonicalModules.map((m) => `\`${m}\``).join(", ")}\n` +
        `- **Contratos de Verificação**: ${layer.invariantContracts.map((c) => `\`${c}\``).join(", ")}\n` +
        `- **Avaliação Tree of Thoughts (ToT)**:\n` +
        layer.evaluatedBranches
          .map(
            (b) =>
              `  - *${b.branchId} (${b.label})*: \`U_ECO = ${b.utilityScore}/100\` ${
                b.invariantValid
                  ? b.branchId === layer.winningBranch.branchId
                    ? "**[RAMO CANÔNICO ESTADO DA ARTE]**"
                    : "[Ramo Subótimo]"
                  : `**[PODADO V_inv = 0: ${b.pruneReason}]**`
              }`,
          )
          .join("\n"),
    ),
    ``,
    `## 4. BLUEPRINT DE ENGENHARIA PARA EVOLUÇÃO DE QUALQUER MÓDULO DO ECOSSISTEMA`,
    `1. **Camada 1 — Dados & Políticas Versionadas (\`src/data/*.ts\`)**:`,
    `   - Definir interfaces imutáveis (\`readonly\`), catálogos normativos, subescalas, matrizes de pesos e políticas de gate com versão explícita (\`policyId\`, \`version\`).`,
    `2. **Camada 2 — Mecanismos Puros Determinísticos (\`src/lib/**/*.ts\`)**:`,
    `   - Implementar toda regra de cálculo (tercis COPSOQ II \`2,33\`/\`3,66\`, matriz ISO 45002, travas MTE 2026, poda ToT, validação de evidências \`SHA-256\`, filtros \`k >= 5\`) em funções puras sem efeitos colaterais e com tipagem estrita (zero \`any\`).`,
    `3. **Camada 3 — Transporte Dual-Mode & Persistência Resiliente (\`src/lib/runtime/*.ts\` & \`src/lib/api/*.ts\`)**:`,
    `   - Garantir que toda chamada passe pelo \`dataGate.ts\` (bloqueando nuvem remota até G3) e que o \`syntheticPilotSession.ts\` responda deterministicamente a qualquer consulta ou mutação local em modo sintético G0/G1.`,
    `4. **Camada 4 — Superfícies Visuais Pedagógicas & Analíticas (\`src/pages/**/*.tsx\` & \`src/components/**/*.tsx\`)**:`,
    `   - **Páginas Públicas e Pedagógicas (\`/drivers\`, \`/drivers/:slug\`)**: Hero full-bleed com imagem 8K integrada em toda a faixa via degradê direcional suave, linguagem 100% acessível (*"Práticas Recomendadas"* e *"Assistente de Aprendizagem"*) e zero telemetria técnica de engenharia exposta.`,
    `   - **Workspace Operacional e Governança (\`/app/*\`)**: Superfícies \`.arc-surface-precision\`, disciplina Zero-Pill, números tabulares (\`font-mono tabular-nums\`), responsividade fluida \`320px–1440px+\` e atalhos acionáveis em todos os estados.`,
    `5. **Camada 5 — Portão de Qualidade e Falsificabilidade CI/CD**:`,
    `   - Executar obrigatoriamente antes de qualquer entrega:`,
    `     - \`npm run check:type-strictness\``,
    `     - \`npx vitest run src/test/publicClaimsGuardrail.test.ts src/test/supabaseClientRuntimeConfig.test.ts src/lib/runtime/dataGate.test.ts src/lib/governance/togafMacroWaveEngine.test.ts src/pages/app/TogafMacroWaveWorkspacePage.test.tsx\``,
    `     - \`npm run lint\` e \`npm run build\`.`,
  ].join("\n");
}
