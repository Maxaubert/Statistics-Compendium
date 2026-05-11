import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EntryDetail } from "./EntryDetail";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/entry/:id" element={<EntryDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("EntryDetail", () => {
  it("renders the Poissonfordeling fixture in full", () => {
    renderAt("/entry/poisson-fordeling");
    expect(
      screen.getByRole("heading", { name: "Poissonfordeling" })
    ).toBeInTheDocument();
    expect(screen.getByText("Hva den gjør")).toBeInTheDocument();
    expect(screen.getByText("Slik gjenkjenner du den i en oppgave")).toBeInTheDocument();
    expect(screen.getByText("IKKE bruk når")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Symboler" })).toBeInTheDocument();
    expect(screen.getByText("Egenskaper")).toBeInTheDocument();
    // QuickNav rail also renders "Steg for steg" as a jump link, so we
    // target the section's h2 heading specifically.
    expect(
      screen.getByRole("heading", { name: "Steg for steg" }),
    ).toBeInTheDocument();
    // The undetailed "Eksempler fra obliger og eksamener" section was removed —
    // detailed_solutions (or detailed_solution_variants) is the only example surface now.
    expect(
      screen.queryByText("Eksempler fra obliger og eksamener"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Detaljerte oppgaveløsninger")).toBeInTheDocument();
    expect(screen.getByText("Vanlige feller")).toBeInTheDocument();
    expect(screen.getByText("Python (scipy.stats)")).toBeInTheDocument();
    expect(screen.getByText("Verktøy / tabeller")).toBeInTheDocument();
    expect(screen.getByText("Relaterte oppføringer")).toBeInTheDocument();
  });

  it("falls back to a not-found message for an unknown id", () => {
    renderAt("/entry/does-not-exist");
    expect(screen.getByText(/Fant ingen oppføring/)).toBeInTheDocument();
  });

  it("renders an overview entry (varians-oversikt) using the prose layout", () => {
    renderAt("/entry/varians-oversikt");
    // Page header still renders
    expect(
      screen.getByRole("heading", { name: "Varians (oversikt)" }),
    ).toBeInTheDocument();
    // what_it_means prose body content shows up — look for a distinctive
    // chunk from the YAML so we know the markdown renderer ran.
    expect(
      screen.getByText(/vektet sum av kvadrerte avvik/),
    ).toBeInTheDocument();
    // Card-grid "Former" section renders for overview entries with forms[]
    expect(screen.getByText("Former")).toBeInTheDocument();
    // Recognition cues section is HIDDEN for overview/method entries
    expect(
      screen.queryByText("Slik gjenkjenner du den i en oppgave"),
    ).not.toBeInTheDocument();
    // Formula-shaped sections that don't apply to overviews must NOT render
    expect(screen.queryByText("Hva den gjør")).not.toBeInTheDocument();
    expect(screen.queryByText("Hovedformel")).not.toBeInTheDocument();
    // Related-pills section still renders
    expect(screen.getByText("Relaterte oppføringer")).toBeInTheDocument();
  });

  it("renders a method entry (bootstrapping) using the prose layout", () => {
    renderAt("/entry/bootstrapping");
    expect(
      screen.getByRole("heading", { name: "Bootstrapping" }),
    ).toBeInTheDocument();
    // what_it_means body shows up — kjerneidé phrase is distinctive
    expect(
      screen.getByText(/Kjerneid/),
    ).toBeInTheDocument();
    // Recognition cues are shown for method entries (hidden only for overview).
    expect(
      screen.getByText("Slik gjenkjenner du den i en oppgave"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Hva den gjør")).not.toBeInTheDocument();
    expect(screen.queryByText("Hovedformel")).not.toBeInTheDocument();
  });
});
