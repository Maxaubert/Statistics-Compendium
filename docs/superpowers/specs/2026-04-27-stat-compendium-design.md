# Statistikk-kompendium — Design Spec

**Dato:** 2026-04-27
**Kurs:** ITD20218 Statistikk og statistisk programmering (HiØ, V26)
**Status:** Spec — venter på godkjenning før implementasjonsplan

---

## 1. Goal

Build a fully offline, searchable formula and concept compendium for the ITD20218 statistics exam. The compendium must let the user identify the correct formula based **only on what is visible in the exam question**, even for problem types they have never solved before, by filtering on observable characteristics (e.g. "with replacement", "rate given", "two outcomes per trial").

## 2. Non-goals (v1)

- No editing of entries from the UI. Authoring is done by editing YAML files in an editor; hot-reload picks up changes.
- No authentication, multi-user, or server-side functionality.
- No mobile-first design. The compendium is laptop-first (the exam is taken on a laptop). Layout stays usable down to ~1024px wide but is not optimized for phones.
- No exam-simulation, timing, or practice-problem mode.
- No backend search index or analytics.

## 3. Constraints

- **Offline.** Final build must run from `file://` or `npx serve dist` with no network calls. Exam rules permit local websites but not the internet.
- **Trustworthy content.** "Better extensive than narrow, but above all correct." Every formula and example traces to a primary source (past exam, oblig, or course handout) with citation. Schema validation runs at build time so a malformed entry fails the build.
- **Modular.** Adding, removing, or restructuring an entry must be a single-file edit. Adding a new metadata field must not break old entries.
- **Norwegian content, English schema.** All user-visible content matches the language of the exam (Norwegian: oppgave, sannsynlighet, forventningsverdi, etc.). Schema field names and filter taxonomy keys stay in English for development ergonomics.

## 4. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| UI framework | **React 18 + TypeScript** | Same as `dashboard-react` — known, productive |
| Build / dev server | **Vite** | `import.meta.glob` enables per-file YAML modularity without manual indexing; fast HMR for content authoring |
| Routing | **React Router v6** | Per-entry URL means multi-tab use during exam (open three formulas at once) |
| Math rendering | **KaTeX** | 5–10× faster than MathJax; matters when filter results show many formulas |
| Search | **Fuse.js** | Fuzzy matching tolerates typos and Norwegian word stems; weighted by field |
| Schema validation | **Zod** | Runtime validation with TypeScript-inferred types; fails build loudly on malformed entries |
| Icons | **lucide-react** | Tree-shaken SVG line icons; no emojis anywhere in the UI |
| Content format | **YAML per entry** | Hand-friendly for prose, multi-line text, comments; one file per entry maximizes modularity |
| Distribution | Static `dist/` folder | Runs from USB stick; no server required |

No external runtime dependencies beyond what is bundled at build time. No CDN font loading at runtime — fonts are bundled (see §10).

## 5. Repository Structure

