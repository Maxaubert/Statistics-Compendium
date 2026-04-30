import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Patterns } from "./Patterns";
import { PatternDetail } from "./PatternDetail";

describe("Patterns", () => {
  it("lists all patterns", () => {
    render(
      <MemoryRouter>
        <Patterns />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /Mønstre/i })).toBeInTheDocument();
  });

  it("shows detail for a pattern", () => {
    render(
      <MemoryRouter initialEntries={["/monstre/rate-til-poisson"]}>
        <Routes>
          <Route path="/monstre/:id" element={<PatternDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Rate gitt/i)).toBeInTheDocument();
  });
});
