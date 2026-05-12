import { describe, it, expect } from "vitest";
import {
  buildAliasIndex,
  findGlossaryLinks,
  type GlossaryAlias,
} from "./glossary-link";
import type { GlossaryTerm } from "./schema";

function term(id: string, term_no: string, aliases?: string[]): GlossaryTerm {
  return { id, filters: {}, term_no, short_def: "x", aliases };
}

describe("buildAliasIndex", () => {
  it("uses explicit aliases when given, longest first", () => {
    const idx = buildAliasIndex([
      term("sv", "Stokastisk variabel", [
        "stokastisk variabel",
        "stokastisk",
        "stokastiske",
      ]),
    ]);
    const aliases = idx.map((a) => a.alias);
    // Longest must be first.
    expect(aliases[0]).toBe("stokastisk variabel");
    // All explicit aliases retained.
    expect(aliases).toContain("stokastisk");
    expect(aliases).toContain("stokastiske");
  });

  it("falls back to cleaned term_no when aliases missing and expands inflections", () => {
    const idx = buildAliasIndex([term("sigma", "Standardavvik (σ, s)")]);
    const aliases = idx.map((a) => a.alias).sort();
    expect(aliases).toContain("standardavvik");
    expect(aliases).toContain("standardavviket");
    expect(aliases).toContain("standardavviker");
    expect(aliases).toContain("standardavvikene");
  });

  it("does not auto-inflect short tokens (symbols) or multi-word aliases", () => {
    const idx = buildAliasIndex([term("mu", "My (μ)", ["μ", "stokastisk variabel"])]);
    const aliases = idx.map((a) => a.alias);
    expect(aliases).toContain("μ");
    expect(aliases).toContain("stokastisk variabel");
    expect(aliases).not.toContain("μen");
    expect(aliases).not.toContain("stokastisk variabelen");
  });

  it("orders by length across multiple terms (longest first)", () => {
    const idx = buildAliasIndex([
      term("a", "Forventningsverdi"),
      term("c", "Varians"),
    ]);
    const lengths = idx.map((a) => a.alias.length);
    for (let i = 1; i < lengths.length; i++) {
      expect(lengths[i - 1]).toBeGreaterThanOrEqual(lengths[i]);
    }
  });
});

describe("findGlossaryLinks", () => {
  const aliases: GlossaryAlias[] = [
    { alias: "stokastisk variabel", termId: "sv", caseSensitive: false },
    { alias: "stokastiske", termId: "sv", caseSensitive: false },
    { alias: "stokastisk", termId: "sv", caseSensitive: false },
    { alias: "varians", termId: "var", caseSensitive: false },
  ];

  it("returns single text segment when no aliases match", () => {
    expect(findGlossaryLinks("ingen treff her", aliases)).toEqual([
      { kind: "text", value: "ingen treff her" },
    ]);
  });

  it("matches a single whole word, case-insensitive, preserving case", () => {
    const segs = findGlossaryLinks("En Stokastisk verdi", aliases);
    expect(segs).toEqual([
      { kind: "text", value: "En " },
      { kind: "link", value: "Stokastisk", termId: "sv" },
      { kind: "text", value: " verdi" },
    ]);
  });

  it("prefers longest match (stokastisk variabel over stokastisk)", () => {
    const segs = findGlossaryLinks("En stokastisk variabel her", aliases);
    expect(segs).toEqual([
      { kind: "text", value: "En " },
      { kind: "link", value: "stokastisk variabel", termId: "sv" },
      { kind: "text", value: " her" },
    ]);
  });

  it("does not match across word boundaries (no partial)", () => {
    const segs = findGlossaryLinks("Variansen er stor", aliases);
    // "varians" inside "Variansen" is NOT a whole word — should be plain text.
    expect(segs).toEqual([{ kind: "text", value: "Variansen er stor" }]);
  });

  it("matches multiple occurrences", () => {
    const segs = findGlossaryLinks("varians og varians", aliases);
    expect(segs).toEqual([
      { kind: "link", value: "varians", termId: "var" },
      { kind: "text", value: " og " },
      { kind: "link", value: "varians", termId: "var" },
    ]);
  });

  it("treats punctuation as word boundary", () => {
    const segs = findGlossaryLinks("(varians) er null.", aliases);
    expect(segs).toEqual([
      { kind: "text", value: "(" },
      { kind: "link", value: "varians", termId: "var" },
      { kind: "text", value: ") er null." },
    ]);
  });

  it("handles empty input safely", () => {
    expect(findGlossaryLinks("", aliases)).toEqual([{ kind: "text", value: "" }]);
  });

  it("matches ALL-CAPS abbreviation aliases case-sensitively", () => {
    const ab: GlossaryAlias[] = [
      { alias: "SE", termId: "standardfeil", caseSensitive: true },
      { alias: "varians", termId: "var", caseSensitive: false },
    ];
    // Lowercase "se" must NOT match the case-sensitive "SE" alias
    expect(findGlossaryLinks("regn ut se related", ab)).toEqual([
      { kind: "text", value: "regn ut se related" },
    ]);
    // Uppercase "SE" matches
    expect(findGlossaryLinks("SE er stor", ab)).toEqual([
      { kind: "link", value: "SE", termId: "standardfeil" },
      { kind: "text", value: " er stor" },
    ]);
  });
});

describe("buildAliasIndex case sensitivity", () => {
  it("marks ALL-CAPS short aliases as case-sensitive and skips inflection", () => {
    const idx = buildAliasIndex([
      term("standardfeil", "Standardfeil (SE)", ["standardfeil", "SE"]),
    ]);
    const se = idx.find((a) => a.alias === "SE");
    expect(se).toBeDefined();
    expect(se!.caseSensitive).toBe(true);
    // No inflected "se", "seen", etc. that would clash with Norwegian "se".
    expect(idx.some((a) => a.alias === "se")).toBe(false);
    expect(idx.some((a) => a.alias === "seen")).toBe(false);

    const sf = idx.find((a) => a.alias === "standardfeil");
    expect(sf).toBeDefined();
    expect(sf!.caseSensitive).toBe(false);
  });

  it("treats subscripted abbreviations like H₀ as case-sensitive", () => {
    const idx = buildAliasIndex([
      term("h0", "Nullhypotese (H₀)", ["nullhypotese", "H₀"]),
    ]);
    const h0 = idx.find((a) => a.alias === "H₀");
    expect(h0).toBeDefined();
    expect(h0!.caseSensitive).toBe(true);
  });

  it("treats single-character aliases as case-sensitive (Σ must not match σ)", () => {
    const idx = buildAliasIndex([
      term("sigma", "Sigma (σ)", ["σ", "sigma"]),
    ]);
    const sigma = idx.find((a) => a.alias === "σ");
    expect(sigma).toBeDefined();
    expect(sigma!.caseSensitive).toBe(true);
    // Verify end-to-end: uppercase Σ (sumtegn) must NOT link to the σ entry.
    const segs = findGlossaryLinks("Σ x_i og σ", idx);
    const links = segs.filter((s) => s.kind === "link");
    expect(links.map((l) => l.value)).toEqual(["σ"]);
  });
});
