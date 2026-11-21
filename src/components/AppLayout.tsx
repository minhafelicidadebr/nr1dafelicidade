import { Link, useLocation, useNavigate } from "@/lib/router/compat";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, Library, User, CreditCard, LogOut, Menu, X, Shield, LayoutDashboard, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import iftLogoIcon from "@/assets/ift-logo-icon.png";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ThemeToggle";
import React, { useState, useEffect } from "react";
import DataGateBanner from "@/components/app/DataGateBanner";
import AuroraFloatingAssistant from "@/components/app/AuroraFloatingAssistant";
import { openStrategIA } from "@/lib/aurora/openAssistant";

class RouteErrorBoundary extends React.Component<
  { resetKey: string; onBack: () => void; children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { resetKey: string; onBack: () => void; children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container py-16 max-w-xl mx-auto text-center space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Recuperação Segura de Navegação
            </p>
            <h2 className="text-lg font-bold text-foreground">
              Não foi possível exibir este módulo no momento
            </h2>
            <p className="text-xs text-muted-foreground">
              {this.state.error.message || "Ocorreu uma falha temporária ao carregar a visualização."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ error: null });
                  this.props.onBack();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground hover:bg-accent"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar para página anterior
              </button>
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const baseNav = [
  { path: "/", label: "Início", icon: Home },
  { path: "/nr1-copsoq", label: "Plataforma NR-1", icon: Shield },
  { path: "/drivers", label: "Drivers", icon: Layers },
  { path: "/library", label: "Evidências", icon: Library },
  { path: "/planos", label: "Planos", icon: CreditCard },
  { path: "/app", label: "Dashboard NR-1", icon: LayoutDashboard },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showDataGateBanner = location.pathname.startsWith("/app") || location.pathname.startsWith("/respond");
  const navItems = user
    ? [...baseNav, { path: "/perfil", label: "Progresso", icon: User }]
    : [...baseNav];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const isNavItemActive = (itemPath: string) => {
    if (itemPath === "/") return location.pathname === "/";
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <a href="#main-content" className="skip-to-content">Ir para o conteúdo principal</a>

      {/* Top Nav — Opaque Studio Glass (prevents underlying text bleed-through on mobile scroll) */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/70" role="banner">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Início - Felicidade no Trabalho">
            <div className="relative">
              <img src={iftLogoIcon} alt="" className="h-8 w-8 rounded-lg object-contain transition-transform group-hover:scale-105" aria-hidden="true" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-display text-sm font-bold tracking-tight text-foreground">Felicidade para Todos</span>
              <span className="text-2xs font-bold bg-secondary/15 text-secondary-foreground dark:text-secondary px-2 py-0.5 rounded-md border border-secondary/30">
                Educ
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 rounded-xl bg-muted/60 p-0.5 border border-border/50" aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.div layoutId="nav-active" className="absolute inset-0 rounded-lg bg-card shadow-sm border border-border/60" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
                    <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/perfil" className="hidden sm:flex items-center gap-1.5 rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-all">
                  <div className="h-5 w-5 rounded-full bg-gradient-hero flex items-center justify-center text-white text-2xs font-bold">
                    {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{profile?.full_name?.split(" ")[0] || "Perfil"}</span>
                  <span className="text-amber-700 dark:text-secondary font-bold">{profile?.ift_balance ?? 0} IFT</span>
                </Link>
                <button
                  onClick={signOut}
                  className="hidden sm:flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  aria-label="Sair da conta"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : location.pathname.startsWith("/app") ? (
              <Link
                to="/app/company"
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-600/35 dark:border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-all hover:bg-emerald-500/20"
              >
                <Shield className="h-3.5 w-3.5" />
                Workspace NR-1 Ativo
              </Link>
            ) : (
              <Link
                to="/app"
                className="hidden sm:flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground transition-all hover:shadow-gold hover:scale-[1.02]"
              >
                <Shield className="h-3.5 w-3.5" />
                Acessar Dashboard NR-1
              </Link>
            )}
            <button
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu de navegação"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur-xl overflow-hidden"
            >
              <nav className="container py-3 space-y-1" aria-label="Menu mobile">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                      <item.icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-2 flex items-center justify-between px-2">
                  <ThemeToggle showLabel className="w-full justify-center py-2.5" />
                </div>
                {!user && !location.pathname.startsWith("/app") && (
                  <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground text-sm font-bold">
                    <Shield className="h-4 w-4" /> Acessar Dashboard NR-1
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {showDataGateBanner && <DataGateBanner />}

      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        <RouteErrorBoundary
          resetKey={`${location.pathname}${location.search}`}
          onBack={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/app");
            }
          }}
        >
          {children}
        </RouteErrorBoundary>
      </main>

      {/* Footer — Dark Premium */}
      <footer className="relative border-t border-hairline bg-surface-deep text-surface-deep-fg overflow-hidden" role="contentinfo">
        <div className="absolute top-0 left-0 right-0 gold-line-thin" aria-hidden="true" />
        <div className="absolute inset-0 dot-pattern-light opacity-[0.03]" />
        <div className="container relative py-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={iftLogoIcon} alt="" className="h-10 w-10 rounded-lg object-contain bg-white/5 p-1" aria-hidden="true" />
              <div>
                <span className="font-display text-sm font-bold text-surface-deep-fg">Felicidade para Todos</span>
                <span className="ml-2 text-2xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-md font-bold">Educ</span>
                <p className="text-2xs text-surface-deep-subtle mt-0.5">Plataforma EdTech de Bem-Estar Organizacional</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-2xs text-surface-deep-subtle">
              <Link to="/planos" className="hover:text-surface-deep-fg transition-colors">Planos</Link>
              <Link to="/drivers" className="hover:text-surface-deep-fg transition-colors">Playbook Driver</Link>
              <Link to="/library" className="hover:text-surface-deep-fg transition-colors">Evidências</Link>
              <Link to="/plano-saas" className="hover:text-surface-deep-fg transition-colors">Plano Go-Live</Link>
              <Link to="/sobre" className="hover:text-surface-deep-fg transition-colors">Sobre</Link>
            </div>
          </div>
          <div className="gold-line-thin" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-2xs text-surface-deep-subtle/80">
            <p>Impact HUB Brasília — SGAN 601, Lote H Edifício Íon, Ala Amarela — Asa Norte Brasília/DF — Brasil</p>
            <p>(61) 3550-8779 · felicidadeparatodos.com.br · @felicidadeparatodosbr</p>
          </div>
          <p className="text-center text-2xs text-surface-deep-subtle/60">
            © 2025 Instituto Felicidade para Todos. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Nav — 4 Core Destinations + 5th Highlighted Sra. EstratégIA Chatbot CTA (Zero Compression) */}
      {!location.pathname.startsWith("/respond") && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/80 safe-area-bottom shadow-lg"
          aria-label="Navegação mobile"
          data-testid="mobile-bottom-nav-unified"
        >
          <div className="grid grid-cols-5 items-center gap-1 py-1.5 px-1.5">
            {[
              { path: "/", label: "Início", icon: Home },
              { path: "/nr1-copsoq", label: "NR-1", icon: Shield },
              { path: "/drivers", label: "Drivers", icon: Layers },
              { path: "/app", label: "Dashboard", icon: LayoutDashboard },
            ].map((item) => {
              const isActive = isNavItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-xs transition-all min-w-0 ${
                    isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav"
                      className="absolute inset-0 bg-primary/12 rounded-xl"
                    />
                  )}
                  <item.icon className="relative z-10 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="relative z-10 font-medium text-[10px] leading-tight truncate max-w-full">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* 5º Slot Inteligente: CTA Direto da Consultora Digital Sra. EstratégIA */}
            <button
              type="button"
              onClick={() => openStrategIA()}
              aria-label="Abrir consultora digital Sra. EstratégIA"
              data-testid="mobile-bottom-nav-strategia-cta"
              className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl bg-[#071C1F] text-white border border-emerald-500/45 shadow-sm active:scale-95 transition-all min-w-0 cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
                <span
                  className="absolute -top-0.5 -right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
              </div>
              <span className="font-bold text-[10px] leading-tight text-amber-200 truncate max-w-full">
                EstratégIA
              </span>
            </button>
          </div>
        </nav>
      )}
      {!location.pathname.startsWith("/respond") && !location.pathname.startsWith("/plano-saas") && (
        <AuroraFloatingAssistant />
      )}
    </div>
  );
}
