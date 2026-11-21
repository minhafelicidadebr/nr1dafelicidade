import { Link, useLocation } from "@/lib/router/compat";
import { ShieldAlert, ListChecks, Wrench, FileSignature, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { to: "/app/risk",      label: "Riscos",     icon: ShieldAlert },
  { to: "/app/actions",   label: "Ações",      icon: ListChecks },
  { to: "/app/controls",  label: "Controles",  icon: Wrench },
  { to: "/app/documents", label: "Documentos", icon: FileSignature },
] as const;

export function JourneyStepper() {
  const { pathname } = useLocation();
  const activeIdx = STEPS.findIndex((s) => pathname.startsWith(s.to));
  return (
    <nav
      aria-label="Jornada NR-1: Riscos, Ações, Controles, Documentos"
      className="flex items-center gap-1 flex-wrap rounded-lg border border-border bg-card/50 px-3 py-2 text-xs"
    >
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === activeIdx;
        const isDone = activeIdx > i;
        return (
          <span key={s.to} className="flex items-center gap-1">
            <Link
              to={s.to}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors",
                isActive
                  ? "bg-primary/15 text-primary font-medium"
                  : isDone
                    ? "text-foreground hover:bg-accent"
                    : "text-muted-foreground hover:bg-accent",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </Link>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
          </span>
        );
      })}
    </nav>
  );
}
