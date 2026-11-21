import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { fetchSafeRiskScores } from "@/lib/api/privacyVault";

type Pt = { cycle_id: string; cycle_name: string; avg: number; n: number };

export function TrendCard({ orgId }: { orgId: string }) {
  const [pts, setPts] = useState<Pt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchSafeRiskScores({ organizationId: orgId });
      const grouped = new Map<string, { name: string; total: number; n: number; count: number; t: string }>();
      data.forEach((r) => {
        if (r.n_responses < 5) return;
        const g = grouped.get(r.cycle_id) ?? { name: r.cycle_name ?? "—", total: 0, n: 0, count: 0, t: r.cycle_started_at ?? "" };
        g.total += r.risk_level;
        g.count += 1;
        g.n += r.n_responses;
        grouped.set(r.cycle_id, g);
      });
      const list: Pt[] = Array.from(grouped.entries())
        .map(([id, g]) => ({ cycle_id: id, cycle_name: g.name, avg: g.count ? g.total / g.count : 0, n: g.n }))
        .sort((a, b) => a.cycle_name.localeCompare(b.cycle_name));
      setPts(list);
      setLoading(false);
    })();
  }, [orgId]);

  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  const delta = last && prev ? last.avg - prev.avg : 0;
  const Icon = delta > 0.5 ? TrendingUp : delta < -0.5 ? TrendingDown : Minus;
  const tone = delta > 0.5 ? "text-destructive" : delta < -0.5 ? "text-emerald-500" : "text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de risco médio</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : pts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem ciclos com amostra suficiente (k≥5).</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-end gap-1 h-24">
              {pts.map((p) => {
                const h = Math.min(100, (p.avg / 25) * 100);
                return (
                  <div key={p.cycle_id} className="flex-1 flex flex-col items-center gap-1" title={`${p.cycle_name}: R${p.avg.toFixed(1)} (n=${p.n})`}>
                    <div className="w-full bg-primary/70 rounded-t" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center">{p.cycle_name}</span>
                  </div>
                );
              })}
            </div>
            {last && (
              <div className={`flex items-center gap-2 text-sm ${tone}`}>
                <Icon className="h-4 w-4" />
                <span>
                  Último ciclo: <strong>R{last.avg.toFixed(1)}</strong>
                  {prev && <span className="text-muted-foreground"> ({delta >= 0 ? "+" : ""}{delta.toFixed(1)} vs anterior)</span>}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
