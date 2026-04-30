# Content Extraction – Plan of Action

**Date:** 2026-04-27
**Status:** Solo run, user is AFK. No clarifying questions possible. "Best of ability" target.

## Objective

For each concept, formula, and table that appears in the ITD20218 statistics course materials, draft a YAML document conforming to the schema established in the structure phase. Each document should be rich enough to power the compendium's filter, search, and detail views during the exam, with worked example solutions extracted from real past exams and obliger.

The user explicitly said: *"create local documents one for each concept/formula/table. Go through exams and assignments collect questions for example tasks, find out how we mostly use it, then after collecting create a document locally like a text document where you outline what you want on that concepts specific page, it should use like a template of requirements it needs to follow so its easy to filter and so on."*

YAML files matching the structure-phase Zod schema satisfy this – they are the per-entry text documents AND they're directly usable by the app.

## Non-goals

- I will NOT invent content not grounded in the source materials. Every formula, recognition cue, and example must trace to something in the PDFs.
- I will NOT exhaustively cover every parametric distribution in statistics – only those the course actually uses.
- I will NOT polish UI / styling / app code. Pure content work.
- I will NOT lock in cumulative table data tables (E.1, E.3–E.6) beyond what the test fixture E.2 already does. The PrintedTable component handles only Poisson today; the rest is deferred per the structure plan.

## Source materials inventory

