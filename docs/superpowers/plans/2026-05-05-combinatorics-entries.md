# Combinatorics-entries: ordnet/uordnet utvalg + multiplikasjonsprinsippet

> **For agentic workers:** Required sub-skill: superpowers:subagent-driven-development.

**Goal:** Fyll inn manglende kombinatorikk-entries så at typiske oppgaver som "kast en terning 6 ganger, P(første tre er sekser)" har en hjemmeside.

**Architecture:** 2 nye fulle entries (combinatorics-type med formel/steg/symboler/eksempler) + 3 nye glossary-termer + oppdatering av eksisterende entries' recognition_cues så studenten kan velge riktig entry.

---

## Innhold som skal lages

### 1. `content/entries/ordnet-utvalg-med-tilbakelegging.yaml` (FULL)

- **Formel:** `n^k`
- **Beskrivelse:** Antall ordnede sekvenser av lengde k når hver posisjon kan være ett av n elementer (tilbakelegging tillatt). Også brukt for "sannsynlighet for spesifikk sekvens".
- **Solution_variants** (minst 3):
  - **Antall mulige sekvenser** — terninger, koder, passord, n^k direkte
  - **Sannsynlighet for spesifikk sekvens** — kast terning 6 ganger, P(første 3 er 6) = (1/6)³ · 1³ = 1/216 (med skjult bruk av `n^k`-tellinger)
  - **Sannsynlighet "minst én"** via komplement — P(≥1 spesielt utfall i k forsøk) = 1 − (1 − p)^k
- **Detailed_solution_variants:** mirror solution_variants
- **Recognition_cues:** "k posisjoner/forsøk", "samme verdi kan dukke opp flere ganger", "uavhengige trekninger"
- **when_NOT_to_use:** "rekkefølge ikke teller → uordnet utvalg (C(n,k))", "uten tilbakelegging → permutasjoner n!/(n−k)!"
- **Symbols:** n, k, n^k
- **Filter-tags:** computes [combinatorial_count, exact_probability], setup [with_replacement], distribution [none_assumed]
- **Related:** uordnet-utvalg-uten-tilbakelegging, ordnet-utvalg-uten-tilbakelegging, gunstige-pa-mulige, produktregel
- **Tools:** kalkulator x^y / power-funksjon
- **Tagline:** "Antall ordnede sekvenser når samme verdi kan gjentas — n velg k med tilbakelegging og rekkefølge."

### 2. `content/entries/ordnet-utvalg-uten-tilbakelegging.yaml` (FULL — permutasjoner)

- **Formel:** `P(n, k) = n! / (n − k)! = n · (n−1) · … · (n−k+1)`
- **Beskrivelse:** Antall ordnede sekvenser av lengde k fra n forskjellige elementer, ingen gjentakelse. Også kjent som permutasjoner.
- **Solution_variants** (minst 3):
  - **Antall ordnede utvalg (k < n)** — top-3 fra 10 deltakere = 10·9·8 = 720
  - **Hele permutasjoner (k = n)** — alle n personer i rekke = n!
  - **Sannsynlighet for spesifikk ordnet sekvens** — trekk 3 spesifikke kort i rekkefølge fra kortstokk, P = 1 / (52·51·50)
- **Detailed_solution_variants:** mirror
- **Recognition_cues:** "rekkefølgen teller", "uten tilbakelegging", "k spesifikke posisjoner skal fylles"
- **when_NOT_to_use:** "rekkefølge ikke teller → uordnet utvalg (C(n,k))", "med tilbakelegging → n^k", "kun ett resultat per trekning uten ordning → gunstige/mulige direkte"
- **Symbols:** n, k, n!, P(n,k)
- **Filter-tags:** computes [combinatorial_count, exact_probability], setup [without_replacement], distribution [none_assumed]
- **Related:** uordnet-utvalg-uten-tilbakelegging, ordnet-utvalg-med-tilbakelegging, gunstige-pa-mulige, produktregel
- **Tools:** kalkulator k! eller nPr
- **Tagline:** "Antall ordnede utvalg av k elementer fra n, der rekkefølgen teller og hvert element kan velges maksimalt én gang."

