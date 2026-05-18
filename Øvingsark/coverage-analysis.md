# Dekningsanalyse: `statt_eksamen.pdf` vs. kompendium-siden

Komplett krysssjekk mellom det 49-siders øvingsdokumentet (`Øvingsark/statt_eksamen.pdf`) og innholdet i `content/entries/` (nå 41 formelsider). Sammenligningen dekker både formler og hver enkelt fane (`solution_variants`) per side.

> **Status pr. 2026-05-18 (runde 2):** Runde 2 av lukking gjennomført. Alle 5 ✗ MANGLER fra runde 1 er nå lukket. Totalt 2 nye formelsider og 5 nye faner lagt til (samt opprydding i `related:`-blokker på de tre eksisterende kombinatorikk-entriene). Se § 7 for runde-2-loggen, og prefiks `✓ FIKSET` / `△ DELVIS` / `✗ MANGLER` i tabellene under.

---

## Sammendrag

| Retning | Hull opprinnelig | Etter runde 1 | Etter runde 2 | Endring |
|---|---|---|---|---|
| **Mangler på siden** (PDF har det, vi har ikke) | 9 emner | 5 emner | **0 emner** | ✓ alle lukket |
| **Mangler i øvingsarket** (vi har det, PDF har ikke) | 6 emner | 6 emner | 6 emner | — uendret (PDF ikke berørt) |
| **Delvis dekning / nyanser** | 7 punkter | 7 punkter | 7 punkter | — uendret |

---

## 1. Mangler på siden (PDF dekker, vi mangler)

### Alvorlige hull — egne formelsider trengs

#### ~~1.1 Paret t-test~~ — ✓ FIKSET
- **PDF-referanse:** s. 29-30 (seksjon 6.5), eksempel: blodsukker før/etter lurium (mai 2022, 4)
- **Formel:** `T = D̄/(S_D/√n) ~ t_(n−1)`, der `D_i = X_i − Y_i`
- **Status:** Opprettet `content/entries/paret-t-test.yaml` med 5 faner (venstre / høyre / tosidig / `Δ₀ ≠ 0` / KI-sidefane), 8 detaljerte løsninger, full formelforklaring og python-snippet. Glossary `paret-test` lenker nå dit.

#### ~~1.2 Geometrisk fordeling~~ — ✓ FIKSET
- **PDF-referanse:** s. 46-47 (seksjon 16.3), eksempel: terningkast frem til første ener (Øving 3, 5a-g)
- **Formler:** `P(X=x) = p(1−p)^(x−1)`; `E(X) = 1/p`; `Var(X) = (1−p)/p²`; `P(X ≤ x) = 1 − (1−p)^x`
- **Status:** Opprettet `content/entries/geometrisk-fordeling.yaml` med 7 faner (`P(X=k)`, `P(X≤k)`, `P(X>k)`, intervall, `E/Var/σ`, finn `k` for terskel, hukommelsesløshet), 13 detaljerte løsninger, Egenskaper-kort, glossary `geometrisk-fordeling-glos` og `hukommelsesloshet`. Filtertaksonomi utvidet med `geometric`.

#### ~~1.3 Multippel lineær regresjon~~ — ✓ FIKSET runde 2
- **PDF-referanse:** s. 37-38 (seksjon 9.7), eksempel: NOx vs luftfuktighet/temperatur/trykk (mai 2021, 6)
- **Modell:** `ŷ = β̂_0 + β̂_1·x_1 + ... + β̂_k·x_k`; tolkning av p-verdier per koeffisient; KI som inneholder 0 → fjern variabel; R²
- **Status:** Opprettet `content/entries/multippel-regresjon.yaml` med 6 faner (estimere koeffisientene/matriseform, tolke output, R² og R²-adjusted, F-test for hele modellen, variabelseleksjon, predikere ŷ), 2 detaljerte løsninger (NOx-modellen + F-test fra `R² = 0.800`), full common_traps og python_snippet med statsmodels. `lineaer-regresjon.yaml` har fått pekere til den nye sida i `when_NOT_to_use`.

