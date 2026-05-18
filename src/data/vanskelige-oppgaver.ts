import type { StepItem } from "@/components/detail/StepByStep";

export interface VanskeligOppgave {
  /** Stable id, e.g. "jan25-3a" */
  id: string;
  /** Exam id like "jan25", "mai21" */
  exam: string;
  /** Display label for exam (e.g. "Januar 2025") */
  exam_label: string;
  /** Oppgave identifier like "Oppgave 3a" */
  task: string;
  /** Short topic label, max ~5 words */
  topic: string;
  /** Direct quote of the question from the exam */
  quote: string;
  /** 1-2 sentences on what makes the wording tricky */
  why_tricky: string;
  /** Entry id in compendium, e.g. "bayes-setning" */
  formula_entry: string;
  /** Optional tab name within that entry */
  formula_tab?: string;
  /** Step-by-step solution */
  steps: StepItem[];
  /** Final answer, ready to write on exam */
  answer: string;
}

export const VANSKELIGE_OPPGAVER: VanskeligOppgave[] = [
  // ---------------- jan22 ----------------
  {
    id: "jan22-2a",
    exam: "jan22",
    exam_label: "Januar 2022",
    task: "Oppgave 2a",
    topic: "Poisson, skaler rate",
    quote:
      "Antall kunder som ankommer en butikk, er poissonfordelt med rate λ = 0.15 kunder pr. minutt. Finn sannsynligheten for at det ankommer minst 8 kunder i løpet av en time.",
    why_tricky:
      "Raten er gitt per minutt, men spørsmålet gjelder en time. Du må selv skalere parameteren μ = λ·t og oversette «minst 8» til 1 − P(X ≤ 7).",
    formula_entry: "poisson-fordeling",
    formula_tab: "P(X ≥ k)",
    steps: [
      {
        text: "Definer X som antall kunder i løpet av en time. Skaler raten til riktig tidsenhet (60 minutter):",
        formula: "μ = λ · t = 0.15 · 60 = 9",
      },
      {
        text: "«Minst 8» betyr X ≥ 8. Bruk komplementregelen for å kunne slå opp i kumulativ tabell:",
        formula: "P(X ≥ 8) = 1 − P(X ≤ 7)",
      },
      "Slå opp i tabell E.2 (kumulativ Poisson) med μ = 9 og finn P(X ≤ 7) = 0.324.",
      {
        text: "Sett inn i komplementuttrykket:",
        formula: "P(X ≥ 8) = 1 − 0.324 = 0.676",
        example: true,
      },
    ],
    answer: "P(X ≥ 8) ≈ 0.676",
  },
  {
    id: "jan22-2b",
    exam: "jan22",
    exam_label: "Januar 2022",
    task: "Oppgave 2b",
    topic: "Ventetid i Poisson-prosess",
    quote:
      "Hva er sannsynligheten for at den første kunden ankommer når det har gått mellom 4 og 6 minutter?",
    why_tricky:
      "Oppgaven er rammet inn med Poisson, men spørsmålet handler om ventetid. Du må selv gjenkjenne at ventetid i en Poisson-prosess er eksponentialfordelt med samme rate.",
    formula_entry: "eksponential-fordeling",
    formula_tab: "P(a < T < b) — intervall",
    steps: [
      "Ventetiden T til første kunde i en Poisson-prosess er eksponentialfordelt med samme rate λ = 0.15 pr. minutt.",
      {
        text: "Bruk kumulativ fordeling F(t) = 1 − e^(−λt) og finn sannsynligheten i intervallet [4, 6):",
        formula: "P(4 ≤ T < 6) = F(6) − F(4) = (1 − e^(−0.15·6)) − (1 − e^(−0.15·4))",
      },
      {
        text: "Forenkle:",
        formula: "P(4 ≤ T < 6) = e^(−0.6) − e^(−0.9) = 0.5488 − 0.4066",
      },
      {
        text: "Regn ut differansen:",
        formula: "P(4 ≤ T < 6) ≈ 0.142",
        example: true,
      },
    ],
    answer: "P(4 ≤ T < 6) ≈ 0.142",
  },
  {
    id: "jan22-4c",
    exam: "jan22",
    exam_label: "Januar 2022",
    task: "Oppgave 4c",
    topic: "Invers binomial — finn n",
    quote:
      "Hvor mange avokadoer må fru Petrell ta med seg dersom hun skal være minst 90 % sikker på at hun får minst 4 avokadoer som er spiselige.",
    why_tricky:
      "To «minst» i samme setning, og spørsmålet om antall n må oversettes til en ulikhet i binomial fordeling. Ingen formelhint i ordlyden.",
    formula_entry: "binomial-fordeling",
    formula_tab: "Finn n / sjansen for minst k (k ≥ 2)",
    steps: [
      "La X være antall spiselige avokadoer av n. Da er X ~ Bin(n, 0.6) (p = 0.6 fra «60 % spiselige»).",
      {
        text: "«Minst 90 % sikker på minst 4» betyr at vi søker minste n med:",
        formula: "P(X ≥ 4) ≥ 0.90",
      },
      {
        text: "Skriv om til kumulativ form (det som finnes i tabell E.1):",
        formula: "P(X ≤ 3) ≤ 0.10",
      },
      "Slå opp i kumulativ binomial-tabell i kolonnen p = 0.6 og let nedover på n til P(X ≤ 3) ≤ 0.10.",
      {
        text: "For n = 9 finner vi P(X ≤ 3) = 0.099, som er den første verdien under 0.10.",
        example: true,
      },
    ],
    answer: "Fru Petrell må plukke med seg minst n = 9 avokadoer.",
  },

  // ---------------- jan25 ----------------
  {
    id: "jan25-3a",
    exam: "jan25",
    exam_label: "Januar 2025",
    task: "Oppgave 3a",
    topic: "Bayes — frøposen",
    quote:
      "Spiregraden er angitt til 80 %. Det viser seg at 60 % av frøene i posen er ringblomstfrø, og av erfaring vet man at spiregraden til ringblomstfrø er 90 %. Hva er sannsynligheten for at et frø som spirer er et ringblomstfrø?",
    why_tricky:
      "Tre prosenter i dagligspråk uten å nevne betinget sannsynlighet eller Bayes. Du må selv oversette «spiregrad for ringblomst» → P(S|R), «andel ringblomst» → P(R), «total spiregrad» → P(S).",
    formula_entry: "bayes-setning",
    formula_tab: "Snu retning: gitt P(B|A), finn P(A|B)",
    steps: [
      "Definer hendelser: R = «frøet er et ringblomstfrø», S = «frøet spirer».",
      {
        text: "Oversett prosentene til sannsynligheter:",
        formula: ["P(S) = 0.8", "P(R) = 0.6", "P(S|R) = 0.9"],
      },
      {
        text: "Spørsmålet «sannsynligheten for at et frø som spirer er et ringblomstfrø» betyr P(R|S). Bruk Bayes for å snu retningen:",
        formula: "P(R|S) = P(R) · P(S|R) / P(S)",
      },
      {
        text: "Sett inn tallene:",
        formula: "P(R|S) = (0.6 · 0.9) / 0.8 = 0.54 / 0.8 = 0.675",
        example: true,
      },
    ],
    answer: "P(R|S) = 0.675",
  },
  {
    id: "jan25-3b",
    exam: "jan25",
    exam_label: "Januar 2025",
    task: "Oppgave 3b",
    topic: "Total sannsynlighet baklengs",
    quote: "Hva er spiregraden til de andre frøene i frøposen?",
    why_tricky:
      "«Spiregraden til de andre frøene» lyder som enkel prosentregning, men er egentlig P(S|R̄) som må løses baklengs fra total sannsynlighet siden P(S), P(R) og P(S|R) er kjent.",
    formula_entry: "total-sannsynlighet",
    formula_tab: "Finn ukjent betinget (når total P(B) er gitt)",
    steps: [
      "«Spiregraden til de andre frøene» = P(S | R̄), altså sannsynligheten for at et frø spirer gitt at det IKKE er et ringblomstfrø.",
      {
        text: "Skriv ut setningen om total sannsynlighet:",
        formula: "P(S) = P(R) · P(S|R) + P(R̄) · P(S|R̄)",
      },
      {
        text: "Løs med hensyn på den ukjente P(S|R̄):",
        formula: "P(S|R̄) = (P(S) − P(R) · P(S|R)) / P(R̄)",
      },
      {
        text: "Bruk P(R̄) = 1 − 0.6 = 0.4 og sett inn:",
        formula: "P(S|R̄) = (0.8 − 0.6 · 0.9) / (1 − 0.6) = (0.8 − 0.54) / 0.4 = 0.26 / 0.4 = 0.65",
        example: true,
      },
    ],
    answer: "Spiregraden for de andre frøene er 65 % (P(S|R̄) = 0.65).",
  },

  // ---------------- jan26 ----------------
  {
    id: "jan26-1a",
    exam: "jan26",
    exam_label: "Januar 2026",
    task: "Oppgave 1a",
    topic: "Sko som «hører sammen»",
    quote:
      "I en mørk garderobe ligger det fem par sko i en haug. Du plukker tilfeldig opp to sko. Hva er sannsynligheten for at skoene du har plukket opp hører sammen?",
    why_tricky:
      "Ingen formel eller fordelingshint. «Hører sammen» må oversettes til en betinget tellesituasjon — etter første sko gjenstår 9 sko, og kun 1 av dem er makker.",
    formula_entry: "gunstige-pa-mulige",
    steps: [
      "Det er 5 par = 10 sko totalt. Vi har en uniform sannsynlighetsmodell, så bruk gunstige på mulige.",
      "Tenk sekvensielt: plukk én sko først. Identiteten til denne første skoen er irrelevant — det vi vil vite er om sko nr. 2 er makkeren.",
      "Etter første trekning: 9 sko igjen (mulige). Bare 1 av disse er makkeren til den første (gunstige).",
      {
        text: "Sannsynligheten blir:",
        formula: "P(skoene hører sammen) = 1/9 ≈ 0.1111",
        example: true,
      },
    ],
    answer: "P(skoene hører sammen) = 1/9 ≈ 0.111",
  },
  {
    id: "jan26-1c",
    exam: "jan26",
    exam_label: "Januar 2026",
    task: "Oppgave 1c",
    topic: "Antall myntkast — terskel",
    quote:
      "En mynt kastes. Hvor mange ganger må den kastes for at sannsynligheten for at man får «kron» minst én gang overstiger 0.99.",
    why_tricky:
      "Spør om antall kast n, ikke om en sannsynlighet. Du må selv sette opp binomisk modell, bruke komplementregelen («minst én» → 1 − P(X=0)) og løse ulikheten 0.5^n < 0.01 for n.",
    formula_entry: "komplementregelen",
    formula_tab: "Finn n for terskel",
    steps: [
      "La X = antall kron i n kast. Da er X ~ Bin(n, 0.5). Vi søker minste n slik at P(X ≥ 1) > 0.99.",
      {
        text: "«Minst én» → komplementregelen:",
        formula: "P(X ≥ 1) = 1 − P(X = 0) = 1 − 0.5^n",
      },
      {
        text: "Sett opp ulikheten:",
        formula: "1 − 0.5^n > 0.99   ⇔   0.5^n < 0.01",
      },
      {
        text: "Ta logaritmen på begge sider og løs for n:",
        formula: "n · ln(0.5) < ln(0.01)   ⇒   n > ln(0.01)/ln(0.5) ≈ 6.64",
      },
      {
        text: "Husk å snu ulikhetstegnet siden ln(0.5) er negativt. n må være heltall, så n ≥ 7.",
        conditional: true,
      },
      {
        text: "Verifiser med tabell E.1: for n = 7, p = 0.5 er P(X ≤ 0) = 0.008 < 0.01.",
        example: true,
      },
    ],
    answer: "Mynten må kastes minst n = 7 ganger.",
  },
  {
    id: "jan26-3b",
    exam: "jan26",
    exam_label: "Januar 2026",
    task: "Oppgave 3b",
    topic: "Disjunkt + komplement",
    quote:
      "Hendelsene A og C er disjunkte, og hendelsene B og C er disjunkte. P(A) = 0.30, P(B) = 0.25, P(C) = 0.40, P(A ∩ B) = 0.15. Finn P(A | C̄).",
    why_tricky:
      "Du må gjenkjenne at «A og C disjunkte» betyr A ⊆ C̄, slik at P(A ∩ C̄) = P(A). Deretter bruk P(C̄) = 1 − P(C) og definisjonen av betinget sannsynlighet.",
    formula_entry: "produktregel",
    formula_tab: "Betinget P(A | B) direkte",
    steps: [
      {
        text: "Bruk definisjonen av betinget sannsynlighet:",
        formula: "P(A | C̄) = P(A ∩ C̄) / P(C̄)",
      },
      {
        text: "A og C er disjunkte, så A ligger helt i C̄. Det betyr:",
        formula: "P(A ∩ C̄) = P(A) = 0.30",
        conditional: true,
      },
      {
        text: "Nevneren via komplementregelen:",
        formula: "P(C̄) = 1 − P(C) = 1 − 0.40 = 0.60",
      },
      {
        text: "Sett inn:",
        formula: "P(A | C̄) = 0.30 / 0.60 = 0.5",
        example: true,
      },
    ],
    answer: "P(A | C̄) = 0.5",
  },

  // ---------------- mai21 ----------------
  {
    id: "mai21-1b",
    exam: "mai21",
    exam_label: "Mai 2021",
    task: "Oppgave 1b",
    topic: "Minst én — ikke uavhengig",
    quote:
      "Finn sannsynligheten for at kjølingen virker en vilkårlig dag (altså at minst én av pumpene virker). P(A) = 0.99, P(B) = 0.99, P(A|B) = 0.995.",
    why_tricky:
      "«Minst én av to» må oversettes til P(A ∪ B), men hendelsene er IKKE uavhengige (fra 1a). Du må først regne ut P(A ∩ B) via produktregelen P(B)·P(A|B), så bruke unionssetningen.",
    formula_entry: "unionssetningen",
    formula_tab: "P(A ∪ B) — minst én",
    steps: [
      "«Minst én av pumpene virker» = A ∪ B.",
      {
        text: "Unionssetningen:",
        formula: "P(A ∪ B) = P(A) + P(B) − P(A ∩ B)",
      },
      {
        text: "Siden A og B ikke er uavhengige (P(A|B) ≠ P(A)), kan vi IKKE bruke P(A∩B) = P(A)·P(B). Bruk produktregelen i stedet:",
        formula: "P(A ∩ B) = P(B) · P(A|B) = 0.99 · 0.995 = 0.98505",
        conditional: true,
      },
      {
        text: "Sett inn i unionssetningen:",
        formula: "P(A ∪ B) = 0.99 + 0.99 − 0.98505 = 0.99495",
        example: true,
      },
    ],
    answer: "P(A ∪ B) ≈ 0.995",
  },
  {
    id: "mai21-2a",
    exam: "mai21",
    exam_label: "Mai 2021",
    task: "Oppgave 2a",
    topic: "Total sannsynlighet — kollisjon",
    quote:
      "Undersøkelser har vist at 2.5 % av alle bilførere i Norge er beruset. 11 % av alle kjøreturer hvor bilfører er beruset, resulterer i en kollisjon. 0.2 % av alle kjøreturer hvor sjåføren er edru, resulterer i en kollisjon. Hva er sannsynligheten for at en tilfeldig kjøretur ender i en kollisjon?",
    why_tricky:
      "Tre prosenter uten å nevne «betinget» eller «total». Du må selv gjenkjenne partisjon (beruset / edru) og bruke total sannsynlighet.",
    formula_entry: "total-sannsynlighet",
    formula_tab: "Forover: finn P(B)",
    steps: [
      "Definer hendelser: B = «sjåfør beruset», K = «kjøretur ender i kollisjon».",
      {
        text: "Oversett prosentene:",
        formula: [
          "P(B) = 0.025",
          "P(K|B) = 0.11",
          "P(K|B̄) = 0.002",
          "P(B̄) = 1 − 0.025 = 0.975",
        ],
      },
      {
        text: "Bruk setningen om total sannsynlighet (beruset/edru partisjonerer):",
        formula: "P(K) = P(B) · P(K|B) + P(B̄) · P(K|B̄)",
      },
      {
        text: "Sett inn:",
        formula: "P(K) = 0.025 · 0.11 + 0.975 · 0.002 = 0.00275 + 0.00195 = 0.0047",
        example: true,
      },
    ],
    answer: "P(K) = 0.0047 (0.47 %)",
  },
  {
    id: "mai21-2b",
    exam: "mai21",
    exam_label: "Mai 2021",
    task: "Oppgave 2b",
    topic: "Bayes — snu betingelsen",
    quote: "En bil har nettopp kollidert. Hva er sannsynligheten for at bilføreren er beruset?",
    why_tricky:
      "Spørsmålet ser tilforlatelig ut, men reverserer betingelsen: oppgaven gir P(K|B), men du skal finne P(B|K). Ingenting i teksten sier «Bayes».",
    formula_entry: "bayes-setning",
    formula_tab: "Snu retning: gitt P(B|A), finn P(A|B)",
    steps: [
      "Spørsmålet er P(B|K) — gitt kollisjon, er sjåføren beruset? Det er motsatt retning av P(K|B) = 0.11 som er oppgitt.",
      {
        text: "Bayes' setning:",
        formula: "P(B|K) = P(B) · P(K|B) / P(K)",
      },
      "Nevneren P(K) = 0.0047 ble regnet ut i 2a.",
      {
        text: "Sett inn alle tre tallene:",
        formula: "P(B|K) = (0.025 · 0.11) / 0.0047 = 0.00275 / 0.0047 ≈ 0.585",
        example: true,
      },
    ],
    answer: "P(B|K) ≈ 0.585",
  },

  // ---------------- mai22 ----------------
  {
    id: "mai22-2a",
    exam: "mai22",
    exam_label: "Mai 2022",
    task: "Oppgave 2a",
    topic: "Total sannsynlighet — fire regioner",
    quote:
      "Landet Nangijala er inndelt i fire regioner. Nord: 21 %, Sør: 34 %, Øst: 27 %, Vest: 18 %. Andelen som har rotte: Nord 52 %, Sør 79 %, Øst 34 %, Vest 41 %. Hva er sannsynligheten for at en tilfeldig person har rotte som kjæledyr?",
    why_tricky:
      "To lister med prosenter uten å nevne betinget eller total sannsynlighet. Du må selv se at regionene partisjonerer utfallsrommet og at «andel som har rotte i region X» er P(R|X), ikke P(R og X).",
    formula_entry: "total-sannsynlighet",
    formula_tab: "Forover: finn P(B)",
    steps: [
      "Definer hendelser: N, S, O, V for region, R = «har rotte». Regionene partisjonerer utfallsrommet.",
      {
        text: "Oversett prosentene. Marginalandeler er P(region), mens «andel som har rotte i region X» er den BETINGEDE P(R|X):",
        formula: [
          "P(N)=0.21, P(S)=0.34, P(O)=0.27, P(V)=0.18",
          "P(R|N)=0.52, P(R|S)=0.79, P(R|O)=0.34, P(R|V)=0.41",
        ],
        conditional: true,
      },
      {
        text: "Setningen om total sannsynlighet:",
        formula:
          "P(R) = P(N)·P(R|N) + P(S)·P(R|S) + P(O)·P(R|O) + P(V)·P(R|V)",
      },
      {
        text: "Sett inn:",
        formula:
          "P(R) = 0.21·0.52 + 0.34·0.79 + 0.27·0.34 + 0.18·0.41 = 0.1092 + 0.2686 + 0.0918 + 0.0738 = 0.5434",
        example: true,
      },
    ],
    answer: "P(R) ≈ 0.5434",
  },
  {
    id: "mai22-2b",
    exam: "mai22",
    exam_label: "Mai 2022",
    task: "Oppgave 2b",
    topic: "Bayes — region gitt rotte",
    quote:
      "Det viser seg at personen har rotte som kjæledyr. Hva er sannsynligheten for at denne personen er bosatt i region Sør?",
    why_tricky:
      "Nevner ikke Bayes. Du må se at de oppgitte prosentene gir P(R|Sør), mens spørsmålet er P(Sør|R) — altså snu retningen.",
    formula_entry: "bayes-setning",
    formula_tab: "Snu retning: gitt P(B|A), finn P(A|B)",
    steps: [
      "Spørsmålet er P(S|R) — motsatt retning av P(R|S) = 0.79 som er gitt.",
      {
        text: "Bayes' setning:",
        formula: "P(S|R) = P(S) · P(R|S) / P(R)",
      },
      "P(R) = 0.5434 fra 2a brukes som nevner.",
      {
        text: "Sett inn:",
        formula: "P(S|R) = (0.34 · 0.79) / 0.5434 = 0.2686 / 0.5434 ≈ 0.4943",
        example: true,
      },
    ],
    answer: "P(S|R) ≈ 0.494",
  },

  // ---------------- mai23 ----------------
  {
    id: "mai23-5b",
    exam: "mai23",
    exam_label: "Mai 2023",
    task: "Oppgave 5b",
    topic: "Eksponential — hukommelsesløs",
    quote:
      "Hva er sannsynligheten for at en hunnmygg skal leve i minst 20 døgn til gitt at den er i live etter 10 døgn? (Hunnmygg har forventet levetid 26 døgn.)",
    why_tricky:
      "Ser ut som standard betinget sannsynlighet via brøk, men eksponentialfordelingen er HUKOMMELSESLØS — svaret kollapser til P(T ≥ 20).",
    formula_entry: "eksponential-fordeling",
    formula_tab: "Memoryless (gitt at det ikke har skjedd noe i s minutter)",
    steps: [
      "T = levetid for hunnmygg er eksponentialfordelt. Forventet levetid 26 ⇒ λ = 1/26.",
      {
        text: "Vi skal finne P(T ≥ 30 | T ≥ 10) (lever 20 til, gitt allerede 10 levd).",
        conditional: true,
      },
      {
        text: "Eksponential er minneløs — sannsynligheten for å leve t enheter til er den samme uansett hvor lenge den allerede har levd:",
        formula: "P(T ≥ s + t | T ≥ s) = P(T ≥ t)",
      },
      {
        text: "Derfor kollapser uttrykket:",
        formula: "P(T ≥ 30 | T ≥ 10) = P(T ≥ 20) = e^(−20/26) = e^(−0.7692)",
      },
      {
        text: "Regn ut:",
        formula: "P(T ≥ 20) ≈ 0.463",
        example: true,
      },
    ],
    answer: "P(T ≥ 30 | T ≥ 10) ≈ 0.463",
  },
  {
    id: "mai23-5c",
    exam: "mai23",
    exam_label: "Mai 2023",
    task: "Oppgave 5c",
    topic: "Bayes + eksponential",
    quote:
      "Anta at hunnene utgjør 60 % av populasjonen. Hva er sannsynligheten for at et tilfeldig valgt individ er en hunnmygg gitt at det har levd i minst 25 døgn? (Hanner: forventet levetid 17 døgn; hunner: 26 døgn.)",
    why_tricky:
      "Tre dagligdagse opplysninger uten å nevne Bayes eller total sannsynlighet. Du må kombinere eksponentialfordeling med Bayes og total sannsynlighet over to klasser.",
    formula_entry: "bayes-setning",
    formula_tab: "Snu retning: gitt P(B|A), finn P(A|B)",
    steps: [
      {
        text: "Definer hendelser: H = «hunn», H̄ = «hann». Gitt:",
        formula: ["P(H) = 0.6, P(H̄) = 0.4", "T|H ~ Exp(λ = 1/26)", "T|H̄ ~ Exp(λ = 1/17)"],
      },
      {
        text: "Halene (hvor lenge en av hvert kjønn lever) hentes fra eksponentialfordelingen:",
        formula: [
          "P(T ≥ 25 | H) = e^(−25/26) = 0.3823",
          "P(T ≥ 25 | H̄) = e^(−25/17) = 0.2298",
        ],
      },
      {
        text: "Total sannsynlighet (nevneren i Bayes):",
        formula:
          "P(T ≥ 25) = P(H)·P(T≥25|H) + P(H̄)·P(T≥25|H̄) = 0.6·0.3823 + 0.4·0.2298 = 0.2294 + 0.0919 = 0.3213",
      },
      {
        text: "Bayes:",
        formula: "P(H | T ≥ 25) = P(H) · P(T ≥ 25|H) / P(T ≥ 25)",
      },
      {
        text: "Sett inn:",
        formula: "P(H | T ≥ 25) = (0.6 · 0.3823) / 0.3213 = 0.2294 / 0.3213 ≈ 0.714",
        example: true,
      },
    ],
    answer: "P(Hunn | T ≥ 25) ≈ 0.714",
  },

  // ---------------- mai24 ----------------
  {
    id: "mai24-3d",
    exam: "mai24",
    exam_label: "Mai 2024",
    task: "Oppgave 3d",
    topic: "Ventetid i Poisson — første hendelse",
    quote:
      "Hva er sannsynligheten for at det første elektronet sendes ut i løpet av et halvt sekund fra vi begynner å observere? (Rate λ = 0.8 elektroner pr. sekund.)",
    why_tricky:
      "Nevner verken «ventetid» eller «eksponentialfordeling». Du må selv gjenkjenne at tid til første hendelse i en Poisson-prosess er eksponentialfordelt med samme rate.",
    formula_entry: "eksponential-fordeling",
    formula_tab: "P(T < t) — hendelse innen t",
    steps: [
      "Ventetiden T til første elektron i en Poisson-prosess er eksponentialfordelt med samme rate λ = 0.8 pr. sekund.",
      {
        text: "Bruk kumulativ fordeling F(t) = 1 − e^(−λt):",
        formula: "P(T ≤ 0.5) = F(0.5) = 1 − e^(−0.8 · 0.5) = 1 − e^(−0.4)",
      },
      {
        text: "Slå opp eller regn ut e^(−0.4) ≈ 0.670:",
        formula: "P(T ≤ 0.5) = 1 − 0.670 = 0.330",
        example: true,
      },
    ],
    answer: "P(T ≤ 0.5) ≈ 0.330",
  },

  // ---------------- mai25 ----------------
  {
    id: "mai25-2b",
    exam: "mai25",
    exam_label: "Mai 2025",
    task: "Oppgave 2b",
    topic: "Komplement på komplement (De Morgan)",
    quote:
      "Vi velger ut et barn som ikke spiser frukt daglig. Hva er sannsynligheten for at dette barnet ikke drikker melk daglig? P(F)=0.45, P(M)=0.80, P(F ∩ M)=0.41.",
    why_tricky:
      "«Ikke … ikke» må oversettes til komplementhendelser. Bruk at M̄ ∩ F̄ = komplementet av (M ∪ F) (De Morgan), så regn P(M ∪ F) med unionssetningen.",
    formula_entry: "produktregel",
    formula_tab: "Betinget P(A | B) direkte",
    steps: [
      {
        text: "Spørsmålet er P(M̄ | F̄). Bruk definisjonen av betinget sannsynlighet:",
        formula: "P(M̄ | F̄) = P(M̄ ∩ F̄) / P(F̄)",
      },
      {
        text: "De Morgan: M̄ ∩ F̄ er komplementet av M ∪ F.",
        formula: "P(M̄ ∩ F̄) = 1 − P(M ∪ F)",
        conditional: true,
      },
      {
        text: "Regn ut P(M ∪ F) med unionssetningen:",
        formula: "P(M ∪ F) = P(M) + P(F) − P(M ∩ F) = 0.80 + 0.45 − 0.41 = 0.84",
      },
      {
        text: "Da blir teller og nevner:",
        formula: ["P(M̄ ∩ F̄) = 1 − 0.84 = 0.16", "P(F̄) = 1 − 0.45 = 0.55"],
      },
      {
        text: "Sett inn:",
        formula: "P(M̄ | F̄) = 0.16 / 0.55 ≈ 0.291",
        example: true,
      },
    ],
    answer: "P(M̄ | F̄) ≈ 0.291",
  },
  {
    id: "mai25-2c",
    exam: "mai25",
    exam_label: "Mai 2025",
    task: "Oppgave 2c",
    topic: "Total sannsynlighet — tran",
    quote:
      "Undersøkelsene viser at 23 % av jentene og 34 % av guttene drikker tran daglig. I populasjonen er 52 % jenter og 48 % gutter. Hva er sannsynligheten for at et tilfeldig uttrukket barn drikker tran daglig?",
    why_tricky:
      "Spørsmålet høres ut som en enkel sannsynlighet, men gir kun BETINGEDE andeler (per kjønn) og marginalandeler for kjønn. Du må selv gjenkjenne at total sannsynlighet kreves.",
    formula_entry: "total-sannsynlighet",
    formula_tab: "Forover: finn P(B)",
    steps: [
      "Definer hendelser: J = «jente», J̄ = «gutt», T = «drikker tran daglig».",
      {
        text: "Oversett prosentene. De per-kjønn-andelene er betingede, ikke marginale:",
        formula: ["P(J) = 0.52, P(J̄) = 0.48", "P(T|J) = 0.23, P(T|J̄) = 0.34"],
      },
      {
        text: "Total sannsynlighet (kjønn partisjonerer):",
        formula: "P(T) = P(J) · P(T|J) + P(J̄) · P(T|J̄)",
      },
      {
        text: "Sett inn:",
        formula: "P(T) = 0.52 · 0.23 + 0.48 · 0.34 = 0.1196 + 0.1632 = 0.2828",
        example: true,
      },
    ],
    answer: "P(T) ≈ 0.283",
  },
  {
    id: "mai25-4d",
    exam: "mai25",
    exam_label: "Mai 2025",
    task: "Oppgave 4d",
    topic: "Invers normal — finn μ",
    quote:
      "Hva må produsenten justere forventningsverdien til dersom sannsynligheten for å ha mindre enn 300 ml såpe i en tilfeldig valgt såpebeholder, skal være mindre enn 0.001? (σ = 5 ml.)",
    why_tricky:
      "Vanlig normalfordeling-oppgave snudd på hodet: i stedet for å regne sannsynlighet, må du finne ukjent μ gitt en sannsynlighetsulikhet. Du må huske at venstresidig kvantil tilsvarer −z_{0.001} (negativt).",
    formula_entry: "normalfordeling",
    formula_tab: "Invers: finn μ (eller σ)",
    steps: [
      {
        text: "Sett opp likningen P(X < 300) = 0.001 med X ~ N(μ, 5²) og standardiser:",
        formula: "P((X − μ)/5 < (300 − μ)/5) = G((300 − μ)/5) = 0.001",
      },
      {
        text: "Husk at G(z₀.₀₀₁) = 0.001 betyr at vi er i venstre hale — z er negativt:",
        formula: "(300 − μ)/5 = −z_{0.001}",
        conditional: true,
      },
      {
        text: "Slå opp i tabell E.4 (normal-kvantil): z_{0.001} = 3.090, så høyresiden blir −3.090.",
        formula: "(300 − μ)/5 = −3.090",
      },
      {
        text: "Løs for μ:",
        formula: ["300 − μ = −3.090 · 5 = −15.45", "μ = 300 + 15.45 = 315.45"],
        example: true,
      },
    ],
    answer: "μ må være minst 315.45 ml.",
  },

  // ---------------- sept22 ----------------
  {
    id: "sept22-2d",
    exam: "sept22",
    exam_label: "September 2022",
    task: "Oppgave 2d",
    topic: "Binomial — over μ + σ (diskret)",
    quote:
      "Vi trekker tilfeldig 10 vannpistoler. Finn sannsynligheten for at antall vannpistoler med feil overstiger forventningsverdien for antall vannpistoler med feil pluss standardavviket. (Sannsynligheten for at en vannpistol er uten feil er 0.9.)",
    why_tricky:
      "Tre lag av tolkning: (1) variabelbytte fra «uten feil» til «med feil»; (2) regne μ + σ ≈ 1.95 som hybrid grense; (3) tolke «overstiger 1.95» som «≥ 2» siden Y er diskret.",
    formula_entry: "binomial-fordeling",
    formula_tab: "P(X ≥ k)",
    steps: [
      {
        text: "Definer Y = antall vannpistoler MED feil i utvalg på 10. Da er p = 1 − 0.9 = 0.1, så Y ~ Bin(10, 0.1).",
        conditional: true,
      },
      {
        text: "Regn ut forventningsverdi og standardavvik:",
        formula: [
          "μ_Y = n·p = 10 · 0.1 = 1",
          "σ_Y = √(n·p·(1−p)) = √(10·0.1·0.9) = √0.9 ≈ 0.9487",
          "μ_Y + σ_Y ≈ 1.95",
        ],
      },
      {
        text: "Spørsmålet er P(Y > 1.95). Siden Y er diskret, kollapser dette til:",
        formula: "P(Y > 1.95) = P(Y ≥ 2)",
        conditional: true,
      },
      {
        text: "Bruk komplementregelen:",
        formula: "P(Y ≥ 2) = 1 − P(Y ≤ 1)",
      },
      {
        text: "Slå opp i tabell E.1 (kumulativ binomial) med n = 10, p = 0.1. P(Y ≤ 1) = 0.736. Da blir:",
        formula: "P(Y ≥ 2) = 1 − 0.736 = 0.264",
        example: true,
      },
    ],
    answer: "P(Y > μ_Y + σ_Y) = P(Y ≥ 2) ≈ 0.264",
  },
];
