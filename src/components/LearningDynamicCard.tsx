import { motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";

interface LearningDynamicCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Avatar hiperrealista opcional — quando presente, substitui o emoji `icon`. */
  avatarImg?: string;
  index: number;
  active?: boolean;
  locked?: boolean;
  completed?: boolean;
  onClick?: () => void;
}

export default function LearningDynamicCard({ name, description, icon, avatarImg, index, active, locked, completed, onClick }: LearningDynamicCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        active
          ? "border-primary/40 bg-primary/5 shadow-glow"
          : locked
          ? "border-border bg-muted/30 opacity-60"
          : "border-border bg-card hover:border-primary/20 hover:shadow-card"
      }`}
      aria-current={active ? "true" : undefined}
      aria-label={`${name}${locked ? " (em revisão de disponibilidade)" : ""}${completed ? " (Concluído)" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {avatarImg ? (
            <div className="relative">
              <img
                src={avatarImg}
                alt=""
                aria-hidden="true"
                className={`h-10 w-10 rounded-full object-cover border-2 transition-all duration-200 ${
                  active ? "border-primary/60 shadow-glow scale-105" : "border-primary/20"
                }`}
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card"
                aria-hidden="true"
              />
            </div>
          ) : (
            <span className={`text-2xl transition-transform duration-200 block ${active ? "scale-110" : ""}`} aria-hidden="true">{icon}</span>
          )}
          {completed && (
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-success border-2 border-card flex items-center justify-center" aria-hidden="true">
              <svg className="h-2 w-2 text-success-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-display text-sm font-bold truncate ${active ? "text-primary" : ""}`}>{name}</h4>
            {locked && <Lock className="h-3 w-3 text-muted-foreground/50 shrink-0" aria-hidden="true" />}
          </div>
          <p className="text-2xs text-muted-foreground mt-0.5 truncate">{description}</p>
        </div>
        <ChevronRight className={`h-4 w-4 shrink-0 transition-all ${active ? "text-primary translate-x-0.5" : "text-muted-foreground/30"}`} aria-hidden="true" />
      </div>
    </motion.button>
  );
}
