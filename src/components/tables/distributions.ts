import { jStat } from "jstat";
import { lookupMwwCritical, snapMwwAlpha } from "./mann-whitney-table";

export type DistributionKey =
  | "binomial"
  | "poisson"
  | "normal_cumulative"
  | "normal_quantile"
  | "t_quantile"
  | "chi_squared_quantile"
  | "mann_whitney_quantile";

export interface LookupRequest {
  distribution: DistributionKey;
  inputs: Record<string, number>;
}

export function lookupCumulative({ distribution, inputs }: LookupRequest): number {
  switch (distribution) {
    case "poisson":
      return jStat.poisson.cdf(inputs.k, inputs.μ);
    case "binomial":
      return jStat.binomial.cdf(inputs.k, inputs.n, inputs.p);
    case "normal_cumulative":
      return jStat.normal.cdf(inputs.z, 0, 1);
    case "normal_quantile":
      return jStat.normal.inv(1 - inputs.α, 0, 1);
    case "t_quantile":
      return jStat.studentt.inv(1 - inputs.α, inputs.df);
    case "chi_squared_quantile":
      return jStat.chisquare.inv(1 - inputs.α, inputs.df);
    case "mann_whitney_quantile":
      return lookupMwwCritical(inputs["n₁"], inputs["n₂"], inputs.α);
  }
}

/**
 * Inverse direction (e.g. for E.3 in invers-modus): given a probability,
 * return the matching quantile of the same distribution. Right now
 * only the cumulative-normal table has an inverse mode wired up; add
 * cases here when other tables need it.
 */
export function lookupInverse({ distribution, inputs }: LookupRequest): number {
  switch (distribution) {
    case "normal_cumulative":
      return jStat.normal.inv(inputs.p, 0, 1);
    case "normal_quantile":
      // E.4 alternate parameterization: input is cumulative p (left-tail),
      // output is z such that P(Z ≤ z) = p. Same math as the cumulative-normal
      // inverse — different framing for the user.
      return jStat.normal.inv(inputs.p, 0, 1);
    default:
      throw new Error(`No inverse defined for distribution "${distribution}"`);
  }
}

export interface BonusValue {
  label: string;
  value: string;
}

/**
 * Bonus values surfaced when the user is in inverse mode for the
 * cumulative-normal table — the things you actually want when you've
 * just looked up a quantile (the complementary tail, the two-sided
 * critical value).
 */
export function computeInverseBonus({ distribution, inputs }: LookupRequest): BonusValue[] {
  if (distribution === "normal_cumulative" || distribution === "normal_quantile") {
    const p = inputs.p;
    if (p <= 0 || p >= 1 || Number.isNaN(p)) return [];
    const z = jStat.normal.inv(p, 0, 1);
    const zComplement = jStat.normal.inv(1 - p, 0, 1);
    const alpha = 1 - p; // treat p as 1 − α (one-sided critical-value framing)
    const zTwoSided = jStat.normal.inv(1 - alpha / 2, 0, 1);
    return [
      {
        label: `z for kompl. (1 − p = ${(1 - p).toFixed(4)})`,
        value: `≈ ${zComplement.toFixed(4)}  (= −z)`,
      },
      {
        label: `Symmetri-sjekk: −z`,
        value: `≈ ${(-z).toFixed(4)}`,
      },
      {
        label: `Tosidig kritisk z_(α/2), α = ${alpha.toFixed(4)}`,
        value: `≈ ${zTwoSided.toFixed(4)}`,
      },
    ];
  }
  return [];
}

export function computeBonus({ distribution, inputs }: LookupRequest): BonusValue[] {
  if (distribution === "mann_whitney_quantile") {
    const key = snapMwwAlpha(inputs.α);
    const oneSided = Number(key);
    const twoSided = 2 * oneSided;
    return [
      {
        label: "Tilsvarende tosidig α",
        value: `${twoSided}`,
      },
      {
        label: "Forkastingsregel (ensidig)",
        value: "Forkast H₀ hvis U ≤ U_crit",
      },
      {
        label: "Forkastingsregel (tosidig)",
        value: "Forkast H₀ hvis min(U₁, U₂) ≤ U_crit",
      },
    ];
  }
  if (distribution === "poisson") {
    const cdf = jStat.poisson.cdf(inputs.k, inputs.μ);
    const pmf = jStat.poisson.pdf(inputs.k, inputs.μ);
    return [
      { label: `P(X = ${inputs.k})`, value: `≈ ${pmf.toFixed(4)}` },
      {
        label: `P(X ≥ ${inputs.k + 1}) = 1 − P(X ≤ ${inputs.k})`,
        value: `≈ ${(1 - cdf).toFixed(4)}`,
      },
    ];
  }
  if (distribution === "binomial") {
    const cdf = jStat.binomial.cdf(inputs.k, inputs.n, inputs.p);
    const pmf = jStat.binomial.pdf(inputs.k, inputs.n, inputs.p);
    return [
      { label: `P(X = ${inputs.k})`, value: `≈ ${pmf.toFixed(4)}` },
      { label: `P(X ≥ ${inputs.k + 1})`, value: `≈ ${(1 - cdf).toFixed(4)}` },
    ];
  }
  return [];
}
