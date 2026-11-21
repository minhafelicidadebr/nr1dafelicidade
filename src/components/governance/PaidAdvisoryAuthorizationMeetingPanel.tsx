import { CalendarCheck2, ClipboardList, LockKeyhole, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  g1PaidAdvisoryAuthorizationMeetingAgenda,
  g1PaidAdvisoryAuthorizationMeetingContext,
  g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
  g1PaidAdvisoryAuthorizationMeetingOutputs,
  g1PaidAdvisoryAuthorizationMeetingPolicy,
  g1PaidAdvisoryAuthorizationMeetingPreReads,
} from "@/data/g1PaidAdvisoryAuthorizationMeeting";
import {
  evaluatePaidAdvisoryAuthorizationMeeting,
  paidAdvisoryAuthorizationMeetingBlockerLabel,
} from "@/lib/commercial/paidAdvisoryAuthorizationMeeting";
import type { PaidAdvisoryAuthorizationSummary } from "@/lib/commercial/paidAdvisoryAuthorization";

export default function PaidAdvisoryAuthorizationMeetingPanel({
  authorization,
}: {
  authorization: PaidAdvisoryAuthorizationSummary;
}) {
  const meeting = evaluatePaidAdvisoryAuthorizationMeeting(
    authorization,
    g1PaidAdvisoryAuthorizationMeetingAgenda,
    g1PaidAdvisoryAuthorizationMeetingPreReads,
    g1PaidAdvisoryAuthorizationMeetingOutputs,
    g1PaidAdvisoryAuthorizationMeetingExternalReadiness,
    g1PaidAdvisoryAuthorizationMeetingContext,
    g1PaidAdvisoryAuthorizationMeetingPolicy,
  );
  const statusLabel = meeting.status === "authorization_already_complete"
    ? "Autorização já concluída"
    : meeting.status === "ready_for_human_convocation_review"
      ? "Pronto para revisão humana da convocação"
      : meeting.status === "packet_ready_for_external_nomination"
        ? "Pacote pronto · quórum pendente"
        : "Pacote de reunião bloqueado";

  return (
    <section aria-labelledby="paid-advisory-authorization-meeting-title" className="space-y-4 rounded-md border border-amber-500/25 bg-background/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="paid-advisory-authorization-meeting-title" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarCheck2 className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Sala de decisão da primeira venda
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Pauta e pré-leituras para preparar a deliberação fora do sistema. Este painel não recebe nomes, não agenda, não envia convite, não registra ata e não autoriza venda.
          </p>
        </div>
        <Badge variant="outline" className={meeting.canRequestHumanConvocationReview
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : meeting.canUseInternalPacket
            ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
            : "border-destructive/40 bg-destructive/10 text-destructive"}
        >
          {statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
        <Metric label="Pauta" value={`${meeting.readyAgendaItems}/${meeting.requiredAgendaItems}`} />
        <Metric label="Pré-leituras" value={`${meeting.readyPreReads}/${meeting.requiredPreReads}`} />
        <Metric label="Quórum indicado" value={`${meeting.nominatedRoles}/${meeting.requiredRoles}`} />
        <Metric label="Alçadas comprovadas" value={`${meeting.authorityEvidenceRoles}/${meeting.requiredRoles}`} />
        <Metric label="Convocação" value={meeting.canRequestHumanConvocationReview ? "Revisável" : "Pendente"} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <details className="rounded-md border border-border bg-card/60 text-xs">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <ClipboardList className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Pauta deliberativa em sete blocos
          </summary>
          <ol className="space-y-3 border-t border-border px-4 py-3">
            {g1PaidAdvisoryAuthorizationMeetingAgenda.map((item, index) => (
              <li key={item.key}>
                <p className="font-medium text-foreground">{index + 1}. {item.label}</p>
                <p className="mt-0.5 leading-relaxed text-muted-foreground">{item.objective}</p>
              </li>
            ))}
          </ol>
        </details>

        <details className="rounded-md border border-border bg-card/60 text-xs">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <UsersRound className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Pré-leituras e saídas obrigatórias
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-3">
            <div>
              <p className="font-medium text-foreground">Cinco pré-leituras versionadas</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {g1PaidAdvisoryAuthorizationMeetingPreReads.map((item) => (
                  <li key={item.key}>— {item.label} · {item.versionRef}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Quatro registros esperados</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {g1PaidAdvisoryAuthorizationMeetingOutputs.map((output) => (
                  <li key={output.key}>— {output.label}</li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      </div>

      <div className="rounded-md border border-destructive/25 bg-destructive/5 p-3 text-xs">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <LockKeyhole className="h-4 w-4 text-destructive" aria-hidden="true" />
          Handoff humano obrigatório
        </p>
        <ul className="mt-2 grid gap-1 text-muted-foreground md:grid-cols-2">
          {meeting.convocationBlockers.map((blocker) => (
            <li key={blocker}>— {paidAdvisoryAuthorizationMeetingBlockerLabel(blocker)}</li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Agendamento: não · convite: não · decisão registrada: não · venda autorizada por este painel: não.
        </p>
      </div>

      <p className="text-[10px] text-muted-foreground">Política {meeting.policyId} · somente leitura · sem PII, persistência ou transporte remoto.</p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
