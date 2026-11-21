import { supabase } from "@/lib/runtime/appSupabaseClient";

export type CycleMethodologyStatus = {
  cycle_id: string;
  instrument_key: string;
  instrument_version: string;
  instrument_status: "draft" | "review" | "approved" | "retired";
  source_status: "unverified" | "verified";
  license_status: "unknown" | "under_review" | "approved" | "restricted";
  runtime_ready: boolean;
  can_open: boolean;
  blockers: string[];
};

export async function fetchCycleMethodologyStatus(organizationId: string) {
  const { data, error } = await supabase.rpc("get_cycle_methodology_status" as never, {
    _organization_id: organizationId,
  } as never);
  if (error) throw error;
  return (data ?? []) as CycleMethodologyStatus[];
}
