import { X } from "lucide-react";
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
      <div className="mb-2 border-b border-line pb-2 font-serif text-sm font-semibold text-ink-2">
        Filter
      </div>
      {hasAny && (
        <button
          type="button"
          onClick={onClear}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-md border border-primary-2 bg-primary-soft px-3 py-2 text-[13px] font-medium text-primary hover:bg-primary-2 hover:text-white"
        >
          <X size={14} />
          Nullstill alle filtere
        </button>
      )}
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
