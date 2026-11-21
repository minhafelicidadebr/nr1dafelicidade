import { Link } from "@/lib/router/compat";
import { ShieldCheck, Users, UserCircle2, ArrowRight } from "lucide-react";
import iftLogoFull from "@/assets/ift-logo-full.png";
import { SyntheticRuntimeNotice } from "@/components/signup/SignupShell";
import { signupRuntimeAvailability } from "@/lib/signup";

const personas = [
  {
    to: "/signup/sst",
    title: "Profissional de SST",
    desc: "Consultores e profissionais que implementam a NR-1 para empresas.",
    icon: ShieldCheck,
    accent: "from-primary/20 to-primary/5",
  },
  {
    to: "/signup/manager",
    title: "Gestor / RH",
    desc: "Gestores, RH e líderes que acompanham o bem-estar organizacional.",
    icon: Users,
    accent: "from-blue-500/20 to-blue-500/5",
  },
  {
    to: "/signup/collaborator",
    title: "Colaborador",
    desc: "Responda à pesquisa psicossocial por link anônimo enviado pela sua empresa.",
    icon: UserCircle2,
    accent: "from-amber-500/20 to-amber-500/5",
  },
];

export default function SignupIndexPage() {
  const signupBlocked = !signupRuntimeAvailability.available;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-60" aria-hidden />
      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        <aside className="hidden lg:block">
          <img src={iftLogoFull} alt="" className="h-14 w-auto" />
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Plataforma NR-1 · 4 Lentes
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-foreground">
            Gestão de Riscos <span className="text-primary">Psicossociais</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Explore uma jornada sintética de aprendizagem, governança e evidências, com referências
            e instrumentos ainda sujeitos a revisão técnica e metodológica.
          </p>
        </aside>

        <section>
          <Link to="/" className="lg:hidden">
            <img src={iftLogoFull} alt="" className="h-10 w-auto" />
          </Link>

          <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground">
            Como você vai usar a plataforma?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {signupBlocked
              ? "Explore as jornadas disponíveis para avaliação; o cadastro produtivo permanece bloqueado."
              : "Escolha seu perfil para criar uma conta personalizada."}
          </p>

          {signupBlocked && <div className="mt-6"><SyntheticRuntimeNotice /></div>}

          <ul className="mt-8 space-y-4">
            {personas.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  className={`group flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br ${p.accent} p-5 shadow-soft transition hover:border-primary/60 hover:shadow-elegant`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-base font-semibold text-foreground">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Acesso Direto · Demonstração Sintética do Dashboard NR-1
                </p>
                <p className="text-muted-foreground mt-0.5">
                  Explore todas as funcionalidades do Dashboard e das 7 sub-ondas em modo sintético local (dados reais permanecem bloqueados até G3).
                </p>
              </div>
              <Link
                to="/app"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-95 transition"
              >
                Abrir Dashboard (/app)
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/auth" className="font-semibold text-primary hover:underline">
              Fazer login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
