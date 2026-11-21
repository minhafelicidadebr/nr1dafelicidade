import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, User, Building2, Users, Briefcase, CheckCircle2, FileCheck2, Shield, Trash2 } from "lucide-react";
import {
  g1LeadEmployeeBands,
  g1LeadIntakeSummary,
  g1LeadIntakeRetentionPolicy,
  g1LeadIntakeStorageKey,
  g1LeadPrimaryGoals,
} from "@/data/g1LeadIntakeGovernance";
import {
  buildControlledLeadRecord,
  isActiveControlledLeadRecord,
  isControlledLeadRecord,
  type ControlledLeadDraftRecord,
} from "@/lib/commercial/leadIntakeGovernance";
import { loadRetainedItems, saveRetainedItems } from "@/lib/governance/localRetention";

type FormProfile = "short_demo_form" | "diagnostic_request_form" | "roadmap_request_form" | "pilot_interest_form" | "public_sector_form";

interface Props {
  formProfile?: FormProfile;
  routeId?: string;
  headline?: string;
  subtitle?: string;
  ctaLabel?: string;
  onSuccess?: () => void;
}

export default function LeadCaptureForm({
  formProfile = "short_demo_form",
  routeId = "cta_demo",
  headline = "Prepare uma conversa de aderência",
  subtitle = "Crie um rascunho local para organizar escopo, limites e próximos passos sem dados de trabalhadores.",
  ctaLabel = "Salvar rascunho local",
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<ControlledLeadDraftRecord | null>(null);
  const [deleted, setDeleted] = useState(false);
  const [form, setForm] = useState({
    contact_name: "",
    work_email: "",
    company_name: "",
    role: "",
    employee_count_band: "",
    primary_goal: "",
    consent_lgpd: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const now = new Date();
      const loaded = loadRetainedItems(
        window.localStorage,
        g1LeadIntakeStorageKey,
        g1LeadIntakeRetentionPolicy,
        { isItem: isControlledLeadRecord },
      );
      const activeRecords = loaded.items.filter((item) => isActiveControlledLeadRecord(item, {
        policyId: g1LeadIntakeRetentionPolicy.policyId,
        now,
      }));
      saveRetainedItems(
        window.localStorage,
        g1LeadIntakeStorageKey,
        activeRecords,
        g1LeadIntakeRetentionPolicy,
        { now },
      );
    } catch {
      // The submit path reports storage unavailability without breaking the public page.
    }
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.consent_lgpd) {
      toast.error("Voce precisa aceitar os termos LGPD para continuar.");
      return;
    }
    setLoading(true);

    try {
      if (typeof window === "undefined") throw new Error("Ambiente local indisponivel.");
      if (!g1LeadIntakeSummary.canCollectControlledContact || g1LeadIntakeSummary.canUseRemoteCrm) {
        throw new Error("Politica de intake local bloqueada.");
      }
      if (typeof window.crypto?.randomUUID !== "function") {
        throw new Error("Navegador sem geracao segura de comprovante local.");
      }
      const now = new Date();
      const record = buildControlledLeadRecord(
        {
          form_profile_id: formProfile,
          route_id: routeId,
          contact_name: form.contact_name,
          work_email: form.work_email,
          company_name: form.company_name,
          role: form.role,
          employee_count_band: form.employee_count_band,
          primary_goal: form.primary_goal,
          consent_lgpd: form.consent_lgpd,
        },
        {
          policyId: g1LeadIntakeRetentionPolicy.policyId,
          retentionDays: g1LeadIntakeRetentionPolicy.ttlDays,
          receiptId: window.crypto.randomUUID(),
          allowedEmployeeCountBands: g1LeadEmployeeBands.map((band) => band.value),
          allowedPrimaryGoals: g1LeadPrimaryGoals.map((goal) => goal.value),
          now,
        },
      );
      const loaded = loadRetainedItems(
        window.localStorage,
        g1LeadIntakeStorageKey,
        g1LeadIntakeRetentionPolicy,
        { isItem: isControlledLeadRecord },
      );
      const activeRecords = loaded.items.filter((item) => isActiveControlledLeadRecord(item, {
        policyId: g1LeadIntakeRetentionPolicy.policyId,
        now,
      }));

      saveRetainedItems(
        window.localStorage,
        g1LeadIntakeStorageKey,
        [...activeRecords, record],
        g1LeadIntakeRetentionPolicy,
        { now },
      );
      setSubmittedRecord(record);
      setDeleted(false);
      toast.success("Rascunho salvo somente neste navegador.");
      onSuccess?.();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const deleteLocalDraft = () => {
    if (!submittedRecord || typeof window === "undefined") return;
    try {
      const now = new Date();
      const loaded = loadRetainedItems(
        window.localStorage,
        g1LeadIntakeStorageKey,
        g1LeadIntakeRetentionPolicy,
        { isItem: isControlledLeadRecord },
      );
      const remaining = loaded.items.filter((item) =>
        isActiveControlledLeadRecord(item, { policyId: g1LeadIntakeRetentionPolicy.policyId, now }) &&
        item.receiptId !== submittedRecord.receiptId,
      );
      saveRetainedItems(
        window.localStorage,
        g1LeadIntakeStorageKey,
        remaining,
        g1LeadIntakeRetentionPolicy,
        { now },
      );
      setSubmittedRecord(null);
      setDeleted(true);
      toast.success("Rascunho excluido deste navegador.");
    } catch {
      toast.error("Nao foi possivel excluir o rascunho local neste navegador.");
    }
  };

  if (submittedRecord) {
    return (
      <div role="status" aria-live="polite" className="text-center py-8 space-y-4 text-surface-deep-fg" style={{ color: "#e6ebf0" }}>
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-success/10">
          <FileCheck2 className="h-8 w-8 text-emerald-300" />
        </div>
        <h3 className="font-display text-xl font-bold text-surface-deep-fg" style={{ color: "#e6ebf0" }}>Rascunho salvo somente neste navegador</h3>
        <p className="text-sm text-surface-deep-muted max-w-sm mx-auto" style={{ color: "#b8c3d1" }}>
          Nada foi enviado à equipe e nenhuma reunião foi agendada. CRM remoto, piloto pago e dados de trabalhadores continuam bloqueados.
        </p>
        <div className="rounded-xl border border-hairline bg-surface-deep/80 p-4 text-left text-xs space-y-2 text-surface-deep-fg" style={{ backgroundColor: "rgba(5, 8, 15, 0.8)", color: "#e6ebf0" }}>
          <p><strong>Comprovante local:</strong> <span className="font-mono break-all">{submittedRecord.receiptId}</span></p>
          <p><strong>Expira em:</strong> {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(submittedRecord.expiresAt))}</p>
          <p className="text-surface-deep-muted" style={{ color: "#b8c3d1" }}>Guarde este código apenas para identificar o rascunho neste dispositivo. Ele não confirma entrega ou atendimento.</p>
        </div>
        <button type="button" onClick={deleteLocalDraft}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/40 px-4 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-300/10 transition-colors"
          style={{ color: "#fca5a5", borderColor: "rgba(252, 165, 165, 0.4)" }}>
          <Trash2 className="h-4 w-4" /> Excluir rascunho local
        </button>
      </div>
    );
  }

  if (deleted) {
    return (
      <div role="status" className="text-center py-8 space-y-4 text-surface-deep-fg" style={{ color: "#e6ebf0" }}>
        <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto" />
        <h3 className="font-display text-xl font-bold text-surface-deep-fg" style={{ color: "#e6ebf0" }}>Rascunho excluído deste navegador</h3>
        <p className="text-sm text-surface-deep-muted" style={{ color: "#b8c3d1" }}>Nenhuma solicitação foi enviada à equipe.</p>
        <button type="button" onClick={() => setDeleted(false)} className="rounded-xl border border-hairline px-4 py-2.5 text-xs font-semibold text-surface-deep-fg hover:bg-surface-deep/80 transition-colors" style={{ color: "#e6ebf0" }}>
          Preparar outro rascunho
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-display text-lg font-bold">{headline}</h3>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-foreground/85">
        Este formulário cria apenas um rascunho local por até {g1LeadIntakeRetentionPolicy.ttlDays} dias. Ele não envia dados à equipe e não agenda reunião. Não inclua dados de trabalhadores.
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="lead-contact-name" className="sr-only">Seu nome</label>
            <input id="lead-contact-name" autoComplete="name" type="text" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} placeholder="Seu nome *" required maxLength={120}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="lead-work-email" className="sr-only">E-mail corporativo</label>
            <input id="lead-work-email" autoComplete="email" type="email" value={form.work_email} onChange={(e) => update("work_email", e.target.value)} placeholder="E-mail corporativo *" required maxLength={254}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="lead-company-name" className="sr-only">Nome da empresa</label>
            <input id="lead-company-name" autoComplete="organization" type="text" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="Nome da empresa *" required maxLength={160}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <label htmlFor="lead-role" className="sr-only">Seu cargo</label>
            <input id="lead-role" autoComplete="organization-title" type="text" value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Seu cargo" maxLength={120}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select aria-label="Porte da empresa" value={form.employee_count_band} onChange={(e) => update("employee_count_band", e.target.value)} required
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none">
              <option value="">Porte da empresa *</option>
              {g1LeadEmployeeBands.map((band) => <option key={band.value} value={band.value}>{band.label}</option>)}
            </select>
          </div>
          <select aria-label="Objetivo principal" value={form.primary_goal} onChange={(e) => update("primary_goal", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none">
            <option value="">Objetivo principal</option>
            {g1LeadPrimaryGoals.map((goal) => <option key={goal.value} value={goal.value}>{goal.label}</option>)}
          </select>
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Os dados ficam somente neste navegador para preparar uma conversa futura. Não há CRM, envio ou acesso pela equipe neste gate.
            </p>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={form.consent_lgpd} onChange={(e) => update("consent_lgpd", e.target.checked)}
              className="mt-0.5 rounded border-border" />
            <span className="text-[11px] text-foreground">
              Autorizo salvar este rascunho neste navegador por até {g1LeadIntakeRetentionPolicy.ttlDays} dias e confirmo que não incluirei dados de trabalhadores. *
            </span>
          </label>
        </div>

        <button type="submit" disabled={loading || !form.consent_lgpd}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Registrando..." : ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
