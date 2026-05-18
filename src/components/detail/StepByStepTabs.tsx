import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { StepByStep, type StepItem } from "./StepByStep";
import { VariantTabBar } from "./VariantTabBar";
import { renderInlineCode } from "./inline-code";

export interface StepVariant {
  /** Label shown on the tab — short, scannable. */
  label: string;
  /** Optional one-liner describing the typical exam phrasing for this variant. */
  recognition?: string;
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
    return (
      <div className="flex flex-col gap-4">
        {variants[0].recognition && (
          <RecognitionBanner text={variants[0].recognition} />
        )}
        <StepByStep steps={variants[0].steps} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <VariantTabBar
        labels={variants.map((v) => v.label)}
        active={active}
        onSelect={onSelect}
        ariaLabel="Steg-for-steg-varianter"
      />
      {variants[active].recognition && (
        <RecognitionBanner text={variants[active].recognition} />
      )}
      <StepByStep steps={variants[active].steps} />
    </div>
  );
}

/**
 * Sky-blue banner that sits above the steps and shows the typical exam
 * phrasing for the active variant. Distinct from the indigo step rail,
 * the amber "Pass på" cards, and the emerald "Eksempel" cards so users
 * can scan the tabs and immediately recognise which one matches their
 * problem without reading every step.
 */
export function RecognitionBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-sky-300/60 bg-sky-50/70 px-4 py-3">
      <HelpCircle
        size={18}
        strokeWidth={2.2}
        className="mt-0.5 shrink-0 text-sky-700"
        aria-hidden
      />
      <div>
        <div className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          Typisk oppgave
        </div>
        <div className="font-serif text-[14.5px] leading-relaxed text-ink-2">
          {renderInlineCode(text, "step")}
        </div>
      </div>
    </div>
  );
}
