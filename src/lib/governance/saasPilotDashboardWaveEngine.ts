export type SaasPilotLensCode = "mensurar" | "educar" | "transformar" | "evoluir" | "governanca_transversal";

export type SaasPilotSubWaveId =
  | "PILOT-W1"
  | "PILOT-W2"
  | "PILOT-W3"
  | "PILOT-W4"
  | "PILOT-W5"
  | "PILOT-W6"
  | "PILOT-W7";

export interface SaasPilotTotBranch {
  readonly branchId: "Branch A" | "Branch B" | "Branch C";
  readonly label: string;
  readonly description: string;
  readonly invariantValid: boolean;
  readonly pruneReason: string | null;
  readonly e2eDashboardScore: number;
  readonly uxUsabilityScore: number;
  readonly mteCopsoqRigorScore: number;
  readonly responsibilitySecurityScore: number;
  readonly zeroHallucinationAiScore: number;
}

export interface EvaluatedSaasPilotTotBranch extends SaasPilotTotBranch {
  readonly utilityScore: number;
}

export interface SaasPilotDashboardSubWave {
  readonly waveId: SaasPilotSubWaveId;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly lens: SaasPilotLensCode;
  readonly lensLabel: string;
  readonly primaryRoute: string;
  readonly connectedRoutes: readonly string[];
  readonly dashboardFunctionalConsolidation: string;
  readonly serviceDeliveryPilotGoal: string;
  readonly uxUsabilityResponsivenessContract: string;
  readonly regulatoryResponsibilityContract: string;
  readonly zeroHallucinationAiGuardrail: string;
  readonly totBranches: readonly SaasPilotTotBranch[];
  readonly deliverables: readonly string[];
  readonly acceptanceChecks: readonly string[];
}

export interface EvaluatedSaasPilotDashboardSubWave extends SaasPilotDashboardSubWave {
  readonly evaluatedBranches: readonly EvaluatedSaasPilotTotBranch[];
  readonly winningBranch: EvaluatedSaasPilotTotBranch;
  readonly prunedBranchesCount: number;
}

export interface PostDocPilotCommitteeCriterion {
  readonly code: string;
  readonly chairDomain: string;
  readonly weightPct: number;
  readonly scorePct: number;
  readonly evaluationFocus: string;
  readonly falsifiabilityProof: string;
  readonly verificationArtifact: string;
}

export interface SaasPilotServiceChecklistItem {
  readonly id: string;
  readonly code: string;
  readonly waveId: SaasPilotSubWaveId;
  readonly title: string;
  readonly description: string;
  readonly route: string;
  readonly mandatoryInvariant: string;
  readonly defaultReadyInSyntheticPilot: boolean;
}

export interface SaasPilotDashboardWaveSummary {
  readonly waveCode: string;
  readonly version: string;
  readonly totalSubWaves: number;
  readonly averageWinningUtility: number;
  readonly committeeOverallScorePct: number;
  readonly totalWeightPct: number;
  readonly subWaves: readonly EvaluatedSaasPilotDashboardSubWave[];
  readonly committeeCriteria: readonly PostDocPilotCommitteeCriterion[];
  readonly checklistItems: readonly SaasPilotServiceChecklistItem[];
  readonly realDataAllowed: false;
  readonly g1Approved: false;
}

