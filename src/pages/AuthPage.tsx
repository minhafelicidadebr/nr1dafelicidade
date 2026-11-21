import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { supabaseRuntimeAvailability } from "@/lib/runtime/appSupabaseClient";
import { useNavigate, useSearchParams, Link } from "@/lib/router/compat";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { IFT_BRAND_ASSETS } from "@/data/brandAssets";
import {
  provisionPendingIfAny,
  SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE,
} from "@/lib/signup";
import { SyntheticRuntimeNotice } from "@/components/signup/SignupShell";

type Role = "sst" | "manager" | "collaborator" | null;

function redirectFor(role: Role, intent: string | null): string {
  if (intent === "cycle") return "/app/cycles";
  if (intent === "nr1") return "/app";
  if (role === "collaborator") return "/signup/collaborator";
  return "/app";
}

export default function AuthPage() {
  const accessBlocked = !supabaseRuntimeAvailability.available;
  const [searchParams] = useSearchParams();
  const intent = searchParams.get("intent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>(IFT_BRAND_ASSETS.officialHorizontalLogoUrl);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessBlocked) {
      toast.error(SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: sess } = await supabase.auth.getSession();
      let userRole: Role = null;
      if (sess.session?.user) {
        const { data: prof } = await supabase
          .from("profiles").select("persona, role").eq("id", sess.session.user.id).maybeSingle();
        userRole = ((prof?.persona ?? prof?.role) as Role) ?? null;
      }
      // Provision any pending org/join from previous signup that required email confirmation
      const res = await provisionPendingIfAny();
      if (res.created && res.inviteCode) {
        toast.success("Empresa provisionada! Código de convite: " + res.inviteCode);
        navigate("/app/company?welcome=1");
        return;
      }
      if (res.created) {
        toast.success("Cadastro da organização concluído com sucesso.");
        navigate("/app/company?welcome=1");
        return;
      }
      if (res.pendingFound && res.error) {
        toast.error(res.error);
      } else {
        toast.success("Bem-vindo(a) de volta!");
      }
      navigate(redirectFor(userRole, intent));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao entrar. Tente novamente.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card shadow-elevated overflow-hidden"
        >
          <div className="relative bg-slate-900 dark:bg-slate-950 p-8 text-center text-white overflow-hidden border-b border-border/60">
            <div className="absolute inset-0 dot-pattern-light opacity-[0.06]" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 18% 20%, rgba(20, 184, 166, 0.32), transparent 55%), radial-gradient(circle at 82% 10%, rgba(245, 158, 11, 0.25), transparent 50%)",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col items-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2.5 shadow-md ring-1 ring-black/5 transition-transform hover:scale-[1.01]"
                title={IFT_BRAND_ASSETS.institutionName}
              >
                <img
                  src={logoSrc}
                  alt={IFT_BRAND_ASSETS.institutionName}
                  onError={() => {
                    if (logoSrc !== IFT_BRAND_ASSETS.localFullLogoUrl) {
                      setLogoSrc(IFT_BRAND_ASSETS.localFullLogoUrl);
                    }
                  }}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <h1 className="mt-4 font-display text-xl font-bold text-white tracking-tight">
                Entrar na plataforma
              </h1>
              <p className="text-xs text-slate-300 mt-1.5">
                Continue de onde parou
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {accessBlocked && <SyntheticRuntimeNotice operation="acesso" />}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail corporativo" required aria-label="E-mail"
                disabled={accessBlocked}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha" required minLength={6} aria-label="Senha"
                disabled={accessBlocked}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                disabled={accessBlocked}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button type="submit" disabled={loading || accessBlocked}
              aria-describedby={accessBlocked ? "synthetic-runtime-notice" : undefined}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-hero px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-50">
              {loading
                ? "Entrando..."
                : accessBlocked
                  ? "Acesso indisponível nesta demonstração"
                  : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs space-y-2">
              <p className="font-semibold text-foreground">
                Segunda opção · Acesso direto à demonstração sintética (/app)
              </p>
              <p className="text-muted-foreground">
                O banco remoto permanece bloqueado no Gate G0/G1 (sem coleta de dados reais). Acesse o Dashboard completo em modo sintético local:
              </p>
              <Link
                to="/app"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-card px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                Abrir Dashboard NR-1 em Modo Sintético
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="inline h-3.5 w-3.5 text-primary mr-1" />
              Colaboradores não criam conta — usem o link anônimo da sua empresa em{" "}
              <Link to="/signup/collaborator" className="text-primary font-semibold hover:underline">/signup/collaborator</Link>.
            </div>

            <p className="text-center text-xs text-muted-foreground pt-2">
              {accessBlocked ? (
                <Link to="/planos" className="text-primary font-semibold hover:underline">
                  Conhecer o Sprint assistido
                </Link>
              ) : (
                <>
                  Não tem conta?{" "}
                  <Link to="/signup" className="text-primary font-semibold hover:underline">
                    Criar conta
                  </Link>
                </>
              )}
            </p>
          </form>
        </motion.div>

        <p className="text-center text-[10px] text-muted-foreground mt-4">
          Ao entrar, você concorda com os Termos de Uso e a Política de Privacidade.
        </p>
      </div>
    </div>
  );
}
