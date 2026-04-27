# Working notes — content extraction (do not commit long-term)

Scratch space for observations as I read source PDFs. Will be synthesized into `docs/superpowers/plans/2026-04-27-content-inventory.md` and then deleted.

## Conventions

- I cite sources as `Eksamen jan26 · 4a` or `Øving 3 · 2b` etc.
- For each oppgave, note: short setup, what's asked, formulas/concepts used, official answer.
- I flag any discrepancies between my reading and the official løsning.

---

## Eksamen jan26 (read + løsning read)

### Oppgave 1 — kombinatorikk, basic sannsynlighet, binomial
Setup: 5 par sko (10 sko totalt) i en haug. Plukker tilfeldig 2.

**1a)** P(skoene hører sammen?). Method: gunstige/mulige with sequential thinking. After 1st pick, 9 remain, 1 favorable. **= 1/9 ≈ 0.111**.
- Concept: uniform sannsynlighetsfordeling, telle gunstige/mulige.

**1b)** P(en høyresko og en venstresko, ikke nødv. samme par). Method 1: gunstige/mulige; method 2: produktregel + summen av to hendelser P(H1∩V2) + P(V1∩H2). **= 5/9 ≈ 0.556**.
- Concept: betinget sannsynlighet, produktregel P(A∩B) = P(A)·P(B|A), unionssannsynlighet.

**1c)** Mynt kastes. Hvor mange ganger n må den kastes så P("kron" minst én gang) > 0.99?
- Method: X ~ Binomial(n, 0.5), P(X≥1) = 1 - P(X=0) = 1 - 0.5^n > 0.99 → 0.5^n < 0.01 → n > ln(0.01)/ln(0.5) ≈ 6.6 → n ≥ 7.
- Alternative: lookup in cumulative binomial tabell.
- Concept: binomial-fordeling, komplementregelen, "minst én"-trikset.

### Oppgave 2 — fellesfordeling, E, Var, σ, Cov, ρ
Setup: simultanfordeling for X,Y i 3×3-tabell. X ∈ {0,1,2}, Y ∈ {0,5,10}.

**2a)** Beregn E(X) og E(Y).
- Method: regn ut marginalfordelingene først (sum av rader = P(X=x), sum av kolonner = P(Y=y)). Da E = Σ x·P(X=x).
- E(X) = 0·0.4+1·0.3+2·0.3 = **0.9**
- E(Y) = 0·0.5+5·0.1+10·0.4 = **4.5**

**2b)** Standardavvik for X og Y.
- Var(X) = E(X²) - μX² = 0²·0.4+1²·0.3+2²·0.3 - 0.81 = 0.69, σX = √0.69 = **0.831**
- Var(Y) = 0+2.5+40 - 20.25 = 22.25, σY = √22.25 = **4.717**

**2c)** Korrelasjon ρ(X,Y).
- Cov(XY) = E(XY) - μXμY. E(XY) = ΣΣ xi·yj·p(xi,yj) = 1·10·0.2 + 2·10·0.1 = 4.
- Cov = 4 - 0.9·4.5 = -0.05
- ρ = Cov/(σXσY) = -0.05/(0.831·4.717) = **-0.013**.
- Concepts: marginalfordeling, kovarians, korrelasjon, formel σ²=E(X²)-μ².

### Oppgave 3 — sannsynlighetsregler (union, betinget med komplement, disjunkte)
Setup: P(A)=0.30, P(B)=0.25, P(C)=0.40, P(A∩B)=0.15. A og C disjunkte. B og C disjunkte.

**3a)** Finn P(A∪B). Method: P(A∪B) = P(A)+P(B)-P(A∩B) = 0.3+0.25-0.15 = **0.40**.

**3b)** Finn P(A | C̄). Tricky: A og C disjunkte → A ⊆ C̄ → P(A∩C̄)=P(A). Da P(A|C̄) = P(A)/(1-P(C)) = 0.3/0.6 = **0.5**.
- Concepts: betinget sannsynlighet, disjunkte hendelser, komplementregelen, unionssetningen.

### Oppgave 4 — Poissonprosess, Poissonfordeling, Eksponentialfordeling, KI for rate
Setup: klippeblåvinger fanges som poissonprosess med rate λ pr. time. X = antall i 1 uke (168 t).

**4a)** P(X=0) når λ=0.01/t. λt = 1.68. **= e^(-1.68) = 0.1864**.

