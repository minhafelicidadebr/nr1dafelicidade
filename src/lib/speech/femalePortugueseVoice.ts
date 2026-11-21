/**
 * Motor Estrito de Síntese de Voz Feminina em Português (pt-BR)
 * - Faz pré-carregamento assíncrono via window.speechSynthesis.onvoiceschanged
 * - Bloqueia explicitamente todas as vozes masculinas conhecidas (ex.: Microsoft Daniel, Antonio, Ricardo)
 * - Prioriza vozes femininas neurais em Português do Brasil (Francisca, Thalita, Luciana, Maria, Fernanda, Camila, Vitória)
 * - Aplica calibração de pitch formante feminino quando o navegador expõe apenas um motor genérico
 */

const MALE_VOICE_BLACKLIST =
  /\b(daniel|antonio|antônio|ricardo|tiago|felipe|carlos|jorge|lucas|miguel|paulo|pedro|david|mark|james|thomas|nicolas|alex|reed|rocko|eddy|grandpa|male|masculino|homem|guy|man)\b/i;

const FEMALE_VOICE_WHITELIST =
  /\b(francisca|thalita|luciana|maria|fernanda|camila|vitória|vitoria|letícia|leticia|raquel|leila|joana|catarina|heloísa|heloisa|ines|inês|sofia|ana|clara|female|feminino|feminina|mulher|samantha|paulina|monica|mónica|elena|laura)\b/i;

const TIER1_PT_FEMALE_NAMES = [
  "francisca",
  "thalita",
  "luciana",
  "fernanda",
  "maria",
  "camila",
  "vitória",
  "vitoria",
  "letícia",
  "leticia",
  "raquel",
  "leila",
  "joana",
  "catarina",
  "heloísa",
  "heloisa",
  "inês",
  "ines",
] as const;

export interface FemaleVoiceSelection {
  readonly voice: SpeechSynthesisVoice | null;
  readonly lang: string;
  readonly voiceLabel: string;
  readonly recommendedPitch: number;
  readonly recommendedRate: number;
  readonly isVerifiedFemaleVoice: boolean;
  readonly isConfirmedFemale: boolean;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function initFemaleVoicePreloader(
  onLoaded?: (voices: SpeechSynthesisVoice[]) => void,
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return () => {};
  }

  const load = () => {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
      onLoaded?.(list);
    }
  };

  load();
  window.speechSynthesis.addEventListener?.("voiceschanged", load);
  return () => {
    window.speechSynthesis.removeEventListener?.("voiceschanged", load);
  };
}

export function isMaleVoice(v: SpeechSynthesisVoice): boolean {
  const descriptor = `${v.name} ${v.voiceURI}`.toLowerCase();
  return MALE_VOICE_BLACKLIST.test(descriptor);
}

export const isMaleVoiceBlacklisted = isMaleVoice;

export function isExplicitlyFemaleVoice(v: SpeechSynthesisVoice): boolean {
  const descriptor = `${v.name} ${v.voiceURI}`.toLowerCase();
  if (isMaleVoice(v)) return false;
  return FEMALE_VOICE_WHITELIST.test(descriptor);
}

export function getCandidateFemalePortugueseVoices(
  explicitVoices?: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
  let allVoices: readonly SpeechSynthesisVoice[] = explicitVoices ?? [];
  if (allVoices.length === 0) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const raw = window.speechSynthesis.getVoices();
      allVoices = raw.length > 0 ? raw : cachedVoices;
    } else {
      allVoices = cachedVoices;
    }
  }
  if (!allVoices.length) return [];

  // Filtra imediatamente qualquer voz masculina conhecida
  const nonMale = allVoices.filter((v) => !isMaleVoice(v));

  // Pontua e ordena priorizando vozes femininas neurais em Português do Brasil
  const scored = nonMale.map((v) => {
    const nameLower = `${v.name} ${v.voiceURI}`.toLowerCase();
    const langLower = v.lang.toLowerCase();
    let score = 0;

    const isPtBr = langLower.startsWith("pt-br") || langLower === "pt_br";
    const isPt = langLower.startsWith("pt");
    const isFemale = isExplicitlyFemaleVoice(v);

    if (isPtBr) score += 50;
    else if (isPt) score += 35;

    if (isFemale) score += 80;

    for (let i = 0; i < TIER1_PT_FEMALE_NAMES.length; i++) {
      if (nameLower.includes(TIER1_PT_FEMALE_NAMES[i])) {
        score += 120 - i * 3;
        break;
      }
    }

    if (
      nameLower.includes("natural") ||
      nameLower.includes("neural") ||
      nameLower.includes("online")
    ) {
      score += 30;
    }

    if (nameLower.includes("google") && isPt) {
      score += 45;
    }

    return { voice: v, score, isPt, isFemale };
  });

  return scored
    .filter((item) => item.isPt || item.isFemale)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.voice);
}

export function selectStrictFemalePortugueseVoice(
  voicesOrPreferredURI?: readonly SpeechSynthesisVoice[] | string,
  timbrePreset: "natural_female" | "suave_female" = "natural_female",
): FemaleVoiceSelection {
  const explicitVoices = Array.isArray(voicesOrPreferredURI)
    ? voicesOrPreferredURI
    : undefined;
  const preferredVoiceURI =
    typeof voicesOrPreferredURI === "string" ? voicesOrPreferredURI : undefined;

  const candidates = getCandidateFemalePortugueseVoices(explicitVoices);

  let chosen: SpeechSynthesisVoice | null = null;
  if (preferredVoiceURI) {
    chosen = candidates.find((v) => v.voiceURI === preferredVoiceURI) ?? null;
  }
  if (!chosen && candidates.length > 0) {
    chosen = candidates[0];
  }

  const verifiedFemale = chosen ? isExplicitlyFemaleVoice(chosen) : false;

  // Se o SO só expuser uma voz genérica sem tag feminina explícita, eleva o formante para timbre feminino
  const basePitch = verifiedFemale ? 1.12 : 1.26;
  const recommendedPitch =
    timbrePreset === "suave_female" ? basePitch + 0.08 : basePitch;
  const recommendedRate = timbrePreset === "suave_female" ? 1.01 : 1.04;

  const voiceLabel = chosen
    ? `${chosen.name.replace(/Microsoft |Google |Online \(Natural\) - /g, "")} (Feminina)`
    : "Voz Feminina PT-BR (Formante Calibrado)";

  return {
    voice: chosen,
    lang: chosen?.lang || "pt-BR",
    voiceLabel,
    recommendedPitch,
    recommendedRate,
    isVerifiedFemaleVoice: verifiedFemale,
    isConfirmedFemale: verifiedFemale,
  };
}
