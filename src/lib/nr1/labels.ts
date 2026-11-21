/**
 * NR-1 / COPSOQ — Terminologia em português brasileiro
 * Mapeia chaves técnicas (dimensões COPSOQ, drivers Playbook, fatores MTE,
 * campos de catálogo, severidade/probabilidade) para rótulos institucionais.
 *
 * Regra de produto: o usuário final lê PT-BR técnico premium. Chaves internas
 * permanecem em inglês no código/banco.
 */

export type Locale = "pt-BR" | "en-US";
export const DEFAULT_LOCALE: Locale = "pt-BR";

// -------- COPSOQ Dimensions --------
const DIMENSION_LABELS: Record<string, { "pt-BR": string; "en-US": string }> = {
  demands_quant:       { "pt-BR": "Exigências quantitativas",  "en-US": "Quantitative demands" },
  quantitative_demands:{ "pt-BR": "Exigências quantitativas",  "en-US": "Quantitative demands" },
  workload:            { "pt-BR": "Sobrecarga e ritmo de trabalho", "en-US": "Workload & pace" },
  workload_pressures:  { "pt-BR": "Pressões de carga de trabalho", "en-US": "Workload pressures" },
  demands_emotional:   { "pt-BR": "Exigências emocionais",      "en-US": "Emotional demands" },
  emotional_demands:   { "pt-BR": "Exigências emocionais",      "en-US": "Emotional demands" },
  work_pace:           { "pt-BR": "Ritmo de trabalho",          "en-US": "Work pace" },
  influence:           { "pt-BR": "Influência no trabalho",     "en-US": "Influence at work" },
  influence_at_work:   { "pt-BR": "Influência no trabalho",     "en-US": "Influence at work" },
  autonomy:            { "pt-BR": "Autonomia e controle",       "en-US": "Autonomy & control" },
  meaning:             { "pt-BR": "Sentido do trabalho",        "en-US": "Meaning of work" },
  meaning_of_work:     { "pt-BR": "Sentido do trabalho",        "en-US": "Meaning of work" },
  predictability:      { "pt-BR": "Previsibilidade",            "en-US": "Predictability" },
  recognition:         { "pt-BR": "Reconhecimento",             "en-US": "Recognition" },
  role_clarity:        { "pt-BR": "Clareza de papel",           "en-US": "Role clarity" },
  role_conflicts:      { "pt-BR": "Conflito de papel",          "en-US": "Role conflicts" },
  leadership_quality:  { "pt-BR": "Qualidade da liderança",     "en-US": "Leadership quality" },
  management:          { "pt-BR": "Gestão e liderança",         "en-US": "Management & leadership" },
  social_support:      { "pt-BR": "Apoio social",               "en-US": "Social support" },
  support:             { "pt-BR": "Apoio social e da liderança","en-US": "Social & managerial support" },
  social_support_supervisors: { "pt-BR": "Apoio social de superiores", "en-US": "Social support from supervisors" },
  social_support_colleagues:  { "pt-BR": "Apoio social de colegas",    "en-US": "Social support from colleagues" },
  community:           { "pt-BR": "Comunidade no trabalho",     "en-US": "Sense of community" },
  social_community_at_work: { "pt-BR": "Comunidade social no trabalho", "en-US": "Social community at work" },
  insecurity:          { "pt-BR": "Insegurança laboral",        "en-US": "Job insecurity" },
  job_insecurity:      { "pt-BR": "Insegurança laboral",        "en-US": "Job insecurity" },
  job_security:        { "pt-BR": "Segurança e previsibilidade no trabalho", "en-US": "Job security & predictability" },
  work_life_balance:   { "pt-BR": "Equilíbrio trabalho-vida",   "en-US": "Work-life balance" },
  work_family_conflict:{ "pt-BR": "Conflito trabalho-família",  "en-US": "Work-family conflict" },
  // dimensões estendidas (referenciadas pelo crosswalk)
  offensive_behaviours:    { "pt-BR": "Comportamentos ofensivos",   "en-US": "Offensive behaviours" },
  offensive_behaviors:     { "pt-BR": "Comportamentos ofensivos",   "en-US": "Offensive behaviors" },
  conflicts:               { "pt-BR": "Conflitos no trabalho",      "en-US": "Conflicts at work" },
  justice_respect:         { "pt-BR": "Justiça e respeito",         "en-US": "Justice & respect" },
  justice_and_respect:     { "pt-BR": "Justiça e respeito",         "en-US": "Justice & respect" },
  justice_trust:           { "pt-BR": "Justiça organizacional e confiança", "en-US": "Organizational justice & trust" },
  vertical_trust:          { "pt-BR": "Confiança vertical",         "en-US": "Vertical trust" },
  horizontal_trust:        { "pt-BR": "Confiança horizontal",       "en-US": "Horizontal trust" },
  trust:                   { "pt-BR": "Confiança e segurança psicológica", "en-US": "Trust & psychological safety" },
  possibilities_development:{ "pt-BR": "Possibilidades de desenvolvimento", "en-US": "Possibilities for development" },
  possibilities_for_development:{ "pt-BR": "Possibilidades de desenvolvimento", "en-US": "Possibilities for development" },
  job_satisfaction:        { "pt-BR": "Satisfação no trabalho",     "en-US": "Job satisfaction" },
  burnout:                 { "pt-BR": "Burnout (sinal agregado)",   "en-US": "Burnout (signal)" },
  stress_at_work:          { "pt-BR": "Estresse no trabalho",       "en-US": "Stress at work" },
};