```
stat-compendium/
├── content/
│   ├── entries/                   # Formler — one YAML per entry
│   │   ├── poisson-fordeling.yaml
│   │   ├── binomial-fordeling.yaml
│   │   ├── hypergeometrisk-fordeling.yaml
│   │   ├── to-utvalgs-t-test.yaml
│   │   └── ...
│   ├── concepts/                  # Konsepter — one YAML per concept
│   │   ├── poisson-prosess.yaml
│   │   ├── uten-tilbakelegging.yaml
│   │   └── ...
│   ├── tables/                    # Tabeller — config for E.1–E.6 lookup widgets
│   │   ├── E1-binomial-kumulativ.yaml
│   │   ├── E2-poisson-kumulativ.yaml
│   │   ├── E3-standardnormal.yaml
│   │   ├── E4-normal-kvantil.yaml
│   │   ├── E5-t-kvantil.yaml
│   │   └── E6-kjikvadrat-kvantil.yaml
│   └── filters.yaml               # Controlled vocabulary for the filter sidebar
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes/
│   │   ├── ListView.tsx           # / — list view with filter sidebar + tabs
│   │   ├── EntryDetail.tsx        # /entry/:id
│   │   ├── ConceptDetail.tsx      # /concept/:id
│   │   └── TableDetail.tsx        # /table/:id
│   ├── components/
│   │   ├── Banner.tsx
│   │   ├── TabBar.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── SearchBox.tsx
│   │   ├── EntryTable.tsx
│   │   ├── EntryRow.tsx
│   │   ├── detail/
│   │   │   ├── HeroFormula.tsx
│   │   │   ├── RecognitionCues.tsx
│   │   │   ├── SymbolGrid.tsx
│   │   │   ├── PropertyCards.tsx
│   │   │   ├── StepByStep.tsx
│   │   │   ├── ExampleCard.tsx
│   │   │   ├── DetailedSolution.tsx     # The dark-indigo calc block
│   │   │   ├── TableLookupCallout.tsx
│   │   │   ├── PythonSnippet.tsx
│   │   │   ├── ToolCards.tsx
│   │   │   └── RelatedPills.tsx
│   │   └── tables/
│   │       ├── BinomialLookup.tsx
│   │       ├── PoissonLookup.tsx
│   │       └── ...
│   ├── data/
│   │   ├── loadContent.ts         # import.meta.glob('content/**/*.yaml') aggregator
│   │   ├── schema.ts              # Zod schemas for Entry, Concept, Table, Filters
│   │   └── search.ts              # Fuse.js index builder
│   ├── styles/
│   │   ├── tokens.css             # CSS custom properties (colors, spacing, fonts)
│   │   ├── global.css
│   │   └── theme-dark.css
│   └── utils/
│       └── katex.ts               # KaTeX renderer wrapper
├── public/
│   └── fonts/                     # Self-hosted Inter, Source Serif 4, JetBrains Mono
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-27-stat-compendium-design.md   # this file
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 6. Data Model

### 6.1 Entry schema (Formler)

Every formula entry is one YAML file. All Norwegian content. Schema keys in English.

```yaml
id: poisson-fordeling
name_no: Poissonfordeling
type: distribution                 # distribution | test | regression | identity | rule | combinatorics
category: discrete_distribution
tagline: Antall hendelser i et tidsvindu, gitt en konstant rate.

formula_main: "P(X = k) = e^(-λt) · (λt)^k / k!"
formula_latex: "P(X = k) = \\frac{e^{-\\lambda t}(\\lambda t)^k}{k!}"

what_it_does: |
  Modellerer antall uavhengige hendelser som inntreffer med konstant rate
  i et fast tidsvindu eller område.

why_use: |
  Naturlig valg når hendelsene "kommer som de kommer" og det ikke finnes
  noen forhåndsbestemt øvre grense for antallet.

recognition_cues:
  - Oppgaven nevner "Poissonprosess" eller "rate λ pr. [tidsenhet]"
  - Du teller hendelser i et fast tidsvindu eller område
  - Hendelser inntreffer uavhengig og kontinuerlig over tid eller rom
  - Spørsmålet ber om "nøyaktig k", "minst k", "ingen", eller "høyst k"
  - Ikke fast antall forsøk

when_NOT_to_use:
  - "Fast antall n forsøk er gitt → bruk binomial i stedet"
  - "Spørsmålet handler om tid TIL første hendelse → bruk eksponentialfordeling"
  - "Trekker uten tilbakelegging fra endelig pott → bruk hypergeometrisk"

symbols:
  - sym: "λ"
    means: "rate (gjennomsnittlig antall hendelser pr. tidsenhet)"
  - sym: "t"
    means: "lengden på vinduet"
  - sym: "λt"
    means: "forventet antall hendelser i vinduet (ofte μ)"
  - sym: "k"
    means: "antallet det spørres om"
  - sym: "e"
    means: "Eulers tall ≈ 2.71828"

properties:
  expected_value: "E[X] = λt"
  variance: "Var[X] = λt"
  std_dev: "σ = √(λt)"

filters:
  computes: [exact_probability, at_least_k, at_most_k, none_event]
  random_variable: [discrete_count]
  setup: [single_population, events_in_window]
  structural_cues: [rate_given, process_over_time, no_fixed_trials, independent_events]
  parameters_known: [rate_lambda, window_size]
  distribution_assumption: [poisson]
  tooling: [cumulative_poisson_table_E2, calculator_exp]

solution_template:
  - Identifiser raten λ og enheten den er gitt i
  - Identifiser vinduets størrelse t i samme enhet
  - Regn ut μ = λt
  - Bestem hva spørsmålet ber om
  - For "minst" eller "ingen" — bruk komplementregelen med tabell E.2
  - Slå opp P(X ≤ k) i tabell E.2 eller regn direkte med formelen

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

