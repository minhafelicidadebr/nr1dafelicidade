/**
 * NR-1 / Playbook 2.0 — Evidence-Based Interventions Library
 * Canonical, versioned registry of organisational interventions.
 *
 * Consumed by:
 *  - NR1CopsoqPage (UI catalogue + filters)
 *  - driver-dynamic Edge Function (action plan generation)
 *
 * NEVER mutate at runtime. Treat as `as const`.
 */

import type { EvidenceLevel, Priority } from "./nr1Crosswalk";

export type ControlHierarchy =
  | "Eliminação" | "Substituição" | "Organizacional"
  | "Administrativo" | "Administrativo / Individual"
  | "Participativo" | "Governança";

export type PreventionLevel =
  | "primary_prevention"
  | "primary_secondary_prevention"
  | "secondary_prevention"
  | "tertiary_prevention";

export type CostBand = "low" | "low_medium" | "medium" | "medium_high" | "high";
export type TimeToImpact =
  | "immediate_1_month" | "1_3_months" | "3_6_months" | "1_6_months" | "3_12_months" | "6_12_months";

export interface Intervention {
  id: string;
  title: string;
  driver: string;
  additionalDrivers: string[];
  riskFactors: string[];
  mteFactors: string[];
  copsoqDimensions: string[];
  controlHierarchy: ControlHierarchy;
  controlLevel: 1 | 2 | 3 | 4 | 5;
  level: PreventionLevel;
  estimatedCost: CostBand;
  estimatedTimeToImpact: TimeToImpact;
  description: string;
  whenToUse?: string;
  doNotUse?: string;
  implementationSteps: string[];
  metrics: string[];
  evidenceLevel: EvidenceLevel;
  evidenceSource: string;
  requiresHumanApproval: boolean;
  criticalFlag?: boolean;
  playbookRef: string;
  nr1Evidence?: string;
}

export interface InterventionQuadrant {
  id: "Q1" | "Q2" | "Q3" | "Q4";
  name: string;
  color: "green" | "blue" | "amber" | "red";
  priority: Priority | "P3";
}

