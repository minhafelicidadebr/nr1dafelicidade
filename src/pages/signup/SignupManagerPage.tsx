import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router/compat";
import { Mail, Lock, User, Hash, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import {
  SignupShell,
  Field,
  SubmitBtn,
  SyntheticRuntimeNotice,
} from "@/components/signup/SignupShell";
import {
  signUpUser,
  joinOrgByCode,
  translateAuthError,
  setPendingProvision,
  clearPendingProvision,
  signupRuntimeAvailability,
  SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE,
} from "@/lib/signup";
import { supabase } from "@/lib/runtime/appSupabaseClient";

export default function SignupManagerPage() {
  const nav = useNavigate();
  const signupBlocked = !signupRuntimeAvailability.available;
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");
  const [sector, setSector] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [org, setOrg] = useState<{ name: string; sectors: string[] } | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupErr, setLookupErr] = useState<string | null>(null);

  useEffect(() => {
    if (signupBlocked) {
      setOrg(null);
      setLookupErr(null);
      return;
    }
    const c = code.trim().toUpperCase();
    if (c.length < 6) { setOrg(null); setLookupErr(null); return; }
    const t = setTimeout(async () => {
      setLookingUp(true); setLookupErr(null);
      const { data, error } = await supabase.rpc("find_org_by_invite_code", { _code: c });
      setLookingUp(false);
      if (error || !data || data.length === 0) {
        setOrg(null);
        setLookupErr("Código não encontrado. Confira com o profissional de SST.");
        return;
      }
      const r = data[0] as { name: string; sectors: string[] | null };
      setOrg({ name: r.name, sectors: r.sectors ?? [] });
    }, 400);
    return () => clearTimeout(t);
  }, [code, signupBlocked]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    if (signupBlocked) return setError(SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE);
    if (!org) return setError("Informe um código de empresa válido.");
    if (!sector) return setError("Selecione ou informe o seu setor.");
    if (password.length < 8) return setError("Senha deve ter no mínimo 8 caracteres.");
    if (password !== confirm) return setError("As senhas não conferem.");
    if (!accept) return setError("Você precisa aceitar os termos.");
    setLoading(true);

    setPendingProvision({ kind: "join", code: code.trim().toUpperCase(), persona: "manager", sector });

    try {
      const r = await signUpUser({ email, password, fullName, persona: "manager", sector });
      let session = r.session;
      if (!session) {
        const { data, error: e2 } = await supabase.auth.signInWithPassword({ email, password });
        if (e2 || !data.session) {
          setInfo("Conta criada. Confirme seu e-mail e faça login para vincular-se à empresa automaticamente.");
          setLoading(false);
          return;
        }
        session = data.session;
      }
      await joinOrgByCode(code.trim().toUpperCase(), "manager", sector);
      clearPendingProvision();
      nav("/app");
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SignupShell
      title="Cadastro de Gestor / RH"
      subtitle={signupBlocked
        ? "Jornada demonstrativa; nenhuma vinculação será enviada neste ambiente."
        : "Vincule-se à empresa com o código enviado pelo SST."}
    >
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {signupBlocked && <SyntheticRuntimeNotice />}
        <Field label="Nome completo" icon={<User className="h-4 w-4" />} required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex: Ana Souza" />

        <Field label="Código da empresa" icon={<Hash className="h-4 w-4" />} required value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ex: ABB7E790"
          hint="Solicite ao profissional de SST da sua empresa" />

        {lookingUp && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Verificando empresa…
          </p>
        )}
        {lookupErr && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{lookupErr}</p>}
        {org && (
          <div className="rounded-2xl border border-success/40 bg-success/10 p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> Empresa encontrada: <span className="text-foreground">{org.name}</span>
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Briefcase className="h-3 w-3" /> Selecione o seu setor
            </p>
            {org.sectors.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {org.sectors.map((s) => {
                  const active = sector === s;
                  return (
                    <button key={s} type="button" onClick={() => setSector(s)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        active ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                      }`}>
                      {active && "✓ "}{s}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2">
                <input value={sector} onChange={(e) => setSector(e.target.value)}
                  placeholder="Informe o seu setor"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
            )}
          </div>
        )}

        <Field label="E-mail corporativo" type="email" icon={<Mail className="h-4 w-4" />} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        <Field label="Senha" type="password" icon={<Lock className="h-4 w-4" />} required minLength={8} hint="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field label="Confirmar senha" type="password" icon={<Lock className="h-4 w-4" />} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5" />
          <span>Li e concordo com os termos de uso e a política de privacidade.</span>
        </label>

        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        {info && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{info}</p>}

        <SubmitBtn
          loading={loading}
          disabled={signupBlocked}
          disabledLabel="Cadastro indisponível nesta demonstração"
        >
          Criar conta
        </SubmitBtn>
      </form>
    </SignupShell>
  );
}
