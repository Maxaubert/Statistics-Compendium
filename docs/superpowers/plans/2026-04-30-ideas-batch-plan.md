# Ideas-Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 10 ideas (A5, A9, B1, B3, B4, B5, B7, B9, C1, C5) the user picked from `ideas.md`, on top of the existing stat-compendium structure.

**Architecture:** Three new content schemas (Glossary, Pattern, Wizard) loaded alongside existing entries/concepts/tables. Five new routes (`/cheatsheet`, `/symboler`, `/ordliste`, `/monstre`, `/veiviser`). One new banner sub-nav. Dark-mode tokens. Static SVG distribution thumbnails. Three new chi-squared entries.

**Tech Stack:** Existing — React 18 + TypeScript + Vite 6, TailwindCSS v4 with @theme tokens, Zod, Vitest, lucide-react icons. No new dependencies.

---

## Phase 1: Foundation

### Task 1: Extend schema with three new content types

**Files:**
- Modify: `src/data/schema.ts`
- Test: `src/data/schema.test.ts`

- [ ] **Step 1: Write failing tests for the new schemas**

Add to `src/data/schema.test.ts`:
```ts
import {
  GlossaryTermSchema,
  PatternSchema,
  WizardSchema,
} from "./schema";

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

describe("PatternSchema", () => {
  it("parses minimal valid pattern", () => {
    const r = PatternSchema.parse({
      id: "rate-til-poisson",
      name_no: "Rate gitt, antall hendelser i vindu",
      cue: "Oppgaven gir en rate λ pr. tidsenhet.",
      procedure: ["Identifiser λ og t", "Regn μ = λt"],
      entry_refs: ["poisson-fordeling"],
    });
    expect(r.entry_refs).toEqual(["poisson-fordeling"]);
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
```

- [ ] **Step 2: Run failing test**

Run: `npm test -- schema`
Expected: FAIL — schemas not exported

- [ ] **Step 3: Add schemas to `src/data/schema.ts`**

Append before the final `Filters` export:
```ts
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
```

- [ ] **Step 4: Verify tests pass**

Run: `npm test -- schema`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/schema.ts src/data/schema.test.ts
git commit -m "feat: add Glossary, Pattern, Wizard schemas"
```

### Task 2: Extend `loadContent` to load new content types

**Files:**
- Modify: `src/data/loadContent.ts`
- Test: `src/data/loadContent.test.ts`
- Create: `content/glossary/.gitkeep`
- Create: `content/patterns/.gitkeep`
- Create: `content/wizard.yaml` (minimal stub)

- [ ] **Step 1: Add stub content files so glob returns at least one entry**

Create `content/glossary/_stub.yaml`:
```yaml
id: stub
term_no: stub
short_def: placeholder until real terms are added
```

Create `content/patterns/_stub.yaml`:
```yaml
id: stub
name_no: stub
cue: placeholder
procedure:
  - placeholder
entry_refs:
  - poisson-fordeling
```

Create `content/wizard.yaml`:
```yaml
start: n0
nodes:
  - id: n0
    question: Diskret eller kontinuerlig?
    options:
      - label: Diskret
        leads_to:
          - id: poisson-fordeling
            kind: entry
      - label: Kontinuerlig
        leads_to:
          - id: normalfordeling
            kind: entry
```

- [ ] **Step 2: Modify `src/data/loadContent.ts`**

```ts
import {
  EntrySchema, ConceptSchema, TableSchema, FiltersSchema,
  GlossaryTermSchema, PatternSchema, WizardSchema,
  type Entry, type Concept, type Table, type Filters,
  type GlossaryTerm, type Pattern, type Wizard,
} from "./schema";

const entryModules    = import.meta.glob("/content/entries/*.yaml",   { eager: true, import: "default" });
const conceptModules  = import.meta.glob("/content/concepts/*.yaml",  { eager: true, import: "default" });
const tableModules    = import.meta.glob("/content/tables/*.yaml",    { eager: true, import: "default" });
const glossaryModules = import.meta.glob("/content/glossary/*.yaml",  { eager: true, import: "default" });
const patternModules  = import.meta.glob("/content/patterns/*.yaml",  { eager: true, import: "default" });
const filtersModule   = import.meta.glob("/content/filters.yaml",     { eager: true, import: "default" });
const wizardModule    = import.meta.glob("/content/wizard.yaml",      { eager: true, import: "default" });

export interface ContentBundle {
  entries: Entry[];
  concepts: Concept[];
  tables: Table[];
  glossary: GlossaryTerm[];
  patterns: Pattern[];
  wizard: Wizard | null;
  filters: Filters;
}

// ... existing parseAll function ...

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
  ];
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length > 0) throw new Error(`Duplicate ids found: ${dupes.join(", ")}`);

  cached = { entries, concepts, tables, glossary, patterns, wizard, filters };
  return cached;
}
```

Note: keep the stub-filter so the `_stub.yaml` files don't show up in real lists. They exist only so the Vite glob has at least one match (real content can be added incrementally without breaking).

- [ ] **Step 3: Update test to assert new fields are present**

Add to `src/data/loadContent.test.ts`:
```ts
it("loads glossary, patterns, and wizard", () => {
  const bundle = loadAllContent();
  expect(bundle.glossary).toBeInstanceOf(Array);
  expect(bundle.patterns).toBeInstanceOf(Array);
  expect(bundle.wizard).not.toBeNull();
});
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS — all existing tests + new ones

- [ ] **Step 5: Commit**

```bash
git add src/data/loadContent.ts src/data/loadContent.test.ts content/glossary content/patterns content/wizard.yaml
git commit -m "feat: load glossary, patterns, wizard content alongside existing types"
```

---

## Phase 2: Dark mode (A9) and clear-filters button (A5)

### Task 3: Implement dark mode tokens

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Add `[data-theme="dark"]` block**

Append to `src/styles/tokens.css`:
```css
[data-theme="dark"] {
  /* Neutrals — invert lightness */
  --color-ink:        #f5f5f4;
  --color-ink-2:      #d6d3d1;
  --color-ink-3:      #a8a29e;
  --color-ink-4:      #78716c;
  --color-paper:      #0c0a09;
  --color-paper-2:    #1c1917;
  --color-card:       #18181b;
  --color-line:       #292524;
  --color-line-2:     #44403c;

  /* Primary indigo — bump up brightness */
  --color-primary:        #818cf8;
  --color-primary-2:      #a5b4fc;
  --color-primary-3:      #c7d2fe;
  --color-primary-soft:   #1e1b4b;

  /* Cyan stays vivid */
  --color-cyan:           #67e8f9;
  --color-cyan-2:         #22d3ee;
  --color-cyan-soft:      #155e75;
  --color-cyan-deep:      #cffafe;

  /* Warn — softer in dark */
  --color-warn:           #fbbf24;
  --color-warn-soft:      #451a03;

  /* Calc block — keep dark bg, slightly lift contrast */
  --color-calc-bg:        #0f0d2e;
  --color-calc-border:    #4338ca;
}
```

