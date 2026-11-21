import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/ThemeToggle";
import { applyThemeToDom, readStoredTheme } from "@/hooks/useTheme";

describe("ThemeToggle & Solar Harmony Light Mode System", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("applies light mode and removes dark class when set to light", () => {
    applyThemeToDom("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(readStoredTheme()).toBe("light");
  });

  it("toggles between Dark Mode (Sun icon to switch to Light) and Light Mode (Moon icon to switch to Dark)", () => {
    applyThemeToDom("dark");
    render(<ThemeToggle showLabel />);

    const btn = screen.getByTestId("theme-toggle-button");
    expect(btn.getAttribute("aria-label")).toContain("Ativar versão clara");

    // Click Sun icon -> switches to Light Mode
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(btn.getAttribute("aria-label")).toContain("Ativar versão escura");

    // Click Moon icon -> switches back to Dark Mode
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
