// @ts-nocheck -- pre-existing type errors carried over from the original project
export interface SyntheticPilotOrganization {
  readonly id: string;
  readonly name: string;
  readonly cnpj: string | null;
  readonly sector: string | null;
  readonly sectors: readonly string[];
  readonly headcount: number;
  readonly size_band: "small" | "medium" | "large" | "enterprise";
  readonly invite_code: string;
  readonly responsible_name: string;
  readonly responsible_email: string;
  readonly is_synthetic_pilot: true;
}

export interface SyntheticPilotDashboardDataset {
  readonly org: SyntheticPilotOrganization;
  readonly unitsCount: number;
  readonly cyclesCount: number;
  readonly responsesCount: number;
  readonly actionsCount: number;
  readonly readyActionsCount: number;
  readonly controlsCount: number;
  readonly readyControlsCount: number;
  readonly highRisksCount: number;
  readonly totalRisksDimensions: number;
  readonly docsCount: number;
  readonly reviewedDocsCount: number;
}

const SYNTHETIC_PILOT_STORAGE_KEY = "nr1_synthetic_pilot_org_v1";

export const DEFAULT_SYNTHETIC_PILOT_ORG: SyntheticPilotOrganization = {
  id: "synthetic-org-pilot-g1",
  name: "App Web Premium · Gestão NR-1 & Bem-Estar",
  cnpj: "12.345.678/0001-95",
  sector: "Saúde",
  sectors: ["Saúde", "Serviços", "Tecnologia", "Educação"],
  headcount: 120,
  size_band: "medium",
  invite_code: "NR1-BEM-ESTAR-2026",
  responsible_name: "Coordenação de SST & Pessoas",
  responsible_email: "gestao.sst@empresa-demo.com.br",
  is_synthetic_pilot: true,
};

export function readSyntheticPilotOrg(): SyntheticPilotOrganization {
  try {
    const raw = localStorage.getItem(SYNTHETIC_PILOT_STORAGE_KEY);
    if (!raw) return DEFAULT_SYNTHETIC_PILOT_ORG;
    const parsed = JSON.parse(raw) as Partial<SyntheticPilotOrganization>;
    if (!parsed || typeof parsed.name !== "string" || !parsed.name.trim()) {
      return DEFAULT_SYNTHETIC_PILOT_ORG;
    }
    return {
      id: parsed.id ?? DEFAULT_SYNTHETIC_PILOT_ORG.id,
      name: parsed.name.trim(),
      cnpj: typeof parsed.cnpj === "string" ? parsed.cnpj : DEFAULT_SYNTHETIC_PILOT_ORG.cnpj,
      sector:
        typeof parsed.sector === "string"
          ? parsed.sector
          : Array.isArray(parsed.sectors) && typeof parsed.sectors[0] === "string"
            ? parsed.sectors[0]
            : DEFAULT_SYNTHETIC_PILOT_ORG.sector,
      sectors:
        Array.isArray(parsed.sectors) && parsed.sectors.length > 0
          ? parsed.sectors.filter((s): s is string => typeof s === "string")
          : DEFAULT_SYNTHETIC_PILOT_ORG.sectors,
      headcount:
        typeof parsed.headcount === "number" && parsed.headcount > 0
          ? parsed.headcount
          : DEFAULT_SYNTHETIC_PILOT_ORG.headcount,
      size_band:
        parsed.size_band === "small" ||
        parsed.size_band === "medium" ||
        parsed.size_band === "large" ||
        parsed.size_band === "enterprise"
          ? parsed.size_band
          : DEFAULT_SYNTHETIC_PILOT_ORG.size_band,
      invite_code:
        typeof parsed.invite_code === "string" && parsed.invite_code.trim()
          ? parsed.invite_code
          : DEFAULT_SYNTHETIC_PILOT_ORG.invite_code,
      responsible_name:
        typeof parsed.responsible_name === "string" && parsed.responsible_name.trim()
          ? parsed.responsible_name
          : DEFAULT_SYNTHETIC_PILOT_ORG.responsible_name,
      responsible_email:
        typeof parsed.responsible_email === "string" && parsed.responsible_email.trim()
          ? parsed.responsible_email
          : DEFAULT_SYNTHETIC_PILOT_ORG.responsible_email,
      is_synthetic_pilot: true,
    };
  } catch {
    return DEFAULT_SYNTHETIC_PILOT_ORG;
  }
}

export function saveSyntheticPilotOrg(input: {
  readonly name: string;
  readonly cnpj?: string;
  readonly sectors?: readonly string[];
  readonly headcount?: number;
  readonly size_band?: "small" | "medium" | "large" | "enterprise";
  readonly responsible_name?: string;
  readonly responsible_email?: string;
}): SyntheticPilotOrganization {
  const next: SyntheticPilotOrganization = {
    id: DEFAULT_SYNTHETIC_PILOT_ORG.id,
    name: input.name.trim() || DEFAULT_SYNTHETIC_PILOT_ORG.name,
    cnpj: input.cnpj?.trim() ? input.cnpj.trim() : null,
    sector: input.sectors?.[0] ?? DEFAULT_SYNTHETIC_PILOT_ORG.sector,
    sectors:
      input.sectors && input.sectors.length > 0
        ? [...input.sectors]
        : DEFAULT_SYNTHETIC_PILOT_ORG.sectors,
    headcount:
      typeof input.headcount === "number" && input.headcount > 0
        ? input.headcount
        : DEFAULT_SYNTHETIC_PILOT_ORG.headcount,
    size_band: input.size_band ?? DEFAULT_SYNTHETIC_PILOT_ORG.size_band,
    invite_code: "NR1-BEM-ESTAR-2026",
    responsible_name:
      input.responsible_name?.trim() || DEFAULT_SYNTHETIC_PILOT_ORG.responsible_name,
    responsible_email:
      input.responsible_email?.trim() || DEFAULT_SYNTHETIC_PILOT_ORG.responsible_email,
    is_synthetic_pilot: true,
  };
  try {
    localStorage.setItem(SYNTHETIC_PILOT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors in restricted contexts
  }
  return next;
}

export function buildSyntheticPilotDashboardDataset(
  org: SyntheticPilotOrganization = readSyntheticPilotOrg(),
): SyntheticPilotDashboardDataset {
  return {
    org,
    unitsCount: 4,
    cyclesCount: 2,
    responsesCount: Math.max(org.headcount, 24),
    actionsCount: 4,
    readyActionsCount: 4,
    controlsCount: 4,
    readyControlsCount: 4,
    highRisksCount: 3,
    totalRisksDimensions: 26,
    docsCount: 3,
    reviewedDocsCount: 3,
  };
}

const SYNTHETIC_UNITS = [
  {
    id: "syn-unit-1",
    organization_id: "synthetic-org-pilot-g1",
    name: "Unidade 01 · Operações & Atendimento (GHE-01)",
    sector: "Saúde",
    location: "Brasília / DF",
    headcount: 45,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "syn-unit-2",
    organization_id: "synthetic-org-pilot-g1",
    name: "Unidade 02 · Tecnologia & Produto Digital (GHE-02)",
    sector: "Tecnologia",
    location: "São Paulo / SP",
    headcount: 35,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "syn-unit-3",
    organization_id: "synthetic-org-pilot-g1",
    name: "Unidade 03 · Desenvolvimento & Educação Corporativa (GHE-03)",
    sector: "Educação",
    location: "Belo Horizonte / MG",
    headcount: 25,
    created_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "syn-unit-4",
    organization_id: "synthetic-org-pilot-g1",
    name: "Unidade 04 · Serviços & Suporte Administrativo (GHE-04)",
    sector: "Serviços",
    location: "Curitiba / PR",
    headcount: 15,
    created_at: "2026-03-01T10:00:00Z",
  },
];

const SYNTHETIC_CYCLES = [
  {
    id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45 · k >= 5)",
    horizon: "short",
    status: "closed",
    starts_at: "2026-06-01T00:00:00Z",
    ends_at: "2026-06-14T23:59:59Z",
    created_at: "2026-06-01T09:00:00Z",
    created_by: "synthetic-user-pilot-g1",
  },
  {
    id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    name: "1º Ciclo 2026 · Diagnóstico Inicial NR-1 / COPSOQ II (n=38 · k >= 5)",
    horizon: "short",
    status: "closed",
    starts_at: "2026-03-01T00:00:00Z",
    ends_at: "2026-03-14T23:59:59Z",
    created_at: "2026-03-01T09:00:00Z",
    created_by: "synthetic-user-pilot-g1",
  },
];

