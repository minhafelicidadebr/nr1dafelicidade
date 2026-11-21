import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";

interface AchievementBurstProps {
  message: string;
  iftAmount?: number;
  show: boolean;
  onClose: () => void;
}

export default function AchievementBurst({ message, iftAmount, show, onClose }: AchievementBurstProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-card px-5 py-3 shadow-glow">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 animate-burst">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{message}</p>
              {iftAmount && (
                <p className="text-xs text-primary font-bold">+{iftAmount} IFT</p>
              )}
            </div>
            <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
