import { useState } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { renderInlineCode } from "./inline-code";
import { FormulaExplanationModal } from "./FormulaExplanationModal";
import type { FormulaExplanation } from "./formula-explanations";
import type { GlossaryTerm, Entry, Table } from "@/data/schema";

interface Props {
  explanations: FormulaExplanation[];
  glossary?: GlossaryTerm[];
  entries?: Entry[];
  tables?: Table[];
}

/** Number of cards in the always-visible first row of the grid. */
const ROW_SIZE = 2;

/**
 * Grid of clickable cards, one per FormulaExplanation. Click opens
 * a modal with the long-form Prose body. Sibling of PropertyCards
 * but tuned for explaining the formulas that appear on the entry
 * page itself (e.g. PDF + CDF on a continuous distribution).
 *
 * Layout:
 *  - First ROW_SIZE cards always render.
 *  - When there are more than ROW_SIZE cards, the rest are collapsed
 *    behind a 'Vis flere'-bar at the bottom of the section. Click
 *    the bar to expand/collapse; the bar stays at the bottom in
 *    both states so it doubles as the collapse handle when expanded.
 *
 * Maintains a stack of opened formulas so the modal can show a
 * back button when one formula's "Se også"-link opens another.
 */
export function FormulaExplanationCards({
  explanations,
  glossary,
  entries,
  tables,
}: Props) {
  const [stack, setStack] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);

  if (explanations.length === 0) return null;

  const cols = explanations.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2";

  const open = (idx: number) => {
    setStack((s) => (s[s.length - 1] === idx ? s : [...s, idx]));
  };
  const goBack = () => setStack((s) => s.slice(0, -1));
  const close = () => setStack([]);
  const openByRef = (ref: string) => {
    const idx = explanations.findIndex((e) => e.id === ref);
    if (idx >= 0) open(idx);
  };

  const currentIdx = stack[stack.length - 1];
  const prevIdx = stack.length > 1 ? stack[stack.length - 2] : undefined;
  const current = currentIdx !== undefined ? explanations[currentIdx] : null;
  const prev = prevIdx !== undefined ? explanations[prevIdx] : null;

  // Collapse logic: only show the toggle when there's at least one card
  // beyond the always-visible first row.
  const overflow = Math.max(0, explanations.length - ROW_SIZE);
  const needsToggle = overflow > 0;
  const visible = needsToggle && !expanded
    ? explanations.slice(0, ROW_SIZE)
    : explanations;
  const visibleFirstRow = visible.slice(0, ROW_SIZE);
  const visibleRest = visible.slice(ROW_SIZE);

  const renderCard = (expl: FormulaExplanation) => (
    <button
      key={expl.id}
      type="button"
      aria-label={`Vis forklaring for ${expl.name}`}
      onClick={() => open(explanations.indexOf(expl))}
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
      <span className="mt-2 inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-2/70 opacity-0 transition-opacity group-hover:opacity-100">
        Les mer →
      </span>
    </button>
  );

  return (
    <>
      <div className={clsx("grid grid-cols-1 gap-3", cols)}>
        {visibleFirstRow.map(renderCard)}
      </div>
      {expanded && visibleRest.length > 0 && (
        <div className={clsx("mt-3 grid grid-cols-1 gap-3", cols)}>
          {visibleRest.map(renderCard)}
        </div>
      )}
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls="formelforklaring-resten"
          className={clsx(
            "mt-2 flex w-full items-center justify-center gap-2 border-t border-line pt-3",
            "font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-3",
            "transition-colors hover:text-primary-2",
            "focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary-2/60",
          )}
        >
          <span>{expanded ? "Skjul" : "Vis flere"}</span>
          {!expanded && (
            <span className="rounded-full bg-primary/10 px-2 py-px font-semibold text-primary-2">
              {overflow}
            </span>
          )}
          <ChevronDown
            size={14}
            className={clsx(
              "transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}

      {current && (
        <FormulaExplanationModal
          explanation={current}
          glossary={glossary}
          entries={entries}
          tables={tables}
          onClose={close}
          onBack={prev ? goBack : undefined}
          backToLabel={prev?.name}
          onOpenFormula={openByRef}
          allFormulas={explanations}
        />
      )}
    </>
  );
}
