import { motion } from "framer-motion";
import { Coins, Flame, Award, TrendingUp, Sparkles } from "lucide-react";

interface WalletProps {
  balance?: number;
  streak?: number;
  badgeCount?: number;
}

export default function IFTWallet({ balance = 0, streak = 0, badgeCount = 0 }: WalletProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-elevated" role="region" aria-label="Carteira IFT">
      {/* Header — Dark premium with mesh */}
      <div className="relative bg-gradient-premium p-6 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 dot-pattern-light opacity-5" aria-hidden="true" />
        {/* Decorative orb */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-secondary/8 blur-2xl" aria-hidden="true" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Coins className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <span className="text-2xs font-bold text-primary-foreground/60 uppercase tracking-widest block">Moeda IFT</span>
                <span className="text-2xs text-primary-foreground/30">Progresso pedagógico</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-2xs text-success font-bold bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              Ativo
            </div>
          </div>
          <motion.div
            key={balance}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-5xl font-bold tracking-tight"
            aria-live="polite"
          >
            {balance.toLocaleString("pt-BR")}
          </motion.div>
        </div>
      </div>

      {/* Stats with improved layout */}
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-5 text-center space-y-1.5 group hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-center gap-1.5 text-secondary">
            <Flame className="h-5 w-5" aria-hidden="true" />
            <span className="font-display text-2xl font-bold">{streak}</span>
          </div>
          <span className="text-2xs text-muted-foreground font-medium block">Streak (dias)</span>
        </div>
        <div className="p-5 text-center space-y-1.5 group hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-center gap-1.5 text-ift-lavender">
            <Award className="h-5 w-5" aria-hidden="true" />
            <span className="font-display text-2xl font-bold">{badgeCount}</span>
          </div>
          <span className="text-2xs text-muted-foreground font-medium block">Badges</span>
        </div>
      </div>
    </div>
  );
}
