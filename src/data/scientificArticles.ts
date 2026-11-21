export type PlaybookDriverAcronymPillar = "D" | "R" | "I" | "V" | "E" | "R_RISK";

export interface ScientificArticle {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  url: string;
  driver: string;
  summary: string;
  status: "open" | "paywall" | "unknown";
  tier: string;
  playbookPillar: PlaybookDriverAcronymPillar;
  playbookPillarLabel: string;
  playbookSection: string;
  playbookCitationRef: string;
  canonicalDocUrl: string;
  mte2026Crosswalk: string;
}

export interface Mte2026CanonicalChapter {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  nr1Clauses: readonly string[];
  pageRange: string;
  driverPillarBridge: PlaybookDriverAcronymPillar;
  pedagogicalSummary: string;
  auditorInspectionFocus: string;
  learningSciencePrinciple: string;
  appFeatureLabel: string;
  appRoute: string;
  canonicalDocUrl: string;
}

export interface CanonicalKnowledgeDocument {
  id: string;
  shortBadge: string;
  title: string;
  institution: string;
  authorsOrOrgan: string;
  year: number;
  licenseOrNormativeStatus: string;
  summaryPt: string;
  localMarkdownUrl: string;
  officialExternalUrl: string;
  metricsLabel: string;
  imageCaptionPt: string;
}

export const CANONICAL_PLAYBOOK_2_ASSET_URL =
  "/assets/aistudio/Work-Wellbeing-Playbook-2.0-Full-Deck_compressed_de86ab6d.md";

export const CANONICAL_MTE_2026_ASSET_URL =
  "/assets/aistudio/Guia_Oficial_MTE_2026_Comentado_7918e223.md";

export const CANONICAL_KNOWLEDGE_DOCUMENTS: readonly CanonicalKnowledgeDocument[] = [
  {
    id: "DOC-CANON-MTE-2026",
    shortBadge: "FONTE NORMATIVA OFICIAL · MTE 2026",
    title: "Manual de Interpretação e Aplicação do Capítulo 1.5 da NR-1 — Gerenciamento de Riscos Ocupacionais (GRO)",
    institution: "Ministério do Trabalho e Emprego (MTE) · Secretaria de Inspeção do Trabalho (SIT) · DSST",
    authorsOrOrgan: "Coordenação-Geral de Normatização e Registros (CGNOR / DSST / SIT / MTE)",
    year: 2026,
    licenseOrNormativeStatus: "Documento Público Oficial · Portarias MTE nº 1.419/2024 e nº 765/2025",
    summaryPt:
      "Diretriz oficial comentada em 19 capítulos detalhando o ciclo PDCA do GRO, Levantamento Preliminar de Perigos, participação dos trabalhadores como especialistas do saber-fazer (Cap. 6), integração AEP/AET (NR-17), avaliação de riscos psicossociais relacionados ao trabalho (Cap. 8.2 e Cap. 11), hierarquia de controles, plano de ação, emergências e documentação do PGR.",
    localMarkdownUrl: CANONICAL_MTE_2026_ASSET_URL,
    officialExternalUrl: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/seguranca-e-saude-no-trabalho/ctpp-nrs/normas-regulamentadoras-nrs",
    metricsLabel: "19 Capítulos Oficiais · 115 Páginas · NR-1 Cap. 1.5 + NR-17",
    imageCaptionPt: "Governança Normativa GRO/PGR · Ciclo PDCA, Participação do Trabalhador e AEP/AET",
  },
  {
    id: "DOC-CANON-PLAYBOOK-2",
    shortBadge: "EVIDÊNCIA CIENTÍFICA · OXFORD / WWM 2025",
    title: "Work Wellbeing Playbook 2.0: A Systematic Review of Evidence-Based Interventions to Improve Employee Wellbeing",
    institution: "World Wellbeing Movement & Wellbeing Research Centre, University of Oxford",
    authorsOrOrgan: "Courtney Regier, Sarah Cunningham, William Fleming, Anastasiia Kirienko, Micah Kaats & Jan-Emmanuel De Neve",
    year: 2025,
    licenseOrNormativeStatus: "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 (CC BY-NC-ND 4.0)",
    summaryPt:
      "Revisão sistemática global de intervenções organizacionais baseadas em evidências para promoção do bem-estar no trabalho, estruturada no ciclo Medir → Compreender → Agir e no acrônimo DRIVER (Development & Security, Relationships, Independence & Flexibility, Variety & Fulfilment, Earnings & Benefits, Risk, Health & Safety).",
    localMarkdownUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    officialExternalUrl: "https://worldwellbeingmovement.org/work-wellbeing-playbook/",
    metricsLabel: "6 Pilares DRIVER · 16 Drivers · Centenas de Estudos Revisados por Pares",
    imageCaptionPt: "Revisão Sistemática Oxford & WWM · Ciclo Medir → Compreender → Agir e Acrônimo DRIVER",
  },
];

export const PLAYBOOK_PILLAR_CATALOG: readonly {
  readonly code: PlaybookDriverAcronymPillar;
  readonly letter: string;
  readonly labelPt: string;
  readonly labelEn: string;
  readonly descriptionPt: string;
}[] = [
  {
    code: "D",
    letter: "D",
    labelPt: "D · Desenvolvimento e Segurança",
    labelEn: "Development and security",
    descriptionPt: "Realização (Achievement), Aprendizagem (Learning) e Segurança no Trabalho (Job Security).",
  },
  {
    code: "R",
    letter: "R",
    labelPt: "R · Relações e Liderança",
    labelEn: "Relationships",
    descriptionPt: "Reconhecimento (Appreciation), Inclusão & Pertencimento, Suporte, Confiança e Gestão.",
  },
  {
    code: "I",
    letter: "I",
    labelPt: "I · Independência, Voz e Flexibilidade",
    labelEn: "Independence and flexibility",
    descriptionPt: "Flexibilidade (Flexibility), Voz do Colaborador (Employee Voice) e Autonomia (Autonomy).",
  },
  {
    code: "V",
    letter: "V",
    labelPt: "V · Variedade, Energia e Propósito",
    labelEn: "Variety and fulfilment",
    descriptionPt: "Energia & Recuperação Biopsicossocial (Energy) e Propósito & Significado (Purpose).",
  },
  {
    code: "E",
    letter: "E",
    labelPt: "E · Remuneração e Benefícios",
    labelEn: "Earnings and benefits",
    descriptionPt: "Salário digno, transparência remuneratória e justiça distributiva (Compensation).",
  },
  {
    code: "R_RISK",
    letter: "R",
    labelPt: "R · Risco, Saúde e Pressões de Carga",
    labelEn: "Risk, health, and safety",
    descriptionPt: "Manejo de Estresse na Fonte (Stress), Pressões de Carga de Trabalho (Workload Pressures) e Design Operacional.",
  },
];