detailed_solutions:
  - source: "Eksamen jan26 · oppgave 4a"
    question: "Klippeblåvinger fanges som en poissonprosess med rate λ = 0.01 sommerfugler pr. time..."
    sections:
      - label: "Identifisering"
        lines:
          - "X ~ Poisson(λt)"
          - { comment: "spørres om P(X = 0)" }
      - label: "Formel"
        lines:
          - "P(X = k) = e^(-λt) · (λt)^k / k!"
      - label: "Innsatt"
        lines:
          - "μ = λt = 0.01 · 168 = 1.68"
          - "P(X = 0) = e^(-1.68) · (1.68)^0 / 0!"
          - { indent: "= e^(-1.68) · 1 / 1" }
          - { indent: "= e^(-1.68)" }
    result: "P(X = 0) ≈ 0.186"

  - source: "Eksamen jan26 · oppgave 4b"
    question: "Hva er sannsynligheten for at det er minst tre klippeblåvinger i fellen?"
    sections:
      - label: "Komplementregelen"
        lines: ["P(X ≥ 3) = 1 − P(X ≤ 2)"]
      - label: "Innsatt"
        lines:
          - "μ = λt = 0.01 · 168 = 1.68"
          - { table_lookup: { ref: "E.2", text: "Slå opp P(X ≤ 2) → 0.7681" } }
          - "P(X ≥ 3) = 1 − 0.7681"
    result: "P(X ≥ 3) ≈ 0.232"

related:
  - { id: "poisson-prosess", kind: "concept" }
  - { id: "eksponential-fordeling", kind: "entry" }
  - { id: "binomial-fordeling", kind: "entry" }
  - { id: "E2-poisson-kumulativ", kind: "table" }

tools:
  - "Tabell E.2 — Kumulativ poissonfordeling"
  - "Kalkulator: e^x, k!"
```

### 6.2 Concept schema (Konsepter)

A concept is a recognition pattern (e.g. Poissonprosess, joint distribution, without-replacement sampling). It has a lighter shape than a formula entry — no `formula_main`, no `properties`, no `python_snippet`.

```yaml
id: poisson-prosess
name_no: Poissonprosess
type: concept
tagline: En tellestrøm med konstant rate og uavhengige hendelser.
what_it_means: |
  En stokastisk prosess der hendelser inntreffer ...
recognition_cues: [...]
related: [...]
filters: [...]                     # subset of the entry filter dimensions
```

### 6.3 Table schema (Tabeller)

Each appendix table is a small config for an interactive lookup widget plus a static rendering of the printed table for verification.

```yaml
id: E2-poisson-kumulativ
name_no: "E.2 — Kumulativ poissonfordeling"
description: "Tabellen viser P(X ≤ k) for ulike μ og k."
inputs:
  - { name: "μ", type: number, min: 0.02, max: 20, step: any }
  - { name: "k", type: integer, min: 0, max: 20 }
output: "P(X ≤ k)"
data_file: "tables/E2-poisson-kumulativ.json"   # raw table values for lookup + static render
related_entries: [poisson-fordeling]
```

### 6.4 Filters file (`content/filters.yaml`)

The single source of truth for the filter sidebar. Adding a new filter value is one edit here.

```yaml
dimensions:
  - key: computes
    label_no: Beregner
    options:
      - { key: exact_probability, label_no: "Sannsynlighet (eksakt)" }
      - { key: at_least_k, label_no: '"Minst k" / "høyst k"' }
      - { key: expected_value, label_no: "Forventningsverdi" }
      - { key: std_dev, label_no: "Standardavvik / varians" }
      - { key: confidence_interval, label_no: "Konfidensintervall" }
      - { key: prediction_interval, label_no: "Prediksjonsintervall" }
      - { key: hypothesis_test, label_no: "Hypotesetest" }
      - { key: correlation, label_no: "Korrelasjon" }
      - { key: combinatorial_count, label_no: "Kombinatorisk telling" }
  - key: random_variable
    label_no: Tilfeldig variabel
    options: [discrete_count, continuous, time_until_event, sum_of_samples, mean_of_samples, difference_of_means, proportion, slope_estimate]
  - key: setup
    label_no: Oppsett
    options: [with_replacement, without_replacement, single_sample, two_independent_samples, paired_samples, joint_table_given, events_in_window, finite_pool, fixed_n_trials, trials_until_event]
  - key: structural_cues
    label_no: "Kjennetegn i oppgaven"
    options: [rate_given, two_outcomes_per_trial, success_probability_given, mean_and_sd_given, normal_assumed, disjoint_events, independent_events, conditional_given, linear_relationship_suspected, process_over_time]
  - key: parameters_known
    label_no: "Parametre kjent"
    options: [population_variance_known, population_variance_unknown, mean_known, sample_size_small_lt30, sample_size_large, rate_lambda, success_p, slope_se, residual_variance]
  - key: distribution_assumption
    label_no: "Fordeling antatt"
    options: [binomial, poisson, hypergeometric, geometric, negative_binomial, normal, exponential, uniform, t_distribution, chi_squared, none_assumed]
  - key: tooling
    label_no: "Verktøy / tabell"
    options: [cumulative_binomial_table_E1, cumulative_poisson_table_E2, standard_normal_table_E3, normal_quantile_table_E4, t_quantile_table_E5, chi_square_quantile_table_E6, calculator_only]
