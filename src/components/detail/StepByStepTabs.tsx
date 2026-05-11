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
  /** Controlled active index. If omitted the component manages its own state. */
  active?: number;
  /** Called when the user clicks a tab. Required if `active` is provided. */
  onSelect?: (i: number) => void;
}

/**
 * Tabbed step-by-step. Each variant gets its own list of steps so a
 * single entry can document several common problem shapes (e.g. for
 * normalfordeling: P(X<x), P(a<X<b), invers) without flattening them
 * into one generic procedure.
 *
 * Falls back to plain `StepByStep` rendering for the active variant
 * — same styling as the existing single-list version.
 *
 * The active tab can be controlled by the parent (used by EntryDetail
 * to keep this tab strip in sync with the detailed-solution tabs);
 * if no controlled props are passed it falls back to internal state.
 */
export function StepByStepTabs({
  variants,
  active: controlledActive,
  onSelect: controlledOnSelect,
}: StepByStepTabsProps) {
  const [internalActive, setInternalActive] = useState(0);
  const isControlled = controlledActive !== undefined;
  const active = isControlled ? controlledActive : internalActive;
  const onSelect = isControlled
    ? (controlledOnSelect ?? (() => {}))
    : setInternalActive;

  if (variants.length === 0) return null;
  if (variants.length === 1) {
    return <StepByStep steps={variants[0].steps} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <VariantTabBar
        labels={variants.map((v) => v.label)}
        active={active}
        onSelect={onSelect}
        ariaLabel="Steg-for-steg-varianter"
      />
      <StepByStep steps={variants[active].steps} />
    </div>
  );
}
