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
 *  - an object `{ text, conditional }` where `conditional: true` marks the
 *    step as only applying in a specific sub-case (negative z, threshold
 *    failed, etc.). The renderer surfaces these with a distinct accent
 *    border so the eye picks them out.
 */
export const StepItemSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    conditional: z.boolean().optional(),
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
]);

export const EntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  name_no: z.string(),
  type: EntryTypeSchema,
  category: z.string().optional(),
  tagline: z.string(),
  formula_main: z.string(),
  formula_latex: z.string(),
  what_it_does: z.string(),
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
});
export type Entry = z.infer<typeof EntrySchema>;

// ============ Concept (konsepter) ============

export const ConceptSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name_no: z.string(),
  type: z.literal("concept"),
  tagline: z.string(),
  what_it_means: z.string(),
  recognition_cues: z.array(z.string()),
  examples: z.array(ExampleSchema).optional(),
  related: z.array(RelatedRefSchema).optional(),
  filters: FilterSelectionSchema,
});
export type Concept = z.infer<typeof ConceptSchema>;

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
});
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

// ============ Symbol Entry ============

export const SymbolEntryContextSchema = z.object({
  usage: z.string(),       // e.g. "Signifikansnivå (hypotesetest)"
  detail: z.string(),       // 2-3 sentence explanation
  entry_refs: z.array(z.string()).optional(), // entry ids that use this meaning
});

export const SymbolEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),  // e.g. "alpha"
  sym: z.string(),                         // the actual symbol: "α"
  short_def: z.string(),                    // one-line summary
  contexts: z.array(SymbolEntryContextSchema).min(1), // ≥1
  see_also: z.array(RelatedRefSchema).optional(),
});
export type SymbolEntryContext = z.infer<typeof SymbolEntryContextSchema>;
export type SymbolEntry = z.infer<typeof SymbolEntrySchema>;

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
