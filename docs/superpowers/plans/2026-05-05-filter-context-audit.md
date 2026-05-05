# Kontekst-basert filter-audit

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** For hvert av de 134 innholdselementene (93 glossary + 41 entries), forestill deg 2–4 eksamensoppgave-kontekster der ordet/formelen dukker opp, og verifiser at filtrene faktisk surface'r det. Identifiser:
1. Filter-verdier som mangler på et entry (entry har ikke filter-tag den kontekstuelt burde ha)
2. Filter-verdier som mangler i `content/filters.yaml` (dimensjon/value-sett er for snevert)

**Architecture:** Tre runder: planning → audit-runs (parallel-dispatched på chunks) → fixes + final test.

---

## Audit-format

For hver item produserer audit-subagenten en rapport-struct:

```yaml
- id: lambda
  type: glossary
  contexts:
    - scenario_no: "Studenten ser en oppgave om Poissonprosess der antall hendelser per minutt er gitt"
      filter_selection_a_student_might_apply:
        distribution_assumption: [poisson]
        parameters_known: [rate_lambda]
        setup: [events_in_window]
      currently_surfaces: true
      missing_tags_on_entry: []
    - scenario_no: "Eksp.fordeling-oppgave med ventetid mellom hendelser"
      filter_selection_a_student_might_apply:
        distribution_assumption: [exponential]
        parameters_known: [rate_lambda]
        setup: [events_in_window]
        random_variable: [time_until_event]
      currently_surfaces: ?  # whether `lambda` glossary has all these tags
      missing_tags_on_entry: [random_variable: time_until_event] # if entry mangler en av disse
  proposed_new_dimensions_or_values_in_filters_yaml: []  # rare, kun hvis dimensjonen mangler globalt
```

Audit-subagenten:
- Itererer over en chunk
- For hvert item: genererer 2–4 realistiske kontekster
- For hver kontekst: lister hvilke filtre en student ville klikket på
- Sjekker mot itemets nåværende `filters` om alle de filtrene er der
- Lister manglende tags og evt. forslag om nye dimensjoner/values i `filters.yaml`
- Skriver findings til en YAML-fil (`audit-findings/<chunk>.yaml`)

---

## Hvordan vi sjekker "surfaces"

For et gitt sett `filter_selection_a_student_might_apply`, regnes itemet som "surfaced" hvis dette holder:

For hver dimensjon `D` med valgte verdier `V_D`:
   `entry.filters[D]` inneholder MINST ÉN av `V_D`.

Det er semantikken til `applyFilters`: AND-på-tvers-av-dimensjoner, OR-innen-dimensjon.

Hvis `currently_surfaces` er `false` for én eller flere kontekster, må enten:
- entry få nye filter-tags (`missing_tags_on_entry`)
- nye dimensjons-verdier opprettes i `filters.yaml` (`proposed_new_dimensions_or_values`)

---

## Tasks

### Task 1: Audit `content/glossary/` (chunk 1: a–g, ~30 entries)
### Task 2: Audit `content/glossary/` (chunk 2: h–n, ~30 entries)
### Task 3: Audit `content/glossary/` (chunk 3: o–z, ~33 entries)
### Task 4: Audit `content/entries/` (chunk 1: 21 entries)
### Task 5: Audit `content/entries/` (chunk 2: 20 entries)

Tasks 1–5 kjøres i parallell. Hver produserer en `audit-findings/<chunk>.yaml`.

### Task 6: Syntese og fix-plan

Les alle 5 audit-rapporter. Aggregér:
- Liste over manglende tags per item (kan trygt legges til mekanisk)
- Liste over foreslåtte nye dimensjoner/values i `filters.yaml` (krever mer omtanke — kanskje bare logge for senere review)

### Task 7: Apply fixes

For hvert manglende tag: oppdater item-yaml.
For nye dimensjon/values: legg til i `filters.yaml`.

### Task 8: Re-run filter-coverage tester + final verification

`npm test -- --run` — alle tester må passere.

Rapporter aggregert oversikt:
- Hvor mange items hadde fullstendig dekning
- Hvor mange tags ble lagt til
- Hvor mange dimensjons-verdier ble lagt til i filters.yaml
- Spesielt nevneverdige funn (terms som krevde mange nye tags)
