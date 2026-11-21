import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, BookOpen, Wrench, TrendingUp, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";

const dimensions = [
  {
    id: "data_diagnosis",
    label: "Diagnóstico",
    icon: BarChart3,
    question: "Sua organização possui algum diagnóstico formal de bem-estar ou riscos psicossociais?",
    options: [
      { label: "Não temos nenhum diagnóstico", score: 0 },
      { label: "Temos pesquisa de clima básica", score: 25 },
      { label: "Temos diagnóstico parcial (clima + SST)", score: 50 },
      { label: "Temos diagnóstico estruturado com indicadores", score: 75 },
      { label: "Temos diagnóstico contínuo com PERMA ou similar", score: 100 },
    ],
  },
  {
    id: "learning_capability",
    label: "Aprendizagem",
    icon: BookOpen,
    question: "Como sua organização capacita líderes e colaboradores em bem-estar no trabalho?",
    options: [
      { label: "Não temos capacitação específica", score: 0 },
      { label: "Palestras pontuais ou SIPAT", score: 25 },
      { label: "Treinamentos periódicos de RH", score: 50 },
      { label: "Programa estruturado com trilhas", score: 75 },
      { label: "Aprendizagem contínua com evidências e gamificação", score: 100 },
    ],
  },
  {
    id: "action_governance",
    label: "Ação & Governança",
    icon: Wrench,
    question: "Como sua organização implementa e governa ações de bem-estar?",
    options: [
      { label: "Ações isoladas sem coordenação", score: 0 },
      { label: "RH lidera com ações pontuais", score: 25 },
      { label: "Comitê ou grupo dedicado", score: 50 },
      { label: "Programa com metas e acompanhamento", score: 75 },
      { label: "Governança integrada com SST, RH e liderança", score: 100 },
    ],
  },
  {
    id: "evidence_reporting",
    label: "Evidências & Relatórios",
    icon: TrendingUp,
    question: "Como sua organização documenta e reporta ações de bem-estar?",
    options: [
      { label: "Sem documentação formal", score: 0 },
      { label: "Registros manuais básicos", score: 25 },
      { label: "Relatórios periódicos de RH", score: 50 },
      { label: "Dashboards com indicadores", score: 75 },
      { label: "Reporting executivo com rastreabilidade completa", score: 100 },
    ],
  },
];

const scoreBands = [
  { min: 0, max: 25, band: "inicial", label: "Fase Inicial", color: "text-destructive", bgColor: "bg-destructive/10", description: "Sua organização está no início da jornada. É o momento ideal para estruturar um diagnóstico e criar uma base sólida." },
  { min: 26, max: 50, band: "estruturacao", label: "Em Estruturação", color: "text-warning", bgColor: "bg-warning/10", description: "Existem iniciativas, mas falta integração e método. A plataforma pode acelerar significativamente sua evolução." },
  { min: 51, max: 75, band: "ativacao", label: "Em Ativação", color: "text-info", bgColor: "bg-info/10", description: "Sua organização tem bases sólidas. É hora de escalar com tecnologia, dados e gamificação." },
  { min: 76, max: 100, band: "governanca", label: "Governança Ativa", color: "text-success", bgColor: "bg-success/10", description: "Maturidade elevada. A plataforma pode apoiar evidências, revisões e melhoria contínua, sem substituir responsáveis ou garantir conformidade." },
];

interface Props {
  onComplete?: (totalScore: number, band: string) => void;
  ctaHref?: string;
}

export default function ReadinessCalculator({ onComplete, ctaHref = "#pricing" }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  const handleSelect = (dimensionId: string, score: number) => {
    const newScores = { ...scores, [dimensionId]: score };
    setScores(newScores);

    if (currentStep < dimensions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setCompleted(true);
      const total = Math.round(Object.values(newScores).reduce((a, b) => a + b, 0) / dimensions.length);
      const band = scoreBands.find(b => total >= b.min && total <= b.max) || scoreBands[0];
      onComplete?.(total, band.band);
    }
  };

  const totalScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / dimensions.length);
  const currentBand = scoreBands.find(b => totalScore >= b.min && totalScore <= b.max) || scoreBands[0];

  const reset = () => {
    setScores({});
    setCurrentStep(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${currentBand.bgColor} ${currentBand.color}`}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {currentBand.label}
          </div>
          <div className="mt-4 font-display text-5xl font-bold tabular-nums">{totalScore}<span className="text-lg text-muted-foreground">/100</span></div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">{currentBand.description}</p>
        </div>

        {/* Dimension breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {dimensions.map(d => {
            const s = scores[d.id] || 0;
            const Icon = d.icon;
            return (
              <div key={d.id} className="rounded-xl border border-border p-3 text-center">
                <Icon className="h-4 w-4 mx-auto text-primary mb-1" aria-hidden="true" />
                <p className="text-[11px] font-semibold">{d.label}</p>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s}%` }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-hero" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">{s}/100</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href={ctaHref} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:shadow-lg transition-all">
            Escolher próximo passo para o roadmap <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-all">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Refazer
          </button>
        </div>
      </motion.div>
    );
  }

  const dim = dimensions[currentStep];
  const Icon = dim.icon;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {dimensions.map((d, i) => (
          <div key={d.id} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full ${i <= currentStep ? "bg-primary" : "bg-muted"} transition-colors`} />
            <span className="text-[9px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dimensão {currentStep + 1} de {dimensions.length}</p>
              <h4 className="font-display text-sm font-bold">{dim.label}</h4>
            </div>
          </div>

          <p className="text-sm font-medium">{dim.question}</p>

          <div className="space-y-2">
            {dim.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(dim.id, opt.score)}
                className={`w-full text-left rounded-xl border p-3.5 text-xs transition-all hover:border-primary/40 hover:bg-primary/5 ${
                  scores[dim.id] === opt.score ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                    scores[dim.id] === opt.score ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
