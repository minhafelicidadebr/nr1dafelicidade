import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReadinessGovernanceSprintCard from "./ReadinessGovernanceSprintCard";

describe("ReadinessGovernanceSprintCard", () => {
  it("shows the bounded revenue-bridge offer without presenting it as purchasable", () => {
    render(<ReadinessGovernanceSprintCard />);

    expect(
      screen.getByRole("article", {
        name: "Readiness & Governance Sprint Detalhes e limites operacionais",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Readiness & Governance Sprint" })).toBeInTheDocument();
    expect(screen.getByText("Dossiê de Prontidão para Governança de Fatores Psicossociais")).toBeInTheDocument();
    expect(screen.getByText("Pesquisa, campanha ou coleta com trabalhadores")).toBeInTheDocument();
    expect(screen.getByText("Tratamento de dados pessoais")).toBeInTheDocument();
    expect(screen.getByText(/CTA paga permanece desabilitada/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("venda ainda não autorizada");
    expect(screen.getByText(/Não há checkout, CRM, calendário, cobrança, operação remota ou avanço de gate/i)).toBeInTheDocument();
  });
});
