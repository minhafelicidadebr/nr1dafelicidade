import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { openStrategIA } from "@/lib/aurora/openAssistant";

interface Props {
  question: string;
  intent?: string;
  label?: string;
  size?: "sm" | "icon" | "default";
  variant?: "outline" | "ghost" | "secondary" | "default";
  className?: string;
}

/**
 * CTA contextual "Perguntar à Sra. EstratégIA - IA".
 * Abre o painel global e injeta a pergunta/intent.
 */
export default function AskStrategIAButton({
  question, intent, label, size = "sm", variant = "outline", className,
}: Props) {
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={`h-7 text-[11px] gap-1 ${className ?? ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openStrategIA({ question, intent });
      }}
      title="Perguntar à Sra. EstratégIA - IA"
    >
      <Sparkles className="h-3 w-3" />
      {label ?? "Perguntar à Sra. EstratégIA"}
    </Button>
  );
}
