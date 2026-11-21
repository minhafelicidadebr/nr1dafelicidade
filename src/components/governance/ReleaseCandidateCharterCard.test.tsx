import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { g1ReleaseCandidateCharterSummary } from "@/data/g1ReleaseCandidateCharter";
import { g1ReleaseReviewPlanSummary } from "@/data/g1ReleaseReviewPlan";
import ReleaseCandidateCharterCard from "./ReleaseCandidateCharterCard";

describe("ReleaseCandidateCharterCard", () => {
  it("shows reviewable scope and keeps every promotion action absent", () => {
    render(
      <ReleaseCandidateCharterCard
        summary={g1ReleaseCandidateCharterSummary}
        reviewPlan={g1ReleaseReviewPlanSummary}
      />,
    );

    expect(screen.getByText("Carta do candidato de release")).toBeInTheDocument();
    expect(screen.getByText("Escopo revisável · promoção bloqueada")).toBeInTheDocument();
    expect(screen.getByText("106")).toBeInTheDocument();
    expect(screen.getByText("6/6")).toBeInTheDocument();
    expect(screen.getByText("Plano de revisão · 6 etapas")).toBeInTheDocument();
    expect(screen.getByText(/Próxima etapa: Fundação e claims/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(15);
    expect(screen.getByText("Próxima decisão: reconciliar o repositório oficial")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