- [ ] **Step 2: Visual smoke test**

Run dev server: `npm run dev`
- Toggle theme button on banner
- Check: list view bg is dark, ink readable
- Check: entry detail card bg is dark, formula readable
- Check: table detail Calc block still readable
- Check: filter sidebar bg is dark
- Check: KaTeX formulas still readable (they pick up `currentColor`)

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: implement full dark-mode palette via [data-theme=dark] tokens"
```

### Task 4: Visible clear-filters button

**Files:**
- Modify: `src/components/list/FilterSidebar.tsx`
- Test: `src/components/list/FilterSidebar.test.tsx`

- [ ] **Step 1: Update test to assert prominent button**

Modify the existing test (or add new):
```ts
it("renders prominent clear-all button when filters active", () => {
  render(
    <FilterSidebar
      filters={fixtureFilters}
      selection={{ computes: ["expected_value"] }}
      counts={{}}
      onToggle={() => {}}
      onClear={() => {}}
    />
  );
  const btn = screen.getByRole("button", { name: /nullstill alle filtere/i });
  expect(btn).toBeInTheDocument();
});
```

- [ ] **Step 2: Replace text link with prominent button**

In `src/components/list/FilterSidebar.tsx`, replace the existing header block:
```tsx
import { X } from "lucide-react";

// ...
return (
  <aside className="border-r border-line bg-paper-2 p-3.5 text-sm">
    <div className="mb-2 border-b border-line pb-2 font-serif text-sm font-semibold text-ink-2">
      Filter
    </div>
    {hasAny && (
      <button
        type="button"
        onClick={onClear}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-md border border-primary-2 bg-primary-soft px-3 py-2 text-[13px] font-medium text-primary hover:bg-primary-2 hover:text-white"
      >
        <X size={14} />
        Nullstill alle filtere
      </button>
    )}
    {filters.dimensions.map(/* unchanged */)}
  </aside>
);
```

- [ ] **Step 3: Run tests**

Run: `npm test -- FilterSidebar`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/list/FilterSidebar.tsx src/components/list/FilterSidebar.test.tsx
git commit -m "feat: replace 'Nullstill' text link with prominent clear-all button"
```

---

## Phase 3: Chi-squared entries (C1)

### Task 5: Add three chi-squared YAML entries

**Files:**
- Create: `content/entries/kjikvadrat-goodness-of-fit.yaml`
- Create: `content/entries/kjikvadrat-uavhengighet.yaml`
- Create: `content/entries/ki-varians.yaml`

- [ ] **Step 1: Write `kjikvadrat-goodness-of-fit.yaml`**

```yaml
id: kjikvadrat-goodness-of-fit
name_no: Kjikvadrat-tilpasningstest
type: test
category: hypothesis_test
tagline: "Tester om observerte frekvenser passer en forventet fordeling."

formula_main: "χ² = Σ (O_i − E_i)² / E_i"
formula_latex: "\\chi^2 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i}"

what_it_does: |
  Sammenligner observerte antall i k kategorier mot forventede antall under
  en gitt nullhypotese (f.eks. lik fordeling, eller en bestemt teoretisk
  fordeling). Stor χ²-verdi → observasjonene avviker fra forventningen.

why_use: |
  Når du har data i kategorier (ikke kontinuerlige målinger) og vil
  teste om fordelingen samsvarer med en hypotese.

recognition_cues:
  - "Data oppgis som antall i kategorier (k > 2)"
  - "Spørsmålet sier 'tester om fordelingen er ...' eller 'er det forskjell mellom kategoriene'"
  - "Forventede antall E_i kan regnes fra nullhypotesen"
  - "Alle E_i ≥ 5 (tommelfingerregel for at testen er gyldig)"

when_NOT_to_use:
  - "Bare to kategorier → bruk z-test for andel i stedet"
  - "Kontinuerlige målinger → bruk normaltest eller t-test"
  - "Forventede antall E_i < 5 i flere celler → testen er ikke pålitelig"

symbols:
  - { sym: "O_i", means: "observert antall i kategori i" }
  - { sym: "E_i", means: "forventet antall i kategori i under H0" }
  - { sym: "k",   means: "antall kategorier" }
  - { sym: "ν",   means: "frihetsgrader = k − 1 (eller k − 1 − m hvis m parametre er estimert)" }

filters:
  computes: [hypothesis_test]
  random_variable: [discrete_count]
  setup: [single_population]
  structural_cues: [more_than_two_categories, summary_stats_given]
  parameters_known: [alpha_significance]
  distribution_assumption: [chi_squared]
  tooling: [chi_square_quantile_table_E6]

solution_template:
  - "Skriv ned H0 (forventet fordeling) og H1 (avvik)"
  - "Regn forventede antall E_i under H0"
  - "Sjekk at alle E_i ≥ 5"
  - "Regn observatoren χ² = Σ (O_i − E_i)² / E_i"
  - "Bestem frihetsgrader ν = k − 1 (minus m hvis estimerte parametre)"
  - "Slå opp kritisk verdi χ²_(α, ν) i tabell E.6"
  - "Forkast H0 hvis χ² > kritisk verdi"

common_traps: |
  Frihetsgradene faller med 1 for hver parameter du har estimert fra
  dataene (ikke bare k − 1). Forventede antall, ikke observerte antall,
  i nevneren. Pass på at totalsummen er det samme på begge sider når du
  regner forventet.

python_snippet: |
  from scipy.stats import chisquare

  observed = [18, 22, 30, 25, 15]
  expected = [22, 22, 22, 22, 22]

  chisq, p = chisquare(observed, f_exp=expected)

related:
  - { id: frihetsgrader, kind: concept }
  - { id: signifikansnivaa, kind: concept }
  - { id: E6-kjikvadrattabell, kind: table }

tools:
  - "Tabell E.6 — Kjikvadrat-kvantiltabell"
  - "Kalkulator: kvadrat, divisjon, sum"
```

- [ ] **Step 2: Write `kjikvadrat-uavhengighet.yaml`**

