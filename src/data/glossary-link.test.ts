import { describe, it, expect } from "vitest";
import {
  buildAliasIndex,
  findGlossaryLinks,
  type GlossaryAlias,
} from "./glossary-link";
import type { GlossaryTerm } from "./schema";

function term(id: string, term_no: string, aliases?: string[]): GlossaryTerm {
  return { id, term_no, short_def: "x", aliases };
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
    { alias: "stokastisk variabel", termId: "sv" },
    { alias: "stokastiske", termId: "sv" },
    { alias: "stokastisk", termId: "sv" },
    { alias: "varians", termId: "var" },
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
});
