import { clsx } from "clsx";
import { AlertTriangle } from "lucide-react";
import { renderInlineCode } from "./inline-code";

export type StepItem =
  | string
  | { text: string; conditional?: boolean; formula?: string };

function normalize(item: StepItem): {
  text: string;
  conditional: boolean;
  formula?: string;
} {
  if (typeof item === "string") return { text: item, conditional: false };
  return {
    text: item.text,
    conditional: !!item.conditional,
    formula: item.formula,
  };
}

/**
 * Step-by-step list rendered as a vertical timeline: indigo rail with
 * numbered node circles, each step its own bordered card hanging off
 * the rail. Conditional ("Pass på") steps are indented further right
 * with a dashed connector and a warning-triangle node, so the eye can
 * distinguish "always-do-this" steps from "watch-out" notes.
 */
export function StepByStep({ steps }: { steps: StepItem[] }) {
  const numbers = computeStepNumbers(steps);
  return (
    <ol className="relative m-0 mt-2 flex list-none flex-col gap-4 p-0 pl-14">
      <span
        aria-hidden
        className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-primary-2/30"
      />
      {steps.map((raw, i) => {
        const { text, conditional, formula } = normalize(raw);
        const stepNo = numbers[i];
        return (
          <li key={i} className="relative">
            <span
              className={clsx(
                "absolute -left-[46px] top-4 flex h-8 w-8 items-center justify-center rounded-full font-mono text-[13px] font-semibold ring-4 ring-card",
                conditional
                  ? "bg-amber-100 text-amber-700"
                  : "bg-primary-2 text-white",
              )}
            >
              {conditional ? <AlertTriangle size={14} strokeWidth={2.5} /> : stepNo}
            </span>
            <span
              aria-hidden
              className={clsx(
                "absolute top-7 h-px border-t",
                conditional
                  ? "-left-[20px] w-[52px] border-dashed border-amber-500/70"
                  : "-left-[20px] w-8 border-primary-2/30",
              )}
            />
            <div
              className={clsx(
                "glass-light-card rounded-lg px-5 py-4",
                conditional
                  ? "ml-8 border border-amber-300/70 bg-amber-50/70"
                  : "border border-line bg-primary-soft/50",
              )}
            >
              <div
                className={clsx(
                  "mb-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em]",
                  conditional ? "text-amber-700" : "text-primary-2/80",
                )}
              >
                {conditional ? "Pass på" : `Steg ${stepNo}`}
              </div>
              <div
                className={clsx(
                  "font-serif text-[14.5px] leading-relaxed",
                  conditional ? "text-ink-2" : "text-ink",
                )}
              >
                {renderInlineCode(text, "light")}
              </div>
              {formula && (
                <div
                  className="mt-3 rounded-md border border-line bg-card/70 px-4 py-2.5 font-mono text-[14px] text-ink"
                  style={{ overflowX: "auto" }}
                >
                  {renderInlineCode(formula, "light")}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Step number per row, skipping conditional ("Pass på") rows so they don't consume a count. */
function computeStepNumbers(steps: StepItem[]): (number | null)[] {
  let n = 0;
  return steps.map((s) => (normalize(s).conditional ? null : ++n));
}
