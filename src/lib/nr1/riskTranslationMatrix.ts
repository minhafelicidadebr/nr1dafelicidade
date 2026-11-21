// @ts-nocheck -- pre-existing type errors carried over from the original project
/**
 * Matriz determinística de tradução científica — COPSOQ → MTE → Playbook → Intervenções.
 *
 * Fonte única: src/data/nr1Crosswalk.ts, src/data/nr1Framework.ts,
 * src/data/nr1Interventions.ts. Nenhuma recomendação é inventada em runtime;
 * tudo deriva de catálogo cadastrado. Para dimensões sem item no crosswalk,
 * retornamos um insight conservador com "fonte não cadastrada".
 */

import { nr1Crosswalk, type CrosswalkItem } from "@/data/nr1Crosswalk";
import { nr1Framework } from "@/data/nr1Framework";
import { findIntervention } from "@/data/nr1Interventions";


export interface MteFactorView { code: string; label: string; priority: string; critical?: boolean }
export interface InterventionView {
  id: string;
  title: string;
  controlHierarchy: string;
  evidenceLevel: string;
  evidenceSource: string;
  playbookRef: string;
}

export interface DimensionInsight {
  dimensionKey: string;
  mteFactors: MteFactorView[];
  drivers: { slug: string; weight: number }[];
  defaultSeverity: number | null;
  evidenceLevel: string | null;
  evidenceSource: string | null;
  interventionLogic: string | null;
  priority: string | null;
  interventions: InterventionView[];
  sourceRefs: string[];
  limitations: string[];
  catalogued: boolean;
}

function mteByCode(code: string): MteFactorView | null {
  const f = nr1Framework.thirteenMteFactors.find((m) => m.id === code);
  if (!f) return null;
  return { code: f.id, label: f.name, priority: f.priority, critical: "criticalFlag" in f && f.criticalFlag };
}

const DIMENSION_CROSSWALK_ALIASES: Record<string, string> = {
  workload: "demands_quant",
  workload_pressures: "demands_quant",
  quantitative_demands: "demands_quant",
  emotional_demands: "demands_emotional",
  autonomy: "influence",
  influence_at_work: "influence",
  job_security: "insecurity",
  job_insecurity: "insecurity",
  work_life_balance: "burnout",
  work_family_conflict: "burnout",
  support: "social_support",
  social_support_supervisors: "leadership_quality",
  social_support_colleagues: "social_support",
  management: "leadership_quality",
  justice_trust: "justice_respect",
  justice_and_respect: "justice_respect",
  trust: "leadership_quality",
  offensive_behaviors: "offensive_behaviours",
  meaning_of_work: "meaning",
  social_community_at_work: "community",
  possibilities_for_development: "possibilities_development",
};

function crosswalkForDimension(dim: string): CrosswalkItem | undefined {
  const canonical = DIMENSION_CROSSWALK_ALIASES[dim] ?? dim;
  return (nr1Crosswalk.items as readonly CrosswalkItem[]).find(
    (it) =>
      (it.copsoqDimensions as readonly string[]).includes(dim) ||
      (it.copsoqDimensions as readonly string[]).includes(canonical),
  );
}

export function getDimensionInsight(dim: string): DimensionInsight {
  const cw = crosswalkForDimension(dim);
  if (!cw) {
    return {
      dimensionKey: dim,
      mteFactors: [],
      drivers: [],
      defaultSeverity: null,
      evidenceLevel: null,
      evidenceSource: null,
      interventionLogic: null,
      priority: null,
      interventions: [],
      sourceRefs: ["Fonte não cadastrada — revisar catálogo institucional"],
      limitations: [
        "Dimensão não vinculada ao crosswalk MTE/Playbook. Recomendações específicas exigem cadastro técnico.",
      ],
      catalogued: false,
    };
  }

  const drivers = Object.entries(cw.driverWeights ?? {})
    .map(([slug, weight]) => ({ slug, weight: Number(weight) }))
    .sort((a, b) => b.weight - a.weight);

  const mteFactors = (cw.mteFactors as readonly string[])
    .map(mteByCode)
    .filter((x): x is MteFactorView => !!x);

  const interventions: InterventionView[] = (cw.interventionIds as readonly string[])
    .map((id): InterventionView | null => {
      const i = findIntervention(id);
      if (!i) return null;
      return {
        id: i.id,
        title: i.title,
        controlHierarchy: String(i.controlHierarchy),
        evidenceLevel: String(i.evidenceLevel),
        evidenceSource: i.evidenceSource,
        playbookRef: i.playbookRef,
      };
    })
    .filter((x): x is InterventionView => x !== null);

  const sourceRefs = Array.from(
    new Set(
      [
        cw.evidenceSource,
        cw.playbookPageRef ? `Work Wellbeing Playbook 2.0 — ${cw.playbookPageRef}` : null,
        ...interventions.map((i) => i.evidenceSource),
      ].filter(Boolean) as string[],
    ),
  );

  return {
    dimensionKey: dim,
    mteFactors,
    drivers,
    defaultSeverity: cw.aihaDefaultSeverity,
    evidenceLevel: cw.evidenceLevel,
    evidenceSource: cw.evidenceSource,
    interventionLogic: cw.interventionLogic,
    priority: cw.priority,
    interventions,
    sourceRefs,
    limitations: [
      "Recomendação preliminar baseada em catálogo. Requer revisão do responsável técnico (SST/PGR).",
      "Não constitui diagnóstico clínico nem laudo automático de conformidade NR-1.",
    ],
    catalogued: true,
  };
}