#### ~~1.4 Type I-/Type II-feil og styrkefunksjon~~ — ✓ FIKSET
- **PDF-referanse:** s. 40 (seksjon 14) for definisjoner; s. 48 (seksjon 16.5) for styrkefunksjon
- **Formler/begreper:** `α` (Type I), `β` (Type II), `1 − β` (styrke); `γ(θ) = P(forkast H₀ | θ sann)`; eksempel kjøttdeig: `k = 14 + 1.645·3/√9 = 15.645`, `γ(14)=0.050`, `γ(15)=0.258`, `γ(16)=0.638`
- **Status:** Opprettet `content/entries/hypotesefeil-og-styrke.yaml` med 5 faner (definisjoner / `β(θ)`-beregning / `γ(θ)` / drøft `α` / finn `n` for styrke), 10 detaljerte løsninger inkludert kjøttdeig-eksempelet og tosidig variant. Ny glossary `styrkefunksjon`.

#### ~~1.5 Normaltilnærming til binomial- og poissonfordeling (med heltallskorreksjon)~~ — ✓ FIKSET runde 2
- **PDF-referanse:**
  - Binomisk → normal: s. 47 (seksjon 16.4), eksempel 300 terningkast `P(Y > 55)` (Øving 4, 1c-d)
  - Poisson → normal: s. 18 (seksjon 3.4), eksempel båter `λ=17/dag i 5 dager` (sept 2022, 3b)
- **Status:** Lagt til fane «Normaltilnærming (med heltallskorr.)» på BÅDE `binomial-fordeling.yaml` (med 2 detaljerte løsninger: `P(Y > 55) ≈ 0.198` og tosidig `P(40 ≤ Y ≤ 60) ≈ 0.897`) og `poisson-fordeling.yaml` (med 2 detaljerte løsninger: båt-eksemplet `P(82 ≤ X ≤ 101) ≈ 0.611` og øvre hale `P(X > 100) ≈ 0.0465`). Begge filer fikk `standard_normal_table_E3` lagt til i `tooling:` og `normalfordeling` lagt til i `related:`, samt `Tabell E.3` i `tools:`.

### Mindre hull — kan dekkes som ny fane/snippet

#### ~~1.6 Punktestimat-oversikt~~ — △ DELVIS (løst som glossary)
- **PDF-referanse:** s. 21 (seksjon 5.1)
- **Formler:** `μ̂ = X̄`, `p̂ = X/n`, `λ̂ = X/t`, `S² = Σ(X_i − X̄)²/(n−1)`
- **Status:** Vurdert å lage egen `punktestimat-oversikt.yaml`-entry, men besluttet å heller utvide glossary `punktestimat.yaml` med samlet liste over 11 estimatorer (`μ̂`, `σ̂²`, `σ̂`, `p̂`, `λ̂`, `X̄ − Ȳ`, `p̂_X − p̂_Y`, `D̄`, `β̂`, `α̂`, `S_E²`) og lenker til hovedsidene. Egen entry ville duplisert eksisterende oversikter (forventningsverdi/varians/standardavvik).

#### ~~1.7 KI for forventningsverdi i regresjon (`E(Y|x)`)~~ — ✓ FIKSET runde 2
- **PDF-referanse:** s. 36 (seksjon 9.5), eksempel hvilepuls for 35-åringer (sept 2022, 5e)
- **Status:** Lagt til ny fane «KI for E(Y|x)» på `lineaer-regresjon.yaml`, plassert rett FØR «Prediksjonsintervall for ny Y» for enkel sammenligning. Inkluderer cases-blokk for gitte størrelser, eksplisitt sammenligningstabell PI vs KI («PI ca. 3× bredere ved `x₀ = 35` her»), og 2 detaljerte løsninger: hvilepuls ved `x₀ = 35` (resultat `[72.0, 74.4]`) og ekstra ved `x₀ = x̄ = 41.9` som viser at KI er smalest når `x₀ = x̄`.

#### ~~1.8 Sample-size-formel for KI~~ — ✓ FIKSET runde 2
- **PDF-referanse:** s. 24 (seksjon 5.7), eksempel `p̂=0.1852, L=0.02 → n=5798` (mai 2021, 4c)
- **Formel (andel):** `n ≥ 4·p̂(1−p̂)·(z_(α/2)/L)²` der L = total intervallengde
- **Status:** Lagt til fane «Finn n for ønsket KI-bredde» på BÅDE `ki-andel-binomial.yaml` (PDF-eksempel `n = 5798` + worst-case `p̂ = 0.5` med `n = 2401`) og `ki-mu-og-varians.yaml` (`σ = 10, L = 4 → n = 97` for σ kjent + pilot `s = 12, L = 5 → n = 89` for σ ukjent, med sjekk av t-korreksjon). Begge faner inkluderer tydelig advarsel om at `L` = total bredde (ikke halvbredde) samt alternativ E-form. Migrering: `ki-andel-binomial.yaml` hadde tidligere kun `solution_template:`; nå er det konvertert til `solution_variants:` med to faner.

