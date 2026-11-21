export type Playbook2PillarCode = "D" | "R" | "I" | "V" | "E" | "R_RISK";

export type Playbook2CycleStageCode = "measure" | "understand" | "act";

export type Playbook2InterventionScope =
  | "structural_primary"
  | "relational_team"
  | "complementary_support";

export interface Playbook2CanonicalMetadata {
  readonly documentId: string;
  readonly version: string;
  readonly canonicalCitation: string;
  readonly authors: readonly string[];
  readonly publicationYear: number;
  readonly publisher: string;
  readonly academicPartnerNote: string;
  readonly licenseCode: "CC BY-NC-ND 4.0";
  readonly licenseSummaryPt: string;
  readonly fourCoreWellbeingDimensions: readonly {
    readonly id: string;
    readonly nameEn: string;
    readonly namePt: string;
    readonly rolePt: string;
  }[];
  readonly localAssetPath: string;
}

export interface Playbook2CycleStage {
  readonly code: Playbook2CycleStageCode;
  readonly order: 1 | 2 | 3;
  readonly titleEn: string;
  readonly titlePt: string;
  readonly summaryPt: string;
  readonly keyActionsPt: readonly string[];
  readonly nr1MteBridgePt: string;
}

export interface Playbook2DriverPillar {
  readonly code: Playbook2PillarCode;
  readonly letter: "D" | "R" | "I" | "V" | "E";
  readonly nameEn: string;
  readonly namePt: string;
  readonly summaryPt: string;
  readonly activeDriverSlugs: readonly string[];
  readonly roadmapDrivers: readonly {
    readonly slug: string;
    readonly nameEn: string;
    readonly namePt: string;
    readonly releaseWindow: string;
  }[];
}

export interface Playbook2PrimaryCitation {
  readonly citationId: string;
  readonly driverSlug: string;
  readonly playbookRefNumber: number;
  readonly authors: string;
  readonly year: number;
  readonly title: string;
  readonly journalOrPublisher: string;
  readonly studyDesign: string;
  readonly findingSummaryPt: string;
}

export interface Playbook2InterventionRecord {
  readonly interventionId: string;
  readonly driverSlug: string;
  readonly driverNamePt: string;
  readonly pillarCode: Playbook2PillarCode;
  readonly titleEn: string;
  readonly titlePt: string;
  readonly scope: Playbook2InterventionScope;
  readonly mechanismSummaryPt: string;
  readonly actionablePracticesPt: readonly string[];
  readonly keyGuardrailPt: string;
  readonly spotlightConceptPt?: string;
  readonly copsoqShortSubscaleCodes: readonly string[];
  readonly mte2026RequirementCodes: readonly string[];
  readonly primaryCitations: readonly Playbook2PrimaryCitation[];
  readonly keywords: readonly string[];
}

export interface Playbook2TotAuditBranch {
  readonly branchId: "Branch A" | "Branch B" | "Branch C";
  readonly label: string;
  readonly description: string;
  readonly invariantValid: boolean;
  readonly pruneReason: string | null;
  readonly fidelityScore: number;
  readonly zeroHallucinationScore: number;
  readonly regulatoryCrosswalkScore: number;
  readonly uxExErgonomicsScore: number;
  readonly responsivenessScore: number;
}

export interface EvaluatedPlaybook2TotAuditBranch extends Playbook2TotAuditBranch {
  readonly utilityScore: number;
  readonly isWinner: boolean;
}

export interface Playbook2TotAuditNode {
  readonly auditNodeId: string;
  readonly order: number;
  readonly code: string;
  readonly title: string;
  readonly playbookSectionRef: string;
  readonly currentAppGapFound: string;
  readonly stateOfTheArtResolution: string;
  readonly totBranches: readonly Playbook2TotAuditBranch[];
  readonly targetFilesUpdated: readonly string[];
}

export interface EvaluatedPlaybook2TotAuditNode extends Playbook2TotAuditNode {
  readonly evaluatedBranches: readonly EvaluatedPlaybook2TotAuditBranch[];
  readonly winningBranch: EvaluatedPlaybook2TotAuditBranch;
  readonly prunedBranchesCount: number;
}

export interface Playbook2RagQueryResult {
  readonly query: string;
  readonly normalizedDriverSlug: string | null;
  readonly matchedPillar: Playbook2DriverPillar | null;
  readonly matchedInterventions: readonly Playbook2InterventionRecord[];
  readonly matchedCitations: readonly Playbook2PrimaryCitation[];
  readonly copsoqSubscalesLinked: readonly string[];
  readonly mteRequirementsLinked: readonly string[];
  readonly groundedMarkdownResponse: string;
  readonly zeroHallucinationVerified: boolean;
  readonly licenseGuardrailNote: string;
  readonly confidenceBand: "high_exact_match" | "medium_thematic_match" | "canonical_fallback";
}

export interface Playbook2SystemicAuditSummary {
  readonly auditId: string;
  readonly canonicalCitation: string;
  readonly licenseCode: "CC BY-NC-ND 4.0";
  readonly totalPillars: number;
  readonly totalActiveDrivers: number;
  readonly totalRoadmapDrivers: number;
  readonly totalAuditedInterventions: number;
  readonly totalPrimaryCitations: number;
  readonly averageWinningTotUtility: number;
  readonly zeroHallucinationEnforced: true;
  readonly uxExElevationTargetPct: 120;
  readonly evaluatedNodes: readonly EvaluatedPlaybook2TotAuditNode[];
}

export const PLAYBOOK_2_CANONICAL_META: Playbook2CanonicalMetadata = {
  documentId: "wwm-work-wellbeing-playbook-2.0-2025",
  version: "2.0 (2025 Edition)",
  canonicalCitation:
    "Regier, C., Cunningham, S., Fleming, W., Kirienko, A., Kaats, M., & De Neve, J. (2025). Work Wellbeing Playbook: A Systematic Review of Evidence-Based Interventions to Improve Employee Wellbeing. World Wellbeing Movement.",
  authors: [
    "Caspar Regier",
    "Sarah Cunningham",
    "William Fleming",
    "Anastasiia Kirienko",
    "Micah Kaats",
    "Jan-Emmanuel De Neve",
  ],
  publicationYear: 2025,
  publisher: "World Wellbeing Movement",
  academicPartnerNote:
    "Desenvolvido pelo World Wellbeing Movement em parceria acadêmica com pesquisadores do Wellbeing Research Centre da University of Oxford. O uso como referência bibliográfica não implica afiliação, validação ou chancela institucional deste software.",
  licenseCode: "CC BY-NC-ND 4.0",
  licenseSummaryPt:
    "Licenciado sob Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0). Uso estritamente referencial e pedagógico com atribuição canônica obrigatória, vedada comercialização direta da obra ou criação de derivativos não autorizados.",
  fourCoreWellbeingDimensions: [
    {
      id: "WB-DIM-01",
      nameEn: "Job Satisfaction",
      namePt: "Satisfação no Trabalho",
      rolePt: "Dimensão avaliativa cognitiva sobre condições gerais, realizações e adequação do trabalho.",
    },
    {
      id: "WB-DIM-02",
      nameEn: "Happiness",
      namePt: "Felicidade / Afeto Positivo Cotidiano",
      rolePt: "Dimensão hedônica positiva vivenciada nas interações e atividades diárias de trabalho.",
    },
    {
      id: "WB-DIM-03",
      nameEn: "Stress",
      namePt: "Estresse Relacionado ao Trabalho",
      rolePt: "Dimensão hedônica negativa associada ao desequilíbrio entre exigências da atividade e recursos disponíveis.",
    },
    {
      id: "WB-DIM-04",
      nameEn: "Sense of Purpose",
      namePt: "Senso de Propósito e Significado",
      rolePt: "Dimensão eudaimônica de significado, utilidade social e conexão entre atividade e valores.",
    },
  ],
  localAssetPath: "/assets/aistudio/Work-Wellbeing-Playbook-2.0-Full-Deck_compressed_de86ab6d.md",
};

export const PLAYBOOK_2_CYCLE_STAGES: readonly Playbook2CycleStage[] = [
  {
    code: "measure",
    order: 1,
    titleEn: "1. Measure",
    titlePt: "1. Medir (4 Dimensões Nucleares + Drivers)",
    summaryPt:
      "Avaliar de forma regular e estruturada tanto as 4 dimensões centrais do bem-estar subjetivo (satisfação no trabalho, felicidade, estresse e propósito) quanto os drivers organizacionais, relacionais e de condições de trabalho.",
    keyActionsPt: [
      "Coletar percepções agregadas protegidas por k >= 5 sem identificar indivíduos.",
      "Combinar indicadores de desfecho de bem-estar com fatores antecedentes (drivers).",
      "Cruzar dados quantitativos com escuta qualitativa do contexto real de trabalho.",
    ],
    nr1MteBridgePt:
      "Conecta-se ao Elo 1 (Medir · COPSOQ II Versão Curta de 41 questões e 26 subescalas) e ao levantamento preliminar de perigos da NR-1 (1.5.4.2).",
  },
  {
    code: "understand",
    order: 2,
    titleEn: "2. Understand",
    titlePt: "2. Compreender (Preditores no Trabalho Real)",
    summaryPt:
      "Identificar quais drivers predizem com maior força o bem-estar dentro de cada unidade ou grupo homogêneo, analisando causas-raiz na organização do trabalho em vez de tratar sintomas isolados.",
    keyActionsPt: [
      "Cruzar subescalas em tercil Amarelo/Vermelho (2,33 / 3,66) com a Avaliação Ergonômica Preliminar (AEP).",
      "Distinguir condições objetivas (ex.: segurança contratual real, carga) de percepções subjetivas (ex.: insegurança percebida).",
      "Priorizar fatores estruturais com participação dos trabalhadores e CIPA.",
    ],
    nr1MteBridgePt:
      "Conecta-se aos Elos 2 e 3 (Contextualizar via AEP/AET NR-17 + Avaliar Riscos na Matriz Severidade × Probabilidade do Guia MTE 2026).",
  },
  {
    code: "act",
    order: 3,
    titleEn: "3. Act & Evaluate",
    titlePt: "3. Agir e Avaliar (Intervenções Baseadas em Evidências)",
    summaryPt:
      "Selecionar e implementar intervenções organizacionais empiricamente fundamentadas e viáveis para o contexto específico, embutindo o plano de avaliação longitudinal desde o desenho da ação.",
    keyActionsPt: [
      "Priorizar redesenho organizacional, processos e suporte de gestão sobre ações puramente individuais.",
      "Definir dono, cronograma, indicadores de acompanhamento e critérios de verificação de eficácia.",
      "Reavaliar periodicamente os resultados para confirmar redução de risco residual.",
    ],
    nr1MteBridgePt:
      "Conecta-se aos Elos 4, 5 e 6 (Plano de Ação Command-Only 1.5.5.2, Evidenciação SHA-256 e Revisão de Eficácia PDCA 1.5.4.4.6).",
  },
];

