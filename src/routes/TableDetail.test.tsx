import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { TableDetail } from "./TableDetail";

function renderRoute(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/table/${id}`]}>
      <Routes>
        <Route path="/table/:id" element={<TableDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TableDetail", () => {
  it("renders the Poissontabell fixture", () => {
    renderRoute("E2-poisson-kumulativ");
    expect(
      screen.getByRole("heading", { name: "Poissontabell" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Interaktivt oppslag")).toBeInTheDocument();
    expect(screen.getByText("Trykt tabell")).toBeInTheDocument();
  });

  // Each of E.1–E.6 should render its detail page without crashing
  // and without bleeding through to the "not found" fallback.
  it.each([
    ["E1-binomial-kumulativ", "Binomialtabell"],
    ["E2-poisson-kumulativ", "Poissontabell"],
    ["E3-z-tabell", "Z-tabell"],
    ["E4-z-kvantiltabell", "Z-kvantiltabell"],
    ["E5-t-tabell", "t-tabell"],
    ["E6-kjikvadrattabell", "Kjikvadrattabell"],
  ])("renders %s without crashing", (id, heading) => {
    renderRoute(id);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    expect(screen.getByText("Interaktivt oppslag")).toBeInTheDocument();
    expect(screen.getByText("Trykt tabell")).toBeInTheDocument();
    // Negative assertion: the not-found fallback should not be rendered.
    expect(
      screen.queryByText(/Fant ingen tabell med id/),
    ).not.toBeInTheDocument();
  });

  it("shows the not-found fallback for an unknown id", () => {
    renderRoute("does-not-exist");
    expect(screen.getByText(/Fant ingen tabell med id/)).toBeInTheDocument();
  });

  it("does not crash when a user types an out-of-range value into the Z-tabell input", () => {
    renderRoute("E3-z-tabell");
    const zInput = screen.getAllByRole("spinbutton")[0];
    expect(() => {
      fireEvent.change(zInput, { target: { value: "10" } });
    }).not.toThrow();
    // The page should still render its main containers.
    expect(screen.getByRole("heading", { name: "Z-tabell" })).toBeInTheDocument();
  });

  it("does not crash when df is cleared on the t-tabell route", () => {
    renderRoute("E5-t-tabell");
    const dfInput = screen.getAllByRole("spinbutton")[0] as HTMLInputElement;
    fireEvent.change(dfInput, { target: { value: "999" } });
    fireEvent.change(dfInput, { target: { value: "" } });
    // After clearing, the input stays empty (no auto-default respawn).
    expect(dfInput.value).toBe("");
    // The page should still render its main containers.
    expect(screen.getByRole("heading", { name: "t-tabell" })).toBeInTheDocument();
  });

  it("does not crash when toggling forward/inverse mode on the Z-tabell", () => {
    renderRoute("E3-z-tabell");
    fireEvent.click(screen.getByRole("tab", { name: /p → z/ }));
    fireEvent.click(screen.getByRole("tab", { name: /z → p/ }));
    expect(screen.getByRole("heading", { name: "Z-tabell" })).toBeInTheDocument();
  });
});
