import { useState } from "react";
import { DetailedSolution } from "./DetailedSolution";
import { VariantTabBar } from "./VariantTabBar";
import type { z } from "zod";
import type { DetailedSolutionSchema } from "@/data/schema";

type Solution = z.infer<typeof DetailedSolutionSchema>;

export interface DetailedSolutionVariant {
  label: string;
  solutions: Solution[];
}

interface Props {
  variants: DetailedSolutionVariant[];
  /** Controlled active index. If omitted the component manages its own state. */
  active?: number;
  /** Called when the user clicks a tab. Required if `active` is provided. */
  onSelect?: (i: number) => void;
}

/**
 * Tabbed wrapper for detailed solutions. Mirrors `StepByStepTabs`
 * styling so the two sections (steg / detailed-solutions) read as
 * one paired widget on the entry detail page. Single-variant input
 * renders flat (no tabs).
 *
 * The active tab can be controlled by the parent (used by EntryDetail
 * to keep this tab strip in sync with the step-by-step tabs); if no
 * controlled props are passed it falls back to internal state.
 */
export function DetailedSolutionVariantsTabs({
  variants,
  active: controlledActive,
  onSelect: controlledOnSelect,
}: Props) {
  const [internalActive, setInternalActive] = useState(0);
  const isControlled = controlledActive !== undefined;
  const active = isControlled ? controlledActive : internalActive;
  const onSelect = isControlled
    ? (controlledOnSelect ?? (() => {}))
    : setInternalActive;
  if (variants.length === 0) return null;
  if (variants.length === 1) {
    return (
      <>
        {variants[0].solutions.map((s, i) => (
          <DetailedSolution key={i} solution={s} />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <VariantTabBar
        labels={variants.map((v) => v.label)}
        active={active}
        onSelect={onSelect}
        ariaLabel="Oppgaveløsnings-varianter"
      />

      {variants[active].solutions.length === 0 ? (
        <p className="py-4 text-center text-[13px] italic text-ink-3">
          (Ingen oppgaver for denne varianten ennå.)
        </p>
      ) : (
        <div>
          {variants[active].solutions.map((s, i) => (
            <DetailedSolution key={i} solution={s} />
          ))}
        </div>
      )}
    </div>
  );
}
