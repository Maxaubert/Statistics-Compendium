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
    {
      id: "survival",
      name: "Overlevelse: ingen hendelse innen t",
      abbreviation: "P(T > t)",
      formula: "P(T > t) = e^(-λt)",
      short: `«Ventetiden er lengre enn \`t\`». Den vanligste varianten i pensum.`,
      long: `\`P(T > t)\` er overlevelsesfunksjonen til eksponentialfordelingen. Den gir sannsynligheten for at ingen hendelse har inntruffet innen tid \`t\`, eller ekvivalent at ventetiden til neste hendelse er lengre enn \`t\`.

> [!read] P(T > t) = e^(-λt)
> Den klassiske «overlevelses»-formelen. Bro til poisson: dette er identisk med \`P(X = 0)\` i et vindu av lengde \`t\`.


## Når dukker den opp?

Formuleringer som peker mot \`P(T > t)\`:

- «varer i mer enn \`t\`», «overlever \`t\`»
- «ingen kunde i løpet av de neste \`t\` minutter»
- «går klar», «ikke feiler innen \`t\`»

> [!tip] Memoryless-egenskapen sier at hvis vi allerede har ventet \`s\` tidsenheter uten hendelse, er sannsynligheten for å vente \`t\` til fortsatt \`e^(-λt)\`. Fortiden «glemmes», bare den nye \`t\` betyr noe.


## Konkret eksempel

Kunder kommer til en butikk med rate \`λ = 0.1\` pr. minutt. Finn sannsynligheten for at det ikke kommer noen kunde i løpet av de neste 30 minuttene.

1. Identifisering: \`T ~ Eksponential(λ = 0.1)\`, spørres om \`P(T > 30)\`.
2. Sett inn:

        P(T > 30) = e^(-0.1 · 30)
                  = e^(-3)
                  ≈ 0.0498

Svar: ca. 5 % sjanse for ingen kunder på en halvtime.


## Sjekkliste på enhet

Den vanligste feilen er å miksbruk av tidsenheter mellom \`λ\` og \`t\`:

- Rate \`λ = 6\` pr. time, vindu \`t = 30\` min: konvertér til \`λ = 0.1\` pr. min, eller behold rate og bruk \`t = 0.5\` time.
- Resultatet skal være det samme uavhengig av enhet, så lenge du er konsekvent.

> [!note] \`P(T > t) = e^(-λt)\` er IKKE \`1 − e^(-λt)\`. Sistnevnte er hendelse INNEN \`t\`. Forveksling her er den vanligste utregningsfeilen i eksponentialoppgaver.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf",
        },
        {
          kind: "entry",
          id: "poisson-fordeling",
        },
        {
          kind: "glossary",
          id: "poisson-prosess",
        },
      ],
    },
    {
      id: "event-by-t",
      name: "Hendelse innen t",
      abbreviation: "P(T < t)",
      formula: "P(T < t) = F(t) = 1 − e^(-λt)",
      short: `«Hendelsen skjer før \`t\`». Direkte fra kumulativ fordelingsfunksjon.`,
      long: `\`P(T < t)\` er den kumulative fordelingsfunksjonen og gir sannsynligheten for at minst én hendelse har inntruffet innen tid \`t\`. Det er den enkleste varianten å regne ut: bare sett inn i \`F(t) = 1 − e^(-λt)\`.

> [!read] P(T < t) = F(t) = 1 − e^(-λt)
> Komplementet til overlevelsen. Bro til poisson: identisk med \`P(X ≥ 1)\` i et vindu av lengde \`t\`.


## Når dukker den opp?

Formuleringer som peker mot \`P(T < t)\`:

- «hendelsen skjer innen \`t\`», «første hendelse før \`t\`»
- «sannsynligheten for at det kommer minst én»
- «ventetiden er kortere enn \`t\`»

> [!tip] Siden \`T\` er kontinuerlig spiller \`<\` og \`≤\` ingen rolle: \`P(T < t) = P(T ≤ t)\`. Du kan bytte fritt mellom dem.


## Konkret eksempel

Anrop kommer til et anropssenter med rate \`λ = 0.1\` pr. minutt. Finn sannsynligheten for at det første anropet kommer innen 5 minutter.

1. Identifisering: \`T ~ Eksponential(λ = 0.1)\`, spørres om \`P(T < 5)\`.
2. Sett inn:

        P(T < 5) = 1 − e^(-0.1 · 5)
                 = 1 − e^(-0.5)
                 ≈ 1 − 0.6065
                 ≈ 0.3935

Svar: ca. 39 % sjanse for første anrop innen 5 minutter.


## To veier til samme svar

Du kan alltid regne \`P(T < t)\` enten direkte fra \`F\`, eller via komplementet til overlevelsen:

        Direkte:    P(T < t) = 1 − e^(-λt)
        Komplement: P(T < t) = 1 − P(T > t)

Velg den som passer regningen din. Hvis du allerede har regnet \`P(T > t)\` i en tidligere deloppgave, er komplementet snarvei.

> [!note] Pass på enheten: \`λ = 0.5\` pr. år og \`t = 1\` år gir \`P(T < 1) = 1 − e^(-0.5) ≈ 0.393\`. Hadde du brukt \`t = 12\` (måneder) uten å konvertere, ville svaret blitt feil.
`,
      see_also: [
        {
          kind: "formula",
          ref: "survival",
        },
        {
          kind: "entry",
          id: "komplementregelen",
        },
        {
          kind: "entry",
          id: "poisson-fordeling",
        },
      ],
    },
    {
      id: "interval-ab",
      name: "Ventetid i intervall",
      abbreviation: "P(a < T < b)",
      formula: "P(a < T < b) = e^(-λa) − e^(-λb)",
      short: `Sannsynligheten for at ventetiden faller i intervallet \`(a, b)\`.`,
      long: `Når oppgaven ber om sannsynligheten for at ventetiden faller mellom to grenser \`a\` og \`b\`, regner du differansen mellom to overlevelser (eller ekvivalent to kumulative). For eksponential blir formelen særlig kompakt: \`e^(-λa) − e^(-λb)\`.

> [!read] P(a < T < b) = F(b) − F(a) = e^(-λa) − e^(-λb)
> Differansen mellom kumulativene. Den minustegn-snur-rekkefølgen kommer av at \`F\` vokser, mens \`e^(-λt)\` synker.


## Hvorfor \`e^(-λa) − e^(-λb)\`?

Skriver du ut hver del eksplisitt:

        F(b) − F(a) = (1 − e^(-λb)) − (1 − e^(-λa))
                    = e^(-λa) − e^(-λb)

Ettallene kanselerer, så det enkleste er å regne på «overlevelsene» \`e^(-λa)\` og \`e^(-λb)\` direkte.

> [!tip] Sjekk at \`b > a\`. Resultatet skal alltid være positivt, og mindre enn både \`P(T > a)\` og \`P(T < b)\` hver for seg.


## Konkret eksempel

Busser ankommer holdeplassen som en poissonprosess med rate 6 pr. time. Finn sannsynligheten for at neste buss kommer mellom 10 og 30 minutter fra nå.

1. Konvertér enhet: \`λ = 6/60 = 0.1\` pr. minutt.
2. Identifisering: \`T ~ Eksponential(λ = 0.1)\`, søker \`P(10 < T < 30)\`.
3. Sett inn:

        P(10 < T < 30) = e^(-0.1 · 10) − e^(-0.1 · 30)
                       = e^(-1) − e^(-3)
                       ≈ 0.3679 − 0.0498
                       ≈ 0.318

Svar: ca. 32 % sjanse for at neste buss kommer i intervallet (10, 30) minutter.


## Vanlige feil

- Bytter om grensene: får negativt svar. Sjekk at \`b > a\` og at minustegnet står foran \`e^(-λb)\`.
- Glemmer å konvertere enhet: rate pr. time mot grenser i minutter er klassisk.
- Skriver \`1 − e^(-λa) − e^(-λb)\` i stedet for differansen. Gå tilbake til \`F(b) − F(a)\` om du er i tvil.

> [!note] Siden \`T\` er kontinuerlig spiller \`<\` og \`≤\` ingen rolle ved grensene. Skriv det enkleste uttrykket.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf",
        },
        {
          kind: "formula",
          ref: "survival",
        },
        {
          kind: "glossary",
          id: "kumulativ",
        },
      ],
    },
    {
      id: "memoryless",
      name: "Memoryless-egenskap",
      abbreviation: "MEM",
      formula: "P(T > s + t | T > s) = P(T > t) = e^(-λt)",
      short: `Fortiden glemmes: gitt at det IKKE har skjedd noe i \`s\` enheter, starter ventetiden på nytt.`,
      long: `Memoryless-egenskapen er det som skiller eksponentialfordelingen fra de fleste andre fordelingene. Den sier at sannsynligheten for å vente \`t\` til, GITT at det ikke har skjedd noe ennå, ikke avhenger av hvor lenge du allerede har ventet. Bare den nye \`t\` teller.

> [!read] P(T > s + t | T > s) = P(T > t) = e^(-λt)
> Den «historiske» tiden \`s\` kanselerer ut. Ventetidsfordelingen «starter på nytt» hvert øyeblikk uten hendelse.


## Hvorfor stemmer det?

Fra definisjonen av betinget sannsynlighet:

        P(T > s + t | T > s) = P(T > s + t) / P(T > s)
                              = e^(-λ(s + t)) / e^(-λs)
                              = e^(-λt)

\`s\` kanselerer fordi eksponentialfunksjonen splitter multiplikativt. Det er nettopp denne strukturen som gir memoryless-egenskapen.

> [!tip] Geometrisk fordeling (diskret venting) har samme egenskap. Andre kontinuerlige fordelinger (f.eks. Weibull, gamma) har det generelt IKKE. Hvis oppgaven bruker memoryless-resonnement uten begrunnelse, må fordelingen være eksponential.


## Konkret eksempel

Kunder kommer til en kasse med rate \`λ = 0.1\` pr. minutt. Det har ikke kommet noen kunde de siste 5 minuttene. Finn sannsynligheten for at vi må vente i mer enn 10 minutter til.

1. Identifisering: \`λ = 0.1\`, \`s = 5\` (fortid), \`t = 10\` (ny ventetid).
2. Memoryless: \`s = 5\` brukes IKKE i utregningen.
3. Bruk overlevelsesformelen på \`t\` alene:

        P(T > 10 | T > 5) = P(T > 10)
                          = e^(-0.1 · 10)
                          = e^(-1)
                          ≈ 0.368

Svar: ca. 37 % sjanse for å vente mer enn 10 minutter til.


## Praktisk tolkning

Memoryless betyr at fenomenet ikke «slites» eller «modnes» med tid. For tekniske komponenter er dette en idealisering; en lyspære som har brent i 1000 timer er i virkeligheten mer slitt enn en ny. Likevel brukes eksponential ofte fordi formelen er enkel og approksimasjonen god nok over korte tidsintervaller.

> [!note] Hvis oppgaven sier «\`s\` minutter har gått uten hendelse, hva er sannsynligheten for å vente \`t\` til», skal du IKKE summere \`s\` og \`t\` i overlevelsesformelen. Bare \`t\` brukes.
`,
      see_also: [
        {
          kind: "formula",
          ref: "survival",
        },
        {
          kind: "glossary",
          id: "poisson-prosess",
        },
        {
          kind: "glossary",
          id: "eksponentialvarians",
        },
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
    {
      id: "bayes-standard-2-veis",
      name: "Standard 2-veis Bayes",
      abbreviation: "2-VEIS",
      formula: "P(A | B) = P(A) · P(B | A) / P(B)",
      short: `Binær partisjon \`A\` vs \`Aᶜ\`. Den enkleste og vanligste varianten.`,
      long: `Standardvarianten av Bayes' setning bruker en binær partisjon: hypotesen \`A\` og dens komplement \`Aᶜ\`. Det er denne du møter når oppgaven har «to tilstander» (sant/usant, syk/frisk, defekt/OK).


## Oppskriften i to steg

> [!read] P(A | B) = P(A) · P(B | A) / P(B)
> Posterior = prior ganger likelihood, delt på den totale sannsynligheten for evidensen.

Hvis \`P(B)\` ikke er gitt direkte, må du regne den ut først via total sannsynlighet:

    P(B) = P(A) · P(B | A) + P(Aᶜ) · P(B | Aᶜ)

Med \`P(B)\` på plass setter du tallene rett inn i Bayes.


## Konkret eksempel: defekt-deteksjon

I en produksjon er \`P(D) = 0.02\` av delene defekte. En detektor merker 95 % av defekte deler («\`P(M | D) = 0.95\`») og merker også feilaktig 3 % av OK-deler («\`P(M | Dᶜ) = 0.03\`»). En del blir merket. Hva er \`P(D | M)\`?

Først total sannsynlighet:

    P(M) = 0.02 · 0.95 + 0.98 · 0.03
         = 0.019 + 0.0294
         = 0.0484

Deretter Bayes:

    P(D | M) = 0.019 / 0.0484
             ≈ 0.3926

Selv med en ganske god detektor er bare ca. 39 % av merkede deler faktisk defekte. Grunnraten på 2 % drar svaret kraftig ned.


## Sjekkliste

- Svaret skal ligge i \`[0, 1]\`.
- Hvis prior \`P(A)\` er liten og evidensen er moderat, blir posterior \`P(A | B)\` fortsatt liten.
- \`P(A | B) ≠ P(B | A)\` med mindre \`P(A) = P(B)\`.

> [!tip] «Confusion of the inverse»: ikke forveksle de to retningene. Skriv alltid eksplisitt hvilken vei du har og hvilken vei du vil ha, før du regner.
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
    {
      id: "bayes-diagnose-test",
      name: "Diagnose-/test-mønster",
      abbreviation: "TEST",
      formula: "P(syk | +) = prevalens · sensitivitet / P(+)",
      short: "Bayes med medisinsk vokabular: prevalens, sensitivitet og spesifisitet.",
      long: `Når Bayes formuleres rundt en test mot en sykdom, har de tre tallene faste navn. Strukturen er identisk med standard 2-veis-varianten, men oversettelsen mellom ord og symboler er der mange snubler.


## Vokabular

- Prevalens \`= P(syk)\`: hvor vanlig sykdommen er i befolkningen («prior»).
- Sensitivitet \`= P(+ | syk)\`: sann positiv-rate, hvor ofte testen fanger en syk person.
- Spesifisitet \`= P(− | frisk)\`: sann negativ-rate, hvor ofte testen sier nei til en frisk person.

Komplementer du ofte trenger:

- Falsk positiv-rate \`= 1 − spesifisitet = P(+ | frisk)\`
- Falsk negativ-rate \`= 1 − sensitivitet = P(− | syk)\`

> [!read] P(syk | +) = P(syk) · sensitivitet / [P(syk) · sensitivitet + P(frisk) · (1 − spesifisitet)]
> Posterior for sykdom etter positiv test, med nevneren skrevet ut.


## Konkret eksempel: sjelden sykdom

Prevalens 1 %, sensitivitet 99 %, spesifisitet 95 %. En person tester positivt. Hva er \`P(syk | +)\`?

    P(+) = 0.01 · 0.99 + 0.99 · 0.05
         = 0.0099 + 0.0495
         = 0.0594

    P(syk | +) = 0.0099 / 0.0594 ≈ 0.1667

Bare 16.7 prosent, til tross for en svært god test. Dette er base-rate-fellen: når sykdommen er sjelden, drukner de sanne positive i de falske positive.


## Negativ test

Ved negativ test snur man bare på betingelsene:

    P(frisk | −) = P(frisk) · spesifisitet / [P(syk) · (1 − sensitivitet) + P(frisk) · spesifisitet]

> [!tip] For sjeldne sykdommer er negativ prediktiv verdi («\`P(frisk | −)\`») nesten alltid svært høy, mens positiv prediktiv verdi («\`P(syk | +)\`») kan være overraskende lav. Det er prevalensen som styrer skjevheten.
`,
      see_also: [
        {
          kind: "entry",
          id: "total-sannsynlighet",
        },
        {
          kind: "glossary",
          id: "betinget-sannsynlighet-glos",
        },
        {
          kind: "glossary",
          id: "komplement",
        },
      ],
    },
    {
      id: "bayes-multi-hypotese",
      name: "Multi-hypotese (3+ partisjoner)",
      abbreviation: "MULTI",
      formula: "P(Aᵢ | B) = P(Aᵢ) · P(B | Aᵢ) / Σⱼ P(Aⱼ) · P(B | Aⱼ)",
      short: "Bayes med tre eller flere disjunkte hypoteser som danner en partisjon.",
      long: `Når årsakene er flere enn to («maskin A, B eller C», «leverandør X, Y eller Z»), generaliseres Bayes ved å summere over alle hypotesene i nevneren. Strukturen er den samme som 2-veis, bare med flere ledd.


## Forutsetning: ekte partisjon

Hypotesene \`A₁, A₂, ..., Aₙ\` må være

- gjensidig utelukkende (ikke to kan være sanne samtidig), og
- uttømmende (én av dem MÅ være sann), så \`Σᵢ P(Aᵢ) = 1\`.

> [!read] P(Aᵢ | B) = P(Aᵢ) · P(B | Aᵢ) / Σⱼ P(Aⱼ) · P(B | Aⱼ)
> Posterior for hypotese \`i\` er bidraget fra \`Aᵢ\` delt på det samlede bidraget fra alle hypotesene.


## Konkret eksempel: tre maskiner

Maskin \`A\` produserer 50 % av delene med 1 % defekt, \`B\` produserer 30 % med 2 %, og \`C\` produserer 20 % med 5 %. En tilfeldig del er defekt. Hva er \`P(C | D)\`?

Total sannsynlighet:

    P(D) = 0.50 · 0.01 + 0.30 · 0.02 + 0.20 · 0.05
         = 0.005 + 0.006 + 0.010
         = 0.021

Bayes for \`C\`:

    P(C | D) = 0.20 · 0.05 / 0.021
             = 0.010 / 0.021
             ≈ 0.4762

Maskin \`C\` har lavest produksjonsandel, men høyest defektrate, så posterior for \`C\` er størst.


## Normaliseringssjekk

> [!tip] Regn alle posteriors og kontroller at \`Σᵢ P(Aᵢ | B) = 1\`. Det er en gratis sanity-test mot regnefeil.

For eksempelet over: \`P(A | D) ≈ 0.238\`, \`P(B | D) ≈ 0.286\`, \`P(C | D) ≈ 0.476\`. Sum: \`1.000\`.
`,
      see_also: [
        {
          kind: "entry",
          id: "total-sannsynlighet",
        },
        {
          kind: "glossary",
          id: "partisjon",
        },
        {
          kind: "glossary",
          id: "disjunkte-hendelser-glos",
        },
      ],
    },
    {
      id: "bayes-tre-diagram",
      name: "Tre-diagram-arbeidsflyt",
      abbreviation: "TRE",
      formula: "P(A | B) = P(A ∩ B) / Σ P(stier til B)",
      short: "Visuell oppskrift: tegn treet, multiplisér langs stiene, del Bayes-stien på summen.",
      long: `For ordrike eller flerstegs-oppgaver er det nesten alltid raskere å tegne et tre-diagram først. Treet sorterer informasjonen så formelen blir åpenbar.


## Slik bygges treet

1. Nivå 1 er hypotesen («syk» vs «frisk», eller \`A₁, A₂, A₃\`). Skriv prior på hver gren.
2. Nivå 2 er evidensen («positiv» vs «negativ»). Skriv likelihood på hver gren.
3. Hver endenode er en sti. Multiplisér prior med likelihood for å få fellessannsynligheten \`P(Aᵢ ∩ B)\`.

> [!read] P(Aᵢ | B) = P(Aᵢ ∩ B) / Σⱼ P(Aⱼ ∩ B)
> Bayes lest som: «den ene aktuelle stien delt på summen av alle stier som ender i \`B\`».

Nevneren er total sannsynlighet, men nå skrevet som «summen av relevante stier».


## Konkret eksempel: forsikringskrav

Et forsikringsselskap har 60 % unge sjåfører («\`U\`») og 40 % eldre («\`E\`»). Sannsynligheten for å melde et krav («\`K\`») i løpet av et år er 15 % for unge og 5 % for eldre. Et krav meldes. Hva er \`P(U | K)\`?

Nivå 1 (alder): \`U (0.60)\`, \`E (0.40)\`.
Nivå 2 (krav): under \`U\` har vi \`K (0.15)\` og \`Kᶜ (0.85)\`; under \`E\` har vi \`K (0.05)\` og \`Kᶜ (0.95)\`.

Stiprodukter:

    P(U ∩ K)  = 0.60 · 0.15 = 0.090
    P(E ∩ K)  = 0.40 · 0.05 = 0.020
    P(U ∩ Kᶜ) = 0.60 · 0.85 = 0.510
    P(E ∩ Kᶜ) = 0.40 · 0.95 = 0.380

Sjekk: \`0.090 + 0.020 + 0.510 + 0.380 = 1.000\`. OK.

Bayes:

    P(K)     = 0.090 + 0.020 = 0.110
    P(U | K) = 0.090 / 0.110 ≈ 0.8182

Selv om bare 60 % av sjåførene er unge, kommer ca. 82 % av kravene fra dem.


## Når treet vokser

> [!tip] For sekvensielle tester (skreening etterfulgt av bekreftende test) legger du på et nivå 3. Multiplisér videre langs stien, og bruk samme Bayes-uttrykk «aktuell sti / sum av stier som ender i evidensen».
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
    {
      id: "cdf-le-k",
      name: "Kumulativ sannsynlighet",
      abbreviation: "P(X ≤ k)",
      formula: "P(X ≤ k) = Σ C(n, i) · p^i · (1 − p)^(n − i)  for i = 0..k",
      short: `«Høyst \`k\` suksesser». Slå opp direkte i tabell E.1.`,
      long: `\`P(X ≤ k)\` er den kumulative sannsynligheten i binomialfordelingen og er nettopp det tabell E.1 leser direkte. Du slipper å summere punktsannsynlighetene for hånd så lenge \`n\`, \`p\` og \`k\` står i tabellen.

> [!read] P(X ≤ k) = P(X = 0) + P(X = 1) + ... + P(X = k)
> Summen av punktsannsynligheter opp til og med \`k\`. Dette er det E.1 har regnet ut for deg.


## Når dukker den opp?

Formuleringer som peker mot \`P(X ≤ k)\`:

- «høyst \`k\` suksesser», «\`k\` eller færre»
- «maks \`k\` defekter i utplukket»
- «mindre enn \`k + 1\`»

> [!tip] Trenger du «MINST \`k\`», bruker du E.1 indirekte: \`P(X ≥ k) = 1 − P(X ≤ k − 1)\`. Trappen er på \`k − 1\`, ikke \`k\`.


## Konkret eksempel

En produksjonslinje har defektandel \`p = 0.05\`. Vi tar et utplukk på \`n = 20\` enheter. Finn sannsynligheten for høyst 2 defekte.

1. Identifisering: \`X ~ Bin(20, 0.05)\`, spørres om \`P(X ≤ 2)\`.
2. Slå opp i E.1 med \`n = 20\`, \`p = 0.05\`, \`k = 2\`.

        P(X ≤ 2) ≈ 0.9245

Svar: ca. 92 % sjanse for høyst to defekter i utplukket.


## Når \`p > 0.5\` ikke står i tabellen

Noen versjoner av E.1 dekker bare \`p ≤ 0.5\`. Da snur du spørsmålet ved å se på antallet «motsatte»:

        Y = n − X ~ Bin(n, 1 − p)
        P(X ≤ k) = P(Y ≥ n − k) = 1 − P(Y ≤ n − k − 1)

F.eks. \`X ~ Bin(8, 0.90)\`, søker \`P(X ≤ 6)\`. Sett \`Y ~ Bin(8, 0.10)\`, slå opp \`P(Y ≤ 1) ≈ 0.8131\`, og svar \`P(X ≤ 6) = 1 − 0.8131 ≈ 0.1869\`.

> [!note] Sjekk at fordelingen din er Bin og ikke hypergeometrisk: trekker du UTEN tilbakelegging fra en endelig pott, endrer \`p\` seg underveis og E.1 gir feil svar.
`,
      see_also: [
        {
          kind: "formula",
          ref: "pmf",
        },
        {
          kind: "table",
          id: "E1-binomial-kumulativ",
        },
        {
          kind: "glossary",
          id: "kumulativ",
        },
      ],
    },
    {
      id: "cdf-ge-k",
      name: "Komplement: minst k",
      abbreviation: "P(X ≥ k)",
      formula: "P(X ≥ k) = 1 − P(X ≤ k − 1)",
      short: `«Minst \`k\` suksesser». Komplement av kumulativ, med trapp på \`k − 1\`.`,
      long: `\`P(X ≥ k)\` står ikke direkte i E.1; bruk komplementet. Det avgjørende er at tabellen skal slås opp på \`k − 1\`, ellers mister du bidraget fra \`X = k\` selv og svaret blir for lavt.

> [!read] P(X ≥ k) = 1 − P(X ≤ k − 1)
> Sannsynligheten for «minst \`k\` suksesser» er én minus sannsynligheten for «høyst \`k − 1\` suksesser».


## Når dukker den opp?

Formuleringer som peker mot \`P(X ≥ k)\`:

- «minst \`k\` suksesser», «\`k\` eller flere»
- «vinne minst én gang»
- «flere enn \`k − 1\`»

> [!note] Klassisk feil: «\`P(X ≥ 2) = 1 − P(X ≤ 2)\`». Det er feil. Korrekt: «\`P(X ≥ 2) = 1 − P(X ≤ 1)\`».


## Konkret eksempel

En andel \`p = 0.2\` av grantrær har en sykdom. Vi sjekker tilfeldig 10 grantrær. Finn sannsynligheten for minst 2 syke.

1. Identifisering: \`X ~ Bin(10, 0.2)\`, søker \`P(X ≥ 2)\`.
2. Skriv om: \`P(X ≥ 2) = 1 − P(X ≤ 1)\`.
3. Slå opp i E.1 (\`n = 10\`, \`p = 0.2\`, \`k = 1\`):

        P(X ≤ 1) ≈ 0.376
        P(X ≥ 2) = 1 − 0.376 ≈ 0.624

Svar: ca. 62 % sjanse for minst to syke trær.


## Spesialtilfelle: minst én

For \`k = 1\` slipper du tabellen helt:

        P(X ≥ 1) = 1 − P(X = 0) = 1 − (1 − p)^n

F.eks. lottokuponger med \`p = 0.05\` og \`n = 20\` lodd: \`P(X ≥ 1) = 1 − 0.95^20 ≈ 1 − 0.3585 ≈ 0.6415\`.

> [!tip] Det er nettopp denne refleksen «minst én = 1 minus ingen» som fyller mest plass i pensum-oppgavene. Lær den utenat.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-le-k",
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
    {
      id: "find-n-threshold",
      name: "Finn nødvendig n",
      formula: "1 − (1 − p)^n ≥ p_terskel  ⇒  n ≥ ln(1 − p_terskel) / ln(1 − p)",
      short: "Hvor mange forsøk trengs for at sannsynligheten når en gitt terskel?",
      long: `Den inverse varianten snur problemet: i stedet for å regne ut en sannsynlighet for et gitt \`n\`, leter du etter det MINSTE \`n\` som gjør at en sannsynlighet når en bestemt terskel \`p_terskel\`. Den klassiske formen er «hvor mange lodd må jeg kjøpe for å vinne minst én gang med 99 % sannsynlighet?».

> [!read] P(X ≥ 1) = 1 − (1 − p)^n ≥ p_terskel
> Sannsynligheten for minst én suksess vokser med \`n\`. Løs ut \`n\` via logaritme.


## Strategi

1. Skriv kravet om til kumulativ form, typisk \`P(X ≥ 1) ≥ p_terskel\` eller \`P(X = 0) ≥ p_terskel\`.
2. Sett inn pmf for «ingen suksesser»: \`(1 − p)^n\`.
3. Ta naturlig logaritme på begge sider.
4. Husk at \`ln(1 − p) < 0\` snur ulikhetstegnet ved deling.
5. Rund opp til nærmeste heltall siden \`n\` må være heltall.

> [!note] For mer kompliserte krav (f.eks. \`P(X ≥ 2) ≥ 0.95\`) får du sjelden lukket løsning. Da prøver du økende \`n\` i tabell E.1 til kravet er oppfylt.


## Konkret eksempel

Hvert lodd har vinnersannsynlighet \`p = 0.05\`. Hvor mange lodd må vi kjøpe for at sannsynligheten for å vinne minst én gang er minst 0.99?

1. Krav: \`P(X ≥ 1) = 1 − 0.95^n ≥ 0.99\`, dvs. \`0.95^n ≤ 0.01\`.
2. Logaritme: \`n · ln(0.95) ≤ ln(0.01)\`. Siden \`ln(0.95) < 0\` snur tegnet ved deling.

        n ≥ ln(0.01) / ln(0.95)
          = −4.6052 / −0.05129
          ≈ 89.78

3. Rund opp: \`n = 90\`.

Svar: 90 lodd er nok for minst 99 % vinnersannsynlighet.


## Verifisering

Sett inn \`n = 89\` og \`n = 90\` i den opprinnelige ulikheten:

        n = 89: 1 − 0.95^89 ≈ 0.9899  (akkurat under 0.99)
        n = 90: 1 − 0.95^90 ≈ 0.9904  (over 0.99 ✓)

Det bekrefter at \`n = 90\` er den minste verdien som tilfredsstiller kravet.

> [!tip] Skriv alltid svaret med ord («minst 90 lodd») og oppgi sannsynligheten som dokumentasjon. Glemmer du å runde opp, sliter du på avrundingsregler ved sensur.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-ge-k",
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
    {
      id: "t-venstresidig",
      name: "Venstresidig t-test (H₁: μ < μ₀)",
      abbreviation: "T<",
      formula: "Forkast H₀ hvis T < −t_(α, ν)   |   ν = n − 1",
      short: `Ensidig venstresidig med t-fordeling: kritisk verdi er negativ og leses opp på \`ν = n − 1\` frihetsgrader.`,
      long: `Strukturen er den samme som for venstresidig z-test, men siden \`σ\` er ukjent og estimeres med \`S\`, er testobservatoren \`T\` t-fordelt med \`ν = n − 1\` frihetsgrader. Kritisk verdi leses derfor av tabell E.5, ikke z-tabellen.


## Kritisk verdi og forkastningsområde

> [!read] Forkast \`H₀\` hvis \`T < −t_(α, ν)\`
> Sjekkverdien er «t-kvantilen med minustegn». For \`α = 0.05\` og \`ν = 11\` er \`t_(0.05, 11) ≈ 1.796\`, så grensen er \`−1.796\`.

Forkastningsområdet er \`(−∞, −t_(α, ν))\`. For små \`ν\` er t-fordelingen bredere enn standardnormalen, så \`t_(α, ν) > z_α\`. Du trenger «mer ekstrem» \`T\` for å forkaste når utvalget er lite.


## p-verdi

> [!read] \`p = P(T < t)\` med \`ν\` frihetsgrader
> Slå opp i tabell E.5 og finn nærmeste kvantil. Vanlige t-tabeller gir bare utvalgte α-verdier, så ofte rapporterer man et intervall: «\`p < 0.025\`» heller enn et eksakt tall.


## Konkret eksempel

Produsenten påstår \`μ₀ = 1000\` timer levetid. Et utvalg på \`n = 12\` lyspærer (\`ν = 11\`) gir \`x̄ = 970\`, \`s = 40\`, så \`T = (970 − 1000)/(40/√12) ≈ −2.598\`. På \`α = 0.05\`:

    Kritisk verdi: −t_(0.05, 11) ≈ −1.796
    Sammenligning: −2.598 < −1.796  ✓
    p-verdi:       P(T < −2.598, ν = 11) ≈ 0.012

Forkast \`H₀\`: lyspærene varer i snitt «kortere» enn produsentens påstand på 1000 timer. Til sammenligning ville en z-test med samme tall gitt kritisk verdi \`−1.645\`; t-testen er litt strengere på små utvalg.
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
    {
      id: "t-hoyresidig",
      name: "Høyresidig t-test (H₁: μ > μ₀)",
      abbreviation: "T>",
      formula: "Forkast H₀ hvis T > +t_(α, ν)   |   ν = n − 1",
      short: `Ensidig høyresidig med t-fordeling: kritisk verdi er positiv og avhenger av frihetsgrader \`ν = n − 1\`.`,
      long: `For \`H₁: μ > μ₀\` med ukjent \`σ\` ligger forkastningsområdet i høyre hale av t-fordelingen med \`ν = n − 1\` frihetsgrader. Større utvalg gir t-fordeling som nærmer seg standardnormalen; for små utvalg er kritisk verdi merkbart større enn den tilsvarende z-kvantilen.


## Kritisk verdi og forkastningsområde

> [!read] Forkast \`H₀\` hvis \`T > +t_(α, ν)\`
> Sjekkverdien er den positive t-kvantilen. For \`α = 0.05\` og \`ν = 9\` er \`t_(0.05, 9) ≈ 1.833\`. For \`α = 0.01\` og samme \`ν\` er \`t_(0.01, 9) ≈ 2.821\`.

Negative \`T\`-verdier forkaster «aldri» en høyresidig \`H₀\`, uansett hvor store de er i absoluttverdi det ville være evidens i feil retning.


## p-verdi

> [!read] \`p = P(T > t)\` med \`ν\` frihetsgrader
> Brukes når du har programvare. Ved tabelloppslag rapporterer du et intervall: f.eks. «\`0.025 < p < 0.05\`» når \`t\` ligger mellom \`t_(0.05, ν)\` og \`t_(0.025, ν)\`.


## Konkret eksempel

Gjødselprodusent hevder avling minst \`μ₀ = 50\` kg/dekar. Et utvalg på \`n = 10\` jordstykker (\`ν = 9\`) gir \`x̄ = 53\`, \`s = 4\`, så \`T = (53 − 50)/(4/√10) ≈ 2.372\`. På \`α = 0.05\`:

    Kritisk verdi: t_(0.05, 9) ≈ 1.833
    Sammenligning: 2.372 > 1.833  ✓
    p-verdi:       P(T > 2.372, ν = 9) ≈ 0.021

Forkast \`H₀\`: tallene gir grunn til å hevde at gjennomsnittlig avling «overstiger» 50 kg/dekar. Merk: på \`α = 0.01\` med kritisk verdi \`2.821\` ville samme \`T = 2.372\` gitt behold avgjørelsen er nivåavhengig.
`,
      see_also: [
        {
          kind: "glossary",
          id: "t-fordeling",
        },
        {
          kind: "glossary",
          id: "alternativhypotese",
        },
        {
          kind: "table",
          id: "E5-t-tabell",
        },
      ],
    },
    {
      id: "t-tosidig",
      name: "Tosidig t-test (H₁: μ ≠ μ₀)",
      abbreviation: "T≠",
      formula: "Forkast H₀ hvis |T| > t_(α/2, ν)   |   ν = n − 1",
      short: `Tosidig med t-fordeling: del \`α\` på to og bruk \`t_(α/2, ν)\` på begge haler.`,
      long: `Tosidig t-test har ingen retningshypotese, så \`α\` fordeles likt på de to halene av t-fordelingen med \`ν = n − 1\` frihetsgrader. Den eneste praktiske forskjellen fra tosidig z-test er at vi slår opp i tabell E.5 og at frihetsgrader bestemmer kvantilen.


## Kritisk verdi og forkastningsområde

> [!read] Forkast \`H₀\` hvis \`|T| > t_(α/2, ν)\`
> For \`α = 0.05\` og \`ν = 14\` er \`t_(0.025, 14) ≈ 2.145\`. For \`α = 0.05\` og \`ν = 9\` er \`t_(0.025, 9) ≈ 2.262\`.

Forkastningsområdet er todelt: \`(−∞, −t_(α/2, ν)) ∪ (t_(α/2, ν), ∞)\`. Den vanligste tabbe-modusen er å bruke \`t_(α, ν)\` (f.eks. \`1.761\` for \`α = 0.05\`, \`ν = 14\`) i stedet for \`t_(α/2, ν)\`. Det halverer effektivt nivået og gir for liberalt forkast.


## p-verdi

> [!read] \`p = 2·P(T > |t|)\` med \`ν\` frihetsgrader
> Som for z-testen dobler vi den ensidige sannsynligheten siden begge halene teller. Med tabell rapporteres et intervall, f.eks. «\`p < 0.05\`» når \`|T| > t_(0.025, ν)\`.


## Konkret eksempel

En påfyllingsmaskin skal gi \`μ₀ = 500\` ml. Et utvalg på \`n = 15\` (\`ν = 14\`) gir \`x̄ = 503\`, \`s = 4\`, så \`T = (503 − 500)/(4/√15) ≈ 2.905\`. På \`α = 0.05\`:

    Kritisk verdi: t_(0.025, 14) ≈ 2.145
    Sammenligning: |2.905| = 2.905 > 2.145  ✓
    p-verdi:       2·P(T > 2.905, ν = 14) ≈ 0.012

Forkast \`H₀\`: maskinen avviker signifikant fra 500 ml. Her er retningen positiv (overfylling), men selve tosidige beslutningen sier «forskjellig», ikke «høyere».
`,
      see_also: [
        {
          kind: "glossary",
          id: "tosidig-test",
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
    {
      id: "z-venstresidig",
      name: "Venstresidig z-test (H₁: μ < μ₀)",
      abbreviation: "Z<",
      formula: "Forkast H₀ hvis Z < −z_α   |   p = G(z)",
      short: `Ensidig venstresidig: kritisk verdi er negativ, og p-verdien leses direkte fra \`G(z)\` i z-tabellen.`,
      long: `Når \`H₁: μ < μ₀\`, mistenker du at den sanne forventningsverdien ligger under påstandsverdien. Hele forkastningsområdet ligger derfor i venstre hale av standardnormalfordelingen.


## Kritisk verdi og forkastningsområde

> [!read] Forkast \`H₀\` hvis \`z < −z_α\`
> Sjekkverdien er «kvantilen \`z_α\` med minus foran». For \`α = 0.05\` er \`z_(0.05) = 1.645\`, så grensen er \`−1.645\`.

Fortegnet er nøkkelen: det er lett å glemme minus og sammenligne med \`+1.645\`. Da forkaster du aldri når du burde, fordi venstresidige \`z\` er negative.

Forkastningsområdet er hele halen \`(−∞, −z_α)\`. Alt høyere enn dette beholder \`H₀\`.


## p-verdi

> [!read] \`p = P(Z < z) = G(z)\`
> p-verdien er sannsynligheten for å se en \`z\`-verdi like ekstrem eller mer ekstrem (i venstre retning) under \`H₀\`. Dette er nøyaktig \`G(z)\` slik den står i tabell E.3.

Med \`z = −2.40\` slår du opp \`G(−2.40) ≈ 0.0082\`. Siden \`0.0082 < 0.05\`, forkaster du. Regelen «forkast hvis \`p < α\`» gir alltid samme svar som kritisk-verdi-regelen.


## Konkret eksempel

Nye julelys testes mot standardmodellen \`μ₀ = 50 W\`, med kjent \`σ = 5\`. Et utvalg på \`n = 40\` gir \`x̄ = 48\`, så \`z = (48 − 50)/(5/√40) ≈ −2.53\`. På \`α = 0.05\`:

    Kritisk verdi: −z_(0.05) = −1.645
    Sammenligning: −2.53 < −1.645  ✓
    p-verdi:       G(−2.53) ≈ 0.0057

Begge regler gir forkast: tallene tyder på at de nye lysene bruker «mindre» enn 50 W i snitt.
`,
      see_also: [
        {
          kind: "glossary",
          id: "ensidig-test",
        },
        {
          kind: "glossary",
          id: "kritisk-verdi",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
      ],
    },
    {
      id: "z-hoyresidig",
      name: "Høyresidig z-test (H₁: μ > μ₀)",
      abbreviation: "Z>",
      formula: "Forkast H₀ hvis Z > +z_α   |   p = 1 − G(z)",
      short: `Ensidig høyresidig: kritisk verdi er positiv, og p-verdien er \`1 − G(z)\`.`,
      long: `Når \`H₁: μ > μ₀\`, leter du etter evidens for at sann forventningsverdi ligger over påstandsverdien. Hele forkastningsområdet ligger i høyre hale av standardnormalfordelingen.


## Kritisk verdi og forkastningsområde

> [!read] Forkast \`H₀\` hvis \`z > +z_α\`
> Her er sjekkverdien \`+z_α\` (positiv). For \`α = 0.05\` er \`z_(0.05) = 1.645\`, så grensen er \`+1.645\`.

For høyresidig test forventes \`z\` å være positiv hvis \`H₁\` er sann. Forkastningsområdet er \`(z_α, ∞)\`. Vanlig feil er å sammenligne \`|z|\` mot \`z_α\` her, men en stor negativ \`z\` skal aldri forkaste en høyresidig \`H₀\` det er bare evidens i «feil retning».


## p-verdi

> [!read] \`p = P(Z > z) = 1 − G(z)\`
> Sannsynligheten for å se en \`z\` like stor eller større under \`H₀\`. Slå opp \`G(z)\` i z-tabellen og trekk fra 1.

Med \`z = 2.10\` blir \`1 − G(2.10) ≈ 1 − 0.9821 = 0.0179\`. På \`α = 0.05\` gir det forkast, men på \`α = 0.01\` ikke siden \`0.0179 > 0.01\`. Husk: ensidig p-verdi deles «ikke» på 2 her.


## Konkret eksempel

Et nytt medikament testes mot referanse \`μ₀ = 70\` med kjent \`σ = 10\`. Et utvalg på \`n = 49\` gir \`x̄ = 73\`, så \`z = (73 − 70)/(10/√49) = 2.10\`. På \`α = 0.01\`:

    Kritisk verdi: z_(0.01) = 2.326
    Sammenligning: 2.10 > 2.326?  Nei (2.10 < 2.326)
    p-verdi:       1 − G(2.10) ≈ 0.0179 > 0.01

Behold \`H₀\`: på strengt 1 %-nivå er det «ikke» nok evidens for at medikamentet hever biomarkøren. (På \`α = 0.05\` ville samme \`z\` gitt forkast.)
`,
      see_also: [
        {
          kind: "glossary",
          id: "ensidig-test",
        },
        {
          kind: "glossary",
          id: "p-verdi-glos",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
      ],
    },
    {
      id: "z-tosidig",
      name: "Tosidig z-test (H₁: μ ≠ μ₀)",
      abbreviation: "Z≠",
      formula: "Forkast H₀ hvis |Z| > z_(α/2)   |   p = 2(1 − G(|z|))",
      short: `Tosidig: signifikansnivået fordeles likt på begge haler, så bruk \`z_(α/2)\` og doble p-verdien.`,
      long: `Når \`H₁: μ ≠ μ₀\`, har du ingen retningshypotese: avvik i begge retninger er av interesse. Da fordeles \`α\` likt på begge haler av standardnormalfordelingen.


## Kritisk verdi og forkastningsområde

> [!read] Forkast \`H₀\` hvis \`|z| > z_(α/2)\`
> Du sammenligner «absoluttverdien» av \`z\` med kvantilen \`z_(α/2)\`, ikke \`z_α\`. For \`α = 0.05\` er \`z_(0.025) = 1.96\` (ikke \`1.645\`).

Forkastningsområdet er todelt: \`(−∞, −z_(α/2)) ∪ (z_(α/2), ∞)\`. Vanlig feil er å bruke \`z_(0.05) = 1.645\` når man egentlig kjører en tosidig test på \`α = 0.05\` det halverer effektivt nivået og gir for mange forkast.


## p-verdi

> [!read] \`p = 2·P(Z > |z|) = 2(1 − G(|z|))\`
> Den tosidige p-verdien er «dobbelt» så stor som den ensidige fordi vi tar med begge halene like ekstreme «hvor som helst».

Med \`z = 2.50\` blir \`2(1 − G(2.50)) ≈ 2·0.0062 = 0.0124\`. På \`α = 0.05\` forkast; på \`α = 0.01\` behold. Sammenhengen «forkast hvis \`p < α\`» gjelder fortsatt det er definisjonen av tosidig p-verdi som endres.


## Konkret eksempel

En tappemaskin skal fylle \`μ₀ = 500 ml\` med kjent \`σ = 4\`. Et utvalg på \`n = 25\` gir \`x̄ = 502\`, så \`z = (502 − 500)/(4/√25) = 2.50\`. På \`α = 0.05\`:

    Kritisk verdi: z_(0.025) = 1.96
    Sammenligning: |2.50| = 2.50 > 1.96  ✓
    p-verdi:       2(1 − G(2.50)) ≈ 0.0124

Forkast \`H₀\`: maskinen avviker signifikant fra 500 ml (her: overfylling, men retningen er en «tilleggsobservasjon» ikke en del av den tosidige beslutningen).
`,
      see_also: [
        {
          kind: "glossary",
          id: "tosidig-test",
        },
        {
          kind: "glossary",
          id: "kvantil",
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
    {
      id: "komplement-minst-k",
      name: "Minst k via komplement",
      abbreviation: "MIN-K",
      formula: "P(X ≥ k) = 1 − P(X ≤ k − 1)",
      short: `«Minst \`k\`» blir «høyst \`k − 1\`» via komplement. Pass på indeksen.`,
      long: `«Minst \`k\`» er det vanligste mønsteret der komplementet sparer arbeid. Direkte måtte du summere \`P(X = k) + P(X = k + 1) + ...\`, mens komplementet er ett enkelt tabelloppslag.


## Indeksen er hovedfella

> [!read] P(X ≥ k) = 1 − P(X ≤ k − 1)
> Komplementet til «minst \`k\`» er «høyst \`k − 1\`», IKKE «høyst \`k\`».

For \`k = 3\` betyr det 

    P(X ≥ 3) = 1 − P(X ≤ 2)

Hadde du brukt \`1 − P(X ≤ 3)\` i stedet, ville du mistet bidraget fra \`X = 3\` selv. Tommelfingerregel: når du flytter «minst» til «høyst» skal indeksen ALLTID reduseres med 1.


## Konkret eksempel: binomial

En binomisk variabel har \`n = 10\`, \`p = 0.3\`. Finn \`P(X ≥ 2)\`.

Fra tabell E.1 (binomisk kumulativ): \`P(X ≤ 1) ≈ 0.1493\` for \`n = 10\`, \`p = 0.3\`.

    P(X ≥ 2) = 1 − P(X ≤ 1)
             = 1 − 0.1493
             = 0.8507

Feil-versjonen \`1 − P(X ≤ 2) ≈ 1 − 0.3828 = 0.6172\` ville mistet bidraget fra \`X = 2\` (ca. \`0.2335\`).


## Spesialtilfellet «minst én»

> [!tip] «Minst én» trenger ikke tabell. For uavhengige forsøk er \`P(X ≥ 1) = 1 − (1 − p)^n\` (binomial) eller \`P(X ≥ 1) = 1 − e^(−λt)\` (Poisson). Én linje, ingen oppslag.
`,
      see_also: [
        {
          kind: "entry",
          id: "binomial-fordeling",
        },
        {
          kind: "entry",
          id: "poisson-fordeling",
        },
        {
          kind: "table",
          id: "E1-binomial-kumulativ",
        },
      ],
    },
    {
      id: "komplement-ingen",
      name: "Ingen / null forekomster",
      abbreviation: "NULL",
      formula: "P(X = 0) = 1 − P(X ≥ 1)",
      short: "«Ingen» og «minst én» er hverandres komplementer. Regn det som er enklest.",
      long: `«Ingen» og «minst én» er to sider av samme sak. Når du har den ene, har du den andre gratis.


## Den symmetriske relasjonen

> [!read] P(X = 0) + P(X ≥ 1) = 1
> Enten skjer hendelsen ikke i det hele tatt, eller så skjer den minst én gang. Ikke noe imellom.

Dermed kan du regne den enkleste og lese av den andre. For uavhengige forsøk er \`P(X = 0)\` typisk en ren produkt-utregning (ingen tabell), mens \`P(X ≥ 1)\` ville krevd å summere over mange utfall.


## Konkret eksempel: Poisson-anrop

Antall anrop til en sentralbord er Poisson-fordelt med rate \`0.3\` anrop per minutt. Finn sannsynligheten for ingen anrop på 10 minutter.

    λt = 0.3 · 10 = 3
    P(X = 0) = e^(−λt) = e^(−3) ≈ 0.0498

Og som bonus: \`P(X ≥ 1) = 1 − 0.0498 ≈ 0.9502\`. Regnet du ut det første, har du det andre uten ekstra arbeid.


## Vanlige uttrykk for «ingen»

- Binomial (uavhengige forsøk): \`P(X = 0) = (1 − p)^n\`
- Poisson (rate \`λ\` over tid \`t\`): \`P(X = 0) = e^(−λt)\`
- Eksponential ventetid: \`P(T > t) = e^(−λt)\` (tilsvarer «ingen hendelse innen \`t\`»)

> [!tip] Hvis trekkene IKKE er uavhengige (f.eks. uten tilbakelegging fra en endelig urne), gjelder ikke \`(1 − p)^n\`. Bruk hypergeometrisk eller direkte telling i stedet.
`,
      see_also: [
        {
          kind: "entry",
          id: "poisson-fordeling",
        },
        {
          kind: "entry",
          id: "binomial-fordeling",
        },
        {
          kind: "glossary",
          id: "uavhengighet-glos",
        },
      ],
    },
    {
      id: "komplement-ikke-alle",
      name: "Ikke alle",
      abbreviation: "IKKE-ALLE",
      formula: "P(ikke alle) = 1 − P(alle) = 1 − p^n",
      short: "«Ikke alle» er komplementet til «alle». Forveksles ofte med «ingen».",
      long: `«Ikke alle» betyr «minst én er motsatt», og er komplementet til «alle». Den vanligste regnefeilen er å forveksle «ikke alle» med «ingen», men det er to helt ulike hendelser.


## Pass på forskjellen

> [!read] P(ikke alle) = 1 − P(alle) = 1 − p^n
> «Ikke alle» er motsatt av «alle», og altså «minst én feiler».

Men:

- «Alle suksess» har sannsynlighet \`p^n\`
- «Ingen suksess» har sannsynlighet \`(1 − p)^n\`
- «Ikke alle suksess» har sannsynlighet \`1 − p^n\` (NB: dette er IKKE \`(1 − p)^n\`)
- «Minst én suksess» har sannsynlighet \`1 − (1 − p)^n\`

De fire størrelsene er forskjellige. Tegn et lite venndiagram hvis du er i tvil.


## Konkret eksempel: komponentpålitelighet

Et system har 5 uavhengige komponenter i serie. Hver fungerer med sannsynlighet \`p = 0.95\`. Finn sannsynligheten for at minst én feiler («ikke alle fungerer»).

    P(alle OK) = 0.95^5 ≈ 0.7738
    P(ikke alle OK) = 1 − 0.7738 = 0.2262

Til sammenligning: \`P(ingen OK) = 0.05^5 ≈ 3·10⁻⁷\`. Det er tusentalls ganger mindre.

> [!tip] Når du ser «alle» i en setning, er komplementet alltid «minst én er motsatt», ikke «ingen». Skriv det ut eksplisitt før du regner.


## Når trekkene er avhengige

For trekk uten tilbakelegging gjelder ikke \`p^n\`. Bruk hypergeometrisk for \`P(alle)\` først, og ta så komplementet. F.eks. «alle 5 trukne kort er hjerter» fra en stokk på 52 har \`P(alle hjerter) = C(13, 5)/C(52, 5) ≈ 0.000495\`, ikke \`0.25^5\`.
`,
      see_also: [
        {
          kind: "entry",
          id: "binomial-fordeling",
        },
        {
          kind: "glossary",
          id: "uavhengighet-glos",
        },
        {
          kind: "glossary",
          id: "komplement",
        },
      ],
    },
    {
      id: "komplement-finn-n",
      name: "Finn n for terskel",
      abbreviation: "n*",
      formula: "n ≥ ln(1 − τ) / ln(1 − p)",
      short: `Hvor mange forsøk trengs for at \`P(minst én)\` overstiger en terskel \`τ\`?`,
      long: `Et klassisk planleggingsspørsmål: hvor mange uavhengige forsøk må vi gjøre for at sannsynligheten for minst én suksess skal være minst \`τ\`? Komplementet gjør oppgaven til en lineær logaritme-utregning.


## Fra krav til ulikhet

Kravet «minst én suksess med sannsynlighet minst \`τ\`» blir

    P(X ≥ 1) ≥ τ
    1 − (1 − p)^n ≥ τ
    (1 − p)^n ≤ 1 − τ

> [!read] n ≥ ln(1 − τ) / ln(1 − p)
> Logaritme av begge sider, og siden \`ln(1 − p) < 0\` snur ulikheten. Rund alltid OPP til nærmeste heltall.


## Konkret eksempel: sjelden suksess

Et eksperiment lykkes med \`p = 0.02\` per forsøk. Hvor mange forsøk trengs for \`P(minst én suksess) ≥ 0.95\`?

    (1 − 0.02)^n ≤ 1 − 0.95
    0.98^n ≤ 0.05
    n ≥ ln(0.05) / ln(0.98)
    n ≥ (−2.9957) / (−0.0202)
    n ≥ 148.3   ⟹   n = 149

Verifisering:

    1 − 0.98^149 ≈ 0.9506 ≥ 0.95   OK
    1 − 0.98^148 ≈ 0.9496 < 0.95    (148 er for lite)


## Vanlige fallgruver

> [!tip] Husk å snu ulikheten ved logaritme av tall mellom 0 og 1. Glemmer du det, ender du med \`n ≤ ...\` og bruker for få forsøk.

- Rund OPP, aldri ned: \`n = 148.3\` betyr \`n = 149\`, fordi \`n = 148\` ikke oppfyller kravet.
- Verifiser ved innsetting: hvis \`n − 1\` også oppfyller, har du regnet feil.
- For ikke-uavhengige forsøk gjelder ikke \`(1 − p)^n\`; bruk addisjon med betinget sannsynlighet i stedet.
`,
      see_also: [
        {
          kind: "entry",
          id: "binomial-fordeling",
        },
        {
          kind: "entry",
          id: "poisson-fordeling",
        },
        {
          kind: "glossary",
          id: "uavhengighet-glos",
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
    {
      id: "cdf-lt-x",
      name: "Kumulativ: under x",
      abbreviation: "P(X < x)",
      formula: "P(X < x) = G((x − μ)/σ)",
      short: `Standardiser, slå opp \`G(z)\` direkte i tabell E.3.`,
      long: `\`P(X < x)\` er den kumulative sannsynligheten for normalfordelingen, og er nettopp det tabell E.3 gir deg etter standardisering. Du regner ut \`z = (x − μ)/σ\`, runder til 2 desimaler, og leser av \`G(z)\`.

> [!read] P(X < x) = G((x − μ)/σ)
> «Antall standardavvik over eller under gjennomsnittet, så slå opp i z-tabellen.»


## Standardiseringen

Formelen \`Z = (X − μ)/σ\` flytter fordelingen til standardnormal \`N(0, 1)\`. To detaljer er kritiske:

- Trekk fra \`μ\` FØR du deler på \`σ\` (rekkefølgen er ikke kommutativ).
- Rund \`z\` til 2 desimaler for å passe E.3 sin oppløsning.

> [!tip] Siden normalfordelingen er kontinuerlig spiller \`<\` og \`≤\` ingen rolle: \`P(X < x) = P(X ≤ x)\`. Skriv det enkleste uttrykket.


## Konkret eksempel

Mengden kaffe \`X\` er normalfordelt med \`μ = 25\` cl og \`σ = 0.48\` cl. Finn \`P(X < 24)\`.

1. Identifisering: \`X ~ N(25, 0.48)\`, terskel \`x = 24\`.
2. Standardiser:

        z = (24 − 25)/0.48
          = −2.0833
          ≈ −2.08

3. Slå opp i E.3:

        G(−2.08) ≈ 0.0188

Svar: \`P(X < 24) ≈ 0.019\` (om lag 1.9 % av koppene har mindre enn 24 cl).


## Negativ \`z\` og symmetri

Når \`x < μ\` blir \`z\` negativ. Vår E.3 dekker både fortegn, så du leser av direkte. Hvis du derimot bruker en tabell med kun positive \`z\`, anvender du symmetrien:

        G(−z) = 1 − G(z)

> [!note] Vanligste feil er å bytte rekkefølge i telleren («\`(μ − x)/σ\`»). Da får du fortegn snudd og svaret feil. Sjekk alltid: \`x < μ\` skal gi \`z < 0\` og dermed \`G(z) < 0.5\`.
`,
      see_also: [
        {
          kind: "table",
          id: "E3-z-tabell",
        },
        {
          kind: "glossary",
          id: "normalisering",
        },
        {
          kind: "glossary",
          id: "sigma",
        },
      ],
    },
    {
      id: "cdf-gt-x",
      name: "Komplement: over x",
      abbreviation: "P(X > x)",
      formula: "P(X > x) = 1 − G((x − μ)/σ)",
      short: `E.3 gir venstrearealet, så for «over \`x\`» tar du komplementet.`,
      long: `\`P(X > x)\` finnes ikke direkte i E.3 (tabellen leser kumulativen, dvs. arealet til venstre). Bruk komplementet etter standardisering: \`1 − G(z)\`.

> [!read] P(X > x) = 1 − G((x − μ)/σ)
> «Standardiser, slå opp venstrearealet, trekk fra én.»


## Fortegnssjekk

Et nyttig sanity-grep:

- \`x > μ\` ⇒ \`z > 0\` ⇒ \`G(z) > 0.5\` ⇒ \`P(X > x) < 0.5\`
- \`x < μ\` ⇒ \`z < 0\` ⇒ \`G(z) < 0.5\` ⇒ \`P(X > x) > 0.5\`

Hvis fortegnet på svaret ditt strider med dette, har du sannsynligvis snudd standardiseringen.

> [!tip] For \`Z ~ N(0, 1)\` er \`P(Z > 1.96) ≈ 0.0250\`, som er den klassiske 2.5 %-halen. Lær den utenat: den dukker opp i alle z-tester.


## Konkret eksempel

IQ er \`X ~ N(100, 15²)\`. Finn \`P(X > 130)\` (klassisk «begavet»-grense).

1. Identifisering: \`μ = 100\`, \`σ = 15\`, terskel \`x = 130\`.
2. Standardiser:

        z = (130 − 100)/15 = 2.00

3. Komplement:

        P(X > 130) = 1 − G(2.00)
                   ≈ 1 − 0.9772
                   ≈ 0.0228

Svar: vel 2 % har IQ over 130.


## To-veis sjekk

Hvis du allerede har regnet \`P(X < x)\` i en deloppgave, tar du \`1 −\` det svaret. Får du forskjellig resultat fra direkte komplement på \`G(z)\`, har du gjort en avrundingsfeil et sted. Hold deg til 2 desimaler i \`z\` og 4 desimaler i sluttsvaret.

> [!note] «Større enn 130» er \`P(X > 130)\`, ikke \`P(X ≥ 130)\` formelt sett, men siden \`X\` er kontinuerlig er de to like. Skriv det enkleste.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-lt-x",
        },
        {
          kind: "entry",
          id: "komplementregelen",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
      ],
    },
    {
      id: "interval-ab",
      name: "Intervall via to oppslag",
      abbreviation: "P(a < X < b)",
      formula: "P(a < X < b) = G((b − μ)/σ) − G((a − μ)/σ)",
      short: "Differanse av to kumulative, etter standardisering av begge endepunkter.",
      long: `For sannsynligheten at \`X\` faller i et intervall standardiserer du begge endepunktene og trekker venstrearealet på \`a\` fra venstrearealet på \`b\`. Resultatet er det kumulative arealet mellom de to grensene.

> [!read] P(a < X < b) = G(z_b) − G(z_a)  med z_a = (a − μ)/σ, z_b = (b − μ)/σ
> Standardiser hver grense for seg, slå opp begge i E.3, trekk fra.


## Sanity-sjekker

- \`b > a\` ⇒ \`z_b > z_a\` ⇒ svaret er positivt.
- Svaret må ligge mellom 0 og 1.
- Et symmetrisk intervall \`μ ± σ\` skal gi den klassiske 68 %-regelen (\`G(1) − G(−1) ≈ 0.6826\`).

> [!tip] For brede intervaller \`μ ± kσ\` er fasitsvarene 68/95/99.7-regelen for \`k = 1, 2, 3\`. Bruk det til å sjekke om svaret ditt er rimelig.


## Konkret eksempel

Fyllingen \`X\` av såpebeholdere er \`N(302, 5²)\` ml. Finn \`P(305 < X ≤ 310)\`.

1. Identifisering: \`μ = 302\`, \`σ = 5\`, grenser \`a = 305\`, \`b = 310\`.
2. Standardiser:

        z_a = (305 − 302)/5 = 0.6
        z_b = (310 − 302)/5 = 1.6

3. Slå opp i E.3:

        G(0.6) ≈ 0.7257
        G(1.6) ≈ 0.9452

4. Trekk fra:

        P(305 < X ≤ 310) = 0.9452 − 0.7257 ≈ 0.2195

Svar: ca. 22 % av beholderne ligger i intervallet.


## Vanlige feil

- Bytter om \`z_a\` og \`z_b\`: får negativt svar. Husk at den ØVRE grensen \`b\` skal stå først.
- Glemmer å standardisere én av grensene.
- Avrunder \`z\` for tidlig eller for grovt. Hold 2 desimaler i \`z\` og minst 4 i \`G(z)\`.

> [!note] Siden \`X\` er kontinuerlig er \`<\` og \`≤\` likeverdige ved grensene. \`P(305 < X ≤ 310) = P(305 ≤ X ≤ 310) = P(305 < X < 310)\`.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-lt-x",
        },
        {
          kind: "table",
          id: "E3-z-tabell",
        },
        {
          kind: "glossary",
          id: "kumulativ",
        },
      ],
    },
    {
      id: "inverse-x",
      name: "Finn x for sannsynlighet",
      formula: "x = μ + σ · z,  der G(z) = p",
      short: `Gitt en sannsynlighet \`p\`, finn terskelen \`x\`. Bruk z-kvantiltabellen E.4.`,
      long: `Den inverse varianten snur problemet: i stedet for å regne ut en sannsynlighet for et gitt \`x\`, leter du etter terskelen \`x\` som tilfredsstiller en gitt sannsynlighet \`p\`. Strategien er å slå opp kvantilet \`z\` i tabell E.4 og deretter sette inn i \`x = μ + σ · z\`.

> [!read] x = μ + σ · z  der G(z) = p
> «Snu standardiseringen»: gå fra kvantilet \`z\` til den opprinnelige skalaen via \`μ\` og \`σ\`.


## Tabell E.4 vs. E.3

- E.3 (kumulativ): «gitt \`z\`, finn \`G(z) = p\`».
- E.4 (kvantil): «gitt \`p\`, finn \`z\` slik at \`G(z) = p\`».

Til inverse oppgaver er E.4 raskest. Hvis du bare har E.3, leser du den «baklengs» (let etter \`p\` i kroppen, les av \`z\` i kanten).

> [!tip] De vanligste kvantilene utenat: \`z_{0.95} = 1.645\`, \`z_{0.975} = 1.96\`, \`z_{0.99} = 2.326\`, \`z_{0.995} = 2.576\`. Disse dukker opp i alle konfidensintervaller.


## Konkret eksempel

\`X ~ N(60, 5²)\`. Finn \`x\` slik at \`P(X ≤ x) = 0.95\`.

1. Identifisering: \`μ = 60\`, \`σ = 5\`, mål \`p = 0.95\`.
2. Slå opp i E.4:

        G(z) = 0.95 ⇒ z = 1.645

3. Sett inn:

        x = μ + σ · z = 60 + 5 · 1.645
          = 60 + 8.225
          ≈ 68.23

Svar: 95 % av X-verdiene ligger under \`x ≈ 68.23\`.


## Negativ \`z\` ved venstre hale

Hvis \`p < 0.5\` ligger \`x\` til VENSTRE for \`μ\`, og \`z\` blir negativ. Du finner den enten ved refleksjon (\`z = −z_{1−p}\`) eller direkte i E.4.

F.eks. \`X ~ N(170, 6²)\`, søker \`P(X ≤ x) = 0.10\`:

        z = −1.282 (siden 0.10 < 0.5)
        x = 170 + 6 · (−1.282) ≈ 162.3 cm

> [!note] Sanity-sjekk: \`p < 0.5 ⇒ x < μ\`, og \`p > 0.5 ⇒ x > μ\`. Stemmer det ikke, har du glemt fortegnet på \`z\`.
`,
      see_also: [
        {
          kind: "table",
          id: "E4-z-kvantiltabell",
        },
        {
          kind: "glossary",
          id: "kvantil",
        },
        {
          kind: "glossary",
          id: "alpha",
        },
      ],
    },
    {
      id: "inverse-mu-sigma",
      name: "Finn μ eller σ",
      formula: "G((g − μ)/σ) = p  ⇒  μ = g − σ · z   eller  σ = (g − μ)/z",
      short: `Gitt en grense \`g\` og målsannsynlighet \`p\`, finn parameteren som mangler.`,
      long: `Når oppgaven gir en grense \`g\`, en målsannsynlighet \`p\`, og én av parameterne (\`μ\` eller \`σ\`), løser du for den andre. Likningen kommer fra standardisering: \`G((g − μ)/σ) = p\`. Slå opp \`z = G⁻¹(p)\` i E.4 og løs algebraisk.

> [!read] G((g − μ)/σ) = p  ⇒  (g − μ)/σ = z
> «Sett inn z fra E.4 og løs ut det ukjente.»


## To varianter

**Finn \`μ\` (kjent \`σ\`):**

        μ = g − σ · z

**Finn \`σ\` (kjent \`μ\`):**

        σ = (g − μ) / z

I begge tilfeller er det fortegnet på \`z\` som er kritisk: \`p < 0.5\` gir negativ \`z\`, \`p > 0.5\` gir positiv \`z\`.

> [!tip] Retningssjekk for \`μ\`: hvis du vil at \`P(X < g)\` skal bli MINDRE, må \`μ\` flyttes OPP (lengre fra \`g\` på høyre side). Tenk på det fysisk før du regner.


## Konkret eksempel

Standardavviket er \`σ = 5\` ml. Hva må forventningsverdien \`μ\` være for at \`P(X < 300) < 0.001\`?

1. Sett likhet i grenseverdien: \`P(X < 300) = 0.001\`, dvs. \`G((300 − μ)/5) = 0.001\`.
2. Slå opp i E.4:

        G(z) = 0.001 ⇒ z = −3.090

3. Sett inn:

        300 = μ + 5 · (−3.090) = μ − 15.45
        μ = 300 + 15.45 = 315.45

Svar: \`μ ≥ 315.45\` ml gir \`P(X < 300) < 0.001\`.


## Variant: finn \`σ\`

\`X ~ N(50, σ²)\` med kjent \`μ = 50\`. Hvor stor må \`σ\` være for at \`P(X < 40) = 0.05\`?

        G((40 − 50)/σ) = 0.05
        z = −1.645
        −10/σ = −1.645
        σ = 10/1.645 ≈ 6.08

La merke til: større \`σ\` gir bredere fordeling, og dermed høyere \`P(X < 40)\`. Det stemmer med intuisjonen.

> [!note] Pass på fortegn: hvis du «glemmer» minustegnet på \`z\` for \`p < 0.5\`, ender du med negativ \`σ\`, som er umulig. Det er en grei feilsjekk.
`,
      see_also: [
        {
          kind: "formula",
          ref: "inverse-x",
        },
        {
          kind: "table",
          id: "E4-z-kvantiltabell",
        },
        {
          kind: "glossary",
          id: "mu",
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
    {
      id: "antall-sekvenser",
      name: "Antall mulige sekvenser",
      abbreviation: "n^k",
      formula: "|Ω| = n^k",
      short: `Total størrelse på utfallsrommet når hver av \`k\` posisjoner uavhengig kan fylles med en av \`n\` verdier.`,
      long: `\`n^k\` er størrelsen på utfallsrommet \`Ω\` når du lager en ordnet sekvens av lengde \`k\` og hver posisjon har \`n\` mulige verdier, med gjentakelse tillatt.


## Hvordan lese formelen

> [!read] |Ω| = n · n · ... · n = n^k
> Multiplikasjonsprinsippet: \`n\` valg på posisjon 1, \`n\` valg på posisjon 2, og slik videre \`k\` ganger fordi forsøkene er uavhengige.

At det er «med tilbakelegging» betyr at en verdi ikke brukes opp etter at den er valgt. Posisjon 2 har derfor like mange valg som posisjon 1.


## Når brukes \`n^k\`?

- PIN-koder, passord og andre kodesekvenser der hver plass er fri
- Gjentatte uavhengige forsøk med fast antall utfall (myntkast, terningkast)
- Funksjoner fra en mengde på \`k\` elementer til en mengde på \`n\` (hvert «inn» kan velge fritt blant \`n\` «ut»)

> [!tip] Se nøye etter rekkefølgen av \`n\` og \`k\`. PIN med 4 sifre er \`10^4 = 10 000\`, ikke \`4^10 ≈ 1.05 mill\`.


## Eksempel: PIN-kode og myntkast

Fire-sifret PIN-kode med sifre \`0\` til \`9\` gir \`n = 10\` og \`k = 4\`:

    |Ω| = 10^4 = 10 000 mulige koder

Kast en mynt 8 ganger og noter sekvensen av kron og mynt: \`n = 2\`, \`k = 8\`:

    |Ω| = 2^8 = 256 mulige sekvenser

Sekssidet terning kastet tre ganger: \`n = 6\`, \`k = 3\` gir \`6^3 = 216\` mulige tripler.
`,
      see_also: [
        {
          kind: "glossary",
          id: "multiplikasjonsprinsippet",
        },
        {
          kind: "glossary",
          id: "med-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "ordnet-utvalg",
        },
      ],
    },
    {
      id: "p-spesifikk-sekvens",
      name: "Sannsynlighet for spesifikk sekvens",
      abbreviation: "1/n^k",
      formula: "P(spesifikk sekvens) = 1 / n^k",
      short: `Når alle \`n^k\` sekvenser er like sannsynlige, har én bestemt sekvens sannsynlighet \`1/n^k\`.`,
      long: `Når utfallsrommet er uniformt og inneholder \`n^k\` like sannsynlige sekvenser, gir gunstige på mulige umiddelbart at én bestemt sekvens har sannsynlighet \`1/n^k\`.


## Hvordan lese formelen

> [!read] P(spesifikk sekvens) = 1 / n^k
> Telleren er 1 fordi vi peker på akkurat én sekvens. Nevneren er totalt antall mulige sekvenser fra \`n^k\`-formelen.

Dette forutsetter at hver enkelt sekvens er like sannsynlig. For uavhengige forsøk med samme suksessannsynlighet \`p = 1/n\` på hver posisjon stemmer det automatisk: produktregelen gir \`(1/n)^k = 1/n^k\`.


## Generalisering til mønster

Hvis du i stedet spør om antall sekvenser som passer et mønster (f.eks. «første siffer er 7»), bruker du gunstige på mulige med \`n^k\` i nevneren:

> [!read] P(A) = (antall gunstige sekvenser) / n^k
> Tell hvor mange sekvenser som matcher mønsteret, og del på det totale antallet \`n^k\`.

> [!tip] Pass på at både teller og nevner er talt som ordnede sekvenser. Hvis du blander uordnet og ordnet, dobbeltteller du eller deler feil.


## Eksempel: PIN og terningkast

Sannsynligheten for at en tilfeldig 4-sifret PIN-kode er akkurat \`1234\`:

    P(PIN = 1234) = 1 / 10^4 = 1 / 10 000 = 0.0001

Kast tre terninger og spør om sekvensen \`(6, 6, 6)\` i akkurat denne rekkefølgen:

    P((6, 6, 6)) = 1 / 6^3 = 1 / 216 ≈ 0.00463

Fire myntkast og sekvensen kron, mynt, kron, mynt:

    P(K, M, K, M) = 1 / 2^4 = 1 / 16 = 0.0625
`,
      see_also: [
        {
          kind: "entry",
          id: "gunstige-pa-mulige",
        },
        {
          kind: "glossary",
          id: "med-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "multiplikasjonsprinsippet",
        },
      ],
    },
    {
      id: "p-minst-en",
      name: "Sannsynlighet for «minst én»",
      abbreviation: "1 − q^k",
      formula: "P(minst én X) = 1 − ((n − 1)/n)^k",
      short: `Komplementtrikset: regn ut sannsynligheten for «ingen X i \`k\` forsøk» og trekk fra 1.`,
      long: `Når du gjentar et uavhengig forsøk \`k\` ganger og lurer på «minst én X», er det nesten alltid lettere å regne ut komplementet «ingen X» og trekke fra 1.


## Hvordan lese formelen

La \`p = 1/n\` være sannsynligheten for «X» i ett enkelt forsøk og \`q = (n − 1)/n\` være sannsynligheten for «ikke X».

> [!read] P(minst én X) = 1 − q^k = 1 − ((n − 1)/n)^k
> Komplementet «ingen X i \`k\` forsøk» har sannsynlighet \`q^k\` siden forsøkene er uavhengige (med tilbakelegging). Minst én er da bare 1 minus dette.

Med generell suksessannsynlighet \`p\` per forsøk blir formelen \`1 − (1 − p)^k\`.


## Hvorfor komplementet?

Å telle «minst én» direkte krever at du legger sammen sannsynlighetene for nøyaktig 1, nøyaktig 2, og så videre opp til \`k\`. Det blir fort tungt. Komplementet «ingen» er ett enkelt produkt og holder.

> [!tip] Sjekk svaret med en grov fornuftssjekk: når \`k\` vokser, skal \`P(minst én X)\` nærme seg 1, ikke 0.


## Eksempel: terninger og bursdagshell

Kast en terning 6 ganger. Hva er sannsynligheten for minst én sekser? Her er \`n = 6\` og \`k = 6\`:

    P(ingen sekser)    = (5/6)^6 ≈ 0.3349
    P(minst én sekser) = 1 − (5/6)^6 ≈ 0.6651

Kast 4 myntkast og spør om minst én kron (\`p = 1/2\`, \`k = 4\`):

    P(minst én kron) = 1 − (1/2)^4 = 1 − 1/16 = 15/16 = 0.9375

Sjekk en 4-sifret PIN-kode: hva er sannsynligheten for minst ett \`7\`? Med \`n = 10\`, \`k = 4\`:

    P(minst ett 7) = 1 − (9/10)^4 = 1 − 0.6561 = 0.3439
`,
      see_also: [
        {
          kind: "entry",
          id: "gunstige-pa-mulige",
        },
        {
          kind: "glossary",
          id: "med-tilbakelegging",
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
    {
      id: "antall-ordnede-utvalg",
      name: "Antall ordnede utvalg",
      abbreviation: "P(n,k)",
      formula: "P(n, k) = n! / (n − k)!",
      short: `Antall ordnede utvalg av \`k\` ulike elementer fra \`n\`, der rekkefølgen teller og hvert element brukes høyst én gang.`,
      long: `\`P(n, k)\` teller antall ordnede sekvenser av lengde \`k\` du kan lage fra \`n\` ulike elementer uten gjentakelse. Brukes når \`k < n\` og rekkefølgen i utvalget faktisk betyr noe.


## Hvordan lese formelen

> [!read] P(n, k) = n · (n − 1) · ... · (n − k + 1) = n! / (n − k)!
> Posisjon 1 har \`n\` valg, posisjon 2 har \`n − 1\` (ett er brukt opp), og slik nedover til posisjon \`k\` med \`n − k + 1\` valg igjen. Produktet er \`n!/(n − k)!\`.

Kjenneteg du må sjekke før du bruker formelen:

- \`k\` ulike posisjoner i en sekvens
- Rekkefølgen teller (gull, sølv, bronse er ulike posisjoner)
- Uten tilbakelegging (samme element brukes ikke to ganger)


## Sammenheng med andre tellinger

Hvis rekkefølgen ikke teller, deler du på \`k!\` og får binomialkoeffisienten \`C(n, k) = P(n, k) / k!\`. Hvis du tillater gjentakelse, går du til \`n^k\` i stedet.

> [!tip] Når \`k = 1\` blir \`P(n, 1) = n\`, og når \`k = n\` blir det \`n!\` (alle elementene på rekke). Bruk dette som rask sanity-sjekk.


## Eksempel: medaljer og lottoplasser

Gull, sølv og bronse blant 10 deltakere: \`n = 10\`, \`k = 3\`.

    P(10, 3) = 10 · 9 · 8 = 720 mulige medaljefordelinger

Trekk 3 kort fra en stokk på 52 kort der rekkefølgen teller:

    P(52, 3) = 52 · 51 · 50 = 132 600 mulige sekvenser

Fordel topp-5-plasseringer i et løp med 12 utøvere:

    P(12, 5) = 12 · 11 · 10 · 9 · 8 = 95 040
`,
      see_also: [
        {
          kind: "entry",
          id: "uordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "ordnet-utvalg",
        },
        {
          kind: "glossary",
          id: "uten-tilbakelegging-glos",
        },
      ],
    },
    {
      id: "hele-permutasjoner",
      name: "Hele permutasjoner (k = n)",
      abbreviation: "n!",
      formula: "P(n, n) = n!",
      short: `Antall måter å stille \`n\` ulike elementer på rekke. Spesialtilfellet av \`P(n, k)\` med \`k = n\`.`,
      long: `Når du bruker hele utvalget på rekke, blir \`P(n, k)\` til \`n!\`. Dette er antall ulike permutasjoner av \`n\` ulike elementer.


## Hvorfor blir det \`n!\`?

> [!read] P(n, n) = n! / (n − n)! = n! / 0! = n!
> Per konvensjon er \`0! = 1\`, så \`n!/(n − n)!\` reduserer pent til \`n!\`. Tolkningen er at posisjon 1 har \`n\` valg, posisjon 2 har \`n − 1\`, helt ned til siste posisjon som har 1 valg igjen.

Fakultetfunksjonen vokser veldig raskt. Som tommelfingerregel:

- \`5! = 120\`
- \`10! = 3 628 800\`
- \`15! ≈ 1.31 · 10^12\`


## Når dukker \`n!\` opp?

- Stille \`n\` personer i kø eller \`n\` bøker på en hylle
- Telle alle hånd-rekkefølger av \`k\` kort i en bestemt hånd (\`k!\` der)
- Bytte fra ordnet til uordnet utvalg: \`C(n, k) = P(n, k) / k!\`

> [!tip] Hvis to elementer er like, regnes ikke alle \`n!\` ordninger som ulike. Da må du dele på fakultetene til hver gruppe like elementer (multinomial-tellingen).


## Eksempel: bokhylle og terningrekkefølger

Fem ulike bøker på en hylle: \`n = 5\`.

    P(5, 5) = 5! = 120 mulige rekkefølger

Stokk en kortstokk på 52 ulike kort. Antall mulige stokkinger er astronomisk:

    P(52, 52) = 52! ≈ 8.07 · 10^67

Det er flere enn antall atomer på jorden, og forklarer hvorfor en godt stokket stokk i praksis aldri har vært i akkurat samme rekkefølge før.
`,
      see_also: [
        {
          kind: "entry",
          id: "uordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "ordnet-utvalg",
        },
        {
          kind: "glossary",
          id: "multiplikasjonsprinsippet",
        },
      ],
    },
    {
      id: "p-spesifikk-ordnet",
      name: "Sannsynlighet for spesifikk ordnet sekvens",
      abbreviation: "1/P(n,k)",
      formula: "P(spesifikk sekvens) = 1 / P(n, k) = (n − k)! / n!",
      short: `Når alle ordnede utvalg er like sannsynlige, har én bestemt sekvens uten tilbakelegging sannsynlighet \`1/P(n, k)\`.`,
      long: `Når alle \`P(n, k)\` ordnede sekvenser uten tilbakelegging er like sannsynlige, gir gunstige på mulige direkte at én bestemt sekvens har sannsynlighet \`1/P(n, k)\`.


## Hvordan lese formelen

> [!read] P(spesifikk sekvens) = 1 / P(n, k) = (n − k)! / n!
> Telleren er 1 fordi vi peker på én bestemt rekkefølge. Nevneren er antall mulige ordnede utvalg uten tilbakelegging.

Uttrykt som produkt blir det også klart hvorfor sannsynligheten er som den er:

    P(spesifikk sekvens) = (1/n) · (1/(n − 1)) · ... · (1/(n − k + 1))

Først skal vi treffe det riktige elementet av \`n\`, så det riktige av de \`n − 1\` som er igjen, og slik videre.


## Forskjellen fra «med tilbakelegging»

> [!tip] \`1/P(n, k)\` er strengere enn \`1/n^k\` så lenge \`k > 1\`. Uten tilbakelegging blir det færre mulige sekvenser, så hver enkelt sekvens får større sannsynlighet enn den ville fått med tilbakelegging.

For eksempel: spesifikk sekvens av 3 kort fra en stokk på 52 har sannsynlighet \`1/132 600\` uten tilbakelegging, men \`1/52^3 = 1/140 608\` med tilbakelegging.


## Eksempel: medaljer og kortrekkefølge

Gull, sølv og bronse blant 10 deltakere. Hva er sannsynligheten for at akkurat Ada, Bob og Carl tar plassene i den rekkefølgen?

    P(spesifikk medaljerekkefølge) = 1 / P(10, 3) = 1 / 720 ≈ 0.00139

Trekk 3 kort fra en kortstokk i denne rekkefølgen: spar ess, så hjerter dame, så kløver 7.

    P(spesifikk rekkefølge) = 1 / P(52, 3) = 1 / 132 600 ≈ 7.54 · 10^(−6)

Trekk 5 kort i en bestemt rekkefølge:

    P(spesifikk 5-rekkefølge) = 1 / P(52, 5) = 1 / 311 875 200
`,
      see_also: [
        {
          kind: "entry",
          id: "gunstige-pa-mulige",
        },
        {
          kind: "entry",
          id: "uordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "uten-tilbakelegging-glos",
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
    {
      id: "cdf-le-k",
      name: "Kumulativ sannsynlighet",
      abbreviation: "P(X ≤ k)",
      formula: "P(X ≤ k) = Σ e^(-μ) · μ^i / i!  for i = 0..k",
      short: `«Høyst \`k\` hendelser». Slå opp direkte i tabell E.2.`,
      long: `\`P(X ≤ k)\` er den kumulative sannsynligheten for at antall hendelser i vinduet er HØYST \`k\`. Dette er nettopp formen tabell E.2 leser direkte, så du slipper å summere punktsannsynligheter for hånd.

> [!read] P(X ≤ k) = P(X = 0) + P(X = 1) + ... + P(X = k)
> Summen av alle punktsannsynligheter opp til og med \`k\`. Dette er det E.2 har regnet ut for deg.


## Når dukker den opp?

Formuleringer som peker mot \`P(X ≤ k)\`:

- «høyst \`k\`», «ikke mer enn \`k\`», «\`k\` eller færre»
- «maks \`k\` hendelser i vinduet»
- «sannsynligheten for at det kommer opptil \`k\`»

> [!tip] Trenger du «MINST \`k\`» eller «NØYAKTIG \`k\`», bruker du E.2 indirekte: «minst» via komplement på \`k − 1\`, og «nøyaktig» via differansen \`P(X ≤ k) − P(X ≤ k − 1)\`.


## Konkret eksempel

Defekter på et samlebånd inntreffer som en poissonprosess med rate \`λ = 0.5\` pr. time. På et 4-timers skift er \`μ = λt = 2\`. Finn sannsynligheten for høyst én defekt i skiftet.

1. Identifisering: \`μ = 2\`, spørres om \`P(X ≤ 1)\`.
2. Slå opp i E.2 med kolonne \`μ = 2\`, rad \`k = 1\`.

        P(X ≤ 1) ≈ 0.406

Verifisering for hånd: \`e^(-2)(1 + 2) = 0.1353 · 3 ≈ 0.406\`.

Svar: ca. 41 % sjanse for høyst én defekt på skiftet.


## Når \`μ\` ikke står i tabellen

E.2 lister \`μ\` i runde steg. Hvis verdien din ligger mellom to oppslag:

- For grove svar: rund til nærmeste tabellverdi og noter avviket.
- For nøyaktige svar: regn summen \`Σ e^(-μ) μ^i / i!\` for \`i = 0..k\` på kalkulator.

> [!note] Sjekk at \`λ\` og \`t\` har samme tidsenhet før du regner \`μ\`. Rate pr. time mot vindu i minutter er en klassisk feilkilde.
`,
      see_also: [
        {
          kind: "formula",
          ref: "pmf",
        },
        {
          kind: "table",
          id: "E2-poisson-kumulativ",
        },
        {
          kind: "glossary",
          id: "kumulativ",
        },
      ],
    },
    {
      id: "cdf-ge-k",
      name: "Komplement: minst k",
      abbreviation: "P(X ≥ k)",
      formula: "P(X ≥ k) = 1 − P(X ≤ k − 1)",
      short: `«Minst \`k\` hendelser». Komplement av kumulativ, med trapp på \`k − 1\`.`,
      long: `\`P(X ≥ k)\` finnes ikke direkte i tabell E.2. I stedet skriver vi det om via komplement og slår opp \`P(X ≤ k − 1)\`. Det avgjørende er at trappen i tabellen er på \`k − 1\`, ikke på \`k\`.

> [!read] P(X ≥ k) = 1 − P(X ≤ k − 1)
> Sannsynligheten for «minst \`k\`» er én minus sannsynligheten for «høyst \`k − 1\`». Pass på indekssprang.


## Hvorfor \`k − 1\`?

Hendelsen «\`X ≥ k\`» og hendelsen «\`X ≤ k − 1\`» er hverandres komplement: enten har du minst \`k\`, ellers har du høyst \`k − 1\`. Setter du \`P(X ≤ k)\` i stedet, mister du bidraget fra \`X = k\` selv og svaret blir for lavt.

> [!note] Klassisk feil: «\`P(X ≥ 3) = 1 − P(X ≤ 3)\`». Det er feil. Korrekt: «\`P(X ≥ 3) = 1 − P(X ≤ 2)\`».


## Konkret eksempel

Et kundesenter har \`μ = 4\` anrop i et gitt tidsvindu. Finn sannsynligheten for minst 6 anrop.

1. Identifisering: \`μ = 4\`, \`k = 6\`.
2. Skriv om: \`P(X ≥ 6) = 1 − P(X ≤ 5)\`.
3. Slå opp i E.2 (kolonne \`μ = 4\`, rad \`k = 5\`):

        P(X ≤ 5) ≈ 0.785
        P(X ≥ 6) = 1 − 0.785 ≈ 0.215

Svar: ca. 22 % sjanse for minst seks anrop.


## Spesialtilfelle: minst én

For \`k = 1\` faller utregningen sammen med den enkle formelen for «ingen»:

        P(X ≥ 1) = 1 − P(X = 0) = 1 − e^(-μ)

> [!tip] «Sannsynligheten for at det skjer noe i det hele tatt» er alltid \`1 − e^(-μ)\`. Det er den vanligste varianten i pensum og dukker opp både i poisson- og eksponentialspørsmål.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-le-k",
        },
        {
          kind: "entry",
          id: "komplementregelen",
        },
        {
          kind: "table",
          id: "E2-poisson-kumulativ",
        },
      ],
    },
    {
      id: "interval-ab",
      name: "Intervall via to oppslag",
      abbreviation: "P(a ≤ X ≤ b)",
      formula: "P(a ≤ X ≤ b) = P(X ≤ b) − P(X ≤ a − 1)",
      short: `«Mellom \`a\` og \`b\` hendelser». Differanse av to kumulative oppslag.`,
      long: `Når oppgaven ber om antall hendelser i et intervall, regner du differansen mellom to kumulative oppslag i E.2. Den eneste fellen er at nedre grense slås opp på \`a − 1\`, ikke på \`a\` selv, ellers mister du bidraget fra \`X = a\`.

> [!read] P(a ≤ X ≤ b) = P(X ≤ b) − P(X ≤ a − 1)
> Trekk fra ALT som ligger UNDER \`a\`, ikke alt som ligger «opp til og med \`a\`».


## Når dukker den opp?

Formuleringer som peker mot intervall:

- «mellom \`a\` og \`b\` (begge inkludert)»
- «\`a\` eller \`b\`», «ett eller to»
- «minst \`a\`, høyst \`b\`»

> [!note] Hvis spørsmålet bruker «strikte» grenser, f.eks. «mer enn \`a\`, mindre enn \`b\`», justerer du til \`P(a + 1 ≤ X ≤ b − 1)\` siden \`X\` er heltall.


## Konkret eksempel

En forsker observerer en sjelden type stjerneskudd som inntreffer med rate \`λ = 0.05\` pr. natt. Finn sannsynligheten for ett eller to slike stjerneskudd i løpet av en sesong på 60 netter.

1. Identifisering: \`μ = λt = 0.05 · 60 = 3\`. Spørres om \`P(1 ≤ X ≤ 2)\`.
2. Skriv om: \`P(1 ≤ X ≤ 2) = P(X ≤ 2) − P(X ≤ 0)\`.
3. Slå opp i E.2 (kolonne \`μ = 3\`):

        P(X ≤ 2) ≈ 0.4232
        P(X ≤ 0) ≈ 0.0498
        P(1 ≤ X ≤ 2) = 0.4232 − 0.0498 ≈ 0.373

Verifisering: \`P(X = 1) + P(X = 2) ≈ 0.1494 + 0.2240 ≈ 0.3734\`.

Svar: ca. 37 % sjanse for ett eller to stjerneskudd i sesongen.


## Sjekk fornuften

Svaret må være positivt og mindre enn både \`P(X ≤ b)\` og \`P(X ≥ a)\` hver for seg. Får du negativt resultat har du byttet om grensene eller glemt å trekke fra på \`a − 1\`.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-le-k",
        },
        {
          kind: "table",
          id: "E2-poisson-kumulativ",
        },
        {
          kind: "glossary",
          id: "kumulativ",
        },
      ],
    },
    {
      id: "p-x-zero",
      name: "Ingen hendelser",
      abbreviation: "P(X = 0)",
      formula: "P(X = 0) = e^(-μ)",
      short: `Spesialtilfellet «ingen hendelser». Hele formelen kollapser til \`e^(-μ)\`.`,
      long: `Når oppgaven spør om sannsynligheten for null hendelser, kollapser punktformelen helt: \`μ⁰ = 1\` og \`0! = 1\`, så det eneste som står igjen er \`e^(-μ)\`. Du trenger ingen tabell og ingen kalkulator utover eksponentialfunksjonen.

> [!read] P(X = 0) = e^(-μ)
> Sannsynligheten for at INGEN hendelser inntreffer i vinduet med forventet antall \`μ\`.


## Når dukker den opp?

Formuleringer som signaliserer \`P(X = 0)\`:

- «ingen hendelser», «null utbrudd»
- «ikke finne noen», «tom felle»
- «fri for», «går klar»

> [!tip] «Minst én hendelse» er nettopp komplementet: \`P(X ≥ 1) = 1 − e^(-μ)\`. Disse to oppgavene ligger ofte side om side i pensum.


## Konkret eksempel

Et kundesenter har rate \`λ = 2\` anrop pr. time. Finn sannsynligheten for ingen anrop i løpet av én time.

1. Identifisering: \`λ = 2\`, \`t = 1\`, \`μ = λt = 2\`.
2. Bruk forenklet formel: \`P(X = 0) = e^(-2)\`.

        P(X = 0) = e^(-2) ≈ 0.1353

Svar: ca. 14 % sjanse for ingen anrop.


## Bro til eksponentialfordelingen

Det er ingen tilfeldighet at \`P(X = 0) = e^(-μ)\` ser identisk ut med overlevelsesformelen for ventetiden:

        P(T > t) = e^(-λt)

De to spørsmålene «ingen hendelser i vinduet \`[0, t]\`» og «ventetiden er lengre enn \`t\`» er nemlig samme hendelse. Bytter du mellom poisson og eksponential, sjekk at konklusjonen er konsistent.

> [!note] Pass på enheten på \`μ\`: er raten oppgitt pr. time men vinduet er en uke, må du gange opp først (\`μ = 0.01 · 168 = 1.68\`).
`,
      see_also: [
        {
          kind: "formula",
          ref: "pmf",
        },
        {
          kind: "entry",
          id: "eksponential-fordeling",
        },
        {
          kind: "glossary",
          id: "poisson-prosess",
        },
      ],
    },
    {
      id: "find-k-threshold",
      name: "Finn k for terskel",
      formula: `Minste \`k\` slik at P(X ≥ k) ≤ p_terskel  (eller P(X ≤ k) ≥ p_terskel)`,
      short: `Gitt en sannsynlighetsterskel: hvilken verdi \`k\` tilfredsstiller den?`,
      long: `Den «inverse» varianten snur problemet: i stedet for å regne ut en sannsynlighet, leter du etter den minste (eller største) \`k\` som tilfredsstiller en gitt terskel \`p_terskel\`. Strategien er å bygge en liten tabell over \`P(X ≤ k)\` fra E.2 og lese av når kravet snus.

> [!read] Finn minste \`k\` slik at P(X ≥ k) ≤ p_terskel
> Ekvivalent med: finn minste \`k\` slik at \`P(X ≤ k − 1) ≥ 1 − p_terskel\`. Søk fra venstre i tabellen.


## Strategi

1. Skriv om kravet til en kumulativ form (typisk \`P(X ≤ k − 1) ≥ 1 − p_terskel\`).
2. Lag en kort tabell med \`k = 0, 1, 2, ...\` og \`P(X ≤ k)\` fra E.2.
3. Les av det første \`k\` som tilfredsstiller ulikheten.
4. Vær obs på om kravet er strikt (\`<\`) eller ikke-strikt (\`≤\`); det kan endre svaret med én.

> [!tip] Utgangspunktet er ofte rett over \`μ\`. Sjekk at du har gått langt nok forbi til at halen virkelig er liten nok; ikke stopp ved første verdi som «føles» riktig.


## Konkret eksempel

Et forsikringsselskap mottar \`μ = 5\` krav pr. uke. Finn minste \`k\` slik at \`P(X ≥ k) < 0.05\`.

Kravet skrives om: \`P(X ≥ k) = 1 − P(X ≤ k − 1) < 0.05\`, dvs. \`P(X ≤ k − 1) > 0.95\`.

Slå opp i E.2 med \`μ = 5\`:

        k = 8 → P(X ≤ 8) = 0.932    (P(X ≥ 9) = 0.068, for høyt)
        k = 9 → P(X ≤ 9) = 0.968    (P(X ≥ 10) = 0.032 < 0.05 ✓)

Svar: minste \`k\` er \`10\`, med \`P(X ≥ 10) ≈ 0.032\`.


## Når tabellen tar slutt

E.2 dekker gjerne \`k\` opp til 15 eller 20 for hver \`μ\`. Hvis ingen rad tilfredsstiller terskelen, må du enten utvide manuelt med pmf-formelen, eller konkludere at hendelsen er praktisk umulig (eller sikker) i det aktuelle vinduet.

> [!note] Skriv alltid svaret med ord («minste \`k\` er ...») og oppgi den tilhørende sannsynligheten som dokumentasjon, slik at sensor ser at du har sjekket grenseverdien.
`,
      see_also: [
        {
          kind: "formula",
          ref: "cdf-ge-k",
        },
        {
          kind: "table",
          id: "E2-poisson-kumulativ",
        },
        {
          kind: "glossary",
          id: "kumulativ",
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
    {
      id: "produkt-snitt",
      name: "Snitt P(A ∩ B) forover",
      abbreviation: "SNITT",
      formula: "P(A ∩ B) = P(A) · P(B | A)",
      short: `Sannsynlighet for at både \`A\` og \`B\` skjer, regnet sekvensielt.`,
      long: `Forover-varianten av produktregelen brukes når oppgaven har to hendelser som skjer i sekvens, eller når du har en betinget sannsynlighet og en marginal og vil regne ut snittet.


## Sekvensiell lesning

> [!read] P(A ∩ B) = P(A) · P(B | A)
> «Sannsynlighet for første hendelse, ganger sannsynlighet for andre hendelse gitt at første har skjedd.»

For uavhengige hendelser forenkles regelen til

    P(A ∩ B) = P(A) · P(B)

fordi \`P(B | A) = P(B)\` når \`A\` ikke gir informasjon om \`B\`.


## Konkret eksempel: avhengige trekninger

En urne har 5 røde og 3 hvite kuler. Vi trekker to kuler uten tilbakelegging. Hva er sannsynligheten for to røde?

La \`A\` = «første rød», \`B\` = «andre rød». Hendelsene er avhengige (urnen endrer seg etter første trekning).

    P(A) = 5/8                 (5 røde av 8 totalt)
    P(B | A) = 4/7             (4 røde igjen av 7)
    P(A ∩ B) = (5/8) · (4/7) = 20/56 = 5/14 ≈ 0.357


## Konkret eksempel: uavhengige hendelser

Kast en mynt og en terning samtidig. Sannsynlighet for «krone OG sekser»?

    P(krone) · P(sekser) = (1/2) · (1/6) = 1/12 ≈ 0.083

> [!tip] Sjekk fornuft: \`P(A ∩ B)\` skal alltid være mindre enn både \`P(A)\` og \`P(B)\`, fordi snittet er en delmengde av hver av dem.
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
    {
      id: "produkt-betinget-direkte",
      name: "Betinget P(A | B) direkte",
      abbreviation: "BET",
      formula: "P(A | B) = P(A ∩ B) / P(B)",
      short: "Definisjonen omskrevet: del snittet på betingelsens sannsynlighet.",
      long: `Når du har snittet \`P(A ∩ B)\` og marginalen \`P(B)\`, faller den betingede ut direkte fra definisjonen, uten Bayes.


## Definisjonen

> [!read] P(A | B) = P(A ∩ B) / P(B)
> Sannsynligheten for \`A\` gitt \`B\` er andelen av \`B\`-utfallene som også er \`A\`-utfall, forutsatt \`P(B) > 0\`.

Dette er bare omskrivningen av produktregelen \`P(A ∩ B) = P(B) · P(A | B)\`. Bytter du om sider, får du definisjonen.


## Konkret eksempel: matte og fysikk

Blant studentene tar 45 % fysikk («\`F\`»), 80 % matte («\`M\`»), og 41 % tar begge («\`P(F ∩ M) = 0.41\`»). Gitt at en student tar fysikk, hva er sannsynligheten for at de også tar matte?

    P(M | F) = P(F ∩ M) / P(F)
             = 0.41 / 0.45
             ≈ 0.911

Altså 91.1 % av fysikkstudentene tar også matte.


## Når snittet ikke er gitt

Hvis \`P(A ∩ B)\` ikke er gitt eksplisitt, må du regne det først. Vanlige veier:

- Produktregelen forover, hvis du har \`P(A)\` og \`P(B | A)\`.
- Total sannsynlighet, hvis du har en partisjon.
- Venndiagram, hvis du har \`P(A)\`, \`P(B)\` og \`P(A ∪ B)\`: da er \`P(A ∩ B) = P(A) + P(B) − P(A ∪ B)\`.

> [!tip] Hvis oppgaven gir motsatt retning «\`P(B | A)\`» og du vil ha «\`P(A | B)\`», trenger du Bayes' setning, ikke definisjonen alene.
`,
      see_also: [
        {
          kind: "glossary",
          id: "betinget-sannsynlighet-glos",
        },
        {
          kind: "entry",
          id: "bayes-setning",
        },
        {
          kind: "entry",
          id: "total-sannsynlighet",
        },
      ],
    },
    {
      id: "produkt-uavhengighet-test",
      name: "Test om A og B er uavhengige",
      abbreviation: "INDEP",
      formula: "A ⫫ B  ⇔  P(A ∩ B) = P(A) · P(B)",
      short: "Sammenlign produkt av marginaler med faktisk snitt. Like: uavhengige.",
      long: `Uavhengighet er en ren regnetest, ikke et skjønn. Hendelsene \`A\` og \`B\` er uavhengige hvis og bare hvis snittet faktoriserer som produktet av marginalene.


## Definisjonen

> [!read] A og B er uavhengige  ⇔  P(A ∩ B) = P(A) · P(B)
> Hvis snittet er nøyaktig produktet av marginalene, gir den ene hendelsen ingen informasjon om den andre.

En ekvivalent formulering:

    P(A | B) = P(A)   (eller tilsvarende P(B | A) = P(B))

Har du allerede betinget sannsynlighet, sjekk om den er lik den ubetingede.


## Konkret eksempel: matte og fysikk

Fra forrige variant: \`P(F) = 0.45\`, \`P(M) = 0.80\`, \`P(F ∩ M) = 0.41\`. Er fysikk og matte uavhengige?

    P(F) · P(M) = 0.45 · 0.80 = 0.36
    P(F ∩ M)    = 0.41

Siden \`0.41 ≠ 0.36\`, er hendelsene IKKE uavhengige. Differansen \`0.41 − 0.36 = 0.05\` viser at det er ca. 5 prosentpoeng større overlapp enn ren uavhengighet ville gitt: studentene som tar fysikk tar matte litt oftere enn gjennomsnittet.


## Tolkning og fallgruver

- Større snitt enn produktet (\`P(A ∩ B) > P(A) · P(B)\`): positiv assosiasjon.
- Mindre snitt enn produktet (\`P(A ∩ B) < P(A) · P(B)\`): negativ assosiasjon.
- Likhet: uavhengighet.

> [!tip] Disjunkte hendelser er IKKE det samme som uavhengige. Hvis \`A\` og \`B\` er disjunkte og begge har positiv sannsynlighet, er \`P(A ∩ B) = 0 < P(A) · P(B)\`, så de er nødvendigvis avhengige.
`,
      see_also: [
        {
          kind: "glossary",
          id: "uavhengighet-glos",
        },
        {
          kind: "glossary",
          id: "disjunkte-hendelser-glos",
        },
        {
          kind: "glossary",
          id: "betinget-sannsynlighet-glos",
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
    {
      id: "total-forover",
      name: "Forover: finn P(B)",
      abbreviation: "FWD",
      formula: "P(B) = Σᵢ P(Aᵢ) · P(B | Aᵢ)",
      short: "Vanlig retning: gitt partisjonen og betingede rater, summer bidragene til marginalen.",
      long: `Forover-varianten er standardbruken: oppgaven gir en partisjon og betingede rater, og du skal finne den marginale (totale) sannsynligheten \`P(B)\`.


## Steg for steg

1. Identifiser partisjonen «\`A\` og \`Aᶜ\`», eller flere disjunkte hendelser som dekker hele utfallsrommet.
2. Skriv ned marginalsannsynlighetene \`P(Aᵢ)\` og de betingede \`P(B | Aᵢ)\`.
3. Sjekk at \`Σᵢ P(Aᵢ) = 1\`. Hvis ikke, mangler du en gruppe.
4. Sett rett inn:

> [!read] P(B) = Σᵢ P(Aᵢ) · P(B | Aᵢ)
> Vekt hver betingede sannsynlighet med hvor stor gruppen er, og summer.


## Konkret eksempel: tran-konsum

23 % av jentene og 34 % av guttene drikker tran daglig. Populasjonen er 52 % jenter («\`J\`») og 48 % gutter («\`Jᶜ\`»). Finn \`P(T)\`.

    P(T) = P(J) · P(T | J) + P(Jᶜ) · P(T | Jᶜ)
         = 0.52 · 0.23 + 0.48 · 0.34
         = 0.1196 + 0.1632
         = 0.2828

Altså 28.28 % av befolkningen drikker tran daglig.


## Vanlige snublepunkter

> [!tip] Hvis tabellen oppgir prosenter «innenfor» hver gruppe, husk at de IKKE skal summeres direkte. Det er først etter at du har vektet med gruppestørrelsen at de er sammenlignbare.

- Sjekk alltid at marginalsannsynlighetene summerer til 1.
- For mer enn to grupper, summer over alle: \`P(B) = Σᵢ P(Aᵢ) · P(B | Aᵢ)\`.
- Forover-varianten er nesten alltid steg 1 i en Bayes-utregning, fordi nevneren \`P(B)\` typisk ikke er gitt direkte.
`,
      see_also: [
        {
          kind: "entry",
          id: "bayes-setning",
        },
        {
          kind: "entry",
          id: "produktregel",
        },
        {
          kind: "glossary",
          id: "partisjon",
        },
      ],
    },
    {
      id: "total-bakover",
      name: "Bakover: finn ukjent betinget",
      abbreviation: "BWD",
      formula: "P(B | Aᶜ) = (P(B) − P(A) · P(B | A)) / P(Aᶜ)",
      short: `Snu om: gitt \`P(B)\`, finn den manglende betingede \`P(B | Aᵢ)\`.`,
      long: `Bakover-varianten bruker samme ligning som forover, men løst for et annet ukjent ledd. Du har den marginale \`P(B)\` og én av de betingede ratene, og skal finne den andre.


## Idéen

Ligningen \`P(B) = P(A) · P(B | A) + P(Aᶜ) · P(B | Aᶜ)\` har fire størrelser: \`P(B)\`, \`P(A)\` (og dermed \`P(Aᶜ)\`), \`P(B | A)\` og \`P(B | Aᶜ)\`. Hvis tre er kjent, er den fjerde løst:

> [!read] P(B | Aᶜ) = (P(B) − P(A) · P(B | A)) / P(Aᶜ)
> Trekk fra det \`A\`-gruppen bidrar med, og normaliser med \`Aᶜ\`-gruppens andel.


## Konkret eksempel: spiregrad for andre frø

80 % av frøene spirer totalt: \`P(S) = 0.80\`. Av frøene er 60 % ringblomster («\`R\`»), og spiregraden for ringblomstfrø er 90 %: \`P(S | R) = 0.90\`. Hva er spiregraden for de andre frøene, \`P(S | Rᶜ)\`?

Løs ligningen:

    P(S) = P(R) · P(S | R) + P(Rᶜ) · P(S | Rᶜ)
    0.80 = 0.60 · 0.90 + 0.40 · P(S | Rᶜ)
    0.80 = 0.54 + 0.40 · P(S | Rᶜ)
    0.40 · P(S | Rᶜ) = 0.26
    P(S | Rᶜ) = 0.26 / 0.40 = 0.65

Andre frø spirer altså med 65 % sannsynlighet.


## Sjekk

> [!tip] Svaret skal ligge i \`[0, 1]\`. Hvis du får et tall utenfor, har du enten antatt feil partisjon eller blandet retning på en betinget sannsynlighet.

- Verifiser ved å sette inn igjen: \`0.60 · 0.90 + 0.40 · 0.65 = 0.54 + 0.26 = 0.80\`. OK.
- Bakover-varianten er ofte siste steg i en oppgave der den marginale raten er gitt som «totalt sett»-tall.
`,
      see_also: [
        {
          kind: "entry",
          id: "bayes-setning",
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
    {
      id: "antall-utvalg",
      name: "Antall mulige utvalg",
      abbreviation: "C(n,k)",
      formula: "C(n, k) = n! / (k! · (n − k)!)",
      short: `Antall måter å plukke \`k\` av \`n\` ulike elementer når rekkefølgen ikke teller. Også kalt binomialkoeffisienten «n velg k».`,
      long: `Binomialkoeffisienten \`C(n, k)\` teller antall ulike utvalg av \`k\` elementer fra \`n\` ulike elementer, når rekkefølgen i utvalget er likegyldig og hvert element brukes høyst én gang.


## Hvordan lese formelen

> [!read] C(n, k) = P(n, k) / k! = n! / (k! · (n − k)!)
> Start med antall ordnede utvalg \`P(n, k)\` og del på \`k!\` for å fjerne dobbelttellingen som rekkefølgen lager. Alle \`k!\` rekkefølger av samme \`k\`-mengde teller som ett utvalg.

Nyttig symmetri: \`C(n, k) = C(n, n − k)\`. For eksempel er \`C(52, 50) = C(52, 2) = 1 326\`, mye lettere å regne enn det første direkte.


## Når brukes \`C(n, k)\`?

- Pokerhender og lottokuponger der rekkefølgen er likegyldig
- Velge en komité på \`k\` personer fra \`n\` kandidater
- Som «mulige» i gunstige på mulige når trekkene er uten tilbakelegging og rekkefølgen ikke teller

> [!tip] Hvis spørsmålet involverer rekkefølge (gull, sølv, bronse) skal du bruke \`P(n, k)\` i stedet. Tell rekkefølgen bare hvis oppgaven faktisk skiller mellom de ulike rekkefølgene.


## Eksempel: kortstokk og lotto

Antall mulige femkortshender fra en stokk på 52 kort: \`n = 52\`, \`k = 5\`.

    C(52, 5) = (52 · 51 · 50 · 49 · 48) / 5! = 2 598 960

Norsk Lotto: 7 tall fra 34 mulige, rekkefølgen teller ikke.

    C(34, 7) = 5 379 616 mulige kuponger

Velge 3 representanter fra en klasse på 25 elever:

    C(25, 3) = (25 · 24 · 23) / (3 · 2 · 1) = 2 300
`,
      see_also: [
        {
          kind: "entry",
          id: "ordnet-utvalg-uten-tilbakelegging",
        },
        {
          kind: "glossary",
          id: "uordnet-utvalg",
        },
        {
          kind: "glossary",
          id: "uten-tilbakelegging-glos",
        },
      ],
    },
    {
      id: "p-alle-fra-kategori",
      name: "Sannsynlighet: alle k fra én kategori",
      abbreviation: "C(K,k)/C(N,k)",
      formula: "P(alle k fra K) = C(K, k) / C(N, k)",
      short: `Trekker du \`k\` av \`N\` uten tilbakelegging, er sannsynligheten for at alle havner i kategorien (med \`K\` elementer) lik \`C(K, k)/C(N, k)\`.`,
      long: `Når en populasjon på \`N\` elementer inneholder \`K\` av en bestemt kategori, og du trekker et uordnet utvalg på \`k\` uten tilbakelegging, gir gunstige på mulige sannsynligheten for at alle \`k\` ligger i kategorien.


## Hvordan lese formelen

> [!read] P(alle k fra K) = C(K, k) / C(N, k)
> Telleren \`C(K, k)\` er antall måter å plukke \`k\` fra de \`K\` i kategorien. Nevneren \`C(N, k)\` er antall mulige utvalg på \`k\` fra hele populasjonen \`N\`.

Dette er et spesialtilfelle av hypergeometrisk fordeling med suksessfargen som «kategorien»: \`P(X = k) = C(K, k) · C(N − K, 0) / C(N, k) = C(K, k) / C(N, k)\`.

Krav for at formelen passer:

- Endelig populasjon med kjent \`N\` og \`K\`
- Trekkene er uten tilbakelegging
- Rekkefølgen i utvalget er likegyldig


## Hvorfor ikke \`(K/N)^k\`?

> [!tip] \`(K/N)^k\` er binomial-tilnærmingen og forutsetter med tilbakelegging eller veldig stor populasjon. Når \`k\` er en nevneverdig andel av \`N\`, må du bruke \`C(K, k) / C(N, k)\`. Andelen \`K/N\` endrer seg etter hvert trekk uten tilbakelegging.


## Eksempel: alle hjerter og full lotto

Trekk 5 kort fra en stokk på 52 der \`K = 13\` er hjerter:

    P(alle 5 er hjerter) = C(13, 5) / C(52, 5)
                         = 1 287 / 2 598 960
                         ≈ 4.95 · 10^(−4)

Lotto-førstepremie: 7 av dine tall blant 7 trekte vinnertall. Her er \`N = 34\`, \`K = 7\`, \`k = 7\`:

    P(7 rette) = C(7, 7) / C(34, 7) = 1 / 5 379 616 ≈ 1.86 · 10^(−7)

Trekk 4 kuler fra en bolle med 6 røde og 4 blå (\`N = 10\`, \`K = 6\`, \`k = 4\`):

    P(alle 4 røde) = C(6, 4) / C(10, 4) = 15 / 210 ≈ 0.0714
`,
      see_also: [
        {
          kind: "entry",
          id: "hypergeometrisk-fordeling",
        },
        {
          kind: "entry",
          id: "gunstige-pa-mulige",
        },
        {
          kind: "glossary",
          id: "uten-tilbakelegging-glos",
        },
      ],
    },
    {
      id: "p-ingen-fra-kategori",
      name: "Sannsynlighet: ingen av k fra én kategori",
      abbreviation: "C(N−K,k)/C(N,k)",
      formula: "P(ingen k fra K) = C(N − K, k) / C(N, k)",
      short: `Sannsynligheten for at ingen av de \`k\` trukne tilhører kategorien med \`K\` elementer er antall utvalg fra «de andre» delt på antall mulige utvalg.`,
      long: `Speilbildet av forrige formel. Når du trekker \`k\` uten tilbakelegging fra \`N\`, er sannsynligheten for at ingen av dem havner i kategorien (med \`K\` elementer) lik \`C(N − K, k) / C(N, k)\`.


## Hvordan lese formelen

> [!read] P(ingen k fra K) = C(N − K, k) / C(N, k)
> Telleren \`C(N − K, k)\` er antall utvalg på \`k\` valgt utelukkende fra de \`N − K\` som ikke er i kategorien. Nevneren er totalt antall utvalg.

Dette er hypergeometrisk fordeling med \`X = 0\`: \`P(X = 0) = C(K, 0) · C(N − K, k) / C(N, k) = C(N − K, k) / C(N, k)\`.


## Forhold til komplementet

Sannsynligheten for «minst én fra kategorien» får du fra komplementtrikset:

> [!read] P(minst én fra K) = 1 − C(N − K, k) / C(N, k)
> Lettere enn å summere \`P(X = 1) + P(X = 2) + ... + P(X = k)\` direkte.

> [!tip] Når \`k > N − K\` blir \`C(N − K, k) = 0\`, og sannsynligheten for «ingen fra K» er null. Du kan ikke trekke flere fra «de andre» enn det finnes.


## Eksempel: ingen hjerter og ingen vinnertall

Trekk 5 kort fra en stokk på 52. \`N = 52\`, \`K = 13\` (hjerter), \`k = 5\`. Sannsynlighet for ingen hjerter:

    P(ingen hjerter) = C(39, 5) / C(52, 5)
                     = 575 757 / 2 598 960
                     ≈ 0.2215

Lotto: ingen av dine 7 tall er blant de 7 vinnertallene. \`N = 34\`, \`K = 7\`, \`k = 7\`:

    P(0 rette) = C(27, 7) / C(34, 7)
               = 888 030 / 5 379 616
               ≈ 0.1651

Trekk 4 kuler fra 10 (\`K = 6\` røde, \`N − K = 4\` blå). Sannsynlighet for ingen røde:

    P(ingen røde) = C(4, 4) / C(10, 4) = 1 / 210 ≈ 0.00476
`,
      see_also: [
        {
          kind: "entry",
          id: "hypergeometrisk-fordeling",
        },
        {
          kind: "entry",
          id: "gunstige-pa-mulige",
        },
        {
          kind: "glossary",
          id: "uten-tilbakelegging-glos",
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
  "bootstrapping": [
    {
      id: "bootstrap-se",
      name: "Tradisjonelt bootstrap-KI",
      abbreviation: "SE-BOOT",
      formula: "x̄ ± z_(α/2) · SE_boot",
      short: `Klassisk KI-form, men SE er standardavviket av bootstrap-statistikkene i stedet for \`s/√n\`.`,
      long: `Den tradisjonelle bootstrap-varianten bygger et konfidensintervall på samme form som det klassiske \`x̄ ± z · SE\`, men erstatter den teoretiske standardfeilen med \`SE_boot\`, som er standardavviket av de mange bootstrap-statistikkene du har generert. Du beholder altså normaltilnærmingen, men slipper å anta noe om fordelingen til de underliggende dataene.


## Når foretrekkes denne varianten?

Denne formen passer når bootstrap-fordelingen til statistikken ser tilnærmet symmetrisk og normalfordelt ut. Det skjer typisk når \`N\` er moderat stor, eller når statistikken er et gjennomsnitt og sentralgrenseteoremet begynner å virke selv om enkeltobservasjonene er litt skjeve.

> [!read] x̄ ± z_(α/2) · SE_boot
> Punktestimatet \`x̄\` justert opp og ned med kritisk z-verdi ganger standardfeilen estimert fra bootstrap-utvalgene.

- Velg denne når et histogram over de 999 bootstrap-statistikkene ser symmetrisk og klokkeformet ut.
- Bytt til prosentilintervall hvis fordelingen er skjev eller har tunge haler.


## Mekanikk steg for steg

1. Trekk \`B\` resampler av størrelse \`N\` med tilbakelegging fra de opprinnelige dataene (typisk \`B = 999\` eller \`B = 1000\`).
2. Beregn statistikken \`x̄_b*\` for hvert resample \`b = 1, ..., B\`.
3. Beregn \`SE_boot\` som det empiriske standardavviket av \`(x̄_1*, x̄_2*, ..., x̄_B*)\`.
4. Slå opp \`z_(α/2)\` for ønsket konfidensnivå (1.96 for 95 prosent).
5. Sett opp intervallet \`x̄ ± z_(α/2) · SE_boot\`, der \`x̄\` er gjennomsnittet i de opprinnelige dataene.

> [!tip] Bruk det opprinnelige \`x̄\`, ikke gjennomsnittet av bootstrap-snittene, som senterpunkt. Bootstrap-fordelingen brukes til usikkerhet, ikke til å re-estimere posisjonen.


## Konkret eksempel

Anta at vi har målt ventetiden i minutter for \`N = 8\` kunder: \`(3.2, 4.1, 5.0, 4.8, 3.9, 6.2, 4.5, 5.3)\`. Det opprinnelige gjennomsnittet er \`x̄ = 4.625\`.

Vi trekker \`B = 1000\` bootstrap-resampler. De første tre snittene blir:

    x̄_1* = 4.71
    x̄_2* = 4.43
    x̄_3* = 4.88
    ...

Standardavviket av alle 1000 verdiene blir \`SE_boot = 0.32\`. For et 95 prosent KI med \`z_(0.025) = 1.96\`:

    KI = 4.625 ± 1.96 · 0.32
       = 4.625 ± 0.627
       = (3.998, 5.252)

Konklusjon: vi er 95 prosent sikre på at populasjonens gjennomsnittlige ventetid ligger mellom ca. 4.0 og 5.3 minutter, gitt at bootstrap-fordelingen er omtrent symmetrisk.
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
          kind: "glossary",
          id: "sentralgrenseteoremet-glos",
        },
      ],
    },
    {
      id: "prosentilintervall",
      name: "Prosentilintervall",
      abbreviation: "PCT",
      formula: "[ q_(α/2),  q_(1 − α/2) ]",
      short: `Bruker \`α/2\`- og \`1 − α/2\`-prosentilen av bootstrap-fordelingen direkte som intervallgrenser.`,
      long: `Prosentilintervallet kutter ut normaltilnærmingen helt. I stedet for \`x̄ ± z · SE\` ber du bootstrap-fordelingen selv om sine ytterpunkter: nedre grense er \`α/2\`-prosentilen av de \`B\` bootstrap-statistikkene, øvre grense er \`1 − α/2\`-prosentilen. Intervallet trenger ikke være symmetrisk rundt \`x̄\`, og det skal det heller ikke være hvis fordelingen er skjev.


## Når foretrekkes denne varianten?

Prosentilintervallet er det naturlige valget når bootstrap-fordelingen er skjev, har tunge haler eller på andre måter ser ulik en normalfordeling ut. Eksempler er statistikker som median, kvartiler, varians eller forholdstall, der estimatoren ikke er noe pent veiet gjennomsnitt.

> [!read] [ q_(α/2),  q_(1 − α/2) ]
> Bruk prosentilene av bootstrap-fordelingen direkte som intervallgrenser.

- Velg denne hvis et histogram over bootstrap-statistikkene er tydelig skjevt eller har lang hale på én side.
- Velg denne hvis statistikken er begrenset (for eksempel en sannsynlighet mellom 0 og 1) og normaltilnærmingen kan gi grenser utenfor det lovlige området.


## Mekanikk steg for steg

1. Trekk \`B\` resampler av størrelse \`N\` med tilbakelegging og beregn statistikken \`x̄_b*\` for hver.
2. Sorter de \`B\` verdiene fra minst til størst.
3. For 95 prosent KI med \`B = 1000\`: nedre grense er verdi nummer 25 (≈ 2.5-prosentilen), øvre grense er verdi nummer 975 (≈ 97.5-prosentilen).
4. For generelt \`α\`: nedre er \`q_(α/2)\`, øvre er \`q_(1 − α/2)\`.

> [!tip] Med \`B = 999\` ligger 25-tallet og 975-tallet pent på 2.5- og 97.5-prosentilen. Det er hovedgrunnen til at oppgavetekster ofte bruker akkurat 999.


## Konkret eksempel

Vi bruker samme datasett som over: \`N = 8\` ventetider med opprinnelig \`x̄ = 4.625\`. Vi trekker \`B = 1000\` bootstrap-snitt og sorterer dem stigende:

    sortert: ( 3.62,  3.71,  3.78,  ...,  5.41,  5.48,  5.55 )
              ^plass 1                          ^plass 1000

For et 95 prosent prosentilintervall plukker vi:

    nedre = sortert[25]  = 3.92
    øvre  = sortert[975] = 5.36

KI = (3.92, 5.36).

Legg merke til at intervallet er litt asymmetrisk rundt \`x̄ = 4.625\`: avstanden til nedre grense er 0.71, til øvre 0.74. Hadde fordelingen vært tydelig høyreskjev, ville asymmetrien vært større, og det er nettopp denne formen som gjør prosentilintervallet bedre enn en normaltilnærming på skjeve data.
`,
      see_also: [
        {
          kind: "glossary",
          id: "prosentilintervall",
        },
        {
          kind: "glossary",
          id: "kvantil",
        },
        {
          kind: "glossary",
          id: "alpha",
        },
      ],
    },
  ],
};
