# Konsept-opprydding: merge til ordliste der det er duplisert

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduser antall konseptsider ved å merge duplikat-innhold inn i tilsvarende ordliste-oppføringer, slik at konsept-seksjonen bare inneholder ekte oversikter og prosess-/metode-sider.

**Architecture:** For hver konseptside identifisert som duplikat, flytt manglende informasjon (typisk konkrete formel-detaljer eller eksempler) inn i den tilsvarende glossary-oppføringen, oppdater alle interne `[label](/concept/X)`-lenker til å peke på `(glossary:X)`, og slett konseptfilen.

**Tech Stack:** YAML content + react-router routes. Tester via vitest.

---

## Inventory

| # | Concepts | Entries | Glossary | Tables |
|---|---------:|--------:|---------:|-------:|
|   |       20 |      35 |       89 |      6 |

## Konseptsider — kategorisert

### Kategori A: Klare merge-kandidater (9 stk)

Disse har en glossary-oppføring som dekker det samme. Merge alt unikt innhold inn i glossary, oppdater lenker, slett konsept.

| Konsept-id | Glossary-id | Hva mangler i glossary i dag |
|------------|-------------|-------------------------------|
| `betinget-sannsynlighet` | `betinget-sannsynlighet-glos` | sammenheng med produktregel/Bayes/total sannsynlighet |
| `disjunkte-hendelser` | `disjunkte-hendelser-glos` | A ⊆ B̄-konsekvensen |
| `frihetsgrader` | `frihetsgrader-glos` | (allerede dekket — bare slette + omdirigere lenker) |
| `interpolert-varians` | `pooled-varians` | (dekket — slette + omdirigere) |
| `p-verdi` | `p-verdi-glos` | venstresidig/høyresidig/tosidig formler |
| `sentralgrenseteoremet` | `sentralgrenseteoremet-glos` | (dekket — slette + omdirigere) |
| `signifikansnivaa` | `signifikansniva-glos` | "tre måter å bruke α" |
| `standardnormalisering` | `normalisering` | (dekket — slette + omdirigere) |
| `uavhengighet-hendelser` | `uavhengighet-glos` | "TESTE uavhengighet"-prosedyre + utvalg-uavhengighet |

### Kategori B: Behold som ekte oversikter (3 stk)

Disse er fortsatt verdifulle som strukturerte oversiktssider og har ikke ett enkelt glossary-motstykke:

- `varians` — oversikt over alle 11 variansformer
- `standardavvik` — parallell oversikt for σ-formene
- `forventningsverdi` — oversikt over de 6 formene/regnereglene

### Kategori C: Usikre — trenger din avgjørelse (8 stk)

Disse er metode-/verktøy-/prosedyre-sider som ikke har en åpenbar duplikat i ordlisten, men kunne kanskje bli nye glossary-oppføringer i stedet for konsepter:

| Konsept | Type | Forslag |
|---------|------|---------|
| `bootstrapping` | metode m/ algoritme | **BEHOLD som konsept** — har 5-stegs prosedyre, lengre forklaring, ikke en term |
| `de-morgans-lov` | regel | **MERGE til ny glossary `de-morgans-lov`** — kort regel passer bra som ordliste |
| `fellesfordeling` | meta-konsept | **BEHOLD?** — beskriver hvordan jobbe med simultanfordelings-tabell. Glossary `simultanfordeling` finnes. Kanskje merge inn der? |
| `gunstige-pa-mulige` | regneprinsipp | **BEHOLD som konsept** — regneoppskrift, ikke en term |
| `poisson-prosess` | meta-konsept | **MERGE til ny glossary `poisson-prosess`** — binder Poisson + eksponential. Kort nok |
| `prosentilintervall` | metode | **BEHOLD som konsept** — algoritme/prosedyre |
| `qq-plott` | visuell test | **MERGE til ny glossary `qq-plott`** — kort, definisjonsaktig |
| `spredningsplott` | visuell test | **MERGE til ny glossary `spredningsplott`** — kort, definisjonsaktig |

**Hvis vi gjør alle merger i kategori A + de fire mergene i kategori C: 8 konsepter slettes, ny totaltelling 12 konsepter.**

## Tasks

> Kategori A først. Kategori C avklares med bruker FØR den blir oppgaver.

### Task 1: Merge `frihetsgrader` (concept) → `frihetsgrader-glos`

**Files:**
- Delete: `content/concepts/frihetsgrader.yaml`
- Modify (cross-refs): all files matching grep `concept/frihetsgrader` or `id: frihetsgrader,\s*kind:\s*concept`

- [ ] **Step 1: Diff content**

```bash
diff <(grep -E "ν|frihetsgrader" content/concepts/frihetsgrader.yaml) content/glossary/frihetsgrader-glos.yaml
```

Bekreft at glossary inneholder alt unikt fra konseptet (det gjør den allerede).

- [ ] **Step 2: Find all references to /concept/frihetsgrader**

Run: `grep -rn "concept/frihetsgrader\|kind: concept.*id: frihetsgrader\|frihetsgrader.*kind: concept" content/ src/`

- [ ] **Step 3: Update each reference**

For hver `(/concept/frihetsgrader)` → `(glossary:frihetsgrader-glos)` i `what_it_means`-blokker.
For hver `{ id: frihetsgrader, kind: concept }` i `related:` → `{ id: frihetsgrader-glos, kind: glossary }`.

- [ ] **Step 4: Delete concept file**

```bash
rm content/concepts/frihetsgrader.yaml
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --run
```

