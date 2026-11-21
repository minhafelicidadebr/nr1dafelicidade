// REFERÊNCIA ESTRUTURAL E AUDITORIA TÉCNICA — MANUAL COPSOQ II PORTUGAL 2013 (SILVA ET AL., FCT / UNIV. AVEIRO)
// Versão Curta Oficial: 41 questões distribuídas em 26 subescalas e 8 dimensões principais.
// Cotação fator a fator por média aritmética (1,00 a 5,00) e divisão em tercis (2,33 e 3,66) — Modelo Tricolor (Verde / Amarelo / Vermelho).
// Preserva todos os exports legados para retrocompatibilidade integral com páginas e testes existentes.
// Governança Fable 5: Permanece bloqueado para campanha real até aprovação formal no Gate G3 (realDataAllowed = false).

export type CopsoqScale =
  | "demands_quant"
  | "demands_emotional"
  | "work_pace"
  | "influence"
  | "meaning"
  | "predictability"
  | "recognition"
  | "role_clarity"
  | "leadership_quality"
  | "social_support"
  | "community"
  | "insecurity";

export type CopsoqOutcome =
  | "health_general"
  | "work_family_conflict"
  | "sleep_problems"
  | "burnout"
  | "stress"
  | "offensive_behaviors";

export type CopsoqShortMainDimensionId =
  | "exigencias_laborais"
  | "organizacao_conteudo"
  | "relacoes_sociais_lideranca"
  | "interface_trabalho_individuo"
  | "valores_local_trabalho"
  | "personalidade"
  | "saude_bem_estar"
  | "comportamentos_ofensivos";

export type CopsoqShortSubscaleId =
  | "exigencias_quantitativas"
  | "ritmo_trabalho"
  | "exigencias_cognitivas"
  | "exigencias_emocionais"
  | "influencia_trabalho"
  | "possibilidades_desenvolvimento"
  | "significado_trabalho"
  | "compromisso_local_trabalho"
  | "previsibilidade"
  | "transparencia_papel"
  | "recompensas_reconhecimento"
  | "apoio_social_superiores"
  | "comunidade_social_trabalho"
  | "qualidade_lideranca"
  | "satisfacao_trabalho"
  | "inseguranca_laboral"
  | "conflito_trabalho_familia"
  | "confianca_vertical"
  | "justica_respeito"
  | "auto_eficacia"
  | "saude_geral"
  | "problemas_sono"
  | "burnout"
  | "stress"
  | "insultos_provocacoes_verbais"
  | "assedio_ameacas_violencia";

export type CopsoqHealthPolarity = "protective" | "risk_exposure";
export type CopsoqTertileBand = "verde" | "amarelo" | "vermelho";

export type ScaleType = "freq" | "intensity" | "health";

export interface CopsoqItem {
  id: string; // "I1"..."I41"
  n: number; // numeração original do manual (1..41)
  text: string;
  type: ScaleType;
  dim?: CopsoqScale; // dimensão psicossocial legada (itens 1-28)
  outcome?: CopsoqOutcome; // desfecho legado (itens 29-41)
  officialSubscaleId: CopsoqShortSubscaleId; // subescala oficial das 26 da Versão Curta
  officialMainDimensionId: CopsoqShortMainDimensionId; // dimensão principal oficial (Tabela 1, p. 12-13)
  polarity: CopsoqHealthPolarity; // protective (alto = favorável) | risk_exposure (alto = risco)
  reverse?: boolean; // true = alto valor é favorável → invertemos p/ "carga" legada
  section: string;
}

export interface CopsoqOfficialSubscaleSpec {
  readonly subscaleId: CopsoqShortSubscaleId;
  readonly order: number;
  readonly label: string;
  readonly mainDimensionId: CopsoqShortMainDimensionId;
  readonly mainDimensionLabel: string;
  readonly itemIds: readonly string[];
  readonly itemNumbers: readonly number[];
  readonly polarity: CopsoqHealthPolarity;
  readonly manualPageRef: string;
  readonly interpretationRule: string;
}

export interface CopsoqOfficialSubscaleResult {
  readonly subscaleId: CopsoqShortSubscaleId;
  readonly order: number;
  readonly label: string;
  readonly mainDimensionId: CopsoqShortMainDimensionId;
  readonly mainDimensionLabel: string;
  readonly itemIds: readonly string[];
  readonly polarity: CopsoqHealthPolarity;
  readonly meanScore: number; // 1.00 .. 5.00
  readonly tertileBand: CopsoqTertileBand; // verde | amarelo | vermelho
  readonly healthStatusLabel: string;
  readonly requiresPreventiveAction: boolean;
}

