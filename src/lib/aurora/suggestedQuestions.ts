/**
 * Aurora NR-1 — Perguntas sugeridas por rota (Públicas e Autenticadas).
 * Cada pergunta carrega um `intent` que mapeia para uma resposta determinística
 * em `knowledgeBase.ts`. Não usa IA livre sem lastro determinístico.
 */

export type SuggestedQuestion = {
  id: string;
  intent: string;
  label: string;
};

const ROUTE_MAP: Record<string, SuggestedQuestion[]> = {
  "/": [
    { id: "home.nr28", intent: "home.nr28_benchmark", label: "Quais são as multas oficiais da NR-28 (UFIR/R$) e o efeito cascata (FAP/INSS)?" },
    { id: "home.sim", intent: "home.cost_simulator", label: "Como funciona o Simulador de Custos e a comparação com a NR-28?" },
    { id: "home.wellbeing", intent: "home.wellbeing_science", label: "Como a Ciência do Bem-Estar e os 12 Drivers se conectam à NR-1?" },
    { id: "home.roadmap", intent: "home.roadmap_90d", label: "Como estruturar o plano de 90 dias e avaliar nossa prontidão NR-1?" },
    { id: "home.pulse", intent: "home.regulatory_pulse", label: "Como o Pulso Regulatório integra NR-1, NR-28 e a Lei 14.831/2024?" },
  ],
  "/nr1-copsoq": [
    { id: "copsoq.readiness", intent: "cycle.readiness", label: "Como o COPSOQ II se integra à AEP (NR-17) e ao GRO/PGR?" },
    { id: "copsoq.k5", intent: "risk.k_anonymity", label: "Como funciona a trava de k-anonimato (k≥5) e a LGPD?" },
    { id: "copsoq.sxp", intent: "risk.severity_x_probability", label: "Como é calculada a matriz Severidade × Probabilidade (AIHA 5×5)?" },
  ],
  "/drivers": [
    { id: "drv.how", intent: "drivers.how_it_works", label: "Como os Drivers do Playbook 2.0 (Oxford) tratam os riscos na fonte?" },
    { id: "drv.hierarchy", intent: "controls.hierarchy", label: "Qual é a hierarquia de controles exigida pela NR-1?" },
    { id: "drv.actions", intent: "actions.create_from_risk", label: "Como vincular um Driver ao Plano de Ação do PGR?" },
  ],
  "/library": [
    { id: "lib.mte_oxf", intent: "library.mte_oxford", label: "Como o Manual Oficial MTE 2026 e o Playbook 2.0 de Oxford se complementam?" },
    { id: "lib.docs", intent: "documents.which", label: "Quais capítulos do Manual MTE 2026 regem os documentos do PGR?" },
    { id: "lib.controls", intent: "controls.organizational", label: "Por que a ciência prioriza controles organizacionais na fonte?" },
  ],
  "/planos": [
    { id: "pl.advisory", intent: "plans.advisory", label: "Qual plano ou assessoria institucional é ideal para nossa maturidade?" },
    { id: "pl.roi", intent: "home.roi", label: "Como justificar o orçamento NR-1 para a Diretoria e o Conselho?" },
    { id: "pl.start", intent: "overview.dashboard", label: "Quais são os passos de implantação da jornada NR-1?" },
  ],
  "/sobre": [
    { id: "sb.overview", intent: "overview.summary", label: "Qual é a metodologia do Instituto Felicidade para Todos?" },
    { id: "sb.basis", intent: "library.mte_oxford", label: "Quais são as bases científicas e normativas da plataforma?" },
    { id: "sb.advisory", intent: "plans.advisory", label: "Como falar com os especialistas do Instituto?" },
  ],
  "/app": [
    { id: "dash.overview", intent: "overview.dashboard", label: "Por onde devo começar no Dashboard NR-1?" },
    { id: "dash.kpis", intent: "overview.kpis", label: "O que cada indicador do dashboard representa?" },
    { id: "dash.next", intent: "overview.next", label: "Qual é o próximo passo prioritário na jornada NR-1?" },
  ],
  "/app/company": [
    { id: "co.setores", intent: "company.structure", label: "Como estruturar setores da empresa?" },
    { id: "co.gro", intent: "company.gro", label: "Por que o cadastro da empresa é importante para o GRO/PGR?" },
    { id: "co.invite", intent: "company.invite_code", label: "Como usar o código de convite para gestores/RH?" },
  ],
  "/app/units": [
    { id: "un.org", intent: "units.organize", label: "Como organizar unidades e GES/GHE por setor?" },
    { id: "un.recorte", intent: "units.cut", label: "Qual recorte é melhor para análise psicossocial?" },
    { id: "un.anon", intent: "units.anonymity", label: "Como preservar anonimato (k≥5) em unidades pequenas?" },
  ],
  "/app/cycles": [
    { id: "cy.share", intent: "cycles.share_safely", label: "Como compartilhar convites com segurança?" },
    { id: "cy.k5", intent: "cycles.k5_gap", label: "Quantas respostas faltam para atingir k≥5?" },
    { id: "cy.token", intent: "cycles.unique_token", label: "Por que cada colaborador recebe um token único?" },
    { id: "cy.adesao", intent: "cycles.adesao", label: "Como acompanhar a taxa de adesão do ciclo?" },
  ],
  "/app/work-analysis": [
    { id: "wa.aep", intent: "cycle.readiness", label: "Como integrar a Análise da Atividade Real (AEP NR-17) ao COPSOQ II?" },
    { id: "wa.mte", intent: "overview.summary", label: "O que o Cap. 8 do Manual MTE 2026 exige sobre o trabalho real?" },
  ],
  "/app/aet": [
    { id: "aet.when", intent: "cycle.readiness", label: "Quando a AEP deve evoluir para uma AET aprofundada (NR-17)?" },
    { id: "aet.controls", intent: "controls.organizational", label: "Como converter achados ergonômicos em controles organizacionais?" },
  ],
  "/app/criteria": [
    { id: "cr.doc3", intent: "documents.which", label: "Por que os Critérios do GRO são o 3º documento obrigatório do PGR?" },
    { id: "cr.sxp", intent: "risk.severity_x_probability", label: "Como parametrizar a matriz AIHA 5×5 (S×P) antes da avaliação?" },
  ],
  "/app/risk": [
    { id: "rk.top3", intent: "risk.top3", label: "Quais são os 3 riscos mais prioritários deste ciclo?" },
    { id: "rk.k", intent: "risk.k_anonymity", label: "O que significa k-anonimato (k≥5)?" },
    { id: "rk.sxp", intent: "risk.severity_x_probability", label: "Como interpretar severidade × probabilidade (S×P)?" },
    { id: "rk.first", intent: "risk.first_dimension", label: "Qual dimensão exige ação primeiro?" },
    { id: "rk.interventions", intent: "risk.interventions", label: "Quais intervenções são recomendadas para este risco?" },
  ],
  "/app/actions": [
    { id: "ac.create", intent: "actions.create_from_risk", label: "Como criar uma ação a partir de um risco prioritário?" },
    { id: "ac.evidence", intent: "actions.evidence", label: "Que evidência e indicador de aferição devo anexar a uma ação?" },
    { id: "ac.priority", intent: "actions.priority", label: "Qual ação deve ter prioridade no Plano do PGR?" },
  ],
  "/app/controls": [
    { id: "co1.org", intent: "controls.organizational", label: "O que são controles organizacionais na fonte?" },
    { id: "co1.hierarchy", intent: "controls.hierarchy", label: "Como diferenciar controle primário, secundário e terciário?" },
    { id: "co1.efficacy", intent: "controls.efficacy", label: "Como avaliar a eficácia de um controle entre ciclos?" },
  ],
  "/app/documents": [
    { id: "doc.which", intent: "documents.which", label: "Quais são os 3 documentos mínimos do PGR e a Ponte PCMSO (.pdf)?" },
    { id: "doc.drps", intent: "documents.drps", label: "O que entra no DRPS preliminar em PDF?" },
    { id: "doc.review", intent: "documents.review", label: "O que ainda precisa de revisão técnica SST/SESMT?" },
    { id: "doc.limits", intent: "documents.limits", label: "Quais limitações precisam constar no documento?" },
  ],
  "/app/governance": [
    { id: "gov.lgpd", intent: "risk.k_anonymity", label: "Como a plataforma garante conformidade LGPD e sigilo k≥5?" },
    { id: "gov.basis", intent: "strategy.basis", label: "Como funciona a trilha de auditoria e anti-alucinação?" },
  ],
  "/app/estrategia": [
    { id: "es.read", intent: "strategy.read", label: "Como interpretar as recomendações da Sra. EstratégIA?" },
    { id: "es.basis", intent: "strategy.basis", label: "Quais dados do ciclo sustentam esta orientação?" },
    { id: "es.gaps", intent: "strategy.gaps", label: "O que ainda falta para uma análise mais robusta?" },
  ],
};

