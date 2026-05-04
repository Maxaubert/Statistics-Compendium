# Detailed Solution Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the brief "Eksempler fra obliger og eksamener" sections on every entry detail page with a single tabbed "Detaljerte oppgaveløsninger" section, where each tab targets a problem-type and contains 2–3 fully-worked solutions.

**Architecture:**
- Add `detailed_solution_variants` (new schema field) — array of `{ label, solutions: DetailedSolution[] }`.
- Build `DetailedSolutionVariantsTabs` component reusing the tab styling from `StepByStepTabs`/`ExampleVariantsTabs` so the three sections feel like one widget.
- `EntryDetail` priority: `detailed_solution_variants` → flat `detailed_solutions` → nothing. The old `examples` and `example_variants` rendering blocks are removed entirely.
- For entries with `solution_variants`: tab labels MUST match exactly so step-by-step ↔ examples ↔ detailed-solutions all line up.
- For entries without `solution_variants`: usually a single tab; some entries get logical sub-tabs (one-/two-sample tests by direction; sum/diff for normals; etc.).
- Content: convert existing `examples` (sketches) and existing flat `detailed_solutions` into the variant structure; write new fully-worked solutions where coverage is missing. Mark fabricated problems with `Praksis ·` source prefix to distinguish from real exam refs.

**Tech Stack:** TypeScript + React 18, Vite, Zod (schema validation), js-yaml (loader), KaTeX (rendering math via existing primitives), vitest, fuse.js. No new dependencies.

**Audit (already done — pre-task):**
- 9 entries have `solution_variants` (Group A, tabs match those):
  bayes-setning, binomial-fordeling, eksponential-fordeling, en-utvalg-t-test, en-utvalg-z-test, komplementregelen, normalfordeling, poisson-fordeling. Plus en-utvalg-z-test-andel which has no detailed solutions yet (skip — out of scope).
- 17 entries have flat `examples` and/or `detailed_solutions` but no variants (Group B). Most get a single tab; a few get logical sub-tabs.
- 8 entries have neither (unchanged): en-utvalg-z-test-andel, ki-mu-kjent-sigma, ki-mu-ukjent-sigma, ki-varians, kjikvadrat-goodness-of-fit, kjikvadrat-uavhengighet.

---

## Task 1: Schema field for `detailed_solution_variants`

**Files:**
- Modify: `src/data/schema.ts:108-126` (Entry schema, near `example_variants`)
- Test: `src/data/schema.test.ts` (extend existing)

- [ ] **Step 1: Write the failing test**

```ts
// In src/data/schema.test.ts, add a new it() block:
it("accepts detailed_solution_variants on Entry", () => {
  const data = {
    id: "test-entry",
    name_no: "Test",
    type: "distribution",
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/schema.test.ts --exclude '**/.worktrees/**'`
Expected: FAIL with unrecognized field `detailed_solution_variants`.

- [ ] **Step 3: Add the schema field**

Modify `src/data/schema.ts` — add inside `EntrySchema.z.object({...})` immediately after `example_variants`:

```ts
  /**
   * Tabbed detailed solutions, mirroring `solution_variants` labels.
   * When set, the entry-detail page renders one tab per group with 2–3
   * fully-worked solutions inside. Replaces the older `examples` and
   * `example_variants` UI surfaces.
   */
  detailed_solution_variants: z
    .array(
      z.object({
        label: z.string(),
        solutions: z.array(DetailedSolutionSchema),
      }),
    )
    .optional(),
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/schema.test.ts --exclude '**/.worktrees/**'`
Expected: PASS, all schema tests green.

- [ ] **Step 5: Commit**

```bash
git add src/data/schema.ts src/data/schema.test.ts
git commit -m "feat(schema): add detailed_solution_variants to Entry"
```

---

## Task 2: `DetailedSolutionVariantsTabs` component

