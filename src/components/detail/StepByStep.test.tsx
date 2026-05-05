import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StepByStep } from "./StepByStep";

describe("StepByStep", () => {
  it("renders plain string steps in order", () => {
    const { container } = render(
      <StepByStep steps={["First", "Second", "Third"]} />,
    );
    const items = container.querySelectorAll("li");
    expect(items[0]).toHaveTextContent("First");
    expect(items[2]).toHaveTextContent("Third");
  });

  it("renders conditional step objects with the 'Pass på' affordance", () => {
    render(
      <StepByStep
        steps={[
          "Always-runs A",
          { text: "Only when negative", conditional: true },
          "Always-runs B",
        ]}
      />,
    );
    expect(screen.getByText("Always-runs A")).toBeInTheDocument();
    expect(screen.getByText("Only when negative")).toBeInTheDocument();
    expect(screen.getByText("Always-runs B")).toBeInTheDocument();
    expect(screen.getAllByText("Pass på")).toHaveLength(1);
  });

  it("treats { text: ... } without `conditional` as a regular step (no Pass-på tag)", () => {
    render(<StepByStep steps={[{ text: "still plain" }]} />);
    expect(screen.queryByText("Pass på")).not.toBeInTheDocument();
    expect(screen.getByText("still plain")).toBeInTheDocument();
  });

  it("numbers regular steps sequentially while skipping conditional ones", () => {
    render(
      <StepByStep
        steps={[
          "First regular",
          { text: "Watch out", conditional: true },
          "Second regular",
        ]}
      />,
    );
    expect(screen.getByText("Steg 1")).toBeInTheDocument();
    expect(screen.getByText("Steg 2")).toBeInTheDocument();
    expect(screen.queryByText("Steg 3")).not.toBeInTheDocument();
  });
});
