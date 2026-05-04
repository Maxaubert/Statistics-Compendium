import Fuse from "fuse.js";
import type { Concept, Entry } from "./schema";

export function buildSearchIndex(entries: Entry[]) {
  return new Fuse(entries, {
    includeScore: true,
    threshold: 0.4,
    keys: [
      { name: "name_no", weight: 1.0 },
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

export function buildConceptSearchIndex(concepts: Concept[]) {
  return new Fuse(concepts, {
    includeScore: true,
    threshold: 0.4,
    keys: [
      { name: "name_no", weight: 1.0 },
      { name: "tagline", weight: 0.7 },
      { name: "recognition_cues", weight: 0.6 },
      { name: "what_it_means", weight: 0.4 },
      { name: "examples.excerpt", weight: 0.4 },
      { name: "examples.source", weight: 0.3 },
    ],
  });
}
