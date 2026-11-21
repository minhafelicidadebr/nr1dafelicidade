import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import {
  g1DesignPartnerSessionPolicy,
  g1SessionHandoffConfirmations,
} from "@/data/g1DesignPartnerSession";
import {
  evaluateDesignPartnerHandoff,
  type SessionHandoffConfirmationKey,
} from "@/lib/governance/designPartnerSession";

const initialConfirmations: Record<SessionHandoffConfirmationKey, boolean> = {
  limits_explained: false,
  receipt_viewed: false,
  feedback_tested: false,
  discard_explained: false,
};

export default function FacilitatorHandoffCard({ receiptId }: { receiptId: string }) {
  const [confirmations, setConfirmations] = useState(initialConfirmations);
  const evaluation = useMemo(() => evaluateDesignPartnerHandoff({
    receiptId,
    syntheticMode: true,
    persisted: false,
    remoteTransportEnabled: false,
    confirmations,
  }, g1DesignPartnerSessionPolicy), [confirmations, receiptId]);

  return (
    <section aria-labelledby="facilitator-handoff-title" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-3">
        <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary">Handoff do facilitador</p>
          <h2 id="facilitator-handoff-title" className="mt-1 font-display text-lg font-bold">Encerramento verificável da sessão</h2>
          <p className="mt-1 text-xs leading-relaxed text-surface-deep-muted">
            Confirme o fechamento local. Este checklist não é persistido, não é evidência formal e não autoriza compartilhamento externo.
          </p>
        </div>
      </div>

      <fieldset className="mt-5 grid gap-3 md:grid-cols-2">
        <legend className="sr-only">Confirmações de encerramento</legend>
        {g1SessionHandoffConfirmations.map((item) => (
          <label key={item.key} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-3 text-xs font-semibold transition hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary">
            <input
              type="checkbox"
              checked={confirmations[item.key]}
              onChange={() => setConfirmations((current) => ({ ...current, [item.key]: !current[item.key] }))}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </fieldset>

      <div role="status" aria-live="polite" className={`mt-5 rounded-xl border p-4 ${evaluation.canCloseLocally ? "border-emerald-300/25 bg-emerald-300/[0.06]" : "border-white/10 bg-black/10"}`}>
        {evaluation.canCloseLocally ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-bold">Sessão sintética encerrada localmente</h3>
              <p className="mt-1 text-xs text-surface-deep-muted">Recarregue a página para descartar respostas, comprovante, feedback e este checklist.</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-surface-deep-muted">Faltam {evaluation.blockers.filter((blocker) => blocker.startsWith("confirmation_required:")).length} confirmação(ões) para encerrar localmente.</p>
        )}
      </div>
    </section>
  );
}
