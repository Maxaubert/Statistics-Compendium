import { clsx } from "clsx";
import { deriveTabMeta } from "./tab-category";

interface Props {
  /** Original raw labels — used as the React key, the accessible name, and the meta-derivation source. */
  labels: string[];
  active: number;
  onSelect: (index: number) => void;
  ariaLabel: string;
}

/**
 * Two-line variant tab strip: small-caps category tag (FOROVER /
 * INVERS / VENSTRE / …) over the cleaned-up label. When none of the
 * labels yield a category (e.g. Bayes-setning's method-style labels),
 * the tag row is omitted so the strip stays single-line.
 */
export function VariantTabBar({ labels, active, onSelect, ariaLabel }: Props) {
  const metas = labels.map(deriveTabMeta);
  const anyTag = metas.some((m) => m.tag !== null);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-x-7 gap-y-0 border-b border-line"
    >
      {labels.map((label, i) => {
        const meta = metas[i];
        const isActive = i === active;
        const tagColor =
          meta.kind === "invers" ? "text-amber-700" : "text-primary-2/70";
        return (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => onSelect(i)}
            className={clsx(
              "relative flex flex-col items-start gap-0.5 px-1 pb-2 pt-1.5 leading-none transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:rounded-sm focus-visible:ring-primary-2/60",
              isActive ? "text-primary-2" : "text-ink-3 hover:text-ink-2",
            )}
          >
            {anyTag && (
              <span
                aria-hidden
                className={clsx(
                  "font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em]",
                  meta.tag ? tagColor : "select-none opacity-0",
                )}
              >
                {meta.tag ?? "—"}
              </span>
            )}
            <span
              className={clsx(
                "font-mono text-[12.5px]",
                isActive && "font-semibold",
              )}
            >
              {meta.short}
            </span>
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-1.5 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? "bg-primary-2" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
