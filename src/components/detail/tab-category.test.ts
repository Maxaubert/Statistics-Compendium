import { describe, it, expect } from "vitest";
import { deriveTabMeta } from "./tab-category";

describe("deriveTabMeta", () => {
  it("tags 'Invers: ...' labels as INVERS and capitalises the rest", () => {
    expect(deriveTabMeta("Invers: finn x")).toEqual({
      tag: "INVERS",
      kind: "invers",
      short: "Finn x",
    });
  });

  it("tags 'Finn ...' labels as INVERS without rewriting the short", () => {
    expect(deriveTabMeta("Finn n for terskel")).toEqual({
      tag: "INVERS",
      kind: "invers",
      short: "Finn n for terskel",
    });
  });

  it("tags 'P(...)' labels as FOROVER and drops the descriptive em-dash tail", () => {
    expect(deriveTabMeta("P(T > t) — overlevelse (ingen hendelse innen t)")).toEqual({
      tag: "FOROVER",
      kind: "forover",
      short: "P(T > t)",
    });
  });

  it("extracts hypothesis-direction from a parenthetical suffix", () => {
    expect(deriveTabMeta("H₁: μ < μ₀ (venstre)")).toEqual({
      tag: "VENSTRE",
      kind: "forover",
      short: "H₁: μ < μ₀",
    });
    expect(deriveTabMeta("H₁: μ ≠ μ₀ (tosidig)").tag).toBe("TOSIDIG");
    expect(deriveTabMeta("H₁: μ > μ₀ (høyre)").tag).toBe("HØYRE");
  });

  it("returns no tag for neutral labels and strips a trailing parenthetical", () => {
    expect(deriveTabMeta("Multi-hypotese (3+ partisjoner)")).toEqual({
      tag: null,
      kind: "neutral",
      short: "Multi-hypotese",
    });
  });

  it("returns no tag and the label unchanged for plain neutral labels", () => {
    expect(deriveTabMeta("Standard 2-veis")).toEqual({
      tag: null,
      kind: "neutral",
      short: "Standard 2-veis",
    });
  });
});
