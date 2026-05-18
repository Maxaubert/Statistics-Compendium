

## 1. Mangler i øvingsarket (vi dekker, PDF mangler)

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
| **C(n+k−1, k) uordnet med tilbakelegging** | 1.9 | **mangler** | ✗ kun PDF (ikke fikset) |
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
| **Normaltilnærming Poisson (heltallskorr.)** | 3.4 | **mangler** | ✗ kun PDF (ikke fikset) |
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
| **n for KI-bredde** | 5.7 | **mangler** | ✗ kun PDF (ikke fikset) |
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
| **KI for E(Y\|x)** | 9.5 | **mangler** | ✗ kun PDF (ikke fikset) |
| Prediksjonsintervall for ny Y | 9.6 | `lineaer-regresjon` (fane) | ✓ begge |
| **Multippel lineær regresjon** | 9.7 | **mangler** | ✗ kun PDF (ikke fikset) |
| Type I/II-feil, styrke | 14, 16.5 | `hypotesefeil-og-styrke` | ✓ FIKSET runde 1 |
| Verdimengde, F(x) | 16.1 | nevnt | △ delvis |
| Geometrisk fordeling | 16.3 | `geometrisk-fordeling` | ✓ FIKSET runde 1 |
| **Normaltilnærming binomial (heltallskorr.)** | 16.4 | **mangler** | ✗ kun PDF (ikke fikset) |
| **Kjikvadrat-tilpasningstest** | — | `kjikvadrat-goodness-of-fit` | ✗ kun site |
| **Kjikvadrat-test for uavhengighet** | — | `kjikvadrat-uavhengighet` | ✗ kun site |
| **KI for to utvalg (μ_X − μ_Y, p_X − p_Y)** | — | `ki-to-utvalg` | ✗ kun site |
| **Bootstrapping** | — | `bootstrapping` | ✗ kun site |
| **«Begge negert» / «bare A»** | — | `produktregel`, `unionssetningen` faner | △ kun site |
| **Finn n via komplement** | — | `komplementregelen` (fane) | △ kun site |

Totalt 41 site-entries og 16 PDF-seksjoner krysset (etter runde 1).

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

### Hva som GJENSTÅR i neste runde
Fra opprinnelige hull:
- Multippel lineær regresjon (entry)
- Normaltilnærming binomial + poisson (2 faner)
- KI for E(Y|x) (fane)
- Finn n for KI-bredde (fane)
- Uordnet utvalg med tilbakelegging (entry, lav prio)