```yaml
id: kjikvadrat-uavhengighet
name_no: Kjikvadrat-test for uavhengighet
type: test
category: hypothesis_test
tagline: "Tester om to kategoriske variable er uavhengige (kontingenstabell)."

formula_main: "χ² = Σ (O_ij − E_ij)² / E_ij,    E_ij = (rad_i · kol_j) / n"
formula_latex: "\\chi^2 = \\sum_{i,j} \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \\quad E_{ij} = \\frac{r_i \\cdot c_j}{n}"

what_it_does: |
  Tester om to kategoriske variable (f.eks. røyking × kreft, kjønn × stemmegivning)
  er uavhengige i populasjonen. Bruker en r×c-kontingenstabell der hver celle har
  observert antall O_ij og forventet antall E_ij regnet som rad-sum × kol-sum / n.

why_use: |
  Når du har en simultan-kategori-tabell og vil teste H0: variablene er uavhengige.

recognition_cues:
  - "Data oppgis som en r×c-kontingenstabell (rader × kolonner)"
  - "Spørsmålet handler om sammenheng mellom to kategoriske egenskaper"
  - "'Er X og Y uavhengige?' eller 'er det en sammenheng mellom X og Y?'"

when_NOT_to_use:
  - "Bare én variabel → bruk goodness-of-fit-test"
  - "Variablene er kontinuerlige → bruk korrelasjon eller regresjon"
  - "n liten og noen E_ij < 5 → testen er ikke pålitelig"

symbols:
  - { sym: "O_ij", means: "observert antall i celle (rad i, kolonne j)" }
  - { sym: "E_ij", means: "forventet antall = (rad-sum_i × kol-sum_j) / n" }
  - { sym: "r",    means: "antall rader" }
  - { sym: "c",    means: "antall kolonner" }
  - { sym: "ν",    means: "frihetsgrader = (r − 1)(c − 1)" }

filters:
  computes: [hypothesis_test]
  random_variable: [discrete_count]
  setup: [joint_table_given]
  structural_cues: [joint_table_present, more_than_two_categories]
  parameters_known: [alpha_significance]
  distribution_assumption: [chi_squared]
  tooling: [chi_square_quantile_table_E6]

solution_template:
  - "Skriv ned H0: X og Y er uavhengige"
  - "Regn marginalsummene (rad-summer og kol-summer)"
  - "Regn forventede antall E_ij = (rad_i · kol_j) / n for hver celle"
  - "Sjekk at alle E_ij ≥ 5"
  - "Regn observatoren χ² = Σ (O_ij − E_ij)² / E_ij over alle celler"
  - "Bestem frihetsgrader ν = (r − 1)(c − 1)"
  - "Slå opp kritisk verdi χ²_(α, ν) i tabell E.6"
  - "Forkast H0 (= konkluder at variablene er avhengige) hvis χ² > kritisk verdi"

common_traps: |
  Frihetsgradene er (r−1)(c−1), ikke r·c−1. Pass også på at marginalsummene
  i regningen treffer totalt n. Hvis flere E_ij < 5 må du slå sammen
  kategorier eller bruke en eksakt test (Fisher).

related:
  - { id: frihetsgrader, kind: concept }
  - { id: marginalfordeling, kind: entry }
  - { id: E6-kjikvadrattabell, kind: table }

tools:
  - "Tabell E.6 — Kjikvadrat-kvantiltabell"
  - "Kalkulator: kvadrat, divisjon, sum"
```

- [ ] **Step 3: Write `ki-varians.yaml`**

```yaml
id: ki-varians
name_no: Konfidensintervall for varians (σ²)
type: test
category: confidence_interval
tagline: "KI for σ² basert på utvalgsvariansen s² og χ²-fordelingen."

formula_main: "((n−1)s² / χ²_(α/2, n−1),  (n−1)s² / χ²_(1−α/2, n−1))"
formula_latex: "\\left( \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2,\\, n-1}},\\ \\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2,\\, n-1}} \\right)"

what_it_does: |
  Beregner et (1 − α)-konfidensintervall for populasjonens varians σ²
  ut fra en utvalgsvarians s². Asymmetrisk fordi χ²-fordelingen er
  asymmetrisk.

why_use: |
  Når oppgaven ber om å tallfeste usikkerheten i en estimert varians,
  for eksempel for å vurdere om σ² ligger over en kritisk grenseverdi.

recognition_cues:
  - "Du har s² (utvalgsvarians) og n, og oppgaven ber om KI for σ² eller σ"
  - "Normalfordeling antatt"
  - "Konfidensnivå (1 − α) er gitt"

when_NOT_to_use:
  - "Du har ikke s² eller den er ikke regnet enda → regn s² først"
  - "Datafordelingen er ikke normal → KI er ikke pålitelig"
  - "Spørsmålet gjelder μ, ikke σ → bruk t- eller z-basert KI for μ"

symbols:
  - { sym: "s²",       means: "utvalgsvarians (estimat for σ²)" }
  - { sym: "n",        means: "antall observasjoner" }
  - { sym: "χ²_(α, ν)", means: "kritisk verdi (kvantil) for χ² med ν frihetsgrader" }
  - { sym: "ν",        means: "frihetsgrader = n − 1" }

filters:
  computes: [confidence_interval, std_dev]
  random_variable: [continuous]
  setup: [single_population]
  structural_cues: [normal_assumed, summary_stats_given]
  parameters_known: [confidence_level, sample_size_small_lt30]
  distribution_assumption: [normal, chi_squared]
  tooling: [chi_square_quantile_table_E6]

solution_template:
  - "Bekreft at fordelingen er normalfordelt (eller antatt)"
  - "Identifiser n og s²"
  - "Bestem ν = n − 1"
  - "Slå opp χ²_(α/2, ν) og χ²_(1−α/2, ν) i tabell E.6"
  - "Sett inn: nedre grense = (n−1)s² / χ²_(α/2, ν)"
  - "Sett inn: øvre grense = (n−1)s² / χ²_(1−α/2, ν)"
  - "For KI for σ: ta kvadratroten av begge grensene"

common_traps: |
  KI er asymmetrisk — ikke prøv å sentrere det. Den lille kvantilen
  (1 − α/2) går i nevneren for ØVRE grense, og den store (α/2) i
  nevneren for nedre grense. Lett å bytte om.

related:
  - { id: frihetsgrader, kind: concept }
  - { id: ki-mu-ukjent-sigma, kind: entry }
  - { id: E6-kjikvadrattabell, kind: table }

tools:
  - "Tabell E.6 — Kjikvadrat-kvantiltabell"
  - "Kalkulator: kvadratrot, divisjon"
```

- [ ] **Step 4: Run typecheck and tests**

Run: `npm run typecheck && npm test`
Expected: PASS — content loads, no schema violations

- [ ] **Step 5: Commit**

```bash
git add content/entries/kjikvadrat-goodness-of-fit.yaml content/entries/kjikvadrat-uavhengighet.yaml content/entries/ki-varians.yaml
git commit -m "feat: add three chi-squared entries (goodness-of-fit, uavhengighet, KI for varians)"
```

---

## Phase 4: Symbol table (B4) and Cheat-sheet (B9)

### Task 6: Symbol table route — derived view

**Files:**
- Create: `src/routes/SymbolTable.tsx`
- Create: `src/routes/SymbolTable.test.tsx`
- Modify: `src/App.tsx` (add route)
- Modify: `src/components/shell/Banner.tsx` (we'll add nav strip in Task 10; for now just route works)

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SymbolTable } from "./SymbolTable";