export const scientificArticles: ScientificArticle[] = [
  // ===== D: ACHIEVEMENT (Playbook 2.0 pp. 9–11 · 5 Refs) =====
  {
    id: "ART-ACH-04",
    title: "Participation in the design of performance management systems: A quasi-experimental field study",
    authors: "Kleingeld, A., Van Tuijl, H. & Algera, J. A.",
    year: 2004,
    journal: "Journal of Organizational Behavior, 25(7), 831–850",
    url: "https://doi.org/10.1002/job.266",
    driver: "achievement",
    summary:
      "Estudo quase-experimental de campo demonstrando que co-desenvolver o sistema de avaliação de desempenho com os trabalhadores (ProMES) eleva transparência, percepção de justiça e desempenho coletivo.",
    status: "paywall",
    tier: "Quasi-Experimental",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Achievement",
    playbookCitationRef: "Playbook 2.0 · Achievement, Ref #1 (p. 11)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 · Cap. 6 e Cap. 8.2 MTE 2026 (participação dos trabalhadores na definição de metas e critérios operacionais).",
  },
  {
    id: "ART-ACH-05",
    title: "Total quality management and performance appraisal: An experimental study of procedural justice",
    authors: "Lam, S. S. K. & Schaubroeck, J.",
    year: 1999,
    journal: "Journal of Applied Psychology, 84(4), 531–537",
    url: "https://doi.org/10.1037/0021-9010.84.4.531",
    driver: "achievement",
    summary:
      "Experimento controlado comprovando que avaliações de desempenho baseadas em melhoria de processos e justiça procedimental reduzem a ansiedade avaliativa e aumentam a satisfação no trabalho.",
    status: "paywall",
    tier: "Controlled Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Achievement",
    playbookCitationRef: "Playbook 2.0 · Achievement, Ref #2 (p. 11)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (prevenção de mecanismos abusivos de cobrança e metas inalcançáveis).",
  },
  {
    id: "ART-ACH-06",
    title: "Why co-developing performance metrics works: Perceived quality of metrics and goal commitment",
    authors: "Groen, B. A. C., Wouters, M. J. F. & Wilderom, C. P. M.",
    year: 2017,
    journal: "Management Accounting Research, 36, 41–55",
    url: "https://doi.org/10.1016/j.mar.2016.10.001",
    driver: "achievement",
    summary:
      "Envolver colaboradores na criação de indicadores operacionais melhora a qualidade percebida das métricas, reduz ambiguidade de papel e fortalece o senso de controle sobre a tarefa.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Achievement",
    playbookCitationRef: "Playbook 2.0 · Achievement, Ref #3 (p. 11)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.3 (AEP NR-17) · Cap. 7 MTE 2026 (clareza de normas de produção e compatibilidade com a capacidade real).",
  },
  {
    id: "ART-ACH-03",
    title: "The effect of goal setting on group performance: A meta-analysis",
    authors: "Kleingeld, A., Van Mierlo, H. & Arends, L.",
    year: 2011,
    journal: "Journal of Applied Psychology, 96(6), 1289–1304",
    url: "https://doi.org/10.1037/a0024315",
    driver: "achievement",
    summary:
      "Meta-análise comprovando que metas específicas e desafiadoras geram alta performance grupal quando as metas individuais são cooperativas; metas egocêntricas competitivas destroem a coesão e elevam o estresse.",
    status: "paywall",
    tier: "Meta-analysis",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Achievement",
    playbookCitationRef: "Playbook 2.0 · Achievement, Ref #4 (p. 11)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10.1 MTE 2026 (medidas coletivas de organização do trabalho em substituição à pressão individual predatória).",
  },
  {
    id: "ART-ACH-01",
    title: "The Progress Principle: Using Small Wins to Ignite Joy, Engagement, and Creativity at Work",
    authors: "Amabile, T. & Kramer, S.",
    year: 2011,
    journal: "Harvard Business Review Press",
    url: "https://hbr.org/2011/05/the-power-of-small-wins",
    driver: "achievement",
    summary:
      "Análise de 12.000 diários de trabalho demonstrando que realizar progresso tangível em tarefas significativas (Small Wins) e remover bloqueios cotidianos é o principal preditor de bem-estar diário.",
    status: "open",
    tier: "Field Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Achievement",
    playbookCitationRef: "Playbook 2.0 · Achievement, Spotlight & Goal-Setting Framework (pp. 9–11)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.3 · Cap. 7 MTE 2026 (eliminação de impedimentos operacionais na atividade real).",
  },
  {
    id: "ART-ACH-02",
    title: "Goal-setting procedures and goal orientations: Field study on participative vs. assigned goals",
    authors: "Bipp, T. & Kleingeld, A.",
    year: 2011,
    journal: "Human Performance, 24(4), 317–337",
    url: "https://doi.org/10.1080/08959285.2011.597475",
    driver: "achievement",
    summary:
      "Estudo de campo demonstrando como a participação na definição de metas reduz a percepção de imposição arbitrária e melhora o comprometimento saudável com resultados.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Achievement",
    playbookCitationRef: "Playbook 2.0 · Achievement, Ref #5 (p. 11)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 · Cap. 6 MTE 2026 (consulta e participação na organização das metas).",
  },

  // ===== D: LEARNING (Playbook 2.0 pp. 12–14 · 7 Refs) =====
  {
    id: "ART-LRN-01",
    title: "Occupational self-direction, intellectual functioning, and self-directed orientation in older workers: 20-year longitudinal findings",
    authors: "Schooler, C., Mulatu, M. S. & Oates, G.",
    year: 2004,
    journal: "American Journal of Sociology, 110(1), 161–197",
    url: "https://doi.org/10.1086/385430",
    driver: "learning",
    summary:
      "Coorte longitudinal de 20 anos demonstrando que trabalhos com complexidade substantiva e autodireção estimulam o funcionamento cognitivo e protegem a saúde mental ao longo da carreira.",
    status: "paywall",
    tier: "Longitudinal",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Learning",
    playbookCitationRef: "Playbook 2.0 · Learning, Ref #1 (p. 14)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4 · Cap. 7 MTE 2026 (enriquecimento de tarefas e prevenção de monotonia e embotamento cognitivo).",
  },
  {
    id: "ART-LRN-02",
    title: "Empowerment and knowledge acquisition: Reducing strain in novice manufacturing workers",
    authors: "Leach, D. J., Wall, T. D. & Jackson, P. R.",
    year: 2003,
    journal: "Journal of Occupational and Organizational Psychology, 76(1), 27–52",
    url: "https://doi.org/10.1348/096317903321208871",
    driver: "learning",
    summary:
      "Empoderar trabalhadores operacionais para resolver problemas técnicos amplia o conhecimento prático, eleva a autoeficácia e reduz a tensão mental, especialmente entre menos experientes.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Learning",
    playbookCitationRef: "Playbook 2.0 · Learning, Ref #2 (p. 14)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 · Cap. 6.1 MTE 2026 (valorização dos trabalhadores como especialistas do saber-fazer).",
  },
  {
    id: "ART-LRN-03",
    title: "The ability of psychological flexibility and job control to predict learning, job performance, and mental health",
    authors: "Bond, F. W. & Flaxman, P. E.",
    year: 2006,
    journal: "Journal of Organizational Behavior Management, 26(1–2), 113–130",
    url: "https://doi.org/10.1300/J075v26n01_05",
    driver: "learning",
    summary:
      "Ensaio longitudinal demonstrando que autonomia e controle sobre o método de trabalho aceleram o aprendizado de novos sistemas computacionais e protegem a saúde mental.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Learning",
    playbookCitationRef: "Playbook 2.0 · Learning, Ref #4 (p. 14)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.6 'b' · Cap. 11.7 MTE 2026 (gestão de mudanças tecnológicas com capacitação e controle operacional).",
  },
  {
    id: "ART-LRN-04",
    title: "Well-being through learning: A systematic review of learning interventions in the workplace",
    authors: "Watson, D., Tregaskis, O., Gedikli, C., Vaughn, O. & Semkina, A.",
    year: 2018,
    journal: "European Journal of Work and Organizational Psychology, 27(2), 247–268",
    url: "https://doi.org/10.1080/1359432X.2018.1435529",
    driver: "learning",
    summary:
      "Revisão sistemática comprovando que intervenções de aprendizagem precedidas de análise real de necessidades (Training Needs Analysis) fortalecem recursos psicossociais e desempenho sustentável.",
    status: "paywall",
    tier: "Systematic Review",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Learning",
    playbookCitationRef: "Playbook 2.0 · Learning, Ref #5 (p. 14)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10 MTE 2026 (capacitação vinculada aos riscos reais identificados no inventário).",
  },
  {
    id: "ART-LRN-05",
    title: "The effects of organizational learning culture and job satisfaction on motivation to transfer learning and turnover intention",
    authors: "Egan, T. M., Yang, B. & Bartlett, K. R.",
    year: 2004,
    journal: "Human Resource Development Quarterly, 15(3), 279–301",
    url: "https://doi.org/10.1002/hrdq.1104",
    driver: "learning",
    summary:
      "Integrar a aprendizagem ao fluxo diário de trabalho (e não como obrigação extra-expediente) aumenta a transferência do conhecimento, a satisfação e reduz a intenção de rotatividade.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Learning",
    playbookCitationRef: "Playbook 2.0 · Learning, Ref #6 (p. 14)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 Cap. 1.4.1 / Cap. 10 MTE 2026 (treinamentos realizados dentro da jornada normal de trabalho sem sobrecarga).",
  },

  // ===== D: JOB SECURITY (Playbook 2.0 pp. 15–23 · 60 Refs) =====
  {
    id: "ART-JSEC-01",
    title: "Content, causes, and consequences of job insecurity: A theory-based measure and substantive test",
    authors: "Ashford, S. J., Lee, C. & Bobko, P.",
    year: 1989,
    journal: "Academy of Management Journal, 32(4), 803–829",
    url: "https://doi.org/10.5465/256569",
    driver: "job_security",
    summary:
      "Estudo seminal do Playbook 2.0 demonstrando que a falta de previsibilidade organizacional e mudanças mal comunicadas disparam insegurança percebida no emprego e queda aguda de confiança e saúde.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Job Security",
    playbookCitationRef: "Playbook 2.0 · Job Security, Ref #1 (p. 21)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.6 'b' · Cap. 11.7 MTE 2026 (avaliação preventiva de riscos psicossociais em reestruturações e mudanças).",
  },
  {
    id: "ART-JSEC-02",
    title: "No security: A meta-analysis and review of job insecurity and its consequences",
    authors: "Sverke, M., Hellgren, J. & Näswall, K.",
    year: 2002,
    journal: "Journal of Occupational Health Psychology, 7(3), 242–264",
    url: "https://doi.org/10.1037/1076-8998.7.3.242",
    driver: "job_security",
    summary:
      "Meta-análise referencial do Playbook 2.0 comprovando que a insegurança percebida no trabalho é um estressor crônico que deteriora a saúde mental e física tanto quanto o próprio desemprego.",
    status: "paywall",
    tier: "Meta-analysis",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Job Security",
    playbookCitationRef: "Playbook 2.0 · Job Security, Ref #2 (p. 21)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (identificação de fatores psicossociais ligados à instabilidade e gestão pelo medo).",
  },
  {
    id: "ART-JSEC-03",
    title: "Modifying the impact of job insecurity via participatory organizational interventions during restructuring",
    authors: "Abildgaard, J. S., Nielsen, K. & Sverke, M.",
    year: 2018,
    journal: "Work & Stress, 32(2), 105–123",
    url: "https://doi.org/10.1080/02678373.2017.1367735",
    driver: "job_security",
    summary:
      "Intervenção organizacional participativa durante reestruturação demonstrando que transparência comunicacional e envolvimento das equipes atenuam significativamente o impacto da insegurança ocupacional.",
    status: "paywall",
    tier: "Controlled Study",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Job Security",
    playbookCitationRef: "Playbook 2.0 · Job Security, Ref #6 (p. 21)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 e 1.5.5.1.3 · Cap. 6 MTE 2026 (comunicação em via de mão dupla durante mudanças operacionais).",
  },
  {
    id: "ART-JSEC-04",
    title: "Survivors and victims: A meta-analytical review of fairness and organisational commitment after downsizing",
    authors: "Van Dierendonck, D. & Jacobs, G.",
    year: 2012,
    journal: "British Journal of Management, 23(1), 96–109",
    url: "https://doi.org/10.1111/j.1467-8551.2010.00724.x",
    driver: "job_security",
    summary:
      "Meta-análise sobre a Síndrome do Sobrevivente: quando cortes são inevitáveis, a justiça procedimental, a transparência e o suporte aos desligados determinam a saúde psicológica dos que permanecem.",
    status: "paywall",
    tier: "Meta-analysis",
    playbookPillar: "D",
    playbookPillarLabel: "D · Desenvolvimento e Segurança",
    playbookSection: "Job Security",
    playbookCitationRef: "Playbook 2.0 · Job Security, Ref #58 (p. 23)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.6 'b' · Cap. 11.7 MTE 2026 (reavaliação de sobrecarga residual nas equipes remanescentes).",
  },

  // ===== R: APPRECIATION (Playbook 2.0 pp. 25–27 · 11 Refs) =====
  {
    id: "ART-APR-01",
    title: "Associations of recognition at work with subsequent health and quality of life among working adults",
    authors: "Weziak-Bialowolska, D. & Bialowolski, P.",
    year: 2022,
    journal: "International Archives of Occupational and Environmental Health, 95, 835–847",
    url: "https://doi.org/10.1007/s00420-021-01801-x",
    driver: "appreciation",
    summary:
      "Estudo longitudinal demonstrando que o reconhecimento autêntico e equitativo no trabalho (protocolo SAGE do Playbook 2.0) reduz o risco de adoecimento físico e mental subsequente.",
    status: "open",
    tier: "Longitudinal",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Appreciation",
    playbookCitationRef: "Playbook 2.0 · Appreciation, Ref #1 (p. 27)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (fatores protetivos de justiça e reconhecimento na organização do trabalho).",
  },
  {
    id: "ART-APR-02",
    title: "Reviewing the effort–reward imbalance model: Drawing up the balance of 45 empirical studies",
    authors: "Van Vegchel, N., De Jonge, J., Bosma, H. & Schaufeli, W.",
    year: 2005,
    journal: "Social Science & Medicine, 60(5), 1117–1131",
    url: "https://doi.org/10.1016/j.socscimed.2004.06.043",
    driver: "appreciation",
    summary:
      "Revisão sistemática de 45 estudos empíricos sobre o Modelo de Desequilíbrio Esforço-Recompensa (Siegrist): alta exigência combinada com baixo reconhecimento eleva drasticamente o risco cardiovascular e psíquico.",
    status: "paywall",
    tier: "Systematic Review",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Appreciation",
    playbookCitationRef: "Playbook 2.0 · Appreciation, Ref #6 (p. 27)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 e NR-17 · Cap. 8.2 e Cap. 11.4 MTE 2026 (equilíbrio entre exigências da atividade e mecanismos de valorização).",
  },

  // ===== R: INCLUSION & BELONGING (Playbook 2.0 pp. 28–31 · 26 Refs) =====
  {
    id: "ART-INC-01",
    title: "Orchestrating impartiality: The impact of 'blind' auditions on female musicians",
    authors: "Goldin, C. & Rouse, C.",
    year: 2000,
    journal: "American Economic Review, 90(4), 715–741",
    url: "https://doi.org/10.1257/aer.90.4.715",
    driver: "inclusion_belonging",
    summary:
      "Experimento natural seminal demonstrando como procedimentos estruturados e imparciais eliminam vieses discriminatórios na avaliação de talentos e ampliam a equidade de oportunidades.",
    status: "paywall",
    tier: "Natural Experiment",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Inclusion & Belonging",
    playbookCitationRef: "Playbook 2.0 · Inclusion & Belonging, Ref #1 (p. 31)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 Cap. 1.5 e CIPA (Prevenção de Assédio e Discriminação) · Cap. 6 MTE 2026.",
  },
  {
    id: "ART-INC-02",
    title: "Evidence that gendered wording in job advertisements exists and sustains gender inequality",
    authors: "Gaucher, D., Friesen, J. & Kay, A. C.",
    year: 2011,
    journal: "Journal of Personality and Social Psychology, 101(1), 109–128",
    url: "https://doi.org/10.1037/a0022530",
    driver: "inclusion_belonging",
    summary:
      "Estudo experimental demonstrando que remover linguagem enviesada de processos seletivos e critérios internos aumenta o senso de pertencimento (Belonging) e a diversidade real.",
    status: "paywall",
    tier: "Controlled Study",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Inclusion & Belonging",
    playbookCitationRef: "Playbook 2.0 · Inclusion & Belonging, Ref #2 (p. 31)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (prevenção de exclusão e barreiras organizacionais).",
  },
  {
    id: "ART-INC-03",
    title: "A randomized controlled trial of mentoring interventions for underrepresented minorities",
    authors: "Lewis, V., Martina, C. A., McDermott, M. P. et al.",
    year: 2016,
    journal: "Academic Medicine, 91(7), 994–1001",
    url: "https://doi.org/10.1097/ACM.0000000000001189",
    driver: "inclusion_belonging",
    summary:
      "Ensaio controlado randomizado (RCT) demonstrando que programas estruturados de mentoria e patrocínio (sponsorship) aumentam a retenção, a segurança psicológica e a representatividade em cargos de liderança.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Inclusion & Belonging",
    playbookCitationRef: "Playbook 2.0 · Inclusion & Belonging, Ref #24 (p. 31)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10 MTE 2026 (medidas administrativas e organizacionais de suporte e inclusão).",
  },

  // ===== R: SUPPORT (Playbook 2.0 pp. 32–34 · 11 Refs) =====
  {
    id: "ART-SUP-01",
    title: "Managerial quality and productivity: A randomized trial of soft-skills and support training",
    authors: "Adhvaryu, A., Kala, N. & Nyshadham, A.",
    year: 2022,
    journal: "Journal of Political Economy, 131(5), 1190–1230",
    url: "https://doi.org/10.1086/722933",
    driver: "support",
    summary:
      "Ensaio controlado randomizado comprovando que capacitar supervisores em comunicação empática, resolução conjunta de problemas e suporte técnico reduz a rotatividade e eleva o bem-estar operacional.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Support",
    playbookCitationRef: "Playbook 2.0 · Support, Ref #2 (p. 34)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10.1 MTE 2026 (qualificação da supervisão como medida coletiva de prevenção).",
  },
  {
    id: "ART-SUP-03",
    title: "Improving workplace climate in large corporations: A clustered randomized intervention",
    authors: "Alan, S., Corekcioglu, G. & Sutter, M.",
    year: 2023,
    journal: "The Quarterly Journal of Economics, 138(1), 151–203",
    url: "https://doi.org/10.1093/qje/qjad006",
    driver: "support",
    summary:
      "Cluster-RCT em 20 grandes corporações: o treinamento em liderança pró-social transformou a estrutura das redes sociais internas, aumentou o suporte entre colegas e reduziu o isolamento.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Support",
    playbookCitationRef: "Playbook 2.0 · Support, Ref #5 (p. 34)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (fortalecimento do suporte social como redutor de probabilidade de agravo psicossocial).",
  },
  {
    id: "ART-SUP-04",
    title: "Clarifying Work-Family Intervention Processes: The Role of Family-Supportive Supervisor Behaviors (FSSB)",
    authors: "Hammer, L. B., Kossek, E. E., Anger, W. K., Bodner, T. & Zimmerman, K. L.",
    year: 2011,
    journal: "Journal of Applied Psychology, 96(1), 134–150",
    url: "https://doi.org/10.1037/a0021536",
    driver: "support",
    summary:
      "Ensaio controlado randomizado (RCT) demonstrando que treinar gestores em comportamentos de suporte familiar (FSSB) reduz o conflito trabalho-família, melhora a saúde física e eleva a satisfação no trabalho.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Support",
    playbookCitationRef: "Playbook 2.0 · Support, Ref #7 (p. 34)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 e NR-1 item 1.5.4.3 · Cap. 7 e Cap. 8.2 MTE 2026 (organização temporal do trabalho e suporte gerencial).",
  },

  // ===== R: TRUST (Playbook 2.0 pp. 35–37 · 17 Refs) =====
  {
    id: "ART-TRS-01",
    title: "Psychological safety and learning behavior in work teams",
    authors: "Edmondson, A. C.",
    year: 1999,
    journal: "Administrative Science Quarterly, 44(2), 350–383",
    url: "https://doi.org/10.2307/2666999",
    driver: "trust",
    summary:
      "Estudo seminal multimétodo comprovando que a Segurança Psicológica — a crença compartilhada de que a equipe é segura para relatar erros, riscos e dúvidas sem punição — é a base da aprendizagem e prevenção de acidentes.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Trust",
    playbookCitationRef: "Playbook 2.0 · Trust, Ref #2 & Spotlight (pp. 35–37)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 e Cap. 6.1 MTE 2026 (ambiente seguro para o trabalhador comunicar perigos sem medo de retaliação).",
  },
  {
    id: "ART-TRS-02",
    title: "The Psychological Conditions of Meaningfulness, Safety and Availability and the Engagement of the Human Spirit at Work",
    authors: "May, D. R., Gilson, R. L. & Harter, L. M.",
    year: 2004,
    journal: "Journal of Occupational and Organizational Psychology, 77(1), 11–37",
    url: "https://doi.org/10.1348/096317904322915892",
    driver: "trust",
    summary:
      "Relações interpessoais de suporte e liderança confiável são os preditores mais fortes de segurança psicológica e disponibilidade cognitiva para o trabalho seguro.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Trust",
    playbookCitationRef: "Playbook 2.0 · Trust, Ref #4 (p. 37)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (clima de confiança e relações interpessoais como fatores de organização do trabalho).",
  },
  {
    id: "ART-TRS-03",
    title: "Reaping the benefits of task conflict in teams: The critical role of team psychological safety climate",
    authors: "Bradley, B. H., Postlethwaite, B. E., Klotz, A. C., Hamdani, M. R. & Brown, K. G.",
    year: 2012,
    journal: "Journal of Applied Psychology, 97(1), 151–158",
    url: "https://doi.org/10.1037/a0024200",
    driver: "trust",
    summary:
      "Em equipes com alta segurança psicológica, divergências técnicas sobre processos geram inovação e correção de falhas em vez de conflito interpessoal destrutivo.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Trust",
    playbookCitationRef: "Playbook 2.0 · Trust, Ref #5 (p. 37)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.2 e Cap. 10.2 MTE 2026 (prevenção da 'normalização do desvio' por meio do debate técnico aberto).",
  },
  {
    id: "ART-TRS-04",
    title: "CSR as organization-employee relationship management strategy: A study on trust, commitment, and well-being",
    authors: "Dhanesh, G. S.",
    year: 2014,
    journal: "Management Communication Quarterly, 28(1), 130–149",
    url: "https://doi.org/10.1177/0893318913517238",
    driver: "trust",
    summary:
      "Práticas autênticas e participativas de responsabilidade social e ética organizacional sinalizam cuidado além do lucro imediato, fortalecendo a confiança institucional.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Trust",
    playbookCitationRef: "Playbook 2.0 · Trust, Ref #1 (p. 37)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.1 · Cap. 3 MTE 2026 (compromisso da alta liderança com a governança ética do GRO).",
  },

  // ===== R: MANAGEMENT (Playbook 2.0 pp. 38–40 · 13 Refs) =====
  {
    id: "ART-MNG-01",
    title: "Job design, employment practices and well-being: A systematic review of intervention studies",
    authors: "Daniels, K., Gedikli, C., Watson, D., Semkina, A. & Vaughn, O.",
    year: 2017,
    journal: "Ergonomics, 60(9), 1177–1196",
    url: "https://doi.org/10.1080/00140139.2017.1303085",
    driver: "management",
    summary:
      "Revisão sistemática demonstrando que intervenções de redesenho do trabalho e melhoria de práticas de gestão só sustentam resultados quando os gestores diretos são capacitados e têm carga de trabalho compatível.",
    status: "open",
    tier: "Systematic Review",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Management",
    playbookCitationRef: "Playbook 2.0 · Management, Ref #1 (p. 40)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10.1 MTE 2026 (eficácia das medidas administrativas e de redesenho do trabalho).",
  },
  {
    id: "ART-MNG-04",
    title: "Organizational- and group-level workplace interventions and their effect on multiple domains of worker well-being: A systematic review",
    authors: "Fox, K. E., Johnson, S. T., Berkman, L. F. et al.",
    year: 2022,
    journal: "Work & Stress, 36(1), 30–59",
    url: "https://doi.org/10.1080/02678373.2021.1969476",
    driver: "management",
    summary:
      "Revisão sistemática de intervenções em nível organizacional e grupal comprovando que o treinamento de lideranças aliado ao controle de demandas reduz o sofrimento psíquico das equipes em poucos meses.",
    status: "open",
    tier: "Systematic Review",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Management",
    playbookCitationRef: "Playbook 2.0 · Management, Ref #6 (p. 40)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.1 e 1.5.5.2 · Cap. 10 e Cap. 11 MTE 2026 (priorização de intervenções coletivas e organizacionais no Plano de Ação).",
  },
  {
    id: "ART-MNG-05",
    title: "The relationship between leader burnout and follower outcomes: Social contagion and role modeling",
    authors: "Day, A., Crown, S. N. & Ivany, M.",
    year: 2017,
    journal: "Safety Science, 100(A), 4–12",
    url: "https://doi.org/10.1016/j.ssci.2017.05.013",
    driver: "management",
    summary:
      "O estresse e o burnout do gestor cascateiam diretamente para a equipe por contágio social. Proteger e apoiar a saúde mental da liderança intermediária é pré-requisito para equipes saudáveis.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Management",
    playbookCitationRef: "Playbook 2.0 · Management, Ref #9 (p. 40)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.3 · Cap. 7 e Cap. 8.2 MTE 2026 (inclusão da liderança intermediária nos Grupos de Exposição Similar — GES/GHE).",
  },
  {
    id: "ART-MNG-06",
    title: "How efficient are emotional intelligence trainings: A meta-analysis",
    authors: "Hodzic, S., Scharfen, J., Ripoll, P., Holling, H. & Zenasni, F.",
    year: 2018,
    journal: "Emotion Review, 10(2), 138–148",
    url: "https://doi.org/10.1177/1754073917735902",
    driver: "management",
    summary:
      "Meta-análise de 24 estudos controlados demonstrando que a Inteligência Emocional (EI) de gestores é treinável e gera melhorias sustentadas no manejo de conflitos e no bem-estar das equipes.",
    status: "paywall",
    tier: "Meta-analysis",
    playbookPillar: "R",
    playbookPillarLabel: "R · Relações e Liderança",
    playbookSection: "Management",
    playbookCitationRef: "Playbook 2.0 · Management, Ref #10 (p. 40)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10 MTE 2026 (capacitação gerencial como medida preventiva estruturada).",
  },

  // ===== I: FLEXIBILITY, EMPLOYEE VOICE & AUTONOMY (Playbook 2.0 Pillar I) =====
  {
    id: "ART-FLX-02",
    title: "Valuing Alternative Work Arrangements",
    authors: "Mas, A. & Pallais, A.",
    year: 2017,
    journal: "American Economic Review, 107(12), 3722–3759",
    url: "https://doi.org/10.1257/aer.20161500",
    driver: "flexibility",
    summary:
      "Experimento de escolha em larga escala demonstrando que a previsibilidade de escala e a proteção contra alterações abruptas de horário são críticas para evitar exaustão e conflito familiar.",
    status: "paywall",
    tier: "Choice Experiment",
    playbookPillar: "I",
    playbookPillarLabel: "I · Independência, Voz e Flexibilidade",
    playbookSection: "Flexibility",
    playbookCitationRef: "Playbook 2.0 · Flexibility & Schedule Control (Pillar I)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4 e NR-1 item 1.5.4.3.2 · Cap. 7 e Cap. 10.5 MTE 2026 (organização temporal do trabalho, turnos e teletrabalho).",
  },
  {
    id: "ART-FLX-03",
    title: "Changing Work and Work-Family Conflict: Evidence from the Work, Family, and Health Network (STAR Trial)",
    authors: "Kelly, E. L., Moen, P., Oakes, J. M. et al.",
    year: 2014,
    journal: "American Sociological Review, 79(3), 485–516",
    url: "https://doi.org/10.1177/0003122414531435",
    driver: "flexibility",
    summary:
      "Ensaio clínico randomizado de campo (STAR) em empresa Fortune 500: aumentar o controle dos trabalhadores sobre quando e onde realizam suas entregas reduziu significativamente o estresse e o burnout sem perda de produtividade.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "I",
    playbookPillarLabel: "I · Independência, Voz e Flexibilidade",
    playbookSection: "Flexibility",
    playbookCitationRef: "Playbook 2.0 · Flexibility / Appreciation, Ref #10 (p. 27 / Pillar I)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.3.2 · Cap. 10.5 MTE 2026 (gestão ergonômica e psicossocial do trabalho remoto e híbrido).",
  },
  {
    id: "ART-EV-01",
    title: "Democratizing Work: Redistributing power in organizations for a democratic and sustainable future",
    authors: "Battilana, J., Yen, J., Ferreras, I. & Ramarajan, L.",
    year: 2022,
    journal: "Organization Theory, 3(1), 1–21",
    url: "https://doi.org/10.1177/26317877221084714",
    driver: "employee_voice",
    summary:
      "Garantir canais institucionais para que os trabalhadores influenciem decisões operacionais que afetam suas rotinas fortalece a saúde ocupacional e a governança sustentável.",
    status: "open",
    tier: "Research Review",
    playbookPillar: "I",
    playbookPillarLabel: "I · Independência, Voz e Flexibilidade",
    playbookSection: "Employee Voice",
    playbookCitationRef: "Playbook 2.0 · Inclusion & Employee Voice, Ref #3 (p. 31 / Pillar I)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 'a' e 'b' · Cap. 6 MTE 2026 (os 4 momentos obrigatórios de consulta e participação dos trabalhadores e CIPA).",
  },
  {
    id: "ART-EV-02",
    title: "Expectations, Wage Hikes and Worker Voice: Evidence from a Field Experiment",
    authors: "Adhvaryu, A., Molina, T. & Nyshadham, A.",
    year: 2022,
    journal: "The Economic Journal, 132(645), 1978–1993",
    url: "https://doi.org/10.1093/ej/ueac006",
    driver: "employee_voice",
    summary:
      "Ensaio controlado randomizado (RCT) demonstrando que canais estruturados e anônimos de voz do trabalhador reduzem drasticamente o desligamento voluntário e a insatisfação coletiva.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "I",
    playbookPillarLabel: "I · Independência, Voz e Flexibilidade",
    playbookSection: "Employee Voice",
    playbookCitationRef: "Playbook 2.0 · Employee Voice (Pillar I)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.6 'f' · Cap. 6 e Cap. 11.7 MTE 2026 (solicitação justificada dos trabalhadores ou CIPA como gatilho de revisão do PGR).",
  },
  {
    id: "ART-AUT-01",
    title: "Effects of a participatory organizational intervention on psychosocial work environment and mental health",
    authors: "Kobayashi, Y., Kaneyoshi, A., Yokota, A. & Kawakami, N.",
    year: 2008,
    journal: "Journal of Occupational Health, 50(6), 455–470",
    url: "https://doi.org/10.1539/joh.L8022",
    driver: "autonomy",
    summary:
      "Estudo controlado em 45 departamentos: onde os trabalhadores tiveram autonomia participativa para mapear problemas e co-desenvolver melhorias, houve queda significativa de estresse e melhora no clima psicossocial.",
    status: "open",
    tier: "Controlled Study",
    playbookPillar: "I",
    playbookPillarLabel: "I · Independência, Voz e Flexibilidade",
    playbookSection: "Autonomy",
    playbookCitationRef: "Playbook 2.0 · Autonomy & Participatory Redesign (Pillar I)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4.1 e NR-1 item 1.5.3.3 · Cap. 6 e Cap. 7 MTE 2026 (margem de autonomia para regulação do ritmo e método de trabalho).",
  },
  {
    id: "ART-AUT-02",
    title: "Training corporate managers to adopt a more autonomy-supportive motivating style toward employees: An experimentallyControlled field study",
    authors: "Hardré, P. L. & Reeve, J.",
    year: 2009,
    journal: "International Journal of Training and Development, 13(3), 165–184",
    url: "https://doi.org/10.1111/j.1468-2419.2009.00325.x",
    driver: "autonomy",
    summary:
      "Ensaio controlado randomizado (RCT) em empresa Fortune 500 demonstrando que treinar gestores para substituir microgerenciamento por suporte à autonomia eleva o engajamento e reduz a exaustão.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "I",
    playbookPillarLabel: "I · Independência, Voz e Flexibilidade",
    playbookSection: "Autonomy",
    playbookCitationRef: "Playbook 2.0 · Support & Autonomy, Ref #4 (p. 34 / Pillar I)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (eliminação de supervisão estressante ou microgerenciamento punitivo).",
  },

  // ===== V: ENERGY & PURPOSE (Playbook 2.0 Pillar V) =====
  {
    id: "ART-ENR-05",
    title: "Employee well-being outcomes from individual-level mental health interventions: Cross-sectional evidence from 46,336 UK workers",
    authors: "Fleming, W. J.",
    year: 2024,
    journal: "Industrial Relations Journal, 55(2), 162–182",
    url: "https://doi.org/10.1111/irj.12418",
    driver: "energy",
    summary:
      "Estudo da Universidade de Oxford (coautor do Playbook 2.0) com 46.336 trabalhadores: programas individuais isolados (apps de meditação, palestras de resiliência) NÃO melhoram o bem-estar se as condições reais e demandas do trabalho não forem corrigidas na fonte.",
    status: "open",
    tier: "Large-Scale Study",
    playbookPillar: "V",
    playbookPillarLabel: "V · Variedade, Energia e Propósito",
    playbookSection: "Energy",
    playbookCitationRef: "Playbook 2.0 · Core Premise & Structural vs. Individual Interventions (Oxford WRC)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10.1 MTE 2026 (prioridade absoluta à eliminação do risco na fonte e medidas coletivas sobre medidas meramente individuais).",
  },
  {
    id: "ART-ENR-04",
    title: "Individual job redesign: Job crafting interventions in healthcare and knowledge work",
    authors: "Gordon, H. J., Demerouti, E., Le Blanc, P. M. et al.",
    year: 2018,
    journal: "Journal of Vocational Behavior, 104, 98–114",
    url: "https://doi.org/10.1016/j.jvb.2017.10.008",
    driver: "energy",
    summary:
      "Intervenções estruturadas de Job Crafting (ajuste de tarefas, recursos relacionais e demandas) aliadas a pausas reais de recuperação reduzem a exaustão emocional e melhoram o desempenho adaptativo.",
    status: "open",
    tier: "Controlled Study",
    playbookPillar: "V",
    playbookPillarLabel: "V · Variedade, Energia e Propósito",
    playbookSection: "Energy",
    playbookCitationRef: "Playbook 2.0 · Energy & Job Crafting (Pillar V)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4.2 · Cap. 7 MTE 2026 (pausas psicofisiológicas de recuperação e variação de postura/cognição).",
  },
  {
    id: "ART-PRP-03",
    title: "Helping others increases meaningful work: Evidence from three experiments",
    authors: "Allan, B. A., Duffy, R. D. & Collisson, B.",
    year: 2018,
    journal: "Journal of Counseling Psychology, 65(2), 155–165",
    url: "https://doi.org/10.1037/cou0000228",
    driver: "purpose",
    summary:
      "Três experimentos controlados comprovando que conectar claramente a tarefa diária ao benefício humano gerado para clientes, colegas ou sociedade eleva significativamente o senso de propósito e realização.",
    status: "paywall",
    tier: "RCT",
    playbookPillar: "V",
    playbookPillarLabel: "V · Variedade, Energia e Propósito",
    playbookSection: "Purpose",
    playbookCitationRef: "Playbook 2.0 · Purpose & Beneficiary Contact (Pillar V)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 MTE 2026 (sentido do trabalho e prevenção da alienação operacional).",
  },
  {
    id: "ART-PRP-05",
    title: "I’m Not Mopping the Floors, I’m Putting a Man on the Moon: How NASA Leaders Enhanced the Meaningfulness of Work",
    authors: "Carton, A. M.",
    year: 2018,
    journal: "Administrative Science Quarterly, 63(2), 323–369",
    url: "https://doi.org/10.1177/0001839217713748",
    driver: "purpose",
    summary:
      "Estudo organizacional demonstrando os 4 passos concretos pelos quais líderes traduzem objetivos abstratos em marcos cotidianos tangíveis, conectando cada função operacional ao propósito coletivo.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "V",
    playbookPillarLabel: "V · Variedade, Energia e Propósito",
    playbookSection: "Purpose",
    playbookCitationRef: "Playbook 2.0 · Purpose & Mission Connection (Pillar V)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.3.3 · Cap. 6 MTE 2026 (comunicação clara do sentido das medidas preventivas e operacionais).",
  },

  // ===== E: COMPENSATION (Playbook 2.0 Pillar E) =====
  {
    id: "ART-CMP-03",
    title: "Pay transparency and the gender gap: Evidence from research-intensive universities",
    authors: "Obloj, T. & Zenger, T.",
    year: 2022,
    journal: "Nature Human Behaviour, 6, 646–655",
    url: "https://doi.org/10.1038/s41562-022-01288-9",
    driver: "compensation",
    summary:
      "Análise longitudinal demonstrando que políticas de transparência salarial e critérios claros de progressão reduzem iniquidades remuneratórias de gênero e fortalecem a percepção de justiça distributiva.",
    status: "paywall",
    tier: "Longitudinal",
    playbookPillar: "E",
    playbookPillarLabel: "E · Remuneração e Benefícios",
    playbookSection: "Compensation",
    playbookCitationRef: "Playbook 2.0 · Compensation & Pay Equity (Pillar E)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "Lei nº 14.611/2023 (Igualdade Salarial) e NR-1 Cap. 1.5 · Cap. 8.2 MTE 2026 (justiça organizacional e equidade).",
  },
  {
    id: "ART-CMP-04",
    title: "Impact of a living wage on health and wellbeing: Quasi-experimental study of apparel workers",
    authors: "Burmaster, K. B., Landefeld, J. C., Rehkopf, D. H. et al.",
    year: 2015,
    journal: "BMJ Open, 5(8), e007918",
    url: "https://doi.org/10.1136/bmjopen-2015-007918",
    driver: "compensation",
    summary:
      "Estudo quase-experimental publicado no BMJ Open comprovando que garantir remuneração digna (living wage) reduz sintomas depressivos e melhora significativamente a saúde geral dos trabalhadores.",
    status: "open",
    tier: "Quasi-Experimental",
    playbookPillar: "E",
    playbookPillarLabel: "E · Remuneração e Benefícios",
    playbookSection: "Compensation",
    playbookCitationRef: "Playbook 2.0 · Compensation & Living Wage (Pillar E)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4.3 e NR-1 · Cap. 7 MTE 2026 (vedação de sistemas de remuneração por produção que comprometam a saúde ou segurança).",
  },

  // ===== R_RISK: STRESS & WORKLOAD PRESSURES (Playbook 2.0 Pillar R — Risk, Health & Safety) =====
  {
    id: "ART-STR-01",
    title: "Job demands, job resources, and their relationship with burnout and engagement: A multi-sample study",
    authors: "Schaufeli, W. B. & Bakker, A. B.",
    year: 2004,
    journal: "Journal of Organizational Behavior, 25(3), 293–315",
    url: "https://doi.org/10.1002/job.248",
    driver: "stress",
    summary:
      "Modelo Demandas-Recursos no Trabalho (JD-R): o esgotamento ocupacional (burnout) resulta do excesso crônico de demandas sem recursos organizacionais proporcionais de controle, suporte e recuperação.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R_RISK",
    playbookPillarLabel: "R · Risco, Saúde e Pressões de Carga",
    playbookSection: "Stress",
    playbookCitationRef: "Playbook 2.0 · Stress & JD-R Framework (Pillar R)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.4.4.5.3 · Cap. 8.2 e Cap. 11.4 MTE 2026 (avaliação da intensidade e duração das exigências da atividade vs. eficácia dos controles).",
  },
  {
    id: "ART-STR-03",
    title: "Job Demands, Job Decision Latitude, and Mental Strain: Implications for Job Redesign",
    authors: "Karasek, R. A.",
    year: 1979,
    journal: "Administrative Science Quarterly, 24(2), 285–308",
    url: "https://doi.org/10.2307/2392498",
    driver: "stress",
    summary:
      "Modelo Demanda-Controle de Karasek (base teórica do COPSOQ II e da NR-17): a combinação de alta exigência quantitativa/cognitiva com baixa latitude decisória configura trabalho de alto desgaste (High Strain).",
    status: "paywall",
    tier: "Theory",
    playbookPillar: "R_RISK",
    playbookPillarLabel: "R · Risco, Saúde e Pressões de Carga",
    playbookSection: "Stress",
    playbookCitationRef: "Playbook 2.0 · Stress & Job Control (Pillar R)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4 e NR-1 item 1.5.4.3 · Cap. 7 e Cap. 8.2 MTE 2026 (redesenho ergonômico e organizacional do trabalho de alta tensão).",
  },
  {
    id: "ART-STR-05",
    title: "Burnout prevention: A review of intervention programs",
    authors: "Awa, W. L., Plaumann, M. & Walter, U.",
    year: 2010,
    journal: "Patient Education and Counseling, 78(2), 184–190",
    url: "https://doi.org/10.1016/j.pec.2009.04.008",
    driver: "stress",
    summary:
      "Revisão sistemática demonstrando que intervenções que combinam modificações na organização do trabalho (prevenção primária) com apoio ao trabalhador têm efeito muito mais duradouro contra o burnout do que ações individuais isoladas.",
    status: "paywall",
    tier: "Systematic Review",
    playbookPillar: "R_RISK",
    playbookPillarLabel: "R · Risco, Saúde e Pressões de Carga",
    playbookSection: "Stress",
    playbookCitationRef: "Playbook 2.0 · Stress & Systemic Burnout Prevention (Pillar R)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-1 item 1.5.5.1.2 · Cap. 10.1 e Cap. 12.3 MTE 2026 (articulação entre medidas coletivas na fonte e vigilância de saúde no PCMSO/NR-7).",
  },
  {
    id: "ART-WLP-01",
    title: "The 4-day workweek and work reorganization: Multi-organization trial on burnout, fatigue, and performance",
    authors: "Fan, W., Schor, J. B., Kelly, E. L. et al.",
    year: 2023,
    journal: "Socius: Sociological Research for a Dynamic World, 9, 1–17",
    url: "https://doi.org/10.1177/23780231231179909",
    driver: "workload_pressures",
    summary:
      "Ensaio multi-organizacional demonstrando que redesenhar fluxos operacionais, eliminar reuniões improdutivas e dimensionar realisticamente a carga de trabalho reduz drasticamente burnout, distúrbios do sono e fadiga.",
    status: "open",
    tier: "Controlled Study",
    playbookPillar: "R_RISK",
    playbookPillarLabel: "R · Risco, Saúde e Pressões de Carga",
    playbookSection: "Workload Pressures",
    playbookCitationRef: "Playbook 2.0 · Workload Pressures & Work Redesign (Pillar R)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4.1 e NR-1 item 1.5.4.4.5.3 · Cap. 7 e Cap. 8.2 MTE 2026 (adequação do efetivo, ritmo e cadência de trabalho).",
  },
  {
    id: "ART-WLP-02",
    title: "Videoconference fatigue? Exploring changes in fatigue after videoconference meetings during COVID-19",
    authors: "Bennett, A. A., Campion, E. D., Keeler, K. R. & Keener, S. K.",
    year: 2021,
    journal: "Journal of Applied Psychology, 106(3), 330–344",
    url: "https://doi.org/10.1037/apl0000905",
    driver: "workload_pressures",
    summary:
      "Estudo empírico demonstrando como a higiene de reuniões (blocos de foco sem interrupção, pausas entre chamadas e pautas objetivas) reduz a sobrecarga cognitiva e a fadiga digital.",
    status: "paywall",
    tier: "Field Study",
    playbookPillar: "R_RISK",
    playbookPillarLabel: "R · Risco, Saúde e Pressões de Carga",
    playbookSection: "Workload Pressures",
    playbookCitationRef: "Playbook 2.0 · Workload Pressures & Cognitive Load Management (Pillar R)",
    canonicalDocUrl: CANONICAL_PLAYBOOK_2_ASSET_URL,
    mte2026Crosswalk: "NR-17 item 17.4.2 e NR-1 item 1.5.4.3.2 · Cap. 7 e Cap. 10.5 MTE 2026 (prevenção da hiperconectividade e sobrecarga mental).",
  },
];

