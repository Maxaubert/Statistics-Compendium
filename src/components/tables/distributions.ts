import { jStat } from "jstat";

export type DistributionKey =
  | "binomial"
  | "poisson"
  | "normal_cumulative"
  | "normal_quantile"
  | "t_quantile"
  | "chi_squared_quantile";

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
  }
}

export interface BonusValue {
  label: string;
  value: string;
}

export function computeBonus({ distribution, inputs }: LookupRequest): BonusValue[] {
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
