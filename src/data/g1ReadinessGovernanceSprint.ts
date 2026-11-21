import {
  evaluateReadinessGovernanceSprint,
  type ReadinessGovernanceSprintDefinition,
} from "@/lib/commercial/readinessGovernanceSprint";
import { g1DesignPartnerOfferSummary } from "./g1DesignPartnerOffer";

export const g1ReadinessGovernanceSprintDefinition: ReadinessGovernanceSprintDefinition = {
  policyId: "g1-readiness-governance-sprint-2026-07-18",
  targetGate: "G1",
  title: "Readiness & Governance Sprint",
  description: "Jornada assistida e sintética para organizar decisões, evidências e gates antes de qualquer operação com dados de trabalhadores.",
  deliverable: "Dossiê de Prontidão para Governança de Fatores Psicossociais",
  deliverableBoundary: "Artefato preliminar para revisão humana; não é laudo, PGR, diagnóstico ou declaração de conformidade.",
  scope: [
    { key: "executive_workshop", label: "Workshop executivo de alinhamento" },
    { key: "sites_roles_mapping", label: "Mapeamento de estabelecimentos, papéis e stakeholders" },
    { key: "document_categories", label: "Mapa de categorias documentais e lacunas de evidência, sem transferência de documentos" },
    { key: "readiness_matrix", label: "Matriz de prontidão para decisões e dependências" },
    { key: "procurement_risks", label: "Mapa preliminar de riscos de procurement e implantação" },
    { key: "preliminary_privacy_threat_model", label: "Modelo preliminar de ameaças à privacidade, sem dados pessoais" },
    { key: "implementation_gates", label: "Plano de implantação e definição dos próximos gates" },
    { key: "executive_closeout", label: "Sessão executiva final de revisão dos próximos passos" },
  ],
  exclusions: [
    { key: "worker_research", label: "Pesquisa, campanha ou coleta com trabalhadores" },
    { key: "nr1_diagnosis", label: "Avaliação ou diagnóstico NR-1" },
    { key: "psychometric_scoring", label: "Scoring psicométrico" },
    { key: "real_inventory_or_risk_classification", label: "Inventário real ou classificação de risco" },
    { key: "pgr_or_technical_report", label: "PGR, laudo ou parecer técnico" },
    { key: "personal_data_processing", label: "Tratamento de dados pessoais" },
  ],
  operatingBoundary: "Não há checkout, CRM, calendário, cobrança, operação remota ou avanço de gate habilitados por esta superfície.",
};

export const g1ReadinessGovernanceSprintSummary = evaluateReadinessGovernanceSprint(
  g1ReadinessGovernanceSprintDefinition,
  g1DesignPartnerOfferSummary,
);
