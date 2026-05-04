import { useState } from "react";
import { clsx } from "clsx";
import { DetailedSolution } from "./DetailedSolution";
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
      <div
        role="tablist"
        aria-label="Oppgaveløsnings-varianter"
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
