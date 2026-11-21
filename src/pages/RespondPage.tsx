import { useEffect, useState } from "react";
import { Link, useParams } from "@/lib/router/compat";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { supabaseRuntimeAvailability } from "@/lib/runtime/appSupabaseClient";
import { SyntheticRuntimeNotice } from "@/components/signup/SignupShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { copsoqItems, scaleFor, aggregateDimensions, summarizeOutcomes } from "@/data/copsoqData";
import { getSurveySupportNote } from "@/data/q1Nr1PromotionCatalog";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Volume2, VolumeX, Info } from "lucide-react";

type InvitationContext = {
  invalid?: boolean;
  used?: boolean;
  expired?: boolean;
  can_respond?: boolean;
  cycle_name?: string;
  org_name?: string;
  is_demo?: boolean;
};

export default function RespondPage() {
  const { token = "" } = useParams();
  const [context, setContext] = useState<InvitationContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!supabaseRuntimeAvailability.available) return;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("validate_invitation", { _token: token });
        if (error || !data?.length) {
          setContext({
            can_respond: true,
            cycle_name: "Ciclo Demonstrativo NR-01 · Bem-Estar no Trabalho",
            org_name: "Ambiente de Demonstração Guiada (k >= 5)",
            is_demo: true,
          });
        } else {
          setContext(data[0]);
        }
      } catch {
        setContext({
          can_respond: true,
          cycle_name: "Ciclo Demonstrativo NR-01 · Bem-Estar no Trabalho",
          org_name: "Ambiente de Demonstração Guiada (k >= 5)",
          is_demo: true,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [index]);

  const total = copsoqItems.length;
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / total) * 100);
  const currentItem = index >= 0 && index < total ? copsoqItems[index] : null;
  const reviewing = index >= total;

  function toggleReadAloud() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Síntese de voz não suportada neste navegador.");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!currentItem) return;

    const optionsText = scaleFor(currentItem.type)
      .map((opt, idx) => `Opção ${idx + 1}: ${opt.label}`)
      .join(". ");
    const supportNote = getSurveySupportNote(currentItem.section);
    const fullSpeech = `Bloco: ${currentItem.section}. Pergunta ${index + 1} de ${total}: ${currentItem.text}. ${supportNote}. Opções de resposta: ${optionsText}.`;

    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.lang = "pt-BR";
    utterance.rate = 0.98;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  async function submit() {
    if (!acknowledged) {
      toast.error("Confirme que leu o aviso e deseja participar voluntariamente.");
      return;
    }
    if (answered < total) {
      toast.error(`Existem respostas pendentes (${answered}/${total}).`);
      return;
    }

    if (context?.is_demo) {
      setDone(true);
      toast.success("Resposta demonstrativa registrada com proteção de anonimato.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.rpc("submit_response", {
      _token: token,
      _answers: aggregateDimensions(answers) as any,
      _meta: {
        instrument_key: "exploratory_psychosocial_screening",
        instrument_version: "0.1.0-draft",
        raw_items: answers,
        derived_outcomes: summarizeOutcomes(answers),
      } as any,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
  }

  if (loading) return <Centered>Carregando convite…</Centered>;
  if (context?.invalid) return <Centered>Convite inválido.</Centered>;
  if (context?.used) return <Centered>Este convite já foi utilizado.</Centered>;
  if (context?.expired) return <Centered>Convite expirado.</Centered>;
  if (context?.can_respond === false) {
    return (
      <Centered>
        Esta campanha não está autorizada para respostas. O instrumento precisa estar versionado, licenciado,
        tecnicamente aprovado e habilitado no servidor.
      </Centered>
    );
  }

  if (done) {
    return (
      <Centered>
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="text-xl font-semibold">Resposta recebida com proteção de privacidade</h1>
          <p className="text-sm text-muted-foreground">
            Nenhum resultado individual é exibido à organização. Resultados coletivos dependem do limiar de
            privacidade (k &ge; 5) e da revisão técnica aplicável.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/app/cycles">Voltar aos Ciclos de Escuta</Link>
            </Button>
          </div>
        </div>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-2xl space-y-2 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">{context?.cycle_name ?? "Campanha"}</p>
                {context?.is_demo && (
                  <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                    Modo Demonstração
                  </Badge>
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">{context?.org_name ?? "Organização"}</p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {index < 0 ? "Aviso" : reviewing ? "Revisão" : `${index + 1}/${total}`}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" aria-label={`Progresso: ${progress}%`} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {index === -1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Antes de responder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                A participação é voluntária. Você pode sair antes do envio. Este questionário não realiza
                diagnóstico individual e não substitui AEP, AET, observação do trabalho real ou avaliação profissional.
              </p>
              <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <p>
                  <strong>Sem identificação nominal:</strong> esta pesquisa não solicita seu nome, CPF ou e-mail.
                  Respostas individuais ficam em cofre restrito ao serviço e a organização recebe somente saídas
                  coletivas de grupos com pelo menos 5 participantes (k &ge; 5).
                </p>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Recursos de Acessibilidade e Aplicação Assistida:</p>
                <p>
                  • Em cada pergunta você pode clicar no botão <strong>"Ouvir pergunta"</strong> para leitura em voz alta no seu aparelho.
                </p>
                <p>
                  • Abaixo do enunciado há uma <strong>Nota de apoio</strong> explicando o contexto da rotina a considerar, sem sugerir respostas.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Em caso de necessidade de acolhimento, denúncia ou urgência, utilize um canal independente desta pesquisa.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <Button onClick={() => setIndex(0)}>Iniciar questionário</Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/app/cycles">Voltar ao painel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentItem && (
          <Card>
            <CardHeader className="space-y-3">
              {/* Tarja de contexto da seção + Botão de leitura em voz alta */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Sobre: {currentItem.section}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant={speaking ? "default" : "outline"}
                  className="h-7 text-xs gap-1.5"
                  onClick={toggleReadAloud}
                >
                  {speaking ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" />
                      Parar leitura
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      Ouvir pergunta
                    </>
                  )}
                </Button>
              </div>

              <CardTitle className="text-lg leading-snug">{currentItem.text}</CardTitle>

              {/* Nota de apoio não-indutora (Benchmarking Q1 - Aplicação Assistida) */}
              <div className="flex items-start gap-2 rounded-md border border-border/70 bg-muted/25 p-2.5 text-xs text-muted-foreground italic">
                <Info className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5 not-italic" aria-hidden="true" />
                <p>{getSurveySupportNote(currentItem.section)}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2" role="radiogroup" aria-label={currentItem.text}>
                {scaleFor(currentItem.type).map((option) => {
                  const selected = answers[currentItem.id] === option.v;
                  return (
                    <button
                      key={option.v}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAnswers((current) => ({ ...current, [currentItem.id]: option.v }))}
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        selected ? "border-primary bg-primary/10 font-medium" : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
                  <ArrowLeft className="mr-1 h-4 w-4" />Voltar
                </Button>
                <Button
                  onClick={() => setIndex((value) => Math.min(total, value + 1))}
                  disabled={answers[currentItem.id] === undefined}
                >
                  Próxima<ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {reviewing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revisão e envio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Você respondeu {answered} de {total} itens. Revise se desejar. Após o envio, o token não poderá ser reutilizado.
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm">
                <Checkbox checked={acknowledged} onCheckedChange={(value) => setAcknowledged(Boolean(value))} />
                <span>
                  Li o aviso, compreendi a finalidade e os limites de privacidade e escolho participar voluntariamente.
                  Esta confirmação não define, por si só, a base legal do tratamento.
                </span>
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={() => setIndex(total - 1)}>
                  <ArrowLeft className="mr-1 h-4 w-4" />Revisar
                </Button>
                <Button onClick={submit} disabled={submitting || !acknowledged || answered < total} className="flex-1">
                  {submitting ? "Enviando…" : "Enviar resposta protegida"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg items-center p-4">
      <Card className="w-full"><CardContent className="pt-6">{children}</CardContent></Card>
    </div>
  );
}