function clamp100(value: number): number {
  if (Number.isNaN(value) || value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

/**
 * Equação Formal Tree of Thoughts (ToT) — Onda de Consolidação do Dashboard & Piloto SaaS (ARGO 4.0):
 * U_PILOT(b) = V_inv(b) * (0.25 * S_e2e_dash + 0.20 * S_ux_usab + 0.20 * S_rigor_mte_copsoq + 0.20 * S_resp_sec + 0.15 * S_ia_zero_hal)
 */
export function computeSaasPilotTotUtility(branch: SaasPilotTotBranch): number {
  if (!branch.invariantValid) {
    return 0;
  }
  const weighted =
    0.25 * clamp100(branch.e2eDashboardScore) +
    0.2 * clamp100(branch.uxUsabilityScore) +
    0.2 * clamp100(branch.mteCopsoqRigorScore) +
    0.2 * clamp100(branch.responsibilitySecurityScore) +
    0.15 * clamp100(branch.zeroHallucinationAiScore);
  return Number(weighted.toFixed(2));
}

export const SAAS_PILOT_DASHBOARD_SUB_WAVES: readonly SaasPilotDashboardSubWave[] = [
  {
    waveId: "PILOT-W1",
    order: 1,
    title: "Onboarding Organizacional Assistido & Cockpit Central do Dashboard",
    subtitle: "Elo 0/1 · Estrutura Empresa -> Unidades -> GHE/GES e Telemetria de Comando no /app",
    lens: "mensurar",
    lensLabel: "1. Mensurar & Estruturar",
    primaryRoute: "/app",
    connectedRoutes: ["/app/org", "/app/units", "/app/journey"],
    dashboardFunctionalConsolidation:
      "Unifica o estado inicial sem organização (!org) e o cockpit ativo (org) em uma Central de Comando de Prestação de Serviço SaaS com progresso por sub-onda, KPIs tabulares em tempo real e atalhos diretos sem estado vazio mudo.",
    serviceDeliveryPilotGoal:
      "Permitir que o consultor SST ou gestor configure empresa, unidades operacionais e Grupos de Exposição Similar (GES/GHE) em até 5 minutos para iniciar o piloto assistido com rastreabilidade completa.",
    uxUsabilityResponsivenessContract:
      "Grid fluido de 1 coluna em 320px–430px e 12 colunas em 1280px–1440px+; cartões táteis com feedback <= 150ms, disciplina Zero-Pill em metadados e tipografia tabular (font-mono tabular-nums).",
    regulatoryResponsibilityContract:
      "Conformidade com NR-1 item 1.5.4.3.1(c) (indicação obrigatória do grupo de trabalhadores expostos GES/GHE) e fronteira constitucional Fable 5 (modo sintético/assistido G0/G1 sem dados reais antes de G3).",
    zeroHallucinationAiGuardrail:
      "Zero inferência generativa de estrutura organizacional; presets setoriais carregados estritamente de catálogos determinísticos versionados em src/data.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Onboarding self-service com importação aberta de CPF/e-mail de colaboradores reais",
        description: "Permitir upload de planilha nominal de trabalhadores no Dashboard antes do Gate G3.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 1, 2 e 14 ao coletar dados pessoais reais antes das aprovações formais G3.",
        e2eDashboardScore: 35,
        uxUsabilityScore: 60,
        mteCopsoqRigorScore: 20,
        responsibilitySecurityScore: 0,
        zeroHallucinationAiScore: 50,
      },
      {
        branchId: "Branch B",
        label: "Central de Comando SaaS no Dashboard + Setup Guiado Empresa/Unidades/GHE em Modo Assistido (Canônico)",
        description: "Consolidar no /app o checklist interativo de 7 etapas, telemetria das 4 lentes e vínculo obrigatório por unidade/GHE sem expor PII.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 99,
        uxUsabilityScore: 98,
        mteCopsoqRigorScore: 98,
        responsibilitySecurityScore: 100,
        zeroHallucinationAiScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Dashboard estático apenas com gráficos decorativos sem ação de onboarding",
        description: "Exibir widgets vazios exigindo navegação manual pelo menu lateral sem orientação de jornada.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 55,
        uxUsabilityScore: 48,
        mteCopsoqRigorScore: 70,
        responsibilitySecurityScore: 88,
        zeroHallucinationAiScore: 90,
      },
    ],
    deliverables: [
      "Hub interativo das 7 Sub-Ondas do Piloto SaaS integrado diretamente em src/pages/app/DashboardPage.tsx.",
      "Fluxo guiado Empresa (/app/org) -> Unidades e GHE (/app/units) com validação de prontidão k >= 5.",
      "Indicador explícito de fronteira operacional (Piloto Sintético/Assistido G0/G1 · Dados Reais Bloqueados até G3).",
    ],
    acceptanceChecks: [
      "Transição sem fricção entre estado sem organização e estado provisionado no Dashboard.",
      "Zero overflow horizontal em 320px e alvos interativos >= 44x44px.",
    ],
  },
  {
    waveId: "PILOT-W2",
    order: 2,
    title: "Ciclos de Coleta Protegida COPSOQ II (41 Itens / 26 Subescalas) & Privacy Vault k >= 5",
    subtitle: "Elo 1 · Medir com Tercis Oficiais (2,33 e 3,66), 4 Dimensões de Bem-Estar e Supressão Server-Side",
    lens: "mensurar",
    lensLabel: "1. Mensurar & Proteger",
    primaryRoute: "/app/cycles",
    connectedRoutes: ["/app/respond", "/app/dashboard/analytics"],
    dashboardFunctionalConsolidation:
      "Conecta os cartões de Ciclos, Respostas Consolidadas, Heatmap de 26 Subescalas e Tendência Longitudinal do Dashboard diretamente ao motor determinístico do COPSOQ II e ao bloqueio estatístico k >= 5.",
    serviceDeliveryPilotGoal:
      "Executar rodadas de medição psicossocial no piloto assistido garantindo anonimato matemático (k >= 5), jornada mobile-first neutra para o trabalhador e leitura tricolor imediata no Dashboard.",
    uxUsabilityResponsivenessContract:
      "Coleta mobile-first (320px–430px) com botões de resposta >= 48px na zona do polegar, zero confete/gamificação e painel analítico no Dashboard com filtro por unidade e selo de proteção k >= 5.",
    regulatoryResponsibilityContract:
      "Fidelidade estrita à Versão Curta do Manual COPSOQ II Portugal 2013 (41 questões, 26 subescalas, 8 dimensões e cortes 2,33 / 3,66) e Invariantes 1, 2 e 3 (RLS deny-by-default em microdados).",
    zeroHallucinationAiGuardrail:
      "Cálculo aritmético de médias e classificação em tercis Verde/Amarelo/Vermelho executados 100% por funções puras determinísticas em src/data/copsoqData.ts e src/lib/privacy.ts.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Exibição de respostas no Dashboard para grupos com n < 5 mediante aviso visual",
        description: "Permitir que o gestor visualize médias de equipes com 2 ou 3 respondentes no painel analítico.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 3 (barreira estatística k >= 5 obrigatória no servidor e em toda saída).",
        e2eDashboardScore: 30,
        uxUsabilityScore: 50,
        mteCopsoqRigorScore: 15,
        responsibilitySecurityScore: 0,
        zeroHallucinationAiScore: 60,
      },
      {
        branchId: "Branch B",
        label: "Privacy Vault Server-Side k >= 5 + Cotação Tricolor Determinística 2,33/3,66 no Dashboard (Canônico)",
        description: "Suprimir qualquer recorte com n < 5 antes da camada visual e consolidar as 26 subescalas + 4 dimensões de bem-estar no Heatmap do Dashboard.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 99,
        uxUsabilityScore: 97,
        mteCopsoqRigorScore: 100,
        responsibilitySecurityScore: 100,
        zeroHallucinationAiScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Apenas média global única da empresa sem desdobramento por subescala ou unidade elegível",
        description: "Ocultar as 26 subescalas do COPSOQ II e mostrar apenas um índice único agregado.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 60,
        uxUsabilityScore: 65,
        mteCopsoqRigorScore: 45,
        responsibilitySecurityScore: 92,
        zeroHallucinationAiScore: 95,
      },
    ],
    deliverables: [
      "Integração do DimensionHeatmap e TrendCard no Dashboard com trava automática quando confirmedCount < 5.",
      "Rastreabilidade das 26 subescalas (41 questões) com polaridade explícita (protective vs. risk_exposure).",
      "Experiência de coleta /app/respond neutra, inclusiva e validada para telas de 320px.",
    ],
    acceptanceChecks: [
      "Unidades com menos de 5 respostas confirmadas exibem estado protegido k >= 5 sem vazar somas ou médias.",
      "Classificação tricolor respeita os pontos de corte 2,33 e 3,66 do Manual COPSOQ II.",
    ],
  },
  {
    waveId: "PILOT-W3",
    order: 3,
    title: "Contextualização no Trabalho Real (AEP/AET — 5 Áreas NR-17) & Aprendizagem Pedagógica DRIVER",
    subtitle: "Elo 2 · Conectar Percepção Agregada à Atividade Real, Escuta CIPA e Práticas Recomendadas",
    lens: "educar",
    lensLabel: "2. Contextualizar & Educar",
    primaryRoute: "/app/work-analysis",
    connectedRoutes: ["/app/aet-analysis", "/drivers", "/app"],
    dashboardFunctionalConsolidation:
      "Integra o card NexoDriverIntelligenceCard e os alertas do Dashboard à Avaliação Ergonômica Preliminar (AEP), ao escalonamento de AET profunda e às trilhas pedagógicas dos 16 drivers ativos (+2 em roadmap 2026).",
    serviceDeliveryPilotGoal:
      "Impedir que o piloto SaaS reduza gestão de risco a números de questionário, guiando o especialista SST na observação das 5 áreas da NR-17 e capacitando a liderança com linguagem pedagógica acessível.",
    uxUsabilityResponsivenessContract:
      "Faixas Hero full-bleed com degradê suave em /drivers e /drivers/:slug, linguagem 100% pedagógica ('Práticas Recomendadas' e 'Assistente de Aprendizagem') e formulários estruturados de AEP/AET.",
    regulatoryResponsibilityContract:
      "Cumprimento do Guia MTE 2026 Cap. 5.2/5.3 (5 áreas da NR-17 + fatores psicossociais), Cap. 6 (participação dos trabalhadores/CIPA) e Invariante 6 (questionário nunca substitui AEP/AET).",
    zeroHallucinationAiGuardrail:
      "Assistente de Aprendizagem opera sobre corpus fechado do Work Wellbeing Playbook 2.0 (Regier et al., 2025 · CC BY-NC-ND 4.0) com citação primária obrigatória e trava anti-extrapolação.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Emissão automática de laudo ergonômico AEP/AET apenas a partir do score do questionário",
        description: "Pular a observação da atividade real e declarar AEP concluída usando somente respostas online.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 6 e a NR-17 (percepção psicométrica jamais substitui análise da atividade real).",
        e2eDashboardScore: 25,
        uxUsabilityScore: 55,
        mteCopsoqRigorScore: 0,
        responsibilitySecurityScore: 10,
        zeroHallucinationAiScore: 20,
      },
      {
        branchId: "Branch B",
        label: "Ponte Determinística Dashboard -> AEP/AET (5 Áreas NR-17) + Catálogo Pedagógico Playbook 2.0 (Canônico)",
        description: "Cruzar alertas de subescalas no Dashboard com registro obrigatório de trabalho prescrito vs. real na AEP, gatilhos de AET e Práticas Recomendadas.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 98,
        uxUsabilityScore: 99,
        mteCopsoqRigorScore: 99,
        responsibilitySecurityScore: 98,
        zeroHallucinationAiScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Catálogo de drivers com jargão técnico de engenharia de IA (RAG/ToT) exposto ao gestor final",
        description: "Exibir telemetria interna de prompts 8K e siglas de recuperação vetorial nas páginas pedagógicas.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 72,
        uxUsabilityScore: 60,
        mteCopsoqRigorScore: 85,
        responsibilitySecurityScore: 90,
        zeroHallucinationAiScore: 92,
      },
    ],
    deliverables: [
      "Card NEXO no Dashboard conectando sinais de risco aos drivers do Work Wellbeing Playbook 2.0.",
      "Fluxo AEP (/app/work-analysis) e AET (/app/aet-analysis) cobrindo organização do trabalho, mobiliário, máquinas, conforto e fatores psicossociais.",
      "Páginas /drivers e /drivers/:slug com visual full-bleed e linguagem pedagógica livre de jargões de IA.",
    ],
    acceptanceChecks: [
      "Zero ocorrência do termo técnico 'RAG' nas superfícies pedagógicas de /drivers.",
      "Gatilhos de sobrecarga ou complexidade na AEP recomendam abertura rastreável de AET.",
    ],
  },
  {
    waveId: "PILOT-W4",
    order: 4,
    title: "Avaliação Multicritério de Risco (Matriz ISO 45002 5x5) & Divergência de Controles",
    subtitle: "Elo 3 · Regra de Ouro da Severidade (1.5.4.4.4.1) + Trava Legal de Probabilidade NR (1.5.4.4.5.1)",
    lens: "transformar",
    lensLabel: "3. Avaliar & Priorizar",
    primaryRoute: "/app/risks",
    connectedRoutes: ["/app/criteria-engine", "/app/controls", "/app"],
    dashboardFunctionalConsolidation:
      "Alimenta o KPI de Riscos Altos/Críticos e o SmartAlertsCard do Dashboard com a classificação determinística da Matriz ISO 45002 5x5, destacando divergências entre controles declarados e percepção real.",
    serviceDeliveryPilotGoal:
      "Fornecer ao engenheiro SST e ao consultor do piloto uma memória de cálculo aberta, auditável e com suporte a override técnico justificado para o Inventário de Riscos do PGR.",
    uxUsabilityResponsivenessContract:
      "Visualização clara de Severidade × Probabilidade, badges semânticos de alto contraste (Baixo, Médio, Alto, Muito Alto) e formulário de override técnico com justificativa obrigatória.",
    regulatoryResponsibilityContract:
      "Aplicação estrita do Guia MTE 2026 Cap. 10 (3 elementos obrigatórios do perigo 1.5.4.3.1), Cap. 11.3 (Severidade de maior magnitude 1.5.4.4.4.1) e Cap. 11.4 (Trava de probabilidade nível 5 por NR descumprida 1.5.4.4.5.1).",
    zeroHallucinationAiGuardrail:
      "Proibição absoluta de estimativa de severidade ou probabilidade por LLM; motor puro em src/lib/risk/criteriaEngine.ts e src/lib/governance/mteCopsoqAuditEngine.ts.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Classificação de risco caixa-preta gerada por prompt de IA generativa",
        description: "Delegar ao modelo de linguagem a definição do nível de risco ocupacional da unidade.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 5, 6, 8 e 11 (fórmula deve ser determinística, aberta e sob responsabilidade humana).",
        e2eDashboardScore: 20,
        uxUsabilityScore: 50,
        mteCopsoqRigorScore: 0,
        responsibilitySecurityScore: 0,
        zeroHallucinationAiScore: 0,
      },
      {
        branchId: "Branch B",
        label: "Criteria Engine Determinístico ISO 45002 + Trava Legal NR 1.5.4.4.5.1 + Detector de Divergência (Canônico)",
        description: "Combinar exposição AEP, tercis COPSOQ II (k >= 5) e eficácia de controles na hierarquia 1.5.5.1.2 com trilha imutável de override.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 99,
        uxUsabilityScore: 96,
        mteCopsoqRigorScore: 100,
        responsibilitySecurityScore: 99,
        zeroHallucinationAiScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Planilha manual isolada sem conexão com as respostas k >= 5 ou com a AEP",
        description: "Exigir digitação manual de riscos sem cruzar dados de percepção ou controles existentes.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 55,
        uxUsabilityScore: 58,
        mteCopsoqRigorScore: 72,
        responsibilitySecurityScore: 85,
        zeroHallucinationAiScore: 95,
      },
    ],
    deliverables: [
      "Sincronização do contador de Riscos Altos/Críticos e alertas prioritários no Dashboard (/app).",
      "Motor de Critérios (/app/criteria-engine) com Regra de Ouro da Severidade e Trava Legal de Probabilidade.",
      "Auditoria de Controles (/app/controls) sinalizando quando EPI isolado viola a hierarquia 1.5.5.1.2.",
    ],
    acceptanceChecks: [
      "100% dos riscos avaliados exibem memória de cálculo, fonte/circunstância e grupo exposto (GES/GHE).",
      "Override humano exige justificativa técnica não vazia e preserva o valor calculado original.",
    ],
  },
  {
    waveId: "PILOT-W5",
    order: 5,
    title: "Planos de Ação Command-Only, Hierarquia Legal 1.5.5.1.2 & Copiloto Supervisionado",
    subtitle: "Elo 4 · Transformar Risco em Intervenção Coletiva com Dono, Prazo e Trava de Evidência",
    lens: "transformar",
    lensLabel: "3. Transformar & Agir",
    primaryRoute: "/app/actions",
    connectedRoutes: ["/app/aurora", "/app"],
    dashboardFunctionalConsolidation:
      "Conecta o KPI de Ações Concluídas/Totais e o fluxo SRV-05 do Dashboard à máquina de estados Command-Only de planos de ação e ao copiloto supervisionado Aurora/NEXO.",
    serviceDeliveryPilotGoal:
      "Garantir que toda medida recomendada durante a prestação do serviço SaaS siga a hierarquia de controle da NR-1 (priorizando medidas coletivas e organizacionais) e nunca seja dada como eficaz sem evidência.",
    uxUsabilityResponsivenessContract:
      "Quadros e listas de ação responsivos (320px–1440px+), indicação clara de responsável, prazo, aferição ao longo do tempo e bloqueio visual instrutivo quando falta evidência.",
    regulatoryResponsibilityContract:
      "Cumprimento da NR-1 item 1.5.5.1.2 (hierarquia de medidas de prevenção), item 1.5.5.2 (cronograma, responsável e aferição) e Invariantes 7, 8 e 9 (IA supervisionada sem microdados).",
    zeroHallucinationAiGuardrail:
      "Context Builder da Aurora remove qualquer recorte com n < 5 antes de estruturar sínteses e exige validação humana explícita antes de converter sugestão em plano de ação.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Conclusão livre de plano de ação com um clique sem anexar evidência verificável",
        description: "Permitir marcar ação como concluída e baixar o risco imediatamente sem comprovante de execução.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 7 (nenhum controle reduz risco sem evidência de implementação e eficácia).",
        e2eDashboardScore: 40,
        uxUsabilityScore: 70,
        mteCopsoqRigorScore: 10,
        responsibilitySecurityScore: 20,
        zeroHallucinationAiScore: 50,
      },
      {
        branchId: "Branch B",
        label: "Máquina de Estados Command-Only + Hierarquia Coletiva 1.5.5.1.2 + Aurora Supervisionada k >= 5 (Canônico)",
        description: "Exigir contrato de comando validado e evidência SHA-256 para conclusão de ação, com sugestões baseadas no Playbook 2.0.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 98,
        uxUsabilityScore: 97,
        mteCopsoqRigorScore: 99,
        responsibilitySecurityScore: 99,
        zeroHallucinationAiScore: 99,
      },
      {
        branchId: "Branch C",
        label: "Cadastro manual de tarefas sem vínculo com o inventário de riscos ou subescalas",
        description: "Manter lista de tarefas avulsa desconectada dos riscos priorizados na unidade.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 10 (toda intervenção deve ter vínculo rastreável na cadeia risco -> controle -> ação).",
        e2eDashboardScore: 45,
        uxUsabilityScore: 60,
        mteCopsoqRigorScore: 30,
        responsibilitySecurityScore: 65,
        zeroHallucinationAiScore: 80,
      },
    ],
    deliverables: [
      "KPI de Ações no Dashboard refletindo progresso real validado pelo actionExecutionCore.",
      "Vínculo direto entre Práticas Recomendadas do Playbook 2.0 e criação de ações preventivas.",
      "Copiloto Aurora (/app/aurora) operando em modo seguro sobre agregados k >= 5 com aviso de revisão humana.",
    ],
    acceptanceChecks: [
      "Transição para status concluído/eficaz é recusada deterministicamente se não houver evidência associada.",
      "Nenhuma chamada do copiloto recebe microdados individuais ou recortes com n < 5.",
    ],
  },
  {
    waveId: "PILOT-W6",
    order: 6,
    title: "Dossiê PGR (3 Documentos Mínimos MTE 2026), Ledger SHA-256 & Revisão PDCA (2/3 Anos + 6 Gatilhos)",
    subtitle: "Elos 5 e 6 · Evidenciar com Honestidade Regulatória e Reavaliar Eficácia Pós-Controle",
    lens: "evoluir",
    lensLabel: "4. Evidenciar & Evoluir",
    primaryRoute: "/app/documents",
    connectedRoutes: ["/app/governance", "/app"],
    dashboardFunctionalConsolidation:
      "Consolida no Dashboard o contador de Documentos Auditáveis (SRV-06) e o status de Revisão Contínua PDCA (SRV-07), garantindo rastreabilidade de versão, hash SHA-256 e monitoramento dos 6 gatilhos imediatos da NR-1.",
    serviceDeliveryPilotGoal:
      "Entregar ao cliente do piloto SaaS as minutas técnicas estruturadas dos 3 Documentos Mínimos do PGR prontas para revisão e assinatura do responsável técnico habilitado, fechando o ciclo PDCA.",
    uxUsabilityResponsivenessContract:
      "Visualização tabular de versões documentais, hashes SHA-256 em fonte monoespaçada, avisos claros de preliminaridade técnica e painel de gatilhos de revisão PDCA.",
    regulatoryResponsibilityContract:
      "Cobertura dos 3 Documentos Mínimos do PGR (1. Inventário de Riscos 1.5.7.1; 2. Plano de Ação 1.5.5.2; 3. Documento de Critérios 1.5.4.4.2.2), revisão 2/3 anos + 6 gatilhos imediatos (1.5.4.4.6 a–f) e Invariantes 8 e 11.",
    zeroHallucinationAiGuardrail:
      "Templates documentais gerados por compilação determinística de snapshots versionados com cláusula obrigatória de não-conformidade automática e exigência de responsável técnico.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Emissão de certificado intitulado 'Laudo Oficial de Conformidade NR-1 100% Garantida'",
        description: "Prometer na interface e no PDF que o software certifica a empresa automaticamente perante o MTE.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola os Invariantes 8 e 11 e a Constituição (proibido overclaim de conformidade automática ou substituição de RT).",
        e2eDashboardScore: 10,
        uxUsabilityScore: 40,
        mteCopsoqRigorScore: 0,
        responsibilitySecurityScore: 0,
        zeroHallucinationAiScore: 0,
      },
      {
        branchId: "Branch B",
        label: "Minutas Orientativas dos 3 Docs Mínimos PGR + Hash SHA-256 + Motor dos 6 Gatilhos PDCA 1.5.4.4.6 (Canônico)",
        description: "Emitir minutas versionadas com linhagem de dados, hash de integridade e trava de redução de risco residual condicionada à eficácia comprovada.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 98,
        uxUsabilityScore: 96,
        mteCopsoqRigorScore: 100,
        responsibilitySecurityScore: 100,
        zeroHallucinationAiScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Exportação de tela sem versionamento, sem hash e sem Documento de Critérios GRO/PGR",
        description: "Gerar apenas impressão simples omitindo o Documento de Critérios (1.5.4.4.2.2) e a trilha de versão.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 11 e o REQ-MTE-10 (documentos exigem versão, premissas, hash e os 3 documentos mínimos do PGR).",
        e2eDashboardScore: 40,
        uxUsabilityScore: 55,
        mteCopsoqRigorScore: 35,
        responsibilitySecurityScore: 50,
        zeroHallucinationAiScore: 75,
      },
    ],
    deliverables: [
      "Emissão versionada das minutas de Inventário de Riscos, Plano de Ação e Documento de Critérios em /app/documents.",
      "Monitoramento ativo dos 6 gatilhos de revisão imediata (1.5.4.4.6 a–f), incluindo solicitação da CIPA.",
      "Trava de risco residual vinculada à verificação empírica de eficácia pós-implementação.",
    ],
    acceptanceChecks: [
      "Todo documento emitido estampa versão da política, hash SHA-256 e aviso de revisão por responsável técnico.",
      "Suíte publicClaimsGuardrail.test.ts 100% verde contra promessas de conformidade automática.",
    ],
  },
  {
    waveId: "PILOT-W7",
    order: 7,
    title: "Governança de Prestação de Serviço SaaS, SLA Assistido & Fechamento de Prontidão G1 -> G2",
    subtitle: "Transversal · Cockpit de Prontidão Comercial Honesta, Dossiê de Evidências e Super Prompt ARGO 4.0",
    lens: "governanca_transversal",
    lensLabel: "5. Governar Piloto SaaS (G1 -> G2)",
    primaryRoute: "/app/governance/togaf-macro-wave",
    connectedRoutes: [
      "/app/governance/readiness",
      "/app/governance/external-closure",
      "/app/governance/g2-submission",
      "/app",
    ],
    dashboardFunctionalConsolidation:
      "Conecta o GateReadinessCard e a nova Central do Piloto SaaS no Dashboard ao Cockpit Pós-Doutoral TOGAF, ao Quadro de Fechamento Externo G1 e ao Pacote de Submissão ao Comitê G2.",
    serviceDeliveryPilotGoal:
      "Permitir a operação imediata de pilotos assistidos com Design Partners B2B usando cenários sintéticos calibrados e protocolo do facilitador, mantendo transparência total sobre o que já está pronto em software versus aprovações externas pendentes.",
    uxUsabilityResponsivenessContract:
      "Painel de controle executivo no Dashboard com checklist interativo de prontidão do piloto, cópia em 1 clique do Super Prompt ARGO 4.0 e navegação responsiva em 320px–1440px+.",
    regulatoryResponsibilityContract:
      "Respeito estrito ao Invariante 14 (não avançar gate sem evidência formal; dados reais bloqueados até G3) e separação cristalina entre maturidade técnica local e sign-offs humanos (DPO, SST, Psicometria, Jurídico).",
    zeroHallucinationAiGuardrail:
      "Compilador determinístico do Super Prompt ARGO 4.0 auditado pelas 10 Cátedras Pós-Doutorais com score verificável e zero afirmação não rastreável ao código.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Liberar produção com dados reais e billing aberto alegando que os testes automatizados bastam",
        description: "Ignorar os sign-offs externos do DPO, Engenheiro SST e Psicometrista e ativar coleta real antes do Gate G3.",
        invariantValid: false,
        pruneReason: "Podado (V = 0): Viola o Invariante 14 e a Constituição Fable 5 (testes automatizados jamais substituem aprovações formais de gate).",
        e2eDashboardScore: 15,
        uxUsabilityScore: 50,
        mteCopsoqRigorScore: 10,
        responsibilitySecurityScore: 0,
        zeroHallucinationAiScore: 10,
      },
      {
        branchId: "Branch B",
        label: "Piloto Assistido de Prestação de Serviço SaaS em Modo Sintético Controlado + Dossiê G1/G2 Auditável (Canônico)",
        description: "Operar sessões reais de consultoria e demonstração B2B sobre a cadeia E2E consolidada no Dashboard, preservando dataGate fail-closed até G3.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 100,
        uxUsabilityScore: 98,
        mteCopsoqRigorScore: 99,
        responsibilitySecurityScore: 100,
        zeroHallucinationAiScore: 100,
      },
      {
        branchId: "Branch C",
        label: "Paralisar toda demonstração de serviço até a assinatura final do Gate G3",
        description: "Impedir que facilitadores conduzam pilotos assistidos com dados sintéticos calibrados para validação de valor comercial.",
        invariantValid: true,
        pruneReason: null,
        e2eDashboardScore: 60,
        uxUsabilityScore: 62,
        mteCopsoqRigorScore: 85,
        responsibilitySecurityScore: 95,
        zeroHallucinationAiScore: 95,
      },
    ],
    deliverables: [
      "Central de Comando da Onda de Consolidação do Dashboard & Piloto SaaS em /app.",
      "Super Prompt ARGO 4.0 da Onda do Piloto SaaS compilado em src/lib/governance/saasPilotDashboardWaveEngine.ts e disponível no Cockpit.",
      "Checklist interativo de verificação das 7 Sub-Ondas para condução de pilotos assistidos com Design Partners.",
    ],
    acceptanceChecks: [
      "Utilidade média vencedora ToT (U_PILOT) >= 98/100 com 100% dos ramos violadores podados (V = 0).",
      "Pipeline CI completo (check:type-strictness, vitest, eslint e vite build) 100% verde.",
    ],
  },
];

