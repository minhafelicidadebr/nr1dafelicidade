// Shared signup helpers for the three persona flows.
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { supabaseRuntimeAvailability } from "@/lib/runtime/appSupabaseClient";

export type Persona = "sst" | "manager" | "collaborator";

export const SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE =
  "Cadastro indisponível nesta demonstração sintética. Nenhum dado foi enviado.";

export const signupRuntimeAvailability = supabaseRuntimeAvailability;

class SignupRuntimeUnavailableError extends Error {
  readonly code = "SIGNUP_RUNTIME_UNAVAILABLE";

  constructor() {
    super(SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE);
    this.name = "SignupRuntimeUnavailableError";
  }
}

function assertSignupRuntimeAvailable() {
  if (!signupRuntimeAvailability.available) {
    throw new SignupRuntimeUnavailableError();
  }
}

type SupabaseErrorInfo = {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
  raw?: string;
};

export function extractSupabaseError(error: unknown): SupabaseErrorInfo {
  const fallback = "Falha inesperada no backend.";

  if (typeof error === "string") {
    return { message: error, raw: JSON.stringify(error) };
  }

  if (error instanceof Error) {
    const record = error as Error & {
      details?: string;
      hint?: string;
      code?: string;
    };

    return {
      message: record.message || fallback,
      details: typeof record.details === "string" ? record.details : undefined,
      hint: typeof record.hint === "string" ? record.hint : undefined,
      code: typeof record.code === "string" ? record.code : undefined,
      raw: safeJsonStringify(error),
    };
  }

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    return {
      message: typeof record.message === "string" && record.message.trim() ? record.message : fallback,
      details: typeof record.details === "string" ? record.details : undefined,
      hint: typeof record.hint === "string" ? record.hint : undefined,
      code: typeof record.code === "string" ? record.code : undefined,
      raw: safeJsonStringify(error),
    };
  }

  return { message: fallback, raw: safeJsonStringify(error) };
}

function safeJsonStringify(value: unknown) {
  try {
    const raw = JSON.stringify(value);
    return raw === undefined ? String(value) : raw;
  } catch {
    return String(value);
  }
}

function logSupabaseError(context: string, error: unknown) {
  const info = extractSupabaseError(error);
  console.error(`[signup] ${context}`, {
    message: info.message,
    details: info.details,
    hint: info.hint,
    code: info.code,
    raw: info.raw,
  });
  return info;
}

function formatTechnicalUserMessage(_info: SupabaseErrorInfo, fallback: string) {
  // Technical details (message/details/hint/code) are logged server-side via
  // logSupabaseError only. Do not surface Postgres internals to end users.
  return fallback;
}

export async function signUpUser(opts: {
  email: string;
  password: string;
  fullName: string;
  persona: Persona;
  sector?: string;
  pendingProvision?: PendingProvision;
}) {
  assertSignupRuntimeAvailable();
  const redirectTo = `${window.location.origin}/app`;
  const pendingMetadata = opts.pendingProvision ? pendingProvisionToMetadata(opts.pendingProvision) : {};
  const { data, error } = await supabase.auth.signUp({
    email: opts.email,
    password: opts.password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        full_name: opts.fullName,
        persona: opts.persona,
        role: opts.persona,
        sector: opts.sector ?? null,
        ...pendingMetadata,
      },
    },
  });
  if (error) {
    logSupabaseError("signUpUser", error);
    throw error;
  }
  return data;
}

export async function setPersonaProfile(persona: Persona, sector?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("profiles")
    .update({ persona, role: persona, sector: sector ?? null })
    .eq("id", user.id);
}

export async function createOrgForSST(opts: {
  name: string;
  cnpj?: string;
  sectors?: string[];
  sector?: string;
  headcount?: number;
  instrument?: string;
  size_band?: string;
}) {
  assertSignupRuntimeAvailable();
  const { data, error } = await supabase.rpc("create_sst_organization", {
    _name: opts.name,
    _cnpj: opts.cnpj || undefined,
    _sector: opts.sector || (opts.sectors?.[0] ?? undefined),
    _sectors: opts.sectors,
    _headcount: opts.headcount,
    _size_band: opts.size_band,
    _instrument: opts.instrument,
  });
  const row = (Array.isArray(data) ? data[0] : data) as { id: string; invite_code: string } | undefined;
  if (error || !row) {
    const fallback = error ?? new Error("RPC create_sst_organization retornou sem dados.");
    logSupabaseError("createOrgForSST", fallback);
    throw fallback;
  }
  return row;
}

export async function joinOrgByCode(code: string, persona: "manager" | "collaborator", sector?: string) {
  assertSignupRuntimeAvailable();
  const { data, error } = await supabase.rpc("join_org_by_invite_code", {
    _code: code,
    _persona: persona,
    _sector: sector ?? null,
  });
  if (error) {
    logSupabaseError("joinOrgByCode", error);
    if (/invalid_code/.test(error.message)) throw new Error("Código de empresa inválido.");
    throw error;
  }
  return data as string;
}

const PENDING_KEY = "felicidade_pending_provision";

export type PendingProvision =
  | { kind: "org"; name: string; cnpj?: string; sectors?: string[]; headcount?: number; instrument?: string; size_band?: string }
  | { kind: "join"; code: string; persona: "manager" | "collaborator"; sector?: string };

