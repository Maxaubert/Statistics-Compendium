import { useState } from "react";
import { clsx } from "clsx";
import { renderInlineCode } from "./inline-code";
import { FormulaExplanationModal } from "./FormulaExplanationModal";
import type { FormulaExplanation } from "./formula-explanations";
import type { GlossaryTerm } from "@/data/schema";

interface Props {
  explanations: FormulaExplanation[];
  glossary?: GlossaryTerm[];
}

/**
 * Grid of clickable cards, one per FormulaExplanation. Click opens
 * a modal with the long-form Prose body. Sibling of PropertyCards
 * but tuned for explaining the formulas that appear on the entry
 * page itself (e.g. PDF + CDF on a continuous distribution).
 */
export function FormulaExplanationCards({ explanations, glossary }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (explanations.length === 0) return null;

  const cols = explanations.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";

  return (
    <>
      <div className={clsx("grid grid-cols-1 gap-3", cols)}>
        {explanations.map((expl, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Vis forklaring for ${expl.name}`}
            onClick={() => setOpenIndex(i)}
            className={clsx(
              "group relative cursor-pointer rounded-lg border border-line bg-card px-4 py-3.5 text-left",
              "transition-colors hover:border-primary-2/60 hover:bg-paper-2/60",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
            )}
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                {expl.name}
              </div>
              {expl.abbreviation && (
                <span className="rounded bg-paper-2 px-1.5 py-px font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                  {expl.abbreviation}
                </span>
              )}
            </div>
            <div className="font-math text-lg font-medium text-ink">
              {renderInlineCode(expl.formula, "light")}
            </div>
            <div className="mt-2 text-[13px] leading-snug text-ink-2">
              {expl.short}
            </div>
            <span className="absolute bottom-2 right-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-2/70 opacity-0 transition-opacity group-hover:opacity-100">
              Les mer →
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <FormulaExplanationModal
          explanation={explanations[openIndex]}
          glossary={glossary}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
