# Konsept-opprydding: merge til ordliste, samle resten i Formler

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Fjern konsept-typen fra innholdet ved å (a) merge duplikater inn i ordlisten, (b) flytte gjenværende oversikts-/metode-sider til entries. Sluttresultat: én samlet seksjon "Formler og konsepter" på listsiden.

**Architecture:** Tre faser: ordliste-merger først (lavrisiko), deretter nye ordliste-oppføringer fra korte konsepter, til sist UI/schema-restrukturering der `content/concepts/` tømmes og fila flyttes til `content/entries/`.

**Tech Stack:** YAML-innhold, Zod-schema, React-Router (HashRouter), vitest.

---

## Endelige beslutninger fra avklarings-runden

### Kategori A — merge konsept til eksisterende glossary (alle 9 godkjent)

Alltid gjør **fluff-vurdering** ved merging — vi vil ikke tekst uten verdi.

| # | Konsept | → Ordliste | Notat |
|---|---------|-----------|-------|
| 1 | `frihetsgrader` | `frihetsgrader-glos` | bare slett + lenker |
| 2 | `interpolert-varians` | `pooled-varians` | sørg for at oversikten på `/entry/varians-oversikt` fortsatt viser den |
| 3 | `p-verdi` | `p-verdi-glos` | legg til ensidig/tosidig formler |
| 4 | `signifikansnivaa` | `signifikansniva-glos` | legg til "tre måter å bruke α" |
| 5 | `betinget-sannsynlighet` | `betinget-sannsynlighet-glos` | legg til Bayes/produktregel/total |
| 6 | `disjunkte-hendelser` | `disjunkte-hendelser-glos` | legg til A ⊆ B̄-konsekvens |
| 7 | `uavhengighet-hendelser` | `uavhengighet-glos` | legg til "TESTE uavhengighet"-prosedyre |
| 8 | `sentralgrenseteoremet` | `sentralgrenseteoremet-glos` | bare slett + lenker |
| 9 | `standardnormalisering` | `normalisering` | nevn at det også kalles standardnormalisering |

### Kategori C — nye glossary-oppføringer (alle 4 godkjent)

| # | Konsept | → Ny glossary |
|---|---------|---------------|
| 10 | `de-morgans-lov` | `de-morgans-lov` |
| 11 | `poisson-prosess` | `poisson-prosess` |
| 12 | `qq-plott` | `qq-plott` |
| 13 | `spredningsplott` | `spredningsplott` |

### Fellesfordeling

| # | Konsept | → Ordliste |
|---|---------|-----------|
| 14 | `fellesfordeling` | `simultanfordeling` (legg til "fra fellesfordelingen kan vi utlede"-listen) |

### Konsepter som flyttes til entries (6 stk)

| # | Konsept | Ny entry-id | Notat |
|---|---------|-------------|-------|
| 15 | `bootstrapping` | `bootstrapping` | metode med 5-stegs algoritme |
| 16 | `gunstige-pa-mulige` | `gunstige-pa-mulige` | regneprinsipp |
| 17 | `prosentilintervall` | `prosentilintervall` | KI-metode |
| 18 | `varians` (oversikt) | `varians-oversikt` | id-kollisjon med glossary-term `varians` |
| 19 | `standardavvik` (oversikt) | `standardavvik-oversikt` | id-kollisjon med glossary-term `standardavvik` |
| 20 | `forventningsverdi` (oversikt) | `forventningsverdi-oversikt` | id-kollisjon med glossary-term `forventningsverdi` |

### UI / schema

- Schema: utvid `EntryTypeSchema` med `"overview"` og `"method"`. Gjør `formula_main`, `formula_latex`, `what_it_does` valgfri når `type` er `"overview"` eller `"method"`. Legg til valgfritt `what_it_means`-felt.
- Banner: fjern "Konsepter"-knappen. Behold "Formler" og "Tabeller". Rename "Formler" til **"Formler og konsepter"**.
- Routing: behold `/concept/<id>` som redirect-shim som mapper gamle id → ny entry-id (`varians` → `varians-oversikt`, etc.).
- ListView: fjern `?tab=konsepter`-grenen.

