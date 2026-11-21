import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  /** Valor numérico alvo */
  value: number;
  /** Função de formatação (ex.: moeda BRL, percentual, abreviado) */
  format: (val: number) => string;
  /** Duração da animação inicial ao entrar na viewport (ms) */
  initialDuration?: number;
  /** Duração da transição fluida quando o valor muda dinamicamente via sliders/presets (ms) */
  updateDuration?: number;
  /** Se true, dispara a contagem inicial apenas 1x ao entrar na viewport */
  triggerOnView?: boolean;
  className?: string;
}

/**
 * Motor cinético de números tabulares (ease-out cubic).
 * - Dispara 1x na entrada da viewport via IntersectionObserver.
 * - Interpola suavemente do valor anterior para o novo quando o usuário altera sliders/presets.
 * - Respeita integralmente `prefers-reduced-motion`.
 */
export function AnimatedNumber({
  value,
  format,
  initialDuration = 950,
  updateDuration = 320,
  triggerOnView = true,
  className = "",
}: AnimatedNumberProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const currentValueRef = useRef<number>(triggerOnView ? 0 : value);
  const hasEnteredViewRef = useRef<boolean>(!triggerOnView);
  const hasCompletedInitialRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  const [inView, setInView] = useState<boolean>(!triggerOnView);
  const [displayValue, setDisplayValue] = useState<number>(() => {
    if (typeof window === "undefined") return value;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !triggerOnView) return value;
    return 0;
  });

  // Observa a entrada na viewport uma única vez
  useEffect(() => {
    if (!triggerOnView || inView) return;
    const el = spanRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      hasEnteredViewRef.current = true;
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          hasEnteredViewRef.current = true;
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView, inView]);

  // Executa a interpolação ease-out cubic
  useEffect(() => {
    if (!inView) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      currentValueRef.current = value;
      hasCompletedInitialRef.current = true;
      setDisplayValue(value);
      return;
    }

    const from = hasCompletedInitialRef.current ? currentValueRef.current : 0;
    const to = value;

    if (from === to) {
      hasCompletedInitialRef.current = true;
      setDisplayValue(to);
      return;
    }

    const duration = hasCompletedInitialRef.current ? updateDuration : initialDuration;
    const start = performance.now();

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic: aceleração suave com aterrissagem editorial precisa
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (to - from) * eased;

      currentValueRef.current = next;
      setDisplayValue(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        currentValueRef.current = to;
        hasCompletedInitialRef.current = true;
        setDisplayValue(to);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [value, inView, initialDuration, updateDuration]);

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`.trim()}>
      {format(displayValue)}
    </span>
  );
}
