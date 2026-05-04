import { Fragment, type ReactNode } from "react";
import { clsx } from "clsx";

export type StepItem = string | { text: string; conditional?: boolean };

function normalize(item: StepItem): { text: string; conditional: boolean } {
  if (typeof item === "string") return { text: item, conditional: false };
  return { text: item.text, conditional: !!item.conditional };
}

/**
 * Render a string with `backtick`-delimited spans wrapped in <code> so
 * inline math/symbols (`Z = (X − μ)/σ`, `P(X < x)`) read as code on
 * the page rather than literal backtick characters. Plain unicode is
 * preserved as-is — we don't run KaTeX here, the symbols are already
 * Unicode in the YAML.
 */
function renderInlineCode(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded border border-line bg-paper-2 px-1.5 py-[1px] font-mono text-[13px] text-ink"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function StepByStep({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="m-0 list-none p-0 [counter-reset:step]">
      {steps.map((raw, i) => {
        const { text, conditional } = normalize(raw);
        return (
          <li
            key={i}
            className={clsx(
              "relative mb-2 rounded-lg border py-3 pl-12 pr-4 font-serif text-[14.5px] leading-relaxed [counter-increment:step]",
              "before:absolute before:left-3.5 before:top-3 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:font-mono before:text-[12px] before:font-semibold before:content-[counter(step)]",
              conditional
                ? "border-amber-300/70 border-l-[3px] border-l-amber-500 bg-amber-50/40 text-ink-2 before:bg-amber-500 before:text-white"
                : "border-line bg-card text-ink-2 before:bg-primary-2 before:text-white",
            )}
          >
            {conditional && (
              <span
                className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-amber-700"
                aria-label="conditional step"
              >
                Hvis…
              </span>
            )}
            {renderInlineCode(text)}
          </li>
        );
      })}
    </ol>
  );
}
