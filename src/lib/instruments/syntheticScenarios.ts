export type SyntheticLoadBand = "low" | "medium" | "high";

export type SyntheticScenarioQuestion = {
  key: string;
  group: string;
  favorableWhenHigh: boolean;
};

export type SyntheticScenarioDefinition = {
  id: string;
  label: string;
  description: string;
  targetLoadByGroup: Record<string, SyntheticLoadBand>;
};

export type SyntheticScenarioResult = {
  scenarioId: string;
  scenarioLabel: string;
  answers: Record<string, number>;
  itemCount: number;
  syntheticOnly: true;
};

export function buildSyntheticScenarioAnswers(
  questions: SyntheticScenarioQuestion[],
  scenario: SyntheticScenarioDefinition,
): SyntheticScenarioResult {
  if (!scenario.id.trim() || !scenario.label.trim()) throw new Error("scenario_identity_required");
  if (questions.length === 0) throw new Error("scenario_questions_required");

  const keys = new Set<string>();
  const answers: Record<string, number> = {};

  questions.forEach((question) => {
    if (!question.key.trim() || keys.has(question.key)) throw new Error("scenario_question_key_invalid");
    keys.add(question.key);

    const target = scenario.targetLoadByGroup[question.group];
    if (!target) throw new Error(`scenario_group_missing:${question.group}`);
    answers[question.key] = responseForTarget(target, question.favorableWhenHigh);
  });

  return {
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    answers,
    itemCount: questions.length,
    syntheticOnly: true,
  };
}

function responseForTarget(target: SyntheticLoadBand, favorableWhenHigh: boolean) {
  if (target === "medium") return 3;
  if (target === "low") return favorableWhenHigh ? 4 : 2;
  return favorableWhenHigh ? 2 : 4;
}