#### ~~1.9 Uordnet utvalg MED tilbakelegging~~ — ✓ FIKSET runde 2
- **PDF-referanse:** s. 9-10 (seksjon 1.9)
- **Formel:** `C(n+k−1, k)`
- **Status:** Opprettet `content/entries/uordnet-utvalg-med-tilbakelegging.yaml` med 4 faner (tell antall multimengder, stars-and-bars-bevis, fordele k like objekter i n bokser, heltallsløsninger av `x₁ + ... + xₙ = k`), 6 detaljerte løsninger (iskremkuler, terninger, lab-prøver, baller i bokser, x-løsninger, poengfordeling) og full common_traps. De tre andre kombinatorikk-entriene har fått `uordnet-utvalg-med-tilbakelegging` lagt til i `related:`-blokken. **2×2-matrisen er nå komplett.**

---

## 2. Mangler i øvingsarket (vi dekker, PDF mangler)

### Alvorlige hull i PDF-en

#### 2.1 Kjikvadrat-tilpasningstest (goodness-of-fit)
- **Site-referanse:** `kjikvadrat-goodness-of-fit.yaml`
- **Formel:** `χ² = Σ (O_i − E_i)² / E_i`, `ν = k − 1 − m`
- **PDF-status:** PDF nevner `χ²` kun i KI for σ (seksjon 5.6). Ingen seksjon dekker goodness-of-fit. Bekreftet ved søk i tekstutdragene.

#### 2.2 Kjikvadrat-test for uavhengighet (kontingenstabell)
- **Site-referanse:** `kjikvadrat-uavhengighet.yaml`
- **Formel:** `E_ij = (rad_i · kol_j) / n`, `χ² = Σ (O_ij − E_ij)² / E_ij`, `ν = (r−1)(c−1)`
- **PDF-status:** Samme som over — ingen dekning.

#### 2.3 KI for to utvalg (forskjell mellom μ-er og mellom p-er)
- **Site-referanse:** `ki-to-utvalg.yaml` med tre faner: σ kjent (z), σ ukjent (pooled t), andelsforskjell `p_X − p_Y`
- **PDF-status:** PDF har uparet t-test (seksjon 6.6), men ingen seksjon presenterer to-utvalgs-KI eksplisitt. Andelsforskjell `(p̂_X − p̂_Y) ± z·√(...)` finnes ikke i PDF i det hele tatt.

#### 2.4 Bootstrapping
- **Site-referanse:** `bootstrapping.yaml` med to faner: «Tradisjonelt bootstrap-KI» og «Prosentilintervall»
- **PDF-status:** Søk på «bootstrap» / «resampling» i alle PDF-utdragene ga null treff.

### Mindre hull i PDF-en

#### 2.5 Begge-negert betinget `P(Ā | B̄)` og «bare A, ikke B» `P(A ∩ B̄)`
- **Site-referanse:** `produktregel.yaml` (fane «Begge negert»), `unionssetningen.yaml` (fane «Bare A, ikke B»)
- **PDF-status:** PDF dekker `P(A ∪ B)`, `P(A|B)` og komplement separat, men presenterer ikke kombinasjonsmønsteret som dedikerte oppskrifter.

#### 2.6 Finn `n` fra terskel via komplement
- **Site-referanse:** `komplementregelen.yaml` (fane «Finn n for terskel») med formel `n ≥ ln(1−T)/ln(1−p)`
- **PDF-status:** PDF har konkret eksempel (`n > ln(0.01)/ln(0.5) ≈ 6.64`, seksjon 3.1) men ingen generell formel for mønsteret.

---

## 3. Delvis dekning / nyanser

Disse punktene er teknisk dekket i begge, men en av sidene har det grunnere enn den andre — verdt å notere.

