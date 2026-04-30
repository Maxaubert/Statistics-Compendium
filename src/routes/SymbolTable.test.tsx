import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { SymbolTable } from "./SymbolTable";

describe("SymbolTable", () => {
  it("renders aggregated symbols across entries", () => {
    render(
      <MemoryRouter>
        <SymbolTable />
      </MemoryRouter>
    );
    // λ appears in poisson, eksponential — should be listed
    expect(screen.getAllByText("λ").length).toBeGreaterThan(0);
    // μ appears in normal, etc.
    expect(screen.getAllByText("μ").length).toBeGreaterThan(0);
  });
});
