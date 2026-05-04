import { Fragment, type ReactNode } from "react";

/**
 * Render a string with `backtick`-delimited spans wrapped in <code> so
 * inline math/symbols (`Z = (X − μ)/σ`, `P(X < x)`) read as code on the
 * page rather than literal backtick characters. Plain unicode is
 * preserved as-is — KaTeX is not invoked here, the symbols are
 * already Unicode in the YAML.
 *
 * Shared between StepByStep and DetailedSolution so the typography
 * stays consistent across the two paired sections on the entry page.
 */
export function renderInlineCode(text: string): ReactNode {
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
