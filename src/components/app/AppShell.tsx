import { useEffect, useRef } from "react";
import { NavLink, Outlet, Link, useLocation, useNavigate } from "@/lib/router/compat";
import { LayoutDashboard, Building2, Users2, Calendar, AlertTriangle, ListChecks, Shield, FileText, Sparkles, Database, ClipboardCheck, BookOpen, ArrowLeft, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/company", label: "Empresa", icon: Building2 },
  { to: "/app/units", label: "Unidades & GHE", icon: Users2 },
  { to: "/app/cycles", label: "Ciclos de Escuta", icon: Calendar },
  { to: "/app/work-analysis", label: "Trabalho Real (AEP)", icon: ClipboardCheck },
  { to: "/app/aet", label: "Ergonomia (AET)", icon: ClipboardCheck },
  { to: "/app/risk", label: "Matriz de Riscos", icon: AlertTriangle },
  { to: "/app/criteria", label: "Critérios de Risco", icon: Database },
  { to: "/app/controls", label: "Medidas de Controle", icon: Shield },
  { to: "/app/actions", label: "Plano de Ação", icon: ListChecks },
  { to: "/app/documents", label: "Documentos PGR", icon: FileText },
  { to: "/app/governance", label: "Governança & LGPD", icon: ShieldCheck },
  { to: "/drivers", label: "Trilhas de Bem-Estar", icon: BookOpen },
  { to: "/app/estrategia", label: "Sra. EstratégIA", icon: Sparkles },
];

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileHorizontalNavRef = useRef<HTMLElement | null>(null);
  const isSubpage = location.pathname !== "/app";
  const currentModule =
    nav.find((item) => !item.end && location.pathname.startsWith(item.to))?.label ??
    "Módulo NR-1";

  // Auto-centraliza o módulo ativo na barra horizontal mobile/tablet sempre que a rota mudar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = mobileHorizontalNavRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>('[aria-current="page"]');
    if (activeEl && typeof activeEl.scrollIntoView === "function") {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [location.pathname]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background min-w-0 max-w-full">
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border flex-col p-4 gap-1 bg-card/30">
        <div className="px-2 py-3 mb-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Lente 1 · Mensurar</p>
          <h2 className="text-lg font-semibold text-foreground">NR-1 / Evidências Psicossociais</h2>
        </div>
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </aside>

      {/* Compact / Split-Screen Horizontal Workspace Module Bar (Auto-Centering & Opaque Backdrop) */}
      <div className="md:hidden sticky top-14 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl px-3 py-2 shadow-xs">
        <div className="flex items-center justify-between mb-1.5 px-1 gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary truncate">
            Módulo Ativo: {isSubpage ? currentModule : "Dashboard Geral"}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0">
            14 módulos · Deslize →
          </span>
        </div>
        <nav
          ref={mobileHorizontalNavRef}
          aria-label="Módulos do Dashboard NR-1"
          className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
        >
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                    : "border-border/70 bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 min-w-0 max-w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-3.5 sm:p-4 pb-24 md:p-8 md:pb-10 space-y-4 min-w-0">
          {isSubpage && (
            <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap rounded-lg border border-border/70 bg-card/50 px-3 py-2 text-xs min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground hover:bg-accent transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar
                </button>
                <span className="text-muted-foreground">/</span>
                <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors truncate">
                  Dashboard NR-1
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="font-semibold text-foreground truncate">{currentModule}</span>
              </div>
              <Link
                to="/app"
                className="text-[11px] font-medium text-primary hover:underline shrink-0"
              >
                Ir para Visão Geral
              </Link>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
