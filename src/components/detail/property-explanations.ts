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
};