export const COPSOQ_TERTILE_LOW_CUTOFF = 2.33 as const;
export const COPSOQ_TERTILE_HIGH_CUTOFF = 3.66 as const;

// Escalas 1..5 conforme Manual COPSOQ II Portugal 2013 (Anexo Versão Curta, p. 27-29).
export const SCALE_FREQ = [
  { v: 1, label: "Nunca / quase nunca" },
  { v: 2, label: "Raramente" },
  { v: 3, label: "Às vezes" },
  { v: 4, label: "Frequentemente" },
  { v: 5, label: "Sempre" },
];
export const SCALE_INTENSITY = [
  { v: 1, label: "Nada / quase nada" },
  { v: 2, label: "Um pouco" },
  { v: 3, label: "Moderadamente" },
  { v: 4, label: "Muito" },
  { v: 5, label: "Extremamente" },
];
export const SCALE_HEALTH = [
  { v: 1, label: "Deficitária" },
  { v: 2, label: "Razoável" },
  { v: 3, label: "Boa" },
  { v: 4, label: "Muito boa" },
  { v: 5, label: "Excelente" },
];

export function scaleFor(t: ScaleType) {
  if (t === "intensity") return SCALE_INTENSITY;
  if (t === "health") return SCALE_HEALTH;
  return SCALE_FREQ;
}

// Retrocompat: alguns componentes ainda importam LIKERT
export const LIKERT = SCALE_FREQ;

const S_TRAB = "O seu trabalho";
const S_LOCAL = "Local de trabalho e gestão";
const S_CHEFIA = "Em relação à sua chefia directa";
const S_VIDA = "Significado, satisfação e trabalho-vida";
const S_SAUDE = "Saúde e bem-estar (últimas 4 semanas)";
const S_OFFENSE = "Comportamentos ofensivos (últimos 12 meses)";

