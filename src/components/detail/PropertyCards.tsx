import { useState } from "react";
import { clsx } from "clsx";
import { PropertyDetailModal } from "./PropertyDetailModal";
import type { PropertyExplanation } from "./property-explanations";

const LABELS: Record<string, string> = {
  expected_value: "Forventningsverdi",
  variance: "Varians",
  std_dev: "Standardavvik",
};

interface Props {
  properties: Partial<Record<keyof typeof LABELS, string>>;
  /** Optional per-property explanations — when present, that card becomes a clickable button that opens a popup. */
  explanations?: Record<string, PropertyExplanation>;
}

export function PropertyCards({ properties, explanations }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const entries = Object.entries(properties).filter(([, v]) => Boolean(v));
  if (entries.length === 0) return null;

  const openExplanation = openKey ? explanations?.[openKey] : undefined;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {entries.map(([key, value]) => {
          const explanation = explanations?.[key];
          const baseClasses =
            "rounded-lg border border-line bg-card px-4 py-3.5 text-left";
          if (explanation) {
            return (
              <button
                key={key}
                type="button"
                aria-label={`Vis utledning for ${LABELS[key]}`}
                onClick={() => setOpenKey(key)}
                className={clsx(
                  baseClasses,
                  "group relative cursor-pointer transition-colors hover:border-primary-2/60 hover:bg-paper-2/60",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-2/60",
                )}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                    {LABELS[key]}
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-2/70 opacity-0 transition-opacity group-hover:opacity-100">
                    Utled →
                  </span>
                </div>
                <div className="font-math text-lg font-medium text-ink">
                  {value}
                </div>
              </button>
            );
          }
          return (
            <div key={key} className={baseClasses}>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-3">
                {LABELS[key]}
              </div>
              <div className="font-math text-lg font-medium text-ink">
                {value}
              </div>
            </div>
          );
        })}
      </div>

      {openKey && openExplanation && (
        <PropertyDetailModal
          title={LABELS[openKey]}
          explanation={openExplanation}
          onClose={() => setOpenKey(null)}
        />
      )}
    </>
  );
}
