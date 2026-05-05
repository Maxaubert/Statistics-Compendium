import { Fragment, type ReactNode } from "react";
import {
  buildAliasIndex,
  findGlossaryLinks,
  type GlossaryAlias,
  type LinkedSegment,
  type LinkSegment,
} from "@/data/glossary-link";
import type { GlossaryTerm } from "@/data/schema";
import { useGlossaryPopup } from "./GlossaryPopup";

export type ProseTheme = "light" | "dark";

export interface ProseProps {
  body: string;
  /**
   * If provided AND a GlossaryPopupProvider is mounted above us, technical
   * terms in the prose are auto-linked to glossary popups. Pass the full
   * glossary array — the renderer builds its own alias index.
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
    <div className="space-y-3">
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
        if (block.kind === "code_block") {
          return (
            <pre key={i} className={CODE_BLOCK_CLASS[theme]}>
              {block.lines.join("\n")}
            </pre>
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

// ---- Block parser -----------------------------------------------------

interface ParagraphBlock { kind: "paragraph"; text: string }
interface ListBlock { kind: "list"; items: string[] }
interface OrderedListBlock { kind: "ordered"; items: string[] }
interface RuleBlock { kind: "rule" }
interface CodeBlock { kind: "code_block"; lines: string[] }
type Block = ParagraphBlock | ListBlock | OrderedListBlock | RuleBlock | CodeBlock;

const BULLET_RE = /^\s*[-*]\s+/;
const NUMBERED_RE = /^\s*\d+\.\s+/;
const RULE_RE = /^\s*-{3,}\s*$/;
const INDENTED_CODE_RE = /^(?: {4}|\t)(.*)$/;

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
      while (i < lines.length && lines[i].trim() !== "" && !RULE_RE.test(lines[i])) {
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
      while (i < lines.length && lines[i].trim() !== "" && !RULE_RE.test(lines[i])) {
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
      !RULE_RE.test(lines[i])
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
  | { kind: "text"; value: string };

/**
 * Tokenize an inline string into code spans, bold spans, italic spans,
 * and plain text. Backticks have priority — content inside backticks is
 * never further processed (so `**inside code**` stays literal in code).
 * Bold (`**...**`) is matched before italic (`*...*`) so the asterisks
 * don't fight.
 */
function tokenizeInline(text: string): Token[] {
  const out: Token[] = [];
  // First split on backticks to lock in code spans.
  const codeParts = text.split(/(`[^`]+`)/g);
  for (const part of codeParts) {
    if (part.length >= 2 && part.startsWith("`") && part.endsWith("`")) {
      out.push({ kind: "code", value: part.slice(1, -1) });
      continue;
    }
    // Then split each non-code chunk on **bold**.
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    for (const bp of boldParts) {
      if (bp.length >= 4 && bp.startsWith("**") && bp.endsWith("**")) {
        out.push({ kind: "bold", value: bp.slice(2, -2) });
        continue;
      }
      if (bp.length === 0) continue;
      // Finally split on *italic* (single asterisk delimited).
      const italicParts = bp.split(/(\*[^*]+\*)/g);
      for (const ip of italicParts) {
        if (ip.length >= 2 && ip.startsWith("*") && ip.endsWith("*")) {
          out.push({ kind: "italic", value: ip.slice(1, -1) });
        } else if (ip.length > 0) {
          out.push({ kind: "text", value: ip });
        }
      }
      continue;
    }
  }
  return out;
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
          {tok.value}
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
  if (!aliases || !openTerm) return text;
  const segs = preferLongest(findGlossaryLinks(text, aliases));
  return segs.map((s, i) => {
    if (s.kind === "text") return <Fragment key={i}>{s.value}</Fragment>;
    return (
      <button
        key={i}
        type="button"
        onClick={() => openTerm(s.termId)}
        className={LINK_CLASS[theme]}
      >
        {s.value}
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
