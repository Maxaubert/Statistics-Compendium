import { describe, it, expect } from "vitest";
import { buildSearchIndex } from "./search";
import type { Entry } from "./schema";

const entries: Entry[] = [
  {
    id: "poisson-fordeling",
    name_no: "Poissonfordeling",
    type: "distribution",
    tagline: "Antall hendelser i et tidsvindu, gitt en konstant rate.",
    formula_main: "",
    formula_latex: "",
    what_it_does: "",
    recognition_cues: [
      "Oppgaven nevner Poissonprosess eller rate λ pr. tidsenhet",
      "Du teller hendelser i et fast tidsvindu",
    ],
    filters: {},
  },
  {
    id: "binomial-fordeling",
    name_no: "Binomialfordeling",
    type: "distribution",
    tagline: "Antall suksesser i n uavhengige forsøk.",
    formula_main: "",
    formula_latex: "",
    what_it_does: "",
    recognition_cues: ["Fast antall n forsøk", "To utfall pr. forsøk"],
    filters: {},
  },
];

describe("buildSearchIndex", () => {
  it("finds an entry by name", () => {
    const idx = buildSearchIndex(entries);
    const hits = idx.search("poisson").map((h) => h.item.id);
    expect(hits).toContain("poisson-fordeling");
  });

  it("finds an entry by recognition cue keyword", () => {
    const idx = buildSearchIndex(entries);
    const hits = idx.search("rate").map((h) => h.item.id);
    expect(hits).toContain("poisson-fordeling");
  });

  it("tolerates a typo (fuzzy)", () => {
    const idx = buildSearchIndex(entries);
    const hits = idx.search("poison").map((h) => h.item.id);
    expect(hits).toContain("poisson-fordeling");
  });

  it("returns empty for unrelated query", () => {
    const idx = buildSearchIndex(entries);
    expect(idx.search("xyzunmatched")).toHaveLength(0);
  });
});
