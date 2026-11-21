import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Captions,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import {
  type DriverAcademyHostScript,
  type PhoneticVisemeFrame,
  computePhoneticViseme,
} from "@/data/driverAcademyHostScripts";
import {
  initFemaleVoicePreloader,
  selectStrictFemalePortugueseVoice,
} from "@/lib/speech/femalePortugueseVoice";
import {
  applyStudioAlphaMattingToRGBA,
  LIDER_CLARA_LIP_LANDMARKS,
} from "@/lib/avatar/studioCutoutEngine";

interface DriverAcademyHollywoodHostProps {
  readonly script: DriverAcademyHostScript;
  readonly activeDynamic: string;
  readonly onSelectDynamic: (dynamicId: string) => void;
}

export interface LiderClaraCutoutAvatarProps {
  readonly imageUrl: string;
  readonly hostName: string;
  readonly viseme: PhoneticVisemeFrame;
  readonly isPlaying: boolean;
  readonly size?: "hero" | "chat-header" | "chat-message";
}

// Cache em memória do canvas já recortado por Alpha-Matting Per-Pixel (evita reprocessar pixels)
const mattedCanvasCache = new Map<string, HTMLCanvasElement>();

/**
 * Avatar em Recorte Transparente Per-Pixel (Flood-Fill Alpha Matting + Edge Decontamination)
 * com Deformação Labial/Mandibular 2D por Scanline no próprio tecido fotográfico da imagem.
 */
