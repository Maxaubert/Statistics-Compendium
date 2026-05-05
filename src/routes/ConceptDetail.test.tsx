import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ConceptDetail } from "./ConceptDetail";

describe("ConceptDetail", () => {
  // Phase 3b moved all concepts to entries; the route still exists but no
  // longer has matching content. Phase 3d will install a redirect. Until
  // then, ConceptDetail just renders the not-found fallback for any id.
  it("renders the not-found fallback when no concept matches the id", () => {
    render(
      <MemoryRouter initialEntries={["/concept/bootstrapping"]}>
        <Routes>
          <Route path="/concept/:id" element={<ConceptDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Fant ingen konsept med id/)
    ).toBeInTheDocument();
  });
});
