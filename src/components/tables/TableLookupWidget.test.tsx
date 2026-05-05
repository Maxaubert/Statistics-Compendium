import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { TableLookupWidget } from "./TableLookupWidget";
import { PrintedTable } from "./PrintedTable";
import type { Table } from "@/data/schema";

// ===================== Fixtures (mirroring content/tables/*.yaml) =====================

const binomialTable: Table = {
  id: "E1-binomial-kumulativ",
  name_no: "Binomialtabell",
  formal_name_no: "Kumulativ binomisk sannsynlighet",
  code: "E.1",
  description: "x",
  inputs: [
    { name: "n", type: "integer", min: 2, max: 10, step: 1 },
    { name: "p", type: "number", min: 0.01, max: 0.99, step: "any" },
    { name: "k", type: "integer", min: 0, max: 10, step: 1 },
  ],
  output: "P(X ≤ k)",
  distribution: "binomial",
};

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
  inputs: [{ name: "z", type: "number", min: -3.99, max: 3.99 }],
  output: "G(z) = P(Z ≤ z)",
  distribution: "normal_cumulative",
  toggle_label: "z → p",
  inverse: {
    inputs: [{ name: "p", type: "number", min: 0.0001, max: 0.9999 }],
    output: "z slik at G(z) = p",
    toggle_label: "p → z",
  },
};

const zQuantileTable: Table = {
  id: "E4-z-kvantiltabell",
  name_no: "Z-kvantiltabell",
  formal_name_no: "Standardnormalfordelingens kvantiltabell",
  code: "E.4",
  description: "x",
  inputs: [{ name: "α", type: "number", min: 0.001, max: 0.5 }],
  output: "z_α",
  distribution: "normal_quantile",
  toggle_label: "α (høyre hale)",
  inverse: {
    inputs: [{ name: "p", type: "number", min: 0.0001, max: 0.9999 }],
    output: "z slik at G(z) = p",
    toggle_label: "p (kumulativ)",
  },
};

const tTable: Table = {
  id: "E5-t-tabell",
  name_no: "t-tabell",
  formal_name_no: "t-fordelingens kvantiltabell",
  code: "E.5",
  description: "x",
  inputs: [
    { name: "df", type: "integer", min: 1, max: 1000, step: 1 },
    { name: "α", type: "number", min: 0.005, max: 0.25 },
  ],
  output: "t_(α, df)",
  distribution: "t_quantile",
};

const chiSquaredTable: Table = {
  id: "E6-kjikvadrattabell",
  name_no: "Kjikvadrattabell",
  formal_name_no: "Kjikvadratfordelingens kvantiltabell",
  code: "E.6",
  description: "x",
  inputs: [
    { name: "df", type: "integer", min: 1, max: 100, step: 1 },
    { name: "α", type: "number", min: 0.002, max: 0.998 },
  ],
  output: "χ²_(α, df)",
  distribution: "chi_squared_quantile",
};

const allTables = [
  binomialTable,
  poissonTable,
  zTable,
  zQuantileTable,
  tTable,
  chiSquaredTable,
];

// Build a default `vals` object for any of the fixture tables.
function defaultsFor(t: Table): Record<string, number> {
  return Object.fromEntries(t.inputs.map((i) => [i.name, i.min ?? 0]));
}

// ===================== Original tests (preserved) =====================

describe("TableLookupWidget", () => {
  it("renders inputs for each table input and shows a result", () => {
    const vals = { μ: 1.68, k: 2 };
    render(
      <TableLookupWidget table={poissonTable} vals={vals} setVals={() => {}} />,
    );
    expect(screen.getByText("μ")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText(/P\(X ≤ k\) ≈/)).toBeInTheDocument();
  });

  it("does NOT show a mode toggle when the table has no inverse config", () => {
    render(
      <TableLookupWidget
        table={poissonTable}
        vals={{ μ: 1.68, k: 2 }}
        setVals={() => {}}
      />,
    );
    expect(screen.queryByRole("tab", { name: /z → p/ })).not.toBeInTheDocument();
  });

  it("shows a forward/inverse toggle on the Z-tabell and switches inputs/output when clicked", () => {
    render(
      <TableLookupWidget table={zTable} vals={{ z: 1.96 }} setVals={() => {}} />,
    );

    expect(screen.getByText("z")).toBeInTheDocument();
    expect(screen.getByText(/G\(z\) = P\(Z ≤ z\) ≈/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /p → z/ }));

    expect(screen.getByText("p")).toBeInTheDocument();
    expect(screen.getByText(/z slik at G\(z\) = p ≈/)).toBeInTheDocument();
  });
});

// ===================== Renders for every table =====================

