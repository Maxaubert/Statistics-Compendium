import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EntryTable } from "./EntryTable";
import type { Entry } from "@/data/schema";

const entries: Entry[] = [
  {
    id: "poisson-fordeling",
    name_no: "Poissonfordeling",
    type: "distribution",
    tagline: "tag",
    formula_main: "P(X = k) = ...",
    formula_latex: "P(X = k) = ...",
    what_it_does: "",
    recognition_cues: ["Rate gitt"],
    filters: {},
  },
];

describe("EntryTable", () => {
  it("renders one row per entry with name and computes column", () => {
    render(
      <MemoryRouter>
        <EntryTable entries={entries} onRowClick={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
    expect(screen.getByText(/distribusjon/i)).toBeInTheDocument();
  });

  it("invokes onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(
      <MemoryRouter>
        <EntryTable entries={entries} onRowClick={onRowClick} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Poissonfordeling"));
    expect(onRowClick).toHaveBeenCalledWith("poisson-fordeling");
  });
});