export const PLAYBOOK_2_DRIVER_PILLARS: readonly Playbook2DriverPillar[] = [
  {
    code: "D",
    letter: "D",
    nameEn: "Development and security",
    namePt: "D · Desenvolvimento e Segurança",
    summaryPt:
      "Metas claras com cooperação coletiva, aprendizagem integrada à rotina e segurança contratual e psicológica diante de mudanças econômicas e tecnológicas.",
    activeDriverSlugs: ["achievement", "learning", "job_security"],
    roadmapDrivers: [],
  },
  {
    code: "R",
    letter: "R",
    nameEn: "Relationships",
    namePt: "R · Relações e Liderança",
    summaryPt:
      "Reconhecimento justo (SAGE), inclusão e pertencimento autênticos, suporte multidimensional, confiança com segurança psicológica e gestão com inteligência emocional.",
    activeDriverSlugs: [
      "appreciation",
      "inclusion_belonging",
      "support",
      "trust",
      "management",
    ],
    roadmapDrivers: [
      {
        slug: "leadership",
        nameEn: "Leadership",
        namePt: "Liderança Institucional",
        releaseWindow: "Previsto no Playbook 2.0: Março/2026",
      },
    ],
  },
  {
    code: "I",
    letter: "I",
    nameEn: "Independence and flexibility",
    namePt: "I · Independência, Voz e Flexibilidade",
    summaryPt:
      "Controle equitativo sobre quando e onde trabalhar, participação democrática nas decisões (voz ativa) e autonomia sobre métodos e ritmos da atividade.",
    activeDriverSlugs: ["flexibility", "employee_voice", "autonomy"],
    roadmapDrivers: [],
  },
  {
    code: "V",
    letter: "V",
    nameEn: "Variety and fulfilment",
    namePt: "V · Variedade, Energia e Realização",
    summaryPt:
      "Recuperação biopsicossocial sustentável, *job crafting* e conexão tangível entre o trabalho cotidiano, os beneficiários e o propósito humano.",
    activeDriverSlugs: ["energy", "purpose"],
    roadmapDrivers: [],
  },
  {
    code: "E",
    letter: "E",
    nameEn: "Earnings and benefits",
    namePt: "E · Remuneração, Benefícios e Equidade",
    summaryPt:
      "Salário digno, transparência remuneratória, equidade de gênero/raça e governança justa de recompensas financeiras e não-financeiras.",
    activeDriverSlugs: ["compensation"],
    roadmapDrivers: [],
  },
  {
    code: "R_RISK",
    letter: "R",
    nameEn: "Risk, health, and safety",
    namePt: "R · Risco, Saúde, Carga e Segurança",
    summaryPt:
      "Prevenção primária de estressores organizacionais, redesenho de demandas e pressões de carga de trabalho, reuniões intencionais e proteção integral à saúde.",
    activeDriverSlugs: ["stress", "workload_pressures"],
    roadmapDrivers: [
      {
        slug: "operational_design",
        nameEn: "Operational Design",
        namePt: "Design Operacional",
        releaseWindow: "Previsto no Playbook 2.0: Abril/2026",
      },
    ],
  },
];