```

(Each leaf option also gets a `label_no` in practice — abbreviated above.)

### 6.5 Validation

Zod schemas live in `src/data/schema.ts`. The build pipeline (`vite build`) imports every YAML file via `import.meta.glob`, validates each through Zod, aggregates into an in-memory index, and fails with a precise file/line error if any entry is malformed. New schema fields are declared `.optional()` by default so existing entries stay valid.

## 7. UX & Layout

### 7.1 List view (`/`)

```
┌─ Banner ─────────────────────────────────────────────────────────┐
│  σ  Statistikk-kompendium                              [moon]    │
└──────────────────────────────────────────────────────────────────┘
┌─ Sidebar ──────┬─ Main ─────────────────────────────────────────┐
│ Filter         │ [ Formler 47 ] [ Konsepter 18 ] [ Tabeller 6 ] │
│ ▼ Beregner     │ ┌────────────────────────────────────────────┐ │
│   ☑ ...        │ │ 🔍  Søk i navn, symboler, kjennetegn... │Ctrl+K│
│ ▼ Tilfeldig var│ └────────────────────────────────────────────┘ │
│   ☑ Diskret    │  3 treff av 47    [Sannsynlighet ×]  [...]     │
│ ▶ Oppsett      │ ┌──────────────────────────────────────────────┐ │
│ ▶ Kjennetegn   │ │ Navn        | Type    | Beregner  | Kjennet  │ │
│ ▶ Param. kjent │ │ Binomial... | distrib.| P(X = k)  | Fast n   │ │
│ ▶ Fordeling    │ │ Poisson...  | distrib.| P(X = k)  | Rate     │ │
│ ▶ Verktøy      │ │ ...                                          │ │
└────────────────┴──────────────────────────────────────────────────┘
```

- **Banner**: deep indigo gradient, σ logo glyph in serif italic, title in Source Serif, theme toggle on the right. No course chip, no dropdowns.
- **Sidebar**: collapsible filter groups. Each option shows match count badge. Options that would yield zero matches are dimmed but still clickable. Multi-select within a group; AND across groups.
- **Tabs**: three tabs (Formler / Konsepter / Tabeller) replace what would otherwise be a dropdown. Each shows total count.
- **Search bar**: full-width, top of main pane. Ctrl+K shortcut. ANDs with active filters. Searches across `name_no`, `tagline`, `recognition_cues`, `symbols`, `examples[].excerpt`. Field weighting in Fuse.js: name = 1.0, tagline = 0.7, recognition_cues = 0.6, examples = 0.4.
- **Active filter pills** below the count line, click × to remove.
- **Result table**: columns Navn / Type / Beregner / Kjennetegn / arrow. Whole row clickable, navigates to detail page.

### 7.2 Detail page (`/entry/:id`)

The full sequence (in this order, top to bottom):

1. **Toolbar** — "Tilbake til søkeresultater" link on left, breadcrumb on right (`Formler / [category] / [name]`).
2. **Header** — h1 (Source Serif, ~38px), italic tagline, type badges floated right.
3. **Hero formula** — dark indigo card, formula in `Cambria Math` serif, label "HOVEDFORMEL" in monospace.
4. **Hva den gjør** — single paragraph in serif prose.
5. **Slik gjenkjenner du den i en oppgave** — `recognition_cues` rendered as cue-list items (indigo dot bullets, light bg).
6. **IKKE bruk når** — `when_NOT_to_use` rendered as warn-cue list (amber dot bullets, amber bg).
7. **Symboler** — two-column grid, math glyph in primary indigo on the left, meaning text on the right.
8. **Egenskaper** — three property cards (E[X], Var[X], σ).
9. **Steg for steg** — numbered list with circular indigo step counters.
10. **Eksempler fra obliger og eksamener** — short example cards: source, italic excerpt, one-line solution sketch.
11. **Detaljerte oppgaveløsninger** — for each example, a light header card (source + question) followed by a dark indigo calc block:
    - Section labels (`FORMEL`, `INNSATT`, `RESULTAT`, etc.) in soft indigo monospace uppercase.
    - Body lines in light indigo monospace.
    - Comments in muted slate, italic.
    - **Table lookups** rendered as light-indigo-bordered callouts inside the dark block (visually distinct from both the result and the body lines).
    - **Result** rendered as bold cyan text only — no border, no background box. (Same role as the amber result in `dashboard-react`'s calculator, but the project accent here is cyan instead of gold.)
12. **Vanlige feller** — yellow alert box.
13. **Python (scipy.stats)** — code snippet in indigo block with simple syntax highlighting.
14. **Verktøy / tabeller** — clickable cards linking to the relevant interactive lookup widgets.
15. **Relaterte oppføringer** — pill-style links to other entries / concepts / tables.
16. **Pager** — "Forrige / Neste" buttons that flip through the same filter-and-sort order from the list view.

### 7.3 Concept detail page

Same structural rhythm but trims sections that don't apply: no hero formula, no properties, no Python snippet, no Steg for steg. Concepts are recognition-pattern entries; their main payload is recognition cues + examples + cross-references.

### 7.4 Table detail page

Top: interactive lookup widget (input fields, live result). Below: static rendering of the printed table for verification, with the lookup row highlighted as the inputs change.

## 8. Visual Design System

### 8.1 Type scale

| Use | Font | Weight | Size |
|---|---|---|---|
| h1 (entry title) | Source Serif 4 | 600 | 38px |
| h2 (section) | Source Serif 4 | 600 | 13px / uppercase / letter-spacing 0.1em |
| Tagline | Source Serif 4 italic | 400 | 16px |
| Body prose | Source Serif 4 | 400 | 15–16px / line-height 1.65 |
| UI sans | Inter | 400/500/600 | 11–14px |
| Math | Cambria Math, STIX Two Math, fallback serif | 400/500 | 14–30px |
| Mono / labels / counts | JetBrains Mono | 400/600 | 10–14px |

Fonts are self-hosted in `public/fonts/` and loaded via `@font-face` to satisfy the offline constraint. Fallback to system fonts if a font fails to load.

### 8.2 Color tokens

```css
--ink:       #1c1917;   /* primary text */
--ink-2:     #44403c;   /* secondary text */
--ink-3:     #78716c;   /* muted text */
--ink-4:     #a8a29e;   /* disabled / placeholder */
--paper:     #fafaf7;   /* page background */
--paper-2:   #f5f5f0;   /* surface 2 */
--card:      #ffffff;   /* elevated surface */
--line:      #e7e5e4;   /* hairline border */
--line-2:    #d6d3d1;   /* stronger border */

