import Fuse from "fuse.js";
import type { FuseGetFunction } from "fuse.js";
import type { Entry, GlossaryTerm } from "./schema";

/**
 * Treat hyphens like spaces so users can search for "p verdi" and find
 * "P-verdi" (and vice versa). Applied to both indexed values and the
 * query string so the substitution is symmetric.
 */
function normalizeHyphens(s: string): string {
  return s.replace(/-/g, " ");
}

function makeGetFn<T>(): FuseGetFunction<T> {
  // Wrap Fuse's default getter so any string we hand to the index has
  // hyphens turned into spaces. Arrays get mapped element-wise; non-string
  // values pass through unchanged.
  const baseGetFn = Fuse.config.getFn;
  return (obj: T, path: string | string[]) => {
    const v = baseGetFn(obj as never, path);
    if (typeof v === "string") return normalizeHyphens(v);
    if (Array.isArray(v)) {
      return v.map((x) => (typeof x === "string" ? normalizeHyphens(x) : x));
    }
    return v as string | ReadonlyArray<string>;
  };
}

/** Run a search after normalizing the query to match the indexed form. */
export function searchWith<T>(idx: Fuse<T>, query: string) {
  return idx.search(normalizeHyphens(query));
}

/** Typed wrappers — passing the wrong index is a compile-time error. */
export function searchEntries(idx: Fuse<Entry>, query: string) {
  return searchWith(idx, query);
}
export function searchGlossary(idx: Fuse<GlossaryTerm>, query: string) {
  return searchWith(idx, query);
}

export function buildSearchIndex(entries: Entry[]) {
  return new Fuse(entries, {
    includeScore: true,
    threshold: 0.4,
    getFn: makeGetFn<Entry>(),
    keys: [
      { name: "name_no", weight: 1.0 },
      { name: "tags", weight: 0.9 },
      { name: "tagline", weight: 0.7 },
      { name: "recognition_cues", weight: 0.6 },
      { name: "symbols.sym", weight: 0.5 },
      { name: "symbols.means", weight: 0.4 },
      { name: "examples.excerpt", weight: 0.4 },
      { name: "examples.source", weight: 0.3 },
      { name: "what_it_does", weight: 0.3 },
    ],
  });
}

export function buildGlossarySearchIndex(terms: GlossaryTerm[]) {
  return new Fuse(terms, {
    includeScore: true,
    threshold: 0.4,
    getFn: makeGetFn<GlossaryTerm>(),
    keys: [
      { name: "term_no", weight: 1.0 },
      { name: "aliases", weight: 0.8 },
      { name: "short_def", weight: 0.6 },
      { name: "long_def", weight: 0.3 },
    ],
  });
}
