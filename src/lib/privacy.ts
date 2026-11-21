/**
 * Privacy / k-anonimato — Bloco 2
 *
 * Regra única do produto: nenhum agregado psicossocial (score, severidade,
 * probabilidade, risco, driver, ação recomendada) pode ser exibido,
 * exportado ou impresso em documento quando o nº de respostas (n) for
 * inferior a K_ANONYMITY_MIN.
 */
export const K_ANONYMITY_MIN = 5;

export function canDisplayAggregate(n: number | null | undefined): boolean {
  return typeof n === "number" && n >= K_ANONYMITY_MIN;
}

export function redactIfBelowK<T>(n: number | null | undefined, value: T): T | null {
  return canDisplayAggregate(n) ? value : null;
}

export const PRIVACY_REDACTED_LABEL = "—";

export function privacyNoticeShort(n?: number | null) {
  if (canDisplayAggregate(n)) return null;
  return `Amostra insuficiente (n=${n ?? 0}, mínimo ${K_ANONYMITY_MIN}) — dado ocultado para preservar anonimato.`;
}
