import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DriverChatbot from "./DriverChatbot";

describe("DriverChatbot", () => {
  it("keeps the public assistant educational, non-diagnostic and privacy-aware", () => {
    render(<DriverChatbot driverSlug="stress" driverName="Estresse" />);

    expect(screen.getByText("Assistente de IA para exploração pedagógica · Estresse")).toBeInTheDocument();
    expect(screen.getByText(/não inclua dados pessoais ou relatos identificáveis/i)).toBeInTheDocument();
    expect(screen.getByText(/respostas podem conter imprecisões/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Mensagem para Dr. Equilíbrio" })).toBeInTheDocument();
    expect(screen.queryByText(/Powered by Gemini/i)).not.toBeInTheDocument();
  });
});
