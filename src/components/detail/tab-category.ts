export type TabKind = "forover" | "invers" | "neutral";

export interface TabMeta {
  /** Small-caps category badge above the label, or `null` to omit. */
  tag: string | null;
  kind: TabKind;
  /** The label with the redundant category prefix removed. */
  short: string;
}

const PAREN_DIRECTION = /^(.+?)\s*\((venstre|høyre|tosidig)\)\s*$/i;

function stripDescriptiveTail(text: string): string {
  const dashSplit = text.split(/\s+[—–]\s+/);
  const head = dashSplit[0].trim();
  const parenStripped = head.replace(/\s+\([^)]+\)\s*$/, "");
  return parenStripped || head || text;
}

/**
 * Derives a short scannable label and an optional category badge from
 * a raw variant label. Used by the variant tab strips to give the
 * tabs visual hierarchy (small-caps tag over the formula) instead of
 * looking like one undifferentiated math expression.
 */
export function deriveTabMeta(label: string): TabMeta {
  const trimmed = label.trim();

  const dir = trimmed.match(PAREN_DIRECTION);
  if (dir) {
    return {
      tag: dir[2].toUpperCase(),
      kind: "forover",
      short: dir[1].trim(),
    };
  }

  if (/^Invers\b/i.test(trimmed)) {
    const after = trimmed.replace(/^Invers\s*[:\-–—]?\s*/i, "");
    const short = after
      ? after.charAt(0).toUpperCase() + after.slice(1)
      : trimmed;
    return { tag: "INVERS", kind: "invers", short };
  }

  if (/^Finn\b/i.test(trimmed)) {
    return { tag: "INVERS", kind: "invers", short: trimmed };
  }

  if (/^P\s*\(/.test(trimmed)) {
    return { tag: "FOROVER", kind: "forover", short: stripDescriptiveTail(trimmed) };
  }

  return { tag: null, kind: "neutral", short: stripDescriptiveTail(trimmed) };
}
