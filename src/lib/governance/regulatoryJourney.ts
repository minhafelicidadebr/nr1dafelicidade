export type RegulatoryJourneyStage =
  | "foundation"
  | "measurement"
  | "work_context"
  | "risk"
  | "intervention"
  | "evidence"
  | "governance";

export type RegulatoryJourneyInvariant =
  | "g0_synthetic_only"
  | "no_real_data"
  | "no_individual_response_access"
  | "no_identity_invitation_response_correlation"
  | "k_anonymity_min_5"
  | "instrument_versioned"
  | "work_context_not_substituted"
  | "worker_participation_traceable"
  | "risk_formula_auditable"
  | "action_evidence_kpi_review"
  | "control_evidence_required"
  | "documents_preliminary"
  | "technical_review_required"
  | "source_gate_required"
  | "no_gate_advance_without_formal_approval";

export type RegulatoryJourneyGateEffect = "no_gate_change" | "gate_candidate";

export type RegulatoryJourneyStepInput = {
  key: string;
  order: number;
  label: string;
  route: string;
  stage: RegulatoryJourneyStage;
  evidence: string;
  syntheticOnly: boolean;
  gateEffect: RegulatoryJourneyGateEffect;
  requiredInvariants: RegulatoryJourneyInvariant[];
  ctaLabel?: string;
};

export type RegulatoryJourneyPolicy = {
  policyId: string;
  gate: string;
  requireContiguousOrder: boolean;
  requireUniqueRoutes: boolean;
  gateAdvanceAllowed: boolean;
  requiredRoutes: string[];
  terminalRoute: string;
  requiredInvariants: RegulatoryJourneyInvariant[];
};

export type RegulatoryJourneyBlocker =
  | "empty_journey"
  | "missing_step_key"
  | "missing_step_label"
  | "missing_step_route"
  | "missing_evidence"
  | "missing_step_invariant"
  | "duplicate_step_key"
  | "duplicate_order"
  | "duplicate_route"
  | "route_not_declared"
  | "missing_required_route"
  | "missing_required_invariant"
  | "order_not_contiguous"
  | "terminal_route_missing"
  | "terminal_route_not_last"
  | "non_synthetic_step"
  | "gate_advance_claimed";

export type RegulatoryJourneyStep = RegulatoryJourneyStepInput & {
  blockers: RegulatoryJourneyBlocker[];
  ready: boolean;
};

export type RegulatoryJourneySummary = {
  policyId: string;
  gate: string;
  status: "blocked" | "synthetic_ready";
  canRunSynthetic: boolean;
  steps: RegulatoryJourneyStep[];
  totalSteps: number;
  readySteps: number;
  readinessPct: number;
  blockers: RegulatoryJourneyBlocker[];
  missingRequiredRoutes: string[];
  missingRequiredInvariants: RegulatoryJourneyInvariant[];
  nextStep: string;
};

const BLOCKER_LABELS: Record<RegulatoryJourneyBlocker, string> = {
  empty_journey: "Definir pelo menos um passo da jornada sintetica.",
  missing_step_key: "Registrar chave estavel para cada passo da jornada.",
  missing_step_label: "Registrar rotulo operacional para cada passo.",
  missing_step_route: "Registrar rota navegavel para cada passo.",
  missing_evidence: "Registrar a evidencia produzida por cada passo.",
  missing_step_invariant: "Vincular cada passo a pelo menos um invariante Fable 5.",
  duplicate_step_key: "Remover chaves duplicadas da jornada.",
  duplicate_order: "Remover ordens duplicadas da jornada.",
  duplicate_route: "Remover rotas duplicadas ou dividir a evidencia por passo.",
  route_not_declared: "Alinhar a rota do passo com o contrato de rotas exigidas.",
  missing_required_route: "Adicionar rota obrigatoria ao contrato da jornada.",
  missing_required_invariant: "Cobrir todos os invariantes obrigatorios da jornada.",
  order_not_contiguous: "Ordenar a jornada de forma contigua a partir de 1.",
  terminal_route_missing: "Adicionar a rota terminal de governanca ao contrato.",
  terminal_route_not_last: "Manter governanca como ultimo passo da demonstracao sintetica.",
  non_synthetic_step: "Marcar o passo como sintetico ou remover dependencia de dados reais.",
  gate_advance_claimed: "Remover qualquer alegacao de avanco de gate sem aceite formal.",
};