// 41 itens da Versão Curta Portuguesa (Silva et al., 2013, p. 27-29) mapeados nas 26 subescalas oficiais.
export const copsoqItems: CopsoqItem[] = [
  // Exigências laborais
  { id: "I1", n: 1, text: "A sua carga de trabalho acumula-se por ser mal distribuída?", type: "freq", dim: "demands_quant", officialSubscaleId: "exigencias_quantitativas", officialMainDimensionId: "exigencias_laborais", polarity: "risk_exposure", section: S_TRAB },
  { id: "I2", n: 2, text: "Com que frequência não tem tempo para completar todas as tarefas do seu trabalho?", type: "freq", dim: "demands_quant", officialSubscaleId: "exigencias_quantitativas", officialMainDimensionId: "exigencias_laborais", polarity: "risk_exposure", section: S_TRAB },
  { id: "I3", n: 3, text: "Precisa trabalhar muito rapidamente?", type: "freq", dim: "work_pace", officialSubscaleId: "ritmo_trabalho", officialMainDimensionId: "exigencias_laborais", polarity: "risk_exposure", section: S_TRAB },
  { id: "I4", n: 4, text: "O seu trabalho exige a sua atenção constante?", type: "freq", dim: "demands_quant", officialSubscaleId: "exigencias_cognitivas", officialMainDimensionId: "exigencias_laborais", polarity: "risk_exposure", section: S_TRAB },
  { id: "I5", n: 5, text: "O seu trabalho exige que tome decisões difíceis?", type: "freq", dim: "demands_quant", officialSubscaleId: "exigencias_cognitivas", officialMainDimensionId: "exigencias_laborais", polarity: "risk_exposure", section: S_TRAB },
  { id: "I6", n: 6, text: "O seu trabalho exige emocionalmente de si?", type: "freq", dim: "demands_emotional", officialSubscaleId: "exigencias_emocionais", officialMainDimensionId: "exigencias_laborais", polarity: "risk_exposure", section: S_TRAB },
  // Organização do trabalho e conteúdo
  { id: "I7", n: 7, text: "Tem um elevado grau de influência no seu trabalho?", type: "freq", dim: "influence", officialSubscaleId: "influencia_trabalho", officialMainDimensionId: "organizacao_conteudo", polarity: "protective", reverse: true, section: S_TRAB },
  { id: "I8", n: 8, text: "O seu trabalho exige que tenha iniciativa?", type: "freq", dim: "influence", officialSubscaleId: "possibilidades_desenvolvimento", officialMainDimensionId: "organizacao_conteudo", polarity: "protective", reverse: true, section: S_TRAB },
  { id: "I9", n: 9, text: "O seu trabalho permite-lhe aprender coisas novas?", type: "freq", dim: "meaning", officialSubscaleId: "possibilidades_desenvolvimento", officialMainDimensionId: "organizacao_conteudo", polarity: "protective", reverse: true, section: S_TRAB },
  // Relações sociais, liderança e valores no local de trabalho
  { id: "I10", n: 10, text: "No seu local de trabalho, é informado com antecedência sobre decisões importantes, mudanças ou planos para o futuro?", type: "freq", dim: "predictability", officialSubscaleId: "previsibilidade", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I11", n: 11, text: "Recebe toda a informação de que necessita para fazer bem o seu trabalho?", type: "freq", dim: "predictability", officialSubscaleId: "previsibilidade", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I12", n: 12, text: "Sabe exactamente quais as suas responsabilidades?", type: "freq", dim: "role_clarity", officialSubscaleId: "transparencia_papel", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I13", n: 13, text: "O seu trabalho é reconhecido e apreciado pela gerência?", type: "freq", dim: "recognition", officialSubscaleId: "recompensas_reconhecimento", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I14", n: 14, text: "É tratado de forma justa no seu local de trabalho?", type: "freq", dim: "recognition", officialSubscaleId: "justica_respeito", officialMainDimensionId: "valores_local_trabalho", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I15", n: 15, text: "Com que frequência tem ajuda e apoio do seu superior imediato?", type: "freq", dim: "social_support", officialSubscaleId: "apoio_social_superiores", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I16", n: 16, text: "Existe um bom ambiente de trabalho entre si e os seus colegas?", type: "freq", dim: "community", officialSubscaleId: "comunidade_social_trabalho", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_LOCAL },
  { id: "I17", n: 17, text: "Oferece aos indivíduos e ao grupo boas oportunidades de desenvolvimento?", type: "freq", dim: "leadership_quality", officialSubscaleId: "qualidade_lideranca", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_CHEFIA },
  { id: "I18", n: 18, text: "É bom no planeamento do trabalho?", type: "freq", dim: "leadership_quality", officialSubscaleId: "qualidade_lideranca", officialMainDimensionId: "relacoes_sociais_lideranca", polarity: "protective", reverse: true, section: S_CHEFIA },
  { id: "I19", n: 19, text: "A gerência confia nos seus funcionários para fazerem o seu trabalho bem?", type: "freq", dim: "leadership_quality", officialSubscaleId: "confianca_vertical", officialMainDimensionId: "valores_local_trabalho", polarity: "protective", reverse: true, section: S_CHEFIA },
  { id: "I20", n: 20, text: "Confia na informação que lhe é transmitida pela gerência?", type: "freq", dim: "leadership_quality", officialSubscaleId: "confianca_vertical", officialMainDimensionId: "valores_local_trabalho", polarity: "protective", reverse: true, section: S_CHEFIA },
  { id: "I21", n: 21, text: "Os conflitos são resolvidos de uma forma justa?", type: "freq", dim: "recognition", officialSubscaleId: "justica_respeito", officialMainDimensionId: "valores_local_trabalho", polarity: "protective", reverse: true, section: S_CHEFIA },
  { id: "I22", n: 22, text: "O trabalho é igualmente distribuído pelos funcionários?", type: "freq", dim: "recognition", officialSubscaleId: "justica_respeito", officialMainDimensionId: "valores_local_trabalho", polarity: "protective", reverse: true, section: S_CHEFIA },
  // Personalidade (Auto-eficácia)
  { id: "I23", n: 23, text: "Sou sempre capaz de resolver problemas, se tentar o suficiente.", type: "freq", dim: "meaning", officialSubscaleId: "auto_eficacia", officialMainDimensionId: "personalidade", polarity: "protective", reverse: true, section: S_CHEFIA },
  // Significado, compromisso, satisfação, insegurança
  { id: "I24", n: 24, text: "O seu trabalho tem algum significado para si?", type: "intensity", dim: "meaning", officialSubscaleId: "significado_trabalho", officialMainDimensionId: "organizacao_conteudo", polarity: "protective", reverse: true, section: S_VIDA },
  { id: "I25", n: 25, text: "Sente que o seu trabalho é importante?", type: "intensity", dim: "meaning", officialSubscaleId: "significado_trabalho", officialMainDimensionId: "organizacao_conteudo", polarity: "protective", reverse: true, section: S_VIDA },
  { id: "I26", n: 26, text: "Sente que os problemas do seu local de trabalho são seus também?", type: "intensity", dim: "community", officialSubscaleId: "compromisso_local_trabalho", officialMainDimensionId: "organizacao_conteudo", polarity: "protective", reverse: true, section: S_VIDA },
  { id: "I27", n: 27, text: "Quão satisfeito está com o seu trabalho de uma forma global?", type: "intensity", dim: "meaning", officialSubscaleId: "satisfacao_trabalho", officialMainDimensionId: "interface_trabalho_individuo", polarity: "protective", reverse: true, section: S_VIDA },
  { id: "I28", n: 28, text: "Sente-se preocupado em ficar desempregado?", type: "intensity", dim: "insecurity", officialSubscaleId: "inseguranca_laboral", officialMainDimensionId: "interface_trabalho_individuo", polarity: "risk_exposure", section: S_VIDA },
  // Saúde geral e bem-estar
  { id: "I29", n: 29, text: "Em geral, sente que a sua saúde é:", type: "health", outcome: "health_general", officialSubscaleId: "saude_geral", officialMainDimensionId: "saude_bem_estar", polarity: "protective", reverse: true, section: S_SAUDE },
  // Conflito trabalho-família
  { id: "I30", n: 30, text: "Sente que o seu trabalho lhe exige muita energia que acaba por afectar a sua vida privada negativamente?", type: "intensity", outcome: "work_family_conflict", officialSubscaleId: "conflito_trabalho_familia", officialMainDimensionId: "interface_trabalho_individuo", polarity: "risk_exposure", section: S_SAUDE },
  { id: "I31", n: 31, text: "Sente que o seu trabalho lhe exige muito tempo que acaba por afectar a sua vida privada negativamente?", type: "intensity", outcome: "work_family_conflict", officialSubscaleId: "conflito_trabalho_familia", officialMainDimensionId: "interface_trabalho_individuo", polarity: "risk_exposure", section: S_SAUDE },
  // Sono, burnout, stress (últimas 4 semanas)
  { id: "I32", n: 32, text: "Acordou várias vezes durante a noite e depois não conseguia adormecer novamente?", type: "freq", outcome: "sleep_problems", officialSubscaleId: "problemas_sono", officialMainDimensionId: "saude_bem_estar", polarity: "risk_exposure", section: S_SAUDE },
  { id: "I33", n: 33, text: "Fisicamente exausto?", type: "freq", outcome: "burnout", officialSubscaleId: "burnout", officialMainDimensionId: "saude_bem_estar", polarity: "risk_exposure", section: S_SAUDE },
  { id: "I34", n: 34, text: "Emocionalmente exausto?", type: "freq", outcome: "burnout", officialSubscaleId: "burnout", officialMainDimensionId: "saude_bem_estar", polarity: "risk_exposure", section: S_SAUDE },
  { id: "I35", n: 35, text: "Irritado?", type: "freq", outcome: "stress", officialSubscaleId: "stress", officialMainDimensionId: "saude_bem_estar", polarity: "risk_exposure", section: S_SAUDE },
  { id: "I36", n: 36, text: "Ansioso?", type: "freq", outcome: "stress", officialSubscaleId: "stress", officialMainDimensionId: "saude_bem_estar", polarity: "risk_exposure", section: S_SAUDE },
  { id: "I37", n: 37, text: "Triste?", type: "freq", outcome: "stress", officialSubscaleId: "stress", officialMainDimensionId: "saude_bem_estar", polarity: "risk_exposure", section: S_SAUDE },
  // Comportamentos ofensivos (últimos 12 meses no local de trabalho)
  { id: "I38", n: 38, text: "Tem sido alvo de insultos ou provocações verbais?", type: "freq", outcome: "offensive_behaviors", officialSubscaleId: "insultos_provocacoes_verbais", officialMainDimensionId: "comportamentos_ofensivos", polarity: "risk_exposure", section: S_OFFENSE },
  { id: "I39", n: 39, text: "Tem sido exposto a assédio sexual indesejado?", type: "freq", outcome: "offensive_behaviors", officialSubscaleId: "assedio_ameacas_violencia", officialMainDimensionId: "comportamentos_ofensivos", polarity: "risk_exposure", section: S_OFFENSE },
  { id: "I40", n: 40, text: "Tem sido exposto a ameaças de violência?", type: "freq", outcome: "offensive_behaviors", officialSubscaleId: "assedio_ameacas_violencia", officialMainDimensionId: "comportamentos_ofensivos", polarity: "risk_exposure", section: S_OFFENSE },
  { id: "I41", n: 41, text: "Tem sido exposto a violência física?", type: "freq", outcome: "offensive_behaviors", officialSubscaleId: "assedio_ameacas_violencia", officialMainDimensionId: "comportamentos_ofensivos", polarity: "risk_exposure", section: S_OFFENSE },
];

