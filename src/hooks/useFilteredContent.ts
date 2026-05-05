import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { applyFilters, computeFacetCounts, type FilterSelection } from "@/data/filtering";
import { buildSearchIndex } from "@/data/search";
import type { Entry } from "@/data/schema";

/**
 * Reserved URL search params that are NOT filter dimensions. Anything else
 * we see in the query string is treated as a filter dim name with a
 * comma-separated value list.
 */
const RESERVED_PARAMS = new Set(["tab", "q"]);

/**
 * Hook that filters entries by URL-synced search query and filters.
 *
 * State lives in the URL search params:
 *   - `q=<text>` for the search query
 *   - `<dim>=val1,val2` per filter dimension (e.g. `computes=hypothesis_test`)
 *
 * Browser back/forward navigation restores filters and search automatically
 * because the URL is the source of truth. URL changes use `replace: true`
 * so typing doesn't flood the history stack — only real navigations
 * (clicking an entry, switching tabs) create history entries.
 */
export function useFilteredContent(allEntries: Entry[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";

  const selection = useMemo<FilterSelection>(() => {
    const sel: FilterSelection = {};
    for (const [key, value] of searchParams.entries()) {
      if (RESERVED_PARAMS.has(key)) continue;
      if (!value) continue;
      const vals = value.split(",").filter(Boolean);
      if (vals.length > 0) sel[key] = vals;
    }
    return sel;
  }, [searchParams]);

  const fuse = useMemo(() => buildSearchIndex(allEntries), [allEntries]);

  const filtered = useMemo(() => {
    const pool =
      query.trim().length > 0
        ? fuse.search(query.trim()).map((h) => h.item)
        : allEntries;
    return applyFilters(pool, selection);
  }, [allEntries, query, fuse, selection]);

  const counts = useMemo(
    () => computeFacetCounts(allEntries, selection),
    [allEntries, selection]
  );

  const setQuery = useCallback(
    (q: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (q) next.set("q", q);
          else next.delete("q");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggle = useCallback(
    (dim: string, optionKey: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const cur = (next.get(dim) ?? "").split(",").filter(Boolean);
          const updated = cur.includes(optionKey)
            ? cur.filter((k) => k !== optionKey)
            : [...cur, optionKey];
          if (updated.length > 0) next.set(dim, updated.join(","));
          else next.delete(dim);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const remove = useCallback(
    (dim: string, optionKey: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const cur = (next.get(dim) ?? "").split(",").filter(Boolean);
          const updated = cur.filter((k) => k !== optionKey);
          if (updated.length > 0) next.set(dim, updated.join(","));
          else next.delete(dim);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clear = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const key of Array.from(next.keys())) {
          if (!RESERVED_PARAMS.has(key)) next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  return { filtered, counts, selection, query, setQuery, toggle, remove, clear };
}
