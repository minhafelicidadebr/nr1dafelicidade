/**
 * Dados declarativos da jornada de conversão B2B da Página Principal.
 * Centraliza referências normativas versionadas (NR-1, NR-28, Lei 14.831/2024),
 * parâmetros oficiais de gradação em UFIR (R$ 1,0641) e blocos de contraste de valor,
 * preservando integralmente os guardrails de claims públicos do projeto.
 */

export interface Nr28FineBracket {
  readonly id: string;
  readonly category: string;
  readonly normBasis: string;
  readonly degree: string;
  readonly ufirRange: string;
  readonly brlRange: string;
  readonly minBrl: number;
  readonly maxBrl: number;
  readonly isSingleCeiling?: boolean;
  readonly isCeiling?: boolean;
  /** Proporção visual em relação ao teto máximo de 6.304 UFIR (0..100) */
  readonly severityRatio: number;
  readonly note: string;
}

export interface Nr28HeadcountBracket {
  readonly id: string;
  readonly minEmployees: number;
  readonly maxEmployees: number | null;
  readonly label: string;
  readonly minUfir: number;
  readonly maxUfir: number;
  readonly minBrl: number;
  readonly maxBrl: number;
}

export interface Nr28CascadeFactor {
  readonly id: string;
  readonly indexLabel: string;
  readonly title: string;
  readonly metricTag: string;
  readonly description: string;
  readonly legalBasis: string;
}

export interface HomeRegulatoryPulseCard {
  readonly id: string;
  readonly name: string;
  readonly tag: string;
  readonly tone: "destructive" | "warning" | "success";
  readonly headline: string;
  readonly description: string;
  readonly platformSupport: readonly string[];
  readonly legalNote: string;
  readonly sourceUrl: string;
}

export const NR28_UFIR_UNIT_VALUE = 1.0641;
export const NR28_UFIR_UNIT_BRL = "R$ 1,0641";

/**
 * Faixas oficiais da NR-28 (Anexo I — Segurança do Trabalho, Tipo S, Grau 4)
 * utilizadas na comparação dinâmica por porte no Simulador de Custos.
 */
export const NR28_GRADE4_BY_HEADCOUNT: readonly Nr28HeadcountBracket[] = [
  {
    id: "g4-1-10",
    minEmployees: 1,
    maxEmployees: 10,
    label: "1 a 10 empregados",
    minUfir: 2252,
    maxUfir: 2681,
    minBrl: 2396.35,
    maxBrl: 2852.85,
  },
  {
    id: "g4-11-25",
    minEmployees: 11,
    maxEmployees: 25,
    label: "11 a 25 empregados",
    minUfir: 2681,
    maxUfir: 3112,
    minBrl: 2852.85,
    maxBrl: 3311.48,
  },
  {
    id: "g4-26-50",
    minEmployees: 26,
    maxEmployees: 50,
    label: "26 a 50 empregados",
    minUfir: 3112,
    maxUfir: 3575,
    minBrl: 3311.48,
    maxBrl: 3804.16,
  },
  {
    id: "g4-51-100",
    minEmployees: 51,
    maxEmployees: 100,
    label: "51 a 100 empregados",
    minUfir: 3575,
    maxUfir: 4041,
    minBrl: 3804.16,
    maxBrl: 4300.03,
  },
  {
    id: "g4-101-250",
    minEmployees: 101,
    maxEmployees: 250,
    label: "101 a 250 empregados",
    minUfir: 4041,
    maxUfir: 4504,
    minBrl: 4300.03,
    maxBrl: 4792.71,
  },
  {
    id: "g4-251-500",
    minEmployees: 251,
    maxEmployees: 500,
    label: "251 a 500 empregados",
    minUfir: 4504,
    maxUfir: 5014,
    minBrl: 4792.71,
    maxBrl: 5335.4,
  },
  {
    id: "g4-501-1000",
    minEmployees: 501,
    maxEmployees: 1000,
    label: "501 a 1.000 empregados",
    minUfir: 5014,
    maxUfir: 5663,
    minBrl: 5335.4,
    maxBrl: 6026.0,
  },
  {
    id: "g4-over-1000",
    minEmployees: 1001,
    maxEmployees: null,
    label: "Mais de 1.000 empregados",
    minUfir: 5663,
    maxUfir: 6304,
    minBrl: 6026.0,
    maxBrl: 6708.09,
  },
] as const;

export function getNr28Grade4BracketByHeadcount(employees: number): Nr28HeadcountBracket {
  const safeCount = Math.max(1, Math.round(employees));
  return (
    NR28_GRADE4_BY_HEADCOUNT.find(
      (b) => safeCount >= b.minEmployees && (b.maxEmployees === null || safeCount <= b.maxEmployees),
    ) ?? NR28_GRADE4_BY_HEADCOUNT[NR28_GRADE4_BY_HEADCOUNT.length - 1]
  );
}

