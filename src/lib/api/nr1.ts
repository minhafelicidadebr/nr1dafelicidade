import { supabase } from "@/lib/runtime/appSupabaseClient";
import { currentDataGateStatus } from "@/lib/runtime/dataGate";
import { readSyntheticPilotOrg } from "@/lib/runtime/syntheticPilotSession";

export async function fetchMyOrg() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return currentDataGateStatus.requestedMode === "synthetic"
        ? readSyntheticPilotOrg()
        : null;
    }
    const { data: profile } = await supabase
      .from("profiles").select("organization_id").eq("id", user.id).single();
    if (!profile?.organization_id) return null;
    const { data: org } = await supabase
      .from("organizations").select("*").eq("id", profile.organization_id).single();
    return org;
  } catch {
    return currentDataGateStatus.requestedMode === "synthetic"
      ? readSyntheticPilotOrg()
      : null;
  }
}

export async function createOrganization(payload: {
  name: string; cnpj?: string; sector?: string; size_band?: string;
  sectors?: string[]; headcount?: number;
}) {
  const { data, error } = await supabase.rpc("create_sst_organization", {
    _name: payload.name,
    _cnpj: payload.cnpj ?? undefined,
    _sector: payload.sector ?? undefined,
    _size_band: payload.size_band ?? undefined,
    _sectors: payload.sectors ?? undefined,
    _headcount: payload.headcount ?? undefined,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row as { id: string; invite_code: string };
}

export function genToken() {
  return crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2, 8);
}

export async function updateOrganization(
  orgId: string,
  patch: {
    name?: string;
    cnpj?: string | null;
    sector?: string | null;
    size_band?: string | null;
    headcount?: number | null;
    sectors?: string[];
  },
) {
  const { data, error } = await supabase
    .from("organizations")
    .update(patch)
    .eq("id", orgId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export const cycleHorizons = [
  { value: "short", label: "Curto prazo (90 dias)" },
  { value: "medium", label: "Médio prazo (6 meses)" },
  { value: "long", label: "Longo prazo (12 meses)" },
];