--primary:   #312e81;   /* indigo-900, deep accent */
--primary-2: #4338ca;   /* indigo-700, primary action */
--primary-3: #6366f1;   /* indigo-500, hover */
--primary-soft: #eef2ff;

--cyan:          #22d3ee;   /* cyan-400, primary accent for highlights/results */
--cyan-2:        #06b6d4;   /* cyan-500, hover/active */
--cyan-soft:     #cffafe;   /* cyan-100, soft surface */
--cyan-deep:     #0e7490;   /* cyan-700, text on cyan surfaces */

--warn:          #b45309;   /* amber-700, reserved for warning context only */
--warn-soft:     #fef3c7;   /* amber-100, warning surface only */

/* Calc block (dark indigo, matches Python code block) */
--calc-bg:        #1e1b4b;
--calc-border:    #3730a3;
--calc-divider:   rgba(165, 180, 252, 0.18);
--calc-label:     #818cf8;
--calc-text:      #e0e7ff;
--calc-comment:   #94a3b8;
--calc-result:    #22d3ee;   /* cyan result text only — no box */
--calc-lookup-bg:     rgba(165, 180, 252, 0.08);
--calc-lookup-border: #a5b4fc;   /* indigo-300, distinct from result */
--calc-lookup-text:   #c7d2fe;
--calc-lookup-label:  #a5b4fc;
```

**Color roles** (important — these are NOT interchangeable):

- **Cyan (`--cyan` / `--calc-result`)** — used for *answers and highlights*: the result line in a calc block, focused input borders, the highlighted cell in a printed-table view, the cyan glow on the banner and hero formula card.
- **Warn amber (`--warn` / `--warn-soft`)** — used *only* for warning context: "IKKE bruk når" cue list, "Vanlige feller" alert box. Conventional warn semantics; does not appear elsewhere.
- **Indigo light (`#a5b4fc`)** — used for *secondary callouts inside calc blocks*: table-lookup callouts, bonus-value boxes. Distinct from both cyan result and indigo body text.

