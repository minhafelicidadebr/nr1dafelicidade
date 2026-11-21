import { CheckCircle2, FileCheck2, LockKeyhole } from "lucide-react";
import type { SyntheticDemoReceipt } from "@/lib/instruments/syntheticDemoReceipt";

export default function SyntheticDemoReceiptCard({ receipt }: { receipt: SyntheticDemoReceipt }) {
  return (
    <section aria-labelledby="synthetic-receipt-title" className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/15 p-2 text-primary" aria-hidden="true">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xs font-bold uppercase tracking-[0.18em] text-primary">Evidência local · G0/G1</p>
            <h2 id="synthetic-receipt-title" className="mt-1 font-display text-lg font-bold">
              Comprovante local da demonstração
            </h2>
            <p className="mt-1 text-xs text-surface-deep-muted">
              Gerado somente nesta memória de página. Nada foi armazenado ou enviado à equipe.
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-2xs font-bold text-emerald-200">
          Sintético concluído
        </span>
      </div>

      <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
        <ReceiptField label="Referência" value={receipt.receiptId} />
        <ReceiptField label="Gerado em" value={receipt.generatedAt} />
        <ReceiptField label="Instrumento" value={receipt.instrumentRef} />
        <ReceiptField label="Cenário" value={`${receipt.scenarioLabel} · ${receipt.scenarioId}`} />
        <ReceiptField label="Itens concluídos" value={String(receipt.completedItemCount)} />
        <ReceiptField label="Política de runtime" value={receipt.runtimePolicyVersion} />
      </dl>

      <ul className="mt-5 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2" aria-label="Limites do comprovante">
        {receipt.limitations.map((limitation) => (
          <li key={limitation} className="flex items-start gap-2 text-xs leading-relaxed text-surface-deep-muted">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            {limitation}
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-surface-deep-fg">
        <LockKeyhole className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
        Uso real habilitado: não · entrega: não realizada · persistência: nenhuma
      </p>
    </section>
  );
}

function ReceiptField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <dt className="text-2xs uppercase tracking-wider text-surface-deep-muted">{label}</dt>
      <dd className="mt-1 break-words font-mono text-xs text-surface-deep-fg">{value}</dd>
    </div>
  );
}
