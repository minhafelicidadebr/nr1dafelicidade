import type { WorkEvidenceKind } from "@/lib/work/assessment";

export const AEP_PROTOCOL_VERSION = "aep-g2-2026.06-draft";
export const AET_PROTOCOL_VERSION = "aet-g2-2026.06-draft";

export const workEvidenceKinds: Array<{ value: WorkEvidenceKind; label: string }> = [
  { value: "observation", label: "Observação do trabalho real" },
  { value: "interview", label: "Entrevista — síntese não identificável" },
  { value: "workshop", label: "Oficina coletiva" },
  { value: "document", label: "Documento operacional" },
  { value: "worker_participation", label: "Participação de trabalhadores" },
  { value: "cipa_participation", label: "Participação da CIPA/representação" },
];

export const aetTriggerCatalog = [
  { key: "needs_deeper_analysis", label: "Necessidade de aprofundamento técnico" },
  { key: "controls_inadequate", label: "Possível inadequação das ações existentes" },
  { key: "occupational_health_indication", label: "Indicação formal proveniente do PCMSO" },
  { key: "accident_or_illness_analysis", label: "Análise de acidente ou adoecimento relacionado ao trabalho" },
] as const;

export const aepProtocolLimitations = [
  "Protocolo estrutural em draft; requer validação do responsável de SST/Ergonomia.",
  "Não substitui AET, observação profissional, participação dos trabalhadores ou julgamento técnico.",
  "Não admite conteúdo individual sensível em evidências organizacionais.",
];
