# Dekningsanalyse: `statt_eksamen.pdf` vs. kompendium-siden

Komplett krysssjekk mellom det 49-siders øvingsdokumentet (`Øvingsark/statt_eksamen.pdf`) og innholdet i `content/entries/` (38 formelsider). Sammenligningen dekker både formler og hver enkelt fane (`solution_variants`) per side.

---

## Sammendrag

| Retning | Antall hull | Alvorlighet |
|---|---|---|
| **Mangler på siden** (PDF har det, vi har ikke) | 9 emner | 5 alvorlige, 4 mindre |
| **Mangler i øvingsarket** (vi har det, PDF har ikke) | 6 emner | 4 alvorlige, 2 mindre |
| **Delvis dekning / nyanser** | 7 punkter | varierer |

---

## 1. Mangler på siden (PDF dekker, vi mangler)

### Alvorlige hull — egne formelsider trengs

#### 1.1 Paret t-test
- **PDF-referanse:** s. 29-30 (seksjon 6.5), eksempel: blodsukker før/etter lurium (mai 2022, 4)
- **Formel:** `T = D̄/(S_D/√n) ~ t_(n−1)`, der `D_i = X_i − Y_i`
- **Status:** Ingen `paret-t-test.yaml` finnes. `wilcoxon-tegn-rang` dekker den ikke-parametriske varianten; `to-utvalgs-t-test` dekker uparet. **Det er et reelt hull.**
- **Anbefaling:** Ny entry `paret-t-test.yaml` med tre faner (`H₁: μ_D < 0`, `H₁: μ_D > 0`, `H₁: μ_D ≠ 0`), parallell til `en-utvalg-t-test`.

#### 1.2 Geometrisk fordeling
- **PDF-referanse:** s. 46-47 (seksjon 16.3), eksempel: terningkast frem til første ener (Øving 3, 5a-g)
- **Formler:** `P(X=x) = p(1−p)^(x−1)`; `E(X) = 1/p`; `Var(X) = (1−p)/p²`; `P(X ≤ x) = 1 − (1−p)^x`
- **Status:** Ingen `geometrisk-fordeling.yaml`. Søk i `entries/` viste null treff på «geometrisk» som fordeling.
- **Anbefaling:** Ny entry parallell til `poisson-fordeling`/`eksponential-fordeling`.

#### 1.3 Multippel lineær regresjon
- **PDF-referanse:** s. 37-38 (seksjon 9.7), eksempel: NOx vs luftfuktighet/temperatur/trykk (mai 2021, 6)
- **Modell:** `ŷ = β̂_0 + β̂_1·x_1 + ... + β̂_k·x_k`; tolkning av p-verdier per koeffisient; KI som inneholder 0 → fjern variabel; R²
- **Status:** `lineaer-regresjon.yaml` dekker bare enkel regresjon (én x).
- **Anbefaling:** Egen entry `multippel-regresjon.yaml`, eller en ny fane på `lineaer-regresjon`.

#### 1.4 Type I-/Type II-feil og styrkefunksjon
- **PDF-referanse:** s. 40 (seksjon 14) for definisjoner; s. 48 (seksjon 16.5) for styrkefunksjon
- **Formler/begreper:** `α` (Type I), `β` (Type II), `1 − β` (styrke); `γ(θ) = P(forkast H₀ | θ sann)`; eksempel kjøttdeig: `k = 14 + 1.645·3/√9 = 15.645`, `γ(14)=0.050`, `γ(15)=0.258`, `γ(16)=0.638`
- **Status:** Ingen entry på siden om feiltyper eller styrke. Søk på «styrke», «type i», «type ii» i `entries/` ga null treff.
- **Anbefaling:** Ny entry `hypotesefeil-og-styrke.yaml`, eventuelt med faner for «Definer Type I/II», «Beregn β for konkret μ», «Plot styrkefunksjon».

