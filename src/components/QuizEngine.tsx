import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronRight, HelpCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizEngineProps {
  questions: QuizQuestion[];
  driverName: string;
  onComplete?: (score: number) => void;
}

export default function QuizEngine({ questions, driverName, onComplete }: QuizEngineProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setCompleted(true);
      onComplete?.(score);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  if (completed) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
        <div className="text-5xl">{pct >= 70 ? "🎉" : "💪"}</div>
        <h3 className="font-display text-xl font-bold">
          {pct >= 70 ? "Parabéns!" : "Continue praticando!"}
        </h3>
        <p className="text-muted-foreground">
          Você acertou <span className="font-bold text-primary">{score}/{questions.length}</span> questões sobre {driverName}
        </p>
        <div className="h-2 w-48 mx-auto rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full rounded-full bg-gradient-hero"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Questão {current + 1} de {questions.length}</span>
        <span>{score} acertos</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4 className="font-display text-base font-semibold mb-4">{q.question}</h4>
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correctIndex;
              const isSelected = idx === selected;
              let styles = "border-border hover:border-primary/40 hover:bg-accent/50";
              if (selected !== null) {
                if (isCorrect) styles = "border-success bg-success/10";
                else if (isSelected) styles = "border-destructive bg-destructive/10";
                else styles = "border-border opacity-50";
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-left rounded-lg border p-3.5 text-sm transition-all flex items-center gap-3 ${styles}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                    {selected !== null ? (
                      isCorrect ? <Check className="h-3.5 w-3.5 text-success" /> : isSelected ? <X className="h-3.5 w-3.5 text-destructive" /> : String.fromCharCode(65 + idx)
                    ) : String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-lg bg-accent/50 border border-accent-foreground/10 p-4"
          >
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 mt-0.5 text-accent-foreground" />
              <div>
                <p className="text-xs font-semibold text-accent-foreground mb-1">Por que?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="mt-3 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {current + 1 >= questions.length ? "Ver resultado" : "Próxima"}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
