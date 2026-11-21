import { useMemo, useState } from "react";
import { Link, useNavigate } from "@/lib/router/compat";
import {
  Building2, Mail, Lock, User, Hash, Briefcase, Info, ShieldCheck,
  CheckCircle2, Sparkles, Users, FileCheck2, LayoutDashboard,
} from "lucide-react";
import {
  SignupShell,
  Field,
  SyntheticRuntimeNotice,
} from "@/components/signup/SignupShell";
import {
  signUpUser, createOrgForSST, translateAuthError,
  setPendingProvision, clearPendingProvision,
  signupRuntimeAvailability, SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE,
} from "@/lib/signup";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { saveSyntheticPilotOrg } from "@/lib/runtime/syntheticPilotSession";

type Inst = "pending_registry";

const INSTRUMENTS: { id: Inst; name: string; q: string; t: string; desc: string; rec?: boolean }[] = [
  { id: "pending_registry", name: "Seleção após aprovação metodológica", q: "—", t: "—", desc: "Nenhum instrumento está habilitado até concluir fonte, licença, scoring, testes e aprovação técnica.", rec: true },
];

const SECTORS = [
  "Tecnologia", "Saúde", "Educação", "Indústria", "Construção", "Varejo",
  "Serviços", "Financeiro", "Logística", "Agronegócio", "Energia", "Governo",
];

const STEPS = ["Identidade", "Empresa", "Instrumento", "Confirmação"] as const;