// Catálogo Oficial das 26 Subescalas da Versão Curta (41 questões) — Tabela 1 (p. 12-13) e Anexo (p. 27-29) do Manual COPSOQ II Portugal 2013
export const COPSOQ_OFFICIAL_SHORT_SUBSCALES: readonly CopsoqOfficialSubscaleSpec[] = [
  {
    subscaleId: "exigencias_quantitativas",
    order: 1,
    label: "Exigências quantitativas",
    mainDimensionId: "exigencias_laborais",
    mainDimensionLabel: "Exigências laborais",
    itemIds: ["I1", "I2"],
    itemNumbers: [1, 2],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Itens 1 e 2)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "ritmo_trabalho",
    order: 2,
    label: "Ritmo de trabalho",
    mainDimensionId: "exigencias_laborais",
    mainDimensionLabel: "Exigências laborais",
    itemIds: ["I3"],
    itemNumbers: [3],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 3)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "exigencias_cognitivas",
    order: 3,
    label: "Exigências cognitivas",
    mainDimensionId: "exigencias_laborais",
    mainDimensionLabel: "Exigências laborais",
    itemIds: ["I4", "I5"],
    itemNumbers: [4, 5],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Itens 4 e 5)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "exigencias_emocionais",
    order: 4,
    label: "Exigências emocionais",
    mainDimensionId: "exigencias_laborais",
    mainDimensionLabel: "Exigências laborais",
    itemIds: ["I6"],
    itemNumbers: [6],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 6)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "influencia_trabalho",
    order: 5,
    label: "Influência no trabalho",
    mainDimensionId: "organizacao_conteudo",
    mainDimensionLabel: "Organização do trabalho e conteúdo",
    itemIds: ["I7"],
    itemNumbers: [7],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 7)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "possibilidades_desenvolvimento",
    order: 6,
    label: "Possibilidades de desenvolvimento",
    mainDimensionId: "organizacao_conteudo",
    mainDimensionLabel: "Organização do trabalho e conteúdo",
    itemIds: ["I8", "I9"],
    itemNumbers: [8, 9],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Itens 8 e 9)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "significado_trabalho",
    order: 7,
    label: "Significado do trabalho",
    mainDimensionId: "organizacao_conteudo",
    mainDimensionLabel: "Organização do trabalho e conteúdo",
    itemIds: ["I24", "I25"],
    itemNumbers: [24, 25],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 28 (Itens 24 e 25)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "compromisso_local_trabalho",
    order: 8,
    label: "Compromisso face ao local de trabalho",
    mainDimensionId: "organizacao_conteudo",
    mainDimensionLabel: "Organização do trabalho e conteúdo",
    itemIds: ["I26"],
    itemNumbers: [26],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 28 (Item 26)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "previsibilidade",
    order: 9,
    label: "Previsibilidade",
    mainDimensionId: "relacoes_sociais_lideranca",
    mainDimensionLabel: "Relações sociais e liderança",
    itemIds: ["I10", "I11"],
    itemNumbers: [10, 11],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Itens 10 e 11)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "transparencia_papel",
    order: 10,
    label: "Transparência do papel laboral desempenhado",
    mainDimensionId: "relacoes_sociais_lideranca",
    mainDimensionLabel: "Relações sociais e liderança",
    itemIds: ["I12"],
    itemNumbers: [12],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 12)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "recompensas_reconhecimento",
    order: 11,
    label: "Recompensas (Reconhecimento)",
    mainDimensionId: "relacoes_sociais_lideranca",
    mainDimensionLabel: "Relações sociais e liderança",
    itemIds: ["I13"],
    itemNumbers: [13],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 13)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "apoio_social_superiores",
    order: 12,
    label: "Apoio social de superiores",
    mainDimensionId: "relacoes_sociais_lideranca",
    mainDimensionLabel: "Relações sociais e liderança",
    itemIds: ["I15"],
    itemNumbers: [15],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 15)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "comunidade_social_trabalho",
    order: 13,
    label: "Comunidade social no trabalho",
    mainDimensionId: "relacoes_sociais_lideranca",
    mainDimensionLabel: "Relações sociais e liderança",
    itemIds: ["I16"],
    itemNumbers: [16],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 27 (Item 16)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "qualidade_lideranca",
    order: 14,
    label: "Qualidade da liderança",
    mainDimensionId: "relacoes_sociais_lideranca",
    mainDimensionLabel: "Relações sociais e liderança",
    itemIds: ["I17", "I18"],
    itemNumbers: [17, 18],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 28 (Itens 17 e 18)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "satisfacao_trabalho",
    order: 15,
    label: "Satisfação no trabalho",
    mainDimensionId: "interface_trabalho_individuo",
    mainDimensionLabel: "Interface trabalho-indivíduo",
    itemIds: ["I27"],
    itemNumbers: [27],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 28 (Item 27)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "inseguranca_laboral",
    order: 16,
    label: "Insegurança laboral",
    mainDimensionId: "interface_trabalho_individuo",
    mainDimensionLabel: "Interface trabalho-indivíduo",
    itemIds: ["I28"],
    itemNumbers: [28],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 12; Anexo p. 28 (Item 28)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "conflito_trabalho_familia",
    order: 17,
    label: "Conflito trabalho-família",
    mainDimensionId: "interface_trabalho_individuo",
    mainDimensionLabel: "Interface trabalho-indivíduo",
    itemIds: ["I30", "I31"],
    itemNumbers: [30, 31],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 28 (Itens 30 e 31)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "confianca_vertical",
    order: 18,
    label: "Confiança vertical",
    mainDimensionId: "valores_local_trabalho",
    mainDimensionLabel: "Valores no local de trabalho",
    itemIds: ["I19", "I20"],
    itemNumbers: [19, 20],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 28 (Itens 19 e 20)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "justica_respeito",
    order: 19,
    label: "Justiça e respeito",
    mainDimensionId: "valores_local_trabalho",
    mainDimensionLabel: "Valores no local de trabalho",
    itemIds: ["I14", "I21", "I22"],
    itemNumbers: [14, 21, 22],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 27-28 (Itens 14, 21 e 22)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "auto_eficacia",
    order: 20,
    label: "Auto-eficácia",
    mainDimensionId: "personalidade",
    mainDimensionLabel: "Personalidade",
    itemIds: ["I23"],
    itemNumbers: [23],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 28 (Item 23)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "saude_geral",
    order: 21,
    label: "Saúde geral",
    mainDimensionId: "saude_bem_estar",
    mainDimensionLabel: "Saúde e bem-estar",
    itemIds: ["I29"],
    itemNumbers: [29],
    polarity: "protective",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 28 (Item 29)",
    interpretationRule: "Média > 3,66 = Verde (favorável); 2,33 a 3,66 = Amarelo; < 2,33 = Vermelho (risco)",
  },
  {
    subscaleId: "problemas_sono",
    order: 22,
    label: "Problemas em dormir",
    mainDimensionId: "saude_bem_estar",
    mainDimensionLabel: "Saúde e bem-estar",
    itemIds: ["I32"],
    itemNumbers: [32],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 29 (Item 32)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "burnout",
    order: 23,
    label: "Burnout",
    mainDimensionId: "saude_bem_estar",
    mainDimensionLabel: "Saúde e bem-estar",
    itemIds: ["I33", "I34"],
    itemNumbers: [33, 34],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 29 (Itens 33 e 34)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "stress",
    order: 24,
    label: "Stress",
    mainDimensionId: "saude_bem_estar",
    mainDimensionLabel: "Saúde e bem-estar",
    itemIds: ["I35", "I36", "I37"],
    itemNumbers: [35, 36, 37],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 29 (Itens 35, 36 e 37)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "insultos_provocacoes_verbais",
    order: 25,
    label: "Insultos ou provocações verbais (Bullying)",
    mainDimensionId: "comportamentos_ofensivos",
    mainDimensionLabel: "Comportamentos ofensivos",
    itemIds: ["I38"],
    itemNumbers: [38],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 29 (Item 38)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
  {
    subscaleId: "assedio_ameacas_violencia",
    order: 26,
    label: "Assédio sexual, ameaças de violência e violência física",
    mainDimensionId: "comportamentos_ofensivos",
    mainDimensionLabel: "Comportamentos ofensivos",
    itemIds: ["I39", "I40", "I41"],
    itemNumbers: [39, 40, 41],
    polarity: "risk_exposure",
    manualPageRef: "Tabela 1, p. 13; Anexo p. 29 (Itens 39, 40 e 41)",
    interpretationRule: "Média > 3,66 = Vermelho (risco); 2,33 a 3,66 = Amarelo; < 2,33 = Verde (favorável)",
  },
] as const;

