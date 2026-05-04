import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DetailedSolutionVariantsTabs } from "./DetailedSolutionVariantsTabs";

const mkSol = (q: string) => ({
  source: "Test",
  question: q,
  sections: [{ label: "Step", lines: [{ text: "x" }] }],
  result: "r",
});

describe("DetailedSolutionVariantsTabs", () => {
  const variants = [
    { label: "P(X<x)", solutions: [mkSol("Q1A"), mkSol("Q1B")] },
    { label: "P(X>x)", solutions: [mkSol("Q2A")] },
  ];

  it("renders one tab per variant; first tab active by default", () => {
    render(<DetailedSolutionVariantsTabs variants={variants} />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "P(X<x)" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Q1A")).toBeInTheDocument();
    expect(screen.queryByText("Q2A")).not.toBeInTheDocument();
  });

  it("switches solutions when a different tab is clicked", () => {
    render(<DetailedSolutionVariantsTabs variants={variants} />);
    fireEvent.click(screen.getByRole("tab", { name: "P(X>x)" }));
    expect(screen.getByText("Q2A")).toBeInTheDocument();
    expect(screen.queryByText("Q1A")).not.toBeInTheDocument();
  });

  it("renders flat (no tabs) when only one variant given", () => {
    render(
      <DetailedSolutionVariantsTabs
        variants={[{ label: "Only", solutions: [mkSol("X")] }]}
      />,
    );
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });
});