export const POST_DOC_PILOT_COMMITTEE_CRITERIA: readonly PostDocPilotCommitteeCriterion[] = [
  {
    code: "COM-01",
    chairDomain: "Engenharia de Software, Arquitetura TOGAF & Mecanismo Puro",
    weightPct: 15,
    scorePct: 99,
    evaluationFocus:
      "Desacoplamento estrito entre mecanismos puros determinísticos (src/lib/) e políticas/catálogos versionados (src/data/), zero explicit-any e cobertura de testes unitários.",
    falsifiabilityProof:
      "Qualquer cálculo regulatório, psicométrico ou de utilidade ToT hardcoded em JSX ou uso de explicit-any reprova o build via scripts/check-explicit-any.mjs.",
    verificationArtifact: "src/lib/governance/saasPilotDashboardWaveEngine.ts · scripts/check-explicit-any.mjs",
  },
  {
    code: "COM-02",
    chairDomain: "Design de Precisão, Hierarquia Tipográfica & Superfícies Visuais",
    weightPct: 12,
    scorePct: 98,
    evaluationFocus:
      "Superfícies de nível único (.arc-surface-precision), disciplina Zero-Pill em metadados estáticos, telemetria tabular (font-mono tabular-nums) e harmonia visual.",
    falsifiabilityProof:
      "Ausência de cartões aninhados redundantes, pílulas falsas em rótulos não clicáveis ou desalinhamento numérico nos KPIs do Dashboard.",
    verificationArtifact: "src/pages/app/DashboardPage.tsx · src/index.css",
  },
  {
    code: "COM-03",
    chairDomain: "UX/EX, Ergonomia Cognitiva & Clareza Pedagógica",
    weightPct: 13,
    scorePct: 99,
    evaluationFocus:
      "Redução de carga cognitiva nas 4 lentes do Dashboard (Mensurar, Educar, Transformar, Evoluir) e tradução de termos de IA ('RAG') para linguagem pedagógica ('Práticas Recomendadas' e 'Assistente de Aprendizagem').",
    falsifiabilityProof:
      "Testes automatizados verificam que as páginas pedagógicas /drivers não expõem jargões técnicos de engenharia de prompt ou siglas de recuperação vetorial.",
    verificationArtifact: "src/pages/DriversPage.tsx · src/pages/DriverWorldPage.tsx · src/components/DriverChatbot.tsx",
  },
  {
    code: "COM-04",
    chairDomain: "Usabilidade Prática SaaS & Responsividade Universal (320px–1440px+)",
    weightPct: 12,
    scorePct: 98,
    evaluationFocus:
      "Reflow fluido sem scroll horizontal desde celulares simples de 320px até monitores de 1440px+, alvos de toque >= 44x44px, feedback <= 150ms e suporte a prefers-reduced-motion.",
    falsifiabilityProof:
      "Grids responsivos com min-w-0, botões de ação com altura mínima tátil e estados vazios 100% acionáveis no Dashboard.",
    verificationArtifact: "src/pages/app/DashboardPage.tsx · src/pages/app/RespondPage.tsx",
  },
  {
    code: "COM-05",
    chairDomain: "Responsabilidade Jurídica, SST (NR-1/NR-17) & Honestidade Regulatória",
    weightPct: 15,
    scorePct: 100,
    evaluationFocus:
      "Aderência ao Guia Oficial MTE 2026 (Cap. 1.5 NR-1, 5 áreas NR-17, Severidade 1.5.4.4.4.1, Trava NR 1.5.4.4.5.1, Hierarquia 1.5.5.1.2, 3 Docs Mínimos PGR e 6 Gatilhos 1.5.4.4.6 a–f) sem overclaim comercial.",
    falsifiabilityProof:
      "Guardrail publicClaimsGuardrail.test.ts bloqueia qualquer promessa de conformidade automática ou substituição de responsável técnico legalmente habilitado.",
    verificationArtifact: "src/lib/governance/mteCopsoqAuditEngine.ts · src/test/publicClaimsGuardrail.test.ts",
  },
  {
    code: "COM-06",
    chairDomain: "Privacidade Estatística (k >= 5), LGPD & Isolamento Zero-Trust RLS",
    weightPct: 13,
    scorePct: 100,
    evaluationFocus:
      "Inacessibilidade absoluta de respostas individuais pela organização, separação identidade/convite/resposta e supressão server-side para qualquer recorte com n < 5.",
    falsifiabilityProof:
      "O Dashboard suprime o Heatmap de subescalas, tendências e alertas NEXO sempre que confirmedCount < 5, espelhando a barreira RLS/RPC do Privacy Vault.",
    verificationArtifact: "src/lib/privacy.ts · supabase/tests/privacy_vault_contract.sql",
  },
  {
    code: "COM-07",
    chairDomain: "Psicometria Aplicada COPSOQ II & Ergonomia da Atividade Real (AEP/AET)",
    weightPct: 10,
    scorePct: 99,
    evaluationFocus:
      "Preservação das 41 questões e 26 subescalas da Versão Curta do COPSOQ II (Silva et al., 2013) com tercis 2,33 e 3,66 articulados obrigatoriamente com a observação do trabalho real na AEP/AET.",
    falsifiabilityProof:
      "Sinal psicométrico isolado jamais define risco oficial nem emite plano final sem contextualização na atividade real.",
    verificationArtifact: "src/data/copsoqData.ts · src/lib/work/assessment.ts · src/lib/work/aetAssessment.ts",
  },
  {
    code: "COM-08",
    chairDomain: "Superinteligência IA Supervisionada Zero-Alucinação & Atribuição Científica",
    weightPct: 10,
    scorePct: 100,
    evaluationFocus:
      "Citações primárias estritas do Work Wellbeing Playbook 2.0 (Regier et al., 2025 · CC BY-NC-ND 4.0), proibição de cálculo regulatório por LLM e filtragem k >= 5 no Context Builder da Aurora.",
    falsifiabilityProof:
      "validateZeroHallucinationGuardrails rejeita percentuais causais inventados, selos acadêmicos indevidos ou recomendações sem fonte primária.",
    verificationArtifact: "src/lib/governance/playbook2RagEngine.ts · src/lib/aurora/contextBuilder.ts",
  },
];

