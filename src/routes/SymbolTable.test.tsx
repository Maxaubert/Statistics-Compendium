import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { SymbolTable } from "./SymbolTable";

describe("SymbolTable", () => {
  it("renders a grid with the big symbols visible", () => {
    render(
      <MemoryRouter>
        <SymbolTable />
      </MemoryRouter>
    );
    // Curated symbols should appear as buttons
    expect(screen.getAllByText("α").length).toBeGreaterThan(0);
    expect(screen.getAllByText("μ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("λ").length).toBeGreaterThan(0);
  });

  it("opens the modal when a symbol card is clicked", () => {
    render(
      <MemoryRouter>
        <SymbolTable />
      </MemoryRouter>
    );
    // No dialog initially
    expect(screen.queryByRole("dialog")).toBeNull();
    // Click the alpha card
    const alphaCard = screen.getByRole("button", { name: "Vis detaljer for α" });
    fireEvent.click(alphaCard);
    // Dialog should appear and show the curated multi-context content
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.textContent).toContain("Signifikansnivå");
    expect(dialog.textContent).toContain("Konstantleddet");
  });

  it("closes the modal via the close button", () => {
    render(
      <MemoryRouter>
        <SymbolTable />
      </MemoryRouter>
    );
    const alphaCard = screen.getByRole("button", { name: "Vis detaljer for α" });
    fireEvent.click(alphaCard);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Click the close button (one of the buttons named "Lukk")
    const closeButtons = screen.getAllByRole("button", { name: /Lukk/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