**4b)** P(X≥3). Method: 1 - P(X≤2) = 1 - (P(X=0)+P(X=1)+P(X=2)) = 1 - (0.1864+0.3131+0.2630) = 1 - 0.7625 = **0.2375**.
- ⚠️ My existing fixture had the WRONG answer (0.232 from table-lookup approximation). Must fix to 0.2375 to match the official direct-computation answer. The 0.7681 table value was for μ=1.7 (rounded), but exact at μ=1.68 is 0.7625.

**4c)** T = ventetid til første fangst. Hvilken fordeling, hvilken parameter? Eksponentialfordeling med λ=0.01/t.

**4d)** P(T>48) for eksponentialfordelt T. F(t) = 1-e^(-λt). P(T>48) = 1-F(48) = e^(-0.48) = **0.6188**.

**4e)** 90% KI for λ basert på 15 fanger i 5 uker (840 t). Formula: λ̂ ± z_(α/2) · √(λ̂/t). λ̂=15/840=0.01786. z_0.05=1.645. CI = 0.01786 ± 0.00758 = **[0.010, 0.025]**. Krav: λt > 10 for god approximation (her λ̂t = 15, OK).

### Oppgave 5 — to-utvalgs t-test (uparet, pooled variance)
Setup: gammel metode n=10, ny metode n=9 (én syk). To utvalg, normalfordelte, ukjent σ.

**5a)** Hypoteser. H₀: μY ≤ μX, H₁: μY > μX (venstresidig på X-Y, høyresidig på Y-X). Type: uparet T-test.

**5b)** Gjennomfør med α=0.01.
- Test obs: T = (X̄-Ȳ)/(SP·√(1/nX+1/nY))
- SP² = ((nX-1)·SX² + (nY-1)·SY²)/(nX+nY-2). df = nX+nY-2 = 17.
- Kvantil: t_(α,17) = t_(0.01,17) = 2.567 (one-tailed)
- x̄=71.30, ȳ=74.44, sX²=205.34, sY²=385.78
- sP² = (9·205.34+8·385.78)/17 = 290.25 → sP = 17.04
- t = (71.30-74.44)/(17.04·√(1/10+1/9)) = -3.14/7.83 = **-0.40**
- Forkastingsregel: forkast H₀ hvis t < -t_(0.01,17) = -2.567. -0.40 > -2.567, derfor IKKE forkast.
- Konklusjon: ingen grunnlag for å hevde at ny metode er bedre.
- Concepts: pooled variance (interpolert varians), df calculation, one-sided test direction.

### Oppgave 6 — lineær regresjon, prediksjonsintervall
Setup: 10 obs av (søvntimer x, eksamensresultat y%). Regresjonslinje ŷ = 34.6 + 6.63x. SE² = 6.093. SE(β̂) = 0.625.
**Spm:** 95% prediksjonsintervall for Y ved x=5. Er 75% sannsynlig?
- Formel: α̂ + β̂·x ± t_(α/2,ν) · s · √(1 + 1/n + ((x-x̄)/(s/SE(β̂)))²)  (this textbook's specific form)
- df = n-2 = 8, t_(0.025,8) = 2.306, s = √6.093 = 2.4684, x̄ = 6.8
- Punkt: 34.6 + 6.63·5 = 67.75
- Margin: 2.306·2.4684·√(1 + 1/10 + ((5-6.8)/(2.4684/0.625))²) = 5.692·√1.30772 = 6.51
- Intervall: 67.75 ± 6.51 = **[61.24, 74.26]**
- Konklusjon: 75% er utenfor intervallet → IKKE sannsynlig at student med 5t søvn får 75%+.
- Concepts: prediksjonsintervall, t-fordeling df=n-2, residualenes varians, standard error of slope.
- Note: This textbook's formulation is unusual — uses (x-x̄)/(s/SE(β̂)) inside the squared term, where most textbooks write Sxx directly. Mathematically equivalent but distinctive notation. Preserve in entry.

---

## Distribusjon-/konseptliste hittil (jan26 only)

Distinct entries identified so far:
1. binomial-fordeling (1c)
2. poisson-fordeling (4a, 4b)
3. eksponential-fordeling (4d)
4. unionssetning (3a)
5. betinget-sannsynlighet (1b, 3b)
6. produktregel (1b)
7. komplementregelen (1c, 4b)
8. fellesfordeling (2a-c) — concept
9. marginalfordeling (2a) — concept
10. forventningsverdi (2a)
11. varians-formel (2b)
12. kovarians (2c)
13. korrelasjon (2c)
14. konfidensintervall-poisson-rate (4e)
15. to-utvalgs-t-test (5)
16. interpolert-varians-pooled (5b) — formula component
17. lineaer-regresjon-prediksjonsintervall (6)
18. poisson-prosess (4) — concept
19. uniform-sannsynlighetsfordeling (1a) — concept
20. disjunkte-hendelser (3) — concept

Tables used:
- E.1 binomialtabell (1c — for n=7)
- E.2 poissontabell (4b — checking, but not used since exact computation preferred)
- E.4 normal-kvantiltabell (4e — z_0.05=1.645)
- E.5 t-tabell (5b — t_0.01,17=2.567; 6 — t_0.025,8=2.306)

---

## Eksamen jan25 (read + løsning read)

### Oppgave 1 — kombinatorikk uten tilbakelegging (kortstokk)
Setup: Trekker 5 kort fra 52, 13 av disse er hjerter.

**1a)** P(alle 5 er hjerter)? Method: gunstige/mulige. g=C(13,5)=1287, m=C(52,5)=2598960. **= 1287/2598960 ≈ 0.000495**.
- Alternative: produktregel 13/52 · 12/51 · 11/50 · 10/49 · 9/48 (same answer).
- Concept: uordnet utvalg uten tilbakelegging, binomialkoeffisient (kombinatorikk).

