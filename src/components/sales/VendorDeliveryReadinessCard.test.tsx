import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BuyerTrustCenter from "./VendorDeliveryReadinessCard";

describe("BuyerTrustCenter", () => {
  it("presents the commercial source of truth without turning blocked capabilities into offers", () => {
    render(<BuyerTrustCenter />);

    expect(screen.getByRole("heading", { name: "Antes de avançar, veja o que é real hoje." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Disponível nesta demonstração" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Em revisão responsável" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bloqueado neste gate" })).toBeInTheDocument();
    expect(screen.getByText("Descoberta e demonstração sintética")).toBeInTheDocument();
    expect(screen.getByText("Serviço pago assistido e sintético")).toBeInTheDocument();
    expect(screen.getByText("Piloto pago com dados reais")).toBeInTheDocument();
    expect(screen.getByText(/G1 continua sem aprovação formal/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Comparar próximos passos seguros/i })).toHaveAttribute(
      "href",
      "#pricing",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
