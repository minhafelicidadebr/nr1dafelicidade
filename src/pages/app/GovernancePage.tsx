import { useEffect, useState } from "react";
import { Link } from "@/lib/router/compat";
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Circle, ClipboardCheck, Database, Files, GitBranch, LockKeyhole, Megaphone, MonitorPlay, ShieldCheck, UploadCloud, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExternalSessionDecisionCard from "@/components/governance/ExternalSessionDecisionCard";
import IncidentRecoveryExerciseCard from "@/components/governance/IncidentRecoveryExerciseCard";
import Nr1LearningScienceInfoModal from "@/components/governance/Nr1LearningScienceInfoModal";
import { fetchMyOrg } from "@/lib/api/nr1";
import {
  fetchDataGovernanceStatus,
  type DataGovernanceStatus,
} from "@/lib/api/dataGovernance";
import { regulatoryJourneyPolicy, regulatoryJourneySteps } from "@/data/regulatoryJourney";
import {
  evaluateRegulatoryJourney,
  regulatoryJourneyBlockerLabel,
  type RegulatoryJourneyStage,
  type RegulatoryJourneySummary,
} from "@/lib/governance/regulatoryJourney";
import {
  publishedBaselineBlockerLabel,
  type PublishedBaselineSummary,
} from "@/lib/release/syncReadiness";
import {
  g2CommitteeSubmissionCriteria,
  g2CommitteeSubmissionPolicy,
  localG2CommitteeSubmissionEvidence,
} from "@/data/g2CommitteeSubmission";
import {
  evaluateCommitteeSubmissionReadiness,
  type CommitteeSubmissionCategory,
  type CommitteeSubmissionSummary,
} from "@/lib/governance/committeeSubmission";
import { g1EvidenceDossierItems, g1EvidenceDossierPolicy } from "@/data/g1EvidenceDossier";
import {
  evaluateEvidenceDossier,
  type EvidenceDossierCategory,
  type EvidenceDossierSummary,
} from "@/lib/governance/evidenceDossier";
import {
  formalAcceptanceBlockerLabel,
  type FormalAcceptanceSummary,
} from "@/lib/governance/formalAcceptance";
import { saasMaturityContext, saasMaturityItems, saasMaturityPolicy } from "@/data/saasMaturityAssessment";
import {
  evaluateSaasMaturity,
  saasMaturityBlockerLabel,
  type SaasMaturityCategory,
  type SaasMaturityStage,
  type SaasMaturitySummary,
} from "@/lib/governance/saasMaturity";
import {
  demoRehearsalBlockerLabel,
  type DemoRehearsalPhase,
  type DemoRehearsalSummary,
} from "@/lib/governance/demoRehearsal";
import {
  publicDemoReadinessBlockerLabel,
  type PublicDemoCategory,
  type PublicDemoReadinessSummary,
} from "@/lib/governance/publicDemoReadiness";
import {
  residualRiskBlockerLabel,
  type ResidualRiskCategory,
  type ResidualRiskSeverity,
  type ResidualRiskSummary,
} from "@/lib/governance/residualRiskRegister";
import { g1ExternalReadinessWorkspace } from "@/data/g1ExternalReadinessWorkspace";

const dataClassLabels: Record<string, string> = {
  identity: "Identidade e vínculo",
  invitation_secret: "Segredo de convite",
  response_microdata: "Microdados de resposta",
  safe_aggregate: "Agregado protegido",
  audit_event: "Evento de auditoria",
  operational_evidence: "Evidência operacional",
  security_incident: "Incidente de segurança",
};

const blockerLabels: Record<string, string> = {
  policy_missing: "Política organizacional ausente",
  organization_scope_missing: "Escopo da organização não definido",
  policy_not_approved: "Política ainda não aprovada",
  legal_basis_missing: "Base legal não documentada",
  privacy_notice_missing: "Aviso de privacidade não aprovado",
  incident_runbook_missing: "Runbook de incidentes ausente",
  matrix_hash_missing: "Hash da matriz ausente",
  required_approvals_missing: "Aprovações DPO, Jurídico, Segurança e SST incompletas",
  retention_periods_undecided: "Prazos de retenção ainda não decididos",
  disposal_methods_undecided: "Métodos de descarte ainda não decididos",
};