**Files:**
- Create: `src/components/detail/DetailedSolutionVariantsTabs.tsx`
- Create: `src/components/detail/DetailedSolutionVariantsTabs.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/detail/DetailedSolutionVariantsTabs.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DetailedSolutionVariantsTabs } from "./DetailedSolutionVariantsTabs";

const mkSol = (q: string) => ({
  source: "Test",
  question: q,
  sections: [{ label: "Step", lines: [{ text: "x" }] }],
  result: "r",
});

describe("DetailedSolutionVariantsTabs", () => {
  const variants = [
    { label: "P(X<x)", solutions: [mkSol("Q1A"), mkSol("Q1B")] },
    { label: "P(X>x)", solutions: [mkSol("Q2A")] },
  ];

  it("renders one tab per variant; first tab active by default", () => {
    render(<DetailedSolutionVariantsTabs variants={variants} />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "P(X<x)" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Q1A")).toBeInTheDocument();
    expect(screen.queryByText("Q2A")).not.toBeInTheDocument();
  });

  it("switches solutions when a different tab is clicked", () => {
    render(<DetailedSolutionVariantsTabs variants={variants} />);
    fireEvent.click(screen.getByRole("tab", { name: "P(X>x)" }));
    expect(screen.getByText("Q2A")).toBeInTheDocument();
    expect(screen.queryByText("Q1A")).not.toBeInTheDocument();
  });

  it("renders flat (no tabs) when only one variant given", () => {
    render(
      <DetailedSolutionVariantsTabs variants={[{ label: "Only", solutions: [mkSol("X")] }]} />,
    );
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/detail/DetailedSolutionVariantsTabs.test.tsx --exclude '**/.worktrees/**'`
Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Create the component**

Create `src/components/detail/DetailedSolutionVariantsTabs.tsx`:

```tsx
import { useState } from "react";
import { clsx } from "clsx";
import { DetailedSolution } from "./DetailedSolution";
import type { DetailedSolutionSchema } from "@/data/schema";
import type { z } from "zod";

type Solution = z.infer<typeof DetailedSolutionSchema>;

export interface DetailedSolutionVariant {
  label: string;
  solutions: Solution[];
}

interface Props {
  variants: DetailedSolutionVariant[];
}

/**
 * Tabbed wrapper for detailed solutions. Mirrors `StepByStepTabs` and
 * `ExampleVariantsTabs` styling so the trio of sections (steg / examples /
 * detailed solutions) reads as one paired widget on the entry detail page.
 */
export function DetailedSolutionVariantsTabs({ variants }: Props) {
  const [active, setActive] = useState(0);
  if (variants.length === 0) return null;
  if (variants.length === 1) {
    return (
      <>
        {variants[0].solutions.map((s, i) => (
          <DetailedSolution key={i} solution={s} />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Oppgaveløsnings-varianter"
        className="flex flex-wrap gap-x-1 gap-y-0 border-b border-line"
      >
        {variants.map((v, i) => {
          const isActive = i === active;
          return (
            <button
              key={v.label}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={clsx(
                "relative px-3 pb-2 pt-1.5 font-mono text-[12.5px] leading-none transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60 focus-visible:rounded-sm",
                isActive ? "font-semibold text-primary-2" : "text-ink-3 hover:text-ink-2",
              )}
            >
              {v.label}
              <span
                aria-hidden
                className={clsx(
                  "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                  isActive ? "bg-primary-2" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>

      {variants[active].solutions.length === 0 ? (
        <p className="py-4 text-center text-[13px] italic text-ink-3">
          (Ingen oppgaver for denne varianten ennå.)
        </p>
      ) : (
        <div>
          {variants[active].solutions.map((s, i) => (
            <DetailedSolution key={i} solution={s} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/detail/DetailedSolutionVariantsTabs.test.tsx --exclude '**/.worktrees/**'`