function maskCNPJ(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
function isValidCNPJ(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (slice: number) => {
    const nums = d.slice(0, slice).split("").map(Number);
    const factors = slice === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2];
    const sum = nums.reduce((a, n, i) => a + n * factors[i], 0);
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13]);
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mt-6 grid grid-cols-4 gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-col items-center gap-1.5">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
              done ? "bg-success text-success-foreground"
              : active ? "bg-gradient-hero text-primary-foreground shadow-glow"
              : "border border-border bg-muted text-muted-foreground"
            }`}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-wider ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function SignupSstPage() {
  const nav = useNavigate();
  const signupBlocked = !signupRuntimeAvailability.available;
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [orgName, setOrgName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [sectors, setSectors] = useState<string[]>([]);
  const [sizeBand, setSizeBand] = useState<"small" | "medium" | "large" | "enterprise">("medium");

  const [instrument, setInstrument] = useState<Inst>("pending_registry");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptLGPD, setAcceptLGPD] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const cnpjValid = useMemo(() => !cnpj || isValidCNPJ(cnpj), [cnpj]);

  function toggleSector(s: string) {
    setSectors((cur) => cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]);
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!fullName.trim()) return "Informe seu nome completo.";
      if (!/^\S+@\S+\.\S+$/.test(email)) return "E-mail inválido.";
      if (password.length < 8) return "Senha deve ter no mínimo 8 caracteres.";
      if (password !== confirm) return "As senhas não conferem.";
    }
    if (step === 1) {
      if (!orgName.trim()) return "Informe o nome da empresa.";
      if (cnpj && !cnpjValid) return "CNPJ inválido — verifique os dígitos.";
      if (sectors.length === 0) return "Selecione ao menos um setor de atuação.";
    }
    if (step === 3) {
      if (!acceptTerms) return "Aceite os termos de uso.";
      if (!acceptLGPD) return "Confirme que leu o aviso de governança de dados.";
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) return setError(err);
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() { setError(null); setStep((s) => Math.max(s - 1, 0)); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (signupBlocked) {
      setError(SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE);
      return;
    }
    const err = validateStep();
    if (err) return setError(err);
    setLoading(true); setError(null); setInfo(null);

    // Save pending provision before signup so email-confirm flow can complete later
    setPendingProvision({
      kind: "org",
      name: orgName,
      cnpj: cnpj || undefined,
      sectors,
      headcount: headcount ? Number(headcount) : undefined,
      instrument,
      size_band: sizeBand,
    });

    const pendingProvision = {
      kind: "org" as const,
      name: orgName,
      cnpj: cnpj || undefined,
      sectors,
      headcount: headcount ? Number(headcount) : undefined,
      instrument,
      size_band: sizeBand,
    };

    try {
      const r = await signUpUser({
        email,
        password,
        fullName,
        persona: "sst",
        sector: sectors[0],
        pendingProvision,
      });
      let session = r.session;
      if (!session) {
        const { data: signed } = await supabase.auth.signInWithPassword({ email, password });
        session = signed.session;
      }
      if (!session) {
        setInfo("Conta criada. Verifique seu e-mail para confirmar. Após confirmar, faça login e finalizaremos o cadastro da empresa automaticamente.");
        setLoading(false);
        return;
      }
      const org = await createOrgForSST({
        name: orgName, cnpj, sectors,
        headcount: headcount ? Number(headcount) : undefined,
        instrument,
        size_band: sizeBand,
      });
      clearPendingProvision();
      nav(`/app/company?welcome=1&code=${org.invite_code ?? ""}`);
    } catch (err2) {
      // Se o backend remoto estiver bloqueado pelo Data Gate G0/G1 ou Supabase local offline,
      // ativa a sessão sintética local com os dados informados e abre o Dashboard (/app).
      saveSyntheticPilotOrg({
        name: orgName,
        cnpj: cnpj || undefined,
        sectors,
        headcount: headcount ? Number(headcount) : undefined,
        size_band: sizeBand,
        responsible_name: fullName,
        responsible_email: email,
      });
      setError(translateAuthError(err2));
      nav("/app?synthetic_pilot=1");
    } finally {
      setLoading(false);
    }
  }

  const selectedInstrument = INSTRUMENTS.find((i) => i.id === instrument)!;

  return (
    <SignupShell
      title={signupBlocked ? "Conheça o onboarding NR-1" : "Ative sua plataforma NR-1"}
      subtitle={signupBlocked
        ? "Jornada demonstrativa em 4 passos; nenhum cadastro será enviado neste ambiente."
        : "Onboarding guiado em 4 passos."}
    >
      <Stepper step={step} />
      {signupBlocked && <div className="mt-6"><SyntheticRuntimeNotice /></div>}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {step === 0 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
              <Sparkles className="inline h-3.5 w-3.5 text-primary" /> Você será o <strong>owner</strong> da conta —
              poderá convidar gestores, RH e colaboradores depois.
            </div>
            <Field label="Nome completo" icon={<User className="h-4 w-4" />} required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex: Ana Souza" />
            <Field label="E-mail corporativo" type="email" icon={<Mail className="h-4 w-4" />} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@empresa.com" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Senha" type="password" icon={<Lock className="h-4 w-4" />} required minLength={8} hint="Mín. 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••••" />
              <Field label="Confirmar" type="password" icon={<Lock className="h-4 w-4" />} required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="•••••••••" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground">
              <Building2 className="inline h-3.5 w-3.5 text-primary" /> Dados usados nos relatórios auditáveis NR-1.
            </div>
            <Field label="Razão social" icon={<Building2 className="h-4 w-4" />} required value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Empresa LTDA" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="CNPJ (opcional)" icon={<Hash className="h-4 w-4" />} value={cnpj}
                onChange={(e) => setCnpj(maskCNPJ(e.target.value))} placeholder="00.000.000/0001-00"
                hint={cnpj && !cnpjValid ? "⚠ CNPJ inválido" : "Validação automática"} />
              <Field label="Nº de colaboradores" type="number" icon={<Users className="h-4 w-4" />} min={1}
                value={headcount} onChange={(e) => setHeadcount(e.target.value)} placeholder="Ex: 120" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Setores de atuação <span className="text-destructive">*</span>
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {SECTORS.map((s) => {
                  const active = sectors.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => toggleSector(s)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}>
                      {active && "✓ "}{s}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                <Briefcase className="inline h-3 w-3" /> Selecione todos os setores aplicáveis.
              </p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Porte da empresa <span className="text-destructive">*</span>
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([
                  { v: "small", l: "Pequeno", s: "< 50" },
                  { v: "medium", l: "Médio", s: "50–249" },
                  { v: "large", l: "Grande", s: "250–999" },
                  { v: "enterprise", l: "Enterprise", s: "1000+" },
                ] as const).map((p) => {
                  const active = sizeBand === p.v;
                  return (
                    <button key={p.v} type="button" onClick={() => setSizeBand(p.v)}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        active ? "border-primary bg-primary text-primary-foreground shadow-soft"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                      }`}>
                      <div className="font-semibold">{p.l}</div>
                      <div className={`text-[10px] ${active ? "opacity-80" : "text-muted-foreground"}`}>{p.s}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Escolha do instrumento
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Info className="h-3 w-3" /> Instrumento sujeito a revisão
              </span>
            </div>
            <ul className="space-y-2">
              {INSTRUMENTS.map((opt) => {
                const active = instrument === opt.id;
                return (
                  <li key={opt.id}>
                    <button type="button" onClick={() => setInstrument(opt.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/40"
                      }`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{active ? "✓" : ""}</span>
                          <p className="font-display text-sm font-semibold text-foreground">{opt.name}</p>
                          {opt.rec && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Recomendado</span>}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{opt.q} · {opt.t}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3 text-xs text-foreground">
              A organização pode ser configurada, mas nenhuma campanha poderá abrir antes da aprovação formal de uma versão no Instrument Registry.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Revisão</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Responsável</dt><dd className="text-right font-medium text-foreground">{fullName}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">E-mail</dt><dd className="text-right font-medium text-foreground">{email}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Empresa</dt><dd className="text-right font-medium text-foreground">{orgName}</dd></div>
                {cnpj && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">CNPJ</dt><dd className="text-right font-medium text-foreground">{cnpj}</dd></div>}
                {headcount && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Colaboradores</dt><dd className="text-right font-medium text-foreground">{headcount}</dd></div>}
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Setores</dt><dd className="text-right font-medium text-foreground">{sectors.join(", ")}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Porte</dt><dd className="text-right font-medium text-foreground">{({ small: "Pequeno (<50)", medium: "Médio (50–249)", large: "Grande (250–999)", enterprise: "Enterprise (1000+)" } as const)[sizeBand]}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Instrumento</dt><dd className="text-right font-medium text-foreground">{selectedInstrument.name}</dd></div>
              </dl>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { i: <ShieldCheck className="h-4 w-4" />, t: "Privacidade", s: "dados reais bloqueados" },
                { i: <FileCheck2 className="h-4 w-4" />, t: "Método", s: "aprovação pendente" },
                { i: <Sparkles className="h-4 w-4" />, t: "Gate", s: "G0 / sintético" },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-border bg-card p-3">
                  <div className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">{b.i}</div>
                  <p className="mt-1.5 font-display text-xs font-semibold text-foreground">{b.t}</p>
                  <p className="text-[10px] text-muted-foreground">{b.s}</p>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-2 text-xs text-foreground">
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-0.5" />
              <span>Aceito os termos de uso e a política de privacidade.</span>
            </label>
            <label className="flex items-start gap-2 text-xs text-foreground">
              <input type="checkbox" checked={acceptLGPD} onChange={(e) => setAcceptLGPD(e.target.checked)} className="mt-0.5" />
              <span>Confirmo que tenho autorização para cadastrar esta organização e li o aviso de governança de dados. Esta confirmação não garante conformidade nem define isoladamente a base legal.</span>
            </label>
            <p className="text-[11px] text-muted-foreground">
              A plataforma apoia o GRO/PGR e <strong>não substitui</strong> responsável técnico habilitado.
            </p>
          </div>
        )}

        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        {info && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">{info}</p>}

        <div className="relative z-10 flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:pr-32 md:pr-40">
          {step > 0 && (
            <button type="button" onClick={back}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent">
              ← Voltar
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next}
              className="relative z-10 inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
              Próximo →
            </button>
          ) : (
            <button type="submit" disabled={loading || signupBlocked}
              aria-describedby={signupBlocked ? "synthetic-runtime-notice" : undefined}
              className="relative z-10 inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60">
              {loading
                ? "Criando conta…"
                : signupBlocked
                  ? "Cadastro indisponível nesta demonstração"
                  : "Criar conta e ativar"}
            </button>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-3.5 text-xs">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">
                Segunda opção · Acesso direto à demonstração sintética do Dashboard
              </p>
              <p className="text-muted-foreground mt-0.5">
                Como o banco remoto permanece bloqueado no Gate G0/G1 (sem envio de dados reais), você pode abrir o Dashboard completo em modo sintético local agora mesmo.
              </p>
            </div>
            <Link
              to="/app"
              onClick={() => {
                if (orgName.trim()) {
                  saveSyntheticPilotOrg({
                    name: orgName,
                    cnpj: cnpj || undefined,
                    sectors,
                    headcount: headcount ? Number(headcount) : undefined,
                    size_band: sizeBand,
                    responsible_name: fullName,
                    responsible_email: email,
                  });
                }
              }}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-card px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Abrir Dashboard (/app)
            </Link>
          </div>
        </div>
      </form>
    </SignupShell>
  );
}
