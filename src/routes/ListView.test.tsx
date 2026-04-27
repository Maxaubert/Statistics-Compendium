import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ListView } from "./ListView";

describe("ListView", () => {
  it("renders the banner, tabs, and at least one entry from fixtures", () => {
    render(
      <MemoryRouter>
        <ListView />
      </MemoryRouter>
    );
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
    expect(screen.getByText("Formler")).toBeInTheDocument();
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
  });

  it("filters entries when a filter option is selected", () => {
    render(
      <MemoryRouter>
        <ListView />
      </MemoryRouter>
    );
    // "Beregner" also appears as a table column header, so target the sidebar button
    const beregnerButtons = screen.getAllByText("Beregner");
    fireEvent.click(beregnerButtons[0]);
    fireEvent.click(screen.getByLabelText(/Sannsynlighet \(eksakt\)/));
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
    expect(screen.getByText("Binomialfordeling")).toBeInTheDocument();
  });
});
