import type { GlossaryTerm } from "./schema";

export interface GlossaryAlias {
  alias: string;        // surface form (lowercased if caseSensitive=false, original if true)
  termId: string;       // glossary term id
  /**
   * When true, prose must match the alias exactly (case-sensitive). Used
   * for short ALL-CAPS abbreviations like "SE", "KI", "OLS", "CLT" so
   * lowercase Norwegian words ("se", "ki") don't false-positive into them.
   */
  caseSensitive: boolean;
}

/**
 * Detect ALL-CAPS abbreviation-like surface forms (SE, KI, OLS, CLT, df-not,
 * H₀, H₁, R²). These get matched case-sensitively to avoid linking common
 * Norwegian words like "se" or "ki" to the glossary entry for "SE".
 *
 * Heuristic: 1–5 chars, contains at least one A-Z letter, no lowercase
 * letters. Subscripts/superscripts/digits are allowed.
 */
function isAbbreviationLike(s: string): boolean {
  if (s.length === 0 || s.length > 5) return false;
  let hasUpper = false;
  for (const ch of s) {
    if (ch >= "A" && ch <= "Z") {
      hasUpper = true;
      continue;
    }
    if (ch >= "a" && ch <= "z") return false;
    // Allow digits, subscripts, superscripts.
    const code = ch.charCodeAt(0);
    if ((code >= 0x30 && code <= 0x39) ||         // 0-9
        (code >= 0x2080 && code <= 0x2089) ||      // ₀-₉
        (code >= 0x2070 && code <= 0x2079) ||      // ⁰-⁹
        ch === "²" || ch === "³" || ch === "¹") {  // common superscripts
      continue;
    }
    return false;
  }
  return hasUpper;
}

/**
 * Strip parenthetical decorations like "(σ, s)" from a term name so the
 * remaining surface form can be matched in prose. "Standardavvik (σ, s)"
 * → "Standardavvik".
 */
function cleanTermNo(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .replace(/[,;].*$/, "")
    .trim();
}

/**
 * Auto-derive simple Norwegian definite/plural inflections from a base
 * surface form so authors don't have to enumerate every form by hand.
 *   varians  → varians, variansen, varianser, variansene
 *   hendelse → hendelse, hendelsen, hendelser, hendelsene
 *
 * Skipped for very short tokens (≤4 chars: likely a symbol or single
 * letter where blanket inflection would over-match) and for multi-word
 * phrases (where Norwegian inflection is per-word and not handled here).
 * Some generated forms are non-words (variansset etc.); those cost a
 * tiny bit of index space but cannot cause incorrect matches because
 * they don't appear in real prose.
 */
function expandInflections(alias: string): string[] {
  const base = alias.trim().toLowerCase();
  if (!base) return [];
  if (base.includes(" ")) return [base];
  if (base.length <= 4) return [base];
  const stem = base.endsWith("e") ? base.slice(0, -1) : base;
  return [
    base,
    stem + "en",
    base + "et",
    stem + "er",
    stem + "ene",
  ];
}

interface AliasEntry {
  surface: string;        // alias as stored in lookup (lowercased OR cased)
  caseSensitive: boolean;
}

/**
 * Decide whether the surface form should be matched case-sensitively in
 * prose. True for:
 *   - ALL-CAPS Latin abbreviations (`SE`, `KI`, `OLS`, `H₀`, …).
 *   - Single characters (`σ`, `μ`, `β`, …) — JS lowercases `Σ` to `σ`,
 *     so without case-sensitivity the sumtegn `Σ` would match the σ
 *     glossary entry. Single-char Latin aliases would also match every
 *     occurrence of that letter, which we do not want.
 */
function isCaseSensitiveAlias(s: string): boolean {
  if (s.length === 1) return true;
  return isAbbreviationLike(s);
}

/**
 * For one user-provided surface form, produce the alias entries to add
 * to the index. Case-sensitive aliases stay verbatim (no inflection).
 * Everything else gets lowercased + Norwegian-suffix inflection.
 */
