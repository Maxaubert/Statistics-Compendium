import { Fragment, type ReactNode } from "react";

export type InlineCodeTheme = "light" | "dark" | "warn";

/**
 * Render a string with `backtick`-delimited spans wrapped in <code> so
 * inline math/symbols (`Z = (X − μ)/σ`, `P(X < x)`) read as code on the
 * page rather than literal backtick characters. Plain unicode is
 * preserved as-is — KaTeX is not invoked here, the symbols are
 * already Unicode in the YAML.
 *
 * Two themes:
 *  - `light` (default) — light-grey pill on white card, used by StepByStep
 *    where the surrounding text is serif on paper.
 *  - `dark` — subtle white-tint, no border, used inside the dark calc-style
 *    DetailedSolution card where the surroundings are already monospace
 *    indigo-on-navy. The pill there is just a soft tint to mark the
 *    backticked region without competing with the text.
 */
export function renderInlineCode(
  text: string,
  theme: InlineCodeTheme = "light",
): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className={CODE_CLASS[theme]}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const CODE_CLASS: Record<InlineCodeTheme, string> = {
  // Light: distinct pill against a serif/paper background.
  light:
    "rounded border border-line bg-paper-2 px-1.5 py-[1px] font-mono text-[13px] text-ink",
  // Dark: faint white tint on the indigo calc-card. No border. Inherits
  // the surrounding mono text color so the contrast is gentle, not loud.
  dark:
    "rounded bg-white/[0.06] px-1 py-[1px] font-mono text-[inherit]",
  // Warn: amber-tinted pill that reads on the warn-soft (yellow) background
  // used by "IKKE bruk når" cues. Slightly darker amber than the cue bg to
  // pop visibly while staying in the same hue family.
  warn:
    "rounded border border-amber-400/70 bg-amber-200 px-1.5 py-[1px] font-mono text-[13px] text-amber-900",
};