#### 1.5 Normaltilnærming til binomial- og poissonfordeling (med heltallskorreksjon)
- **PDF-referanse:**
  - Binomisk → normal: s. 47 (seksjon 16.4), eksempel 300 terningkast `P(Y > 55)` (Øving 4, 1c-d)
  - Poisson → normal: s. 18 (seksjon 3.4), eksempel båter `λ=17/dag i 5 dager` (sept 2022, 3b)
- **Formler:**
  - Binomisk: `P(X ≤ k) ≈ G((k + 0.5 − np)/√(np(1−p)))`
  - Poisson: `P(X ≤ x) ≈ G((x + 0.5 − μ)/σ)`, `μ = λt`, `σ = √(λt)`
- **Status:** Søk på «kontinuitet», «heltallskorr» i `entries/` ga null treff. Verken `binomial-fordeling`, `poisson-fordeling` eller `normalfordeling` har en fane for normaltilnærming med kontinuitetskorreksjon.
- **Anbefaling:** Legg til en fane «Normaltilnærming (med heltallskorr.)» på både `binomial-fordeling` og `poisson-fordeling`.

### Mindre hull — kan dekkes som ny fane/snippet

#### 1.6 Punktestimat-oversikt
- **PDF-referanse:** s. 21 (seksjon 5.1)
- **Formler:** `μ̂ = X̄`, `p̂ = X/n`, `λ̂ = X/t`, `S² = Σ(X_i − X̄)²/(n−1)` (computational form: `(ΣX_i² − nX̄²)/(n−1)`)
- **Status:** Bitene finnes spredt på `utvalgsvarians-radata`, `ki-andel-binomial`, `ki-poissonrate`, men ingen samlet oversikt.
- **Anbefaling:** Ny oversikt-side `punktestimat-oversikt.yaml` på linje med `forventningsverdi-oversikt`, `varians-oversikt`, `standardavvik-oversikt`.

#### 1.7 KI for forventningsverdi i regresjon (`E(Y|x)`)
- **PDF-referanse:** s. 36 (seksjon 9.5), eksempel hvilepuls for 35-åringer (sept 2022, 5e)
- **Formel:** `α̂ + β̂x ± t_(α/2, n−2) · s · √(1/n + ((x−x̄)/(s/SE(β̂)))²)` *(uten «1+» innenfor roten)*
- **Status:** `lineaer-regresjon.yaml` har fane «Prediksjonsintervall for ny Y» (med «1+»), men ingen fane for KI for forventning ved gitt `x`.
- **Anbefaling:** Ny fane «KI for E(Y|x)» på `lineaer-regresjon`, parallell til prediksjonsintervall-fanen.

#### 1.8 Sample-size-formel for KI
- **PDF-referanse:** s. 24 (seksjon 5.7), eksempel `p̂=0.1852, L=0.02 → n=5798` (mai 2021, 4c)
- **Formel (andel):** `n ≥ 4·p̂(1−p̂)·(z_(α/2)/L)²` der L = total intervallengde
- **Status:** `ki-andel-binomial.yaml` har ingen «Finn n»-fane. (`binomial-fordeling` har «Finn n / sjansen overstiger X», men det er noe annet — sannsynlighet, ikke KI-bredde.)
- **Anbefaling:** Legg til fane «Finn n for ønsket KI-bredde» på `ki-andel-binomial` (og evt. `ki-mu-og-varians`).

#### 1.9 Uordnet utvalg MED tilbakelegging
- **PDF-referanse:** s. 9-10 (seksjon 1.9)
- **Formel:** `C(n+k−1, k)`
- **Status:** Vi har tre av fire kombinatorikk-mønstre: `ordnet-utvalg-med-tilbakelegging`, `ordnet-utvalg-uten-tilbakelegging`, `uordnet-utvalg-uten-tilbakelegging`. **Den fjerde celle i 2×2-matrisen mangler.**
- **Anbefaling:** Ny entry `uordnet-utvalg-med-tilbakelegging.yaml` for fullstendighet, selv om det er sjeldent i eksamen.

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

## 4. Anbefalt prioritering

