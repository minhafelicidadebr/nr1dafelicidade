import { describe, expect, it } from "vitest";
import {
    BUDGET_ALERT_RATIO,
    TOTAL_CREDIT_BUDGET,
    type CreditLedger,
    type FormalAcceptance,
    evaluateBudget,
    evaluateGateConclusion,
    evaluateSprintDecision,
    listExternalBlockers,
    pendingExternalBlockersForGate,
    sprintBudgetReport,
    sprintConsumedCredits,
} from "./creditLedger";
import { roadmapCreditLedger } from "@/data/creditLedgerData";

function ledger(overrides: Partial<CreditLedger> = {}): CreditLedger {
    return {
        totalBudget: 130,
        bufferCredits: 26,
        sprints: [
            {
                id: "SA",
                name: "Sprint A",
                allocatedCredits: 40,
                workItems: [
                    { id: "a1", description: "codigo", classification: "code_work", creditsConsumed: 10 },
                    { id: "a2", description: "decisao", classification: "external_decision", creditsConsumed: 999 },
                ],
            },
            {
                id: "SB",
                name: "Sprint B",
                allocatedCredits: 30,
                workItems: [
                    { id: "b1", description: "codigo", classification: "code_work", creditsConsumed: 20 },
                ],
            },
        ],
        externalBlockers: [
            { id: "X1", description: "licenca", blocksGate: "G2", resolved: false },
            { id: "X2", description: "lgpd", blocksGate: "G3", resolved: false },
            { id: "X3", description: "resolvido", blocksGate: "G2", resolved: true },
        ],
        ...overrides,
    };
}

const greenCI = { verifyGreen: true, databaseSecurityGreen: true };

describe("Req 1 - orcamento e alocacao", () => {
    it("exclui decisoes externas do consumo (Req 1.4)", () => {
        const sprint = ledger().sprints[0];
        // 10 (code_work) + ignora 999 (external_decision).
        expect(sprintConsumedCredits(sprint)).toBe(10);
    });

    it("reporta alocado/consumido/remanescente por sprint (Req 1.2)", () => {
        const report = sprintBudgetReport(ledger().sprints[0]);
        expect(report).toMatchObject({ allocated: 40, consumed: 10, remaining: 30 });
    });

    it("agrega orcamento e mantem teto de 130 (Req 1.1)", () => {
        const out = evaluateBudget(ledger());
        expect(out.totalBudget).toBe(130);
        expect(out.allocatedToSprints).toBe(70);
        expect(out.consumed).toBe(30); // 10 + 20
        expect(out.remaining).toBe(100);
        expect(out.overAllocated).toBe(false);
    });

    it("bloqueia planejamento quando comprometido excede 130 (Req 1.5)", () => {
        const out = evaluateBudget(ledger({ bufferCredits: 70 })); // 70 sprints + 70 buffer = 140
        expect(out.committed).toBe(140);
        expect(out.overAllocated).toBe(true);
        expect(out.planningBlocked).toBe(true);
    });

    it("emite alerta ao atingir 80% do orcamento (Req 1.6)", () => {
        const heavy = ledger({
            sprints: [
                {
                    id: "SA",
                    name: "Sprint A",
                    allocatedCredits: 110,
                    workItems: [
                        { id: "a1", description: "codigo", classification: "code_work", creditsConsumed: 104 },
                    ],
                },
            ],
            bufferCredits: 0,
        });
        const out = evaluateBudget(heavy);
        expect(out.consumedRatio).toBeGreaterThanOrEqual(BUDGET_ALERT_RATIO);
        expect(out.budgetAlert).toBe(true);
    });

    it("mantem lista explicita de bloqueadores externos (Req 1.7)", () => {
        expect(listExternalBlockers(ledger())).toHaveLength(3);
        const pendingG2 = pendingExternalBlockersForGate(ledger(), "G2");
        expect(pendingG2.map((b) => b.id)).toEqual(["X1"]); // X3 resolvido e excluido
    });
});

