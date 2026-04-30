import {
  EntrySchema, ConceptSchema, TableSchema, FiltersSchema,
  GlossaryTermSchema, PatternSchema, SymbolEntrySchema, WizardSchema,
  type Entry, type Concept, type Table, type Filters,
  type GlossaryTerm, type Pattern, type SymbolEntry, type Wizard,
} from "./schema";

const entryModules    = import.meta.glob("/content/entries/*.yaml",   { eager: true, import: "default" });
const conceptModules  = import.meta.glob("/content/concepts/*.yaml",  { eager: true, import: "default" });
const tableModules    = import.meta.glob("/content/tables/*.yaml",    { eager: true, import: "default" });
const glossaryModules = import.meta.glob("/content/glossary/*.yaml",  { eager: true, import: "default" });
const patternModules  = import.meta.glob("/content/patterns/*.yaml",  { eager: true, import: "default" });
const symbolModules   = import.meta.glob("/content/symbols/*.yaml",   { eager: true, import: "default" });
const filtersModule   = import.meta.glob("/content/filters.yaml",     { eager: true, import: "default" });
const wizardModule    = import.meta.glob("/content/wizard.yaml",      { eager: true, import: "default" });

export interface ContentBundle {
  entries: Entry[];
  concepts: Concept[];
  tables: Table[];
  glossary: GlossaryTerm[];
  patterns: Pattern[];
  symbols: SymbolEntry[];
  wizard: Wizard | null;
  filters: Filters;
}

function parseAll<T>(
  modules: Record<string, unknown>,
  schema: { parse(input: unknown): T },
  kind: string
): T[] {
  return Object.entries(modules).map(([path, raw]) => {
    try {
      return schema.parse(raw);
    } catch (err) {
      throw new Error(
        `Validation failed for ${kind} at ${path}: ${(err as Error).message}`
      );
    }
  });
}

let cached: ContentBundle | null = null;

export function loadAllContent(): ContentBundle {
  if (cached) return cached;

  const entries = parseAll(entryModules, EntrySchema, "entry");
  const concepts = parseAll(conceptModules, ConceptSchema, "concept");
  const tables = parseAll(tableModules, TableSchema, "table");
  const glossary = parseAll(glossaryModules, GlossaryTermSchema, "glossary")
    .filter((g) => g.id !== "stub");
  const patterns = parseAll(patternModules, PatternSchema, "pattern")
    .filter((p) => p.id !== "stub");
  const symbols = parseAll(symbolModules, SymbolEntrySchema, "symbol")
    .filter((s) => s.id !== "stub");

  const filtersFiles = Object.values(filtersModule);
  if (filtersFiles.length === 0) throw new Error("content/filters.yaml is missing");
  const filters = FiltersSchema.parse(filtersFiles[0]);

  const wizardFiles = Object.values(wizardModule);
  const wizard = wizardFiles.length > 0 ? WizardSchema.parse(wizardFiles[0]) : null;

  // Uniqueness check
  const allIds = [
    ...entries.map((e) => `entry:${e.id}`),
    ...concepts.map((c) => `concept:${c.id}`),
    ...tables.map((t) => `table:${t.id}`),
    ...glossary.map((g) => `glossary:${g.id}`),
    ...patterns.map((p) => `pattern:${p.id}`),
    ...symbols.map((s) => `symbol:${s.id}`),
  ];
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length > 0) throw new Error(`Duplicate ids found: ${dupes.join(", ")}`);

  cached = { entries, concepts, tables, glossary, patterns, symbols, wizard, filters };
  return cached;
}
