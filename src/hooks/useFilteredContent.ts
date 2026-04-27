import { useMemo, useState } from "react";
import { applyFilters, computeFacetCounts, type FilterSelection } from "@/data/filtering";
import { buildSearchIndex } from "@/data/search";
import type { Entry } from "@/data/schema";

export function useFilteredContent(allEntries: Entry[]) {
  const [selection, setSelection] = useState<FilterSelection>({});
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => buildSearchIndex(allEntries), [allEntries]);

  const filtered = useMemo(() => {
    let pool = allEntries;
    if (query.trim().length > 0) {
      const ids = new Set(fuse.search(query.trim()).map((h) => h.item.id));
      pool = pool.filter((e) => ids.has(e.id));
    }
    return applyFilters(pool, selection);
  }, [allEntries, query, fuse, selection]);

  const counts = useMemo(
    () => computeFacetCounts(allEntries, selection),
    [allEntries, selection]
  );

  function toggle(dim: string, optionKey: string) {
    setSelection((prev) => {
      const cur = prev[dim] ?? [];
      const next = cur.includes(optionKey)
        ? cur.filter((k) => k !== optionKey)
        : [...cur, optionKey];
      return { ...prev, [dim]: next };
    });
  }

  function remove(dim: string, optionKey: string) {
    setSelection((prev) => ({
      ...prev,
      [dim]: (prev[dim] ?? []).filter((k) => k !== optionKey),
    }));
  }

  function clear() {
    setSelection({});
  }

  return { filtered, counts, selection, query, setQuery, toggle, remove, clear };
}
