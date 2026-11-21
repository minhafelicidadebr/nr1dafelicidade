import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { g1AccountableNominationPackSummary } from "@/data/g1AccountableNominationPack";
import AccountableNominationPackCard from "./AccountableNominationPackCard";

describe("AccountableNominationPackCard", () => {
  it("renders a complete blank template without nomination controls", () => {
    render(<AccountableNominationPackCard summary={g1AccountableNominationPackSummary} />);

    expect(screen.getByText("Pacote de nomeação e convocação")).toBeInTheDocument();
    expect(screen.getByText("Template interno pronto · nomeações pendentes")).toBeInTheDocument();
    expect(screen.getByText("9/9")).toBeInTheDocument();
    expect(screen.getByText("Nove cartas de papel")).toBeInTheDocument();
    expect(screen.getAllByText("Titular: em branco")).toHaveLength(9);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