/**
 * Classifica a média aritmética (1,00 a 5,00) nos tercis oficiais do Manual COPSOQ II Portugal 2013
 * (pontos de corte 2,33 e 3,66 — Modelo Tricolor / Semáforo, p. 11-12).
 */
export function evaluateCopsoqTertileBand(
  meanScore: number,
  polarity: CopsoqHealthPolarity,
): CopsoqTertileBand {
  if (polarity === "protective") {
    if (meanScore > COPSOQ_TERTILE_HIGH_CUTOFF) return "verde";
    if (meanScore >= COPSOQ_TERTILE_LOW_CUTOFF) return "amarelo";
    return "vermelho";
  }

  if (meanScore < COPSOQ_TERTILE_LOW_CUTOFF) return "verde";
  if (meanScore <= COPSOQ_TERTILE_HIGH_CUTOFF) return "amarelo";
  return "vermelho";
}

/**
 * Calcula os resultados oficiais das 26 subescalas da Versão Curta (41 questões)
 * seguindo estritamente a cotação por média (1,00 a 5,00) e os tercis 2,33 e 3,66.
 */
export function computeOfficialShortSubscales(
  answers: Readonly<Record<string, number>>,
): readonly CopsoqOfficialSubscaleResult[] {
  return COPSOQ_OFFICIAL_SHORT_SUBSCALES.map((spec) => {
    const rawValues = spec.itemIds
      .map((id) => answers[id])
      .filter((v): v is number => typeof v === "number" && v >= 1 && v <= 5);

    const meanScore =
      rawValues.length === 0
        ? 3.0
        : Math.round((rawValues.reduce((sum, v) => sum + v, 0) / rawValues.length) * 100) /
          100;

    const tertileBand = evaluateCopsoqTertileBand(meanScore, spec.polarity);
    const healthStatusLabel =
      tertileBand === "verde"
        ? "Situação favorável para a saúde (Tercil Verde)"
        : tertileBand === "amarelo"
          ? "Situação intermédia de alerta (Tercil Amarelo)"
          : "Risco para a saúde — exige intervenção preventiva (Tercil Vermelho)";

    return {
      subscaleId: spec.subscaleId,
      order: spec.order,
      label: spec.label,
      mainDimensionId: spec.mainDimensionId,
      mainDimensionLabel: spec.mainDimensionLabel,
      itemIds: spec.itemIds,
      polarity: spec.polarity,
      meanScore,
      tertileBand,
      healthStatusLabel,
      requiresPreventiveAction: tertileBand !== "verde",
    };
  });
}

