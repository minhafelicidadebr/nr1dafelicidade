/**
 * Roteador determinístico de pergunta livre → intent do knowledgeBase.
 * Não usa LLM. Sem invenção de fonte.
 */
type Rule = { intent: string; keywords: RegExp };

const RULES: Rule[] = [
  // Página Principal — Benchmark NR-28 & Efeito Cascata
  { intent: "home.nr28_benchmark", keywords: /(nr.?28|multa|autua(ç|c)(ã|a)o|ufir|fap\b|rat\/?sat|regressiv.*inss|efeito\s+cascata|embargo|interdi(ç|c)(ã|a)o|1\.?758\/?2026)/i },

  // Página Principal — Simulador de Custos Organizacionais
  { intent: "home.cost_simulator", keywords: /(simulador|calculador|turnover|absente(í|i)sm|presente(í|i)sm|massa\s+salarial|custo\s+da\s+ina(ç|c)|resumo\s+executivo|sensibilidade|mitiga(ç|c)(ã|a)o)/i },

  // Página Principal — Ciência do Bem-Estar, 12 Drivers & Dinâmicas
  { intent: "home.wellbeing_science", keywords: /(ci(ê|e)ncia\s+do\s+bem.?estar|felicidade\s+no\s+trabalho|12\s+drivers?|12\s+din(â|a)mic|jd.?r|iso\s*45003|bem.?estar\s+no\s+trabalho)/i },

  // Página Principal — Pulso Regulatório & Lei 14.831/2024
  { intent: "home.regulatory_pulse", keywords: /(14\.?831|selo.*sa(ú|u)de\s+mental|empresa\s+promotora|pulso\s+regulat(ó|o)rio|vig(ê|e)ncia\s+nr.?1|26\/05\/2026)/i },

  // Página Principal — Plano de 90 Dias, Prontidão & Sem vs. Com
  { intent: "home.roadmap_90d", keywords: /(90\s+dias|prontid(ã|a)o|4\s+perguntas|sem\s+vs\.?\s+com|sem\s+a\s+plataforma|roadmap|para\s+quem\s+(é|e))/i },

  // Página Principal — Retorno / Diretoria / Conselho
  { intent: "home.roi", keywords: /(roi|4:1|conselho|diretoria|ebitda|cfo|justificar\s+or(ç|c)amento)/i },

  // Privacidade / k-anonimato
  { intent: "risk.k_anonymity", keywords: /(k.?anonim|anonim|privacid|lgpd|n\s*[<>=]\s*5|n.?mínim)/i },

  // Riscos / matriz AIHA
  { intent: "risk.severity_x_probability", keywords: /(aiha|matriz|severid|probabil|s\s*x\s*p|risco\s*=|banda|crític|moderad)/i },
  { intent: "risk.top3", keywords: /(top\s*3|prioriz(ar|ação)?\s+risc|riscos?\s+priorit|maior(es)?\s+risc|principais?\s+risc)/i },
  { intent: "risk.first_dimension", keywords: /(primeir[ao]\s+dimens|dimens(ão|ões)\s+priorit|por\s+onde\s+começar.*risc)/i },
  { intent: "risk.interventions", keywords: /(interven(ç|c)ões?|recomend(ações|ar)|playbook|o\s+que\s+fazer.*risc)/i },

  // Ações
  { intent: "actions.create_from_risk", keywords: /(criar\s+ação|primeir[ao]\s+ação|como\s+executar|plano\s+de\s+ação|nova\s+ação)/i },
  { intent: "actions.priority", keywords: /(prioriz(ar|ação)?\s+aç|qual\s+ação)/i },
  { intent: "actions.evidence", keywords: /(evidênci|comprov|anexo|prova\s+da\s+ação)/i },

  // Controles
  { intent: "controls.hierarchy", keywords: /(hierarqui|prim(á|a)ri[oa]|secund(á|a)ri[oa]|terci(á|a)ri[oa])/i },
  { intent: "controls.organizational", keywords: /(controles?\s+organizacion|governan|liderança|carreira|organiza(ção|cao)\s+do\s+trabalho)/i },
  { intent: "controls.efficacy", keywords: /(eficácia|efetiv|funcion(ou|a)|impacto\s+do\s+controle)/i },

  // Documentos
  { intent: "documents.drps", keywords: /(drps|diagnóstico|relatório\s+psicossocial)/i },
  { intent: "documents.review", keywords: /(revis(ão|ar)\s+t(é|e)cnica|sst|sesmt|responsável\s+t(é|e)cnico)/i },
  { intent: "documents.limits", keywords: /(limita(ç|c)|disclaimer|ressalv)/i },
  { intent: "documents.templates", keywords: /(consentiment|comunicad|pgr|gro|modelo|template|orientativ)/i },

  // Ciclos / Convites
  { intent: "cycles.k5_gap", keywords: /(faltam.*resposta|quantas\s+resposta|atingir\s+k|n\s*=\s*5)/i },
  { intent: "cycles.share_safely", keywords: /(convite|token|compartilh|qr|link)/i },
  { intent: "cycles.adesao", keywords: /(adesão|engajamento\s+do\s+ciclo|taxa\s+de\s+resposta)/i },

  // Unidades / Setores
  { intent: "units.organize", keywords: /(unidade|setor|recorte|filial|turno)/i },
  { intent: "units.anonymity", keywords: /(unidade\s+pequen|agregar\s+unidad)/i },

  // Empresa
  { intent: "company.structure", keywords: /(empresa|organograma|cnpj|raz(ã|a)o\s+social)/i },
];

export function routeFreeQuestion(question: string): string {
  const q = (question ?? "").trim();
  if (!q) return "__no_match__";
  for (const r of RULES) {
    if (r.keywords.test(q)) return r.intent;
  }
  return "__no_match__";
}
