// Eksakte kritiske U-verdier for Mann-Whitney-Wilcoxon-testen.
// Forkast H₀ hvis testobservatoren `U ≤ U_(α, n₁, n₂)`.
// Tosidig α er 2 × ensidig α (kolonneverdien). `null` betyr at signifikans
// ikke kan oppnås på dette α-nivået med de utvalgsstørrelsene (selv U = 0
// har p-verdi > α). Verdier beregnet via uttømmende rang-enumerasjon under H₀.

export const MWW_N_MIN = 2;
export const MWW_N_MAX = 15;

// Indeks: rows[n₁ − 2][n₂ − 2]
export const MWW_TABLES: Record<
  string,
  { label: string; rows: (number | null)[][] }
> = {
  "0.025": {
    label: "α = 0.025 (ensidig)  /  α = 0.05 (tosidig)",
    rows: [
      [null, null, null, null, null, null, 0, 0, 0, 0, 1, 1, 1, 1],
      [null, null, null, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      [null, null, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10],
      [null, 0, 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14],
      [null, 1, 2, 3, 5, 6, 8, 10, 11, 13, 14, 16, 17, 19],
      [null, 1, 3, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      [0, 2, 4, 6, 8, 10, 13, 15, 17, 19, 22, 24, 26, 29],
      [0, 2, 4, 7, 10, 12, 15, 17, 20, 23, 26, 28, 31, 34],
      [0, 3, 5, 8, 11, 14, 17, 20, 23, 26, 29, 33, 36, 39],
      [0, 3, 6, 9, 13, 16, 19, 23, 26, 30, 33, 37, 40, 44],
      [1, 4, 7, 11, 14, 18, 22, 26, 29, 33, 37, 41, 45, 49],
      [1, 4, 8, 12, 16, 20, 24, 28, 33, 37, 41, 45, 50, 54],
      [1, 5, 9, 13, 17, 22, 26, 31, 36, 40, 45, 50, 55, 59],
      [1, 5, 10, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64],
    ],
  },
  "0.05": {
    label: "α = 0.05 (ensidig)  /  α = 0.10 (tosidig)",
    rows: [
      [null, null, null, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3],
      [null, 0, 0, 1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 7],
      [null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      [0, 1, 2, 4, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18],
      [0, 2, 3, 5, 7, 8, 10, 12, 14, 16, 17, 19, 21, 23],
      [0, 2, 4, 6, 8, 11, 13, 15, 17, 19, 21, 24, 26, 28],
      [1, 3, 5, 8, 10, 13, 15, 18, 20, 23, 26, 28, 31, 33],
      [1, 4, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39],
      [1, 4, 7, 11, 14, 17, 20, 24, 27, 31, 34, 37, 41, 44],
      [1, 5, 8, 12, 16, 19, 23, 27, 31, 34, 38, 42, 46, 50],
      [2, 5, 9, 13, 17, 21, 26, 30, 34, 38, 42, 47, 51, 55],
      [2, 6, 10, 15, 19, 24, 28, 33, 37, 42, 47, 51, 56, 61],
      [3, 7, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66],
      [3, 7, 12, 18, 23, 28, 33, 39, 44, 50, 55, 61, 66, 72],
    ],
  },
};

export type MwwAlphaKey = keyof typeof MWW_TABLES;
export const MWW_ALPHA_KEYS: MwwAlphaKey[] = ["0.025", "0.05"];

/** Snap an arbitrary α to the nearest supported one-sided value. */
export function snapMwwAlpha(α: number): MwwAlphaKey {
  let best: MwwAlphaKey = "0.025";
  let bestDist = Infinity;
  for (const k of MWW_ALPHA_KEYS) {
    const d = Math.abs(Number(k) - α);
    if (d < bestDist) {
      bestDist = d;
      best = k;
    }
  }
  return best;
}

/** Return the critical U value for (n₁, n₂, α). NaN if outside the
 *  tabulated range or if no signifikans is possible (table cell = null). */
export function lookupMwwCritical(n1: number, n2: number, α: number): number {
  if (!Number.isFinite(n1) || !Number.isFinite(n2) || !Number.isFinite(α))
    return NaN;
  const n1i = Math.round(n1);
  const n2i = Math.round(n2);
  if (n1i < MWW_N_MIN || n1i > MWW_N_MAX) return NaN;
  if (n2i < MWW_N_MIN || n2i > MWW_N_MAX) return NaN;
  const key = snapMwwAlpha(α);
  const cell = MWW_TABLES[key].rows[n1i - MWW_N_MIN][n2i - MWW_N_MIN];
  return cell == null ? NaN : cell;
}
