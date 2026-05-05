import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PrintedTable } from "./PrintedTable";

describe("PrintedTable — expand toggle", () => {
  it.each([
    "normal_cumulative",
    "poisson",
    "t_quantile",
    "chi_squared_quantile",
    "binomial",
  ] as const)("renders an expand toggle for %s", (dist) => {
    const inputs: Record<string, number> = {
      z: 1.96, μ: 1, k: 0, df: 5, α: 0.05, n: 10, p: 0.5,
    };
    render(<PrintedTable distribution={dist} inputs={inputs} />);
    expect(screen.getByRole("button", { name: /vis hele tabellen/i })).toBeInTheDocument();
  });

  it("clicking the toggle expands the Z-table to show many more rows", () => {
    render(<PrintedTable distribution="normal_cumulative" inputs={{ z: 1.96 }} />);
    const rowsBefore = document.querySelectorAll("tbody tr").length;
    fireEvent.click(screen.getByRole("button", { name: /vis hele tabellen/i }));
    const rowsAfter = document.querySelectorAll("tbody tr").length;
    expect(rowsAfter).toBeGreaterThan(rowsBefore * 5);
    // Button label flips to collapse
    expect(screen.getByRole("button", { name: /skjul hele tabellen/i })).toBeInTheDocument();
  });

  it("clicking again collapses back to the windowed view", () => {
    render(<PrintedTable distribution="normal_cumulative" inputs={{ z: 1.96 }} />);
    const initial = document.querySelectorAll("tbody tr").length;
    fireEvent.click(screen.getByRole("button", { name: /vis hele tabellen/i }));
    fireEvent.click(screen.getByRole("button", { name: /skjul hele tabellen/i }));
    expect(document.querySelectorAll("tbody tr").length).toBe(initial);
  });

  it("z-quantile (short table) has no toggle since it's already complete", () => {
    render(<PrintedTable distribution="normal_quantile" inputs={{}} />);
    expect(screen.queryByRole("button", { name: /vis hele tabellen/i })).not.toBeInTheDocument();
  });
});

// ===================== Z-tabell (normal cumulative) =====================
describe("PrintedTable — Z (normal cumulative)", () => {
  // Regression: z >= 3.4 used to crash the page. The 7-row window
  // centered on |z| got entirely filtered out (3.1..3.7 all fall
  // outside [-3, 3]), and `reduce` on the empty array threw.
  it.each([-3.5, -3.4, 3.4, 3.5, 5, -10])(
    "renders without crashing for out-of-range z = %s",
    (z) => {
      expect(() =>
        render(
          <PrintedTable distribution="normal_cumulative" inputs={{ z }} />,
        ),
      ).not.toThrow();
    },
  );

  it.each([-3, -2, -1, 0, 1, 2, 3])(
    "renders without crashing for in-range z = %s",
    (z) => {
      expect(() =>
        render(
          <PrintedTable distribution="normal_cumulative" inputs={{ z }} />,
        ),
      ).not.toThrow();
    },
  );

  it("renders with default inputs (no z provided)", () => {
    expect(() =>
      render(<PrintedTable distribution="normal_cumulative" inputs={{}} />),
    ).not.toThrow();
  });

  it("renders for the boundary values from the input config (±3.99)", () => {
    expect(() =>
      render(<PrintedTable distribution="normal_cumulative" inputs={{ z: 3.99 }} />),
    ).not.toThrow();
    expect(() =>
      render(<PrintedTable distribution="normal_cumulative" inputs={{ z: -3.99 }} />),
    ).not.toThrow();
  });

  it("renders without crashing when z is NaN (defaults to 0)", () => {
    expect(() =>
      render(<PrintedTable distribution="normal_cumulative" inputs={{ z: NaN }} />),
    ).not.toThrow();
  });
});

// ===================== Poisson =====================
describe("PrintedTable — Poisson", () => {
  it("renders with default inputs", () => {
    expect(() =>
      render(<PrintedTable distribution="poisson" inputs={{}} />),
    ).not.toThrow();
  });

  it("renders for typical inputs (μ = 1.68, k = 2)", () => {
    const { container } = render(
      <PrintedTable distribution="poisson" inputs={{ μ: 1.68, k: 2 }} />,
    );
    expect(container.querySelector("table")).not.toBeNull();
  });

  it.each([0, 0.02, 0.5, 5, 10, 20, 100])(
    "renders without crashing for μ = %s",
    (μ) => {
      expect(() =>
        render(<PrintedTable distribution="poisson" inputs={{ μ, k: 2 }} />),
      ).not.toThrow();
    },
  );

  it("clamps negative μ without crashing", () => {
    expect(() =>
      render(<PrintedTable distribution="poisson" inputs={{ μ: -5, k: 2 }} />),
    ).not.toThrow();
  });

  it.each([-5, 0, 1, 7, 20])(
    "renders without crashing for k = %s",
    (k) => {
      expect(() =>
        render(<PrintedTable distribution="poisson" inputs={{ μ: 1.68, k }} />),
      ).not.toThrow();
    },
  );

  it("clamps negative k to 0 (does not crash)", () => {
    expect(() =>
      render(<PrintedTable distribution="poisson" inputs={{ μ: 1.68, k: -10 }} />),
    ).not.toThrow();
  });

  it("renders for boundary values (μ = 0.02, k = 0)", () => {
    expect(() =>
      render(<PrintedTable distribution="poisson" inputs={{ μ: 0.02, k: 0 }} />),
    ).not.toThrow();
  });
});