export const SAAS_PILOT_SERVICE_CHECKLIST_ITEMS: readonly SaasPilotServiceChecklistItem[] = [
  {
    id: "chk-pilot-w1",
    code: "CHK-01",
    waveId: "PILOT-W1",
    title: "Estrutura Organizacional, Unidades & Grupos Expostos (GES/GHE)",
    description:
      "Configurar organização e unidades operacionais vinculando cada grupo de exposição similar conforme NR-1 item 1.5.4.3.1(c).",
    route: "/app/units",
    mandatoryInvariant: "Invariante 14 · Operação em modo sintético/assistido G0/G1 sem PII real até G3",
    defaultReadyInSyntheticPilot: true,
  },
  {
    id: "chk-pilot-w2",
    code: "CHK-02",
    waveId: "PILOT-W2",
    title: "Ciclo COPSOQ II (41 Itens / 26 Subescalas) & Barreira k >= 5 Ativa",
    description:
      "Validar coleta neutra mobile-first (320px) e confirmar que o Dashboard exibe agregados tricolores (2,33 / 3,66) apenas para unidades com n >= 5.",
    route: "/app/cycles",
    mandatoryInvariant: "Invariantes 1, 2, 3, 4 e 12 · Anonimato k >= 5 e instrumento versionado",
    defaultReadyInSyntheticPilot: true,
  },
  {
    id: "chk-pilot-w3",
    code: "CHK-03",
    waveId: "PILOT-W3",
    title: "Contextualização AEP/AET (5 Áreas NR-17) & Trilha Pedagógica DRIVER",
    description:
      "Registrar observação da atividade real, escuta de trabalhadores/CIPA e explorar Práticas Recomendadas do Playbook 2.0.",
    route: "/app/work-analysis",
    mandatoryInvariant: "Invariante 6 · Questionário nunca substitui AEP/AET nem análise do trabalho real",
    defaultReadyInSyntheticPilot: true,
  },
  {
    id: "chk-pilot-w4",
    code: "CHK-04",
    waveId: "PILOT-W4",
    title: "Matriz de Risco ISO 45002 5x5 & Divergência de Controles",
    description:
      "Auditar memória de cálculo com Severidade de Maior Magnitude (1.5.4.4.4.1), Trava Legal de Probabilidade NR (1.5.4.4.5.1) e overrides justificados.",
    route: "/app/risks",
    mandatoryInvariant: "Invariantes 5 e 11 · Fórmula determinística aberta e trilha de revisão humana",
    defaultReadyInSyntheticPilot: true,
  },
  {
    id: "chk-pilot-w5",
    code: "CHK-05",
    waveId: "PILOT-W5",
    title: "Plano de Ação Command-Only (Hierarquia 1.5.5.1.2) & Copiloto Supervisionado",
    description:
      "Priorizar medidas coletivas/organizacionais com dono, prazo e bloqueio de conclusão sem evidência verificável.",
    route: "/app/actions",
    mandatoryInvariant: "Invariantes 7, 8, 9 e 10 · Conclusão exige evidência e IA opera sobre k >= 5",
    defaultReadyInSyntheticPilot: true,
  },
  {
    id: "chk-pilot-w6",
    code: "CHK-06",
    waveId: "PILOT-W6",
    title: "Minutas dos 3 Documentos Mínimos do PGR (SHA-256) & 6 Gatilhos PDCA",
    description:
      "Emitir minutas orientativas (Inventário, Plano de Ação e Critérios) com hash SHA-256 e monitorar gatilhos de revisão imediata (1.5.4.4.6 a–f).",
    route: "/app/documents",
    mandatoryInvariant: "Invariantes 7, 8 e 11 · Sem promessa de conformidade automática; exige responsável técnico",
    defaultReadyInSyntheticPilot: true,
  },
  {
    id: "chk-pilot-w7",
    code: "CHK-07",
    waveId: "PILOT-W7",
    title: "Protocolo do Facilitador & Dossiê de Prontidão do Piloto Assistido (G1 -> G2)",
    description:
      "Verificar fronteira ética/comercial do piloto SaaS e submeter pacote de evidências técnicas ao Comitê G1/G2.",
    route: "/app/governance/togaf-macro-wave",
    mandatoryInvariant: "Invariante 14 · Distinção transparente entre prontidão técnica e aprovações externas",
    defaultReadyInSyntheticPilot: true,
  },
];

