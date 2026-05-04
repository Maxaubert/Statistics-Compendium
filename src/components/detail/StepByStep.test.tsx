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

  it("renders conditional step objects with the 'Hvis…' affordance", () => {
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
    // The Hvis… badge appears exactly once for the one conditional step.
    expect(screen.getAllByText("Hvis…")).toHaveLength(1);
  });

  it("treats { text: ... } without `conditional` as a regular step (no badge)", () => {
    render(<StepByStep steps={[{ text: "still plain" }]} />);
    expect(screen.queryByText("Hvis…")).not.toBeInTheDocument();
    expect(screen.getByText("still plain")).toBeInTheDocument();
  });
});
