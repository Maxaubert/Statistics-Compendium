/**
 * Per-entry formula explanations rendered as the "Formelforklaring"
 * cards section above the standard entry layout. Each card opens a
 * popup with a longer, Prose-rendered explanation of one formula.
 *
 * Structurally a sibling of `property-explanations.ts`, but the
 * content is about FORMULAS that appear on the entry page (e.g.
 * the PDF and CDF on `eksponential-fordeling`) instead of derived
 * properties (E[X], Var[X]). The long-form bodies are markdown
 * strings rendered through Prose, so they can use h2/h3 headings,
 * `> [!read]` callouts, lists and inline code.
 *
 * These short glossary-like entries live ONLY inside the originating
 * formula page; they are not part of the global Ordliste.
 */

export type FormulaSeeAlsoRef =
  | { kind: "formula"; ref: string }
  | { kind: "entry"; id: string }
  | { kind: "glossary"; id: string }
  | { kind: "table"; id: string };

export interface FormulaExplanation {
  /** Stable id within the entry's formula list, used by cross-references. */
  id: string;
  /** Card title (e.g. "Sannsynlighetstetthet"). */
  name: string;
  /** Short uppercase abbreviation shown as a chip on the card. */
  abbreviation?: string;
  /** Big formula shown on the card and in the modal header. */
  formula: string;
  /** One-line summary shown as the card body. */
  short: string;
  /** Markdown body for the modal, supports Prose features. */
  long: string;
  /** Cross-references shown as a "Se også"-row at the bottom of the modal. */
  see_also?: FormulaSeeAlsoRef[];
}