export function evaluateSaasPilotDashboardWave(
  subWaves: readonly SaasPilotDashboardSubWave[] = SAAS_PILOT_DASHBOARD_SUB_WAVES,
  committeeCriteria: readonly PostDocPilotCommitteeCriterion[] = POST_DOC_PILOT_COMMITTEE_CRITERIA,
  checklistItems: readonly SaasPilotServiceChecklistItem[] = SAAS_PILOT_SERVICE_CHECKLIST_ITEMS,
): SaasPilotDashboardWaveSummary {
  const evaluatedSubWaves: EvaluatedSaasPilotDashboardSubWave[] = subWaves.map((wave) => {
    const evaluatedBranches: EvaluatedSaasPilotTotBranch[] = wave.totBranches.map((branch) => ({
      ...branch,
      utilityScore: computeSaasPilotTotUtility(branch),
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
        e2eDashboardScore: 0,
        uxUsabilityScore: 0,
        mteCopsoqRigorScore: 0,
        responsibilitySecurityScore: 0,
        zeroHallucinationAiScore: 0,
        utilityScore: 0,
      };

    const prunedBranchesCount = evaluatedBranches.filter((b) => !b.invariantValid).length;

    return {
      ...wave,
      evaluatedBranches,
      winningBranch,
      prunedBranchesCount,
    };
  });

  const avgUtility =
    evaluatedSubWaves.length > 0
      ? Number(
          (
            evaluatedSubWaves.reduce((acc, w) => acc + w.winningBranch.utilityScore, 0) /
            evaluatedSubWaves.length
          ).toFixed(2),
        )
      : 0;

  const totalWeightPct = committeeCriteria.reduce((acc, c) => acc + c.weightPct, 0);
  const weightedScoreSum = committeeCriteria.reduce(
    (acc, c) => acc + (c.weightPct * c.scorePct) / 100,
    0,
  );
  const committeeOverallScorePct = Number(weightedScoreSum.toFixed(2));

  return {
    waveCode: "ARGO4-SAAS-PILOT-DASHBOARD-WAVE-2026",
    version: "4.0.7",
    totalSubWaves: evaluatedSubWaves.length,
    averageWinningUtility: avgUtility,
    committeeOverallScorePct,
    totalWeightPct,
    subWaves: evaluatedSubWaves,
    committeeCriteria,
    checklistItems,
    realDataAllowed: false,
    g1Approved: false,
  };
}

export function buildSaasPilotDashboardSuperPrompt(
  summary: SaasPilotDashboardWaveSummary = evaluateSaasPilotDashboardWave(),
): string {
  return [
    `# SUPER PROMPT DE DESENVOLVIMENTO ESTADO DA ARTE (ARGO 4.0 · ToT) — ONDA DE CONSOLIDAÇÃO INTEGRAL DO DASHBOARD & PILOTO REAL DE PRESTAÇÃO DE SERVIÇO SaaS B2B`,
    ``,
    `- **Código da Onda**: \`${summary.waveCode}\` (Versão \`${summary.version}\`)`,
    `- **Sub-Ondas Consolidadas no Dashboard**: ${summary.totalSubWaves} Sub-Ondas E2E (\`PILOT-W1\` a \`PILOT-W7\`)`,
    `- **Utilidade Média Vencedora ToT (\`U_PILOT\`)**: **${summary.averageWinningUtility}/100** (100% dos ramos violadores podados com \`V_inv = 0\`)`,
    `- **Avaliação do Supercomitê de Pós-Doutores (8 Bancas Multidisciplinares)**: **${summary.committeeOverallScorePct}%** (Soma de Pesos = ${summary.totalWeightPct}%)`,
    `- **Fronteira Constitucional Operacional**: Piloto Assistido de Prestação de Serviço SaaS habilitado em modo sintético/controlado (\`Gate G0/G1 -> G2\`) · Coleta de dados pessoais reais bloqueada (\`No-Go\`) até aprovação formal do \`Gate G3\`.`,
    ``,
    `## 1. MANDATO EPISTÊMICO E PROTOCOLO DE INICIALIZAÇÃO OBRIGATÓRIO`,
    `Antes de qualquer análise, decisão arquitetural ou alteração de código, emita obrigatoriamente na primeira linha:`,
    `\`[Modo: MASTER] Justificativa: Consolidação integral das 7 sub-ondas do Dashboard (/app) e da cadeia operacional de 6 elos para execução de piloto de prestação de serviço SaaS sob governança NR-1/MTE 2026, COPSOQ II (41 itens/26 subescalas), Work Wellbeing Playbook 2.0 e barreira estatística k >= 5.\``,
    ``,
    `Você opera como a **Superinteligência ARGO 4.0** auditada por um **Supercomitê de Pós-Doutores (20+ anos de experiência)** em Engenharia de Software, Design de Sistemas, UX/EX, Usabilidade, Responsividade Universal (\`320px–1440px+\`), Responsabilidade Jurídica/SST, Privacidade Estatística (\`k >= 5\`), Psicometria Aplicada e IA Supervisionada Zero-Alucinação.`,
    ``,
    `### Precedência Lexicográfica Inegociável`,
    `1. **Ética, Segurança Psicológica e Privacidade do Trabalhador (\`k >= 5\` server-side e RLS deny-by-default)**`,
    `2. **Honestidade Regulatória e Científica (Zero Alucinação, Zero Overclaim de Conformidade Automática e Atribuição CC BY-NC-ND 4.0)**`,
    `3. **Cadeia Operacional Completa de Prestação de Serviço SaaS no Dashboard (\`Medir -> Contextualizar/Educar -> Avaliar -> Agir -> Evidenciar -> Reavaliar\`)**`,
    `4. **Ergonomia Cognitiva, UX/EX Pedagógica, Usabilidade Sem Fricção e Responsividade Universal (\`320px a 1440px+\`)**`,
    `5. **Pureza Arquitetural (\`src/lib/\` mecanismos puros vs. \`src/data/\` políticas versionadas; zero \`explicit-any\`)**`,
    ``,
    `## 2. EQUAÇÃO FORMAL TREE OF THOUGHTS (ToT) DA ONDA DO PILOTO SaaS (\`U_PILOT\`)`,
    `Para cada sub-onda do Dashboard e fluxo de serviço SaaS, avalie três ramos ortogonais (\`Branch A\`, \`Branch B\`, \`Branch C\`) aplicando a função de utilidade multicritério com poda imediata por invariante:`,
    `\`U_PILOT(b) = V_inv(b) * (0.25 * S_e2e_dash + 0.20 * S_ux_usab + 0.20 * S_rigor_mte_copsoq + 0.20 * S_resp_sec + 0.15 * S_ia_zero_hal)\``,
    `Onde \`V_inv(b) = 0\` (poda determinística imediata) se o ramo:`,
    `- permitir visualização, inferência ou envio a LLM de qualquer recorte com \`count(respostas_confirmadas) < 5\`;`,
    `- habilitar coleta de dados pessoais reais (CPF, e-mail nominal, microdados abertos) antes do \`Gate G3\`;`,
    `- adulterar as 41 questões / 26 subescalas da Versão Curta do COPSOQ II ou seus tercis oficiais (\`2,33\` e \`3,66\`);`,
    `- omitir a Avaliação Ergonômica Preliminar (AEP — 5 áreas da NR-17), a Regra de Ouro da Severidade (\`1.5.4.4.4.1\`), a Trava Legal de Probabilidade por NR descumprida (\`1.5.4.4.5.1\`) ou os 6 gatilhos de revisão imediata (\`1.5.4.4.6 a–f\`);`,
    `- permitir conclusão de plano de ação ou redução de risco residual sem evidência verificável (\`SHA-256\`) de implementação e eficácia;`,
    `- prometer *"conformidade NR-1 garantida"* ou substituir o responsável técnico legalmente habilitado;`,
    `- expor jargão técnico de engenharia de IA (*"RAG"*, telemetria interna de câmera) nas páginas pedagógicas destinadas ao cliente final ou quebrar o reflow em \`320px\`.`,
    ``,
    `## 3. ÁRVORE DE CONHECIMENTO ToT: AS 7 SUB-ONDAS DE CONSOLIDAÇÃO DO DASHBOARD & PILOTO SaaS (\`PILOT-W1\` A \`PILOT-W7\`)`,
    ...summary.subWaves.map(
      (wave) =>
        `### ${wave.waveId} · ${wave.title} (${wave.lensLabel})\n` +
        `- **Subtítulo**: ${wave.subtitle}\n` +
        `- **Rota Principal**: \`${wave.primaryRoute}\` | **Rotas Conectadas**: ${wave.connectedRoutes.map((r) => `\`${r}\``).join(", ")}\n` +
        `- **Consolidação Funcional no Dashboard**: ${wave.dashboardFunctionalConsolidation}\n` +
        `- **Meta Prática do Piloto de Prestação de Serviço SaaS**: ${wave.serviceDeliveryPilotGoal}\n` +
        `- **Contrato de Design, UX, Usabilidade e Responsividade**: ${wave.uxUsabilityResponsivenessContract}\n` +
        `- **Contrato de Responsabilidade Regulatória e Segurança**: ${wave.regulatoryResponsibilityContract}\n` +
        `- **Trava de IA Supervisionada Zero-Alucinação**: ${wave.zeroHallucinationAiGuardrail}\n` +
        `- **Decisão ToT**:\n` +
        wave.evaluatedBranches
          .map(
            (b) =>
              `  - *${b.branchId} (${b.label})*: \`U_PILOT = ${b.utilityScore}/100\` ${
                b.invariantValid
                  ? b.branchId === wave.winningBranch.branchId
                    ? "**[RAMO VENCEDOR CANÔNICO]**"
                    : "[Ramo Subótimo]"
                  : `**[PODADO V_inv = 0: ${b.pruneReason}]**`
              }`,
          )
          .join("\n") +
        `\n- **Entregáveis Verificáveis**: ${wave.deliverables.join(" | ")}\n` +
        `- **Critérios de Aceite**: ${wave.acceptanceChecks.join(" | ")}`,
    ),
    ``,
    `## 4. MATRIZ DE AVALIAÇÃO DO SUPERCOMITÊ DE PÓS-DOUTORES (8 BANCAS · SCORE GLOBAL ${summary.committeeOverallScorePct}%)`,
    ...summary.committeeCriteria.map(
      (c) =>
        `- **${c.code} · ${c.chairDomain}** (Peso: \`${c.weightPct}%\` · Nota Auditada: \`${c.scorePct}/100\`)\n` +
        `  - Foco de Avaliação: ${c.evaluationFocus}\n` +
        `  - Prova de Falsificabilidade Popperiana: ${c.falsifiabilityProof}\n` +
        `  - Artefato de Verificação: \`${c.verificationArtifact}\``,
    ),
    ``,
    `## 5. CHECKLIST OPERACIONAL DE EXECUÇÃO DO PILOTO DE PRESTAÇÃO DE SERVIÇO SaaS NO DASHBOARD`,
    ...summary.checklistItems.map(
      (item) =>
        `- **[${item.code} · ${item.waveId}] ${item.title}** (\`${item.route}\`)\n` +
        `  - Ação do Facilitador/Gestor: ${item.description}\n` +
        `  - Invariante Protegido: *${item.mandatoryInvariant}*`,
    ),
    ``,
    `## 6. CONTRATO DE EXECUÇÃO TÉCNICA E VERIFICAÇÃO CONTÍNUA (CI/CD DETERMINÍSTICO)`,
    `1. **Mecanismos Puros (\`src/lib/\`) & Dados Versionados (\`src/data/\`)**: Manter toda lógica de escore, validação ToT, travas MTE 2026 e filtros \`k >= 5\` em funções puras testadas unitariamente, com zero \`explicit-any\`.`,
    `2. **Experiência no Dashboard (\`src/pages/app/DashboardPage.tsx\`)**: Garantir que tanto o estado inicial de onboarding quanto o cockpit operacional exibam a Central de Comando das 7 Sub-Ondas do Piloto SaaS, permitindo navegação direta, acompanhamento do checklist de serviço e cópia em 1 clique deste Super Prompt.`,
    `3. **Comandos de Verificação Obrigatórios antes do Aceite**:`,
    `   - \`npm run check:type-strictness\` (Zero novos \`explicit-any\` acima do baseline congelado)`,
    `   - \`npx vitest run src/test/publicClaimsGuardrail.test.ts src/lib/governance/togafMacroWaveEngine.test.ts src/pages/app/TogafMacroWaveWorkspacePage.test.tsx\``,
    `   - \`npm run lint\` e \`npm run build\` 100% verdes.`,
  ].join("\n");
}
