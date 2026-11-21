import { ShieldAlert } from "lucide-react";
import { K_ANONYMITY_MIN } from "@/lib/privacy";

interface Props {
  n?: number | null;
  context?: string;
  className?: string;
}

export default function InsufficientSampleCard({ n, context, className }: Props) {
  return (
    <div className={`rounded-md border border-amber-500/30 bg-amber-500/5 p-4 text-sm flex gap-3 ${className ?? ""}`}>
      <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-amber-200">Amostra insuficiente para preservar anonimato</p>
        <p className="text-xs text-muted-foreground mt-1">
          {context ? `${context} — ` : ""}
          n = {n ?? 0} respostas (mínimo exigido: {K_ANONYMITY_MIN}). Aumente a adesão antes de divulgar
          ou tomar decisões com base nesse recorte. Conformidade NR-1 / LGPD.
        </p>
      </div>
    </div>
  );
}