// Retrocompat (componentes legados) — itens dimensionais com shape antigo
export interface CopsoqQuestion {
  id: string;
  scale: CopsoqScale;
  text: string;
  reverse?: boolean;
}
export const copsoqQuestions: CopsoqQuestion[] = copsoqItems
  .filter((i) => i.dim)
  .map((i) => ({ id: i.id, scale: i.dim!, text: i.text, reverse: i.reverse }));

export const DIM_LABELS: Record<CopsoqScale, string> = {
  demands_quant: "Exigências Quantitativas",
  demands_emotional: "Exigências Emocionais",
  work_pace: "Ritmo de Trabalho",
  influence: "Influência no Trabalho",
  meaning: "Sentido do Trabalho",
  predictability: "Previsibilidade",
  recognition: "Reconhecimento",
  role_clarity: "Clareza de Papel",
  leadership_quality: "Qualidade da Liderança",
  social_support: "Apoio Social",
  community: "Comunidade no Trabalho",
  insecurity: "Insegurança Laboral",
};

// Converte resposta 1..5 → 0..100, aplicando reverso quando alto = favorável.
// Resultado: SEMPRE "carga psicossocial" (alto = pior).
export function toLoad(raw: number, reverse?: boolean): number {
  const norm = ((raw - 1) / 4) * 100;
  return reverse ? 100 - norm : norm;
}