### Konflikter løst på vei inn

- **Same-id-kollisjon mellom concept og glossary** (`varians`, `standardavvik`, `forventningsverdi`): nye entries får suffix `-oversikt`.
- **`/concept/<id>` URL-er i tidligere markdown og lenker:** scriptet `scripts/audit-prose-links.mjs` brukes til å finne alle gjenværende referanser; alle erstattes til `/entry/<new-id>`.

---

## File Structure (etter rydding)

```
content/
  concepts/                         ← TOMT, mappa slettes
  entries/
    bootstrapping.yaml              ← ny (flyttet fra concepts/)
    gunstige-pa-mulige.yaml         ← ny
    prosentilintervall.yaml         ← ny
    varians-oversikt.yaml           ← ny
    standardavvik-oversikt.yaml     ← ny
    forventningsverdi-oversikt.yaml ← ny
    ... (eksisterende 35)
  glossary/
    de-morgans-lov.yaml             ← ny (Kategori C)
    poisson-prosess.yaml            ← ny
    qq-plott.yaml                   ← ny
    spredningsplott.yaml            ← ny
    ... (eksisterende 89, 9 utvidede + simultanfordeling)
src/
  data/schema.ts                    ← EntryTypeSchema utvides; fields valgfrie
  components/shell/Banner.tsx       ← fjern Konsepter-knapp, rename Formler
  routes/ListView.tsx               ← fjern konsepter-tab
  routes/ConceptDetail.tsx          ← redirect-shim ELLER slettes
  data/loadContent.ts               ← konsepter-loading fjernes
```

---

## Tasks

### Fase 1 — Kategori A (9 ordliste-merger, lavrisiko)

#### Task 1: Merge `frihetsgrader` (concept) → `frihetsgrader-glos`

**Files:**
- Delete: `content/concepts/frihetsgrader.yaml`
- Search-and-replace cross-refs

- [ ] **Step 1: Verifiser at ordlisten dekker alt unikt** (gjør den allerede)

- [ ] **Step 2: Finn referanser**

```bash
grep -rn "frihetsgrader\b" content/ src/ | grep -v "frihetsgrader-glos"
```

- [ ] **Step 3: Erstatt referanser**

For hver `(/concept/frihetsgrader)` → `(glossary:frihetsgrader-glos)`.
For hver `{ id: frihetsgrader, kind: concept }` → `{ id: frihetsgrader-glos, kind: glossary }`.

- [ ] **Step 4: Slett, test, commit**

```bash
rm content/concepts/frihetsgrader.yaml
npm test -- --run
git add -A && git commit -m "content: merge frihetsgrader concept → glossary entry"
```

#### Task 2: Merge `sentralgrenseteoremet` (concept) → `sentralgrenseteoremet-glos`

Samme mønster som Task 1. Ordlisten dekker allerede alt. Bare slett + ref-erstatning + test + commit.

#### Task 3: Merge `interpolert-varians` (concept) → `pooled-varians`

- [ ] **Step 1: Sjekk om "S_P · √(1/n_X + 1/n_Y)"-linja er i `pooled-varians`**

Den er ikke der i dag. Legg den inn under en **Standardfeil i to-utvalgs t-test:** seksjon i `pooled-varians.yaml`.

```
**Standardfeil i to-utvalgs t-test:**

    SE = S_P · √(1/n_X + 1/n_Y)
```

- [ ] **Step 2: Update `content/entries/varians-oversikt.yaml` (opprettes i Fase 3)**

Inntil videre: i `content/concepts/varians.yaml` slettes "Konsept: [Interpolert (pooled) varians]"-linjen. Glossary-popup på header dekker det.

- [ ] **Step 3: Erstatt cross-refs**

