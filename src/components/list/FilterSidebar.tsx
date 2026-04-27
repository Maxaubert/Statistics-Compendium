import { FilterGroup } from "./FilterGroup";
import type { Filters } from "@/data/schema";
import type { FilterSelection } from "@/data/filtering";

interface Props {
  filters: Filters;
  selection: FilterSelection;
  counts: Record<string, Record<string, number>>;
  onToggle: (dim: string, optionKey: string) => void;
  onClear: () => void;
}

export function FilterSidebar({
  filters,
  selection,
  counts,
  onToggle,
  onClear,
}: Props) {
  const hasAny = Object.values(selection).some((arr) => arr && arr.length > 0);
  return (
    <aside className="border-r border-line bg-paper-2 p-3.5 text-sm">
      <div className="mb-2 flex items-center justify-between border-b border-line pb-2 font-serif text-sm font-semibold text-ink-2">
        Filter
        {hasAny && (
          <button
            type="button"
            onClick={onClear}
            className="font-sans text-[11px] font-medium text-primary-2"
          >
            Nullstill
          </button>
        )}
      </div>
      {filters.dimensions.map((d) => (
        <FilterGroup
          key={d.key}
          dimension={d}
          selection={selection[d.key] ?? []}
          counts={counts[d.key] ?? {}}
          onToggle={(opt) => onToggle(d.key, opt)}
        />
      ))}
    </aside>
  );
}
