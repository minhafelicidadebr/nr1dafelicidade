import { copsoqQuestions } from "@/data/copsoqData";
import type {
  SyntheticScenarioDefinition,
  SyntheticScenarioQuestion,
} from "@/lib/instruments/syntheticScenarios";

export const syntheticScenarioQuestions: SyntheticScenarioQuestion[] = copsoqQuestions.map((question) => ({
  key: question.id,
  group: question.scale,
  favorableWhenHigh: Boolean(question.reverse),
}));

const allGroups = Array.from(new Set(syntheticScenarioQuestions.map((question) => question.group)));

function allGroupsAt(target: "low" | "medium" | "high") {
  return Object.fromEntries(allGroups.map((group) => [group, target]));
}

export const syntheticDemoScenarios: SyntheticScenarioDefinition[] = [
  {
    id: "synthetic-stable-work",
    label: "Rotina estável simulada",
    description: "Perfil fictício com sinais demonstrativos de menor carga para explorar a interface e seus limites.",
    targetLoadByGroup: allGroupsAt("low"),
  },
  {
    id: "synthetic-change-pressure",
    label: "Mudança organizacional simulada",
    description: "Perfil fictício misto, com pressão em demandas, previsibilidade, liderança e insegurança.",
    targetLoadByGroup: {
      ...allGroupsAt("medium"),
      demands_quant: "high",
      demands_emotional: "high",
      work_pace: "high",
      predictability: "high",
      leadership_quality: "high",
      insecurity: "high",
    },
  },
  {
    id: "synthetic-broad-pressure",
    label: "Pressão ampla simulada",
    description: "Perfil fictício de carga elevada para demonstrar estados visuais, prioridades e guardrails.",
    targetLoadByGroup: allGroupsAt("high"),
  },
];