export const NR28_FINE_BRACKETS: readonly Nr28FineBracket[] = [
  {
    id: "seguranca-pme",
    category: "Segurança do Trabalho (Tipo S · GRO/PGR)",
    normBasis: "NR-28 · Anexos I e II",
    degree: "Grau 4 · 1 a 10 empregados",
    ufirRange: "2.252 a 2.681 UFIR",
    brlRange: "R$ 2.396,35 a R$ 2.852,85",
    minBrl: 2396.35,
    maxBrl: 2852.85,
    severityRatio: 43,
    note: "Faixa inicial para infrações estruturais de grau máximo em microempresas.",
  },
  {
    id: "seguranca-media",
    category: "Segurança do Trabalho (Tipo S · GRO/PGR)",
    normBasis: "NR-28 · Anexos I e II",
    degree: "Grau 4 · 101 a 250 empregados",
    ufirRange: "4.041 a 4.504 UFIR",
    brlRange: "R$ 4.300,03 a R$ 4.792,71",
    minBrl: 4300.03,
    maxBrl: 4792.71,
    severityRatio: 71,
    note: "Gradação intermediária aplicada por auto de infração identificado em auditoria.",
  },
  {
    id: "seguranca-teto",
    category: "Segurança do Trabalho (Tipo S · Teto / Reincidência)",
    normBasis: "NR-28 · Art. 201 CLT",
    degree: "Grau 4 · >1.000 empregados ou reincidência",
    ufirRange: "6.304 UFIR (teto por auto)",
    brlRange: "R$ 6.708,09 por infração",
    minBrl: 6708.09,
    maxBrl: 6708.09,
    isSingleCeiling: true,
    isCeiling: true,
    severityRatio: 100,
    note: "Aplicável diretamente no teto em casos de reincidência, embaraço ou resistência à fiscalização.",
  },
  {
    id: "medicina-teto",
    category: "Medicina do Trabalho (Tipo M · Integração PCMSO/NR-7)",
    normBasis: "NR-28 · Art. 201 CLT",
    degree: "Grau 4 · Teto / Reincidência",
    ufirRange: "3.782 UFIR (teto por auto)",
    brlRange: "R$ 4.024,43 por infração",
    minBrl: 4024.43,
    maxBrl: 4024.43,
    isSingleCeiling: true,
    severityRatio: 60,
    note: "Falhas de integração entre inventário de riscos psicossociais do PGR e monitoramento do PCMSO.",
  },
] as const;

export const NR28_CASCADE_IMPACTS: readonly Nr28CascadeFactor[] = [
  {
    id: "acumulo-autos",
    indexLabel: "01",
    title: "Autuações Cumulativas por Item e Unidade",
    metricTag: "Por estabelecimento",
    description:
      "Cada não conformidade distinta — ausência de inventário psicossocial, falta de plano de ação, ausência de participação de trabalhadores/CIPA ou descompasso PGR-PCMSO — pode gerar um auto independente.",
    legalBasis: "NR-28 · Portaria MTE nº 1.758/2026 (Anexo II)",
  },
  {
    id: "fap-rat",
    indexLabel: "02",
    title: "Majoração do FAP e Alíquota RAT/SAT sobre a Folha",
    metricTag: "FAP 0,50 a 2,00",
    description:
      "Afastamentos previdenciários vinculados a estresse crônico e saúde mental elevam o Fator Acidentário de Prevenção, podendo dobrar a contribuição RAT sobre toda a massa salarial da organização.",
    legalBasis: "Decreto nº 3.048/1999 · Metodologia FAP/MPS",
  },
  {
    id: "passivo-inss",
    indexLabel: "03",
    title: "Ações Regressivas do INSS e Passivo Trabalhista",
    metricTag: "Risco jurídico",
    description:
      "Sem trilha auditável de prevenção e medidas organizacionais no PGR, aumentam a vulnerabilidade em ações indenizatórias, estabilidade acidentária de 12 meses e cobranças regressivas do INSS.",
    legalBasis: "Lei nº 8.213/1991 (Art. 120) · CLT",
  },
  {
    id: "embargo-interdicao",
    indexLabel: "04",
    title: "Embargos, Interdições e Termos de Ajuste (TAC)",
    metricTag: "Paralisação / MPT",
    description:
      "Quadros de risco grave e iminente ou denúncias recorrentes de assédio e sobrecarga extrema podem acionar fiscalização conjunta com o Ministério Público do Trabalho e medidas restritivas.",
    legalBasis: "NR-3 · NR-28 · Atuação MPT",
  },
] as const;

