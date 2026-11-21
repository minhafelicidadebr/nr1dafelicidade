import { Link } from "@/lib/router/compat";
import { ShieldCheck } from "lucide-react";
import iftLogoFull from "@/assets/ift-logo-full.png";

export function SignupShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-60" aria-hidden />
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 pt-12 pb-32 lg:grid-cols-2 lg:items-center">
        <aside className="hidden lg:block">
          <Link to="/">
            <img src={iftLogoFull} alt="Felicidade para Todos" className="h-14 w-auto" />
          </Link>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> NR-1 · demonstração sintética
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-foreground">
            Gestão de Riscos <span className="text-primary">Psicossociais</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Demonstração sintética para organizar aprendizagem, referências externas em revisão e
            evidências de ação. A IA apoia a exploração pedagógica; não substitui responsável técnico
            nem valida instrumentos.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { t: "Método", s: "Em revisão" },
              { t: "NR-1 / GRO", s: "Referências oficiais" },
              { t: "Pessoas", s: "SST · RH · Colab." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-card/60 p-3 text-center backdrop-blur">
                <p className="font-display text-sm font-semibold text-foreground">{c.t}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{c.s}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="w-full">
          <Link to="/" className="lg:hidden">
            <img src={iftLogoFull} alt="" className="h-10 w-auto" />
          </Link>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          {children}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/signup" className="hover:text-foreground">← Voltar</Link>
            {" · "}
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Fazer login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="relative mt-1.5">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 ${
            icon ? "pl-9" : ""
          }`}
        />
      </div>
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SyntheticRuntimeNotice({
  operation = "cadastro",
}: { operation?: "cadastro" | "acesso" | "pesquisa" }) {
  const title = operation === "acesso"
    ? "Acesso indisponível nesta demonstração sintética"
    : operation === "pesquisa"
      ? "Pesquisa indisponível nesta demonstração sintética"
      : "Cadastro indisponível nesta demonstração sintética";
  const body = operation === "pesquisa"
    ? "Este ambiente não envia convites, respostas ou dados da organização ao backend. Nenhuma resposta será armazenada enquanto o gate de produção permanecer bloqueado."
    : "Este ambiente não envia credenciais nem dados da organização ao backend. Nenhuma conta ou organização será criada enquanto o gate de produção permanecer bloqueado.";

  return (
    <div
      id="synthetic-runtime-notice"
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-foreground"
    >
      <p className="flex items-center gap-2 font-semibold">
        <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>
      {operation !== "pesquisa" && (
        <Link to="/planos" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
          Conhecer o Sprint assistido
        </Link>
      )}
    </div>
  );
}

export function SubmitBtn({
  loading,
  disabled = false,
  disabledLabel,
  children,
}: {
  loading: boolean;
  disabled?: boolean;
  disabledLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      aria-describedby={disabled ? "synthetic-runtime-notice" : undefined}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
    >
      {loading ? "Processando…" : disabled && disabledLabel ? disabledLabel : children}
      <span aria-hidden>→</span>
    </button>
  );
}
