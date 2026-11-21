import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { canDisplayAggregate, PRIVACY_REDACTED_LABEL } from "@/lib/privacy";
import PrivacyGuardBadge from "./PrivacyGuardBadge";
import { getDimensionLabel } from "@/lib/nr1/labels";

type Cycle = { id: string; name: string };
type Row = { unit_id: string | null; unit_name: string; dimension: string; mean_score: number; n_responses: number; k_anonymity_met: boolean };

function tone(score: number) {
  if (score >= 75) return "bg-destructive/25 text-foreground border-destructive/40";
  if (score >= 60) return "bg-destructive/10 text-foreground border-destructive/25";
  if (score >= 45) return "bg-yellow-500/15 text-foreground border-yellow-500/30";
  if (score >= 30) return "bg-emerald-500/10 text-foreground border-emerald-500/30";
  return "bg-muted text-muted-foreground border-border";
}

export function UnitDrilldownCard({ orgId }: { orgId: string }) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("cycles")
        .select("id, name")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
      const cs = (data ?? []) as Cycle[];
      setCycles(cs);
      if (cs[0]) setSelected(cs[0].id);
    })();
  }, [orgId]);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("aggregate_unit_risk", { _cycle_id: selected });
      if (!error) setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, [selected]);

  const units = Array.from(new Map(rows.map((r) => [r.unit_id ?? "_", r.unit_name])).entries());
  const dimensions = Array.from(
    new Set(rows.map((r) => r.dimension).filter((d): d is string => typeof d === "string" && d.length > 0)),
  ).sort();
  const totalN = units.reduce((sum, [uid]) => {
    const unitCells = rows.filter((r) => (r.unit_id ?? "_") === uid);
    const unitN = unitCells.reduce((max, r) => Math.max(max, r.n_responses ?? 0), 0);
    return sum + unitN;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3 flex-wrap">
          <span>Drilldown por unidade</span>
          <div className="flex items-center gap-2">
            <PrivacyGuardBadge n={totalN} />
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Ciclo" /></SelectTrigger>
              <SelectContent>
                {cycles.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Selecione um ciclo com respostas para visualizar o drilldown.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium">Unidade</th>
                  {dimensions.map((d) => (
                    <th
                      key={d}
                      className="text-left p-2 text-muted-foreground font-medium whitespace-nowrap"
                      title={`${getDimensionLabel(d, "pt-BR")} (${d})`}
                    >
                      {getDimensionLabel(d, "pt-BR")}
                    </th>
                  ))}
                  <th className="text-left p-2 text-muted-foreground font-medium">n</th>
                </tr>
              </thead>
              <tbody>
                {units.map(([uid, uname]) => {
                  const cells = rows.filter((r) => (r.unit_id ?? "_") === uid);
                  const unitN = cells.reduce((max, r) => Math.max(max, r.n_responses ?? 0), 0);
                  const unitAllowed = canDisplayAggregate(unitN);
                  return (
                    <tr key={uid} className="border-t border-border">
                      <td className="p-2 font-medium text-foreground">{uname}</td>
                      {dimensions.map((d) => {
                        if (!unitAllowed) {
                          return (
                            <td key={d} className="p-1">
                              <div
                                className="px-2 py-1 rounded border text-center bg-muted text-muted-foreground border-border"
                                title={`n=${unitN}`}
                              >
                                {PRIVACY_REDACTED_LABEL}
                              </div>
                            </td>
                          );
                        }
                        const cell = cells.find((c) => c.dimension === d);
                        if (!cell || cell.mean_score === null || cell.mean_score === undefined) {
                          return <td key={d} className="p-2 text-muted-foreground text-center">—</td>;
                        }
                        const ok = canDisplayAggregate(cell.n_responses);
                        const rawScore = Number(cell.mean_score);
                        const normalizedScore = rawScore <= 5 && rawScore > 0 ? Math.round(((rawScore - 1) / 4) * 100) : rawScore;
                        return (
                          <td key={d} className="p-1">
                            <div className={`px-2 py-1 rounded border text-center ${ok ? tone(normalizedScore) : "bg-muted text-muted-foreground border-border"}`} title={`n=${cell.n_responses}`}>
                              {ok ? normalizedScore.toFixed(0) : PRIVACY_REDACTED_LABEL}
                            </div>
                          </td>
                        );
                      })}
                      <td className="p-2"><Badge variant="outline">{unitN}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-muted-foreground mt-2">
              Escores 0–100 (maior = mais desfavorável). Células com n &lt; 5 são ocultadas para preservar anonimato.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
