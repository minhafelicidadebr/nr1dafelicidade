import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IncidentRecoveryExerciseCard from "./IncidentRecoveryExerciseCard";

describe("IncidentRecoveryExerciseCard", () => {
  it("runs all phases locally while preserving formal No-Go", () => {
    render(<IncidentRecoveryExerciseCard />);

    expect(screen.getByText("0/5")).toBeInTheDocument();
    expect(screen.getByText("Formalização bloqueada")).toBeInTheDocument();

    for (let index = 0; index < 5; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: /Registrar fase:/i }));
    }

    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getByText("Ensaio local concluído")).toBeInTheDocument();
    expect(screen.getByText(/aprovação do runbook, ata, responsáveis/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reiniciar ensaio local/i })).toBeInTheDocument();
  });

  it("exposes an ordered, accessible phase list", () => {
    render(<IncidentRecoveryExerciseCard />);

    expect(screen.getByRole("list", { name: /Fases do ensaio de incidente/i })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByRole("button", { name: /Registrar fase: Detectar e classificar/i })).toBeInTheDocument();
  });
});
