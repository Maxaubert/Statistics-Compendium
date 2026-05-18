export interface PropertyExplanation {
  /** Big formula to show in the modal header band. */
  formula: string;
  /** 1-2 sentence plain-language explanation, no derivation. */
  intuition: string;
  /** Ordered derivation steps. Each section is a labelled mini-card with one or more body lines. */
  derivation: { label: string; lines: string[]; note?: string }[];
  /** Concrete numeric example to anchor the formula in something real. */
  example?: { setup: string; result: string };
}

/**
 * Per-entry explanations for the Egenskaper cards. Keys are the
 * property keys from the YAML schema (`expected_value`, `variance`,
 * `std_dev`). When an entry has an explanation map, its property
 * cards become clickable and open a modal showing intuition,
 * derivation and an example.
 */
export const PROPERTY_EXPLANATIONS: Record<
  string,
  Record<string, PropertyExplanation>
> = {
  "binomial-fordeling": {
    expected_value: {
      formula: "E[X] = np",
      intuition:
        "Hver av de n forsøkene bidrar i snitt med p suksesser. Linearitet av forventning lar oss summere bidragene fra alle forsøkene.",
      derivation: [
        {
          label: "Bernoulli per forsøk",
          lines: [
            "La `X_i = 1` hvis forsøk `i` er en suksess, ellers `X_i = 0`.",
            "`E[X_i] = 1 · p + 0 · (1 − p) = p`.",
          ],
          note: "`0 · (1 − p)` blir åpenbart 0 og kunne droppes — vi tar det med for å vise at vi bruker den generelle formelen `E[X] = Σ x · P(X = x)` over begge utfall.",
        },
        {
          label: "Total antall suksesser",
          lines: ["`X = X_1 + X_2 + ... + X_n`."],
        },
        {
          label: "Linearitet av forventning",
          lines: [
            "`E[X] = E[X_1] + E[X_2] + ... + E[X_n]`",
            "`     = p + p + ... + p = n · p`.",
          ],
        },
      ],
      example: {
        setup: "n = 10, p = 0.30",
        result: "E[X] = 10 · 0.30 = 3 suksesser",
      },
    },
    variance: {
      formula: "Var[X] = np(1 − p)",
      intuition:
        "Hvert uavhengige forsøk har varians p(1 − p). Variansen til summen av uavhengige variable er summen av variansene, så totalen blir n · p(1 − p).",
      derivation: [
        {
          label: "Varians per Bernoulli",
          lines: [
            "`Var(X_i) = E[X_i²] − (E[X_i])²`.",
            "Siden `X_i ∈ {0, 1}` er `X_i² = X_i`, så `E[X_i²] = p`.",
            "`Var(X_i) = p − p² = p(1 − p)`.",
          ],
        },
        {
          label: "Uavhengige forsøk",
          lines: [
            "Forsøkene er uavhengige, så variansen til summen er summen av de individuelle variansene.",
          ],
        },
        {
          label: "Sum over n forsøk",
          lines: [
            "`Var(X) = Var(X_1) + ... + Var(X_n)`",
            "`       = n · p(1 − p)`.",
          ],
        },
      ],
      example: {
        setup: "n = 10, p = 0.30",
        result: "Var[X] = 10 · 0.30 · 0.70 = 2.1",
      },
    },
    std_dev: {
      formula: "σ = √(np(1 − p))",
      intuition:
        "Standardavviket er kvadratroten av variansen. Det gir et typisk avvik fra forventet antall, målt i samme enhet som X (antall suksesser).",
      derivation: [
        {
          label: "Definisjon",
          lines: ["`σ = √Var(X)` per definisjon av standardavvik."],
        },
        {
          label: "Innsetting",
          lines: ["`σ = √(n · p · (1 − p))`."],
        },
      ],
      example: {
        setup: "n = 10, p = 0.30",
        result: "σ = √2.1 ≈ 1.449",
      },
    },
  },

  normalfordeling: {
    expected_value: {
      formula: "E[X] = μ",
      intuition:
        "Normalfordelingen N(μ, σ²) er definert slik at μ ER forventningsverdien. Tetthetskurven er symmetrisk rundt μ, så toppen, medianen og massesentret faller alle sammen.",
      derivation: [
        {
          label: "Definisjon",
          lines: [
            "Tetthet: `f(x) = (1/(σ√(2π))) · exp(−(x−μ)²/(2σ²))`.",
            "Funksjonen er symmetrisk om `x = μ`.",
          ],
        },
        {
          label: "Forventning fra integralet",
          lines: [
            "`E[X] = ∫ x · f(x) dx`.",
            "Substituer `u = x − μ`: integrandelen splittes i `u · f(u + μ)` (oddetallsdel — integreres til 0) og `μ · f(u + μ)`.",
            "`μ · ∫ f(u + μ) du = μ · 1 = μ` siden tettheten har totalmasse 1.",
            "`E[X] = μ`.",
          ],
        },
      ],
      example: {
        setup: "X ~ N(170, 6²) — kroppshøyde i cm",
        result: "E[X] = 170 cm",
      },
    },
    variance: {
      formula: "Var[X] = σ²",
      intuition:
        "σ² er spredningsparameteren i N(μ, σ²) — variansen ER andre parameter per definisjon. Den måler hvor mye X typisk avviker kvadratisk fra μ.",
      derivation: [
        {
          label: "Definisjon",
          lines: ["`Var[X] = E[(X − μ)²] = ∫ (x − μ)² · f(x) dx`."],
        },
        {
          label: "Standardiser med substitusjon",
          lines: [
            "Sett `u = (x − μ)/σ` slik at `du = dx/σ`.",
            "`Var[X] = σ² · ∫ u² · φ(u) du` der `φ(u) = (1/√(2π)) · exp(−u²/2)`.",
          ],
        },
        {
          label: "Standard-integralet",
          lines: [
            "`∫ u² · φ(u) du = 1` (kjent integral for standardnormalen).",
            "`Var[X] = σ² · 1 = σ²`.",
          ],
        },
      ],
      example: {
        setup: "X ~ N(170, 6²)",
        result: "Var[X] = 36 cm²",
      },
    },
    std_dev: {
      formula: "σ = √(σ²)",
      intuition:
        "Standardavviket er den naturlige spredningen i samme enhet som X. I praksis ligger ca. 68 % av observasjonene innenfor μ ± σ.",
      derivation: [
        {
          label: "Definisjon",
          lines: ["`σ = √Var[X] = √σ²`."],
        },
        {
          label: "68–95–99.7-regelen",
          lines: [
            "`P(μ − σ < X < μ + σ) ≈ 0.68`.",
            "`P(μ − 2σ < X < μ + 2σ) ≈ 0.95`.",
            "`P(μ − 3σ < X < μ + 3σ) ≈ 0.997`.",
          ],
        },
      ],
      example: {
        setup: "X ~ N(170, 36) → σ = 6 cm",
        result: "Ca. 68 % har høyde mellom 164 og 176 cm",
      },
    },
  },

  "eksponential-fordeling": {
    expected_value: {
      formula: "E[T] = 1/λ",
      intuition:
        "Hvis hendelser kommer med rate λ pr. tidsenhet, er forventet ventetid til neste hendelse i snitt 1/λ. Høy rate → kort ventetid.",
      derivation: [
        {
          label: "Definisjon",
          lines: [
            "Tetthet: `f(t) = λ · e^(−λt)` for `t ≥ 0`.",
            "`E[T] = ∫₀^∞ t · λ · e^(−λt) dt`.",
          ],
        },
        {
          label: "Delvis integrasjon",
          lines: [
            "Sett `u = t`, `dv = λ · e^(−λt) dt`, så `du = dt` og `v = −e^(−λt)`.",
            "`E[T] = [−t · e^(−λt)]₀^∞ + ∫₀^∞ e^(−λt) dt`.",
            "`     = 0 + 1/λ = 1/λ`.",
          ],
        },
      ],
      example: {
        setup: "Kunder kommer med rate λ = 6 pr. time",
        result: "Forventet ventetid: 1/6 time = 10 min",
      },
    },
    variance: {
      formula: "Var[T] = 1/λ²",
      intuition:
        "Variansen vokser kvadratisk når raten avtar. Kortere forventet ventetid betyr også mindre spredning rundt den.",
      derivation: [
        {
          label: "Beregn E[T²]",
          lines: [
            "`E[T²] = ∫₀^∞ t² · λ · e^(−λt) dt = 2/λ²`",
            "(delvis integrasjon to ganger).",
          ],
        },
        {
          label: "Varians fra moment",
          lines: [
            "`Var[T] = E[T²] − (E[T])²`",
            "`       = 2/λ² − (1/λ)² = 1/λ²`.",
          ],
        },
      ],
      example: {
        setup: "λ = 6 pr. time",
        result: "Var[T] = 1/36 time² ≈ 0.0278 time²",
      },
    },
    std_dev: {
      formula: "σ = 1/λ",
      intuition:
        "Standardavviket er nøyaktig like stort som forventet ventetid. Eksponentialfordelingen er svært skjev og har en lang hale, så avstanden fra null til snittet matcher den typiske spredningen.",
      derivation: [
        {
          label: "Innsetting",
          lines: ["`σ = √Var[T] = √(1/λ²) = 1/λ`."],
        },
        {
          label: "Konsekvens",
          lines: [
            "Siden `σ = E[T]`, er fordelingen høyt skjev: noen ventetider er svært korte, andre svært lange.",
          ],
        },
      ],
      example: {
        setup: "λ = 6 pr. time",
        result: "σ = 1/6 time = 10 min",
      },
    },
  },

  "poisson-fordeling": {
    expected_value: {
      formula: "E[X] = λt",
      intuition:
        "Med rate λ hendelser pr. tidsenhet (eller romenhet) over et intervall av lengde t, er forventet antall hendelser λt — ren rate × lengde.",
      derivation: [
        {
          label: "Sannsynlighetsmodell",
          lines: [
            "`P(X = k) = e^(−λt) · (λt)^k / k!` for `k = 0, 1, 2, …`",
          ],
        },
        {
          label: "Beregn E[X]",
          lines: [
            "`E[X] = Σ_{k=0}^∞ k · e^(−λt) · (λt)^k / k!`",
            "k=0-leddet er 0, og for k ≥ 1 er `k/k! = 1/(k−1)!`:",
            "`     = e^(−λt) · λt · Σ_{j=0}^∞ (λt)^j / j!`",
            "`     = e^(−λt) · λt · e^(λt) = λt`.",
          ],
        },
      ],
      example: {
        setup: "λ = 3 telefonsamtaler/time, t = 2 timer",
        result: "E[X] = 6 samtaler",
      },
    },
    variance: {
      formula: "Var[X] = λt",
      intuition:
        "Et særtrekk ved Poisson: variansen er nøyaktig lik forventningsverdien. Hvis du observerer `Var ≠ E` i data, er Poisson sannsynligvis ikke en god modell.",
      derivation: [
        {
          label: "Beregn E[X(X−1)]",
          lines: [
            "`E[X(X−1)] = Σ k(k−1) · e^(−λt) · (λt)^k / k!`",
            "Samme grep som for E[X], men leddene starter ved k = 2:",
            "`         = (λt)²`.",
          ],
        },
        {
          label: "Varians fra E[X²]",
          lines: [
            "`E[X²] = E[X(X−1)] + E[X] = (λt)² + λt`.",
            "`Var[X] = E[X²] − (E[X])² = (λt)² + λt − (λt)² = λt`.",
          ],
        },
      ],
      example: {
        setup: "λ = 3, t = 2 → E[X] = 6",
        result: "Var[X] = 6",
      },
    },
    std_dev: {
      formula: "σ = √(λt)",
      intuition:
        "Standardavviket vokser med kvadratroten av forventet antall — så jo større intervall, desto relativt mindre spredning sammenlignet med snittet (signal/støy bedres).",
      derivation: [
        {
          label: "Definisjon",
          lines: ["`σ = √Var[X] = √(λt)`."],
        },
      ],
      example: {
        setup: "λt = 6",
        result: "σ = √6 ≈ 2.449",
      },
    },
  },

  "hypergeometrisk-fordeling": {
    expected_value: {
      formula: "E[X] = n · K/N",
      intuition:
        "Trekker du n elementer uten tilbakelegging fra en pott på N hvor K er suksesser, er forventet antall trukne suksesser bare n ganger andelen K/N — samme form som binomial.",
      derivation: [
        {
          label: "Indikator-trick",
          lines: [
            "La `X_i = 1` hvis trekk `i` er en suksess, ellers 0. Da er `X = X_1 + … + X_n`.",
            "Selv uten tilbakelegging er `P(X_i = 1) = K/N` for ALLE `i` (symmetri — alle posisjoner er likt-fordelte marginalt).",
          ],
        },
        {
          label: "Linearitet",
          lines: [
            "`E[X] = Σ_{i=1}^n E[X_i] = n · K/N`.",
            "Linearitet av forventning krever IKKE uavhengighet, så dette virker selv om trekkene er avhengige.",
          ],
        },
      ],
      example: {
        setup: "N = 20 kort (K = 4 ess), trekk n = 5",
        result: "E[X] = 5 · 4/20 = 1 ess",
      },
    },
    variance: {
      formula: "Var[X] = n · K/N · (N−K)/N · (N−n)/(N−1)",
      intuition:
        "Samme form som binomial `n · p · (1−p)`, men ganget med en finpopulasjons-korreksjon `(N−n)/(N−1)` som krymper variansen — fordi trekkene er negativt korrelerte (én suksess fjerner sjansen for en til).",
      derivation: [
        {
          label: "Bidrag fra hver indikator",
          lines: ["`Var(X_i) = (K/N) · (1 − K/N)` (Bernoulli-varians)."],
        },
        {
          label: "Negativ kovarians mellom trekk",
          lines: [
            "Trekker du suksess i trekk `i`, er det færre suksesser igjen til trekk `j`, så `Cov(X_i, X_j) < 0`.",
            "`Cov(X_i, X_j) = −(1/(N−1)) · (K/N) · (1 − K/N)`.",
          ],
        },
        {
          label: "Sum av varianser + kovarianser",
          lines: [
            "`Var[X] = Σ Var(X_i) + Σ_{i≠j} Cov(X_i, X_j)`",
            "`       = n · (K/N)(1−K/N) · [1 − (n−1)/(N−1)]`",
            "`       = n · (K/N) · (N−K)/N · (N−n)/(N−1)`.",
          ],
        },
      ],
      example: {
        setup: "N = 20, K = 4, n = 5",
        result: "Var[X] = 5 · 0.2 · 0.8 · 15/19 ≈ 0.632",
      },
    },
  },
  "lineaer-regresjon": {
    expected_value: {
      formula: "E[β̂] = β",
      intuition:
        "Minste-kvadraters-estimatet `β̂` er forventningsrett: i gjennomsnitt over mange repeterte utvalg treffer det den sanne populasjonsstigningen `β`. Det betyr at det ikke er systematisk for høyt eller for lavt — bare mer eller mindre presist avhengig av `n` og spredningen i `x`.",
      derivation: [
        {
          label: "Modellantakelse",
          lines: [
            "`Y_i = α + β·x_i + ε_i` der `ε_i ~ N(0, σ²)` er uavhengige.",
            "x-verdiene er FASTE (ikke tilfeldige), bare `Y_i` har tilfeldighet via `ε_i`.",
          ],
        },
        {
          label: "Skriv β̂ som lineær kombinasjon av Y_i",
          lines: [
            "`β̂ = S_XY / S_XX = Σ(x_i − x̄)(Y_i − Ȳ) / S_XX`.",
            "Siden `Σ(x_i − x̄) = 0`, kan man skrive om til:",
            "`β̂ = Σ c_i · Y_i`  der  `c_i = (x_i − x̄) / S_XX`.",
          ],
          note: "Dette skrives ofte som `β̂ er lineær i Y` — nyttig for å regne ut både forventning og varians.",
        },
        {
          label: "Forventning",
          lines: [
            "`E[β̂] = Σ c_i · E[Y_i] = Σ c_i · (α + β·x_i)`.",
            "`     = α · Σc_i + β · Σ c_i·x_i`.",
            "Innsetting gir `Σc_i = 0` og `Σc_i·x_i = 1`, så:",
            "`E[β̂] = β`. ✓",
          ],
        },
      ],
      example: {
        setup: "Eksamen jan26 oppg 6: β̂ = 6.63",
        result: "Estimatet treffer i snitt populasjonsstigningen β (men én enkelt verdi 6.63 har usikkerhet SE(β̂) = 0.625)",
      },
    },
    variance: {
      formula: "Var(β̂) = σ² / S_XX",
      intuition:
        "Variansen i estimatet faller når (a) støyen i Y er liten (`σ²` liten), og (b) `x`-verdiene er godt spredt (`S_XX` stor). Klumper du alle observasjoner ved samme x har du ingen hevarm til å bestemme stigningen — `S_XX → 0` ⇒ `Var(β̂) → ∞`.",
      derivation: [
        {
          label: "β̂ som lineær kombinasjon",
          lines: [
            "`β̂ = Σ c_i · Y_i`  med  `c_i = (x_i − x̄) / S_XX`.",
            "`Y_i` er uavhengige med `Var(Y_i) = σ²` (samme σ² for alle).",
          ],
        },
        {
          label: "Variansen til en lineær kombinasjon",
          lines: [
            "Uavhengighet ⇒ `Var(Σ c_i · Y_i) = Σ c_i² · Var(Y_i) = σ² · Σ c_i²`.",
          ],
        },
        {
          label: "Regn ut Σc_i²",
          lines: [
            "`Σ c_i² = Σ ((x_i − x̄)/S_XX)² = (1/S_XX²) · Σ(x_i − x̄)²`",
            "`      = (1/S_XX²) · S_XX = 1/S_XX`.",
          ],
        },
        {
          label: "Sett sammen",
          lines: [
            "`Var(β̂) = σ² · (1/S_XX) = σ² / S_XX`. ✓",
          ],
          note: "I praksis kjenner vi ikke σ² og erstatter med estimatet S_E², som gir den ESTIMERTE variansen `S_E² / S_XX`.",
        },
      ],
      example: {
        setup: "S_E² = 6.093, S_XX = 15.6",
        result: "estimert Var(β̂) = 6.093 / 15.6 ≈ 0.391",
      },
    },
    std_dev: {
      formula: "SE(β̂) = √(S_E² / S_XX)",
      intuition:
        "Kvadratrota av (estimert) Var(β̂). Står direkte i hypotesetesten `T = β̂ / SE(β̂)` og i konfidensintervallet `β̂ ± t · SE(β̂)`. Liten SE(β̂) ⇒ presist estimat ⇒ smale intervaller og høy test-styrke.",
      derivation: [
        {
          label: "Ta kvadratrot av variansen",
          lines: [
            "`SD(β̂) = √Var(β̂) = √(σ² / S_XX) = σ / √S_XX`.",
            "Erstatt σ med estimatet S_E (vi vet ikke σ):",
            "`SE(β̂) = S_E / √S_XX = √(S_E² / S_XX)`.",
          ],
        },
        {
          label: "Hvorfor T blir t-fordelt (ikke Z)",
          lines: [
            "Hadde σ vært KJENT, ville (β̂ − β)/(σ/√S_XX) vært standardnormal Z.",
            "Vi estimerer σ med S_E som har sin egen tilfeldighet, så",
            "`T = (β̂ − β) / SE(β̂)` blir t-fordelt med `n − 2` frihetsgrader.",
          ],
          note: "Frihetsgrader er n − 2 fordi to parametre (α̂, β̂) er estimert fra dataene.",
        },
        {
          label: "Brukes overalt",
          lines: [
            "Hypotesetest: `T = β̂ / SE(β̂)` mot `t_(α/2, n−2)`.",
            "KI for β: `β̂ ± t_(α/2, n−2) · SE(β̂)`.",
            "Prediksjonsintervall: via identiteten `S_XX = (S_E / SE(β̂))²`.",
          ],
        },
      ],
      example: {
        setup: "S_E² = 6.093, S_XX = 15.6",
        result: "SE(β̂) = √(6.093 / 15.6) ≈ 0.625",
      },
    },
  },

  "enveis-anova": {
    expected_value: {
      formula: "E[F | H₀] = df₂ / (df₂ − 2)",
      intuition:
        "Under H₀ er F-fordelingen sentrert nær 1. Den eksakte forventningen er litt over 1 (skjevhet til høyre), og nærmer seg 1 når nevnerfrihetsgradene df₂ vokser. Dette forklarer hvorfor en F-verdi nær 1 stemmer med H₀ — du må vesentlig over 1 før resultatet blir signifikant.",
      derivation: [
        {
          label: "F-fordelingen",
          lines: [
            "F er definert som forholdet mellom to uavhengige kjikvadrat-fordelte variabler, hver delt på sine frihetsgrader:",
            "`F = (χ²_1 / df₁) / (χ²_2 / df₂)`.",
            "Telleren `MSG = SSG/(k−1)` og nevneren `MSE = SSE/(n−k)` er nettopp slike skalerte kjikvadrater under H₀.",
          ],
        },
        {
          label: "Forventning av en kjikvadrat-skala",
          lines: [
            "`E[χ²_df / df] = 1` for enhver `df` (siden `E[χ²_df] = df`).",
            "Men forventning av et FORHOLD er ikke forholdet av forventningene, så `E[F] ≠ 1` eksakt.",
          ],
        },
        {
          label: "Eksakt verdi",
          lines: [
            "Standard resultat for F-fordelingen:",
            "`E[F] = df₂ / (df₂ − 2)`,  gyldig for `df₂ > 2`.",
            "Sjekk: med `df₂ → ∞` får vi `E[F] → 1`, som matcher intuisjonen om at MSG og MSE estimerer samme σ² under H₀.",
          ],
          note: "For `df₂ ≤ 2` er forventningen uendelig — F-fordelingen har for tunge haler. I praksis er dette ikke aktuelt siden `df₂ = n − k` og du trenger flere observasjoner enn grupper.",
        },
      ],
      example: {
        setup: "k = 3 grupper, n = 15 observasjoner → df₂ = 12",
        result: "E[F | H₀] = 12 / 10 = 1.20  (litt over 1 på grunn av skjevhet)",
      },
    },
    variance: {
      formula: "Var[F | H₀] = 2·df₂²·(df₁ + df₂ − 2) / (df₁·(df₂ − 2)²·(df₂ − 4))",
      intuition:
        "Variansen til F under H₀ er ALLTID større enn variansen til en N(1, …)-tilnærming ville tilsi. Den krymper når begge frihetsgradene vokser, og den krever `df₂ > 4` for å være endelig. Dette er grunnen til at F-tabellens kritiske verdier ligger godt over 1 — selv tilfeldig variasjon kan gi F i området 2–4 når frihetsgradene er moderate.",
      derivation: [
        {
          label: "F som forhold av kjikvadrater",
          lines: [
            "`F = (χ²_(df₁) / df₁) / (χ²_(df₂) / df₂)`.",
            "Telleren og nevneren er uavhengige under H₀.",
          ],
        },
        {
          label: "Standard resultat",
          lines: [
            "Fra teorien for F-fordelingen (kommer fra moment-genererende funksjoner):",
            "`Var[F] = 2·df₂² · (df₁ + df₂ − 2) / (df₁ · (df₂ − 2)² · (df₂ − 4))`,",
            "gyldig for `df₂ > 4` (ellers uendelig).",
          ],
        },
        {
          label: "Grenseatferd",
          lines: [
            "Når både `df₁` og `df₂` vokser, går `Var[F] → 0` og F-fordelingen samler seg rundt 1.",
            "Med store frihetsgrader trenger du ikke ekstrem F for å forkaste — `F_(0.05, ∞, ∞) = 1`, dvs. enhver F merkbart over 1 blir signifikant.",
          ],
        },
      ],
      example: {
        setup: "df₁ = 2, df₂ = 12 (typisk ANOVA, k = 3, n = 15)",
        result: "Var[F | H₀] = 2·144·12 / (2·100·8) = 3456/1600 = 2.16  (σ ≈ 1.47)",
      },
    },
    std_dev: {
      formula: "σ_F = √Var[F | H₀]",
      intuition:
        "Standardavviket til F under H₀ er på samme skala som F selv. For typiske eksamens-størrelser (k = 3, n = 15) er σ_F ≈ 1.5 — derfor må F lande godt over 1 + 2σ ≈ 4 før vi er sikre på at H₀ er feil. Den kritiske verdien F_(0.05, 2, 12) ≈ 3.89 er konsistent med dette.",
      derivation: [
        {
          label: "Definisjon",
          lines: ["`σ_F = √Var[F]` per definisjon av standardavvik."],
        },
        {
          label: "Innsetting",
          lines: [
            "`σ_F = √(2·df₂²·(df₁ + df₂ − 2) / (df₁·(df₂ − 2)²·(df₂ − 4)))`.",
            "Krever `df₂ > 4`. For mindre nevnerfrihetsgrader er F-fordelingen så langhalet at variansen ikke eksisterer.",
          ],
        },
      ],
      example: {
        setup: "df₁ = 2, df₂ = 12",
        result: "σ_F = √2.16 ≈ 1.47  (F-tabellen krever ~2.6 σ over 1 for å forkaste på α = 0.05)",
      },
    },
  },
  "geometrisk-fordeling": {
    expected_value: {
      formula: "E[X] = 1/p",
      intuition:
        "I snitt trengs 1/p forsøk for å lykkes én gang. Sannsynligheten per forsøk er p, så det går «én suksess per 1/p forsøk» i det lange løp.",
      derivation: [
        {
          label: "Forventningsverdi via sum",
          lines: [
            "`E[X] = Σ_{k=1}^∞ k · P(X = k)`",
            "`     = Σ_{k=1}^∞ k · p · (1 − p)^(k−1)`",
            "`     = p · Σ_{k=1}^∞ k · q^(k−1)`   (der `q = 1 − p`)",
          ],
        },
        {
          label: "Identitet for den indre summen",
          lines: [
            "Den geometriske summen `Σ_{k=0}^∞ q^k = 1/(1 − q)` (for `|q| < 1`).",
            "Derivere mht. `q` ledd for ledd: `Σ_{k=1}^∞ k · q^(k−1) = 1/(1 − q)²`.",
          ],
          note: "Med `q = 1 − p` er `1 − q = p`, så `1/(1 − q)² = 1/p²`.",
        },
        {
          label: "Sett inn",
          lines: [
            "`E[X] = p · (1/p²) = 1/p`",
          ],
        },
      ],
      example: {
        setup: "Terning, første sekser: p = 1/6",
        result: "E[X] = 1/(1/6) = 6 kast i snitt",
      },
    },
    variance: {
      formula: "Var[X] = (1 − p)/p²",
      intuition:
        "Variansen vokser raskt når p blir liten — for sjeldne suksesser er ventetiden ekstremt uforutsigbar (noen lykkes tidlig, andre må prøve veldig lenge).",
      derivation: [
        {
          label: "Bruk Var(X) = E[X²] − (E[X])²",
          lines: [
            "Vi vet `E[X] = 1/p`. Det gjenstår å regne `E[X²]`.",
          ],
        },
        {
          label: "E[X²] via samme identitet",
          lines: [
            "`E[X²] = Σ_{k=1}^∞ k² · p · q^(k−1)`",
            "Indre sum: `Σ k² · q^(k−1) = (1 + q) / (1 − q)³ = (2 − p) / p³`.",
            "`E[X²] = p · (2 − p)/p³ = (2 − p)/p²`",
          ],
          note: "Den indre summen utledes ved å derivere `Σ k·q^k = q/(1−q)²` mht. `q` en gang til.",
        },
        {
          label: "Sett sammen",
          lines: [
            "`Var(X) = E[X²] − (E[X])²`",
            "`       = (2 − p)/p² − (1/p)²`",
            "`       = (2 − p)/p² − 1/p²`",
            "`       = (2 − p − 1)/p² = (1 − p)/p²`",
          ],
        },
      ],
      example: {
        setup: "Terning, p = 1/6",
        result: "Var[X] = (5/6)/(1/36) = 30  (σ ≈ 5.48 — nesten like stor som E[X])",
      },
    },
    std_dev: {
      formula: "σ = √((1 − p)/p²) = √(1 − p)/p",
      intuition:
        "For små p er σ ≈ 1/p ≈ E[X], dvs. spredningen er like stor som forventningen. Geometrisk fordeling har en svært lang høyrehale.",
      derivation: [
        {
          label: "Definisjon",
          lines: [
            "`σ = √Var(X) = √((1 − p)/p²)`.",
            "Flytt `p²` ut av rota: `σ = √(1 − p) / p`.",
          ],
        },
        {
          label: "Grense for små p",
          lines: [
            "Når `p → 0` er `√(1 − p) → 1`, så `σ → 1/p = E[X]`.",
            "Variasjonskoeffisienten `σ/E[X] = √(1 − p) → 1` — fordelingen er like vid som senteret.",
          ],
          note: "Dette gjenspeiler at jo sjeldnere suksessen er, jo mer usikker blir ventetiden.",
        },
      ],
      example: {
        setup: "Terning, p = 1/6",
        result: "σ = √(5/6)/(1/6) = 6·√(5/6) = √30 ≈ 5.48",
      },
    },
  },
};
