import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { canDisplayAggregate, K_ANONYMITY_MIN } from "@/lib/privacy";

interface Props {
  n?: number | null;
  /** Show numeric n inside the badge */
  showCount?: boolean;
  className?: string;
}

export default function PrivacyGuardBadge({ n, showCount = true, className }: Props) {
  const ok = canDisplayAggregate(n);
  if (ok) {
    return (
      <Badge variant="outline" className={`gap-1 border-green-500/40 text-green-500 ${className ?? ""}`}>
        <ShieldCheck className="h-3 w-3" />
        {showCount ? `k≥${K_ANONYMITY_MIN} (n=${n})` : `k≥${K_ANONYMITY_MIN}`}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className={`gap-1 border-amber-500/40 text-amber-500 ${className ?? ""}`}>
      <ShieldAlert className="h-3 w-3" />
      {showCount ? `n=${n ?? 0} < ${K_ANONYMITY_MIN}` : `n < ${K_ANONYMITY_MIN}`}
    </Badge>
  );
}
