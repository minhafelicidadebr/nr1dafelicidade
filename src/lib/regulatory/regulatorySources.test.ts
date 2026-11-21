import { describe, expect, it } from "vitest";
import {
    evaluateRegulatorySources,
    regulatorySourceFlagLabel,
    type RegulatorySourceRecord,
} from "@/lib/regulatory/regulatorySources";
import { regulatorySources } from "@/data/regulatorySources";

const validHash = "a".repeat(64);

function record(overrides: Partial<RegulatorySourceRecord>): RegulatorySourceRecord {
    return {
        id: "X",
        title: "X",
        publisher: "MTE",
        docType: "norma",
        authority: "vinculante",
        legalReference: "Portaria X",
        url: "https://example.gov.br",
        version: "2024",
        effectiveDate: null,
        sha256: validHash,
        licenseStatus: "dominio_publico_oficial",
        consultTogetherWith: [],
        notes: "",
        ...overrides,
    };
}

describe("evaluateRegulatorySources", () => {
    it("flags missing hash as pending integrity", () => {
        const summary = evaluateRegulatorySources([record({ sha256: null })]);
        expect(summary.items[0].flags).toContain("missing_hash");
        expect(summary.items[0].integrityArchived).toBe(false);
        expect(summary.pendingHash).toBe(1);
        expect(summary.withHash).toBe(0);
    });

    it("rejects fabricated non-hex hash", () => {
        const summary = evaluateRegulatorySources([record({ sha256: "not-a-real-hash" })]);
        expect(summary.items[0].flags).toContain("missing_hash");
        expect(summary.items[0].integrityArchived).toBe(false);
    });

    it("requires legal reference only for norma docs", () => {
        const norma = evaluateRegulatorySources([record({ docType: "norma", legalReference: null })]);
        expect(norma.items[0].flags).toContain("missing_legal_reference");

        const guia = evaluateRegulatorySources([
            record({ docType: "guia_mte", authority: "orientativo", legalReference: null }),
        ]);
        expect(guia.items[0].flags).not.toContain("missing_legal_reference");
    });

    it("separates binding law from guidance", () => {
        const summary = evaluateRegulatorySources([
            record({ id: "law", authority: "vinculante" }),
            record({ id: "guide", authority: "orientativo", docType: "guia_mte" }),
        ]);
        expect(summary.binding).toBe(1);
        expect(summary.guidance).toBe(1);
    });

    it("marks undetermined license", () => {
        const summary = evaluateRegulatorySources([record({ licenseStatus: "desconhecido" })]);
        expect(summary.items[0].flags).toContain("license_undetermined");
    });

    it("keeps the registered MTE/NR sources honest: no fabricated hash", () => {
        const summary = evaluateRegulatorySources(regulatorySources);
        expect(summary.total).toBe(4);
        expect(summary.binding).toBeGreaterThanOrEqual(2); // NR-1 e NR-17
        // Nenhum arquivo foi versionado ainda: todos pendentes de hash.
        expect(summary.pendingHash).toBe(summary.total);
        expect(summary.withHash).toBe(0);
    });

    it("exposes readable labels for every flag", () => {
        expect(regulatorySourceFlagLabel("missing_hash")).toMatch(/hash/i);
        expect(regulatorySourceFlagLabel("license_undetermined")).toMatch(/licen/i);
    });
});