export const nr1Interventions = {
  version: "2026.1",
  updatedAt: "2026-06-01",
  description:
    "Biblioteca de intervenções organizacionais baseadas em evidência, organizadas por driver, fator de risco NR-1, nível de controle e força da evidência.",
  sources: [
    "Work Wellbeing Playbook 2.0 — Oxford Wellbeing Research Centre (2024)",
    "ISO 45003:2021 — Gestão de riscos psicossociais",
    "Eurofound — European Working Conditions Survey (2021)",
    "ILO — Work-Related Stress Prevention Manual (2016)",
    "NIOSH — Total Worker Health Framework (2023)",
  ],
  disclaimer:
    "Intervenções requerem validação humana por profissional habilitado antes de implementação. A eficácia depende do contexto organizacional, porte, setor e cultura.",
  interventions: [
    {
      id: "workload_redesign_001",
      title: "Redesenhar carga, fluxo e prioridades do trabalho",
      driver: "stress",
      additionalDrivers: ["energy", "management", "achievement"],
      riskFactors: ["Sobrecarga", "Ritmo intenso", "Exigências quantitativas"],
      mteFactors: ["MTE-10"],
      copsoqDimensions: ["demands_quant", "work_pace"],
      controlHierarchy: "Organizacional",
      controlLevel: 3,
      level: "primary_prevention",
      estimatedCost: "low_medium",
      estimatedTimeToImpact: "3_6_months",
      description:
        "Reorganizar fluxos de trabalho, eliminar tarefas de baixo valor, revisar metas e prazos, ajustar dimensionamento de equipes e criar mecanismos de priorização coletiva.",
      whenToUse:
        "Quando exigências quantitativas, ritmo de trabalho ou burnout aparecem em zona amarela ou vermelha. Especialmente eficaz quando equipes reportam sobrecarga recorrente.",
      doNotUse:
        "Não como substituto para treinamentos de gestão do tempo individual — se o problema é estrutural, a solução deve ser estrutural.",
      implementationSteps: [
        "Mapear gargalos e tarefas de baixo valor com trabalhadores (participação ativa)",
        "Calcular capacidade real de cada equipe versus demanda atual",
        "Revisar metas, prazos e prioridades com gestão e trabalhadores",
        "Eliminar reuniões desnecessárias (auditoria de reuniões)",
        "Criar política de priorização explícita (máx. 3 prioridades por semana)",
        "Testar novo fluxo por 30–45 dias com grupo piloto",
        "Medir carga percebida (escala COPSOQ) antes e depois",
        "Ajustar e expandir baseado em evidências do piloto",
      ],
      metrics: [
        "Score COPSOQ demands_quant",
        "Horas extras por equipe",
        "Absenteísmo",
        "Burnout coletivo (COPSOQ)",
        "Tempo de ciclo de processos",
      ],
      evidenceLevel: "strong",
      evidenceSource: "Bakker & Demerouti (2017); Eurofound (2021); NIOSH TWH",
      requiresHumanApproval: true,
      playbookRef: "Playbook 2.0 — Stress Driver — Reduce Workload Pressures",
    },
    {
      id: "meeting_audit_001",
      title: "Auditoria e reforma de reuniões",
      driver: "stress",
      additionalDrivers: ["energy", "flexibility"],
      riskFactors: ["Sobrecarga", "Ritmo intenso", "Fragmentação do tempo de trabalho"],
      mteFactors: ["MTE-10"],
      copsoqDimensions: ["demands_quant", "work_pace", "influence"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "1_3_months",
      description:
        "Mapear, avaliar e reformar a cultura de reuniões para recuperar tempo cognitivo, reduzir sobrecarga e aumentar autonomia sobre o tempo de trabalho.",
      whenToUse:
        "Quando trabalhadores reportam fragmentação de tempo, falta de foco ou sensação de que reuniões impedem o trabalho real.",
      implementationSteps: [
        "Auditar todas as reuniões recorrentes (frequência, duração, participantes, valor)",
        "Cancelar ou fundir reuniões que não geram decisões ou ações",
        "Criar regras de ouro: agenda prévia, owner, decisão explícita, duração máxima",
        "Instituir dias ou janelas sem reuniões (ex: 2 manhãs por semana)",
        "Testar reuniões em pé ou async para atualizações de rotina",
        "Medir satisfação e tempo recuperado após 60 dias",
      ],
      metrics: [
        "Horas em reuniões por semana",
        "Score de autonomia (COPSOQ influence)",
        "Satisfação com organização do tempo",
      ],
      evidenceLevel: "moderate_strong",
      evidenceSource: "Eurofound (2021); Microsoft WorkLab Research (2023)",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Operational Design",
    },
    {
      id: "right_to_disconnect_001",
      title: "Implementar política de direito à desconexão",
      driver: "energy",
      additionalDrivers: ["stress", "flexibility"],
      riskFactors: ["Sobrecarga", "Fronteiras trabalho-vida", "Jornada excessiva"],
      mteFactors: ["MTE-10"],
      copsoqDimensions: ["demands_quant", "work_pace"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "1_3_months",
      description:
        "Criar e comunicar política formal que protege trabalhadores de demandas fora do horário de trabalho, incluindo e-mails, mensagens e chamadas não urgentes.",
      whenToUse:
        "Quando trabalhadores reportam dificuldade de desconectar após o expediente, especialmente em trabalho remoto ou híbrido.",
      implementationSteps: [
        "Definir horários protegidos — mensagens não requerem resposta imediata fora deles",
        "Comunicar explicitamente que urgências reais têm canal específico (ex: ligação direta)",
        "Configurar respostas automáticas fora do horário se aplicável",
        "Líderes modelam o comportamento — não enviam mensagens fora do horário",
        "Revisar acordos de trabalho remoto e híbrido",
        "Monitorar através de COPSOQ demands_quant após 3 meses",
      ],
      metrics: [
        "Score COPSOQ work_pace",
        "Taxa de respostas fora do horário",
        "Satisfação com fronteiras trabalho-vida",
      ],
      evidenceLevel: "moderate_strong",
      evidenceSource: "Derks & Bakker (2012); França (2017) — Loi Travail; Playbook 2.0",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Energy Driver — Right to Disconnect",
    },
    {
      id: "employee_voice_001",
      title: "Criar comitê participativo de bem-estar e riscos psicossociais",
      driver: "employee_voice",
      additionalDrivers: ["trust", "management", "inclusion_belonging"],
      riskFactors: ["Baixa participação", "Baixa confiança", "Falha de comunicação"],
      mteFactors: ["MTE-05", "MTE-11"],
      copsoqDimensions: ["influence", "community", "social_support"],
      controlHierarchy: "Participativo",
      controlLevel: 3,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "3_6_months",
      description:
        "Criar grupo representativo regular de trabalhadores e gestão para levantar problemas, priorizar riscos, acompanhar ações do plano NR-1 e registrar evidências de participação.",
      whenToUse:
        "Recomendado para toda organização como boa prática de participação NR-1. Especialmente importante quando trabalhadores reportam baixo controle ou voz limitada.",
      implementationSteps: [
        "Definir composição representativa (diferentes setores, hierarquias, gêneros)",
        "Criar termo de referência com mandato, frequência e poder de decisão",
        "Realizar reunião mensal de 60–90 minutos",
        "Priorizar 3 riscos por ciclo baseado em dados COPSOQ",
        "Registrar ata, decisões e responsáveis",
        "Vincular evidências ao plano de ação NR-1",
        "Comunicar resultados a todos os trabalhadores",
      ],
      metrics: [
        "Número de reuniões realizadas",
        "Ações concluídas do plano",
        "Score COPSOQ influence",
        "Confiança vertical/horizontal",
        "Evidências de participação arquivadas",
      ],
      evidenceLevel: "strong",
      evidenceSource: "ISO 45001:2018 Cl.5.4; ISO 45003:2021; ILO (2016)",
      requiresHumanApproval: true,
      playbookRef: "Playbook 2.0 — Employee Voice Driver",
      nr1Evidence:
        "Gera evidências de participação dos trabalhadores (NR-01 1.5.7.4 — pilar obrigatório de fiscalização)",
    },
    {
      id: "manager_training_001",
      title: "Formação de lideranças para suporte, autonomia e saúde psicossocial",
      driver: "management",
      additionalDrivers: ["support", "trust", "stress"],
      riskFactors: ["Baixo apoio da liderança", "Baixa autonomia", "Estilo gerencial autoritário"],
      mteFactors: ["MTE-05", "MTE-06"],
      copsoqDimensions: ["leadership_quality", "social_support", "influence"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_secondary_prevention",
      estimatedCost: "medium",
      estimatedTimeToImpact: "3_6_months",
      description:
        "Formar líderes para reconhecer sinais organizacionais de risco psicossocial, apoiar autonomia das equipes, melhorar comunicação e encaminhar demandas sem medicalizar problemas estruturais.",
      whenToUse:
        "Quando qualidade da liderança ou apoio social aparecem em zona amarela ou vermelha. Combinar com dados de saída (turnover, absenteísmo).",
      doNotUse:
        "Não como solução isolada quando o problema é estrutural (metas impossíveis, falta de recursos). Líderes não podem compensar falhas sistêmicas.",
      implementationSteps: [
        "Diagnosticar lacunas de liderança com dados COPSOQ (por setor)",
        "Criar módulos de 4 semanas: NR-1, saúde psicossocial, comunicação, feedback",
        "Aplicar roleplays em casos reais do setor",
        "Definir rituais de 1:1 mensal estruturado",
        "Criar guia prático de como encaminhar situações de sofrimento",
        "Medir apoio percebido (COPSOQ leadership_quality) após 6 meses",
        "Reciclagem trimestral com dados de resultado",
      ],
      metrics: [
        "Score COPSOQ leadership_quality",
        "Confiança vertical",
        "Turnover da equipe",
        "Absenteísmo",
        "eNPS interno (satisfação com líder)",
      ],
      evidenceLevel: "strong",
      evidenceSource: "Hammer et al. (2011); Eurofound (2021); ISO 45003:2021",
      requiresHumanApproval: true,
      playbookRef: "Playbook 2.0 — Management Driver",
    },
    {
      id: "job_redesign_001",
      title: "Job redesign participativo e ampliação de escopo",
      driver: "flexibility",
      additionalDrivers: ["achievement", "purpose", "stress"],
      riskFactors: ["Baixo controle", "Monotonia", "Trabalho altamente prescritivo"],
      mteFactors: ["MTE-06"],
      copsoqDimensions: ["influence", "meaning"],
      controlHierarchy: "Organizacional",
      controlLevel: 3,
      level: "primary_prevention",
      estimatedCost: "low_medium",
      estimatedTimeToImpact: "3_6_months",
      description:
        "Reestruturar funções para ampliar autonomia, variedade de tarefas e responsabilidade sobre resultados, usando abordagem participativa com os próprios trabalhadores.",
      implementationSteps: [
        "Mapear tarefas atuais e percepção de controle por função",
        "Identificar oportunidades de ampliação vertical (mais responsabilidade) e horizontal (mais variedade)",
        "Co-desenhar novo escopo com trabalhadores e gestores",
        "Testar em grupo piloto de 30 dias",
        "Medir COPSOQ influence e meaning antes e depois",
        "Documentar como evidência de controle organizacional no PGR",
      ],
      metrics: [
        "Score COPSOQ influence",
        "Score COPSOQ meaning",
        "Satisfação no trabalho",
        "Turnover intenção",
      ],
      evidenceLevel: "strong",
      evidenceSource: "Hackman & Oldham (1976); Parker et al. (2019); ISO 45003:2021",
      requiresHumanApproval: true,
      playbookRef: "Playbook 2.0 — Autonomy & Flexibility Driver",
    },
    {
      id: "anti_harassment_policy_001",
      title: "Implementar ou revisar política antiassédio e conduta",
      driver: "trust",
      additionalDrivers: ["inclusion_belonging", "employee_voice"],
      riskFactors: ["Assédio moral", "Assédio sexual", "Violência", "Comportamentos ofensivos"],
      mteFactors: ["MTE-01", "MTE-08"],
      copsoqDimensions: ["offensive_behaviours", "conflicts"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "immediate_1_month",
      description:
        "Criar, revisar e comunicar amplamente política formal de tolerância zero para assédio e violência, com fluxos claros de relato, investigação e proteção da vítima.",
      whenToUse:
        "SEMPRE que comportamentos ofensivos aparecem em zona amarela ou vermelha. Resposta imediata obrigatória — não aguardar ciclo de reavaliação.",
      implementationSteps: [
        "Redigir ou revisar política com linguagem clara e inclusiva",
        "Definir fluxo explícito: relato → investigação → decisão → proteção da vítima",
        "Garantir canal confidencial funcional e de fácil acesso",
        "Comunicar amplamente (mural, e-mail, integração, reuniões)",
        "Treinar gestores sobre o fluxo e responsabilidades",
        "Fortalecer CIPA como canal de apoio",
        "Registrar todos os casos e resoluções (evidências para PGR)",
      ],
      metrics: [
        "Score COPSOQ offensive_behaviours",
        "Número de relatos recebidos e resolvidos",
        "Percepção de segurança psicológica",
      ],
      evidenceLevel: "critical",
      evidenceSource: "ILO C190 (2019); NR-01 responsabilidade civil; CFP Resolução 10/2005",
      requiresHumanApproval: true,
      criticalFlag: true,
      playbookRef: "Playbook 2.0 — Trust Driver",
    },
    {
      id: "eap_program_001",
      title: "Programa de Apoio ao Empregado (EAP)",
      driver: "support",
      additionalDrivers: ["energy", "stress"],
      riskFactors: ["Burnout", "Sofrimento mental", "Exigências emocionais"],
      mteFactors: ["MTE-05"],
      copsoqDimensions: ["burnout", "stress_at_work", "demands_emotional"],
      controlHierarchy: "Administrativo / Individual",
      controlLevel: 4,
      level: "secondary_prevention",
      estimatedCost: "medium_high",
      estimatedTimeToImpact: "1_6_months",
      description:
        "Disponibilizar apoio psicológico e aconselhamento confidencial para trabalhadores, como suporte — nunca como substituto de mudanças organizacionais.",
      whenToUse:
        "Quando avaliação humana e evidências agregadas aprovadas indicarem necessidade de suporte secundário. Implementar em paralelo com intervenções organizacionais primárias — EAP não resolve causas estruturais.",
      doNotUse:
        "Não como solução isolada para problemas organizacionais. EAP trata sintomas — reformas estruturais tratam causas.",
      implementationSteps: [
        "Selecionar parceiro EAP com confidencialidade garantida e cobertura abrangente",
        "Comunicar amplamente com foco em normalização — buscar apoio é força, não fraqueza",
        "Garantir que dados de uso não sejam acessíveis a gestores ou RH identificados",
        "Integrar ao plano de ação como medida secundária documentada",
        "Medir utilização apenas em agregado seguro e revisar efeitos após 6 meses",
      ],
      metrics: [
        "Taxa de utilização EAP (anonimizada)",
        "Indicador coletivo aprovado, quando aplicável",
        "Sinal ocupacional agregado aprovado",
        "Absenteísmo por saúde mental",
      ],
      evidenceLevel: "moderate_strong",
      evidenceSource: "SHRM (2023); Millward et al. (2019)",
      requiresHumanApproval: true,
      playbookRef: "Playbook 2.0 — Support Driver",
    },
    {
      id: "inclusion_rituals_001",
      title: "Criar rituais de inclusão e pertencimento",
      driver: "inclusion_belonging",
      additionalDrivers: ["trust", "support", "community"],
      riskFactors: ["Isolamento", "Falta de pertencimento", "Discriminação"],
      mteFactors: ["MTE-11", "MTE-13"],
      copsoqDimensions: ["community", "social_support", "inclusion"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "1_3_months",
      description:
        "Criar práticas regulares que promovam conexão genuína, valorização da diversidade e pertencimento — especialmente para trabalhadores remotos, temporários e de grupos sub-representados.",
      implementationSteps: [
        "Mapear grupos que se sentem menos incluídos (dados COPSOQ + escuta qualitativa)",
        "Criar rituais de boas-vindas estruturados e buddy system para novos colaboradores",
        "Programar momentos de conexão não-relacionados ao trabalho (presencial e virtual)",
        "Garantir que vozes diversas sejam ativamente incluídas em reuniões e decisões",
        "Criar espaço seguro para diferenças sem tokenização",
        "Medir COPSOQ community e belonging após 90 dias",
      ],
      metrics: [
        "Score COPSOQ community",
        "Score COPSOQ inclusion",
        "Sentimento de pertencimento (pesquisa)",
        "Turnover de grupos minoritários",
      ],
      evidenceLevel: "moderate_strong",
      evidenceSource: "Holt-Lunstad et al. (2015); Playbook 2.0 — Inclusion & Belonging Driver",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Inclusion & Belonging Driver",
    },
    {
      id: "recognition_program_001",
      title: "Programa SAGE de reconhecimento específico e autêntico",
      driver: "appreciation",
      additionalDrivers: ["trust", "achievement", "compensation"],
      riskFactors: ["Baixo reconhecimento", "Injustiça", "Desmotivação"],
      mteFactors: ["MTE-04", "MTE-07"],
      copsoqDimensions: ["recognition", "justice_respect"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "1_3_months",
      description:
        "Criar cultura de reconhecimento Específico, Autêntico, Genuíno e conquistado (SAGE), diferente de elogios genéricos ou programas de gamificação de baixo impacto.",
      implementationSteps: [
        "Treinar líderes no framework SAGE (Specific, Authentic, Genuine, Earned)",
        "Criar rituais de reconhecimento em reuniões de equipe (ex: kudos semanal)",
        "Garantir reconhecimento par-a-par (não apenas vertical)",
        "Vincular reconhecimento a comportamentos e valores, não apenas resultados",
        "Revisar critérios de promoção e progressão por transparência",
        "Medir COPSOQ recognition após 3 meses",
      ],
      metrics: [
        "Score COPSOQ recognition",
        "Score COPSOQ justice_respect",
        "eNPS",
        "Turnover voluntário",
      ],
      evidenceLevel: "moderate_strong",
      evidenceSource: "Pink (2009) — Drive; Playbook 2.0 — Appreciation Driver",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Appreciation Driver — SAGE Recognition",
    },
    {
      id: "purpose_framing_001",
      title: "Prosocial task framing e conexão com impacto",
      driver: "purpose",
      additionalDrivers: ["achievement", "learning"],
      riskFactors: ["Baixo sentido", "Desengajamento", "Subcarga"],
      mteFactors: ["MTE-09"],
      copsoqDimensions: ["meaning"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "1_3_months",
      description:
        "Criar linguagem e narrativas que conectem tarefas cotidianas ao impacto real na vida de pessoas e na missão organizacional — sem cair em propósito vazio ou marketing interno.",
      implementationSteps: [
        "Mapear como cada função contribui para o cliente final e para a missão",
        "Criar histórias reais de impacto — não slogans corporativos",
        "Incluir beneficiários reais em comunicações internas quando possível",
        "Usar strengths-based approach em avaliações de desempenho",
        "Treinar líderes para conectar briefings de tarefa ao propósito maior",
        "Medir COPSOQ meaning após 3 meses",
      ],
      metrics: [
        "Score COPSOQ meaning",
        "Satisfação no trabalho",
        "Engajamento (eNPS)",
        "Turnover intenção",
      ],
      evidenceLevel: "moderate",
      evidenceSource: "Grant (2008); Wrzesniewski et al. (2010); Playbook 2.0 — Purpose Driver",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Purpose Driver",
    },
    {
      id: "welfare_committee_001",
      title: "Comitê de bem-estar com rituais, dados e evidências",
      driver: "employee_voice",
      additionalDrivers: ["management", "trust", "learning"],
      riskFactors: ["Governança insuficiente", "Baixa participação", "Falta de continuidade"],
      mteFactors: ["MTE-02", "MTE-05"],
      copsoqDimensions: ["influence", "community", "social_support"],
      controlHierarchy: "Governança",
      controlLevel: 3,
      level: "primary_prevention",
      estimatedCost: "low",
      estimatedTimeToImpact: "3_12_months",
      description:
        "Criar estrutura permanente de governança de bem-estar organizacional com reuniões regulares, dados, agenda estruturada, rituais e evidências documentadas para o PGR.",
      whenToUse:
        "Para organizações que já completaram a primeira avaliação COPSOQ e querem criar continuidade e melhoria estrutural — não apenas uma avaliação pontual.",
      implementationSteps: [
        "Definir composição (RH, SST, CIPA, lideranças, trabalhadores representativos)",
        "Criar calendário anual de reuniões mensais",
        "Estabelecer agenda padrão: dados → decisões → ações → evidências",
        "Vincular comitê ao ciclo NR-1 (plan → identify → assess → control → evidence → review)",
        "Registrar atas e deliberações como evidência de participação",
        "Apresentar relatório semestral à diretoria",
        "Comemorar conquistas e aprender com o que não funcionou",
      ],
      metrics: [
        "Reuniões realizadas",
        "Ações do plano concluídas",
        "Score de maturidade NR-1",
        "Evolução do score COPSOQ entre ciclos",
      ],
      evidenceLevel: "strong",
      evidenceSource: "ISO 45001:2018; ISO 45003:2021; ILO (2016)",
      requiresHumanApproval: true,
      playbookRef: "Playbook 2.0 — Governance Framework",
      nr1Evidence:
        "Gera evidências documentáveis de participação dos trabalhadores e melhoria contínua",
    },
    {
      id: "flexible_work_001",
      title: "Políticas de flexibilidade de horário e local com equidade",
      driver: "flexibility",
      additionalDrivers: ["energy", "stress", "inclusion_belonging"],
      riskFactors: ["Sobrecarga", "Trabalho remoto sem suporte", "Fronteiras trabalho-vida"],
      mteFactors: ["MTE-10", "MTE-13"],
      copsoqDimensions: ["influence", "work_pace"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "low_medium",
      estimatedTimeToImpact: "1_3_months",
      description:
        "Criar políticas formais de flexibilidade (horário, local, dias remotos) com critérios equitativos — não apenas para cargos sênior — e com suporte estrutural para quem trabalha remotamente.",
      implementationSteps: [
        "Mapear quais funções podem ter flexibilidade e quais não podem, com critérios transparentes",
        "Criar política escrita com regras claras (quem, quando, como, com quais responsabilidades)",
        "Garantir que flexibilidade não penalize progressão de carreira",
        "Criar suporte estrutural para home office (equipamentos, ergonomia, conectividade)",
        "Incluir trabalhadores de chão-de-fábrica em soluções alternativas (horário flexível, bancos de horas justos)",
        "Monitorar equidade de acesso entre grupos",
      ],
      metrics: [
        "Score COPSOQ influence",
        "Satisfação com equilíbrio trabalho-vida",
        "Turnover",
        "Absenteísmo",
      ],
      evidenceLevel: "moderate_strong",
      evidenceSource: "Eurofound (2021); Playbook 2.0 — Flexibility Driver",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Flexibility Driver",
    },
    {
      id: "learning_pathways_001",
      title: "Trilhas de aprendizagem conectadas ao trabalho real",
      driver: "learning",
      additionalDrivers: ["achievement", "purpose"],
      riskFactors: ["Baixo desenvolvimento", "Desengajamento", "Turnover"],
      mteFactors: [],
      copsoqDimensions: ["possibilities_development", "meaning"],
      controlHierarchy: "Administrativo",
      controlLevel: 4,
      level: "primary_prevention",
      estimatedCost: "medium",
      estimatedTimeToImpact: "3_6_months",
      description:
        "Criar trilhas de aprendizagem baseadas em necessidades reais identificadas pelos dados, com foco em aplicação imediata ao trabalho — não apenas cursos de compliance.",
      implementationSteps: [
        "Usar dados COPSOQ e plano de ação para identificar lacunas de aprendizagem por grupo",
        "Criar trilhas de 45–90 minutos com microlearning, casos e prática",
        "Priorizar aprendizagem peer-to-peer e no contexto do trabalho",
        "Criar PDI (Plano de Desenvolvimento Individual) com o trabalhador, não para o trabalhador",
        "Mentoria estruturada: 30 minutos mensais com acordo de desenvolvimento",
        "Certificar conclusões como evidência no plano de ação",
        "Medir aplicação no trabalho real — não apenas conclusão",
      ],
      metrics: [
        "Taxa de conclusão de trilhas",
        "Aplicação no trabalho (avaliação 30 dias)",
        "Score COPSOQ possibilities_development",
        "Satisfação com desenvolvimento",
      ],
      evidenceLevel: "moderate",
      evidenceSource: "Playbook 2.0 — Learning Driver; Dweck (2006); Ebbinghaus forgetting curve",
      requiresHumanApproval: false,
      playbookRef: "Playbook 2.0 — Learning Driver",
    },
  ] satisfies Intervention[],
  interventionMatrix: {
    description:
      "Matriz de priorização de intervenções baseada em força da evidência × custo × velocidade de impacto",
    quadrants: [
      { id: "Q1", name: "Alta evidência + Baixo custo = Implante já", color: "green", priority: "P0" },
      { id: "Q2", name: "Alta evidência + Alto custo = Planeje com orçamento", color: "blue", priority: "P1" },
      { id: "Q3", name: "Baixa evidência + Baixo custo = Pilote e meça", color: "amber", priority: "P2" },
      { id: "Q4", name: "Baixa evidência + Alto custo = Reavalie antes", color: "red", priority: "P3" },
    ] satisfies InterventionQuadrant[],
  },
} as const;

export type Nr1Interventions = typeof nr1Interventions;

/** Look up an intervention by id (used by Edge Function action plans). */
export function findIntervention(id: string): Intervention | undefined {
  return nr1Interventions.interventions.find((i) => i.id === id);
}

/** Filter interventions that target a given Playbook driver (primary or additional). */
export function interventionsByDriver(driverSlug: string): Intervention[] {
  return nr1Interventions.interventions.filter(
    (i) => i.driver === driverSlug || i.additionalDrivers.includes(driverSlug),
  );
}

/** Quadrant lookup for evidence × cost matrix (Q1..Q4). */
export function interventionQuadrant(i: Intervention): InterventionQuadrant {
  const highEvidence = i.evidenceLevel === "critical" || i.evidenceLevel === "strong" || i.evidenceLevel === "moderate_strong";
  const highCost = i.estimatedCost === "medium_high" || i.estimatedCost === "high" || i.estimatedCost === "medium";
  const id: "Q1" | "Q2" | "Q3" | "Q4" =
    highEvidence && !highCost ? "Q1" :
    highEvidence &&  highCost ? "Q2" :
   !highEvidence && !highCost ? "Q3" : "Q4";
  return nr1Interventions.interventionMatrix.quadrants.find((q) => q.id === id)!;
}

const COST_LABEL: Record<CostBand, string> = {
  low: "Baixo",
  low_medium: "Baixo–Médio",
  medium: "Médio",
  medium_high: "Médio–Alto",
  high: "Alto",
};
export const costLabel = (c: CostBand) => COST_LABEL[c];

const TIME_LABEL: Record<TimeToImpact, string> = {
  immediate_1_month: "Imediato · até 1 mês",
  "1_3_months": "1–3 meses",
  "3_6_months": "3–6 meses",
  "1_6_months": "1–6 meses",
  "3_12_months": "3–12 meses",
  "6_12_months": "6–12 meses",
};
export const timeLabel = (t: TimeToImpact) => TIME_LABEL[t];

const LEVEL_LABEL: Record<PreventionLevel, string> = {
  primary_prevention: "Prevenção primária",
  primary_secondary_prevention: "Primária + Secundária",
  secondary_prevention: "Prevenção secundária",
  tertiary_prevention: "Prevenção terciária",
};
export const preventionLabel = (l: PreventionLevel) => LEVEL_LABEL[l];