Expected: PASS, 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/detail/DetailedSolutionVariantsTabs.tsx src/components/detail/DetailedSolutionVariantsTabs.test.tsx
git commit -m "feat(detail): tabbed wrapper for detailed solutions"
```

---

## Task 3: Wire `EntryDetail` — switch to detailed-only, drop examples render

**Files:**
- Modify: `src/routes/EntryDetail.tsx`

- [ ] **Step 1: Write the test**

The existing route test already verifies basic rendering. We add one more case:

```tsx
// src/routes/EntryDetail.test.tsx — add inside existing describe:
it("renders detailed_solution_variants tabs when set, hides examples sections", () => {
  // Use any entry that we'll migrate; for now, verify the priority logic by
  // mocking an entry. (See manual visual verification in Task 21 — automated
  // here just checks the component is wired.)
});
```

(Skip if too brittle; the smoke test below covers it.)

- [ ] **Step 2: Modify `EntryDetail.tsx` examples block**

Find the block that renders examples (look for `Eksempler fra obliger og eksamener`) and DELETE it entirely — both branches of the `(entry.example_variants?.length ?? 0) > 0` ternary go away.

```tsx
// REMOVE this entire block:
{(entry.example_variants?.length ?? 0) > 0 ? (
  <Section title="Eksempler fra obliger og eksamener" icon={FileText}>
    <ExampleVariantsTabs variants={entry.example_variants!} />
  </Section>
) : entry.examples ? (
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
) : null}
```

- [ ] **Step 3: Replace detailed_solutions block with priority logic**

Find the existing `{entry.detailed_solutions && (...)}` block. Replace with:

```tsx
{(entry.detailed_solution_variants?.length ?? 0) > 0 ? (
  <Section title="Detaljerte oppgaveløsninger" icon={FileText}>
    <DetailedSolutionVariantsTabs variants={entry.detailed_solution_variants!} />
  </Section>
) : entry.detailed_solutions ? (
  <Section title="Detaljerte oppgaveløsninger" icon={FileText}>
    {entry.detailed_solutions.map((s, i) => (
      <DetailedSolution key={i} solution={s} />
    ))}
  </Section>
) : null}
```

- [ ] **Step 4: Add the import**

Add at top of `EntryDetail.tsx`:

```tsx
import { DetailedSolutionVariantsTabs } from "@/components/detail/DetailedSolutionVariantsTabs";
```

Remove the now-unused `ExampleVariantsTabs` and `ExampleCard` imports if no other code paths use them. (Quick grep confirms.)

- [ ] **Step 5: Verify typecheck + tests still pass**

Run:
```
npm run typecheck
npx vitest run src/routes/EntryDetail.test.tsx src/components/detail --exclude '**/.worktrees/**'
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/routes/EntryDetail.tsx
git commit -m "feat(detail): use detailed_solution_variants, drop examples render"
```

---

## Task 4: Tab-label catalog (one source of truth)

**Files:**
- Create: `docs/superpowers/plans/_variant-labels.md` (lookup doc, not part of app)

This is a paper artifact for the per-entry tasks. List ONE row per entry that gets variants, with the exact labels. No code change.

- [ ] **Step 1: Create the catalog**

Write the file with this exact content:

```markdown
# Variant labels per entry (source of truth)

| Entry | Tab labels (in order) |
|---|---|
| bayes-setning | Standard 2-veis · Diagnose-/test-mønster · Multi-hypotese (3+ partisjoner) · Tre-diagram-arbeidsflyt |
| binomial-fordeling | P(X = k) · P(X ≤ k) · P(X ≥ k) · Finn n for terskel |
| eksponential-fordeling | P(T > t) — overlevelse (ingen hendelse innen t) · P(T < t) — hendelse innen t · P(a < T < b) — intervall · Memoryless (gitt at det ikke har skjedd noe i s minutter) |
| en-utvalg-t-test | H₁: μ < μ₀ (venstre) · H₁: μ > μ₀ (høyre) · H₁: μ ≠ μ₀ (tosidig) |
| en-utvalg-z-test | H₁: μ < μ₀ (venstre) · H₁: μ > μ₀ (høyre) · H₁: μ ≠ μ₀ (tosidig) |
| komplementregelen | Minst k · Ingen / null · Ikke alle · Finn n for terskel |
| normalfordeling | P(X < x) · P(X > x) · P(a < X < b) · Invers: finn x · Invers: finn μ (eller σ) |
| poisson-fordeling | P(X = k) · P(X ≤ k) · P(X ≥ k) · P(X = 0) · Finn k for terskel |
| to-utvalgs-t-test | H₁: μ_X < μ_Y (venstre) · H₁: μ_X > μ_Y (høyre) · H₁: μ_X ≠ μ_Y (tosidig) |
| sum-uavhengige-normaler | Sum X+Y · Differanse X−Y · Lineær kombinasjon aX+bY |

