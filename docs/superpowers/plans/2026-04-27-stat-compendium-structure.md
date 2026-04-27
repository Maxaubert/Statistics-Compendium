# Statistikk-kompendium — Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete UI structure, schema, search, filtering, routing, and visual design system for the Statistikk-kompendium so it works end-to-end with two hand-crafted test entries. Real content extraction from past exams + obliger is a **separate follow-up plan** that runs only after this structure is verified.

**Architecture:** React 18 + TypeScript SPA built with Vite. Per-file YAML entries in `content/` aggregated via `import.meta.glob` and validated with Zod at build time. TailwindCSS v4 with custom theme tokens for the design system. KaTeX renders LaTeX, Fuse.js handles fuzzy search, jstat provides distributional computations for interactive table widgets, React Router v6 for per-entry URLs.

**Tech Stack:**
- React 18, TypeScript 5, Vite 6
- TailwindCSS 4 (with `@theme` for design tokens)
- React Router v6
- Zod (schema validation)
- KaTeX (math rendering)
- Fuse.js (fuzzy search)
- jstat (statistical distributions for lookup widgets)
- mathjs (general math evaluation)
- lucide-react (icons)
- clsx + tailwind-merge (conditional classes)
- Vitest + jsdom + @testing-library/react (tests)
- @modyfi/vite-plugin-yaml (YAML imports)

**Phasing note:** This plan only builds **structure**. Content (real formula entries, real exam example extractions) is a separate plan. To exercise the structure end-to-end, we hand-craft exactly **two** entries (Poissonfordeling, Binomialfordeling), **one** concept (Poissonprosess), and **one** table (Poissontabell / E.2). These are reference fixtures, not the eventual canonical content.

**Reference:** Spec at `docs/superpowers/specs/2026-04-27-stat-compendium-design.md`.

---

## Phase A — Foundation

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`
- Create: `.npmrc` (lock node engine to a stable version if needed; otherwise omit)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "stat-compendium",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@modyfi/vite-plugin-yaml": "^1.1.0",
    "clsx": "^2.1.1",
    "fuse.js": "^7.0.0",
    "jstat": "^1.9.6",
    "katex": "^0.16.11",
    "lucide-react": "^0.468.0",
    "mathjs": "^13.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "tailwind-merge": "^2.5.5",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/jstat": "^1.7.4",
    "@types/katex": "^0.16.7",
    "@types/node": "^22.10.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.3",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), yaml(), tailwindcss()],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

The `base: "./"` makes the build deployable from any path including `file://`. The `@` alias matches the `tsconfig.json` `paths` setting so imports like `@/data/schema` resolve in both dev, tests, and build.

- [ ] **Step 3: Create `tsconfig.json`** and `tsconfig.node.json`

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "content"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `index.html`**

```html
<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Statistikk-kompendium</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `src/main.tsx` and minimal `src/App.tsx`**

`src/main.tsx`:
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.tsx`:
```tsx
export function App() {
  return <div>Statistikk-kompendium</div>;
}
```

Empty `src/styles/global.css`:
```css
/* will be filled in Task 3 */
```

- [ ] **Step 6: Install and verify**

Run:
```bash
npm install
npm run typecheck
```
Expected: typecheck passes with no errors.

Run:
```bash
npm run dev
```
Expected: dev server starts, `http://localhost:5173` shows "Statistikk-kompendium".

Stop the dev server (Ctrl+C).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json index.html src/
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Self-host fonts

**Files:**
- Create: `public/fonts/` (download Inter Variable, Source Serif 4 Variable, JetBrains Mono Variable as `.woff2`)
- Create: `src/styles/fonts.css`

- [ ] **Step 1: Download font files**

Download these three variable fonts as `.woff2` files into `public/fonts/`:
- `Inter-VariableFont_opsz,wght.woff2` from https://fonts.google.com/specimen/Inter (download then export woff2)
- `SourceSerif4-VariableFont_opsz,wght.woff2` from https://fonts.google.com/specimen/Source+Serif+4
- `JetBrainsMono-VariableFont_wght.woff2` from https://fonts.google.com/specimen/JetBrains+Mono

If the user prefers, you can fetch from `gwfh.mranftl.com/fonts` (GWFH) which provides direct woff2 downloads.

- [ ] **Step 2: Write `src/styles/fonts.css`**

```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/Inter-VariableFont_opsz,wght.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Source Serif 4";
  src: url("/fonts/SourceSerif4-VariableFont_opsz,wght.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-VariableFont_wght.woff2") format("woff2");
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Import in `src/styles/global.css`**

```css
@import "./fonts.css";
@import "tailwindcss";
```

- [ ] **Step 4: Verify**

Run `npm run dev`, open browser DevTools → Network → Fonts. The three woff2 files should load when you visit the page.

- [ ] **Step 5: Commit**

```bash
git add public/fonts/ src/styles/fonts.css src/styles/global.css
git commit -m "chore: self-host Inter, Source Serif 4, and JetBrains Mono"
```

---

### Task 3: Tailwind v4 theme tokens

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Define theme tokens in `src/styles/tokens.css`**

```css
@theme {
  /* Neutrals (warm stone) */
  --color-ink: #1c1917;
  --color-ink-2: #44403c;
  --color-ink-3: #78716c;
  --color-ink-4: #a8a29e;
  --color-paper: #fafaf7;
  --color-paper-2: #f5f5f0;
  --color-card: #ffffff;
  --color-line: #e7e5e4;
  --color-line-2: #d6d3d1;

  /* Primary (indigo) */
  --color-primary: #312e81;
  --color-primary-2: #4338ca;
  --color-primary-3: #6366f1;
  --color-primary-soft: #eef2ff;

  /* Cyan (highlights & results) */
  --color-cyan: #22d3ee;
  --color-cyan-2: #06b6d4;
  --color-cyan-soft: #cffafe;
  --color-cyan-deep: #0e7490;

  /* Warn amber (warnings only) */
  --color-warn: #b45309;
  --color-warn-soft: #fef3c7;

  /* Calc block (dark indigo, code-block role) */
  --color-calc-bg: #1e1b4b;
  --color-calc-border: #3730a3;
  --color-calc-divider: rgba(165, 180, 252, 0.18);
  --color-calc-label: #818cf8;
  --color-calc-text: #e0e7ff;
  --color-calc-comment: #94a3b8;
  --color-calc-result: #22d3ee;
  --color-calc-lookup-bg: rgba(165, 180, 252, 0.08);
  --color-calc-lookup-border: #a5b4fc;
  --color-calc-lookup-text: #c7d2fe;

  /* Type scale */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Source Serif 4", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-math: "Cambria Math", "STIX Two Math", Georgia, serif;
}
```

- [ ] **Step 2: Update `src/styles/global.css` to import tokens**

```css
@import "./fonts.css";
@import "./tokens.css";
@import "tailwindcss";

