// Ledger minimo de orcamento/gate/go-no-go do roadmap SaaS Premium NR-1.
// Mecanismo puro e deterministico: nao acessa dados reais nem rede. Implementa
// os requisitos Req 1 (orcamento fixo de creditos), Req 2 (progressao de gates
// com aceite formal + CI verde) e Req 12 (pontos de decisao go/no-go por sprint)
// do spec .kiro/specs/saas-premium-launch-roadmap.
//
// Principio fail-closed: na duvida, um gate NAO e concluido e a proxima sprint
// NAO recebe creditos. Toda rejeicao carrega um motivo auditavel.

export const TOTAL_CREDIT_BUDGET = 130;
export const BUDGET_ALERT_RATIO = 0.8;

export type GateId = "G0" | "G1" | "G2" | "G3";

// Req 1.3: cada item de trabalho e classificado. Somente "code_work" consome
// creditos; "external_decision" nunca consome (Req 1.4), mas pode bloquear gate.
export type WorkItemClassification = "code_work" | "external_decision";

export type GoNoGo = "go" | "no_go" | "pending";

export type WorkItem = {
    id: string;
    description: string;
    classification: WorkItemClassification;
    creditsConsumed: number;
};

export type SprintLedgerEntry = {
    id: string;
    name: string;
    allocatedCredits: number;
    workItems: WorkItem[];
};

// Req 1.7 / Req 2.4: itens fora do orcamento que dependem de terceiros e
// bloqueiam a conclusao de um gate ate serem resolvidos.
export type ExternalBlocker = {
    id: string;
    description: string;
    blocksGate: GateId;
    resolved: boolean;
};

export type CreditLedger = {
    totalBudget: number;
    bufferCredits: number;
    sprints: SprintLedgerEntry[];
    externalBlockers: ExternalBlocker[];
};

export type CIState = {
    verifyGreen: boolean;
    databaseSecurityGreen: boolean;
};

// -------------------- Req 1: orcamento e alocacao --------------------

// Req 1.4: consumo considera apenas itens de codigo; decisoes externas sao
// excluidas do calculo. Valores negativos sao tratados como zero (fail-closed).
export function sprintConsumedCredits(sprint: SprintLedgerEntry): number {
    return sprint.workItems
        .filter((item) => item.classification === "code_work")
        .reduce((sum, item) => sum + Math.max(0, item.creditsConsumed), 0);
}

export type SprintBudgetReport = {
    id: string;
    name: string;
    allocated: number;
    consumed: number;
    remaining: number;
};

// Req 1.2: por sprint, creditos alocados, consumidos e remanescentes.
export function sprintBudgetReport(sprint: SprintLedgerEntry): SprintBudgetReport {
    const consumed = sprintConsumedCredits(sprint);
    return {
        id: sprint.id,
        name: sprint.name,
        allocated: sprint.allocatedCredits,
        consumed,
        remaining: sprint.allocatedCredits - consumed,
    };
}

export type BudgetEvaluation = {
    totalBudget: number;
    allocatedToSprints: number;
    bufferCredits: number;
    committed: number;
    consumed: number;
    remaining: number;
    consumedRatio: number;
    overAllocated: boolean;
    planningBlocked: boolean;
    budgetAlert: boolean;
};

// Req 1.1/1.2/1.5/1.6: avalia o orcamento agregado do ledger.
export function evaluateBudget(ledger: CreditLedger): BudgetEvaluation {
    const allocatedToSprints = ledger.sprints.reduce(
        (sum, sprint) => sum + Math.max(0, sprint.allocatedCredits),
        0,
    );
    const consumed = ledger.sprints.reduce(
        (sum, sprint) => sum + sprintConsumedCredits(sprint),
        0,
    );
    const committed = allocatedToSprints + Math.max(0, ledger.bufferCredits);
    // Req 1.5: soma de creditos comprometidos acima do teto bloqueia o planejamento.
    const overAllocated = committed > ledger.totalBudget;
    const consumedRatio = ledger.totalBudget > 0 ? consumed / ledger.totalBudget : 0;
    return {
        totalBudget: ledger.totalBudget,
        allocatedToSprints,
        bufferCredits: Math.max(0, ledger.bufferCredits),
        committed,
        consumed,
        remaining: ledger.totalBudget - consumed,
        consumedRatio,
        overAllocated,
        planningBlocked: overAllocated,
        // Req 1.6: alerta ao atingir/exceder 80% do orcamento.
        budgetAlert: consumedRatio >= BUDGET_ALERT_RATIO,
    };
}

