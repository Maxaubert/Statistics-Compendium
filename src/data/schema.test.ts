import { describe, it, expect } from "vitest";
import {
  EntrySchema,
  TableSchema,
  FiltersSchema,
  GlossaryTermSchema,
  WizardSchema,
} from "./schema";

describe("EntrySchema", () => {
  it("accepts a minimal valid entry", () => {
    const minimal = {
      id: "test-entry",
      name_no: "Testfordeling",
      type: "distribution" as const,
      tagline: "En testfordeling.",
      formula_main: "P(X = k) = ...",
      formula_latex: "P(X = k) = ...",
      what_it_does: "Tester ting.",
      recognition_cues: ["cue 1"],
      filters: {},
    };
    expect(EntrySchema.parse(minimal)).toMatchObject(minimal);
  });

  it("rejects an entry without id", () => {
    expect(() => EntrySchema.parse({ name_no: "X" })).toThrow();
  });

  it("accepts detailed_solution_variants on Entry", () => {
    const data = {
      id: "test-entry",
      name_no: "Test",
      type: "distribution" as const,
      tagline: "x",
      formula_main: "f",
      formula_latex: "f",
      what_it_does: "x",
      recognition_cues: ["a"],
      filters: {},
      detailed_solution_variants: [
        {
          label: "Variant A",
          solutions: [
            {
              source: "Praksis · A1",
              question: "Q?",
              sections: [{ label: "Step", lines: [{ text: "x" }] }],
              result: "r",
            },
          ],
        },
      ],
    };
    expect(() => EntrySchema.parse(data)).not.toThrow();
    const parsed = EntrySchema.parse(data);
    expect(parsed.detailed_solution_variants?.[0].label).toBe("Variant A");
    expect(parsed.detailed_solution_variants?.[0].solutions).toHaveLength(1);
  });

  it("accepts overview entry without formula_main", () => {
    const e = EntrySchema.parse({
      id: "varians-oversikt",
      name_no: "Varians (oversikt)",
      type: "overview",
      tagline: "Oversikt over alle variansformer",
      what_it_means: "Varians måler spredning...",
      recognition_cues: ["Spørsmål om varians"],
      filters: {},
    });
    expect(e.type).toBe("overview");
    expect(e.formula_main).toBeUndefined();
    expect(e.what_it_means).toBe("Varians måler spredning...");
  });

  it("accepts method entry without formula_main", () => {
    const e = EntrySchema.parse({
      id: "bootstrapping",
      name_no: "Bootstrapping",
      type: "method",
      tagline: "Resampling-basert estimering",
      what_it_means: "Bootstrapping er en resampling-metode...",
      recognition_cues: ["Spørsmål om resampling"],
      filters: {},
    });
    expect(e.type).toBe("method");
    expect(e.formula_main).toBeUndefined();
    expect(e.formula_latex).toBeUndefined();
    expect(e.what_it_does).toBeUndefined();
    expect(e.what_it_means).toBe("Bootstrapping er en resampling-metode...");
  });

  it("accepts a full entry with all optional fields", () => {
    const full = {
      id: "poisson-fordeling",
      name_no: "Poissonfordeling",
      type: "distribution" as const,
      category: "discrete_distribution",
      tagline: "Antall hendelser i et tidsvindu.",
      formula_main: "P(X = k) = e^(-λt) · (λt)^k / k!",
      formula_latex: "P(X = k) = \\\\frac{e^{-\\\\lambda t}(\\\\lambda t)^k}{k!}",
      what_it_does: "Modellerer antall hendelser.",
      why_use: "Når hendelsene kommer som de kommer.",
      recognition_cues: ["cue a", "cue b"],
      when_NOT_to_use: ["bruk binomial i stedet"],
      symbols: [
        { sym: "λ", means: "rate" },
        { sym: "t", means: "vindu" },
      ],
      properties: {
        expected_value: "E[X] = λt",
        variance: "Var[X] = λt",
        std_dev: "σ = √(λt)",
      },
      filters: {
        computes: ["exact_probability"],
        random_variable: ["discrete_count"],
      },
      solution_template: ["steg 1", "steg 2"],
      common_traps: "husk enheter",
      python_snippet: "from scipy.stats import poisson",
      examples: [
        {
          source: "Eksamen jan26 · 4a",
          excerpt: "...",
          solution_sketch: "P(X=0) ≈ 0.186",
        },
      ],
      detailed_solutions: [
        {
          source: "Eksamen jan26 · 4a",
          question: "...",
          sections: [
            {
              label: "Formel",
              lines: [{ text: "P(X = k) = ..." }],
            },
            {
              label: "Innsatt",
              lines: [
                { text: "μ = 1.68" },
                { comment: "spørres om P(X = 0)" },
                { table_lookup: { ref: "E.2", text: "Slå opp..." } },
                { indent: "= e^(-1.68)" },
              ],
            },
          ],
          result: "P(X = 0) ≈ 0.186",
        },
      ],
      related: [{ id: "poisson-prosess", kind: "concept" as const }],
      tools: ["Tabell E.2"],
    };
    const parsed = EntrySchema.parse(full);
    expect(parsed.id).toBe("poisson-fordeling");
    expect(parsed.detailed_solutions?.[0].sections[1].lines).toHaveLength(4);
  });
});

describe("FiltersSchema", () => {
  it("parses dimension definitions", () => {
    const filters = {
      dimensions: [
        {
          key: "computes",
          label_no: "Beregner",
          options: [
            { key: "exact_probability", label_no: "Sannsynlighet (eksakt)" },
            { key: "expected_value", label_no: "Forventningsverdi" },
          ],
        },
      ],
    };
    expect(FiltersSchema.parse(filters)).toEqual(filters);
  });
});

describe("TableSchema", () => {
  it("accepts a table config", () => {
    const t = {
      id: "E2-poisson-kumulativ",
      name_no: "Poissontabell",
      formal_name_no: "Kumulativ poissonfordeling",
      code: "E.2",
      description: "Slår opp P(X ≤ k).",
      inputs: [
        { name: "μ", type: "number" as const, min: 0.02, max: 20 },
        { name: "k", type: "integer" as const, min: 0, max: 20 },
      ],
      output: "P(X ≤ k)",
      distribution: "poisson" as const,
      related_entries: ["poisson-fordeling"],
    };
    expect(TableSchema.parse(t).id).toBe("E2-poisson-kumulativ");
  });
});

describe("GlossaryTermSchema", () => {
  it("parses minimal valid term", () => {
    const r = GlossaryTermSchema.parse({
      id: "p-verdi",
      term_no: "P-verdi",
      short_def: "Sannsynligheten for å observere så ekstrem en verdi gitt H0.",
    });
    expect(r.term_no).toBe("P-verdi");
  });
  it("rejects bad id", () => {
    expect(() =>
      GlossaryTermSchema.parse({ id: "BadId", term_no: "x", short_def: "y" })
    ).toThrow();
  });
});

describe("WizardSchema", () => {
  it("parses minimal valid tree", () => {
    const r = WizardSchema.parse({
      start: "n0",
      nodes: [
        {
          id: "n0",
          question: "Diskret eller kontinuerlig?",
          options: [
            { label: "Diskret", next: "n1" },
            {
              label: "Kontinuerlig",
              leads_to: [{ id: "normalfordeling", kind: "entry" }],
            },
          ],
        },
        {
          id: "n1",
          question: "Fast antall forsøk?",
          options: [
            { label: "Ja", leads_to: [{ id: "binomial-fordeling", kind: "entry" }] },
          ],
        },
      ],
    });
    expect(r.nodes).toHaveLength(2);
  });
});