// ===================== Binomial =====================
describe("PrintedTable — Binomial", () => {
  it("renders with default inputs", () => {
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{}} />),
    ).not.toThrow();
  });

  it("renders for typical inputs (n = 10, p = 0.5, k = 5)", () => {
    const { container } = render(
      <PrintedTable
        distribution="binomial"
        inputs={{ n: 10, p: 0.5, k: 5 }}
      />,
    );
    expect(container.querySelector("table")).not.toBeNull();
  });

  it.each([2, 5, 10, 50, 100])("renders without crashing for n = %s", (n) => {
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{ n, p: 0.5, k: 0 }} />),
    ).not.toThrow();
  });

  it("clamps n < 2 (n = 0, n = 1) without crashing", () => {
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{ n: 0, p: 0.5, k: 0 }} />),
    ).not.toThrow();
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{ n: 1, p: 0.5, k: 0 }} />),
    ).not.toThrow();
  });

  it.each([0.01, 0.05, 0.5, 0.95, 0.99])(
    "renders without crashing for p = %s",
    (p) => {
      expect(() =>
        render(<PrintedTable distribution="binomial" inputs={{ n: 10, p, k: 0 }} />),
      ).not.toThrow();
    },
  );

  it("renders without crashing for k = -5 (clamped to 0)", () => {
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{ n: 10, p: 0.5, k: -5 }} />),
    ).not.toThrow();
  });

  it("renders without crashing for boundary values (n = 2, p = 0.01, k = 0)", () => {
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{ n: 2, p: 0.01, k: 0 }} />),
    ).not.toThrow();
  });

  it("renders without crashing for boundary values (n = 10, p = 0.99, k = 10)", () => {
    expect(() =>
      render(<PrintedTable distribution="binomial" inputs={{ n: 10, p: 0.99, k: 10 }} />),
    ).not.toThrow();
  });
});

// ===================== t-quantile =====================
describe("PrintedTable — t-quantile", () => {
  it("renders with default inputs", () => {
    expect(() =>
      render(<PrintedTable distribution="t_quantile" inputs={{}} />),
    ).not.toThrow();
  });

  it("renders for typical inputs (df = 10, α = 0.05)", () => {
    const { container } = render(
      <PrintedTable distribution="t_quantile" inputs={{ df: 10, α: 0.05 }} />,
    );
    expect(container.querySelector("table")).not.toBeNull();
  });

  it.each([1, 5, 10, 30, 100, 999])(
    "renders without crashing for df = %s",
    (df) => {
      expect(() =>
        render(<PrintedTable distribution="t_quantile" inputs={{ df, α: 0.05 }} />),
      ).not.toThrow();
    },
  );

  it("clamps df = 0 to df = 1 (no crash)", () => {
    expect(() =>
      render(<PrintedTable distribution="t_quantile" inputs={{ df: 0, α: 0.05 }} />),
    ).not.toThrow();
  });

  it("clamps negative df to df = 1 (no crash)", () => {
    expect(() =>
      render(<PrintedTable distribution="t_quantile" inputs={{ df: -10, α: 0.05 }} />),
    ).not.toThrow();
  });

  it.each([0.005, 0.01, 0.025, 0.05, 0.1, 0.25])(
    "renders without crashing for α = %s",
    (α) => {
      expect(() =>
        render(<PrintedTable distribution="t_quantile" inputs={{ df: 10, α }} />),
      ).not.toThrow();
    },
  );

  it("renders for boundary values (df = 1, α = 0.005)", () => {
    expect(() =>
      render(<PrintedTable distribution="t_quantile" inputs={{ df: 1, α: 0.005 }} />),
    ).not.toThrow();
  });
});

