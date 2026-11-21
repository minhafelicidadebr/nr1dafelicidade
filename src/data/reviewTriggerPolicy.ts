import type { ReviewTriggerPolicy } from "@/lib/risk/reviewTriggers";

// NR-1 1.5.4.4.6 / 1.5.4.4.6.1: revisao periodica de 2 anos; ate 3 anos com
// certificacao de SGSST valida (ex.: ISO 45001:2018).
export const reviewTriggerPolicy: ReviewTriggerPolicy = {
    policyId: "nr1-review-triggers-2026-07-04",
    periodicMonthsDefault: 24,
    periodicMonthsCertified: 36,
};

export const reviewTriggerLimitations = [
    "Prazos periodicos (24/36 meses) sao os limites da NR-1; nao substituem revisao imediata.",
    "Qualquer das seis situacoes do 1.5.4.4.6 exige revisao imediata, independente do prazo periodico.",
    "Certificacao de 36 meses so vale sem ocorrencia de situacao de revisao imediata.",
];
