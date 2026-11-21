/**
 * PT-BR labels for action_status, control_level and risk-derived priority.
 * Keys map 1:1 to DB enums. Never expose raw keys in the UI.
 */

export type ActionStatus = "planned" | "in_progress" | "done" | "cancelled";
export type ControlLevel = "elimination" | "substitution" | "engineering" | "administrative" | "ppe";

export const ACTION_STATUS_LABEL: Record<ActionStatus, string> = {
  planned: "Planejada",
  in_progress: "Em andamento",
  done: "Concluída",
  cancelled: "Cancelada",
};

export const ACTION_STATUS_HINT: Record<ActionStatus, string> = {
  planned: "Aguardando início da implementação.",
  in_progress: "Em execução por responsável designado.",
  done: "Concluída — registrar evidência para auditoria.",
  cancelled: "Descartada com justificativa registrada.",
};

export type StatusVariant = "default" | "secondary" | "destructive" | "outline";
export function actionStatusVariant(status: ActionStatus, dueDate?: string | null): StatusVariant {
  if (status === "done") return "default";
  if (status === "cancelled") return "outline";
  if (dueDate && new Date(dueDate) < new Date()) return "destructive";
  return "secondary";
}

export function isOverdue(status: ActionStatus, dueDate?: string | null) {
  if (!dueDate || status === "done" || status === "cancelled") return false;
  return new Date(dueDate) < new Date();
}

export const CONTROL_LEVEL_LABEL: Record<ControlLevel, string> = {
  elimination: "Eliminação",
  substitution: "Substituição",
  engineering: "Engenharia / Redesenho organizacional",
  administrative: "Administrativo / Gestão",
  ppe: "Suporte individual",
};

export const CONTROL_LEVEL_RANK: Record<ControlLevel, number> = {
  elimination: 1, substitution: 2, engineering: 3, administrative: 4, ppe: 5,
};

export const CONTROL_LEVEL_PSY_NOTE: Record<ControlLevel, string> = {
  elimination:    "Remover o fator de risco psicossocial na origem (ex.: redesenho do escopo do cargo).",
  substitution:   "Substituir prática nociva por alternativa segura (ex.: realocar tarefa crítica).",
  engineering:    "Redesenhar processos, fluxos e cargas — controle preferencial para risco organizacional.",
  administrative: "Políticas, capacitação, governança, escala e gestão de carga.",
  ppe:            "Apoio individual (canal de escuta, EAP). Não substitui controles organizacionais.",
};

// ----- Priority derived from AIHA risk level (severity × probability) -----
export type Priority = "critica" | "alta" | "media" | "baixa";
export const PRIORITY_LABEL: Record<Priority, string> = {
  critica: "Crítica", alta: "Alta", media: "Média", baixa: "Baixa",
};
export function priorityFromRiskLevel(level?: number | null): Priority {
  if (!level || level <= 0) return "baixa";
  if (level >= 20) return "critica";
  if (level >= 15) return "alta";
  if (level >= 10) return "media";
  return "baixa";
}
export const PRIORITY_PILL: Record<Priority, string> = {
  critica: "bg-red-500/15 text-red-400 border-red-500/30",
  alta:    "bg-orange-500/15 text-orange-400 border-orange-500/30",
  media:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  baixa:   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

// ----- Document kinds -----
export const DOCUMENT_KIND_LABEL: Record<string, string> = {
  drps: "DRPS preliminar",
  action_plan: "Plano de Ação",
  executive_summary: "Resumo Executivo",
};

export const DISCLAIMER_PRELIMINAR =
  "Recomendação preliminar baseada em dados agregados (k≥5) e catálogos cadastrados. Requer revisão do responsável técnico (SST/SESMT).";
