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
    expect(screen.getByText("Steg for steg")).toBeInTheDocument();
    expect(screen.getByText("Eksempler fra obliger og eksamener")).toBeInTheDocument();
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
});