**1b)** P(ikke alle er hjerter). Method: komplementregelen. **= 1 - 0.000495 = 0.999505**.

**1c)** P(ingen er hjerter). Method: g = C(39,5), m = C(52,5). **= 575757/2598960 = 0.2215**.

**1d)** Disjunkte hendelser? Ja (ikke mulig at 5 er hjerter OG 0 er hjerter samtidig).
- Concept: disjunkte (gjensidig utelukkende) hendelser, definisjon.

### Oppgave 2 — diskret sannsynlighetsfordeling, P(X>0), E, Var
Setup: X-verdier {-2,-1,0,1,2} med sannsynligheter {0.3,0.2,0.2,0.1,0.2}.

**2a)** P(X>0) = P(X=1)+P(X=2) = **0.3**.
**2b)** E(X) = Σ xi·P(X=xi) = -0.6-0.2+0+0.1+0.4 = **-0.3**.
**2c)** Var(X) = Σ xi²·P(X=xi) - μ² = 1.2+0.2+0+0.1+0.8-0.09 = **2.21**.
- Concept: diskret stokastisk variabel, formler for forventning og varians.

### Oppgave 3 — Bayes' setning, total sannsynlighet
Setup: P(spire) = 0.8 (totalt), P(ringblomst) = 0.6, P(spire|ringblomst) = 0.9. Finn P(R|S) og P(spire | ikke-ringblomst).

**3a)** P(R|S) = Bayes: P(R)·P(S|R)/P(S) = 0.6·0.9/0.8 = **0.675**.
**3b)** P(S|R̄). Method: setningen om total sannsynlighet P(S) = P(R)·P(S|R) + P(R̄)·P(S|R̄). Solve: P(S|R̄) = (P(S)-P(R)·P(S|R))/(1-P(R)) = (0.8-0.54)/0.4 = **0.65**.
- Concepts: Bayes' setning, total sannsynlighet, betinget sannsynlighet (full pakke).

### Oppgave 4 — Poissonprosess (vulkan)
Setup: rate 0.0261 utbrudd/måned. 5 års leiekontrakt = 60 måneder.

**4a)** P(X=1) + P(X=2) når λt = 0.0261·60 = 1.5678. P(X=1) = 1.5678·e^(-1.5678) = 0.327. P(X=2) = 1.5678²/2·e^(-1.5678) = 0.256. **Sum = 0.583**.
**4b)** P(minst ett utbrudd) = 1 - P(X=0) = 1 - e^(-1.5678) = 1 - 0.2085 = **0.792**.
- Note: Same answer via P(T<60) = F(60) = 1-e^(-λt) for ventetid T eksp.fordelt — illustrerer ekvivalens mellom poissonfordeling og eksponential.
**4c)** 90% KI for λ. Formula: λ̂ ± z_(α/2) · √(λ̂/t) eller ekvivalent λ̂ ± z_(α/2) · √X / t. λ̂ = 37/(118·12) = 0.0261. z_0.05 = 1.645. CI = 0.0261 ± 0.0071 = **[0.0190, 0.0332] utbrudd/måned**.
- Concepts: poissonfordeling, eksponentialfordeling, KI for poissonrate.

