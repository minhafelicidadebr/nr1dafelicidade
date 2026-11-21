export type SupabaseRuntimeEnv = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

export type SupabaseRuntimeConfig = {
  configured: boolean;
  url: string;
  publishableKey: string;
  missingKeys: string[];
  invalidKeys: string[];
};

export type SupabaseRuntimeAvailabilityCode =
  | "available"
  | "configuration_missing"
  | "unsafe_browser_key"
  | "data_gate_blocked";

export type SupabaseRuntimeAvailability = Readonly<{
  available: boolean;
  code: SupabaseRuntimeAvailabilityCode;
  gate: string;
}>;

const FALLBACK_LOCAL_SUPABASE_URL = "http://127.0.0.1:54321";
const FALLBACK_LOCAL_SUPABASE_KEY = "synthetic-local-placeholder-key";

export function resolveSupabaseRuntimeConfig(env: SupabaseRuntimeEnv): SupabaseRuntimeConfig {
  const url = clean(env.VITE_SUPABASE_URL);
  const publishableKey = clean(env.VITE_SUPABASE_PUBLISHABLE_KEY);
  const unsafeBrowserKey = publishableKey?.startsWith("sb_secret_") ?? false;
  const missingKeys = [
    url ? null : "VITE_SUPABASE_URL",
    publishableKey ? null : "VITE_SUPABASE_PUBLISHABLE_KEY",
  ].filter((key): key is string => key !== null);
  const invalidKeys = unsafeBrowserKey ? ["VITE_SUPABASE_PUBLISHABLE_KEY"] : [];

  return {
    configured: missingKeys.length === 0 && invalidKeys.length === 0,
    url: url ?? FALLBACK_LOCAL_SUPABASE_URL,
    publishableKey: unsafeBrowserKey
      ? FALLBACK_LOCAL_SUPABASE_KEY
      : publishableKey ?? FALLBACK_LOCAL_SUPABASE_KEY,
    missingKeys,
    invalidKeys,
  };
}

export function evaluateSupabaseRuntimeAvailability(
  config: SupabaseRuntimeConfig,
  dataGateStatus: { allowed: boolean; gate: string },
): SupabaseRuntimeAvailability {
  if (config.invalidKeys.length > 0) {
    return Object.freeze({ available: false, code: "unsafe_browser_key", gate: dataGateStatus.gate });
  }
  if (!config.configured) {
    return Object.freeze({ available: false, code: "configuration_missing", gate: dataGateStatus.gate });
  }
  if (!dataGateStatus.allowed) {
    return Object.freeze({ available: false, code: "data_gate_blocked", gate: dataGateStatus.gate });
  }
  return Object.freeze({ available: true, code: "available", gate: dataGateStatus.gate });
}

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
