import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { g1ReleaseProofPacketSummary } from "@/data/g1ReleaseProofPacket";
import { g1ReleaseEvidenceManifest } from "@/data/g1ReleaseEvidenceManifest";
import ReleaseProofPacketCard from "./ReleaseProofPacketCard";

describe("ReleaseProofPacketCard", () => {
  it("separates attested, historical and missing release evidence without actions", () => {
    render(<ReleaseProofPacketCard summary={g1ReleaseProofPacketSummary} evidence={g1ReleaseEvidenceManifest} />);

    expect(screen.getByText("Pacote de comprovação do release")).toBeInTheDocument();
    expect(screen.getByText("Release parcialmente comprovado")).toBeInTheDocument();
    expect(screen.getByText("10/11")).toBeInTheDocument();
    expect(screen.getByText("Gate aprovado")).toBeInTheDocument();
    expect(screen.getByText("G0")).toBeInTheDocument();
    expect(screen.getByText("Gate em preparação")).toBeInTheDocument();
    expect(screen.getByText("G1")).toBeInTheDocument();
    expect(screen.getByText("Somente sandbox")).toBeInTheDocument();
    expect(screen.getByText(/Atestado pontual e somente leitura/)).toBeInTheDocument();
    expect(screen.getByText(/não o HEAD atual/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(11);
    expect(screen.getByText("Próxima prova: Branch protection e revisão obrigatória")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
