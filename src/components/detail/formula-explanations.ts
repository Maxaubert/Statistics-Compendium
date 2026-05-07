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
      name: "Sannsynlighetstetthet",
      abbreviation: "PDF",
      formula: "f(t) = λe^(-λt)",
      short: "Hvor tett fordelingen ligger ved et punkt t. Brukes mest for å tegne kurven.",
      long: `\`f(t)\` er tetthetsfunksjonen (på engelsk *probability density
function*, derav PDF) til eksponentialfordelingen. Den beskriver hvor
«tett» fordelingen ligger ved et bestemt punkt \`t\`.


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
gjort og gitt deg som \`F(t)\` (se kortet ved siden av).


## Når bruke \`f(t)\`?

- Tegne eller skissere tetthetskurven
- Vise at fordelingen integrerer til 1 (dvs. at den faktisk er en gyldig fordeling)
- Sjelden direkte i sannsynlighetsberegninger; bruk \`F(t)\` i stedet
`,
      see_also: [
        { kind: "formula", ref: "cdf" },
        { kind: "glossary", id: "poisson-prosess" },
      ],
    },
    {
      id: "cdf",
      name: "Kumulativ fordelingsfunksjon",
      abbreviation: "CDF",
      formula: "F(t) = 1 - e^(-λt)",
      short: "Gir sannsynligheten direkte: P(T ≤ t). Den du faktisk bruker i utregning.",
      long: `\`F(t)\` er kumulativ fordelingsfunksjon (på engelsk *cumulative
distribution function*, derav CDF). I motsetning til \`f(t)\` gir den
en sannsynlighet direkte:

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
        { kind: "formula", ref: "pdf" },
        { kind: "entry", id: "komplementregelen" },
        { kind: "glossary", id: "poisson-prosess" },
      ],
    },
  ],
};