function aliasEntriesFor(surface: string): AliasEntry[] {
  const trimmed = surface.trim();
  if (!trimmed) return [];
  if (isCaseSensitiveAlias(trimmed)) {
    return [{ surface: trimmed, caseSensitive: true }];
  }
  return expandInflections(trimmed).map((s) => ({ surface: s, caseSensitive: false }));
}

/**
 * Build the master alias list. For each term we use:
 *   - explicit aliases from YAML, if present, otherwise
 *   - the cleaned `term_no` as the single fallback alias.
 * Each surface form is expanded with simple Norwegian inflections so
 * "varians" also catches "variansen", "varianser", "variansene".
 * The list is sorted longest-first so the scanner prefers
 * "stokastisk variabel" over "stokastisk" when both match at a position.
 */
export function buildAliasIndex(glossary: GlossaryTerm[]): GlossaryAlias[] {
  const out: GlossaryAlias[] = [];
  const seen = new Set<string>();
  for (const term of glossary) {
    const explicit = term.aliases ?? [];
    const surfaces = explicit.length > 0 ? explicit : [cleanTermNo(term.term_no)];
    for (const s of surfaces) {
      for (const entry of aliasEntriesFor(s)) {
        const key = `${entry.caseSensitive ? "S" : "I"}|${entry.surface}::${term.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          alias: entry.surface,
          termId: term.id,
          caseSensitive: entry.caseSensitive,
        });
      }
    }
  }
  // Longest first so multi-word aliases shadow their single-word prefixes.
  out.sort((a, b) => b.alias.length - a.alias.length);
  return out;
}

/**
 * Letter character class used for word-boundary detection.
 * Includes Norwegian letters (æ, ø, å) and digits, plus underscore.
 * Anything else counts as a non-letter boundary.
 */
const LETTER = /[\p{L}\p{N}_]/u;

function isWordChar(ch: string): boolean {
  return LETTER.test(ch);
}

export interface PlainSegment {
  kind: "text";
  value: string;
}
export interface LinkSegment {
  kind: "link";
  value: string;        // exact substring as it appears in prose
  termId: string;
}
export type LinkedSegment = PlainSegment | LinkSegment;

/**
 * Scan a plain-text segment and return a flat list of segments, where each
 * matched alias is replaced with a {kind: "link"} segment carrying the
 * original casing intact. Match is whole-word, case-insensitive, longest-first.
 *
 * `aliases` MUST be sorted longest-first.
 */
export function findGlossaryLinks(
  text: string,
  aliases: GlossaryAlias[],
): LinkedSegment[] {
  if (!text || aliases.length === 0) return [{ kind: "text", value: text }];
  const lower = text.toLowerCase();
  const result: LinkedSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    let matched: { alias: GlossaryAlias; len: number } | null = null;
    for (const a of aliases) {
      if (a.alias.length === 0) continue;
      if (cursor + a.alias.length > text.length) continue;
      const haystack = a.caseSensitive ? text : lower;
      if (haystack.substr(cursor, a.alias.length) !== a.alias) continue;
      const before = cursor === 0 ? "" : text[cursor - 1];
      const after = text[cursor + a.alias.length] ?? "";
      if (before && isWordChar(before)) continue;
      if (after && isWordChar(after)) continue;
      matched = { alias: a, len: a.alias.length };
      break; // aliases are longest-first, accept first hit
    }

    if (matched) {
      result.push({
        kind: "link",
        value: text.substr(cursor, matched.len),
        termId: matched.alias.termId,
      });
      cursor += matched.len;
    } else {
      // No alias match here. If we're at the start of a word run, skip
      // past the whole run (aliases can only begin at word boundaries,
      // so retrying mid-word can never succeed). Otherwise advance one
      // char so we re-try at the next position.
      let next: number;
      if (isWordChar(text[cursor])) {
        next = cursor + 1;
        while (next < text.length && isWordChar(text[next])) next++;
      } else {
        next = cursor + 1;
      }
      const lastSeg = result[result.length - 1];
      const slice = text.slice(cursor, next);
      if (lastSeg && lastSeg.kind === "text") {
        lastSeg.value += slice;
      } else {
        result.push({ kind: "text", value: slice });
      }
      cursor = next;
    }
  }

  return result.length === 0 ? [{ kind: "text", value: "" }] : result;
}
