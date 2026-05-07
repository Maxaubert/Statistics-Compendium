import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FormulaExplanationCards } from "./FormulaExplanationCards";
import type { FormulaExplanation } from "./formula-explanations";

const explanations: FormulaExplanation[] = [
  {
    id: "pdf",
    name: "Sannsynlighetstetthet",
    abbreviation: "PDF",
    formula: "f(t) = λe^(-λt)",
    short: "PDF kort",
    long: "PDF kropp",
    // Test fixture keeps a cross-formula see-også so the back-stack
    // tests can still exercise the in-popup formula stack code path,
    // even though production data no longer wires PDF<->CDF this way.
    see_also: [{ kind: "formula", ref: "cdf" }],
  },
  {
    id: "cdf",
    name: "Kumulativ fordelingsfunksjon",
    abbreviation: "CDF",
    formula: "F(t) = 1 - e^(-λt)",
    short: "CDF kort",
    long: "CDF kropp",
    see_also: [{ kind: "formula", ref: "pdf" }],
  },
];

function renderCards() {
  return render(
    <MemoryRouter>
      <FormulaExplanationCards explanations={explanations} />
    </MemoryRouter>,
  );
}

describe("FormulaExplanationCards", () => {
  it("opens a modal when a card is clicked, no back button at first", () => {
    renderCards();
    fireEvent.click(screen.getByLabelText("Vis forklaring for Kumulativ fordelingsfunksjon"));
    expect(screen.queryByLabelText(/Tilbake/)).not.toBeInTheDocument();
  });

  it("shows back button after clicking a cross-formula see-også link", () => {
    renderCards();
    fireEvent.click(screen.getByLabelText("Vis forklaring for Kumulativ fordelingsfunksjon"));
    fireEvent.click(
      screen.getByRole("button", { name: /Sannsynlighetstetthet \(PDF\)/ }),
    );
    expect(
      screen.getByLabelText(/Tilbake til Kumulativ fordelingsfunksjon/),
    ).toBeInTheDocument();
  });

  it("back button pops the stack and returns to the previous formula", () => {
    renderCards();
    fireEvent.click(screen.getByLabelText("Vis forklaring for Kumulativ fordelingsfunksjon"));
    fireEvent.click(
      screen.getByRole("button", { name: /Sannsynlighetstetthet \(PDF\)/ }),
    );
    // We are now on PDF; click Back
    const backBtn = screen.getByLabelText(/Tilbake til Kumulativ fordelingsfunksjon/);
    fireEvent.click(backBtn);
    // Back button should be gone (we are at the bottom of the stack again)
    expect(screen.queryByLabelText(/Tilbake/)).not.toBeInTheDocument();
    // CDF popup should still be visible (modal didn't close)
    // CDF's see-også link to PDF should be back
    expect(
      screen.getByRole("button", { name: /Sannsynlighetstetthet \(PDF\)/ }),
    ).toBeInTheDocument();
  });
});