### Oppgave 5 — normalfordeling (kaffeautomat), sum av iid normaler
Setup: X = mengde kaffe ~ N(25, 0.48) cl.

**5a)** P(X<24) = P(Z < (24-25)/0.48) = P(Z<-2.08) = **0.0188** fra E.3.
- Concept: standardnormalisering, kumulativ standardnormal.
**5b)** Y = sum av 5 trykker (5 iid). Y ~ N(5·25, √5·0.48) = N(125, 1.0733). P(Y>127) = 1-P(Z<(127-125)/1.0733) = 1-P(Z<1.86) = 1-0.9686 = **0.0314**.
- Concept: sum av uavhengige normalfordelte SV. **Notational gotcha:** the løsning writes "Y=5X" but means the SUM of 5 iid copies, not 5 times one X. Variance = n·σ² (not n²·σ²). Important to clarify in entry.

### Oppgave 6 — z-test (én utvalg, kjent σ)
Setup: Standardmodell μ₀ = 50W, σ = 5W (kjent). Ny type: utvalg n=40, x̄=48W. Signifikansnivå 0.05.

**6a)** H₀: μ ≥ 50, H₁: μ < 50 (venstresidig).
**6b)** z-test fordi σ kjent og n=40 stort.
**6c)** Z = (X̄-μ₀)/(σ/√n) = (48-50)/(5/√40) = **-2.53**. Forkast hvis z < -z_0.05 = -1.645. -2.53 < -1.645 → forkast H₀.
**6d)** p-verdi = P(X̄ ≤ 48 | H₀) = P(Z ≤ -2.53) = G(-2.53) = **0.0057**. Mindre enn α → forkast.
- Concepts: én-utvalg z-test, p-verdi, ensidig vs. tosidig test.

---

## New entries identified from jan25

- bayes-setning (3a)
- total-sannsynlighet (3b)
- diskret-sannsynlighetsfordeling (2)
- normalfordeling (5)
- standardnormalisering (5a) — concept
- en-utvalg-z-test (6)
- p-verdi (6d) — concept
- sum-av-uavhengige-normaler (5b) — formula/concept
- uordnet-utvalg-uten-tilbakelegging (1) — concept (links to binomialkoeffisient)
- binomialkoeffisient (1) — formula
- komplementregelen (1b — already noted)

Tables used in jan25:
- E.3 standardnormaltabell (5a, 6d) — looking up G(z) values
- E.4 normal-kvantiltabell (4c — z_0.05; 6c — z_0.05)

---

## Eksamen mai25 (read + løsning read)

### Oppgave 1 — fellesfordeling (samme template som jan26 oppg 2)
Different probability table. Marginalfordeling: P(X=x): {0.6, 0.2, 0.2}, P(Y=y): {0.5, 0.3, 0.2}.
- E(X) = 0.6, E(Y) = 0.7
- σX = √0.64 = 0.8, σY = √0.61 = 0.781
- E(XY) = 1·1·0.1 + 1·2·0.1 = 0.3
- Cov = 0.3 - 0.42 = -0.12
- ρ = -0.12 / (0.8·0.781) = **-0.192**
- Same concepts as jan26 oppg 2.

### Oppgave 2 — uavhengighet, De Morgan, total sannsynlighet
Setup: P(F)=0.45, P(M)=0.8, P(F∩M)=0.41.

**2a)** Er F og M uavhengige? Sjekk: P(F∩M) = 0.41 vs P(F)·P(M) = 0.36. **Forskjellige → ikke uavhengige.**
- Alternative: P(M|F) = 0.41/0.45 = 0.91 ≠ P(M) = 0.8.
- Concept: independence definition (P(A∩B) = P(A)·P(B) iff uavhengige).

**2b)** P(M̄ | F̄). Method: De Morgan's lov: M̄ ∩ F̄ = M ∪ F (komplement). P(M∪F) = 0.84, P(M ∪ F) = 0.16. P(F̄) = 0.55. **P(M̄|F̄) = 0.16/0.55 = 0.291.**
- Concept: De Morgan's lov, komplementregelen kombinert med betinget sannsynlighet.

