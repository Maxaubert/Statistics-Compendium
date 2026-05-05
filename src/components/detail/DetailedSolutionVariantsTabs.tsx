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
}

/**
 * Tabbed wrapper for detailed solutions. Mirrors `StepByStepTabs`
 * styling so the two sections (steg / detailed-solutions) read as
 * one paired widget on the entry detail page. Single-variant input
 * renders flat (no tabs).
 */
export function DetailedSolutionVariantsTabs({ variants }: Props) {
  const [active, setActive] = useState(0);
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
        onSelect={setActive}
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
