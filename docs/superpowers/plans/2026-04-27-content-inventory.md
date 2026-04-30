# Content Inventory – ITD20218 Statistikk-kompendium

**Date drafted:** 2026-04-27
**Source materials covered:**
- `statistikk_eksamen_jan25.pdf` + løsningsforslag
- `statistikk_eksamen_mai25.pdf` + løsningsforslag
- `statistikk_eksamen_jan26.pdf` + løsningsforslag
- `hypotesetest_oversikt.pdf` (course handout)
- `bootstrapping.pdf` (course handout)

**Not read in this pass:** `statistikk_oving1_v26.pdf` through `statistikk_oving7_v26.pdf` and their løsningsforslag. The 3 exams + 2 reference docs covered the full conceptual range; øvinger would primarily contribute additional example oppgaver of existing entries.

## Summary statistics

- **31 formula entries** (`content/entries/`)
- **16 concept entries** (`content/concepts/`)
- **6 table entries** (`content/tables/`)
- **53 entries total**
- **20+ worked detailed solutions** drawn from real exam problems
- **Approximately 35 example excerpts** with one-line solution sketches

## Coverage matrix – which entry exemplifies which exam oppgave

### Eksamen jan26 (most recent, primary anchor)

| Oppgave | Entry/entries used | Detailed solution? |
|--------|-------------------|--------------------|
| 1a (skopar) | gunstige-pa-mulige | – (concept) |
| 1b (høyre/venstresko) | produktregel, betinget-sannsynlighet | example sketch |
| 1c (myntkast) | binomial-fordeling, komplementregelen | yes |
| 2a (E[X], E[Y]) | forventningsverdi-diskret, marginalfordeling | – |
| 2b (σ_X, σ_Y) | varians-standardavvik-diskret | yes |
| 2c (ρ) | kovarians, korrelasjon-joint | example sketch |
| 3a (P(A∪B)) | unionssetningen | yes |
| 3b (P(A\|C̄)) | betinget-sannsynlighet, komplementregelen, disjunkte-hendelser | – |
| 4a (P(X=0)) | poisson-fordeling | yes |
| 4b (P(X≥3)) | poisson-fordeling, komplementregelen | yes |
| 4c (T fordeling?) | eksponential-fordeling, poisson-prosess | – |
| 4d (P(T>48)) | eksponential-fordeling | yes |
| 4e (KI for λ) | ki-poissonrate | yes |
| 5 (uparet t-test) | to-utvalgs-t-test, interpolert-varians | yes |
| 6 (prediksjonsintervall) | regresjon-prediksjonsintervall | yes |

### Eksamen mai25

| Oppgave | Entry/entries used | Detailed solution? |
|--------|-------------------|--------------------|
| 1a-c (E,σ,ρ joint) | forventningsverdi-diskret, varians-standardavvik-diskret, kovarians, korrelasjon-joint | example sketch |
| 2a (uavhengighet) | uavhengighet-hendelser | – |
| 2b (P(M̄\|F̄)) | de-morgans-lov, betinget-sannsynlighet | – |
| 2c (P(tran)) | total-sannsynlighet | yes |
| 3a (P(X≥2) binomial) | binomial-fordeling | yes |
| 3b (KI for p) | ki-andel-binomial | yes |
| 4a (normal mellom 305-310) | normalfordeling | yes |
| 4b (z-test μ<302) | en-utvalg-z-test | yes |
| 4c (p-verdi) | p-verdi (concept) | – |
| 4d (finn μ) | normalfordeling | yes |
| 5b (korrelasjon r) | regresjon-korrelasjonskoeffisient | yes |
| 5c (regresjonslinje) | regresjon-estimat-alpha-beta | yes |
| 5d (test β=0) | regresjon-test-stigningstall, regresjon-residualvarians, regresjon-standardfeil-stigningstall | yes |

### Eksamen jan25

