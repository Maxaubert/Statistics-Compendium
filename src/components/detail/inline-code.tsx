import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

export type InlineCodeTheme = "light" | "dark" | "warn";

/**
 * Render a string with three flavors of inline markdown:
 *   - `backtick`-delimited spans → <code> pill
 *   - [label](href) → router <Link> (only for `/entry/...`, `/table/...`
 *     internal paths; external/protocol-prefixed hrefs render as plain text)
 *
 * Plain unicode is preserved as-is — KaTeX is not invoked here, the symbols
 * are already Unicode in the YAML.
 *
 * Themes:
 *  - `light` (default) — light-grey pill on white card.
 *  - `dark` — subtle white-tint, no border, used inside the dark calc-style
 *    DetailedSolution card.
 *  - `warn` — amber-tinted pill for warn-soft backgrounds.
 */
export function renderInlineCode(
  text: string,
  theme: InlineCodeTheme = "light",
): ReactNode {
  // Split on backticks first; for the non-code parts, pull out [label](href)
  // links before emitting plain text.
  const codeParts = text.split(/(`[^`]+`)/g);
  const out: ReactNode[] = [];
  let key = 0;
  for (const part of codeParts) {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      out.push(
        <code key={key++} className={CODE_CLASS[theme]}>
          {renderHats(part.slice(1, -1))}
        </code>,
      );
      continue;
    }
    if (part.length === 0) continue;
    // Walk for [label](href) tokens.
    let cursor = 0;
    LINK_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = LINK_RE.exec(part)) !== null) {
      if (match.index > cursor) {
        out.push(
          <Fragment key={key++}>{part.slice(cursor, match.index)}</Fragment>,
        );
      }
      out.push(
        <Link
          key={key++}
          to={match[2]}
          className={LINK_CLASS[theme]}
        >
          {match[1]}
        </Link>,
      );
      cursor = match.index + match[0].length;
    }
    if (cursor < part.length) {
      out.push(<Fragment key={key++}>{part.slice(cursor)}</Fragment>);
    }
  }
  return out;
}

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Greek letters with U+0302 COMBINING CIRCUMFLEX ACCENT (estimator
 * notation: λ̂, μ̂, σ̂, p̂, β̂) render badly in JetBrains Mono on
 * Windows — the zero-width combining mark squashes against the next
 * character. Cambria Math composes the letter+hat pair correctly,
 * so we splice in a math-font span around each affected pair.
 *
 * The pattern matches any non-newline character followed immediately
 * by U+0302; the math font handles non-Greek letters (β̂, p̂) just
 * as well as Greek (λ̂).
 */
const HAT_RE = /[^\n]̂/g;
function renderHats(text: string): ReactNode {
  if (!text.includes("̂")) return text;
  const out: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  HAT_RE.lastIndex = 0;
  while ((m = HAT_RE.exec(text)) !== null) {
    if (m.index > cursor) out.push(text.slice(cursor, m.index));
    out.push(
      <span
        key={key++}
        style={{ fontFamily: "var(--font-math), var(--font-mono)" }}
      >
        {m[0]}
      </span>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

const CODE_CLASS: Record<InlineCodeTheme, string> = {
  // Light: distinct pill against a serif/paper background. The
  // glass-light-pill utility layers a subtle top-down highlight,
  // inset top edge and soft drop shadow over the paper-2 fill.
  light:
    "glass-light-pill rounded border border-line bg-paper-2 px-1.5 py-[1px] font-mono text-[13px] text-ink",
  // Dark: faint white tint on the indigo calc-card. No border. Inherits
  // the surrounding mono text color so the contrast is gentle, not loud.
  dark:
    "rounded bg-white/[0.06] px-1 py-[1px] font-mono text-[inherit]",
  // Warn: amber-tinted pill that reads on the warn-soft (yellow) background
  // used by "IKKE bruk når" cues. Slightly darker amber than the cue bg to
  // pop visibly while staying in the same hue family.
  warn:
    "rounded border border-amber-500/30 bg-amber-700/10 px-1.5 py-[1px] font-mono text-[13px] text-amber-900",
};

const LINK_CLASS: Record<InlineCodeTheme, string> = {
  light:
    "text-inherit underline decoration-primary-3/70 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary",
  dark:
    "text-inherit underline decoration-white/50 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white",
  warn:
    "text-amber-900 underline decoration-amber-700/60 underline-offset-[3px] transition-colors hover:decoration-amber-900",
};
