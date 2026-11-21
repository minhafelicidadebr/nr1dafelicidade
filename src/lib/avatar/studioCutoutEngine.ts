/**
 * Motor de Recorte Alpha-Matting Per-Pixel & Deformação Labial 2D em Tempo Real
 *
 * 1. Remove o fundo sólido de estúdio via Flood-Fill Conectado às Bordas +
 *    Suavização Hermite (Smoothstep Feathering) + Descontaminação de Borda,
 *    preservando 100% da integridade interna dos olhos, rosto, cabelos, ombros e peito.
 * 2. Executa deformação elástica sub-pixel da mandíbula e lábios diretamente
 *    nas coordenadas anatômicas 1:1 do retrato da Líder Clara.
 */

export interface LipLandmarks1x1 {
  /** Centro horizontal da boca (0..1) */
  readonly centerX: number;
  /** Linha exata de separação entre lábio superior e inferior (0..1) */
  readonly lipLineY: number;
  /** Metade da largura da comissura labial (0..1) */
  readonly halfWidthX: number;
  /** Centro vertical do queixo/mandíbula móvel (0..1) */
  readonly jawCenterY: number;
  /** Raio vertical de influência da mandíbula (0..1) */
  readonly jawRadiusY: number;
}

export const LIDER_CLARA_LIP_LANDMARKS: LipLandmarks1x1 = {
  centerX: 0.5,
  lipLineY: 0.489,
  halfWidthX: 0.064,
  jawCenterY: 0.532,
  jawRadiusY: 0.062,
};

/**
 * Avalia quão próximo um pixel (r,g,b) está do fundo sólido de estúdio (#131A29)
 * diferenciando-o do blazer petróleo-esmeralda (que possui componente G e B mais altos que R)
 * e dos tons quentes de pele/cabelo (que possuem R >= B).
 *
 * Retorna um valor contínuo 0..1 onde:
 * - 0.0 = fundo puro de estúdio (100% transparente)
 * - 1.0 = sujeito/pessoa (100% opaco)
 */
export function computeSubjectForegroundAffinity(
  r: number,
  g: number,
  b: number,
  bgR: number,
  bgG: number,
  bgB: number,
): number {
  const dr = r - bgR;
  const dg = g - bgG;
  const db = b - bgB;
  const colorDist = Math.sqrt(dr * dr + dg * dg + db * db);

  // Tons quentes (cabelo castanho e pele): R > B ou R próximo de B com luminância maior
  const warmScore = Math.max(0, r - b + 8);
  // Tons do blazer petróleo (teal): G significativamente maior que o G do fundo azul-escuro
  const tealBlazerScore = Math.max(0, g - bgG - 10) * 1.45;

  const combinedSignal = colorDist + warmScore * 0.85 + tealBlazerScore;

  // Ramp Hermite suave entre limiar inferior (fundo) e superior (sujeito)
  const lowThreshold = 14;
  const highThreshold = 34;

  if (combinedSignal <= lowThreshold) return 0;
  if (combinedSignal >= highThreshold) return 1;

  const t = (combinedSignal - lowThreshold) / (highThreshold - lowThreshold);
  return t * t * (3 - 2 * t);
}

/**
 * Processa um buffer RGBA (ImageData) aplicando Flood-Fill a partir das bordas externas
 * da imagem para remover exclusivamente o fundo de estúdio, mantendo olhos, sombras internas
 * do rosto, ombros e peito 100% sólidos e com bordas externas anti-aliased (estilo PNG profissional).
 */