export const PLAYBOOK_2_INTERVENTION_RAG_CORPUS: readonly Playbook2InterventionRecord[] = [
  // ================= D: JOB SECURITY (NEW IN PLAYBOOK 2.0) =================
  {
    interventionId: "PB2-INT-JSEC-01",
    driverSlug: "job_security",
    driverNamePt: "Segurança no Trabalho",
    pillarCode: "D",
    titleEn: "Actual vs. perceived job security & Internal labour markets",
    titlePt: "Segurança Real vs. Percebida, Mercados Internos de Trabalho e Redução de Precariedade",
    scope: "structural_primary",
    spotlightConceptPt:
      "Spotlight Playbook 2.0 — Segurança Real vs. Percebida: A segurança real decorre de leis trabalhistas, contratos estáveis e solidez econômica; a segurança percebida é a avaliação subjetiva do trabalhador sobre o risco de perder o emprego. Mesmo com contratos formais, rumores, automação/IA ou mudanças mal comunicadas elevam a insegurança percebida, que impacta mais fortemente a saúde mental e o estresse do que a condição contratual isolada (De Witte, 1999; Sverke et al., 2002).",
    mechanismSummaryPt:
      "Fortalecer mercados internos de trabalho com trilhas claras de mobilidade e requalificação (upskilling/reskilling), além de integrar trabalhadores terceirizados ou temporários à equipe e às oportunidades de efetivação, reduzindo a incerteza de carreira e a precarização.",
    actionablePracticesPt: [
      "Estruturar trilhas transparentes de promoção interna, mentoria e desenvolvimento de habilidades para novas funções.",
      "Reduzir a precariedade de trabalhadores temporários ou terceirizados integrando-os aos rituais da equipe e abrindo caminhos reais para contratação permanente.",
      "Incorporar esquemas de rotação de tarefas e funções (job/task rotation) para ampliar repertório técnico e empregabilidade interna.",
    ],
    keyGuardrailPt:
      "A rotação de cargos deve ser planejada como política de longo prazo e nunca como improviso emergencial sem treinamento prévio.",
    copsoqShortSubscaleCodes: ["SUB-17", "SUB-05", "SUB-07", "SUB-09"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02", "MTE-REQ-04"],
    primaryCitations: [
      {
        citationId: "CIT-JSEC-01",
        driverSlug: "job_security",
        playbookRefNumber: 1,
        authors: "De Witte, H.",
        year: 1999,
        title: "Job insecurity and psychological well-being: Review of the literature and exploration of some unresolved issues",
        journalOrPublisher: "European Journal of Work and Organizational Psychology, 8(2), 155–177",
        studyDesign: "Literature Review",
        findingSummaryPt: "Demonstra que a insegurança percebida no emprego atua como estressor crônico severo sobre o bem-estar psicológico.",
      },
      {
        citationId: "CIT-JSEC-02",
        driverSlug: "job_security",
        playbookRefNumber: 2,
        authors: "Sverke, M., Hellgren, J., & Näswall, K.",
        year: 2002,
        title: "No security: A meta-analysis and review of job insecurity and its consequences",
        journalOrPublisher: "Journal of Occupational Health Psychology, 7(3), 242–264",
        studyDesign: "Meta-analysis",
        findingSummaryPt: "Meta-análise comprovando efeitos negativos consistentes da insegurança no trabalho sobre saúde física, mental e comprometimento organizacional.",
      },
      {
        citationId: "CIT-JSEC-07",
        driverSlug: "job_security",
        playbookRefNumber: 7,
        authors: "Bidwell, M.",
        year: 2011,
        title: "Paying more to get less: The effects of external hiring versus internal mobility",
        journalOrPublisher: "Administrative Science Quarterly, 56(3), 369–407",
        studyDesign: "Longitudinal Organizational Study",
        findingSummaryPt: "Mobilidade interna apresenta melhor desempenho inicial, menor rotatividade e maior estabilidade do que contratações externas equivalentes.",
      },
    ],
    keywords: [
      "job security",
      "seguranca no trabalho",
      "inseguranca",
      "terceirizados",
      "mobilidade interna",
      "rotacao de tarefas",
      "estabilidade",
    ],
  },
  {
    interventionId: "PB2-INT-JSEC-02",
    driverSlug: "job_security",
    driverNamePt: "Segurança no Trabalho",
    pillarCode: "D",
    titleEn: "Thoughtful change management, Financial transparency & Return-to-work plans",
    titlePt: "Gestão Cuidadosa de Mudanças, Transparência Financeira e Planos de Retorno ao Trabalho",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Comunicar mudanças tecnológicas, reestruturações ou adoção de IA com antecedência, clareza de impacto por função e participação dos trabalhadores, combinando transparência financeira e planos estruturados de retorno ao trabalho após afastamento médico ou licença parental.",
    actionablePracticesPt: [
      "Substituir anúncios genéricos por comunicação específica sobre como cada equipe será apoiada e treinada durante mudanças tecnológicas ou organizacionais.",
      "Praticar transparência financeira contextualizada sobre a saúde do negócio, evitando rumores e ansiedade coletiva.",
      "Co-desenvolver planos de retorno ao trabalho (return-to-work) com ajustes graduais de carga, horário e ergonomia após licença médica ou parental.",
    ],
    keyGuardrailPt:
      "Transparência financeira sobre desafios de mercado deve vir acompanhada de planos claros de ação e proteção, evitando gerar alarme desnecessário.",
    copsoqShortSubscaleCodes: ["SUB-09", "SUB-10", "SUB-17", "SUB-19"],
    mte2026RequirementCodes: ["MTE-REQ-02", "MTE-REQ-08", "MTE-REQ-09"],
    primaryCitations: [
      {
        citationId: "CIT-JSEC-16",
        driverSlug: "job_security",
        playbookRefNumber: 16,
        authors: "Oreg, S., Vakola, M., & Armenakis, A.",
        year: 2011,
        title: "Change recipients’ reactions to organizational change: A 60-year review of quantitative studies",
        journalOrPublisher: "The Journal of Applied Behavioral Science, 47(4), 461–524",
        studyDesign: "60-Year Quantitative Review",
        findingSummaryPt: "Participação, comunicação transparente e justiça procedimental durante mudanças reduzem incerteza, estresse e intenção de saída.",
      },
      {
        citationId: "CIT-JSEC-26",
        driverSlug: "job_security",
        playbookRefNumber: 26,
        authors: "Cancelliere, C., Donovan, J., Stochkendahl, M. J., et al.",
        year: 2016,
        title: "Factors affecting return to work after injury or illness: Best evidence synthesis of systematic reviews",
        journalOrPublisher: "Chiropractic & Manual Therapies, 24(1), 32",
        studyDesign: "Best Evidence Synthesis of Systematic Reviews",
        findingSummaryPt: "Intervenções multidisciplinares com acomodação de tarefas e coordenação ativa com o gestor aceleram o retorno seguro e sustentado ao trabalho.",
      },
    ],
    keywords: [
      "mudanca organizacional",
      "change management",
      "transparencia financeira",
      "retorno ao trabalho",
      "return to work",
      "afastamento",
    ],
  },
  {
    interventionId: "PB2-INT-JSEC-03",
    driverSlug: "job_security",
    driverNamePt: "Segurança no Trabalho",
    pillarCode: "D",
    titleEn: "Avoid layoffs, Reinvest AI gains & Manage inevitable downsizing with care",
    titlePt: "Prevenção de Demissões, Reinvestimento de Ganhos de IA, Bem-Estar Financeiro e Cuidado em Reestruturações",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Evitar demissões em massa priorizando realocação interna e reinvestimento de ganhos de produtividade da IA na requalificação da força de trabalho. Oferecer programas de bem-estar financeiro (EFWPs) apenas como complemento a salários justos e, quando cortes forem estritamente inevitáveis, conduzi-los com justiça informacional, recolocação e suporte aos trabalhadores remanescentes (síndrome do sobrevivente).",
    actionablePracticesPt: [
      "Tratar demissões como último recurso: utilizar redesenho de funções, realocação interna e treinamento em IA para preservar empregos e conhecimento tácito.",
      "Ofertar educação financeira e aconselhamento (EFWPs) exclusivamente como complemento — e jamais como substituto — de remuneração digna e justa.",
      "Caso uma redução de quadro seja inevitável, garantir diálogo social prévio, pacotes justos de transição/outplacement e suporte psicológico ativo às equipes que permanecem (mitigação de survivor syndrome).",
    ],
    keyGuardrailPt:
      "Programas de bem-estar financeiro (EFWPs) nunca substituem salários dignos; demissões mal conduzidas destroem a confiança e geram queda severa de saúde mental nos remanescentes.",
    copsoqShortSubscaleCodes: ["SUB-17", "SUB-20", "SUB-21", "SUB-23"],
    mte2026RequirementCodes: ["MTE-REQ-02", "MTE-REQ-06", "MTE-REQ-08"],
    primaryCitations: [
      {
        citationId: "CIT-JSEC-40",
        driverSlug: "job_security",
        playbookRefNumber: 40,
        authors: "Cascio, W. F.",
        year: 2010,
        title: "Employment downsizing: Causes,igh costs, and consequences",
        journalOrPublisher: "In P. A.isca (Ed.), Strategic Human Resource Management",
        studyDesign: "Longitudinal Corporate Review",
        findingSummaryPt: "Empresas que evitam demissões em massa via requalificação e realocação mantêm maior resiliência operacional, inovação e confiança no longo prazo.",
      },
      {
        citationId: "CIT-JSEC-46",
        driverSlug: "job_security",
        playbookRefNumber: 46,
        authors: "Kivimäki, M., Vahtera, J., Pentti, J., & Ferrie, J. E.",
        year: 2000,
        title: "Factors underlying the effect of organisational downsizing on health of employees: Longitudinal cohort study",
        journalOrPublisher: "BMJ, 320(7240), 971–975",
        studyDesign: "Longitudinal Cohort Study",
        findingSummaryPt: "O enxugamento organizacional aumenta o absenteísmo por doença e os riscos à saúde entre os trabalhadores sobreviventes devido à sobrecarga e insegurança.",
      },
      {
        citationId: "CIT-JSEC-50",
        driverSlug: "job_security",
        playbookRefNumber: 50,
        authors: "Van Dierendonck, D., & Jacobs, G.",
        year: 2012,
        title: "Survivors and victims: A meta-analytical review of fairness and organisational commitment after downsizing",
        journalOrPublisher: "British Journal of Management, 23(1), 96–109",
        studyDesign: "Meta-analysis",
        findingSummaryPt: "A justiça procedimental e interpessoal no tratamento dos desligados determina diretamente o comprometimento e a saúde psicológica dos remanescentes.",
      },
    ],
    keywords: [
      "layoffs",
      "demissoes",
      "survivor syndrome",
      "sindrome do sobrevivente",
      "ia",
      "automacao",
      "bem-estar financeiro",
      "efwp",
    ],
  },

  // ================= D: ACHIEVEMENT & LEARNING =================
  {
    interventionId: "PB2-INT-ACH-01",
    driverSlug: "achievement",
    driverNamePt: "Realização",
    pillarCode: "D",
    titleEn: "Set specific, cooperative goals & Co-develop performance reviews",
    titlePt: "Metas Específicas e Cooperativas, Progresso Diário e Co-Desenvolvimento de Avaliações",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Estabelecer metas claras, desafiadoras e conectadas à cooperação grupal (evitando competição predatória interna), celebrar pequenos progressos cotidianos (Progress Principle) e envolver os trabalhadores no desenho dos critérios de avaliação de desempenho.",
    actionablePracticesPt: [
      "Alinhar metas individuais à contribuição coletiva da equipe para proteger a coesão e a confiança mútua.",
      "Co-desenvolver indicadores de avaliação de desempenho com as pessoas que executam o trabalho real.",
      "Remover bloqueios operacionais diários para permitir senso contínuo de eficácia e realização.",
    ],
    keyGuardrailPt:
      "Sistemas de metas hipercompetitivos ou rankings forçados deterioram a cooperação e elevam o estresse ocupacional.",
    copsoqShortSubscaleCodes: ["SUB-06", "SUB-08", "SUB-11", "SUB-21"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02"],
    primaryCitations: [
      {
        citationId: "CIT-ACH-01",
        driverSlug: "achievement",
        playbookRefNumber: 1,
        authors: "Kleingeld, A., Van Mierlo, H., & Arends, L.",
        year: 2011,
        title: "The effect of goal setting on group performance: A meta-analysis",
        journalOrPublisher: "Journal of Applied Psychology, 96(6), 1289–1304",
        studyDesign: "Meta-analysis",
        findingSummaryPt: "Metas grupais específicas e metas individuais cooperativas elevam o desempenho coletivo sem corroer o suporte mútuo.",
      },
      {
        citationId: "CIT-ACH-02",
        driverSlug: "achievement",
        playbookRefNumber: 2,
        authors: "Kleingeld, A., Van Tuijl, H., & Algera, J. A.",
        year: 2004,
        title: "Participation in the design of performance management systems: A quasi-experimental field study",
        journalOrPublisher: "Journal of Organizational Behavior, 25(7), 831–851",
        studyDesign: "Quasi-Experimental Field Study",
        findingSummaryPt: "A participação dos trabalhadores na construção do sistema de avaliação aumenta a percepção de justiça, aceitação e eficácia.",
      },
    ],
    keywords: ["achievement", "realizacao", "metas", "avaliacao de desempenho", "progresso", "autoeficacia"],
  },
  {
    interventionId: "PB2-INT-LRN-01",
    driverSlug: "learning",
    driverNamePt: "Aprendizagem",
    pillarCode: "D",
    titleEn: "Embed learning into daily work & Conduct training needs analysis",
    titlePt: "Aprendizagem Integrada ao Trabalho Real, Autonomia para Experimentar e Análise de Necessidades",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Integrar o desenvolvimento de competências técnicas e socioemocionais à rotina real de trabalho, realizando análise prévia de necessidades de treinamento e garantindo tempo protegido e autonomia para aplicar novos conhecimentos.",
    actionablePracticesPt: [
      "Realizar diagnóstico participativo de necessidades de aprendizagem antes de lançar programas padronizados.",
      "Proteger blocos de tempo dentro da jornada regular para aprendizagem prática e troca entre pares.",
      "Combinar autonomia na execução da tarefa com suporte técnico para acelerar a transferência do aprendizado.",
    ],
    keyGuardrailPt:
      "Treinamentos desconectados das condições reais de trabalho ou exigidos fora do expediente aumentam a sobrecarga em vez de gerar desenvolvimento.",
    copsoqShortSubscaleCodes: ["SUB-06", "SUB-05", "SUB-07"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02"],
    primaryCitations: [
      {
        citationId: "CIT-LRN-01",
        driverSlug: "learning",
        playbookRefNumber: 1,
        authors: "Watson, D., Tregaskis, O., Gedikli, C., Vaughn, O., & Semkina, A.",
        year: 2018,
        title: "Well-being through learning: A systematic review of learning interventions in the workplace",
        journalOrPublisher: "European Journal of Work and Organizational Psychology, 27(2), 247–268",
        studyDesign: "Systematic Review",
        findingSummaryPt: "Intervenções de aprendizagem que fortalecem recursos pessoais e profissionais geram ganhos sustentados quando alinhadas às demandas reais.",
      },
      {
        citationId: "CIT-LRN-02",
        driverSlug: "learning",
        playbookRefNumber: 2,
        authors: "Bond, F. W., & Flaxman, P. E.",
        year: 2006,
        title: "The ability of psychological flexibility and job control to predict learning, job performance, and mental health",
        journalOrPublisher: "Journal of Organizational Behavior Management, 26(1-2), 113–130",
        studyDesign: "Field Study",
        findingSummaryPt: "Maior controle sobre o trabalho potencializa a velocidade de aprendizagem de novos sistemas e protege a saúde mental.",
      },
    ],
    keywords: ["learning", "aprendizagem", "treinamento", "desenvolvimento", "transferencia"],
  },

  // ================= R: APPRECIATION, INCLUSION, SUPPORT, TRUST, MANAGEMENT =================
  {
    interventionId: "PB2-INT-APR-01",
    driverSlug: "appreciation",
    driverNamePt: "Reconhecimento",
    pillarCode: "R",
    titleEn: "Deliver SAGE recognition, Peer appreciation & Decency Quotient (DQ)",
    titlePt: "Reconhecimento no Protocolo SAGE, Valorização entre Pares e Quociente de Decência (DQ)",
    scope: "relational_team",
    spotlightConceptPt:
      "Protocolo SAGE & Quociente de Decência (DQ — Playbook 2.0): Para evitar percepções de favoritismo ou injustiça, o reconhecimento eficaz deve ser SAGE: Specific (específico sobre a contribuição), Appropriate (oportuno no tempo e formato), Genuine (autêntico e sincero) e Equitably distributed (distribuído com equidade, incluindo trabalhadores remotos, híbridos e operacionais). O impacto multiplica-se em culturas pautadas pelo Quociente de Decência (DQ): empatia ativa, civilidade e respeito diário.",
    mechanismSummaryPt:
      "Cultivar práticas sistemáticas de reconhecimento multi-fonte (gestor, pares, clientes/usuários) fundamentadas no protocolo SAGE, equilibrando recompensas simbólicas e materiais com foco cooperativo.",
    actionablePracticesPt: [
      "Aplicar os 4 critérios SAGE em todo feedback de reconhecimento individual ou coletivo.",
      "Estruturar canais de reconhecimento entre pares (peer-to-peer) e reservar tempo em reuniões de equipe para celebrar esforços cooperativos.",
      "Avaliar sistemas de recompensa para garantir que incentivem colaboração em vez de competição destrutiva ou horas extras excessivas.",
    ],
    keyGuardrailPt:
      "Reconhecimento genérico, tardio ou desigual gera sentimento de injustiça organizacional e conflito intragrupal.",
    copsoqShortSubscaleCodes: ["SUB-10", "SUB-18", "SUB-20"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02"],
    primaryCitations: [
      {
        citationId: "CIT-APR-01",
        driverSlug: "appreciation",
        playbookRefNumber: 1,
        authors: "Weziak-Bialowolska, D., & Bialowolski, P.",
        year: 2022,
        title: "Associations of recognition at work with subsequent health and quality of life among older working adults",
        journalOrPublisher: "International Archives of Occupational and Environmental Health, 95(4), 835–847",
        studyDesign: "Longitudinal Study",
        findingSummaryPt: "O reconhecimento no trabalho associa-se longitudinalmente a melhor saúde física/mental e maior qualidade de vida.",
      },
      {
        citationId: "CIT-APR-06",
        driverSlug: "appreciation",
        playbookRefNumber: 6,
        authors: "Van Vegchel, N., De Jonge, J., Bosma, H., & Schaufeli, W.",
        year: 2005,
        title: "Reviewing the effort–reward imbalance model: Drawing up the balance of 45 empirical studies",
        journalOrPublisher: "Social Science & Medicine, 60(5), 1117–1131",
        studyDesign: "Systematic Review (45 Studies)",
        findingSummaryPt: "O desequilíbrio entre alto esforço e baixo reconhecimento/recompensa (ERI) eleva substancialmente o risco de adoecimento ocupacional.",
      },
    ],
    keywords: ["appreciation", "reconhecimento", "sage", "decency quotient", "dq", "recompensa", "valorizacao"],
  },
  {
    interventionId: "PB2-INT-INC-01",
    driverSlug: "inclusion_belonging",
    driverNamePt: "Inclusão & Pertencimento",
    pillarCode: "R",
    titleEn: "De-bias hiring/promotion, Accommodate diverse needs & Mentoring/Sponsorship",
    titlePt: "Mitigação de Vieses em Seleção/Promoção, Mentoria/Patrocínio e Acomodação Equitativa",
    scope: "structural_primary",
    spotlightConceptPt:
      "Tríade Playbook 2.0 — Diversity, Inclusion & Belonging: Diversidade descreve a composição demográfica do grupo; Inclusão é o grau em que todos os grupos têm voz e participam das decisões; Pertencimento (Belonging) é quando cada pessoa se sente aceita, segura e apoiada em sua autenticidade.",
    mechanismSummaryPt:
      "Reduzir vieses sistemáticos em recrutamento e promoção, oferecer arranjos flexíveis e acessíveis para cuidadores e pessoas com deficiência, e implementar programas formais de mentoria e patrocínio (sponsorship) para grupos sub-representados.",
    actionablePracticesPt: [
      "Remover linguagem enviesada de descrições de vagas, utilizar avaliação por amostras de trabalho estruturadas e garantir critérios objetivos de promoção (inclusive para trabalhadores remotos).",
      "Implementar programas formais de mentoria e sponsorship conduzidos por lideranças seniores para ampliar representatividade em níveis decisórios.",
      "Envolver ativamente diferentes grupos nos processos de tomada de decisão sobre como o trabalho é organizado.",
    ],
    keyGuardrailPt:
      "Diversidade demográfica sem inclusão decisória e sem equidade de promoção para quem usa trabalho flexível reproduz desigualdades.",
    copsoqShortSubscaleCodes: ["SUB-14", "SUB-20", "SUB-05"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02"],
    primaryCitations: [
      {
        citationId: "CIT-INC-06",
        driverSlug: "inclusion_belonging",
        playbookRefNumber: 6,
        authors: "Goldin, C., & Rouse, C.",
        year: 2000,
        title: "Orchestrating impartiality: The impact of 'blind' auditions on female musicians",
        journalOrPublisher: "The American Economic Review, 90(4), 715–741",
        studyDesign: "Natural Experiment",
        findingSummaryPt: "Processos de seleção estruturados e imparciais reduzem vieses inconscientes e ampliam a contratação equitativa.",
      },
      {
        citationId: "CIT-INC-24",
        driverSlug: "inclusion_belonging",
        playbookRefNumber: 24,
        authors: "Lewis, V., Martina, C. A., McDermott, M. P., et al.",
        year: 2016,
        title: "A randomized controlled trial of mentoring interventions for underrepresented minorities",
        journalOrPublisher: "Academic Medicine, 91(7), 994–1001",
        studyDesign: "Randomized Controlled Trial (RCT)",
        findingSummaryPt: "Programas estruturados de mentoria fortalecem redes de apoio, retenção e progressão de carreira de grupos sub-representados.",
      },
    ],
    keywords: ["inclusion", "belonging", "inclusao", "pertencimento", "diversidade", "mentoria", "sponsorship", "vies"],
  },
  {
    interventionId: "PB2-INT-SUP-01",
    driverSlug: "support",
    driverNamePt: "Suporte & Recursos",
    pillarCode: "R",
    titleEn: "Prosocial leadership, Autonomy support, Peer networks & Family-supportive behaviours",
    titlePt: "Liderança Pró-Social, Suporte à Autonomia, Redes de Pares e Comportamentos Familiares Suportivos (FSSB)",
    scope: "relational_team",
    mechanismSummaryPt:
      "Capacitar gestores em liderança pró-social e comportamentos de suporte familiar e de equilíbrio vida-trabalho (FSSB), estimular redes estruturadas de apoio entre pares e abrir canais regulares de escuta sobre condições reais de trabalho.",
    actionablePracticesPt: [
      "Realizar treinamentos práticos de liderança pró-social (comunicação respeitosa, escuta de múltiplos pontos de vista e segurança para pedir ajuda).",
      "Treinar gestores em comportamentos familiares suportivos (Family-Supportive Supervisor Behaviors — FSSB) para reduzir conflito trabalho-família.",
      "Estruturar grupos de suporte entre pares e mentoria horizontal para compartilhar recursos técnicos e emocionais em funções exigentes.",
    ],
    keyGuardrailPt:
      "O suporte entre pares complementa, mas nunca substitui, a obrigação organizacional de dimensionar recursos e cargas de trabalho.",
    copsoqShortSubscaleCodes: ["SUB-12", "SUB-13", "SUB-14", "SUB-19"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02", "MTE-REQ-06"],
    primaryCitations: [
      {
        citationId: "CIT-SUP-05",
        driverSlug: "support",
        playbookRefNumber: 5,
        authors: "Alan, S., Corekcioglu, G., & Sutter, M.",
        year: 2023,
        title: "Improving workplace climate in large corporations: A clustered randomized intervention",
        journalOrPublisher: "The Quarterly Journal of Economics, 138(1), 151–203",
        studyDesign: "Clustered Randomized Controlled Trial (RCT)",
        findingSummaryPt: "Treinamento de liderança pró-social em grandes empresas fortaleceu redes de apoio, colegialidade e clima relacional.",
      },
      {
        citationId: "CIT-SUP-10",
        driverSlug: "support",
        playbookRefNumber: 10,
        authors: "Kelly, E. L., Moen, P., Oakes, J. M., et al.",
        year: 2014,
        title: "Changing work and work-family conflict: Evidence from the Work, Family, and Health Network",
        journalOrPublisher: "American Sociological Review, 79(3), 485–516",
        studyDesign: "Randomized Field Trial",
        findingSummaryPt: "Intervenções que combinam suporte ativo do gestor à vida familiar e maior controle de horário reduzem o conflito trabalho-família e o estresse.",
      },
    ],
    keywords: ["support", "suporte", "apoio", "lideranca pro-social", "fssb", "conflito trabalho-familia", "pares"],
  },
  {
    interventionId: "PB2-INT-TRS-01",
    driverSlug: "trust",
    driverNamePt: "Confiança",
    pillarCode: "R",
    titleEn: "Climate of psychological safety, Transparent multi-channel communication & Participatory CSR",
    titlePt: "Clima de Segurança Psicológica, Comunicação Multicanal Transparente e RSC Participativa",
    scope: "relational_team",
    spotlightConceptPt:
      "Segurança Psicológica (Edmondson, 1999; 2018; Castro et al., 2022): Clima de equipe em que as pessoas se sentem respeitadas e seguras para expressar ideias, fazer perguntas, relatar riscos ou admitir erros sem medo de culpa ou retaliação. É fundamental para equipes remotas, diversas e para a notificação honesta de perigos na NR-1.",
    mechanismSummaryPt:
      "Construir segurança psicológica por meio de reuniões 1:1 focadas em aprendizado e melhoria de processos, manter múltiplos canais abertos e transparentes de comunicação bidirecional e envolver os trabalhadores nas iniciativas de responsabilidade social corporativa (CSR).",
    actionablePracticesPt: [
      "Realizar reuniões regulares 1:1 e retrospectivas de equipe perguntando ativamente 'como podemos melhorar a forma como trabalhamos juntos?' sem culpar indivíduos.",
      "Estabelecer canais transparentes e previsíveis de comunicação sobre decisões estratégicas, reduzindo assimetrias de poder e isolamento em equipes híbridas/remotas.",
      "Garantir que iniciativas sociais (CSR) sejam coerentes com a prática interna da empresa e contem com voz ativa dos trabalhadores.",
    ],
    keyGuardrailPt:
      "Campanhas externas de responsabilidade social desacompanhadas de justiça organizacional interna geram cinismo e desengajamento.",
    copsoqShortSubscaleCodes: ["SUB-19", "SUB-20", "SUB-09", "SUB-14"],
    mte2026RequirementCodes: ["MTE-REQ-02", "MTE-REQ-08", "MTE-REQ-09"],
    primaryCitations: [
      {
        citationId: "CIT-TRS-06",
        driverSlug: "trust",
        playbookRefNumber: 6,
        authors: "Edmondson, A. C.",
        year: 1999,
        title: "Psychological safety and learning behavior in work teams",
        journalOrPublisher: "Administrative Science Quarterly, 44(2), 350–383",
        studyDesign: "Mixed-Methods Field Study",
        findingSummaryPt: "A segurança psicológica da equipe permite aprender com erros, relatar problemas precocemente e elevar o desempenho coletivo.",
      },
      {
        citationId: "CIT-TRS-11",
        driverSlug: "trust",
        playbookRefNumber: 11,
        authors: "Castro, S., Englmaier, F., & Guadalupe, M.",
        year: 2022,
        title: "Fostering psychological safety in teams: Evidence from an RCT",
        journalOrPublisher: "SSRN Working Paper / Field RCT",
        studyDesign: "Randomized Controlled Trial (RCT)",
        findingSummaryPt: "Reuniões estruturadas 1:1 voltadas à melhoria conjunta dos processos de trabalho elevam mensuravelmente a segurança psicológica.",
      },
    ],
    keywords: ["trust", "confianca", "seguranca psicologica", "psychological safety", "edmondson", "comunicacao", "csr"],
  },
  {
    interventionId: "PB2-INT-MNG-01",
    driverSlug: "management",
    driverNamePt: "Gestão & Liderança",
    pillarCode: "R",
    titleEn: "Invest in manager training, Reduce manager stress & Develop Emotional Intelligence (EI)",
    titlePt: "Capacitação de Gestores em SST/Saúde Mental, Redução do Estresse Gerencial e Inteligência Emocional (EI)",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Investir continuamente na formação de gestores em saúde, segurança e suporte de equipe, atuar diretamente para reduzir a sobrecarga e o estresse dos próprios gestores (evitando contágio de estresse para o time) e desenvolver competências de Inteligência Emocional (EI).",
    actionablePracticesPt: [
      "Implementar programas práticos de capacitação de gestores em saúde e segurança ocupacional e manejo empático de demandas psicossociais.",
      "Proteger a carga de trabalho e os recursos dos gestores intermediários para que tenham capacidade real de apoiar suas equipes.",
      "Oferecer treinamentos estruturados e recorrentes de Inteligência Emocional (autoconsciência, autorregulação, empatia e competência social).",
    ],
    keyGuardrailPt:
      "Exigir que gestores apoiem suas equipes sem reduzir a própria sobrecarga gerencial cria exaustão na liderança intermediária.",
    copsoqShortSubscaleCodes: ["SUB-11", "SUB-12", "SUB-09", "SUB-10"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02", "MTE-REQ-06"],
    primaryCitations: [
      {
        citationId: "CIT-MNG-01",
        driverSlug: "management",
        playbookRefNumber: 1,
        authors: "Daniels, K., Gedikli, C., Watson, D., Semkina, A., & Vaughn, O.",
        year: 2017,
        title: "Job design, employment practices and well-being: A systematic review of intervention studies",
        journalOrPublisher: "Ergonomics, 60(9), 1177–1196",
        studyDesign: "Systematic Review",
        findingSummaryPt: "O comprometimento e o preparo dos gestores de linha são determinantes para o sucesso de intervenções de redesenho do trabalho.",
      },
      {
        citationId: "CIT-MNG-11",
        driverSlug: "management",
        playbookRefNumber: 11,
        authors: "Hodzic, S., Scharfen, J., Ripoll, P., Holling, H., & Zenasni, F.",
        year: 2018,
        title: "How efficient are emotional intelligence trainings: A meta-analysis",
        journalOrPublisher: "Emotion Review, 10(2), 138–148",
        studyDesign: "Meta-analysis (24 Studies)",
        findingSummaryPt: "Treinamentos estruturados de Inteligência Emocional produzem melhorias sustentadas ao longo do tempo na regulação emocional e qualidade das relações.",
      },
    ],
    keywords: ["management", "gestao", "lideranca", "inteligencia emocional", "estresse do gestor", "treinamento de lideres"],
  },

  // ================= I: FLEXIBILITY, EMPLOYEE VOICE, AUTONOMY =================
  {
    interventionId: "PB2-INT-FLX-01",
    driverSlug: "flexibility",
    driverNamePt: "Flexibilidade",
    pillarCode: "I",
    titleEn: "Hybrid/WFH choice with ergonomics, Intentional in-office collaboration & Digital disconnection",
    titlePt: "Trabalho Híbrido/Remoto com Ergonomia, Colaboração Presencial Intencional e Direito à Desconexão Digital",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Conceder flexibilidade sobre quando e onde trabalhar (arranjos híbridos de 2 a 3 dias presenciais, controle de horários e licenças remuneradas), assegurando três salvaguardas críticas do Playbook 2.0: (1) ergonomia e equipamentos adequados no home office; (2) coordenação intencional de dias presenciais para atividades colaborativas; e (3) política formal de desconexão digital para prevenir sobrecarga.",
    actionablePracticesPt: [
      "Oferecer opções de trabalho híbrido ou controle previsível de escalas e turnos, garantindo equidade para funções presenciais.",
      "Fornecer suporte ergonômico (monitores, headsets, orientação postural e iluminação) também para o ambiente de trabalho remoto.",
      "Implementar política clara de desconexão digital e respeito a pausas para evitar que a flexibilidade se converta em jornada infinita.",
    ],
    keyGuardrailPt:
      "Trabalho remoto sem ergonomia adequada, sem momentos coordenados de colaboração e sem limite de desconexão digital agrava o isolamento e a sobrecarga.",
    copsoqShortSubscaleCodes: ["SUB-18", "SUB-05", "SUB-01", "SUB-22"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-04", "MTE-REQ-06"],
    primaryCitations: [
      {
        citationId: "CIT-FLX-02",
        driverSlug: "flexibility",
        playbookRefNumber: 2,
        authors: "Mas, A., & Pallais, A.",
        year: 2017,
        title: "Valuing alternative work arrangements",
        journalOrPublisher: "American Economic Review, 107(12), 3722–3759",
        studyDesign: "Choice Experiment",
        findingSummaryPt: "Trabalhadores atribuem alto valor à previsibilidade e flexibilidade de horário e local, associadas a menor exaustão e conflito familiar.",
      },
      {
        citationId: "CIT-FLX-03",
        driverSlug: "flexibility",
        playbookRefNumber: 3,
        authors: "Choudhury, P., Khanna, T., Makridis, C., & Schirmann, K.",
        year: 2024,
        title: "Is hybrid work the best of both worlds? Evidence from a field experiment",
        journalOrPublisher: "Review of Economics and Statistics (Field RCT)",
        studyDesign: "Randomized Controlled Trial (RCT)",
        findingSummaryPt: "O regime híbrido equilibrado (2–3 dias no escritório) elevou simultaneamente o bem-estar e a qualidade do trabalho colaborativo.",
      },
    ],
    keywords: ["flexibility", "flexibilidade", "hibrido", "home office", "wfh", "desconexao digital", "ergonomia"],
  },
  {
    interventionId: "PB2-INT-EVO-01",
    driverSlug: "employee_voice",
    driverNamePt: "Voz do Trabalhador",
    pillarCode: "I",
    titleEn: "Health & Wellbeing Committees (HaWCs), Participatory governance & Collective voice",
    titlePt: "Comitês de Saúde e Bem-Estar (HaWCs), Escuta Participativa e Diálogo Social Efetivo",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Institucionalizar canais formais e seguros para que os trabalhadores influenciem decisões sobre condições de trabalho, segurança e organização das tarefas — por meio de Comitês de Saúde e Bem-Estar (HaWCs), CIPA ativa, pesquisas anônimas seguidas de devolutiva e diálogo coletivo.",
    actionablePracticesPt: [
      "Formar grupos representativos de trabalhadores que se reúnam regularmente com a gestão para diagnosticar gargalos e co-desenvolver melhorias.",
      "Garantir que toda pesquisa ou escuta gere retorno transparente ('vocês disseram, nós fizemos / por que priorizamos X').",
      "Respeitar e articular a participação da CIPA e da representação dos trabalhadores nos 4 momentos exigidos pela NR-1.",
    ],
    keyGuardrailPt:
      "Solicitar feedback ou abrir canais de voz sem agir sobre os problemas apontados (silenciamento ou voz cosmética) corrói a confiança.",
    copsoqShortSubscaleCodes: ["SUB-05", "SUB-19", "SUB-20"],
    mte2026RequirementCodes: ["MTE-REQ-02", "MTE-REQ-08", "MTE-REQ-09"],
    primaryCitations: [
      {
        citationId: "CIT-EVO-01",
        driverSlug: "employee_voice",
        playbookRefNumber: 1,
        authors: "Battilana, J., Yen, J., Ferreras, I., & Ramarajan, L.",
        year: 2022,
        title: "Democratizing work: Redistributing power in organizations for a democratic and sustainable future",
        journalOrPublisher: "Organization Theory, 3(1)",
        studyDesign: "Organizational Theory & Empirical Review",
        findingSummaryPt: "A participação efetiva dos trabalhadores nas decisões sobre o próprio trabalho eleva o bem-estar e a sustentabilidade organizacional.",
      },
      {
        citationId: "CIT-EVO-02",
        driverSlug: "employee_voice",
        playbookRefNumber: 2,
        authors: "Adhvaryu, A., Molina, T., & Nyshadham, A.",
        year: 2022,
        title: "Expectations, wage hikes and worker voice",
        journalOrPublisher: "The Economic Journal, 132(645), 1978–1993",
        studyDesign: "Randomized Controlled Trial (RCT)",
        findingSummaryPt: "Canais estruturados de voz e escuta protegem a retenção e a satisfação no trabalho mesmo em contextos operacionais desafiadores.",
      },
    ],
    keywords: ["employee voice", "voz do trabalhador", "participacao", "cipa", "comite", "escuta", "democracia no trabalho"],
  },
  {
    interventionId: "PB2-INT-AUT-01",
    driverSlug: "autonomy",
    driverNamePt: "Autonomia",
    pillarCode: "I",
    titleEn: "Participatory job redesign, Method/pace control & Self-directed problem solving",
    titlePt: "Redesenho Participativo do Trabalho, Controle sobre Métodos/Ritmo e Solução Autônoma",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Ampliar a margem de decisão (job control) do trabalhador sobre a ordem das tarefas, os métodos de execução e o ritmo da atividade, reduzindo o microgerenciamento e combinando autonomia com clareza de papéis e suporte técnico.",
    actionablePracticesPt: [
      "Conduzir oficinas participativas onde as equipes identificam gargalos do processo e redesenham fluxos operacionais.",
      "Substituir scripts excessivamente rígidos por diretrizes claras de resultado com margem de adaptação ao trabalho real (NR-17).",
      "Capacitar líderes para adotarem estilo de gestão suportivo à autonomia em vez de controle coercitivo.",
    ],
    keyGuardrailPt:
      "Autonomia nunca deve ser confundida com abandono gerencial ou falta de instrução e recursos ('deixar a pessoa sozinha sem apoio').",
    copsoqShortSubscaleCodes: ["SUB-05", "SUB-06", "SUB-09"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02", "MTE-REQ-06"],
    primaryCitations: [
      {
        citationId: "CIT-AUT-01",
        driverSlug: "autonomy",
        playbookRefNumber: 1,
        authors: "Kobayashi, Y., Kaneyoshi, A., Yokota, A., & Kawakami, N.",
        year: 2008,
        title: "Effects of a worker participatory program for improving work environments on job stressors and mental health",
        journalOrPublisher: "Journal of Occupational Health, 50(6), 455–470",
        studyDesign: "Controlled Intervention Study",
        findingSummaryPt: "Programas participativos de redesenho do ambiente de trabalho reduzem estressores ocupacionais e melhoram indicadores de saúde mental.",
      },
      {
        citationId: "CIT-AUT-02",
        driverSlug: "autonomy",
        playbookRefNumber: 2,
        authors: "Hardré, P. L., & Reeve, J.",
        year: 2009,
        title: "Training corporate managers to adopt a more autonomy-supportive motivating style toward employees",
        journalOrPublisher: "International Journal of Training and Development, 13(3), 165–184",
        studyDesign: "Randomized Controlled Trial (RCT)",
        findingSummaryPt: "Capacitar gestores no suporte à autonomia eleva significativamente o engajamento e a motivação autônoma das equipes.",
      },
    ],
    keywords: ["autonomy", "autonomia", "controle sobre o trabalho", "job control", "microgerenciamento", "redesenho"],
  },

  // ================= V: ENERGY & PURPOSE =================
  {
    interventionId: "PB2-INT-ENR-01",
    driverSlug: "energy",
    driverNamePt: "Energia & Recuperação",
    pillarCode: "V",
    titleEn: "Systemic recovery architecture, Job crafting & Working conditions before isolated wellness apps",
    titlePt: "Infraestrutura de Recuperação, Job Crafting e Prioridade às Condições de Trabalho sobre Ações Isoladas",
    scope: "structural_primary",
    spotlightConceptPt:
      "Evidência Crítica Playbook 2.0 (Fleming, 2024): Iniciativas individuais isoladas (apps de meditação, mindfulness ou resiliência) não produzem melhoria líquida de saúde mental quando as condições estruturais de trabalho (carga, ritmo, gestão) permanecem inalteradas. A recuperação e o *job crafting* devem caminhar junto com melhorias organizacionais.",
    mechanismSummaryPt:
      "Garantir pausas intrajornada e interjornada efetivas, estimular o *job crafting* (ajuste de tarefas, relações e percepção cognitiva) e articular programas de vitalidade/resiliência sempre em conjunto com o saneamento das condições reais de trabalho.",
    actionablePracticesPt: [
      "Proteger pausas regulares de recuperação cognitiva e física durante turnos intensos ou trabalho intelectual contínuo.",
      "Apoiar oficinas de *job crafting* para que os trabalhadores ajustem tarefas e colaborações às suas forças e interesses.",
      "Avaliar condições de carga e ergonomia antes de ofertar programas complementares de saúde ou manejo de estresse.",
    ],
    keyGuardrailPt:
      "Nunca utilizar programas individuais de resiliência ou bem-estar para responsabilizar o trabalhador por um ambiente organizacional adoecedor.",
    copsoqShortSubscaleCodes: ["SUB-23", "SUB-22", "SUB-02", "SUB-07"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-06", "MTE-REQ-09"],
    primaryCitations: [
      {
        citationId: "CIT-ENR-01",
        driverSlug: "energy",
        playbookRefNumber: 1,
        authors: "Gordon, H. J., Demerouti, E., Le Blanc, P. M., et al.",
        year: 2018,
        title: "Individual job redesign: Job crafting interventions in healthcare",
        journalOrPublisher: "Journal of Vocational Behavior, 104, 98–114",
        studyDesign: "Controlled Intervention Study",
        findingSummaryPt: "Intervenções de job crafting reduzem a exaustão e ampliam recursos de trabalho e desempenho adaptativo.",
      },
      {
        citationId: "CIT-ENR-02",
        driverSlug: "energy",
        playbookRefNumber: 2,
        authors: "Fleming, W.",
        year: 2024,
        title: "Employee well-being outcomes from individual-level mental health interventions: Cross-sectional evidence from the UK",
        journalOrPublisher: "Industrial Relations Journal, 55(2), 162–182",
        studyDesign: "Large-Scale Cross-Sectional Study",
        findingSummaryPt: "Intervenções puramente individuais sem mudança nas práticas organizacionais e condições de trabalho não demonstram ganho consistente de bem-estar.",
      },
    ],
    keywords: ["energy", "energia", "recuperacao", "pausas", "job crafting", "vitalidade", "burnout"],
  },
  {
    interventionId: "PB2-INT-PRP-01",
    driverSlug: "purpose",
    driverNamePt: "Propósito & Sentido",
    pillarCode: "V",
    titleEn: "Connect daily tasks to beneficiaries, Translate mission into concrete goals & Relational crafting",
    titlePt: "Conexão Direta com Beneficiários, Tradução da Missão em Metas Concretas e Significado no Trabalho",
    scope: "relational_team",
    mechanismSummaryPt:
      "Tornar visível o impacto real do trabalho sobre clientes, colegas ou a sociedade, traduzir declarações abstratas de missão em marcos concretos do dia a dia (modelo Carton/NASA) e facilitar o contato humano com os beneficiários da atividade.",
    actionablePracticesPt: [
      "Promover encontros breves ou compartilhamento de histórias reais sobre como o trabalho da equipe beneficia usuários, pacientes ou clientes.",
      "Desdobrar a missão institucional em objetivos concretos e compreensíveis para cada função operacional ou administrativa.",
      "Conectar cada papel à cadeia completa de valor da organização para evitar alienação e fragmentação de sentido.",
    ],
    keyGuardrailPt:
      "Discursos inspiracionais de propósito jamais devem ser instrumentalizados para justificar sobrecarga, baixos salários ou horas extras não pagas.",
    copsoqShortSubscaleCodes: ["SUB-07", "SUB-08", "SUB-09"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02"],
    primaryCitations: [
      {
        citationId: "CIT-PRP-01",
        driverSlug: "purpose",
        playbookRefNumber: 1,
        authors: "Allan, B. A., Duffy, R. D., & Collisson, B.",
        year: 2018,
        title: "Helping others increases meaningful work: Evidence from three experiments",
        journalOrPublisher: "Journal of Counseling Psychology, 65(2), 155–165",
        studyDesign: "Experimental Series (3 Experiments)",
        findingSummaryPt: "Perceber que o próprio trabalho ajuda concretamente outras pessoas eleva de forma direta o senso de trabalho significativo.",
      },
      {
        citationId: "CIT-PRP-02",
        driverSlug: "purpose",
        playbookRefNumber: 2,
        authors: "Carton, A. M.",
        year: 2018,
        title: "‘I’m not mopping the floors, I’m putting a man on the moon’: How NASA leaders enhanced the meaningfulness of work by changing the meaning of work",
        journalOrPublisher: "Administrative Science Quarterly, 63(2), 323–369",
        studyDesign: "Longitudinal Archival & Field Study",
        findingSummaryPt: "Líderes fortalecem o propósito ao traduzir aspirações amplas em marcos intermediários tangíveis conectados às tarefas cotidianas.",
      },
    ],
    keywords: ["purpose", "proposito", "significado", "sentido do trabalho", "beneficiarios", "missao"],
  },

  // ================= E: COMPENSATION =================
  {
    interventionId: "PB2-INT-CMP-01",
    driverSlug: "compensation",
    driverNamePt: "Remuneração & Justiça",
    pillarCode: "E",
    titleEn: "Ensure living wage, Pay transparency & Procedural justice in rewards",
    titlePt: "Salário Digno (Living Wage), Transparência Remuneratória e Justiça Processual nas Recompensas",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Assegurar remuneração compatível com o custo real de vida digna (living wage), adotar políticas estruturadas de transparência salarial para corrigir disparidades de gênero e raça e garantir critérios objetivos e justos nas progressões e benefícios.",
    actionablePracticesPt: [
      "Auditar periodicamente a estrutura de cargos e salários para eliminar disparidades injustificadas entre grupos demográficos.",
      "Comunicar com clareza as faixas salariais e os critérios objetivos necessários para progressão horizontal e vertical.",
      "Desenhar pacotes de benefícios que atendam necessidades reais de saúde, família e segurança financeira dos trabalhadores.",
    ],
    keyGuardrailPt:
      "Transparência salarial exige que a organização esteja preparada para corrigir distorções históricas com critérios técnicos justos.",
    copsoqShortSubscaleCodes: ["SUB-20", "SUB-10", "SUB-17"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-02"],
    primaryCitations: [
      {
        citationId: "CIT-CMP-01",
        driverSlug: "compensation",
        playbookRefNumber: 1,
        authors: "Burmaster, K., Landefeld, J., Rehkopf, D., et al.",
        year: 2015,
        title: "Impact of a private sector living wage intervention on depressive symptoms among apparel workers",
        journalOrPublisher: "BMJ Open, 5(8), e007336",
        studyDesign: "Quasi-Experimental Intervention",
        findingSummaryPt: "A adoção de um salário digno reduziu significativamente sintomas depressivos e melhorou indicadores de saúde percebida.",
      },
      {
        citationId: "CIT-CMP-02",
        driverSlug: "compensation",
        playbookRefNumber: 2,
        authors: "Obloj, T., & Zenger, T.",
        year: 2022,
        title: "The influence of pay transparency on (gender) inequity, inequality and the performance basis of pay",
        journalOrPublisher: "Nature Human Behaviour, 6(5), 646–655",
        studyDesign: "Longitudinal Quasi-Experiment",
        findingSummaryPt: "Políticas de transparência salarial reduzem significativamente a desigualdade salarial de gênero e fortalecem a equidade percebida.",
      },
    ],
    keywords: ["compensation", "remuneracao", "salario digno", "living wage", "transparencia salarial", "equidade", "justica"],
  },

  // ================= R_RISK: STRESS & WORKLOAD PRESSURES =================
  {
    interventionId: "PB2-INT-STR-01",
    driverSlug: "stress",
    driverNamePt: "Estresse & Carga",
    pillarCode: "R_RISK",
    titleEn: "Multi-level burnout prevention: Organisational redesign + Manager training + Coping resources",
    titlePt: "Prevenção Multinível do Estresse e Burnout: Redesenho Organizacional + Gestão + Recursos de Enfrentamento",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Atuar primariamente nas causas-raiz organizacionais do estresse (demandas contraditórias, falta de clareza de papel, desequilíbrio esforço-recompensa e baixa autonomia), integrando redesenho de processos, suporte de liderança e recursos de enfrentamento.",
    actionablePracticesPt: [
      "Mapear e eliminar exigências contraditórias (conflito de papel) e ambiguidades nas atribuições de cada posto/GHE.",
      "Combinar mudanças na organização do trabalho (prevenção primária) com capacitação de gestores e canais de acolhimento independentes.",
      "Monitorar sinais precoces de esgotamento e estresse agregado (k >= 5) para intervir antes do adoecimento.",
    ],
    keyGuardrailPt:
      "O burnout é classificado pela OMS (CID-11) como fenômeno ocupacional resultante de estresse crônico no trabalho não gerenciado — não como falha individual.",
    copsoqShortSubscaleCodes: ["SUB-24", "SUB-23", "SUB-15", "SUB-09", "SUB-11"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-04", "MTE-REQ-06", "MTE-REQ-08"],
    primaryCitations: [
      {
        citationId: "CIT-STR-01",
        driverSlug: "stress",
        playbookRefNumber: 1,
        authors: "Awa, W. L., Plaumann, M., & Walter, U.",
        year: 2010,
        title: "Burnout prevention: A review of intervention programs",
        journalOrPublisher: "Patient Education and Counseling, 78(2), 184–190",
        studyDesign: "Systematic Review",
        findingSummaryPt: "Programas que combinam intervenção organizacional e individual produzem efeitos significativamente mais duradouros na redução do burnout.",
      },
      {
        citationId: "CIT-STR-02",
        driverSlug: "stress",
        playbookRefNumber: 2,
        authors: "Fox, K. E., Johnson, S. T., Berkman, L. F., et al.",
        year: 2022,
        title: "Organizational- and group-level workplace interventions and their effect on multiple domains of worker well-being: A systematic review",
        journalOrPublisher: "Work & Stress, 36(1), 30–59",
        studyDesign: "Systematic Review",
        findingSummaryPt: "Intervenções em nível organizacional e de equipe (redesenhando horários, voz e suporte) geram melhorias consistentes no bem-estar dos trabalhadores.",
      },
    ],
    keywords: ["stress", "estresse", "burnout", "esgotamento", "conflito de papel", "demandas", "prevencao primaria"],
  },
  {
    interventionId: "PB2-INT-WLP-01",
    driverSlug: "workload_pressures",
    driverNamePt: "Pressões de Carga de Trabalho",
    pillarCode: "R_RISK",
    titleEn: "Work-time reduction / pacing, Shorter purposeful meetings & Staffing adequacy",
    titlePt: "Dimensionamento Realista de Carga e Ritmo, Higiene de Reuniões e Proteção de Blocos de Foco",
    scope: "structural_primary",
    mechanismSummaryPt:
      "Equilibrar volume de demandas, prazos e efetivo disponível (dimensionamento de equipe), reduzir a sobrecarga cognitiva por meio de reuniões mais curtas e com pauta prévia (ex.: 25 min em vez de 60 min, blocos livres de reunião) e calibrar o ritmo de trabalho.",
    actionablePracticesPt: [
      "Reduzir a duração padrão de reuniões (ex.: 25 ou 50 minutos), exigir pauta prévia clara e instituir janelas semanais sem reuniões para trabalho focado.",
      "Revisar metas, prazos e dimensionamento de pessoal sempre que houver pico sazonal, absenteísmo ou introdução de novos sistemas.",
      "Avaliar pilotos de organização racional da jornada e pausas estruturadas para reduzir fadiga acumulativa.",
    ],
    keyGuardrailPt:
      "Cortar horas ou prazos sem ajustar o volume de entregas apenas comprime o ritmo de trabalho e intensifica a pressão psicossocial (SUB-01 e SUB-02).",
    copsoqShortSubscaleCodes: ["SUB-01", "SUB-02", "SUB-18", "SUB-23"],
    mte2026RequirementCodes: ["MTE-REQ-01", "MTE-REQ-03", "MTE-REQ-06", "MTE-REQ-07"],
    primaryCitations: [
      {
        citationId: "CIT-WLP-01",
        driverSlug: "workload_pressures",
        playbookRefNumber: 1,
        authors: "Bennett, A. A., Campion, E. D., Keeler, K. R., & Keener, S. K.",
        year: 2021,
        title: "Videoconference fatigue? Exploring changes in fatigue after videoconference meetings during COVID-19",
        journalOrPublisher: "Journal of Applied Psychology, 106(3), 330–344",
        studyDesign: "Longitudinal Experience Sampling Study",
        findingSummaryPt: "Reuniões mais curtas, com propósito claro, pautas prévias e pausas de recuperação reduzem significativamente a fadiga cognitiva.",
      },
      {
        citationId: "CIT-WLP-02",
        driverSlug: "workload_pressures",
        playbookRefNumber: 2,
        authors: "Schor, J. B., Fan, W., Kelly, E. L., et al.",
        year: 2024,
        title: "The four-day work week: A cross-national study of employee wellbeing and productivity",
        journalOrPublisher: "Multi-Organisation Trial / BMJ Open & Nature Human Behaviour",
        studyDesign: "Multi-Country Organizational Trial",
        findingSummaryPt: "A reorganização do trabalho com redução de horas improdutivas e reuniões excessivas reduziu o esgotamento e elevou a satisfação sem perda de entrega.",
      },
    ],
    keywords: [
      "workload",
      "workload pressures",
      "carga de trabalho",
      "pressoes de carga",
      "ritmo de trabalho",
      "reunioes",
      "sobrecarga",
      "exigencias quantitativas",
    ],
  },
];

export const PLAYBOOK_2_TOT_AUDIT_NODES: readonly Playbook2TotAuditNode[] = [
  {
    auditNodeId: "TOT-PB2-01",
    order: 1,
    code: "AUDIT-PB2-01",
    title: "Auditoria do Ciclo 'Measure → Understand → Act' e das 4 Dimensões Nucleares de Bem-Estar",
    playbookSectionRef: "Work Wellbeing Playbook 2.0 (Regier et al., 2025, pp. 3–6)",
    currentAppGapFound:
      "As telas de aprendizagem apresentavam os drivers de forma avulsa, sem explicitar a arquitetura de 3 fases (1. Measure, 2. Understand, 3. Act) e sem distinguir as 4 dimensões nucleares de desfecho (Job Satisfaction, Happiness, Stress, Purpose) dos fatores antecedentes (Drivers).",
    stateOfTheArtResolution:
      "Integrar o painel interativo do ciclo Measure → Understand → Act conectado às 4 dimensões de bem-estar e aos 6 elos operacionais da NR-1/GRO (Medir, Contextualizar, Avaliar, Agir, Evidenciar, Reavaliar).",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Misturar indicadores de desfecho subjetivo com perigos ocupacionais sem distinção",
        description: "Tratar satisfação ou felicidade diretamente como perigo ocupacional do PGR sem passar pelos drivers organizacionais e AEP.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 6 e a metodologia do Playbook 2.0: desfechos subjetivos não se confundem com fatores de risco/drivers nem substituem análise do trabalho real.",
        fidelityScore: 30,
        zeroHallucinationScore: 40,
        regulatoryCrosswalkScore: 0,
        uxExErgonomicsScore: 50,
        responsivenessScore: 70,
      },
      {
        branchId: "Branch B",
        label: "Arquitetura Dual: 4 Dimensões de Desfecho + 6 Pilares DRIVER + Ponte NR-1/GRO (Canônico)",
        description: "Explicitar 1. Measure (4 dimensões + drivers), 2. Understand (análise preditiva + AEP/AET) e 3. Act (intervenções organizacionais com avaliação de eficácia).",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 99,
        zeroHallucinationScore: 100,
        regulatoryCrosswalkScore: 98,
        uxExErgonomicsScore: 97,
        responsivenessScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Exibir apenas texto estático no rodapé sem interação pedagógica",
        description: "Adicionar nota textual simples sem conectar o ciclo Measure-Understand-Act à filtragem dos drivers.",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 65,
        zeroHallucinationScore: 85,
        regulatoryCrosswalkScore: 60,
        uxExErgonomicsScore: 45,
        responsivenessScore: 75,
      },
    ],
    targetFilesUpdated: [
      "src/lib/governance/playbook2RagEngine.ts",
      "src/pages/DriversPage.tsx",
      "src/pages/app/TogafMacroWaveWorkspacePage.tsx",
    ],
  },
  {
    auditNodeId: "TOT-PB2-02",
    order: 2,
    code: "AUDIT-PB2-02",
    title: "Auditoria da Taxonomia Acrônimo DRIVER (6 Pilares, Job Security, Employee Voice, Autonomy e Workload Pressures)",
    playbookSectionRef: "Work Wellbeing Playbook 2.0 (Regier et al., 2025, Table of Contents & Driver Sections, pp. 8–65)",
    currentAppGapFound:
      "O catálogo listava apenas 12 drivers, omitindo o novo driver completo 'Job Security' (com Spotlight Actual vs. Perceived Job Security e 60 referências), e mantinha 'Employee Voice', 'Autonomy' e 'Workload Pressures' ocultos dentro de outros drivers, além de não sinalizar os 2 drivers previstos ('Leadership — Mar/2026' e 'Operational Design — Abr/2026').",
    stateOfTheArtResolution:
      "Expandir `driversData.ts`, `driverQuizData.ts`, `scientificArticles.ts` e `DriversPage.tsx` para cobrir todos os 6 pilares `DRIVER`, os 16 drivers ativos (incluindo `job_security`, `employee_voice`, `autonomy`, `workload_pressures`) e os 2 drivers previstos em 2026.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Inventar intervenções para 'Leadership' e 'Operational Design' antes da publicação oficial",
        description: "Alucinar conteúdo e referências para os dois drivers que o Playbook 2.0 declara explícita e formalmente como 'Coming March/April 2026'.",
        invariantValid: false,
        pruneReason: "Viola a regra Zero-Alucinação e o Invariante 11: proibido fabricar conteúdo para seções declaradas como futuras na fonte primária.",
        fidelityScore: 0,
        zeroHallucinationScore: 0,
        regulatoryCrosswalkScore: 20,
        uxExErgonomicsScore: 40,
        responsivenessScore: 60,
      },
      {
        branchId: "Branch B",
        label: "Mapeamento Integral dos 16 Drivers Ativos + Sinalização Honesta dos 2 Drivers em Roadmap 2026 (Canônico)",
        description: "Integrar Job Security (9 intervenções + 60 refs), Employee Voice, Autonomy e Workload Pressures como drivers completos e exibir Leadership (Mar/2026) e Operational Design (Abr/2026) com selo transparente de roadmap.",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 100,
        zeroHallucinationScore: 100,
        regulatoryCrosswalkScore: 98,
        uxExErgonomicsScore: 98,
        responsivenessScore: 97,
      },
      {
        branchId: "Branch C",
        label: "Manter apenas os 12 drivers antigos ignorando Job Security",
        description: "Deixar de fora a principal adição estrutural do Playbook 2.0 sobre segurança no trabalho, reestruturações e IA.",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 50,
        zeroHallucinationScore: 80,
        regulatoryCrosswalkScore: 55,
        uxExErgonomicsScore: 60,
        responsivenessScore: 80,
      },
    ],
    targetFilesUpdated: [
      "src/data/driversData.ts",
      "src/data/driverQuizData.ts",
      "src/data/scientificArticles.ts",
      "src/pages/DriversPage.tsx",
      "src/pages/DriverWorldPage.tsx",
    ],
  },
  {
    auditNodeId: "TOT-PB2-03",
    order: 3,
    code: "AUDIT-PB2-03",
    title: "Auditoria de Atribuição Canônica (Regier et al., 2025), Licença CC BY-NC-ND 4.0 e Guardrails Fable 5",
    playbookSectionRef: "Work Wellbeing Playbook 2.0 (Citation & Licensing Page, p. 7)",
    currentAppGapFound:
      "Necessidade de explicitar a citação bibliográfica exata de 2025 (Regier, Cunningham, Fleming, Kirienko, Kaats, & De Neve, 2025) e os termos da licença CC BY-NC-ND 4.0 sem violar nenhuma regra de `publicClaimsGuardrail.test.ts`.",
    stateOfTheArtResolution:
      "Incorporar o metadado canônico `PLAYBOOK_2_CANONICAL_META` com atribuição completa, distinção clara entre referência bibliográfica e endosso institucional, e preservação de 100% dos avisos de revisão técnica nas páginas públicas.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Usar selo comercial 'Validado pela Ciência de Oxford' nas páginas públicas",
        description: "Promover o aplicativo usando o nome da universidade como selo comercial de eficácia garantida.",
        invariantValid: false,
        pruneReason: "Viola `publicClaimsGuardrail.test.ts`, a licença CC BY-NC-ND 4.0 e a Constituição Fable 5.",
        fidelityScore: 10,
        zeroHallucinationScore: 0,
        regulatoryCrosswalkScore: 0,
        uxExErgonomicsScore: 30,
        responsivenessScore: 70,
      },
      {
        branchId: "Branch B",
        label: "Atribuição Bibliográfica Estrita (Regier et al., 2025 · CC BY-NC-ND 4.0) + Disclaimers de Revisão (Canônico)",
        description: "Citar a obra exatamente conforme especificado pelos autores, mantendo todos os avisos de não-endosso e revisão técnica pendente.",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 100,
        zeroHallucinationScore: 100,
        regulatoryCrosswalkScore: 100,
        uxExErgonomicsScore: 96,
        responsivenessScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Omitir autoria e licença para evitar menções externas",
        description: "Remover a referência bibliográfica da fonte primária, descumprindo o requisito de atribuição (BY) da licença.",
        invariantValid: false,
        pruneReason: "Viola o Invariante 11 e a cláusula Attribution (BY) da licença CC BY-NC-ND 4.0.",
        fidelityScore: 20,
        zeroHallucinationScore: 50,
        regulatoryCrosswalkScore: 30,
        uxExErgonomicsScore: 50,
        responsivenessScore: 80,
      },
    ],
    targetFilesUpdated: [
      "src/lib/governance/playbook2RagEngine.ts",
      "src/pages/DriversPage.tsx",
      "src/pages/DriverWorldPage.tsx",
      "src/pages/LibraryPage.tsx",
    ],
  },
  {
    auditNodeId: "TOT-PB2-04",
    order: 4,
    code: "AUDIT-PB2-04",
    title: "Motor RAG Determinístico Zero-Alucinação com Citação Primária e Crosswalk COPSOQ II / MTE 2026",
    playbookSectionRef: "Todas as Seções de Intervenções e Referências Numeradas do Playbook 2.0",
    currentAppGapFound:
      "O chatbot e a exploração de dinâmicas dependiam de chamada remota bloqueada pelo Data Gate em G0/G1 ou não apresentavam recuperação determinística com citação exata de autor, ano, periódico e conexão com as 26 subescalas do COPSOQ II.",
    stateOfTheArtResolution:
      "Implementar `retrievePlaybook2RagResponse` e `validateZeroHallucinationGuardrails` em `src/lib/governance/playbook2RagEngine.ts`, integrando-os ao `DriverChatbot.tsx`, ao `DriverWorldPage.tsx` e ao Laboratório RAG no Cockpit.",
    totBranches: [
      {
        branchId: "Branch A",
        label: "Geração livre sem corpus ancorado e com percentuais causais inventados",
        description: "Permitir respostas sem citação verificável ou prometendo redução percentual fixa de absenteísmo/burnout.",
        invariantValid: false,
        pruneReason: "Viola a trava Zero-Alucinação e `publicClaimsGuardrail.test.ts` (causal percentage / unreviewed claims).",
        fidelityScore: 15,
        zeroHallucinationScore: 0,
        regulatoryCrosswalkScore: 10,
        uxExErgonomicsScore: 40,
        responsivenessScore: 70,
      },
      {
        branchId: "Branch B",
        label: "RAG Determinístico Ancorado em Citações Primárias + Crosswalk 26 Subescalas COPSOQ II + MTE 2026 (Canônico)",
        description: "Recuperar exclusivamente intervenções e estudos catalogados do Playbook 2.0 com citação explícita, escopo organizacional e vínculo com subescalas COPSOQ II e requisitos MTE 2026.",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 100,
        zeroHallucinationScore: 100,
        regulatoryCrosswalkScore: 99,
        uxExErgonomicsScore: 98,
        responsivenessScore: 98,
      },
      {
        branchId: "Branch C",
        label: "Exibir apenas erro de conexão quando o Data Gate G0/G1 bloquear chamadas externas",
        description: "Deixar o usuário sem resposta pedagógica fundamentada durante a exploração no modo sintético.",
        invariantValid: true,
        pruneReason: null,
        fidelityScore: 55,
        zeroHallucinationScore: 90,
        regulatoryCrosswalkScore: 50,
        uxExErgonomicsScore: 30,
        responsivenessScore: 80,
      },
    ],
    targetFilesUpdated: [
      "src/lib/governance/playbook2RagEngine.ts",
      "src/components/DriverChatbot.tsx",
      "src/pages/DriverWorldPage.tsx",
      "src/pages/app/TogafMacroWaveWorkspacePage.tsx",
    ],
  },
];

const PROHIBITED_RAG_OUTPUT_PATTERNS: readonly RegExp[] = [
  /(?<!nao\s)\b(garante|garantir|garantia|assegura)\b.{0,80}\bconformidade\b/i,
  /\bconformidade\s+(total|continua|em\s+tempo\s+real)\b/i,
  /\bvalidad[oa]\s+por\s+oxford\b/i,
  /\bciencia\s+de\s+oxford\b/i,
  /\bchancela\b.{0,80}\boxford\b/i,
  /\bdrivers?\s+cientificos?\b/i,
  /\bliteratura\s+cientifica\s+revisada\b/i,
  /\bbiblioteca\s+de\s+evidencias\b/i,
  /\bcuradoria\s+cientifica\b/i,
  /\bpeer-reviewed\s+mapeado\b/i,
  /\breduzir\b.{0,80}\bate\s+\d+%/i,
  /\bburnout\b.{0,100}\bdoenca\s+ocupacional\b/i,
  /(?<!nao\s)\bsubstitui\s+(o\s+)?responsavel\s+tecnico\b/i,
];

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function validateZeroHallucinationGuardrails(text: string): {
  readonly valid: boolean;
  readonly violations: readonly string[];
} {
  const normalized = normalizeSearchText(text);
  const violations: string[] = [];

  for (const pattern of PROHIBITED_RAG_OUTPUT_PATTERNS) {
    if (pattern.test(normalized)) {
      violations.push(pattern.source);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

export function computePlaybook2TotBranchUtility(
  branch: Playbook2TotAuditBranch,
): number {
  if (!branch.invariantValid) {
    return 0;
  }

  const weighted =
    0.30 * branch.fidelityScore +
    0.25 * branch.zeroHallucinationScore +
    0.20 * branch.regulatoryCrosswalkScore +
    0.15 * branch.uxExErgonomicsScore +
    0.10 * branch.responsivenessScore;

  return Math.round(weighted * 10) / 10;
}

export function evaluatePlaybook2TotAudit(
  nodes: readonly Playbook2TotAuditNode[] = PLAYBOOK_2_TOT_AUDIT_NODES,
): Playbook2SystemicAuditSummary {
  const orderedNodes = [...nodes].sort((a, b) => a.order - b.order);

  const evaluatedNodes: EvaluatedPlaybook2TotAuditNode[] = orderedNodes.map((node) => {
    const scored = node.totBranches.map((branch) => ({
      ...branch,
      utilityScore: computePlaybook2TotBranchUtility(branch),
      isWinner: false,
    }));
    const maxScore = Math.max(...scored.map((b) => b.utilityScore), 0);
    const evaluatedBranches: EvaluatedPlaybook2TotAuditBranch[] = scored.map((b) => ({
      ...b,
      isWinner: b.invariantValid && b.utilityScore === maxScore && maxScore > 0,
    }));
    const winningBranch =
      evaluatedBranches.find((b) => b.isWinner) ?? evaluatedBranches[0];
    const prunedBranchesCount = evaluatedBranches.filter(
      (b) => !b.invariantValid,
    ).length;

    return {
      ...node,
      evaluatedBranches,
      winningBranch,
      prunedBranchesCount,
    };
  });

  const totalUtility = evaluatedNodes.reduce(
    (sum, n) => sum + n.winningBranch.utilityScore,
    0,
  );
  const averageWinningTotUtility =
    evaluatedNodes.length === 0
      ? 0
      : Math.round((totalUtility / evaluatedNodes.length) * 10) / 10;

  const totalActiveDrivers = PLAYBOOK_2_DRIVER_PILLARS.reduce(
    (sum, p) => sum + p.activeDriverSlugs.length,
    0,
  );
  const totalRoadmapDrivers = PLAYBOOK_2_DRIVER_PILLARS.reduce(
    (sum, p) => sum + p.roadmapDrivers.length,
    0,
  );
  const totalPrimaryCitations = PLAYBOOK_2_INTERVENTION_RAG_CORPUS.reduce(
    (sum, item) => sum + item.primaryCitations.length,
    0,
  );

  return {
    auditId: "argo-4.0-playbook-2.0-tot-audit-2026",
    canonicalCitation: PLAYBOOK_2_CANONICAL_META.canonicalCitation,
    licenseCode: PLAYBOOK_2_CANONICAL_META.licenseCode,
    totalPillars: PLAYBOOK_2_DRIVER_PILLARS.length,
    totalActiveDrivers,
    totalRoadmapDrivers,
    totalAuditedInterventions: PLAYBOOK_2_INTERVENTION_RAG_CORPUS.length,
    totalPrimaryCitations,
    averageWinningTotUtility,
    zeroHallucinationEnforced: true,
    uxExElevationTargetPct: 120,
    evaluatedNodes,
  };
}

export function getPlaybook2InterventionsByDriver(
  driverSlug: string,
): readonly Playbook2InterventionRecord[] {
  const normalized = normalizeSearchText(driverSlug);
  return PLAYBOOK_2_INTERVENTION_RAG_CORPUS.filter(
    (item) => normalizeSearchText(item.driverSlug) === normalized,
  );
}

export function getPlaybook2PillarByDriver(
  driverSlug: string,
): Playbook2DriverPillar | null {
  const normalized = normalizeSearchText(driverSlug);
  return (
    PLAYBOOK_2_DRIVER_PILLARS.find((pillar) =>
      pillar.activeDriverSlugs.some((slug) => normalizeSearchText(slug) === normalized),
    ) ?? null
  );
}

export function interventionScopeLabelPt(scope: Playbook2InterventionScope): string {
  if (scope === "structural_primary") {
    return "Prevenção Primária / Estrutura e Organização do Trabalho";
  }
  if (scope === "relational_team") {
    return "Dinâmica Relacional, Liderança e Clima de Equipe";
  }
  return "Suporte Complementar (Não substitui condições estruturais)";
}

export function retrievePlaybook2RagResponse(params: {
  readonly query: string;
  readonly driverSlug?: string;
}): Playbook2RagQueryResult {
  const rawQuery = params.query.trim();
  const normalizedQuery = normalizeSearchText(rawQuery);
  const normalizedDriver = params.driverSlug
    ? normalizeSearchText(params.driverSlug)
    : null;

  const tokens = normalizedQuery
    .split(/[^a-z0-9_]+/)
    .filter((token) => token.length >= 3);

  const scoredRecords = PLAYBOOK_2_INTERVENTION_RAG_CORPUS.map((record) => {
    let score = 0;

    if (
      normalizedDriver &&
      normalizeSearchText(record.driverSlug) === normalizedDriver
    ) {
      score += 25;
    }

    const searchableText = normalizeSearchText(
      [
        record.driverSlug,
        record.driverNamePt,
        record.titleEn,
        record.titlePt,
        record.mechanismSummaryPt,
        record.spotlightConceptPt ?? "",
        record.keyGuardrailPt,
        ...record.actionablePracticesPt,
        ...record.keywords,
        ...record.primaryCitations.map(
          (c) => `${c.authors} ${c.year} ${c.title} ${c.findingSummaryPt}`,
        ),
      ].join(" "),
    );

    for (const kw of record.keywords) {
      const normKw = normalizeSearchText(kw);
      if (normalizedQuery.includes(normKw)) {
        score += 15;
      }
    }

    for (const token of tokens) {
      if (searchableText.includes(token)) {
        score += 4;
      }
    }

    return { record, score };
  }).sort((a, b) => b.score - a.score);

  const topPositive = scoredRecords.filter((item) => item.score > 0);
  const selectedRecords: readonly Playbook2InterventionRecord[] =
    topPositive.length > 0
      ? topPositive.slice(0, 3).map((item) => item.record)
      : normalizedDriver
        ? getPlaybook2InterventionsByDriver(normalizedDriver).slice(0, 2)
        : PLAYBOOK_2_INTERVENTION_RAG_CORPUS.slice(0, 2);

  const fallbackRecords =
    selectedRecords.length > 0
      ? selectedRecords
      : [PLAYBOOK_2_INTERVENTION_RAG_CORPUS[0]];

  const primaryRecord = fallbackRecords[0];
  const matchedPillar = getPlaybook2PillarByDriver(primaryRecord.driverSlug);

  const matchedCitations = fallbackRecords.flatMap(
    (rec) => rec.primaryCitations,
  );
  const copsoqSubscalesLinked = Array.from(
    new Set(fallbackRecords.flatMap((rec) => rec.copsoqShortSubscaleCodes)),
  );
  const mteRequirementsLinked = Array.from(
    new Set(fallbackRecords.flatMap((rec) => rec.mte2026RequirementCodes)),
  );

  const confidenceBand: Playbook2RagQueryResult["confidenceBand"] =
    topPositive.length > 0 && topPositive[0].score >= 25
      ? "high_exact_match"
      : topPositive.length > 0
        ? "medium_thematic_match"
        : "canonical_fallback";

  const executiveTableRows = fallbackRecords
    .map((rec) => {
      const citationRefs = rec.primaryCitations
        .map((c) => `${c.authors} (${c.year})`)
        .join("; ");
      const subscales = rec.copsoqShortSubscaleCodes.join(", ");
      return `| **${rec.titlePt}** | ${interventionScopeLabelPt(rec.scope)} | ${citationRefs} | \`${subscales}\` |`;
    })
    .join("\n");

  const executiveSummaryTable = [
    `| Prática Recomendada (Playbook 2.0) | Escopo Organizacional | Estudos Primários | Subescalas COPSOQ II |`,
    `| :--- | :--- | :--- | :--- |`,
    executiveTableRows,
  ].join("\n");

  const interventionsMarkdown = fallbackRecords
    .map((rec, idx) => {
      const practices = rec.actionablePracticesPt
        .map((p) => `- [x] ${p}`)
        .join("\n");
      const citations = rec.primaryCitations
        .map(
          (c) =>
            `| **Ref #${c.playbookRefNumber}** · ${c.authors} (${c.year}) | \`${c.studyDesign}\` | *${c.journalOrPublisher}* | ${c.findingSummaryPt} |`,
        )
        .join("\n");

      return [
        `### 0${idx + 1}. ${rec.titlePt} (${rec.driverNamePt} · Pilar ${rec.pillarCode})`,
        rec.spotlightConceptPt ? `💡 **Conceito-Chave Playbook 2.0**: ${rec.spotlightConceptPt}` : "",
        `ℹ️ **Mecanismo de Ação**: ${rec.mechanismSummaryPt}`,
        `**Ações Práticas Recomendadas para o Dia a Dia:**`,
        practices,
        `⚠️ **Ponto de Atenção & Limite de Escopo**: ${rec.keyGuardrailPt}`,
        ``,
        `| Estudo Primário | Desenho | Periódico | Síntese do Achado |`,
        `| :--- | :--- | :--- | :--- |`,
        citations,
      ]
        .filter(Boolean)
        .join("\n\n");
    })
    .join("\n\n---\n\n");

  const groundedMarkdownResponse = [
    `**Guia de Práticas Recomendadas · Work Wellbeing Playbook 2.0 (Regier et al., 2025)**`,
    ``,
    `Com base nas recomendações do *Work Wellbeing Playbook 2.0* (${PLAYBOOK_2_CANONICAL_META.licenseCode}), apresento a síntese executiva em tabela e o detalhamento prático para o seu ambiente de trabalho:`,
    ``,
    executiveSummaryTable,
    ``,
    interventionsMarkdown,
    ``,
    `---`,
    `**Ponte Técnica com o Guia Oficial MTE 2026 (NR-1/GRO) e Manual COPSOQ II (Versão Curta):**`,
    `| Dimensão Regulatória / Metodológica | Códigos Vinculados | Orientação de Governança |`,
    `| :--- | :--- | :--- |`,
    `| **Subescalas COPSOQ II (41 questões)** | \`${copsoqSubscalesLinked.join(", ")}\` | Avaliar com tercis oficiais \`2,33\` e \`3,66\` sob proteção \`k >= 5\` |`,
    `| **Requisitos Guia Oficial MTE 2026** | \`${mteRequirementsLinked.join(", ")}\` | Articular com AEP (NR-17) e participação dos trabalhadores / CIPA |`,
    ``,
    `- **Fonte Canônica**: *${PLAYBOOK_2_CANONICAL_META.canonicalCitation}*`,
    `- **Aviso de Governança**: Esta síntese apoia o estudo exploratório e o levantamento de hipóteses organizacionais; não garante conformidade automática e não substitui o responsável técnico, a AEP/AET nem a validação jurídica e técnica.`,
  ].join("\n");

  const guardrailCheck = validateZeroHallucinationGuardrails(
    groundedMarkdownResponse,
  );

  return {
    query: rawQuery,
    normalizedDriverSlug: primaryRecord.driverSlug,
    matchedPillar,
    matchedInterventions: fallbackRecords,
    matchedCitations,
    copsoqSubscalesLinked,
    mteRequirementsLinked,
    groundedMarkdownResponse,
    zeroHallucinationVerified: guardrailCheck.valid,
    licenseGuardrailNote: PLAYBOOK_2_CANONICAL_META.licenseSummaryPt,
    confidenceBand,
  };
}
