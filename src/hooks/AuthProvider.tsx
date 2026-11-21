import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/runtime/appSupabaseClient";
import { supabaseRuntimeAvailability } from "@/lib/runtime/appSupabaseClient";
import { AuthContext, type Profile } from "@/hooks/authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabaseRuntimeAvailability.available) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setProfile({
        id: data.id,
        full_name: data.full_name,
        company_name: data.company_name,
        company_size: data.company_size,
        role: data.role,
        plan: data.plan,
        ift_balance: data.ift_balance ?? 0,
        streak_days: data.streak_days ?? 0,
        badge_count: data.badge_count ?? 0,
        avatar_url: data.avatar_url,
      });
    }
  }, []);

  useEffect(() => {
    if (!supabaseRuntimeAvailability.available) {
      setSession(null);
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        setTimeout(() => fetchProfile(nextSession.user.id), 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    void supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) void fetchProfile(currentSession.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = async () => {
    if (supabaseRuntimeAvailability.available) await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (supabaseRuntimeAvailability.available && user) await fetchProfile(user.id);
  };

  const isPremium = profile?.plan === "professional" || profile?.plan === "enterprise";

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isPremium, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
