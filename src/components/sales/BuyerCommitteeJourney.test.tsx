import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { g1BuyerCommitteeJourney } from "@/data/g1BuyerCommitteeJourney";
import BuyerCommitteeJourney from "./BuyerCommitteeJourney";

describe("BuyerCommitteeJourney", () => {
  it("separates the four buyer perspectives without presenting alignment as approval", () => {
    render(<BuyerCommitteeJourney />);

    expect(screen.getByRole("group", { name: "Escolha a perspectiva do comitê comprador" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /Diretoria/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Por que agir agora e qual decisão vem primeiro?")).toBeInTheDocument();
    expect(screen.getByText(/Não constitui parecer, aprovação formal, proposta/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Jurídico \/ DPO/i }));

    expect(screen.getByRole("button", { name: /Jurídico \/ DPO/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Quais condições precisam existir antes de um futuro piloto?")).toBeInTheDocument();
    expect(screen.getByText(/Nenhum dado real, CRM, integração ou entrega remota/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Levar para a escolha/i })).toHaveAttribute("href", "#pricing");
  });

  it("keeps every public perspective tied to versioned evidence", () => {
    expect(g1BuyerCommitteeJourney.roles).toHaveLength(4);
    expect(g1BuyerCommitteeJourney.roles.every((role) => role.evidence.length === 3)).toBe(true);
    expect(g1BuyerCommitteeJourney.roles.every((role) => role.evidenceRefs.length >= 2)).toBe(true);
    expect(g1BuyerCommitteeJourney.status).toBe("local_synthetic_alignment");
  });
});
