import { describe, expect, it } from "vitest";
import {
    DEFAULT_ACCENT,
    estimateDataUrlBytes,
    relativeLuminance,
    sanitizeBranding,
    validateBranding,
} from "./brandingConfig";

describe("brandingConfig", () => {
    it("aceita hex valido sem warning quando cor e escura o suficiente", () => {
        const result = validateBranding({ accentColor: "#0B1437", logoDataUrl: null });
        expect(result.ok).toBe(true);
        expect(result.blockers).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
    });

    it("bloqueia hex invalido", () => {
        const result = validateBranding({ accentColor: "azul", logoDataUrl: null });
        expect(result.ok).toBe(false);
        expect(result.blockers).toContain("accent_hex_invalido");
    });

    it("alerta cor de acento muito clara sem bloquear", () => {
        const result = validateBranding({ accentColor: "#FFFFFF", logoDataUrl: null });
        expect(result.ok).toBe(true);
        expect(result.warnings).toContain("accent_muito_claro");
    });

    it("bloqueia logo com formato nao suportado", () => {
        const result = validateBranding({ accentColor: DEFAULT_ACCENT, logoDataUrl: "data:text/plain;base64,QQ==" });
        expect(result.ok).toBe(false);
        expect(result.blockers).toContain("logo_formato_invalido");
    });

    it("bloqueia logo acima do limite de bytes", () => {
        const bigBase64 = "A".repeat(700_000);
        const result = validateBranding({ accentColor: DEFAULT_ACCENT, logoDataUrl: `data:image/png;base64,${bigBase64}` });
        expect(result.ok).toBe(false);
        expect(result.blockers).toContain("logo_excede_limite");
    });

    it("sanitiza hex invalido para o default e logo invalido para null", () => {
        const result = sanitizeBranding({ accentColor: "nope", logoDataUrl: "data:text/plain;base64,QQ==" });
        expect(result.accentColor).toBe(DEFAULT_ACCENT);
        expect(result.logoDataUrl).toBeNull();
    });

    it("estima bytes do payload base64", () => {
        expect(estimateDataUrlBytes("data:image/png;base64,QUJD")).toBe(3); // "ABC"
        expect(estimateDataUrlBytes("sem-virgula")).toBe(0);
    });

    it("calcula luminancia e retorna null para hex invalido", () => {
        expect(relativeLuminance("#000000")).toBe(0);
        expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
        expect(relativeLuminance("xyz")).toBeNull();
    });
});
