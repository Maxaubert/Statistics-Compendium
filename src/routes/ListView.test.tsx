import { render, screen, fireEvent, within } from "@testing-library/react";
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
    // Both the nav link and the page heading say "Formler og konsepter"
    expect(screen.getAllByText(/Formler og konsepter/i).length).toBeGreaterThan(0);
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

  it("opens the tabeller tab when ?tab=tabeller is in the URL", async () => {
    render(
      <MemoryRouter initialEntries={["/?tab=tabeller"]}>
        <ListView />
      </MemoryRouter>,
    );
    // Tabeller tab renders cards. Z-tabell is one of them — match the heading
    // exactly to avoid colliding with "Z-kvantiltabell" which contains "Z-tabell"
    // as a substring under regex /Z-tabell/i.
    expect(
      await screen.findByRole("heading", { name: /^Z-tabell$/, level: 3 }),
    ).toBeInTheDocument();
  });

  it("falls back to formler when ?tab=konsepter is in the URL", () => {
    render(
      <MemoryRouter initialEntries={["/?tab=konsepter"]}>
        <ListView />
      </MemoryRouter>,
    );
    // konsepter is gone — the URL is harmless and we render the formler view.
    expect(
      screen.getByPlaceholderText(/Søk i navn, symboler/i),
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

  it("renders the Oversikter featured section above the table when no query is active", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ListView />
      </MemoryRouter>,
    );
    const section = screen.getByTestId("oversikter-section");
    expect(section).toBeInTheDocument();
    const links = within(section).getAllByRole("link");
    const hrefs = links.map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        expect.stringContaining("/entry/varians-oversikt"),
        expect.stringContaining("/entry/standardavvik-oversikt"),
        expect.stringContaining("/entry/forventningsverdi-oversikt"),
      ]),
    );
  });

  it("hides the Oversikter section once a search query is active", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ListView />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("oversikter-section")).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/Søk i navn, symboler/i);
    fireEvent.change(input, { target: { value: "poisson" } });
    expect(screen.queryByTestId("oversikter-section")).not.toBeInTheDocument();
  });
});