// Transformação exploratória legada. Não é scoring aprovado e seu uso
// organizacional permanece bloqueado pelo Instrument Registry.
export function aggregateDimensions(answers: Record<string, number>): Record<string, number> {
  const buckets: Record<string, number[]> = {};
  for (const it of copsoqItems) {
    if (!it.dim) continue;
    const raw = answers[it.id];
    if (raw === undefined) continue;
    (buckets[it.dim] ||= []).push(toLoad(raw, it.reverse));
  }
  const out: Record<string, number> = {};
  for (const k of Object.keys(buckets)) {
    const arr = buckets[k];
    out[k] = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
  }
  return out;
}

// Sumariza desfechos (saúde/burnout/stress/ofensas) p/ meta.outcomes.
export function summarizeOutcomes(answers: Record<string, number>) {
  const groups: Record<string, number[]> = {};
  for (const it of copsoqItems) {
    if (!it.outcome) continue;
    const raw = answers[it.id];
    if (raw === undefined) continue;
    (groups[it.outcome] ||= []).push(toLoad(raw, it.reverse));
  }
  const summary: Record<string, number> = {};
  for (const k of Object.keys(groups)) {
    const arr = groups[k];
    summary[k] = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
  }
  return summary;
}

// ----- Mapas e helpers legados (mantidos p/ não quebrar imports) -----
export interface DimensionScore {
  scale: CopsoqScale;
  label: string;
  score: number;
  mean1to5?: number;
  risk: "verde" | "amarelo" | "vermelho";
}