**2c)** P(T) = total sannsynlighet over kjønn. P(T|J)=0.23, P(T|J̄)=0.34, P(J)=0.52, P(J̄)=0.48. P(T) = 0.52·0.23 + 0.48·0.34 = **0.2828**.
- Concept: total sannsynlighet (samme som jan25 oppg 3b).

### Oppgave 3 — binomial + KI for andel
**3a)** X ~ Bin(10, 0.2). P(X≥2) = 1 - P(X≤1) = 1 - 0.376 (fra E.1) = **0.624**. Eller direkte: P(X=0) = 0.8^10 = 0.107, P(X=1) = 10·0.2·0.8^9 = 0.268, sum=0.375, da P(X≥2) = 0.625.

**3b)** 90% KI for p basert på 23/80. Formula: p̂ ± z_(α/2) · √(p̂(1-p̂)/n). p̂ = 23/80 = 0.2875. z_0.05 = 1.645. CI = 0.2875 ± 0.0832 = **[0.204, 0.371]**.
- Concept: KI for binomial andel (different from KI for poissonrate).

### Oppgave 4 — normalfordeling, z-test, finn-mu
Setup: X ~ N(302, 5).

**4a)** P(305 < X ≤ 310) = G((310-302)/5) - G((305-302)/5) = G(1.6) - G(0.6) = 0.9452 - 0.7257 = **0.2195**.
- Concept: probability between two values for normal RV — split into two G() lookups.

**4b)** Z-test of μ < 302 with sample of 6 (data: 297,300,293,296,304,302). H₀: μ ≥ 302, H₁: μ < 302. x̄ = 298.67. z = (298.67-302)/(5/√6) = **-1.63**. -1.63 not < -1.645 → IKKE forkast.

**4c)** p-value = G(-1.63) = **0.0516**. Just slightly above α=0.05.

**4d)** Find μ such that P(X<300) < 0.001. Set P(X<300) = 0.001 → (300-μ)/5 = -z_0.001 = -3.090 → μ = 300 + 15.45 = **315.45 ml**.
- Concept: inverse normal — given a probability, find the μ.

### Oppgave 5 — full lineær regresjon (correlation, regression line, hypothesis test)
Setup: 10 obs (søvntimer, eksamensresultat). Data table including column for (yi - α̂ - β̂·xi)² (squared residuals).

**5a)** Spredningsplott. Concept: data visualization.

**5b)** r (korrelasjonskoeffisient) = SXY / (SX · SY) = 103.4 / (√15.6 · √734.1) = **0.966**. "sterk positiv lineær sammenheng".
- Concept: Pearson correlation coefficient computation from sums.

**5c)** Estimert regresjonslinje: β̂ = SXY / SXX = 103.4/15.6 = 6.63, α̂ = ȳ - β̂·x̄ = 79.7 - 45.1 = 34.6. ŷ = 34.6 + 6.63·x. (Same line as jan26 oppg 6.)

**5d)** Test β = 0 (no relationship) vs β ≠ 0 (relationship).
- Test stat: T = (β̂ - β₀)/SE(β̂), t-fordelt med df = n-2 = 8.
- SE² = SSE/(n-2) = 48.7437/8 = 6.093 → SE = 2.4684.
- SE(β̂) = √(SE²/SXX) = √(6.093/15.6) = 0.625.
- t = (6.63-0)/0.625 = **10.61**. Compare with t_(0.025,8) = 2.306. 10.61 >> 2.306 → forkast H₀.
- Concept: hypothesis test on slope coefficient. Distinct from CI for slope.

---

## New entries identified from mai25

- uavhengighet-hendelser (2a) — concept
- de-morgans-lov (2b)
- normalfordeling-mellom-to-verdier (4a) — variation on normal probability lookup
- ki-andel-binomial (3b)
- finn-mu-gitt-sannsynlighet (4d) — procedure
- lineær-regresjon-estimering (5c) — α̂, β̂ formler
- korrelasjonskoeffisient-r (5b) — formula (different from ρ for joint distrib)
- lineær-regresjon-hypotesetest-beta (5d)
- spredningsplott (5a) — concept

Tables used: E.1 (3a), E.3 (4a), E.4 (3b, 4b), E.5 (5d)

---

## Synthesized inventory plan

After reading 3 exams (jan25, mai25, jan26), here's the picture:

