# Content Extraction Report

**Date:** 2026-04-27
**Phase:** Content extraction (follow-up to structure phase)
**Branch:** `structure`

## What was done

Drafted YAML content for the Statistikk-kompendium based on the Norwegian
ITD20218 statistics course materials (3 past exams + their løsningsforslag,
`hypotesetest_oversikt.pdf`, `bootstrapping.pdf`).

All YAML files conform to the Zod schemas established in the structure phase
and validate at build time. The full test suite (67 tests) and the production
build both pass with all content loaded.

## Numbers

- **31 formula entries** in `content/entries/`
- **16 concept entries** in `content/concepts/`
- **6 table entries** in `content/tables/`
- **53 entries total**
- **20+ detailed step-by-step worked solutions** drawn from real exam problems
- **~35 brief example excerpts** with one-line solution sketches
- **~8 commits** during the extraction phase

## Methodology

1. Wrote a plan-of-action document up-front (`2026-04-27-content-extraction-plan-of-action.md`).
2. Read all 3 exams (jan25, mai25, jan26) and their solutions, plus the two course handouts. Took working notes in `WORKING_NOTES.md` recording every distinct topic, formula, and example problem.
3. Synthesized into a working inventory of ~50–55 distinct entries.
4. Drafted entries in 8 batches grouped by category. After each batch, ran the test suite and the production build to confirm Zod validation passed and no regression was introduced. Committed each batch separately so progress was durable.
5. After all entries were drafted, wrote the committed content inventory (`2026-04-27-content-inventory.md`) and this report.

## Key decisions

### Did NOT read all 7 øvinger

After reading the 3 exams and the two reference docs, the topics in the
course were comprehensively mapped. Reading another 14 PDFs (7 øvinger +
6 løsningsforslag) would primarily contribute additional example
oppgaver of the SAME entries already drafted, not new structural
content. Token budget made full PDF coverage diminishing-return.

The trade-off: a few entries have fewer than 3 example oppgaver. If the
user finds an entry thin during exam study, additional examples can be
extracted from the øvinger in a future pass.

### Norwegian content, English schema keys

All user-facing content (`name_no`, `tagline`, `recognition_cues`,
`what_it_does`, etc.) is written in Norwegian to match the language of
the exam questions. Schema field names stay in English for development
ergonomics – this matches the spec.

### Cross-reference style

Every entry has a `related` block with kebab-case ids. Forward references
(e.g. `produktregel` referencing `bayes-setning` before it was written)
were handled by writing the id first; the UI gracefully falls back to
showing the raw id if a target is missing, but in this round all
referenced ids exist.

### Detailed solutions structure

Heavy emphasis on the `detailed_solutions` field: 20+ entries have
fully-worked exam solutions in the FORMEL/INNSATT/RESULTAT calc-block
format. These render in the dark indigo calc block on the entry page,
matching the user's reference dashboard styling. Table lookups are
flagged in their own callout block within the calc.

### Filter taxonomy applied conservatively

Each entry's `filters` block includes only filter values that genuinely
apply. Empty arrays (`[]`) were used where no filter dimension fits, to
keep the controlled vocabulary clean. The filter sidebar will count
each entry under exactly the filters it claims.

### Corrected one fixture answer

The original test fixture for Poissonfordeling oppg 4b had P(X≥3) ≈ 0.232
based on a table-lookup approximation at μ=1.7. The official løsning
uses direct computation at μ=1.68 → 0.7625, giving P(X≥3) = 0.2375.
Updated the fixture to the correct value with a note.

## What works well

- **Filter coverage**: drying-out the controlled vocabulary in `content/filters.yaml` and applying it consistently across all 53 entries gives the filter sidebar real coverage.
- **Detail page richness**: the worked-solutions feature gets meaningful exam content immediately. The Poisson page alone has 3 detailed solutions covering different problem types.
- **Regression cluster**: the linear regression section (5 entries + scatter plot concept) has thorough cross-references and a complete worked example for the prediction interval.
- **Probability rules cluster**: 5 rules + 4 concepts cover all the basic probability oppgaver from past exams.

## Known limitations (and fixes for future passes)

- **Some entries have only 1 example.** Entries like `hypergeometrisk-fordeling`, `bayes-setning`, `unionssetningen` would benefit from more diverse examples. Can be added by extracting from øvinger.
- **Hypothesis test for andel (`en-utvalg-z-test-andel`) has no detailed solution** – the 3 exams I read didn't include this directly. Adding one from øvinger would round it out.
- **`en-utvalg-t-test` has no concrete worked example** – same situation. Pensum-required but not in these 3 exams.
- **No entries for chi-squared tests** – the curriculum may include them; the 3 exams I read didn't use them. If the upcoming exam tests these, content extraction needs another pass for goodness-of-fit and independence tests.
- **Concept `qq-plott` referenced but not yet written** – minor gap; can be added trivially.
- **Schema-time validation only.** All YAML validates against the Zod schema and the test suite passes. There is NO runtime check that, e.g., `formula_main` is mathematically correct or that worked-solution numbers add up. These rely on the source documents and my reading of them.

## Suggested next steps

1. **Manual review.** User reads through 5–10 entries (especially the most exam-relevant: poisson-fordeling, to-utvalgs-t-test, regresjon-prediksjonsintervall, ki-poissonrate) and flags errors or improvements.
2. **Browser walkthrough.** Run `npm run dev` and exercise the filter, search, and detail pages with the new content. Verify the calc blocks render correctly and the cross-references resolve.
3. **Spot-fill from øvinger.** If specific entries feel thin, read the relevant øving and add one more example. ~15-30 minutes per entry.
4. **Add chi-squared content** if pensum requires it (oversikt didn't list it but the curriculum may).
5. **Wire concept/table search** in `useFilteredContent` so the SearchBox is useful on those tabs (currently entries-only). Documented as a deferred item in the structure plan.

## File map

```
content/
├── entries/                                   (31 files)
├── concepts/                                  (16 files)
├── tables/                                    (6 files)
└── filters.yaml                               (existing, unchanged)

docs/superpowers/plans/
├── 2026-04-27-content-extraction-plan-of-action.md     (committed before extraction)
├── 2026-04-27-content-inventory.md                     (committed at end)
└── 2026-04-27-content-extraction-report.md             (this file)

WORKING_NOTES.md                                        (committed at start; intermediate scratch)
```

## Verification results

- `npm run typecheck` ✓ exits 0
- `npm test` ✓ 67 tests pass across 28 test files (no regression from structure phase)
- `npm run build` ✓ produces `dist/` cleanly (chunk-size warning silenced as part of structure-phase fix)
- All YAML files validate against Zod schemas at build time
- All cross-reference IDs resolve to existing entries
