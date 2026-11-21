import { supabase } from "@/lib/runtime/appSupabaseClient";

export type DataGovernanceRuleSummary = {
  data_class: string;
  owner_role: string;
  retention_days: number | null;
  access_mode: string;
  disposal_method: string | null;
  emergency_access_mode: string;
  export_allowed: boolean;
};

export type DataGovernanceStatus = {
  policy_version: string | null;
  policy_status: string;
  can_process_real_data: boolean;
  blockers: string[];
  rules: DataGovernanceRuleSummary[];
};

export async function fetchDataGovernanceStatus(organizationId: string): Promise<DataGovernanceStatus> {
  const { data, error } = await supabase.rpc("get_data_governance_status" as never, {
    _organization_id: organizationId,
  } as never);
  if (error) throw error;
  const row = (data as DataGovernanceStatus[] | null)?.[0];
  if (!row) throw new Error("Status de governança indisponível; processamento permanece bloqueado.");
  return row;
}
