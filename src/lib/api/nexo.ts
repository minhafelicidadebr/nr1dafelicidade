import { supabase } from "@/lib/runtime/appSupabaseClient";
import type { NexoRecommendationRun } from "@/lib/nexo/driverRecommendation";

export async function fetchNexoDriverRecommendations(scope: {
  cycleId: string;
  scopeId?: string | null;
}): Promise<NexoRecommendationRun> {
  const { data, error } = await supabase.functions.invoke("nexo-driver-recommendations", {
    body: {
      cycle_id: scope.cycleId,
      scope_type: "cycle",
      scope_id: scope.scopeId ?? scope.cycleId,
    },
  });

  if (error) throw error;
  return data as NexoRecommendationRun;
}
