import type { AuroraAnswer } from "./knowledgeBase";

export type AuroraHighlight = NonNullable<AuroraAnswer["highlights"]>[number];
export type RiskHighlight = AuroraHighlight & { num: number };

const RISK_VALUE_PATTERN = /^R(\d+(?:\.\d+)?)/i;

export function projectRiskHighlights(
  highlights: readonly AuroraHighlight[] = [],
): RiskHighlight[] {
  return highlights.flatMap((highlight) => {
    const match = highlight.value.match(RISK_VALUE_PATTERN);
    if (!match) return [];

    return [{ ...highlight, num: Number.parseFloat(match[1]) }];
  });
}