export function evaluateRegulatoryJourney(
  steps: RegulatoryJourneyStepInput[],
  policy: RegulatoryJourneyPolicy,
): RegulatoryJourneySummary {
  const duplicateKeys = duplicateValues(steps.map((step) => normalize(step.key)).filter(Boolean));
  const duplicateOrders = duplicateValues(steps.map((step) => String(step.order)));
  const duplicateRoutes = duplicateValues(steps.map((step) => normalize(step.route)).filter(Boolean));
  const coveredRoutes = new Set(steps.map((step) => step.route).filter(Boolean));
  const coveredInvariants = new Set(steps.flatMap((step) => step.requiredInvariants));
  const missingRequiredRoutes = policy.requiredRoutes.filter((route) => !coveredRoutes.has(route));
  const missingRequiredInvariants = policy.requiredInvariants.filter(
    (invariant) => !coveredInvariants.has(invariant),
  );
  const terminalStep = steps.find((step) => step.route === policy.terminalRoute);
  const maxOrder = steps.length > 0 ? Math.max(...steps.map((step) => step.order)) : 0;

  const globalBlockers: RegulatoryJourneyBlocker[] = [];
  if (steps.length === 0) globalBlockers.push("empty_journey");
  if (duplicateKeys.length > 0) globalBlockers.push("duplicate_step_key");
  if (duplicateOrders.length > 0) globalBlockers.push("duplicate_order");
  if (policy.requireUniqueRoutes && duplicateRoutes.length > 0) globalBlockers.push("duplicate_route");
  if (missingRequiredRoutes.length > 0) globalBlockers.push("missing_required_route");
  if (missingRequiredInvariants.length > 0) globalBlockers.push("missing_required_invariant");
  if (policy.requireContiguousOrder && !hasContiguousOrder(steps)) globalBlockers.push("order_not_contiguous");
  if (!terminalStep) globalBlockers.push("terminal_route_missing");
  if (terminalStep && terminalStep.order !== maxOrder) globalBlockers.push("terminal_route_not_last");

  const stepsWithReadiness = steps
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((step) => {
      const blockers = evaluateStep(step, policy, duplicateKeys, duplicateOrders, duplicateRoutes);
      return {
        ...step,
        blockers,
        ready: blockers.length === 0,
      };
    });

  const blockers = unique([
    ...globalBlockers,
    ...stepsWithReadiness.flatMap((step) => step.blockers),
  ]);
  const readySteps = stepsWithReadiness.filter((step) => step.ready).length;
  const canRunSynthetic = steps.length > 0 && blockers.length === 0;

  return {
    policyId: policy.policyId,
    gate: policy.gate,
    status: canRunSynthetic ? "synthetic_ready" : "blocked",
    canRunSynthetic,
    steps: stepsWithReadiness,
    totalSteps: stepsWithReadiness.length,
    readySteps,
    readinessPct: pct(readySteps, stepsWithReadiness.length),
    blockers,
    missingRequiredRoutes,
    missingRequiredInvariants,
    nextStep: blockers.length > 0
      ? regulatoryJourneyBlockerLabel(blockers[0])
      : "Contrato sintetico pronto para demonstracao local; nao aprova G1 e nao libera dados reais.",
  };
}

export function regulatoryJourneyBlockerLabel(blocker: RegulatoryJourneyBlocker) {
  return BLOCKER_LABELS[blocker];
}

function evaluateStep(
  step: RegulatoryJourneyStepInput,
  policy: RegulatoryJourneyPolicy,
  duplicateKeys: string[],
  duplicateOrders: string[],
  duplicateRoutes: string[],
) {
  const blockers: RegulatoryJourneyBlocker[] = [];
  const key = normalize(step.key);
  const route = normalize(step.route);

  if (!key) blockers.push("missing_step_key");
  if (!step.label?.trim()) blockers.push("missing_step_label");
  if (!route) blockers.push("missing_step_route");
  if (!step.evidence?.trim()) blockers.push("missing_evidence");
  if (step.requiredInvariants.length === 0) blockers.push("missing_step_invariant");
  if (key && duplicateKeys.includes(key)) blockers.push("duplicate_step_key");
  if (duplicateOrders.includes(String(step.order))) blockers.push("duplicate_order");
  if (route && policy.requireUniqueRoutes && duplicateRoutes.includes(route)) blockers.push("duplicate_route");
  if (route && !policy.requiredRoutes.includes(step.route)) blockers.push("route_not_declared");
  if (!step.syntheticOnly) blockers.push("non_synthetic_step");
  if (step.gateEffect === "gate_candidate" && !policy.gateAdvanceAllowed) blockers.push("gate_advance_claimed");

  return unique(blockers);
}

function hasContiguousOrder(steps: RegulatoryJourneyStepInput[]) {
  if (steps.length === 0) return false;
  const orders = steps.map((step) => step.order).sort((a, b) => a - b);
  return orders.every((order, index) => order === index + 1);
}

function duplicateValues(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

function normalize(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function pct(ok: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((ok / total) * 100);
}
