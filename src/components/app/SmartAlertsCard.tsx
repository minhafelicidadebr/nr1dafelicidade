import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { AlertTriangle, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";
import { canDisplayAggregate } from "@/lib/privacy";
import { fetchSafeRiskScores } from "@/lib/api/privacyVault";

type Alert = {
  severity: "critical" | "warning" | "info";
  dimension: string;
  message: string;
  delta?: number;
};

const VAR_CRITICAL = 8; // ΔR ≥ 8 between cycles
const VAR_WARNING = 4;
const RISK_HIGH = 15;

export function SmartAlertsCard({ orgId }: { orgId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let ids: string[] = [];
      try {
        const { data: cycles, error } = await supabase
          .from("cycles")
          .select("id, name")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: false })
          .limit(2);
        if (error) throw error;
        ids = (cycles ?? []).map((c) => c.id);
      } catch {
        ids = ["syn-cycle-2026-q2", "syn-cycle-2026-q1"];
      }
      if (ids.length === 0) {
        ids = ["syn-cycle-2026-q2", "syn-cycle-2026-q1"];
      }

      const scores = (await fetchSafeRiskScores({ organizationId: orgId }))
        .filter((score) => ids.includes(score.cycle_id));

      const list: Alert[] = [];
      const byCycle = new Map<string, Map<string, { r: number; n: number }>>();
      scores.forEach((s) => {
        if (!canDisplayAggregate(s.n_responses)) return;
        if (!byCycle.has(s.cycle_id)) byCycle.set(s.cycle_id, new Map());
        byCycle.get(s.cycle_id)!.set(s.dimension, { r: s.risk_level, n: s.n_responses });
      });

      const latest = byCycle.get(ids[0]) ?? new Map();
      const prev = ids[1] ? byCycle.get(ids[1]) ?? new Map() : new Map();

      // High absolute risk in latest cycle
      latest.forEach((v, dim) => {
        if (v.r >= 20) list.push({ severity: "critical", dimension: dim, message: `Risco crítico (R${v.r}, n=${v.n}) — ação imediata recomendada.` });
        else if (v.r >= RISK_HIGH) list.push({ severity: "warning", dimension: dim, message: `Risco alto (R${v.r}, n=${v.n}).` });
      });

      // Variation between cycles
      latest.forEach((v, dim) => {
        const p = prev.get(dim);
        if (!p) return;
        const d = v.r - p.r;
        if (d >= VAR_CRITICAL) list.push({ severity: "critical", dimension: dim, delta: d, message: `Piora crítica entre ciclos (+${d} pontos de risco).` });
        else if (d >= VAR_WARNING) list.push({ severity: "warning", dimension: dim, delta: d, message: `Tendência de piora (+${d}).` });
        else if (d <= -VAR_WARNING) list.push({ severity: "info", dimension: dim, delta: d, message: `Melhora relevante (${d}). Mantenha controles em vigor.` });
      });

      list.sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 } as const;
        return order[a.severity] - order[b.severity];
      });
      setAlerts(list);
      setLoading(false);
    })();
  }, [orgId]);

  const tone = (s: Alert["severity"]) =>
    s === "critical" ? "bg-destructive/15 border-destructive/40 text-foreground"
    : s === "warning" ? "bg-yellow-500/10 border-yellow-500/30 text-foreground"
    : "bg-emerald-500/10 border-emerald-500/30 text-foreground";

  const Icon = (a: Alert) =>
    a.severity === "critical" ? <ShieldAlert className="h-4 w-4 text-destructive" />
    : a.severity === "warning" ? <AlertTriangle className="h-4 w-4 text-yellow-500" />
    : (a.delta ?? 0) < 0 ? <TrendingDown className="h-4 w-4 text-emerald-500" />
    : <TrendingUp className="h-4 w-4 text-emerald-500" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" /> Alertas inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Analisando ciclos…</p>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum alerta no momento. Compute riscos em ≥1 ciclo (k≥5) para acionar a inteligência de variação.
          </p>
        ) : (
          <ul className="space-y-2">
            {alerts.slice(0, 8).map((a, i) => (
              <li key={i} className={`flex items-start gap-3 p-3 rounded border ${tone(a.severity)}`}>
                <div className="mt-0.5">{Icon(a)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{a.dimension}</span>
                    <Badge variant="outline" className="text-[10px] capitalize">{a.severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                </div>
              </li>
            ))}
            {alerts.length > 8 && (
              <p className="text-[11px] text-muted-foreground text-right">+ {alerts.length - 8} alertas adicionais</p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
