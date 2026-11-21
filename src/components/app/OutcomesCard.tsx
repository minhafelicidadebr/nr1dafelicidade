import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { canDisplayAggregate, PRIVACY_REDACTED_LABEL, K_ANONYMITY_MIN } from "@/lib/privacy";
import { normalizeOutcomeRows, type OutcomeRow } from "@/lib/privacy/outcomeRows";
import PrivacyGuardBadge from "@/components/app/PrivacyGuardBadge";
import { Activity, AlertTriangle, HeartPulse, Moon, ShieldAlert, Users, type LucideIcon } from "lucide-react";

type OutcomeMeta = { label: string; icon: LucideIcon; help: string; redFlag: number };

const OUTCOME_META: Record<string, OutcomeMeta> = {
  health_general:        { label: "Saúde geral percebida", icon: HeartPulse, help: "Escala 1 (Excelente) → 5 (Deficitária), normalizada 0–100.", redFlag: 60 },
  work_family_conflict:  { label: "Conflito trabalho-família", icon: Users,       help: "Energia/tempo do trabalho afetando a vida privada.", redFlag: 50 },
  sleep_problems:        { label: "Problemas de sono",         icon: Moon,        help: "Despertares noturnos nas últimas 4 semanas.", redFlag: 50 },
  burnout:               { label: "Burnout (exaustão)",        icon: Activity,    help: "Exaustão física e emocional — últimas 4 semanas.", redFlag: 50 },
  stress:                { label: "Stress (irritação/ansiedade/tristeza)", icon: AlertTriangle, help: "Sintomas afetivos de stress — últimas 4 semanas.", redFlag: 50 },
  offensive_behaviors:   { label: "Comportamentos ofensivos",  icon: ShieldAlert, help: "Insultos, assédio, ameaças ou violência — últimos 12 meses.", redFlag: 20 },
};

function band(score: number, redFlag: number) {
  if (score >= redFlag) return { label: "Alerta", cls: "bg-red-500/20 text-red-400 border-red-500/40" };
  if (score >= redFlag * 0.6) return { label: "Atenção", cls: "bg-amber-500/20 text-amber-400 border-amber-500/40" };
  return { label: "Aceitável", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" };
}

export default function OutcomesCard({ cycleId }: { cycleId: string }) {
  const [rows, setRows] = useState<OutcomeRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cycleId) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase.rpc("aggregate_cycle_outcomes", { _cycle_id: cycleId });
      setRows(normalizeOutcomeRows(data));
      setLoading(false);
    })();
  }, [cycleId]);

  const totalN = rows.reduce((acc, r) => Math.max(acc, r.n_responses ?? 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Indicadores coletivos aprovados — separados de exposição e diagnóstico</span>
          {rows.length > 0 && <PrivacyGuardBadge n={totalN} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Indicadores de <strong>desfecho</strong> (saúde, sono, burnout, stress, conflito trabalho-família e comportamentos ofensivos)
          coletados na triagem. Não compõem o cálculo dimensional de risco, mas sinalizam necessidade de
          encaminhamento clínico/SST. Apresentados apenas quando n ≥ {K_ANONYMITY_MIN}.
        </p>
        {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        {!loading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum desfecho registrado neste ciclo ainda.</p>
        )}
        {!loading && rows.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((r) => {
              const meta = OUTCOME_META[r.outcome];
              if (!meta) return null;
              const Icon = meta.icon;
              const ok = r.k_anonymity_met && canDisplayAggregate(r.n_responses);
              const score = ok ? Number(r.mean_score) : null;
              const b = ok && score != null ? band(score, meta.redFlag) : null;
              return (
                <div key={r.outcome} className="rounded-lg border border-border p-3 space-y-2 bg-card/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Icon className="h-4 w-4 text-primary" />
                      {meta.label}
                    </div>
                    {b && <Badge variant="outline" className={b.cls}>{b.label}</Badge>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold">
                      {ok && score != null ? score.toFixed(0) : PRIVACY_REDACTED_LABEL}
                    </span>
                    <span className="text-xs text-muted-foreground">/100 · n={r.n_responses}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{meta.help}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
