import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import { ConceptRedirect } from "./ConceptRedirect";

function EntryStub() {
  const { id } = useParams<{ id: string }>();
  return <div data-testid="entry-target">{id}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/concept/:id" element={<ConceptRedirect />} />
        <Route path="/entry/:id" element={<EntryStub />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ConceptRedirect", () => {
  it("/concept/varians redirects to /entry/varians-oversikt", () => {
    renderAt("/concept/varians");
    expect(screen.getByTestId("entry-target")).toHaveTextContent(
      "varians-oversikt",
    );
  });

  it("/concept/standardavvik redirects to /entry/standardavvik-oversikt", () => {
    renderAt("/concept/standardavvik");
    expect(screen.getByTestId("entry-target")).toHaveTextContent(
      "standardavvik-oversikt",
    );
  });

  it("/concept/forventningsverdi redirects to /entry/forventningsverdi-oversikt", () => {
    renderAt("/concept/forventningsverdi");
    expect(screen.getByTestId("entry-target")).toHaveTextContent(
      "forventningsverdi-oversikt",
    );
  });

  it("non-colliding ids pass through unchanged", () => {
    renderAt("/concept/bootstrapping");
    expect(screen.getByTestId("entry-target")).toHaveTextContent(
      "bootstrapping",
    );
  });
});
