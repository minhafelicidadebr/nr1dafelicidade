export type BuyerCommitteeRoleId = "executive" | "people" | "sst" | "privacy_legal";

export type BuyerCommitteeRole = {
  id: BuyerCommitteeRoleId;
  label: string;
  shortLabel: string;
  responsibility: string;
  question: string;
  decision: string;
  evidence: readonly string[];
  boundary: string;
  contribution: string;
  sourceLabel: string;
  evidenceRefs: readonly string[];
};

export type BuyerCommitteeJourney = {
  policyId: string;
  targetGate: "G1";
  status: "local_synthetic_alignment";
  title: string;
  description: string;
  notice: string;
  roles: readonly BuyerCommitteeRole[];
};

export const g1BuyerCommitteeJourney: BuyerCommitteeJourney = {
  policyId: "g1-buyer-committee-journey-2026-07-15",
  targetGate: "G1",
  status: "local_synthetic_alignment",
  title: "Uma decisão forte precisa sobreviver a quatro perspectivas.",
  description:
    "Escolha um papel para ver a pergunta que ele precisa responder, a evidência esperada e o limite que continua ativo.",
  notice:
    "Esta jornada prepara uma conversa local e sintética. Não constitui parecer, aprovação formal, proposta ou autorização de tratamento de dados.",
  roles: [
    {
      id: "executive",
      label: "Diretoria",
      shortLabel: "Sponsor executivo",
      responsibility: "Prioridade, patrocínio e critério de valor",
      question: "Por que agir agora e qual decisão vem primeiro?",
      decision: "Delimitar prioridade, sponsor e critério de valor para uma descoberta sintética.",
      evidence: [
        "Mapa de contexto, lacunas e decisões pendentes",
        "Escopo comercial com limites operacionais visíveis",
        "Roadmap de gates antes de qualquer operação",
      ],
      boundary: "Sem promessa de ROI, certificação, conformidade ou prazo produtivo.",
      contribution: "Patrocinar a descoberta e indicar quem precisa participar.",
      sourceLabel: "Constituição operacional e avaliação de maturidade",
      evidenceRefs: ["docs/PROJECT_CONSTITUTION.md", "docs/SAAS_MATURITY_ASSESSMENT.md"],
    },
    {
      id: "people",
      label: "RH / Pessoas",
      shortLabel: "Liderança de Pessoas",
      responsibility: "Experiência, educação e mudança organizacional",
      question: "Como conectar educação e ação sem expor pessoas?",
      decision: "Definir objetivo pedagógico, público futuro e responsáveis pela mudança organizacional.",
      evidence: [
        "Jornada sintética do sinal à ação e reavaliação",
        "Trilhas educacionais com limites de uso explícitos",
        "Papéis futuros de RH, liderança e participação dos trabalhadores",
      ],
      boundary: "Sem campanha real, ranking individual sensível, coerção ou diagnóstico.",
      contribution: "Trazer contexto organizacional sem inserir dados de trabalhadores.",
      sourceLabel: "Oferta Design Partner e constituição operacional",
      evidenceRefs: ["docs/DESIGN_PARTNER_OFFER_G1.md", "docs/PROJECT_CONSTITUTION.md"],
    },
    {
      id: "sst",
      label: "SST / SESMT",
      shortLabel: "Responsável técnico",
      responsibility: "Trabalho real, método e revisão técnica",
      question: "Como transformar sinais em contexto e evidências revisáveis?",
      decision: "Definir como a descoberta se conecta ao trabalho real, aos controles e à revisão competente.",
      evidence: [
        "Cadeia medir → contextualizar → agir → evidenciar → reavaliar",
        "Separação entre sinal, avaliação técnica e decisão",
        "Critérios para AEP/AET, participação e eficácia de controles",
      ],
      boundary: "Questionário não substitui AEP, AET, observação do trabalho, CIPA ou responsável técnico.",
      contribution: "Validar perguntas, limites e evidências que uma futura avaliação exigiria.",
      sourceLabel: "Jornada regulatória e protocolo de contexto do trabalho",
      evidenceRefs: ["docs/REGULATORY_E2E_JOURNEY_G1.md", "docs/AEP_WORK_CONTEXT_G2.md"],
    },
    {
      id: "privacy_legal",
      label: "Jurídico / DPO",
      shortLabel: "Privacidade e jurídico",
      responsibility: "Finalidade, base legal e fronteira de fornecedores",
      question: "Quais condições precisam existir antes de um futuro piloto?",
      decision: "Mapear finalidade, base legal, DPA, acessos, retenção e incidentes antes de liberar fornecedor.",
      evidence: [
        "Inventário de critérios vendor-neutral ainda pendentes",
        "Limites de intake comercial e retenção local",
        "Bloqueio de entrega remota e dados reais no gate atual",
      ],
      boundary: "Nenhum dado real, CRM, integração ou entrega remota está autorizado no G1.",
      contribution: "Registrar condicionantes futuros sem autorizar tratamento ou contratação.",
      sourceLabel: "Governança de dados e prontidão vendor-neutral",
      evidenceRefs: ["docs/DATA_GOVERNANCE_G1.md", "docs/LEAD_INTAKE_GOVERNANCE_G1.md"],
    },
  ],
};