/**
 * Base de Conhecimento Canônica dos 19 Capítulos do Manual Oficial MTE 2026 Comentado
 * ("Manual de interpretação e aplicação do capítulo 1.5 da NR-1 - Gerenciamento de riscos ocupacionais [GRO]", MTE/SIT/DSST, 2026).
 */
export const MTE_2026_CANONICAL_CHAPTERS: readonly Mte2026CanonicalChapter[] = [
  {
    id: "MTE-CAP-01",
    chapterNumber: 1,
    chapterTitle: "Capítulo 1 — Introdução ao Gerenciamento de Riscos Ocupacionais (GRO)",
    nr1Clauses: ["1.5.1", "1.5.2"],
    pageRange: "pp. 7–9",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Apresenta o objetivo do Manual Oficial do MTE: orientar empregadores, trabalhadores, CIPA, SESMT e Auditores-Fiscais do Trabalho na aplicação sistêmica do Capítulo 1.5 da NR-1 (incluindo fatores ergonômicos e psicossociais relacionados ao trabalho após as Portarias MTE nº 1.419/2024 e nº 765/2025).",
    auditorInspectionFocus:
      "Verifica se a organização trata o GRO como um sistema vivo de gestão contínua, e não como um documento estático de gaveta.",
    learningSciencePrinciple:
      "Visão Sistêmica Inicial (Advance Organizer de Ausubel): situa o usuário no propósito protetivo da norma antes de introduzir detalhes técnicos.",
    appFeatureLabel: "Visão Geral da Torre de Comando GRO",
    appRoute: "/app",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-02",
    chapterNumber: 2,
    chapterTitle: "Capítulo 2 — Abrangência e Campo de Aplicação da NR-1",
    nr1Clauses: ["1.2", "1.5.1"],
    pageRange: "pp. 10–11",
    driverPillarBridge: "D",
    pedagogicalSummary:
      "Esclarece que o GRO abrange todos os perigos e riscos ocupacionais (físicos, químicos, biológicos, de acidentes, ergonômicos e fatores de risco psicossociais relacionados ao trabalho) em todas as organizações que possuam empregados regidos pela CLT.",
    auditorInspectionFocus:
      "Confere se todos os estabelecimentos, setores, turnos e modalidades (presencial, híbrido, teletrabalho e campo) foram mapeados.",
    learningSciencePrinciple:
      "Delimitação de Fronteira Epistêmica: evita pontos cegos organizacionais ao mapear unidades e Grupos de Exposição Similar (GES/GHE).",
    appFeatureLabel: "Cadastro de Empresa, Unidades e GHE",
    appRoute: "/app/units",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-03",
    chapterNumber: 3,
    chapterTitle: "Capítulo 3 — O que é o GRO (Ciclo PDCA da Gestão de SST)",
    nr1Clauses: ["1.5.3.1", "1.5.3.2"],
    pageRange: "pp. 12–13",
    driverPillarBridge: "R",
    pedagogicalSummary:
      "Define o GRO como macroprocesso gerencial baseado no ciclo PDCA (Plan-Do-Check-Act / Planejar-Fazer-Verificar-Agir) alinhado à ISO 45001, exigindo melhoria contínua do desempenho em SST.",
    auditorInspectionFocus:
      "Avalia se há encadeamento real entre diagnóstico (Plan), execução de controles (Do), verificação de eficácia (Check) e revisão de risco residual (Act).",
    learningSciencePrinciple:
      "Ciclo de Aprendizagem Experiencial (Kolb / PDCA): transforma dados coletivos em aprendizado organizacional iterativo.",
    appFeatureLabel: "Pipeline Integrado de 7 Etapas GRO/PGR",
    appRoute: "/app",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-04",
    chapterNumber: 4,
    chapterTitle: "Capítulo 4 — Relação entre GRO e PGR (Os 3 Documentos Mínimos Obrigatórios)",
    nr1Clauses: ["1.5.3.1.1", "1.5.4.4.2.2", "1.5.7.1"],
    pageRange: "pp. 14–16 (Quadro 1)",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Distingue o GRO (sistema de gerenciamento amplo) do PGR (programa materializado em documentos). O Quadro 1 (p. 15) explicita os 3 documentos mínimos obrigatórios relacionados ao PGR: (1) Inventário de Riscos; (2) Plano de Ação; e (3) Documento sobre os Critérios Utilizados pela organização para avaliação de riscos e tomada de decisão.",
    auditorInspectionFocus:
      "Exige a apresentação imediata não apenas do Inventário e do Plano de Ação, mas também do 3º Documento Mínimo Obrigatório com os critérios de gradação S×P (item 1.5.4.4.2.2).",
    learningSciencePrinciple:
      "Externalização de Critérios Mentais: torna explícitas e auditáveis as regras matemáticas de decisão antes da classificação do risco.",
    appFeatureLabel: "Emissão dos 3 Documentos Mínimos do PGR",
    appRoute: "/app/documents",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-05",
    chapterNumber: 5,
    chapterTitle: "Capítulo 5 — Responsabilidades da Organização e Atuação Compartilhada",
    nr1Clauses: ["1.5.3.2", "1.5.3.5"],
    pageRange: "pp. 17–21",
    driverPillarBridge: "R",
    pedagogicalSummary:
      "Determina os deveres indelegáveis da organização: evitar riscos que possam ser originados no trabalho, identificar perigos, avaliar riscos, implementar medidas de prevenção, acompanhar controles e coordenar o PGR quando várias empresas atuam simultaneamente no mesmo local.",
    auditorInspectionFocus:
      "Verifica se a contratante integra as contratadas/terceirizadas ao gerenciamento de riscos do ambiente compartilhado.",
    learningSciencePrinciple:
      "Responsabilidade Compartilhada e Co-Regulação: elimina zonas cinzentas de responsabilidade entre contratantes e contratadas.",
    appFeatureLabel: "Protocolo Multi-CNPJ e Perigos Compartilhados",
    appRoute: "/app/cycles",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-06",
    chapterNumber: 6,
    chapterTitle: "Capítulo 6 — Participação dos Trabalhadores ('Especialistas do Saber-Fazer') e CIPA",
    nr1Clauses: ["1.5.3.3", "1.5.5.1.3", "1.5.4.4.6 'f'"],
    pageRange: "pp. 22–25 (Figura 7)",
    driverPillarBridge: "I",
    pedagogicalSummary:
      "Consagra os trabalhadores como 'especialistas do saber-fazer' do trabalho real. A Figura 7 (p. 23) define os 4 momentos essenciais de participação e consulta à CIPA: (1) Identificação de perigos; (2) Avaliação de riscos; (3) Adoção de medidas de prevenção; e (4) Acompanhamento e comunicação em via de mão dupla.",
    auditorInspectionFocus:
      "Audita evidências concretas de consulta aos trabalhadores e à CIPA, comunicados em linguagem acessível e canal para solicitação justificada de revisão do PGR (1.5.4.4.6 'f').",
    learningSciencePrinciple:
      "Cognição Situada e Segurança Psicológica: o conhecimento tácito de quem executa a tarefa é insubstituível para enxergar o trabalho real vs. trabalho prescrito.",
    appFeatureLabel: "Protocolo dos 4 Momentos CIPA & Devolutiva em Slides",
    appRoute: "/app/documents",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-07",
    chapterNumber: 7,
    chapterTitle: "Capítulo 7 — Levantamento Preliminar de Perigos e Ações Imediatas",
    nr1Clauses: ["1.5.4.2", "1.5.4.2.1"],
    pageRange: "pp. 26–29",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "O levantamento preliminar deve ser realizado antes do início do funcionamento ou para as atividades existentes. Quando um perigo pode ser eliminado de imediato ou já possui medida de prevenção conhecida e aplicável, a organização deve agir imediatamente sem burocratizar a proteção.",
    auditorInspectionFocus:
      "Verifica se a organização adota medidas preventivas imediatas diante de perigos evidentes identificados na triagem preliminar.",
    learningSciencePrinciple:
      "Heurística de Ação Protetiva Rápida: reduz a latência entre a detecção de um perigo óbvio e a contenção na fonte.",
    appFeatureLabel: "Ciclos de Escuta e Levantamento Preliminar",
    appRoute: "/app/cycles",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-08",
    chapterNumber: 8,
    chapterTitle: "Capítulo 8 — Processo de Identificação de Perigos e Avaliação de Riscos (Passo a Passo)",
    nr1Clauses: ["1.5.4.1", "1.5.4.3", "1.5.4.4"],
    pageRange: "pp. 30–35",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Estrutura o fluxo lógico do GRO: planejar o processo, constituir equipe multidisciplinar, levantar informações do trabalho real e executar a identificação de perigos e avaliação de riscos. O Passo 4 (Cap. 8.2, p. 34) adverte expressamente: mesmo contratando apoio externo ou plataformas, a responsabilidade final pelo GRO/PGR é interna e indelegável da organização.",
    auditorInspectionFocus:
      "Rejeita documentos padronizados 'de prateleira' sem participação interna e sem validação do responsável técnico da empresa.",
    learningSciencePrinciple:
      "Apropriação Cognitiva Interna (Ownership): a ferramenta atua como andaime metodológico, mantendo o julgamento técnico sob governança da organização.",
    appFeatureLabel: "Análise do Trabalho Real (AEP) & Revisão Técnica",
    appRoute: "/app/work-analysis",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-09",
    chapterNumber: 9,
    chapterTitle: "Capítulo 9 — Conceitos Fundamentais: Perigo, Fator de Risco, Risco Ocupacional e Agravo",
    nr1Clauses: ["1.5.3.1.2", "Anexo I NR-1"],
    pageRange: "pp. 36–40",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Distingue com precisão técnica: Perigo ou Fator de Risco Ocupacional (fonte ou situação com potencial de causar lesão ou agravo à saúde, como sobrecarga crônica de trabalho ou assédio) vs. Risco Ocupacional (combinação da probabilidade de ocorrer lesão/agravo com a severidade dessa lesão/agravo).",
    auditorInspectionFocus:
      "Verifica se o Inventário de Riscos descreve claramente a Fonte/Circunstância, o Grupo Exposto e os Possíveis Agravos, sem confundir sintoma individual com fator de risco organizacional.",
    learningSciencePrinciple:
      "Desambiguação Conceitual: separa causa organizacional (fator de risco na fonte) de efeito clínico (agravo à saúde).",
    appFeatureLabel: "Estrutura de Achados Contextuais AEP",
    appRoute: "/app/work-analysis",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-10",
    chapterNumber: 10,
    chapterTitle: "Capítulo 10 — Identificação de Perigos: Trabalho Real vs. Prescrito, Normalização do Desvio e Perigos Externos",
    nr1Clauses: ["1.5.4.3.1", "1.5.4.3.2", "17.3 (NR-17)"],
    pageRange: "pp. 41–50",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Orienta observar a atividade em sua execução real (e não apenas em manuais prescritos), combater a 'Normalização do Desvio' (Cap. 10.2, p. 43 — quando práticas inseguras ou sobrecargas crônicas passam a ser tratadas como 'normais' pela rotina), integrar a AEP/AET da NR-17 e mapear perigos externos previsíveis (item 1.5.4.3.2, p. 48).",
    auditorInspectionFocus:
      "Investiga se a organização identificou desvios normalizados (como horas extras crônicas, falta de pausas ou metas inexequíveis) e perigos externos previsíveis.",
    learningSciencePrinciple:
      "Desnaturalização Cognitiva do Desvio: alertas determinísticos impedem que médias globais ocultem sobrecargas agudas em setores específicos.",
    appFeatureLabel: "Rastreador de Perigos Externos e AEP/AET",
    appRoute: "/app/work-analysis",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-11",
    chapterNumber: 11,
    chapterTitle: "Capítulo 11 — Avaliação de Riscos: Regra de Ouro da Severidade, Trava Legal da Probabilidade, Matriz ISO 45002 e 6 Gatilhos de Revisão",
    nr1Clauses: ["1.5.4.4.4.1", "1.5.4.4.5.1", "1.5.4.4.5.3", "1.5.4.4.6"],
    pageRange: "pp. 51–73 (Figuras 31–32 e Quadro 5)",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Define as regras matemáticas e normativas centrais da avaliação de riscos: (1) Regra de Ouro da Severidade (1.5.4.4.4.1, p. 53): selecionar sempre a consequência de maior magnitude; (2) Trava Legal da Probabilidade (1.5.4.4.5.1, p. 54): se requisito obrigatório de NR for descumprido, a probabilidade é fixada no nível máximo (5); (3) Avaliação ergonômica/psicossocial (1.5.4.4.5.3); (4) Matriz Severidade × Probabilidade ISO 45002:2023 (pp. 68–70); e (5) Os 6 gatilhos de revisão imediata (1.5.4.4.6 alíneas 'a' a 'f').",
    auditorInspectionFocus:
      "Verifica se a matriz não subestima probabilidades quando faltam controles coletivos e se a empresa revisa o risco após implementar medidas (alínea 'a') ou a pedido da CIPA (alínea 'f').",
    learningSciencePrinciple:
      "Transparência Algorítmica Determinística: visualização clara de como Severidade × Probabilidade e controles comprovados geram a prioridade de ação.",
    appFeatureLabel: "Matriz 5×5 de Riscos & Critérios Versionados",
    appRoute: "/app/risk",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-12",
    chapterNumber: 12,
    chapterTitle: "Capítulo 12 — Controle dos Riscos: Hierarquia Legal, Plano de Ação, 5 Perguntas de Eficácia, Ponte PCMSO (NR-7) e Investigação de Agravos",
    nr1Clauses: ["1.5.5.1.2", "1.5.5.2", "1.5.5.3.2", "1.5.5.1.1 'c'", "1.5.5.5"],
    pageRange: "pp. 74–94",
    driverPillarBridge: "R",
    pedagogicalSummary:
      "Estabelece a Hierarquia de Controles (1.5.5.1.2: eliminar perigo -> medidas coletivas -> medidas administrativas/organização do trabalho -> EPI), a estrutura do Plano de Ação com cronograma e aferição (1.5.5.2), as 5 Perguntas-Chave de acompanhamento de eficácia (Cap. 12.2, p. 78), a articulação bidirecional PGR ↔ PCMSO/NR-7 (Cap. 12.3, p. 81) e a análise de acidentes e doenças relacionadas ao trabalho (Cap. 12.4, p. 83).",
    auditorInspectionFocus:
      "Audita se o Plano de Ação prioriza medidas na fonte e coletivas (rejeitando ações meramente paliativas individuais), se responde às 5 perguntas de eficácia e se dialoga com o PCMSO.",
    learningSciencePrinciple:
      "Feedback Loop de Eficácia (Double-Loop Learning de Argyris): questiona não apenas se a ação foi feita, mas se ela continua produzindo redução real do risco ao longo do tempo.",
    appFeatureLabel: "Plano de Ação 5W2H, 5 Perguntas MTE e Controles",
    appRoute: "/app/actions",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-13",
    chapterNumber: 13,
    chapterTitle: "Capítulo 13 — Documentação do PGR: Inventário de Riscos, Histórico de 20 Anos e Critérios",
    nr1Clauses: ["1.5.7.1", "1.5.7.2", "1.5.7.3.2", "1.5.7.3.3.1"],
    pageRange: "pp. 95–100",
    driverPillarBridge: "D",
    pedagogicalSummary:
      "Detalha o conteúdo obrigatório do Inventário de Riscos Ocupacionais (1.5.7.3.2), a assinatura ou identificação do responsável pela elaboração, o controle de versão do histórico de alterações e a guarda obrigatória pelo prazo mínimo de 20 (vinte) anos (1.5.7.3.3.1).",
    auditorInspectionFocus:
      "Confere a integridade cronológica das versões do Inventário de Riscos, a rastreabilidade das alterações e a política de retenção de 20 anos.",
    learningSciencePrinciple:
      "Memória Institucional Auditável: preserva a linhagem histórica das decisões preventivas com assinatura e hash criptográfico SHA-256.",
    appFeatureLabel: "Inventário de Riscos PGR & Versionamento SHA-256",
    appRoute: "/app/documents",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-14",
    chapterNumber: 14,
    chapterTitle: "Capítulo 14 — Preparação para Grandes Emergências",
    nr1Clauses: ["1.5.6", "1.5.6.1"],
    pageRange: "pp. 101–103",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Determina que a organização deve estabelecer, implementar e manter procedimentos de resposta a cenários de emergências de acordo com os riscos, características e circunstâncias das atividades, incluindo primeiros socorros, contenção e encaminhamento.",
    auditorInspectionFocus:
      "Verifica a existência de fluxos claros de resposta a emergências e crises agudas no ambiente de trabalho.",
    learningSciencePrinciple:
      "Prontidão Operacional sob Estresse Agudo: protocolos claros e pré-treinados reduzem a paralisia decisória em situações críticas.",
    appFeatureLabel: "Governança de Controles e Resposta a Incidentes",
    appRoute: "/app/governance",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-15",
    chapterNumber: 15,
    chapterTitle: "Capítulo 15 — Disposições Gerais do GRO: Contratantes e Contratadas",
    nr1Clauses: ["1.5.8.1", "1.5.8.2", "1.5.8.3", "1.5.8.4"],
    pageRange: "pp. 104–106",
    driverPillarBridge: "D",
    pedagogicalSummary:
      "Regulamenta a atuação integrada entre organizações contratantes e contratadas: a contratante deve fornecer informações sobre os riscos sob sua gestão, e as contratadas devem fornecer ao contratante o Inventário de Riscos específicos de suas atividades.",
    auditorInspectionFocus:
      "Verifica o intercâmbio formal de inventários de riscos e medidas de prevenção entre empresa principal e prestadoras de serviço.",
    learningSciencePrinciple:
      "Interoperabilidade Sistêmica de Segurança: garante que trabalhadores terceirizados recebam o mesmo padrão de proteção coletiva.",
    appFeatureLabel: "Termo de Cooperação Multi-CNPJ (1.5.8)",
    appRoute: "/app/documents",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-16",
    chapterNumber: 16,
    chapterTitle: "Capítulo 16 — Tratamento Diferenciado: MEI, Microempresa (ME) e Empresa de Pequeno Porte (EPP)",
    nr1Clauses: ["1.8", "1.8.1", "1.8.4", "1.8.6"],
    pageRange: "pp. 107–109",
    driverPillarBridge: "D",
    pedagogicalSummary:
      "Explica as regras de tratamento diferenciado da NR-1 para MEI, ME e EPP (graus de risco 1 e 2 sem exposições físicas, químicas ou biológicas e com declaração digital), ressaltando que a dispensa de elaborar PGR formal NÃO exime a empresa de cumprir as demais medidas de prevenção e proteção à saúde dos trabalhadores.",
    auditorInspectionFocus:
      "Audita se a empresa enquadrada como ME/EPP realmente cumpre os requisitos legais de elegibilidade e mantém medidas preventivas reais.",
    learningSciencePrinciple:
      "Proporcionalidade Regulatória sem Desproteção: simplifica o meio documental para pequenos negócios mantendo intacto o dever de prevenção.",
    appFeatureLabel: "Configuração de Porte e Grau de Risco da Empresa",
    appRoute: "/app/company",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-17",
    chapterNumber: 17,
    chapterTitle: "Capítulo 17 — Glossário Técnico Oficial (Anexo I da NR-1)",
    nr1Clauses: ["Anexo I NR-1"],
    pageRange: "pp. 110–111",
    driverPillarBridge: "D",
    pedagogicalSummary:
      "Consolida o vocabulário normativo oficial da NR-1 (Evento Perigoso, Perigo ou Fator de Risco Ocupacional, Risco Ocupacional, Prevenção, Organização, Trabalhador), garantindo uniformidade conceitual em auditorias e documentos do PGR.",
    auditorInspectionFocus:
      "Verifica a precisão terminológica nos documentos emitidos pela organização.",
    learningSciencePrinciple:
      "Padronização Semântica: evita erros de interpretação entre equipes de RH, Engenharia de Segurança, Medicina do Trabalho e Lideranças.",
    appFeatureLabel: "Motor de Critérios & Taxonomia NEXO",
    appRoute: "/app/criteria",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-18",
    chapterNumber: 18,
    chapterTitle: "Capítulo 18 — Referências Técnicas e Normativas (ISO 45001, ISO 45002, ISO 45003, OIT e AIHA)",
    nr1Clauses: ["Referências MTE 2026"],
    pageRange: "pp. 112–113",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Lista as referências internacionais e nacionais que fundamentam o Manual Oficial do MTE, incluindo ABNT NBR ISO 45001, ISO 45002:2023, ISO 31000, diretrizes da OIT sobre sistemas de gestão de SST e literatura de higiene ocupacional e ergonomia.",
    auditorInspectionFocus:
      "Reconhece o uso de metodologias consagradas (como matrizes ISO 45002, instrumentos validados como COPSOQ II e revisões sistemáticas como o Playbook 2.0 de Oxford).",
    learningSciencePrinciple:
      "Triangulação Científica Internacional: conecta a norma brasileira às melhores práticas globais de saúde e segurança ocupacional.",
    appFeatureLabel: "Biblioteca Canônica de Evidências (/library)",
    appRoute: "/library",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
  {
    id: "MTE-CAP-19",
    chapterNumber: 19,
    chapterTitle: "Capítulo 19 — Anexos e Fluxogramas Operacionais do GRO/PGR",
    nr1Clauses: ["1.5.3 a 1.5.7"],
    pageRange: "pp. 114–115",
    driverPillarBridge: "R_RISK",
    pedagogicalSummary:
      "Apresenta a síntese visual do ciclo completo de gerenciamento de riscos ocupacionais, integrando levantamento preliminar, identificação de perigos, avaliação de riscos, controle, acompanhamento de eficácia e revisão periódica ou por gatilho.",
    auditorInspectionFocus:
      "Inspeciona a coerência de ponta a ponta entre todas as etapas do fluxo operacional na organização.",
    learningSciencePrinciple:
      "Síntese Gráfica Integradora (Dual-Coding de Paivio): combina texto normativo e diagrama de fluxo para fixação completa do método.",
    appFeatureLabel: "Auditoria Sistêmica MTE 2026 × COPSOQ II",
    appRoute: "/app/governance",
    canonicalDocUrl: CANONICAL_MTE_2026_ASSET_URL,
  },
];

/**
 * Normaliza texto para busca insensível a acentos e caixa (NFD).
 */
export function normalizeSearchText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export interface ArticleFilterParams {
  readonly search: string;
  readonly driverSlug: string | null;
  readonly pillar: PlaybookDriverAcronymPillar | null;
  readonly tier: string | null;
}

export function filterScientificArticles(
  articles: readonly ScientificArticle[],
  params: ArticleFilterParams,
): ScientificArticle[] {
  const q = normalizeSearchText(params.search);
  return articles.filter((a) => {
    if (params.driverSlug && a.driver !== params.driverSlug) return false;
    if (params.pillar && a.playbookPillar !== params.pillar) return false;
    if (params.tier && a.tier !== params.tier) return false;
    if (!q) return true;
    const haystack = normalizeSearchText(
      `${a.title} ${a.authors} ${a.journal} ${a.summary} ${a.playbookSection} ${a.playbookCitationRef} ${a.mte2026Crosswalk} ${a.year}`,
    );
    return haystack.includes(q);
  });
}

export function filterMte2026Chapters(
  chapters: readonly Mte2026CanonicalChapter[],
  params: {
    readonly search: string;
    readonly pillar: PlaybookDriverAcronymPillar | null;
  },
): Mte2026CanonicalChapter[] {
  const q = normalizeSearchText(params.search);
  return chapters.filter((c) => {
    if (params.pillar && c.driverPillarBridge !== params.pillar) return false;
    if (!q) return true;
    const haystack = normalizeSearchText(
      `Capitulo ${c.chapterNumber} ${c.chapterTitle} ${c.nr1Clauses.join(" ")} ${c.pedagogicalSummary} ${c.auditorInspectionFocus} ${c.learningSciencePrinciple} ${c.appFeatureLabel}`,
    );
    return haystack.includes(q);
  });
}
