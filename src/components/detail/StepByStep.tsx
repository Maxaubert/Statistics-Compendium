import { clsx } from "clsx";
import { renderInlineCode } from "./inline-code";

export type StepItem = string | { text: string; conditional?: boolean };

function normalize(item: StepItem): { text: string; conditional: boolean } {
  if (typeof item === "string") return { text: item, conditional: false };
  return { text: item.text, conditional: !!item.conditional };
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
