import { describe, expect, it } from "vitest";
import {
  evaluateSupabaseRuntimeAvailability,
  resolveSupabaseRuntimeConfig,
} from "./supabaseConfig";

describe("supabase runtime config", () => {
  it("falls back to a local synthetic placeholder when Lovable env vars are missing", () => {
    const config = resolveSupabaseRuntimeConfig({});

    expect(config.configured).toBe(false);
    expect(config.url).toBe("http://127.0.0.1:54321");
    expect(config.publishableKey).toBe("synthetic-local-placeholder-key");
    expect(config.missingKeys).toEqual(["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"]);
    expect(config.invalidKeys).toEqual([]);
  });

  it("accepts explicit Supabase runtime configuration", () => {
    const config = resolveSupabaseRuntimeConfig({
      VITE_SUPABASE_URL: " https://example.supabase.co ",
      VITE_SUPABASE_PUBLISHABLE_KEY: " sb_publishable_example ",
    });

    expect(config.configured).toBe(true);
    expect(config.url).toBe("https://example.supabase.co");
    expect(config.publishableKey).toBe("sb_publishable_example");
    expect(config.missingKeys).toEqual([]);
    expect(config.invalidKeys).toEqual([]);
  });

  it("rejects a secret Supabase key in browser runtime configuration", () => {
    const config = resolveSupabaseRuntimeConfig({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_secret_example",
    });

    expect(config.configured).toBe(false);
    expect(config.publishableKey).toBe("synthetic-local-placeholder-key");
    expect(config.missingKeys).toEqual([]);
    expect(config.invalidKeys).toEqual(["VITE_SUPABASE_PUBLISHABLE_KEY"]);
  });

  it("allows operations only with safe configuration and an open data gate", () => {
    const safeConfig = resolveSupabaseRuntimeConfig({
      VITE_SUPABASE_URL: "http://127.0.0.1:54321",
      VITE_SUPABASE_PUBLISHABLE_KEY: "local-anon-key",
    });

    expect(evaluateSupabaseRuntimeAvailability(safeConfig, { allowed: true, gate: "G0" }))
      .toMatchObject({ available: true, code: "available" });
    expect(evaluateSupabaseRuntimeAvailability(safeConfig, { allowed: false, gate: "G0" }))
      .toMatchObject({ available: false, code: "data_gate_blocked" });
    expect(evaluateSupabaseRuntimeAvailability(resolveSupabaseRuntimeConfig({}), {
      allowed: true,
      gate: "G0",
    })).toMatchObject({ available: false, code: "configuration_missing" });
  });
});
