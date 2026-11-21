import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { dataFetch } from "@/lib/runtime/dataGate";

interface AIDynamicProps {
  driverName: string;
  driverSlug: string;
  dynamicType: "scenario" | "builder" | "debate" | "mindmap" | "roleplay" | "microlearning" | "digitaltwin";
  title: string;
  icon: string;
  startPrompt: string;
  iftReward: number;
  onComplete?: (ift: number) => void;
}

type Msg = { role: "user" | "assistant"; content: string };

const DYNAMIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/driver-dynamic`;

export default function AIDynamic({ driverName, driverSlug, dynamicType, title, icon, startPrompt, iftReward, onComplete }: AIDynamicProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const streamResponse = async (allMessages: Msg[], userInput?: string) => {
    setIsLoading(true);
    let assistantSoFar = "";

    try {
      const resp = await dataFetch(DYNAMIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          dynamicType,
          driverName,
          driverSlug,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          userInput,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Erro" }));
        setMessages((prev) => [...prev, { role: "assistant", content: `❌ ${err.error}` }]);
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

        let idx: number;
        while ((idx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && !userInput && prev.length === 1) {
                  return [{ ...last, content: assistantSoFar }];
                }
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Dynamic error:", e);
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Erro de conexão." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setMessages([]);
    streamResponse([], startPrompt);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    streamResponse(newMsgs);
  };

  const handleReset = () => {
    setStarted(false);
    setMessages([]);
  };

  if (!started) {
    return (
      <div className="text-center py-10 space-y-5">
        <span className="text-5xl block">{icon}</span>
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {dynamicType === "scenario" && "Cenários realistas de implementação com escolhas e consequências. Feedback por mecanismo + evidência."}
          {dynamicType === "builder" && "Monte seu plano de intervenção: inputs → atividades → métricas → riscos. O sistema valida e sugere melhorias."}
          {dynamicType === "debate" && "Debate socrático guiado por IA: prós, contras, evidências e limitações. Gera mapa de argumentos."}
          {dynamicType === "mindmap" && "Co-crie um mapa mental científico: a IA expande ramos, conceitos e evidências em árvore neuropedagógica navegável."}
          {dynamicType === "roleplay" && "Dialogue simultaneamente com 3 personas (CEO, RH, Colaborador) sobre um dilema real e desenhe sua mediação."}
          {dynamicType === "microlearning" && "Pílulas de 60s com curva de esquecimento, active recall e intervalos espaçados (Ebbinghaus + Leitner)."}
          {dynamicType === "digitaltwin" && "Construa um gêmeo digital narrativo da sua organização. A IA aplica System Dynamics (Forrester/Sterman) + Agent-Based Modeling para projetar trajetórias em 6/12/24 meses, com tipping points, loops dominantes e bandas de incerteza."}
        </p>
        <button
          onClick={handleStart}
          className="rounded-xl bg-gradient-hero px-8 py-3 text-sm font-bold text-card shadow-glow hover:shadow-lg transition-all"
        >
          {dynamicType === "scenario" && "🎮 Iniciar Simulação"}
          {dynamicType === "builder" && "🏗️ Abrir Estúdio"}
          {dynamicType === "debate" && "⚔️ Entrar na Arena"}
          {dynamicType === "mindmap" && "🧭 Abrir Mapa Mental"}
          {dynamicType === "roleplay" && "🎭 Entrar em Cena"}
          {dynamicType === "microlearning" && "⚡ Iniciar Pílula"}
          {dynamicType === "digitaltwin" && "🧬 Calibrar Gêmeo Digital"}
        </button>
        <p className="text-[10px] text-muted-foreground">+{iftReward} IFT por dinâmica completa</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[480px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-bold flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <RotateCcw className="h-3 w-3" /> Reiniciar
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 rounded-xl border border-border bg-background/50 p-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${msg.role === "user" ? "flex justify-end" : ""}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_p]:mb-2 [&_ul]:mb-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 w-fit">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 mt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sua resposta..."
          className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