// Req 1.7: lista explicita de bloqueadores externos (dependencias de terceiros).
export function listExternalBlockers(ledger: CreditLedger): ExternalBlocker[] {
    return [...ledger.externalBlockers];
}

export function pendingExternalBlockersForGate(
    ledger: CreditLedger,
    gate: GateId,
): ExternalBlocker[] {
    return ledger.externalBlockers.filter((b) => b.blocksGate === gate && !b.resolved);
}

// -------------------- Req 2: progressao de gates --------------------

export type FormalAcceptance = {
    gate: GateId;
    dateISO: string;
    responsible: string;
    evidenceRef: string;
    independentReviewRecorded: boolean;
};

export type GateConclusionReason =
    | "missing_formal_acceptance" // Req 2.1
    | "acceptance_evidence_missing" // Req 2.5
    | "ci_not_green" // Req 2.2
    | "independent_review_missing" // Req 2.6
    | "pending_external_decision"; // Req 2.4

export type GateConclusionInput = {
    gate: GateId;
    acceptance: FormalAcceptance | null;
    ciState: CIState;
    requiresIndependentReview: boolean;
    pendingExternalBlockers: ExternalBlocker[];
};

export type GateConclusionResult = {
    concluded: boolean;
    rejectionReasons: GateConclusionReason[];
    pendingExternalBlockers: ExternalBlocker[];
};

// Req 2.1/2.2/2.4/2.5/2.6: um gate so e concluido com aceite formal completo,
// CI verde (verify + database-security), revisao independente quando exigida e
// nenhuma decisao externa bloqueante pendente.
export function evaluateGateConclusion(input: GateConclusionInput): GateConclusionResult {
    const reasons: GateConclusionReason[] = [];

    if (!input.acceptance) {
        reasons.push("missing_formal_acceptance");
    } else {
        const { dateISO, responsible, evidenceRef, gate } = input.acceptance;
        if (!dateISO || !responsible || !evidenceRef || gate !== input.gate) {
            reasons.push("acceptance_evidence_missing");
        }
        if (input.requiresIndependentReview && !input.acceptance.independentReviewRecorded) {
            reasons.push("independent_review_missing");
        }
    }

    if (!input.ciState.verifyGreen || !input.ciState.databaseSecurityGreen) {
        reasons.push("ci_not_green");
    }

    const pending = input.pendingExternalBlockers.filter((b) => !b.resolved);
    if (pending.length > 0) {
        reasons.push("pending_external_decision");
    }

    return {
        concluded: reasons.length === 0,
        rejectionReasons: reasons,
        pendingExternalBlockers: pending,
    };
}

// -------------------- Req 12: pontos de decisao go/no-go --------------------

export type SprintDecisionInput = {
    sprintId: string;
    decision: GoNoGo;
    evidenceRef: string;
    ciState: CIState;
    remainingCredits: number;
    nextSprintAllocation: number | null;
};

export type SprintDecisionReason =
    | "decision_pending" // Req 12.1
    | "blocked_by_no_go" // Req 12.2
    | "missing_evidence_link" // Req 12.3
    | "ci_not_green" // Req 12.3
    | "insufficient_credits_for_next"; // Req 12.5

export type SprintDecisionResult = {
    mayAllocateNextSprint: boolean;
    reasons: SprintDecisionReason[];
    remainingCredits: number;
    reprioritizationNeeded: boolean;
};

// Req 12.1/12.2/12.3/12.4/12.5: valida a decisao de fim de sprint e se a proxima
// sprint pode receber creditos. Registra os creditos remanescentes (12.4).
export function evaluateSprintDecision(input: SprintDecisionInput): SprintDecisionResult {
    const reasons: SprintDecisionReason[] = [];

    if (input.decision === "pending") {
        reasons.push("decision_pending");
    }
    if (input.decision === "no_go") {
        reasons.push("blocked_by_no_go");
    }
    // Req 12.3: a decisao deve estar vinculada a evidencia auditavel e ao CI.
    if (!input.evidenceRef) {
        reasons.push("missing_evidence_link");
    }
    if (!input.ciState.verifyGreen || !input.ciState.databaseSecurityGreen) {
        reasons.push("ci_not_green");
    }

    // Req 12.5: creditos remanescentes insuficientes para a proxima sprint.
    let reprioritizationNeeded = false;
    if (
        input.nextSprintAllocation !== null &&
        input.remainingCredits < input.nextSprintAllocation
    ) {
        reasons.push("insufficient_credits_for_next");
        reprioritizationNeeded = true;
    }

    return {
        mayAllocateNextSprint: input.decision === "go" && reasons.length === 0,
        reasons,
        remainingCredits: input.remainingCredits,
        reprioritizationNeeded,
    };
}
