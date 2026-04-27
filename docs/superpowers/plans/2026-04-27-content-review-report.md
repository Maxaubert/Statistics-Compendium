# Content Review Report — Pedagogical & Filter Optimization

**Date:** 2026-04-27
**Branch:** `structure`
**Goal of this round:** Push the compendium toward the user's stated north star — a person with **no prior statistics knowledge** should be able to (1) find the right entry from filter cues alone, and (2) apply the formula using only the entry text and its related links.

## Summary of changes

### Filter taxonomy expansion

`content/filters.yaml` grew from 6 dimensions / 32 options to **7 dimensions / 70 options**, structured for layered narrowing:

- **`computes`**: 6 → 17 options. Added `range_probability`, `conditional_probability`, `joint_probability`, `marginal_probability`, `covariance`, `correlation`, `prediction_interval`, `parameter_estimate`, `combinatorial_count`, `find_n_for_threshold`, `find_mu_for_threshold`.
- **`random_variable`**: 4 → 8 options. Added `sum_of_samples`, `difference_of_means`, `proportion`, `slope_estimate`.
- **`setup`**: 6 → 11 options. Added `paired_samples`, `joint_table_given`, `trials_until_event`, `finite_pool`, `linear_relationship`, plus reorganization to `single_population` (replacing the ambiguous `single_sample`).
- **`structural_cues`**: 6 → 19 options. Massively expanded to capture phrases visible in exam questions: `data_as_list`, `summary_stats_given`, `joint_table_present`, `poisson_process_mentioned`, `counting_events`, `time_until_first`, `complement_pattern` ("minst én", "ingen", "ikke alle"), `total_observations_n`, `disjoint_events`, `more_than_two_categories`, `linear_relationship_suspected`.
- **NEW dimension `parameters_known`**: 12 options. Captures what the problem hands you: `population_variance_known`, `population_variance_unknown`, `mean_known`, `sample_size_small_lt30`, `sample_size_large`, `rate_lambda`, `success_p`, `slope_se`, `residual_variance`, `sum_xx_sxy`, `alpha_significance`, `confidence_level`. (Was used in entries but missing from `filters.yaml`, so wasn't surfaced to the filter sidebar.)
- **`distribution_assumption`**: 5 → 8 options. Added `hypergeometric`, `chi_squared`, `none_assumed`.
- **`tooling`**: 7 → 11 options. Split `calculator_only` into specific tools: `calculator_exp`, `calculator_factorial`, `calculator_binomial_coef`, `calculator_sqrt`.

### Filter coverage per entry

Walked through all 31 formula entries and updated their `filters` blocks:
- Empty arrays (`[]`) replaced with applicable values where possible.
- Each entry now has at least 5 dimensions populated (most have all 7).
- Used the new `structural_cues` to phrase filters in *visible-in-question* terms (e.g., "Komplement-mønster: 'minst én' / 'ingen' / 'ikke alle'") rather than statistical jargon.

### Pedagogical improvements on foundational entries

Four entries got significant upgrades to make them novice-friendly:

1. **`normalfordeling`**: rewrote `what_it_does` to introduce X as "any measurable value" before invoking μ/σ. Expanded `solution_template` from 5 to 7 actionable steps with concrete examples of standardisering. Restructured `common_traps` as a bulleted list of named pitfalls (variance vs. σ confusion, sign of z, etc.).

2. **`en-utvalg-z-test`**: rewrote `what_it_does` and `recognition_cues` to phrase each cue as something *visible in the exam question text* (e.g., "Oppgaven oppgir at standardavviket σ er kjent eller 'antas kjent'"). Expanded `solution_template` from 7 to 8 steps including p-value computation, with explicit forkastingsregel for venstresidig/høyresidig/tosidig. Restructured `common_traps`.

3. **`komplementregelen`**: rewrote `what_it_does` to lead with intuition ("den enkleste, men kraftigste, regelen"). Doubled the recognition_cues to cover more phrasings ("ikke alle", "minst én", terskelproblemer). Restructured `common_traps` to cover the off-by-one indeksfeil, the "ikke alle" ≠ "ingen" trap, and complement of disjunkt union (De Morgan).

4. **`bayes-setning`**: rewrote `what_it_does` with concrete diagnose-eksempel as scaffold. Expanded `solution_template` to 5 explicit steps including the total-sannsynlighet-utledning av P(B). Restructured `common_traps` to cover "confusion of the inverse", missing P(B), and disjunkt vs. uavhengig.

### New concept added

- **`qq-plott`** (normaltestplott) — referenced in `bootstrapping` and `spredningsplott` concepts but not previously written. Now exists with explanation, recognition cues, and links.

## Statistics

- 33 files modified (1 new concept + 32 entry/filter updates)
- ~234 lines added, ~133 removed in the filter expansion commit
- ~104 lines added, ~69 removed in the pedagogical commit
- **All 67 tests still pass** through both rounds
- `npm run build` succeeds cleanly

## What this enables

Layered filter narrowing now works:

**Example exam scenario**: "Du leser en oppgave der det står 'antall hendelser pr. time', 'i løpet av en uke', 'minst k', og en rate er gitt."

- **Tick "Rate λ er gitt"** → narrows to: poisson-fordeling, eksponential-fordeling, ki-poissonrate, og noen konsept-relaterte.
- **Tick "Hendelser i et tidsvindu"** → narrows further til poisson-fordeling og ki-poissonrate.
- **Tick "Minst k / komplementmønster"** → poisson-fordeling, komplementregelen.
- **Tick "Diskret antall"** → poisson-fordeling.

Three filter clicks → the right entry. This matches the user's vision: "selv om jeg ikke vet hva det er, kan jeg navigere meg fram via filterene."

## Limitations remaining

- **Some entries still have empty `parameters_known: []`** (e.g., `marginalfordeling`, where no parameters are really "known"). That's intentional — empty filter arrays are honest signals, not bugs.
- **Pedagogical depth**: 4 of the most foundational entries got the deep pedagogical pass. 27 entries still have their original (already-good) text. If user finds specific entries feel thin during exam study, they can be deepened with the same pattern (rewrite `what_it_does`, expand `solution_template`, restructure `common_traps`).
- **Recognition cues are still one-line phrases**, not paragraphs. This is by design — they should be scannable, not absorptive — but a future pass could add a "how to recognize this from scratch" prose block if needed.
- **No detailed solutions added**. The 4 entries that got pedagogical passes already had detailed solutions; the entries without (`en-utvalg-t-test`, `en-utvalg-z-test-andel`) still don't, since I don't have øving examples loaded into context.

## Verification

```
npm run typecheck   ✓ exits 0
npm test            ✓ 67 tests pass across 28 test files
npm run build       ✓ produces dist/ (732 kB / 219 kB gzip — same as before; chunk-size warning informational only)
All YAML files validate against Zod schemas at build time.
All cross-reference IDs resolve to existing entries.
```

## Suggested next steps for the user

1. **Browser walkthrough** with the new filters. Start at `/`, open the Filter sidebar, click through all the new options to see what's there. The "Parametre kjent / gitt" group is brand new — try ticking "σ kjent" to find z-tester and KI-er.

2. **Acid test**: take a problem from one of the øvinger you haven't seen yet, read it once, and try to navigate the compendium using only the filter sidebar (no search, no remembered jargon). Note where it gets stuck — those are the next pedagogical gaps to fix.

3. **If specific entries feel thin** during exam practice: the pattern from `normalfordeling` / `en-utvalg-z-test` / `komplementregelen` / `bayes-setning` (rewrite `what_it_does` with intuition, expand `solution_template`, structure `common_traps` as bullets) can be applied entry-by-entry. ~10-15 minutes per entry.

4. **No content-changing fixes were made to existing detailed solutions** in this round (per your "no content changes in polished versions" feedback memory). Numbers and exam citations are unchanged.
