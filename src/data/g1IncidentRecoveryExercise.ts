import type {
  IncidentRecoveryExerciseContext,
  IncidentRecoveryExercisePolicy,
  IncidentRecoveryExerciseScenario,
} from "@/lib/governance/incidentRecoveryExercise";

export const g1IncidentRecoveryExercisePolicy: IncidentRecoveryExercisePolicy = {
  policyId: "g1-incident-recovery-exercise-2026-07-15.1",
  requiredPhases: ["detect", "contain", "investigate", "recover", "close"],
  prohibitRealData: true,
  prohibitPersistence: true,
  prohibitRemoteTransport: true,
};

export const g1IncidentRecoveryExerciseContext: IncidentRecoveryExerciseContext = {
  syntheticMode: true,
  realDataEnabled: false,
  persistenceEnabled: false,
  remoteTransportEnabled: false,
  approvedRunbookAvailable: false,
};

export const g1IncidentRecoveryExerciseScenario: IncidentRecoveryExerciseScenario = {
  scenarioId: "g1-synthetic-aggregate-exposure",
  version: "2026-07-15.1",
  title: "Exposição sintética de agregado abaixo do limiar",
  syntheticTrigger: "Uma saída demonstrativa tenta exibir um grupo sintético com k < 5.",
  recoveryTarget: "Bloquear a saída, preservar apenas telemetria técnica não sensível e comprovar retorno ao modo seguro.",
  steps: [
    {
      phase: "detect",
      label: "Detectar e classificar",
      objective: "Reconhecer a violação sintética do limiar sem abrir microdados.",
      expectedEvidence: "Registro local da regra acionada e classificação provisória.",
    },
    {
      phase: "contain",
      label: "Conter a saída",
      objective: "Suspender a visualização afetada e manter o restante do runtime fail-closed.",
      expectedEvidence: "Confirmação local de bloqueio e ausência de transporte remoto.",
    },
    {
      phase: "investigate",
      label: "Investigar sem identificar",
      objective: "Revisar caminho técnico, versão da política e alcance usando somente dados sintéticos.",
      expectedEvidence: "Hipótese técnica e escopo sintético documentados no ensaio.",
    },
    {
      phase: "recover",
      label: "Recuperar o modo seguro",
      objective: "Restaurar a saída somente após k-anonimato e regressão local passarem.",
      expectedEvidence: "Teste local verde e confirmação de que dados reais seguem bloqueados.",
    },
    {
      phase: "close",
      label: "Encerrar com pendências",
      objective: "Registrar lições e encaminhar aprovação humana do runbook sem declarar o incidente formalmente exercitado.",
      expectedEvidence: "Recibo efêmero e lista explícita de bloqueios formais.",
    },
  ],
};