describe("Req 2 - progressao de gates", () => {
    const validAcceptance: FormalAcceptance = {
        gate: "G1",
        dateISO: "2026-07-07T00:00:00.000Z",
        responsible: "Responsavel Tecnico",
        evidenceRef: "docs/G1_FORMAL_ACCEPTANCE_LEDGER.md",
        independentReviewRecorded: true,
    };

    it("conclui o gate com aceite completo, CI verde e sem pendencias", () => {
        const out = evaluateGateConclusion({
            gate: "G1",
            acceptance: validAcceptance,
            ciState: greenCI,
            requiresIndependentReview: true,
            pendingExternalBlockers: [],
        });
        expect(out.concluded).toBe(true);
        expect(out.rejectionReasons).toEqual([]);
    });

    it("nao conclui sem aceite formal (Req 2.1)", () => {
        const out = evaluateGateConclusion({
            gate: "G1",
            acceptance: null,
            ciState: greenCI,
            requiresIndependentReview: false,
            pendingExternalBlockers: [],
        });
        expect(out.concluded).toBe(false);
        expect(out.rejectionReasons).toContain("missing_formal_acceptance");
    });

    it("rejeita avanco sem CI verde (Req 2.2)", () => {
        const out = evaluateGateConclusion({
            gate: "G1",
            acceptance: validAcceptance,
            ciState: { verifyGreen: true, databaseSecurityGreen: false },
            requiresIndependentReview: true,
            pendingExternalBlockers: [],
        });
        expect(out.concluded).toBe(false);
        expect(out.rejectionReasons).toContain("ci_not_green");
    });

    it("impede conclusao com decisao externa pendente e a identifica (Req 2.4)", () => {
        const out = evaluateGateConclusion({
            gate: "G2",
            acceptance: { ...validAcceptance, gate: "G2" },
            ciState: greenCI,
            requiresIndependentReview: false,
            pendingExternalBlockers: [{ id: "X1", description: "licenca", blocksGate: "G2", resolved: false }],
        });
        expect(out.concluded).toBe(false);
        expect(out.rejectionReasons).toContain("pending_external_decision");
        expect(out.pendingExternalBlockers.map((b) => b.id)).toEqual(["X1"]);
    });

    it("exige revisao independente quando requerida (Req 2.6)", () => {
        const out = evaluateGateConclusion({
            gate: "G1",
            acceptance: { ...validAcceptance, independentReviewRecorded: false },
            ciState: greenCI,
            requiresIndependentReview: true,
            pendingExternalBlockers: [],
        });
        expect(out.concluded).toBe(false);
        expect(out.rejectionReasons).toContain("independent_review_missing");
    });

    it("exige evidencia/responsavel/data no aceite (Req 2.5)", () => {
        const out = evaluateGateConclusion({
            gate: "G1",
            acceptance: { ...validAcceptance, evidenceRef: "" },
            ciState: greenCI,
            requiresIndependentReview: false,
            pendingExternalBlockers: [],
        });
        expect(out.concluded).toBe(false);
        expect(out.rejectionReasons).toContain("acceptance_evidence_missing");
    });
});

describe("Req 12 - pontos de decisao go/no-go", () => {
    it("libera a proxima sprint com go, CI verde, evidencia e creditos suficientes", () => {
        const out = evaluateSprintDecision({
            sprintId: "S0",
            decision: "go",
            evidenceRef: "run-123",
            ciState: greenCI,
            remainingCredits: 100,
            nextSprintAllocation: 17,
        });
        expect(out.mayAllocateNextSprint).toBe(true);
        expect(out.reasons).toEqual([]);
        expect(out.remainingCredits).toBe(100);
    });

    it("bloqueia alocacao adicional apos no-go (Req 12.2)", () => {
        const out = evaluateSprintDecision({
            sprintId: "S0",
            decision: "no_go",
            evidenceRef: "run-123",
            ciState: greenCI,
            remainingCredits: 100,
            nextSprintAllocation: 17,
        });
        expect(out.mayAllocateNextSprint).toBe(false);
        expect(out.reasons).toContain("blocked_by_no_go");
    });

    it("exige decisao registrada antes de prosseguir (Req 12.1)", () => {
        const out = evaluateSprintDecision({
            sprintId: "S0",
            decision: "pending",
            evidenceRef: "run-123",
            ciState: greenCI,
            remainingCredits: 100,
            nextSprintAllocation: 17,
        });
        expect(out.mayAllocateNextSprint).toBe(false);
        expect(out.reasons).toContain("decision_pending");
    });

    it("exige vinculo com evidencia e CI (Req 12.3)", () => {
        const out = evaluateSprintDecision({
            sprintId: "S0",
            decision: "go",
            evidenceRef: "",
            ciState: { verifyGreen: false, databaseSecurityGreen: true },
            remainingCredits: 100,
            nextSprintAllocation: 17,
        });
        expect(out.reasons).toContain("missing_evidence_link");
        expect(out.reasons).toContain("ci_not_green");
    });

    it("sinaliza repriorizacao quando remanescente e insuficiente (Req 12.4/12.5)", () => {
        const out = evaluateSprintDecision({
            sprintId: "S3",
            decision: "go",
            evidenceRef: "run-999",
            ciState: greenCI,
            remainingCredits: 5,
            nextSprintAllocation: 17,
        });
        expect(out.mayAllocateNextSprint).toBe(false);
        expect(out.reprioritizationNeeded).toBe(true);
        expect(out.reasons).toContain("insufficient_credits_for_next");
        expect(out.remainingCredits).toBe(5);
    });
});

describe("ledger real do roadmap", () => {
    it("respeita o teto: 93 sprints + 26 buffer = 119 <= 130", () => {
        const out = evaluateBudget(roadmapCreditLedger);
        expect(out.totalBudget).toBe(TOTAL_CREDIT_BUDGET);
        expect(out.allocatedToSprints).toBe(93);
        expect(out.bufferCredits).toBe(26);
        expect(out.committed).toBe(119);
        expect(out.overAllocated).toBe(false);
    });

    it("lista os bloqueadores externos previstos no design (Req 1.7)", () => {
        expect(listExternalBlockers(roadmapCreditLedger).length).toBeGreaterThanOrEqual(6);
    });
});