For all other Group B entries (single-procedure), use ONE tab named with the entry's `name_no` field (the natural-language name). The tabs component renders single-variant as a flat list, so the label is essentially invisible.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/_variant-labels.md
git commit -m "docs(plan): variant-label catalog for the detailed-solutions migration"
```

---

## Group A: Multi-variant entries (8 tasks)

These all have `solution_variants` already. The variant labels in `detailed_solution_variants` MUST match exactly so the tabs visually pair.

Each Group A task follows this template:
1. Read the current entry: list existing `examples` (sketches) and `detailed_solutions` (full).
2. Decide which variant each existing item belongs to.
3. For each variant, ensure 2–3 detailed solutions. Convert sketches to detailed format. Write new fabricated problems where coverage is missing.
4. Replace `examples` with empty/removed and `detailed_solutions` with the new structure.
5. Sanity-check YAML loads.
6. Commit.

### Task 5: bayes-setning

**File:** `content/entries/bayes-setning.yaml`

- [ ] **Step 1: Read current state**

Run: `cat content/entries/bayes-setning.yaml | sed -n '/^examples:/,/^[a-z_]\+:/ p; /^detailed_solutions:/,/^[a-z_]\+:/ p'`

Note: solution_variants labels are: Standard 2-veis, Diagnose-/test-mønster, Multi-hypotese, Tre-diagram-arbeidsflyt.

- [ ] **Step 2: Replace `examples` field with `# examples: removed — see detailed_solution_variants` (delete content). Replace `detailed_solutions` with `detailed_solution_variants` block:**