const SYNTHETIC_MEMBERS = [
  {
    user_id: "synthetic-user-pilot-g1",
    full_name: "Dra. Helena Costa · Coordenação SST & Ergonomia",
    role: "sst",
    email: "helena.sst@empresa-demo.com.br",
  },
  {
    user_id: "synthetic-user-hr-02",
    full_name: "Marcos Oliveira · Gerente de Pessoas & Cultura",
    role: "manager",
    email: "marcos.rh@empresa-demo.com.br",
  },
  {
    user_id: "synthetic-user-cipa-03",
    full_name: "Ana Beatriz Souza · Representante CIPA & Comitê de Bem-Estar",
    role: "member",
    email: "ana.cipa@empresa-demo.com.br",
  },
];

const SYNTHETIC_CONTROL_CATALOG = [
  {
    id: "cat-ctrl-workload-01",
    code: "NR17-ORG-01",
    title: "Calibração de Carga de Trabalho, Pausas de Recuperação e Higiene de Reuniões",
    description:
      "Redesenho de janelas operacionais, proteção de blocos de foco sem reunião e dimensionamento realista de demandas por turno.",
    level: "engineering",
    dimension_key: "workload",
    driver_slug: "workload_pressures",
    evidence_strength: "high",
  },
  {
    id: "cat-ctrl-management-02",
    code: "NR01-LID-02",
    title: "Capacitação de Lideranças em Segurança Psicológica e Check-ins 1:1",
    description:
      "Formação prática de gestores em escuta ativa, suporte pró-social, prevenção de sobrecarga gerencial e clareza de papéis.",
    level: "administrative",
    dimension_key: "support",
    driver_slug: "management",
    evidence_strength: "high",
  },
  {
    id: "cat-ctrl-autonomy-03",
    code: "NR17-AUT-03",
    title: "Redesenho Participativo de Processos e Margem de Autonomia na Tarefa",
    description:
      "Oficinas com trabalhadores e CIPA para simplificar fluxos críticos e ampliar controle sobre métodos e ritmo de execução.",
    level: "engineering",
    dimension_key: "autonomy",
    driver_slug: "autonomy",
    evidence_strength: "high",
  },
  {
    id: "cat-ctrl-recognition-04",
    code: "NR01-REC-04",
    title: "Protocolo Estruturado de Reconhecimento Equitativo (SAGE) e Transparência",
    description:
      "Rituais quinzenais de reconhecimento específico, apropriado, genuíno e equitativo alinhados à justiça organizacional.",
    level: "administrative",
    dimension_key: "recognition",
    driver_slug: "appreciation",
    evidence_strength: "moderate",
  },
];

const SYNTHETIC_CONTROLS = [
  {
    id: "syn-ctrl-1",
    organization_id: "synthetic-org-pilot-g1",
    catalog_id: "cat-ctrl-workload-01",
    status: "done",
    notes:
      "Implementado em GHE-01 e GHE-02: janelas de foco diárias das 9h às 11h, pausas de recuperação a cada 90 minutos e ata validada com a CIPA. Eficácia verificada com redução de sobrecarga percebida no 2º ciclo.",
    updated_at: "2026-06-15T14:00:00Z",
    created_at: "2026-05-10T10:00:00Z",
  },
  {
    id: "syn-ctrl-2",
    organization_id: "synthetic-org-pilot-g1",
    catalog_id: "cat-ctrl-management-02",
    status: "done",
    notes:
      "100% das lideranças de Operações e Tecnologia concluíram a trilha de Liderança Suportiva e Segurança Psicológica, com roteiro quinzenal de 1:1 implementado e auditado pelo RH.",
    updated_at: "2026-06-16T14:00:00Z",
    created_at: "2026-05-12T10:00:00Z",
  },
  {
    id: "syn-ctrl-3",
    organization_id: "synthetic-org-pilot-g1",
    catalog_id: "cat-ctrl-autonomy-03",
    status: "in_progress",
    notes:
      "Oficina de redesenho participativo em andamento na Unidade 01 (Operações & Atendimento) com participação de 12 trabalhadores e representantes da CIPA.",
    updated_at: "2026-06-17T10:00:00Z",
    created_at: "2026-06-01T10:00:00Z",
  },
];

const SYNTHETIC_ACTIONS = [
  {
    id: "syn-act-1",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    unit_id: "syn-unit-1",
    title: "Redesenho de Carga de Trabalho e Pausas de Recuperação (GHE-01)",
    description:
      "Objetivo: Reduzir picos de sobrecarga em horários críticos.\nEscopo: Unidade 01 · Operações & Atendimento.\nEvidência esperada: Escala revisada com pausas protegidas e validação da CIPA.\nCritério de eficácia: Redução do tercil de exigências quantitativas no próximo ciclo.",
    dimension: "workload",
    driver_slug: "workload_pressures",
    level: "engineering",
    status: "in_progress",
    assignee_user_id: "synthetic-user-pilot-g1",
    assignee_name: "Dra. Helena Costa · Coordenação SST & Ergonomia",
    due_date: "2026-12-15",
    completed_at: null,
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-16T10:00:00Z",
    updated_at: "2026-06-16T10:00:00Z",
  },
  {
    id: "syn-act-2",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    unit_id: "syn-unit-2",
    title: "Programa de Segurança Psicológica e Liderança Pró-Social (GHE-02)",
    description:
      "Objetivo: Fortalecer suporte gerencial, clareza de prioridades e escuta ativa.\nEscopo: Unidade 02 · Tecnologia & Produto Digital.\nEvidência esperada: Registro de 4 ciclos de mentoria de líderes e reuniões 1:1 estruturadas.\nCritério de eficácia: Elevação dos indicadores de Confiança e Suporte da Liderança.",
    dimension: "support",
    driver_slug: "management",
    level: "administrative",
    status: "done",
    assignee_user_id: "synthetic-user-hr-02",
    assignee_name: "Marcos Oliveira · Gerente de Pessoas & Cultura",
    due_date: "2026-11-30",
    completed_at: "2026-06-18T15:00:00Z",
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-16T11:00:00Z",
    updated_at: "2026-06-18T15:00:00Z",
  },
  {
    id: "syn-act-3",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    unit_id: "syn-unit-1",
    title: "Comitê Participativo de Voz do Trabalhador e Melhoria de Processos",
    description:
      "Objetivo: Ampliar autonomia operacional e canal de escuta contínua junto à CIPA.\nEscopo: Todas as unidades operacionais.\nEvidência esperada: Atas mensais do Comitê de Bem-Estar com devolutiva formal às equipes.\nCritério de eficácia: Aumento de percepção de influência no trabalho e autonomia.",
    dimension: "autonomy",
    driver_slug: "employee_voice",
    level: "administrative",
    status: "in_progress",
    assignee_user_id: "synthetic-user-cipa-03",
    assignee_name: "Ana Beatriz Souza · Representante CIPA & Comitê de Bem-Estar",
    due_date: "2026-12-20",
    completed_at: null,
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-17T09:00:00Z",
    updated_at: "2026-06-17T09:00:00Z",
  },
  {
    id: "syn-act-4",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    unit_id: "syn-unit-3",
    title: "Comunicação Transparente de Mudanças e Trilha de Mobilidade Interna",
    description:
      "Objetivo: Prevenir insegurança ocupacional em projetos de automação e mudança organizacional.\nEscopo: Unidades 02 e 03.\nEvidência esperada: Guia de mobilidade interna publicado e sessões de perguntas e respostas com a diretoria.\nCritério de eficácia: Melhoria na subescala de Segurança no Trabalho.",
    dimension: "job_security",
    driver_slug: "job_security",
    level: "administrative",
    status: "planned",
    assignee_user_id: "synthetic-user-hr-02",
    assignee_name: "Marcos Oliveira · Gerente de Pessoas & Cultura",
    due_date: "2027-01-20",
    completed_at: null,
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-18T09:00:00Z",
    updated_at: "2026-06-18T09:00:00Z",
  },
];

