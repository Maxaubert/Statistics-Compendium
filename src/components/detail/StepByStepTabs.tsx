import { useState } from "react";
import { clsx } from "clsx";
import { StepByStep, type StepItem } from "./StepByStep";

export interface StepVariant {
  /** Label shown on the tab — short, scannable. */
  label: string;
  steps: StepItem[];
}

interface StepByStepTabsProps {
  variants: StepVariant[];
}

/**
 * Tabbed step-by-step. Each variant gets its own list of steps so a
 * single entry can document several common problem shapes (e.g. for
 * normalfordeling: P(X<x), P(a<X<b), invers) without flattening them
 * into one generic procedure.
 *
 * Falls back to plain `StepByStep` rendering for the active variant
 * — same styling as the existing single-list version.
 */
export function StepByStepTabs({ variants }: StepByStepTabsProps) {
  const [active, setActive] = useState(0);
  if (variants.length === 0) return null;
  if (variants.length === 1) {
    return <StepByStep steps={variants[0].steps} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Steg-for-steg-varianter"
        className="flex flex-wrap gap-x-1 gap-y-0 border-b border-line"
      >
        {variants.map((v, i) => {
          const isActive = i === active;
          return (
            <button
              key={v.label}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={clsx(
                "relative px-3 pb-2 pt-1.5 font-mono text-[12.5px] leading-none transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60 focus-visible:rounded-sm",
                isActive
                  ? "font-semibold text-primary-2"
                  : "text-ink-3 hover:text-ink-2",
              )}
            >
              {v.label}
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
      <StepByStep steps={variants[active].steps} />
    </div>
  );
}