Forventet: alle tester passerer (ingen test referer direkte til konseptfila).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "content: merge frihetsgrader concept → glossary entry"
```

### Task 2: Merge `interpolert-varians` (concept) → `pooled-varians` (glossary)

**Files:**
- Delete: `content/concepts/interpolert-varians.yaml`
- Modify: `content/concepts/varians.yaml` (oversikten linker til konseptet)
- Modify: andre cross-refs

- [ ] **Step 1: Sjekk at `pooled-varians` glossary er fullstendig**

Glossary har: formel, vekting-forklaring, antakelse om lik σ², `S_P` formel.
Konsept har samme + "Standardfeilen i to-utvalgs t-test bruker S_P · √(1/n_X + 1/n_Y)" — legg til i glossary hvis ikke der.

- [ ] **Step 2: Update `concepts/varians.yaml`**

```diff
- Konsept: [Interpolert (pooled) varians](/concept/interpolert-varians).
+ (fjern hele linja — pooled-varians glossary popup er allerede headeren)
```

- [ ] **Step 3: Find andre referanser**

Run: `grep -rn "interpolert-varians" content/ src/`

- [ ] **Step 4: Update referanser**

Erstatt `/concept/interpolert-varians` med `glossary:pooled-varians`. Erstatt `{ id: interpolert-varians, kind: concept }` med `{ id: pooled-varians, kind: glossary }`.

- [ ] **Step 5: Delete + test + commit**

```bash
rm content/concepts/interpolert-varians.yaml
npm test -- --run
git add -A && git commit -m "content: merge interpolert-varians concept → pooled-varians glossary"
```

### Task 3: Merge `p-verdi` (concept) → `p-verdi-glos`

**Files:**
- Modify: `content/glossary/p-verdi-glos.yaml` (legg til ensidig/tosidig formler)
- Delete: `content/concepts/p-verdi.yaml`

- [ ] **Step 1: Utvid `p-verdi-glos`**

Legg inn **Venstresidig**, **Høyresidig**, **Tosidig** med formler i display-blokker — ta innholdet fra konseptet.

- [ ] **Step 2: Cross-ref + slett + test + commit**

### Task 4: Merge `signifikansnivaa` (concept) → `signifikansniva-glos`

**Files:**
- Modify: `content/glossary/signifikansniva-glos.yaml` (legg til "tre måter å bruke α")
- Delete: `content/concepts/signifikansnivaa.yaml`

NB: `signifikansnivaa` (med dobbel a) er konsept-id, `signifikansniva-glos` er ordliste-id.

- [ ] **Step 1: Utvid `signifikansniva-glos`** med tre-måter-listen.
- [ ] **Step 2: Cross-ref + slett + test + commit**

### Task 5: Merge `betinget-sannsynlighet` (concept) → `betinget-sannsynlighet-glos`

**Files:**
- Modify: `content/glossary/betinget-sannsynlighet-glos.yaml` (legg til Bayes/produktregel/total sammenhenger)
- Delete: `content/concepts/betinget-sannsynlighet.yaml`

- [ ] **Step 1: Utvid glossary** med "Tett knyttet til produktregelen, Bayes', total sannsynlighet"-blokken.
- [ ] **Step 2: Cross-ref + slett + test + commit**

### Task 6: Merge `disjunkte-hendelser` (concept) → `disjunkte-hendelser-glos`

**Files:**
- Modify: `content/glossary/disjunkte-hendelser-glos.yaml` (legg til A ⊆ B̄ konsekvensen)
- Delete: `content/concepts/disjunkte-hendelser.yaml`

- [ ] **Step 1: Utvid glossary** med "A ⊆ B̄ → P(A | B̄) = P(A)/(1−P(B))".
- [ ] **Step 2: Cross-ref + slett + test + commit**

### Task 7: Merge `uavhengighet-hendelser` (concept) → `uavhengighet-glos`

**Files:**
- Modify: `content/glossary/uavhengighet-glos.yaml` (legg til "TESTE uavhengighet"-prosedyre)
- Delete: `content/concepts/uavhengighet-hendelser.yaml`

- [ ] **Step 1: Utvid glossary** med teste-prosedyren.
- [ ] **Step 2: Cross-ref + slett + test + commit**

### Task 8: Merge `sentralgrenseteoremet` (concept) → `sentralgrenseteoremet-glos`

Glossary er allerede full. Bare cross-ref + slett.

- [ ] **Step 1: `grep -rn "sentralgrenseteoremet" content/ src/`**
- [ ] **Step 2: Erstatt `kind: concept` → `kind: glossary` og id → `sentralgrenseteoremet-glos`**
- [ ] **Step 3: Slett, test, commit**

### Task 9: Merge `standardnormalisering` (concept) → `normalisering` (glossary)

NB: Ulikt navn — konsept har id `standardnormalisering`, glossary har id `normalisering`.

- [ ] **Step 1: Erstatt cross-refs**
  - `/concept/standardnormalisering` → `glossary:normalisering`
  - `{ id: standardnormalisering, kind: concept }` → `{ id: normalisering, kind: glossary }`
- [ ] **Step 2: Slett, test, commit**

### Task 10: Final review

- [ ] **Step 1:** Run `npm test -- --run` — alle 150 tester må passere
- [ ] **Step 2:** Manuell smoketest — start dev-server, naviger til /konsepter, sjekk antall (skal være 11), åpne hver gjenværende konseptside
- [ ] **Step 3:** Sjekk at popup-lenker fungerer for alle merge-mål

---

## Avklaringer trengt FØR vi starter

1. Kategori A (de 9 mergene) — godkjenner du alle?
2. Kategori C — hvilke av disse fire bør bli glossary?
   - `de-morgans-lov` → glossary?
   - `poisson-prosess` → glossary?
   - `qq-plott` → glossary?
   - `spredningsplott` → glossary?
3. `fellesfordeling` — beholde som konsept, eller merge inn i `simultanfordeling` glossary?