html {
  font-family: var(--font-sans);
  color: var(--color-ink);
  background: var(--color-paper);
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 3: Verify utilities work**

Update `src/App.tsx`:
```tsx
export function App() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-primary">Statistikk-kompendium</h1>
      <p className="font-mono text-cyan">cyan accent</p>
      <p className="text-warn">warn amber</p>
    </div>
  );
}
```

Run `npm run dev`. Browser shows: title in deep indigo serif, "cyan accent" in cyan mono, "warn amber" in dark amber.

Revert `src/App.tsx` back to the minimal version after verification:
```tsx
export function App() {
  return <div>Statistikk-kompendium</div>;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css src/styles/global.css src/App.tsx
git commit -m "feat: add Tailwind v4 theme tokens for design system"
```

---

### Task 4: Test setup with Vitest + Testing Library

**Files:**
- Create: `src/test/setup.ts`

- [ ] **Step 1: Write test setup**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write a smoke test**

Create `src/App.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test**

```bash
npm test
```
Expected: 1 test passes.

- [ ] **Step 4: Commit**

```bash
git add src/test/setup.ts src/App.test.tsx
git commit -m "chore: add Vitest + Testing Library setup with smoke test"
```

---

## Phase B — Schema and Data Loading

### Task 5: Zod schemas for Entry, Concept, Table, Filters

**Files:**
- Create: `src/data/schema.ts`
- Create: `src/data/schema.test.ts`

- [ ] **Step 1: Write failing schema tests**

`src/data/schema.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  EntrySchema,
  ConceptSchema,
  TableSchema,
  FiltersSchema,
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

  it("accepts a full entry with all optional fields", () => {
    const full = {
      id: "poisson-fordeling",
      name_no: "Poissonfordeling",
      type: "distribution" as const,
      category: "discrete_distribution",
      tagline: "Antall hendelser i et tidsvindu.",
      formula_main: "P(X = k) = e^(-λt) · (λt)^k / k!",
      formula_latex: "P(X = k) = \\frac{e^{-\\lambda t}(\\lambda t)^k}{k!}",
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

describe("ConceptSchema", () => {
  it("accepts a minimal concept", () => {
    const c = {
      id: "poisson-prosess",
      name_no: "Poissonprosess",
      type: "concept" as const,
      tagline: "...",
      what_it_means: "...",
      recognition_cues: ["cue"],
      filters: {},
    };
    expect(ConceptSchema.parse(c).id).toBe("poisson-prosess");
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
```

- [ ] **Step 2: Run tests, expect failures**

```bash
npm test
```
Expected: imports fail because `schema.ts` doesn't exist yet.

- [ ] **Step 3: Write `src/data/schema.ts`**

```ts
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
  kind: z.enum(["entry", "concept", "table"]),
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
  id: z.string().regex(/^[A-Z0-9-]+$/),
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

export const FiltersSchema = z.object({
  dimensions: z.array(FilterDimensionSchema),
});
export type Filters = z.infer<typeof FiltersSchema>;
```

- [ ] **Step 4: Run tests**

```bash
npm test
```
Expected: all schema tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/schema.ts src/data/schema.test.ts
git commit -m "feat: add Zod schemas for Entry, Concept, Table, Filters"
```

---

### Task 6: Hand-craft test fixture YAML files

**Files:**
- Create: `content/filters.yaml`
- Create: `content/entries/poisson-fordeling.yaml`
- Create: `content/entries/binomial-fordeling.yaml`
- Create: `content/concepts/poisson-prosess.yaml`
- Create: `content/tables/E2-poisson-kumulativ.yaml`

- [ ] **Step 1: Write `content/filters.yaml`**

```yaml
dimensions:
  - key: computes
    label_no: Beregner
    options:
      - { key: exact_probability,    label_no: "Sannsynlighet (eksakt)" }
      - { key: at_least_k,           label_no: '"Minst k" / "høyst k"' }
      - { key: expected_value,       label_no: "Forventningsverdi" }
      - { key: std_dev,              label_no: "Standardavvik / varians" }
      - { key: confidence_interval,  label_no: "Konfidensintervall" }
      - { key: hypothesis_test,      label_no: "Hypotesetest" }
  - key: random_variable
    label_no: "Tilfeldig variabel"
    options:
      - { key: discrete_count,       label_no: "Diskret antall" }
      - { key: continuous,           label_no: "Kontinuerlig" }
      - { key: time_until_event,     label_no: "Tid til hendelse" }
      - { key: mean_of_samples,      label_no: "Gjennomsnitt av utvalg" }
  - key: setup
    label_no: "Oppsett"
    options:
      - { key: with_replacement,        label_no: "Med tilbakelegging" }
      - { key: without_replacement,     label_no: "Uten tilbakelegging" }
      - { key: single_sample,           label_no: "Ett utvalg" }
      - { key: two_independent_samples, label_no: "To uavhengige utvalg" }
      - { key: events_in_window,        label_no: "Hendelser i et vindu" }
      - { key: fixed_n_trials,          label_no: "Fast antall forsøk" }
  - key: structural_cues
    label_no: "Kjennetegn i oppgaven"
    options:
      - { key: rate_given,             label_no: "Rate gitt" }
      - { key: two_outcomes_per_trial, label_no: "To utfall per forsøk" }
      - { key: success_probability_given, label_no: "Suksessannsynlighet p gitt" }
      - { key: normal_assumed,         label_no: "Normalfordeling antatt" }
      - { key: independent_events,     label_no: "Uavhengige hendelser" }
      - { key: process_over_time,      label_no: "Prosess over tid" }
  - key: distribution_assumption
    label_no: "Fordeling antatt"
    options:
      - { key: binomial,    label_no: "Binomial" }
      - { key: poisson,     label_no: "Poisson" }
      - { key: normal,      label_no: "Normal" }
      - { key: exponential, label_no: "Eksponential" }
      - { key: t_distribution, label_no: "t-fordeling" }
  - key: tooling
    label_no: "Verktøy / tabell"
    options:
      - { key: cumulative_binomial_table_E1, label_no: "Binomialtabell (E.1)" }
      - { key: cumulative_poisson_table_E2,  label_no: "Poissontabell (E.2)" }
      - { key: standard_normal_table_E3,     label_no: "Z-tabell (E.3)" }
      - { key: normal_quantile_table_E4,     label_no: "Z-kvantiltabell (E.4)" }
      - { key: t_quantile_table_E5,          label_no: "t-tabell (E.5)" }
      - { key: chi_square_quantile_table_E6, label_no: "Kjikvadrattabell (E.6)" }
      - { key: calculator_only,              label_no: "Kun kalkulator" }
```

- [ ] **Step 2: Write `content/entries/poisson-fordeling.yaml`**

```yaml
id: poisson-fordeling
name_no: Poissonfordeling
type: distribution
category: discrete_distribution
tagline: "Antall hendelser i et tidsvindu, gitt en konstant rate."

formula_main: "P(X = k) = e^(-λt) · (λt)^k / k!"
formula_latex: "P(X = k) = \\frac{e^{-\\lambda t}(\\lambda t)^k}{k!}"

what_it_does: |
  Modellerer antall uavhengige hendelser som inntreffer med konstant rate
  i et fast tidsvindu eller område.

why_use: |
  Naturlig valg når hendelsene "kommer som de kommer" og det ikke finnes
  noen forhåndsbestemt øvre grense for antallet.

recognition_cues:
  - "Oppgaven nevner Poissonprosess eller rate λ pr. tidsenhet"
  - "Du teller hendelser i et fast tidsvindu eller område"
  - "Hendelser inntreffer uavhengig og kontinuerlig"
  - "Spørsmålet ber om nøyaktig k, minst k, ingen, eller høyst k"
  - "Ikke fast antall forsøk"

when_NOT_to_use:
  - "Fast antall n forsøk er gitt → bruk binomial i stedet"
  - "Spørsmålet handler om tid TIL første hendelse → bruk eksponentialfordeling"
  - "Trekker uten tilbakelegging fra endelig pott → bruk hypergeometrisk"

symbols:
  - { sym: "λ",  means: "rate (gjennomsnittlig antall hendelser pr. tidsenhet)" }
  - { sym: "t",  means: "lengden på vinduet" }
  - { sym: "λt", means: "forventet antall hendelser i vinduet (ofte μ)" }
  - { sym: "k",  means: "antallet det spørres om" }
  - { sym: "e",  means: "Eulers tall ≈ 2.71828" }

properties:
  expected_value: "E[X] = λt"
  variance: "Var[X] = λt"
  std_dev: "σ = √(λt)"

filters:
  computes: [exact_probability, at_least_k]
  random_variable: [discrete_count]
  setup: [events_in_window]
  structural_cues: [rate_given, process_over_time, independent_events]
  distribution_assumption: [poisson]
  tooling: [cumulative_poisson_table_E2]

solution_template:
  - "Identifiser raten λ og enheten den er gitt i"
  - "Identifiser vinduets størrelse t i samme enhet"
  - "Regn ut μ = λt"
  - "Bestem hva spørsmålet ber om"
  - "For minst eller ingen, bruk komplementregelen med tabell E.2"
  - "Slå opp P(X ≤ k) i tabell E.2 eller regn direkte"

common_traps: |
  Husk å multiplisere raten med vindusstørrelsen før innsetting (μ = λt,
  ikke bare λ). Hvis raten er pr. time og vinduet er en uke, må t omregnes
  til timer (168). Bruk samme tidsenhet for begge.

python_snippet: |
  from scipy.stats import poisson
  mu = 0.01 * 168          # 1.68
  poisson.pmf(0, mu)        # 0.1864
  poisson.cdf(2, mu)        # 0.7681
  1 - poisson.cdf(2, mu)    # 0.2319

examples:
  - source: "Eksamen jan26 · oppgave 4a"
    excerpt: "Poissonprosess med rate λ sommerfugler pr. time. Finn sannsynligheten for at biologen ikke vil finne noen individer i fellen etter en uke."
    solution_sketch: "X ~ Poisson(λt), λ = 0.01/t, t = 168 t → μ = 1.68 → P(X = 0) = e^(-1.68) ≈ 0.186"
  - source: "Eksamen jan26 · oppgave 4b"
    excerpt: "Hva er sannsynligheten for at det er minst tre klippeblåvinger i fellen?"
    solution_sketch: "P(X ≥ 3) = 1 − P(X ≤ 2). Slå opp i tabell E.2 med μ = 1.68 → 1 − 0.7681 ≈ 0.232"

detailed_solutions:
  - source: "Eksamen jan26 · oppgave 4a"
    question: "Klippeblåvinger fanges som en poissonprosess med rate λ = 0.01 sommerfugler pr. time. La X være antall i fellen etter én uke (168 timer). Finn sannsynligheten for at biologen ikke vil finne noen individer i fellen."
    sections:
      - label: "Identifisering"
        lines:
          - { text: "X ~ Poisson(λt)" }
          - { comment: "spørres om P(X = 0)" }
      - label: "Formel"
        lines:
          - { text: "P(X = k) = e^(-λt) · (λt)^k / k!" }
      - label: "Innsatt"
        lines:
          - { text: "μ = λt = 0.01 · 168 = 1.68" }
          - { text: "P(X = 0) = e^(-1.68) · (1.68)^0 / 0!" }
          - { indent: "= e^(-1.68) · 1 / 1" }
          - { indent: "= e^(-1.68)" }
    result: "P(X = 0) ≈ 0.186"

  - source: "Eksamen jan26 · oppgave 4b"
    question: "Hva er sannsynligheten for at det er minst tre klippeblåvinger i fellen?"
    sections:
      - label: "Komplementregelen"
        lines:
          - { text: "P(X ≥ 3) = 1 − P(X ≤ 2)" }
      - label: "Innsatt"
        lines:
          - { text: "μ = λt = 0.01 · 168 = 1.68" }
          - { table_lookup: { ref: "E.2", text: "Slå opp P(X ≤ 2) i kolonnen for μ ≈ 1.7 → 0.7681" } }
          - { text: "P(X ≥ 3) = 1 − 0.7681" }
    result: "P(X ≥ 3) ≈ 0.232"

related:
  - { id: "poisson-prosess",         kind: "concept" }
  - { id: "binomial-fordeling",      kind: "entry" }
  - { id: "E2-poisson-kumulativ",    kind: "table" }

tools:
  - "Tabell E.2 — Kumulativ poissonfordeling"
  - "Kalkulator: e^x, k!"
```

- [ ] **Step 3: Write `content/entries/binomial-fordeling.yaml`**

```yaml
id: binomial-fordeling
name_no: Binomialfordeling
type: distribution
category: discrete_distribution
tagline: "Antall suksesser i n uavhengige forsøk med suksessannsynlighet p."

formula_main: "P(X = k) = C(n, k) · p^k · (1-p)^(n-k)"
formula_latex: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}"

what_it_does: "Modellerer antall suksesser i et fast antall n uavhengige Bernoulli-forsøk."
why_use: "Når du har fast antall forsøk, hver med samme suksessannsynlighet p og to mulige utfall."

recognition_cues:
  - "Fast antall n forsøk er oppgitt"
  - "Hvert forsøk har bare to utfall: suksess eller fiasko"
  - "Suksessannsynligheten p er konstant"
  - "Forsøkene er uavhengige av hverandre"

when_NOT_to_use:
  - "Trekker uten tilbakelegging fra endelig pott → bruk hypergeometrisk"
  - "Antall forsøk varierer eller er ikke fastlagt → bruk Poisson"

symbols:
  - { sym: "n", means: "antall forsøk" }
  - { sym: "p", means: "suksessannsynlighet i hvert forsøk" }
  - { sym: "k", means: "antall suksesser det spørres om" }
  - { sym: "C(n,k)", means: "binomialkoeffisient n over k" }

properties:
  expected_value: "E[X] = np"
  variance: "Var[X] = np(1-p)"
  std_dev: "σ = √(np(1-p))"

filters:
  computes: [exact_probability, at_least_k]
  random_variable: [discrete_count]
  setup: [fixed_n_trials]
  structural_cues: [two_outcomes_per_trial, success_probability_given, independent_events]
  distribution_assumption: [binomial]
  tooling: [cumulative_binomial_table_E1]

related:
  - { id: "poisson-fordeling", kind: "entry" }

tools:
  - "Tabell E.1 — Kumulativ binomisk sannsynlighet"
```

- [ ] **Step 4: Write `content/concepts/poisson-prosess.yaml`**

```yaml
id: poisson-prosess
name_no: Poissonprosess
type: concept
tagline: "En tellestrøm med konstant rate og uavhengige hendelser."

what_it_means: |
  En stokastisk prosess der hendelser inntreffer uavhengig av hverandre med
  konstant rate λ over tid eller område. Antallet hendelser i et tidsvindu
  følger en Poissonfordeling, og tiden mellom påfølgende hendelser følger
  en eksponentialfordeling.

recognition_cues:
  - "Oppgaven sier eksplisitt 'Poissonprosess' eller 'poissonprosess'"
  - "Det er en rate (hendelser pr. tidsenhet eller pr. arealenhet) gitt"
  - "Hendelser inntreffer kontinuerlig og uavhengig"

filters:
  random_variable: [discrete_count, time_until_event]
  structural_cues: [rate_given, process_over_time, independent_events]

related:
  - { id: "poisson-fordeling", kind: "entry" }
```

- [ ] **Step 5: Write `content/tables/E2-poisson-kumulativ.yaml`**

```yaml
id: E2-poisson-kumulativ
name_no: Poissontabell
formal_name_no: "Kumulativ poissonfordeling"
code: "E.2"
description: "Slår opp P(X ≤ k) for poissonfordeling. Inputene er forventningsverdien μ (= λt) og k."
inputs:
  - { name: "μ", type: number, min: 0.02, max: 20, step: any }
  - { name: "k", type: integer, min: 0, max: 20 }
output: "P(X ≤ k)"
distribution: poisson
related_entries:
  - poisson-fordeling
```

- [ ] **Step 6: Verify YAML parses by running typecheck**

```bash
npm run typecheck
```
Expected: passes (no schema yet but TypeScript ignores YAML).

- [ ] **Step 7: Commit**

```bash
git add content/
git commit -m "feat: add hand-crafted test fixtures (2 entries, 1 concept, 1 table)"
```

---

### Task 7: Content loader with build-time validation

**Files:**
- Create: `src/data/loadContent.ts`
- Create: `src/data/loadContent.test.ts`

- [ ] **Step 1: Write failing test**

`src/data/loadContent.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { loadAllContent } from "./loadContent";

describe("loadAllContent", () => {
  it("loads all entries, concepts, and tables from content/", () => {
    const data = loadAllContent();
    expect(data.entries.length).toBeGreaterThanOrEqual(2);
    expect(data.concepts.length).toBeGreaterThanOrEqual(1);
    expect(data.tables.length).toBeGreaterThanOrEqual(1);
    expect(data.filters.dimensions.length).toBeGreaterThan(0);
  });

  it("validates each entry against the schema", () => {
    const data = loadAllContent();
    const poisson = data.entries.find((e) => e.id === "poisson-fordeling");
    expect(poisson).toBeDefined();
    expect(poisson?.name_no).toBe("Poissonfordeling");
    expect(poisson?.type).toBe("distribution");
  });

  it("ensures every entry id is unique", () => {
    const data = loadAllContent();
    const ids = data.entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a related ref by kind", () => {
    const data = loadAllContent();
    const poisson = data.entries.find((e) => e.id === "poisson-fordeling")!;
    const rel = poisson.related?.find((r) => r.kind === "concept");
    expect(rel?.id).toBe("poisson-prosess");
    expect(data.concepts.find((c) => c.id === rel!.id)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test
```
Expected: import fails because `loadContent.ts` doesn't exist.

- [ ] **Step 3: Write `src/data/loadContent.ts`**

```ts
import {
  EntrySchema,
  ConceptSchema,
  TableSchema,
  FiltersSchema,
  type Entry,
  type Concept,
  type Table,
  type Filters,
} from "./schema";

const entryModules = import.meta.glob("/content/entries/*.yaml", {
  eager: true,
  import: "default",
});
const conceptModules = import.meta.glob("/content/concepts/*.yaml", {
  eager: true,
  import: "default",
});
const tableModules = import.meta.glob("/content/tables/*.yaml", {
  eager: true,
  import: "default",
});
const filtersModule = import.meta.glob("/content/filters.yaml", {
  eager: true,
  import: "default",
});

export interface ContentBundle {
  entries: Entry[];
  concepts: Concept[];
  tables: Table[];
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

  const filtersFiles = Object.values(filtersModule);
  if (filtersFiles.length === 0) {
    throw new Error("content/filters.yaml is missing");
  }
  const filters = FiltersSchema.parse(filtersFiles[0]);

  // Uniqueness check
  const allIds = [
    ...entries.map((e) => `entry:${e.id}`),
    ...concepts.map((c) => `concept:${c.id}`),
    ...tables.map((t) => `table:${t.id}`),
  ];
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length > 0) {
    throw new Error(`Duplicate ids found: ${dupes.join(", ")}`);
  }

  cached = { entries, concepts, tables, filters };
  return cached;
}
```

- [ ] **Step 4: Run tests, expect pass**

```bash
npm test
```
Expected: all 4 tests pass.

- [ ] **Step 5: Verify build picks up YAML**

```bash
npm run build
```
Expected: build succeeds. The YAML files are included in the dist bundle.

- [ ] **Step 6: Commit**

```bash
git add src/data/loadContent.ts src/data/loadContent.test.ts
git commit -m "feat: load and validate all YAML content at build time"
```

---

## Phase C — Logic (search, filter)

### Task 8: Filter logic with match counts

**Files:**
- Create: `src/data/filtering.ts`
- Create: `src/data/filtering.test.ts`

- [ ] **Step 1: Write failing tests**

`src/data/filtering.test.ts`:
```ts
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
    // For computes facet, counts should reflect already-applying random_variable filter
    expect(counts.computes.exact_probability).toBe(1); // a
    expect(counts.computes.expected_value).toBe(1);    // b
    // For random_variable facet itself, count without that dim's selection applied
    expect(counts.random_variable.discrete_count).toBe(2);
    expect(counts.random_variable.continuous).toBe(1);
  });
});
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test
```
Expected: import fails.

- [ ] **Step 3: Write `src/data/filtering.ts`**

```ts
import type { Entry, Concept } from "./schema";

export type FilterSelection = Record<string, string[]>;
type Filterable = Pick<Entry | Concept, "filters">;

export function applyFilters<T extends Filterable>(
  items: T[],
  selection: FilterSelection
): T[] {
  const activeDims = Object.entries(selection).filter(
    ([, vals]) => vals && vals.length > 0
  );
  if (activeDims.length === 0) return items;

  return items.filter((item) =>
    activeDims.every(([dim, selectedVals]) => {
      const itemVals = item.filters[dim] ?? [];
      return selectedVals.some((v) => itemVals.includes(v));
    })
  );
}

export function computeFacetCounts<T extends Filterable>(
  items: T[],
  selection: FilterSelection
): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  for (const dim of allDimensions(items)) {
    const selectionExceptThisDim = { ...selection };
    delete selectionExceptThisDim[dim];

    const filtered = applyFilters(items, selectionExceptThisDim);
    counts[dim] = {};

    for (const item of filtered) {
      for (const val of item.filters[dim] ?? []) {
        counts[dim][val] = (counts[dim][val] ?? 0) + 1;
      }
    }
  }

  return counts;
}

function allDimensions<T extends Filterable>(items: T[]): string[] {
  const dims = new Set<string>();
  for (const item of items) {
    for (const dim of Object.keys(item.filters)) dims.add(dim);
  }
  return Array.from(dims);
}
```

- [ ] **Step 4: Run, expect pass**

```bash
npm test
```
Expected: all filtering tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/filtering.ts src/data/filtering.test.ts
git commit -m "feat: faceted filter logic with per-option match counts"
```

---

### Task 9: Fuzzy search with Fuse.js

**Files:**
- Create: `src/data/search.ts`
- Create: `src/data/search.test.ts`

- [ ] **Step 1: Write failing test**

`src/data/search.test.ts`:
```ts
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
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Write `src/data/search.ts`**

```ts
import Fuse from "fuse.js";
import type { Entry } from "./schema";

export function buildSearchIndex(entries: Entry[]) {
  return new Fuse(entries, {
    includeScore: true,
    threshold: 0.4,
    keys: [
      { name: "name_no", weight: 1.0 },
      { name: "tagline", weight: 0.7 },
      { name: "recognition_cues", weight: 0.6 },
      { name: "symbols.sym", weight: 0.5 },
      { name: "symbols.means", weight: 0.4 },
      { name: "examples.excerpt", weight: 0.4 },
      { name: "examples.source", weight: 0.3 },
      { name: "what_it_does", weight: 0.3 },
    ],
  });
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/data/search.ts src/data/search.test.ts
git commit -m "feat: fuzzy search index with weighted fields"
```

---

## Phase D — Routing and Shell

### Task 10: React Router setup with placeholder routes

**Files:**
- Modify: `src/App.tsx`
- Create: `src/routes/ListView.tsx`, `src/routes/EntryDetail.tsx`, `src/routes/ConceptDetail.tsx`, `src/routes/TableDetail.tsx`, `src/routes/NotFound.tsx`

- [ ] **Step 1: Write placeholder route files**

Each file follows this pattern (replace `<Name>` for each):

`src/routes/ListView.tsx`:
```tsx
export function ListView() {
  return <div data-testid="list-view">List view</div>;
}
```

`src/routes/EntryDetail.tsx`:
```tsx
import { useParams } from "react-router-dom";
export function EntryDetail() {
  const { id } = useParams();
  return <div data-testid="entry-detail">Entry: {id}</div>;
}
```

`src/routes/ConceptDetail.tsx`:
```tsx
import { useParams } from "react-router-dom";
export function ConceptDetail() {
  const { id } = useParams();
  return <div data-testid="concept-detail">Concept: {id}</div>;
}
```

`src/routes/TableDetail.tsx`:
```tsx
import { useParams } from "react-router-dom";
export function TableDetail() {
  const { id } = useParams();
  return <div data-testid="table-detail">Table: {id}</div>;
}
```

`src/routes/NotFound.tsx`:
```tsx
export function NotFound() {
  return <div data-testid="not-found">Not found</div>;
}
```

- [ ] **Step 2: Wire router in `src/App.tsx`**

```tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import { ListView } from "./routes/ListView";
import { EntryDetail } from "./routes/EntryDetail";
import { ConceptDetail } from "./routes/ConceptDetail";
import { TableDetail } from "./routes/TableDetail";
import { NotFound } from "./routes/NotFound";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/entry/:id" element={<EntryDetail />} />
        <Route path="/concept/:id" element={<ConceptDetail />} />
        <Route path="/table/:id" element={<TableDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
```

We use `HashRouter` (URLs like `index.html#/entry/poisson-fordeling`) because the build needs to work from `file://` where there is no server to handle history-API URLs. Spec already commits us to file:// support.

- [ ] **Step 3: Update App test**

`src/App.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the list view at /", () => {
    render(<App />);
    expect(screen.getByTestId("list-view")).toBeInTheDocument();
  });
});
```

Run `npm test`. Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/routes/
git commit -m "feat: set up React Router with placeholder routes"
```

---

### Task 11: Banner component

**Files:**
- Create: `src/components/shell/Banner.tsx`
- Create: `src/components/shell/Banner.test.tsx`

- [ ] **Step 1: Write smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("renders the title", () => {
    render(<Banner />);
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
  });
  it("renders the σ logo glyph", () => {
    render(<Banner />);
    expect(screen.getByText("σ")).toBeInTheDocument();
  });
  it("renders a theme toggle button", () => {
    render(<Banner />);
    expect(screen.getByRole("button", { name: /tema/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Write `src/components/shell/Banner.tsx`**

```tsx
import { Moon } from "lucide-react";

export function Banner() {
  return (
    <header
      className="relative overflow-hidden text-paper-2"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
      }}
    >
      <div
        className="absolute -right-10 -top-10 h-[220px] w-[220px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-screen-xl items-center justify-between px-7 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10"
            aria-hidden
          >
            <span
              className="font-serif text-xl font-semibold italic text-amber-100"
              style={{ color: "#fef3c7" }}
            >
              σ
            </span>
          </div>
          <h1 className="m-0 font-serif text-[17px] font-semibold tracking-tight">
            Statistikk-kompendium
          </h1>
        </div>
        <button
          type="button"
          aria-label="Bytt tema"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10"
        >
          <Moon size={16} />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/Banner.tsx src/components/shell/Banner.test.tsx
git commit -m "feat: Banner component with σ logomark and theme toggle"
```

---

### Task 12: TabBar component

**Files:**
- Create: `src/components/shell/TabBar.tsx`
- Create: `src/components/shell/TabBar.test.tsx`

- [ ] **Step 1: Write test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TabBar, type Tab } from "./TabBar";

const tabs: Tab[] = [
  { key: "formler", label: "Formler", count: 47 },
  { key: "konsepter", label: "Konsepter", count: 18 },
  { key: "tabeller", label: "Tabeller", count: 6 },
];

describe("TabBar", () => {
  it("renders all tab labels with counts", () => {
    render(<TabBar tabs={tabs} active="formler" onChange={() => {}} />);
    expect(screen.getByText("Formler")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("Konsepter")).toBeInTheDocument();
    expect(screen.getByText("Tabeller")).toBeInTheDocument();
  });

  it("calls onChange with the new key when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<TabBar tabs={tabs} active="formler" onChange={onChange} />);
    fireEvent.click(screen.getByText("Konsepter"));
    expect(onChange).toHaveBeenCalledWith("konsepter");
  });

  it("marks the active tab with aria-selected", () => {
    render(<TabBar tabs={tabs} active="konsepter" onChange={() => {}} />);
    const active = screen.getByRole("tab", { selected: true });
    expect(active).toHaveTextContent("Konsepter");
  });
});
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Write `src/components/shell/TabBar.tsx`**

```tsx
import { Sigma, Lightbulb, Table2 } from "lucide-react";
import { clsx } from "clsx";

export interface Tab {
  key: string;
  label: string;
  count: number;
}

const ICON_BY_KEY: Record<string, typeof Sigma> = {
  formler: Sigma,
  konsepter: Lightbulb,
  tabeller: Table2,
};

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function TabBar({ tabs, active, onChange }: Props) {
  return (
    <div role="tablist" className="mb-4 flex gap-0.5 border-b-2 border-line">
      {tabs.map((t) => {
        const Icon = ICON_BY_KEY[t.key];
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={clsx(
              "-mb-0.5 flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13.5px] font-medium",
              isActive
                ? "border-primary-2 text-primary font-semibold"
                : "border-transparent text-ink-3 hover:text-ink"
            )}
          >
            {Icon && <Icon size={16} />}
            {t.label}
            <span
              className={clsx(
                "rounded-lg px-1.5 py-px font-mono text-[11px]",
                isActive ? "bg-primary-soft text-primary" : "bg-paper-2 text-ink-3"
              )}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/shell/TabBar.tsx src/components/shell/TabBar.test.tsx
git commit -m "feat: TabBar component with icons and counts"
```

---

## Phase E — List View

### Task 13: SearchBox component

**Files:**
- Create: `src/components/list/SearchBox.tsx`
- Create: `src/components/list/SearchBox.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("renders placeholder", () => {
    render(<SearchBox value="" onChange={() => {}} placeholder="Søk..." />);
    expect(screen.getByPlaceholderText("Søk...")).toBeInTheDocument();
  });
  it("calls onChange with new value when user types", () => {
    const onChange = vi.fn();
    render(<SearchBox value="" onChange={onChange} placeholder="x" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "po" } });
    expect(onChange).toHaveBeenCalledWith("po");
  });
});
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Implement**

```tsx
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}

export function SearchBox({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative mb-4">
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line-2 bg-card py-3 pl-11 pr-3 text-sm text-ink placeholder:text-ink-4 focus:border-primary-2 focus:outline-none focus:ring-2 focus:ring-primary-2/10"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-paper-2 px-1.5 py-px font-mono text-[11px] text-ink-3 sm:inline">
        Ctrl+K
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/list/SearchBox.tsx src/components/list/SearchBox.test.tsx
git commit -m "feat: SearchBox component"
```

---

### Task 14: FilterSidebar with collapsible groups

**Files:**
- Create: `src/components/list/FilterGroup.tsx`
- Create: `src/components/list/FilterSidebar.tsx`
- Create: `src/components/list/FilterSidebar.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterSidebar } from "./FilterSidebar";
import type { Filters } from "@/data/schema";

const filtersConfig: Filters = {
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

describe("FilterSidebar", () => {
  it("renders a dimension header", () => {
    render(
      <FilterSidebar
        filters={filtersConfig}
        selection={{}}
        counts={{ computes: { exact_probability: 5, expected_value: 3 } }}
        onToggle={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText("Beregner")).toBeInTheDocument();
  });

  it("expands a group and shows options with counts", () => {
    render(
      <FilterSidebar
        filters={filtersConfig}
        selection={{}}
        counts={{ computes: { exact_probability: 5, expected_value: 3 } }}
        onToggle={() => {}}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Beregner"));
    expect(screen.getByText("Sannsynlighet (eksakt)")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onToggle when an option is clicked", () => {
    const onToggle = vi.fn();
    render(
      <FilterSidebar
        filters={filtersConfig}
        selection={{}}
        counts={{ computes: { exact_probability: 5, expected_value: 3 } }}
        onToggle={onToggle}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Beregner"));
    fireEvent.click(screen.getByLabelText(/Sannsynlighet/));
    expect(onToggle).toHaveBeenCalledWith("computes", "exact_probability");
  });
});
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Implement `FilterGroup`**

```tsx
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { FilterDimension } from "@/data/schema";

interface Props {
  dimension: { key: string; label_no: string; options: { key: string; label_no: string }[] };
  selection: string[];
  counts: Record<string, number>;
  onToggle: (optionKey: string) => void;
  defaultOpen?: boolean;
}

export function FilterGroup({
  dimension,
  selection,
  counts,
  onToggle,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen || selection.length > 0);
  return (
    <div className="mb-1 border-b border-line py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1.5 text-[12px] font-medium uppercase tracking-wide text-ink-2"
      >
        {dimension.label_no}
        {open ? (
          <ChevronDown size={12} className="text-ink-4" />
        ) : (
          <ChevronRight size={12} className="text-ink-4" />
        )}
      </button>
      {open && (
        <div className="pb-2 pl-1">
          {dimension.options.map((opt) => {
            const checked = selection.includes(opt.key);
            const count = counts[opt.key] ?? 0;
            const dimmed = count === 0 && !checked;
            return (
              <label
                key={opt.key}
                className={clsx(
                  "flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-primary-2/5",
                  dimmed ? "text-ink-4" : "text-ink-2"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt.key)}
                  className="accent-primary-2"
                  aria-label={opt.label_no}
                />
                {opt.label_no}
                <span className="ml-auto rounded-lg border border-line bg-card px-1.5 py-px font-mono text-[11px] text-ink-3">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Implement `FilterSidebar`**

```tsx
import { FilterGroup } from "./FilterGroup";
import type { Filters } from "@/data/schema";
import type { FilterSelection } from "@/data/filtering";

interface Props {
  filters: Filters;
  selection: FilterSelection;
  counts: Record<string, Record<string, number>>;
  onToggle: (dim: string, optionKey: string) => void;
  onClear: () => void;
}

export function FilterSidebar({
  filters,
  selection,
  counts,
  onToggle,
  onClear,
}: Props) {
  const hasAny = Object.values(selection).some((arr) => arr && arr.length > 0);
  return (
    <aside className="border-r border-line bg-paper-2 p-3.5 text-sm">
      <div className="mb-2 flex items-center justify-between border-b border-line pb-2 font-serif text-sm font-semibold text-ink-2">
        Filter
        {hasAny && (
          <button
            type="button"
            onClick={onClear}
            className="font-sans text-[11px] font-medium text-primary-2"
          >
            Nullstill
          </button>
        )}
      </div>
      {filters.dimensions.map((d) => (
        <FilterGroup
          key={d.key}
          dimension={d}
          selection={selection[d.key] ?? []}
          counts={counts[d.key] ?? {}}
          onToggle={(opt) => onToggle(d.key, opt)}
        />
      ))}
    </aside>
  );
}
```

- [ ] **Step 5: Run, expect pass**

- [ ] **Step 6: Commit**

```bash
git add src/components/list/FilterGroup.tsx src/components/list/FilterSidebar.tsx src/components/list/FilterSidebar.test.tsx
git commit -m "feat: collapsible FilterSidebar with FilterGroup option list"
```

---

### Task 15: ActiveFilterPills

**Files:**
- Create: `src/components/list/ActiveFilterPills.tsx`
- Create: `src/components/list/ActiveFilterPills.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ActiveFilterPills } from "./ActiveFilterPills";

describe("ActiveFilterPills", () => {
  it("renders a pill per selected option with the human label", () => {
    render(
      <ActiveFilterPills
        items={[
          { dim: "computes", optionKey: "exact_probability", label: "Sannsynlighet (eksakt)" },
          { dim: "random_variable", optionKey: "discrete_count", label: "Diskret antall" },
        ]}
        onRemove={() => {}}
      />
    );
    expect(screen.getByText("Sannsynlighet (eksakt)")).toBeInTheDocument();
    expect(screen.getByText("Diskret antall")).toBeInTheDocument();
  });

  it("calls onRemove with dim+optionKey when × clicked", () => {
    const onRemove = vi.fn();
    render(
      <ActiveFilterPills
        items={[{ dim: "computes", optionKey: "exact_probability", label: "X" }]}
        onRemove={onRemove}
      />
    );
    fireEvent.click(screen.getByLabelText(/fjern X/i));
    expect(onRemove).toHaveBeenCalledWith("computes", "exact_probability");
  });
});
```

- [ ] **Step 2: Implement**

```tsx
interface PillItem {
  dim: string;
  optionKey: string;
  label: string;
}

interface Props {
  items: PillItem[];
  onRemove: (dim: string, optionKey: string) => void;
}

export function ActiveFilterPills({ items, onRemove }: Props) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span
          key={`${it.dim}:${it.optionKey}`}
          className="flex items-center gap-1 rounded-xl bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary"
        >
          {it.label}
          <button
            type="button"
            aria-label={`Fjern ${it.label}`}
            onClick={() => onRemove(it.dim, it.optionKey)}
            className="cursor-pointer text-[13px] opacity-50 hover:opacity-100"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Run, expect pass**

- [ ] **Step 4: Commit**

```bash
git add src/components/list/ActiveFilterPills.tsx src/components/list/ActiveFilterPills.test.tsx
git commit -m "feat: ActiveFilterPills with × removal"
```

---

### Task 16: EntryTable with rows and arrows

**Files:**
- Create: `src/components/list/EntryTable.tsx`
- Create: `src/components/list/EntryTable.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { EntryTable } from "./EntryTable";
import type { Entry } from "@/data/schema";

const entries: Entry[] = [
  {
    id: "poisson-fordeling",
    name_no: "Poissonfordeling",
    type: "distribution",
    tagline: "tag",
    formula_main: "P(X = k) = ...",
    formula_latex: "P(X = k) = ...",
    what_it_does: "",
    recognition_cues: ["Rate gitt"],
    filters: {},
  },
];

describe("EntryTable", () => {
  it("renders one row per entry with name and computes column", () => {
    render(
      <MemoryRouter>
        <EntryTable entries={entries} onRowClick={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
    expect(screen.getByText(/distribusjon/i)).toBeInTheDocument();
  });

  it("invokes onRowClick when a row is clicked", () => {
    const onRowClick = vi.fn();
    render(
      <MemoryRouter>
        <EntryTable entries={entries} onRowClick={onRowClick} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Poissonfordeling"));
    expect(onRowClick).toHaveBeenCalledWith("poisson-fordeling");
  });
});
```

- [ ] **Step 2: Implement**

```tsx
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import type { Entry } from "@/data/schema";

const TYPE_LABEL: Record<Entry["type"], string> = {
  distribution: "distribusjon",
  test: "hypotesetest",
  regression: "regresjon",
  identity: "identitet",
  rule: "regel",
  combinatorics: "kombinatorikk",
};

const TYPE_BADGE_CLASS: Record<Entry["type"], string> = {
  distribution: "bg-indigo-100 text-indigo-800",
  test: "bg-pink-100 text-pink-800",
  regression: "bg-emerald-100 text-emerald-800",
  identity: "bg-stone-100 text-stone-700",
  rule: "bg-stone-100 text-stone-700",
  combinatorics: "bg-violet-100 text-violet-800",
};

interface Props {
  entries: Entry[];
  onRowClick: (id: string) => void;
}

export function EntryTable({ entries, onRowClick }: Props) {
  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-ink-3">
        Ingen treff. Prøv å fjerne et filter eller endre søket.
      </p>
    );
  }
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Navn
          </th>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Type
          </th>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Beregner
          </th>
          <th className="border-b border-line-2 py-2 px-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-3">
            Kjennetegn
          </th>
          <th className="w-8 border-b border-line-2"></th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr
            key={e.id}
            onClick={() => onRowClick(e.id)}
            className="cursor-pointer border-b border-line transition-colors hover:bg-paper-2"
          >
            <td className="px-2.5 py-3 align-middle font-serif text-sm font-semibold text-ink">
              {e.name_no}
            </td>
            <td className="px-2.5 py-3 align-middle">
              <span
                className={clsx(
                  "inline-block rounded-xl px-2.5 py-0.5 text-[11px] font-medium",
                  TYPE_BADGE_CLASS[e.type]
                )}
              >
                {TYPE_LABEL[e.type]}
              </span>
            </td>
            <td className="px-2.5 py-3 align-middle font-math text-sm text-ink-2">
              {e.formula_main}
            </td>
            <td className="px-2.5 py-3 align-middle text-[12.5px] leading-snug text-ink-3">
              {e.recognition_cues.slice(0, 1).join(" · ")}
            </td>
            <td className="px-2.5 py-3 align-middle">
              <ArrowRight size={16} className="text-ink-4" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 3: Run, expect pass**

- [ ] **Step 4: Commit**

```bash
git add src/components/list/EntryTable.tsx src/components/list/EntryTable.test.tsx
git commit -m "feat: EntryTable with type badges and click navigation"
```

---

### Task 17: Wire up ListView with state, filtering, search

**Files:**
- Create: `src/hooks/useFilteredContent.ts`
- Modify: `src/routes/ListView.tsx`
- Create: `src/routes/ListView.test.tsx`

- [ ] **Step 1: Implement `useFilteredContent` hook**

```ts
import { useMemo, useState } from "react";
import { applyFilters, computeFacetCounts, type FilterSelection } from "@/data/filtering";
import { buildSearchIndex } from "@/data/search";
import type { Entry } from "@/data/schema";

export function useFilteredContent(allEntries: Entry[]) {
  const [selection, setSelection] = useState<FilterSelection>({});
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => buildSearchIndex(allEntries), [allEntries]);

  const filtered = useMemo(() => {
    let pool = allEntries;
    if (query.trim().length > 0) {
      const ids = new Set(fuse.search(query.trim()).map((h) => h.item.id));
      pool = pool.filter((e) => ids.has(e.id));
    }
    return applyFilters(pool, selection);
  }, [allEntries, query, fuse, selection]);

  const counts = useMemo(
    () => computeFacetCounts(allEntries, selection),
    [allEntries, selection]
  );

  function toggle(dim: string, optionKey: string) {
    setSelection((prev) => {
      const cur = prev[dim] ?? [];
      const next = cur.includes(optionKey)
        ? cur.filter((k) => k !== optionKey)
        : [...cur, optionKey];
      return { ...prev, [dim]: next };
    });
  }

  function remove(dim: string, optionKey: string) {
    setSelection((prev) => ({
      ...prev,
      [dim]: (prev[dim] ?? []).filter((k) => k !== optionKey),
    }));
  }

  function clear() {
    setSelection({});
  }

  return { filtered, counts, selection, query, setQuery, toggle, remove, clear };
}
```

- [ ] **Step 2: Implement ListView**

```tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Banner } from "@/components/shell/Banner";
import { TabBar } from "@/components/shell/TabBar";
import { SearchBox } from "@/components/list/SearchBox";
import { FilterSidebar } from "@/components/list/FilterSidebar";
import { ActiveFilterPills } from "@/components/list/ActiveFilterPills";
import { EntryTable } from "@/components/list/EntryTable";
import { loadAllContent } from "@/data/loadContent";
import { useFilteredContent } from "@/hooks/useFilteredContent";

export function ListView() {
  const data = loadAllContent();
  const navigate = useNavigate();
  const [tab, setTab] = useState("formler");

  const {
    filtered,
    counts,
    selection,
    query,
    setQuery,
    toggle,
    remove,
    clear,
  } = useFilteredContent(data.entries);

  // Active pill items, with human labels resolved from filters config
  const activePills = Object.entries(selection).flatMap(([dim, vals]) =>
    (vals ?? []).map((optionKey) => {
      const dimDef = data.filters.dimensions.find((d) => d.key === dim);
      const opt = dimDef?.options.find((o) => o.key === optionKey);
      return { dim, optionKey, label: opt?.label_no ?? optionKey };
    })
  );

  return (
    <div data-testid="list-view" className="min-h-screen bg-paper">
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={data.filters}
          selection={selection}
          counts={counts}
          onToggle={toggle}
          onClear={clear}
        />
        <main className="bg-card px-7 py-5">
          <TabBar
            tabs={[
              { key: "formler", label: "Formler", count: data.entries.length },
              { key: "konsepter", label: "Konsepter", count: data.concepts.length },
              { key: "tabeller", label: "Tabeller", count: data.tables.length },
            ]}
            active={tab}
            onChange={setTab}
          />
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="Søk i navn, symboler, kjennetegn, eksempler..."
          />
          <div className="mb-3.5 flex items-start justify-between border-b border-line pb-3.5">
            <div>
              <p className="text-[13px] text-ink-3">
                <strong className="mr-1 font-serif text-[17px] font-semibold text-ink">
                  {filtered.length}
                </strong>
                treff av {data.entries.length} oppføringer
              </p>
              <ActiveFilterPills items={activePills} onRemove={remove} />
            </div>
          </div>
          <EntryTable entries={filtered} onRowClick={(id) => navigate(`/entry/${id}`)} />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Test**

`src/routes/ListView.test.tsx`:
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ListView } from "./ListView";

describe("ListView", () => {
  it("renders the banner, tabs, and at least one entry from fixtures", () => {
    render(
      <MemoryRouter>
        <ListView />
      </MemoryRouter>
    );
    expect(screen.getByText("Statistikk-kompendium")).toBeInTheDocument();
    expect(screen.getByText("Formler")).toBeInTheDocument();
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
  });

  it("filters entries when a filter option is selected", () => {
    render(
      <MemoryRouter>
        <ListView />
      </MemoryRouter>
    );
    // Open the "Beregner" group
    fireEvent.click(screen.getByText("Beregner"));
    fireEvent.click(screen.getByLabelText(/Sannsynlighet/));
    // Both Poisson and Binomial have exact_probability so both still show
    expect(screen.getByText("Poissonfordeling")).toBeInTheDocument();
    expect(screen.getByText("Binomialfordeling")).toBeInTheDocument();
  });
});
```

Run `npm test`. Expected: passes.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```
Visit `http://localhost:5173`. You should see banner, tabs, filter sidebar with "Beregner" group, search bar, and two rows (Poissonfordeling, Binomialfordeling). Click a filter checkbox — the count updates. Click a row — URL changes to `#/entry/poisson-fordeling`.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useFilteredContent.ts src/routes/ListView.tsx src/routes/ListView.test.tsx
git commit -m "feat: ListView wires filter sidebar, search, and table"
```

---

## Phase F — Detail page primitives

### Task 18: KaTeX math primitive

**Files:**
- Create: `src/components/primitives/Math.tsx`
- Create: `src/components/primitives/Math.test.tsx`
- Modify: `src/styles/global.css` (import KaTeX CSS)

- [ ] **Step 1: Import KaTeX CSS**

In `src/styles/global.css`, add the KaTeX import after existing imports:
```css
@import "./fonts.css";
@import "./tokens.css";
@import "tailwindcss";
@import "katex/dist/katex.min.css";

/* ... existing rules ... */
```

- [ ] **Step 2: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Math } from "./Math";

describe("Math", () => {
  it("renders LaTeX content", () => {
    const { container } = render(<Math latex="P(X = k) = \\frac{1}{k!}" />);
    // KaTeX produces .katex containers
    expect(container.querySelector(".katex")).toBeInTheDocument();
  });
  it("falls back to plain text on render error", () => {
    render(<Math latex="\\unknownmacro{}" fallback="plain text" />);
    expect(screen.getByText("plain text")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implement**

```tsx
import { useMemo } from "react";
import katex from "katex";

interface Props {
  latex: string;
  display?: boolean;
  fallback?: string;
}

export function Math({ latex, display = false, fallback }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: display,
        throwOnError: true,
        strict: "warn",
      });
    } catch {
      return null;
    }
  }, [latex, display]);

  if (html === null) {
    return <span>{fallback ?? latex}</span>;
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/primitives/Math.tsx src/components/primitives/Math.test.tsx src/styles/global.css
git commit -m "feat: Math primitive wraps KaTeX with safe fallback"
```

---

### Task 19: HeroFormula card

**Files:**
- Create: `src/components/detail/HeroFormula.tsx`
- Create: `src/components/detail/HeroFormula.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroFormula } from "./HeroFormula";

describe("HeroFormula", () => {
  it("renders a HOVEDFORMEL label and the formula content", () => {
    const { container } = render(
      <HeroFormula latex="P(X = k) = \\frac{1}{k!}" />
    );
    expect(screen.getByText("Hovedformel")).toBeInTheDocument();
    expect(container.querySelector(".katex")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
import { Math } from "@/components/primitives/Math";

export function HeroFormula({ latex }: { latex: string }) {
  return (
    <div
      className="relative mb-9 overflow-hidden rounded-xl px-6 py-9 text-center text-white"
      style={{
        background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute -bottom-14 -left-14 h-[200px] w-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)",
        }}
      />
      <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-amber-100/70">
        Hovedformel
      </div>
      <div className="relative z-10 text-[28px]">
        <Math latex={latex} display />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run, expect pass**

- [ ] **Step 4: Commit**

```bash
git add src/components/detail/HeroFormula.tsx src/components/detail/HeroFormula.test.tsx
git commit -m "feat: HeroFormula card with KaTeX-rendered formula"
```

---

### Task 20: Section primitive (h2 with icon and underline)

**Files:**
- Create: `src/components/detail/Section.tsx`
- Create: `src/components/detail/Section.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Info } from "lucide-react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders title and children", () => {
    render(
      <Section title="Hva den gjør" icon={Info}>
        <p>body</p>
      </Section>
    );
    expect(screen.getByText("Hva den gjør")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

interface Props {
  title: string;
  icon?: ComponentType<LucideProps>;
  children: ReactNode;
}

export function Section({ title, icon: Icon, children }: Props) {
  return (
    <section className="mb-9">
      <h2 className="mb-3.5 flex items-center gap-2 border-b border-line pb-2 font-serif text-[13px] font-semibold uppercase tracking-widest text-ink-3">
        {Icon && <Icon size={14} className="text-primary-2" />}
        {title}
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Run, commit**

```bash
git add src/components/detail/Section.tsx src/components/detail/Section.test.tsx
git commit -m "feat: Section primitive for detail-page section headings"
```

---

### Task 21: RecognitionCues (positive + warn variants)

**Files:**
- Create: `src/components/detail/RecognitionCues.tsx`
- Create: `src/components/detail/RecognitionCues.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RecognitionCues } from "./RecognitionCues";

describe("RecognitionCues", () => {
  it("renders each cue as a list item", () => {
    render(<RecognitionCues cues={["a", "b"]} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });
  it("uses warn styling when variant=warn", () => {
    const { container } = render(<RecognitionCues cues={["x"]} variant="warn" />);
    expect(container.firstChild).toHaveClass("warn");
  });
});
```

- [ ] **Step 2: Implement**

```tsx
import { clsx } from "clsx";

interface Props {
  cues: string[];
  variant?: "positive" | "warn";
}

export function RecognitionCues({ cues, variant = "positive" }: Props) {
  const isWarn = variant === "warn";
  return (
    <ul className={clsx("m-0 grid list-none gap-2 p-0", isWarn && "warn")}>
      {cues.map((cue, i) => (
        <li
          key={i}
          className={clsx(
            "relative rounded-lg py-2.5 pl-9 pr-3.5 font-serif text-[14px] leading-snug",
            isWarn
              ? "border-l-[3px] border-warn bg-warn-soft text-amber-900"
              : "border-l-[3px] border-primary-2 bg-paper-2 text-ink-2"
          )}
        >
          <span
            aria-hidden
            className={clsx(
              "absolute left-3 top-3 inline-block h-4 w-4 rounded-full",
              isWarn
                ? "bg-warn shadow-[inset_0_0_0_2px_var(--color-warn-soft)]"
                : "bg-primary-2 shadow-[inset_0_0_0_2px_white]"
            )}
          />
          {cue}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Run, commit**

```bash
git add src/components/detail/RecognitionCues.tsx src/components/detail/RecognitionCues.test.tsx
git commit -m "feat: RecognitionCues with positive and warn variants"
```

---

### Task 22: SymbolGrid

**Files:**
- Create: `src/components/detail/SymbolGrid.tsx`
- Create: `src/components/detail/SymbolGrid.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SymbolGrid } from "./SymbolGrid";

describe("SymbolGrid", () => {
  it("renders each symbol with its meaning", () => {
    render(
      <SymbolGrid
        symbols={[
          { sym: "λ", means: "rate" },
          { sym: "k", means: "antallet" },
        ]}
      />
    );
    expect(screen.getByText("λ")).toBeInTheDocument();
    expect(screen.getByText("rate")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText("antallet")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
interface Symbol {
  sym: string;
  means: string;
}

export function SymbolGrid({ symbols }: { symbols: Symbol[] }) {
  return (
    <div
      className="grid gap-y-2.5 gap-x-5 rounded-lg border border-line bg-paper-2 px-5 py-4"
      style={{ gridTemplateColumns: "90px 1fr" }}
    >
      {symbols.map((s, i) => (
        <div key={i} className="contents">
          <span className="text-center font-math text-[22px] font-medium leading-tight text-primary">
            {s.sym}
          </span>
          <span className="self-center text-[14px] leading-snug text-ink-2">
            {s.means}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Run, commit**

```bash
git add src/components/detail/SymbolGrid.tsx src/components/detail/SymbolGrid.test.tsx
git commit -m "feat: SymbolGrid for detail-page symbol meanings"
```

---

### Task 23: PropertyCards

**Files:**
- Create: `src/components/detail/PropertyCards.tsx`
- Create: `src/components/detail/PropertyCards.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PropertyCards } from "./PropertyCards";

describe("PropertyCards", () => {
  it("renders provided properties only", () => {
    render(
      <PropertyCards
        properties={{ expected_value: "E[X] = λt", variance: "Var[X] = λt" }}
      />
    );
    expect(screen.getByText("Forventningsverdi")).toBeInTheDocument();
    expect(screen.getByText("E[X] = λt")).toBeInTheDocument();
    expect(screen.getByText("Varians")).toBeInTheDocument();
    expect(screen.queryByText("Standardavvik")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
const LABELS: Record<string, string> = {
  expected_value: "Forventningsverdi",
  variance: "Varians",
  std_dev: "Standardavvik",
};

interface Props {
  properties: Partial<Record<keyof typeof LABELS, string>>;
}

export function PropertyCards({ properties }: Props) {
  const entries = Object.entries(properties).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-lg border border-line bg-card px-4 py-3.5"
        >
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            {LABELS[key]}
          </div>
          <div className="font-math text-lg font-medium text-ink">{value}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Run, commit**

```bash
git add src/components/detail/PropertyCards.tsx src/components/detail/PropertyCards.test.tsx
git commit -m "feat: PropertyCards for E[X], Var[X], σ"
```

---

### Task 24: StepByStep

**Files:**
- Create: `src/components/detail/StepByStep.tsx`
- Create: `src/components/detail/StepByStep.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StepByStep } from "./StepByStep";

describe("StepByStep", () => {
  it("renders steps in order", () => {
    const { container } = render(
      <StepByStep steps={["First", "Second", "Third"]} />
    );
    const items = container.querySelectorAll("li");
    expect(items[0]).toHaveTextContent("First");
    expect(items[2]).toHaveTextContent("Third");
  });
});
```

- [ ] **Step 2: Implement**

```tsx
export function StepByStep({ steps }: { steps: string[] }) {
  return (
    <ol className="m-0 list-none p-0 [counter-reset:step]">
      {steps.map((step, i) => (
        <li
          key={i}
          className="relative mb-2 rounded-lg border border-line bg-card py-3 pl-12 pr-4 font-serif text-[14.5px] leading-relaxed text-ink-2 [counter-increment:step] before:absolute before:left-3.5 before:top-3 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:bg-primary-2 before:font-mono before:text-[12px] before:font-semibold before:text-white before:content-[counter(step)]"
        >
          {step}
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 3: Run, commit**

```bash
git add src/components/detail/StepByStep.tsx src/components/detail/StepByStep.test.tsx
git commit -m "feat: StepByStep numbered procedure list"
```

---

### Task 25: ExampleCard (short, light)

**Files:**
- Create: `src/components/detail/ExampleCard.tsx`
- Create: `src/components/detail/ExampleCard.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExampleCard } from "./ExampleCard";

describe("ExampleCard", () => {
  it("renders source, excerpt, and solution sketch", () => {
    render(
      <ExampleCard
        source="Eksamen jan26 · 4a"
        excerpt="some question text"
        solutionSketch="P(X=0) ≈ 0.186"
      />
    );
    expect(screen.getByText(/Eksamen jan26 · 4a/i)).toBeInTheDocument();
    expect(screen.getByText(/some question text/)).toBeInTheDocument();
    expect(screen.getByText(/0.186/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
import { BookOpen } from "lucide-react";

interface Props {
  source: string;
  excerpt: string;
  solutionSketch: string;
}

export function ExampleCard({ source, excerpt, solutionSketch }: Props) {
  return (
    <div className="mb-3 rounded-lg border border-line border-l-4 border-l-primary-2 bg-card px-5 py-4">
      <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
        <BookOpen size={11} className="text-primary-2" />
        {source}
      </div>
      <p className="my-2 font-serif text-[14.5px] italic leading-snug text-ink-2 before:text-ink-4 before:content-['«_'] after:text-ink-4 after:content-['_»']">
        {excerpt}
      </p>
      <div className="rounded-md bg-paper-2 px-3.5 py-2.5 font-math text-[14px] leading-relaxed text-ink">
        {solutionSketch}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run, commit**

```bash
git add src/components/detail/ExampleCard.tsx src/components/detail/ExampleCard.test.tsx
git commit -m "feat: ExampleCard for short worked-solution sketches"
```

---

### Task 26: DetailedSolution (calc block)

**Files:**
- Create: `src/components/detail/TableLookupCallout.tsx`
- Create: `src/components/detail/DetailedSolution.tsx`
- Create: `src/components/detail/DetailedSolution.test.tsx`

- [ ] **Step 1: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DetailedSolution } from "./DetailedSolution";
import type { DetailedSolution as DS } from "@/data/schema";

const sample: DS = {
  source: "Eksamen jan26 · 4a",
  question: "Find P(X=0).",
  sections: [
    { label: "Formel", lines: [{ text: "P(X=k) = ..." }] },
    {
      label: "Innsatt",
      lines: [
        { text: "μ = 1.68" },
        { comment: "spørres om P(X=0)" },
        { table_lookup: { ref: "E.2", text: "Slå opp P(X≤2) → 0.7681" } },
        { indent: "= e^(-1.68)" },
      ],
    },
  ],
  result: "P(X=0) ≈ 0.186",
};

describe("DetailedSolution", () => {
  it("renders source, question, sections, lines, and result", () => {
    render(<DetailedSolution solution={sample} />);
    expect(screen.getByText(/Eksamen jan26 · 4a/)).toBeInTheDocument();
    expect(screen.getByText(/Find P\(X=0\)/)).toBeInTheDocument();
    expect(screen.getByText("Formel")).toBeInTheDocument();
    expect(screen.getByText("P(X=k) = ...")).toBeInTheDocument();
    expect(screen.getByText("# spørres om P(X=0)")).toBeInTheDocument();
    expect(screen.getByText("Slå opp P(X≤2) → 0.7681")).toBeInTheDocument();
    expect(screen.getByText("E.2")).toBeInTheDocument();
    expect(screen.getByText("P(X=0) ≈ 0.186")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement TableLookupCallout**

```tsx
interface Props {
  ref: string;
  text: string;
}

export function TableLookupCallout({ ref, text }: Props) {
  return (
    <div
      className="my-2 rounded-r-md border-l-2 px-3 py-2 text-[13px]"
      style={{
        background: "var(--color-calc-lookup-bg)",
        borderColor: "var(--color-calc-lookup-border)",
        color: "var(--color-calc-lookup-text)",
      }}
    >
      <div
        className="mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-calc-lookup-border)" }}
      >
        Tabell {ref}
      </div>
      {text}
    </div>
  );
}
```

- [ ] **Step 3: Implement DetailedSolution**

```tsx
import { BookOpen } from "lucide-react";
import { TableLookupCallout } from "./TableLookupCallout";
import type { DetailedSolution as DS } from "@/data/schema";

export function DetailedSolution({ solution }: { solution: DS }) {
  return (
    <div className="mb-4">
      <div className="rounded-t-lg border border-b-0 border-line bg-paper-2 px-5 py-3">
        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          <BookOpen size={11} className="text-primary-2" />
          {solution.source}
        </div>
        <p className="m-0 font-serif text-[14px] italic leading-snug text-ink-2 before:text-ink-4 before:content-['«_'] after:text-ink-4 after:content-['_»']">
          {solution.question}
        </p>
      </div>
      <div
        className="relative overflow-x-auto rounded-b-lg border border-t-0 px-7 py-5 font-mono text-[14px] leading-relaxed"
        style={{
          background: "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
          borderColor: "var(--color-calc-border)",
          color: "var(--color-calc-text)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-px -top-px h-[90px] w-[90px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
          }}
        />
        {solution.sections.map((sec, si) => (
          <div key={si}>
            <div
              className="mb-1.5 mt-4 font-mono text-[10.5px] font-semibold uppercase tracking-widest first:mt-0"
              style={{ color: "var(--color-calc-label)" }}
            >
              {sec.label}
            </div>
            {sec.lines.map((line, li) => {
              if ("text" in line) {
                return (
                  <div key={li} className="whitespace-pre py-px">
                    {line.text}
                  </div>
                );
              }
              if ("comment" in line) {
                return (
                  <div key={li} className="whitespace-pre py-px">
                    <span
                      className="ml-3 italic"
                      style={{ color: "var(--color-calc-comment)" }}
                    >
                      # {line.comment}
                    </span>
                  </div>
                );
              }
              if ("indent" in line) {
                return (
                  <div key={li} className="whitespace-pre py-px pl-6">
                    {line.indent}
                  </div>
                );
              }
              if ("table_lookup" in line) {
                return (
                  <TableLookupCallout
                    key={li}
                    ref={line.table_lookup.ref}
                    text={line.table_lookup.text}
                  />
                );
              }
              return null;
            })}
          </div>
        ))}
        <hr
          className="my-3 border-0"
          style={{ height: 1, background: "var(--color-calc-divider)" }}
        />
        <div
          className="mb-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-calc-label)" }}
        >
          Resultat
        </div>
        <span
          className="block text-[20px] font-bold tracking-wide"
          style={{ color: "var(--color-calc-result)" }}
        >
          {solution.result}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git add src/components/detail/TableLookupCallout.tsx src/components/detail/DetailedSolution.tsx src/components/detail/DetailedSolution.test.tsx
git commit -m "feat: DetailedSolution calc block with cyan result and indigo lookup callouts"
```

---

### Task 27: TrapAlert, PythonSnippet, ToolCards, RelatedPills, Pager

This task bundles five small, similar components. Each gets a smoke test and a simple implementation.

**Files:**
- Create: `src/components/detail/TrapAlert.tsx`
- Create: `src/components/detail/PythonSnippet.tsx`
- Create: `src/components/detail/ToolCards.tsx`
- Create: `src/components/detail/RelatedPills.tsx`
- Create: `src/components/detail/Pager.tsx`
- Create one combined test file: `src/components/detail/MiscDetail.test.tsx`

- [ ] **Step 1: Combined smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TrapAlert } from "./TrapAlert";
import { PythonSnippet } from "./PythonSnippet";
import { ToolCards } from "./ToolCards";
import { RelatedPills } from "./RelatedPills";
import { Pager } from "./Pager";

describe("TrapAlert", () => {
  it("renders body text in a yellow alert box", () => {
    render(<TrapAlert body="husk enheter" />);
    expect(screen.getByText("husk enheter")).toBeInTheDocument();
    expect(screen.getByText(/pass på/i)).toBeInTheDocument();
  });
});

describe("PythonSnippet", () => {
  it("renders code in a pre element", () => {
    render(<PythonSnippet code="from scipy.stats import poisson" />);
    expect(screen.getByText(/from scipy.stats/)).toBeInTheDocument();
  });
});

describe("ToolCards", () => {
  it("renders each tool name", () => {
    render(<ToolCards tools={["Tabell E.2", "Kalkulator"]} />);
    expect(screen.getByText("Tabell E.2")).toBeInTheDocument();
    expect(screen.getByText("Kalkulator")).toBeInTheDocument();
  });
});

describe("RelatedPills", () => {
  it("renders a pill per related ref with kind suffix", () => {
    render(
      <MemoryRouter>
        <RelatedPills
          related={[
            { id: "poisson-prosess", kind: "concept", name: "Poissonprosess" },
            { id: "binomial-fordeling", kind: "entry", name: "Binomialfordeling" },
          ]}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Poissonprosess")).toBeInTheDocument();
    expect(screen.getByText("(konsept)")).toBeInTheDocument();
    expect(screen.getByText("Binomialfordeling")).toBeInTheDocument();
  });
});

describe("Pager", () => {
  it("renders prev and next buttons when both provided", () => {
    render(
      <MemoryRouter>
        <Pager
          prev={{ id: "prev-id", name: "Forrige formel" }}
          next={{ id: "next-id", name: "Neste formel" }}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Forrige formel")).toBeInTheDocument();
    expect(screen.getByText("Neste formel")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement TrapAlert**

```tsx
import { AlertCircle } from "lucide-react";

export function TrapAlert({ body }: { body: string }) {
  return (
    <div className="rounded-lg border border-yellow-300 border-l-4 border-l-yellow-600 bg-yellow-100 px-5 py-3.5 text-yellow-900">
      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-yellow-800">
        <AlertCircle size={12} />
        Pass på
      </div>
      <div className="font-serif text-[14.5px] leading-snug">{body}</div>
    </div>
  );
}
```

- [ ] **Step 3: Implement PythonSnippet**

```tsx
export function PythonSnippet({ code }: { code: string }) {
  return (
    <div
      className="overflow-x-auto rounded-lg px-5 py-4"
      style={{ background: "var(--color-calc-bg)" }}
    >
      <pre className="m-0 font-mono text-[13px] leading-relaxed text-indigo-100">
        {code}
      </pre>
    </div>
  );
}
```

- [ ] **Step 4: Implement ToolCards**

```tsx
import { ArrowRight, Table2 } from "lucide-react";

export function ToolCards({ tools }: { tools: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {tools.map((t, i) => (
        <div
          key={i}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-paper-2 px-4 py-3 transition-colors hover:border-primary-2"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
            <Table2 size={18} />
          </div>
          <div className="flex-1">
            <div className="text-[13.5px] font-semibold text-ink">{t}</div>
          </div>
          <ArrowRight size={16} className="text-ink-4" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Implement RelatedPills**

```tsx
import { Link } from "react-router-dom";

const KIND_LABEL: Record<"entry" | "concept" | "table", string> = {
  entry: "distr.",
  concept: "konsept",
  table: "verktøy",
};

const KIND_ROUTE: Record<"entry" | "concept" | "table", string> = {
  entry: "entry",
  concept: "concept",
  table: "table",
};

interface RelatedItem {
  id: string;
  kind: "entry" | "concept" | "table";
  name: string;
}

export function RelatedPills({ related }: { related: RelatedItem[] }) {
  if (related.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {related.map((r) => (
        <Link
          key={`${r.kind}:${r.id}`}
          to={`/${KIND_ROUTE[r.kind]}/${r.id}`}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-transparent bg-primary-soft px-3 py-1.5 text-[13px] font-medium text-primary hover:border-primary-2"
        >
          {r.name} <small className="text-ink-3">({KIND_LABEL[r.kind]})</small>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Implement Pager**

```tsx
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagerEntry {
  id: string;
  name: string;
}

interface Props {
  prev?: PagerEntry;
  next?: PagerEntry;
}

export function Pager({ prev, next }: Props) {
  return (
    <div className="mt-12 flex justify-between gap-3 border-t border-line pt-7">
      {prev ? (
        <Link
          to={`/entry/${prev.id}`}
          className="flex-1 rounded-lg border border-line bg-card px-5 py-3.5 transition-colors hover:border-primary-2"
        >
          <div className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            <ChevronLeft size={11} />
            Forrige
          </div>
          <div className="mt-1 font-serif text-base font-semibold text-ink">
            {prev.name}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          to={`/entry/${next.id}`}
          className="flex-1 rounded-lg border border-line bg-card px-5 py-3.5 transition-colors hover:border-primary-2"
        >
          <div className="flex items-center justify-end gap-1 font-mono text-[11px] uppercase tracking-wider text-ink-3">
            Neste
            <ChevronRight size={11} />
          </div>
          <div className="mt-1 text-right font-serif text-base font-semibold text-ink">
            {next.name}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
```

- [ ] **Step 7: Run all tests, commit**

```bash
npm test
```
Expected: all 5 component tests pass.

```bash
git add src/components/detail/TrapAlert.tsx src/components/detail/PythonSnippet.tsx src/components/detail/ToolCards.tsx src/components/detail/RelatedPills.tsx src/components/detail/Pager.tsx src/components/detail/MiscDetail.test.tsx
git commit -m "feat: TrapAlert, PythonSnippet, ToolCards, RelatedPills, Pager"
```

---

### Task 28: EntryDetail page wires everything together

**Files:**
- Modify: `src/routes/EntryDetail.tsx`
- Create: `src/routes/EntryDetail.test.tsx`

- [ ] **Step 1: Implement EntryDetail**

```tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Info, Search, AlertTriangle, Pi, BarChart3, ClipboardList,
  FileText, AlertCircle, Code2, Table2, Link2,
} from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { HeroFormula } from "@/components/detail/HeroFormula";
import { RecognitionCues } from "@/components/detail/RecognitionCues";
import { SymbolGrid } from "@/components/detail/SymbolGrid";
import { PropertyCards } from "@/components/detail/PropertyCards";
import { StepByStep } from "@/components/detail/StepByStep";
import { ExampleCard } from "@/components/detail/ExampleCard";
import { DetailedSolution } from "@/components/detail/DetailedSolution";
import { TrapAlert } from "@/components/detail/TrapAlert";
import { PythonSnippet } from "@/components/detail/PythonSnippet";
import { ToolCards } from "@/components/detail/ToolCards";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { Pager } from "@/components/detail/Pager";
import { loadAllContent } from "@/data/loadContent";

export function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const entry = data.entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-screen-md p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen oppføring med id "{id}".
          </p>
          <Link to="/" className="text-primary-2 underline">
            Tilbake til søkeresultater
          </Link>
        </main>
      </div>
    );
  }

  // Resolve related items by name from current data
  const related = (entry.related ?? []).map((r) => {
    let name = r.id;
    if (r.kind === "entry")
      name = data.entries.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "concept")
      name = data.concepts.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "table")
      name = data.tables.find((x) => x.id === r.id)?.name_no ?? r.id;
    return { ...r, name };
  });

  // Pager: prev/next within the same `type` group
  const sameType = data.entries.filter((e) => e.type === entry.type);
  const idx = sameType.findIndex((e) => e.id === entry.id);
  const prev = idx > 0 ? sameType[idx - 1] : undefined;
  const next = idx >= 0 && idx < sameType.length - 1 ? sameType[idx + 1] : undefined;

  return (
    <div data-testid="entry-detail" className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[920px] bg-card px-14 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 py-1.5 text-[13px] font-medium text-primary-2 hover:text-primary"
          >
            ← Tilbake til søkeresultater
          </button>
          <div className="font-mono text-[12px] text-ink-3">
            Formler / {entry.category ?? entry.type} / {entry.name_no}
          </div>
        </div>

        <header className="mb-7 border-b-2 border-paper-2 pb-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="m-0 font-serif text-[38px] font-semibold leading-tight tracking-tight text-ink">
                {entry.name_no}
              </h1>
              <p className="mt-2 font-serif text-base italic text-ink-3">
                {entry.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="inline-block rounded-xl bg-indigo-100 px-2.5 py-0.5 text-[11px] font-medium text-indigo-800">
                {entry.type}
              </span>
            </div>
          </div>
        </header>

        <HeroFormula latex={entry.formula_latex} />

        <Section title="Hva den gjør" icon={Info}>
          <p className="m-0 font-serif text-base leading-relaxed text-ink">
            {entry.what_it_does}
          </p>
        </Section>

        <Section title="Slik gjenkjenner du den i en oppgave" icon={Search}>
          <RecognitionCues cues={entry.recognition_cues} />
        </Section>

        {entry.when_NOT_to_use && entry.when_NOT_to_use.length > 0 && (
          <Section title="IKKE bruk når" icon={AlertTriangle}>
            <RecognitionCues cues={entry.when_NOT_to_use} variant="warn" />
          </Section>
        )}

        {entry.symbols && (
          <Section title="Symboler" icon={Pi}>
            <SymbolGrid symbols={entry.symbols} />
          </Section>
        )}

        {entry.properties && (
          <Section title="Egenskaper" icon={BarChart3}>
            <PropertyCards properties={entry.properties} />
          </Section>
        )}

        {entry.solution_template && (
          <Section title="Steg for steg" icon={ClipboardList}>
            <StepByStep steps={entry.solution_template} />
          </Section>
        )}

        {entry.examples && (
          <Section title="Eksempler fra obliger og eksamener" icon={FileText}>
            {entry.examples.map((ex, i) => (
              <ExampleCard
                key={i}
                source={ex.source}
                excerpt={ex.excerpt}
                solutionSketch={ex.solution_sketch}
              />
            ))}
          </Section>
        )}

        {entry.detailed_solutions && (
          <Section title="Detaljerte oppgaveløsninger" icon={FileText}>
            {entry.detailed_solutions.map((s, i) => (
              <DetailedSolution key={i} solution={s} />
            ))}
          </Section>
        )}

        {entry.common_traps && (
          <Section title="Vanlige feller" icon={AlertCircle}>
            <TrapAlert body={entry.common_traps} />
          </Section>
        )}

        {entry.python_snippet && (
          <Section title="Python (scipy.stats)" icon={Code2}>
            <PythonSnippet code={entry.python_snippet} />
          </Section>
        )}

        {entry.tools && (
          <Section title="Verktøy / tabeller" icon={Table2}>
            <ToolCards tools={entry.tools} />
          </Section>
        )}

        {related.length > 0 && (
          <Section title="Relaterte oppføringer" icon={Link2}>
            <RelatedPills related={related} />
          </Section>
        )}

        <Pager
          prev={prev && { id: prev.id, name: prev.name_no }}
          next={next && { id: next.id, name: next.name_no }}
        />
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { EntryDetail } from "./EntryDetail";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/entry/:id" element={<EntryDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("EntryDetail", () => {
  it("renders the Poissonfordeling fixture in full", () => {
    renderAt("/entry/poisson-fordeling");
    expect(
      screen.getByRole("heading", { name: "Poissonfordeling" })
    ).toBeInTheDocument();
    expect(screen.getByText("Hva den gjør")).toBeInTheDocument();
    expect(screen.getByText("Slik gjenkjenner du den i en oppgave")).toBeInTheDocument();
    expect(screen.getByText("IKKE bruk når")).toBeInTheDocument();
    expect(screen.getByText("Symboler")).toBeInTheDocument();
    expect(screen.getByText("Egenskaper")).toBeInTheDocument();
    expect(screen.getByText("Steg for steg")).toBeInTheDocument();
    expect(screen.getByText("Eksempler fra obliger og eksamener")).toBeInTheDocument();
    expect(screen.getByText("Detaljerte oppgaveløsninger")).toBeInTheDocument();
    expect(screen.getByText("Vanlige feller")).toBeInTheDocument();
    expect(screen.getByText("Python (scipy.stats)")).toBeInTheDocument();
    expect(screen.getByText("Verktøy / tabeller")).toBeInTheDocument();
    expect(screen.getByText("Relaterte oppføringer")).toBeInTheDocument();
  });

  it("falls back to a not-found message for an unknown id", () => {
    renderAt("/entry/does-not-exist");
    expect(screen.getByText(/Fant ingen oppføring/)).toBeInTheDocument();
  });
});
```

Run `npm test`. Expected: passes.

- [ ] **Step 3: Verify in browser**

`npm run dev`. Visit `http://localhost:5173/#/entry/poisson-fordeling`. The full Poissonfordeling page should render with all sections in order.

- [ ] **Step 4: Commit**

```bash
git add src/routes/EntryDetail.tsx src/routes/EntryDetail.test.tsx
git commit -m "feat: EntryDetail page composes all detail components"
```

---

## Phase G — Concept and Tables

### Task 29: ConceptDetail page

**Files:**
- Modify: `src/routes/ConceptDetail.tsx`
- Create: `src/routes/ConceptDetail.test.tsx`

- [ ] **Step 1: Implement (lighter than EntryDetail)**

```tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { Info, Search, Link2, FileText } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { RecognitionCues } from "@/components/detail/RecognitionCues";
import { ExampleCard } from "@/components/detail/ExampleCard";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { loadAllContent } from "@/data/loadContent";

export function ConceptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const concept = data.concepts.find((c) => c.id === id);

  if (!concept) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-screen-md p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen konsept med id "{id}".
          </p>
          <Link to="/" className="text-primary-2 underline">
            Tilbake til søkeresultater
          </Link>
        </main>
      </div>
    );
  }

  const related = (concept.related ?? []).map((r) => {
    let name = r.id;
    if (r.kind === "entry")
      name = data.entries.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "concept")
      name = data.concepts.find((x) => x.id === r.id)?.name_no ?? r.id;
    if (r.kind === "table")
      name = data.tables.find((x) => x.id === r.id)?.name_no ?? r.id;
    return { ...r, name };
  });

  return (
    <div data-testid="concept-detail" className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[920px] bg-card px-14 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 py-1.5 text-[13px] font-medium text-primary-2"
          >
            ← Tilbake
          </button>
          <div className="font-mono text-[12px] text-ink-3">
            Konsepter / {concept.name_no}
          </div>
        </div>

        <header className="mb-7 border-b-2 border-paper-2 pb-5">
          <h1 className="m-0 font-serif text-[38px] font-semibold leading-tight tracking-tight text-ink">
            {concept.name_no}
          </h1>
          <p className="mt-2 font-serif text-base italic text-ink-3">
            {concept.tagline}
          </p>
        </header>

        <Section title="Hva det betyr" icon={Info}>
          <p className="m-0 whitespace-pre-line font-serif text-base leading-relaxed text-ink">
            {concept.what_it_means}
          </p>
        </Section>

        <Section title="Slik gjenkjenner du det" icon={Search}>
          <RecognitionCues cues={concept.recognition_cues} />
        </Section>

        {concept.examples && (
          <Section title="Eksempler" icon={FileText}>
            {concept.examples.map((ex, i) => (
              <ExampleCard
                key={i}
                source={ex.source}
                excerpt={ex.excerpt}
                solutionSketch={ex.solution_sketch}
              />
            ))}
          </Section>
        )}

        {related.length > 0 && (
          <Section title="Relaterte oppføringer" icon={Link2}>
            <RelatedPills related={related} />
          </Section>
        )}
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ConceptDetail } from "./ConceptDetail";

describe("ConceptDetail", () => {
  it("renders the Poissonprosess fixture", () => {
    render(
      <MemoryRouter initialEntries={["/concept/poisson-prosess"]}>
        <Routes>
          <Route path="/concept/:id" element={<ConceptDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "Poissonprosess" })
    ).toBeInTheDocument();
    expect(screen.getByText("Hva det betyr")).toBeInTheDocument();
    expect(screen.getByText("Slik gjenkjenner du det")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run, commit**

```bash
git add src/routes/ConceptDetail.tsx src/routes/ConceptDetail.test.tsx
git commit -m "feat: ConceptDetail page (lighter variant of entry detail)"
```

---

### Task 30: TableLookupWidget with jstat math

**Files:**
- Create: `src/components/tables/TableLookupWidget.tsx`
- Create: `src/components/tables/TableLookupWidget.test.tsx`
- Create: `src/components/tables/distributions.ts`
- Create: `src/components/tables/distributions.test.ts`

- [ ] **Step 1: Test the math layer first**

`src/components/tables/distributions.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { lookupCumulative, computeBonus } from "./distributions";

describe("lookupCumulative — poisson", () => {
  it("returns P(X ≤ 2) for μ = 1.68", () => {
    const v = lookupCumulative({ distribution: "poisson", inputs: { μ: 1.68, k: 2 } });
    expect(v).toBeCloseTo(0.7681, 3);
  });
  it("returns P(X = 0) when k = 0 in poisson", () => {
    const v = lookupCumulative({ distribution: "poisson", inputs: { μ: 1.68, k: 0 } });
    expect(v).toBeCloseTo(Math.exp(-1.68), 3);
  });
});

describe("lookupCumulative — binomial", () => {
  it("returns P(X ≤ 5) for n=10, p=0.5", () => {
    const v = lookupCumulative({
      distribution: "binomial",
      inputs: { n: 10, p: 0.5, k: 5 },
    });
    expect(v).toBeCloseTo(0.6230, 2);
  });
});

describe("computeBonus — poisson", () => {
  it("provides P(X = k) and P(X > k)", () => {
    const bonus = computeBonus({ distribution: "poisson", inputs: { μ: 1.68, k: 2 } });
    expect(bonus.find((b) => b.label.includes("="))?.value).toBeDefined();
    expect(bonus.find((b) => b.label.includes("≥"))?.value).toBeDefined();
  });
});
```

- [ ] **Step 2: Implement `distributions.ts`**

```ts
import jstat from "jstat";

export type DistributionKey =
  | "binomial"
  | "poisson"
  | "normal_cumulative"
  | "normal_quantile"
  | "t_quantile"
  | "chi_squared_quantile";

export interface LookupRequest {
  distribution: DistributionKey;
  inputs: Record<string, number>;
}

export function lookupCumulative({ distribution, inputs }: LookupRequest): number {
  switch (distribution) {
    case "poisson":
      return jstat.poisson.cdf(inputs.k, inputs.μ);
    case "binomial":
      return jstat.binomial.cdf(inputs.k, inputs.n, inputs.p);
    case "normal_cumulative":
      return jstat.normal.cdf(inputs.z, 0, 1);
    case "normal_quantile":
      // jstat normal.inv expects 1 - α (upper tail); the table convention is upper-tail α.
      return jstat.normal.inv(1 - inputs.α, 0, 1);
    case "t_quantile":
      return jstat.studentt.inv(1 - inputs.α, inputs.df);
    case "chi_squared_quantile":
      return jstat.chisquare.inv(1 - inputs.α, inputs.df);
  }
}

export interface BonusValue {
  label: string;
  value: string;
}

export function computeBonus({ distribution, inputs }: LookupRequest): BonusValue[] {
  if (distribution === "poisson") {
    const cdf = jstat.poisson.cdf(inputs.k, inputs.μ);
    const pmf = jstat.poisson.pdf(inputs.k, inputs.μ);
    return [
      { label: `P(X = ${inputs.k})`, value: `≈ ${pmf.toFixed(4)}` },
      {
        label: `P(X ≥ ${inputs.k + 1}) = 1 − P(X ≤ ${inputs.k})`,
        value: `≈ ${(1 - cdf).toFixed(4)}`,
      },
    ];
  }
  if (distribution === "binomial") {
    const cdf = jstat.binomial.cdf(inputs.k, inputs.n, inputs.p);
    const pmf = jstat.binomial.pdf(inputs.k, inputs.n, inputs.p);
    return [
      { label: `P(X = ${inputs.k})`, value: `≈ ${pmf.toFixed(4)}` },
      { label: `P(X ≥ ${inputs.k + 1})`, value: `≈ ${(1 - cdf).toFixed(4)}` },
    ];
  }
  return [];
}
```

- [ ] **Step 3: Run distribution tests, expect pass**

- [ ] **Step 4: Implement TableLookupWidget**

```tsx
import { useState } from "react";
import { Search } from "lucide-react";
import type { Table } from "@/data/schema";
import { lookupCumulative, computeBonus } from "./distributions";

interface Props {
  table: Table;
}

export function TableLookupWidget({ table }: Props) {
  const initial = Object.fromEntries(
    table.inputs.map((i) => [i.name, i.min ?? 0])
  );
  const [vals, setVals] = useState<Record<string, number>>(initial);

  const result = lookupCumulative({ distribution: table.distribution, inputs: vals });
  const bonuses = computeBonus({ distribution: table.distribution, inputs: vals });

  return (
    <div
      className="relative overflow-hidden rounded-xl border px-7 py-6 font-mono"
      style={{
        background: "linear-gradient(180deg, var(--color-calc-bg) 0%, #1a1745 100%)",
        borderColor: "var(--color-calc-border)",
        color: "var(--color-calc-text)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-7 -top-7 h-[180px] w-[180px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-calc-label)" }}
      >
        <Search size={12} className="mr-1.5 inline-block align-text-bottom" />
        Slå opp
      </div>
      <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {table.inputs.map((inp) => (
          <label key={inp.name} className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[12px] font-medium opacity-90">
              <span
                className="font-math text-base"
                style={{ color: "#c7d2fe" }}
              >
                {inp.name}
              </span>
            </span>
            <input
              type="number"
              value={vals[inp.name]}
              min={inp.min}
              max={inp.max}
              step={inp.type === "integer" ? 1 : "any"}
              onChange={(e) =>
                setVals((v) => ({ ...v, [inp.name]: Number(e.target.value) }))
              }
              className="rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-[15px] font-medium text-white focus:border-cyan focus:outline-none focus:bg-cyan/5"
            />
          </label>
        ))}
      </div>
      <hr
        className="my-4.5 border-0"
        style={{ height: 1, background: "var(--color-calc-divider)" }}
      />
      <div
        className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--color-calc-label)" }}
      >
        Resultat
      </div>
      <div
        className="text-[26px] font-bold tracking-wide"
        style={{ color: "var(--color-calc-result)" }}
      >
        {table.output} ≈ {result.toFixed(4)}
      </div>
      {bonuses.length > 0 && (
        <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {bonuses.map((b, i) => (
            <div
              key={i}
              className="rounded-r border-l-2 bg-white/5 px-3 py-2"
              style={{ borderColor: "#818cf8" }}
            >
              <div
                className="mb-1 font-mono text-[10px] uppercase tracking-wider"
                style={{ color: "var(--color-calc-label)" }}
              >
                {b.label}
              </div>
              <div className="text-[15px]">{b.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Test the widget**

`src/components/tables/TableLookupWidget.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TableLookupWidget } from "./TableLookupWidget";
import type { Table } from "@/data/schema";

const poissonTable: Table = {
  id: "E2-poisson-kumulativ",
  name_no: "Poissontabell",
  formal_name_no: "Kumulativ poissonfordeling",
  code: "E.2",
  description: "x",
  inputs: [
    { name: "μ", type: "number", min: 0.02, max: 20 },
    { name: "k", type: "integer", min: 0, max: 20 },
  ],
  output: "P(X ≤ k)",
  distribution: "poisson",
};

describe("TableLookupWidget", () => {
  it("renders inputs for each table input and shows a result", () => {
    render(<TableLookupWidget table={poissonTable} />);
    expect(screen.getByText("μ")).toBeInTheDocument();
    expect(screen.getByText("k")).toBeInTheDocument();
    expect(screen.getByText(/P\(X ≤ k\) ≈/)).toBeInTheDocument();
  });
});
```

Run `npm test`. Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add src/components/tables/distributions.ts src/components/tables/distributions.test.ts src/components/tables/TableLookupWidget.tsx src/components/tables/TableLookupWidget.test.tsx
git commit -m "feat: interactive TableLookupWidget driven by jstat distributions"
```

---

### Task 31: TableCard and Tables list view

**Files:**
- Create: `src/components/tables/TableCard.tsx`
- Modify: `src/routes/ListView.tsx` (add tables-tab branch)

- [ ] **Step 1: Implement TableCard**

```tsx
import type { Table } from "@/data/schema";

interface Props {
  table: Table;
  onClick: () => void;
}

export function TableCard({ table, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-line bg-card px-5 py-4 transition-all hover:border-primary-2 hover:shadow-md hover:shadow-primary-2/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 font-serif text-lg font-semibold leading-tight text-ink">
            {table.name_no}
          </h3>
          <div className="mt-0.5 font-mono text-[11.5px] tracking-wider text-ink-3">
            {table.formal_name_no}
          </div>
        </div>
        <span className="flex-shrink-0 rounded-md bg-primary-soft px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-primary">
          {table.code}
        </span>
      </div>
      <p className="m-0 font-serif text-[13.5px] leading-snug text-ink-3">
        {table.description}
      </p>
      <div className="flex flex-wrap gap-1.5 border-t border-dashed border-line pt-1.5">
        {table.inputs.map((i) => (
          <span
            key={i.name}
            className="rounded-xl bg-warn-soft px-2 py-0.5 font-mono text-[11px] text-amber-900"
          >
            {i.name}
          </span>
        ))}
        <span className="rounded-xl bg-paper-2 px-2 py-0.5 font-mono text-[11px] text-ink-2">
          → {table.output}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Modify ListView to render different content per tab**

Update the body of the `main` element in `src/routes/ListView.tsx` to switch on `tab`:

Replace the EntryTable block with:
```tsx
{tab === "formler" && (
  <>
    <SearchBox value={query} onChange={setQuery} placeholder="Søk i navn, symboler, kjennetegn, eksempler..." />
    {/* ...existing count + pills + EntryTable */}
    <EntryTable entries={filtered} onRowClick={(id) => navigate(`/entry/${id}`)} />
  </>
)}
{tab === "konsepter" && (
  <>
    <SearchBox value={query} onChange={setQuery} placeholder="Søk i konsepter..." />
    <p className="mb-4 text-[13px] text-ink-3">
      <strong className="mr-1 font-serif text-[17px] font-semibold text-ink">
        {data.concepts.length}
      </strong>
      konsepter
    </p>
    <ul className="m-0 grid list-none gap-2 p-0">
      {data.concepts.map((c) => (
        <li
          key={c.id}
          onClick={() => navigate(`/concept/${c.id}`)}
          className="cursor-pointer rounded-lg border border-line bg-card px-5 py-3.5 hover:border-primary-2"
        >
          <div className="font-serif text-base font-semibold text-ink">{c.name_no}</div>
          <div className="text-[13px] italic text-ink-3">{c.tagline}</div>
        </li>
      ))}
    </ul>
  </>
)}
{tab === "tabeller" && (
  <>
    <SearchBox value={query} onChange={setQuery} placeholder="Søk i tabeller... (prøv 'Z', 't', 'binomial')" />
    <div
      className="mb-4 rounded-r-md border-l-[3px] border-primary-2 bg-primary-soft px-3.5 py-2.5 font-serif text-[13px] text-primary"
    >
      Tabellene er interaktive. Klikk for å slå opp en verdi direkte.
    </div>
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {data.tables.map((t) => (
        <TableCard key={t.id} table={t} onClick={() => navigate(`/table/${t.id}`)} />
      ))}
    </div>
  </>
)}
```

Add the import: `import { TableCard } from "@/components/tables/TableCard";`

When tab is `konsepter` or `tabeller`, hide the `FilterSidebar` (or render a placeholder). Simplest: only render the sidebar in `formler` tab. Update grid:
```tsx
<div className={tab === "formler" ? "grid grid-cols-1 md:grid-cols-[280px_1fr]" : "grid grid-cols-1"}>
  {tab === "formler" && (
    <FilterSidebar ... />
  )}
  <main>...</main>
</div>
```

- [ ] **Step 3: Verify in browser**

`npm run dev`. Click each tab. Tabeller tab should show 1 table card.

- [ ] **Step 4: Commit**

```bash
git add src/components/tables/TableCard.tsx src/routes/ListView.tsx
git commit -m "feat: tables list view with TableCard grid"
```

---

### Task 32: PrintedTable + TableDetail page

**Files:**
- Create: `src/components/tables/PrintedTable.tsx`
- Modify: `src/routes/TableDetail.tsx`
- Create: `src/routes/TableDetail.test.tsx`

- [ ] **Step 1: Implement PrintedTable for Poisson**

```tsx
import jstat from "jstat";
import { clsx } from "clsx";

interface Props {
  distribution: "poisson" | "binomial";
  inputs: Record<string, number>;
}

// For now, only render a slice of the Poisson cumulative table around the input μ.
// Other distributions follow the same shape and are added later when their
// content is extracted (separate plan).
export function PrintedTable({ distribution, inputs }: Props) {
  if (distribution !== "poisson") {
    return (
      <p className="px-4 py-3 italic text-ink-3">
        Trykt tabell for denne fordelingen kommer i innholdsutvidelsen.
      </p>
    );
  }

  const μ = inputs.μ;
  const k = inputs.k;
  // Slice μ ±0.3 in 0.1 steps, k 0-7
  const μValues = [-3, -2, -1, 0, 1, 2, 3]
    .map((d) => Math.max(0.1, +(μ + d * 0.1).toFixed(2)))
    .filter((v, i, a) => a.indexOf(v) === i);
  const ks = [0, 1, 2, 3, 4, 5, 6, 7];

  const closestμ = μValues.reduce((a, b) =>
    Math.abs(b - μ) < Math.abs(a - μ) ? b : a
  );

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line bg-paper-2 px-5 py-3 text-[12px] text-ink-3">
        <span>Tabellverdier P(X ≤ k) for ulike μ og k</span>
        <span className="font-serif italic text-primary">
          Den markerte cellen matcher inputene over (μ ≈ {closestμ}, k = {k}).
        </span>
      </div>
      <table className="w-full border-collapse font-mono text-[12.5px] text-ink-2">
        <thead className="bg-paper-2">
          <tr>
            <th className="px-2.5 py-1.5 text-center text-[11px] font-semibold text-ink-3">
              μ ↓ &nbsp; k →
            </th>
            {ks.map((kv) => (
              <th
                key={kv}
                className={clsx(
                  "px-2.5 py-1.5 text-center text-[11px] font-semibold",
                  kv === k ? "bg-cyan text-ink" : "bg-primary-soft text-primary"
                )}
              >
                {kv}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {μValues.map((μv) => (
            <tr
              key={μv}
              className={clsx(
                "border-b border-line",
                μv === closestμ && "bg-primary-2/[0.04]"
              )}
            >
              <td
                className={clsx(
                  "bg-paper-2 px-2.5 py-1.5 text-center font-medium text-ink-3",
                  μv === closestμ && "bg-primary-soft font-bold text-primary"
                )}
              >
                {μv.toFixed(1)}
              </td>
              {ks.map((kv) => {
                const val = jstat.poisson.cdf(kv, μv);
                const isCell = μv === closestμ && kv === k;
                const isCol = kv === k;
                return (
                  <td
                    key={kv}
                    className={clsx(
                      "px-2.5 py-1.5 text-center",
                      isCell
                        ? "bg-cyan font-bold text-ink shadow-[inset_0_0_0_2px_var(--color-warn)]"
                        : isCol
                          ? "bg-primary-2/[0.04]"
                          : ""
                    )}
                  >
                    {val.toFixed(4).slice(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Implement TableDetail**

```tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Search, Table2, Link2 } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import { Section } from "@/components/detail/Section";
import { RelatedPills } from "@/components/detail/RelatedPills";
import { TableLookupWidget } from "@/components/tables/TableLookupWidget";
import { PrintedTable } from "@/components/tables/PrintedTable";
import { loadAllContent } from "@/data/loadContent";

export function TableDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = loadAllContent();
  const table = data.tables.find((t) => t.id === id);

  // Track inputs here too so PrintedTable can highlight the same row
  const initialInputs = Object.fromEntries(
    (table?.inputs ?? []).map((i) => [i.name, i.min ?? 0])
  );
  const [inputs, _setInputs] = useState<Record<string, number>>(initialInputs);

  if (!table) {
    return (
      <div className="min-h-screen bg-paper">
        <Banner />
        <main className="mx-auto max-w-screen-md p-12 text-center">
          <p className="font-serif text-2xl text-ink-2">
            Fant ingen tabell med id "{id}".
          </p>
          <Link to="/" className="text-primary-2 underline">
            Tilbake til søkeresultater
          </Link>
        </main>
      </div>
    );
  }

  const related = (table.related_entries ?? []).map((rid) => ({
    id: rid,
    kind: "entry" as const,
    name: data.entries.find((e) => e.id === rid)?.name_no ?? rid,
  }));

  return (
    <div data-testid="table-detail" className="min-h-screen bg-paper">
      <Banner />
      <article className="mx-auto max-w-[920px] bg-card px-14 py-8 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[13px] font-medium text-primary-2"
          >
            ← Tilbake til tabeller
          </button>
          <div className="font-mono text-[12px] text-ink-3">
            Tabeller / {table.name_no}
          </div>
        </div>

        <header className="mb-7 flex items-start justify-between gap-5 border-b-2 border-paper-2 pb-5">
          <div>
            <h1 className="m-0 font-serif text-[36px] font-semibold leading-tight text-ink">
              {table.name_no}
            </h1>
            <div className="mt-2 font-mono text-[13px] text-ink-3">
              {table.formal_name_no}
            </div>
            <p className="mt-2 font-serif text-base italic text-ink-3">
              {table.description}
            </p>
          </div>
          <span className="rounded-md bg-primary-soft px-2.5 py-1 font-mono text-[13px] font-semibold tracking-wider text-primary">
            {table.code}
          </span>
        </header>

        <Section title="Interaktivt oppslag" icon={Search}>
          <TableLookupWidget table={table} />
        </Section>

        <Section title="Trykt tabell" icon={Table2}>
          <PrintedTable
            distribution={
              table.distribution === "binomial" ? "binomial" : "poisson"
            }
            inputs={inputs}
          />
        </Section>

        {related.length > 0 && (
          <Section title="Brukes av disse formlene" icon={Link2}>
            <RelatedPills related={related} />
          </Section>
        )}
      </article>
    </div>
  );
}
```

NOTE: For now, the printed table reads its own inputs. A future enhancement (post-content-plan) will hoist input state up so the lookup widget and printed table share the same `μ` / `k` highlight live. Keep it like this for v1 structure.

- [ ] **Step 3: Test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { TableDetail } from "./TableDetail";

describe("TableDetail", () => {
  it("renders the Poissontabell fixture", () => {
    render(
      <MemoryRouter initialEntries={["/table/E2-poisson-kumulativ"]}>
        <Routes>
          <Route path="/table/:id" element={<TableDetail />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "Poissontabell" })
    ).toBeInTheDocument();
    expect(screen.getByText("Interaktivt oppslag")).toBeInTheDocument();
    expect(screen.getByText("Trykt tabell")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Verify in browser**

Visit `http://localhost:5173/#/table/E2-poisson-kumulativ`. Lookup widget computes a result. Printed table renders 7 rows of cumulative values.

- [ ] **Step 5: Commit**

```bash
git add src/components/tables/PrintedTable.tsx src/routes/TableDetail.tsx src/routes/TableDetail.test.tsx
git commit -m "feat: TableDetail page with interactive lookup + printed table"
```

---

## Phase H — Polish

### Task 33: Print stylesheet

**Files:**
- Create: `src/styles/print.css`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write print rules**

```css
@media print {
  /* Hide interactive shell */
  header,
  nav,
  [role="tablist"],
  aside,
  button {
    display: none !important;
  }

  /* Reset layout */
  html, body {
    background: white !important;
    color: black !important;
  }

  article {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Calc blocks: keep dark for legibility, but adjust if printer is grayscale */
  /* Browsers honor background-color print only when "Background graphics" is on */
  /* Hero formula and calc blocks already have data backgrounds, intentional */

  /* Avoid orphans/widows */
  h1, h2, h3 {
    page-break-after: avoid;
  }
  ul, ol, table {
    page-break-inside: avoid;
  }
}
```

- [ ] **Step 2: Import in global.css**

Add at the bottom of `src/styles/global.css`:
```css
@import "./print.css";
```

- [ ] **Step 3: Verify**

In the browser open Print Preview (Ctrl+P). The detail page should show without sidebar, banner, and buttons.

- [ ] **Step 4: Commit**

```bash
git add src/styles/print.css src/styles/global.css
git commit -m "feat: print stylesheet for paper-backup fallback"
```

---

### Task 34: Dark mode toggle (light-only stub for now)

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useTheme.test.ts`
- Modify: `src/components/shell/Banner.tsx`

The full dark-mode palette is significant work; for v1 we wire the toggle and persist it but only ship the light theme. Dark theme variables can be added in a later iteration without touching the toggle plumbing.

- [ ] **Step 1: Test the hook**

```ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  it("starts in light mode by default", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });
  it("toggles to dark and back", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("dark");
    act(() => result.current.toggle());
    expect(result.current.theme).toBe("light");
  });
  it("persists choice to localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
```

- [ ] **Step 2: Implement**

```ts
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (window.localStorage.getItem("theme") as Theme) ?? "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
  };
}
```

- [ ] **Step 3: Wire in Banner**

In `Banner.tsx`, replace:
```tsx
import { Moon } from "lucide-react";
```
with:
```tsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
```

In the component body, add:
```tsx
const { theme, toggle } = useTheme();
const Icon = theme === "light" ? Moon : Sun;
```

Replace the button to call `onClick={toggle}` and use `<Icon size={16} />`.

- [ ] **Step 4: Run all tests**

```bash
npm test
```
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/useTheme.test.ts src/components/shell/Banner.tsx
git commit -m "feat: theme toggle hook with localStorage persistence"
```

---

### Task 35: Final verification — typecheck, tests, build, smoke walkthrough

**Files:** none (manual checks only)

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```
Expected: 0 errors.

- [ ] **Step 2: Run all tests**

```bash
npm test
```
Expected: all green.

- [ ] **Step 3: Build**

```bash
npm run build
```
Expected: `dist/` produced. No errors.

- [ ] **Step 4: Preview built bundle**

```bash
npm run preview
```
Open the URL printed by the preview server.

- [ ] **Step 5: Manual walkthrough**

Verify each:
- [ ] `/` shows banner, three tabs, filter sidebar, search box, list with two entries.
- [ ] Click "Beregner" filter group → expands → tick "Sannsynlighet (eksakt)" → both entries still visible (both have it).
- [ ] Search "poisson" → only Poissonfordeling row remains.
- [ ] Click Poissonfordeling row → URL becomes `/#/entry/poisson-fordeling` → full page renders with all sections.
- [ ] Click a related pill (Poissonprosess) → URL becomes `/#/concept/poisson-prosess` → concept page renders.
- [ ] Click `Tabeller` tab → 1 table card visible → click → `/#/table/E2-poisson-kumulativ` opens with interactive widget computing a result and printed table.
- [ ] Toggle theme button — `data-theme="dark"` appears on `<html>` and persists across reloads.
- [ ] Open Print Preview — list view prints without sidebar/buttons/banner.
- [ ] Open `dist/index.html` directly with `file://` — site renders. (Some browsers require running it through `npx serve dist` to allow font loads; document if so.)

- [ ] **Step 6: Tag the structure release**

```bash
git tag v0.1.0-structure
git log --oneline | head -40
```

- [ ] **Step 7: Final commit (notes only, if applicable)**

If you found any small fixups during the walkthrough, commit them now. Otherwise no further commit.

---

## Self-review checklist (run before declaring complete)

- [ ] **Spec coverage:** every spec section corresponds to a task. Phase A covers tech stack + tokens (spec §4, §8). Phase B covers data model + filter taxonomy (spec §6). Phase C covers search/filter logic (spec §7.1). Phase D covers routing + banner. Phase E covers list view (spec §7.1). Phase F covers entry detail page (spec §7.2). Phase G covers concept and table pages (spec §7.3, §7.4). Phase H covers polish (spec §8 print, dark mode).
- [ ] **Out-of-scope items respected:** no UI editing, no auth, no mobile-first, no practice mode (spec §12).
- [ ] **Out-of-scope-for-this-plan items deferred:** content extraction is left for the next plan. Only test fixtures are checked in.
- [ ] **No placeholders:** no "TODO", "implement later", or fake-looking code blocks in the plan body.
- [ ] **Type consistency:** function signatures match across tasks (e.g. `applyFilters(items, selection)` in Task 8 is used the same way in Task 17).

---

## Out of scope for this plan (will be a separate plan)

- Real content extraction from past exams (jan25, mai25, jan26 + solutions) and obliger 1–7
- Real cumulative table data tables for E.1, E.3, E.4, E.5, E.6 (only E.2 has a working static table; others show a placeholder)
- Cross-input shared state between TableLookupWidget and PrintedTable (currently they each track their own state)
- A second example concept and additional formula entries
- Font subsetting for Norwegian glyphs only

These tasks build on top of the structure and will be planned and reviewed in a follow-up document at `docs/superpowers/plans/<later-date>-stat-compendium-content-batch-N.md`.
