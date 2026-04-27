import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TableLookupWidget } from "./TableLookupWidget";
import type { Table } from "@/data/schema";

const poissonTable: Table = {
  id: "E2-poisson-kumulativ",
  name_no: "Poissontabell",
  formal_name_no: "Kumulativ poissonfordeling",
  code: "E.2",
  description: "x",
  inputs: [
    { name: "μ", type: "number", min: 0.02, max: 20 },
    { name: "k", type: "integer", min: 0, max: 20 },
  ],
  output: "P(X ≤ k)",
  distribution: "poisson",
};

describe("TableLookupWidget", () => {
  it("renders inputs for each table input and shows a result", () => {
    render(<TableLookupWidget table={poissonTable} />);
    expect(screen.getByText("μ")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText(/P\(X ≤ k\) ≈/)).toBeInTheDocument();
  });
});
