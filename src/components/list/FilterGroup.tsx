import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  dimension: { key: string; label_no: string; options: { key: string; label_no: string }[] };
  selection: string[];
  counts: Record<string, number>;
  onToggle: (optionKey: string) => void;
  defaultOpen?: boolean;
}

export function FilterGroup({
  dimension,
  selection,
  counts,
  onToggle,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen || selection.length > 0);
  return (
    <div className="mb-1 border-b border-line py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-1.5 text-[12px] font-medium uppercase tracking-wide text-ink-2"
      >
        {dimension.label_no}
        {open ? (
          <ChevronDown size={12} className="text-ink-4" />
        ) : (
          <ChevronRight size={12} className="text-ink-4" />
        )}
      </button>
      {open && (
        <div className="pb-2 pl-1">
          {dimension.options.map((opt) => {
            const checked = selection.includes(opt.key);
            const count = counts[opt.key] ?? 0;
            const dimmed = count === 0 && !checked;
            return (
              <label
                key={opt.key}
                className={clsx(
                  "flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-primary-2/5",
                  dimmed ? "text-ink-4" : "text-ink-2"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt.key)}
                  className="accent-primary-2"
                  aria-label={opt.label_no}
                />
                {opt.label_no}
                <span className="ml-auto rounded-lg border border-line bg-card px-1.5 py-px font-mono text-[11px] text-ink-3">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
