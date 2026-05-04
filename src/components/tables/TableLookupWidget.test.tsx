import { render, screen, fireEvent } from "@testing-library/react";
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

const zTable: Table = {
  id: "E3-z-tabell",
  name_no: "Z-tabell",
  formal_name_no: "Kumulativ standardnormalfordeling",
  code: "E.3",
  description: "x",
  inputs: [{ name: "z", type: "number", min: -3.09, max: 3.09 }],
  output: "G(z) = P(Z ≤ z)",
  distribution: "normal_cumulative",
  inverse: {
    inputs: [{ name: "p", type: "number", min: 0.0001, max: 0.9999 }],
    output: "z slik at G(z) = p",
  },
};

describe("TableLookupWidget", () => {
  it("renders inputs for each table input and shows a result", () => {
    const vals = { μ: 1.68, k: 2 };
    render(
      <TableLookupWidget table={poissonTable} vals={vals} setVals={() => {}} />
    );
    expect(screen.getByText("μ")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText(/P\(X ≤ k\) ≈/)).toBeInTheDocument();
  });

  it("does NOT show a mode toggle when the table has no inverse config", () => {
    render(
      <TableLookupWidget table={poissonTable} vals={{ μ: 1.68, k: 2 }} setVals={() => {}} />,
    );
    expect(screen.queryByRole("tab", { name: /z → p/ })).not.toBeInTheDocument();
  });

  it("shows a forward/inverse toggle on the Z-tabell and switches inputs/output when clicked", () => {
    render(<TableLookupWidget table={zTable} vals={{ z: 1.96 }} setVals={() => {}} />);

    // Forward by default — input is "z", result starts with "G(z)"
    expect(screen.getByText("z")).toBeInTheDocument();
    expect(screen.getByText(/G\(z\) = P\(Z ≤ z\) ≈/)).toBeInTheDocument();

    // Switch to inverse mode
    fireEvent.click(screen.getByRole("tab", { name: /p → z/ }));

    // Input is now "p", result reframed to "z slik at G(z) = p"
    expect(screen.getByText("p")).toBeInTheDocument();
    expect(screen.getByText(/z slik at G\(z\) = p ≈/)).toBeInTheDocument();
  });
});
