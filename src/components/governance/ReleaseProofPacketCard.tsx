import { CheckCircle2, CircleDashed, CloudCog, GitPullRequest, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReleaseProofItem, ReleaseProofPacketSummary, ReleaseProofSource } from "@/lib/release/releaseProofPacket";
import type { ReleaseEvidenceManifest } from "@/lib/release/releaseEvidenceManifest";

export default function ReleaseProofPacketCard({
  summary,
  evidence,
}: {
  summary: ReleaseProofPacketSummary;
  evidence: ReleaseEvidenceManifest;
}) {
  return (
    <Card className="border-sky-400/25 bg-sky-400/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-sky-300" aria-hidden="true" />
            Pacote de comprovação do release
          </span>
          <Badge variant="outline" className={summary.canRequestReleaseReview
            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
            : "border-amber-500/40 bg-amber-500/15 text-amber-300"}>
            {summary.canRequestReleaseReview ? "Pronto para revisão de release" : "Release parcialmente comprovado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Atestado pontual e somente leitura de um baseline publicado, com evidências locais, do GitHub e do Lovable. Ele não declara o HEAD atual sincronizado, não promove gate, não libera dados reais e não autoriza nova publicação.
        </p>

        <div role="status" className="grid gap-2 rounded-md border border-sky-400/25 bg-background/60 p-3 text-xs md:grid-cols-4">
          <Truth label="Gate aprovado" value={evidence.gates.approvedGate} />
          <Truth label="Gate em preparação" value={evidence.gates.targetGate} />
          <Truth label="Billing" value="Somente sandbox" />
          <Truth label="Publicação externa" value="Bloqueada" danger />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-6">
          <Metric label="Verificadas" value={`${summary.verified}/${summary.total}`} />
          <Metric label="Históricas" value={summary.historicalOnly} />
          <Metric label="Somente local" value={summary.localOnly} />
          <Metric label="Não verificadas" value={summary.unverified} />
          <Metric label="Bloqueadas" value={summary.blocked} accent="text-destructive" />
          <Metric label="Publicação" value="Proibida" accent="text-destructive" />
        </div>

        <div role="status" className="rounded-md border border-amber-400/30 bg-background/60 p-3 text-xs">
          <p className="font-medium text-foreground">
            Próxima prova: {summary.nextProof?.label ?? "revisão de release"}
          </p>
          <p className="mt-1 text-muted-foreground">
            {summary.nextProof?.nextAction ?? "Todas as provas obrigatórias estão prontas para revisão humana."}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {(["local", "github", "lovable"] as const).map((source) => (
            <section key={source} aria-labelledby={`release-proof-${source}`} className="space-y-2">
              <h3 id={`release-proof-${source}`} className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CloudCog className="h-4 w-4 text-sky-300" aria-hidden="true" />
                {sourceLabel(source)}
              </h3>
              <ul className="space-y-2">
                {summary.proofs.filter((proof) => proof.source === source).map((proof) => (
                  <li key={proof.key} className="rounded-md border border-border bg-card/60 p-3 text-xs">
                    <div className="flex items-start gap-2">
                      {proof.ready ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      ) : (
                        <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-medium text-foreground">{proof.label}</p>
                          <Badge variant="outline" className={proofTone(proof)}>{proofStatusLabel(proof)}</Badge>
                        </div>
                        <p className="mt-1 leading-relaxed text-muted-foreground">{proof.detail}</p>
                        <p className="mt-2 font-medium text-foreground">Próximo: {proof.nextAction}</p>
                        <p className="mt-1 break-all font-mono text-[9px] text-muted-foreground">
                          Evidência: {proof.evidenceRef ?? "não vinculada"}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="flex items-start gap-2 rounded-md border border-destructive/25 bg-background/60 p-3 text-xs text-muted-foreground">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          <p>
            Provas verificadas não autorizam promoção automática. Branch protection permanece não comprovada; o atestado Lovable confirma apenas o baseline observado, não o HEAD atual. Novo merge, deploy, publicação externa, avanço de gate e dados reais seguem bloqueados nesta onda.
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Pacote: {summary.packetId} · observado em {summary.observedAt} · baseline atestado {summary.attestedBaselineRef?.slice(0, 7) ?? "não vinculado"} · política {summary.policyId}.
        </p>
      </CardContent>
    </Card>
  );
}

function sourceLabel(source: ReleaseProofSource) {
  if (source === "local") return "Evidência local";
  if (source === "github") return "GitHub";
  return "Lovable";
}

function proofStatusLabel(proof: ReleaseProofItem) {
  if (proof.status === "verified") return "Verificada";
  if (proof.status === "historical_only") return "Histórica";
  if (proof.status === "local_only") return "Somente local";
  if (proof.status === "blocked") return "Bloqueada";
  return "Não verificada";
}

function proofTone(proof: ReleaseProofItem) {
  if (proof.status === "verified") return "border-emerald-500/40 bg-emerald-500/15 text-emerald-300";
  if (proof.status === "blocked") return "border-destructive/40 bg-destructive/15 text-destructive";
  return "border-amber-500/40 bg-amber-500/15 text-amber-300";
}

function Metric({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Truth({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 font-semibold ${danger ? "text-destructive" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
