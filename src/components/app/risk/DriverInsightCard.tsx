import { Link } from "@/lib/router/compat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ShieldAlert, Wrench } from "lucide-react";
import { getDimensionInsight } from "@/lib/nr1/riskTranslationMatrix";
import {
  getDimensionLabel,
  getDriverLabel,
  getEvidenceLabel,
  SEVERITY_LABEL,
  PROBABILITY_LABEL,
  riskBand,
  RISK_BAND_LABEL,
} from "@/lib/nr1/labels";

interface Props {
  dimensionKey: string;
  riskLevel: number;
  severity: number;
  probability: number;
  nResponses: number;
}

const bandColor: Record<string, string> = {
  critico: "bg-red-500/20 text-red-300 border-red-500/40",
  alto: "bg-orange-500/20 text-orange-300 border-orange-500/40",
  moderado: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  baixo: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  trivial: "bg-muted text-muted-foreground border-border",
};

export default function DriverInsightCard({ dimensionKey, riskLevel, severity, probability, nResponses }: Props) {
  const ins = getDimensionInsight(dimensionKey);
  const band = riskBand(riskLevel);
  const dimLabel = getDimensionLabel(dimensionKey, "pt-BR", true);
  const topDrivers = ins.drivers.slice(0, 4);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 flex-wrap text-base">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            {dimLabel}
          </span>
          <Badge variant="outline" className={bandColor[band]}>
            Risco {RISK_BAND_LABEL[band]} · R{riskLevel}
          </Badge>
        </CardTitle>
        <div className="text-[11px] text-muted-foreground">
          Severidade: <strong>{SEVERITY_LABEL[severity]}</strong> · Probabilidade:{" "}
          <strong>{PROBABILITY_LABEL[probability]}</strong> · n={nResponses}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* MTE factors */}
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1.5">Fator psicossocial relacionado (MTE)</div>
          {ins.mteFactors.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Fator MTE não cadastrado para esta dimensão.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {ins.mteFactors.map((f) => (
                <Badge key={f.code} variant="outline" className={f.critical ? "border-red-500/50 text-red-300" : ""}>
                  {f.code} — {f.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Playbook drivers */}
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1.5">
            Direcionadores do Playbook (Work Wellbeing 2.0)
          </div>
          {topDrivers.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Direcionadores não cadastrados.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {topDrivers.map((d) => (
                <Badge key={d.slug} variant="secondary">
                  {getDriverLabel(d.slug, "pt-BR", true)} · peso {d.weight.toFixed(1)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Logic of intervention */}
        {ins.interventionLogic && (
          <div>
            <div className="text-[11px] uppercase text-muted-foreground mb-1">Lógica de intervenção</div>
            <p className="text-xs text-foreground/90">{ins.interventionLogic}</p>
          </div>
        )}

        {/* Recommended interventions */}
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1.5">Intervenções recomendadas (catálogo)</div>
          {ins.interventions.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Nenhuma intervenção cadastrada — revisar catálogo institucional.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {ins.interventions.slice(0, 4).map((iv) => (
                <li key={iv.id} className="rounded border border-border bg-background/40 px-3 py-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{iv.title}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {iv.controlHierarchy}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Evidência: {getEvidenceLabel(iv.evidenceLevel)} · {iv.evidenceSource}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sources */}
        <div>
          <div className="text-[11px] uppercase text-muted-foreground mb-1 flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Fontes e referências cadastradas
          </div>
          <ul className="text-[11px] text-muted-foreground space-y-0.5">
            {ins.sourceRefs.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="rounded border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-200/90">
          {ins.limitations.map((l) => (
            <p key={l}>• {l}</p>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm">
            <Link to="/app/actions">
              Criar ação <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/app/controls">
              <Wrench className="h-3.5 w-3.5" /> Ver controles
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