### 3. `content/glossary/ordnet-utvalg.yaml` (KORT)

- **term_no:** "Ordnet utvalg"
- **short_def:** "Et utvalg der rekkefølgen elementene er trukket teller. (a, b, c) er ulikt fra (b, a, c)."
- **long_def:** Forklaring + 1–2 eksempler + lenker til de to ordnede entries
- **Aliases:** "ordnet utvalg", "permutasjon", "permutasjoner"
- **filters:** matcher overordnet kategori (combinatorial_count)
- **see_also:** ordnet-utvalg-med-tilbakelegging (entry), ordnet-utvalg-uten-tilbakelegging (entry), uordnet-utvalg (glossary)

### 4. `content/glossary/uordnet-utvalg.yaml` (KORT)

- **term_no:** "Uordnet utvalg"
- **short_def:** "Et utvalg der rekkefølgen elementene er trukket IKKE teller. {a, b, c} er det samme som {b, a, c}."
- **long_def:** Forklaring + eksempler + lenke til entry
- **filters:** combinatorial_count, without_replacement
- **see_also:** uordnet-utvalg-uten-tilbakelegging (entry), ordnet-utvalg (glossary)

### 5. `content/glossary/multiplikasjonsprinsippet.yaml` (KORT)

- **term_no:** "Multiplikasjonsprinsippet (telleregelen)"
- **short_def:** "Hvis du kan gjøre A på n₁ måter og B på n₂ måter, kan du gjøre A og B på n₁ · n₂ måter."
- **long_def:** Forklaring + eksempler + lenke til ordnet/uordnet entries
- **filters:** combinatorial_count
- **see_also:** ordnet-utvalg-med-tilbakelegging, ordnet-utvalg-uten-tilbakelegging, gunstige-pa-mulige

---

## Oppdater eksisterende

### `content/entries/uordnet-utvalg-uten-tilbakelegging.yaml`

Allerede har `when_NOT_to_use`-seksjon — men oppdater for å nevne den nye `ordnet-utvalg-med-tilbakelegging`-entryen:

```yaml
when_NOT_to_use:
  - "Rekkefølge er viktig → ordnet utvalg uten tilbakelegging (n!/(n−k)!)"
  - "Tilbakelegging er tillatt og rekkefølge teller → ordnet utvalg med tilbakelegging (n^k)"
```

Også oppdater `related` til å peke på de nye entries.

### `content/entries/gunstige-pa-mulige.yaml`

Legg til `when_NOT_to_use`:

```yaml
when_NOT_to_use:
  - "Utfall er IKKE like sannsynlige → bruk navngitt fordeling (binomial, hypergeom, etc.)"
  - "Utfall er like sannsynlige men du må telle dem først → bruk en av kombinatorikk-entryene (ordnet/uordnet utvalg)"
```

Og oppdater `related` til å inkludere nye entries.

---

## Tasks

### Task 1: Lag `ordnet-utvalg-med-tilbakelegging` (full entry)
### Task 2: Lag `ordnet-utvalg-uten-tilbakelegging` (full entry)
### Task 3: Lag tre nye glossary-entries (ordnet-utvalg, uordnet-utvalg, multiplikasjonsprinsippet)
### Task 4: Oppdater eksisterende uordnet-utvalg-uten-tilbakelegging og gunstige-pa-mulige
### Task 5: Verifiser at filter-coverage testen fortsatt passerer — kjør npm test
### Task 6: Commit i logiske batches

---

## Verifisering

- `npm test -- --run` passerer
- Alle 5 nye yaml-filer parser via Zod (schema-tester må passere)
- Filter-coverage tester finner de nye entries via deres egne tags
- Manuell smoketest: åpne `/entry/ordnet-utvalg-med-tilbakelegging`, sjekk solution_variants tabber, sjekk symbols, sjekk relaterte