| Punkt | PDF | Site | Anmerkning |
|---|---|---|---|
| **Bayes 3+ partisjoner** | bare 2-veis Bayes vist | `bayes-setning` har fane «Multi-hypotese (3+ partisjoner)» | Site er grundigere |
| **Tre-diagram for Bayes** | ikke nevnt | `bayes-setning` har egen fane | Site er grundigere |
| **«Finn ukjent betinget når P(B) er gitt»** | ikke som strukturert mønster | `total-sannsynlighet` har egen fane | Site er grundigere |
| **Trippel-union `P(A∪B∪C)`** | ikke vist | `unionssetningen` `common_traps` nevner inklusjon-eksklusjon | Begge tynne |
| **Pooled-formel `S_P²`** | s. 30-31 (seksjon 6.6) | `to-utvalgs-t-test` + `ki-to-utvalg` (fane 2) | Begge dekket; PDF har én bruk, site har separat KI- og test-anvendelse |
| **Welch (ulike varianser, uparet)** | ikke nevnt | `to-utvalgs-t-test` `when_NOT_to_use` peker dit, men ingen entry | Begge mangler dedikert dekning |
| **Sentralgrenseteoremet (CLT)** | s. 20-21 (seksjon 4.4), eget avsnitt | Nevnt i `normalfordeling` og `sum-uavhengige-normaler` recognition cues, men ingen dedikert entry | PDF har det mer eksplisitt som tema |

---

## 4. Anbefalt prioritering — gjenstående

**Alle PDF-til-side-hull er nå lukket etter runde 2.** Det som gjenstår er △ DELVIS-punktene i § 3 (kvalitets­forbedringer, ikke nye emner):

- **CLT eksplisitt** (PDF s. 20-21): nevnt i `normalfordeling`-cues, men ingen dedikert side. Kan vurderes som egen glossary-entry «sentralgrenseteoremet».
- **Verdimengde/F(x)** (PDF 16.1): bare tatt med i `diskret-stokastisk-variabel`. Kan utvides.
- **Welch (uparet med ulike varianser)** — pekt på i `to-utvalgs-t-test` `when_NOT_to_use`, ingen dedikert side.

**Punktene i runde 1+2 (alle ✓):**
1. ~~Paret t-test~~ — ✓ FIKSET runde 1
2. ~~Geometrisk fordeling~~ — ✓ FIKSET runde 1
3. ~~Type I/II-feil og styrkefunksjon~~ — ✓ FIKSET runde 1
4. ~~Normaltilnærming binomial + Poisson~~ (to faner) — ✓ FIKSET runde 2
5. ~~Multippel lineær regresjon~~ (egen entry) — ✓ FIKSET runde 2
6. ~~KI for E(Y|x)~~ (fane på `lineaer-regresjon`) — ✓ FIKSET runde 2
7. ~~Finn n for KI-bredde~~ (fane på `ki-andel-binomial` + `ki-mu-og-varians`) — ✓ FIKSET runde 2
8. ~~Punktestimat-oversikt~~ — △ LØST som glossary-utvidelse runde 1
9. ~~Uordnet utvalg med tilbakelegging~~ — ✓ FIKSET runde 2

**For PDF-en (hvis den skal utvides):** kjikvadrat-tester (goodness-of-fit og uavhengighet), to-utvalgs-KI, og bootstrap-KI.

---

## 5. Komplett emnetabell (alle emner i begge, side om side)

