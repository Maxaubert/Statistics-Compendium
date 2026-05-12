import { describe, it, expect } from "vitest";
import { applyFilters, type FilterSelection } from "./filtering";
import { loadAllContent } from "./loadContent";

const data = loadAllContent();

describe("Entry filter coverage", () => {
  // Every entry must be findable by applying ALL of its own filter tags
  it.each(data.entries.map((e) => [e.id, e] as const))(
    "entry '%s' is found when filtering by all its own tags",
    (_id, entry) => {
      const selection = entry.filters;
      const found = applyFilters(data.entries, selection);
      expect(found.map((e) => e.id)).toContain(entry.id);
    },
  );

  // Single-dimension applies — every value used by an entry must match it
  it("every entry filter value matches at least its own entry", () => {
    for (const entry of data.entries) {
      for (const [dim, vals] of Object.entries(entry.filters)) {
        for (const val of vals) {
          const found = applyFilters(data.entries, { [dim]: [val] });
          expect(
            found.map((e) => e.id),
            `entry ${entry.id} tagged ${dim}:${val} but didn't match itself`,
          ).toContain(entry.id);
        }
      }
    }
  });
});

describe("Glossary filter coverage", () => {
  it.each(data.glossary.map((g) => [g.id, g] as const))(
    "glossary '%s' is found when filtering by all its own tags",
    (_id, glos) => {
      // Skip entries with no filter tags (intentionally meta)
      if (Object.keys(glos.filters).length === 0) return;
      const selection = glos.filters;
      const found = applyFilters(data.glossary, selection);
      expect(found.map((g) => g.id)).toContain(glos.id);
    },
  );

  it("every glossary filter value matches at least its own glossary entry", () => {
    for (const glos of data.glossary) {
      for (const [dim, vals] of Object.entries(glos.filters)) {
        for (const val of vals) {
          const found = applyFilters(data.glossary, { [dim]: [val] });
          expect(
            found.map((g) => g.id),
            `glossary ${glos.id} tagged ${dim}:${val} but didn't match itself`,
          ).toContain(glos.id);
        }
      }
    }
  });
});

describe("Multi-filter robustness", () => {
  // Realistic exam-style multi-filter scenarios. Each combines 3-5 filters
  // across dimensions and asserts a known entry surfaces.

  const scenarios: { name: string; selection: FilterSelection; mustInclude: string }[] = [
    {
      name: "binomial probability with table",
      selection: {
        distribution_assumption: ["binomial"],
        computes: ["exact_probability", "at_least_k"],
        tooling: ["cumulative_binomial_table_E1"],
      },
      mustInclude: "binomial-fordeling",
    },
    {
      name: "z-test for mean with known sigma",
      selection: {
        computes: ["hypothesis_test"],
        random_variable: ["mean_of_samples"],
        parameters_known: ["population_variance_known", "alpha_significance"],
        tooling: ["standard_normal_table_E3"],
      },
      mustInclude: "en-utvalg-z-test",
    },
    {
      name: "CI for mu when sigma unknown",
      selection: {
        computes: ["confidence_interval"],
        parameters_known: ["population_variance_unknown", "confidence_level"],
        distribution_assumption: ["t_distribution"],
      },
      mustInclude: "ki-mu-ukjent-sigma",
    },
    {
      name: "Poisson process counting events",
      selection: {
        distribution_assumption: ["poisson"],
        setup: ["events_in_window"],
        parameters_known: ["rate_lambda"],
      },
      mustInclude: "poisson-fordeling",
    },
    {
      name: "regression slope test",
      selection: {
        setup: ["linear_relationship"],
        random_variable: ["slope_estimate"],
        computes: ["hypothesis_test"],
      },
      mustInclude: "regresjon-test-stigningstall",
    },
    {
      name: "bayes setup",
      selection: {
        computes: ["conditional_probability"],
        structural_cues: ["conditional_given"],
      },
      mustInclude: "bayes-setning",
    },
  ];

  it.each(scenarios)(
    "$name surfaces $mustInclude",
    ({ selection, mustInclude }) => {
      const found = applyFilters(data.entries, selection);
      expect(found.map((e) => e.id)).toContain(mustInclude);
    },
  );

  it.each(scenarios)(
    "$name surfaces glossary terms (no crash)",
    ({ selection }) => {
      // Just verify glossary filtering doesn't crash and returns an array.
      const found = applyFilters(data.glossary, selection);
      expect(Array.isArray(found)).toBe(true);
    },
  );
});

describe("Pathological filter combinations don't crash", () => {
  it("applying every entry's filters to glossary doesn't crash", () => {
    for (const entry of data.entries) {
      const found = applyFilters(data.glossary, entry.filters);
      expect(Array.isArray(found)).toBe(true);
    }
  });

  it("applying every glossary entry's filters to entries doesn't crash", () => {
    for (const glos of data.glossary) {
      if (Object.keys(glos.filters).length === 0) continue;
      const found = applyFilters(data.entries, glos.filters);
      expect(Array.isArray(found)).toBe(true);
    }
  });
});

describe("Filter value schema validity", () => {
  it("every entry filter value exists in filters.yaml dimensions", () => {
    const allowedByDim = new Map<string, Set<string>>();
    for (const dim of data.filters.dimensions) {
      allowedByDim.set(dim.key, new Set(dim.options.map((o) => o.key)));
    }

    for (const entry of data.entries) {
      for (const [dim, vals] of Object.entries(entry.filters)) {
        const allowed = allowedByDim.get(dim);
        expect(
          allowed,
          `entry ${entry.id} uses unknown dimension '${dim}'`,
        ).toBeDefined();
        for (const val of vals) {
          expect(
            allowed!.has(val),
            `entry ${entry.id} uses unknown ${dim} value '${val}'`,
          ).toBe(true);
        }
      }
    }
  });

  it("every glossary filter value exists in filters.yaml dimensions", () => {
    const allowedByDim = new Map<string, Set<string>>();
    for (const dim of data.filters.dimensions) {
      allowedByDim.set(dim.key, new Set(dim.options.map((o) => o.key)));
    }

    for (const glos of data.glossary) {
      for (const [dim, vals] of Object.entries(glos.filters)) {
        const allowed = allowedByDim.get(dim);
        expect(
          allowed,
          `glossary ${glos.id} uses unknown dimension '${dim}'`,
        ).toBeDefined();
        for (const val of vals) {
          expect(
            allowed!.has(val),
            `glossary ${glos.id} uses unknown ${dim} value '${val}'`,
          ).toBe(true);
        }
      }
    }
  });
});
