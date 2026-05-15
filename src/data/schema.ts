import { z } from "zod";

// ============ Common pieces ============

export const SymbolSchema = z.object({
  sym: z.string(),
  means: z.string(),
});

export const PropertiesSchema = z.object({
  expected_value: z.string().optional(),
  variance: z.string().optional(),
  std_dev: z.string().optional(),
}).partial();

export const FilterSelectionSchema = z.record(z.string(), z.array(z.string())).default({});

export const RelatedRefSchema = z.object({
  id: z.string(),
  kind: z.enum(["entry", "concept", "table", "glossary", "pattern"]),
});

export const ExampleSchema = z.object({
  source: z.string(),
  excerpt: z.string(),
  solution_sketch: z.string(),
});

// Lines inside a detailed_solutions section can be one of several shapes
export const SolutionLineSchema = z.union([
  z.object({ text: z.string() }),
  z.object({ comment: z.string() }),
  z.object({ indent: z.string() }),
  z.object({ table_lookup: z.object({ ref: z.string(), text: z.string() }) }),
  z.object({ tip: z.string() }),
  z.object({
    table: z.object({
      headers: z.array(z.string()),
      rows: z.array(z.array(z.string())),
      // Optional: tint the last column (e.g., P(X) marginals) and/or last row (P(Y))
      margin_col: z.boolean().optional(),
      margin_row: z.boolean().optional(),
    }),
  }),
  z.object({
    step_trail: z.object({
      steps: z.array(
        z.object({
          label: z.string(),
          // if true → ✓ check (done), if undefined → current
          done: z.boolean().optional(),
        }),
      ),
    }),
  }),
]);

export const SolutionSectionSchema = z.object({
  label: z.string(),
  lines: z.array(SolutionLineSchema),
});

export const DetailedSolutionSchema = z.object({
  source: z.string(),
  question: z.string(),
  sections: z.array(SolutionSectionSchema),
  result: z.string(),
});

/**
 * A single step in a step-by-step guide. Either:
 *  - a plain string (default — renders as a normal numbered step), or
 *  - an object `{ text, conditional, formula, cases }` where:
 *    - `conditional: true` marks the step as only applying in a specific
 *      sub-case (negative z, threshold failed, etc.). The renderer
 *      surfaces these with a distinct accent border.
 *    - `formula` (optional) renders a math expression on its own line
 *      below the step text, in monospace, so the formula is visually
 *      separated from the procedural prose.
 *    - `example: true` marks the step as a worked numeric instance of the
 *      *previous* step's general formula. Renderer indents it like
 *      "Pass paa", uses an emerald accent, and skips the step number.
 *    - `cases` (optional) renders as a small two-column decision matrix
 *      below the text — `when` on the left, `then` (action/verdict)
 *      on the right. Used for "when does this test apply?"-style
 *      Pass-paa lookups that span multiple sub-cases.
 */
export const StepItemSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    conditional: z.boolean().optional(),
    example: z.boolean().optional(),
    // Either a single formula string (one code block) or an array of
    // formula strings (one code block per entry, stacked vertically).
    formula: z.union([z.string(), z.array(z.string())]).optional(),
    cases: z
      .array(z.object({ when: z.string(), then: z.string() }))
      .optional(),
    // Optional inline table — used in example steps that reference a
    // simultantabell or similar grid. Same shape as the table block
    // in detailed solutions.
    table: z
      .object({
        headers: z.array(z.string()),
        rows: z.array(z.array(z.string())),
        margin_col: z.boolean().optional(),
        margin_row: z.boolean().optional(),
      })
      .optional(),
  }),
]);

// ============ Entry (formler) ============

export const EntryTypeSchema = z.enum([
  "distribution",
  "test",
  "regression",
  "identity",
  "rule",
  "combinatorics",
  "overview",
  "method",
]);

/**
 * One row in the card-grid layout used by `type: overview` entries
 * (varians-oversikt, standardavvik-oversikt, forventningsverdi-oversikt).
 * Each form is rendered as a clickable card that opens the glossary
 * popup for `glossary_id` (when present).
 */
export const OversiktFormSchema = z.object({
  title: z.string(),
  symbol: z.string().optional(),
  glossary_id: z.string().optional(),
  formula: z.string(),
  description: z.string().optional(),
  entry_links: z
    .array(z.object({ id: z.string(), label: z.string() }))
    .optional(),
});
export type OversiktForm = z.infer<typeof OversiktFormSchema>;