describe("SymbolTable", () => {
  it("renders aggregated symbols across entries", () => {
    render(
      <MemoryRouter>
        <SymbolTable />
      </MemoryRouter>
    );
    // λ appears in poisson, eksponential — should be listed
    expect(screen.getAllByText("λ").length).toBeGreaterThan(0);
    // μ appears in normal, etc.
    expect(screen.getAllByText("μ").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Implement `src/routes/SymbolTable.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";

interface SymbolUsage {
  sym: string;
  meanings: { means: string; entries: { id: string; name: string }[] }[];
}

function aggregate(): SymbolUsage[] {
  const data = loadAllContent();
  // sym → meaning → list of entries
  const map = new Map<string, Map<string, { id: string; name: string }[]>>();
  for (const entry of data.entries) {
    for (const s of entry.symbols ?? []) {
      const meaningMap = map.get(s.sym) ?? new Map();
      const list = meaningMap.get(s.means) ?? [];
      list.push({ id: entry.id, name: entry.name_no });
      meaningMap.set(s.means, list);
      map.set(s.sym, meaningMap);
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, "nb"))
    .map(([sym, meaningMap]) => ({
      sym,
      meanings: Array.from(meaningMap.entries()).map(([means, entries]) => ({
        means,
        entries,
      })),
    }));
}

export function SymbolTable() {
  const symbols = aggregate();
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[920px] bg-card px-14 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Symboler
        </h1>
        <p className="mb-8 font-serif italic text-ink-3">
          Alle symboler som dukker opp på tvers av oppføringer, samlet i én
          tabell. Trykk på en oppføring for å se symbolet i kontekst.
        </p>
        <div className="space-y-6">
          {symbols.map((s) => (
            <section
              key={s.sym}
              className="rounded-lg border border-line bg-paper-2 px-5 py-4"
            >
              <div className="mb-2 font-math text-[28px] font-medium text-primary">
                {s.sym}
              </div>
              <ul className="m-0 list-none space-y-2 p-0">
                {s.meanings.map((m, i) => (
                  <li key={i} className="text-[14px] text-ink-2">
                    <div>{m.means}</div>
                    <div className="mt-1 text-[12px] text-ink-3">
                      Brukt i:{" "}
                      {m.entries.map((e, j) => (
                        <span key={e.id}>
                          {j > 0 && ", "}
                          <Link
                            to={`/entry/${e.id}`}
                            className="text-primary-2 underline"
                          >
                            {e.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Add route in `src/App.tsx`**

```tsx
import { SymbolTable } from "./routes/SymbolTable";
// ...
<Route path="/symboler" element={<SymbolTable />} />
```

- [ ] **Step 4: Run tests**

Run: `npm test -- SymbolTable`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/SymbolTable.tsx src/routes/SymbolTable.test.tsx src/App.tsx
git commit -m "feat: add /symboler route — aggregated symbol reference across entries"
```

### Task 7: Cheat-sheet route — compact view

**Files:**
- Create: `src/routes/Cheatsheet.tsx`
- Create: `src/routes/Cheatsheet.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Cheatsheet } from "./Cheatsheet";

describe("Cheatsheet", () => {
  it("renders all entries compactly", () => {
    render(
      <MemoryRouter>
        <Cheatsheet />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cheat-?sheet/i)).toBeInTheDocument();
    // Should contain at least poisson and normal entry names
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
    expect(screen.getByText("Normalfordeling")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `src/routes/Cheatsheet.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { Math } from "@/components/primitives/Math";
import { loadAllContent } from "@/data/loadContent";

export function Cheatsheet() {
  const data = loadAllContent();
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[1100px] bg-card px-10 py-8">
        <header className="mb-6 flex items-baseline justify-between border-b-2 border-paper-2 pb-4">
          <h1 className="m-0 font-serif text-[32px] font-semibold text-ink">
            Cheat-sheet
          </h1>
          <span className="text-[12px] text-ink-3">
            {data.entries.length} formler · skriv ut med Ctrl/Cmd+P
          </span>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.entries.map((e) => (
            <Link
              key={e.id}
              to={`/entry/${e.id}`}
              className="rounded-lg border border-line bg-paper-2 px-4 py-3 no-underline hover:border-primary-2"
            >
              <div className="font-serif text-[15px] font-semibold text-ink">
                {e.name_no}
              </div>
              <div className="my-1.5 text-[13px] italic text-ink-3">
                {e.tagline}
              </div>
              <div className="mt-2 overflow-x-auto rounded bg-card px-2 py-1.5 text-[13px] text-ink">
                <Math latex={e.formula_latex} />
              </div>
              {e.symbols && e.symbols.length > 0 && (
                <div className="mt-2 text-[11px] font-mono text-ink-3">
                  {e.symbols
                    .slice(0, 4)
                    .map((s) => s.sym)
                    .join(" · ")}
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Add route in `src/App.tsx`**

```tsx
import { Cheatsheet } from "./routes/Cheatsheet";
// ...
<Route path="/cheatsheet" element={<Cheatsheet />} />
```

- [ ] **Step 4: Run tests**

Run: `npm test -- Cheatsheet`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/Cheatsheet.tsx src/routes/Cheatsheet.test.tsx src/App.tsx
git commit -m "feat: add /cheatsheet route — compact all-formulas view, print-friendly"
```

---

## Phase 5: Glossary (B3)

### Task 8: Glossary content — write ~30 terms

**Files:**
- Create: `content/glossary/<term>.yaml` for each term

- [ ] **Step 1: Author 30 glossary YAML files**

The 30 terms (one file each):
- punktestimat, signifikansniva, p-verdi, frihetsgrader, type-1-feil, type-2-feil
- nullhypotese, alternativhypotese, kritisk-verdi, forkastningsomrade, observatortest
- konfidensintervall, prediksjonsintervall, kvantil, kumulativ
- marginalfordeling, simultanfordeling, betinget-sannsynlighet, joint
- varians, standardavvik, standardfeil, kovarians-glos, korrelasjon-glos
- residual, beta-koeffisient, intercept-glos, gjennomsnitt
- sentralgrenseteoremet-glos, normalisering

Format for each:
```yaml
id: punktestimat
term_no: Punktestimat
short_def: "Ett tall som er beste gjet av en parameter, regnet ut fra dataene."
long_def: |
  Når du har data fra et utvalg, regner du ut et "best guess" for en
  ukjent parameter (μ, p, σ, β...). Dette ene tallet kalles et
  punktestimat. Punktestimater alene sier ingenting om usikkerheten —
  for det trenger du et konfidensintervall.
see_also:
  - { id: konfidensintervall, kind: glossary }
  - { id: ki-mu-kjent-sigma, kind: entry }
```

(Implementer subagent: write all 30 in this style. Use the working notes and existing concepts as source. Keep `short_def` to one sentence; `long_def` panic-mode-readable.)

- [ ] **Step 2: Verify schema parses all of them**

Run: `npm test`
Expected: PASS — `loadContent` parses all glossary files

- [ ] **Step 3: Commit**

```bash
git add content/glossary/
git commit -m "feat: author 30 glossary terms covering core stat vocabulary"
```

### Task 9: Glossary route

**Files:**
- Create: `src/routes/Glossary.tsx`
- Create: `src/routes/Glossary.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/data/schema.ts` — extend `RelatedRefSchema` to allow `kind: "glossary"`

- [ ] **Step 1: Extend RelatedRefSchema**

```ts
export const RelatedRefSchema = z.object({
  id: z.string(),
  kind: z.enum(["entry", "concept", "table", "glossary", "pattern"]),
});
```

(Adding `pattern` here too for Task 11.)

- [ ] **Step 2: Write Glossary test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Glossary } from "./Glossary";

describe("Glossary", () => {
  it("renders glossary terms with definitions", () => {
    render(
      <MemoryRouter>
        <Glossary />
      </MemoryRouter>
    );
    expect(screen.getByText(/Ordliste/i)).toBeInTheDocument();
    expect(screen.getByText("P-verdi")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implement `src/routes/Glossary.tsx`**

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";

export function Glossary() {
  const data = loadAllContent();
  const [query, setQuery] = useState("");
  const filtered = data.glossary
    .filter((t) => {
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        t.term_no.toLowerCase().includes(q) ||
        t.short_def.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb"));

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[820px] bg-card px-12 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Ordliste
        </h1>
        <p className="mb-6 font-serif italic text-ink-3">
          Norske statistiske termer i klartekst — for når du gjenkjenner ordet
          fra eksamen og må finne ut hva det betyr.
        </p>
        <input
          type="search"
          placeholder="Søk i termene..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 w-full rounded-md border border-line bg-paper-2 px-4 py-2 text-[14px]"
        />
        <dl className="m-0 space-y-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-line bg-paper-2 px-5 py-4"
            >
              <dt className="font-serif text-[18px] font-semibold text-ink">
                {t.term_no}
              </dt>
              <dd className="m-0 mt-1 text-[14px] text-ink-2">
                {t.short_def}
              </dd>
              {t.long_def && (
                <dd className="m-0 mt-2 whitespace-pre-line text-[13px] text-ink-3">
                  {t.long_def}
                </dd>
              )}
              {t.see_also && t.see_also.length > 0 && (
                <dd className="m-0 mt-2 text-[12px] text-ink-3">
                  Se også:{" "}
                  {t.see_also.map((r, i) => {
                    const path =
                      r.kind === "entry"
                        ? `/entry/${r.id}`
                        : r.kind === "concept"
                          ? `/concept/${r.id}`
                          : r.kind === "table"
                            ? `/table/${r.id}`
                            : `/ordliste#${r.id}`;
                    return (
                      <span key={r.id}>
                        {i > 0 && ", "}
                        <Link to={path} className="text-primary-2 underline">
                          {r.id}
                        </Link>
                      </span>
                    );
                  })}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Add route**

```tsx
import { Glossary } from "./routes/Glossary";
// ...
<Route path="/ordliste" element={<Glossary />} />
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/schema.ts src/routes/Glossary.tsx src/routes/Glossary.test.tsx src/App.tsx
git commit -m "feat: add /ordliste route — searchable glossary of stat terms"
```

---

## Phase 6: Patterns (B5)

### Task 10: Patterns content — write ~12 task patterns

**Files:**
- Create: `content/patterns/<id>.yaml` × 12

- [ ] **Step 1: Author the 12 patterns from the design doc**

Format example:
```yaml
id: rate-til-poisson
name_no: "Rate gitt — antall hendelser i et tidsvindu"
cue: "Oppgaven gir en rate λ pr. tidsenhet, og spør om P(X = k), P(X ≤ k), eller 'minst k'."
procedure:
  - "Identifiser raten λ og enheten den er gitt i"
  - "Identifiser vinduets lengde t i samme enhet"
  - "Regn forventet antall μ = λt"
  - "Identifiser hva spørsmålet ber om: P(X = k), P(X ≤ k), eller P(X ≥ k)"
  - "For 'minst k' eller 'ingen': bruk komplement P(X ≥ k) = 1 − P(X ≤ k−1)"
  - "Slå opp P(X ≤ k) i tabell E.2 eller regn direkte"
entry_refs:
  - poisson-fordeling
  - komplementregelen
example: "Vulkanutbrudd med rate 0.0261 pr. måned, finn P(minst 1 utbrudd i 5 år)."
```

(Implementer: write all 12. Source from existing entry recognition_cues.)

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add content/patterns/
git commit -m "feat: author 12 task patterns covering common exam recognition flows"
```

### Task 11: Patterns route + detail

**Files:**
- Create: `src/routes/Patterns.tsx`
- Create: `src/routes/PatternDetail.tsx`
- Create: `src/routes/Patterns.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write tests**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Patterns } from "./Patterns";
import { PatternDetail } from "./PatternDetail";

describe("Patterns", () => {
  it("lists all patterns", () => {
    render(
      <MemoryRouter>
        <Patterns />
      </MemoryRouter>
    );
    expect(screen.getByText(/Mønstre/i)).toBeInTheDocument();
  });

  it("shows detail for a pattern", () => {
    render(
      <MemoryRouter initialEntries={["/monstre/rate-til-poisson"]}>
        <Routes>
          <Route path="/monstre/:id" element={<PatternDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Rate gitt/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `src/routes/Patterns.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";

export function Patterns() {
  const { patterns } = loadAllContent();
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[920px] bg-card px-14 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Oppgavemønstre
        </h1>
        <p className="mb-6 font-serif italic text-ink-3">
          Vanlige oppgavetyper med fast prosedyre og lenker til relevante
          formler. Når du gjenkjenner mønsteret, slipper du å lete etter
          formelen — du vet hvilken side du skal til.
        </p>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {patterns.map((p) => (
            <li key={p.id}>
              <Link
                to={`/monstre/${p.id}`}
                className="block rounded-lg border border-line bg-paper-2 px-5 py-4 no-underline hover:border-primary-2"
              >
                <div className="font-serif text-[16px] font-semibold text-ink">
                  {p.name_no}
                </div>
                <div className="mt-1 text-[13px] italic text-ink-3">
                  {p.cue}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Implement `src/routes/PatternDetail.tsx`**

```tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { StepByStep } from "@/components/detail/StepByStep";
import { Search, ClipboardList, Link2 } from "lucide-react";
import { loadAllContent } from "@/data/loadContent";

export function PatternDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const p = data.patterns.find((x) => x.id === id);
  if (!p) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-[820px] p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen mønster med id "{id}".
          </p>
          <Link to="/monstre" className="text-primary-2 underline">
            Tilbake til mønstre
          </Link>
        </main>
      </div>
    );
  }
  const refs = p.entry_refs.map((rid) => ({
    id: rid,
    name: data.entries.find((e) => e.id === rid)?.name_no ?? rid,
  }));
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[820px] bg-card px-12 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-[13px] font-medium text-primary-2"
        >
          ← Tilbake til mønstre
        </button>
        <header className="mb-6 border-b-2 border-paper-2 pb-4">
          <h1 className="m-0 font-serif text-[32px] font-semibold text-ink">
            {p.name_no}
          </h1>
        </header>
        <Section title="Når kjenner du dette mønsteret?" icon={Search}>
          <p className="m-0 font-serif text-base leading-relaxed text-ink">
            {p.cue}
          </p>
        </Section>
        <Section title="Prosedyre" icon={ClipboardList}>
          <StepByStep steps={p.procedure} />
        </Section>
        {p.example && (
          <Section title="Eksempel">
            <p className="m-0 font-serif italic text-ink-2">{p.example}</p>
          </Section>
        )}
        <Section title="Tilhørende formler" icon={Link2}>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {refs.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/entry/${r.id}`}
                  className="rounded-full border border-line bg-paper-2 px-3 py-1 text-[13px] no-underline hover:border-primary-2"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  );
}
```

- [ ] **Step 4: Add routes**

```tsx
import { Patterns } from "./routes/Patterns";
import { PatternDetail } from "./routes/PatternDetail";
// ...
<Route path="/monstre" element={<Patterns />} />
<Route path="/monstre/:id" element={<PatternDetail />} />
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/routes/Patterns.tsx src/routes/PatternDetail.tsx src/routes/Patterns.test.tsx src/App.tsx
git commit -m "feat: add /monstre route — pattern catalog and detail pages"
```

---

## Phase 7: Wizard (B1)

### Task 12: Wizard content (decision tree)

**Files:**
- Modify: `content/wizard.yaml` (replace stub with full tree)

- [ ] **Step 1: Replace stub `content/wizard.yaml` with full decision tree**

```yaml
start: n_start
nodes:
  - id: n_start
    question: "Er den tilfeldige variabelen diskret (du teller noe) eller kontinuerlig?"
    options:
      - label: "Diskret — jeg teller hendelser eller forsøk"
        next: n_diskret
      - label: "Kontinuerlig — målinger på en skala"
        next: n_kontinuerlig
      - label: "Ikke sikker — jeg har data og skal estimere eller teste"
        next: n_inferens

  - id: n_diskret
    question: "Hva slags telling? Vinduet er bestemt på forhånd?"
    options:
      - label: "Fast antall n forsøk, hver med samme suksesssannsynlighet p"
        next: n_diskret_fast_n
      - label: "Hendelser kommer som de kommer, rate λ er gitt"
        leads_to:
          - { id: poisson-fordeling, kind: entry }
      - label: "Trekker uten tilbakelegging fra endelig pott"
        leads_to:
          - { id: hypergeometrisk-fordeling, kind: entry }
      - label: "Forsøk gjentas til første suksess"
        leads_to:
          - { id: binomial-fordeling, kind: entry }

  - id: n_diskret_fast_n
    question: "Med tilbakelegging?"
    options:
      - label: "Ja (eller uavhengige forsøk)"
        leads_to:
          - { id: binomial-fordeling, kind: entry }
      - label: "Nei (endelig pott)"
        leads_to:
          - { id: hypergeometrisk-fordeling, kind: entry }

  - id: n_kontinuerlig
    question: "Hva slags variabel?"
    options:
      - label: "Tid TIL første hendelse, rate gitt"
        leads_to:
          - { id: eksponential-fordeling, kind: entry }
      - label: "Normalfordeling antatt eller mistenkt"
        next: n_normal
      - label: "Sammenheng mellom to variable (x, y)"
        leads_to:
          - { id: regresjon-estimat-alpha-beta, kind: entry }
          - { id: regresjon-korrelasjonskoeffisient, kind: entry }

  - id: n_normal
    question: "Hva spørres det om?"
    options:
      - label: "Sannsynlighet for et område"
        leads_to:
          - { id: normalfordeling, kind: entry }
          - { id: standardnormalisering, kind: concept }
      - label: "Konfidensintervall for μ — σ kjent"
        leads_to:
          - { id: ki-mu-kjent-sigma, kind: entry }
      - label: "Konfidensintervall for μ — σ ukjent"
        leads_to:
          - { id: ki-mu-ukjent-sigma, kind: entry }
      - label: "Hypotesetest om μ — σ ukjent"
        leads_to:
          - { id: en-utvalg-t-test, kind: entry }
      - label: "Hypotesetest om μ — σ kjent"
        leads_to:
          - { id: en-utvalg-z-test, kind: entry }

  - id: n_inferens
    question: "Hva slags inferens?"
    options:
      - label: "Test eller KI for andel"
        next: n_andel
      - label: "Test eller KI for gjennomsnitt"
        next: n_normal
      - label: "Test for sammenheng / uavhengighet av kategorier"
        leads_to:
          - { id: kjikvadrat-uavhengighet, kind: entry }
      - label: "Test om to grupper har samme μ"
        leads_to:
          - { id: to-utvalgs-t-test, kind: entry }
      - label: "Goodness-of-fit (passer dataene en fordeling?)"
        leads_to:
          - { id: kjikvadrat-goodness-of-fit, kind: entry }

  - id: n_andel
    question: "Hva spørres det om for andelen p?"
    options:
      - label: "Konfidensintervall for p"
        leads_to:
          - { id: ki-andel-binomial, kind: entry }
      - label: "Test om p = p₀"
        leads_to:
          - { id: en-utvalg-z-test-andel, kind: entry }
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add content/wizard.yaml
git commit -m "feat: author full decision-tree wizard content (~8 nodes covering core flows)"
```

### Task 13: Wizard route + UI

**Files:**
- Create: `src/routes/Wizard.tsx`
- Create: `src/routes/Wizard.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Wizard } from "./Wizard";

describe("Wizard", () => {
  it("renders the start question", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    expect(screen.getByText(/diskret eller kontinuerlig/i)).toBeInTheDocument();
  });

  it("navigates to terminal entry recommendations", () => {
    render(
      <MemoryRouter>
        <Wizard />
      </MemoryRouter>
    );
    // pick "Kontinuerlig" then "Tid TIL første hendelse"
    fireEvent.click(screen.getByText(/Kontinuerlig/));
    fireEvent.click(screen.getByText(/Tid TIL første/i));
    expect(
      screen.getByText(/Eksponentialfordeling/i, { exact: false })
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `src/routes/Wizard.tsx`**

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, RotateCcw } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";
import type { WizardOption } from "@/data/schema";

export function Wizard() {
  const data = loadAllContent();
  const tree = data.wizard;
  const [path, setPath] = useState<string[]>(tree ? [tree.start] : []);
  const [terminal, setTerminal] = useState<WizardOption | null>(null);

  if (!tree) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="p-12 text-center font-serif text-ink-3">
          Veiviseren er ikke tilgjengelig.
        </main>
      </div>
    );
  }

  const currentId = path[path.length - 1];
  const currentNode = tree.nodes.find((n) => n.id === currentId);

  function pick(opt: WizardOption) {
    if (opt.next) {
      setPath((p) => [...p, opt.next!]);
    } else if (opt.leads_to) {
      setTerminal(opt);
    }
  }

  function reset() {
    setPath([tree!.start]);
    setTerminal(null);
  }

  function back() {
    if (terminal) {
      setTerminal(null);
      return;
    }
    setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  }

  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[720px] bg-card px-12 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Veiviser
        </h1>
        <p className="mb-6 font-serif italic text-ink-3">
          Svar på spørsmålene under for å finne riktig fordeling eller test.
        </p>

        <div className="mb-4 flex gap-2 text-[12px] text-ink-3">
          <button
            type="button"
            onClick={back}
            disabled={path.length <= 1 && !terminal}
            className="rounded-md border border-line bg-paper-2 px-2 py-1 disabled:opacity-50"
          >
            ← Tilbake
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 rounded-md border border-line bg-paper-2 px-2 py-1"
          >
            <RotateCcw size={12} /> Start på nytt
          </button>
        </div>

        {terminal ? (
          <section className="rounded-lg border border-primary-2 bg-primary-soft px-6 py-5">
            <div className="mb-2 font-serif text-[18px] font-semibold text-primary">
              Anbefalt:
            </div>
            <ul className="m-0 list-none space-y-2 p-0">
              {terminal.leads_to!.map((r) => {
                const name =
                  r.kind === "entry"
                    ? data.entries.find((e) => e.id === r.id)?.name_no
                    : r.kind === "concept"
                      ? data.concepts.find((c) => c.id === r.id)?.name_no
                      : r.id;
                const path =
                  r.kind === "entry"
                    ? `/entry/${r.id}`
                    : r.kind === "concept"
                      ? `/concept/${r.id}`
                      : `/table/${r.id}`;
                return (
                  <li key={r.id}>
                    <Link
                      to={path}
                      className="flex items-center gap-2 rounded-md border border-line bg-card px-4 py-2 no-underline hover:border-primary-2"
                    >
                      <ChevronRight size={16} className="text-primary-2" />
                      <span className="font-serif text-[15px] font-semibold text-ink">
                        {name ?? r.id}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : currentNode ? (
          <section>
            <div className="mb-4 font-serif text-[20px] font-medium leading-snug text-ink">
              {currentNode.question}
            </div>
            <ul className="m-0 list-none space-y-2 p-0">
              {currentNode.options.map((opt, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pick(opt)}
                    className="flex w-full items-center gap-2 rounded-md border border-line bg-paper-2 px-4 py-3 text-left text-[14px] hover:border-primary-2"
                  >
                    <ChevronRight size={16} className="text-primary-2" />
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-ink-3">Ugyldig node-id.</p>
        )}
      </main>
    </div>
  );
}
```

Note: this requires `WizardOption` type export — add `export type WizardOption = z.infer<typeof WizardOptionSchema>;` to schema.ts.

- [ ] **Step 3: Add route**

```tsx
import { Wizard } from "./routes/Wizard";
// ...
<Route path="/veiviser" element={<Wizard />} />
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/routes/Wizard.tsx src/routes/Wizard.test.tsx src/data/schema.ts src/App.tsx
git commit -m "feat: add /veiviser route — interactive distribution-finder wizard"
```

---

## Phase 8: Banner sub-nav (links the new pages)

### Task 14: Add secondary nav strip to Banner

**Files:**
- Modify: `src/components/shell/Banner.tsx`
- Modify: `src/components/shell/Banner.test.tsx`

- [ ] **Step 1: Update test to assert nav links present**

```tsx
it("renders secondary navigation links to helper pages", () => {
  render(
    <MemoryRouter>
      <Banner />
    </MemoryRouter>
  );
  expect(screen.getByRole("link", { name: /Veiviser/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Ordliste/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Symboler/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Mønstre/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Cheat-?sheet/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Add nav strip below banner row 1**

In `src/components/shell/Banner.tsx`, add a sub-row inside the gradient banner (or just below it):

```tsx
import { Compass, BookA, Sigma, Layers, FileText } from "lucide-react";
// ...

<header className="...">
  <div className="...">
    {/* row 1: existing logo + theme toggle */}
  </div>
  <nav className="relative z-10 flex flex-wrap gap-1 border-t border-white/10 px-7 py-2 text-[12.5px]">
    {[
      { to: "/veiviser",   label: "Veiviser",   Icon: Compass },
      { to: "/ordliste",   label: "Ordliste",   Icon: BookA },
      { to: "/symboler",   label: "Symboler",   Icon: Sigma },
      { to: "/monstre",    label: "Mønstre",    Icon: Layers },
      { to: "/cheatsheet", label: "Cheat-sheet", Icon: FileText },
    ].map(({ to, label, Icon }) => (
      <Link
        key={to}
        to={to}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-paper-2/85 no-underline hover:bg-white/10 hover:text-white"
      >
        <Icon size={13} />
        {label}
      </Link>
    ))}
  </nav>
</header>
```

- [ ] **Step 3: Run tests**

Run: `npm test -- Banner`
Expected: PASS

Verify no other tests broke (since Banner is on every page).

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/shell/Banner.tsx src/components/shell/Banner.test.tsx
git commit -m "feat: add secondary nav strip linking to wizard, glossary, symbols, patterns, cheatsheet"
```

---

## Phase 9: Distribution thumbnails (B7) and Template mode (C5)

### Task 15: Distribution shape thumbnails

**Files:**
- Create: `src/components/detail/DistributionThumbnail.tsx`
- Create: `src/components/detail/DistributionThumbnail.test.tsx`
- Modify: `src/routes/EntryDetail.tsx` to render thumbnail when applicable

- [ ] **Step 1: Implement `DistributionThumbnail.tsx`**

```tsx
import type { Entry } from "@/data/schema";

const SHAPES: Record<string, JSX.Element> = {
  poisson: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      {[3, 8, 16, 24, 18, 10, 5, 2].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={50 - h * 1.6} width={9} height={h * 1.6} fill="currentColor" />
      ))}
    </svg>
  ),
  binomial: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      {[2, 6, 14, 22, 22, 14, 6, 2].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={50 - h * 1.6} width={9} height={h * 1.6} fill="currentColor" />
      ))}
    </svg>
  ),
  hypergeometric: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      {[1, 4, 12, 22, 22, 12, 4, 1].map((h, i) => (
        <rect key={i} x={i * 12 + 4} y={50 - h * 1.6} width={9} height={h * 1.6} fill="currentColor" />
      ))}
    </svg>
  ),
  normal: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 55 Q 50 -20 95 55" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  exponential: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 5 Q 30 50 95 55" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  t_distribution: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 50 Q 50 -10 95 50" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  chi_squared: (
    <svg viewBox="0 0 100 60" className="h-12 w-20">
      <path d="M 5 55 Q 25 5 50 30 Q 75 50 95 55" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
};

export function DistributionThumbnail({ entry }: { entry: Entry }) {
  const dist = entry.filters.distribution_assumption?.[0];
  if (!dist || !SHAPES[dist]) return null;
  return (
    <div className="flex items-center gap-2 text-primary-2" title={`Form: ${dist}`}>
      {SHAPES[dist]}
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
        {dist}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Render in EntryDetail.tsx**

In `src/routes/EntryDetail.tsx`, just below the header (before `<HeroFormula />`):
```tsx
import { DistributionThumbnail } from "@/components/detail/DistributionThumbnail";
// ...
<DistributionThumbnail entry={entry} />
<HeroFormula latex={entry.formula_latex} />
```

- [ ] **Step 3: Smoke test**

Run: `npm run dev`, visit `/entry/poisson-fordeling` → see bar shape.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/detail/DistributionThumbnail.tsx src/routes/EntryDetail.tsx
git commit -m "feat: add static SVG distribution-shape thumbnails on entry pages"
```

### Task 16: Template mode toggle on entries

**Files:**
- Create: `src/components/detail/TemplateMode.tsx`
- Modify: `src/routes/EntryDetail.tsx` (replace inline StepByStep with TemplateMode wrapper)

- [ ] **Step 1: Implement `TemplateMode.tsx`**

```tsx
import { useState } from "react";
import { ClipboardList, FileText } from "lucide-react";
import { StepByStep } from "./StepByStep";

interface Props {
  steps: string[];
}

export function TemplateMode({ steps }: Props) {
  const [mode, setMode] = useState<"prose" | "fillin">("prose");
  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("prose")}
          className={`rounded-md border px-3 py-1 text-[12px] ${mode === "prose" ? "border-primary-2 bg-primary-soft text-primary" : "border-line text-ink-3"}`}
        >
          <ClipboardList size={12} className="mr-1 inline-block" />
          Prosa
        </button>
        <button
          type="button"
          onClick={() => setMode("fillin")}
          className={`rounded-md border px-3 py-1 text-[12px] ${mode === "fillin" ? "border-primary-2 bg-primary-soft text-primary" : "border-line text-ink-3"}`}
        >
          <FileText size={12} className="mr-1 inline-block" />
          Mal-modus (fyll inn)
        </button>
      </div>
      {mode === "prose" ? (
        <StepByStep steps={steps} />
      ) : (
        <ol className="m-0 list-none space-y-3 p-0">
          {steps.map((s, i) => (
            <li
              key={i}
              className="rounded-lg border border-line bg-paper-2 px-4 py-3 print:border-ink"
            >
              <div className="font-mono text-[11px] font-semibold text-primary-2">
                STEG {i + 1}
              </div>
              <div className="mt-1 text-[14px] text-ink">{s}</div>
              <div className="mt-3 h-12 rounded border border-dashed border-line-2 print:h-16">
                <span className="sr-only">Fyll inn ditt svar her</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Replace StepByStep usage in `EntryDetail.tsx`**

```tsx
import { TemplateMode } from "@/components/detail/TemplateMode";
// ...
{entry.solution_template && (
  <Section title="Steg for steg" icon={ClipboardList}>
    <TemplateMode steps={entry.solution_template} />
  </Section>
)}
```

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: PASS — existing StepByStep tests still pass since component still exists; TemplateMode wraps it.

- [ ] **Step 4: Commit**

```bash
git add src/components/detail/TemplateMode.tsx src/routes/EntryDetail.tsx
git commit -m "feat: add Mal-modus toggle on entry pages — switch between prose and fill-in template"
```

---

## Phase 10: Final verification

### Task 17: Final test run + build verification

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: ALL PASS

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds, no TypeScript errors

- [ ] **Step 3: Smoke test in dev server**

Run: `npm run dev`. Walk through:
- List view: filter sidebar, clear button visible when active
- Click theme toggle: dark mode renders correctly
- Click "Veiviser" in nav: wizard works, terminal recommendations clickable
- Click "Ordliste": glossary list renders, search filters
- Click "Symboler": symbol table aggregates correctly
- Click "Mønstre": list + detail both work
- Click "Cheat-sheet": all entries compactly rendered
- Visit `/entry/poisson-fordeling`: distribution thumbnail visible, template-mode toggle works
- Visit `/entry/kjikvadrat-goodness-of-fit`: new entry renders correctly

- [ ] **Step 4: Commit deviation/completion notes if any**

If anything diverged from the plan, note it in `docs/superpowers/plans/2026-04-30-ideas-batch-deviations.md`.

---

## Summary of files added/changed

**New files:**
- `src/routes/Cheatsheet.tsx`, `Glossary.tsx`, `SymbolTable.tsx`, `Patterns.tsx`, `PatternDetail.tsx`, `Wizard.tsx` (+ tests)
- `src/components/detail/DistributionThumbnail.tsx`, `TemplateMode.tsx`
- `content/glossary/*.yaml` (~30)
- `content/patterns/*.yaml` (~12)
- `content/wizard.yaml`
- `content/entries/kjikvadrat-goodness-of-fit.yaml`, `kjikvadrat-uavhengighet.yaml`, `ki-varians.yaml`

**Modified:**
- `src/data/schema.ts` (add 3 schemas, extend RelatedRefSchema)
- `src/data/loadContent.ts` (load 3 new content types)
- `src/styles/tokens.css` (dark-mode block)
- `src/components/list/FilterSidebar.tsx` (clear-all button)
- `src/components/shell/Banner.tsx` (sub-nav)
- `src/routes/EntryDetail.tsx` (thumbnail + template mode)
- `src/App.tsx` (5 new routes)

## Self-review

**Spec coverage:** All 10 ideas covered:
- A5 → Task 4
- A9 → Task 3
- B1 → Tasks 12, 13
- B3 → Tasks 8, 9
- B4 → Task 6
- B5 → Tasks 10, 11
- B7 → Task 15 (scope-cut)
- B9 → Task 7
- C1 → Task 5
- C5 → Task 16

**Placeholders:** None. Each task has explicit code or content patterns.

**Type consistency:** `WizardOption` type referenced in Task 13 — Task 1 has the schema; Task 13 explicitly notes adding the `export type WizardOption` line.

**File-path consistency:** All routes referenced in App.tsx match the Banner sub-nav links.

**Risk:** Task 8 (30 glossary terms) is the largest single content task. If subagent runs out of patience, can ship a smaller list of 15–20 and iterate.
