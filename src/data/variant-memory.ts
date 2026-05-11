/**
 * Tiny localStorage cache that remembers which variant was selected on
 * the per-entry tab strips (Steg / Detaljerte løsninger). When the user
 * returns to an entry they recently looked at, the page restores the
 * variant they were last viewing instead of snapping back to index 0.
 *
 * The cache is a most-recently-touched list of at most MAX_ENTRIES
 * entries — older selections are evicted when a fourth entry is touched.
 * Each call to `rememberVariant` moves the entry to the front of the
 * list, so "the last three pages I looked at" is what gets remembered.
 */

const STORAGE_KEY = "stat-compendium.variant-memory.v1";
const MAX_ENTRIES = 3;

export interface VariantMemory {
  step: number;
  solution: number;
}

interface StoredEntry extends VariantMemory {
  id: string;
}

function loadAll(): StoredEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is StoredEntry =>
        !!e &&
        typeof e === "object" &&
        typeof (e as StoredEntry).id === "string" &&
        Number.isInteger((e as StoredEntry).step) &&
        Number.isInteger((e as StoredEntry).solution),
    );
  } catch {
    return [];
  }
}

function saveAll(entries: StoredEntry[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries.slice(0, MAX_ENTRIES)),
    );
  } catch {
    // quota / private mode — silently drop, the feature is best-effort.
  }
}

export function recallVariant(entryId: string): VariantMemory | null {
  const found = loadAll().find((e) => e.id === entryId);
  return found ? { step: found.step, solution: found.solution } : null;
}

export function rememberVariant(
  entryId: string,
  memory: VariantMemory,
): void {
  const rest = loadAll().filter((e) => e.id !== entryId);
  saveAll([{ id: entryId, ...memory }, ...rest]);
}
