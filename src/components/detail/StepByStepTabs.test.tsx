import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StepByStepTabs } from "./StepByStepTabs";

describe("StepByStepTabs", () => {
  const variants = [
    { label: "P(X < x)", steps: ["A1", "A2"] },
    { label: "P(X > x)", steps: ["B1", "B2", "B3"] },
    { label: "Invers", steps: ["C1"] },
  ];

  it("renders one tab per variant and shows the first variant's steps by default", () => {
    render(<StepByStepTabs variants={variants} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "P(X < x)" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.queryByText("B1")).not.toBeInTheDocument();
  });

  it("switches steps when a different tab is clicked", () => {
    render(<StepByStepTabs variants={variants} />);
    fireEvent.click(screen.getByRole("tab", { name: "P(X > x)" }));
    expect(screen.getByRole("tab", { name: "P(X > x)" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.queryByText("A1")).not.toBeInTheDocument();
  });

  it("falls back to plain step list when only one variant is given (no tabs)", () => {
    render(
      <StepByStepTabs variants={[{ label: "Solo", steps: ["only-step"] }]} />,
    );
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("only-step")).toBeInTheDocument();
  });
});
