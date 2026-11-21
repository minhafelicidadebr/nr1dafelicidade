import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, EyeOff, Flame, Gauge, Layers, Target } from "lucide-react";
import { getDimensionLabel, getDriverLabel, riskBand } from "@/lib/nr1/labels";
import { dimensionToDriver } from "@/data/copsoqData";
import { topDriverForDimension, topDriverGlobal } from "@/lib/nr1/topDriver";

interface Score {
  id: string;
  dimension: string;
  risk_level: number;
  severity: number;
  probability: number;
  n_responses: number;
}

interface Props {
  visible: Score[];
  total: number;
  suppressed: number;
}

export default function RiskSummaryCards({ visible, total, suppressed }: Props) {
  const critical = visible.filter((s) => riskBand(s.risk_level) === "critico").length;
  const high = visible.filter((s) => riskBand(s.risk_level) === "alto").length;
  const top3 = [...visible].sort((a, b) => b.risk_level - a.risk_level).slice(0, 3);
  const driver = topDriverGlobal(dimensionToDriver, visible);

  type Stat = {
    label: string;
    value: string | number;
    hint: string;
    icon: typeof Flame;
    tone: string;
    isText?: boolean;
  };
  const stats: Stat[] = [
    { label: "Riscos críticos", value: critical, hint: "R ≥ 20", icon: Flame, tone: "text-red-300 border-red-500/30 bg-red-500/5" },
    { label: "Riscos altos", value: high, hint: "R 15–19", icon: AlertTriangle, tone: "text-orange-300 border-orange-500/30 bg-orange-500/5" },
    { label: "Dimensões avaliadas", value: total, hint: `${visible.length} visíveis`, icon: Layers, tone: "text-foreground border-border bg-card/50" },
    { label: "Ocultadas por k", value: suppressed, hint: "n < 5", icon: EyeOff, tone: "text-amber-300 border-amber-500/30 bg-amber-500/5" },
    { label: "Top driver Playbook", value: driver.slug ? getDriverLabel(driver.slug, "pt-BR") : "—", hint: driver.slug ? `peso·risco ${driver.score.toFixed(1)}` : "Sem dados", icon: Gauge, tone: "text-primary border-primary/30 bg-primary/5", isText: true },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className={`border ${s.tone}`}>
            <CardContent className="p-3 space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                <span>{s.label}</span>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className={`font-semibold ${s.isText ? "text-base truncate" : "text-2xl"}`} title={String(s.value)}>
                {s.value}
              </div>
              <div className="text-[10px] text-muted-foreground">{s.hint}</div>
            </CardContent>
          </Card>
        );
      })}
      {top3.length > 0 && (
        <Card className="border border-border bg-card/50 col-span-2 md:col-span-3 lg:col-span-5">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
              <Target className="h-3.5 w-3.5" /> Top 3 riscos
            </div>
            <div className="grid sm:grid-cols-3 gap-2">
              {top3.map((s, i) => {
                const drv = topDriverForDimension(dimensionToDriver, s.dimension);
                return (
                  <div key={s.id} className="rounded-md border border-border bg-background/40 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                      <span className="text-[11px] font-mono text-foreground/80">R{s.risk_level}</span>
                    </div>
                    <div className="font-medium text-sm truncate" title={getDimensionLabel(s.dimension, "pt-BR")}>
                      {getDimensionLabel(s.dimension, "pt-BR")}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      S{s.severity}×P{s.probability} · n={s.n_responses}
                      {drv ? ` · ${getDriverLabel(drv, "pt-BR")}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