| Oppgave | Entry/entries used | Detailed solution? |
|--------|-------------------|--------------------|
| 1a (alle hjerter) | hypergeometrisk-fordeling, uordnet-utvalg-uten-tilbakelegging | yes |
| 1b (ikke alle) | komplementregelen | example sketch |
| 1c (ingen hjerter) | hypergeometrisk-fordeling | example sketch |
| 1d (disjunkte?) | disjunkte-hendelser | – |
| 2a-c (E, Var, ...) | forventningsverdi-diskret, varians-standardavvik-diskret | example sketches |
| 3a (Bayes) | bayes-setning | yes |
| 3b (total sannsynlighet) | total-sannsynlighet | – |
| 4a (Poisson 1 eller 2) | poisson-fordeling | yes |
| 4b (minst ett) | poisson-fordeling, eksponential-fordeling | example sketch |
| 4c (KI for rate) | ki-poissonrate | example sketch |
| 5a (P(X<24) normal) | normalfordeling, standardnormalisering | yes |
| 5b (sum av 5 trykk) | sum-uavhengige-normaler | yes |
| 6 (z-test ny julelys) | en-utvalg-z-test | yes |

## Coverage gaps (intentional)

These entries exist for completeness even though they don't appear directly in the 3 exams I read:

- **hypergeometrisk-fordeling** – used in jan25 oppg 1 implicitly via gunstige/mulige; full distribution rarely named in these exams.
- **en-utvalg-t-test** – appears in `hypotesetest_oversikt.pdf` as the second of three core tests; not used in the exams I read but pensum-required.
- **en-utvalg-z-test-andel** – third in `hypotesetest_oversikt.pdf`; same situation.
- **ki-mu-kjent-sigma** and **ki-mu-ukjent-sigma** – implicit in pensum even when not used directly in these exams.

## Entries grouped by category

### Distributions (5)
- binomial-fordeling
- eksponential-fordeling
- hypergeometrisk-fordeling
- normalfordeling
- poisson-fordeling

### Hypothesis tests (5)
- en-utvalg-t-test
- en-utvalg-z-test
- en-utvalg-z-test-andel
- regresjon-test-stigningstall
- to-utvalgs-t-test

### Confidence intervals (4)
- ki-andel-binomial
- ki-mu-kjent-sigma
- ki-mu-ukjent-sigma
- ki-poissonrate

### Linear regression (5)
- regresjon-estimat-alpha-beta
- regresjon-korrelasjonskoeffisient
- regresjon-prediksjonsintervall
- regresjon-residualvarians
- regresjon-standardfeil-stigningstall

### Probability rules (5)
- bayes-setning
- komplementregelen
- produktregel
- total-sannsynlighet
- unionssetningen

### Combinatorics (1)
- uordnet-utvalg-uten-tilbakelegging

### Joint-distribution properties / identities (6)
- forventningsverdi-diskret
- varians-standardavvik-diskret
- marginalfordeling
- kovarians
- korrelasjon-joint
- sum-uavhengige-normaler

### Concepts (16)
- betinget-sannsynlighet
- bootstrapping
- de-morgans-lov
- disjunkte-hendelser
- fellesfordeling
- frihetsgrader
- gunstige-pa-mulige
- interpolert-varians
- p-verdi
- poisson-prosess
- prosentilintervall
- sentralgrenseteoremet
- signifikansnivaa
- spredningsplott
- standardnormalisering
- uavhengighet-hendelser

### Tables (6)
- E1-binomial-kumulativ
- E2-poisson-kumulativ
- E3-z-tabell
- E4-z-kvantiltabell
- E5-t-tabell
- E6-kjikvadrattabell

## Cross-reference graph (high-level)

Notable cross-reference clusters:

**Poisson family:** poisson-fordeling ↔ eksponential-fordeling ↔ poisson-prosess ↔ ki-poissonrate ↔ E.2

**Normal family:** normalfordeling ↔ standardnormalisering ↔ sum-uavhengige-normaler ↔ en-utvalg-z-test ↔ ki-mu-kjent-sigma ↔ E.3, E.4

**Regression family:** regresjon-estimat-alpha-beta ↔ regresjon-korrelasjonskoeffisient ↔ regresjon-residualvarians ↔ regresjon-standardfeil-stigningstall ↔ regresjon-test-stigningstall ↔ regresjon-prediksjonsintervall ↔ E.5

**Probability rules:** unionssetningen ↔ komplementregelen ↔ produktregel ↔ total-sannsynlighet ↔ bayes-setning, all cross-linked

**Joint-distribution:** fellesfordeling concept anchors marginalfordeling → forventningsverdi-diskret → varians-standardavvik-diskret → kovarians → korrelasjon-joint
