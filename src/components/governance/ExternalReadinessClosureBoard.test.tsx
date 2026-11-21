import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { g1ExternalReadinessWorkspace } from "@/data/g1ExternalReadinessWorkspace";
import ExternalReadinessClosureBoard from "./ExternalReadinessClosureBoard";

describe("ExternalReadinessClosureBoard", () => {
  it("shows the critical path without offering a manual completion control", () => {
    render(<ExternalReadinessClosureBoard summary={g1ExternalReadinessWorkspace.externalReadinessClosure} />);

    expect(screen.getByText("Quadro de fechamento externo")).toBeInTheDocument();
    expect(screen.getByText("0/4 trilhas prontas")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Critical path da prontidão externa" }).children).toHaveLength(4);
    expect(screen.getAllByText(/Nomear Sponsor\/direcao do produto/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Proibidos")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
