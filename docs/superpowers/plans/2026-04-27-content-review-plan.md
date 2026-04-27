# Content Review — Pedagogical & Filter Optimization Plan

**Date:** 2026-04-27
**Goal:** A person with **zero prior statistics knowledge** should, just by reading an exam question, be able to (1) find the correct entry via filters/search/cues, and (2) apply the formula correctly using only the entry text and its related links.

## Two-axis review

### Axis A — Pedagogical clarity per entry

Every formula entry should pass the "novice test": a reader without statistics background, given only the entry page and its related links, should be able to:

1. Recognize that THIS is the right formula for the problem in front of them.
2. Identify the inputs in the problem text.
3. Apply the formula step-by-step and arrive at the right answer.

For each entry, audit:
- **what_it_does** — plain-language, jargon-free intuition
- **why_use** — motivates choosing THIS over related entries
- **recognition_cues** — written as "phrases visible in the exam question text", not as definitions
- **when_NOT_to_use** — explicit fork to alternatives with reasons
- **symbols** — every symbol in `formula_main` is explained, and the explanation defines any embedded jargon
- **solution_template** — every step is concrete enough that a novice can follow without looking up vocabulary
- **common_traps** — gotchas a beginner will hit
- **examples / detailed_solutions** — at least one fully worked example with all substitution steps shown

### Axis B — Filter taxonomy

The filter sidebar is the primary "I don't know what this is, but I see X in the question" tool. It must be **layerable** so users can stack filters and narrow to a small set.

Audit:
- **Dimensions present** — are there missing categories? (Currently 6 dims in `filters.yaml`; entries use a 7th, `parameters_known`, that isn't declared — gap to close.)
- **Values per dimension** — are there missing options? Especially situational cues a novice would notice ("data is gitt as a list of observations", "summary statistics are gitt", "joint table gitt").
- **Coverage per entry** — are filter blocks filled out conservatively (good) or sparsely (bad)? Entries with mostly empty filter arrays will not show up under any filter and are findable only by search/browsing.

## Plan

### Phase 1: Audit (no edits)

1. Re-read `content/filters.yaml` and list current dimensions + values.
2. Grep entries for filter coverage. Find entries with empty filter dimensions that *should* have values.
3. Read each entry briefly. Tag them as "ok", "needs pedagogy work", or "needs filter work" (or both).
4. Write findings into a working notes section here.

### Phase 2: Filter expansion

1. Add the missing `parameters_known` dimension to `filters.yaml`.
2. Add missing values within existing dimensions (especially structural cues phrased as "what's visible in the problem").
3. Possibly add 1–2 new dimensions if the audit reveals gaps (e.g., a `data_form` dimension for "raw data list" vs "summary stats" vs "joint table" vs "single-value problem").

### Phase 3: Per-entry pedagogical improvements

Priority order (most exam-critical first):

1. **Distributions** (5): poisson, binomial, normal, eksponential, hypergeometrisk
2. **Hypothesis tests** (5): one-sample z, one-sample t, two-sample t, z for proportion, slope test
3. **Confidence intervals** (4): all four
4. **Probability rules** (5): union, complement, product, total, Bayes
5. **Linear regression** (5): all five
6. **Joint distribution** (6): E, Var, marginal, Cov, ρ, sum-of-normals
7. **Combinatorics** (1)

Concepts are already explanatory; minor pass for cross-reference completeness only.

For each entry in priority order:
- Tighten `what_it_does` if jargon-laden.
- Beef up `recognition_cues` with at least 5 cues, each phrased as visible-in-question.
- Make sure `when_NOT_to_use` covers the obvious sister-entries.
- Audit `symbols` for completeness (every variable in `formula_main` defined).
- Walk `solution_template` step-by-step — is each step actionable?
- Check `common_traps` for the genuinely common errors.
- Update `filters` block — fill in missed dimensions.

### Phase 4: Fill cross-reference gaps

- Add `qq-plott` concept (referenced from `bootstrapping` and `spredningsplott` but missing).
- Verify all `related: [{ id: ..., kind: ... }]` resolve.
- Add cross-references where the user would benefit (e.g., from `binomial-fordeling` to `en-utvalg-z-test-andel`).

### Phase 5: Verification

- `npm run typecheck`
- `npm test` — must all pass
- `npm run build` — must succeed
- Manual sanity: open ListView and pick a filter combination, confirm reasonable narrowing.

### Phase 6: Commit + report

- Single thematic commit per phase (or per priority group within Phase 3).
- Write `2026-04-27-content-review-report.md` documenting what changed and why.

## Methodology principles

- **Don't break what's already good.** Many entries are already strong. The review should add, not rewrite.
- **Novice-test every cue.** If a recognition cue uses a stats term ("hypergeometric"), it must be backed up by a more accessible cue alongside ("trekker uten tilbakelegging fra endelig pott").
- **Bias toward more filter values, not fewer.** Better to over-tag and let the filter sidebar narrow than to leave entries unreachable.
- **Commit frequently** so progress is durable.

## Working notes (filled in as Phase 1 audit is done)

(to be added)