Variants (each with 2–3 fully-worked solutions):
- **Standard 2-veis:** 2 solutions. Reuse existing detailed solution if Bayes-shaped; add 1 fabricated (e.g. defective-parts: 2 % defective rate, test detects 95 %, false-positive 3 %, given positive what's P(defective)).
- **Diagnose-/test-mønster:** 2 solutions. The classic 1 % prevalence + 99 % sensitivity + 95 % specificity → P(syk|positiv) ≈ 16.7 %. Plus one variation (e.g. 2-step screening or different prevalence).
- **Multi-hypotese:** 2 solutions. Three-bag-of-marbles or three-machines-with-defect-rates problem.
- **Tre-diagram-arbeidsflyt:** 2 solutions. A wordy compound problem (insurance claim by age group; test sequence).

Each detailed solution has `source`, `question`, `sections` (with `label` + `lines`), `result`. Fabricated → `source: "Praksis · short-tag"`.

- [ ] **Step 3: Validate YAML**

Run: `python -c "import yaml; yaml.safe_load(open('content/entries/bayes-setning.yaml', encoding='utf-8'))"`
Expected: no output (valid).

- [ ] **Step 4: Visual check + dev-server smoke**

Run dev server, navigate to `/#/entry/bayes-setning`, click each tab, verify content renders.

- [ ] **Step 5: Commit**

```bash
git add content/entries/bayes-setning.yaml
git commit -m "content(bayes): tabbed detailed solutions, drop sketch examples"
```

### Task 6: binomial-fordeling

Same template as Task 5. Variants: P(X = k), P(X ≤ k), P(X ≥ k), Finn n for terskel.

Suggested problems per variant:
- **P(X = k):** dice exactly 4 sixes in 10 rolls; archery hit-rate 0.30, exactly 4 of 10 arrows hit.
- **P(X ≤ k):** product defect rate 0.05, n=20, at most 2 defective; standard binomial-table use.
- **P(X ≥ k):** vaccination 90 % coverage, sample 8 people, probability ≥ 7 vaccinated.
- **Finn n for terskel:** how many trials so P(at least 1 success) ≥ 0.99 for p = 0.05.

Two fully-worked per variant minimum.

### Task 7: eksponential-fordeling

Variants: P(T > t), P(T < t), P(a < T < b), Memoryless.

Problems:
- **P(T > t):** lightbulb mean lifetime 1000 h, P(T > 1500); customer-arrival mean 10 min, P(no arrival in 30 min).
- **P(T < t):** same context flipped — P(T < 5 min for next call).
- **P(a < T < b):** P(10 min < T < 30 min for next bus).
- **Memoryless:** "given that no call has come in the last 5 min, probability of waiting another 10 min".

### Task 8: en-utvalg-t-test

Variants: venstre, høyre, tosidig.

Problems (use realistic but fabricated data — this is Tier 4 in our analysis, no exam refs):
- **Venstre (μ < μ₀):** sample mean 4.7, hypothesized 5.0, s = 0.5, n = 12.
- **Høyre (μ > μ₀):** new fertilizer claims yield > 50; sample 10, mean 52, s = 3.
- **Tosidig (μ ≠ μ₀):** machine fills mean 500 ml; check if μ ≠ 500 with sample n = 15, x̄ = 503, s = 4.

### Task 9: en-utvalg-z-test

Variants: venstre, høyre, tosidig.

Problems:
- **Venstre:** existing jan25 oppgave 6 (one-sided z-test) — convert to detailed format.
- **Høyre:** fabricated — n = 36, σ = 5 known, x̄ = 102 vs μ₀ = 100.
- **Tosidig:** fabricated — quality control mean weight 250 g, σ = 4, n = 25, x̄ = 252.

### Task 10: komplementregelen

Variants: Minst k, Ingen / null, Ikke alle, Finn n for terskel.

Problems:
- **Minst k:** dice — at least one 6 in 4 rolls; volcanic eruptions Poisson rate, at least 2 in 50 years.
- **Ingen:** binomial — 8 of 10 components OK, P(all 10 OK); Poisson — P(no calls in 5 min).
- **Ikke alle:** product test — 5 components, p_OK = 0.95 each, P(at least one fails) = 1 − 0.95⁵.
- **Finn n for terskel:** rare event p = 0.02, how many trials for P(at least one) ≥ 0.95.

### Task 11: normalfordeling

**Special case:** already has `example_variants` with 5 tabs × 3 examples (sketches). Migrate those into `detailed_solution_variants` by expanding each sketch into a full detailed solution. Existing `detailed_solutions` field already has 3 worked solutions in flat format — distribute them into the right tabs and add 1–2 fabricated detailed solutions per tab where needed.

Variants: P(X < x), P(X > x), P(a < X < b), Invers: finn x, Invers: finn μ (eller σ).

After migration: delete `example_variants` field entirely.

### Task 12: poisson-fordeling

Variants: P(X = k), P(X ≤ k), P(X ≥ k), P(X = 0), Finn k for terskel.

Problems:
- **P(X = k):** existing jan25 oppgave 4 if it covers exact-k; volcano example from current entry.
- **P(X ≤ k):** customer arrivals λt = 3, P(at most 5).
- **P(X ≥ k):** fabricated — 1 % defect, 100 items, P(at least 3 defective).
- **P(X = 0):** P(no arrivals in 10 min) given rate.
- **Finn k:** find k such that P(X ≥ k) < 0.05.

---

## Group B: Single-procedure entries (single-tab — 11 tasks)

These get ONE tab labeled with their `name_no`. 2–3 detailed solutions in that single tab. The component renders single-variant as a flat list, so visually it looks the same as before — but the data shape is normalized.

For each entry, the work is:
1. Read existing `examples` + `detailed_solutions`.
2. Pick 2–3 problems (combine sketches + existing details).
3. Expand sketches into full detailed format.
4. Add fabricated problem(s) if existing pool < 2.
5. Replace fields in YAML.
6. Validate + commit.

### Task 13: forventningsverdi-diskret
Single tab. 3 detailed solutions: classic discrete X with table; lineær E[aX+b]; sum E[X+Y] from joint table.

### Task 14: hypergeometrisk-fordeling
Could split P(X=k) vs "minst k" — but single-procedure simpler. Single tab: 3 problems (cards/balls drawing patterns).

### Task 15: ki-andel-binomial
Single tab. 2-3 problems with different n and p_hat values.

### Task 16: ki-poissonrate
Single tab. 2-3 problems based on observed counts over time intervals.

### Task 17: korrelasjon-joint
Single tab. 2-3 problems using simultantabell.

### Task 18: kovarians
Single tab. 2-3 problems.

### Task 19: marginalfordeling
Single tab. 2 problems based on different simultantabell shapes.

### Task 20: produktregel
Single tab. 2-3 problems mixing P(A∩B) = P(A)·P(B|A).

### Task 21: regresjon-* (6 entries — group as one task)
Each gets ONE tab. Reuse existing detailed_solutions where present; add fabricated where needed.
- regresjon-estimat-alpha-beta
- regresjon-korrelasjonskoeffisient
- regresjon-prediksjonsintervall
- regresjon-residualvarians
- regresjon-standardfeil-stigningstall
- regresjon-test-stigningstall

### Task 22: total-sannsynlighet
Single tab. 2-3 problems.

### Task 23: unionssetningen
Single tab (could split disjoint vs general but keep simple). 2-3 problems.

### Task 24: uordnet-utvalg-uten-tilbakelegging
Single tab. 2-3 combinatorics problems (poker hands, lotto, etc.).

### Task 25: varians-standardavvik-diskret
Single tab. 2-3 problems with different sub-cases (E[X²]−μ², s² from data).

---

## Group C: Multi-tab Group B entries (extra structure where it pays off)

### Task 26: to-utvalgs-t-test (3 tabs by direction)
Variants: H₁: μ_X < μ_Y, H₁: μ_X > μ_Y, H₁: μ_X ≠ μ_Y.
Problems: 2 per tab (total 6). Use jan26 oppgave 5 if applicable for one tab.

### Task 27: sum-uavhengige-normaler (3 tabs)
Variants: Sum X+Y, Differanse X−Y, Lineær kombinasjon aX+bY.
Problems: 2 per tab. Use jan25 5b for one tab.

---

## Task 28: Cleanup — drop unused `examples` and `example_variants` rendering

**Files:**
- Modify: `src/routes/EntryDetail.tsx` — verify imports for `ExampleCard` and `ExampleVariantsTabs` are gone (already removed in Task 3, but double-check).
- Delete: `src/components/detail/ExampleCard.tsx` and `ExampleCard.test.tsx` if no other surface uses them.
- Delete: `src/components/detail/ExampleVariantsTabs.tsx` and `ExampleVariantsTabs.test.tsx` if unreferenced.

- [ ] **Step 1: Search for usages**

Run:
```
grep -rE "ExampleCard|ExampleVariantsTabs" src/
```
Expected: no results outside the files themselves.

- [ ] **Step 2: Delete the unused files**

```
rm src/components/detail/ExampleCard.tsx src/components/detail/ExampleCard.test.tsx
rm src/components/detail/ExampleVariantsTabs.tsx src/components/detail/ExampleVariantsTabs.test.tsx
```

- [ ] **Step 3: Run typecheck + full test sweep**

```
npm run typecheck
npx vitest run --exclude '**/.worktrees/**'
```
Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused ExampleCard/ExampleVariantsTabs (replaced by detailed-solution variants)"
```

---

## Task 29: Visual smoke test — capture a sampling of entries

**Files:**
- Create: `screenshots/capture-detailed-variants.mjs`

- [ ] **Step 1: Write the puppeteer script**

Modify or fork the existing `screenshots/capture-variants.mjs` to:
- Hit `/#/entry/normalfordeling`, `/#/entry/poisson-fordeling`, `/#/entry/bayes-setning`, `/#/entry/forventningsverdi-diskret` (one Group A, one Group B simple, one with many tabs, one without variants).
- For each, scroll the "Detaljerte oppgaveløsninger" section into view, screenshot.
- For multi-variant entries, click each tab and screenshot.

- [ ] **Step 2: Run dev server**

```
npm run dev
```

- [ ] **Step 3: Run capture**

```
node screenshots/capture-detailed-variants.mjs
```

- [ ] **Step 4: Inspect screenshots**

Open each generated PNG. Look for:
- "Eksempler fra obliger og eksamener" header is GONE.
- "Detaljerte oppgaveløsninger" header is present.
- Tabs visible on multi-variant entries; flat list on single-tab entries.
- Math notation renders correctly inside detailed solutions.

- [ ] **Step 5: Commit screenshots**

```bash
git add screenshots/capture-detailed-variants.mjs screenshots/detailed-*.png
git commit -m "test(visual): capture sampling of detailed-solution variants"
```

---

## Task 30: Final verification

- [ ] **Step 1: Full typecheck**

```
npm run typecheck
```
Expected: no errors.

- [ ] **Step 2: Full test run (main only, excluding stale worktrees)**

```
npx vitest run --exclude '**/.worktrees/**'
```
Expected: all green.

- [ ] **Step 3: Build smoke**

```
npm run build
```
Expected: dist/ produced, no errors.

- [ ] **Step 4: Self-review**

Skim each migrated entry in the dev server. Sanity questions:
- Does each tab have ≥ 2 problems?
- Are fabricated problems clearly labeled `Praksis · ...`?
- Do Group A entries' detailed_solution_variants labels exactly match solution_variants labels?
- Are there any leftover references to `examples` rendering in the codebase?

If any answer is "no", create a fix-up commit.

---

## Self-Review checklist (writer's pass)

- **Spec coverage:** Each user requirement maps to a task: remove undetailed sections (Task 3), keep only detailed (Task 3), tabs on detailed (Tasks 1–2 + content tasks), 2-3 per tab (each content task spec), make own problems where needed (each content task spec), verify exam answers if available (each Group A task references exam-derived problems first).
- **Placeholder scan:** No "TBD" / "implement later" — each content task lists concrete problems for each variant.
- **Type consistency:** `DetailedSolutionVariant` and `detailed_solution_variants` shape matches `DetailedSolutionSchema` (uses `solutions` field name internally; schema field name is `detailed_solution_variants`). Component uses `solutions` consistently.