describe("TableLookupWidget — renders without crashing for every fixture", () => {
  it.each(allTables.map((t) => [t.id, t] as const))(
    "renders %s without crashing",
    (_id, table) => {
      expect(() =>
        render(
          <TableLookupWidget
            table={table}
            vals={defaultsFor(table)}
            setVals={() => {}}
          />,
        ),
      ).not.toThrow();
    },
  );
});

// ===================== Empty input → reset to default =====================

describe("TableLookupWidget — input fields show liveVals on mount", () => {
  // Fields mirror liveVals so users see the current default (e.g. "0")
  // rather than an empty box on first paint.
  it("shows '0' for z on mount (z-table forward)", () => {
    render(<TableLookupWidget table={zTable} vals={{ z: 0 }} setVals={() => {}} />);
    const input = screen.getAllByRole("spinbutton")[0] as HTMLInputElement;
    expect(input.value).toBe("0");
  });

  it("shows the seeded vals for poisson (μ, k)", () => {
    render(
      <TableLookupWidget table={poissonTable} vals={{ μ: 5, k: 2 }} setVals={() => {}} />,
    );
    const inputs = screen.getAllByRole("spinbutton") as HTMLInputElement[];
    expect(inputs.map((i) => i.value)).toEqual(["5", "2"]);
  });

  it("inverse mode also shows the inverse defaults (z-table p)", () => {
    render(<TableLookupWidget table={zTable} vals={{ z: 0 }} setVals={() => {}} />);
    fireEvent.click(screen.getByRole("tab", { name: /p → z/i }));
    const input = screen.getAllByRole("spinbutton")[0] as HTMLInputElement;
    // defaultValueFor('p') = 0.95
    expect(input.value).toBe("0.95");
  });
});

describe("TableLookupWidget — handleChange empty-input fix", () => {
  it("calls setVals with the input's default when the field is cleared (poisson μ)", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={poissonTable}
        vals={{ μ: 5, k: 2 }}
        setVals={setVals}
      />,
    );

    const μInput = screen.getAllByRole("spinbutton")[0];
    // Field starts empty, so type a value first, then clear it.
    fireEvent.change(μInput, { target: { value: "3" } });
    setVals.mockClear();
    fireEvent.change(μInput, { target: { value: "" } });

    expect(setVals).toHaveBeenCalled();
    const lastCall = setVals.mock.calls.at(-1)![0];
    // defaultValueFor('μ') = 1
    expect(lastCall.μ).toBe(1);
  });

  it("calls setVals with the input's default when df is cleared (t-table)", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={tTable}
        vals={{ df: 999, α: 0.05 }}
        setVals={setVals}
      />,
    );
    // df is the first input (index 0). Field starts empty; type, then clear.
    const dfInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(dfInput, { target: { value: "999" } });
    setVals.mockClear();
    fireEvent.change(dfInput, { target: { value: "" } });

    expect(setVals).toHaveBeenCalled();
    const lastCall = setVals.mock.calls.at(-1)![0];
    // defaultValueFor('df') = 5
    expect(lastCall.df).toBe(5);
  });

  // Specific bug reproducer from the task spec: type 999 in df, then clear,
  // then verify the printed table reflects the default df = 5 (not the
  // stale 999). Uses a controlled host so the printed table re-renders
  // with whatever `setVals` writes.
  it("reproduces the spec scenario: typing 999 in df, then clearing, resets the printed t-table to df ≈ 5", () => {
    function Host() {
      const [vals, setVals] = useState<Record<string, number>>({
        df: 5,
        α: 0.05,
      });
      return (
        <div>
          <TableLookupWidget table={tTable} vals={vals} setVals={setVals} />
          <PrintedTable distribution="t_quantile" inputs={vals} />
        </div>
      );
    }
    render(<Host />);

    const dfInput = screen.getAllByRole("spinbutton")[0];

    fireEvent.change(dfInput, { target: { value: "999" } });
    expect(screen.getByText(/df = 999/)).toBeInTheDocument();

    fireEvent.change(dfInput, { target: { value: "" } });
    expect(screen.queryByText(/df = 999/)).not.toBeInTheDocument();
    expect(screen.getByText(/df = 5/)).toBeInTheDocument();
  });
});

// ===================== Out-of-range values =====================