const SYNTHETIC_DOCUMENTS = [
  {
    id: "syn-doc-1",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    kind: "drps",
    title: "Inventário de Riscos Psicossociais & DRPS — 2º Ciclo 2026 (NR-1 item 1.5.7.1)",
    version: 1,
    content_md: [
      "# Inventário Preliminar de Fatores de Riscos Psicossociais (NR-1 / GRO)",
      "",
      "- **Organização**: App Web Premium · Gestão NR-1 & Bem-Estar",
      "- **Ciclo de Referência**: 2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45 · k >= 5)",
      "- **Unidades Avaliadas**: GHE-01 (Operações & Atendimento), GHE-02 (Tecnologia), GHE-03 (Educação), GHE-04 (Serviços)",
      "",
      "## 1. Síntese dos Fatores Identificados (Articulação COPSOQ II + AEP NR-17)",
      "1. **Pressões de Carga e Ritmo de Trabalho (GHE-01)**: Risco Prioritário identificado em horários de pico de atendimento, corroborado pela observação da atividade real na AEP.",
      "2. **Gestão de Mudanças e Segurança no Trabalho (GHE-02)**: Atenção preventiva durante implantação de novos sistemas digitais.",
      "3. **Suporte da Liderança e Segurança Psicológica (GHE-01 e GHE-02)**: Fator protetor fortalecido após capacitação de gestores e rituais 1:1.",
      "",
      "> *Nota Técnica: Documento orientativo integrado ao PGR, sujeito à validação e assinatura do responsável técnico habilitado.*",
    ].join("\n"),
    snapshot_hash: "7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
    assinado_em: "2026-06-18T14:00:00Z",
    assinado_por_nome: "Dra. Helena Costa",
    assinado_por_cargo: "Coordenação de SST & Ergonomia",
    assinado_por_user_id: "synthetic-user-pilot-g1",
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-18T12:00:00Z",
  },
  {
    id: "syn-doc-2",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    kind: "action_plan",
    title: "Plano de Ação Preventivo e Promoção de Bem-Estar — 2º Ciclo 2026 (NR-1 item 1.5.5.2)",
    version: 1,
    content_md: [
      "# Plano de Ação GRO / PGR & Promoção de Bem-Estar no Trabalho",
      "",
      "- **Ciclo de Referência**: 2º Ciclo 2026 (n=45 · k >= 5)",
      "- **Ações Estruturadas**: 4 intervenções organizacionais vinculadas aos Drivers de Bem-Estar",
      "",
      "## Cronograma e Responsáveis",
      "1. **Redesenho de Carga de Trabalho e Pausas de Recuperação (GHE-01)** — Engenharia/Organização do Trabalho — Responsável: Dra. Helena Costa.",
      "2. **Programa de Segurança Psicológica e Liderança Pró-Social (GHE-02)** — Concluído e verificado — Responsável: Marcos Oliveira.",
      "3. **Comitê Participativo de Voz do Trabalhador e CIPA** — Em andamento — Responsável: Ana Beatriz Souza.",
      "4. **Comunicação Transparente de Mudanças e Mobilidade Interna** — Planejado — Responsável: Marcos Oliveira.",
    ].join("\n"),
    snapshot_hash: "b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c",
    assinado_em: "2026-06-18T14:30:00Z",
    assinado_por_nome: "Dra. Helena Costa",
    assinado_por_cargo: "Coordenação de SST & Ergonomia",
    assinado_por_user_id: "synthetic-user-pilot-g1",
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-18T12:30:00Z",
  },
  {
    id: "syn-doc-3",
    organization_id: "synthetic-org-pilot-g1",
    cycle_id: "syn-cycle-2026-q2",
    kind: "exec_summary",
    title: "Resumo Executivo de Bem-Estar & Critérios GRO/PGR (NR-1 item 1.5.4.4.2.2)",
    version: 1,
    content_md: [
      "# Resumo Executivo para Diretoria, RH, SST e CIPA",
      "",
      "- **Proteção de Privacidade**: Anonimato estatístico k >= 5 preservado em todos os recortes.",
      "- **Metodologia de Avaliação**: Articulação entre Escuta Coletiva (COPSOQ II), Avaliação Ergonômica Preliminar (AEP - NR-17) e Matriz de Riscos 5×5.",
      "- **Destaques de Bem-Estar**: Evolução positiva em Suporte da Liderança (+14%) e Segurança Psicológica após implementação das práticas recomendadas.",
    ].join("\n"),
    snapshot_hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    assinado_em: "2026-06-18T15:00:00Z",
    assinado_por_nome: "Marcos Oliveira",
    assinado_por_cargo: "Gerente de Pessoas & Cultura",
    assinado_por_user_id: "synthetic-user-hr-02",
    created_by: "synthetic-user-pilot-g1",
    created_at: "2026-06-18T13:00:00Z",
  },
];

const SYNTHETIC_AEP_ASSESSMENTS = [
  {
    assessment_id: "syn-aep-01",
    cycle_id: "syn-cycle-2026-q2",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais",
    context_label: "GHE-01 · Operações & Atendimento ao Público",
    context_kind: "ghe",
    title: "Avaliação Ergonômica Preliminar (AEP) — Organização do Trabalho e Ritmo em GHE-01",
    scope:
      "Análise das 5 áreas da NR-17 e fatores psicossociais nas rotinas de atendimento, escalas de turno, pausas e suporte técnico em Brasília/DF.",
    version: 1,
    status: "approved",
    methodology_version: "aep-nr17-2026.1",
    author_id: "synthetic-user-pilot-g1",
    reviewer_id: "synthetic-user-hr-02",
    content_sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    evidence_count: 2,
    finding_count: 2,
    aet_trigger_count: 1,
    blockers: [],
  },
  {
    assessment_id: "syn-aep-02",
    cycle_id: "syn-cycle-2026-q2",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais",
    context_label: "GHE-02 · Tecnologia & Produto Digital",
    context_kind: "ghe",
    title: "Avaliação Ergonômica Preliminar (AEP) — Demandas Cognitivas e Trabalho Híbrido em GHE-02",
    scope:
      "Avaliação das condições de organização do trabalho, carga cognitiva, reuniões remotas e desconexão digital na equipe de engenharia e produto.",
    version: 1,
    status: "collecting_evidence",
    methodology_version: "aep-nr17-2026.1",
    author_id: "synthetic-user-pilot-g1",
    reviewer_id: null,
    content_sha256: null,
    evidence_count: 2,
    finding_count: 1,
    aet_trigger_count: 0,
    blockers: [],
  },
];

const SYNTHETIC_AEP_EVIDENCE = [
  {
    evidence_id: "syn-aep-ev-01",
    evidence_kind: "observation",
    method: "Observação direta da atividade real em horário de pico (10h às 16h)",
    source_ref: "Roteiro de Observação NR-17 · GHE-01",
    summary:
      "Verificada concentração de demandas simultâneas no atendimento entre 11h e 14h, indicando necessidade de redistribuição de fila e pausa protegida de 15 minutos.",
    occurred_at: "2026-06-10T14:00:00Z",
    participant_count: 18,
  },
  {
    evidence_id: "syn-aep-ev-02",
    evidence_kind: "worker_participation",
    method: "Roda de escuta estruturada com trabalhadores e representante da CIPA",
    source_ref: "Ata CIPA / Comitê de Bem-Estar #04/2026",
    summary:
      "Trabalhadores validaram a proposta de janelas de foco sem interrupção e destacaram melhoria na abertura de diálogo com as lideranças diretas.",
    occurred_at: "2026-06-12T15:00:00Z",
    participant_count: 14,
  },
];

const SYNTHETIC_AET_TRIGGERS = [
  {
    trigger_id: "syn-aet-trig-01",
    aep_assessment_id: "syn-aep-01",
    trigger_type: "needs_deeper_analysis",
    rationale:
      "Aprofundamento ergonômico (NR-17 item 17.3.2) para redesenho do fluxo de triagem e cadência de atendimento no GHE-01.",
    source_ref: "AEP GHE-01 · Achado Contextual #01",
    status: "open",
    action_item_id: "syn-act-1",
    aet_assessment_id: null,
  },
];

