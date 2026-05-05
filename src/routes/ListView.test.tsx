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

  it("shows the Tabeller tab content when ?tab=tabeller is in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=tabeller"]}>
        <ListView />
      </MemoryRouter>
    );
    expect(screen.getByText("Poissontabell")).toBeInTheDocument();
  });

  it("opens the konsepter tab when ?tab=konsepter is in the URL", async () => {
    render(
      <MemoryRouter initialEntries={["/?tab=konsepter"]}>
        <ListView />
      </MemoryRouter>,
    );
    // The konsepter search placeholder identifies which tab is active.
    expect(
      await screen.findByPlaceholderText(/Søk i konsepter/i),
    ).toBeInTheDocument();
  });

  it("opens the tabeller tab when ?tab=tabeller is in the URL", async () => {
    render(
      <MemoryRouter initialEntries={["/?tab=tabeller"]}>
        <ListView />
      </MemoryRouter>,
    );
    // Tabeller tab shows a banner-style hint instead of a search input.
    expect(
      await screen.findByText(/Tabellene er interaktive/i),
    ).toBeInTheDocument();
  });

  it("shows a glossary cross-search section when typing in formler", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ListView />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(/Søk i navn, symboler/i);
    fireEvent.change(input, { target: { value: "frihetsgrader" } });
    expect(screen.getByText(/Termer som også matcher/i)).toBeInTheDocument();
  });
});
