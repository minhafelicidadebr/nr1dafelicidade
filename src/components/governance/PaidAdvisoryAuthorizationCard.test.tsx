import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { g1CommercialAuthorizationSummary } from "@/data/commercialAuthorization";
import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";
import PaidAdvisoryAuthorizationCard from "./PaidAdvisoryAuthorizationCard";

describe("PaidAdvisoryAuthorizationCard", () => {
  it("shows a review-ready packet without controls or sale authorization", () => {
    render(
      <PaidAdvisoryAuthorizationCard
        summary={g1PaidAdvisoryAuthorizationSummary}
        commercialAuthorization={g1CommercialAuthorizationSummary}
      />,
    );

    expect(screen.getByText("Pacote de autorização do serviço assistido")).toBeInTheDocument();
    expect(screen.getByText("Pacote pronto · aprovação pendente")).toBeInTheDocument();
    expect(screen.getByText("Papéis obrigatórios")).toBeInTheDocument();
    expect(screen.getByText("Quatro decisões formais")).toBeInTheDocument();
    expect(screen.getByText("Sala de decisão da primeira venda")).toBeInTheDocument();
    expect(screen.getByText("Pacote pronto · quórum pendente")).toBeInTheDocument();
    expect(screen.getByText("7/7")).toBeInTheDocument();
    expect(screen.getByText(/venda ainda não autorizada/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bloqueios canônicos da venda" })).toBeInTheDocument();
    expect(screen.getByText(/Definir um preço positivo\./)).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getAllByText("4/4")).toHaveLength(2);
    expect(screen.getAllByText("0/4")).toHaveLength(4);
    expect(screen.getByText("Bloqueada")).toBeInTheDocument();
    expect(screen.getAllByText("Titular e alçada: em branco")).toHaveLength(4);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
