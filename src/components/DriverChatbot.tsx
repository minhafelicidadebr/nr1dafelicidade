import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Sparkles,
  BookCheck,
  ShieldCheck,
  Table2,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AIRichMarkdown from "@/components/AIRichMarkdown";
import { driverAvatars } from "@/lib/driverAvatars";
import { dataFetch } from "@/lib/runtime/dataGate";
import {
  getPlaybook2InterventionsByDriver,
  interventionScopeLabelPt,
  retrievePlaybook2RagResponse,
} from "@/lib/governance/playbook2RagEngine";
import {
  initFemaleVoicePreloader,
  selectStrictFemalePortugueseVoice,
} from "@/lib/speech/femalePortugueseVoice";
import { computePhoneticViseme } from "@/data/driverAcademyHostScripts";
import { LiderClaraCutoutAvatar } from "@/components/driver/DriverAcademyHollywoodHost";

type Msg = { role: "user" | "assistant"; content: string };

interface DriverChatbotProps {
  driverSlug: string;
  driverName: string;
}

const chatbotMeta: Record<string, { name: string; greeting: string; quickPrompts: readonly string[] }> = {
  management: {
    name: "Líder Clara",
    greeting:
      "Olá! Sou a **Líder Clara**, sua assistente de aprendizagem em **Gestão & Liderança** ancorada no *Work Wellbeing Playbook 2.0*.\n\nPara facilitar sua jornada com clareza visual, organizei abaixo os **3 eixos de práticas recomendadas** desta academia:\n\n| Eixo de Aprendizagem | Foco Organizacional | Referência Playbook 2.0 |\n| :--- | :--- | :--- |\n| **01. Capacitação & Desenvolvimento** | Metas claras, feedback estruturado e suporte | Slemp et al. (2018); Nielsen et al. (2017) |\n| **02. Redução do Estresse do Gestor** | Redesenho de carga administrativa e apoio | Stansfeld et al. (2015); Hammer et al. (2011) |\n| **03. Inteligência Emocional (EI)** | Escuta empática, regulação e clima seguro | Kotsou et al. (2019); Hodzic et al. (2018) |\n\n💡 **Como podemos começar?** Clique em qualquer prática da matriz acima ou escolha uma pergunta abaixo para explorarmos juntos!",
    quickPrompts: [
      "Quais intervenções o Playbook 2.0 recomenda para reduzir o estresse do gestor?",
      "Como desenvolver Inteligência Emocional (EI) na liderança segundo as referências?",
      "Como conectar este driver às subescalas do COPSOQ II e ao Guia MTE 2026?",
    ],
  },
  trust: {
    name: "Capitã Confiança",
    greeting:
      "Olá! 🛡️ Sou a **Capitã Confiança**, uma assistente de aprendizagem sobre confiança e segurança psicológica.\n\nPodemos explorar práticas do *Playbook 2.0* que ampliam segurança psicológica (Edmondson), comunicação multicanal transparente e RSC participativa, sem tirar conclusões sobre indivíduos.\n\n💡 *Que situação de confiança ou comunicação você quer explorar?*",
    quickPrompts: [
      "Como construir um clima de Segurança Psicológica segundo o Playbook 2.0?",
      "Qual o papel das reuniões 1:1 e da comunicação transparente na confiança?",
      "Quais subescalas do COPSOQ II monitoram confiança e justiça?",
    ],
  },
  stress: {
    name: "Dr. Equilíbrio",
    greeting:
      "Olá! ⚡ Sou o **Dr. Equilíbrio**, uma assistente de aprendizagem sobre estressores ocupacionais.\n\nVamos olhar para prevenção multinível do estresse e burnout (redesenho organizacional + gestão + recursos) segundo o *Playbook 2.0*, sem diagnosticar ninguém.\n\n💡 *Qual aspecto da rotina merece ser investigado com mais cuidado?*",
    quickPrompts: [
      "Como funciona a prevenção multinível do estresse e burnout no Playbook 2.0?",
      "Por que redesenhar processos vem antes de ações individuais isoladas?",
      "Como articular este driver com a AEP (NR-17) e o Guia MTE 2026?",
    ],
  },
  support: {
    name: "Mentor Apoio",
    greeting:
      "Olá! 🤝 Sou o **Mentor Apoio**, uma assistente de aprendizagem sobre redes de suporte.\n\nPodemos mapear práticas de liderança pró-social, apoio entre pares e comportamentos familiares suportivos (FSSB) citados no *Playbook 2.0*.\n\n💡 *Como as pessoas costumam pedir e oferecer apoio hoje?*",
    quickPrompts: [
      "O que é treinamento de liderança pró-social no Playbook 2.0?",
      "Como funcionam os comportamentos familiares suportivos (FSSB)?",
      "Como estruturar suporte entre pares e mentoria com segurança?",
    ],
  },
  energy: {
    name: "Guardião da Energia",
    greeting:
      "Olá! 🔋 Sou o **Guardião da Energia**, uma assistente de aprendizagem sobre recuperação e condições de trabalho.\n\nVamos explorar pausas, *job crafting* e por que o *Playbook 2.0* (Fleming, 2024) destaca que condições reais de trabalho vêm antes de programas isolados.\n\n💡 *Como é a rotina que você quer compreender melhor?*",
    quickPrompts: [
      "Por que programas isolados falham se as condições de trabalho não mudarem?",
      "Como aplicar job crafting e pausas de recuperação na prática?",
      "Quais subescalas do COPSOQ II acompanham energia e vitalidade?",
    ],
  },
  inclusion_belonging: {
    name: "Embaixadora da Inclusão",
    greeting:
      "Olá! 🌈 Sou a **Embaixadora da Inclusão**, uma assistente de aprendizagem sobre diversidade, inclusão e pertencimento.\n\nPodemos refletir sobre mitigação de vieses em seleção/promoção, mentoria/sponsorship e equidade no trabalho flexível segundo o *Playbook 2.0*.\n\n💡 *Que experiência de participação você quer explorar?*",
    quickPrompts: [
      "Qual a diferença entre Diversidade, Inclusão e Pertencimento no Playbook 2.0?",
      "Quais intervenções reduzem vieses em contratação e promoção?",
      "Como mentoria e sponsorship apoiam grupos sub-representados?",
    ],
  },
  compensation: {
    name: "Arquiteto da Justiça",
    greeting:
      "Olá! ⚖️ Sou o **Arquiteto da Justiça**, uma assistente de aprendizagem sobre remuneração digna e equidade.\n\nVamos organizar perguntas sobre *living wage*, transparência salarial e justiça processual com base no *Playbook 2.0*.\n\n💡 *Qual prática de recompensas você deseja colocar em perspectiva?*",
    quickPrompts: [
      "O que o Playbook 2.0 evidencia sobre salário digno (living wage) e saúde?",
      "Como políticas de transparência salarial reduzem disparidades?",
      "Como conectar justiça remuneratória às subescalas do COPSOQ II?",
    ],
  },
  flexibility: {
    name: "Navegadora do Tempo",
    greeting:
      "Olá! 🧭 Sou a **Navegadora do Tempo**, uma assistente de aprendizagem sobre flexibilidade e organização do trabalho.\n\nPodemos observar trabalho híbrido/remoto, ergonomia doméstica, colaboração presencial intencional e direito à desconexão digital segundo o *Playbook 2.0*.\n\n💡 *Como o tempo e o local de trabalho são organizados hoje?*",
    quickPrompts: [
      "Quais são os 3 cuidados críticos do Playbook 2.0 para o trabalho remoto/híbrido?",
      "Como equilibrar dias presenciais colaborativos e política de desconexão digital?",
      "Como oferecer flexibilidade equitativa para funções operacionais?",
    ],
  },
  learning: {
    name: "Mestra do Saber",
    greeting:
      "Olá! 📚 Sou a **Mestra do Saber**, uma assistente de aprendizagem sobre desenvolvimento.\n\nVamos identificar oportunidades de aprendizagem integrada à rotina, análise de necessidades e autonomia segundo o *Playbook 2.0*.\n\n💡 *Que aprendizagem é mais importante para seu contexto?*",
    quickPrompts: [
      "Como integrar a aprendizagem na rotina diária de trabalho segundo o Playbook 2.0?",
      "Qual a relação entre autonomia na tarefa e transferência de aprendizado?",
      "Quais subescalas do COPSOQ II medem possibilidades de desenvolvimento?",
    ],
  },
  purpose: {
    name: "Guardião do Propósito",
    greeting:
      "Olá! 🧿 Sou o **Guardião do Propósito**, uma assistente de aprendizagem sobre significado no trabalho.\n\nPodemos explorar como conectar tarefas aos beneficiários reais e traduzir a missão em marcos concretos segundo o *Playbook 2.0*.\n\n💡 *O que você gostaria de conectar ao significado do trabalho?*",
    quickPrompts: [
      "Como o contato com beneficiários fortalece o significado do trabalho?",
      "Como traduzir a missão institucional em metas concretas (estudo NASA/Carton)?",
      "Qual o limite ético para não usar propósito como justificativa de sobrecarga?",
    ],
  },
  appreciation: {
    name: "Estrela do Reconhecimento",
    greeting:
      "Olá! ⭐ Sou a **Estrela do Reconhecimento**, uma assistente de aprendizagem sobre valorização.\n\nVamos explorar o protocolo **SAGE** (*Specific, Appropriate, Genuine, Equitably distributed*) e o Quociente de Decência (DQ) do *Playbook 2.0*.\n\n💡 *Como o reconhecimento acontece hoje?*",
    quickPrompts: [
      "Como aplicar o protocolo SAGE de reconhecimento do Playbook 2.0?",
      "O que é o Quociente de Decência (DQ) e como ele apoia a saúde no trabalho?",
      "Como evitar que recompensas gerem competição predatória ou injustiça?",
    ],
  },
  achievement: {
    name: "Capitão Resultado",
    greeting:
      "Olá! 🎯 Sou o **Capitão Resultado**, uma assistente de aprendizagem sobre metas e realização.\n\nPodemos organizar perguntas sobre metas cooperativas, progresso diário e co-desenvolvimento de avaliações segundo o *Playbook 2.0*.\n\n💡 *Que processo de metas ou feedback você quer explorar?*",
    quickPrompts: [
      "Como desenhar metas que incentivem cooperação em vez de competição interna?",
      "Por que co-desenvolver o processo de avaliação de desempenho com a equipe?",
      "Como o Princípio do Progresso sustenta a realização cotidiana?",
    ],
  },
  job_security: {
    name: "Guardiã da Estabilidade",
    greeting:
      "Olá! 🛡️ Sou a **Guardiã da Estabilidade**, assistente do novo driver **Segurança no Trabalho (Job Security)** do *Work Wellbeing Playbook 2.0*.\n\nPodemos explorar a diferença entre segurança real e percebida, mercados internos de trabalho, gestão cuidadosa de mudanças, retorno ao trabalho e prevenção de demissões frente à IA.\n\n💡 *Qual dimensão de segurança e estabilidade você quer investigar?*",
    quickPrompts: [
      "Qual a diferença entre segurança real e segurança percebida no Playbook 2.0?",
      "Como mercados internos de trabalho e integração de terceirizados reduzem a precariedade?",
      "Como prevenir demissões com requalificação em IA e evitar a síndrome do sobrevivente?",
    ],
  },
  employee_voice: {
    name: "Voz Democrática",
    greeting:
      "Olá! 🗣️ Sou a **Voz Democrática**, assistente do driver **Voz do Trabalhador (Employee Voice)** do *Playbook 2.0*.\n\nVamos explorar Comitês de Saúde e Bem-Estar (HaWCs), escuta participativa e articulação com a CIPA nos 4 momentos do Guia MTE 2026.\n\n💡 *Como a voz dos trabalhadores é ouvida e transformada em ação hoje?*",
    quickPrompts: [
      "Como funcionam os Comitês de Saúde e Bem-Estar (HaWCs) no Playbook 2.0?",
      "Como evitar o silenciamento e garantir devolutiva após pesquisas e escutas?",
      "Como conectar Employee Voice aos 4 momentos de participação do Guia MTE 2026?",
    ],
  },
  autonomy: {
    name: "Arquiteta da Autonomia",
    greeting:
      "Olá! 🎛️ Sou a **Arquiteta da Autonomia**, assistente do driver **Autonomia (Autonomy)** do *Playbook 2.0*.\n\nPodemos explorar o redesenho participativo do trabalho, margem de decisão sobre métodos/ritmo e liderança suportiva à autonomia.\n\n💡 *Onde sua equipe precisa de maior margem de decisão e suporte?*",
    quickPrompts: [
      "Como conduzir intervenções participativas de redesenho do trabalho?",
      "Qual a diferença entre suporte à autonomia e abandono gerencial?",
      "Como a influência no trabalho (SUB-05) amortece exigências no COPSOQ II?",
    ],
  },
  workload_pressures: {
    name: "Regulador de Carga",
    greeting:
      "Olá! ⏱️ Sou o **Regulador de Carga**, assistente do driver **Pressões de Carga de Trabalho (Workload Pressures)** do *Playbook 2.0*.\n\nVamos explorar dimensionamento realista de demandas, higiene de reuniões (encontros curtos, pautas prévias e blocos de foco) e ritmo sustentável.\n\n💡 *Qual fonte de sobrecarga ou pressão de tempo merece revisão técnica?*",
    quickPrompts: [
      "Quais práticas de reuniões reduzem a fadiga cognitiva segundo Bennett et al. (2021)?",
      "Como equilibrar redução de horas improdutivas sem comprimir o ritmo de trabalho?",
      "Quais subescalas do COPSOQ II e requisitos MTE 2026 avaliam sobrecarga?",
    ],
  },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/driver-chat`;

export default function DriverChatbot({ driverSlug, driverName }: DriverChatbotProps) {
  const meta = chatbotMeta[driverSlug] || chatbotMeta.management;
  const avatar = driverAvatars[driverSlug] ?? driverAvatars.management;
  const driverInterventions = getPlaybook2InterventionsByDriver(driverSlug);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: meta.greeting },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ragStrictMode, setRagStrictMode] = useState(true);
  const [showPracticesMatrix, setShowPracticesMatrix] = useState(true);

  // Estado de síntese de voz feminina e sincronia labial no chatbot
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string>("a");
  const [speakingPhase, setSpeakingPhase] = useState<number>(0.5);
  const voiceTimerRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = initFemaleVoicePreloader();
    return cleanup;
  }, []);

  const stopChatbotSpeech = useCallback(() => {
    if (voiceTimerRef.current !== null) {
      window.clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Fallback silencioso
      }
    }
    setSpeakingMessageIdx(null);
  }, []);

  useEffect(() => {
    stopChatbotSpeech();
    setMessages([
      {
        role: "assistant",
        content: (chatbotMeta[driverSlug] || chatbotMeta.management).greeting,
      },
    ]);
  }, [driverSlug, stopChatbotSpeech]);

  useEffect(() => {
    return () => {
      stopChatbotSpeech();
    };
  }, [stopChatbotSpeech]);

  useEffect(() => {
    const container = scrollRef.current;
    container?.scrollTo?.({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const speakMessageWithFemaleVoice = (msgIdx: number, rawMarkdown: string) => {
    if (speakingMessageIdx === msgIdx) {
      stopChatbotSpeech();
      return;
    }
    stopChatbotSpeech();

    // Limpa marcações Markdown e símbolos de tabela para leitura fluida
    const cleanSpeechText = rawMarkdown
      .replace(/\|/g, " ")
      .replace(/[:*-]{3,}/g, " ")
      .replace(/[#*_`~[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const words = cleanSpeechText.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    setSpeakingMessageIdx(msgIdx);
    let elapsedMs = 0;
    const msPerWord = 290;
    const tickMs = 50;

    voiceTimerRef.current = window.setInterval(() => {
      elapsedMs += tickMs;
      const wIdx = Math.floor(elapsedMs / msPerWord);
      const phase = (elapsedMs % msPerWord) / msPerWord;
      if (wIdx >= words.length) {
        stopChatbotSpeech();
        return;
      }
      setSpeakingWord(words[wIdx] ?? "a");
      setSpeakingPhase(phase);
    }, tickMs);

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined"
    ) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
        const femaleSelection = selectStrictFemalePortugueseVoice(
          window.speechSynthesis.getVoices(),
        );
        utterance.lang = femaleSelection.lang;
        utterance.pitch = femaleSelection.recommendedPitch;
        utterance.rate = femaleSelection.recommendedRate;
        if (femaleSelection.voice) {
          utterance.voice = femaleSelection.voice;
        }
        utterance.onend = () => {
          stopChatbotSpeech();
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        // Mantém animação visual se áudio não estiver disponível
      }
    }
  };

  const currentChatViseme = computePhoneticViseme(
    speakingWord,
    speakingPhase,
    speakingMessageIdx !== null,
  );

  const executePrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;
    stopChatbotSpeech();
    const userMsg: Msg = { role: "user", content: promptText.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    if (ragStrictMode) {
      const ragResult = retrievePlaybook2RagResponse({
        query: promptText,
        driverSlug,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: ragResult.groundedMarkdownResponse },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await dataFetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          driverSlug,
          driverName,
        }),
      });

      if (!resp.ok || !resp.body) {
        const ragFallback = retrievePlaybook2RagResponse({
          query: promptText,
          driverSlug,
        });
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: ragFallback.groundedMarkdownResponse },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > newMessages.length) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: m.content + content } : m,
                  );
                }
                return [...prev, { role: "assistant", content }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch {
      const ragFallback = retrievePlaybook2RagResponse({
        query: promptText,
        driverSlug,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: ragFallback.groundedMarkdownResponse },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[660px] rounded-2xl border border-border bg-card overflow-hidden shadow-card">
      {/* Header com a mesma personagem Hiper-Realista e controles executivos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-border bg-gradient-driver px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <LiderClaraCutoutAvatar
              imageUrl={avatar}
              hostName={meta.name}
              viseme={currentChatViseme}
              isPlaying={speakingMessageIdx !== null}
              size="chat-header"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-success border-2 border-card" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-foreground">
              {meta.name}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Assistente de IA para exploração pedagógica · {driverName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
          {driverInterventions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPracticesMatrix((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-border bg-background/80 text-foreground hover:border-primary/40 transition-colors"
              title="Exibir ou recolher a Matriz Executiva de Práticas Recomendadas"
            >
              <Table2 className="h-3.5 w-3.5 text-primary" />
              <span>Matriz de Práticas ({driverInterventions.length})</span>
              {showPracticesMatrix ? (
                <ChevronUp className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setRagStrictMode((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
              ragStrictMode
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
            title="Alternar entre respostas diretas do guia de boas práticas ou conversa ampliada"
          >
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {ragStrictMode ? "Baseado no Guia Prático" : "Conversa Ampliada"}
          </button>
        </div>
      </div>

      {/* Matriz Executiva Compacta de Práticas Recomendadas (Tipografia Tabular Limpa) */}
      {showPracticesMatrix && driverInterventions.length > 0 && (
        <div className="border-b border-border bg-muted/10 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-foreground">
              Matriz de Práticas Recomendadas — {driverName}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Work Wellbeing Playbook 2.0
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground">
                  <th className="py-2 px-3">Prática Recomendada</th>
                  <th className="py-2 px-3 hidden sm:table-cell">Escopo</th>
                  <th className="py-2 px-3 hidden md:table-cell">Subescalas COPSOQ II</th>
                  <th className="py-2 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {driverInterventions.map((rec, idx) => (
                  <tr
                    key={rec.interventionId}
                    className="hover:bg-muted/25 transition-colors"
                  >
                    <td className="py-2 px-3 font-medium text-foreground">
                      <span className="font-mono tabular-nums text-muted-foreground mr-2">
                        0{idx + 1}.
                      </span>
                      <span>{rec.titlePt}</span>
                    </td>
                    <td className="py-2 px-3 hidden sm:table-cell text-muted-foreground">
                      {interventionScopeLabelPt(rec.scope)}
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell font-mono tabular-nums text-[11px] text-muted-foreground">
                      {rec.copsoqShortSubscaleCodes.join(", ")}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          executePrompt(
                            `Apresente em detalhes a prática recomendada "${rec.titlePt}" do Playbook 2.0 com ações práticas e estudos de referência.`,
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Detalhar no Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Prompt Suggested Questions */}
      <div className="border-b border-border/60 bg-muted/20 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary shrink-0 pr-1">
          <BookCheck className="h-3 w-3" aria-hidden="true" />
          Sugestões:
        </span>
        {meta.quickPrompts.map((qp) => (
          <button
            key={qp}
            type="button"
            onClick={() => executePrompt(qp)}
            disabled={isLoading}
            className="shrink-0 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const isThisMsgSpeaking = speakingMessageIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <LiderClaraCutoutAvatar
                    imageUrl={avatar}
                    hostName={meta.name}
                    viseme={currentChatViseme}
                    isPlaying={isThisMsgSpeaking}
                    size="chat-message"
                  />
                )}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "border border-border bg-muted/50 rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/60">
                        <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {meta.name} · Orientação Estruturada
                        </span>
                        <button
                          type="button"
                          onClick={() => speakMessageWithFemaleVoice(i, msg.content)}
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                            isThisMsgSpeaking
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:text-foreground"
                          }`}
                          title="Ouvir esta resposta com voz feminina em português"
                        >
                          {isThisMsgSpeaking ? (
                            <>
                              <VolumeX className="h-3 w-3" />
                              Pausar Voz Feminina
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3" />
                              Ouvir (Voz Feminina)
                            </>
                          )}
                        </button>
                      </div>
                      <AIRichMarkdown content={msg.content} />
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executePrompt(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Tire uma dúvida ou peça ideias práticas sobre ${driverName}...`}
            aria-label={`Mensagem para ${meta.name}`}
            className="flex-1 min-h-[42px] rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            aria-label="Enviar pergunta"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Use para explorar perguntas de aprendizagem. Não inclua dados pessoais ou relatos identificáveis; respostas podem conter imprecisões e não substituem avaliação técnica.
        </p>
      </div>
    </div>
  );
}
