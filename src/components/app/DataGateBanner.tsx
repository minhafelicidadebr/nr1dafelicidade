import { ShieldCheck } from "lucide-react";
import { currentDataGateStatus } from "@/lib/runtime/dataGate";

export default function DataGateBanner() {
  if (currentDataGateStatus.allowed && currentDataGateStatus.requestedMode === "real") return null;

  return (
    <aside
      className="border-b border-primary/25 bg-primary/5 px-4 py-2 text-foreground/90"
      aria-label="Proteção de privacidade e ambiente demonstrativo"
      role="status"
    >
      <div className="container flex items-start justify-center gap-2 text-xs leading-5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p>
          <strong>Ambiente de Demonstração Guiada ·</strong>{" "}
          Proteção de Privacidade e Anonimato Coletivo (k &ge; 5) ativa em todos os módulos de Bem-Estar e Adequação NR-1.
        </p>
      </div>
    </aside>
  );
}