export const FORMULA_EXPLANATIONS: Record<string, FormulaExplanation[]> = {
  "eksponential-fordeling": [
    {
      id: "pdf",
      name: "Sannsynlighetstetthetsfunksjon",
      abbreviation: "PDF",
      formula: "f(t) = λe^(-λt)",
      short: "Hvor tett fordelingen ligger ved et punkt t. Brukes mest for å tegne kurven.",
      long: `\`f(t)\` er tetthetsfunksjonen til eksponentialfordelingen.
Den beskriver hvor «tett» fordelingen ligger ved et bestemt punkt \`t\`.


## Hvorfor er ikke \`f(t)\` en sannsynlighet?

For en kontinuerlig variabel som \`T\` er sannsynligheten for å treffe
et eksakt enkelt-punkt alltid null:

> [!read] P(T = t) = 0
> Sannsynligheten for at ventetiden er nøyaktig \`t\` er null.

Så \`f(t)\` er ikke en sannsynlighet i seg selv. Den sier hvor
*relativt tett* sannsynlighetsmassen ligger rundt \`t\`, målt i
sannsynlighet per tidsenhet.


## Slik blir tettheten til sannsynlighet

Du får en faktisk sannsynlighet ved å integrere \`f\` over et intervall:

> [!read] P(a < T < b) = ∫ f(t) dt fra a til b
> Sannsynligheten for at \`T\` faller mellom \`a\` og \`b\` er arealet under \`f\` mellom de to punktene.

I praksis trenger du sjelden å regne integralet selv. Det er allerede
regnet ut og gitt deg som den kumulative fordelingsfunksjonen.


## Når bruke \`f(t)\`?

- Tegne eller skissere tetthetskurven
- Vise at fordelingen integrerer til 1 (dvs. at den faktisk er en gyldig fordeling)
- Sjelden direkte i sannsynlighetsberegninger
`,
      see_also: [
        { kind: "glossary", id: "sannsynlighetsfordeling" },
        { kind: "glossary", id: "poisson-prosess" },
      ],
    },
    {
      id: "cdf",
      name: "Kumulativ fordelingsfunksjon",
      abbreviation: "CDF",
      formula: "F(t) = 1 - e^(-λt)",
      short: "Gir sannsynligheten direkte: P(T ≤ t). Den du faktisk bruker i utregning.",
      long: `\`F(t)\` er kumulativ fordelingsfunksjon for
eksponentialfordelingen. Den gir sannsynligheten direkte:

> [!read] F(t) = P(T ≤ t)
> Sannsynligheten for at hendelsen kommer innen tid \`t\`.


## De tre vanlige uttrykkene

Nesten alle sannsynligheter for eksponentialfordelingen kan skrives
via \`F\` (eller komplementet til \`F\`):

- \`P(T ≤ t) = F(t) = 1 - e^(-λt)\` (hendelse innen \`t\`)
- \`P(T > t) = 1 - F(t) = e^(-λt)\` (overlevelse, ingen hendelse innen \`t\`)
- \`P(a < T < b) = F(b) - F(a) = e^(-λa) - e^(-λb)\` (intervall)

> [!tip] Lær \`P(T > t) = e^(-λt)\` som refleks; det dekker «overlevelses»-mønsteret som dukker opp i de fleste poissonprosess-oppgaver.


## Egenskaper du kan sjekke

- \`F(0) = 0\` (ingen tid har gått, ingen hendelse ennå)
- \`F(∞) = 1\` (vente lenge nok og hendelsen kommer alltid til slutt)
- \`F\` vokser monotont fra 0 til 1
`,
      see_also: [
        { kind: "glossary", id: "sannsynlighetsfordeling" },
        { kind: "entry", id: "komplementregelen" },
        { kind: "glossary", id: "poisson-prosess" },
      ],
    },
  ],
  "bayes-setning": [
    {
      id: "bayes",
      name: "Bayes' setning",
      abbreviation: "BAYES",
      formula: "P(A | B) = P(A) · P(B | A) / P(B)",
      short: "Snur retningen på en betinget sannsynlighet: fra P(B|A) til P(A|B).",
      long: `Bayes' setning lar deg snu retningen på en betinget sannsynlighet. Hvis du vet sannsynligheten for symptom \`B\` gitt sykdom \`A\`, kan du regne ut sannsynligheten for sykdom \`A\` gitt symptom \`B\`, som ofte er det du faktisk bryr deg om.


## Hvordan formelen leses

> [!read] P(A | B) = P(A) · P(B | A) / P(B)
> Posterior \`P(A | B)\` er prior \`P(A)\` ganger likelihood \`P(B | A)\`, delt på den totale sannsynligheten for \`B\`.

De tre delene har egne navn:

- \`P(A)\` er prior, det du trodde før du så evidensen \`B\`
- \`P(B | A)\` er likelihood, hvor sannsynlig evidensen er hvis hypotesen stemmer
- \`P(A | B)\` er posterior, oppdatert tro etter at du har sett \`B\`

Nevneren \`P(B)\` er sjelden gitt direkte. Du regner den med setningen om total sannsynlighet:

    P(B) = P(A)·P(B|A) + P(Aᶜ)·P(B|Aᶜ)


## Klassisk eksempel: sjelden sykdom

En sykdom har prevalens 1 prosent. Testen har sensitivitet 99 prosent (\`P(positiv | syk) = 0.99\`) og spesifisitet 95 prosent (\`P(negativ | frisk) = 0.95\`). En person tester positivt. Hvor sannsynlig er det at hen faktisk er syk?

Først total sannsynlighet for positiv test:

    P(positiv) = 0.01 · 0.99 + 0.99 · 0.05
               = 0.0099 + 0.0495 = 0.0594

Deretter Bayes:

    P(syk | positiv) = 0.01 · 0.99 / 0.0594
                     = 0.0099 / 0.0594 ≈ 0.1667

Bare 16.7 prosent, til tross for en svært god test. Dette er base-rate-fellen: når sykdommen er sjelden, drukner de sanne positive i de falske positive.

> [!tip] Hvis prior er liten og evidens-strømmen ikke er ekstremt sterk, blir posterior fortsatt liten. Sjekk alltid om svaret virker rimelig sammenlignet med prior.


## Sjekk størrelsen

> [!read] P(A | B) ≠ P(B | A)
> «Confusion of the inverse»: ikke forveksle de to retningene. \`P(positiv | syk)\` er noe helt annet enn \`P(syk | positiv)\`.
`,
      see_also: [
        {
          kind: "entry",
          id: "total-sannsynlighet",
        },
        {
          kind: "entry",
          id: "produktregel",
        },
        {
          kind: "glossary",
          id: "betinget-sannsynlighet-glos",
        },
      ],
    },
  ],
  "binomial-fordeling": [
    {
      id: "pmf",
      name: "Punktsannsynlighet",
      abbreviation: "PMF",
      formula: "P(X = k) = C(n, k) · p^k · (1 - p)^(n-k)",
      short: `Sannsynligheten for nøyaktig \`k\` suksesser i \`n\` uavhengige forsøk med suksessannsynlighet \`p\`.`,
      long: `\`P(X = k)\` er punktsannsynligheten i binomialfordelingen. Den gir sannsynligheten for at nøyaktig \`k\` av \`n\` uavhengige Bernoulli-forsøk lykkes, når hvert forsøk har samme suksessannsynlighet \`p\`.

> [!read] P(X = k) = C(n, k) · p^k · (1 − p)^(n − k)
> Sannsynligheten for \`k\` suksesser blant \`n\` forsøk: antall måter å plukke ut hvilke \`k\` av forsøkene som lykkes, ganger sannsynligheten for én slik bestemt sekvens.


## De tre delene av formelen

Formelen er bygget opp av tre faktorer:

- \`p^k\`: sannsynligheten for at de \`k\` valgte forsøkene alle lykkes.
- \`(1 − p)^(n − k)\`: sannsynligheten for at de øvrige \`n − k\` forsøkene mislykkes.
- \`C(n, k)\`: antall måter å velge hvilke \`k\` av forsøkene som er suksessene (binomialkoeffisienten).

> [!tip] \`k = 0\` gir bare \`(1 − p)^n\` (alle mislykkes), og \`k = n\` gir bare \`p^n\` (alle lykkes). De to spesialtilfellene trenger ikke binomialkoeffisient.


## Konkret eksempel

En andel \`p = 0.2\` av grantrær har en sykdom. Vi sjekker \`n = 10\` tilfeldige trær. Hva er sannsynligheten for at nøyaktig 2 av disse har sykdommen?

1. \`X ~ Bin(10, 0.2)\`, vi vil ha \`P(X = 2)\`.
2. Sett inn i formelen:

        P(X = 2) = C(10, 2) · 0.2² · 0.8^8
                 = 45 · 0.04 · 0.16777
                 ≈ 0.302

Svar: ca. 30 % sjanse for nøyaktig to syke trær i utplukket.


## Når bruke formelen og når tabell E.1?

- For NØYAKTIG \`k\` suksesser: bruk formelen direkte (E.1 gir kumulativ).
- For HØYST \`k\` (\`P(X ≤ k)\`): slå opp i tabell E.1.
- For MINST \`k\` (\`P(X ≥ k)\`): bruk komplement, \`1 − P(X ≤ k − 1)\`, og tabell E.1.

> [!note] Pass på indeksen i komplementet: tabellen skal slås opp på \`k − 1\`, ikke \`k\`. F.eks. \`P(X ≥ 3) = 1 − P(X ≤ 2)\`. Bruker du \`P(X ≤ 3)\` i stedet, mister du bidraget fra \`X = 3\` selv og svaret blir for lavt.

> [!read] E[X] = np
> Forventet antall suksesser er \`n · p\`. For \`n = 10\`, \`p = 0.2\` får du \`E[X] = 2\`, så det er rimelig at nettopp \`k = 2\` er den mest sannsynlige verdien.
`,
      see_also: [
        {
          kind: "glossary",
          id: "bernoulli-forsoek",
        },
        {
          kind: "entry",
          id: "komplementregelen",
        },
        {
          kind: "table",
          id: "E1-binomial-kumulativ",
        },
      ],
    },
  ],
  "en-utvalg-t-test": [
    {
      id: "t-observator",
      name: "T-observator (én-utvalgs t-test)",
      abbreviation: "T",
      formula: "T = (X̄ − μ₀) / (S/√n)",
      short: `Som \`Z\`, men nevneren bruker estimert \`S\` i stedet for kjent \`σ\`. T-fordelt med \`ν = n − 1\` frihetsgrader.`,
      long: `\`T\` er testobservatoren i én-utvalgs t-test. Den fungerer som \`Z\`-observatoren, men siden populasjonsstandardavviket \`σ\` er ukjent estimerer vi det fra utvalget med \`S\` (utvalgsstandardavviket). Den ekstra usikkerheten gjør at fordelingen til \`T\` er bredere enn standardnormalen, særlig for små \`n\`.


## Hvordan lese formelen

> [!read] T = (X̄ − μ₀) / (S/√n)
> «Avviket fra påstanden, delt på en estimert standardfeil basert på utvalgets egen spredning.»

Forskjellen fra z-testen er kun at nevneren \`S/√n\` bruker \`S\` (estimert) i stedet for \`σ\` (kjent). Under \`H₀\` er \`T\` t-fordelt med \`ν = n − 1\` frihetsgrader, ikke standardnormal.


## Hvorfor \`n − 1\` frihetsgrader

Når vi regner \`S²\` bruker vi allerede \`X̄\` som estimat for \`μ\`, og det «binder» én frihetsgrad i dataene (avvikene \`xᵢ − x̄\` summerer alltid til null). Vi har derfor effektivt \`n − 1\` uavhengige bidrag til variansen.

> [!tip] For store \`n\` (\`n ≥ 30\`) er t-fordelingen praktisk talt lik standardnormalen, og \`t\`- og \`z\`-test gir nær samme svar. For små \`n\` har t-fordelingen tyngre haler, så kritisk verdi er større.


## Konkret eksempel

Produsenten påstår at lyspærer varer \`μ₀ = 1000\` timer. Et utvalg på \`n = 12\` pærer gir \`x̄ = 970\` og \`s = 40\`.

    s/√n = 40/√12 ≈ 11.547
    T = (970 − 1000) / 11.547
      ≈ −2.598

Venstresidig på \`α = 0.05\` med \`ν = 11\` gir kritisk verdi \`−t_(0.05, 11) ≈ −1.796\`. Siden \`−2.598 < −1.796\`, forkaster vi \`H₀\`: pærene varer i snitt kortere enn 1000 timer.
`,
      see_also: [
        {
          kind: "glossary",
          id: "t-fordeling",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
        {
          kind: "glossary",
          id: "utvalgsstandardavvik",
        },
        {
          kind: "table",
          id: "E5-t-tabell",
        },
      ],
    },
  ],
  "en-utvalg-z-test": [
    {
      id: "z-observator",
      name: "Z-observator (én-utvalgs z-test)",
      abbreviation: "Z",
      formula: "Z = (X̄ − μ₀) / (σ/√n)",
      short: `Måler hvor mange standardfeil utvalgsgjennomsnittet ligger fra påstandsverdien \`μ₀\`.`,
      long: `\`Z\` er testobservatoren i én-utvalgs z-test. Den måler hvor langt det observerte gjennomsnittet \`X̄\` ligger fra påstandsverdien \`μ₀\`, målt i antall standardfeil for gjennomsnittet (\`σ/√n\`).


## Hvordan lese formelen

> [!read] Z = (X̄ − μ₀) / (σ/√n)
> «Avviket fra påstanden, delt på hvor mye gjennomsnittet pleier å variere fra utvalg til utvalg.»

Telleren \`X̄ − μ₀\` er det rå avviket mellom det vi så og det \`H₀\` påstår. Nevneren \`σ/√n\` er standardfeilen til \`X̄\`, altså hvor mye \`X̄\` typisk svinger på grunn av tilfeldig utvalgsvariasjon. Forholdet er dimensjonsløst og standardnormalfordelt under \`H₀\`.


## Hvorfor \`σ/√n\` i nevneren

Vi sammenligner ikke en enkelt observasjon med \`μ₀\`, men et gjennomsnitt av \`n\` observasjoner. Variansen til gjennomsnittet er \`σ²/n\` (variansen til utvalgsgjennomsnittet), så standardavviket blir \`σ/√n\`. Med kjent populasjonsvarians \`σ²\` er dette eksakt, og \`Z\` er eksakt standardnormal under \`H₀\` når \`X\` selv er normalfordelt.

> [!tip] Når \`n\` vokser blir \`σ/√n\` mindre, så selv små avvik \`X̄ − μ₀\` gir store \`|Z|\`. Det er derfor store utvalg lettere oppdager små forskjeller.


## Konkret eksempel

En standardmodell julelys bruker \`μ₀ = 50 W\` med kjent \`σ = 5 W\`. Et utvalg på \`n = 40\` nye lys gir \`x̄ = 48 W\`.

    z = (48 − 50) / (5 / √40)
      = −2 / 0.7906
      ≈ −2.53

Gjennomsnittet ligger ca. 2.53 standardfeil under \`μ₀\`. På venstresidig test med \`α = 0.05\` er kritisk verdi \`−z_(0.05) = −1.645\`, og \`−2.53 < −1.645\`, så vi forkaster \`H₀\`.
`,
      see_also: [
        {
          kind: "glossary",
          id: "standardfeil",
        },
        {
          kind: "glossary",
          id: "z-score",
        },
        {
          kind: "table",
          id: "E4-z-kvantiltabell",
        },
      ],
    },
  ],
  "en-utvalg-z-test-andel": [
    {
      id: "z-observator-andel",
      name: "Z-observator for andel",
      abbreviation: "Z",
      formula: "Z = (X − n·p₀) / √(n·p₀·(1 − p₀))",
      short: `Standardiserer antall suksesser \`X\` mot binomial forventning \`n·p₀\` og varians \`n·p₀(1−p₀)\` under \`H₀\`.`,
      long: `\`Z\` er testobservatoren i z-test for en andel. Under \`H₀: p = p₀\` er antall suksesser \`X\` binomisk fordelt med forventningsverdi \`n·p₀\` og varians \`n·p₀·(1−p₀)\`. Når \`n\` er stor nok kan \`X\` approksimeres med normalfordelingen, og \`Z\` blir standardnormal under \`H₀\`.


## Hvordan lese formelen

> [!read] Z = (X − n·p₀) / √(n·p₀·(1 − p₀))
> «Hvor mange standardavvik observert antall suksesser ligger over (eller under) det \`H₀\` forventer.»

Telleren \`X − n·p₀\` er avviket mellom observert antall suksesser og det \`H₀\` forventer. Nevneren \`√(n·p₀(1−p₀))\` er standardavviket til \`X\` under \`H₀\` (kvadratroten av binomialvariansen).


## Hvorfor \`p₀\`, ikke \`p̂\`, i nevneren

Dette er et viktig skille fra konfidensintervall for andel: i en hypotesetest antar vi at \`H₀\` er sann mens vi regner observatoren, så variansen i nevneren skal bruke \`p₀\`. I konfidensintervall bruker vi derimot \`p̂\` siden vi ikke har noen \`H₀\` å plugge inn.

> [!tip] Ekvivalent skrivemåte: \`Z = (p̂ − p₀) / √(p₀(1−p₀)/n)\` der \`p̂ = X/n\`. Du får samme tall, bare delt på \`n\` i teller og nevner.

Forutsetning: normalapproksimasjonen er gyldig når \`n·p₀·(1−p₀) ≥ 5\`.


## Konkret eksempel

En mynt kastes \`n = 100\` ganger og gir \`X = 60\` kron. Test om \`p = 0.5\` (rettferdig mynt).

    n·p₀·(1−p₀) = 100·0.5·0.5 = 25 ≥ 5 ✓
    Z = (60 − 100·0.5) / √(100·0.5·0.5)
      = 10 / √25
      = 10 / 5 = 2.00

Tosidig \`α = 0.05\` gir \`z_(0.025) = 1.96\`. Siden \`|2.00| > 1.96\`, forkaster vi \`H₀\`: tallene tyder på at mynten ikke er rettferdig.
`,
      see_also: [
        {
          kind: "glossary",
          id: "andel",
        },
        {
          kind: "glossary",
          id: "normalapproksimasjon",
        },
        {
          kind: "glossary",
          id: "binomialvarians",
        },
        {
          kind: "table",
          id: "E4-z-kvantiltabell",
        },
      ],
    },
  ],
  "forventningsverdi-diskret": [
    {
      id: "forventningsverdi",
      name: "Forventningsverdi for diskret stokastisk variabel",
      abbreviation: "E[X]",
      formula: "E[X] = Σ x_i · P(X = x_i)",
      short: `Veid gjennomsnitt av verdiene \`x_i\`, der hver verdi er vektet med sin sannsynlighet.`,
      long: `\`E[X]\` er forventningsverdien til en diskret stokastisk variabel \`X\`. Den kan tolkes som gjennomsnittet du vil få på lang sikt hvis du trekker \`X\` om og om igjen.


## Hvorfor en vektet sum?

Ulike utfall er ikke like sannsynlige, så et vanlig gjennomsnitt av \`x\`-verdiene gir feil svar. I stedet vekter vi hver verdi med hvor ofte den dukker opp:

> [!read] E[X] = Σ x_i · P(X = x_i)
> Forventningsverdien er summen av hver mulig verdi \`x_i\` multiplisert med sin sannsynlighet.

Verdier med stor sannsynlighet trekker \`E[X]\` mot seg, mens sjeldne verdier bidrar lite, selv om de er ekstreme.


## Konkret eksempel

La \`X\` ta verdier \`{-2, -1, 0, 1, 2}\` med sannsynligheter \`{0.3, 0.2, 0.2, 0.1, 0.2}\`:

    E[X] = (-2)·0.3 + (-1)·0.2 + 0·0.2 + 1·0.1 + 2·0.2
         = -0.6 - 0.2 + 0 + 0.1 + 0.4
         = -0.3

Forventningsverdien \`-0.3\` er IKKE en av de mulige verdiene \`X\` kan ta. Det er helt OK: forventningen er et tyngdepunkt i fordelingen, ikke et utfall.


## Når brukes \`E[X]\`?

- Som tyngdepunktet i fordelingen, dvs. det «typiske» nivået
- Som inngang til varians: \`Var(X) = Σ (x_i - μ)² · P(X = x_i)\`
- Som inngang til kovarians: \`Cov(X, Y) = E[XY] - μ_X · μ_Y\`

> [!tip] Lineæriteten \`E[aX + b] = a·E[X] + b\` og \`E[X + Y] = E[X] + E[Y]\` sparer mye regning. Den siste gjelder selv når \`X\` og \`Y\` ikke er uavhengige.
`,
      see_also: [
        {
          kind: "glossary",
          id: "forventningsverdi",
        },
        {
          kind: "entry",
          id: "varians-standardavvik-diskret",
        },
        {
          kind: "entry",
          id: "marginalfordeling",
        },
      ],
    },
  ],
  "gunstige-pa-mulige": [
    {
      id: "uniform-sannsynlighet",
      name: "Gunstige på mulige",
      abbreviation: "P(A)",
      formula: "P(A) = |A| / |Ω|",
      short: `Når alle utfall er like sannsynlige er sannsynligheten for \`A\` rett og slett antall gunstige delt på antall mulige.`,
      long: `\`P(A) = |A| / |Ω|\` er grunnregelen for sannsynlighet i en uniform fordeling, det vil si når alle elementære utfall er like sannsynlige. Da reduseres sannsynlighetsregning til ren telling.


## Hvordan lese formelen

\`Ω\` (utfallsrommet) er mengden av alle mulige utfall, og \`|Ω|\` er antall slike utfall. \`A\` er hendelsen vi spør om, og \`|A|\` er antall utfall som tilhører \`A\`.

> [!read] P(A) = |A| / |Ω|
> Sannsynligheten for \`A\` er antall gunstige utfall delt på antall mulige utfall.

Formelen krever at hvert enkeltutfall i \`Ω\` er like sannsynlig. Dersom utfallene har ulik vekt, må du i stedet bruke en navngitt fordeling (binomial, hypergeometrisk osv.).


## To telleledd, to kombinatorikk-oppgaver

I praksis blir oppgaven nesten alltid to mindre telleoppgaver, en for telleren og en for nevneren. Velg telleregel ut fra spørsmålet:

- Rekkefølgen teller, med tilbakelegging: \`n^k\`
- Rekkefølgen teller, uten tilbakelegging: \`n! / (n − k)!\`
- Rekkefølgen teller ikke, uten tilbakelegging: \`C(n, k)\`

> [!tip] Sørg for at teller og nevner bruker samme «verden» (begge ordnet eller begge uordnet). Hvis du teller gunstige som ordnet og mulige som uordnet, faller faktorene \`k!\` ut feil og du får et galt svar.


## Eksempel: 5 kort fra en kortstokk

Vi trekker 5 kort fra en stokk på 52 og spør om sannsynligheten for at alle 5 er hjerter. Trekkene er uten tilbakelegging og rekkefølgen i hånden er likegyldig, så vi teller med \`C(n, k)\`:

    Mulige:    C(52, 5) = 2 598 960
    Gunstige:  C(13, 5) = 1 287
    P(5 hjerter) = 1 287 / 2 598 960 ≈ 4.95 · 10⁻⁴

Det er ren telling, ingen fordeling trengs.
`,
      see_also: [
        {
          kind: "entry",
          id: "uordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "multiplikasjonsprinsippet",
        },
        {
          kind: "glossary",
          id: "hendelse",
        },
      ],
    },
  ],
  "hypergeometrisk-fordeling": [
    {
      id: "pmf",
      name: "Punktsannsynlighet",
      abbreviation: "PMF",
      formula: "P(X = k) = C(K, k) · C(N - K, n - k) / C(N, n)",
      short: `Sannsynligheten for nøyaktig \`k\` vellykkede når du trekker \`n\` uten tilbakelegging fra \`N\` (hvorav \`K\` er vellykkede).`,
      long: `\`P(X = k)\` er punktsannsynligheten i hypergeometrisk fordeling. Brøken er på formen «gunstige delt på mulige»: den teller antall måter å lage et utplukk med nøyaktig \`k\` vellykkede, og deler på antall måter å trekke et hvilket som helst utplukk på \`n\`.

> [!read] P(X = k) = (C(K, k) · C(N − K, n − k)) / C(N, n)
> Antall måter å plukke \`k\` vellykkede fra de \`K\` vellykkede, ganget med antall måter å plukke de resterende \`n − k\` fra de \`N − K\` mislykkede, delt på antall mulige utplukk på \`n\` fra \`N\`.


## Hvorfor uten tilbakelegging?

Siden vi trekker uten tilbakelegging, endrer suksessannsynligheten seg etter hver trekning. Det skiller hypergeometrisk fra binomial, hvor \`p\` er konstant. I praksis:

- Bruk hypergeometrisk når \`n\` er en stor andel av \`N\` (f.eks. \`n/N > 5 %\`).
- Bruk binomial som tilnærming når \`n\` er liten relativt til \`N\`.

> [!tip] Variablene er lette å forveksle: \`N\` er populasjonen, \`K\` er antall vellykkede DER, \`n\` er antall trekninger, \`k\` er antall vellykkede BLANT de trukne.


## Konkret eksempel

Vi trekker 5 kort fra en kortstokk på 52 kort. 13 av kortene er hjerter. Hva er sannsynligheten for at alle 5 trukne er hjerter?

1. Identifiser: \`N = 52\`, \`K = 13\`, \`n = 5\`, \`k = 5\`.
2. Sett inn i formelen:

        P(X = 5) = (C(13, 5) · C(39, 0)) / C(52, 5)
                 = (1287 · 1) / 2 598 960
                 ≈ 0.000495

Svar: omtrent \`4.95 · 10⁻⁴\`, dvs. én sjanse av 2000.


## Sjekk at telleren gir mening

Det er to enkle sanity-sjekker for telleren \`C(K, k) · C(N − K, n − k)\`:

- Hvis \`k > K\` eller \`n − k > N − K\`, er sannsynligheten 0 (du kan ikke plukke flere vellykkede enn det finnes).
- Forventningsverdien er \`E[X] = n · K/N\`. For kortstokk-eksempelet: \`5 · 13/52 = 1.25\`, så \`k = 5\` er langt unna det forventede og må derfor være lite sannsynlig.

> [!read] E[X] = n · K/N
> Forventet antall vellykkede er andelen vellykkede i populasjonen ganger antall trekninger.
`,
      see_also: [
        {
          kind: "entry",
          id: "binomial-fordeling",
        },
        {
          kind: "glossary",
          id: "uten-tilbakelegging-glos",
        },
        {
          kind: "entry",
          id: "uordnet-utvalg-uten-tilbakelegging",
        },
      ],
    },
  ],
  "ki-andel-binomial": [
    {
      id: "ki-andel",
      name: "Konfidensintervall for andel p",
      abbreviation: "KI",
      formula: "p̂ ± z_(α/2) · √(p̂(1−p̂)/n)",
      short: "Tilnærmet symmetrisk intervall for sannsynligheten p, basert på normalapproksimasjon av binomial.",
      long: `Formelen gir et tilnærmet konfidensintervall for den ukjente andelen \`p\` i en binomisk situasjon med \`X\` suksesser av \`n\` forsøk. Den hviler på at \`p̂ = X/n\` er tilnærmet normalfordelt rundt \`p\` når \`n\` er stort nok.


## Hvorfor \`√(p̂(1−p̂)/n)\` som standardfeil?

For en binomisk variabel er \`Var(p̂) = p(1−p)/n\`. Siden \`p\` er ukjent, plugger vi inn estimatet \`p̂\` for å få en brukbar standardfeil. Det er denne tilnærmingen som krever stort \`n\`.

> [!read] p̂ ± z_(α/2) · √(p̂(1−p̂)/n)
> «Den observerte andelen pluss-minus en kvantil ganger den estimerte standardfeilen til andelen.»


## Sjekk approksimasjons-betingelsen

Normalapproksimasjonen er først pålitelig når både forventet antall suksesser og forventet antall ikke-suksesser er stort nok. Vanlig regel:

    n · p̂ · (1 − p̂) ≥ 5

Hvis denne svikter, blir intervallet upålitelig (særlig når \`p̂\` ligger nær 0 eller 1).

> [!tip] I hypotesetest for andel bruker du \`p₀\` (verdi fra \`H₀\`) i standardfeilen, ikke \`p̂\`. I konfidensintervallet er det \`p̂\` som gjelder, fordi der har vi ingen \`p₀\` å sammenligne med.


## Eksempel: syke grantrær

Av \`n = 80\` grantrær var \`X = 23\` syke. For 90 % KI:

    p̂ = 23/80 = 0.2875
    sjekk: 80 · 0.2875 · 0.7125 ≈ 16.4 ≥ 5 (ok)
    SE = √(0.2875 · 0.7125/80) ≈ 0.0506
    margin = 1.645 · 0.0506 ≈ 0.0832
    KI = 0.2875 ± 0.0832 = (0.204, 0.371)

Vi er 90 % sikre på at den sanne andelen syke grantrær ligger mellom 20.4 % og 37.1 %.
`,
      see_also: [
        {
          kind: "glossary",
          id: "andel",
        },
        {
          kind: "glossary",
          id: "normalapproksimasjon",
        },
        {
          kind: "glossary",
          id: "standardfeil-til-andel",
        },
      ],
    },
  ],
  "ki-mu-kjent-sigma": [
    {
      id: "ki-z",
      name: "Konfidensintervall for μ (kjent σ)",
      abbreviation: "KI",
      formula: "x̄ ± z_(α/2) · σ/√n",
      short: "Symmetrisk z-basert intervall som med (1−α)·100 % sikkerhet dekker forventningsverdien μ.",
      long: `Formelen gir et tosidig konfidensintervall for \`μ\` når populasjonens standardavvik \`σ\` er kjent. Punktestimatet \`x̄\` plasseres i sentrum, og marginen settes ut fra hvor mye et utvalgsgjennomsnitt typisk varierer.


## Hvorfor akkurat \`z_(α/2) · σ/√n\`?

Utvalgsgjennomsnittet \`x̄\` har standardfeil \`σ/√n\` (sentralgrenseteoremet gjør at det er normalfordelt rundt \`μ\`). For å fange \`(1 − α)·100 %\` av sannsynlighetsmassen trekker vi like mye av i hver hale, derfor \`α/2\` per side.

> [!read] x̄ ± z_(α/2) · σ/√n
> «Gjennomsnittet pluss-minus en kvantil ganger standardfeilen.» Kvantilen \`z_(α/2)\` velges slik at \`P(Z > z_(α/2)) = α/2\`.


## Velg \`z_(α/2)\` etter konfidensnivå

Konfidensnivået bestemmer hvor stor andel \`α\` som kuttes vekk i halene. De vanligste verdiene:

- 90 % KI: \`α = 0.10\`, \`α/2 = 0.05\`, \`z = 1.645\`
- 95 % KI: \`α = 0.05\`, \`α/2 = 0.025\`, \`z = 1.960\`
- 99 % KI: \`α = 0.01\`, \`α/2 = 0.005\`, \`z = 2.576\`

> [!tip] Høyere konfidensnivå gir bredere intervall. Du kan ikke samtidig kreve høy sikkerhet og smal feilmargin uten å øke \`n\`.


## Eksempel: julelys

Anta \`n = 40\` julelys med \`x̄ = 48\` watt og kjent \`σ = 5\` watt. For 95 % KI:

    margin = 1.960 · 5/√40 ≈ 1.960 · 0.7906 ≈ 1.55
    KI = 48 ± 1.55 = [46.45, 49.55]

Vi er 95 % sikre på at den sanne forventede effekten ligger mellom 46.45 og 49.55 watt.
`,
      see_also: [
        {
          kind: "glossary",
          id: "konfidensintervall",
        },
        {
          kind: "glossary",
          id: "standardfeil",
        },
        {
          kind: "table",
          id: "E4-z-kvantiltabell",
        },
      ],
    },
  ],
  "ki-mu-ukjent-sigma": [
    {
      id: "ki-t",
      name: "Konfidensintervall for μ (ukjent σ)",
      abbreviation: "KI",
      formula: "x̄ ± t_(α/2, n−1) · s/√n",
      short: "T-basert intervall som korrigerer for at σ må estimeres fra utvalget med s.",
      long: `Formelen gir et tosidig konfidensintervall for \`μ\` når populasjonens standardavvik er ukjent. Vi erstatter \`σ\` med utvalgs-standardavviket \`s\`, og bruker t-fordelingen med \`ν = n − 1\` frihetsgrader for å kompensere for den ekstra usikkerheten i \`s\`.


## Hvorfor t-fordeling i stedet for z?

Når \`σ\` ikke er kjent, må vi estimere den fra dataene. \`s\` varierer fra utvalg til utvalg, og denne ekstra støyen gir tyngre haler enn standardnormal. T-fordelingen tar nettopp hensyn til det. For store \`n\` (typisk \`n ≥ 30\`) blir t-kvantilene nesten like z-kvantilene, men for små \`n\` er de merkbart større.

> [!read] x̄ ± t_(α/2, n−1) · s/√n
> «Gjennomsnittet pluss-minus t-kvantilen med \`n−1\` frihetsgrader, ganger den estimerte standardfeilen \`s/√n\`.»


## Slå opp \`t_(α/2, n−1)\`

Gå til tabell E.5. Velg kolonnen for \`α/2\` (vanligvis 0.025 for 95 % KI eller 0.05 for 90 %), og raden for frihetsgrader \`ν = n − 1\`. Eksempel: for \`n = 10\` og 95 % KI får du \`t_(0.025, 9) = 2.262\`.

> [!tip] Bruk alltid \`ν = n − 1\` for ett-utvalgs KI for \`μ\`. Først ved to-utvalgs- og regresjonssituasjoner endres frihetsgradene.


## Eksempel: klassetest

Anta \`n = 10\`, \`x̄ = 71.30\` og \`s = √205.34 ≈ 14.33\`. For 95 % KI:

    ν = 9, t_(0.025, 9) = 2.262
    margin = 2.262 · 14.33/√10 ≈ 2.262 · 4.531 ≈ 10.25
    KI = 71.30 ± 10.25 = [61.05, 81.55]

Vi er 95 % sikre på at forventet testresultat ligger mellom 61.05 og 81.55.
`,
      see_also: [
        {
          kind: "glossary",
          id: "t-fordeling",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
        {
          kind: "table",
          id: "E5-t-tabell",
        },
      ],
    },
  ],
  "ki-poissonrate": [
    {
      id: "ki-rate",
      name: "Konfidensintervall for poissonrate λ",
      abbreviation: "KI",
      formula: "λ̂ ± z_(α/2) · √(λ̂/t)",
      short: "Tilnærmet KI for raten λ i en poissonprosess, basert på Y hendelser i tidsvindu t.",
      long: `Formelen gir et tilnærmet konfidensintervall for raten \`λ\` i en poissonprosess. Vi har observert \`Y\` hendelser i et vindu av lengde \`t\`, og estimerer \`λ̂ = Y/t\`. Standardfeilen følger av at \`Var(Y) = λt\`, slik at \`Var(λ̂) = λ/t\`.


## Utledning av standardfeilen

For en poissonvariabel er variansen lik forventningen: \`Var(Y) = λt\`. Siden \`λ̂ = Y/t\` blir

    Var(λ̂) = Var(Y)/t² = λt/t² = λ/t

Vi bytter ut ukjente \`λ\` med estimatet \`λ̂\`, og tar kvadratroten for standardfeilen \`√(λ̂/t)\`. Ekvivalent uttrykk: \`√Y / t\`.

> [!read] λ̂ ± z_(α/2) · √(λ̂/t)
> «Den estimerte raten pluss-minus en kvantil ganger standardfeilen til raten.»


## Når er normalapproksimasjonen pålitelig?

Tommelfingerregel: \`λt > 10\`, dvs. \`Y > 10\`. For mindre \`Y\` blir poissonfordelingen for skjev til at den symmetriske \`z\`-formelen treffer godt; da bør man bruke en eksakt metode.

> [!tip] Pass på enheter. \`λ\` og \`t\` må være i samme enhet (alle i timer eller alle i år). Bytt om hvis oppgaven blander.


## Eksempel: klippeblåvinger

Fellen står ute i \`t = 5\` uker = 840 timer, og fanger \`Y = 15\` sommerfugler. For 90 % KI:

    λ̂ = 15/840 ≈ 0.01786 pr. time
    Y = 15 > 10 (normalapproksimasjon ok)
    margin = 1.645 · √(0.01786/840) = 1.645 · 0.00461 ≈ 0.00758
    KI = 0.01786 ± 0.00758 = [0.0103, 0.0254]

Vi er 90 % sikre på at fangstraten ligger mellom 0.0103 og 0.0254 sommerfugler pr. time.
`,
      see_also: [
        {
          kind: "glossary",
          id: "lambda",
        },
        {
          kind: "glossary",
          id: "poisson-prosess",
        },
        {
          kind: "glossary",
          id: "normalapproksimasjon",
        },
      ],
    },
  ],
  "ki-varians": [
    {
      id: "ki-sigma2",
      name: "Konfidensintervall for σ²",
      abbreviation: "KI",
      formula: "((n−1)s² / χ²_(α/2, n−1),  (n−1)s² / χ²_(1−α/2, n−1))",
      short: "Asymmetrisk KI for variansen, bygget på at (n−1)s²/σ² er χ²-fordelt med n−1 frihetsgrader.",
      long: `Formelen gir et \`(1 − α)·100 %\` konfidensintervall for populasjonens varians \`σ²\` ut fra utvalgsvariansen \`s²\`. Intervallet er asymmetrisk fordi \`χ²\`-fordelingen i seg selv er skjev.


## Hvorfor \`χ²\`-fordelingen?

For normalfordelte data er størrelsen \`(n−1)s² / σ²\` eksakt \`χ²\`-fordelt med \`ν = n − 1\` frihetsgrader. Setter vi denne mellom de to halene \`χ²_(1−α/2, ν)\` og \`χ²_(α/2, ν)\` og snur ulikheten for å få \`σ²\` alene, faller formelen ut:

    P( χ²_(1−α/2, ν) ≤ (n−1)s²/σ² ≤ χ²_(α/2, ν) ) = 1 − α

> [!read] (n−1)s² / χ²_(α/2, ν)  ≤ σ²  ≤ (n−1)s² / χ²_(1−α/2, ν)
> «Den lille kvantilen havner i nevneren for ØVRE grense; den store kvantilen i nevneren for NEDRE grense.» Det er omvendt av det man intuitivt forventer, fordi \`σ²\` står i nevneren før vi snur.


## Få KI for \`σ\` i tillegg

Kvadratroten er monoton og positiv, så et KI for \`σ\` får du gratis ved å ta \`√\` av begge endepunktene:

    KI for σ = [ √nedre, √øvre ]

> [!tip] Du kan ikke sentrere intervallet rundt \`s²\`. Asymmetrien er ekte og forventet, særlig for små \`n\`.


## Eksempel: maskinpresisjon

Anta \`n = 15\` målinger med \`s² = 4.5\`, normalfordeling antatt, 95 % KI. Da er \`ν = 14\`, \`α/2 = 0.025\`:

    χ²_(0.025, 14) = 26.12
    χ²_(0.975, 14) = 5.63
    nedre = 14 · 4.5 / 26.12 ≈ 2.41
    øvre  = 14 · 4.5 / 5.63  ≈ 11.19
    KI for σ² = [2.41, 11.19]
    KI for σ  = [1.55, 3.34]

Vi er 95 % sikre på at \`σ²\` ligger mellom 2.41 og 11.19.
`,
      see_also: [
        {
          kind: "glossary",
          id: "chi",
        },
        {
          kind: "glossary",
          id: "utvalgsvarians",
        },
        {
          kind: "table",
          id: "E6-kjikvadrattabell",
        },
      ],
    },
  ],
  "kjikvadrat-goodness-of-fit": [
    {
      id: "chi-observator",
      name: "χ²-observator (tilpasningstest)",
      abbreviation: "χ²",
      formula: "χ² = Σ (O_i − E_i)² / E_i",
      short: "Summerer kvadratavvik mellom observert og forventet antall, skalert med forventet. Stor verdi = dårlig tilpasning.",
      long: `\`χ²\` er testobservatoren i kjikvadrat-tilpasningstest. Den måler det totale avviket mellom observerte antall \`O_i\` og forventede antall \`E_i\` (under \`H₀\`) på tvers av alle \`k\` kategoriene.


## Hvordan lese formelen

> [!read] χ² = Σ (O_i − E_i)² / E_i
> «Sum over kategorier av kvadrert avvik delt på forventet antall.»

For hver kategori regner vi \`(observert − forventet)²\`, deler på det forventede antallet (for å skalere riktig), og legger sammen. Stor \`χ²\` betyr at observasjonene avviker mye fra det \`H₀\` forutsier; liten \`χ²\` betyr god tilpasning.


## Hvorfor dele på \`E_i\`

Et avvik på 5 betyr noe annet i en kategori med \`E_i = 10\` enn i en med \`E_i = 1000\`. Ved å dele på \`E_i\` standardiserer vi avviket i forhold til hvor stort antallet «burde» vært. Dette er nært beslektet med poissonvarians, der varians er lik forventningen.

> [!tip] Tommelfingerregel: alle \`E_i ≥ 5\`, ellers er normalapproksimasjonen som ligger bak χ²-fordelingen for grov. Slå sammen små kategorier hvis nødvendig.

Frihetsgrader: \`ν = k − 1\` hvis \`H₀\` spesifiserer fordelingen helt, eller \`ν = k − 1 − m\` hvis \`m\` parametre er estimert fra dataene.


## Konkret eksempel

En terning kastes \`n = 60\` ganger og gir tellinger \`1: 8, 2: 9, 3: 11, 4: 13, 5: 10, 6: 9\`. Test om terningen er rettferdig.

Under \`H₀\`: \`E_i = 60·(1/6) = 10\` for alle sider.

    χ² = (8−10)²/10 + (9−10)²/10 + (11−10)²/10
       + (13−10)²/10 + (10−10)²/10 + (9−10)²/10
       = 0.4 + 0.1 + 0.1 + 0.9 + 0 + 0.1
       = 1.6

Med \`ν = k − 1 = 5\` og \`α = 0.05\` er kritisk verdi \`χ²_(0.05, 5) = 11.07\`. Siden \`1.6 < 11.07\`, beholder vi \`H₀\`: ingen grunn til å hevde at terningen er urettferdig.
`,
      see_also: [
        {
          kind: "glossary",
          id: "goodness-of-fit",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
        {
          kind: "glossary",
          id: "chi",
        },
        {
          kind: "table",
          id: "E6-kjikvadrattabell",
        },
      ],
    },
  ],
  "kjikvadrat-uavhengighet": [
    {
      id: "chi-observator-kontingenstabell",
      name: "χ²-observator for kontingenstabell",
      abbreviation: "χ²",
      formula: "χ² = Σ (O_ij − E_ij)² / E_ij,    E_ij = (rad_i · kol_j) / n",
      short: "Samme idé som tilpasningstest, men forventet antall i celle (i, j) regnes fra rad- og kolonnesummer under uavhengighet.",
      long: `\`χ²\` for uavhengighet sammenligner observerte og forventede antall i en \`r × c\`-kontingenstabell. Forskjellen fra goodness-of-fit er hvordan \`E_ij\` regnes ut: under \`H₀\` (uavhengighet) er forventet antall i celle (\`i\`, \`j\`) lik produkt av marginalandeler ganger totalen.


## Hvordan lese formelen

> [!read] E_ij = (rad_i · kol_j) / n
> «Hvis variablene er uavhengige, er forventet antall i en celle lik radens andel ganger kolonnens andel ganger totalen.»

> [!read] χ² = Σ (O_ij − E_ij)² / E_ij
> «Sum over alle celler av kvadrert avvik delt på forventet antall.»

Uavhengighet betyr \`P(rad_i ∩ kol_j) = P(rad_i)·P(kol_j)\`. Estimerer vi \`P(rad_i) ≈ rad_i/n\` og \`P(kol_j) ≈ kol_j/n\`, blir forventet antall i celle (\`i\`, \`j\`) lik \`n · (rad_i/n) · (kol_j/n) = (rad_i · kol_j)/n\`.


## Frihetsgrader

> [!tip] \`ν = (r − 1)(c − 1)\`, ikke \`r·c − 1\`. Når radsummene og kolonnesummene er fastlåste (vi har estimert dem fra dataene), er det bare \`(r − 1)(c − 1)\` celler som kan velges fritt, resten er bestemt av marginalsummene.

For en 2 × 2-tabell betyr det \`ν = 1\`. For en 3 × 4-tabell betyr det \`ν = 2 · 3 = 6\`.


## Konkret eksempel

100 personer spørres om kjønn (M/K) og om de tar tran (Ja/Nei). Tabell: M-Ja=20, M-Nei=30, K-Ja=25, K-Nei=25.

Marginalsummer: M=50, K=50, Ja=45, Nei=55.

    E(M, Ja) = 50·45/100 = 22.5
    E(M, Nei) = 50·55/100 = 27.5
    E(K, Ja) = 50·45/100 = 22.5
    E(K, Nei) = 50·55/100 = 27.5

    χ² = (20−22.5)²/22.5 + (30−27.5)²/27.5
       + (25−22.5)²/22.5 + (25−27.5)²/27.5
       ≈ 0.278 + 0.227 + 0.278 + 0.227
       ≈ 1.010

Med \`ν = (2−1)(2−1) = 1\` og \`α = 0.05\` er kritisk verdi \`χ²_(0.05, 1) = 3.841\`. Siden \`1.010 < 3.841\`, beholder vi \`H₀\`: ingen statistisk grunnlag for å hevde at kjønn og trandrikking henger sammen.
`,
      see_also: [
        {
          kind: "glossary",
          id: "kontingenstabell",
        },
        {
          kind: "glossary",
          id: "uavhengighet-glos",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
        {
          kind: "table",
          id: "E6-kjikvadrattabell",
        },
      ],
    },
  ],
  "komplementregelen": [
    {
      id: "komplement",
      name: "Komplementregelen",
      abbreviation: "KOMPL",
      formula: "P(Aᶜ) = 1 − P(A)",
      short: "Sannsynligheten for at noe IKKE skjer er én minus sannsynligheten for at det skjer.",
      long: `\`P(Aᶜ) = 1 − P(A)\` sier at sannsynligheten for at hendelsen \`A\` IKKE inntreffer er én minus sannsynligheten for at den inntreffer. Dette er den enkleste regelen i sannsynlighetsregning, men også en av de mest brukte.


## Hvorfor regelen finnes

Utfallsrommet \`S\` har total sannsynlighet 1. Hendelsen \`A\` og komplementet \`Aᶜ\` deler \`S\` i to disjunkte deler som dekker alt:

> [!read] P(A) + P(Aᶜ) = 1
> Sannsynlighetene for \`A\` og det motsatte av \`A\` summerer alltid til 1.

Dermed følger \`P(Aᶜ) = 1 − P(A)\` direkte. Det er bare en omskrivning av at «noe må skje».


## Når er komplementet enklere?

Mange spørsmål er formulert med ord som «minst én», «ingen», «høyst», «ikke alle». Direkte beregning krever ofte å summere over mange utfall, mens komplementet er én enkelt utregning.

> [!tip] Når du ser «minst én», tenk komplement med en gang. \`P(minst én suksess) = 1 − P(ingen suksesser)\` er nesten alltid raskere.

Klassisk: «minst én sekser i 4 kast med terning». Direkte måtte du summere \`P(X = 1) + P(X = 2) + P(X = 3) + P(X = 4)\`. Via komplementet:

    P(X ≥ 1) = 1 − P(X = 0) = 1 − (5/6)⁴ ≈ 1 − 0.4823 = 0.5177


## Indeks-fellen for «minst k»

En av de vanligste regnefeilene i kumulative tabeller:

> [!read] P(X ≥ k) = 1 − P(X ≤ k − 1)
> Komplementet av «minst \`k\`» er «høyst \`k − 1\`», IKKE «høyst \`k\`».

For \`k = 3\` er \`P(X ≥ 3) = 1 − P(X ≤ 2)\`, ikke \`1 − P(X ≤ 3)\`. Hadde du brukt det siste, mistet du bidraget fra \`X = 3\` selv.
`,
      see_also: [
        {
          kind: "entry",
          id: "unionssetningen",
        },
        {
          kind: "glossary",
          id: "komplement",
        },
        {
          kind: "glossary",
          id: "hendelse",
        },
      ],
    },
  ],
  "korrelasjon-joint": [
    {
      id: "rho",
      name: "Korrelasjon ρ(X, Y) for fellesfordeling",
      abbreviation: "ρ",
      formula: "ρ(X, Y) = Cov(X, Y) / (σ_X · σ_Y)",
      short: `Normalisert kovarians, alltid mellom \`-1\` og \`1\`. Enhetsuavhengig styrke på lineær sammenheng.`,
      long: `\`ρ(X, Y)\` er korrelasjonskoeffisienten for fellesfordelingen til \`X\` og \`Y\`. Den skalerer kovariansen ved å dele på produktet av standardavvikene, slik at resultatet alltid ligger i intervallet \`[-1, 1]\`.


## Hvorfor normalisere?

Kovariansen avhenger av enhetene til \`X\` og \`Y\`. Hvis \`X\` måles i cm og \`Y\` i kg, har \`Cov(X, Y)\` enheten cm·kg, som er vanskelig å tolke. Ved å dele på \`σ_X · σ_Y\` (samme enhet) faller enhetene bort:

> [!read] ρ(X, Y) = Cov(X, Y) / (σ_X · σ_Y)
> Korrelasjonen er kovariansen normalisert med produktet av standardavvikene.

Resultatet:

- \`ρ = 1\`: perfekt positiv lineær sammenheng
- \`ρ = -1\`: perfekt negativ lineær sammenheng
- \`ρ = 0\`: ingen lineær sammenheng
- \`|ρ|\` mellom 0 og 1: styrken på lineær sammenheng


## Konkret eksempel

Fra simultantabellen i \`kovarians\`-eksempelet har vi:

    Cov(X, Y) = -0.12
    σ_X = √0.24 ≈ 0.4899
    σ_Y = √0.61 ≈ 0.7810

Sett inn:

    ρ(X, Y) = -0.12 / (0.4899 · 0.7810)
            = -0.12 / 0.3826
            ≈ -0.314

Fortegnet er negativt og størrelsen moderat: når \`X\` øker, har \`Y\` en svak til moderat tendens til å minke.


## Tommelfingerregler for tolkning

- \`|ρ| < 0.3\`: svak lineær sammenheng
- \`0.3 ≤ |ρ| < 0.7\`: moderat
- \`|ρ| ≥ 0.7\`: sterk

> [!tip] \`ρ\` for fellesfordelingen og \`r\` (Pearsons korrelasjon for utvalg) er konseptuelt forskjellige, selv om formlene ligner. \`ρ\` er en parameter i en teoretisk modell; \`r\` er en estimator beregnet fra rådata-par \`(x_i, y_i)\`. Bruk \`r\` i regresjonssammenheng, \`ρ\` når du jobber med en oppgitt simultanfordeling.
`,
      see_also: [
        {
          kind: "glossary",
          id: "korrelasjon-glos",
        },
        {
          kind: "entry",
          id: "kovarians",
        },
        {
          kind: "entry",
          id: "regresjon-korrelasjonskoeffisient",
        },
      ],
    },
  ],
  "kovarians": [
    {
      id: "covariance",
      name: "Kovarians Cov(X, Y)",
      abbreviation: "Cov",
      formula: "Cov(X, Y) = E[XY] − μ_X · μ_Y",
      short: "Mål for lineær samvariasjon. Positiv: følges ad. Negativ: motsatt. Null: ingen lineær sammenheng.",
      long: `\`Cov(X, Y)\` måler i hvilken grad \`X\` og \`Y\` beveger seg sammen. Definisjonen kan skrives på to ekvivalente måter:

> [!read] Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)]
> Forventet produkt av avvikene fra hver sin forventningsverdi.

> [!read] Cov(X, Y) = E[XY] − μ_X · μ_Y
> Forventet produkt minus produkt av forventninger. Lettest å regne med i praksis.


## Slik regner du \`E[XY]\`

For en diskret simultanfordeling:

    E[XY] = Σ_i Σ_j x_i · y_j · P(X = x_i, Y = y_j)

Merk at celler med \`x_i = 0\` eller \`y_j = 0\` bidrar med null, så de kan hoppes over.


## Konkret eksempel

Gitt simultantabellen med \`μ_X = 0.60\`, \`μ_Y = 0.70\`:

              Y=0   Y=1   Y=2
    X=0       0.10  0.20  0.10
    X=1       0.40  0.10  0.10

Kun cellene \`(1, 1)\` og \`(1, 2)\` har både \`x ≠ 0\` og \`y ≠ 0\`:

    E[XY] = 1·1·0.10 + 1·2·0.10 = 0.10 + 0.20 = 0.30

Sett inn:

    Cov(X, Y) = E[XY] − μ_X · μ_Y
              = 0.30 − 0.60 · 0.70
              = 0.30 − 0.42
              = −0.12


## Tolkning av fortegn

- \`Cov > 0\`: store \`X\` opptrer typisk sammen med store \`Y\`
- \`Cov < 0\`: store \`X\` opptrer typisk sammen med små \`Y\`
- \`Cov = 0\`: ingen lineær sammenheng (men kan likevel være avhengighet, f.eks. \`Y = X²\`)

> [!tip] Kovarians er enhetssensitiv: bytter du \`X\` fra cm til m, krymper kovariansen med en faktor 100. For å sammenligne styrken på lineær sammenheng på tvers av problemer, bruk korrelasjonen \`ρ = Cov(X, Y) / (σ_X · σ_Y)\`, som er enhetsuavhengig.
`,
      see_also: [
        {
          kind: "glossary",
          id: "kovarians-glos",
        },
        {
          kind: "entry",
          id: "korrelasjon-joint",
        },
        {
          kind: "entry",
          id: "marginalfordeling",
        },
      ],
    },
  ],
  "marginalfordeling": [
    {
      id: "marginal",
      name: "Marginalfordeling fra simultanfordeling",
      abbreviation: "P(X)",
      formula: "P(X = x) = Σ_y P(X = x, Y = y)",
      short: `Sum ut den andre variabelen: rad-summer for \`P(X)\`, kolonnesummer for \`P(Y)\`.`,
      long: `Marginalfordelingen er sannsynlighetsfordelingen til \`X\` alene, hentet ut fra simultanfordelingen for \`(X, Y)\`. Du «summerer ut» \`Y\` ved å legge sammen alle simultansannsynligheter for hver fast \`x\`.


## Rad-sum eller kolonnesum?

I en simultantabell der \`X\` står i radene og \`Y\` i kolonnene:

> [!read] P(X = x) = Σ_y P(X = x, Y = y)
> Marginalsannsynligheten for \`X = x\` er summen langs raden \`x\`.

> [!read] P(Y = y) = Σ_x P(X = x, Y = y)
> Marginalsannsynligheten for \`Y = y\` er summen langs kolonnen \`y\`.

Logikken: hendelsen \`X = x\` skjer uansett hvilken \`y\` som inntreffer. Derfor er \`P(X = x)\` summen av alle de gjensidig utelukkende måtene \`X = x\` kan opptre på.


## Konkret eksempel

Gitt simultantabellen:

              Y=0   Y=1   Y=2
    X=0       0.10  0.20  0.10
    X=1       0.40  0.10  0.10

Rad-summer (marginal av \`X\`):

    P(X = 0) = 0.10 + 0.20 + 0.10 = 0.40
    P(X = 1) = 0.40 + 0.10 + 0.10 = 0.60

Kolonnesummer (marginal av \`Y\`):

    P(Y = 0) = 0.10 + 0.40 = 0.50
    P(Y = 1) = 0.20 + 0.10 = 0.30
    P(Y = 2) = 0.10 + 0.10 = 0.20


## Sjekkpunkt: summer til 1

Begge marginalfordelingene må summere til 1:

    Σ P(X = x) = 0.40 + 0.60 = 1.00 ✓
    Σ P(Y = y) = 0.50 + 0.30 + 0.20 = 1.00 ✓

> [!tip] Marginalene er nesten alltid første steg når du jobber med simultanfordeling. Du trenger dem for \`E[X]\`, \`E[Y]\`, variansene og dermed også for \`Cov\` og \`ρ\`. Skriv dem alltid inn i margen av tabellen, så er resten av oppgaven enklere.
`,
      see_also: [
        {
          kind: "glossary",
          id: "marginalfordeling-term",
        },
        {
          kind: "glossary",
          id: "simultanfordeling",
        },
        {
          kind: "entry",
          id: "kovarians",
        },
      ],
    },
  ],
  "normalfordeling": [
    {
      id: "pdf",
      name: "Sannsynlighetstetthetsfunksjon",
      abbreviation: "PDF",
      formula: "f(x) = (1 / (σ√(2π))) · e^(-(x - μ)² / (2σ²))",
      short: `Klokkekurven selv. Beskriver hvor tett fordelingen ligger ved et bestemt punkt \`x\`.`,
      long: `\`f(x)\` er tetthetsfunksjonen til normalfordelingen.
Den tegner den klassiske «klokkeformen» som er symmetrisk om \`μ\` og har bredde styrt av \`σ\`.


## Hvorfor er ikke \`f(x)\` en sannsynlighet?

For en kontinuerlig variabel som \`X\` er sannsynligheten for å treffe et eksakt enkelt-punkt alltid null:

> [!read] P(X = x) = 0
> Sannsynligheten for at \`X\` er nøyaktig lik \`x\` er null, fordi \`X\` kan anta uendelig mange verdier i et intervall.

Verdien \`f(x)\` er derfor ikke en sannsynlighet. Den sier hvor tett sannsynlighetsmassen ligger rundt \`x\`, målt i sannsynlighet per enhet av \`x\`.


## Slik blir tettheten til sannsynlighet

Du får en faktisk sannsynlighet ved å integrere \`f\` over et intervall, dvs. arealet under klokkekurven:

> [!read] P(a < X < b) = ∫ f(x) dx fra a til b
> Sannsynligheten for at \`X\` faller mellom \`a\` og \`b\` er arealet under tetthetskurven mellom de to punktene.

I praksis regner du aldri ut dette integralet selv. Du standardiserer i stedet til \`Z\` og slår opp \`G(z)\` i tabell E.3.


## Konkret eksempel

Kaffemengde \`X ~ N(25, 0.48)\` cl. Tettheten i punktet \`x = 25\` er:

    f(25) = 1 / (0.48 · √(2π)) ≈ 0.831

Tallet \`0.831\` er IKKE en sannsynlighet (det er ikke engang \`≤ 1\` for alle fordelinger). Det betyr bare at klokkekurven ligger «høyt» rundt midten. For å regne ut at en kopp er under 24 cl bruker du heller standardisering: \`z = (24 − 25)/0.48 ≈ −2.08\`, så \`P(X < 24) = G(−2.08) ≈ 0.0188\`.

> [!tip] Du tegner \`f(x)\` for å skissere fordelingen, men du regner sannsynligheter via standardisering og Z-tabellen (E.3).
`,
      see_also: [
        {
          kind: "glossary",
          id: "sannsynlighetsfordeling",
        },
        {
          kind: "entry",
          id: "sum-uavhengige-normaler",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
      ],
    },
    {
      id: "standardisering",
      name: "Standardisering",
      abbreviation: "Z",
      formula: "Z = (X - μ) / σ ~ N(0, 1)",
      short: "Gjør om en hvilken som helst normalfordeling til standardnormal slik at du kan slå opp i Z-tabellen.",
      long: `Standardisering er trikset som gjør at du KUN trenger én tabell (E.3) for ALLE normalfordelinger. Du regner om \`X ~ N(μ, σ)\` til en variabel \`Z\` som er standardnormal, dvs. \`N(0, 1)\`.

> [!read] Z = (X − μ) / σ
> Z forteller hvor mange standardavvik observasjonen \`X\` ligger over (\`Z > 0\`) eller under (\`Z < 0\`) gjennomsnittet.


## Hvorfor virker dette?

Å trekke fra \`μ\` flytter sentrum av fordelingen til 0. Å dele på \`σ\` stuker eller strekker bredden slik at standardavviket blir 1. Resultatet \`Z\` har dermed alltid samme fordeling, uansett hva \`μ\` og \`σ\` var.

> [!read] P(X ≤ x) = P(Z ≤ (x − μ)/σ) = G((x − μ)/σ)
> Sannsynligheten for at \`X\` er under \`x\` er den samme som at den standardiserte verdien er under tilsvarende \`z\`-verdi, som du finner i tabell E.3.


## Konkret eksempel

Fyllingen \`X\` av såpebeholdere er \`N(302, 5²)\` ml. Hva er \`P(X > 310)\`?

1. Standardiser: \`z = (310 − 302)/5 = 8/5 = 1.6\`
2. Slå opp i E.3: \`G(1.6) ≈ 0.9452\`
3. Bruk komplement (E.3 gir venstrearealet): \`P(X > 310) = 1 − 0.9452 = 0.0548\`

Svar: ca. 5.5 % av beholderne har mer enn 310 ml.


## Vanlige fallgruver

- Bruk \`σ\`, ikke \`σ²\`. Hvis oppgaven sier «varians 25», så er \`σ = 5\`.
- Fortegn: \`x > μ\` gir \`z > 0\` (svar \`< 0.5\`); \`x < μ\` gir \`z < 0\` (svar \`> 0.5\`).
- Rund \`z\` til 2 desimaler for å passe tabellen (\`z = −2.08\`, ikke \`−2.0833\`).

> [!tip] Tenk på \`Z\` som «hvor ekstrem er denne observasjonen i standardavvik». \`Z = 2\` betyr to \`σ\` over snittet, uavhengig av hvilken normalfordeling du startet med.
`,
      see_also: [
        {
          kind: "glossary",
          id: "normalisering",
        },
        {
          kind: "glossary",
          id: "z-score",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
      ],
    },
  ],
  "ordnet-utvalg-med-tilbakelegging": [
    {
      id: "n-opphoyd-k",
      name: "Ordnet utvalg med tilbakelegging",
      abbreviation: "n^k",
      formula: "Antall sekvenser = n^k",
      short: `Antall ordnede sekvenser av lengde \`k\` når hver posisjon kan velges fritt blant \`n\` verdier (gjentakelse tillatt).`,
      long: `\`n^k\` teller hvor mange ulike ordnede sekvenser du kan lage når hver av de \`k\` posisjonene uavhengig kan fylles med en av \`n\` verdier, og samme verdi gjerne kan dukke opp flere ganger.


## Hvordan lese formelen

> [!read] n^k
> \`n\` mulige verdier på posisjon 1, ganger \`n\` på posisjon 2, og så videre \`k\` ganger. Multiplikasjonsprinsippet gir \`n · n · ... · n = n^k\`.

Kjenneteg på at du skal bruke \`n^k\`:

- Du har \`k\` posisjoner eller forsøk
- Hver posisjon har \`n\` mulige verdier
- Rekkefølgen teller (\`(1, 2, 3) ≠ (3, 2, 1)\`)
- Forsøkene er uavhengige (med tilbakelegging)


## Sannsynlighet via gunstige på mulige

Når alle sekvenser er like sannsynlige, kan du regne sannsynligheter direkte med \`n^k\` i nevneren:

> [!read] P(spesifikk sekvens) = gunstige / n^k
> Antall sekvenser som matcher mønsteret, delt på alle mulige sekvenser.

For «minst én»-spørsmål er komplementtrikset standard:

> [!read] P(minst én X) = 1 − (1 − p)^k
> Komplementet «ingen X i \`k\` forsøk» har sannsynlighet \`(1 − p)^k\`, så minst én er bare 1 minus dette.

> [!tip] \`n^k ≠ k^n\`. Pass på at \`n\` er antall valg per posisjon og \`k\` er antall posisjoner. \`2^10 = 1024\`, men \`10^2 = 100\`.


## Eksempel: PIN-kode og terningkast

Fire-sifret PIN-kode: hver posisjon har \`n = 10\` mulige sifre og det er \`k = 4\` posisjoner.

    10^4 = 10 000 mulige koder
    P(akkurat 1234) = 1 / 10 000

Kast en terning seks ganger og spør om minst én sekser. Her er \`p = 1/6\` og \`k = 6\`:

    P(ingen sekser)   = (5/6)^6 ≈ 0.3349
    P(minst én sekser) = 1 − (5/6)^6 ≈ 0.6651
`,
      see_also: [
        {
          kind: "entry",
          id: "ordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "entry",
          id: "gunstige-pa-mulige",
        },
        {
          kind: "glossary",
          id: "multiplikasjonsprinsippet",
        },
      ],
    },
  ],
  "ordnet-utvalg-uten-tilbakelegging": [
    {
      id: "permutasjon",
      name: "Ordnet utvalg uten tilbakelegging",
      abbreviation: "P(n,k)",
      formula: "P(n, k) = n! / (n − k)!",
      short: `Antall ordnede utvalg av \`k\` elementer fra \`n\`, der rekkefølgen teller og hvert element kan brukes høyst én gang.`,
      long: `\`P(n, k)\` (også skrevet \`ⁿPₖ\`) teller antall ordnede sekvenser av lengde \`k\` du kan lage ved å plukke fra \`n\` ulike elementer uten gjentakelse. Dette kalles permutasjoner av \`k\` fra \`n\`.


## Hvordan lese formelen

> [!read] P(n, k) = n! / (n − k)! = n · (n − 1) · ... · (n − k + 1)
> Posisjon 1 har \`n\` valg, posisjon 2 har \`n − 1\` valg (én er brukt opp), og så videre ned til posisjon \`k\` som har \`n − k + 1\` valg. Produktet er det samme som \`n! / (n − k)!\`.

Kjenneteg du må sjekke før du bruker formelen:

- Du velger \`k\` elementer fra \`n\` ulike
- Rekkefølgen teller (gull, sølv og bronse er ulike posisjoner)
- Uten tilbakelegging (samme element kan ikke brukes to ganger)

Når \`k = n\` gir formelen alle elementene på rekke: \`P(n, n) = n! / 0! = n!\` (per konvensjon \`0! = 1\`).


## Sannsynlighet for en bestemt rekkefølge

Når alle ordnede sekvenser er like sannsynlige, gir uniform sannsynlighet:

> [!read] P(spesifikk sekvens) = 1 / P(n, k)
> Bare én av \`P(n, k)\` like sannsynlige sekvenser matcher den ene bestemte rekkefølgen.

> [!tip] «Bestemt sekvens» (1 gunstig) og «bestemt sett i hvilken som helst rekkefølge» (\`k!\` gunstige) er ulike spørsmål. Hvis rekkefølgen er fri, må du gange med \`k!\` i telleren, eller gå over til uordnet utvalg med \`C(n, k)\`.


## Eksempel: medaljer og kort i bestemt rekkefølge

Gull, sølv og bronse blant 10 deltakere: \`n = 10\`, \`k = 3\`.

    P(10, 3) = 10 · 9 · 8 = 720 mulige medaljefordelinger

Trekk 3 kort fra en stokk på 52 i en bestemt rekkefølge (for eksempel spar ess, så hjerter dame, så kløver 7):

    P(52, 3) = 52 · 51 · 50 = 132 600
    P(akkurat denne rekkefølgen) = 1 / 132 600 ≈ 7.54 · 10⁻⁶
`,
      see_also: [
        {
          kind: "entry",
          id: "ordnet-utvalg-med-tilbakelegging",
        },
        {
          kind: "entry",
          id: "uordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "ordnet-utvalg",
        },
      ],
    },
  ],
  "poisson-fordeling": [
    {
      id: "pmf",
      name: "Punktsannsynlighet",
      abbreviation: "PMF",
      formula: "P(X = k) = e^(-λt) · (λt)^k / k!",
      short: `Sannsynligheten for nøyaktig \`k\` hendelser i et tidsvindu med rate \`λ\` og lengde \`t\`.`,
      long: `\`P(X = k)\` er punktsannsynligheten i poissonfordelingen. Den gir sannsynligheten for at NØYAKTIG \`k\` hendelser inntreffer i et vindu der vi forventer \`μ = λt\` hendelser.

> [!read] P(X = k) = e^(-μ) · μ^k / k!
> Sannsynligheten for \`k\` hendelser når forventet antall er \`μ\`. Skriv gjerne \`μ = λt\` slik at oppgaven blir lettere å håndtere.


## De tre delene av formelen

Formelen har tre faktorer som hver gjør sin jobb:

- \`e^(-μ)\`: vekten av «ingen hendelser i det hele tatt», jo større \`μ\`, jo mindre.
- \`μ^k\`: belønner høyere \`k\` når raten er høy.
- \`1/k!\`: korrigerer for at de \`k\` hendelsene kunne kommet i et hvilket som helst rekkefølge.

> [!tip] Spesialtilfellet \`k = 0\` kollapser til \`P(X = 0) = e^(-μ)\` fordi \`μ⁰ = 1\` og \`0! = 1\`. Bruk det direkte for spørsmål om «ingen hendelser».


## Konkret eksempel

Klippeblåvinger fanges som en poissonprosess med rate \`λ = 0.01\` sommerfugler pr. time. La \`X\` være antall i fellen etter én uke (\`t = 168\` timer). Finn \`P(X = 2)\`.

1. Forventet antall: \`μ = λt = 0.01 · 168 = 1.68\`
2. Sett inn i formelen:

        P(X = 2) = e^(-1.68) · 1.68² / 2!
                 = 0.1864 · 2.8224 / 2
                 ≈ 0.263

Svar: ca. 26 % sjanse for nøyaktig to sommerfugler i fellen.


## Når bruke formelen og når tabell E.2?

- For NØYAKTIG \`k\` hendelser: bruk formelen direkte (E.2 gir kumulativ, ikke punkt).
- For HØYST \`k\` (\`P(X ≤ k)\`): slå opp i tabell E.2.
- For MINST \`k\` (\`P(X ≥ k)\`): bruk komplement, \`1 − P(X ≤ k − 1)\`, og tabell E.2.

> [!note] Pass på indeksen i komplementet: tabellen skal slås opp på \`k − 1\`, ikke \`k\`. F.eks. \`P(X ≥ 3) = 1 − P(X ≤ 2)\`. Bruker du \`P(X ≤ 3)\` i stedet, mister du bidraget fra \`X = 3\` selv og svaret blir for lavt.

> [!read] μ = λt
> Forventet antall hendelser er rate ganger vinduslengde. Pass på at \`λ\` og \`t\` har samme tidsenhet før du multipliserer.
`,
      see_also: [
        {
          kind: "glossary",
          id: "poisson-prosess",
        },
        {
          kind: "entry",
          id: "eksponential-fordeling",
        },
        {
          kind: "table",
          id: "E2-poisson-kumulativ",
        },
      ],
    },
  ],
  "produktregel": [
    {
      id: "produkt",
      name: "Produktregelen",
      abbreviation: "PROD",
      formula: "P(A ∩ B) = P(A) · P(B | A)",
      short: "Sannsynligheten for at både A og B inntreffer, regnet sekvensielt.",
      long: `\`P(A ∩ B) = P(A) · P(B | A)\` sier hvordan sannsynligheter kombineres når to hendelser skjer sammen. Først må \`A\` skje, så må \`B\` skje gitt at \`A\` allerede har skjedd.


## Hvordan formelen leses

Produktregelen er bare en omskrivning av definisjonen av betinget sannsynlighet:

> [!read] P(B | A) = P(A ∩ B) / P(A)
> Sannsynligheten for \`B\` gitt \`A\` er andelen av \`A\`-utfallene som også er \`B\`-utfall.

Ganger du begge sider med \`P(A)\` får du produktregelen. Den tolkes ofte sekvensielt: «sannsynlighet for første hendelse, ganger sannsynlighet for andre hendelse gitt at første har skjedd».


## Spesialtilfellet: uavhengighet

Hvis \`A\` og \`B\` er uavhengige er \`P(B | A) = P(B)\`, og formelen forenkles:

> [!read] P(A ∩ B) = P(A) · P(B)
> For uavhengige hendelser ganger du bare enkeltsannsynlighetene direkte.

Dette er testen for uavhengighet: hvis \`P(A ∩ B) = P(A) · P(B)\`, er hendelsene uavhengige. Hvis ikke er de avhengige.


## Konkret eksempel

En urne har 5 røde og 3 hvite kuler. Vi trekker to kuler uten tilbakelegging. Hva er sannsynligheten for at begge er røde?

La \`A\` = «første rød» og \`B\` = «andre rød». Hendelsene er avhengige siden urnen endrer seg etter første trekning.

    P(A) = 5/8                 (5 røde av 8)
    P(B | A) = 4/7             (etter at en rød er trukket: 4 røde av 7)
    P(A ∩ B) = (5/8) · (4/7) = 20/56 = 5/14 ≈ 0.357

> [!tip] \`P(B | A)\` er IKKE det samme som \`P(A | B)\`. For å snu retningen trenger du Bayes' setning.
`,
      see_also: [
        {
          kind: "glossary",
          id: "betinget-sannsynlighet-glos",
        },
        {
          kind: "glossary",
          id: "uavhengighet-glos",
        },
        {
          kind: "entry",
          id: "bayes-setning",
        },
      ],
    },
  ],
  "regresjon-estimat-alpha-beta": [
    {
      id: "beta-hat",
      name: "Stigningstallet β̂",
      abbreviation: "SLOPE",
      formula: "β̂ = S_XY / S_XX",
      short: "Hvor mye y endres per enhet x. Minste-kvadraters-estimatet for stigningstallet.",
      long: `\`β̂\` er minste-kvadraters-estimatet for stigningstallet i den lineære modellen \`y = α + β·x + ε\`. Den forteller hvor mye \`y\` i gjennomsnitt endres når \`x\` øker med én enhet.


## Hvor formelen kommer fra

Minste-kvadraters-prinsippet velger den linjen som minimerer summen av kvadrerte residualer \`Σ(y_i − α̂ − β̂·x_i)²\`. Setter du de partiellderiverte til null, faller formelen ut:

> [!read] β̂ = Σ(x_i − x̄)(y_i − ȳ) / Σ(x_i − x̄)²
> Krysssummen for \`(x, y)\` delt på sum av kvadrerte avvik for \`x\` alene.

Telleren \`S_XY\` måler hvordan \`x\` og \`y\` varierer sammen. Nevneren \`S_XX\` måler hvor spredt \`x\`-verdiene er. Forholdet blir et stigningstall i samme enhet som \`y/x\`.


## Beregningsformler når bare råsummer er gitt

Hvis tabellen oppgir \`Σx_i\`, \`Σy_i\`, \`Σx_i²\` og \`Σx_i·y_i\` i stedet for avvikssummene, regn dem ut slik:

- \`S_XX = Σx_i² − n·x̄²\`
- \`S_XY = Σx_i·y_i − n·x̄·ȳ\`

> [!tip] Skriv \`β̂\` med samme antall siffer som du vil bruke senere. Avrunder du for tidlig, drar feilen seg gjennom \`α̂\`, \`S_E²\` og hele inferensen.


## Eksempel

Med \`S_XY = 103.4\` og \`S_XX = 15.6\` får vi \`β̂ = 103.4 / 15.6 ≈ 6.63\`. Tolkning: én ekstra time søvn øker forventet eksamensresultat med ca. 6.63 prosentpoeng.
`,
      see_also: [
        {
          kind: "formula",
          ref: "alpha-hat",
        },
        {
          kind: "entry",
          id: "regresjon-korrelasjonskoeffisient",
        },
        {
          kind: "entry",
          id: "regresjon-standardfeil-stigningstall",
        },
      ],
    },
    {
      id: "alpha-hat",
      name: "Skjæringspunktet α̂",
      abbreviation: "INTERCEPT",
      formula: "α̂ = ȳ − β̂·x̄",
      short: "Verdien av ŷ når x = 0. Plasserer regresjonslinjen vertikalt etter at β̂ er bestemt.",
      long: `\`α̂\` er minste-kvadraters-estimatet for skjæringspunktet (intercept) i \`ŷ = α̂ + β̂·x\`. Geometrisk er det \`y\`-verdien der den estimerte linjen krysser \`y\`-aksen (\`x = 0\`).


## Hvorfor α̂ = ȳ − β̂·x̄

Minste-kvadraters-løsningen tvinger regresjonslinjen til å gå gjennom tyngdepunktet \`(x̄, ȳ)\`. Setter du \`x = x̄\` i \`ŷ = α̂ + β̂·x\` og krever \`ŷ = ȳ\`, faller formelen ut:

> [!read] α̂ = ȳ − β̂·x̄
> Skjæringspunktet er det som gjenstår av ȳ etter at vi har trukket fra det β̂·x̄ allerede forklarer.

Derfor må \`β̂\` regnes ut FØR \`α̂\`. Endrer du \`β̂\` med ett siffer, endres \`α̂\` automatisk via \`x̄\`.


## Når α̂ er meningsfull og når den ikke er det

\`α̂\` er et reelt utsagn om virkeligheten bare hvis \`x = 0\` ligger innenfor (eller nær) det observerte \`x\`-spennet. Ekstrapolerer du langt utenfor data, blir \`α̂\` matematisk veldefinert men fysisk meningsløs.

> [!tip] Hvis \`x = 0\` ligger langt fra dataene, fokusér tolkningen på β̂ alene. α̂ er da bare en justeringskonstant som lar linjen treffe (x̄, ȳ).


## Eksempel

Med \`ȳ = 79.7\`, \`β̂ = 6.63\` og \`x̄ = 6.8\` får vi \`α̂ = 79.7 − 6.63·6.8 ≈ 34.62\`. Den estimerte regresjonslinjen blir \`ŷ = 34.62 + 6.63·x\`.
`,
      see_also: [
        {
          kind: "formula",
          ref: "beta-hat",
        },
        {
          kind: "entry",
          id: "regresjon-residualvarians",
        },
        {
          kind: "entry",
          id: "regresjon-prediksjonsintervall",
        },
      ],
    },
  ],
  "regresjon-korrelasjonskoeffisient": [
    {
      id: "r",
      name: "Pearson-korrelasjon r",
      abbreviation: "CORR",
      formula: "r = S_XY / √(S_XX · S_YY)",
      short: "Mål på styrken og retningen av lineær sammenheng. Ligger alltid mellom −1 og 1.",
      long: `\`r\` er Pearsons utvalgskorrelasjon. Den standardiserer krysssummen \`S_XY\` slik at resultatet alltid ligger i \`[−1, 1]\`, uavhengig av hvilke enheter \`x\` og \`y\` måles i.


## Slik leser du formelen

Telleren \`S_XY\` har samme tegn som retningen i spredningsplottet. Nevneren \`√(S_XX · S_YY)\` er produktet av spredningene i \`x\` og \`y\`, og fungerer som en skalering:

> [!read] r = (samvariasjon mellom x og y) / (spredning i x · spredning i y)
> Krysssummen normalisert slik at maksimal verdi er 1 og minimum er −1.

Fordi \`S_XX\` og \`S_YY\` alltid er ikke-negative, bestemmes fortegnet til \`r\` av \`S_XY\` alene.


## Sammenheng med stigningstallet og r²

Stigningstallet og korrelasjonen er nært beslektet: \`β̂ = r · (s_y / s_x)\`, der \`s_x = √(S_XX/(n−1))\` og \`s_y = √(S_YY/(n−1))\`. Det betyr at \`β̂\` og \`r\` alltid har samme fortegn.

Kvadratet \`r²\` (forklart variasjon) tolkes som andelen av variasjonen i \`y\` som forklares av lineær regresjon på \`x\`:

- \`|r| ≈ 1\`: punktene ligger nesten på en rett linje
- \`|r| ≈ 0\`: ingen lineær sammenheng (men kan ha sterk ikke-lineær struktur)

> [!tip] r måler bare LINEÆR sammenheng. En tydelig U-form (kvadratisk) kan gi r ≈ 0 selv om x og y er sterkt knyttet sammen. Tegn alltid spredningsplottet før du tolker r.


## Eksempel

Med \`S_XX = 15.6\`, \`S_YY = 734.1\` og \`S_XY = 103.4\`:

\`r = 103.4 / √(15.6 · 734.1) = 103.4 / √11451.96 ≈ 103.4 / 107.01 ≈ 0.966\`.

Tolkning: sterk positiv lineær sammenheng. \`r² ≈ 0.933\`, så ca. 93 % av variasjonen i \`y\` forklares av regresjonen på \`x\`.
`,
      see_also: [
        {
          kind: "entry",
          id: "regresjon-estimat-alpha-beta",
        },
        {
          kind: "entry",
          id: "korrelasjon-joint",
        },
        {
          kind: "glossary",
          id: "spredningsplott",
        },
      ],
    },
  ],
  "regresjon-prediksjonsintervall": [
    {
      id: "pi-y",
      name: "Prediksjonsintervall for ny Y",
      abbreviation: "PI",
      formula: "ŷ₀ ± t_(α/2, n−2) · S_E · √(1 + 1/n + (x₀ − x̄)²/S_XX)",
      short: "Intervall for hvor en ENKELT ny y-observasjon vil ligge ved x = x₀. Bredere enn KI for E[Y|x].",
      long: `Prediksjonsintervallet (PI) gir et intervall som med \`(1−α)·100 %\` sannsynlighet inneholder en ENKELT ny observasjon \`Y\` målt ved \`x = x₀\`. Det er forskjellig fra konfidensintervallet for forventningsverdien \`E[Y|x₀]\`.


## De tre bidragene under kvadratroten

Variansen til prediksjonsfeilen \`Y − ŷ₀\` består av tre uavhengige ledd, som speiles direkte i formelen:

> [!read] Var(Y − ŷ₀) = σ²·(1 + 1/n + (x₀ − x̄)²/S_XX)
> Naturlig støy + usikkerhet i ȳ + usikkerhet i β̂ ved avstand fra x̄.

- \`1\`: naturlig spredning rundt regresjonslinjen, er DEN nye observasjonens egen feil.
- \`1/n\`: usikkerhet i hvor selve linjen ligger vertikalt (bidraget fra \`α̂\`).
- \`(x₀ − x̄)²/S_XX\`: usikkerhet i stigningstallet, vektet med hvor langt \`x₀\` er fra tyngdepunktet.

Det er \`1\`-tallet som gjør PI bredere enn KI for \`E[Y|x₀]\`, uten det får du KI, ikke PI.


## Hvorfor PI vifter ut til sidene

Bidraget \`(x₀ − x̄)²/S_XX\` vokser kvadratisk når \`x₀\` fjerner seg fra \`x̄\`. Derfor er prediksjonsintervallet smalest ved \`x̄\` og åpner seg som en trakt mot kantene.

> [!tip] Ekstrapolering utenfor observert x-spenn er dobbelt risikabelt: PI blir matematisk bredt, OG modellen kan slutte å gjelde. Bruk PI bare innenfor det området der dataene støtter linjen.


## Ekvivalente skrivemåter

Når oppgaven gir \`SE(β̂)\` i stedet for \`S_XX\`, er disse identiske fordi \`S_XX = (S_E / SE(β̂))²\`:

- \`S_E · √(1 + 1/n + (x₀ − x̄)²/S_XX)\`
- \`S_E · √(1 + 1/n + ((x₀ − x̄) · SE(β̂) / S_E)²)\`

Velg den formen der du har færrest mellomregninger.


## Eksempel

Med \`α̂ = 34.6\`, \`β̂ = 6.63\`, \`S_E ≈ 2.468\`, \`S_XX ≈ 15.6\`, \`x̄ = 6.8\`, \`n = 10\`, \`x₀ = 5\`, \`1 − α = 0.95\`:

- \`ŷ₀ = 34.6 + 6.63·5 = 67.75\`
- \`SE_pred = 2.468 · √(1 + 0.1 + (−1.8)²/15.6) ≈ 2.468 · √1.308 ≈ 2.822\`
- \`t_(0.025, 8) = 2.306\`
- PI: \`67.75 ± 2.306·2.822 ≈ 67.75 ± 6.51 ≈ [61.24, 74.26]\`

En ny student med \`5\` timers søvn vil med 95 % sannsynlighet score mellom ca. 61.2 % og 74.3 %.
`,
      see_also: [
        {
          kind: "entry",
          id: "regresjon-residualvarians",
        },
        {
          kind: "entry",
          id: "regresjon-standardfeil-stigningstall",
        },
        {
          kind: "table",
          id: "E5-t-tabell",
        },
      ],
    },
  ],
  "regresjon-residualvarians": [
    {
      id: "se-squared",
      name: "Residualvarians S_E²",
      abbreviation: "VAR",
      formula: "S_E² = SSE / (n − 2)",
      short: "Variansen til feilene rundt regresjonslinjen. Forventningsrett estimat med n − 2 frihetsgrader.",
      long: `\`S_E²\` er det forventningsrette estimatet for variansen til residualene \`ε_i = y_i − α̂ − β̂·x_i\` i en enkel lineær regresjon. Kvadratroten \`S_E = √S_E²\` er residualenes standardavvik og kalles ofte regresjonens "standard error of the estimate".


## Hvorfor n − 2 i nevneren?

Variansen til en stokastisk variabel estimeres ved å snitte kvadrerte avvik fra gjennomsnittet. Her er "gjennomsnittet" selve regresjonslinjen, og to parametre (\`α̂\`, \`β̂\`) er estimert fra dataene. Hver estimert parameter koster én frihetsgrad:

> [!read] S_E² = SSE / (n − 2)
> Sum av kvadrerte residualer delt på antall frihetsgrader, der \`ν = n − 2\`.

Med \`n − 2\` blir estimatet forventningsrett: \`E[S_E²] = σ²\`. Bruker du \`n\` eller \`n − 1\`, blir estimatet skjevt.


## Praktisk beregning av SSE

Direkte fra residualene: \`SSE = Σ(y_i − α̂ − β̂·x_i)²\`. Når du har avvikssummene allerede regnet ut, finnes en mye raskere snarvei:

- \`SSE = S_YY − β̂ · S_XY\`
- alternativt \`SSE = S_YY − S_XY² / S_XX\`

De to er ekvivalente fordi \`β̂ = S_XY / S_XX\`.

> [!tip] SSE forveksles ofte med S_XX = Σ(x − x̄)². De er HELT forskjellige: SSE bruker residualer i y-retning, S_XX måler spredning i x.


## Eksempel

Med \`SSE = 48.7437\` og \`n = 10\` blir \`S_E² = 48.7437 / 8 ≈ 6.093\`, så \`S_E ≈ √6.093 ≈ 2.468\`. Tolkning: typisk avvik mellom observert og predikert \`y\` er ca. 2.47 enheter.
`,
      see_also: [
        {
          kind: "entry",
          id: "regresjon-estimat-alpha-beta",
        },
        {
          kind: "entry",
          id: "regresjon-standardfeil-stigningstall",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
      ],
    },
  ],
  "regresjon-standardfeil-stigningstall": [
    {
      id: "se-beta",
      name: "Standardfeil til β̂",
      abbreviation: "SE",
      formula: "SE(β̂) = √(S_E² / S_XX)",
      short: "Hvor mye β̂ varierer fra utvalg til utvalg. Inngår direkte i t-test og KI for β.",
      long: `\`SE(β̂)\` er det estimerte standardavviket til stigningstallet \`β̂\`. Den kvantifiserer hvor mye \`β̂\` ville variert hvis vi gjorde forsøket om igjen med nye \`y\`-verdier ved samme \`x\`-design.


## Hvor formelen kommer fra

Under standard-antakelsene (uavhengige feil, konstant varians \`σ²\`) gjelder eksakt: \`Var(β̂) = σ² / S_XX\`. Vi kjenner ikke \`σ²\`, så vi setter inn estimatet \`S_E²\` og tar kvadratrot:

> [!read] SE(β̂) = √(S_E² / S_XX)
> Residualenes standardavvik delt på kvadratroten av x-spredningen.

Lagt på en kortere form: \`SE(β̂) = S_E / √S_XX\`. De to skrivemåtene gir nøyaktig samme tall.


## Hva styrer størrelsen på SE(β̂)?

To størrelser drar i hver sin retning:

- Liten \`S_E²\` (god tilpasning, lite støy) gir liten \`SE(β̂)\`.
- Stor \`S_XX\` (godt spredte \`x\`-verdier) gir liten \`SE(β̂)\`.

For å redusere usikkerheten i \`β̂\` kan du altså enten samle inn flere/mer presise målinger ELLER spre \`x\`-verdiene mer.

> [!tip] Et eksperiment der alle x-verdiene ligger tett (S_XX liten) gir en upresis stigning selv om residualene er små. "Legg datapunktene langt fra hverandre" er en designregel når β er det interessante.


## Eksempel

Med \`S_E² = 6.093\` og \`S_XX = 15.6\`:

\`SE(β̂) = √(6.093 / 15.6) = √0.3906 ≈ 0.625\`.

Denne verdien brukes direkte i \`T = β̂ / SE(β̂)\` for hypotesetesten, og i KI-bredden \`β̂ ± t_(α/2, n−2) · SE(β̂)\`.
`,
      see_also: [
        {
          kind: "entry",
          id: "regresjon-residualvarians",
        },
        {
          kind: "entry",
          id: "regresjon-test-stigningstall",
        },
        {
          kind: "entry",
          id: "regresjon-prediksjonsintervall",
        },
      ],
    },
  ],
  "regresjon-test-stigningstall": [
    {
      id: "t-slope",
      name: "Testobservator T = β̂ / SE(β̂)",
      abbreviation: "T",
      formula: "T = (β̂ − β₀) / SE(β̂)",
      short: "T-fordelt under H₀ med n − 2 frihetsgrader. Sammenlignes med t_(α/2, n−2) i tabell E.5.",
      long: `\`T\` er testobservatoren for hypotesen \`H₀: β = β₀\` i en enkel lineær regresjon. Når \`β₀ = 0\` (det vanligste) tester den om det finnes en lineær sammenheng mellom \`x\` og \`y\` overhodet.


## Tolkning av telleren og nevneren

Telleren \`β̂ − β₀\` måler hvor langt det observerte stigningstallet ligger fra null-hypotesen, i samme enhet som \`y/x\`. Nevneren \`SE(β̂)\` er typisk "støy-skalaen" til \`β̂\`. Forholdet er enhetsløst og forteller "hvor mange standardfeil unna H₀ ligger β̂":

> [!read] T = (β̂ − β₀) / SE(β̂)
> Antall standardfeil mellom det estimerte og det hypotetiske stigningstallet.

Under \`H₀\` (og normalitet på feilene) er \`T\` t-fordelt med \`ν = n − 2\` frihetsgrader.


## Beslutningsregelen

For en tosidig test på nivå \`α\`:

- slå opp \`t_(α/2, n−2)\` i tabell E.5
- forkast \`H₀\` hvis \`|T| > t_(α/2, n−2)\`
- ellers: ikke statistisk grunnlag for å hevde lineær sammenheng

Ensidige tester (\`H₁: β > 0\` eller \`β < 0\`) bruker \`t_(α, n−2)\` og ser bare på den ene halen.

> [!tip] T-observatoren henger direkte sammen med korrelasjonen: T² = (n − 2)·r²/(1 − r²). Stor |T| ⇔ stor |r|. Forkaster du H₀ for β = 0, forkaster du samtidig at populasjonskorrelasjonen er null.


## Eksempel

Med \`β̂ = 6.63\`, \`SE(β̂) = 0.625\`, \`n = 10\` og \`α = 0.05\` (tosidig):

\`T = 6.63 / 0.625 = 10.61\`. Kritisk verdi: \`t_(0.025, 8) = 2.306\`.

\`|10.61| > 2.306\`, så vi forkaster \`H₀: β = 0\`. Det er klar statistisk støtte for en lineær sammenheng.
`,
      see_also: [
        {
          kind: "entry",
          id: "regresjon-standardfeil-stigningstall",
        },
        {
          kind: "entry",
          id: "regresjon-korrelasjonskoeffisient",
        },
        {
          kind: "table",
          id: "E5-t-tabell",
        },
      ],
    },
  ],
  "sum-uavhengige-normaler": [
    {
      id: "sum-formel",
      name: "Fordelingen til summen",
      abbreviation: "SUM",
      formula: "Y = X_1 + ... + X_n ~ N(n·μ, σ·√n)",
      short: `Summen av \`n\` uavhengige \`N(μ, σ)\`-variabler er igjen normalfordelt, med forventning \`n·μ\` og standardavvik \`σ·√n\`.`,
      long: `Når du legger sammen \`n\` uavhengige normalfordelte variabler med samme forventning \`μ\` og standardavvik \`σ\`, får du igjen en normalfordeling. Forventningsverdien skaleres med \`n\`, men standardavviket vokser bare med \`√n\` (variansen vokser med \`n\`).

> [!read] Y = X_1 + ... + X_n  ⇒  Y ~ N(n·μ, σ·√n)
> Summen er normalfordelt med forventning \`n·μ\` og standardavvik \`σ·√n\`. Når du har funnet de to parametrene, behandler du \`Y\` som en helt vanlig normalfordeling.


## Hvorfor \`√n\` og ikke \`n\` for standardavviket?

Fordi VARIANSEN er det additive: \`Var(Y) = n·σ²\`. Standardavvik er roten av varians, så \`σ_Y = √(n·σ²) = σ·√n\`. Det betyr at summen «strekker seg» saktere enn den flytter seg:

- Forventning vokser lineært (\`n · μ\`).
- Spredningen vokser bare med \`√n\`.

Derfor blir summen relativt sett mer konsentrert rundt sin forventning når \`n\` øker. (For GJENNOMSNITTET \`X̄\` blir spredningen mindre: \`σ/√n\`. Ikke bland sammen.)

> [!tip] Hugs \`σ_Y = σ·√n\` som refleks. Den vanligste feilen er å skrive \`σ·n\` (for stor) eller \`σ/√n\` (det er for gjennomsnittet, ikke summen).


## Konkret eksempel

En kaffemaskin slipper ut \`X ~ N(25, 0.48)\` cl pr. trykk. Etter 5 uavhengige trykk, hva er sannsynligheten for at totalmengden \`Y = X_1 + ... + X_5\` overstiger 127 cl?

1. Forventning: \`μ_Y = 5 · 25 = 125\`
2. Varians: \`Var(Y) = 5 · 0.48² = 1.152\`
3. Standardavvik: \`σ_Y = 0.48 · √5 ≈ 1.0733\`
4. Konkluder: \`Y ~ N(125, 1.0733)\`
5. Standardiser: \`z = (127 − 125)/1.0733 ≈ 1.86\`
6. Slå opp i E.3: \`G(1.86) ≈ 0.9686\`, så \`P(Y > 127) = 1 − 0.9686 ≈ 0.0314\`.

Svar: ca. 3 % sjanse for at fem trykk gir mer enn 127 cl totalt.


## Generalisering

For uavhengige (men ikke nødvendigvis identisk fordelte) normaler \`X_i ~ N(μ_i, σ_i)\` gjelder:

- \`E(ΣX_i) = Σμ_i\`
- \`Var(ΣX_i) = Σσ_i²\` (variansene legges sammen)

Det betyr også at en differanse \`D = X − Y\` mellom uavhengige normaler har \`Var(D) = σ_X² + σ_Y²\` (ja, PLUSS, også for differanse).

> [!read] Var(X − Y) = σ_X² + σ_Y²
> Variansene legges alltid sammen for uavhengige variabler, både ved sum og differanse.
`,
      see_also: [
        {
          kind: "entry",
          id: "normalfordeling",
        },
        {
          kind: "glossary",
          id: "sentralgrenseteoremet-glos",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
      ],
    },
  ],
  "to-utvalgs-t-test": [
    {
      id: "pooled-varians",
      name: "Pooled (interpolert) varians",
      abbreviation: "S_P²",
      formula: "S_P² = ((n_X − 1)·S_X² + (n_Y − 1)·S_Y²) / (n_X + n_Y − 2)",
      short: `Vektet snitt av de to utvalgsvariansene, brukt som felles estimat for \`σ²\` når gruppene antas å ha samme spredning.`,
      long: `\`S_P²\` er en interpolert (pooled) estimator for den felles populasjonsvariansen \`σ²\` når vi antar at de to gruppene har samme spredning. Den kombinerer informasjon fra begge utvalg, vektet etter frihetsgrader.


## Hvordan lese formelen

> [!read] S_P² = ((n_X − 1)·S_X² + (n_Y − 1)·S_Y²) / (n_X + n_Y − 2)
> «Vektet gjennomsnitt av de to utvalgsvariansene, der hver gruppe vektes med sine frihetsgrader.»

Telleren er summen av kvadratavvik (SSE) fra begge gruppene. Nevneren \`n_X + n_Y − 2\` er totalt antall frihetsgrader, fordi vi estimerer to gjennomsnitt (\`X̄\` og \`Ȳ\`) og «mister» én frihetsgrad per gruppe.


## Hvorfor pooling?

Hvis vi tror begge gruppene egentlig har samme \`σ²\`, gir det mer presist estimat å kombinere dem enn å bruke \`S_X²\` og \`S_Y²\` hver for seg. Stor gruppe får større vekt: en gruppe med \`n_X = 20\` teller 19/(19 + n_Y − 1) i blandingen.

> [!tip] Hvis variansene er klart forskjellige (f.eks. \`S_X²\` er flere ganger større enn \`S_Y²\`), bryter antakelsen sammen og du bør vurdere Welch t-test i stedet, som ikke pooler.


## Konkret eksempel

Gruppe X: \`n_X = 10\`, \`s_X² = 205.34\`. Gruppe Y: \`n_Y = 9\`, \`s_Y² = 385.78\`.

    S_P² = (9·205.34 + 8·385.78) / (10 + 9 − 2)
         = (1848.06 + 3086.24) / 17
         = 4934.30 / 17
         ≈ 290.25
    S_P  = √290.25 ≈ 17.04

Gruppe Y har høyere varians og veier nesten like mye som X, så \`S_P²\` lander mellom de to verdiene, nærmere midten.
`,
      see_also: [
        {
          kind: "glossary",
          id: "pooled-varians",
        },
        {
          kind: "glossary",
          id: "utvalgsvarians",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
      ],
    },
    {
      id: "t-observator",
      name: "T-observator (to-utvalgs, pooled)",
      abbreviation: "T",
      formula: "T = (X̄ − Ȳ) / (S_P · √(1/n_X + 1/n_Y))",
      short: `Standardiserer differansen \`X̄ − Ȳ\` mot dens estimerte standardfeil. T-fordelt med \`ν = n_X + n_Y − 2\` frihetsgrader.`,
      long: `\`T\` er testobservatoren i pooled to-utvalgs t-test. Den måler hvor mange standardfeil forskjellen mellom de to gruppegjennomsnittene utgjør, der standardfeilen er regnet ut fra felles pooled varians \`S_P²\`.


## Hvordan lese formelen

> [!read] T = (X̄ − Ȳ) / (S_P · √(1/n_X + 1/n_Y))
> «Forskjellen mellom gruppegjennomsnittene, delt på hvor mye en slik forskjell typisk svinger ved tilfeldig utvalg.»

Telleren \`X̄ − Ȳ\` er den observerte forskjellen. Nevneren er standardfeilen til denne differansen: variansen til \`X̄ − Ȳ\` er \`σ²·(1/n_X + 1/n_Y)\`, og vi setter inn estimert \`S_P²\` for \`σ²\` og tar kvadratrot.


## Frihetsgrader og fortegn

Under \`H₀: μ_X = μ_Y\` er \`T\` t-fordelt med \`ν = n_X + n_Y − 2\`. Vi mister to frihetsgrader fordi vi har estimert to gjennomsnitt.

> [!tip] Fortegnet på \`T\` avhenger av rekkefølgen \`X − Y\` mot \`Y − X\`. Hvis \`H₁\` sier «Y er bedre enn X» (\`μ_X < μ_Y\`), forventes \`T = (X̄ − Ȳ)\` å være negativ, og forkastningsregelen blir \`t < −t_α\` (venstresidig).


## Konkret eksempel

Gammel metode X: \`n_X = 10\`, \`x̄ = 71.30\`. Ny metode Y: \`n_Y = 9\`, \`ȳ = 74.44\`. Med \`S_P² ≈ 290.25\` (fra forrige kort), \`S_P ≈ 17.04\`.

    SE = S_P · √(1/10 + 1/9)
       = 17.04 · √0.2111
       = 17.04 · 0.4595
       ≈ 7.83
    T  = (71.30 − 74.44) / 7.83
       ≈ −0.40

Med \`ν = 17\` og \`α = 0.01\` venstresidig er kritisk verdi \`−t_(0.01, 17) = −2.567\`. Siden \`−0.40\` ikke er mindre enn \`−2.567\`, beholder vi \`H₀\`: ingen statistisk grunn til å hevde at den nye metoden er bedre.
`,
      see_also: [
        {
          kind: "glossary",
          id: "t-fordeling",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
        {
          kind: "glossary",
          id: "standardfeil",
        },
        {
          kind: "table",
          id: "E5-t-tabell",
        },
      ],
    },
  ],
  "total-sannsynlighet": [
    {
      id: "total",
      name: "Setningen om total sannsynlighet",
      abbreviation: "TOTAL",
      formula: "P(B) = Σ P(Aᵢ) · P(B | Aᵢ)",
      short: "Bryter P(B) opp i bidrag fra hver disjunkte gruppe i en partisjon.",
      long: `Setningen om total sannsynlighet bryter sannsynligheten for \`B\` opp i bidrag fra hver gruppe i en partisjon. Hver gruppe \`Aᵢ\` bidrar med sin egen marginalsannsynlighet ganger den betingede sannsynligheten for \`B\` gitt at man er i den gruppen.


## Partisjonen er nøkkelen

En partisjon er en samling hendelser \`A₁, A₂, ..., Aₙ\` som er disjunkte (kan ikke skje samtidig) og dekker hele utfallsrommet (én av dem MÅ skje). Det enkleste tilfellet er \`A\` og \`Aᶜ\`.

> [!read] P(B) = P(A)·P(B|A) + P(Aᶜ)·P(B|Aᶜ)
> Sannsynligheten for \`B\` totalt er bidraget fra \`A\`-gruppen pluss bidraget fra \`Aᶜ\`-gruppen.

Mer generelt med \`n\` grupper:

> [!read] P(B) = Σᵢ P(Aᵢ) · P(B | Aᵢ)
> Vekt hver betingede sannsynlighet \`P(B | Aᵢ)\` med hvor stor gruppen \`Aᵢ\` er, og summer.


## Konkret eksempel: tre maskiner

Maskin \`A\` lager 50 prosent av delene med 1 prosent defekt, \`B\` lager 30 prosent med 2 prosent defekt, og \`C\` lager 20 prosent med 5 prosent defekt. Hva er den totale sannsynligheten for at en tilfeldig del er defekt?

    P(D) = P(A)·P(D|A) + P(B)·P(D|B) + P(C)·P(D|C)
         = 0.50 · 0.01 + 0.30 · 0.02 + 0.20 · 0.05
         = 0.005 + 0.006 + 0.010
         = 0.021

Altså 2.1 prosent totalt. Sjekk at marginalsannsynlighetene summerer til 1: \`0.50 + 0.30 + 0.20 = 1.00\`, så partisjonen er gyldig.

> [!tip] Setningen om total sannsynlighet er nesten alltid steg 1 i en Bayes-utregning, fordi nevneren \`P(B)\` typisk ikke er gitt direkte.
`,
      see_also: [
        {
          kind: "entry",
          id: "produktregel",
        },
        {
          kind: "entry",
          id: "bayes-setning",
        },
        {
          kind: "glossary",
          id: "partisjon",
        },
      ],
    },
  ],
  "unionssetningen": [
    {
      id: "union",
      name: "Unionssetningen",
      abbreviation: "UNION",
      formula: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)",
      short: "Sannsynligheten for at minst én av to hendelser inntreffer. Trekk fra overlappet.",
      long: `\`P(A ∪ B)\` er sannsynligheten for at hendelse \`A\` eller \`B\` (eller begge) inntreffer. Formelen legger sammen de to enkeltsannsynlighetene og trekker fra overlappet for å unngå dobbelttelling.


## Hvorfor trekke fra \`P(A ∩ B)\`?

Når du legger sammen \`P(A) + P(B)\`, blir alt som ligger i begge hendelsene talt to ganger: én gang i \`P(A)\` og én gang i \`P(B)\`. Korreksjonen er å trekke fra overlappet én gang.

> [!read] P(A ∪ B) = P(A) + P(B) − P(A ∩ B)
> Sannsynligheten for «minst én av \`A\` eller \`B\`» er sum av enkeltsannsynlighetene, minus snittet.

For disjunkte hendelser (de kan ikke skje samtidig) er \`P(A ∩ B) = 0\`, og formelen forenkles til \`P(A ∪ B) = P(A) + P(B)\`.


## Konkret eksempel

60 prosent av studentene tar matte (\`M\`), 40 prosent tar fysikk (\`F\`), og 25 prosent tar begge. Hva er sannsynligheten for at en tilfeldig student tar minst ett av kursene?

    P(M ∪ F) = P(M) + P(F) − P(M ∩ F)
             = 0.60 + 0.40 − 0.25
             = 0.75

Uten å trekke fra de 25 prosentene som tar begge, ville svaret blitt 1.00, altså «alle tar minst ett», som åpenbart er feil.

> [!tip] Tegn et venndiagram med to overlappende sirkler når du er i tvil. Da ser du umiddelbart hvilke områder som telles dobbelt.


## Utvidelse til tre hendelser

For tre hendelser må du både legge til og trekke fra etter et inkludering-ekskludering-mønster:

> [!read] P(A ∪ B ∪ C) = ΣP(enkelt) − ΣP(par) + P(A ∩ B ∩ C)
> Legg til alle enkeltsannsynligheter, trekk fra alle parsnitt, legg så til trippelsnittet.
`,
      see_also: [
        {
          kind: "entry",
          id: "komplementregelen",
        },
        {
          kind: "glossary",
          id: "disjunkte-hendelser-glos",
        },
        {
          kind: "glossary",
          id: "de-morgans-lov",
        },
      ],
    },
  ],
  "uordnet-utvalg-uten-tilbakelegging": [
    {
      id: "binomialkoeffisient",
      name: "Uordnet utvalg uten tilbakelegging",
      abbreviation: "C(n,k)",
      formula: "C(n, k) = n! / (k! · (n − k)!)",
      short: `Antall måter å plukke \`k\` elementer fra \`n\` når rekkefølgen ikke teller. Også kjent som binomialkoeffisienten «n velg k».`,
      long: `Binomialkoeffisienten \`C(n, k)\` (skrives også \`ⁿCₖ\` eller «n velg k») teller hvor mange ulike utvalg av \`k\` elementer du kan trekke fra en mengde på \`n\` ulike elementer, når rekkefølgen ikke spiller noen rolle og samme element kan brukes høyst én gang.


## Hvordan lese formelen

> [!read] C(n, k) = n! / (k! · (n − k)!)
> Det er antall ordnede utvalg \`n! / (n − k)!\`, delt på \`k!\` for å fjerne dobbelttellingen som rekkefølgen gir. Alle \`k!\` rekkefølger av samme \`k\`-mengde regnes som ett utvalg.

Når er \`C(n, k)\` riktig telleregel:

- Du velger \`k\` av \`n\` ulike elementer
- Rekkefølgen i utvalget er likegyldig (samme hånd uansett rekkefølge)
- Uten tilbakelegging (samme element ikke to ganger)

Symmetri som forenkler regning: \`C(n, k) = C(n, n − k)\`. For eksempel er \`C(52, 50) = C(52, 2) = 1 326\`, mye enklere enn å regne ut det første direkte.


## Sannsynlighet med gunstige på mulige

For uniformt valgte uordnede utvalg er sannsynligheten ren telling:

> [!read] P(A) = C(K, k) / C(N, k)
> Antall gunstige utvalg av \`k\` fra de \`K\` i kategorien, delt på antall mulige utvalg av \`k\` fra hele populasjonen \`N\`.

> [!tip] Når du trekker uten tilbakelegging fra en endelig populasjon, er dette ikke det samme som binomial. \`(1 − p)^k\` undervurderer eller overvurderer svaret fordi \`p\` endrer seg etter hvert trekk. Bruk \`C(...)\` eller hypergeometrisk fordeling.


## Eksempel: 5 kort fra en kortstokk

Antall mulige femkortshender: \`n = 52\`, \`k = 5\`.

    C(52, 5) = (52 · 51 · 50 · 49 · 48) / 5! = 2 598 960

Sannsynligheten for å trekke 5 hjerter (det finnes \`K = 13\` hjerter):

    Gunstige: C(13, 5) = 1 287
    P(5 hjerter) = 1 287 / 2 598 960 ≈ 4.95 · 10⁻⁴

Norsk Lotto er samme idé i ren tellingsversjon: 7 av 34 tall, rekkefølgen teller ikke.

    C(34, 7) = 5 379 616 mulige kuponger
`,
      see_also: [
        {
          kind: "entry",
          id: "ordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "entry",
          id: "hypergeometrisk-fordeling",
        },
        {
          kind: "glossary",
          id: "uordnet-utvalg",
        },
      ],
    },
  ],
  "utvalgsvarians-radata": [
    {
      id: "s-squared",
      name: "Utvalgsvarians fra rådata",
      abbreviation: "s²",
      formula: "s² = Σ(x_i − x̄)² / (n − 1);  s = √s²",
      short: `Estimat for populasjonsvariansen \`σ²\` fra en liste observasjoner. Del på \`n − 1\`, ikke \`n\`.`,
      long: `\`s²\` er utvalgsvariansen, et estimat for populasjonsvariansen \`σ²\` basert på \`n\` observasjoner \`x_1, x_2, …, x_n\`. Bruk denne når du har rådata, ikke en kjent sannsynlighetsfordeling.


## Hvorfor \`n − 1\` og ikke \`n\`?

Dette kalles Bessels korreksjon. Vi har «brukt opp» én frihetsgrad ved å estimere gjennomsnittet \`x̄\` fra de samme dataene. Avvikene \`(x_i − x̄)\` summerer alltid til null, så de er ikke fritt variable: når du kjenner \`n − 1\` av dem, er det siste låst.

> [!read] s² = Σ(x_i − x̄)² / (n − 1)
> Summen av kvadrerte avvik fra utvalgsgjennomsnittet, delt på antall frihetsgrader.

Hvis du delte på \`n\` ville du systematisk underestimere \`σ²\` (skjev estimator). \`n − 1\` korrigerer dette og gjør \`s²\` forventningsrett.


## Konkret eksempel

6 såpebeholdere måles: 297, 300, 293, 296, 304, 302 ml.

Gjennomsnittet:

    x̄ = (297 + 300 + 293 + 296 + 304 + 302) / 6 = 1792/6 ≈ 298.67

Kvadrerte avvik:

    (-1.67)² ≈ 2.79
    ( 1.33)² ≈ 1.77
    (-5.67)² ≈ 32.15
    (-2.67)² ≈ 7.13
    ( 5.33)² ≈ 28.41
    ( 3.33)² ≈ 11.09
    sum     ≈ 83.34

Del på \`n − 1 = 5\`:

    s² = 83.34 / 5 ≈ 16.67
    s  = √16.67 ≈ 4.08 ml


## Forskjell fra diskret-SV-varians

Når du har en PMF, veier du med \`P(X = x)\` og deler IKKE på noe. Når du har rådata, deler du på \`n − 1\` og veier hvert ledd likt.

> [!tip] Sjekk alltid at avvikene \`(x_i − x̄)\` summerer til 0 før du kvadrerer. Hvis ikke har du regnet ut \`x̄\` feil. Og pass på enheter: \`s\` har samme enhet som dataene, \`s²\` har enheten kvadrert.
`,
      see_also: [
        {
          kind: "glossary",
          id: "utvalgsvarians",
        },
        {
          kind: "glossary",
          id: "frihetsgrader-glos",
        },
        {
          kind: "entry",
          id: "varians-standardavvik-diskret",
        },
      ],
    },
  ],
  "varians-standardavvik-diskret": [
    {
      id: "varians",
      name: "Varians og standardavvik for diskret stokastisk variabel",
      abbreviation: "Var(X)",
      formula: "Var(X) = Σ (x_i − μ)² · P(X = x_i);  σ = √Var(X)",
      short: `Vektet sum av kvadrerte avvik fra \`μ\`. Standardavviket \`σ\` er kvadratroten.`,
      long: `\`Var(X)\` måler hvor langt fra forventningsverdien \`μ = E[X]\` verdiene typisk ligger. Du beregner avviket \`(x_i − μ)\`, kvadrerer det, og veier med sannsynligheten.


## Hvorfor kvadrerte avvik?

Hvis vi summerte avvikene direkte (\`Σ (x_i − μ)·P(X = x_i)\`), ville positive og negative avvik kansellere hverandre og summen ville alltid bli null. Kvadreringen gjør alle bidrag positive:

> [!read] Var(X) = Σ (x_i − μ)² · P(X = x_i)
> Variansen er forventet kvadratavvik fra forventningsverdien.

Standardavviket bringer enheten tilbake:

> [!read] σ = √Var(X)
> Standardavviket er kvadratroten av variansen og har samme enhet som \`X\`.


## Konkret eksempel

La \`X\` ta verdier \`{-2, -1, 0, 1, 2}\` med \`{0.3, 0.2, 0.2, 0.1, 0.2}\` og \`μ = -0.3\`:

    Var(X) = (-1.7)²·0.3 + (-0.7)²·0.2 + (0.3)²·0.2 + (1.3)²·0.1 + (2.3)²·0.2
           = 2.89·0.3 + 0.49·0.2 + 0.09·0.2 + 1.69·0.1 + 5.29·0.2
           = 0.867 + 0.098 + 0.018 + 0.169 + 1.058
           = 2.21
    σ = √2.21 ≈ 1.487


## Snarvei via \`E[X²]\`

Den ekvivalente formelen sparer ofte regning når sannsynlighetene er like:

> [!read] Var(X) = E[X²] − μ²
> Forventet kvadrat minus kvadrert forventning.

> [!tip] For en lineær transformasjon: \`Var(aX + b) = a²·Var(X)\`. Konstantleddet \`b\` flytter fordelingen, men endrer ikke spredningen. Skalaen \`a\` blir kvadrert fordi avvikene blir kvadrert.
`,
      see_also: [
        {
          kind: "glossary",
          id: "diskret-varians",
        },
        {
          kind: "entry",
          id: "forventningsverdi-diskret",
        },
        {
          kind: "entry",
          id: "utvalgsvarians-radata",
        },
      ],
    },
  ],
};
