import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsProps {
  cards: Flashcard[];
  driverName: string;
}

export default function Flashcards({ cards, driverName }: FlashcardsProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[current];

  const next = () => {
    if (current < cards.length - 1) {
      setCurrent((c) => c + 1);
      setFlipped(false);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setFlipped(false);
    }
  };

  const markKnown = () => {
    setKnown((s) => new Set(s).add(current));
    next();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{current + 1} / {cards.length}</span>
        <span>{known.size} dominados</span>
      </div>

      <div
        className="relative cursor-pointer perspective-1000"
        onClick={() => setFlipped((f) => !f)}
        style={{ minHeight: 200 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current}-${flipped}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl border p-6 flex flex-col items-center justify-center text-center min-h-[200px] ${
              flipped
                ? "bg-primary/5 border-primary/30"
                : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">
              {flipped ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {flipped ? "Resposta" : "Pergunta"}
            </div>
            <p className={`text-sm leading-relaxed ${flipped ? "font-medium" : "font-display font-semibold"}`}>
              {flipped ? card.back : card.front}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={current === 0} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent disabled:opacity-30">
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex gap-2">
          <button onClick={() => { setFlipped(false); }} className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent flex items-center gap-1.5">
            <RotateCcw className="h-3 w-3" />
            Revisar
          </button>
          <button onClick={markKnown} className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground hover:bg-success/90">
            ✓ Dominei
          </button>
        </div>

        <button onClick={next} disabled={current === cards.length - 1} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent disabled:opacity-30">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
