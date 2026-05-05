export type FilterSelection = Record<string, string[]>;
/**
 * Generic shape for anything that can be filtered by the dimension
 * system. Both `Entry` and `GlossaryTerm` satisfy this so the same
 * `applyFilters` / `computeFacetCounts` machinery works for both.
 */
type Filterable = { filters: Record<string, string[]> };

export function applyFilters<T extends Filterable>(
  items: T[],
  selection: FilterSelection
): T[] {
  const activeDims = Object.entries(selection).filter(
    ([, vals]) => vals && vals.length > 0
  );
  if (activeDims.length === 0) return items;

  return items.filter((item) =>
    activeDims.every(([dim, selectedVals]) => {
      const itemVals = item.filters[dim] ?? [];
      return selectedVals.some((v) => itemVals.includes(v));
    })
  );
}

export function computeFacetCounts<T extends Filterable>(
  items: T[],
  selection: FilterSelection
): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  for (const dim of allDimensions(items)) {
    const selectionExceptThisDim = { ...selection };
    delete selectionExceptThisDim[dim];

    const filtered = applyFilters(items, selectionExceptThisDim);
    counts[dim] = {};

    for (const item of filtered) {
      for (const val of item.filters[dim] ?? []) {
        counts[dim][val] = (counts[dim][val] ?? 0) + 1;
      }
    }
  }

  return counts;
}

function allDimensions<T extends Filterable>(items: T[]): string[] {
  const dims = new Set<string>();
  for (const item of items) {
    for (const dim of Object.keys(item.filters)) dims.add(dim);
  }
  return Array.from(dims);
}
