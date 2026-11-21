import { describe, expect, it, vi } from "vitest";
import {
  DataGateBlockedError,
  classifyDataTarget,
  createDataFetch,
  evaluateDataGate,
} from "./dataGate";

const g0Policy = {
  version: "test-g0",
  gate: "G0",
  maximumAllowedDataMode: "synthetic" as const,
  realDataApprovalReference: null,
  reason: "real data blocked",
};

describe("G0 data gate", () => {
  it.each([
    "http://localhost:54321/rest/v1/cycles",
    "http://127.0.0.1:54321/functions/v1/test",
    "http://[::1]:54321/auth/v1/token",
  ])("classifies %s as a local service", (url) => {
    expect(classifyDataTarget(url)).toBe("local");
  });

  it("allows a local service when the requested mode is synthetic", () => {
    const status = evaluateDataGate(
      "http://127.0.0.1:54321/rest/v1/cycles",
      { VITE_DATA_MODE: "synthetic" },
      g0Policy,
    );

    expect(status).toMatchObject({ allowed: true, targetKind: "local", requestedMode: "synthetic" });
  });

  it("blocks a remote service by default", () => {
    const status = evaluateDataGate(
      "https://example.supabase.co/rest/v1/responses",
      {},
      g0Policy,
    );

    expect(status).toMatchObject({ allowed: false, targetKind: "remote", requestedMode: "synthetic" });
  });

  it("blocks a remote service even when the environment requests real data before G3", () => {
    const status = evaluateDataGate(
      "https://example.supabase.co/rest/v1/responses",
      { VITE_DATA_MODE: "real" },
      g0Policy,
    );

    expect(status.allowed).toBe(false);
  });

  it("fails closed for a missing or malformed target", () => {
    expect(evaluateDataGate("", {}, g0Policy)).toMatchObject({ allowed: false, targetKind: "invalid" });
  });

  it("does not call the network implementation when a request is blocked", async () => {
    const network = vi.fn<typeof fetch>();
    const guardedFetch = createDataFetch(network, { VITE_DATA_MODE: "synthetic" }, g0Policy);

    await expect(guardedFetch("https://example.supabase.co/rest/v1/responses")).rejects.toBeInstanceOf(
      DataGateBlockedError,
    );
    expect(network).not.toHaveBeenCalled();
  });
});
