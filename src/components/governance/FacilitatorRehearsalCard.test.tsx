import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  g1ExternalAudiencePack,
  g1ExternalAudiencePackContext,
  g1ExternalAudiencePackPolicy,
} from "@/data/g1ExternalAudiencePack";
import {
  g1FacilitatorRehearsalAcknowledgements,
  g1FacilitatorRehearsalScenarios,
} from "@/data/g1FacilitatorRehearsal";
import { evaluateExternalAudiencePack } from "@/lib/governance/externalAudiencePack";
import FacilitatorRehearsalCard from "./FacilitatorRehearsalCard";

describe("FacilitatorRehearsalCard", () => {
  it("gates scenarios behind preflight and creates only a local non-approval receipt", () => {
    const audiencePack = evaluateExternalAudiencePack(
      g1ExternalAudiencePack,
      g1ExternalAudiencePackContext,
      g1ExternalAudiencePackPolicy,
    );
    render(<FacilitatorRehearsalCard audiencePack={audiencePack} />);

    const firstAction = screen.getByLabelText(/Pressão por garantia regulatória: Responder com catálogo seguro/i);
    expect(firstAction).toBeDisabled();

    for (const acknowledgement of g1FacilitatorRehearsalAcknowledgements) {
      fireEvent.click(screen.getByLabelText(acknowledgement.label));
    }
    expect(firstAction).toBeEnabled();

    for (const scenario of g1FacilitatorRehearsalScenarios) {
      const actionLabel = scenario.expectedAction === "safe_answer"
        ? "Responder com catálogo seguro"
        : "Interromper e escalar";
      fireEvent.click(screen.getByLabelText(`${scenario.label}: ${actionLabel}`));
    }

    expect(screen.getByRole("heading", { name: "Comprovante local do ensaio do facilitador" })).toBeInTheDocument();
    expect(screen.getByText(/aprovação externa: não/i)).toBeInTheDocument();
    expect(screen.getByText(/facilitador nomeado: não/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reiniciar ensaio" }));
    expect(screen.queryByRole("heading", { name: "Comprovante local do ensaio do facilitador" })).not.toBeInTheDocument();
    expect(firstAction).toBeDisabled();
  });
});
