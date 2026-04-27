interface PillItem {
  dim: string;
  optionKey: string;
  label: string;
}

interface Props {
  items: PillItem[];
  onRemove: (dim: string, optionKey: string) => void;
}

export function ActiveFilterPills({ items, onRemove }: Props) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span
          key={`${it.dim}:${it.optionKey}`}
          className="flex items-center gap-1 rounded-xl bg-primary-soft px-2.5 py-0.5 text-[11px] font-medium text-primary"
        >
          {it.label}
          <button
            type="button"
            aria-label={`Fjern ${it.label}`}
            onClick={() => onRemove(it.dim, it.optionKey)}
            className="cursor-pointer text-[13px] opacity-50 hover:opacity-100"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
