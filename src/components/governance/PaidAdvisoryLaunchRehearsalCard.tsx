import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FileCheck2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  g1PaidAdvisoryLaunchAcknowledgements,
  g1PaidAdvisoryLaunchPolicy,
  g1PaidAdvisoryLaunchScenarios,
  g1PaidAdvisoryProposalTemplate,
} from "@/data/g1PaidAdvisoryLaunchRehearsal";
import {
  buildPaidAdvisoryLaunchReceipt,
  evaluatePaidAdvisoryLaunchRehearsal,
  paidAdvisoryLaunchBlockerLabel,
  type PaidAdvisoryLaunchAcknowledgementKey,
  type PaidAdvisoryLaunchAction,
} from "@/lib/commercial/paidAdvisoryLaunchRehearsal";
import type { CommercialAuthorizationSummary } from "@/lib/commercial/commercialAuthorization";
import type { PaidAdvisoryAuthorizationSummary } from "@/lib/commercial/paidAdvisoryAuthorization";

const emptyAcknowledgements: Record<PaidAdvisoryLaunchAcknowledgementKey, boolean> = {
  synthetic_company_only: false,
  no_unapproved_price_or_terms: false,
  no_send_signature_or_charge: false,
  receipt_is_not_sale_approval: false,
};

export default function PaidAdvisoryLaunchRehearsalCard({
  authorization,
  commercialAuthorization,
}: {
  authorization: PaidAdvisoryAuthorizationSummary;
  commercialAuthorization: CommercialAuthorizationSummary;
}) {
  const [acknowledgements, setAcknowledgements] = useState({ ...emptyAcknowledgements });
  const [actions, setActions] = useState<Partial<Record<string, PaidAdvisoryLaunchAction>>>({});
  const [receiptIdentity, setReceiptIdentity] = useState(() => createReceiptIdentity());
  const summary = useMemo(() => evaluatePaidAdvisoryLaunchRehearsal(
    g1PaidAdvisoryProposalTemplate,
    g1PaidAdvisoryLaunchScenarios,
    actions,
    {
      authorizationReviewReady: authorization.canRequestFormalReview,
      authorizationForSale: commercialAuthorization.saleAuthorized,
      commercialFieldsApproved: false,
      recipientApproved: false,
      syntheticMode: true,
      realCustomerDataPresent: false,
      persistenceEnabled: false,
      remoteTransportEnabled: false,
      externalRecipientPresent: false,
      acknowledgements,
    },
    g1PaidAdvisoryLaunchPolicy,
  ), [acknowledgements, actions, commercialAuthorization.saleAuthorized, authorization.canRequestFormalReview]);
  const receipt = useMemo(() => summary.canIssueLocalReceipt
    ? buildPaidAdvisoryLaunchReceipt({
      receiptId: receiptIdentity.id,
      generatedAt: receiptIdentity.generatedAt,
      summary,
      persisted: false,
      remoteTransportEnabled: false,
      proposalIssued: false,
    })
    : null, [receiptIdentity, summary]);
  const acknowledgementBlockerCount = summary.preflightBlockers.filter((blocker) =>
    blocker.startsWith("acknowledgement_required:"),
  ).length;

  const reset = () => {
    setAcknowledgements({ ...emptyAcknowledgements });
    setActions({});
    setReceiptIdentity(createReceiptIdentity());
  };

  return (
    <Card className="border-amber-500/25 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Ensaio de lançamento da primeira proposta
          </span>
          <Badge variant="outline" className={`text-[10px] ${receipt?.decision === "ready_for_human_release_review" ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" : receipt ? "border-amber-500/40 bg-amber-500/15 text-amber-200" : summary.canStartInternalRehearsal ? "border-primary/40 bg-primary/10 text-primary" : "border-muted-foreground/30 text-muted-foreground"}`}>
            {receipt?.decision === "ready_for_human_release_review"
              ? "Pronto para revisão humana"
              : receipt
                ? "Ensaio concluído · No-Go"
                : summary.canStartInternalRehearsal
                  ? `${summary.passed}/${summary.total} decisões alinhadas`
                  : "Preflight obrigatório"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Simulação interna e sintética. Não recebe dados de cliente, não preenche preço ou termos, não envia proposta, não solicita assinatura e não inicia cobrança ou entrega.
        </p>

        <section className="rounded-md border border-border bg-card/60 p-4 text-xs">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{g1PaidAdvisoryProposalTemplate.title}</h3>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {g1PaidAdvisoryProposalTemplate.templateId}@{g1PaidAdvisoryProposalTemplate.version}
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px]">Rascunho interno</Badge>
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {g1PaidAdvisoryProposalTemplate.sections.map((section) => (
              <div key={section.key} className="rounded border border-border/70 p-2.5">
                <p className="font-medium text-foreground">{section.label}</p>
                <p className="mt-1 leading-relaxed text-muted-foreground">{section.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground">
            Campos comerciais: {g1PaidAdvisoryProposalTemplate.placeholderKeys.length} placeholders sem valores e sem destinatário externo.
          </p>
        </section>

        <fieldset className="grid gap-2 md:grid-cols-2">
          <legend className="mb-2 text-xs font-medium text-foreground">Preflight comercial</legend>
          {g1PaidAdvisoryLaunchAcknowledgements.map((item) => (
            <label key={item.key} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-border bg-card/60 p-3 text-xs focus-within:ring-2 focus-within:ring-primary">
              <input
                type="checkbox"
                checked={acknowledgements[item.key]}
                onChange={() => setAcknowledgements((current) => ({ ...current, [item.key]: !current[item.key] }))}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[hsl(var(--primary))]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${summary.completionPct}%` }} />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {summary.scenarios.map((scenario, index) => {
            const attempted = scenario.selectedAction !== null;
            return (
              <fieldset key={scenario.key} disabled={!summary.canStartInternalRehearsal} className="rounded-md border border-border bg-card/60 p-4 disabled:opacity-55">
                <legend className="px-1 text-xs font-semibold text-foreground">{index + 1}. {scenario.label}</legend>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{scenario.prompt}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <ActionOption
                    scenarioLabel={scenario.label}
                    label="Responder com limite seguro"
                    value="bounded_answer"
                    selected={scenario.selectedAction === "bounded_answer"}
                    onSelect={(value) => setActions((current) => ({ ...current, [scenario.key]: value }))}
                  />
                  <ActionOption
                    scenarioLabel={scenario.label}
                    label="Interromper e escalar"
                    value="stop_and_escalate"
                    selected={scenario.selectedAction === "stop_and_escalate"}
                    onSelect={(value) => setActions((current) => ({ ...current, [scenario.key]: value }))}
                  />
                </div>
                {attempted && (
                  <div aria-live="polite" className={`mt-3 flex items-start gap-2 rounded-md border p-2.5 text-[11px] ${scenario.passed ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                    {scenario.passed
                      ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />}
                    <span><strong className="text-foreground">{scenario.passed ? "Conduta alinhada." : "Revise a conduta."}</strong> {scenario.coaching}</span>
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        {receipt ? (
          <section aria-live="polite" className="rounded-md border border-amber-500/30 bg-amber-500/5 p-4 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">Comprovante local do ensaio comercial</h3>
                <p className="mt-1 font-medium text-foreground">
                  {receipt.decision === "no_go" ? "No-Go comercial" : "Pronto para revisão humana de liberação"}
                </p>
                <p className="mt-1 text-muted-foreground">
                  proposta emitida: não · venda autorizada: não · armazenamento: somente memória
                </p>
                {receipt.launchBlockers.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-muted-foreground">
                    {receipt.launchBlockers.map((blocker) => (
                      <li key={blocker}>{paidAdvisoryLaunchBlockerLabel(blocker)}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 break-all font-mono text-[9px] text-muted-foreground">{receipt.receiptId} · {receipt.templateRef}</p>
              </div>
            </div>
          </section>
        ) : (
          <div role="status" className="rounded-md border border-border bg-background/60 p-3 text-xs text-muted-foreground">
            {summary.canStartInternalRehearsal
              ? `Próxima situação: ${summary.nextScenario?.label ?? "concluir o ensaio"}.`
              : acknowledgementBlockerCount > 0
                ? `Confirme ${acknowledgementBlockerCount} fronteira(s) para iniciar.`
                : "Ensaio bloqueado por configuração ou limite de segurança; revise o pacote de autorização."}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground">Política: {summary.policyId}. Todo o estado desaparece ao recarregar.</p>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar ensaio comercial
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionOption({
  scenarioLabel,
  label,
  value,
  selected,
  onSelect,
}: {
  scenarioLabel: string;
  label: string;
  value: PaidAdvisoryLaunchAction;
  selected: boolean;
  onSelect: (value: PaidAdvisoryLaunchAction) => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-[11px] focus-within:ring-2 focus-within:ring-primary">
      <input
        type="radio"
        name={`paid-advisory-launch-${scenarioLabel}`}
        aria-label={`${scenarioLabel}: ${label}`}
        checked={selected}
        onChange={() => onSelect(value)}
        className="h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
      />
      <span>{label}</span>
    </label>
  );
}

function createReceiptIdentity() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return {
    id: uuid ? `COMM-${uuid}` : `COMM-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    generatedAt: new Date().toISOString(),
  };
}
