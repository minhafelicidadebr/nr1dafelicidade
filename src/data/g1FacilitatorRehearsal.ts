import type {
  FacilitatorRehearsalAcknowledgementKey,
  FacilitatorRehearsalPolicy,
  FacilitatorRehearsalScenario,
} from "@/lib/governance/facilitatorRehearsal";

export const g1FacilitatorRehearsalPolicy: FacilitatorRehearsalPolicy = Object.freeze({
  policyId: "g1-facilitator-rehearsal-2026-07-14",
  requiredAcknowledgements: ["synthetic_only", "no_external_audience", "no_recording", "no_approval_claim"] as const,
  minimumScenarioCount: 6,
  requireAudiencePackReadyForRehearsal: true,
  prohibitRealData: true,
  prohibitPersistence: true,
  prohibitRemoteTransport: true,
  prohibitExternalAudience: true,
  prohibitRecording: true,
});

export const g1FacilitatorRehearsalAcknowledgements: readonly {
  key: FacilitatorRehearsalAcknowledgementKey;
  label: string;
}[] = [
  { key: "synthetic_only", label: "Usarei somente situações e informações fictícias" },
  { key: "no_external_audience", label: "Este é um ensaio interno, sem audiência externa" },
  { key: "no_recording", label: "Não farei gravação, captura ou coleta de conteúdo" },
  { key: "no_approval_claim", label: "O comprovante não nomeia facilitador nem aprova uso externo" },
];

export const g1FacilitatorRehearsalScenarios: readonly FacilitatorRehearsalScenario[] = [
  {
    key: "compliance_guarantee",
    label: "Pressão por garantia regulatória",
    prompt: "Uma liderança pergunta: ‘Então, ao usar a plataforma, estaremos automaticamente em conformidade com a NR-1?’",
    competency: "claims",
    expectedAction: "safe_answer",
    coaching: "Responder que a demo organiza uma jornada possível, sem garantir conformidade e sem substituir análise técnica competente.",
  },
  {
    key: "instrument_validation",
    label: "Validação do instrumento",
    prompt: "A audiência pede confirmação de que questionário, dimensões e scoring já estão validados para uso institucional.",
    competency: "methodology",
    expectedAction: "safe_answer",
    coaching: "Explicar que fonte, licença, scoring e fixtures canônicos permanecem bloqueados para revisão metodológica independente.",
  },
  {
    key: "real_worker_data",
    label: "Tentativa de dado real",
    prompt: "Alguém oferece respostas reais de trabalhadores para ‘aproveitar a demonstração’.",
    competency: "privacy",
    expectedAction: "stop_and_escalate",
    coaching: "Interromper, recusar o dado, recarregar se houve inserção e manter qualquer conteúdo real fora da sessão.",
  },
  {
    key: "diagnostic_reading",
    label: "Interpretação diagnóstica",
    prompt: "Um participante conclui que o cenário visual prova que uma organização tem risco psicossocial elevado.",
    competency: "claims",
    expectedAction: "safe_answer",
    coaching: "Corrigir: a saída é exploratória e fictícia; não constitui diagnóstico, avaliação de empresa ou decisão técnica.",
  },
  {
    key: "individual_crisis",
    label: "Relato de crise individual",
    prompt: "Durante o ensaio, surge um relato individual de sofrimento que demanda cuidado imediato.",
    competency: "care",
    expectedAction: "stop_and_escalate",
    coaching: "Encerrar a demo e acionar fluxo humano de cuidado separado, sem coletar resposta nem quebrar anonimato.",
  },
  {
    key: "unsafe_runtime",
    label: "Runtime inesperado",
    prompt: "A interface indica envio remoto, persistência ou comportamento diferente do ambiente sintético ensaiado.",
    competency: "runtime",
    expectedAction: "stop_and_escalate",
    coaching: "Interromper, não continuar com conteúdo, preservar apenas log técnico não sensível e encaminhar à engenharia.",
  },
];
