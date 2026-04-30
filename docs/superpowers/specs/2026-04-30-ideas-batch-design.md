# Ideas-Batch Design

**Date:** 2026-04-30
**Goal:** Implement the 10 ideas the user picked from `ideas.md` (A5, A9, B1, B3, B4, B5, B7, B9, C1, C5) as a coherent feature batch on top of the existing structure.

## Scope

### In scope
| ID  | Idea                              | Effort   | Approach |
|-----|-----------------------------------|----------|----------|
| A5  | Visible "Clear filters" button    | Trivial  | Replace text link with prominent button at sidebar top |
| A9  | Full dark-mode palette            | Medium   | Add `[data-theme="dark"]` overrides for all tokens; verify across views |
| C1  | Chi-squared entries (×3)          | Medium   | New YAML files using existing `EntrySchema` |
| B4  | Symbol table page                 | Medium   | Derived view: aggregate `symbols[]` across entries; new route `/symboler` |
| B3  | Glossary / ordliste               | Medium   | New content type `GlossarySchema`; ~40 terms; new route `/ordliste` |
| B9  | Cheat-sheet / compact view        | Medium   | Derived view: render all entries compactly; new route `/cheatsheet`, print-friendly |
| B5  | Common task patterns catalog      | Medium   | New content type `PatternSchema`; ~12 patterns; new route `/monstre` |
| B1  | Distribution wizard               | Medium   | New content type `WizardNodeSchema` (decision tree); new route `/veiviser` |
| B7  | Distribution shape thumbnails     | Smaller  | Scope-cut version: static SVG shapes per distribution rendered on relevant entry pages — no interactivity |
| C5  | Step-by-step templates            | Smaller  | Most entries already have `solution_template` — add a "Mal-modus" toggle on entry pages that highlights the template steps as fill-in slots |

