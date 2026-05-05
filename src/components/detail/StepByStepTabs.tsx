import { useState } from "react";
import { StepByStep, type StepItem } from "./StepByStep";
import { VariantTabBar } from "./VariantTabBar";

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
      <VariantTabBar
        labels={variants.map((v) => v.label)}
        active={active}
        onSelect={setActive}
        ariaLabel="Steg-for-steg-varianter"
      />
      <StepByStep steps={variants[active].steps} />
    </div>
  );
}
