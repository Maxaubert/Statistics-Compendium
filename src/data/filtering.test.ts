import { describe, it, expect } from "vitest";
import {
  applyFilters,
  computeFacetCounts,
  type FilterSelection,
} from "./filtering";
import type { Entry } from "./schema";

const sample: Entry[] = [
  {
    id: "a",
    name_no: "A",
    type: "distribution",
    tagline: "",
    formula_main: "",
    formula_latex: "",
    what_it_does: "",
    recognition_cues: [],
    filters: { computes: ["exact_probability"], random_variable: ["discrete_count"] },
  },
  {
    id: "b",
    name_no: "B",
    type: "distribution",
    tagline: "",
    formula_main: "",
    formula_latex: "",
    what_it_does: "",
    recognition_cues: [],
    filters: { computes: ["expected_value"], random_variable: ["discrete_count"] },
  },
  {
    id: "c",
    name_no: "C",
    type: "distribution",
    tagline: "",
    formula_main: "",
    formula_latex: "",
    what_it_does: "",
    recognition_cues: [],
    filters: { computes: ["exact_probability"], random_variable: ["continuous"] },
  },
];

describe("applyFilters", () => {
  it("returns all when no filters selected", () => {
    expect(applyFilters(sample, {})).toHaveLength(3);
  });

  it("filters by a single dimension (OR within dimension)", () => {
    const sel: FilterSelection = { computes: ["exact_probability"] };
    const out = applyFilters(sample, sel);
    expect(out.map((e) => e.id).sort()).toEqual(["a", "c"]);
  });

  it("AND across dimensions, OR within", () => {
    const sel: FilterSelection = {
      computes: ["exact_probability"],
      random_variable: ["discrete_count"],
    };
    const out = applyFilters(sample, sel);
    expect(out.map((e) => e.id)).toEqual(["a"]);
  });

  it("ignores empty dimension arrays", () => {
    const sel: FilterSelection = { computes: [] };
    expect(applyFilters(sample, sel)).toHaveLength(3);
  });
});

describe("computeFacetCounts", () => {
  it("counts how many entries match each option, given current selection", () => {
    const sel: FilterSelection = { random_variable: ["discrete_count"] };
    const counts = computeFacetCounts(sample, sel);
    expect(counts.computes.exact_probability).toBe(1);
    expect(counts.computes.expected_value).toBe(1);
    expect(counts.random_variable.discrete_count).toBe(2);
    expect(counts.random_variable.continuous).toBe(1);
  });
});
