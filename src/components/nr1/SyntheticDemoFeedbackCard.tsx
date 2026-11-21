import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageSquareText } from "lucide-react";
import {
  recordSyntheticDemoFeedback,
  type SyntheticDemoFeedbackInput,
} from "@/lib/governance/syntheticDemoFeedback";

type FeedbackForm = Pick<SyntheticDemoFeedbackInput, "understanding" | "perceivedValue" | "nextInterest">;

const initialForm: FeedbackForm = {
  understanding: "clear",
  perceivedValue: "high",
  nextInterest: "synthetic_journey",
};

export default function SyntheticDemoFeedbackCard({ receiptId }: { receiptId: string }) {
  const [form, setForm] = useState(initialForm);
  const [recorded, setRecorded] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    recordSyntheticDemoFeedback({
      receiptId,
      ...form,
      syntheticMode: true,
      freeTextEnabled: false,
      persisted: false,
      remoteTransportEnabled: false,
    });
    setRecorded(true);
  };

  if (recorded) {
    return (
      <section aria-live="polite" className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
          <div>
            <h2 className="font-display text-lg font-bold">Feedback registrado apenas nesta página</h2>
            <p className="mt-1 text-xs leading-relaxed text-surface-deep-muted">
              Nenhum feedback foi armazenado ou enviado. Ele desaparece ao recarregar a demonstração.
            </p>
            <button type="button" onClick={() => setRecorded(false)} className="mt-3 text-xs font-bold text-primary underline-offset-4 hover:underline">
              Alterar respostas
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="synthetic-feedback-title" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-3">
        <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h2 id="synthetic-feedback-title" className="font-display text-lg font-bold">Feedback estruturado da demonstração</h2>
          <p className="mt-1 text-xs leading-relaxed text-surface-deep-muted">
            Selecione opções controladas. Não inclua dados de trabalhadores; não há campo livre, persistência ou envio.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-3">
        <FeedbackSelect
          id="feedback-understanding"
          label="O fluxo ficou claro?"
          value={form.understanding}
          onChange={(value) => setForm((current) => ({ ...current, understanding: value as FeedbackForm["understanding"] }))}
          options={[["clear", "Claro"], ["partial", "Parcial"], ["unclear", "Ainda confuso"]]}
        />
        <FeedbackSelect
          id="feedback-value"
          label="Valor percebido"
          value={form.perceivedValue}
          onChange={(value) => setForm((current) => ({ ...current, perceivedValue: value as FeedbackForm["perceivedValue"] }))}
          options={[["high", "Alto"], ["medium", "Médio"], ["low", "Baixo"]]}
        />
        <FeedbackSelect
          id="feedback-interest"
          label="Próximo interesse"
          value={form.nextInterest}
          onChange={(value) => setForm((current) => ({ ...current, nextInterest: value as FeedbackForm["nextInterest"] }))}
          options={[["synthetic_journey", "Jornada sintética"], ["methodology", "Metodologia"], ["governance", "Governança"], ["none", "Nenhum agora"]]}
        />
        <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:shadow-glow md:col-span-3 md:justify-self-start">
          Registrar feedback nesta página
        </button>
      </form>
    </section>
  );
}

function FeedbackSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="text-xs font-semibold text-surface-deep-fg">
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/15 bg-surface-deep px-3 py-2.5 text-sm text-surface-deep-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}
