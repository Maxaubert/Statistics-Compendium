import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

export type InlineCodeTheme = "light" | "dark" | "warn" | "step" | "example";

/**
 * Render a string with five flavors of inline markdown:
 *   - `backtick`-delimited spans → <code> pill
 *   - **bold** → <strong> (can wrap code, links, and auto-links)
 *   - [label](href) → router <Link>
 *   - tabell E.1 … E.6 → auto-linked to the corresponding /table/EX-... page
 *
 * Bold is parsed at the OUTER level so `**foo \`bar\` baz**` correctly
 * produces a bold span containing a code pill. Within each bold or
 * non-bold segment we then split on backtick code spans, links, and
 * table-ref auto-links.
 *
 * Plain unicode is preserved as-is — KaTeX is not invoked here, the symbols
 * are already Unicode in the YAML.
 */
export function renderInlineCode(
  text: string,
  theme: InlineCodeTheme = "light",
): ReactNode {
  const out: ReactNode[] = [];
  const ctx = { key: 0 };
  pushBoldThenInner(text, theme, out, ctx);
  return out;
}

/** Walk a text segment, peeling off **bold** pairs at the outer level
 *  so they can wrap inline code, links, and auto-link refs. Within each
 *  bold and non-bold segment, split on backtick code spans next. */
function pushBoldThenInner(
  text: string,
  theme: InlineCodeTheme,
  out: ReactNode[],
  ctx: { key: number },
) {
  let cursor = 0;
  BOLD_RE.lastIndex = 0;
  let hit: RegExpExecArray | null;
  while ((hit = BOLD_RE.exec(text)) !== null) {
    if (hit.index > cursor) {
      pushCodeLinksAndTableRefs(text.slice(cursor, hit.index), theme, out, ctx);
    }
    const innerOut: ReactNode[] = [];
    pushCodeLinksAndTableRefs(hit[1], theme, innerOut, ctx);
    out.push(<strong key={ctx.key++}>{innerOut}</strong>);
    cursor = hit.index + hit[0].length;
  }
  if (cursor < text.length) {
    pushCodeLinksAndTableRefs(text.slice(cursor), theme, out, ctx);
  }
}

/** Split a chunk on backtick code spans, then process links / table-refs
 *  in the remaining non-code text. Used inside both bold and non-bold. */