export function applyStudioAlphaMattingToRGBA(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): void {
  if (width <= 2 || height <= 2) return;

  // Amostra a cor média do fundo nos cantos superiores esquerdo e direito
  const idxTL = 0;
  const idxTR = (width - 1) * 4;
  const bgR = Math.round((data[idxTL] + data[idxTR]) * 0.5);
  const bgG = Math.round((data[idxTL + 1] + data[idxTR + 1]) * 0.5);
  const bgB = Math.round((data[idxTL + 2] + data[idxTR + 2]) * 0.5);

  const totalPixels = width * height;
  // Mapa de afinidade com o sujeito (0 = fundo, 255 = sujeito)
  const affinityMap = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const p = i * 4;
    const aff = computeSubjectForegroundAffinity(
      data[p],
      data[p + 1],
      data[p + 2],
      bgR,
      bgG,
      bgB,
    );
    affinityMap[i] = Math.round(aff * 255);
  }

  // Flood-fill (BFS) conectado às bordas superior, esquerda e direita
  // para identificar apenas a região externa do fundo (nunca perfura o interior do rosto/peito)
  const isExteriorBg = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const tryEnqueue = (idx: number) => {
    if (isExteriorBg[idx] === 0 && affinityMap[idx] < 215) {
      isExteriorBg[idx] = 1;
      queue[tail++] = idx;
    }
  };

  // Semeia borda superior
  for (let x = 0; x < width; x++) {
    tryEnqueue(x);
  }
  // Semeia bordas laterais (até 88% da altura onde começam os ombros)
  const sideSeedLimitY = Math.floor(height * 0.92);
  for (let y = 1; y < sideSeedLimitY; y++) {
    tryEnqueue(y * width);
    tryEnqueue(y * width + (width - 1));
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = (curr - cx) / width;

    if (cx > 0) tryEnqueue(curr - 1);
    if (cx < width - 1) tryEnqueue(curr + 1);
    if (cy > 0) tryEnqueue(curr - width);
    if (cy < height - 1) tryEnqueue(curr + width);
  }

  // Passe 1: Define canal Alpha bruto e descontamina halo escuro nas bordas do cabelo/ombros
  const rawAlpha = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    if (isExteriorBg[i] === 1) {
      const a = affinityMap[i];
      // Pixels claramente de fundo ficam 100% transparentes (alpha = 0)
      rawAlpha[i] = a < 48 ? 0 : a;
    } else {
      rawAlpha[i] = 255;
    }
  }

  // Passe 2: Filtro de suavização 3x3 nas bordas de transição (anti-aliasing fotográfico)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const centerA = rawAlpha[idx];

      // Só suaviza pixels próximos à fronteira de recorte
      if (centerA > 0 && centerA < 255) {
        const sum =
          rawAlpha[idx - width - 1] +
          rawAlpha[idx - width] * 2 +
          rawAlpha[idx - width + 1] +
          rawAlpha[idx - 1] * 2 +
          centerA * 4 +
          rawAlpha[idx + 1] * 2 +
          rawAlpha[idx + width - 1] +
          rawAlpha[idx + width] * 2 +
          rawAlpha[idx + width + 1];
        const smoothedA = Math.round(sum / 16);
        const p = idx * 4;
        data[p + 3] = smoothedA;

        // Descontaminação cromática de borda (remove resíduo azul-escuro do fundo nos fios de cabelo)
        if (smoothedA > 15 && smoothedA < 240) {
          const factor = smoothedA / 255;
          const inv = 1 - factor;
          data[p] = Math.min(255, Math.max(0, Math.round((data[p] - bgR * inv) / Math.max(0.25, factor))));
          data[p + 1] = Math.min(255, Math.max(0, Math.round((data[p + 1] - bgG * inv) / Math.max(0.25, factor))));
          data[p + 2] = Math.min(255, Math.max(0, Math.round((data[p + 2] - bgB * inv) / Math.max(0.25, factor))));
        }
      } else {
        data[idx * 4 + 3] = centerA;
      }
    }
  }

  // Bordas extremas 1px
  for (let x = 0; x < width; x++) {
    data[x * 4 + 3] = rawAlpha[x];
    const bIdx = (height - 1) * width + x;
    data[bIdx * 4 + 3] = rawAlpha[bIdx];
  }
  for (let y = 0; y < height; y++) {
    const lIdx = y * width;
    const rIdx = y * width + (width - 1);
    data[lIdx * 4 + 3] = rawAlpha[lIdx];
    data[rIdx * 4 + 3] = rawAlpha[rIdx];
  }
}
