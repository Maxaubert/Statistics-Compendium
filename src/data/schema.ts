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
  solution_template: z.array(z.string()).optional(),
  common_traps: z.string().optional(),
  python_snippet: z.string().optional(),
  examples: z.array(ExampleSchema).optional(),
  detailed_solutions: z.array(DetailedSolutionSchema).optional(),
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
});
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

// ============ Pattern ============

export const PatternSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name_no: z.string(),
  cue: z.string(),
  procedure: z.array(z.string()),
  entry_refs: z.array(z.string()),
  example: z.string().optional(),
});
export type Pattern = z.infer<typeof PatternSchema>;

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
export type WizardNode = z.infer<typeof WizardNodeSchema>;
export type Wizard = z.infer<typeof WizardSchema>;

export const FiltersSchema = z.object({
  dimensions: z.array(FilterDimensionSchema),
});
export type Filters = z.infer<typeof FiltersSchema>;
