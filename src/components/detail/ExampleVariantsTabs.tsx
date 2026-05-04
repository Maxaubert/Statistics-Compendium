import { useState } from "react";
import { clsx } from "clsx";
import { ExampleCard } from "./ExampleCard";

export interface ExampleVariant {
  label: string;
  examples: { source: string; excerpt: string; solution_sketch: string }[];
}

interface Props {
  variants: ExampleVariant[];
}

/**
 * Tabbed example list, mirroring the look of `StepByStepTabs` so the
 * two sections feel like one paired widget on the entry detail page.
 * One ExampleCard per example in the active variant; tab switching
 * is purely client-side state.
 */
export function ExampleVariantsTabs({ variants }: Props) {
  const [active, setActive] = useState(0);
  if (variants.length === 0) return null;
  if (variants.length === 1) {
    return (
      <>
        {variants[0].examples.map((ex, i) => (
          <ExampleCard
            key={i}
            source={ex.source}
            excerpt={ex.excerpt}
            solutionSketch={ex.solution_sketch}
          />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Eksempel-varianter"
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
                isActive ? "font-semibold text-primary-2" : "text-ink-3 hover:text-ink-2",
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

      {variants[active].examples.length === 0 ? (
        <p className="py-4 text-center text-[13px] italic text-ink-3">
          (Ingen eksempler for denne varianten ennå.)
        </p>
      ) : (
        <div>
          {variants[active].examples.map((ex, i) => (
            <ExampleCard
              key={i}
              source={ex.source}
              excerpt={ex.excerpt}
              solutionSketch={ex.solution_sketch}
            />
          ))}
        </div>
      )}
    </div>
  );
}