export function LiderClaraCutoutAvatar({
  imageUrl,
  hostName,
  viseme,
  isPlaying,
  size = "hero",
}: LiderClaraCutoutAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMattedReady, setIsMattedReady] = useState(false);

  // Estado mutável para interpolação suave a 60fps (evita saltos bruscos da boca)
  const targetVisemeRef = useRef<{
    openness: number;
    width: number;
    speaking: boolean;
    type: PhoneticVisemeFrame["visemeType"];
  }>({
    openness: 0.14,
    width: 0.62,
    speaking: false,
    type: "rest",
  });

  useEffect(() => {
    const isSpeakingNow = isPlaying && viseme.visemeType !== "rest";
    targetVisemeRef.current = {
      openness: isSpeakingNow ? viseme.mouthOpenness : 0.14,
      width: isSpeakingNow ? viseme.mouthWidth : 0.62,
      speaking: isSpeakingNow,
      type: viseme.visemeType,
    };
  }, [isPlaying, viseme]);

  // 1. Prepara o bitmap 512x512 com recorte Alpha-Matting Per-Pixel (fundo 100% transparente)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (mattedCanvasCache.has(imageUrl)) {
      setIsMattedReady(true);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      try {
        const SIZE = 512;
        const offscreen = document.createElement("canvas");
        offscreen.width = SIZE;
        offscreen.height = SIZE;
        const ctx = offscreen.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
        applyStudioAlphaMattingToRGBA(imageData.data, SIZE, SIZE);
        ctx.putImageData(imageData, 0, 0);

        mattedCanvasCache.set(imageUrl, offscreen);
        setIsMattedReady(true);
      } catch {
        // Fallback seguro em ambientes de teste (JSDOM) sem suporte a getImageData
        setIsMattedReady(false);
      }
    };
    img.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  // 2. Loop de renderização 60fps: Deformação elástica real dos lábios e mandíbula da foto
  useEffect(() => {
    if (!isMattedReady) return;
    const sourceCanvas = mattedCanvasCache.get(imageUrl);
    const displayCanvas = canvasRef.current;
    if (!sourceCanvas || !displayCanvas) return;

    const ctx = displayCanvas.getContext("2d");
    if (!ctx) return;

    const W = displayCanvas.width;
    const H = displayCanvas.height;

    let animId: number | null = null;
    let currentOpen = 0;
    let currentWidth = 0.62;
    let frameTick = 0;

    const lm = LIDER_CLARA_LIP_LANDMARKS;
    const lipY = Math.round(lm.lipLineY * H);
    const mouthCenterX = Math.round(lm.centerX * W);
    const baseHalfW = Math.round(lm.halfWidthX * W);
    const jawStartY = lipY;
    const jawEndY = Math.round((lm.jawCenterY + lm.jawRadiusY) * H);
    const jawHeight = jawEndY - jawStartY;

    const renderFrame = () => {
      frameTick += 1;
      const target = targetVisemeRef.current;
      const desiredOpen = target.speaking
        ? Math.max(0, (target.openness - 0.14) * 10.5)
        : 0;
      const desiredWidth = target.speaking ? target.width : 0.62;

      // Interpolação suave (Spring-like Lerp) para articulação orgânica de estúdio
      currentOpen += (desiredOpen - currentOpen) * 0.34;
      currentWidth += (desiredWidth - currentWidth) * 0.28;

      ctx.clearRect(0, 0, W, H);

      // Micro-movimento natural de respiração e presença quando está falando
      const breathOffsetY = target.speaking
        ? Math.sin(frameTick * 0.07) * 0.9
        : Math.sin(frameTick * 0.03) * 0.35;

      ctx.save();
      ctx.translate(0, breathOffsetY);

      // Desenha o retrato recortado base (cabelo, rosto, ombros e peito definidos em fundo transparente)
      ctx.drawImage(sourceCanvas, 0, 0, W, H);

      // Se a boca estiver articulando, executa o Warp 2D dos lábios e mandíbula reais da foto
      if (currentOpen > 0.35) {
        const dynamicHalfW = Math.round(baseHalfW * (0.76 + currentWidth * 0.36));
        const stripLeft = mouthCenterX - dynamicHalfW - 14;
        const stripWidth = (dynamicHalfW + 14) * 2;

        // 1. Preenche a cavidade interna entre os lábios reais que irão se separar
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          mouthCenterX,
          lipY + currentOpen * 0.46,
          dynamicHalfW * 0.92,
          Math.max(1.2, currentOpen * 0.68),
          0,
          0,
          Math.PI * 2,
        );
        ctx.clip();

        // Sombra anatômica interna da boca
        const oralGrad = ctx.createRadialGradient(
          mouthCenterX,
          lipY + currentOpen * 0.35,
          1,
          mouthCenterX,
          lipY + currentOpen * 0.5,
          dynamicHalfW,
        );
        oralGrad.addColorStop(0, "#240a0e");
        oralGrad.addColorStop(0.75, "#3a1218");
        oralGrad.addColorStop(1, "#521c22");
        ctx.fillStyle = oralGrad;
        ctx.fillRect(
          mouthCenterX - dynamicHalfW,
          lipY - 4,
          dynamicHalfW * 2,
          currentOpen + 10,
        );

        // Linha sutil e realista dos dentes superiores
        if (currentOpen > 2.1) {
          ctx.fillStyle = "rgba(246, 239, 234, 0.76)";
          ctx.beginPath();
          ctx.ellipse(
            mouthCenterX,
            lipY + 0.9,
            dynamicHalfW * 0.64,
            Math.min(2.4, currentOpen * 0.28),
            0,
            0,
            Math.PI,
          );
          ctx.fill();
        }
        ctx.restore();

        // 2. Desloca o próprio lábio inferior e queixo fotográficos para baixo em faixas suaves
        const numStrips = 18;
        const stripH = jawHeight / numStrips;
        for (let s = 0; s < numStrips; s++) {
          const normY = s / numStrips; // 0 no lábio inferior -> 1 na base do queixo
          // Decaimento cosseno suave: deslocamento máximo no lábio inferior, zero na linha do pescoço
          const weightY = Math.cos(normY * Math.PI * 0.5);
          const dy = currentOpen * weightY * weightY;

          const srcY = jawStartY + s * stripH;
          const dstY = srcY + dy;

          ctx.drawImage(
            sourceCanvas,
            stripLeft,
            srcY,
            stripWidth,
            stripH + 0.9,
            stripLeft,
            dstY,
            stripWidth,
            stripH + 0.9,
          );
        }
      }

      ctx.restore();
      animId = window.requestAnimationFrame(renderFrame);
    };

    animId = window.requestAnimationFrame(renderFrame);
    return () => {
      if (animId !== null) {
        window.cancelAnimationFrame(animId);
      }
    };
  }, [imageUrl, isMattedReady]);

  // Dimensões rigorosamente 1:1 para que ombros, peito e rosto fiquem perfeitamente proporcionados
  const containerDimensions =
    size === "hero"
      ? "w-56 h-56 sm:w-64 sm:h-64"
      : size === "chat-header"
        ? "w-11 h-11"
        : "w-9 h-9";

  return (
    <div
      className={`relative select-none shrink-0 aspect-square ${containerDimensions}`}
      data-testid={size === "hero" ? "cutout-talking-avatar-hero" : "cutout-talking-avatar-mini"}
    >
      {/* Superfície transparente real estilo PNG sem caixa escura de fundo */}
      <div
        className={`relative w-full h-full overflow-hidden ${
          size === "hero"
            ? "rounded-b-2xl"
            : "rounded-full border border-border bg-muted/30"
        }`}
      >
        {/* Canvas 2D 512x512 com Alpha-Matting Per-Pixel e Deformação Labial Fotográfica */}
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          aria-label={`${hostName} — Assistente de Aprendizagem em fundo transparente`}
          className={`w-full h-full object-contain transition-opacity duration-200 ${
            isMattedReady ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Fallback inicial antes do decode do canvas (ou em testes JSDOM) */}
        {!isMattedReady && (
          <img
            src={imageUrl}
            alt={`${hostName} — Assistente de Aprendizagem`}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        )}

        {/* Marcador semântico invisível para inspeção de testes automatizados do viseme ativo */}
        <span
          aria-hidden="true"
          data-testid={size === "hero" ? "avatar-anatomical-mouth" : undefined}
          data-viseme={viseme.visemeType}
          className="sr-only"
        />
      </div>
    </div>
  );
}

export default function DriverAcademyHollywoodHost({
  script,
  activeDynamic,
  onSelectDynamic,
}: DriverAcademyHollywoodHostProps) {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState<1 | 1.15>(1);
  const [femaleTimbre, setFemaleTimbre] = useState<"natural" | "suave">("natural");
  const [detectedFemaleVoiceName, setDetectedFemaleVoiceName] = useState<string>(
    "Voz Feminina PT-BR",
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [intraWordPhase, setIntraWordPhase] = useState(0.5);
  const [showCaptions, setShowCaptions] = useState(true);

  const timerRef = useRef<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startChapterRef = useRef<
    ((chapterIdx: number, useVoice: boolean, rate: 1 | 1.15) => void) | null
  >(null);

  const currentChapter = script.chapters[activeChapterIndex] ?? script.chapters[0];

  const words = useMemo(() => {
    return currentChapter.transcript.split(/\s+/).filter(Boolean);
  }, [currentChapter.transcript]);

  const currentWord = words[activeWordIndex];

  const viseme = useMemo(() => {
    return computePhoneticViseme(currentWord, intraWordPhase, isPlaying);
  }, [currentWord, intraWordPhase, isPlaying]);

  // Pré-carrega e garante seleção estrita de voz feminina em Português
  useEffect(() => {
    const cleanup = initFemaleVoicePreloader(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const selected = selectStrictFemalePortugueseVoice(
          window.speechSynthesis.getVoices(),
        );
        if (selected.voice?.name) {
          setDetectedFemaleVoiceName(selected.voice.name);
        }
      }
    });
    return cleanup;
  }, []);

  const stopAllPlayback = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Fallback silencioso
      }
    }
    utteranceRef.current = null;
    setIsPlaying(false);
  }, []);

  const startChapterPlayback = useCallback(
    (chapterIdx: number, useVoice: boolean, rate: 1 | 1.15) => {
      stopAllPlayback();
      const targetChapter = script.chapters[chapterIdx] ?? script.chapters[0];
      const chapterWords = targetChapter.transcript.split(/\s+/).filter(Boolean);

      setActiveChapterIndex(chapterIdx);
      setActiveWordIndex(0);
      setIntraWordPhase(0.2);
      setIsPlaying(true);

      const msPerWord = Math.round(310 / rate);
      const tickMs = 45;
      let elapsedMs = 0;

      timerRef.current = window.setInterval(() => {
        elapsedMs += tickMs;
        const wordIdx = Math.floor(elapsedMs / msPerWord);
        const phase = (elapsedMs % msPerWord) / msPerWord;

        if (wordIdx >= chapterWords.length) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsPlaying(false);
          setActiveWordIndex(Math.max(0, chapterWords.length - 1));
          setIntraWordPhase(0.5);
          return;
        }

        setActiveWordIndex(wordIdx);
        setIntraWordPhase(phase);
      }, tickMs);

      if (
        useVoice &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined"
      ) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(targetChapter.transcript);
          const availableVoices = window.speechSynthesis.getVoices();
          const femaleSelection = selectStrictFemalePortugueseVoice(availableVoices);

          utterance.lang = femaleSelection.lang;
          const basePitch = femaleSelection.recommendedPitch;
          utterance.pitch =
            femaleTimbre === "suave" ? Math.min(1.32, basePitch + 0.08) : basePitch;
          utterance.rate =
            rate === 1.15
              ? Math.min(1.18, femaleSelection.recommendedRate * 1.12)
              : femaleSelection.recommendedRate;

          if (femaleSelection.voice) {
            utterance.voice = femaleSelection.voice;
            setDetectedFemaleVoiceName(femaleSelection.voice.name);
          }

          utterance.onboundary = (event: SpeechSynthesisEvent) => {
            if (typeof event.charIndex === "number") {
              const prefix = targetChapter.transcript.slice(0, event.charIndex);
              const spokenWords = prefix.trim() ? prefix.trim().split(/\s+/).length : 0;
              const syncedIndex = Math.min(
                chapterWords.length - 1,
                Math.max(0, spokenWords),
              );
              setActiveWordIndex(syncedIndex);
            }
          };

          utterance.onend = () => {
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setIsPlaying(false);
            setActiveWordIndex(Math.max(0, chapterWords.length - 1));
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch {
          // O motor visual de lip-sync permanece ativo mesmo sem áudio do navegador
        }
      }
    },
    [femaleTimbre, script.chapters, stopAllPlayback],
  );

  useEffect(() => {
    startChapterRef.current = startChapterPlayback;
  }, [startChapterPlayback]);

  useEffect(() => {
    return () => {
      stopAllPlayback();
    };
  }, [stopAllPlayback]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAllPlayback();
    } else {
      startChapterPlayback(activeChapterIndex, voiceEnabled, speechRate);
    }
  };

  const handleRestartChapter = () => {
    startChapterPlayback(activeChapterIndex, voiceEnabled, speechRate);
  };

  const handleSelectChapter = (idx: number) => {
    const chapter = script.chapters[idx];
    if (!chapter) return;
    startChapterPlayback(idx, voiceEnabled, speechRate);
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    if (isPlaying) {
      startChapterPlayback(activeChapterIndex, nextVoice, speechRate);
    }
  };

  const handleToggleSpeed = () => {
    const nextRate: 1 | 1.15 = speechRate === 1 ? 1.15 : 1;
    setSpeechRate(nextRate);
    if (isPlaying) {
      startChapterPlayback(activeChapterIndex, voiceEnabled, nextRate);
    }
  };

  const handleToggleTimbre = () => {
    const nextTimbre = femaleTimbre === "natural" ? "suave" : "natural";
    setFemaleTimbre(nextTimbre);
  };

  const progressPercentage =
    words.length > 0 ? Math.round(((activeWordIndex + 1) / words.length) * 100) : 0;

  return (
    <section
      aria-label={`Recepção Guiada da Academia de ${script.driverNamePt}`}
      className="mb-10 rounded-2xl border border-border bg-card text-foreground shadow-card overflow-hidden"
    >
      {/* Superfície Editorial Minimalista (Inspirada em Frontend Design Anthropic & Taste Skill — Zero-Pill Discipline) */}
      <div className="p-6 sm:p-8 border-b border-border/70">
        {/* Barra Superior: Metadados Tipográficos Limpos (Sem pílulas estáticas) + Segmented Controls de Áudio */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Recepção Guiada de Aprendizagem
            </span>
            <span aria-hidden="true">·</span>
            <span>{script.driverNamePt}</span>
            <span aria-hidden="true">·</span>
            <span>Work Wellbeing Playbook 2.0</span>
          </div>

          {/* Controles Funcionais de Acessibilidade por Voz Feminina */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleVoice}
              aria-pressed={voiceEnabled}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                voiceEnabled
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-transparent text-muted-foreground hover:text-foreground"
              }`}
              title={
                voiceEnabled
                  ? `Voz feminina ativa (${detectedFemaleVoiceName})`
                  : "Ativar narração com voz feminina em português"
              }
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Voz Feminina</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Sem Áudio</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleToggleTimbre}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Alternar timbre da voz feminina (Natural ou Suave)"
            >
              <span>Timbre: {femaleTimbre === "natural" ? "Natural" : "Suave"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSpeed}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-transparent px-2.5 py-1.5 text-xs font-mono tabular-nums font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Alternar velocidade de leitura da Líder Clara"
            >
              {speechRate}x
            </button>

            <button
              type="button"
              onClick={() => setShowCaptions((prev) => !prev)}
              aria-pressed={showCaptions}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                showCaptions
                  ? "border-border bg-muted/60 text-foreground"
                  : "border-border/60 bg-transparent text-muted-foreground"
              }`}
              title="Mostrar ou ocultar transcrição sincronizada"
            >
              <Captions className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Transcrição</span>
            </button>
          </div>
        </div>

        {/* Composição Assimétrica Editorial: Avatar PNG Recortado (Esquerda) + Narrativa e Teleprompter (Direita) */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Coluna 1 (4 cols): Silhueta Recortada por Alpha-Matting Per-Pixel em Fundo Transparente */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <LiderClaraCutoutAvatar
              imageUrl={script.avatarImageUrl}
              hostName={script.hostName}
              viseme={viseme}
              isPlaying={isPlaying}
              size="hero"
            />

            {/* Identificação Tipográfica Limpa (Sem crachá pesado sobreposto) */}
            <div className="mt-3 space-y-0.5">
              <h3 className="font-display text-base font-bold text-foreground">
                {script.hostName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {script.hostRole}
              </p>
            </div>

            {/* Ação Focal Primária de Áudio */}
            <div className="mt-4 flex items-center justify-center gap-2 w-full">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-current" />
                    Pausar Explicação
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Ouvir Boas-Vindas da {script.hostName}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRestartChapter}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-transparent p-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Reiniciar capítulo atual"
                aria-label="Reiniciar capítulo atual"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Coluna 2 (8 cols): Hierarquia Tipográfica, Segmented Control de Capítulos e Teleprompter Limpo */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
                  {script.studioTitle}
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {script.studioTagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectDynamic("CHAT")}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary/50 hover:text-primary transition-colors self-start"
              >
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                Abrir Chat com a {script.hostName}
              </button>
            </div>

            {/* Segmented Control dos 4 Capítulos (Padrão UI UX Pro Max / Interface Design) */}
            <div
              role="tablist"
              aria-label="Capítulos da introdução de aprendizagem"
              className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl bg-muted/50 p-1.5"
            >
              {script.chapters.map((chap, idx) => {
                const isSelected = idx === activeChapterIndex;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectChapter(idx)}
                    className={`text-left rounded-lg px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isSelected
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px] font-mono tabular-nums">
                      <span className={isSelected ? "font-bold text-primary" : ""}>
                        Cap. {chap.chapterNumber}
                      </span>
                      <span className="text-muted-foreground">{chap.durationLabel}</span>
                    </div>
                    <p className="font-display text-xs font-semibold text-foreground mt-0.5 truncate">
                      {chap.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Transcrição Editorial Limpa (Single-Elevation Depth: divisórias hairline em vez de caixas aninhadas) */}
            {showCaptions && (
              <div className="pt-2 space-y-3" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-foreground">
                    Capítulo {currentChapter.chapterNumber}: {currentChapter.title}
                  </span>
                  <span className="text-muted-foreground font-mono tabular-nums">
                    {isPlaying
                      ? `Palavra ${activeWordIndex + 1} / ${words.length}`
                      : "Clique em uma palavra para ouvir a partir dela"}
                  </span>
                </div>

                {/* Barra de progresso minimalista */}
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${isPlaying ? progressPercentage : 100}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>

                {/* Texto com medida tipográfica confortável (65ch-75ch) */}
                <p
                  className="text-sm leading-relaxed text-foreground/90 max-w-[72ch]"
                  data-testid="academy-host-teleprompter"
                >
                  {words.map((word, idx) => {
                    const isCurrentWord = isPlaying && idx === activeWordIndex;
                    const isPastWord = isPlaying && idx < activeWordIndex;
                    return (
                      <span
                        key={`${currentChapter.id}-w-${idx}`}
                        onClick={() => {
                          setActiveWordIndex(idx);
                          if (!isPlaying) {
                            startChapterPlayback(
                              activeChapterIndex,
                              voiceEnabled,
                              speechRate,
                            );
                          }
                        }}
                        className={`inline-block mr-1.5 px-1 py-0.5 rounded transition-colors cursor-pointer ${
                          isCurrentWord
                            ? "bg-primary text-primary-foreground font-semibold"
                            : isPastWord
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>

                <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>
                    <strong className="font-semibold text-foreground">Objetivo pedagógico:</strong>{" "}
                    {currentChapter.pedagogicalObjective}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectDynamic(currentChapter.targetDynamicId)}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    Abrir ferramenta deste capítulo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mapa das 4 Estações de Aprendizagem (Grid Editorial Limpo com Divisórias Hairline) */}
      <div className="bg-muted/15 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="font-display text-xs font-bold text-foreground">
            01–04. Estações de Aprendizagem desta Academia
          </h3>
          <span className="text-xs text-muted-foreground">
            Compreender · Dialogar · Fixar · Praticar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {script.stations.map((station) => {
            const isStationActive = activeDynamic === station.dynamicId;
            const isChapterHighlighted =
              currentChapter.targetStationNumber === station.stationNumber;

            return (
              <button
                key={station.stationNumber}
                type="button"
                onClick={() => onSelectDynamic(station.dynamicId)}
                className={`group text-left rounded-xl border p-4 transition-colors flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isStationActive
                    ? "border-primary bg-card shadow-xs"
                    : isChapterHighlighted
                      ? "border-primary/40 bg-card/80 hover:border-primary"
                      : "border-border/80 bg-card/60 hover:border-border hover:bg-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className={isStationActive ? "font-semibold text-primary" : ""}>
                      {station.badge}
                    </span>
                    {isStationActive && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </div>

                  <h4 className="font-display text-sm font-bold text-foreground mt-1.5 group-hover:text-primary transition-colors">
                    {station.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {station.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{station.actionLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
