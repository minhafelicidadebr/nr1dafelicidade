import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  readonly className?: string;
  readonly showLabel?: boolean;
}

export default function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar versão clara (Sol)" : "Ativar versão escura (Lua)"}
      title={isDark ? "Mudar para Versão Clara (Solar Harmony)" : "Mudar para Versão Escura (Midnight Aurora)"}
      data-testid="theme-toggle-button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isDark
          ? "border-border/80 bg-card/80 text-amber-300 hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-200"
          : "border-border bg-card text-slate-700 shadow-xs hover:border-primary/40 hover:bg-accent/60 hover:text-slate-900",
        className,
      )}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-12" aria-hidden="true" />
          {showLabel && <span className="whitespace-nowrap">Modo Claro</span>}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-primary transition-transform duration-200 hover:-rotate-12" aria-hidden="true" />
          {showLabel && <span className="whitespace-nowrap">Modo Escuro</span>}
        </>
      )}
    </button>
  );
}
