import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { StepByStep, type StepItem } from "./StepByStep";

function renderSteps(steps: StepItem[]) {
  return render(
    <MemoryRouter>
      <StepByStep steps={steps} />
    </MemoryRouter>,
  );
}

describe("StepByStep example rows", () => {
  it("renders an Eksempel label and skips the step number for example rows", () => {
    renderSteps([
      { text: "Generell formel.", formula: "Z = (X - mu) / sigma" },
      {
        text: "Eksempel med tall.",
        formula: "Z = (98 - 100) / 5 = -0.4",
        example: true,
      },
      "Konkluder.",
    ]);
    // The example row carries the "Eksempel" label, not "Steg 2".
    expect(screen.getByText("Eksempel")).toBeInTheDocument();
    // Numbering skips the example row: the third item is "Steg 2", not "Steg 3".
    expect(screen.getByText("Steg 1")).toBeInTheDocument();
    expect(screen.getByText("Steg 2")).toBeInTheDocument();
    expect(screen.queryByText("Steg 3")).not.toBeInTheDocument();
  });

  it("indents example rows to the right (ml-8) so they hang off the rail", () => {
    const { container } = renderSteps([
      { text: "Eksempel.", example: true },
    ]);
    const card = container.querySelector(".glass-light-card");
    expect(card).not.toBeNull();
    expect(card!.className).toMatch(/\bml-8\b/);
    expect(card!.className).toMatch(/sky-/);
  });
});
