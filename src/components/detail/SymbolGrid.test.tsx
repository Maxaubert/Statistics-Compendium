import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SymbolGrid } from "./SymbolGrid";

describe("SymbolGrid", () => {
  it("renders each symbol with its meaning", () => {
    render(
      <SymbolGrid
        symbols={[
          { sym: "λ", means: "rate" },
          { sym: "k", means: "antallet" },
        ]}
      />
    );
    expect(screen.getByText("λ")).toBeInTheDocument();
    expect(screen.getByText("rate")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText("antallet")).toBeInTheDocument();
  });
});