| Emne | PDF-seksjon | Site-entry | Status |
|---|---|---|---|
| Gunstige på mulige | 1.1 | `gunstige-pa-mulige` | ✓ begge |
| Disjunkte hendelser | 1.2 | (i `unionssetningen` traps) | ✓ delvis |
| Uavhengige hendelser | 1.3 | `produktregel` (fane) | ✓ begge |
| Union/snitt + De Morgan | 1.4 | `unionssetningen`, `produktregel` | ✓ begge |
| Komplementhendelse | 1.5 | `komplementregelen` | ✓ begge |
| Betinget sannsynlighet | 1.6 | `produktregel` | ✓ begge |
| Total sannsynlighet | 1.7 | `total-sannsynlighet` | ✓ begge |
| Bayes' setning | 1.8 | `bayes-setning` | ✓ begge |
| C(n,k) uordnet uten tilbakelegging | 1.9 | `uordnet-utvalg-uten-tilbakelegging` | ✓ begge |
| n!/(n−k)! ordnet uten tilbakelegging | 1.9 | `ordnet-utvalg-uten-tilbakelegging` | ✓ begge |
| n^k ordnet med tilbakelegging | 1.9 | `ordnet-utvalg-med-tilbakelegging` | ✓ begge |
| C(n+k−1, k) uordnet med tilbakelegging | 1.9 | `uordnet-utvalg-med-tilbakelegging` | ✓ FIKSET runde 2 |
| E(X) diskret | 2.1 | `diskret-stokastisk-variabel`, `forventningsverdi-oversikt` | ✓ begge |
| Var/std diskret | 2.2 | `diskret-stokastisk-variabel`, `varians-oversikt`, `standardavvik-oversikt` | ✓ begge |
| Lineær transformasjon | 2.3 | `diskret-stokastisk-variabel` (fane) | ✓ begge |
| Marginalfordeling | 2.4 | `marginalfordeling` | ✓ begge |
| Kovarians | 2.5 | `kovarians` | ✓ begge |
| Korrelasjon ρ | 2.6 | `korrelasjon-joint` | ✓ begge |
| Sum av uavhengige | 2.7 | `sum-uavhengige-normaler` | ✓ begge |
| Binomisk fordeling | 3.1 | `binomial-fordeling` | ✓ begge |
| Hypergeometrisk | 3.2 | `hypergeometrisk-fordeling` | ✓ begge |
| Poissonfordeling | 3.3 | `poisson-fordeling` | ✓ begge |
| Normaltilnærming Poisson (heltallskorr.) | 3.4 | `poisson-fordeling` (fane) | ✓ FIKSET runde 2 |
| Normalfordeling | 4.1 | `normalfordeling` | ✓ begge |
| Eksponentialfordeling | 4.2 | `eksponential-fordeling` | ✓ begge |
| Memoryless | 4.3 | `eksponential-fordeling` (fane) | ✓ begge |
| Sentralgrenseteoremet (eksplisitt) | 4.4 | spredt | △ delvis |
| Punktestimater oversikt | 5.1 | `punktestimat` (glossary utvidet) | ✓ FIKSET runde 1 |
| KI for μ (σ kjent) | 5.2 | `ki-mu-og-varians` (fane 1) | ✓ begge |
| KI for μ (σ ukjent) | 5.3 | `ki-mu-og-varians` (fane 2) | ✓ begge |
| KI for andel p | 5.4 | `ki-andel-binomial` | ✓ begge |
| KI for poissonrate λ | 5.5 | `ki-poissonrate` | ✓ begge |
| KI for σ²/σ | 5.6 | `ki-mu-og-varians` (fane 3) | ✓ begge |
| n for KI-bredde | 5.7 | `ki-andel-binomial` (fane) + `ki-mu-og-varians` (fane) | ✓ FIKSET runde 2 |
| Z-test for μ | 6.3 | `en-utvalg-z-test` | ✓ begge |
| T-test for μ | 6.4 | `en-utvalg-t-test` | ✓ begge |
| Paret t-test | 6.5 | `paret-t-test` | ✓ FIKSET runde 1 |
| Uparet t-test | 6.6 | `to-utvalgs-t-test` | ✓ begge |
| Z-test for andel | 6.7 | `en-utvalg-z-test-andel` | ✓ begge |
| p-verdi (regelverk) | 6.8 | spredt i z/t-entries | ✓ begge |
| Mann-Whitney-Wilcoxon | 7.2 | `mann-whitney-wilcoxon` | ✓ begge |
| Wilcoxon paret | 7.3 | `wilcoxon-tegn-rang` | ✓ begge |
| Enveis ANOVA | 8 | `enveis-anova` | ✓ begge |
| Empirisk korrelasjon r | 9.1 | `lineaer-regresjon` (fane) | ✓ begge |
| Estimering av α̂, β̂ | 9.2 | `lineaer-regresjon` | ✓ begge |
| Variansestimat S_E², SE(β̂) | 9.3 | `lineaer-regresjon` | ✓ begge |
| Hypotesetest for β | 9.4 | `lineaer-regresjon` (fane) | ✓ begge |
| KI for E(Y\|x) | 9.5 | `lineaer-regresjon` (fane) | ✓ FIKSET runde 2 |
| Prediksjonsintervall for ny Y | 9.6 | `lineaer-regresjon` (fane) | ✓ begge |
| Multippel lineær regresjon | 9.7 | `multippel-regresjon` | ✓ FIKSET runde 2 |
| Type I/II-feil, styrke | 14, 16.5 | `hypotesefeil-og-styrke` | ✓ FIKSET runde 1 |
| Verdimengde, F(x) | 16.1 | nevnt | △ delvis |
| Geometrisk fordeling | 16.3 | `geometrisk-fordeling` | ✓ FIKSET runde 1 |
| Normaltilnærming binomial (heltallskorr.) | 16.4 | `binomial-fordeling` (fane) | ✓ FIKSET runde 2 |
| **Kjikvadrat-tilpasningstest** | — | `kjikvadrat-goodness-of-fit` | ✗ kun site |
| **Kjikvadrat-test for uavhengighet** | — | `kjikvadrat-uavhengighet` | ✗ kun site |
| **KI for to utvalg (μ_X − μ_Y, p_X − p_Y)** | — | `ki-to-utvalg` | ✗ kun site |
| **Bootstrapping** | — | `bootstrapping` | ✗ kun site |
| **«Begge negert» / «bare A»** | — | `produktregel`, `unionssetningen` faner | △ kun site |
| **Finn n via komplement** | — | `komplementregelen` (fane) | △ kun site |