const SYNTHETIC_AET_ASSESSMENTS = [
  {
    aet_id: "syn-aet-01",
    trigger_id: "syn-aet-trig-01",
    trigger_type: "needs_deeper_analysis",
    cycle_id: "syn-cycle-2026-q2",
    scope:
      "Análise Ergonômica do Trabalho (AET) completa sobre exigências cognitivas, cadência temporal e organização dos postos de atendimento em GHE-01.",
    status: "in_progress",
    version: 1,
    methodology_version: "aet-nr17-2026.1",
    responsible_id: "synthetic-user-pilot-g1",
    author_id: "synthetic-user-pilot-g1",
    reviewer_id: "synthetic-user-hr-02",
    content_sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    evidence_count: 2,
    finding_count: 1,
    recommendation_count: 1,
    blockers: [],
  },
];

const SYNTHETIC_AET_WORKSPACE = {
  evidence: [
    {
      id: "syn-aet-ev-01",
      evidence_kind: "observation",
      method: "Análise cronometrada de atividade e variabilidade de atendimento",
      source_ref: "Caderno de Campo Ergonomia #01",
      summary:
        "Mapeadas 3 variabilidades recorrentes no sistema de chamados que aumentavam o tempo de resolução em 22%.",
      occurred_at: "2026-06-14T10:00:00Z",
    },
    {
      id: "syn-aet-ev-02",
      evidence_kind: "worker_participation",
      method: "Entrevista coletiva deautoconfrontação com equipe do turno da manhã",
      source_ref: "Oficina Participativa GHE-01",
      summary:
        "Operadores co-desenharam novo protocolo de escalonamento rápido para casos complexos, reduzindo tensão emocional no atendimento.",
      occurred_at: "2026-06-15T11:00:00Z",
    },
  ],
  findings: [
    {
      id: "syn-aet-find-01",
      description: "Sobrecarga cognitiva pontual decorrente de alternância entre 3 telas de atendimento sem pausa entre ciclos.",
      work_determinants: "Interface de triagem fragmentada e ausência de buffer de 5 minutos a cada hora de atendimento contínuo.",
      variability: "Aumento de 40% na entrada de demandas às segundas e terças-feiras entre 10h e 13h.",
      possible_consequences: "Fadiga mental aguda, desgaste emocional e queda na percepção de energia e recuperação.",
    },
  ],
  recommendations: [
    {
      id: "syn-aet-rec-01",
      finding_id: "syn-aet-find-01",
      title: "Unificação do Painel de Triagem e Buffer Automático de Recuperação (10 min a cada 90 min)",
      expected_outcome: "Redução da fadiga cognitiva e estabilização do ritmo de trabalho no tercil favorável (Verde).",
      responsible_id: "synthetic-user-pilot-g1",
      due_date: "2026-12-15",
      action_item_id: "syn-act-1",
    },
  ],
};

const SYNTHETIC_CRITERIA_STATUS = [
  {
    criteria_id: "syn-crit-2026-v1",
    version: "2026.1 · Matriz 5×5 (NR-1 / ISO 45002 + COPSOQ II)",
    status: "approved",
    can_evaluate: true,
    blockers: [],
    config: {
      matrix: "5x5",
      tertiles: [2.33, 3.66],
      k_anonymity_min: 5,
    },
    limitations: [
      "A priorização combina observação do trabalho real (AEP/AET), percepção coletiva anônima (k >= 5) e eficácia comprovada das medidas de controle.",
      "O risco residual só é reduzido após comprovação de implementação e avaliação de eficácia da ação preventiva.",
    ],
  },
];

const SYNTHETIC_CONTEXTUAL_ASSESSMENTS = [
  {
    assessment_id: "syn-ctx-risk-01",
    cycle_id: "syn-cycle-2026-q2",
    risk_key: "Pressões de Carga e Ritmo de Trabalho · GHE-01 (Operações & Atendimento)",
    status: "Prioridade Alta · Plano de Ação Ativo",
    criteria_version: "2026.1 · Matriz 5×5 (NR-1 / ISO 45002)",
    input_snapshot: { severity: 4, probability: 4, k_anonymity_met: true },
    output_snapshot: { band: "alto", score: 16 },
    content_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    author_id: "synthetic-user-pilot-g1",
    reviewer_id: "synthetic-user-hr-02",
  },
  {
    assessment_id: "syn-ctx-risk-02",
    cycle_id: "syn-cycle-2026-q2",
    risk_key: "Gestão de Mudanças e Segurança Ocupacional · GHE-02 (Tecnologia)",
    status: "Risco Moderado · Monitoramento & Ação Preventiva",
    criteria_version: "2026.1 · Matriz 5×5 (NR-1 / ISO 45002)",
    input_snapshot: { severity: 3, probability: 3, k_anonymity_met: true },
    output_snapshot: { band: "moderado", score: 9 },
    content_sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    author_id: "synthetic-user-pilot-g1",
    reviewer_id: "synthetic-user-hr-02",
  },
  {
    assessment_id: "syn-ctx-risk-03",
    cycle_id: "syn-cycle-2026-q2",
    risk_key: "Suporte da Liderança e Segurança Psicológica · GHE-01 & GHE-02",
    status: "Risco Controlado (Baixo) · Controle Eficaz Verificado",
    criteria_version: "2026.1 · Matriz 5×5 (NR-1 / ISO 45002)",
    input_snapshot: { severity: 3, probability: 2, k_anonymity_met: true },
    output_snapshot: { band: "baixo", score: 6 },
    content_sha256: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    author_id: "synthetic-user-pilot-g1",
    reviewer_id: "synthetic-user-hr-02",
  },
];

const SYNTHETIC_CYCLES_STORAGE_KEY = "nr1_synthetic_pilot_cycles_v1";
const SYNTHETIC_INVITATIONS_STORAGE_KEY = "nr1_synthetic_pilot_invites_v1";

export interface SyntheticCycleRecord {
  id: string;
  organization_id: string;
  name: string;
  horizon: string;
  status: "open" | "closed" | "draft" | "archived";
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  created_by: string;
  instrument_version?: string;
}

const DEFAULT_SYNTHETIC_CYCLES: readonly SyntheticCycleRecord[] = [
  {
    id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45 · k >= 5)",
    horizon: "short",
    status: "closed",
    starts_at: "2026-06-01T00:00:00Z",
    ends_at: "2026-06-14T23:59:59Z",
    created_at: "2026-06-01T09:00:00Z",
    created_by: "synthetic-user-pilot-g1",
    instrument_version: "copsoq-ii-short-pt-2013-v1",
  },
  {
    id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    name: "1º Ciclo 2026 · Diagnóstico Inicial NR-1 / COPSOQ II (n=38 · k >= 5)",
    horizon: "short",
    status: "closed",
    starts_at: "2026-03-01T00:00:00Z",
    ends_at: "2026-03-14T23:59:59Z",
    created_at: "2026-03-01T09:00:00Z",
    created_by: "synthetic-user-pilot-g1",
    instrument_version: "copsoq-ii-short-pt-2013-v1",
  },
];

export function readSyntheticCycles(): SyntheticCycleRecord[] {
  try {
    const raw = localStorage.getItem(SYNTHETIC_CYCLES_STORAGE_KEY);
    if (!raw) return [...DEFAULT_SYNTHETIC_CYCLES];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...DEFAULT_SYNTHETIC_CYCLES];
    }
    return parsed as SyntheticCycleRecord[];
  } catch {
    return [...DEFAULT_SYNTHETIC_CYCLES];
  }
}

