import {
  normalizeDocumentPrintPayload,
  renderDocumentMarkdown,
} from "./printView";

describe("document print contract", () => {
  it("keeps only the printable, typed document metadata", () => {
    const payload = normalizeDocumentPrintPayload({
      markdown: "# Rascunho preliminar",
      meta: {
        version: 3,
        k_anonymity: 5,
        org_name: "Empresa Sintética",
        sector: "Tecnologia",
        size_band: "50-99",
        cycle_name: "Ciclo G1",
        horizon: "90 dias",
        generated_at: "2026-07-18T12:00:00.000Z",
        criteria_version: "criteria-g2-draft",
        internal_only: { ignored: true },
      },
      data: { shouldNotReachThePrintView: true },
    });

    expect(payload).toEqual({
      markdown: "# Rascunho preliminar",
      meta: {
        version: 3,
        kAnonymity: 5,
        orgName: "Empresa Sintética",
        sector: "Tecnologia",
        sizeBand: "50-99",
        cycleName: "Ciclo G1",
        horizon: "90 dias",
        generatedAt: "2026-07-18T12:00:00.000Z",
        criteriaVersion: "criteria-g2-draft",
      },
    });
  });

  it("fails closed for malformed JSONB content and metadata", () => {
    expect(normalizeDocumentPrintPayload(["not", "a", "document"])).toEqual({
      markdown: "",
      meta: {},
    });

    expect(normalizeDocumentPrintPayload({
      markdown: 42,
      meta: {
        version: 0,
        k_anonymity: 3.5,
        org_name: { unsafe: true },
      },
    })).toEqual({
      markdown: "",
      meta: {},
    });
  });

  it("allows safe links and neutralizes unsafe markdown link protocols", () => {
    document.body.innerHTML = renderDocumentMarkdown([
      "[Fonte](https://example.org/evidencia)",
      "[Contato](mailto:sst@example.org)",
      "[Inseguro](javascript:alert(1))",
      "[Tentativa](https://example.org/\" onclick=\"alert(1))",
    ].join("\n"));

    const links = Array.from(document.querySelectorAll("a"));
    expect(links[0]).toHaveAttribute("href", "https://example.org/evidencia");
    expect(links[1]).toHaveAttribute("href", "mailto:sst@example.org");
    expect(links[2]).toHaveAttribute("href", "#");
    expect(links[3]).not.toHaveAttribute("onclick");
  });
});
