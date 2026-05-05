import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ConceptDetail } from "./ConceptDetail";

describe("ConceptDetail", () => {
  it("renders the Bootstrapping fixture", () => {
    render(
      <MemoryRouter initialEntries={["/concept/bootstrapping"]}>
        <Routes>
          <Route path="/concept/:id" element={<ConceptDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "Bootstrapping" })
    ).toBeInTheDocument();
    expect(screen.getByText("Hva det betyr")).toBeInTheDocument();
    expect(screen.getByText("Slik gjenkjenner du det")).toBeInTheDocument();
  });
});