`(/concept/interpolert-varians)` → `(glossary:pooled-varians)`.
`{ id: interpolert-varians, kind: concept }` → `{ id: pooled-varians, kind: glossary }`.

- [ ] **Step 4: Slett, test, commit**

#### Task 4: Merge `p-verdi` (concept) → `p-verdi-glos`

- [ ] **Step 1: Utvid `p-verdi-glos.yaml`** med ensidig/tosidig formler som display-blokker. Fluff-sjekk: ikke gjenta eksisterende innhold.
- [ ] **Step 2: Slett, cross-refs, commit**

#### Task 5: Merge `signifikansnivaa` (concept) → `signifikansniva-glos`

- [ ] **Step 1: Utvid `signifikansniva-glos.yaml`** med "tre måter å bruke α"-listen.
- [ ] **Step 2: Slett, cross-refs, commit**

#### Task 6: Merge `betinget-sannsynlighet` (concept) → `betinget-sannsynlighet-glos`

- [ ] **Step 1: Utvid glossary** med Bayes/produktregel/total-sammenhengs-blokk.
- [ ] **Step 2: Slett, cross-refs, commit**

#### Task 7: Merge `disjunkte-hendelser` (concept) → `disjunkte-hendelser-glos`

- [ ] **Step 1: Utvid glossary** med "A ⊆ B̄ → P(A | B̄) = P(A)/(1 − P(B))".
- [ ] **Step 2: Slett, cross-refs, commit**

#### Task 8: Merge `uavhengighet-hendelser` (concept) → `uavhengighet-glos`

- [ ] **Step 1: Utvid glossary** med teste-prosedyre + utvalg-uavhengighet.
- [ ] **Step 2: Slett, cross-refs, commit**

#### Task 9: Merge `standardnormalisering` (concept) → `normalisering`

- [ ] **Step 1: Legg til alias** `standardnormalisering` i `normalisering.yaml`.
- [ ] **Step 2: Slett, cross-refs, commit**

### Fase 2 — Kategori C (4 nye glossary + fellesfordeling-merge)

#### Task 10: Lag `glossary/de-morgans-lov.yaml`

- [ ] **Step 1:** Lag fil med to lover (display-blokker), kort eksempel.
- [ ] **Step 2:** Slett konseptet, oppdater cross-refs, commit.

#### Task 11: Lag `glossary/poisson-prosess.yaml`

- [ ] **Step 1:** Tre punkter: telleantall (Poisson(λt)), ventetid (eksponential), uavhengige vinduer.
- [ ] **Step 2:** Slett, cross-refs, commit.

#### Task 12: Lag `glossary/qq-plott.yaml`

- [ ] **Step 1:** Definisjon, S-kurve / krumning, bruksområde.
- [ ] **Step 2:** Slett, cross-refs, commit.

#### Task 13: Lag `glossary/spredningsplott.yaml`

- [ ] **Step 1:** Definisjon + bruksområde.
- [ ] **Step 2:** Slett, cross-refs, commit.

#### Task 14: Merge `fellesfordeling` (concept) → `simultanfordeling` (glossary)

- [ ] **Step 1:** Legg "fra fellesfordelingen kan vi utlede"-bullet-listen til `simultanfordeling.yaml`.
- [ ] **Step 2:** Slett, cross-refs, commit.

### Fase 3 — Schema og UI for samling

#### Task 15: Utvid Entry-schema

**Files:**
- Modify: `src/data/schema.ts`

- [ ] **Step 1: Skriv test for ny type**

```ts
it("accepts overview entry without formula_main", () => {
  const e = EntrySchema.parse({
    id: "varians-oversikt",
    name_no: "Varians (oversikt)",
    type: "overview",
    tagline: "...",
    what_it_means: "...",
    recognition_cues: ["..."],
    filters: {},
  });
  expect(e.type).toBe("overview");
});
```

- [ ] **Step 2: Oppdater schema**

