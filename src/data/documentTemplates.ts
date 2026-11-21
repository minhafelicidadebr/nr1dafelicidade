/**
 * Catálogo estático de modelos documentais orientativos exibidos
 * em /app/documents. Não fazem chamada a edge function.
 */
import type { OrientativeTemplateId } from "@/lib/documents/orientativeTemplate";

export type DocTemplateStatus = "modelo" | "gerado" | "pendente";

export type DocTemplate = {
  id: string;
  title: string;
  purpose: string;
  whenToUse: string;
  prerequisites: string[];
  status: DocTemplateStatus;
  // intent do knowledgeBase para "Perguntar à Sra. EstratégIA"
  askIntent: string;
  // Pergunta livre opcional para exibir como user bubble ao abrir o painel
  askQuestion: string;
  // Se for um modelo orientativo estático, link de referência (PDF/Doc anexado)
  reference?: { kind: "pdf" | "doc"; label: string };
  // Se for gerável via edge function (kind do generate-document)
  generateKind?: "drps" | "action_plan" | "executive_summary";
  // Se houver gerador local parametrizado (sem edge/IA) em orientativeTemplate.ts
  orientativeId?: OrientativeTemplateId;
};

export const DOC_TEMPLATES: DocTemplate[] = [
  {
    id: "drps",
    title: "DRPS preliminar",
    purpose: "Diagnóstico preliminar de riscos psicossociais (subsídio para PGR/GRO).",
    whenToUse: "Após ciclo com n≥5 e riscos computados com k-anonimato.",
    prerequisites: ["Empresa", "Unidades", "Ciclo n≥5", "Riscos computados"],
    status: "gerado",
    askIntent: "documents.drps",
    askQuestion: "O que entra no DRPS preliminar?",
    generateKind: "drps",
  },
  {
    id: "consent",
    title: "Aviso de participação e privacidade — instrumento aprovado / NR-01",
    purpose: "Comunicar finalidade, anonimato e direitos do respondente antes da coleta.",
    whenToUse: "Antes de iniciar qualquer campanha aprovada — entrega ou registro digital após revisão jurídica e de privacidade.",
    prerequisites: ["Empresa cadastrada", "Ciclo planejado"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como usar o Termo de Consentimento na coleta?",
    orientativeId: "consent",
  },
  {
    id: "communique",
    title: "Comunicado aos Trabalhadores — Avaliação de Riscos Psicossociais",
    purpose: "Atender à NR-01 item 1.5.7.4 (informação dos riscos aos trabalhadores).",
    whenToUse: "Após o cálculo dos riscos e definição das primeiras ações.",
    prerequisites: ["Riscos computados", "Plano de ação iniciado"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como adaptar o Comunicado aos Trabalhadores?",
    orientativeId: "communique",
  },
  {
    id: "pgr_text",
    title: "Texto-modelo para PGR — Metodologia e Representatividade",
    purpose: "Conteúdo para inserção no capítulo de Avaliação de Riscos Psicossociais do PGR.",
    whenToUse: "Ao integrar a triagem psicossocial ao PGR/GRO da organização.",
    prerequisites: ["Ciclo finalizado", "DRPS preliminar gerado"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como integrar este texto no PGR?",
    orientativeId: "pgr_text",
  },
  {
    id: "controls_implanted",
    title: "Controles Implantados — Avaliação de Riscos Psicossociais",
    purpose: "Registro estruturado de controles já existentes na organização.",
    whenToUse: "Antes/durante o plano de ação, para evitar duplicidade e orientar o relatório.",
    prerequisites: ["Controles declarados em /app/controls"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como registrar Controles Implantados?",
    orientativeId: "controls_implanted",
  },
  {
    id: "action_plan",
    title: "Plano de Ação preliminar",
    purpose: "Consolida ações priorizadas, responsáveis, prazos e evidências.",
    whenToUse: "Após registrar ao menos uma ação ligada a um risco priorizado.",
    prerequisites: ["Ações registradas", "Riscos computados"],
    status: "gerado",
    askIntent: "documents.drps",
    askQuestion: "O que entra no Plano de Ação preliminar?",
    generateKind: "action_plan",
  },
  {
    id: "executive_summary",
    title: "Resumo Executivo",
    purpose: "Visão de liderança e comitê — riscos, ações e próximos passos.",
    whenToUse: "Para apresentações a comitês, alta liderança ou conselho.",
    prerequisites: ["Riscos computados", "Ações registradas"],
    status: "gerado",
    askIntent: "documents.drps",
    askQuestion: "O que entra no Resumo Executivo?",
    generateKind: "executive_summary",
  },
  {
    id: "worker_presentation",
    title: "Apresentação de Devolutiva para Trabalhadores e Lideranças (Slides NR-01)",
    purpose: "Roteiro em linguagem simples com pontos fortes, frentes prioritárias e plano de ação para apresentar à equipe (NR-01 1.5.3.3.c).",
    whenToUse: "Na reunião de devolutiva coletiva com colaboradores, gestores e CIPA.",
    prerequisites: ["Ciclo k≥5", "Plano de ação iniciado"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como conduzir a reunião de devolutiva com os trabalhadores?",
    orientativeId: "worker_presentation",
  },
  {
    id: "management_manifesto",
    title: "Manifesto de Compromisso da Alta Administração e CIPA",
    purpose: "Termo institucional de governança e patrocínio executivo para adequação NR-01 e promoção do bem-estar (ISO 45003).",
    whenToUse: "No lançamento ou consolidação do programa de gestão psicossocial junto à diretoria e CIPA.",
    prerequisites: ["Empresa cadastrada", "Membros e CIPA alinhados"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Por que o compromisso da alta direção é importante na NR-1?",
    orientativeId: "management_manifesto",
  },
  {
    id: "harassment_policy",
    title: "Política de Prevenção ao Assédio, Respeito e Canal Seguro (Lei 14.457/2022)",
    purpose: "Minuta institucional com fluxo independente de acolhimento/ouvidoria, proteção contra retaliação e capacitação.",
    whenToUse: "Para formalizar ou atualizar a política de prevenção ao assédio e violência no trabalho.",
    prerequisites: ["Canal independente de ouvidoria/acolhimento definido"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como estruturar a política de prevenção ao assédio sem misturar com a pesquisa anônima?",
    orientativeId: "harassment_policy",
  },
  {
    id: "disconnection_policy",
    title: "Política de Desconexão Digital, Pausas e Equilíbrio de Carga",
    purpose: "Diretrizes práticas para janelas de foco, pausas de recuperação e limites fora do expediente (presencial, híbrido e remoto).",
    whenToUse: "Como medida de controle administrativo para sobrecarga, ritmo intenso e conflito trabalho-família.",
    prerequisites: ["Análise do trabalho real (AEP)", "Alinhamento com lideranças"],
    status: "modelo",
    askIntent: "documents.templates",
    askQuestion: "Como implantar uma política de desconexão e pausas eficaz?",
    orientativeId: "disconnection_policy",
  },
];

