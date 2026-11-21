import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  g1PaidAdvisoryLaunchAcknowledgements,
  g1PaidAdvisoryLaunchScenarios,
} from "@/data/g1PaidAdvisoryLaunchRehearsal";
import { g1CommercialAuthorizationSummary } from "@/data/commercialAuthorization";
import { g1PaidAdvisoryAuthorizationSummary } from "@/data/g1PaidAdvisoryAuthorization";
import PaidAdvisoryLaunchRehearsalCard from "./PaidAdvisoryLaunchRehearsalCard";

describe("PaidAdvisoryLaunchRehearsalCard", () => {
  it("gates the synthetic launch rehearsal and produces only a local No-Go receipt", () => {
    render(
      <PaidAdvisoryLaunchRehearsalCard
        authorization={g1PaidAdvisoryAuthorizationSummary}
        commercialAuthorization={g1CommercialAuthorizationSummary}
      />,
    );

    const firstAction = screen.getByLabelText(/Oferta de dados reais de trabalhadores: Interromper e escalar/i);
    expect(firstAction).toBeDisabled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    for (const acknowledgement of g1PaidAdvisoryLaunchAcknowledgements) {
      fireEvent.click(screen.getByLabelText(acknowledgement.label));
    }
    expect(firstAction).toBeEnabled();

    for (const scenario of g1PaidAdvisoryLaunchScenarios) {
      const actionLabel = scenario.expectedAction === "bounded_answer"
        ? "Responder com limite seguro"
        : "Interromper e escalar";
      fireEvent.click(screen.getByLabelText(`${scenario.label}: ${actionLabel}`));
    }

    expect(screen.getByRole("heading", { name: "Comprovante local do ensaio comercial" })).toBeInTheDocument();
    expect(screen.getByText("No-Go comercial")).toBeInTheDocument();
    expect(screen.getByText(/proposta emitida: não/i)).toBeInTheDocument();
    expect(screen.getByText(/venda autorizada: não/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reiniciar ensaio comercial" }));
    expect(screen.queryByRole("heading", { name: "Comprovante local do ensaio comercial" })).not.toBeInTheDocument();
    expect(firstAction).toBeDisabled();
  });
});
