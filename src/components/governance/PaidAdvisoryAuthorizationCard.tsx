import { BriefcaseBusiness, FileCheck2, LockKeyhole, Scale, Users, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaidAdvisoryAuthorizationMeetingPanel from "@/components/governance/PaidAdvisoryAuthorizationMeetingPanel";
import {
  commercialAuthorizationBlockerLabel,
  commercialAuthorizationStatusLabel,
  type CommercialAuthorizationSummary,
} from "@/lib/commercial/commercialAuthorization";
import type { PaidAdvisoryAuthorizationSummary } from "@/lib/commercial/paidAdvisoryAuthorization";

export default function PaidAdvisoryAuthorizationCard({
  summary,
  commercialAuthorization,
}: {
  summary: PaidAdvisoryAuthorizationSummary;
  commercialAuthorization: CommercialAuthorizationSummary;
}) {
  const saleAuthorized = commercialAuthorization.saleAuthorized;

  return (
    <Card className="border-amber-400/25 bg-amber-400/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Pacote de autorização do serviço assistido
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={summary.canAuthorizeSale
                ? "border-success/40 bg-success/15 text-success"
                : summary.canRequestFormalReview
                  ? "border-amber-500/40 bg-amber-500/15 text-amber-300"
                  : "border-destructive/40 bg-destructive/15 text-destructive"}
            >
              {summary.canAuthorizeSale
                ? "Upstream completo · conferir autorização canônica"
                : summary.canRequestFormalReview
                  ? "Pacote pronto · aprovação pendente"
                  : "Pacote incompleto"}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">
              {commercialAuthorizationStatusLabel(commercialAuthorization.status)}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Workspace interno para revisar escopo, preço, termos, capacidade e faturamento. Esta tela não recebe nomes,
          não envia proposta, não assina contrato, não cobra e não autoriza piloto ou dados reais.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <Metric label="Templates" value={`${summary.reviewReadyDecisions}/${summary.requiredDecisions}`} />
          <Metric label="Cartas de papel" value={`${summary.reviewReadyRoles}/${summary.requiredRoles}`} />
          <Metric label="Papéis autorizados" value={`${summary.saleReadyRoles}/${summary.requiredRoles}`} />
          <Metric label="Decisões aprovadas" value={`${summary.saleReadyDecisions}/${summary.requiredDecisions}`} />
          <Metric
            label="Venda"
            value={saleAuthorized ? "Autorizada" : "Bloqueada"}
            accent={saleAuthorized ? "text-success" : "text-destructive"}
          />
        </div>

        <section aria-labelledby="commercial-authorization-blockers-title" className="rounded-md border border-destructive/25 bg-background/60 p-3 text-xs">
          <h3 id="commercial-authorization-blockers-title" className="font-semibold text-foreground">
            Bloqueios canônicos da venda
          </h3>
          <ul className="mt-2 grid gap-1 text-muted-foreground md:grid-cols-2">
            {commercialAuthorization.blockers.map((blocker) => (
              <li key={blocker}>— {commercialAuthorizationBlockerLabel(blocker)}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="commercial-role-charters-title" className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <h3 id="commercial-role-charters-title" className="text-sm font-semibold text-foreground">
              Papéis obrigatórios
            </h3>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {summary.roles.map((role) => (
              <details key={role.key} className="group rounded-md border border-border bg-card/60 text-xs">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <span>{role.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {role.readyForSale ? "Autorizado" : "Em branco"}
                  </span>
                </summary>
                <div className="space-y-3 border-t border-border px-3 py-3">
                  <p className="leading-relaxed text-muted-foreground">{role.detail}</p>
                  <CharterList title="Responsabilidades" items={role.responsibilities} />
                  <CharterList title="Evidências exigidas" items={role.requiredEvidence} />
                  <div className="grid gap-1 rounded-md border border-dashed border-border p-2 text-[11px] text-muted-foreground sm:grid-cols-2">
                    <span>Titular e alçada: em branco</span>
                    <span>Substituto e capacidade: em branco</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="commercial-decisions-title" className="space-y-2">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <h3 id="commercial-decisions-title" className="text-sm font-semibold text-foreground">
              Quatro decisões formais
            </h3>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {summary.decisions.map((decision) => (
              <details key={decision.key} className="group rounded-md border border-border bg-card/60 text-xs">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <span>{decision.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {decision.completedSections}/{decision.templateSections.length} seções · {decision.readyForSale ? "aprovada" : "pendente"}
                  </span>
                </summary>
                <div className="space-y-3 border-t border-border px-3 py-3">
                  <p className="leading-relaxed text-muted-foreground">{decision.detail}</p>
                  <ul className="space-y-2">
                    {decision.templateSections.map((section) => (
                      <li key={section.key} className="rounded-md border border-border/70 p-2">
                        <p className="flex items-center gap-2 font-medium text-foreground">
                          <FileCheck2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                          {section.label}
                        </p>
                        <p className="mt-1 text-muted-foreground">{section.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <PaidAdvisoryAuthorizationMeetingPanel authorization={summary} />

        <div className="rounded-md border border-destructive/25 bg-background/60 p-3 text-xs">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <LockKeyhole className="h-4 w-4 text-destructive" aria-hidden="true" />
            Próxima ação humana verificável
          </p>
          <p className="mt-2 text-muted-foreground">
            Formalizar os quatro papéis, registrar alçadas, substitutos e capacidade; depois anexar as quatro decisões
            datadas com evidência. Até lá, proposta, assinatura, cobrança e entrega externa permanecem bloqueadas.
          </p>
        </div>

        <p className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
          <WalletCards className="h-3.5 w-3.5" aria-hidden="true" />
          Política {summary.policyId} · escopo sintético · sem armazenamento, assinatura, cobrança ou integração.
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

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
