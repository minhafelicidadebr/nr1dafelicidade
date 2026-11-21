/**
 * NR-1 GRO/PGR Psychosocial Framework — Canonical registry
 * Versioned source-of-truth for principles, PDCA cycle, MTE 13 factors,
 * AIHA 5×5 matrix, sample-size rule and legal disclaimers.
 * Used by NR1CopsoqPage and AI Edge Functions as static reference text.
 * This is not governed RAG and does not replace Source Registry approval.
 */

export const nr1Framework = {
  frameworkName: "NR-1 GRO/PGR Psicossocial",
  version: "2026.1",
  updatedAt: "2026-06-01",
  enforcementDate: "2026-05-26",
  legalBasis: [
    "Portaria MTE 1.419/2024",
    "Portaria MTE 765/2025",
    "Guia MTE/SIT Abril/2025",
    "ISO 45001:2018",
    "ISO 45003:2021",
    "NR-17 (Ergonomia)",
  ],

  principles: [
    { id: "P1", name: "Identificação de Perigos",       description: "Reconhecer sistematicamente fatores psicossociais presentes no ambiente e organização do trabalho.", nr1Reference: "NR-01 1.5.4.4.6.1" },
    { id: "P2", name: "Avaliação de Riscos",            description: "Classificar probabilidade × severidade usando critérios documentados e instrumento validado.",          nr1Reference: "NR-01 1.5.4.4.6.2" },
    { id: "P3", name: "Hierarquia de Controles",        description: "Priorizar eliminação e substituição antes de controles administrativos e EPI.",                          nr1Reference: "NR-01 1.5.4.3" },
    { id: "P4", name: "Participação dos Trabalhadores", description: "Garantir que trabalhadores participem do processo de identificação, avaliação e controle de riscos.",   nr1Reference: "NR-01 1.5.1 / 1.5.7.4" },
    { id: "P5", name: "Comunicação",                    description: "Comunicar riscos identificados e medidas adotadas a todos os trabalhadores expostos.",                   nr1Reference: "NR-01 1.5.7.4" },
    { id: "P6", name: "Documentação e Rastreabilidade", description: "Registrar metodologia, dados agregados, critérios, plano de ação, responsáveis, prazos e evidências.",  nr1Reference: "NR-01 1.5.4.4.7.1" },
    { id: "P7", name: "Melhoria Contínua",              description: "Reavaliar periodicamente a eficácia das medidas implementadas e atualizar o PGR.",                       nr1Reference: "NR-01 1.5.4.1 / 1.5.4.2" },
  ],

  cycle: [
    {
      id: "plan", order: 1, name: "Planejar", icon: "ClipboardList", color: "blue",
      description: "Definir escopo, responsáveis, estabelecimentos, setores, grupos, instrumento e cronograma.",
      keyActivities: [
        "Mapear estabelecimentos e unidades",
        "Definir grupos homogêneos de trabalhadores",
        "Selecionar somente instrumento versionado, licenciado e aprovado no Instrument Registry",
        "Planejar comunicação prévia aos trabalhadores",
        "Definir responsável técnico pelo PGR",
        "Estabelecer cronograma da campanha",
      ],
      outputs: ["Escopo documentado", "Comunicado aos trabalhadores (NR-01 1.5.7.4)", "Campanha configurada"],
      nr1References: ["NR-01 1.5.1", "NR-01 1.5.7.4"],
    },
    {
      id: "identify", order: 2, name: "Identificar", icon: "Search", color: "amber",
      description: "Identificar fatores psicossociais, fontes geradoras, circunstâncias de exposição e agravos.",
      keyActivities: [
        "Aplicar instrumento aprovado com coleta protegida por token",
        "Manter indicadores de exposição e desfecho metodologicamente separados",
        "Calcular taxa de adesão",
        "Garantir amostra mínima por setor",
        "Mascarar setores com baixa amostra",
      ],
      outputs: ["Respostas coletadas e anonimizadas", "Taxa de adesão documentada", "Dados prontos para scoring"],
      nr1References: ["NR-01 1.5.4.4.6.1", "NR-01 1.5.4.4.6.4"],
    },
    {
      id: "assess", order: 3, name: "Avaliar", icon: "BarChart3", color: "orange",
      description: "Classificar probabilidade, severidade e tolerabilidade. Gerar inventário AIHA 5×5.",
      keyActivities: [
        "Calcular escore original conforme pack aprovado e preservar resultado bruto",
        "Exibir somente faixas ou referências com fonte e aprovação",
        "Aplicar matriz AIHA 5×5 (P × S)",
        "Documentar critérios de tolerabilidade",
        "Identificar os 13 fatores MTE/SIT 2025",
        "Não inferir diagnóstico ou prevalência clínica sem instrumento e finalidade formalmente aprovados",
        "Priorizar Top 5 riscos críticos",
      ],
      outputs: ["Inventário completo de riscos", "Classificação AIHA 5×5", "13 fatores MTE mapeados", "Scores por setor e dimensão"],
      nr1References: ["NR-01 1.5.4.4.6.2", "NR-01 1.5.4.3"],
    },
    {
      id: "control", order: 4, name: "Controlar", icon: "Shield", color: "green",
      description: "Definir medidas de prevenção pela hierarquia de controles e plano de ação baseado em evidência.",
      keyActivities: [
        "Mapear controles já implantados",
        "Verificar eficácia dos controles declarados",
        "Criar itens de ação com responsável, prazo e KPI",
        "Cruzar riscos com drivers do Playbook",
        "Selecionar intervenções baseadas em evidência",
        "Priorizar controles organizacionais antes de individuais",
      ],
      outputs: ["Plano de ação NR-1", "Hierarquia de controles por risco", "Intervenções mapeadas por driver", "Responsáveis e prazos definidos"],
      nr1References: ["NR-01 1.5.4.3", "NR-01 1.5.4.4.7.1"],
      controlHierarchy: [
        { level: 1, name: "Eliminação",                              description: "Remover completamente o perigo da organização do trabalho",                     color: "green",  priority: "P0" },
        { level: 2, name: "Substituição",                            description: "Substituir o processo, organização ou prática que gera o risco",                color: "teal",   priority: "P0" },
        { level: 3, name: "Controle de Engenharia / Organizacional", description: "Reestruturar fluxos, redistribuir carga, redesenhar funções",                   color: "blue",   priority: "P1" },
        { level: 4, name: "Controle Administrativo",                 description: "Políticas, treinamentos, comunicação, rotinas de gestão",                       color: "amber",  priority: "P1" },
        { level: 5, name: "EPI/EPC / Suporte Individual",            description: "Programas de apoio individual — apenas complementares às ações estruturais",   color: "orange", priority: "P2" },
      ],
    },
    {
      id: "evidence", order: 5, name: "Evidenciar", icon: "FileCheck", color: "purple",
      description: "Registrar ações, responsáveis, prazos, status, evidências de participação, comunicações e devolutiva.",
      keyActivities: [
        "Registrar evidências de cada ação no plano",
        "Documentar participação dos trabalhadores (atas, listas)",
        "Gerar comunicado de devolutiva",
        "Vincular evidências ao inventário de riscos",
        "Gerar relatório versionado com hash",
        "Arquivar laudo assinado pelo responsável técnico",
      ],
      outputs: ["Relatório auditável versionado", "Evidências de participação", "Comunicado de devolutiva", "Audit logs rastreáveis"],
      nr1References: ["NR-01 1.5.4.4.7.1", "NR-01 1.5.7.4"],
    },
    {
      id: "review", order: 6, name: "Reavaliar", icon: "RefreshCw", color: "indigo",
      description: "Monitorar eficácia, revisar riscos residuais e manter ciclo de melhoria contínua.",
      keyActivities: [
        "Verificar status de cada ação do plano",
        "Calcular risco residual após intervenções",
        "Verificar alertas de eficácia (controle implantado + risco vermelho = ineficácia)",
        "Agendar próxima avaliação (anual ou bienal)",
        "Atualizar PGR",
        "Registrar lições aprendidas",
      ],
      outputs: ["Risco residual documentado", "Periodicidade de reavaliação definida", "PGR atualizado", "Nova campanha agendada"],
      periodicidade: {
        anual: "Quando houver dimensões em zona vermelha, comportamentos ofensivos identificados, ou ≥ 3 dimensões amarelas com risco relevante",
        bienal: "Quando todos os riscos estão em zona verde e não há mudanças organizacionais significativas",
      },
      nr1References: ["NR-01 1.5.4.1", "NR-01 1.5.4.2"],
    },
  ],

  thirteenMteFactors: [
    { id: "MTE-01", name: "Assédio de qualquer natureza",           copsoqDimensions: ["offensive_behaviours", "conflicts"],            priority: "P0", criticalFlag: true },
    { id: "MTE-02", name: "Má gestão de mudanças organizacionais",  copsoqDimensions: ["predictability", "insecurity"],                 priority: "P0" },
    { id: "MTE-03", name: "Baixa clareza de papel/função",          copsoqDimensions: ["role_clarity"],                                 priority: "P1" },
    { id: "MTE-04", name: "Baixas recompensas e reconhecimento",    copsoqDimensions: ["recognition", "justice_respect"],               priority: "P1" },
    { id: "MTE-05", name: "Falta de suporte/apoio no trabalho",     copsoqDimensions: ["social_support", "leadership_quality"],         priority: "P0" },
    { id: "MTE-06", name: "Baixo controle / Falta de autonomia",    copsoqDimensions: ["influence"],                                    priority: "P0" },
    { id: "MTE-07", name: "Baixa justiça organizacional",           copsoqDimensions: ["justice_respect", "recognition"],               priority: "P1" },
    { id: "MTE-08", name: "Eventos violentos ou traumáticos",       copsoqDimensions: ["offensive_behaviours"],                         priority: "P0", criticalFlag: true },
    { id: "MTE-09", name: "Baixa demanda (subcarga)",               copsoqDimensions: ["meaning"],                                      priority: "P2" },
    { id: "MTE-10", name: "Excesso de demandas (sobrecarga)",       copsoqDimensions: ["demands_quant", "work_pace"],                   priority: "P0" },
    { id: "MTE-11", name: "Más relações no local de trabalho",      copsoqDimensions: ["social_support", "community", "conflicts"],     priority: "P1" },
    { id: "MTE-12", name: "Condições de difícil comunicação",       copsoqDimensions: ["predictability", "role_clarity"],               priority: "P1" },
    { id: "MTE-13", name: "Trabalho remoto e isolado",              copsoqDimensions: ["community", "social_support"],                  priority: "P1" },
  ],

  aihaMatrix: {
    description: "American Industrial Hygiene Association — Probabilidade × Severidade",
    source: "AIHA 2015 / Adaptado para fatores psicossociais",
    severity: [
      { level: 1, name: "Negligenciável", description: "Sem impacto significativo à saúde" },
      { level: 2, name: "Menor",          description: "Desconforto leve, sem afastamento" },
      { level: 3, name: "Moderada",       description: "Afastamento temporário possível" },
      { level: 4, name: "Séria",          description: "Afastamento prolongado, CID documentável" },
      { level: 5, name: "Catastrófica",   description: "Invalidez, tentativa de suicídio, morte" },
    ],
    probability: [
      { level: 1, name: "Raro",        description: "< 20% dos trabalhadores percebem" },
      { level: 2, name: "Improvável",  description: "20–40% dos trabalhadores percebem" },
      { level: 3, name: "Possível",    description: "40–60% dos trabalhadores percebem" },
      { level: 4, name: "Provável",    description: "60–80% dos trabalhadores percebem" },
      { level: 5, name: "Quase certo", description: "> 80% dos trabalhadores percebem" },
    ],
    riskBands: [
      { min: 1,  max: 3,  level: "Trivial",      color: "green",  action: "Nenhuma ação necessária — monitoramento de rotina" },
      { min: 3,  max: 8,  level: "Tolerável",    color: "lime",   action: "Monitoramento contínuo — ação preventiva de longo prazo" },
      { min: 4,  max: 12, level: "Moderado",     color: "amber",  action: "Ação preventiva planejada em 6 meses" },
      { min: 10, max: 15, level: "Substancial",  color: "orange", action: "Intervenção planejada em 90 dias — responsável nomeado" },
      { min: 15, max: 25, level: "Intolerável",  color: "red",    action: "Intervenção imediata — paralisar atividade se necessário" },
    ],
  },

  minimumSampleSize: {
    default: 5,
    description: "Setores com menos de 5 respondentes têm dados mascarados para proteger anonimato individual.",
    source: "COPSOQ International Network — Good Practices Guidelines 2019",
  },

  disclaimers: [
    "Esta plataforma apoia a gestão da NR-1, mas não substitui a responsabilidade técnica pelo PGR.",
    "Resultados são agregados e protegidos por regra de amostra mínima.",
    "A recomendação da IA deve ser validada por responsável técnico habilitado.",
    "Priorize causas organizacionais antes de responsabilizar indivíduos.",
    "Intervenções devem ser acompanhadas por evidências e avaliação de eficácia.",
    "O uso isolado de questionários não é suficiente — combine com observação técnica e entrevistas.",
  ],
} as const;

export type Nr1Framework = typeof nr1Framework;

/** AIHA risk-band lookup for a given P×S score (1–25). */
export function aihaBand(score: number) {
  const bands = nr1Framework.aihaMatrix.riskBands;
  // Pick the highest band whose [min,max] window contains the score.
  return [...bands].reverse().find((b) => score >= b.min && score <= b.max) ?? bands[0];
}