export const HOME_WITHOUT_VS_WITH = {
  without: [
    "Fatores psicossociais dispersos em planilhas, pesquisas de clima isoladas e relatos informais",
    "Treinamentos pontuais (ex.: palestras de SIPAT) sem transferência para a rotina de trabalho",
    "Planos de ação desconectados dos 12 drivers organizacionais e sem responsáveis rastreáveis",
    "Documentação frágil diante de auditorias internas, CIPA, SESMT ou inspeção da NR-1 / NR-28",
    "Aumento silencioso de turnover, absenteísmo, presenteísmo e pressão sobre o FAP",
  ],
  with: [
    "Leitura estruturada de fatores psicossociais com proteção de privacidade coletiva (k ≥ 5)",
    "Ciência do Bem-Estar no Trabalho aplicada em 12 drivers e 12 dinâmicas pedagógicas com IA",
    "Hierarquia de controles organizacionais traduzida em planos de ação, donos, prazos e evidências",
    "Dossiê preliminar versionado e exportável para revisão técnica de SST/RH e governança do GRO/PGR",
    "Base documental organizada para evolução rumo à Lei 14.831/2024 (sem garantir certificação automática)",
  ],
} as const;

export const HOME_REGULATORY_PULSE_SUMMARY: readonly HomeRegulatoryPulseCard[] = [
  {
    id: "nr1",
    name: "NR-1 · GRO / PGR",
    tag: "Obrigação vigente · 26/05/2026",
    tone: "destructive",
    headline: "Riscos psicossociais no inventário do PGR",
    description:
      "Portarias MTE nº 1.419/2024 e nº 765/2025 exigem identificar, avaliar e controlar fatores psicossociais ligados à organização do trabalho dentro do ciclo contínuo do GRO.",
    platformSupport: [
      "Tradução de sinais coletivos (k ≥ 5) para fatores de risco psicossocial",
      "Integração estruturada com AEP/AET, planos de ação e controles organizacionais",
      "Documentos preliminares versionados para revisão do responsável técnico",
    ],
    legalNote: "A plataforma apoia a estruturação de evidências; não substitui o responsável técnico de SST nem garante conformidade automática.",
    sourceUrl:
      "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadoras-vigentes/nr-1",
  },
  {
    id: "nr28",
    name: "NR-28 · Fiscalização e Penalidades",
    tag: "Exposição fiscal · Portaria MTE nº 1.758/2026",
    tone: "warning",
    headline: "Gradação por porte, grau e acúmulo de autos",
    description:
      "Define os critérios de autuação da inspeção do trabalho em UFIR (Anexos I e II), diferenciando Segurança (Tipo S) e Medicina (Tipo M) com agravamento em reincidência.",
    platformSupport: [
      "Trilha de evidências datadas de escuta, ações preventivas e capacitações",
      "Rastreabilidade entre risco identificado, controle aplicado e reavaliação",
      "Exportação executiva para auditoria interna, CIPA e governança",
    ],
    legalNote: "Valores exatos dependem do porte, grau e enquadramento fiscal da auditoria; sujeito à validação jurídica e técnica.",
    sourceUrl:
      "https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadoras-vigentes/norma-regulamentadora-no-28-nr-28",
  },
  {
    id: "lei14831",
    name: "Lei nº 14.831/2024",
    tag: "Oportunidade estratégica · Marca empregadora",
    tone: "success",
    headline: "Certificado Empresa Promotora da Saúde Mental",
    description:
      "Reconhece organizações que adotam políticas consistentes de promoção da saúde mental e bem-estar no trabalho, convertendo cuidado estruturado em reputação e retenção.",
    platformSupport: [
      "Programa estruturado nos 12 drivers de bem-estar no trabalho",
      "Trilhas de aprendizagem contínua para lideranças e equipes",
      "Relatórios preliminares de governança e engajamento para revisão competente",
    ],
    legalNote: "Certificação voluntária concedida por comissão certificadora; a plataforma organiza evidências sem garantir o selo.",
    sourceUrl: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14831.htm",
  },
] as const;

export const HOME_90_DAY_BRIDGE = [
  {
    step: "01",
    window: "Dias 1–30",
    label: "Prontidão & Contexto",
    text: "Mapeamento de escopo, unidades/GHE, papéis (RH, SST, CIPA, liderança) e lacunas de evidência existentes.",
  },
  {
    step: "02",
    window: "Dias 31–60",
    label: "Demonstração & Escuta Protegida",
    text: "Validação da jornada medir → educar → agir em ambiente sintético e preparação de governança antes de qualquer coleta real.",
  },
  {
    step: "03",
    window: "Dias 61–90",
    label: "Roadmap Auditável & Ciclos",
    text: "Priorização de controles organizacionais, trilhas dos 12 drivers, critérios de aceite e revisão técnica contínua.",
  },
] as const;
