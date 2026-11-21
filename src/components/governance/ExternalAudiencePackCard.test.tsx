import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  g1ExternalAudiencePack,
  g1ExternalAudiencePackContext,
  g1ExternalAudiencePackPolicy,
} from "@/data/g1ExternalAudiencePack";
import { evaluateExternalAudiencePack } from "@/lib/governance/externalAudiencePack";
import ExternalAudiencePackCard from "./ExternalAudiencePackCard";

describe("ExternalAudiencePackCard", () => {
  it("distinguishes an internally rehearsable draft from external approval", () => {
    const summary = evaluateExternalAudiencePack(
      g1ExternalAudiencePack,
      g1ExternalAudiencePackContext,
      g1ExternalAudiencePackPolicy,
    );

    render(<ExternalAudiencePackCard pack={g1ExternalAudiencePack} summary={summary} />);

    expect(screen.getByText("Draft ensaiável · externo bloqueado")).toBeInTheDocument();
    expect(screen.getAllByText("7/7", { selector: "p" })).toHaveLength(2);
    expect(screen.getByText(/facilitador/i)).toBeInTheDocument();
    expect(screen.getByText("Bloqueado")).toBeInTheDocument();
    expect(screen.getByText("Roteiro em sete blocos")).toBeInTheDocument();
    expect(screen.getByText("Perguntas difíceis e respostas seguras")).toBeInTheDocument();
  });
});