A dark theme inverts the neutral palette while keeping the indigo / cyan accents identical. The calc block always uses its own dark indigo regardless of theme — it functions like a code block.

### 8.3 Iconography

All icons are line-art SVGs from `lucide-react`. No emojis anywhere in the UI. Specific assignments:

| Where | Icon |
|---|---|
| Theme toggle | `moon` (or `sun` in dark mode) |
| Tab: Formler | `sigma` |
| Tab: Konsepter | `lightbulb` |
| Tab: Tabeller | `table-2` |
| Search input | `search` |
| Row arrow | `arrow-right` |
| Section: Hva den gjør | `info` |
| Section: IKKE bruk når | `alert-triangle` |
| Section: Symboler | `pi` (or similar) |
| Section: Eksempler / detaljerte løsninger | `file-text`, `file-text-2` |
| Source label icon | `book-open` |
| Verktøy card icon | `table-2`, `calculator` |
| Pager prev/next | `chevron-left`, `chevron-right` |

The σ in the banner brand mark is **not** an icon — it is a typographic Greek-letter glyph rendered in italic Source Serif, used as a logomark.

## 9. Content Sourcing

I (the assistant) will extract entries from the user's course materials, draft them in the YAML schema, and submit each batch for the user's review. Entries land in `content/` only after review.

**Primary sources:**
- 3 past exams + their solutions (`statistikk_eksamen_jan25/mai25/jan26.pdf` + `_losning.pdf`)
- 7 øvinger (`statistikk_oving1_v26.pdf` through `statistikk_oving7_v26.pdf`) plus solutions for 1–6
- `bootstrapping.pdf` — course handout
- `hypotesetest_oversikt.pdf` — course handout
- `Oblig_1` — student's own work, reference for Python conventions

**Estimated v1 corpus:** ~30–60 formula entries, ~10–20 concept entries, 6 interactive table widgets.

**Reviewing flow:** I produce a batch of, say, 5–10 entries → user reviews → corrections → next batch. The user keeps edit access throughout, so any wrong recognition_cue or example excerpt can be fixed in place. Build-time Zod validation prevents structural breakage.

## 10. Build & Distribution

- `npm run dev` — Vite dev server with hot reload over the YAML content. Edit a `recognition_cue`, see it update live.
- `npm run typecheck` — TypeScript + Zod schema validation as a pre-commit gate. Mirrors `dashboard-react` workflow.
- `npm run build` — produces `dist/` containing static HTML/CSS/JS plus self-hosted fonts. No external network references.
- `npx serve dist` (or just opening `dist/index.html` in a browser) — runs the built app fully offline. USB-stick deployable.
- A printable stylesheet (`@media print`) renders the active filtered list and any open detail page on plain paper, as a paper-backup fallback if the laptop dies during the exam.

## 11. Open Questions

The following do not block writing the implementation plan but need answers before content extraction begins in earnest:

1. **Exam date** — drives content prioritization. If <2 weeks out, narrow v1 to "one exam fully extracted + scaffolding"; if >1 month out, extract all 3 exams + all øvinger.
2. **First batch priority** — which past exam should I draft entries from first? Default proposal: jan26 (most recent), then mai25, then jan25, then øvinger by number.

## 12. Out of Scope (Explicitly)

- Editing entries from the UI.
- Authentication, user accounts.
- Mobile-optimized layout (laptop-first; layout works down to ~1024px).
- Cross-course content (other than ITD20218).
- Server-side anything; no backend.
- Practice / quiz / timed exam mode.
- LLM-driven assistance at runtime.
- Localization beyond Norwegian.

---

## Approval gate

After the user reviews this spec, the next step is to invoke the **writing-plans** skill to produce an implementation plan that turns this design into ordered, testable tasks.