Located in `C:\Users\Admin\Documents\School\CanvasFiles\ITD20218-1 26V Statistikk og statistisk programmering\`:

| File | Read status |
|------|-------------|
| `statistikk_eksamen_jan25.pdf` (oppgaver) | Pending |
| `statistikk_eksamen_jan25_losning.pdf` (løsninger) | Pending |
| `statistikk_eksamen_mai25.pdf` | Pending |
| `statistikk_eksamen_mai25_losning.pdf` | Pending |
| `statistikk_eksamen_jan26.pdf` | Already read in conversation |
| `statistikk_eksamen_jan26_losning.pdf` | Pending |
| `statistikk_oving1_v26.pdf` + `_losning.pdf` | Pending |
| `statistikk_oving2_v26.pdf` + `_losning.pdf` | Pending |
| `statistikk_oving3_v26.pdf` + `_losning.pdf` | Pending |
| `statistikk_oving4_v26.pdf` + `_losning.pdf` | Pending |
| `statistikk_oving5_v26.pdf` + `_losning.pdf` | Pending |
| `statistikk_oving6_v26.pdf` + `_losning.pdf` | Pending |
| `statistikk_oving7_v26.pdf` (no løsning released yet) | Pending |
| `bootstrapping.pdf` (course handout) | Pending |
| `hypotesetest_oversikt.pdf` (course handout) | Pending |

Plus `Documents\School\SSP\Oblig_1\` – student's own work + Python code, used as reference for Python conventions and confirmation of which formulas the student has actively practiced.

That's roughly 20 PDFs + 1 oblig folder. I expect ~50 distinct exam/oblig oppgaver in total.

## Phases

### Phase A – Reconnaissance

For each PDF in turn:
1. Read the PDF.
2. Note: which formulas/tests/distributions/concepts are used in each oppgave. Note the parameters given, what's asked, the solution method.
3. Append findings to a local note file `WORKING_NOTES.md` (not committed; scratch space for me).

This produces a complete catalog of "what's actually used in this course".

### Phase B – Inventory

Synthesize WORKING_NOTES into a structured inventory at `docs/superpowers/plans/2026-04-27-content-inventory.md`:
- Master list of every distinct entry needed (formula / concept / test / table) with proposed `id` and `name_no`.
- Master list of every example (oppgave) with which entry/entries it exemplifies.
- Map: entry → list of source citations and oppgaver.

This is human-readable and committed.

### Phase C – Templates

Define one example YAML per entry-type to lock conventions:
- Distribution template (re-use `poisson-fordeling.yaml` as the canonical reference, expanded if needed).
- Hypothesis test template (e.g., two-sample t-test).
- Concept template (re-use `poisson-prosess.yaml`).
- Combinatorics / probability rule template.
- Regression formula template.
- Confidence interval template.
- Identity / property template.
- Table template (re-use `E2-poisson-kumulativ.yaml`).

Conventions to lock:
- `id` is kebab-case Norwegian: `poisson-fordeling`, `to-utvalgs-t-test`, `regresjon-prediksjonsintervall`. Tables prefix with code: `E1-binomial-kumulativ`.
- `name_no` is the spoken Norwegian short name: `Poissonfordeling`, `To-utvalgs t-test`, `Z-tabell`.
- `tagline` is one sentence in italic-ready prose, present tense.
- `recognition_cues` are written as the user would think them while reading the exam question – phrases visible in the prompt or quick mental tests, NOT formal definitions.
- `when_NOT_to_use` items use arrow `→` to point at the alternative.
- `examples` use short solution sketches; `detailed_solutions` use the structured FORMEL/INNSATT/RESULTAT calc-block format.
- Cross-references in `related` use the actual id of the target.
- Sources cited as: `Eksamen <month><year> · oppgave <X><letter>` or `Oppgave <N> · oppg. <X><letter>` for øvinger.

### Phase D – Drafting

Write YAML files in batches grouped by category. After each batch, run `npm test` to confirm Zod validation passes. Commit each batch separately.

Order (priority by exam frequency, easiest-to-extract-first):

1. **Sannsynlighetsregler & kombinatorikk** (probability rules, set theory, basic combinatorics) – ~6 entries
2. **Diskrete fordelinger** (binomial, Poisson, hypergeometric, geometric) – ~4 entries
3. **Kontinuerlige fordelinger** (normal, exponential, uniform, t, chi²) – ~5 entries
4. **Forventning/varians/kovarians/korrelasjon for fellesfordeling** – ~4 entries
5. **Konfidensintervall** (mean known σ, mean unknown σ, proportion, variance, rate) – ~5 entries
6. **Hypotesetest** (one-sample z, one-sample t, two-sample t pooled/unpooled, paired t, proportion, chi² goodness of fit, chi² independence) – ~7 entries
7. **Lineær regresjon** (slope/intercept estimates, residual variance, slope SE, slope CI, slope hypothesis test, prediction interval, confidence interval for E[Y|X], R²) – ~6 entries
8. **Bootstrapping** (concept + procedure) – ~2 entries
9. **Konsepter** (Poissonprosess, fellesfordeling, uten/med tilbakelegging, marginalfordeling, betinget sannsynlighet, uavhengighet, signifikansnivå, p-verdi, frihetsgrader, standardnormalisering, sentralgrenseteorem, etc.) – ~12-15 entries
10. **Tabeller E.1-E.6** – replace placeholder E.2 with full version, add 5 more – 6 entries

Estimated total: ~55-60 entries.

### Phase E – Review and iterate

For each batch and at end:
1. Visual sanity check – read each YAML I drafted with fresh eyes. Are recognition cues phrased from the *student's* perspective (what they'd see in the question), not the textbook's perspective?
2. Cross-reference check – every `related: [{ id: ... }]` resolves to an existing entry/concept/table.
3. Filter consistency – are filter values used consistently across entries? (e.g., is `discrete_count` used everywhere appropriate?)
4. Run the existing test suite to confirm Zod validation passes for every YAML.
5. Verify `npm run build` still succeeds.

If issues are found, fix in place, re-run validation.

### Phase F – Final report

Write `docs/superpowers/plans/2026-04-27-content-extraction-report.md`:
- Statistics: how many entries, concepts, tables, examples.
- Coverage map: for each oppgave in each exam, which entry it exemplifies. Gaps explicitly listed.
- Known limitations: parts of the course material not covered (e.g., specific øving exercises with no clear formula match), any speculative content that needs user verification.
- Suggested next steps: which entries are thinnest and would benefit from another pass.

### Phase G – Commit and tag

After review passes, commit the final state and tag `v0.2.0-content`. Leave the worktree on the `structure` branch (don't merge to master without user approval).

## Methodology principles

- **Slow and methodical.** No shortcut extractions. Each entry's recognition cues come from re-reading the source oppgave that uses it.
- **Conservative claims.** When I'm unsure whether two phrasings refer to the same concept, I leave them as separate entries with cross-references. Better redundant than missing.
- **Direct quotes for excerpts.** Example excerpts are direct (or very close) quotes from the original PDF problem, not paraphrased.
- **Verifiable cited solutions.** Detailed solutions show the steps the official løsning shows, with values matching. If the løsning differs from what the formula yields (e.g., table-lookup approximation vs exact computation), I prefer the løsning's value and note the discrepancy.
- **No decoration.** Where the source material is scarce on a topic, I won't pad. Better a brief honest entry than an inflated one.

## Working files (created during this run)

- `WORKING_NOTES.md` – scratch (will be deleted at the end; not committed long-term but intermediate commits OK)
- `docs/superpowers/plans/2026-04-27-content-inventory.md` – committed inventory
- `content/entries/*.yaml`, `content/concepts/*.yaml`, `content/tables/*.yaml` – drafted entries
- `docs/superpowers/plans/2026-04-27-content-extraction-report.md` – final report

## Risk register

| Risk | Mitigation |
|------|------------|
| LaTeX in YAML strings is fragile (escape rules) | Test each entry by running Zod validation; the load test will surface broken YAML; KaTeX rendering is verified by HeroFormula component |
| Detailed solution numbers don't match official løsning | Prefer the official løsning's value; note discrepancy in `common_traps` if material |
| Norwegian terminology inconsistencies between exams | Pick the most common phrasing across the 3 exams; cross-list alternates in recognition cues |
| Some øvinger only have problem PDFs, not solutions | Use the problem text as `excerpt` only; skip `detailed_solutions` for those |
| Time/context budget for a single session | Commit after each batch so progress survives; pace via small batches |

## Order of operations summary

1. Write this plan ✓ (you are reading it)
2. Read all PDFs systematically, append to WORKING_NOTES.md
3. Synthesize WORKING_NOTES into committed `content-inventory.md`
4. Confirm/lock entry templates (refine fixtures if needed)
5. Draft entries category-by-category, commit each batch, run tests after each
6. Final review pass
7. Write extraction report
8. Final commit + tag `v0.2.0-content`
