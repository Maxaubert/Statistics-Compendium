import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Banner } from "./Banner";

function renderBanner() {
  return render(
    <MemoryRouter>
      <Banner />
    </MemoryRouter>
  );
}

describe("Banner", () => {
  it("renders the title", () => {
    renderBanner();
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
  });
  it("renders the σ logo glyph", () => {
    renderBanner();
    expect(screen.getByText("σ")).toBeInTheDocument();
  });
  it("renders a theme toggle button", () => {
    renderBanner();
    expect(screen.getByRole("button", { name: /tema/i })).toBeInTheDocument();
  });
  it("logo links back to home", () => {
    renderBanner();
    const link = screen.getByRole("link", { name: /forsiden/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
