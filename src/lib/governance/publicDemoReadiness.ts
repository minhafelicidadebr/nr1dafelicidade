export type PublicDemoCategory =
  | "runtime"
  | "narrative"
  | "evidence"
  | "release"
  | "approval"
  | "accessibility";

export type PublicDemoItemStatus = "ready" | "partial" | "blocked";

export type PublicDemoReadinessItemInput = {
  key: string;
  label: string;
  category: PublicDemoCategory;
  status: PublicDemoItemStatus;
  requiredForPrivateWalkthrough: boolean;
  requiredForPublicDemo: boolean;
  evidenceRef: string;
  detail: string;
};

export type PublicDemoReadinessPolicy = {
  policyId: string;
  targetGate: "G1";
  allowPrivateSyntheticWalkthrough: boolean;
  requirePublicDemoApproval: boolean;
  requirePublicClaimsGuardrail: boolean;
  requireLocalCi: boolean;
  prohibitRealData: boolean;
  prohibitGateAdvance: boolean;
};

export type PublicDemoReadinessContext = {
  realDataEnabled: boolean;
  gateAdvanceClaimed: boolean;
  publicClaimsGuardrailGreen: boolean;
  localCiGreen: boolean;
};

export type PublicDemoReadinessBlocker =
  | "private_walkthrough_item_not_ready"
  | "public_demo_item_not_ready"
  | "public_claims_guardrail_not_green"
  | "local_ci_not_green"
  | "real_data_enabled"
  | "gate_advance_claimed";

export type PublicDemoReadinessItem = PublicDemoReadinessItemInput & {
  ready: boolean;
};

export type PublicDemoReadinessSummary = {
  policyId: string;
  targetGate: "G1";
  status: "blocked" | "private_walkthrough_ready" | "public_demo_ready";
  canRunPrivateSyntheticWalkthrough: boolean;
  canRunPublicDemo: boolean;
  items: PublicDemoReadinessItem[];
  blockers: PublicDemoReadinessBlocker[];
  total: number;
  ready: number;
  partial: number;
  blocked: number;
  privateReady: number;
  privateRequired: number;
  publicReady: number;
  publicRequired: number;
  readinessPct: number;
  privateReadinessPct: number;
  publicReadinessPct: number;
  nextStep: PublicDemoReadinessItem | null;
};

export function evaluatePublicDemoReadiness(
  items: PublicDemoReadinessItemInput[],
  context: PublicDemoReadinessContext,
  policy: PublicDemoReadinessPolicy,
): PublicDemoReadinessSummary {
  const evaluated = items.map((item) => ({
    ...item,
    ready: item.status === "ready",
  }));
  const privateRequired = evaluated.filter((item) => item.requiredForPrivateWalkthrough);
  const publicRequired = evaluated.filter((item) => item.requiredForPublicDemo);
  const blockers: PublicDemoReadinessBlocker[] = [];

  if (privateRequired.some((item) => !item.ready)) blockers.push("private_walkthrough_item_not_ready");
  if (policy.requirePublicDemoApproval && publicRequired.some((item) => !item.ready)) {
    blockers.push("public_demo_item_not_ready");
  }
  if (policy.requirePublicClaimsGuardrail && !context.publicClaimsGuardrailGreen) {
    blockers.push("public_claims_guardrail_not_green");
  }
  if (policy.requireLocalCi && !context.localCiGreen) blockers.push("local_ci_not_green");
  if (policy.prohibitRealData && context.realDataEnabled) blockers.push("real_data_enabled");
  if (policy.prohibitGateAdvance && context.gateAdvanceClaimed) blockers.push("gate_advance_claimed");

  const contextSafe =
    (!policy.requirePublicClaimsGuardrail || context.publicClaimsGuardrailGreen) &&
    (!policy.requireLocalCi || context.localCiGreen) &&
    (!policy.prohibitRealData || !context.realDataEnabled) &&
    (!policy.prohibitGateAdvance || !context.gateAdvanceClaimed);
  const canRunPrivateSyntheticWalkthrough =
    policy.allowPrivateSyntheticWalkthrough &&
    contextSafe &&
    privateRequired.length > 0 &&
    privateRequired.every((item) => item.ready);
  const canRunPublicDemo =
    canRunPrivateSyntheticWalkthrough &&
    publicRequired.length > 0 &&
    publicRequired.every((item) => item.ready);

  return {
    policyId: policy.policyId,
    targetGate: policy.targetGate,
    status: canRunPublicDemo
      ? "public_demo_ready"
      : canRunPrivateSyntheticWalkthrough
        ? "private_walkthrough_ready"
        : "blocked",
    canRunPrivateSyntheticWalkthrough,
    canRunPublicDemo,
    items: evaluated,
    blockers: unique(blockers),
    total: evaluated.length,
    ready: evaluated.filter((item) => item.ready).length,
    partial: evaluated.filter((item) => item.status === "partial").length,
    blocked: evaluated.filter((item) => item.status === "blocked").length,
    privateReady: privateRequired.filter((item) => item.ready).length,
    privateRequired: privateRequired.length,
    publicReady: publicRequired.filter((item) => item.ready).length,
    publicRequired: publicRequired.length,
    readinessPct: pct(evaluated.filter((item) => item.ready).length, evaluated.length),
    privateReadinessPct: pct(privateRequired.filter((item) => item.ready).length, privateRequired.length),
    publicReadinessPct: pct(publicRequired.filter((item) => item.ready).length, publicRequired.length),
    nextStep: privateRequired.find((item) => !item.ready)
      ?? publicRequired.find((item) => !item.ready)
      ?? null,
  };
}

export function publicDemoReadinessBlockerLabel(blocker: PublicDemoReadinessBlocker) {
  const labels: Record<PublicDemoReadinessBlocker, string> = {
    private_walkthrough_item_not_ready: "Concluir itens minimos antes do walkthrough privado sintetico.",
    public_demo_item_not_ready: "Registrar evidencias e aprovacoes antes de qualquer demo publica externa.",
    public_claims_guardrail_not_green: "Manter o teste de claims publicos verde antes de expor a narrativa.",
    local_ci_not_green: "Rodar CI local verde antes de demonstrar ou publicar.",
    real_data_enabled: "Manter dados reais bloqueados durante qualquer demonstracao.",
    gate_advance_claimed: "Remover qualquer alegacao de G1 aprovado ou avanco de gate.",
  };
  return labels[blocker];
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
