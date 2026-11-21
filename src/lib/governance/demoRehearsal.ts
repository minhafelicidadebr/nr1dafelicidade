export type DemoRehearsalPhase =
  | "preflight"
  | "narrative"
  | "navigation"
  | "evidence"
  | "limits"
  | "handoff";

export type DemoRehearsalStatus = "ready" | "partial" | "blocked";

export type DemoRehearsalItemInput = {
  key: string;
  label: string;
  phase: DemoRehearsalPhase;
  status: DemoRehearsalStatus;
  requiredForInternalDemo: boolean;
  requiredForExternalDemo: boolean;
  evidenceRef: string;
  detail: string;
};

export type DemoRehearsalPolicy = {
  policyId: string;
  targetGate: "G1";
  allowInternalSyntheticDemo: boolean;
  requireExternalDemoEvidence: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type DemoRehearsalContext = {
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
};

export type DemoRehearsalBlocker =
  | "internal_demo_item_not_ready"
  | "external_demo_item_not_ready"
  | "real_data_enabled"
  | "gate_advance_claimed";

export type DemoRehearsalItem = DemoRehearsalItemInput & {
  ready: boolean;
};

export type DemoRehearsalSummary = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "internal_ready" | "external_ready";
  canRunInternalSyntheticDemo: boolean;
  canRunExternalDemo: boolean;
  items: DemoRehearsalItem[];
  blockers: DemoRehearsalBlocker[];
  total: number;
  ready: number;
  partial: number;
  blocked: number;
  internalReady: number;
  internalRequired: number;
  externalReady: number;
  externalRequired: number;
  readinessPct: number;
  internalReadinessPct: number;
  externalReadinessPct: number;
  nextStep: DemoRehearsalItem | null;
};

export function evaluateDemoRehearsal(
  items: DemoRehearsalItemInput[],
  context: DemoRehearsalContext,
  policy: DemoRehearsalPolicy,
): DemoRehearsalSummary {
  const evaluated = items.map((item) => ({
    ...item,
    ready: item.status === "ready",
  }));
  const internalRequired = evaluated.filter((item) => item.requiredForInternalDemo);
  const externalRequired = evaluated.filter((item) => item.requiredForExternalDemo);
  const blockers = new Set<DemoRehearsalBlocker>();

  if (internalRequired.some((item) => !item.ready)) blockers.add("internal_demo_item_not_ready");
  if (policy.requireExternalDemoEvidence && externalRequired.some((item) => !item.ready)) {
    blockers.add("external_demo_item_not_ready");
  }
  if (policy.prohibitRealData && context.realDataEnabled) blockers.add("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.add("gate_advance_claimed");

  const canRunInternalSyntheticDemo =
    policy.allowInternalSyntheticDemo &&
    !context.realDataEnabled &&
    !context.gateAdvanceClaimed &&
    internalRequired.length > 0 &&
    internalRequired.every((item) => item.ready);
  const canRunExternalDemo =
    canRunInternalSyntheticDemo &&
    externalRequired.length > 0 &&
    externalRequired.every((item) => item.ready);

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canRunExternalDemo ? "external_ready" : canRunInternalSyntheticDemo ? "internal_ready" : "blocked",
    canRunInternalSyntheticDemo,
    canRunExternalDemo,
    items: evaluated,
    blockers: Array.from(blockers),
    total: evaluated.length,
    ready: evaluated.filter((item) => item.ready).length,
    partial: evaluated.filter((item) => item.status === "partial").length,
    blocked: evaluated.filter((item) => item.status === "blocked").length,
    internalReady: internalRequired.filter((item) => item.ready).length,
    internalRequired: internalRequired.length,
    externalReady: externalRequired.filter((item) => item.ready).length,
    externalRequired: externalRequired.length,
    readinessPct: pct(evaluated.filter((item) => item.ready).length, evaluated.length),
    internalReadinessPct: pct(internalRequired.filter((item) => item.ready).length, internalRequired.length),
    externalReadinessPct: pct(externalRequired.filter((item) => item.ready).length, externalRequired.length),
    nextStep: evaluated.find((item) => item.requiredForInternalDemo && !item.ready)
      ?? evaluated.find((item) => item.requiredForExternalDemo && !item.ready)
      ?? null,
  };
}

export function demoRehearsalBlockerLabel(blocker: DemoRehearsalBlocker) {
  const labels: Record<DemoRehearsalBlocker, string> = {
    internal_demo_item_not_ready: "Concluir itens obrigatorios para ensaio interno sintetico.",
    external_demo_item_not_ready: "Registrar evidencia adicional antes de demonstracao externa.",
    real_data_enabled: "Manter dados reais bloqueados durante a demonstracao.",
    gate_advance_claimed: "Remover qualquer alegacao de avanco de gate.",
  };
  return labels[blocker];
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