**Distributions used:** binomial (jan25 oppg 1c, mai25 oppg 3a), poisson (jan25 oppg 4, jan26 oppg 4), eksponential (jan25 oppg 4b, jan26 oppg 4c-d), normal (jan25 oppg 5, mai25 oppg 4, mai25 oppg 6).

**Hypothesis tests used:** one-sample z-test (jan25 oppg 6, mai25 oppg 4b), two-sample t-test (jan26 oppg 5), slope-zero test in regression (mai25 oppg 5d).

**Confidence intervals:** for poisson rate (jan25 oppg 4c, jan26 oppg 4e), for binomial proportion (mai25 oppg 3b).

**Probability rules:** union, intersection, complement, conditional, total probability, Bayes', independence test.

**Combinatorics:** uordnet utvalg uten tilbakelegging (jan25 oppg 1, jan26 oppg 1ab), counting "favorable/possible".

**Joint distribution:** marginal, E, σ, Cov, ρ from a 3×3 or 3×3 simultanfordelingstabell — appears in BOTH jan26 oppg 2 and mai25 oppg 1 (same exact template, different numbers).

**Regression:** full pipeline. Scatter plot, correlation r, β̂ and α̂ estimates, residual variance, slope SE, slope hypothesis test, prediction interval (jan26 oppg 6, mai25 oppg 5).

This is enough to draft canonical entries. Øvinger will likely add little structurally different content; they'd add more examples of the same entries. Reading them deeply might be lower-leverage than starting to draft. I'll spot-check 1-2 øvinger for any new topics, then synthesize.

---

## hypotesetest_oversikt.pdf (course handout)

This is the canonical course summary of hypothesis tests. Three test types covered:

### 1) Hypotesetest for μ når σ er kjent (z-test)
- Test obs: Z = (X̄ - μ₀) / (σ/√n)
- Forutsetning: normalfordelt eller n ≥ 30
- Three rejection rules (right/left/two-tailed)
- γ(μ) (power function) is also given

### 2) Hypotesetest for μ når σ er ukjent (t-test)
- Test obs: T = (X̄ - μ₀) / (S/√n)
- Forutsetning: normalfordelt eller n ≥ 30
- df = n - 1 (implied; standard one-sample t-test)
- Three rejection rules

### 3) Hypotesetest av sannsynligheten p
- Test obs: Z = (X - n·p₀) / √(n·p₀·(1-p₀))
- Forutsetning: n·p̂(1-p̂) ≥ 5
- Three rejection rules

This is the official course curriculum for hypothesis tests. The two-sample t-test from jan26 oppg 5 isn't in this oversikt — it's a curriculum extension. Linear regression slope test (mai25 oppg 5d) also extends beyond.

---

## bootstrapping.pdf (course handout)

Concept: bootstrap re-sampling for KI when distribution is unknown / non-normal and CLT can't be invoked.

Procedure (servitør tip example):
1. Have N=30 observations (data) we can't assume are normal.
2. Resample N observations WITH REPLACEMENT (numpy.random.choice with replace=True).
3. Compute statistic of interest (mean) for each resample.
4. Repeat 1000 times → bootstrap distribution.
5. Two ways to make a 95% CI:
   - **Traditional**: x̄ ± z_(α/2) · standardfeil (where standardfeil = std-dev of bootstrap means). Assumes bootstrap distribution ≈ normal.
   - **Prosentilintervall**: Sort the 1000 means, take values at positions 25 and 975 (2.5% and 97.5% percentiles).

Python code provided. Uses np.random.choice and np.std with ddof=1.

Concepts:
- bootstrapping (concept)
- prosentilintervall (concept) — alternative to z-based CI
- normaltestplott / qq-plott (concept) — used to verify normality assumption
- standardfeil for bootstrap mean (concept)
- sentralgrenseteoremet (concept) — referenced as the alternative when n is large enough

---

## Final synthesis decision

Reading all 7 øvinger would cost significant context for likely-marginal new content. I have enough from:
- 3 exams + solutions (5-6 oppgaver each, comprehensive coverage)
- hypotesetest_oversikt.pdf (definitive list of basic hypothesis tests)
- bootstrapping.pdf (bootstrap concept + percentile interval)

I'll proceed to drafting now, and revisit øvinger only if a category I'm drafting feels thin or unclear from the exam/handout material.

## Final entry inventory to draft