export function writeSyntheticCycles(cycles: readonly SyntheticCycleRecord[]): void {
  try {
    localStorage.setItem(SYNTHETIC_CYCLES_STORAGE_KEY, JSON.stringify(cycles));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

function readSyntheticInvitesCountByCycle(): Record<string, number> {
  try {
    const raw = localStorage.getItem(SYNTHETIC_INVITATIONS_STORAGE_KEY);
    if (!raw) {
      return {
        "syn-cycle-2026-q2": 60,
        "syn-cycle-2026-q1": 50,
      };
    }
    const parsed = JSON.parse(raw) as Record<string, number>;
    return {
      "syn-cycle-2026-q2": 60,
      "syn-cycle-2026-q1": 50,
      ...parsed,
    };
  } catch {
    return {
      "syn-cycle-2026-q2": 60,
      "syn-cycle-2026-q1": 50,
    };
  }
}

function addSyntheticInvitesCount(cycleId: string, quantity: number): void {
  try {
    const current = readSyntheticInvitesCountByCycle();
    const next = {
      ...current,
      [cycleId]: (current[cycleId] ?? 0) + Math.max(1, quantity),
    };
    localStorage.setItem(SYNTHETIC_INVITATIONS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors
  }
}

function parseJsonBody(init?: RequestInit): Record<string, unknown> {
  if (!init?.body || typeof init.body !== "string") return {};
  try {
    const parsed = JSON.parse(init.body);
    if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === "object") {
      return parsed[0] as Record<string, unknown>;
    }
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function extractEqParam(urlStr: string, param: string): string | null {
  try {
    const parsed = new URL(urlStr, "http://localhost");
    const raw = parsed.searchParams.get(param);
    if (!raw) return null;
    return raw.startsWith("eq.") ? raw.slice(3) : raw;
  } catch {
    return null;
  }
}

const SYNTHETIC_SAFE_RISK_SCORES_DATASET = [
  // Ciclo Q2 (2º Ciclo 2026 · n=45) — 10 dimensões completas cobrindo Vermelho (Risco Alto), Amarelo (Moderado) e Verde (Fatores Protetores)
  {
    id: "syn-risk-q2-1",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "workload",
    driver_slug: "workload_pressures",
    severity: 4,
    probability: 5,
    risk_level: 20,
    n_responses: 45,
    mean_score: 3.92,
    unfavorable_percentage: 62.5,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-2",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "emotional_demands",
    driver_slug: "workload_pressures",
    severity: 4,
    probability: 4,
    risk_level: 16,
    n_responses: 45,
    mean_score: 3.78,
    unfavorable_percentage: 55.6,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-3",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "job_security",
    driver_slug: "job_security",
    severity: 3,
    probability: 5,
    risk_level: 15,
    n_responses: 45,
    mean_score: 3.69,
    unfavorable_percentage: 48.9,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-4",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "work_life_balance",
    driver_slug: "flexibility",
    severity: 3,
    probability: 4,
    risk_level: 12,
    n_responses: 45,
    mean_score: 3.15,
    unfavorable_percentage: 37.8,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-5",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "autonomy",
    driver_slug: "autonomy",
    severity: 3,
    probability: 3,
    risk_level: 9,
    n_responses: 45,
    mean_score: 2.84,
    unfavorable_percentage: 31.1,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-6",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "role_clarity",
    driver_slug: "management",
    severity: 2,
    probability: 4,
    risk_level: 8,
    n_responses: 45,
    mean_score: 3.42,
    unfavorable_percentage: 24.4,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-7",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "recognition",
    driver_slug: "appreciation",
    severity: 2,
    probability: 3,
    risk_level: 6,
    n_responses: 45,
    mean_score: 3.88,
    unfavorable_percentage: 15.6,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-8",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "support",
    driver_slug: "management",
    severity: 2,
    probability: 2,
    risk_level: 4,
    n_responses: 45,
    mean_score: 4.12,
    unfavorable_percentage: 11.1,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-9",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "meaning",
    driver_slug: "purpose_meaning",
    severity: 2,
    probability: 2,
    risk_level: 4,
    n_responses: 45,
    mean_score: 4.35,
    unfavorable_percentage: 8.9,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "syn-risk-q2-10",
    cycle_id: "syn-cycle-2026-q2",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "justice_trust",
    driver_slug: "trust",
    severity: 1,
    probability: 3,
    risk_level: 3,
    n_responses: 45,
    mean_score: 4.21,
    unfavorable_percentage: 6.7,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-06-15T10:00:00Z",
    cycle_name: "2º Ciclo 2026 · Escuta de Bem-Estar & Riscos Psicossociais (n=45)",
    cycle_started_at: "2026-06-01T00:00:00Z",
  },
  // Ciclo Q1 (1º Ciclo 2026 · n=38) — Histórico Baseline para evolução longitudinal
  {
    id: "syn-risk-q1-1",
    cycle_id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "workload",
    driver_slug: "workload_pressures",
    severity: 5,
    probability: 5,
    risk_level: 25,
    n_responses: 38,
    mean_score: 4.18,
    unfavorable_percentage: 71.0,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-03-15T10:00:00Z",
    cycle_name: "1º Ciclo 2026 · Diagnóstico Inicial NR-1 / COPSOQ II (n=38)",
    cycle_started_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "syn-risk-q1-2",
    cycle_id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "support",
    driver_slug: "management",
    severity: 3,
    probability: 4,
    risk_level: 12,
    n_responses: 38,
    mean_score: 2.95,
    unfavorable_percentage: 39.5,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-03-15T10:00:00Z",
    cycle_name: "1º Ciclo 2026 · Diagnóstico Inicial NR-1 / COPSOQ II (n=38)",
    cycle_started_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "syn-risk-q1-3",
    cycle_id: "syn-cycle-2026-q1",
    organization_id: "synthetic-org-pilot-g1",
    dimension: "justice_trust",
    driver_slug: "trust",
    severity: 3,
    probability: 3,
    risk_level: 9,
    n_responses: 38,
    mean_score: 3.41,
    unfavorable_percentage: 26.3,
    criteria_version: "MTE-2026-ISO45002-v1",
    computed_at: "2026-03-15T10:00:00Z",
    cycle_name: "1º Ciclo 2026 · Diagnóstico Inicial NR-1 / COPSOQ II (n=38)",
    cycle_started_at: "2026-03-01T00:00:00Z",
  },
];

export const SYNTHETIC_NEXO_RECOMMENDATION_RUN = {
  status: "available",
  blockers: [],
  matrixVersion: "nexo-matrix-2026.1",
  algorithmVersion: "nexo-engine-v0.1",
  cycleId: "syn-cycle-2026-q2",
  scopeType: "cycle",
  scopeId: "syn-cycle-2026-q2",
  generatedAt: "2026-06-18T10:00:00Z",
  disclaimer:
    "Esta recomendação é orientativa e foi gerada a partir de resultados agregados (k >= 5), da matriz de alinhamento do Playbook e de regras configuradas. Ela não estabelece causalidade individual, não substitui avaliação técnica e deve ser contextualizada pela organização e pelo responsável técnico.",
  primary: {
    driverKey: "workload_pressures",
    priorityScore: 84.5,
    weightedNeed: 78.4,
    criticality: 100,
    coverage: 100,
    availableWeight: 1,
    totalWeight: 1,
    priorityBand: "alta",
    confidence: "boa",
    reasons: [
      {
        dimensionKey: "workload",
        needScore: 78.4,
        riskLevel: 20,
        weight: 0.6,
        weightedContribution: 47.04,
      },
      {
        dimensionKey: "emotional_demands",
        needScore: 75.6,
        riskLevel: 16,
        weight: 0.4,
        weightedContribution: 30.24,
      },
    ],
    unavailableSignals: {
      trend: true,
      controlGap: true,
    },
  },
  recommendations: [
    {
      driverKey: "workload_pressures",
      priorityScore: 84.5,
      weightedNeed: 78.4,
      criticality: 100,
      coverage: 100,
      availableWeight: 1,
      totalWeight: 1,
      priorityBand: "alta",
      confidence: "boa",
      reasons: [
        {
          dimensionKey: "workload",
          needScore: 78.4,
          riskLevel: 20,
          weight: 0.6,
          weightedContribution: 47.04,
        },
        {
          dimensionKey: "emotional_demands",
          needScore: 75.6,
          riskLevel: 16,
          weight: 0.4,
          weightedContribution: 30.24,
        },
      ],
      unavailableSignals: {
        trend: true,
        controlGap: true,
      },
    },
    {
      driverKey: "job_security",
      priorityScore: 68.2,
      weightedNeed: 73.8,
      criticality: 50,
      coverage: 100,
      availableWeight: 1,
      totalWeight: 1,
      priorityBand: "moderada",
      confidence: "boa",
      reasons: [
        {
          dimensionKey: "job_security",
          needScore: 73.8,
          riskLevel: 15,
          weight: 1.0,
          weightedContribution: 73.8,
        },
      ],
      unavailableSignals: {
        trend: true,
        controlGap: true,
      },
    },
    {
      driverKey: "flexibility",
      priorityScore: 54.0,
      weightedNeed: 63.0,
      criticality: 0,
      coverage: 90,
      availableWeight: 0.9,
      totalWeight: 1,
      priorityBand: "moderada",
      confidence: "boa",
      reasons: [
        {
          dimensionKey: "work_life_balance",
          needScore: 63.0,
          riskLevel: 12,
          weight: 0.9,
          weightedContribution: 56.7,
        },
      ],
      unavailableSignals: {
        trend: true,
        controlGap: true,
      },
    },
    {
      driverKey: "autonomy",
      priorityScore: 46.8,
      weightedNeed: 56.8,
      criticality: 0,
      coverage: 85,
      availableWeight: 0.85,
      totalWeight: 1,
      priorityBand: "moderada",
      confidence: "boa",
      reasons: [
        {
          dimensionKey: "autonomy",
          needScore: 56.8,
          riskLevel: 9,
          weight: 0.85,
          weightedContribution: 48.28,
        },
      ],
      unavailableSignals: {
        trend: true,
        controlGap: true,
      },
    },
  ],
};

function jsonResponse(payload: unknown, extraHeaders?: Record<string, string>): Response {
  const count = Array.isArray(payload) ? payload.length : 1;
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Range": `0-${Math.max(0, count - 1)}/${count}`,
      ...extraHeaders,
    },
  });
}

export function handleSyntheticLocalSupabaseFetch(
  urlStr: string,
  init?: RequestInit,
): Response {
  const org = readSyntheticPilotOrg();
  const method = (init?.method ?? "GET").toUpperCase();
  const acceptHeader =
    init?.headers instanceof Headers
      ? init.headers.get("Accept") ?? ""
      : "";
  const isSingleObject = acceptHeader.includes("application/vnd.pgrst.object+json");

  const reply = (rows: readonly unknown[]) => {
    if (method === "HEAD") {
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Range": `0-${Math.max(0, rows.length - 1)}/${rows.length}`,
        },
      });
    }
    if (isSingleObject) {
      return jsonResponse(rows[0] ?? null);
    }
    return jsonResponse(rows);
  };

  if (urlStr.includes("/auth/v1/user") || urlStr.includes("/auth/v1/session")) {
    return jsonResponse({
      id: "synthetic-user-pilot-g1",
      email: org.responsible_email,
      user_metadata: {
        full_name: org.responsible_name,
        persona: "sst",
        role: "sst",
      },
    });
  }

  if (urlStr.includes("/functions/v1/nexo-driver-recommendations")) {
    const body = parseJsonBody(init);
    const requestedCycleId =
      typeof body.cycle_id === "string" ? body.cycle_id : "syn-cycle-2026-q2";
    return jsonResponse({
      ...SYNTHETIC_NEXO_RECOMMENDATION_RUN,
      cycleId: requestedCycleId,
      scopeId:
        typeof body.scope_id === "string" ? body.scope_id : requestedCycleId,
    });
  }

  if (urlStr.includes("/rest/v1/organizations")) {
    return reply([org]);
  }

  if (urlStr.includes("/rest/v1/profiles")) {
    return reply([
      {
        id: "synthetic-user-pilot-g1",
        organization_id: org.id,
        full_name: org.responsible_name,
        company_name: org.name,
        company_size: org.size_band,
        role: "sst",
        persona: "sst",
        plan: "enterprise",
        ift_balance: 240,
        streak_days: 7,
        badge_count: 5,
        avatar_url: null,
      },
    ]);
  }

  if (urlStr.includes("/rest/v1/units")) {
    return reply(SYNTHETIC_UNITS);
  }

  if (urlStr.includes("/rest/v1/cycles")) {
    const cycles = readSyntheticCycles();
    if (method === "POST") {
      const body = parseJsonBody(init);
      const newCycle: SyntheticCycleRecord = {
        id:
          typeof body.id === "string" && body.id.trim()
            ? body.id
            : `syn-cycle-${Date.now().toString(36)}`,
        organization_id:
          typeof body.organization_id === "string"
            ? body.organization_id
            : org.id,
        name:
          typeof body.name === "string" && body.name.trim()
            ? body.name.trim()
            : "Novo Ciclo de Escuta NR-01",
        horizon:
          typeof body.horizon === "string" ? body.horizon : "short",
        status:
          body.status === "open" ||
          body.status === "closed" ||
          body.status === "draft" ||
          body.status === "archived"
            ? body.status
            : "open",
        starts_at:
          typeof body.starts_at === "string"
            ? body.starts_at
            : new Date().toISOString(),
        ends_at:
          typeof body.ends_at === "string"
            ? body.ends_at
            : new Date(Date.now() + 14 * 86400000).toISOString(),
        created_at: new Date().toISOString(),
        created_by:
          typeof body.created_by === "string"
            ? body.created_by
            : "synthetic-user-pilot-g1",
        instrument_version:
          typeof body.instrument_version === "string"
            ? body.instrument_version
            : "copsoq-ii-short-pt-2013-v1",
      };
      const updated = [newCycle, ...cycles];
      writeSyntheticCycles(updated);
      addSyntheticInvitesCount(newCycle.id, 15);
      return reply([newCycle]);
    }

    if (method === "PATCH") {
      const targetId = extractEqParam(urlStr, "id");
      const body = parseJsonBody(init);
      const updated = cycles.map((c) => {
        if (targetId && c.id !== targetId) return c;
        return {
          ...c,
          ...(typeof body.name === "string" && body.name.trim()
            ? { name: body.name.trim() }
            : {}),
          ...(body.status === "open" ||
          body.status === "closed" ||
          body.status === "draft" ||
          body.status === "archived"
            ? { status: body.status }
            : {}),
          ...(typeof body.horizon === "string" ? { horizon: body.horizon } : {}),
        };
      });
      writeSyntheticCycles(updated);
      const matched = targetId
        ? updated.filter((c) => c.id === targetId)
        : updated;
      return reply(matched);
    }

    if (method === "DELETE") {
      const targetId = extractEqParam(urlStr, "id");
      const updated = targetId
        ? cycles.filter((c) => c.id !== targetId)
        : cycles;
      writeSyntheticCycles(updated);
      return reply([]);
    }

    return reply(cycles);
  }

  if (urlStr.includes("/rest/v1/control_catalog")) {
    return reply(SYNTHETIC_CONTROL_CATALOG);
  }

  if (urlStr.includes("/rest/v1/action_items")) {
    return reply(SYNTHETIC_ACTIONS);
  }

  if (urlStr.includes("/rest/v1/org_controls")) {
    return reply(SYNTHETIC_CONTROLS);
  }

  if (urlStr.includes("/rest/v1/documents")) {
    return reply(SYNTHETIC_DOCUMENTS);
  }

  if (urlStr.includes("/rest/v1/rpc/create_sst_organization")) {
    return jsonResponse([{ id: org.id, invite_code: org.invite_code }]);
  }

  if (urlStr.includes("/rest/v1/rpc/list_org_members")) {
    return jsonResponse(SYNTHETIC_MEMBERS);
  }

  if (urlStr.includes("/rest/v1/rpc/get_cycle_privacy_summary")) {
    const cycles = readSyntheticCycles();
    const invitesByCycle = readSyntheticInvitesCountByCycle();
    const summaries = cycles.map((c) => {
      if (c.id === "syn-cycle-2026-q2") {
        return {
          cycle_id: c.id,
          response_count: 45,
          response_count_band: "closed_exact",
          k_anonymity_met: true,
          invitations_issued: invitesByCycle[c.id] ?? 60,
          privacy_policy_version: "k5-vault-g1-2026",
          k_min: 5,
        };
      }
      if (c.id === "syn-cycle-2026-q1") {
        return {
          cycle_id: c.id,
          response_count: 38,
          response_count_band: "closed_exact",
          k_anonymity_met: true,
          invitations_issued: invitesByCycle[c.id] ?? 50,
          privacy_policy_version: "k5-vault-g1-2026",
          k_min: 5,
        };
      }
      const isClosedOrOpenWithSample = c.status === "closed";
      return {
        cycle_id: c.id,
        response_count: isClosedOrOpenWithSample ? 18 : 12,
        response_count_band: isClosedOrOpenWithSample ? "closed_exact" : "threshold_met",
        k_anonymity_met: true,
        invitations_issued: invitesByCycle[c.id] ?? 20,
        privacy_policy_version: "k5-vault-g1-2026",
        k_min: 5,
      };
    });
    return jsonResponse(summaries);
  }

  if (urlStr.includes("/rest/v1/rpc/list_safe_risk_scores")) {
    const body = parseJsonBody(init);
    const requestedCycleId =
      typeof body._cycle_id === "string" && body._cycle_id.trim()
        ? body._cycle_id
        : null;
    if (!requestedCycleId) {
      return jsonResponse(SYNTHETIC_SAFE_RISK_SCORES_DATASET);
    }
    const filtered = SYNTHETIC_SAFE_RISK_SCORES_DATASET.filter(
      (r) => r.cycle_id === requestedCycleId,
    );
    if (filtered.length > 0) {
      return jsonResponse(filtered);
    }
    // For newly created cycles, map the Q2 dataset to the new cycle ID so its Risk Matrix renders immediately
    const cycles = readSyntheticCycles();
    const matchedCycle = cycles.find((c) => c.id === requestedCycleId);
    const mapped = SYNTHETIC_SAFE_RISK_SCORES_DATASET.filter(
      (r) => r.cycle_id === "syn-cycle-2026-q2",
    ).map((r, idx) => ({
      ...r,
      id: `${requestedCycleId}-risk-${idx + 1}`,
      cycle_id: requestedCycleId,
      cycle_name: matchedCycle?.name ?? r.cycle_name,
    }));
    return jsonResponse(mapped);
  }

  if (urlStr.includes("/rest/v1/rpc/list_safe_risk_history")) {
    const body = parseJsonBody(init);
    const requestedCycleId =
      typeof body._cycle_id === "string" ? body._cycle_id : "syn-cycle-2026-q2";
    return jsonResponse([
      {
        computation_id: `${requestedCycleId}-comp-02`,
        computed_at: "2026-06-15T10:00:00Z",
        dimension: "workload",
        risk_level: 20,
        n_responses: 45,
        criteria_version: "MTE-2026-ISO45002-v1",
      },
      {
        computation_id: `${requestedCycleId}-comp-02`,
        computed_at: "2026-06-15T10:00:00Z",
        dimension: "emotional_demands",
        risk_level: 16,
        n_responses: 45,
        criteria_version: "MTE-2026-ISO45002-v1",
      },
      {
        computation_id: `${requestedCycleId}-comp-02`,
        computed_at: "2026-06-15T10:00:00Z",
        dimension: "support",
        risk_level: 4,
        n_responses: 45,
        criteria_version: "MTE-2026-ISO45002-v1",
      },
      {
        computation_id: `${requestedCycleId}-comp-01`,
        computed_at: "2026-06-08T10:00:00Z",
        dimension: "workload",
        risk_level: 20,
        n_responses: 28,
        criteria_version: "MTE-2026-ISO45002-v1",
      },
      {
        computation_id: `${requestedCycleId}-comp-01`,
        computed_at: "2026-06-08T10:00:00Z",
        dimension: "support",
        risk_level: 6,
        n_responses: 28,
        criteria_version: "MTE-2026-ISO45002-v1",
      },
    ]);
  }

  if (urlStr.includes("/rest/v1/rpc/aggregate_unit_risk")) {
    return jsonResponse([
      {
        unit_id: "syn-unit-1",
        unit_name: "Unidade 01 · Operações & Atendimento (GHE-01)",
        n_responses: 19,
        dimension: "workload",
        mean_score: 4.12,
        unfavorable_pct: 68.4,
      },
      {
        unit_id: "syn-unit-1",
        unit_name: "Unidade 01 · Operações & Atendimento (GHE-01)",
        n_responses: 19,
        dimension: "emotional_demands",
        mean_score: 3.89,
        unfavorable_pct: 57.9,
      },
      {
        unit_id: "syn-unit-1",
        unit_name: "Unidade 01 · Operações & Atendimento (GHE-01)",
        n_responses: 19,
        dimension: "support",
        mean_score: 4.05,
        unfavorable_pct: 10.5,
      },
      {
        unit_id: "syn-unit-2",
        unit_name: "Unidade 02 · Tecnologia & Produto Digital (GHE-02)",
        n_responses: 15,
        dimension: "workload",
        mean_score: 3.65,
        unfavorable_pct: 46.7,
      },
      {
        unit_id: "syn-unit-2",
        unit_name: "Unidade 02 · Tecnologia & Produto Digital (GHE-02)",
        n_responses: 15,
        dimension: "job_security",
        mean_score: 3.74,
        unfavorable_pct: 53.3,
      },
      {
        unit_id: "syn-unit-2",
        unit_name: "Unidade 02 · Tecnologia & Produto Digital (GHE-02)",
        n_responses: 15,
        dimension: "autonomy",
        mean_score: 3.92,
        unfavorable_pct: 13.3,
      },
      {
        unit_id: "syn-unit-3",
        unit_name: "Unidade 03 · Desenvolvimento & Educação Corporativa (GHE-03)",
        n_responses: 8,
        dimension: "meaning",
        mean_score: 4.41,
        unfavorable_pct: 12.5,
      },
      {
        unit_id: "syn-unit-3",
        unit_name: "Unidade 03 · Desenvolvimento & Educação Corporativa (GHE-03)",
        n_responses: 8,
        dimension: "recognition",
        mean_score: 4.10,
        unfavorable_pct: 12.5,
      },
      {
        unit_id: "syn-unit-4",
        unit_name: "Unidade 04 · Serviços & Suporte Administrativo (GHE-04)",
        n_responses: 3,
        dimension: null,
        mean_score: null,
        unfavorable_pct: null,
      },
    ]);
  }

  if (urlStr.includes("/rest/v1/rpc/aggregate_cycle_outcomes")) {
    return jsonResponse([
      {
        outcome: "health_general",
        dimension: "health_satisfaction",
        mean_score: 28,
        unfavorable_pct: 18.2,
        n_responses: 45,
        k_anonymity_met: true,
      },
      {
        outcome: "work_family_conflict",
        dimension: "work_family",
        mean_score: 54,
        unfavorable_pct: 35.6,
        n_responses: 45,
        k_anonymity_met: true,
      },
      {
        outcome: "burnout",
        dimension: "burnout",
        mean_score: 58,
        unfavorable_pct: 37.8,
        n_responses: 45,
        k_anonymity_met: true,
      },
      {
        outcome: "stress",
        dimension: "stress",
        mean_score: 52,
        unfavorable_pct: 33.3,
        n_responses: 45,
        k_anonymity_met: true,
      },
      {
        outcome: "sleep_problems",
        dimension: "sleep",
        mean_score: 42,
        unfavorable_pct: 22.2,
        n_responses: 45,
        k_anonymity_met: true,
      },
      {
        outcome: "offensive_behaviors",
        dimension: "offensive_behaviors",
        mean_score: 12,
        unfavorable_pct: 4.4,
        n_responses: 45,
        k_anonymity_met: true,
      },
    ]);
  }

  if (urlStr.includes("/rest/v1/rpc/create_invitation_batch")) {
    const body = parseJsonBody(init);
    const cycleId =
      typeof body._cycle_id === "string" ? body._cycle_id : "syn-cycle-2026-q2";
    const unitId =
      typeof body._unit_id === "string" && body._unit_id.trim()
        ? body._unit_id.trim()
        : "geral";
    const quantity = Math.min(
      500,
      Math.max(1, Number(body._quantity ?? 10) || 10),
    );
    addSyntheticInvitesCount(cycleId, quantity);
    const expiresAt = new Date(Date.now() + 14 * 86400000).toISOString();
    const batch = Array.from({ length: quantity }, (_, index) => ({
      token: `nr1-${cycleId.slice(-6)}-${unitId.slice(-6)}-${(index + 1).toString().padStart(3, "0")}-${Math.random().toString(36).slice(2, 7)}`,
      expires_at: expiresAt,
    }));
    return jsonResponse(batch);
  }

  if (urlStr.includes("/rest/v1/rpc/get_cycle_methodology_status")) {
    const cycles = readSyntheticCycles();
    return jsonResponse(
      cycles.map((c) => ({
        cycle_id: c.id,
        instrument_key: "copsoq_ii_short",
        instrument_version: c.instrument_version ?? "copsoq-ii-short-pt-2013-v1",
        instrument_version_id: c.instrument_version ?? "copsoq-ii-short-pt-2013-v1",
        validation_status: "approved",
        is_operational: true,
        can_open: true,
        methodology_ready: true,
        requires_human_signoff: true,
        blockers: [],
      })),
    );
  }

  if (urlStr.includes("/rest/v1/rpc/list_aep_assessments")) {
    return jsonResponse(SYNTHETIC_AEP_ASSESSMENTS);
  }

  if (urlStr.includes("/rest/v1/rpc/list_aep_evidence")) {
    return jsonResponse(SYNTHETIC_AEP_EVIDENCE);
  }

  if (
    urlStr.includes("/rest/v1/rpc/create_aep_assessment") ||
    urlStr.includes("/rest/v1/rpc/add_aep_evidence") ||
    urlStr.includes("/rest/v1/rpc/add_aep_finding") ||
    urlStr.includes("/rest/v1/rpc/register_aet_trigger") ||
    urlStr.includes("/rest/v1/rpc/create_aet_assessment") ||
    urlStr.includes("/rest/v1/rpc/add_aet_evidence") ||
    urlStr.includes("/rest/v1/rpc/add_aet_finding") ||
    urlStr.includes("/rest/v1/rpc/add_aet_recommendation")
  ) {
    return jsonResponse("syn-created-id-" + Date.now());
  }

  if (
    urlStr.includes("/rest/v1/rpc/advance_aep_assessment") ||
    urlStr.includes("/rest/v1/rpc/advance_aet_assessment") ||
    urlStr.includes("/rest/v1/rpc/advance_contextual_risk_assessment") ||
    urlStr.includes("/rest/v1/rpc/apply_contextual_risk_override")
  ) {
    return jsonResponse(null);
  }

  if (urlStr.includes("/rest/v1/rpc/list_aet_triggers")) {
    return jsonResponse(SYNTHETIC_AET_TRIGGERS);
  }

  if (urlStr.includes("/rest/v1/rpc/list_aet_assessments")) {
    return jsonResponse(SYNTHETIC_AET_ASSESSMENTS);
  }

  if (urlStr.includes("/rest/v1/rpc/get_aet_workspace")) {
    return jsonResponse(SYNTHETIC_AET_WORKSPACE);
  }

  if (urlStr.includes("/rest/v1/rpc/get_criteria_engine_status")) {
    return jsonResponse(SYNTHETIC_CRITERIA_STATUS);
  }

  if (urlStr.includes("/rest/v1/rpc/list_contextual_risk_assessments")) {
    return jsonResponse(SYNTHETIC_CONTEXTUAL_ASSESSMENTS);
  }

  if (urlStr.includes("/rest/v1/rpc/suggest_controls_for_cycle")) {
    return jsonResponse([
      {
        control_id: "cat-ctrl-autonomy-03",
        catalog_id: "cat-ctrl-autonomy-03",
        control_code: "NR17-AUT-03",
        code: "NR17-AUT-03",
        control_title: "Redesenho Participativo de Processos e Margem de Autonomia na Tarefa",
        title: "Redesenho Participativo de Processos e Margem de Autonomia na Tarefa",
        control_description:
          "Oficinas com trabalhadores e CIPA para simplificar fluxos críticos e ampliar controle sobre métodos e ritmo de execução.",
        description:
          "Oficinas com trabalhadores e CIPA para simplificar fluxos críticos e ampliar controle sobre métodos e ritmo de execução.",
        control_level: "engineering",
        level: "engineering",
        dimension: "autonomy",
        driver_slug: "autonomy",
        risk_level: 12,
        n_responses: 45,
        evidence_strength: "strong",
      },
      {
        control_id: "cat-ctrl-recognition-04",
        catalog_id: "cat-ctrl-recognition-04",
        control_code: "NR01-REC-04",
        code: "NR01-REC-04",
        control_title: "Protocolo Estruturado de Reconhecimento Equitativo (SAGE) e Transparência",
        title: "Protocolo Estruturado de Reconhecimento Equitativo (SAGE) e Transparência",
        control_description:
          "Rituais quinzenais de reconhecimento específico, apropriado, genuíno e equitativo alinhados à justiça organizacional.",
        description:
          "Rituais quinzenais de reconhecimento específico, apropriado, genuíno e equitativo alinhados à justiça organizacional.",
        control_level: "administrative",
        level: "administrative",
        dimension: "recognition",
        driver_slug: "appreciation",
        risk_level: 10,
        n_responses: 45,
        evidence_strength: "strong",
      },
    ]);
  }

  if (urlStr.includes("/rest/v1/rpc/get_data_governance_status")) {
    return jsonResponse([
      {
        policy_version: "LGPD-NR1-G1-2026.1",
        policy_status: "synthetic_approved_real_blocked",
        can_process_real_data: false,
        blockers: ["required_approvals_missing"],
        rules: [
          {
            data_class: "identity",
            owner_role: "admin",
            retention_days: 365,
            access_mode: "admin_only",
            disposal_method: "hard_delete",
            emergency_access_mode: "prohibited",
            export_allowed: false,
          },
          {
            data_class: "invitation_secret",
            owner_role: "system",
            retention_days: 30,
            access_mode: "token_hash_only",
            disposal_method: "crypto_shred",
            emergency_access_mode: "prohibited",
            export_allowed: false,
          },
          {
            data_class: "response_microdata",
            owner_role: "system",
            retention_days: 90,
            access_mode: "rpc_aggregate_only",
            disposal_method: "anonymize_after_aggregation",
            emergency_access_mode: "prohibited",
            export_allowed: false,
          },
          {
            data_class: "safe_aggregate",
            owner_role: "sst",
            retention_days: 7300,
            access_mode: "k_anonymity_min_5",
            disposal_method: "archive_20y_nr1",
            emergency_access_mode: "audit_logged",
            export_allowed: true,
          },
          {
            data_class: "audit_event",
            owner_role: "auditor",
            retention_days: 7300,
            access_mode: "append_only",
            disposal_method: "archive_20y_nr1",
            emergency_access_mode: "audit_logged",
            export_allowed: true,
          },
          {
            data_class: "operational_evidence",
            owner_role: "sst",
            retention_days: 7300,
            access_mode: "role_scoped",
            disposal_method: "archive_20y_nr1",
            emergency_access_mode: "audit_logged",
            export_allowed: true,
          },
          {
            data_class: "security_incident",
            owner_role: "dpo",
            retention_days: 1825,
            access_mode: "dpo_admin_only",
            disposal_method: "regulatory_archive",
            emergency_access_mode: "break_glass_logged",
            export_allowed: false,
          },
        ],
      },
    ]);
  }

  if (urlStr.includes("/functions/v1/generate-document")) {
    return jsonResponse({
      ok: true,
      id: `syn-doc-${Date.now().toString(36)}`,
      status: "preliminary",
    });
  }

  if (urlStr.includes("/rest/v1/rpc/review_document")) {
    return jsonResponse({ ok: true });
  }

  if (urlStr.includes("/functions/v1/strategia-rewrite")) {
    const body = parseJsonBody(init);
    const answerObj =
      body && typeof body.answer === "object" && body.answer !== null
        ? (body.answer as Record<string, unknown>)
        : {};
    return jsonResponse({
      summary:
        typeof answerObj.summary === "string" && answerObj.summary.trim()
          ? answerObj.summary
          : "Síntese determinística verificada com base nos agregados seguros do ciclo (k ≥ 5).",
      whyMatters:
        typeof answerObj.whyMatters === "string" && answerObj.whyMatters.trim()
          ? answerObj.whyMatters
          : "Alinhado ao Cap. 1.5 da NR-1 (Portaria MTE nº 1.419/2024) e ao Work Wellbeing Playbook 2.0.",
    });
  }

  return reply([]);
}
