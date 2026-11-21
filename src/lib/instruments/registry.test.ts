import { describe, expect, it } from "vitest";
import { exploratoryInstrumentDraft } from "@/data/instrumentRegistry";
import { campaignEligibility, validateInstrumentVersion, type InstrumentVersion } from "./registry";

const approved: InstrumentVersion = {
  instrumentKey: "fixture",
  version: "1.0.0",
  status: "approved",
  locale: "pt-BR",
  jurisdiction: "BR",
  sourceStatus: "verified",
  primarySourceRef: "controlled-source:fixture",
  licenseStatus: "approved",
  licenseRef: "controlled-license:fixture",
  itemCount: 20,
  subscaleCount: 5,
  contentSha256: "a".repeat(64),
  scoringMode: "server",
  scoringFunctionName: "public.score_fixture(uuid,jsonb)",
  runtimeReady: true,
  approvedBy: "reviewer-id",
  approvedAt: "2026-06-23T00:00:00Z",
};

describe("instrument registry gate", () => {
  it("accepts a complete approved fixture", () => {
    expect(validateInstrumentVersion(approved)).toEqual([]);
    expect(campaignEligibility(approved).allowed).toBe(true);
  });

  it("blocks the received exploratory implementation", () => {
    const result = campaignEligibility(exploratoryInstrumentDraft);
    expect(result.allowed).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain("instrument_not_approved");
  });

  it.each([
    ["sourceStatus", "unverified", "source_not_verified"],
    ["licenseStatus", "unknown", "license_not_approved"],
    ["contentSha256", null, "content_hash_required"],
    ["scoringMode", "not_implemented", "server_scoring_required"],
    ["runtimeReady", false, "runtime_not_ready"],
    ["approvedBy", null, "approval_missing"],
  ] as const)("blocks approved version when %s is invalid", (field, value, code) => {
    const result = campaignEligibility({ ...approved, [field]: value });
    expect(result.allowed).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain(code);
  });

  it("blocks retired versions even if their historical definition is complete", () => {
    expect(campaignEligibility({ ...approved, status: "retired" }).issues.map((issue) => issue.code))
      .toContain("instrument_retired");
  });

  it("rejects invalid semantic versions and hashes", () => {
    const issues = validateInstrumentVersion({ ...approved, version: "v1", contentSha256: "abc" });
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["invalid_semver", "invalid_content_hash"]));
  });
});
