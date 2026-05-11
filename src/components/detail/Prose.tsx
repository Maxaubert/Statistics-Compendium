import { Fragment, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  buildAliasIndex,
  findGlossaryLinks,
  type GlossaryAlias,
  type LinkedSegment,
  type LinkSegment,
} from "@/data/glossary-link";
import type { GlossaryTerm } from "@/data/schema";
import { useGlossaryPopup } from "./GlossaryPopup";
import { renderCombiningMarks } from "./inline-code";

export type ProseTheme = "light" | "dark";

export interface ProseProps {
  body: string;
  /**
   * If provided AND a GlossaryPopupProvider is mounted above us, technical
   * terms in the prose are auto-linked to glossary popups. Pass the full
   * glossary array; the renderer builds its own alias index.
   */
  glossary?: GlossaryTerm[];
  /** Tailwind classes applied to each rendered paragraph. */
  paragraphClass?: string;
  /** Tailwind classes applied to bullet list items. */
  listItemClass?: string;
  /**
   * Visual theme for inline elements (code pills, bold, links). Default
   * "light" matches the paper-themed entry detail page; "dark" matches
   * the indigo calc-card popup background.
   */
  theme?: ProseTheme;
}

/**
 * Light markdown renderer for our YAML prose blocks. Supports:
 *   - Paragraphs separated by blank lines (single newlines collapse to spaces)
 *   - Bullet lists (`-` or `*` at line start, optional indented continuations)
 *   - Inline `**bold**` and `` `code` ``
 *
 * If `glossary` is provided AND a `GlossaryPopupProvider` is mounted above
 * the component, plain-text segments are scanned for glossary aliases and
 * rendered as wiki-style underlined buttons that open the term popup.
 */