// ===================== Chi-squared quantile =====================
describe("PrintedTable — Chi-squared quantile", () => {
  it("renders with default inputs", () => {
    expect(() =>
      render(<PrintedTable distribution="chi_squared_quantile" inputs={{}} />),
    ).not.toThrow();
  });

  it("renders for typical inputs (df = 10, α = 0.05)", () => {
    const { container } = render(
      <PrintedTable
        distribution="chi_squared_quantile"
        inputs={{ df: 10, α: 0.05 }}
      />,
    );
    expect(container.querySelector("table")).not.toBeNull();
  });

  it.each([1, 5, 10, 30, 100, 999])(
    "renders without crashing for df = %s",
    (df) => {
      expect(() =>
        render(
          <PrintedTable
            distribution="chi_squared_quantile"
            inputs={{ df, α: 0.05 }}
          />,
        ),
      ).not.toThrow();
    },
  );

  it("clamps df = 0 to df = 1 (no crash)", () => {
    expect(() =>
      render(
        <PrintedTable
          distribution="chi_squared_quantile"
          inputs={{ df: 0, α: 0.05 }}
        />,
      ),
    ).not.toThrow();
  });

  it("clamps negative df to df = 1 (no crash)", () => {
    expect(() =>
      render(
        <PrintedTable
          distribution="chi_squared_quantile"
          inputs={{ df: -3, α: 0.05 }}
        />,
      ),
    ).not.toThrow();
  });

  it.each([0.002, 0.005, 0.05, 0.5, 0.95, 0.998])(
    "renders without crashing for α = %s",
    (α) => {
      expect(() =>
        render(
          <PrintedTable
            distribution="chi_squared_quantile"
            inputs={{ df: 10, α }}
          />,
        ),
      ).not.toThrow();
    },
  );

  it("renders for boundary values (df = 1, α = 0.002)", () => {
    expect(() =>
      render(
        <PrintedTable
          distribution="chi_squared_quantile"
          inputs={{ df: 1, α: 0.002 }}
        />,
      ),
    ).not.toThrow();
  });
});

// ===================== Z-quantile (static table) =====================
describe("PrintedTable — Z-quantile", () => {
  it("renders without crashing (static table, no inputs needed)", () => {
    expect(() =>
      render(<PrintedTable distribution="normal_quantile" inputs={{}} />),
    ).not.toThrow();
  });

  it("ignores inputs (renders the same static table regardless of α)", () => {
    const { container } = render(
      <PrintedTable distribution="normal_quantile" inputs={{ α: 0.05 }} />,
    );
    // The static table has 6 critical α rows.
    expect(container.querySelectorAll("tbody tr").length).toBe(6);
  });
});

// ===================== Cross-distribution smoke test =====================
describe("PrintedTable — all distributions render with garbage / NaN inputs", () => {
  // Note: normal_cumulative is included now that NaN-z is hardened. Widget
  // never feeds NaN to the
  // PrintedTable in practice (handleChange filters it).
  it.each([
    ["binomial", { n: NaN, p: NaN, k: NaN }],
    ["poisson", { μ: NaN, k: NaN }],
    ["normal_cumulative", { z: NaN }],
    ["normal_quantile", { α: NaN }],
    ["t_quantile", { df: NaN, α: NaN }],
    ["chi_squared_quantile", { df: NaN, α: NaN }],
  ] as const)("does not crash for distribution = %s with NaN inputs", (dist, inputs) => {
    expect(() =>
      render(<PrintedTable distribution={dist} inputs={inputs} />),
    ).not.toThrow();
  });

  it.each([
    ["binomial", { n: 999, p: 0.5, k: 999 }],
    ["poisson", { μ: 100, k: 50 }],
    ["normal_cumulative", { z: 100 }],
    ["t_quantile", { df: 999, α: 0.05 }],
    ["chi_squared_quantile", { df: 999, α: 0.05 }],
  ] as const)(
    "does not crash for distribution = %s with very large values",
    (dist, inputs) => {
      expect(() =>
        render(<PrintedTable distribution={dist} inputs={inputs} />),
      ).not.toThrow();
    },
  );

  it.each([
    ["binomial", { n: -5, p: -1, k: -5 }],
    ["poisson", { μ: -5, k: -5 }],
    ["normal_cumulative", { z: -100 }],
    ["t_quantile", { df: -5, α: -0.5 }],
    ["chi_squared_quantile", { df: -5, α: -0.5 }],
  ] as const)(
    "does not crash for distribution = %s with very small / negative values",
    (dist, inputs) => {
      expect(() =>
        render(<PrintedTable distribution={dist} inputs={inputs} />),
      ).not.toThrow();
    },
  );
});

// ===================== Visible-text confirmations =====================
describe("PrintedTable — output reflects inputs (highlight markers)", () => {
  it("shows 'Markert celle: μ ≈ X, k = Y' for poisson", () => {
    render(<PrintedTable distribution="poisson" inputs={{ μ: 1.7, k: 3 }} />);
    expect(screen.getByText(/Markert celle:/)).toBeInTheDocument();
    expect(screen.getByText(/k = 3/)).toBeInTheDocument();
  });

  it("shows the t-table df marker", () => {
    render(<PrintedTable distribution="t_quantile" inputs={{ df: 7, α: 0.05 }} />);
    expect(screen.getByText(/df = 7/)).toBeInTheDocument();
  });

  it("shows the chi-squared df marker", () => {
    render(
      <PrintedTable
        distribution="chi_squared_quantile"
        inputs={{ df: 12, α: 0.05 }}
      />,
    );
    expect(screen.getByText(/df = 12/)).toBeInTheDocument();
  });

  it("shows the binomial n in the caption", () => {
    render(
      <PrintedTable distribution="binomial" inputs={{ n: 8, p: 0.5, k: 2 }} />,
    );
    expect(screen.getByText(/n = 8/)).toBeInTheDocument();
  });
});