const regulatoryJourney = evaluateRegulatoryJourney(regulatoryJourneySteps, regulatoryJourneyPolicy);
const committeeSubmission = evaluateCommitteeSubmissionReadiness(
  g2CommitteeSubmissionCriteria,
  localG2CommitteeSubmissionEvidence,
  g2CommitteeSubmissionPolicy,
);
const evidenceDossier = evaluateEvidenceDossier(g1EvidenceDossierItems, g1EvidenceDossierPolicy);
const saasMaturity = evaluateSaasMaturity(saasMaturityItems, saasMaturityContext, saasMaturityPolicy);
const {
  publishedBaselineReadiness,
  formalAcceptance,
  demoRehearsal,
  publicDemoReadiness,
  residualRiskRegister,
  externalSessionDecision,
} = g1ExternalReadinessWorkspace;

export default function GovernancePage() {
  const [status, setStatus] = useState<DataGovernanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const org = await fetchMyOrg();
        if (!org) throw new Error("Organização não encontrada.");
        setStatus(await fetchDataGovernanceStatus(org.id));
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Status de governança indisponível.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SaasMaturityCard summary={saasMaturity} />
        <IncidentRecoveryExerciseCard />
        <ExternalSessionDecisionCard summary={externalSessionDecision} workspacePath="/app/governance/external-readiness" />
        <DemoRehearsalCard summary={demoRehearsal} />
        <PublicDemoReadinessCard summary={publicDemoReadiness} />
        <EvidenceDossierCard summary={evidenceDossier} />
        <FormalAcceptanceCard summary={formalAcceptance} />
        <ResidualRiskRegisterCard summary={residualRiskRegister} />
        <RegulatoryJourneyCard summary={regulatoryJourney} />
        <PublishedBaselineCard summary={publishedBaselineReadiness} />
        <CommitteeSubmissionCard summary={committeeSubmission} />
        <p className="text-sm text-muted-foreground">Verificando governança no servidor…</p>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="space-y-6">
        <SaasMaturityCard summary={saasMaturity} />
        <IncidentRecoveryExerciseCard />
        <ExternalSessionDecisionCard summary={externalSessionDecision} workspacePath="/app/governance/external-readiness" />
        <DemoRehearsalCard summary={demoRehearsal} />
        <PublicDemoReadinessCard summary={publicDemoReadiness} />
        <EvidenceDossierCard summary={evidenceDossier} />
        <FormalAcceptanceCard summary={formalAcceptance} />
        <ResidualRiskRegisterCard summary={residualRiskRegister} />
        <RegulatoryJourneyCard summary={regulatoryJourney} />
        <PublishedBaselineCard summary={publishedBaselineReadiness} />
        <CommitteeSubmissionCard summary={committeeSubmission} />
        <Card className="border-destructive/40">
          <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Governança não comprovada</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>O servidor não comprovou uma política válida. Campanhas e processamento de dados reais permanecem bloqueados.</p>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold">Governança de dados</h1>
          <Badge variant={status.can_process_real_data ? "default" : "destructive"}>
            {status.can_process_real_data ? "Aprovada" : "Dados reais bloqueados"}
          </Badge>
          <Nr1LearningScienceInfoModal
            topicId="governance_audit_gates"
            customLabel="Governança por Gates, LGPD e Emergências (1.5.6)"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Retenção, acesso, descarte, incidentes e exceções com decisão versionada e verificável no servidor.
        </p>
      </header>

      <SaasMaturityCard summary={saasMaturity} />
      <IncidentRecoveryExerciseCard />
      <ExternalSessionDecisionCard summary={externalSessionDecision} workspacePath="/app/governance/external-readiness" />
      <DemoRehearsalCard summary={demoRehearsal} />
      <PublicDemoReadinessCard summary={publicDemoReadiness} />
      <EvidenceDossierCard summary={evidenceDossier} />
      <FormalAcceptanceCard summary={formalAcceptance} />
      <ResidualRiskRegisterCard summary={residualRiskRegister} />
      <RegulatoryJourneyCard summary={regulatoryJourney} />
      <PublishedBaselineCard summary={publishedBaselineReadiness} />
      <CommitteeSubmissionCard summary={committeeSubmission} />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Estado da política</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
          <div><span className="text-muted-foreground">Versão</span><p className="font-medium">{status.policy_version ?? "Ausente"}</p></div>
          <div><span className="text-muted-foreground">Estado</span><p className="font-medium">{status.policy_status}</p></div>
          <div><span className="text-muted-foreground">Processamento real</span><p className="font-medium">{status.can_process_real_data ? "Permitido pelo gate" : "Proibido"}</p></div>
        </CardContent>
      </Card>

      {status.blockers.length > 0 && (
        <Card className="border-amber-500/40">
          <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" /> Pendências obrigatórias</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {status.blockers.map((blocker) => <li key={blocker}>• {blockerLabels[blocker] ?? blocker}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Matriz de ciclo de vida</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b text-muted-foreground">
              <tr><th className="py-2">Classe</th><th>Responsável</th><th>Retenção</th><th>Acesso</th><th>Descarte</th><th>Exportação</th></tr>
            </thead>
            <tbody>
              {status.rules.map((rule) => (
                <tr key={rule.data_class} className="border-b last:border-0">
                  <td className="py-3 font-medium">{dataClassLabels[rule.data_class] ?? rule.data_class}</td>
                  <td>{rule.owner_role}</td>
                  <td>{rule.retention_days == null ? "Não decidido" : `${rule.retention_days} dias`}</td>
                  <td>{rule.access_mode}</td>
                  <td>{rule.disposal_method ?? "Não decidido"}</td>
                  <td>{rule.export_allowed ? "Permitida" : "Proibida"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Aprovação da política não concede acesso organizacional a respostas individuais. Acesso emergencial permanece service-only, temporário e sob dupla aprovação.
      </p>
    </div>
  );
}

function SaasMaturityCard({ summary }: { summary: SaasMaturitySummary }) {
  const statusTone = summary.canRunRealSaas
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : summary.canRunSyntheticMvp
      ? "bg-primary/15 text-primary border-primary/40"
      : "bg-amber-500/15 text-amber-300 border-amber-500/40";
  const openItems = summary.items.filter((item) => item.gateBlocking && !item.ready);

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Maturidade SaaS Fable 5
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canRunRealSaas
              ? "Elegivel a revisao SaaS real"
              : summary.canRunSyntheticMvp
                ? "MVP sintetico pronto"
                : "MVP sintetico bloqueado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Avalia fundacao, MVP sintetico, piloto controlado, SaaS real e escala. Este score nao aprova G1, nao libera dados reais e nao substitui aceite formal.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <JourneyMetric label="Estagio" value={saasStageLabel(summary.currentStage)} />
          <JourneyMetric label="Score" value={`${summary.scorePct}%`} />
          <JourneyMetric label="MVP sint." value={`${summary.syntheticMvpPct}%`} />
          <JourneyMetric label="SaaS real" value={`${summary.realSaasPct}%`} />
          <JourneyMetric label="Bloqueios" value={summary.blocked} accent={summary.blocked > 0 ? "text-amber-300" : undefined} />
        </div>

        {summary.nextStep && (
          <div className="rounded-md border border-amber-400/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">
              Proximo salto: {summary.nextStage ? saasStageLabel(summary.nextStage) : "Escala"} - {summary.nextStep.label}
            </p>
            <p className="text-muted-foreground">{summary.nextStep.detail}</p>
            {summary.blockers.length > 0 && (
              <p className="mt-1 text-amber-300">{saasMaturityBlockerLabel(summary.blockers[0])}</p>
            )}
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {openItems.slice(0, 6).map((item) => (
            <div key={item.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                {item.status === "partial" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {saasStageLabel(item.stage)} / {saasCategoryLabel(item.category)} - {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground">
            Politica: {summary.policyId}. Dados reais seguem No-Go ate G3 e aprovacoes formais.
          </p>
          <Link
            to="/plano-saas"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
          >
            Abrir Plano Executivo Go-Live &amp; PDF
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function DemoRehearsalCard({ summary }: { summary: DemoRehearsalSummary }) {
  const statusTone = summary.canRunExternalDemo
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : summary.canRunInternalSyntheticDemo
      ? "bg-primary/15 text-primary border-primary/40"
      : "bg-amber-500/15 text-amber-300 border-amber-500/40";
  const openExternal = summary.items.filter((item) => item.requiredForExternalDemo && !item.ready);

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <MonitorPlay className="h-4 w-4 text-primary" />
            Ensaio demo G1
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canRunExternalDemo
              ? "Demo externa pronta"
              : summary.canRunInternalSyntheticDemo
                ? "Ensaio interno pronto"
                : "Demo bloqueada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Roteiro de demonstracao sintetica com preflight, narrativa, navegacao, evidencias e handoff. Nao aprova G1, nao usa dados reais e nao substitui Playwright/Lovable.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Interno" value={`${summary.internalReady}/${summary.internalRequired}`} />
          <JourneyMetric label="Externo" value={`${summary.externalReady}/${summary.externalRequired}`} />
          <JourneyMetric label="Prontidao" value={`${summary.readinessPct}%`} />
          <JourneyMetric label="Bloqueios" value={summary.blocked} accent={summary.blocked > 0 ? "text-amber-300" : undefined} />
        </div>

        {summary.nextStep && (
          <div className="rounded-md border border-amber-400/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">Proximo bloqueio: {summary.nextStep.label}</p>
            <p className="text-muted-foreground">{summary.nextStep.detail}</p>
            {summary.blockers.length > 0 && (
              <p className="mt-1 text-amber-300">{demoRehearsalBlockerLabel(summary.blockers[0])}</p>
            )}
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {openExternal.slice(0, 4).map((item) => (
            <div key={item.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                {item.status === "partial" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {demoPhaseLabel(item.phase)} - {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. Demo externa segue bloqueada ate evidencias formais.
        </p>
      </CardContent>
    </Card>
  );
}

function PublicDemoReadinessCard({ summary }: { summary: PublicDemoReadinessSummary }) {
  const statusTone = summary.canRunPublicDemo
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : summary.canRunPrivateSyntheticWalkthrough
      ? "bg-primary/15 text-primary border-primary/40"
      : "bg-amber-500/15 text-amber-300 border-amber-500/40";
  const openPublicItems = summary.items.filter((item) => item.requiredForPublicDemo && !item.ready);

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            Demo publica G1
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canRunPublicDemo
              ? "Demo publica pronta"
              : summary.canRunPrivateSyntheticWalkthrough
                ? "Walkthrough privado pronto"
                : "Demo bloqueada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Separa walkthrough privado sintetico de apresentacao publica externa. A demo publica segue bloqueada ate browser/Playwright, Lovable, roteiro externo e revisoes formais.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Privado" value={`${summary.privateReady}/${summary.privateRequired}`} />
          <JourneyMetric label="Publico" value={`${summary.publicReady}/${summary.publicRequired}`} />
          <JourneyMetric label="Prontidao" value={`${summary.readinessPct}%`} />
          <JourneyMetric label="Bloqueios" value={summary.blockers.length} accent={summary.blockers.length > 0 ? "text-amber-300" : undefined} />
        </div>

        {summary.nextStep && (
          <div className="rounded-md border border-amber-400/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">Proximo bloqueio: {summary.nextStep.label}</p>
            <p className="text-muted-foreground">{summary.nextStep.detail}</p>
            {summary.blockers.length > 0 && (
              <p className="mt-1 text-amber-300">{publicDemoReadinessBlockerLabel(summary.blockers[0])}</p>
            )}
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {openPublicItems.slice(0, 5).map((item) => (
            <div key={item.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                {item.status === "partial" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {publicDemoCategoryLabel(item.category)} - {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. Nao aprova G1, nao comprova Lovable e nao libera dados reais.
        </p>
      </CardContent>
    </Card>
  );
}

function RegulatoryJourneyCard({ summary }: { summary: RegulatoryJourneySummary }) {
  const statusTone = summary.canRunSynthetic
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-amber-500/15 text-amber-300 border-amber-500/40";

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            Jornada regulatoria E2E sintetica
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canRunSynthetic ? "Contrato sintetico pronto" : "Contrato bloqueado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Contrato de navegacao e evidencias para demonstracao local. Ele nao aprova G1, nao executa dados reais e nao substitui teste de browser ou aceite formal.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Passos" value={`${summary.readySteps}/${summary.totalSteps}`} />
          <JourneyMetric label="Prontidao" value={`${summary.readinessPct}%`} />
          <JourneyMetric
            label="Bloqueios"
            value={summary.blockers.length}
            accent={summary.blockers.length > 0 ? "text-amber-300" : undefined}
          />
          <JourneyMetric label="Gate" value={summary.gate} />
        </div>

        <div className="rounded-md border border-border bg-background/50 p-2.5 text-xs">
          <p className="font-medium text-foreground">Proximo passo</p>
          <p className="text-muted-foreground">{summary.nextStep}</p>
          {summary.blockers.length > 0 && (
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {summary.blockers.slice(0, 3).map((blocker) => (
                <li key={blocker}>- {regulatoryJourneyBlockerLabel(blocker)}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {summary.steps.map((step) => (
            <Link
              key={step.key}
              to={step.route}
              className="flex items-start justify-between gap-3 rounded-md border border-border bg-card/50 p-2.5 transition-colors hover:border-primary/40"
            >
              <div className="flex min-w-0 gap-2">
                {step.ready ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {step.order}. {step.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {stageLabel(step.stage)} - {step.blockers[0] ? regulatoryJourneyBlockerLabel(step.blockers[0]) : step.evidence}
                  </p>
                </div>
              </div>
              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. Dados reais seguem No-Go ate G3 e aprovacoes formais.
        </p>
      </CardContent>
    </Card>
  );
}

function EvidenceDossierCard({ summary }: { summary: EvidenceDossierSummary }) {
  const statusTone = summary.canRequestFormalReview
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-amber-500/15 text-amber-300 border-amber-500/40";
  const blockers = summary.items.filter((item) => item.gateBlocking && !item.gateReady);

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <Files className="h-4 w-4 text-primary" />
            Pacote de evidencias G1
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canRequestFormalReview ? "Pronto para revisao formal" : "Revisao formal bloqueada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Consolida evidencias tecnicas, lacunas metodologicas e pendencias formais. Este pacote nao aprova G1, nao libera dados reais e nao substitui parecer competente.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Local" value={`${summary.readinessPct}%`} />
          <JourneyMetric label="Gate G1" value={`${summary.gateReadinessPct}%`} />
          <JourneyMetric label="Pendencias" value={summary.formalPending} accent={summary.formalPending > 0 ? "text-amber-300" : undefined} />
          <JourneyMetric label="Bloqueios" value={summary.blocked} accent={summary.blocked > 0 ? "text-destructive" : undefined} />
        </div>

        {summary.nextStep && (
          <div className="rounded-md border border-amber-400/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">Proximo bloqueio: {summary.nextStep.label}</p>
            <p className="text-muted-foreground">{summary.nextStep.detail}</p>
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {blockers.slice(0, 6).map((item) => (
            <div key={item.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                {item.technicalStatus === "ready" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {evidenceCategoryLabel(item.category)} - {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. O pacote permanece sintetico/local ate aprovacoes formais.
        </p>
      </CardContent>
    </Card>
  );
}

function FormalAcceptanceCard({ summary }: { summary: FormalAcceptanceSummary }) {
  const statusTone = summary.canAcceptSyntheticG1
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-destructive/15 text-destructive border-destructive/40";
  const openRoles = summary.roles.filter((role) => role.required && !role.ready);
  const openDecisions = summary.decisions.filter((decision) => decision.required && !decision.ready);
  const nextBlocker = summary.nextRole?.blockers[0] ?? summary.nextDecision?.blockers[0] ?? null;

  return (
    <Card className="border-destructive/25 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-destructive" />
            Aceite formal G1
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canAcceptSyntheticG1 ? "Pronto para aceite sintetico" : "Aceite bloqueado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Mapa de papeis, autoridade, substitutos e decisoes disciplinares. Cada evidencia futura exige referencia e SHA-256; o card nao assina o gate, nao aprova G1 e mantem dados reais proibidos ate G3.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Papeis" value={`${summary.readyRoles}/${summary.requiredRoles}`} />
          <JourneyMetric label="Decisoes" value={`${summary.readyDecisions}/${summary.requiredDecisions}`} />
          <JourneyMetric
            label="Ressalvas"
            value={summary.totalConditions}
            accent={summary.unboundedConditions > 0 ? "text-destructive" : undefined}
          />
          <JourneyMetric label="Bloqueios" value={summary.blockers.length} accent={summary.blockers.length > 0 ? "text-destructive" : undefined} />
        </div>

        {nextBlocker && (
          <div className="rounded-md border border-destructive/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">
              Proximo bloqueio: {summary.nextRole?.label ?? summary.nextDecision?.label}
            </p>
            <p className="text-muted-foreground">{formalAcceptanceBlockerLabel(nextBlocker)}</p>
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {openRoles.slice(0, 4).map((role) => (
            <div key={role.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{role.label}</p>
                  <p className="text-[11px] text-muted-foreground">{role.detail}</p>
                </div>
              </div>
            </div>
          ))}
          {openDecisions.slice(0, 4).map((decision) => (
            <div key={decision.discipline} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{decision.label}</p>
                  <p className="text-[11px] text-muted-foreground">{decision.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. Escopo permitido: campanha sintetica segura, sem trabalhadores reais.
        </p>
      </CardContent>
    </Card>
  );
}

function ResidualRiskRegisterCard({ summary }: { summary: ResidualRiskSummary }) {
  const statusTone = summary.canRequestRiskReview
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-destructive/15 text-destructive border-destructive/40";
  const openRisks = summary.risks
    .filter((risk) => risk.gateBlocking && !risk.ready)
    .sort((a, b) => b.score - a.score);

  return (
    <Card className="border-destructive/25 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Riscos residuais G1
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canRequestRiskReview ? "Pronto para revisao de risco" : "Risco residual bloqueante"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Consolida riscos tecnicos, metodologicos, formais, comerciais e operacionais. Este registro nao aceita risco por responsaveis, nao aprova G1 e nao libera dados reais.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
          <JourneyMetric label="Prontidao" value={`${summary.readinessPct}%`} />
          <JourneyMetric label="Score resid." value={summary.residualScore} accent={summary.residualScore > 0 ? "text-destructive" : undefined} />
          <JourneyMetric label="Criticos" value={summary.criticalOpen} accent={summary.criticalOpen > 0 ? "text-destructive" : undefined} />
          <JourneyMetric label="Bloq. gate" value={summary.gateBlockingOpen} accent={summary.gateBlockingOpen > 0 ? "text-destructive" : undefined} />
          <JourneyMetric label="Controlados" value={summary.controlled} />
        </div>

        {summary.nextStep && (
          <div className="rounded-md border border-destructive/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">
              Proximo risco: {summary.nextStep.label} ({riskSeverityLabel(summary.nextStep.severity)})
            </p>
            <p className="text-muted-foreground">{summary.nextStep.nextAction}</p>
            {summary.blockers.length > 0 && (
              <p className="mt-1 text-destructive">{residualRiskBlockerLabel(summary.blockers[0])}</p>
            )}
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {openRisks.slice(0, 6).map((risk) => (
            <div key={risk.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{risk.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {riskCategoryLabel(risk.category)} / {riskSeverityLabel(risk.severity)} - {risk.mitigation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. Dados reais seguem No-Go ate G3 e aprovacoes formais.
        </p>
      </CardContent>
    </Card>
  );
}

function PublishedBaselineCard({ summary }: { summary: PublishedBaselineSummary }) {
  const statusTone = summary.canReviewPublishedBaseline
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-amber-500/15 text-amber-300 border-amber-500/40";

  return (
    <Card className="border-amber-400/30 bg-amber-400/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-amber-300" />
            Baseline público GitHub / Lovable
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canReviewPublishedBaseline ? "Pronto para revisão" : "Revisão bloqueada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Atestado pontual de um baseline publicado. Ele exige CI oficial, proteção de branch, vínculo do projeto e recibo Lovable; não afirma que o HEAD atual está sincronizado nem autoriza nova publicação.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Alvos" value={summary.targets.join(" + ")} />
          <JourneyMetric label="Cobertura" value={`${summary.readinessPct}%`} />
          <JourneyMetric label="Checks" value={`${summary.completed}/${summary.total}`} />
          <JourneyMetric label="Bloqueios" value={summary.blockers.length} accent={summary.blockers.length > 0 ? "text-amber-300" : undefined} />
        </div>
        <div className="rounded-md border border-amber-400/30 bg-background/60 p-2.5 text-xs">
          <p className="font-medium text-foreground">Proximo passo</p>
          <p className="text-muted-foreground">{summary.nextStep}</p>
          {summary.blockers.length > 0 && (
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {summary.blockers.slice(0, 4).map((blocker) => (
                <li key={blocker}>- {publishedBaselineBlockerLabel(blocker)}</li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          Política: {summary.policyId}. Este atestado histórico não aprova G1, não libera dados reais e não representa um monitor do HEAD atual.
        </p>
      </CardContent>
    </Card>
  );
}

function CommitteeSubmissionCard({ summary }: { summary: CommitteeSubmissionSummary }) {
  const statusTone = summary.canSubmit
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
    : "bg-destructive/15 text-destructive border-destructive/40";
  const openItems = summary.items.filter((item) => item.gateBlocking && !item.ok);

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-destructive" />
            Submissao G2 ao comite
          </span>
          <Badge variant="outline" className={`text-[10px] ${statusTone}`}>
            {summary.canSubmit ? "Pronto para comite" : "Action 24 bloqueada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          A submissao ao comite permanece bloqueada ate G1, accountables, fontes, revisoes independentes, GitHub/Lovable e validacoes formais estarem evidenciados.
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <JourneyMetric label="Gate alvo" value={summary.targetGate} />
          <JourneyMetric label="Prontidao" value={`${summary.readinessPct}%`} />
          <JourneyMetric label="Checks" value={`${summary.ok}/${summary.total}`} />
          <JourneyMetric label="Bloqueios" value={summary.blockingOpen} accent={summary.blockingOpen > 0 ? "text-destructive" : undefined} />
        </div>

        {summary.nextStep && (
          <div className="rounded-md border border-destructive/30 bg-background/60 p-2.5 text-xs">
            <p className="font-medium text-foreground">Proximo bloqueio: {summary.nextStep.label}</p>
            <p className="text-muted-foreground">{summary.nextStep.detail}</p>
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {openItems.slice(0, 6).map((item) => (
            <div key={item.key} className="rounded-md border border-border bg-card/50 p-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{committeeCategoryLabel(item.category)} - {item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground">
          Politica: {summary.policyId}. Este card nao submete G2, nao aprova G1 e nao libera dados reais.
        </p>
      </CardContent>
    </Card>
  );
}

function JourneyMetric({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 px-3 py-2">
      <p className={`text-sm font-semibold ${accent ?? "text-foreground"}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function committeeCategoryLabel(category: CommitteeSubmissionCategory) {
  if (category === "gate") return "Gate";
  if (category === "accountability") return "Responsaveis";
  if (category === "methodology") return "Metodologia";
  if (category === "technical") return "Tecnico";
  return "Operacao";
}

function evidenceCategoryLabel(category: EvidenceDossierCategory) {
  if (category === "runtime") return "Runtime";
  if (category === "database") return "Banco";
  if (category === "methodology") return "Metodologia";
  if (category === "work_context") return "Trabalho real";
  if (category === "intervention") return "Intervencao";
  if (category === "release") return "Publicacao";
  return "Formal";
}

function saasStageLabel(stage: SaasMaturityStage) {
  if (stage === "foundation") return "Fundacao";
  if (stage === "synthetic_mvp") return "MVP sintetico";
  if (stage === "controlled_pilot") return "Piloto";
  if (stage === "real_saas") return "SaaS real";
  return "Escala";
}

function saasCategoryLabel(category: SaasMaturityCategory) {
  if (category === "product") return "Produto";
  if (category === "privacy") return "Privacidade";
  if (category === "methodology") return "Metodologia";
  if (category === "operations") return "Operacao";
  if (category === "release") return "Publicacao";
  return "Comercial";
}

function demoPhaseLabel(phase: DemoRehearsalPhase) {
  if (phase === "preflight") return "Preflight";
  if (phase === "narrative") return "Narrativa";
  if (phase === "navigation") return "Navegacao";
  if (phase === "evidence") return "Evidencia";
  if (phase === "limits") return "Limites";
  return "Handoff";
}

function publicDemoCategoryLabel(category: PublicDemoCategory) {
  if (category === "runtime") return "Runtime";
  if (category === "narrative") return "Narrativa";
  if (category === "evidence") return "Evidencia";
  if (category === "release") return "Publicacao";
  if (category === "approval") return "Aprovacao";
  return "Acessibilidade";
}

function riskCategoryLabel(category: ResidualRiskCategory) {
  if (category === "privacy") return "Privacidade";
  if (category === "methodology") return "Metodologia";
  if (category === "regulatory") return "Regulatorio";
  if (category === "release") return "Publicacao";
  if (category === "operation") return "Operacao";
  if (category === "commercial") return "Comercial";
  return "Seguranca";
}

function riskSeverityLabel(severity: ResidualRiskSeverity) {
  if (severity === "critical") return "Critico";
  if (severity === "high") return "Alto";
  if (severity === "medium") return "Medio";
  return "Baixo";
}

function stageLabel(stage: RegulatoryJourneyStage) {
  if (stage === "foundation") return "Fundacao";
  if (stage === "measurement") return "Medicao";
  if (stage === "work_context") return "Trabalho real";
  if (stage === "risk") return "Risco";
  if (stage === "intervention") return "Intervencao";
  if (stage === "evidence") return "Evidencia";
  return "Governanca";
}
