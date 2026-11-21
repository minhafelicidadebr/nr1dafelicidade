import { CalendarClock, FileCheck2, LockKeyhole, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  accountableNominationPackBlockerLabel,
  type AccountableNominationPackSummary,
} from "@/lib/governance/accountableNominationPack";

export default function AccountableNominationPackCard({
  summary,
}: {
  summary: AccountableNominationPackSummary;
}) {
  return (
    <Card className="border-amber-400/25 bg-amber-400/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Pacote de nomeação e convocação
          </span>
          <Badge variant="outline" className={summary.canPrepareInternalConvocationTemplate
            ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
            : "border-destructive/40 bg-destructive/15 text-destructive"}
          >
            {summary.canPrepareInternalConvocationTemplate
              ? "Template interno pronto · nomeações pendentes"
              : "Template incompleto"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Cartas de papel e agenda para preparar a convocação fora do sistema. Este template não contém nomes, não envia convite, não registra mandato e não constitui reunião, parecer ou decisão formal.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <Metric label="Cartas de papel" value={`${summary.readyRoleCharters}/${summary.requiredRoleCharters}`} />
          <Metric label="Blocos da agenda" value={`${summary.readyAgendaItems}/${summary.requiredAgendaItems}`} />
          <Metric label="Campos pessoais" value={summary.identityFieldsPopulated} />
          <Metric label="Convocação" value="Não emitida" accent="text-destructive" />
          <Metric label="Gate" value="Não aprovado" accent="text-destructive" />
        </div>

        {!summary.canPrepareInternalConvocationTemplate && summary.nextBlocker && (
          <div role="status" className="rounded-md border border-destructive/30 bg-background/60 p-3 text-xs">
            <p className="font-medium text-foreground">Template bloqueado</p>
            <p className="mt-1 text-muted-foreground">
              {accountableNominationPackBlockerLabel(summary.nextBlocker)}
            </p>
          </div>
        )}

        <section aria-labelledby="role-charters-title" className="space-y-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <h3 id="role-charters-title" className="text-sm font-semibold text-foreground">Nove cartas de papel</h3>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {summary.roles.map((role) => (
              <details key={role.key} className="group rounded-md border border-border bg-card/60 text-xs">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <span>{role.label}</span>
                  <span className="text-[10px] text-muted-foreground group-open:hidden">Abrir carta</span>
                  <span className="hidden text-[10px] text-muted-foreground group-open:inline">Fechar</span>
                </summary>
                <div className="space-y-3 border-t border-border px-3 py-3">
                  <p className="leading-relaxed text-muted-foreground">{role.purpose}</p>
                  <CharterList title="Autoridade mínima" items={role.minimumAuthority} />
                  <CharterList title="Responsabilidades" items={role.responsibilities} />
                  <CharterList title="Evidências esperadas" items={role.requiredEvidence} />
                  <div className="grid gap-1 rounded-md border border-dashed border-border p-2 text-[11px] text-muted-foreground sm:grid-cols-3">
                    <span>Titular: em branco</span>
                    <span>Substituto: em branco</span>
                    <span>Mandato/evidência: em branco</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <details className="rounded-md border border-border bg-card/60 text-xs">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-2 font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <CalendarClock className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Agenda preparatória em seis blocos
          </summary>
          <ol className="space-y-3 border-t border-border px-4 py-3">
            {summary.agenda.map((item, index) => (
              <li key={item.key}>
                <p className="font-medium text-foreground">{index + 1}. {item.label}</p>
                <p className="mt-0.5 text-muted-foreground">{item.objective}</p>
              </li>
            ))}
          </ol>
        </details>

        <div className="rounded-md border border-destructive/25 bg-background/60 p-3 text-xs">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <LockKeyhole className="h-4 w-4 text-destructive" aria-hidden="true" />
            Limites não negociáveis
          </p>
          <ul className="mt-2 grid gap-1 text-muted-foreground md:grid-cols-2">
            {summary.boundaries.map((boundary) => <li key={boundary}>— {boundary}</li>)}
          </ul>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Pacote: {summary.packId} · versão {summary.version} · política {summary.policyId} · armazenamento e envio desabilitados.
        </p>
      </CardContent>
    </Card>
  );
}

function CharterList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-1 text-foreground">
        {items.map((item) => <li key={item}>— {item}</li>)}
      </ul>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
