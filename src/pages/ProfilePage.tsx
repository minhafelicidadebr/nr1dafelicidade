import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Award, Flame, Trophy, TrendingUp, Zap, BarChart3, Target, Loader2, Star } from "lucide-react";
import IFTWallet from "@/components/IFTWallet";
import { badges, earningRules, drivers } from "@/data/driversData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/runtime/appSupabaseClient";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface ProgressRecord {
  driver_slug: string;
  dynamic_id: string;
  completed: boolean;
  score: number | null;
  ift_earned: number;
  completed_at: string | null;
}

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("driver_slug, dynamic_id, completed, score, ift_earned, completed_at")
        .eq("user_id", user.id)
        .eq("completed", true);
      setProgress((data as ProgressRecord[]) || []);
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  const driverMastery = drivers.map((d) => {
    const completions = progress.filter((p) => p.driver_slug === d.slug);
    const totalDynamics = 10;
    const pct = Math.round((completions.length / totalDynamics) * 100);
    return { ...d, completions: completions.length, pct: Math.min(pct, 100) };
  });

  const totalIFT = progress.reduce((s, p) => s + (p.ift_earned || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Carregando..." />
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-10">
      {/* Header — Premium Dark */}
      <div className="relative bg-surface-deep text-surface-deep-fg overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(circle at 15% 50%, hsl(183 70% 45%) 0, transparent 40%), radial-gradient(circle at 85% 50%, hsl(40 95% 55%) 0, transparent 40%)" }} />
        <div className="container relative py-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground shadow-glow">
              <span className="font-display text-xl font-bold">
                {(profile?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-surface-deep-fg">
                {profile?.full_name ? `Olá, ${profile.full_name.split(" ")[0]}!` : "Meu Progresso"}
              </h1>
              <p className="text-2xs text-surface-deep-muted mt-0.5">Acompanhe sua jornada de aprendizagem e bem-estar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet */}
          <div className="md:col-span-1">
            <IFTWallet
              balance={profile?.ift_balance ?? totalIFT}
              streak={profile?.streak_days ?? 0}
              badgeCount={profile?.badge_count ?? 0}
            />
          </div>

          {/* Driver Mastery */}
          <div className="md:col-span-2">
            <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              Mastery por Driver
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {driverMastery.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div
                    key={d.slug}
                    {...fadeUp}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-2xl border border-border bg-card p-4 text-center card-hover"
                  >
                    <div className={`h-10 w-10 mx-auto rounded-xl ${d.bgClass} ${d.colorClass} flex items-center justify-center mb-2.5 border ${d.borderClass}`} aria-hidden="true">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xs font-bold truncate">{d.namePt}</p>
                    <div className="mt-2.5 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-hero"
                      />
                    </div>
                    <p className="text-2xs text-muted-foreground mt-1.5">
                      {d.completions}/10 · {d.pct}%
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-secondary" aria-hidden="true" />
            Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b, i) => {
              const unlocked = (profile?.badge_count ?? 0) > i;
              return (
                <motion.div
                  key={b.id}
                  {...fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border p-5 flex items-start gap-4 transition-all ${
                    unlocked ? "border-secondary/30 bg-secondary/5 shadow-elevated" : "border-border bg-card opacity-50"
                  }`}
                >
                  <span className={`text-3xl ${unlocked ? "" : "grayscale"}`} aria-hidden="true">{b.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-sm font-bold">{b.name}</h4>
                      <span className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                        b.rarity === "common" ? "bg-muted text-muted-foreground" :
                        b.rarity === "rare" ? "bg-info/10 text-info" :
                        "bg-ift-lavender/10 text-ift-lavender"
                      }`}>
                        {b.rarity === "common" ? "Comum" : b.rarity === "rare" ? "Raro" : "Épico"}
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground mt-1">{b.criteria}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {progress.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
              <Zap className="h-5 w-5 text-success" aria-hidden="true" />
              Atividade Recente
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden shadow-elevated">
              <div className="divide-y divide-border">
                {progress.slice(-10).reverse().map((p, i) => {
                  const d = drivers.find((dr) => dr.slug === p.driver_slug);
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                      <div className={`h-9 w-9 rounded-xl ${d?.bgClass || "bg-muted"} ${d?.colorClass || "text-muted-foreground"} flex items-center justify-center shrink-0 border ${d?.borderClass || "border-border"}`} aria-hidden="true">
                        {d && <d.icon className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{d?.namePt || p.driver_slug} — {p.dynamic_id}</p>
                        <p className="text-2xs text-muted-foreground">
                          {p.completed_at ? new Date(p.completed_at).toLocaleDateString("pt-BR") : "—"}
                          {p.score !== null && ` · Score: ${p.score}`}
                        </p>
                      </div>
                      {p.ift_earned > 0 && (
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">+{p.ift_earned}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Earning Rules */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" aria-hidden="true" />
            Regras de Ganho IFT
          </h2>
          <div className="rounded-2xl border border-border overflow-hidden shadow-elevated">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th scope="col" className="text-left py-3.5 px-5 font-display text-2xs font-bold text-muted-foreground uppercase tracking-wider">Ação</th>
                  <th scope="col" className="text-center py-3.5 px-5 font-display text-2xs font-bold text-muted-foreground uppercase tracking-wider">IFT</th>
                  <th scope="col" className="text-center py-3.5 px-5 font-display text-2xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Limite/dia</th>
                </tr>
              </thead>
              <tbody>
                {earningRules.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-5 text-xs font-medium">{r.action}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">+{r.reward}</span>
                    </td>
                    <td className="py-3.5 px-5 text-center text-2xs text-muted-foreground hidden sm:table-cell font-mono">{r.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