export const dimensionToDriver: Record<CopsoqScale, Record<string, number>> = {
  demands_quant: { stress: 1.0, energy: 0.7, flexibility: 0.4, management: 0.3 },
  demands_emotional: { stress: 0.8, support: 0.7, energy: 0.5, trust: 0.3 },
  work_pace: { stress: 0.9, energy: 0.6, management: 0.4, flexibility: 0.3 },
  influence: { flexibility: 0.9, purpose: 0.5, achievement: 0.5, learning: 0.4 },
  meaning: { purpose: 1.0, achievement: 0.5, learning: 0.3 },
  predictability: { management: 0.9, trust: 0.7, stress: 0.4 },
  recognition: { appreciation: 1.0, compensation: 0.6, trust: 0.5 },
  role_clarity: { management: 0.9, achievement: 0.7, learning: 0.3 },
  leadership_quality: { management: 1.0, trust: 0.7, support: 0.5 },
  social_support: { support: 1.0, trust: 0.5, inclusion_belonging: 0.5 },
  community: { inclusion_belonging: 1.0, trust: 0.6, support: 0.4 },
  insecurity: { compensation: 0.8, stress: 0.6, trust: 0.4 },
};

/**
 * Calcula scores dimensionais alinhando a classificação tricolor (verde | amarelo | vermelho)
 * exatamente aos tercis oficiais 2,33 e 3,66 do Manual COPSOQ II Portugal 2013 (fator a fator, 1..5).
 */
export function computeScores(answers: Record<string, number>): DimensionScore[] {
  const agg = aggregateDimensions(answers);
  return (Object.keys(DIM_LABELS) as CopsoqScale[]).map((scale) => {
    const scaleItems = copsoqItems.filter((item) => item.dim === scale);
    const rawValues = scaleItems
      .map((item) => answers[item.id])
      .filter((v): v is number => typeof v === "number" && v >= 1 && v <= 5);

    const polarity: CopsoqHealthPolarity = scaleItems.some((item) => item.reverse)
      ? "protective"
      : "risk_exposure";

    const mean1to5 =
      rawValues.length === 0
        ? 3.0
        : Math.round((rawValues.reduce((s, v) => s + v, 0) / rawValues.length) * 100) / 100;

    const score = agg[scale] ?? 0;
    const risk =
      rawValues.length > 0
        ? evaluateCopsoqTertileBand(mean1to5, polarity)
        : score >= 60
          ? "vermelho"
          : score >= 40
            ? "amarelo"
            : "verde";

    return { scale, label: DIM_LABELS[scale], score, mean1to5, risk };
  });
}

export function prioritizeDrivers(scores: DimensionScore[]): { driver: string; weight: number }[] {
  const driverScore: Record<string, number> = {};
  for (const s of scores) {
    const map = dimensionToDriver[s.scale];
    for (const [driver, w] of Object.entries(map)) {
      driverScore[driver] = (driverScore[driver] || 0) + (s.score / 100) * w;
    }
  }
  const max = Math.max(...Object.values(driverScore), 0.0001);
  return Object.entries(driverScore)
    .map(([driver, raw]) => ({ driver, weight: Math.round((raw / max) * 100) }))
    .sort((a, b) => b.weight - a.weight);
}
