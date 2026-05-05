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
 * Disclosure-style variant tab strip with stable layout. Each tab
 * shows its natural-language name (e.g. "Mindre enn", "Finn x") and
 * reserves space below for the formula expression. The formula is
 * faded in only on the active tab — total tab height is constant so
 * the rest of the page never shifts when a tab is selected.
 *
 * The forover/invers distinction is carried by colour on the active
 * state (indigo vs amber) and not by an explicit small-caps tag —
 * the natural name itself is the category label.
 */
export function VariantTabBar({ labels, active, onSelect, ariaLabel }: Props) {
  const metas = labels.map(deriveTabMeta);
  const anyFormula = metas.some((m) => m.formula);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex flex-wrap items-stretch gap-x-7 gap-y-0 border-b border-line"
    >
      {labels.map((label, i) => {
        const meta = metas[i];
        const isActive = i === active;
        const activeText =
          meta.kind === "invers" ? "text-amber-700" : "text-primary-2";
        const activeUnderline =
          meta.kind === "invers" ? "bg-amber-500" : "bg-primary-2";

        return (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={label}
            onClick={() => onSelect(i)}
            className={clsx(
              "relative flex flex-col items-start px-1 pb-2 pt-2 leading-none",
              "focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary-2/60",
              isActive
                ? clsx(activeText, "transition-colors")
                : "text-ink-3 transition-colors hover:text-ink-2",
            )}
          >
            <span
              className={clsx(
                "font-mono text-[13px] transition-[font-weight] duration-150",
                isActive && "font-semibold",
              )}
            >
              {meta.short}
            </span>
            {anyFormula && (
              <span
                aria-hidden={!isActive}
                className={clsx(
                  "mt-1 font-mono text-[11.5px] transition-opacity duration-200 ease-out",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              >
                {meta.formula ?? " "}
              </span>
            )}
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-0 -bottom-px h-[2.5px] rounded-t-sm transition-all",
                isActive ? activeUnderline : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
