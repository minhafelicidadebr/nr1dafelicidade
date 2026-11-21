import { describe, expect, it } from "vitest";
import { projectRiskHighlights, type AuroraHighlight } from "./answerHighlights";

describe("Aurora answer highlights", () => {
  it("projects only numeric risk values and preserves the closed tone", () => {
    const highlights: AuroraHighlight[] = [
      { label: "Sobrecarga", value: "R20", tone: "danger" },
      { label: "Apoio", value: "R12.5", tone: "warn" },
      { label: "Nota", value: "sem score", tone: "neutral" },
    ];

    expect(projectRiskHighlights(highlights)).toEqual([
      { label: "Sobrecarga", value: "R20", tone: "danger", num: 20 },
      { label: "Apoio", value: "R12.5", tone: "warn", num: 12.5 },
    ]);
  });

  it("returns an empty projection without highlights", () => {
    expect(projectRiskHighlights()).toEqual([]);
  });
});
