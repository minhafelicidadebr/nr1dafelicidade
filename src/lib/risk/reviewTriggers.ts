// Gatilhos de revisao da avaliacao de risco (NR-1 subitem 1.5.4.4.6).
// Mecanismo puro: decide se a revisao e devida e por que. Nao acessa dados reais.
//
// Revisao periodica: 2 anos; 3 anos se houver certificacao de SGSST valida
// (ex.: ISO 45001), desde que nao ocorra situacao de revisao imediata (1.5.4.4.6.1).
// Revisao imediata: seis situacoes das alineas "a" a "f".

export type ImmediateReviewTrigger =
    | "post_control_implementation" // a) risco residual apos medidas
    | "process_change_new_risk" // b) inovacoes/mudancas com novos riscos
    | "control_inadequacy" // c) inadequacao/insuficiencia/ineficacia de medidas
    | "accident_or_disease" // d) acidente ou doenca relacionada ao trabalho
    | "legal_requirement_change" // e) mudanca em requisito legal aplicavel
    | "worker_or_cipa_request"; // f) solicitacao justificada de trabalhador/CIPA

export type ReviewTriggerContext = {
    lastReviewISO: string;
    nowISO: string;
    hasValidSGSSTCertification: boolean;
    immediateSituations: ImmediateReviewTrigger[];
};

export type ReviewTriggerPolicy = {
    policyId: string;
    periodicMonthsDefault: number;
    periodicMonthsCertified: number;
};

export type ReviewTriggerReason = "immediate" | "periodic_overdue" | "not_due";

export type ReviewTriggerResult = {
    reviewDue: boolean;
    reason: ReviewTriggerReason;
    requiresImmediateAction: boolean;
    immediateTriggers: ImmediateReviewTrigger[];
    periodicMonthsApplied: number;
    periodicDeadlineISO: string;
    error: "invalid_dates" | null;
};

const IMMEDIATE_LABELS: Record<ImmediateReviewTrigger, string> = {
    post_control_implementation: "Revisar risco residual apos implementacao de medidas (1.5.4.4.6 'a').",
    process_change_new_risk: "Revisar apos inovacoes/mudancas com novos riscos (1.5.4.4.6 'b').",
    control_inadequacy: "Revisar por inadequacao/insuficiencia/ineficacia de medidas (1.5.4.4.6 'c').",
    accident_or_disease: "Revisar apos acidente ou doenca relacionada ao trabalho (1.5.4.4.6 'd').",
    legal_requirement_change: "Revisar apos mudanca de requisito legal aplicavel (1.5.4.4.6 'e').",
    worker_or_cipa_request: "Revisar apos solicitacao justificada de trabalhador/CIPA (1.5.4.4.6 'f').",
};

export function immediateReviewTriggerLabel(trigger: ImmediateReviewTrigger): string {
    return IMMEDIATE_LABELS[trigger];
}

export function evaluateReviewTriggers(
    context: ReviewTriggerContext,
    policy: ReviewTriggerPolicy,
): ReviewTriggerResult {
    const last = new Date(context.lastReviewISO);
    const now = new Date(context.nowISO);
    const periodicMonthsApplied = context.hasValidSGSSTCertification
        ? policy.periodicMonthsCertified
        : policy.periodicMonthsDefault;

    if (Number.isNaN(last.getTime()) || Number.isNaN(now.getTime())) {
        return {
            reviewDue: false,
            reason: "not_due",
            requiresImmediateAction: false,
            immediateTriggers: [],
            periodicMonthsApplied,
            periodicDeadlineISO: "",
            error: "invalid_dates",
        };
    }

    const immediateTriggers = unique(context.immediateSituations);
    const deadline = addMonths(last, periodicMonthsApplied);
    const periodicOverdue = now.getTime() > deadline.getTime();

    const requiresImmediateAction = immediateTriggers.length > 0;
    const reason: ReviewTriggerReason = requiresImmediateAction
        ? "immediate"
        : periodicOverdue
            ? "periodic_overdue"
            : "not_due";

    return {
        reviewDue: reason !== "not_due",
        reason,
        requiresImmediateAction,
        immediateTriggers,
        periodicMonthsApplied,
        periodicDeadlineISO: deadline.toISOString(),
        error: null,
    };
}

function addMonths(date: Date, months: number): Date {
    const result = new Date(date.getTime());
    const targetMonth = result.getMonth() + months;
    result.setMonth(targetMonth);
    return result;
}

function unique<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}
