import { buildPDF } from "./PDFGenerator";

describe("PDFGenerator output contract", () => {
  it.each(["technical", "poetic"] as const)("generates a non-empty %s PDF with a cover and content page", (pdfType) => {
    const pdf = buildPDF(
      "# Documento preliminar\n\n## Próximo passo\n\n- Registrar uma evidência coletiva.",
      "Autonomia",
      pdfType,
    );

    const bytes = new Uint8Array(pdf.output("arraybuffer"));

    expect(pdf.getNumberOfPages()).toBeGreaterThanOrEqual(2);
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    expect(bytes.byteLength).toBeGreaterThan(1_000);
  });
});
