import { useCallback } from "react";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { motivationToasts } from "@/data/driversData";

export function useProgress() {
  const { user, refreshProfile } = useAuth();

  const saveCompletion = useCallback(
    async (driverSlug: string, dynamicId: string, score?: number, iftEarned: number = 0) => {
      if (!user) return;

      try {
        // Upsert progress
        const { error } = await supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            driver_slug: driverSlug,
            dynamic_id: dynamicId,
            completed: true,
            completed_at: new Date().toISOString(),
            score: score ?? null,
            ift_earned: iftEarned,
          },
          { onConflict: "user_id,driver_slug,dynamic_id" }
        );

        if (error) {
          // If unique constraint doesn't exist, just insert
          if (error.code === "42P10" || error.code === "23505") {
            await supabase.from("user_progress").insert({
              user_id: user.id,
              driver_slug: driverSlug,
              dynamic_id: dynamicId,
              completed: true,
              completed_at: new Date().toISOString(),
              score: score ?? null,
              ift_earned: iftEarned,
            });
          } else {
            console.error("Progress save error:", error);
          }
        }

        // Update IFT balance in profile
        if (iftEarned > 0) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("ift_balance")
            .eq("id", user.id)
            .single();

          if (profile) {
            await supabase
              .from("profiles")
              .update({ ift_balance: (profile.ift_balance ?? 0) + iftEarned })
              .eq("id", user.id);
          }

          // Show motivation toast
          const randomToast = motivationToasts[Math.floor(Math.random() * motivationToasts.length)];
          toast.success(randomToast);
        }

        await refreshProfile();
      } catch (e) {
        console.error("Progress error:", e);
      }
    },
    [user, refreshProfile]
  );

  return { saveCompletion };
}