function pendingProvisionToMetadata(p: PendingProvision) {
  if (p.kind === "org") {
    return {
      pending_provision_kind: "org",
      pending_org_name: p.name,
      pending_org_cnpj: p.cnpj ?? null,
      pending_org_sectors: p.sectors ?? [],
      pending_org_headcount: p.headcount ?? null,
      pending_org_size_band: p.size_band ?? null,
      pending_org_instrument: p.instrument ?? null,
    };
  }

  return {
    pending_provision_kind: "join",
    pending_join_code: p.code,
    pending_join_persona: p.persona,
    pending_join_sector: p.sector ?? null,
  };
}

function readPendingProvisionFromMetadata(metadata: unknown): PendingProvision | null {
  if (!metadata || typeof metadata !== "object") return null;

  const raw = metadata as Record<string, unknown>;

  if (raw.pending_provision_kind === "org" && typeof raw.pending_org_name === "string" && raw.pending_org_name.trim()) {
    return {
      kind: "org",
      name: raw.pending_org_name,
      cnpj: typeof raw.pending_org_cnpj === "string" ? raw.pending_org_cnpj : undefined,
      sectors: Array.isArray(raw.pending_org_sectors)
        ? raw.pending_org_sectors.filter((item): item is string => typeof item === "string")
        : undefined,
      headcount: typeof raw.pending_org_headcount === "number"
        ? raw.pending_org_headcount
        : typeof raw.pending_org_headcount === "string" && raw.pending_org_headcount.trim()
          ? Number(raw.pending_org_headcount)
          : undefined,
      size_band: typeof raw.pending_org_size_band === "string" ? raw.pending_org_size_band : undefined,
      instrument: typeof raw.pending_org_instrument === "string" ? raw.pending_org_instrument : undefined,
    };
  }

  if (
    raw.pending_provision_kind === "join"
    && typeof raw.pending_join_code === "string"
    && (raw.pending_join_persona === "manager" || raw.pending_join_persona === "collaborator")
  ) {
    return {
      kind: "join",
      code: raw.pending_join_code,
      persona: raw.pending_join_persona,
      sector: typeof raw.pending_join_sector === "string" ? raw.pending_join_sector : undefined,
    };
  }

  return null;
}

export function setPendingProvision(p: PendingProvision) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(p)); } catch { /* noop */ }
}
export function readPendingProvision(): PendingProvision | null {
  try { const raw = localStorage.getItem(PENDING_KEY); return raw ? JSON.parse(raw) as PendingProvision : null; } catch { return null; }
}
export function clearPendingProvision() {
  try { localStorage.removeItem(PENDING_KEY); } catch { /* noop */ }
}

export async function getPendingProvisionForCurrentUser(): Promise<PendingProvision | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return readPendingProvision() ?? readPendingProvisionFromMetadata(user.user_metadata);
}

export async function provisionPendingIfAny(): Promise<{ created: boolean; inviteCode?: string; pendingFound: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { created: false, pendingFound: false };

  const pending = readPendingProvision() ?? readPendingProvisionFromMetadata(user.user_metadata);
  if (!pending) return { created: false, pendingFound: false };

  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).maybeSingle();
  if (profile?.organization_id) {
    clearPendingProvision();
    return { created: false, pendingFound: true };
  }

  try {
    if (pending.kind === "org") {
      const org = await createOrgForSST(pending);
      clearPendingProvision();
      return { created: true, inviteCode: org.invite_code, pendingFound: true };
    } else {
      await joinOrgByCode(pending.code, pending.persona, pending.sector);
      clearPendingProvision();
      return { created: true, pendingFound: true };
    }
  } catch (error) {
    const info = logSupabaseError("provisionPendingIfAny", error);
    return {
      created: false,
      pendingFound: true,
      error: translateAuthError(info),
    };
  }
}

export function translateAuthError(error: unknown) {
  const info = extractSupabaseError(error);
  const msg = [info.message, info.details, info.hint, info.code].filter(Boolean).join(" ");

  if (/invalid login credentials/i.test(msg)) return "Credenciais inválidas.";
  if (/already registered|user already/i.test(msg)) return "Este e-mail já possui conta. Faça login.";
  if (/weak password|should be at least/i.test(msg)) return "Senha fraca. Use ao menos 8 caracteres.";
  if (/SIGNUP_RUNTIME_UNAVAILABLE|REAL_DATA_GATE_BLOCKED|No-Go para dados reais/i.test(msg)) {
    return SIGNUP_RUNTIME_UNAVAILABLE_MESSAGE;
  }
  if (/row-level security|42501/i.test(msg)) return "Não foi possível criar a empresa por regra de segurança. Tente novamente.";
  if (/organization_name_required/i.test(msg)) return "Informe o nome da empresa.";
  if (/auth_required|Sessão ausente/i.test(msg)) return "Sua sessão não foi confirmada. Faça login e tente novamente.";
  if (/invalid_code/i.test(msg)) return "Código de empresa inválido.";
  if (/invalid input value for enum app_role|manager|worker/i.test(msg)) {
    return "Não foi possível vincular o papel do usuário à empresa por incompatibilidade de perfis no backend.";
  }

  return formatTechnicalUserMessage(info, "Não foi possível concluir a operação.");
}