### Distributions (5)
1. **Binomialfordeling** (jan25 1ab indirectly + mai25 3a + jan26 1c)
2. **Poissonfordeling** (jan25 4a + jan26 4ab) — already partial fixture, expand
3. **Eksponentialfordeling** (jan25 4b + jan26 4cd)
4. **Normalfordeling** (jan25 5 + mai25 4)
5. **Hypergeometrisk fordeling** (mentioned in jan26 4 IKKE-bruk; not directly used in any exam — include because it's a curriculum staple and the IKKE-bruk distinction matters)

### Hypothesis tests (5)
6. **Én-utvalg z-test** (jan25 6 + mai25 4b)
7. **Én-utvalg t-test** (from oversikt, plus implied in some øvinger)
8. **To-utvalgs t-test (uparet, pooled variance)** (jan26 5)
9. **Én-utvalg z-test for andel p** (from oversikt; not directly in 3 exams I read but in curriculum)
10. **Hypotesetest for stigningstall β** (mai25 5d)

### Confidence intervals (3-4)
11. **KI for poissonrate λ** (jan25 4c + jan26 4e)
12. **KI for andel p (binomial)** (mai25 3b)
13. **KI for forventningsverdi μ (kjent σ)** — z-based (curriculum)
14. **KI for forventningsverdi μ (ukjent σ)** — t-based (curriculum)

### Linear regression (5)
15. **Lineær regresjon — estimat for α og β** (mai25 5c)
16. **Lineær regresjon — korrelasjonskoeffisient r** (mai25 5b)
17. **Lineær regresjon — residualenes varians SE²** (mai25 5d)
18. **Lineær regresjon — standardfeil til β̂, SE(β̂)** (jan26 6 + mai25 5d)
19. **Lineær regresjon — prediksjonsintervall for Y** (jan26 6)
20. **Lineær regresjon — hypotesetest β = 0** (mai25 5d)

### Probability rules (5)
21. **Unionssetningen** (jan26 3a)
22. **Komplementregelen** (jan25 1b, 4b; jan26 1c, 4b)
23. **Produktregel / betinget sannsynlighet** (jan26 1b)
24. **Total sannsynlighet** (jan25 3b + mai25 2c)
25. **Bayes' setning** (jan25 3a)

### Combinatorics (2-3)
26. **Uordnet utvalg uten tilbakelegging (binomialkoeffisient)** (jan25 1)
27. **Gunstige på mulige (uniform sannsynlighet)** (jan26 1ab)

### Joint distribution / E, σ, Cov, ρ (5)
28. **Forventningsverdi (diskret SV)** (jan25 2b)
29. **Varians og standardavvik (diskret SV)** (jan25 2c, jan26 2b)
30. **Marginalfordeling fra simultanfordeling** (jan26 2a)
31. **Kovarians** (jan26 2c)
32. **Korrelasjon ρ (joint distribution)** (jan26 2c)

### Other formulas (2-3)
33. **Sum av uavhengige normaler** (jan25 5b)
34. **Standardnormalisering Z = (X-μ)/σ** (jan25 5a)
35. **Finn-μ-for-gitt-sannsynlighet (invers normal)** (mai25 4d)

### Concepts (10-15)
36. Poissonprosess (already fixture, expand)
37. Disjunkte hendelser
38. Uavhengighet av hendelser
39. Betinget sannsynlighet (concept layer separate from formula)
40. Stokastisk variabel (diskret vs kontinuerlig)
41. Sannsynlighetsfordeling (sannsynlighetsfunksjon)
42. Fellesfordeling / simultanfordeling
43. P-verdi
44. Signifikansnivå
45. Frihetsgrader (df)
46. Sentralgrenseteoremet
47. Bootstrapping (concept + procedure)
48. Prosentilintervall
49. Normalfordelingsantakelse / qq-plott
50. Spredningsplott
51. De Morgan's lov

### Tables (6) — already have placeholder for E.2, expand
52. Binomialtabell (E.1)
53. Poissontabell (E.2) — expand existing fixture
54. Z-tabell (E.3)
55. Z-kvantiltabell (E.4)
56. t-tabell (E.5)
57. Kjikvadrattabell (E.6)

**Total target: ~50-57 entries** across formler, hypothesis tests, regression, probability rules, joint dist, concepts, and tables.

Plenty for the exam. Some entries (like hypergeometric) are included for completeness even though not directly in exams — they're part of the curriculum and the user may meet them in the exam.