// -------- Playbook Drivers (Oxford Work Wellbeing) --------
const DRIVER_LABELS: Record<string, { "pt-BR": string; "en-US": string }> = {
  stress:               { "pt-BR": "Estresse & Carga",        "en-US": "Stress" },
  energy:               { "pt-BR": "Energia & Recuperação",   "en-US": "Energy" },
  flexibility:          { "pt-BR": "Flexibilidade",           "en-US": "Flexibility" },
  management:           { "pt-BR": "Gestão & Liderança",      "en-US": "Management" },
  achievement:          { "pt-BR": "Realização",              "en-US": "Achievement" },
  purpose:              { "pt-BR": "Propósito & Sentido",     "en-US": "Purpose" },
  support:              { "pt-BR": "Suporte & Recursos",      "en-US": "Support" },
  appreciation:         { "pt-BR": "Reconhecimento",          "en-US": "Appreciation" },
  inclusion_belonging:  { "pt-BR": "Inclusão e pertencimento","en-US": "Inclusion & belonging" },
  compensation:         { "pt-BR": "Remuneração & Justiça",   "en-US": "Compensation" },
  trust:                { "pt-BR": "Confiança",               "en-US": "Trust" },
  learning:             { "pt-BR": "Aprendizagem",            "en-US": "Learning" },
  autonomy:             { "pt-BR": "Autonomia",               "en-US": "Autonomy" },
  employee_voice:       { "pt-BR": "Voz do Trabalhador",      "en-US": "Employee voice" },
  job_security:         { "pt-BR": "Segurança no Trabalho",   "en-US": "Job security" },
  workload_pressures:   { "pt-BR": "Pressões de Carga",       "en-US": "Workload pressures" },
};

// -------- Severity / Probability scales (AIHA 5×5) --------
export const SEVERITY_LABEL: Record<number, string> = {
  1: "Negligenciável",
  2: "Menor",
  3: "Moderada",
  4: "Séria",
  5: "Catastrófica",
};
export const PROBABILITY_LABEL: Record<number, string> = {
  1: "Raro (<20%)",
  2: "Improvável (20–39%)",
  3: "Possível (40–59%)",
  4: "Provável (60–79%)",
  5: "Quase certo (≥80%)",
};

export function riskBand(level: number): "trivial" | "baixo" | "moderado" | "alto" | "critico" {
  if (level >= 20) return "critico";
  if (level >= 15) return "alto";
  if (level >= 10) return "moderado";
  if (level >= 5) return "baixo";
  return "trivial";
}
export const RISK_BAND_LABEL: Record<ReturnType<typeof riskBand>, string> = {
  trivial: "Trivial",
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Alto",
  critico: "Crítico",
};

// -------- Technical catalog fields --------
const FIELD_LABELS: Record<string, string> = {
  dimension_key: "Chave técnica da dimensão",
  dimension_label: "Dimensão avaliada",
  mte_factor_code: "Código do fator MTE",
  mte_factor_label: "Fator psicossocial relacionado",
  playbook_drivers: "Direcionadores do Playbook",
  driver_weights: "Pesos dos direcionadores",
  default_severity: "Severidade padrão",
  evidence_level: "Nível de evidência",
  intervention_logic: "Lógica de intervenção",
  recommended_interventions: "Intervenções recomendadas",
  priority_rule: "Regra de priorização",
  source_refs: "Fontes e referências",
  limitations: "Limitações técnicas",
};

export const EVIDENCE_LABEL: Record<string, string> = {
  critical: "Crítica",
  strong: "Forte",
  moderate_strong: "Moderada–Forte",
  moderate: "Moderada",
  emerging: "Emergente",
};

// -------- Public helpers --------
function pick(map: Record<string, { "pt-BR": string; "en-US": string }>, key: string | null | undefined, locale: Locale, bilingual = false) {
  if (!key) return "—";
  const entry = map[key];
  if (!entry) return humanize(key);
  if (bilingual && locale === "pt-BR" && entry["en-US"] && entry["en-US"] !== entry["pt-BR"]) {
    return `${entry["pt-BR"]} (${entry["en-US"]})`;
  }
  return entry[locale] ?? entry["pt-BR"];
}

function humanize(key: string | null | undefined) {
  if (!key || typeof key !== "string") return "—";
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getDimensionLabel(key: string | null | undefined, locale: Locale = DEFAULT_LOCALE, bilingual = false) {
  return pick(DIMENSION_LABELS, key, locale, bilingual);
}
export function getDriverLabel(key: string | null | undefined, locale: Locale = DEFAULT_LOCALE, bilingual = false) {
  return pick(DRIVER_LABELS, key, locale, bilingual);
}
export function getTechnicalFieldLabel(key: string | null | undefined) {
  if (!key) return "—";
  return FIELD_LABELS[key] ?? humanize(key);
}
export function getEvidenceLabel(level: string | null | undefined) {
  if (!level) return "Não cadastrada";
  return EVIDENCE_LABEL[level] ?? humanize(level);
}
