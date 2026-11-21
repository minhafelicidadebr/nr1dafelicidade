import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AIRichMarkdown from "./AIRichMarkdown";

describe("AIRichMarkdown", () => {
  it("preserves GFM task state and exposes it to assistive technology", () => {
    const { container } = render(
      <AIRichMarkdown
        content={"- [x] Evidência concluída\n- [ ] Evidência pendente"}
      />,
    );

    expect(screen.getByText(/Concluído:/)).toBeInTheDocument();
    expect(screen.getByText(/Pendente:/)).toBeInTheDocument();
    expect(screen.getByText("Evidência concluída")).toBeInTheDocument();
    expect(screen.getByText("Evidência pendente")).toBeInTheDocument();
    expect(container.querySelectorAll("ul > li")).toHaveLength(2);
    expect(container.querySelectorAll("ul svg")).toHaveLength(1);
  });

  it("keeps ordered list items distinct from custom unordered bullets", () => {
    const { container } = render(<AIRichMarkdown content={"1. Primeiro passo\n2. Segundo passo"} />);

    const orderedItems = container.querySelectorAll("ol > li");
    expect(orderedItems).toHaveLength(2);
    expect(orderedItems[0]).toHaveClass("leading-relaxed", "pl-1");
    expect(orderedItems[0]).not.toHaveClass("flex");
    expect(container.querySelectorAll("ol > li > span[aria-hidden='true']")).toHaveLength(0);
  });
});