export function Prose({
  body,
  glossary,
  paragraphClass,
  listItemClass,
  theme = "light",
}: ProseProps) {
  const popup = useGlossaryPopup();
  const aliases =
    glossary && popup ? buildAliasIndexCached(glossary) : undefined;

  const blocks = parseBlocks(body);

  const pClass = paragraphClass ?? DEFAULT_PARAGRAPH_CLASS[theme];
  const liClass = listItemClass ?? DEFAULT_LIST_ITEM_CLASS[theme];
  const ruleClass = RULE_CLASS[theme];

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        if (block.kind === "list") {
          return (
            <ul key={i} className="m-0 list-disc space-y-1.5 pl-6">
              {block.items.map((item, j) => (
                <li key={j} className={liClass}>
                  {renderInline(item, aliases, popup?.openTerm, theme)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "ordered") {
          return (
            <ol key={i} className="m-0 list-decimal space-y-1.5 pl-6">
              {block.items.map((item, j) => (
                <li key={j} className={liClass}>
                  {renderInline(item, aliases, popup?.openTerm, theme)}
                </li>
              ))}
            </ol>
          );
        }
        if (block.kind === "rule") {
          return <hr key={i} className={ruleClass} />;
        }
        if (block.kind === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={i} className={HEADING_CLASS[theme][block.level]}>
              {renderInline(block.text, aliases, popup?.openTerm, theme)}
            </Tag>
          );
        }
        if (block.kind === "code_block") {
          return (
            <pre key={i} className={CODE_BLOCK_CLASS[theme]}>
              {block.lines.join("\n")}
            </pre>
          );
        }
        if (block.kind === "callout") {
          const config = CALLOUT_CONFIG[block.variant] ?? CALLOUT_CONFIG.note;
          // For [!read] callouts, the first content line is the formula
          // (rendered in its own highlighted box with a "FORMEL" label),
          // and the remaining lines are the spoken reading under a
          // "LESES SOM" label. For other variants, all lines render as
          // regular prose under the variant label.
          const isRead = block.variant === "read";
          const formulaLine = isRead && block.lines.length > 0 ? block.lines[0] : null;
          const proseLines = isRead && block.lines.length > 0 ? block.lines.slice(1) : block.lines;
          return (
            <div
              key={i}
              className="rounded-md border-l-2 px-3 py-2.5"
              style={{
                borderColor: config.accent,
                background: config.bg[theme],
                color: theme === "dark" ? "var(--color-calc-text)" : undefined,
              }}
            >
              {isRead && formulaLine ? (
                <>
                  <div
                    aria-hidden
                    className="mb-1 select-none font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: config.accent }}
                  >
                    Formel
                  </div>
                  <pre
                    className={`m-0 mb-2.5 overflow-x-auto whitespace-pre-wrap break-words rounded px-2.5 py-1.5 font-mono text-[15px] leading-snug ${
                      theme === "dark"
                        ? "bg-white/[0.06] text-white"
                        : "border border-line bg-paper-2 text-ink"
                    }`}
                  >
                    {formulaLine}
                  </pre>
                  <div
                    aria-hidden
                    className="mb-1 select-none font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: config.accent }}
                  >
                    {config.label}
                  </div>
                </>
              ) : (
                <div
                  aria-hidden
                  className="mb-1.5 select-none font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: config.accent }}
                >
                  {config.label}
                </div>
              )}
              {proseLines.length > 0 && (
                <div className="space-y-1 text-[13.5px] leading-relaxed">
                  {proseLines.map((line, li) => (
                    <div key={li}>
                      {renderInline(line, aliases, popup?.openTerm, theme)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          <p key={i} className={pClass}>
            {renderInline(block.text, aliases, popup?.openTerm, theme)}
          </p>
        );
      })}
    </div>
  );
}

const DEFAULT_PARAGRAPH_CLASS: Record<ProseTheme, string> = {
  light: "m-0 font-serif text-base leading-relaxed text-ink",
  dark: "m-0 text-[14px] leading-relaxed",
};
const DEFAULT_LIST_ITEM_CLASS: Record<ProseTheme, string> = {
  light: "font-serif text-base leading-relaxed text-ink",
  dark: "text-[14px] leading-relaxed",
};
const RULE_CLASS: Record<ProseTheme, string> = {
  light: "my-2 border-t border-line",
  dark: "my-2 border-t border-white/10",
};
const CODE_BLOCK_CLASS: Record<ProseTheme, string> = {
  light:
    "m-0 overflow-x-auto rounded-md border border-line bg-paper-2 px-4 py-3 font-mono text-[13.5px] leading-relaxed text-ink",
  dark:
    "m-0 overflow-x-auto rounded-md bg-white/[0.05] px-4 py-3 font-mono text-[13.5px] leading-relaxed text-[inherit]",
};
interface CalloutConfig {
  label: string;
  accent: string;
  bg: Record<ProseTheme, string>;
}
const CALLOUT_CONFIG: Record<string, CalloutConfig> = {
  read: {
    label: "Leses som",
    accent: "var(--color-cyan-2)",
    bg: {
      light: "rgba(34, 211, 238, 0.10)",
      dark: "rgba(34, 211, 238, 0.08)",
    },
  },
  note: {
    label: "Merk",
    accent: "var(--color-cyan-2)",
    bg: {
      light: "rgba(34, 211, 238, 0.10)",
      dark: "rgba(34, 211, 238, 0.08)",
    },
  },
  tip: {
    label: "Tips",
    accent: "var(--color-cyan-2)",
    bg: {
      light: "rgba(34, 211, 238, 0.10)",
      dark: "rgba(34, 211, 238, 0.08)",
    },
  },
};

const HEADING_CLASS: Record<ProseTheme, Record<2 | 3, string>> = {
  light: {
    2: "mt-7 mb-2 font-serif text-[22px] font-semibold leading-tight text-ink",
    3: "mt-5 mb-1.5 font-serif text-[17px] font-semibold leading-tight text-ink",
  },
  dark: {
    2: "mt-7 mb-2 font-serif text-[22px] font-semibold leading-tight text-white",
    3: "mt-5 mb-1.5 font-serif text-[17px] font-semibold leading-tight text-white",
  },
};

// ---- Block parser -----------------------------------------------------

interface ParagraphBlock { kind: "paragraph"; text: string }
interface ListBlock { kind: "list"; items: string[] }
interface OrderedListBlock { kind: "ordered"; items: string[] }
interface RuleBlock { kind: "rule" }
interface CodeBlock { kind: "code_block"; lines: string[] }
interface HeadingBlock { kind: "heading"; level: 2 | 3; text: string }
interface CalloutBlock { kind: "callout"; variant: string; lines: string[] }
type Block =
  | ParagraphBlock
  | ListBlock
  | OrderedListBlock
  | RuleBlock
  | CodeBlock
  | HeadingBlock
  | CalloutBlock;

const BULLET_RE = /^\s*[-*]\s+/;
const NUMBERED_RE = /^\s*\d+\.\s+/;
const RULE_RE = /^\s*-{3,}\s*$/;
const INDENTED_CODE_RE = /^(?: {4}|\t)(.*)$/;
const HEADING_RE = /^(##|###)\s+(.+)$/;
const CALLOUT_OPEN_RE = /^>\s*\[!(\w+)\]\s*(.*)$/;
const CALLOUT_CONT_RE = /^>\s?(.*)$/;

function parseBlocks(body: string): Block[] {
  // Normalize line endings, then split on blank lines into raw blocks.
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() === "") {
      i++;
      continue;
    }
    if (RULE_RE.test(lines[i])) {
      blocks.push({ kind: "rule" });
      i++;
      continue;
    }
    const headingMatch = lines[i].match(HEADING_RE);
    if (headingMatch) {
      blocks.push({
        kind: "heading",
        level: headingMatch[1].length === 2 ? 2 : 3,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }
    // Callout block: blockquote with a [!variant] tag on the first line.
    // Subsequent `> ...` lines are part of the same callout. Blank line
    // ends it. Used for "Leses som"-style read-aloud boxes.
    const calloutOpen = lines[i].match(CALLOUT_OPEN_RE);
    if (calloutOpen) {
      const variant = calloutOpen[1].toLowerCase();
      const calloutLines: string[] = [];
      const firstLine = calloutOpen[2].trim();
      if (firstLine) calloutLines.push(firstLine);
      i++;
      while (i < lines.length && lines[i].trim() !== "") {
        const cont = lines[i].match(CALLOUT_CONT_RE);
        if (!cont) break;
        calloutLines.push(cont[1].trim());
        i++;
      }
      blocks.push({ kind: "callout", variant, lines: calloutLines });
      continue;
    }
    // Indented code block: 4+ spaces or tab at start. Standard markdown
    // convention for display formulas. Multiple consecutive indented
    // lines collapse into one block; blank line ends it.
    const codeMatch = lines[i].match(INDENTED_CODE_RE);
    if (codeMatch) {
      const codeLines: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(INDENTED_CODE_RE);
        if (m) {
          codeLines.push(m[1]);
          i++;
          continue;
        }
        if (lines[i].trim() === "") {
          // Lookahead: if next non-blank line is also indented, keep as same block
          let j = i + 1;
          while (j < lines.length && lines[j].trim() === "") j++;
          if (j < lines.length && INDENTED_CODE_RE.test(lines[j])) {
            codeLines.push("");
            i = j;
            continue;
          }
        }
        break;
      }
      blocks.push({ kind: "code_block", lines: codeLines });
      continue;
    }
    if (BULLET_RE.test(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !RULE_RE.test(lines[i]) && !HEADING_RE.test(lines[i])) {
        if (BULLET_RE.test(lines[i])) {
          items.push(lines[i].replace(BULLET_RE, "").trim());
        } else if (NUMBERED_RE.test(lines[i])) {
          break; // switch from bullet to numbered list
        } else {
          // Continuation line for the previous bullet.
          if (items.length > 0) items[items.length - 1] += " " + lines[i].trim();
        }
        i++;
      }
      blocks.push({ kind: "list", items });
      continue;
    }
    if (NUMBERED_RE.test(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !RULE_RE.test(lines[i]) && !HEADING_RE.test(lines[i])) {
        if (NUMBERED_RE.test(lines[i])) {
          items.push(lines[i].replace(NUMBERED_RE, "").trim());
        } else if (BULLET_RE.test(lines[i])) {
          break; // switch from numbered to bullet list
        } else {
          if (items.length > 0) items[items.length - 1] += " " + lines[i].trim();
        }
        i++;
      }
      blocks.push({ kind: "ordered", items });
      continue;
    }
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !BULLET_RE.test(lines[i]) &&
      !NUMBERED_RE.test(lines[i]) &&
      !RULE_RE.test(lines[i]) &&
      !HEADING_RE.test(lines[i])
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: "paragraph", text: paraLines.join(" ") });
  }
  return blocks;
}

// ---- Inline parser ----------------------------------------------------

type Token =
  | { kind: "code"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "italic"; value: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "text"; value: string };

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Tokenize an inline string into code spans, bold spans, italic spans,
 * markdown links, and plain text. Backticks have priority: content
 * inside backticks is never further processed (so `**inside code**`
 * stays literal in code). Then `[label](href)` markdown links are split
 * out before bold/italic so link targets don't get parsed as emphasis.
 */
function tokenizeInline(text: string): Token[] {
  const out: Token[] = [];
  const codeParts = text.split(/(`[^`]+`)/g);
  for (const part of codeParts) {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      out.push({ kind: "code", value: part.slice(1, -1) });
      continue;
    }
    if (part.length === 0) continue;
    // Pull out [label](href) link tokens before bold/italic so the link
    // target's parens etc. don't fight with emphasis parsing.
    let cursor = 0;
    LINK_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = LINK_RE.exec(part)) !== null) {
      if (match.index > cursor) {
        emitNonLink(part.slice(cursor, match.index), out);
      }
      out.push({ kind: "link", label: match[1], href: match[2] });
      cursor = match.index + match[0].length;
    }
    if (cursor < part.length) {
      emitNonLink(part.slice(cursor), out);
    }
  }
  return out;
}

/**
 * Tokenize a chunk that has already been peeled of backticks and links.
 * Splits on bold, then italic.
 */
function emitNonLink(chunk: string, out: Token[]) {
  if (chunk.length === 0) return;
  const boldParts = chunk.split(/(\*\*[^*]+\*\*)/g);
  for (const bp of boldParts) {
    if (bp.length >= 4 && bp.startsWith("**") && bp.endsWith("**")) {
      out.push({ kind: "bold", value: bp.slice(2, -2) });
      continue;
    }
    if (bp.length === 0) continue;
    const italicParts = bp.split(/(\*[^*]+\*)/g);
    for (const ip of italicParts) {
      if (ip.length >= 2 && ip.startsWith("*") && ip.endsWith("*")) {
        out.push({ kind: "italic", value: ip.slice(1, -1) });
      } else if (ip.length > 0) {
        out.push({ kind: "text", value: ip });
      }
    }
  }
}

function renderInline(
  text: string,
  aliases: GlossaryAlias[] | undefined,
  openTerm: ((id: string) => void) | undefined,
  theme: ProseTheme,
): ReactNode {
  const tokens = tokenizeInline(text);
  return tokens.map((tok, i) => {
    if (tok.kind === "code") {
      return (
        <code key={i} className={CODE_CLASS[theme]}>
          {renderCombiningMarks(tok.value)}
        </code>
      );
    }
    if (tok.kind === "bold") {
      return (
        <strong key={i} className={BOLD_CLASS[theme]}>
          {renderTextWithLinks(tok.value, aliases, openTerm, theme)}
        </strong>
      );
    }
    if (tok.kind === "italic") {
      return (
        <em key={i} className="italic">
          {renderTextWithLinks(tok.value, aliases, openTerm, theme)}
        </em>
      );
    }
    if (tok.kind === "link") {
      // Special protocol: [label](glossary:term-id) opens the popup for
      // that glossary id instead of routing. Useful in headings where
      // we want a click to surface the term definition without leaving
      // the page.
      if (tok.href.startsWith("glossary:")) {
        const termId = tok.href.slice("glossary:".length);
        return (
          <Fragment key={i}>
            <button
              type="button"
              onClick={() => openTerm?.(termId)}
              className={MD_LINK_CLASS[theme]}
            >
              {tok.label}
            </button>
            <LinkTypeBadge kind="ordliste" theme={theme} />
          </Fragment>
        );
      }
      return (
        <Fragment key={i}>
          <RouterLink to={tok.href} className={MD_LINK_CLASS[theme]}>
            {tok.label}
          </RouterLink>
          <LinkTypeBadge kind={typeBadgeForHref(tok.href)} theme={theme} />
        </Fragment>
      );
    }
    return (
      <Fragment key={i}>
        {renderTextWithLinks(tok.value, aliases, openTerm, theme)}
      </Fragment>
    );
  });
}

const CODE_CLASS: Record<ProseTheme, string> = {
  light:
    "rounded border border-line bg-paper-2 px-1.5 py-[1px] font-mono text-[13px] text-ink",
  dark:
    "rounded bg-white/[0.08] px-1.5 py-[1px] font-mono text-[12.5px] text-[inherit]",
};
const BOLD_CLASS: Record<ProseTheme, string> = {
  light: "font-semibold text-ink",
  dark: "font-semibold text-white",
};
const LINK_CLASS: Record<ProseTheme, string> = {
  // Text stays the surrounding ink color; only the dotted underline marks
  // it as a clickable link. Hover surfaces the primary accent for feedback.
  light:
    "cursor-pointer bg-transparent text-inherit underline decoration-ink-3/60 decoration-dotted underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary",
  dark:
    "cursor-pointer bg-transparent text-inherit underline decoration-dotted decoration-white/40 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white",
};
// Markdown links use the same hover-driven affordance, but with a SOLID underline so
// they read as "navigates to a page" rather than "opens a popup" (which is
// what the dotted glossary links do).
const MD_LINK_CLASS: Record<ProseTheme, string> = {
  light:
    "text-inherit underline decoration-primary-3/70 underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary",
  dark:
    "text-inherit underline decoration-white/50 underline-offset-[3px] transition-colors hover:text-white hover:decoration-white",
};

// Small badge shown after explicit markdown links so the user can tell
// at a glance whether the link goes to a full entry, a popup term, etc.
type LinkKind = "formel" | "ordliste" | "tabell" | "mønster" | null;

function typeBadgeForHref(href: string): LinkKind {
  if (href.startsWith("/entry/")) return "formel";
  if (href.startsWith("/table/")) return "tabell";
  if (href.startsWith("/monstre/")) return "mønster";
  return null;
}

function LinkTypeBadge({
  kind,
  theme,
}: {
  kind: LinkKind;
  theme: ProseTheme;
}) {
  if (!kind) return null;
  return (
    <span
      aria-hidden
      className={
        theme === "dark"
          ? "ml-1 inline-block whitespace-nowrap rounded bg-white/10 px-1 py-px font-mono text-[10px] font-medium leading-tight text-white/60"
          : "ml-1 inline-block whitespace-nowrap rounded bg-paper-2 px-1 py-px font-mono text-[10px] font-medium leading-tight text-ink-3"
      }
    >
      ({kind})
    </span>
  );
}

/**
 * When the same term gets matched twice in one chunk (e.g. `ν` and
 * `frihetsgrader` both pointing at frihetsgrader-glos in "ν = n - 1
 * frihetsgrader"), demote the shorter occurrences to plain text. The
 * longest surface form wins because it's the most readable link target.
 */
function preferLongest(segments: LinkedSegment[]): LinkedSegment[] {
  const byTerm = new Map<string, LinkSegment[]>();
  for (const s of segments) {
    if (s.kind === "link") {
      const arr = byTerm.get(s.termId);
      if (arr) arr.push(s);
      else byTerm.set(s.termId, [s]);
    }
  }
  const demote = new Set<LinkSegment>();
  for (const arr of byTerm.values()) {
    if (arr.length <= 1) continue;
    const maxLen = Math.max(...arr.map((s) => s.value.length));
    for (const s of arr) if (s.value.length < maxLen) demote.add(s);
  }
  if (demote.size === 0) return segments;
  const out: LinkedSegment[] = [];
  for (const s of segments) {
    const piece: LinkedSegment =
      s.kind === "link" && demote.has(s) ? { kind: "text", value: s.value } : s;
    const last = out[out.length - 1];
    if (last && last.kind === "text" && piece.kind === "text") {
      last.value += piece.value;
    } else {
      out.push(piece);
    }
  }
  return out;
}

function renderTextWithLinks(
  text: string,
  aliases: GlossaryAlias[] | undefined,
  openTerm: ((id: string) => void) | undefined,
  theme: ProseTheme,
): ReactNode {
  if (!aliases || !openTerm) return renderCombiningMarks(text);
  const segs = preferLongest(findGlossaryLinks(text, aliases));
  return segs.map((s, i) => {
    if (s.kind === "text")
      return <Fragment key={i}>{renderCombiningMarks(s.value)}</Fragment>;
    return (
      <button
        key={i}
        type="button"
        onClick={() => openTerm(s.termId)}
        className={LINK_CLASS[theme]}
      >
        {renderCombiningMarks(s.value)}
      </button>
    );
  });
}

// ---- Alias caching ----------------------------------------------------

let cachedGlossary: GlossaryTerm[] | null = null;
let cachedAliases: GlossaryAlias[] | null = null;

function buildAliasIndexCached(glossary: GlossaryTerm[]): GlossaryAlias[] {
  if (cachedGlossary === glossary && cachedAliases) return cachedAliases;
  cachedAliases = buildAliasIndex(glossary);
  cachedGlossary = glossary;
  return cachedAliases;
}
