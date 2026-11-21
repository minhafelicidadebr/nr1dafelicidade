import { useState } from "react";
import { useNavigate, Link } from "@/lib/router/compat";
import { Hash, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { supabaseRuntimeAvailability } from "@/lib/runtime/appSupabaseClient";
import { SyntheticRuntimeNotice } from "@/components/signup/SignupShell";
import iftLogoFull from "@/assets/ift-logo-full.png";

function extractToken(raw: string): string | null {
  const cleaned = raw.trim();
  if (!cleaned) return null;
  const urlMatch = cleaned.match(/respond\/([a-zA-Z0-9-]{8,})/);
  const candidate = (urlMatch ? urlMatch[1] : cleaned).replace(/[^a-zA-Z0-9-]/g, "");
  return candidate.length >= 8 ? candidate : null;
}

export default function SignupCollaboratorPage() {
  const nav = useNavigate();
  const runtimeBlocked = !supabaseRuntimeAvailability.available;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (runtimeBlocked) return;
    const token = extractToken(input);
    if (!token) { setError("Cole o link completo da pesquisa ou o código de convite."); return; }
    setLoading(true);
    const { data, error: rpcErr } = await supabase.rpc("invitation_lookup", { _token: token });
    setLoading(false);
    if (rpcErr || !data || data.length === 0) {
      setError("Convite não encontrado. Confira o link com o RH ou o profissional de SST.");
      return;
    }
    const inv = data[0] as { expired: boolean; uses_remaining: number };
    if (inv.expired) return setError("Este convite expirou.");
    if (inv.uses_remaining <= 0) return setError("Este convite já foi utilizado.");
    nav(`/respond/${token}`);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-60" aria-hidden />
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        <aside className="hidden lg:block">
          <Link to="/"><img src={iftLogoFull} alt="" className="h-14 w-auto" /></Link>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <ShieldCheck className="h-3.5 w-3.5" /> Resposta protegida · saídas coletivas sujeitas ao limiar vigente
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-foreground">
            Sua voz <span className="text-primary">importa</span>.
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Colaboradores <strong className="text-foreground">não precisam criar conta</strong> para responder à pesquisa.
            A resposta acontece por link anônimo enviado pela sua empresa. Sua identidade nunca é vinculada às respostas.
          </p>
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <Heart className="h-4 w-4 text-primary" /> Demora menos de 10 minutos.
          </div>
        </aside>

        <section className="w-full">
          <Link to="/" className="lg:hidden"><img src={iftLogoFull} alt="" className="h-10 w-auto" /></Link>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
            Participar da pesquisa
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cole o link recebido ou o código de convite enviado pela sua empresa.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {runtimeBlocked && <SyntheticRuntimeNotice operation="pesquisa" />}
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Link ou código</span>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Hash className="h-4 w-4" />
                </span>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="https://…/respond/ABC123… ou ABC123…"
                  disabled={runtimeBlocked}
                  aria-describedby={runtimeBlocked ? "synthetic-runtime-notice" : undefined}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pl-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60" />
              </div>
            </label>

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <button type="submit" disabled={loading || runtimeBlocked}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60">
              {loading
                ? "Verificando…"
                : runtimeBlocked
                  ? "Pesquisa indisponível nesta demonstração"
                  : <>Iniciar pesquisa anônima <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/signup" className="hover:text-foreground">← Voltar</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
