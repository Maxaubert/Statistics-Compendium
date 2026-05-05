import { describe, it, expect } from "vitest";
import { buildSearchIndex, searchEntries, buildGlossarySearchIndex, searchGlossary } from "./search";
import type { Entry, GlossaryTerm } from "./schema";

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

  it("matches across hyphens (p verdi finds p-verdi)", () => {
    const items: Entry[] = [
      {
        id: "p-verdi-entry",
        name_no: "P-verdi",
        type: "identity",
        tagline: "Sannsynlighet for å se data minst like ekstreme.",
        formula_main: "",
        formula_latex: "",
        what_it_does: "",
        recognition_cues: [],
        filters: {},
      },
    ];
    const idx = buildSearchIndex(items);
    expect(searchEntries(idx, "p verdi").map((h) => h.item.id)).toContain("p-verdi-entry");
    expect(searchEntries(idx, "p-verdi").map((h) => h.item.id)).toContain("p-verdi-entry");
  });
});

describe("buildGlossarySearchIndex", () => {
  const terms: GlossaryTerm[] = [
    {
      id: "p-verdi-glos",
      term_no: "P-verdi",
      short_def: "Sannsynligheten for ekstreme data gitt H₀.",
    },
    {
      id: "frihetsgrader-glos",
      term_no: "Frihetsgrader (df, ν)",
      short_def: "Antall uavhengige biter informasjon.",
      aliases: ["frihetsgrader", "df", "ν"],
    },
  ];

  it("finds a term by name", () => {
    const idx = buildGlossarySearchIndex(terms);
    expect(searchGlossary(idx, "frihetsgrader").map((h) => h.item.id))
      .toContain("frihetsgrader-glos");
  });

  it("finds a hyphenated term via space query", () => {
    const idx = buildGlossarySearchIndex(terms);
    expect(searchGlossary(idx, "p verdi").map((h) => h.item.id))
      .toContain("p-verdi-glos");
  });

  it("finds a term via an alias", () => {
    const idx = buildGlossarySearchIndex(terms);
    expect(searchGlossary(idx, "df").map((h) => h.item.id))
      .toContain("frihetsgrader-glos");
  });
});
