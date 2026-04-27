import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExampleCard } from "./ExampleCard";

describe("ExampleCard", () => {
  it("renders source, excerpt, and solution sketch", () => {
    render(
      <ExampleCard
        source="Eksamen jan26 · 4a"
        excerpt="some question text"
        solutionSketch="P(X=0) ≈ 0.186"
      />
    );
    expect(screen.getByText(/Eksamen jan26 · 4a/i)).toBeInTheDocument();
    expect(screen.getByText(/some question text/)).toBeInTheDocument();
    expect(screen.getByText(/0.186/)).toBeInTheDocument();
  });
});