export const EntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  name_no: z.string(),
  type: EntryTypeSchema,
  category: z.string().optional(),
  tagline: z.string(),
  formula_main: z.string().optional(),
  formula_latex: z.string().optional(),
  what_it_does: z.string().optional(),
  what_it_means: z.string().optional(),
  why_use: z.string().optional(),
  recognition_cues: z.array(z.string()),
  when_NOT_to_use: z.array(z.string()).optional(),
  symbols: z.array(SymbolSchema).optional(),
  properties: PropertiesSchema.optional(),
  filters: FilterSelectionSchema,
  solution_template: z.array(StepItemSchema).optional(),
  /**
   * Multiple step-by-step procedures, rendered as tabs in the detail
   * page. Use this when one entry covers several distinct problem
   * shapes (e.g. for Normalfordeling: P(X<x), P(a<X<b), invers).
   * If both `solution_template` and `solution_variants` are set,
   * `solution_variants` wins.
   */
  solution_variants: z
    .array(
      z.object({
        label: z.string(),
        steps: z.array(StepItemSchema),
      }),
    )
    .optional(),
  common_traps: z.string().optional(),
  python_snippet: z.string().optional(),
  examples: z.array(ExampleSchema).optional(),
  /**
   * Optional grouping of examples by problem-type, mirroring the tabs
   * used in `solution_variants`. When set, the entry detail renders
   * one tab per group so each variant has its own set of practice
   * examples. Use the same labels as `solution_variants` for the UI
   * to feel coherent. If unset, falls back to the flat `examples`.
   */
  example_variants: z
    .array(
      z.object({
        label: z.string(),
        examples: z.array(ExampleSchema),
      }),
    )
    .optional(),
  detailed_solutions: z.array(DetailedSolutionSchema).optional(),
  /**
   * Tabbed detailed solutions, mirroring `solution_variants` labels.
   * When set, the entry-detail page renders one tab per group with
   * 2–3 fully-worked solutions inside. Replaces the older `examples`
   * and `example_variants` UI surfaces.
   */
  detailed_solution_variants: z
    .array(
      z.object({
        label: z.string(),
        solutions: z.array(DetailedSolutionSchema),
      }),
    )
    .optional(),
  related: z.array(RelatedRefSchema).optional(),
  tools: z.array(z.string()).optional(),
  /** Card-grid sections for type: overview entries (see OversiktFormSchema). */
  forms: z.array(OversiktFormSchema).optional(),
  /**
   * Free-form Norwegian search tags (e.g. "kombinatorikk", "regresjon").
   * Indexed by the search engine so users can find related entries by topic
   * even when the topic word doesn't appear in name_no/tagline/cues.
   */
  tags: z.array(z.string()).optional(),
});
export type Entry = z.infer<typeof EntrySchema>;

// ============ Table (vedlegg E.1–E.6) ============

export const TableInputSchema = z.object({
  name: z.string(),
  type: z.enum(["number", "integer"]),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.union([z.number(), z.literal("any")]).optional(),
});

export const TableSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9-]+$/),
  name_no: z.string(),               // short name: "Poissontabell"
  formal_name_no: z.string(),         // formal: "Kumulativ poissonfordeling"
  code: z.string(),                   // "E.2"
  description: z.string(),
  inputs: z.array(TableInputSchema),
  output: z.string(),                 // human-readable: "P(X ≤ k)"
  distribution: z.enum([
    "binomial",
    "poisson",
    "normal_cumulative",
    "normal_quantile",
    "t_quantile",
    "chi_squared_quantile",
    "mann_whitney_quantile",
  ]),
  related_entries: z.array(z.string()).optional(),
  /** Optional caption rendered under the active mode's inputs — used to head off
   *  parameterization misunderstandings (e.g. "α er HØYRE-hale-sannsynligheten"). */
  input_hint: z.string().optional(),
  /** Optional override for the mode-toggle button label for the forward direction.
   *  Defaults to a generic "z → p" arrow style if not provided. */
  toggle_label: z.string().optional(),
  /**
   * Optional alternate input mode. When set, the widget shows a toggle so the
   * user can switch how they parameterize the lookup (e.g. for E.3: forward
   * `z → p` vs inverse `p → z`; for E.4: `α → z_α` vs `p → z`). Both modes
   * use the same `distribution` key — only the input shape changes.
   */
  inverse: z
    .object({
      inputs: z.array(TableInputSchema),
      output: z.string(),
      input_hint: z.string().optional(),
      toggle_label: z.string().optional(),
    })
    .optional(),
});
export type Table = z.infer<typeof TableSchema>;

// ============ Filters config ============

export const FilterOptionSchema = z.object({
  key: z.string(),
  label_no: z.string(),
});

export const FilterDimensionSchema = z.object({
  key: z.string(),
  label_no: z.string(),
  options: z.array(FilterOptionSchema),
});

// ============ Glossary ============

export const GlossaryTermSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  term_no: z.string(),
  short_def: z.string(),
  long_def: z.string().optional(),
  see_also: z.array(RelatedRefSchema).optional(),
  /**
   * Surface forms used by the auto-linker to find this term inside prose
   * (e.g. inflected forms like "stokastisk", "stokastiske", "stokastisk variabel").
   * Case-insensitive, whole-word match. If omitted, the linker falls back to
   * `term_no` with parenthetical decoration stripped.
   */
  aliases: z.array(z.string()).optional(),
  /**
   * Filter tags using the same dimensions as entries (computes,
   * random_variable, setup, structural_cues, parameters_known,
   * distribution_assumption, tooling). Lets glossary terms surface
   * in the cross-search section when a filter is active. Defaults
   * to {} so legacy yaml without filters still parses.
   */
  filters: FilterSelectionSchema,
});
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

// ============ Wizard ============

export const WizardOptionSchema = z.object({
  label: z.string(),
  next: z.string().optional(),
  leads_to: z.array(RelatedRefSchema).optional(),
});

export const WizardNodeSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(WizardOptionSchema),
});

export const WizardSchema = z.object({
  start: z.string(),
  nodes: z.array(WizardNodeSchema),
});
export type WizardOption = z.infer<typeof WizardOptionSchema>;
export type WizardNode = z.infer<typeof WizardNodeSchema>;
export type Wizard = z.infer<typeof WizardSchema>;

export const FiltersSchema = z.object({
  dimensions: z.array(FilterDimensionSchema),
});
export type Filters = z.infer<typeof FiltersSchema>;
