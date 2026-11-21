/**
 * Bridge global para abrir a Sra. EstratégIA - IA a partir de qualquer página.
 * Uso: openStrategIA({ question: "...", intent: "risk.top3" })
 *   - question (opcional): texto livre exibido como pergunta do usuário
 *   - intent (opcional):   chave do knowledgeBase para resposta determinística
 *   - context (opcional):  contexto curto adicionado à pergunta exibida
 */
export type OpenStrategIAArgs = {
  question?: string;
  intent?: string;
  context?: string;
};

export const STRATEGIA_OPEN_EVENT = "strategia:open";

export function openStrategIA(args: OpenStrategIAArgs = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STRATEGIA_OPEN_EVENT, { detail: args }));
}
