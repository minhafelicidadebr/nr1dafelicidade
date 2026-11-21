export type SaasMaturityStage =
  | "foundation"
  | "synthetic_mvp"
  | "controlled_pilot"
  | "real_saas"
  | "scale";

export type SaasMaturityCategory =
  | "product"
  | "privacy"
  | "methodology"
  | "operations"
  | "release"
  | "commercial";

export type SaasMaturityStatus = "ready" | "partial" | "blocked";

export type SaasMaturityItemInput = {
  key: string;
  label: string;
  stage: SaasMaturityStage;
  category: SaasMaturityCategory;
  status: SaasMaturityStatus;
  weight: number;
  gateBlocking: boolean;
  evidenceRef: string;
  detail: string;
};

export type SaasMaturityPolicy = {
  policyId: string;
  currentGate: "G0" | "G1";
  prohibitRealDataBeforeG3: boolean;
  syntheticMvpRequiresStages: SaasMaturityStage[];
  realSaasRequiresStages: SaasMaturityStage[];
  unicornGradePct: number;
};

export type SaasMaturityContext = {
  realDataEnabled: boolean;
};

export type SaasMaturityBlocker =
  | "stage_gate_blocked"
  | "real_data_enabled_before_g3"
  | "unicorn_grade_not_reached";

export type SaasMaturityItem = SaasMaturityItemInput & {
  points: number;
  maxPoints: number;
  ready: boolean;
};

export type SaasMaturityStageTotal = {
  total: number;
  ready: number;
  points: number;
  maxPoints: number;
  pct: number;
};

export type SaasMaturitySummary = {
  policyId: string;
  currentGate: "G0" | "G1";
  currentStage: SaasMaturityStage;
  nextStage: SaasMaturityStage | null;
  status: "foundation_ready" | "synthetic_mvp_blocked" | "synthetic_mvp_ready" | "real_saas_blocked" | "unicorn_grade_ready";
  canDemoSynthetic: boolean;
  canRunSyntheticMvp: boolean;
  canRunRealSaas: boolean;
  unicornGradeReady: boolean;
  scorePct: number;
  syntheticMvpPct: number;
  realSaasPct: number;
  blockers: SaasMaturityBlocker[];
  items: SaasMaturityItem[];
  total: number;
  ready: number;
  partial: number;
  blocked: number;
  nextStep: SaasMaturityItem | null;
  stageTotals: Record<SaasMaturityStage, SaasMaturityStageTotal>;
};

const STAGES: SaasMaturityStage[] = [
  "foundation",
  "synthetic_mvp",
  "controlled_pilot",
  "real_saas",
  "scale",
];

const STATUS_POINTS: Record<SaasMaturityStatus, number> = {
  ready: 1,
  partial: 0.5,
  blocked: 0,
};