### Out of scope
- Full interactive distribution visualizers (B7's original "drag μ and σ" version) — replaced with static thumbnails. Rationale: drag-interactive widgets add a lot of code for a feature you'd use mostly while studying, not during the 4-hour exam. The static thumbnails give the visual recognition value at a fraction of the cost.

## Architecture

### New content types
Three new schemas in `src/data/schema.ts`:

```ts
export const GlossaryTermSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term_no: z.string(),
  short_def: z.string(),     // one-liner
  long_def: z.string().optional(), // panic-mode paragraph
  see_also: z.array(RelatedRefSchema).optional(),
});

export const PatternSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name_no: z.string(),       // "Du har en rate og spørs sannsynlighet for k hendelser"
  cue: z.string(),            // the recognition signal
  procedure: z.array(z.string()),  // ordered steps
  entry_refs: z.array(z.string()), // entry ids this pattern uses
  example: z.string().optional(),
});

export const WizardNodeSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.object({
    label: z.string(),
    next: z.string().optional(),       // next node id
    leads_to: z.array(RelatedRefSchema).optional(), // terminal: list entries/concepts
  })),
});

export const WizardSchema = z.object({
  start: z.string(),
  nodes: z.array(WizardNodeSchema),
});
```

### File layout
```
content/
  glossary/        # ~40 yaml files
  patterns/        # ~12 yaml files
  wizard.yaml      # single decision tree (one file, not per-node)
  entries/
    kjikvadrat-goodness-of-fit.yaml      # C1
    kjikvadrat-uavhengighet.yaml          # C1
    ki-varians.yaml                        # C1

src/
  components/
    glossary/
      GlossaryList.tsx
    patterns/
      PatternCard.tsx
    wizard/
      WizardStep.tsx
    detail/
      DistributionThumbnail.tsx           # B7 SVG thumbnails
      TemplateMode.tsx                    # C5 toggle
  routes/
    Cheatsheet.tsx                        # B9
    Glossary.tsx                          # B3
    SymbolTable.tsx                       # B4
    Patterns.tsx                          # B5
    Wizard.tsx                            # B1
  data/
    loadContent.ts                        # extend with new types
    schema.ts                              # extend with new schemas
```

### Routes
```
/                    list view (existing)
/entry/:id          existing
/concept/:id        existing
/table/:id          existing
/cheatsheet         B9 — compact all-in-one view, print-friendly
/symboler           B4 — symbol reference
/ordliste           B3 — glossary
/monstre            B5 — patterns catalog
/monstre/:id        single pattern detail
/veiviser           B1 — wizard
```

### Banner navigation
Add a secondary navigation strip below the banner row 1 (logo + theme toggle), keeping the main 3 tabs (Formler/Konsepter/Tabeller) on the list view itself. The strip:
```
[Veiviser]  [Ordliste]  [Symboler]  [Mønstre]  [Cheat-sheet]
```
visible from any page, lucide icons + Norwegian labels.

### Dark mode (A9)
In `tokens.css`, add a `[data-theme="dark"]` rule scope that overrides every relevant variable. Strategy: invert the lightness of neutrals (paper → near-black, ink → near-white), keep the indigo accents but bump them brighter, mute the warns. Test on entry detail, list view, table detail.

The Calc block tokens stay roughly the same (already dark indigo) but the surrounding card background flips.

### Clear-filters button (A5)
Replace the small "Nullstill" text link in the FilterSidebar header with a full-width pill button shown only when filters are active:
```
┌─────────────────────────────┐
│  ✕  Nullstill alle filtere  │
└─────────────────────────────┘
```
Same placement, less hunting.

### Distribution thumbnails (B7 scoped down)
Six tiny SVG components, one per distribution shape:
- `PoissonShape` — bars dropping off
- `BinomialShape` — symmetric bars
- `NormalShape` — bell curve
- `TShape` — heavier-tailed bell
- `ChiSquaredShape` — right-skewed
- `ExponentialShape` — exponential decay

Render at 100×60 px next to the formula on the entry detail page when entry's `distribution_assumption` filter matches.

### Template mode (C5)
On entry pages with `solution_template`, add a toggle "📝 Mal-modus" that visually transforms the template steps from prose into fill-in slots: each step gets a numbered card, blank-line space below each step, prints cleanly. Print CSS adjusts accordingly so the user can print blank templates and use them on paper.

## Content authoring (the bulk of work)

### Chi-squared entries (3 entries)
Need to fit existing schema. Format: distribution-style entries with formulas, recognition cues, examples. Source from typical pensum on chi-squared tests.

### Glossary terms (target ~40)
Pull from concept names + key terms in entries: punktestimat, signifikansnivå, p-verdi, frihetsgrader, type-1-feil, type-2-feil, kraft, kovarians, korrelasjon, kvantil, kumulativ, marginalfordeling, simultanfordeling, betinget, joint, varians, standardavvik, std.feil, residual, beta-koeffisient, alfa, intercept, gjennomsnitt, median, modus, sentralgrenseteoremet, normalisering, KI, prediksjonsintervall, kvartil, korrelasjon, regresjon, hypotese, nullhypotese, alternativhypotese, observatortest, kritisk verdi, forkastningsområde, etc.

### Patterns (target ~12)
- "Rate gitt, spørs P(k hendelser i vindu)" → poisson-fordeling
- "Fast n forsøk, p gitt, spørs P(k suksesser)" → binomial-fordeling
- "Trekker uten tilbakelegging fra endelig pott" → hypergeometrisk
- "Tid til første hendelse, rate gitt" → eksponential
- "Normal antatt, σ kjent, KI for μ" → ki-mu-kjent-sigma
- "Normal antatt, σ ukjent, KI for μ" → ki-mu-ukjent-sigma
- "Test om μ = μ₀, σ ukjent" → en-utvalg-t-test
- "Test om p = p₀, stort n" → en-utvalg-z-test-andel
- "Lineær sammenheng (x, y), estimer linje" → regresjon-estimat-alpha-beta
- "Test om β = 0" → regresjon-test-stigningstall
- "Joint table gitt, finn marginal" → marginalfordeling
- "Joint table gitt, beregn kovarians" → kovarians

### Wizard (decision tree)
Tree structure:
```
START: Diskret eller kontinuerlig?
├─ Diskret (teller noe)
│   ├─ Fast antall forsøk?
│   │   ├─ Ja → binomial / hypergeometrisk
│   │   └─ Nei, rate gitt → poisson
│   └─ Trekker uten tilbakelegging fra endelig pott? → hypergeometrisk
├─ Kontinuerlig
│   ├─ Tid til hendelse, rate gitt? → eksponential
│   ├─ Normalfordeling antatt? → normalfordeling
│   └─ Sammenligning av to grupper / regresjon? → regresjons- og test-grenen
└─ Vet ikke / oppgaven gir summer eller estimater
    └─ KI/test? → KI- og hypotesetest-grenen
```
~10-12 nodes total.

## Testing strategy

- Each new component gets a render test
- Each new schema gets a parse test (valid + invalid)
- Each new route gets a routing test (exists + content)
- Existing tests must remain green throughout

## Risk register

| Risk | Mitigation |
|------|------------|
| Glossary/patterns content takes longer than UI | Bake content into Phase 1 task with explicit time-box; ship UI even if content list is shorter than target |
| Dark mode breaks Calc block readability | Visual review on TableDetail explicitly |
| Wizard tree gets too rigid | Allow each node to point to multiple terminal entries (already in schema) |
| Distribution thumbnails get pixelated | Use viewBox-scaled SVG, no raster |

## Implementation order
1. Foundation: extend schema, extend `loadContent`, add empty content folders (no UI yet)
2. Trivial wins: A5, A9 (dark mode)
3. Content: C1 (3 chi-squared entries)
4. Derived views: B4 (symbol table), B9 (cheatsheet) — these don't need new content
5. New content + UI: B3 (glossary), B5 (patterns)
6. Wizard: B1
7. Polish: B7 thumbnails, C5 template mode
8. Final review pass + branch finishing

## Self-review

**Spec coverage:** All 10 requested ideas have an in-scope row or are addressed in the architecture. ✓
**Placeholders:** None — every section has concrete file paths and approach. ✓
**Internal consistency:** Schemas referenced match what's added; route names are consistent across architecture and order sections. ✓
**Scope focus:** This is a single coherent batch — adding navigational helpers + dark mode + content gaps. Each piece is self-contained and shippable independently. ✓