function pushCodeLinksAndTableRefs(
  text: string,
  theme: InlineCodeTheme,
  out: ReactNode[],
  ctx: { key: number },
) {
  const codeParts = text.split(/(`[^`]+`)/g);
  for (const part of codeParts) {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      out.push(
        <code key={ctx.key++} className={CODE_CLASS[theme]}>
          {renderCombiningMarks(part.slice(1, -1))}
        </code>,
      );
      continue;
    }
    if (part.length === 0) continue;
    pushLinksAndTableRefs(part, theme, out, ctx);
  }
}

function pushLinksAndTableRefs(
  text: string,
  theme: InlineCodeTheme,
  out: ReactNode[],
  ctx: { key: number },
) {
  for (const node of renderLinksAndTableRefs(text, theme, ctx)) {
    out.push(node);
  }
}

/** Within a plain (non-bold, non-code) text fragment, emit explicit
 *  `[label](href)` links and auto-link `tabell E.1` … `tabell E.6`
 *  references to their respective /table/... routes. */
function renderLinksAndTableRefs(
  text: string,
  theme: InlineCodeTheme,
  ctx: { key: number },
): ReactNode[] {
  const out: ReactNode[] = [];
  let cursor = 0;
  COMBINED_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = COMBINED_RE.exec(text)) !== null) {
    if (m.index > cursor) {
      out.push(
        <Fragment key={ctx.key++}>
          {renderCombiningMarks(text.slice(cursor, m.index))}
        </Fragment>,
      );
    }
    if (m[3]) {
      // tabell E.X auto-link
      const tableId = TABLE_ID_BY_NUM[m[3]];
      out.push(
        <Link
          key={ctx.key++}
          to={`/table/${tableId}`}
          className={LINK_CLASS[theme]}
        >
          {m[0]}
        </Link>,
      );
    } else if (m[1] && m[2]) {
      // explicit [label](href) link
      out.push(
        <Link
          key={ctx.key++}
          to={m[2]}
          className={LINK_CLASS[theme]}
        >
          {renderCombiningMarks(m[1])}
        </Link>,
      );
    }
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) {
    out.push(
      <Fragment key={ctx.key++}>
        {renderCombiningMarks(text.slice(cursor))}
      </Fragment>,
    );
  }
  return out;
}

const BOLD_RE = /\*\*([^*]+)\*\*/g;
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
// Combined: explicit link OR `tabell E.<digit>`
const COMBINED_RE =
  /\[([^\]]+)\]\(([^)\s]+)\)|tabell\s+E\.([1-8])\b/gi;

const TABLE_ID_BY_NUM: Record<string, string> = {
  "1": "E1-binomial-kumulativ",
  "2": "E2-poisson-kumulativ",
  "3": "E3-z-tabell",
  "4": "E4-z-kvantiltabell",
  "5": "E5-t-tabell",
  "6": "E6-kjikvadrattabell",
  "7": "E7-mann-whitney-u-tabell",
  "8": "E8-f-tabell",
};

void LINK_RE; // kept for grep continuity; logic now lives in COMBINED_RE

/**
 * Combining diacritics used in statistical notation render badly in
 * JetBrains Mono on Windows — the zero-width mark squashes against
 * the next character (estimator hats: λ̂, μ̂, σ̂, p̂, β̂) or
 * disappears entirely / displaces to the right (mean bars: x̄, X̄;
 * overlines: A̅, B̅). Cambria Math composes the base+mark pair
 * correctly, so we splice in a math-font span around each affected
 * pair.
 *
 * Marks handled:
 *   U+0302 COMBINING CIRCUMFLEX ACCENT  (̂)
 *   U+0304 COMBINING MACRON             (̄)
 *   U+0305 COMBINING OVERLINE           (̅)
 */
const COMBINING_MARK = /[̂̄̅]/;
const COMBINING_MARK_PAIR_RE = /[^\n][̂̄̅]/g;
export function renderCombiningMarks(text: string): ReactNode {
  if (!COMBINING_MARK.test(text)) return text;
  const out: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  COMBINING_MARK_PAIR_RE.lastIndex = 0;
  while ((m = COMBINING_MARK_PAIR_RE.exec(text)) !== null) {
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
  // Step: indigo-tinted pill that lifts above the primary-soft step
  // card AND the primary-soft formula inset. Uses a 10 % indigo tint
  // so it stays visibly darker than either parent surface.
  step:
    "rounded border border-primary-2/30 bg-primary-2/[0.10] px-1.5 py-[1px] font-mono text-[13px] text-ink",
  // Example: emerald-tinted pill that lifts above the emerald-50 example-step
  // card and the emerald-100 formula inset. Emerald reads as "computed /
  // worked numeric instance" and sits far from both indigo (primary) and
  // amber (warning), giving the three step categories maximum separation.
  example:
    "rounded border border-emerald-500/30 bg-emerald-100/60 px-1.5 py-[1px] font-mono text-[13px] text-emerald-900",
};

const LINK_CLASS: Record<InlineCodeTheme, string> = {
  light:
    "text-inherit underline decoration-primary-3/70 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary",
  dark:
    "text-inherit underline decoration-white/50 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white",
  warn:
    "text-amber-900 underline decoration-amber-700/60 underline-offset-[3px] transition-colors hover:decoration-amber-900",
  step:
    "text-inherit underline decoration-primary-3/70 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary",
  example:
    "text-inherit underline decoration-emerald-600/70 underline-offset-[3px] transition-colors hover:text-emerald-800 hover:decoration-emerald-800",
};