export function evaluateSaasMaturity(
  items: SaasMaturityItemInput[],
  context: SaasMaturityContext,
  policy: SaasMaturityPolicy,
): SaasMaturitySummary {
  const evaluated = items.map((item) => ({
    ...item,
    points: STATUS_POINTS[item.status] * item.weight,
    maxPoints: item.weight,
    ready: item.status === "ready",
  }));
  const stageTotals = Object.fromEntries(
    STAGES.map((stage) => [stage, getStageTotal(evaluated, stage)]),
  ) as Record<SaasMaturityStage, SaasMaturityStageTotal>;
  const blockers = new Set<SaasMaturityBlocker>();
  const totalPoints = evaluated.reduce((total, item) => total + item.points, 0);
  const maxPoints = evaluated.reduce((total, item) => total + item.maxPoints, 0);
  const scorePct = pct(totalPoints, maxPoints);
  const canDemoSynthetic = stageGateReady(evaluated, ["foundation"]) && !context.realDataEnabled;
  const canRunSyntheticMvp =
    stageGateReady(evaluated, policy.syntheticMvpRequiresStages) && !context.realDataEnabled;
  const canRunRealSaas =
    stageGateReady(evaluated, policy.realSaasRequiresStages) && !context.realDataEnabled;
  const unicornGradeReady = canRunRealSaas && scorePct >= policy.unicornGradePct;

  if (!canRunSyntheticMvp) blockers.add("stage_gate_blocked");
  if (policy.prohibitRealDataBeforeG3 && context.realDataEnabled) blockers.add("real_data_enabled_before_g3");
  if (!unicornGradeReady) blockers.add("unicorn_grade_not_reached");

  return {
    policyId: policy.policyId,
    currentGate: policy.currentGate,
    currentStage: getCurrentStage(evaluated, context),
    nextStage: getNextStage(getCurrentStage(evaluated, context)),
    status: getStatus(canRunSyntheticMvp, canRunRealSaas, unicornGradeReady),
    canDemoSynthetic,
    canRunSyntheticMvp,
    canRunRealSaas,
    unicornGradeReady,
    scorePct,
    syntheticMvpPct: stageSetPct(evaluated, policy.syntheticMvpRequiresStages),
    realSaasPct: stageSetPct(evaluated, policy.realSaasRequiresStages),
    blockers: Array.from(blockers),
    items: evaluated,
    total: evaluated.length,
    ready: evaluated.filter((item) => item.status === "ready").length,
    partial: evaluated.filter((item) => item.status === "partial").length,
    blocked: evaluated.filter((item) => item.status === "blocked").length,
    nextStep: evaluated.find((item) => item.gateBlocking && !item.ready) ?? null,
    stageTotals,
  };
}

export function saasMaturityBlockerLabel(blocker: SaasMaturityBlocker) {
  const labels: Record<SaasMaturityBlocker, string> = {
    stage_gate_blocked: "Concluir bloqueios de gate antes de declarar o proximo estagio.",
    real_data_enabled_before_g3: "Manter dados reais bloqueados ate G3 e aprovacoes formais.",
    unicorn_grade_not_reached: "Elevar operacao, revisoes, escala e confiabilidade antes de tratar como SaaS de escala.",
  };
  return labels[blocker];
}

function getCurrentStage(items: SaasMaturityItem[], context: SaasMaturityContext) {
  if (context.realDataEnabled) return "foundation";
  let current: SaasMaturityStage = "foundation";
  for (const stage of STAGES) {
    const requiredStages = STAGES.slice(0, STAGES.indexOf(stage) + 1);
    if (stageGateReady(items, requiredStages)) current = stage;
  }
  return current;
}

function getNextStage(stage: SaasMaturityStage) {
  const index = STAGES.indexOf(stage);
  return STAGES[index + 1] ?? null;
}

function getStatus(
  canRunSyntheticMvp: boolean,
  canRunRealSaas: boolean,
  unicornGradeReady: boolean,
): SaasMaturitySummary["status"] {
  if (unicornGradeReady) return "unicorn_grade_ready";
  if (canRunRealSaas) return "real_saas_blocked";
  if (canRunSyntheticMvp) return "synthetic_mvp_ready";
  return "synthetic_mvp_blocked";
}

function stageGateReady(items: SaasMaturityItem[], stages: SaasMaturityStage[]) {
  const gateItems = items.filter((item) => stages.includes(item.stage) && item.gateBlocking);
  return gateItems.length > 0 && gateItems.every((item) => item.ready);
}

function stageSetPct(items: SaasMaturityItem[], stages: SaasMaturityStage[]) {
  const filtered = items.filter((item) => stages.includes(item.stage));
  return pct(
    filtered.reduce((total, item) => total + item.points, 0),
    filtered.reduce((total, item) => total + item.maxPoints, 0),
  );
}

function getStageTotal(items: SaasMaturityItem[], stage: SaasMaturityStage): SaasMaturityStageTotal {
  const filtered = items.filter((item) => item.stage === stage);
  const points = filtered.reduce((total, item) => total + item.points, 0);
  const maxPoints = filtered.reduce((total, item) => total + item.maxPoints, 0);
  return {
    total: filtered.length,
    ready: filtered.filter((item) => item.ready).length,
    points,
    maxPoints,
    pct: pct(points, maxPoints),
  };
}

function pct(points: number, maxPoints: number) {
  if (maxPoints <= 0) return 0;
  return Math.round((points / maxPoints) * 100);
}
