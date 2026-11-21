import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchSafeRiskScores } from "@/lib/api/privacyVault";
import { canDisplayAggregate, PRIVACY_REDACTED_LABEL } from "@/lib/privacy";
import PrivacyGuardBadge from "./PrivacyGuardBadge";
import { getDimensionLabel } from "@/lib/nr1/labels";

type Row = {
  cycle_id: string;
  cycle_name: string;
  dimension: string;
  risk_level: number;
  mean_score: number | null;
  n_responses: number;
};

function riskClass(level: number) {
  if (level >= 20) return "bg-destructive/30 text-destructive-foreground border-destructive/50";
  if (level >= 15) return "bg-destructive/15 text-foreground border-destructive/30";
  if (level >= 10) return "bg-yellow-500/15 text-foreground border-yellow-500/30";
  if (level >= 5) return "bg-emerald-500/10 text-foreground border-emerald-500/30";
  return "bg-muted text-muted-foreground border-border";
}

export function DimensionHeatmap({ orgId }: { orgId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchSafeRiskScores({ organizationId: orgId });
      const flat: Row[] = data.map((r) => ({
        cycle_id: r.cycle_id,
        cycle_name: r.cycle_name ?? "—",
        dimension: r.dimension,
        risk_level: r.risk_level,
        mean_score: r.mean_score,
        n_responses: r.n_responses,
      }));
      setRows(flat);
      setLoading(false);
    })();
  }, [orgId]);

  const cycles = Array.from(new Map(rows.map((r) => [r.cycle_id, r.cycle_name])).entries());
  const dimensions = Array.from(new Set(rows.map((r) => r.dimension))).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Heatmap dimensional</span>
          <PrivacyGuardBadge n={rows.reduce((s, r) => s + r.n_responses, 0)} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Compute riscos em pelo menos um ciclo para visualizar o heatmap.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium">Dimensão</th>
                  {cycles.map(([id, name]) => (
                    <th key={id} className="text-left p-2 text-muted-foreground font-medium">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dimensions.map((dim) => (
                  <tr key={dim} className="border-t border-border">
                    <td className="p-2 font-medium text-foreground whitespace-nowrap" title={dim}>{getDimensionLabel(dim, "pt-BR")}</td>
                    {cycles.map(([cid]) => {
                      const cell = rows.find((r) => r.cycle_id === cid && r.dimension === dim);
                      if (!cell) return <td key={cid} className="p-2 text-muted-foreground">—</td>;
                      const ok = canDisplayAggregate(cell.n_responses);
                      return (
                        <td key={cid} className="p-1">
                          <div
                            className={`px-2 py-1 rounded border text-center ${
                              ok ? riskClass(cell.risk_level) : "bg-muted text-muted-foreground border-border"
                            }`}
                            title={`n=${cell.n_responses}`}
                          >
                            {ok ? `R${cell.risk_level}` : PRIVACY_REDACTED_LABEL}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap gap-2 mt-3 text-[10px]">
              <Badge variant="outline" className={riskClass(20)}>≥20 Crítico</Badge>
              <Badge variant="outline" className={riskClass(15)}>15–19 Alto</Badge>
              <Badge variant="outline" className={riskClass(10)}>10–14 Médio</Badge>
              <Badge variant="outline" className={riskClass(5)}>5–9 Baixo</Badge>
              <Badge variant="outline" className={riskClass(1)}>1–4 Trivial</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
