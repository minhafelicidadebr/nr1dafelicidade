/**
 * White-label seguro de documentos — configuracao de marca local (Bloco Documentos)
 *
 * A marca (cor de acento + logo) e aplicada apenas a capa, cabecalhos, bordas
 * neutras e rodape do laudo. Cores semanticas (zonas de risco verde/amarelo/
 * vermelho, matriz, status, k) NUNCA sao alteradas pela marca.
 *
 * Persistencia e local (localStorage), por organizacao. Sem schema, sem
 * servidor, sem PII. Mecanismo puro e testavel: validacao e serializacao
 * ficam aqui; I/O de localStorage fica isolado nas funcoes load/save.
 */

export type DocumentBranding = {
    accentColor: string; // hex #RRGGBB
    logoDataUrl: string | null; // data URL (PNG/JPG/SVG) ou null
};

export type BrandingValidation = {
    ok: boolean;
    warnings: string[];
    blockers: string[];
};

export const DEFAULT_ACCENT = "#C9A24B"; // gold padrao do laudo
export const MAX_LOGO_BYTES = 500_000;

const HEX_PATTERN = /^#([0-9a-f]{6})$/i;
const DATA_URL_PATTERN = /^data:image\/(png|jpeg|jpg|svg\+xml);base64,/i;
const STORAGE_PREFIX = "doc-branding:";

export const defaultBranding = (): DocumentBranding => ({
    accentColor: DEFAULT_ACCENT,
    logoDataUrl: null,
});

/** Luminancia relativa aproximada (0..1) para alertar cor clara demais. */
export function relativeLuminance(hex: string): number | null {
    const match = HEX_PATTERN.exec(hex.trim());
    if (!match) return null;
    const int = parseInt(match[1], 16);
    const r = ((int >> 16) & 255) / 255;
    const g = ((int >> 8) & 255) / 255;
    const b = (int & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function validateBranding(branding: DocumentBranding): BrandingValidation {
    const warnings: string[] = [];
    const blockers: string[] = [];

    if (!HEX_PATTERN.test(branding.accentColor.trim())) {
        blockers.push("accent_hex_invalido");
    } else {
        const lum = relativeLuminance(branding.accentColor);
        if (lum !== null && lum > 0.75) {
            warnings.push("accent_muito_claro");
        }
    }

    if (branding.logoDataUrl !== null) {
        if (!DATA_URL_PATTERN.test(branding.logoDataUrl)) {
            blockers.push("logo_formato_invalido");
        } else if (estimateDataUrlBytes(branding.logoDataUrl) > MAX_LOGO_BYTES) {
            blockers.push("logo_excede_limite");
        }
    }

    return { ok: blockers.length === 0, warnings, blockers };
}

/** Estima o tamanho em bytes do payload base64 de um data URL. */
export function estimateDataUrlBytes(dataUrl: string): number {
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex < 0) return 0;
    const base64 = dataUrl.slice(commaIndex + 1);
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

/** Sanitiza para uso seguro no template: hex valido ou default; logo valido ou null. */
export function sanitizeBranding(branding: DocumentBranding): DocumentBranding {
    const accentColor = HEX_PATTERN.test(branding.accentColor.trim())
        ? branding.accentColor.trim()
        : DEFAULT_ACCENT;
    const logoDataUrl =
        branding.logoDataUrl && DATA_URL_PATTERN.test(branding.logoDataUrl) &&
            estimateDataUrlBytes(branding.logoDataUrl) <= MAX_LOGO_BYTES
            ? branding.logoDataUrl
            : null;
    return { accentColor, logoDataUrl };
}

export function loadBranding(organizationId: string | null | undefined): DocumentBranding {
    if (!organizationId || typeof localStorage === "undefined") return defaultBranding();
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + organizationId);
        if (!raw) return defaultBranding();
        const parsed = JSON.parse(raw) as Partial<DocumentBranding>;
        return sanitizeBranding({
            accentColor: parsed.accentColor ?? DEFAULT_ACCENT,
            logoDataUrl: parsed.logoDataUrl ?? null,
        });
    } catch {
        return defaultBranding();
    }
}

export function saveBranding(organizationId: string | null | undefined, branding: DocumentBranding): BrandingValidation {
    const validation = validateBranding(branding);
    if (!validation.ok || !organizationId || typeof localStorage === "undefined") return validation;
    try {
        localStorage.setItem(STORAGE_PREFIX + organizationId, JSON.stringify(sanitizeBranding(branding)));
    } catch {
        return { ok: false, warnings: validation.warnings, blockers: ["persistencia_indisponivel"] };
    }
    return validation;
}