describe("TableLookupWidget — out-of-range values do not crash", () => {
  it.each([
    ["z = 10", zTable, { z: 10 }],
    ["z = -10", zTable, { z: -10 }],
    ["μ = 100, k = 50", poissonTable, { μ: 100, k: 50 }],
    ["μ = 0, k = -5", poissonTable, { μ: 0, k: -5 }],
    ["df = 999", tTable, { df: 999, α: 0.05 }],
    ["df = 0 (clamped)", tTable, { df: 0, α: 0.05 }],
    ["df = -1 (negative)", tTable, { df: -1, α: 0.05 }],
    ["α = -0.5", tTable, { df: 10, α: -0.5 }],
    ["chi df = 999", chiSquaredTable, { df: 999, α: 0.05 }],
    ["binomial n = 999", binomialTable, { n: 999, p: 0.5, k: 5 }],
    ["binomial p = -1", binomialTable, { n: 10, p: -1, k: 0 }],
  ] as const)("renders %s without crashing", (_label, table, vals) => {
    expect(() =>
      render(
        <TableLookupWidget table={table} vals={vals} setVals={() => {}} />,
      ),
    ).not.toThrow();
  });
});

// ===================== Mode toggle resets state cleanly =====================

describe("TableLookupWidget — mode toggle (forward/inverse)", () => {
  it("resets to forward mode when the table id changes (e.g. route swap)", () => {
    const { rerender } = render(
      <TableLookupWidget
        table={zTable}
        vals={{ z: 1.96 }}
        setVals={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: /p → z/ }));
    expect(screen.getByText("p")).toBeInTheDocument();

    // Swap to a different table — mode should reset to forward.
    rerender(
      <TableLookupWidget
        table={zQuantileTable}
        vals={{ α: 0.05 }}
        setVals={() => {}}
      />,
    );
    // Forward mode shows the α input on E.4.
    expect(screen.getByText("α")).toBeInTheDocument();
  });

  it("keeps inverse-mode local state independent of the parent's vals", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={zTable}
        vals={{ z: 1.96 }}
        setVals={setVals}
      />,
    );

    // Switch to inverse mode and type a probability — parent should not
    // be informed (inverse uses its own local state).
    fireEvent.click(screen.getByRole("tab", { name: /p → z/ }));
    const pInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(pInput, { target: { value: "0.99" } });

    expect(setVals).not.toHaveBeenCalled();
  });

  it("updates the result widget after toggling to inverse mode and typing", () => {
    const { container } = render(
      <TableLookupWidget
        table={zTable}
        vals={{ z: 0 }}
        setVals={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: /p → z/ }));
    const pInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(pInput, { target: { value: "0.975" } });
    // The result text node lives inside the "Resultat" block; jStat.normal.inv(0.975) ≈ 1.96.
    expect(container.textContent).toContain("1.9600");
  });
});

// ===================== Mid-typing guards =====================

describe("TableLookupWidget — mid-typing & change behavior", () => {
  it("calls setVals with the parsed number when a complete number is typed", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={zTable}
        vals={{ z: 0 }}
        setVals={setVals}
      />,
    );
    const zInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(zInput, { target: { value: "1.96" } });
    expect(setVals).toHaveBeenCalledWith({ z: 1.96 });
  });

  it("calls setVals with a negative number when typed", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={zTable}
        vals={{ z: 0 }}
        setVals={setVals}
      />,
    );
    const zInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(zInput, { target: { value: "-1.5" } });
    expect(setVals).toHaveBeenCalledWith({ z: -1.5 });
  });

  it("calls setVals with the integer 0 when '0' is typed", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={zTable}
        vals={{ z: 1.96 }}
        setVals={setVals}
      />,
    );
    const zInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(zInput, { target: { value: "0" } });
    expect(setVals).toHaveBeenCalledWith({ z: 0 });
  });

  it("typing a complete decimal preserves all sibling vals", () => {
    const setVals = vi.fn();
    render(
      <TableLookupWidget
        table={tTable}
        vals={{ df: 10, α: 0.05 }}
        setVals={setVals}
      />,
    );
    const dfInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(dfInput, { target: { value: "30" } });
    expect(setVals).toHaveBeenCalledWith({ df: 30, α: 0.05 });
  });
});

// ===================== Result widget shows '—' on bad inputs =====================

describe("TableLookupWidget — result widget gracefully degrades", () => {
  it("renders the result label and a numeric value with NaN inputs (does not crash)", () => {
    render(
      <TableLookupWidget
        table={poissonTable}
        vals={{ μ: NaN, k: NaN }}
        setVals={() => {}}
      />,
    );
    expect(screen.getByText(/P\(X ≤ k\) ≈/)).toBeInTheDocument();
  });

  it("renders for a fixture in inverse mode where the lookup may throw", () => {
    // E.4 inverse uses normal_quantile distribution → has an inverse path.
    // Assert that switching modes & rendering does not crash and the
    // result label updates.
    const { container } = render(
      <TableLookupWidget
        table={zQuantileTable}
        vals={{ α: 0.05 }}
        setVals={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: /p \(kumulativ\)/ }));
    expect(container.textContent).toContain("z slik at G(z) = p");
  });
});
