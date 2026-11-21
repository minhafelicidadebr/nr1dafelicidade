import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ImpactCalculator from "./ImpactCalculator";

describe("ImpactCalculator", () => {
  it("presents a transparent cost scenario without an ROI promise", () => {
    render(<ImpactCalculator />);

    expect(screen.getByRole("heading", { name: "Simulador de custos organizacionais" })).toBeInTheDocument();
    expect(screen.getByText(/não é previsão financeira, ROI ou auditoria/i)).toBeInTheDocument();
    expect(screen.getByText("Custo anual sob estas premissas")).toBeInTheDocument();
    expect(screen.getByText(/Próximo passo responsável/i)).toBeInTheDocument();
    expect(screen.queryByText(/ROI Potencial/i)).not.toBeInTheDocument();
  });
});
