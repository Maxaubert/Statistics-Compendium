import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { TableDetail } from "./TableDetail";

describe("TableDetail", () => {
  it("renders the Poissontabell fixture", () => {
    render(
      <MemoryRouter initialEntries={["/table/E2-poisson-kumulativ"]}>
        <Routes>
          <Route path="/table/:id" element={<TableDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "Poissontabell" })
    ).toBeInTheDocument();
    expect(screen.getByText("Interaktivt oppslag")).toBeInTheDocument();
    expect(screen.getByText("Trykt tabell")).toBeInTheDocument();
  });
});