Totalt 43 site-entries (41 + 2 nye fra runde 2: `multippel-regresjon` og `uordnet-utvalg-med-tilbakelegging`) og 16 PDF-seksjoner krysset (etter runde 2).

---

## 6. Endringslogg — runde 1 (2026-05-18)

### Nye formelsider
- **`content/entries/paret-t-test.yaml`** — 5 faner, 8 detaljerte løsninger, full formelforklaring med 5 kort
- **`content/entries/geometrisk-fordeling.yaml`** — 7 faner, 13 detaljerte løsninger, formelforklaring (3 kort) + Egenskaper-kort (3 kort) i `property-explanations.ts`
- **`content/entries/hypotesefeil-og-styrke.yaml`** — 5 faner, 10 detaljerte løsninger, formelforklaring (4 kort)

### Nye glossary-entries
- **`content/glossary/styrkefunksjon.yaml`** — definisjon av `γ(θ) = 1 − β(θ)` med kurveform og sjekkpunkter
- **`content/glossary/hukommelsesloshet.yaml`** — `P(X > s + t | X > s) = P(X > t)` med bevis, geometrisk + eksponential
- **`content/glossary/geometrisk-fordeling-glos.yaml`** — kort definisjon med pekere til hovedside
- **`content/glossary/mengdelaere.yaml`** — komplett oppslagsverk for set-operasjoner: alle konverteringer mellom `P(A∪B)`, `P(A∩B)`, `P(Ā∩B̄)`, `P(A∩B̄)`, `P(Ā∩B)`; spesialtilfeller; inklusjon-eksklusjon

### Utvidede glossary-entries
- **`content/glossary/punktestimat.yaml`** — utvidet fra 5 til 11 estimator-linjer med lenker til hovedsider (`μ̂`, `σ̂²`, `σ̂`, `p̂`, `λ̂`, `X̄ − Ȳ`, `p̂_X − p̂_Y`, `D̄`, `β̂`, `α̂`, `S_E²`)
- **`content/glossary/uavhengighet-glos.yaml`** — lagt til test-prosedyre, tabell over hvordan finne `P(A∩B)` i 6 situasjoner, bruksmønstre på tvers
- **`content/glossary/betinget-sannsynlighet-glos.yaml`** — tabell over alle 8 betingede former (`P(A|B)` ... `P(B̄|Ā)`) med snarveier; alle joint-formler
- **`content/glossary/paret-test.yaml`** — lenker nå til ny `paret-t-test` formelside

### Filter-taksonomi
- **`content/filters.yaml`** — lagt til `geometric` i `distribution_assumption`

### Tester
- 167/167 filter-coverage-tester passerer (1 ny pga `mengdelaere`)
- TypeScript-bygg rent
- Pre-eksisterende Math.test.tsx-feil ikke relatert

### Hva som GJENSTOD etter runde 1 — alle fikset i runde 2:
- ~~Multippel lineær regresjon~~ (entry) — ✓ runde 2
- ~~Normaltilnærming binomial + poisson~~ (2 faner) — ✓ runde 2
- ~~KI for E(Y|x)~~ (fane) — ✓ runde 2
- ~~Finn n for KI-bredde~~ (fane) — ✓ runde 2
- ~~Uordnet utvalg med tilbakelegging~~ (entry) — ✓ runde 2