export function getSuggestedQuestions(pathname: string): SuggestedQuestion[] {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];
  const keys = Object.keys(ROUTE_MAP)
    .filter((k) => k !== "/")
    .sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (pathname.startsWith(k + "/") || pathname === k) return ROUTE_MAP[k];
  }
  return ROUTE_MAP["/"];
}

export function getRouteLabel(pathname: string): string {
  if (pathname === "/") return "Início · 4 Lentes";
  if (pathname.startsWith("/nr1-copsoq")) return "Plataforma NR-1 & COPSOQ II";
  if (pathname.startsWith("/drivers")) return "Drivers Playbook 2.0";
  if (pathname.startsWith("/library") || pathname.startsWith("/biblioteca")) return "Biblioteca MTE & Oxford";
  if (pathname.startsWith("/planos")) return "Planos & ROI";
  if (pathname.startsWith("/sobre")) return "Sobre o Instituto";
  if (pathname.startsWith("/app/risk")) return "Matriz de Riscos";
  if (pathname.startsWith("/app/cycles")) return "Ciclos de Escuta";
  if (pathname.startsWith("/app/units")) return "Unidades & GHE";
  if (pathname.startsWith("/app/company")) return "Empresa";
  if (pathname.startsWith("/app/work-analysis")) return "Trabalho Real (AEP)";
  if (pathname.startsWith("/app/aet")) return "Ergonomia (AET)";
  if (pathname.startsWith("/app/criteria")) return "Critérios do GRO";
  if (pathname.startsWith("/app/actions")) return "Plano de Ação";
  if (pathname.startsWith("/app/controls")) return "Medidas de Controle";
  if (pathname.startsWith("/app/documents")) return "Documentos PGR (.pdf)";
  if (pathname.startsWith("/app/governance")) return "Governança & LGPD";
  if (pathname.startsWith("/app/estrategia")) return "Sra. EstratégIA";
  return "Dashboard NR-1";
}
