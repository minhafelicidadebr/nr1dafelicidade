import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Building2, Landmark, Store, ArrowRight, CheckCircle2 } from "lucide-react";

const segments = [
  {
    id: "pme",
    label: "Pequena Empresa",
    size: "1–99",
    icon: Store,
    pains: [
      "Falta de método para abordar saúde mental",
      "Baixa capacidade interna de SST/RH",
      "Medo de não estar preparado para riscos psicossociais",
    ],
    outcomes: [
      "Avaliação inicial de prontidão",
      "Plano de ação prático e acessível",
      "Evidências mínimas para documentação",
    ],
    cta: "Começar avaliação de prontidão",
    ctaRoute: "cta_diagnostic",
    microcopy: "Descoberta guiada. Escopo e limites antes de qualquer campanha.",
  },
  {
    id: "media",
    label: "Média Empresa",
    size: "100–999",
    icon: Building,
    pains: [
      "Fragmentação entre clima, treinamento e SST",
      "Dificuldade de priorização de ações",
      "Pressão por resultados e governança",
    ],
    outcomes: [
      "Dashboards consolidados por equipe",
      "Trilhas pedagógicas padronizadas",
      "Roadmap de prontidão regulatória",
    ],
    cta: "Preparar Demonstração",
    ctaRoute: "cta_demo",
    microcopy: "Sprint assistido sujeito a revisões, aprovações e aceite formal.",
  },
  {
    id: "grande",
    label: "Grande Empresa",
    size: "1.000+",
    icon: Building2,
    pains: [
      "Risco reputacional e regulatório alto",
      "Múltiplas unidades e públicos diversos",
      "Necessidade de reporting executivo",
    ],
    outcomes: [
      "Governança multiunidade e rollout controlado",
      "Camada executiva de dados e integrações",
      "Relatórios auditáveis para revisão técnica contínua",
    ],
    cta: "Preparar Reunião Executiva",
    ctaRoute: "cta_demo",
    microcopy: "Integrações, níveis de serviço e rollout produtivo dependem de DPA, governança e operação comprovada.",
  },
  {
    id: "publico",
    label: "Setor Público",
    size: "Órgãos e Autarquias",
    icon: Landmark,
    pains: [
      "Necessidade de política institucional",
      "Pressão por prevenção e acolhimento",
      "Dificuldade de articulação intersetorial",
    ],
    outcomes: [
      "Psicoeducação estruturada para servidores",
      "Governança com painéis de acompanhamento",
      "Modelo replicável alinhado ao Decreto 47.412",
    ],
    cta: "Preparar Reunião Institucional",
    ctaRoute: "cta_public_meeting",
    microcopy: "Considera o Decreto 47.412/2025 como referência. Evidência e governança.",
  },
];

interface SegmentSelectorProps {
  ctaHref?: string;
}

export default function SegmentSelector({ ctaHref = "#pricing" }: SegmentSelectorProps) {
  const [active, setActive] = useState(segments[1].id);
  const seg = segments.find(s => s.id === active)!;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {segments.map(s => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "border border-border bg-card hover:border-primary/30"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{s.label}</span>
              <span className={`text-[10px] ${isActive ? "" : "text-muted-foreground"}`}>({s.size})</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-6">
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-destructive uppercase tracking-wider mb-2">Dores comuns</h4>
              <ul className="space-y-2">
                {seg.pains.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-destructive mt-0.5">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-success uppercase tracking-wider mb-2">Resultados esperados</h4>
              <ul className="space-y-2">
                {seg.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" aria-hidden="true" /> {o}
                  </li>
                ))}
              </ul>
            </div>

            <a href={ctaHref} className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-glow hover:shadow-lg transition-all whitespace-nowrap">
              {seg.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <p className="text-[10px] text-muted-foreground italic">{seg.microcopy}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