---

## 7. Endringslogg — runde 2 (2026-05-18)

### Nye formelsider
- **`content/entries/multippel-regresjon.yaml`** — 6 faner (estimere koeffisientene/matriseform `β̂ = (X^T X)^(-1) X^T y`, tolke output med p-verdier og KI, R² + R²-adjusted, F-test for hele modellen, variabelseleksjon, predikere ŷ), 2 detaljerte løsninger (NOx-modellen mai 2021/6 + F-test fra `R² = 0.800`), 10 common_traps, python_snippet med `statsmodels.OLS`.
- **`content/entries/uordnet-utvalg-med-tilbakelegging.yaml`** — 4 faner (tell antall multimengder, stars-and-bars-bevis med bijeksjon, fordele k like objekter i n bokser, heltallsløsninger av `x₁ + ... + xₙ = k`), 6 detaljerte løsninger (iskremkuler, 2 like terninger, 6 prøver til 3 lab, baller i bokser, x-løsninger, poengfordeling), 9 common_traps.

### Nye faner på eksisterende entries
- **`content/entries/binomial-fordeling.yaml`** — ny fane «Normaltilnærming (med heltallskorr.)» med 13 steg som dekker alle haler (`P(X ≤ k)`, `P(X ≥ k)`, `P(X > k)`, `P(a ≤ X ≤ b)`, `P(X = k)`), 2 detaljerte løsninger. `tooling` utvidet med `standard_normal_table_E3` og `calculator_sqrt`. `related` får ny peker til `normalfordeling`. `tools:` får ny linje for tabell E.3.
- **`content/entries/poisson-fordeling.yaml`** — ny fane «Normaltilnærming (med heltallskorr.)» tilsvarende, 2 detaljerte løsninger (båt-eksempel sept 2022/3b og øvre hale). Samme utvidelser i `tooling`, `related`, `tools`.
- **`content/entries/lineaer-regresjon.yaml`** — ny fane «KI for E(Y|x)» plassert rett før «Prediksjonsintervall for ny Y» for enkel sammenligning. Inkluderer eksplisitt PI-vs-KI sammenligningstabell. 2 detaljerte løsninger (hvilepuls ved `x₀ = 35` og ved `x₀ = x̄`). Også oppdatert `when_NOT_to_use` til å peke til `multippel-regresjon`.
- **`content/entries/ki-andel-binomial.yaml`** — migrert fra `solution_template:` til `solution_variants:` med to faner («KI for andel p» bevart + ny «Finn n for ønsket KI-bredde» med worst-case-snarvei `p̂ = 0.5`). 2 detaljerte løsninger på den nye fanen (mai 2021/4c `n = 5798` + worst-case `n = 2401`).
- **`content/entries/ki-mu-og-varians.yaml`** — ny fane «Finn n for ønsket KI-bredde» som dekker både σ kjent (`n = 97` for `σ = 10, L = 4`) og σ ukjent (pilot `s = 12, L = 5 → n = 89` med sjekk av t-korreksjon `n = 91`). 2 detaljerte løsninger.

### Oppdaterte `related:`-blokker
- `content/entries/uordnet-utvalg-uten-tilbakelegging.yaml` — peker nå til `uordnet-utvalg-med-tilbakelegging`
- `content/entries/ordnet-utvalg-med-tilbakelegging.yaml` — peker nå til `uordnet-utvalg-med-tilbakelegging`
- `content/entries/ordnet-utvalg-uten-tilbakelegging.yaml` — peker nå til `uordnet-utvalg-med-tilbakelegging`

### Tester
- 478/479 tester PASS (200 i de fire kjernetestsuitene: schema 11 + loadContent 5 + filter-coverage 169 + glossary-link 15). Filter-coverage gikk fra 167 → 169 (én ny per nytt entry).
- Eneste feilende test: `src/components/primitives/Math.test.tsx` (pre-eksisterende KaTeX-fallback-feil, ikke relatert til denne endringen).
- TypeScript-bygg rent (`npx tsc --noEmit` uten output).

### Hva som GJENSTÅR
Ingen ✗ MANGLER igjen. △ DELVIS-punktene fra §3 (CLT eksplisitt, F(x)/verdimengde, Welch) er kvalitetsforbedringer, ikke nye emner — ikke en del av runde-2-omfanget.
