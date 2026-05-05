import { describe, it, expect } from "vitest";
import { deriveTabMeta } from "./tab-category";

describe("deriveTabMeta", () => {
  it("derives 'Mindre enn' / 'Større enn' / 'Intervall' from P(X<x), P(X>x), P(a<X<b)", () => {
    expect(deriveTabMeta("P(X < x)")).toEqual({
      tag: "FOROVER",
      kind: "forover",
      short: "Mindre enn",
      formula: "P(X < x)",
    });
    expect(deriveTabMeta("P(X > x)").short).toBe("Større enn");
    expect(deriveTabMeta("P(a < X < b)").short).toBe("Intervall");
  });

  it("recognises P(X = k), P(X ≤ k), P(X ≥ k), P(X = 0) shapes", () => {
    expect(deriveTabMeta("P(X = k)").short).toBe("Eksakt k");
    expect(deriveTabMeta("P(X ≤ k)").short).toBe("Maks k");
    expect(deriveTabMeta("P(X ≥ k)").short).toBe("Minst k");
    expect(deriveTabMeta("P(X = 0)").short).toBe("Ingen");
  });

  it("uses the em-dash tail as the natural-language name", () => {
    expect(deriveTabMeta("P(T > t) — overlevelse (ingen hendelse innen t)")).toEqual({
      tag: "FOROVER",
      kind: "forover",
      short: "Overlevelse",
      formula: "P(T > t)",
    });
  });

  it("captures hypothesis-test direction in the trailing parens", () => {
    expect(deriveTabMeta("H₁: μ < μ₀ (venstre)")).toEqual({
      tag: "VENSTRE",
      kind: "forover",
      short: "Venstre",
      formula: "H₁: μ < μ₀",
    });
    expect(deriveTabMeta("H₁: μ ≠ μ₀ (tosidig)").tag).toBe("TOSIDIG");
    expect(deriveTabMeta("H₁: μ > μ₀ (høyre)").tag).toBe("HØYRE");
  });

  it("strips the 'Invers:' prefix and the parenthetical when forming the short name", () => {
    expect(deriveTabMeta("Invers: finn x")).toMatchObject({
      tag: "INVERS",
      kind: "invers",
      short: "Finn x",
    });
    expect(deriveTabMeta("Invers: finn μ (eller σ)").short).toBe("Finn μ");
  });

  it("handles 'Finn n for terskel' style as INVERS · 'Finn n'", () => {
    expect(deriveTabMeta("Finn n for terskel")).toMatchObject({
      tag: "INVERS",
      short: "Finn n",
    });
    expect(deriveTabMeta("Finn k for terskel").short).toBe("Finn k");
  });

  it("treats 'Memoryless (...)' as a neutral single-word name", () => {
    expect(deriveTabMeta("Memoryless (gitt at det ikke har skjedd noe i s minutter)")).toMatchObject({
      tag: null,
      kind: "neutral",
      short: "Memoryless",
    });
  });

  it("falls back to a cleaned label for plain neutral cases", () => {
    expect(deriveTabMeta("Standard 2-veis").short).toBe("Standard 2-veis");
    expect(deriveTabMeta("Multi-hypotese (3+ partisjoner)").short).toBe("Multi-hypotese");
  });

  it("recognises Sum/Differanse/Lineær kombinasjon", () => {
    expect(deriveTabMeta("Sum X+Y").short).toBe("Sum");
    expect(deriveTabMeta("Differanse X−Y").short).toBe("Differanse");
    expect(deriveTabMeta("Lineær kombinasjon aX+bY").short).toBe("Lineær");
  });
});
