import { Fragment, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { canDisplayAggregate } from "@/lib/privacy";
import { getDimensionLabel, SEVERITY_LABEL, PROBABILITY_LABEL } from "@/lib/nr1/labels";

interface Props {
  scores: Array<{
    id: string;
    dimension: string;
    severity: number;
    probability: number;
    risk_level: number;
    n_responses: number;
  }>;
}

function cellColor(level: number) {
  if (level >= 20) return "bg-red-500/25 border-red-500/50";
  if (level >= 15) return "bg-orange-500/20 border-orange-500/40";
  if (level >= 10) return "bg-yellow-500/15 border-yellow-500/35";
  if (level >= 5) return "bg-emerald-500/10 border-emerald-500/30";
  return "bg-muted/30 border-border";
}

function cellTextColor(level: number) {
  if (level >= 20) return "text-red-300";
  if (level >= 15) return "text-orange-300";
  if (level >= 10) return "text-yellow-300";
  if (level >= 5) return "text-emerald-300";
  return "text-muted-foreground";
}

export default function AIHAMatrix({ scores }: Props) {
  const grid = useMemo(() => {
    const m: Record<string, typeof scores> = {};
    for (const s of scores) {
      if (!canDisplayAggregate(s.n_responses)) continue;
      const k = `${s.severity}-${s.probability}`;
      (m[k] ??= []).push(s);
    }
    return m;
  }, [scores]);

  const severities = [5, 4, 3, 2, 1];
  const probabilities = [1, 2, 3, 4, 5];

  return (
    <TooltipProvider delayDuration={150}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-3 flex-wrap text-base">
            <span className="flex items-center gap-2">
              Matriz AIHA 5×5
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  Matriz de risco do American Industrial Hygiene Association.
                  Risco = Severidade × Probabilidade. Verde (trivial/baixo),
                  amarelo (moderado), laranja (alto), vermelho (crítico).
                </TooltipContent>
              </Tooltip>
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500/40" /> Crítico</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-orange-500/40" /> Alto</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-yellow-500/30" /> Moderado</span>
              <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/30" /> Baixo</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: "auto repeat(5, minmax(96px, 1fr))" }}>
              <div />
              {probabilities.map((p) => (
                <Tooltip key={p}>
                  <TooltipTrigger asChild>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground text-center py-1 cursor-help">
                      P{p}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">{PROBABILITY_LABEL[p]}</TooltipContent>
                </Tooltip>
              ))}

              {severities.map((sev) => (
                <Fragment key={`row-${sev}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground text-right pr-2 self-center cursor-help">
                        S{sev}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">{SEVERITY_LABEL[sev]}</TooltipContent>
                  </Tooltip>
                  {probabilities.map((p) => {
                    const level = sev * p;
                    const items = grid[`${sev}-${p}`] ?? [];
                    return (
                      <div
                        key={`${sev}-${p}`}
                        className={`min-h-[64px] rounded-md border p-1.5 ${cellColor(level)} relative`}
                      >
                        <div className={`absolute top-1 right-1.5 text-[10px] font-mono ${cellTextColor(level)}`}>
                          {level}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {items.map((it) => (
                            <Tooltip key={it.id}>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className={`text-[9px] px-1.5 py-0 font-normal cursor-help ${cellTextColor(level)}`}
                                >
                                  {getDimensionLabel(it.dimension, "pt-BR").slice(0, 18)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="text-xs">
                                {getDimensionLabel(it.dimension, "pt-BR")} · R{it.risk_level} · n={it.n_responses}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
              <span>← Probabilidade →</span>
              <span>Severidade ↑</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
