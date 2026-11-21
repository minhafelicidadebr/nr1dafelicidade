import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  company_size: string | null;
  role: string | null;
  plan: string | null;
  ift_balance: number;
  streak_days: number;
  badge_count: number;
  avatar_url: string | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isPremium: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isPremium: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});
