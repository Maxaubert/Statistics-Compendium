import { describe, it, expect } from "vitest";
import { lookupCumulative, computeBonus } from "./distributions";

describe("lookupCumulative — poisson", () => {
  it("returns P(X ≤ 2) for μ = 1.68", () => {
    const v = lookupCumulative({ distribution: "poisson", inputs: { μ: 1.68, k: 2 } });
    expect(v).toBeCloseTo(0.7625, 3);
  });
  it("returns P(X = 0) when k = 0 in poisson", () => {
    const v = lookupCumulative({ distribution: "poisson", inputs: { μ: 1.68, k: 0 } });
    expect(v).toBeCloseTo(Math.exp(-1.68), 3);
  });
});

describe("lookupCumulative — binomial", () => {
  it("returns P(X ≤ 5) for n=10, p=0.5", () => {
    const v = lookupCumulative({
      distribution: "binomial",
      inputs: { n: 10, p: 0.5, k: 5 },
    });
    expect(v).toBeCloseTo(0.6230, 2);
  });
});

describe("computeBonus — poisson", () => {
  it("provides P(X = k) and P(X > k)", () => {
    const bonus = computeBonus({ distribution: "poisson", inputs: { μ: 1.68, k: 2 } });
    expect(bonus.find((b) => b.label.includes("="))?.value).toBeDefined();
    expect(bonus.find((b) => b.label.includes("≥"))?.value).toBeDefined();
  });
});
