import { Fragment, type ReactNode } from "react";
import {
  buildAliasIndex,
  findGlossaryLinks,
  type GlossaryAlias,
} from "@/data/glossary-link";
import type { GlossaryTerm } from "@/data/schema";
import { useGlossaryPopup } from "./GlossaryPopup";

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
  paragraphClass = "m-0 font-serif text-base leading-relaxed text-ink",
  listItemClass = "font-serif text-base leading-relaxed text-ink",
}: ProseProps) {
  const popup = useGlossaryPopup();
  const aliases =
    glossary && popup ? buildAliasIndexCached(glossary) : undefined;

  const blocks = parseBlocks(body);

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.kind === "list") {
          return (
            <ul key={i} className="m-0 list-disc space-y-1.5 pl-6">
              {block.items.map((item, j) => (
                <li key={j} className={listItemClass}>
                  {renderInline(item, aliases, popup?.openTerm)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "ordered") {
          return (
            <ol key={i} className="m-0 list-decimal space-y-1.5 pl-6">
              {block.items.map((item, j) => (
                <li key={j} className={listItemClass}>
                  {renderInline(item, aliases, popup?.openTerm)}
                </li>
              ))}
            </ol>
          );
        }
        if (block.kind === "rule") {
          return <hr key={i} className="my-2 border-t border-line" />;
        }
        return (
          <p key={i} className={paragraphClass}>
            {renderInline(block.text, aliases, popup?.openTerm)}
          </p>
        );
      })}
    </div>
  );
}

// ---- Block parser -----------------------------------------------------

interface ParagraphBlock { kind: "paragraph"; text: string }
interface ListBlock { kind: "list"; items: string[] }
interface OrderedListBlock { kind: "ordered"; items: string[] }
interface RuleBlock { kind: "rule" }
type Block = ParagraphBlock | ListBlock | OrderedListBlock | RuleBlock;

const BULLET_RE = /^\s*[-*]\s+/;
const NUMBERED_RE = /^\s*\d+\.\s+/;
const RULE_RE = /^\s*-{3,}\s*$/;

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
  | { kind: "text"; value: string };

/**
 * Tokenize an inline string into code spans, bold spans, and plain text.
 * Backticks have priority — content inside backticks is never further
 * processed (so `**inside code**` stays literal in code).
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
      } else if (bp.length > 0) {
        out.push({ kind: "text", value: bp });
      }
    }
  }
  return out;
}

function renderInline(
  text: string,
  aliases: GlossaryAlias[] | undefined,
  openTerm: ((id: string) => void) | undefined,
): ReactNode {
  const tokens = tokenizeInline(text);
  return tokens.map((tok, i) => {
    if (tok.kind === "code") {
      return (
        <code
          key={i}
          className="rounded border border-line bg-paper-2 px-1.5 py-[1px] font-mono text-[13px] text-ink"
        >
          {tok.value}
        </code>
      );
    }
    if (tok.kind === "bold") {
      return (
        <strong key={i} className="font-semibold text-ink">
          {renderTextWithLinks(tok.value, aliases, openTerm)}
        </strong>
      );
    }
    return (
      <Fragment key={i}>
        {renderTextWithLinks(tok.value, aliases, openTerm)}
      </Fragment>
    );
  });
}

function renderTextWithLinks(
  text: string,
  aliases: GlossaryAlias[] | undefined,
  openTerm: ((id: string) => void) | undefined,
): ReactNode {
  if (!aliases || !openTerm) return text;
  const segs = findGlossaryLinks(text, aliases);
  return segs.map((s, i) => {
    if (s.kind === "text") return <Fragment key={i}>{s.value}</Fragment>;
    return (
      <button
        key={i}
        type="button"
        onClick={() => openTerm(s.termId)}
        className="cursor-pointer text-primary-2 underline decoration-primary-3/60 decoration-dotted underline-offset-[3px] transition-colors hover:text-primary hover:decoration-primary"
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
