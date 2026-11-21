/**
 * RiskHistoryCard — Lente 4 (série temporal)
 * Lê snapshots da tabela risk_scores_history geradas por compute_cycle_risk.
 * Mostra a evolução do risco médio do ciclo a cada recálculo + delta da última execução.
 */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { getDimensionLabel } from "@/lib/nr1/labels";
import { fetchSafeRiskHistory } from "@/lib/api/privacyVault";

type Row = {
  computation_id: string;
  computed_at: string;
  dimension: string;
  risk_level: number;
  n_responses: number;
};

type Snap = {
  computation_id: string;
  computed_at: string;
  dims: number;
  avg: number;
  max: number;
  topDim: string | null;
  totalN: number;
};

export default function RiskHistoryCard({ cycleId }: { cycleId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await fetchSafeRiskHistory(cycleId).catch(() => []);
      if (!mounted) return;
      setRows(data as Row[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [cycleId]);

  const snapshots: Snap[] = useMemo(() => {
    const groups = new Map<string, Row[]>();
    rows.forEach((r) => {
      const list = groups.get(r.computation_id) ?? [];
      list.push(r);
      groups.set(r.computation_id, list);
    });
    return Array.from(groups.entries())
      .map(([cid, list]) => {
        const avg = list.reduce((s, r) => s + r.risk_level, 0) / list.length;
        const top = [...list].sort((a, b) => b.risk_level - a.risk_level)[0];
        return {
          computation_id: cid,
          computed_at: list[0].computed_at,
          dims: list.length,
          avg,
          max: top?.risk_level ?? 0,
          topDim: top?.dimension ?? null,
          totalN: list.reduce((m, r) => Math.max(m, r.n_responses), 0),
        };
      })
      .sort((a, b) => +new Date(a.computed_at) - +new Date(b.computed_at));
  }, [rows]);

  const last = snapshots[snapshots.length - 1];
  const prev = snapshots[snapshots.length - 2];
  const delta = last && prev ? last.avg - prev.avg : 0;
  const Icon = delta > 0.5 ? TrendingUp : delta < -0.5 ? TrendingDown : Minus;
  const tone = delta > 0.5 ? "text-red-400" : delta < -0.5 ? "text-emerald-400" : "text-muted-foreground";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" />
          Evolução do cálculo — linha do tempo do ciclo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando histórico…</p>
        ) : snapshots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum recálculo registrado ainda neste ciclo. A cada execução de
            <em> Recalcular riscos</em>, um snapshot é arquivado aqui (NR-1 §1.5.7 — rastreabilidade).
          </p>
        ) : (
          <div className="space-y-4">
            {/* Mini sparkline */}
            <div className="flex items-end gap-1 h-20">
              {snapshots.map((s) => {
                const h = Math.min(100, (s.avg / 25) * 100);
                return (
                  <div
                    key={s.computation_id}
                    className="flex-1 flex flex-col items-center gap-1"
                    title={`${new Date(s.computed_at).toLocaleString("pt-BR")} — média R${s.avg.toFixed(1)}`}
                  >
                    <div className="w-full bg-primary/70 rounded-t" style={{ height: `${h}%` }} />
                  </div>
                );
              })}
            </div>

            {last && (
              <div className={`flex items-center gap-2 text-sm ${tone}`}>
                <Icon className="h-4 w-4" />
                <span>
                  Última execução: <strong>R{last.avg.toFixed(1)}</strong> média ·
                  pico R{last.max} ({last.topDim ? getDimensionLabel(last.topDim) : "—"})
                  {prev && (
                    <span className="text-muted-foreground">
                      {" "}({delta >= 0 ? "+" : ""}{delta.toFixed(1)} vs anterior)
                    </span>
                  )}
                </span>
              </div>
            )}

            <ol className="space-y-2 text-xs">
              {snapshots.slice().reverse().slice(0, 6).map((s, i) => (
                <li key={s.computation_id} className="flex items-center justify-between border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">
                    {new Date(s.computed_at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{s.dims} dim.</Badge>
                    <Badge variant="outline" className="text-[10px]">n≤{s.totalN}</Badge>
                    <span className="font-mono font-semibold">R{s.avg.toFixed(1)}</span>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-[11px] text-muted-foreground">
              Cada barra = um snapshot imutável de <code>risk_scores</code> arquivado em <code>risk_scores_history</code> antes do recálculo. Use para auditoria e prova de evolução pós-intervenção.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