```ts
export const EntryTypeSchema = z.enum([
  "distribution", "test", "regression", "identity", "rule", "combinatorics",
  "overview", "method",
]);

export const EntrySchema = z.object({
  // ... eksisterende
  formula_main: z.string().optional(),
  formula_latex: z.string().optional(),
  what_it_does: z.string().optional(),
  what_it_means: z.string().optional(),
  // ... resten
});
```

- [ ] **Step 3: Test, commit**

#### Task 16: Lag `content/entries/varians-oversikt.yaml`

- [ ] **Step 1:** Kopier `content/concepts/varians.yaml`-innholdet, endre `id: varians-oversikt`, `type: overview`, behold `what_it_means`.
- [ ] **Step 2:** Cross-refs: `(/concept/varians)` → `(/entry/varians-oversikt)`. `{ id: varians, kind: concept }` → `{ id: varians-oversikt, kind: entry }`.
- [ ] **Step 3:** Slett `content/concepts/varians.yaml`, test, commit.

#### Task 17: Lag `content/entries/standardavvik-oversikt.yaml`

Samme mønster som Task 16.

#### Task 18: Lag `content/entries/forventningsverdi-oversikt.yaml`

Samme mønster.

#### Task 19: Flytt `bootstrapping`, `gunstige-pa-mulige`, `prosentilintervall` til entries

- [ ] **Step 1:** For hver: kopier konseptfil til `content/entries/<id>.yaml` med `type: method` (eller `overview` for bootstrapping).
- [ ] **Step 2:** Slett konseptfilene.
- [ ] **Step 3:** Cross-refs: `(/concept/X)` → `(/entry/X)`, `{ id: X, kind: concept }` → `{ id: X, kind: entry }`.
- [ ] **Step 4:** Test, commit.

#### Task 20: EntryDetail-renderer for overview/method

- [ ] **Step 1: Test først** — render varians-oversikt, forvent at `what_it_means` vises i stedet for `formula_main` + `what_it_does`.
- [ ] **Step 2:** Hvis `type === "overview"` eller `type === "method"`: render `what_it_means` med Prose, skip formula-rader, behold recognition_cues.
- [ ] **Step 3:** Test, commit.

#### Task 21: Slett `/concept/<id>`-route, legg til redirect

- [ ] **Step 1:** I `App.tsx`: legg til `<Route path="/concept/:id" element={<ConceptRedirect />} />`-shim som mapper gamle id → ny id og bruker `<Navigate>`.
- [ ] **Step 2:** Slett `ConceptDetail.tsx` og `loadContent.ts`-konsept-loading hvis ingen andre lesere.
- [ ] **Step 3:** Test (smoke-test gamle URL-er), commit.

#### Task 22: Banner — fjern Konsepter-knapp, rename Formler

- [ ] **Step 1: Test først**

```tsx
it("does not show Konsepter button", () => {
  render(<Banner />);
  expect(screen.queryByText("Konsepter")).toBeNull();
  expect(screen.getByText("Formler og konsepter")).toBeInTheDocument();
});
```

- [ ] **Step 2:** Endre `Banner.tsx`.
- [ ] **Step 3:** Test, commit.

#### Task 23: ListView — fjern konsepter-tab

- [ ] **Step 1:** Fjern `tab === "konsepter"`-grenen, fjern konsept-cross-search, behold formler+tabeller.
- [ ] **Step 2:** Test, commit.

#### Task 24: Final smoketest + cleanup

- [ ] **Step 1:** `npm test -- --run` — alle tester passerer.
- [ ] **Step 2:** Start dev-server, gå gjennom: `/`, `/?tab=tabeller`, `/entry/varians-oversikt`, `/entry/bootstrapping`, gamle `/concept/varians` (skal redirecte), åpne glossary-popup for `de-morgans-lov`.
- [ ] **Step 3:** Slett tom `content/concepts/`-mappe.
- [ ] **Step 4:** Final commit + merge til main.
