import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { g1ReleaseEvidenceManifest } from "@/data/g1ReleaseEvidenceManifest";
import { g1LovableDeploymentReceipt } from "@/data/g1LovableDeploymentReceipt";

const root = resolve(__dirname, "../..");

function read(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

describe("release evidence documentation drift", () => {
  it("binds the canonical proof document to the manifest version, baseline and CI run", () => {
    const document = read("docs/G1_RELEASE_PROOF_PACKET.md");

    expect(document).toContain(g1ReleaseEvidenceManifest.version);
    expect(document).toContain(g1ReleaseEvidenceManifest.repository.publishedBaselineRef);
    expect(document).toContain(String(g1ReleaseEvidenceManifest.ci.runId));
    expect(document).toContain("gate aprovado: `G0`");
    expect(document).toContain("gate em preparação: `G1`");
    expect(document).toContain("Mercado Pago `sandbox_only`");
  });

  it("does not present the pre-merge PR snapshot as current release truth", () => {
    const currentTruthFiles = [
      "docs/G1_RELEASE_PROOF_PACKET.md",
      "src/data/g1ReleaseProofPacket.ts",
      "src/data/releaseSyncReadiness.ts",
      "src/data/saasMaturityAssessment.ts",
      "src/pages/app/DashboardPage.tsx",
    ].map(read).join("\n");

    expect(currentTruthFiles).not.toContain("02795fbc7072ca428ee2ee65682abcae7cb6ff50");
    expect(currentTruthFiles).not.toContain("29428074829");
    expect(currentTruthFiles).not.toContain("Draft PR #9 aberto");
  });

  it("keeps promotion boundaries explicit in the machine-readable artifact", () => {
    expect(g1ReleaseEvidenceManifest.gates).toEqual({
      approvedGate: "G0",
      targetGate: "G1",
      g1Approved: false,
      gateAdvanceClaimed: false,
      realDataEnabled: false,
    });
    expect(g1ReleaseEvidenceManifest.capabilities).toMatchObject({
      externalPublication: "blocked",
      billing: "sandbox_only",
      methodology: "blocked",
      formalAcceptance: "blocked",
      lovablePublishedBaseline: "verified",
    });
  });

  it("binds verified Lovable proofs to the versioned deployment receipt", () => {
    const lovableProofs = g1ReleaseEvidenceManifest.proofs.filter((proof) => proof.source === "lovable");

    expect(lovableProofs).toHaveLength(2);
    expect(lovableProofs.every((proof) => proof.status === "verified")).toBe(true);
    expect(lovableProofs.every((proof) =>
      proof.evidenceRef === "docs/release/G1_LOVABLE_DEPLOYMENT_RECEIPT.json")).toBe(true);
    expect(g1LovableDeploymentReceipt.releaseRef).toBe(g1ReleaseEvidenceManifest.repository.publishedBaselineRef);
    expect(g1LovableDeploymentReceipt.deployment.idSource).toBe("x-deployment-id");
    expect(g1LovableDeploymentReceipt.boundaries).toMatchObject({
      approvedGate: "G0",
      targetGate: "G1",
      g1Approved: false,
      gateAdvanceClaimed: false,
      realDataEnabled: false,
      billing: "sandbox_only",
    });

    const handoff = read("docs/GITHUB_LOVABLE_SYNC_HANDOFF.md");
    expect(handoff).toContain(g1LovableDeploymentReceipt.deployment.id);
    expect(handoff).toContain(g1LovableDeploymentReceipt.releaseRef);
    expect(handoff).toContain(g1LovableDeploymentReceipt.projectId);
  });

  it("does not overclaim continuous synchronization or the current remote head", () => {
    const currentTruthFiles = [
      "docs/G1_RELEASE_PROOF_PACKET.md",
      "docs/GITHUB_LOVABLE_SYNC_HANDOFF.md",
      "src/components/governance/ReleaseProofPacketCard.tsx",
      "src/data/g1ExternalSessionDecision.ts",
      "src/pages/app/GovernancePage.tsx",
    ].map(read).join("\n");

    expect(currentTruthFiles).not.toContain("Pronto para sincronizar");
    expect(currentTruthFiles).not.toContain("Commit main sincronizado no Lovable");
    expect(currentTruthFiles).toContain("não comprova que o `HEAD` atual");
  });

  it("does not reintroduce the retired repository as current release truth", () => {
    const currentTruthFiles = [
      "docs/G1_RELEASE_PROOF_PACKET.md",
      "docs/GITHUB_LOVABLE_SYNC_HANDOFF.md",
      "docs/IMPLEMENTATION_STATUS.md",
      "docs/G2_COMMITTEE_SUBMISSION_READINESS.md",
    ].map(read).join("\n");

    expect(currentTruthFiles).not.toContain("minhafelicidadebr/app-lente01-cop-nr1");
  });
});
