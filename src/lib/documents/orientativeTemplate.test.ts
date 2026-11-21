import { ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID } from "@/data/orientativeDocumentTemplates";
import {
  buildOrientativeDocument,
  evaluateOrientativeDocumentSafety,
} from "./orientativeTemplate";

describe("orientative document templates", () => {
  it("renders a preliminary communique without exposing counts below k", () => {
    const result = buildOrientativeDocument(
      ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID.communique,
      {
        orgName: "Empresa Sintetica",
        cycleName: "Ciclo G1",
        generatedAt: "2026-07-04T12:00:00.000Z",
        responseCount: 3,
        kAnonymityMet: false,
        kMin: 5,
      },
    );

    expect(result.safety.ok).toBe(true);
    expect(result.markdown).toContain("Modelo orientativo preliminar.");
    expect(result.markdown).toContain("abaixo de k minimo 5; contagem protegida");
    expect(result.markdown).not.toContain("3 resposta");
    expect(result.markdown).not.toMatch(/100%\s+anonim/i);
  });

  it("keeps the PGR template as an input that requires technical review", () => {
    const result = buildOrientativeDocument(
      ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID.pgr_text,
      {
        orgName: "Empresa Sintetica",
        cycleName: "Ciclo G1",
        generatedAt: "2026-07-04T12:00:00.000Z",
        responseCount: 7,
        kAnonymityMet: true,
        riskCount: 2,
        activeActions: 1,
        readyActions: 1,
        activeControls: 1,
        readyControls: 0,
      },
    );

    expect(result.safety.ok).toBe(true);
    expect(result.markdown).toContain("insumo coletivo para o GRO/PGR");
    expect(result.markdown).toContain("nao substituem AEP, AET");
    expect(result.markdown).toContain("Controle declarado nao reduz risco automaticamente");
    expect(result.markdown).toContain("Revisao obrigatoria antes de uso formal");
  });

  it("renders declared controls as review inputs, not residual-risk reductions", () => {
    const result = buildOrientativeDocument(
      ORIENTATIVE_DOCUMENT_TEMPLATE_BY_ID.controls_implanted,
      {
        orgName: "Empresa Sintetica",
        cycleName: "Ciclo G1",
        generatedAt: "2026-07-04T12:00:00.000Z",
        activeControls: 2,
        readyControls: 1,
        controls: [
          { title: "Canal de ouvidoria", status: "in_progress", readyForReview: false },
          { title: "Rotina de lideranca", status: "done", readyForReview: true },
        ],
      },
    );

    expect(result.safety.ok).toBe(true);
    expect(result.markdown).toContain("| Controle declarado | Status operacional | Uso permitido neste rascunho |");
    expect(result.markdown).toContain("| Canal de ouvidoria | in_progress | pendente de evidencia/revisao |");
    expect(result.markdown).toContain("| Rotina de lideranca | done | pronto para revisao |");
    expect(result.markdown).toContain("nao calcula risco residual");
  });

  it("blocks unsafe overclaims in orientative text", () => {
    const safety = evaluateOrientativeDocumentSafety([
      "Modelo orientativo preliminar.",
      "Nao constitui laudo, parecer juridico, aprovacao de gate ou autorizacao de uso com dados reais.",
      "Requer revisao do responsavel tecnico, privacidade/LGPD e governanca antes de uso formal.",
      "As respostas sao 100% anonimas e o documento garante conformidade automatica.",
    ].join("\n"));

    expect(safety.ok).toBe(false);
    expect(safety.blockers).toContain("absolute_anonymity");
    expect(safety.blockers).toContain("automatic_compliance");
  });
});
