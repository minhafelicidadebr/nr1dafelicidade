import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqItems = [
  {
    id: "faq_001",
    question: "Isso substitui avaliação clínica ou perícia?",
    answer: "Não. A plataforma opera com finalidade educacional, preventiva, organizacional e de gestão. Ela ajuda a identificar sinais, priorizar ações e orientar trilhas e relatórios. Não realiza diagnóstico clínico nem substitui profissionais de saúde mental.",
  },
  {
    id: "faq_002",
    question: "A plataforma garante conformidade automática com as normas?",
    answer: "Não. Ela apoia prontidão, evidências, governança e acompanhamento, mas a conformidade depende de implementação institucional e validação jurídica e técnica. A plataforma gera evidências documentadas que facilitam o processo de auditoria e certificação.",
  },
  {
    id: "faq_003",
    question: "Qual é o primeiro passo recomendado?",
    answer: "Mapear o contexto da sua organização, executar uma avaliação inicial de prontidão e definir um recorte sintético com critérios claros de sucesso. Nossa equipe pode guiar esse processo em uma reunião executiva de 45 minutos.",
  },
  {
    id: "faq_004",
    question: "Quanto tempo leva para implementar?",
    answer: "No estágio atual, a implementação começa por descoberta e simulação sintética. Piloto com dados reais, operação produtiva e suporte formal dependem de aprovações técnicas e jurídicas, DPA e aceite competente.",
  },
  {
    id: "faq_005",
    question: "Os dados dos colaboradores são protegidos?",
    answer: "Durante G1, dados reais de trabalhadores não estão habilitados. A oferta Design Partner usa contato comercial consentido e simulação sintética; qualquer piloto futuro exige base legal, retenção, DPA, revisão DPO/jurídica e controles de privacidade.",
  },
  {
    id: "faq_006",
    question: "É possível integrar com sistemas de RH existentes?",
    answer: "Integrações com HRIS, SSO, webhooks e BI permanecem no roadmap futuro. Elas somente podem ser contratadas após arquitetura aprovada, DPA, segurança, observabilidade e revisão formal.",
  },
  {
    id: "faq_007",
    question: "O que são os 12 drivers de bem-estar?",
    answer: "São os 12 drivers descritos no Work Wellbeing Playbook, publicado pela World Wellbeing Movement com colaboração acadêmica do Wellbeing Research Centre: Gestão, Confiança, Estresse, Suporte, Energia, Inclusão, Remuneração, Flexibilidade, Aprendizagem, Propósito, Reconhecimento e Realização. Essa referência não implica chancela deste produto.",
  },
  {
    id: "faq_008",
    question: "A plataforma funciona para o setor público?",
    answer: "Sim. A jornada pode considerar o Decreto 47.412/2025 (DF) como referência, com foco em psicoeducação, acolhimento digital, governança institucional e indicadores de política pública. O fluxo é adaptado para órgãos, secretarias, autarquias e fundações.",
  },
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2 max-w-3xl mx-auto">
      {faqItems.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="rounded-xl border border-border overflow-hidden transition-all hover:border-primary/20">
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex items-center justify-between w-full p-4 text-left gap-3"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-semibold">{item.question}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 pl-11">
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