**Høyest prioritet (faktiske eksamensemner som mangler i kompendiet):**
1. Paret t-test (egen entry) — vises i mai 2022 eksamen
2. Geometrisk fordeling (egen entry) — pensumpunkt
3. Type I/II-feil og styrkefunksjon (egen entry) — pensumpunkt, vises i mai 2021 (4d)
4. Normaltilnærming med heltallskorreksjon (to faner) — vises i sept 2022 (3b) og Øving 4 (1c-d)
5. Multippel lineær regresjon (egen entry eller fane) — vises i mai 2021 (6)

**Middels prioritet (utvider eksisterende sider):**
6. KI for E(Y|x) i regresjon (ny fane på `lineaer-regresjon`) — vises i sept 2022 (5e)
7. Finn n for KI-bredde (ny fane på `ki-andel-binomial`) — vises i mai 2021 (4c)
8. Punktestimat-oversikt (ny oversiktsside)

**Lav prioritet (fullstendighet):**
9. Uordnet utvalg med tilbakelegging (`C(n+k−1, k)`) — sjeldent i eksamen

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
| **C(n+k−1, k) uordnet med tilbakelegging** | 1.9 | **mangler** | ✗ kun PDF |
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
| **Normaltilnærming Poisson (heltallskorr.)** | 3.4 | **mangler** | ✗ kun PDF |
| Normalfordeling | 4.1 | `normalfordeling` | ✓ begge |
| Eksponentialfordeling | 4.2 | `eksponential-fordeling` | ✓ begge |
| Memoryless | 4.3 | `eksponential-fordeling` (fane) | ✓ begge |
| Sentralgrenseteoremet (eksplisitt) | 4.4 | spredt | △ delvis |
| **Punktestimater oversikt** | 5.1 | **mangler oversikt** | △ delvis |
| KI for μ (σ kjent) | 5.2 | `ki-mu-og-varians` (fane 1) | ✓ begge |
| KI for μ (σ ukjent) | 5.3 | `ki-mu-og-varians` (fane 2) | ✓ begge |
| KI for andel p | 5.4 | `ki-andel-binomial` | ✓ begge |
| KI for poissonrate λ | 5.5 | `ki-poissonrate` | ✓ begge |
| KI for σ²/σ | 5.6 | `ki-mu-og-varians` (fane 3) | ✓ begge |
| **n for KI-bredde** | 5.7 | **mangler** | ✗ kun PDF |
| Z-test for μ | 6.3 | `en-utvalg-z-test` | ✓ begge |
| T-test for μ | 6.4 | `en-utvalg-t-test` | ✓ begge |
| **Paret t-test** | 6.5 | **mangler** | ✗ kun PDF |
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
| **KI for E(Y\|x)** | 9.5 | **mangler** | ✗ kun PDF |
| Prediksjonsintervall for ny Y | 9.6 | `lineaer-regresjon` (fane) | ✓ begge |
| **Multippel lineær regresjon** | 9.7 | **mangler** | ✗ kun PDF |
| **Type I/II-feil, styrke** | 14, 16.5 | **mangler** | ✗ kun PDF |
| Verdimengde, F(x) | 16.1 | nevnt | △ delvis |
| **Geometrisk fordeling** | 16.3 | **mangler** | ✗ kun PDF |
| **Normaltilnærming binomial (heltallskorr.)** | 16.4 | **mangler** | ✗ kun PDF |
| **Kjikvadrat-tilpasningstest** | — | `kjikvadrat-goodness-of-fit` | ✗ kun site |
| **Kjikvadrat-test for uavhengighet** | — | `kjikvadrat-uavhengighet` | ✗ kun site |
| **KI for to utvalg (μ_X − μ_Y, p_X − p_Y)** | — | `ki-to-utvalg` | ✗ kun site |
| **Bootstrapping** | — | `bootstrapping` | ✗ kun site |
| **«Begge negert» / «bare A»** | — | `produktregel`, `unionssetningen` faner | △ kun site |
| **Finn n via komplement** | — | `komplementregelen` (fane) | △ kun site |

Totalt 38 site-entries og 16 PDF-seksjoner krysset.
